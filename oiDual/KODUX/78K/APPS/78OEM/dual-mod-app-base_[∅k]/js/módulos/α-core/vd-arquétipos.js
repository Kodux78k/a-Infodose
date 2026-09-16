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
