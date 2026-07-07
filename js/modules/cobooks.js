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
