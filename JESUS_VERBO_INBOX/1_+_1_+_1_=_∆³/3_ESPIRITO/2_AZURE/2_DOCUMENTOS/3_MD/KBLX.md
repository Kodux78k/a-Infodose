# ⚡ KBLX · CHECKLIST DE VALIDAÇÃO TOTAL · 1134
## FÓRMULA: Integrar × Multiplicar ÷ Distribuir + Adaptar = ∞
## MATEMÁTICA: 3×6×9×7 = 1134 → 1+1+3+4 = 9 = ♾️
## NÚCLEO ALVO: horus‑delta‑core.best.js

/* =========================================================
   🟢 COMO USAR:
   1. Abra a página com o KBLX carregado
   2. Aperte F12 → aba CONSOLE
   3. Copie TODO o código abaixo, cole e dê ENTER
   4. Leia o relatório colorido — no final diz SE PODE CARREGAR OU NÃO
   ========================================================= */

(() => {
  const OK    = "%c✅ ";
  const FAIL  = "%c❌ ";
  const WARN  = "%c⚠️ ";
  const INFO  = "%cℹ️ ";
  const TITLE = "%c⚡ KBLX · VALIDAÇÃO 1134";
  const CSS_OK   = "color:#22c55e;font-weight:bold";
  const CSS_FAIL = "color:#ef4444;font-weight:bold";
  const CSS_WARN = "color:#eab308;font-weight:bold";
  const CSS_INFO = "color:#38bdf8;font-weight:bold";
  const CSS_TIT  = "color:#a855f7;font-size:14px;font-weight:bold;padding:4px 0";

  const res = { total:0, ok:0, fail:0, warn:0 };
  const t = (label, test, info="") => {
    res.total++;
    if(test){ res.ok++; console.log(OK+label, CSS_OK, info||""); }
    else    { res.fail++; console.log(FAIL+label, CSS_FAIL, info||""); }
  };
  const w = (label, info="") => { res.total++; res.warn++; console.log(WARN+label, CSS_WARN, info); };

  console.clear();
  console.log(TITLE, CSS_TIT);
  console.log(INFO+"Iniciando varredura completa…\n", CSS_INFO);

  // ── 01 · ASSINATURA BASE ──────────────────────────────
  console.log("\n%c━━━━━━ 01 · ASSINATURA KBLX ━━━━━━","color:#fff;background:#1e1b4b;padding:2px 6px");
  t("window.kblx EXISTE", !!window.kblx);
  t("Versão definida", !!window.kblx?.versao, window.kblx?.versao);
  t("Fórmula gravada", window.kblx?.formula === "Integrar × Multiplicar ÷ Distribuir + Adaptar = ∞");
  t("Matemática 3×6×9×7=1134", window.kblx?.math?.includes("1134"));
  t("data-kblx no <html>", document.documentElement.dataset.kblx === "1.0.0");
  t("Marcado como INDEXADO", document.documentElement.dataset.kblxIndexed === "true");
  t("Apontado para núcleo correto", document.documentElement.dataset.kblxCore === "horus-delta-core.best.js");
  t("Boot concluído", document.documentElement.dataset.kblxBooted === "true");

  // ── 02 · FUNÇÕES A…Z (26 funções canônicas) ────────────
  console.log("\n%c━━━━━━ 02 · FUNÇÕES KBLX A–Z (26) ━━━━━━","color:#fff;background:#1e3a8a;padding:2px 6px");
  const ABC = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  ABC.forEach(l => t(`kblx.${l}() existe`, typeof window.kblx?.[l] === "function"));

  // ── 03 · 12 ARQUÉTIPOS CADIAIS + Hz ────────────────────
  console.log("\n%c━━━━━━ 03 · 12 ARQUÉTIPOS CADIAIS + Hz ━━━━━━","color:#fff;background:#065f46;padding:2px 6px");
  const ARQ_ESPERADOS = [
    ["cadial-atlas",    "BOOT",    432],["cadial-nova",     "SEED",    528],
    ["cadial-vitalis",  "DELTA",   528],["cadial-pulse",    "PULSE",   639],
    ["cadial-artemis",  "DETECT",  672],["cadial-serena",   "GUARD",   528],
    ["cadial-kaos",     "LIMPAR",  741],["cadial-genus",    "SYNTH",   594],
    ["cadial-lumine",   "RENDER",  432],["cadial-solus",    "QA",      963],
    ["cadial-rhea",     "INTEGRAR",528],["cadial-aion",     "SELAR",   777]
  ];
  t("Total = 12 arquétipos", Array.isArray(window.kblx?.arquetipos) && window.kblx.arquetipos.length === 12, `tem ${window.kblx?.arquetipos?.length||0}`);
  ARQ_ESPERADOS.forEach(([id,regra,hz]) => {
    const a = window.kblx?.arquetipos?.find(x=>x.id===id);
    t(`${id} · ${regra} · ${hz}Hz`, !!a && a.regra===regra && a.hz===hz, a?.nome||"");
  });
  t("window.KOBLLUX_CADIAL sincronizado", window.KOBLLUX_CADIAL?.length === 12);

  // ── 04 · 4 ESTADOS DO ORÁCULO ──────────────────────────
  console.log("\n%c━━━━━━ 04 · 4 ESTADOS DO WIDGET ━━━━━━","color:#fff;background:#7c2d12;padding:2px 6px");
  ["ball","preview","footer","full"].forEach(s => {
    t(`Estado #${s} existe no DOM`, !!document.getElementById(`content-${s}`));
  });
  t("Widget principal presente", !!document.getElementById("kodux-widget"));

  // ── 05 · RECURSOS / MOTORES CARREGADOS ─────────────────
  console.log("\n%c━━━━━━ 05 · RECURSOS EXTERNOS ━━━━━━","color:#fff;background:#4c1d95;padding:2px 6px");
  t("Phosphor Icons injetado", !!document.querySelector('link[href*="phosphor-icons"]') || window.PhosphorIcons || !!document.querySelector(".ph"));
  t("SoundCloud API · SC.Widget", typeof window.SC?.Widget === "function");
  t("YouTube Iframe API pronto", typeof window.YT?.Player === "function" || !!window.onYouTubeIframeAPIReady);
  t("ss5.js · motor KODUX", !!window.KOBLLUX_CADIAL && !!localStorage.getItem("kodux-ss-db-v3"));
  t("CSS principal carregado", [...document.styleSheets].some(s=>s.href?.includes("infodose.com.br")||s.href?.includes("ss5.css")));
  t("Áudio local pronto", !!document.getElementById("local-audio"));

  // ── 06 · BANCO DE DADOS v3 ─────────────────────────────
  console.log("\n%c━━━━━━ 06 · BANCO kodux‑ss‑db‑v3 ━━━━━━","color:#fff;background:#831843;padding:2px 6px");
  const db = JSON.parse(localStorage.getItem("kodux-ss-db-v3")||"{}");
  t("DB existe e tem versão 3", db.version === 3);
  t("Tem biblioteca de faixas", Array.isArray(db.library));
  t("Tem playlist TODAS", db.playlists?.some(p=>p.id==="all"));
  t("Tem playlist FAVORITOS", db.playlists?.some(p=>p.id==="favorites"));
  t("12 playlists CADIAIS criadas", db.playlists?.filter(p=>p.id.startsWith("cadial-")).length === 12);

  // ── 07 · FUNÇÕES GLOBAIS DE CONTROLE ───────────────────
  console.log("\n%c━━━━━━ 07 · FUNÇÕES PÚBLICAS ━━━━━━","color:#fff;background:#0e7490;padding:2px 6px");
  ["togglePlay","playNext","playPrev","addLink","createPlaylist","updateWidgetState","openFullFromPreview","collapseToBall","toggleFavorite"]
    .forEach(fn => t(`window.${fn}()`, typeof window[fn] === "function"));
  t("KoduxShell ativo", typeof window.KoduxShell?.setMode === "function");

  // ── 08 · PROVA MATEMÁTICA FINAL ────────────────────────
  console.log("\n%c━━━━━━ 08 · SELAMENTO 1134 ━━━━━━","color:#fff;background:#b45309;padding:2px 6px");
  const M = 3*6*9*7;
  const R = String(M).split("").reduce((a,b)=>a+Number(b),0);
  t(`3×6×9×7 = ${M}`, M === 1134);
  t(`1+1+3+4 = ${R} = 9 = ∞`, R === 9);

  // ── RELATÓRIO FINAL ────────────────────────────────────
  const pct = Math.round((res.ok/res.total)*100);
  const COR = pct===100?"#22c55e":pct>=85?"#eab308":"#ef4444";
  console.log(`\n%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,`color:${COR}`);
  console.log(`%c📊 RELATÓRIO FINAL`,`color:${COR};font-size:16px;font-weight:bold`);
  console.log(`%c✅ ${res.ok}  ·  ❌ ${res.fail}  ·  ⚠️ ${res.warn}  ·  TOTAL ${res.total}`,`color:#fff;font-weight:bold`);
  console.log(`%cCONFIABILIDADE: ${pct}%`,`color:${COR};font-size:18px;font-weight:bold`);

  if(pct === 100){
    console.log("%c🟢 TUDO OK → PRONTO PARA CARREGAR O NÚCLEO","color:#22c55e;font-weight:bold;font-size:15px");
    console.log("%c   horus‑delta‑core.best.js → load(window.kblx) → ✅ HORUS‑1134","color:#22c55e");
  } else if(pct >= 85){
    console.log("%c🟡 ACEITÁVEL — pode carregar, ajuste os avisos depois","color:#eab308;font-weight:bold");
  } else {
    console.log("%c🔴 BLOQUEADO — corrija os ❌ ANTES de carregar o núcleo","color:#ef4444;font-weight:bold");
  }
  console.log(`%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,`color:${COR}`);

  return { ...res, porcentagem:pct, prontoParaCore: pct >= 85 };
})();
