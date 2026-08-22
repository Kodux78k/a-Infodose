/* KOB BUS REMOTE ENDPOINT */

(function () {

  'use strict';

  function clean(text) {

    return String(text || '')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 1200);

  }

  function send(text, element) {

    text = clean(text);

    if (!text) return;

    if (
      window.parent ===
      window
    ) {
      return;
    }

    window.parent.postMessage({

      type: 'KOB_TTS',

      text,

      frameId:
        window.__KOB_FRAME_ID ||
        null,

      url:
        location.href,

      source:
        'KOB_REMOTE_FRAME'

    }, '*');

  }


  document.addEventListener(
    'click',
    function (event) {

      let el =
        event.target;

      if (!el) return;


      if (
        el.closest?.(
          'input,textarea,select'
        )
      ) {
        return;
      }


      /*
        Se clicou em SVG,
        sobe para o botão.
      */

      if (
        el.tagName === 'SVG' ||
        el.tagName === 'PATH' ||
        el.tagName === 'USE'
      ) {

        el =
          el.closest?.(
            'button,a'
          ) ||
          el.parentElement;

      }


      const block =
        el.closest?.(
          'article,section,p,h1,h2,h3,h4,h5,h6,' +
          '.card,.v-glass,[data-kob-content]'
        ) ||
        el;


      const text =
        block.innerText ||
        block.textContent ||
        block.getAttribute?.(
          'aria-label'
        ) ||
        '';


      send(
        text,
        block
      );

    },
    true
  );


  /*
    Recebe identidade enviada pelo shell.
  */

  window.addEventListener(
    'message',
    function (event) {

      if (
        event.data?.type !==
        'KOB_BUS_INIT'
      ) {
        return;
      }


      window.__KOB_FRAME_ID =
        event.data.frameId ||
        null;


      /*
        Confirma que o cabo está vivo.
      */

      event.source?.postMessage({

        type:
          'KOB_BUS_PING',

        frameId:
          window.__KOB_FRAME_ID,

        source:
          'KOB_REMOTE_FRAME'

      }, event.origin === 'null'
        ? '*'
        : event.origin);

    }
  );

})();