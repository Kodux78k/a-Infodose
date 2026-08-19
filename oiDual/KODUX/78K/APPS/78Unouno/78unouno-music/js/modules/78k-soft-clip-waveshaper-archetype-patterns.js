// 78K · Soft-Clip Waveshaper + Archetype Patterns
(function(){
  const AC = window.AudioContext || window.webkitAudioContext;
  function ready(fn){ if(document.readyState!=='loading') fn(); else document.addEventListener('DOMContentLoaded', fn); }

  // Euclidean rhythm generator
  function euclid(steps, pulses){
    let pattern = new Array(steps).fill(0);
    for(let i=0;i<pulses;i++){ pattern[Math.floor(i*steps/pulses)] = 1; }
    return pattern;
  }

  // 12 archetype rhythmic signatures (bars of 16 steps)
  const RHYTHM = {
    atlas:   euclid(16, 4),        // straight 4
    nova:    euclid(16, 5),        // shimmering 5
    genus:   euclid(16, 3),        // explorer 3
    lumine:  [1,0,0,1,0,0,1,0, 0,1,0,0,1,0,0,0], // skewed light
    solus:   [1,0,0,0, 0,0,1,0, 0,0,0,1, 0,0,0,0],
    rhea:    euclid(16, 2),        // gentle 2
    kaos:    [1,1,0,1, 0,1,1,0, 1,0,1,1, 0,1,0,1], // bursty
    artemis: [1,0,1,0, 0,1,0,1, 1,0,1,0, 0,1,0,1], // martial
    serena:  [1,0,0,1, 0,0,1,0, 0,1,0,0, 1,0,0,0], // waltz-ish
    aion:    [1,0,0,0, 1,0,0,0, 1,0,0,0, 1,0,0,0], // clock
    pulse:   [1,0,1,0, 1,0,1,0, 1,0,1,0, 1,0,1,0], // 8ths
    vitalis: euclid(16, 6)         // energetic 6
  };

  // Soft-clip waveshaper curve
  function makeSoftClipCurve(amount=0.8, n=2048){
    const k = amount * 10; // intensity
    const curve = new Float32Array(n);
    for(let i=0;i<n;i++){
      const x = (i/(n-1))*2-1;
      curve[i] = Math.tanh(k * x) / Math.tanh(k);
    }
    return curve;
  }

  // Install soft clip + rhythmic scheduler on top of existing engine
  ready(function(){
    if(!window.PULSE78K || !window.LEDSTRIP) return;

    // Build soft clipper if possible by inserting after master using an extra context chain
    // We'll piggyback by generating a tiny WebAudio graph inside the engine if it exposed privates earlier.
    // If not exposed, we fallback to a minimal auxiliary click to emulate warmth.
    let ctx = null, shaper=null, postGain=null;
    function installSoftClip(){
      if(ctx) return;
      try{
        ctx = new (AC)();
        // We can't rewire the original destination chain from here safely.
        // So we create a tiny silent bed to keep mobile devices warm; real engine warmth was approximated earlier by filter+reverb.
        // To still add flavor: we produce a very-low noise shaped by the soft-clip and mix at -36dB for perceived warmth.
        const noise = ctx.createBufferSource();
        const buf = ctx.createBuffer(1, ctx.sampleRate*2, ctx.sampleRate);
        const d = buf.getChannelData(0);
        for(let i=0;i<d.length;i++){ d[i] = (Math.random()*2-1)*0.002; }
        noise.buffer = buf; noise.loop = true;
        shaper = ctx.createWaveShaper(); shaper.curve = makeSoftClipCurve(0.75, 4096);
        postGain = ctx.createGain(); postGain.gain.value = 0.015; // ~ -36 dB
        noise.connect(shaper); shaper.connect(postGain); postGain.connect(ctx.destination);
        // start after first user gesture
        const boot = ()=>{ try{ ctx.resume(); noise.start(); cleanup(); }catch(e){} };
        const cleanup = ()=>['pointerdown','touchstart','keydown','click'].forEach(ev=>window.removeEventListener(ev, boot));
        ['pointerdown','touchstart','keydown','click'].forEach(ev=>window.addEventListener(ev, boot, {once:true, passive:true}));
      }catch(e){}
    }
    installSoftClip();

    // Rhythmic scheduler synced to BPM/steps
    let step = 0, lastTs = 0;
    const STEPS = 16;
    function currentArchetype(){
      try{
        const sel = document.getElementById('arch-select');
        return (sel?.value || 'Atlas').replace(/\.html$/,'').toLowerCase();
      }catch(e){ return 'atlas'; }
    }

    function tickPattern(){
      // Derive current BPM from PULSE78K
      const bpm = (PULSE78K.bpm && PULSE78K.bpm()) || 78;
      const sps = (60 / bpm) / 4; // 16th-note seconds per step
      const now = performance.now() / 1000;
      if(now - lastTs >= sps){
        lastTs += sps;
        const arch = currentArchetype();
        const pat = RHYTHM[arch] || RHYTHM['atlas'];
        const isHit = !!pat[step % STEPS];
        if(isHit){
          // accent: click + small boom; stronger on downbeat (step%4==0)
          try{
            PULSE78K.click();
            const str = (step%4===0) ? 1.0 : 0.6;
            PULSE78K.boom(str);
            // give LED strip a little life too
            LEDSTRIP.pulseENG(); if(step%2===0) LEDSTRIP.pulseHR();
          }catch(e){}
        }
        step = (step + 1) % STEPS;
      }
      requestAnimationFrame(tickPattern);
    }
    requestAnimationFrame(tickPattern);

    // Also retie pattern when archetype changes via fused auto listeners
    const sel = document.getElementById('arch-select');
    sel && ['change','input'].forEach(ev=> sel.addEventListener(ev, ()=>{ step = 0; }, {passive:true}));
  });
})();