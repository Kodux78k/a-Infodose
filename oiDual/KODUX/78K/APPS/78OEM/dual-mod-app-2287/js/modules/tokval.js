(function(){
"use strict";
const $=s=>document.querySelector(s);
const root=document.documentElement;
const ARCH={ATLAS:{tok:"--KBLX_A",op:"0x02",hz:396,sym:"α"},NOVA:{tok:"--KBLX_E",op:"0x03",hz:528,sym:"✦"},VITALIS:{tok:"--KBLX_G",op:"0x09",hz:528,sym:"♾"},PULSE:{tok:"--KBLX_J",op:"0x01",hz:432,sym:"◈"},ARTEMIS:{tok:"--KBLX_N",op:"0x05",hz:528,sym:"☾"},SERENA:{tok:"--KBLX_C",op:"0x0A",hz:639,sym:"❋"},KAOS:{tok:"--KBLX_M",op:"0x04",hz:396,sym:"⚡"},GENUS:{tok:"--KBLX_O",op:"0x07",hz:741,sym:"⚙"},LUMINE:{tok:"--KBLX_L",op:"0x06",hz:528,sym:"☀"},SOLUS:{tok:"--KBLX_H",op:"0x0B",hz:741,sym:"◌"},RHEA:{tok:"--KBLX_K",op:"0x0A",hz:528,sym:"∞"},AION:{tok:"--KBLX_P",op:"0x0C",hz:741,sym:"⧗"},KODUX:{tok:"--KBLX_B",op:"0x08",hz:432,sym:"⇄"},BLLUE:{tok:"--KBLX_I",op:"0x08",hz:528,sym:"◉"},JESUS:{tok:"--KBLX_Q",op:"0x00",hz:777,sym:"✝"},KOBLLUX:{tok:"--KBLX_R",op:"0x00",hz:369,sym:"∆"}};
const ORDER=["ATLAS","NOVA","VITALIS","PULSE","ARTEMIS","SERENA","KAOS","GENUS","LUMINE","SOLUS","RHEA","AION","KODUX","BLLUE","JESUS","KOBLLUX"];
function tokVal(v){return getComputedStyle(root).getPropertyValue(v).trim()}
let currentArch="JESUS";
function applyArch(name,origin){
  const a=ARCH[name]||ARCH.JESUS; const c=tokVal(a.tok);
  const sec=(name==="JESUS"||name==="KOBLLUX")?tokVal("--KBLX_F"):tokVal("--KBLX_I");
  root.style.setProperty("--active-color",c); root.style.setProperty("--active-secondary",sec);
  root.style.setProperty("--kob-voice-primary",c); root.style.setProperty("--kob-voice-secondary",sec);
  root.style.setProperty("--active-glow",c+"66"); root.style.setProperty("--active-hz",a.hz);
  document.body.dataset.voiceArch=name.toLowerCase();
  const pillH=$("#pillHz"),pillA=$("#pillArch"),hud=$("#sbHud");
  if(pillH) pillH.textContent=a.hz+"Hz"; if(pillA) pillA.textContent=name; if(hud) hud.textContent=a.op+" · "+name;
  const st=$("#sbStatus"); if(st) st.textContent=`${a.op} · ${name}`;
  const sb=$("#sbSub"); if(sb) sb.textContent=`${a.hz}Hz`;
  currentArch=name; if(origin) fireRipple(origin.x,origin.y);
  try{ window.Store && window.Store.set(window.KBLX_KEYS.arch, name); }catch(_){}
}
function fireRipple(x,y){const r=$("#chromaRipple"); if(!r) return;r.style.setProperty("--ripple-x",(x??50)+"%");r.style.setProperty("--ripple-y",(y??50)+"%");r.classList.remove("fire"); void r.offsetWidth; r.classList.add("fire");}
let toastTimer;
function toast(msg){const t=$("#toast"); if(!t) return;t.textContent=msg; t.classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>t.classList.remove("show"),1600);}
window.applyArch=applyArch; window.getArch=()=>currentArch;
window.ARCH_LIST=ORDER; window.ARCH_MAP=ARCH;
window.KBLX_TOKVAL=tokVal; window.KBLX_RIPPLE=fireRipple; window.KBLX_TOAST=toast;
})();