/* ════════════════════════════════════════════════════════════════
   KOBLLUX · SymbolBar v2.2 · UNIFIED NAV · ∆1134
   12 PORTAS = 12 VIEWS = 12 OPCODES
   Tabbar visível + Sincronia bidirecional + Chromorfismo Cobre
   Layout: right-fixed, compact, drag-handle capture
   ════════════════════════════════════════════════════════════════ */

/* ── 1. TABELA DE ARQUÉTIPOS ── */
const ARCHETYPES = [
  { name:'atlas',   p:'#8e9aaf', s:'#5c6478', a:'#b0bec5', f:432, e:'🗿', r:'FUNDAÇÃO · ESTRUTURA',     opcode:'0x00' },
  { name:'nova',    p:'#00e5ff', s:'#0099cc', a:'#80f4ff', f:528, e:'⚡', r:'ENERGIA · VELOCIDADE',     opcode:'0x01' },
  { name:'vitalis', p:'#00e070', s:'#00a050', a:'#80ffb8', f:639, e:'🌿', r:'VIDA · CRESCIMENTO',       opcode:'0x02' },
  { name:'pulse',   p:'#ff7020', s:'#cc3800', a:'#ffaa60', f:741, e:'🔥', r:'IMPULSO · AÇÃO',           opcode:'0x03' },
  { name:'kaos',    p:'#ff2a6d', s:'#aa0040', a:'#ff80a0', f:852, e:'🌪', r:'CAOS · TRANSFORMAÇÃO',     opcode:'0x04' },
  { name:'kodux',   p:'#00e28b', s:'#0ea5e9', a:'#80f5c8', f:432, e:'🤖', r:'INTERFACE · SISTEMA',      opcode:'0x05' },
  { name:'lumine',  p:'#ffd700', s:'#e09000', a:'#fff280', f:528, e:'✨', r:'LUZ · ILUMINAÇÃO',         opcode:'0x06' },
  { name:'aion',    p:'#9f7aea', s:'#5b21b6', a:'#d4b8ff', f:963, e:'⏳', r:'TEMPO · ETERNIDADE',       opcode:'0x07' },
  { name:'kobllux', p:'#C9A84C', s:'#8B4513', a:'#F0C060', f:432, e:'∞',  r:'VERDADE · INTEGRAR',       opcode:'0x08' },
  { name:'artemis', p:'#c8c8e0', s:'#7070a0', a:'#f0f0ff', f:741, e:'🏹', r:'PRECISÃO · FOCO',          opcode:'0x09' },
  { name:'serena',  p:'#c084fc', s:'#7c3aed', a:'#e8c0ff', f:639, e:'🌸', r:'PAZ · EQUILÍBRIO',         opcode:'0x0A' },
  { name:'genus',   p:'#f59e0b', s:'#b45309', a:'#fcd34d', f:528, e:'🧬', r:'CRIAÇÃO · ESPÉCIE',        opcode:'0x0B' },
  { name:'solus',   p:'#f5f5f5', s:'#aaaaaa', a:'#ffffff', f:963, e:'🕯', r:'SILÊNCIO · VAZIO',         opcode:'0x0C' },
  { name:'rhea',    p:'#b5883c', s:'#7c5010', a:'#d4a860', f:432, e:'🌍', r:'TERRA · MEMÓRIA',          opcode:'0x0D' },
  { name:'trinity', p:'#D4AF37', s:'#9a7a10', a:'#f0d060', f:639, e:'🔱', r:'TRINDADE · SÍNTESE',       opcode:'0x0E' },
  { name:'infodose',p:'#38bdf8', s:'#0369a1', a:'#90e0ff', f:741, e:'💊', r:'INFORMAÇÃO · DOSE',        opcode:'0x0F' },
  { name:'horus',   p:'#f59e0b', s:'#7c3a00', a:'#fbbf24', f:852, e:'👁', r:'VISÃO · GUARDIÃO',         opcode:'0x10' },
  { name:'bllue',   p:'#3b82f6', s:'#1e3a8a', a:'#93c5fd', f:432, e:'🔵', r:'PROFUNDIDADE · FLUXO',     opcode:'0x11' },
  { name:'jesus',   p:'#f0d080', s:'#c09040', a:'#fff8c0', f:528, e:'✝',  r:'AMOR · VERDADE CENTRAL',   opcode:'0x12' },
];

/* ── 2. ESTADO ── */
let currentIdx = ARCHETYPES.findIndex(a => a.name === 'kobllux');
let archCardIdx = currentIdx;
let currentNav = 'home';

/* ── 3. MAPAS DE NAVEGAÇÃO ── */
const NAV_MAP = {
  home:'v-home', apps:'v-apps', stack:'v-stack', brain:'v-brain',
  chat:'v-chat', voz:'v-voz', espelho:'v-espelho', arq:'v-arq',
  uno:'v-uno', core:'v-core', aion:'v-aion', img:'v-img'
};
const REVERSE_MAP = Object.fromEntries(Object.entries(NAV_MAP).map(([k,v])=>[v,k]));

