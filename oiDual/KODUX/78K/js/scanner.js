/* =========================================================
   KOBLLUX CSS ENGINE — scanner.js
   Percorre um HTML (string ou DOM real) e coleta todas as
   classes usadas em atributos class="".
   ========================================================= */

window.KOBLLUX_CSS = window.KOBLLUX_CSS || {};

/**
 * scanHTML(html) -> string[]
 * Recebe uma string HTML e retorna um array de classes únicas,
 * já ordenado alfabeticamente.
 */
window.KOBLLUX_CSS.scanHTML = function (html) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  return window.KOBLLUX_CSS.scanDOM(doc.body);
};

/**
 * scanDOM(rootNode) -> string[]
 * Percorre um nó DOM real (útil para escanear a própria página,
 * ex: document.body) e coleta as classes usadas.
 */
window.KOBLLUX_CSS.scanDOM = function (rootNode) {
  const found = new Set();
  const all = rootNode.querySelectorAll("[class]");

  all.forEach((el) => {
    el.classList.forEach((cls) => {
      if (cls.trim()) found.add(cls.trim());
    });
  });

  // também captura o próprio rootNode, se tiver classe
  if (rootNode.classList) {
    rootNode.classList.forEach((cls) => found.add(cls.trim()));
  }

  return Array.from(found).sort();
};
