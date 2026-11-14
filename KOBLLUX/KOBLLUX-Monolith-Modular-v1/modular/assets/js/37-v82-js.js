
(function KOBSuspend(){
"use strict";
/* [v82] só o que está visível fica ativo; workspace/minimizado/dock = suspenso (CSS pausado, canvas e cortex param) */
const SEL=".app > section, #sessionsLayer > *, .session-window";
let q=0;
function off(e){ const c=e.classList; return c.contains("ws-off")||c.contains("minimized")||c.contains("suspended")||["closed","docked","dock"].includes(e.dataset.state); }
function sweep(){ q=0; document.querySelectorAll(SEL).forEach(e=>{ const v=off(e)?"1":"0"; if(e.dataset.suspended!==v){ e.dataset.suspended=v; e.dispatchEvent(new CustomEvent(v==="1"?"kob:suspend":"kob:resume",{bubbles:true})); } });
  const c=document.getElementById("cortexSection"); if(c&&c.dataset.suspended==="0"){ try{window.KOBCortex&&KOBCortex.refresh()}catch(e){} } }
function sched(){ if(!q) q=requestAnimationFrame(sweep); }
const mo=new MutationObserver(sched);
function arm(){ [document.querySelector(".app"),document.getElementById("sessionsLayer")].forEach(n=>n&&mo.observe(n,{attributes:true,attributeFilter:["class","data-state"],subtree:true})); sched(); }
[100,600,1800].forEach(t=>setTimeout(arm,t)); document.addEventListener("visibilitychange",()=>{ document.documentElement.dataset.hidden=document.hidden?"1":"0"; });
window.KOBSuspend={sweep};
})();
