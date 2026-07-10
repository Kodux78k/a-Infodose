/* =========================================================
   KOBLLUX CSS ENGINE — exporter.js
   Cria o download do arquivo CSS gerado, sem dependências.
   ========================================================= */

window.KOBLLUX_CSS = window.KOBLLUX_CSS || {};

/**
 * downloadCSS(cssText, filename)
 * Dispara o download de um arquivo .css no navegador.
 */
window.KOBLLUX_CSS.downloadCSS = function (cssText, filename) {
  filename = filename || "mini-tailwind.css";
  const blob = new Blob([cssText], { type: "text/css" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  URL.revokeObjectURL(url);
};

/**
 * runFullPipeline(html, options) -> { css, stats }
 * Atalho que roda scanner -> parser -> generator de uma vez.
 */
window.KOBLLUX_CSS.runFullPipeline = function (html, options) {
  const classes = window.KOBLLUX_CSS.scanHTML(html);
  const parsed = window.KOBLLUX_CSS.parseClasses(classes);
  return window.KOBLLUX_CSS.generateCSS(parsed, options);
};
