/* ═══════════════════════════════════════════════════════════════════
   UNIFIED v3 · base kob_187 · Symbol Bar dinâmica DENTRO do #symbolBar + rede de segurança do Drawer
   ─ Sem dependências. Roda por último (depois dos scripts remotos).
   ─ Sem barra separada: os atalhos vivem no .sidebar.right do seu #symbolBar,
     com o mesmo markup (.symbol-wrap > .symbol-button[data-url]) — o seu CSS,
     o di-icon-btn e o drag→factory continuam valendo.
   ─ Botões que já existem no HTML são ADOTADOS (mesmos nós, mesmos handlers).
   ─ Regra de convivência: cada controle do Cockpit só age se o motor remoto
     (Nebula / bgPanel / di_core) não agiu. Sem remoto, tudo continua funcionando.
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

/* ═══════════════ 1 · NAVEGAÇÃO (sem UI própria) ═══════════════ */
const navSig = () => $$('iframe').map(f => f.getAttribute('src') || '').join('|') + '#' + $$('.session-window').length;
function openUrl(u, label){
  /* iFSw → navegação nativa da base (URL global + Go) → nova aba */
  try{
    if (window.iFSw && typeof window.iFSw.createSessionWindow === 'function'){
      window.iFSw.createSessionWindow({ title: label || 'Navegação', src: u, icon: '🌐' }); return;
    }
  }catch(e){ console.warn('[SBX] iFSw falhou', e); }
  const inp = $('#urlInputNav'), go = $('#goNavBtn');
  if (inp && go){
    const before = navSig();
    inp.value = u; inp.dispatchEvent(new Event('input', { bubbles: true }));
    go.click();
    setTimeout(() => { if (navSig() === before) window.open(u, '_blank', 'noopener'); }, 650);
    return;
  }
  window.open(u, '_blank', 'noopener');
}