/* ══════════════════════════════════════════════════════════
   4. UTILS
   ══════════════════════════════════════════════════════════ */
function toast(msg, ms=2200){
  const el=document.getElementById('kblx-toast');
  if(!el) return;
  el.textContent=msg; el.classList.add('show');
  clearTimeout(el._t); el._t=setTimeout(()=>el.classList.remove('show'),ms);
}
function hexToRgba(hex,a){
  return `rgba(${parseInt(hex.slice(1,3),16)},${parseInt(hex.slice(3,5),16)},${parseInt(hex.slice(5,7),16)},${a})`;
}
function buildOrbGradient(arch){
  return `radial-gradient(circle at 35% 30%, ${arch.a} 0%, rgba(255,255,255,0.05) 14%, transparent 55%), radial-gradient(circle at 70% 72%, ${arch.p} 0%, ${arch.s} 100%)`;
}

/* ══════════════════════════════════════════════════════════
   5. APLICAR ARQUÉTIPO + CHROMORFISMO
   ══════════════════════════════════════════════════════════ */
function applyArchetype(idx, triggerX, triggerY, animate=true){
  currentIdx = ((idx % ARCHETYPES.length) + ARCHETYPES.length) % ARCHETYPES.length;
  const arch = ARCHETYPES[currentIdx];
  const root = document.documentElement;

  root.style.setProperty('--kob-voice-primary', arch.p);
  root.style.setProperty('--kob-voice-secondary', arch.s);
  root.style.setProperty('--kob-voice-accent', arch.a);
  root.style.setProperty('--arch-color', arch.p);
  root.style.setProperty('--arch-glow', hexToRgba(arch.p, 0.32));
  root.style.setProperty('--arch-glow-strong', hexToRgba(arch.p, 0.6));
  root.style.setProperty('--arch-emoji', `'${arch.e}'`);

  const orbCore = document.querySelector('.orb-core');
  if(orbCore) orbCore.style.background = buildOrbGradient(arch);

  const hud = document.getElementById('hudStatus');
  if(hud) hud.textContent = arch.name.toUpperCase() + ' · ' + currentNav.toUpperCase();

  document.querySelectorAll('.arch-chip').forEach(c=>{
    c.classList.toggle('active', c.dataset.archName === arch.name);
  });

  if(animate){
    const ripple=document.getElementById('chromaRipple');
    const bar=document.getElementById('symbolBar');
    if(!ripple || !bar) return;
    const barRect=bar.getBoundingClientRect();
    const rx=triggerX ?? (barRect.left+barRect.width/2);
    const ry=triggerY ?? (barRect.top+barRect.height/2);
    ripple.style.setProperty('--ripple-x', (rx/window.innerWidth*100)+'%');
    ripple.style.setProperty('--ripple-y', (ry/window.innerHeight*100)+'%');
    ripple.style.background=`radial-gradient(circle at ${rx/window.innerWidth*100}% ${ry/window.innerHeight*100}%, ${arch.p} 0%, ${hexToRgba(arch.s,0.5)} 30%, transparent 70%)`;
    ripple.classList.remove('fire'); void ripple.offsetWidth; ripple.classList.add('fire');
    bar.classList.remove('chroma-transition'); void bar.offsetWidth; bar.classList.add('chroma-transition');
    setTimeout(()=>bar.classList.remove('chroma-transition'), 500);
  }
  try{ localStorage.setItem('kob_arch', arch.name); }catch(e){}
}

/* ══════════════════════════════════════════════════════════
   6. NAVEGAÇÃO UNIFICADA (SymbolBar ↔ Tabbar ↔ Views)
   ══════════════════════════════════════════════════════════ */
function activateView(navKey, source='unknown'){
  const viewId = NAV_MAP[navKey];
  if(!viewId) return;
  currentNav = navKey;

  /* A) Ativar view no DOM */
  document.querySelectorAll('main > section.view').forEach(v=>{
    v.classList.toggle('active', v.id === viewId);
  });

  /* B) Sincronizar TABBAR */
  document.querySelectorAll('nav.tabbar .tab[data-nav], #tabbar .tab[data-nav]').forEach(t=>{
    const isActive = t.dataset.nav === navKey;
    t.classList.toggle('active', isActive);
    t.setAttribute('aria-selected', isActive ? 'true' : 'false');
  });

  /* C) Sincronizar SYMBOLBAR */
  document.querySelectorAll('#symbolBar .symbol-button[data-nav]').forEach(b=>{
    b.classList.toggle('is-active', b.dataset.nav === navKey);
    b.classList.toggle('active', b.dataset.nav === navKey);
  });

  /* D) Atualizar HUD */
  const hud = document.getElementById('hudStatus');
  if(hud){
    const arch = ARCHETYPES[currentIdx];
    hud.textContent = (arch ? arch.name.toUpperCase() : 'KOBLLUX') + ' · ' + navKey.toUpperCase();
  }

  /* E) Scroll */
  window.scrollTo({top:0, behavior:'smooth'});
  console.log('[KBLX·NAV]', source, '→', navKey, '→', viewId);
}

