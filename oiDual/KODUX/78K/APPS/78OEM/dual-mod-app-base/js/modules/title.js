/* ═══════════════════════════════════════════════════════════
   DOCK UNIFICADO — ponto único de minimizar/criar-bubble.
   Antes existiam 3 handlers de "minimizar" (handleSessionAction,
   sessionize() e a ação MXP "session:minimize") e só UM deles
   criava a dock-bubble. Os outros só escondiam a window (sem
   bubble, sem volta). Agora os três chamam esta função.
   ═══════════════════════════════════════════════════════════ */
window.KBLX_minimizeToDock = function(el, opts){
  opts = opts || {};
  if(!el || el.classList.contains('minimized')) return null;
  var title = opts.title
    || el.dataset?.sessionTitle
    || el.querySelector?.('.mxp-title')?.textContent
    || el.querySelector?.('[data-part="title"]')?.textContent
    || 'SESSION';
  el.classList.add('minimized');
  if(typeof opts.onMinimize === 'function') opts.onMinimize();

  var bubble = document.createElement('button');
  bubble.type = 'button';
  bubble.className = 'dock-bubble';
  bubble.textContent = '۞';
  bubble.title = title;

  bubble.addEventListener('click', function(){
    el.classList.remove('minimized');
    if(typeof opts.onRestore === 'function') opts.onRestore();
    bubble.remove();
  });

  document.getElementById('dock')?.appendChild(bubble);
  return bubble;
};