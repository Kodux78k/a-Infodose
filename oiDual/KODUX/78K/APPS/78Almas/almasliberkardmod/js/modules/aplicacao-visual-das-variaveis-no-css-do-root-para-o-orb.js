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
  const ARCH_KEY = 'di_nebula_arch_v1';
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
    localStorage.setItem('di_nebula_arch_last', JSON.stringify(payload));
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
    // APLICAÇÃO VISUAL DAS VARIÁVEIS NO CSS DO ROOT PARA O ORB
    if (arch.theme) {
      document.documentElement.style.setProperty('--kob-voice-primary', arch.theme.primary || '#22D3EE');
      document.documentElement.style.setProperty('--kob-voice-secondary', arch.theme.secondary || '#7dd3fc');
      document.documentElement.style.setProperty('--kob-voice-glow', arch.theme.glow || '0 0 18px rgba(34,211,238,.55)');
      document.documentElement.style.setProperty('--kob-voice-bg-soft', arch.theme.bgSoft || 'transparent');
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