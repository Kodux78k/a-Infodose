/* ============================================================
   KOB-TTS OUTLINE UNI
   Universal TTS Binder para .win-frame
   KOBLLUX / dual.Infodose
   ============================================================ */

(() => {
  'use strict';

  const KOB = window.KOBTTS_UNI = window.KOBTTS_UNI || {};

  /* ==========================================================
     CONFIG
     ========================================================== */

  const CFG = {
    frameSelector: '.win-frame[data-runtime]',
    textSelector: [
      'h1',
      'h2',
      'h3',
      'h4',
      'h5',
      'h6',
      'p',
      'li',
      'blockquote',
      'pre',
      'td',
      'th',
      'article',
      'section'
    ].join(','),

    headerSelector: '.win-hdr',
    outlineSelector: '#kob-tts-outline',

    bindDelay: 120,
    clickToSpeak: true,
    selectionToSpeak: true,

    debug: true
  };


  /* ==========================================================
     STATE
     ========================================================== */

  const state = {
    frames: new Map(),
    activeFrame: null,
    activeDoc: null,
    activeTarget: null,
    currentIndex: -1
  };

  KOB.state = state;


  /* ==========================================================
     DEBUG
     ========================================================== */

  function log(...args) {
    if (CFG.debug) {
      console.log('[KOB-TTS]', ...args);
    }
  }

  function warn(...args) {
    console.warn('[KOB-TTS]', ...args);
  }


  /* ==========================================================
     HELPERS
     ========================================================== */

  function cleanText(text) {
    return String(text || '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function getFrameDocument(frame) {
    try {
      return frame.contentDocument ||
             frame.contentWindow?.document ||
             null;
    } catch (err) {
      warn('Documento do iframe inacessível:', err);
      return null;
    }
  }

  function getFrameRuntime(frame) {
    return (
      frame.dataset.runtime ||
      frame.getAttribute('data-runtime') ||
      'unknown'
    );
  }

  function getFrameId(frame) {
    return (
      frame.id ||
      frame.dataset.runtime ||
      `kob-frame-${Math.random().toString(36).slice(2)}`
    );
  }

  function isInsideTTSUI(target) {
    if (!target || !target.closest) return false;

    return !!target.closest(
      [
        '#kob-tts-outline',
        '.kob-tts-dock',
        '.kob-tts-ui',
        '#symbolBar',
        '.kob-tts-active'
      ].join(',')
    );
  }


  /* ==========================================================
     TEXT BLOCKS
     ========================================================== */

  function getTextBlocks(doc) {
    if (!doc) return [];

    try {
      return [...doc.querySelectorAll(CFG.textSelector)]
        .filter(el => {
          const text = cleanText(el.innerText || el.textContent);
          if (!text) return false;

          // Evita elementos escondidos
          const style = doc.defaultView?.getComputedStyle?.(el);

          if (style) {
            if (style.display === 'none') return false;
            if (style.visibility === 'hidden') return false;
          }

          return true;
        });
    } catch (err) {
      warn('Erro indexando blocos:', err);
      return [];
    }
  }


  /* ==========================================================
     OUTLINE
     ========================================================== */

  function rebuildOutline(frame, doc) {
    const outline = document.querySelector(CFG.outlineSelector);

    if (!outline) return;

    try {
      const blocks = getTextBlocks(doc);

      outline.innerHTML = '';

      blocks.forEach((block, index) => {
        const text = cleanText(
          block.innerText || block.textContent
        );

        if (!text) return;

        const item = document.createElement('button');

        item.type = 'button';
        item.className = 'kob-tts-outline-item';

        item.dataset.index = index;
        item.dataset.frame =
          frame.id ||
          frame.dataset.runtime ||
          '';

        item.textContent =
          text.length > 80
            ? text.slice(0, 80) + '…'
            : text;

        item.addEventListener('click', () => {
          speakBlock(frame, block, index);
        });

        outline.appendChild(item);
      });

    } catch (err) {
      warn('Outline error:', err);
    }
  }


  /* ==========================================================
     ACTIVE STATE
     ========================================================== */

  function clearActive(doc) {
    if (!doc) return;

    try {
      doc.querySelectorAll('.kob-tts-active')
        .forEach(el => {
          el.classList.remove('kob-tts-active');
        });
    } catch (err) {}
  }

  function setActive(frame, doc, target, index = -1) {

    if (state.activeDoc && state.activeDoc !== doc) {
      clearActive(state.activeDoc);
    }

    state.activeFrame = frame;
    state.activeDoc = doc;
    state.activeTarget = target;
    state.currentIndex = index;

    try {
      doc.querySelectorAll('.kob-tts-active')
        .forEach(el => {
          el.classList.remove('kob-tts-active');
        });

      if (target) {
        target.classList.add('kob-tts-active');
      }
    } catch (err) {}

    /* KOBLLUX state */

    try {
      if (window.KOBLLUX?.state) {
        window.KOBLLUX.state.currentBlockIdx = index;
        window.KOBLLUX.state.activeFrame = frame;
        window.KOBLLUX.state.activeDoc = doc;
      }
    } catch (err) {}
  }


  /* ==========================================================
     SPEECH ENGINE
     ========================================================== */

  function speakText(text, options = {}) {

    text = cleanText(text);

    if (!text) return;

    log('Speak:', text);

    /* ------------------------------------------
       KOBLLUX API
       ------------------------------------------ */

    try {
      if (
        window.KOBLLUX &&
        typeof window.KOBLLUX.speakText === 'function'
      ) {
        return window.KOBLLUX.speakText(
          text,
          options
        );
      }
    } catch (err) {
      warn('KOBLLUX.speakText falhou:', err);
    }


    /* ------------------------------------------
       KOB TTS API
       ------------------------------------------ */

    try {
      if (
        window.kobTTS &&
        typeof window.kobTTS.speak === 'function'
      ) {
        return window.kobTTS.speak(
          text,
          options
        );
      }
    } catch (err) {
      warn('kobTTS.speak falhou:', err);
    }


    /* ------------------------------------------
       OFFLINE FALLBACK
       ------------------------------------------ */

    if (
      'speechSynthesis' in window &&
      'SpeechSynthesisUtterance' in window
    ) {

      try {
        window.speechSynthesis.cancel();

        const utterance =
          new SpeechSynthesisUtterance(text);

        if (options.rate != null) {
          utterance.rate = options.rate;
        }

        if (options.pitch != null) {
          utterance.pitch = options.pitch;
        }

        if (options.volume != null) {
          utterance.volume = options.volume;
        }

        if (options.lang) {
          utterance.lang = options.lang;
        } else {
          utterance.lang = 'pt-BR';
        }

        window.speechSynthesis.speak(
          utterance
        );

        return utterance;

      } catch (err) {
        warn('speechSynthesis falhou:', err);
      }
    }
  }


  KOB.speakText = speakText;


  /* ==========================================================
     SPEAK BLOCK
     ========================================================== */

  function speakBlock(frame, target, index = -1) {

    if (!target) return;

    const doc = target.ownerDocument;

    if (!doc) return;

    const text = cleanText(
      target.innerText ||
      target.textContent
    );

    if (!text) return;

    const blocks = getTextBlocks(doc);

    if (index < 0) {
      index = blocks.indexOf(target);
    }

    setActive(
      frame,
      doc,
      target,
      index
    );

    log(
      '▶ bloco',
      index,
      'runtime:',
      getFrameRuntime(frame)
    );

    try {
      if (window.KOBLLUX?.state) {
        window.KOBLLUX.state.isSpeaking = true;
      }
    } catch (err) {}

    speakText(text, {
      frame,
      doc,
      element: target,
      index
    });
  }


  KOB.speakBlock = speakBlock;


  /* ==========================================================
     CLICK TO SPEAK
     ========================================================== */

  function onDocumentClick(frame, ev) {

    if (!CFG.clickToSpeak) return;

    const target =
      ev.target?.closest?.(
        CFG.textSelector
      );

    if (!target) return;

    if (isInsideTTSUI(target)) return;

    /*
     * Nunca tratar o cabeçalho da janela como texto.
     */

    if (
      target.closest?.(
        CFG.headerSelector
      )
    ) {
      return;
    }

    const doc = target.ownerDocument;

    if (!doc) return;

    const blocks =
      getTextBlocks(doc);

    let index =
      blocks.indexOf(target);

    /*
     * Fallback por texto.
     */

    if (index < 0) {

      const targetText =
        cleanText(
          target.innerText ||
          target.textContent
        );

      index =
        blocks.findIndex(
          el =>
            cleanText(
              el.innerText ||
              el.textContent
            ) === targetText
        );
    }

    speakBlock(
      frame,
      target,
      index
    );
  }


  /* ==========================================================
     SELECTION TO SPEAK
     ========================================================== */

  function onDocumentSelection(frame, ev) {

    if (!CFG.selectionToSpeak) return;

    /*
     * Pequeno delay para permitir que a seleção
     * seja consolidada pelo navegador.
     */

    setTimeout(() => {

      try {

        const doc =
          getFrameDocument(frame);

        if (!doc) return;

        const selection =
          doc.getSelection?.();

        if (!selection) return;

        const text =
          cleanText(
            selection.toString()
          );

        if (!text) return;

        log(
          '🔊 seleção:',
          text.slice(0, 100)
        );

        state.activeFrame = frame;
        state.activeDoc = doc;

        speakText(text, {
          frame,
          doc,
          selection
        });

      } catch (err) {

        warn(
          'selection speak failed:',
          err
        );
      }

    }, 30);
  }


  /* ==========================================================
     BIND DOCUMENT
     ========================================================== */

  function bindDocument(frame) {

    const doc =
      getFrameDocument(frame);

    if (!doc) {
      warn(
        'Não foi possível acessar o documento:',
        frame
      );

      return null;
    }

    /*
     * Evita rebinding no mesmo documento.
     */

    if (doc.__kobTTSUniBound) {

      log(
        'Documento já ligado:',
        getFrameRuntime(frame)
      );

      return doc;
    }

    doc.__kobTTSUniBound = true;

    const clickHandler =
      ev => onDocumentClick(
        frame,
        ev
      );

    const selectionHandler =
      ev => onDocumentSelection(
        frame,
        ev
      );

    doc.addEventListener(
      'click',
      clickHandler,
      {
        passive: true
      }
    );

    doc.addEventListener(
      'pointerup',
      selectionHandler,
      {
        passive: true
      }
    );

    /*
     * Algumas interfaces carregam conteúdo
     * dinamicamente.
     */

    try {

      if (
        window.MutationObserver
      ) {

        const observer =
          new MutationObserver(
            mutations => {

              let changed = false;

              for (
                const mutation
                of mutations
              ) {

                if (
                  mutation.addedNodes?.length
                ) {
                  changed = true;
                  break;
                }
              }

              if (!changed) return;

              clearTimeout(
                doc.__kobOutlineTimer
              );

              doc.__kobOutlineTimer =
                setTimeout(() => {

                  rebuildOutline(
                    frame,
                    doc
                  );

                }, 150);
            }
          );

        observer.observe(
          doc.body || doc.documentElement,
          {
            childList: true,
            subtree: true
          }
        );

        doc.__kobTTSObserver =
          observer;
      }

    } catch (err) {
      warn(
        'MutationObserver error:',
        err
      );
    }


    /*
     * API local para o documento.
     */

    doc.__kobTTS = {
      frame,
      speakText,
      speakBlock,
      rebuild: () =>
        rebuildOutline(
          frame,
          doc
        )
    };


    /*
     * API KOBLLUX
     */

    try {

      if (
        typeof window.kobInitTTS ===
        'function'
      ) {

        window.kobInitTTS(
          doc
        );
      }

    } catch (err) {

      warn(
        'kobInitTTS error:',
        err
      );
    }


    rebuildOutline(
      frame,
      doc
    );

    state.frames.set(
      getFrameId(frame),
      {
        frame,
        doc,
        runtime:
          getFrameRuntime(frame)
      }
    );

    state.activeFrame =
      frame;

    state.activeDoc =
      doc;

    log(
      '✓ TTS bound:',
      getFrameId(frame),
      'runtime:',
      getFrameRuntime(frame)
    );

    return doc;
  }


  /* ==========================================================
     REBIND FRAME
     ========================================================== */

  function rebindFrame(frame) {

    if (!frame) return;

    const runtime =
      getFrameRuntime(frame);

    log(
      '🔁 Rebinding:',
      runtime
    );

    /*
     * Reset do motor, se existir.
     */

    try {

      if (
        window.kobTTS &&
        typeof window.kobTTS.reset ===
        'function'
      ) {
        window.kobTTS.reset();
      }

    } catch (err) {}


    /*
     * Remove estado visual antigo
     * nos documentos conhecidos.
     */

    state.frames.forEach(
      item => {

        if (item.doc) {
          clearActive(
            item.doc
          );
        }

      }
    );


    /*
     * Tenta ligar o novo DOM.
     */

    const doc =
      bindDocument(frame);

    if (!doc) return;


    /*
     * Atualiza referência global.
     */

    window.__kob_doc =
      doc;

    window.__kob_frame =
      frame;

    window.__kob_runtime =
      runtime;


    /*
     * Integração KOBLLUX.
     */

    try {

      if (
        window.KOBLLUX &&
        typeof window.KOBLLUX.rebuildBlocks ===
        'function'
      ) {
        window.KOBLLUX.rebuildBlocks();
      }

    } catch (err) {}


    try {

      if (
        window.KOBLLUX &&
        typeof window.KOBLLUX.updateArchetype ===
        'function'
      ) {

        window.KOBLLUX.updateArchetype(
          window.KOBLLUX.state?.archIdx || 0
        );
      }

    } catch (err) {}
  }


  /* ==========================================================
     BIND FRAME
     ========================================================== */

  function bindFrame(frame) {

    if (!frame) return;

    if (
      frame.__kobTTSUniFrameBound
    ) {
      return;
    }

    frame.__kobTTSUniFrameBound =
      true;


    /*
     * Cada .win-frame possui seu
     * próprio ciclo de load.
     */

    frame.addEventListener(
      'load',
      () => {

        setTimeout(
          () => {

            rebindFrame(
              frame
            );

          },
          CFG.bindDelay
        );

      },
      false
    );


    /*
     * Se já estiver carregado,
     * tenta imediatamente.
     */

    const doc =
      getFrameDocument(frame);

    if (
      doc &&
      doc.readyState === 'complete'
    ) {

      setTimeout(
        () =>
          rebindFrame(frame),
        CFG.bindDelay
      );
    }


    log(
      '✓ Frame registrado:',
      getFrameId(frame),
      'runtime:',
      getFrameRuntime(frame)
    );
  }


  /* ==========================================================
     SCAN ALL WINDOWS
     ========================================================== */

  function scanFrames(root = document) {

    if (!root) return;

    try {

      const frames =
        root.querySelectorAll(
          CFG.frameSelector
        );

      frames.forEach(
        bindFrame
      );

      log(
        'Frames encontrados:',
        frames.length
      );

    } catch (err) {

      warn(
        'scanFrames error:',
        err
      );
    }
  }


  /* ==========================================================
     OBSERVER DO SHELL
     ========================================================== */

  function observeShell() {

    if (
      !window.MutationObserver
    ) {
      return;
    }

    const observer =
      new MutationObserver(
        mutations => {

          let found =
            false;

          mutations.forEach(
            mutation => {

              mutation.addedNodes?.forEach(
                node => {

                  if (
                    node.nodeType !==
                    Node.ELEMENT_NODE
                  ) {
                    return;
                  }

                  /*
                   * O próprio nó pode ser
                   * um win-frame.
                   */

                  if (
                    node.matches?.(
                      CFG.frameSelector
                    )
                  ) {

                    bindFrame(
                      node
                    );

                    found = true;
                  }


                  /*
                   * Ou pode conter
                   * vários win-frame.
                   */

                  node.querySelectorAll?.(
                    CFG.frameSelector
                  ).forEach(
                    frame => {

                      bindFrame(
                        frame
                      );

                      found = true;
                    }
                  );

                }
              );

            }
          );

          if (found) {
            log(
              '⚡ Novo win-frame detectado'
            );
          }
        }
      );


    observer.observe(
      document.body ||
      document.documentElement,
      {
        childList: true,
        subtree: true
      }
    );

    KOB.shellObserver =
      observer;
  }


  /* ==========================================================
     PUBLIC API
     ========================================================== */

  KOB.scan =
    () => scanFrames();

  KOB.rebind =
    frame => {

      if (frame) {
        rebindFrame(frame);
        return;
      }

      scanFrames();
    };

  KOB.getFrames =
    () => [
      ...state.frames.values()
    ];

  KOB.getActive =
    () => ({
      frame:
        state.activeFrame,
      doc:
        state.activeDoc,
      target:
        state.activeTarget,
      index:
        state.currentIndex
    });

  KOB.stop =
    () => {

      try {

        if (
          window.kobTTS &&
          typeof window.kobTTS.stop ===
          'function'
        ) {
          window.kobTTS.stop();
        }

      } catch (err) {}

      try {

        if (
          window.speechSynthesis
        ) {
          window.speechSynthesis.cancel();
        }

      } catch (err) {}

      state.frames.forEach(
        item => {

          clearActive(
            item.doc
          );

        }
      );

      state.activeTarget =
        null;

      state.currentIndex =
        -1;
    };


  /* ==========================================================
     BOOT
     ========================================================== */

  function boot() {

    log(
      '════════════════════════════════'
    );

    log(
      ' KOB-TTS OUTLINE UNI :: BOOT'
    );

    log(
      '════════════════════════════════'
    );

    scanFrames();

    observeShell();

    /*
     * Re-scan extra.
     *
     * Útil quando o shell cria as
     * session-windows depois do DOMContentLoaded.
     */

    setTimeout(
      () => scanFrames(),
      300
    );

    setTimeout(
      () => scanFrames(),
      1000
    );

    log(
      '✓ KOB-TTS UNI online'
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

})();