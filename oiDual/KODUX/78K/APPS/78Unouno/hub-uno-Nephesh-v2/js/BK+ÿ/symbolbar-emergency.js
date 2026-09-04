/* ════════════════════════════════════════════════════════════════
   KOBLLUX · SymbolBar EMERGENCY v1.0 · DRAG + SNAP ONLY
   Substitua o 40-symbolbar-v2.js por este arquivo para testar.
   Sem carrossel, sem overlays, sem TTS — só movimento puro.
   ════════════════════════════════════════════════════════════════ */

(function(){
  'use strict';
  console.log('[KBLX·EMERGENCY] SymbolBar drag-only iniciado');

  const bar = document.getElementById('symbolBar');
  if(!bar){
    console.error('[KBLX·EMERGENCY] #symbolBar não encontrado!');
    return;
  }

  /* ── 1. CSS DE EMERGÊNCIA INJETADO ── */
  const emergencyCSS = document.createElement('style');
  emergencyCSS.textContent = `
    /* OVERRIDE: garante que o container receba eventos */
    #symbolBar, .symbol-bar {
      pointer-events: auto !important;
    }
    /* Handle de drag visível e funcional */
    .sb-drag-handle {
      position: absolute;
      inset: 0;
      z-index: 0;
      cursor: grab;
      background: transparent;
      border-radius: inherit;
      pointer-events: auto !important;
    }
    .symbol-bar.is-dragging .sb-drag-handle {
      cursor: grabbing !important;
    }
    /* Filhos interativos ficam ACIMA do handle */
    .symbol-bar .toggle-wrap,
    .symbol-bar #btn-arch,
    .symbol-bar .hud-info {
      position: relative;
      z-index: 2;
      pointer-events: auto !important;
    }
    /* Estados de snap */
    .symbol-bar.snap-side {
      left: 0 !important; right: auto !important;
      border-radius: 0 24px 24px 0; border-left: 0;
    }
    .symbol-bar.snap-side-right {
      right: 0 !important; left: auto !important;
      border-radius: 24px 0 0 24px; border-right: 0;
    }
    .symbol-bar.snap-top {
      top: 10px !important; bottom: auto !important;
      border-radius: 0 0 24px 24px; border-top: 0;
    }
    .symbol-bar.snap-bottom {
      top: auto !important; bottom: 80px !important;
      border-radius: 24px 24px 0 0; border-bottom: 0;
    }
    .symbol-bar.floating {
      border-radius: 24px;
    }
    .symbol-bar.is-dragging {
      opacity: 0.92;
      transition: none !important;
      will-change: top, left;
    }
  `;
  document.head.appendChild(emergencyCSS);

  /* ── 2. CRIAR DRAG HANDLE SE NÃO EXISTIR ── */
  let handle = bar.querySelector('.sb-drag-handle');
  if(!handle){
    handle = document.createElement('div');
    handle.className = 'sb-drag-handle';
    bar.insertBefore(handle, bar.firstChild);
    console.log('[KBLX·EMERGENCY] Drag handle criado');
  } else {
    console.log('[KBLX·EMERGENCY] Drag handle já existe');
  }

  /* ── 3. ESTADO ── */
  let dragging = false;
  let offX = 0, offY = 0;
  let startX = 0, startY = 0;
  const SNAP_THRESHOLD = 60;
  const BOTTOM_THRESHOLD = 90;

  /* ── 4. POSIÇÃO INICIAL ── */
  function initPos(){
    try {
      const saved = JSON.parse(localStorage.getItem('kob_symbolbar_pos'));
      if(saved && saved.top != null && saved.left != null){
        bar.style.top = saved.top + 'px';
        bar.style.left = saved.left + 'px';
        bar.style.right = 'auto';
        bar.style.transform = 'none';
        console.log('[KBLX·EMERGENCY] Posição restaurada', saved);
        return;
      }
    } catch(e){}
    // Padrão: direita centralizado
    bar.style.top = '50%';
    bar.style.left = 'auto';
    bar.style.right = '12px';
    bar.style.transform = 'translateY(-50%)';
    console.log('[KBLX·EMERGENCY] Posição padrão aplicada');
  }

  /* ── 5. SNAP ── */
  function snap(){
    const r = bar.getBoundingClientRect();
    const cx = r.left + r.width/2;
    const cy = r.top + r.height/2;
    const W = window.innerWidth;
    const H = window.innerHeight;
    const dl = cx, dr = W - cx, dt = cy, db = H - cy;

    bar.classList.remove('snap-side','snap-side-right','snap-top','snap-bottom','floating');

    let snapClass = 'floating';
    if(dl < SNAP_THRESHOLD){
      snapClass = 'snap-side';
      bar.style.left = '0'; bar.style.right = 'auto';
      bar.style.top = Math.max(10, Math.min(H - r.height - 10, r.top)) + 'px';
    } else if(dr < SNAP_THRESHOLD){
      snapClass = 'snap-side-right';
      bar.style.left = 'auto'; bar.style.right = '0';
      bar.style.top = Math.max(10, Math.min(H - r.height - 10, r.top)) + 'px';
    } else if(dt < SNAP_THRESHOLD){
      snapClass = 'snap-top';
      bar.style.top = '10px';
      bar.style.left = Math.max(10, Math.min(W - r.width - 10, r.left)) + 'px';
    } else if(db < BOTTOM_THRESHOLD){
      snapClass = 'snap-bottom';
      bar.style.top = 'auto'; bar.style.bottom = '80px';
      bar.style.left = Math.max(10, Math.min(W - r.width - 10, r.left)) + 'px';
    } else {
      bar.classList.add('floating');
    }

    bar.classList.add(snapClass);
    console.log('[KBLX·EMERGENCY] Snap:', snapClass, {dl:dl.toFixed(0), dr:dr.toFixed(0), dt:dt.toFixed(0), db:db.toFixed(0)});

    // Salvar
    try {
      const nr = bar.getBoundingClientRect();
      localStorage.setItem('kob_symbolbar_pos', JSON.stringify({top:nr.top, left:nr.left}));
    } catch(e){}
  }

  /* ── 6. EVENTOS DE DRAG ── */
  handle.addEventListener('pointerdown', function(e){
    // Só botão esquerdo
    if(e.button !== 0) return;

    dragging = true;
    bar.setPointerCapture(e.pointerId);
    const r = bar.getBoundingClientRect();
    offX = e.clientX - r.left;
    offY = e.clientY - r.top;
    startX = e.clientX;
    startY = e.clientY;

    bar.classList.add('is-dragging');
    bar.classList.remove('snap-side','snap-side-right','snap-top','snap-bottom','floating');
    bar.style.transform = 'none';
    bar.style.right = 'auto';
    bar.style.bottom = 'auto';

    console.log('[KBLX·EMERGENCY] DRAG START', {x:e.clientX, y:e.clientY});
    e.preventDefault();
  });

  bar.addEventListener('pointermove', function(e){
    if(!dragging) return;
    let x = Math.max(0, Math.min(window.innerWidth - bar.offsetWidth, e.clientX - offX));
    let y = Math.max(0, Math.min(window.innerHeight - bar.offsetHeight, e.clientY - offY));
    bar.style.left = x + 'px';
    bar.style.top = y + 'px';
  });

  bar.addEventListener('pointerup', function(e){
    if(!dragging) return;
    dragging = false;
    bar.classList.remove('is-dragging');

    const dist = Math.hypot(e.clientX - startX, e.clientY - startY);
    console.log('[KBLX·EMERGENCY] DRAG END', {dist:dist.toFixed(1), x:e.clientX, y:e.clientY});

    // Se foi só um clique curto (menos de 5px), não faz snap — deixa onde está
    if(dist < 5){
      console.log('[KBLX·EMERGENCY] Detectado como CLIQUE (não drag), mantendo posição');
      try {
        const r = bar.getBoundingClientRect();
        localStorage.setItem('kob_symbolbar_pos', JSON.stringify({top:r.top, left:r.left}));
      } catch(e){}
      return;
    }

    snap();
  });

  bar.addEventListener('pointercancel', function(){
    if(dragging){
      dragging = false;
      bar.classList.remove('is-dragging');
      snap();
      console.log('[KBLX·EMERGENCY] DRAG CANCELADO');
    }
  });

  /* ── 7. TOGGLE DO MENU (≡) ── */
  const toggleBtn = document.getElementById('toggleBtn');
  if(toggleBtn){
    toggleBtn.addEventListener('click', function(e){
      e.stopPropagation();
      bar.classList.toggle('collapsed');
      const isCollapsed = bar.classList.contains('collapsed');
      try { localStorage.setItem('kob_symbolbar_collapsed', isCollapsed ? '1' : '0'); } catch(e){}
      console.log('[KBLX·EMERGENCY] Toggle collapsed:', isCollapsed);
    });
  }

  /* ── 8. INICIALIZAR ── */
  initPos();

  // Restaurar estado colapsado
  try {
    if(localStorage.getItem('kob_symbolbar_collapsed') === '1'){
      bar.classList.add('collapsed');
    }
  } catch(e){}

  console.log('[KBLX·EMERGENCY] Pronto! Tente arrastar a barra pela área vazia (não pelos botões).');
})();
