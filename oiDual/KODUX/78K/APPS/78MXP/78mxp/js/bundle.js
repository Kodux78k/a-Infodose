/* =========================================================
   cdnjs-cloudflare-com-ajax-libs-pdf-js-3-11-174-pdf-worker-min-js.js
   ========================================================= */
if(window.pdfjsLib)pdfjsLib.GlobalWorkerOptions.workerSrc='https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

/* =========================================================
   kob-bus.js
   ========================================================= */
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

/* =========================================================
   atualiza-theme-color-meta-browser-ui.js
   ========================================================= */
(function DualThemeController(){
  "use strict";
  const ROOT=document.documentElement;
  const HEADER=document.getElementById("main-header");
  const MAIN=document.getElementById("main-content");
  const STORAGE_KEY="almasliber-theme";
  const VALID=["dark","light"];

  function readStored(){try{const s=localStorage.getItem(STORAGE_KEY);if(VALID.includes(s))return s}catch{}return null}
  function prefersLight(){try{return window.matchMedia&&window.matchMedia('(prefers-color-scheme: light)').matches}catch{return false}}

  function applyTheme(next){
    next=VALID.includes(next)?next:"dark";
    ROOT.dataset.theme=next;
    try{localStorage.setItem(STORAGE_KEY,next)}catch{}
    // atualiza theme-color meta (browser UI)
    const meta=document.querySelector('meta[name="theme-color"]');
    if(meta)meta.setAttribute('content',next==="light"?"#f5f5f7":"#05060a");
    // dispara evento
    window.dispatchEvent(new CustomEvent("dual:theme-change",{detail:{theme:next}}));
    // atualiza título dos botões (acessibilidade)
    document.querySelectorAll('.theme-dot').forEach(b=>{
      b.setAttribute('aria-label',`Alternar para tema ${next==="light"?"escuro":"claro"}`);
      b.title=`Tema: ${next==="light"?"claro":"escuro"} · clique para alternar`;
    });
  }

  function current(){return ROOT.dataset.theme||"dark"}

  window.DualTheme={
    set:applyTheme,
    get:current,
    toggle(){applyTheme(current()==="light"?"dark":"light")}
  };

  // DELEGAÇÃO GLOBAL — funciona mesmo se #theme-dot for clonado depois
  document.addEventListener('click',function(e){
    const dot=e.target.closest('#theme-dot, #theme-dot2, .theme-dot');
    if(!dot)return;
    // ignora se estiver dentro de um container que já tem handler próprio (nenhum aqui)
    e.preventDefault();
    e.stopPropagation();
    window.DualTheme.toggle();
  },true);

  // HEADER: clique colapsa main · scroll esconde/mostra
  if(HEADER&&MAIN){
    HEADER.addEventListener("click",function(e){
      if(e.target.closest(".bota1, .win-navrow, input, button, .top-actions, .theme-dot"))return;
      MAIN.classList.toggle("hidden");
      HEADER.classList.toggle("is-collapsed",MAIN.classList.contains("hidden"));
      window.dispatchEvent(new CustomEvent("dual:content-collapse",{detail:{collapsed:MAIN.classList.contains("hidden")}}));
    });
  }

  let lastY=window.scrollY,ticking=false;
  const TH=8;
  function updateHeader(){
    const y=window.scrollY;
    if(y<=10){HEADER.classList.remove("header-hidden");HEADER.classList.add("header-visible");lastY=y;ticking=false;return}
    if(y>lastY+TH){HEADER.classList.remove("header-visible");HEADER.classList.add("header-hidden")}
    else if(y<lastY-TH){HEADER.classList.remove("header-hidden");HEADER.classList.add("header-visible")}
    lastY=y;ticking=false;
  }
  window.addEventListener("scroll",()=>{if(!ticking){requestAnimationFrame(updateHeader);ticking=true}},{passive:true});

  // INIT: stored > prefers > dark
  const initial=readStored()||(prefersLight()?"light":"dark");
  applyTheme(initial);
  console.log('[Dual Theme] ready ·',initial);
})();

/* =========================================================
   src-contenthtml.js
   ========================================================= */
