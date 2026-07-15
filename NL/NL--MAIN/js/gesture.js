document.addEventListener('DOMContentLoaded', () => {
  const scene = document.getElementById('scene');     // container que envolve vídeo + cartão
  const scrollArea = document.getElementById('scrollArea');
  const card = document.getElementById('card');       // usado para capturar toques

  if (!scene || !scrollArea || !card) return;

  let currentScale = 1;
  let startY = 0;
  let startScale = 1;
  let isGestureActive = false;

  // --- Efeito de scroll (parallax) ---
  function updateParallax() {
    const y = scrollArea.scrollTop;
    const maxScroll = 1200;
    const t = Math.min(y / maxScroll, 1);

    // Deslocamento vertical baseado no scroll (máximo -60px)
    const scrollOffset = t * -60;

    // Aplica a transformação combinada: escala (do gesto) + translação (do scroll)
    scene.style.transform = `scale(${currentScale}) translateY(${scrollOffset}px)`;

    // Opacidade para fade out no final do scroll
    const opacity = 1 - (t > 0.85 ? (t - 0.85) * 6 : 0);
    scene.style.opacity = Math.max(opacity, 0);

    requestAnimationFrame(updateParallax);
  }

  // --- Gestos de toque (zoom) ---
  function handleTouchStart(e) {
    // Captura toques no cartão (ou em seus filhos)
    if (!card.contains(e.target)) return;
    const touch = e.touches[0];
    startY = touch.clientY;
    startScale = currentScale;
    isGestureActive = true;
    // Remove transição para resposta imediata
    scene.style.transition = 'none';
  }

  function handleTouchMove(e) {
    if (!isGestureActive) return;
    e.preventDefault(); // evita scroll da página durante o gesto
    const touch = e.touches[0];
    const deltaY = startY - touch.clientY; // positivo = arrastou para cima, negativo = para baixo

    // Sensibilidade: cada 100px de arraste altera a escala em 0.2
    const sensitivity = 0.002;
    let newScale = startScale + deltaY * sensitivity;

    // Limites: escala entre 1.0 e 3.0
    newScale = Math.min(Math.max(newScale, 1.0), 3.0);
    currentScale = newScale;

    // Aplica a transformação imediatamente (o loop parallax vai atualizar também)
    // Mas aqui podemos aplicar diretamente para feedback instantâneo
    const y = scrollArea.scrollTop;
    const maxScroll = 1200;
    const t = Math.min(y / maxScroll, 1);
    const scrollOffset = t * -60;
    scene.style.transform = `scale(${newScale}) translateY(${scrollOffset}px)`;
  }

  function handleTouchEnd(e) {
    if (!isGestureActive) return;
    isGestureActive = false;
    // Restaura transição suave para o snap
    scene.style.transition = 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)';

    // Snap para escalas inteiras (1.0, 2.0, 3.0)
    if (currentScale < 1.2) {
      currentScale = 1.0;
    } else if (currentScale > 2.8) {
      currentScale = 3.0;
    } else if (currentScale > 1.8 && currentScale < 2.2) {
      currentScale = 2.0;
    }

    // Aplica o snap com animação
    const y = scrollArea.scrollTop;
    const maxScroll = 1200;
    const t = Math.min(y / maxScroll, 1);
    const scrollOffset = t * -60;
    scene.style.transform = `scale(${currentScale}) translateY(${scrollOffset}px)`;
  }

  // Listeners de toque
  card.addEventListener('touchstart', handleTouchStart, { passive: true });
  card.addEventListener('touchmove', handleTouchMove, { passive: false });
  card.addEventListener('touchend', handleTouchEnd);
  card.addEventListener('touchcancel', handleTouchEnd);

  // Inicia o loop de parallax
  updateParallax();

  // Debug (opcional)
  window.__gesture = { currentScale };
});