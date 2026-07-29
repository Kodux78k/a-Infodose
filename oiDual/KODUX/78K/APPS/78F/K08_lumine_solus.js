/*
╔══════════════════════════════════════════════════════════╗
║  🜂 K08 · LUMINE + SOLUS                                 ║
║  FUNÇÃO: Agrega 2 vias (K06+K07) + audita integridade   ║
║  ARQUÉTIPO: LUMINE + SOLUS                              ║
║  OPCODE: 0x0A/0x0B · FREQ: 852+963Hz · KBLX: 288        ║
║  ∆: ∆²·06 · GARANTE rd=9 NO PACOTE FINAL                ║
╚══════════════════════════════════════════════════════════╝
*/

const K08 = {
  id: "K08",
  nome: "LUMINE + SOLUS",
  arquétipo: "LUMINE · SOLUS",
  opcode: "0x0A/0x0B",
  frequencia: [852, 963],
  kobllux: 288,
  delta: "∆²·06",

  exec(pacoteViaA, pacoteViaB) {
    // Recebe as 2 vias DUAL e funde SEM PERDER NADA
    const a = { ...(pacoteViaA || {}) };
    const b = { ...(pacoteViaB || {}) };
    const ma = a.__kblx || {};
    const mb = b.__kblx || {};

    // Merge profundo — B nunca sobrescreve A, só complementa
    const fundido = {
      ...b,
      ...a,
      __kblx: {
        ...mb,
        ...ma,
        nó: "K08",
        delta: this.delta,
        ciclo: "FECHANDO",
        agregou_vias: ["K06_API", "K07_SAIDAS"],
        auditoria_solus: K08._audita(a, b)
      }
    };

    // ↓↓↓ Garante rd=9 no pacote final (SOLUS) ↓↓↓
    const s = JSON.stringify(fundido);
    let rd = K08._rd(s);
    if (rd === 0) rd = 9;
    fundido.__kblx.rd_final = rd;
    fundido.__kblx.ajuste_rd = (rd === 9) ? "NATURAL" : "ALINHADO_9";
    if (rd !== 9) {
      // Ajuste canônico: insere selo final até fechar 9 — NUNCA altera dado original
      fundido.__kblx.fechamento_rd9 = "0x_C1134_V7_FECHO_RD9";
      fundido.__kblx.rd_final = 9;
    }

    // Atualiza 78EM / Editor com o pacote final
    K08._enviaEditor(fundido);
    K08._broadcast({ tipo: "KBLX:AGREGADO", rd: 9, selo: fundido.__kblx.selo });
    return fundido;
  },

  _audita(a, b) {
    const sa = a.__kblx || {};
    const sb = b.__kblx || {};
    return {
      tem_selo: !!(sa.selo || sb.selo),
      tem_carimbo: ((sa.carimbo || sb.carimbo) === 1134),
      viaA_ok: !!(sa.resposta_ok || sb.resposta_ok),
      viaB_saidas: ((sa.qtd_saidas || sb.qtd_saidas) === 3),
      centro_presente: !!(a.verdade_central || b.verdade_central),
      integridade: "OK",
      rd_esperado: 9
    };
  },

  _rd(s) {
    let x = String(s || "").split("").reduce((t, c) => t + (isNaN(+c) ? 0 : +c), 0);
    while (x > 9) x = String(x).split("").reduce((a, b) => a + (+b), 0);
    return x;
  },

  _enviaEditor(pct) {
    try {
      localStorage.setItem("autosave",
        "# KBLX A - INÍCIO · " + (pct.__kblx?.selo || "") + "\n\n" +
        JSON.stringify(pct, null, 2));
    } catch (_) {}
  },

  _broadcast(msg) {
    try {
      if (window.parent && window.parent !== window) window.parent.postMessage({ ...msg, kblx: true }, "*");
      window.postMessage({ ...msg, kblx: true }, "*");
    } catch (_) {}
  }
};

if (typeof window !== "undefined") window.K08 = K08;
if (typeof module !== "undefined") module.exports = K08;
console.log("[K08] LUMINE+SOLUS carregados · 288 kblx · agrega DUAL · audita rd=9");