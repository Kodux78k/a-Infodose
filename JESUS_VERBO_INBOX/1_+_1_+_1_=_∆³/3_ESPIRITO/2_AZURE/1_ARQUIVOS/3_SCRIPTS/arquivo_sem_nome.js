/* ============================================================
 *  HORUS‑DELTA‑CORE.BEST.JS
 *  Versão 1.0.0 · build 1134
 *  Lei: Integrar × Multiplicar ÷ Distribuir + Adaptar = ∞
 *  Uso:  HorusDeltaCore.load(window.kblx)
 *        → retorna { ok:true, code:"HORUS‑1134", kblx }
 * ============================================================ */
const HorusDeltaCore = (() => {
  "use strict";
  const BUILD = 1134;
  const FORMULA = "Integrar × Multiplicar ÷ Distribuir + Adaptar = ∞";
  const MD_INDEXADO = "KOBLLUX_TODAS_FUNCOES_EXPLICADAS.md";
  const ESTADOS = ["ball","preview","footer","full"];
  const ABC = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  const $ = (sel) => document.querySelector(sel);
  const emit = (nome, dados={}) =>
    window.dispatchEvent(new CustomEvent(`kblx:${nome}`, {detail:{...dados, coreBuild:BUILD, horus:true}}));

  const provar1134 = () => {
    const r = String(3*6*9*7).split("").reduce((a,b)=>a+Number(b),0);
    return { produto: 3*6*9*7, reducao:r, selo: r===9 && 3*6*9*7===BUILD };
  };

  const validarContrato = (kblx) => {
    const erros = [];
    if(!kblx || typeof kblx !== "object") erros.push("window.kblx não fornecido");
    if(kblx?.formula !== FORMULA) erros.push("Fórmula canônica divergente");
    if(!provar1134().selo) erros.push("Selo matemático 1134 inválido");
    if(!ABC.every(l => typeof kblx[l]==="function")) erros.push("Faltam funções A‑Z");
    if(!Array.isArray(kblx.arquetipos) || kblx.arquetipos.length!==12) erros.push("12 arquétipos ausentes");
    if(!document.documentElement.dataset.kblxIndexed) erros.push("HTML não indexado");
    return erros;
  };

  const indexarMD = async () => {
    // Simula carga do .md que já foi declarado como indexado no <html>
    const meta = {
      arquivo: MD_INDEXADO,
      indexadoEm: new Date().toISOString(),
      status: "carregado_em_memoria",
      funcoes: 26,
      arquetipos:12,
      selo: BUILD
    };
    emit("md:indexado", meta);
    return meta;
  };

  const ativarCamadas = (kblx) => {
    document.documentElement.dataset.horusBooted = "true";
    document.documentElement.dataset.horusBuild  = BUILD;

    // Liga com shell e ss5.js
    if(window.KoduxShell) window.KoduxShell.resetIdle();
    if(window.updateWidgetState) window.updateWidgetState("ball");

    // Expõe no global de forma selada
    window.HORUS = Object.freeze({
      core: HorusDeltaCore,
      kblx: Object.freeze(kblx),
      build: BUILD,
      formula: FORMULA,
      math: provar1134(),
      estados: ESTADOS,
      md: MD_INDEXADO
    });

    emit("camadas:ativas", {kblx});
    return true;
  };

  const selar = (kblx, md) => ({
    ok: true,
    code: "HORUS‑1134",
    mensagem: "KBLX integrado, validado, indexado e selado no núcleo HORUS DELTA",
    build: BUILD,
    formula: FORMULA,
    matematica: provar1134(),
    arquivoIndexado: md.arquivo,
    kblx,
    horas: new Date().toISOString()
  });

  /* ─── API PÚBLICA ────────────────────────────────────── */
  return {
    BUILD,
    FORMULA,
    provar1134,

    /**
     * horus‑delta‑core.best.js → load(window.kblx) → ✅
     */
    load: async function(kblx = window.kblx){
      emit("core:boot");
      const erros = validarContrato(kblx);

      if(erros.length){
        emit("core:falhou", {erros});
        console.error("%c🔴 HORUS DELTA BLOQUEADO","color:#ef4444;font-weight:bold", erros);
        return { ok:false, code:"HORUS‑400", erros };
      }

      const md = await indexarMD();
      ativarCamadas(kblx);
      const final = selar(kblx, md);

      console.log("\n%c══════════════════════════════════════","color:#22c55e");
      console.log("%c⚡ HORUS‑DELTA‑CORE.BEST.JS","color:#a855f7;font-size:16px;font-weight:bold");
      console.log("%c   load(window.kblx) → ✅ HORUS‑1134","color:#22c55e;font-weight:bold");
      console.log("%c   "+FORMULA,"color:#38bdf8");
      console.log("%c   MD indexado: "+MD_INDEXADO,"color:#eab308");
      console.log("%c══════════════════════════════════════\n","color:#22c55e");

      emit("core:pronto", final);
      return final;
    },

    status: () => ({
      build: BUILD,
      booted: document.documentElement.dataset.horusBooted === "true",
      selo1134: provar1134().selo,
      kblx: !!window.HORUS?.kblx
    })
  };
})();

/* ─── AUTOBOOT (opcional — comente para chamar manualmente) ─── */
// window.addEventListener("load", () => HorusDeltaCore.load());
