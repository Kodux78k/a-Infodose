(function(global) {
  'use strict';

  // ============================================================
  //  ORBENGINE v3 — MOTOR PROCEDURAL DE IDENTIDADE
  //  Refactor v2 → v3 conforme PR "Arquitetura Procedural +
  //  Cache + Persistência". Compatível com a API antiga
  //  (window.Orb, window.OrbEngine, window.makeOrbAvatar).
  // ============================================================
  const VERSION = 3;

  // ------------------------------------------------------------
  //  CONFIGURAÇÃO PADRÃO
  // ------------------------------------------------------------
  const DEFAULT_CONFIG = {
    autoInjectCSS: true,
    autoObserve: true,
    orbSelectors: [
      '.Orb', '.orb',
      '[class*="orb"]', '[class*="Orb"]',
      '.orb-avatar', '.avatar-orb'
    ],
    defaults: {
      name: 'DUAL',
      size: 64,
      speaking: false,
      archetypes: []
    },
    sync: {
      inputSelectors: ['#inputUser', '#infodoseNameInput'],
      textSelectors: {
        '#lblName': 'textContent',
        '#actName': 'textContent',
        '#smallText': 'textContent',
        '#hudStatus': 'textContent'
      },
      keySelectors: {
        '#smallIdent': 'textContent',
        '#actBadge': 'textContent'
      },
      orbSelectors: {
        '#main-orb': { size: 48 },
        '#avatarTarget': { size: 64 },
        '#smallMiniAvatar': { size: 24 },
        '#actMiniAvatar': { size: 36 }
      },
      rootAttr: 'arch'
    },
    // Chave única de persistência do perfil completo (PRIORIDADE 13)
    storageKey: 'orb.profile',
    // Chaves antigas, mantidas para migração/compatibilidade
    legacyStorageKeys: ['di_userName', 'userName'],
    debug: false
  };

  let config = { ...DEFAULT_CONFIG };

  // ------------------------------------------------------------
  //  ESTADO ÚNICO (PRIORIDADE 1)
  // ------------------------------------------------------------
  const state = {
    profile: null,      // perfil ativo — única fonte de verdade
    cache: new Map(),   // fullName -> profile (memoização, PRIORIDADE 9)
    ui: {},              // cache de seletores DOM (PRIORIDADE 23)
    storage: {}
  };

  const svgCache = new Map(); // seed -> <svg> template (PRIORIDADE 10/11/12)

  let observer = null;

  function log(...args) {
    if (config.debug) console.log('[OrbEngine v3]', ...args);
  }

  // ============================================================
  //  HASH — FNV-1a 32 bits (PRIORIDADE 25)
  // ============================================================
  function fnv1a(str) {
    let h = 0x811c9dc5;
    for (let i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 0x01000193);
    }
    return h >>> 0;
  }

  // ============================================================
  //  PRNG — Mulberry32, determinístico e leve (PRIORIDADE 4)
  // ============================================================
  function mulberry32(a) {
    return function() {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function makeRand(seed) {
    const rnd = mulberry32(seed);
    return {
      float: (min = 0, max = 1) => min + rnd() * (max - min),
      int: (min, max) => Math.floor(min + rnd() * (max - min + 1)),
      pick: (arr) => arr[Math.floor(rnd() * arr.length)],
      hue: () => Math.floor(rnd() * 360)
    };
  }

  // ============================================================
  //  IDENTIDADE PROCEDURAL — nome + arquétipos (PRIORIDADE 3)
  // ============================================================
  function safeName(v) {
    return (v || '').trim() || config.defaults.name;
  }

  function buildIdentity(userName, archetypes) {
    const name = safeName(userName);
    const archs = (archetypes || []).filter(Boolean);
    return archs.length ? `${name} ${archs.join(' ')}` : name;
  }

  // ============================================================
  //  PALETA / TEMA PROCEDURAL (PRIORIDADES 5, 6, 7, 8)
  // ============================================================
  const ANIMATIONS = ['orbFloat', 'orbDrift', 'orbShimmer'];
  const HALOS = ['soft', 'sharp', 'wide', 'tight', 'double'];

  function computePalette(rand) {
    const h1 = rand.hue();
    const h2 = (h1 + rand.int(80, 160)) % 360;
    const h3 = (h1 + rand.int(160, 260)) % 360;
    const sat = rand.int(70, 96);
    const lig = rand.int(42, 62);

    const hsl = (h, s, l, a = 1) =>
      a === 1 ? `hsl(${h},${s}%,${l}%)` : `hsla(${h},${s}%,${l}%,${a})`;

    return {
      h1, h2, h3, sat, lig,
      primary:   hsl(h1, sat, Math.min(lig + 8, 92)),
      secondary: hsl(h2, Math.max(sat - 8, 40), Math.max(lig - 6, 20)),
      accent:    hsl(h3, sat, Math.min(lig + 4, 90)),
      glow:      hsl(h1, sat, Math.min(lig + 26, 88), .55),
      shadow:    hsl(h2, Math.max(sat - 20, 30), Math.max(lig - 34, 6)),
      halo:      hsl(h1, Math.max(sat - 10, 30), Math.min(lig + 14, 80), .3),
      core:      hsl(h1, sat, Math.min(lig + 18, 90)),
      stroke:    hsl(h3, Math.max(sat - 4, 40), Math.min(lig + 2, 85)),
      text:      hsl(h1, 20, 92),
      badge:     hsl(h2, sat, Math.max(lig - 2, 20)),
      border:    hsl(h3, Math.max(sat - 16, 30), Math.max(lig - 10, 12))
    };
  }

  function computeTheme(palette, rand) {
    return {
      primary: palette.primary,
      secondary: palette.secondary,
      background: `hsl(${palette.h2},18%,7%)`,
      text: palette.text,
      badge: palette.badge,
      shadow: palette.shadow,
      panel: `hsl(${palette.h1},14%,11%)`,
      button: palette.accent,
      outline: palette.border,
      success: 'hsl(140,60%,48%)',
      warning: 'hsl(42,90%,55%)',
      danger:  'hsl(6,78%,56%)',
      animation: rand.pick(ANIMATIONS),
      haloStyle: rand.pick(HALOS),
      glowIntensity: rand.int(4, 10) / 10,
      strokeWidth: Number(rand.float(1.4, 3.2).toFixed(2))
    };
  }

  function computeVariables(palette, theme) {
    return {
      '--orb-primary': palette.primary,
      '--orb-secondary': palette.secondary,
      '--orb-glow': palette.glow,
      '--orb-halo': palette.halo,
      '--orb-shadow': palette.shadow,
      '--orb-panel': theme.panel,
      '--orb-border': palette.border,
      '--orb-text': palette.text,
      '--orb-button': theme.button,
      '--orb-accent': palette.accent,
      '--orb-highlight': palette.core,
      '--orb-background': theme.background,
      '--kob-voice-primary': palette.primary,
      '--kob-voice-secondary': palette.secondary
    };
  }

  // ============================================================
  //  COMPUTE PROFILE — função pura (PRIORIDADE 2)
  // ============================================================
  function computeProfile(userName, archetypes) {
    const archs = (archetypes || []).filter(Boolean);
    const fullName = buildIdentity(userName, archs);
    const seedVal = fnv1a(fullName);
    const rand = makeRand(seedVal);

    const palette = computePalette(rand);
    const theme = computeTheme(palette, rand);
    const variables = computeVariables(palette, theme);

    return {
      version: VERSION,
      userName: safeName(userName),
      archetype: archs.length ? archs[archs.length - 1] : null,
      archetypes: archs,
      fullName,
      seed: seedVal,
      palette,
      theme,
      variables,
      svg: null, // gerado sob demanda e cacheado por seed (svgCache)
      metadata: { generatedAt: Date.now() },
      updated: Date.now()
    };
  }

  // Memoização por fullName (PRIORIDADE 9 / 14)
  function getProfile(name, archetypes) {
    const fullName = buildIdentity(name, archetypes);
    if (state.cache.has(fullName)) return state.cache.get(fullName);
    const profile = computeProfile(name, archetypes);
    state.cache.set(fullName, profile);
    return profile;
  }

  // ============================================================
  //  PERSISTÊNCIA — perfil único versionado (PRIORIDADE 13/19)
  // ============================================================
  function saveProfile(profile) {
    try {
      localStorage.setItem(config.storageKey, JSON.stringify(profile));
    } catch (e) {
      log('Falha ao salvar perfil no localStorage', e);
    }
  }

  function loadStoredProfile() {
    try {
      const raw = localStorage.getItem(config.storageKey);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch (e) {
      return null;
    }
  }

  function getLegacyNameFromStorage() {
    for (const key of config.legacyStorageKeys) {
      const val = localStorage.getItem(key);
      if (val) return safeName(val);
    }
    return null;
  }

  // Boot: só recomputa se nome/arquétipos/versão mudaram (PRIORIDADE 14/15)
  function bootProfile() {
    const stored = loadStoredProfile();

    if (stored && stored.version === VERSION && stored.fullName) {
      state.profile = stored;
      state.cache.set(stored.fullName, stored);
      log('Perfil restaurado do localStorage (sem recomputar):', stored.fullName);
      return state.profile;
    }

    // Migração: perfil antigo/inexistente → tenta nome legado
    const legacyName = getLegacyNameFromStorage();
    const userName = legacyName || config.defaults.name;
    const archetypes = config.defaults.archetypes || [];

    state.profile = getProfile(userName, archetypes);
    saveProfile(state.profile);
    log('Perfil computado (boot):', state.profile.fullName);
    return state.profile;
  }

  // ============================================================
  //  SVG — template cacheado por seed, clonado (PRIORIDADE 10/12)
  // ============================================================
  function buildOrbSVGElement(seed, palette) {
    const gradId = `orb_${seed.toString(36)}`; // id estável, sem Math.random

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', 'dual-orb-svg');
    svg.setAttribute('viewBox', '0 0 100 100');
    svg.setAttribute('aria-hidden', 'true');

    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');

    const coreGrad = document.createElementNS('http://www.w3.org/2000/svg', 'radialGradient');
    coreGrad.setAttribute('id', `${gradId}_core`);
    coreGrad.setAttribute('cx', '50%');
    coreGrad.setAttribute('cy', '50%');
    coreGrad.setAttribute('r', '50%');
    coreGrad.innerHTML = `
      <stop offset="0%" stop-color="${palette.core}" stop-opacity="1"/>
      <stop offset="55%" stop-color="${palette.secondary}" stop-opacity=".9"/>
      <stop offset="100%" stop-color="${palette.shadow}" stop-opacity="0"/>
    `;
    defs.appendChild(coreGrad);

    const ringGrad = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
    ringGrad.setAttribute('id', `${gradId}_ring`);
    ringGrad.setAttribute('x1', '0%');
    ringGrad.setAttribute('y1', '0%');
    ringGrad.setAttribute('x2', '100%');
    ringGrad.setAttribute('y2', '100%');
    ringGrad.innerHTML = `
      <stop offset="0%" stop-color="${palette.primary}"/>
      <stop offset="100%" stop-color="${palette.accent}"/>
    `;
    defs.appendChild(ringGrad);
    svg.appendChild(defs);

    const circles = [
      { cx: 50, cy: 50, r: 46, fill: '#05070c' },
      { cx: 50, cy: 50, r: 40, fill: `url(#${gradId}_core)`, opacity: '.28' },
      { cx: 50, cy: 50, r: 38, fill: 'none', stroke: `url(#${gradId}_ring)`, 'stroke-width': '1' },
      { cx: 50, cy: 50, r: 46, fill: 'none', stroke: `url(#${gradId}_ring)`, 'stroke-width': '2.5',
        'stroke-dasharray': '70 20 10 30', 'stroke-linecap': 'round', opacity: '.86' },
      { cx: 50, cy: 50, r: 8, fill: '#ffffff', opacity: '.22', filter: 'blur(2px)' },
      { cx: 50, cy: 50, r: 3, fill: '#ffffff', opacity: '.85' }
    ];
    circles.forEach(attrs => {
      const c = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      for (const [k, v] of Object.entries(attrs)) c.setAttribute(k, v);
      svg.appendChild(c);
    });

    return svg;
  }

  function getOrbSVG(seed, palette) {
    if (svgCache.has(seed)) return svgCache.get(seed).cloneNode(true);
    const svg = buildOrbSVGElement(seed, palette);
    svgCache.set(seed, svg);
    return svg.cloneNode(true);
  }

  function extractOrbSVG(html) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const svg = doc.querySelector('.dual-orb-svg');
    if (!svg) return null;

    const wrap = doc.querySelector('.dual-orb-wrap');
    const style = wrap ? wrap.getAttribute('style') : '';
    const size = style?.match(/--orb-size:(\d+)px/)?.[1] || '64';

    svg.setAttribute('width', size);
    svg.setAttribute('height', size);
    svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');

    return new XMLSerializer().serializeToString(svg);
  }

  // ============================================================
  //  INJEÇÃO DE CSS (variáveis expandidas — PRIORIDADE 8)
  // ============================================================
  let cssInjected = false;
  function injectStyles() {
    if (!config.autoInjectCSS) return;
    if (cssInjected) return;
    if (document.getElementById('dual-orb-styles')) {
      cssInjected = true;
      return;
    }

    const style = document.createElement('style');
    style.id = 'dual-orb-styles';
    style.innerHTML = `
      @keyframes orbBreathe {
        0%, 100% { transform: translateZ(0) scale(1); opacity:.82; filter: brightness(1); }
        50% { transform: translateZ(0) scale(1.08); opacity: 1; filter: brightness(1.22); }
      }
      @keyframes orbSpin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
      @keyframes orbPulse {
        0% { transform: scale(.78); opacity:.55; }
        100% { transform: scale(1.28); opacity: 0; }
      }
      @keyframes orbFloat {
        0%, 100% { transform: translateY(0px) rotateX(0deg) rotateY(0deg); }
        50% { transform: translateY(-2px) rotateX(10deg) rotateY(-10deg); }
      }
      @keyframes orbDrift {
        0% { transform: translate(0,0) rotate(0deg); }
        50% { transform: translate(1px,-2px) rotate(3deg); }
        100% { transform: translate(0,0) rotate(0deg); }
      }
      @keyframes orbShimmer {
        0%, 100% { filter: brightness(1); }
        50% { filter: brightness(1.35); }
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
      .dual-orb-wrap:active { transform: scale(.94); }
      .dual-orb-wrap:hover { transform: scale(1.03); }

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
        animation-name: orbFloat;
        animation-timing-function: ease-in-out;
        animation-iteration-count: infinite;
        animation-duration: 6s;
        pointer-events: none;
      }

      .dual-orb-halo {
        position: absolute;
        inset: -24%;
        border-radius: 50%;
        background: radial-gradient(circle, var(--orb-halo, rgba(120,227,255,.24)), rgba(185,120,255,.06) 42%, transparent 70%);
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
          0 0 16px var(--orb-glow, rgba(120,227,255,.55)),
          0 0 34px var(--orb-glow, rgba(120,227,255,.25)),
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
        animation: orbSpin 2s linear infinite, orbBreathe .55s ease-in-out infinite alternate;
      }
      .dual-orb-wrap.speaking .dual-orb-halo {
        animation: orbPulse .85s ease-in-out infinite;
      }

      .dual-orb-wrap:hover .dual-orb-core {
        box-shadow:
          0 0 20px var(--orb-glow, rgba(120,227,255,.7)),
          0 0 42px var(--orb-glow, rgba(120,227,255,.36)),
          inset -10px -12px 20px rgba(0,0,0,.34),
          inset 10px 10px 18px rgba(255,255,255,.14);
      }
    `;
    document.head.appendChild(style);
    cssInjected = true;
    log('CSS injetado');
  }

  // ============================================================
  //  RENDER — perfil → HTML (com pequenas variações proceduais
  //  de animação/velocidade vindas do tema — PRIORIDADE 7)
  // ============================================================
  function renderProfileToHTML(profile, size, speaking) {
    injectStyles();

    const wrap = document.createElement('div');
    wrap.className = 'dual-orb-wrap';
    if (speaking) wrap.classList.add('speaking');

    wrap.style.setProperty('--orb-size', size + 'px');
    wrap.style.setProperty('--orb-primary', profile.palette.primary);
    wrap.style.setProperty('--orb-secondary', profile.palette.secondary);
    wrap.style.setProperty('--orb-glow', profile.palette.glow);
    wrap.style.setProperty('--orb-halo', profile.palette.halo);
    wrap.style.setProperty('--orb-spin-speed', (8 + profile.theme.glowIntensity * 8).toFixed(1) + 's');
    wrap.style.setProperty('--orb-pulse-speed', (1.6 + profile.theme.glowIntensity * 1.6).toFixed(2) + 's');

    wrap.setAttribute('aria-label', profile.userName);
    wrap.setAttribute('role', 'img');

    wrap.appendChild(getOrbSVG(profile.seed, profile.palette));

    const shell = document.createElement('div');
    shell.className = 'dual-orb-shell';
    shell.style.animationName = profile.theme.animation;

    const halo = document.createElement('div');
    halo.className = 'dual-orb-halo';
    const core = document.createElement('div');
    core.className = 'dual-orb-core';
    shell.appendChild(halo);
    shell.appendChild(core);
    wrap.appendChild(shell);

    return wrap.outerHTML;
  }

  // Compat total com a assinatura antiga: makeOrbAvatar(name, size, speaking)
  function makeOrbAvatar(name, size, speaking) {
    const profile = getProfile(name, []);
    return renderProfileToHTML(
      profile,
      size ?? config.defaults.size,
      speaking ?? config.defaults.speaking
    );
  }

  // ============================================================
  //  RENDERIZAÇÃO DE ELEMENTOS — smart render (PRIORIDADE 21)
  //  + dataset de debug (PRIORIDADE 16)
  // ============================================================
  function getElementOption(el, key, fallback) {
    if (el.dataset && el.dataset[key] !== undefined) {
      const val = el.dataset[key];
      if (key === 'size') return parseInt(val, 10) || fallback;
      if (key === 'speaking') return val === 'true' || val === '1';
      return val;
    }
    return fallback;
  }

  function renderElement(el, options) {
    if (!el) return;

    const name = options?.name ?? getElementOption(
      el, 'name', state.profile ? state.profile.userName : config.defaults.name
    );
    const size = options?.size ?? getElementOption(el, 'size', config.defaults.size);
    const speaking = options?.speaking !== undefined
      ? options.speaking
      : getElementOption(el, 'speaking', config.defaults.speaking);
    const archetypes = options?.archetypes ?? (
      el.dataset.archetypes
        ? el.dataset.archetypes.split(',').map(s => s.trim()).filter(Boolean)
        : []
    );

    const profile = getProfile(name, archetypes);

    // Pula a re-renderização se nada relevante mudou
    if (
      el.dataset.orbSeed === String(profile.seed) &&
      el.dataset.orbVersion === String(VERSION) &&
      el.dataset.orbSpeaking === String(speaking) &&
      el.dataset.orbRenderedSize === String(size)
    ) {
      return;
    }

    el.innerHTML = renderProfileToHTML(profile, size, speaking);
    el.dataset.orbRendered = 'true';
    el.dataset.orbSeed = String(profile.seed);
    el.dataset.orbVersion = String(VERSION);
    el.dataset.orbSpeaking = String(speaking);
    el.dataset.orbRenderedSize = String(size);
    el.dataset.orbFullname = profile.fullName;
    el.dataset.orbGenerated = String(Date.now());

    log('Renderizado em', el, { name: profile.userName, size, speaking, seed: profile.seed });
  }

  function render(selector, options) {
    const els = typeof selector === 'string'
      ? document.querySelectorAll(selector)
      : (selector?.nodeType ? [selector] : selector);
    if (!els || els.length === 0) {
      log('Nenhum elemento encontrado para', selector);
      return;
    }
    els.forEach(el => renderElement(el, options));
  }

  function scan() {
    log('Scanning DOM...');
    config.orbSelectors.forEach(sel => {
      document.querySelectorAll(sel).forEach(el => renderElement(el));
    });
  }

  // ============================================================
  //  OBSERVAÇÃO DE MUDANÇAS — render pontual (PRIORIDADE 22)
  // ============================================================
  function observe() {
    if (!config.autoObserve) return;
    if (observer) {
      observer.disconnect();
      observer = null;
    }

    observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type !== 'childList') continue;
        for (const node of mutation.addedNodes) {
          if (node.nodeType !== Node.ELEMENT_NODE) continue;
          config.orbSelectors.forEach(sel => {
            if (node.matches && node.matches(sel)) renderElement(node);
            if (node.querySelectorAll) {
              node.querySelectorAll(sel).forEach(el => renderElement(el));
            }
          });
        }
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });
    log('MutationObserver ativo (render pontual)');
  }

  // ============================================================
  //  CACHE DE SELETORES DA UI (PRIORIDADE 23)
  // ============================================================
  function cacheSyncElements() {
    state.ui.textEls = new Map();
    Object.keys(config.sync.textSelectors || {}).forEach(sel => {
      const el = document.querySelector(sel);
      if (el) state.ui.textEls.set(sel, el);
    });

    state.ui.keyEls = new Map();
    Object.keys(config.sync.keySelectors || {}).forEach(sel => {
      const el = document.querySelector(sel);
      if (el) state.ui.keyEls.set(sel, el);
    });

    state.ui.orbEls = new Map();
    Object.entries(config.sync.orbSelectors || {}).forEach(([sel, opts]) => {
      const el = document.querySelector(sel);
      if (el) state.ui.orbEls.set(sel, { el, opts });
    });

    state.ui.inputs = [];
    (config.sync.inputSelectors || []).forEach(sel => {
      document.querySelectorAll(sel).forEach(el => state.ui.inputs.push(el));
    });

    log('Cache de seletores da UI atualizado');
  }

  // ============================================================
  //  SINCRONIZAÇÃO DE IDENTIDADE (root, textos, badges, orbs)
  // ============================================================
  function updateRoot(profile) {
    const root = document.documentElement;
    if (config.sync.rootAttr) root.dataset[config.sync.rootAttr] = profile.userName;
    root.dataset.diName = profile.userName;
    root.dataset.orbFullname = profile.fullName;
    root.dataset.orbSeed = String(profile.seed);
    root.dataset.orbVersion = String(VERSION);
    Object.entries(profile.variables).forEach(([k, v]) => root.style.setProperty(k, v));
    log('Root atualizado para', profile.fullName);
  }

  function updateTextElements(profile) {
    const map = (state.ui.textEls && state.ui.textEls.size) ? state.ui.textEls : null;
    const source = map || Object.keys(config.sync.textSelectors || {})
      .map(sel => [sel, document.querySelector(sel)]);
    source.forEach((entry) => {
      const [sel, el] = Array.isArray(entry) ? entry : [entry[0], entry[1]];
      if (!el) return;
      const prop = config.sync.textSelectors[sel];
      if (prop === 'textContent') el.textContent = profile.userName;
      else el[prop] = profile.userName;
    });
  }

  function updateKeyElements() {
    let keyName = '--';
    let badgeText = 'v:--';
    if (global.STATE?.keys) {
      const active = global.STATE.keys.find(k => k.active);
      if (active) {
        keyName = active.name || '--';
        badgeText = `key:${keyName}`;
      }
    }
    const map = (state.ui.keyEls && state.ui.keyEls.size) ? state.ui.keyEls : null;
    const source = map || Object.keys(config.sync.keySelectors || {})
      .map(sel => [sel, document.querySelector(sel)]);
    source.forEach((entry) => {
      const [sel, el] = Array.isArray(entry) ? entry : [entry[0], entry[1]];
      if (!el) return;
      const prop = config.sync.keySelectors[sel];
      const value = sel === '#smallIdent' ? keyName : badgeText;
      if (prop === 'textContent') el.textContent = value;
      else el[prop] = value;
    });
  }

  function updateOrbs(profile) {
    const map = (state.ui.orbEls && state.ui.orbEls.size) ? state.ui.orbEls : null;
    const source = map || Object.entries(config.sync.orbSelectors || {})
      .map(([sel, opts]) => {
        const el = document.querySelector(sel);
        return el ? [sel, { el, opts }] : null;
      }).filter(Boolean);

    source.forEach((entry) => {
      const [, payload] = Array.isArray(entry) ? entry : [entry[0], entry[1]];
      const { el, opts } = payload;
      if (!el) return;

      const size = opts.size || config.defaults.size;
      const speaking = opts.speaking || false;
      const targetProfile = el.dataset.name ? getProfile(el.dataset.name, []) : profile;

      if (
        el.dataset.orbSeed === String(targetProfile.seed) &&
        el.dataset.orbRenderedSize === String(size) &&
        el.dataset.orbSpeaking === String(speaking)
      ) {
        return;
      }

      el.innerHTML = renderProfileToHTML(targetProfile, size, speaking);
      el.dataset.orbRendered = 'true';
      el.dataset.orbSeed = String(targetProfile.seed);
      el.dataset.orbRenderedSize = String(size);
      el.dataset.orbSpeaking = String(speaking);
    });
  }

  // ============================================================
  //  MUTAÇÃO DE IDENTIDADE — nome / arquétipos
  // ============================================================
  function syncIdentity(userName, archetypes) {
    const profile = getProfile(userName, archetypes);
    state.profile = profile;
    saveProfile(profile);

    // Mantém compatibilidade com código legado que lê essas chaves
    config.legacyStorageKeys.forEach(k => localStorage.setItem(k, profile.userName));

    updateRoot(profile);
    updateTextElements(profile);
    updateKeyElements();
    updateOrbs(profile);

    document.dispatchEvent(new CustomEvent('orb:name:sync', {
      detail: { name: profile.userName, fullName: profile.fullName, profile }
    }));
    log('Identidade sincronizada:', profile.fullName);
  }

  function syncName(name) {
    syncIdentity(name, state.profile ? state.profile.archetypes : []);
  }

  function setUserName(name) {
    syncIdentity(name, state.profile ? state.profile.archetypes : []);
  }

  function setArchetypes(archetypes) {
    syncIdentity(state.profile ? state.profile.userName : config.defaults.name, archetypes);
  }

  function addArchetype(arch) {
    const list = state.profile ? [...state.profile.archetypes] : [];
    if (!list.includes(arch)) list.push(arch);
    setArchetypes(list);
  }

  function removeArchetype(arch) {
    const list = (state.profile ? state.profile.archetypes : []).filter(a => a !== arch);
    setArchetypes(list);
  }

  // ============================================================
  //  BIND DE INPUTS (usa cache de seletores — PRIORIDADE 23)
  // ============================================================
  function bindInputs() {
    const inputs = state.ui.inputs || [];
    if (inputs.length === 0) return;

    const initial = state.profile ? state.profile.userName : (getLegacyNameFromStorage() || config.defaults.name);
    inputs.forEach(inp => {
      if (!inp.value) inp.value = initial;
      inp.addEventListener('input', () => syncName(inp.value));
      inp.addEventListener('change', () => syncName(inp.value));
    });

    document.addEventListener('orb:name:sync', (e) => {
      const newName = e.detail.name;
      inputs.forEach(inp => {
        if (inp.value !== newName) inp.value = newName;
      });
    });

    // Sincronização entre abas — tanto legado quanto perfil completo
    window.addEventListener('storage', (e) => {
      if (config.legacyStorageKeys.includes(e.key) && e.newValue) {
        syncName(e.newValue);
        return;
      }
      if (e.key === config.storageKey && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (parsed?.fullName && (!state.profile || parsed.fullName !== state.profile.fullName)) {
            importProfile(parsed);
          }
        } catch (err) {
          log('Perfil recebido de outra aba é inválido', err);
        }
      }
    });

    log('Inputs vinculados:', inputs.length);
  }

  // ============================================================
  //  EXPORT / IMPORT (PRIORIDADE 18)
  // ============================================================
  function exportProfile() {
    return JSON.stringify(state.profile, null, 2);
  }

  function importProfile(json) {
    const parsed = typeof json === 'string' ? JSON.parse(json) : json;
    if (!parsed || !parsed.fullName) throw new Error('Perfil inválido');

    state.profile = parsed;
    state.cache.set(parsed.fullName, parsed);
    saveProfile(parsed);

    updateRoot(parsed);
    updateTextElements(parsed);
    updateKeyElements();
    updateOrbs(parsed);

    document.dispatchEvent(new CustomEvent('orb:name:sync', {
      detail: { name: parsed.userName, fullName: parsed.fullName, profile: parsed }
    }));
    log('Perfil importado:', parsed.fullName);
  }

  // ============================================================
  //  DASHBOARD MÍNIMO (PRIORIDADE 17)
  // ============================================================
  const Dashboard = {
    panelEl: null,
    mount() {
      if (this.panelEl) { this.toggle(true); return; }
      const p = document.createElement('div');
      p.id = 'orb-dashboard';
      p.style.cssText = 'position:fixed;bottom:12px;right:12px;z-index:99999;' +
        'background:#0b0d12;color:#dfefff;font:12px/1.4 monospace;padding:12px;' +
        'border-radius:10px;border:1px solid #223;max-width:280px;' +
        'box-shadow:0 8px 30px rgba(0,0,0,.5);';
      p.innerHTML = `
        <strong>Orb Cache</strong><br/>
        <div id="orb-dash-info"></div>
        <div style="margin-top:8px;display:flex;gap:6px;flex-wrap:wrap;">
          <button data-act="export">Exportar</button>
          <button data-act="import">Importar</button>
          <button data-act="regen">Regerar</button>
          <button data-act="clear">Limpar Cache</button>
          <button data-act="close">Fechar</button>
        </div>
      `;
      document.body.appendChild(p);
      this.panelEl = p;
      p.addEventListener('click', (e) => {
        const act = e.target?.dataset?.act;
        if (!act) return;
        if (act === 'export') this.doExport();
        if (act === 'import') this.doImport();
        if (act === 'regen') this.doRegen();
        if (act === 'clear') this.doClear();
        if (act === 'close') this.toggle(false);
      });
      this.refresh();
    },
    toggle(show) {
      if (!this.panelEl) return;
      this.panelEl.style.display = show === false ? 'none' : 'block';
      if (show !== false) this.refresh();
    },
    refresh() {
      if (!this.panelEl) return;
      const info = this.panelEl.querySelector('#orb-dash-info');
      const p = state.profile;
      info.innerHTML = p ? `
        Usuário: ${p.userName}<br/>
        Arquétipos: ${(p.archetypes || []).join(', ') || '—'}<br/>
        Seed: ${p.seed}<br/>
        Perfis em cache: ${state.cache.size}<br/>
        SVGs em cache: ${svgCache.size}
      ` : 'Sem perfil ativo';
    },
    doExport() {
      const json = exportProfile();
      navigator.clipboard?.writeText(json).catch(() => {});
      console.log(json);
      log('Perfil exportado (copiado para a área de transferência, se suportado)');
    },
    doImport() {
      const json = prompt('Cole o JSON do perfil:');
      if (!json) return;
      try {
        importProfile(json);
        this.refresh();
      } catch (e) {
        alert('JSON inválido');
      }
    },
    doRegen() {
      if (!state.profile) return;
      syncIdentity(state.profile.userName, state.profile.archetypes);
      this.refresh();
    },
    doClear() {
      state.cache.clear();
      svgCache.clear();
      log('Cache limpo');
      this.refresh();
    }
  };

  // ============================================================
  //  INICIALIZAÇÃO
  // ============================================================
  function init(opts = {}) {
    if (opts.sync) opts.sync = { ...DEFAULT_CONFIG.sync, ...opts.sync };
    Object.assign(config, opts);

    bootProfile();

    if (config.autoInjectCSS) injectStyles();

    const boot = () => {
      cacheSyncElements();
      updateRoot(state.profile);
      updateTextElements(state.profile);
      updateKeyElements();
      updateOrbs(state.profile);
      bindInputs();
      scan();
      if (config.autoObserve) observe();
    };

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', boot);
    } else {
      boot();
    }

    document.addEventListener('di:name:update', (e) => {
      if (e.detail?.name) syncName(e.detail.name);
    });

    log('OrbEngine v3 inicializado', { config, profile: state.profile });
    return this;
  }

  // ============================================================
  //  API PÚBLICA
  // ============================================================
  const OrbEngine = {
    VERSION,
    config,
    state,
    init,
    render,
    scan,
    observe,
    refreshUI: cacheSyncElements,
    syncName,
    syncIdentity,
    setUserName,
    setArchetypes,
    addArchetype,
    removeArchetype,
    getProfile,
    getActiveProfile: () => state.profile,
    getName: () => state.profile
      ? state.profile.userName
      : (getLegacyNameFromStorage() || config.defaults.name),
    export: exportProfile,
    import: importProfile,
    clearCache: () => { state.cache.clear(); svgCache.clear(); },
    dashboard: Dashboard,
    html: makeOrbAvatar,
    svg: extractOrbSVG,
    // Compatibilidade com window.makeOrbAvatar(name, size, speaking)
    makeOrbAvatar
  };

  // ============================================================
  //  EXPORTAÇÃO GLOBAL
  // ============================================================
  global.Orb = OrbEngine;
  global.OrbEngine = OrbEngine;
  global.makeOrbAvatar = makeOrbAvatar;

  if (document.currentScript && document.currentScript.dataset.autoInit !== 'false') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => OrbEngine.init());
    } else {
      OrbEngine.init();
    }
  }

})(typeof window !== 'undefined' ? window : this);
