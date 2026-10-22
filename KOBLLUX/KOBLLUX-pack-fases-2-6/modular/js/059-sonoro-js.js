/* @kob-mod 059 · sonoro-js · body */

(function SonoroSoneto(){


/* =========================================================
   STATE
========================================================= */
const state = {
  rawMerge: '',
  dictApplied: '',
  formatted: {html: '', text: ''},
  dictEnabled: false,
  dictRules: [],
  fmt: {
    chapters: true,
    subtitles: true,
    callouts: true,
    pagebreaks: false,
    wordsPerParagraph: 12
  },
  view: 'raw',
  slices: [],
  sliceIndex: 0,
  sliceMode: 'paragraph',
  sliceSize: 420,
  sliceShowAll: false
};

window.__lastSubs = 0;

let ttsPlaying = false;
let ttsUtter = null;

/* =========================================================
   MOTOR FRACTAL 369
========================================================= */
const motor369 = {
  merge(a, b) {
    const s1 = a.split(/[.!?]+/).filter(s => s.trim());
    const s2 = b.split(/[.!?]+/).filter(s => s.trim());
    const max = Math.max(s1.length, s2.length);
    let res = '';
    for (let i = 0; i < max; i++) {
      const p = i % 3;
      if (p === 0 && s1[i]) res += s1[i].trim() + '. ';
      else if (p === 1 && s2[i]) res += s2[i].trim() + '. ';
      else if (p === 2 && s1[i]) res += s1[i].trim() + '. ';
      else if (s2[i]) res += s2[i].trim() + '. ';
    }
    return res;
  }
};

/* =========================================================
   MARKDOWN RENDER
========================================================= */
const MD = (() => {
  const esc = v => String(v ?? '')
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;');

  function inline(text) {
    let s = esc(text);
    s = s.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (_,alt,src) => `<img alt="${alt}" src="${src}">`);
    s = s.replace(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g, (_,label,url) => `<a href="${url}" target="_blank" rel="noopener">${label}</a>`);
    s = s.replace(/`([^`]+)`/g, (_,c) => `<code>${c}</code>`);
    s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    s = s.replace(/(^|[^*])\*([^*]+)\*(?!\*)/g, '$1<em>$2</em>');
    s = s.replace(/~~([^~]+)~~/g, '<del>$1</del>');
    return s;
  }

  function parse(text) {
    const lines = String(text ?? '').replace(/\r\n?/g,'\n').split('\n');
    const out = [];
    let i = 0;
    let para = [];

    const flush = () => {
      if (!para.length) return;
      const joined = para.join(' ').trim();
      if (joined) out.push(`<p>${inline(joined)}</p>`);
      para = [];
    };

    while (i < lines.length) {
      const line = lines[i];

      if (!line.trim()) { flush(); i++; continue; }

      const fm = line.match(/^\s*(?:```|''')([\w-]*)\s*$/);
      if (fm) {
        flush();
        const lang = (fm[1]||'').toLowerCase();
        const buf = [];
        let j = i + 1;
        while (j < lines.length && !/^\s*(?:```|''')\s*$/.test(lines[j])) {
          buf.push(lines[j]); j++;
        }
        const raw = buf.join('\n');
        out.push(`<pre><code${lang?` class="language-${lang}"`:''}>${esc(raw)}</code></pre>`);
        i = j < lines.length ? j + 1 : j;
        continue;
      }

      const hm = line.match(/^(#{1,6})\s+(.*)$/);
      if (hm) {
        flush();
        const n = hm[1].length;
        out.push(`<h${n}>${inline(hm[2])}</h${n}>`);
        i++; continue;
      }

      if (/^\s*(?:-{3,}|\*{3,}|_{3,})\s*$/.test(line)) {
        flush();
        out.push('<hr>');
        i++; continue;
      }

      if (/^\s*>\s?/.test(line)) {
        flush();
        const buf = [];
        while (i < lines.length && /^\s*>\s?/.test(lines[i])) {
          buf.push(lines[i].replace(/^\s*>\s?/,''));
          i++;
        }
        out.push(`<blockquote>${inline(buf.join(' '))}</blockquote>`);
        continue;
      }

      if (/^(\s*)([-+*]|\d+\.)\s+/.test(line)) {
        flush();
        const {html, next} = parseList(lines, i);
        out.push(html);
        i = next; continue;
      }

      para.push(line.trim());
      i++;
    }
    flush();
    return out.join('\n');
  }

  function parseList(lines, start) {
    const first = lines[start].match(/^(\s*)([-+*]|\d+\.)\s+(.*)$/);
    const rootOrdered = /^\d+\.$/.test(first[2]);
    const items = [];
    let i = start;
    while (i < lines.length) {
      const m = lines[i].match(/^(\s*)([-+*]|\d+\.)\s+(.*)$/);
      if (!m) break;
      const text = m[3];
      const task = text.match(/^\[( |x|X)\]\s*(.*)$/);
      if (task) {
        items.push(`<li style="list-style:none;"><input type="checkbox" ${/x/i.test(task[1])?'checked':''} disabled> ${inline(task[2])}</li>`);
      } else {
        items.push(`<li>${inline(text)}</li>`);
      }
      i++;
    }
    const tag = rootOrdered ? 'ol' : 'ul';
    return {html: `<${tag}>${items.join('')}</${tag}>`, next: i};
  }

  return {render: parse};
})();

/* =========================================================
   FORMATTER 369
========================================================= */
function formatText(rawText) {
  if (!rawText || !rawText.trim()) return {html: '', text: ''};

  const container = document.createElement('div');
  let markdown = '';
  let paragraphCount = 0;
  let charCount = 0;
  let pageCount = 1;
  const CHARS_PER_PAGE = 3000;
  const cfg = state.fmt;

  const appendPageBreak = (n) => {
    if (!cfg.pagebreaks) return;
    markdown += `\n\n--- PÁGINA ${n} ---\n\n`;
  };
  const appendChapter = (text) => {
    if (!cfg.chapters) return;
    markdown += `\n# ${text.toUpperCase()}\n\n`;
  };
  const appendSubtitle = (text) => {
    if (!cfg.subtitles) return;
    markdown += `\n## ${text}\n\n`;
  };
  const appendParagraph = (text) => { markdown += `${text}\n\n`; };
  const appendCallout = (text, type) => {
    markdown += `> ${type === 'question' ? '❓ PERGUNTA' : '💡 EXCLAMAÇÃO'}: ${text}\n\n`;
  };

  const blocks = rawText.split('\n');

  blocks.forEach(block => {
    if (!block.trim()) return;
    const sentences = [];
    let cur = '';
    for (let i = 0; i < block.length; i++) {
      const ch = block[i];
      cur += ch;
      const isP = (ch === '.' || ch === '?' || ch === '!');
      const next = block[i + 1];
      const isEnd = (next === undefined || next === ' ' || next === '\n' || next === '\r');
      if (isP && isEnd) { sentences.push(cur.trim()); cur = ''; }
    }
    if (cur.trim()) sentences.push(cur.trim());

    let paraSentences = [];
    let paraWords = 0;

    const flushPara = () => {
      if (!paraSentences.length) return;
      const combined = paraSentences.join(' ');
      const words = combined.match(/[\wÀ-ú]+/g) || [];
      charCount += combined.length;
      if (charCount >= CHARS_PER_PAGE) { pageCount++; appendPageBreak(pageCount); charCount = combined.length; }
      if (paragraphCount > 0 && paragraphCount % 9 === 0) {
        appendChapter(words.slice(0, 2).join(' ') || 'Novo Capítulo');
      } else if (paragraphCount > 0 && paragraphCount % 3 === 0) {
        let sub = '';
        if (words.length <= 3) sub = words.join(' ');
        else if (words.length <= 5) sub = words.slice(0, 3).join(' ');
        else sub = `${words.slice(0, 3).join(' ')} ${words.slice(-2).reverse().join(' ')}`;
        appendSubtitle(sub || 'Novo Subtítulo');
      }
      appendParagraph(combined);
      paragraphCount++;
      paraSentences = [];
      paraWords = 0;
    };

    sentences.forEach(sentence => {
      const lastChar = sentence.slice(-1);
      const wc = (sentence.match(/[\wÀ-ú]+/g) || []).length;

      if (lastChar === '?' || lastChar === '!') {
        flushPara();
        const words = sentence.match(/[\wÀ-ú]+/g) || [];
        charCount += sentence.length;
        if (charCount >= CHARS_PER_PAGE) { pageCount++; appendPageBreak(pageCount); charCount = sentence.length; }
        if (paragraphCount > 0 && paragraphCount % 9 === 0) {
          appendChapter(words.slice(0, 2).join(' ') || 'Novo Capítulo');
        } else if (paragraphCount > 0 && paragraphCount % 3 === 0) {
          let sub = '';
          if (words.length <= 3) sub = words.join(' ');
          else if (words.length <= 5) sub = words.slice(0, 3).join(' ');
          else sub = `${words.slice(0, 3).join(' ')} ${words.slice(-2).reverse().join(' ')}`;
          appendSubtitle(sub || 'Novo Subtítulo');
        }
        appendCallout(sentence, lastChar === '?' ? 'question' : 'affirmation');
        paragraphCount++;
      } else {
        paraSentences.push(sentence);
        paraWords += wc;
        if (paraWords >= cfg.wordsPerParagraph) flushPara();
      }
    });

    flushPara();
  });

  return {html: container.innerHTML, text: markdown};
}

/* =========================================================
   SLICER
========================================================= */
function makeSlices(text) {
  if (!text || !text.trim()) return [];
  const mode = state.sliceMode;
  const size = state.sliceSize;
  const chunks = [];

  if (mode === 'paragraph') {
    text.split(/\n{2,}/).forEach(p => { const t = p.trim(); if (t) chunks.push(t); });
  } else if (mode === 'sentence') {
    const regex = /[^.!?]+[.!?]+[\s]*/g;
    let m, lastIdx = 0;
    while ((m = regex.exec(text)) !== null) { chunks.push(m[0].trim()); lastIdx = regex.lastIndex; }
    const tail = text.slice(lastIdx).trim();
    if (tail) chunks.push(tail);
  } else {
    const words = text.split(/(\s+)/);
    let buf = '';
    for (const w of words) {
      if ((buf + w).length > size && buf.trim()) { chunks.push(buf.trim()); buf = w; }
      else buf += w;
    }
    if (buf.trim()) chunks.push(buf.trim());
  }
  if (!chunks.length && text.trim()) chunks.push(text.trim());
  return chunks;
}

function sliceTitle(text) {
  const words = text.match(/[\wÀ-ú]+/g) || [];
  return (words.slice(0, 4).join(' ') || 'Fatia').slice(0, 44);
}

/* =========================================================
   DICIONÁRIO — PRESETS
========================================================= */
const DICT_PRESETS = {
  patoDoMundo: [
    {from:'de',           to:'ðŸ¦†',          wholeWord:true,  enabled:true},
    {from:'do',           to:'ðö¦†',          wholeWord:true,  enabled:true},
    {from:'oi',           to:'oi¦†',          wholeWord:true,  enabled:true},
    {from:'diário',       to:'ðŸ¦†Ariö',      wholeWord:true,  enabled:true},
    {from:'dica valiosa', to:'ðŸ¦k†valŸöza',   wholeWord:false, enabled:true},
    {from:'di',           to:'ðŸ¦†',          wholeWord:true,  enabled:true},
    {from:'dual',         to:'†ðual',         wholeWord:false, enabled:true},
    {from:'mundo',        to:'MöNdö¦†',       wholeWord:true,  enabled:true},
    {from:'brilhante',    to:'BriŸ†liante',   wholeWord:true,  enabled:true},
    {from:'dia',          to:'ðŸ¦a†',          wholeWord:false, enabled:true},
    {from:'não',          to:'NÃ£o†',         wholeWord:true,  enabled:true},
    {from:'pato',         to:'PaTo†',         wholeWord:true,  enabled:true},
    {from:'foca',         to:'Föca†',         wholeWord:true,  enabled:true},
    {from:'gato',         to:'ga†to',         wholeWord:true,  enabled:true},
    {from:'cavalo',       to:'K-valo',        wholeWord:true,  enabled:true},
    {from:'onça',         to:'KOBLOnça',      wholeWord:true,  enabled:true},
    {from:'criança',      to:'criOnça',       wholeWord:true,  enabled:true},
    {from:'Ayor',         to:'â€¦†',           wholeWord:true,  enabled:true},
    {from:'kobllux',      to:'KOBLLUX',       wholeWord:true,  enabled:true},
    {from:'tecnologia',   to:'TeKologia',     wholeWord:true,  enabled:true}
  ],
  kblx: [
    {from:'de',           to:'ðŸ¦†',          wholeWord:true,  enabled:true},
    {from:'do',           to:'ðö¦†',          wholeWord:true,  enabled:true},
    {from:'oi',           to:'öŸ',            wholeWord:true,  enabled:true},
    {from:'di',           to:'ðŸ¦†',          wholeWord:true,  enabled:true},
    {from:'dual',         to:'†ðual',         wholeWord:false, enabled:true},
    {from:'mundo',        to:'möndö¦†',       wholeWord:true,  enabled:true},
    {from:'dia',          to:'ðŸ¦a†',          wholeWord:false, enabled:true},
    {from:'não',          to:'NÃ£o†',         wholeWord:true,  enabled:true}
  ],
  vazio: []
};

