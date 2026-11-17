(() => {
  if (window.__DI_OVERRIDE_READY__) return;
  window.__DI_OVERRIDE_READY__ = true;

  const NAME_KEYS = ['di_userName', 'userName'];
  const SEL = {
    inputA: '#inputUserCard',
    inputB: '#inputUserId',
    lblName: '#lblName',
    actName: '#actName',
    smallText: '#smallText',
    hudStatus: '#hudStatus',
    smallIdent: '#smallIdent',
    actBadge: '#actBadge',
    avatarTarget: '#avatarTarget',
    smallMiniAvatar: '#smallMiniAvatar',
    actMiniAvatar: '#actMiniAvatar',
    usernameDisplay: '#usernameDisplay'
  };

  const $ = (selector) => document.querySelector(selector);
  const safeName = (value) => String(value ?? '').trim() || 'Convidado';
  const seed = (name) => [...name].reduce((sum, char) => sum + char.charCodeAt(0), 0);

  function applyRoot(name) {
    const value = seed(name);
    const root = document.documentElement;
    root.style.setProperty('--kob-voice-primary', `hsl(${value % 360} 100% 55%)`);
    root.style.setProperty('--kob-voice-secondary', `hsl(${(value * 37) % 360} 90% 45%)`);
    root.dataset.diName = name;
    // data-arch descreve a arquitetura/arquetipo; não deve receber o nome do usuário.
  }

  function renderOrb(selector, name, size) {
    const el = $(selector);
    if (!el || typeof window.makeOrbAvatar !== 'function') return;
    if (el.dataset.orbName === name) return;
    el.innerHTML = window.makeOrbAvatar(name, size);
    el.dataset.orbName = name;
  }

  function setText(selector, value) {
    const el = $(selector);
    if (el) el.textContent = value;
  }

  function sync(name, sourceInput = null, finalize = false) {
    const safe = safeName(name);
    localStorage.setItem('di_userName', safe);
    localStorage.setItem('userName', safe);
    applyRoot(safe);

    const cardInput = $(SEL.inputA);
    const cockpitInput = $(SEL.inputB);
    [cardInput, cockpitInput].forEach((input) => {
      if (!input || input === sourceInput) return;
      if (document.activeElement !== input) input.value = safe;
    });
    if (sourceInput && finalize) sourceInput.value = safe;

    setText(SEL.lblName, safe);
    setText(SEL.actName, safe);
    setText(SEL.usernameDisplay, safe);

    const smallText = $(SEL.smallText);
    if (smallText) smallText.textContent = safe === 'Convidado' ? 'Aguardando ativação...' : `${safe} · canal ASCII ativo`;
    const actPre = $('#actPre');
    if (actPre) {
      const title = 'CÉREBRO-ORÁCULO — BASE v1';
      const width = 35;
      const frame = `+${'-'.repeat(width)}+`;
      const titleLine = `| ${title.padEnd(width - 2, ' ')} |`;
      const activationLine = `Ativar: ${safe}.Dual Infodose.`;
      actPre.textContent = `${frame}\n${titleLine}\n${frame}\n${activationLine}`;
    }

    renderOrb(SEL.avatarTarget, safe, 64);
    renderOrb(SEL.smallMiniAvatar, safe, 24);
    renderOrb(SEL.actMiniAvatar, safe, 36);

    const activeKey = (typeof STATE !== 'undefined' && Array.isArray(STATE.keys))
      ? STATE.keys.find((key) => key.active)
      : null;
    const keyName = activeKey ? activeKey.name : '--';
    setText(SEL.smallIdent, keyName);
    setText(SEL.actBadge, activeKey ? `key:${keyName}` : 'v:--');

    if (typeof STATE !== 'undefined') STATE.user = safe;
    if (typeof saveData === 'function') {
      try { saveData(); } catch (_) {}
    }

    return safe;
  }

  function bind() {
    const cardInput = $(SEL.inputA);
    const cockpitInput = $(SEL.inputB);
    const saved = localStorage.getItem('di_userName') || localStorage.getItem('userName') || '';
    const initial = safeName(saved || cardInput?.value || cockpitInput?.value);

    [cardInput, cockpitInput].filter(Boolean).forEach((input) => {
      if (!input.value.trim()) input.value = initial;
      input.addEventListener('input', () => sync(input.value, input, false));
      input.addEventListener('change', () => sync(input.value, input, true));
      input.addEventListener('blur', () => sync(input.value, input, true));
    });

    sync(initial);

    window.addEventListener('storage', (event) => {
      if (NAME_KEYS.includes(event.key)) sync(event.newValue);
    });
    document.addEventListener('di:name:update', (event) => {
      sync(event.detail?.name);
    });
  }

  window.di_overrideSync = sync;
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', bind);
  else bind();
})();
