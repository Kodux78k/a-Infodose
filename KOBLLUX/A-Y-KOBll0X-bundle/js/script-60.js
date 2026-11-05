
/* Estende o KOBSonoro existente com transition + sfx (usa o KOBLoadTone do MXP) */
(function(){
  if(!window.KOBSonoro || typeof window.KOBSonoro.transition === 'function') return;
  if(window.__MXP_SONORO_EXT__) return;
  window.__MXP_SONORO_EXT__ = true;

  const mtof = m => 440*Math.pow(2,(m-69)/12);
  const MODES = { ionian:[0,2,4,5,7,9,11],dorian:[0,2,3,5,7,9,10],phrygian:[0,1,3,5,7,8,10],lydian:[0,2,4,6,7,9,11],mixolydian:[0,2,4,5,7,9,10],aeolian:[0,2,3,5,7,8,10],harmMinor:[0,2,3,5,7,8,11],pentMaj:[0,2,4,7,9],pentMin:[0,3,5,7,10],blues:[0,3,5,6,7,10],hirajoshi:[0,2,3,7,8] };
  const ARCH_MUSIC = { ATLAS:'dorian',NOVA:'lydian',VITALIS:'mixolydian',PULSE:'pentMin',ARTEMIS:'aeolian',SERENA:'pentMaj',KAOS:'phrygian',GENUS:'harmMinor',LUMINE:'ionian',SOLUS:'hirajoshi',RHEA:'mixolydian',AION:'harmMinor',KODUX:'phrygian',BLLUE:'blues',JESUS:'ionian',KOBLLUX:'dorian',INFODOSE:'mixolydian' };
  const TONIC = { ATLAS:0,NOVA:0,VITALIS:0,PULSE:-1,ARTEMIS:-1,SERENA:0,KAOS:-2,GENUS:-1,LUMINE:0,SOLUS:-1,RHEA:0,AION:-1,KODUX:-2,BLLUE:-1,JESUS:0,KOBLLUX:0,INFODOSE:0 };
  const BASE = 57;
  let graph = null;

  async function ensureGraph(){
    if(graph) return graph;
    await window.KOBLoadTone();
    if(typeof Tone === 'undefined') return null;
    try{ await Tone.start(); }catch(e){}
    try{
      const lim = new Tone.Limiter(-2).toDestination();
      const rev = new Tone.Reverb({decay:2.6, wet:.5}).connect(lim);
      const delay = new Tone.FeedbackDelay('8n', .28).connect(rev);
      const synth = new Tone.PolySynth(Tone.Synth, {oscillator:{type:'triangle'},envelope:{attack:.02,decay:.25,sustain:.15,release:.9}}).connect(delay);
      synth.volume.value = -8;
      const bubble = new Tone.Synth({oscillator:{type:'sine'},envelope:{attack:.01,decay:.15,sustain:0,release:.2}}).connect(rev);
      const crystal = new Tone.PolySynth(Tone.FMSynth,{harmonicity:3,modulationIndex:6,envelope:{attack:.005,decay:.4,sustain:0,release:1.2}}).connect(rev);
      const impact = new Tone.MembraneSynth({pitchDecay:.05,octaves:4,envelope:{attack:.001,decay:.3,sustain:0,release:.4}}).connect(lim);
      const noise = new Tone.NoiseSynth({noise:{type:'white'},envelope:{attack:.001,decay:.2,sustain:0,release:.3}}).connect(rev);
      const portal = new Tone.Synth({oscillator:{type:'sawtooth'},envelope:{attack:.15,decay:.4,sustain:.2,release:.8}}).connect(delay);
      graph = { synth, rev, bubble, crystal, impact, noise, portal };
      return graph;
    }catch(e){ console.warn('[MXP sonoro ext]', e); return null; }
  }

  window.KOBSonoro.transition = async function(arch){
    const g = await ensureGraph(); if(!g) return;
    const a = String(arch||'KOBLLUX').toUpperCase();
    const mode = MODES[ARCH_MUSIC[a]||'dorian'] || MODES.dorian;
    const oc = (TONIC[a]||0)*12;
    const root = BASE + oc;
    const notes = [root, root+mode[2], root+mode[4], root+12];
    const now = Tone.now();
    try{
      g.synth.releaseAll(now);
      notes.forEach((n,i)=>g.synth.triggerAttackRelease(mtof(n), .18, now+i*.1));
    }catch(e){}
  };

  window.KOBSonoro.sfx = async function(desc){
    const g = await ensureGraph(); if(!g) return;
    const d = String(desc||'').toLowerCase();
    const now = Tone.now();
    try{
      if(/bolha|bubble|gota|pingo/.test(d)){
        const base = 600 + Math.random()*400;
        g.bubble.triggerAttackRelease(base, .12, now);
        g.bubble.triggerAttackRelease(base*1.5, .1, now+.08);
      } else if(/cristal|crystal|vidro|sino/.test(d)){
        [800,1200,1600].forEach((f,i)=>g.crystal.triggerAttackRelease(f, .3, now+i*.04));
      } else if(/impacto|impact|pancada|batida|thud|boom/.test(d)){
        g.impact.triggerAttackRelease('C1', .2, now);
      } else if(/sopro|whoosh|ruído|noise|ventania/.test(d)){
        g.noise.triggerAttackRelease(.25, now);
      } else if(/portal|transição|transition|reverso|reverse/.test(d)){
        g.portal.frequency.cancelScheduledValues(now);
        g.portal.frequency.setValueAtTime(200, now);
        g.portal.frequency.exponentialRampToValueAtTime(1800, now+.5);
        g.portal.triggerAttackRelease('A3', .4, now);
      } else {
        g.bubble.triggerAttackRelease(800, .1, now);
        g.bubble.triggerAttackRelease(1200, .1, now+.08);
      }
    }catch(e){}
  };

  // Escuta eventos do KOBBus e dispara
  window.addEventListener('kob:arch', async e => {
    const arch = e.detail?.arch;
    if(arch && window.KOBSonoro.transition) await window.KOBSonoro.transition(arch);
  });
  window.addEventListener('kob:sfx', async e => {
    const desc = e.detail?.desc;
    if(desc && window.KOBSonoro.sfx) await window.KOBSonoro.sfx(desc);
  });

  console.log('[MXP] Soneto extender pronto');
})();
