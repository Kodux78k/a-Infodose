/*
╔══════════════════════════════════════════════════════════╗
║  🜂 K01 · A€NEPHESH ELYON                                ║
║  FUNÇÃO: Entrada canônica do ciclo KBLX∆³               ║
║  ARQUÉTIPO: AION + ARCHE                                ║
║  OPCODE: 0x01 · FREQ: 432Hz · KOBLLUX: 144 · ∆: ∆²·01   ║
║  CONSTANTE: 1134 = 3×6×9×7 · rd=9                       ║
║  AGREGA SEM SUBTRAIR · NUNCA APAGA CAMPOS ORIGINAIS     ║
╚══════════════════════════════════════════════════════════╝
*/

const K01 = {
  id: "K01",
  nome: "A€NEPHESH ELYON",
  arquétipo: "AION · ARCHE",
  opcode: "0x01",
  frequencia: 432,
  kobllux: 144,
  delta: "∆²·01",
  carimbo: 1134,

  /**
   * Executa a porta de entrada: valida existência do corpo,
   * injeta metadados canônicos, registra início no localStorage.
   * @param {object} entrada - payload bruto (body ou json direto)
   * @returns {object} pacote enriquecido SEM perder campos originais
   */
  exec(entrada = {}) {
    const inicio = Date.now();
    const raw = (entrada && entrada.body && typeof entrada.body === "object")
      ? { ...entrada.body }
      : { ...entrada };

    // ↓↓↓ NUNCA SUBTRAIR — só agregar ↓↓↓
    const pacote = {
      ...raw,                              // TUDO o que veio fica
      __kblx: {
        nó: "K01",
        delta: this.delta,
        ts_inicio: inicio,
        carimbo: this.carimbo,
        ciclo: "ABERTO",
        origem: "A€NEPHESH_432Hz",
        instancia: "78F_MOTOR",
        versão: "v1134"
      }
    };

    // Registra batida no histórico local (root / compartilhado com GH apps)
    try {
      const chave = "kblx:history";
      const antes = JSON.parse(localStorage.getItem(chave) || "[]");
      antes.unshift({
        ts: inicio,
        nó: "K01",
        evento: "ENTRADA_CICLO",
        centro: pacote.verdade_central || "",
        selo: "0x_ENTRADA_C1134_V7"
      });
      localStorage.setItem(chave, JSON.stringify(antes.slice(0, 128)));
    } catch (_) {}

    // Avisa outros apps (78EM / 78NP / KKP / SmB) que ciclo começou
    K01._broadcast({ tipo: "KBLX:CICLO:INICIO", nó: "K01", ts: inicio });

    return pacote;
  },

  _broadcast(msg) {
    try {
      // root → todos os iframes / apps do GitHub (SmB, idHome, etc.)
      if (window.parent && window.parent !== window) {
        window.parent.postMessage({ ...msg, kblx: true }, "*");
      }
      window.postMessage({ ...msg, kblx: true }, "*");
    } catch (_) {}
  }
};

// Exposição canônica — compatível com 78F, 78EM, root e GH apps
if (typeof window !== "undefined") window.K01 = K01;
if (typeof module !== "undefined") module.exports = K01;
console.log("[K01] A€NEPHESH carregado · 432Hz · kblx=144 · rd=9");