(function SessionRuntime(){
  'use strict';
  const stackWrap=document.getElementById('stackWrap');
  const dock=document.getElementById('dock');
  let counter=1;
  const timers=new Map();
  const $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const $=(s,r=document)=>r.querySelector(s);

  function syncShell(){
    const m=!!document.querySelector('.session-window.maximized:not(.minimized)');
    document.body.classList.toggle('has-maximized',m);
    document.body.classList.toggle('ui-immersive',m);
  }
  function bringToFront(w){if(!w)return;
    $$('.session-window').forEach(x=>{if(x!==w)x.style.zIndex='100'});w.style.zIndex='94000'}
  function togglePeek(id){const w=document.getElementById(id);if(!w||w.classList.contains('maximized'))return;
    w.classList.toggle('peeked');if(w.classList.contains('peeked'))w.classList.remove('collapsed');
    bringToFront(w);syncShell()}
  function toggleCollapse(id){const w=document.getElementById(id);if(!w||w.classList.contains('maximized'))return;
    w.classList.toggle('collapsed');if(w.classList.contains('collapsed'))w.classList.remove('peeked');
    bringToFront(w);syncShell()}
  function maximizeWindow(id){
    const w=document.getElementById(id);if(!w)return;
    if(w.classList.contains('maximized')){
      w.classList.remove('maximized','header-hidden');w.style.zIndex='100';syncShell();return;
    }
    w.classList.remove('collapsed','peeked','minimized','resizing','header-hidden');
    ['top','left','right','bottom','width','height','maxWidth','maxHeight'].forEach(p=>w.style[p]='');
    w.classList.add('maximized');bringToFront(w);syncShell();
  }
  function minimizeWindow(id){
    const w=document.getElementById(id);if(!w)return;timers.delete(id);
    w.classList.remove('maximized','collapsed','peeked','header-hidden','resizing');
    w.classList.add('minimized');
    document.getElementById('dock-'+id)?.remove();
    const b=document.createElement('button');
    b.type='button';b.className='dock-bubble';b.id='dock-'+id;
    b.title='Restaurar janela';b.textContent='۞';
    b.addEventListener('click',function(e){
      e.preventDefault();e.stopPropagation();b.remove();
      w.classList.remove('minimized');bringToFront(w);syncShell();
    });
    dock?.appendChild(b);syncShell();
  }
  function closeWindow(id){const w=document.getElementById(id);if(!w)return;timers.delete(id);
    document.getElementById('dock-'+id)?.remove();w.remove();syncShell()}
  function handleHeaderClick(e,id){
    if(e.target.closest('.win-controls')||e.target.closest('button')||e.target.closest('input'))return;
    const w=document.getElementById(id);if(!w)return;bringToFront(w);
    const old=timers.get(id);if(old){clearTimeout(old);timers.delete(id);maximizeWindow(id);return}
    const t=setTimeout(()=>{timers.delete(id);togglePeek(id)},250);timers.set(id,t);
  }
  function makeResizeHandles(w){
    if(w.dataset.resizeReady==='1')return;w.dataset.resizeReady='1';
    const hy=document.createElement('div');hy.className='resize-handle resize-y';
    const hx=document.createElement('div');hx.className='resize-handle resize-x';
    const hc=document.createElement('div');hc.className='resize-handle resize-corner';
    w.append(hy,hx,hc);
  }
  function wireSession(w){
    if(!w||w.dataset.wired==='1')return;w.dataset.wired='1';
    makeResizeHandles(w);
    $('.win-hdr',w)?.addEventListener('click',e=>handleHeaderClick(e,w.id));
    $('.win-controls',w)?.addEventListener('click',function(e){
      const btn=e.target.closest('button');if(!btn)return;
      const a=btn.dataset.action;if(!a)return;
      e.preventDefault();e.stopPropagation();
      if(a==='collapse')toggleCollapse(w.id);
      else if(a==='maximize')maximizeWindow(w.id);
      else if(a==='minimize')minimizeWindow(w.id);
      else if(a==='close')closeWindow(w.id);
    });
  }
  function createSessionWindow({title='//',src='',contentHtml=''}={}){
    const id='session-'+Date.now()+'-'+counter++;
    const w=document.createElement('section');
    w.className='session-window peeked';w.id=id;
    const t=String(title).replace(/[<>&"']/g,'');
    const s=String(src||'').replace(/"/g,'&quot;');
    const body=src?`<iframe class="win-frame" data-runtime="nav" src="${s}"></iframe>`
      :`<div class="win-content">${contentHtml||''}</div>`;
    w.innerHTML=`
      <div class="win-hdr"><div class="win-controls">
        <button type="button" data-action="collapse">−</button>
        <span class="win-title">${t}</span>
        <button type="button" data-action="maximize">⛶</button>
        <button type="button" data-action="minimize">۞</button>
        <button type="button" data-action="close" style="color:var(--red)">×</button>
      </div></div>${body}`;
    stackWrap.appendChild(w);wireSession(w);bringToFront(w);return w;
  }
  function applyUrlFromTopbar(){
    const v=(document.getElementById('urlInputNav')?.value||'').trim();if(!v)return;
    createSessionWindow({title:v,src:v});
  }
  document.getElementById('goNavBtn')?.addEventListener('click',applyUrlFromTopbar);
  document.getElementById('urlInputNav')?.addEventListener('keydown',e=>{
    if(e.key==='Enter'){e.preventDefault();applyUrlFromTopbar()}
  });
  document.getElementById('openKobBtn')?.addEventListener('click',()=>createSessionWindow());
  $$('.session-window').forEach(wireSession);
  syncShell();

  // API global
  Object.assign(window,{
    handleHeaderClick,togglePeek,toggleCollapse,maximizeWindow,
    minimizeWindow,closeWindow,createSessionWindow,syncShellMode:syncShell
  });
})();

/* =========================================================
   tts.js
   ========================================================= */
(function NebulaApp(){
  'use strict';
  const $=s=>document.querySelector(s);
  const $$=s=>[...document.querySelectorAll(s)];

  const DOC_KEY='nebula.docs.v1';
  let docs=[],view=[],cards=[],index=0,filter='all';
  let dragX=0,dragging=false,startX=0,moved=false;
  const pdfCache=new Map();
  let pendingSeedId=null;
  let ttsPlaying=false,ttsCharIndex=0,ttsLastText='';
  let currentDoc=null;
  const ARCHS={
    KOBLLUX:{c1:'#22D3EE',c2:'#0E7C9E'},ATLAS:{c1:'#38BDF8',c2:'#1E3A8A'},
    NOVA:{c1:'#F72585',c2:'#7209B7'},VITALIS:{c1:'#22C55E',c2:'#166534'},
    PULSE:{c1:'#EC4899',c2:'#831843'},KAOS:{c1:'#FACC15',c2:'#B45309'},
    KODUX:{c1:'#F97316',c2:'#C2410C'},LUMINE:{c1:'#FDE047',c2:'#CA8A04'},
    AION:{c1:'#4F46E5',c2:'#3730A3'},ARTEMIS:{c1:'#A855F7',c2:'#5B21B6'},
    SERENA:{c1:'#38BDF8',c2:'#1E3A8A'},GENUS:{c1:'#E5E7EB',c2:'#4B5563'},
    SOLUS:{c1:'#0EA5E9',c2:'#0369A1'},RHEA:{c1:'#22C55E',c2:'#166534'},
    UNO:{c1:'#F97316',c2:'#C2410C'},DUAL:{c1:'#06B6D4',c2:'#0E7C9E'},
    TRINITY:{c1:'#EC4899',c2:'#831843'},INFODOSE:{c1:'#22C55E',c2:'#166534'},
    HORUS:{c1:'#F59E0B',c2:'#B45309'},BLLUE:{c1:'#3B82F6',c2:'#1E40AF'},
    JESUS:{c1:'#FFD700',c2:'#FFB84D'},K_DION:{c1:'#60A5FA',c2:'#93C5FD'},
    KAEL_DOMNNUS:{c1:'#F472B6',c2:'#F9A8D4'},NEPHESH_ELYON:{c1:'#C4B5FD',c2:'#DDD6FE'},
    KAYTHAR:{c1:'#E0F2FE',c2:'#BAE6FD'},SYLLA:{c1:'#D1FAE5',c2:'#A7F3D0'},
    ANAMYX:{c1:'#FEF3C7',c2:'#FDE68A'},VELOR:{c1:'#A78BFA',c2:'#C4B5FD'},
    ELYSHA:{c1:'#BAE6FD',c2:'#E0F2FE'},SYLON:{c1:'#34D399',c2:'#6EE7B7'},
    NAIRA:{c1:'#FDE68A',c2:'#FCD34D'},THENIR:{c1:'#F9A8D4',c2:'#FBCFE8'},
    ELOH:{c1:'#6366F1',c2:'#818CF8'},NOVAEL:{c1:'#7DD3FC',c2:'#BAE6FD'},
    AELYA:{c1:'#E9D5FF',c2:'#F3E8FF'},IGNYRA:{c1:'#F97316',c2:'#FED7AA'},
    LUMARA:{c1:'#92400E',c2:'#B45309'},LUXARA:{c1:'#92400E',c2:'#B45309'},
    YAMANTEK:{c1:'#FCD34D',c2:'#FDE68A'},KD1:{c1:'#9BE7FF',c2:'#6A5CFF'},
    KOφD1:{c1:'#8BE7FF',c2:'#7A8CFF'},METALUX:{c1:'#C79AFF',c2:'#F472B6'},
    CHRISTOS:{c1:'#FFB84D',c2:'#FFD166'}
  };
  const KOB_VOICES={
    ATLAS:{nome:"Daniel",lang:"en-US",rate:1.02,pitch:1.39},NOVA:{nome:"Luciana",lang:"pt-BR",rate:1.063,pitch:1.34},
    VITALIS:{nome:"Rocko",lang:"pt-BR",rate:.96,pitch:1.42},PULSE:{nome:"Reed",lang:"pt-BR",rate:1,pitch:1.78},
    ARTEMIS:{nome:"Paulina",lang:"es-MX",rate:1,pitch:1.23},SERENA:{nome:"Joana",lang:"pt-BR",rate:.92,pitch:.90},
    KAOS:{nome:"Rocko",lang:"pt-BR",rate:1.28,pitch:.67},GENUS:{nome:"Reed",lang:"pt-BR",rate:.98,pitch:1.20},
    LUMINE:{nome:"Flo",lang:"fr-FR",rate:1.03,pitch:1.55},SOLUS:{nome:"Satu",lang:"fi-FI",rate:.90,pitch:.58},
    RHEA:{nome:"Alice",lang:"it-IT",rate:1.02,pitch:1.44},AION:{nome:"Milena",lang:"ru-RU",rate:1.07,pitch:1.08},
    KODUX:{nome:"Rocko",lang:"pt-BR",rate:1,pitch:.07},BLLUE:{nome:"Zuzana",lang:"cs-CZ",rate:.94,pitch:1.69},
    JESUS:{nome:"Sara",lang:"da-DK",rate:1.09,pitch:.03},KOBLLUX:{nome:"Luciana",lang:"pt-BR",rate:.98,pitch:.48}
  };
  let currentArch='KOBLLUX';

  const uid=()=>Math.random().toString(36).slice(2,10)+Date.now().toString(36);
  const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const fmtSize=b=>!b&&b!==0?'—':b<1024?b+' B':b<1048576?(b/1024).toFixed(1)+' KB':(b/1048576).toFixed(1)+' MB';
  const fmtTime=ts=>{if(!ts)return'agora';const s=(Date.now()-ts)/1000;
    return s<60?'agora':s<3600?`há ${Math.floor(s/60)}min`:s<86400?`há ${Math.floor(s/3600)}h`:new Date(ts).toLocaleDateString('pt-BR')};
  const hex2rgb=(h,a)=>{h=h.replace('#','');
    const n=parseInt(h.length===3?h.split('').map(c=>c+c).join(''):h,16);
    return `rgba(${(n>>16)&255},${(n>>8)&255},${n&255},${a})`};

  const persistDocs=()=>{try{localStorage.setItem(DOC_KEY,JSON.stringify(docs))}catch{}};
  const restoreDocs=()=>{try{const r=localStorage.getItem(DOC_KEY);if(r)docs=JSON.parse(r).filter(d=>d&&d.name)}catch{docs=[]}};

  // TTS
  let voices=[];
  const loadVoices=()=>{voices=window.speechSynthesis?speechSynthesis.getVoices():[]};
  if('speechSynthesis' in window){loadVoices();speechSynthesis.onvoiceschanged=loadVoices;
    setTimeout(loadVoices,400);setTimeout(loadVoices,1200)}
  function speak(text){
    if(!('speechSynthesis' in window)||!text)return;
    speechSynthesis.cancel();
    const a=ARCHS[currentArch]||ARCHS.KOBLLUX;
    const cfg=KOB_VOICES[currentArch]||KOB_VOICES.KOBLLUX;
    const u=new SpeechSynthesisUtterance(text);
    u.pitch=cfg.pitch;u.rate=cfg.rate;u.lang=cfg.lang;
    const normVoice=x=>String(x||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
    const wantName=normVoice(cfg.nome),wantLang=normVoice(cfg.lang).split('-')[0];
    const v=voices.find(v=>normVoice(v.name).includes(wantName)&&normVoice(v.lang).startsWith(wantLang))
      ||voices.find(v=>normVoice(v.lang).startsWith(wantLang))
      ||voices.find(v=>normVoice(v.lang).startsWith('pt'));
    if(v){u.voice=v;u.lang=v.lang||cfg.lang}
    ttsLastText=text;ttsCharIndex=0;ttsPlaying=true;
    u.onboundary=ev=>{if(typeof ev.charIndex==='number')ttsCharIndex=ev.charIndex};
    u.onend=()=>{ttsPlaying=false;ttsCharIndex=0};
    speechSynthesis.speak(u);
  }

  function toast(msg){const el=$('#toast');el.textContent=msg;el.classList.add('on');
    clearTimeout(toast._t);toast._t=setTimeout(()=>el.classList.remove('on'),2400)}

  // Markdown
  function mdToHtml(src){
    const lines=String(src).replace(/\r\n?/g,'\n').split('\n');
    const out=[];let i=0;
    const inline=t=>t
      .replace(/`([^`]+)`/g,'<code>$1</code>')
      .replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>')
      .replace(/(^|[^*])\*([^*\n]+)\*/g,'$1<em>$2</em>')
      .replace(/~~(.+?)~~/g,'<del>$1</del>')
      .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g,'<a href="$2" target="_blank" rel="noopener">$1</a>');
    while(i<lines.length){
      const l=lines[i];
      if(/^\s*$/.test(l)){i++;continue}
      if(/^\s*```/.test(l)){const lang=l.trim().slice(3);i++;const buf=[];
        while(i<lines.length&&!/^\s*```/.test(lines[i])){buf.push(lines[i]);i++}i++;
        out.push(`<pre data-lang="${esc(lang)}"><code>${esc(buf.join('\n'))}</code></pre>`);continue}
      const h=l.match(/^(#{1,6})\s+(.*)$/);
      if(h){out.push(`<h${h[1].length}>${inline(h[2])}</h${h[1].length}>`);i++;continue}
      if(/^\s*(-{3,}|\*{3,}|_{3,})\s*$/.test(l)){out.push('<hr>');i++;continue}
      if(/^\s*>/.test(l)){const buf=[];
        while(i<lines.length&&/^\s*>/.test(lines[i])){buf.push(lines[i].replace(/^\s*>\s?/,''));i++}
        out.push('<blockquote>'+mdToHtml(buf.join('\n'))+'</blockquote>');continue}
      if(/^\s*\|/.test(l)&&i+1<lines.length&&/^\s*\|[\s:|-]+\|\s*$/.test(lines[i+1])){
        const sp=r=>r.trim().replace(/^\|/,'').replace(/\|$/,'').split('|').map(s=>s.trim());
        const head=sp(l);i+=2;const rows=[];
        while(i<lines.length&&/^\s*\|/.test(lines[i])){rows.push(sp(lines[i]));i++}
        out.push('<table><thead><tr>'+head.map(c=>`<th>${inline(c)}</th>`).join('')+'</tr></thead><tbody>'+
          rows.map(r=>'<tr>'+r.map(c=>`<td>${inline(c)}</td>`).join('')+'</tr>').join('')+'</tbody></table>');continue}
      if(/^\s*([-*+]|\d+\.)\s+/.test(l)){
        const ord=/^\s*\d+\./.test(l);const items=[];
        while(i<lines.length&&/^\s*([-*+]|\d+\.)\s+/.test(lines[i])){
          items.push(lines[i].replace(/^\s*([-*+]|\d+\.)\s+/,''));i++}
        const tag=ord?'ol':'ul';
        out.push(`<${tag}>`+items.map(t=>`<li>${inline(t)}</li>`).join('')+`</${tag}>`);continue}
      const buf=[];
      while(i<lines.length&&!/^\s*$/.test(lines[i])&&!/^(#{1,6}\s|>\s*|```|\s*([-*+]|\d+\.)\s)/.test(lines[i])){buf.push(lines[i]);i++}
      if(!buf.length){buf.push(lines[i]);i++}
      out.push('<p>'+inline(buf.join(' '))+'</p>');
    }
    return out.join('\n');
  }

  function applyArch(key){
    const normalized=String(key||'KOBLLUX').toUpperCase();
    const a=ARCHS[normalized]||ARCHS.KOBLLUX;currentArch=normalized;
    const r=document.documentElement;
    r.style.setProperty('--active',a.c1);r.style.setProperty('--active-2',a.c2);
    r.style.setProperty('--active-color',a.c1);r.style.setProperty('--active-secondary',a.c2);
    r.style.setProperty('--active-glow',hex2rgb(a.c1,.45));
    r.style.setProperty('--kob-voice-primary',a.c1);r.style.setProperty('--kob-voice-secondary',a.c2);
    document.body.dataset.arch=normalized.toLowerCase();
    document.body.dataset.voiceArch=normalized.toLowerCase();
    $$('.arch-chip').forEach(c=>c.classList.toggle('on',c.dataset.k===normalized));
    try{localStorage.setItem('nebula.arch',normalized)}catch{}
  }
  function buildArchBar(){
    const bar=$('#archBar');if(!bar)return;
    bar.innerHTML=Object.keys(ARCHS).map(k=>{const a=ARCHS[k];
      return `<button class="arch-chip" data-k="${k}" style="--chip-c1:${a.c1};--chip-c2:${a.c2};--chip-glow:${hex2rgb(a.c1,.45)}">
        <span class="swatch"></span>${k}</button>`}).join('');
    bar.addEventListener('click',e=>{const c=e.target.closest('.arch-chip');if(!c)return;
      applyArch(c.dataset.k);speak(c.dataset.k+' ativo')});
  }

  const TYPES={md:{label:'MD',c:'#7c5cff',g:'#'},markdown:{label:'MD',c:'#7c5cff',g:'#'},
    txt:{label:'TXT',c:'#19d3c5',g:'¶'},pdf:{label:'PDF',c:'#ff5c6c',g:'PDF'},
    json:{label:'JSON',c:'#ffb020',g:'{}'},csv:{label:'CSV',c:'#35d07f',g:'⊞'},
    html:{label:'HTML',c:'#ff7a45',g:'</>'},htm:{label:'HTML',c:'#ff7a45',g:'</>'}};
  const typeOf=e=>TYPES[(e||'').toLowerCase()]||{label:(e||'DOC').toUpperCase().slice(0,4),c:'#8b93a7',g:'◆'};

  const escapeRegex=s=>String(s).replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
  const PATO_PRESETS={
    pato:[{from:'de',to:'ðŸ¦†',wholeWord:true},{from:'do',to:'ðö¦†',wholeWord:true},
      {from:'não',to:'NÃ£o†',wholeWord:true},{from:'mundo',to:'möndö¦†',wholeWord:true},
      {from:'pato',to:'🦆 Pato',wholeWord:true}],
    basico:[{from:'de',to:'ðŸ¦†',wholeWord:true},{from:'do',to:'ðö¦†',wholeWord:true}],
    kblx:[{from:'de',to:'ðŸ¦†',wholeWord:true},{from:'do',to:'ðö¦†',wholeWord:true}]
  };
  let patoPreset=localStorage.getItem('nebula.pato.preset')||'pato';
  function applyPato(text,presetKey){
    const rules=PATO_PRESETS[presetKey||patoPreset]||[];
    let out=String(text||'');
    rules.forEach(r=>{
      const e=escapeRegex(r.from);let rx;
      try{rx=r.wholeWord?new RegExp(`(?<![\\p{L}\\p{N}_])${e}(?![\\p{L}\\p{N}_])`,'giu'):new RegExp(e,'giu')}
      catch{rx=new RegExp(e,'gi')}
      out=out.replace(rx,r.to);
    });
    return out;
  }
  function merge369(a,b){
    const s1=a.split(/[.!?]+/).filter(s=>s.trim());
    const s2=b.split(/[.!?]+/).filter(s=>s.trim());
    const max=Math.max(s1.length,s2.length);let res='';
    for(let i=0;i<max;i++){const p=i%3;
      if(p===0&&s1[i])res+=s1[i].trim()+'. ';
      else if(p===1&&s2[i])res+=s2[i].trim()+'. ';
      else if(p===2&&s1[i])res+=s1[i].trim()+'. ';
      else if(s2[i])res+=s2[i].trim()+'. ';}
    return res.trim();
  }
  function pushDerivedDoc(name,content,extra){
    const d={id:uid(),name,ext:'md',size:(content||'').length,addedAt:Date.now(),content,...extra};
    docs.unshift(d);persistDocs();rebuild();return d;
  }
  function updateSeedLabel(){
    const d=pendingSeedId?docs.find(x=>x.id===pendingSeedId):null;
    const txt=d?`Semente: ${d.name}`:'Semente: nenhuma marcada';
    $$('.g-seed-label').forEach(g=>g.textContent=txt);
  }
  function markSeed(doc){
    if(!doc)return;
    if(pendingSeedId===doc.id){pendingSeedId=null;toast('Semente desmarcada');updateSeedLabel();return}
    pendingSeedId=doc.id;toast('💊 "'+doc.name+'" marcado como Semente');updateSeedLabel();
  }
  function fundirComSemente(doc){
    if(!doc)return;
    if(!pendingSeedId){markSeed(doc);return}
    if(pendingSeedId===doc.id){toast('Escolhe outro doc');return}
    const seed=docs.find(d=>d.id===pendingSeedId);
    if(!seed){pendingSeedId=null;updateSeedLabel();toast('Semente perdida');return}
    const fused=applyPato(merge369(seed.content||seed.name,doc.content||doc.name));
    pushDerivedDoc(`Fusão 369 · ${seed.name} + ${doc.name}`,fused,{fused:true,sources:[seed.addedAt,doc.addedAt]});
    pendingSeedId=null;updateSeedLabel();toast('⊕ Fundido');
  }

  function renderDocPills(){
    const box=$('#docPillsBar');if(!box)return;
    if(!docs.length){box.innerHTML='<span class="dp-empty">Nenhuma pílula ainda.</span>';return}
    box.innerHTML=docs.map(d=>{
      const t=typeOf(d.ext);const isSeed=d.id===pendingSeedId;
      return `<div class="doc-pill${isSeed?' is-seed':''}" data-id="${d.id}" style="--c:${t.c}">
        <span>${esc(t.g)}</span><span>${esc(d.name.slice(0,24))}</span>
        <span class="dp-acts">
          <button data-action="open" title="Abrir">📖</button>
          <button data-action="speak" title="Ouvir">🎙️</button>
          <button data-action="seed" title="Semente">🌱</button>
          <button data-action="fuse" title="Fundir">🪞</button>
          <button data-action="del" title="Remover">✕</button>
        </span></div>`;
    }).join('');
  }
  $('#docPillsBar')?.addEventListener('click',e=>{
    const btn=e.target.closest('button[data-action]');if(!btn)return;
    const w=e.target.closest('.doc-pill');if(!w)return;
    const d=docs.find(x=>x.id===w.dataset.id);if(!d)return;
    const a=btn.dataset.action;
    if(a==='open')openReader(d);
    else if(a==='speak')speak((d.content||d.name).slice(0,5000));
    else if(a==='seed')markSeed(d);
    else if(a==='fuse')fundirComSemente(d);
    else if(a==='del'){docs=docs.filter(x=>x.id!==d.id);persistDocs();rebuild();toast('🗑️ Removido')}
  });
  $('#btnPills')?.addEventListener('click',()=>{
    const b=$('#docPillsBar');
    const showing=b.style.display==='flex';
    b.style.display=showing?'none':'flex';
    if(!showing)renderDocPills();
  });

  function b64ToUint8(dataUrl){const b64=dataUrl.split(',')[1]||'';const bin=atob(b64);
    const arr=new Uint8Array(bin.length);for(let i=0;i<bin.length;i++)arr[i]=bin.charCodeAt(i);return arr}
  function handleFiles(files){
    const list=Array.from(files||[]);if(!list.length)return;
    list.forEach(file=>{
      const ext=(file.name.split('.').pop()||'').toLowerCase();
      if(ext==='pdf'){
        const r=new FileReader();
        r.onload=()=>{
          const d={id:uid(),name:file.name,ext:'pdf',size:file.size,addedAt:Date.now(),dataUrl:r.result};
          docs.unshift(d);persistDocs();rebuild();makePdfThumb(d);toast('📄 '+file.name);};
        r.readAsDataURL(file);
      }else{
        const r=new FileReader();
        r.onload=()=>{
          let content=r.result;
          if(ext==='json'){try{content=JSON.stringify(JSON.parse(content),null,2)}catch{}}
          docs.unshift({id:uid(),name:file.name,ext:ext||'txt',size:file.size,addedAt:Date.now(),content});
          persistDocs();rebuild();};
        r.readAsText(file);
      }
    });
  }
  async function makePdfThumb(d){
    if(!window.pdfjsLib||!d.dataUrl)return;
    try{
      const pdf=await pdfjsLib.getDocument({data:b64ToUint8(d.dataUrl)}).promise;
      d.pages=pdf.numPages;
      const page=await pdf.getPage(1);
      const vp=page.getViewport({scale:.45});
      const c=document.createElement('canvas');c.width=vp.width;c.height=vp.height;
      await page.render({canvasContext:c.getContext('2d'),viewport:vp}).promise;
      d.thumb=c.toDataURL('image/jpeg',.72);persistDocs();
    }catch{}
  }

  const stage=document.getElementById('stage');
  function rebuild(){
    const q=($('#q')?.value||'').trim().toLowerCase();
    view=docs.filter(d=>{
      if(filter==='fav'&&!d.fav)return false;
      if(filter!=='all'&&filter!=='fav'&&(d.ext||'').toLowerCase()!==filter)return false;
      if(!q)return true;
      return d.name.toLowerCase().includes(q)||(d.content&&d.content.toLowerCase().includes(q));
    });
    stage.innerHTML='';cards=[];
    view.forEach((d,i)=>{
      const t=typeOf(d.ext);
      const card=document.createElement('article');
      card.className='card';card.dataset.id=d.id;card.dataset.index=i;
      card.style.setProperty('--c',t.c);card.style.setProperty('--glow',hex2rgb(t.c,.30));
      const snippet=d.content?d.content.replace(/[#*`>_~\-]/g,' ').replace(/\s+/g,' ').trim().slice(0,180):(d.ext==='pdf'?'PDF':'Documento');
      card.innerHTML=`
        <button class="del">✕</button>
        <div class="thumb">
          <div class="thumb-img"${d.thumb?` style="background-image:url(${d.thumb})"`:''}></div>
          <div class="glyph">${esc(t.g)}</div>
        </div>
        <div class="card-body">
          <span class="badge">${t.label}${d.fav?' ★':''}</span>
          <h3>${esc(d.name)}</h3>
          <p class="snippet">${esc(snippet)}</p>
          <div class="card-foot"><span>${fmtSize(d.size)}</span><span>${fmtTime(d.addedAt)}</span></div>
        </div>`;
      card.addEventListener('click',e=>{
        if(e.target.closest('.del'))return;
        if(moved)return;
        if(card.classList.contains('is-active'))openReader(d);
        else{index=i;layout()}
      });
      card.querySelector('.del').addEventListener('click',e=>{
        e.stopPropagation();docs=docs.filter(x=>x.id!==d.id);persistDocs();rebuild();toast('🗑️ Removido');
      });
      stage.appendChild(card);cards.push(card);
    });
    if(index>=view.length)index=Math.max(0,view.length-1);if(index<0)index=0;
    const dotsEl=$('#dots');dotsEl.innerHTML='';
    view.forEach((_,i)=>{const dot=document.createElement('span');dot.className='dot';
      dot.addEventListener('click',()=>{index=i;layout()});dotsEl.appendChild(dot)});
    $('#empty').classList.toggle('on',!view.length);
    $('#navDock').style.display=view.length?'flex':'none';
    layout();renderDocPills();
  }
  const spacing=()=>{const w=window.innerWidth;return w<520?Math.min(150,w*.42):w<860?170:205};
  function layout(){
    if(!cards.length)return;
    const SP=spacing();
    cards.forEach((el,i)=>{
      const off=i-index,abs=Math.abs(off);
      if(abs>4){el.style.opacity=0;el.style.pointerEvents='none';
        el.style.transform=`translate(-50%,-50%) translate3d(${off*SP}px,0,-1000px)`;
        el.style.zIndex=0;return}
      const x=off*SP+dragX,y=abs*14,z=-abs*210;
      const ry=off*-30+(dragX*-.035),sc=1-Math.min(abs,4)*.055;
      el.style.transform=`translate(-50%,-50%) translate3d(${x}px,${y}px,${z}px) rotateY(${ry}deg) scale(${sc})`;
      el.style.opacity=1-Math.min(abs,4)*.20;
      el.style.zIndex=100-abs;el.style.pointerEvents='auto';
      el.classList.toggle('is-active',off===0&&Math.abs(dragX)<55);
    });
    $$('.dot').forEach((d,i)=>d.classList.toggle('on',i===index));
  }
  function go(delta){if(!view.length)return;index=Math.max(0,Math.min(view.length-1,index+delta));layout()}
  stage.addEventListener('pointerdown',e=>{if(e.target.closest('.del'))return;
    dragging=true;moved=false;startX=e.clientX;dragX=0;stage.classList.add('dragging');
    try{stage.setPointerCapture(e.pointerId)}catch{}});
  stage.addEventListener('pointermove',e=>{if(!dragging)return;dragX=e.clientX-startX;
    if(Math.abs(dragX)>8)moved=true;layout()});
  function endDrag(){if(!dragging)return;dragging=false;stage.classList.remove('dragging');
    const dx=dragX;dragX=0;if(dx<-55)go(1);else if(dx>55)go(-1);else layout();
    setTimeout(()=>{moved=false},60)}
  stage.addEventListener('pointerup',endDrag);
  stage.addEventListener('pointercancel',endDrag);
  $('#prev')?.addEventListener('click',()=>go(-1));
  $('#next')?.addEventListener('click',()=>go(1));

  async function openReader(doc){
    currentDoc=doc;const t=typeOf(doc.ext);
    $('#rTitle').textContent=doc.name;
    $('#rFav').textContent=doc.fav?'★':'☆';
    $('#readerBody').innerHTML='<div class="pdf-loading">Carregando…</div>';
    $('#reader').classList.add('on');
    const ext=(doc.ext||'').toLowerCase();
    if(ext==='pdf')await renderPdf(doc);
    else if(ext==='md'||ext==='markdown')$('#readerBody').innerHTML='<div class="md">'+mdToHtml(doc.content||'')+'</div>';
    else $('#readerBody').innerHTML='<pre class="plain">'+esc(doc.content||'(vazio)')+'</pre>';
  }
  function closeReader(){$('#reader').classList.remove('on');$('#readerBody').innerHTML='';
    currentDoc=null;if('speechSynthesis' in window)speechSynthesis.cancel()}
  $('#rClose')?.addEventListener('click',closeReader);
  $('#reader')?.addEventListener('click',e=>{if(e.target.id==='reader')closeReader()});
  $('#rFav')?.addEventListener('click',()=>{if(!currentDoc)return;
    currentDoc.fav=!currentDoc.fav;$('#rFav').textContent=currentDoc.fav?'★':'☆';persistDocs();rebuild()});
  $('#rSpeech')?.addEventListener('click',()=>{if(!currentDoc)return;
    const t=(currentDoc.content||currentDoc.name||'').slice(0,5000);
    if(t){speak(t);toast('🎙️ Lendo')}});
  $('#rPato')?.addEventListener('click',()=>{if(!currentDoc||!currentDoc.content)return;
    pushDerivedDoc(`${currentDoc.name} · Pato`,applyPato(currentDoc.content),{fromId:currentDoc.id});
    toast('🦆 Pato aplicado')});
  $('#rFundir')?.addEventListener('click',()=>fundirComSemente(currentDoc));
  $('#rDownload')?.addEventListener('click',()=>{if(!currentDoc)return;
    let url;if(currentDoc.dataUrl)url=currentDoc.dataUrl;
    else url=URL.createObjectURL(new Blob([currentDoc.content||''],{type:'text/plain;charset=utf-8'}));
    const a=document.createElement('a');a.href=url;a.download=currentDoc.name;
    document.body.appendChild(a);a.click();a.remove()});
  $('#rWindow')?.addEventListener('click',()=>{if(!currentDoc)return;
    const d=currentDoc;let body='';
    if(d.content)body='<div class="md" style="padding:20px">'+mdToHtml(d.content)+'</div>';
    window.createSessionWindow?.({title:'📄 '+d.name,contentHtml:body});
    closeReader()});
  $('#rGerardo')?.addEventListener('click',()=>{
    if(!currentDoc||!currentDoc.content)return toast('Sem texto');
    const sents=currentDoc.content.split(/(?<=[.!?…])\s+/).map(s=>s.trim()).filter(Boolean);
    $('#readerBody').innerHTML='<div class="md">'+sents.map(s=>`<blockquote>${esc(s)}</blockquote>`).join('')+'</div>';
  });
  $('#rInject')?.addEventListener('click',()=>{if(!pendingSeedId)return toast('Marca uma Semente');
    const s=docs.find(x=>x.id===pendingSeedId);if(s){toast('🎧+ Injetado');speak(s.content||s.name)}});
  async function renderPdf(doc){
    if(!doc.dataUrl){$('#readerBody').innerHTML='PDF grande — reimporte';return}
    if(!window.pdfjsLib){$('#readerBody').innerHTML='⚠️ pdf.js ausente';return}
    try{
      let pdf=pdfCache.get(doc.id);
      if(!pdf){pdf=await pdfjsLib.getDocument({data:b64ToUint8(doc.dataUrl)}).promise;pdfCache.set(doc.id,pdf)}
      doc.pages=pdf.numPages;$('#readerBody').innerHTML='';
      const wrap=document.createElement('div');wrap.className='pdf-wrap';$('#readerBody').appendChild(wrap);
      const maxPages=Math.min(pdf.numPages,40);
      for(let p=1;p<=maxPages;p++){
        const page=await pdf.getPage(p);const vp=page.getViewport({scale:1.6});
        const box=document.createElement('div');box.className='pdf-page';
        const c=document.createElement('canvas');c.width=vp.width;c.height=vp.height;
        box.appendChild(c);wrap.appendChild(box);
        await page.render({canvasContext:c.getContext('2d'),viewport:vp}).promise;
        await new Promise(r=>setTimeout(r,0));
      }
    }catch(err){$('#readerBody').innerHTML='❌ '+(err.message||'Erro')}
  }

  const SOLAR_MODES=['day','sunset','night'];
  let solarAuto=localStorage.getItem('nebula.solar.auto')==='1';
  function setSolar(mode,auto){solarAuto=!!auto;
    document.body.classList.remove('solar-day','solar-sunset','solar-night');
    document.body.classList.add('solar-'+mode);
    try{localStorage.setItem('nebula.solar',mode);localStorage.setItem('nebula.solar.auto',solarAuto?'1':'0')}catch{}
    const l=$('#solarLabel');if(l)l.textContent=mode.toUpperCase()+(solarAuto?' · auto':'')}
  const solarByTime=()=>{const h=new Date().getHours();return(h>=6&&h<17)?'day':(h>=17&&h<19)?'sunset':'night'};
  $('#solarCycle')?.addEventListener('click',()=>{
    const cur=SOLAR_MODES.find(m=>document.body.classList.contains('solar-'+m))||'night';
    setSolar(SOLAR_MODES[(SOLAR_MODES.indexOf(cur)+1)%3],false)});
  $('#solarAuto')?.addEventListener('click',()=>{setSolar(solarByTime(),true);toast('Solar auto')});
  setInterval(()=>{if(solarAuto)setSolar(solarByTime(),true)},600000);
  const uName=$('#userName'),uModel=$('#userModel');
  try{const sU=localStorage.getItem('nebula.user'),sM=localStorage.getItem('nebula.model');
    if(sU)uName.value=sU;if(sM)uModel.value=sM}catch{}
  uName?.addEventListener('change',()=>{try{localStorage.setItem('nebula.user',uName.value)}catch{}});
  uModel?.addEventListener('change',()=>{try{localStorage.setItem('nebula.model',uModel.value)}catch{}});
  const patoSel=$('#patoPresetSelect');
  if(patoSel){patoSel.value=patoPreset;
    patoSel.addEventListener('change',()=>{patoPreset=patoSel.value;
      try{localStorage.setItem('nebula.pato.preset',patoPreset)}catch{}})}
  $('#exportState')?.addEventListener('click',()=>{
    const payload={app:'NEBULA',v:1,ts:new Date().toISOString(),
      docs:docs.filter(d=>!d.dataUrl||d.dataUrl.length<500000),arch:currentArch};
    const blob=new Blob([JSON.stringify(payload,null,2)],{type:'application/json'});
    const a=document.createElement('a');a.href=URL.createObjectURL(blob);
    a.download='nebula-backup-'+new Date().toISOString().slice(0,10)+'.json';
    a.click();toast('Backup exportado')});
  $('#resetState')?.addEventListener('click',()=>{
    if(!confirm('Resetar?'))return;
    ['nebula.docs.v1','nebula.arch','nebula.solar','nebula.solar.auto'].forEach(k=>{
      try{localStorage.removeItem(k)}catch{}});location.reload()});

  const bgEl=document.getElementById('bg-fake-custom') || document.body;
  let bgData='';try{bgData=localStorage.getItem('nebula.bg')||''}catch{}
  const applyBg=()=>{if(bgData){bgEl.style.backgroundImage=`url(${bgData})`;
    const op=+(document.getElementById('bgOpacity')?.value||60)/100;bgEl.style.opacity=op;
    const v=document.getElementById('bgOpacityVal');if(v)v.textContent=Math.round(op*100)+'%'}
    else{bgEl.style.backgroundImage='';bgEl.style.opacity='0'}};
  applyBg();
  $('#bgUpload')?.addEventListener('change',e=>{
    const f=e.target.files[0];if(!f)return;const r=new FileReader();
    r.onload=()=>{bgData=r.result;try{localStorage.setItem('nebula.bg',bgData)}catch{};applyBg()};
    r.readAsDataURL(f)});
  $('#bgClear')?.addEventListener('click',()=>{bgData='';
    try{localStorage.removeItem('nebula.bg')}catch{};applyBg()});
  $('#bgOpacity')?.addEventListener('input',()=>applyBg());

  $('#q')?.addEventListener('input',()=>{index=0;rebuild()});
  $('#filterBar')?.addEventListener('click',e=>{
    const b=e.target.closest('.tab-pill');if(!b)return;
    filter=b.dataset.f;$$('.tab-pill').forEach(x=>x.classList.toggle('on',x===b));index=0;rebuild()});
  $('#btnImport')?.addEventListener('click',()=>$('#fileInput').click());
  $('#fileInput')?.addEventListener('change',e=>{handleFiles(e.target.files);e.target.value=''});
  let dragDepth=0;
  window.addEventListener('dragenter',e=>{e.preventDefault();dragDepth++;$('#drop').classList.add('on')});
  window.addEventListener('dragover',e=>e.preventDefault());
  window.addEventListener('dragleave',e=>{e.preventDefault();dragDepth=Math.max(0,dragDepth-1);
    if(!dragDepth)$('#drop').classList.remove('on')});
  window.addEventListener('drop',e=>{e.preventDefault();dragDepth=0;$('#drop').classList.remove('on');
    if(e.dataTransfer?.files.length)handleFiles(e.dataTransfer.files)});

  const SAMPLES=[
    {name:'README.md',ext:'md',size:1800,content:`# NEBULA · Almasliber\n\n**Cards** funcionando. **Tema** ok. **Tone.js** ligado.\n\n## Uso\n- Card central → abrir\n- 🎙️ ouvir · 🌱 semente · 🪞 fundir\n- ⚙ Cockpit → solar, bg, backup\n- 🧠 Espaço da Mente → Fractal 369`},
    {name:'anotacoes.txt',ext:'txt',size:400,content:`Anotações\n=========\n\n- EMD em session window\n- Tone.js para sonoro\n- Tailwind removido\n- CSS puro, 1 controlador de tema`},
    {name:'config.json',ext:'json',size:200,content:JSON.stringify({app:'ALMASLIBER',versao:'2.1.0',tailwind:false,emd:true,tone:true},null,2)}
  ];
  function loadSamples(){
    const base=Date.now();
    SAMPLES.forEach((s,i)=>{if(docs.some(d=>d.name===s.name))return;
      docs.push({...s,id:uid(),addedAt:base-i*1000*60*17})});
    persistDocs();index=0;rebuild();toast('✨ Exemplos carregados');
  }
  $('#btnSample')?.addEventListener('click',loadSamples);

  const SB=[
    {icon:'[M]',label:'Espaço da Mente',act:()=>window.openEMD?.()},
    {icon:'[I]',label:'Importar',act:()=>$('#fileInput').click()},
    {icon:'[+]',label:'Exemplos',act:loadSamples},
    {icon:'[P]',label:'Pílulas',act:()=>$('#btnPills').click()},
    {icon:'[T]',label:'Tema',act:()=>window.DualTheme?.toggle()},
    {icon:'[N]',label:'Nova janela',act:()=>window.createSessionWindow?.({title:'Sessão'})},
    {icon:'[W]',label:'Splash Infodose',act:()=>window.createSessionWindow?.({title:'Splash',src:'https://www.infodose.com.br/splash'})},
    {icon:'[F]',label:'Factory',act:()=>window.MXP?.openFactory()}
  ];
  const sbItems=$('#sbItems'), symbolBar=$('#symbolBar'), sbToggle=$('#sbToggle'), sbOrb=$('#sbOrb'), sbCockpit=$('#sbCockpit');
  if(sbItems){
    sbItems.innerHTML=SB.map((a,i)=>`<button class="pill sm" data-sbi="${i}">${a.icon} ${a.label}</button>`).join('');
    sbItems.addEventListener('click',e=>{const b=e.target.closest('[data-sbi]');if(!b)return;
      const a=SB[+b.dataset.sbi];if(a?.act)a.act();
    });
  }
  function setSymbolBar(open){
    if(!symbolBar)return;
    symbolBar.classList.toggle('collapsed',!open);
    symbolBar.classList.toggle('open',open);
    symbolBar.setAttribute('aria-expanded',String(open));
    sbToggle?.setAttribute('aria-expanded',String(open));
    if(sbToggle)sbToggle.title=open?'Recolher menu':'Abrir menu';
  }
  sbToggle?.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();setSymbolBar(symbolBar.classList.contains('collapsed'));});
  function openUserCockpit(){
    const d=$('#drawerProfile'), ov=$('#drawerOverlay');
    if(!d)return;
    d.classList.add('on'); d.setAttribute('aria-hidden','false');
    ov?.classList.add('on'); ov?.setAttribute('aria-hidden','false');
  }
  function closeUserCockpit(){
    const d=$('#drawerProfile'), ov=$('#drawerOverlay');
    d?.classList.remove('on'); d?.setAttribute('aria-hidden','true');
    ov?.classList.remove('on'); ov?.setAttribute('aria-hidden','true');
  }
  window.KOBCockpit={open:openUserCockpit,close:closeUserCockpit,toggle:()=>{
    const d=$('#drawerProfile'); d?.classList.contains('on')?closeUserCockpit():openUserCockpit();
  }};
  sbCockpit?.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();openUserCockpit();});
  sbOrb?.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();
    setSymbolBar(true);
  });
  setSymbolBar(false);

  buildArchBar();
  try{applyArch(localStorage.getItem('nebula.arch')||'KOBLLUX')}catch{applyArch('KOBLLUX')}
  const savedSolar=localStorage.getItem('nebula.solar');
  if(savedSolar&&SOLAR_MODES.includes(savedSolar))setSolar(savedSolar,solarAuto);
  else setSolar(solarByTime(),solarAuto);
  restoreDocs();rebuild();
  if(!docs.length)setTimeout(loadSamples,500);

  window.KOBLLUX_VOICE={map:KOB_VOICES};
  window.Nebula={
    version:'almasliber-2.1',
    applyArch,speak,pushDerivedDoc,openReader,
    applyPato,merge369,markSeed,fundirComSemente,
    get docs(){return docs},get currentDoc(){return currentDoc},
    get arch(){return currentArch},get seedId(){return pendingSeedId}
  };
})();

