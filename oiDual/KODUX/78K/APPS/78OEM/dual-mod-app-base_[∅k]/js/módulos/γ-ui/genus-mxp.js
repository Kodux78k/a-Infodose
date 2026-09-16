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