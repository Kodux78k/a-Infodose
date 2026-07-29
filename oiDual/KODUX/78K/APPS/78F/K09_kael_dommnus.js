/*
╔══════════════════════════════════════════════════════════╗
║  🜂 K09 · A€KAEL DOMMNUS                                 ║
║  FUNÇÃO: Carimbo final · fecha ciclo · responde webhook ║
║  ARQUÉTIPO: AION                                        ║
║  OPCODE: 0x05 · FREQ: 672Hz · KBLX: 144 · ∆: ∆²·09      ║
║  ESCREVE NO LEDGER ROOT · COMPARTILHA COM SmB + TODOS   ║
║  FECHA CICLO: K01 → K09 → K01 · SEM FIM                 ║
╚══════════════════════════════════════════════════════════╝
*/

const K09 = {
  id: "K09",
  nome: "A€KAEL DOMMNUS",
  arquétipo: "AION",
  opcode: "0x05",
  frequencia: 672,
  kobllux: 144,
  delta: "∆²·09",

  exec(pacoteFinal, ctx = {}) {
    const e = { ...pacoteFinal };
    const agora = Date.now();
    const m = e.__kblx || {};
    const inicio = m.ts_inicio || agora;
    const duracao = agora - inicio;

    // ↓↓↓ CARIMBO FINAL — AGREGA, NUNCA REMOVE ↓↓↓
    e.__kblx = {
      ...m,
      nó: "K09",
      delta: this.delta,
      ts_fim: agora,
      duracao_ms: duracao,
      ciclo: "FECHADO",
      carimbo_final: 1134,
      rd_garantido: 9,
      fechado_por: "A€KAEL DOMMNUS_672Hz",
      proximo_ciclo: "K01_A€NEPHESH",
      selo_ledger: (m.selo || "0xSEM_SELO") + "_LEDGER_C1134_V7"
    };

    // 1. Ledger AION — histórico imutável no root localStorage
    K09._gravaLedger(e);

    // 2. Responde webhook / contexto de chamada (se houver)
    if (ctx.responder) {
      try {
        ctx.responder({
          status: 200,
          headers: {
            "Content-Type": "application/json",
            "X-KOBLLUX-CARIMBO": "1134",
            "X-KOBLLUX-SELO": e.__kblx.selo || "",
            "X-KOBLLUX-RD": "9"
          },
          body: JSON.stringify(e)
        });
      } catch (_) {}
    }

    // 3. Avisa TODOS os apps (SmB arquitetura, KKP cockpit, 78EM editor, 78NP leitor, idHome)
    K09._broadcast({
      tipo: "KBLX:CICLO:FECHADO",
      selo: e.__kblx.selo,
      duracao,
      rd: 9,
      carimbo: 1134
    });

    // 4. Fecha o ciclo — prepara para reiniciar em K01
    K09._autoReinicio(e);
    return e;
  },

  _gravaLedger(e) {
    try {
      const m = e.__kblx || {};
      const k = "kblx:history";
      const antes = JSON.parse(localStorage.getItem(k) || "[]");
      antes.unshift({
        ts: m.ts_fim,
        selo: m.selo,
        ciclo: "FECHADO",
        duracao_ms: m.duracao_ms,
        carimbo: 1134,
        rd: 9,
        centro: e.verdade_central || ""
      });
      localStorage.setItem(k, JSON.stringify(antes.slice(0, 512)));

      // Estatísticas globais
      const s = JSON.parse(localStorage.getItem("kblx:stats") || '{"ciclos":0,"tempoTotal":0}');
      s.ciclos += 1;
      s.tempoTotal += (m.duracao_ms | 0);
      s.ultimo = m.ts_fim;
      localStorage.setItem("kblx:stats", JSON.stringify(s));
    } catch (_) {}
  },

  _autoReinicio(e) {
    // Se motor estiver em modo "Roda Viva", agenda próximo ciclo em K01
    try {
      const modo = localStorage.getItem("motor_roda_viva");
      if (modo === "1" && typeof window !== "undefined" && window.K01) {
        const espera = Math.max(250, 1134 - (e.__kblx?.duracao_ms | 0));
        setTimeout(() => {
          try {
            const prox = {
              verdade_central: e.verdade_central || "",
              __ciclo_anterior: e.__kblx?.selo || "",
              __auto: true
            };
            window.KBLX_LS_RUNNER?.rodar(prox).catch(() => {});
          } catch (_) {}
        }, espera);
      }
    } catch (_) {}
  },

  _broadcast(msg) {
    try {
      if (window.parent && window.parent !== window) window.parent.postMessage({ ...msg, kblx: true }, "*");
      window.postMessage({ ...msg, kblx: true }, "*");
    } catch (_) {}
  }
};

if (typeof window !== "undefined") window.K09 = K09;
if (typeof module !== "undefined") module.exports = K09;
console.log("[K09] A€KAEL DOMMNUS carregado · 672Hz · fecha ciclo · AION ledger");