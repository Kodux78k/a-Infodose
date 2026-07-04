window.ARCHETYPES = window.ARCHETYPES || [
  "atlas","nova","vitalis","pulse","kaos","kodux","lumine","aion",
  "kobllux","artemis","serena","genus","solus","rhea","uno","dual",
  "trinity","infodose","horus","bllue"
];
window.KOB_USER_NAME = localStorage.getItem("di_userName") || "";

/*     ════════════════════════════════════════════════════════
     BODY THEME SYNC (JSI_16) — novo, adicionado no final
     de propósito, depois de TODOS os módulos externos
     (o0.js, koblluxv30.js, di_corei.js, di_mood.js, ArchLoader
     etc.), pra sempre rodar por último e nunca ser sobrescrito.

     O que faz:
     1. Copia data-arch do <html> pro <body> — <html> continua
        sendo a fonte da verdade pro CSS (html[data-arch="..."]),
        o <body> só reflete o mesmo valor, pra qualquer regra
        body[data-arch] ou script que espere o atributo lá também.
     2. Copia TODAS as CSS custom properties inline do <html>
        (--kob-voice-primary, --kob-voice-secondary, --orb-*, etc.
        — primária, secundária, qualquer uma que algum módulo
        setar via .style.setProperty) pro <body>. Não precisa
        saber os nomes exatos: pega tudo que comece com "--".
     3. Roda 1x no boot (cobre o estado inicial) e depois fica
        de olho via MutationObserver — qualquer módulo que trocar
        data-arch ou o style do <html> atualiza o body sozinho,
        sem precisar chamar nada manualmente.
════════════════════════════════════════════════════════ -->
*/

(function () {
  function syncBodyTheme() {
    const html = document.documentElement;
    const body = document.body;
    if (!body) return;

    // 1) arquétipo ativo espelhado no body
    body.dataset.arch = html.dataset.arch || "";

    // 2) todas as CSS custom properties (--kob-*, --orb-*, ...)
    //    definidas inline no <html> pro <body>
    const inline = html.style;
    for (let i = 0; i < inline.length; i++) {
      const prop = inline[i];
      if (prop.indexOf("--") === 0) {
        body.style.setProperty(prop, inline.getPropertyValue(prop));
      }
    }
  }

  // estado inicial (cobre data-arch já presente ao carregar a página)
  syncBodyTheme();

  // qualquer módulo que troque data-arch ou as CSS vars no <html>
  // atualiza o body automaticamente
  new MutationObserver(syncBodyTheme).observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-arch", "style"]
  });

  console.log("[BodyThemeSync] ativo — body espelha data-arch + cores do html.");
})();