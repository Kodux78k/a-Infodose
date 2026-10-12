/* KobBoot · bootloader de interface
   Cada parte da UI é um script em ui/ que chama:
     KobBoot.mount(nome, html)            -> injeta o html onde o <script> está no index
     KobBoot.into(seletor, nome, html)    -> acrescenta o html dentro de um grupo já montado
   Todo elemento injetado recebe data-boot="nome".
   Scripts clássicos síncronos: a ordem no index = a ordem no DOM = a ordem de boot. */
(function (w, d) {
  var B = w.KobBoot = w.KobBoot || {};
  B.version = '1.0';
  B.parts = [];
  B.errors = [];
  function frag(name, html) {
    var t = d.createElement('template');
    t.innerHTML = html;
    Array.prototype.forEach.call(t.content.children, function (el) {
      el.setAttribute('data-boot', name);
    });
    return t.content;
  }
  function fail(name, e) {
    B.errors.push({ part: name, error: String(e) });
    if (w.console) console.error('[KobBoot]', name, e);
  }
  B.mount = function (name, html) {
    var s = d.currentScript;
    try {
      if (!s || !s.parentNode) throw new Error('sem document.currentScript');
      s.parentNode.insertBefore(frag(name, html), s);
      B.parts.push(name);
    } catch (e) { fail(name, e); }
  };
  B.into = function (sel, name, html) {
    try {
      var p = d.querySelector(sel);
      if (!p) throw new Error('grupo ' + sel + ' ainda não existe');
      p.appendChild(frag(name, html));
      B.parts.push(name);
    } catch (e) { fail(name, e); }
  };
  B.report = function () { return { parts: B.parts.length, errors: B.errors }; };
})(window, document);