function fireNav(nav){
  try{ if(typeof window.go==='function') return window.go(nav); }catch(e){}
  try{ if(window.router && typeof window.router.go==='function') return window.router.go(nav); }catch(e){}
  const legacy = document.querySelector('nav.tabbar .tab[data-nav="'+nav+'"], #tabbar .tab[data-nav="'+nav+'"]');
  if(legacy){ legacy.click(); return; }
  location.hash = '#'+nav;
}

/* ══════════════════════════════════════════════════════════
   7. CARROSSEL — 12 PORTAS HUB UNO  (SVG da tabbar)
   ══════════════════════════════════════════════════════════ */
const VISIBLE = 5;
const ITEM_H = 48;
const GAP = 6;

const FA_BASE = 'https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6/svgs/solid';

const NAV_BUTTONS = [
  /* ── CONTROLES ── */
  { label:'◀',  id:'btn-prev',  type:'control', action:'prev-arch', title:'Anterior' },
  { label:'▶',  id:'btn-play',  type:'control', action:'play-tts',  title:'Play TTS' },
  { label:'■',  id:'tts-stop',  type:'control', action:'stop-tts',  title:'Parar TTS' },
  { label:'▶▶', id:'btn-next',  type:'control', action:'next-arch', title:'Próximo' },
  { label:'·',  id:'sep-1',     type:'separator' },
  /* ── VIEWS com SVG (mesmos da tabbar) ── */
  { type:'view', nav:'home',    title:'Home',       icon:`<img src="${FA_BASE}/house.svg" width="18" height="18" style="filter:invert(1);opacity:0.85;display:block;margin:auto;pointer-events:none;">` },
  { type:'view', nav:'apps',    title:'Apps',       icon:`<img src="${FA_BASE}/folder-open.svg" width="18" height="18" style="filter:invert(1);opacity:0.85;display:block;margin:auto;pointer-events:none;">` },
  { type:'view', nav:'stack',   title:'Stack',      icon:`<img src="${FA_BASE}/layer-group.svg" width="18" height="18" style="filter:invert(1);opacity:0.85;display:block;margin:auto;pointer-events:none;">` },
  { type:'view', nav:'brain',   title:'Brain',      icon:`<img src="${FA_BASE}/brain.svg" width="18" height="18" style="filter:invert(1);opacity:0.85;display:block;margin:auto;pointer-events:none;">` },
  { type:'view', nav:'chat',    title:'Chat',       icon:`<img src="${FA_BASE}/comments.svg" width="18" height="18" style="filter:invert(1);opacity:0.85;display:block;margin:auto;pointer-events:none;">` },
  { type:'view', nav:'uno',     title:'Uno',        icon:`<span style="font-size:1.1rem;line-height:1">∞</span>` },
  { type:'view', nav:'arq',     title:'Arquétipos', icon:`<span style="font-size:1.05rem;line-height:1">🧿</span>` },
  { type:'view', nav:'core',    title:'Core',       icon:`<span style="font-size:1.05rem;line-height:1">🔮</span>` },
  { type:'view', nav:'voz',     title:'Voz',        icon:`<img src="${FA_BASE}/microphone-lines.svg" width="18" height="18" style="filter:invert(1);opacity:0.85;display:block;margin:auto;pointer-events:none;">` },
  { type:'view', nav:'espelho', title:'Espelho',    icon:`<img src="${FA_BASE}/rotate.svg" width="18" height="18" style="filter:invert(1);opacity:0.85;display:block;margin:auto;pointer-events:none;">` },
  { type:'view', nav:'aion',    title:'Aion',       icon:`<span style="font-size:1.1rem;line-height:1">◎</span>` },
  { type:'view', nav:'img',     title:'Imagem',     icon:`<img src="${FA_BASE}/image.svg" width="18" height="18" style="filter:invert(1);opacity:0.85;display:block;margin:auto;pointer-events:none;">` },
  { label:'·',  id:'sep-2',     type:'separator' },
  /* ── URL BUTTONS ── */
  { label:'🌌', id:'btn-phi',  url:'about:blank', title:'Phi',  dataId:'phi' },
  { label:'🛋', id:'btn-viv',  url:'about:blank', title:'Viv',  dataId:'viv' },
  { label:'◌',  id:'btn-home', url:'about:blank', title:'Home', dataId:'home' },
  { label:'◘',  id:'btn-doc',  url:'about:blank', title:'Doc',  dataId:'doc' },
];

let carouselIdx=0, carouselDragging=false, carouselDragStart=0, carouselDragDelta=0;
let _track=null, _dots=null;

