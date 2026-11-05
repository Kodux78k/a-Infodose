
'use strict';
(function(){
const $ = id => document.getElementById(id);
const $$ = s => document.querySelectorAll(s);
const escapeHTML = v => String(v||'').replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const escapeRegExp = v => String(v).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const stripMarkup = v => String(v||'').replace(/<script[\s\S]*?<\/script>/gi," ").replace(/<style[\s\S]*?<\/style>/gi," ")
  .replace(/<br\s*\/?>/gi,"\n").replace(/<\/p>/gi,"\n").replace(/<\/div>/gi,"\n").replace(/<\/h[1-6]>/gi,"\n")
  .replace(/<[^>]+>/g," ").replace(/^\s*#{1,6}\s+/gm,"").replace(/[*_`~]/g,"").replace(/\r/g,"")
  .replace(/[ \t]+/g," ").replace(/\n{3,}/g,"\n\n").trim();

// ═══════════════════════════════════════════════════════════
// LAYOUT · header / nav / player independentes
// ═══════════════════════════════════════════════════════════
const Layout = {
  state: {
    headerSnap : 'top',
    navHome    : 'header',
    playerHome : 'header',
    orbBrand   : true,
    headerCollapsed: false,
    headerFree : null
  },
  load(){
    try {
      const raw = localStorage.getItem('domr:layout');
      if (raw) Object.assign(this.state, JSON.parse(raw));
    } catch {}
  },
  save(){
    try { localStorage.setItem('domr:layout', JSON.stringify(this.state)); } catch {}
  },
  slotFor(kind, home){
    if (home === 'header') return document.querySelector(`.hdr-slot[data-slot="${kind}"]`);
    if (home === 'hidden') return null;
    return document.querySelector(`.domr-dock[data-dock="${home}"]`);
  },
  apply(){
    const wrap = $('headerWrap');
    wrap.dataset.snap = this.state.headerSnap;
    document.body.dataset.headerSnap = this.state.headerSnap;

    if (this.state.headerSnap === 'free' && this.state.headerFree){
      wrap.style.left = this.state.headerFree.x + 'px';
      wrap.style.top  = this.state.headerFree.y + 'px';
    } else {
      wrap.style.left = '';
      wrap.style.top  = '';
    }

    const nav = $('sessionNav');
    nav.dataset.home = this.state.navHome;
    const navSlot = this.slotFor('nav', this.state.navHome);
    if (navSlot) navSlot.appendChild(nav);
    nav.style.display = this.state.navHome === 'hidden' ? 'none' : '';
    document.body.dataset.navHome = this.state.navHome;

    const player = $('miniPlayer');
    player.dataset.home = this.state.playerHome;
    const plSlot = this.slotFor('player', this.state.playerHome);
    if (plSlot) plSlot.appendChild(player);
    player.style.display = this.state.playerHome === 'hidden' ? 'none' : '';
    document.body.dataset.playerHome = this.state.playerHome;

    document.body.dataset.orbBrand = this.state.orbBrand ? 'on' : 'off';
    $('headerDetails').classList.toggle('is-collapsed', this.state.headerCollapsed);

    this.save();
    if (window.Player) Player.paintUI();
  },
  set(key, value){
    this.state[key] = value;
    this.apply();
    toast(`${key}: ${value}`);
  }
};
Layout.load();
Layout.apply();

// ═══════════════════════════════════════════════════════════
// Drag genérico
// ═══════════════════════════════════════════════════════════
function makeDraggable(el, { grip, onDrop } = {}){
  grip = grip || el;
  let dragging = false, moved = false;
  let downX, downY, sL, sT, sW;

  grip.addEventListener('pointerdown', (e) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    dragging = true; moved = false;
    downX = e.clientX; downY = e.clientY;
    const r = el.getBoundingClientRect();
    sL = r.left; sT = r.top; sW = r.width;
    try { grip.setPointerCapture(e.pointerId); } catch {}
  });

  grip.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    const dx = e.clientX - downX, dy = e.clientY - downY;
    if (!moved && Math.abs(dx) < 6 && Math.abs(dy) < 6) return;
    if (!moved){
      moved = true;
      el.classList.add('domr-dragging');
      el.style.position = 'fixed';
      el.style.left = sL + 'px';
      el.style.top = sT + 'px';
      el.style.width = sW + 'px';
      el.style.margin = '0';
      el.style.zIndex = '6000';
      document.body.style.cursor = 'grabbing';
    }
    el.style.left = (sL + dx) + 'px';
    el.style.top  = (sT + dy) + 'px';
  });

  const end = (e) => {
    if (!dragging) return;
    dragging = false;
    try { grip.releasePointerCapture(e.pointerId); } catch {}
    if (!moved) return;
    el.classList.remove('domr-dragging');
    ['position','left','top','width','margin','zIndex'].forEach(k => el.style[k] = '');
    document.body.style.cursor = '';
    const sup = (ev) => { ev.stopPropagation(); ev.preventDefault(); grip.removeEventListener('click', sup, true); };
    grip.addEventListener('click', sup, true);
    setTimeout(() => grip.removeEventListener('click', sup, true), 250);
    if (onDrop) onDrop(e.clientX, e.clientY, sL, sT);
  };
  grip.addEventListener('pointerup', end);
  grip.addEventListener('pointercancel', end);
}

function zoneFor(x, y){
  const vw = innerWidth, vh = innerHeight, m = 90;
  if (y < m) return 'top';
  if (vh - y < m) return 'footer';
  // ↓ desabilitado: você pluga seu próprio "symbol bar" depois
  // if (x < m) return 'left';
  // if (vw - x < m) return 'right';
  return 'free';
}

// ═══════════════════════════════════════════════════════════
// HEADER UI
// ═══════════════════════════════════════════════════════════
const HeaderUI = {
  init(){
    const wrap = $('headerWrap');
    if (!wrap) return;

    const btns = $('topbarBtns');
    if (btns) {
      ['click','mousedown','touchstart','pointerdown'].forEach(evt =>
        btns.addEventListener(evt, e => e.stopPropagation()));
    }

    const toggleNav = (e) => {
      if (e) { e.preventDefault(); e.stopPropagation(); }
      document.body.classList.toggle('hide-nav');
      const on = !document.body.classList.contains('hide-nav');
      $('tabsToggle').classList.toggle('off', !on);
      $('tabsToggle').classList.toggle('on', on);
      toast(on ? '▤ Nav visível' : '▤ Nav oculta');
    };
    const togglePlayer = (e) => {
      if (e) { e.preventDefault(); e.stopPropagation(); }
      document.body.classList.toggle('hide-player');
      const on = !document.body.classList.contains('hide-player');
      $('playerToggle').classList.toggle('off', !on);
      $('playerToggle').classList.toggle('on', on);
      toast(on ? '♪ Player visível' : '♪ Player oculto');
    };

    $('tabsToggle').addEventListener('click', toggleNav);
    $('playerToggle').addEventListener('click', togglePlayer);
    const playerInfo = $('playerInfo');
    if (playerInfo) playerInfo.addEventListener('click', toggleNav);

    const chevron = $('hdrChevron');
    chevron.addEventListener('click', (e) => {
      e.stopPropagation();
      Layout.set('headerCollapsed', !Layout.state.headerCollapsed);
    });
    chevron.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        Layout.set('headerCollapsed', !Layout.state.headerCollapsed);
      }
    });

    // painel de layout
    const panel = $('layoutPanel');
    $('layoutBtn').addEventListener('click', (e) => {
      e.stopPropagation();
      panel.hidden = !panel.hidden;
      panel.querySelectorAll('[data-layout]').forEach(inp => {
        const key = inp.dataset.layout;
        if (inp.type === 'checkbox') inp.checked = !!Layout.state[key];
        else inp.value = Layout.state[key];
      });
    });
    document.addEventListener('click', (e) => {
      if (!panel.hidden && !panel.contains(e.target) && e.target.id !== 'layoutBtn') {
        panel.hidden = true;
      }
    });
    panel.addEventListener('click', e => e.stopPropagation());
    panel.querySelectorAll('[data-layout]').forEach(inp => {
      inp.addEventListener('change', () => {
        const key = inp.dataset.layout;
        if (inp.type === 'checkbox') Layout.set(key, inp.checked);
        else Layout.set(key, inp.value);
      });
    });

    // drag header pelo brandMark
    makeDraggable(wrap, {
      grip: $('brandMark'),
      onDrop(x, y, sL, sT){
        const zone = zoneFor(x, y);
        if (zone === 'free'){
          Layout.state.headerFree = {
            x: Math.max(10, Math.min(x - sL, innerWidth - 320)),
            y: Math.max(10, Math.min(y - sT, innerHeight - 80))
          };
        }
        Layout.set('headerSnap', zone);
      }
    });

    // drag nav
    makeDraggable($('sessionNav'), {
      grip: $('sessionNav').querySelector('[data-grip="nav"]'),
      onDrop(x, y){
        const z = zoneFor(x, y);
        Layout.set('navHome', z === 'top' ? 'header' : z === 'free' ? 'header' : z);
      }
    });

