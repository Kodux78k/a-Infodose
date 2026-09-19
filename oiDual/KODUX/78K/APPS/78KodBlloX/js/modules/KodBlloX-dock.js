/* ═══════════════════════════════════════════════════════════════════
   UNIFIED · SYMBOL BAR + DRAWER (extraídos do KOB_445 → base MASTER v13)
   ─ Sem dependências. Roda por último (depois dos scripts remotos).
   ─ Regra de convivência: nunca briga com o motor remoto da base.
     · TTS/arquétipo: o dock pede ao motor da base (#sbSpeak/#sbStop/#sbOrb)
       e só usa fallback local se nada acontecer.
     · Cockpit: cada controle só age se o motor remoto não agiu.
   ═══════════════════════════════════════════════════════════════════ */
(function(){
'use strict';
if (window.__SBX_UNIFIED__) return;
window.__SBX_UNIFIED__ = true;

/* ───────────── helpers ───────────── */
const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const LS = {
  get(k, d = null){ try{ const v = localStorage.getItem(k); return v == null ? d : v; }catch(e){ return d; } },
  set(k, v){ try{ localStorage.setItem(k, v); return true; }catch(e){ return false; } },
  del(k){ try{ localStorage.removeItem(k); }catch(e){} },
  json(k, d){ try{ const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; }catch(e){ return d; } }
};
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
const sleep = ms => new Promise(r => setTimeout(r, ms));
const remoteAlive = () => typeof window.Nebula !== 'undefined';   // motor remoto da base carregou?

function toast(msg, ms = 1800){
  let t = $('#sbxToast');
  if (!t){ t = document.createElement('div'); t.id = 'sbxToast'; t.setAttribute('role', 'status'); document.body.appendChild(t); }
  t.textContent = msg; t.classList.add('show');
  clearTimeout(toast._t); toast._t = setTimeout(() => t.classList.remove('show'), ms);
}

/* Normaliza/valida URL de atalho. Bloqueia javascript:/data:/file: etc. */
function safeUrl(raw){
  let u = String(raw || '').trim();
  if (!u) return '';
  if (/^[a-z][a-z0-9+.\-]*:/i.test(u)) return /^https?:/i.test(u) ? u : '';
  if (u.startsWith('//')) return 'https:' + u;
  if (/^(\.{0,2}\/|#)/.test(u)) return u;
  if (/^[\w\-]+(\.[\w\-]+)+(?=[\/?#:]|$)/.test(u) && !/\.(html?|php|js|json|css)(\?|#|$)/i.test(u)) return 'https://' + u;
  return u; // arquivo relativo (ex.: app.html)
}
function toEmbed(url){
  try{
    const u = new URL(url, location.href);
    if (/(^|\.)youtu\.be$/.test(u.hostname)) return 'https://www.youtube-nocookie.com/embed/' + u.pathname.slice(1);
    if (/(^|\.)youtube\.com$/.test(u.hostname) && u.searchParams.get('v')) return 'https://www.youtube-nocookie.com/embed/' + u.searchParams.get('v');
  }catch(e){}
  return url;
}

/* ═══════════════ 1 · VIEWER (fallback de navegação) ═══════════════ */
const Viewer = {
  open(url, title){
    const u = safeUrl(url); if (!u) { toast('URL inválida'); return; }
    const box = $('#sbxViewer'); if (!box) { window.open(u, '_blank', 'noopener'); return; }
    let host = u; try{ host = new URL(u, location.href).hostname || u; }catch(e){}
    $('#sbxViewerTitle').textContent = title || host;
    $('#sbxViewerOpen').href = u;
    $('#sbxViewerFrame').src = u;
    box.classList.add('open');
  },
  close(){
    const box = $('#sbxViewer'); if (!box) return;
    box.classList.remove('open');
    const f = $('#sbxViewerFrame'); if (f) f.src = 'about:blank';
  },
  isOpen(){ const b = $('#sbxViewer'); return !!(b && b.classList.contains('open')); },
  init(){ const c = $('#sbxViewerClose'); if (c) c.addEventListener('click', () => this.close()); }
};

/* ═══════════════ 2 · SYMBOL BAR ENGINE (persistência + modal) ═══════════════ */
const SymbolBar = {
  storageKey: 'symbolBarConfig',
  defaultItems: [
    { id:'home',     url:'https://www.infodose.com.br', label:'Infodose', icon:'🏠', visible:true },
    { id:'78frames', url:'https://www.infodose.com.br/oiDual/KODUX/78K/APPS/78F.html',  label:'78Frames', icon:'꩜', visible:true },
    { id:'feeling',  url:'https://www.infodose.com.br/oiDual/KODUX/78K/APPS/78EM.html', label:'Feeling',  icon:'◌', visible:true },
    { id:'nebula',   url:'https://www.infodose.com.br/oiDual/KODUX/78K/APPS/78NP.html', label:'Nebula',   icon:'◘', visible:true },
    { id:'void',     url:'https://www.infodose.com.br/splash.html', label:'Void', icon:'Φ', visible:true },
    { id:'hub',      url:'https://kodux78k.github.io/oiDual--Y-/M0D/iFS/', label:'Hub', icon:'Φ', visible:true }
  ],
  items: [],
  lastUrl: '',

  load(){
    const stored = LS.json(this.storageKey, null);
    if (Array.isArray(stored) && stored.length){
      this.items = stored.filter(i => i && i.url && i.label).map(i => ({ ...i, id: i.id || ('sym-' + Math.random().toString(36).slice(2, 8)), visible: i.visible !== false }));
      return;
    }
    this.items = JSON.parse(JSON.stringify(this.defaultItems));
    this.save();
  },
  save(){ LS.set(this.storageKey, JSON.stringify(this.items)); },

  render(){
    const box = $('#symbol-buttons-container'); if (!box) return;
    box.textContent = '';
    const shown = this.items.filter(i => i.visible);
    if (!shown.length){
      const e = document.createElement('span'); e.className = 'sbx-empty'; e.textContent = 'Sem atalhos · toque em ＋';
      box.appendChild(e);
    }
    shown.forEach(item => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'sbx-btn sbx-link symbol-button';
      b.dataset.url = item.url; b.dataset.id = item.id; b.title = item.url;
      const ic = document.createElement('span'); ic.className = 'sbx-ico'; ic.textContent = item.icon || '🔗';
      const lb = document.createElement('span'); lb.className = 'sbx-lbl'; lb.textContent = item.label;
      b.append(ic, lb);
      b.addEventListener('click', e => { e.stopPropagation(); this.loadUrl(item.url, item.label); });
      box.appendChild(b);
    });
    this.renderEditModal();
  },

  /* abre o atalho: iFSw (se existir) → navegação nativa da base (URL global + Go) → viewer próprio */
  loadUrl(url, label){
    const u = safeUrl(url); if (!u) { toast('URL inválida'); return; }
    this.lastUrl = u; LS.set('kob_last_url', u);
    try{
      if (window.iFSw && typeof window.iFSw.createSessionWindow === 'function'){
        window.iFSw.createSessionWindow({ title: label || 'Navegação', src: u, icon: '🌐' }); return;
      }
    }catch(e){ console.warn('[SBX] iFSw falhou', e); }
    const inp = $('#urlInputNav'), go = $('#goNavBtn');
    if (inp && go){
      const sig = () => $$('iframe').map(f => f.getAttribute('src') || f.src).join('|') + '#' + $$('.session-window').length;
      const before = sig();
      inp.value = u; inp.dispatchEvent(new Event('input', { bubbles: true }));
      go.click();
      setTimeout(() => { if (sig() === before && !Viewer.isOpen()) Viewer.open(u, label); }, 650);
      return;
    }
    Viewer.open(u, label);
  },

  openEditModal(){ const m = $('#symbol-edit-modal'); if (m){ m.classList.add('active'); this.renderEditModal(); } },
  closeEditModal(){ const m = $('#symbol-edit-modal'); if (m) m.classList.remove('active'); },
  isModalOpen(){ const m = $('#symbol-edit-modal'); return !!(m && m.classList.contains('active')); },

  renderEditModal(){
    const list = $('#symbol-edit-list'); if (!list) return;
    list.textContent = '';
    if (!this.items.length){ const e = document.createElement('div'); e.className = 'sbx-mempty'; e.textContent = 'Nenhum atalho. Adicione abaixo.'; list.appendChild(e); return; }
    this.items.forEach((item, index) => {
      const row = document.createElement('div'); row.className = 'symbol-item';
      row.innerHTML =
        '<div class="label">' + esc(item.icon || '🔗') + ' ' + esc(item.label) + '<small>' + esc(item.url) + '</small></div>' +
        '<div class="actions">' +
          '<button type="button" class="toggle-vis' + (item.visible ? ' active' : '') + '" title="Visível/oculto" aria-label="Visível/oculto"></button>' +
          '<button type="button" class="remove-btn" title="Remover" aria-label="Remover">✕</button>' +
        '</div>';
      $('.toggle-vis', row).addEventListener('click', e => { e.stopPropagation(); this.items[index].visible = !this.items[index].visible; this.save(); this.render(); });
      $('.remove-btn', row).addEventListener('click', e => { e.stopPropagation(); this.items.splice(index, 1); this.save(); this.render(); });
      list.appendChild(row);
    });
  },

  addItem(url, label){
    const u = safeUrl(url), l = String(label || '').trim();
    if (!u || !l){ toast('Preencha uma URL válida e um rótulo'); return false; }
    this.items.push({ id: 'sym-' + Date.now(), url: u, label: l, icon: '🔗', visible: true });
    this.save(); this.render(); return true;
  },
  resetToDefault(){ this.items = JSON.parse(JSON.stringify(this.defaultItems)); this.save(); this.render(); },

  /* ＋ : abre o modal já com a URL atual preenchida (sem prompt()/alert()) */
  quickAddCurrentUrl(){
    const nav = ($('#urlInputNav') || {}).value || '';
    const cand = safeUrl(this.lastUrl || nav.trim());
    this.openEditModal();
    const u = $('#newSymbolUrl'), l = $('#newSymbolLabel');
    if (u) u.value = cand || '';
    if (l){
      let host = ''; try{ host = cand ? new URL(cand, location.href).hostname.replace(/^www\./, '').split('.')[0] : ''; }catch(e){}
      l.value = host ? host.charAt(0).toUpperCase() + host.slice(1) : '';
      setTimeout(() => { try{ (cand ? l : u).focus(); }catch(e){} }, 50);
    }
    if (!cand) toast('Sem URL ativa · preencha abaixo');
  },

  initModal(){
    const on = (id, fn) => { const el = document.getElementById(id); if (el) el.addEventListener('click', fn); };
    on('closeSymbolModal', () => this.closeEditModal());
    on('closeSymbolModalBtn', () => this.closeEditModal());
    const m = $('#symbol-edit-modal');
    if (m) m.addEventListener('click', e => { if (e.target === e.currentTarget) this.closeEditModal(); });
    const add = () => {
      const u = $('#newSymbolUrl'), l = $('#newSymbolLabel');
      if (this.addItem(u.value, l.value)){ u.value = ''; l.value = ''; toast('Atalho adicionado'); }
    };
    on('addSymbolBtn', add);
    ['newSymbolUrl', 'newSymbolLabel'].forEach(id => { const el = document.getElementById(id); if (el) el.addEventListener('keydown', e => { if (e.key === 'Enter'){ e.preventDefault(); add(); } }); });
    on('resetSymbolsBtn', () => { if (confirm('Restaurar a lista padrão de atalhos?')) this.resetToDefault(); });
    on('sbxEditBtn', () => this.openEditModal());
    on('quickAddBtn', e => { e.stopPropagation(); this.quickAddCurrentUrl(); });
  },

  init(){ this.load(); this.render(); this.initModal(); }
};

/* ═══════════════ 3 · DOCK · colapso · long-press · drag · idle ═══════════════ */
const Dock = {
  KEY: 'sbx_pos_v1', CKEY: 'sbx_collapsed_v1', IDLE: 9000,
  el: null, pos: null, idleT: null,

  place(x, y){
    const el = this.el, m = 6, w = el.offsetWidth, h = el.offsetHeight;
    x = Math.max(m, Math.min(window.innerWidth - w - m, x));
    y = Math.max(m, Math.min(window.innerHeight - h - m, y));
    el.style.left = x + 'px'; el.style.top = y + 'px';
    el.style.bottom = 'auto'; el.style.transform = 'none';
    this.pos = { x, y };
  },
  snap(){
    if (!this.pos) return;
    const w = this.el.offsetWidth; let { x, y } = this.pos;
    if (x < 40) x = 6; else if (x > window.innerWidth - w - 40) x = window.innerWidth - w - 6;
    this.place(x, y); LS.set(this.KEY, JSON.stringify(this.pos));
  },
  reset(){
    const s = this.el.style; s.left = s.top = s.bottom = s.transform = ''; this.pos = null; LS.del(this.KEY);
    toast('Barra recentralizada');
  },
  restore(){ const p = LS.json(this.KEY, null); if (p && isFinite(p.x) && isFinite(p.y)) this.place(p.x, p.y); },
  reclamp(){ if (this.pos) this.place(this.pos.x, this.pos.y); },

  setCollapsed(c, persist = true){
    this.el.classList.toggle('is-collapsed', c);
    const t = $('#symbolToggleBtn'); if (t) t.setAttribute('aria-expanded', String(!c));
    if (persist) LS.set(this.CKEY, c ? '1' : '0');
    requestAnimationFrame(() => this.reclamp());
  },
  toggleCollapsed(){ this.setCollapsed(!this.el.classList.contains('is-collapsed')); },

  bumpIdle(){
    const el = this.el; el.classList.remove('is-idle');
    clearTimeout(this.idleT); this.idleT = setTimeout(() => el.classList.add('is-idle'), this.IDLE);
  },

  init(){
    const el = this.el = $('#symbolBarDock'); if (!el) return;

    /* ≡ : clique = recolher/expandir · segurar 600 ms = editar atalhos */
    const tog = $('#symbolToggleBtn'); let lp = null, fired = false;
    tog.addEventListener('pointerdown', () => { fired = false; lp = setTimeout(() => { fired = true; SymbolBar.openEditModal(); try{ navigator.vibrate && navigator.vibrate(12); }catch(e){} }, 600); });
    ['pointerup', 'pointerleave', 'pointercancel'].forEach(t => tog.addEventListener(t, () => clearTimeout(lp)));
    tog.addEventListener('click', e => { if (fired){ fired = false; e.preventDefault(); return; } this.toggleCollapsed(); });
    tog.addEventListener('contextmenu', e => e.preventDefault());

    /* arrastar pelo grip · toque duplo recentraliza */
    const grip = $('#sbxGrip'); let drag = null, lastTap = 0;
    grip.addEventListener('pointerdown', e => {
      if (e.button != null && e.button !== 0) return;
      const r = el.getBoundingClientRect();
      drag = { dx: e.clientX - r.left, dy: e.clientY - r.top, moved: false };
      try{ grip.setPointerCapture(e.pointerId); }catch(_){}
      el.classList.add('is-dragging'); e.preventDefault();
    });
    grip.addEventListener('pointermove', e => {
      if (!drag) return; drag.moved = true; this.place(e.clientX - drag.dx, e.clientY - drag.dy);
    });
    const end = e => {
      if (!drag) return;
      try{ grip.releasePointerCapture(e.pointerId); }catch(_){}
      el.classList.remove('is-dragging');
      if (drag.moved) this.snap();
      else { const now = Date.now(); if (now - lastTap < 320){ this.reset(); lastTap = 0; } else lastTap = now; }
      drag = null;
    };
    grip.addEventListener('pointerup', end); grip.addEventListener('pointercancel', end);

    window.addEventListener('resize', () => this.reclamp());
    ['pointerdown', 'keydown', 'touchstart'].forEach(t => window.addEventListener(t, () => this.bumpIdle(), { passive: true }));

    this.restore();
    this.setCollapsed(LS.get(this.CKEY) === '1', false);
    this.bumpIdle();
  }
};

/* ═══════════════ 4 · TTS · proxy do motor da base + fallback local ═══════════════ */
const ARCH = JSON.parse('__ARCH_JSON__').map(a => ({ id:a[0], name:a[1], voice:a[2], lang:a[3], rate:a[4], pitch:a[5], color:a[6] }));
const TTS = {
  idx: 0, poll: null,
  synth(){ return ('speechSynthesis' in window) ? window.speechSynthesis : null; },
  speaking(){ const s = this.synth(); return !!(s && (s.speaking || s.pending)); },

  readable(){
    const sel = (window.getSelection && String(window.getSelection())).trim();
    if (sel) return sel;
    const conv = $('#conversation'); if (conv && !$('.empty', conv)) { const t = conv.innerText.trim(); if (t) return t; }
    const src = $('#sourceText'); if (src && src.value.trim()) return src.value.trim();
    const hero = $('#hero .hero-content'); return hero ? hero.innerText.trim() : '';
  },
  chunk(text){
    const parts = String(text).replace(/\s+/g, ' ').match(/[^.!?…]+[.!?…]*\s*/g) || [String(text)];
    const out = []; let cur = '';
    parts.forEach(p => { if ((cur + p).length > 190){ if (cur) out.push(cur.trim()); cur = p; } else cur += p; });
    if (cur.trim()) out.push(cur.trim());
    return out.flatMap(c => c.length > 230 ? (c.match(/.{1,200}(\s|$)/g) || [c]) : [c]);
  },
  pickVoice(a){
    const vs = this.synth() ? this.synth().getVoices() : [];
    return vs.find(v => v.name.indexOf(a.voice) >= 0) || vs.find(v => v.lang === a.lang) || vs.find(v => v.lang && v.lang.slice(0, 2) === a.lang.slice(0, 2)) || null;
  },
  speakLocal(text){
    const s = this.synth();
    if (!s){ toast('Síntese de voz indisponível neste navegador'); return; }
    if (!text){ toast('Nada para ouvir'); return; }
    const a = ARCH[this.idx]; const v = this.pickVoice(a);
    s.cancel();
    this.chunk(text).forEach(c => {
      const u = new SpeechSynthesisUtterance(c);
      u.lang = a.lang; u.rate = a.rate; u.pitch = a.pitch; if (v) u.voice = v;
      s.speak(u);
    });
    this.sync();
  },

  play(){
    const s = this.synth();
    if (s && s.speaking){ if (s.paused) s.resume(); else s.pause(); this.sync(); return; }
    try{ if (window.KOB_TTS && typeof window.KOB_TTS.toggle === 'function'){ window.KOB_TTS.toggle(); return; } }catch(e){}
    const base = $('#sbSpeak');
    if (base){ base.click(); setTimeout(() => { if (!this.speaking()) this.speakLocal(this.readable()); this.sync(); }, 750); return; }
    this.speakLocal(this.readable());
  },
  stop(){
    const s = this.synth(); if (s) s.cancel();
    const b = $('#sbStop'); if (b) b.click();
    this.sync();
  },

  /* arquétipo: delega a #sbOrb (motor da base); se nada mudar, cicla localmente */
  arch(){
    const pill = $('#pillArch');
    const col = () => getComputedStyle(document.documentElement).getPropertyValue('--kob-voice-primary').trim();
    const orb = $('#sbOrb');
    if (orb){
      const c0 = col(), t0 = pill ? pill.textContent : '';
      orb.click();
      setTimeout(() => { if (col() === c0 && (pill ? pill.textContent : '') === t0) this.cycleLocal(); }, 320);
      return;
    }
    this.cycleLocal();
  },
  cycleLocal(){
    this.idx = (this.idx + 1) % ARCH.length; const a = ARCH[this.idx];
    document.documentElement.style.setProperty('--kob-voice-primary', a.color);
    const pill = $('#pillArch'); if (pill) pill.textContent = a.name;
    LS.set('sbx_arch', a.id); toast('Arquétipo · ' + a.name);
  },

  sync(){
    const s = this.synth(), sp = !!(s && s.speaking), paused = !!(s && s.paused);
    const p = $('#btn-play'), dock = $('#symbolBarDock');
    if (p){
      const glyph = (sp && !paused) ? '❚❚' : '▶';
      if (p.textContent !== glyph) p.textContent = glyph;
      p.dataset.speaking = sp ? '1' : '0';
      p.title = sp ? (paused ? 'Continuar' : 'Pausar') : 'Ouvir';
    }
    if (dock) dock.classList.toggle('is-speaking', sp && !paused);
  },
  init(){
    const on = (id, fn) => { const el = document.getElementById(id); if (el) el.addEventListener('click', e => { e.stopPropagation(); fn(); }); };
    on('btn-play', () => this.play());
    on('tts-stop', () => this.stop());
    on('btn-arch', () => this.arch());
    const saved = LS.get('sbx_arch'); const i = ARCH.findIndex(a => a.id === saved); if (i >= 0) this.idx = i;
    this.poll = setInterval(() => this.sync(), 500);
  }
};

/* ═══════════════ 5 · VIEWPORT toggle + PLAYER ═══════════════ */
const Viewport = {
  el(){ return $('#universe-viewport'); },
  visible(){ const v = this.el(); return !v || v.style.display !== 'none'; },
  sync(){
    const b = $('#toggleViewportBtn'); if (!b) return;
    const vis = this.visible();
    b.textContent = vis ? '⊞' : '⊟'; b.setAttribute('aria-pressed', String(vis)); b.title = vis ? 'Ocultar viewport' : 'Mostrar viewport';
  },
  toggle(){ const v = this.el(); if (!v){ toast('Viewport não encontrado'); return; } v.style.display = this.visible() ? 'none' : ''; this.sync(); },
  init(){
    const b = $('#toggleViewportBtn'); if (b) b.addEventListener('click', e => { e.preventDefault(); e.stopPropagation(); this.toggle(); });
    const p = $('#sbxPlayerBtn');
    if (p) p.addEventListener('click', e => {
      e.preventDefault(); e.stopPropagation();
      const url = p.dataset.playerUrl, title = p.dataset.playerTitle || 'Player';
      try{ if (window.Player && typeof window.Player.play === 'function'){ window.Player.play(url, title); return; } }catch(err){ console.warn('[SBX] Player falhou', err); }
      Viewer.open(toEmbed(url), title);
    });
    this.sync();
  }
};

/* ═══════════════ 6 · DRAWER · shell (abrir/fechar · overlay · ESC · foco) ═══════════════ */
const Drawer = {
  last: { id: '', t: 0 }, opener: null,
  anyOpen(){ return $$('.drawer.open').length > 0; },
  set(id, open){
    const d = document.getElementById(id); if (!d) return;
    const is = d.classList.contains('open');
    if (open === undefined) open = !is;
    if (open === is) return;
    d.classList.toggle('open', open);
    d.setAttribute('aria-hidden', String(!open));
    try{ d.inert = !open; }catch(e){}
    const ov = $('#drawerOverlay'); if (ov) ov.classList.toggle('open', this.anyOpen());
    document.body.classList.toggle('sbx-drawer-open', this.anyOpen());
    if (open){
      this.opener = document.activeElement;
      setTimeout(() => { const c = $('.drawer-close', d); if (c) c.focus({ preventScroll: true }); }, 80);
    } else if (this.opener && this.opener.focus){
      try{ this.opener.focus({ preventScroll: true }); }catch(e){}
    }
  },
  toggle(id){
    if (!id){ this.closeAll(); return; }
    const now = Date.now();                                     // debounce: um clique = um toggle
    if (this.last.id === id && now - this.last.t < 120) return;
    this.last = { id, t: now };
    this.set(id);
  },
  closeAll(){ $$('.drawer.open').forEach(d => this.set(d.id, false)); },
  init(){
    $$('.drawer').forEach(d => { d.setAttribute('aria-hidden', String(!d.classList.contains('open'))); try{ d.inert = !d.classList.contains('open'); }catch(e){} });
    window.toggleDrawer = id => Drawer.toggle(id);
    window.openDrawer   = id => Drawer.set(id || 'drawerProfile', true);
    window.closeDrawer  = id => id ? Drawer.set(id, false) : Drawer.closeAll();
    /* dono do gatilho: 🔅 #orbToggle / [data-dual-action="drawer:open"] / [data-drawer-open] */
    document.addEventListener('click', e => {
      const t = e.target.closest && e.target.closest('#orbToggle,[data-dual-action="drawer:open"],[data-drawer-open]');
      if (!t) return;
      e.preventDefault(); e.stopImmediatePropagation();
      Drawer.toggle((t.dataset && t.dataset.drawerOpen) || 'drawerProfile');
    }, true);
  }
};

/* ═══════════════ 7 · COCKPIT · motores do drawer (cooperativos) ═══════════════ */
const Solar = {
  MODES: ['day', 'sunset', 'night'], auto: LS.get('sbx_solar_auto') === '1',
  mode(){ for (const m of this.MODES) if (document.body.classList.contains('mode-' + m)) return m; return 'night'; },
  set(m, auto){
    this.auto = !!auto;
    document.body.classList.remove('mode-day', 'mode-sunset', 'mode-night'); document.body.classList.add('mode-' + m);
    LS.set('di_solarMode', m); LS.set('sbx_solar_auto', this.auto ? '1' : '0');
    this.label(); document.dispatchEvent(new CustomEvent('kobllux:solar', { detail: { mode: m, auto: this.auto } }));
  },
  cycle(){ this.set(this.MODES[(this.MODES.indexOf(this.mode()) + 1) % 3], false); },
  byTime(){ const h = new Date().getHours(); return (h >= 6 && h < 17) ? 'day' : (h >= 17 && h < 19) ? 'sunset' : 'night'; },
  enableAuto(){ this.set(this.byTime(), true); toast('Solar automático'); },
  label(){ const el = $('#statusSolarMode'); if (el) el.textContent = this.mode().toUpperCase() + (this.auto ? ' (AUTO)' : ' (MAN)'); },
  init(){
    const saved = LS.get('di_solarMode');
    if (this.auto) this.set(this.byTime(), true);
    else if (saved && this.MODES.indexOf(saved) >= 0 && saved !== this.mode()) this.set(saved, false);
    setInterval(() => { if (this.auto) this.set(this.byTime(), true); }, 600000);
  }
};

/* age só se o motor remoto NÃO agiu (compara o estado do body após o clique) */
function cooperative(btnId, fn){
  let before = '';
  document.addEventListener('click', e => { if (e.target.closest && e.target.closest('#' + btnId)) before = document.body.className; }, true);
  document.addEventListener('click', e => {
    if (!(e.target.closest && e.target.closest('#' + btnId))) return;
    const b = before; setTimeout(() => { if (document.body.className === b) fn(); }, 40);
  });
}

/* Background: galeria em IndexedDB · limite 369 KB por imagem · reduz automaticamente */
const BG = {
  DB: 'kobllux_unified_bg', ST: 'bg', MAX: 369 * 1024, urls: {}, dbp: null,
  open(){
    if (this.dbp) return this.dbp;
    this.dbp = new Promise((res, rej) => {
      try{
        const r = indexedDB.open(this.DB, 1);
        r.onupgradeneeded = () => r.result.createObjectStore(this.ST, { keyPath: 'id' });
        r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error);
      }catch(e){ rej(e); }
    });
    return this.dbp;
  },
  tx(mode, fn){
    return this.open().then(db => new Promise((res, rej) => {
      const t = db.transaction(this.ST, mode), rq = fn(t.objectStore(this.ST));
      t.oncomplete = () => res(rq && rq.result); t.onerror = () => rej(t.error); t.onabort = () => rej(t.error);
    }));
  },
  all(){ return this.tx('readonly', s => s.getAll()).then(r => (r || []).sort((a, b) => b.ts - a.ts)).catch(() => []); },
  put(it){ return this.tx('readwrite', s => s.put(it)); },
  del(id){ return this.tx('readwrite', s => s.delete(id)); },

  async compress(file){
    let bmp;
    try{ bmp = await createImageBitmap(file); }
    catch(e){ bmp = await new Promise((res, rej) => { const im = new Image(); im.onload = () => res(im); im.onerror = rej; im.src = URL.createObjectURL(file); }); }
    const W = bmp.width || bmp.naturalWidth, H = bmp.height || bmp.naturalHeight;
    let side = Math.min(1920, Math.max(W, H)), q = 0.86, best = null;
    for (let i = 0; i < 14; i++){
      const k = Math.min(1, side / Math.max(W, H)), w = Math.max(1, Math.round(W * k)), h = Math.max(1, Math.round(H * k));
      const c = document.createElement('canvas'); c.width = w; c.height = h;
      c.getContext('2d').drawImage(bmp, 0, 0, w, h);
      const blob = await new Promise(r => c.toBlob(r, 'image/jpeg', q));
      if (blob){ best = blob; if (blob.size <= this.MAX) return blob; }
      if (q > 0.52) q -= 0.1; else side *= 0.8;
    }
    return best;
  },
  urlFor(it){ if (!this.urls[it.id]) this.urls[it.id] = URL.createObjectURL(it.blob); return this.urls[it.id]; },

  opacityValue(){ const r = $('#bgOpacity'); return r ? Math.max(0, Math.min(100, +r.value)) / 100 : 0.15; },
  apply(it){
    const el = $('#bg-fake-custom'); if (!el) return;
    if (it){
      el.style.backgroundImage = 'url("' + this.urlFor(it) + '")';
      el.style.backgroundSize = 'cover'; el.style.backgroundPosition = 'center';
      el.style.opacity = String(this.opacityValue());
      const b = $('#bgBlend'); if (b) el.style.mixBlendMode = b.value;
      LS.set('sbx_bg_active', it.id);
    } else { el.style.backgroundImage = ''; el.style.opacity = '0'; LS.del('sbx_bg_active'); }
    const s = $('#bgStatusText'); if (s) s.textContent = it ? 'Ativo' : 'Nenhum';
  },
  async render(){
    const panel = $('#bgThumbPanel'); if (!panel) return;
    const list = await this.all(), active = LS.get('sbx_bg_active');
    panel.textContent = '';
    if (!list.length){ const e = document.createElement('div'); e.className = 'sbx-bg-empty'; e.textContent = 'Nenhum background salvo. Envie uma imagem.'; panel.appendChild(e); return; }
    list.forEach(it => {
      const t = document.createElement('div');
      t.className = 'sbx-bg-thumb' + (it.id === active ? ' is-active' : '');
      t.style.backgroundImage = 'url("' + this.urlFor(it) + '")';
      t.title = it.name + ' · ' + Math.round(it.blob.size / 1024) + ' KB';
      t.tabIndex = 0; t.setAttribute('role', 'button');
      const x = document.createElement('button'); x.type = 'button'; x.textContent = '✕'; x.title = 'Remover'; x.setAttribute('aria-label', 'Remover background');
      const use = () => { this.apply(it); this.render(); };
      t.addEventListener('click', use);
      t.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' '){ e.preventDefault(); use(); } });
      x.addEventListener('click', async e => {
        e.stopPropagation(); if (!confirm('Remover este background?')) return;
        await this.del(it.id); if (this.urls[it.id]){ URL.revokeObjectURL(this.urls[it.id]); delete this.urls[it.id]; }
        if (LS.get('sbx_bg_active') === it.id) this.apply(null);
        this.render();
      });
      t.appendChild(x); panel.appendChild(t);
    });
  },
  async add(file){
    try{
      const blob = await this.compress(file);
      if (!blob){ toast('Não foi possível processar a imagem'); return; }
      const it = { id: 'bg_' + Date.now(), name: file.name || 'background', ts: Date.now(), blob };
      await this.put(it); this.apply(it); await this.render();
      toast('Background salvo · ' + Math.round(blob.size / 1024) + ' KB');
    }catch(e){ console.warn('[SBX] bg', e); toast('Falha ao salvar o background'); }
  },
  async restore(){
    const list = await this.all(), id = LS.get('sbx_bg_active');
    const it = list.find(x => x.id === id); if (it) this.apply(it);
    this.render();
  },
  async wipe(){
    try{ (await this.open()).close(); }catch(e){}
    this.dbp = null;
    await new Promise(r => { try{ const q = indexedDB.deleteDatabase(this.DB); q.onsuccess = q.onerror = q.onblocked = () => r(); }catch(e){ r(); } });
  }
};

/* Backup / restauração (só quando o motor remoto não está presente) */
const KEY_RX = /^(di_|kob|KOB|sbx_|symbol|uno:|nebula|alfa|mxp|dual)/i;
const Backup = {
  keys(){ const k = []; for (let i = 0; i < localStorage.length; i++){ const n = localStorage.key(i); if (KEY_RX.test(n)) k.push(n); } return k; },
  blobToDataUrl(b){ return new Promise((res, rej) => { const r = new FileReader(); r.onload = () => res(r.result); r.onerror = rej; r.readAsDataURL(b); }); },
  async export(){
    const ls = {}; this.keys().forEach(k => { ls[k] = localStorage.getItem(k); });
    const bg = []; for (const it of await BG.all()){ try{ bg.push({ id: it.id, name: it.name, ts: it.ts, data: await this.blobToDataUrl(it.blob) }); }catch(e){} }
    const payload = { app: 'KOBLLUX-UNIFIED', v: 1, ts: new Date().toISOString(), ls, bg };
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([JSON.stringify(payload)], { type: 'application/json' }));
    a.download = 'kobllux-backup-' + new Date().toISOString().slice(0, 16).replace(/[-:T]/g, '') + '.json';
    document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 800);
    toast('Backup exportado');
  },
  import(){
    const inp = document.createElement('input'); inp.type = 'file'; inp.accept = '.json,application/json';
    inp.addEventListener('change', async () => {
      const f = inp.files && inp.files[0]; if (!f) return;
      try{
        const d = JSON.parse(await f.text());
        if (!d || d.app !== 'KOBLLUX-UNIFIED' || typeof d.ls !== 'object') throw new Error('formato');
        if (!confirm('Importar backup de ' + (d.ts || 'data desconhecida') + '? Isso substitui as configurações atuais.')) return;
        this.keys().forEach(k => LS.del(k));
        Object.keys(d.ls).forEach(k => { if (KEY_RX.test(k)) LS.set(k, d.ls[k]); });
        for (const b of (d.bg || [])){ try{ const blob = await (await fetch(b.data)).blob(); await BG.put({ id: b.id, name: b.name, ts: b.ts, blob }); }catch(e){} }
        toast('Backup importado · recarregando'); setTimeout(() => location.reload(), 700);
      }catch(e){ toast('Arquivo de backup inválido'); }
    });
    inp.click();
  },
  async reset(){
    if (!confirm('Resetar TUDO? Configurações, atalhos e backgrounds serão apagados.')) return;
    this.keys().forEach(k => LS.del(k)); await BG.wipe();
    toast('Tudo resetado · recarregando'); setTimeout(() => location.reload(), 700);
  }
};

