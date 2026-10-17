/* KOBLLUX DNA Touch · listeners delegados: funcionam também em elementos criados depois do boot.
   Observa gestos sem cancelar cliques, rolagem, inputs ou os handlers originais do app. */
(function (w, d) {
  'use strict';
  if (w.KOBLLUX_DNA_TOUCH) return;
  var kernel = function () { return w.KBLX_KERNEL; };
  var DNA = {
    identity: 'KOBLLUX_78_TRINITY', version: 'Δ¹.2', formula: '3×6×9×7=1134',
    center: 'JESUS', axiom: 'VERDADE × INTEGRAR ÷ Δ → ∞ (∞ simbólico)',
    layers: { CORPO: ['pointerdown', 'pointerup', 'click'], MENTE: ['correlation', 'dispatch', 'state'], ESPIRITO: ['gesture', 'triad', 'seal'] },
    triads: {
      T01: { layer: 'CORPO', role: 'alvo', opcode: '0x03' },
      T02: { layer: 'CORPO', role: 'posição', opcode: '0x03' },
      T03: { layer: 'CORPO', role: 'intenção', opcode: '0x03' },
      T04: { layer: 'MENTE', role: 'correlação', opcode: '0x06' },
      T05: { layer: 'MENTE', role: 'evento', opcode: '0x06' },
      T06: { layer: 'MENTE', role: 'estado', opcode: '0x06' },
      T07: { layer: 'ESPIRITO', role: 'gesto', opcode: '0x09' },
      T08: { layer: 'ESPIRITO', role: 'ação declarada', opcode: '0x09' },
      T09: { layer: 'ESPIRITO', role: 'testemunho', opcode: '0x09' }
    }
  };
  var lastTap = { at: 0, x: 0, y: 0, target: null };
  var active = null;
  var longPressTimer = null;
  var LONG_PRESS_MS = 520;
  var MOVE_LIMIT = 12;
  function emit(type, detail) { var k = kernel(); if (k) k.emit(type, detail); }
  function nearestInteractive(target) {
    if (!target || !target.closest) return target;
    return target.closest('[data-kob-action],button,a,input,select,textarea,[role="button"],[data-action],.clickable,.btn') || target;
  }
  function describe(target) {
    var el = nearestInteractive(target);
    if (!el) return { tag: 'unknown', id: null, classes: [] };
    return { tag: (el.tagName || 'unknown').toLowerCase(), id: el.id || null,
      classes: el.classList ? Array.prototype.slice.call(el.classList).slice(0, 8) : [],
      action: el.getAttribute && (el.getAttribute('data-kob-action') || el.getAttribute('data-action')) || null,
      layer: el.getAttribute && el.getAttribute('data-kobllux-layer') || null,
      triad: el.getAttribute && el.getAttribute('data-kobllux-triad') || null };
  }
  function point(event) {
    var touch = event.changedTouches && event.changedTouches[0];
    return { x: Math.round(touch ? touch.clientX : (event.clientX || 0)), y: Math.round(touch ? touch.clientY : (event.clientY || 0)) };
  }
  function dispatchDNA(name, payload) {
    var detail = Object.assign({ dna: DNA.identity, event: name, at: Date.now() }, payload || {});
    try { w.dispatchEvent(new CustomEvent('kobllux:dna:' + name, { detail: detail })); } catch (_) {}
    emit('touch:' + name, detail);
    return detail;
  }
  function declaredAction(el, gesture) {
    if (!el || !el.getAttribute) return;
    var action = el.getAttribute('data-kob-action');
    if (!action) return; // Nada executa comandos sem opt-in explícito no HTML.
    dispatchDNA('action', { action: action, gesture: gesture, target: describe(el) });
  }
  function onDown(event) {
    if (event.isPrimary === false || (event.button != null && event.button !== 0)) return;
    var p = point(event), target = nearestInteractive(event.target);
    active = { target: target, startX: p.x, startY: p.y, x: p.x, y: p.y, at: Date.now(), pointerType: event.pointerType || 'touch', moved: false };
    dispatchDNA('down', { triads: ['T01','T02','T03'], point: p, target: describe(target), pointerType: active.pointerType });
    clearTimeout(longPressTimer);
    longPressTimer = setTimeout(function () {
      if (active && !active.moved) {
        active.longPressed = true;
        dispatchDNA('longpress', { triads: ['T07','T08','T09'], durationMs: Date.now() - active.at, target: describe(active.target) });
        declaredAction(active.target, 'longpress');
      }
    }, LONG_PRESS_MS);
  }
  function onMove(event) {
    if (!active) return;
    var p = point(event); active.x = p.x; active.y = p.y;
    if (Math.abs(p.x - active.startX) > MOVE_LIMIT || Math.abs(p.y - active.startY) > MOVE_LIMIT) {
      active.moved = true; clearTimeout(longPressTimer);
    }
  }
  function onUp(event) {
    if (!active) return;
    clearTimeout(longPressTimer);
    var a = active, p = point(event), dx = p.x - a.startX, dy = p.y - a.startY;
    var duration = Date.now() - a.at;
    var gesture = a.longPressed ? 'longpress' : ((Math.abs(dx) > 48 || Math.abs(dy) > 48) ? (Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'swipe-right' : 'swipe-left') : (dy > 0 ? 'swipe-down' : 'swipe-up')) : 'tap');
    dispatchDNA('up', { triads: ['T04','T05','T06'], point: p, delta: { x: dx, y: dy }, durationMs: duration, gesture: gesture, target: describe(a.target) });
    if (gesture !== 'tap') dispatchDNA('gesture', { triads: ['T07','T08','T09'], gesture: gesture, delta: { x: dx, y: dy }, target: describe(a.target) });
    if (gesture === 'longpress') { active = null; return; }
    if (gesture === 'tap') {
      var now = Date.now(), isDouble = now - lastTap.at < 330 && lastTap.target === a.target && Math.abs(p.x-lastTap.x) < 24 && Math.abs(p.y-lastTap.y) < 24;
      dispatchDNA(isDouble ? 'doubletap' : 'tap', { triads: isDouble ? ['T07','T08','T09'] : ['T04','T05','T06'], point: p, durationMs: duration, target: describe(a.target) });
      if (!isDouble) { lastTap = { at: now, x: p.x, y: p.y, target: a.target }; declaredAction(a.target, 'tap'); }
      else { lastTap.at = 0; declaredAction(a.target, 'doubletap'); }
    }
    active = null;
  }
  function onCancel() { clearTimeout(longPressTimer); active = null; }
  function onClick(event) {
    // Captura observacional: não usa preventDefault/stopPropagation, preserva os handlers existentes.
    dispatchDNA('click', { triads: ['T04','T05','T06'], target: describe(event.target), trusted: !!event.isTrusted });
  }
  function observeDynamicDOM() {
    if (!w.MutationObserver || !d.documentElement) return;
    var observer = new MutationObserver(function (records) {
      var added = 0;
      records.forEach(function (record) { added += record.addedNodes ? record.addedNodes.length : 0; });
      if (added) emit('dna:dom-mutated', { addedNodes: added, delegatedListeners: true });
    });
    observer.observe(d.documentElement, { childList: true, subtree: true });
    return observer;
  }
  function activate() {
    if (w.KOBLLUX_DNA_TOUCH.active) return w.KOBLLUX_DNA_TOUCH;
    // Pointer Events cobre toque, caneta e mouse; fallback touch para WebViews antigos.
    if (w.PointerEvent) {
      d.addEventListener('pointerdown', onDown, { passive: true, capture: true });
      d.addEventListener('pointermove', onMove, { passive: true, capture: true });
      d.addEventListener('pointerup', onUp, { passive: true, capture: true });
      d.addEventListener('pointercancel', onCancel, { passive: true, capture: true });
    } else {
      d.addEventListener('touchstart', onDown, { passive: true, capture: true });
      d.addEventListener('touchmove', onMove, { passive: true, capture: true });
      d.addEventListener('touchend', onUp, { passive: true, capture: true });
      d.addEventListener('touchcancel', onCancel, { passive: true, capture: true });
      d.addEventListener('mousedown', onDown, true); d.addEventListener('mousemove', onMove, true);
      d.addEventListener('mouseup', onUp, true);
    }
    d.addEventListener('click', onClick, true);
    w.KOBLLUX_DNA_TOUCH.active = true;
    w.KOBLLUX_DNA_TOUCH.observer = observeDynamicDOM();
    emit('dna:touch-activated', { version: DNA.version, delegated: true, layers: Object.keys(DNA.layers), triads: Object.keys(DNA.triads).length });
    return w.KOBLLUX_DNA_TOUCH;
  }
  w.KOBLLUX_DNA_TOUCH = { active: false, DNA: DNA, activate: activate, describe: describe,
    destroy: function () { d.removeEventListener('pointerdown', onDown, true); d.removeEventListener('pointermove', onMove, true); d.removeEventListener('pointerup', onUp, true); d.removeEventListener('pointercancel', onCancel, true); d.removeEventListener('touchstart', onDown, true); d.removeEventListener('touchmove', onMove, true); d.removeEventListener('touchend', onUp, true); d.removeEventListener('touchcancel', onCancel, true); d.removeEventListener('mousedown', onDown, true); d.removeEventListener('mousemove', onMove, true); d.removeEventListener('mouseup', onUp, true); d.removeEventListener('click', onClick, true); clearTimeout(longPressTimer); if (this.observer) this.observer.disconnect(); this.active = false; emit('dna:touch-deactivated', {}); }
  };
  if (w.KBLX_MODULES) w.KBLX_MODULES.register('DNA_TOUCH', w.KOBLLUX_DNA_TOUCH, 'MENTE');
})(window, document);