// drag player (agora pelo orb)
makeDraggable($('miniPlayer'), {
grip: $('playerOrb'),
onDrop(x, y){
const z = zoneFor(x, y);
Layout.set('playerHome', z === 'top' ? 'header' : z === 'free' ? 'app-side' : z);
}
});
  }
};
HeaderUI.init();

// ═══════════════════════════════════════════════════════════
// LOGO → ocultar/mostrar app inteiro
// ═══════════════════════════════════════════════════════════
(function initLogoCollapse(){
  const mark = $('brandMark');
  if (!mark) return;
  try {
    if (localStorage.getItem('domr:app:hidden') === '1') {
      document.body.classList.add('app-collapsed');
      mark.classList.add('app-hidden-state');
    }
  } catch {}
  ['mousedown','touchstart','pointerdown'].forEach(evt => {
    mark.addEventListener(evt, e => e.stopPropagation());
  });
  mark.addEventListener('click', e => {
    e.preventDefault();
    e.stopPropagation();
    const hidden = document.body.classList.toggle('app-collapsed');
    mark.classList.toggle('app-hidden-state', hidden);
    try { localStorage.setItem('domr:app:hidden', hidden ? '1' : '0'); } catch {}
    mark.title = hidden ? 'Clique para mostrar o app' : 'Clique para ocultar o app';
    toast(hidden ? '◉ App oculto' : '◉ App visível');
  });
  mark.title = document.body.classList.contains('app-collapsed')
    ? 'Clique para mostrar o app'
    : 'Clique para ocultar o app';
})();

// ═══════════════════════════════════════════════════════════
// SISTEMA
// ═══════════════════════════════════════════════════════════
const SYS = {
  kobTextEvents: !!(window.KOBTextEvents && window.KOBTextEvents.parse),
  metaLuxOp: !!(window.META_LUX_OPERATOR && window.META_LUX_OPERATOR.parseAST),
  sonoro: !!(window.KOBSonoro && typeof window.KOBSonoro.playText === 'function'),
  sonoroParent: (()=>{try{return window.parent!==window && !!(window.parent.KOBSonoro && typeof window.parent.KOBSonoro.playText==='function')}catch{return false}})(),
  nebula: !!(window.NebulaPills && Array.isArray(window.NebulaPills.docs)),
  nebulaParent: (()=>{try{return window.parent!==window && !!(window.parent.NebulaPills && Array.isArray(window.parent.NebulaPills.docs))}catch{return false}})(),
  kblxVoice: !!(window.KBLX_VOICE && window.KBLX_VOICE.map),
  speech: !!(window.KOB_SPEECH && typeof window.KOB_SPEECH.use === 'function'),
  kblxArch: !!(window.KOBArch)
};
console.log('%c[Dom R] %cSYS:','background:#f59e0b;color:#000;padding:2px 6px;border-radius:3px','color:#f59e0b', SYS);

const ARCH_COLORS = {ATLAS:"#38BDF8",NOVA:"#F72585",VITALIS:"#22C55E",PULSE:"#EC4899",ARTEMIS:"#A855F7",SERENA:"#38BDF8",KAOS:"#FACC15",GENUS:"#E5E7EB",LUMINE:"#FDE047",SOLUS:"#0EA5E9",RHEA:"#22C55E",AION:"#4F46E5",KODUX:"#F97316",BLLUE:"#3B82F6",JESUS:"#FFD700",KOBLLUX:"#22D3EE",INFODOSE:"#ff7a00"};

const PHASE_ARCH_POOL = {3:['SOLUS','ARTEMIS','AION','KAOS'],6:['RHEA','SERENA','GENUS','PULSE'],9:['NOVA','LUMINE','VITALIS','JESUS'],7:['KOBLLUX','ATLAS','KODUX']};
const phaseArchIdx = {3:0, 6:0, 9:0, 7:0};
function pickArch(phase){
  const pool = PHASE_ARCH_POOL[phase] || ['KOBLLUX'];
  const idx = (phaseArchIdx[phase] || 0) % pool.length;
  phaseArchIdx[phase] = (phaseArchIdx[phase] || 0) + 1;
  return pool[idx];
}

const PHASE_LABELS = {
  3:["0×03_DETECTAR","Detectar","O motor procura partes da sua biblioteca que possam conversar com o que está vivo agora."],
  6:["0×06_INTEGRAR","Integrar","Os fios encontrados entram no texto atual sem apagar aquilo que já foi formado."],
  9:["0×09_EXPANDIR","Expandir","A ideia continua crescendo a partir do próprio contexto que acabou de nascer."],
  7:["0×07_SELAR","Selar","O estado atual vira um novo documento e pode voltar para a biblioteca."]
};

const S = {
  identity:'Dual', phase:3, registry:[], relations:[], selectedRelations:[],
  sourceText:'', currentText:'', history:[], fractalIndex:0,
  voiceAutoOn: (()=>{try{return localStorage.getItem('domr:voice:auto')==='1'}catch{return false}})(),
  conversation:[], sessions:[],
  sonoroPlaying:false, lastSonoroText:'',
  scannerRunning:false, currentView:'fase'
};

function readIdentity(){
  try{const v=localStorage.getItem('di_userName');if(v&&v.trim()&&v!=='undefined'&&v!=='null')return v.trim();}catch{}
  try{const v=localStorage.getItem('userName');if(v&&v.trim())return v.trim();}catch{}
  return 'Dual';
}
function applyIdentity(){
  S.identity = readIdentity();
  $('identityLabel').textContent = S.identity;
  const input = $('intentInput');
  if (!input.value.trim()) input.value = 'Oi, ' + S.identity + ', o que está vivo agora?';
}
function safeIdentityRx(){
  if (S.identity.length < 2) return null;
  return new RegExp(escapeRegExp(S.identity), 'i');
}

