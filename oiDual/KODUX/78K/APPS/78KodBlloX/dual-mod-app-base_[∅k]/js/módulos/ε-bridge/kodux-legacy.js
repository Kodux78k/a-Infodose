/* ═══════════════════════════════════════════════════════════
   §LEGACY · kodux-legacy · O Detector da Ponte
   Arquétipo: KODUX · Prefixo: kodux_
   Depende: genus-mxp, rhea-janelas, kodux-section-adapter
   ═══════════════════════════════════════════════════════════ */
(function(){
"use strict";

/* ─── 1 · detectar se legacy (iFSw) está ativo ─── */
window.__LEGACY_SESSION_BOUND =
  !!(window.iFSw || window.IFSW || window.InfodoseBase || window.SessionWindow);

console.log('[kodux-legacy] legacy-bound =', window.__LEGACY_SESSION_BOUND);

/* ─── 2 · garantir host stack ─── */
(function kodux_ensure_stack_host(){
  if(document.getElementById('rhea_stack')) return;
  const wrap = document.createElement('div');
  wrap.id = 'rhea_stack';
  wrap.dataset.sessionHost = 'stack';
  const shell = document.querySelector('.genus_almasliber .genus_shell');
  if(shell) shell.appendChild(wrap);
  console.log('[kodux-legacy] rhea_stack criado no shell');
})();

/* ─── 3 · se legacy existir, delegar createSession ─── */
(function kodux_bridge_create(){
  const _orig = window.genus_mxp?.createSession?.bind(window.genus_mxp);

  if(_orig && window.__LEGACY_SESSION_BOUND && typeof window.createSession === 'function'){
    window.genus_mxp.createSession = function(name){
      try{
        const s = _orig(name);
        document.dispatchEvent(new CustomEvent('mxp:session-created', {detail:{session:s}}));
        return s;
      }catch(e){
        console.warn('[kodux-legacy] createSession legacy', e);
        return _orig(name);
      }
    };
    console.log('[kodux-legacy] createSession delegado ao legacy');
  }
})();

/* ─── 4 · ouvir eventos do legacy ─── */
['ifsw:session-open', 'legacy:session-open', 'session:open'].forEach(ev=>{
  document.addEventListener(ev, e=>{
    const url = e.detail?.url;
    if(url && window.genus_mxp?.createSession){
      window.genus_mxp.createSession(e.detail?.name || 'legacy');
    }
  });
});

/* ─── 5 · sincronizar URL bar ─── */
document.getElementById('atlas_gobtn')?.addEventListener('click', ()=>{
  const inp = document.getElementById('atlas_urlbar');
  const url = inp?.value?.trim();
  if(!url) return;
  const active = document.querySelector('.rhea_session-window:not(.solus_minimized) .rhea_win-frame');
  if(active){
    let u = url;
    if(!/^https?:\/\//i.test(u) && !u.startsWith('about:')) u = 'https://' + u;
    active.src = u;
  }
});

/* ─── 6 · reaplicar adapter para novas sections ─── */
window.addEventListener('load', ()=>{
  setTimeout(()=>window.kodux_section_adapter?.boot?.(), 100);
});

console.log('[kodux-legacy] online · a ponte está tecida');
})();