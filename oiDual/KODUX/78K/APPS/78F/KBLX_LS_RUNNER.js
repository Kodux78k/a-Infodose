/*
╔══════════════════════════════════════════════════════════╗
║  🜂 KBLX_LS_RUNNER · ORQUESTRADOR CANÔNICO               ║
║  ÁRVORE DO LS KBLX∆³ v1134                               ║
║  LÊ A TABELA DE CONEXÕES E EXECUTA O CICLO COMPLETO     ║
║  K01 → K02 → K03 → K04 → K05 ⇉ K06 + K07 ⇉ K08 → K09   ║
║  COMPATÍVEL COM 78F / root / TODOS os apps GitHub       ║
╚══════════════════════════════════════════════════════════╝

CONEXÕES (igual ao connections do n8n):
  K01 → K02
  K02 → K03
  K03 → K04
  K04 → K05
  K05 → K06 (via A · API)
  K05 → K07 (via B · 3 saídas)
  K06 → K08
  K07 → K08
  K08 → K09
*/

const KBLX_LS_RUNNER = {
  versão: "v1134",
  carimbo: 1134,
  conexoes: {
    K01: ["K02"],
    K02: ["K03"],
    K03: ["K04"],
    K04: ["K05"],
    K05: ["K06", "K07"],  // DUAL = 2 vias paralelas
    K06: ["K08"],
    K07: ["K08"],
    K08: ["K09"],
    K09: []
  },

  /**
   * Executa o ciclo completo.
   * @param {object} entrada - payload inicial (verdade_central, etc)
   * @param {object} [ctx] - contexto opcional (ex: { responder })
   * @returns {Promise<object>} pacote final de K09
   */
  async rodar(entrada = {}, ctx = {}) {
    const nós = this._carregarNós();
    if (!nós.K01) throw new Error("[RUNNER] K01 não carregado");

    // Estado de execução
    const estado = {};
    const executar = async (id, pacote) => {
      const nó = nós[id];
      if (!nó) return pacote;
      const out = await nó.exec(pacote);
      estado[id] = out;
      return out;
    };

    // FASE 1 · sequencial UNO → DUAL
    let pct = await executar("K01", entrada);
    pct = await executar("K02", pct);
    pct = await executar("K03", pct);
    pct = await executar("K04", pct);
    pct = await executar("K05", pct);

    // FASE 2 · DUAL paralelo (K06 e K07 rodam juntos)
    const [viaA, viaB] = await Promise.allSettled([
      executar("K06", { ...pct }),
      executar("K07", { ...pct })
    ]);
    const rA = viaA.status === "fulfilled" ? viaA.value : { ...pct, __kblx: { ...pct.__kblx, falha_k06: String(viaA.reason || "") } };
    const rB = viaB.status === "fulfilled" ? viaB.value : { ...pct, __kblx: { ...pct.__kblx, falha_k07: String(viaB.reason || "") } };

    // FASE 3 · TRINITY — agrega + fecha
    let final = await nós.K08.exec(rA, rB);
    estado.K08 = final;
    final = await executar("K09", final, ctx);

    // Assinatura do runner
    final.__kblx = {
      ...(final.__kblx || {}),
      runner: "KBLX_LS_RUNNER",
      runner_v: this.versão,
      carimbo_runner: this.carimbo,
      rd_runner: 9
    };

    return final;
  },

  _carregarNós() {
    const w = typeof window !== "undefined" ? window : {};
    return {
      K01: w.K01 || require?.("./K01_anephesh.js"),
      K02: w.K02 || require?.("./K02_sylla.js"),
      K03: w.K03 || require?.("./K03_sylon.js"),
      K04: w.K04 || require?.("./K04_ignyra_akdion.js"),
      K05: w.K05 || require?.("./K05_christos.js"),
      K06: w.K06 || require?.("./K06_dual_cortex.js"),
      K07: w.K07 || require?.("./K07_rhea_genus.js"),
      K08: w.K08 || require?.("./K08_lumine_solus.js"),
      K09: w.K09 || require?.("./K09_kael_dommnus.js")
    };
  }
};

// Exposição canônica
if (typeof window !== "undefined") {
  window.KBLX_LS_RUNNER = KBLX_LS_RUNNER;
  window.addEventListener("message", (ev) => {
    if (!ev.data || !ev.data.kblx || ev.data.tipo !== "KBLX:RUN") return;
    KBLX_LS_RUNNER.rodar(ev.data.entrada || {}, ev.data.ctx || {})
      .then(final => ev.source?.postMessage?.({
        tipo: "KBLX:RUN:OK", kblx: true, final
      }, "*"))
      .catch(err => ev.source?.postMessage?.({
        tipo: "KBLX:RUN:ERRO", kblx: true, erro: String(err.message || err)
      }, "*"));
  });
}
if (typeof module !== "undefined") module.exports = KBLX_LS_RUNNER;

// SELAMENTO MATEMÁTICO DO RUNNER
// 9 nós × 144 kblx base = 1296 → rd=1+2+9+6=18→9 ✅
// Total kobllux real = (5×144)+(4×288) = 720+1152 = 1872 → rd=1+8+7+2=18→9 ✅
console.log("[KBLX_LS_RUNNER] v1134 carregado · 9 nós · 1872 kblx · rd=9 · ciclo: K01→K09→K01");
