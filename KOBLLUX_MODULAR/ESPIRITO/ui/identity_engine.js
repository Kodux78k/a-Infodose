/**
⧈ KOBLLUX_Δ³ :: ESPIRITO/ui/identity_engine.js
#javascript
0×0C SÍNTESE · KOBLLUX IDENTITY ENGINE v2.0
ÚNICO · SEM DUPLICAÇÃO
NOME → HASH → ORB + VOZ (sotaque) + CSS vars + localStorage
Apocalipse 3:20 — "Eis que estou à porta, e bato..."
*/
(function KOBLLUX_IDENTITY_ENGINE() {
  'use strict';

  /* ── Knuth multiplicative hash ─────────────────────── */
  function _hash(name) {
    let h = 0xdeadbeef;
    const s = (name || 'DUAL').trim() || 'DUAL';
    for (let i = 0; i < s.length; i++)
      h = Math.imul(h ^ s.charCodeAt(i), 2654435761);
    return (h ^ (h >>> 16)) >>> 0;
  }

  /* ── 16 ARQUÉTIPOS VOCAIS com SOTAQUES ───────────────── */
  const ARQUETIPOS = [
    /* 00 */ { name:'NOVA',    hz:432,  lang:'pt-BR', pitch:1.20, rate:1.00, gender:'female' },
    /* 01 */ { name:'ATLAS',   hz:528,  lang:'pt-PT', pitch:0.90, rate:0.95, gender:'male'   },
    /* 02 */ { name:'VITALIS', hz:639,  lang:'pt-BR', pitch:1.10, rate:1.10, gender:'male'   },
    /* 03 */ { name:'PULSE',   hz:594,  lang:'pt-BR', pitch:1.00, rate:1.15, gender:'male'   },
    /* 04 */ { name:'ARTEMIS', hz:672,  lang:'es-ES', pitch:1.30, rate:1.00, gender:'female' },
    /* 05 */ { name:'SERENA',  hz:528,  lang:'pt-BR', pitch:1.15, rate:0.90, gender:'female' },
    /* 06 */ { name:'KAOS',    hz:777,  lang:'de-DE', pitch:0.80, rate:1.20, gender:'male'   },
    /* 07 */ { name:'GENUS',   hz:852,  lang:'pt-BR', pitch:0.85, rate:0.95, gender:'male'   },
    /* 08 */ { name:'LUMINE',  hz:963,  lang:'fr-CA', pitch:1.25, rate:1.00, gender:'female' },
    /* 09 */ { name:'RHEA',    hz:432,  lang:'pt-BR', pitch:1.05, rate:0.88, gender:'female' },
    /* 10 */ { name:'SOLUS',   hz:528,  lang:'en-AU', pitch:0.95, rate:0.92, gender:'male'   },
    /* 11 */ { name:'AION',    hz:639,  lang:'pt-PT', pitch:0.88, rate:0.85, gender:'male'   },
    /* 12 */ { name:'KODUX',   hz:777,  lang:'pt-BR', pitch:1.00, rate:1.15, gender:'male'   },
    /* 13 */ { name:'BLLUE',   hz:852,  lang:'en-US', pitch:1.10, rate:1.05, gender:'female' },
    /* 14 */ { name:'JESUS',   hz:963,  lang:'pt-BR', pitch:1.00, rate:0.90, gender:'male'   },
    /* 15 */ { name:'KOBLLUX', hz:1134, lang:'pt-BR', pitch:1.00, rate:1.00, gender:'male'   }
  ];

  /* ── COMPUTE identidade ─────────────────────────────── */
  function _compute(name) {
    const safe = (name || 'DUAL').trim() || 'DUAL';
    const seed  = _hash(safe);
    const h1    = seed % 360;
    const h2    = (seed * 1.618) % 360;
    const arq   = ARQUETIPOS[seed % 16];
    const cv2 = { pitch: parseFloat((2.0 - arq.pitch).toFixed(2)),
                  rate:  parseFloat((1.0 + (1.0 - arq.rate)).toFixed(2)) };
    return { safe, seed, h1, h2, arq, cv2,             tone: h1 > 180 ? 'warm' : 'cool',
             mode: seed % 2 === 0 ? 'fusion' : 'classic' };
  }

  /* ── MAKE ORB SVG (100×100, dual-orb style) ─────────── */
  function makeOrbAvatar(name, size) {
    size = size || 64;
    const d   = _compute(name);
    const uid  = Math.random().toString(36).slice(2, 6);
    const id   = 'orb_' + d.seed.toString(36) + '_' + uid;
    const p = getComputedStyle(document.documentElement)
                .getPropertyValue('--kob-voice-primary').trim();
    const c1 = p || `hsl(${d.h1},100%,65%)`;
    const c2 = p || `hsl(${d.h2},90%,40%)`;
    const r1 = p || `hsl(${d.h1},100%,75%)`;
    const r2 = p || `hsl(${d.h2},100%,55%)`;

    return `<svg width="${size}" height="${size}" viewBox="0 0 100 100"
             xmlns="http://www.w3.org/2000/svg" class="dual-orb" id="${id}"
             data-arquetipo="${d.arq.name}" data-lang="${d.arq.lang}"
             data-pitch="${d.arq.pitch}" data-rate="${d.arq.rate}">
      <defs>
        <radialGradient id="${id}_c">
          <stop offset="0%"   stop-color="${c1}"/>
          <stop offset="60%"  stop-color="${c2}"/>
          <stop offset="100%" stop-color="${c2}" stop-opacity="0"/>
        </radialGradient>
        <linearGradient id="${id}_r">
          <stop offset="0%"   stop-color="${r1}"/>
          <stop offset="100%" stop-color="${r2}"/>
        </linearGradient>
      </defs>
      <circle cx="50" cy="50" r="46" fill="var(--bg,#05070c)"/>
      <circle cx="50" cy="50" r="38" fill="none"
        stroke="url(#${id}_r)" stroke-width="1" class="orb-pulse-anim"/>
      <circle cx="50" cy="50" r="42" fill="url(#${id}_c)" class="orb-glow"/>
      <circle cx="50" cy="50" r="46" fill="none"
        stroke="url(#${id}_r)" stroke-width="2.5"
        stroke-dasharray="70 20 10 30" stroke-linecap="round"
        class="orb-ring" opacity="0.85"/>
      <circle cx="50" cy="50" r="8"  fill="#fff" opacity="0.3"/>
      <circle cx="50" cy="50" r="3"  fill="#fff" opacity="0.8"/>
    </svg>`;
  }

  /* ── APPLY CSS vars ─────────────────────────────────── */
  function _applyRoot(d) {
    const r = document.documentElement;
    r.style.setProperty('--kob-voice-primary',   `hsl(${d.h1},100%,55%)`);
    r.style.setProperty('--kob-voice-secondary',  `hsl(${d.h2},90%,45%)`);    r.style.setProperty('--kob-voice-bg-soft',    `hsl(${d.h1},60%,8%)`);
    r.style.setProperty('--arch-color',           `hsl(${d.h1},100%,55%)`);
    r.style.setProperty('--grad-a',               `hsl(${d.h1},100%,55%)`);
    r.style.setProperty('--grad-b',               `hsl(${d.h2},90%,45%)`);
    r.style.setProperty('--orb-primary',          `hsl(${d.h1},100%,55%)`);
    r.style.setProperty('--orb-secondary',        `hsl(${d.h2},90%,45%)`);
    r.style.setProperty('--orb-accent',           `hsl(${d.h1},100%,75%)`);
    r.style.setProperty('--cv1-pitch', String(d.arq.pitch));
    r.style.setProperty('--cv1-rate',  String(d.arq.rate));
    r.style.setProperty('--cv1-lang',  d.arq.lang);
    r.style.setProperty('--cv2-pitch', String(d.cv2.pitch));
    r.style.setProperty('--cv2-rate',  String(d.cv2.rate));
    r.dataset.diName    = d.safe;
    r.dataset.arch      = d.safe.toLowerCase();
    r.dataset.arquetipo = d.arq.name;
    r.dataset.tone      = d.tone;
    r.dataset.mode      = d.mode;
    r.dataset.cv1Lang   = d.arq.lang;
  }

  /* ── RENDER ORB ─────────────────────────────────────── */
  function _renderOrb(sel, name, size) {
    const el = document.querySelector(sel);
    if (!el) return;
    el.dataset.arch = name;
    el.innerHTML = makeOrbAvatar(name, size);
  }

  /* ── TEXT ────────────────────────────────────────────── */
  function _setText(sel, val) {
    const el = document.querySelector(sel);
    if (el) el.textContent = val;
  }

  /* ── DI SYNC COMPLETO ───────────────────────────────── */
  function di_syncNameUI(name) {
    const safe = (name || '').trim() || 'DUAL';
    const d     = _compute(safe);

    localStorage.setItem('di_userName',    safe);
    localStorage.setItem('userName',       safe);
    localStorage.setItem('di_arquetipo',   d.arq.name);
    localStorage.setItem('di_arq_lang',    d.arq.lang);
    localStorage.setItem('di_cv1_pitch',   String(d.arq.pitch));
    localStorage.setItem('di_cv1_rate',    String(d.arq.rate));
    localStorage.setItem('di_cv2_pitch',   String(d.cv2.pitch));
    localStorage.setItem('di_cv2_rate',    String(d.cv2.rate));

    _applyRoot(d);
    _setText('#lblName',  safe);
    _setText('#actName',  safe);
    _setText('#smallText', safe);

    const ak = window.STATE?.keys?.find?.(k => k.active);
    _setText('#smallIdent', ak ? ak.name : '--');
    _setText('#actBadge',   ak ? `key:${ak.name}` : `v:${d.arq.name}`);

    _renderOrb('#main-orb',        safe, 48);
    _renderOrb('#avatarTarget',    safe, 64);
    _renderOrb('#smallMiniAvatar', safe, 24);
    _renderOrb('#actMiniAvatar',   safe, 36);

    document.dispatchEvent(new CustomEvent('di:identity:updated', {
      detail: { name: safe, arquetipo: d.arq, cv2: d.cv2, seed: d.seed }
    }));
  }

  /* ── EXPOSE ─────────────────────────────────────────── */
  window.makeOrbAvatar   = makeOrbAvatar;
  window.makeMiniAvatar  = n => makeOrbAvatar(n, 24);
  window.di_syncNameUI   = di_syncNameUI;

  window.DI = window.DI || {};
  Object.assign(window.DI, {
    compute: _compute, syncNameUI: di_syncNameUI,
    renderOrb: _renderOrb, makeOrb: makeOrbAvatar
  });

  window.KOBLLUX = window.KOBLLUX || {};
  window.KOBLLUX.ARQUETIPOS      = ARQUETIPOS;
  window.KOBLLUX.getArquetipo    = name => ARQUETIPOS[_hash(name) % 16];
  window.KOBLLUX.getTTSParams    = function(name) {
    const arq = ARQUETIPOS[_hash(name) % 16];
    return {
      lang:    arq.lang,
      pitch:   arq.pitch,
      rate:    arq.rate,
      gender:  arq.gender,
      lang2:   arq.lang,
      pitch2:  parseFloat((2.0 - arq.pitch).toFixed(2)),
      rate2:   parseFloat((1.0 + (1.0 - arq.rate)).toFixed(2))
    };
  };

  /* ── BIND INPUTS ────────────────────────────────────── */
  function _bind() {
    const inputs = [
      document.querySelector('#inputUser'),
      document.querySelector('#infodoseNameInput')    ].filter(Boolean);

    const initial = (
      inputs[0]?.value ||
      localStorage.getItem('di_userName') ||
      localStorage.getItem('userName') ||
      'DUAL'
    ).trim() || 'DUAL';

    inputs.forEach(inp => {
      if (!inp.value) inp.value = initial;
      inp.addEventListener('input',  () => di_syncNameUI(inp.value));
      inp.addEventListener('change', () => di_syncNameUI(inp.value));
    });

    di_syncNameUI(initial);

    window.addEventListener('storage', e => {
      if (e.key === 'di_userName' || e.key === 'userName') di_syncNameUI(e.newValue);
    });
    document.addEventListener('di:name:update', e => di_syncNameUI(e.detail?.name));
  }

  /* ── INJECT ORB SAFE ────────────────────────────────── */
  function _injectOrbOnce() {
    const t = document.querySelector('#main-orb');
    if (!t || t.dataset.orbInjected) return;
    try {
      const n = localStorage.getItem('di_userName') ||
                localStorage.getItem('userName') || 'DUAL';
      t.innerHTML = makeOrbAvatar(n, 48);
      t.dataset.orbInjected = 'true';
    } catch(e) { console.warn('[KOBLLUX] orb inject fail → fallback mantido', e); }
  }

  /* ── INIT ────────────────────────────────────────────── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => { _bind(); _injectOrbOnce(); });
  } else {
    _bind(); _injectOrbOnce();
  }

})();