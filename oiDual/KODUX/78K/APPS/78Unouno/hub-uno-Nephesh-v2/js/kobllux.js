/* KOBLLUX — module JS for HUB UNO · CONVERGÊNCIA ∆³ v3.1.0
   Features:
   - modal UI injection on #btnKobllux click
   - 9 Potentials form
   - 6 Poles wheel interactive
   - 3 Layers selector
   - 7 Seals toggles
   - SHA-256 hash generation via SubtleCrypto
   - animations: wheel rotate, seals pulse
   - persist to localStorage (kobllux:config)
   - fires CustomEvents: 'kobllux:activated','kobllux:hash','kobllux:save'
   - CONVERGÊNCIA BAÚ LITE: salva em chaves classificáveis (seed:, guard:, pulse:, dim:, selar:)
   - Botão "Sincronizar Baú" abre BauliteKobllux.open()
   - Auto-detecta hash salvo ao abrir modal
*/

(function () {
  if (window.KOBLLUX) return; // already loaded
  const API = {};
  const LS_KEY = 'kobllux:config';

  // --- utilities ---
  function el(tag, attrs = {}, ...children) {
    const node = document.createElement(tag);
    for (const k in attrs) {
      if (k === 'class') node.className = attrs[k];
      else if (k === 'html') node.innerHTML = attrs[k];
      else node.setAttribute(k, attrs[k]);
    }
    children.forEach(c => { if (c === null || c === undefined) return; node.append(typeof c === 'string' ? document.createTextNode(c) : c); });
    return node;
  }

  function hexFromBuffer(buffer) {
    const bytes = new Uint8Array(buffer);
    return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
  }

  async function sha256hex(str) {
    const enc = new TextEncoder().encode(str);
    const hash = await crypto.subtle.digest('SHA-256', enc);
    return hexFromBuffer(hash);
  }

  function dispatch(name, detail = {}) {
    window.dispatchEvent(new CustomEvent(name, { detail }));
  }

  // default config
  const DEFAULT = {
    potentials: Array.from({ length: 9 }, (_, i) => ({ id: i + 1, name: `P${i + 1}`, weight: 1 })),
    poles: Array.from({ length: 6 }, (_, i) => ({ id: i, active: false })),
    layer: 'meso', // micro | meso | macro
    seals: Array.from({ length: 7 }, (_, i) => ({ id: i + 1, active: false })),
    meta: { created: Date.now(), name: 'kobllux-session' }
  };

  function loadConfig() {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (!raw) return JSON.parse(JSON.stringify(DEFAULT));
      return JSON.parse(raw);
    } catch (e) {
      return JSON.parse(JSON.stringify(DEFAULT));
    }
  }
function saveConfig(cfg) {
  try {
    cfg.meta = cfg.meta || {};
    cfg.meta.updated = Date.now();

    // 0x00 BOOT — config principal
    localStorage.setItem('kobllux:config', JSON.stringify(cfg));

    // 0x01 DELTA — camada dimensional
    localStorage.setItem('dim:kobllux_layer', cfg.layer || 'meso');

    // 0x02 SEED — potenciais individuais
    if (cfg.potentials) {
      cfg.potentials.forEach((p, i) => {
        localStorage.setItem(`seed:kobllux_p${i+1}`, JSON.stringify(p));
      });
    }

    // 0x0B PULSE — estado dos polos
    if (cfg.poles) {
      localStorage.setItem('pulse:kobllux_poles', JSON.stringify(cfg.poles));
    }

    // 0x05 SELAR — selos ativos
    if (cfg.seals) {
      localStorage.setItem('selar:kobllux_seals', JSON.stringify(cfg.seals));
    }

    // 0x09 GUARD — hash mais recente
    if (cfg.meta.lastHash) {
      localStorage.setItem('guard:kobllux_hash_latest', cfg.meta.lastHash);
    }

    dispatch('kobllux:save', { config: cfg });
    return true;
  } catch (e) {
    console.error('[KOBLLUX] Falha ao salvar:', e);
    return false;
  }
}


  // --- UI creation ---
  function createModal() {
    const modal = el('div', { class: 'kob-modal', id: 'kob-modal' });
    const panel = el('div', { class: 'kob-panel' });

    // header
    const header = el('div', { class: 'kob-header' },
      el('h3', {}, 'KOBLLUX • Ativar'),
      el('div', { class: 'kob-chip' }, '9 Potenciais · 6 Polos · 3 Camadas · ∆7')
    );
    const closeBtn = el('button', { class: 'kob-close', title: 'Fechar' }, '✕');
    closeBtn.addEventListener('click', () => closeModal());
    header.appendChild(closeBtn);

    // grid
    const grid = el('div', { class: 'kob-grid' });
    const left = el('div', { class: 'kob-left' });
    const right = el('div', { class: 'kob-right' });

    // Left: wheel + seals
    const wheelWrap = el('div', { class: 'kob-wheel-wrap' });
    const wheel = el('div', { class: 'kob-wheel', id: 'kob-wheel' });
    const hub = el('div', { class: 'kob-hub' }, 'KOB');
    wheel.appendChild(hub);

    // add six poles
    for (let i = 0; i < 6; i++) {
      const p = el('div', { class: `kob-pole p${i}`, 'data-pole': i },
        el('div', { class: 'label' }, `P${i + 1}`)
      );
      p.addEventListener('click', (ev) => {
        ev.stopPropagation();
        togglePole(i, p);
      });
      wheel.appendChild(p);
    }

    const sealsWrap = el('div', { class: 'kob-seals', id: 'kob-seals' });
    for (let i = 0; i < 7; i++) {
      const s = el('div', { class: 'kob-seal', 'data-seal': i + 1 }, `${i + 1}`);
      s.addEventListener('click', () => toggleSeal(i + 1, s));
      sealsWrap.appendChild(s);
    }

    wheelWrap.appendChild(wheel);
    left.appendChild(wheelWrap);
    left.appendChild(sealsWrap);

    // Right: potentials, layers, controls
    const potSection = el('div', { class: 'kob-section' },
      el('h4', {}, '9 Potenciais'),
      el('div', { class: 'kob-potentials', id: 'kob-potentials' })
    );

    // build 9 potentials inputs
    for (let i = 0; i < 9; i++) {
      const input = el('div', { class: 'kob-potential' },
        el('input', { type: 'text', placeholder: `Potencial ${i + 1}`, 'data-pot-index': i }),
        el('input', { type: 'number', min: '0', value: '1', 'data-pot-w': i, style: 'width:72px;padding:8px;border-radius:8px;border:1px solid rgba(255,255,255,0.06);background:transparent;color:inherit' })
      );
      potSection.querySelector('.kob-potentials')?.appendChild(input);
    }

    const layerSection = el('div', { class: 'kob-section' },
      el('h4', {}, 'Camadas'),
      el('div', { class: 'kob-row' },
        el('label', {}, el('input', { type: 'radio', name: 'kob-layer', value: 'micro' }), ' Micro'),
        el('label', {}, el('input', { type: 'radio', name: 'kob-layer', value: 'meso', checked: true }), ' Meso'),
        el('label', {}, el('input', { type: 'radio', name: 'kob-layer', value: 'macro' }), ' Macro')
      )
    );

    const controlSection = el('div', { class: 'kob-section' },
      el('h4', {}, 'Ações'),
      el('div', { class: 'kob-controls' },
        el('button', { class: 'kob-btn primary', id: 'kob-genhash' }, 'Gerar Hash SHA-256'),
        el('button', { class: 'kob-btn', id: 'kob-animate' }, 'Animar'),
        el('button', { class: 'kob-btn', id: 'kob-save' }, 'Salvar'),
        el('button', { class: 'kob-btn', id: 'kob-export' }, 'Exportar JSON'),
        el('button', { class: 'kob-btn', id: 'kob-copyhash' }, 'Copiar Hash'),
        el('button', { class: 'kob-btn', id: 'kob-sync-baulite' }, '⟲ Sincronizar Baú')
      ),
      el('div', { style: 'margin-top:8px' },
        el('div', { class: 'mut' }, 'Hash (SHA-256):'),
        el('div', { class: 'kob-hash', id: 'kob-hash' }, '')
      )
    );

    right.appendChild(potSection);
    right.appendChild(layerSection);
    right.appendChild(controlSection);

    // append to grid & panel
    grid.appendChild(left);
    grid.appendChild(right);
    panel.appendChild(header);
    panel.appendChild(grid);

    modal.appendChild(panel);
    document.body.appendChild(modal);

    // wire events after DOM add
    document.getElementById('kob-genhash').addEventListener('click', onGenHash);
    document.getElementById('kob-animate').addEventListener('click', animateAll);
    document.getElementById('kob-save').addEventListener('click', () => {
      const cfg = collectConfig();
      saveConfig(cfg);
      toast('KOBLLUX salvo localmente');
    });
    document.getElementById('kob-export').addEventListener('click', () => {
      const cfg = collectConfig();
      const blob = new Blob([JSON.stringify(cfg, null, 2)], { type: 'application/json' });
      const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'kobllux-config.json'; a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 400);
    });
    document.getElementById('kob-copyhash').addEventListener('click', () => {
      const h = document.getElementById('kob-hash').textContent || '';
      if (!h) return toast('Nada para copiar', 'warn');
      navigator.clipboard?.writeText(h).then(() => toast('Hash copiado'), () => toast('Falha ao copiar', 'err'));
    });

    // ═══ CONVERGÊNCIA BAÚ LITE ═══
    document.getElementById('kob-sync-baulite').addEventListener('click', () => {
      if (window.BauliteKobllux && window.BauliteKobllux.open) {
        window.BauliteKobllux.open();
        toast('Baú Lite aberto · ∆³ sincronizado');
      } else {
        toast('Baú Lite não detectado', 'warn');
      }
    });

    // close on background click
    modal.addEventListener('click', (ev) => {
      if (ev.target === modal) closeModal();
    });

    // expose
    return { modal, panel };
  }

  // --- UI helpers & state sync ---
  const state = loadConfig();
  let modalInstance = null;

  function openModal() {
    if (!modalInstance) modalInstance = createModal();
    modalInstance.modal.classList.add('open');
    populateUIFromState();
    dispatch('kobllux:activated', { config: state });
  }
  function closeModal() {
    if (!modalInstance) return;
    modalInstance.modal.classList.remove('open');
  }

  function toast(msg, type = 'ok') {
    // minimal transient toast near bottom-right
    const box = document.createElement('div');
    box.textContent = msg;
    box.style.cssText = 'position:fixed;right:20px;bottom:90px;background:linear-gradient(90deg,#1b2a2a,#123c2e);color:#f5f7ff;padding:8px 12px;border-radius:8px;box-shadow:0 8px 20px rgba(0,0,0,0.5);z-index:2147483660;font-weight:800';
    document.body.appendChild(box);
    setTimeout(() => { box.style.opacity = '0'; box.style.transform = 'translateY(8px)'; setTimeout(() => box.remove(), 300); }, 1800);
  }

  function populateUIFromState() {
    const cfg = state;
    // potentials
    const potInputs = document.querySelectorAll('[data-pot-index]');
    potInputs.forEach((wrapper) => {
      const idx = Number(wrapper.querySelector('[data-pot-index]')?.getAttribute('data-pot-index') ?? wrapper.getAttribute('data-pot-index'));
      // wrapper structure: input text + input number
      const text = wrapper.querySelector('input[type="text"]');
      const num = wrapper.querySelector('input[type="number"]');
      if (cfg.potentials[idx]) {
        text.value = cfg.potentials[idx].name || `P${idx + 1}`;
        num.value = Number(cfg.potentials[idx].weight || 1);
      } else {
        text.value = `P${idx + 1}`;
        num.value = 1;
      }
    });
    // poles
    cfg.poles.forEach((p, i) => {
      const el = document.querySelector(`.kob-pole.p${i}`);
      if (el) el.classList.toggle('on', !!p.active);
    });
    // seals
    cfg.seals.forEach(s => {
      const el = document.querySelector(`.kob-seal[data-seal="${s.id}"]`);
      if (el) el.classList.toggle('on', !!s.active);
    });
    // layer
    const radios = document.querySelectorAll('input[name="kob-layer"]');
    radios.forEach(r => { r.checked = (r.value === (cfg.layer || 'meso')); r.addEventListener('change', () => { if (r.checked) state.layer = r.value; }); });

    // ═══ CARREGA HASH DO BAÚ SE EXISTIR ═══
    const savedHash = cfg.meta?.lastHash || localStorage.getItem('guard:kobllux_hash_latest');
    if (savedHash) {
      const hashEl = document.getElementById('kob-hash');
      if (hashEl) hashEl.textContent = savedHash;
    }
  }

  function collectConfig() {
    const newCfg = JSON.parse(JSON.stringify(state));
    // potentials
    const potWrappers = document.querySelectorAll('.kob-potential');
    const pots = [];
    potWrappers.forEach((wrap, i) => {
      const txt = wrap.querySelector('input[type="text"]')?.value || `P${i + 1}`;
      const w = Number(wrap.querySelector('input[type="number"]')?.value || 1);
      pots.push({ id: i + 1, name: txt, weight: w });
    });
    newCfg.potentials = pots;
    // poles
    const poles = [];
    for (let i = 0; i < 6; i++) {
      const el = document.querySelector(`.kob-pole.p${i}`);
      poles.push({ id: i, active: !!el && el.classList.contains('on') });
    }
    newCfg.poles = poles;
    // seals
    const seals = [];
    for (let i = 1; i <= 7; i++) {
      const el = document.querySelector(`.kob-seal[data-seal="${i}"]`);
      seals.push({ id: i, active: !!el && el.classList.contains('on') });
    }
    newCfg.seals = seals;
    // layer
    const rad = document.querySelector('input[name="kob-layer"]:checked');
    newCfg.layer = rad ? rad.value : 'meso';
    newCfg.meta = newCfg.meta || {};
    newCfg.meta.generated = Date.now();
    return newCfg;
  }

  // toggle helpers
  function togglePole(index, el) {
    el.classList.toggle('on');
    state.poles[index].active = el.classList.contains('on');
    saveConfig(state);
  }
  function toggleSeal(id, el) {
    el.classList.toggle('on');
    const s = state.seals.find(x => x.id === id);
    if (s) s.active = el.classList.contains('on');
    saveConfig(state);
  }

  // Generate hash from canonical serialization (stable order)
