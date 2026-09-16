(function(){
"use strict";
const $=s=>document.querySelector(s);
const $$=s=>[...document.querySelectorAll(s)];
window.addEventListener("load",()=>{setTimeout(()=>document.getElementById("loader").classList.add("hide"),600)});
function updProgress(){const doc=document.documentElement;document.getElementById("progress").style.width=((window.scrollY/(doc.scrollHeight-window.innerHeight))*100)+"%";}
let ticking=false;
window.addEventListener("scroll",()=>{if(!ticking){requestAnimationFrame(()=>{updProgress();ticking=false});ticking=true}},{passive:true});
updProgress();
const io=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add("in");const idx=$$(".section").indexOf(e.target);if(idx>=0) $$(".nav-dot").forEach((d,i)=>d.classList.toggle("on",i===idx));}})},{threshold:0.15});
$$(".reveal").forEach(el=>io.observe(el));
const ORDER=window.ARCH_LIST||[];
const MAP=window.ARCH_MAP||{};
const bar=$("#symbolBar");
const carousel=$("#sbCarousel"), track=$("#sbTrack"), dots=$("#sbDots");
const orb=$("#sbOrb"), grip=$("#sbGrip");
let sbIdx=0;
function buildSb(){
  if(!track||!dots) return;
  track.innerHTML=""; dots.innerHTML="";
  ORDER.forEach((name,i)=>{
    const a=MAP[name]||{sym:"∆",op:"0x00",tok:"--KBLX_B",hz:432};
    const btn=document.createElement("button");
    btn.className="sb-btn"; btn.textContent=a.sym; btn.dataset.arch=name;
    btn.style.setProperty("--btn-c",`var(${a.tok})`);
    btn.title=`${name} · ${a.hz}Hz`;
    btn.addEventListener("click",()=>{sbIdx=i; centerSb(true); window.applyArch(name);const r=btn.getBoundingClientRect();window.KBLX_RIPPLE((r.left+r.width/2)/window.innerWidth*100,(r.top+r.height/2)/window.innerHeight*100);});
    track.appendChild(btn);
    const dot=document.createElement("span");
    dot.className="sb-dot"+(i===0?" on":"");
    dot.addEventListener("click",()=>{sbIdx=i;centerSb(true);window.applyArch(name);});
    dots.appendChild(dot);
  });
}
function centerSb(useScroll){if(!track||!carousel) return;const btn=track.children[sbIdx]; if(!btn) return;[...dots.children].forEach((d,i)=>d.classList.toggle("on",i===sbIdx));[...track.children].forEach((b,i)=>b.classList.toggle("on",i===sbIdx));if(useScroll){const targetTop = btn.offsetTop - (carousel.clientHeight - btn.offsetHeight)/2;carousel.scrollTo({top: Math.max(0,targetTop), behavior:'smooth'});}}
window.__sbSync=function(name){const i=ORDER.indexOf(name);if(i>=0){sbIdx=i;centerSb(true);}};
if(carousel){let scrollT=null;carousel.addEventListener('scroll',()=>{clearTimeout(scrollT);scrollT=setTimeout(()=>{const center = carousel.scrollTop + carousel.clientHeight/2;let best=0, bestDist=Infinity;[...track.children].forEach((b,i)=>{const bc = b.offsetTop + b.offsetHeight/2;const d = Math.abs(bc - center);if(d < bestDist){ bestDist = d; best = i; }});if(best!==sbIdx){sbIdx = best;[...dots.children].forEach((d,i)=>d.classList.toggle("on",i===sbIdx));[...track.children].forEach((b,i)=>b.classList.toggle("on",i===sbIdx));}},80);},{passive:true});}
$("#sbToggle").addEventListener("click",(e)=>{e.stopPropagation();const c=bar.classList.toggle("collapsed");$("#sbToggle").textContent=c?"▼":"▲";if(!c) setTimeout(()=>centerSb(false),150);});
let pressTimer=null,longFired=false,orbPatIdx=0;
const ORB_PATTERN=[5,3,6,9,7];
function orbCycle3697(){const list=window.ARCH_LIST||[]; if(!list.length) return;const step=ORB_PATTERN[orbPatIdx++%ORB_PATTERN.length];const cur=list.indexOf(window.getArch());const next=list[(cur+step)%list.length];const r=orb.getBoundingClientRect();window.applyArch(next,{x:(r.left+r.width/2)/window.innerWidth*100,y:(r.top+r.height/2)/window.innerHeight*100});window.__sbSync(next);window.KBLX_TOAST(`∆³ ${next} · +${step}`);}
orb.addEventListener("pointerdown",e=>{e.preventDefault();longFired=false;const r=orb.getBoundingClientRect();window.KBLX_RIPPLE((r.left+r.width/2)/window.innerWidth*100,(r.top+r.height/2)/window.innerHeight*100);pressTimer=setTimeout(()=>{longFired=true;openWheel();if(navigator.vibrate) try{navigator.vibrate(15)}catch(_){}},800);});
orb.addEventListener("pointerup",()=>{clearTimeout(pressTimer);if(!longFired) orbCycle3697();});
orb.addEventListener("pointerleave",()=>clearTimeout(pressTimer));
orb.addEventListener("pointercancel",()=>clearTimeout(pressTimer));
orb.addEventListener("contextmenu",e=>e.preventDefault());
let dragging=false,sx=0,sy=0,ox=0,oy=0;
function clamp(v,a,b){return Math.max(a,Math.min(b,v))}
function clearSnap(){bar.classList.remove("snap-left","snap-right","snap-top","snap-bottom")}
grip.addEventListener("pointerdown",e=>{e.preventDefault(); e.stopPropagation(); clearSnap();dragging=true; sx=e.clientX; sy=e.clientY;const r=bar.getBoundingClientRect(); ox=r.left; oy=r.top;bar.style.transform="none"; bar.style.top=oy+"px"; bar.style.left=ox+"px";bar.style.right="auto"; bar.style.bottom="auto";bar.classList.add("is-dragging");try{grip.setPointerCapture(e.pointerId)}catch(_){}});
grip.addEventListener("pointermove",e=>{if(!dragging) return;bar.style.left=(ox+e.clientX-sx)+"px";bar.style.top=(oy+e.clientY-sy)+"px";});
function endDrag(e){
  if(!dragging) return; dragging=false; bar.classList.remove("is-dragging");
  const vw=window.innerWidth, vh=window.innerHeight;
  const r=bar.getBoundingClientRect(); const cx=r.left+r.width/2;
  clearSnap();
  const headerH = 44 + 44 + 12;
  const nearTop = r.top < 100;
  const nearBottom = r.bottom > vh - 100;
  const nearLeft = cx < vw/2;
  if(nearTop){bar.classList.add("snap-top");bar.style.top=""; bar.style.bottom="auto"; bar.style.left=""; bar.style.right="8px"; bar.style.transform="";}
  else if(nearBottom){bar.classList.add("snap-bottom");bar.style.top="auto"; bar.style.bottom=""; bar.style.left=""; bar.style.right="8px"; bar.style.transform="";}
  else{const safeY = clamp(r.top, headerH, vh-r.height-80);bar.style.top = safeY+"px"; bar.style.bottom="auto"; bar.style.transform="";if(nearLeft){ bar.classList.add("snap-left"); bar.style.left="0"; bar.style.right="auto"; }else { bar.classList.add("snap-right"); bar.style.right="0"; bar.style.left="auto"; }}
  try{grip.releasePointerCapture(e.pointerId)}catch(_){}
  if(window.KBLX_SAVE) window.KBLX_SAVE();
}
grip.addEventListener("pointerup",endDrag);
grip.addEventListener("pointercancel",endDrag);
function unifiedPlay(){const nb = window.Nebula;if(nb && nb.hasSlices && nb.hasSlices()){ nb.toggleSpeech(); return; }window.KBLX_ACTIONS && window.KBLX_ACTIONS.speak();}
function unifiedStop(){const nb = window.Nebula;if(nb && nb.hasSlices && nb.hasSlices()){ nb.stopSpeech(); }window.KBLX_ACTIONS && window.KBLX_ACTIONS.stop();window.KBLX_TOAST("Parado");}
$("#sbSpeak").addEventListener("click",unifiedPlay);
$("#sbStop").addEventListener("click",unifiedStop);
$("#sbCopy").addEventListener("click",async()=>{const st=window.AlfaBetaState||{}; const hist=st.history||[];if(!hist.length){window.KBLX_TOAST("Sem conversa");return}const txt=hist.map(m=>`${m.role==="alpha"?"ALFA":"BETA"} [${m.arch}]: ${m.text}`).join("\n\n");try{await navigator.clipboard.writeText(txt);window.KBLX_TOAST("Copiado ✓")}catch(_){const ta=document.createElement("textarea");ta.value=txt;document.body.appendChild(ta);ta.select();try{document.execCommand("copy")}catch(e){}ta.remove();window.KBLX_TOAST("Copiado ✓");}});
$("#sbClear").addEventListener("click",()=>{if(window.KBLX_ACTIONS) window.KBLX_ACTIONS.stop();if(window.Nebula && window.Nebula.hasSlices && window.Nebula.hasSlices()) window.Nebula.clear();const st=window.AlfaBetaState;if(st){st.units=[];st.index=0;st.cycle=0;st.history=[];st.bank={prepositions:[],connectors:[],pronouns:[],articles:[],verbs:[],words:[],questions:[]}}const conv=document.getElementById("conversation"); if(conv) conv.innerHTML='<div class="empty">O diálogo ainda não nasceu.</div>';const lex=document.getElementById("lexicalBank"); if(lex) lex.innerHTML='<span style="color:var(--DIM);font-size:11px">EXTRAIR BANCO para começar.</span>';const bi=document.getElementById("bankInfo"); if(bi) bi.textContent="aguardando";const rl=document.getElementById("roundLabel"); if(rl) rl.textContent="0 ciclos";const src=document.getElementById("sourceText"); if(src) src.value="";const cnt=document.getElementById("counter"); if(cnt) cnt.textContent="0 caracteres";window.KBLX_TOAST("Sistema reiniciado ✓");if(window.KBLX_SAVE) window.KBLX_SAVE();});
$("#sbDownload").addEventListener("click",()=>{const st=window.AlfaBetaState||{}; const hist=st.history||[];if(!hist.length){window.KBLX_TOAST("Sem conversa");return}const txt=hist.map(m=>`${m.role==="alpha"?"ALFA":"BETA"} [${m.arch}]: ${m.text}`).join("\n\n");const payload=`KOBLLUX · ALFA⇄BETA · v13\n=========================\n\n${txt}\n\nGerado: ${new Date().toISOString()}`;const blob=new Blob([payload],{type:"text/plain;charset=utf-8"});const url=URL.createObjectURL(blob);const a=document.createElement("a"); a.href=url; a.download=`kobllux-${Date.now()}.txt`;document.body.appendChild(a); a.click(); a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);window.KBLX_TOAST("Download ✓");});
const wheel=$("#archWheel");
ORDER.forEach(name=>{const a=MAP[name]||{hz:432,sym:"∆",tok:"--KBLX_B"};const chip=document.createElement("button");chip.className="arch-pick"; chip.style.color=`var(${a.tok})`;chip.innerHTML=`<div class="a-orb" style="background:var(${a.tok})"></div><div class="a-name">${name}</div><div class="a-freq">${a.hz}Hz</div>`;chip.addEventListener("click",()=>{const r=chip.getBoundingClientRect();window.applyArch(name,{x:(r.left+r.width/2)/window.innerWidth*100,y:(r.top+r.height/2)/window.innerHeight*100});sbIdx=ORDER.indexOf(name); centerSb(true); closeWheel();});wheel.appendChild(chip);});
function openWheel(){$("#arch-overlay").classList.add("open")}
function closeWheel(){$("#arch-overlay").classList.remove("open")}
$("#arch-overlay").addEventListener("click",e=>{if(e.target.id==="arch-overlay") closeWheel()});
$("#blClose").addEventListener("click",()=>$("#baulite-container").classList.remove("open"));
document.addEventListener("keydown",e=>{if(e.key==="Escape") closeWheel();});
buildSb();
bar.classList.remove("collapsed");
$("#sbToggle").textContent="▲";
setTimeout(()=>centerSb(true),150);
const sbImportInput = document.getElementById('sbImportInput');
if(sbImportInput){sbImportInput.addEventListener('change', async (e)=>{const f = e.target.files[0]; if(!f) return;try{const txt = await f.text();window.Nebula && window.Nebula.loadDocument(txt, f.name);window.KBLX_TOAST(`Slicer: ${f.name} ✓`);document.getElementById('s0')?.scrollIntoView({behavior:'smooth'});}catch(err){window.KBLX_TOAST("Falha");}sbImportInput.value = "";});}
(function sbExtrasToggle(){const head = document.getElementById('sbExtrasHead');if(!head) return;try{if(localStorage.getItem('kobllux_sb_extras_hidden')==='1') bar.classList.add('extras-hidden');}catch(_){}let lp=null, fired=false;head.addEventListener('pointerdown', ()=>{fired=false;lp=setTimeout(()=>{fired=true;window.openFactory?.();if(navigator.vibrate) try{navigator.vibrate(15)}catch(_){}},550);});head.addEventListener('pointerup', ()=>clearTimeout(lp));head.addEventListener('pointerleave', ()=>clearTimeout(lp));head.addEventListener('click', (e)=>{if(fired){e.stopPropagation();fired=false;return;}const hidden = bar.classList.toggle('extras-hidden');try{ localStorage.setItem('kobllux_sb_extras_hidden', hidden ? '1' : '0'); }catch(_){}window.KBLX_TOAST(hidden ? 'Extras ocultos' : 'Extras visíveis');});})();
const MAIN_HDR = document.getElementById('main-header');
let lastY = 0, ticking2 = false;
window.addEventListener('scroll', ()=>{
  if(ticking2) return;
  requestAnimationFrame(()=>{
    const y = window.scrollY;
    if(y <= 10) MAIN_HDR?.classList.remove('header-hidden');
    else if(y > lastY + 8) MAIN_HDR?.classList.add('header-hidden');
    else if(y < lastY - 8) MAIN_HDR?.classList.remove('header-hidden');
    lastY = y; ticking2 = false;
  });
  ticking2 = true;
}, {passive:true});
window.__sbGetPos = function(){return {top:bar.style.top,bottom:bar.style.bottom,left:bar.style.left,right:bar.style.right,snap:[...bar.classList].filter(c=>c.startsWith('snap-')),collapsed:bar.classList.contains('collapsed'),extrasHidden:bar.classList.contains('extras-hidden'),carouselHidden:bar.classList.contains('carousel-hidden')};};
window.__sbRestore = function(pos){
  if(!pos) return;
  if(pos.top) bar.style.top=pos.top;
  if(pos.bottom) bar.style.bottom=pos.bottom;
  if(pos.left) bar.style.left=pos.left;
  if(pos.right) bar.style.right=pos.right;
  if(pos.snap) pos.snap.forEach(c=>bar.classList.add(c));
  if(pos.collapsed){ bar.classList.add('collapsed'); $("#sbToggle").textContent="▼"; }
  if(pos.extrasHidden) bar.classList.add('extras-hidden');
  if(pos.carouselHidden) bar.classList.add('carousel-hidden');
};
})();