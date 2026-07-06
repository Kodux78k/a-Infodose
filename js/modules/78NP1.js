(function(){
  const fallbackArchetypes = [
    {
      id: 'kobllux',
      name: 'KOBLLUX',
      tone: 'Núcleo do sistema, oracular',
      modulation: 'Grave-médio, presença de comando, ritmo estável.',
      voice: 'Luciana',
      lang: 'pt-BR',
      rate: 0.98,
      pitch: 0.48,
      color: '#22D3EE',
      theme: {
        primary: '#22D3EE',
        secondary: '#7dd3fc',
        bgSoft: 'radial-gradient(circle at 30% 20%, rgba(34,211,238,.08), transparent)',
        glow: '0 0 18px rgba(34,211,238,.55)'
      }
    }
  ];
  const ARCHETYPES = Array.isArray(window.ARCHETYPES) && window.ARCHETYPES.length ? window.ARCHETYPES : fallbackArchetypes;
  window.ARCHETYPES = ARCHETYPES;
  window.KOBLLUX_VOICES = ARCHETYPES.reduce((acc, a) => {
    acc[String(a.name || a.id || '').toLowerCase()] = a;
    acc[String(a.id || '').toLowerCase()] = a;
    return acc;
  }, window.KOBLLUX_VOICES || {});
  const els = {
    voiceSelect: document.getElementById('voiceSelect'),
    rateRange: document.getElementById('rateRange'),
    rateOut: document.getElementById('rateOut'),
    pitchRange: document.getElementById('pitchRange'),
    pitchOut: document.getElementById('pitchOut'),
    voiceCount: document.getElementById('voiceCount'),
    archSelect: document.getElementById('archSelect'),
    archStatus: document.getElementById('archStatus'),
    archUserBadge: document.getElementById('archUserBadge'),
    saveArchBtn: document.getElementById('saveArchBtn'),
    exportArchBtn: document.getElementById('exportArchBtn')
  };
  const ARCH_KEY = 'nebula.arch.v1';
  const safeUserName = (name) => {
    const v = String(name || localStorage.getItem('di_userName') || window.di_userName || 'Convidado').trim();
    return v || 'Convidado';
  };
  const normalize = (v) => String(v || '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '_')
    .replace(/[^a-z0-9_\-]/g, '');
  const storageKeyForUser = (userName) => `${ARCH_KEY}:${normalize(userName) || 'convidado'}`;
  const readSavedArch = (userName) => {
    try {
      const raw = localStorage.getItem(storageKeyForUser(userName));
      return raw ? JSON.parse(raw) : null;
    } catch (err) {
      console.warn('[ARCH] leitura falhou', err);
      return null;
    }
  };
  const writeSavedArch = (userName, payload) => {
    localStorage.setItem(storageKeyForUser(userName), JSON.stringify(payload));
    localStorage.setItem('nebula.arch.last', JSON.stringify(payload));
    window.dispatchEvent(new CustomEvent('KOBLLUX_ARCH_SAVED', { detail: payload }));
  };
  const resolveArch = (userName) => {
    const saved = readSavedArch(userName);
    if (saved?.arch?.id) {
      const match = ARCHETYPES.find(a => normalize(a.id) === normalize(saved.arch.id) || normalize(a.name) === normalize(saved.arch.id));
      if (match) return { ...match, ...saved.arch };
    }
    const direct = ARCHETYPES.find(a => normalize(a.id) === normalize(userName) || normalize(a.name) === normalize(userName));
    if (direct) return direct;
    return ARCHETYPES[0] || {
      id: normalize(userName) || 'custom',
      name: String(userName || 'Custom').toUpperCase(),
      voice: '',
      lang: '',
      rate: 1.01,
      pitch: 0.871,
    };
  };
  const getPlaybackState = () => ({
    voice: els.voiceSelect?.value || '',
    rate: +(els.rateRange?.value || 1),
    pitch: +(els.pitchRange?.value || 1)
  });
  const applyArchToPlayback = (arch, { persist = false } = {}) => {
    if (!arch) return;
    if (els.archSelect && arch.id) els.archSelect.value = arch.id;
    if (els.archUserBadge) els.archUserBadge.textContent = `user: ${safeUserName()}`;
    if (els.archStatus) {
      els.archStatus.textContent = `${arch.name || arch.id} · id: ${arch.id} · voice: ${arch.voice || '—'}`;
    }
    const voiceName = arch.voice || '';
    if (voiceName && els.voiceSelect) {
      const opt = [...els.voiceSelect.options].find(o => String(o.value).toLowerCase() === String(voiceName).toLowerCase());
      if (opt) els.voiceSelect.value = opt.value;
    }
    if (typeof arch.rate === 'number' && els.rateRange) {
      els.rateRange.value = String(arch.rate);
      if (els.rateOut) els.rateOut.textContent = `${Number(arch.rate).toFixed(1)}×`;
    }
    if (typeof arch.pitch === 'number' && els.pitchRange) {
      els.pitchRange.value = String(arch.pitch);
      if (els.pitchOut) els.pitchOut.textContent = Number(arch.pitch).toFixed(2);
    }
    if (persist) {
      saveCurrentArch();
    }
  };
  const populateArchOptions = () => {
    if (!els.archSelect || els.archSelect.options.length) return;
    ARCHETYPES.forEach(a => {
      const opt = document.createElement('option');
      opt.value = String(a.id || a.name || '');
      opt.textContent = a.name || a.id || '—';
      els.archSelect.appendChild(opt);
    });
  };
  const refreshArchStatus = () => {
    const userName = safeUserName();
    const currentArch = resolveArch(userName);
    if (els.archUserBadge) els.archUserBadge.textContent = `user: ${userName}`;
    if (els.archSelect && ARCHETYPES.length) {
      populateArchOptions();
      els.archSelect.value = currentArch.id;
    }
    if (els.archStatus) {
      const saved = readSavedArch(userName);
      els.archStatus.textContent = saved
        ? `Salvo em ${userName} · ${saved.arch?.name || saved.arch?.id || '—'} (${saved.arch?.id || '—'})`
        : `Ativo para ${userName} · ${currentArch.name || currentArch.id}`;
    }
    return currentArch;
  };
  const saveCurrentArch = () => {
    const userName = safeUserName();
    const archId = els.archSelect?.value || resolveArch(userName).id;
    const arch = ARCHETYPES.find(a => String(a.id) === String(archId)) || resolveArch(userName);
    const playback = getPlaybackState();
    const payload = {
      userName,
      archId: arch.id,
      savedAt: new Date().toISOString(),
      arch: {
        ...arch,
        playback,
        userName
      }
    };
    writeSavedArch(userName, payload);
    if (els.archStatus) {
      els.archStatus.textContent = `Salvo em ${userName} · ${arch.name || arch.id} (${arch.id})`;
    }
    return payload;
  };
  const exportCurrentArch = () => {
    const userName = safeUserName();
    const saved = readSavedArch(userName) || saveCurrentArch();
    const payload = saved?.arch ? saved : saveCurrentArch();
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${normalize(userName)}_${normalize(payload.arch?.id || 'arch')}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };
  const mountArchUI = () => {
    const current = refreshArchStatus();
    if (!els.archSelect) return;
    populateArchOptions();
    if (current?.id) els.archSelect.value = current.id;
    applyArchToPlayback(current, { persist: false });
    els.archSelect.addEventListener('change', () => {
      const arch = ARCHETYPES.find(a => String(a.id) === String(els.archSelect.value));
      if (arch) {
        applyArchToPlayback(arch, { persist: false });
        saveCurrentArch();
      }
    });
    els.saveArchBtn?.addEventListener('click', () => {
      const saved = saveCurrentArch();
      if (saved) {
        els.archStatus && (els.archStatus.textContent = `Salvo em ${saved.userName} · ${saved.arch?.name || saved.archId} (${saved.archId})`);
      }
    });
    els.exportArchBtn?.addEventListener('click', exportCurrentArch);
    ['voiceSelect', 'rateRange', 'pitchRange'].forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      el.addEventListener('change', () => {
        refreshArchStatus();
      });
      el.addEventListener('input', () => {
        refreshArchStatus();
      });
    });
    window.addEventListener('KOBLLUX_ARCH_REQUEST_REFRESH', refreshArchStatus);
  };
  const patchUpdateInterface = () => {
    const original = window.updateInterface;
    if (typeof original === 'function' && !original.__archPatched) {
      const wrapped = function(name){
        const result = original.apply(this, arguments);
        try {
          refreshArchStatus();
        } catch (err) {
          console.warn('[ARCH] refresh falhou', err);
        }
        return result;
      };
      wrapped.__archPatched = true;
      window.updateInterface = wrapped;
    }
  };
  const boot = () => {
    mountArchUI();
    patchUpdateInterface();
    refreshArchStatus();
    const userName = safeUserName();
    const saved = readSavedArch(userName);
    if (saved?.arch) {
      applyArchToPlayback(saved.arch, { persist: false });
    } else {
      const guessed = resolveArch(userName);
      applyArchToPlayback(guessed, { persist: false });
      saveCurrentArch();
    }
  };
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    boot();
  }
  window.NEBULA_ARCH = {
    getUserName: safeUserName,
    get: readSavedArch,
    save: saveCurrentArch,
    export: exportCurrentArch,
    list: () => ARCHETYPES.slice()
  };
})();
</script>
<script src="https://kodux78k.github.io/oiDual--Y-/M0D/LS/js/insert-LS-3.js" data-k-id="JS_29"></script><script src="https://kodux78k.github.io/oiDual--Y-/M0D/FSWIN/js/modules/iFSw-fix.js" data-k-id="JS_30"></script><script src="https://kodux78k.github.io/oiDual--Y-/js/78F-bgPanel.js" data-k-id="JS_31"></script>
<!-- <script>(() => {
  const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
  const cssNum = (name, fallback = 0) => {
    const raw = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    const n = parseFloat(raw);
    return Number.isFinite(n) ? n : fallback;
  };
  class IOSBottomSheet {
    constructor(el) {
      this.el = el;
      this.hdr = el.querySelector('.win-hdr');
      this.frame = el.querySelector('.win-frame');
      this.y = 0;
      this.v = 0;
      this.raf = 0;
      this.dragging = false;
      this.pointerId = null;
      this.onMove = this.onMove.bind(this);
      this.onUp = this.onUp.bind(this);
      this.install();
      this.resize();
      this.go('collapsed', false);
      window.addEventListener('resize', () => this.resize(), { passive: true });
      window.visualViewport?.addEventListener('resize', () => this.resize(), { passive: true });
    }
    install() {
      this.el.classList.add('bottom-sheet');
      this.el.dataset.state = this.el.dataset.state || 'collapsed';
      this.hdr?.addEventListener('pointerdown', (e) => this.onDown(e));
      this.hdr?.addEventListener('click', (e) => {
        if (this.dragging) {
          e.preventDefault();
          e.stopPropagation();
        }
      }, true);
    }
    resize() {
      // Recalculate after layout
      const rect = this.el.getBoundingClientRect();
      this.sheetH = rect.height || Math.max(240, window.innerHeight - cssNum('--topbar-h', 58));
      this.peekH = cssNum('--sheet-peek-h', cssNum('--peek-h', 240));
      this.collapsedH = cssNum('--sheet-collapsed-h', cssNum('--collapsed-h', 52));
      this.positions = {
        full: 0,
        peek: Math.max(0, this.sheetH - this.peekH),
        collapsed: Math.max(0, this.sheetH - this.collapsedH),
      };
      this.y = clamp(this.y, 0, this.positions.collapsed);
      this.setY(this.y);
    }
    onDown(e) {
      if (e.button != null && e.button !== 0) return;
      if (e.target.closest('button, a, input, textarea, select, [data-no-drag]')) return;
      this.dragging = true;
      this.el.classList.add('dragging');
      this.pointerId = e.pointerId;
      this.hdr.setPointerCapture?.(e.pointerId);
      this.startY = e.clientY;
      this.startSheetY = this.y;
      this.lastMoveT = performance.now();
      this.lastMoveY = e.clientY;
      this.v = 0;
      cancelAnimationFrame(this.raf);
      window.addEventListener('pointermove', this.onMove, { passive: false });
      window.addEventListener('pointerup', this.onUp, { passive: true });
      window.addEventListener('pointercancel', this.onUp, { passive: true });
      e.preventDefault();
    }
    onMove(ev) {
      if (!this.dragging || ev.pointerId !== this.pointerId) return;
      ev.preventDefault();
      const dy = ev.clientY - this.startY;
      let next = this.startSheetY + dy;
      const max = this.positions.collapsed;
      // Resistance at extremes
      if (next < 0) next *= 0.35;
      if (next > max) next = max + (next - max) * 0.35;
      const now = performance.now();
      const dt = Math.max(1, now - this.lastMoveT);
      this.v = (ev.clientY - this.lastMoveY) / dt; // px/ms
      this.lastMoveT = now;
      this.lastMoveY = ev.clientY;
      this.setY(next);
    }
    onUp() {
      if (!this.dragging) return;
      this.dragging = false;
      this.el.classList.remove('dragging');
      window.removeEventListener('pointermove', this.onMove);
      window.removeEventListener('pointerup', this.onUp);
      window.removeEventListener('pointercancel', this.onUp);
      const vy = this.v * 1000; // px/s
      const y = this.y;
      const { full, peek, collapsed } = this.positions;
      let target = 'peek';
      if (vy < -850) {
        target = y < (peek + full) / 2 ? 'full' : 'peek';
      } else if (vy > 850) {
        target = y > (peek + collapsed) / 2 ? 'collapsed' : 'peek';
      } else {
        const dFull = Math.abs(y - full);
        const dPeek = Math.abs(y - peek);
        const dColl = Math.abs(y - collapsed);
        target = ['full', 'peek', 'collapsed'][[dFull, dPeek, dColl].indexOf(Math.min(dFull, dPeek, dColl))];
      }
      this.go(target, true);
    }
    syncClasses(state) {
      this.el.classList.toggle('peeked', state === 'peek');
      this.el.classList.toggle('collapsed', state === 'collapsed');
      this.el.classList.toggle('maximized', state === 'full');
      this.el.dataset.state = state;
    }
    setY(y) {
      this.y = y;
      this.el.style.setProperty('--sheet-y', `${y.toFixed(2)}px`);
      // live state sync while dragging
      if (Math.abs(y - this.positions.full) < 1) this.syncClasses('full');
      else if (Math.abs(y - this.positions.peek) < 1) this.syncClasses('peek');
      else if (Math.abs(y - this.positions.collapsed) < 1) this.syncClasses('collapsed');
    }
    go(state, animate = true) {
      this.syncClasses(state);
      const target = this.positions[state];
      if (!animate) {
        this.setY(target);
        return;
      }
      this.animateTo(target);
    }
    animateTo(target) {
      cancelAnimationFrame(this.raf);
      let x = this.y;
      let v = 0;
      const stiffness = 0.14;
      const damping = 0.82;
      const step = () => {
        const a = (target - x) * stiffness;
        v = (v + a) * damping;
        x += v;
        if (Math.abs(target - x) < 0.35 && Math.abs(v) < 0.35) {
          this.setY(target);
          return;
        }
        this.setY(x);
        this.raf = requestAnimationFrame(step);
      };
      this.raf = requestAnimationFrame(step);
    }
  }
  window.BottomSheet = IOSBottomSheet;
  function boot() {
    document.querySelectorAll('.session-window').forEach((el) => {
      if (el.dataset.sheetInit === '1') return;
      el.dataset.sheetInit = '1';
      new IOSBottomSheet(el);
    });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();