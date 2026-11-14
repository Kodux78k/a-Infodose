
/**
 * KOBLLUX MODULAR BOOTLOADER
 * CORE FULL + APPS OPTIONAL
 *
 * CORE: todos os fragmentos.
 * APPS: opcional.
 * CSS: manifesto completo.
 * LEGACY: execução sequencial.
 * MOUNT / UNMOUNT: preserva os nós DOM.
 * SYMBOLBAR: sem injeção automática de controles.
 */

import { coreGroup } from './groups/core.js';
import { appModules } from './groups/apps.js';
import { legacyScripts } from './groups/legacy.js';

/* =========================================
   CONFIGURAÇÃO
========================================= */

const BOOT = {
  CORE: true,
  APPS: false,

  CORE_ALL: true,
  APPS_ALL: false,

  CSS_ALL: true,
  LEGACY_ALL: true,

  SYMBOLBAR_MODULES: false,

  VERSION: '2.1.0-CORE-FULL'
};

const ROOT = new URL('.', import.meta.url);

const abs = path => new URL(path, ROOT).href;

const fetchText = async path => {
  const response = await fetch(abs(path), {
    cache: 'default'
  });

  if (!response.ok) {
    throw new Error(
      `Falha ao carregar ${path}: ${response.status}`
    );
  }

  return response.text();
};

/* =========================================
   MANIFESTOS
========================================= */

const cssManifest = JSON.parse(
  await fetchText('./assets/css-manifest.json')
);

const scriptManifest = legacyScripts;

/* =========================================
   ESTADO
========================================= */

const coreNodes = new Map();
const coreFragments = new Map();
const coreState = new Map();

const appNodes = new Map();
const appFragments = new Map();
const appState = new Map();

const loadedScripts = new Set();
const loadedStyles = new Set();

const mountedCore = [];

/* =========================================
   CSS
========================================= */

function addStyles() {
  if (!BOOT.CSS_ALL) return;

  for (const entry of cssManifest) {
    if (loadedStyles.has(entry.file)) continue;

    const link = document.createElement('link');

    link.rel = 'stylesheet';
    link.href = abs(`./assets/css/${entry.file}`);

    const attrs = entry.attrs || {};

    if (attrs.id) link.id = attrs.id;
    if (attrs.media) link.media = attrs.media;

    if (attrs['data-k-id']) {
      link.dataset.kId = attrs['data-k-id'];
    }

    if (attrs['data-inlined-from']) {
      link.dataset.inlinedFrom =
        attrs['data-inlined-from'];
    }

    link.dataset.kobModularCss = entry.file;

    document.head.appendChild(link);

    loadedStyles.add(entry.file);
  }
}

/* =========================================
   FRAGMENTOS HTML
========================================= */

async function parseFragment(path) {
  const html = await fetchText(path);

  const template = document.createElement('template');

  template.innerHTML = html.trim();

  return template.content;
}

/* =========================================
   CORE COMPLETO
========================================= */

async function prepareCore() {
  if (!BOOT.CORE) return;

  for (const item of coreGroup.fragments) {
    const id = String(item.id);

    if (coreNodes.has(id)) continue;

    const fragment = await parseFragment(item.file);

    const nodes = [...fragment.childNodes];

    const holding = document.createDocumentFragment();

    nodes.forEach(node => holding.appendChild(node));

    coreNodes.set(id, nodes);
    coreFragments.set(id, holding);
    coreState.set(id, false);

    mountedCore.push({
      id: item.id,
      file: item.file,
      nodes
    });
  }
}

function mountCore(id) {
  id = String(id);

  const nodes = coreNodes.get(id);
  const holding = coreFragments.get(id);

  if (!nodes || !holding) return false;

  if (coreState.get(id)) return true;

  document.body.appendChild(holding);

  coreState.set(id, true);

  document.dispatchEvent(
    new CustomEvent('kob:module-mount', {
      detail: {
        id,
        group: 'core',
        nodes
      }
    })
  );

  return true;
}

function unmountCore(id) {
  id = String(id);

  const nodes = coreNodes.get(id);
  const holding = coreFragments.get(id);

  if (!nodes || !holding) return false;

  if (!coreState.get(id)) return true;

  nodes.forEach(node => holding.appendChild(node));

  coreState.set(id, false);

  document.dispatchEvent(
    new CustomEvent('kob:module-unmount', {
      detail: {
        id,
        group: 'core',
        nodes
      }
    })
  );

  return true;
}

async function mountAllCore() {
  for (const item of coreGroup.fragments) {
    mountCore(item.id);
  }
}

