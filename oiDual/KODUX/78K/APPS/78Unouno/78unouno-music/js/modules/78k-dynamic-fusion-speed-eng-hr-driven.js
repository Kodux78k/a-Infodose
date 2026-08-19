// 78K · Dynamic Fusion Speed (ENG/HR-driven)
(function(){
  function install(){
    if(!window.LEDSTRIP) return false;

    // rolling activity counters with gentle decay
    let engScore = 0, hrScore = 0;
    const origEng = LEDSTRIP.pulseENG?.bind(LEDSTRIP);
    const origHr  = LEDSTRIP.pulseHR?.bind(LEDSTRIP);

    if(origEng){
      LEDSTRIP.pulseENG = function(){ engScore += 2; return origEng(); };
    }
    if(origHr){
      LEDSTRIP.pulseHR = function(){ hrScore += 2; return origHr(); };
    }

    setInterval(()=>{
      engScore = Math.max(0, engScore - 1);
      hrScore  = Math.max(0, hrScore  - 1);
    }, 800);

    // expose for diagnostics
    LEDSTRIP.getActivity = () => ({eng: engScore, hr: hrScore, total: engScore + hrScore});

    // hook auto-fusion to use dynamic duration (override if previous was installed)
    const fusionBar = document.getElementById('ledstrip-fusion');

    function fusionRitualDynamic(){
      // map activity → duration (ms)
      // low activity -> slower (3200ms), high activity -> faster (1400ms)
      const total = Math.min(24, (engScore + hrScore));
      const duration = Math.round(3200 - (total/24)*1800); // 3200..1400

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
      const startPos = 0, endPos = 100;

      const raf = (now)=>{
        const dt = Math.min(1, (now - t0) / duration);
        for(const s of steps){ if(Math.abs(dt - s.t) < 0.02){ LEDSTRIP.setLoopPhase(s.phase); } }
        if(fusionBar){
          fusionBar.style.backgroundSize = '200% 100%';
          fusionBar.style.backgroundPosition = (startPos + (endPos-startPos)*dt) + '% 0%';
          fusionBar.style.opacity = String(.62 + .28*Math.sin(dt*Math.PI));
        }
        if(dt < 1){ requestAnimationFrame(raf); }
        else if(fusionBar){
          fusionBar.style.backgroundSize = '';
          fusionBar.style.backgroundPosition = '';
          fusionBar.style.opacity = '.72';
        }
      };
      requestAnimationFrame(raf);
    }

    // attach to select & prev/next (replace previous listeners by adding ours on capture phase)
    function wire(){
      const sel = document.getElementById('arch-select');
      sel && ['change','input'].forEach(ev => sel.addEventListener(ev, fusionRitualDynamic, {passive:true, capture:true}));
      ['arch-prev','arch-next'].forEach(id=>{
        const b = document.getElementById(id);
        b && b.addEventListener('click', fusionRitualDynamic, {passive:true, capture:true});
      });
      // initial run uses current activity too
      setTimeout(fusionRitualDynamic, 350);
    }
    wire();
    return true;
  }

  if(document.readyState !== 'loading'){
    install() || setTimeout(install, 200);
  }else{
    document.addEventListener('DOMContentLoaded', ()=>install() || setTimeout(install, 200));
  }
})();