const VALID_DOC_EXTS = ['md','markdown','txt','text','json','html','htm','csv'];
function isPillDoc(d){
  if (!d || typeof d !== 'object') return false;
  if (d.dataUrl) return false;
  if (!d.name && !d.title) return false;
  if (!d.content || typeof d.content !== 'string') return false;
  if (d.content.length < 20) return false;
  if (/^data:/i.test(d.content.trim())) return false;
  if (/^[A-Za-z0-9+/=]{200,}$/.test(d.content)) return false;
  const ext = String(d.ext || '').toLowerCase().replace(/^\./,'');
  const name = String(d.name || d.title || '').toLowerCase();
  if (ext && VALID_DOC_EXTS.includes(ext)) return true;
  if (VALID_DOC_EXTS.some(e=>name.endsWith('.'+e))) return true;
  return false;
}
function classifyKind(title, content, type, meta){
  const s = (title+' '+content+' '+type+' '+JSON.stringify(meta||{})).toLowerCase();
  if(/dose|infodose/.test(s)) return 'dose';
  if(/pill|pílula|pills/.test(s)) return 'pill';
  if(/note|nota|notes|notas/.test(s)) return 'note';
  if(/\.md\b|markdown/.test(s)) return 'markdown';
  if(/\.html?\b|html/.test(s)) return 'html';
  return 'document';
}
function normalizeDocument(raw, meta){
  meta = meta || {};
  if (raw == null) return null;
  let content = '', title = meta.title || meta.name || 'Documento', type = meta.type || 'text';
  let id = meta.id || ('doc_'+Math.random().toString(36).slice(2,10));
  let updatedAt = meta.updatedAt || meta.createdAt || Date.now();
  if (typeof raw === 'string') content = raw;
  else if (typeof raw === 'object'){
    title = raw.title || raw.name || raw.filename || title;
    type = raw.type || raw.mime || type;
    id = raw.id || raw.key || id;
    updatedAt = raw.updatedAt || raw.modifiedAt || raw.createdAt || updatedAt;
    content = raw.content ?? raw.text ?? raw.body ?? raw.markdown ?? raw.html ?? '';
    if (typeof content !== 'string'){ try{ content = JSON.stringify(content); }catch{ content=''; } }
  }
  content = String(content||'').slice(0, 18000);
  if (!content.trim()) return null;
  if (/^data:/i.test(content.trim())) return null;
  if (/apikey|api_key|token|password|secret|bearer/i.test(title+' '+content.slice(0,200))) return null;
  return {id:String(id), title:String(title).slice(0,120), type:String(type), content, text:stripMarkup(content),
    source: meta.source || 'local', vault: meta.vault || '',
    tags: Array.isArray(meta.tags) ? meta.tags : [], updatedAt,
    kind: classifyKind(title, content, type, meta)};
}

async function scanMXDB(){
  return new Promise(res=>{
    if (!('indexedDB' in window)) return res([]);
    let req; try{ req = indexedDB.open('MXDB', 1); }catch{ return res([]); }
    req.onerror = ()=>res([]);
    req.onsuccess = ()=>{
      const db = req.result;
      if (!db.objectStoreNames.contains('docs')){ db.close(); return res([]); }
      const out = [];
      try{
        const tx = db.transaction('docs','readonly');
        const cr = tx.objectStore('docs').openCursor();
        cr.onsuccess = e=>{
          const cur = e.target.result;
          if (!cur){ db.close(); return res(out); }
          const v = cur.value;
          if (v && isPillDoc(v)) out.push(normalizeDocument(v, {source:'NebulaPills', vault:'mxdb'}));
          cur.continue();
        };
        cr.onerror = ()=>{ try{db.close()}catch{}; res(out); };
      }catch{ try{db.close()}catch{}; res(out); }
    };
  });
}
async function scanNebulaStorage(){
  return new Promise(res=>{
    if (!('indexedDB' in window)) return res([]);
    let req; try{ req = indexedDB.open('NebulaStorage', 1); }catch{ return res([]); }
    req.onerror = ()=>res([]);
    req.onsuccess = ()=>{
      const db = req.result;
      if (!db.objectStoreNames.contains('files')){ db.close(); return res([]); }
      const out = [];
      try{
        const tx = db.transaction('files','readonly');
        const cr = tx.objectStore('files').openCursor();
        cr.onsuccess = e=>{
          const cur = e.target.result;
          if (!cur){ db.close(); return res(out); }
          const v = cur.value;
          if (v && isPillDoc(v)) out.push(normalizeDocument(v, {source:'NebulaStorage', vault:'nebula'}));
          cur.continue();
        };
        cr.onerror = ()=>{ try{db.close()}catch{}; res(out); };
      }catch{ try{db.close()}catch{}; res(out); }
    };
  });
}
async function scanLibrary(){
  if (S.scannerRunning) return S.registry;
  S.scannerRunning = true;
  const docs = [], seen = new Set();
  const add = d => {
    if (!d) return;
    const key = (d.title||'') + '|' + (d.content||'').slice(0,60);
    if (seen.has(key)) return;
    seen.add(key); docs.push(d);
  };
  const NP = SYS.nebulaParent ? window.parent.NebulaPills : (SYS.nebula ? window.NebulaPills : null);
  if (NP && Array.isArray(NP.docs)){
    NP.docs.forEach(d=>{
      if (!isPillDoc(d)) return;
      add(normalizeDocument({id:d.id, name:d.name, content:d.content, ext:d.ext, updatedAt:d.addedAt},
        {source: SYS.nebulaParent ? 'KOBMXP' : 'NebulaPills', vault:'nebula'}));
    });
  }
  try{ (await scanMXDB()).forEach(add); }catch{}
  try{ (await scanNebulaStorage()).forEach(add); }catch{}
  const KNOWN_KEYS = ['dom_r_infodose_v2','dom_r_pills','codex:pills','bible:pills','kobllux:pills','kobllux:docs','nebula.docs.v1'];
  for (const key of KNOWN_KEYS){
    let raw; try{ raw = localStorage.getItem(key); }catch{ continue; }
    if (!raw || raw.length < 30) continue;
    try{
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)){
        parsed.forEach((item,i)=>{
          if (!isPillDoc(item)) return;
          add(normalizeDocument(item, {source:'localStorage', vault:key, id:'ls_'+key+'_'+i, title:item.title||item.name}));
        });
      } else if (parsed && typeof parsed === 'object'){
        if (isPillDoc(parsed)) add(normalizeDocument(parsed, {source:'localStorage', vault:key, id:'ls_'+key}));
      }
    }catch{
      if (raw.length > 100 && raw.length < 300000 && /[.!?\n]/.test(raw)){
        add(normalizeDocument(raw, {id:'ls_'+key, title:key, source:'localStorage', vault:key}));
      }
    }
  }
  S.registry = docs.filter(Boolean).sort((a,b)=>Number(b.updatedAt||0)-Number(a.updatedAt||0)).slice(0, 500);
  S.scannerRunning = false;
  renderLibrary(); renderLibraryFull(); updateLibCounters();
  return S.registry;
}
function updateLibCounters(){
  const n = S.registry.length;
  $('libCount').textContent = n;
  $('libBadge').textContent = n;
  $('libFullCount').textContent = n;
  $('libSub').textContent = n + ' documentos';
  $('libFullSub').textContent = n + ' documentos';
}

