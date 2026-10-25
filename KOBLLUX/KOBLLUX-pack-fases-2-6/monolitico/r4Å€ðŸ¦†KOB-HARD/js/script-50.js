
/* Botão VIEWPORT (⊡/⊟) no symbolBar — na edição Lite o "viewport" é a área de conteúdo (hero + trinity + seções).
   Mostra/oculta tudo para deixar só headers, card, symbolBar e sessions. Estado salvo em kob:viewport:off.
   Reativa o item "VIEWPORT" do catálogo (click('#toggleViewportBtn')). */
(function KOBViewport(){
  'use strict';
  if (window.KOBViewport) return;
  var KEY='kob:viewport:off', root=document.documentElement;
  function toast(m){ try{ window.KBLX_TOAST&&window.KBLX_TOAST(m); }catch(e){} }
  function isOff(){ return root.classList.contains('kob-viewport-off'); }
  function paint(){
    var b=document.getElementById('toggleViewportBtn'); if(!b) return;
    var off=isOff();
    b.textContent=off?'⊟':'⊡';
    b.title=off?'Viewport oculto (toque para mostrar)':'Viewport visível (toque para ocultar)';
    b.setAttribute('aria-pressed',off?'false':'true');
  }
  function set(show,quiet){
    root.classList.toggle('kob-viewport-off',!show);
    try{ localStorage.setItem(KEY,show?'0':'1'); }catch(e){}
    paint(); if(!quiet) toast(show?'⊡ Viewport visível':'⊟ Viewport oculto');
  }
  function toggle(){ set(isOff(),false); }
  try{ if(localStorage.getItem(KEY)==='1') root.classList.add('kob-viewport-off'); }catch(e){}
  /* abrir módulo do Workspace / DualTube com o viewport oculto → mostra de volta */
  var W=window.KOBWorkspace;
  if(W){ ['show','reveal'].forEach(function(fn){ var o=W[fn]; if(typeof o==='function') W[fn]=function(){ if(isOff()) set(true,true); return o.apply(this,arguments); }; }); }
  var nb=document.getElementById('navDualTube'); if(nb) nb.addEventListener('click',function(){ if(isOff()) set(true,true); },true);
  var b=document.getElementById('toggleViewportBtn');
  if(b && !b.dataset.kobBound){ b.dataset.kobBound='1'; b.addEventListener('click',function(e){ e.preventDefault(); e.stopPropagation(); toggle(); }); }
  paint();
  window.KOBViewport={get visible(){ return !isOff(); },show:function(){ set(true); },hide:function(){ set(false); },toggle:toggle};
})();
