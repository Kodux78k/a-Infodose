/*
╔══════════════════════════════════════════════════════════╗
║  🜂 K03 · SYLON · RÉGUA CANÔNICA                         ║
║  FUNÇÃO: Injeta as constantes 3·6·9·7 no pacote         ║
║  ARQUÉTIPO: ATLAS                                       ║
║  OPCODE: 0x01 · FREQ: 174Hz · KOBLLUX: 144 · ∆: ∆²·03   ║
║  3×6×9×7 = 1134 · rd(1134·N) = 9 PARA TODO N            ║
╚══════════════════════════════════════════════════════════╝
*/

const K03 = {
  id: "K03",
  nome: "SYLON",
  arquétipo: "ATLAS",
  opcode: "0x01",
  frequencia: 174,
  kobllux: 144,
  delta: "∆²·03",
  regua: {
    camadas: 3,     // UNO / DUAL / TRINITY
    polos: 6,       // 3×2
    potenciais: 9,  // 3²
    selos: 7,       // FATOR VIDA · BLLUE=rd=7
    carimbo: 3 * 6 * 9 * 7 // 1134
  },

  exec(pacote) {
    const e = { ...pacote }; // TUDO preservado
    const r = this.regua;

    // ↓↓↓ AGREGA A RÉGUA — NÃO TOCA NO RESTO ↓↓↓
    e.__kblx = {
      ...(e.__kblx || {}),
      nó: "K03",
      delta: this.delta,
      regua_aplicada: true,
      camadas: r.camadas,
      polos: r.polos,
      potenciais: r.potenciais,
      selos: r.selos,
      carimbo: r.carimbo,
      fractal: "3×6×9×7=1134",
      teorema_kobllux: "∀N∈ℕ · rd(1134·N) = 9"
    };

    // Escreve régua no root localStorage → todos os apps do GH leem
    try {
      localStorage.setItem("kblx:regua", JSON.stringify({
        ...r,
        ts: Date.now(),
        rd: K03._rd(r.carimbo) // deve ser 9
      }));
    } catch (_) {}

    // Atualiza HUD do 78F
    K03._broadcast({ tipo: "KBLX:REGUA:OK", carimbo: r.carimbo, rd: 9 });
    return e;
  },

  _rd(n) {
    let x = Math.abs(n | 0);
    while (x > 9) x = String(x).split("").reduce((a, b) => a + (+b), 0);
    return x;
  },

  _broadcast(msg) {
    try {
      if (window.parent && window.parent !== window) window.parent.postMessage({ ...msg, kblx: true }, "*");
      window.postMessage({ ...msg, kblx: true }, "*");
    } catch (_) {}
  }
};

if (typeof window !== "undefined") window.K03 = K03;
if (typeof module !== "undefined") module.exports = K03;
console.log("[K03] SYLON carregado · 174Hz · 3×6×9×7=1134 · rd=9");