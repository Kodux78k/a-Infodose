/* ============================================================
   KOB TTS OUTLINE UNI
   Multi-Window / Multi-Stack / Dynamic iframe
   KOBLLUX
   ============================================================ */

(() => {
  'use strict';

  const KOB = {
    selector: '.session-window .win-frame[data-runtime="nav"]',

    /**
     * Todas as janelas NAV existentes.
     */
    getFrames() {
      return [...document.querySelectorAll(this.selector)];
    },

    /**
     * Documento interno de uma janela.
     */
    getDoc(frame) {
      try {
        return (
          frame?.contentDocument ||
          frame?.contentWindow?.document ||
          null
        );
      } catch (err) {
        console.warn('[KOB-TTS] iframe inacessível:', err);
        return null;
      }
    },

    /**
     * Blocos que podem ser lidos.
     */
    getBlocks(doc) {
      if (!doc) return [];

      const selector =
        'h1,h2,h3,h4,h5,h6,p,li,blockquote,pre,td,th';

      return [...doc.querySelectorAll(selector)]
        .filter(el => {
          const text = (
            el.innerText ||
            el.textContent ||
            ''
          ).trim();

          return text.length > 0;
        });
    },

    /**
     * Limpa estados visuais antigos.
     */
    clearActive() {
      document
        .querySelectorAll('.kob-tts-active')
        .forEach(el => {
          el.classList.remove('kob-tts-active');
        });

      this.getFrames().forEach(frame => {
        const doc = this.getDoc(frame);

        if (!doc) return;

        doc
          .querySelectorAll('.kob-tts-active')
          .forEach(el => {
            el.classList.remove('kob-tts-active');
          });
      });
    },

    /**
     * Reativa o motor TTS para uma determinada janela.
     */
    rebind(frame) {
      const doc = this.getDoc(frame);

      if (!doc) {
        console.warn(
          '[KOB-TTS] documento não disponível:',
          frame
        );
        return;
      }

      console.log(
        '🔁 KOB-TTS REBIND →',
        frame.dataset.runtime || 'nav',
        frame.id || '(sem id)'
      );

      /*
       * Guarda o documento ativo.
       */
      window.__kob_doc = doc;

      /*
       * Guarda também o iframe ativo.
       */
      window.__kob_frame = frame;

      /*
       * Reset do motor, se existir.
       */
      try {
        if (
          window.kobTTS &&
          typeof window.kobTTS.reset === 'function'
        ) {
          window.kobTTS.reset();
        }
      } catch (err) {
        console.warn('[KOB-TTS] reset:', err);
      }

      /*
       * Remove marcações antigas.
       */
      this.clearActive();

      /*
       * Inicializa o TTS no DOCUMENTO DA JANELA.
       */
      try {
        if (
          typeof window.kobInitTTS === 'function'
        ) {
          window.kobInitTTS(doc);
        }
      } catch (err) {
        console.warn(
          '[KOB-TTS] kobInitTTS:',
          err
        );
      }

      /*
       * Reindexa o KOBLLUX.
       */
      try {
        if (
          window.KOBLLUX &&
          typeof window.KOBLLUX.rebuildBlocks === 'function'
        ) {
          window.KOBLLUX.rebuildBlocks();
        }
      } catch (err) {
        console.warn(
          '[KOB-TTS] rebuildBlocks:',
          err
        );
      }

      /*
       * Atualiza arquétipo.
       */
      try {
        if (
          window.KOBLLUX &&
          typeof window.KOBLLUX.updateArchetype === 'function'
        ) {
          window.KOBLLUX.updateArchetype(
            window.KOBLLUX.state?.archIdx || 0
          );
        }
      } catch (_) {}

      /*
       * Liga os eventos desta janela.
       */
      this.bindDoc(frame, doc);
    },

    /**
     * Clique em texto.
     */
    onClick(ev, frame, doc) {
      try {
        const target =
          ev.target?.closest?.(
            'h1,h2,h3,h4,h5,h6,p,li,blockquote,pre,td,th'
          );

        if (!target) return;

        /*
         * Não interfere no HUD interno da página.
         */
        if (
          target.closest?.(
            '#symbolBar,' +
            '.kob-tts-dock,' +
            '.win-hdr,' +
            '.win-controls'
          )
        ) {
          return;
        }

        /*
         * Este iframe passa a ser o iframe ativo.
         */
        window.__kob_frame = frame;
        window.__kob_doc = doc;

        const blocks = this.getBlocks(doc);

        let idx = blocks.findIndex(
          el => el === target
        );

        /*
         * Fallback por texto.
         */
        if (idx < 0) {
          const text =
            (
              target.innerText ||
              target.textContent ||
              ''
            ).trim();

          idx = blocks.findIndex(
            el =>
              (
                el.innerText ||
                el.textContent ||
                ''
              ).trim() === text
          );
        }

        if (idx < 0) return;

        /*
         * Atualiza estado global.
         */
        if (
          window.KOBLLUX &&
          window.KOBLLUX.state
        ) {
          window.KOBLLUX.state.currentBlockIdx =
            idx;

          window.KOBLLUX.state.currentFrame =
            frame;
        }

        /*
         * Marca visualmente o elemento clicado.
         */
        this.clearActive();

        target.classList.add(
          'kob-tts-active'
        );

        /*
         * Preferências.
         */
        const prefs =
          window.StorageSafe?.get
            ? window.StorageSafe.get(
                'prefs',
                {
                  outline: true,
                  clickToSpeak: true
                }
              )
            : {
                clickToSpeak: true
              };

        if (!prefs.clickToSpeak) return;

        /*
         * Fala.
         */
        if (
          window.KOBLLUX &&
          typeof window.KOBLLUX.startSpeech === 'function'
        ) {
          window.KOBLLUX.state.isSpeaking = true;

          window.KOBLLUX.startSpeech();
        }

      } catch (err) {
        console.warn(
          '[KOB-TTS] click-to-speak:',
          err
        );
      }
    },

    /**
     * Seleção de texto.
     */
    onSelection(ev, frame, doc) {
      try {
        const selection =
          doc.getSelection?.();

        if (!selection) return;

        const text =
          selection.toString().trim();

        if (!text) return;

        window.__kob_frame = frame;
        window.__kob_doc = doc;

        if (
          window.KOBLLUX &&
          typeof window.KOBLLUX.speakText === 'function'
        ) {
          window.KOBLLUX.speakText(
            text,
            {}
          );
        }

      } catch (err) {
        console.warn(
          '[KOB-TTS] selection:',
          err
        );
      }
    },

    /**
     * Liga eventos a um documento específico.
     */
    bindDoc(frame, doc) {
      if (!doc) return;

      /*
       * Cada documento possui sua própria flag.
       * Isso evita duplicar listeners.
       */
      if (doc.__kobTTSBound) {
        console.log(
          'KOB-TTS já ligado:',
          frame.id || frame.dataset.runtime
        );
        return;
      }

      doc.__kobTTSBound = true;

      doc.addEventListener(
        'click',
        ev => this.onClick(
          ev,
          frame,
          doc
        ),
        {
          passive: true
        }
      );

      doc.addEventListener(
        'pointerup',
        ev => this.onSelection(
          ev,
          frame,
          doc
        ),
        {
          passive: true
        }
      );

      console.log(
        'KOB-TTS ✓',
        frame.dataset.runtime || 'nav',
        frame.id || '(dynamic)'
      );
    },

    /**
     * Liga o load de um iframe.
     */
    bindFrame(frame) {
      if (!frame) return;

      /*
       * Evita registrar o mesmo iframe várias vezes.
       */
      if (frame.__kobTTSLoadBound) return;

      frame.__kobTTSLoadBound = true;

      frame.addEventListener(
        'load',
        () => {
          /*
           * Pequeno atraso para páginas que montam DOM
           * depois do load inicial.
           */
          setTimeout(() => {
            this.rebind(frame);
          }, 120);
        }
      );

      /*
       * Se já estiver carregado.
       */
      const doc = this.getDoc(frame);

      if (
        doc &&
        doc.readyState !== 'loading'
      ) {
        setTimeout(() => {
          this.rebind(frame);
        }, 120);
      }
    },

    /**
     * Descobre todas as janelas atuais.
     */
    bindAll() {
      this.getFrames()
        .forEach(frame => {
          this.bindFrame(frame);
        });
    },

    /**
     * Observa novas session-windows.
     */
    observe() {
      const root =
        document.getElementById('stackWrap') ||
        document.body;

      if (!root) return;

      const observer =
        new MutationObserver(
          mutations => {

            let changed = false;

            for (const mutation of mutations) {
              if (
                mutation.type !== 'childList'
              ) {
                continue;
              }

              for (const node of mutation.addedNodes) {
                if (
                  node.nodeType !== Node.ELEMENT_NODE
                ) {
                  continue;
                }

                const el =
                  node;

                if (
                  el.matches?.(
                    '.win-frame[data-runtime="nav"]'
                  )
                ) {
                  changed = true;
                }

                if (
                  el.querySelector?.(
                    '.win-frame[data-runtime="nav"]'
                  )
                ) {
                  changed = true;
                }
              }
            }

            if (changed) {
              console.log(
                '🌀 KOB-TTS → nova WIN-FRAME detectada'
              );

              this.bindAll();
            }
          }
        );

      observer.observe(
        root,
        {
          childList: true,
          subtree: true
        }
      );

      window.__kobTTSObserver =
        observer;
    }
  };

  /*
   * Expõe API.
   */
  window.KOB_TTS_UNI = KOB;

  /*
   * Inicialização.
   */
  function boot() {
    console.log(
      '◉ KOB-TTS OUTLINE UNI · MULTI WIN'
    );

    KOB.bindAll();
    KOB.observe();
  }

  if (
    document.readyState === 'loading'
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