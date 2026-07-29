/*
╔══════════════════════════════════════════════════════════╗
║  🜂 K04 · IGNYRA + A€K_DION                              ║
║  FUNÇÃO: Purifica · classifica · remove ruído           ║
║  ARQUÉTIPO: KAOS + SERENA                               ║
║  OPCODE: 0x05/0x08 · FREQ: 672+639Hz · KBLX: 288        ║
║  ∆: ∆²·04 · NÃO APAGA DADOS — só FILTRA nulos/vazios    ║
╚══════════════════════════════════════════════════════════╝
*/

const K04 = {
  id: "K04",
  nome: "IGNYRA + A€K_DION",
  arquétipo: "KAOS · SERENA",
  opcode: "0x05/0x08",
  frequencia: [672, 639],
  kobllux: 288, // 2×144
  delta: "∆²·04",

  exec(pacote) {
    const e = { ...pacote };
    const antes = Object.keys(e).length;

    // ↓↓↓ FILTRA SÓ nulos / vazios / undefined — PRESERVA TODO O RESTO ↓↓↓
    const limpo = Object.fromEntries(
      Object.entries(e).filter(([k, v]) => {
        if (k === "__kblx") return true;                    // nunca toca no kblx
        if (v === null || v === undefined) return false;    // ruído
        if (typeof v === "string" && v.trim() === "") return false;
        return true;
      })
    );

    const depois = Object.keys(limpo).length;
    limpo.__kblx = {
      ...(limpo.__kblx || {}),
      nó: "K04",
      delta: this.delta,
      validado_niveis: true,
      purificado: true,
      campos_antes: antes,
      campos_depois: depois,
      ruido_removido: antes - depois,
      essencia_mantida: true
    };

    // Log de segurança (QoS / Serena)
    K04._logQoS(limpo.__kblx);
    K04._broadcast({ tipo: "KBLX:PUREZA", antes, depois, ruido: antes - depois });
    return limpo;
  },

  _logQoS(m) {
    try {
      const k = "kblx:stats";
      const s = JSON.parse(localStorage.getItem(k) || '{"limpezas":0,"totalRuido":0}');
      s.limpezas += 1;
      s.totalRuido += (m.ruido_removido | 0);
      s.ultima = Date.now();
      localStorage.setItem(k, JSON.stringify(s));
    } catch (_) {}
  },

  _broadcast(msg) {
    try {
      if (window.parent && window.parent !== window) window.parent.postMessage({ ...msg, kblx: true }, "*");
      window.postMessage({ ...msg, kblx: true }, "*");
    } catch (_) {}
  }
};

if (typeof window !== "undefined") window.K04 = K04;
if (typeof module !== "undefined") module.exports = K04;
console.log("[K04] IGNYRA+A€K_DION carregados · 288 kblx · purifica sem perder essência");