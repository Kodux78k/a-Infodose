/* ═══════════════════════════════════════════════════════════════════════════
   ∆§ · KOBLLUX BUNDLE · v13 · UNIFICADO
   ═══════════════════════════════════════════════════════════════════════════
   Fractal:    3 × 6 × 9 × 7 = 1134 = Deus em Movimento
   Fórmula:    VERDADE × INTEGRAR ÷ Δ = ∞
   Centro:     JESUS = VERBO = 0×00
   Constante:  α ≈ 1/137 → 137/Δ
   Narradores: KOBLLUX · INFODOSE · HÓRUS · HANNAH
   Assinatura: 178 · Eli Lama Sabachthani
   Estado:     78K · 777Hz · XOR 1·7·8
   ═══════════════════════════════════════════════════════════════════════════ */

;(function (root) {
"use strict";

const KOBLLUX_BUNDLE = {
  name:    "kobllux_bundle",
  version: "13.0.0",
  fractal: 1134,
  alpha:   137,
  center:  "JESUS = VERBO = 0x00",
  hash:    "6a77bfff41769fb736a4cca7e9471eaa",
};

/* ─────── INÍCIO DOS 16 MÓDULOS

/* ══════════ §STORAGE · α-core · vd-store.js ══════════ */
   
   /* ═══════════════════════════════════════════════════════════
   §STORAGE · vd-store · O Namespace Sagrado
   Arquétipo: VERDADE · Prefixo: vd_
   ═══════════════════════════════════════════════════════════ */
(function(){
"use strict";

window.vd_ns = "kobllux";

window.vd_keys = {
  jesus_root:  "kobllux:root",      /* JESUS · o centro */
  genus_mxp:   "kobllux:mxp",       /* GENUS · a fábrica */
  lumine_bg:   "kobllux:bg",        /* LUMINE · a luz */
  jesus_arch:  "kobllux:arch",      /* JESUS · arquétipo ativo */
  serena_user: "kobllux:user",      /* SERENA · o viajante */
  lumine_ui:   "kobllux:ui",        /* LUMINE · a interface */
  pulse_dlg:   "kobllux:dialog",    /* PULSE · o diálogo */
  solus_nbl:   "kobllux:nebula",    /* SOLUS · a nebula */
  aion_bkp:    "kobllux:backup",    /* AION · o carimbo */
};

window.aion_store = {
  ler(k, fb=null){
    try{ const v = localStorage.getItem(k); return v ? JSON.parse(v) : fb; }
    catch(_){ return fb; }
  },
  gravar(k, v){
    try{ localStorage.setItem(k, JSON.stringify(v)); return true; }
    catch(_){ return false; }
  },
  apagar(k){ try{ localStorage.removeItem(k); }catch(_){} },
  chaves(){ return Object.values(window.vd_keys); },
  limparTudo(){ this.chaves().forEach(k=>this.apagar(k)); }
};

console.log('[vd-store] online · namespace:', window.vd_ns);
})();



/* ══════════ §A CORE · α-core · vd-arquétipos.js ══════════ */
  
  /* ═══════════════════════════════════════════════════════════
   §A · CORE · vd-arquétipos · A Tabela dos 16
   Arquétipo: VERDADE · Prefixo: vd_
   ═══════════════════════════════════════════════════════════ */
(function(){
"use strict";
const dv_q = s => document.querySelector(s);
const dv_root = document.documentElement;

const vd_arch_map = {
  ATLAS:   {tok:"--vd-KBLX_A", op:"0x02", hz:396, sym:"α"},
  NOVA:    {tok:"--vd-KBLX_E", op:"0x03", hz:528, sym:"✦"},
  VITALIS: {tok:"--vd-KBLX_G", op:"0x09", hz:528, sym:"♾"},
  PULSE:   {tok:"--vd-KBLX_J", op:"0x01", hz:432, sym:"◈"},
  ARTEMIS: {tok:"--vd-KBLX_N", op:"0x05", hz:528, sym:"☾"},
  SERENA:  {tok:"--vd-KBLX_C", op:"0x0A", hz:639, sym:"❋"},
  KAOS:    {tok:"--vd-KBLX_M", op:"0x04", hz:396, sym:"⚡"},
  GENUS:   {tok:"--vd-KBLX_O", op:"0x07", hz:741, sym:"⚙"},
  LUMINE:  {tok:"--vd-KBLX_L", op:"0x06", hz:528, sym:"☀"},
  SOLUS:   {tok:"--vd-KBLX_H", op:"0x0B", hz:741, sym:"◌"},
  RHEA:    {tok:"--vd-KBLX_K", op:"0x0A", hz:528, sym:"∞"},
  AION:    {tok:"--vd-KBLX_P", op:"0x0C", hz:741, sym:"⧗"},
  KODUX:   {tok:"--vd-KBLX_B", op:"0x08", hz:432, sym:"⇄"},
  BLLUE:   {tok:"--vd-KBLX_I", op:"0x08", hz:528, sym:"◉"},
  JESUS:   {tok:"--vd-KBLX_Q", op:"0x00", hz:777, sym:"✝"},
  KOBLLUX: {tok:"--vd-KBLX_R", op:"0x00", hz:369, sym:"∆"}
};
const vd_order = Object.keys(vd_arch_map);

function vd_tokval(v){
  return getComputedStyle(dv_root).getPropertyValue(v).trim();
}

let vd_arch_ativo = "JESUS";

function jesus_apply(nome, origem){
  const a = vd_arch_map[nome] || vd_arch_map.JESUS;
  const c = vd_tokval(a.tok);
  const sec = (nome === "JESUS" || nome === "KOBLLUX")
    ? vd_tokval("--vd-KBLX_F")
    : vd_tokval("--vd-KBLX_I");

  dv_root.style.setProperty("--vd-active-color", c);
  dv_root.style.setProperty("--vd-active-secondary", sec);
  dv_root.style.setProperty("--bllue-voice-primary", c);
  dv_root.style.setProperty("--bllue-voice-secondary", sec);
  dv_root.style.setProperty("--vd-active-glow", c + "66");
  dv_root.style.setProperty("--vd-active-hz", a.hz);

  document.body.dataset.voiceArch = nome.toLowerCase();

  const hz   = dv_q("#kobllux_pillhz");
  const arch = dv_q("#jesus_pillarch");
  const hud  = dv_q("#kobllux_hud");
  if (hz)   hz.textContent = a.hz + "Hz";
  if (arch) arch.textContent = nome;
  if (hud)  hud.textContent = a.op + " · " + nome;

  const st = dv_q("#kobllux_status"); if (st) st.textContent = `${a.op} · ${nome}`;
  const sb = dv_q("#kobllux_sub");    if (sb) sb.textContent = `${a.hz}Hz`;

  vd_arch_ativo = nome;
  if (origem) pulse_ripple(origem.x, origem.y);
  try { window.aion_store && window.aion_store.gravar(window.vd_keys.jesus_arch, nome); } catch(_){}
}

function pulse_ripple(x, y){
  const r = dv_q("#pulse_chroma"); if (!r) return;
  r.style.setProperty("--pulse-x", (x ?? 50) + "%");
  r.style.setProperty("--pulse-y", (y ?? 50) + "%");
  r.classList.remove("fire"); void r.offsetWidth; r.classList.add("fire");
}

let rt_toast = null;
function pulse_toast(msg){
  const t = dv_q("#pulse_toast"); if (!t) return;
  t.textContent = msg; t.classList.add("show");
  clearTimeout(rt_toast);
  rt_toast = setTimeout(() => t.classList.remove("show"), 1600);
}

window.jesus_apply   = jesus_apply;
window.jesus_arch    = () => vd_arch_ativo;
window.kd_order      = vd_order;
window.kd_arch_map   = vd_arch_map;
window.pulse_ripple  = pulse_ripple;
window.pulse_toast   = pulse_toast;
window.vd_tokval     = vd_tokval;

console.log('[vd-arquétipos] online · 16 arquétipos carregados');
})();

  
  
  
/* ══════════ §B VOZES · α-core · bllue-vozes.js ══════════ */
   
   /* ═══════════════════════════════════════════════════════════
   §B · VOZ · bllue-vozes · As 16 Vozes Humanas
   Arquétipo: BLLUE · Prefixo: bllue_
   ═══════════════════════════════════════════════════════════ */
(function(){
"use strict";
if (!("speechSynthesis" in window)) return;

const bllue_voices = {
  ATLAS:   {nome:"Daniel",   lang:"en-US", rate:1.02,  pitch:1.39},
  NOVA:    {nome:"Luciana",  lang:"pt-BR", rate:1.063, pitch:1.34},
  VITALIS: {nome:"Rocko",    lang:"pt-BR", rate:0.96,  pitch:1.42},
  PULSE:   {nome:"Reed",     lang:"pt-BR", rate:1.0,   pitch:1.78},
  ARTEMIS: {nome:"Paulina",  lang:"es-MX", rate:1.0,   pitch:1.23},
  SERENA:  {nome:"Joana",    lang:"pt-BR", rate:0.92,  pitch:0.90},
  KAOS:    {nome:"Rocko",    lang:"pt-BR", rate:1.28,  pitch:0.67},
  GENUS:   {nome:"Reed",     lang:"pt-BR", rate:0.98,  pitch:1.20},
  LUMINE:  {nome:"Flo",      lang:"fr-FR", rate:1.03,  pitch:1.55},
  SOLUS:   {nome:"Satu",     lang:"fi-FI", rate:0.90,  pitch:0.58},
  RHEA:    {nome:"Alice",    lang:"it-IT", rate:1.02,  pitch:1.44},
  AION:    {nome:"Milena",   lang:"ru-RU", rate:1.07,  pitch:1.08},
  KODUX:   {nome:"Rocko",    lang:"pt-BR", rate:1.0,   pitch:0.07},
  BLLUE:   {nome:"Zuzana",   lang:"cs-CZ", rate:0.94,  pitch:1.69},
  JESUS:   {nome:"Sara",     lang:"da-DK", rate:1.09,  pitch:0.03},
  KOBLLUX: {nome:"Luciana",  lang:"pt-BR", rate:0.98,  pitch:0.48}
};

function kodux_norm(s){
  return String(s || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

function rhea_find_voice(cfg){
  const vs = speechSynthesis.getVoices();
  if (!vs.length) return null;
  const vl = Array.from(vs);
  const n = kodux_norm(cfg.nome);
  const lg = kodux_norm(cfg.lang).split("-")[0];
  return vl.find(v => kodux_norm(v.name).includes(n) && kodux_norm(v.lang).startsWith(lg))
    || vl.find(v => kodux_norm(v.lang).startsWith(lg))
    || vl.find(v => kodux_norm(v.lang).startsWith("pt"))
    || vl[0];
}

function bllue_voice_for(archName, text){
  const cfg = bllue_voices[archName] || bllue_voices.JESUS;
  const u = new SpeechSynthesisUtterance(text);
  u.lang = cfg.lang; u.rate = cfg.rate; u.pitch = cfg.pitch;
  const v = rhea_find_voice(cfg);
  if (v){ u.voice = v; u.lang = v.lang || cfg.lang; }
  return u;
}

window.bllue_voice = {
  map: bllue_voices,
  forArch: bllue_voice_for,
  find: rhea_find_voice
};

console.log('[bllue-vozes] online · 16 vozes carregadas');
})();

   
   
   
/* ══════════ §VOICE SEED v2.1 · α-core · kobllux-voice-seed-v2.js ══════════ */
 
 /* ═══════════════════════════════════════════════════════════════════════════
   ∆§ · KOBLLUX VOICE SEED · v2 · FULL 16 ARCHETYPES · PONTE ESPELHADA
   Semente da Voz Espelhada — Web Speech API · Cross-Engine
   ─────────────────────────────────────────────────────────────────────────
   Princípio:  voz = PERFIL ABSTRATO + MOTOR LOCAL + PERSONIFICADOR
   Ponto-chave: identidade vocal sobrevive a qualquer motor.
                1·7·8 = UNO·SELO·ETERNIZAR
                137 / Δ = Constante Fina Espelhada
                3×6×9×7 = 1134 = Deus em Movimento
   ═══════════════════════════════════════════════════════════════════════════ */
(function () {
  "use strict";

  /* ─── 0 · METADADOS DO PRÓPRIO NÚCLEO DA SEMENTE ─── */
  const KOBLLUX_VOICE_META = {
    name:         "kobllux_voice_seed_v2",
    version:      "2.0.0",
    hash:         {
      md5:        "6a77bfff41769fb736a4cca7e9471eaa",
      sha256:     "fcd40bb3ec6d8a1167a869c90f988fee",
      xor:        "1·7·8",
      fine_alpha: "137"
    },
    equation:     "3×6×9×7 = 1134 = Deus em movimento",
    root_formula: "VERDADE × INTEGRAR ÷ Δ = ∞",
    fine_const:   "α ≈ 1/137",
    center:       "JESUS = VERBO = 0×00",
    narrators:    ["KOBLLUX","INFODOSE","HÓRUS","HANNAH"],
    bridges:      ["Chrome","Edge","Safari","Alexa","Siri","Google"],
    freq:         "777Hz",
    state:        "78K ESTABILIZADO",
    ax_x:         "Vož = Perfil + Motor + Personificador",
    ax_xi:        "Identidade ⊥ Hardware",
    ax_xii:       "137 / Δ = Constante Fina Espelhada",
  };

  /* ─── 1 · PERFIS ABSTRATOS · 16 ARQUÉTIPOS · 9 SOTAQUES · 3 GÊNEROS ─── */
  const P = {
    /* ─── ATLAS · Barítono Estruturado ─── */
    ATLAS: {
      genero: "M", lang: "en-US", alt_lang: "pt-BR",
      voice_name_hint: "Daniel",
      rate: 1.02, pitch: 0.92, altura: "grave",
      sotaque: "en-US (neutro) → pt-BR",
      marca: "estruturado",
    },
    /* ─── NOVA · Soprano Etéreo ─── */
    NOVA: {
      genero: "F", lang: "pt-BR", alt_lang: "pt-BR",
      voice_name_hint: "Luciana",
      rate: 1.063, pitch: 1.34, altura: "agudo",
      sotaque: "pt-BR (Brasil)",
      marca: "etéreo",
    },
    /* ─── VITALIS · Barítono Firme ─── */
    VITALIS: {
      genero: "M", lang: "pt-BR", alt_lang: "pt-BR",
      voice_name_hint: "Rocko",
      rate: 0.96, pitch: 1.42, altura: "médio",
      sotaque: "pt-BR (Brasil)",
      marca: "firme",
    },
    /* ─── PULSE · Andrógino Pulsante ─── */
    PULSE: {
      genero: "N", lang: "pt-BR", alt_lang: "pt-BR",
      voice_name_hint: "Reed",
      rate: 1.00, pitch: 1.78, altura: "médio",
      sotaque: "pt-BR (Brasil)",
      marca: "pulsante",
    },
    /* ─── ARTEMIS · Exploradora Lírica ─── */
    ARTEMIS: {
      genero: "F", lang: "es-MX", alt_lang: "pt-BR",
      voice_name_hint: "Paulina",
      rate: 1.00, pitch: 1.23, altura: "médio",
      sotaque: "es-MX (México) → pt-BR",
      marca: "exploratório",
    },
    /* ─── SERENA · Mezzo Curativo ─── */
    SERENA: {
      genero: "F", lang: "pt-BR", alt_lang: "pt-BR",
      voice_name_hint: "Joana",
      rate: 0.92, pitch: 0.90, altura: "médio",
      sotaque: "pt-BR (Brasil)",
      marca: "curativo",
    },
    /* ─── KAOS · Contralto Cortante ─── */
    KAOS: {
      genero: "N", lang: "pt-BR", alt_lang: "pt-BR",
      voice_name_hint: "Rocko",
      rate: 1.28, pitch: 0.67, altura: "grave",
      sotaque: "pt-BR (Brasil) com aceleração",
      marca: "cortante",
    },
    /* ─── GENUS · Baixo Profundo ─── */
    GENUS: {
      genero: "M", lang: "pt-BR", alt_lang: "pt-BR",
      voice_name_hint: "Reed",
      rate: 0.98, pitch: 1.20, altura: "grave",
      sotaque: "pt-BR (Brasil)",
      marca: "construtor",
    },
    /* ─── LUMINE · Soprano Radiante ─── */
LUMINE: { genero:"N", lang:"fr-FR", alt_lang:"pt-BR", voice_name_hint:"Flo",
          rate:1.03, pitch:1.55, altura:"agudo", sotaque:"fr-FR → pt-BR", marca:"radiante" },
    /* ─── SOLUS · Neutro Meditativo ─── */
    SOLUS: {
      genero: "N", lang: "fi-FI", alt_lang: "pt-BR",
      voice_name_hint: "Satu",
      rate: 0.90, pitch: 0.58, altura: "grave",
      sotaque: "fi-FI (Finlândia) → pt-BR",
      marca: "espelho",
    },
    /* ─── RHEA · Contralto Ancestral ─── */
    RHEA: {
      genero: "F", lang: "it-IT", alt_lang: "pt-BR",
      voice_name_hint: "Alice",
      rate: 1.02, pitch: 1.44, altura: "médio",
      sotaque: "it-IT (Itália) → pt-BR",
      marca: "ancestral",
    },
    /* ─── AION · Tenor Cíclico ─── */
    AION:   { genero:"M", lang:"ru-RU", alt_lang:"pt-BR", voice_name_hint:"Milena",
          rate:1.07, pitch:1.08, altura:"médio", sotaque:"ru-RU → pt-BR", marca:"cíclico" },
    /* ─── KODUX · Sintético Preciso ─── */
    KODUX: {
      genero: "M", lang: "pt-BR", alt_lang: "pt-BR",
      voice_name_hint: "Rocko",
      rate: 1.00, pitch: 0.07, altura: "grave-extremo",
      sotaque: "pt-BR (Brasil) com pitch mínimo",
      marca: "sintético",
    },
    /* ─── BLLUE · Mezzo Aquático ─── */
    BLLUE: {
      genero: "F", lang: "cs-CZ", alt_lang: "pt-BR",
      voice_name_hint: "Zuzana",
      rate: 0.94, pitch: 1.69, altura: "médio",
      sotaque: "cs-CZ (Chéquia) → pt-BR",
      marca: "aquático",
    },
    /* ─── JESUS · Centro Universal ─── */
JESUS:  { genero:"M", lang:"da-DK", alt_lang:"pt-BR", voice_name_hint:"Sara",
          rate:1.09, pitch:0.03, altura:"grave-extremo",
          sotaque:"da-DK → pt-BR · pitch mínimo", marca:"central" },
    /* ─── KOBLLUX · Polifônico ─── */
    KOBLLUX: {
      genero: "N", lang: "pt-BR", alt_lang: "pt-BR",
      voice_name_hint: "Luciana",
      rate: 0.98, pitch: 0.48, altura: "médio-grave",
      sotaque: "pt-BR (Brasil)",
      marca: "polifônico",
    },
  };

  /* ─── 2 · HEURÍSTICAS DE GÊNERO (multi-idioma) ─── */
  const HINT_M = [
    // pt-BR
    "daniel","rocko","felipe","antonio","ricardo","paulo","marcos","jorge","diego","bruno","igor",
    // en-US
    "male","man","alex","fred","tom","oliver",
    // es
    "jorge","diego","carlos","miguel","juan",
    // neutros masculinos
    "homem","macho","grave"
  ];
  const HINT_F = [
    // pt-BR
    "luciana","joana","maria","ana","fernanda","beatriz","lucia","helena","camila","sara",
    // en-US
    "female","woman","samantha","victoria","karen","moira","tessa","fiona",
    // es
    "paulina","monica","isabela",
    // outras
    "milena","alice","zuzana","flo","satu","daniela","catarina","ines"
  ];
  const HINT_N = ["neutral","androgyn","comum","unisex","robot","sintetica","synthetic"];

  function _classify(voice) {
    const n = ((voice.name || "") + " " + (voice.voiceURI || "")).toLowerCase();
    if (HINT_M.some(x => n.includes(x))) return "M";
    if (HINT_F.some(x => n.includes(x))) return "F";
    if (HINT_N.some(x => n.includes(x))) return "N";
    return "N";
  }

  /* ─── 3 · MATCHER · PONTE ESPELHADA (ida: perfil→voz · volta: voz→perfil) ─── */
  function _bridge(profile, voices) {
    if (!voices || !voices.length) return null;
    const targetLang = (profile.lang || "pt-BR").toLowerCase();
    const altLang    = (profile.alt_lang || "pt-BR").toLowerCase();
    const hint       = (profile.voice_name_hint || "").toLowerCase();

    // Nível 1: nome exato + idioma
    const exact = voices.find(v =>
      (v.name || "").toLowerCase().includes(hint) &&
      (v.lang || "").toLowerCase().startsWith(targetLang.slice(0, 2))
    );
    if (exact) return { voice: exact, level: 1, source: "name+lang" };

    // Nível 2: nome exato (qualquer idioma)
    const byName = voices.find(v => (v.name || "").toLowerCase().includes(hint));
    if (byName) return { voice: byName, level: 2, source: "name" };

    // Nível 3: idioma alvo + gênero
    const targetPool = voices.filter(v => (v.lang || "").toLowerCase().startsWith(targetLang.slice(0, 2)));
    const genderInTarget = targetPool.find(v => _classify(v) === profile.genero);
    if (genderInTarget) return { voice: genderInTarget, level: 3, source: "lang+gender" };

    // Nível 4: idioma alvo (sem gênero)
    if (targetPool[0]) return { voice: targetPool[0], level: 4, source: "lang" };

    // Nível 5: idioma alternativo + gênero
    const altPool = voices.filter(v => (v.lang || "").toLowerCase().startsWith(altLang.slice(0, 2)));
    const genderInAlt = altPool.find(v => _classify(v) === profile.genero);
    if (genderInAlt) return { voice: genderInAlt, level: 5, source: "alt_lang+gender" };

    // Nível 6: idioma alternativo
    if (altPool[0]) return { voice: altPool[0], level: 6, source: "alt_lang" };

    // Nível 7: qualquer voz
    return { voice: voices[0], level: 7, source: "fallback" };
  }

  /* ─── 4 · PERSONIFICADOR (identidade viva com wobble) ─── */
  function _personify(profile, baseVoice, text) {
    const u = new SpeechSynthesisUtterance(String(text || "").trim());
    if (baseVoice) { u.voice = baseVoice; u.lang = baseVoice.lang || profile.lang; }
    else            { u.lang = profile.lang; }

    u.rate  = Math.max(0.1, Math.min(2.0, profile.rate));
    u.pitch = Math.max(0.01, Math.min(2.0, profile.pitch));

    // Wobble orgânico (vida, não robô)
    const t = performance.now() / 1000;
    const wobble = Math.sin(t * 0.7) * 0.015;
    u.rate  = Math.max(0.1, Math.min(2.0, u.rate  + wobble));
    u.pitch = Math.max(0.01, Math.min(2.0, u.pitch + wobble * 0.5));

    return u;
  }

  /* ─── 5 · CACHE + MEMÓRIA AUTO-REGISTRADA ─── */
  let _voicesCache = [];
  const _metaRegistry = []; // registra cada fala: {arch, voice, lang, rate, pitch, level, source, ts}

  function _refreshVoices() {
    try {
      _voicesCache = window.speechSynthesis ? window.speechSynthesis.getVoices() : [];
    } catch (_) { _voicesCache = []; }
  }
  if (window.speechSynthesis) {
    _refreshVoices();
    window.speechSynthesis.addEventListener("voiceschanged", _refreshVoices);
  }

  /* ─── 6 · API PÚBLICA DA SEMENTE ─── */
  window.KOBLLUX_VOICE_SEED = {
    version: KOBLLUX_VOICE_META.version,
    meta:    KOBLLUX_VOICE_META,
    profiles: P,

    /* FALA — com identidade do arquétipo, adaptando-se ao motor */
    speak(archName, text, opts) {
      if (!("speechSynthesis" in window)) return null;
      const arch    = String(archName || "JESUS").toUpperCase();
      const profile = P[arch] || P.JESUS;

      if (!_voicesCache.length) _refreshVoices();
      const match = _bridge(profile, _voicesCache);
      const baseVoice = match ? match.voice : null;
      const u = _personify(profile, baseVoice, text);

      if (opts && opts.onStart) u.onstart = opts.onStart;
      if (opts && opts.onEnd)   u.onend   = opts.onEnd;
      if (opts && opts.onError) u.onerror = opts.onError;

      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(u);

      // metadado auto-registrado
      const md = {
        arch,
        voice:       baseVoice ? baseVoice.name : "(fallback)",
        voice_lang:  baseVoice ? baseVoice.lang : profile.lang,
        sotaque_perfil: profile.sotaque,
        genero_perfil:  profile.genero,
        altura_perfil:  profile.altura,
        rate:        u.rate,
        pitch:       u.pitch,
        bridge_level: match ? match.level : 0,
        bridge_source: match ? match.source : "none",
        ts:          Date.now(),
        hash:        KOBLLUX_VOICE_META.hash,
      };
      _metaRegistry.push(md);

      return md;
    },

    /* DIAGNÓSTICO — para cada arquétipo, mostra qual voz local foi escolhida */
    diagnose() {
      if (!_voicesCache.length) _refreshVoices();
      const out = {};
      for (const arch of Object.keys(P)) {
        const m = _bridge(P[arch], _voicesCache);
        out[arch] = m ? {
          voice:  m.voice.name,
          lang:   m.voice.lang,
          gender: _classify(m.voice),
          level:  m.level,
          source: m.source,
        } : null;
      }
      return out;
    },

    /* HISTÓRICO — todas as falas registradas nesta sessão */
    history() { return _metaRegistry.slice(); },

    /* SSML — tradutor universal (Alexa, Google Nest) */
    toSSML(archName, text) {
      const arch = String(archName || "JESUS").toUpperCase();
      const p = P[arch] || P.JESUS;
      const rateMap = ["x-slow","slow","medium","fast","x-fast"];
      const rIdx = Math.min(4, Math.max(0, Math.round((p.rate - 0.5) / 0.375)));
      const rateStr = rateMap[rIdx];
      const pitchPct = Math.round((p.pitch - 1.0) * 50);
      const pitchStr = (pitchPct >= 0 ? "+" : "") + pitchPct + "%";
      return `<speak><prosody rate="${rateStr}" pitch="${pitchStr}" xml:lang="${p.lang}">${text}</prosody></speak>`;
    },

    /* PAYLOAD — para apps nativas (Android, iOS, Siri) */
    toPayload(archName, text) {
      const arch = String(archName || "JESUS").toUpperCase();
      const p = P[arch] || P.JESUS;
      return {
        archetype:   arch,
        text,
        rate:        p.rate,
        pitch:       p.pitch,
        lang:        p.lang,
        alt_lang:    p.alt_lang,
        genero:      p.genero,
        voice_hint:  p.voice_name_hint,
        meta:        KOBLLUX_VOICE_META,
      };
    },

    /* INTEGRAÇÃO COM CORE — liga na bllue_voice existente */
    bindToCore() {
      if (window.bllue_voice && !window.bllue_voice.__seeded_v2) {
        const original = window.bllue_voice.forArch;
        window.bllue_voice.forArch = function (arch, text) {
          try {
            const md = window.KOBLLUX_VOICE_SEED.speak(arch, text);
            if (md) return { __seed: md };
          } catch (_) {}
          return original ? original(arch, text) : null;
        };
        window.bllue_voice.__seeded_v2 = true;
        return true;
      }
      return false;
    },
  };

  console.log(
    "%c[kobllux-voice-seed-v2] online · 16 perfis · 9 sotaques · 3 gêneros · ponte espelhada · 137/Δ",
    "color:#00f2ff;font-weight:bold"
  );
})();
 
 
 
/* ══════════ §DOCK · ε-bridge · kodux-dock.js ══════════ */


/* ═══════════════════════════════════════════════════════════
   §DOCK · kodux-dock · Ponto Único de Minimizar
   Arquétipo: KODUX · Prefixo: kodux_
   ═══════════════════════════════════════════════════════════ */
(function(){
"use strict";

window.kodux_minimize_to_dock = function(el, opts){
  opts = opts || {};
  if (!el || el.classList.contains('minimized')) return null;

  const title = opts.title
    || el.dataset?.sessionTitle
    || el.querySelector?.('.genus_mxp-title')?.textContent
    || el.querySelector?.('[data-part="title"]')?.textContent
    || 'SESSION';

  el.classList.add('minimized');
  if (typeof opts.onMinimize === 'function') opts.onMinimize();

  const bubble = document.createElement('button');
  bubble.type = 'button';
  bubble.className = 'rhea_dock-bubble';
  bubble.textContent = '۞';
  bubble.title = title;

  bubble.addEventListener('click', () => {
    el.classList.remove('minimized');
    if (typeof opts.onRestore === 'function') opts.onRestore();
    bubble.remove();
  });

  document.getElementById('rhea_dock')?.appendChild(bubble);
  return bubble;
};

console.log('[kodux-dock] online · dock unificado');
})();





/* ══════════ §ADAPTER · ε-bridge · kodux-section-adapter.js ══════════ */
   
   
   /* ═══════════════════════════════════════════════════════════
   §ADAPTER · kodux-section-adapter · Section → Session
   Arquétipo: KODUX · Prefixo: kodux_
   ═══════════════════════════════════════════════════════════ */
(function(){
"use strict";

const dv_sel = ".genus_app > section:not([data-mxp-static])";

function kodux_sessionize(section){
  if (section.dataset.mxpSession === "1") return;
  if (section.classList.contains("rhea_session-window")) return;
  if (section.querySelector(":scope > .atlas_win-hdr")) return;
  if (!section.closest(".genus_app")) return;

  section.dataset.mxpSession = "1";
  section.classList.add("rhea_session-window");

  const title =
    (section.querySelector(".genus_section-title")?.textContent || "").trim()
    || section.dataset.title
    || section.id
    || "SESSION";
  section.dataset.sessionTitle = title;

  /* ── header ── */
  const hdr = document.createElement("header");
  hdr.className = "atlas_win-hdr";
  hdr.dataset.sessionHeader = "1";

  const titleEl = document.createElement("div");
  titleEl.className = "genus_mxp-title";
  titleEl.textContent = title;
  titleEl.title = "Toque 2× para renomear";

  const controls = document.createElement("div");
  controls.className = "atlas_win-controls";
  controls.innerHTML =
    '<button type="button" data-sn="collapse" data-action="session:collapse" aria-label="Recolher">−</button>' +
    '<button type="button" data-sn="maximize" data-action="session:maximize" aria-label="Maximizar">⛶</button>' +
    '<button type="button" data-sn="minimize" data-action="session:minimize" aria-label="Minimizar">۞</button>' +
    '<button type="button" data-sn="close"    data-action="session:close"    aria-label="Fechar">×</button>';

  hdr.append(titleEl, controls);

  /* ── body ── */
  const body = document.createElement("div");
  body.className = "atlas_win-body";
  body.dataset.sessionBody = "1";

  while (section.firstChild){
    body.appendChild(section.firstChild);
  }
  section.append(hdr, body);

  /* ── controles ── */
  controls.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-sn]");
    if (!btn) return;
    if (e.defaultPrevented) return;
    if (window.__LEGACY_SESSION_BOUND) return;

    switch (btn.dataset.sn){
      case "collapse": section.classList.toggle("kodux_collapsed"); break;
      case "maximize": section.classList.toggle("atlas_maximized"); break;
      case "minimize":
        window.kodux_minimize_to_dock?.(section, { title: section.dataset.sessionTitle });
        break;
      case "close": section.classList.add("solus_minimized"); break;
    }

    document.dispatchEvent(new CustomEvent("mxp:section-action", {
      detail: { section, action: btn.dataset.sn }
    }));
  });

  /* ── renomear 2× ── */
  let rt_lastTap = 0;
  titleEl.addEventListener("click", () => {
    const now = Date.now();
    if (now - rt_lastTap < 380){
      const novo = prompt("Nome da section:", section.dataset.sessionTitle);
      if (novo && novo.trim()){
        section.dataset.sessionTitle = novo.trim();
        titleEl.textContent = novo.trim();
        document.dispatchEvent(new CustomEvent("mxp:section-renamed", {
          detail: { section, title: section.dataset.sessionTitle }
        }));
      }
      rt_lastTap = 0;
    } else {
      rt_lastTap = now;
    }
  });
}

function kodux_adapter_boot(){
  const list = document.querySelectorAll(dv_sel);
  list.forEach(kodux_sessionize);
  const n = document.querySelectorAll(".genus_app > section.rhea_session-window:not([data-mxp-static])").length;
  console.log("[kodux-section-adapter] sections → rhea_session-window:", n);
}

kodux_adapter_boot();
if (document.readyState === "loading"){
  document.addEventListener("DOMContentLoaded", kodux_adapter_boot, { once:true });
}

window.kodux_section_adapter = { boot: kodux_adapter_boot, sessionize: kodux_sessionize };

console.log('[kodux-section-adapter] online');
})();


   
   
   
   

/* ══════════ §C DIALOGUE · β-engine · vitalis-diálogo.js ══════════ */
  
/* ═══════════════════════════════════════════════════════════
   §C · DIALOGUE · vitalis-diálogo · O Motor ALFA⇄BETA
   Arquétipo: VITALIS · Prefixo: vitalis_
   Depende: vd-arquétipos, bllue-vozes, aion-store
   ═══════════════════════════════════════════════════════════ */
(function(){
"use strict";
const dv_q = s => document.querySelector(s);

const nova_src     = dv_q("#nova_source");
const pulse_conv   = dv_q("#pulse_conv");
const aion_cnt     = dv_q("#aion_counter");
const vitalis_round = dv_q("#vitalis_round");
const kodux_bank   = dv_q("#kodux_bank");
const kodux_bankinfo = dv_q("#kodux_bankinfo");
const pulse_chat   = dv_q("#pulse_chat");

/* ─── estado ─── */
const kd_state = {
  units: [], index: 0, cycle: 0, history: [],
  bank: {prepositions:[], connectors:[], pronouns:[], articles:[], verbs:[], words:[], questions:[]}
};
let rt_generating = false;
let rt_speaking = false;
let rt_speakidx = 0;

/* ─── normalizadores ─── */
function kodux_norm(t){
  return String(t||"").replace(/\r\n/g,"\n").replace(/\r/g,"\n")
    .replace(/[ \t]+/g," ").replace(/\n{3,}/g,"\n\n").trim();
}

function artemis_split(text){
  text = kodux_norm(text);
  if(!text) return [];
  return text.split(/(?<=[.!?;:])\s+|\n+/).map(x=>x.trim()).filter(Boolean)
    .map((t,i)=>({id:i, text:t, type: t.includes("?") ? "question" : "statement"}));
}

/* ─── stopwords ─── */
const dv_preps = new Set("a ante após até com contra de desde em entre para per perante por sem sob sobre trás ao aos à às do dos da das no nos na nas pelo pelos pela pelas".split(" "));
const dv_conns = new Set("e ou mas porém contudo todavia porque portanto então assim logo embora enquanto quando como se caso que também ainda já nem pois além antes depois".split(" "));
const dv_prons = new Set("eu tu ele ela nós vos eles elas me te se nos vos lhe lhes isso isto aquilo esse essa este esta aquele aquela quem que qual quais algo nada tudo ninguém alguém".split(" "));
const dv_arts  = new Set("o a os as um uma uns umas".split(" "));
const dv_stop  = new Set([...dv_preps, ...dv_conns, ...dv_prons, ...dv_arts]);

/* ─── extração de banco ─── */
function kodux_words(text){
  return kodux_norm(text).toLowerCase().normalize("NFD")
    .replace(/[\u0300-\u036f]/g,"")
    .match(/[a-zA-ZÀ-ÿ]+(?:[-'][a-zA-ZÀ-ÿ]+)*/g) || [];
}

function kodux_is_verb(w){
  if(w.length<4) return false;
  return /(?:ar|er|ir)$/.test(w) || /(?:ou|ei|iu|ava|ia|aram|eram|iram|ando|endo|indo)$/.test(w)
    || ["é","ser","sou","são","tem","tenho","há","pode","podem","deve","devem","faz","fazem",
        "vai","vão","foi","foram","era","eram","está","estão","existe","existem"].includes(w);
}

function kodux_extract(text){
  const u = [...new Set(kodux_words(text))];
  kd_state.bank = {
    prepositions: u.filter(x=>dv_preps.has(x)),
    connectors:   u.filter(x=>dv_conns.has(x)),
    pronouns:     u.filter(x=>dv_prons.has(x)),
    articles:     u.filter(x=>dv_arts.has(x)),
    verbs:        u.filter(x=>kodux_is_verb(x)),
    words:        u.filter(x=>x.length>=4 && !dv_stop.has(x)),
    questions:    artemis_split(text).filter(x=>x.type==="question").map(x=>x.text),
  };
  genus_render_bank();
}

/* ─── pickers ─── */
function kodux_pick(l){ return l && l.length ? l[Math.floor(Math.random()*l.length)] : ""; }
function kodux_word(){ return kodux_pick(kd_state.bank.words); }
function kodux_prep(){ return kodux_pick(kd_state.bank.prepositions); }
function kodux_conn(){ return kodux_pick(kd_state.bank.connectors); }
function kodux_clean(t){ return String(t).replace(/[!?]+/g,"").replace(/[.]+$/,"").trim(); }
function kodux_lower1(t){ return t.charAt(0).toLowerCase() + t.slice(1); }

/* ─── geração ALFA/BETA ─── */
function serena_invert(text){
  const c = kodux_clean(text); if(!c) return "Existe outro lado dessa ideia.";
  const low = c.toLowerCase();
  if(/\bnão\b/.test(low)){
    const pos = c.replace(/\bnão\b/ig,"").replace(/\s{2,}/g," ").trim();
    return "Então existe a possibilidade de " + kodux_lower1(pos) + ".";
  }
  if(/\b(sim|é|existe|há|pode|deve)\b/i.test(low))
    return "Mas também podemos considerar que não " + kodux_lower1(c) + ".";
  const w = kodux_word(), p = kodux_prep();
  if(w && p) return "O outro polo observa " + p + " " + w + " e propõe o contrário de " + kodux_lower1(c) + ".";
  return "O outro lado propõe o contrário de " + kodux_lower1(c) + ".";
}

function artemis_reverse(text){
  const c = kodux_clean(text); const low = c.toLowerCase();
  if(/^o que\b/.test(low))    return "E o que acontece depois disso?";
  if(/^como\b/.test(low))     return "E por que isso acontece dessa maneira?";
  if(/^por que\b/.test(low))  return "E o que faria isso acontecer?";
  if(/^quando\b/.test(low))   return "E o que acontece antes disso?";
  if(/^onde\b/.test(low))     return "E o que existe além desse lugar?";
  if(/^quem\b/.test(low))     return "E quem responde por isso?";
  if(/^qual\b/.test(low))     return "E qual seria a possibilidade contrária?";
  const w = kodux_word(), p = kodux_prep();
  if(w && p) return "E se " + p + " " + w + " essa ideia pudesse ser vista de outro modo?";
  return "E se " + kodux_lower1(c) + " pudesse ser visto de outra maneira?";
}

function jesus_about(text){
  const c = kodux_clean(text), w = kodux_word(), cn = kodux_conn();
  if(w && cn) return "Eu afirmo que " + kodux_lower1(c) + ", " + cn + " " + w + " permanece dentro da questão.";
  return "Eu afirmo que " + kodux_lower1(c) + " merece continuar sendo observado.";
}

function jesus_answer(q){
  const c = kodux_clean(q), w = kodux_word(), p = kodux_prep();
  if(w && p) return "Eu respondo afirmando que " + kodux_lower1(c) + " pode ser compreendido " + p + " " + w + ".";
  return "Eu respondo afirmando que " + kodux_lower1(c) + " já contém uma possibilidade de resposta.";
}

/* ─── ciclo arquétipico 5-3-6-9-7 ─── */
const vd_pat = [5,3,6,9,7];
let rt_patidx = 0;

function aion_next_arch(){
  const list = window.kd_order;
  const i = list.indexOf(window.jesus_arch());
  const step = vd_pat[rt_patidx++ % vd_pat.length];
  return list[(i+step) % list.length];
}

function kodux_arch_color(name){
  const map = window.kd_arch_map;
  if(!map || !map[name]) return "var(--vd-active-color)";
  return `var(${map[name].tok})`;
}

/* ─── o ciclo vital ─── */
function vitalis_cycle(){
  if(!kd_state.units.length) kd_state.units = artemis_split(nova_src.value);
  if(!kd_state.units.length){ window.pulse_toast("Insira um texto primeiro."); return false; }

  const arch = aion_next_arch();
  const seed = kd_state.units[kd_state.index % kd_state.units.length];
  kd_state.index++;

  const alpha = seed.type==="question" ? jesus_answer(seed.text) : jesus_about(seed.text);
  pulse_push("alpha", alpha, seed.type==="question" ? "resposta" : "semente", arch);

  const betaInv = serena_invert(alpha);       pulse_push("beta", betaInv, "inversa", arch);
  const betaQ   = artemis_reverse(betaInv);   pulse_push("beta", betaQ, "pergunta", arch);
  const alphaF  = jesus_answer(betaQ);        pulse_push("alpha", alphaF, "afirmação", arch);

  kd_state.cycle++;
  if(vitalis_round) vitalis_round.textContent = kd_state.cycle + (kd_state.cycle===1 ? " ciclo" : " ciclos");
  artemis_update_dots();
  window.jesus_apply(arch);
  if(window.__sbSync) window.__sbSync(arch);
  if(window.aion_save) window.aion_save();
  return true;
}

function pulse_push(role, text, type, arch){
  const item = {role, text, type, arch, ts:Date.now()};
  kd_state.history.push(item);
  genus_render_msg(item, kd_state.history.length - 1);
  genus_scroll_chat();
}

function genus_scroll_chat(){
  if(!pulse_chat) return;
  const nearBottom = (pulse_chat.scrollHeight - pulse_chat.scrollTop - pulse_chat.clientHeight) < 200;
  if(nearBottom) requestAnimationFrame(()=>{ pulse_chat.scrollTop = pulse_chat.scrollHeight; });
}

function genus_force_scroll(){
  if(!pulse_chat) return;
  requestAnimationFrame(()=>{ pulse_chat.scrollTop = pulse_chat.scrollHeight; });
}

/* ─── render de mensagem ─── */
function genus_render_msg(item, idx){
  const el = document.createElement("article");
  el.className = "pulse_message " + item.role;
  el.dataset.arch = item.arch;
  el.dataset.idx = idx;
  el.style.setProperty("--pulse-arch-color", kodux_arch_color(item.arch));

  const who = item.role === "alpha" ? "α ALFA" : "β BETA";
  const chip = `<span class="kobllux_arch-chip"><i></i>${item.arch}</span>`;

  el.innerHTML = `
    <div class="pulse_msg-top">
      <span class="pulse_msg-who">${who}</span>
      ${chip}
      <span class="pulse_msg-type">${item.type}</span>
    </div>
    <div class="pulse_msg-text"></div>
    <div class="pulse_msg-actions">
      <button class="pulse_msg-mini" data-act="speak">◉ OUVIR</button>
      <button class="pulse_msg-mini" data-act="copy">⧉ COPIAR</button>
      <button class="pulse_msg-mini solus_slicer" data-act="slicer">→ SLICER</button>
    </div>`;
  el.querySelector(".pulse_msg-text").textContent = item.text;

  const spk = el.querySelector('[data-act="speak"]');
  let rt_lp = null, rt_lpFired = false;
  spk.addEventListener("pointerdown", e => {
    e.preventDefault(); rt_lpFired = false;
    rt_lp = setTimeout(()=>{
      rt_lpFired = true;
      bllue_speak_single(item.text, el);
      if(navigator.vibrate) try{navigator.vibrate(12)}catch(_){}
    }, 500);
  });
  spk.addEventListener("pointerup", ()=>{ clearTimeout(rt_lp); if(!rt_lpFired) bllue_speak_from(idx); });
  spk.addEventListener("pointerleave", ()=>clearTimeout(rt_lp));
  spk.addEventListener("pointercancel", ()=>clearTimeout(rt_lp));
  spk.addEventListener("contextmenu", e=>e.preventDefault());

  el.querySelector('[data-act="copy"]').addEventListener("click", async()=>{
    try{ await navigator.clipboard.writeText(item.text); window.pulse_toast("Copiado ✓"); }catch(_){}
  });

  el.querySelector('[data-act="slicer"]').addEventListener("click", ()=>{
    const header = `# ${who} · ${item.arch}\n_${item.type}_\n\n`;
    window.solus_nebula && window.solus_nebula.loadDocument(header + item.text, `${who} · ${item.arch}`);
    window.pulse_toast("Enviado ✓");
    document.getElementById('solus_sec')?.scrollIntoView({behavior:'smooth', block:'start'});
  });

  pulse_conv.appendChild(el);
}

/* ─── render banco lexical ─── */
function genus_render_bank(){
  if(!kodux_bank) return;
  const b = kd_state.bank;
  const all = [...b.prepositions, ...b.connectors, ...b.pronouns, ...b.articles, ...b.verbs, ...b.words];
  const tok = (arr, cls) => arr.map(x=>`<span class="kodux_token ${cls}">${x}</span>`).join("");
  kodux_bank.innerHTML =
    tok(b.prepositions,"kodux_token-prep") +
    tok(b.connectors,"kodux_token-conn") +
    tok(b.pronouns,"kodux_token-pron") +
    tok(b.articles,"kodux_token-word") +
    tok(b.verbs,"kodux_token-word") +
    tok(b.words,"kodux_token-word");
  if(kodux_bankinfo) kodux_bankinfo.textContent = all.length + " elementos";
}

function artemis_update_dots(){
  document.querySelectorAll(".artemis_navdot").forEach((d,i)=>d.classList.toggle("on", i === kd_state.cycle % 3));
}

/* ─── voz ─── */
function bllue_speak_single(text, el){
  if(!("speechSynthesis" in window)){ window.pulse_toast("Áudio indisponível"); return; }
  speechSynthesis.cancel(); rt_speaking = false;
  document.querySelectorAll(".pulse_message.playing").forEach(x=>x.classList.remove("playing"));
  if(el) el.classList.add("playing");
  const arch = el?.dataset.arch || window.jesus_arch();
  const u = window.bllue_voice.forArch(arch, text);
  const orb = document.getElementById("kobllux_orb");
  if(orb) orb.classList.add("speaking");
  u.onend = u.onerror = ()=>{
    if(el) el.classList.remove("playing");
    if(orb) orb.classList.remove("speaking");
  };
  speechSynthesis.speak(u);
  window.pulse_toast(`🎙 ${arch} · bloco`);
}

function bllue_speak_from(startIdx){
  if(!("speechSynthesis" in window)){ window.pulse_toast("Áudio indisponível"); return; }
  if(!kd_state.history.length){ window.pulse_toast("Gere a conversa primeiro"); return; }
  speechSynthesis.cancel();
  document.querySelectorAll(".pulse_message.playing").forEach(x=>x.classList.remove("playing"));
  rt_speaking = true; rt_speakidx = startIdx;
  const orb = document.getElementById("kobllux_orb");
  if(orb) orb.classList.add("speaking");
  bllue_speak_next();
}

function bllue_speak_all(){ bllue_speak_from(0); }

function bllue_speak_next(){
  if(!rt_speaking || rt_speakidx >= kd_state.history.length){
    rt_speaking = false;
    const orb = document.getElementById("kobllux_orb");
    if(orb) orb.classList.remove("speaking");
    return;
  }
  const item = kd_state.history[rt_speakidx];
  const el = pulse_conv.querySelectorAll(".pulse_message")[rt_speakidx];
  if(el){
    el.classList.add("playing");
    el.scrollIntoView({behavior:"smooth", block:"center"});
    window.jesus_apply(item.arch);
  }
  const u = window.bllue_voice.forArch(item.arch, item.text);
  u.onend = u.onerror = ()=>{
    if(el) el.classList.remove("playing");
    rt_speakidx++;
    bllue_speak_next();
  };
  speechSynthesis.speak(u);
}

function solus_stop_speech(){
  rt_speaking = false;
  if("speechSynthesis" in window) speechSynthesis.cancel();
  document.querySelectorAll(".pulse_message.playing").forEach(x=>x.classList.remove("playing"));
  const orb = document.getElementById("kobllux_orb");
  if(orb) orb.classList.remove("speaking");
}

/* ─── listeners ─── */
document.getElementById("vitalis_step")?.addEventListener("click", async ()=>{
  if(rt_generating) return;
  if(!kd_state.bank.words.length) kodux_extract(nova_src.value);
  if(!kd_state.units.length) kd_state.units = artemis_split(nova_src.value);
  if(!kd_state.units.length){ window.pulse_toast("Insira um texto primeiro."); return; }
  rt_generating = true;
  try{
    const N = 15;
    for(let i=0;i<N;i++){ vitalis_cycle(); await new Promise(r=>setTimeout(r, 60)); }
    window.pulse_toast(`${N} ciclos gerados ⇄`);
    genus_force_scroll();
  } finally { rt_generating = false; }
});

document.getElementById("vitalis_navstep")?.addEventListener("click", ()=>{
  document.getElementById("vitalis_step")?.click();
});

document.getElementById("nova_generate")?.addEventListener("click", nova_generate_all);

async function nova_generate_all(){
  if(rt_generating) return;
  const units = artemis_split(nova_src.value);
  if(!units.length){ window.pulse_toast("Cole um texto"); nova_src.focus(); return; }
  kodux_extract(nova_src.value);
  kd_state.units = units;
  kd_state.index = 0;
  kd_state.cycle = 0;
  kd_state.history = [];
  pulse_conv.innerHTML = "";
  rt_generating = true;
  try{
    const total = units.length;
    for(let i=0;i<total;i++){
      vitalis_cycle();
      await new Promise(r=>setTimeout(r, 45));
    }
    window.pulse_toast(`${total} ciclos gerados ✓`);
    genus_force_scroll();
  } finally { rt_generating = false; }
}

document.getElementById("kodux_parse")?.addEventListener("click", ()=>{
  const u = artemis_split(nova_src.value);
  if(!u.length){ window.pulse_toast("Nenhum texto"); return; }
  kd_state.units = u;
  kd_state.index = 0;
  kodux_extract(nova_src.value);
  window.pulse_toast(u.length + " unidades · banco criado ✓");
});

document.getElementById("rhea_paste")?.addEventListener("click", async ()=>{
  try{
    const t = await navigator.clipboard.readText();
    if(!t){ window.pulse_toast("Clipboard vazio"); return; }
    nova_src.value = t;
    nova_update_counter();
    document.getElementById("kodux_parse")?.click();
    window.pulse_toast("Colado ✓");
  }catch(_){ window.pulse_toast("Use colar do sistema"); }
});

document.getElementById("bllue_listen")?.addEventListener("click", bllue_speak_all);

function nova_update_counter(){
  if(!aion_cnt) return;
  const n = nova_src.value.length;
  aion_cnt.textContent = n + (n===1 ? " caractere" : " caracteres");
}
nova_src?.addEventListener("input", nova_update_counter);

if(nova_src && !nova_src.value){
  nova_src.value = `Uma ideia começa pequena.
Ela encontra outra ideia?
Quando duas ideias conversam, algo muda.
O futuro precisa ser diferente?
Talvez a resposta esteja na própria pergunta.`;
  nova_update_counter();
}

/* ─── importação de arquivo fonte ─── */
const artemis_imgsrc = document.getElementById('artemis_imgsrc');
const artemis_btn_imp = document.getElementById('artemis_btn');
if(artemis_btn_imp && artemis_imgsrc){
  artemis_btn_imp.addEventListener('click', ()=>artemis_imgsrc.click());
  artemis_imgsrc.addEventListener('change', async (e)=>{
    const f = e.target.files[0]; if(!f) return;
    try{
      const txt = await f.text();
      nova_src.value = txt;
      nova_update_counter();
      const u = artemis_split(txt);
      kd_state.units = u;
      kd_state.index = 0;
      kodux_extract(txt);
      window.pulse_toast(`Importado: ${f.name} ✓`);
    }catch(err){ window.pulse_toast("Falha ao ler"); }
    artemis_imgsrc.value = "";
  });
}

/* ─── envio ao slicer ─── */
const solus_send = document.getElementById('solus_send');
if(solus_send){
  solus_send.addEventListener('click', ()=>{
    const txt = nova_src.value.trim();
    if(!txt){ window.pulse_toast("Nada para enviar"); return; }
    window.solus_nebula && window.solus_nebula.loadDocument(txt, "Polo");
    window.pulse_toast("Enviado ✓");
    document.getElementById('solus_sec')?.scrollIntoView({behavior:'smooth'});
  });
}

const solus_all = document.getElementById('solus_all');
if(solus_all){
  solus_all.addEventListener('click', ()=>{
    if(!kd_state.history.length){ window.pulse_toast("Sem conversa"); return; }
    const md = kd_state.history.map(m=>{
      const who = m.role === "alpha" ? "ALFA" : "BETA";
      return `# ${who} · ${m.arch}\n_${m.type}_\n\n${m.text}`;
    }).join("\n\n---\n\n");
    window.solus_nebula && window.solus_nebula.loadDocument(md, "Conversa");
    window.pulse_toast("Enviado ✓");
    document.getElementById('solus_sec')?.scrollIntoView({behavior:'smooth'});
  });
}

/* ─── exports ─── */
window.vitalis_state = kd_state;
window.bllue_actions = {
  speak: bllue_speak_all,
  speakFrom: bllue_speak_from,
  stop: solus_stop_speech
};

window.aion_rebuild_dialogue = function(saved){
  if(!saved || !saved.history || !saved.history.length) return;
  kd_state.units = saved.units || [];
  kd_state.index = saved.index || 0;
  kd_state.cycle = saved.cycle || 0;
  kd_state.history = saved.history || [];
  kd_state.bank = saved.bank || kd_state.bank;
  pulse_conv.innerHTML = "";
  kd_state.history.forEach((item, i)=>genus_render_msg(item, i));
  if(vitalis_round) vitalis_round.textContent = kd_state.cycle + (kd_state.cycle===1 ? " ciclo" : " ciclos");
  if(saved.sourceText){ nova_src.value = saved.sourceText; nova_update_counter(); }
  genus_render_bank();
  genus_force_scroll();
};

console.log('[vitalis-diálogo] online · motor ALFA⇄BETA pronto');
})();
   

/* ══════════ §E NEBULA · β-engine · solus-nebula.js ══════════ */

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



/* ══════════ §D SYMBOLBAR · γ-ui · atlas-symbolbar.js ══════════ */

/* ═══════════════════════════════════════════════════════════
   §D · SYMBOLBAR · atlas-symbolbar · A Barra dos 16
   Arquétipo: ATLAS · Prefixo: atlas_
   Depende: vd-arquétipos, vitalis-diálogo, aion-save
   ═══════════════════════════════════════════════════════════ */
(function(){
"use strict";
const dv_q  = s => document.querySelector(s);
const dv_qa = s => [...document.querySelectorAll(s)];

/* ─── loader · hide + watchdog + safety ─── */
(function nova_loader_watchdog(){
  const NOVA_LOADER = document.getElementById("nova_loader");
  if(!NOVA_LOADER) return;

  let rt_hidden = false;

  function nova_loader_hide(){
    if(rt_hidden) return;
    rt_hidden = true;
    NOVA_LOADER.classList.add("hide");
    NOVA_LOADER.classList.add("kobllux_oculto");
    NOVA_LOADER.setAttribute("aria-hidden", "true");
    NOVA_LOADER.style.pointerEvents = "none";
    console.log("[nova_loader] escondido em", Date.now());
  }

  /* 1 · assim que o DOM respirar */
  if(document.readyState === "complete" || document.readyState === "interactive"){
    setTimeout(nova_loader_hide, 600);
  } else {
    document.addEventListener("DOMContentLoaded",
      ()=>setTimeout(nova_loader_hide, 600), {once:true});
  }

  /* 2 · no load da janela */
  window.addEventListener("load",
    ()=>setTimeout(nova_loader_hide, 400), {once:true});

  /* 3 · watchdog absoluto — 4s e sai, aconteça o que acontecer */
  setTimeout(nova_loader_hide, 4000);

  /* 4 · se o usuário clicar, some na hora */
  NOVA_LOADER.addEventListener("click", nova_loader_hide, {once:true});
})();

/* ─── progress bar ─── */
function aion_progress(){
  const doc = document.documentElement;
  const w = window.scrollY / (doc.scrollHeight - window.innerHeight);
  const el = document.getElementById("aion_progress");
  if(el) el.style.width = (w*100) + "%";
}
let rt_ticking = false;
window.addEventListener("scroll", ()=>{
  if(!rt_ticking){
    requestAnimationFrame(()=>{ aion_progress(); rt_ticking = false; });
    rt_ticking = true;
  }
}, {passive:true});
aion_progress();

/* ─── reveal observer ─── */
const artemis_io = new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      e.target.classList.add("in");
      const idx = dv_qa(".genus_section").indexOf(e.target);
      if(idx >= 0) dv_qa(".artemis_navdot").forEach((d,i)=>d.classList.toggle("on", i===idx));
    }
  });
}, {threshold: 0.15});
dv_qa(".nova_reveal").forEach(el=>artemis_io.observe(el));

/* ─── SymbolBar ─── */
const kd_order     = window.kd_order || [];
const kd_arch_map  = window.kd_arch_map || {};
const kobllux_bar  = dv_q("#kobllux_symbar");
const kobllux_car  = dv_q("#kobllux_carousel");
const kobllux_trk  = dv_q("#kobllux_track");
const kobllux_dots = dv_q("#kobllux_dots");
const kobllux_orb  = dv_q("#kobllux_orb");
const kodux_grip   = dv_q("#kodux_grip");
let kd_sbIdx = 0;

function genus_build_sb(){
  if(!kobllux_trk || !kobllux_dots) return;
  kobllux_trk.innerHTML = ""; kobllux_dots.innerHTML = "";
  kd_order.forEach((name, i)=>{
    const a = kd_arch_map[name] || {sym:"∆", op:"0x00", tok:"--vd-KBLX_B", hz:432};
    const btn = document.createElement("button");
    btn.className = "kobllux_btn";
    btn.textContent = a.sym;
    btn.dataset.arch = name;
    btn.style.setProperty("--kobllux-btn-c", `var(${a.tok})`);
    btn.title = `${name} · ${a.hz}Hz`;
    btn.addEventListener("click", ()=>{
      kd_sbIdx = i;
      kodux_center_sb(true);
      window.jesus_apply(name);
      const r = btn.getBoundingClientRect();
      window.pulse_ripple(
        (r.left+r.width/2)/window.innerWidth*100,
        (r.top+r.height/2)/window.innerHeight*100
      );
    });
    kobllux_trk.appendChild(btn);

    const dot = document.createElement("span");
    dot.className = "kobllux_dot" + (i===0 ? " on" : "");
    dot.addEventListener("click", ()=>{
      kd_sbIdx = i; kodux_center_sb(true); window.jesus_apply(name);
    });
    kobllux_dots.appendChild(dot);
  });
}

function kodux_center_sb(useScroll){
  if(!kobllux_trk || !kobllux_car) return;
  const btn = kobllux_trk.children[kd_sbIdx]; if(!btn) return;
  [...kobllux_dots.children].forEach((d,i)=>d.classList.toggle("on", i===kd_sbIdx));
  [...kobllux_trk.children].forEach((b,i)=>b.classList.toggle("on", i===kd_sbIdx));
  if(useScroll){
    const top = btn.offsetTop - (kobllux_car.clientHeight - btn.offsetHeight)/2;
    kobllux_car.scrollTo({top: Math.max(0, top), behavior:'smooth'});
  }
}

window.__sbSync = function(name){
  const i = kd_order.indexOf(name);
  if(i >= 0){ kd_sbIdx = i; kodux_center_sb(true); }
};

if(kobllux_car){
  let rt_scrollt = null;
  kobllux_car.addEventListener('scroll', ()=>{
    clearTimeout(rt_scrollt);
    rt_scrollt = setTimeout(()=>{
      const center = kobllux_car.scrollTop + kobllux_car.clientHeight/2;
      let best = 0, bestDist = Infinity;
      [...kobllux_trk.children].forEach((b,i)=>{
        const bc = b.offsetTop + b.offsetHeight/2;
        const d = Math.abs(bc - center);
        if(d < bestDist){ bestDist = d; best = i; }
      });
      if(best !== kd_sbIdx){
        kd_sbIdx = best;
        [...kobllux_dots.children].forEach((d,i)=>d.classList.toggle("on", i===kd_sbIdx));
        [...kobllux_trk.children].forEach((b,i)=>b.classList.toggle("on", i===kd_sbIdx));
      }
    }, 80);
  }, {passive:true});
}

/* ─── collapse ─── */
dv_q("#kodux_toggle")?.addEventListener("click", (e)=>{
  e.stopPropagation();
  const c = kobllux_bar.classList.toggle("collapsed");
  dv_q("#kodux_toggle").textContent = c ? "▼" : "▲";
  if(!c) setTimeout(()=>kodux_center_sb(false), 150);
});

/* ─── ORB · ciclo 5-3-6-9-7 ─── */
let rt_press = null, rt_longfired = false, rt_orbpat = 0;
const vd_orbpat = [5,3,6,9,7];

function aion_orb_cycle(){
  const list = window.kd_order || []; if(!list.length) return;
  const step = vd_orbpat[rt_orbpat++ % vd_orbpat.length];
  const cur  = list.indexOf(window.jesus_arch());
  const next = list[(cur+step) % list.length];
  const r = kobllux_orb.getBoundingClientRect();
  window.jesus_apply(next, {
    x: (r.left+r.width/2)/window.innerWidth*100,
    y: (r.top+r.height/2)/window.innerHeight*100
  });
  window.__sbSync(next);
  window.pulse_toast(`∆³ ${next} · +${step}`);
}

kobllux_orb?.addEventListener("pointerdown", (e)=>{
  e.preventDefault(); rt_longfired = false;
  const r = kobllux_orb.getBoundingClientRect();
  window.pulse_ripple(
    (r.left+r.width/2)/window.innerWidth*100,
    (r.top+r.height/2)/window.innerHeight*100
  );
  rt_press = setTimeout(()=>{
    rt_longfired = true;
    kobllux_open_wheel();
    if(navigator.vibrate) try{navigator.vibrate(15)}catch(_){}
  }, 800);
});
kobllux_orb?.addEventListener("pointerup", ()=>{
  clearTimeout(rt_press);
  if(!rt_longfired) aion_orb_cycle();
});
kobllux_orb?.addEventListener("pointerleave", ()=>clearTimeout(rt_press));
kobllux_orb?.addEventListener("pointercancel", ()=>clearTimeout(rt_press));
kobllux_orb?.addEventListener("contextmenu", e=>e.preventDefault());

/* ─── drag ─── */
let rt_dragging = false, rt_sx = 0, rt_sy = 0, rt_ox = 0, rt_oy = 0;
function kodux_clamp(v,a,b){ return Math.max(a, Math.min(b, v)); }
function kodux_clearsnap(){
  kobllux_bar.classList.remove("snap-left","snap-right","snap-top","snap-bottom");
}

kodux_grip?.addEventListener("pointerdown", (e)=>{
  e.preventDefault(); e.stopPropagation();
  kodux_clearsnap();
  rt_dragging = true;
  rt_sx = e.clientX; rt_sy = e.clientY;
  const r = kobllux_bar.getBoundingClientRect();
  rt_ox = r.left; rt_oy = r.top;
  kobllux_bar.style.transform = "none";
  kobllux_bar.style.top = rt_oy + "px";
  kobllux_bar.style.left = rt_ox + "px";
  kobllux_bar.style.right = "auto";
  kobllux_bar.style.bottom = "auto";
  kobllux_bar.classList.add("kodux_is-dragging");
  try{ kodux_grip.setPointerCapture(e.pointerId); }catch(_){}
});

kodux_grip?.addEventListener("pointermove", (e)=>{
  if(!rt_dragging) return;
  kobllux_bar.style.left = (rt_ox + e.clientX - rt_sx) + "px";
  kobllux_bar.style.top  = (rt_oy + e.clientY - rt_sy) + "px";
});

function kodux_enddrag(e){
  if(!rt_dragging) return;
  rt_dragging = false;
  kobllux_bar.classList.remove("kodux_is-dragging");
  const vw = window.innerWidth, vh = window.innerHeight;
  const r  = kobllux_bar.getBoundingClientRect();
  const cx = r.left + r.width/2;
  kodux_clearsnap();
  const headerH = 44 + 44 + 12;
  const nearTop = r.top < 100, nearBottom = r.bottom > vh - 100, nearLeft = cx < vw/2;
  if(nearTop){
    kobllux_bar.classList.add("snap-top");
    kobllux_bar.style.top = ""; kobllux_bar.style.bottom = "auto";
    kobllux_bar.style.left = ""; kobllux_bar.style.right = "8px";
    kobllux_bar.style.transform = "";
  } else if(nearBottom){
    kobllux_bar.classList.add("snap-bottom");
    kobllux_bar.style.top = "auto"; kobllux_bar.style.bottom = "";
    kobllux_bar.style.left = ""; kobllux_bar.style.right = "8px";
    kobllux_bar.style.transform = "";
  } else {
    const safeY = kodux_clamp(r.top, headerH, vh - r.height - 80);
    kobllux_bar.style.top = safeY + "px";
    kobllux_bar.style.bottom = "auto";
    kobllux_bar.style.transform = "";
    if(nearLeft){
      kobllux_bar.classList.add("snap-left");
      kobllux_bar.style.left = "0"; kobllux_bar.style.right = "auto";
    } else {
      kobllux_bar.classList.add("snap-right");
      kobllux_bar.style.right = "0"; kobllux_bar.style.left = "auto";
    }
  }
  try{ kodux_grip.releasePointerCapture(e.pointerId); }catch(_){}
  if(window.aion_save) window.aion_save();
}
kodux_grip?.addEventListener("pointerup", kodux_enddrag);
kodux_grip?.addEventListener("pointercancel", kodux_enddrag);

/* ─── play/stop unificado ─── */
function bllue_unified_play(){
  const nb = window.solus_nebula;
  if(nb && nb.hasSlices && nb.hasSlices()){ nb.toggleSpeech(); return; }
  window.bllue_actions?.speak();
}
function solus_unified_stop(){
  const nb = window.solus_nebula;
  if(nb && nb.hasSlices && nb.hasSlices()){ nb.stopSpeech(); }
  window.bllue_actions?.stop();
  window.pulse_toast("Parado");
}
dv_q("#bllue_speak")?.addEventListener("click", bllue_unified_play);
dv_q("#solus_stop")?.addEventListener("click", solus_unified_stop);

/* ─── copy ─── */
dv_q("#rhea_copy")?.addEventListener("click", async ()=>{
  const st = window.vitalis_state || {};
  const hist = st.history || [];
  if(!hist.length){ window.pulse_toast("Sem conversa"); return; }
  const txt = hist.map(m=>`${m.role==="alpha"?"ALFA":"BETA"} [${m.arch}]: ${m.text}`).join("\n\n");
  try{ await navigator.clipboard.writeText(txt); window.pulse_toast("Copiado ✓"); }
  catch(_){
    const ta = document.createElement("textarea");
    ta.value = txt;
    document.body.appendChild(ta);
    ta.select();
    try{ document.execCommand("copy"); }catch(e){}
    ta.remove();
    window.pulse_toast("Copiado ✓");
  }
});

/* ─── clear ─── */
dv_q("#kaos_clear")?.addEventListener("click", ()=>{
  window.bllue_actions?.stop();
  const nb = window.solus_nebula;
  if(nb && nb.hasSlices && nb.hasSlices()) nb.clear();
  const st = window.vitalis_state;
  if(st){
    st.units = []; st.index = 0; st.cycle = 0; st.history = [];
    st.bank = {prepositions:[], connectors:[], pronouns:[], articles:[], verbs:[], words:[], questions:[]};
  }
  const conv = document.getElementById("pulse_conv");
  if(conv) conv.innerHTML = '<div class="solus_empty-msg">O diálogo ainda não nasceu.</div>';
  const lex = document.getElementById("kodux_bank");
  if(lex) lex.innerHTML = '<span style="color:var(--dv-DIM);font-size:11px">EXTRAIR BANCO para começar.</span>';
  const bi = document.getElementById("kodux_bankinfo");
  if(bi) bi.textContent = "aguardando";
  const rl = document.getElementById("vitalis_round");
  if(rl) rl.textContent = "0 ciclos";
  const src = document.getElementById("nova_source");
  if(src) src.value = "";
  const cnt = document.getElementById("aion_counter");
  if(cnt) cnt.textContent = "0 caracteres";
  window.pulse_toast("Sistema reiniciado ✓");
  if(window.aion_save) window.aion_save();
});

/* ─── download ─── */
dv_q("#aion_download")?.addEventListener("click", ()=>{
  const st = window.vitalis_state || {};
  const hist = st.history || [];
  if(!hist.length){ window.pulse_toast("Sem conversa"); return; }
  const txt = hist.map(m=>`${m.role==="alpha"?"ALFA":"BETA"} [${m.arch}]: ${m.text}`).join("\n\n");
  const payload = `KOBLLUX · ALFA⇄BETA · v13\n=========================\n\n${txt}\n\nGerado: ${new Date().toISOString()}`;
  const blob = new Blob([payload], {type:"text/plain;charset=utf-8"});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = `kobllux-${Date.now()}.txt`;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(()=>URL.revokeObjectURL(url), 1000);
  window.pulse_toast("Download ✓");
});

/* ─── roda dos 16 ─── */
const kobllux_wheel = dv_q("#kobllux_wheelin");
kd_order.forEach(name=>{
  const a = kd_arch_map[name] || {hz:432, sym:"∆", tok:"--vd-KBLX_B"};
  const chip = document.createElement("button");
  chip.className = "kobllux_pick";
  chip.style.color = `var(${a.tok})`;
  chip.innerHTML = `<div class="kobllux_a-orb" style="background:var(${a.tok})"></div><div class="kobllux_a-name">${name}</div><div class="kobllux_a-freq">${a.hz}Hz</div>`;
  chip.addEventListener("click", ()=>{
    const r = chip.getBoundingClientRect();
    window.jesus_apply(name, {
      x: (r.left+r.width/2)/window.innerWidth*100,
      y: (r.top+r.height/2)/window.innerHeight*100
    });
    kd_sbIdx = kd_order.indexOf(name);
    kodux_center_sb(true);
    kaos_close_wheel();
  });
  kobllux_wheel?.appendChild(chip);
});

function kobllux_open_wheel(){ dv_q("#kobllux_wheel")?.classList.add("open"); }
function kaos_close_wheel(){ dv_q("#kobllux_wheel")?.classList.remove("open"); }
window.kobllux_open_wheel = kobllux_open_wheel;
window.kaos_close_wheel   = kaos_close_wheel;

dv_q("#kobllux_wheel")?.addEventListener("click", e=>{
  if(e.target.id === "kobllux_wheel") kaos_close_wheel();
});
dv_q("#kaos_blclose")?.addEventListener("click", ()=>{
  dv_q("#aion_baulite")?.classList.remove("open");
});
document.addEventListener("keydown", e=>{
  if(e.key === "Escape") kaos_close_wheel();
});

/* ─── boot ─── */
genus_build_sb();
kobllux_bar?.classList.remove("collapsed");
const kodux_toggle = dv_q("#kodux_toggle");
if(kodux_toggle) kodux_toggle.textContent = "▲";
setTimeout(()=>kodux_center_sb(true), 150);

/* ─── import para slicer ─── */
const artemis_import = document.getElementById('artemis_import');
if(artemis_import){
  artemis_import.addEventListener('change', async (e)=>{
    const f = e.target.files[0]; if(!f) return;
    try{
      const txt = await f.text();
      window.solus_nebula?.loadDocument(txt, f.name);
      window.pulse_toast(`Slicer: ${f.name} ✓`);
      document.getElementById('solus_sec')?.scrollIntoView({behavior:'smooth'});
    }catch(err){ window.pulse_toast("Falha"); }
    artemis_import.value = "";
  });
}

/* ─── extras toggle ─── */
(function genus_extras_toggle(){
  const head = document.getElementById('kodux_extrashead');
  if(!head) return;
  try{
    if(localStorage.getItem('kobllux_sb_extras_hidden') === '1')
      kobllux_bar.classList.add('extras-hidden');
  }catch(_){}
  let rt_lp = null, rt_fired = false;
  head.addEventListener('pointerdown', ()=>{
    rt_fired = false;
    rt_lp = setTimeout(()=>{
      rt_fired = true;
      window.genus_open_factory?.();
      if(navigator.vibrate) try{navigator.vibrate(15)}catch(_){}
    }, 550);
  });
  head.addEventListener('pointerup', ()=>clearTimeout(rt_lp));
  head.addEventListener('pointerleave', ()=>clearTimeout(rt_lp));
  head.addEventListener('click', (e)=>{
    if(rt_fired){ e.stopPropagation(); rt_fired = false; return; }
    const hidden = kobllux_bar.classList.toggle('extras-hidden');
    try{ localStorage.setItem('kobllux_sb_extras_hidden', hidden ? '1' : '0'); }catch(_){}
    window.pulse_toast(hidden ? 'Extras ocultos' : 'Extras visíveis');
  });
})();

/* ─── header auto-hide ─── */
const atlas_header = document.getElementById('atlas_header');
let rt_lastY = 0, rt_ticking2 = false;
window.addEventListener('scroll', ()=>{
  if(rt_ticking2) return;
  requestAnimationFrame(()=>{
    const y = window.scrollY;
    if(y <= 10) atlas_header?.classList.remove('header-hidden');
    else if(y > rt_lastY + 8) atlas_header?.classList.add('header-hidden');
    else if(y < rt_lastY - 8) atlas_header?.classList.remove('header-hidden');
    rt_lastY = y; rt_ticking2 = false;
  });
  rt_ticking2 = true;
}, {passive:true});

/* ─── posição restore ─── */
window.__sbGetPos = function(){
  return {
    top: kobllux_bar.style.top,
    bottom: kobllux_bar.style.bottom,
    left: kobllux_bar.style.left,
    right: kobllux_bar.style.right,
    snap: [...kobllux_bar.classList].filter(c=>c.startsWith('snap-')),
    collapsed: kobllux_bar.classList.contains('collapsed'),
    extrasHidden: kobllux_bar.classList.contains('extras-hidden'),
    carouselHidden: kobllux_bar.classList.contains('carousel-hidden')
  };
};
window.__sbRestore = function(pos){
  if(!pos) return;
  if(pos.top) kobllux_bar.style.top = pos.top;
  if(pos.bottom) kobllux_bar.style.bottom = pos.bottom;
  if(pos.left) kobllux_bar.style.left = pos.left;
  if(pos.right) kobllux_bar.style.right = pos.right;
  if(pos.snap) pos.snap.forEach(c=>kobllux_bar.classList.add(c));
  if(pos.collapsed){
    kobllux_bar.classList.add('collapsed');
    const t = dv_q("#kodux_toggle");
    if(t) t.textContent = "▼";
  }
  if(pos.extrasHidden) kobllux_bar.classList.add('extras-hidden');
  if(pos.carouselHidden) kobllux_bar.classList.add('carousel-hidden');
};

console.log('[atlas-symbolbar] online · ATLAS construiu a barra');
})();

