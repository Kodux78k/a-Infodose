(function KOB_BUS(global){
  'use strict';
  const VERSION='KOB-BUS.v2.0.0-archetype';
  const CONFIG={debug:false,minText:2,debounce:180,
    iframeSelector:'iframe',
    ignoredTags:['SCRIPT','STYLE','NOSCRIPT','INPUT','TEXTAREA','SELECT','OPTION']};

  const STATE={frames:new Map(),documents:new WeakSet(),lastText:'',lastTime:0,
    clickMode:(function(){try{return localStorage.getItem('kob:voice:click')||'auto'}catch(e){return'auto'}})(),
    announce:(function(){try{return localStorage.getItem('kob:voice:announce')==='1'}catch(e){return false}})(),armed:false};

  /* [v5.4.2.0.0.2] TTS resiliente — normalizador selado de marcadores de seta → pausa textual.
     Contrato: NÃO remove conteúdo; converte apenas sequências de seta (<- -> <--> ← → ↔ &lt;- etc.)
     em pausa (vírgula). Aplicado em todos os contratos de fala: KOBBus.say/leitor por blocos
     (via cleanText), App.speakText e KOBLLUX.speakText. Preserva APIs e vozes existentes. */
  global.__kobTtsNorm = function(t){
    try {
      return String(t||'')
        .replace(/&(lt|gt|amp|nbsp|mdash|ndash|larr|rarr|harr);/gi, function(m){
          return {'&lt;':'<','&gt;':'>','&amp;':'&','&nbsp;':' ','&mdash;':'—','&ndash;':'–','&larr;':'←','&rarr;':'→','&harr;':'↔'}[m.toLowerCase()]||' ';
        })
        .replace(/\s*(?:<{1,2}-{1,2}>?|-{1,2}>{1,2}|←{1,2}|→{1,2}|↔{1,2}|⟵|⟶|⟷|<=|=>)\s*/gi, ' , ')
        .replace(/(?:\s*,\s*){2,}/g, ', ')
        .replace(/\s+,/g, ',')
        .replace(/\s+/g,' ').trim();
    } catch(_){ return String(t||'').replace(/\s+/g,' ').trim(); }
  };
  const cleanText=t=>{ try{ return global.__kobTtsNorm(String(t||'').replace(/\u200B/g,'').replace(/\u00A0/g,' ')); }catch(_){ return String(t||'').replace(/\u200B/g,'').replace(/\u00A0/g,' ').replace(/\s+/g,' ').trim(); } };

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
      /* [v79] data-speak: o próprio botão diz o que falar. Modo 'labels': botões do sistema falam o rótulo. */
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

  /* [v79] say(): fala DIRETA pela voz do arquétipo ativo (data-arch). Usado por Soneto, Pílulas, Córtex, win-controls. */
/* [v87] say(): fala DIRETA pela voz do arquétipo ativo, MAS com troca automática
   ao longo do texto — cada nome de arquétipo muda a voz, a UI e a trilha. */
let SAY_GEN = 0;
function say(text, opts){
  opts = opts || {};
  text = cleanText(text);
  if (!text || !global.speechSynthesis) return false;

  /* 1) quebra o texto em segmentos por gatilho de arquétipo */
  const voiceMap = (global.KBLX_VOICE && global.KBLX_VOICE.map) || {};
  const names = Object.keys(voiceMap).sort((a,b)=>b.length-a.length);
  const re = new RegExp('\\b(' + names.join('|') + ')\\b', 'gi');
  const cuts = []; let m;
  while ((m = re.exec(text))) cuts.push({ i: m.index, a: m[1].toUpperCase() });

  const startArch = String(
    (global.Nebula && global.Nebula.arch) ||
    (global.KOBArch && global.KOBArch.voice) ||
    document.body.dataset.arch ||
    document.body.dataset.voiceArch ||
    'KOBLLUX'
  ).toUpperCase();

  const segs = [];
  let cur = startArch, last = 0;
  cuts.forEach(c => {
    if (c.i > last) segs.push({ t: text.slice(last, c.i), a: cur, o: last });
    cur = c.a;
    last = c.i;
  });
  segs.push({ t: text.slice(last), a: cur, o: last });
  const clean = segs.filter(s => s.t.trim().length > 0);
  if (!clean.length) return false;

  /* [v5.1] cada segmento vira PEDAÇOS curtos (≤ ~220 chars) e a fila é alimentada aos poucos
     (3 à frente). Sem isso o Chrome/Android corta utterance longa (~15 s) sem onend e
     filas gigantes travam. */
  const pieces = [];
  clean.forEach(sg => {
    const parts = (global.KOB_TTS_CHUNK ? global.KOB_TTS_CHUNK(sg.t) : [sg.t]);
    let pos = sg.o;
    parts.forEach((p, j) => {
      const at = text.indexOf(p.slice(0, 24), pos);
      const off = at >= 0 ? at : pos;
      pieces.push({ t: p, a: sg.a, o: off, cont: j > 0 });
      pos = off + p.length;
    });
  });
  if (!pieces.length) return false;

  /* 2) dispara a voz e os efeitos colaterais */
  const myGen = ++SAY_GEN;
  try { speechSynthesis.cancel(); } catch(_){}
  try { speechSynthesis.resume(); } catch(_){}   /* cancel() com fila pausada deixa o Chrome mudo */

  const onEndAll = () => { if (opts.onend) opts.onend(); };
  const onErr = e => { if (opts.onerror) opts.onerror(e); else if (opts.onend) opts.onend(); };

  let nextIdx = 0, inFlight = 0, startedAny = false;
  const AHEAD = 3;

  const build = (s, k) => {
    const u = new SpeechSynthesisUtterance(s.t);
    u.__seg = 1; // já é um segmento tokenizado; impede override/re-tokenização MXP no wrapper v81
    u.lang = 'pt-BR';

    /* voz + parâmetros do arquétipo */
    const cfg = voiceMap[s.a] || { nome:'Luciana', lang:'pt-BR', rate:1, pitch:1 };
    u.rate  = opts.rate  || cfg.rate  || 1;
    u.pitch = opts.pitch || cfg.pitch || 1;
    u.lang  = cfg.lang  || 'pt-BR';

    if (global.KBLX_VOICE && global.KBLX_VOICE.forArch){
      const v = global.KBLX_VOICE.forArch(s.a, s.t);
      if (v && v.voice){ u.voice = v.voice; u.lang = v.voice.lang || u.lang; }
    } else {
      const fallback = pickVoice(cfg);
      if (fallback){ u.voice = fallback; u.lang = fallback.lang || u.lang; }
    }

    /* efeitos colaterais — só quando ENTRA num arquétipo novo (continuação do mesmo segmento não reinicia a trilha) */
    u.onstart = () => {
      if (myGen !== SAY_GEN) return;
      startedAny = true;
      if (!s.cont){
        if (k === 0){
          try { global.KOB_ARCHSWITCH && global.KOB_ARCHSWITCH(s.a); } catch(_){}
        } else {
          try {
            if (global.KOBArch && global.KOBArch.restartFrom) global.KOBArch.restartFrom(s.o, s.a);
            else global.KOB_ARCHSWITCH && global.KOB_ARCHSWITCH(s.a);
          } catch(_){}
        }
        if (k > 0 && navigator.vibrate) try { navigator.vibrate(12); } catch(_){}
      }
      try { global.KOB_HOLO && global.KOB_HOLO('t', s.o, text); } catch(_){}
      if (k === 0 && opts.onstart) opts.onstart();
    };

    /* holograma letra-a-letra, respeitando o offset do pedaço */
    u.onboundary = e => {
      startedAny = true;
      const ci = (e.charIndex || 0) + s.o;
      try { global.KOB_HOLO && global.KOB_HOLO('t', ci, text); } catch(_){}
      if (opts.onboundary) opts.onboundary(Object.assign({}, e, { charIndex: ci }));
    };

    /* fim: libera a vaga na fila; onend() do usuário só depois do ÚLTIMO pedaço */
    u.onend = () => {
      startedAny = true; inFlight--;
      if (myGen === SAY_GEN) pump();
      if (k === pieces.length - 1) onEndAll();
    };
    u.onerror = e => {
      inFlight--;
      if (myGen === SAY_GEN) pump();
      onErr(e);
    };
    return u;
  };

  const pump = () => {
    while (nextIdx < pieces.length && inFlight < AHEAD){
      const k = nextIdx++; inFlight++;
      try { speechSynthesis.speak(build(pieces[k], k)); }
      catch (err){ inFlight--; console.warn('[KOBBus.say] falha ao falar pedaço', err); }
    }
  };
  pump();

  /* safe: o Chrome às vezes descarta o speak() logo depois do cancel(). Nada começou → 1 retry limpo. */
  setTimeout(() => {
    if (myGen !== SAY_GEN || startedAny || opts.__retry) return;
    if (speechSynthesis.speaking || speechSynthesis.pending) return;
    try { speechSynthesis.cancel(); speechSynthesis.resume(); } catch(_){}
    say(text, Object.assign({}, opts, { __retry: 1 }));
  }, 2500);

  return true;
}  function stop(){ try{speechSynthesis.cancel()}catch(e){} }
  /* [v5.1] safe: destrava o motor de voz (cancel + resume) sem depender de reload */
  function recover(){ try{ SAY_GEN++; speechSynthesis.cancel(); speechSynthesis.resume(); }catch(e){} }
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
    say((archCfg().nome||'')+' — '+n); return n;
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

  global.KOBBus={version:VERSION,speak,say,stop,recover,scan,connectFrame,archCfg,currentArch,pickVoice,setClickMode,cycleClickMode,toggleAnnounce,nextArch,
    get clickMode(){return STATE.clickMode},get announce(){return STATE.announce}};
  global.KOB_BUS=global.KOBBus;

  function boot(){
    global.addEventListener('message',e=>{
      const d=e.data; if(!d||typeof d.type!=='string')return;
      if(d.type==='KOB_TTS')speak(d.text);
    },false);
    document.addEventListener('click',ev=>{
      if(ev.target?.closest?.('iframe'))return;
      STATE.armed=true;                       /* [v79] só anuncia troca de arq. depois do 1º gesto */
      if(STATE.clickMode==='off')return;
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
      if(STATE.announce&&STATE.armed){const c=archCfg();say((c.nome||'')+' — '+currentArch());}   /* [v79] trigger de arq. → voz nova se apresenta */
    }).observe(document.body,{attributes:true,attributeFilter:['data-arch']});
    scan(); setTimeout(scan,500); setTimeout(scan,2000);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});
  else boot();
})(window);
