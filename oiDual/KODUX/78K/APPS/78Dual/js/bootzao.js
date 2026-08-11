/* ============================================================
   KODUX BOOTLOADER v2
   Almasliber OS / Dual Infodose
   ============================================================
   ENTRADA:
   <script
     type="module"
     src="https://infodose.com.br/oiDual/KODUX/78K/APPS/78Dual/js/kodux-bootloader.js">
   </script>
   FILOSOFIA:
   CSS
      ↓
   LEGACY 0 → 1 → 2 → 3
      ↓
   MODULES
      ↓
   READY
   MÓDULOS ES podem ser carregados sob demanda:
      await KODUX.import(url)
   ou:
      await KODUX.lazy('nebula', url)
   ============================================================ */
(() => {
  'use strict';
  /* ==========================================================
     BASE
     ========================================================== */
  const ROOT =
    'https://infodose.com.br/oiDual/KODUX/78K/APPS/78Dual/';
  const MODULE_ROOT = `${ROOT}js/modules/`;
  const CSS_ROOT = `${ROOT}css/`;
  /* ==========================================================
     CONFIGURAÇÃO
     ========================================================== */
  const CONFIG = {
    /*
     * Scripts antigos / globais.
     *
     * São carregados com <script> e em ordem.
     */
    legacy: [
      /*
       * Basta editar:
         [0, 1, 2, 3]
       * ou:
         [0, 2]
       * ou:
         [0, 1]
       */
      0,
      1,
      2,
      3
    ],
    /*
     * CSS.
     *
     * Todos começam a carregar em paralelo.
     */
    css: [
      'main'
      /*
      ,
      'kob-glass-0'
      */
    ],
    /*
     * CSS externos.
     */
    externalCSS: [
      'https://kodux78k.github.io/oi-Dual/css/main.css',
      'https://kodux78k.github.io/oiDual--Y-/css/kob-glass-0.css'
    ],
    /*
     * Módulos ES que devem entrar durante o boot.
     *
     * Exemplo:
       modules: [
         {
           id: 'theme',
           src: 'https://exemplo.com/theme.js'
         }
       ]
     */
    modules: [],
    /*
     * Lazy modules.
     *
     * NÃO são carregados no boot.
     *
     * Exemplo:
       lazy: {
         nebula:
           `${MODULE_ROOT}nebula.js`
       }
     */
    lazy: {},
    /*
     * Alvos.
     */
    targets: {
      legacy: 'head',
      css: 'head'
    },
    /*
     * Opções.
     */
    options: {
      /*
       * Legacy sempre em ordem.
       */
      sequentialLegacy: true,
      /*
       * Se um arquivo falhar,
       * continua o boot.
       */
      continueOnError: true,
      /*
       * Console.
       */
      debug: true,
      /*
       * Esperar DOMContentLoaded.
       */
      waitForDOM: true
    }
  };
  /* ==========================================================
     ESTADO
     ========================================================== */
  const STATE = {
    started: false,
    ready: false,
    loading: new Map(),
    loaded: new Set(),
    failed: new Set(),
    legacy: new Map(),
    modules: new Map(),
    css: new Map(),
    lazy: new Map(),
    overrides: new Map(),
    bootPromise: null
  };
  /* ==========================================================
     NAMESPACE
     ========================================================== */
  const KODUX = window.KODUX = window.KODUX || {};
  KODUX.version = '2.0.0';
  KODUX.root = ROOT;
  KODUX.config = CONFIG;
  KODUX.state = STATE;
  /* ==========================================================
     LOG
     ========================================================== */
  function log(...args) {
    if (!CONFIG.options.debug) return;
    console.log('[KODUX]', ...args);
  }
  function warn(...args) {
    console.warn('[KODUX]', ...args);
  }
  function error(...args) {
    console.error('[KODUX]', ...args);
  }
  /* ==========================================================
     EVENTOS
     ========================================================== */
  function emit(name, detail = {}) {
    document.dispatchEvent(
      new CustomEvent(
        `KODUX:${name}`,
        {
          detail: {
            ...detail,
            state: STATE
          }
        }
      )
    );
  }
  /* ==========================================================
     NORMALIZA URL
     ========================================================== */
  function normalizeURL(url) {
    try {
      return new URL(
        url,
        document.baseURI
      ).href;
    } catch {
      return String(url);
    }
  }
  /* ==========================================================
     TARGET
     ========================================================== */
  function resolveTarget(target) {
    if (!target || target === 'head') {
      return document.head;
    }
    if (target === 'body') {
      return (
        document.body ||
        document.documentElement
      );
    }
    if (target instanceof Element) {
      return target;
    }
    const element =
      document.querySelector(target);
    if (element) {
      return element;
    }
    warn(
      `Target não encontrado: ${target}`
    );
    return document.head;
  }
  /* ==========================================================
     EXISTÊNCIA
     ========================================================== */
  function exists(url) {
    const normalized =
      normalizeURL(url);
    if (STATE.loaded.has(normalized)) {
      return true;
    }
    if (STATE.loading.has(normalized)) {
      return true;
    }
    /*
     * SCRIPT
     */
    for (const script of document.scripts) {
      if (
        script.src &&
        normalizeURL(script.src) === normalized
      ) {
        STATE.loaded.add(normalized);
        return true;
      }
    }
    /*
     * CSS
     */
    for (
      const link of
      document.querySelectorAll(
        'link[rel="stylesheet"]'
      )
    ) {
      if (
        link.href &&
        normalizeURL(link.href) === normalized
      ) {
        STATE.loaded.add(normalized);
        return true;
      }
    }
    return false;
  }
  /* ==========================================================
     LOAD LEGACY SCRIPT
     ========================================================== */
  function loadLegacy(src, options = {}) {
    const url =
      normalizeURL(src);
    /*
     * Já carregado.
     */
    if (exists(url)) {
      log(
        '↻ legacy já carregado:',
        url
      );
      return Promise.resolve({
        src: url,
        cached: true
      });
    }
    /*
     * Já está carregando.
     */
    if (
      STATE.loading.has(url)
    ) {
      return STATE.loading.get(url);
    }
    const promise =
      new Promise(
        (resolve, reject) => {
          const script =
            document.createElement(
              'script'
            );
          script.src = url;
          /*
           * Script clássico.
           */
          script.async = false;
          script.dataset.kodux =
            'legacy';
          if (options.id) {
            script.dataset.koduxId =
              options.id;
          }
          script.onload = () => {
            STATE.loading.delete(url);
            STATE.loaded.add(url);
            if (options.id) {
              STATE.legacy.set(
                options.id,
                {
                  src: url,
                  element: script
                }
              );
            }
            log(
              '✓ LEGACY:',
              url
            );
            emit(
              'legacy:loaded',
              {
                src: url,
                id: options.id
              }
            );
            resolve({
              src: url,
              element: script
            });
          };
          script.onerror = () => {
            STATE.loading.delete(url);
            STATE.failed.add(url);
            const err =
              new Error(
                `Falha ao carregar: ${url}`
              );
            error(
              '✕ LEGACY:',
              url
            );
            emit(
              'legacy:error',
              {
                src: url,
                id: options.id,
                error: err
              }
            );
            if (
              CONFIG.options.continueOnError
            ) {
              resolve({
                src: url,
                error: err
              });
            } else {
              reject(err);
            }
          };
          resolveTarget(
            options.target ||
            CONFIG.targets.legacy
          ).appendChild(
            script
          );
        }
      );
    STATE.loading.set(
      url,
      promise
    );
    return promise;
  }
  /* ==========================================================
     LOAD CSS
     ========================================================== */
  function loadCSS(href, options = {}) {
    const url =
      normalizeURL(href);
    if (exists(url)) {
      log(
        '↻ CSS já carregado:',
        url
      );
      return Promise.resolve({
        src: url,
        cached: true
      });
    }
    if (
      STATE.loading.has(url)
    ) {
      return STATE.loading.get(url);
    }
    const promise =
      new Promise(
        (resolve, reject) => {
          const link =
            document.createElement(
              'link'
            );
          link.rel =
            'stylesheet';
          link.href =
            url;
          link.dataset.kodux =
            'css';
          if (options.id) {
            link.dataset.koduxId =
              options.id;
          }
          link.onload = () => {
            STATE.loading.delete(url);
            STATE.loaded.add(url);
            if (options.id) {
              STATE.css.set(
                options.id,
                {
                  src: url,
                  element: link
                }
              );
            }
            log(
              '✓ CSS:',
              url
            );
            emit(
              'css:loaded',
              {
                src: url,
                id: options.id
              }
            );
            resolve({
              src: url,
              element: link
            });
          };
          link.onerror = () => {
            STATE.loading.delete(url);
            STATE.failed.add(url);
            const err =
              new Error(
                `Falha ao carregar CSS: ${url}`
              );
            error(
              '✕ CSS:',
              url
            );
            emit(
              'css:error',
              {
                src: url,
                id: options.id,
                error: err
              }
            );
            if (
              CONFIG.options.continueOnError
            ) {
              resolve({
                src: url,
                error: err
              });
            } else {
              reject(err);
            }
          };
          resolveTarget(
            options.target ||
            CONFIG.targets.css
          ).appendChild(
            link
          );
        }
      );
    STATE.loading.set(
      url,
      promise
    );
    return promise;
  }
  /* ==========================================================
     LOAD ES MODULE
     ========================================================== */
  async function importModule(
    src,
    options = {}
  ) {
    const url =
      normalizeURL(src);
    /*
     * Se já existe uma importação
     * desse módulo, reutiliza a Promise.
     */
    if (
      STATE.modules.has(url)
    ) {
      return STATE.modules.get(
        url
      );
    }
    if (
      STATE.loading.has(url)
    ) {
      return STATE.loading.get(
        url
      );
    }
    const promise =
      import(url)
        .then(module => {
          STATE.loading.delete(url);
          STATE.loaded.add(url);
          STATE.modules.set(
            url,
            module
          );
          if (options.id) {
            STATE.modules.set(
              options.id,
              module
            );
          }
          log(
            '✓ MODULE:',
            url
          );
          emit(
            'module:loaded',
            {
              src: url,
              id: options.id,
              module
            }
          );
          return module;
        })
        .catch(err => {
          STATE.loading.delete(url);
          STATE.failed.add(url);
          error(
            '✕ MODULE:',
            url,
            err
          );
          emit(
            'module:error',
            {
              src: url,
              id: options.id,
              error: err
            }
          );
          if (
            CONFIG.options.continueOnError
          ) {
            return {
              error: err
            };
          }
          throw err;
        });
    STATE.loading.set(
      url,
      promise
    );
    return promise;
  }
  /* ==========================================================
     LAZY MODULE
     ========================================================== */
  function lazy(
    name,
    src,
    options = {}
  ) {
    const url =
      normalizeURL(src);
    if (
      STATE.lazy.has(name)
    ) {
      return STATE.lazy.get(name);
    }
    let promise = null;
    const loader = async () => {
      if (!promise) {
        log(
          '⚡ LAZY:',
          name
        );
        promise =
          importModule(
            url,
            {
              ...options,
              id: name
            }
          );
      }
      return promise;
    };
    STATE.lazy.set(
      name,
      loader
    );
    return loader;
  }
  /* ==========================================================
     LOAD CONFIGURED CSS
     ========================================================== */
  function loadConfiguredCSS() {
    const tasks = [];
    /*
     * CSS interno.
     */
    for (
      const name of CONFIG.css
    ) {
      tasks.push(
        loadCSS(
          `${CSS_ROOT}${name}.css`,
          {
            id: `css:${name}`,
            target:
              CONFIG.targets.css
          }
        )
      );
    }
    /*
     * CSS externo.
     */
    for (
      let i = 0;
      i < CONFIG.externalCSS.length;
      i++
    ) {
      tasks.push(
        loadCSS(
          CONFIG.externalCSS[i],
          {
            id: `external-css:${i}`,
            target:
              CONFIG.targets.css
          }
        )
      );
    }
    /*
     * CSS é independente.
     * Tudo pode baixar em paralelo.
     */
    return Promise.all(tasks);
  }
  /* ==========================================================
     LOAD CONFIGURED LEGACY
     ========================================================== */
  async function loadConfiguredLegacy() {
    const list =
      Array.isArray(
        CONFIG.legacy
      )
        ? CONFIG.legacy
        : [];
    /*
     * Ordem garantida.
     */
    if (
      CONFIG.options.sequentialLegacy
    ) {
      for (
        const index of list
      ) {
        await loadLegacy(
          `${MODULE_ROOT}inline-${index}.js`,
          {
            id:
              `inline-${index}`,
            target:
              CONFIG.targets.legacy
          }
        );
      }
      return;
    }
    /*
     * Paralelo.
     */
    await Promise.all(
      list.map(index =>
        loadLegacy(
          `${MODULE_ROOT}inline-${index}.js`,
          {
            id:
              `inline-${index}`,
            target:
              CONFIG.targets.legacy
          }
        )
      )
    );
  }
  /* ==========================================================
     LOAD CONFIGURED MODULES
     ========================================================== */
  async function loadConfiguredModules() {
    if (
      !Array.isArray(
        CONFIG.modules
      )
    ) {
      return;
    }
    for (
      const item
      of CONFIG.modules
    ) {
      if (
        !item ||
        !item.src
      ) {
        continue;
      }
      await importModule(
        item.src,
        {
          id: item.id
        }
      );
    }
  }
  /* ==========================================================
     WAIT DOM
     ========================================================== */
  function waitDOM() {
    if (
      document.readyState !==
      'loading'
    ) {
      return Promise.resolve();
    }
    return new Promise(
      resolve => {
        document.addEventListener(
          'DOMContentLoaded',
          resolve,
          {
            once: true
          }
        );
      }
    );
  }
  /* ==========================================================
     WAIT FUNCTION
     ========================================================== */
  function waitFor(
    name,
    timeout = 10000
  ) {
    return new Promise(
      (resolve, reject) => {
        const started =
          performance.now();
        function check() {
          if (
            typeof window[name] ===
            'function'
          ) {
            resolve(
              window[name]
            );
            return;
          }
          if (
            performance.now() -
              started >=
            timeout
          ) {
            reject(
              new Error(
                `Timeout esperando ${name}`
              )
            );
            return;
          }
          requestAnimationFrame(
            check
          );
        }
        check();
      }
    );
  }
  /* ==========================================================
     OVERRIDE
     ========================================================== */
  function override(
    name,
    replacement
  ) {
    const previous =
      window[name];
    STATE.overrides.set(
      name,
      {
        previous,
        replacement
      }
    );
    window[name] =
      replacement;
    log(
      '⚡ OVERRIDE:',
      name
    );
    emit(
      'override',
      {
        name,
        previous,
        replacement
      }
    );
    return previous;
  }
  /* ==========================================================
     PATCH
     ========================================================== */
  function patch(
    name,
    wrapper
  ) {
    const original =
      window[name];
    if (
      typeof original !==
      'function'
    ) {
      warn(
        `patch ignorado: ${name} não é função`
      );
      return false;
    }
    if (
      original.__koduxPatched
    ) {
      warn(
        `patch já aplicado: ${name}`
      );
      return original;
    }
    const patched =
      wrapper(original);
    if (
      typeof patched !==
      'function'
    ) {
      warn(
        `patch inválido: ${name}`
      );
      return false;
    }
    Object.defineProperty(
      patched,
      '__koduxPatched',
      {
        value: true
      }
    );
    Object.defineProperty(
      patched,
      '__koduxOriginal',
      {
        value: original
      }
    );
    window[name] =
      patched;
    STATE.overrides.set(
      name,
      {
        previous: original,
        replacement: patched
      }
    );
    log(
      '⚡ PATCH:',
      name
    );
    emit(
      'patch',
      {
        name,
        original,
        patched
      }
    );
    return patched;
  }
  /* ==========================================================
     STATUS
     ========================================================== */
  function status() {
    return {
      version:
        KODUX.version,
      started:
        STATE.started,
      ready:
        STATE.ready,
      loaded:
        [
          ...STATE.loaded
        ],
      failed:
        [
          ...STATE.failed
        ],
      legacy:
        [
          ...STATE.legacy.keys()
        ],
      modules:
        [
          ...STATE.modules.keys()
        ],
      lazy:
        [
          ...STATE.lazy.keys()
        ],
      overrides:
        [
          ...STATE.overrides.keys()
        ]
    };
  }
  /* ==========================================================
     IS LOADED
     ========================================================== */
  function isLoaded(src) {
    return STATE.loaded.has(
      normalizeURL(src)
    );
  }
  /* ==========================================================
     BOOT
     ========================================================== */
  async function boot() {
    if (
      STATE.bootPromise
    ) {
      return STATE.bootPromise;
    }
    STATE.bootPromise =
      (async () => {
        if (
          STATE.started
        ) {
          return KODUX;
        }
        STATE.started = true;
        emit(
          'boot:start'
        );
        log(
          '━━━━━━━━━━━━━━━━━━━━━━'
        );
        log(
          'KODUX BOOT v2'
        );
        log(
          '━━━━━━━━━━━━━━━━━━━━━━'
        );
        /*
         * =====================================================
         * FASE 1
         * CSS começa imediatamente.
         * =====================================================
         */
        const cssPromise =
          loadConfiguredCSS();
        emit(
          'phase:css'
        );
        /*
         * =====================================================
         * FASE 2
         * Legacy começa enquanto CSS baixa.
         *
         * A ordem interna dos legacy permanece garantida.
         * =====================================================
         */
        const legacyPromise =
          loadConfiguredLegacy();
        emit(
          'phase:legacy'
        );
        /*
         * =====================================================
         * FASE 3
         * Espera ambos.
         * =====================================================
         */
        await Promise.all([
          cssPromise,
          legacyPromise
        ]);
        /*
         * =====================================================
         * FASE 4
         * Módulos ES configurados.
         * =====================================================
         */
        await loadConfiguredModules();
        emit(
          'phase:modules'
        );
        /*
         * =====================================================
         * FASE 5
         * DOM.
         * =====================================================
         */
        if (
          CONFIG.options.waitForDOM
        ) {
          await waitDOM();
        }
        /*
         * =====================================================
         * READY
         * =====================================================
         */
        STATE.ready = true;
        emit(
          'boot:ready'
        );
        log(
          '━━━━━━━━━━━━━━━━━━━━━━'
        );
        log(
          '✓ KODUX READY'
        );
        log(
          '━━━━━━━━━━━━━━━━━━━━━━'
        );
        return KODUX;
      })().catch(err => {
        error(
          'KODUX BOOT ERROR:',
          err
        );
        emit(
          'boot:error',
          {
            error: err
          }
        );
        if (
          CONFIG.options.continueOnError
        ) {
          return KODUX;
        }
        throw err;
      });
    return STATE.bootPromise;
  }
  /* ==========================================================
     API
     ========================================================== */
  KODUX.loadJS =
    loadLegacy;
  KODUX.loadCSS =
    loadCSS;
  KODUX.import =
    importModule;
  KODUX.lazy =
    lazy;
  KODUX.waitFor =
    waitFor;
  KODUX.override =
    override;
  KODUX.patch =
    patch;
  KODUX.status =
    status;
  KODUX.isLoaded =
    isLoaded;
  KODUX.boot =
    boot;
  /*
   * Compatibilidade.
   */
  window.KODUX_BOOT =
    boot;
  /* ==========================================================
     AUTO BOOT
     ========================================================== */
  boot();
})();