(function(){
"use strict";
window.__LEGACY_SESSION_BOUND = !!(window.iFSw || window.IFSW || window.InfodoseBase || window.SessionWindow);
(function ensureStackHost(){
  if(document.getElementById('stackWrap')) return;
  const wrap = document.createElement('div');
  wrap.id = 'stackWrap'; wrap.dataset.sessionHost = 'stack';
  const shell = document.querySelector('.almasliber .shell');
  if(shell) shell.appendChild(wrap);
})();
const _origCreate = window.MXP?.createSession?.bind(window.MXP);
if(_origCreate && window.__LEGACY_SESSION_BOUND && typeof window.createSession === 'function'){
  window.MXP.createSession = function(name){
    try{ const s = _origCreate(name);
      document.dispatchEvent(new CustomEvent('mxp:session-created', {detail:{session:s}}));
      return s;
    }catch(e){ console.warn('[bridge] createSession legacy', e); return _origCreate(name); }
  };
}
['ifsw:session-open','legacy:session-open','session:open'].forEach(ev=>{
  document.addEventListener(ev, e=>{ const url = e.detail?.url;
    if(url && window.MXP?.createSession) window.MXP.createSession(e.detail?.name || 'legacy'); });
});
document.getElementById('goNavBtn')?.addEventListener('click', ()=>{
  const inp = document.getElementById('urlInputNav');
  const url = inp?.value?.trim(); if(!url) return;
  const active = document.querySelector('.session-window:not(.minimized) .win-frame');
  if(active){ let u = url; if(!/^https?:\/\//i.test(u) && !u.startsWith('about:')) u = 'https://'+u; active.src = u; }
});
console.log('[BRIDGE v14.1] legacy-bound =', window.__LEGACY_SESSION_BOUND);
})();