function buildCarousel(){
  const bar = document.getElementById('symbolBar');
  if(!bar) return;
  const hud = bar.querySelector('.hud-info');

  const vp = document.createElement('div');
  vp.className = 'kblx-carousel-viewport';
  vp.style.height = (VISIBLE * ITEM_H - GAP) + 'px';
  hud.before(vp);

  const track = document.createElement('div');
  track.className = 'kblx-carousel-track';
  track.style.gap = GAP + 'px';
  vp.appendChild(track);
  _track = track;

  const dots = document.createElement('div');
  dots.className = 'kblx-dots';
  hud.before(dots);
  _dots = dots;

  NAV_BUTTONS.forEach(def=>{
    const wrap = document.createElement('div');
    wrap.className = 'symbol-wrap';
    wrap.style.height = (def.type==='separator' ? 12 : ITEM_H) + 'px';

    if(def.type==='separator'){
      wrap.innerHTML = '<div class="kblx-separator"></div>';
      track.appendChild(wrap);
      return;
    }

    const btn = document.createElement('button');
    btn.className = 'symbol-button';
    btn.id = def.id || ('nav-'+def.nav);
    btn.title = def.title || def.nav || '';
    btn.style.cssText = 'position:relative;overflow:hidden;';

    if(def.icon){
      btn.innerHTML = def.icon;
    } else {
      btn.textContent = def.label;
    }

    if(def.type==='view'){
      btn.dataset.nav = def.nav;
      btn.classList.add('nav-view-btn');
    }
    if(def.url) btn.dataset.url = def.url;
    if(def.dataId) btn.dataset.id = def.dataId;

    // Long-press ring para botões de URL
    if(def.url && def.type!=='control' && def.type!=='view'){
      const ring = document.createElement('div');
      ring.className = 'kblx-ring';
      ring.innerHTML = '<svg viewBox="0 0 44 44"><circle cx="22" cy="22" r="18" class="nav-ring-c"/></svg>';
      btn.appendChild(ring);
      setupNavLongPress(btn);
    }

    wrap.appendChild(btn);
    track.appendChild(wrap);
  });

  // Wire controles
  document.getElementById('btn-prev')?.addEventListener('click', ()=>applyArchetype(currentIdx-1));
  document.getElementById('btn-next')?.addEventListener('click', ()=>applyArchetype(currentIdx+1));
  document.getElementById('btn-play')?.addEventListener('click', togglePlay);
  document.getElementById('tts-stop')?.addEventListener('click', stopTTS);

  // Wire view buttons
  document.querySelectorAll('.symbol-button[data-nav]').forEach(btn=>{
    btn.addEventListener('click', function(e){
      e.stopPropagation();
      const nav = this.dataset.nav;
      if(nav){ activateView(nav, 'symbolbar'); fireNav(nav); }
    });
  });

  // Wire URL buttons
  ['btn-phi','btn-viv','btn-home','btn-doc'].forEach(id=>{
    const btn=document.getElementById(id);
    if(!btn) return;
    btn.addEventListener('click', function(e){
      if(this._longPressed){ this._longPressed=false; return; }
      const url=this.dataset.url;
      if(url && url!=='about:blank') loadInternalFrame(url);
    });
  });

  // ── DRAG DO CARROSSEL (isolado, não conflita com drag da barra) ──
  let isTrackDragging=false, trackStartY=0, trackDelta=0;

  track.addEventListener('mousedown', e=>{
    if(e.button!==0) return;
    isTrackDragging=true; trackStartY=e.clientY; trackDelta=0;
    track.classList.add('kblx-dragging');
    e.stopPropagation();
  });
  track.addEventListener('mousemove', e=>{
    if(!isTrackDragging) return;
    trackDelta=e.clientY-trackStartY;
    applyTrack(carouselIdx*ITEM_H-trackDelta, false);
    e.stopPropagation();
  });
  track.addEventListener('mouseup', e=>{
    if(!isTrackDragging) return;
    isTrackDragging=false; track.classList.remove('kblx-dragging');
    snapCarousel(carouselIdx-Math.round(trackDelta/ITEM_H));
    e.stopPropagation();
  });
  track.addEventListener('mouseleave', ()=>{
    if(!isTrackDragging) return;
    isTrackDragging=false; track.classList.remove('kblx-dragging');
    snapCarousel(carouselIdx-Math.round(trackDelta/ITEM_H));
  });

  track.addEventListener('touchstart', e=>{
    trackStartY=e.touches[0].clientY; trackDelta=0; isTrackDragging=true;
    track.classList.add('kblx-dragging');
  }, {passive:true});
  track.addEventListener('touchmove', e=>{
    if(!isTrackDragging) return;
    trackDelta=e.touches[0].clientY-trackStartY;
    applyTrack(carouselIdx*ITEM_H-trackDelta, false);
  }, {passive:true});
  track.addEventListener('touchend', ()=>{
    if(!isTrackDragging) return;
    isTrackDragging=false; track.classList.remove('kblx-dragging');
    snapCarousel(carouselIdx-Math.round(trackDelta/ITEM_H));
  }, {passive:true});

  vp.addEventListener('wheel', e=>{
    e.preventDefault();
    snapCarousel(carouselIdx+(e.deltaY>0?1:-1));
  }, {passive:false});

  snapCarousel(0);
}

function getMaxIdx(){ return Math.max(0, NAV_BUTTONS.length-VISIBLE); }