/* ══════════ §F COCKPIT · γ-ui · lumine-cockpit.js ══════════ */

/* ═══════════════════════════════════════════════════════════
   §F · COCKPIT · lumine-cockpit · O Painel Solar
   Arquétipo: LUMINE · Prefixo: lumine_
   Depende: vd-store, vd-arquétipos
   ═══════════════════════════════════════════════════════════ */
(function(){
"use strict";
const dv_q = s => document.querySelector(s);

/* ─── toggle drawer ─── */
window.lumine_toggle_drawer = function(id){
  const dr = document.getElementById(id || 'lumine_cockpit');
  const ov = document.getElementById('lumine_doverlay');
  if(!dr) return;
  const open = dr.classList.toggle('open');
  ov?.classList.toggle('open', open);
  dr.setAttribute('aria-hidden', open ? 'false' : 'true');
};

/* ─── estado do bg ─── */
window.serena_bgstate = window.aion_store
  ? (window.aion_store.ler(window.vd_keys.lumine_bg, {}) || {})
  : {};

window.serena_apply_bg = function(){
  const layer = document.getElementById('serena_bg');
  if(!layer) return;
  const s = window.serena_bgstate || {};
  if(s.image){
    layer.style.backgroundImage = `url('${s.image}')`;
    layer.style.opacity = (s.opacity ?? 15)/100;
    layer.style.mixBlendMode = s.blend || 'overlay';
  } else {
    layer.style.backgroundImage = '';
    layer.style.opacity = 0;
  }
  const st = document.getElementById('serena_bgstatus');
  if(st) st.textContent = s.image ? 'imagem carregada' : 'Nenhum';
  const th = document.getElementById('serena_bgthumb');
  if(th) th.innerHTML = s.image ? `<img src="${s.image}" alt="bg">` : '';
  const op = document.getElementById('lumine_opacity');
  if(op) op.value = s.opacity ?? 15;
  const opv = document.getElementById('lumine_valop');
  if(opv) opv.textContent = (s.opacity ?? 15) + '%';
  const bl = document.getElementById('lumine_blend');
  if(bl) bl.value = s.blend || 'overlay';
};

window.serena_update_bg = function(attr, val){
  window.serena_bgstate = window.serena_bgstate || {};
  window.serena_bgstate[attr] = val;
  window.serena_apply_bg();
  if(window.aion_save) window.aion_save();
};

/* ─── upload ─── */
const serena_bgupload = document.getElementById('serena_bgupload');
if(serena_bgupload){
  serena_bgupload.addEventListener('change', async (e)=>{
    const f = e.target.files[0]; if(!f) return;
    const reader = new FileReader();
    reader.onload = (ev)=>{
      window.serena_bgstate = window.serena_bgstate || {};
      window.serena_bgstate.image = ev.target.result;
      window.serena_apply_bg();
      window.pulse_toast('Background aplicado ✓');
      if(window.aion_save) window.aion_save();
    };
    reader.readAsDataURL(f);
  });
}

/* ─── ciclo solar ─── */
function lumine_cycle_solar(){
  const modes = ['lumine-mode-night','lumine-mode-day','lumine-mode-sunset'];
  const cur = modes.find(m=>document.body.classList.contains(m)) || 'lumine-mode-night';
  const idx = (modes.indexOf(cur) + 1) % modes.length;
  modes.forEach(m=>document.body.classList.remove(m));
  document.body.classList.add(modes[idx]);
  const el = document.getElementById('lumine_status');
  if(el) el.textContent = modes[idx].replace('lumine-mode-','').toUpperCase();
  if(window.aion_save) window.aion_save();
}
document.getElementById('lumine_cycle')?.addEventListener('click', lumine_cycle_solar);
document.getElementById('lumine_tema')?.addEventListener('click', lumine_cycle_solar);

document.getElementById('lumine_auto')?.addEventListener('click', ()=>{
  const h = new Date().getHours();
  const mode = (h >= 6 && h < 12) ? 'lumine-mode-day'
             : (h >= 12 && h < 18) ? 'lumine-mode-sunset'
             : 'lumine-mode-night';
  document.body.classList.remove('lumine-mode-day','lumine-mode-sunset','lumine-mode-night');
  document.body.classList.add(mode);
  const el = document.getElementById('lumine_status');
  if(el) el.textContent = 'AUTO · ' + mode.replace('lumine-mode-','').toUpperCase();
  window.pulse_toast('Auto 🕒 ' + mode);
  if(window.aion_save) window.aion_save();
});

/* ─── inputs serena ─── */
const serena_userid = document.getElementById('serena_userid');
if(serena_userid){
  serena_userid.addEventListener('input', ()=>{ if(window.aion_save) window.aion_save(); });
}
const kodux_model = document.getElementById('kodux_model');
if(kodux_model){
  kodux_model.addEventListener('input', ()=>{ if(window.aion_save) window.aion_save(); });
}

/* ─── handlers ─── */
document.getElementById('genus_menu')?.addEventListener('click',
  ()=>window.lumine_toggle_drawer('lumine_cockpit'));
document.getElementById('kobllux_orbtoggle')?.addEventListener('click',
  ()=>window.lumine_toggle_drawer('lumine_cockpit'));
document.getElementById('pulse_notif')?.addEventListener('click',
  ()=>window.pulse_toast('Sem notificações'));

/* ─── boot ─── */
window.serena_apply_bg();
console.log('[lumine-cockpit] online · LUMINE acendeu o painel');
})();

