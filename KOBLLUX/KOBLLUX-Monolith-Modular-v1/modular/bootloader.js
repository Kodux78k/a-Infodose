/**
 * KOBLLUX Modular Bootloader
 * - Monta fragmentos HTML preservando os nós enquanto alterna módulos.
 * - Carrega os scripts do monólito na ordem original, mantendo APIs legadas.
 * - Symbol Bar recebe controles dos módulos disponíveis.
 */
import { coreGroup } from './groups/core.js';
import { appModules } from './groups/apps.js';
import { legacyScripts } from './groups/legacy.js';

const ROOT = new URL('.', import.meta.url);
const abs = p => new URL(p, ROOT).href;
const fetchText = async p => {
  const r = await fetch(abs(p), { cache: 'no-cache' });
  if (!r.ok) throw new Error(`Falha ao carregar ${p}: ${r.status}`);
  return r.text();
};
const cssManifest = JSON.parse(await fetchText('./assets/css-manifest.json'));
const scriptManifest = legacyScripts;
const mountedCore = [];
const appNodes = new Map();
const appFragments = new Map();
const appState = new Map();

function addStyles() {
  cssManifest.forEach((entry, i) => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = abs(`./assets/css/${entry.file}`);
    link.dataset.kobModularCss = String(i);
    const attrs = entry.attrs || {};
    if (attrs.id) link.id = attrs.id;
    if (attrs.media) link.media = attrs.media;
    if (attrs['data-k-id']) link.dataset.kId = attrs['data-k-id'];
    if (attrs['data-inlined-from']) link.dataset.inlinedFrom = attrs['data-inlined-from'];
    document.head.appendChild(link);
  });
}

async function parseFragment(path) {
  const html = await fetchText(path);
  const t = document.createElement('template');
  t.innerHTML = html.trim();
  return t.content;
}

async function mountCore() {
  for (const item of coreGroup.fragments) {
    const frag = await parseFragment(item.file);
    const nodes = [...frag.childNodes];
    document.body.append(frag);
    mountedCore.push({ id: item.id, nodes });
  }
}

async function prepareApps() {
  for (const mod of appModules) {
    const frag = await parseFragment(mod.fragment);
    const root = [...frag.children][0];
    if (!root) continue;
    appNodes.set(mod.id, root);
    appFragments.set(mod.id, document.createDocumentFragment());
    appState.set(mod.id, false);
  }
}

function findAppHost() {
  return document.getElementById('kob-module-hosts') ||
    document.querySelector('section.app') || document.body;
}

function syncButton(mod) {
  const b = document.querySelector(`[data-kob-module-toggle="${CSS.escape(mod.id)}"]`);
  if (!b) return;
  const on = !!appState.get(mod.id);
  b.setAttribute('aria-pressed', String(on));
  b.dataset.active = on ? '1' : '0';
  b.textContent = `${on ? '−' : '+'} ${mod.label}`;
}

async function mountApp(id) {
  const mod = appModules.find(x => x.id === id);
  const node = appNodes.get(id);
  if (!mod || !node) return false;
  if (appState.get(id)) return true;
  findAppHost().appendChild(node);
  appState.set(id, true);
  syncButton(mod);
  document.dispatchEvent(new CustomEvent('kob:module-mount', { detail: { id, node } }));
  return true;
}

function unmountApp(id) {
  const mod = appModules.find(x => x.id === id);
  const node = appNodes.get(id);
  if (!mod || !node || !appState.get(id)) return false;
  appFragments.get(id).appendChild(node); // conserva o mesmo nó, estado e listeners
  appState.set(id, false);
  syncButton(mod);
  document.dispatchEvent(new CustomEvent('kob:module-unmount', { detail: { id, node } }));
  return true;
}

async function toggleApp(id) {
  return appState.get(id) ? unmountApp(id) : mountApp(id);
}

function buildSymbolBarControls() {
  const bar = document.getElementById('symbolBar');
  if (!bar || document.getElementById('kobModuleActions')) return;
  const box = document.createElement('div');
  box.id = 'kobModuleActions';
  box.className = 'kob-module-actions';
  box.setAttribute('aria-label', 'Módulos montáveis');
  box.innerHTML = '<div class="kob-module-actions-title">MÓDULOS</div><div class="kob-module-actions-list"></div>';
  const list = box.querySelector('.kob-module-actions-list');
  for (const mod of appModules) {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'sb-act kob-module-toggle';
    b.dataset.kobModuleToggle = mod.id;
    b.addEventListener('click', () => toggleApp(mod.id));
    list.appendChild(b);
    syncButton(mod);
  }
  const anchor = document.getElementById('sbExtrasHead') || bar.firstElementChild;
  anchor.insertAdjacentElement('afterend', box);
  appModules.forEach(syncButton);
}

