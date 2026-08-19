// 78K · LED Dots + Pointer + Toaster Enhancer
(function(){
  function ready(fn){ if(document.readyState!=='loading') fn(); else document.addEventListener('DOMContentLoaded', fn); }
  ready(function(){
    const main = document.getElementById('ledstrip-78k');
    if(!main || !window.LEDSTRIP) return;

    // Build dots line (24) and moving pointer
    let dotsWrap = main.querySelector('.dots');
    if(!dotsWrap){
      dotsWrap = document.createElement('div');
      dotsWrap.className = 'dots';
      main.appendChild(dotsWrap);
      for(let i=0;i<24;i++){
        const d = document.createElement('i');
        d.className = 'dot';
        dotsWrap.appendChild(d);
      }
      const ptr = document.createElement('i');
      ptr.className = 'pointer';
      ptr.style.left = '0%';
      main.appendChild(ptr);
    }
    const dots = Array.from(main.querySelectorAll('.dot'));
    const pointer = main.querySelector('.pointer');

    // Toaster
    let toastWrap = document.querySelector('.toast-wrap');
    if(!toastWrap){
      toastWrap = document.createElement('div');
      toastWrap.className = 'toast-wrap';
      document.body.appendChild(toastWrap);
    }
    function toast(msg){
      const t = document.createElement('div');
      t.className = 'toast';
      t.textContent = msg;
      toastWrap.appendChild(t);
      // show
      requestAnimationFrame(()=> t.classList.add('show'));
      // hide
      setTimeout(()=>{
        t.classList.remove('show');
        setTimeout(()=> t.remove(), 250);
      }, 2200);
    }

    // Wrap LEDSTRIP.setArchetypes to show toast and sync colors
    const origSetArch = LEDSTRIP.setArchetypes?.bind(LEDSTRIP);
    if(origSetArch){
      LEDSTRIP.setArchetypes = function(a,b){
        toast('Fusão: ' + (a||'—') + ' × ' + (b||'—'));
        return origSetArch(a,b);
      };
    }

    // Blink logic linked to pulses
    let blinkBudget = 0;
    const origEng = LEDSTRIP.pulseENG?.bind(LEDSTRIP);
    const origHr  = LEDSTRIP.pulseHR?.bind(LEDSTRIP);
    if(origEng){
      LEDSTRIP.pulseENG = function(){
        blinkBudget += 4;
        return origEng();
      };
    }
    if(origHr){
      LEDSTRIP.pulseHR = function(){
        blinkBudget += 3;
        return origHr();
      };
    }

    // Pointer & blinking updater
    let pos = 0;
    setInterval(()=>{
      pos = (pos+1) % 100;
      if(pointer){ pointer.style.left = pos + '%'; }
      // decay dots
      dots.forEach(d=>d.classList.remove('on'));
      // base pattern from loop progress (use LEDSTRIP.getActivity if present for density)
      const activity = (LEDSTRIP.getActivity ? LEDSTRIP.getActivity().total : 0);
      const count = Math.min(24, Math.max(2, Math.round(activity/3)+2));
      for(let k=0;k<count;k++){
        const idx = Math.floor(Math.random()*dots.length);
        dots[idx] && dots[idx].classList.add('on');
      }
      // extra sparkle from blinkBudget
      while(blinkBudget-- > 0){
        const idx = Math.floor(Math.random()*dots.length);
        dots[idx] && dots[idx].classList.add('on');
      }
      blinkBudget = Math.max(0, blinkBudget);
    }, 600);
  });
})();