function escapeRegex(s) {
  return String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function applyDictionary(text, rules) {
  if (!text) return {text: '', total: 0};
  const active = rules
    .filter(r => r.enabled && r.from)
    .sort((a, b) => b.from.length - a.from.length);

  let out = text;
  let total = 0;

  for (const rule of active) {
    const esc = escapeRegex(rule.from);
    let regex;
    try {
      if (rule.wholeWord) regex = new RegExp(`(?<![\\p{L}\\p{N}_])${esc}(?![\\p{L}\\p{N}_])`, 'giu');
      else regex = new RegExp(esc, 'giu');
    } catch (e) {
      regex = new RegExp(esc, 'gi');
    }
    let count = 0;
    out = out.replace(regex, () => { count++; return rule.to; });
    total += count;
  }
  return {text: out, total};
}

/* =========================================================
   TTS
========================================================= */
function getTTSContent() {
  { const _a=((window.KOBActive&&String(KOBActive.text||'').trim())?KOBActive.text:null); if (_a) return _a; }   /* [v82] toca o arquivo ativo (pílula/card) */
  if (state.view === 'slices' && state.slices.length && !state.sliceShowAll) {
    return state.slices[state.sliceIndex] || '';
  }
  return state.dictApplied || getResultado();
}

/* [v79] TTS do Soneto → Kob.js (KOBBus.say): fala pela voz do data-arch ativo */
function ttsDone(){ ttsPlaying = false; updateTTSBtn(); }
function speakKob(text){
  if (window.KOBBus && window.KOBBus.say) return window.KOBBus.say(text, {rate:0.95, onend:ttsDone, onerror:ttsDone});
  speechSynthesis.cancel(); ttsUtter = new SpeechSynthesisUtterance(text); ttsUtter.rate = 0.95;
  ttsUtter.onend = ttsDone; ttsUtter.onerror = ttsDone; speechSynthesis.speak(ttsUtter); return true;
}
function stopKob(){ if (window.KOBBus && window.KOBBus.stop) window.KOBBus.stop(); else speechSynthesis.cancel(); }
function toggleTTS(forceText) {
  if (ttsPlaying) { stopKob(); ttsDone(); return; }
  const text = forceText || getTTSContent();
  if (!text || !text.trim()) { alert('Gera um resultado primeiro'); return; }
  ttsPlaying = true; updateTTSBtn(); speakKob(text);
}
function restartTTSIfPlaying() {
  if (!ttsPlaying) return;
  stopKob();
  const text = getTTSContent();
  if (!text || !text.trim()) { ttsDone(); return; }
  setTimeout(() => { speakKob(text); updateTTSBtn(); }, 120);
}

function updateTTSBtn() {
  document.querySelectorAll('[data-action="toggle-tts"]').forEach(b => {
    b.classList.toggle('playing', ttsPlaying);
    b.textContent = ttsPlaying ? 'Ⅱ' : '🎧';
    b.title = ttsPlaying ? 'Pausar leitura' : 'Ouvir resultado';
  });
  const sp = document.getElementById('slicePlayBtn');
  if (sp) {
    sp.classList.toggle('active', ttsPlaying);
    sp.textContent = ttsPlaying? 'Ⅱ' : '🎧';
  }
}

/* =========================================================
   SONORO · Tone.js ENGINE · v84 camadas+crossfade
========================================================= */
let sonoroStarted = false;
let sonoroPlaying = false;
let sonoroPart = null;
let sonoroSynths = {};
let sonoroReverb = null;
let sonoroDelay = null;
let sonoroAnalyser = null;
let sonoroSpanElements = [];
let sonoroRaf = null;
/* [v84] estado do arranjo em camadas */
let sonoroPadFilter = null;
let sonoroLimiter = null, sonoroBase = null, sonoroKind = 'softKey', sonoroTrack = true, sonoroTonic = 57;
let sonoroModes = {}, sonoroVoices = {}, sonoroFading = [], sonoroStack = [], sonoroLead = null, sonoroTL = null;
let sonoroPrevChord = null, sonoroPivot = false, sonoroPivotFrom = null, sonoroBarN = 0, sonoroEnterBar = 0, sonoroChordRoot = 0;

const SONORO_SCALES = {
  melancolia: ['A3','B3','C4','D4','E4','F4','G#4','A4','B4','C5','D5','E5','F5','G#5','A5'],
  alegria:    ['C4','D4','E4','G4','A4','C5','D5','E5','G5','A5','C6','D6','E6','G6','A6'],
  misterio:   ['C4','D4','E4','F#4','G#4','A#4','C5','D5','E5','F#5','G#5','A#5','C6','D6','E6'],
  sonho:      ['F3','G3','A3','B3','C4','D4','E4','F4','G4','A4','B4','C5','D5','E5','F5'],
  oriental:   ['A3','A#3','D4','E4','F4','A4','A#4','D5','E5','F5','A5'],
  cyberpunk:  ['E3','F3','G#3','A3','B3','C4','D4','E4','F4','G#4','A4','B4','C5','D5','E5']
};

const SONORO_ALPHABET = 'abcdefghijklmnopqrstuvwxyzáàãâéêíóôõúçñ';

function sonoroToneAvailable() {
  return typeof Tone !== 'undefined' && Tone;
}

function initSonoroEngine() {
  if (!sonoroToneAvailable()) return false;
  if (sonoroStarted) return true;

  const revEl = document.getElementById('sonoroReverb');
  const wet = revEl ? Math.max(0, Math.min(100, parseInt(revEl.value,10) || 40)) / 100 : 0.4;

  sonoroLimiter = new Tone.Limiter(-2).toDestination();            /* [v84] camadas somam → limiter protege */
  sonoroReverb = new Tone.Reverb({ decay: 3.5, wet }).connect(sonoroLimiter);
  sonoroDelay  = new Tone.FeedbackDelay('8n', 0.25).connect(sonoroReverb);

  sonoroAnalyser = new Tone.Waveform(128);
  Tone.Destination.connect(sonoroAnalyser);

  /* [v84] lead = 1 voz por arquétipo, criada sob demanda (kobBuildVoice). Abaixo só o que é COMPARTILHADO. */
  sonoroSynths.quote = new Tone.PolySynth(Tone.FMSynth, {
    harmonicity: 3,
    modulationIndex: 4,
    oscillator: { type: 'sine' },
    envelope: { attack: 0.08, decay: 0.4, sustain: 0.3, release: 1.8 }
  }).connect(sonoroReverb);
  sonoroSynths.quote.volume.value = -16;
  try { sonoroSynths.quote.maxPolyphony = 8; } catch(e){}

  /* pluck refeito: attackNoise .3 (menos "tick"), dampening 4600, resonance .9 (coda longa), via delay */
  { const pk=[0,1,2,3].map(()=>{ const p=new Tone.PluckSynth({attackNoise:.3,dampening:4600,resonance:.9}); p.volume.value=-2; return p.connect(sonoroDelay); }); let pi=0;
    sonoroSynths.pluck={triggerAttackRelease:(n,d,t)=>pk[pi++%4].triggerAttack(Array.isArray(n)?n[0]:n,t),set(){}}; }

  sonoroSynths.bass = new Tone.MembraneSynth({
    pitchDecay: 0.05,
    octaves: 3.5,
    oscillator: { type: 'sine' },
    envelope: { attack: 0.01, decay: 0.4, sustain: 0.01, release: 1.2 }
  }).connect(sonoroLimiter);
  sonoroSynths.bass.volume.value = -3;

  /* pad de acordes (triângulo, ataque suave) — condução de vozes */
  sonoroSynths.pad = new Tone.PolySynth(Tone.Synth, {
    oscillator: { type: 'triangle' },
    envelope: { attack: 0.35, decay: 0.4, sustain: 0.55, release: 1.8 }
  }).connect(sonoroReverb);
  sonoroSynths.pad.volume.value = -27;
  try { sonoroSynths.pad.maxPolyphony = 2; } catch(e){}

  /* saw grave: pedal da tônica (ataque lento, passa-baixa) = o "chão" synthwave */
  sonoroPadFilter = new Tone.Filter(600, 'lowpass').connect(sonoroReverb);
  sonoroSynths.sawPad = new Tone.PolySynth(Tone.Synth, {
    oscillator: { type: 'sawtooth' },
    envelope: { attack: 0.8, decay: 0.4, sustain: 0.7, release: 3.0 }
  }).connect(sonoroPadFilter);
  sonoroSynths.sawPad.volume.value = -39;
  try { sonoroSynths.sawPad.maxPolyphony = 1; } catch(e){}

  const bpmEl = document.getElementById('sonoroBpm');
  Tone.Transport.bpm.value = bpmEl ? parseInt(bpmEl.value,10) || 130 : 130;
  sonoroStarted = true;
  return true;
}


/* ===== [v81] ARQUÉTIPO ⇄ TRILHA ⇄ TTS · modos, onda, reverb, BPM(rate), transposição(pitch) ===== */
const KOB_MODES={ionian:[0,2,4,5,7,9,11],dorian:[0,2,3,5,7,9,10],phrygian:[0,1,3,5,7,8,10],lydian:[0,2,4,6,7,9,11],mixolydian:[0,2,4,5,7,9,10],aeolian:[0,2,3,5,7,8,10],locrian:[0,1,3,5,6,8,10],harmMinor:[0,2,3,5,7,8,11],pentMaj:[0,2,4,7,9],pentMin:[0,3,5,7,10],wholetone:[0,2,4,6,8,10],blues:[0,3,5,6,7,10],hirajoshi:[0,2,3,7,8]};
/* [modo, onda, reverb wet] — KODUX = frígio (empréstimo modal sobre a tônica do texto) */
const KOB_ARCH_MUSIC={ATLAS:['dorian','triangle',.55],NOVA:['lydian','sine',.6],VITALIS:['mixolydian','triangle',.45],PULSE:['pentMin','square',.3],ARTEMIS:['aeolian','sine',.65],SERENA:['pentMaj','sine',.7],KAOS:['phrygian','triangle',.6],GENUS:['harmMinor','sine',.59],LUMINE:['ionian','triangle',.5],SOLUS:['hirajoshi','sine',.8],RHEA:['mixolydian','sine',.55],AION:['harmMinor','sine',.7],KODUX:['phrygian','sawtooth',.47],BLLUE:['blues','triangle',.5],JESUS:['ionian','sine',.75],KOBLLUX:['dorian','triangle',.5]};
window.KOB_MODES=KOB_MODES;window.KOB_ARCH_MUSIC=KOB_ARCH_MUSIC;
const _amCache={};
function archTrackOn(){return localStorage.getItem('kob:arch:track')!=='0'}
function getArchNow(){return String((window.getArch&&window.getArch())||'KOBLLUX').toUpperCase()}
function archVoice(a){return (window.KBLX_VOICE&&KBLX_VOICE.map[a])||{rate:1,pitch:1}}
/* [v82] dois data-arch: body (symbol bar) + html/MXP → arquétipo secundário; voz = ponto médio */
window.KOB_ARCH2=function(){
  const m=document.querySelector('[data-mxp-arch]'), b=String((window.getArch&&getArch())||document.body.dataset.arch||'').toUpperCase();
  const o=String((m&&m.dataset.mxpArch)||document.documentElement.dataset.arch||'').toUpperCase();
  return (o&&o!==b&&window.KBLX_VOICE&&KBLX_VOICE.map[o])?o:null;
};
window.KOB_MIXVOICE=function(a){ const A=archVoice(a), o=KOB_ARCH2(); if(!o) return A; const B=archVoice(o); return {rate:(A.rate+B.rate)/2,pitch:(A.pitch+B.pitch)/2,mix:o}; };
function archScale(base,arch){
  const am=KOB_ARCH_MUSIC[arch]; if(!am||!archTrackOn()||!sonoroToneAvailable()) return base;
  const k=arch+'|'+base[0]+'|'+(KOB_ARCH2()||''); if(_amCache[k]) return _amCache[k];
  const v=KOB_MIXVOICE(arch), shift=Math.max(-5,Math.min(5,Math.round(6*Math.log2(v.pitch||1)))); /* pitch do TTS → transposição */
  const root=Tone.Frequency(base[0]).toMidi()+shift, iv=KOB_MODES[am[0]], out=[];
  for(let i=0;i<15;i++) out.push(Tone.Frequency(root+Math.floor(i/iv.length)*12+iv[i%iv.length],'midi').toNote());
  return (_amCache[k]=out);
}
function archTriggers(text){
  const names=(window.ARCH_LIST||Object.keys(KOB_ARCH_MUSIC)).slice().sort((a,b)=>b.length-a.length), out=[];
  const re=new RegExp('\\b('+names.join('|')+')\\b','gi'); let m;
  while((m=re.exec(text))) out.push({index:m.index,arch:m[1].toUpperCase()});
  return out;
}
function archMusicApply(arch){
  const am=KOB_ARCH_MUSIC[arch]; if(!am) return;
  try{
    if(sonoroStarted&&sonoroToneAvailable()){
      const T=sonoroPlaying?kobXfadeSec():.8;   /* [v84] reverb e BPM acompanham o crossfade */
      if(sonoroReverb&&sonoroReverb.wet) sonoroReverb.wet.rampTo(am[2],T);
      const bpmEl=document.getElementById('sonoroBpm'), base=bpmEl?parseInt(bpmEl.value,10)||120:120;
      Tone.Transport.bpm.rampTo(Math.round(Math.max(50,Math.min(220,base*KOB_MIXVOICE(arch).rate))),T); /* rate do TTS → BPM */
    }
  }catch(e){}
  const a=document.querySelector('#hd2Holo .ha'); if(a) a.textContent=arch+' · '+am[0]+' · '+am[1]+' · rev '+Math.round(am[2]*100)+'%'+(sonoroPlaying&&sonoroStack.length>1?' · ⧉'+sonoroStack.length:'');
}
window.KOB_ARCHSWITCH=function(arch){ try{ if(window.applyArch) applyArch(arch); }catch(e){} kobEnterExternal(arch); archMusicApply(arch); };
new MutationObserver(()=>{ const a=getArchNow(); kobEnterExternal(a); archMusicApply(a); }).observe(document.body,{attributes:true,attributeFilter:['data-voice-arch']});

/* ===== [v84] SONORO · TOM BASE + CAMADAS + CROSSFADE + ACORDES ======================
   ESTUDO (por que assim, e por que é leve):
   1) TOM BASE FIXO — a tônica sai do tema + 1º arquétipo e NÃO muda mais. Todo arquétipo
      novo só troca o MODO sobre a mesma tônica (empréstimo modal paralelo). Um pedal de saw
      grave (tônica+5ª) segura o chão o tempo todo → as trocas "modulam", nunca "pulam".
   2) CROSSFADE POTÊNCIA-IGUAL, NO CLOCK DE ÁUDIO — só a voz LEAD tem 1 instância por
      arquétipo (≤3 vivas: atual + 2 saindo). Fade agendado em Tone.now()/time (sem setTimeout),
      curva sen/cos em 12 segmentos → sem "buraco" de volume no meio. Durante o fade, as
      notas tocam nas DUAS vozes (cada uma no seu modo) = as duas trilhas somando, estilo DJ.
   3) ACORDES POR GRAU + CONDUÇÃO DE VOZES — tríade em qualquer modo (graus 0-2-4, ajustados
      p/ pentatônicas). Progressão por compasso (I-IV-V.. / I-vi-IV-V..) e cada acorde escolhe
      a inversão mais próxima do anterior (mínimo movimento). Na troca de arquétipo o 1º
      compasso usa ACORDE-PIVÔ: só notas comuns aos dois modos.
   4) ARRANJO QUE CRESCE (concatenação) — pilha dos últimos 3 arquétipos:
        1 = lead + pad + pedal
        2 = + contracanto em pluck, tirado do MODO do arquétipo anterior (cor emprestada)
        3 = + pulso de baixo + tétrade no pad
      Sem arquétipo novo por ~8 compassos a pilha "respira" (solta o mais antigo).
   5) CUSTO — reverb/delay/limiter ÚNICOS; pad, saw, baixo, citação e pluck COMPARTILHADOS;
      notas calculadas em Hz no callback (sem parsear string de nota); polifonia limitada;
      voz que saiu é descartada no próximo compasso (reap). Acorde só no início de palavra. */
const KOB_OCTAVE={ATLAS:0,NOVA:0,VITALIS:0,PULSE:-1,ARTEMIS:-1,SERENA:0,KAOS:-2,GENUS:-1,LUMINE:0,SOLUS:-1,RHEA:0,AION:-1,KODUX:-2,BLLUE:-1,JESUS:0,KOBLLUX:0};
/* graus (passos dentro da escala, não semitons) — pentatônicas/hexa ajustadas p/ formar tríade */
const KOB_CHORD_STEPS={ionian:[0,2,4],dorian:[0,2,4],phrygian:[0,2,4],lydian:[0,2,4],mixolydian:[0,2,4],aeolian:[0,2,4],locrian:[0,2,4],harmMinor:[0,2,4],pentMaj:[0,2,3],pentMin:[0,1,3],wholetone:[0,2,4],blues:[0,1,4],hirajoshi:[0,2,3]};
const KOB_BRIGHT={ionian:1,lydian:1,mixolydian:1,pentMaj:1,wholetone:1};
const KOB_PROG={bright:[0,3,4,3],dark:[0,5,3,4]};   /* grau-raiz do acorde por compasso */
const KOB_BAR_STEPS=16, KOB_BEAT_STEPS=4;           /* 1 passo = 16n */
const KOB_XFADE_BARS=2;                             /* crossfade = 2 compassos (≈4s @130bpm) */
const KOB_MAX_LAYERS=3, KOB_DECAY_BARS=8;
const kobMtof=m=>440*Math.pow(2,(m-69)/12);
const kobMod=(a,n)=>((a%n)+n)%n;
function kobXfadeSec(){ try{ return Math.max(1.5,Math.min(6,Tone.Time(KOB_XFADE_BARS+'m').toSeconds())); }catch(e){ return 4; } }

/* ---- modo / graus ---- */
function kobThemeMode(){
  if(sonoroModes.__theme) return sonoroModes.__theme;
  const base=sonoroBase||SONORO_SCALES.melancolia, r=Tone.Frequency(base[0]).toMidi();
  const set=new Set(base.map(n=>kobMod(Tone.Frequency(n).toMidi()-r,12)));
  return (sonoroModes.__theme={name:'theme',iv:Array.from(set).sort((a,b)=>a-b)});
}
function kobModeOf(arch){
  const am=KOB_ARCH_MUSIC[arch];
  if(am&&sonoroTrack&&KOB_MODES[am[0]]) return sonoroModes[arch]||(sonoroModes[arch]={name:am[0],iv:KOB_MODES[am[0]]});
  return kobThemeMode();
}
function kobChordSteps(m){ const n=m.iv.length; return KOB_CHORD_STEPS[m.name]||(n>=7?[0,2,4]:n===5?[0,2,3]:[0,1,4]); }
function kobQuoteSteps(m){ const n=m.iv.length, s=kobChordSteps(m); return n>=7?[0,2,4,6]:s.concat([n+s[0]]); }
function kobDeg(m,d){ const n=m.iv.length; return sonoroTonic+12*Math.floor(d/n)+m.iv[kobMod(d,n)]; }
function kobFold(m,lo){ return lo+kobMod(m-lo,12); }
function kobLeadMidis(arch,ev,dense){
  const m=kobModeOf(arch), n=m.iv.length, d=ev.ai%(2*n+1);
  const oc=Math.max(KOB_OCTAVE[arch]||0,-1)*12+(ev.isUppercase?12:0);   /* lead desce no máx. 1 oitava; grave fundo fica p/ pedal/baixo */
  const steps=!ev.chord?[0]:dense?kobQuoteSteps(m):kobChordSteps(m);
  return steps.map(s=>{ let x=kobDeg(m,d+s)+oc; while(x>sonoroTonic+31) x-=12; return x; });
}

/* ---- condução de vozes: inversão mais próxima do acorde anterior ---- */
function kobVL(prev,pcs,lo,hi){
  const near=(pc,ref)=>{ let m=pc+12*Math.round((ref-pc)/12); while(m<lo) m+=12; while(m>hi) m-=12; return m; };
  const out=[], mid=(lo+hi)/2;
  if(!prev||!prev.length){ pcs.forEach((pc,i)=>out.push(near(pc,mid-6+i*4))); }
  else{
    const free=pcs.slice();
    prev.forEach(p=>{ if(!free.length) return; let bi=0,bd=99; free.forEach((pc,i)=>{ const d=Math.abs(near(pc,p)-p); if(d<bd){bd=d;bi=i;} }); out.push(near(free[bi],p)); free.splice(bi,1); });
    free.forEach(pc=>out.push(near(pc,mid)));
  }
  return Array.from(new Set(out)).sort((a,b)=>a-b);
}
/* acorde-pivô: 1º grau cujo acorde (no modo novo) só usa notas que também existem no modo antigo */
function kobPivotDeg(a,b){
  if(!a||!b) return 0;
  const A=new Set(a.iv.map(x=>x%12)), n=b.iv.length, st=kobChordSteps(b);
  const cand=[0,4%n,3%n,5%n,1%n,2%n,6%n];
  for(let i=0;i<cand.length;i++){ const d=cand[i]; if(st.every(s=>A.has(b.iv[kobMod(d+s,n)]%12))) return d; }
  return 0;
}

/* ---- fade potência-igual agendado no clock de áudio ---- */
function kobFade(param,t,dur,to){
  let from=0; try{ from=param.getValueAtTime(t); }catch(e){ from=param.value; }
  from=Math.max(0,Math.min(1,+from||0));
  try{ param.cancelScheduledValues(t); }catch(e){}
  param.setValueAtTime(from,t);
  if(dur<=0.01||from===to){ param.setValueAtTime(to,t); return; }
  const N=12, up=to>from;
  for(let i=1;i<=N;i++){ const x=i/N, w=up?Math.sin(x*Math.PI/2):1-Math.cos(x*Math.PI/2); param.linearRampToValueAtTime(from+(to-from)*w,t+dur*x); }
}

/* ---- vozes LEAD (1 por arquétipo; respeita o timbre escolhido) ---- */
function kobBuildVoice(arch,kind){
  const am=KOB_ARCH_MUSIC[arch]||['ionian','triangle',.5], wave=am[1];
  const gain=new Tone.Gain(0).connect(sonoroDelay);
  let synth;
  if(kind==='pluck'){
    const pk=[0,1,2,3].map(()=>{ const p=new Tone.PluckSynth({attackNoise:.3,dampening:4600,resonance:.9}); p.volume.value=-8; p.connect(gain); return p; }); let pi=0;
    synth={ triggerAttackRelease:(n,d,t)=>{ pk[pi++%4].triggerAttack(Array.isArray(n)?n[0]:n,t); }, releaseAll(){}, dispose(){ pk.forEach(p=>{ try{p.dispose()}catch(e){} }); } };
  }else{
    if(kind==='marimba'){ synth=new Tone.PolySynth(Tone.Synth,{oscillator:{type:wave},envelope:{attack:.005,decay:.2,sustain:.01,release:.4}}); synth.volume.value=-4; }
    else if(kind==='synthwave'){ synth=new Tone.PolySynth(Tone.AMSynth,{harmonicity:2.5,oscillator:{type:wave},envelope:{attack:.03,decay:.2,sustain:.4,release:.8}}); synth.volume.value=-10; }
    else if(kind==='ambient'){ synth=new Tone.PolySynth(Tone.DuoSynth,{vibratoAmount:.5,vibratoRate:5,harmonicity:1.5,voice0:{oscillator:{type:'sine'}},voice1:{oscillator:{type:'triangle'}}}); synth.volume.value=-12; }
    else{ synth=new Tone.PolySynth(Tone.Synth,{oscillator:{type:wave},envelope:{attack:.02,decay:.3,sustain:.2,release:1.2}}); synth.volume.value=-6; }
    try{ synth.maxPolyphony=12; }catch(e){}
    synth.connect(gain);
  }
  return {arch,gain,synth};
}
function kobVoice(arch){ return sonoroVoices[arch]||(sonoroVoices[arch]=kobBuildVoice(arch,sonoroKind)); }
function kobKill(v){ try{ v.synth.releaseAll&&v.synth.releaseAll(); }catch(e){} try{ v.synth.dispose&&v.synth.dispose(); }catch(e){} try{ v.gain.dispose(); }catch(e){} }
function kobPushStack(a){ sonoroStack=sonoroStack.filter(x=>x!==a); sonoroStack.push(a); while(sonoroStack.length>KOB_MAX_LAYERS) sonoroStack.shift(); }

function kobSonoroBegin(theme,synthKey){
  sonoroBase=SONORO_SCALES[theme]||SONORO_SCALES.melancolia;
  sonoroKind=['pluck','softKey','marimba','synthwave','ambient'].indexOf(synthKey)>=0?synthKey:'softKey';
  sonoroTrack=archTrackOn();
  const arch=getArchNow();
  let root=Tone.Frequency(sonoroBase[0]).toMidi();
  if(sonoroTrack&&KOB_ARCH_MUSIC[arch]){ const v=KOB_MIXVOICE(arch); root+=Math.max(-5,Math.min(5,Math.round(6*Math.log2(v.pitch||1)))); }
  sonoroTonic=root;                       /* ← TOM BASE: fixo até o fim do texto */
  sonoroModes={}; sonoroVoices={}; sonoroFading=[]; sonoroStack=[arch]; sonoroLead=arch;
  sonoroPrevChord=null; sonoroPivot=false; sonoroPivotFrom=null; sonoroBarN=0; sonoroEnterBar=0; sonoroChordRoot=0;
  const v=kobVoice(arch); v.gain.gain.cancelScheduledValues(0); v.gain.gain.value=1;
}
function kobStopVoices(){
  const old=sonoroVoices; sonoroVoices={}; sonoroFading=[]; sonoroLead=null; sonoroStack=[];
  try{ ['pad','sawPad','quote'].forEach(k=>{ sonoroSynths[k]&&sonoroSynths[k].releaseAll&&sonoroSynths[k].releaseAll(); }); }catch(e){}
  Object.keys(old).forEach(k=>{ try{ old[k].gain.gain.cancelScheduledValues(Tone.now()); old[k].gain.gain.rampTo(0,.4); }catch(e){} });
  setTimeout(()=>Object.keys(old).forEach(k=>kobKill(old[k])),1200);
}

/* ---- troca de arquétipo = abre voz nova (fade-in) e manda a antiga sair (fade-out) ---- */
function sonoroEnterArch(arch,time){
  if(!sonoroStarted||!sonoroLead||!KOB_ARCH_MUSIC[arch]||arch===sonoroLead) return;
  const xf=kobXfadeSec(), old=sonoroLead, nv=kobVoice(arch);
  sonoroFading=sonoroFading.filter(f=>f.arch!==arch);
  if(sonoroVoices[old]){ kobFade(sonoroVoices[old].gain.gain,time,xf,0); sonoroFading.push({arch:old,until:time+xf}); }
  while(sonoroFading.length>2){ const f=sonoroFading.shift(), v=sonoroVoices[f.arch]; if(v) kobFade(v.gain.gain,time,.15,0); }
  kobFade(nv.gain.gain,time,xf,1);
  sonoroPivotFrom=kobModeOf(old); sonoroPivot=true;
  sonoroLead=arch; kobPushStack(arch); sonoroEnterBar=sonoroBarN;
}
function kobEnterExternal(arch){   /* clique no símbolo / voz TTS — ignora o eco do próprio texto */
  if(!sonoroPlaying||!sonoroStarted) return;
  if(sonoroTL&&sonoroTL.arch===arch&&performance.now()-sonoroTL.t<700) return;
  sonoroEnterArch(arch,Tone.now()+.05);
}

/* ---- eventos de áudio ---- */
function kobLeadPlay(time,ev){
  const targets=[sonoroLead]; sonoroFading.forEach(f=>{ if(time<f.until) targets.push(f.arch); });   /* durante o fade: 2 trilhas juntas */
  targets.forEach(a=>{ const v=sonoroVoices[a]||(a===sonoroLead&&kobVoice(a)); if(v) v.synth.triggerAttackRelease(kobLeadMidis(a,ev,false).map(kobMtof),ev.duration,time); });
  if(ev.isUppercase&&sonoroKind!=='pluck'&&sonoroSynths.pluck) sonoroSynths.pluck.triggerAttackRelease(kobMtof(kobLeadMidis(sonoroLead,{ai:ev.ai,isUppercase:true,chord:false},false)[0]),'8n',time);
}
function kobBarEvent(time,ev){
  sonoroBarN=ev.bar;
  /* reap: descarta vozes que já saíram */
  sonoroFading=sonoroFading.filter(f=>f.until+.5>time&&f.arch!==sonoroLead);
  Object.keys(sonoroVoices).forEach(a=>{ if(a!==sonoroLead&&!sonoroFading.some(f=>f.arch===a)){ kobKill(sonoroVoices[a]); delete sonoroVoices[a]; } });
  if(sonoroStack.length>1&&sonoroBarN-sonoroEnterBar>=KOB_DECAY_BARS){ sonoroStack.shift(); sonoroEnterBar=sonoroBarN; }   /* arranjo respira */
  const arch=sonoroLead, m=kobModeOf(arch), n=m.iv.length, oc=KOB_OCTAVE[arch]||0;
  const prog=KOB_PROG[KOB_BRIGHT[m.name]?'bright':'dark'];
  let root=prog[ev.bar%prog.length];
  if(sonoroPivot){ root=kobPivotDeg(sonoroPivotFrom,m); sonoroPivot=false; }
  sonoroChordRoot=root;
  const steps=kobChordSteps(m).slice(); if(sonoroStack.length>=3&&n>=7) steps.push(6);   /* tétrade com 3 camadas */
  const cs=oc<=-2?-12:0, pcs=steps.map(s=>kobMod(kobDeg(m,root+s),12));
  sonoroPrevChord=kobVL(sonoroPrevChord,pcs,52+cs,74+cs);
  const dur=Tone.Time('1m').toSeconds()*.98;
  if(sonoroSynths.pad) sonoroSynths.pad.triggerAttackRelease(sonoroPrevChord.map(kobMtof),dur,time);
  const low=kobFold(sonoroTonic,oc<=-1?36:48);                                           /* pedal: tônica + 5ª, sempre */
  if(sonoroSynths.sawPad) sonoroSynths.sawPad.triggerAttackRelease([kobMtof(low),kobMtof(low+7)],dur,time);
}
function kobBeatEvent(time,ev){
  const depth=sonoroStack.length; if(depth<2) return;
  const pos=ev.beat%4, prevA=sonoroStack[sonoroStack.length-2], pm=kobModeOf(prevA), lm=kobModeOf(sonoroLead);
  if(depth>=3||pos%2===0){   /* contracanto: arpejo no modo do arquétipo anterior sobre o acorde atual */
    const st=kobChordSteps(pm);
    if(sonoroSynths.pluck) sonoroSynths.pluck.triggerAttackRelease(kobMtof(kobDeg(pm,sonoroChordRoot+st[pos%st.length])+12),'8n',time);
  }
  if(depth>=3&&pos%2===0&&sonoroSynths.bass) sonoroSynths.bass.triggerAttackRelease(kobMtof(kobFold(kobDeg(lm,sonoroChordRoot),24)),'8n',time);
}
function kobSonoroEvent(time,ev){
  try{
    switch(ev.type){
      case 'arch': sonoroEnterArch(ev.arch,time); break;
      case 'main': kobLeadPlay(time,ev); break;
      case 'quote': sonoroSynths.quote.triggerAttackRelease(kobLeadMidis(sonoroLead,ev,true).map(kobMtof),ev.duration,time); break;
      case 'bass': { const lm=kobModeOf(sonoroLead), d=ev.ch==='!'?2:ev.ch==='?'?4:0; sonoroSynths.bass.triggerAttackRelease(kobMtof(kobFold(kobDeg(lm,d),24)),ev.duration,time); break; }
      case 'bar': kobBarEvent(time,ev); break;
      case 'beat': kobBeatEvent(time,ev); break;
    }
  }catch(e){ console.warn('[sonoro v84]',e); }
}

function parseTextToAudioEvents(text, theme) {
  /* [v84] o evento carrega só o ÍNDICE da letra (ai); a nota é resolvida em tempo real no modo do
     arquétipo vivo (permite troca ao vivo + crossfade). Gera também eventos de compasso/tempo. */
  const events = [];
  const trig = archTriggers(text); let ti = 0;
  let step = 0, inQuote = false, wordStart = true;
  const SD = Tone.Time('16n').toSeconds();

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const charLower = char.toLowerCase();
    const isUppercase = char !== charLower && SONORO_ALPHABET.includes(charLower);
    while (ti < trig.length && trig[ti].index <= i) { events.push({ time: step * SD, type: 'arch', arch: trig[ti].arch, index: i }); ti++; }

    if (char === '"' || char === '“' || char === '”' || char === "'") {
      inQuote = !inQuote; wordStart = true;
      events.push({ time: step * SD, char, index: i, type: 'quote-mark' });
      step += 1; continue;
    }
    if (char === ' ' || char === '\n') {
      wordStart = true;
      events.push({ time: step * SD, char, index: i, type: 'space' });
      step += char === '\n' ? 3 : 1; continue;
    }
    if (char === '.' || char === '!' || char === '?') {
      wordStart = true;
      events.push({ time: step * SD, char, index: i, type: 'bass', ch: char, duration: '4n' });
      step += 4; continue;
    }
    if (char === ',' || char === ';') {
      wordStart = true;
      events.push({ time: step * SD, char, index: i, type: 'punct-pause' });
      step += 2; continue;
    }
    const ai = SONORO_ALPHABET.indexOf(charLower);
    if (ai !== -1) {
      events.push({
        time: step * SD, char, index: i,
        type: inQuote ? 'quote' : 'main',
        isUppercase, ai,
        chord: wordStart || isUppercase,          /* acorde só no início de palavra / maiúscula */
        duration: isUppercase ? '8n' : '16n'
      });
      wordStart = false;
      step += isUppercase ? 1.8 : 1.4;
    } else {
      events.push({ time: step * SD, char, index: i, type: 'symbol' });
      step += 1;
    }
  }
  const end = step * SD;
  const beatS = KOB_BEAT_STEPS * SD;
  for (let k = 0, t = 0; t < end; k++, t = k * beatS) {
    if (k % (KOB_BAR_STEPS / KOB_BEAT_STEPS) === 0) events.push({ time: t, type: 'bar', bar: k / (KOB_BAR_STEPS / KOB_BEAT_STEPS) });
    events.push({ time: t, type: 'beat', beat: k });
  }
  events.push({ time: end, type: 'end' });
  const pr = { arch: 0, bar: 1, beat: 2, end: 4 };
  return events.map((e, n) => [e, n]).sort((x, y) => (x[0].time - y[0].time) || ((pr[x[0].type] ?? 3) - (pr[y[0].type] ?? 3)) || (x[1] - y[1])).map(p => p[0]);
}

