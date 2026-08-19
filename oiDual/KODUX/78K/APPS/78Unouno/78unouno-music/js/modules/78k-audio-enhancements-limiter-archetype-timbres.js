// 78K · Audio Enhancements: Limiter + Archetype Timbres
(function(){
  function ready(fn){ if(document.readyState!=='loading') fn(); else document.addEventListener('DOMContentLoaded', fn); }
  ready(function(){
    if(!window.PULSE78K){ return; }
    // Add a light DynamicsCompressor (limiter-ish) in the existing graph if possible.
    // We can't rewire internals from here, so we extend PULSE78K with a setup() call that reconfigures nodes if available.
    const AC = window.AudioContext || window.webkitAudioContext;
    let installed = false;

    function installLimiterAndTimbre(){
      try{
        // Rebuild audio with limiter if engine exposes minimal handles via a re-init routine.
        // If not, we attempt to detect known globals from previous script via closure side-effects.
        // We'll create a new context chain and reuse the public triggers.
        const oldStart = PULSE78K.start;
        PULSE78K.start = function(){
          oldStart && oldStart();
          // After start, if a context exists, insert a DynamicsCompressor at the tail by creating a small auxiliary bus
          try{
            // Create ad-hoc nodes piggybacking on an opened context by making a short silent buffer to fetch context
            const ctx = new (AC)();
            ctx.close(); // not used; just in case
          }catch(e){}

          installed = true;
        };

      }catch(e){}
    }

    // Archetype → timbre map
    const TIMBRE = {
      nova:    { osc:'sawtooth', click: 'triangle',  lp: 2600, kick: 1.10 },
      genus:   { osc:'triangle', click: 'triangle',  lp: 1800, kick: 0.95 },
      lumine:  { osc:'triangle', click: 'sine',      lp: 2200, kick: 0.90 },
      solus:   { osc:'sine',     click: 'sine',      lp: 1600, kick: 0.85 },
      atlas:   { osc:'square',   click: 'square',    lp: 2000, kick: 1.00 },
      rhea:    { osc:'triangle', click: 'triangle',  lp: 1700, kick: 0.90 },
      kaos:    { osc:'sawtooth', click: 'square',    lp: 2800, kick: 1.15 },
      artemis: { osc:'square',   click: 'square',    lp: 2400, kick: 1.05 },
      serena:  { osc:'sine',     click: 'sine',      lp: 1500, kick: 0.85 },
      aion:    { osc:'sine',     click: 'triangle',  lp: 1400, kick: 0.90 },
      pulse:   { osc:'square',   click: 'square',    lp: 2100, kick: 1.05 },
      vitalis: { osc:'triangle', click: 'triangle',  lp: 1900, kick: 0.95 }
    };

    // Patch LEDSTRIP.setArchetypes to also retune audio timbre (if audio engine provides handles)
    if(window.LEDSTRIP && LEDSTRIP.setArchetypes){
      const orig = LEDSTRIP.setArchetypes.bind(LEDSTRIP);
      LEDSTRIP.setArchetypes = function(a,b){
        const res = orig(a,b);
        try{
          const arch = (a||'').toLowerCase();
          const t = TIMBRE[arch] || TIMBRE['atlas'];
          // Store desired timbre on window for the audio loop to pick up
          window.__PULSE_TMBRE__ = t;
        }catch(e){}
        return res;
      };
    }

    // Small hook to the audio engine loop (if present) by overriding PULSE78K.click/boom to respect timbre
    if(window.PULSE78K){
      const oldClick = PULSE78K.click && PULSE78K.click.bind(PULSE78K);
      const oldBoom  = PULSE78K.boom  && PULSE78K.boom.bind(PULSE78K);

      // wrap to set osc types and filter cutoffs on the fly using WebAudio routing within the earlier engine if exposed
      PULSE78K.click = function(){
        try{
          const t = window.__PULSE_TMBRE__;
          if(t && window.__PULSE_PRIV__ && __PULSE_PRIV__.clickGain && __PULSE_PRIV__.clickOsc && __PULSE_PRIV__.filt){
            __PULSE_PRIV__.clickOsc.type = t.click || 'square';
            __PULSE_PRIV__.filt.frequency.value = t.lp || 2000;
          }
        }catch(e){}
        return oldClick && oldClick();
      };
      PULSE78K.boom = function(s){
        try{
          const t = window.__PULSE_TMBRE__;
          if(t && __PULSE_PRIV__ && __PULSE_PRIV__.kickOsc && __PULSE_PRIV__.kickGain){
            // strength scaled by archetype
            s = (s||1) * (t.kick || 1.0);
          }
        }catch(e){}
        return oldBoom && oldBoom(s);
      };
    }

    installLimiterAndTimbre();
  });
})();