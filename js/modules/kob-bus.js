(function KOB_BUS(global){
  'use strict';
  const VERSION='KOB-BUS.v2.0.0-archetype';
  const CONFIG={debug:false,minText:2,debounce:180,
    iframeSelector:'iframe',
    ignoredTags:['SCRIPT','STYLE','NOSCRIPT','INPUT','TEXTAREA','SELECT','OPTION']};

  const STATE={frames:new Map(),documents:new WeakSet(),lastText:'',lastTime:0};

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
    if(control){if(!control.hasAttribute('data-kob-tts'))return'';el=control}
    if(ignored(el))return'';
    return cleanText(el.innerText||el.textContent||el.getAttribute?.('aria-label')||el.getAttribute?.('title')||'');
  }

  // ===== VOZ ATIVA PELO ARQUÉTIPO =====
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

  // Se existir TTS do symbolBar, delegamos (ele já respeita arquétipo + blocos).
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
          if(hud) hud.dataset.voice=(cfg.nome||'?')+'·'+currentArch();
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

  global.KOBBus={version:VERSION,speak,scan,connectFrame,archCfg};
  global.KOB_BUS=global.KOBBus;

  function boot(){
    global.addEventListener('message',e=>{
      const d=e.data; if(!d||typeof d.type!=='string')return;
      if(d.type==='KOB_TTS')speak(d.text);
    },false);
    document.addEventListener('click',ev=>{
      if(ev.target?.closest?.('iframe'))return;
      const t=extractText(ev.target); if(!t)return;
      speak(t);
    },true);
    // reage a troca de arquétipo — só re-registra a config no HUD, não refala nada
    new MutationObserver(()=>{
      const hud=document.getElementById('sbHud');
      if(hud){
        const cfg=archCfg();
        hud.dataset.voice=(cfg.nome||'?')+'·'+currentArch();
      }
    }).observe(document.body,{attributes:true,attributeFilter:['data-arch']});
    scan(); setTimeout(scan,500); setTimeout(scan,2000);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});
  else boot();
})(window);
