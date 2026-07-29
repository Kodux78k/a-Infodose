/*
╔══════════════════════════════════════════════════════════╗
║  🜂 K07 · RHEA + GENUS · 3 SAÍDAS                        ║
║  FUNÇÃO: Manifesta em 3 formatos = UNO                  ║
║  ARQUÉTIPO: RHEA + GENUS                                ║
║  OPCODE: 0x03/0x09 · FREQ: 639+741Hz · KBLX: 288        ║
║  ∆: ∆²·05B · SAÍDAS: .md / .py / .html                  ║
║  COMPATÍVEL COM 78NP (Leitor) · root · GH apps          ║
╚══════════════════════════════════════════════════════════╝
*/

const K07 = {
  id: "K07",
  nome: "RHEA + GENUS",
  arquétipo: "RHEA · GENUS",
  opcode: "0x03/0x09",
  frequencia: [639, 741],
  kobllux: 288,
  delta: "∆²·05B",

  exec(pacote) {
    const e = { ...pacote };
    const m = e.__kblx || {};
    const selo = m.selo || "0xSEM_SELO_C1134_V7";
    const centro = e.verdade_central || "";
    const json = JSON.stringify(e, null, 2);

    // 3 SAÍDAS = UNO manifestado — AGREGA, NÃO toca no resto
    const arquivos = [
      {
        tipo: "KOBLLUX.md",
        mime: "text/markdown",
        conteudo:
`# 🜂 KOBLLUX TRINITY · ${selo}

> Verdade Central: **${centro}**

- 🕒 Gerado em: ${new Date().toISOString()}
- 🎯 Selo: \`${selo}\`
- 🔢 Carimbo: 1134 = 3×6×9×7 · rd=9
- 🌀 Delta: ${m.delta || ""}

## Pacote Completo

\`\`\`json
${json}
\`\`\`

---
*KBLX∆³ · AGREGA SEM SUBTRAIR*
`
      },
      {
        tipo: "KOBLLUX.py",
        mime: "text/x-python",
        conteudo:
`# -*- coding: utf-8 -*-
# 🜂 GERADO PELO MOTOR 78F · K07 RHEA+GENUS
# SELo: ${selo}
# CARIMBO: 1134 = 3*6*9*7
# DELTA: ${m.delta || ""}

VERDADE_CENTRAL = ${JSON.stringify(centro)}
SELO = ${JSON.stringify(selo)}
CARIMBO = 1134
DELTA_RD = 9

PAYLOAD = ${json}

if __name__ == "__main__":
    print(f"[KBLX∆³] selo={SELO} centro={VERDADE_CENTRAL[:60]} carimbo={CARIMBO} rd=9")
`
      },
      {
        tipo: "KOBLLUX.html",
        mime: "text/html",
        conteudo:
`<!doctype html>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${selo} · KBLX∆³</title>
<style>
  :root{--bg:#030508;--fg:#e9eef7;--ac:#5d7cff;--ok:#059669;--muted:#8b9ab8}
  html,body{margin:0;background:var(--bg);color:var(--fg);font-family:ui-monospace,Menlo,Consolas,monospace;font-size:13px}
  .wrap{max-width:960px;margin:0 auto;padding:32px 20px}
  h1{margin:0 0 6px;font-size:20px;letter-spacing:.08em}
  .selo{display:inline-block;padding:4px 10px;border:1px solid var(--ac);color:var(--ac);border-radius:999px;font-size:12px;margin:8px 0 18px}
  .kv{display:grid;grid-template-columns:160px 1fr;gap:6px 12px;padding:12px;border:1px solid #1b2233;border-radius:10px}
  .k{color:var(--muted)}.v{color:var(--fg);word-break:break-word}
  pre{background:#070a11;border:1px solid #1b2233;border-radius:10px;padding:14px;overflow:auto;max-height:520px}
  .rd{color:var(--ok)}
</style>
<div class=wrap>
  <h1>🜂 KOBLLUX TRINITY · v1134</h1>
  <div class=selo>${selo}</div>
  <div class=kv>
    <div class=k>Verdade Central</div><div class=v>${centro || "—"}</div>
    <div class=k>Carimbo</div><div class=v>1134 = 3×6×9×7 · <span class=rd>rd=9</span></div>
    <div class=k>Delta</div><div class=v>${m.delta || ""}</div>
    <div class=k>Operador</div><div class=v>${m.operador || "BLLUE_∆³"}</div>
  </div>
  <h3 style="margin:22px 0 8px">Pacote</h3>
  <pre>${json.replace(/[<>]/g, c => ({ "<":"&lt;", ">":"&gt;" }[c]))}</pre>
</div>
</body></html>
`
      }
    ];

    // ↓↓↓ AGREGA os 3 arquivos — NÃO remove nada ↓↓↓
    e.__kblx = {
      ...m,
      nó: "K07",
      delta: this.delta,
      via: "SAIDAS_3",
      arquivos,
      qtd_saidas: arquivos.length,
      unidade_manifestada: true
    };

    // Disponibiliza saídas para 78NP / Leitor (app GitHub)
    K07._publicaSaidas(arquivos, selo);
    K07._broadcast({ tipo: "KBLX:SAIDAS", qtd: 3, selo });
    return e;
  },

  _publicaSaidas(lista, selo) {
    try {
      localStorage.setItem("dual_saidas", JSON.stringify({
        ts: Date.now(), selo, arquivos: lista
      }));
    } catch (_) {}
  },

  _broadcast(msg) {
    try {
      if (window.parent && window.parent !== window) window.parent.postMessage({ ...msg, kblx: true }, "*");
      window.postMessage({ ...msg, kblx: true }, "*");
    } catch (_) {}
  }
};

if (typeof window !== "undefined") window.K07 = K07;
if (typeof module !== "undefined") module.exports = K07;
console.log("[K07] RHEA+GENUS carregados · 288 kblx · 3 saídas md/py/html · 78NP pronto");