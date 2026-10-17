/* KOBLLUX Boot Manager · 0x03 → 0x06 → 0x09 → 0x07 */
(function (w, d) {
  'use strict';
  if (w.KOBLLUX_BOOT) return;
  var started = (w.performance && performance.now) ? performance.now() : Date.now();
  var report = { version: 'Δ¹.2', status: 'BOOTING', phases: [], correlations: [], checks: {}, timingMs: 0, seal: null, dna: null };
  function now() { return (w.performance && performance.now) ? performance.now() : Date.now(); }
  async function phase(opcode, name, fn) {
    var t = now(), kernel = w.KBLX_KERNEL;
    kernel.state.phase = name;
    kernel.emit('phase:start', { opcode: opcode, name: name });
    var result = await fn();
    kernel.emit('phase:done', { opcode: opcode, name: name, result: result });
    report.phases.push({ opcode: opcode, name: name, durationMs: +(now() - t).toFixed(3), result: result });
    return result;
  }
  function publish() {
    report.timingMs = +(now() - started).toFixed(3);
    w.KOBLLUX_BOOT.report = report;
    try { w.dispatchEvent(new CustomEvent('kobllux:boot-ready', { detail: report })); } catch (_) {}
  }
  function detect() {
    return { html: !!d.documentElement, scriptCount: d.scripts.length, domNodes: d.getElementsByTagName('*').length,
      hasKernel: !!w.KBLX_KERNEL, hasKodux: !!w.KODUX_PROTOCOL, hasHorus: !!w.HORUS_VALIDATOR,
      hasModuleLoader: !!w.KBLX_MODULES, hasTouchDNA: !!w.KOBLLUX_DNA_TOUCH };
  }
  function integrate(manifest) {
    var links = [];
    for (var i = 0; i < manifest.pipeline.length - 1; i++) links.push(w.KODUX_PROTOCOL.correlate(manifest.pipeline[i].opcode, manifest.pipeline[i + 1].opcode));
    report.correlations = links;
    return { triadCount: manifest.pipeline.filter(function (item) { return item.triads; }).reduce(function (n, item) { return n + item.triads.length; }, 0), edges: links.length, manifest: manifest.name };
  }
  function expand(manifest) {
    if (w.KOBLLUX_DNA_TOUCH) w.KOBLLUX_DNA_TOUCH.activate();
    report.dna = w.KOBLLUX_DNA_TOUCH ? { identity: w.KOBLLUX_DNA_TOUCH.DNA.identity, triads: Object.keys(w.KOBLLUX_DNA_TOUCH.DNA.triads).length, touchListenerActive: w.KOBLLUX_DNA_TOUCH.active } : null;
    return { layers: Object.keys(manifest.layers || {}), modules: w.KBLX_MODULES.list(), dynamicTouchListeners: !!(w.KOBLLUX_DNA_TOUCH && w.KOBLLUX_DNA_TOUCH.active), lazyModules: true };
  }
  async function seal(manifest) {
    var checks = w.HORUS_VALIDATOR.verify(manifest, report.correlations);
    var canonical = JSON.stringify({ name: manifest.name, version: manifest.version, formula: manifest.formula, pipeline: manifest.pipeline, layers: manifest.layers });
    var hash = await w.HORUS_VALIDATOR.sha256(canonical);
    report.checks = checks;
    report.seal = { algorithm: hash ? 'SHA-256' : 'unavailable', hash: hash, valid: !!(checks.valid && hash), meaning: hash ? 'manifest hashed; structural checks reported separately' : 'SHA-256 indisponível neste contexto; verificação estrutural apenas' };
    report.status = report.seal.valid ? 'READY_VERIFIED' : (checks.valid ? 'READY_STRUCTURAL_ONLY' : 'READY_WITH_WARNINGS');
    return report.seal;
  }
  async function boot() {
    if (!w.KBLX_KERNEL || !w.KODUX_PROTOCOL || !w.HORUS_VALIDATOR || !w.KBLX_MODULES || !w.KOBLLUX_DNA_TOUCH) {
      report.status = 'BOOT_DEGRADED'; report.error = 'Um ou mais componentes do bootloader não carregaram.'; publish(); return report;
    }
    try {
      var manifest;
      try {
        var response = await fetch('./boot/triad-manifest.json', { cache: 'no-cache' });
        if (!response.ok) throw new Error('HTTP ' + response.status);
        manifest = await response.json();
      } catch (error) {
        manifest = { name: 'KOBLLUX_FALLBACK', version: 'Δ¹.2', formula: { expression: '3×6×9×7', numeric_result: 1134, infinity: 'symbolic' },
          pipeline: w.KODUX_PROTOCOL.order.map(function (step) { return { opcode: step.opcode, name: step.name, triads: step.triads }; }),
          layers: { micro: 'token/opcode', meso: 'triad/module', macro: 'boot/runtime' } };
        report.manifestFallback = true;
        report.manifestWarning = String(error);
      }
      await phase('0x03', 'DETECTAR', detect);
      await phase('0x06', 'INTEGRAR', function () { return integrate(manifest); });
      await phase('0x09', 'EXPANDIR', function () { return expand(manifest); });
      await phase('0x07', 'SELAR', function () { return seal(manifest); });
      w.KBLX_KERNEL.state.phase = report.status;
      w.KBLX_KERNEL.emit('boot:complete', { status: report.status, timingMs: report.timingMs, seal: report.seal });
    } catch (error) { report.status = 'BOOT_ERROR'; report.error = String(error); }
    publish();
    if (w.console && console.info) console.info('[KOBLLUX BOOT]', report.status, report);
    return report;
  }
  w.KOBLLUX_BOOT = { report: report, start: boot, version: 'Δ¹.2' };
  if (d.readyState === 'loading') d.addEventListener('DOMContentLoaded', boot, { once: true }); else boot();
})(window, document);