function applyTrack(offsetPx, animate){
  if(!_track) return;
  _track.style.transition = animate ? 'transform 0.32s cubic-bezier(0.25,0.8,0.25,1)' : 'none';
  _track.style.transform = `translateY(${-offsetPx}px)`;
}

function renderDots(){
  if(!_dots) return;
  _dots.innerHTML='';
  const pages = Math.ceil(NAV_BUTTONS.length/VISIBLE);
  const active = Math.floor(carouselIdx/VISIBLE);
  for(let i=0;i<pages;i++){
    const d=document.createElement('div');
    d.className='kblx-dot'+(i===active?' active':'');
    d.addEventListener('click',()=>snapCarousel(i*VISIBLE));
    _dots.appendChild(d);
  }
  _dots.style.display = pages<=1?'none':'flex';
}

function snapCarousel(idx){
  carouselIdx = Math.max(0, Math.min(Math.round(idx), getMaxIdx()));
  applyTrack(carouselIdx*ITEM_H, true);
  renderDots();
}

/* ══════════════════════════════════════════════════════════
   8. IFRAME INTERNO
   ══════════════════════════════════════════════════════════ */
function loadInternalFrame(url){
  const frame=document.getElementById('kob-bg-frame');
  const veil=document.getElementById('kob-frame-veil');
  const close=document.getElementById('kob-frame-close');
  if(!frame) return;
  frame.src=url; frame.classList.add('visible');
  veil?.classList.add('visible'); close?.classList.add('visible');
  toast('⊙ CARREGANDO: '+url.split('/').pop());
}
document.getElementById('kob-frame-close')?.addEventListener('click',()=>{
  const frame=document.getElementById('kob-bg-frame');
  const veil=document.getElementById('kob-frame-veil');
  const close=document.getElementById('kob-frame-close');
  frame?.classList.remove('visible');
  veil?.classList.remove('visible');
  close?.classList.remove('visible');
  setTimeout(()=>{ if(frame) frame.src='about:blank'; }, 500);
});

/* ══════════════════════════════════════════════════════════
   9. ARCH OVERLAY / WHEEL
   ══════════════════════════════════════════════════════════ */
function buildArchWheel(){
  const wheel=document.getElementById('archWheel');
  if(!wheel) return;
  ARCHETYPES.forEach((arch,idx)=>{
    const chip=document.createElement('div');
    chip.className='arch-chip';
    chip.dataset.archName=arch.name;
    chip.style.color=arch.p;
    chip.innerHTML=`<div class="a-orb" style="background:radial-gradient(circle at 35% 30%, ${arch.a} 0%, transparent 50%), radial-gradient(circle at 70% 70%, ${arch.p} 0%, ${arch.s} 100%);"></div><div class="a-name">${arch.name}</div><div class="a-freq">${arch.f}Hz</div>`;
    chip.addEventListener('click',()=>{
      const r=chip.getBoundingClientRect();
      applyArchetype(idx, r.left+r.width/2, r.top+r.height/2);
      closeArchOverlay();
    });
    wheel.appendChild(chip);
  });
}
document.getElementById('btn-arch')?.addEventListener('click',()=>{
  const btn=document.getElementById('btn-arch');
  if(btn && btn._longPressed){ btn._longPressed=false; return; }
  openArchOverlay();
});
function openArchOverlay(){ document.getElementById('arch-overlay')?.classList.add('open'); }
function closeArchOverlay(){ document.getElementById('arch-overlay')?.classList.remove('open'); }
document.getElementById('arch-overlay')?.addEventListener('click',e=>{
  if(e.target===document.getElementById('arch-overlay')) closeArchOverlay();
});

/* ══════════════════════════════════════════════════════════
   10. ARCH CARD
   ══════════════════════════════════════════════════════════ */
function openArchCard(idx){
  archCardIdx = ((idx%ARCHETYPES.length)+ARCHETYPES.length)%ARCHETYPES.length;
  renderArchCard();
  document.getElementById('arch-card-overlay')?.classList.add('open');
}
function closeArchCard(){ document.getElementById('arch-card-overlay')?.classList.remove('open'); }
function renderArchCard(){
  const arch=ARCHETYPES[archCardIdx];
  const chip=document.getElementById('acp-chip');
  if(chip) chip.textContent = arch.opcode+' · '+arch.name.toUpperCase();
  const name=document.getElementById('acp-name');
  if(name) name.textContent = arch.name.toUpperCase();
  const role=document.getElementById('acp-role');
  if(role) role.textContent = arch.r;
  const freq=document.getElementById('acp-freq');
  if(freq) freq.innerHTML = `${arch.f} <span>Hz</span>`;
  const emoji=document.getElementById('acp-emoji');
  if(emoji) emoji.textContent = arch.e;
  const navName=document.getElementById('acp-nav-name');
  if(navName) navName.textContent = arch.name.toUpperCase();
  const placeholder=document.getElementById('acp-placeholder-text');
  if(placeholder) placeholder.innerHTML = `[ ${arch.name.toUpperCase()} · MÓDULO ]<br>Conteúdo do arquétipo será linkado aqui.`;
  document.documentElement.style.setProperty('--arch-color', arch.p);
  document.documentElement.style.setProperty('--arch-glow', hexToRgba(arch.p,0.32));
  const orbEl=document.getElementById('acp-orb');
  if(orbEl) orbEl.style.background = `radial-gradient(circle at 35% 30%, ${arch.a} 0%, rgba(255,255,255,0.06) 15%, transparent 55%), radial-gradient(circle at 70% 72%, ${arch.p} 0%, ${arch.s} 100%)`;
}
document.getElementById('acp-close')?.addEventListener('click',closeArchCard);
document.getElementById('acp-select')?.addEventListener('click',()=>{
  applyArchetype(archCardIdx); closeArchCard();
  toast('⊙ ATIVADO: '+ARCHETYPES[currentIdx].name.toUpperCase()+' · '+ARCHETYPES[currentIdx].f+'Hz');
});
document.getElementById('acp-prev')?.addEventListener('click',()=>{ archCardIdx=((archCardIdx-1+ARCHETYPES.length)%ARCHETYPES.length); renderArchCard(); });
document.getElementById('acp-next')?.addEventListener('click',()=>{ archCardIdx=((archCardIdx+1)%ARCHETYPES.length); renderArchCard(); });
document.getElementById('arch-card-overlay')?.addEventListener('click',e=>{ if(e.target===document.getElementById('arch-card-overlay')) closeArchCard(); });