/* =========================================================
   fsw-inicial-ja-nasce-como-espaco-da-mente-sem-iframe-url.js
   ========================================================= */
(()=>{
  'use strict';
  const $=(s,r=document)=>r.querySelector(s);
  const $$=(s,r=document)=>[...r.querySelectorAll(s)];

  let emdRoot=null;

  // STATE
  const state={
    rawMerge:'',dictApplied:'',dictEnabled:false,dictRules:[],
    fmt:{chapters:true,subtitles:true,callouts:true,pagebreaks:false,wordsPerParagraph:12},
    view:'raw',slices:[],sliceIndex:0,sliceMode:'paragraph',sliceSize:420,sliceShowAll:false
  };
  let __lastSubs=0;
  let ttsPlaying=false,ttsUtter=null;

  // MOTOR 369
  const motor369={merge(a,b){
    const s1=a.split(/[.!?]+/).filter(s=>s.trim());
    const s2=b.split(/[.!?]+/).filter(s=>s.trim());
    const max=Math.max(s1.length,s2.length);let res='';
    for(let i=0;i<max;i++){const p=i%3;
      if(p===0&&s1[i])res+=s1[i].trim()+'. ';
      else if(p===1&&s2[i])res+=s2[i].trim()+'. ';
      else if(p===2&&s1[i])res+=s1[i].trim()+'. ';
      else if(s2[i])res+=s2[i].trim()+'. ';}
    return res;
  }};

  // MARKDOWN MIN
  const MD=(()=>{
    const esc=v=>String(v??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
    function inline(t){let s=esc(t);
      s=s.replace(/`([^`]+)`/g,(_,c)=>`<code>${c}</code>`);
      s=s.replace(/\*\*([^*]+)\*\*/g,'<strong>$1</strong>');
      s=s.replace(/(^|[^*])\*([^*]+)\*(?!\*)/g,'$1<em>$2</em>');
      return s;}
    function parse(text){
      const lines=String(text??'').replace(/\r\n?/g,'\n').split('\n');
      const out=[];let i=0;let para=[];
      const flush=()=>{if(!para.length)return;const j=para.join(' ').trim();if(j)out.push(`<p>${inline(j)}</p>`);para=[]};
      while(i<lines.length){
        const l=lines[i];
        if(!l.trim()){flush();i++;continue}
        const hm=l.match(/^(#{1,6})\s+(.*)$/);
        if(hm){flush();const n=hm[1].length;out.push(`<h${n}>${inline(hm[2])}</h${n}>`);i++;continue}
        if(/^\s*(?:-{3,}|\*{3,}|_{3,})\s*$/.test(l)){flush();out.push('<hr>');i++;continue}
        if(/^\s*>\s?/.test(l)){flush();const buf=[];
          while(i<lines.length&&/^\s*>\s?/.test(lines[i])){buf.push(lines[i].replace(/^\s*>\s?/,''));i++}
          out.push(`<blockquote>${inline(buf.join(' '))}</blockquote>`);continue}
        para.push(l.trim());i++;
      }
      flush();return out.join('\n');
    }
    return {render:parse};
  })();

  // SLICER
  function makeSlices(text){
    if(!text||!text.trim())return[];
    const m=state.sliceMode,s=state.sliceSize,c=[];
    if(m==='paragraph'){text.split(/\n{2,}/).forEach(p=>{const t=p.trim();if(t)c.push(t)})}
    else if(m==='sentence'){const rx=/[^.!?]+[.!?]+[\s]*/g;let mm,last=0;
      while((mm=rx.exec(text))!==null){c.push(mm[0].trim());last=rx.lastIndex}
      const t=text.slice(last).trim();if(t)c.push(t)}
    else{const w=text.split(/(\s+)/);let b='';for(const x of w){if((b+x).length>s&&b.trim()){c.push(b.trim());b=x}else b+=x}
      if(b.trim())c.push(b.trim())}
    if(!c.length&&text.trim())c.push(text.trim());
    return c;
  }
  function sliceTitle(t){const w=t.match(/[\wÀ-ú]+/g)||[];return (w.slice(0,4).join(' ')||'Fatia').slice(0,44)}

  // DICT
  const DICT_PRESETS={
    patoDoMundo:[
      {from:'de',to:'ðŸ¦†',wholeWord:true,enabled:true},
      {from:'do',to:'ðö¦†',wholeWord:true,enabled:true},
      {from:'diário',to:'ðŸ¦†Ariö',wholeWord:true,enabled:true},
      {from:'dual',to:'†ðual',wholeWord:false,enabled:true},
      {from:'mundo',to:'MöNdö¦†',wholeWord:true,enabled:true},
      {from:'não',to:'NÃ£o†',wholeWord:true,enabled:true},
      {from:'pato',to:'PaTo†',wholeWord:true,enabled:true}
    ],
    kblx:[
      {from:'de',to:'ðŸ¦†',wholeWord:true,enabled:true},
      {from:'do',to:'ðö¦†',wholeWord:true,enabled:true}
    ],
    vazio:[]
  };
  const escapeRegex=s=>String(s).replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
  function applyDictionary(text,rules){
    if(!text)return{text:'',total:0};
    const active=rules.filter(r=>r.enabled&&r.from).sort((a,b)=>b.from.length-a.from.length);
    let out=text,total=0;
    for(const rule of active){
      const e=escapeRegex(rule.from);let rx;
      try{rx=rule.wholeWord?new RegExp(`(?<![\\p{L}\\p{N}_])${e}(?![\\p{L}\\p{N}_])`,'giu'):new RegExp(e,'giu')}
      catch{rx=new RegExp(e,'gi')}
      let count=0;out=out.replace(rx,()=>{count++;return rule.to});total+=count;
    }
    return{text:out,total};
  }

  // TTS
  function toggleTTS(force){
    if(ttsPlaying){speechSynthesis.cancel();ttsPlaying=false;updateTTSBtn();return}
    const text=force||state.dictApplied;
    if(!text||!text.trim()){alert('Gera um resultado primeiro');return}
    speechSynthesis.cancel();
    ttsUtter=new SpeechSynthesisUtterance(text);
    const v=speechSynthesis.getVoices().find(v=>v.lang.startsWith('pt'));
    if(v)ttsUtter.voice=v;
    ttsUtter.rate=.95;
    ttsUtter.onend=()=>{ttsPlaying=false;updateTTSBtn()};
    ttsUtter.onerror=()=>{ttsPlaying=false;updateTTSBtn()};
    speechSynthesis.speak(ttsUtter);ttsPlaying=true;updateTTSBtn();
  }
  function updateTTSBtn(){
    $$('[data-emd-action="toggle-tts"]',emdRoot).forEach(b=>{
      b.classList.toggle('playing',ttsPlaying);b.textContent=ttsPlaying?'⏸':'🎧';
    });
    const sp=$('#emdSlicePlay',emdRoot);if(sp){sp.classList.toggle('active',ttsPlaying);sp.textContent=ttsPlaying?'⏸':'🎧'}
  }

  // SONORO
  let sonoroStarted=false,sonoroPlaying=false,sonoroPart=null;
  let sonoroSynths={},sonoroReverb=null,sonoroDelay=null,sonoroAnalyser=null;
  let sonoroSpans=[],sonoroRaf=null;
  const SONORO_SCALES={
    melancolia:['A3','B3','C4','D4','E4','F4','G#4','A4','B4','C5','D5','E5','F5','G#5','A5'],
    alegria:['C4','D4','E4','G4','A4','C5','D5','E5','G5','A5','C6','D6','E6','G6','A6'],
    misterio:['C4','D4','E4','F#4','G#4','A#4','C5','D5','E5','F#5','G#5','A#5','C6','D6','E6'],
    sonho:['F3','G3','A3','B3','C4','D4','E4','F4','G4','A4','B4','C5','D5','E5','F5'],
    oriental:['A3','A#3','D4','E4','F4','A4','A#4','D5','E5','F5','A5'],
    cyberpunk:['E3','F3','G#3','A3','B3','C4','D4','E4','F4','G#4','A4','B4','C5','D5','E5']
  };
  const AL='abcdefghijklmnopqrstuvwxyzáàãâéêíóôõúçñ';
  const toneOk=()=>typeof Tone!=='undefined'&&Tone;
  function initSonoro(){
    if(!toneOk()||sonoroStarted)return sonoroStarted;
    const revEl=$('#emdSonRev',emdRoot);
    const wet=revEl?Math.max(0,Math.min(100,parseInt(revEl.value,10)||40))/100:.4;
    sonoroReverb=new Tone.Reverb({decay:3.5,wet}).toDestination();
    sonoroDelay=new Tone.FeedbackDelay('8n',.25).connect(sonoroReverb);
    sonoroAnalyser=new Tone.Waveform(128);Tone.Destination.connect(sonoroAnalyser);
    sonoroSynths.softKey=new Tone.PolySynth(Tone.Synth,{oscillator:{type:'triangle'},envelope:{attack:.02,decay:.3,sustain:.2,release:1.2}}).connect(sonoroDelay);sonoroSynths.softKey.volume.value=-6;
    sonoroSynths.marimba=new Tone.PolySynth(Tone.Synth,{oscillator:{type:'sine'},envelope:{attack:.005,decay:.2,sustain:.01,release:.4}}).connect(sonoroDelay);sonoroSynths.marimba.volume.value=-4;
    sonoroSynths.synthwave=new Tone.PolySynth(Tone.AMSynth,{harmonicity:2.5,oscillator:{type:'sawtooth'}}).connect(sonoroDelay);sonoroSynths.synthwave.volume.value=-10;
    sonoroSynths.ambient=new Tone.PolySynth(Tone.DuoSynth).connect(sonoroDelay);sonoroSynths.ambient.volume.value=-12;
    sonoroSynths.quote=new Tone.PolySynth(Tone.FMSynth,{harmonicity:3,modulationIndex:4}).connect(sonoroReverb);
    sonoroSynths.bass=new Tone.MembraneSynth().toDestination();
    sonoroStarted=true;return true;
  }
  function parseEvents(text,theme){
    const ev=[];const sc=SONORO_SCALES[theme]||SONORO_SCALES.melancolia;
    let step=0;const sd=Tone.Time('16n').toSeconds();let inQ=false;
    for(let i=0;i<text.length;i++){
      const ch=text[i];const cl=ch.toLowerCase();
      const isUp=ch!==cl&&AL.includes(cl);
      if(ch==='"'||ch==='“'||ch==='”'||ch==="'"){inQ=!inQ;ev.push({time:step*sd,index:i,type:'quote-mark'});step++;continue}
      if(ch===' '||ch==='\n'){ev.push({time:step*sd,index:i,type:'space'});step+=ch==='\n'?3:1;continue}
      if(ch==='.'||ch==='!'||ch==='?'){const n=ch==='!'?'E1':ch==='?'?'G1':'C1';
        ev.push({time:step*sd,index:i,type:'bass',note:n,duration:'4n'});step+=4;continue}
      if(ch===','||ch===';'){ev.push({time:step*sd,index:i,type:'punct-pause'});step+=2;continue}
      const ai=AL.indexOf(cl);
      if(ai!==-1){
        let note=sc[ai%sc.length];if(isUp)note=Tone.Frequency(note).transpose(12).toNote();
        ev.push({time:step*sd,index:i,type:inQ?'quote':'main',isUppercase:isUp,note,duration:isUp?'8n':'16n'});
        step+=isUp?1.8:1.4;
      }else{ev.push({time:step*sd,index:i,type:'symbol'});step++}
    }
    ev.push({time:step*sd,type:'end'});return ev;
  }
  function renderViz(text){
    const viz=$('#emdSonViz',emdRoot);if(!viz)return;
    viz.innerHTML='';sonoroSpans=[];
    for(let i=0;i<text.length;i++){
      const s=document.createElement('span');s.className='sch';
      if(text[i]==='\n')s.innerHTML='<br>';
      else if(text[i]===' '){s.innerHTML='&nbsp;';s.classList.add('sch-space')}
      else s.textContent=text[i];
      viz.appendChild(s);sonoroSpans.push(s);
    }
  }
  function setupCanvas(){
    const c=$('#emdSonCanvas',emdRoot);if(!c)return;
    const dpr=window.devicePixelRatio||1;const r=c.getBoundingClientRect();
    c.width=r.width*dpr;c.height=r.height*dpr;
    const ctx=c.getContext('2d');ctx.setTransform(1,0,0,1,0,0);ctx.scale(dpr,dpr);
  }
  function drawWave(){
    sonoroRaf=requestAnimationFrame(drawWave);
    const c=$('#emdSonCanvas',emdRoot);if(!c)return;
    const ctx=c.getContext('2d');const w=c.getBoundingClientRect().width;const h=c.getBoundingClientRect().height;
    ctx.fillStyle='rgba(2,6,23,.35)';ctx.fillRect(0,0,w,h);
    if(!sonoroAnalyser||!sonoroPlaying){
      ctx.beginPath();ctx.strokeStyle='rgba(123,97,255,.28)';ctx.lineWidth=1.5;
      ctx.moveTo(0,h/2);ctx.lineTo(w,h/2);ctx.stroke();return;}
    const v=sonoroAnalyser.getValue();
    ctx.beginPath();ctx.lineWidth=2;ctx.strokeStyle='#00f5ff';ctx.shadowColor='rgba(0,245,255,.7)';ctx.shadowBlur=8;
    const sl=w/v.length;let x=0;
    for(let i=0;i<v.length;i++){const y=((v[i]+1)/2)*h;if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);x+=sl}
    ctx.lineTo(w,h/2);ctx.stroke();ctx.shadowBlur=0;
  }
  function renderSonoro(){
    const out=$('#emdOut',emdRoot);if(!out)return;
    const text=state.dictApplied||'';
    if(!text.trim()){out.innerHTML='<div class="emd-empty">Funde textos primeiro.</div>';return}
    out.innerHTML=`<div class="emd-son-wrap">
      <div class="emd-canvas-wrap"><canvas id="emdSonCanvas"></canvas></div>
      <div id="emdSonViz" class="emd-viz"></div>
      <div class="emd-hint">Letras → notas · MAIÚSCULAS → +oitava · citações → FM · . ! ? → graves</div></div>`;
    renderViz(text);setupCanvas();if(!sonoroRaf)drawWave();
  }
  function updateSonoroUI(){
    const p=$('#emdSonPlay',emdRoot);if(p){p.classList.toggle('active',sonoroPlaying);p.textContent=sonoroPlaying?'⏸':'▶'}
    $$('[data-emd-action="play-sonoro"]',emdRoot).forEach(b=>{
      b.classList.toggle('playing',sonoroPlaying);b.textContent=sonoroPlaying?'⏸':'🎵';
    });
  }
  async function startSonoro(){
    if(!toneOk()){alert('Tone.js não carregou');return}
    const text=state.dictApplied||'';
    if(!text.trim()){alert('Funde os textos primeiro');return}
    if(sonoroPlaying){stopSonoro();return}
    try{await Tone.start()}catch{}
    if(!initSonoro())return;
    if(!$('#emdSonViz',emdRoot))renderSonoro();
    renderViz(text);
    const th=$('#emdSonTheme',emdRoot)?.value||'melancolia';
    const sk=$('#emdSonSynth',emdRoot)?.value||'softKey';
    const main=sonoroSynths[sk]||sonoroSynths.softKey;
    const ev=parseEvents(text,th);
    if(sonoroPart){sonoroPart.dispose();sonoroPart=null}
    Tone.Transport.stop();Tone.Transport.cancel(0);
    sonoroPart=new Tone.Part((time,e)=>{
      if(e.type==='main')main.triggerAttackRelease(e.note,e.duration,time);
      else if(e.type==='quote')sonoroSynths.quote.triggerAttackRelease(e.note,e.duration,time);
      else if(e.type==='bass')sonoroSynths.bass.triggerAttackRelease(e.note,e.duration,time);
      else if(e.type==='end'){Tone.Draw.schedule(()=>stopSonoro(),time);return}
      Tone.Draw.schedule(()=>{
        const s=sonoroSpans[e.index];if(!s)return;
        let cls='sch-main';
        if(e.type==='quote'||e.type==='quote-mark')cls='sch-quote';
        else if(e.isUppercase)cls='sch-accent';
        else if(e.type==='bass'||e.type==='punct-pause')cls='sch-punct';
        s.classList.add(cls);
        if(e.index%14===0&&s.scrollIntoView)s.scrollIntoView({behavior:'smooth',block:'nearest'});
        setTimeout(()=>s.classList.remove(cls),220);
      },time);
    },ev).start(0);
    Tone.Transport.start();sonoroPlaying=true;updateSonoroUI();
  }
  function stopSonoro(){
    if(sonoroPart){try{sonoroPart.dispose()}catch{}sonoroPart=null}
    if(toneOk()){try{Tone.Transport.stop();Tone.Transport.cancel(0)}catch{}}
    sonoroSpans.forEach(s=>{s.className='sch'+(s.classList.contains('sch-space')?' sch-space':'')});
    sonoroPlaying=false;updateSonoroUI();
  }

  // REFRESH
  function refresh(){
    const prev=state.dictApplied;
    if(state.dictEnabled&&state.dictRules.length){
      const r=applyDictionary(state.rawMerge,state.dictRules);
      state.dictApplied=r.text;__lastSubs=r.total;
    }else{state.dictApplied=state.rawMerge;__lastSubs=0}
    if(sonoroPlaying&&state.dictApplied!==prev)stopSonoro();
    state.slices=makeSlices(state.dictApplied);
    renderView();updateStats();updateSummary();
  }
  function renderView(){
    const out=$('#emdOut',emdRoot);if(!out)return;
    const v=state.view;
    $$('.emd-tab',emdRoot).forEach(t=>t.classList.toggle('active',t.dataset.emdView===v));
    const sR=$('#emdStripRaw',emdRoot),sG=$('#emdStripRich',emdRoot),
      sS=$('#emdStripSlices',emdRoot),sSo=$('#emdStripSonoro',emdRoot);
    if(sR)sR.style.display=v==='raw'?'flex':'none';
    if(sG)sG.style.display=v==='rich'?'flex':'none';
    if(sS)sS.style.display=v==='slices'?'flex':'none';
    if(sSo)sSo.style.display=v==='sonoro'?'flex':'none';
    if(v==='raw'){
      const i=$('#emdRawInfo',emdRoot);
      if(i)i.innerHTML=`<b style="color:var(--emd-glow2)">${state.dictApplied.length.toLocaleString('pt-BR')}</b> chars · <b style="color:var(--emd-glow2)">${state.slices.length}</b> fatias · ${state.dictEnabled?'Pato ON':'OFF'}`;
    }
    out.classList.toggle('rich',v==='rich'||v==='sonoro');
    if(v==='raw'){out.textContent=state.dictApplied;out.scrollTop=0;return}
    if(v==='rich'){out.innerHTML=state.dictApplied?MD.render(state.dictApplied):'';out.scrollTop=0;return}
    if(v==='slices'){renderSlices();return}
    if(v==='sonoro'){renderSonoro();return}
  }
  function renderSlices(){
    const out=$('#emdOut',emdRoot);if(!out)return;
    const s=state.slices;
    if(!s.length){out.innerHTML='<div class="emd-empty">Sem fatias.</div>';updateCounter();return}
    if(state.sliceShowAll)out.innerHTML=s.map((x,i)=>sliceCard(x,i)).join('');
    else{const i=Math.max(0,Math.min(state.sliceIndex,s.length-1));out.innerHTML=sliceCard(s[i],i)}
    out.scrollTop=0;updateCounter();
  }
  function sliceCard(text,i){
    const total=state.slices.length;
    return `<div class="emd-slice">
      <div class="emd-tag">${String(i+1).padStart(2,'0')} / ${String(total).padStart(2,'0')}</div>
      <div class="emd-st">${sliceTitle(text)}</div>
      <div class="emd-sb">${MD.render(text)}</div>
      <div class="emd-sacts">
        <button type="button" data-emd-slice-copy="${i}">⧉ Copiar</button>
        <button type="button" data-emd-slice-seed="${i}">→ Semente</button>
        <button type="button" data-emd-slice-mirror="${i}">→ Espelho</button>
        <button type="button" data-emd-slice-play="${i}">🎧 Ouvir</button>
      </div></div>`;
  }
  function updateCounter(){
    const e=$('#emdSliceCounter',emdRoot);if(!e)return;
    const t=state.slices.length,c=t?(state.sliceIndex+1):0;
    e.innerHTML=`${state.sliceShowAll?'TODAS':'FATIA'} <b>${c}</b>/${t}`;
  }
  function updateSummary(){
    const e=$('#emdResultSum',emdRoot);if(!e)return;
    if(!state.rawMerge)e.textContent='Fusão Fractal · 369';
    else e.textContent=`${state.dictApplied.length.toLocaleString('pt-BR')} chars · ${state.slices.length} fatias`;
  }
  function updateStats(){
    const t=state.dictRules.length,a=state.dictRules.filter(r=>r.enabled).length,s=__lastSubs||0;
    const rr=$('#emdDsRules',emdRoot),ra=$('#emdDsActive',emdRoot),rs=$('#emdDsSubs',emdRoot);
    if(rr)rr.textContent=t;if(ra)ra.textContent=a;if(rs)rs.textContent=s;
  }

  // MERGE
  function doMerge(){
    const t1=$('#emdT1',emdRoot).value.trim();
    const t2=$('#emdT2',emdRoot).value.trim();
    if(!t1||!t2){alert('Cola 2 textos primeiro');return}
    state.rawMerge=motor369.merge(t1,t2);
    $('#emdResultPanel',emdRoot).style.display='block';
    $('#emdResultEmpty',emdRoot).style.display='none';
    localStorage.setItem('emd_ultimo',state.rawMerge);
    localStorage.setItem('emd_t1',t1);localStorage.setItem('emd_t2',t2);
    refresh();
    $('#emdResult',emdRoot).open=true;
  }

  // ACTIONS
  async function colar(id){const c=$('#'+id,emdRoot);if(!c)return;
    try{const t=await navigator.clipboard.readText();if(!t)return;c.value=t;c.dispatchEvent(new Event('input',{bubbles:true}));c.focus()}
    catch{alert('Clipboard bloqueado')}}
  async function copiar(){const t=state.dictApplied;if(!t)return alert('Sem resultado');
    try{await navigator.clipboard.writeText(t);alert('Copiado')}
    catch{const ta=document.createElement('textarea');ta.value=t;document.body.appendChild(ta);ta.select();document.execCommand('copy');ta.remove()}}
  function baixar(){const t=state.dictApplied;if(!t)return alert('Sem resultado');
    const b=new Blob([t],{type:'text/plain;charset=utf-8'});
    const u=URL.createObjectURL(b);const a=document.createElement('a');
    a.href=u;a.download=`espaco-da-mente-${new Date().toISOString().replace(/[:.]/g,'-')}.txt`;
    a.click();setTimeout(()=>URL.revokeObjectURL(u),1000)}
  function toSeed(){const t=state.dictApplied;if(!t)return;
    $('#emdT1',emdRoot).value=t;localStorage.setItem('emd_t1',t);$('#emdSeed',emdRoot).open=true}
  function toMirror(){const t=state.dictApplied;if(!t)return;
    $('#emdT2',emdRoot).value=t;localStorage.setItem('emd_t2',t);$('#emdMirror',emdRoot).open=true}
  function swap(){const a=$('#emdT1',emdRoot),b=$('#emdT2',emdRoot);const v=a.value;a.value=b.value;b.value=v;
    localStorage.setItem('emd_t1',a.value);localStorage.setItem('emd_t2',b.value)}
  function limpar(id){const c=$('#'+id,emdRoot);if(!c)return;c.value=''}
  function toNebula(){const t=state.dictApplied;if(!t)return alert('Sem resultado');
    if(!window.Nebula?.pushDerivedDoc)return alert('Nebula indisponível');
    window.Nebula.pushDerivedDoc(`Fractal 369 · ${new Date().toLocaleString('pt-BR')}`,t,{fused:true,from:'emd'});
    alert('⇧ Enviado ao Nebula')}
  function fromNebula(id){
    const d=window.Nebula?.currentDoc;
    if(!d){alert('Nenhum doc aberto no Nebula');return}
    const c=$('#'+id,emdRoot);if(!c)return;
    c.value=d.content||d.name;c.dispatchEvent(new Event('input',{bubbles:true}));
    alert(`⇩ "${d.name}" carregado`);
  }
  function toggleDict(){
    state.dictEnabled=!state.dictEnabled;
    localStorage.setItem('emd_dict_enabled',state.dictEnabled?'1':'0');
    const t=$('[data-emd-action="toggle-dict"]',emdRoot);if(t)t.classList.toggle('on',state.dictEnabled);
    refresh();
  }

  // DICT UI
  function renderRules(){
    const list=$('#emdRulesList',emdRoot);if(!list)return;
    list.innerHTML='';
    if(!state.dictRules.length){list.innerHTML='<div class="emd-empty">Nenhuma regra.</div>';updateStats();return}
    state.dictRules.forEach((r,i)=>{
      const row=document.createElement('div');
      row.className='emd-rule'+(r.enabled?' on':'')+(r.wholeWord?' wb-on':'');
      row.innerHTML=`
        <div class="chk">${r.enabled?'✓':''}</div>
        <input type="text" data-field="from" value="${r.from}">
        <div class="arrow">→</div>
        <input type="text" data-field="to" value="${r.to}">
        <div class="wb">WB</div>
        <button class="del">✕</button>`;
      row.querySelector('.chk').addEventListener('click',e=>{e.stopPropagation();state.dictRules[i].enabled=!state.dictRules[i].enabled;saveRules();renderRules();refresh()});
      row.querySelector('.wb').addEventListener('click',e=>{e.stopPropagation();state.dictRules[i].wholeWord=!state.dictRules[i].wholeWord;saveRules();renderRules();refresh()});
      row.querySelector('.del').addEventListener('click',e=>{e.stopPropagation();state.dictRules.splice(i,1);saveRules();renderRules();refresh()});
      row.querySelectorAll('input').forEach(inp=>{
        inp.addEventListener('input',e=>{state.dictRules[i][e.target.dataset.field]=e.target.value;saveRules();refresh()});
        inp.addEventListener('click',e=>e.stopPropagation());
      });
      list.appendChild(row);
    });
    updateStats();
  }
  const saveRules=()=>{try{localStorage.setItem('emd_dict_rules',JSON.stringify(state.dictRules))}catch{}};
  function loadRules(){try{const s=localStorage.getItem('emd_dict_rules');if(s){const p=JSON.parse(s);if(Array.isArray(p))return p}}catch{}return[]}

  // DELEGATION
  function bindAll(root){
    // Merge
    $('#emdMergeBtn',root)?.addEventListener('click',doMerge);

    // Actions
    root.addEventListener('click',e=>{
      const a=e.target.closest('[data-emd-action]');
      if(a){
        const act=a.dataset.emdAction;
        if(act==='paste'){e.stopPropagation();colar(a.dataset.target);return}
        if(act==='clear-field'){e.stopPropagation();limpar(a.dataset.target);return}
        if(act==='from-nebula'){e.stopPropagation();fromNebula(a.dataset.target);return}
        if(act==='copy-result'){e.stopPropagation();copiar();return}
        if(act==='download-result'){e.stopPropagation();baixar();return}
        if(act==='result-to-seed'){e.stopPropagation();toSeed();return}
        if(act==='result-to-mirror'){e.stopPropagation();toMirror();return}
        if(act==='swap'){e.stopPropagation();swap();return}
        if(act==='toggle-tts'){e.stopPropagation();toggleTTS();return}
        if(act==='play-sonoro'){e.stopPropagation();state.view='sonoro';renderView();setTimeout(startSonoro,60);return}
        if(act==='toggle-dict'){e.stopPropagation();toggleDict();return}
        if(act==='emd-to-nebula'){e.stopPropagation();toNebula();return}
      }
      const tab=e.target.closest('.emd-tab');
      if(tab){
        const nv=tab.dataset.emdView;
        if(nv!=='sonoro'&&sonoroPlaying)stopSonoro();
        state.view=nv;state.sliceShowAll=false;renderView();return;
      }
      const sn=e.target.closest('[data-emd-slice]');
      if(sn){
        const k=sn.dataset.emdSlice;const t=state.slices.length;if(!t)return;
        if(k==='next'&&!state.sliceShowAll)state.sliceIndex=(state.sliceIndex+1)%t;
        else if(k==='prev'&&!state.sliceShowAll)state.sliceIndex=(state.sliceIndex-1+t)%t;
        else if(k==='all')state.sliceShowAll=!state.sliceShowAll;
        renderSlices();return;
      }
      const sm=e.target.closest('.emd-smode');
      if(sm){
        state.sliceMode=sm.dataset.emdSmode;
        $$('.emd-smode',root).forEach(x=>x.classList.toggle('active',x.dataset.emdSmode===state.sliceMode));
        state.slices=makeSlices(state.dictApplied);state.sliceIndex=0;renderSlices();return;
      }
      const cp=e.target.closest('[data-emd-slice-copy]');
      if(cp){const i=parseInt(cp.dataset.emdSliceCopy,10);const t=state.slices[i];
        if(t)navigator.clipboard?.writeText(t);return}
      const sd=e.target.closest('[data-emd-slice-seed]');
      if(sd){const i=parseInt(sd.dataset.emdSliceSeed,10);const t=state.slices[i];
        if(t){$('#emdT1',root).value=t;$('#emdSeed',root).open=true};return}
      const mr=e.target.closest('[data-emd-slice-mirror]');
      if(mr){const i=parseInt(mr.dataset.emdSliceMirror,10);const t=state.slices[i];
        if(t){$('#emdT2',root).value=t;$('#emdMirror',root).open=true};return}
      const pl=e.target.closest('[data-emd-slice-play]');
      if(pl){const i=parseInt(pl.dataset.emdSlicePlay,10);const t=state.slices[i];
        if(t){state.sliceIndex=i;renderSlices();toggleTTS(t)};return}
      const f=e.target.closest('.emd-fmt');
      if(f){const k=f.dataset.emdFmt;state.fmt[k]=!state.fmt[k];f.classList.toggle('on',state.fmt[k]);saveFmt();refresh();return}
      const dp=e.target.closest('.emd-dict-p');
      if(dp){const k=dp.dataset.emdPreset;
        if(k==='vazio'){if(!confirm('Limpar?'))return;state.dictRules=[];saveRules();renderRules();refresh();return}
        const p=DICT_PRESETS[k];if(!p)return;state.dictRules=JSON.parse(JSON.stringify(p));
        saveRules();renderRules();refresh();return}
    });

    // Inputs
    $('#emdSliceSize',root)?.addEventListener('input',e=>{
      state.sliceSize=Math.max(80,Math.min(2000,parseInt(e.target.value,10)||420));
      if(state.sliceMode==='char'){state.slices=makeSlices(state.dictApplied);state.sliceIndex=0;renderSlices()}});
    $('#emdFmtWords',root)?.addEventListener('input',e=>{
      state.fmt.wordsPerParagraph=Math.max(4,Math.min(60,parseInt(e.target.value,10)||12));saveFmt()});
    $('#emdSlicePlay',root)?.addEventListener('click',()=>{
      const s=state.slices[state.sliceIndex]||state.dictApplied;toggleTTS(s)});
    $('#emdAddRule',root)?.addEventListener('click',()=>{
      state.dictRules.push({from:'',to:'',wholeWord:true,enabled:true});saveRules();renderRules()});
    $('#emdExportRules',root)?.addEventListener('click',()=>{
      const b=new Blob([JSON.stringify(state.dictRules,null,2)],{type:'application/json'});
      const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='pato.json';a.click()});
    $('#emdImportRules',root)?.addEventListener('click',()=>$('#emdImportFile',root).click());
    $('#emdImportFile',root)?.addEventListener('change',async e=>{
      const f=e.target.files[0];if(!f)return;
      try{const t=await f.text();const p=JSON.parse(t);
        if(!Array.isArray(p))throw 0;
        state.dictRules=p.map(r=>({from:String(r.from??''),to:String(r.to??''),wholeWord:!!r.wholeWord,enabled:r.enabled!==false}));
        saveRules();renderRules();refresh()}catch{alert('JSON inválido')}
      e.target.value=''});
    $('#emdSonPlay',root)?.addEventListener('click',startSonoro);
    $('#emdSonStop',root)?.addEventListener('click',stopSonoro);
    $('#emdSonBpm',root)?.addEventListener('input',e=>{if(sonoroStarted&&toneOk())Tone.Transport.bpm.rampTo(parseInt(e.target.value,10)||130,.2)});
    $('#emdSonRev',root)?.addEventListener('input',e=>{if(sonoroReverb)sonoroReverb.wet.value=Math.max(0,Math.min(100,parseInt(e.target.value,10)||0))/100});
    ['emdSonTheme','emdSonSynth'].forEach(id=>$('#'+id,root)?.addEventListener('change',()=>{
      if(sonoroPlaying){stopSonoro();setTimeout(startSonoro,80)}}));
    ['emdT1','emdT2'].forEach(id=>$('#'+id,root)?.addEventListener('input',e=>{
      localStorage.setItem(id==='emdT1'?'emd_t1':'emd_t2',e.target.value)}));
  }
  const saveFmt=()=>{try{localStorage.setItem('emd_fmt',JSON.stringify(state.fmt))}catch{}};
  function loadFmt(){try{const s=localStorage.getItem('emd_fmt');if(s)state.fmt={...state.fmt,...JSON.parse(s)}}catch{}}

  // BOOT EMD
  function bootEMD(root){
    emdRoot=root;
    state.dictRules=loadRules();
    if(!state.dictRules.length){state.dictRules=JSON.parse(JSON.stringify(DICT_PRESETS.patoDoMundo));saveRules()}
    state.dictEnabled=localStorage.getItem('emd_dict_enabled')==='1';
    loadFmt();
    const t1=localStorage.getItem('emd_t1'),t2=localStorage.getItem('emd_t2'),ult=localStorage.getItem('emd_ultimo');
    if(t1)$('#emdT1',root).value=t1;
    if(t2)$('#emdT2',root).value=t2;
    if(ult){state.rawMerge=ult;$('#emdResultPanel',root).style.display='block';$('#emdResultEmpty',root).style.display='none'}
    renderRules();
    const tsw=$('[data-emd-action="toggle-dict"]',root);if(tsw)tsw.classList.toggle('on',state.dictEnabled);
    $$('.emd-fmt',root).forEach(b=>b.classList.toggle('on',!!state.fmt[b.dataset.emdFmt]));
    const wi=$('#emdFmtWords',root);if(wi)wi.value=state.fmt.wordsPerParagraph;
    $$('.emd-smode',root).forEach(x=>x.classList.toggle('active',x.dataset.emdSmode===state.sliceMode));
    bindAll(root);
    refresh();
    updateTTSBtn();updateSonoroUI();
    console.log('[EMD] pronto · Fractal 369 + Pato + Sonoro');
  }

  // ABRIR EMD como session window
  window.openEMD=function(){
    // Se já existe, traz pra frente
    const existing=document.getElementById('session-emd') || document.getElementById('session-iframe');
    if(existing){
      existing.id='session-emd';
      existing.classList.remove('minimized','collapsed');
      existing.classList.add('peeked');
      if(!existing.querySelector('#emdSlot')){
        const slot=existing.querySelector('#initialEmdSlot');
        if(slot){
          slot.id='emdSlot';
          slot.appendChild(document.getElementById('tpl-emd').content.cloneNode(true));
          bootEMD(slot);
        }
      }
      window.maximizeWindow?.('session-emd');
      return existing;
    }
    const win=window.createSessionWindow({title:'Espaço da Mente'});
    if(!win)return null;
    win.id='session-emd';
    // Substitui frame por conteúdo do template
    win.querySelector('.win-frame')?.remove();
    const content=document.createElement('div');
    content.className='win-content';
    content.id='emdSlot';
    content.appendChild(document.getElementById('tpl-emd').content.cloneNode(true));
    win.appendChild(content);
    bootEMD(content);
    // Abre automaticamente maximizado
    setTimeout(()=>window.maximizeWindow?.('session-emd'),80);
    return win;
  };
  window.EMD={open:window.openEMD,get state(){return state}};
  /* FSW inicial: já nasce como Espaço da Mente, sem iframe/URL. */
  setTimeout(()=>{
    try{
      const win=document.getElementById('session-iframe');
      const slot=document.getElementById('initialEmdSlot');
      if(win && slot && !win.querySelector('#emdSlot')){
        win.id='session-emd';
        slot.id='emdSlot';
        slot.appendChild(document.getElementById('tpl-emd').content.cloneNode(true));
        bootEMD(slot);
        win.querySelector('.win-title')?.replaceChildren(document.createTextNode('ESPAÇO DA MENTE · FSW'));
      }
    }catch(err){ console.warn('[EMD] boot inicial:',err); }
  },120);

  console.log('[Almasliber ⊕ EMD] carregado · use 🧠 ou clique em "Espaço da Mente"');
})();

/* =========================================================
   kob-user-cockpit-bind.js
   ========================================================= */
(function(){
  const $=s=>document.querySelector(s);
  function close(){
    $('#drawerProfile')?.classList.remove('on');
    $('#drawerOverlay')?.classList.remove('on');
    $('#drawerProfile')?.setAttribute('aria-hidden','true');
    $('#drawerOverlay')?.setAttribute('aria-hidden','true');
  }
  $('#drawerClose')?.addEventListener('click',close);
  $('#drawerOverlay')?.addEventListener('click',close);
  $('#orbToggle')?.addEventListener('click',()=>window.KOBCockpit?.toggle());
  $('#btnCycleSolar')?.addEventListener('click',()=>window.DualTheme?.toggle?.());
  $('#btnAutoSolar')?.addEventListener('click',()=>window.DualTheme?.auto?.());
  const user=localStorage.getItem('di_userName')||'';
  const model=localStorage.getItem('di_modelName')||'';
  const ui=$('#inputUserId'), mi=$('#inputModel');
  if(ui)ui.value=user;
  if(mi)mi.value=model;
  ui?.addEventListener('change',()=>localStorage.setItem('di_userName',ui.value.trim()));
  mi?.addEventListener('change',()=>localStorage.setItem('di_modelName',mi.value.trim()));
})();

/* =========================================================
   fusion-orb-generator.js
   ========================================================= */
(function(){
function injectOrbStyles() {
  if (document.getElementById('dual-orb-styles')) return;

  const style = document.createElement('style');
  style.id = 'dual-orb-styles';
  style.innerHTML = `
    @keyframes orbBreathe {
      0%, 100% { transform: translateZ(0) scale(1); opacity: .82; filter: brightness(1); }
      50%      { transform: translateZ(0) scale(1.08); opacity: 1;   filter: brightness(1.22); }
    }

    @keyframes orbSpin {
      from { transform: rotate(0deg); }
      to   { transform: rotate(360deg); }
    }

    @keyframes orbPulse {
      0%   { transform: scale(.78); opacity: .55; }
      100% { transform: scale(1.28); opacity: 0; }
    }

    @keyframes orbFloat {
      0%, 100% { transform: translateY(0px) rotateX(0deg) rotateY(0deg); }
      50%      { transform: translateY(-2px) rotateX(10deg) rotateY(-10deg); }
    }

    .dual-orb-wrap {
      --orb-speed: 4s;
      --orb-spin-speed: 12s;
      --orb-pulse-speed: 2.2s;

      position: relative;
      display: inline-grid;
      place-items: center;
      width: var(--orb-size, 64px);
      aspect-ratio: 1;
      perspective: 900px;
      transform-style: preserve-3d;
      user-select: none;
      cursor: pointer;
      transition: transform .28s cubic-bezier(.175,.885,.32,1.275);
    }

    .dual-orb-wrap:active {
      transform: scale(.94);
    }

    .dual-orb-wrap:hover {
      transform: scale(1.03);
    }

    .dual-orb-svg {
      width: 100%;
      height: 100%;
      display: block;
      opacity: .78;
      filter: brightness(.72) saturate(1.08);
      transform: translateZ(0);
    }

    .dual-orb-shell {
      position: absolute;
      inset: 10%;
      display: grid;
      place-items: center;
      transform-style: preserve-3d;
      animation: orbFloat 6s ease-in-out infinite;
      pointer-events: none;
    }

    .dual-orb-halo {
      position: absolute;
      inset: -24%;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(120,227,255,.24), rgba(185,120,255,.06) 42%, transparent 70%);
      filter: blur(18px);
      opacity: .9;
      animation: orbPulse var(--orb-pulse-speed) ease-in-out infinite;
      transform: translateZ(-18px);
    }

    .dual-orb-core {
      position: relative;
      width: 42%;
      height: 42%;
      border-radius: 50%;
      transform-style: preserve-3d;
      transform: translateZ(18px);
      background:
        radial-gradient(circle at 30% 28%, rgba(255,255,255,.95) 0%, rgba(255,255,255,.32) 8%, rgba(255,255,255,0) 26%),
        radial-gradient(circle at 70% 72%, var(--orb-primary, #78e3ff) 0%, var(--orb-secondary, #b978ff) 74%);
      box-shadow:
        0 0 16px rgba(120,227,255,.55),
        0 0 34px rgba(120,227,255,.25),
        inset -10px -12px 20px rgba(0,0,0,.38),
        inset 10px 10px 18px rgba(255,255,255,.12);
      animation: orbSpin var(--orb-spin-speed) linear infinite;
    }

    .dual-orb-core::before {
      content: "";
      position: absolute;
      inset: -42%;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(255,255,255,.16), transparent 66%);
      filter: blur(10px);
      opacity: .75;
    }

    .dual-orb-core::after {
      content: "";
      position: absolute;
      inset: 12%;
      border-radius: 50%;
      background: radial-gradient(circle at 35% 35%, rgba(255,255,255,.65), transparent 58%);
      opacity: .55;
      mix-blend-mode: screen;
    }

    .dual-orb-wrap.speaking .dual-orb-core {
      animation:
        orbSpin 2s linear infinite,
        orbBreathe .55s ease-in-out infinite alternate;
    }

    .dual-orb-wrap.speaking .dual-orb-halo {
      animation:
        orbPulse .85s ease-in-out infinite;
    }

    .dual-orb-wrap:hover .dual-orb-core {
      box-shadow:
        0 0 20px rgba(120,227,255,.7),
        0 0 42px rgba(120,227,255,.36),
        inset -10px -12px 20px rgba(0,0,0,.34),
        inset 10px 10px 18px rgba(255,255,255,.14);
    }
  `;
  document.head.appendChild(style);
}

function makeOrbAvatar(name = 'DUAL', size = 64) {
  injectOrbStyles();

  const safe = String(name || 'DUAL').trim() || 'DUAL';
  const seed = safe.split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  const h1 = seed % 360;
  const h2 = (seed * 37) % 360;
  const uid = Math.random().toString(36).slice(2, 7);
  const gradId = `orb_${seed.toString(36)}_${uid}`;

  return `
    <div
      class="dual-orb-wrap"
      id="${gradId}"
      style="--orb-size:${size}px; --orb-primary:hsl(${h1},100%,62%); --orb-secondary:hsl(${h2},92%,48%);"
      aria-label="${safe}"
      role="img"
    >
      <svg class="dual-orb-svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <defs>
          <radialGradient id="${gradId}_core" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="hsl(${h1},100%,66%)" stop-opacity="1"/>
            <stop offset="55%" stop-color="hsl(${h2},92%,46%)" stop-opacity=".9"/>
            <stop offset="100%" stop-color="hsl(${h2},100%,12%)" stop-opacity="0"/>
          </radialGradient>

          <linearGradient id="${gradId}_ring" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="hsl(${h1},100%,76%)"/>
            <stop offset="100%" stop-color="hsl(${h2},100%,58%)"/>
          </linearGradient>
        </defs>

        <circle cx="50" cy="50" r="46" fill="#05070c"/>
        <circle cx="50" cy="50" r="40" fill="url(#${gradId}_core)" opacity=".28"/>
        <circle cx="50" cy="50" r="38" fill="none" stroke="url(#${gradId}_ring)" stroke-width="1"/>
        <circle cx="50" cy="50" r="46" fill="none" stroke="url(#${gradId}_ring)" stroke-width="2.5"
          stroke-dasharray="70 20 10 30" stroke-linecap="round" opacity=".86"/>
        <circle cx="50" cy="50" r="8" fill="#ffffff" opacity=".22" filter="blur(2px)"/>
        <circle cx="50" cy="50" r="3" fill="#ffffff" opacity=".85"/>
      </svg>

      <div class="dual-orb-shell">
        <div class="dual-orb-halo"></div>
        <div class="dual-orb-core"></div>
      </div>
    </div>
  `;
}

window.makeOrbAvatar = makeOrbAvatar;
window.makeMiniAvatar = (name) => makeOrbAvatar(name, 24);

})();

/* =========================================================
   fusion-card-core.js
   ========================================================= */
(function FusionCard(){
/* FUSION CORE LOGIC (V7)
   Preserving di_ constants for external app communication
*/

// Helper: pega o primeiro ID existente
const byId = (...ids) => ids.map(id => document.getElementById(id)).find(Boolean);

// REFERENCES
const els = {
  card: byId('mainCard'),
  header: byId('cardHeader'),
  avatarTgt: byId('avatarTarget'),
  input: byId('kardinputUser', 'inputUser', 'userInput'),
  lblHello: byId('lblHello'),
  lblName: byId('lblName'),
  clock: byId('clockTime'),
  smallPreview: byId('smallPreview'),
  smallMiniAvatar: byId('smallMiniAvatar'),
  smallText: byId('smallText'),
  smallIdent: byId('smallIdent'),
  actCard: byId('activationCard'),
  actPre: byId('actPre'),
  actName: byId('actName'),
  actMiniAvatar: byId('actMiniAvatar'),
  actBadge: byId('actBadge'),
  // Buttons
  btnModeCard: byId('btnModeCard'),
  btnModeOrb: byId('btnModeOrb'),
  btnModeHud: byId('btnModeHud'),
  orbMenuTrigger: byId('orbMenuTrigger'),
  hudMenuBtn: byId('hudMenuBtn'),
  snapZone: byId('snap-zone'),
  // Keys UI
  keysModal: byId('keysModal'),
  keyList: byId('keyList'),
  keyName: byId('keyNameInput'),
  keyToken: byId('keyTokenInput'),
  addKeyBtn: byId('addKeyBtn'),
  closeKeysBtn: byId('closeKeysBtn'),
  lockVaultBtn: byId('lockVaultBtn'),
  vaultStatusText: byId('vaultStatusText'),
  // Vault UI
  vaultModal: byId('vaultModal'),
  vaultPass: byId('vaultPassInput'),
  vaultUnlock: byId('vaultUnlockBtn'),
  vaultCancel: byId('vaultCancelBtn'),
  // System UI
  systemCard: byId('systemCard'),
  saveSystemBtn: byId('saveSystemBtn'),
  copyActBtn: byId('copyActBtn')
};

// --- CRYPTO UTILS ---
const CRYPTO = {
  algo: { name: 'AES-GCM', length: 256 },
  pbkdf2: { name: 'PBKDF2', hash: 'SHA-256', iterations: 100000 },
  async getKey(password, salt) {
    const enc = new TextEncoder();
    const keyMaterial = await window.crypto.subtle.importKey("raw", enc.encode(password), "PBKDF2", false, ["deriveKey"]);
    return window.crypto.subtle.deriveKey({ ...this.pbkdf2, salt: salt }, keyMaterial, this.algo, false, ["encrypt", "decrypt"]);
  },
  async encrypt(data, password) {
    const salt = window.crypto.getRandomValues(new Uint8Array(16));
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const key = await this.getKey(password, salt);
    const encoded = new TextEncoder().encode(JSON.stringify(data));
    const encrypted = await window.crypto.subtle.encrypt({ name: "AES-GCM", iv: iv }, key, encoded);
    const bundle = { s: Array.from(salt), iv: Array.from(iv), d: Array.from(new Uint8Array(encrypted)) };
    return JSON.stringify(bundle);
  },
  async decrypt(bundleStr, password) {
    try {
      const bundle = JSON.parse(bundleStr);
      const salt = new Uint8Array(bundle.s);
      const iv = new Uint8Array(bundle.iv);
      const data = new Uint8Array(bundle.d);
      const key = await this.getKey(password, salt);
      const decrypted = await window.crypto.subtle.decrypt({ name: "AES-GCM", iv: iv }, key, data);
      return JSON.parse(new TextDecoder().decode(decrypted));
    } catch(e) { throw new Error("Senha incorreta ou dados corrompidos"); }
  }
};

// --- STATE & PERSISTENCE ---
const STORAGE_KEY = 'fusion_os_data_v2';
const UI_STATE_KEY = 'fusion_os_ui_state';

let STATE = {
  keys: [],
  user: 'Convidado',
  isEncrypted: false,
  encryptedData: null
};
let SESSION_PASSWORD = null;

// IMPORTANT: Loading initial di_ constants if available
let apiKey = localStorage.getItem('di_apiKey') || '';
let modelName = localStorage.getItem('di_modelName') || 'nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free';
let userName = localStorage.getItem('di_userName') || '';
let infodoseName = localStorage.getItem('di_infodoseName') || '';

function saveUIState() {
  const mode = state.isOrb ? 'orb' : (state.isHud ? 'hud' : 'card');
  const uiState = {
    mode: mode,
    left: els.card?.style.left || '',
    top: els.card?.style.top || ''
  };
  localStorage.setItem(UI_STATE_KEY, JSON.stringify(uiState));
}

function loadUIState() {
  const raw = localStorage.getItem(UI_STATE_KEY);
  if (!raw) return;
  try {
    const ui = JSON.parse(raw);
    if (ui.mode === 'orb' || ui.mode === 'hud') {
      if (els.card) els.card.style.transition = 'none';
      if (ui.mode === 'orb') {
        if (ui.left && els.card) els.card.style.left = ui.left;
        if (ui.top && els.card) els.card.style.top = ui.top;
        window.setMode('orb', true);
      } else {
        window.setMode('hud', true);
      }
      setTimeout(() => { if (els.card) els.card.style.transition = ''; }, 200);
    }
  } catch(e) { console.error("UI Load Error", e); }
}

function saveData() {
  const payload = { keys: STATE.keys, user: STATE.user };
  if (SESSION_PASSWORD) {
    CRYPTO.encrypt(payload, SESSION_PASSWORD).then(enc => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ isEncrypted: true, data: enc }));
      STATE.isEncrypted = true;
      STATE.encryptedData = enc;
      updateSecurityUI();
    });
  } else {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ isEncrypted: false, data: payload }));
  }
}

async function loadData() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return;
  const parsed = JSON.parse(raw);
  if (parsed.isEncrypted) {
    STATE.isEncrypted = true;
    STATE.encryptedData = parsed.data;
    updateSecurityUI();
  } else {
    STATE.keys = parsed.data.keys || [];
    STATE.user = parsed.data.user || 'Convidado';

    const active = STATE.keys.find(k => k.active);
    if (active && active.token) {
      localStorage.setItem('di_apiKey', active.token);
      apiKey = active.token;
    }

    if (STATE.user !== 'Convidado') {
      localStorage.setItem('di_userName', STATE.user);
      userName = STATE.user;
      const userInput = byId('kardinputUser', 'inputUser', 'userInput');
      if (userInput) userInput.value = STATE.user;
    }

    updateInterface(STATE.user);
    renderKeysList();
  }

  const apiInput = byId('kardapiKeyInput', 'apiKeyInput', 'cardApiKeyInput');
  const infoInput = byId('kardinfodoseNameInput', 'infodoseNameInput', 'cardInfodoseNameInput');
  const modelInput = byId('kardmodelSelect', 'modelSelect', 'cardModelSelect');

  if (apiInput) apiInput.value = apiKey;
  if (infoInput) infoInput.value = infodoseName;
  if (modelInput) modelInput.value = modelName;
}

const hashStr = s => { let h = 0xdeadbeef; for (let i = 0; i < s.length; i++) { h = Math.imul(h ^ s.charCodeAt(i), 2654435761); } return (h ^ h >>> 16) >>> 0; };

/* [FIX] updateInterface unificada — usa makeOrbAvatar (orb 3D animado) em vez das
   funções createSvg/createMiniSvg (removidas por serem redundantes e não usadas
   em mais nenhum lugar). Também é a única definição desta função no arquivo —
   havia uma segunda cópia mais abaixo que referenciava a variável inexistente
   "di_userName" e quebrava com ReferenceError sempre que "name" vinha vazio. */
function updateInterface(name) {
  const safe = name || 'Convidado';
  if (els.lblName) els.lblName.innerText = safe;
  if (els.input) els.input.value = safe;
  const activeKey = STATE.keys.find(k => k.active);
  if (els.smallIdent) els.smallIdent.innerText = activeKey ? activeKey.name : '--';
  if (els.actBadge) els.actBadge.innerText = activeKey ? `key:${activeKey.name}` : 'v:--';
  if (els.avatarTgt) els.avatarTgt.innerHTML = window.makeOrbAvatar ? window.makeOrbAvatar(safe, 64) : '';
  if (els.smallMiniAvatar) els.smallMiniAvatar.innerHTML = window.makeOrbAvatar ? window.makeOrbAvatar(safe, 24) : '';
  if (els.actMiniAvatar) els.actMiniAvatar.innerHTML = window.makeOrbAvatar ? window.makeOrbAvatar(safe, 36) : '';
  if (els.actName) els.actName.innerText = safe;
  const phrases = ["Foco estável.", "Ritmo criativo.", "Percepção sutil."];
  if (els.smallText) els.smallText.innerText = activeKey ? `${activeKey.name} [ATIVO]` : (safe === 'Convidado' ? 'Aguardando...' : `${safe} · ${phrases[safe.length % phrases.length]}`);
  const line = `+${'-'.repeat(safe.length + 4)}+`;
  if (els.actPre) els.actPre.innerText = `${line}\n| ${safe.toUpperCase()} |\n${line}\nID: ${hashStr(safe).toString(16)}`;
}

function updateSecurityUI() {
  if (!els.vaultStatusText || !els.lockVaultBtn) return;
  if (SESSION_PASSWORD) {
    els.vaultStatusText.innerText = "Cofre Protegido (Destrancado)";
    els.lockVaultBtn.innerText = "TRANCAR";
  } else if (STATE.isEncrypted) {
    els.vaultStatusText.innerText = "Cofre Trancado";
    els.lockVaultBtn.innerText = "REDEFINIR";
  } else {
    els.vaultStatusText.innerText = "Cofre Aberto (Sem senha)";
    els.lockVaultBtn.innerText = "CRIAR SENHA";
  }
}

function renderKeysList() {
  if (!els.keyList) return;
  els.keyList.innerHTML = '';
  if (STATE.keys.length === 0) {
    els.keyList.innerHTML = '<div style="color:rgba(255,255,255,0.3);text-align:center;padding:20px">Nenhuma chave armazenada.</div>';
    return;
  }
  STATE.keys.forEach(k => {
    const div = document.createElement('div');
    div.className = `key-item ${k.active ? 'active-item' : ''}`;
    div.innerHTML = `
      <div class="meta" style="flex:1"><div style="font-weight:700;font-size:0.9rem">${escapeHtml(k.name)}</div></div>
      <div class="actions">
        ${!k.active ? `<button class="small-btn" onclick="setActiveKey('${k.id}')">ATIVAR</button>` : `<span style="font-size:0.7rem;font-weight:700;color:var(--neon-cyan);margin-right:10px">ATIVA</span>`}
        <button class="small-btn danger" onclick="removeKey('${k.id}')"><span class="ico" style="font-size:14px" aria-hidden="true">✕</span></button>
      </div>`;
    els.keyList.appendChild(div);
  });
}

function addKey() {
  const name = els.keyName ? els.keyName.value.trim() : '';
  const token = els.keyToken ? els.keyToken.value.trim() : '';
  if (!name) { showToaster('Nome obrigatório', 'error'); return; }
  const newKey = { id: Date.now().toString(36), name, token, active: STATE.keys.length === 0 };
  STATE.keys.push(newKey);

  if (newKey.active && newKey.token) {
    localStorage.setItem('di_apiKey', newKey.token);
    apiKey = newKey.token;
  }

  saveData(); renderKeysList(); updateInterface(STATE.user);
  if (els.keyName) els.keyName.value = '';
  if (els.keyToken) els.keyToken.value = '';
  showToaster('Chave adicionada!', 'success');
}

window.removeKey = (id) => {
  if (confirm('Remover chave permanentemente?')) {
    STATE.keys = STATE.keys.filter(k => k.id !== id);
    saveData(); renderKeysList(); updateInterface(STATE.user);
  }
};

window.setActiveKey = (id) => {
  let activatedToken = null;
  STATE.keys.forEach(k => {
    k.active = (k.id === id);
    if (k.active) activatedToken = k.token;
  });

  if (activatedToken) {
    localStorage.setItem('di_apiKey', activatedToken);
    apiKey = activatedToken;
    const apiInput = byId('kardapiKeyInput', 'apiKeyInput', 'cardApiKeyInput');
    if (apiInput) apiInput.value = activatedToken;
    showToaster('Chave sincronizada com o Chat.', 'success');
  }

  saveData(); renderKeysList(); updateInterface(STATE.user);
};

// --- VAULT EVENTS ---
function openManager() {
  if (STATE.isEncrypted && !SESSION_PASSWORD) {
    if (els.vaultModal) els.vaultModal.style.display = 'flex';
    if (els.vaultPass) els.vaultPass.focus();
  } else {
    if (els.keysModal) els.keysModal.style.display = 'flex';
  }
}

if (els.vaultUnlock) els.vaultUnlock.addEventListener('click', async () => {
  const pass = els.vaultPass ? els.vaultPass.value : '';
  try {
    const decrypted = await CRYPTO.decrypt(STATE.encryptedData, pass);
    SESSION_PASSWORD = pass; STATE.keys = decrypted.keys; STATE.user = decrypted.user;
    const active = STATE.keys.find(k => k.active);

    if (active && active.token) { localStorage.setItem('di_apiKey', active.token); apiKey = active.token; }
    if (STATE.user) { localStorage.setItem('di_userName', STATE.user); userName = STATE.user; }

    if (els.vaultModal) els.vaultModal.style.display = 'none';
    if (els.keysModal) els.keysModal.style.display = 'flex';
    if (els.vaultPass) els.vaultPass.value = '';
    renderKeysList(); updateSecurityUI(); showToaster('Cofre destrancado.', 'success');
  } catch(e) { showToaster('Senha incorreta.', 'error'); }
});

if (els.lockVaultBtn) els.lockVaultBtn.addEventListener('click', () => {
  if (!SESSION_PASSWORD && !STATE.isEncrypted) {
    const newPass = prompt("Defina uma senha para o Cofre:");
    if (newPass) { SESSION_PASSWORD = newPass; saveData(); showToaster("Cofre trancado.", 'success'); }
  } else if (SESSION_PASSWORD) {
    SESSION_PASSWORD = null;
    if (els.keysModal) els.keysModal.style.display = 'none';
    showToaster("Sessão do cofre encerrada.", 'success');
  } else {
    showToaster("Cofre já criptografado. Desbloqueie para redefinir.", 'error');
  }
  updateSecurityUI();
});

if (els.vaultCancel) els.vaultCancel.addEventListener('click', () => { if (els.vaultModal) els.vaultModal.style.display = 'none'; });
if (els.closeKeysBtn) els.closeKeysBtn.addEventListener('click', () => { if (els.keysModal) els.keysModal.style.display = 'none'; });
if (els.addKeyBtn) els.addKeyBtn.addEventListener('click', addKey);

// --- CINEMATIC GESTURES & MODES (REFINED V7) ---
let state = {
  isOrb: false,
  isHud: false,
  isDragging: false,
  timer: null,
  startX: 0,
  startY: 0,
  dragOffsetX: 0,
  dragOffsetY: 0,
  pointerId: null
};

const FIRST_PREVIEW_DURATION = 5000;
const HUD_SNAP_THRESHOLD = 60;
const SWIPE_DOWN_THRESHOLD = 80;
const LONG_PRESS_MS = 350;

if (els.card) els.card.addEventListener('pointerdown', handleStart, { passive: false });
window.addEventListener('pointermove', handleMove, { passive: false });
window.addEventListener('pointerup', handleEnd, { passive: false });

// Opening Configs
if (els.avatarTgt) els.avatarTgt.addEventListener('click', (e) => { if (!state.isOrb && !state.isHud) openManager(); });
if (els.orbMenuTrigger) els.orbMenuTrigger.addEventListener('click', (e) => { e.stopPropagation(); window.setMode('card'); toggleSection('systemCard', true); });
if (els.hudMenuBtn) els.hudMenuBtn.addEventListener('click', (e) => { e.stopPropagation(); window.setMode('card'); toggleSection('systemCard', true); });

if (els.header) {
  els.header.addEventListener('click', (e) => {
    if (state.isHud && !state.isDragging && !e.target.closest('.hud-menu-btn')) {
      window.setMode('card');
      toggleSection('systemCard', true);
    }
  });
}

if (els.card) els.card.addEventListener('contextmenu', (e) => {
  if (state.isOrb || state.isHud) { e.preventDefault(); window.setMode('card'); }
});

function handleStart(e) {
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT' || (e.target.tagName === 'BUTTON' && !e.target.closest('.orb-menu-trigger'))) return;
  if (!state.isOrb && !state.isHud && !els.header?.contains(e.target)) return;

  state.startX = e.clientX;
  state.startY = e.clientY;
  state.pointerId = e.pointerId;

  if (state.isOrb || state.isHud) {
    state.isDragging = true;
    try { els.card.setPointerCapture(e.pointerId); } catch(err){}
    const rect = els.card.getBoundingClientRect();
    state.dragOffsetX = e.clientX - rect.left;
    state.dragOffsetY = e.clientY - rect.top;
    els.card.style.transition = 'none';
    return;
  }

  state.timer = setTimeout(() => {
    transmuteToOrb(e);
    saveUIState();
  }, LONG_PRESS_MS);
}

function handleMove(e) {
  if (!state.isOrb && !state.isHud && state.timer) {
    const dx = e.clientX - state.startX;
    const dy = e.clientY - state.startY;
    const dist = Math.hypot(dx, dy);

    if (dist > 12 && (dy < -10 || Math.abs(dx) > 18)) {
      clearTimeout(state.timer); state.timer = null;
      transmuteToOrb(e);
      const rect = els.card.getBoundingClientRect();
      state.dragOffsetX = e.clientX - rect.left;
      state.dragOffsetY = e.clientY - rect.top;
      try { els.card.setPointerCapture(e.pointerId); } catch(err){}
      els.card.style.transition = 'none';
    }
  }

  if (!state.isDragging) return;
  e.preventDefault();

  if (state.isOrb) {
    const x = e.clientX - state.dragOffsetX;
    const y = e.clientY - state.dragOffsetY;
    els.card.style.left = `${x}px`;
    els.card.style.top = `${y}px`;

    if (y < HUD_SNAP_THRESHOLD) els.snapZone?.classList.add('active');
    else els.snapZone?.classList.remove('active');

  } else if (state.isHud) {
    const deltaY = e.clientY - state.startY;
    if (deltaY > 0) {
      els.card.style.setProperty('transform', `translateX(-50%) translateY(${deltaY * 0.4}px)`, 'important');
      if (deltaY > SWIPE_DOWN_THRESHOLD) els.snapZone?.classList.add('active');
      else els.snapZone?.classList.remove('active');
    }
  }
}

function handleEnd(e) {
  if (state.timer) { clearTimeout(state.timer); state.timer = null; }

  if (state.isDragging) {
    state.isDragging = false;
    try { els.card.releasePointerCapture && els.card.releasePointerCapture(state.pointerId); } catch(err){}
    els.card.style.transition = '';
    els.snapZone?.classList.remove('active');

    if (state.isOrb) {
      const rect = els.card.getBoundingClientRect();
      if (rect.top < HUD_SNAP_THRESHOLD) {
        setMode('hud');
      } else {
        saveUIState();
      }
    } else if (state.isHud) {
      const deltaY = e.clientY - state.startY;
      if (deltaY > SWIPE_DOWN_THRESHOLD) {
        const x = e.clientX - 34;
        const y = e.clientY - 10;
        els.card.style.left = `${x}px`;
        els.card.style.top = `${y}px`;
        setMode('orb');
      } else {
        els.card.style.setProperty('transform', 'translateX(-50%) translateY(0)', 'important');
        const moved = Math.hypot(e.clientX - state.startX, e.clientY - state.startY);
        if (moved < 8) { window.setMode('card'); toggleSection('systemCard', true); }
      }
    }
  } else {
    if (!state.isOrb && !state.isHud && els.header?.contains(e.target)) {
      toggleCardState();
    }
  }
  state.pointerId = null;
}

function transmuteToOrb(eOrX) {
  let x, y, ev;
  if (eOrX && eOrX.clientX !== undefined) { ev = eOrX; x = ev.clientX; y = ev.clientY; }
  else { return; }

  if (navigator.vibrate) navigator.vibrate(40);
  els.card.classList.add('orb', 'closed');
  els.card.classList.remove('content-visible');

  els.card.style.left = (x - 34) + 'px';
  els.card.style.top = (y - 34) + 'px';

  state.isOrb = true; state.isHud = false;

  state.isDragging = true;
  if (ev && ev.pointerId) {
    state.pointerId = ev.pointerId;
    try { els.card.setPointerCapture(ev.pointerId); } catch(e){}
    const rect = els.card.getBoundingClientRect();
    state.dragOffsetX = x - rect.left;
    state.dragOffsetY = y - rect.top;
  }

  updateModeButtons('orb');
}

function revertToCard() {
  state.isOrb = false; state.isHud = false;
  els.card.style.transition = 'all 0.5s var(--ease-smooth)';
  els.card.style.left = ''; els.card.style.top = '';
  els.card.style.width = ''; els.card.style.height = '';
  els.card.style.transform = '';
  els.card.classList.remove('orb', 'hud', 'closed');
  setTimeout(() => els.card.classList.add('content-visible'), 300);
}

window.setMode = (mode, isInitialLoad = false) => {
  updateModeButtons(mode);

  if (mode === 'card') {
    revertToCard();
  } else if (mode === 'orb') {
    state.isOrb = true; state.isHud = false;
    els.card.classList.add('orb', 'closed');
    els.card.classList.remove('hud', 'content-visible');
    els.card.style.transform = 'none';
  } else if (mode === 'hud') {
    state.isHud = true; state.isOrb = false;
    els.card.classList.add('hud', 'closed');
    els.card.classList.remove('orb', 'content-visible');
    els.card.style.top = '';
    els.card.style.left = '';
    els.card.style.transform = '';
  }

  if (!isInitialLoad) saveUIState();
};

function updateModeButtons(mode) {
  [els.btnModeCard, els.btnModeOrb, els.btnModeHud].forEach(b => b && b.classList.remove('active-mode'));
  if (mode === 'card' && els.btnModeCard) els.btnModeCard.classList.add('active-mode');
  if (mode === 'orb' && els.btnModeOrb) els.btnModeOrb.classList.add('active-mode');
  if (mode === 'hud' && els.btnModeHud) els.btnModeHud.classList.add('active-mode');
}

function toggleCardState() {
  if (els.card.classList.contains('animating')) return;
  const isClosed = els.card.classList.contains('closed');
  els.card.classList.add('animating');
  if (isClosed) {
    els.card.classList.remove('closed');
    els.card.animate([{ transform: 'scale(0.95)', opacity: 0.8 }, { transform: 'scale(1)', opacity: 1 }], { duration: 400 }).onfinish = () => {
      els.card.classList.remove('animating');
      els.card.classList.add('content-visible');
    };
  } else {
    els.card.classList.remove('content-visible');
    els.card.animate([{ transform: 'translateY(0)', opacity: 1 }, { transform: 'translateY(10px)', opacity: 1 }], { duration: 200 }).onfinish = () => {
      els.card.classList.add('closed');
      els.card.classList.remove('animating');
    };
  }
}

function escapeHtml(s) { return s ? s.replace(/[&<>"']/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c])) : ''; }
function showToaster(txt, type = 'default') {
  const wrap = document.getElementById('toasterWrap');
  if (!wrap) return;
  const t = document.createElement('div');
  t.className = `toaster ${type}`;
  t.innerText = txt;
  wrap.appendChild(t);
  setTimeout(() => t.classList.add('show'), 10);
  setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 300); }, 2500);
}
function toggleSection(id, forceOpen = false) {
  const el = document.getElementById(id);
  if (!el) return;
  const h = el.classList.contains('activation-hidden');
  if (forceOpen && !h) return;
  el.classList.toggle('activation-hidden', !forceOpen && !h);
  el.classList.toggle('activation-open', forceOpen || h);
}

// Logic Init
if (els.input) {
  els.input.addEventListener('input', (e) => {
    STATE.user = e.target.value;
    localStorage.setItem('di_userName', STATE.user);
    updateInterface(e.target.value);
    saveData();
  });
}

if (els.copyActBtn) {
  els.copyActBtn.addEventListener('click', async () => {
    try {
      const txt = document.getElementById('actPre')?.innerText || '';
      await navigator.clipboard.writeText(txt);
      showToaster('Ativação copiada', 'success');
    } catch(e) { showToaster('Erro ao copiar ativação', 'error'); }
  });
}

if (els.saveSystemBtn) {
  els.saveSystemBtn.addEventListener('click', () => {
    infodoseName = byId('kardinfodoseNameInput', 'infodoseNameInput', 'cardInfodoseNameInput')?.value.trim() || '';
    const newKey = byId('kardapiKeyInput', 'apiKeyInput', 'cardApiKeyInput')?.value.trim() || '';
    const newModel = byId('kardmodelSelect', 'modelSelect', 'cardModelSelect')?.value.trim() || '';

    if (newKey) {
      apiKey = newKey;
      localStorage.setItem('di_apiKey', apiKey);
      if (typeof STATE !== 'undefined') {
        const active = STATE.keys.find(k => k.active);
        if (active) { active.token = newKey; saveData(); }
      }
    }

    modelName = newModel || modelName;
    localStorage.setItem('di_modelName', modelName);
    localStorage.setItem('di_infodoseName', infodoseName);

    toggleSection('systemCard', false);
    showToaster('Configurações Salvas (di_ synced)', 'success');
  });
}

// KEY para controlar primeira exibição do small preview
const FIRST_PREVIEW_KEY = 'fusion_orb_smallpreview_shown';

function showFirstRunPreviewIfNeeded() {
  try {
    if (localStorage.getItem(FIRST_PREVIEW_KEY)) return;
    if (state.isOrb || state.isHud) return;

    const rawUi = localStorage.getItem(UI_STATE_KEY);
    if (rawUi) {
      try {
        const parsed = JSON.parse(rawUi);
        if (parsed && parsed.mode === 'orb') return;
      } catch(_) {}
    }

    els.card.classList.add('closed');
    if (els.smallPreview) {
      els.smallPreview.style.display = 'flex';
      els.smallPreview.style.opacity = 0;
      requestAnimationFrame(() => els.smallPreview.style.transition = 'opacity 260ms ease-out');
      requestAnimationFrame(() => els.smallPreview.style.opacity = 1);
    }

    els.card.classList.remove('content-visible');
    localStorage.setItem(FIRST_PREVIEW_KEY, '1');
    saveUIState();

  } catch (err) {
    console.error('First preview error', err);
  }
}

// INITIAL LOAD — no cockpit o card nasce colado no topo (HUD)
setTimeout(() => {
  els.card?.classList.add('active');
  els.avatarTgt?.classList.add('shown');

  Promise.resolve(loadData()).then(() => {
    const nm = localStorage.getItem('di_userName');
    if (nm && els.input && !els.input.value) { els.input.value = nm; STATE.user = nm; }
    const cur = (els.input && els.input.value) || STATE.user || 'Convidado';
    updateInterface(cur);
    if (window.updateActivationBlock) window.updateActivationBlock(cur);
  });

  let saved = { mode: 'hud' };
  try {
    const p = JSON.parse(localStorage.getItem(UI_STATE_KEY) || 'null');
    if (p && p.mode) saved = p;
  } catch (e) {}

  forceSmallPreview();
  setTimeout(() => restoreSavedMode(saved.mode, saved.left, saved.top), 450);
}, 100);

setInterval(() => {
  if (els.clock) {
    els.clock.innerText = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  }
}, 1000);

function forceSmallPreview() {
  state.isOrb = false;
  state.isHud = false;

  els.card.classList.remove('orb', 'hud');
  els.card.classList.add('closed');
  els.card.classList.remove('content-visible');

  els.card.style.left = '';
  els.card.style.top = '';
  els.card.style.transform = '';

  els.card.style.opacity = 0;
  els.card.style.transition = 'opacity 400ms ease';
  requestAnimationFrame(() => {
    els.card.style.opacity = 1;
  });
}

function restoreSavedMode(mode, left, top) {
  els.card.style.transition = 'all 600ms var(--ease-smooth)';

  if (mode === 'orb') {
    if (left) els.card.style.left = left;
    if (top) els.card.style.top = top;
    window.setMode('orb');
  } else if (mode === 'hud') {
    window.setMode('hud');
  } else {
    window.setMode('card');
    els.card.classList.remove('closed');
    els.card.classList.add('content-visible');
  }
}

(function () {
  function getNameValue() {
    const input = byId('inputUser', 'kardinputUser', 'userInput');
    const saved = localStorage.getItem('di_userName') || '';
    const current = input && input.value ? input.value.trim() : '';
    return current || saved || 'Convidado';
  }

  function root369(name) {
    const clean = (name || '').trim();
    if (!clean) return '--';
    let n = clean.split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
    while (n > 9) n = String(n).split('').reduce((a, b) => a + Number(b), 0);
    return n;
  }

  function padTo(text, size) {
    text = String(text);
    if (text.length >= size) return text.slice(0, size);
    return text + ' '.repeat(size - text.length);
  }

  function makeMiniAvatarHTML(name, size = 36) {
    const seed = (name || 'DUAL').split('').reduce((a, c) => a + c.charCodeAt(0), 0);
    const h1 = seed % 360;
    const h2 = (seed * 37) % 360;
    const id = 'g' + seed.toString(36);
    return `
      <svg width="${size}" height="${size}" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <defs>
          <linearGradient id="${id}" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="hsl(${h1},100%,55%)"/>
            <stop offset="100%" stop-color="hsl(${h2},90%,45%)"/>
          </linearGradient>
        </defs>
        <rect width="32" height="32" rx="7" fill="#071018"/>
        <circle cx="16" cy="16" r="7" fill="url(#${id})"/>
        <circle cx="16" cy="16" r="13" fill="none" stroke="rgba(255,255,255,.08)" stroke-width="1"/>
      </svg>
    `;
  }

  function createAsciiActivation(name) {
    const clean = (name || '').trim() || 'Convidado';
    const displayName = `${clean}.Dual Infodose`;
    const title = 'CÉREBRO-ORÁCULO — BASE v1';

    const width = 35;
    const top = `+${'-'.repeat(width)}+`;
    const titleLine = `| ${padTo(title, width - 2)} |`;
    const nameLine = `Ativar: ${displayName}`;

    return {
      ascii: [top, titleLine, top, nameLine].join('\n'),
      displayName,
      root: root369(clean),
      title
    };
  }

  function updateActivationBlock(name) {
    const els2 = {
      actPre: document.getElementById('actPre'),
      actName: document.getElementById('actName'),
      actTitle: document.getElementById('actTitle'),
      actMiniAvatar: document.getElementById('actMiniAvatar'),
      actBadge: document.getElementById('actBadge'),
      smallText: document.getElementById('smallText'),
      smallIdent: document.getElementById('smallIdent')
    };

    const data = createAsciiActivation(name);

    if (els2.actPre) els2.actPre.innerText = data.ascii;
    if (els2.actName) els2.actName.innerText = data.displayName;
    if (els2.actTitle) els2.actTitle.innerText = data.title;
    if (els2.actMiniAvatar) els2.actMiniAvatar.innerHTML = makeMiniAvatarHTML(name || 'DUAL', 36);

    if (els2.actBadge) {
      els2.actBadge.innerText = `v:${data.root}`;
      els2.actBadge.classList.remove('vibe-gold');
      if (data.root === 3 || data.root === 6 || data.root === 9) {
        els2.actBadge.classList.add('vibe-gold');
      }
    }

    if (els2.smallText) {
      els2.smallText.innerText = (name && name.trim())
        ? `${name.trim()} · canal ASCII ativo`
        : 'Aguardando ativação...';
    }

    if (els2.smallIdent) {
      els2.smallIdent.innerText = (name && name.trim()) ? `v:${data.root}` : '--';
    }
  }

  window.createAsciiActivation = createAsciiActivation;
  window.updateActivationBlock = updateActivationBlock;

  function bindLiveUpdate() {
    const input = byId('inputUser', 'kardinputUser', 'userInput');
    if (!input) return;

    const run = () => {
      const name = input.value.trim() || localStorage.getItem('di_userName') || 'Convidado';
      if (input.value.trim()) localStorage.setItem('di_userName', name);
      updateInterface(name);
      updateActivationBlock(name);
    };

    input.addEventListener('input', run);
    input.addEventListener('blur', run);

    run();
  }

  function hookButtons() {
    const copyBtn = document.getElementById('copyActBtn');
    const dlBtn = document.getElementById('downloadActBtn');
    const actCard = document.getElementById('activationCard');

    if (copyBtn) {
      copyBtn.onclick = async () => {
        const pre = document.getElementById('actPre');
        if (!pre) return;
        try {
          await navigator.clipboard.writeText(pre.innerText);
        } catch (_) {
          const ta = document.createElement('textarea');
          ta.value = pre.innerText;
          document.body.appendChild(ta);
          ta.select();
          document.execCommand('copy');
          ta.remove();
        }
      };
    }

    if (dlBtn) {
      dlBtn.onclick = async () => {
        if (!window.html2canvas || !actCard) return;
        const canvas = await html2canvas(actCard, { backgroundColor: null, scale: 2 });
        const a = document.createElement('a');
        a.download = `activation-${Date.now()}.png`;
        a.href = canvas.toDataURL('image/png');
        a.click();
      };
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      bindLiveUpdate();
      hookButtons();
    });
  } else {
    bindLiveUpdate();
    hookButtons();
  }
})();




/* ---------- INTEGRACAO COM O COCKPIT ---------- */
window.toggleSection = toggleSection;

function fcSyncStack() {
  const on = !!(state && state.isHud);
  document.body.classList.toggle('fc-hud-on', on);
  document.documentElement.style.setProperty('--fc-top-stack', on ? '64px' : '0px');
}

const __setMode = window.setMode;
window.setMode = (mode, isInitialLoad = false) => {
  if (mode === 'orb' && els.card && !els.card.style.left) {
    els.card.style.left = Math.max(8, window.innerWidth - 84) + 'px';
    els.card.style.top = '96px';
  }
  __setMode(mode, isInitialLoad);
  fcSyncStack();
  document.dispatchEvent(new CustomEvent('fusion:mode', { detail: { mode } }));
};

window.FusionCard = {
  setMode: (m) => window.setMode(m),
  snapTop: () => window.setMode('hud'),
  get mode() { return state.isHud ? 'hud' : (state.isOrb ? 'orb' : 'card'); },
  get el() { return els.card; }
};

// nome sincronizado com o drawer do cockpit
const __drawerUser = document.getElementById('inputUserId');
if (els.input) els.input.addEventListener('input', () => { if (__drawerUser) __drawerUser.value = els.input.value; });
if (__drawerUser) __drawerUser.addEventListener('change', () => {
  const v = __drawerUser.value.trim();
  if (!v || !els.input) return;
  els.input.value = v; STATE.user = v;
  updateInterface(v);
  if (window.updateActivationBlock) window.updateActivationBlock(v);
});

})();

/* =========================================================
   kob-snap-top.js
   ========================================================= */
/* ============================================================
   SNAP NO TOPO · symbolBar (ORB + barra)
   - arraste pelo grip (barra aberta) ou segure/arraste o ORB
   - solta perto do topo (< 64px) = cola no topo, abaixo do HUD
   - duplo toque no grip = volta para o canto original
   - posicao guardada em localStorage (kob.sbf.pos)
   API: window.KOBSnap.{snapTop,reset,state}
============================================================ */
(function KOBSnapTop(){
  const bar=document.getElementById('symbolBar');
  if(!bar)return;
  const grip=document.getElementById('sbfGrip'), orb=document.getElementById('sbOrb');
  const zone=document.getElementById('snap-zone');
  const KEY='kob.sbf.pos', TH=64, LONG=320, MOVE=9;
  let st=null, suppress=false;

  const vw=()=>document.documentElement.clientWidth;
  const vh=()=>window.innerHeight;
  const clampL=l=>Math.max(8,Math.min(l,vw()-bar.offsetWidth-8));
  const clampT=t=>Math.max(0,Math.min(t,vh()-bar.offsetHeight-4));
  const save=o=>{try{localStorage.setItem(KEY,JSON.stringify(o))}catch(e){}};

  function startDrag(){
    if(!st||st.drag)return;
    st.drag=true; clearTimeout(st.timer);
    const r=bar.getBoundingClientRect();
    bar.classList.remove('sbf-snap-top');
    bar.classList.add('sbf-free','sbf-dragging');
    bar.style.left=r.left+'px'; bar.style.top=r.top+'px';
    bar.style.right='auto'; bar.style.bottom='auto';
    try{bar.setPointerCapture(st.id)}catch(e){}
    if(navigator.vibrate)navigator.vibrate(20);
  }
  function begin(e){
    if(e.button>0)return;
    const r=bar.getBoundingClientRect();
    st={id:e.pointerId,x:e.clientX,y:e.clientY,ox:e.clientX-r.left,oy:e.clientY-r.top,drag:false,timer:null};
    if(e.currentTarget===orb&&bar.classList.contains('collapsed'))st.timer=setTimeout(startDrag,LONG);
  }
  function move(e){
    if(!st||e.pointerId!==st.id)return;
    if(!st.drag&&Math.hypot(e.clientX-st.x,e.clientY-st.y)>MOVE)startDrag();
    if(!st.drag)return;
    e.preventDefault();
    const l=clampL(e.clientX-st.ox), t=clampT(e.clientY-st.oy);
    bar.style.left=l+'px'; bar.style.top=t+'px';
    zone&&zone.classList.toggle('active',t<TH);
  }
  function end(e){
    if(!st||(e&&e.pointerId!==st.id))return;
    clearTimeout(st.timer);
    const was=st.drag; st=null;
    if(!was)return;
    try{bar.releasePointerCapture(e.pointerId)}catch(_){}
    zone&&zone.classList.remove('active');
    bar.classList.remove('sbf-dragging');
    suppress=true; setTimeout(()=>{suppress=false},60);
    const t=parseFloat(bar.style.top)||0;
    if(t<TH)snapTop(); else{
      save({mode:'free',lr:(parseFloat(bar.style.left)||0)/vw(),tr:t/vh()});
    }
  }
  function snapTop(){
    void bar.offsetWidth;
    bar.classList.add('sbf-free','sbf-snap-top');
    bar.style.top=''; bar.style.bottom='';
    save({mode:'snap-top',lr:(parseFloat(bar.style.left)||bar.getBoundingClientRect().left)/vw()});
    document.dispatchEvent(new CustomEvent('kob:symbolbar:snap',{detail:{edge:'top'}}));
  }
  function reset(){
    bar.classList.remove('sbf-free','sbf-snap-top','sbf-dragging');
    ['left','top','right','bottom'].forEach(p=>bar.style.removeProperty(p));
    try{localStorage.removeItem(KEY)}catch(e){}
  }
  function restore(){
    let p=null; try{p=JSON.parse(localStorage.getItem(KEY)||'null')}catch(e){}
    if(!p)return;
    bar.classList.add('sbf-free');
    bar.style.right='auto'; bar.style.bottom='auto';
    bar.style.left=clampL((p.lr||0)*vw())+'px';
    if(p.mode==='snap-top'){bar.classList.add('sbf-snap-top');bar.style.top='';}
    else if(p.mode==='free'){bar.style.top=clampT((p.tr||0)*vh())+'px';}
  }

  [grip,orb].forEach(h=>h&&h.addEventListener('pointerdown',begin));
  window.addEventListener('pointermove',move,{passive:false});
  window.addEventListener('pointerup',end);
  window.addEventListener('pointercancel',end);
  // depois de arrastar, o "click" nao pode abrir o menu/cockpit sem querer
  bar.addEventListener('click',e=>{if(suppress){e.stopImmediatePropagation();e.preventDefault();suppress=false}},true);
  grip&&grip.addEventListener('dblclick',reset);

  // barra expande/recolhe ou tela gira: mantem dentro da tela
  const keepIn=()=>{
    if(!bar.classList.contains('sbf-free')||bar.classList.contains('sbf-dragging'))return;
    bar.style.left=clampL(parseFloat(bar.style.left)||bar.getBoundingClientRect().left)+'px';
    if(!bar.classList.contains('sbf-snap-top')&&bar.style.top)bar.style.top=clampT(parseFloat(bar.style.top))+'px';
  };
  window.addEventListener('resize',keepIn);
  if(window.ResizeObserver)new ResizeObserver(keepIn).observe(bar);

  restore();
  window.KOBSnap={snapTop:()=>{if(!bar.classList.contains('sbf-free')){const r=bar.getBoundingClientRect();bar.style.left=clampL(r.left)+'px';bar.style.right='auto';bar.style.bottom='auto';}snapTop()},reset,
    get state(){return bar.classList.contains('sbf-snap-top')?'snap-top':(bar.classList.contains('sbf-free')?'free':'default')}};
})();

/* =========================================================
   sbf-full-js.js
   ========================================================= */
(function KOBSymbolBarFull(){
'use strict';
if(window.__KOB_SBF__)return;window.__KOB_SBF__=true;
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>Array.from(r.querySelectorAll(s));
const LS={get(k,d=null){try{const v=localStorage.getItem(k);return v==null?d:v}catch{return d}},
  set(k,v){try{localStorage.setItem(k,v)}catch{}},
  json(k,d){try{const v=localStorage.getItem(k);return v?JSON.parse(v):d}catch{return d}}};
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
const bar=$('#symbolBar');if(!bar)return;
const hudEl=$('#sbHud');
function say(msg){
  if(hudEl)hudEl.textContent=msg;
  const t=$('#toast');if(t){t.textContent=msg;t.classList.add('on');clearTimeout(say._t);say._t=setTimeout(()=>t.classList.remove('on'),1800)}
}

/* ───────────── ARQUÉTIPOS · orb + carrossel ───────────── */
const Arch={
  keys(){return $$('.arch-chip').map(c=>c.dataset.k)},
  cur(){return (window.Nebula&&window.Nebula.arch)||'KOBLLUX'},
  set(k){if(window.Nebula&&window.Nebula.applyArch)window.Nebula.applyArch(k);this.paint()},
  next(d){const ks=this.keys();if(!ks.length)return;const i=ks.indexOf(this.cur());this.set(ks[(i+(d||1)+ks.length)%ks.length]);say('◍ '+this.cur())},
  build(){
    const tr=$('#sbTrack');if(!tr)return;
    tr.innerHTML=$$('.arch-chip').map(c=>{
      const k=c.dataset.k,c1=c.style.getPropertyValue('--chip-c1')||'#22d3ee',c2=c.style.getPropertyValue('--chip-c2')||'#0e7c9e';
      return '<button type="button" class="sbf-arch" data-k="'+esc(k)+'" style="--c1:'+c1+';--c2:'+c2+'"><i></i>'+esc(k)+'</button>'}).join('');
    tr.addEventListener('click',e=>{const b=e.target.closest('.sbf-arch');if(!b)return;this.set(b.dataset.k);say('◍ '+b.dataset.k)});
    tr.addEventListener('scroll',()=>this.dots(),{passive:true});
  },
  dots(){
    const tr=$('#sbTrack'),d=$('#sbDots');if(!tr||!d)return;
    const n=Math.max(1,Math.ceil(tr.scrollWidth/Math.max(1,tr.clientWidth)));
    const at=Math.min(n-1,Math.round(tr.scrollLeft/Math.max(1,tr.clientWidth)));
    if(d.children.length!==n)d.innerHTML=new Array(n+1).join('<b></b>');
    Array.from(d.children).forEach((b,i)=>b.classList.toggle('on',i===at));
  },
  paint(){
    const k=this.cur(),ks=this.keys(),i=Math.max(0,ks.indexOf(k));
    $('#sbStatus').textContent='0x'+i.toString(16).toUpperCase().padStart(2,'0')+' · '+k;
    const v=window.KOBLLUX_VOICE&&window.KOBLLUX_VOICE.map&&window.KOBLLUX_VOICE.map[k];
    $('#sbSub').textContent=v?(v.nome+' · '+v.lang):'—';
    $$('.sbf-arch',bar).forEach(c=>{const on=c.dataset.k===k;c.classList.toggle('on',on);if(on&&bar.classList.contains('show-carousel')&&!this._noScroll)c.scrollIntoView({inline:'center',block:'nearest'})});
    this.dots();
  },
  init(){
    this.build();this.paint();
    new MutationObserver(()=>this.paint()).observe(document.body,{attributes:true,attributeFilter:['data-arch']});
  }
};

/* ───────────── VOZ · play / pausa / blocos ───────────── */
const norm=x=>String(x||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
let lastSel='';
document.addEventListener('selectionchange',()=>{const s=String(getSelection&&getSelection()||'').trim();if(s.length>1)lastSel=s});
function splitBlocks(text){
  const raw=(text.match(/[^.!?…\n]+[.!?…]*\s*/g)||[text]).map(s=>s.trim()).filter(Boolean),out=[];let buf='';
  for(const s of raw){if(buf&&(buf+' '+s).length>200){out.push(buf);buf=s}else buf=buf?buf+' '+s:s}
  if(buf)out.push(buf);
  return out.flatMap(b=>b.length>260?(b.match(/.{1,240}(\s|$)/g)||[b]).map(x=>x.trim()).filter(Boolean):[b]);
}
const TTS={
  blocks:[],i:0,playing:false,paused:false,token:0,src:'',
  text(){
    if(lastSel)return lastSel;
    const N=window.Nebula,d=N&&(N.currentDoc||(N.docs&&N.docs[0]));
    if(d&&d.content)return String(d.content).replace(/[#*_`>~]/g,'').trim();
    const r=$('#reader');return r?String(r.innerText||'').trim():'';
  },
  load(){
    if(!('speechSynthesis' in window)){say('TTS indisponível neste navegador');return false}
    const t=this.text();if(!t){say('Nada para ouvir · selecione um texto ou abra um documento');return false}
    if(t!==this.src){this.src=t;this.blocks=splitBlocks(t);this.i=0}
    return this.blocks.length>0;
  },
  pick(cfg){
    const L=speechSynthesis.getVoices(),n=norm(cfg.nome),l=norm(cfg.lang).split('-')[0];
    return L.find(v=>norm(v.name).includes(n)&&norm(v.lang).startsWith(l))||L.find(v=>norm(v.lang).startsWith(l))||L.find(v=>norm(v.lang).startsWith('pt'));
  },
  speakAt(i){
    if(i<0||i>=this.blocks.length){this.stop(true);say('■ fim');return}
    this.i=i;const tok=++this.token;speechSynthesis.cancel();
    const map=(window.KOBLLUX_VOICE&&window.KOBLLUX_VOICE.map)||{};
    const cfg=map[Arch.cur()]||map.KOBLLUX||{nome:'Luciana',lang:'pt-BR',rate:1,pitch:1};
    const u=new SpeechSynthesisUtterance(this.blocks[i]);
    u.pitch=cfg.pitch;u.rate=cfg.rate;u.lang=cfg.lang;
    const v=this.pick(cfg);if(v){u.voice=v;u.lang=v.lang||cfg.lang}
    u.onend=()=>{if(tok===this.token&&this.playing&&!this.paused)this.speakAt(i+1)};
    u.onerror=()=>{};
    speechSynthesis.speak(u);this.sync();
  },
  toggle(){
    if(!('speechSynthesis' in window)){say('TTS indisponível');return}
    if(this.playing&&!this.paused){speechSynthesis.pause();this.paused=true;this.sync();return}
    if(this.playing&&this.paused){speechSynthesis.resume();this.paused=false;this.sync();return}
    if(!this.load())return;
    this.playing=true;this.paused=false;this.speakAt(this.i);
  },
  step(d){
    if(!this.load())return;
    this.playing=true;this.paused=false;
    this.speakAt(Math.max(0,Math.min(this.blocks.length-1,this.i+d)));
  },
  prev(){this.step(-1)},next(){this.step(1)},
  stop(reset){
    this.token++;
    if('speechSynthesis' in window)speechSynthesis.cancel();
    this.playing=false;this.paused=false;if(reset!==false)this.i=0;this.sync();
  },
  clear(){this.stop(true);this.blocks=[];this.src='';lastSel='';try{getSelection().removeAllRanges()}catch{}say('× limpo')},
  sync(){
    const live=this.playing&&!this.paused,p=$('#sbPlay');
    if(p){p.textContent=live?'❚❚':'▶';p.classList.toggle('on',this.playing)}
    bar.classList.toggle('is-speaking',live);
    if(this.playing&&hudEl)hudEl.textContent=(live?'▶ ':'❚❚ ')+(this.i+1)+'/'+this.blocks.length;
  },
  async copy(){
    const t=this.text();if(!t){say('Nada para copiar');return}
    try{await navigator.clipboard.writeText(t)}catch{
      const ta=document.createElement('textarea');ta.value=t;document.body.appendChild(ta);ta.select();try{document.execCommand('copy')}catch{}ta.remove()}
    say('⧉ copiado · '+t.length+' car.');
  },
  download(){
    const t=this.text();if(!t){say('Nada para baixar');return}
    const a=document.createElement('a');
    a.href=URL.createObjectURL(new Blob([t],{type:'text/plain;charset=utf-8'}));
    a.download='kobllux-'+Arch.cur().toLowerCase()+'-'+new Date().toISOString().slice(0,16).replace(/[-:T]/g,'')+'.txt';
    document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},800);say('↓ baixado');
  }
};

