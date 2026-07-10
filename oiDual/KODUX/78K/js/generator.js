/* =========================================================
   KOBLLUX CSS ENGINE — generator.js
   Recebe as regras já resolvidas pelo parser.js e monta o
   texto final do mini-tailwind.css, agrupando media queries
   no final do arquivo.
   ========================================================= */

window.KOBLLUX_CSS = window.KOBLLUX_CSS || {};

/**
 * generateCSS(parsedRules, options) -> { css, stats }
 * parsedRules: saída de parseClasses()
 * options.minify: boolean (default false)
 */
window.KOBLLUX_CSS.generateCSS = function (parsedRules, options) {
  options = options || {};
  const minify = !!options.minify;

  const plainRules = [];
  const mediaGroups = {}; // mediaQuery -> [regra css]
  const notFound = [];

  parsedRules.forEach((rule) => {
    if (!rule.found) {
      notFound.push(rule.token);
      return;
    }
    const line = `${rule.selector}{${rule.body}}`;
    if (rule.mediaQuery) {
      if (!mediaGroups[rule.mediaQuery]) mediaGroups[rule.mediaQuery] = [];
      mediaGroups[rule.mediaQuery].push(line);
    } else {
      plainRules.push(line);
    }
  });

  let out = "";
  out += "/* ============================================\n";
  out += "   KOBLLUX mini-tailwind.css — gerado automaticamente\n";
  out += "   Apenas as classes realmente usadas no HTML\n";
  out += "   ============================================ */\n\n";

  out += plainRules.join(minify ? "" : "\n") + "\n";

  Object.keys(mediaGroups).forEach((mq) => {
    out += `\n@media ${mq}{\n`;
    out += mediaGroups[mq].map((l) => "  " + l).join("\n");
    out += "\n}\n";
  });

  const stats = {
    totalClasses: parsedRules.length,
    resolved: parsedRules.length - notFound.length,
    notFound,
    bytes: new Blob([out]).size
  };

  return { css: out, stats };
};
