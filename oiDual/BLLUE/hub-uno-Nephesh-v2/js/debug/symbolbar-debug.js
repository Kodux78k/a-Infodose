/* ════════════════════════════════════════════════════════════════
   KOBLLUX · SymbolBar v2.2 · DEBUG PATCH · ∆1134
   Cole este script NO FINAL do <body>, DEPOIS do 40-symbolbar-v2.js
   ou execute no console (F12) para diagnosticar em tempo real.
   ════════════════════════════════════════════════════════════════ */

(function KOBLLUX_SYMBOLBAR_DEBUG(){
  const LOG = {
    ok:  (m,d)=>console.log('%c[KBLX·DRAG] '+m,'color:#7cffb2;font-weight:bold;',d||''),
    warn:(m,d)=>console.warn('%c[KBLX·DRAG] '+m,'color:#ffd700;font-weight:bold;',d||''),
    err: (m,d)=>console.error('%c[KBLX·DRAG] '+m,'color:#ff6b6b;font-weight:bold;',d||''),
    info:(m,d)=>console.info('%c[KBLX·DRAG] '+m,'color:#00e5ff;font-weight:bold;',d||''),
    evt: (m,d)=>console.log('%c[KBLX·EVT]  '+m,'color:#a77cff;font-weight:bold;',d||'')
  };

  LOG.info('DEBUG PATCH INICIADO · v2.2-DEBUG');

  /* ── 1. CHECAGEM DE ELEMENTOS ── */
  const bar = document.getElementById('symbolBar');
  if(!bar){
    LOG.err('ELEMENTO #symbolBar NÃO ENCONTRADO NO DOM!','Verifique se o HTML está carregado.');
    return;
  }
  LOG.ok('#symbolBar encontrado', {width:bar.offsetWidth, height:bar.offsetHeight, rect:bar.getBoundingClientRect()});

  const handle = bar.querySelector('.sb-drag-handle');
  if(!handle){
    LOG.warn('.sb-drag-handle NÃO ENCONTRADO. O createDragHandle() pode não ter rodado.');
  } else {
    LOG.ok('.sb-drag-handle encontrado', {zIndex:getComputedStyle(handle).zIndex, cursor:getComputedStyle(handle).cursor});
  }

  const toggleBtn = document.getElementById('toggleBtn');
  if(!toggleBtn) LOG.warn('#toggleBtn não encontrado');
  else LOG.ok('#toggleBtn encontrado');

  /* ── 2. ESTADO GLOBAL DE DEBUG ── */
  window.__kblxDebug = {
    dragEvents: [],
    snapHistory: [],
    startTime: performance.now()
  };

  /* ── 3. INTERCEPTAR POINTERDOWN ── */
  const origPointerDown = bar.onpointerdown;
  bar.addEventListener('pointerdown', function(e){
    const targetTag = e.target.tagName;
    const targetClass = e.target.className;
    const isButton = e.target.closest('button, .kblx-carousel-viewport, .kblx-dots, .orb-microphone-container');

    LOG.evt('pointerdown CAPTURADO', {
      pointerId: e.pointerId,
      clientX: e.clientX,
      clientY: e.clientY,
      target: targetTag + (targetClass ? '.'+targetClass.split(' ')[0] : ''),
      isButton: !!isButton,
      button: e.button,
      buttons: e.buttons,
      defaultPrevented: e.defaultPrevented
    });

    if(isButton){
      LOG.warn('pointerdown IGNORADO → clicou em botão interno', {target: e.target.outerHTML.slice(0,80)});
    } else {
      LOG.ok('pointerdown ACEITO → iniciará drag', {clientX:e.clientX, clientY:e.clientY});
    }
  }, true); // capture phase para pegar antes de tudo

  /* ── 4. MONITORAR CLASSES EM TEMPO REAL ── */
  const obs = new MutationObserver(muts=>{
    muts.forEach(m=>{
      if(m.type==='attributes' && m.attributeName==='class'){
        const classes = bar.className;
        if(classes.includes('is-dragging')) LOG.info('CLASS: is-dragging ATIVADA');
        if(classes.includes('snap-side')) LOG.ok('CLASS: snap-side ATIVADA → encaixou na ESQUERDA');
        if(classes.includes('snap-side-right')) LOG.ok('CLASS: snap-side-right ATIVADA → encaixou na DIREITA');
        if(classes.includes('snap-top')) LOG.ok('CLASS: snap-top ATIVADA → encaixou no TOPO');
        if(classes.includes('snap-bottom')) LOG.ok('CLASS: snap-bottom ATIVADA → encaixou na BASE');
        if(classes.includes('floating')) LOG.info('CLASS: floating ATIVADA → solto no meio');
      }
      if(m.type==='attributes' && (m.attributeName==='style' || m.attributeName==='left' || m.attributeName==='top')){
        const st = bar.style;
        if(st.left || st.top || st.right || st.bottom){
          LOG.info('STYLE mudou', {
            left: st.left, top: st.top, right: st.right, bottom: st.bottom,
            transform: st.transform
          });
        }
      }
    });
  });
  obs.observe(bar, {attributes:true, attributeFilter:['class','style']});
  LOG.ok('MutationObserver ativo monitorando #symbolBar');

  /* ── 5. INTERCEPTAR snapBar ── */
  if(typeof snapBar === 'function'){
    const _origSnap = snapBar;
    window.snapBar = function(){
      const r = bar.getBoundingClientRect();
      const W = window.innerWidth, H = window.innerHeight;
      const cx = r.left + r.width/2;
      const cy = r.top + r.height/2;
      const dl = cx, dr = W-cx, dt = cy, db = H-cy;

      LOG.info('snapBar() CHAMADO', {
        rect: {left:r.left, top:r.top, width:r.width, height:r.height},
        centro: {cx:cx.toFixed(1), cy:cy.toFixed(1)},
        distancias: {esquerda:dl.toFixed(1), direita:dr.toFixed(1), topo:dt.toFixed(1), base:db.toFixed(1)},
        limiares: 'esq<60 | dir<60 | topo<60 | base<90'
      });

      const result = _origSnap.apply(this, arguments);

      const afterRect = bar.getBoundingClientRect();
      const snapClass = Array.from(bar.classList).find(c=>c.startsWith('snap-')) || 'floating';
      LOG.ok('snapBar() RESULTADO', {
        classeAplicada: snapClass,
        posicaoFinal: {left:afterRect.left.toFixed(1), top:afterRect.top.toFixed(1)}
      });

      window.__kblxDebug.snapHistory.push({
        time: performance.now(),
        before: {left:r.left, top:r.top},
        after: {left:afterRect.left, top:afterRect.top},
        snapClass: snapClass
      });

      return result;
    };
    LOG.ok('snapBar() interceptado com sucesso');
  } else {
    LOG.err('snapBar() NÃO ENCONTRADO! O script original pode não ter carregado.');
  }

  /* ── 6. INTERCEPTAR initBarPosition ── */
  if(typeof initBarPosition === 'function'){
    const _origInit = initBarPosition;
    window.initBarPosition = function(){
      LOG.info('initBarPosition() CHAMADO');
      const result = _origInit.apply(this, arguments);
      const r = bar.getBoundingClientRect();
      LOG.ok('initBarPosition() RESULTADO', {left:r.left, top:r.top, right:r.right, bottom:r.bottom});
      return result;
    };
  }

  /* ── 7. INTERCEPTAR createDragHandle ── */
  if(typeof createDragHandle === 'function'){
    const _origCreate = createDragHandle;
    window.createDragHandle = function(){
      LOG.info('createDragHandle() CHAMADO');
      const result = _origCreate.apply(this, arguments);
      const h = bar.querySelector('.sb-drag-handle');
      if(h) LOG.ok('createDragHandle() → handle criado', {exists:true, zIndex:getComputedStyle(h).zIndex});
      else LOG.err('createDragHandle() → handle NÃO foi criado!');
      return result;
    };
  }

  /* ── 8. LOG DE EVENTOS GLOBAIS ── */
  window.addEventListener('pointermove', e=>{
    if(window.__kblxDebug?.isDragging){
      LOG.evt('pointermove (drag ativo)', {x:e.clientX, y:e.clientY});
    }
  });

  window.addEventListener('pointerup', e=>{
    if(window.__kblxDebug?.isDragging){
      LOG.evt('pointerup (fim do drag)', {x:e.clientX, y:e.clientY});
      window.__kblxDebug.isDragging = false;
    }
  });

  /* ── 9. DETECTAR SE O DRAG ESTÁ SENDO BLOQUEADO ── */
  setTimeout(()=>{
    const allPointerDown = getEventListeners?.(bar)?.pointerdown || [];
    LOG.info('Listeners de pointerdown em #symbolBar', {count: allPointerDown.length});
    if(allPointerDown.length === 0){
      LOG.warn('NENHUM listener pointerdown encontrado em #symbolBar! Verifique se o script original carregou.');
    }
  }, 1000);

  /* ── 10. COMANDO DE DIAGNÓSTICO RÁPIDO ── */
  window.kblxDiag = function(){
    const r = bar.getBoundingClientRect();
    const cs = getComputedStyle(bar);
    console.table({
      '#symbolBar existe': !!bar,
      'Classe atual': bar.className,
      'Posição left': bar.style.left || cs.left,
      'Posição top': bar.style.top || cs.top,
      'Posição right': bar.style.right || cs.right,
      'Transform': bar.style.transform || cs.transform,
      'Z-index': cs.zIndex,
      'Pointer-events': cs.pointerEvents,
      'Touch-action': cs.touchAction,
      'Width': bar.offsetWidth,
      'Height': bar.offsetHeight,
      'Drag handle existe': !!bar.querySelector('.sb-drag-handle'),
      'sbDragging global': typeof sbDragging !== 'undefined' ? sbDragging : 'undefined',
      'Histórico de snaps': window.__kblxDebug.snapHistory.length
    });
    LOG.ok('Diagnóstico completo ↑↑↑');
  };

  LOG.ok('PATCH DE DEBUG APLICADO. Digite kblxDiag() no console para relatório completo.');
})();