/* ───────────── VIEWPORT + PLAYER ───────────── */
const Viewport={
  toggle(){document.body.classList.toggle('sbx-hide-stack');this.sync();say(document.body.classList.contains('sbx-hide-stack')?'⊞ sessões ocultas':'⊟ sessões visíveis')},
  sync(){const b=$('#sbViewport');if(!b)return;const hid=document.body.classList.contains('sbx-hide-stack');
    b.textContent=hid?'⊞':'⊟';b.setAttribute('aria-pressed',String(hid));b.classList.toggle('on',hid)}
};
function safeUrl(raw){
  let u=String(raw||'').trim();if(!u)return '';
  if(/^[a-z][a-z0-9+.\-]*:/i.test(u))return /^https?:/i.test(u)?u:'';
  if(u.startsWith('//'))return 'https:'+u;
  if(/^(\.{0,2}\/|#)/.test(u))return u;
  if(/^[\w\-]+(\.[\w\-]+)+(?=[\/?#:]|$)/.test(u)&&!/\.(html?|php|js|json|css)(\?|#|$)/i.test(u))return 'https://'+u;
  return u;
}
function openUrl(u,label){
  if(window.createSessionWindow){window.createSessionWindow({title:label||'Navegação',src:u});return}
  window.open(u,'_blank','noopener');
}
const Player={
  embed(url){const m=String(url||'').match(/(?:youtu\.be\/|[?&]v=|embed\/)([\w-]{11})/);return m?'https://www.youtube.com/embed/'+m[1]:safeUrl(url)},
  open(){const b=$('#sbPlayer'),url=this.embed(b&&b.dataset.playerUrl);if(!url){say('URL do player inválida');return}
    openUrl(url,(b&&b.dataset.playerTitle)||'Player')}
};

/* ───────────── ATALHOS (symbols) ───────────── */
const Shortcuts={
  KEY:'sbx_symbols_v1',
  defaults:[
    {id:'void',url:'https://www.infodose.com.br/splash.html',label:'Void',icon:'Φ',visible:true},
    {id:'Home',url:'https://kodux78k.github.io/oiDual--Y-/M0D/iFS/',label:'Home',icon:'Φ',visible:true},
    {id:'78Frames',url:'https://www.infodose.com.br/oiDual/KODUX/78K/APPS/78F.html',label:'78Frames',icon:'꩜',visible:true},
    {id:'Feeling',url:'https://www.infodose.com.br/oiDual/KODUX/78K/APPS/78EM.html',label:'Feeling',icon:'◌',visible:true},
    {id:'Nebualayer',url:'https://www.infodose.com.br/oiDual/KODUX/78K/APPS/78NP.html',label:'Nebualayer',icon:'◘',visible:true}
  ],
  items:[],lastUrl:'',
  slug(s){return String(s||'').toLowerCase().replace(/[^\w]+/g,'-').replace(/^-+|-+$/g,'')||'sym'},
  load(){
    const st=LS.json(this.KEY,null);
    this.items=(st&&Array.isArray(st.items))
      ?st.items.filter(i=>i&&i.id&&i.url&&i.label).map(i=>({id:String(i.id),url:i.url,label:String(i.label),icon:i.icon||'🔗',visible:i.visible!==false}))
      :this.defaults.map(d=>({...d}));
  },
  save(){LS.set(this.KEY,JSON.stringify({v:1,items:this.items}))},
  render(){
    const host=$('#sbShortcuts');if(!host)return;
    host.innerHTML=this.items.filter(i=>i.visible).map(i=>
      '<button type="button" class="sbf-sym" data-id="'+esc(i.id)+'" title="'+esc(i.label)+'">'+esc(i.icon||'🔗')+'</button>').join('')+
      '<button type="button" class="sbf-sym util" id="quickAddBtn" title="Adicionar atalho (usa a URL atual)">＋</button>'+
      '<button type="button" class="sbf-sym util" id="sbxEditBtn" title="Editar atalhos">✎</button>';
    this.renderModal();
  },
  open(id){
    const it=this.items.find(x=>x.id===id);if(!it)return;
    const u=safeUrl(it.url);if(!u){say('URL inválida');return}
    this.lastUrl=u;LS.set('kob_last_url',u);openUrl(u,it.label);
  },
  openEdit(){const m=$('#symbol-edit-modal');if(m){m.classList.add('active');this.renderModal()}},
  closeEdit(){const m=$('#symbol-edit-modal');if(m)m.classList.remove('active')},
  isOpen(){const m=$('#symbol-edit-modal');return !!(m&&m.classList.contains('active'))},
  renderModal(){
    const list=$('#symbol-edit-list');if(!list)return;
    if(!this.items.length){list.innerHTML='<div class="sbx-mempty">Nenhum atalho. Adicione abaixo.</div>';return}
    list.innerHTML=this.items.map((it,i)=>
      '<div class="symbol-item" data-i="'+i+'"><div class="label">'+esc(it.icon||'🔗')+' '+esc(it.label)+'<small>'+esc(it.url)+'</small></div>'+
      '<div class="actions"><button type="button" class="toggle-vis'+(it.visible?' active':'')+'" data-a="vis" title="Visível/oculto"></button>'+
      '<button type="button" data-a="del" title="Remover">✕</button></div></div>').join('');
  },
  add(url,label,icon){
    const u=safeUrl(url),l=String(label||'').trim();
    if(!u||!l){say('Preencha uma URL válida e um rótulo');return false}
    const ic=String(icon||'').trim()||Array.from(l)[0].toUpperCase();
    this.items.push({id:this.slug(l)+'-'+Date.now().toString(36),url:u,label:l,icon:ic,visible:true});
    this.save();this.render();return true;
  },
  quickAdd(){
    const nav=($('#urlInputNav')||{}).value||'',cand=safeUrl(this.lastUrl||nav.trim());
    this.openEdit();
    const u=$('#newSymbolUrl'),l=$('#newSymbolLabel'),i=$('#newSymbolIcon');
    if(u)u.value=cand||'';if(i)i.value='';
    if(l){let host='';try{host=cand?new URL(cand,location.href).hostname.replace(/^www\./,'').split('.')[0]:''}catch{}
      l.value=host?host.charAt(0).toUpperCase()+host.slice(1):'';setTimeout(()=>{try{(cand?l:u).focus()}catch{}},50)}
    if(!cand)say('Sem URL ativa · preencha abaixo');
  },
  init(){
    this.load();this.render();
    bar.addEventListener('click',e=>{
      const b=e.target.closest('.sbf-sym');if(!b)return;
      if(b.id==='quickAddBtn')this.quickAdd();else if(b.id==='sbxEditBtn')this.openEdit();else if(b.dataset.id)this.open(b.dataset.id);
    });
    const m=$('#symbol-edit-modal');
    m.addEventListener('click',e=>{
      if(e.target===m){this.closeEdit();return}
      const row=e.target.closest('.symbol-item'),a=e.target.closest('[data-a]');
      if(row&&a){const i=+row.dataset.i;
        if(a.dataset.a==='vis')this.items[i].visible=!this.items[i].visible;else this.items.splice(i,1);
        this.save();this.render()}
    });
    const on=(id,fn)=>{const el=document.getElementById(id);if(el)el.addEventListener('click',fn)};
    on('closeSymbolModal',()=>this.closeEdit());on('closeSymbolModalBtn',()=>this.closeEdit());
    const add=()=>{const u=$('#newSymbolUrl'),l=$('#newSymbolLabel'),i=$('#newSymbolIcon');
      if(this.add(u.value,l.value,i.value)){u.value='';l.value='';i.value='';say('＋ atalho adicionado')}};
    on('addSymbolBtn',add);
    ['newSymbolUrl','newSymbolLabel','newSymbolIcon'].forEach(id=>{const el=document.getElementById(id);if(el)el.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();add()}})});
    on('resetSymbolsBtn',()=>{if(confirm('Restaurar a lista padrão de atalhos?')){this.items=this.defaults.map(d=>({...d}));this.save();this.render()}});
  }
};

/* ───────────── MXP · FACTORY / SLOTS / DRAG ───────────── */
const MX_KEY='kobllux_mxp_v2',SLOTS=['header','aside','footer','loose'];
const SLOT_LABEL={header:'HEADER',aside:'ASIDE · barra',footer:'FOOTER',loose:'SOLTO'};
const run=fn=>()=>{try{fn()}catch(err){console.warn('[MXP]',err)}};
const CAT=[
  {cat:'Sistema',items:[
    {id:'theme',icon:'◐',label:'TEMA',run:run(()=>window.DualTheme&&window.DualTheme.toggle())},
    {id:'cockpit',icon:'⌘',label:'COCKPIT',run:run(()=>window.KOBCockpit&&window.KOBCockpit.open())},
    {id:'factory',icon:'◈',label:'FACTORY',run:run(()=>MXP.openFactory())},
    {id:'reset',icon:'↺',label:'RESET MXP',run:run(()=>{if(confirm('Limpar todos os botões dos slots?')){state=blank();save();renderAll();say('↺ layout MXP limpo')}})}]},
  {cat:'Mente',items:[
    {id:'mente',icon:'M',label:'MENTE',run:run(()=>window.openEMD&&window.openEMD())},
    {id:'import',icon:'⇪',label:'IMPORTAR',run:run(()=>{const f=$('#fileInput');if(f)f.click()})},
    {id:'samples',icon:'✦',label:'EXEMPLOS',run:run(()=>{const b=$('#btnSample');if(b)b.click()})},
    {id:'pills',icon:'⚗',label:'PÍLULAS',run:run(()=>{const b=$('#btnPills');if(b)b.click()})}]},
  {cat:'Sessões',items:[
    {id:'nova',icon:'+',label:'NOVA',run:run(()=>window.createSessionWindow&&window.createSessionWindow({title:'Sessão MXP'}))},
    {id:'splash',icon:'◎',label:'SPLASH',run:run(()=>openUrl('https://www.infodose.com.br/splash','Splash'))},
    {id:'viewport',icon:'⊟',label:'VIEWPORT',run:run(()=>Viewport.toggle())},
    {id:'player',icon:'▣',label:'PLAYER',run:run(()=>Player.open())}]},
  {cat:'Voz',items:[
    {id:'play',icon:'▶',label:'PLAY',run:run(()=>TTS.toggle())},
    {id:'stop',icon:'■',label:'STOP',run:run(()=>TTS.stop(true))},
    {id:'prev',icon:'◀',label:'ANTES',run:run(()=>TTS.prev())},
    {id:'next',icon:'▷',label:'PRÓX',run:run(()=>TTS.next())},
    {id:'arch',icon:'◍',label:'ARQ +',run:run(()=>Arch.next(1))},
    {id:'copy',icon:'⧉',label:'COPIAR',run:run(()=>TTS.copy())}]},
  {cat:'Layout',items:[
    {id:'snaptop',icon:'⤒',label:'BARRA ⤒',run:run(()=>window.KOBSnap&&window.KOBSnap.snapTop())},
    {id:'snapfree',icon:'⤓',label:'BARRA ⤓',run:run(()=>window.KOBSnap&&window.KOBSnap.reset())},
    {id:'hud',icon:'▭',label:'CARD·HUD',run:run(()=>window.FusionCard&&window.FusionCard.setMode('hud'))},
    {id:'orb',icon:'●',label:'CARD·ORB',run:run(()=>window.FusionCard&&window.FusionCard.setMode('orb'))},
    {id:'card',icon:'▤',label:'CARD',run:run(()=>window.FusionCard&&window.FusionCard.setMode('card'))}]},
  {cat:'Atalhos',items:[
    {id:'symbols',icon:'✎',label:'ATALHOS',run:run(()=>Shortcuts.openEdit())},
    {id:'symadd',icon:'＋',label:'ADD URL',run:run(()=>Shortcuts.quickAdd())}]}
];
const DEF={};CAT.forEach(g=>g.items.forEach(i=>{DEF[i.id]=i}));
const blank=()=>({v:2,slots:{header:[],aside:[],footer:[],loose:[]}});
let state=LS.json(MX_KEY,null);
if(!state||!state.slots)state=blank();
SLOTS.forEach(s=>{if(!Array.isArray(state.slots[s]))state.slots[s]=[]});
const save=()=>LS.set(MX_KEY,JSON.stringify(state));
const uid=()=>'m'+Math.random().toString(36).slice(2,8)+Date.now().toString(36).slice(-3);
const slotEl=s=>s==='loose'?$('#mxp-loose-layer'):$('[data-slot="'+s+'"][data-drop-target]');

function mkBtn(inst,slot){
  const d=DEF[inst.id];if(!d)return null;
  const b=document.createElement('button');b.type='button';
  b.className='mxp-btn slot-'+slot+(inst.bound?' is-bound':'');
  b.dataset.u=inst.u;b.dataset.mxp=inst.id;
  const lab=inst.label||d.label;
  b.title=lab+(inst.bound?' · ⛓ '+inst.bound:'');
  b.innerHTML='<span class="mxp-icon">'+esc(d.icon)+'</span><span class="mxp-label">'+esc(lab)+'</span>';
  if(slot==='loose'){b.style.left=(inst.x==null?50:inst.x)+'%';b.style.top=(inst.y==null?60:inst.y)+'%'}
  return b;
}
function renderAll(){
  SLOTS.forEach(s=>{
    const host=slotEl(s);if(!host)return;host.textContent='';
    state.slots[s]=state.slots[s].filter(i=>DEF[i.id]);
    state.slots[s].forEach(i=>{const b=mkBtn(i,s);if(b)host.appendChild(b)});
  });
}
function find(u){for(const s of SLOTS){const a=state.slots[s],i=a.findIndex(x=>x.u===u);if(i>=0)return{slot:s,idx:i,inst:a[i]}}return null}
function detach(u){const f=find(u);return f?state.slots[f.slot].splice(f.idx,1)[0]:null}
function put(inst,slot,idx,pos){
  if(slot==='loose'){inst.x=pos.x;inst.y=pos.y}else{delete inst.x;delete inst.y}
  const a=state.slots[slot];
  if(idx==null||idx<0||idx>a.length)a.push(inst);else a.splice(idx,0,inst);
}
const pct=(v,max)=>Math.max(3,Math.min(97,Math.round(v/max*1000)/10));
const here=(x,y)=>({x:pct(x,innerWidth),y:pct(y,innerHeight)});

function fireInst(inst,node){
  if(node){node.classList.add('is-firing');setTimeout(()=>node.classList.remove('is-firing'),260)}
  if(inst.bound){
    const t=$(inst.bound);
    if(t){if(t.tagName==='INPUT')t.focus();else t.click();return}
    say('⛓ alvo não encontrado');return;
  }
  const d=DEF[inst.id];if(d)d.run();
}
const selFor=el=>{const a=el.getAttribute('data-dual-action');if(a)return '[data-dual-action="'+a+'"]';return el.id?'#'+el.id:''};

/* fábrica */
function renderFactory(){
  const c=$('#mxd-catalog');if(!c)return;
  c.innerHTML=CAT.map(g=>'<div class="mxd-cat"><div class="mxd-cat-name">'+g.cat+'</div><div class="mxd-cat-grid">'+
    g.items.map(d=>'<button type="button" class="mxp-btn slot-factory" data-mxp="'+d.id+'"><span class="mxp-icon">'+esc(d.icon)+'</span><span class="mxp-label">'+esc(d.label)+'</span></button>').join('')+
    '</div></div>').join('');
}
function openFactory(){renderFactory();const f=$('#mxd-factory');f.classList.add('is-open');f.setAttribute('aria-hidden','false')}
function closeFactory(){const f=$('#mxd-factory');f.classList.remove('is-open','is-dragging');f.setAttribute('aria-hidden','true')}

/* menu de contexto */
const ctx=$('#mxd-context');
function closeCtx(){ctx.classList.remove('is-open');ctx.innerHTML=''}
function openCtx(inst,node){
  const d=DEF[inst.id],cur=find(inst.u);
  let html='<div class="ctx-head">'+esc(inst.label||d.label)+(cur?' · '+SLOT_LABEL[cur.slot]:'')+'</div>'+
    '<button data-c="fire">▶ Disparar</button>';
  SLOTS.filter(s=>!cur||s!==cur.slot).forEach(s=>{html+='<button data-c="move" data-s="'+s+'">⇄ Mover → '+SLOT_LABEL[s]+'</button>'});
  if(inst.bound)html+='<button data-c="unbind">⛓ Desvincular</button>';
  html+='<button data-c="rename">✎ Renomear</button><button data-c="dup">⧉ Duplicar</button><button class="ctx-danger" data-c="del">× Remover</button>';
  ctx.innerHTML=html;ctx.classList.add('is-open');
  const r=node.getBoundingClientRect(),w=ctx.offsetWidth,hh=ctx.offsetHeight;
  ctx.style.left=Math.max(8,Math.min(r.left,innerWidth-w-8))+'px';
  ctx.style.top=(r.bottom+6+hh>innerHeight?Math.max(8,r.top-hh-6):r.bottom+6)+'px';
  ctx.dataset.u=inst.u;
}
ctx.addEventListener('click',e=>{
  const b=e.target.closest('button[data-c]');if(!b)return;
  const u=ctx.dataset.u,f=find(u);closeCtx();if(!f)return;
  const c=b.dataset.c;
  if(c==='fire')fireInst(f.inst);
  else if(c==='move'){const i=detach(u);put(i,b.dataset.s,null,{x:50,y:60});say('⇄ '+SLOT_LABEL[b.dataset.s])}
  else if(c==='unbind'){delete f.inst.bound;say('⛓ desvinculado')}
  else if(c==='rename'){const v=prompt('Rótulo do botão',f.inst.label||DEF[f.inst.id].label);if(v!=null&&v.trim())f.inst.label=v.trim().slice(0,14)}
  else if(c==='dup'){const n={...f.inst,u:uid()};if(f.slot==='loose'){n.x=Math.min(97,(n.x||50)+6);n.y=Math.min(97,(n.y||60)+6)}state.slots[f.slot].splice(f.idx+1,0,n)}
  else if(c==='del'){detach(u);say('× removido')}
  save();renderAll();
});
document.addEventListener('pointerdown',e=>{if(ctx.classList.contains('is-open')&&!e.target.closest('#mxd-context'))closeCtx()},true);

/* arrastar */
const LONG=340,MOVE=8,DBL=260;
const ghost=$('#mxd-ghost'),hud=$('#mxd-hud'),trash=$('#mxd-trash'),factory=$('#mxd-factory');
let P=null,lastTap={};
const hudSet=t=>{hud.textContent=t;hud.classList.add('is-live')};
const blockScroll=e=>{if(P&&P.drag)e.preventDefault()};
function clearMarks(){
  $$('.is-drop-ready').forEach(n=>n.classList.remove('is-drop-ready'));
  $$('.is-dual-hover').forEach(n=>n.classList.remove('is-dual-hover'));
  trash.classList.remove('is-over');
}
function probe(x,y){
  const els=document.elementsFromPoint(x,y).filter(el=>!el.closest('#mxd-ghost'));
  if(els.some(el=>el.id==='mxd-trash'))return{k:'trash'};
  const slot=els.map(el=>el.closest&&el.closest('[data-drop-target]')).find(Boolean);
  if(slot)return{k:'slot',el:slot,slot:slot.dataset.slot};
  const dual=els.map(el=>el.closest&&el.closest('[data-dual-target]')).find(el=>el&&!el.closest('#mxd-factory,#symbolBar,.mxp-btn'));
  if(dual)return{k:'dual',el:dual};
  if(els.some(el=>el.closest&&el.closest('#symbolBar,#mxd-context,#symbol-edit-modal')))return{k:'none'};
  return{k:'loose'};
}
function startDrag(){
  if(!P||P.drag)return;
  P.drag=true;clearTimeout(P.timer);
  P.b.classList.remove('is-holding');
  if(!P.factory)P.b.classList.add('is-source');
  ghost.innerHTML='<span>'+esc((DEF[P.mxp]||{}).icon||'◆')+'</span>';
  ghost.style.left=P.cx+'px';ghost.style.top=P.cy+'px';ghost.classList.add('is-live');
  document.body.classList.add('mxp-dragging');
  trash.classList.add('is-active');
  if(P.factory)factory.classList.add('is-dragging');
  closeCtx();
  if(navigator.vibrate)navigator.vibrate(25);
  document.addEventListener('touchmove',blockScroll,{passive:false});
  hudSet('arraste para um slot · lixeira remove');
  update(P.cx,P.cy);
}
function update(x,y){
  clearMarks();const t=probe(x,y);P.t=t;
  ghost.classList.toggle('is-dim',t.k==='none');
  if(t.k==='trash'){trash.classList.add('is-over');hudSet('× remover')}
  else if(t.k==='slot'){t.el.classList.add('is-drop-ready');hudSet('→ '+SLOT_LABEL[t.slot])}
  else if(t.k==='dual'){t.el.classList.add('is-dual-hover');hudSet('⛓ vincular · '+(t.el.getAttribute('data-dual-action')||t.el.id||'alvo'))}
  else if(t.k==='loose')hudSet('◌ solto aqui');
  else hudSet('solte num slot da barra');
}
function slotIndex(el,x,y,skip){
  const kids=$$('.mxp-btn',el).filter(k=>k.dataset.u!==skip);
  const i=kids.findIndex(k=>{const r=k.getBoundingClientRect();return y<r.top||(y<=r.bottom&&x<r.left+r.width/2)});
  return i<0?kids.length:i;
}
function finish(x,y){
  const t=P.t||probe(x,y),pos=here(x,y);
  if(t.k==='none'||t.k==='trash'&&P.factory){say(t.k==='none'?'cancelado':'—');return}
  if(P.factory){
    const inst={u:uid(),id:P.mxp};
    if(t.k==='slot')put(inst,t.slot,t.slot==='loose'?null:slotIndex(t.el,x,y,null),pos);
    else if(t.k==='dual'){const sel=selFor(t.el);if(sel)inst.bound=sel;put(inst,'loose',null,pos)}
    else put(inst,'loose',null,pos);
    say('＋ '+DEF[P.mxp].label+' → '+SLOT_LABEL[find(inst.u).slot]);
    return;
  }
  const f=find(P.u);if(!f)return;
  if(t.k==='trash'){detach(P.u);say('× removido');return}
  if(t.k==='dual'){const sel=selFor(t.el);if(sel){f.inst.bound=sel;say('⛓ vinculado · '+sel)}else say('alvo sem id');return}
  const inst=detach(P.u);
  if(t.k==='slot')put(inst,t.slot,t.slot==='loose'?null:slotIndex(t.el,x,y,P.u),pos);
  else put(inst,'loose',null,pos);
  say('⇄ '+SLOT_LABEL[find(inst.u).slot]);
}
function endAll(){
  clearTimeout(P&&P.timer);
  document.removeEventListener('touchmove',blockScroll);
  document.body.classList.remove('mxp-dragging');
  ghost.classList.remove('is-live','is-dim');trash.classList.remove('is-active');
  clearMarks();factory.classList.remove('is-dragging');
  setTimeout(()=>hud.classList.remove('is-live'),700);
}
document.addEventListener('pointerdown',e=>{
  const b=e.target.closest&&e.target.closest('.mxp-btn');if(!b||(e.button&&e.button>0))return;
  P={id:e.pointerId,b,x:e.clientX,y:e.clientY,cx:e.clientX,cy:e.clientY,factory:!!b.closest('#mxd-catalog'),mxp:b.dataset.mxp,u:b.dataset.u,drag:false,t:null};
  b.classList.add('is-holding');
  P.timer=setTimeout(startDrag,LONG);
  try{b.setPointerCapture(e.pointerId)}catch{}
});
window.addEventListener('pointermove',e=>{
  if(!P||e.pointerId!==P.id)return;
  P.cx=e.clientX;P.cy=e.clientY;
  if(!P.drag){
    if(Math.hypot(e.clientX-P.x,e.clientY-P.y)>MOVE){
      if(P.factory){clearTimeout(P.timer);P.b.classList.remove('is-holding')}   // arrasto rápido na fábrica = rolagem
      else startDrag();
    }
    return;
  }
  e.preventDefault();
  ghost.style.left=e.clientX+'px';ghost.style.top=e.clientY+'px';
  update(e.clientX,e.clientY);
},{passive:false});
function up(e){
  if(!P||e.pointerId!==P.id)return;
  const p=P;P=null;
  p.b.classList.remove('is-holding','is-source');
  try{p.b.releasePointerCapture(p.id)}catch{}
  if(p.drag){P=p;try{finish(e.clientX,e.clientY)}finally{endAll();P=null}save();renderAll();return}
  clearTimeout(p.timer);
  if(Math.hypot(e.clientX-p.x,e.clientY-p.y)>MOVE)return;
  if(p.factory){const d=DEF[p.mxp];if(d){p.b.classList.add('is-firing');setTimeout(()=>p.b.classList.remove('is-firing'),260);d.run()}return}
  const f=find(p.u);if(!f)return;
  const now=Date.now();
  if(lastTap.u===p.u&&now-lastTap.t<DBL){clearTimeout(lastTap.timer);lastTap={};openCtx(f.inst,p.b)}
  else{lastTap={u:p.u,t:now,timer:setTimeout(()=>{lastTap={};const g=find(p.u);if(g)fireInst(g.inst,p.b)},DBL)}}
}
window.addEventListener('pointerup',up);
window.addEventListener('pointercancel',e=>{
  if(!P||e.pointerId!==P.id)return;
  const p=P;P=null;p.b.classList.remove('is-holding','is-source');endAll();
});
document.addEventListener('contextmenu',e=>{if(e.target.closest&&e.target.closest('.mxp-btn'))e.preventDefault()});
$('#mxdClose').addEventListener('click',closeFactory);
factory.addEventListener('click',e=>{if(e.target===factory)closeFactory()});

window.MXP={get state(){return state},CATALOG:CAT,DEF,fire:id=>DEF[id]&&DEF[id].run(),save,openFactory,closeFactory,renderFactory,renderAll,
  place(id,slot,pos){const i={u:uid(),id};put(i,slot,null,pos||{x:50,y:60});save();renderAll();return i.u},
  reset(){state=blank();save();renderAll()}};

/* ───────────── BARRA · ligações ───────────── */
function wireBar(){
  const on=(id,fn)=>{const el=document.getElementById(id);if(el)el.addEventListener('click',fn)};
  on('sbPlay',()=>TTS.toggle());on('sbStop',()=>TTS.stop(true));on('sbPrev',()=>TTS.prev());
  on('sbCopy',()=>TTS.copy());on('sbClear',()=>TTS.clear());on('sbDownload',()=>TTS.download());
  on('sbViewport',()=>Viewport.toggle());on('sbPlayer',()=>Player.open());
  on('sbPilot',()=>window.KOBCockpit&&window.KOBCockpit.open());

  /* orb: fechada = abre (handler antigo) · aberta = próximo arquétipo · segurar = roda */
  const orb=$('#sbOrb');let lp=null,lpFired=false;
  orb.addEventListener('pointerdown',()=>{
    if(bar.classList.contains('collapsed'))return;
    lpFired=false;lp=setTimeout(()=>{lpFired=true;bar.classList.toggle('show-carousel');Arch._noScroll=false;Arch.paint();
      say(bar.classList.contains('show-carousel')?'◍ roda de arquétipos':'◍ roda oculta');if(navigator.vibrate)navigator.vibrate(18)},520);
  });
  ['pointerup','pointerleave','pointercancel'].forEach(t=>orb.addEventListener(t,()=>clearTimeout(lp)));
  bar.addEventListener('click',e=>{
    if(!e.target.closest('#sbOrb')||bar.classList.contains('collapsed'))return;
    e.stopImmediatePropagation();e.preventDefault();
    if(lpFired){lpFired=false;return}
    Arch.next(1);
  },true);

  /* EXTRAS: toque = recolhe o slot · segurar = FACTORY */
  const head=$('#sbExtrasHead');let hl=null,hf=false;
  head.addEventListener('pointerdown',()=>{hf=false;hl=setTimeout(()=>{hf=true;openFactory();if(navigator.vibrate)navigator.vibrate(30)},520)});
  ['pointerup','pointerleave','pointercancel'].forEach(t=>head.addEventListener(t,()=>clearTimeout(hl)));
  head.addEventListener('click',()=>{if(hf){hf=false;return}bar.classList.toggle('extras-closed');LS.set('sbf_extras_closed',bar.classList.contains('extras-closed')?'1':'0')});
  if(LS.get('sbf_extras_closed')==='1')bar.classList.add('extras-closed');
  head.addEventListener('contextmenu',e=>e.preventDefault());

  /* piloto + hud */
  const pilot=()=>{const n=LS.get('di_userName')||'';$('#sbPilot').textContent=n&&n!=='Convidado'?n:'PILOTO'};
  pilot();
  document.addEventListener('input',e=>{if(e.target&&(e.target.id==='inputUser'||e.target.id==='inputUserId'))setTimeout(pilot,30)});
  window.addEventListener('storage',e=>{if(e.key==='di_userName')pilot()});
  new MutationObserver(()=>{pilot();Arch.dots()}).observe(bar,{attributes:true,attributeFilter:['class','aria-expanded']});
  Viewport.sync();
}

document.addEventListener('keydown',e=>{
  if(e.key!=='Escape')return;
  if(ctx.classList.contains('is-open'))closeCtx();
  else if(Shortcuts.isOpen())Shortcuts.closeEdit();
  else if(factory.classList.contains('is-open'))closeFactory();
});

/* boot */
renderFactory();renderAll();Arch.init();Shortcuts.init();wireBar();TTS.sync();
if('speechSynthesis' in window){try{speechSynthesis.getVoices()}catch{}}
window.KOBSymbolBar={Arch,TTS,Viewport,Player,Shortcuts,MXP:window.MXP,version:'sbf-full-1'};
})();