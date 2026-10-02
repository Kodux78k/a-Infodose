(function KOB_BUS(global){
  'use strict';
  const VERSION='KOB-BUS.v1.0.0';
  const CONFIG={debug:false,maxText:9991200,minText:2,debounce:180,
    iframeSelector:'iframe',targetOrigin:'*',
    ignoredTags:['SCRIPT','STYLE','NOSCRIPT','INPUT','TEXTAREA','SELECT','OPTION']};
  const STATE={started:false,frames:new Map(),documents:new WeakSet(),lastText:'',lastTime:0,observer:null};
  const cleanText=t=>String(t||'').replace(/\u200B/g,'').replace(/\u00A0/g,' ').replace(/\s+/g,' ').trim().slice(0,CONFIG.maxText);
  const ignored=el=>{if(!el||el.nodeType!==1)return true;
    if(CONFIG.ignoredTags.includes(el.tagName))return true;
    if(el.closest?.('[data-kob-ignore],[data-tts-ignore],.kob-tts-ignore'))return true;return false};
  function extractText(target){
    if(!target)return'';let el=target;
    if(el.tagName==='SVG'||el.tagName==='PATH'||el.tagName==='USE')
      el=el.closest?.('button,a,[role="button"]')||el.parentElement;
    const control=el.closest?.('button,input,textarea,select');
    if(control){if(!control.hasAttribute('data-kob-tts'))return'';el=control}
    if(ignored(el))return'';
    return cleanText(el.innerText||el.textContent||el.getAttribute?.('aria-label')||el.getAttribute?.('title')||'');
  }
  function getTTS(){
    if(global.CobTTS&&typeof global.CobTTS.speak==='function')return t=>global.CobTTS.speak(t);
    for(const o of [global.KOB_TTS,global.KOBTTS,global.COB_TTS,global.TTS,global.tts]){
      if(!o)continue;if(typeof o.speak==='function')return t=>o.speak(t);
      if(typeof o.say==='function')return t=>o.say(t)}
    if(global.speechSynthesis)return t=>{try{global.speechSynthesis.cancel();
      const u=new SpeechSynthesisUtterance(t);u.lang='pt-BR';global.speechSynthesis.speak(u)}catch(e){}};
    return null;
  }
  function speak(text){text=cleanText(text);if(text.length<CONFIG.minText)return false;
    const now=Date.now();if(text===STATE.lastText&&now-STATE.lastTime<CONFIG.debounce)return false;
    STATE.lastText=text;STATE.lastTime=now;const tts=getTTS();if(!tts)return false;
    try{tts(text);return true}catch{return false}}
  const frameId=f=>{if(f.dataset.kobBusId)return f.dataset.kobBusId;
    const id='kob-frame-'+Math.random().toString(36).slice(2,10);f.dataset.kobBusId=id;return id};
  const getFrameOrigin=f=>{try{return new URL(f.src||f.getAttribute('src')||location.href,location.href).origin}catch{return location.origin}};
  const isSameOrigin=f=>{try{return getFrameOrigin(f)===location.origin}catch{return false}};
  function connectFrame(f){if(!f)return;
    if(isSameOrigin(f)){try{const doc=f.contentDocument;if(doc&&!STATE.documents.has(doc)){
      STATE.documents.add(doc);
      doc.addEventListener('click',ev=>{const t=extractText(ev.target);if(t)speak(t)},true)}}catch{}}
    else{const id=frameId(f);try{f.contentWindow.postMessage({type:'KOB_BUS_INIT',bus:VERSION,frameId:id,parentOrigin:location.origin},'*')}catch{}}}
  function scan(){document.querySelectorAll(CONFIG.iframeSelector).forEach(connectFrame)}
  global.KOBBus={version:VERSION,speak,scan,connectFrame};global.KOB_BUS=global.KOBBus;
  function boot(){global.addEventListener('message',e=>{
    const d=e.data;if(!d||typeof d.type!=='string')return;
    if(d.type==='KOB_TTS')speak(d.text)},false);
    document.addEventListener('click',ev=>{
      if(ev.target?.closest?.('iframe'))return;
      const t=extractText(ev.target);if(!t)return;speak(t)},true);
    scan();setTimeout(scan,500);setTimeout(scan,2000)}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})(window);