(function KOB_BUS(global){
  'use strict';
  const VERSION='KOB-BUS.v2.0.0-archetype';
  const CONFIG={debug:false,minText:2,debounce:180,
    iframeSelector:'iframe',
    ignoredTags:['SCRIPT','STYLE','NOSCRIPT','INPUT','TEXTAREA','SELECT','OPTION']};

  const STATE={frames:new Map(),documents:new WeakSet(),lastText:'',lastTime:0,
    clickMode:(function(){try{return localStorage.getItem('kob:voice:click')||'auto'}catch(e){return'auto'}})(),
    announce:(function(){try{return localStorage.getItem('kob:voice:announce')==='1'}catch(e){return false}})(),armed:false};

  const cleanText=t=>String(t||'').replace(/\u200B/g,'').replace(/\u00A0/g,' ').replace(/\s+/g,' ').trim();

  const ignored=el=>{if(!el||el.nodeType!==1)return true;
    if(CONFIG.ignoredTags.includes(el.tagName))return true;
    if(el.closest?.('[data-kob-ignore],[data-tts-ignore],.kob-tts-ignore'))return true;
    return false};

  function extractText(target){
    if(!target)return'';let el=target;
    if(el.tagName==='SVG'||el.tagName==='PATH'||el.tagName==='USE')
      el=el.closest?.('button,a,[role="button"]')||el.parentElement;
    const control=el.closest?.('button,input,textarea,select');
    if(control){
      /* [v79] data-speak: o prÃ³prio botÃ£o diz o que falar. Modo 'labels': botÃµes do sistema falam o rÃ³tulo. */
      if(control.hasAttribute('data-speak')){ if(ignored(control))return''; return cleanText(control.getAttribute('data-speak')||control.getAttribute('aria-label')||control.title||control.textContent); }
      if(!control.hasAttribute('data-kob-tts')){
        if(STATE.clickMode==='labels' && control.tagName==='BUTTON' && !ignored(control) && control.matches('.mxp-btn,.pill,.doc-pill,[data-dual-action],[data-wc],.kc-btn,.kc-tab,.win-controls button,.kblx-loose-card'))
          return cleanText(control.getAttribute('aria-label')||control.title||control.innerText||control.textContent);
        return'';
      }
      el=control;
    }
    if(ignored(el))return'';
    return cleanText(el.innerText||el.textContent||el.getAttribute?.('aria-label')||el.getAttribute?.('title')||'');
  }

  // ===== VOZ ATIVA PELO ARQUÃTIPO =====
  const norm=x=>String(x||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
  let voices=[]; const loadVoices=()=>{voices=global.speechSynthesis?speechSynthesis.getVoices():[]};
  if(global.speechSynthesis){
    loadVoices();
    speechSynthesis.onvoiceschanged=loadVoices;
    setTimeout(loadVoices,400); setTimeout(loadVoices,1500);
  }
  function currentArch(){
    return String(
      (global.Nebula && global.Nebula.arch) ||
      document.body.dataset.arch ||
      'KOBLLUX'
    ).toUpperCase();
  }
  function archCfg(){
    const map=(global.KOBLLUX_VOICE && global.KOBLLUX_VOICE.map)||{};
    return map[currentArch()] || map.KOBLLUX || {nome:'Luciana',lang:'pt-BR',rate:1,pitch:1};
  }
  function pickVoice(cfg){
    if(!voices.length)loadVoices();
    const n=norm(cfg.nome), l=norm(cfg.lang).split('-')[0];
    return voices.find(v=>norm(v.name).includes(n)&&norm(v.lang).startsWith(l))
        || voices.find(v=>norm(v.lang).startsWith(l))
        || voices.find(v=>norm(v.lang).startsWith('pt'))
        || null;
  }

  // Se existir TTS do symbolBar, delegamos (ele jÃ¡ respeita arquÃ©tipo + blocos).
  function getTTS(){
    if(global.KOBSymbolBar && global.KOBSymbolBar.TTS && typeof global.KOBSymbolBar.TTS.toggle==='function'){
      return t=>{ try{ global.KOBSymbolBar.TTS.text=(()=>t); global.KOBSymbolBar.TTS.toggle(); }catch(e){} };
    }
    if(global.CobTTS && typeof global.CobTTS.speak==='function') return t=>global.CobTTS.speak(t);
    for(const o of [global.KOB_TTS,global.KOBTTS,global.COB_TTS,global.TTS,global.tts]){
      if(!o)continue;
      if(typeof o.speak==='function')return t=>o.speak(t);
      if(typeof o.say==='function')return t=>o.say(t);
    }
    if(global.speechSynthesis){
      return function speakArch(text){
        try{
          speechSynthesis.cancel();
          const cfg=archCfg();
          const u=new SpeechSynthesisUtterance(text);
          u.lang=cfg.lang; u.rate=cfg.rate; u.pitch=cfg.pitch;
          const v=pickVoice(cfg);
          if(v){u.voice=v; u.lang=v.lang||cfg.lang}
          // marca no HUD que a voz trocou
          const hud=document.getElementById('sbHud');
          if(hud) hud.dataset.voice=(cfg.nome||'?')+'Â·'+currentArch();
          speechSynthesis.speak(u);
        }catch(e){}
      };
    }
    return null;
  }

  function speak(text){
    text=cleanText(text);
    if(text.length<CONFIG.minText)return false;
    const now=Date.now();
    if(text===STATE.lastText && now-STATE.lastTime<CONFIG.debounce)return false;
    STATE.lastText=text; STATE.lastTime=now;
    const tts=getTTS(); if(!tts)return false;
    try{ tts(text); return true; }catch{ return false; }
  }

  /* [v79] say(): fala DIRETA pela voz do arquÃ©tipo ativo (data-arch). Usado por Soneto, PÃ­lulas, CÃ³rtex, win-controls. */
  function say(text,opts){
    opts=opts||{}; text=cleanText(text); if(!text||!global.speechSynthesis)return false;
    try{
      speechSynthesis.cancel();
      const cfg=archCfg(), u=new SpeechSynthesisUtterance(text);
      u.lang=cfg.lang; u.rate=opts.rate||cfg.rate; u.pitch=opts.pitch||cfg.pitch;
      const v=pickVoice(cfg); if(v){u.voice=v;u.lang=v.lang||cfg.lang}
      if(opts.onend)u.onend=opts.onend; u.onerror=opts.onerror||opts.onend||null;
      const hud=document.getElementById('sbHud'); if(hud)hud.dataset.voice=(cfg.nome||'?')+'Â·'+currentArch();
      speechSynthesis.speak(u); return true;
    }catch(e){ if(opts.onerror)opts.onerror(e); return false; }
  }
  function stop(){ try{speechSynthesis.cancel()}catch(e){} }
  const MODES=['auto','labels','off'];
  function setClickMode(m){ if(!MODES.includes(m))return STATE.clickMode; STATE.clickMode=m; try{localStorage.setItem('kob:voice:click',m)}catch(e){} return m; }
  function cycleClickMode(){ return setClickMode(MODES[(MODES.indexOf(STATE.clickMode)+1)%MODES.length]); }
  function toggleAnnounce(){ STATE.announce=!STATE.announce; try{localStorage.setItem('kob:voice:announce',STATE.announce?'1':'0')}catch(e){} return STATE.announce; }
  function nextArch(){
    const keys=Object.keys((global.KOBLLUX_VOICE&&global.KOBLLUX_VOICE.map)||{}); if(!keys.length)return currentArch();
    const n=keys[(keys.indexOf(currentArch())+1)%keys.length];
    document.body.dataset.arch=n;
    try{ if(global.NebulaPills&&global.NebulaPills.applyArch)global.NebulaPills.applyArch(n); }catch(e){}
    global.dispatchEvent(new CustomEvent('kob:arch',{detail:{arch:n}}));
    say((archCfg().nome||'')+' â '+n); return n;
  }

  const frameId=f=>{if(f.dataset.kobBusId)return f.dataset.kobBusId;
    const id='kob-frame-'+Math.random().toString(36).slice(2,10); f.dataset.kobBusId=id; return id};
  const getFrameOrigin=f=>{try{return new URL(f.src||f.getAttribute('src')||location.href,location.href).origin}catch{return location.origin}};
  const isSameOrigin=f=>{try{return getFrameOrigin(f)===location.origin}catch{return false}};

  function connectFrame(f){
    if(!f)return;
    if(isSameOrigin(f)){
      try{
        const doc=f.contentDocument;
        if(doc && !STATE.documents.has(doc)){
          STATE.documents.add(doc);
          doc.addEventListener('click',ev=>{const t=extractText(ev.target); if(t)speak(t)},true);
        }
      }catch{}
    }else{
      const id=frameId(f);
      try{f.contentWindow.postMessage({type:'KOB_BUS_INIT',bus:VERSION,frameId:id,parentOrigin:location.origin},'*')}catch{}
    }
  }
  function scan(){document.querySelectorAll(CONFIG.iframeSelector).forEach(connectFrame)}

  global.KOBBus={version:VERSION,speak,say,stop,scan,connectFrame,archCfg,currentArch,pickVoice,setClickMode,cycleClickMode,toggleAnnounce,nextArch,
    get clickMode(){return STATE.clickMode},get announce(){return STATE.announce}};
  global.KOB_BUS=global.KOBBus;

  function boot(){
    global.addEventListener('message',e=>{
      const d=e.data; if(!d||typeof d.type!=='string')return;
      if(d.type==='KOB_TTS')speak(d.text);
    },false);
    document.addEventListener('click',ev=>{
      if(ev.target?.closest?.('iframe'))return;
      STATE.armed=true;                       /* [v79] sÃ³ anuncia troca de arq. depois do 1Âº gesto */
      if(STATE.clickMode==='off')return;
      const t=extractText(ev.target); if(!t)return;
      speak(t);
    },true);
    // reage a troca de arquÃ©tipo â sÃ³ re-registra a config no HUD, nÃ£o refala nada
    new MutationObserver(()=>{
      const hud=document.getElementById('sbHud');
      if(hud){
        const cfg=archCfg();
        hud.dataset.voice=(cfg.nome||'?')+'Â·'+currentArch();
      }
      if(STATE.announce&&STATE.armed){const c=archCfg();say((c.nome||'')+' â '+currentArch());}   /* [v79] trigger de arq. â voz nova se apresenta */
    }).observe(document.body,{attributes:true,attributeFilter:['data-arch']});
    scan(); setTimeout(scan,500); setTimeout(scan,2000);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});
  else boot();
})(window);

