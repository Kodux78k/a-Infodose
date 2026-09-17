/* ═══════════════════════════════════════════════════════════════
   KOBLLUX / INFODOSE
   BOOTLOADER · v2
   ───────────────────────────────────────────────────────────────
   FUNÇÃO:

   index.html
       ↓
   CSS
       ↓
   KodBlloX.js
       ↓
   18 módulos
       ↓
   bootloader detecta conclusão
       ↓
   KOBLLUX READY

   O BUNDLE REAL É:

   https://infodose.com.br/js/modules/KodBlloX.js

   Este arquivo NÃO duplica os módulos.
   Ele apenas inicializa o ambiente e acompanha o bundle.
   ═══════════════════════════════════════════════════════════════ */

(() => {

  'use strict';


  /* ─────────────────────────────────────────────────────────────
     00 · IDENTIDADE
     ───────────────────────────────────────────────────────────── */

  const BOOT = {
    name: 'KOBLLUX',
    version: '2.0.0',
    mode: 'TRINITY',
    cycle: '3·6·9·7',
    bundle:
      'https://infodose.com.br/js/modules/KodBlloX.js',

    startedAt: performance.now()
  };


  /* ─────────────────────────────────────────────────────────────
     01 · ROOT
     ───────────────────────────────────────────────────────────── */

  const ROOT =
    new URL('./', document.baseURI);


  window.KOBLLUX =
    window.KOBLLUX || {};


  window.KOBLLUX.BOOT =
    BOOT;


  window.KOBLLUX.ROOT =
    ROOT;


  window.KOBLLUX.root =
    ROOT.href;


  /* ─────────────────────────────────────────────────────────────
     02 · ESTADO
     ───────────────────────────────────────────────────────────── */

  window.KOBLLUX.state =
    window.KOBLLUX.state || {};


  window.KOBLLUX.state.booting =
    true;


  window.KOBLLUX.state.ready =
    false;


  window.KOBLLUX.state.failed =
    false;


  window.KOBLLUX.state.startedAt =
    BOOT.startedAt;


  /* ─────────────────────────────────────────────────────────────
     03 · MARCAÇÃO DO DOCUMENTO
     ───────────────────────────────────────────────────────────── */

  document.documentElement.dataset.kobllux =
    'boot';


  document.documentElement.dataset.mode =
    BOOT.mode;


  document.documentElement.dataset.cycle =
    BOOT.cycle;


  /* ─────────────────────────────────────────────────────────────
     04 · LOG
     ───────────────────────────────────────────────────────────── */

  const log = (...args) => {

    console.log(
      '%c[KOBLLUX BOOT]',
      'font-weight:700',
      ...args
    );

  };


  const warn = (...args) => {

    console.warn(
      '[KOBLLUX BOOT]',
      ...args
    );

  };


  /* ─────────────────────────────────────────────────────────────
     05 · EVENTO: BOOT START
     ───────────────────────────────────────────────────────────── */

  window.dispatchEvent(

    new CustomEvent(
      'kobllux:boot-start',
      {
        detail: BOOT
      }
    )

  );


  log(
    '⊙ BOOT START'
  );


  log(
    'MODE:',
    BOOT.mode
  );


  log(
    'CYCLE:',
    BOOT.cycle
  );


  log(
    'ROOT:',
    ROOT.href
  );


  log(
    'BUNDLE:',
    BOOT.bundle
  );


  /* ─────────────────────────────────────────────────────────────
     06 · LOCALIZA O BUNDLE
     ───────────────────────────────────────────────────────────── */

  const bundleScript =
    Array.from(
      document.scripts
    ).find(
      script =>
        script.src === BOOT.bundle
    );


  if (bundleScript) {

    log(
      '✓ bundle encontrado no HTML'
    );

  } else {

    warn(
      'Bundle não encontrado no document.scripts'
    );

  }


  /* ─────────────────────────────────────────────────────────────
     07 · FUNÇÃO FINAL
     ───────────────────────────────────────────────────────────── */

  function ready() {

    if (
      window.KOBLLUX.state.ready
    ) {

      return;

    }


    const elapsed =
      Math.round(
        performance.now() -
        BOOT.startedAt
      );


    window.KOBLLUX.state.booting =
      false;


    window.KOBLLUX.state.ready =
      true;


    window.KOBLLUX.state.bootTime =
      elapsed;


    document.documentElement.dataset.kobllux =
      'ready';


    log(
      `✓ BOOT READY · ${elapsed}ms`
    );


    /* ─────────────────────────────────────────────────────────
       EVENTO PRINCIPAL
       ───────────────────────────────────────────────────────── */

    window.dispatchEvent(

      new CustomEvent(
        'kobllux:boot-ready',
        {
          detail: {
            ...BOOT,
            elapsed
          }
        }
      )

    );


    /* ─────────────────────────────────────────────────────────
       EVENTO ALTERNATIVO
       ───────────────────────────────────────────────────────── */

    window.dispatchEvent(

      new CustomEvent(
        'KOBLLUX_READY',
        {
          detail: {
            ...BOOT,
            elapsed
          }
        }
      )

    );

  }


  /* ─────────────────────────────────────────────────────────────
     08 · DETECÇÃO DO DOM
     ───────────────────────────────────────────────────────────── */

  function domReady() {

    if (
      document.readyState ===
      'loading'
    ) {

      document.addEventListener(
        'DOMContentLoaded',
        domReady,
        {
          once: true
        }
      );

      return;

    }


    log(
      '✓ DOM READY'
    );


    /*
     * Como KodBlloX.js usa imports ES Module,
     * os módulos podem continuar finalizando
     * depois do parsing do HTML.
     *
     * Damos um pequeno ciclo ao navegador
     * antes de declarar o sistema pronto.
     */

    queueMicrotask(() => {

      requestAnimationFrame(() => {

        ready();

      });

    });

  }


  /* ─────────────────────────────────────────────────────────────
     09 · INÍCIO
     ───────────────────────────────────────────────────────────── */

  domReady();


})();