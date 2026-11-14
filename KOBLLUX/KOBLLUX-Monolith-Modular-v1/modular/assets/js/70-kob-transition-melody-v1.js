
(function(){
  'use strict';
  if (window.__KOB_TRANSITION_MELODY_V1__) return;
  window.__KOB_TRANSITION_MELODY_V1__ = true;

  const mtof = m => 440 * Math.pow(2, (m - 69) / 12);

  // Assinatura única por arquétipo — root, notas (offsets em semitons), dur, gap, wave
  const SIG = {
    ATLAS:    { root:57, notes:[0, 4, 7, 12, 7, 4],       dur:0.12, gap:0.09, wave:'triangle' },
    NOVA:     { root:57, notes:[0, 7, 11, 16, 11],        dur:0.15, gap:0.08, wave:'sine'     },
    VITALIS:  { root:57, notes:[0, 7, 4, 0, -5],          dur:0.10, gap:0.05, wave:'triangle' },
    PULSE:    { root:45, notes:[0, 3, 7, 10, 7, 3],       dur:0.12, gap:0.06, wave:'square'   },
    ARTEMIS:  { root:45, notes:[0, 3, 7, 12, 15],         dur:0.14, gap:0.08, wave:'sine'     },
    SERENA:   { root:57, notes:[0, 4, 9, 14, 9, 4],       dur:0.16, gap:0.10, wave:'sine'     },
    KAOS:     { root:33, notes:[0, 1, 3, 8, 3, 1, 0],     dur:0.09, gap:0.04, wave:'sawtooth' },
    GENUS:    { root:45, notes:[0, 3, 7, 8, 7, 3],        dur:0.13, gap:0.08, wave:'sine'     },
    LUMINE:   { root:57, notes:[0, 4, 9, 12, 16, 12],     dur:0.11, gap:0.06, wave:'triangle' },
    SOLUS:    { root:45, notes:[0, 2, 7, 2, -5],          dur:0.20, gap:0.14, wave:'sine'     },
    RHEA:     { root:57, notes:[0, 5, 7, 12, 7, 5, 0],    dur:0.13, gap:0.09, wave:'sine'     },
    AION:     { root:45, notes:[0, 3, 8, 12, 8, 3],       dur:0.14, gap:0.09, wave:'sine'     },
    KODUX:    { root:33, notes:[0, 3, 6, 3, 0, -5],       dur:0.10, gap:0.05, wave:'sawtooth' },
    BLLUE:    { root:45, notes:[0, 3, 7, 6, 3, 0],        dur:0.12, gap:0.07, wave:'triangle' },
    JESUS:    { root:57, notes:[0, 7, 12, 19, 12],        dur:0.22, gap:0.16, wave:'sine'     },
    KOBLLUX:  { root:57, notes:[0, 3, 7, 10, 14, 10],     dur:0.15, gap:0.09, wave:'triangle' },
    INFODOSE: { root:57, notes:[0, 2, 5, 7, 9, 12, 9],    dur:0.11, gap:0.06, wave:'sine'     }
  };

  let graph = null;
  async function ensureGraph(){
    if (graph) return graph;
    await window.KOBLoadTone();
    if (typeof Tone === 'undefined') return null;
    try { await Tone.start(); } catch(_){}
    try {
      const lim = new Tone.Limiter(-2).toDestination();
      const rev = new Tone.Reverb({ decay:2.8, wet:.45 }).connect(lim);
      const delay = new Tone.FeedbackDelay('8n', .25).connect(rev);
      const poly = new Tone.PolySynth(Tone.Synth, {
        oscillator: { type:'triangle' },
        envelope: { attack:0.01, decay:0.25, sustain:0.1, release:1.0 }
      }).connect(delay);
      poly.volume.value = -8;
      poly.maxPolyphony = 12;
      graph = { poly, rev };
      return graph;
    } catch(e){ console.warn('[melody]', e); return null; }
  }

  async function play(arch){
    const a = String(arch || 'KOBLLUX').toUpperCase();
    const sig = SIG[a] || SIG.KOBLLUX;
    const g = await ensureGraph();
    if (!g) return;

    try { g.poly.set({ oscillator: { type: sig.wave } }); } catch(_){}
    try { g.poly.releaseAll(Tone.now()); } catch(_){}

    // reverb respira junto com a trilha principal (se estiver tocando, seco; parada, ambiente)
    try {
      const playing = window.KOBSonoro && window.KOBSonoro.isPlaying && window.KOBSonoro.isPlaying();
      g.rev.wet.rampTo(playing ? 0.35 : 0.55, 0.15);
    } catch(_){}

    let t = Tone.now() + 0.05;
    sig.notes.forEach(offset => {
      const freq = mtof(sig.root + offset);
      try { g.poly.triggerAttackRelease(freq, sig.dur, t); } catch(_){}
      t += sig.gap;
    });
  }

  // Espera o KOBSonoro existir e SOBRESCREVE o transition
  let tries = 0;
  (function boot(){
    if (window.KOBSonoro) {
      window.KOBSonoro.transition = play;
      console.log('%c[KOB-TRANSITION v1]%c 17 melodias distintas instaladas',
        'background:#50c8c8;color:#000;padding:2px 6px;border-radius:3px', 'color:#50c8c8');
      return;
    }
    if (++tries > 50) return;
    setTimeout(boot, 200);
  })();

  window.KOBTransition = {
    play, signatures: SIG,
    preview(arch){ play(arch); }
  };
})();