/* ══════════════════════════════════════════════════════════
   11. LONG-PRESS ORB
   ══════════════════════════════════════════════════════════ */
(function setupOrbLongPress(){
  const btn=document.getElementById('btn-arch');
  const circle=document.getElementById('orb-ring-circle');
  if(!btn) return;
  const CIRC=138, DURATION=600;
  let timer,raf,t0;
  function start(){
    btn._longPressed=false; t0=Date.now();
    timer=setTimeout(()=>{
      btn._longPressed=true; cancelAnimationFrame(raf);
      if(circle) circle.style.strokeDashoffset=CIRC;
      openArchCard(currentIdx);
    }, DURATION);
    (function tick(){
      if(t0===null) return;
      const p=Math.min((Date.now()-t0)/DURATION,1);
      if(circle){ circle.style.transition='none'; circle.style.strokeDashoffset=CIRC*(1-p); }
      if(p<1) raf=requestAnimationFrame(tick);
    })();
  }
  function cancel(){
    clearTimeout(timer); cancelAnimationFrame(raf); t0=null;
    if(circle){ circle.style.transition='stroke-dashoffset .2s ease'; circle.style.strokeDashoffset=CIRC; }
  }
  btn.addEventListener('pointerdown',start,{passive:true});
  btn.addEventListener('pointerup',cancel,{passive:true});
  btn.addEventListener('pointerleave',cancel,{passive:true});
})();

/* ══════════════════════════════════════════════════════════
   12. LONG-PRESS NAV BUTTONS
   ══════════════════════════════════════════════════════════ */
function setupNavLongPress(btn){
  const CIRC=113, DURATION=3000;
  let timer,raf,t0;
  function start(){
    btn._longPressed=false; t0=Date.now();
    timer=setTimeout(()=>{
      btn._longPressed=true; cancelAnimationFrame(raf);
      const c=btn.querySelector('.nav-ring-c');
      if(c){ c.style.transition='stroke-dashoffset .2s ease'; c.style.strokeDashoffset=CIRC; }
      openUrlEditor(btn);
    }, DURATION);
    (function tick(){
      if(t0===null) return;
      const p=Math.min((Date.now()-t0)/DURATION,1);
      const c=btn.querySelector('.nav-ring-c');
      if(c){ c.style.transition='none'; c.style.strokeDashoffset=CIRC*(1-p); }
      if(p<1) raf=requestAnimationFrame(tick);
    })();
  }
  function cancel(){
    clearTimeout(timer); cancelAnimationFrame(raf); t0=null;
    const c=btn.querySelector('.nav-ring-c');
    if(c){ c.style.transition='stroke-dashoffset .2s ease'; c.style.strokeDashoffset=CIRC; }
  }
  btn.addEventListener('pointerdown',start,{passive:true});
  btn.addEventListener('pointerup',cancel,{passive:true});
  btn.addEventListener('pointerleave',cancel,{passive:true});
}

let urlEditorTarget=null;
function openUrlEditor(btn){
  urlEditorTarget=btn;
  const id=btn.dataset.id||btn.id||'?';
  document.getElementById('kblx-ttl').textContent='Botão · '+id;
  document.getElementById('kblx-inp').value=btn.dataset.url||'';
  document.getElementById('kblx-back').classList.add('open');
  setTimeout(()=>document.getElementById('kblx-inp').focus(),80);
}
document.getElementById('kblx-btn-save')?.addEventListener('click',()=>{
  if(urlEditorTarget){
    const v=document.getElementById('kblx-inp').value.trim();
    if(v){ urlEditorTarget.dataset.url=v; toast('✓ URL atualizado'); }
  }
  document.getElementById('kblx-back').classList.remove('open');
});
document.getElementById('kblx-btn-close')?.addEventListener('click',()=>document.getElementById('kblx-back').classList.remove('open'));
document.getElementById('kblx-back')?.addEventListener('click',e=>{ if(e.target===document.getElementById('kblx-back')) document.getElementById('kblx-back').classList.remove('open'); });