async function loadLegacyScripts() {
  for (const item of scriptManifest) {
    const attrs = item.attrs || {};
    const script = document.createElement('script');
    Object.entries(attrs).forEach(([k, v]) => {
      if (k === 'src' || k === 'async' || k === 'defer') return;
      if (v === '' || v === true) script.setAttribute(k, '');
      else if (Array.isArray(v)) script.setAttribute(k, v.join(' '));
      else script.setAttribute(k, String(v));
    });
    const type = item.type || attrs.type || 'text/javascript';
    if (type) script.type = type;
    if (item.src) {
      script.async = false;
      script.src = item.src;
      await new Promise(resolve => {
        let settled = false;
        const done = () => { if (!settled) { settled = true; resolve(); } };
        script.onload = done;
        script.onerror = done;
        setTimeout(done, 20000);
        document.body.appendChild(script);
      });
    } else if (item.file) {
      const code = await fetchText(item.file);
      script.textContent = code;
      if (type === 'module') {
        await new Promise(resolve => {
          let settled = false;
          const done = () => { if (!settled) { settled = true; resolve(); } };
          script.onload = done;
          script.onerror = done;
          setTimeout(done, 20000);
          document.body.appendChild(script);
        });
      } else {
        document.body.appendChild(script);
      }
    }
  }
}

function exposeAPI() {
  window.KOBModules = {
    list: () => appModules.map(m => ({ ...m, mounted: !!appState.get(m.id) })),
    mount: mountApp,
    unmount: unmountApp,
    toggle: toggleApp,
    mountAll: () => Promise.all(appModules.map(m => mountApp(m.id))),
    unmountAll: () => appModules.forEach(m => unmountApp(m.id)),
    isMounted: id => !!appState.get(id),
    core: mountedCore
  };
  window.KOBBoot = { version: '1.0.0-modular', status: 'ready', modules: window.KOBModules };
}

function addModularStyles() {
  const style = document.createElement('style');
  style.id = 'kob-modular-controls-css';
  style.textContent = `
    #kobModuleActions{display:flex;flex-direction:column;gap:7px;padding:8px 6px;margin:6px 0;border:1px solid rgba(255,255,255,.10);border-radius:14px;background:rgba(255,255,255,.035)}
    #kobModuleActions .kob-module-actions-title{font:700 9px/1.2 system-ui;letter-spacing:.16em;opacity:.62;padding:0 4px}
    #kobModuleActions .kob-module-actions-list{display:flex;flex-wrap:wrap;gap:5px}
    #kobModuleActions .kob-module-toggle{width:auto;min-width:62px;height:27px;padding:0 9px;border-radius:999px;font:600 9px/1 system-ui;white-space:nowrap;border:1px solid color-mix(in srgb,var(--kob-voice-primary,#78e3ff) 28%,transparent);background:color-mix(in srgb,var(--kob-voice-primary,#78e3ff) 9%,transparent);color:var(--ink,#eaf6ff)}
    #kobModuleActions .kob-module-toggle[data-active="1"]{border-color:color-mix(in srgb,var(--kob-voice-primary,#78e3ff) 62%,transparent);background:color-mix(in srgb,var(--kob-voice-primary,#78e3ff) 20%,transparent)}
  `;
  document.head.appendChild(style);
}

async function start() {
  addStyles();
  await mountCore();
  await prepareApps();
  // A reconstrução inicial ativa todos os módulos para equivaler ao monólito.
  for (const mod of appModules) await mountApp(mod.id);
  addModularStyles();
  buildSymbolBarControls();
  exposeAPI();
  await loadLegacyScripts();
  document.documentElement.dataset.kobModular = 'ready';
  document.dispatchEvent(new CustomEvent('kob:modular-ready'));
}
start().catch(err => {
  console.error('[KOB Modular Bootloader]', err);
  document.documentElement.dataset.kobModular = 'error';
  const box = document.createElement('pre');
  box.textContent = 'KOB Modular Bootloader: ' + (err?.message || err);
  box.style.cssText = 'white-space:pre-wrap;color:#ff8b8b;padding:16px';
  document.body.appendChild(box);
});
