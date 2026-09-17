(function(){
"use strict";
const HOLD_MS = 500;
const TAP_DELAY = 240;
const MOVE_THRESHOLD = 12;
const DRAG_THRESHOLD = 18;

const $ = (s,r=document)=>r.querySelector(s);
const $$ = (s,r=document)=>[...r.querySelectorAll(s)];
const uid = (p="x")=>p+"_"+Date.now().toString(36)+Math.random().toString(36).slice(2,7);

const BRIDGE = {
  "dual:theme-toggle": ()=>document.getElementById('themeToggle')?.click(),
  "dual:theme-dot":    ()=>document.getElementById('themeToggle')?.click(),
  "dual:drawer":       ()=>window.toggleDrawer?.('drawerProfile'),
  "drawer:open":       ()=>window.toggleDrawer?.('drawerProfile'),
  "dual:new-session":  ()=>createSession('SESSION'),
  "dual:win-max":      ()=>{ const w=activeSessionWin(); w?.__max?.(); },
  "dual:win-min":      ()=>{ const w=activeSessionWin(); w?.__min?.(); },
  "dual:win-close":    ()=>{ const w=activeSessionWin(); w?.__close?.(); },
  "dual:win-tabs":     ()=>{ const w=activeSessionWin(); if(w) window.DualSession?.openTabSwitcher?.(w); },
  "dual:focus-url":    ()=>{ document.getElementById('urlInputNav')?.focus(); },
  "dual:win-collapse": ()=>{ const w=activeSessionWin(); w?.__collapse?.(); },
  "nav:go":            ()=>{ const u=document.getElementById('urlInputNav')?.value?.trim(); if(u) document.getElementById('goNavBtn')?.click(); },
  "nav:next":          ()=>{ document.getElementById('stepBtn')?.click(); },
  "session:new":       ()=>createSession('SESSION'),
  "session:focus":     ()=>{ /* no-op */ },

  /* ── SESSION WINDOW (aplicado a sections auto-adaptadas) ── */
  "session:collapse":  (ctx)=>{
    const s = document.activeElement?.closest('.app > section.session-window')
           || ctx?.element?.closest('.app > section.session-window')
           || ctx?.section;
    s?.classList.toggle('collapsed');
  },
  "session:maximize":  (ctx)=>{
    const s = document.activeElement?.closest('.app > section.session-window')
           || ctx?.element?.closest('.app > section.session-window')
           || ctx?.section;
    s?.classList.toggle('maximized');
  },
  "session:minimize":  (ctx)=>{
    const s = document.activeElement?.closest('.app > section.session-window')
           || ctx?.element?.closest('.app > section.session-window')
           || ctx?.section;
    if(s) window.KBLX_minimizeToDock?.(s, { title: s.dataset.sessionTitle });
  },
  "session:close":     (ctx)=>{
    const s = document.activeElement?.closest('.app > section.session-window')
           || ctx?.element?.closest('.app > section.session-window')
           || ctx?.section;
    s?.classList.add('minimized');
  },

  "theme:toggle":      ()=>document.getElementById('themeToggle')?.click(),
  "notif:open":        ()=>window.KBLX_TOAST?.('Sem notificações'),
  "media:play":        ()=>{ const nb=window.Nebula; if(nb&&nb.hasSlices&&nb.hasSlices()) nb.toggleSpeech(); else window.KBLX_ACTIONS?.speak(); },
  "media:pause":       ()=>{ if('speechSynthesis' in window && speechSynthesis.paused===false) speechSynthesis.pause(); },
  "media:stop":        ()=>{ window.Nebula?.stopSpeech?.(); window.KBLX_ACTIONS?.stop?.(); },
  "media:next":        ()=>window.Nebula?.nextSlice?.(),
  "media:prev":        ()=>window.Nebula?.previousSlice?.(),
  "nebula:speak":      ()=>{ const nb=window.Nebula; if(nb&&nb.hasSlices&&nb.hasSlices()) nb.toggleSpeech(); else window.KBLX_ACTIONS?.speak(); },
  "nebula:import":     ()=>document.getElementById('sbImportInput')?.click(),
  "nebula:paste":      ()=>{ const t=prompt('Cole:'); if(t) window.Nebula?.loadDocument(t,'Colado'); },
  "nebula:clear":      ()=>window.Nebula?.clear?.(),
  "dialog:generate":   ()=>document.getElementById('generateBtn')?.click(),
  "dialog:step":       ()=>document.getElementById('stepBtn')?.click(),
  "dialog:clear":      ()=>document.getElementById('sbClear')?.click(),
  "dialog:copy":       ()=>document.getElementById('sbCopy')?.click(),
  "dialog:download":   ()=>document.getElementById('sbDownload')?.click(),
  "orb:next":          ()=>{ const o=document.getElementById('sbOrb'); if(o){ o.dispatchEvent(new PointerEvent('pointerdown',{bubbles:true})); setTimeout(()=>o.dispatchEvent(new PointerEvent('pointerup',{bubbles:true})),10); } },
  "orb:wheel":         ()=>document.getElementById('arch-overlay')?.classList.add('open'),
  "orb:theme":         ()=>{ const cur=document.body.dataset.voiceArch||'jesus'; const next=(cur==='jesus')?'kodux':'jesus'; const r=document.getElementById('sbOrb')?.getBoundingClientRect(); window.applyArch(next,{x:(r?.left+r?.width/2||0)/innerWidth*100,y:(r?.top+r?.height/2||0)/innerHeight*100}); window.__sbSync?.(next); },
  "aside:toggle":      ()=>document.getElementById('symbolBar')?.classList.toggle('collapsed'),
  "factory:open":      ()=>openFactory(),
  "factory:close":     ()=>closeFactory(),
  "slot:clear":        (ctx)=>{ const s=ctx?.slot||"loose"; if(state.slots[s]){ state.slots[s]=[]; save(); renderSlot(s); toast(`"${s}" limpo`); } },
  "state:reset":       ()=>{ if(!confirm("Resetar MXP?")) return; state=defaultState(); save(); renderAll(); toast("estado resetado"); },
  "extras:import-slicer":   ()=>document.getElementById('sbImportInput')?.click(),
  "extras:paste-slicer":    ()=>{ const t=prompt('Cole:'); if(t) window.Nebula?.loadDocument(t,'Colado'); },
  "extras:generate":        ()=>document.getElementById('generateBtn')?.click(),
  "extras:toggle-carousel": ()=>document.getElementById('symbolBar')?.classList.toggle('carousel-hidden'),
};

const CATALOG = [
  { category:"DUAL · SYSTEM", items:[["dual:theme-toggle","☼","TEMA"],["dual:drawer","🔅","COCKPIT"],["state:reset","⌦","RESET"]] },
  { category:"DUAL · WINDOW", items:[["dual:new-session","＋","NOVA"],["dual:win-max","⛶","MAX"],["dual:win-min","۞","MIN"],["dual:win-collapse","−","COLAPSO"],["dual:win-close","×","FECHAR"],["dual:win-tabs","⊞","ABAS"]] },
  { category:"SECTION WINDOW", items:[["session:collapse","−","COLAPSO"],["session:maximize","⛶","MAX"],["session:minimize","۞","MIN"],["session:close","×","FECHAR"]] },
  { category:"NEBULA", items:[["nebula:speak","🎙","SPEAK"],["nebula:import","⌲","IMPORT"],["nebula:paste","✎","PASTE"],["nebula:clear","⌫","CLEAR"]] },
  { category:"DIALOGUE", items:[["dialog:generate","⇄","GERAR"],["dialog:step","→","+15"],["dialog:copy","⧉","COPY"],["dialog:download","↓","DL"],["dialog:clear","×","CLEAR"]] },
  { category:"MEDIA", items:[["media:play","▶","PLAY"],["media:pause","Ⅱ","PAUSE"],["media:stop","■","STOP"],["media:next","›","NEXT"],["media:prev","‹","PREV"]] },
  { category:"MXP", items:[["factory:open","◈","FACTORY"],["aside:toggle","☰","TOGGLE"],["session:new","◉","SESSION"]] },
  { category:"ORB", items:[["orb:next","◉","NEXT"],["orb:wheel","∆","WHEEL"],["orb:theme","◐","THEME"]] },
];

function defaultState(){ return { version:13, slots:{ header:[], aside:[], footer:[], loose:[] }, sessions:[] }; }
let state = window.Store ? (window.Store.get(window.KBLX_KEYS.mxp, null) || defaultState()) : defaultState();
const save = ()=>{ if(window.Store) window.Store.set(window.KBLX_KEYS.mxp, state); };

function toast(msg){ window.KBLX_TOAST ? window.KBLX_TOAST(msg) : null; }
function hud(msg){ const el=$("#mxd-hud"); if(!el) return; if(msg){ el.textContent=msg; el.classList.add("is-live"); } else el.classList.remove("is-live"); }

function fire(action, ctx={}){
  if(!action) return;
  if(BRIDGE[action]){ try{ BRIDGE[action](ctx); }catch(e){ console.warn('bridge',action,e); } return; }
  window.dispatchEvent(new CustomEvent("MXP_ACTION",{detail:{action,ctx}}));
  console.log("[MXP] fire:",action);
}

function makeButton(item, slot){
  const b = document.createElement("button");
  b.type = "button";
  b.className = "mxp-btn";
  if(slot === "__factory__") b.classList.add("slot-factory");
  else if(slot.startsWith("session:")) b.classList.add("slot-session");
  else b.classList.add("slot-"+slot);
  b.dataset.id = item.id || uid("btn");
  b.dataset.action = item.action || "";
  b.dataset.label = item.label || "";
  b.dataset.icon = item.icon || "";
  b.dataset.slot = slot;
  if(item.binding) b.dataset.binding = item.binding;
  /* v14 — explica o "vincular" pra quem esbarra nisso sem saber pra que
     serve: arrastar um botão sobre um elemento com data-dual-target
     (tema, campo de URL, cockpit...) faz esse botão passar a disparar
     a MESMA ação do elemento nativo — é um atalho custom pra uma ação
     que já existe, não uma feature separada. */
  b.title = item.binding
    ? `${item.label} · vinculado a "${item.binding}" — clique dispara a mesma ação do elemento nativo`
    : `${item.label} · ${item.action}`;
  b.innerHTML = `<span class="mxp-icon">${item.icon||"•"}</span><span class="mxp-label">${item.label||""}</span>`;
  if(item.binding) b.classList.add("is-bound");
  return b;
}
function itemFromButton(btn){ return { id:btn.dataset.id, action:btn.dataset.action, label:btn.dataset.label, icon:btn.dataset.icon, binding:btn.dataset.binding||"" }; }

function renderSlot(slot){
  const el = document.querySelector(`[data-slot="${slot}"]`); if(!el) return;
  el.innerHTML = "";
  (state.slots[slot]||[]).forEach(it=>el.appendChild(makeButton(it, slot)));
}
function renderFactory(){
  const root = $("#mxd-catalog"); if(!root) return;
  root.innerHTML = "";
  CATALOG.forEach(cat=>{
    const wrap = document.createElement("section"); wrap.className = "mxd-cat";
    wrap.innerHTML = `<div class="mxd-cat-name">${cat.category}</div>`;
    const grid = document.createElement("div"); grid.className = "mxd-cat-grid";
    cat.items.forEach(([action,icon,label])=>{ grid.appendChild(makeButton({id:uid("factory"),action,icon,label},"__factory__")); });
    wrap.appendChild(grid); root.appendChild(wrap);
  });
}
function renderSessions(){ window.DualSession?.renderSessions?.(); }
function renderAll(){ renderFactory(); renderSlot("header"); renderSlot("aside"); renderSlot("footer"); renderSlot("loose"); renderSessions(); }

function createSession(name="SESSION"){
  const host = document.body.dataset.sessionHost === 'stack' ? 'stack' : 'float';
  const s = { id:uid("session"), name, url:"https://www.infodose.com.br/splash", host };
  state.sessions.push(s); state.slots["session:"+s.id]=[];
  save(); renderSessions(); toast(`session "${name}" criada`);
  return s;
}
function removeSession(id){
  state.sessions = state.sessions.filter(s=>s.id!==id);
  delete state.slots["session:"+id];
  save();
}

function activeSessionWin(){
  const wins = $$(".mxp-window:not(.minimized)");
  if(!wins.length) return null;
  let best = wins[0], bestZ = 0;
  wins.forEach(w=>{ const z = parseInt(getComputedStyle(w).zIndex)||0; if(z >= bestZ){ bestZ = z; best = w; } });
  return best;
}

function addToSlot(item, slot){
  state.slots[slot] ??= [];
  const copy = { ...item, id:item.id||uid("btn") };
  state.slots[slot].push(copy); save(); renderSlot(slot);
  toast(`+ ${copy.label||copy.action} → ${slot}`);
}
function removeItem(id, slot){
  if(!state.slots[slot]) return;
  state.slots[slot] = state.slots[slot].filter(x=>x.id!==id);
  save(); renderSlot(slot); toast("removido");
}
function moveItem(id, from, to){
  if(from === to) return;
  const list = state.slots[from]||[]; const i = list.findIndex(x=>x.id===id);
  if(i<0) return;
  const item = list.splice(i,1)[0];
  state.slots[to] ??= []; state.slots[to].push(item);
  save(); renderSlot(from); renderSlot(to); toast(`movido → ${to}`);
}

let gesture = null;
let pendingTap = null;

function flushPendingTap(){
  if(!pendingTap) return;
  clearTimeout(pendingTap.timer);
  const p = pendingTap; pendingTap = null;
  p.btn.classList.remove("is-firing");
  fire(p.item.action, { element:p.btn, slot:p.slot });
}

document.addEventListener("pointerdown", e=>{
  const btn = e.target.closest(".mxp-btn"); if(!btn) return;
  if(btn.closest("[data-win-action]")) return;
  if(e.pointerType==="mouse" && e.button!==0) return;

  gesture = {
    btn, pointerId:e.pointerId, startX:e.clientX, startY:e.clientY,
    x:e.clientX, y:e.clientY, slot:btn.dataset.slot,
    item:itemFromButton(btn), dragging:false, timer:null, ghost:null,
    dualHover:null,
  };
  btn.classList.add("is-holding");
  gesture.timer = setTimeout(startFakeDrag, HOLD_MS);
}, { passive:true });

document.addEventListener("pointermove", e=>{
  if(!gesture || gesture.pointerId!==e.pointerId) return;
  gesture.x = e.clientX; gesture.y = e.clientY;
  const dx = e.clientX-gesture.startX, dy = e.clientY-gesture.startY;
  if(!gesture.dragging && Math.hypot(dx,dy) > MOVE_THRESHOLD){
    clearTimeout(gesture.timer);
    gesture.btn.classList.remove("is-holding");
    gesture = null; return;
  }
  if(!gesture.dragging) return;
  e.preventDefault();
  moveGhost(e.clientX, e.clientY);
  updateDropTargets(e.clientX, e.clientY);
  updateDualTargets(e.clientX, e.clientY);
}, { passive:false });

document.addEventListener("pointerup", e=>{
  if(!gesture || gesture.pointerId!==e.pointerId) return;
  clearTimeout(gesture.timer);
  if(gesture.dragging){
    const moved = Math.hypot(e.clientX-gesture.startX, e.clientY-gesture.startY) > DRAG_THRESHOLD;
    if(moved){ finishFakeDrag(e.clientX, e.clientY); }
    else { cleanupDrag(); gesture = null; }
    return;
  }
  const btn = gesture.btn;
  const slot = gesture.slot;
  const item = gesture.item;
  btn.classList.remove("is-holding");
  gesture = null;
  handleTap(btn, slot, item);
}, { passive:true });

document.addEventListener("pointercancel", ()=>{
  if(!gesture) return;
  clearTimeout(gesture.timer);
  gesture.btn.classList.remove("is-holding","is-source");
  cleanupDrag(); hud(""); gesture = null;
});

function handleTap(btn, slot, item){
  if(slot === "__factory__"){
    addToSlot({...item, id:uid("btn")}, "loose");
    return;
  }
  if(pendingTap && pendingTap.btn === btn){
    clearTimeout(pendingTap.timer);
    pendingTap.btn.classList.remove("is-firing");
    pendingTap = null;
    openContext(btn, slot); return;
  }
  if(pendingTap){ flushPendingTap(); }
  btn.classList.add("is-firing");
  const timer = setTimeout(()=>{
    if(pendingTap && pendingTap.btn === btn){
      pendingTap = null;
      btn.classList.remove("is-firing");
      fire(item.action, { element:btn, slot });
    }
  }, TAP_DELAY);
  pendingTap = { btn, timer, item, slot };
}

function startFakeDrag(){
  if(!gesture) return;
  if(pendingTap && pendingTap.btn === gesture.btn){
    clearTimeout(pendingTap.timer);
    pendingTap.btn.classList.remove("is-firing");
    pendingTap = null;
  }
  gesture.dragging = true;
  gesture.btn.classList.remove("is-holding");
  gesture.btn.classList.add("is-source");
  document.body.classList.add("mxp-dragging");
  const trash = $("#mxd-trash"); if(trash) trash.classList.add("is-active");
  hud("segure · solte em slot OU sobre DUAL tracejado");
  const ghost = document.createElement("div");
  ghost.id = "mxd-ghost";
  ghost.textContent = gesture.item.icon || "•";
  document.body.appendChild(ghost);
  gesture.ghost = ghost;
  requestAnimationFrame(()=>ghost.classList.add("is-live"));
  moveGhost(gesture.x, gesture.y);
  if(navigator.vibrate) try{navigator.vibrate(15)}catch(_){}
}
function moveGhost(x,y){ if(!gesture?.ghost) return; gesture.ghost.style.left = x+"px"; gesture.ghost.style.top = y+"px"; }
function getDropTarget(x,y){
  if(gesture?.ghost) gesture.ghost.style.display = "none";
  const el = document.elementFromPoint(x,y);
  if(gesture?.ghost) gesture.ghost.style.display = "grid";
  return el?.closest("[data-drop-target]");
}
function getDualTarget(x,y){
  if(gesture?.ghost) gesture.ghost.style.display = "none";
  const el = document.elementFromPoint(x,y);
  if(gesture?.ghost) gesture.ghost.style.display = "grid";
  return el?.closest("[data-dual-target]");
}
function updateDropTargets(x,y){
  $$("[data-drop-target]").forEach(el=>el.classList.remove("is-drop-ready"));
  const trash = $("#mxd-trash"); if(trash) trash.classList.remove("is-over");
  const t = getDropTarget(x,y); if(!t) return;
  if(t.dataset.trash !== undefined){ trash.classList.add("is-over"); hud(`soltar para remover · ${gesture.item.label||gesture.item.action}`); return; }
  t.classList.add("is-drop-ready"); hud(`soltar em · ${t.dataset.slot || "slot"}`);
}
function updateDualTargets(x,y){
  $$("[data-dual-target].is-dual-hover").forEach(el=>el.classList.remove("is-dual-hover"));
  gesture.dualHover = null;
  const d = getDualTarget(x,y);
  if(d){ d.classList.add("is-dual-hover"); gesture.dualHover = d; hud(`⛓ vincular a · ${d.dataset.dualAction || 'DUAL'}`); }
}
function finishFakeDrag(x,y){
  clearTimeout(gesture.timer);
  const dualTarget = getDualTarget(x,y);
  const target = getDropTarget(x,y);
  if(dualTarget && gesture.slot !== "__factory__" && !target){
    const dualAction = dualTarget.dataset.dualAction;
    const list = state.slots[gesture.slot]||[];
    const idx = list.findIndex(i=>i.id===gesture.item.id);
    if(idx >= 0){ list[idx].binding = dualAction; list[idx].action = "dual:"+dualAction; save(); renderSlot(gesture.slot); toast(`⛓ vinculado a ${dualAction}`); }
    cleanupDrag(); gesture=null; return;
  }
  if(target && target.dataset.trash !== undefined){
    if(gesture.slot !== "__factory__") removeItem(gesture.item.id, gesture.slot);
    cleanupDrag(); gesture=null; return;
  }
  if(target){
    const to = target.dataset.slot;
    if(gesture.slot === "__factory__") addToSlot({...gesture.item, id:uid("btn")}, to);
    else moveItem(gesture.item.id, gesture.slot, to);
    cleanupDrag(); gesture=null; return;
  }
  cleanupDrag(); gesture=null;
}
function cleanupDrag(){
  if(!gesture) return;
  gesture.btn.classList.remove("is-source");
  gesture.ghost?.remove(); gesture.ghost=null;
  const trash = $("#mxd-trash"); if(trash) trash.classList.remove("is-active","is-over");
  $$("[data-drop-target]").forEach(el=>el.classList.remove("is-drop-ready"));
  $$("[data-dual-target].is-dual-hover").forEach(el=>el.classList.remove("is-dual-hover"));
  document.body.classList.remove("mxp-dragging");
  hud("");
}

let contextItem = null;
function openContext(btn, slot){
  if(slot === "__factory__") return;
  contextItem = { btn, item:itemFromButton(btn), slot };
  const menu = $("#mxd-context");
  const head = $("#mxd-ctx-head");
  if(head) head.textContent = contextItem.item.label || contextItem.item.action;
  const r = btn.getBoundingClientRect();
  menu.style.left = Math.min(window.innerWidth-190, Math.max(10,r.left))+"px";
  menu.style.top  = Math.min(window.innerHeight-220, r.bottom+8)+"px";
  menu.classList.add("is-open");
}
function closeContext(){ $("#mxd-context").classList.remove("is-open"); contextItem = null; }
$("#mxd-context").addEventListener("click", e=>{
  const a = e.target.closest("[data-context-action]")?.dataset.contextAction;
  if(!a || !contextItem) return;
  const { item, slot } = contextItem;
  if(a==="fire") fire(item.action, { item, slot });
  if(a==="duplicate") addToSlot({...item, id:uid("copy"), binding:""}, slot);
  if(a==="unbind"){ const list = state.slots[slot]||[]; const i = list.findIndex(x=>x.id===item.id); if(i>=0){ list[i].binding = ""; save(); renderSlot(slot); toast("desvinculado"); } }
  if(a==="favorite"){ const s = createSession("fav:"+(item.label||item.action)); addToSlot({...item, id:uid("fav")}, "session:"+s.id); }
  if(a==="remove") removeItem(item.id, slot);
  closeContext();
});
document.addEventListener("pointerdown", e=>{ if($("#mxd-context").classList.contains("is-open") && !e.target.closest("#mxd-context")) closeContext(); });

function openFactory(){ $("#mxd-factory").classList.add("is-open"); }
function closeFactory(){ $("#mxd-factory").classList.remove("is-open"); }
window.openFactory = openFactory;
$("#mxd-factory").addEventListener("click", e=>{ if(e.target.id === "mxd-factory") closeFactory(); });

document.addEventListener("keydown", e=>{
  if((e.ctrlKey||e.metaKey) && e.shiftKey && e.key.toLowerCase()==="b"){ e.preventDefault(); const f=$("#mxd-factory"); if(f) f.classList.toggle("is-open"); }
  if(e.key === "Escape"){ closeFactory(); closeContext(); }
});

function seed(){
  /* FIX v14 — BUG RAIZ do "loose não salva": seed() rodava de forma
     síncrona no parse, e KBLX_LOAD só popula `state` real 200ms depois
     (setTimeout). Ou seja, o teste de "está vazio?" via olhava pro
     state recém-inicializado (sempre vazio) mesmo quando já existia
     um save de verdade no localStorage — e o save() do seed rodava
     ANTES do load, sobrescrevendo os botões salvos com os 6 padrão
     em TODO carregamento. Agora, se já existe um root salvo, seed()
     nem olha pro state em memória: quem popula é o KBLX_LOAD. */
  const hasSavedRoot = window.Store && window.Store.get(window.KBLX_KEYS.root);
  if (hasSavedRoot) { console.log('[MXP] save existente — seed pulado'); return; }
  const empty = !state.slots.header?.length && !state.slots.aside?.length && !state.slots.footer?.length && !state.slots.loose?.length && !state.sessions.length;
  if(!empty) return;
  state.slots.header = [{ id:uid("s"), action:"dual:theme-toggle", icon:"☼", label:"TEMA" }];
  state.slots.aside = [
    { id:uid("s"), action:"extras:import-slicer", icon:"⌲", label:"SLICER" },
    { id:uid("s"), action:"extras:paste-slicer", icon:"✎", label:"COLAR" },
    { id:uid("s"), action:"extras:generate", icon:"⇄", label:"GERAR" },
    { id:uid("s"), action:"extras:toggle-carousel", icon:"◈", label:"ARQ." },
  ];
  state.slots.footer = [
    { id:uid("s"), action:"factory:open", icon:"◈", label:"FACTORY" },
    { id:uid("s"), action:"dual:drawer", icon:"🔅", label:"COCKPIT" },
  ];
  state.slots.loose = [
    { id:uid("s"), action:"dual:new-session", icon:"＋", label:"NOVA" },
    { id:uid("s"), action:"state:reset", icon:"⌦", label:"RESET" },
  ];
  save();
}

seed();
renderAll();

window.MXP = {
  get state(){ return state; },
  CATALOG, fire, createSession, removeSession, addToSlot, removeItem, moveItem,
  toast, save, render: renderAll, renderSlot, renderSessions,
  reset(){ state = defaultState(); save(); renderAll(); },
  openFactory, closeFactory,
};
console.log('[MXP] v13 · tap=fire(240ms) · tap²=menu · hold=drag · host-aware');
})();