/* ══════════════════════════════════════════════════════════
   13. TTS
   ══════════════════════════════════════════════════════════ */
let currentUtterance=null;
function speak(text){
  if(!window.speechSynthesis) return;
  stopTTS();
  const arch=ARCHETYPES[currentIdx];
  const utt=new SpeechSynthesisUtterance(text);
  utt.lang='pt-BR'; utt.pitch=1.0; utt.rate=1.0;
  utt.onstart=()=>document.getElementById('main-orb')?.classList.add('speaking');
  utt.onend=utt.onerror=()=>document.getElementById('main-orb')?.classList.remove('speaking');
  currentUtterance=utt; speechSynthesis.speak(utt);
}
function stopTTS(){
  if(window.speechSynthesis) speechSynthesis.cancel();
  document.getElementById('main-orb')?.classList.remove('speaking');
}
function togglePlay(){
  if(!window.speechSynthesis) return;
  if(speechSynthesis.speaking && !speechSynthesis.paused) speechSynthesis.pause();
  else if(speechSynthesis.paused) speechSynthesis.resume();
  else { const a=ARCHETYPES[currentIdx]; speak(`Arquétipo ${a.name}. Frequência ${a.f} Hertz. ${a.r}.`); }
}

/* ══════════════════════════════════════════════════════════
   14. DRAG & SNAP (symbol-bar)  +  DRAG HANDLE
   ══════════════════════════════════════════════════════════ */
const bar=document.getElementById('symbolBar');
let sbDragging=false, sbOffX=0, sbOffY=0;

/* Cria drag handle invisível por trás dos botões */
function createDragHandle(){
  if(!bar) return;
  if(bar.querySelector('.sb-drag-handle')) return;
  const handle = document.createElement('div');
  handle.className = 'sb-drag-handle';
  handle.style.cssText = 'position:absolute;inset:0;z-index:0;cursor:grab;background:transparent;border-radius:inherit;';
  bar.insertBefore(handle, bar.firstChild);
}

/* Restaura posição salva ou centraliza à direita */
function initBarPosition(){
  if(!bar) return;
  const savedPos=(()=>{ try{return JSON.parse(localStorage.getItem('kob_symbolbar_pos'));}catch(e){return null;} })();
  if(savedPos && savedPos.top!=null && savedPos.left!=null){
    bar.style.top = savedPos.top+'px';
    bar.style.left = savedPos.left+'px';
    bar.style.right='auto';
    bar.style.transform='none';
  } else {
    bar.style.top='50%';
    bar.style.left='auto';
    bar.style.right='12px';
    bar.style.transform='translateY(-50%)';
  }
}

if(bar){
  createDragHandle();
  initBarPosition();

  bar.addEventListener('pointerdown', e=>{
    // Se clicou em botão, carrossel, orb → NÃO drag
    if(e.target.closest('button, .kblx-carousel-viewport, .kblx-dots, .orb-microphone-container')) return;
    sbDragging=true;
    bar.setPointerCapture(e.pointerId);
    const r=bar.getBoundingClientRect();
    sbOffX=e.clientX-r.left; sbOffY=e.clientY-r.top;
    bar.classList.add('is-dragging');
    bar.classList.remove('snap-side','snap-side-right','snap-top','snap-bottom','floating');
    bar.style.transform='none';
    bar.style.right='auto';
    bar.style.bottom='auto';
    e.preventDefault();
  });
}

window.addEventListener('pointermove', e=>{
  if(!sbDragging || !bar) return;
  let x=Math.max(0, Math.min(window.innerWidth-bar.offsetWidth, e.clientX-sbOffX));
  let y=Math.max(0, Math.min(window.innerHeight-bar.offsetHeight, e.clientY-sbOffY));
  bar.style.left=x+'px'; bar.style.top=y+'px';
});

window.addEventListener('pointerup', ()=>{
  if(!sbDragging || !bar) return;
  sbDragging=false; bar.classList.remove('is-dragging');
  snapBar();
  try{
    const r=bar.getBoundingClientRect();
    localStorage.setItem('kob_symbolbar_pos', JSON.stringify({top:r.top, left:r.left}));
  }catch(e){}
});

