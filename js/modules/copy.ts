document.addEventListener('DOMContentLoaded', () => {
  const iframe = document.getElementById('frame') as HTMLIFrameElement | null;
  const outline = document.getElementById('kob-tts-outline');

  if (!iframe) return;

  let boundDoc: Document | null = null;

  /* =========================================================
     KOB TTS OUTLINE
     ========================================================= */

  function getFrameDoc(): Document | null {
    try {
      return iframe.contentDocument ||
             iframe.contentWindow?.document ||
             null;
    } catch (err) {
      console.warn('[KOB-TTS] acesso ao iframe bloqueado:', err);
      return null;
    }
  }

  function getReadableBlocks(doc: Document): Element[] {
    const selector = 'h1,h2,h3,p,li,blockquote,pre,td,th';

    return [...doc.querySelectorAll(selector)]
      .filter(el => {
        const text = (el.textContent || '').trim();
        return text.length > 0;
      });
  }

  /*
   * Copia a informação textual/estrutural do documento do iframe
   * para #kob-tts-outline.
   */
  function syncOutline(doc: Document) {
    if (!outline) return;

    const blocks = getReadableBlocks(doc);

    outline.innerHTML = '';

    const fragment = document.createDocumentFragment();

    blocks.forEach((source, index) => {
      const item = document.createElement('div');

      item.className = 'kob-tts-outline-item';

      item.dataset.index = String(index);

      item.textContent =
        (source.textContent || '').trim();

      item.dataset.tag =
        source.tagName.toLowerCase();

      fragment.appendChild(item);
    });

    outline.appendChild(fragment);

    outline.dataset.count = String(blocks.length);

    console.log(
      `[KOB-TTS] outline sincronizado: ${blocks.length} blocos`
    );
  }

  /*
   * Retorna o bloco correspondente ao índice.
   */
  function getBlock(index: number): Element | null {
    const doc = getFrameDoc();

    if (!doc) return null;

    const blocks = getReadableBlocks(doc);

    return blocks[index] || null;
  }

  /* =========================================================
     REBIND TTS
     ========================================================= */

  function rebindTTS() {
    try {
      const doc = getFrameDoc();

      if (!doc) return;

      console.log('🔁 Rebinding KOB-TTS...');

      /*
       * Sincroniza PRIMEIRO.
       */
      syncOutline(doc);

      /*
       * Limpa estado antigo.
       */
      if (
        window.kobTTS &&
        typeof window.kobTTS.reset === 'function'
      ) {
        window.kobTTS.reset();
      }

      /*
       * Remove estados antigos do documento principal.
       */
      document
        .querySelectorAll('.kob-tts-active')
        .forEach(el =>
          el.classList.remove('kob-tts-active')
        );

      /*
       * Inicializa TTS no documento REAL do iframe.
       */
      if (
        typeof window.kobInitTTS === 'function'
      ) {
        window.kobInitTTS(doc);
      }

      /*
       * Mantém referência global.
       */
      window.__kob_doc = doc;

      /*
       * Reconstrói blocos do KOBLLUX.
       */
      if (
        window.KOBLLUX &&
        typeof window.KOBLLUX.rebuildBlocks === 'function'
      ) {
        window.KOBLLUX.rebuildBlocks();
      }

    } catch (err) {
      console.warn(
        '[KOB-TTS] erro no rebind:',
        err
      );
    }
  }

  /* =========================================================
     CLICK → SPEAK
     ========================================================= */

  function onDocClick(ev: Event) {
    const target = ev.target as Element | null;

    if (!target?.closest) return;

    const selector =
      'h1,h2,h3,p,li,blockquote,pre,td,th';

    const block =
      target.closest(selector);

    if (!block) return;

    try {
      const doc = getFrameDoc();

      if (!doc) return;

      const blocks =
        getReadableBlocks(doc);

      let idx =
        blocks.findIndex(
          b => b === block
        );

      if (idx < 0) {
        const text =
          (block.textContent || '').trim();

        idx =
          blocks.findIndex(
            b =>
              (b.textContent || '').trim() === text
          );
      }

      if (idx < 0) return;

      /*
       * Atualiza KOBLLUX.
       */
      if (
        window.KOBLLUX &&
        window.KOBLLUX.state
      ) {
        window.KOBLLUX.state.currentBlockIdx =
          idx;
      }

      /*
       * Destaca o bloco correspondente
       * no outline do documento principal.
       */
      document
        .querySelectorAll(
          '.kob-tts-outline-item'
        )
        .forEach(el =>
          el.classList.remove(
            'kob-tts-active'
          )
        );

      const outlineItem =
        outline?.querySelector(
          `[data-index="${idx}"]`
        );

      outlineItem?.classList.add(
        'kob-tts-active'
      );

      /*
       * Fala.
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

      if (
        prefs.clickToSpeak &&
        window.KOBLLUX &&
        typeof window.KOBLLUX.startSpeech === 'function'
      ) {
        window.KOBLLUX.state.isSpeaking = true;

        window.KOBLLUX.startSpeech();
      }

    } catch (err) {
      console.warn(
        '[KOB-TTS] click-to-speak failed:',
        err
      );
    }
  }

  /* =========================================================
     SELECTION → SPEAK
     ========================================================= */

  function onDocSelectionSpeak() {
    try {
      const doc = getFrameDoc();

      if (!doc) return;

      const selection =
        doc.getSelection?.();

      const text =
        selection?.toString().trim();

      if (!text) return;

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
        '[KOB-TTS] selection speak failed:',
        err
      );
    }
  }

  /* =========================================================
     BIND DOCUMENTO DO IFRAME
     ========================================================= */

  function bindIframeDoc() {
    try {
      const doc = getFrameDoc();

      if (!doc) return;

      if (doc === boundDoc) return;

      boundDoc = doc;

      /*
       * Cada navegação cria um novo Document.
       * Então o listener antigo pertence ao documento anterior.
       */

      doc.addEventListener(
        'click',
        onDocClick,
        { passive: true }
      );

      doc.addEventListener(
        'pointerup',
        onDocSelectionSpeak,
        { passive: true }
      );

      console.log(
        'KOB-TTS click trigger bound ✓'
      );

      syncOutline(doc);

    } catch (err) {
      console.warn(
        '[KOB-TTS] bindIframeDoc failed:',
        err
      );
    }
  }

  /* =========================================================
     REBIND COMPLETO
     ========================================================= */

  function rebindAll() {
    const doc = getFrameDoc();

    if (!doc) return;

    /*
     * IMPORTANTE:
     * rebuildBlocks precisa trabalhar com o documento
     * do iframe, não com o document pai.
     */

    if (
      window.KOBLLUX &&
      typeof window.KOBLLUX.rebuildBlocks === 'function'
    ) {
      try {
        window.KOBLLUX.rebuildBlocks(doc);
      } catch (err) {
        console.warn(
          '[KOB-TTS] rebuildBlocks:',
          err
        );
      }
    }

    if (
      window.KOBLLUX &&
      typeof window.KOBLLUX.updateArchetype === 'function'
    ) {
      try {
        window.KOBLLUX.updateArchetype(
          window.KOBLLUX.state?.archIdx || 0
        );
      } catch (_) {}
    }

    syncOutline(doc);

    bindIframeDoc();

    rebindTTS();
  }

  /* =========================================================
     IFRAME LOAD
     ========================================================= */

  iframe.addEventListener(
    'load',
    () => {
      setTimeout(
        rebindAll,
        120
      );
    }
  );

  /*
   * Primeira inicialização.
   */
  bindIframeDoc();

});