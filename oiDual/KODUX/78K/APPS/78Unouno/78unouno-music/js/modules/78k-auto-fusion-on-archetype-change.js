// 78K · Auto Fusion (on archetype change)
(function(){
  if(!window.LEDSTRIP) { return; }

  const fusionBar = document.getElementById('ledstrip-fusion');
  function fusionRitual(duration=3000){
    try{
      const sel = document.getElementById('arch-select');
      const cur = (sel?.value || 'Atlas').replace(/\.html$/,'');
      const idx = sel ? sel.selectedIndex : 0;
      const nxt = sel ? (sel.options[(idx+1) % sel.options.length].value.replace(/\.html$/,'')) : 'Nova';
      LEDSTRIP.setArchetypes(cur, nxt);
    }catch{}

    const steps = [
      {t: 0.00, phase:'Isca'},
      {t: 0.33, phase:'Progresso'},
      {t: 0.66, phase:'Tensão'},
      {t: 1.00, phase:'Liberação'}
    ];
    const t0 = performance.now();
    const startPos = 0; const endPos = 100;
    const raf = (now)=>{
      const dt = Math.min(1, (now - t0) / duration);
      for(const s of steps){
        if(Math.abs(dt - s.t) < 0.02){ LEDSTRIP.setLoopPhase(s.phase); }
      }
      if(fusionBar){
        fusionBar.style.backgroundSize = '200% 100%';
        fusionBar.style.backgroundPosition = (startPos + (endPos-startPos)*dt) + '% 0%';
        fusionBar.style.opacity = String(.62 + .28*Math.sin(dt*Math.PI));
      }
      if(dt < 1){ requestAnimationFrame(raf); }
      else{
        if(fusionBar){
          fusionBar.style.backgroundSize = '';
          fusionBar.style.backgroundPosition = '';
          fusionBar.style.opacity = '.72';
        }
      }
    };
    requestAnimationFrame(raf);
  }

  // Hook on select change & initial load
  function hook(){
    const sel = document.getElementById('arch-select');
    if(!sel) return;
    ['change','input'].forEach(ev => sel.addEventListener(ev, ()=>fusionRitual(2600), {passive:true}));
    // Optional: prev/next buttons if present
    ['arch-prev','arch-next'].forEach(id=>{
      const b = document.getElementById(id);
      b && b.addEventListener('click', ()=>fusionRitual(2600), {passive:true});
    });
    // First-time gentle fusion
    setTimeout(()=>fusionRitual(1800), 300);
  }
  if(document.readyState !== 'loading') hook();
  else document.addEventListener('DOMContentLoaded', hook);
})();