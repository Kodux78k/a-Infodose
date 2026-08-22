/* ============================================================
   KOB TTS · UNIVERSAL CLICK BRIDGE
   KOBLLUX / DUAL INFODOSE
   ------------------------------------------------------------
   CLICK NO CÓRTEX
        ↓
   CLICK NO NEXUS
        ↓
   CLICK DENTRO DO IFRAME
        ↓
   MESMO KOB TTS
   ============================================================ */

(function KOB_TTS_IFRAME_BRIDGE() {

  'use strict';

  const VERSION = 'KOB-TTS-IFRAME-BRIDGE.v1.0';

  /* ------------------------------------------------------------
     CONFIG
     ------------------------------------------------------------ */

  const CONFIG = {

    /* quantidade máxima de texto capturado */
    maxChars: 900,

    /* mínimo para considerar que encontrou conteúdo */
    minChars: 2,

    /* evita falar textos minúsculos acidentais */
    minWords: 1,

    /* tempo mínimo entre dois disparos */
    debounce: 180,

    /* tempo para observar iframes adicionados dinamicamente */
    observer: true,

    /* tentar novamente quando iframe carregar */
    onLoad: true,

    /* elementos que normalmente NÃO devem falar */
    ignoredTags: new Set([
      'SCRIPT',
      'STYLE',
      'NOSCRIPT',
      'SVG',
      'PATH',
      'INPUT',
      'TEXTAREA',
      'SELECT',
      'OPTION',
      'BUTTON'
    ]),

    /* classes que não devem ser capturadas */
    ignoredClasses: [
      'no-tts',
      'tts-ignore',
      'kob-tts-ignore'
    ]

  };


  /* ------------------------------------------------------------
     STATE
     ------------------------------------------------------------ */

  const STATE = {

    installedDocuments: new WeakSet(),

    installedIframes: new WeakSet(),

    lastText: '',

    lastTime: 0,

    observer: null,

    started: false

  };


  /* ------------------------------------------------------------
     LOG
     ------------------------------------------------------------ */

  function log(...args) {

    if (window.KOB_TTS_DEBUG) {

      console.log(
        `%c[${VERSION}]`,
        'color:#0ff;font-weight:bold',
        ...args
      );

    }

  }


  /* ------------------------------------------------------------
     NORMALIZA TEXTO
     ------------------------------------------------------------ */

  function normalizeText(text) {

    if (!text) return '';

    return String(text)

      .replace(/\s+/g, ' ')

      .replace(/\u200B/g, '')

      .replace(/\u00A0/g, ' ')

      .trim();

  }


  /* ------------------------------------------------------------
     ENCONTRA ELEMENTO VÁLIDO
     ------------------------------------------------------------ */

  function isIgnored(el) {

    if (!el || el.nodeType !== 1) {
      return true;
    }

    const tag = el.tagName;

    if (CONFIG.ignoredTags.has(tag)) {
      return true;
    }

    if (el.hasAttribute('aria-hidden')) {

      if (
        el.getAttribute('aria-hidden') === 'true'
      ) {
        return true;
      }

    }

    for (const cls of CONFIG.ignoredClasses) {

      if (el.classList?.contains(cls)) {
        return true;
      }

    }

    return false;
  }


  /* ------------------------------------------------------------
     VISIBILIDADE
     ------------------------------------------------------------ */

  function isVisible(el) {

    if (!el || el.nodeType !== 1) {
      return false;
    }

    try {

      const style =
        el.ownerDocument.defaultView
          ?.getComputedStyle(el);

      if (!style) return true;

      if (
        style.display === 'none' ||
        style.visibility === 'hidden'
      ) {
        return false;
      }

      if (
        parseFloat(style.opacity || '1') === 0
      ) {
        return false;
      }

    } catch (_) {}

    return true;
  }


  /* ------------------------------------------------------------
     TEXTO DO ELEMENTO
     ------------------------------------------------------------ */

  function getElementText(el) {

    if (!el) return '';

    if (isIgnored(el)) {
      return '';
    }

    let text = '';

    /*
      Primeiro tenta aria-label/title,
      útil para cards e elementos sem textContent direto.
    */

    const aria =
      normalizeText(el.getAttribute?.('aria-label'));

    const title =
      normalizeText(el.getAttribute?.('title'));

    if (aria) {
      text = aria;
    }

    else if (title) {
      text = title;
    }

    else {

      text = normalizeText(
        el.innerText ||
        el.textContent ||
        ''
      );

    }

    if (!text) {
      return '';
    }

    if (text.length > CONFIG.maxChars) {

      text =
        text.slice(0, CONFIG.maxChars) +
        '…';

    }

    return text;
  }


  /* ------------------------------------------------------------
     ESCOLHE O MELHOR BLOCO
     ------------------------------------------------------------ */

  function findReadableBlock(start) {

    if (!start) return null;

    let el = start.nodeType === 1
      ? start
      : start.parentElement;

    if (!el) return null;

    let candidate = null;

    let depth = 0;

    while (el && depth < 8) {

      if (
        !isIgnored(el) &&
        isVisible(el)
      ) {

        const text =
          getElementText(el);

        if (
          text &&
          text.length >= CONFIG.minChars
        ) {

          candidate = el;

          /*
            Se já encontrou um bloco razoável,
            para de subir.

            Isso evita pegar o texto da página inteira.
          */

          if (
            text.length >= 30 ||
            el.matches?.(
              'article,section,main,header,aside,' +
              '[role="article"],[role="main"],' +
              '.card,.v-glass,.content'
            )
          ) {
            break;
          }

        }

      }

      el = el.parentElement;

      depth++;

    }

    return candidate;
  }


  /* ------------------------------------------------------------
     CAPTURA TEXTO DO CLICK
     ------------------------------------------------------------ */

  function extractClickedText(event) {

    let target =
      event.target;

    if (!target) {
      return '';
    }

    /*
      Se clicou diretamente em SVG/path,
      procura o elemento hospedeiro.
    */

    if (
      target.nodeType === 1 &&
      (
        target.tagName === 'SVG' ||
        target.tagName === 'PATH' ||
        target.tagName === 'USE'
      )
    ) {

      target =
        target.closest?.(
          'button,a,[role="button"],' +
          '[data-tts],[data-speak]'
        ) ||
        target.parentElement;

    }

    if (!target) {
      return '';
    }

    if (isIgnored(target)) {

      /*
        Não abandona imediatamente:
        tenta um pai textual.
      */

      target =
        target.parentElement;

    }

    const block =
      findReadableBlock(target);

    if (!block) {
      return '';
    }

    let text =
      getElementText(block);

    /*
      Se o bloco ficou gigante,
      tenta usar o elemento clicado primeiro.
    */

    if (
      text.length > CONFIG.maxChars
    ) {

      const direct =
        getElementText(target);

      if (
        direct &&
        direct.length < text.length
      ) {
        text = direct;
      }

    }

    return normalizeText(text);
  }


  /* ------------------------------------------------------------
     ENCONTRA MOTOR TTS EXISTENTE
     ------------------------------------------------------------ */

  function findTTSFunction() {

    /*
      1. APIs conhecidas do ecossistema
    */

    const candidates = [

      window.KOB_TTS,
      window.KOBTTS,
      window.kobTTS,
      window.CobTTS,
      window.COB_TTS,
      window.TTS,
      window.tts

    ];

    for (const obj of candidates) {

      if (!obj) continue;

      if (
        typeof obj.speak === 'function'
      ) {

        return text =>
          obj.speak(text);

      }

      if (
        typeof obj.say === 'function'
      ) {

        return text =>
          obj.say(text);

      }

      if (
        typeof obj.speakText === 'function'
      ) {

        return text =>
          obj.speakText(text);

      }

    }


    /*
      2. Funções globais comuns
    */

    const funcs = [

      'kobSpeak',
      'KOBSpeak',
      'speakText',
      'speak',
      'ttsSpeak',
      'speakTTS',
      'speakWithKOB'

    ];

    for (const name of funcs) {

      if (
        typeof window[name] === 'function'
      ) {

        return text =>
          window[name](text);

      }

    }


    /*
      3. Fallback SpeechSynthesis
         Só entra se não houver motor KOB.
    */

    if (
      'speechSynthesis' in window
    ) {

      return function fallbackSpeak(text) {

        try {

          window.speechSynthesis.cancel();

          const utterance =
            new SpeechSynthesisUtterance(text);

          utterance.lang = 'pt-BR';

          window.speechSynthesis.speak(
            utterance
          );

        } catch (err) {

          console.warn(
            '[KOB TTS] fallback error',
            err
          );

        }

      };

    }

    return null;
  }


  /* ------------------------------------------------------------
     DISPARA TTS
     ------------------------------------------------------------ */

  function speak(text, source) {

    text =
      normalizeText(text);

    if (!text) return;

    if (
      text.length < CONFIG.minChars
    ) {
      return;
    }

    const now =
      Date.now();

    /*
      debounce
    */

    if (
      text === STATE.lastText &&
      now - STATE.lastTime <
      CONFIG.debounce
    ) {

      return;

    }

    STATE.lastText = text;
    STATE.lastTime = now;

    const fn =
      findTTSFunction();

    if (!fn) {

      console.warn(
        '[KOB TTS] Nenhum motor encontrado.'
      );

      return;
    }

    log(
      'SPEAK',
      source || 'document',
      text
    );

    try {

      fn(text);

    } catch (err) {

      console.warn(
        '[KOB TTS] erro ao falar:',
        err
      );

    }

  }


  /* ------------------------------------------------------------
     CLICK HANDLER
     ------------------------------------------------------------ */

  function handleClick(event, source) {

    /*
      Não captura clique de controle explicitamente.
    */

    const target =
      event.target;

    if (!target) {
      return;
    }

    /*
      Ignora inputs/formulários.
    */

    const control =
      target.closest?.(
        'input,textarea,select,option,' +
        'button,[contenteditable="true"]'
      );

    if (control) {

      /*
        Exceção:
        botão explicitamente marcado para TTS.
      */

      if (
        !control.hasAttribute(
          'data-tts'
        ) &&
        !control.hasAttribute(
          'data-speak'
        )
      ) {

        return;

      }

    }

    const text =
      extractClickedText(event);

    if (!text) {
      return;
    }

    speak(
      text,
      source
    );

  }


  /* ------------------------------------------------------------
     INSTALA NO DOCUMENT
     ------------------------------------------------------------ */

  function installDocument(doc, source) {

    if (!doc) {
      return;
    }

    if (
      STATE.installedDocuments.has(doc)
    ) {
      return;
    }

    STATE.installedDocuments.add(doc);

    log(
      'Installing listener:',
      source
    );


    /*
      CAPTURE = true

      Isso é importante.

      O evento será interceptado antes
      de handlers internos que possam
      parar propagação.
    */

    doc.addEventListener(
      'click',
      function(event) {

        handleClick(
          event,
          source
        );

      },
      true
    );


    /*
      pointerup cobre melhor
      alguns ambientes mobile.
    */

    doc.addEventListener(
      'pointerup',
      function(event) {

        /*
          Evita duplicar o click normal.
        */

        if (
          event.pointerType === 'mouse'
        ) {
          return;
        }

        handleClick(
          event,
          source + ':pointer'
        );

      },
      true
    );


    /*
      Também suporta elementos explicitamente
      marcados com data-tts.
    */

    doc.addEventListener(
      'touchend',
      function(event) {

        const target =
          event.target;

        if (
          target?.closest?.(
            '[data-tts],[data-speak]'
          )
        ) {

          handleClick(
            event,
            source + ':touch'
          );

        }

      },
      true
    );

  }


  /* ------------------------------------------------------------
     INSTALA EM IFRAME
     ------------------------------------------------------------ */

  function installIframe(iframe) {

    if (!iframe) {
      return;
    }

    if (
      STATE.installedIframes.has(iframe)
    ) {
      return;
    }

    STATE.installedIframes.add(iframe);

    log(
      'Iframe detected:',
      iframe.id ||
      iframe.className ||
      iframe.src
    );


    function connect() {

      try {

        const doc =
          iframe.contentDocument ||
          iframe.contentWindow?.document;

        if (!doc) {

          log(
            'Iframe document unavailable'
          );

          return;

        }

        /*
          AQUI ESTÁ O PATCH PRINCIPAL.

          O listener é instalado DENTRO
          do documento do iframe.
        */

        installDocument(
          doc,
          `iframe:${iframe.id || 'anonymous'}`
        );


        /*
          O conteúdo interno pode ainda
          estar sendo montado dinamicamente.
        */

        if (
          window.MutationObserver &&
          !iframe.__kobMutationObserver
        ) {

          const observer =
            new MutationObserver(
              function() {

                /*
                  O document continua sendo o mesmo,
                  mas os elementos podem ser novos.

                  O listener no document já cobre
                  esses elementos automaticamente.
                */

              }
            );

          try {

            observer.observe(
              doc.documentElement ||
              doc,
              {
                childList: true,
                subtree: true
              }
            );

            iframe.__kobMutationObserver =
              observer;

          } catch (_) {}

        }

      } catch (err) {

        /*
          Cross-origin:

          Se o iframe for externo,
          o navegador NÃO permite acessar
          contentDocument por segurança.

          Nesse caso não é z-index.
        */

        log(
          'Iframe inacessível:',
          iframe.src,
          err
        );

      }

    }


    if (
      CONFIG.onLoad
    ) {

      iframe.addEventListener(
        'load',
        function() {

          /*
            novo document após reload/navigation
          */

          connect();

        },
        true
      );

    }

    /*
      tenta imediatamente
    */

    connect();

  }


  /* ------------------------------------------------------------
     SCAN IFRAME
     ------------------------------------------------------------ */

  function scanIframes(root) {

    if (!root) return;

    let iframes = [];

    try {

      if (
        root.matches?.('iframe')
      ) {

        iframes.push(root);

      }

      if (
        root.querySelectorAll
      ) {

        iframes =
          iframes.concat(
            Array.from(
              root.querySelectorAll(
                'iframe'
              )
            )
          );

      }

    } catch (_) {}

    for (
      const iframe of iframes
    ) {

      installIframe(
        iframe
      );

    }

  }


  /* ------------------------------------------------------------
     OBSERVER DO DOCUMENT PAI
     ------------------------------------------------------------ */

  function installObserver() {

    if (
      !CONFIG.observer ||
      !window.MutationObserver
    ) {
      return;
    }

    if (
      STATE.observer
    ) {
      return;
    }

    STATE.observer =
      new MutationObserver(
        mutations => {

          for (
            const mutation of mutations
          ) {

            for (
              const node of mutation.addedNodes
            ) {

              if (
                node.nodeType !== 1
              ) {
                continue;
              }

              scanIframes(
                node
              );

            }

          }

        }
      );

    STATE.observer.observe(
      document.documentElement,
      {
        childList: true,
        subtree: true
      }
    );

  }


  /* ------------------------------------------------------------
     CSS BRIDGE
     ------------------------------------------------------------ */

  function installCSSBridge() {

    /*
      Não usamos z-index para resolver
      eventos dentro do iframe.

      Apenas garantimos que o iframe
      possa receber pointer events.
    */

    const style =
      document.createElement(
        'style'
      );

    style.id =
      'kob-tts-iframe-bridge-css';

    style.textContent = `

      iframe.win-frame,
      iframe#frame,
      iframe#appFrame {
        pointer-events: auto !important;
      }

    `;

    document.head.appendChild(
      style
    );

  }


  /* ------------------------------------------------------------
     API PÚBLICA
     ------------------------------------------------------------ */

  window.KOB_TTS_IFRAME_BRIDGE = {

    version: VERSION,

    install() {

      installDocument(
        document,
        'parent'
      );

      scanIframes(
        document
      );

      installObserver();

      installCSSBridge();

      STATE.started =
        true;

      log(
        'READY'
      );

    },

    rescan() {

      scanIframes(
        document
      );

    },

    speak(text) {

      speak(
        text,
        'manual'
      );

    },

    state: STATE

  };


  /* ------------------------------------------------------------
     BOOT
     ------------------------------------------------------------ */

  function boot() {

    /*
      Espera o DOM estar disponível,
      mas não precisa esperar os módulos
      externos terminarem.
    */

    window.KOB_TTS_IFRAME_BRIDGE
      .install();

  }


  if (
    document.readyState ===
    'loading'
  ) {

    document.addEventListener(
      'DOMContentLoaded',
      boot,
      {
        once: true
      }
    );

  } else {

    boot();

  }


  /*
    Re-scan tardio.

    Útil para:
    - FusionOS
    - iFSw
    - appFrame
    - session-iframe
    - navegação dinâmica
  */

  setTimeout(
    () => {

      window.KOB_TTS_IFRAME_BRIDGE
        ?.rescan();

    },
    1200
  );


  setTimeout(
    () => {

      window.KOB_TTS_IFRAME_BRIDGE
        ?.rescan();

    },
    3500
  );


})();