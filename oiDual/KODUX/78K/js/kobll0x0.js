// ==========================================
// 1. MOTORES MATEMÁTICOS (Puros e Isolados)
// ==========================================

const generateHash = (str, seed = 0) => {
  let h1 = 0xdeadbeef ^ seed, h2 = 0x41c6ce57 ^ seed;
  for (let i = 0, ch; i < str.length; i++) {
    ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return 4294967296 * (2097151 & h2) + (h1 >>> 0);
};

const createPRNG = (seed) => {
  return function() {
    let t = seed += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
};


// ==========================================
// 2. O DNA VISUAL (As 12 Famílias)
// ==========================================

const ARCHETYPES = {
  ATLAS:   { geometry: "cube", frequency: 1, symmetry: 4, noise: 0.08, glow: "cyan" },
  NOVA:    { geometry: "icosahedron", frequency: 5, symmetry: 5, noise: 0.22, glow: "orange" },
  VITALIS: { geometry: "sphere", frequency: 2, symmetry: 12, noise: 0.04, glow: "green" },
  PULSE:   { geometry: "torus", frequency: 8, symmetry: 24, animation: "pulse" },
  ARTEMIS: { geometry: "octahedron", frequency: 3, symmetry: 2, noise: 0.1 },
  KAOS:    { geometry: "fractal", entropy: 1.0, symmetry: "adaptive" },
  SERENA:  { geometry: "dodecahedron", frequency: 1, symmetry: 10, noise: 0.02 },
  GENUS:   { geometry: "tetrahedron", frequency: 1, symmetry: 3, noise: 0.05 },
  SOLUS:   { geometry: "cube", minimal: true, symmetry: 4, noise: 0 },
  AION:    { geometry: "flower_of_life", frequency: 6, symmetry: 6, noise: 0.01 },
  RHEA:    { geometry: "spiral", frequency: 13, symmetry: 1, noise: 0.15 },
  LUMINE:  { geometry: "metatron", frequency: 12, symmetry: 12, noise: 0.05, glow: "white" }
};


// ==========================================
// 3. MÓDULOS DE RENDERIZAÇÃO (Agnósticos)
// ==========================================

class CubooksGeometry {
  static compute(dna, random) {
    // Aqui a mágica de vértices acontece. 
    // Usamos o random() determinístico para gerar as variações.
    const vertexWobble = random() * (dna.noise || 0);
    
    // Retorna a estrutura pura (mockada para o setup inicial)
    return {
      vertices: [[0, 1 + vertexWobble], [1, 0], [0, -1], [-1, 0]],
      faces: [[0, 1, 2, 3]],
      type: dna.geometry,
      color: dna.glow || "currentColor"
    };
  }
}

class SVGRenderer {
  static render(geometry, dna) {
    // Transforma os vértices puros em SVG
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 4 4" class="kobll0x-icon ${dna.icon}">
      <polygon points="${geometry.vertices.map(v => v.join(',')).join(' ')}" 
               fill="none" 
               stroke="${geometry.color}" 
               stroke-width="0.1" />
    </svg>`;
  }
}


// ==========================================
// 4. A CLASSE ONIPOTENTE (Orquestrador)
// ==========================================

export class Kobll0X {
  constructor(defaultArchetype = "ATLAS") {
    this.activeArchetype = defaultArchetype;
    this.memory = new Map(); // Cache em memória ultrarrápido
  }

  setArchetype(name) {
    if (!ARCHETYPES[name]) throw new Error(`Arquétipo ${name} desconhecido.`);
    this.activeArchetype = name;
  }

  _generateDNA(iconName) {
    const seed = generateHash(iconName);
    const archetypeData = ARCHETYPES[this.activeArchetype];
    return { icon: iconName, seed, ...archetypeData };
  }

  /**
   * O motor principal de geração procedural.
   */
  create(iconName) {
    // 1. Gera a chave de cache usando o padrão estrutural
    const cacheKey = `di_kobll_${this.activeArchetype}_${iconName}`;

    // 2. Busca no cache de memória (Camada 1)
    if (this.memory.has(cacheKey)) {
      return this.memory.get(cacheKey);
    }

    // 3. Busca no cache persistente (Camada 2)
    const storedSVG = localStorage.getItem(cacheKey);
    if (storedSVG) {
      this.memory.set(cacheKey, storedSVG);
      return storedSVG;
    }

    // 4. Se não existe, cria a receita (DNA)
    const dna = this._generateDNA(iconName);
    
    // 5. Inicia o PRNG determinístico
    const random = createPRNG(dna.seed);

    // 6. Calcula a Matemática (Sem saber nada de HTML)
    const geometry = CubooksGeometry.compute(dna, random);

    // 7. Renderiza (Neste caso, SVG)
    const finalSVG = SVGRenderer.render(geometry, dna);

    // 8. Salva o resultado para nunca mais recalcular este ícone neste arquétipo
    localStorage.setItem(cacheKey, finalSVG);
    this.memory.set(cacheKey, finalSVG);

    return finalSVG;
  }

  /**
   * Utilitário para injetar no DOM com segurança.
   */
  inject(elementId, iconName, label = null) {
    const el = document.getElementById(elementId);
    if (!el) return;

    // Injeta o SVG
    el.innerHTML = this.create(iconName);

    // Se houver um texto descritivo/label junto ao ícone, 
    // garante a integridade usando textContent
    if (label) {
      const span = document.createElement('span');
      span.textContent = label;
      el.appendChild(span);
    }
  }
}

// Inicializa o Singleton para uso global da aplicação
export const createKobll0X = new Kobll0X();


// 🔥 UNIVERSAL ORB GENERATOR: EVOLVED 3D (V3) 🔥
function injectOrbStyles() {
  if (document.getElementById('dual-orb-styles')) return;

  const style = document.createElement('style');
  style.id = 'dual-orb-styles';
  style.innerHTML = `
    @keyframes orbBreathe {
      0%, 100% { transform: translateZ(0) scale(1); opacity: .82; filter: brightness(1); }
      50%      { transform: translateZ(0) scale(1.08); opacity: 1;   filter: brightness(1.22); }
    }

    @keyframes orbSpin {
      from { transform: rotate(0deg); }
      to   { transform: rotate(360deg); }
    }

    @keyframes orbPulse {
      0%   { transform: scale(.78); opacity: .55; }
      100% { transform: scale(1.28); opacity: 0; }
    }

    @keyframes orbFloat {
      0%, 100% { transform: translateY(0px) rotateX(0deg) rotateY(0deg); }
      50%      { transform: translateY(-2px) rotateX(10deg) rotateY(-10deg); }
    }

    .dual-orb-wrap {
      --orb-speed: 4s;
      --orb-spin-speed: 12s;
      --orb-pulse-speed: 2.2s;

      position: relative;
      display: inline-grid;
      place-items: center;
      width: var(--orb-size, 64px);
      aspect-ratio: 1;
      perspective: 900px;
      transform-style: preserve-3d;
      user-select: none;
      cursor: pointer;
      transition: transform .28s cubic-bezier(.175,.885,.32,1.275);
    }

    .dual-orb-wrap:active {
      transform: scale(.94);
    }

    .dual-orb-wrap:hover {
      transform: scale(1.03);
    }

    .dual-orb-svg {
      width: 100%;
      height: 100%;
      display: block;
      opacity: .78;
      filter: brightness(.72) saturate(1.08);
      transform: translateZ(0);
    }

    .dual-orb-shell {
      position: absolute;
      inset: 10%;
      display: grid;
      place-items: center;
      transform-style: preserve-3d;
      animation: orbFloat 6s ease-in-out infinite;
      pointer-events: none;
    }

    .dual-orb-halo {
      position: absolute;
      inset: -24%;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(120,227,255,.24), rgba(185,120,255,.06) 42%, transparent 70%);
      filter: blur(18px);
      opacity: .9;
      animation: orbPulse var(--orb-pulse-speed) ease-in-out infinite;
      transform: translateZ(-18px);
    }

    .dual-orb-core {
      position: relative;
      width: 42%;
      height: 42%;
      border-radius: 50%;
      transform-style: preserve-3d;
      transform: translateZ(18px);
      background:
        radial-gradient(circle at 30% 28%, rgba(255,255,255,.95) 0%, rgba(255,255,255,.32) 8%, rgba(255,255,255,0) 26%),
        radial-gradient(circle at 70% 72%, var(--orb-primary, #78e3ff) 0%, var(--orb-secondary, #b978ff) 74%);
      box-shadow:
        0 0 16px rgba(120,227,255,.55),
        0 0 34px rgba(120,227,255,.25),
        inset -10px -12px 20px rgba(0,0,0,.38),
        inset 10px 10px 18px rgba(255,255,255,.12);
      animation: orbSpin var(--orb-spin-speed) linear infinite;
    }

    .dual-orb-core::before {
      content: "";
      position: absolute;
      inset: -42%;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(255,255,255,.16), transparent 66%);
      filter: blur(10px);
      opacity: .75;
    }

    .dual-orb-core::after {
      content: "";
      position: absolute;
      inset: 12%;
      border-radius: 50%;
      background: radial-gradient(circle at 35% 35%, rgba(255,255,255,.65), transparent 58%);
      opacity: .55;
      mix-blend-mode: screen;
    }

    .dual-orb-wrap.speaking .dual-orb-core {
      animation:
        orbSpin 2s linear infinite,
        orbBreathe .55s ease-in-out infinite alternate;
    }

    .dual-orb-wrap.speaking .dual-orb-halo {
      animation:
        orbPulse .85s ease-in-out infinite;
    }

    .dual-orb-wrap:hover .dual-orb-core {
      box-shadow:
        0 0 20px rgba(120,227,255,.7),
        0 0 42px rgba(120,227,255,.36),
        inset -10px -12px 20px rgba(0,0,0,.34),
        inset 10px 10px 18px rgba(255,255,255,.14);
    }
  `;
  document.head.appendChild(style);
}

function makeOrbAvatar(name = 'DUAL', size = 64) {
  injectOrbStyles();

  const safe = String(name || 'DUAL').trim() || 'DUAL';
  const seed = safe.split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  const h1 = seed % 360;
  const h2 = (seed * 37) % 360;
  const uid = Math.random().toString(36).slice(2, 7);
  const gradId = `orb_${seed.toString(36)}_${uid}`;

  return `
    <div
      class="dual-orb-wrap"
      id="${gradId}"
      style="--orb-size:${size}px; --orb-primary:hsl(${h1},100%,62%); --orb-secondary:hsl(${h2},92%,48%);"
      aria-label="${safe}"
      role="img"
    >
      <svg class="dual-orb-svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
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
      </svg>

      <div class="dual-orb-shell">
        <div class="dual-orb-halo"></div>
        <div class="dual-orb-core"></div>
      </div>
    </div>
  `;
}


window.makeOrbAvatar = makeOrbAvatar;
window.makeMiniAvatar = (name) => makeOrbAvatar(name, 24);
window.makeOrbAvatar3D = makeOrbAvatar;

(() => {
  if (window.__DI_OVERRIDE_READY__) return;
  window.__DI_OVERRIDE_READY__ = true;

  const NAME_KEYS = ['di_userName', 'userName'];

  const SEL = {
    inputA: '#inputUser',
    inputB: '#infodoseNameInput',
    lblName: '#lblName',
    actName: '#actName',
    smallText: '#smallText',
    hudStatus: '#hudStatus',
    smallIdent: '#smallIdent',
    actBadge: '#actBadge',
    mainOrb: '#main-orb',
    avatarTarget: '#avatarTarget',
    smallMiniAvatar: '#smallMiniAvatar',
    actMiniAvatar: '#actMiniAvatar'
  };

  const $ = (s) => document.querySelector(s);

  function safeName(v) {
    return (v || '').trim() || 'DUAL';
  }

  function seed(name) {
    return [...name].reduce((a, c) => a + c.charCodeAt(0), 0);
  }

  function compute(name) {
    const s = seed(name);
    return {
      name,
      seed: s,
      h1: s % 360,
      h2: (s * 37) % 360
    };
  }

  function applyRoot(name) {
    const d = compute(name);
    const root = document.documentElement;

    root.style.setProperty('--kob-voice-primary', `hsl(${d.h1} 100% 55%)`);
    root.style.setProperty('--kob-voice-secondary', `hsl(${d.h2} 90% 45%)`);
    root.dataset.diName = d.name;
    root.dataset.arch = d.name;
  }

  function renderOrb(selector, name, size) {
    const el = $(selector);
    if (!el) return;

    if (typeof window.makeOrbAvatar === 'function') {
      el.innerHTML = window.makeOrbAvatar(name, size);
    }
  }

  function setText(selector, value) {
    const el = $(selector);
    if (el) el.textContent = value;
  }

  function sync(name) {
    const safe = safeName(name);

    localStorage.setItem('di_userName', safe);
    localStorage.setItem('userName', safe);

    applyRoot(safe);

    setText(SEL.lblName, safe);
    setText(SEL.actName, safe);
    setText(SEL.smallText, safe);
    setText(SEL.hudStatus, safe);

    const activeKey = window.STATE?.keys?.find?.(k => k.active);
    const keyName = activeKey ? activeKey.name : '--';

    setText(SEL.smallIdent, keyName);
    setText(SEL.actBadge, activeKey ? `key:${keyName}` : 'v:--');

    renderOrb(SEL.mainOrb, safe, 48);
    renderOrb(SEL.avatarTarget, safe, 64);
    renderOrb(SEL.smallMiniAvatar, safe, 24);
    renderOrb(SEL.actMiniAvatar, safe, 36);
  }

  function bind() {
    const inputs = [$(SEL.inputA), $(SEL.inputB)].filter(Boolean);
    const initial = safeName(
      $(SEL.inputA)?.value ||
      $(SEL.inputB)?.value ||
      localStorage.getItem('di_userName') ||
      localStorage.getItem('userName')
    );

    inputs.forEach((inp) => {
      if (!inp.value) inp.value = initial;
      inp.addEventListener('input', () => sync(inp.value));
      inp.addEventListener('change', () => sync(inp.value));
    });

    sync(initial);

    window.addEventListener('storage', (e) => {
      if (NAME_KEYS.includes(e.key)) sync(e.newValue);
    });

    document.addEventListener('di:name:update', (e) => {
      sync(e.detail?.name);
    });
  }

  window.di_overrideSync = sync;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bind);
  } else {
    bind();
  }
})();

class CubooksGeometry {
  static compute(dna, random) {
    const noiseLevel = dna.noise || 0;
    
    // Função utilitária para aplicar ruído determinístico a um ponto
    const applyNoise = (val) => val + (random() * 2 - 1) * noiseLevel;

    let vertices = [];
    let faces = [];

    switch (dna.geometry.toUpperCase()) {
      case "CUBE":
        // 1. Gera os 8 vértices de um cubo 3D perfeito no espaço (+ ruído procedural)
        const v3d = [
          [-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1],
          [-1, -1,  1], [1, -1,  1], [1, 1,  1], [-1, 1,  1]
        ].map(v => v.map(coord => applyNoise(coord)));

        // 2. Projeta de 3D para 2D (Projeção Isométrica Básica)
        vertices = v3d.map(([x, y, z]) => [
          (x - z) * 0.866,           // Eixo X no SVG
          y + (x + z) * 0.5          // Eixo Y no SVG
        ]);

        // 3. Define as faces ligando os vértices para o motor desenhar
        faces = [
          [0, 1, 2, 3], // Traseira
          [4, 5, 6, 7], // Frontal
          [0, 1, 5, 4], // Baixo
          [2, 3, 7, 6], // Cima
          [0, 3, 7, 4], // Esquerda
          [1, 2, 6, 5]  // Direita
        ];
        break;

      // Aqui entrarão o ICOSAHEDRON (Nova), SPHERE (Vitalis), etc.
      default:
        // Fallback (Losango base)
        vertices = [[0, 1], [1, 0], [0, -1], [-1, 0]].map(v => v.map(applyNoise));
        faces = [[0, 1, 2, 3]];
    }

    return {
      vertices,
      faces,
      type: dna.geometry,
      color: dna.glow || "currentColor"
    };
  }
}