function renderSonoroViz(text) {
  const viz = document.getElementById('sonoroViz');
  if (!viz) return;
  viz.innerHTML = '';
  sonoroSpanElements = [];
  for (let i = 0; i < text.length; i++) {
    const span = document.createElement('span');
    span.id = `sch-${i}`;
    span.className = 'sch';
    if (text[i] === '\n') span.innerHTML = '<br>';
    else if (text[i] === ' ') { span.innerHTML = '&nbsp;'; span.classList.add('sch-space'); }
    else span.textContent = text[i];
    viz.appendChild(span);
    sonoroSpanElements.push(span);
  }
}

function setupSonoroCanvas() {
  const c = document.getElementById('sonoroCanvas');
  if (!c) return;
  const dpr = window.devicePixelRatio || 1;
  const rect = c.getBoundingClientRect();
  c.width = rect.width * dpr;
  c.height = rect.height * dpr;
  const ctx = c.getContext('2d');
  ctx.setTransform(1,0,0,1,0,0);
  ctx.scale(dpr, dpr);
}

function drawSonoroWaveform() {
  const _s = document.getElementById('sonoroSection');
  if (document.hidden || (_s && _s.dataset.suspended === '1')) {
    sonoroRaf = null;
    return;
  }
  const c = document.getElementById('sonoroCanvas');
  if (!c) {
    sonoroRaf = null;
    return;
  }
  sonoroRaf = requestAnimationFrame(drawSonoroWaveform);
  const ctx = c.getContext('2d');
  const w = c.getBoundingClientRect().width;
  const h = c.getBoundingClientRect().height;

  ctx.fillStyle = 'rgba(2,6,23,0.35)';
  ctx.fillRect(0, 0, w, h);

  ctx.strokeStyle = 'rgba(123,97,255,0.08)';
  ctx.lineWidth = 1;
  for (let y = 0; y <= h; y += 16) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
  }

  if (!sonoroAnalyser || !sonoroPlaying) {
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(123,97,255,0.28)';
    ctx.lineWidth = 1.5;
    ctx.moveTo(0, h/2);
    ctx.lineTo(w, h/2);
    ctx.stroke();
    return;
  }

  const values = sonoroAnalyser.getValue();
  ctx.beginPath();
  ctx.lineWidth = 2;
  ctx.strokeStyle = '#00f5ff';
  ctx.shadowColor = 'rgba(0,245,255,0.7)';
  ctx.shadowBlur = 8;

  const slice = w / values.length;
  let x = 0;
  for (let i = 0; i < values.length; i++) {
    const v = values[i];
    const y = ((v + 1) / 2) * h;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
    x += slice;
  }
  ctx.lineTo(w, h/2);
  ctx.stroke();
  ctx.shadowBlur = 0;
}

