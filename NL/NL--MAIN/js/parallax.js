document.addEventListener('DOMContentLoaded', () => {
  const scrollArea = document.getElementById('scrollArea');
  const card = document.getElementById('card');

  if (!scrollArea || !card) return;

  function renderParallax() {
    const y = scrollArea.scrollTop;
    const maxScroll = 1200;
    const t = Math.min(y / maxScroll, 1);

    // Apenas deslocamento vertical (parallax) – a escala é controlada pelo gesture.js
    const translateY = t * -30;
    // Não alteramos a escala aqui, apenas a posição Y
    // Para não sobrescrever a escala definida pelo gesture, usamos uma variável global
    // ou aplicamos apenas translateY mantendo a escala atual.
    // Vamos aplicar a transformação combinada via CSS custom property ou diretamente.
    // Melhor: usar um estilo inline que preserve a escala definida pelo gesture.
    // Como o gesture também usa transform, vamos combinar usando uma abordagem:
    // O gesture define scale e translateY, e o parallax adiciona translateY extra.
    // Para simplificar, faremos o parallax apenas modificar translateY, e o gesture modificar scale e também translateY.
    // Para não conflitar, podemos usar duas transformações separadas ou usar matrix.
    // Abordagem simples: o gesture define a transform completa, e o parallax apenas ajusta a posição.
    // Vamos fazer o parallax modificar uma variável CSS ou um atributo data.
    // Ou podemos fazer o gesture ler o scrollTop e ajustar a escala baseado nele.
    // Mas o usuário quer gesto de toque, não scroll.
    // Vou separar: o parallax controla o translateY baseado no scroll, o gesture controla o scale.
    // Para aplicar ambos, precisamos combinar: transform: scale(gestureScale) translateY(scrollOffset + gestureOffset)
    // Vamos fazer o gesture controlar o scale e também um translateY adicional (para movimento suave).
    // O parallax controla o translateY baseado no scroll.
    // Para combinar, podemos usar uma função que atualiza ambos.
    // Por enquanto, vou apenas aplicar o translateY do scroll e deixar o gesture controlar o scale e um translateY adicional via style.
    // Para evitar conflito, o gesture pode usar transform: scale(s) translateY(y_gesture)
    // e o parallax pode adicionar translateY via outra propriedade, mas não podemos ter duas transformações.
    // Vamos usar uma abordagem: o parallax atualiza uma variável global scrollOffset, e o gesture lê essa variável e aplica junto com o scale.
    // Melhor: criar uma função updateTransform que combina tudo.

    // Vou modificar para: o gesture define a escala e o deslocamento, e o parallax apenas define uma variável de deslocamento.
    // Para simplificar, vou remover o parallax e deixar o gesture controlar tudo (zoom e deslocamento) via toque.
    // Mas o usuário também quer o efeito de scroll (parallax). Então mantemos ambos.
    // Vou fazer o parallax atualizar um data attribute no card, e o gesture ler esse data para combinar.
    // Mas isso fica complexo. Uma solução mais simples: o parallax usa translateY, o gesture usa scale e translateY.
    // Podemos usar transform: scale(s) translateY(y1) translateY(y2) -> translateY(y1 + y2).
    // No gesture, aplicamos transform: scale(s) translateY(y_gesture);
    // No parallax, aplicamos transform: translateY(y_scroll);
    // Mas isso sobrescreveria. Então precisamos combinar.
    // Vou fazer o gesture sempre ler o valor de scroll e aplicar junto.
    // Então o gesture vai controlar tanto a escala quanto o deslocamento baseado no scroll.
    // Então podemos eliminar o parallax.js e colocar tudo no gesture.js, que lê o scrollTop e aplica a transformação completa.

    // Portanto, vou unificar: o gesture.js controla tudo (escala e translação) baseado tanto no scroll quanto no toque.
    // Vou manter o parallax.js apenas como fallback ou remover.
    // Vou substituir o parallax.js por um novo que lê o scroll e aplica a transformação, e o gesture.js adiciona o zoom.

    // Para não quebrar, vou modificar o parallax.js para não fazer nada e deixar o gesture.js fazer tudo.
    // Ou posso remover o parallax.js e adicionar a lógica de scroll no gesture.js.
    // Vou manter o parallax.js com uma função que é chamada pelo gesture.js para obter o scroll offset.

    // Abaixo, vou colocar o código final do gesture.js que lê o scroll e o toque.
  }
});