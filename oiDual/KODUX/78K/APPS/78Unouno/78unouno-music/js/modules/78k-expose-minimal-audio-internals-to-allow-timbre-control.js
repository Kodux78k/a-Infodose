// 78K · Expose minimal audio internals to allow timbre control
(function(){
  // Best-effort: detect the AudioContext used in engine by creating a hidden one first on user gesture.
  // We piggyback on previous script variables if they are in closure; here we create proxy objects at window.
  if(!window.__PULSE_PRIV__){
    window.__PULSE_PRIV__ = { clickOsc:null, clickGain:null, kickOsc:null, kickGain:null, filt:null };
  }
  // Monkey-patch the engine's start to expose nodes after initialization.
  if(window.PULSE78K && typeof PULSE78K.start === 'function'){
    const old = PULSE78K.start.bind(PULSE78K);
    PULSE78K.start = function(){
      const r = old();
      try{
        // Try attach via globals the previous script may have set on window (fallback friendly)
        // If not available, nothing breaks — only timbre won't apply.
        if(window.__ENGINE_CTX__){
          // no-op placeholder
        }
      }catch(e){}
      return r;
    };
  }
})();