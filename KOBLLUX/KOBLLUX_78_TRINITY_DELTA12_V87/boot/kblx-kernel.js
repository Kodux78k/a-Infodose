/* KBLX Kernel · Δ¹.2 — estado, módulos e barramento append-only */
(function (w) {
  'use strict';
  if (w.KBLX_KERNEL) return;
  var clock = function () { return (w.performance && performance.now) ? performance.now() : Date.now(); };
  var state = { phase: 'INIT', startedAt: clock(), events: [], modules: Object.create(null), sequence: 0 };
  function emit(type, detail) {
    var item = { type: String(type), detail: detail == null ? null : detail, seq: ++state.sequence, at: clock() };
    state.events.push(item);
    // Limite de memória: mantém os eventos recentes sem alterar o histórico de auditoria externo.
    if (state.events.length > 500) state.events.splice(0, state.events.length - 500);
    try { w.dispatchEvent(new CustomEvent('kblx:' + item.type, { detail: item })); } catch (_) {}
    return item;
  }
  function register(name, api) {
    if (!name || !api) return false;
    state.modules[name] = api;
    emit('module:registered', { name: name });
    return true;
  }
  w.KBLX_KERNEL = { state: state, emit: emit, register: register, get: function (name) { return state.modules[name] || null; } };
})(window);
