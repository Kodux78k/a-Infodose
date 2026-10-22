/* @kob-mod 073 · kob-glass-pref-v1 · body */

/* [V5.12] intensidade do backdrop das session windows (Cockpit ▸ Avançado · preferências). 0 = sem blur. */
(function(){
  'use strict';
  var KEY='kob:glass:blur', root=document.documentElement;
  function get(){ try{ var v=parseInt(localStorage.getItem(KEY),10); return isNaN(v)?14:Math.max(0,Math.min(32,v)); }catch(e){ return 14; } }
  function paint(n){
    root.style.setProperty('--kob-glass-blur',n+'px');
    if(n===0) root.setAttribute('data-glass','off'); else root.removeAttribute('data-glass');
    var sl=document.getElementById('glassBlur'), lb=document.getElementById('val-glass');
    if(sl&&String(sl.value)!==String(n)) sl.value=n;
    if(lb) lb.textContent=n===0?'off':n+'px';
  }
  function set(n,persist){ n=Math.max(0,Math.min(32,parseInt(n,10)||0)); paint(n); if(persist!==false){ try{ localStorage.setItem(KEY,String(n)); }catch(e){} } return n; }
  var sl=document.getElementById('glassBlur');
  if(sl&&!sl.dataset.kobBound){ sl.dataset.kobBound='1'; sl.addEventListener('input',function(){ set(sl.value); }); }
  paint(get());
  window.KOBGlass={get:get,set:set};
})();