function unmountAllCore() {
  for (const item of coreGroup.fragments) {
    unmountCore(item.id);
  }
}

/* =========================================
   APPS OPCIONAIS
========================================= */

function findAppHost() {
  return (
    document.getElementById('kob-module-hosts') ||
    document.querySelector('section.app') ||
    document.body
  );
}

async function prepareApps() {
  if (!BOOT.APPS) return;

  for (const mod of appModules) {
    if (appNodes.has(mod.id)) continue;

    const fragment = await parseFragment(mod.fragment);

    const root = [...fragment.children][0];

    if (!root) continue;

    const holding = document.createDocumentFragment();

    holding.appendChild(root);

    appNodes.set(mod.id, root);
    appFragments.set(mod.id, holding);
    appState.set(mod.id, false);
  }
}

function syncButton(mod) {
  const button = document.querySelector(
    `[data-kob-module-toggle="${CSS.escape(mod.id)}"]`
  );

  if (!button) return;

  const active = !!appState.get(mod.id);

  button.setAttribute('aria-pressed', String(active));
  button.dataset.active = active ? '1' : '0';

  button.textContent =
    `${active ? '−' : '+'} ${mod.label}`;
}

function mountApp(id) {
  if (!BOOT.APPS) return false;

  const mod = appModules.find(x => x.id === id);
  const node = appNodes.get(id);

  if (!mod || !node) return false;
  if (appState.get(id)) return true;

  findAppHost().appendChild(
    appFragments.get(id)
  );

  appState.set(id, true);

  syncButton(mod);

  document.dispatchEvent(
    new CustomEvent('kob:module-mount', {
      detail: {
        id,
        group: 'apps',
        node
      }
    })
  );

  return true;
}

function unmountApp(id) {
  const mod = appModules.find(x => x.id === id);
  const node = appNodes.get(id);

  if (!mod || !node || !appState.get(id)) {
    return false;
  }

  appFragments.get(id).appendChild(node);

  appState.set(id, false);

  syncButton(mod);

  document.dispatchEvent(
    new CustomEvent('kob:module-unmount', {
      detail: {
        id,
        group: 'apps',
        node
      }
    })
  );

  return true;
}

function toggleApp(id) {
  return appState.get(id)
    ? unmountApp(id)
    : mountApp(id);
}

async function mountAllApps() {
  if (!BOOT.APPS) return;

  for (const mod of appModules) {
    mountApp(mod.id);
  }
}

function unmountAllApps() {
  for (const mod of appModules) {
    unmountApp(mod.id);
  }
}

/* =========================================
   SYMBOL BAR OPCIONAL
========================================= */

function buildSymbolBarControls() {
  if (!BOOT.SYMBOLBAR_MODULES || !BOOT.APPS) {
    return;
  }

  const bar = document.getElementById('symbolBar');

  if (!bar || document.getElementById('kobModuleActions')) {
    return;
  }

  const box = document.createElement('div');

  box.id = 'kobModuleActions';
  box.className = 'kob-module-actions';

  box.innerHTML = `
    <div class="kob-module-actions-title">
      MÓDULOS
    </div>
    <div class="kob-module-actions-list"></div>
  `;

  const list = box.querySelector(
    '.kob-module-actions-list'
  );

  for (const mod of appModules) {
    const button = document.createElement('button');

    button.type = 'button';
    button.className = 'sb-act kob-module-toggle';
    button.dataset.kobModuleToggle = mod.id;

    button.addEventListener('click', () => {
      toggleApp(mod.id);
    });

    list.appendChild(button);

    syncButton(mod);
  }

  const anchor =
    document.getElementById('sbExtrasHead') ||
    bar.firstElementChild;

  if (anchor) {
    anchor.insertAdjacentElement('afterend', box);
  } else {
    bar.appendChild(box);
  }
}

/* =========================================
   SCRIPTS LEGADOS
========================================= */

