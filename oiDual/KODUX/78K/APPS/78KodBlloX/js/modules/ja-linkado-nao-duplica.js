/* ═══════════════════════════════════════════════════════════
   DOCK UNIFICADO — ponto único de minimizar/criar-bubble.
   Antes existiam 3 handlers de "minimizar" (handleSessionAction,
   sessionize() e a ação MXP "session:minimize") e só UM deles
   criava a dock-bubble. Os outros só escondiam a window (sem
   bubble, sem volta). Agora os três chamam esta função.
   ═══════════════════════════════════════════════════════════ */
/* ── identidade única: toda session-window (dinâmica §G ou
   estática #s0..#s3) responde por data-session-id. O dock guarda
   {id:title} em localStorage (kobllux:dock) — ao recarregar, tanto
   a classe "minimized" quanto a bubble no #dock voltam juntas, pra
   nenhuma window sumir sem deixar rastro. ── */
var KBLX_DOCK_KEY = (window.KBLX_NS || 'kobllux') + ':dock';

function kblxDockRead(){
  try { return JSON.parse(localStorage.getItem(KBLX_DOCK_KEY)) || {}; }
  catch(_){ return {}; }
}
function kblxDockWrite(map){
  try { localStorage.setItem(KBLX_DOCK_KEY, JSON.stringify(map)); } catch(_){}
}
function kblxDockSet(id, title){
  var map = kblxDockRead(); map[id] = { title: title || id, t: Date.now() }; kblxDockWrite(map);
}
function kblxDockRemove(id){
  var map = kblxDockRead(); delete map[id]; kblxDockWrite(map);
}
function kblxEnsureSessionId(el){
  if (!el.dataset.sessionId) el.dataset.sessionId = el.id || ('sess-' + Math.random().toString(36).slice(2,9));
  return el.dataset.sessionId;
}
function kblxCreateBubble(id, title){
  if (!id) return null;
  if (document.querySelector('.dock-bubble[data-session-id="'+id+'"]')) return null; /* já linkado — não duplica */
  var bubble = document.createElement('button');
  bubble.type = 'button';
  bubble.className = 'dock-bubble';
  bubble.dataset.sessionId = id;
  bubble.textContent = '۞';
  bubble.title = title || id;
  bubble.addEventListener('click', function(){
    var el = document.querySelector('[data-session-id="'+id+'"]:not(.dock-bubble)');
    if (el) el.classList.remove('minimized');
    if (typeof bubble._onRestore === 'function'){
      bubble._onRestore();
    } else {
      var s = window.MXP?.state?.sessions?.find(function(x){ return x.id === id; });
      if (s){ s.minimized = false; window.MXP?.save?.(); }
    }
    document.dispatchEvent(new CustomEvent('kblx:session-restored', { detail:{ id: id, el: el } }));
    kblxDockRemove(id);
    bubble.remove();
    window.KBLX_syncLooseWithDock?.();
  });
  document.getElementById('dock')?.appendChild(bubble);
  window.KBLX_syncLooseWithDock?.();
  return bubble;
}

/* v14 — "loose reflete docked": cada bubble no #dock ganha um espelho
   clicável no slot "loose" do symbol bar, pra dar foco na window
   minimizada sem precisar abrir o dock separado. Roda sempre que uma
   bubble é criada/removida (chamadas acima), então não precisa de
   polling nem MutationObserver. */
window.KBLX_syncLooseWithDock = function(){
  const slot = document.querySelector('[data-slot="loose"]');
  const dock = document.getElementById('dock');
  if (!slot || !dock) return;
  slot.querySelectorAll('[data-dock-mirror="1"]').forEach(el => el.remove());
  dock.querySelectorAll('.dock-bubble').forEach(bubble=>{
    const id = bubble.dataset.sessionId;
    if (!id) return;
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'mxp-btn';
    btn.dataset.dockMirror = '1';
    btn.dataset.sessionId = id;
    btn.title = 'Focar: ' + (bubble.title || id);
    btn.innerHTML = `<span class="mxp-icon">◉</span><span class="mxp-label">${bubble.title || id}</span>`;
    btn.addEventListener('click', ()=> bubble.click());
    slot.appendChild(btn);
  });
};

window.KBLX_minimizeToDock = function(el, opts){
  opts = opts || {};
  if(!el || el.classList.contains('minimized')) return null;
  var id = kblxEnsureSessionId(el);
  var title = opts.title
    || el.dataset?.sessionTitle
    || el.querySelector?.('.mxp-title')?.textContent
    || el.querySelector?.('[data-part="title"]')?.textContent
    || id;
  el.classList.add('minimized');
  if(typeof opts.onMinimize === 'function') opts.onMinimize();
  kblxDockSet(id, title);
  var bubble = kblxCreateBubble(id, title);
  if (bubble && typeof opts.onRestore === 'function') bubble._onRestore = opts.onRestore;
  return bubble;
};

/* Chamado no boot (depois do KBLX_LOAD) — devolve pro dock qualquer
   bubble cujo estado sobreviveu ao reload, e "cura" sessions que já
   estavam minimized sem registro (saves antigos, migração). */
window.KBLX_restoreDockOnBoot = function(){
  var map = kblxDockRead();
  Object.keys(map).forEach(function(id){
    var el = document.querySelector('[data-session-id="'+id+'"]:not(.dock-bubble)');
    if (el) el.classList.add('minimized');
    kblxCreateBubble(id, map[id]?.title);
  });
  document.querySelectorAll('[data-session-id].minimized').forEach(function(el){
    var id = el.dataset.sessionId;
    if (!id || map[id]) return;
    var title = el.dataset.sessionTitle
      || el.querySelector?.('.mxp-title')?.textContent
      || el.querySelector?.('[data-part="title"]')?.textContent
      || id;
    kblxDockSet(id, title);
    kblxCreateBubble(id, title);
  });
  window.KBLX_syncLooseWithDock?.();
};