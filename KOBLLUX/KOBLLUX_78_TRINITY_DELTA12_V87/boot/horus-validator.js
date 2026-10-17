/* HORUS Validator · integridade estrutural e SHA-256 quando o navegador permitir */
(function (w) {
  'use strict';
  async function sha256(value) {
    try {
      if (w.crypto && w.crypto.subtle && w.TextEncoder) {
        var digest = await w.crypto.subtle.digest('SHA-256', new TextEncoder().encode(value));
        return Array.from(new Uint8Array(digest)).map(function (b) { return b.toString(16).padStart(2, '0'); }).join('');
      }
    } catch (_) {}
    return null;
  }
  function verify(manifest, correlations) {
    var expected = ['0x03', '0x06', '0x09', '0x07'];
    var actual = (manifest.pipeline || []).map(function (item) { return item.opcode; });
    var orderOk = expected.length === actual.length && expected.every(function (op, i) { return op === actual[i]; });
    var triads = (manifest.pipeline || []).filter(function (item) { return item.opcode !== '0x07'; }).reduce(function (all, item) { return all.concat(item.triads || []); }, []);
    var expectedTriads = ['T01','T02','T03','T04','T05','T06','T07','T08','T09'];
    var triadsOk = triads.length === 9 && new Set(triads).size === 9 && expectedTriads.every(function (t) { return triads.indexOf(t) !== -1; });
    return { orderOk: orderOk, triadsOk: triadsOk, correlations: correlations || [], valid: orderOk && triadsOk };
  }
  w.HORUS_VALIDATOR = { verify: verify, sha256: sha256 };
})(window);