/* O loop só volta quando a área sonora pode desenhar novamente. */
function resumeSonoroWaveform() {
  const section = document.getElementById('sonoroSection');
  const canvas = document.getElementById('sonoroCanvas');
  if (!document.hidden && canvas && (!section || section.dataset.suspended !== '1') && !sonoroRaf) {
    drawSonoroWaveform();
  }
}
document.addEventListener('visibilitychange', resumeSonoroWaveform);
document.addEventListener('kob:resume', resumeSonoroWaveform);

function renderSonoroInOut() {
  const out = document.getElementById('out');
  if (!out) return;
  const text = ((window.KOBActive&&String(KOBActive.text||'').trim())?KOBActive.text:null) || state.dictApplied || '';
  if (!text.trim()) {
    out.innerHTML = '<div class="dict-empty">Funde textos para sintetizar sonoramente.</div>';
    return;
  }
  out.innerHTML = `
    <div class="sonoro-wrap">
      <div class="sonoro-canvas-wrap"><canvas id="sonoroCanvas"></canvas></div>
      <div id="sonoroViz" class="sonoro-viz"></div>
      <div class="sonoro-hint">Letras → notas · MAIÚSCULAS → +oitava · "citações" → timbre FM · . ! ? → graves</div>
    </div>
  `;
  renderSonoroViz(text);
  setupSonoroCanvas();
  if (!sonoroRaf) drawSonoroWaveform();
}

