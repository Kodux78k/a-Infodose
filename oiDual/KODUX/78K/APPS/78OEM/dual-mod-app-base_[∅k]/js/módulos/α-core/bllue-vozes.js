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
