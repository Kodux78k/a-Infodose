/* 78TL ⇄ KOBLLUX · ponte de entrega
   O 78TL só lê PDF se `window.pdfjsLib` já existir (script-18) e nunca o carregava.
   Aqui: ao escolher um .pdf, carrega o PDF.js sob demanda (registro do shell pai se estiver
   embutido; senão ../vendor/pdfjs → cdnjs) e então repete o evento 'change' para o fluxo original. */
(function () {
  'use strict';
  var CDJ = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/';
  var SRCS = ['../vendor/pdfjs/pdf.min.js', CDJ + 'pdf.min.js'];
  var WORK = ['../vendor/pdfjs/pdf.worker.min.js', CDJ + 'pdf.worker.min.js'];
  var busy = null;

  function inject(src) {
    return new Promise(function (ok, no) {
      var s = document.createElement('script'); s.src = src; s.async = true;
      s.onload = function () { ok(); }; s.onerror = function () { s.remove(); no(); };
      document.head.appendChild(s);
    });
  }
  function selfLoad() {
    var p = Promise.resolve(null);
    SRCS.forEach(function (src, i) {
      p = p.then(function (v) {
        if (v) return v;
        return inject(src).then(function () {
          try { window.pdfjsLib.GlobalWorkerOptions.workerSrc = WORK[i]; } catch (e) {}
          return window.pdfjsLib || null;
        }, function () { return null; });
      });
    });
    return p;
  }
  function ensurePDF() {
    if (window.pdfjsLib) return Promise.resolve(window.pdfjsLib);
    if (busy) return busy;
    var viaParent = null;
    try { viaParent = window.parent !== window && window.parent.KOB_DELIVERY && window.parent.KOB_DELIVERY.load('pdfjs'); } catch (e) {}
    busy = Promise.resolve(viaParent).then(function (lib) { return lib || selfLoad(); })
      .then(function (lib) { if (lib && !window.pdfjsLib) window.pdfjsLib = lib; busy = null; return lib; },
            function () { busy = null; return null; });
    return busy;
  }
  window.KOB78_ensurePDF = ensurePDF;

  document.addEventListener('change', function (e) {
    var t = e.target;
    if (!t || t.id !== 'fileInput' || e._kobReplayed) return;
    var f = t.files && t.files[0];
    if (!f || !/\.pdf$/i.test(f.name) || window.pdfjsLib) return;
    e.stopImmediatePropagation();
    ensurePDF().then(function () {            /* mesmo se falhar, repete: comportamento original */
      var ev = new Event('change', { bubbles: true }); ev._kobReplayed = true;
      t.dispatchEvent(ev);
    });
  }, true);
})();
