/*════════════════════════════════════════════════════════════════
   JS DO CARROSSEL HORIZONTAL (cole antes do </body>)
   ════════════════════════════════════════════════════════════════ */
(function(){
  'use strict';

  const track = document.getElementById('mastCarouselTrack');
  const wrap  = document.getElementById('mastCarouselWrap');
  const btnL  = document.getElementById('mastArrowLeft');
  const btnR  = document.getElementById('mastArrowRight');
  if(!track || !wrap) return;

  let idx = 0;
  let itemW = 48; // largura aproximada de cada item + gap
  let visibleItems = 0;
  let maxIdx = 0;

  function calcMetrics(){
    const wrapW = wrap.offsetWidth;
    const items = track.querySelectorAll('.mast-item');
    if(items.length === 0) return;
    // Calcula largura real do track
    let totalW = 0;
    items.forEach(it => {
      totalW += it.offsetWidth + 8; // 8 = gap
    });
    totalW -= 8; // remove último gap
    
    visibleItems = Math.floor(wrapW / itemW);
    maxIdx = Math.max(0, items.length - visibleItems);
    
    // Esconde setas se tudo couber
    const needArrows = totalW > wrapW;
    if(btnL) btnL.style.display = needArrows ? 'flex' : 'none';
    if(btnR) btnR.style.display = needArrows ? 'flex' : 'none';
    
    // Garante idx válido
    idx = Math.min(idx, maxIdx);
    apply();
  }

  function apply(){
    track.style.transform = `translateX(${-idx * itemW}px)`;
    if(btnL) btnL.disabled = idx <= 0;
    if(btnR) btnR.disabled = idx >= maxIdx;
  }

  function scroll(dir){
    idx = Math.max(0, Math.min(idx + dir, maxIdx));
    apply();
  }

  // Eventos das setas
  if(btnL) btnL.addEventListener('click', () => scroll(-1));
  if(btnR) btnR.addEventListener('click', () => scroll(1));

  // Swipe / drag no carrossel
  let dragStart = 0, dragDelta = 0, isDragging = false;

  wrap.addEventListener('touchstart', e => {
    dragStart = e.touches[0].clientX;
    isDragging = true;
    track.classList.add('dragging');
  }, {passive: true});

  wrap.addEventListener('touchmove', e => {
    if(!isDragging) return;
    dragDelta = e.touches[0].clientX - dragStart;
    track.style.transform = `translateX(${-idx * itemW + dragDelta}px)`;
  }, {passive: true});

  wrap.addEventListener('touchend', () => {
    if(!isDragging) return;
    isDragging = false;
    track.classList.remove('dragging');
    if(Math.abs(dragDelta) > 40){
      scroll(dragDelta > 0 ? -1 : 1);
    } else {
      apply();
    }
    dragDelta = 0;
  }, {passive: true});

  // Mouse drag (desktop)
  wrap.addEventListener('mousedown', e => {
    dragStart = e.clientX;
    isDragging = true;
    track.classList.add('dragging');
  });
  wrap.addEventListener('mousemove', e => {
    if(!isDragging) return;
    dragDelta = e.clientX - dragStart;
    track.style.transform = `translateX(${-idx * itemW + dragDelta}px)`;
  });
  wrap.addEventListener('mouseup', () => {
    if(!isDragging) return;
    isDragging = false;
    track.classList.remove('dragging');
    if(Math.abs(dragDelta) > 40){
      scroll(dragDelta > 0 ? -1 : 1);
    } else {
      apply();
    }
    dragDelta = 0;
  });
  wrap.addEventListener('mouseleave', () => {
    if(!isDragging) return;
    isDragging = false;
    track.classList.remove('dragging');
    apply();
    dragDelta = 0;
  });

  // Recalcula no resize
  window.addEventListener('resize', () => {
    clearTimeout(window._mastResizeT);
    window._mastResizeT = setTimeout(calcMetrics, 150);
  });

  // Inicializa
  calcMetrics();
  console.log('[KBLX·HEADER] SymbolBar horizontal ativada · ∆1134');
})();
