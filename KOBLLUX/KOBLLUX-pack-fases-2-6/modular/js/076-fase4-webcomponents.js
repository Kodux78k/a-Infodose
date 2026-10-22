/* @kob-mod 076 · fase4-webcomponents · body */

/* ═══════════════════════════════════════════════════════════════════════════
   KOB · FASE 4 · Web Components (vanilla, Shadow DOM, event bus único)
   <kob-orb> <kob-archetype-switch> <kob-symbol-bar> <kob-cockpit> <kob-tts-toolbar>
   Regras: (1) só leem as CSS vars globais --active-color/--active-secondary/
   --active-glow/--active-hz (atravessam o shadow); (2) NUNCA chamam applyArch:
   emitem eventos kob:*:request; a PONTE no fim deste arquivo é o único ponto que
   fala com o legado (applyArch, #sonoroBpm, #btn-play …).
   Não substituem o DOM legado (#sbOrb, #symbolBar …): convivem; migre um a um.
   ═══════════════════════════════════════════════════════════════════════════ */
(function (W, D) {
  'use strict';
  if (W.customElements && W.customElements.get('kob-orb')) return;
  var KOB = W.KOB = W.KOB || {};

  /* ── event bus único (CustomEvent em window) ─────────────────────────── */
  KOB.emit = function (type, detail) { W.dispatchEvent(new CustomEvent(type, { detail: detail })); };
  KOB.on   = function (type, fn) { W.addEventListener(type, fn); return function () { W.removeEventListener(type, fn); }; };

  var ARCHS = function () { return (W.ARCH_LIST && W.ARCH_LIST.slice()) || ['ATLAS','NOVA','VITALIS','PULSE','ARTEMIS','SERENA','KAOS','GENUS','LUMINE','SOLUS','RHEA','AION','KODUX','BLLUE','JESUS','KOBLLUX']; };
  var curArch = function () { return (W.getArch && W.getArch()) || 'KOBLLUX'; };

  /* base: ciclo de vida + inscrição/limpeza de listeners do bus */
  class Base extends HTMLElement {
    sub(type, fn) { (this._offs = this._offs || []).push(KOB.on(type, fn.bind(this))); }
    disconnectedCallback() { (this._offs || []).forEach(function (f) { f(); }); this._offs = []; }
    shadow(css, html) {
      var r = this.shadowRoot || this.attachShadow({ mode: 'open' });
      r.innerHTML = '<style>:host{display:inline-block;font:inherit;color:inherit;--c:var(--active-color,#fff);--c2:var(--active-secondary,#888);--g:var(--active-glow,#ffffff66)}' +
        ':host([hidden]){display:none}button{font:inherit;color:inherit;cursor:pointer}' + css + '</style>' + html; return r;
    }
  }
  function def(tag, ctor) { if (!customElements.get(tag)) customElements.define(tag, ctor); }
  function mk(proto) { var C = class extends Base {}; Object.assign(C.prototype, proto); return C; }

  /* ═ <kob-orb size="56" speaking> — núcleo animado; cor vem do tema global ═ */
  def('kob-orb', mk({
    connectedCallback: function () {
      var s = +this.getAttribute('size') || 56;
      this.shadow(
        '.o{width:' + s + 'px;height:' + s + 'px;border-radius:50%;position:relative;display:block;border:0;padding:0;' +
        'background:radial-gradient(circle at 35% 30%,#fff9,var(--c) 40%,var(--c2) 100%);box-shadow:0 0 18px var(--g),inset 0 0 12px #0006;' +
        'animation:spin 14s linear infinite}' +
        '.o::before{content:"";position:absolute;inset:-6px;border-radius:50%;border:1px solid var(--c);opacity:.35}' +
        ':host([speaking]) .o{animation-duration:3s}:host([speaking]) .o::before{animation:pulse .9s ease-in-out infinite}' +
        '@keyframes spin{to{filter:hue-rotate(360deg)}}@keyframes pulse{50%{transform:scale(1.18);opacity:.75}}' +
        '@media (prefers-reduced-motion:reduce){.o,.o::before{animation:none!important}}' +
        ':host-context(html.kob-perf-lite) .o,:host-context(html.kob-frozen) .o{animation:none}',
        '<button class="o" part="orb" aria-label="Próximo arquétipo" title="clique = próximo"></button>');
      var self = this;
      this.shadowRoot.querySelector('.o').addEventListener('click', function () {
        var l = ARCHS(), i = l.indexOf(curArch()); KOB.emit('kob:arch:request', { arch: l[(i + 1) % l.length], origin: 'kob-orb' });
      });
      this.sub('kob:tts:state', function (e) { this.toggleAttribute('speaking', !!(e.detail && e.detail.speaking)); });
    }
  }));

  /* ═ <kob-archetype-switch> — 16 arquétipos; emite kob:arch:request ═══════ */
  def('kob-archetype-switch', mk({
    connectedCallback: function () {
      var r = this.shadow(
        '.g{display:grid;grid-template-columns:repeat(8,1fr);gap:4px}' +
        'button{border:1px solid #fff2;background:#0004;border-radius:8px;padding:6px 0;font-size:11px;letter-spacing:.04em}' +
        'button[aria-pressed=true]{border-color:var(--c);box-shadow:0 0 10px var(--g);color:var(--c)}', '<div class="g" role="group" aria-label="Arquétipos"></div>');
      var g = r.querySelector('.g'), self = this, M = W.ARCH_MAP || {};
      ARCHS().forEach(function (n) {
        var b = D.createElement('button'); b.type = 'button'; b.dataset.arch = n; b.title = n + (M[n] ? ' · ' + M[n].hz + 'Hz' : '');
        b.textContent = (M[n] && M[n].sym) || n[0]; b.setAttribute('aria-pressed', 'false'); g.appendChild(b);
      });
      g.addEventListener('click', function (e) { var b = e.target.closest('button'); if (b) KOB.emit('kob:arch:request', { arch: b.dataset.arch, origin: 'kob-archetype-switch' }); });
      var mark = function (a) { a = String(a || curArch()).toUpperCase(); g.querySelectorAll('button').forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.arch === a)); }); };
      this.sub('kob:arch', function (e) { mark(e.detail && e.detail.arch); }); mark();
    }
  }));

  /* ═ <kob-tts-toolbar> — ◀ ▶ ■ ; emite kob:tts:request {action} ═══════════ */
  def('kob-tts-toolbar', mk({
    connectedCallback: function () {
      var r = this.shadow('.t{display:flex;gap:6px}button{width:34px;height:34px;border-radius:10px;border:1px solid #fff2;background:#0004}button:hover{border-color:var(--c)}' +
        ':host([playing]) [data-a=play]{color:var(--c);box-shadow:0 0 10px var(--g)}',
        '<div class="t" role="toolbar" aria-label="Leitura"><button data-a="prev" title="Voltar bloco">◀</button><button data-a="play" title="Play/Pause">▶</button><button data-a="stop" title="Parar">■</button></div>');
      r.addEventListener('click', function (e) { var b = e.target.closest('button'); if (b) KOB.emit('kob:tts:request', { action: b.dataset.a }); });
      this.sub('kob:tts:state', function (e) { this.toggleAttribute('playing', !!(e.detail && e.detail.speaking)); });
    }
  }));

  /* ═ <kob-cockpit> — BPM · escala · timbre · reverb; emite kob:cockpit:request ═ */
  def('kob-cockpit', mk({
    connectedCallback: function () {
      var r = this.shadow(
        '.p{display:grid;grid-template-columns:auto 1fr;gap:6px 10px;align-items:center;font-size:12px;padding:10px;border:1px solid #fff2;border-radius:12px;background:#0005}' +
        'input,select{background:#0006;color:inherit;border:1px solid #fff3;border-radius:6px;padding:4px}input[type=range]{accent-color:var(--c)}',
        '<div class="p"><label>BPM</label><input type="number" data-k="bpm" min="60" max="240" value="130">' +
        '<label>Escala</label><select data-k="theme"></select><label>Timbre</label><select data-k="synth"></select>' +
        '<label>Reverb</label><input type="range" data-k="reverb" min="0" max="1" step="0.01" value="0.3"></div>');
      var ids = { bpm: 'sonoroBpm', theme: 'sonoroTheme', synth: 'sonoroSynth', reverb: 'sonoroReverb' };
      Object.keys(ids).forEach(function (k) {                      // espelha opções/valores do legado (leitura)
        var src = D.getElementById(ids[k]), dst = r.querySelector('[data-k=' + k + ']'); if (!src || !dst) return;
        if (dst.tagName === 'SELECT') dst.innerHTML = src.innerHTML;
        dst.value = src.value;
      });
      r.addEventListener('input', function (e) { var k = e.target.dataset.k; if (k) KOB.emit('kob:cockpit:request', { key: k, value: e.target.value }); });
    }
  }));

  /* ═ <kob-symbol-bar> — botões com data-url / data-arch; emite kob:open:request ═ */
  def('kob-symbol-bar', mk({
    connectedCallback: function () {
      var r = this.shadow('.s{display:flex;gap:6px;overflow-x:auto;padding:4px;scrollbar-width:none}.s::-webkit-scrollbar{display:none}' +
        'button{min-width:38px;height:38px;border-radius:10px;border:1px solid #fff2;background:#0004;flex:none}button[data-on]{border-color:var(--c);color:var(--c)}',
        '<div class="s" role="toolbar"><slot></slot></div>');
      // uso: <kob-symbol-bar><button data-url="…">α</button><button data-arch="NOVA">✦</button></kob-symbol-bar>
      this.addEventListener('click', function (e) {
        var b = e.target.closest('button'); if (!b) return;
        if (b.dataset.url)  { e.preventDefault(); KOB.emit('kob:open:request', { url: b.dataset.url, label: b.textContent.trim() }); }
        if (b.dataset.arch) KOB.emit('kob:arch:request', { arch: b.dataset.arch, origin: 'kob-symbol-bar' });
      });
    }
  }));

  /* ═══ PONTE: único ponto onde o bus encosta no legado ════════════════════ */
  KOB.on('kob:arch:request', function (e) { var a = e.detail && e.detail.arch; if (a && typeof W.applyArch === 'function') W.applyArch(String(a).toUpperCase()); });
  KOB.on('kob:tts:request', function (e) {
    var map = { prev: 'btn-prev', play: 'btn-play', stop: 'tts-stop' }, el = D.getElementById(map[e.detail && e.detail.action]); if (el) el.click();
  });
  KOB.on('kob:cockpit:request', function (e) {
    var ids = { bpm: 'sonoroBpm', theme: 'sonoroTheme', synth: 'sonoroSynth', reverb: 'sonoroReverb' }, d = e.detail || {}, el = D.getElementById(ids[d.key]);
    if (!el) return; el.value = d.value; el.dispatchEvent(new Event('input', { bubbles: true })); el.dispatchEvent(new Event('change', { bubbles: true }));
  });
  KOB.on('kob:open:request', function (e) {                       // abre como session (hookável via session:create)
    var d = e.detail || {}; try { W.MXP && W.MXP.createSession && W.MXP.createSession(d.label || 'SESSION', { url: d.url }); } catch (x) { console.warn(x); }
  });
  /* estado de fala → bus: o legado marca #sbOrb.speaking; lemos por evento do speechSynthesis (sem MutationObserver) */
  ['speak', 'cancel'].forEach(function (m) {
    try { var ss = W.speechSynthesis; if (!ss || ss['__kob_' + m]) return; var o = ss[m].bind(ss); ss['__kob_' + m] = 1;
      ss[m] = function () { var r = o.apply(null, arguments); KOB.emit('kob:tts:state', { speaking: m === 'speak' }); return r; }; } catch (e) {}
  });
  KOB.wc = { tags: ['kob-orb', 'kob-archetype-switch', 'kob-symbol-bar', 'kob-cockpit', 'kob-tts-toolbar'] };
})(window, document);

