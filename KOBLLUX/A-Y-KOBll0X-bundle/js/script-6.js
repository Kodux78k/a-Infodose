
/* [R4] KOB_STORE — guarda de cota do localStorage para kobllux:tabs e kobllux:links.
   SAFE: cache em memória + escrita adiada (debounce), dedupe/limite do histórico, GC de janelas mortas e antigas,
         retry com compactação agressiva ao estourar a cota. Nada é movido para fora do localStorage.
   HARD: o mesmo + arquivo no IndexedDB (db "kob-store") de tudo que a compactação remove e reidratação das janelas vivas.
   Console: KOB_STORE.report() · KOB_STORE.flush() · KOB_STORE.gc() · KOB_STORE.restore(winId) (hard) */
(function(W){
  "use strict";
  if(W.KOB_STORE) return;
  var HARD=/*@HARD@*/true;
  var K_TABS='kobllux:tabs', K_LINKS='kobllux:links', QUOTA=5000000;
  var C=HARD?{tabsMax:120000,tabsPerWin:40,gcDays:14,linksMax:200,urlMax:4096,titleMax:160}
            :{tabsMax:300000,tabsPerWin:80,gcDays:14,linksMax:400,urlMax:8192,titleMax:200};
  var LS=null; try{ LS=W.localStorage; }catch(e){}
  var log=function(){ try{ console.log.apply(console,['[KOB.storage]'].concat([].slice.call(arguments))); }catch(e){} };
  var tabsObj=null, linksArr=null, timer=null, dirty=false;

  /* ---------- IndexedDB mínimo (só HARD) ---------- */
  var idb={ db:null, ready:null,
    open:function(){
      if(!HARD||!W.indexedDB) return Promise.resolve(null);
      if(this.ready) return this.ready;
      var self=this;
      this.ready=new Promise(function(res){
        try{
          var rq=W.indexedDB.open('kob-store',1);
          rq.onupgradeneeded=function(){ try{ rq.result.createObjectStore('archive'); }catch(e){} };
          rq.onsuccess=function(){ self.db=rq.result; res(self.db); };
          rq.onerror=function(){ res(null); }; rq.onblocked=function(){ res(null); };
        }catch(e){ res(null); }
      });
      return this.ready;
    },
    put:function(k,v){ return this.open().then(function(db){ return new Promise(function(res){
      if(!db) return res(false);
      try{ var tx=db.transaction('archive','readwrite'); tx.objectStore('archive').put(v,k); tx.oncomplete=function(){res(true);}; tx.onerror=tx.onabort=function(){res(false);}; }catch(e){res(false);} }); }); },
    get:function(k){ return this.open().then(function(db){ return new Promise(function(res){
      if(!db) return res(null);
      try{ var r=db.transaction('archive','readonly').objectStore('archive').get(k); r.onsuccess=function(){res(r.result==null?null:r.result);}; r.onerror=function(){res(null);}; }catch(e){res(null);} }); }); },
    keys:function(){ return this.open().then(function(db){ return new Promise(function(res){
      if(!db) return res([]);
      try{ var r=db.transaction('archive','readonly').objectStore('archive').getAllKeys(); r.onsuccess=function(){res(r.result||[]);}; r.onerror=function(){res([]);}; }catch(e){res([]);} }); }); }
  };

  /* ---------- util ---------- */
  function lsGet(k){ try{ return LS?LS.getItem(k):null; }catch(e){ return null; } }
  function rawSet(k,v){ try{ LS.setItem(k,v); return true; }catch(e){ return false; } }
  function parse(s,d){ try{ var v=JSON.parse(s); return v==null?d:v; }catch(e){ return d; } }
  function schemeOf(u){ var m=/^([a-z][a-z0-9+.-]*):/i.exec(u||''); return m?m[1].toLowerCase():'?'; }
  function liveIds(){
    var s={};
    try{ [].forEach.call(W.document.querySelectorAll('[data-session-id]'),function(e){ if(e.dataset.sessionId) s[e.dataset.sessionId]=1; }); }catch(e){}
    return s;
  }
  function inMxp(id){ var t=lsGet('kobllux:mxp')||''; return !!id && t.indexOf(id)>=0; }
  function newest(d){ var t=0; try{ (d.tabs||[]).forEach(function(x){ if((x.createdAt||0)>t) t=x.createdAt; }); }catch(e){} return t; }
  function size(o){ try{ return JSON.stringify(o).length; }catch(e){ return 0; } }
  function archive(key,val){ if(HARD) idb.put(key+':'+Date.now(),{ts:Date.now(),data:val}); }

  /* ---------- LINKS ---------- */
  function compactLinks(list,aggr){
    var max=aggr?Math.max(50,C.linksMax>>1):C.linksMax, seen={}, out=[], dropped=[];
    for(var i=list.length-1;i>=0;i--){               /* do mais novo para o mais antigo: o mais novo vence */
      var e=list[i]; if(!e||typeof e.url!=='string'){ continue; }
      var sc=schemeOf(e.url);
      if(sc==='data'||sc==='javascript'||e.url.length>C.urlMax){ dropped.push(e); continue; }
      if(seen[e.url]){ seen[e.url].n=(seen[e.url].n||1)+(e.n||1); continue; }
      var c={url:e.url,title:String(e.title||e.url).slice(0,C.titleMax),ts:e.ts,sessionId:e.sessionId||null};
      if(e.n>1) c.n=e.n;
      seen[e.url]=c; out.push(c);
    }
    out.reverse();
    if(out.length>max){ dropped=dropped.concat(out.slice(0,out.length-max)); out=out.slice(out.length-max); }
    if(dropped.length) archive('links',dropped);
    return out;
  }
  var links={
    read:function(){ if(!linksArr) linksArr=parse(lsGet(K_LINKS),[]); if(!Array.isArray(linksArr)) linksArr=[]; return linksArr; },
    write:function(list){
      linksArr=compactLinks(Array.isArray(list)?list:[],false);
      var s=JSON.stringify(linksArr);
      if(!rawSet(K_LINKS,s)){ linksArr=compactLinks(linksArr,true); if(!rawSet(K_LINKS,JSON.stringify(linksArr))) full('links'); }
    }
  };

  /* ---------- TABS ---------- */
  var tabs={
    read:function(){ if(!tabsObj){ tabsObj=parse(lsGet(K_TABS),{}); if(typeof tabsObj!=='object'||Array.isArray(tabsObj)) tabsObj={}; } return tabsObj; },
    write:function(o){ tabsObj=o||{}; dirty=true; if(!timer) timer=setTimeout(flush,250); }
  };
  function snapshot(aggr,targetChars){
    var o=tabs.read(), live=liveIds(), cutoff=Date.now()-C.gcDays*86400000, snap={}, removed={}, deadIds=[];
    Object.keys(o).forEach(function(id){
      var d=o[id]; if(!d||!d.tabs) return;
      var alive=live[id]||inMxp(id);
      if(!alive && newest(d)<cutoff){ removed[id]=d; return; }          /* morta e antiga */
      var per=aggr?Math.max(10,C.tabsPerWin>>1):C.tabsPerWin, t=d.tabs;
      if(t.length>per){                                                  /* corte só no snapshot: a memória fica intacta */
        var keep=t.filter(function(x){return x.id===d.activeId;}), rest=t.filter(function(x){return x.id!==d.activeId;});
        t=keep.concat(rest.slice(Math.max(0,rest.length-(per-keep.length))));
        removed[id+'#tabs']={tabs:d.tabs}; d=Object.assign({},d,{tabs:t});
      }
      snap[id]=d; if(!alive) deadIds.push(id);
    });
    if(aggr){                                                            /* pressão: remove as mortas mais antigas até caber */
      var target=targetChars, total=size(snap);
      deadIds.sort(function(a,b){ return newest(snap[a])-newest(snap[b]); });
      while(total>target && deadIds.length){ var id=deadIds.shift(), sz=size(snap[id]); removed[id]=o[id]; delete snap[id]; total-=sz; }
    }
    return {snap:snap,removed:removed};
  }
  function flush(){
    timer=null; if(!dirty||!LS) return; dirty=false; persistCompact();
  }
  function persistCompact(){
    var r=snapshot(false), s=JSON.stringify(r.snap), ok=false;
    if(s.length<=C.tabsMax) ok=rawSet(K_TABS,s);
    if(!ok){                                              /* pressão (tamanho ou cota): alvos decrescentes, mortas mais antigas primeiro */
      var fr=[0.7,0.4,0.2,0.05];
      for(var i=0;i<fr.length&&!ok;i++){ r=snapshot(true,Math.floor(C.tabsMax*fr[i])); s=JSON.stringify(r.snap); ok=rawSet(K_TABS,s); }
    }
    if(!ok){ full('tabs'); return; }
    var n=Object.keys(r.removed).length;
    if(n){ archive('tabs',r.removed); Object.keys(r.removed).forEach(function(id){ if(id.indexOf('#tabs')<0) delete tabsObj[id]; }); log('tabs compactado →',s.length,'chars;',n,'itens removidos do localStorage'+(HARD?' (arquivados no IndexedDB)':'')); }
  }
  function full(what){ try{ W.__KOB_STORAGE_FULL__=true; W.dispatchEvent(new W.CustomEvent('kob:storage-full',{detail:{key:what}})); }catch(e){} log('cota cheia ao gravar',what); }

  /* ---------- diagnóstico ---------- */
  function report(){
    var rows=[], total=0;
    if(LS) for(var i=0;i<LS.length;i++){ var k=LS.key(i), n=(lsGet(k)||'').length; total+=n+k.length; rows.push([k,n]); }
    rows.sort(function(a,b){return b[1]-a[1];});
    var L=links.read(), sch={}, big=0, uniq={}; L.forEach(function(e){ var s=schemeOf(e.url); sch[s]=(sch[s]||0)+e.url.length; uniq[e.url]=1; if(e.url.length>big) big=e.url.length; });
    var o=tabs.read(), live=liveIds(), wins=Object.keys(o), tt=0, dead=0, topw=[];
    wins.forEach(function(id){ var d=o[id]; var n=(d&&d.tabs||[]).length; tt+=n; if(!(live[id]||inMxp(id))) dead++; topw.push([id,size(d),n]); });
    topw.sort(function(a,b){return b[1]-a[1];});
    var rep={totalChars:total,pctOfAssumed5M:Math.round(total/QUOTA*1000)/10,modo:HARD?'hard':'safe',
      top:rows.slice(0,8),links:{entradas:L.length,unicas:Object.keys(uniq).length,maiorUrl:big,charsPorEsquema:sch},
      tabs:{janelas:wins.length,vivas:wins.length-dead,mortas:dead,abasTotal:tt,maioresJanelas:topw.slice(0,5)}};
    try{ console.table(rep.top); console.log(rep); }catch(e){}
    return rep;
  }
  function gc(){ dirty=true; persistCompact(false); return report(); }
  function restore(id){
    return idb.keys().then(function(ks){ var m=ks.filter(function(k){ return k.indexOf('tabs:')===0; }); var found=null;
      return m.reduce(function(p,k){ return p.then(function(){ return idb.get(k).then(function(v){ if(v&&v.data&&v.data[id]) found=v.data[id]; }); }); },Promise.resolve()).then(function(){
        if(found&&W.TabStore){ W.TabStore.set(id,found); return true; } return false; }); });
  }
  function hydrate(){
    if(!HARD) return;
    var live=liveIds(), o=tabs.read(), miss=Object.keys(live).filter(function(id){ return !o[id]; });
    miss.forEach(function(id){ restore(id).then(function(ok){ if(ok){ try{ var w=W.document.querySelector('[data-session-id="'+id+'"]'); if(w&&W.applyTabsToWindow) W.applyTabsToWindow(w,W.TabStore.get(id)); }catch(e){} log('janela reidratada do IndexedDB:',id); } }); });
  }

  /* ---------- ciclo de vida ---------- */
  W.addEventListener('pagehide',flush);
  try{ W.document.addEventListener('visibilitychange',function(){ if(W.document.visibilityState==='hidden') flush(); }); }catch(e){}
  W.addEventListener('load',function(){ setTimeout(function(){
    try{
      if((lsGet(K_LINKS)||'').length>200000) links.write(links.read());
      if((lsGet(K_TABS)||'').length>C.tabsMax){ dirty=true; flush(); }
      hydrate();
    }catch(e){ log('boot',e); }
  },1500); });

  W.KOB_STORE={tabs:tabs,links:links,flush:flush,gc:gc,report:report,restore:restore,mode:HARD?'hard':'safe',_idb:idb,_cfg:C};
})(window);
