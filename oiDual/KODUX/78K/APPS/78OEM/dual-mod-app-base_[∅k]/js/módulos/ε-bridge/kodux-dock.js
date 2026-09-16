/* ═══════════════════════════════════════════════════════════
   §DOCK · kodux-dock · Ponto Único de Minimizar
   Arquétipo: KODUX · Prefixo: kodux_
   ═══════════════════════════════════════════════════════════ */
(function(){
"use strict";

window.kodux_minimize_to_dock = function(el, opts){
  opts = opts || {};
  if (!el || el.classList.contains('minimized')) return null;

  const title = opts.title
    || el.dataset?.sessionTitle
    || el.querySelector?.('.genus_mxp-title')?.textContent
    || el.querySelector?.('[data-part="title"]')?.textContent
    || 'SESSION';

  el.classList.add('minimized');
  if (typeof opts.onMinimize === 'function') opts.onMinimize();

  const bubble = document.createElement('button');
  bubble.type = 'button';
  bubble.className = 'rhea_dock-bubble';
  bubble.textContent = '۞';
  bubble.title = title;

  bubble.addEventListener('click', () => {
    el.classList.remove('minimized');
    if (typeof opts.onRestore === 'function') opts.onRestore();
    bubble.remove();
  });

  document.getElementById('rhea_dock')?.appendChild(bubble);
  return bubble;
};

console.log('[kodux-dock] online · dock unificado');
})();