async function onGenHash() {
  const cfg = collectConfig();
  const canonical = JSON.stringify({
    potentials: cfg.potentials.map(p => ({ id: p.id, name: p.name, weight: Number(p.weight) })),
    poles: cfg.poles.map(p => ({ id: p.id, active: !!p.active })),
    seals: cfg.seals.map(s => ({ id: s.id, active: !!s.active })),
    layer: cfg.layer,
    meta: { name: cfg.meta?.name || '', timestamp: Date.now() }
  });
  const h = await sha256hex(canonical);
  document.getElementById('kob-hash').textContent = h;

  // ═══ CONVERGÊNCIA BAÚ LITE ═══
  const ts = new Date().toISOString().slice(0,19).replace(/[:T]/g,'-');
  localStorage.setItem('guard:kobllux_hash_' + ts, h);
  localStorage.setItem('selar:kobllux_canonical_' + ts, canonical);
  cfg.meta = cfg.meta || {};
  cfg.meta.lastHash = h;
  cfg.meta.version = (cfg.meta.version || 0) + 1;
  saveConfig(cfg); // dispara kobllux:save → Baú Lite escuta

  // Visual feedback
  const seals = document.querySelectorAll('.kob-seal.on');
  seals.forEach(s => { s.classList.add('pulse'); setTimeout(() => s.classList.remove('pulse'), 2300); });
  const wheel = document.getElementById('kob-wheel');
  wheel && wheel.classList.add('rotating');
  setTimeout(() => wheel && wheel.classList.remove('rotating'), 2400);

  dispatch('kobllux:hash', { hash: h, canonical, timestamp: ts });
  toast('Hash selado no Baú · AMÉM ∆⁷');
  return h;
}
  function animateAll() {
    const wheel = document.getElementById('kob-wheel');
    if (wheel) {
      wheel.classList.add('rotating');
      setTimeout(() => wheel.classList.remove('rotating'), 5000);
    }
    const seals = document.querySelectorAll('.kob-seal.on');
    seals.forEach((s, i) => {
      setTimeout(() => { s.classList.add('pulse'); setTimeout(()=> s.classList.remove('pulse'), 2200); }, i * 120);
    });
    toast('Animação iniciada');
  }

  // initial injection: add button binding
  function wireButton() {
    const btn = document.getElementById('btnKobllux');
    if (!btn) return;
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal();
    });
  }

  // expose a minimal API for programmatic access
  API.open = openModal;
  API.close = closeModal;
  API.getConfig = () => loadConfig();
  API.setConfig = (cfg) => { Object.assign(state, cfg); saveConfig(state); populateUIFromState(); };
  API.generateHash = onGenHash;

  // Kick off
  document.addEventListener('DOMContentLoaded', () => {
    // ensure state from storage
    const s = loadConfig();
    Object.assign(state, s);
    wireButton();
  });

  window.KOBLLUX = API;

})();