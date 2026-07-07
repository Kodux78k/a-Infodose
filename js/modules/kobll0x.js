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
