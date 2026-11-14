/* KXT SHIM — roda primeiro. Deixa o app funcionar em preview local/sandbox/offline. */
(function () {
  if (window.__KXT_SHIM__) return; window.__KXT_SHIM__ = true;
  function probe(n) { try { var s = window[n]; var k = '__kxt_probe'; s.setItem(k, '1'); s.removeItem(k); return true; } catch (e) { return false; } }
  function mem() {
    var d = {};
    return {
      getItem: function (k) { return Object.prototype.hasOwnProperty.call(d, k) ? d[k] : null; },
      setItem: function (k, v) { d[k] = String(v); }, removeItem: function (k) { delete d[k]; },
      clear: function () { d = {}; }, key: function (i) { return Object.keys(d)[i] || null; },
      get length() { return Object.keys(d).length; }
    };
  }
  // localStorage/sessionStorage bloqueados (iframe sandbox sem allow-same-origin, modo privado, WebViews) → memória
  ['localStorage', 'sessionStorage'].forEach(function (n) {
    if (!probe(n)) { try { Object.defineProperty(window, n, { value: mem(), configurable: true }); window.__KXT_MEM_STORAGE__ = true; } catch (e) {} }
  });
  if (window.__KXT_MEM_STORAGE__) console.warn('[KXT] storage bloqueado neste preview — usando memória (nada será salvo entre sessões).');

  // roda fn quando o DOM estiver pronto (não espera CDN/fonte/imagem como o window.onload)
  var _q = [];
  window.KXT_ready = function (fn) {
    if (window.__KXT_BOOTING__) { _q.push(fn); return; }   // bootloader modular: roda depois que TODOS os módulos carregarem
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { fn(); }, { once: true });
    else fn();
  };
  window.KXT_flush = function () { window.__KXT_BOOTING__ = false; _q.splice(0).forEach(function (f) { try { f(); } catch (e) { console.error('[KXT ready]', e); } }); };

  // markdown mínimo, usado se o marked (CDN) não carregou
  window.KXT_md = function (t) {
    t = String(t == null ? '' : t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    var blocks = [];
    t = t.replace(/```(\w*)\n([\s\S]*?)```/g, function (m, l, c) { blocks.push('<pre><code class="language-' + (l || 'txt') + '">' + c + '</code></pre>'); return '\u0000B' + (blocks.length - 1) + '\u0000'; });
    t = t.replace(/`([^`\n]+)`/g, '<code>$1</code>').replace(/\*\*([^*\n]+)\*\*/g, '<strong>$1</strong>').replace(/(^|[^*])\*([^*\n]+)\*/g, '$1<em>$2</em>');
    var out = t.split(/\n{2,}/).map(function (p) { p = p.trim(); if (/^\u0000B\d+\u0000$/.test(p)) return p; return '<p>' + p.replace(/\n/g, '<br>') + '</p>'; }).join('');
    return out.replace(/\u0000B(\d+)\u0000/g, function (m, i) { return blocks[+i]; });
  };
})();


/* ═══════════ KXT BOOTLOADER ═══════════
   Lê as <div data-kxt="..."> do index.html, injeta o CSS de cada módulo,
   cria o HTML via JavaScript (tpl/*.js) e carrega os scripts NA ORDEM (js/*.js).
   Usa <script>/<link> clássicos (funciona em file://, Spck, previews locais — sem import()/fetch). */
(function () {
  var CFG = {
    css: ["base", "tokens", "ambient", "card", "layout", "chat", "cockpit"],
    dom: ["icons", "ambient", "card", "solarbtn", "topbar", "chat", "cockpit"],
    js:  ["orb", "app", "card-core", "di-override", "card-fix", "bg-thumbs", "bridge", "usage", "tts", "text-beauty", "list-beauty", "solar-patch"]
  };
  window.KXT = window.KXT || { tpl: {}, version: 'final-v2', cfg: CFG, failed: [] };
  window.__KXT_BOOTING__ = true;
  var cs = document.currentScript;
  var BASE = cs && cs.src ? cs.src.replace(/[^\/]*$/, '') : './';
  var t0 = performance.now();
  function log() { var a = [].slice.call(arguments); a.unshift('[KXT boot]'); console.log.apply(console, a); }
  function fail(what, e) { KXT.failed.push(what); console.error('[KXT boot] falhou:', what, e || ''); }

  function loadScript(src) {
    return new Promise(function (ok) {
      var s = document.createElement('script'); s.src = BASE + src; s.async = false;
      s.onload = function () { ok(true); }; s.onerror = function (e) { fail(src, e); ok(false); };
      document.head.appendChild(s);
    });
  }
  function loadCss(name) {
    return new Promise(function (ok) {
      var l = document.createElement('link'); l.rel = 'stylesheet'; l.href = BASE + 'css/' + name + '.css'; l.setAttribute('data-kxt-css', name);
      var done = false; function fin() { if (!done) { done = true; ok(); } }
      l.onload = fin; l.onerror = function (e) { fail('css/' + name + '.css', e); fin(); }; setTimeout(fin, 2500);
      document.head.appendChild(l);
    });
  }
  function mount(name) {
    var host = document.querySelector('[data-kxt="' + name + '"]');
    if (!host) { fail('mount:' + name + ' (falta <div data-kxt="' + name + '">)'); return; }
    if (KXT.tpl[name] == null) { fail('tpl:' + name); return; }
    host.innerHTML = KXT.tpl[name];
    host.setAttribute('data-kxt-mounted', '1');
  }

  function start() {
    document.documentElement.style.visibility = 'hidden';            // evita flash sem CSS
    var chain = Promise.all(CFG.css.map(loadCss));
    chain = chain.then(function () { return CFG.dom.reduce(function (p, n) { return p.then(function () { return loadScript('tpl/' + n + '.js'); }).then(function () { mount(n); }); }, Promise.resolve()); });
    chain = chain.then(function () { return CFG.js.reduce(function (p, n) { return p.then(function () { return loadScript('js/' + n + '.js'); }); }, Promise.resolve()); });
    chain.then(function () {
      try { try { if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol)) {     navigator.serviceWorker.register('./sw.js')       .then(() => console.log('Service Worker Registered'))       .catch(e => console.warn('[SW] não registrado:', e.message));   } } catch (e) {} } catch (e) {}
      window.KXT_flush();                                              // agora sim: App.init() e cia.
      document.documentElement.style.visibility = '';
      document.dispatchEvent(new CustomEvent('kxt:ready'));
      log('pronto em ' + Math.round(performance.now() - t0) + ' ms', KXT.failed.length ? ('· FALHAS: ' + KXT.failed.join(', ')) : '· 0 falhas');
    });
    setTimeout(function () { document.documentElement.style.visibility = ''; }, 6000);   // nunca deixa a tela escondida
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
