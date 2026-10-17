/* KODUX Protocol · sequência determinística e correlação das tríades */
(function (w) {
  'use strict';
  var order = [
    { opcode: '0x03', name: 'DETECTAR', triads: ['T01', 'T02', 'T03'] },
    { opcode: '0x06', name: 'INTEGRAR', triads: ['T04', 'T05', 'T06'] },
    { opcode: '0x09', name: 'EXPANDIR', triads: ['T07', 'T08', 'T09'] },
    { opcode: '0x07', name: 'SELAR', triads: ['SEAL'] }
  ];
  function correlate(from, to, context) { return { from: from, to: to, linked: true, context: context || 'boot' }; }
  function run(step, fn) {
    var kernel = w.KBLX_KERNEL;
    if (!kernel) throw new Error('KBLX_KERNEL ausente');
    kernel.state.phase = step.name;
    kernel.emit('phase:start', { opcode: step.opcode, name: step.name });
    var result = fn ? fn() : true;
    kernel.emit('phase:done', { opcode: step.opcode, name: step.name, result: result });
    return result;
  }
  w.KODUX_PROTOCOL = { order: order, correlate: correlate, run: run };
})(window);
