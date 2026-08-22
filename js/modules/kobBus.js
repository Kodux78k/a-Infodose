/* ============================================================
   KOB BUS
   Universal Cross-Frame Bridge
   KOBLLUX / Dual.Infodose
   ============================================================

   FUNÇÃO:

   SHELL
      │
      ├── same-origin
      │      └── acessa contentDocument diretamente
      │
      └── cross-origin
             └── postMessage()

   RESULTADO:

   Cortex ───────────────┐
   Nexus ────────────────┤
   DualTube ─────────────┤
   iframe same-origin ──┤──> KOB BUS ──> KOB TTS
   iframe cross-origin ─┘

   ============================================================ */

(function KOB_BUS(global) {

  'use strict';

  const VERSION = 'KOB-BUS.v1.0.0';

  const CONFIG = {

    debug: false,

    maxText: 1200,

    minText: 2,

    debounce: 180,

    iframeSelector: 'iframe',

    /*
      "*" permite comunicação entre origens.

      Em produção, você pode trocar por uma lista
      de hosts permitidos.
    */
    targetOrigin: '*',

    /*
      Não captura controles por padrão.
    */
    ignoredTags: [
      'SCRIPT',
      'STYLE',
      'NOSCRIPT',
      'INPUT',
      'TEXTAREA',
      'SELECT',
      'OPTION'
    ]

  };


  /* ==========================================================
     STATE
     ========================================================== */

  const STATE = {

    started: false,

    frames: new Map(),

    documents: new WeakSet(),

    lastText: '',

    lastTime: 0,

    observer: null

  };


  /* ==========================================================
     LOG
     ========================================================== */

  function log(...args) {

    if (!CONFIG.debug) return;

    console.log(
      '%c[KOB BUS]',
      'color:#00ffff;font-weight:900',
      ...args
    );

  }


  /* ==========================================================
     NORMALIZE
     ========================================================== */

  function cleanText(text) {

    return String(text || '')
      .replace(/\u200B/g, '')
      .replace(/\u00A0/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, CONFIG.maxText);

  }


  /* ==========================================================
     ELEMENT IGNORE
     ========================================================== */

  function ignored(el) {

    if (!el || el.nodeType !== 1) {
      return true;
    }

    if (
      CONFIG.ignoredTags.includes(
        el.tagName
      )
    ) {
      return true;
    }

    if (
      el.closest?.(
        '[data-kob-ignore],[data-tts-ignore],.kob-tts-ignore'
      )
    ) {
      return true;
    }

    return false;

  }


  /* ==========================================================
     EXTRACT TEXT
     ========================================================== */

  function extractText(target) {

    if (!target) {
      return '';
    }

    let el = target;

    /*
      SVG / path / use
    */

    if (
      el.tagName === 'SVG' ||
      el.tagName === 'PATH' ||
      el.tagName === 'USE'
    ) {

      el =
        el.closest?.(
          'button,a,[role="button"]'
        ) ||
        el.parentElement;

    }

    /*
      Se clicou num controle,
      somente fala se explicitamente marcado.
    */

    const control =
      el.closest?.(
        'button,input,textarea,select'
      );

    if (control) {

      if (
        !control.hasAttribute(
          'data-kob-tts'
        )
      ) {

        return '';

      }

      el = control;

    }

    if (ignored(el)) {
      return '';
    }


    /*
      Primeiro tenta o próprio elemento.
    */

    let text =
      cleanText(
        el.innerText ||
        el.textContent ||
        el.getAttribute?.(
          'aria-label'
        ) ||
        el.getAttribute?.(
          'title'
        ) ||
        ''
      );


    /*
      Se o elemento contém muito texto,
      procura um bloco menor.
    */

    if (
      text.length > CONFIG.maxText
    ) {

      const candidates = [
        'article',
        'section',
        'p',
        'h1',
        'h2',
        'h3',
        'h4',
        'h5',
        'h6',
        '.card',
        '.v-glass',
        '[data-kob-content]'
      ];

      for (
        const selector of candidates
      ) {

        const parent =
          el.closest?.(
            selector
          );

        if (!parent) continue;

        const candidate =
          cleanText(
            parent.innerText ||
            parent.textContent ||
            ''
          );

        if (
          candidate &&
          candidate.length <
          text.length
        ) {

          text = candidate;

        }

      }

    }

    return cleanText(text);

  }


  /* ==========================================================
     FIND TTS
     ========================================================== */

  function getTTS() {

    /*
      Seu motor principal.
    */

    if (
      global.CobTTS &&
      typeof global.CobTTS.speak ===
        'function'
    ) {

      return text =>
        global.CobTTS.speak(text);

    }


    /*
      Outras formas que seu ecossistema
      pode ter exposto.
    */

    const objects = [

      global.KOB_TTS,

      global.KOBTTS,

      global.COB_TTS,

      global.TTS,

      global.tts

    ];

    for (
      const obj of objects
    ) {

      if (!obj) continue;

      if (
        typeof obj.speak ===
        'function'
      ) {

        return text =>
          obj.speak(text);

      }

      if (
        typeof obj.say ===
        'function'
      ) {

        return text =>
          obj.say(text);

      }

      if (
        typeof obj.speakText ===
        'function'
      ) {

        return text =>
          obj.speakText(text);

      }

    }


    /*
      Funções globais.
    */

    const functions = [

      'kobSpeak',

      'KOBSpeak',

      'speakText',

      'speak',

      'ttsSpeak',

      'speakTTS'

    ];

    for (
      const name of functions
    ) {

      if (
        typeof global[name] ===
        'function'
      ) {

        return text =>
          global[name](text);

      }

    }


    /*
      Último fallback.
    */

    if (
      global.speechSynthesis
    ) {

      return text => {

        try {

          global.speechSynthesis.cancel();

          const u =
            new SpeechSynthesisUtterance(
              text
            );

          u.lang = 'pt-BR';

          global.speechSynthesis.speak(
            u
          );

        } catch (err) {

          log(
            'Speech fallback error',
            err
          );

        }

      };

    }

    return null;

  }


  /* ==========================================================
     SPEAK
     ========================================================== */

  function speak(
    text,
    meta = {}
  ) {

    text =
      cleanText(text);

    if (
      text.length <
      CONFIG.minText
    ) {
      return false;
    }


    const now =
      Date.now();

    if (
      text === STATE.lastText &&
      now - STATE.lastTime <
      CONFIG.debounce
    ) {

      return false;

    }

    STATE.lastText =
      text;

    STATE.lastTime =
      now;


    const tts =
      getTTS();

    if (!tts) {

      console.warn(
        '[KOB BUS] KOB TTS não encontrado.'
      );

      return false;

    }


    log(
      'TTS',
      meta,
      text
    );


    try {

      tts(text);

      return true;

    } catch (err) {

      console.error(
        '[KOB BUS] TTS error',
        err
      );

      return false;

    }

  }


  /* ==========================================================
     FRAME ID
     ========================================================== */

  function frameId(iframe) {

    if (
      iframe.dataset.kobBusId
    ) {

      return iframe.dataset.kobBusId;

    }

    const id =
      'kob-frame-' +
      Math.random()
        .toString(36)
        .slice(2, 10);

    iframe.dataset.kobBusId =
      id;

    return id;

  }


  /* ==========================================================
     FRAME ORIGIN
     ========================================================== */

  function getFrameOrigin(iframe) {

    try {

      return new URL(
        iframe.src ||
        iframe.getAttribute('src') ||
        location.href,
        location.href
      ).origin;

    } catch (_) {

      return location.origin;

    }

  }


  /* ==========================================================
     SAME ORIGIN
     ========================================================== */

  function isSameOrigin(iframe) {

    try {

      const origin =
        getFrameOrigin(
          iframe
        );

      return (
        origin ===
        location.origin
      );

    } catch (_) {

      return false;

    }

  }


  /* ==========================================================
     SAME-ORIGIN BRIDGE
     ========================================================== */

  function connectSameOrigin(
    iframe
  ) {

    try {

      const doc =
        iframe.contentDocument ||
        iframe.contentWindow?.document;

      if (!doc) {

        return false;

      }


      /*
        Instala somente uma vez
        naquele document.
      */

      if (
        STATE.documents.has(doc)
      ) {

        return true;

      }

      STATE.documents.add(doc);


      doc.addEventListener(
        'click',
        event => {

          const text =
            extractText(
              event.target
            );

          if (!text) return;

          speak(
            text,
            {
              source:
                'same-origin',
              iframe:
                frameId(iframe),
              url:
                iframe.src
            }
          );

        },
        true
      );


      log(
        'SAME-ORIGIN conectado',
        iframe.src
      );


      return true;

    } catch (err) {

      log(
        'Same-origin falhou',
        err
      );

      return false;

    }

  }


  /* ==========================================================
     CROSS ORIGIN BOOTSTRAP
     ========================================================== */

  function connectCrossOrigin(
    iframe
  ) {

    const id =
      frameId(iframe);

    const origin =
      getFrameOrigin(
        iframe
      );


    STATE.frames.set(
      id,
      {
        iframe,
        origin,
        crossOrigin: true
      }
    );


    /*
      O iframe recebe o sinal de inicialização.

      Se ele tiver KOB-BUS receptor,
      ativa a ponte.
    */

    try {

      iframe.contentWindow.postMessage(
        {
          type:
            'KOB_BUS_INIT',

          bus:
            VERSION,

          frameId:
            id,

          parentOrigin:
            location.origin

        },
        CONFIG.targetOrigin
      );

    } catch (err) {

      log(
        'postMessage INIT error',
        err
      );

    }


    log(
      'CROSS-ORIGIN conectado',
      {
        id,
        origin
      }
    );

  }


  /* ==========================================================
     CONNECT FRAME
     ========================================================== */

  function connectFrame(
    iframe
  ) {

    if (!iframe) {
      return;
    }


    const id =
      frameId(iframe);


    /*
      Evita duplicar listener de load.
    */

    if (
      !iframe.__kobBusLoad
    ) {

      iframe.__kobBusLoad =
        true;

      iframe.addEventListener(
        'load',
        () => {

          /*
            Novo document pode ter surgido.
          */

          if (
            isSameOrigin(
              iframe
            )
          ) {

            connectSameOrigin(
              iframe
            );

          } else {

            connectCrossOrigin(
              iframe
            );

          }

        },
        true
      );

    }


    /*
      Conecta imediatamente.
    */

    if (
      isSameOrigin(
        iframe
      )
    ) {

      connectSameOrigin(
        iframe
      );

    } else {

      connectCrossOrigin(
        iframe
      );

    }


    log(
      'FRAME',
      id,
      iframe.src
    );

  }


  /* ==========================================================
     MESSAGE RECEIVER
     ========================================================== */

  function receiveMessage(
    event
  ) {

    const data =
      event.data;

    if (!data) {
      return;
    }


    /*
      Somente mensagens do protocolo KOB.
    */

    if (
      typeof data.type !==
      'string'
    ) {

      return;

    }


    /* --------------------------------------------------------
       KOB TTS
       -------------------------------------------------------- */

    if (
      data.type ===
      'KOB_TTS'
    ) {

      /*
        IMPORTANTÍSSIMO:

        Não manda a mensagem de volta
        para o iframe.

        Portanto não existe loop.
      */

      const text =
        cleanText(
          data.text
        );

      if (!text) {
        return;
      }


      speak(
        text,
        {
          source:
            'cross-origin',
          frameId:
            data.frameId ||
            'unknown',
          url:
            data.url ||
            event.origin,
          origin:
            event.origin
        }
      );

      return;

    }


    /* --------------------------------------------------------
       KOB BUS PING
       -------------------------------------------------------- */

    if (
      data.type ===
      'KOB_BUS_PING'
    ) {

      try {

        event.source?.postMessage(
          {
            type:
              'KOB_BUS_PONG',

            version:
              VERSION,

            parent:
              location.origin

          },
          event.origin ===
            'null'
            ? '*'
            : event.origin
        );

      } catch (_) {}

      return;

    }

  }


  /* ==========================================================
     SCAN
     ========================================================== */

  function scan() {

    const frames =
      document.querySelectorAll(
        CONFIG.iframeSelector
      );

    frames.forEach(
      connectFrame
    );

    log(
      'frames:',
      frames.length
    );

  }


  /* ==========================================================
     OBSERVER
     ========================================================== */

  function observe() {

    if (
      !global.MutationObserver
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
              const node of
              mutation.addedNodes
            ) {

              if (
                node.nodeType !== 1
              ) {
                continue;
              }


              if (
                node.matches?.(
                  'iframe'
                )
              ) {

                connectFrame(
                  node
                );

              }


              node
                .querySelectorAll?.(
                  'iframe'
                )
                .forEach(
                  connectFrame
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


  /* ==========================================================
     PARENT DOCUMENT CLICK
     ========================================================== */

  function installParentClick() {

    /*
      Cortex/Nexus continuam exatamente
      como estão.

      Este listener só garante que o KOB BUS
      também seja capaz de atender conteúdo
      que não esteja em iframe.
    */

    document.addEventListener(
      'click',
      event => {

        /*
          Se o clique veio de dentro de um iframe,
          ele NÃO chega aqui.

          Portanto não haverá duplicação.
        */

        if (
          event.target?.closest?.(
            'iframe'
          )
        ) {
          return;
        }


        const text =
          extractText(
            event.target
          );

        if (!text) {
          return;
        }


        /*
          Só atua se ainda não houver
          um motor externo cuidando disso.

          Isso preserva Cortex/Nexus.
        */

        if (
          global.KOB_TTS_IFRAME_BRIDGE
        ) {

          return;

        }


        speak(
          text,
          {
            source:
              'parent'
          }
        );

      },
      true
    );

  }


  /* ==========================================================
     PUBLIC API
     ========================================================== */

  const API = {

    version:
      VERSION,

    state:
      STATE,

    scan,

    connectFrame,

    speak,

    getTTS,

    config:
      CONFIG,

    debug(value) {

      CONFIG.debug =
        Boolean(value);

    }

  };


  /* ==========================================================
     GLOBAL
     ========================================================== */

  global.KOBBus =
    API;


  global.KOB_BUS =
    API;


  /* ==========================================================
     BOOT
     ========================================================== */

  function boot() {

    if (
      STATE.started
    ) {
      return;
    }

    STATE.started =
      true;


    /*
      Primeiro receptor.
    */

    global.addEventListener(
      'message',
      receiveMessage,
      false
    );


    /*
      Não mexemos no TTS existente
      do Cortex/Nexus.
    */

    installParentClick();


    /*
      Frames existentes.
    */

    scan();


    /*
      Frames criados posteriormente.
    */

    observe();


    /*
      Re-scan de segurança.
    */

    setTimeout(
      scan,
      500
    );

    setTimeout(
      scan,
      1500
    );

    setTimeout(
      scan,
      3500
    );


    log(
      'BOOT OK',
      VERSION
    );

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


})(window);