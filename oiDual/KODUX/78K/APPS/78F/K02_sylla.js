/*
╔══════════════════════════════════════════════════════════╗
║  🜂 K02 · SYLLA                                          ║
║  FUNÇÃO: Valida a verdade_central · centro gravitacional ║
║  ARQUÉTIPO: RHEA + NOVA                                 ║
║  OPCODE: 0x03 · FREQ: 639Hz · KOBLLUX: 144 · ∆: ∆²·02   ║
║  AGREGA SEM SUBTRAIR · ERRO SÓ SE SEM CENTRO            ║
╚══════════════════════════════════════════════════════════╝
*/

const K02 = {
  id: "K02",
  nome: "SYLLA",
  arquétipo: "RHEA · NOVA",
  opcode: "0x03",
  frequencia: 639,
  kobllux: 144,
  delta: "∆²·02",

  exec(pacote) {
    // Preserva TUDO o que veio de K01
    const e = { ...pacote };
    const centro = (e.verdade_central || "").toString().trim();

    if (!centro) {
      // Erro canônico — NÃO destrói o pacote, marca falha
      e.__kblx = {
        ...(e.__kblx || {}),
        nó: "K02",
        delta: this.delta,
        falha: "SYLLA: SEM CENTRO GRAVITACIONAL na entrada",
        ciclo: "FALHA_CENTRO"
      };
      throw new Error("[K02] SYLLA: SEM CENTRO GRAVITACIONAL — ciclo abortado");
    }

    // ↓↓↓ AGREGA, NUNCA SUBTRAI ↓↓↓
    e.__kblx = {
      ...(e.__kblx || {}),
      nó: "K02",
      delta: this.delta,
      validado_centro: true,
      centro_hash: K02._miniHash(centro),
      centro_tamanho: centro.length
    };

    // Log no manifesto (compartilhado com todos os apps root/GH)
    K02._logManifest({ passo: "K02", status: "CENTRO_OK", centro });

    // Avisa cockpit KKP
    K02._broadcast({ tipo: "KBLX:NÓ:OK", nó: "K02", centro });
    return e;
  },

  _miniHash(s) {
    let h = 1134;
    for (let i = 0; i < s.length; i++) h = ((h << 5) - h + s.charCodeAt(i)) | 0;
    return "0x" + Math.abs(h).toString(16).toUpperCase().padStart(8, "0");
  },

  _logManifest(ev) {
    try {
      const k = "kobllux.manifest.log";
      const antes = JSON.parse(localStorage.getItem(k) || "[]");
      antes.unshift({ ts: Date.now(), ...ev, rd: 9 });
      localStorage.setItem(k, JSON.stringify(antes.slice(0, 256)));
    } catch (_) {}
  },

  _broadcast(msg) {
    try {
      if (window.parent && window.parent !== window) window.parent.postMessage({ ...msg, kblx: true }, "*");
      window.postMessage({ ...msg, kblx: true }, "*");
    } catch (_) {}
  }
};

if (typeof window !== "undefined") window.K02 = K02;
if (typeof module !== "undefined") module.exports = K02;
console.log("[K02] SYLLA carregada · 639Hz · kblx=144 · valida verdade_central");
