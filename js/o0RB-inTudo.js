(function(global) {
  'use strict';

  // ============================================================
  //  CONFIGURAÇÃO PADRÃO
  // ============================================================
  const DEFAULT_CONFIG = {
    // Injeção de CSS
    autoInjectCSS: true,
    // Observação automática do DOM
    autoObserve: true,
    // Seletores para detectar orbs automaticamente
    orbSelectors: [
      '.Orb', '.orb',
      '[class*="orb"]', '[class*="Orb"]',
      '.orb-avatar', '.avatar-orb'
    ],
    // Valores padrão para novos orbs
    defaults: {
      name: 'DUAL',
      size: 64,
      speaking: false
    },
    // Sincronização com localStorage e UI
    sync: {
      // Chaves do localStorage para o nome
      storageKeys: ['di_userName', 'userName'],
      // Seletores de inputs que controlam o nome
      inputSelectors: ['#inputUser', '#infodoseNameInput'],
      // Elementos que terão o texto atualizado com o nome
      textSelectors: {
        '#lblName': 'textContent',
        '#actName': 'textContent',
        '#smallText': 'textContent',
        '#hudStatus': 'textContent'
      },
      // Elementos que terão o texto atualizado com a chave ativa (ex: smallIdent, actBadge)
      keySelectors: {
        '#smallIdent': 'textContent',
        '#actBadge': 'textContent'
      },
      // Orbs que serão renderizados com o nome sincronizado
      orbSelectors: {
        '#main-orb': { size: 48 },
        '#avatarTarget': { size: 64 },
        '#smallMiniAvatar': { size: 24 },
        '#actMiniAvatar': { size: 36 }
      },
      // Atributo data-arch a ser definido no root
      rootAttr: 'arch',
      // Variáveis CSS no root
      rootVars: {
        '--kob-voice-primary': (h1) => `hsl(${h1} 100% 55%)`,
        '--kob-voice-secondary': (h2) => `hsl(${h2} 90% 45%)`
      }
    },
    debug: false
  };

  // ============================================================
  //  ESTADO INTERNO
  // ============================================================
  let config = { ...DEFAULT_CONFIG };
  let cssInjected = false;
  let observer = null;
  let currentName = '';
  let activeKey = null; // para uso futuro

  // ============================================================
  //  UTILITÁRIOS
  // ============================================================
  function log(...args) {
    if (config.debug) console.log('[OrbEngine]', ...args);
  }

  function safeName(v) {
    return (v || '').trim() || config.defaults.name;
  }

  function seed(name) {
    return [...name].reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  }

  function compute(name) {
    const s = seed(name);
    return {
      name,
      seed: s,
      h1: s % 360,
      h2: (s * 37) % 360
    };
  }

  function getElementOption(el, key, fallback) {
    if (el.dataset && el.dataset[key] !== undefined) {
      const val = el.dataset[key];
      if (key === 'size') return parseInt(val, 10) || fallback;
      if (key === 'speaking') return val === 'true' || val === '1';
      return val;
    }
    return fallback;
  }

  // ============================================================
  //  INJEÇÃO DE CSS (mesmo código anterior)
  // ============================================================
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
        animation: orbFloat 6s ease-in-out infinite;
        pointer-events: none;
      }

      .dual-orb-halo {
        position: absolute;
        inset: -24%;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(120,227,255,.24), rgba(185,120,255,.06) 42%, transparent 70%);
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
          0 0 16px rgba(120,227,255,.55),
          0 0 34px rgba(120,227,255,.25),
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
          0 0 20px rgba(120,227,255,.7),
          0 0 42px rgba(120,227,255,.36),
          inset -10px -12px 20px rgba(0,0,0,.34),
          inset 10px 10px 18px rgba(255,255,255,.14);
      }
    `;
    document.head.appendChild(style);
    cssInjected = true;
    log('CSS injetado');
  }

  // ============================================================
  //  GERADOR DE AVATAR (HTML e SVG)
  // ============================================================
  function makeOrbAvatar(name, size, speaking) {
    injectStyles();

    const safe = safeName(name);
    const seedVal = seed(safe);
    const h1 = seedVal % 360;
    const h2 = (seedVal * 37) % 360;
    const uid = Math.random().toString(36).slice(2, 7);
    const gradId = `orb_${seedVal.toString(36)}_${uid}`;

    const wrap = document.createElement('div');
    wrap.className = 'dual-orb-wrap';
    if (speaking) wrap.classList.add('speaking');
    wrap.style.setProperty('--orb-size', size + 'px');
    wrap.style.setProperty('--orb-primary', `hsl(${h1},100%,62%)`);
    wrap.style.setProperty('--orb-secondary', `hsl(${h2},92%,48%)`);
    wrap.setAttribute('aria-label', safe);
    wrap.setAttribute('role', 'img');

    // SVG
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
      <stop offset="0%" stop-color="hsl(${h1},100%,66%)" stop-opacity="1"/>
      <stop offset="55%" stop-color="hsl(${h2},92%,46%)" stop-opacity=".9"/>
      <stop offset="100%" stop-color="hsl(${h2},100%,12%)" stop-opacity="0"/>
    `;
    defs.appendChild(coreGrad);

    const ringGrad = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
    ringGrad.setAttribute('id', `${gradId}_ring`);
    ringGrad.setAttribute('x1', '0%');
    ringGrad.setAttribute('y1', '0%');
    ringGrad.setAttribute('x2', '100%');
    ringGrad.setAttribute('y2', '100%');
    ringGrad.innerHTML = `
      <stop offset="0%" stop-color="hsl(${h1},100%,76%)"/>
      <stop offset="100%" stop-color="hsl(${h2},100%,58%)"/>
    `;
    defs.appendChild(ringGrad);
    svg.appendChild(defs);

    // círculos
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
      for (const [k, v] of Object.entries(attrs)) {
        c.setAttribute(k, v);
      }
      svg.appendChild(c);
    });

    wrap.appendChild(svg);

    // Shell, halo, core
    const shell = document.createElement('div');
    shell.className = 'dual-orb-shell';
    const halo = document.createElement('div');
    halo.className = 'dual-orb-halo';
    const core = document.createElement('div');
    core.className = 'dual-orb-core';
    shell.appendChild(halo);
    shell.appendChild(core);
    wrap.appendChild(shell);

    return wrap.outerHTML;
  }

  function extractOrbSVG(html) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const svg = doc.querySelector('.dual-orb-svg');
    if (!svg) return null;

    const wrap = doc.querySelector('.dual-orb-wrap');
    const style = wrap.getAttribute('style');
    const size = style.match(/--orb-size:(\d+)px/)?.[1] || '64';

    svg.setAttribute('width', size);
    svg.setAttribute('height', size);
    svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');

    return new XMLSerializer().serializeToString(svg);
  }

  // ============================================================
  //  RENDERIZAÇÃO DE ORBS (automática e manual)
  // ============================================================
  function renderElement(el, options) {
    if (!el) return;
    const name = options?.name ?? getElementOption(el, 'name', currentName || config.defaults.name);
    const size = options?.size ?? getElementOption(el, 'size', config.defaults.size);
    const speaking = options?.speaking !== undefined ? options.speaking : getElementOption(el, 'speaking', config.defaults.speaking);

    const html = makeOrbAvatar(name, size, speaking);
    el.innerHTML = html;
    el.dataset.orbRendered = 'true';
    log('Renderizado em', el, { name, size, speaking });
  }

  function render(selector, options) {
    const els = typeof selector === 'string' ? document.querySelectorAll(selector) : (selector?.nodeType ? [selector] : selector);
    if (!els || els.length === 0) {
      log('Nenhum elemento encontrado para', selector);
      return;
    }
    els.forEach(el => renderElement(el, options));
  }

  function scan() {
    log('Scanning DOM...');
    config.orbSelectors.forEach(sel => {
      document.querySelectorAll(sel).forEach(el => {
        if (el.dataset.orbRendered) return;
        renderElement(el);
      });
    });
  }

  // ============================================================
  //  OBSERVAÇÃO DE MUDANÇAS NO DOM
  // ============================================================
  function observe() {
    if (!config.autoObserve) return;
    if (observer) {
      observer.disconnect();
      observer = null;
    }

    observer = new MutationObserver((mutations) => {
      let needsScan = false;
      for (const mutation of mutations) {
        if (mutation.type === 'childList') {
          for (const node of mutation.addedNodes) {
            if (node.nodeType === Node.ELEMENT_NODE) {
              if (config.orbSelectors.some(sel => node.matches(sel) || node.querySelector(sel))) {
                needsScan = true;
                break;
              }
            }
          }
        }
        if (needsScan) break;
      }
      if (needsScan) scan();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
    log('MutationObserver ativo');
  }

  // ============================================================
  //  SINCRONIZAÇÃO DE NOME E UI (substitui o código antigo)
  // ============================================================
  function getStoredName() {
    for (const key of config.sync.storageKeys) {
      const val = localStorage.getItem(key);
      if (val) return safeName(val);
    }
    return config.defaults.name;
  }

  function setStoredName(name) {
    for (const key of config.sync.storageKeys) {
      localStorage.setItem(key, name);
    }
  }

  function updateRoot(name) {
    const d = compute(name);
    const root = document.documentElement;

    // Define atributo data-arch (ou o que estiver configurado)
    if (config.sync.rootAttr) {
      root.dataset[config.sync.rootAttr] = d.name;
    }
    // Também define dataset.diName por compatibilidade? Vou manter ambos
    root.dataset.diName = d.name;
    // Aplica variáveis CSS
    if (config.sync.rootVars) {
      for (const [varName, fn] of Object.entries(config.sync.rootVars)) {
        if (typeof fn === 'function') {
          root.style.setProperty(varName, fn(d.h1, d.h2));
        } else {
          root.style.setProperty(varName, fn);
        }
      }
    }
    log('Root atualizado para', d.name);
  }

  function updateTextElements(name) {
    const textSelectors = config.sync.textSelectors;
    if (textSelectors) {
      for (const [selector, prop] of Object.entries(textSelectors)) {
        const el = document.querySelector(selector);
        if (el) {
          if (prop === 'textContent') el.textContent = name;
          else el[prop] = name;
        }
      }
    }
  }

  function updateKeyElements() {
    // Obtém a chave ativa de window.STATE (se existir)
    let keyName = '--';
    let badgeText = 'v:--';
    if (global.STATE?.keys) {
      const active = global.STATE.keys.find(k => k.active);
      if (active) {
        keyName = active.name || '--';
        badgeText = `key:${keyName}`;
      }
    }
    const keySelectors = config.sync.keySelectors;
    if (keySelectors) {
      for (const [selector, prop] of Object.entries(keySelectors)) {
        const el = document.querySelector(selector);
        if (el) {
          const value = selector === '#smallIdent' ? keyName : badgeText;
          if (prop === 'textContent') el.textContent = value;
          else el[prop] = value;
        }
      }
    }
    // Armazena a chave ativa para uso posterior
    activeKey = keyName;
  }

  function updateOrbs(name) {
    const orbSelectors = config.sync.orbSelectors;
    if (orbSelectors) {
      for (const [selector, options] of Object.entries(orbSelectors)) {
        const el = document.querySelector(selector);
        if (el) {
          const size = options.size || config.defaults.size;
          const speaking = options.speaking || false;
          // Usa o nome passado, mas se o elemento tiver data-name, prevalece? 
          // Vamos manter o comportamento: se o elemento tiver data-name, não sobrescrevemos.
          const elName = el.dataset.name ? el.dataset.name : name;
          el.innerHTML = makeOrbAvatar(elName, size, speaking);
          el.dataset.orbRendered = 'true';
        }
      }
    }
  }

  function syncName(name) {
    const safe = safeName(name);
    currentName = safe;
    setStoredName(safe);
    updateRoot(safe);
    updateTextElements(safe);
    updateKeyElements();
    updateOrbs(safe);
    // Dispara evento
    document.dispatchEvent(new CustomEvent('orb:name:sync', { detail: { name: safe } }));
    log('Nome sincronizado:', safe);
  }

  // ============================================================
  //  BIND DE INPUTS
  // ============================================================
  function bindInputs() {
    const inputSelectors = config.sync.inputSelectors;
    if (!inputSelectors) return;
    const inputs = [];
    inputSelectors.forEach(sel => {
      const els = document.querySelectorAll(sel);
      els.forEach(el => inputs.push(el));
    });
    if (inputs.length === 0) return;

    const initial = getStoredName();
    inputs.forEach(inp => {
      if (!inp.value) inp.value = initial;
      inp.addEventListener('input', () => {
        syncName(inp.value);
      });
      inp.addEventListener('change', () => {
        syncName(inp.value);
      });
    });

    // Sincroniza inputs quando o nome mudar externamente
    document.addEventListener('orb:name:sync', (e) => {
      const newName = e.detail.name;
      inputs.forEach(inp => {
        if (inp.value !== newName) inp.value = newName;
      });
    });

    // Escuta mudanças no localStorage de outras abas
    window.addEventListener('storage', (e) => {
      if (config.sync.storageKeys.includes(e.key)) {
        const newVal = e.newValue;
        if (newVal) {
          syncName(newVal);
        }
      }
    });

    log('Inputs vinculados:', inputs.length);
  }

  // ============================================================
  //  INICIALIZAÇÃO
  // ============================================================
  function init(opts = {}) {
    Object.assign(config, opts);

    // Carrega nome inicial
    currentName = getStoredName();

    // Injeção de CSS
    if (config.autoInjectCSS) injectStyles();

    // Sincroniza UI inicial
    syncName(currentName);

    // Bind dos inputs
    bindInputs();

    // Escaneia orbs existentes
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        scan();
        if (config.autoObserve) observe();
      });
    } else {
      scan();
      if (config.autoObserve) observe();
    }

    // Escuta evento de atualização de nome (para compatibilidade)
    document.addEventListener('di:name:update', (e) => {
      if (e.detail?.name) syncName(e.detail.name);
    });

    log('OrbEngine inicializado', { config });
    return this;
  }

  // ============================================================
  //  API PÚBLICA
  // ============================================================
  const OrbEngine = {
    config,
    init,
    render,
    scan,
    observe,
    syncName,
    html: makeOrbAvatar,
    svg: extractOrbSVG,
    getName: () => currentName || getStoredName(),
    // Para compatibilidade com o código antigo (window.makeOrbAvatar)
    makeOrbAvatar
  };

  // ============================================================
  //  EXPORTAÇÃO
  // ============================================================
  global.Orb = OrbEngine;
  global.OrbEngine = OrbEngine;
  // Mantém a função global para compatibilidade com scripts que esperam window.makeOrbAvatar
  global.makeOrbAvatar = makeOrbAvatar;

  // Inicialização automática se atributo data-auto-init não for "false"
  if (document.currentScript && document.currentScript.dataset.autoInit !== 'false') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => OrbEngine.init());
    } else {
      OrbEngine.init();
    }
  }

})(typeof window !== 'undefined' ? window : this);