/* ═══════════════ 2 · SYMBOL BAR · atalhos dentro do #symbolBar ═══════════════ */
const SymbolBar = {
  KEY: 'sbx_symbols_v1',
  fallbackDefaults: [
    { id:'void',     url:'https://www.infodose.com.br/splash.html', label:'Void', icon:'Φ', visible:true },
    { id:'Home',     url:'https://kodux78k.github.io/oiDual--Y-/M0D/iFS/', label:'Home', icon:'Φ', visible:true },
    { id:'78Frames', url:'https://www.infodose.com.br/oiDual/KODUX/78K/APPS/78F.html',  label:'78Frames', icon:'꩜', visible:true },
    { id:'Feeling',  url:'https://www.infodose.com.br/oiDual/KODUX/78K/APPS/78EM.html', label:'Feeling',  icon:'◌', visible:true },
    { id:'Nebualayer', url:'https://www.infodose.com.br/oiDual/KODUX/78K/APPS/78NP.html', label:'Nebualayer', icon:'◘', visible:true }
  ],
  items: [], defaults: [], nodes: new Map(), lastUrl: '',

  host(){ return $('#symbolBar .sidebar.right') || $('.sidebar.right'); },
  slug(s){ return String(s || '').toLowerCase().replace(/[^\w]+/g, '-').replace(/^-+|-+$/g, '') || ('sym'); },
  wrap(n){ const p = n.parentElement; return (p && p.classList.contains('symbol-wrap') && p.parentElement === this.host()) ? p : n; },

  /* lê os atalhos que já estão no HTML (mesmos nós → mantêm seus handlers) */
  adopt(){
    const host = this.host(), out = []; if (!host) return out;
    $$('.symbol-button[data-url]', host).forEach(b => {
      let id = b.dataset.id || this.slug(b.title || b.textContent);
      while (out.some(o => o.id === id)) id += '_';
      b.dataset.sbx = 'native'; this.nodes.set(id, b);
      out.push({ id, url: b.dataset.url, label: b.dataset.id || b.title || b.textContent.trim() || id, icon: b.textContent.trim() || '🔗', visible: true });
    });
    return out;
  },

  load(){
    const native = this.adopt();
    this.defaults = (native.length ? native : this.fallbackDefaults).map(d => ({ ...d }));
    const st = LS.json(this.KEY, null);
    if (st && Array.isArray(st.items)){
      this.items = st.items.filter(i => i && i.id && i.url && i.label).map(i => ({ id: String(i.id), url: i.url, label: String(i.label), icon: i.icon || '🔗', visible: i.visible !== false }));
    } else { this.items = this.defaults.map(d => ({ ...d })); this.save(); }
  },
  save(){ LS.set(this.KEY, JSON.stringify({ v: 1, items: this.items })); },

  make(it){
    const w = document.createElement('div'); w.className = 'symbol-wrap';
    const b = document.createElement('button'); b.type = 'button'; b.className = 'symbol-button';
    b.dataset.sbx = 'mine'; b.dataset.id = it.id; b.textContent = it.icon || '🔗';
    b.addEventListener('click', e => { e.stopPropagation(); this.open(it.id); });
    w.appendChild(b); return b;
  },

  render(){
    const host = this.host();
    if (host){
      const ids = new Set(this.items.map(i => i.id));
      this.nodes.forEach((n, id) => { if (!ids.has(id)){ if (n.dataset.sbx === 'native') this.wrap(n).style.display = 'none'; else { this.wrap(n).remove(); this.nodes.delete(id); } } });
      const q = $('#quickAddBtn'), anchor = q ? this.wrap2(q, host) : null;
      this.items.forEach(it => {
        let n = this.nodes.get(it.id);
        if (!n){ n = this.make(it); this.nodes.set(it.id, n); host.insertBefore(n.parentElement, anchor); }
        n.dataset.url = it.url; n.title = it.label;
        this.wrap(n).style.display = it.visible ? '' : 'none';
      });
    }
    this.renderModal();
  },
  wrap2(n, host){ const p = n.parentElement; return (p && p !== host && p.parentElement === host) ? p : n; },

  open(id){
    const it = this.items.find(x => x.id === id); if (!it) return;
    const u = safeUrl(it.url); if (!u){ toast('URL inválida'); return; }
    this.lastUrl = u; LS.set('kob_last_url', u); openUrl(u, it.label);
  },

  /* ───── modal de edição ───── */
  openEditModal(){ const m = $('#symbol-edit-modal'); if (m){ m.classList.add('active'); this.renderModal(); } },
  closeEditModal(){ const m = $('#symbol-edit-modal'); if (m) m.classList.remove('active'); },
  isModalOpen(){ const m = $('#symbol-edit-modal'); return !!(m && m.classList.contains('active')); },

  renderModal(){
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

  addItem(url, label, icon){
    const u = safeUrl(url), l = String(label || '').trim();
    if (!u || !l){ toast('Preencha uma URL válida e um rótulo'); return false; }
    const ic = String(icon || '').trim() || Array.from(l)[0].toUpperCase();
    this.items.push({ id: this.slug(l) + '-' + Date.now().toString(36), url: u, label: l, icon: ic, visible: true });
    this.save(); this.render(); return true;
  },
  resetToDefault(){ this.items = this.defaults.map(d => ({ ...d })); this.save(); this.render(); },

  /* ＋ : abre o modal já com a URL atual preenchida */
  quickAddCurrentUrl(){
    const nav = ($('#urlInputNav') || {}).value || '';
    const cand = safeUrl(this.lastUrl || nav.trim());
    this.openEditModal();
    const u = $('#newSymbolUrl'), l = $('#newSymbolLabel'), i = $('#newSymbolIcon');
    if (u) u.value = cand || '';
    if (i) i.value = '';
    if (l){
      let host = ''; try{ host = cand ? new URL(cand, location.href).hostname.replace(/^www\./, '').split('.')[0] : ''; }catch(e){}
      l.value = host ? host.charAt(0).toUpperCase() + host.slice(1) : '';
      setTimeout(() => { try{ (cand ? l : u).focus(); }catch(e){} }, 50);
    }
    if (!cand) toast('Sem URL ativa · preencha abaixo');
  },

  init(){
    this.load(); this.render();
    const on = (id, fn) => { const el = document.getElementById(id); if (el) el.addEventListener('click', fn); };
    on('closeSymbolModal', () => this.closeEditModal());
    on('closeSymbolModalBtn', () => this.closeEditModal());
    const m = $('#symbol-edit-modal');
    if (m) m.addEventListener('click', e => { if (e.target === e.currentTarget) this.closeEditModal(); });
    const add = () => {
      const u = $('#newSymbolUrl'), l = $('#newSymbolLabel'), i = $('#newSymbolIcon');
      if (this.addItem(u.value, l.value, i ? i.value : '')){ u.value = ''; l.value = ''; if (i) i.value = ''; toast('Atalho adicionado'); }
    };
    on('addSymbolBtn', add);
    ['newSymbolUrl', 'newSymbolLabel', 'newSymbolIcon'].forEach(id => { const el = document.getElementById(id); if (el) el.addEventListener('keydown', e => { if (e.key === 'Enter'){ e.preventDefault(); add(); } }); });
    on('resetSymbolsBtn', () => { if (confirm('Restaurar a lista padrão de atalhos?')) this.resetToDefault(); });
    on('sbxEditBtn', () => this.openEditModal());
    on('quickAddBtn', () => this.quickAddCurrentUrl());

    /* ≡ (#toggleBtn): segurar 600 ms abre a edição; o clique seguinte é engolido */
    const tog = $('#toggleBtn');
    if (tog){
      let lp = null, fired = false;
      tog.addEventListener('pointerdown', () => { fired = false; lp = setTimeout(() => { fired = true; this.openEditModal(); try{ navigator.vibrate && navigator.vibrate(12); }catch(e){} }, 600); });
      ['pointerup', 'pointerleave', 'pointercancel'].forEach(t => tog.addEventListener(t, () => clearTimeout(lp)));
      tog.addEventListener('click', e => { if (fired){ fired = false; e.preventDefault(); e.stopImmediatePropagation(); } }, true);
      tog.addEventListener('contextmenu', e => e.preventDefault());
    }

    /* atalhos que vieram do HTML: o seu motor abre; sem motor remoto, cai na nova aba */
    document.addEventListener('click', e => {
      const b = e.target.closest && e.target.closest('.symbol-button[data-sbx="native"]'); if (!b) return;
      const u = safeUrl(b.dataset.url); if (!u) return;
      this.lastUrl = u; LS.set('kob_last_url', u);
      if (remoteAlive()) return;
      const before = navSig(); setTimeout(() => { if (navSig() === before) window.open(u, '_blank', 'noopener'); }, 650);
    });
  }
};

/* ═══════════════ 3 · VIEWPORT (⊞) + PLAYER (📺) no toolbar do #symbolBar ═══════════════ */
const Viewport = {
  el(){ return $('#universe-viewport'); },
  visible(){ const v = this.el(); return !!v && v.style.display !== 'none'; },
  sync(){
    const b = $('#toggleViewportBtn'); if (!b) return;
    const vis = this.visible();
    b.textContent = vis ? '⊞' : '⊟'; b.setAttribute('aria-pressed', String(vis)); b.title = vis ? 'Ocultar viewport' : 'Mostrar viewport';
  },
  toggle(){ const v = this.el(); if (!v){ toast('Viewport não encontrado'); return; } v.style.display = this.visible() ? 'none' : ''; this.sync(); },
  init(){
    const b = $('#toggleViewportBtn'); if (b) b.addEventListener('click', e => { e.preventDefault(); e.stopPropagation(); this.toggle(); });
    /* 📺 leva data-player-url: com o motor remoto, a delegação dele já abre o Player. Só cobrimos a ausência dele. */
    const p = $('#sbxPlayerBtn');
    if (p) p.addEventListener('click', () => {
      if (remoteAlive()) return;
      const url = p.dataset.playerUrl, title = p.dataset.playerTitle || 'Player';
      try{ if (window.Player && typeof window.Player.play === 'function'){ window.Player.play(url, title); return; } }catch(err){ console.warn('[SBX] Player falhou', err); }
      window.open(url, '_blank', 'noopener');
    });
    this.sync();
  }
};

/* ═══════════════ 4 · DRAWER · só rede de segurança (o seu toggleDrawer manda) ═══════════════ */
const Drawer = {
  el(){ return $('#drawerProfile'); },
  isOpen(){ const d = this.el(); return !!(d && d.classList.contains('open')); },
  /* Só é usado se a base NÃO definir toggleDrawer (ex.: scripts remotos fora do ar). */
  fallbackToggle(id){
    const d = document.getElementById(id || 'drawerProfile'); if (!d) return;
    const open = !d.classList.contains('open');
    d.classList.toggle('open', open); d.setAttribute('aria-hidden', String(!open));
    const ov = $('#drawerOverlay'); if (ov) ov.classList.toggle('open', open);
  },
  close(){ if (this.isOpen() && typeof window.toggleDrawer === 'function') window.toggleDrawer('drawerProfile'); },
  late(){
    const d = this.el(); if (!d) return;
    let mine = false;
    if (typeof window.toggleDrawer !== 'function'){ window.toggleDrawer = id => Drawer.fallbackToggle(id); mine = true; }
    /* CSS da base não posicionou o drawer? liga o layout de reserva (html.sbx-fb). */
    if (getComputedStyle(d).position !== 'fixed') document.documentElement.classList.add('sbx-fb');
    /* gatilho: se ninguém respondeu ao 🔅 (sem motor remoto), abre pelo fallback */
    const trg = $('#orbToggle');
    if (trg && mine) trg.addEventListener('click', () => window.toggleDrawer('drawerProfile'));
  }
};

/* ═══════════════ 5 · COCKPIT · motores do drawer (cooperativos) ═══════════════ */
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
    if (!remoteAlive()){                       // com o motor remoto, o solar é dele
      if (this.auto) this.set(this.byTime(), true);
      else if (saved && this.MODES.indexOf(saved) >= 0 && saved !== this.mode()) this.set(saved, false);
    }
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
    panel.textContent = ''; panel.classList.add('sbx-bg-grid');
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
    Drawer.late();
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
  }
};

/* ═══════════════ 6 · ESC + boot ═══════════════ */
document.addEventListener('keydown', e => {
  if (e.key !== 'Escape') return;
  if (SymbolBar.isModalOpen()) SymbolBar.closeEditModal();
  else if (Drawer.isOpen()) Drawer.close();
});

function boot(){
  SymbolBar.init(); Viewport.init(); Cockpit.init();
  window.SymbolBar = window.SymbolBar || SymbolBar;
  window.KOBLLUX_UNI = { SymbolBar, Viewport, Drawer, Solar, BG, Backup, version: 'unified-3 · base kob_187' };
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true }); else boot();
window.addEventListener('load', () => setTimeout(() => {
  Cockpit.late();
  if (window.KOBLLUX && typeof window.KOBLLUX === 'object') { window.KOBLLUX.SymbolBar = window.KOBLLUX.SymbolBar || SymbolBar; window.KOBLLUX.Drawer = window.KOBLLUX.Drawer || Drawer; }
}, 350));
})();
