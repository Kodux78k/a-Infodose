/*
╔══════════════════════════════════════════════════════════╗
║  🜂 K06 · DUAL · CÓRTEX AI · TÚNEL                       ║
║  FUNÇÃO: Chamada externa · API IA · 3 tentativas        ║
║  ARQUÉTIPO: PULSE + VITALIS                             ║
║  OPCODE: 0x06/0x04 · FREQ: 417+396Hz · KBLX: 288        ║
║  ∆: ∆²·05A · CONECTA COM idHome / Córtex.AI (GH)        ║
║  MESMO PAYLOAD DO N8N · X-KOBLLUX-CARIMBO: 1134         ║
╚══════════════════════════════════════════════════════════╝
*/

const K06 = {
  id: "K06",
  nome: "DUAL · CÓRTEX AI",
  arquétipo: "PULSE · VITALIS",
  opcode: "0x06/0x04",
  frequencia: [417, 396],
  kobllux: 288,
  delta: "∆²·05A",
  maxTries: 3,
  esperaMs: 2000,
  timeoutMs: 15000,
  // Túnel Cloudflare canônico (mesmo do n8n)
  tunel: "https://handy-operation-florida-attacked.trycloudflare.com/kobllux/processar",

  async exec(pacote) {
    const e = { ...pacote };
    const m = e.__kblx || {};
    let resposta = null;
    let erro = null;

    for (let tentativa = 1; tentativa <= this.maxTries; tentativa++) {
      try {
        resposta = await K06._chamar({
          verdade_central: e.verdade_central || "",
          selo: m.selo || "0xSEM_SELO_C1134_V7",
          carimbo: m.carimbo || 1134,
          delta: m.delta_rd || 9,
          polo: m.delta || this.delta,
          origem: "78F_MOTOR_KOBLLUX_V3",
          tunel: this.tunel,
          tentativa,
          pacote_completo: e // ← AGREGA, NÃO PERDE NADA
        });
        erro = null;
        break;
      } catch (err) {
        erro = String(err.message || err);
        if (tentativa < this.maxTries) {
          await new Promise(r => setTimeout(r, this.esperaMs));
        }
      }
    }

    // ↓↓↓ AGREGA o retorno (ou falha) SEM APAGAR NADA ↓↓↓
    e.__kblx = {
      ...m,
      nó: "K06",
      delta: this.delta,
      via: "API_EXTERNA",
      tentativas_usadas: resposta ? (K06._tentativaAtual || 1) : this.maxTries,
      resposta_ok: !!resposta,
      resposta,
      erro_api: erro,
      rd_resposta: K06._rd((resposta && typeof resposta === "object")
        ? Object.values(resposta).join("") : String(resposta || ""))
    };

    // Avisa idHome / Córtex.AI (app GitHub)
    K06._broadcast({
      tipo: "KBLX:CORTEX", ok: !!resposta,
      selo: m.selo, tentativas: K06._tentativaAtual || 1
    });
    return e;
  },

  async _chamar(body) {
    const ctrl = new AbortController();
    const to = setTimeout(() => ctrl.abort(), this.timeoutMs);
    try {
      const r = await fetch(K06.tunel, {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          "X-KOBLLUX-CARIMBO": "1134",
          "X-KOBLLUX-SELO": body.selo || ""
        },
        body: JSON.stringify(body),
        signal: ctrl.signal
      });
      K06._tentativaAtual = body.tentativa;
      if (!r.ok) throw new Error("HTTP_" + r.status);
      return await r.json().catch(() => await r.text());
    } finally {
      clearTimeout(to);
    }
  },

  _rd(s) {
    let x = String(s || "").split("").reduce((a, c) => a + (isNaN(+c) ? 0 : +c), 0);
    while (x > 9) x = String(x).split("").reduce((a, b) => a + (+b), 0);
    return x || 9;
  },

  _broadcast(msg) {
    try {
      if (window.parent && window.parent !== window) window.parent.postMessage({ ...msg, kblx: true }, "*");
      window.postMessage({ ...msg, kblx: true }, "*");
    } catch (_) {}
  }
};

if (typeof window !== "undefined") window.K06 = K06;
if (typeof module !== "undefined") module.exports = K06;
console.log("[K06] DUAL Córtex AI carregado · 288 kblx · 3 tentativas · túnel CF");