function updateSonoroUI() {
  const playBtn = document.getElementById('sonoroPlayBtn');
  if (playBtn) {
    playBtn.classList.toggle('active', sonoroPlaying);
    playBtn.textContent = sonoroPlaying ? 'Ⅱ' : '▷';
  }
  document.querySelectorAll('[data-action="play-sonoro"]').forEach(b => {
    b.classList.toggle('playing', sonoroPlaying);
    b.textContent = sonoroPlaying? 'Ⅱ' : '♫';
    b.title = sonoroPlaying ? 'Parar síntese' : 'Sintetizar melodia';
  });
  window.dispatchEvent(new CustomEvent('kob:sonoro-state', { detail:{ playing: sonoroPlaying } }));   /* [v80] header: marquee só enquanto toca */
}

async function startSonoroPlayback() {
  await KOBLoadTone();
  if (!sonoroToneAvailable()) {
    alert('Motor de áudio indisponível (Tone.js não carregou).');
    return;
  }
  const text = ((window.KOBActive&&String(KOBActive.text||'').trim())?KOBActive.text:null) || state.dictApplied || '';
  if (!text.trim()) { alert('Funde os textos primeiro'); return; }
  if (SNS.auto) applyProfile(lexicalProfile(text));   /* [v80] léxico do texto ativo → BPM/escala/timbre/reverb */

  if (sonoroPlaying) { stopSonoroPlayback(); return; }

  await KOBLoadTone();
  try { await Tone.start(); } catch (e) {}
  if (!initSonoroEngine()) return;

  if (!document.getElementById('sonoroViz')) renderSonoroInOut();

  renderSonoroViz(text);

  const themeEl = document.getElementById('sonoroTheme');
  const synthEl = document.getElementById('sonoroSynth');
  const theme = themeEl ? themeEl.value : 'melancolia';
  const synthKey = synthEl ? synthEl.value : 'softKey';

  const events = parseTextToAudioEvents(text, theme);

  if (sonoroPart) { sonoroPart.dispose(); sonoroPart = null; }
  Tone.Transport.stop();
  Tone.Transport.cancel(0);
  kobSonoroBegin(theme, synthKey);   /* [v84] fixa o tom base, abre a 1ª camada */

  sonoroPart = new Tone.Part((time, ev) => {
    if (ev.type === 'end') {
      Tone.Draw.schedule(() => { stopSonoroPlayback(); }, time);
      return;
    }
    kobSonoroEvent(time, ev);   /* [v84] áudio: camadas, crossfade, acordes */
    if (ev.type === 'arch') { Tone.Draw.schedule(() => { sonoroTL = { arch: ev.arch, t: performance.now() }; window.KOB_ARCHSWITCH && KOB_ARCHSWITCH(ev.arch); }, time); return; }
    if (ev.type === 'bar' || ev.type === 'beat') return;

    Tone.Draw.schedule(() => {
      if (ev.index === undefined) return;
      if (window.KOB_HOLO && ev.type !== 'space') KOB_HOLO('m', ev.index, text);
      const span = sonoroSpanElements[ev.index];
      if (!span) return;
      let cls = 'sch-main';
      if (ev.type === 'quote' || ev.type === 'quote-mark') cls = 'sch-quote';
      else if (ev.isUppercase) cls = 'sch-accent';
      else if (ev.type === 'bass' || ev.type === 'punct-pause') cls = 'sch-punct';

      span.classList.add(cls);
      if (ev.index % 14 === 0 && span.scrollIntoView) {
        span.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
      setTimeout(() => span.classList.remove(cls), 220);
    }, time);
  }, events).start(0);

  Tone.Transport.start();
  sonoroPlaying = true;
  updateSonoroUI();
}

function stopSonoroPlayback() {
  if (sonoroPart) { try { sonoroPart.dispose(); } catch(e){} sonoroPart = null; }
  if (sonoroToneAvailable()) {
    try { Tone.Transport.stop(); Tone.Transport.cancel(0); } catch(e){}
    try { kobStopVoices(); } catch(e){}   /* [v84] fade curto + descarta camadas */
  }
  sonoroSpanElements.forEach(s => { s.className = 'sch' + (s.classList.contains('sch-space') ? ' sch-space' : ''); });
  sonoroPlaying = false;
  updateSonoroUI();
}

/* =========================================================
   REFRESH
========================================================= */
function refreshAll() {
  const prevText = state.dictApplied;

  if (state.dictEnabled && state.dictRules.length) {
    const r = applyDictionary(state.rawMerge, state.dictRules);
    state.dictApplied = r.text;
    window.__lastSubs = r.total;
  } else {
    state.dictApplied = state.rawMerge;
    window.__lastSubs = 0;
  }

  if (sonoroPlaying && state.dictApplied !== prevText) {
    stopSonoroPlayback();
  }

  state.formatted = formatText(state.dictApplied);
  state.slices = makeSlices(state.dictApplied);

  renderResultView();
  updateDictStats();
  updateResultSummary();
}

function renderResultView() {
  const out = document.getElementById('out');
  if (!out) return;
  const view = state.view;

  document.querySelectorAll('.view-tab').forEach(t => t.classList.toggle('active', t.dataset.view === view));

  const sr = document.getElementById('stripRaw');
  const sg = document.getElementById('stripRich');
  const ss = document.getElementById('stripSlices');
  const sSo = document.getElementById('stripSonoro');
  if (sr) sr.style.display = view === 'raw' ? 'flex' : 'none';
  if (sg) sg.style.display = view === 'rich' ? 'flex' : 'none';
  if (ss) ss.style.display = view === 'slices' ? 'flex' : 'none';
  if (sSo) sSo.style.display = view === 'sonoro' ? 'flex' : 'none';

  if (view === 'raw') {
    const info = document.getElementById('stripRawInfo');
    if (info) {
      const len = state.dictApplied.length;
      info.innerHTML = `<b>${len.toLocaleString('pt-BR')}</b> caracteres · <b>${state.slices.length}</b> fatias · ${state.dictEnabled ? 'Pato ON' : 'Pato OFF'}`;
    }
  }

  out.classList.toggle('rich', view === 'rich' || view === 'sonoro');

  if (view === 'raw') { out.textContent = state.dictApplied; out.scrollTop = 0; return; }
  if (view === 'rich') { out.innerHTML = state.dictApplied ? MD.render(state.dictApplied) : ''; out.scrollTop = 0; return; }
  if (view === 'slices') { renderSlicesInOut(); return; }
  if (view === 'sonoro') { renderSonoroInOut(); return; }
}

function renderSlicesInOut() {
  const out = document.getElementById('out');
  if (!out) return;
  const slices = state.slices;

  if (!slices.length) {
    out.innerHTML = '<div class="dict-empty">Sem fatias. Funde textos primeiro.</div>';
    updateSliceCounter();
    return;
  }

  if (state.sliceShowAll) {
    out.innerHTML = slices.map((s, i) => sliceCardHTML(s, i)).join('');
  } else {
    const idx = Math.max(0, Math.min(state.sliceIndex, slices.length - 1));
    out.innerHTML = sliceCardHTML(slices[idx], idx);
  }
  out.scrollTop = 0;
  updateSliceCounter();
}

function sliceCardHTML(text, i) {
  const total = state.slices.length;
  const title = sliceTitle(text);
  const rich = MD.render(text);
  return `
    <div class="slice-card">
      <div class="slice-tag">${String(i+1).padStart(2,'0')} / ${String(total).padStart(2,'0')}</div>
      <div class="slice-title">${title}</div>
      <div class="slice-body rich">${rich}</div>
      <div class="slice-actions">
        <button type="button" data-slice-copy="${i}">⧉ Copiar</button>
        <button type="button" data-slice-to-seed="${i}">→ Semente</button>
        <button type="button" data-slice-to-mirror="${i}">→ Espelho</button>
        <button type="button" data-slice-play="${i}">🎧 Ouvir</button>
      </div>
    </div>
  `;
}

function updateSliceCounter() {
  const el = document.getElementById('sliceCounter');
  if (!el) return;
  const total = state.slices.length;
  const cur = total ? (state.sliceIndex + 1) : 0;
  el.innerHTML = `${state.sliceShowAll ? 'TODAS' : 'FATIA'} <b>${cur}</b>/${total}`;
}

function updateResultSummary() {
  const el = document.getElementById('resultSummaryText');
  if (!el) return;
  if (!state.rawMerge) {
    el.textContent = 'Fusão Fractal · 369';
  } else {
    const len = state.dictApplied.length;
    el.textContent = `${len.toLocaleString('pt-BR')} chars · ${state.dictEnabled ? 'Pato ON' : 'OFF'} · ${state.slices.length} fatias`;
  }
}

function updateDictStats() {
  const total = state.dictRules.length;
  const active = state.dictRules.filter(r => r.enabled).length;
  const subs = window.__lastSubs || 0;
  const a = document.getElementById('dsRules');
  const b = document.getElementById('dsActive');
  const c = document.getElementById('dsSubs');
  if (a) a.textContent = total;
  if (b) b.textContent = active;
  if (c) c.textContent = subs;
}

/* =========================================================
   MERGE
========================================================= */
function fractalMerge() {
  const t1 = document.getElementById('t1').value.trim();
  const t2 = document.getElementById('t2').value.trim();
  if (!t1 || !t2) { alert('Cola 2 textos primeiro'); return; }

  state.rawMerge = motor369.merge(t1, t2);

  document.getElementById('resultPanel').style.display = 'block';
  const empty = document.getElementById('resultEmpty');
  if (empty) empty.style.display = 'none';

  localStorage.setItem('fractal_ultimo', state.rawMerge);
  localStorage.setItem('fractal_t1', t1);
  localStorage.setItem('fractal_t2', t2);

  refreshAll();

  const r = document.getElementById('sessionResult');
  if (r) { r.open = true; localStorage.setItem('session_result_open','1'); }

  document.getElementById('archSelect').style.display = 'block';
  document.getElementById('btn78k').style.display = 'block';
}

/* =========================================================
   HELPERS
========================================================= */
function getResultado() {
  const out = document.getElementById('out');
  return (out?.textContent || localStorage.getItem('fractal_ultimo') || '').trim();
}

function abrirSessao(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.open = true;
}

/* =========================================================
   ACTIONS
========================================================= */
async function colarNoCampo(id) {
  const campo = document.getElementById(id);
  if (!campo) return;
  try {
    const txt = await navigator.clipboard.readText();
    if (!txt) { alert('O clipboard está vazio'); return; }
    campo.value = txt;
    campo.dispatchEvent(new Event('input', {bubbles:true}));
    campo.focus();
    localStorage.setItem(id === 't1' ? 'fractal_t1' : 'fractal_t2', txt);
  } catch (e) {
    alert('O acesso ao clipboard foi bloqueado. Toque no campo e use Colar do sistema.');
  }
}

async function copiarResultado() {
  const txt = state.dictApplied || getResultado();
  if (!txt) { alert('Gera um resultado primeiro'); return; }
  try {
    await navigator.clipboard.writeText(txt);
    alert('Resultado copiado');
  } catch (e) {
    const ta = document.createElement('textarea');
    ta.value = txt; ta.style.position = 'fixed'; ta.style.opacity = '0';
    document.body.appendChild(ta); ta.select();
    document.execCommand('copy'); ta.remove();
    alert('Resultado copiado');
  }
}

function baixarResultado() {
  const txt = state.dictApplied || getResultado();
  if (!txt) { alert('Gera um resultado primeiro'); return; }
  const blob = new Blob([txt], {type: 'text/plain;charset=utf-8'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const stamp = new Date().toISOString().replace(/[:.]/g,'-');
  a.href = url;
  a.download = `espaco-da-mente-${stamp}.txt`;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function resultadoParaSemente() {
  const txt = getResultado();
  if (!txt) { alert('Gera um resultado primeiro'); return; }
  const c = document.getElementById('t1');
  c.value = txt;
  localStorage.setItem('fractal_t1', txt);
  abrirSessao('sessionSeed');
  c.focus();
}

function resultadoParaEspelho() {
  const txt = getResultado();
  if (!txt) { alert('Gera um resultado primeiro'); return; }
  const c = document.getElementById('t2');
  c.value = txt;
  localStorage.setItem('fractal_t2', txt);
  abrirSessao('sessionMirror');
  c.focus();
}

function inverterSementeEspelho() {
  const t1 = document.getElementById('t1');
  const t2 = document.getElementById('t2');
  const v = t1.value;
  t1.value = t2.value;
  t2.value = v;
  localStorage.setItem('fractal_t1', t1.value);
  localStorage.setItem('fractal_t2', t2.value);
  t1.dispatchEvent(new Event('input',{bubbles:true}));
  t2.dispatchEvent(new Event('input',{bubbles:true}));
}

function limparCampo(id) {
  const c = document.getElementById(id);
  if (!c) return;
  c.value = '';
  c.dispatchEvent(new Event('input',{bubbles:true}));
  localStorage.setItem(id === 't1' ? 'fractal_t1' : 'fractal_t2', '');
}

function toggleDictionary() {
  state.dictEnabled = !state.dictEnabled;
  localStorage.setItem('fractal_dict_enabled', state.dictEnabled ? '1' : '0');
  updateDictToggleUI();
  refreshAll();
}

function updateDictToggleUI() {
  const t = document.querySelector('[data-action="toggle-dict"]');
  if (t) {
    t.classList.toggle('on', state.dictEnabled);
    t.setAttribute('aria-checked', state.dictEnabled ? 'true' : 'false');
  }
}

/* =========================================================
   DICIONÁRIO — UI
========================================================= */
function renderRules() {
  const list = document.getElementById('rulesList');
  if (!list) return;
  list.innerHTML = '';

  if (!state.dictRules.length) {
    list.innerHTML = '<div class="dict-empty">Nenhuma regra. Carrega um preset ou cria uma regra do zero.</div>';
    updateDictStats();
    return;
  }

  state.dictRules.forEach((rule, i) => {
    const row = document.createElement('div');
    row.className = 'rule' + (rule.enabled ? ' on' : '') + (rule.wholeWord ? ' wb-on' : '');

    const chk = document.createElement('div');
    chk.className = 'chk';
    chk.title = 'Ativar/desativar';
    chk.textContent = rule.enabled ? '✓' : '';

    const from = document.createElement('input');
    from.type = 'text';
    from.dataset.field = 'from';
    from.value = rule.from;
    from.placeholder = 'de / diário';

    const arrow = document.createElement('div');
    arrow.className = 'arrow';
    arrow.textContent = '→';

    const to = document.createElement('input');
    to.type = 'text';
    to.dataset.field = 'to';
    to.value = rule.to;
    to.placeholder = 'ðŸ¦† / PaTo†';

    const wb = document.createElement('div');
    wb.className = 'wb';
    wb.title = 'Palavra inteira';
    wb.textContent = 'WB';

    const del = document.createElement('button');
    del.type = 'button';
    del.className = 'del';
    del.textContent = '✕';

    chk.addEventListener('click', (e) => {
      e.stopPropagation();
      state.dictRules[i].enabled = !state.dictRules[i].enabled;
      saveRules(); renderRules(); refreshAll();
    });
    wb.addEventListener('click', (e) => {
      e.stopPropagation();
      state.dictRules[i].wholeWord = !state.dictRules[i].wholeWord;
      saveRules(); renderRules(); refreshAll();
    });
    del.addEventListener('click', (e) => {
      e.stopPropagation();
      state.dictRules.splice(i, 1);
      saveRules(); renderRules(); refreshAll();
    });

    [from, to].forEach(inp => {
      inp.addEventListener('input', (e) => {
        state.dictRules[i][e.target.dataset.field] = e.target.value;
        saveRules(); refreshAll();
      });
      inp.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') { e.preventDefault(); refreshAll(); }
      });
      inp.addEventListener('click', e => e.stopPropagation());
    });

    row.append(chk, from, arrow, to, wb, del);
    list.appendChild(row);
  });

  updateDictStats();
}

function saveRules() {
  try { localStorage.setItem('fractal_dict_rules', JSON.stringify(state.dictRules)); } catch(e){}
}
function loadRules() {
  try {
    const s = localStorage.getItem('fractal_dict_rules');
    if (s) { const p = JSON.parse(s); if (Array.isArray(p)) return p; }
  } catch(e){}
  return [];
}

function bindDictPresets() {
  document.querySelectorAll('.dict-preset').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const key = btn.dataset.preset;
      if (key === 'vazio') {
        if (!confirm('Limpar todas as regras?')) return;
        state.dictRules = [];
        saveRules(); renderRules(); refreshAll();
        return;
      }
      const preset = DICT_PRESETS[key];
      if (!preset) return;
      state.dictRules = JSON.parse(JSON.stringify(preset));
      saveRules(); renderRules(); refreshAll();
    });
  });

  const add = document.getElementById('addRuleBtn');
  if (add) add.addEventListener('click', (e) => {
    e.stopPropagation();
    state.dictRules.push({from:'', to:'', wholeWord:true, enabled:true});
    saveRules(); renderRules();
    const last = document.getElementById('rulesList').lastElementChild;
    if (last) { const inp = last.querySelector('input[data-field="from"]'); if (inp) inp.focus(); }
  });

  const exp = document.getElementById('exportRulesBtn');
  if (exp) exp.addEventListener('click', (e) => {
    e.stopPropagation();
    const blob = new Blob([JSON.stringify(state.dictRules, null, 2)], {type:'application/json'});
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'pato-do-mundo-rules.json';
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  });

  const imp = document.getElementById('importRulesBtn');
  const impFile = document.getElementById('importFile');
  if (imp && impFile) {
    imp.addEventListener('click', (e) => { e.stopPropagation(); impFile.click(); });
    impFile.addEventListener('change', async (e) => {
      const f = e.target.files[0];
      if (!f) return;
      try {
        const txt = await f.text();
        const parsed = JSON.parse(txt);
        if (!Array.isArray(parsed)) throw new Error('JSON inválido');
        state.dictRules = parsed.map(r => ({
          from: String(r.from ?? ''),
          to: String(r.to ?? ''),
          wholeWord: !!r.wholeWord,
          enabled: r.enabled !== false
        }));
        saveRules(); renderRules(); refreshAll();
      } catch (err) { alert('Falha ao importar JSON'); }
      e.target.value = '';
    });
  }
}

