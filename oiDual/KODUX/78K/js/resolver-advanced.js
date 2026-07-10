/* =========================================================
   KOBLLUX CSS ENGINE — resolver-advanced.js
   Camada extra sobre o parser.js: resolve algoritmicamente
   o que não está no dictionary.js estático:
     - escala numérica (w-3, p-6, gap-8, mt-12, z-20...)
     - frações (w-1/2, w-2/3...)
     - valores arbitrários entre colchetes (w-[90%], bg-[#050505])
     - opacidade em cor (bg-black/80, border-white/10, text-blue-500/40)
     - variáveis CSS usadas como cor (bg-[var(--primary)])
     - group-hover: / group-focus:
   Isso cobre a maior parte do "cauda longa" do Tailwind sem
   precisar listar milhares de classes estáticas.
   ========================================================= */

window.KOBLLUX_CSS = window.KOBLLUX_CSS || {};

const SPACING_SCALE = {
  0: "0", px: "1px", "0.5": ".125rem", 1: ".25rem", "1.5": ".375rem",
  2: ".5rem", "2.5": ".625rem", 3: ".75rem", "3.5": ".875rem", 4: "1rem",
  5: "1.25rem", 6: "1.5rem", 7: "1.75rem", 8: "2rem", 9: "2.25rem",
  10: "2.5rem", 11: "2.75rem", 12: "3rem", 14: "3.5rem", 16: "4rem",
  20: "5rem", 24: "6rem", 28: "7rem", 32: "8rem", 36: "9rem", 40: "10rem",
  44: "11rem", 48: "12rem", 52: "13rem", 56: "14rem", 60: "15rem",
  64: "16rem", 72: "18rem", 80: "20rem", 96: "24rem"
};

const SPACING_PREFIXES = {
  "w": ["width"], "h": ["height"], "min-w": ["min-width"], "min-h": ["min-height"],
  "max-w": ["max-width"], "max-h": ["max-height"],
  "p": ["padding"], "px": ["padding-left", "padding-right"], "py": ["padding-top", "padding-bottom"],
  "pt": ["padding-top"], "pb": ["padding-bottom"], "pl": ["padding-left"], "pr": ["padding-right"],
  "m": ["margin"], "mx": ["margin-left", "margin-right"], "my": ["margin-top", "margin-bottom"],
  "mt": ["margin-top"], "mb": ["margin-bottom"], "ml": ["margin-left"], "mr": ["margin-right"],
  "gap": ["gap"], "gap-x": ["column-gap"], "gap-y": ["row-gap"],
  "top": ["top"], "right": ["right"], "bottom": ["bottom"], "left": ["left"], "inset": ["top", "right", "bottom", "left"],
  "z": ["z-index"], "text": ["font-size"], "tracking": ["letter-spacing"]
};

// Paleta reduzida do Tailwind default — cobre os tons mais comuns
const PALETTE = {
  black: "#000000", white: "#ffffff", transparent: "transparent",
  "gray-100": "#f3f4f6", "gray-400": "#9ca3af", "gray-500": "#6b7280",
  "gray-700": "#374151", "gray-800": "#1f2937", "gray-900": "#111827",
  "red-500": "#ef4444", "red-600": "#dc2626",
  "blue-400": "#60a5fa", "blue-500": "#3b82f6", "blue-600": "#2563eb",
  "green-500": "#22c55e", "yellow-500": "#eab308",
  "purple-500": "#a855f7", "pink-500": "#ec4899", "indigo-500": "#6366f1"
};

function hexToRgb(hex) {
  hex = hex.replace("#", "");
  if (hex.length === 3) hex = hex.split("").map((c) => c + c).join("");
  const num = parseInt(hex, 16);
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

/**
 * resolveAdvanced(base) -> corpo CSS (string) ou null
 * base = a classe já sem o prefixo de variante (hover:, md: etc.)
 */
window.KOBLLUX_CSS.resolveAdvanced = function (base) {

  // ---- 1. valor arbitrário entre colchetes: prop-[valor] ----
  const arbMatch = base.match(/^([a-z-]+)-\[(.+)\]$/i);
  if (arbMatch) {
    const prefix = arbMatch[1];
    let value = arbMatch[2].replace(/_/g, " ");

    const propsForPrefix = {
      "w": "width", "h": "height", "min-w": "min-width", "max-w": "max-width",
      "z": "z-index", "top": "top", "left": "left", "right": "right", "bottom": "bottom",
      "bg": "background", "text": "color", "border": "border-color",
      "shadow": "box-shadow", "tracking": "letter-spacing", "ease": "transition-timing-function"
    };
    const prop = propsForPrefix[prefix];
    if (prop) return `${prop}:${value};`;
  }

  // ---- 2. opacidade em cor: bg-black/80, border-white/10, text-blue-500/40 ----
  const opMatch = base.match(/^(bg|border|text)-([a-z]+(?:-[0-9]{2,3})?)\/(\d{1,3})$/i);
  if (opMatch) {
    const [, kind, colorName, alphaStr] = opMatch;
    const hex = PALETTE[colorName];
    if (hex && hex !== "transparent") {
      const [r, g, b] = hexToRgb(hex);
      const alpha = Math.min(100, parseInt(alphaStr, 10)) / 100;
      const prop = kind === "bg" ? "background" : kind === "border" ? "border-color" : "color";
      return `${prop}:rgba(${r},${g},${b},${alpha});`;
    }
  }

  // ---- 3. cor via variável CSS: bg-[var(--x)], text-[var(--x)] já cai no caso 1 (arbMatch) ----

  // ---- 4. fração: w-1/2, w-2/3, h-1/4 ----
  const fracMatch = base.match(/^(w|h)-(\d+)\/(\d+)$/);
  if (fracMatch) {
    const [, dim, num, den] = fracMatch;
    const pct = (parseInt(num, 10) / parseInt(den, 10)) * 100;
    const prop = dim === "w" ? "width" : "height";
    return `${prop}:${pct.toFixed(4).replace(/0+$/, "").replace(/\.$/, "")}%;`;
  }

  // ---- 5. escala numérica: w-3, p-6, gap-8, mt-12, z-20, text-10 (raro) ----
  const scaleMatch = base.match(/^([a-z-]+)-(-?[\d.]+|px)$/);
  if (scaleMatch) {
    const [, prefix, num] = scaleMatch;
    const props = SPACING_PREFIXES[prefix];
    if (props) {
      let val;
      if (prefix === "z") {
        val = num; // z-index não usa rem
      } else {
        val = SPACING_SCALE[num];
        if (val === undefined) return null;
      }
      return props.map((p) => `${p}:${val};`).join("");
    }
  }

  return null;
};