function tokenize(v){
  return [...new Set(String(v||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').match(/[a-z0-9à-ÿ]{3,}/gi) || [])];
}
function meaningfulTokens(v){
  const stop = new Set(['para','como','esse','essa','isso','esta','este','uma','umas','uns','dos','das','que','com','sem','por','sobre','entre','mais','menos','onde','quando','qual','quem','porque','aqui','agora','muito','muita','meu','minha','seu','sua','oi','dual','the','and','for','with']);
  return tokenize(v).filter(t=>!stop.has(t));
}
function splitSentences(t){
  return String(t||'').replace(/\r/g,'').split(/(?<=[.!?])\s+|\n{2,}/).map(s=>s.trim()).filter(s=>s.length>=25);
}
function correlate(input){
  const tokens = meaningfulTokens(input);
  if (!tokens.length || !S.registry.length) return [];
  const now = Date.now();
  const idRx = safeIdentityRx();
  return S.registry.map(doc=>{
    const src = doc.title + ' ' + doc.text + ' ' + doc.tags.join(' ');
    const set = new Set(meaningfulTokens(src));
    let overlap = 0; tokens.forEach(t=>{ if(set.has(t)) overlap++; });
    const titleTokens = meaningfulTokens(doc.title);
    let titleHit = 0; tokens.forEach(t=>{ if(titleTokens.includes(t)) titleHit++; });
    const identityHit = idRx && idRx.test(src) ? 1 : 0;
    const dualHit = /\bdual\b/i.test(src) ? 1 : 0;
    const recency = Math.max(0, 1 - ((now - Number(doc.updatedAt||now)) / (1000*60*60*24*30)));
    const score = overlap*3 + titleHit*5 + identityHit*4 + dualHit*1.5 + recency*1.5;
    return {doc, score, overlap, identityHit, dualHit};
  }).filter(r=>r.score > 0).sort((a,b)=>b.score-a.score).slice(0, 20);
}
function makeSnippet(doc, input){
  const sents = splitSentences(doc.text);
  const tokens = meaningfulTokens(input);
  let best = sents[0] || doc.text.slice(0, 430);
  let bs = -1;
  sents.forEach(s=>{
    const set = new Set(meaningfulTokens(s));
    let sc = 0; tokens.forEach(t=>{ if(set.has(t)) sc++; });
    if (sc > bs){ bs = sc; best = s; }
  });
  return best.slice(0, 430);
}

function textToHTML(v){
  const t = String(v||'').trim();
  if (!t) return '';
  return t.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
    .split(/\n{2,}/).map(b=>'<p>'+b.replace(/\n/g,'<br>')+'</p>').join('');
}
function readBuilder(){
  const tb = $('textBuilder');
  S.currentText = stripMarkup(tb.innerText || tb.textContent || '').trim();
  return S.currentText;
}
function writeBuilder(t){
  S.currentText = String(t||'').trim();
  $('textBuilder').innerHTML = textToHTML(S.currentText);
  $('builderState').textContent = S.currentText ? 'texto vivo' : 'aguardando';
}
function appendPhase(phase, arch, text, animate){
  const color = ARCH_COLORS[arch] || '#b7ff52';
  const tb = $('textBuilder');
  const marker = document.createElement('div');
  marker.className = 'phase-mark';
  marker.textContent = '0'+phase+' · '+arch;
  marker.style.setProperty('--arch-color', color);
  tb.appendChild(marker);
  const p = document.createElement('p');
  p.style.setProperty('--arch-color', color);
  tb.appendChild(p);
  if (!animate){ p.textContent = text; tb.scrollTop = tb.scrollHeight; return; }
  p.textContent = '';
  const cursor = document.createElement('span');
  cursor.className = 'cursor';
  cursor.style.background = color;
  p.appendChild(cursor);
  const speed = text.length > 700 ? 2 : 8;
  let i = 0;
  (function tick(){
    if (i >= text.length){ cursor.remove(); tb.scrollTop = tb.scrollHeight; return; }
    cursor.before(document.createTextNode(text[i])); i++;
    tb.scrollTop = tb.scrollHeight;
    setTimeout(tick, speed);
  })();
}

function pushConv(phase, arch, text){
  S.conversation.push({
    id: 'conv_'+Date.now()+'_'+Math.random().toString(36).slice(2,7),
    phase, arch, text: String(text||'').trim(),
    timestamp: Date.now()
  });
  renderConversation();
  updateConvCounters();
  Player.syncFromConversation();
}
function renderConversation(){
  const wrap = $('convWrap');
  if (!S.conversation.length){
    wrap.innerHTML = `<div class="conv-empty"><span class="emoji">💬</span>O livro ainda está em silêncio.<br>Rode uma fase em <b>Fase</b> para começar a conversa.</div>`;
    return;
  }
  wrap.innerHTML = '';
  S.conversation.forEach((msg, i)=>{
    const el = document.createElement('div');
    el.className = 'conv-msg';
    const color = ARCH_COLORS[msg.arch] || '#b7ff52';
    const time = new Date(msg.timestamp).toLocaleTimeString('pt-BR', {hour:'2-digit',minute:'2-digit'});
    const phaseLabel = PHASE_LABELS[msg.phase] ? PHASE_LABELS[msg.phase][1] : 'Fase ' + msg.phase;
    el.innerHTML = `
      <div class="conv-avatar" style="--arch-color:${color}">${msg.arch.charAt(0)}</div>
      <div class="conv-body">
        <div class="conv-meta">
          <span class="conv-arch" style="color:${color}">${escapeHTML(msg.arch)}</span>
          <span class="conv-phase">fase ${msg.phase} · ${escapeHTML(phaseLabel)}</span>
          <span class="conv-time">${time}</span>
        </div>
        <div class="conv-text">${escapeHTML(msg.text)}</div>
        <div class="conv-actions">
          <button data-conv-copy="${i}" title="Copiar">⧉</button>
          <button data-conv-speak="${i}" title="Ouvir">🔊</button>
        </div>
      </div>
    `;
    wrap.appendChild(el);
  });
  wrap.querySelectorAll('[data-conv-copy]').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const i = parseInt(btn.dataset.convCopy, 10);
      const msg = S.conversation[i]; if (!msg) return;
      navigator.clipboard.writeText(msg.text).then(()=>toast('Copiado ✓')).catch(()=>toast('Erro'));
    });
  });
  wrap.querySelectorAll('[data-conv-speak]').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const i = parseInt(btn.dataset.convSpeak, 10);
      const msg = S.conversation[i]; if (!msg) return;
      document.body.dataset.arch = msg.arch;
      document.documentElement.style.setProperty('--arch-color', ARCH_COLORS[msg.arch]||'#b7ff52');
      if (window.KOBBus && window.KOBBus.say) window.KOBBus.say(msg.text);
    });
  });
}
function updateConvCounters(){
  const n = S.conversation.length;
  $('convBadge').textContent = n;
  $('convCount').textContent = n;
  $('convSub').textContent = n ? n + ' mensagens' : 'O livro ainda está em silêncio.';
}

function renderLibrary(){
  const slider = $('librarySlider');
  slider.innerHTML = '';
  if (!S.registry.length){
    slider.innerHTML = '<div class="empty"><span class="emoji">📚</span><strong>Biblioteca vazia</strong>Nenhum documento encontrado.</div>';
    return;
  }
  const MAX = 30;
  S.registry.slice(0, MAX).forEach(doc=>{
    const card = document.createElement('article');
    card.className = 'card-lib';
    if (S.selectedRelations.some(r=>r.doc.id===doc.id)) card.classList.add('is-selected');
    const preview = (doc.text || '').slice(0, 140).replace(/\s+/g,' ').trim();
    card.innerHTML = `
      <div class="card-lib-kind">${escapeHTML(doc.kind)} · ${escapeHTML(doc.source)}</div>
      <div class="card-lib-title">${escapeHTML(doc.title)}</div>
      <div class="card-lib-prev">${escapeHTML(preview || '(sem texto)')}</div>
    `;
    card.addEventListener('click', ()=>toggleDocSelection(doc));
    slider.appendChild(card);
  });
}
function renderLibraryFull(){
  const wrap = $('libraryFull');
  wrap.innerHTML = '';
  if (!S.registry.length){
    wrap.innerHTML = '<div class="empty" style="grid-column:1/-1"><span class="emoji">📚</span><strong>Biblioteca vazia</strong></div>';
    return;
  }
  S.registry.forEach(doc=>{
    const card = document.createElement('article');
    card.className = 'card-lib';
    if (S.selectedRelations.some(r=>r.doc.id===doc.id)) card.classList.add('is-selected');
    const preview = (doc.text || '').slice(0, 100).replace(/\s+/g,' ').trim();
    card.innerHTML = `
      <div class="card-lib-kind">${escapeHTML(doc.kind)}</div>
      <div class="card-lib-title">${escapeHTML(doc.title)}</div>
      <div class="card-lib-prev">${escapeHTML(preview || '(sem texto)')}</div>
    `;
    card.addEventListener('click', ()=>toggleDocSelection(doc));
    wrap.appendChild(card);
  });
}
function toggleDocSelection(doc){
  const idx = S.selectedRelations.findIndex(r=>r.doc.id===doc.id);
  if (idx >= 0){ S.selectedRelations.splice(idx,1); toast('Removido dos fios'); }
  else { S.selectedRelations.push({doc, score: 0}); toast('Adicionado aos fios'); }
  renderLibrary(); renderLibraryFull(); renderFios();
}
function renderFios(){
  const slider = $('fioSlider');
  const sub = $('fioSub');
  slider.innerHTML = '';
  $('fioCount').textContent = S.relations.length;
  sub.textContent = S.relations.length
    ? S.relations.length + ' correlações · ' + S.selectedRelations.length + ' selecionados'
    : 'aguardando intenção';
  if (!S.relations.length){
    slider.innerHTML = '<div class="empty"><span class="emoji">🧵</span><strong>Nenhum fio ainda</strong>Escreva uma intenção e clique <b>Enviar</b>.</div>';
    return;
  }
  S.relations.forEach(rel=>{
    const card = document.createElement('article');
    card.className = 'card-fio';
    if (S.selectedRelations.some(r=>r.doc.id===rel.doc.id)) card.classList.add('is-selected');
    const snippet = makeSnippet(rel.doc, S.sourceText || S.currentText);
    card.innerHTML = `
      <div class="card-fio-kicker"><span>${escapeHTML(rel.doc.kind)}</span><span>${Math.round(rel.score)}</span></div>
      <div class="card-fio-title">${escapeHTML(rel.doc.title)}</div>
      <div class="card-fio-prev">${escapeHTML(snippet)}</div>
    `;
    card.addEventListener('click', ()=>toggleDocSelection(rel.doc));
    slider.appendChild(card);
  });
}