/* =========================================================
   FORMATTER UI
========================================================= */
function bindFmtToggles() {
  document.querySelectorAll('.fmt-toggle').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const key = btn.dataset.fmt;
      state.fmt[key] = !state.fmt[key];
      btn.classList.toggle('on', state.fmt[key]);
      saveFmtConfig();
      refreshAll();
    });
  });
  const wi = document.getElementById('fmtWords');
  if (wi) {
    wi.addEventListener('input', (e) => {
      const v = Math.max(4, Math.min(60, parseInt(e.target.value, 10) || 12));
      state.fmt.wordsPerParagraph = v;
      saveFmtConfig();
      refreshAll();
    });
    wi.addEventListener('click', e => e.stopPropagation());
  }
}

function saveFmtConfig() {
  try { localStorage.setItem('fractal_fmt_config', JSON.stringify(state.fmt)); } catch(e){}
}
function loadFmtConfig() {
  try {
    const s = localStorage.getItem('fractal_fmt_config');
    if (s) {
      const p = JSON.parse(s);
      if (p && typeof p === 'object') state.fmt = {...state.fmt, ...p};
    }
  } catch(e){}
}
function syncFmtUI() {
  document.querySelectorAll('.fmt-toggle').forEach(btn => {
    const key = btn.dataset.fmt;
    btn.classList.toggle('on', !!state.fmt[key]);
  });
  const wi = document.getElementById('fmtWords');
  if (wi) wi.value = state.fmt.wordsPerParagraph;
}

/* =========================================================
   SLICER UI
========================================================= */
function bindSlicer() {
  const sz = document.getElementById('sliceSize');
  if (sz) {
    sz.addEventListener('input', (e) => {
      state.sliceSize = Math.max(80, Math.min(2000, parseInt(e.target.value,10) || 420));
      if (state.sliceMode === 'char') {
        state.slices = makeSlices(state.dictApplied);
        state.sliceIndex = 0;
        renderSlicesInOut();
        restartTTSIfPlaying();
      }
    });
    sz.addEventListener('click', e => e.stopPropagation());
  }

  document.querySelectorAll('.slice-mode').forEach(b => {
    b.addEventListener('click', (e) => {
      e.stopPropagation();
      const mode = b.dataset.slicemode;
      state.sliceMode = mode;
      document.querySelectorAll('.slice-mode').forEach(x => x.classList.toggle('active', x.dataset.slicemode === mode));
      state.slices = makeSlices(state.dictApplied);
      state.sliceIndex = 0;
      renderSlicesInOut();
      restartTTSIfPlaying();
    });
  });

  document.querySelectorAll('.slice-mode').forEach(x => {
    x.classList.toggle('active', x.dataset.slicemode === state.sliceMode);
  });

  const sp = document.getElementById('slicePlayBtn');
  if (sp) sp.addEventListener('click', (e) => {
    e.stopPropagation();
    const slice = state.slices[state.sliceIndex] || state.dictApplied;
    toggleTTS(slice);
  });
}

