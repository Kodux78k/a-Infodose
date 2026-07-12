/* =========================================================
   KODUX ORB ENGINE · 78K
   Módulo standalone (ES Module), extraído do
   KODUX SVG STUDIO + ORB, pra ser importado em
   qualquer página sem copiar/colar código.

   - SVG inline SEM xmlns (mais leve, feito pro DOM)
   - xmlns só é anexado quando o SVG vai virar
     arquivo standalone (download/export)
   - Symbol Bar dinâmico pra montar painéis
   - KoduxMemory: pool com limite, evita vazamento
     de memória quando muitos orbs/ícones são
     criados e destruídos na tela
   ========================================================= */

/**
 * Injeta o CSS do ORB uma única vez no <head>.
 * Idempotente: chamadas repetidas não duplicam o <style>.
 */
function injectOrbStyles() {
  if (document.getElementById('kodux-orb-styles')) return;

  const style = document.createElement('style');
  style.id = 'kodux-orb-styles';
  style.textContent = `
    @keyframes orbBreathe {
      0%, 100% { transform: translateZ(0) scale(1); opacity:.82; filter: brightness(1); }
      50% { transform: translateZ(0) scale(1.08); opacity: 1; filter: brightness(1.22); }
    }
    @keyframes orbSpin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    @keyframes orbPulse {
      0% { transform: scale(.78); opacity:.55; }
      100% { transform: scale(1.28); opacity: 0; }
    }
    @keyframes orbFloat {
      0%, 100% { transform: translateY(0px) rotateX(0deg) rotateY(0deg); }
      50% { transform: translateY(-2px) rotateX(10deg) rotateY(-10deg); }
    }
    .dual-orb-wrap {
      --orb-speed: 4s;
      --orb-spin-speed: 12s;
      --orb-pulse-speed: 2.2s;
      position: relative;
      display: inline-grid;
      place-items: center;
      width: var(--orb-size, 64px);
      max-width: 100%;
      aspect-ratio: 1;
      perspective: 900px;
      transform-style: preserve-3d;
      user-select: none;
      cursor: pointer;
      transition: transform .28s cubic-bezier(.175,.885,.32,1.275);
    }
    .dual-orb-svg {
      width: 100%;
      height: 100%;
      display: block;
      opacity: .78;
      filter: brightness(.72) saturate(1.08);
      transform: translateZ(0);
      animation: orbSpin var(--orb-spin-speed) linear infinite;
    }
    .dual-orb-wrap:hover {
      transform: scale(1.06) translateZ(0);
    }
    .dual-orb-shell {
      position: absolute;
      inset: 0;
      display: grid;
      place-items: center;
      animation: orbFloat 6s ease-in-out infinite;
    }
    .dual-orb-halo {
      position: absolute;
      inset: -18%;
      border-radius: 50%;
      background: radial-gradient(circle, var(--orb-primary) 0%, transparent 70%);
      opacity: .35;
      filter: blur(8px);
      animation: orbPulse var(--orb-pulse-speed) ease-out infinite;
    }
    .dual-orb-core {
      width: 34%;
      height: 34%;
      border-radius: 50%;
      background:
        radial-gradient(circle at 30% 30%, var(--orb-secondary), var(--orb-primary));
      box-shadow:
        0 0 20px var(--orb-primary),
        inset -6px -8px 14px rgba(0,0,0,.3),
        inset 6px 6px 12px rgba(255,255,255,.12);
      animation: orbBreathe var(--orb-speed) ease-in-out infinite;
    }
    .dual-orb-wrap.speaking .dual-orb-svg { animation-duration: calc(var(--orb-spin-speed) / 3); }
    .dual-orb-wrap.speaking .dual-orb-core { animation-duration: calc(var(--orb-speed) / 2); }
     /* Orb */
 .orb {      
 background: radial-gradient(circle at 30% 30%, var(--grad-a, #78e7ff), transparent 78%),
                  radial-gradient(circle at 70% 70%, var(--kob-voice-secondary, #00f2ff), var(--orb-secondary, #3b82f6));
      box-shadow: 0 0 18px var(--kob-voice-primary), 0 0 36px rgba(120,227,255,0.4);
      animation: orbSpin var(--orb-speed) linear infinite;
      width: 100%; height: 100%; border-radius: 50%; display: grid; place-items: center;

      width: 56px; height: 56px; 

    }
    .orb-core {

      min-width: 100%; min-height: 100%; 
border-radius: 50%;
      background: radial-gradient(circle at 30% 30%, var(--orb-accent, #78e7ff), transparent 78%),
                  radial-gradient(circle at 70% 70%, var(--kob-voice-primary, #00f2ff), var(--orb-secondary, #3b82f6));
      box-shadow: 0 0 18px var(--kob-voice-secondary), 0 0 36px rgba(120,227,255,0.4);
      animation: orbSpin var(--orb-speed) linear infinite;

      width: 56px; height: 56px; 

    }
    @keyframes orbSpin { to { transform: rotate(360deg); } }
    @keyframes orbPulse { from { transform: scale(1); } to { transform: scale(1.15); } }




  `.trim();
  document.head.appendChild(style);
}

