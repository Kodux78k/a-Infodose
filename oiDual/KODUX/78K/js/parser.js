/* =========================================================
   KOBLLUX CSS ENGINE — parser.js
   Recebe a lista de classes encontradas pelo scanner.js e
   consulta o dictionary.js para descobrir a regra CSS de cada
   uma, já resolvendo variantes (hover:, focus:, dark:, md:...).
   ========================================================= */

window.KOBLLUX_CSS = window.KOBLLUX_CSS || {};

/**
 * flattenMap() -> { classe: corpoCSS }
 * Achata o dicionário (que é organizado por categoria) em um
 * único objeto plano para lookup O(1).
 */
window.KOBLLUX_CSS.flattenMap = function () {
  const flat = {};
  const categories = window.KOBLLUX_CSS.map;
  Object.keys(categories).forEach((cat) => {
    Object.assign(flat, categories[cat]);
  });
  return flat;
};

/**
 * parseClasses(classList) -> Array<{token, selector, body, mediaQuery, found}>
 * classList: string[] vindo do scanner
 *
 * Trata prefixos de variante separados por ":" — ex:
 *   "md:flex"        -> media query min-width
 *   "hover:bg-black"  -> pseudo-classe :hover
 *   "dark:text-white" -> escopo ".dark &"
 * Suporta até 1 prefixo por classe (o caso mais comum).
 */
window.KOBLLUX_CSS.parseClasses = function (classList) {
  const flat = window.KOBLLUX_CSS.flattenMap();
  const breakpoints = window.KOBLLUX_CSS.breakpoints;
  const pseudos = window.KOBLLUX_CSS.pseudoVariants;
  const darkSelector = window.KOBLLUX_CSS.darkSelector;

  return classList.map((token) => {
    let base = token;
    let prefix = null;

    const parts = token.split(":");
    if (parts.length === 2) {
      prefix = parts[0];
      base = parts[1];
    }

    const body = flat[base] || null;
    const escapedToken = token.replace(/[:/.]/g, (m) => "\\" + m);

    let selector = `.${escapedToken}`;
    let mediaQuery = null;

    if (prefix && breakpoints[prefix]) {
      mediaQuery = `(min-width:${breakpoints[prefix]})`;
    } else if (prefix && pseudos[prefix]) {
      selector = `.${escapedToken}${pseudos[prefix]}`;
    } else if (prefix === "dark") {
      selector = `${darkSelector} .${escapedToken}`;
    }

    return {
      token,
      selector,
      body,
      mediaQuery,
      found: !!body
    };
  });
};