/* =========================================================
   SONORO UI
========================================================= */
function bindSonoro() {
  const themeEl = document.getElementById('sonoroTheme');
  const synthEl = document.getElementById('sonoroSynth');
  const bpmEl = document.getElementById('sonoroBpm');
  const revEl = document.getElementById('sonoroReverb');
  const playBtn = document.getElementById('sonoroPlayBtn');
  const stopBtn = document.getElementById('sonoroStopBtn');

  [themeEl, synthEl].forEach(el => {
    if (!el) return;
    el.addEventListener('click', e => e.stopPropagation());
    el.addEventListener('change', () => {
      if (sonoroPlaying) { stopSonoroPlayback(); setTimeout(startSonoroPlayback, 80); }
    });
  });

  if (bpmEl) {
    bpmEl.addEventListener('click', e => e.stopPropagation());
    bpmEl.addEventListener('input', () => {
      if (sonoroStarted && sonoroToneAvailable()) {
        Tone.Transport.bpm.rampTo(parseInt(bpmEl.value,10) || 130, 0.2);
      }
    });
  }

  if (revEl) {
    revEl.addEventListener('click', e => e.stopPropagation());
    revEl.addEventListener('input', () => {
      if (sonoroReverb) sonoroReverb.wet.value = Math.max(0, Math.min(100, parseInt(revEl.value,10) || 0)) / 100;
    });
  }

  if (playBtn) playBtn.addEventListener('click', (e) => { e.stopPropagation(); startSonoroPlayback(); });
  if (stopBtn) stopBtn.addEventListener('click', (e) => { e.stopPropagation(); stopSonoroPlayback(); });

  window.addEventListener('resize', () => {
    if (state.view === 'sonoro') setupSonoroCanvas();
  });
}

/* =========================================================
   VIEW TABS + SLICER NAV
========================================================= */
function bindViewTabs() {
  document.querySelectorAll('.view-tab').forEach(t => {
    t.addEventListener('click', (e) => {
      e.stopPropagation();
      const newView = t.dataset.view;
      if (newView !== 'sonoro' && sonoroPlaying) stopSonoroPlayback();
      state.view = newView;
      state.sliceShowAll = false;
      renderResultView();
      if (ttsPlaying) restartTTSIfPlaying();
    });
  });

  document.querySelectorAll('[data-slice]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const k = btn.dataset.slice;
      const total = state.slices.length;
      if (!total) return;
      if (k === 'next') {
        if (state.sliceShowAll) return;
        state.sliceIndex = (state.sliceIndex + 1) % total;
      } else if (k === 'prev') {
        if (state.sliceShowAll) return;
        state.sliceIndex = (state.sliceIndex - 1 + total) % total;
      } else if (k === 'all') {
        state.sliceShowAll = !state.sliceShowAll;
      }
      renderSlicesInOut();
      restartTTSIfPlaying();
    });
  });
}

/* =========================================================
   SLICE ACTIONS
========================================================= */
document.addEventListener('click', (e) => {
  const copy = e.target.closest('[data-slice-copy]');
  if (copy) {
    const i = parseInt(copy.dataset.sliceCopy, 10);
    const t = state.slices[i];
    if (t) {
      navigator.clipboard?.writeText(t).then(() => {
        copy.textContent = '✓ Copiado';
        setTimeout(() => copy.textContent = '⧉ Copiar', 1400);
      });
    }
    return;
  }
  const toSeed = e.target.closest('[data-slice-to-seed]');
  if (toSeed) {
    const i = parseInt(toSeed.dataset.sliceToSeed, 10);
    const t = state.slices[i];
    if (t) {
      const c = document.getElementById('t1');
      c.value = t;
      localStorage.setItem('fractal_t1', t);
      abrirSessao('sessionSeed');
    }
    return;
  }
  const toMirror = e.target.closest('[data-slice-to-mirror]');
  if (toMirror) {
    const i = parseInt(toMirror.dataset.sliceToMirror, 10);
    const t = state.slices[i];
    if (t) {
      const c = document.getElementById('t2');
      c.value = t;
      localStorage.setItem('fractal_t2', t);
      abrirSessao('sessionMirror');
    }
    return;
  }
  const play = e.target.closest('[data-slice-play]');
  if (play) {
    const i = parseInt(play.dataset.slicePlay, 10);
    const t = state.slices[i];
    if (t) {
      state.sliceIndex = i;
      renderSlicesInOut();
      toggleTTS(t);
    }
    return;
  }
});

/* =========================================================
   GLOBAL ACTIONS
========================================================= */
document.addEventListener('click', (event) => {
  const action = event.target.closest('#sonetoRoot [data-action], #main-header2 [data-action]');   /* [v79] só o que é do Soneto */
  if (!action) return;
  event.preventDefault();
  event.stopPropagation();

  const tipo = action.dataset.action;
  const target = action.dataset.target;

  switch (tipo) {
    case 'import': {
      const fileId = action.dataset.file;
      const input = document.getElementById(fileId);
      if (input) input.click();
      break;
    }
    case 'paste': colarNoCampo(target); break;
    case 'clear-field': limparCampo(target); break;
    case 'copy-result': copiarResultado(); break;
    case 'download-result': baixarResultado(); break;
    case 'result-to-seed': resultadoParaSemente(); break;
    case 'result-to-mirror': resultadoParaEspelho(); break;
    case 'swap': inverterSementeEspelho(); break;
    case 'toggle-dict': toggleDictionary(); break;
    case 'toggle-tts': toggleTTS(); break;
    case 'play-sonoro':
      { const _a=((window.KOBActive&&String(KOBActive.text||'').trim())?KOBActive.text:null); if (!state.dictApplied && _a) state.dictApplied = _a; }
      if (!state.dictApplied) { alert('Ative um documento (pílula) ou funde os textos'); break; }
      state.view = 'sonoro';
      renderResultView();
      setTimeout(startSonoroPlayback, 60);
      break;
    default: break;
  }
}, true);

/* =========================================================
   FILE INPUT
========================================================= */
function lerArquivo(input, textareaId) {
  if (!input) return;
  input.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      let txt = ev.target.result;
      if (file.name.toLowerCase().endsWith('.html')) {
        const div = document.createElement('div');
        div.innerHTML = txt;
        txt = div.textContent || div.innerText || '';
      }
      const c = document.getElementById(textareaId);
      c.value = txt;
      if (window.KOBActive) KOBActive.set(file.name.replace(/\.[^.]+$/,''), txt);   /* [v80] arquivo ativo no header */
      c.dispatchEvent(new Event('input',{bubbles:true}));
      localStorage.setItem(textareaId === 't1' ? 'fractal_t1' : 'fractal_t2', txt);
      abrirSessao(textareaId === 't1' ? 'sessionSeed' : 'sessionMirror');
      input.value = '';
      afterImport();   /* [v80] semente+espelho presentes → fusão automática */
    };
    reader.readAsText(file);
  });
}

/* =========================================================
   SESSION PERSISTENCE
========================================================= */
const SESSION_KEYS = {
  sessionSeed: 'session_seed_open',
  sessionMirror: 'session_mirror_open',
  sessionResult: 'session_result_open',
  sessionDictionary: 'session_dictionary_open'
};

function bindDetailsPersistence() {
  Object.entries(SESSION_KEYS).forEach(([id, key]) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.open = localStorage.getItem(key) === '1';
    el.addEventListener('toggle', () => {
      localStorage.setItem(key, el.open ? '1' : '0');
    });
  });
}

/* =========================================================
   DRAG & DROP
========================================================= */
function bindDragDrop() {
  const sections = document.querySelectorAll('.collapse-section');

  sections.forEach(section => {
    const summary = section.querySelector('.collapse-summary');
    if (!summary) return;

    summary.addEventListener('dragstart', (e) => {
      if (e.target.closest('button, input, select, textarea, .toggle-switch, .mxp-action, .output-control')) {
        e.preventDefault();
        return;
      }
      e.dataTransfer.setData('text/plain', section.id);
      e.dataTransfer.effectAllowed = 'move';
      section.classList.add('dragging');
      section.__justDragged = true;
    });

    summary.addEventListener('dragend', () => {
      section.classList.remove('dragging');
      document.querySelectorAll('.drag-over').forEach(el => el.classList.remove('drag-over'));
      setTimeout(() => { section.__justDragged = false; }, 100);
    });

    summary.addEventListener('click', (e) => {
      if (e.target.closest('button, input, select, textarea, .toggle-switch, .mxp-action, .output-control, .ungroup-btn')) return;
      if (section.__justDragged) return;
      e.preventDefault();
      e.stopPropagation();
      section.open = !section.open;
    });

    section.addEventListener('dragover', (e) => {
      const dragged = document.querySelector('.collapse-section.dragging');
      if (!dragged || dragged === section) return;
      if (section.contains(dragged)) return;
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      section.classList.add('drag-over');
    });

    section.addEventListener('dragleave', (e) => {
      if (!section.contains(e.relatedTarget)) section.classList.remove('drag-over');
    });

    section.addEventListener('drop', (e) => {
      e.preventDefault();
      e.stopPropagation();
      section.classList.remove('drag-over');

      const srcId = e.dataTransfer.getData('text/plain');
      const src = document.getElementById(srcId);
      if (!src || src === section) return;
      if (section.contains(src)) return;

      let inner = section.querySelector(':scope > .collapse-body > .collapse-inner');
      if (!inner) {
        const body = document.createElement('div');
        body.className = 'collapse-body';
        const innerDiv = document.createElement('div');
        innerDiv.className = 'collapse-inner';
        body.appendChild(innerDiv);
        section.appendChild(body);
        inner = innerDiv;
      }

      inner.appendChild(src);
      src.classList.add('nested');
      section.open = true;
      addUngroupButton(src);
    });
  });
}

function addUngroupButton(section) {
  const summary = section.querySelector('.collapse-summary');
  if (!summary) return;
  if (summary.querySelector('.ungroup-btn')) return;

  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'ungroup-btn';
  btn.title = 'Desagrupar';
  btn.textContent = '⤴';
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    const wrap = document.querySelector('#sonetoRoot .wrap');
    if (!wrap) return;
    section.classList.remove('nested');
    btn.remove();
    const anchor = document.getElementById('archSelect');
    if (anchor && anchor.parentElement === wrap) {
      wrap.insertBefore(section, anchor);
    } else {
      wrap.appendChild(section);
    }
  });
  summary.appendChild(btn);
}

/* =========================================================
   78K
========================================================= */
function enviar78K() {
  const texto = state.dictApplied || localStorage.getItem('fractal_ultimo');
  const arch = document.getElementById('archSelect').value || 'kodux';
  if (!texto) { alert('Funde os textos primeiro'); return; }

  localStorage.setItem('kobllux_last_result', JSON.stringify({
    arch, text: texto, timestamp: Date.now()
  }));

  window.dispatchEvent(new CustomEvent('di:storage', {
    detail: {key: 'kobllux_last_result', value: texto, arch}
  }));

  try { document.body.dataset.arch = arch.toUpperCase(); if (window.NebulaPills && window.NebulaPills.applyArch) window.NebulaPills.applyArch(arch.toUpperCase()); } catch(e) {}   /* [v79] enviar como arquétipo = trigger do data-arch */
  if (window.KOBBus && window.KOBBus.say) window.KOBBus.say(texto, {rate:0.95});

  alert(`Enviado pro 78K como ${arch.toUpperCase()}\nTambém tá tocando agora`);
}

/* =========================================================
   TEMA
========================================================= */
const themeDot = document.getElementById('theme-dot2');
if (themeDot) {
  themeDot.addEventListener('click', () => {
    document.getElementById('themeToggle')?.click();   /* [v79] tema = o do sistema */
  });
}

/* =========================================================
   INIT
========================================================= */
window.addEventListener('load', () => {

  if ('speechSynthesis' in window) {
    speechSynthesis.getVoices();
    speechSynthesis.onvoiceschanged = () => {};
  }

  state.dictRules = loadRules();
  if (!state.dictRules.length) {
    state.dictRules = JSON.parse(JSON.stringify(DICT_PRESETS.patoDoMundo));
    saveRules();
  }
  state.dictEnabled = localStorage.getItem('fractal_dict_enabled') === '1';
  loadFmtConfig();

  const t1 = localStorage.getItem('fractal_t1');
  const t2 = localStorage.getItem('fractal_t2');
  const ult = localStorage.getItem('fractal_ultimo');

  if (t1) document.getElementById('t1').value = t1;
  if (t2) document.getElementById('t2').value = t2;

  if (ult) {
    state.rawMerge = ult;
    document.getElementById('resultPanel').style.display = 'block';
    const empty = document.getElementById('resultEmpty');
    if (empty) empty.style.display = 'none';
    document.getElementById('archSelect').style.display = 'block';
    document.getElementById('btn78k').style.display = 'block';
  }

  renderRules();
  syncFmtUI();
  updateDictToggleUI();
  updateTTSBtn();
  updateSonoroUI();

  bindDetailsPersistence();
  bindDragDrop();
  bindDictPresets();
  bindFmtToggles();
  bindSlicer();
  bindViewTabs();
  bindSonoro();

  lerArquivo(document.getElementById('f1'), 't1');
  lerArquivo(document.getElementById('f2'), 't2');

  ['t1','t2'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', () => {
      localStorage.setItem(id === 't1' ? 'fractal_t1' : 'fractal_t2', el.value);
    });
  });

  refreshAll();

  console.log('[Espaço da Mente] Fractal 369 + Slicer + Formatter + TTS + Sonoro · pronto.');
});


