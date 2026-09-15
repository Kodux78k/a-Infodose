(function(){
"use strict";
const $=s=>document.querySelector(s);
const source=$("#sourceText"),conversation=$("#conversation"),counter=$("#counter");
const roundLabel=$("#roundLabel"),lexicalBank=$("#lexicalBank"),bankInfo=$("#bankInfo");
const chatWindow=$("#chatWindow");
const state={units:[],index:0,cycle:0,history:[],bank:{prepositions:[],connectors:[],pronouns:[],articles:[],verbs:[],words:[],questions:[]}};
let generating=false;
function normalize(t){return String(t||"").replace(/\r\n/g,"\n").replace(/\r/g,"\n").replace(/[ \t]+/g," ").replace(/\n{3,}/g,"\n\n").trim()}
function splitText(text){text=normalize(text); if(!text) return [];return text.split(/(?<=[.!?;:])\s+|\n+/).map(x=>x.trim()).filter(Boolean).map((t,i)=>({id:i,text:t,type:t.includes("?")?"question":"statement"}));}
const PREPS=new Set("a ante após até com contra de desde em entre para per perante por sem sob sobre trás ao aos à às do dos da das no nos na nas pelo pelos pela pelas".split(" "));
const CONNS=new Set("e ou mas porém contudo todavia porque portanto então assim logo embora enquanto quando como se caso que também ainda já nem pois além antes depois".split(" "));
const PRONS=new Set("eu tu ele ela nós vos eles elas me te se nos vos lhe lhes isso isto aquilo esse essa este esta aquele aquela quem que qual quais algo nada tudo ninguém alguém".split(" "));
const ARTS=new Set("o a os as um uma uns umas".split(" "));
const STOP=new Set([...PREPS,...CONNS,...PRONS,...ARTS]);
function wordsFrom(text){return normalize(text).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").match(/[a-zA-ZÀ-ÿ]+(?:[-'][a-zA-ZÀ-ÿ]+)*/g)||[]}
function detectVerb(w){if(w.length<4) return false;return /(?:ar|er|ir)$/.test(w)||/(?:ou|ei|iu|ava|ia|aram|eram|iram|ando|endo|indo)$/.test(w)||["é","ser","sou","são","tem","tenho","há","pode","podem","deve","devem","faz","fazem","vai","vão","foi","foram","era","eram","está","estão","existe","existem"].includes(w);}
function extractBank(text){const u=[...new Set(wordsFrom(text))];state.bank={prepositions:u.filter(x=>PREPS.has(x)),connectors:u.filter(x=>CONNS.has(x)),pronouns:u.filter(x=>PRONS.has(x)),articles:u.filter(x=>ARTS.has(x)),verbs:u.filter(x=>detectVerb(x)),words:u.filter(x=>x.length>=4&&!STOP.has(x)),questions:splitText(text).filter(x=>x.type==="question").map(x=>x.text)};renderBank();}
function pick(l){return l&&l.length?l[Math.floor(Math.random()*l.length)]:""}
function srcWord(){return pick(state.bank.words)}
function srcPrep(){return pick(state.bank.prepositions)}
function srcConn(){return pick(state.bank.connectors)}
function cleanP(t){return String(t).replace(/[!?]+/g,"").replace(/[.]+$/,"").trim()}
function lowerFirst(t){return t.charAt(0).toLowerCase()+t.slice(1)}
function invert(text){const c=cleanP(text); if(!c) return "Existe outro lado dessa ideia.";const low=c.toLowerCase();if(/\bnão\b/.test(low)){const pos=c.replace(/\bnão\b/ig,"").replace(/\s{2,}/g," ").trim();return "Então existe a possibilidade de "+lowerFirst(pos)+"."}if(/\b(sim|é|existe|há|pode|deve)\b/i.test(low)) return "Mas também podemos considerar que não "+lowerFirst(c)+".";const w=srcWord(),p=srcPrep();if(w&&p) return "O outro polo observa "+p+" "+w+" e propõe o contrário de "+lowerFirst(c)+".";return "O outro lado propõe o contrário de "+lowerFirst(c)+".";}
function reverseQuestion(text){const c=cleanP(text); const low=c.toLowerCase();if(/^o que\b/.test(low)) return "E o que acontece depois disso?";if(/^como\b/.test(low)) return "E por que isso acontece dessa maneira?";if(/^por que\b/.test(low)) return "E o que faria isso acontecer?";if(/^quando\b/.test(low)) return "E o que acontece antes disso?";if(/^onde\b/.test(low)) return "E o que existe além desse lugar?";if(/^quem\b/.test(low)) return "E quem responde por isso?";if(/^qual\b/.test(low)) return "E qual seria a possibilidade contrária?";const w=srcWord(),p=srcPrep();if(w&&p) return "E se "+p+" "+w+" essa ideia pudesse ser vista de outro modo?";return "E se "+lowerFirst(c)+" pudesse ser visto de outra maneira?";}
function alphaAbout(text){const c=cleanP(text),w=srcWord(),cn=srcConn();if(w&&cn) return "Eu afirmo que "+lowerFirst(c)+", "+cn+" "+w+" permanece dentro da questão.";return "Eu afirmo que "+lowerFirst(c)+" merece continuar sendo observado.";}
function alphaAnswer(question){const c=cleanP(question),w=srcWord(),p=srcPrep();if(w&&p) return "Eu respondo afirmando que "+lowerFirst(c)+" pode ser compreendido "+p+" "+w+".";return "Eu respondo afirmando que "+lowerFirst(c)+" já contém uma possibilidade de resposta.";}
const PAT=[5,3,6,9,7]; let patIdx=0;
function nextArch(){const list=window.ARCH_LIST;const i=list.indexOf(window.getArch());const step=PAT[patIdx++%PAT.length];return list[(i+step)%list.length];}
function archColor(name){const map=window.ARCH_MAP;if(!map||!map[name]) return "var(--active-color)";return `var(${map[name].tok})`;}
function createCycle(){
  if(!state.units.length) state.units=splitText(source.value);
  if(!state.units.length){window.KBLX_TOAST("Insira um texto primeiro.");return false}
  const arch=nextArch();
  const seed=state.units[state.index%state.units.length]; state.index++;
  const alpha=seed.type==="question"?alphaAnswer(seed.text):alphaAbout(seed.text);
  pushMessage("alpha",alpha,seed.type==="question"?"resposta":"semente",arch);
  const betaInv=invert(alpha); pushMessage("beta",betaInv,"inversa",arch);
  const betaQ=reverseQuestion(betaInv); pushMessage("beta",betaQ,"pergunta",arch);
  const alphaF=alphaAnswer(betaQ); pushMessage("alpha",alphaF,"afirmação",arch);
  state.cycle++; roundLabel.textContent=state.cycle+(state.cycle===1?" ciclo":" ciclos");
  updateNavDots(); window.applyArch(arch); if(window.__sbSync) window.__sbSync(arch);
  if(window.KBLX_SAVE) window.KBLX_SAVE();
  return true;
}
function pushMessage(role,text,type,arch){const item={role,text,type,arch,ts:Date.now()};state.history.push(item);const idx=state.history.length-1;renderMessage(item,idx);maybeScrollChat();}
function maybeScrollChat(){if(!chatWindow) return;const nearBottom=(chatWindow.scrollHeight-chatWindow.scrollTop-chatWindow.clientHeight)<200;if(nearBottom) requestAnimationFrame(()=>{chatWindow.scrollTop=chatWindow.scrollHeight});}
function forceScrollChat(){if(!chatWindow) return;requestAnimationFrame(()=>{chatWindow.scrollTop=chatWindow.scrollHeight});}
function renderMessage(item,idx){
  const el=document.createElement("article");
  el.className="message "+item.role;
  el.dataset.arch=item.arch; el.dataset.idx=idx;
  el.style.setProperty("--arch-color",archColor(item.arch));
  const who=item.role==="alpha"?"α ALFA":"β BETA";
  const chip=`<span class="arch-chip"><i></i>${item.arch}</span>`;
  el.innerHTML=`<div class="msg-top"><span class="msg-who">${who}</span>${chip}<span class="msg-type">${item.type}</span></div><div class="msg-text"></div><div class="msg-actions"><button class="msg-mini" data-act="speak">◉ OUVIR</button><button class="msg-mini" data-act="copy">⧉ COPIAR</button><button class="msg-mini slicer" data-act="slicer">→ SLICER</button></div>`;
  el.querySelector(".msg-text").textContent=item.text;
  const speakBtn=el.querySelector('[data-act="speak"]');
  let lpTimer=null, lpFired=false;
  speakBtn.addEventListener("pointerdown",e=>{e.preventDefault();lpFired=false;lpTimer=setTimeout(()=>{lpFired=true;speakSingle(item.text,el);if(navigator.vibrate) try{navigator.vibrate(12)}catch(_){}},500);});
  speakBtn.addEventListener("pointerup",()=>{clearTimeout(lpTimer);if(!lpFired) speakFromIndex(idx);});
  speakBtn.addEventListener("pointerleave",()=>clearTimeout(lpTimer));
  speakBtn.addEventListener("pointercancel",()=>clearTimeout(lpTimer));
  speakBtn.addEventListener("contextmenu",e=>e.preventDefault());
  el.querySelector('[data-act="copy"]').addEventListener("click",async()=>{try{await navigator.clipboard.writeText(item.text);window.KBLX_TOAST("Copiado ✓")}catch(_){}});
  el.querySelector('[data-act="slicer"]').addEventListener("click",()=>{
    const header = `# ${who} · ${item.arch}\n_${item.type}_\n\n`;
    window.Nebula && window.Nebula.loadDocument(header + item.text, `${who} · ${item.arch}`);
    window.KBLX_TOAST("Enviado ✓");
    document.getElementById('s0')?.scrollIntoView({behavior:'smooth',block:'start'});
  });
  conversation.appendChild(el);
}
function renderBank(){const b=state.bank;const all=[...b.prepositions,...b.connectors,...b.pronouns,...b.articles,...b.verbs,...b.words];const tok=(arr,cls)=>arr.map(x=>`<span class="token ${cls}">${x}</span>`).join("");lexicalBank.innerHTML=tok(b.prepositions,"prep")+tok(b.connectors,"conn")+tok(b.pronouns,"pron")+tok(b.articles,"word")+tok(b.verbs,"word")+tok(b.words,"word");bankInfo.textContent=all.length+" elementos";}
function updateNavDots(){document.querySelectorAll(".nav-dot").forEach((d,i)=>d.classList.toggle("on",i===state.cycle%3));}
function speakSingle(text,el){
  if(!("speechSynthesis" in window)){window.KBLX_TOAST("Áudio indisponível");return}
  speechSynthesis.cancel(); speaking=false;
  document.querySelectorAll(".message.playing").forEach(x=>x.classList.remove("playing"));
  if(el) el.classList.add("playing");
  const arch=el?.dataset.arch||window.getArch();
  const u=window.KBLX_VOICE.forArch(arch,text);
  const orb=document.getElementById("sbOrb"); if(orb) orb.classList.add("speaking");
  u.onend=u.onerror=()=>{if(el) el.classList.remove("playing");if(orb) orb.classList.remove("speaking")};
  speechSynthesis.speak(u);
  window.KBLX_TOAST(`🎙 ${arch} · bloco`);
}
let speakIdx=0,speaking=false;
function speakFromIndex(startIdx){
  if(!("speechSynthesis" in window)){window.KBLX_TOAST("Áudio indisponível");return}
  if(!state.history.length){window.KBLX_TOAST("Gere a conversa primeiro");return}
  speechSynthesis.cancel();
  document.querySelectorAll(".message.playing").forEach(x=>x.classList.remove("playing"));
  speaking=true; speakIdx=startIdx;
  const orb=document.getElementById("sbOrb"); if(orb) orb.classList.add("speaking");
  speakNext();
}
function speakConversation(){speakFromIndex(0)}
function speakNext(){
  if(!speaking||speakIdx>=state.history.length){speaking=false;const orb=document.getElementById("sbOrb");if(orb) orb.classList.remove("speaking");return;}
  const item=state.history[speakIdx];
  const el=conversation.querySelectorAll(".message")[speakIdx];
  if(el){el.classList.add("playing");el.scrollIntoView({behavior:"smooth",block:"center"});window.applyArch(item.arch);}
  const u=window.KBLX_VOICE.forArch(item.arch,item.text);
  u.onend=u.onerror=()=>{if(el) el.classList.remove("playing");speakIdx++;speakNext();};
  speechSynthesis.speak(u);
}
$("#stepBtn").addEventListener("click",async()=>{
  if(generating) return;
  if(!state.bank.words.length) extractBank(source.value);
  if(!state.units.length) state.units=splitText(source.value);
  if(!state.units.length){window.KBLX_TOAST("Insira um texto primeiro.");return}
  generating=true;
  try{const N=15;for(let i=0;i<N;i++){createCycle();await new Promise(r=>setTimeout(r,60))}
    window.KBLX_TOAST(`${N} ciclos gerados ⇄`);forceScrollChat();} finally {generating=false;}
});
$("#navStep").addEventListener("click",()=>$("#stepBtn").click());
$("#generateBtn").addEventListener("click",generateAll);
$("#parseBtn").addEventListener("click",()=>{const u=splitText(source.value);if(!u.length){window.KBLX_TOAST("Nenhum texto");return}state.units=u;state.index=0;extractBank(source.value);window.KBLX_TOAST(u.length+" unidades · banco criado ✓");});
$("#pasteBtn").addEventListener("click",async()=>{try{const t=await navigator.clipboard.readText();if(!t){window.KBLX_TOAST("Clipboard vazio");return}source.value=t;updateCounter();$("#parseBtn").click();window.KBLX_TOAST("Colado ✓");}catch(_){window.KBLX_TOAST("Use colar do sistema")}});
$("#listenBtn").addEventListener("click",speakConversation);
async function generateAll(){
  if(generating) return;
  const units=splitText(source.value);
  if(!units.length){window.KBLX_TOAST("Cole um texto");source.focus();return}
  extractBank(source.value);
  state.units=units; state.index=0; state.cycle=0; state.history=[];
  conversation.innerHTML="";
  generating=true;
  try{const total=units.length;for(let i=0;i<total;i++){createCycle();await new Promise(r=>setTimeout(r,45))}
    window.KBLX_TOAST(`${total} ciclos gerados ✓`);forceScrollChat();} finally {generating=false;}
}
function updateCounter(){const n=source.value.length;counter.textContent=n+(n===1?" caractere":" caracteres")}
source.addEventListener("input",updateCounter);
if(!source.value){source.value=`Uma ideia começa pequena.
Ela encontra outra ideia?
Quando duas ideias conversam, algo muda.
O futuro precisa ser diferente?
Talvez a resposta esteja na própria pergunta.`;updateCounter();}
const importSource = document.getElementById('importSource');
const importBtn = document.getElementById('importBtn');
if(importBtn && importSource){
  importBtn.addEventListener('click', ()=>importSource.click());
  importSource.addEventListener('change', async (e)=>{
    const f = e.target.files[0]; if(!f) return;
    try{const txt = await f.text();source.value = txt; updateCounter();
      const u = splitText(txt);state.units = u; state.index = 0; extractBank(txt);
      window.KBLX_TOAST(`Importado: ${f.name} ✓`);
    }catch(err){ window.KBLX_TOAST("Falha ao ler"); }
    importSource.value = "";
  });
}
const sendSlicerBtn = document.getElementById('sendSlicerBtn');
if(sendSlicerBtn){sendSlicerBtn.addEventListener('click', ()=>{const txt = source.value.trim();if(!txt){ window.KBLX_TOAST("Nada para enviar"); return; }window.Nebula && window.Nebula.loadDocument(txt, "Polo");window.KBLX_TOAST("Enviado ✓");document.getElementById('s0')?.scrollIntoView({behavior:'smooth'});});}
const allToSlicerBtn = document.getElementById('allToSlicerBtn');
if(allToSlicerBtn){allToSlicerBtn.addEventListener('click', ()=>{if(!state.history.length){ window.KBLX_TOAST("Sem conversa"); return; }const md = state.history.map(m=>{const who = m.role==="alpha"?"ALFA":"BETA";return `# ${who} · ${m.arch}\n_${m.type}_\n\n${m.text}`;}).join("\n\n---\n\n");window.Nebula && window.Nebula.loadDocument(md, "Conversa");window.KBLX_TOAST("Enviado ✓");document.getElementById('s0')?.scrollIntoView({behavior:'smooth'});});}
window.AlfaBetaState=state;
window.KBLX_ACTIONS={speak:speakConversation,speakFrom:speakFromIndex,stop:()=>{speaking=false;if("speechSynthesis" in window) speechSynthesis.cancel();document.querySelectorAll(".message.playing").forEach(x=>x.classList.remove("playing"));const orb=document.getElementById("sbOrb"); if(orb) orb.classList.remove("speaking");}};

window.KBLX_REBUILD_DIALOGUE = function(saved){
  if(!saved || !saved.history || !saved.history.length) return;
  state.units = saved.units || [];
  state.index = saved.index || 0;
  state.cycle = saved.cycle || 0;
  state.history = saved.history || [];
  state.bank = saved.bank || state.bank;
  conversation.innerHTML = "";
  state.history.forEach((item, i)=>renderMessage(item, i));
  roundLabel.textContent = state.cycle + (state.cycle===1?" ciclo":" ciclos");
  if(saved.sourceText){ source.value = saved.sourceText; updateCounter(); }
  renderBank();
  forceScrollChat();
};
})();