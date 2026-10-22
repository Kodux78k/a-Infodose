/* @kob-mod 072 · kob-sb-theme-nav-v1 · body */

/* [V5.5] #sbTheme (symbolBar) alterna o tema pelo DualTheme; KOBNavOpen abre URL em session window do MXP. */
(function(){
  'use strict';
  var b=document.getElementById('sbTheme');
  if(b && !b.dataset.kobBound){
    b.dataset.kobBound='1';
    b.addEventListener('click',function(e){
      e.preventDefault(); e.stopPropagation();
      if(window.DualTheme&&typeof window.DualTheme.toggle==='function') window.DualTheme.toggle();
      else { var t=document.getElementById('themeToggle'); if(t) t.click(); }
    });
  }
  /* ── modo de abrir links: 'session' (padrão, nova session) | 'tab' (nova aba na session aberta) ── */
  var MODE_KEY='kob:nav:mode';
  function getMode(){ try{ return localStorage.getItem(MODE_KEY)==='tab'?'tab':'session'; }catch(e){ return 'session'; } }
  function setMode(m){ try{ localStorage.setItem(MODE_KEY,m==='tab'?'tab':'session'); }catch(e){} paintMode(); }
  function paintMode(){
    var nb=document.getElementById('sbNavMode'); if(!nb) return;
    var tab=getMode()==='tab';
    nb.textContent=tab?'⊞':'▣';
    nb.title=tab?'Links: abrir como aba na session aberta (toque para: nova session)':'Links: abrir em nova session (toque para: abas)';
    nb.setAttribute('aria-pressed',tab?'true':'false');
  }
  function toastN(m){ try{ window.KBLX_TOAST&&window.KBLX_TOAST(m); }catch(e){} }
  function pickWindow(){
    var list=[].slice.call(document.querySelectorAll('.session-window[data-session-id],.mxp-window[data-session-id]'))
      .filter(function(w){ return !w.classList.contains('minimized') && !w.hidden; });
    if(!list.length) return null;
    var M=window.MXP, recs=(M&&M.state&&M.state.sessions)||[];
    function isDoc(w){ var r=recs.find(function(s){return s.id===w.dataset.sessionId;}); return !!(r&&r.meta&&r.meta.kind==='doc'); }
    var pool=list.filter(function(w){return !isDoc(w);}); if(!pool.length) pool=list;
    var act=window.DualSession&&window.DualSession.activeWindow;
    if(act&&pool.indexOf(act)>=0) return act;
    var best=pool[0],bz=-1;
    pool.forEach(function(w){ var z=parseInt(getComputedStyle(w).zIndex,10)||0; if(z>=bz){bz=z;best=w;} });
    return best;
  }
  function openInTab(url,title){
    var w=pickWindow(), TS=window.TabStore; if(!w||!TS||typeof TS.addTab!=='function') return null;
    var id=w.dataset.sessionId;
    var t=TS.addTab(id,url,{title:title||undefined});
    if(typeof window.applyTabsToWindow==='function') window.applyTabsToWindow(w,TS.get(id));
    else { var f=w.querySelector('iframe.win-frame'); if(f) f.src=url; }
    var n=(TS.get(id)&&TS.get(id).tabs.length)||1;
    toastN('⊞ aba '+n+' em '+(w.dataset.sessionTitle||(w.querySelector('.mxp-title')||{}).textContent||'session').trim());
    return {mode:'tab',sessionId:id,tab:t,window:w};
  }
  window.KOBNavMode={get:getMode,set:setMode,toggle:function(){ setMode(getMode()==='tab'?'session':'tab'); toastN(getMode()==='tab'?'⊞ Links entram como aba':'▣ Links abrem nova session'); }};
  window.KOBNavOpen=function(url,title,opts){
    opts=opts||{};
    var mode=opts.mode||getMode();
    if(mode==='tab'){ var r=openInTab(url,title); if(r) return Promise.resolve(r); }
    try{ if(window.KOBLLUXWorkspace&&window.KOBLLUXWorkspace.open) return window.KOBLLUXWorkspace.open(url,{title:title||'NAV'}); }catch(e){}
    var M=window.MXP;
    if(M&&typeof M.createSession==='function') return Promise.resolve(M.createSession(title||'NAV',{url:url,meta:{kind:'nav'}}));
    try{ window.open(url,'_blank','noopener'); }catch(e){}
    return Promise.resolve(null);
  };
  var nb=document.getElementById('sbNavMode');
  if(nb && !nb.dataset.kobBound){ nb.dataset.kobBound='1'; nb.addEventListener('click',function(e){ e.preventDefault(); e.stopPropagation(); window.KOBNavMode.toggle(); }); }
  paintMode();
  /* modo aba: symbol-buttons com data-url entram como aba (captura: vem antes dos handlers que criam session) */
  document.addEventListener('click',function(e){
    var b=e.target.closest&&e.target.closest('.symbol-button[data-url]');
    if(!b||b.hasAttribute('data-player-url')||getMode()!=='tab') return;
    var u=String(b.dataset.url||'').trim();
    if(!/^(https?:|blob:|data:)/i.test(u)) return;
    var r=openInTab(u,b.dataset.id||b.title||undefined);
    if(r){ e.preventDefault(); e.stopImmediatePropagation(); }
  },true);
})();