function snapBar(){
  if(!bar) return;
  const r=bar.getBoundingClientRect();
  const cx=r.left+r.width/2, cy=r.top+r.height/2;
  const W=window.innerWidth, H=window.innerHeight;
  const dl=cx, dr=W-cx, dt=cy, db=H-cy;

  bar.classList.remove('snap-side','snap-side-right','snap-top','snap-bottom','floating');

  if(dl<60){
    bar.classList.add('snap-side');
    bar.style.left='0'; bar.style.right='auto';
    bar.style.top=Math.max(10, Math.min(H-bar.offsetHeight-10, r.top))+'px';
  } else if(dr<60){
    bar.classList.add('snap-side-right');
    bar.style.left='auto'; bar.style.right='0';
    bar.style.top=Math.max(10, Math.min(H-bar.offsetHeight-10, r.top))+'px';
  } else if(dt<60){
    bar.classList.add('snap-top');
    bar.style.top='10px';
    bar.style.left=Math.max(10, Math.min(W-bar.offsetWidth-10, r.left))+'px';
  } else if(db<90){
    bar.classList.add('snap-bottom');
    bar.style.top='auto'; bar.style.bottom='80px';
    bar.style.left=Math.max(10, Math.min(W-bar.offsetWidth-10, r.left))+'px';
  } else {
    bar.classList.add('floating');
  }
}

/* ══════════════════════════════════════════════════════════
   15. IDLE TIMER
   ══════════════════════════════════════════════════════════ */
let idleTimer;
function resetIdle(){
  bar?.classList.remove('idle'); clearTimeout(idleTimer);
  idleTimer=setTimeout(()=>{ if(!sbDragging) bar?.classList.add('idle'); }, 4000);
}
['pointerdown','pointermove','touchstart','mousemove'].forEach(ev=>document.addEventListener(ev,resetIdle,{passive:true}));
resetIdle();

/* ══════════════════════════════════════════════════════════
   16. TOGGLE COLLAPSED
   ══════════════════════════════════════════════════════════ */
document.getElementById('toggleBtn')?.addEventListener('click', (e)=>{
  e.stopPropagation();
  bar?.classList.toggle('collapsed');
  const isCollapsed=bar?.classList.contains('collapsed');
  try{ localStorage.setItem('kob_symbolbar_collapsed', isCollapsed?'1':'0'); }catch(e){}
});

/* ══════════════════════════════════════════════════════════
   17. WIRE TABBAR ↔ SYMBOLBAR SYNC
   ══════════════════════════════════════════════════════════ */
function wireTabbarSync(){
  document.querySelectorAll('nav.tabbar .tab[data-nav], #tabbar .tab[data-nav]').forEach(tab=>{
    tab.addEventListener('click', e=>{
      e.preventDefault(); e.stopPropagation();
      activateView(tab.dataset.nav, 'tabbar');
      fireNav(tab.dataset.nav);
    });
  });

  const mainEl=document.querySelector('main');
  if(mainEl){
    new MutationObserver(ms=>ms.forEach(m=>{
      if(m.type==='attributes' && m.attributeName==='class'){
        const v=m.target;
        if(v.classList.contains('active')){
          const k=REVERSE_MAP[v.id];
          if(k && k!==currentNav){
            currentNav=k;
            document.querySelectorAll('nav.tabbar .tab[data-nav], #tabbar .tab[data-nav]').forEach(t=>{
              t.classList.toggle('active', t.dataset.nav===k);
            });
            document.querySelectorAll('#symbolBar .symbol-button[data-nav]').forEach(b=>{
              b.classList.toggle('is-active', b.dataset.nav===k);
              b.classList.toggle('active', b.dataset.nav===k);
            });
            const hud=document.getElementById('hudStatus');
            if(hud){ const arch=ARCHETYPES[currentIdx]; hud.textContent=(arch?arch.name.toUpperCase():'KOBLLUX')+' · '+k.toUpperCase(); }
          }
        }
      }
    })).observe(mainEl, {subtree:true, attributes:true, attributeFilter:['class']});
  }

  document.querySelectorAll('[data-nav]').forEach(el=>{
    if(el.closest('nav.tabbar') || el.closest('#tabbar') || el.closest('.symbol-bar')) return;
    el.addEventListener('click', e=>{
      const navKey=el.dataset.nav;
      if(NAV_MAP[navKey]) activateView(navKey, 'internal');
    });
  });
}

/* ══════════════════════════════════════════════════════════
   18. INIT
   ══════════════════════════════════════════════════════════ */
buildArchWheel();
buildCarousel();
wireTabbarSync();

const tabbarEl = document.querySelector('nav.tabbar, #tabbar');
if(tabbarEl){ tabbarEl.style.display='flex'; tabbarEl.style.visibility='visible'; tabbarEl.style.opacity='1'; }

const savedCollapsed=(()=>{ try{return localStorage.getItem('kob_symbolbar_collapsed');}catch(e){return null;} })();
if(savedCollapsed==='1' && bar) bar.classList.add('collapsed');

const saved=(()=>{ try{return localStorage.getItem('kob_arch');}catch(e){return null;} })();
const savedIdx=saved?ARCHETYPES.findIndex(a=>a.name===saved):-1;
applyArchetype(savedIdx>=0?savedIdx:ARCHETYPES.findIndex(a=>a.name==='kobllux'), null, null, false);

const activeView=document.querySelector('main>section.view.active');
if(activeView){ const k=REVERSE_MAP[activeView.id]||'home'; currentNav=k; activateView(k,'init'); }

console.log('KOBLLUX · SymbolBar v2.2 · SVG+Drag+ZIndex · VERDADE×INTEGRAR÷Δ=∞');