const Cockpit = {
  init(){
    Solar.init();
    cooperative('btnCycleSolar', () => Solar.cycle());
    cooperative('btnAutoSolar',  () => Solar.enableAuto());

    /* identificação e modelo (idempotente: mesma chave do di_core) */
    const uid = $('#inputUserId'), mdl = $('#inputModel');
    const savedU = LS.get('di_userName'), savedM = LS.get('di_modelName');
    const paint = v => { const h = $('#displayUserHeader'); if (h) h.textContent = v || 'PILOTO'; const u = $('#usernameDisplay'); if (u) u.textContent = v || ''; };
    if (uid){ if (!uid.value && savedU) { uid.value = savedU; paint(savedU); } uid.addEventListener('change', () => { const v = uid.value.trim(); LS.set('di_userName', v); paint(v); }); }
    if (mdl){ if (!mdl.value && savedM) mdl.value = savedM; mdl.addEventListener('change', () => LS.set('di_modelName', mdl.value.trim())); }

    /* upload de background: age já se o remoto não existe; senão, só se ele não aplicou nada */
    const up = $('#bgUploadInput');
    if (up) up.addEventListener('change', e => {
      const f = e.target.files && e.target.files[0]; if (!f) return;
      if (!remoteAlive()){ BG.add(f); return; }
      setTimeout(() => { const el = $('#bg-fake-custom'); if (!el || !/url\(/.test(getComputedStyle(el).backgroundImage)) BG.add(f); }, 1100);
    }, true);
    if (up) up.addEventListener('click', () => { try{ up.value = ''; }catch(e){} });

    /* backup: dono dos 3 botões somente sem motor remoto */
    const claim = (id, fn) => document.addEventListener('click', e => {
      if (!(e.target.closest && e.target.closest('#' + id)) || remoteAlive()) return;
      e.preventDefault(); e.stopImmediatePropagation(); fn();
    }, true);
    claim('exportState',   () => Backup.export());
    claim('importState',   () => Backup.import());
    claim('resetAllState', () => Backup.reset());
  },
  late(){
    /* após load: preenche o que o remoto deixou faltando */
    if (typeof window.updateBgAttr !== 'function'){
      window.updateBgAttr = function(kind, val){
        const el = $('#bg-fake-custom'); if (!el) return;
        if (kind === 'opacity'){
          const n = Math.max(0, Math.min(100, +val)); el.style.opacity = String(n / 100);
          const r = $('#bgOpacity'); if (r) r.value = n; const l = $('#val-op'); if (l) l.textContent = n + '%';
          LS.set('sbx_bg_op', String(n));
        } else if (kind === 'blend'){ el.style.mixBlendMode = val; LS.set('sbx_bg_blend', val); }
      };
    }
    if (!remoteAlive()){
      BG.restore();
      const op = LS.get('sbx_bg_op'), bl = LS.get('sbx_bg_blend');
      if (op != null){ const r = $('#bgOpacity'); if (r) r.value = op; const l = $('#val-op'); if (l) l.textContent = op + '%'; }
      if (bl){ const s = $('#bgBlend'); if (s) s.value = bl; }
    }
    Solar.label();
  }
};

/* ═══════════════ 8 · ESC + boot ═══════════════ */
document.addEventListener('keydown', e => {
  if (e.key !== 'Escape') return;
  if (SymbolBar.isModalOpen()) SymbolBar.closeEditModal();
  else if (Viewer.isOpen()) Viewer.close();
  else if (Drawer.anyOpen()) Drawer.closeAll();
});

function boot(){
  Viewer.init(); SymbolBar.init(); Dock.init(); TTS.init(); Viewport.init(); Drawer.init(); Cockpit.init();
  window.SymbolBar = window.SymbolBar || SymbolBar;
  window.KOBLLUX_UNI = { SymbolBar, Dock, TTS, Viewport, Viewer, Drawer, Solar, BG, Backup, version: 'unified-1' };
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true }); else boot();
window.addEventListener('load', () => setTimeout(() => {
  Cockpit.late();
  if (window.KOBLLUX && typeof window.KOBLLUX === 'object') { window.KOBLLUX.SymbolBar = window.KOBLLUX.SymbolBar || SymbolBar; window.KOBLLUX.Drawer = window.KOBLLUX.Drawer || Drawer; }
}, 350));
})();