/** Gera só o SVG do orb, SEM xmlns — pronto pra ir direto no innerHTML. */
function makeInlineOrbSVG(name = 'DUAL', size = 64) {
  const safe = String(name || 'DUAL').trim() || 'DUAL';
  const seed = safe.split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  const h1 = seed % 360;
  const h2 = (seed * 37) % 360;
  const uid = Math.random().toString(36).slice(2, 7);
  const gradId = `orb_${seed.toString(36)}_${uid}`;

  return `
<svg class="dual-orb-svg" viewBox="0 0 100 100" aria-hidden="true">
  <defs>
    <radialGradient id="${gradId}_core" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="hsl(${h1},100%,66%)" stop-opacity="1"/>
      <stop offset="55%" stop-color="hsl(${h2},92%,46%)" stop-opacity=".9"/>
      <stop offset="100%" stop-color="hsl(${h2},100%,12%)" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="${gradId}_ring" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="hsl(${h1},100%,76%)"/>
      <stop offset="100%" stop-color="hsl(${h2},100%,58%)"/>
    </linearGradient>
  </defs>
  <circle cx="50" cy="50" r="46" fill="#05070c"/>
  <circle cx="50" cy="50" r="40" fill="url(#${gradId}_core)" opacity=".28"/>
  <circle cx="50" cy="50" r="38" fill="none" stroke="url(#${gradId}_ring)" stroke-width="1"/>
  <circle cx="50" cy="50" r="46" fill="none" stroke="url(#${gradId}_ring)" stroke-width="2.5"
    stroke-dasharray="70 20 10 30" stroke-linecap="round" opacity=".86"/>
  <circle cx="50" cy="50" r="8" fill="#ffffff" opacity=".22" filter="blur(2px)"/>
  <circle cx="50" cy="50" r="3" fill="#ffffff" opacity=".85"/>
</svg>`.trim();
}

/** Anexa xmlns só quando o SVG for virar arquivo standalone (download). */
function withXmlns(svgStr) {
  if (!svgStr) return svgStr;
  if (/xmlns\s*=/.test(svgStr)) return svgStr;
  return svgStr.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"');
}

/** Versão standalone do SVG do orb (com xmlns), pronta pra download. */
function makeStandaloneOrbSVG(name = 'DUAL', size = 64) {
  const svg = makeInlineOrbSVG(name, size)
    .replace('<svg class="dual-orb-svg"', `<svg width="${size}" height="${size}"`);
  return withXmlns(svg);
}

/** Gera o HTML completo do orb (wrap + svg + shell), pronto pro DOM. */
function makeOrbHTML(name = 'DUAL', size = 64, speaking = false) {
  injectOrbStyles();

  const safe = String(name || 'DUAL').trim() || 'DUAL';
  const seed = safe.split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  const h1 = seed % 360;
  const h2 = (seed * 37) % 360;

  return `
<div class="dual-orb-wrap ${speaking ? 'speaking' : ''}"
  style="--orb-size:${size}px; --orb-primary:hsl(${h1},100%,62%); --orb-secondary:hsl(${h2},92%,48%);"
  aria-label="${safe}" role="img">
  ${makeInlineOrbSVG(name, size)}
  <div class="dual-orb-shell">
    <div class="dual-orb-halo"></div>
    <div class="dual-orb-core"></div>
  </div>
</div>`.trim();
}

/** Monta uma barra de símbolos a partir de uma lista [{name, svg, url}]. */
function makeSymbolBar(icons = []) {
  let html = '<div class="kodux-symbol-bar" style="display:flex;gap:12px;padding:16px;flex-wrap:wrap;">\n';
  icons.forEach(icon => {
    html += `  <a href="${icon.url || '#'}" class="kodux-symbol" title="${icon.name}" style="width:32px;height:32px;display:grid;place-items:center;">\n    ${icon.svg}\n  </a>\n`;
  });
  html += '</div>';
  return html;
}

/**
 * KoduxMemory · Controlador de objetos (regra 78K).
 * Pool com limite: quando estoura, remove o mais antigo do DOM
 * e libera a referência. Evita vazamento em telas que geram
 * muitos orbs/ícones dinamicamente.
 */
const KoduxMemory = {
  pool: new Map(),
  limit: 100,

  add(id, element) {
    if (this.pool.has(id)) this.remove(id);
    if (this.pool.size >= this.limit) {
      const oldest = this.pool.keys().next().value;
      this.remove(oldest);
    }
    this.pool.set(id, element);
    return element;
  },

  remove(id) {
    const el = this.pool.get(id);
    if (el && el.remove) el.remove();
    this.pool.delete(id);
  },

  clear() {
    this.pool.forEach(el => { if (el && el.remove) el.remove(); });
    this.pool.clear();
  },

  size() {
    return this.pool.size;
  }
};

export const KoduxOrb = {
  injectOrbStyles,
  makeInlineSVG: makeInlineOrbSVG,
  makeStandaloneSVG: makeStandaloneOrbSVG,
  makeOrbHTML,
  makeSymbolBar,
  withXmlns,
  Memory: KoduxMemory
};

export default KoduxOrb;