function updatePhaseUI(currentArch){
  const cfg = PHASE_LABELS[S.phase];
  const arch = currentArch || (PHASE_ARCH_POOL[S.phase]||['KOBLLUX'])[0];
  $('phaseCodeFull').textContent = cfg[0] + ' · ' + arch;
  $('phaseCode').textContent = cfg[0].split('_')[0];
  $('heroIntro').textContent = cfg[2];
  $('pulseSub').textContent = S.currentText ? S.currentText.split('\n')[0].slice(0,60) : 'O que está vivo agora?';
  $$('.stage-pill').forEach(b=>b.classList.toggle('active', b.dataset.stage===String(S.phase)));
  $$('.trace-node').forEach(n=>n.classList.toggle('active', n.dataset.trace===String(S.phase)));
  const color = ARCH_COLORS[arch] || '#b7ff52';
  if (S.voiceAutoOn) document.body.dataset.arch = arch;
  document.documentElement.style.setProperty('--arch-color', color);
  document.documentElement.style.setProperty('--phase-accent', color);
  $('brandMark').classList.toggle('playing', S.phase>0 && S.phase!==7);
  $('orbe').classList.toggle('busy', S.phase>0);
  updateHeaderAction('fase '+S.phase+' · '+arch+' · '+cfg[1].toUpperCase());
}
function updateHeaderAction(text){
  const el = $('hd2Action');
  el.textContent = text || 'aguardando';
  el.classList.remove('mq');
  if (text && text.length > 24){
    el.style.setProperty('--mq-dur', Math.max(6,Math.min(22,text.length*0.22))+'s');
    void el.offsetWidth;
    el.classList.add('mq');
  }
}