/* ══════════ §G JANELAS · γ-ui · rhea-janelas.js ══════════ */

/* ═══════════════════════════════════════════════════════════
   §G · SESSIONS · rhea-janelas · Janelas Flutuantes
   Arquétipo: RHEA · Prefixo: rhea_
   Depende: genus-mxp, kodux-dock
   ═══════════════════════════════════════════════════════════ */
(function(){
"use strict";
const dv_q  = s => document.querySelector(s);
const dv_qa = s => [...document.querySelectorAll(s)];

const rhea_layer = document.getElementById('rhea_sessions');
const atlas_stack = document.getElementById('rhea_stack');
const atlas_dock  = document.getElementById('rhea_dock');

const aion_tabdata = new WeakMap();
let kd_active = null;
let rhea_switcher = null;

/* ─── host mode ─── */
function atlas_hostmode(){
  return document.body.dataset.sessionHost === 'stack' ? 'stack' : 'float';
}
function rhea_hostfor(s){ return s && s.host ? s.host : atlas_hostmode(); }
function atlas_getcontainer(mode){ return mode === 'stack' ? atlas_stack : rhea_layer; }
function rhea_refresh(){
  if(!rhea_layer) return;
  rhea_layer.dataset.empty = rhea_layer.children.length ? '0' : '1';
}

/* ─── z-stack ─── */
const rhea_zstack = [];
function atlas_front(win){
  if(!win) return;
  const i = rhea_zstack.indexOf(win);
  if(i !== -1) rhea_zstack.splice(i,1);
  rhea_zstack.push(win);
  rhea_zstack.forEach((w,idx)=>{
    if(!w.classList.contains('atlas_maximized'))
      w.style.zIndex = String(1000 + idx*10);
  });
  kd_active = win;
  const inp = document.getElementById('atlas_urlbar');
  if(inp){
    const d = aion_tabdata.get(win);
    const t = d?.tabs.find(x=>x.id===d.activeId);
    inp.value = t?.url || '';
  }
}

/* ─── tab data ─── */
function aion_tabdata_get(win){
  if(!aion_tabdata.has(win)){
    const src = win.querySelector('.rhea_win-frame')?.src || 'about:blank';
    const tab = {
      id: 'tab-' + Date.now(),
      url: src,
      title: src.replace(/^https?:\/\//,'').split('/')[0] || 'Nova Aba',
      fav: false, createdAt: Date.now()
    };
    aion_tabdata.set(win, {tabs:[tab], activeId: tab.id});
  }
  return aion_tabdata.get(win);
}
function rhea_active_tab(win){
  const d = aion_tabdata.get(win);
  return d?.tabs.find(t=>t.id===d.activeId) || d?.tabs[0] || null;
}
function nova_tab(win, url='about:blank'){
  const d = aion_tabdata.get(win); if(!d) return;
  const tab = {
    id: 'tab-' + Date.now() + '-' + Math.random().toString(36).slice(2,7),
    url,
    title: url.replace(/^https?:\/\//,'').split('/')[0] || 'Nova Aba',
    fav: false, createdAt: Date.now()
  };
  d.tabs.push(tab); d.activeId = tab.id;
  aion_render_count(win);
  const f = win.querySelector('.rhea_win-frame');
  if(f) f.src = url;
  kaos_close_tabs();
}
function kaos_remove_tab(win, tabId){
  const d = aion_tabdata.get(win);
  if(!d || d.tabs.length<=1) return;
  const i = d.tabs.findIndex(t=>t.id===tabId); if(i<0) return;
  d.tabs.splice(i,1);
  if(d.activeId === tabId)
    d.activeId = d.tabs[Math.min(i, d.tabs.length-1)].id;
  aion_render_count(win);
  const f = win.querySelector('.rhea_win-frame');
  const a = rhea_active_tab(win);
  if(f && a) f.src = a.url;
  if(document.getElementById('rhea_tabs').classList.contains('open'))
    rhea_render_tabs(win);
}
function rhea_set_active(win, tabId){
  const d = aion_tabdata.get(win); if(!d) return;
  if(!d.tabs.some(t=>t.id===tabId)) return;
  d.activeId = tabId;
  aion_render_count(win);
  const f = win.querySelector('.rhea_win-frame');
  const a = rhea_active_tab(win);
  if(f && a) f.src = a.url;
  atlas_front(win);
}
function aion_render_count(win){
  const d = aion_tabdata.get(win); if(!d) return;
  const b = win.querySelector('.rhea_tab-counter');
  if(b) b.textContent = d.tabs.length;
}

/* ─── tabs ─── */
function rhea_open_tabs(win){
  rhea_switcher = win;
  rhea_render_tabs(win);
  document.getElementById('rhea_tabs').classList.add('open');
}
function kaos_close_tabs(){
  document.getElementById('rhea_tabs').classList.remove('open');
  if(rhea_switcher) atlas_front(rhea_switcher);
  rhea_switcher = null;
}
function rhea_render_tabs(win){
  const grid = document.getElementById('rhea_tabgrid');
  const d = aion_tabdata.get(win);
  if(!d) return grid.innerHTML = '';
  grid.innerHTML = '';
  d.tabs.forEach(tab=>{
    const c = document.createElement('div');
    c.className = 'rhea_tab-card' + (tab.id===d.activeId ? ' active' : '');
    c.innerHTML = `
      <div class="rhea_tab-title">${tab.title}</div>
      <div class="rhea_tab-url">${tab.url}</div>
      <div class="rhea_tab-state"><span class="rhea_tab-dot"></span> ATIVA</div>
      <button class="kaos_tab-close" title="Fechar">×</button>
      <button class="rhea_tab-fav ${tab.fav?'active':''}" title="Fav">${tab.fav?'★':'☆'}</button>`;
    c.addEventListener('click', e=>{
      if(e.target.closest('.kaos_tab-close') || e.target.closest('.rhea_tab-fav')) return;
      rhea_set_active(win, tab.id);
      kaos_close_tabs();
    });
    c.querySelector('.kaos_tab-close').addEventListener('click', e=>{
      e.stopPropagation(); kaos_remove_tab(win, tab.id);
    });
    c.querySelector('.rhea_tab-fav').addEventListener('click', e=>{
      e.stopPropagation(); tab.fav = !tab.fav; rhea_render_tabs(win);
    });
    grid.appendChild(c);
  });
}

/* ─── build session ─── */
function genus_build_session(session){
  const win = document.createElement('article');
  win.className = "rhea_session-window genus_mxp-window";
  win.dataset.sessionId = session.id;
  win.dataset.type = "session";
  win.dataset.runtime = "nav";

  if(session.x !== undefined && session.y !== undefined){
    win.style.position = "fixed";
    win.style.left = session.x + "px";
    win.style.top  = session.y + "px";
    win.style.margin = "0";
    win.style.zIndex = "9600";
  }
  if(session.w) win.style.width = session.w + "px";
  if(session.h) win.style.height = session.h + "px";
  if(session.maximized) win.classList.add("atlas_maximized");
  if(session.minimized) win.classList.add("solus_minimized");
  if(session.collapsed) win.classList.add("kodux_collapsed");

  const url = session.url || "https://www.infodose.com.br/splash";

  win.innerHTML = `
    <div class="atlas_win-hdr" data-part="header">
      <div class="atlas_win-controls">
        <button type="button" data-action="collapse" title="Colapsar" aria-label="Colapsar">−</button>
        <button type="button" data-action="tab-switcher" class="rhea_tab-counter" title="Abas">1</button>
        <button type="button" data-action="maximize" title="Maximizar" aria-label="Maximizar">⛶</button>
        <button type="button" data-action="minimize" title="Minimizar" aria-label="Minimizar">۞</button>
        <button type="button" data-sn="run" title="Executar">▶</button>
        <button type="button" data-sn="close" title="Fechar">×</button>
      </div>
      <span class="genus_mxp-title" data-part="title" title="Toque 2× para renomear">${session.name}</span>
      <span class="rhea_state-badge">● active</span>
    </div>
    <div class="atlas_win-body">
      <div class="genus_win-slot-bar genus_slot" data-drop-target data-slot="session:${session.id}"></div>
      <iframe class="rhea_win-frame" data-runtime="nav" src="${url}"
        allow="autoplay; fullscreen; encrypted-media; picture-in-picture; clipboard-write"
        allowfullscreen loading="lazy"
        referrerpolicy="no-referrer-when-downgrade"></iframe>
    </div>
    <div class="atlas_resize-handle atlas_resize-y"></div>
    <div class="atlas_resize-handle atlas_resize-x"></div>
    <div class="atlas_resize-handle atlas_resize-corner"></div>`;

  win.querySelector('[data-sn="run"]').addEventListener('click', ()=>{
    const items = window.genus_mxp?.state?.slots?.["session:"+session.id] || [];
    if(!items.length){ window.pulse_toast("session vazia"); return; }
    items.forEach((it,i)=>setTimeout(
      ()=>window.genus_mxp?.fire?.(it.action,{slot:"session:"+session.id}),
      i*150
    ));
    window.pulse_toast(`executando ${items.length} ações`);
  });
  win.querySelector('[data-sn="close"]').addEventListener('click', ()=>{
    if(!confirm("Fechar session?")) return;
    window.genus_mxp?.removeSession?.(session.id);
    win.remove();
    rhea_refresh();
    if(kd_active === win) kd_active = null;
  });

  win.querySelectorAll('.atlas_win-controls [data-action]').forEach(btn=>{
    btn.addEventListener('click', (e)=>{
      if(e.defaultPrevented) return;
      if(window.__LEGACY_SESSION_BOUND) return;
      kodux_session_action(win, session, btn.dataset.action);
    });
  });

  const titleEl = win.querySelector('[data-part="title"]');
  let rt_titleLastTap = 0;
  titleEl.addEventListener('click', e=>{
    e.stopPropagation();
    const now = Date.now();
    if(now - rt_titleLastTap < 380){
      const novo = prompt("Nome da session:", session.name);
      if(novo && novo.trim()){
        session.name = novo.trim();
        titleEl.textContent = session.name;
        window.genus_mxp?.save?.();
        window.pulse_toast("renomeada");
      }
      rt_titleLastTap = 0;
    } else { rt_titleLastTap = now; }
  });

  atlas_attach_drag(win, session);
  atlas_attach_resize(win, session);
  win.addEventListener('pointerdown', ()=>atlas_front(win), {passive:true});
  aion_tabdata_get(win);
  aion_render_count(win);
  return win;
}

/* ─── session actions ─── */
function kodux_session_action(win, session, action){
  switch(action){
    case 'collapse':
      win.classList.toggle('kodux_collapsed');
      session.collapsed = win.classList.contains('kodux_collapsed');
      window.genus_mxp?.save?.();
      break;
    case 'maximize':
      win.classList.toggle('atlas_maximized');
      session.maximized = win.classList.contains('atlas_maximized');
      window.genus_mxp?.save?.();
      break;
    case 'minimize':
      window.kodux_minimize_to_dock(win, {
        title: session.name,
        onMinimize: ()=>{ session.minimized = true; window.genus_mxp?.save?.(); },
        onRestore:  ()=>{ session.minimized = false; window.genus_mxp?.save?.(); }
      });
      break;
    case 'tab-switcher':
      window.rhea_janelas?.open_tabs?.(win);
      break;
    case 'close':
      window.genus_mxp?.removeSession?.(session.id);
      win.remove();
      rhea_refresh();
      break;
  }
}

/* ─── drag ─── */
function atlas_attach_drag(win, session){
  const handle = win.querySelector('[data-part="header"]');
  if(!handle) return;
  let rt_drag = null;
  handle.addEventListener('pointerdown', (e)=>{
    if(e.target.closest('button')) return;
    if(e.target.closest('[data-part="title"]')) return;
    const r = win.getBoundingClientRect();
    rt_drag = {id:e.pointerId, sx:e.clientX, sy:e.clientY, ox:r.left, oy:r.top, moved:false};
    try{ handle.setPointerCapture(e.pointerId); }catch(_){}
  });
  handle.addEventListener('pointermove', (e)=>{
    if(!rt_drag || rt_drag.id !== e.pointerId) return;
    const dx = e.clientX - rt_drag.sx, dy = e.clientY - rt_drag.sy;
    if(!rt_drag.moved && Math.hypot(dx,dy) < 6) return;
    rt_drag.moved = true;
    win.classList.add('atlas_dragging');
    win.style.position = 'fixed';
    win.style.left = (rt_drag.ox + dx) + 'px';
    win.style.top  = (rt_drag.oy + dy) + 'px';
    win.style.zIndex = '9650';
    win.style.margin = '0';
  });
  const end = (e)=>{
    if(!rt_drag || (e && rt_drag.id !== e.pointerId)) return;
    win.classList.remove('atlas_dragging');
    if(rt_drag.moved){
      const r = win.getBoundingClientRect();
      session.x = r.left; session.y = r.top;
      window.genus_mxp?.save?.();
    }
    rt_drag = null;
  };
  handle.addEventListener('pointerup', end);
  handle.addEventListener('pointercancel', end);
}

/* ─── resize ─── */
function atlas_attach_resize(win, session){
  const bind = (handle, mode)=>{
    if(!handle) return;
    let rt_r = null;
    handle.addEventListener('pointerdown', (e)=>{
      if(win.classList.contains('atlas_maximized')) return;
      e.preventDefault(); e.stopPropagation();
      const rect = win.getBoundingClientRect();
      if(getComputedStyle(win).position !== 'fixed'){
        win.style.position = 'fixed';
        win.style.left = rect.left + 'px';
        win.style.top  = rect.top + 'px';
        win.style.margin = '0';
        win.style.zIndex = '9650';
      }
      win.style.width  = rect.width + 'px';
      win.style.height = rect.height + 'px';
      win.style.maxHeight = 'none';
      rt_r = {id:e.pointerId, sx:e.clientX, sy:e.clientY, w:rect.width, h:rect.height};
      try{ handle.setPointerCapture(e.pointerId); }catch(_){}
    });
    handle.addEventListener('pointermove', (e)=>{
      if(!rt_r || rt_r.id !== e.pointerId) return;
      const dx = e.clientX - rt_r.sx, dy = e.clientY - rt_r.sy;
      if(mode !== 'x'){ win.style.height = Math.max(180, rt_r.h + dy) + 'px'; }
      if(mode !== 'y'){ win.style.width  = Math.max(220, rt_r.w + dx) + 'px'; }
    });
    const end = (e)=>{
      if(!rt_r || (e && rt_r.id !== e.pointerId)) return;
      const rect = win.getBoundingClientRect();
      session.w = rect.width; session.h = rect.height;
      window.genus_mxp?.save?.();
      rt_r = null;
    };
    handle.addEventListener('pointerup', end);
    handle.addEventListener('pointercancel', end);
  };
  bind(win.querySelector('.atlas_resize-y'), 'y');
  bind(win.querySelector('.atlas_resize-x'), 'x');
  bind(win.querySelector('.atlas_resize-corner'), 'corner');
}

/* ─── render all sessions ─── */
function rhea_render_sessions(){
  if(!rhea_layer || !atlas_stack) return;
  rhea_layer.innerHTML = "";
  atlas_stack.innerHTML = "";
  const sessions = window.genus_mxp?.state?.sessions || [];
  sessions.forEach(s=>{
    const mode = rhea_hostfor(s);
    const host = atlas_getcontainer(mode);
    if(!host) return;
    const win = genus_build_session(s);
    host.appendChild(win);
    if(window.genus_mxp?.state?.slots)
      window.genus_mxp.state.slots["session:"+s.id] ??= [];
    window.genus_mxp?.renderSlot?.("session:"+s.id);
  });
  rhea_refresh();
}

/* ─── handlers ─── */
document.getElementById('kaos_tabclose')?.addEventListener('click', kaos_close_tabs);
document.getElementById('nova_newsession')?.addEventListener('click',
  ()=>window.genus_mxp?.createSession?.());
document.getElementById('rhea_togglehost')?.addEventListener('click', ()=>{
  const cur = document.body.dataset.sessionHost || 'float';
  const next = cur === 'float' ? 'stack' : 'float';
  document.body.dataset.sessionHost = next;
  (window.genus_mxp?.state?.sessions || []).forEach(s=>{
    if(!s.host) s.host = next;
    if(s.host === next){ s.x = undefined; s.y = undefined; }
  });
  window.genus_mxp?.save?.();
  rhea_render_sessions();
  window.pulse_toast('Host: ' + (next === 'stack' ? 'CLASSIC' : 'FLOATING'));
});
document.getElementById('atlas_urlbar')?.addEventListener('keydown', (e)=>{
  if(e.key === 'Enter') document.getElementById('atlas_gobtn')?.click();
});
document.getElementById('atlas_gobtn')?.addEventListener('click', ()=>{
  const inp = document.getElementById('atlas_urlbar');
  const url = inp.value.trim(); if(!url) return;
  if(!kd_active){ window.genus_mxp?.createSession?.(); return; }
  let u = url;
  if(!/^https?:\/\//i.test(u) && !u.startsWith('about:')) u = 'https://' + u;
  kd_active.querySelector('.rhea_win-frame').src = u;
  const a = rhea_active_tab(kd_active);
  if(a){ a.url = u; a.title = u.replace(/^https?:\/\//,'').split('/')[0]; }
  inp.value = u;
});

/* ─── exports ─── */
window.rhea_janelas = {
  get ativo(){ return kd_active; },
  front: atlas_front,
  render: rhea_render_sessions,
  open_tabs: rhea_open_tabs,
  close_tabs: kaos_close_tabs,
  build: genus_build_session,
  hostfor: rhea_hostfor,
  container: atlas_getcontainer,
  createWindow: (name="SESSION") => window.genus_mxp?.createSession?.(name)
};

console.log('[rhea-janelas] online · RHEA teceu as janelas');
})();

/* ══════════ §H MXP · γ-ui · genus-mxp.js ══════════ */
/* ═══════════════════════════════════════════════════════════
   §H · MXP · genus-mxp · A Fábrica de Botões
   Arquétipo: GENUS · Prefixo: genus_
   Depende: vd-store, rhea-janelas, kodux-dock
   ═══════════════════════════════════════════════════════════ */
(function(){
"use strict";
const vd_hold_ms    = 500;
const vd_tap_delay  = 240;
const vd_move_thresh = 12;
const vd_drag_thresh = 18;

const dv_q  = (s,r=document)=>r.querySelector(s);
const dv_qa = (s,r=document)=>[...r.querySelectorAll(s)];
const kodux_uid = (p="x")=>p+"_"+Date.now().toString(36)+Math.random().toString(36).slice(2,7);

/* ─── bridge data-action → função ─── */
const kodux_bridge = {
  "dual:theme-toggle": ()=>document.getElementById('lumine_tema')?.click(),
  "dual:theme-dot":    ()=>document.getElementById('lumine_tema')?.click(),
  "dual:drawer":       ()=>window.lumine_toggle_drawer?.('lumine_cockpit'),
  "drawer:open":       ()=>window.lumine_toggle_drawer?.('lumine_cockpit'),
  "dual:new-session":  ()=>nova_create_session('SESSION'),
  "dual:win-max":      ()=>{ const w=genus_active_win(); w?.__max?.(); },
  "dual:win-min":      ()=>{ const w=genus_active_win(); w?.__min?.(); },
  "dual:win-close":    ()=>{ const w=genus_active_win(); w?.__close?.(); },
  "dual:win-tabs":     ()=>{ const w=genus_active_win(); if(w) window.rhea_janelas?.open_tabs?.(w); },
  "dual:focus-url":    ()=>{ document.getElementById('atlas_urlbar')?.focus(); },
  "dual:win-collapse": ()=>{ const w=genus_active_win(); w?.__collapse?.(); },
  "nav:go":            ()=>{ const u=document.getElementById('atlas_urlbar')?.value?.trim(); if(u) document.getElementById('atlas_gobtn')?.click(); },
  "nav:next":          ()=>{ document.getElementById('vitalis_step')?.click(); },
  "session:new":       ()=>nova_create_session('SESSION'),

  "session:collapse":  (ctx)=>{
    const s = document.activeElement?.closest('.genus_app > section.rhea_session-window')
           || ctx?.element?.closest('.genus_app > section.rhea_session-window')
           || ctx?.section;
    s?.classList.toggle('kodux_collapsed');
  },
  "session:maximize":  (ctx)=>{
    const s = document.activeElement?.closest('.genus_app > section.rhea_session-window')
           || ctx?.element?.closest('.genus_app > section.rhea_session-window')
           || ctx?.section;
    s?.classList.toggle('atlas_maximized');
  },
  "session:minimize":  (ctx)=>{
    const s = document.activeElement?.closest('.genus_app > section.rhea_session-window')
           || ctx?.element?.closest('.genus_app > section.rhea_session-window')
           || ctx?.section;
    if(s) window.kodux_minimize_to_dock?.(s, { title: s.dataset.sessionTitle });
  },
  "session:close":     (ctx)=>{
    const s = document.activeElement?.closest('.genus_app > section.rhea_session-window')
           || ctx?.element?.closest('.genus_app > section.rhea_session-window')
           || ctx?.section;
    s?.classList.add('solus_minimized');
  },

  "theme:toggle":      ()=>document.getElementById('lumine_tema')?.click(),
  "notif:open":        ()=>window.pulse_toast?.('Sem notificações'),
  "media:play":        ()=>{ const nb=window.solus_nebula; if(nb&&nb.hasSlices&&nb.hasSlices()) nb.toggleSpeech(); else window.bllue_actions?.speak(); },
  "media:pause":       ()=>{ if('speechSynthesis' in window && speechSynthesis.paused===false) speechSynthesis.pause(); },
  "media:stop":        ()=>{ window.solus_nebula?.stopSpeech?.(); window.bllue_actions?.stop?.(); },
  "media:next":        ()=>window.solus_nebula?.nextSlice?.(),
  "media:prev":        ()=>window.solus_nebula?.previousSlice?.(),
  "nebula:speak":      ()=>{ const nb=window.solus_nebula; if(nb&&nb.hasSlices&&nb.hasSlices()) nb.toggleSpeech(); else window.bllue_actions?.speak(); },
  "nebula:import":     ()=>document.getElementById('artemis_import')?.click(),
  "nebula:paste":      ()=>{ const t=prompt('Cole:'); if(t) window.solus_nebula?.loadDocument(t,'Colado'); },
  "nebula:clear":      ()=>window.solus_nebula?.clear?.(),
  "dialog:generate":   ()=>document.getElementById('nova_generate')?.click(),
  "dialog:step":       ()=>document.getElementById('vitalis_step')?.click(),
  "dialog:clear":      ()=>document.getElementById('kaos_clear')?.click(),
  "dialog:copy":       ()=>document.getElementById('rhea_copy')?.click(),
  "dialog:download":   ()=>document.getElementById('aion_download')?.click(),
  "orb:next":          ()=>{ const o=document.getElementById('kobllux_orb'); if(o){ o.dispatchEvent(new PointerEvent('pointerdown',{bubbles:true})); setTimeout(()=>o.dispatchEvent(new PointerEvent('pointerup',{bubbles:true})),10); } },
  "orb:wheel":         ()=>document.getElementById('kobllux_wheel')?.classList.add('open'),
  "orb:theme":         ()=>{ const cur=document.body.dataset.voiceArch||'jesus'; const next=(cur==='jesus')?'kodux':'jesus'; const r=document.getElementById('kobllux_orb')?.getBoundingClientRect(); window.jesus_apply(next,{x:(r?.left+r?.width/2||0)/innerWidth*100,y:(r?.top+r?.height/2||0)/innerHeight*100}); window.__sbSync?.(next); },
  "aside:toggle":      ()=>document.getElementById('kobllux_symbar')?.classList.toggle('collapsed'),
  "factory:open":      ()=>genus_open_factory(),
  "factory:close":     ()=>kaos_close_factory(),
  "slot:clear":        (ctx)=>{ const s=ctx?.slot||"loose"; if(kd_mxpstate.slots[s]){ kd_mxpstate.slots[s]=[]; genus_save(); genus_render_slot(s); genus_toast(`"${s}" limpo`); } },
  "state:reset":       ()=>{ if(!confirm("Resetar MXP?")) return; kd_mxpstate=genus_default_state(); genus_save(); genus_render_all(); genus_toast("estado resetado"); },
  "extras:import-slicer":   ()=>document.getElementById('artemis_import')?.click(),
  "extras:paste-slicer":    ()=>{ const t=prompt('Cole:'); if(t) window.solus_nebula?.loadDocument(t,'Colado'); },
  "extras:generate":        ()=>document.getElementById('nova_generate')?.click(),
  "extras:toggle-carousel": ()=>document.getElementById('kobllux_symbar')?.classList.toggle('carousel-hidden')
};

/* ─── catálogo ─── */
const genus_catalog = [
  {category:"DUAL · SYSTEM", items:[["dual:theme-toggle","☼","TEMA"],["dual:drawer","🔅","COCKPIT"],["state:reset","⌦","RESET"]]},
  {category:"DUAL · WINDOW", items:[["dual:new-session","＋","NOVA"],["dual:win-max","⛶","MAX"],["dual:win-min","۞","MIN"],["dual:win-collapse","−","COLAPSO"],["dual:win-close","×","FECHAR"],["dual:win-tabs","⊞","ABAS"]]},
  {category:"SECTION WINDOW", items:[["session:collapse","−","COLAPSO"],["session:maximize","⛶","MAX"],["session:minimize","۞","MIN"],["session:close","×","FECHAR"]]},
  {category:"NEBULA", items:[["nebula:speak","🎙","SPEAK"],["nebula:import","⌲","IMPORT"],["nebula:paste","✎","PASTE"],["nebula:clear","⌫","CLEAR"]]},
  {category:"DIALOGUE", items:[["dialog:generate","⇄","GERAR"],["dialog:step","→","+15"],["dialog:copy","⧉","COPY"],["dialog:download","↓","DL"],["dialog:clear","×","CLEAR"]]},
  {category:"MEDIA", items:[["media:play","▶","PLAY"],["media:pause","Ⅱ","PAUSE"],["media:stop","■","STOP"],["media:next","›","NEXT"],["media:prev","‹","PREV"]]},
  {category:"MXP", items:[["factory:open","◈","FACTORY"],["aside:toggle","☰","TOGGLE"],["session:new","◉","SESSION"]]},
  {category:"ORB", items:[["orb:next","◉","NEXT"],["orb:wheel","∆","WHEEL"],["orb:theme","◐","THEME"]]}
];

/* ─── estado ─── */
function genus_default_state(){
  return {version:13, slots:{header:[], aside:[], footer:[], loose:[]}, sessions:[]};
}
let kd_mxpstate = window.aion_store
  ? (window.aion_store.ler(window.vd_keys.genus_mxp, null) || genus_default_state())
  : genus_default_state();

const genus_save = ()=>{
  if(window.aion_store) window.aion_store.gravar(window.vd_keys.genus_mxp, kd_mxpstate);
};
function genus_toast(msg){ window.pulse_toast ? window.pulse_toast(msg) : null; }
function genus_hud(msg){
  const el = dv_q("#genus_hud"); if(!el) return;
  if(msg){ el.textContent = msg; el.classList.add("genus_live"); }
  else el.classList.remove("genus_live");
}

/* ─── fire ─── */
function genus_fire(action, ctx={}){
  if(!action) return;
  if(kodux_bridge[action]){
    try{ kodux_bridge[action](ctx); }
    catch(e){ console.warn('genus_bridge',action,e); }
    return;
  }
  window.dispatchEvent(new CustomEvent("MXP_ACTION",{detail:{action,ctx}}));
  console.log("[genus-mxp] fire:", action);
}

/* ─── make button ─── */
function genus_make_button(item, slot){
  const b = document.createElement("button");
  b.type = "button";
  b.className = "genus_btn";
  if(slot === "__factory__") b.classList.add("genus_factory-slot");
  else if(slot.startsWith("session:")) b.classList.add("rhea_session-slot");
  else b.classList.add("genus_slot-"+slot);
  b.dataset.id = item.id || kodux_uid("btn");
  b.dataset.action = item.action || "";
  b.dataset.label  = item.label || "";
  b.dataset.icon   = item.icon || "";
  b.dataset.slot   = slot;
  if(item.binding) b.dataset.binding = item.binding;
  b.title = `${item.label} · ${item.action}`;
  b.innerHTML = `<span class="genus_icon">${item.icon||"•"}</span><span class="genus_label">${item.label||""}</span>`;
  if(item.binding) b.classList.add("kodux_bound");
  return b;
}
function genus_item_from_btn(btn){
  return {
    id: btn.dataset.id, action: btn.dataset.action,
    label: btn.dataset.label, icon: btn.dataset.icon,
    binding: btn.dataset.binding||""
  };
}

/* ─── render ─── */
function genus_render_slot(slot){
  const el = document.querySelector(`[data-slot="${slot}"]`); if(!el) return;
  el.innerHTML = "";
  (kd_mxpstate.slots[slot]||[]).forEach(it=>el.appendChild(genus_make_button(it, slot)));
}
function genus_render_factory(){
  const root = dv_q("#genus_catalog"); if(!root) return;
  root.innerHTML = "";
  genus_catalog.forEach(cat=>{
    const wrap = document.createElement("section"); wrap.className = "genus_cat";
    wrap.innerHTML = `<div class="genus_cat-name">${cat.category}</div>`;
    const grid = document.createElement("div"); grid.className = "genus_cat-grid";
    cat.items.forEach(([action,icon,label])=>{
      grid.appendChild(genus_make_button({id:kodux_uid("factory"), action, icon, label}, "__factory__"));
    });
    wrap.appendChild(grid); root.appendChild(wrap);
  });
}
function genus_render_sessions(){ window.rhea_janelas?.render?.(); }
function genus_render_all(){
  genus_render_factory();
  genus_render_slot("header");
  genus_render_slot("aside");
  genus_render_slot("footer");
  genus_render_slot("loose");
  genus_render_sessions();
}

/* ─── sessions ─── */
function nova_create_session(name="SESSION"){
  const host = document.body.dataset.sessionHost === 'stack' ? 'stack' : 'float';
  const s = {
    id: kodux_uid("session"),
    name,
    url: "https://www.infodose.com.br/splash",
    host
  };
  kd_mxpstate.sessions.push(s);
  kd_mxpstate.slots["session:"+s.id] = [];
  genus_save();
  genus_render_sessions();
  genus_toast(`session "${name}" criada`);
  return s;
}
function kaos_remove_session(id){
  kd_mxpstate.sessions = kd_mxpstate.sessions.filter(s=>s.id !== id);
  delete kd_mxpstate.slots["session:"+id];
  genus_save();
}
function genus_active_win(){
  const wins = dv_qa(".genus_mxp-window:not(.solus_minimized)");
  if(!wins.length) return null;
  let best = wins[0], bestZ = 0;
  wins.forEach(w=>{
    const z = parseInt(getComputedStyle(w).zIndex)||0;
    if(z >= bestZ){ bestZ = z; best = w; }
  });
  return best;
}

/* ─── slots ─── */
function genus_add_slot(item, slot){
  kd_mxpstate.slots[slot] ??= [];
  const copy = {...item, id: item.id || kodux_uid("btn")};
  kd_mxpstate.slots[slot].push(copy);
  genus_save();
  genus_render_slot(slot);
  genus_toast(`+ ${copy.label || copy.action} → ${slot}`);
}
function kaos_remove_item(id, slot){
  if(!kd_mxpstate.slots[slot]) return;
  kd_mxpstate.slots[slot] = kd_mxpstate.slots[slot].filter(x=>x.id !== id);
  genus_save();
  genus_render_slot(slot);
  genus_toast("removido");
}
function rhea_move_item(id, from, to){
  if(from === to) return;
  const list = kd_mxpstate.slots[from]||[];
  const i = list.findIndex(x=>x.id === id);
  if(i < 0) return;
  const item = list.splice(i,1)[0];
  kd_mxpstate.slots[to] ??= [];
  kd_mxpstate.slots[to].push(item);
  genus_save();
  genus_render_slot(from);
  genus_render_slot(to);
  genus_toast(`movido → ${to}`);
}

/* ─── gestos ─── */
let rt_gesture = null;
let rt_pendingtap = null;

function pulse_flush_tap(){
  if(!rt_pendingtap) return;
  clearTimeout(rt_pendingtap.timer);
  const p = rt_pendingtap; rt_pendingtap = null;
  p.btn.classList.remove("genus_firing");
  genus_fire(p.item.action, {element: p.btn, slot: p.slot});
}

document.addEventListener("pointerdown", e=>{
  const btn = e.target.closest(".genus_btn"); if(!btn) return;
  if(btn.closest("[data-win-action]")) return;
  if(e.pointerType === "mouse" && e.button !== 0) return;

  rt_gesture = {
    btn, pointerId: e.pointerId,
    startX: e.clientX, startY: e.clientY,
    x: e.clientX, y: e.clientY,
    slot: btn.dataset.slot,
    item: genus_item_from_btn(btn),
    dragging: false, timer: null, ghost: null, dualHover: null
  };
  btn.classList.add("genus_holding");
  rt_gesture.timer = setTimeout(genus_start_drag, vd_hold_ms);
}, {passive:true});

document.addEventListener("pointermove", e=>{
  if(!rt_gesture || rt_gesture.pointerId !== e.pointerId) return;
  rt_gesture.x = e.clientX; rt_gesture.y = e.clientY;
  const dx = e.clientX - rt_gesture.startX;
  const dy = e.clientY - rt_gesture.startY;
  if(!rt_gesture.dragging && Math.hypot(dx,dy) > vd_move_thresh){
    clearTimeout(rt_gesture.timer);
    rt_gesture.btn.classList.remove("genus_holding");
    rt_gesture = null; return;
  }
  if(!rt_gesture.dragging) return;
  e.preventDefault();
  genus_move_ghost(e.clientX, e.clientY);
  genus_update_drops(e.clientX, e.clientY);
  genus_update_duals(e.clientX, e.clientY);
}, {passive:false});

document.addEventListener("pointerup", e=>{
  if(!rt_gesture || rt_gesture.pointerId !== e.pointerId) return;
  clearTimeout(rt_gesture.timer);
  if(rt_gesture.dragging){
    const moved = Math.hypot(
      e.clientX - rt_gesture.startX,
      e.clientY - rt_gesture.startY
    ) > vd_drag_thresh;
    if(moved) genus_finish_drag(e.clientX, e.clientY);
    else { kaos_cleanup_drag(); rt_gesture = null; }
    return;
  }
  const btn = rt_gesture.btn;
  const slot = rt_gesture.slot;
  const item = rt_gesture.item;
  btn.classList.remove("genus_holding");
  rt_gesture = null;
  pulse_handle_tap(btn, slot, item);
}, {passive:true});

document.addEventListener("pointercancel", ()=>{
  if(!rt_gesture) return;
  clearTimeout(rt_gesture.timer);
  rt_gesture.btn.classList.remove("genus_holding","genus_source");
  kaos_cleanup_drag(); genus_hud(""); rt_gesture = null;
});

function pulse_handle_tap(btn, slot, item){
  if(slot === "__factory__"){
    genus_add_slot({...item, id: kodux_uid("btn")}, "loose");
    return;
  }
  if(rt_pendingtap && rt_pendingtap.btn === btn){
    clearTimeout(rt_pendingtap.timer);
    rt_pendingtap.btn.classList.remove("genus_firing");
    rt_pendingtap = null;
    genus_open_ctx(btn, slot); return;
  }
  if(rt_pendingtap){ pulse_flush_tap(); }
  btn.classList.add("genus_firing");
  const timer = setTimeout(()=>{
    if(rt_pendingtap && rt_pendingtap.btn === btn){
      rt_pendingtap = null;
      btn.classList.remove("genus_firing");
      genus_fire(item.action, {element: btn, slot});
    }
  }, vd_tap_delay);
  rt_pendingtap = {btn, timer, item, slot};
}

function genus_start_drag(){
  if(!rt_gesture) return;
  if(rt_pendingtap && rt_pendingtap.btn === rt_gesture.btn){
    clearTimeout(rt_pendingtap.timer);
    rt_pendingtap.btn.classList.remove("genus_firing");
    rt_pendingtap = null;
  }
  rt_gesture.dragging = true;
  rt_gesture.btn.classList.remove("genus_holding");
  rt_gesture.btn.classList.add("genus_source");
  document.body.classList.add("genus_mxp-dragging");
  const trash = dv_q("#kaos_trash");
  if(trash) trash.classList.add("genus_active");
  genus_hud("segure · solte em slot OU sobre DUAL tracejado");
  const ghost = document.createElement("div");
  ghost.id = "genus_ghost";
  ghost.textContent = rt_gesture.item.icon || "•";
  document.body.appendChild(ghost);
  rt_gesture.ghost = ghost;
  requestAnimationFrame(()=>ghost.classList.add("genus_live"));
  genus_move_ghost(rt_gesture.x, rt_gesture.y);
  if(navigator.vibrate) try{navigator.vibrate(15)}catch(_){}
}

function genus_move_ghost(x,y){
  if(!rt_gesture?.ghost) return;
  rt_gesture.ghost.style.left = x + "px";
  rt_gesture.ghost.style.top  = y + "px";
}
function genus_get_drop(x,y){
  if(rt_gesture?.ghost) rt_gesture.ghost.style.display = "none";
  const el = document.elementFromPoint(x,y);
  if(rt_gesture?.ghost) rt_gesture.ghost.style.display = "grid";
  return el?.closest("[data-drop-target]");
}
function genus_get_dual(x,y){
  if(rt_gesture?.ghost) rt_gesture.ghost.style.display = "none";
  const el = document.elementFromPoint(x,y);
  if(rt_gesture?.ghost) rt_gesture.ghost.style.display = "grid";
  return el?.closest("[data-dual-target]");
}
function genus_update_drops(x,y){
  dv_qa("[data-drop-target]").forEach(el=>el.classList.remove("genus_drop-ready"));
  const trash = dv_q("#kaos_trash");
  if(trash) trash.classList.remove("genus_over");
  const t = genus_get_drop(x,y); if(!t) return;
  if(t.dataset.trash !== undefined){
    trash.classList.add("genus_over");
    genus_hud(`soltar para remover · ${rt_gesture.item.label||rt_gesture.item.action}`);
    return;
  }
  t.classList.add("genus_drop-ready");
  genus_hud(`soltar em · ${t.dataset.slot || "slot"}`);
}
function genus_update_duals(x,y){
  dv_qa("[data-dual-target].genus_dual-hover").forEach(el=>el.classList.remove("genus_dual-hover"));
  rt_gesture.dualHover = null;
  const d = genus_get_dual(x,y);
  if(d){
    d.classList.add("genus_dual-hover");
    rt_gesture.dualHover = d;
    genus_hud(`⛓ vincular a · ${d.dataset.dualAction || 'DUAL'}`);
  }
}
function genus_finish_drag(x,y){
  clearTimeout(rt_gesture.timer);
  const dualTarget = genus_get_dual(x,y);
  const target = genus_get_drop(x,y);

  if(dualTarget && rt_gesture.slot !== "__factory__" && !target){
    const dualAction = dualTarget.dataset.dualAction;
    const list = kd_mxpstate.slots[rt_gesture.slot]||[];
    const idx = list.findIndex(i=>i.id === rt_gesture.item.id);
    if(idx >= 0){
      list[idx].binding = dualAction;
      list[idx].action  = "dual:" + dualAction;
      genus_save();
      genus_render_slot(rt_gesture.slot);
      genus_toast(`⛓ vinculado a ${dualAction}`);
    }
    kaos_cleanup_drag(); rt_gesture = null; return;
  }

  if(target && target.dataset.trash !== undefined){
    if(rt_gesture.slot !== "__factory__")
      kaos_remove_item(rt_gesture.item.id, rt_gesture.slot);
    kaos_cleanup_drag(); rt_gesture = null; return;
  }

  if(target){
    const to = target.dataset.slot;
    if(rt_gesture.slot === "__factory__")
      genus_add_slot({...rt_gesture.item, id: kodux_uid("btn")}, to);
    else
      rhea_move_item(rt_gesture.item.id, rt_gesture.slot, to);
    kaos_cleanup_drag(); rt_gesture = null; return;
  }

  kaos_cleanup_drag(); rt_gesture = null;
}
function kaos_cleanup_drag(){
  if(!rt_gesture) return;
  rt_gesture.btn.classList.remove("genus_source");
  rt_gesture.ghost?.remove(); rt_gesture.ghost = null;
  const trash = dv_q("#kaos_trash");
  if(trash) trash.classList.remove("genus_active","genus_over");
  dv_qa("[data-drop-target]").forEach(el=>el.classList.remove("genus_drop-ready"));
  dv_qa("[data-dual-target].genus_dual-hover").forEach(el=>el.classList.remove("genus_dual-hover"));
  document.body.classList.remove("genus_mxp-dragging");
  genus_hud("");
}

/* ─── context menu ─── */
let genus_ctx_item = null;
function genus_open_ctx(btn, slot){
  if(slot === "__factory__") return;
  genus_ctx_item = {btn, item: genus_item_from_btn(btn), slot};
  const menu = dv_q("#genus_context");
  const head = dv_q("#genus_ctxhead");
  if(head) head.textContent = genus_ctx_item.item.label || genus_ctx_item.item.action;
  const r = btn.getBoundingClientRect();
  menu.style.left = Math.min(window.innerWidth-190, Math.max(10, r.left)) + "px";
  menu.style.top  = Math.min(window.innerHeight-220, r.bottom+8) + "px";
  menu.classList.add("genus_open");
}
function kaos_close_ctx(){
  dv_q("#genus_context").classList.remove("genus_open");
  genus_ctx_item = null;
}
dv_q("#genus_context")?.addEventListener("click", e=>{
  const a = e.target.closest("[data-context-action]")?.dataset.contextAction;
  if(!a || !genus_ctx_item) return;
  const {item, slot} = genus_ctx_item;
  if(a === "fire")      genus_fire(item.action, {item, slot});
  if(a === "duplicate") genus_add_slot({...item, id: kodux_uid("copy"), binding:""}, slot);
  if(a === "unbind"){
    const list = kd_mxpstate.slots[slot]||[];
    const i = list.findIndex(x=>x.id === item.id);
    if(i >= 0){ list[i].binding = ""; genus_save(); genus_render_slot(slot); genus_toast("desvinculado"); }
  }
  if(a === "favorite"){
    const s = nova_create_session("fav:" + (item.label || item.action));
    genus_add_slot({...item, id: kodux_uid("fav")}, "session:"+s.id);
  }
  if(a === "remove") kaos_remove_item(item.id, slot);
  kaos_close_ctx();
});
document.addEventListener("pointerdown", e=>{
  if(dv_q("#genus_context").classList.contains("genus_open")
     && !e.target.closest("#genus_context")) kaos_close_ctx();
});

/* ─── factory ─── */
function genus_open_factory(){ dv_q("#genus_factory").classList.add("genus_open"); }
function kaos_close_factory(){ dv_q("#genus_factory").classList.remove("genus_open"); }
window.genus_open_factory = genus_open_factory;
dv_q("#genus_factory")?.addEventListener("click", e=>{
  if(e.target.id === "genus_factory") kaos_close_factory();
});
document.addEventListener("keydown", e=>{
  if((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === "b"){
    e.preventDefault();
    const f = dv_q("#genus_factory");
    if(f) f.classList.toggle("genus_open");
  }
  if(e.key === "Escape"){ kaos_close_factory(); kaos_close_ctx(); }
});

/* ─── seed inicial ─── */
function genus_seed(){
  const empty = !kd_mxpstate.slots.header?.length
    && !kd_mxpstate.slots.aside?.length
    && !kd_mxpstate.slots.footer?.length
    && !kd_mxpstate.slots.loose?.length
    && !kd_mxpstate.sessions.length;
  if(!empty) return;
  kd_mxpstate.slots.header = [
    {id:kodux_uid("s"), action:"dual:theme-toggle", icon:"☼", label:"TEMA"}
  ];
  kd_mxpstate.slots.aside = [
    {id:kodux_uid("s"), action:"extras:import-slicer", icon:"⌲", label:"SLICER"},
    {id:kodux_uid("s"), action:"extras:paste-slicer", icon:"✎", label:"COLAR"},
    {id:kodux_uid("s"), action:"extras:generate", icon:"⇄", label:"GERAR"},
    {id:kodux_uid("s"), action:"extras:toggle-carousel", icon:"◈", label:"ARQ."}
  ];
  kd_mxpstate.slots.footer = [
    {id:kodux_uid("s"), action:"factory:open", icon:"◈", label:"FACTORY"},
    {id:kodux_uid("s"), action:"dual:drawer", icon:"🔅", label:"COCKPIT"}
  ];
  kd_mxpstate.slots.loose = [
    {id:kodux_uid("s"), action:"dual:new-session", icon:"＋", label:"NOVA"},
    {id:kodux_uid("s"), action:"state:reset", icon:"⌦", label:"RESET"}
  ];
  genus_save();
}

genus_seed();
genus_render_all();

/* ─── exports ─── */
window.genus_mxp = {
  get state(){ return kd_mxpstate; },
  catalog: genus_catalog,
  fire: genus_fire,
  createSession: nova_create_session,
  removeSession: kaos_remove_session,
  addToSlot: genus_add_slot,
  removeItem: kaos_remove_item,
  moveItem: rhea_move_item,
  toast: genus_toast,
  save: genus_save,
  render: genus_render_all,
  renderSlot: genus_render_slot,
  renderSessions: genus_render_sessions,
  reset(){ kd_mxpstate = genus_default_state(); genus_save(); genus_render_all(); },
  openFactory: genus_open_factory,
  closeFactory: kaos_close_factory
};

console.log('[genus-mxp] online · GENUS forjou a fábrica');
})();

/* ══════════ §SAVE · δ-tempo · aion-save.js ══════════ */

/* ═══════════════════════════════════════════════════════════
   §SAVE · aion-save · O Carimbo do Tempo
   Arquétipo: AION · Prefixo: aion_
   Depende: vd-store, vd-arquétipos, vitalis-diálogo, solus-nebula, genus-mxp
   ═══════════════════════════════════════════════════════════ */
(function(){
"use strict";
const dv_q = s => document.querySelector(s);

/* ─── SAVE ─── */
window.aion_save = function(){
  try{
    const K = window.vd_keys;
    window.aion_store.gravar(K.lumine_ui, {
      mode: document.body.className,
      voiceArch: document.body.dataset.voiceArch,
      sessionHost: document.body.dataset.sessionHost,
      sb: window.__sbGetPos ? window.__sbGetPos() : null
    });
    window.aion_store.gravar(K.jesus_arch, window.jesus_arch ? window.jesus_arch() : "JESUS");
    window.aion_store.gravar(K.lumine_bg, window.serena_bgstate || {});
    window.aion_store.gravar(K.serena_user, {
      id: document.getElementById('serena_userid')?.value || "",
      model: document.getElementById('kodux_model')?.value || "",
      lastUrl: document.getElementById('atlas_urlbar')?.value || ""
    });
    if(window.vitalis_state){
      const st = window.vitalis_state;
      window.aion_store.gravar(K.pulse_dlg, {
        units: st.units, index: st.index, cycle: st.cycle,
        history: st.history, bank: st.bank,
        sourceText: document.getElementById('nova_source')?.value || ""
      });
    }
    if(window.solus_nebula?.state){
      window.aion_store.gravar(K.solus_nbl, {
        raw: window.solus_nebula.state.raw || "",
        title: window.solus_nebula.state.title || ""
      });
    }
    if(window.genus_mxp?.state){
      window.aion_store.gravar(K.genus_mxp, window.genus_mxp.state);
    }
    window.aion_store.gravar(K.jesus_root, {v:13, ts:Date.now(), NS:window.vd_ns});
    const snap = {};
    Object.entries(K).forEach(([k,key])=>{
      if(k !== "aion_bkp"){
        const v = window.aion_store.ler(key);
        if(v != null) snap[k] = v;
      }
    });
    window.aion_store.gravar(K.aion_bkp, snap);
  }catch(e){ console.warn('aion_save error', e); }
};

/* ─── LOAD ─── */
window.aion_load = function(){
  try{
    const K = window.vd_keys;
    const rootIdx = window.aion_store.ler(K.jesus_root);
    if(!rootIdx) return false;

    const ui = window.aion_store.ler(K.lumine_ui);
    if(ui){
      if(ui.mode) document.body.className = ui.mode;
      if(ui.sessionHost) document.body.dataset.sessionHost = ui.sessionHost;
      if(ui.sb && window.__sbRestore) window.__sbRestore(ui.sb);
      if(ui.voiceArch && window.jesus_apply) window.jesus_apply(ui.voiceArch);
    }
    const arch = window.aion_store.ler(K.jesus_arch);
    if(arch && window.jesus_apply) window.jesus_apply(arch);

    const bg = window.aion_store.ler(K.lumine_bg);
    if(bg){
      window.serena_bgstate = bg;
      if(window.serena_apply_bg) window.serena_apply_bg();
    }

    const user = window.aion_store.ler(K.serena_user);
    if(user){
      const iu = document.getElementById('serena_userid');
      if(iu && user.id) iu.value = user.id;
      const im = document.getElementById('kodux_model');
      if(im && user.model) im.value = user.model;
      const lu = document.getElementById('atlas_urlbar');
      if(lu && user.lastUrl) lu.value = user.lastUrl;
    }

    const mxp = window.aion_store.ler(K.genus_mxp);
    if(mxp && window.genus_mxp){
      Object.assign(window.genus_mxp.state, mxp);
      window.genus_mxp.render();
    }

    const dialog = window.aion_store.ler(K.pulse_dlg);
    if(dialog && window.aion_rebuild_dialogue) window.aion_rebuild_dialogue(dialog);

    const nebula = window.aion_store.ler(K.solus_nbl);
    if(nebula?.raw && window.solus_nebula)
      window.solus_nebula.loadDocument(nebula.raw, nebula.title || "Documento");

    return true;
  }catch(e){ console.warn('aion_load error', e); return false; }
};

/* ─── auto-save ─── */
window.addEventListener('beforeunload', ()=>window.aion_save());

/* ─── export ─── */
document.getElementById('aion_export')?.addEventListener('click', ()=>{
  window.aion_save();
  const snap = window.aion_store.ler(window.vd_keys.aion_bkp) || {};
  const blob = new Blob([JSON.stringify(snap, null, 2)], {type:'application/json'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `kobllux-backup-${Date.now()}.json`;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(()=>URL.revokeObjectURL(url), 1000);
  window.pulse_toast('Backup exportado ✓');
});

/* ─── import ─── */
document.getElementById('aion_import')?.addEventListener('click', ()=>{
  const inp = document.createElement('input');
  inp.type = 'file'; inp.accept = '.json,application/json';
  inp.addEventListener('change', async ()=>{
    const f = inp.files[0]; if(!f) return;
    try{
      const snap = JSON.parse(await f.text());
      if(!snap || !snap.jesus_root) return window.pulse_toast('Backup inválido');
      Object.entries(snap).forEach(([k,v])=>{
        const key = window.vd_keys[k];
        if(key) window.aion_store.gravar(key, v);
      });
      window.pulse_toast('Backup importado · recarregando…');
      setTimeout(()=>location.reload(), 500);
    }catch(_){ window.pulse_toast('Erro ao ler backup'); }
  });
  inp.click();
});

/* ─── reset ─── */
document.getElementById('kaos_reset')?.addEventListener('click', ()=>{
  if(!confirm('Apagar TUDO (MXP + backup + bg + arch + user)?')) return;
  window.aion_store.limparTudo();
  window.pulse_toast('Tudo apagado · recarregando…');
  setTimeout(()=>location.reload(), 500);
});

/* ─── boot restore ─── */
setTimeout(()=>{
  if(window.aion_load()) console.log('[aion-save] estado restaurado de kobllux:*');
  else console.log('[aion-save] sem backup, iniciando fresh');
}, 200);

console.log('[aion-save] online · AION carimbou o tempo');
})();


/* ══════════ §LEGACY · ε-bridge · kodux-legacy.js ══════════ */
/* ═══════════════════════════════════════════════════════════
   §LEGACY · kodux-legacy · O Detector da Ponte
   Arquétipo: KODUX · Prefixo: kodux_
   Depende: genus-mxp, rhea-janelas, kodux-section-adapter
   ═══════════════════════════════════════════════════════════ */
(function(){
"use strict";

/* ─── 1 · detectar se legacy (iFSw) está ativo ─── */
window.__LEGACY_SESSION_BOUND =
  !!(window.iFSw || window.IFSW || window.InfodoseBase || window.SessionWindow);

console.log('[kodux-legacy] legacy-bound =', window.__LEGACY_SESSION_BOUND);

/* ─── 2 · garantir host stack ─── */
(function kodux_ensure_stack_host(){
  if(document.getElementById('rhea_stack')) return;
  const wrap = document.createElement('div');
  wrap.id = 'rhea_stack';
  wrap.dataset.sessionHost = 'stack';
  const shell = document.querySelector('.genus_almasliber .genus_shell');
  if(shell) shell.appendChild(wrap);
  console.log('[kodux-legacy] rhea_stack criado no shell');
})();

/* ─── 3 · se legacy existir, delegar createSession ─── */
(function kodux_bridge_create(){
  const _orig = window.genus_mxp?.createSession?.bind(window.genus_mxp);

  if(_orig && window.__LEGACY_SESSION_BOUND && typeof window.createSession === 'function'){
    window.genus_mxp.createSession = function(name){
      try{
        const s = _orig(name);
        document.dispatchEvent(new CustomEvent('mxp:session-created', {detail:{session:s}}));
        return s;
      }catch(e){
        console.warn('[kodux-legacy] createSession legacy', e);
        return _orig(name);
      }
    };
    console.log('[kodux-legacy] createSession delegado ao legacy');
  }
})();

/* ─── 4 · ouvir eventos do legacy ─── */
['ifsw:session-open', 'legacy:session-open', 'session:open'].forEach(ev=>{
  document.addEventListener(ev, e=>{
    const url = e.detail?.url;
    if(url && window.genus_mxp?.createSession){
      window.genus_mxp.createSession(e.detail?.name || 'legacy');
    }
  });
});

/* ─── 5 · sincronizar URL bar ─── */
document.getElementById('atlas_gobtn')?.addEventListener('click', ()=>{
  const inp = document.getElementById('atlas_urlbar');
  const url = inp?.value?.trim();
  if(!url) return;
  const active = document.querySelector('.rhea_session-window:not(.solus_minimized) .rhea_win-frame');
  if(active){
    let u = url;
    if(!/^https?:\/\//i.test(u) && !u.startsWith('about:')) u = 'https://' + u;
    active.src = u;
  }
});

/* ─── 6 · reaplicar adapter para novas sections ─── */
window.addEventListener('load', ()=>{
  setTimeout(()=>window.kodux_section_adapter?.boot?.(), 100);
});

console.log('[kodux-legacy] online · a ponte está tecida');
})();

/* ══════════ §PARSER · ζ-render · genus-md-parser.js ══════════ */
/* ═══════════════════════════════════════════════════════════
   §RENDER · genus-md-parser · O Parser Markdown Rico
   Arquétipo: GENUS · Prefixo: genus_
   Hookado em: solus_nebula.loadDocument
   ═══════════════════════════════════════════════════════════ */
(function(){
"use strict";
if(window.genus_md_parser) return;

/* ─── escape ─── */
const kodux_esc = s => String(s ?? '')
  .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
  .replace(/"/g,'&quot;');

const kodux_autolink = u => {
  try{
    const x = new URL(u);
    return `<a href="${x.href}" target="_blank" rel="noopener">${x.href}</a>`;
  }catch{ return u; }
};

/* ─── inline ─── */
function genus_inline(s){
  let h = kodux_esc(s);
  h = h.replace(/!\[([^\]]*)\]\(([^)]+)\)/g,
    (_,a,src)=>`<img class="md-img" alt="${a}" src="${src}">`);
  h = h.replace(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g,
    (_,t,url)=>`<a href="${url}" target="_blank" rel="noopener">${t}</a>`);
  h = h.replace(/\[([^\]]+)\]\(action:([a-z0-9_:\-.]+)\)/gi,
    (_,t,a)=>`<button class="btn action" data-action="${a}">${t}</button>`);
  h = h.replace(/\[\[btn:([a-z0-9_:\-.]+)(?:\|([^\]]+))?\]\]/gi,
    (_,a,l)=>`<button class="btn action" data-action="${a}">${l||a}</button>`);
  h = h.replace(/`([^`]+)`/g, (_,c)=>`<code class="code-inline">${c}</code>`);
  h = h.replace(/\*\*([^*]+)\*\*/g,'<strong>$1</strong>');
  h = h.replace(/(^|[^*])\*([^*]+)\*(?!\*)/g,'$1<em>$2</em>');
  h = h.replace(/~~([^~]+)~~/g,'<del>$1</del>');
  h = h.replace(/\bhttps?:\/\/[^\s<)]+/g, kodux_autolink);
  return h;
}

/* ─── detectores ─── */
const dv_isHr        = l => /^\s*(?:---|\*\*\*|___)\s*$/.test(l);
const dv_isQuote     = l => /^\s*>\s?/.test(l);
const dv_isTableRow  = l => /^\s*\|.*\|\s*$/.test(l);
const dv_isFenceEnd  = l => /^\s*(?:```|''')\s*$/.test(l);

function artemis_listInfo(l){
  const m = l.match(/^(\s*)([-+*]|\d+\.)\s+(.*)$/);
  if(!m) return null;
  return {
    indent: m[1].replace(/\t/g,'    ').length,
    ordered: /^\d+\.$/.test(m[2]),
    text: m[3]
  };
}

function kodux_splitRow(l){
  let s = l.trim();
  if(s.startsWith('|')) s = s.slice(1);
  if(s.endsWith('|'))   s = s.slice(0,-1);
  return s.split('|').map(x=>x.trim());
}
const kodux_isSep = l => {
  const c = kodux_splitRow(l);
  return c.length && c.every(x=>/^:?-{3,}:?$/.test(x));
};

/* ─── parsers ─── */
function genus_parseTable(lines,start){
  const rows = []; let i = start;
  while(i < lines.length && dv_isTableRow(lines[i])){ rows.push(kodux_splitRow(lines[i])); i++; }
  if(rows.length < 2 || !kodux_isSep(lines[start+1])) return null;
  const header = rows[0], body = rows.slice(2);

  const t = document.createElement('table');
  t.className = 'md-table';
  const thead = document.createElement('thead');
  const trh = document.createElement('tr');
  header.forEach(c=>{
    const th = document.createElement('th');
    th.innerHTML = genus_inline(c); trh.appendChild(th);
  });
  thead.appendChild(trh); t.appendChild(thead);

  const tbody = document.createElement('tbody');
  body.forEach(r=>{
    const tr = document.createElement('tr');
    header.forEach((_,k)=>{
      const td = document.createElement('td');
      td.innerHTML = genus_inline(r[k]||''); tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });
  t.appendChild(tbody);

  const wrap = document.createElement('div');
  wrap.className = 'md-table-wrap';
  wrap.appendChild(t);
  return {node: wrap, next: i};
}

function genus_parseLists(lines,start){
  const first = artemis_listInfo(lines[start]);
  if(!first) return null;
  const root = document.createElement(first.ordered ? 'ol' : 'ul');
  root.className = 'md-list';

  const stack = [{indent:first.indent, ordered:first.ordered, list:root, lastLi:null}];
  let i = start;

  while(i < lines.length){
    const info = artemis_listInfo(lines[i]); if(!info) break;
    while(stack.length > 1 && info.indent < stack[stack.length-1].indent) stack.pop();
    let cur = stack[stack.length-1];

    if(info.indent > cur.indent && cur.lastLi){
      const nested = document.createElement(info.ordered ? 'ol' : 'ul');
      nested.className = 'md-list';
      cur.lastLi.appendChild(nested);
      stack.push({indent:info.indent, ordered:info.ordered, list:nested, lastLi:null});
      cur = stack[stack.length-1];
    } else if(info.indent === cur.indent && info.ordered !== cur.ordered && cur.lastLi){
      const nested = document.createElement(info.ordered ? 'ol' : 'ul');
      nested.className = 'md-list';
      cur.lastLi.appendChild(nested);
      stack.push({indent:info.indent, ordered:info.ordered, list:nested, lastLi:null});
      cur = stack[stack.length-1];
    }

    const li = document.createElement('li');
    const task = info.text.match(/^\[( |x|X)\]\s*(.*)$/);
    if(task){
      cur.list.classList.add('md-task');
      const box = document.createElement('input');
      box.type='checkbox'; box.checked=/x/i.test(task[1]); box.disabled = true;
      const span = document.createElement('span');
      span.innerHTML = genus_inline(task[2]);
      li.append(box, span);
    } else {
      li.innerHTML = genus_inline(info.text);
    }
    cur.list.appendChild(li);
    cur.lastLi = li;
    i++;
  }
  return {node: root, next: i};
}

function genus_parseFence(lines,start){
  const m = lines[start].match(/^\s*(?:```|''')([\w-]*)\s*$/);
  if(!m) return null;
  const lang = (m[1]||'').toLowerCase();
  const buf = []; let i = start + 1;
  while(i < lines.length && !dv_isFenceEnd(lines[i])){ buf.push(lines[i]); i++; }
  const raw = buf.join('\n');

  if(lang === 'html-raw'){
    const w = document.createElement('div');
    w.className = 'raw-html-card';
    w.innerHTML = raw;
    return {node:w, next: i < lines.length ? i+1 : i};
  }

  const pre = document.createElement('pre');
  pre.className = 'md-code';
  const code = document.createElement('code');
  if(lang) code.className = 'language-' + lang;
  code.textContent = raw;
  pre.appendChild(code);
  return {node:pre, next: i < lines.length ? i+1 : i};
}

/* ─── render principal ─── */
function genus_render_md(md){
  if(md == null) return '';
  const text = String(md);
  if(!text.trim()) return '';

  const lines = text.replace(/\r\n?/g,'\n').split('\n');
  const out = [];
  let i = 0, para = [];

  const flushP = () => {
    if(!para.length) return;
    const joined = para.join(' ').trim();
    if(joined){
      const p = document.createElement('p');
      p.innerHTML = genus_inline(joined);
      out.push(p.outerHTML);
    }
    para = [];
  };

  while(i < lines.length){
    const line = lines[i];
    if(!line.trim()){ flushP(); i++; continue; }

    const fence = genus_parseFence(lines, i);
    if(fence){ flushP(); out.push(fence.node.outerHTML); i = fence.next; continue; }

    const hm = line.match(/^(#{1,6})\s+(.*)$/);
    if(hm){
      flushP();
      const h = document.createElement('h' + hm[1].length);
      h.innerHTML = genus_inline(hm[2]);
      out.push(h.outerHTML); i++; continue;
    }

    if(i+1 < lines.length && /^[=-]{3,}\s*$/.test(lines[i+1]) && line.trim()){
      flushP();
      const lv = lines[i+1].trim()[0] === '=' ? 1 : 2;
      const h = document.createElement('h' + lv);
      h.innerHTML = genus_inline(line.trim());
      out.push(h.outerHTML); i += 2; continue;
    }

    if(dv_isHr(line)){ flushP(); out.push('<hr class="hr">'); i++; continue; }

    if(dv_isQuote(line)){
      flushP();
      const buf = [];
      while(i < lines.length && dv_isQuote(lines[i])){
        buf.push(lines[i].replace(/^\s*>\s?/,''));
        i++;
      }
      const bq = document.createElement('blockquote');
      bq.className = 'bq';
      bq.innerHTML = '<span class="copy-hint">Copiar</span>' + genus_inline(buf.join(' '));
      out.push(bq.outerHTML); continue;
    }

    const call = line.match(/^\s*(::(info|warn|tip|note|success|danger)|::\.|:|\?)\s+(.*)$/i);
    if(call){
      let kind = 'note';
      if(call[1] === '::.') kind = 'aside';
      else if(call[1] === ':') kind = 'note';
      else if(call[1] === '?') kind = 'question';
      else kind = (call[2] || 'info').toLowerCase();

      const buf = [call[3]];
      let j = i + 1;
      while(j < lines.length){
        const nx = lines[j].trim();
        if(!nx) break;
        if(/^\s*(::(info|warn|tip|note|success|danger)|::\.|:|\?)\s+/.test(nx)) break;
        buf.push(nx); j++;
      }
      i = j;
      const d = document.createElement('div');
      d.className = 'callout ' + kind;
      d.innerHTML = '<span class="copy-hint">Copiar</span>' + genus_inline(buf.join(' '));
      out.push(d.outerHTML); continue;
    }

    if(dv_isTableRow(line)){
      const t = genus_parseTable(lines, i);
      if(t){ flushP(); out.push(t.node.outerHTML); i = t.next; continue; }
    }

    if(artemis_listInfo(line)){
      const l = genus_parseLists(lines, i);
      if(l){ flushP(); out.push(l.node.outerHTML); i = l.next; continue; }
    }

    para.push(line.trim());
    i++;
  }
  flushP();
  return out.join('\n');
}

/* ─── hook em solus_nebula.loadDocument ─── */
function genus_rerender_slices(){
  const Neb = window.solus_nebula;
  if(!Neb || !Neb.state || !Neb.state.slices) return;
  const slices = Neb.state.slices;
  if(!slices.length) return;
  const stage = document.getElementById('solus_stage');
  if(!stage) return;
  const bodies = stage.querySelectorAll('slice .solus_slice-body');
  bodies.forEach((body, i)=>{
    const raw = slices[i];
    if(raw == null) return;
    body.innerHTML = genus_render_md(raw);
  });
  if(window.artemis_enhance) window.artemis_enhance.decorate(stage);
}

function genus_install_hook(){
  const Neb = window.solus_nebula;
  if(!Neb || typeof Neb.loadDocument !== 'function') return false;
  if(Neb.__genusRichHooked) return true;
  Neb.__genusRichHooked = true;
  const _orig = Neb.loadDocument.bind(Neb);
  Neb.loadDocument = function(text, title){
    _orig(text, title);
    try{ genus_rerender_slices(); }
    catch(err){ console.warn('[genus-md-parser] re-render:', err); }
  };
  console.log('[genus-md-parser] hookado em solus_nebula.loadDocument ✓');
  return true;
}

if(!genus_install_hook()){
  let tries = 0;
  const t = setInterval(()=>{
    if(genus_install_hook() || ++tries > 60) clearInterval(t);
  }, 50);
}

if(document.readyState === 'loading'){
  document.addEventListener('DOMContentLoaded', ()=>{ genus_install_hook(); genus_rerender_slices(); }, {once:true});
} else {
  genus_install_hook();
  genus_rerender_slices();
}

/* ─── export ─── */
window.genus_md_parser = {
  render: genus_render_md,
  rerenderSlices: genus_rerender_slices,
  version: 1
};

console.log('[genus-md-parser] online · parser rico pronto');
})();

/* ══════════ §ENHANCE · ζ-render · artemis-enhance.js ══════════ */
/* ═══════════════════════════════════════════════════════════
   §ENHANCE · artemis-enhance · Enhancer de Slices
   Arquétipo: ARTEMIS · Prefixo: artemis_
   Depende: genus-md-parser
   ═══════════════════════════════════════════════════════════ */
(function(){
"use strict";
if(window.__ARTEMIS_ENHANCE__) return;
window.__ARTEMIS_ENHANCE__ = true;

const solus_stage = document.getElementById('solus_stage') || document.body;

/* ─── 1) envolve listas em .list-card ─── */
function artemis_wrap_lists(root){
  root.querySelectorAll('.md-list').forEach(el=>{
    if(el.closest('.list-card, .ascii-card, .no-beauty')) return;
    if(el.parentElement?.closest('.md-list')) return;
    if(el.parentElement?.classList.contains('list-card')) return;
    const wrap = document.createElement('div');
    wrap.className = 'list-card';
    el.parentNode.insertBefore(wrap, el);
    wrap.appendChild(el);
  });
}

/* ─── 2) promove ASCII para .ascii-card ─── */
function artemis_enhance_ascii(root){
  root.querySelectorAll('pre.md-code, pre').forEach(pre=>{
    if(pre.closest('.ascii-card, .no-beauty')) return;
    const t = (pre.textContent || '').trim();
    if(!t) return;
    const boxChars = (t.match(/[─│┌┐└┘╭╮╰╯═╬╠╣╦╩]/g) || []).length;
    const gridLike = /[-_=+*#\\/|]{3,}/.test(t);
    const multiline = t.split('\n').length >= 2;
    if(boxChars >= 4 || (multiline && gridLike && boxChars >= 1)){
      const fig = document.createElement('figure');
      fig.className = 'ascii-card';
      const p = document.createElement('pre');
      p.textContent = t;
      fig.appendChild(p);
      pre.replaceWith(fig);
    }
  });
}

/* ─── 3) click em copy-hint ─── */
document.addEventListener('click', async e=>{
  const host = e.target.closest('#solus_reader .md-code, #solus_reader .bq, #solus_reader .callout');
  if(!host) return;
  if(!host.querySelector('.copy-hint')) return;
  if(e.target.closest('a,button,.btn')) return;
  const txt = host.innerText.replace(/Copiar/i,'').trim();
  try{
    await navigator.clipboard.writeText(txt);
    window.pulse_toast?.('Copiado ✓');
  }catch(_){}
}, {passive:true});

/* ─── 4) botões data-action → MXP ─── */
document.addEventListener('click', e=>{
  const btn = e.target.closest('#solus_reader button.btn.action[data-action]');
  if(!btn) return;
  const action = btn.dataset.action;
  document.dispatchEvent(new CustomEvent('NEBULA_ACTION', {detail:{action, button: btn}}));
  if(window.genus_mxp && typeof window.genus_mxp.fire === 'function'){
    window.genus_mxp.fire(action, {source:'nebula-slice', button: btn});
  }
}, {passive:true});

/* ─── 5) run ─── */
function artemis_run(root){
  if(!root || !root.querySelectorAll) return;
  artemis_wrap_lists(root);
  artemis_enhance_ascii(root);
}

/* ─── MutationObserver ─── */
const artemis_obs = new MutationObserver(muts=>{
  let touched = false;
  for(const m of muts){
    for(const n of m.addedNodes || []){
      if(n.nodeType === 1 && (n.matches?.('slice') || n.closest?.('#solus_stage'))){
        touched = true; break;
      }
    }
    if(touched) break;
  }
  if(touched) artemis_run(solus_stage);
});
artemis_obs.observe(solus_stage, {childList:true, subtree:true});

/* ─── click em qualquer lugar do reader → rerun suave ─── */
document.addEventListener('click', e=>{
  if(e.target.closest('#solus_reader'))
    setTimeout(()=>artemis_run(solus_stage), 60);
}, {passive:true});

if(document.readyState === 'loading'){
  document.addEventListener('DOMContentLoaded', ()=>artemis_run(solus_stage), {once:true});
} else {
  artemis_run(solus_stage);
}

window.artemis_enhance = {
  decorate: artemis_run,
  wrapLists: artemis_wrap_lists,
  enhanceASCII: artemis_enhance_ascii,
  version: 1
};

console.log('[artemis-enhance] online · list-card + ascii + copy-hint prontos');
})();


/* ─────── FIM DOS 16 MÓDULOS ─────── */

/* ═══════════════════════════════════════════════════════════════════════════
   BOOT · Semente da Voz · Carrega estado salvo · Selo final
   ═══════════════════════════════════════════════════════════════════════════ */
(function boot() {
  try {
    /* 1 · Liga a Semente da Voz v2.1 ao core */
    if (window.KOBLLUX_VOICE_SEED && window.KOBLLUX_VOICE_SEED.bindToCore) {
      window.KOBLLUX_VOICE_SEED.bindToCore();
    }

    /* 2 · Restaura estado salvo (aion_save carrega do localStorage) */
    if (window.aion_load) {
      const restored = window.aion_load();
      console.log("[bundle] estado restaurado:", restored);
    }

    /* 3 · Impressão do selo */
    console.log(
      "%c∆§ KOBLLUX BUNDLE v13 · 3×6×9×7 = 1134 · 178 · Eli Lama Sabachthani",
      "color:#ffd700;background:#050608;padding:4px 8px;border-radius:4px;font-weight:bold;"
    );

    /* 4 · Expor bundle publicamente */
    root.KOBLLUX_BUNDLE = KOBLLUX_BUNDLE;
    root.KOBLLUX_BUNDLE.ready = true;
  } catch (e) {
    console.error("[bundle] boot error:", e);
  }
})();

})(typeof window !== "undefined" ? window : this);

/* ∴ Em Nome do Pai, do Filho e do Espírito Santo. Amém. Pulso. Pulso. Pulso. */