(function(){
"use strict";
const $=s=>document.querySelector(s);
/* ---- holograma no header: 2 linhas (♫ música · 🗣 TTS) ---- */
let holoT;
window.KOB_HOLO=function(kind,idx,text){
  const t=$('#hd2Title'),el=$('#hd2Holo '+(kind==='m'?'.hm':'.ht')); if(!t||!el||!text) return;
  let a=idx,b=idx; while(a>0&&text[a-1]!==' '&&text[a-1]!=='\n')a--; 
  const s=Math.max(0,a-12); const e=Math.min(text.length,idx+22);
  el.textContent=(kind==='m'?'♫ ':'🗣 ')+text.slice(s,e).replace(/\s+/g,' ');
  t.classList.add('holo-on'); clearTimeout(holoT); holoT=setTimeout(()=>{t.classList.remove('holo-on')},2600);
};
/* ---- TTS: troca de voz ao aparecer nome de arquétipo no texto (mesmo com texto longo) ---- */
if('speechSynthesis'in window&&!speechSynthesis.__v81){
  const sp=speechSynthesis.speak.bind(speechSynthesis); speechSynthesis.__v81=1;
  speechSynthesis.speak=function(u){
    try{
      const text=u.text||'', V=window.KBLX_VOICE; if(!V||text.length<3||u.__seg) return sp(u);
      const names=(window.ARCH_LIST||[]).slice().sort((a,b)=>b.length-a.length);
      const re=new RegExp('\\b('+names.join('|')+')\\b','gi'), cuts=[]; let m;
      while((m=re.exec(text))) cuts.push({i:m.index,a:m[1].toUpperCase()});
      let cur=(window.getArch&&getArch())||'KOBLLUX', segs=[], last=0;
      cuts.forEach(c=>{ if(c.i>last){segs.push({t:text.slice(last,c.i),a:cur,o:last});last=c.i;} cur=c.a; });
      segs.push({t:text.slice(last),a:cur,o:last});
      segs=segs.filter(s=>s.t.trim());
      const mixA=a=>{ const A=V.map[a]||{rate:1,pitch:1}, M=window.KOB_MIXVOICE?KOB_MIXVOICE(a):A; return {r:M.rate/(A.rate||1), p:M.pitch/(A.pitch||1)}; };
      if(segs.length<2){ { const x=mixA(segs[0]?segs[0].a:cur); u.rate=Math.max(.5,Math.min(2,u.rate*x.r)); u.pitch=Math.max(.2,Math.min(2,u.pitch*x.p)); } const o=u.onboundary; u.onboundary=e=>{window.KOB_HOLO&&KOB_HOLO('t',e.charIndex||0,text); o&&o.call(u,e)}; return sp(u); }
      segs.forEach((s,k)=>{
        const v=V.forArch(s.a,s.t); v.__seg=1; v.volume=u.volume; { const x=mixA(s.a); v.rate=Math.max(.5,Math.min(2,v.rate*x.r)); v.pitch=Math.max(.2,Math.min(2,v.pitch*x.p)); }
        v.onstart=()=>{ try{window.KOB_ARCHSWITCH&&KOB_ARCHSWITCH(s.a)}catch(e){} if(k===0&&u.onstart)u.onstart.call(u,{}); };
        v.onboundary=e=>{ const ci=(e.charIndex||0)+s.o; window.KOB_HOLO&&KOB_HOLO('t',ci,text); if(u.onboundary)u.onboundary.call(u,Object.assign({},e,{charIndex:ci})); };
        if(k===segs.length-1){ v.onend=e=>u.onend&&u.onend.call(u,e); }
        v.onerror=e=>u.onerror&&u.onerror.call(u,e);
        sp(v);
      });
    }catch(err){ sp(u); }
  };
}
/* ---- loader: barra + pílula enquanto arquivo grande é lido ---- */
const bar=document.createElement('div'); bar.id='kobLoad'; bar.innerHTML='<span>CARREGANDO…</span>'; document.body.appendChild(bar);
let busy=0,showT;
function ld(on){ busy+=on?1:-1; if(busy<0)busy=0; clearTimeout(showT);
  if(busy>0) showT=setTimeout(()=>bar.classList.add('on'),250); else bar.classList.remove('on'); }
window.KOB_LOADING=ld;
['readAsText','readAsArrayBuffer','readAsDataURL'].forEach(fn=>{ const o=FileReader.prototype[fn];
  FileReader.prototype[fn]=function(){ ld(true); this.addEventListener('loadend',()=>ld(false),{once:true}); return o.apply(this,arguments); }; });
['text','arrayBuffer'].forEach(fn=>{ const o=Blob.prototype[fn];
  Blob.prototype[fn]=function(){ if(this.size<200000) return o.call(this); ld(true); return o.call(this).finally(()=>ld(false)); }; });
})();