/* =========================================================
   KOBLLUX CSS ENGINE — dictionary.js
   Fonte única de verdade: mapeia classe utilitária -> regra CSS.
   Usado tanto pelo parser.js (geração dinâmica) quanto para
   gerar os arquivos estáticos em /core (bundle completo).
   ========================================================= */

window.KOBLLUX_CSS = window.KOBLLUX_CSS || {};

/* Breakpoints (mobile-first, min-width) */
window.KOBLLUX_CSS.breakpoints = {
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px"
};

/* Prefixos que viram pseudo-classes */
window.KOBLLUX_CSS.pseudoVariants = {
  hover: ":hover",
  focus: ":focus",
  active: ":active",
  disabled: ":disabled",
  "focus-visible": ":focus-visible",
  "first": ":first-child",
  "last": ":last-child"
};

/* Prefixo "dark:" -> escopo por classe .dark no ancestral (padrão comum) */
window.KOBLLUX_CSS.darkSelector = ".dark";

/* categoria -> { classe: corpo-css } */
window.KOBLLUX_CSS.map = {

  /* ===== DISPLAY ===== */
  display: {
    "flex": "display:flex;",
    "inline-flex": "display:inline-flex;",
    "block": "display:block;",
    "inline-block": "display:inline-block;",
    "inline": "display:inline;",
    "hidden": "display:none;",
    "grid": "display:grid;",
    "inline-grid": "display:inline-grid;",
    "table": "display:table;",
    "contents": "display:contents;"
  },

  /* ===== FLEX ===== */
  flex: {
    "flex-col": "flex-direction:column;",
    "flex-row": "flex-direction:row;",
    "flex-col-reverse": "flex-direction:column-reverse;",
    "flex-row-reverse": "flex-direction:row-reverse;",
    "flex-wrap": "flex-wrap:wrap;",
    "flex-nowrap": "flex-wrap:nowrap;",
    "flex-1": "flex:1 1 0%;",
    "flex-auto": "flex:1 1 auto;",
    "flex-initial": "flex:0 1 auto;",
    "flex-none": "flex:none;",

    "items-center": "align-items:center;",
    "items-start": "align-items:flex-start;",
    "items-end": "align-items:flex-end;",
    "items-stretch": "align-items:stretch;",
    "items-baseline": "align-items:baseline;",

    "justify-center": "justify-content:center;",
    "justify-between": "justify-content:space-between;",
    "justify-around": "justify-content:space-around;",
    "justify-evenly": "justify-content:space-evenly;",
    "justify-start": "justify-content:flex-start;",
    "justify-end": "justify-content:flex-end;",

    "self-center": "align-self:center;",
    "self-start": "align-self:flex-start;",
    "self-end": "align-self:flex-end;",
    "self-stretch": "align-self:stretch;",

    "gap-0": "gap:0;",
    "gap-1": "gap:.25rem;",
    "gap-2": "gap:.5rem;",
    "gap-3": "gap:.75rem;",
    "gap-4": "gap:1rem;",
    "gap-5": "gap:1.25rem;",
    "gap-6": "gap:1.5rem;",
    "gap-8": "gap:2rem;",
    "gap-10": "gap:2.5rem;",
    "gap-12": "gap:3rem;"
  },

  /* ===== GRID ===== */
  grid: {
    "grid-cols-1": "grid-template-columns:repeat(1,minmax(0,1fr));",
    "grid-cols-2": "grid-template-columns:repeat(2,minmax(0,1fr));",
    "grid-cols-3": "grid-template-columns:repeat(3,minmax(0,1fr));",
    "grid-cols-4": "grid-template-columns:repeat(4,minmax(0,1fr));",
    "grid-cols-5": "grid-template-columns:repeat(5,minmax(0,1fr));",
    "grid-cols-6": "grid-template-columns:repeat(6,minmax(0,1fr));",
    "grid-cols-12": "grid-template-columns:repeat(12,minmax(0,1fr));",
    "col-span-1": "grid-column:span 1 / span 1;",
    "col-span-2": "grid-column:span 2 / span 2;",
    "col-span-3": "grid-column:span 3 / span 3;",
    "col-span-full": "grid-column:1 / -1;",
    "row-span-1": "grid-row:span 1 / span 1;",
    "row-span-2": "grid-row:span 2 / span 2;"
  },

  /* ===== SIZE (largura/altura) ===== */
  size: {
    "w-full": "width:100%;",
    "w-screen": "width:100vw;",
    "w-auto": "width:auto;",
    "w-1/2": "width:50%;",
    "w-1/3": "width:33.333333%;",
    "w-2/3": "width:66.666667%;",
    "w-1/4": "width:25%;",
    "w-3/4": "width:75%;",
    "h-full": "height:100%;",
    "h-screen": "height:100vh;",
    "h-auto": "height:auto;",

    "min-w-0": "min-width:0;",
    "min-h-screen": "min-height:100vh;",

    "max-w-xs": "max-width:20rem;",
    "max-w-sm": "max-width:24rem;",
    "max-w-md": "max-width:28rem;",
    "max-w-lg": "max-width:32rem;",
    "max-w-xl": "max-width:36rem;",
    "max-w-2xl": "max-width:42rem;",
    "max-w-full": "max-width:100%;"
  },

  /* ===== MARGIN / PADDING ===== */
  spacing: {
    "m-0": "margin:0;",
    "m-1": "margin:.25rem;",
    "m-2": "margin:.5rem;",
    "m-4": "margin:1rem;",
    "m-6": "margin:1.5rem;",
    "m-8": "margin:2rem;",
    "mx-auto": "margin-left:auto;margin-right:auto;",
    "mx-0": "margin-left:0;margin-right:0;",
    "my-0": "margin-top:0;margin-bottom:0;",

    "mt-0": "margin-top:0;",
    "mt-1": "margin-top:.25rem;",
    "mt-2": "margin-top:.5rem;",
    "mt-4": "margin-top:1rem;",
    "mt-6": "margin-top:1.5rem;",
    "mt-8": "margin-top:2rem;",

    "mb-0": "margin-bottom:0;",
    "mb-1": "margin-bottom:.25rem;",
    "mb-2": "margin-bottom:.5rem;",
    "mb-4": "margin-bottom:1rem;",
    "mb-6": "margin-bottom:1.5rem;",
    "mb-8": "margin-bottom:2rem;",

    "ml-2": "margin-left:.5rem;",
    "ml-4": "margin-left:1rem;",
    "mr-2": "margin-right:.5rem;",
    "mr-4": "margin-right:1rem;",

    "p-0": "padding:0;",
    "p-1": "padding:.25rem;",
    "p-2": "padding:.5rem;",
    "p-3": "padding:.75rem;",
    "p-4": "padding:1rem;",
    "p-6": "padding:1.5rem;",
    "p-8": "padding:2rem;",

    "px-2": "padding-left:.5rem;padding-right:.5rem;",
    "px-4": "padding-left:1rem;padding-right:1rem;",
    "px-6": "padding-left:1.5rem;padding-right:1.5rem;",
    "px-8": "padding-left:2rem;padding-right:2rem;",

    "py-1": "padding-top:.25rem;padding-bottom:.25rem;",
    "py-2": "padding-top:.5rem;padding-bottom:.5rem;",
    "py-3": "padding-top:.75rem;padding-bottom:.75rem;",
    "py-4": "padding-top:1rem;padding-bottom:1rem;",
    "py-6": "padding-top:1.5rem;padding-bottom:1.5rem;"
  },

  /* ===== BORDAS ===== */
  borders: {
    "border": "border:1px solid #e5e7eb;",
    "border-0": "border-width:0;",
    "border-2": "border-width:2px;",
    "border-t": "border-top:1px solid #e5e7eb;",
    "border-b": "border-bottom:1px solid #e5e7eb;",

    "rounded": "border-radius:.25rem;",
    "rounded-sm": "border-radius:.125rem;",
    "rounded-md": "border-radius:.375rem;",
    "rounded-lg": "border-radius:.5rem;",
    "rounded-xl": "border-radius:.75rem;",
    "rounded-2xl": "border-radius:1rem;",
    "rounded-full": "border-radius:9999px;",

    "shadow": "box-shadow:0 2px 8px rgba(0,0,0,.2);",
    "shadow-sm": "box-shadow:0 1px 2px rgba(0,0,0,.1);",
    "shadow-lg": "box-shadow:0 10px 25px rgba(0,0,0,.25);",
    "shadow-none": "box-shadow:none;"
  },

  /* ===== TIPOGRAFIA ===== */
  typography: {
    "text-xs": "font-size:.75rem;",
    "text-sm": "font-size:.875rem;",
    "text-base": "font-size:1rem;",
    "text-lg": "font-size:1.125rem;",
    "text-xl": "font-size:1.25rem;",
    "text-2xl": "font-size:1.5rem;",
    "text-3xl": "font-size:1.875rem;",
    "text-4xl": "font-size:2.25rem;",

    "text-center": "text-align:center;",
    "text-left": "text-align:left;",
    "text-right": "text-align:right;",
    "text-justify": "text-align:justify;",

    "font-thin": "font-weight:100;",
    "font-light": "font-weight:300;",
    "font-normal": "font-weight:400;",
    "font-medium": "font-weight:500;",
    "font-semibold": "font-weight:600;",
    "font-bold": "font-weight:700;",
    "font-extrabold": "font-weight:800;",

    "italic": "font-style:italic;",
    "uppercase": "text-transform:uppercase;",
    "lowercase": "text-transform:lowercase;",
    "capitalize": "text-transform:capitalize;",
    "underline": "text-decoration:underline;",
    "line-through": "text-decoration:line-through;",
    "no-underline": "text-decoration:none;",

    "leading-none": "line-height:1;",
    "leading-tight": "line-height:1.25;",
    "leading-normal": "line-height:1.5;",
    "leading-relaxed": "line-height:1.625;",

    "tracking-tight": "letter-spacing:-.025em;",
    "tracking-wide": "letter-spacing:.025em;",

    "truncate": "overflow:hidden;text-overflow:ellipsis;white-space:nowrap;"
  },

  /* ===== CORES ===== */
  colors: {
    "text-white": "color:#fff;",
    "text-black": "color:#000;",
    "text-gray-400": "color:#9ca3af;",
    "text-gray-500": "color:#6b7280;",
    "text-gray-700": "color:#374151;",
    "text-red-500": "color:#ef4444;",
    "text-green-500": "color:#22c55e;",
    "text-blue-500": "color:#3b82f6;",

    "bg-white": "background:#fff;",
    "bg-black": "background:#000;",
    "bg-gray-100": "background:#f3f4f6;",
    "bg-gray-800": "background:#1f2937;",
    "bg-red-500": "background:#ef4444;",
    "bg-green-500": "background:#22c55e;",
    "bg-blue-500": "background:#3b82f6;",
    "bg-transparent": "background:transparent;"
  },

  /* ===== POSICIONAMENTO ===== */
  position: {
    "relative": "position:relative;",
    "absolute": "position:absolute;",
    "fixed": "position:fixed;",
    "sticky": "position:sticky;",
    "inset-0": "top:0;right:0;bottom:0;left:0;",
    "top-0": "top:0;",
    "bottom-0": "bottom:0;",
    "left-0": "left:0;",
    "right-0": "right:0;",
    "z-0": "z-index:0;",
    "z-10": "z-index:10;",
    "z-50": "z-index:50;",

    "overflow-hidden": "overflow:hidden;",
    "overflow-auto": "overflow:auto;",
    "overflow-y-auto": "overflow-y:auto;",

    "cursor-pointer": "cursor:pointer;",
    "select-none": "user-select:none;",
    "pointer-events-none": "pointer-events:none;"
  },

  /* ===== TRANSIÇÕES ===== */
  transitions: {
    "transition": "transition:all .2s ease;",
    "transition-colors": "transition:color .2s ease,background-color .2s ease,border-color .2s ease;",
    "duration-150": "transition-duration:150ms;",
    "duration-300": "transition-duration:300ms;",
    "ease-in-out": "transition-timing-function:ease-in-out;"
  }
};