async function loadOneLegacy(item) {
  const attrs = item.attrs || {};

  const source = item.src || item.file || '';

  const key = source || item.id;

  if (key && loadedScripts.has(key)) return;

  const type =
    item.type ||
    attrs.type ||
    'text/javascript';

  // ES Modules: importação real, com await.
  if (type === 'module') {
    const path = item.src || item.file;

    if (!path) return;

    await import(abs(path));

    if (key) loadedScripts.add(key);

    return;
  }

  // Script externo clássico.
  if (item.src) {
    const script = document.createElement('script');

    Object.entries(attrs).forEach(([k, v]) => {
      if (['src', 'async', 'defer'].includes(k)) return;

      if (v === '' || v === true) {
        script.setAttribute(k, '');
      } else if (Array.isArray(v)) {
        script.setAttribute(k, v.join(' '));
      } else {
        script.setAttribute(k, String(v));
      }
    });

    script.async = false;
    script.src = item.src;

    await new Promise((resolve, reject) => {
      script.onload = resolve;

      script.onerror = () => {
        reject(
          new Error(`Falha no script: ${item.src}`)
        );
      };

      document.body.appendChild(script);
    });

    if (key) loadedScripts.add(key);

    return;
  }

  // Script local clássico.
  if (item.file) {
    const code = await fetchText(item.file);

    const script = document.createElement('script');

    Object.entries(attrs).forEach(([k, v]) => {
      if (['src', 'async', 'defer', 'type'].includes(k)) {
        return;
      }

      if (v === '' || v === true) {
        script.setAttribute(k, '');
      } else {
        script.setAttribute(k, String(v));
      }
    });

    script.textContent = code;

    document.body.appendChild(script);

    if (key) loadedScripts.add(key);
  }
}

async function loadLegacyScripts() {
  if (!BOOT.LEGACY_ALL) return;

  for (const item of scriptManifest) {
    try {
      await loadOneLegacy(item);
    } catch (error) {
      console.error(
        '[KOB LEGACY]',
        item.file || item.src,
        error
      );

      // Continua para o próximo script.
    }
  }
}

/* =========================================
   API GLOBAL
========================================= */

function exposeAPI() {
  window.KOBModules = {

    list: () => [
      ...coreGroup.fragments.map(item => ({
        ...item,
        group: 'core',
        mounted: !!coreState.get(String(item.id))
      })),

      ...(BOOT.APPS
        ? appModules.map(item => ({
            ...item,
            group: 'apps',
            mounted: !!appState.get(item.id)
          }))
        : [])
    ],

    mount: id => {
      const key = String(id);

      if (coreNodes.has(key)) {
        return mountCore(key);
      }

      return mountApp(id);
    },

    unmount: id => {
      const key = String(id);

      if (coreNodes.has(key)) {
        return unmountCore(key);
      }

      return unmountApp(id);
    },

    toggle: id => {
      const key = String(id);

      if (coreNodes.has(key)) {
        return coreState.get(key)
          ? unmountCore(key)
          : mountCore(key);
      }

      return toggleApp(id);
    },

    mountAll: async () => {
      await mountAllCore();
      await mountAllApps();
    },

    unmountAll: () => {
      unmountAllApps();
      unmountAllCore();
    },

    mountCore: mountAllCore,
    unmountCore: unmountAllCore,

    mountApps: mountAllApps,
    unmountApps: unmountAllApps,

    isMounted: id => {
      const key = String(id);

      if (coreState.has(key)) {
        return !!coreState.get(key);
      }

      return !!appState.get(id);
    },

    core: mountedCore,

    config: BOOT
  };

  window.KOBBoot = {
    version: BOOT.VERSION,
    status: 'ready',
    mode: 'core-full',
    modules: window.KOBModules
  };
}

/* =========================================
   START
========================================= */

async function start() {
  try {
    console.time('[KOB] Boot');

    console.info('[KOB] Inicializando...');

    // 1. CSS completo.
    addStyles();

    // 2. Prepara todos os fragmentos Core.
    await prepareCore();

    // 3. Monta todos os fragmentos Core.
    if (BOOT.CORE_ALL) {
      await mountAllCore();
    }

    // 4. Apps são opcionais.
    if (BOOT.APPS) {
      await prepareApps();

      if (BOOT.APPS_ALL) {
        await mountAllApps();
      }
    }

    // 5. SymbolBar opcional.
    buildSymbolBarControls();

    // 6. Expõe a API.
    exposeAPI();

    // 7. Scripts legados em sequência.
    await loadLegacyScripts();

    // 8. Finalização.
    document.documentElement.dataset.kobModular = 'ready';

    document.dispatchEvent(
      new CustomEvent('kob:modular-ready')
    );

    console.info(
      '[KOB] CORE:',
      coreGroup.fragments.length,
      'fragmentos'
    );

    console.info('[KOB] Inicialização concluída.');

    console.timeEnd('[KOB] Boot');

  } catch (error) {
    console.error('[KOB Modular Bootloader]', error);

    document.documentElement.dataset.kobModular = 'error';

    const box = document.createElement('pre');

    box.textContent =
      'KOB Modular Bootloader: ' + error.message;

    box.style.cssText = `
      white-space:pre-wrap;
      color:#ff8b8b;
      padding:16px;
    `;

    document.body.appendChild(box);
  }
}

start();