/* [v79] ligações com o monólito */
/* ═══════════════════════════════════════════════════════════
   [v80] SONETO COMO INSTRUMENTO DO TEXTO
   motor lexical (palavras, caracteres, pontuação, repetição) → BPM · escala · timbre · reverb
   ═══════════════════════════════════════════════════════════ */
const SN_LEX = {
  melancolia:['triste','sauda','perd','noite','chuv','sombri','solid','lágrim','lagrim','dor ','vazio','silên','silen','morte','adeus','memór','memor'],
  alegria:['feliz','alegr','sorri','riso','festa','luz','amor','vida','dança','danca','celebr','brilh','esperan','abraç','abrac','cant'],
  misterio:['segred','mistér','mister','sombra','enigm','oculto','oculta','invisív','invisiv','abismo','portal','espelho','símbolo','simbolo','código','codigo'],
  sonho:['sonh','nuvem','céu','ceu','flutu','alma','espírit','espirit','infinit','cosmos','estrela','lua','poesia','voar','onda'],
  oriental:['tao','zen','bambu','templo','montanha','vento','mestre','caminho','medit','haiku','seda'],
  cyberpunk:['cyber','rede','dados','sistema','máquina','maquina','algoritm','digital','neural','servidor','pixel','robô','robo','hacker','matrix','kob','ia ']
};
const snClamp = (v,a,b)=>Math.max(a,Math.min(b,v));
function lexicalProfile(text){
  text = String(text||'');
  const low = text.toLowerCase();
  const words = low.match(/[a-záàãâéêíóôõúçñ]+/g) || [];
  const n = words.length || 1;
  const sents = text.split(/[.!?…]+/).map(s=>s.trim()).filter(Boolean);
  const avgSent = n / (sents.length || 1);
  const avgWord = words.reduce((a,w)=>a+w.length,0) / n;
  const q = (text.match(/\?/g)||[]).length, ex = (text.match(/!/g)||[]).length, com = (text.match(/[,;:]/g)||[]).length;
  const uniq = new Set(words).size / n;
  const density = snClamp((com + sents.length) / n * 3 + (1-uniq) * 0.5, 0, 1);
  const speed = snClamp(1 - (avgSent - 4) / 26, 0, 1);               /* frases curtas = rápido */
  const bpm = Math.round(snClamp(66 + speed*92 + ex*2 + (1-uniq)*10, 60, 200));
  const reverb = Math.round(snClamp(22 + (avgWord-4)*10 + Math.min(30,q*8) + (1-speed)*28, 5, 90));
  const score = {};
  Object.keys(SN_LEX).forEach(k=>{ score[k] = SN_LEX[k].reduce((a,s)=>a + (low.includes(s)?1:0), 0); });
  if (ex >= 2) score.alegria += 2;
  if (q  >= 2) score.misterio += 2;
  if (avgSent > 18) score.sonho += 2;
  let theme = Object.keys(score).sort((a,b)=>score[b]-score[a])[0];
  if (!score[theme]) theme = 'melancolia';
  const synth = theme==='cyberpunk' ? 'synthwave' : (avgSent>16 || theme==='sonho') ? 'ambient' : density>.55 ? 'marimba' : 'softKey';
  return { bpm, reverb, theme, synth, density: Math.round(density*100), words: n, sentences: sents.length };
}
const snById = id=>document.getElementById(id);
const SNS = { profile:null, auto: localStorage.getItem('kob:sonoro:auto')!=='0', autoFuse: localStorage.getItem('kob:sonoro:autofuse')!=='0' };
function paintCockpit(){
  const p = SNS.profile, r = snById('snckRead');
  if (r) r.textContent = p ? `BPM ${p.bpm} · ${p.theme.toUpperCase()} · ${p.synth} · REV ${p.reverb}% · DENS ${p.density}% · ${p.words} palavras` : 'sem texto correlacionado ainda';
  const set = (id,v)=>{ const e=snById(id); if(e) e.value=v; };
  set('snckBpm', snById('sonoroBpm') ? snById('sonoroBpm').value : 130);
  set('snckRev', snById('sonoroReverb') ? snById('sonoroReverb').value : 40);
  set('snckTheme', snById('sonoroTheme') ? snById('sonoroTheme').value : 'melancolia');
  set('snckSynth', snById('sonoroSynth') ? snById('sonoroSynth').value : 'softKey');
  const bv=snById('snckBpmV'), rv=snById('snckRevV'); if(bv) bv.textContent = snById('snckBpm').value; if(rv) rv.textContent = snById('snckRev').value+'%';
  const a=snById('snckAuto'); if(a) a.checked = SNS.auto;
  const f=snById('snckFuse'); if(f) f.checked = SNS.autoFuse;
}
function applyProfile(p){
  SNS.profile = p;
  const put = (id,v)=>{ const e=snById(id); if(e){ e.value=v; } };
  put('sonoroTheme', p.theme); put('sonoroSynth', p.synth); put('sonoroBpm', p.bpm); put('sonoroReverb', p.reverb);
  try{
    if (sonoroStarted && sonoroToneAvailable()){
      Tone.Transport.bpm.value = p.bpm;
      if (sonoroReverb && sonoroReverb.wet) sonoroReverb.wet.value = p.reverb/100;
    }
  }catch(e){}
  paintCockpit();
  window.dispatchEvent(new CustomEvent('kob:sonoro-profile', { detail:p }));
  return p;
}
function activeText(){
  return (window.KOBActive && KOBActive.text) || state.dictApplied || (snById('t1')||{}).value || (snById('t2')||{}).value || '';
}
function autoCorrelate(text){
  text = text || activeText();
  if (!String(text).trim()){ return null; }
  return applyProfile(lexicalProfile(text));
}
async function playText(text, title){
  text = String(text||'').trim();
  if (!text){ alert('Sem texto para sintetizar'); return; }
  if (sonoroPlaying){ stopSonoroPlayback(); return; }
  if (title && window.KOBActive) KOBActive.set(title, text);
  const prev = state.dictApplied; state.dictApplied = text;
  try{ await startSonoroPlayback(); } finally { state.dictApplied = prev; }
}
function setField(id, text, key){
  const c = snById(id); if(!c) return;
  c.value = text; c.dispatchEvent(new Event('input',{bubbles:true}));
  try{ localStorage.setItem(key, text); }catch(e){}
}
function afterImport(){
  const t1 = (snById('t1')||{}).value||'', t2 = (snById('t2')||{}).value||'';
  if (SNS.autoFuse && t1.trim() && t2.trim()) { try{ fractalMerge(); }catch(e){} }
}
function toSeed(text){ setField('t1', text, 'fractal_t1'); afterImport(); if (window.KOBActive) KOBActive.set(KOBActive.title, text); }
function toMirror(text){ setField('t2', text, 'fractal_t2'); afterImport(); }

/* cockpit: painel dentro do drawer ⚙ Cockpit */
function mountCockpit(){
  const body = document.querySelector('#drawerProfile .drawer-body');
  if (!body || snById('snCockpit')) return;
  const box = document.createElement('div'); box.className = 'cockpit-item'; box.id = 'snCockpit';
  const themeOpts = (snById('sonoroTheme')||{}).innerHTML || '', synthOpts = (snById('sonoroSynth')||{}).innerHTML || '';
  box.innerHTML = '<div class="cockpit-label">🎼 Soneto · trilha do texto</div>'
    + '<div class="snck-read" id="snckRead">—</div>'
    + '<label class="snck-row"><span>AUTO · léxico → BPM/escala/timbre/reverb</span><input type="checkbox" id="snckAuto"></label>'
    + '<label class="snck-row"><span>FUSÃO automática ao importar semente+espelho</span><input type="checkbox" id="snckFuse"></label>'
    + '<div class="snck-row"><span>BPM</span><input type="range" id="snckBpm" min="60" max="200"><b id="snckBpmV"></b></div>'
    + '<div class="snck-row"><span>REVERB</span><input type="range" id="snckRev" min="0" max="100"><b id="snckRevV"></b></div>'
    + '<div class="snck-row"><span>ESCALA</span><select id="snckTheme">'+themeOpts+'</select></div>'
    + '<div class="snck-row"><span>TIMBRE</span><select id="snckSynth">'+synthOpts+'</select></div>'
    + '<div class="control-row"><button class="btn-block" id="snckCorr" type="button">↻ CORRELACIONAR TEXTO ATIVO</button><button class="btn-block" id="snckPlay" type="button">▶ SONETO</button></div>';
  const items = body.querySelectorAll(':scope > .cockpit-item');
  body.insertBefore(box, items.length ? items[items.length-1] : null);
  const manual = (id, orig, fn)=>{ snById(id).addEventListener('input', ()=>{ SNS.auto=false; localStorage.setItem('kob:sonoro:auto','0'); const o=snById(orig); if(o){ o.value = snById(id).value; o.dispatchEvent(new Event('change',{bubbles:true})); } fn&&fn(); paintCockpit(); }); };
  manual('snckBpm','sonoroBpm',()=>{ try{ if(sonoroStarted) Tone.Transport.bpm.value = +snById('snckBpm').value; }catch(e){} });
  manual('snckRev','sonoroReverb',()=>{ try{ if(sonoroStarted && sonoroReverb) sonoroReverb.wet.value = +snById('snckRev').value/100; }catch(e){} });
  manual('snckTheme','sonoroTheme'); manual('snckSynth','sonoroSynth');
  snById('snckAuto').addEventListener('change', e=>{ SNS.auto = e.target.checked; localStorage.setItem('kob:sonoro:auto', SNS.auto?'1':'0'); });
  snById('snckFuse').addEventListener('change', e=>{ SNS.autoFuse = e.target.checked; localStorage.setItem('kob:sonoro:autofuse', SNS.autoFuse?'1':'0'); });
  snById('snckCorr').addEventListener('click', ()=>{ SNS.auto = true; localStorage.setItem('kob:sonoro:auto','1'); if(!autoCorrelate()) alert('Selecione/abra um documento ou funda textos primeiro'); });
  snById('snckPlay').addEventListener('click', ()=>{ const t = activeText(); if (t) playText(t); else startSonoroPlayback(); });
  paintCockpit();
}
function toggleCockpit(){
  mountCockpit();
  if (typeof window.toggleDrawer === 'function') window.toggleDrawer('drawerProfile');
  setTimeout(()=>{ const b=snById('snCockpit'); if(b) b.scrollIntoView({block:'center'}); }, 250);
}
[400,1500,3500].forEach(t=>setTimeout(mountCockpit,t));

document.addEventListener('click', function(e){
  const b = e.target.closest('#sonetoRoot [data-snc], #main-header2 [data-snc]'); if (!b) return;
  ({ fractalMerge: fractalMerge, enviar78K: enviar78K, cockpit: toggleCockpit })[b.dataset.snc]();
});
window.KOBSonoro = { fractalMerge: fractalMerge, enviar78K: enviar78K, state: state, lexicalProfile: lexicalProfile, applyProfile: applyProfile,
  autoCorrelate: autoCorrelate, playText: playText, toSeed: toSeed, toMirror: toMirror, cockpit: toggleCockpit, afterImport: afterImport,
  isPlaying: function(){ return sonoroPlaying; }, get autoOn(){ return SNS.auto; }, get profile(){ return SNS.profile; } };
(function(){ /* archSelect ⇄ data-arch (trigger bidirecional) */
  const sel = document.getElementById('archSelect'); if (!sel) return;
  sel.addEventListener('change', function(){
    if (!sel.value) return; const A = sel.value.toUpperCase();
    document.body.dataset.arch = A;
    try { if (window.NebulaPills && window.NebulaPills.applyArch) window.NebulaPills.applyArch(A); } catch(e) {}
    window.dispatchEvent(new CustomEvent('kob:arch', { detail:{ arch:A } }));
  });
  const sync = function(){ const a = String(document.body.dataset.arch||'').toLowerCase(); if (a && Array.from(sel.options).some(function(o){return o.value===a})) sel.value = a; };
  new MutationObserver(sync).observe(document.body, { attributes:true, attributeFilter:['data-arch'] }); sync();
})();

})();
