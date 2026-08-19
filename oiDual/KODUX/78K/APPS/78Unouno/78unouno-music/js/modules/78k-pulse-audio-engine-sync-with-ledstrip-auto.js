// 78K · Pulse Audio Engine — sync with LEDSTRIP (auto)
(function(){
  const AC = window.AudioContext || window.webkitAudioContext;
  let ac = null, master=null, busGain=null, kick=null, clickGain=null, filt=null, reverb=null, reverbGain=null;
  let started = false;
  let bpm = 78; // base symbolic tempo
  let lastActivity = 0;

  function initAudio(){
    if(ac) return;
    ac = new AC();
    master = ac.createGain(); master.gain.value = 0.6; master.connect(ac.destination);
    // light reverb
    reverb = ac.createConvolver(); reverb.buffer = makeImpulse(ac, 2.0, 2.2);
    reverbGain = ac.createGain(); reverbGain.gain.value = 0.18; reverb.connect(reverbGain); reverbGain.connect(master);

    busGain = ac.createGain(); busGain.gain.value = 1.0; busGain.connect(master);
    filt = ac.createBiquadFilter(); filt.type='lowpass'; filt.frequency.value = 1400; filt.connect(busGain);

    // click osc for ENG/HR ticks
    const clickOsc = ac.createOscillator(); clickOsc.type='square'; clickGain = ac.createGain();
    clickGain.gain.value = 0.0;
    clickOsc.connect(clickGain); clickGain.connect(filt);
    clickOsc.start();

    // kick synth for loop phases
    kick = { g: ac.createGain(), o: ac.createOscillator() };
    kick.g.gain.value = 0; kick.o.type='sine';
    kick.o.connect(kick.g); kick.g.connect(filt); kick.g.connect(reverb);
    kick.o.start();

    // bootstrap flag
    started = true;
    window.dispatchEvent(new CustomEvent('pulse:ready'));
  }

  // Tiny impulse response for reverb
  function makeImpulse(ac, seconds=2, decay=2){
    const rate=ac.sampleRate, len=rate*seconds; const b=ac.createBuffer(2,len,rate);
    for(let ch=0; ch<2; ch++){
      const d=b.getChannelData(ch);
      for(let i=0;i<len;i++){ d[i]=(Math.random()*2-1)*Math.pow(1-i/len, decay); }
    }
    return b;
  }

  // Guards autoplay: start/resume on first user gesture
  function ensureStart(){
    try{ initAudio(); ac.resume && ac.resume(); }catch(e){}
  }
  ['pointerdown','keydown','touchstart','click'].forEach(ev=>{
    window.addEventListener(ev, ensureStart, {once:true, passive:true});
  });

  // Public triggers
  function tickClick(){
    if(!started) return;
    const t = ac.currentTime;
    clickGain.gain.cancelScheduledValues(t);
    clickGain.gain.setValueAtTime(0.0, t);
    clickGain.gain.linearRampToValueAtTime(0.18, t + 0.002);
    clickGain.gain.exponentialRampToValueAtTime(0.0005, t + 0.06);
  }
  function boomKick(strength=1){
    if(!started) return;
    const t=ac.currentTime;
    // pitch sweep
    const base = 120; const top = 220 + 180*strength;
    kick.o.frequency.cancelScheduledValues(t);
    kick.o.frequency.setValueAtTime(top, t);
    kick.o.frequency.exponentialRampToValueAtTime(base, t + 0.28);
    // amp env
    kick.g.gain.cancelScheduledValues(t);
    kick.g.gain.setValueAtTime(0.0001, t);
    kick.g.gain.exponentialRampToValueAtTime(0.9*strength, t + 0.01);
    kick.g.gain.exponentialRampToValueAtTime(0.0001, t + 0.32);
  }

  // LEDSTRIP hooks: clicks for ENG/HR; kick on loop phase
  function installHooks(){
    if(!window.LEDSTRIP) return;
    // wrap existing methods
    const pENG = LEDSTRIP.pulseENG && LEDSTRIP.pulseENG.bind(LEDSTRIP);
    const pHR  = LEDSTRIP.pulseHR  && LEDSTRIP.pulseHR.bind(LEDSTRIP);
    const setLoop = LEDSTRIP.setLoopPhase && LEDSTRIP.setLoopPhase.bind(LEDSTRIP);

    if(pENG){
      LEDSTRIP.pulseENG = function(){
        tickClick(); lastActivity = Date.now();
        return pENG();
      };
    }
    if(pHR){
      LEDSTRIP.pulseHR = function(){
        tickClick(); lastActivity = Date.now();
        return pHR();
      };
    }
    if(setLoop){
      LEDSTRIP.setLoopPhase = function(name){
        const strength = (name==='Liberação')? 1.0 : (name==='Tensão'? 0.85 : (name==='Progresso'?0.7:0.55));
        boomKick(strength);
        return setLoop(name);
      };
    }
  }

  // Auto pulse scheduler: sync visual + audio at BPM, speed follows activity
  let rafId = null, lastBeat = 0;
  function loop(){
    rafId = requestAnimationFrame(loop);
    if(!started) return;
    const now = ac.currentTime;
    // activity -> bpm range: 68 .. 112
    let act = 0;
    if(window.LEDSTRIP && LEDSTRIP.getActivity){
      const a = LEDSTRIP.getActivity(); act = Math.min(24, (a?.total||0));
    } else {
      // fallback: based on recency of interactions
      const dt = Date.now() - lastActivity;
      act = dt<3000 ? 12 : dt<8000 ? 6 : 0;
    }
    const bpmNow = 68 + (act/24)*(112-68);
    if(Math.abs(bpmNow - bpm) > 0.1) bpm = bpmNow;

    const spb = 60 / bpm; // seconds per beat
    if(now - lastBeat >= spb){
      lastBeat += spb;
      // audio tick + small visual pulses if available
      tickClick();
      try{ LEDSTRIP.pulseHR(); }catch(e){}
    }
  }

  // expose diagnostics
  window.PULSE78K = {
    start: ensureStart,
    boom: (s)=>boomKick(s||1),
    click: tickClick,
    bpm: ()=>bpm
  };

  // init
  installHooks();
  loop();
})();