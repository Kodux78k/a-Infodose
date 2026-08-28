(() => {

  "use strict";


  /* =======================================================
     ESTADO
     ======================================================= */

  let resize = null;


  /* =======================================================
     COMEÇA O RESIZE
     ======================================================= */

  document.addEventListener(
    "pointerdown",
    (event) => {

      const handle =
        event.target.closest(
          ".session-window .resize-corner"
        );

      if (!handle) return;


      const session =
        handle.closest(
          ".session-window"
        );

      if (!session) return;


      /*
       * Não permite resize enquanto maximizado.
       */

      if (
        session.classList.contains(
          "maximized"
        )
      ) {
        return;
      }


      const rect =
        session.getBoundingClientRect();


      resize = {

        session,

        startX:
          event.clientX,

        startY:
          event.clientY,

        startWidth:
          rect.width,

        startHeight:
          rect.height
      };


      session.classList.add(
        "resizing"
      );


      /*
       * Captura o pointer.
       *
       * Isso é especialmente importante
       * no iPhone/touch.
       */

      try {

        handle.setPointerCapture(
          event.pointerId
        );

      } catch (_) {}


      event.preventDefault();
      event.stopPropagation();

    },
    {
      passive: false
    }
  );


  /* =======================================================
     MOVE
     ======================================================= */

  window.addEventListener(
    "pointermove",
    (event) => {

      if (!resize) return;


      const dx =
        event.clientX -
        resize.startX;


      const dy =
        event.clientY -
        resize.startY;


      /*
       * LARGURA
       */

      const width =
        Math.max(
          280,
          resize.startWidth + dx
        );


      /*
       * ALTURA
       */

      const height =
        Math.max(
          120,
          resize.startHeight + dy
        );


      resize.session.style.width =
        `${width}px`;


      resize.session.style.height =
        `${height}px`;


      event.preventDefault();

    },
    {
      passive: false
    }
  );


  /* =======================================================
     FINALIZA
     ======================================================= */

  function finishResize() {

    if (!resize) return;


    resize.session.classList.remove(
      "resizing"
    );


    resize = null;
  }


  window.addEventListener(
    "pointerup",
    finishResize,
    {
      passive: true
    }
  );


  window.addEventListener(
    "pointercancel",
    finishResize,
    {
      passive: true
    }
  );


  /* =======================================================
     API
     ======================================================= */

  window.IFSW_RESIZE = {

    get active() {
      return !!resize;
    },

    cancel() {
      finishResize();
    }

  };


})();