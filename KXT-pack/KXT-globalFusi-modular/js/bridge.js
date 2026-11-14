(() => {
  if (window.__KXT_FINAL_BRIDGE__) return;
  window.__KXT_FINAL_BRIDGE__ = true;

  const LS = localStorage;
  const $ = (id) => document.getElementById(id);
  const DEFAULT_MODEL = 'arcee-ai/trinity-mini:free';
  const log = (...a) => console.log('[KXT]', ...a);

  // `let STATE` do card não vira window.STATE — expõe pra quem precisar
  try { Object.defineProperty(window, 'STATE', { get: () => STATE, configurable: true }); } catch (e) {}

  /* ───────────────────────── Drawers (menu único: Cockpit) ───────────────────────── */
  const syncDrawerFlag = () => document.body.classList.toggle('has-drawer', !!document.querySelector('.drawer.open'));
  const _toggle = window.toggleDrawer;
  window.toggleDrawer = function (id) {
    if (typeof _toggle === 'function') _toggle(id); else $(id).classList.toggle('open');
    syncDrawerFlag();
  };
  document.querySelectorAll('.drawer').forEach((d) => {
    d.addEventListener('click', (e) => { if (e.target === d) { d.classList.remove('open'); syncDrawerFlag(); } }); // toque no fundo fecha
    new MutationObserver(syncDrawerFlag).observe(d, { attributes: true, attributeFilter: ['class'] });
  });

  const SECS = ['solar', 'neural', 'usage', 'id', 'bg', 'sys'];
  const secEl = (s) => document.querySelector(`#drawerProfile section.cockpit-sec[data-sec="${s}"]`);
  function markNav(sec) {
    document.querySelectorAll('#cockpitNav button').forEach((b) => b.classList.toggle('active', b.dataset.sec === sec));
  }
  function scrollToSection(sec) {
    const el = secEl(sec), body = $('cockpitBody');
    if (!el || !body) return;
    const top = el.getBoundingClientRect().top - body.getBoundingClientRect().top + body.scrollTop - 4;
    body.scrollTo({ top, behavior: 'smooth' });
    markNav(sec);
    el.classList.remove('flash'); void el.offsetWidth; el.classList.add('flash');
  }
  window.openCockpit = function (sec) {
    const d = $('drawerProfile'); if (!d) return;
    d.classList.add('open'); syncDrawerFlag();
    if (sec) setTimeout(() => scrollToSection(sec), 200);
  };
  window.scrollCockpit = scrollToSection;

  document.querySelectorAll('#cockpitNav button').forEach((b) => b.addEventListener('click', () => scrollToSection(b.dataset.sec)));
  $('cockpitBody')?.addEventListener('scroll', () => {
    const body = $('cockpitBody'), bt = body.getBoundingClientRect().top;
    let cur = SECS[0];
    SECS.forEach((s) => { const el = secEl(s); if (el && el.getBoundingClientRect().top - bt <= 40) cur = s; });
    markNav(cur);
  }, { passive: true });

  /* ───────────────────────── Persistência (fonte única = localStorage) ───────────────────────── */
  const saveRole = (v) => { LS.setItem('di_trainingText', v); LS.setItem('di_systemRole', v); };
  const loadRole = () => { const a = LS.getItem('di_trainingText'); return a !== null ? a : LS.getItem('di_systemRole'); };

  function ensureOption(sel, m) {
    if (!sel || !m) return;
    if (![...sel.options].some((o) => o.value === m)) {
      const o = document.createElement('option'); o.value = m; o.textContent = m;
      sel.insertBefore(o, sel.firstChild);
    }
  }

  function setModel(id, opts) {
    if (!id) return;
    LS.setItem('di_modelName', id);
    const inp = $('inputModel'); if (inp && inp.value !== id) inp.value = id;
    const sel = $('modelSelect'); if (sel) { ensureOption(sel, id); sel.value = id; }
    try { modelName = id; } catch (e) {}
    document.querySelectorAll('.model-item').forEach((el) => el.classList.toggle('active', el.dataset.id === id));
    log('[MODEL]', id);
    if (!(opts && opts.silent) && typeof window.showToaster === 'function') window.showToaster('Modelo: ' + id, 'success');
  }

  function syncAll() {
    const key = LS.getItem('di_apiKey') || '';
    ['apiKeyInput', 'apiKeyInputNeural'].forEach((id) => { const e = $(id); if (e && document.activeElement !== e && e.value !== key) e.value = key; });

    const model = LS.getItem('di_modelName') || DEFAULT_MODEL;
    const sel = $('modelSelect'), inp = $('inputModel');
    ensureOption(sel, model);
    if (sel && document.activeElement !== sel) sel.value = model;
    if (inp && document.activeElement !== inp) inp.value = model;

    const inf = LS.getItem('di_infodoseName') || 'KOBLLUX';
    ['infodoseNameInput', 'cockpitInfodoseName'].forEach((id) => { const e = $(id); if (e && document.activeElement !== e && e.value !== inf) e.value = inf; });

    const role = loadRole();
    if (role !== null) ['systemRoleInput', 'systemRoleInputNeural'].forEach((id) => { const e = $(id); if (e && document.activeElement !== e && e.value !== role) e.value = role; });

    const seal = $('kxtSealToggle'), kod = $('kxtKoduxToggle');
    if (seal) seal.checked = LS.getItem('di_kobSeal') !== '0';
    if (kod) kod.checked = LS.getItem('di_kodux') !== '0';
  }

  window.di_saveNeural = function () {
    const key = (($('apiKeyInput') && $('apiKeyInput').value) || ($('apiKeyInputNeural') && $('apiKeyInputNeural').value) || '').trim();
    if (typeof window.di_setApiKey === 'function') window.di_setApiKey(key); else LS.setItem('di_apiKey', key);
    const roleEl = $('systemRoleInput'); if (roleEl) saveRole(roleEl.value);
    const inf = (($('cockpitInfodoseName') && $('cockpitInfodoseName').value) || ($('infodoseNameInput') && $('infodoseNameInput').value) || 'KOBLLUX').trim() || 'KOBLLUX';
    LS.setItem('di_infodoseName', inf); try { infodoseName = inf; } catch (e) {}
    const m = ($('inputModel') && $('inputModel').value || '').trim(); if (m) setModel(m, { silent: true });
    syncAll();
    log('[CONFIG] salvo', { hasKey: !!LS.getItem('di_apiKey'), model: LS.getItem('di_modelName'), infodose: inf, roleChars: (LS.getItem('di_trainingText') || '').length });
  };

  /* ───────────────────────── Espelhos card ⇄ cockpit ───────────────────────── */
  function mirror(aId, bId, onChange) {
    const a = $(aId), b = $(bId); if (!a || !b) return;
    a.addEventListener('input', () => { if (b.value !== a.value) b.value = a.value; });
    b.addEventListener('input', () => { if (a.value !== b.value) a.value = b.value; });
    if (onChange) [a, b].forEach((el) => { el.addEventListener('change', () => onChange(el.value)); el.addEventListener('blur', () => onChange(el.value)); });
  }
  mirror('apiKeyInput', 'apiKeyInputNeural');                       // SK (persistência: di_setApiKey do card no change/blur)
  mirror('systemRoleInput', 'systemRoleInputNeural', saveRole);     // system role
  mirror('infodoseNameInput', 'cockpitInfodoseName', (v) => { LS.setItem('di_infodoseName', v.trim() || 'KOBLLUX'); try { infodoseName = v.trim() || 'KOBLLUX'; } catch (e) {} });

  $('btnToggleKey')?.addEventListener('click', () => {
    const show = $('apiKeyInput').type === 'password';
    ['apiKeyInput', 'apiKeyInputNeural'].forEach((id) => { const e = $(id); if (e) e.type = show ? 'text' : 'password'; });
  });
  $('saveSystemBtn')?.addEventListener('click', () => { const r = $('systemRoleInputNeural'); if (r) saveRole(r.value); setTimeout(syncAll, 40); });
  $('addKeyBtn')?.addEventListener('click', () => setTimeout(syncAll, 40));
  $('vaultUnlockBtn')?.addEventListener('click', () => setTimeout(syncAll, 400));
  ['setActiveKey', 'removeKey'].forEach((fn) => {
    const orig = window[fn];
    if (typeof orig === 'function' && !orig.__kxt) {
      window[fn] = function () { const r = orig.apply(this, arguments); setTimeout(syncAll, 40); return r; };
      window[fn].__kxt = true;
    }
  });

  $('modelSelect')?.addEventListener('change', (e) => setModel(e.target.value));
  $('inputModel')?.addEventListener('change', (e) => setModel(e.target.value.trim()));

  $('kxtSealToggle')?.addEventListener('change', (e) => LS.setItem('di_kobSeal', e.target.checked ? '1' : '0'));
  $('kxtKoduxToggle')?.addEventListener('change', (e) => LS.setItem('di_kodux', e.target.checked ? '1' : '0'));
  $('cssUploadInput')?.addEventListener('change', async (e) => { const f = e.target.files[0]; if (f) $('customCssInput').value = await f.text(); });

  /* ───────────────────────── Busca de modelos OpenRouter (card + cockpit) ───────────────────────── */
  const OR = { list: null, loading: null };
  const CACHE_KEY = 'di_orModelsCache', TTL = 6 * 3600e3;
  const UIS = [
    { q: 'modelSearchCard', free: 'modelFreeOnlyCard', res: 'modelResultsCard', st: 'modelSearchStatusCard' },
    { q: 'modelSearchCockpit', free: 'modelFreeOnlyCockpit', res: 'modelResultsCockpit', st: 'modelSearchStatusCockpit' }
  ];
  const setStatus = (t) => UIS.forEach((u) => { const e = $(u.st); if (e) e.textContent = t; });

  const norm = (m) => {
    const p = m.pricing || {}; const pp = Number(p.prompt), pc = Number(p.completion);
    const free = /:free$/i.test(m.id) || (pp === 0 && pc === 0);
    return { id: m.id, name: m.name || m.id, ctx: m.context_length || 0, free, price: free ? 0 : (pp || 0) * 1e6, priceOut: free ? 0 : (pc || 0) * 1e6 };
  };

  async function loadCatalog(force) {
    if (OR.list && !force) return OR.list;
    if (!force) {
      try { const c = JSON.parse(LS.getItem(CACHE_KEY) || 'null'); if (c && c.v === 2 && Date.now() - c.ts < TTL && c.list && c.list.length) { OR.list = c.list; return OR.list; } } catch (e) {}
    }
    if (OR.loading) return OR.loading;
    setStatus('Consultando catálogo do OpenRouter…');
    OR.loading = (async () => {
      try {
        const r = await fetch('https://openrouter.ai/api/v1/models', { headers: { Accept: 'application/json' } });
        if (!r.ok) throw new Error('HTTP ' + r.status);
        const j = await r.json();
        const list = (j.data || []).map(norm).sort((a, b) => a.name.localeCompare(b.name));
        OR.list = list;
        try { LS.setItem(CACHE_KEY, JSON.stringify({ v: 2, ts: Date.now(), list })); } catch (e) {}
        return list;
      } catch (e) {
        setStatus('Não foi possível carregar agora: ' + e.message);
        console.warn('[OpenRouter]', e);
        return [];
      } finally { OR.loading = null; }
    })();
    return OR.loading;
  }

  function searchModels(q, freeOnly) {
    const toks = String(q || '').toLowerCase().split(/\s+/).filter(Boolean);
    const arr = (OR.list || []).filter((m) => (!freeOnly || m.free) && toks.every((t) => (m.id + ' ' + m.name).toLowerCase().includes(t)));
    arr.sort((a, b) => {
      const as = toks[0] && a.name.toLowerCase().startsWith(toks[0]) ? 0 : 1, bs = toks[0] && b.name.toLowerCase().startsWith(toks[0]) ? 0 : 1;
      return (as - bs) || ((b.free ? 1 : 0) - (a.free ? 1 : 0)) || a.name.localeCompare(b.name);
    });
    return arr;
  }

  function renderResults(u, q, freeOnly) {
    const box = $(u.res); if (!box) return;
    const all = searchModels(q, freeOnly), shown = all.slice(0, 40), cur = LS.getItem('di_modelName') || '';
    box.innerHTML = '';
    shown.forEach((m) => {
      const it = document.createElement('div');
      it.className = 'model-item' + (m.id === cur ? ' active' : ''); it.dataset.id = m.id;
      const left = document.createElement('span'); left.className = 'mi-name';
      left.textContent = m.name; const sm = document.createElement('small'); sm.textContent = m.id + (m.ctx ? ' · ' + Math.round(m.ctx / 1000) + 'k ctx' : ''); left.appendChild(sm);
      const tag = document.createElement('span'); tag.className = 'mi-tag' + (m.free ? ' free' : ''); tag.textContent = m.free ? 'FREE' : '$' + m.price.toFixed(2) + '/M';
      it.append(left, tag);
      it.addEventListener('click', () => { setModel(m.id); });
      box.appendChild(it);
    });
    if (!shown.length) { const e = document.createElement('div'); e.className = 'model-empty'; e.textContent = 'Nenhum modelo encontrado.'; box.appendChild(e); }
    box.classList.add('show');
    const st = $(u.st); if (st) st.textContent = `${all.length} modelo(s)${all.length > 40 ? ' · mostrando 40' : ''} de ${OR.list ? OR.list.length : 0} no catálogo`;
  }

  async function runSearch(srcUi) {
    const qEl = $(srcUi.q), fEl = $(srcUi.free);
    const q = qEl ? qEl.value : '', freeOnly = fEl ? fEl.checked : true;
    UIS.forEach((u) => { if (u !== srcUi) { const oq = $(u.q), of = $(u.free); if (oq && oq.value !== q) oq.value = q; if (of) of.checked = freeOnly; } });
    await loadCatalog(false);
    if (!OR.list || !OR.list.length) return;
    UIS.forEach((u) => renderResults(u, q, freeOnly));
  }

  UIS.forEach((u) => {
    const qEl = $(u.q), fEl = $(u.free);
    let t = null;
    if (qEl) {
      qEl.addEventListener('focus', () => runSearch(u));
      qEl.addEventListener('input', () => { clearTimeout(t); t = setTimeout(() => runSearch(u), 160); });
    }
    if (fEl) fEl.addEventListener('change', () => runSearch(u));
  });
  window.di_loadOpenRouterFreeModels = async function () {
    const list = await loadCatalog(true);
    if (list.length) { const u = UIS[1]; await runSearch(u); }
    return list.filter((m) => m.free).length;
  };

  /* ───────────────────────── TTS → orbs "falando" ───────────────────────── */
  (function hookOrbSpeaking() {
    const mark = (on) => document.querySelectorAll('.dual-orb-wrap').forEach((el) => el.classList.toggle('speaking', on));
    const ss = window.speechSynthesis;
    if (!ss || ss.__kxtHooked) return;
    const orig = ss.speak.bind(ss);
    ss.speak = (utt) => { mark(true); utt.onend = utt.onerror = () => mark(false); orig(utt); };
    ss.__kxtHooked = true;
  })();

  /* ───────────────────────── Migração do background antigo (IndexedDB v5 → thumbs) ───────────────────────── */
  async function migrateLegacyBg() {
    try {
      if (!window.di_getBgImages || di_getBgImages().length) return;
      if (!window.App || !App.indexedDB) return;
      const d = await App.indexedDB.getAsset('di_bgImage');
      if (!d || !d.blob) return;
      const data = await di_fileToDataUrl(d.blob);
      if (data && di_saveBgImages([{ id: 'bg_legacy', name: 'background-v5', data, active: true }])) { di_applyBackground(data); di_renderBgPanel(); log('[BG] background do v5 migrado'); }
    } catch (e) { console.warn('[BG] migração ignorada', e); }
  }

  /* ───────────────────────── Blobs: intensidade ajustável ───────────────────────── */
  function initBlobs() {
    const sl = $('blobOp'), out = $('blobOpVal');
    const saved = LS.getItem('di_blobOp');
    const v = saved === null ? 12 : Math.max(0, Math.min(40, Number(saved) || 0));
    const apply = (n) => { document.documentElement.style.setProperty('--blob-op', String(n / 100)); if (out) out.textContent = n + '%'; };
    apply(v); if (sl) sl.value = v;
    if (sl) sl.addEventListener('input', () => { apply(Number(sl.value)); LS.setItem('di_blobOp', sl.value); });
  }
  initBlobs();

  /* ───────────────────────── Boot ───────────────────────── */
  KXT_ready(() => {
    setTimeout(syncAll, 60); setTimeout(syncAll, 450); setTimeout(migrateLegacyBg, 600);
    setTimeout(() => log('[KXT FINAL] pronto', { user: LS.getItem('di_userName'), hasKey: !!LS.getItem('di_apiKey'), model: LS.getItem('di_modelName') || DEFAULT_MODEL }), 700);
  });
})();