function detectar(){
  const input = $('intentInput').value.trim();
  if (!input){ toast('Escreva uma intenção'); $('intentInput').focus(); return; }
  const arch = pickArch(3);
  S.sourceText = input;
  S.relations = correlate(input);
  S.selectedRelations = S.relations.slice(0, 3);
  S.phase = 3;
  updatePhaseUI(arch);
  renderFios(); renderLibrary();
  const opening = buildOpening(input, S.relations[0]);
  if (!S.currentText) writeBuilder('');
  appendPhase(3, arch, opening, true);
  pushConv(3, arch, opening);
  $('builderState').textContent = S.relations.length + ' fios detectados';
  S.history.push({phase:3, text:opening, at:Date.now(), arch});
  toast(S.relations.length + ' conexões · ' + arch);
  speakPhase(arch, opening);
}
function buildOpening(input, rel){
  const clean = input.replace(/^oi,\s*/i,'').trim();
  const base = clean || 'o que está vivo agora';
  if (!rel) return 'A pergunta está aberta: ' + base + '.\n\nO primeiro movimento é observar o que já existe antes de decidir para onde essa ideia quer ir.';
  const snip = makeSnippet(rel.doc, input);
  return 'Oi, ' + S.identity + '. ' + base + '.\n\nO primeiro fio encontrado aparece em ' + rel.doc.title + '. ' + snip;
}
function integrar(){
  const cur = readBuilder();
  if (!cur){ detectar(); return; }
  const rels = S.selectedRelations.length ? S.selectedRelations : S.relations.slice(0,3);
  if (!rels.length){ detectar(); return; }
  const arch = pickArch(6);
  const pieces = rels.map(r=>makeSnippet(r.doc, S.sourceText||cur)).filter(Boolean);
  if (!pieces.length) return;
  const unique = [...new Set(pieces)];
  const addition = unique.slice(0,3).map(p=>'A partir desse fio, aparece outra camada: ' + p).join('\n\n');
  appendPhase(6, arch, addition, true);
  pushConv(6, arch, addition);
  S.phase = 6;
  S.history.push({phase:6, text:addition, at:Date.now(), arch});
  updatePhaseUI(arch);
  $('builderState').textContent = 'relações integradas';
  toast(unique.length + ' fios · ' + arch);
  speakPhase(arch, addition);
}
function expandir(){
  const cur = readBuilder();
  if (!cur){ detectar(); return; }
  const arch = pickArch(9);
  const rels = S.relations.length ? S.relations : correlate($('intentInput').value);
  const nextRel = rels[S.fractalIndex % Math.max(rels.length,1)];
  S.fractalIndex++;
  let expansion = '';
  if (nextRel){
    expansion = 'O fio continua em outra direção. ' + makeSnippet(nextRel.doc, cur) + ' ' + buildBridge(cur);
  } else {
    expansion = buildLocalExpansion(cur);
  }
  appendPhase(9, arch, expansion, true);
  pushConv(9, arch, expansion);
  S.phase = 9;
  S.history.push({phase:9, text:expansion, at:Date.now(), arch});
  updatePhaseUI(arch);
  $('builderState').textContent = 'ideia expandida';
  toast('Nova camada · ' + arch);
  speakPhase(arch, expansion);
}
function buildBridge(text){
  const last = text.split(/[.!?]/).map(s=>s.trim()).filter(Boolean).pop() || '';
  if (/agora|hoje/i.test(last)) return 'Isso desloca a pergunta para o presente.';
  if (/ideia|pensamento|conceito/i.test(last)) return 'A ideia começa a revelar uma segunda possibilidade.';
  return 'A conexão não encerra o caminho; abre uma próxima pergunta.';
}
function buildLocalExpansion(text){
  const tokens = meaningfulTokens(text);
  const focus = tokens.slice(-5).join(', ');
  return 'O que estava separado começa a formar um campo comum. Os elementos ' + focus + ' passam a funcionar como pontos de passagem. A próxima camada não precisa substituir a anterior; pode nascer dela.';
}
async function selar(){
  const cur = readBuilder();
  if (!cur){ toast('Ainda não existe texto para selar'); return; }
  const arch = pickArch(7);
  const title = buildSealTitle();
  const record = {
    id: 'domr_'+Date.now()+'_'+Math.random().toString(36).slice(2,8),
    title, name: title+'.md', type: 'markdown', mime: 'text/markdown',
    content: cur, text: cur, source: 'dom-r-fractal', vault: 'dom-r',
    createdAt: Date.now(), updatedAt: Date.now(),
    tags: ['dom-r','fractal','3697', S.identity], phase: 7,
    relations: S.relations.map(r=>({id:r.doc.id, title:r.doc.title, score: r.score}))
  };
  try{ localStorage.setItem('dom_r_infodose_v2', JSON.stringify(record)); }catch{}
  S.sessions.unshift({
    id: record.id, title: record.title, phase: S.phase,
    conversation: JSON.parse(JSON.stringify(S.conversation)),
    text: cur, timestamp: Date.now(), arch
  });
  S.sessions = S.sessions.slice(0, 30);
  persistSessions(); renderSessions();
  const NP = SYS.nebulaParent ? window.parent.NebulaPills : (SYS.nebula ? window.NebulaPills : null);
  let saved = false;
  if (NP && typeof NP.pushDerivedDoc === 'function'){
    try{ NP.pushDerivedDoc(record.name, record.content, {source:record.source, arch}); saved = true; }
    catch(e){ console.warn('[Dom R] NebulaPills', e); }
  }
  if (!saved) saved = await saveToNebulaStorage(record);
  ['nebula:document-created','nebula:storage-updated','nebula:library-refresh','library:refresh'].forEach(ev=>{
    try{ window.dispatchEvent(new CustomEvent(ev, {detail: record})); }catch{}
  });
  const sealMsg = 'Fractal selado. O livro retorna à estante como Infodose.\n\n— ' + title;
  appendPhase(7, arch, sealMsg, true);
  pushConv(7, arch, sealMsg);
  S.phase = 7;
  S.history.push({phase:7, text:cur, at:Date.now(), arch});
  updatePhaseUI(arch);
  $('builderState').textContent = saved ? 'selado na biblioteca' : 'selado localmente';
  downloadText(cur, title + '.md');
  toast(saved ? '💊 Selado · ' + arch : '💾 Local · ' + arch);
  speakPhase(arch, sealMsg);
  setTimeout(scanLibrary, 500);
  return record;
}
function buildSealTitle(){
  const first = readBuilder().split('\n').map(l=>l.trim()).find(Boolean);
  return 'Fractal · ' + ((first||'Novo Fractal').replace(/[^a-zA-ZÀ-ÿ0-9 ]/g,'').slice(0, 55));
}
function saveToNebulaStorage(record){
  return new Promise(res=>{
    if (!('indexedDB' in window)) return res(false);
    let req; try{ req = indexedDB.open('NebulaStorage', 1); }catch{ return res(false); }
    req.onerror = ()=>res(false);
    req.onsuccess = ()=>{
      const db = req.result;
      if (!db.objectStoreNames.contains('files')){ db.close(); return res(false); }
      try{
        const tx = db.transaction('files','readwrite');
        const put = tx.objectStore('files').put(record);
        put.onsuccess = ()=>{ try{db.close()}catch{}; res(true); };
        put.onerror = ()=>{ try{db.close()}catch{}; res(false); };
      }catch{ try{db.close()}catch{}; res(false); }
    };
  });
}
function fractal(){
  const modes = [3, 6, 9, 7];
  const phase = modes[S.fractalIndex % modes.length];
  S.fractalIndex++;
  if (phase===3) detectar();
  else if (phase===6) integrar();
  else if (phase===9) expandir();
  else if (phase===7) selar();
}
function persistSessions(){
  try{ localStorage.setItem('domr:sessions', JSON.stringify(S.sessions.slice(0,30))); }catch{}
}
function loadSessions(){
  try{ const v = JSON.parse(localStorage.getItem('domr:sessions') || '[]'); if (Array.isArray(v)) S.sessions = v; }catch{}
}
function renderSessions(){
  const wrap = $('sessWrap');
  const n = S.sessions.length;
  $('sessBadge').textContent = n;
  $('sessCount').textContent = n;
  if (!n){
    wrap.innerHTML = '<div class="empty"><span class="emoji">🎴</span><strong>Nenhuma sessão ainda</strong>Quando você clicar <b>Selar</b>, o snapshot aparece aqui.</div>';
    return;
  }
  wrap.innerHTML = '';
  S.sessions.forEach(sess=>{
    const el = document.createElement('div');
    el.className = 'session-card';
    const time = new Date(sess.timestamp).toLocaleString('pt-BR',{day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit'});
    el.innerHTML = `
      <div class="session-icon">🎴</div>
      <div class="session-info">
        <div class="session-title">${escapeHTML(sess.title)}</div>
        <div class="session-meta">
          <span>fase ${sess.phase || 7}</span>
          <span>${(sess.conversation||[]).length} msgs</span>
          <span>${sess.arch||''}</span>
          <span>${time}</span>
        </div>
        <div class="session-actions">
          <button class="pri" data-sess-load="${sess.id}">↻ Carregar</button>
          <button data-sess-copy="${sess.id}">⧉ Copiar</button>
          <button data-sess-del="${sess.id}">🗑</button>
        </div>
      </div>
    `;
    wrap.appendChild(el);
  });
  wrap.querySelectorAll('[data-sess-load]').forEach(b=>{
    b.addEventListener('click', e=>{
      e.stopPropagation();
      const sess = S.sessions.find(x=>x.id===b.dataset.sessLoad);
      if (!sess) return;
      S.conversation = JSON.parse(JSON.stringify(sess.conversation||[]));
      writeBuilder(sess.text||'');
      renderConversation(); updateConvCounters();
      Player.syncFromConversation();
      switchView('conversa');
      toast('Sessão carregada');
    });
  });
  wrap.querySelectorAll('[data-sess-copy]').forEach(b=>{
    b.addEventListener('click', e=>{
      e.stopPropagation();
      const sess = S.sessions.find(x=>x.id===b.dataset.sessCopy);
      if (sess){ navigator.clipboard.writeText(sess.text||'').then(()=>toast('Copiado ✓')).catch(()=>toast('Erro')); }
    });
  });
  wrap.querySelectorAll('[data-sess-del]').forEach(b=>{
    b.addEventListener('click', e=>{
      e.stopPropagation();
      S.sessions = S.sessions.filter(x=>x.id!==b.dataset.sessDel);
      persistSessions(); renderSessions();
      toast('Sessão removida');
    });
  });
}

function speakPhase(arch, text){
  if (!S.voiceAutoOn) return;
  if (arch){
    document.body.dataset.arch = arch;
    document.documentElement.style.setProperty('--arch-color', ARCH_COLORS[arch] || '#b7ff52');
  }
  if (window.KOBBus && window.KOBBus.say) window.KOBBus.say(text);
}

let toneLoading = null;
function loadTone(){
  if (typeof Tone !== 'undefined') return Promise.resolve(Tone);
  if (toneLoading) return toneLoading;
  toneLoading = new Promise((res,rej)=>{
    const s = document.createElement('script');
    s.src = 'https://cdnjs.cloudflare.com/ajax/libs/tone/14.8.49/Tone.min.js';
    s.onload = ()=>setTimeout(()=>typeof Tone !== 'undefined' ? res(Tone) : rej(new Error('Tone')), 50);
    s.onerror = ()=>{ toneLoading = null; rej(new Error('CDN')); };
    document.head.appendChild(s);
  });
  return toneLoading;
}
const PHASE_SCALES = {
  3: ['A3','B3','C4','D4','E4','F4','G#4','A4','B4','C5','D5','E5','F5','G#5','A5'],
  6: ['C4','D4','E4','G4','A4','C5','D5','E5','G5','A5','C6','D6','E6','G6','A6'],
  9: ['F3','G3','A3','B3','C4','D4','E4','F4','G4','A4','B4','C5','D5','E5','F5'],
  7: ['C4','D4','E4','F#4','G#4','A#4','C5','D5','E5','F#5','G#5','A#5','C6','D6','E6']
};
let sonoroSynth = null, sonoroReverb = null, sonoroPart = null;

async function playSonoro(){
  const text = readBuilder();
  if (!text){ toast('Sem texto'); return; }
  if (S.sonoroPlaying){ stopSonoro(); return; }
  if (SYS.sonoroParent){
    try{
      if (window.parent.KOBLoadTone) await window.parent.KOBLoadTone(); else await loadTone().catch(()=>{});
      S.lastSonoroText = text.slice(0, 3000);
      window.parent.KOBSonoro.playText(S.lastSonoroText, 'Dom R · fase ' + S.phase);
      S.sonoroPlaying = true; $('sonoroBtn').classList.add('on');
      const poll = setInterval(()=>{
        try{ if(!window.parent.KOBSonoro.isPlaying || !window.parent.KOBSonoro.isPlaying()){ clearInterval(poll); S.sonoroPlaying=false; $('sonoroBtn').classList.remove('on'); } }catch{ clearInterval(poll); S.sonoroPlaying=false; $('sonoroBtn').classList.remove('on'); }
      }, 500);
      toast('♫ → KOBSonoro (KOBMXP)');
      return;
    }catch(e){ console.warn(e); }
  }
  if (SYS.sonoro){
    try{
      S.lastSonoroText = text.slice(0, 3000);
      window.KOBSonoro.playText(S.lastSonoroText, 'Dom R · fase ' + S.phase);
      S.sonoroPlaying = true; $('sonoroBtn').classList.add('on');
      toast('♫ → KOBSonoro local');
      return;
    }catch(e){ console.warn(e); }
  }
  try{ await loadTone(); await Tone.start(); }catch{ toast('Tone indisponível'); return; }
  if (!sonoroSynth){
    sonoroReverb = new Tone.Reverb({decay:3, wet:.4}).toDestination();
    sonoroSynth = new Tone.PolySynth(Tone.Synth,{oscillator:{type:'triangle'},envelope:{attack:.02,decay:.3,sustain:.2,release:1.2}}).connect(sonoroReverb);
    sonoroSynth.volume.value = -8;
  }
  const scale = PHASE_SCALES[S.phase] || PHASE_SCALES[3];
  const bpm = parseInt($('bpmInput')?.value, 10) || 90;
  const wet = (parseInt($('revInput')?.value, 10) || 40) / 100;
  if (sonoroReverb) sonoroReverb.wet.value = wet;
  Tone.Transport.bpm.value = bpm;
  Tone.Transport.cancel(0);
  const alpha = 'abcdefghijklmnopqrstuvwxyz';
  const events = []; let step = 0;
  for (const ch of text.toLowerCase()){
    const idx = alpha.indexOf(ch);
    if (idx >= 0){ events.push({time: step*0.15, note: scale[idx%scale.length], duration: '16n'}); step++; }
    else if (ch===' '||ch==='\n') step += .5;
    else if ('.!?'.includes(ch)) step += 1;
  }
  if (!events.length){ toast('Sem notas'); return; }
  sonoroPart = new Tone.Part((time,ev)=>{ sonoroSynth.triggerAttackRelease(ev.note, ev.duration, time); }, events).start(0);
  Tone.Transport.start();
  S.sonoroPlaying = true; $('sonoroBtn').classList.add('on');
  S.lastSonoroText = text.slice(0, 3000);
  const end = Math.max(...events.map(e=>e.time)) + 3;
  setTimeout(()=>{ if (S.sonoroPlaying) stopSonoro(); }, end*1000);
  toast('♫ Tone.js · fase ' + S.phase);
}
function stopSonoro(){
  if (SYS.sonoroParent && S.lastSonoroText){ try{ window.parent.KOBSonoro.playText(S.lastSonoroText); }catch{} }
  if (SYS.sonoro && S.lastSonoroText){ try{ window.KOBSonoro.playText(S.lastSonoroText); }catch{} }
  if (sonoroPart){ try{ sonoroPart.dispose(); }catch{} sonoroPart = null; }
  try{ if (typeof Tone !== 'undefined'){ Tone.Transport.stop(); Tone.Transport.cancel(0); } }catch{}
  S.sonoroPlaying = false; S.lastSonoroText = '';
  $('sonoroBtn').classList.remove('on');
}

// ═══════════════════════════════════════════════════════════
// PLAYER (com espelho no header)
// ═══════════════════════════════════════════════════════════
const Player = {
  phases: [], index: 0, playing: false, gen: 0, scrubbing: false,
  syncFromConversation(){
    this.phases = S.conversation.map(c=>({phase: c.phase, arch: c.arch, text: c.text}));
    if (this.phases.length === 0){ this.index = 0; }
    this.paintUI();
  },
  play(){
    if (!this.phases.length){ toast('Rode uma fase primeiro'); return; }
    if (this.playing) this.stop();
    else this.start(0);
  },
  start(i){
    this.stop(true);
    this.index = Math.max(0, Math.min(i, this.phases.length-1));
    this.playing = true;
    this.paintUI();
    this.playCurrent();
  },
  playCurrent(){
    const gen = ++this.gen;
    const p = this.phases[this.index];
    if (!p){ this.stop(); return; }
    document.body.dataset.arch = p.arch;
    document.documentElement.style.setProperty('--arch-color', ARCH_COLORS[p.arch]||'#b7ff52');
    this.paintUI();
    const self = this;
    if (window.KOBBus && window.KOBBus.say){
      window.KOBBus.say(p.text, {
        onend: ()=>{
          if (gen !== self.gen) return;
          self.index++;
          if (self.index >= self.phases.length){ self.stop(); return; }
          setTimeout(()=>self.playCurrent(), 120);
        }
      });
    } else { this.stop(); }
  },
  next(){ if (!this.phases.length) return; this.start(this.index+1); },
  prev(){ if (!this.phases.length) return; this.start(this.index-1); },
  stop(silent){
    this.gen++;
    this.playing = false;
    if ('speechSynthesis' in window) speechSynthesis.cancel();
    this.paintUI();
  },
  jumpTo(pct){
    if (!this.phases.length) return;
    const i = Math.round((pct/100) * (this.phases.length-1));
    this.start(Math.max(0, Math.min(i, this.phases.length-1)));
  },
  paintUI(){
    const total = this.phases.length;
    const cur = total ? Math.min(this.index+1, total) : 0;
    const p = this.phases[this.index];
    const pct = total > 1 ? (this.index / (total - 1)) * 100 : (total === 1 ? 100 : 0);
    $('progressFill').style.width = pct + '%';
    const hdrFill = $('hdrProgressFill');
    if (hdrFill) hdrFill.style.width = pct + '%';
    const scrub = $('progressScrub');
    if (scrub && !this.scrubbing) scrub.value = String(pct);
    if (scrub) scrub.disabled = !total;
    const t = $('playerTitle'), s = $('playerSub'), orb = $('playerOrb'), btn = $('btnPlayMain');
    orb.classList.toggle('playing', this.playing);
    btn.classList.toggle('playing', this.playing);
    btn.textContent = this.playing ? '⏸' : '▶';
    if (!p){
      t.textContent = '— nada tocando';
      s.textContent = 'puxe o fio para começar';
      return;
    }
    t.textContent = '📖 Fase ' + p.phase + ' · ' + p.arch;
    s.textContent = (this.playing ? '▶ ' : '⏸ ') + cur + '/' + total + ' · ' + p.text.slice(0,40) + (p.text.length>40?'…':'');
  }
};

(function wireScrub(){
  const scrub = $('progressScrub');
  if (!scrub) return;
  scrub.addEventListener('input', ()=>{
    Player.scrubbing = true;
    $('progressFill').style.width = scrub.value + '%';
    const hdrFill = $('hdrProgressFill');
    if (hdrFill) hdrFill.style.width = scrub.value + '%';
    scrub.classList.add('scrubbing');
  });
  scrub.addEventListener('change', ()=>{
    Player.scrubbing = false;
    scrub.classList.remove('scrubbing');
    Player.jumpTo(parseFloat(scrub.value) || 0);
  });
  scrub.addEventListener('pointerdown', ()=>{ Player.scrubbing = true; scrub.classList.add('scrubbing'); });
  scrub.addEventListener('pointerup', ()=>{ Player.scrubbing = false; scrub.classList.remove('scrubbing'); });
})();

async function exportPill(){
  const text = readBuilder();
  if (!text){ toast('Nada para exportar'); return; }
  const title = buildSealTitle();
  const record = {
    id:'domr_'+Date.now()+'_'+Math.random().toString(36).slice(2,8),
    title, name: title+'.md', type:'markdown', mime:'text/markdown',
    content: text, text: text, source:'dom-r-pill', vault:'dom-r',
    createdAt: Date.now(), updatedAt: Date.now(),
    tags: ['dom-r','pill', S.identity]
  };
  const NP = SYS.nebulaParent ? window.parent.NebulaPills : (SYS.nebula ? window.NebulaPills : null);
  if (NP && typeof NP.pushDerivedDoc === 'function'){
    try{ NP.pushDerivedDoc(record.name, record.content, {source:record.source, arch: document.body.dataset.arch}); toast('💊 → NebulaPills'); return; }
    catch(e){ console.warn(e); }
  }
  try{
    const key = 'dom_r_pills';
    const arr = JSON.parse(localStorage.getItem(key) || '[]');
    arr.unshift(record);
    localStorage.setItem(key, JSON.stringify(arr.slice(0, 50)));
    toast('💊 Pílula local (' + arr.length + ')');
  }catch{ toast('Erro'); }
}
async function copyResult(){
  const text = readBuilder();
  if (!text){ toast('Nada para copiar'); return; }
  try{ await navigator.clipboard.writeText(text); toast('Copiado ✓'); }
  catch{
    const ta = document.createElement('textarea');
    ta.value = text; document.body.appendChild(ta); ta.select();
    document.execCommand('copy'); ta.remove();
    toast('Copiado ✓');
  }
}
function downloadText(text, filename){
  const blob = new Blob([text], {type: 'text/markdown;charset=utf-8'});
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob); a.download = filename;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(()=>URL.revokeObjectURL(a.href), 1000);
}
function clearThread(){
  S.phase = 3;
  S.relations = []; S.selectedRelations = [];
  S.sourceText = ''; S.currentText = ''; S.history = []; S.fractalIndex = 0;
  S.conversation = [];
  $('intentInput').value = 'Oi, ' + S.identity + ', o que está vivo agora?';
  writeBuilder(''); renderLibrary(); renderLibraryFull(); renderFios(); renderConversation();
  updateConvCounters(); updatePhaseUI();
  $('builderState').textContent = 'novo fio';
  updateHeaderAction('aguardando');
  toast('Novo fio aberto');
}

let toastTimer;
function toast(msg){
  const t = $('toast'); t.textContent = msg; t.classList.add('show');
  clearTimeout(toastTimer); toastTimer = setTimeout(()=>t.classList.remove('show'), 2400);
}

function switchView(name){
  S.currentView = name;
  $$('.session-tab').forEach(b=>b.classList.toggle('on', b.dataset.view===name));
  $$('.view').forEach(v=>v.classList.toggle('on', v.dataset.view===name));
  if (name==='conversa') renderConversation();
  if (name==='sessoes') renderSessions();
  if (name==='biblioteca') renderLibraryFull();
}

$$('.session-tab').forEach(b=>b.addEventListener('click', ()=>switchView(b.dataset.view)));
$('sendBtn').addEventListener('click', detectar);
$('fractalBtn').addEventListener('click', fractal);
$$('.stage-pill').forEach(b=>b.addEventListener('click', ()=>{
  const s = Number(b.dataset.stage);
  if (s===3) detectar();
  else if (s===6) integrar();
  else if (s===9) expandir();
  else if (s===7) selar();
}));
$('copyBtn').addEventListener('click', copyResult);
$('downloadBtn').addEventListener('click', ()=>{
  const t = readBuilder();
  if (!t){ toast('Nada para baixar'); return; }
  downloadText(t, buildSealTitle()+'.md');
});
$('clearBtn').addEventListener('click', clearThread);
$('archSel').addEventListener('change', ()=>{
  const a = $('archSel').value;
  document.body.dataset.arch = a;
  document.documentElement.style.setProperty('--arch-color', ARCH_COLORS[a] || '#b7ff52');
  toast('Arquétipo: ' + a);
  if (window.KOBBus && window.KOBBus.say) window.KOBBus.say('Arquétipo ' + a);
});
$('voiceAutoBtn').addEventListener('click', ()=>{
  S.voiceAutoOn = !S.voiceAutoOn;
  $('voiceAutoBtn').classList.toggle('on', S.voiceAutoOn);
  try{ localStorage.setItem('domr:voice:auto', S.voiceAutoOn ? '1' : '0'); }catch{}
  toast('Voz auto: ' + (S.voiceAutoOn ? 'ON' : 'OFF'));
});
$('sonoroBtn').addEventListener('click', playSonoro);
$('pillBtn').addEventListener('click', exportPill);
$('textBuilder').addEventListener('input', ()=>{
  readBuilder();
  $('builderState').textContent = 'edição manual';
});
$('btnPlayMain').addEventListener('click', ()=>Player.play());
$('btnPrevPhase').addEventListener('click', ()=>Player.prev());
$('btnNextPhase').addEventListener('click', ()=>Player.next());
$('btnStopMain').addEventListener('click', ()=>Player.stop());
const wireSlider = (id, valId, fmt) => {
  const el = $(id), v = $(valId);
  if (!el || !v) return;
  el.addEventListener('input', ()=>{ v.textContent = fmt(el.value); });
};
wireSlider('bpmInput','bpmV', v=>v);
wireSlider('revInput','revV', v=>v+'%');
wireSlider('rateInput','rateV', v=>(v/100).toFixed(1));
wireSlider('pitchInput','pitchV', v=>(v/100).toFixed(1));
window.addEventListener('storage', e=>{
  if (e.key === 'di_userName' || e.key === 'userName') applyIdentity();
  setTimeout(scanLibrary, 350);
});
['nebula:storage-updated','nebula:document-created','nebula:refresh','nebula:library-refresh','library:refresh']
  .forEach(ev=>window.addEventListener(ev, ()=>setTimeout(scanLibrary, 350)));

async function boot(){
  applyIdentity();
  loadSessions();
  updatePhaseUI();
  writeBuilder('');
  renderLibrary(); renderLibraryFull(); renderFios(); renderConversation();
  renderSessions(); updateConvCounters(); updateLibCounters();
  $('builderState').textContent = 'scanner ativo';
  $('voiceAutoBtn').classList.toggle('on', S.voiceAutoOn);
  document.documentElement.style.setProperty('--arch-color', ARCH_COLORS[$('archSel').value] || '#b7ff52');
  document.documentElement.style.setProperty('--phase-accent', ARCH_COLORS[$('archSel').value] || '#b7ff52');
  Player.paintUI();
  await scanLibrary();
  updateHeaderAction('biblioteca · ' + S.registry.length + ' docs');
  if (SYS.kblxArch && window.KOBArch.subscribe){
    window.KOBArch.subscribe(ev=>{
      if (ev.type === 'voice' && S.voiceAutoOn){
        const sel = $('archSel');
        if (Array.from(sel.options).some(o=>o.value===ev.current)) sel.value = ev.current;
      }
    });
  }
}
boot();

window.DomR = {
  scan: scanLibrary, registry: ()=>S.registry, current: ()=>readBuilder(),
  detect: detectar, integrate: integrar, expand: expandir, seal: selar, fractal,
  copy: copyResult, download: ()=>downloadText(readBuilder(), buildSealTitle()+'.md'),
  clear: clearThread, sonoro: playSonoro, stopSonoro, pill: exportPill,
  conversation: ()=>S.conversation, sessions: ()=>S.sessions,
  view: switchView, player: Player, layout: Layout, header: HeaderUI,
  phase: ()=>S.phase, get state(){ return S; }, get sys(){ return SYS; }
};
console.log('%c[Dom R v2.6] %cheader/nav/player independentes · orb como brand · drag+snap',
  'background:#f59e0b;color:#000;padding:2px 8px;border-radius:3px','color:#f59e0b');
})();
