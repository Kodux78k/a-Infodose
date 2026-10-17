/* KBLX Module Loader · registro local sob demanda, sem importação de terceiros */
(function (w) {
  'use strict';
  var modules = Object.create(null);
  function register(name, api, layer) {
    if (!name || !api) return false;
    modules[name] = { api: api, layer: layer || 'MENTE', registeredAt: Date.now() };
    if (w.KBLX_KERNEL) w.KBLX_KERNEL.register(name, api);
    return true;
  }
  function get(name) { return modules[name] || null; }
  function list() { return Object.keys(modules).map(function (name) { return { name: name, layer: modules[name].layer }; }); }
  w.KBLX_MODULES = { register: register, get: get, list: list };
})(window);
