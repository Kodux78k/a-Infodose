(function(){
"use strict";

/* 1) Detectar se legacy está ativo (exports típicos de iFSw-base-full.js) */
window.__LEGACY_SESSION_BOUND =
  !!(window.iFSw || window.IFSW || window.InfodoseBase || window.SessionWindow);

/* 2) Expor stackWrap como host "stack" para o MXP já existente.
      O elemento #stackWrap já existe no HTML (wrapper .almasliber) */
(function ensureStackHost(){
  if(document.getElementById('stackWrap')) return;
  const wrap = document.createElement('div');
  wrap.id = 'stackWrap';
  wrap.dataset.sessionHost = 'stack';
  const shell = document.querySelector('.almasliber .shell');
  if(shell) shell.appendChild(wrap);
})();

/* 3) Quando MXP cria uma session, delegar ao legacy se disponível.
      Assim "＋ NOVA SESSION" usa a mesma engine do iFSw-base-full.js. */
const _origCreate = window.MXP?.createSession?.bind(window.MXP);
if(_origCreate && window.__LEGACY_SESSION_BOUND && typeof window.createSession === 'function'){
  window.MXP.createSession = function(name){
    try{
      const s = _origCreate(name);
      // notificar o legacy para montar o chrome dele no novo win
      document.dispatchEvent(new CustomEvent('mxp:session-created', {detail:{session:s}}));
      return s;
    }catch(e){ console.warn('[bridge] createSession legacy', e); return _origCreate(name); }
  };
}

/* 4) Escutar eventos de session vindos do legacy (se ele emitir) */
['ifsw:session-open','legacy:session-open','session:open'].forEach(ev=>{
  document.addEventListener(ev, e=>{
    const url = e.detail?.url;
    if(url && window.MXP?.createSession) window.MXP.createSession(e.detail?.name || 'legacy');
  });
});

/* 5) Sincronizar URL bar global com a session ativa (já feito pelo MXP,
      mas garantimos caso o legacy também escute) */
document.getElementById('goNavBtn')?.addEventListener('click', ()=>{
  const inp = document.getElementById('urlInputNav');
  const url = inp?.value?.trim();
  if(!url) return;
  // legacy pode ter seu próprio frame; MXP cuida do iframe ativo
  const active = document.querySelector('.session-window:not(.minimized) .win-frame');
  if(active){
    let u = url; if(!/^https?:\/\//i.test(u) && !u.startsWith('about:')) u = 'https://'+u;
    active.src = u;
  }
});

console.log('[BRIDGE] legacy-bound =', window.__LEGACY_SESSION_BOUND);
})();