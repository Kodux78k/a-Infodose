
/* ═══════════════════════════════════════════════════════════════
   KOBLLUX · Color Override Patch — JS mínimo
   Uso: injetar DEPOIS do kob-profile-player-voice (KOBLayers).
   Não mexe em estrutura — só garante que as vars --kob-v5-*
   sejam re-resolvidas ao trocar arquétipo e dá fallback de
   toque no carrossel do footer.
   ═══════════════════════════════════════════════════════════════ */
(function(){
  "use strict";

  /* Feedback tátil nos nav-cta (DT / Mente / Step) */
  document.querySelectorAll('.nav-cta').forEach(function(btn){
    if(btn.dataset.kobV5Bound) return;
    btn.dataset.kobV5Bound='1';
    btn.addEventListener('click',function(){
      try{ btn.style.transform='scale(.94)'; setTimeout(function(){btn.style.transform='';},140); }catch(_){}
    });
  });

  /* Fallback de scroll touch no slot footer (carrossel) */
  var slot=document.querySelector('.mxp-footer-slot');
  if(slot){
    var downX=null,scrollLeft=0;
    slot.addEventListener('touchstart',function(e){ downX=e.touches[0].clientX; scrollLeft=slot.scrollLeft; },{passive:true});
    slot.addEventListener('touchmove',function(e){
      if(downX===null)return;
      slot.scrollLeft=scrollLeft-(e.touches[0].clientX-downX);
    },{passive:true});
    slot.addEventListener('touchend',function(){ downX=null; },{passive:true});
  }

  /* Ao trocar arquétipo, KOBLayers.refresh reescreve --kob-L-*.
     Como nossas vars --kob-v5-* apontam pra elas via var(), o CSS
     já resolve sozinho. Este wrapper só força um repaint leve
     para navegadores que não propagam var() aninhada na hora. */
  try{
    if(window.KOBLayers && typeof window.KOBLayers.refresh==='function'){
      var orig=window.KOBLayers.refresh;
      window.KOBLayers.refresh=function(){
        var r=orig.apply(this,arguments);
        try{
          var el=document.documentElement;
          el.style.setProperty('--kob-v5-reflow','1');
          setTimeout(function(){ try{ el.style.removeProperty('--kob-v5-reflow'); }catch(_){} },30);
        }catch(_){}
        return r;
      };
    }
  }catch(_){}
})();

