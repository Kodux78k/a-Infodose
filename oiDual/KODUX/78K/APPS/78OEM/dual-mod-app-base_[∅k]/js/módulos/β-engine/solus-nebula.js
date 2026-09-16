/* ═══════════════════════════════════════════════════════════
   §E · NEBULA · solus-nebula · O Leitor de Fatias
   Arquétipo: SOLUS · Prefixo: solus_
   Depende: vd-arquétipos, bllue-vozes, aion-store
   ═══════════════════════════════════════════════════════════ */
(function(){
"use strict";

/* ─── estado ─── */
const kd_nb = {
  slices: [], current: 0, speaking: false, paused: false,
  documentTitle: 'ESPAÇO DA MENTE', sliceArches: [], raw: '', title: ''
};

const solus_stage    = document.getElementById('solus_stage');
const solus_empty    = document.getElementById('solus_empty');
const artemis_file   = document.getElementById('artemis_file');
const bllue_player   = document.getElementById('bllue_player');
const bllue_play     = document.getElementById('bllue_play');
const bllue_ptitle   = document.getElementById('bllue_ptitle');
const bllue_pstate   = document.getElementById('bllue_pstate');
const bllue_pbar     = document.getElementById('bllue_pbar');
const solus_title    = document.getElementById('solus_title');

if(!solus_stage){ console.warn('[solus-nebula] stage ausente'); return; }

/* ─── tabelas arquetípicas ─── */
const vd_arch_syms = {
  ATLAS:"α", NOVA:"✦", VITALIS:"♾", PULSE:"◈", ARTEMIS:"☾",
  SERENA:"❋", KAOS:"⚡", GENUS:"⚙", LUMINE:"☀", SOLUS:"◌",
  RHEA:"∞", AION:"⧗", KODUX:"⇄", BLLUE:"◉", JESUS:"✝", KOBLLUX:"∆"
};

const vd_arch_names = [
  "KOBLLUX","VITALIS","ARTEMIS","SERENA","LUMINE","KODUX",
  "ATLAS","GENUS","PULSE","JESUS","SOLUS","BLLUE","NOVA","RHEA","KAOS","AION"
];

/* ─── helpers ─── */
function kodux_escape_regex(s){
  return String(s).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function kodux_escape_html(text){
  return text.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

function kodux_arch_color(name){
  const map = window.kd_arch_map;
  if(!map || !map[name]) return "var(--bllue-voice-primary)";
  return `var(${map[name].tok})`;
}

/* ─── detecção de arquétipo ─── */
function artemis_detect(raw){
  if(!raw) return null;
  const text = String(raw);

  for(const name of vd_arch_names){
    const sym = vd_arch_syms[name];
    if(!sym) continue;
    const re = new RegExp(kodux_escape_regex(sym) + "\\s*[·:\\-—]?\\s*" + name + "\\b", "i");
    if(re.test(text)) return name;
  }

  for(const name of vd_arch_names){
    const re = new RegExp("^#{1,6}\\s*" + kodux_escape_regex(name) + "\\b", "im");
    if(re.test(text)) return name;
  }

  for(const name of vd_arch_names){
    const re = new RegExp("^" + kodux_escape_regex(name) + "\\s*[·:\\-—]\\s", "im");
    if(re.test(text)) return name;
  }

  for(const name of vd_arch_names){
    const re = new RegExp("\\b" + kodux_escape_regex(name) + "\\b", "i");
    if(re.test(text)) return name;
  }

  return null;
}

function genus_build_slices(slices){
  return slices.map(raw => artemis_detect(raw));
}

/* ─── parser de documento ─── */
function kodux_parse_doc(text){
  const lines = text.replace(/\r/g,'').split('\n');
  const slices = [];
  let current = [];

  function push(){
    const v = current.join('\n').trim();
    if(v) slices.push(v);
    current = [];
  }

  for(const line of lines){
    if(/^#{1,3}\s+/.test(line)){ if(current.length) push(); current.push(line); continue; }
    if(/^---+$/.test(line.trim())){ push(); continue; }
    current.push(line);
  }
  if(current.length) push();

  if(slices.length <= 1){
    const blocks = text.split(/\n\s*\n/).map(x=>x.trim()).filter(Boolean);
    if(blocks.length > 1) return blocks;
  }
  return slices;
}

/* ─── markdown → HTML ─── */
function genus_md_html(text){
  let html = kodux_escape_html(text);
  html = html.replace(/```([\s\S]*?)```/g, '<pre class="md-code"><code>$1</code></pre>');
  html = html.replace(/^### (.*)$/gm, '<h3>$1</h3>');
  html = html.replace(/^## (.*)$/gm, '<h2>$1</h2>');
  html = html.replace(/^# (.*)$/gm, '<h1>$1</h1>');
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
  html = html.replace(/_([^_]+)_/g, '<em>$1</em>');
  html = html.replace(/`([^`]+)`/g, '<code class="code-inline">$1</code>');
  html = html.replace(/^&gt; (.*)$/gm, '<blockquote class="bq">$1</blockquote>');
  html = html.split(/\n\s*\n/).map(block=>{
    block = block.trim();
    if(!block) return '';
    if(/^<(h1|h2|h3|ul|pre|blockquote)/.test(block)) return block;
    return `<p>${block.replace(/\n/g,'<br>')}</p>`;
  }).join('');
  return html;
}

/* ─── criação de slice ─── */
function genus_create_slice(content, index){
  const s = document.createElement('slice');
  const detected = kd_nb.sliceArches[index];
  const isAuto = !detected;
  const arch = detected || window.jesus_arch() || 'JESUS';
  const color = kodux_arch_color(arch);

  s.dataset.index = index;
  s.dataset.state = 'created';
  s.dataset.arch = arch;
  s.dataset.auto = isAuto ? "1" : "0";
  s.style.setProperty("--solus-slice-arch-color", color);

  s.innerHTML = `
    <div class="solus_slice-content">
      <div class="solus_slice-meta">
        <label>SLICE ${String(index+1).padStart(2,'0')}</label>
        <span class="solus_slice-chip ${isAuto ? 'solus_auto' : ''}">
          <i></i>${isAuto ? '◆ AUTO' : arch}
        </span>
        <span class="solus_slice-number">${index+1} / ${kd_nb.slices.length}</span>
      </div>
      <div class="solus_slice-body">${genus_md_html(content)}</div>
    </div>`;
  return s;
}

/* ─── carregar documento ─── */
function nova_load_doc(text, title){
  solus_stop_speech();
  kd_nb.raw = text;
  kd_nb.title = title || 'Documento';
  kd_nb.slices = kodux_parse_doc(text);
  kd_nb.current = 0;
  kd_nb.documentTitle = title || 'Documento';
  kd_nb.sliceArches = genus_build_slices(kd_nb.slices);

  if(solus_title) solus_title.textContent = kd_nb.documentTitle;
  if(bllue_ptitle) bllue_ptitle.textContent = kd_nb.documentTitle;

  solus_stage.replaceChildren();
  kd_nb.slices.forEach((c,i)=>solus_stage.appendChild(genus_create_slice(c,i)));

  if(solus_empty) solus_empty.style.display = kd_nb.slices.length ? 'none' : 'grid';

  solus_show_slice(0);
  if(window.aion_save) window.aion_save();
}

/* ─── mostrar slice ─── */
function solus_show_slice(index){
  if(!kd_nb.slices.length) return;
  if(index < 0) index = kd_nb.slices.length - 1;
  if(index >= kd_nb.slices.length) index = 0;
  kd_nb.current = index;

  solus_stage.querySelectorAll('slice').forEach((s,i)=>{
    s.classList.toggle('active', i === index);
  });

  if(bllue_pbar)
    bllue_pbar.style.width = `${((index+1)/kd_nb.slices.length)*100}%`;

  const detected = kd_nb.sliceArches[index];
  const arch = detected || window.jesus_arch() || 'JESUS';

  if(bllue_pstate)
    bllue_pstate.textContent = detected
      ? `Slice ${index+1}/${kd_nb.slices.length} · ${detected}`
      : `Slice ${index+1}/${kd_nb.slices.length} · ${arch} (auto)`;

  if(kd_nb.speaking) bllue_speak_slice();
}

function solus_next(){
  if(!kd_nb.slices.length) return;
  if(kd_nb.current < kd_nb.slices.length-1) solus_show_slice(kd_nb.current+1);
  else solus_stop_speech();
}

function solus_prev(){
  if(!kd_nb.slices.length) return;
  solus_show_slice(kd_nb.current-1);
}

/* ─── texto puro da slice atual ─── */
function kodux_current_text(){
  const s = kd_nb.slices[kd_nb.current];
  if(!s) return '';
  return s.replace(/```[\s\S]*?```/g,' código ')
    .replace(/^#{1,6}\s+/gm,'')
    .replace(/[*_~`]/g,'')
    .replace(/^>\s*/gm,'')
    .replace(/^[-*]\s+/gm,'')
    .replace(/\[([^\]]+)\]\([^)]+\)/g,'$1')
    .replace(/\n+/g,' ').trim();
}

/* ─── fala da slice ─── */
function bllue_speak_slice(){
  if(!('speechSynthesis' in window)){
    if(bllue_pstate) bllue_pstate.textContent = 'Speech indisponível';
    return;
  }
  speechSynthesis.cancel();
  const text = kodux_current_text();
  if(!text) return;

  const detected = kd_nb.sliceArches[kd_nb.current];
  const archName = detected || window.jesus_arch() || 'JESUS';

  if(window.jesus_apply) window.jesus_apply(archName);
  if(window.__sbSync) window.__sbSync(archName);

  const u = new SpeechSynthesisUtterance(text);
  if(window.bllue_voice && window.bllue_voice.forArch){
    const cfg = window.bllue_voice.forArch(archName, text);
    if(cfg.voice) u.voice = cfg.voice;
    u.lang = cfg.lang || 'pt-BR';
    u.rate = cfg.rate || 1;
    u.pitch = cfg.pitch || 1;
  }

  u.onstart = ()=>{
    kd_nb.speaking = true;
    kd_nb.paused = false;
    if(bllue_play) bllue_play.textContent = 'Ⅱ';
    if(bllue_pstate) bllue_pstate.textContent = `🎙 ${archName} · slice ${kd_nb.current+1}`;
    const orb = document.getElementById('kobllux_orb');
    if(orb) orb.classList.add('speaking');
  };
  u.onend = ()=>{
    if(kd_nb.speaking){
      if(kd_nb.current < kd_nb.slices.length-1){
        kd_nb.current++;
        solus_show_slice(kd_nb.current);
      } else solus_stop_speech();
    }
  };
  u.onerror = ()=>{
    kd_nb.speaking = false;
    if(bllue_play) bllue_play.textContent = '▶';
    const orb = document.getElementById('kobllux_orb');
    if(orb) orb.classList.remove('speaking');
  };
  speechSynthesis.speak(u);
}

function bllue_toggle_speech(){
  if(!kd_nb.slices.length) return;
  if(kd_nb.speaking){
    if(speechSynthesis.paused){
      speechSynthesis.resume();
      kd_nb.paused = false;
      if(bllue_play) bllue_play.textContent = 'Ⅱ';
      return;
    }
    speechSynthesis.pause();
    kd_nb.paused = true;
    if(bllue_play) bllue_play.textContent = '▶';
    if(bllue_pstate) bllue_pstate.textContent = 'Pausado';
    return;
  }
  kd_nb.speaking = true;
  bllue_speak_slice();
}

function solus_stop_speech(){
  if('speechSynthesis' in window) speechSynthesis.cancel();
  kd_nb.speaking = false;
  kd_nb.paused = false;
  if(bllue_play) bllue_play.textContent = '▶';
  const orb = document.getElementById('kobllux_orb');
  if(orb) orb.classList.remove('speaking');
}

function solus_toggle_player(){
  bllue_player?.classList.toggle('solus_minimized');
}

function solus_clear(){
  kd_nb.slices = [];
  kd_nb.current = 0;
  kd_nb.sliceArches = [];
  kd_nb.raw = '';
  kd_nb.title = '';
  solus_stop_speech();
  solus_stage.replaceChildren();
  if(solus_empty) solus_empty.style.display = 'grid';
  if(bllue_ptitle) bllue_ptitle.textContent = 'Nenhum';
  if(bllue_pstate) bllue_pstate.textContent = 'Aguardando';
  if(bllue_pbar) bllue_pbar.style.width = '0%';
}

function solus_has_slices(){ return kd_nb.slices.length > 0; }

/* ─── APIs públicas ─── */
function artemis_open_file(){ artemis_file.click(); }

function artemis_paste_text(){
  const text = prompt('Cole aqui o texto:');
  if(!text) return;
  nova_load_doc(text, 'Documento colado');
}

/* ─── listeners ─── */
artemis_file?.addEventListener('change', async (e)=>{
  const f = e.target.files[0]; if(!f) return;
  const txt = await f.text();
  nova_load_doc(txt, f.name);
});

document.addEventListener('keydown', (e)=>{
  if(e.target.matches('textarea,input,[contenteditable="true"]')) return;
  if(e.key === 'ArrowRight') solus_next();
  if(e.key === 'ArrowLeft') solus_prev();
});

let artemis_touchx = 0;
document.addEventListener('touchstart', (e)=>{
  artemis_touchx = e.changedTouches[0].screenX;
}, {passive:true});
document.addEventListener('touchend', (e)=>{
  const diff = e.changedTouches[0].screenX - artemis_touchx;
  if(Math.abs(diff) < 80) return;
  if(!e.target.closest('#solus_reader')) return;
  if(diff < 0) solus_next(); else solus_prev();
}, {passive:true});

/* ─── export ─── */
window.solus_nebula = {
  openFile: artemis_open_file,
  pasteText: artemis_paste_text,
  loadDocument: nova_load_doc,
  showSlice: solus_show_slice,
  nextSlice: solus_next,
  previousSlice: solus_prev,
  toggleSpeech: bllue_toggle_speech,
  stopSpeech: solus_stop_speech,
  togglePlayer: solus_toggle_player,
  clear: solus_clear,
  hasSlices: solus_has_slices,
  state: kd_nb,
  detectArchInText: artemis_detect
};

console.log('[solus-nebula] online · leitor de fatias pronto');
})();