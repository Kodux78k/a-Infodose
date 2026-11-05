
/* [V5.4] Migra o que estava salvo na antiga janela-base (#session-iframe) para uma session window do MXP,
   preservando as abas (TabStore). Roda uma vez; KOBNavMigrate.run(true) força de novo. */
(function(){
  'use strict';
  var OLD='session-iframe', FLAG='kobllux:migrated:session-iframe:v1', DEFAULT_URL='https://www.infodose.com.br/splash';
  function ls(k){ try{ return localStorage.getItem(k); }catch(e){ return null; } }
  function lset(k,v){ try{ localStorage.setItem(k,v); }catch(e){} }
  function hostOf(u){ return String(u||'').replace(/^https?:\/\//,'').split('/')[0] || 'Nova Aba'; }
  function collect(){
    var tabs=[], seen=Object.create(null), activeUrl='';
    function push(t){
      if(!t||!t.url||t.url==='about:blank'||/^(javascript|vbscript):/i.test(t.url)||seen[t.url]) return;
      seen[t.url]=1; tabs.push({url:t.url,title:t.title||hostOf(t.url),fav:!!t.fav,createdAt:t.createdAt||Date.now()});
    }
    var d=null; try{ d=window.TabStore&&window.TabStore.get(OLD); }catch(e){}
    if(d&&Array.isArray(d.tabs)) d.tabs.forEach(function(t){ push(t); if(t&&t.id===d.activeId) activeUrl=t.url; });
    var nav=ls('dual_nav_state'); if(nav) push({url:nav});
    if(tabs.length===1&&tabs[0].url===DEFAULT_URL) return null;   /* só o splash padrão: nada a migrar */
    if(!tabs.length) return null;
    return {tabs:tabs,activeUrl:activeUrl||tabs[0].url};
  }
  function uid(p){ return p+'_'+Date.now().toString(36)+Math.random().toString(36).slice(2,7); }
  function applyWhenRendered(sid,data,tries){
    var win=document.querySelector('[data-session-id="'+(window.CSS&&window.CSS.escape?window.CSS.escape(sid):sid)+'"]');
    if(win){
      win.classList.add('collapsed');
      try{ window.applyTabsToWindow&&window.applyTabsToWindow(win,data); }catch(e){}
      var f=win.querySelector('iframe.win-frame'); var a=data.tabs.find(function(t){return t.id===data.activeId;})||data.tabs[0];
      if(f&&a&&f.getAttribute('src')!==a.url) f.src=a.url;
      var c=win.querySelector('.tab-counter'); if(c) c.textContent=data.tabs.length;
      return;
    }
    if(tries>0) setTimeout(function(){ applyWhenRendered(sid,data,tries-1); },150);
  }
  function run(force){
    if(!force && ls(FLAG)) return Promise.resolve(false);
    var M=window.MXP, TS=window.TabStore;
    if(!M||typeof M.createSession!=='function'||!TS) return null;      /* ainda não pronto */
    var found=collect();
    if(!found){ lset(FLAG,String(Date.now())); return Promise.resolve(false); }
    return Promise.resolve(M.createSession('NAV · migrada',{url:found.activeUrl,meta:{kind:'nav',migratedFrom:OLD}})).then(function(s){
      if(!s||!s.id) return false;
      var tabs=found.tabs.map(function(t){ var n=Object.assign({},t); n.id=uid('tab'); return n; });
      var active=tabs.find(function(t){return t.url===found.activeUrl;})||tabs[0];
      var data={tabs:tabs,activeId:active.id};
      TS.set(s.id,data);
      s.collapsed=true; try{ M.save&&M.save(); }catch(e){}
      applyWhenRendered(s.id,data,20);
      try{ TS.dropAll(OLD); }catch(e){}
      lset(FLAG,String(Date.now()));
      try{ window.KBLX_TOAST&&window.KBLX_TOAST('↗ '+tabs.length+' aba(s) migradas para uma session'); }catch(e){}
      return s;
    });
  }
  window.KOBNavMigrate={run:run,collect:collect};
  var tries=0;
  (function tick(){
    var r=null; try{ r=run(false); }catch(e){ console.warn('[nav-migrate]',e); r=false; }
    if(r===null && ++tries<30) setTimeout(tick,500);
  })();
})();
