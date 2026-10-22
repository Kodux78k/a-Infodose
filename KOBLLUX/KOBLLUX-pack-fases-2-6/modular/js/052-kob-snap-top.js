/* @kob-mod 052 · kob-snap-top · body */

/* Shim KOBSnap · usa o drag/snap NATIVO do Mark 2 (classes snap-top / snap-side / floating,
   posicao em localStorage kob_hud_pos). Serve a MXP Factory e a API publica. */
(function(){
  const bar=document.getElementById('symbolBar');if(!bar)return;
  const save=(x,y)=>{try{localStorage.setItem('kob_hud_pos',JSON.stringify({x,y}))}catch(e){}};
  const cls=c=>{['snap-side','snap-side-right','snap-top','floating'].forEach(k=>bar.classList.remove(k));bar.classList.add(c)};
  window.KOBSnap={
    snapTop(){const y=window.__fcStack?window.__fcStack():0,x=Math.max(0,(innerWidth-bar.offsetWidth)/2);bar.style.left=x+'px';bar.style.top=y+'px';cls('snap-top');save(x,y)},
    reset(){bar.style.left='20px';bar.style.top='120px';cls('snap-side');save(20,120)},
    get state(){return bar.classList.contains('snap-top')?'snap-top':bar.classList.contains('snap-side')?'snap-side':bar.classList.contains('snap-side-right')?'snap-side-right':'floating'}
  };
})();
