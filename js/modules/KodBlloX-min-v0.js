/* ═══════════════════════════════════════════════════════════════════════
   KOBLLUX · v15 · ESTÁVEL
   Um dono por domínio. Sem FIX v15. Sem legacy. Sem duplicação.

   ORDEM (importa):
     1 Store   2 Arch   3 Voice   4 BG    5 Cockpit   6 Tabs    7 Dock
     8 Session 9 SectionAdapters   10 MXP  11 NebulaRich  12 Nebula
     13 Dialogue   14 App/Chat   15 SymbolBar   16 Persistence  17 Boot
   ═══════════════════════════════════════════════════════════════════════ */

/* ─────────────────────────────────────────────────────────────────────
   1. STORE
   ───────────────────────────────────────────────────────────────────── */
window.KBLX_NS = "kobllux";
window.KBLX_KEYS = {
  root:"kobllux:root", mxp:"kobllux:mxp", bg:"kobllux:bg",
  arch:"kobllux:arch", user:"kobllux:user", ui:"kobllux:ui",
  dialog:"kobllux:dialog", nebula:"kobllux:nebula", backup:"kobllux:backup",
  dock:"kobllux:dock", tabs:"kobllux:tabs", links:"kobllux:links",
};
window.Store = {
  get(k, fb=null){
    try{ const v = localStorage.getItem(k); return v ? JSON.parse(v) : fb; }
    catch(_){ return fb; }
  },
  set(k, v){
    try{ localStorage.setItem(k, JSON.stringify(v)); return true; }
    catch(e){
      if(e.name === "QuotaExceededError") console.warn("[Store] quota excedida:", k);
      return false;
    }
  },
  del(k){ try{ localStorage.removeItem(k); }catch(_){} },
  keys(){ return Object.values(window.KBLX_KEYS); },
  clearAll(){ this.keys().forEach(k => this.del(k)); },
};

/* ─────────────────────────────────────────────────────────────────────
   2. ARCH
   ───────────────────────────────────────────────────────────────────── */
(function(){
"use strict";
const root = document.documentElement;
const ARCH = {
  ATLAS:{tok:"--KBLX_A",op:"0x02",hz:396,sym:"α"}, NOVA:{tok:"--KBLX_E",op:"0x03",hz:528,sym:"✦"},
  VITALIS:{tok:"--KBLX_G",op:"0x09",hz:528,sym:"♾"}, PULSE:{tok:"--KBLX_J",op:"0x01",hz:432,sym:"◈"},
  ARTEMIS:{tok:"--KBLX_N",op:"0x05",hz:528,sym:"☾"}, SERENA:{tok:"--KBLX_C",op:"0x0A",hz:639,sym:"❋"},
  KAOS:{tok:"--KBLX_M",op:"0x04",hz:396,sym:"⚡"}, GENUS:{tok:"--KBLX_O",op:"0x07",hz:741,sym:"⚙"},
  LUMINE:{tok:"--KBLX_L",op:"0x06",hz:528,sym:"☀"}, SOLUS:{tok:"--KBLX_H",op:"0x0B",hz:741,sym:"◌"},
  RHEA:{tok:"--KBLX_K",op:"0x0A",hz:528,sym:"∞"}, AION:{tok:"--KBLX_P",op:"0x0C",hz:741,sym:"⧗"},
  KODUX:{tok:"--KBLX_B",op:"0x08",hz:432,sym:"⇄"}, BLLUE:{tok:"--KBLX_I",op:"0x08",hz:528,sym:"◉"},
  JESUS:{tok:"--KBLX_Q",op:"0x00",hz:777,sym:"✝"}, KOBLLUX:{tok:"--KBLX_R",op:"0x00",hz:369,sym:"∆"},
};
const ORDER = ["ATLAS","NOVA","VITALIS","PULSE","ARTEMIS","SERENA","KAOS","GENUS",
               "LUMINE","SOLUS","RHEA","AION","KODUX","BLLUE","JESUS","KOBLLUX"];
let currentArch = "JESUS";
const tokVal = v => getComputedStyle(root).getPropertyValue(v).trim();

function fireRipple(x, y){
  const r = document.getElementById("chromaRipple"); if(!r) return;
  r.style.setProperty("--ripple-x", (x ?? 50)+"%");
  r.style.setProperty("--ripple-y", (y ?? 50)+"%");
  r.classList.remove("fire"); void r.offsetWidth; r.classList.add("fire");
}
let toastTimer;
function toast(msg){
  const t = document.getElementById("toast"); if(!t) return;
  t.textContent = msg; t.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("show"), 1600);
}
function applyArch(name, origin){
  const a = ARCH[name] || ARCH.JESUS;
  const c = tokVal(a.tok);
  const sec = (name === "JESUS" || name === "KOBLLUX") ? tokVal("--KBLX_F") : tokVal("--KBLX_I");
  root.style.setProperty("--active-color", c);
  root.style.setProperty("--active-secondary", sec);
  root.style.setProperty("--kob-voice-primary", c);
  root.style.setProperty("--kob-voice-secondary", sec);
  root.style.setProperty("--active-glow", c + "66");
  root.style.setProperty("--active-hz", a.hz);
  document.body.dataset.voiceArch = name.toLowerCase();
  const ph = document.getElementById("pillHz"), pa = document.getElementById("pillArch"),
        hud = document.getElementById("sbHud"), st = document.getElementById("sbStatus"),
        sb = document.getElementById("sbSub");
  if(ph) ph.textContent = a.hz + "Hz";
  if(pa) pa.textContent = name;
  if(hud) hud.textContent = a.op + " · " + name;
  if(st) st.textContent = `${a.op} · ${name}`;
  if(sb) sb.textContent = `${a.hz}Hz`;
  currentArch = name;
  if(origin) fireRipple(origin.x, origin.y);
  window.Store.set(window.KBLX_KEYS.arch, name);
}
window.applyArch = applyArch;
window.getArch = () => currentArch;
window.ARCH_LIST = ORDER;
window.ARCH_MAP = ARCH;
window.KBLX_TOKVAL = tokVal;
window.KBLX_RIPPLE = fireRipple;
window.KBLX_TOAST = toast;
})();

/* ─────────────────────────────────────────────────────────────────────
   3. VOICE
   ───────────────────────────────────────────────────────────────────── */
(function(){
if(!("speechSynthesis" in window)) return;
const VOZ = {
  ATLAS:{nome:"Daniel",lang:"en-US",rate:1.02,pitch:1.39}, NOVA:{nome:"Luciana",lang:"pt-BR",rate:1.063,pitch:1.34},
  VITALIS:{nome:"Rocko",lang:"pt-BR",rate:0.96,pitch:1.42}, PULSE:{nome:"Reed",lang:"pt-BR",rate:1.0,pitch:1.78},
  ARTEMIS:{nome:"Paulina",lang:"es-MX",rate:1.0,pitch:1.23}, SERENA:{nome:"Joana",lang:"pt-BR",rate:0.92,pitch:0.90},
  KAOS:{nome:"Rocko",lang:"pt-BR",rate:1.28,pitch:0.67}, GENUS:{nome:"Reed",lang:"pt-BR",rate:0.98,pitch:1.20},
  LUMINE:{nome:"Flo",lang:"fr-FR",rate:1.03,pitch:1.55}, SOLUS:{nome:"Satu",lang:"fi-FI",rate:0.90,pitch:0.58},
  RHEA:{nome:"Alice",lang:"it-IT",rate:1.02,pitch:1.44}, AION:{nome:"Milena",lang:"ru-RU",rate:1.07,pitch:1.08},
  KODUX:{nome:"Rocko",lang:"pt-BR",rate:1.0,pitch:0.07}, BLLUE:{nome:"Zuzana",lang:"cs-CZ",rate:0.94,pitch:1.69},
  JESUS:{nome:"Sara",lang:"da-DK",rate:1.09,pitch:0.03}, KOBLLUX:{nome:"Luciana",lang:"pt-BR",rate:0.98,pitch:0.48},
};
const norm = s => String(s || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
function findVoice(cfg){
  const vs = speechSynthesis.getVoices(); if(!vs.length) return null;
  const vl = Array.from(vs), n = norm(cfg.nome), lg = norm(cfg.lang).split("-")[0];
  return vl.find(v => norm(v.name).includes(n) && norm(v.lang).startsWith(lg))
      || vl.find(v => norm(v.lang).startsWith(lg))
      || vl.find(v => norm(v.lang).startsWith("pt"))
      || vl[0];
}
function voiceFor(archName, text){
  const cfg = VOZ[archName] || VOZ.JESUS;
  const u = new SpeechSynthesisUtterance(text);
  u.lang = cfg.lang; u.rate = cfg.rate; u.pitch = cfg.pitch;
  const v = findVoice(cfg);
  if(v){ u.voice = v; u.lang = v.lang || cfg.lang; }
  return u;
}
window.KBLX_VOICE = { map:VOZ, forArch:voiceFor, find:findVoice };
})();

/* ─────────────────────────────────────────────────────────────────────
   4. BG
   ───────────────────────────────────────────────────────────────────── */
(function(){
"use strict";
window.__bgState = window.Store.get(window.KBLX_KEYS.bg, {}) || {};

window.__bgApply = function(){
  const layer = document.getElementById("bg-fake-custom"); if(!layer) return;
  const s = window.__bgState || {};
  if(s.image){
    layer.style.backgroundImage = `url('${s.image}')`;
    layer.style.opacity = ((s.opacity ?? 15)/100).toString();
    layer.style.mixBlendMode = s.blend || "overlay";
  } else {
    layer.style.backgroundImage = "";
    layer.style.opacity = "0";
  }
  const st = document.getElementById("bgStatusText");
  if(st) st.textContent = s.image ? "imagem carregada" : "Nenhum";
  const op = document.getElementById("bgOpacity"); if(op) op.value = s.opacity ?? 15;
  const opv = document.getElementById("val-op"); if(opv) opv.textContent = (s.opacity ?? 15) + "%";
  const bl = document.getElementById("bgBlend"); if(bl) bl.value = s.blend || "overlay";
  const panel = document.getElementById("bgThumbPanel");
  if(panel && typeof window.di_getBgImages === "function"){
    const list = window.di_getBgImages();
    panel.innerHTML = "";
    if(!list.length){
      panel.innerHTML = '<div style="grid-column:1/-1;color:var(--text-muted);text-align:center;font-size:.85rem">Nenhum background salvo.</div>';
    } else {
      list.forEach(bg => {
        const w = document.createElement("div");
        w.className = "di-bg-thumb";
        w.style.cssText = "position:relative;height:70px;border-radius:8px;cursor:pointer;background-size:cover;background-position:center;overflow:hidden;transition:transform .15s ease";
        w.style.backgroundImage = `url("${bg.data}")`;
        w.style.border = bg.active ? "2px solid var(--primary)" : "1px solid rgba(255,255,255,.12)";
        w.title = bg.name || bg.id;
        const rm = document.createElement("button");
        rm.textContent = "✕"; rm.title = "Remover";
        rm.style.cssText = "position:absolute;top:6px;right:6px;background:rgba(0,0,0,.6);border:none;color:#fff;font-size:11px;border-radius:6px;padding:4px 6px;cursor:pointer";
        rm.onclick = e => { e.stopPropagation(); window.di_removeBg(bg.id); };
        w.onclick = () => window.di_setActiveBg(bg.id);
        w.appendChild(rm);
        panel.appendChild(w);
      });
    }
  }
};

window.updateBgAttr = function(attr, val){
  window.__bgState = window.__bgState || {};
  window.__bgState[attr] = val;
  window.__bgApply();
  window.KBLX_SAVE?.();
};

document.getElementById("bgUploadInput")?.addEventListener("change", async e => {
  const f = e.target.files[0]; if(!f) return;
  const reader = new FileReader();
  reader.onload = ev => {
    window.__bgState = window.__bgState || {};
    window.__bgState.image = ev.target.result;
    window.__bgApply();
    window.KBLX_TOAST?.("Background aplicado ✓");
    window.KBLX_SAVE?.();
    if(typeof window.di_getBgImages === "function" && typeof window.di_saveBgImages === "function"){
      const list = window.di_getBgImages().map(b => ({ ...b, active:false }));
      list.unshift({ id:"bg_"+Date.now(), name:f.name || "bg", data:ev.target.result, active:true });
      window.di_saveBgImages(list);
      window.__bgApply();
    }
  };
  reader.readAsDataURL(f);
});
})();

(function(){
"use strict";
if(window.diBgOverrideInitialized) return;
window.diBgOverrideInitialized = true;

window.di_getBgImages = function(){
  try{ const r = localStorage.getItem("di_bgImages"); return r ? JSON.parse(r) : []; }
  catch(_){ return []; }
};
window.di_saveBgImages = function(list){
  try{ localStorage.setItem("di_bgImages", JSON.stringify(list || [])); }catch(_){}
};
(function(){
  const single = localStorage.getItem("di_bgImage"), arr = window.di_getBgImages();
  if(single && !arr.length){
    window.di_saveBgImages([{ id:"bg_"+Date.now(), name:"migrated", data:single, active:true }]);
    localStorage.removeItem("di_bgImage");
  }
})();
window.di_applyBackground = function(dataUrl){
  window.__bgState = window.__bgState || {};
  window.__bgState.image = dataUrl || null;
  window.__bgApply();
  window.KBLX_SAVE?.();
};
window.di_setActiveBg = function(id){
  const list = window.di_getBgImages();
  const next = list.map(b => ({ ...b, active: b.id === id }));
  window.di_saveBgImages(next);
  const active = next.find(b => b.active);
  window.di_applyBackground(active ? active.data : null);
};
window.di_removeBg = function(id){
  let list = window.di_getBgImages().filter(b => b.id !== id);
  if(!list.some(b => b.active) && list[0]){ list[0].active = true; window.di_applyBackground(list[0].data); }
  if(!list.length) window.di_applyBackground(null);
  window.di_saveBgImages(list);
  window.__bgApply();
};
window.di_renderBgPanel = function(){ window.__bgApply(); };
if(!window.__bgState.image){
  const act = window.di_getBgImages().find(b => b.active);
  if(act){ window.__bgState.image = act.data; window.__bgApply(); }
}
})();

/* ─────────────────────────────────────────────────────────────────────
   5. COCKPIT
   ───────────────────────────────────────────────────────────────────── */
(function(){
"use strict";
window.toggleDrawer = function(id){
  const dr = document.getElementById(id || "drawerProfile");
  const ov = document.getElementById("drawerOverlay");
  if(!dr) return;
  const open = dr.classList.toggle("open");
  ov?.classList.toggle("open", open);
  dr.setAttribute("aria-hidden", open ? "false" : "true");
};
function setSolarMode(mode, source){
  ["mode-night","mode-day","mode-sunset"].forEach(m => document.body.classList.remove(m));
  document.body.classList.add("mode-" + mode);
  const st = document.getElementById("statusSolarMode");
  if(st) st.textContent = mode.toUpperCase() + (source === "auto" ? " (AUTO)" : " (MAN)");
  window.KBLX_SAVE?.();
}
function cycleSolar(){
  const modes = ["mode-night","mode-day","mode-sunset"];
  const cur = modes.find(m => document.body.classList.contains(m)) || "mode-night";
  const next = modes[(modes.indexOf(cur) + 1) % modes.length];
  setSolarMode(next.replace("mode-",""), "manual");
}
function autoSolar(){
  const h = new Date().getHours();
  const mode = (h >= 6 && h < 12) ? "day" : (h >= 12 && h < 18) ? "sunset" : "night";
  setSolarMode(mode, "auto");
  window.KBLX_TOAST?.("Auto 🕒 " + mode);
}
window.__setSolarMode = setSolarMode;
document.getElementById("btnCycleSolar")?.addEventListener("click", cycleSolar);
document.getElementById("themeToggle")?.addEventListener("click", cycleSolar);
document.getElementById("btnAutoSolar")?.addEventListener("click", autoSolar);
document.getElementById("inputUserId")?.addEventListener("input", () => window.KBLX_SAVE?.());
document.getElementById("inputModel")?.addEventListener("input", () => window.KBLX_SAVE?.());
document.getElementById("menuBtn")?.addEventListener("click", () => window.toggleDrawer("drawerProfile"));
document.getElementById("orbToggle")?.addEventListener("click", () => window.toggleDrawer("drawerProfile"));
document.getElementById("notifBtn")?.addEventListener("click", () => window.KBLX_TOAST?.("Sem notificações"));
document.getElementById("blClose")?.addEventListener("click", () => document.getElementById("baulite-container")?.classList.remove("open"));
window.__bgApply();
})();

/* ─────────────────────────────────────────────────────────────────────
   6. TABS (TabStore + LinkHistory + drag-merge)
   ───────────────────────────────────────────────────────────────────── */
(function(){
"use strict";
if(window.__KBLX_TABS_UNIFIED__) return;
window.__KBLX_TABS_UNIFIED__ = true;
const $  = (s,r=document)=>r.querySelector(s);
const $$ = (s,r=document)=>[...r.querySelectorAll(s)];
const uid = (p="id") => p+"_"+Date.now().toString(36)+Math.random().toString(36).slice(2,7);
const now = () => Date.now();

const TabStore = {
  _mem: new Map(),
  _read(){ try{ return JSON.parse(localStorage.getItem(window.KBLX_KEYS.tabs)) || {}; }catch(_){ return {}; } },
  _write(o){ try{ localStorage.setItem(window.KBLX_KEYS.tabs, JSON.stringify(o)); }catch(_){} },
  get(id){
    if(!id) return null;
    if(this._mem.has(id)) return this._mem.get(id);
    const disk = this._read()[id];
    if(disk){ this._mem.set(id, disk); return disk; }
    return null;
  },
  set(id, d){
    if(!id) return;
    this._mem.set(id, d);
    const all = this._read(); all[id] = d; this._write(all);
    document.dispatchEvent(new CustomEvent("tabstore:changed", { detail:{ winId:id, data:d } }));
  },
  ensure(id, seed){
    let d = this.get(id); if(d) return d;
    const u = seed || "about:blank";
    const tab = { id:uid("tab"), url:u, title:u.replace(/^https?:\/\//,"").split("/")[0] || "Nova Aba", fav:false, createdAt:now() };
    d = { tabs:[tab], activeId:tab.id };
    this.set(id, d); return d;
  },
  addTab(id, url, opts={}){
    const d = this.ensure(id);
    const u = url || "about:blank";
    const t = { id:uid("tab"), url:u, title:opts.title || u.replace(/^https?:\/\//,"").split("/")[0] || "Nova Aba", fav:!!opts.fav, createdAt:now() };
    d.tabs.push(t); d.activeId = t.id; this.set(id, d);
    LinkHistory.record(u, t.title, id);
    return t;
  },
  removeTab(id, tabId){
    const d = this.get(id); if(!d || d.tabs.length <= 1) return null;
    const i = d.tabs.findIndex(t => t.id === tabId); if(i < 0) return null;
    const [r] = d.tabs.splice(i,1);
    if(d.activeId === tabId) d.activeId = d.tabs[Math.min(i, d.tabs.length-1)].id;
    this.set(id, d); return r;
  },
  detachTab(id, tabId){
    const d = this.get(id); if(!d || d.tabs.length <= 1) return null;
    const i = d.tabs.findIndex(t => t.id === tabId); if(i < 0) return null;
    const [t] = d.tabs.splice(i,1);
    if(d.activeId === tabId) d.activeId = d.tabs[Math.min(i, d.tabs.length-1)].id;
    this.set(id, d); return t;
  },
  attachTab(id, tab){
    const d = this.ensure(id);
    const copy = { ...tab, id:uid("tab") };
    d.tabs.push(copy); d.activeId = copy.id; this.set(id, d); return copy;
  },
  setActive(id, tabId){
    const d = this.get(id); if(!d) return;
    if(!d.tabs.some(t => t.id === tabId)) return;
    d.activeId = tabId; this.set(id, d);
  },
  updateUrl(id, tabId, url, title){
    const d = this.get(id); if(!d) return;
    const t = d.tabs.find(x => x.id === tabId); if(!t) return;
    t.url = url; if(title) t.title = title;
    this.set(id, d); LinkHistory.record(url, title || t.title, id);
  },
  dropAll(id){ this._mem.delete(id); const a = this._read(); delete a[id]; this._write(a); },
};

const LinkHistory = {
  _read(){ try{ return JSON.parse(localStorage.getItem(window.KBLX_KEYS.links)) || []; }catch(_){ return []; } },
  _write(l){ try{ localStorage.setItem(window.KBLX_KEYS.links, JSON.stringify(l.slice(-800))); }catch(_){} },
  record(url, title, sessionId){
    if(!url || url === "about:blank") return;
    const l = this._read(); const last = l[l.length-1];
    if(last && last.url === url && (now() - last.ts) < 2500) return;
    l.push({ url, title:title || url, ts:now(), sessionId:sessionId || null });
    this._write(l);
    document.dispatchEvent(new CustomEvent("link:visited", { detail:{ url, title, sessionId } }));
  },
  list(){ return this._read(); },
  clear(){ this._write([]); },
};

let dragWin = null, dragGhost = null, hoverTarget = null, dragStartPt = null;
function moveGhost(x,y){ if(dragGhost){ dragGhost.style.left = x+"px"; dragGhost.style.top = y+"px"; } }
function winUnder(x,y,exclude){
  const el = document.elementFromPoint(x,y);
  const w = el?.closest?.(".session-window");
  return (w && w !== exclude) ? w : null;
}
function startWinDrag(w, e){
  dragWin = w;
  w.classList.add("is-being-dragged");
  dragGhost = document.createElement("div");
  dragGhost.className = "session-drag-ghost";
  dragGhost.innerHTML = `<span class="sd-icon">◫</span><span>${w.dataset.sessionTitle || "session"}</span>`;
  document.body.appendChild(dragGhost);
  moveGhost(e.clientX, e.clientY);
  document.body.classList.add("session-dragging");
}
function mergeWinIntoTarget(src, dst){
  const srcId = src.dataset.sessionId, dstId = dst.dataset.sessionId;
  if(!srcId || !dstId || srcId === dstId) return;
  const srcData = TabStore.ensure(srcId, src.querySelector(".win-frame")?.src);
  const dstData = TabStore.ensure(dstId, dst.querySelector(".win-frame")?.src);
  srcData.tabs.forEach(t => {
    const copy = { ...t, id:uid("tab") };
    dstData.tabs.push(copy);
    if(copy.url) LinkHistory.record(copy.url, copy.title, dstId);
  });
  dstData.activeId = dstData.tabs[dstData.tabs.length-1].id;
  TabStore.set(dstId, dstData);
  try{ window.MXP?.removeSession?.(srcId); }catch(_){}
  TabStore.dropAll(srcId);
  window.SessionLifecycle?.close?.(srcId);
  src.remove();
  window.DualSession?.applyTabsToWindow?.(dst, dstData);
  document.dispatchEvent(new CustomEvent("session:merged", { detail:{ from:srcId, into:dstId, tabs:srcData.tabs.length } }));
  window.KBLX_TOAST?.(`${srcData.tabs.length} aba(s) absorvida(s)`);
  window.KBLX_SAVE?.();
}
function endWinDrag(e){
  if(!dragWin) return;
  const tgt = winUnder(e.clientX, e.clientY, dragWin);
  if(tgt) mergeWinIntoTarget(dragWin, tgt);
  dragWin.classList.remove("is-being-dragged");
  dragGhost?.remove(); dragGhost = null;
  hoverTarget?.classList.remove("is-merge-target"); hoverTarget = null;
  dragWin = null; dragStartPt = null;
  document.body.classList.remove("session-dragging");
}
document.addEventListener("pointerdown", e => {
  if(!e.target.closest(".win-hdr")) return;
  if(e.target.closest("button,input,.win-controls,.mxp-title")) return;
  const w = e.target.closest(".session-window"); if(!w) return;
  dragStartPt = { x:e.clientX, y:e.clientY, win:w };
}, true);
document.addEventListener("pointermove", e => {
  if(!dragStartPt && !dragWin) return;
  if(!dragWin){
    if(Math.hypot(e.clientX - dragStartPt.x, e.clientY - dragStartPt.y) > 24) startWinDrag(dragStartPt.win, e);
    return;
  }
  moveGhost(e.clientX, e.clientY);
  const t = winUnder(e.clientX, e.clientY, dragWin);
  if(t !== hoverTarget){ hoverTarget?.classList.remove("is-merge-target"); hoverTarget = t; hoverTarget?.classList.add("is-merge-target"); }
}, { passive:true });
document.addEventListener("pointerup", e => { if(dragWin) endWinDrag(e); dragStartPt = null; });
document.addEventListener("pointercancel", () => { if(dragWin) endWinDrag({ clientX:0, clientY:0 }); dragStartPt = null; });

let dragTab = null, tabGhost = null, tabStartPt = null;
function moveTabGhost(x,y){ if(tabGhost){ tabGhost.style.left = x+"px"; tabGhost.style.top = y+"px"; } }
function beginTabDrag(card, winId, tab, e){
  dragTab = { sourceWinId:winId, tabId:tab.id, tab:{ ...tab } };
  tabGhost = document.createElement("div");
  tabGhost.className = "tab-drag-ghost";
  tabGhost.textContent = tab.title || tab.url || "aba";
  document.body.appendChild(tabGhost);
  moveTabGhost(e.clientX, e.clientY);
  document.body.classList.add("tab-dragging");
  document.getElementById("tabSwitcherOverlay")?.classList.remove("open");
}
function createSessionFromTab(drag, x, y){
  const s = window.MXP?.createSession?.(drag.tab.title || "aba");
  if(!s) return;
  requestAnimationFrame(() => {
    const w = document.querySelector(`.session-window[data-session-id="${s.id}"]`);
    if(!w) return;
    w.style.position = "fixed";
    w.style.left = Math.max(10, x-160) + "px";
    w.style.top  = Math.max(60, y-30) + "px";
    w.style.zIndex = "9650";
    w.style.margin = "0";
    TabStore.detachTab(drag.sourceWinId, drag.tabId);
    TabStore.addTab(s.id, drag.tab.url, { title:drag.tab.title, fav:drag.tab.fav });
    window.DualSession?.applyTabsToWindow?.(w, TabStore.get(s.id));
    const src = document.querySelector(`.session-window[data-session-id="${drag.sourceWinId}"]`);
    if(src) window.DualSession?.applyTabsToWindow?.(src, TabStore.get(drag.sourceWinId));
    window.KBLX_TOAST?.("Session criada da aba");
    window.KBLX_SAVE?.();
  });
}
function cleanupTabDrag(){
  tabGhost?.remove(); tabGhost = null;
  dragTab = null; tabStartPt = null;
  document.body.classList.remove("tab-dragging");
}
document.addEventListener("pointerdown", e => {
  const card = e.target.closest("#tabGrid .tab-card");
  if(!card || e.target.closest(".tab-close,.tab-fav")) return;
  const tabId = card.dataset.tabId;
  let ownerWinId = null, tabObj = null;
  for(const w of $$(".session-window")){
    const id = w.dataset.sessionId;
    const d = TabStore.get(id);
    if(d && d.tabs.some(t => t.id === tabId)){ ownerWinId = id; tabObj = d.tabs.find(t => t.id === tabId); break; }
  }
  if(!ownerWinId || !tabObj) return;
  tabStartPt = { x:e.clientX, y:e.clientY, card, ownerWinId, tabObj };
}, true);
document.addEventListener("pointermove", e => {
  if(dragTab){ moveTabGhost(e.clientX, e.clientY); return; }
  if(!tabStartPt) return;
  if(Math.hypot(e.clientX - tabStartPt.x, e.clientY - tabStartPt.y) > 18) beginTabDrag(tabStartPt.card, tabStartPt.ownerWinId, tabStartPt.tabObj, e);
}, { passive:true });
document.addEventListener("pointerup", e => {
  if(!dragTab) return;
  if(!e.target.closest?.("#tabSwitcherOverlay")) createSessionFromTab(dragTab, e.clientX, e.clientY);
  cleanupTabDrag();
});
document.addEventListener("pointercancel", cleanupTabDrag);

function hookFrame(f){
  if(!f || f.__linkTracked) return;
  f.__linkTracked = true;
  f.addEventListener("load", () => {
    const w = f.closest(".session-window");
    const id = w?.dataset.sessionId; if(!id) return;
    const d = TabStore.get(id); if(!d) return;
    const a = d.tabs.find(t => t.id === d.activeId);
    if(a){
      a.url = f.src;
      try{ a.title = f.contentDocument?.title || a.title; }catch(_){}
      TabStore.set(id, d);
      LinkHistory.record(f.src, a.title, id);
    }
  });
}
new MutationObserver(muts => {
  for(const m of muts){
    for(const n of m.addedNodes || []){
      if(n.nodeType !== 1) continue;
      if(n.matches?.(".win-frame")) hookFrame(n);
      n.querySelectorAll?.(".win-frame").forEach(hookFrame);
    }
  }
}).observe(document.body, { childList:true, subtree:true });
$$(".win-frame").forEach(hookFrame);

function showLinkPanel(){
  let p = document.getElementById("kblx-link-panel");
  if(!p){
    p = document.createElement("div");
    p.id = "kblx-link-panel";
    p.style.cssText = "position:fixed;inset:8vh 15vw;background:rgba(8,10,22,.97);border:1px solid rgba(120,200,255,.28);border-radius:14px;z-index:99999;padding:18px;overflow:auto;color:#cfe;font-family:ui-monospace,monospace;box-shadow:0 24px 80px rgba(0,0,0,.7);backdrop-filter:blur(8px)";
    document.body.appendChild(p);
    p.addEventListener("click", e => { if(e.target === p) p.remove(); });
  }
  const links = LinkHistory.list().slice(-150).reverse();
  p.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;gap:12px">
      <b style="letter-spacing:2px">HISTÓRICO · ${links.length}</b>
      <div style="display:flex;gap:8px">
        <button data-act="links:clear" style="background:none;border:1px solid #445;color:#9ab;border-radius:6px;padding:4px 10px;cursor:pointer">LIMPAR</button>
        <button data-act="links:close" style="background:none;border:1px solid #445;color:#9ab;border-radius:6px;padding:4px 10px;cursor:pointer">✕</button>
      </div>
    </div>
    ${links.length ? links.map(l => `
      <div style="padding:8px 10px;border-bottom:1px solid rgba(120,200,255,.08);display:flex;justify-content:space-between;gap:12px;align-items:center">
        <a href="#" data-act="links:open" data-url="${l.url.replace(/"/g,"&quot;")}" style="color:#7cf;text-decoration:none;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;flex:1">${l.title || l.url}</a>
        <span style="color:#456;font-size:11px">${new Date(l.ts).toLocaleTimeString()}</span>
        <button data-act="links:remove" data-url="${l.url.replace(/"/g,"&quot;")}" style="background:none;border:none;color:#655;cursor:pointer;font-size:14px">×</button>
      </div>`).join("") : '<div style="color:#456;text-align:center;padding:40px">vazio</div>'}`;
  p.querySelector('[data-act="links:close"]').onclick = () => p.remove();
  p.querySelector('[data-act="links:clear"]').onclick = () => { LinkHistory.clear(); showLinkPanel(); };
  p.querySelectorAll('[data-act="links:open"]').forEach(a => {
    a.onclick = ev => {
      ev.preventDefault();
      const w = window.DualSession?.activeWindow || $$(".session-window").find(x => !x.classList.contains("minimized"));
      if(w){
        TabStore.addTab(w.dataset.sessionId, a.dataset.url);
        window.DualSession?.applyTabsToWindow?.(w, TabStore.get(w.dataset.sessionId));
      } else {
        const s = window.MXP?.createSession?.(a.dataset.url.split("/").pop() || "link");
        if(s) TabStore.addTab(s.id, a.dataset.url);
      }
      p.remove();
    };
  });
  p.querySelectorAll('[data-act="links:remove"]').forEach(b => {
    b.onclick = () => {
      const list = LinkHistory.list().filter(x => x.url !== b.dataset.url);
      localStorage.setItem(window.KBLX_KEYS.links, JSON.stringify(list));
      showLinkPanel();
    };
  });
}
document.addEventListener("keydown", e => {
  if((e.ctrlKey || e.metaKey) && e.key === "k"){ e.preventDefault(); showLinkPanel(); }
});

window.TabStore = TabStore;
window.LinkHistory = LinkHistory;
window.showLinkHistory = showLinkPanel;
window.KBLX_TABS = { store:TabStore, links:LinkHistory, merge:mergeWinIntoTarget, showHistory:showLinkPanel };
})();

/* ─────────────────────────────────────────────────────────────────────
   7. DOCK
   ───────────────────────────────────────────────────────────────────── */
(function(){
"use strict";
function readDock(){ return window.Store.get(window.KBLX_KEYS.dock, {}) || {}; }
function writeDock(m){ window.Store.set(window.KBLX_KEYS.dock, m); }

function ensureSessionId(el){
  if(!el.dataset.sessionId) el.dataset.sessionId = el.id || ("sess-" + Math.random().toString(36).slice(2,9));
  return el.dataset.sessionId;
}
function createBubble(id, title){
  if(!id) return null;
  if(document.querySelector(`.dock-bubble[data-session-id="${id}"]`)) return null;
  const b = document.createElement("button");
  b.type = "button";
  b.className = "dock-bubble";
  b.dataset.sessionId = id;
  b.textContent = "۞";
  b.title = title || id;
  b.addEventListener("click", () => {
    const el = document.querySelector(`[data-session-id="${id}"]:not(.dock-bubble)`);
    if(el) el.classList.remove("minimized");
    if(window.SessionLifecycle?.getState?.(id) === "suspended") window.SessionLifecycle.restore(id);
    const s = window.MXP?.state?.sessions?.find(x => x.id === id);
    if(s){ s.minimized = false; window.MXP?.save?.(); }
    document.dispatchEvent(new CustomEvent("kblx:session-restored", { detail:{ id, el } }));
    const map = readDock(); delete map[id]; writeDock(map);
    b.remove();
    window.KBLX_syncLooseWithDock?.();
  });
  document.getElementById("dock")?.appendChild(b);
  window.KBLX_syncLooseWithDock?.();
  return b;
}

window.KBLX_syncLooseWithDock = function(){
  const slot = document.querySelector('[data-slot="loose"]');
  const dock = document.getElementById("dock");
  if(!slot || !dock) return;
  slot.querySelectorAll('[data-dock-mirror="1"]').forEach(el => el.remove());
  dock.querySelectorAll(".dock-bubble").forEach(bubble => {
    const id = bubble.dataset.sessionId; if(!id) return;
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "mxp-btn";
    btn.dataset.dockMirror = "1";
    btn.dataset.sessionId = id;
    btn.title = "Focar: " + (bubble.title || id);
    btn.innerHTML = `<span class="mxp-icon">◉</span><span class="mxp-label">${bubble.title || id}</span>`;
    btn.addEventListener("click", () => bubble.click());
    slot.appendChild(btn);
  });
};

window.KBLX_minimizeToDock = function(el, opts){
  opts = opts || {};
  if(!el || el.classList.contains("minimized")) return null;
  const id = ensureSessionId(el);
  const title = opts.title || el.dataset?.sessionTitle
             || el.querySelector?.(".mxp-title")?.textContent
             || el.querySelector?.('[data-part="title"]')?.textContent
             || id;
  el.classList.add("minimized");
  opts.onMinimize?.();
  const map = readDock(); map[id] = { title, t:Date.now() }; writeDock(map);
  const bubble = createBubble(id, title);
  if(bubble && typeof opts.onRestore === "function") bubble._onRestore = opts.onRestore;
  return bubble;
};

window.KBLX_restoreDockOnBoot = function(){
  const map = readDock();
  Object.keys(map).forEach(id => {
    const el = document.querySelector(`[data-session-id="${id}"]:not(.dock-bubble)`);
    if(el) el.classList.add("minimized");
    createBubble(id, map[id]?.title);
  });
  document.querySelectorAll("[data-session-id].minimized").forEach(el => {
    const id = el.dataset.sessionId; if(!id || map[id]) return;
    const title = el.dataset.sessionTitle
               || el.querySelector?.(".mxp-title")?.textContent
               || el.querySelector?.('[data-part="title"]')?.textContent
               || id;
    const m = readDock(); m[id] = { title, t:Date.now() }; writeDock(m);
    createBubble(id, title);
  });
  window.KBLX_syncLooseWithDock?.();
};
})();

/* ─────────────────────────────────────────────────────────────────────
   8. SESSION ENGINE
   ───────────────────────────────────────────────────────────────────── */
(function(){
"use strict";
const $$ = (s,r=document)=>[...r.querySelectorAll(s)];
const $ = (s,r=document)=>r.querySelector(s);

const SessionState = { CREATED:"created", LOADING:"loading", ACTIVE:"active", IDLE:"idle",
                       SUSPENDED:"suspended", EVICTED:"evicted", CLOSED:"closed" };
const Tier = { FREE:"free", PRO:"pro", PREMIUM:"premium" };
const TIER_LIMITS = {
  [Tier.FREE]:    { maxActive:2, maxSuspended:3, maxSessions:5 },
  [Tier.PRO]:     { maxActive:4, maxSuspended:6, maxSessions:12 },
  [Tier.PREMIUM]: { maxActive:8, maxSuspended:12, maxSessions:30 },
};
let currentTier = Tier.FREE;
const IDLE_AFTER_MS = 45_000, SUSPEND_AFTER_IDLE_MS = 90_000;
const sessionMeta = new Map();
const runtimeStore = new Map();
const zStack = [];
let counter = 1;

const limits = () => TIER_LIMITS[currentTier];
function countByState(...states){ let n = 0; sessionMeta.forEach(m => { if(states.includes(m.state)) n++; }); return n; }
function countAll(){
  return countByState(SessionState.CREATED, SessionState.LOADING, SessionState.ACTIVE,
                      SessionState.IDLE, SessionState.SUSPENDED, SessionState.EVICTED);
}
function getWin(id){ return document.getElementById(id); }

function ensureMeta(id){
  let m = sessionMeta.get(id);
  if(!m){
    m = { id, state:SessionState.CREATED, createdAt:Date.now(), lastActive:Date.now(),
          pinned:false, hasUnsavedWork:false, mediaPlaying:false,
          suspendCount:0, restoreCount:0, lastSuspendedAt:null, lastRestoredAt:null };
    sessionMeta.set(id, m);
  }
  return m;
}
function updateBadge(w){
  if(!w) return;
  const b = w.querySelector(".state-badge"); if(!b) return;
  const s = w.dataset.state || "created";
  const colors = { active:"#39ffb6", loading:"#00e5ff", idle:"#ffd700",
                   suspended:"#ff6b6b", evicted:"#b36bff", created:"#aaa", closed:"#555" };
  const labels = { active:"ATIVO", loading:"CARREGANDO", idle:"OCIOSO",
                   suspended:"SUSPENSO", evicted:"LIBERADO", created:"CRIADO", closed:"FECHADO" };
  const c = colors[s] || "#aaa";
  b.textContent = "●"; b.title = labels[s] || s; b.style.color = c; b.style.background = c + "33";
}
function setState(id, state){
  const w = getWin(id), m = ensureMeta(id);
  m.state = state;
  if(state === SessionState.ACTIVE || state === SessionState.LOADING) m.lastActive = Date.now();
  if(state === SessionState.SUSPENDED){ m.lastSuspendedAt = Date.now(); m.suspendCount++; }
  if(state === SessionState.CLOSED) sessionMeta.delete(id);
  if(w){
    w.dataset.state = state;
    w.classList.remove("state-created","state-loading","state-active","state-idle","state-suspended","state-evicted","state-closed");
    w.classList.add("state-" + state);
    w.dataset.suspended = (state === SessionState.SUSPENDED || state === SessionState.EVICTED) ? "true" : "false";
    updateBadge(w);
  }
  window.dispatchEvent(new CustomEvent("session:state-change", { detail:{ id, state, meta:{ ...m } } }));
}
function touch(id){
  const m = sessionMeta.get(id); if(!m) return;
  m.lastActive = Date.now();
  if(m.state === SessionState.IDLE) setState(id, SessionState.ACTIVE);
}

function canSuspend(id){
  const w = getWin(id), m = sessionMeta.get(id); if(!w || !m) return false;
  if(m.state !== SessionState.ACTIVE && m.state !== SessionState.IDLE) return false;
  if(w.classList.contains("maximized")) return false;
  if(m.pinned || w.dataset.pinned === "true") return false;
  return true;
}
function canEvict(id){
  const m = sessionMeta.get(id); if(!m || m.state !== SessionState.SUSPENDED) return false;
  if(m.pinned || m.hasUnsavedWork) return false;
  return true;
}
function suspend(id){
  const w = getWin(id);
  if(!w || !canSuspend(id)) return false;
  const m = ensureMeta(id);
  if(m.state === SessionState.SUSPENDED) return true;
  const f = w.querySelector(".win-frame");
  const d = window.TabStore?.get(id);
  const a = d?.tabs?.find(t => t.id === d.activeId);
  const url = a?.url || f?.src || "https://www.infodose.com.br/splash";
  runtimeStore.set(id, { url, savedAt:Date.now() });
  f?.remove();
  w.classList.add("suspended");
  setState(id, SessionState.SUSPENDED);
  syncShell();
  return true;
}
function restore(id){
  const w = getWin(id); if(!w) return false;
  const m = sessionMeta.get(id); if(!m) return false;
  if(m.state !== SessionState.SUSPENDED && m.state !== SessionState.EVICTED) return true;
  enforceActive(id);
  const rt = runtimeStore.get(id);
  const d = window.TabStore?.get(id);
  const a = d?.tabs?.find(t => t.id === d.activeId) || d?.tabs?.[0];
  const url = rt?.url || a?.url || "https://www.infodose.com.br/splash";
  setState(id, SessionState.LOADING);
  const f = document.createElement("iframe");
  f.className = "win-frame";
  f.dataset.runtime = "nav";
  f.setAttribute("allow", "autoplay; fullscreen; clipboard-read; clipboard-write; picture-in-picture");
  f.setAttribute("allowfullscreen", "");
  f.loading = "lazy";
  f.src = url;
  f.addEventListener("load", () => {
    const mm = sessionMeta.get(id);
    if(mm){ mm.lastRestoredAt = Date.now(); mm.restoreCount++; }
    setState(id, SessionState.ACTIVE);
    w.classList.remove("suspended");
    wireFrame(w, f);
  }, { once:true });
  w.appendChild(f);
  runtimeStore.delete(id);
  w.classList.remove("suspended");
  syncShell();
  return true;
}
function evict(id){
  if(!canEvict(id)) return false;
  getWin(id)?.querySelector(".win-frame")?.remove();
  setState(id, SessionState.EVICTED);
  syncShell();
  return true;
}
function closeSession(id){
  setState(id, SessionState.CLOSED);
  document.getElementById("dock-" + id)?.remove();
  document.querySelector(`.dock-bubble[data-session-id="${id}"]`)?.remove();
  getWin(id)?.remove();
  runtimeStore.delete(id);
  window.TabStore?.dropAll?.(id);
  syncShell();
}
function leastActive(exclude){
  let c = null, oldest = Infinity;
  sessionMeta.forEach((m, id) => {
    if(id === exclude || !canSuspend(id)) return;
    if((m.lastActive || 0) < oldest){ oldest = m.lastActive || 0; c = id; }
  });
  return c;
}
function enforceActive(exclude){
  const max = limits().maxActive;
  let guard = 0;
  while(countByState(SessionState.ACTIVE, SessionState.LOADING, SessionState.IDLE) > max && guard++ < 100){
    const v = leastActive(exclude);
    if(!v) break;
    suspend(v);
  }
}
function enforceSuspended(){
  const max = limits().maxSuspended;
  let guard = 0;
  while(countByState(SessionState.SUSPENDED) > max && guard++ < 100){
    let candidate = null, score = -Infinity;
    sessionMeta.forEach((m, id) => {
      if(!canEvict(id)) return;
      let s = Date.now() - (m.lastActive || 0);
      if(m.mediaPlaying) s -= 2e10;
      if(s > score){ score = s; candidate = id; }
    });
    if(!candidate) break;
    evict(candidate);
  }
}
function enforceTotal(){
  const max = limits().maxSessions;
  let guard = 0;
  while(countAll() > max && guard++ < 100){
    let candidate = null, score = -Infinity;
    sessionMeta.forEach((m, id) => {
      if(!canEvict(id)) return;
      let s = Date.now() - (m.lastActive || 0);
      if(s > score){ score = s; candidate = id; }
    });
    if(!candidate) break;
    evict(candidate);
  }
}
function bringToFront(w){
  if(!w) return;
  const i = zStack.indexOf(w); if(i !== -1) zStack.splice(i,1);
  zStack.push(w);
  zStack.forEach((x, idx) => { if(!x.classList.contains("maximized")) x.style.zIndex = String(1000 + idx*10); });
  touch(w.id);
  syncGlobalUrl();
}
function activeWin(){ return zStack[zStack.length-1] || null; }

function syncGlobalUrl(){
  const inp = document.getElementById("urlInputNav"); if(!inp) return;
  const w = activeWin(); if(!w){ inp.value = ""; return; }
  const d = window.TabStore?.get(w.dataset.sessionId);
  const a = d?.tabs?.find(t => t.id === d.activeId);
  inp.value = a?.url || "";
}
function syncShell(){
  const max = !!document.querySelector(".session-window.maximized:not(.minimized)");
  document.body.classList.toggle("has-maximized", max);
  document.body.classList.toggle("ui-immersive", max);
}
function applyTabsToWindow(w, data){
  if(!w || !data) return;
  const f = w.querySelector(".win-frame");
  const a = data.tabs.find(t => t.id === data.activeId) || data.tabs[0];
  if(f && a && f.src !== a.url) f.src = a.url;
  const c = w.querySelector(".tab-counter"); if(c) c.textContent = data.tabs.length;
}
function escapeHtml(s){
  return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
}

function createSessionWindow({ name="//", src="https://www.infodose.com.br/splash", id=null, x=null, y=null, winW=null, winH=null } = {}){
  const host = document.body.dataset.sessionHost === "stack" ? "stack" : "float";
  const hostEl = host === "stack" ? document.getElementById("stackWrap") : document.getElementById("sessionsLayer");
  if(!hostEl){ console.warn("[Session] host não encontrado:", host); return null; }
  if(!id && countAll() >= limits().maxSessions){
    enforceTotal();
    if(countAll() >= limits().maxSessions){ window.KBLX_TOAST?.("limite de sessões"); return null; }
  }
  const sid = id || ("session-" + Date.now() + "-" + (counter++));
  if(id){
    const n = parseInt(String(id).split("-").pop(), 10);
    if(!Number.isNaN(n) && n >= counter) counter = n + 1;
  }
  const w = document.createElement("section");
  w.className = "session-window";
  w.id = sid;
  w.dataset.sessionId = sid;
  w.dataset.sessionTitle = name;
  w.dataset.state = SessionState.CREATED;
  w.dataset.suspended = "false";
  w.innerHTML = `
    <div class="win-hdr" data-part="header">
      <div class="win-controls">
        <button type="button" data-action="collapse" title="Colapsar">−</button>
        <button type="button" data-action="tab-switcher" class="tab-counter" title="Abas">1</button>
        <button type="button" data-action="maximize" title="Maximizar">⛶</button>
        <button type="button" data-action="minimize" title="Minimizar">۞</button>
        <button type="button" data-action="close" title="Fechar">×</button>
      </div>
      <span class="mxp-title" data-part="title" title="Toque 2× para renomear">${escapeHtml(name)}</span>
      <span class="state-badge">●</span>
    </div>
    <div class="win-body">
      <iframe class="win-frame" data-runtime="nav" src="${escapeHtml(src)}"
        allow="autoplay; fullscreen; clipboard-read; clipboard-write; picture-in-picture"
        allowfullscreen loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
    </div>
    <div class="resize-handle resize-y"></div>
    <div class="resize-handle resize-x"></div>
    <div class="resize-handle resize-corner"></div>`;
  if(x != null && y != null){
    w.style.position = "fixed"; w.style.left = x + "px"; w.style.top = y + "px"; w.style.margin = "0";
  }
  if(winW != null) w.style.width = winW + "px";
  if(winH != null){ w.style.height = winH + "px"; w.style.maxHeight = "none"; }
  hostEl.appendChild(w);
  ensureMeta(sid);
  setState(sid, SessionState.LOADING);
  window.TabStore?.ensure(sid, src);
  wireSession(w);
  bringToFront(w);
  w.querySelector(".win-frame")?.addEventListener("load", () => {
    if(sessionMeta.get(sid)?.state === SessionState.LOADING) setState(sid, SessionState.ACTIVE);
  }, { once:true });
  enforceActive(sid);
  return sid;
}

function rehydrateSessions(){
  const list = window.MXP?.state?.sessions || [];
  list.forEach(s => {
    if(!s?.id || document.getElementById(s.id)) return;
    const tabData = window.TabStore?.get(s.id);
    const activeTab = tabData?.tabs?.find(t => t.id === tabData.activeId);
    const src = activeTab?.url || s.url || "https://www.infodose.com.br/splash";
    createSessionWindow({ name:s.name || "SESSION", src, id:s.id, x:s.x, y:s.y, winW:s.w, winH:s.h });
    const w = document.getElementById(s.id);
    if(w && tabData) applyTabsToWindow(w, tabData);
  });
}

function handleAction(w, action){
  switch(action){
    case "collapse": w.classList.toggle("collapsed"); break;
    case "maximize":
      w.classList.toggle("maximized");
      if(w.classList.contains("maximized")) w.style.zIndex = "94000";
      syncShell();
      break;
    case "minimize":
      window.KBLX_minimizeToDock(w, { title:w.dataset.sessionTitle, onMinimize:() => suspend(w.id) });
      break;
    case "tab-switcher": openTabSwitcher(w); break;
    case "close":
      if(!confirm("Fechar session?")) return;
      closeSession(w.id);
      window.MXP?.removeSession?.(w.id);
      break;
  }
}

function attachDrag(w){
  const h = w.querySelector('[data-part="header"]'); if(!h) return;
  let d = null;
  h.addEventListener("pointerdown", e => {
    if(e.target.closest("button,input,.win-controls,.mxp-title")) return;
    const r = w.getBoundingClientRect();
    d = { id:e.pointerId, sx:e.clientX, sy:e.clientY, ox:r.left, oy:r.top, moved:false };
    try{ h.setPointerCapture(e.pointerId); }catch(_){}
  });
  h.addEventListener("pointermove", e => {
    if(!d || d.id !== e.pointerId) return;
    const dx = e.clientX - d.sx, dy = e.clientY - d.sy;
    if(!d.moved && Math.hypot(dx, dy) < 6) return;
    d.moved = true;
    w.style.position = "fixed";
    w.style.left = (d.ox + dx) + "px";
    w.style.top  = (d.oy + dy) + "px";
    w.style.margin = "0";
    w.style.zIndex = "9650";
    w.classList.add("dragging");
  });
  const end = e => {
    if(!d || (e && d.id !== e.pointerId)) return;
    w.classList.remove("dragging");
    if(d.moved){
      const s = window.MXP?.state?.sessions?.find(x => x.id === w.id);
      if(s){ const r = w.getBoundingClientRect(); s.x = r.left; s.y = r.top; window.MXP?.save?.(); }
    }
    d = null;
  };
  h.addEventListener("pointerup", end);
  h.addEventListener("pointercancel", end);
}

function attachResize(w){
  if(w.dataset.resizeReady === "1") return;
  w.dataset.resizeReady = "1";
  const bind = (handle, mode) => {
    if(!handle) return;
    let r = null;
    handle.addEventListener("pointerdown", e => {
      if(w.classList.contains("maximized")) return;
      e.preventDefault(); e.stopPropagation();
      const rect = w.getBoundingClientRect();
      if(getComputedStyle(w).position !== "fixed"){
        w.style.position = "fixed";
        w.style.left = rect.left + "px"; w.style.top = rect.top + "px";
        w.style.margin = "0"; w.style.zIndex = "9650";
      }
      w.style.width = rect.width + "px"; w.style.height = rect.height + "px";
      w.style.maxHeight = "none";
      r = { id:e.pointerId, sx:e.clientX, sy:e.clientY, w:rect.width, h:rect.height };
      try{ handle.setPointerCapture(e.pointerId); }catch(_){}
    });
    handle.addEventListener("pointermove", e => {
      if(!r || r.id !== e.pointerId) return;
      const dx = e.clientX - r.sx, dy = e.clientY - r.sy;
      if(mode !== "x") w.style.height = Math.max(180, r.h + dy) + "px";
      if(mode !== "y") w.style.width  = Math.max(220, r.w + dx) + "px";
    });
    const end = e => {
      if(!r || (e && r.id !== e.pointerId)) return;
      const s = window.MXP?.state?.sessions?.find(x => x.id === w.id);
      if(s){ const rr = w.getBoundingClientRect(); s.w = rr.width; s.h = rr.height; window.MXP?.save?.(); }
      r = null;
    };
    handle.addEventListener("pointerup", end);
    handle.addEventListener("pointercancel", end);
  };
  bind(w.querySelector(".resize-y"), "y");
  bind(w.querySelector(".resize-x"), "x");
  bind(w.querySelector(".resize-corner"), "corner");
}

function wireFrame(w, f){
  if(!f || f.dataset.ifsWired === "1") return;
  f.dataset.ifsWired = "1";
  f.addEventListener("pointerdown", () => { touch(w.id); bringToFront(w); }, { passive:true });
  f.addEventListener("load", () => {
    try {
      const d = window.TabStore?.get(w.dataset.sessionId);
      const a = d?.tabs?.find(t => t.id === d.activeId);
      if(a){ a.title = f.contentDocument?.title || a.title; window.TabStore.updateUrl(w.dataset.sessionId, a.id, f.src, a.title); }
    } catch(_){}
  });
}

function wireSession(w){
  if(!w || w.dataset.wired === "1") return;
  w.dataset.wired = "1";
  ensureMeta(w.id);
  w.addEventListener("pointerdown", () => {
    if(w.dataset.suspended === "true") restore(w.id);
    touch(w.id);
  }, { passive:true });

  $(".win-hdr", w)?.addEventListener("click", e => {
    if(e.target.closest(".win-controls") || e.target.closest("button") || e.target.closest("input")) return;
    bringToFront(w);
    const lastTap = Number(w.dataset.lastTap || 0);
    const nowT = Date.now();
    if(nowT - lastTap < 300){
      w.classList.toggle("maximized");
      if(w.classList.contains("maximized")) w.style.zIndex = "94000";
      syncShell();
      w.dataset.lastTap = 0;
    } else {
      w.dataset.lastTap = nowT;
      setTimeout(() => { if(Number(w.dataset.lastTap) === nowT) w.classList.toggle("peeked"); }, 300);
    }
  });

  $(".win-controls", w)?.addEventListener("click", e => {
    e.preventDefault(); e.stopPropagation();
    const btn = e.target.closest("button"); if(!btn) return;
    handleAction(w, btn.dataset.action);
  });

  const titleEl = $('[data-part="title"]', w);
  let tLast = 0;
  titleEl?.addEventListener("click", e => {
    e.stopPropagation();
    const nowT = Date.now();
    if(nowT - tLast < 380){
      const novo = prompt("Nome da session:", w.dataset.sessionTitle);
      if(novo && novo.trim()){
        w.dataset.sessionTitle = novo.trim();
        titleEl.textContent = novo.trim();
        window.MXP?.save?.();
      }
      tLast = 0;
    } else tLast = nowT;
  });

  attachDrag(w);
  attachResize(w);

  const f = w.querySelector(".win-frame");
  if(f) wireFrame(w, f);

  updateBadge(w);
}

let switcherWin = null;
function openTabSwitcher(w){
  switcherWin = w;
  const ov = document.getElementById("tabSwitcherOverlay"); if(!ov) return;
  const title = document.getElementById("tabSwitcherTitle");
  if(title) title.textContent = "Abas — " + (w.dataset.sessionTitle || "janela");
  renderTabSwitcher(w);
  ov.classList.add("open");
  ov.onclick = e => { if(e.target === ov) closeTabSwitcher(); };
}
function closeTabSwitcher(){
  document.getElementById("tabSwitcherOverlay")?.classList.remove("open");
  switcherWin = null;
}
function renderTabSwitcher(w){
  const grid = document.getElementById("tabGrid"); if(!grid) return;
  const d = window.TabStore?.get(w.dataset.sessionId);
  if(!d || !d.tabs.length){
    grid.innerHTML = '<div class="tab-empty"><div class="tab-empty-icon">◌</div><div class="tab-empty-title">Nenhuma aba</div></div>';
    return;
  }
  grid.innerHTML = "";
  d.tabs.forEach(tab => {
    const card = document.createElement("div");
    card.className = "tab-card" + (tab.id === d.activeId ? " active" : "");
    card.dataset.tabId = tab.id;
    card.innerHTML = `
      <div class="tab-title">${escapeHtml(tab.title || "Nova Aba")}</div>
      <div class="tab-url">${escapeHtml(tab.url || "")}</div>
      <button class="tab-close" title="Fechar">×</button>
      <button class="tab-fav ${tab.fav ? "active" : ""}" title="Fav">${tab.fav ? "★" : "☆"}</button>`;
    card.addEventListener("click", e => {
      if(e.target.closest(".tab-close,.tab-fav")) return;
      window.TabStore.setActive(w.dataset.sessionId, tab.id);
      applyTabsToWindow(w, window.TabStore.get(w.dataset.sessionId));
      closeTabSwitcher();
    });
    card.querySelector(".tab-close").addEventListener("click", e => {
      e.stopPropagation();
      window.TabStore.removeTab(w.dataset.sessionId, tab.id);
      applyTabsToWindow(w, window.TabStore.get(w.dataset.sessionId));
      renderTabSwitcher(w);
    });
    card.querySelector(".tab-fav").addEventListener("click", e => {
      e.stopPropagation();
      const data = window.TabStore.get(w.dataset.sessionId);
      const t = data.tabs.find(x => x.id === tab.id);
      if(t){ t.fav = !t.fav; window.TabStore.set(w.dataset.sessionId, data); renderTabSwitcher(w); }
    });
    grid.appendChild(card);
  });
}

function rehydrateExisting(){
  $$(".session-window").forEach(w => {
    ensureMeta(w.id);
    if(!w.dataset.sessionId) w.dataset.sessionId = w.id;
    wireSession(w);
    const f = w.querySelector(".win-frame");
    if(w.dataset.suspended === "true") setState(w.id, SessionState.SUSPENDED);
    else setState(w.id, f ? SessionState.ACTIVE : SessionState.CREATED);
  });
  syncShell();
}

setInterval(() => {
  if(document.visibilityState === "hidden") return;
  const nowT = Date.now();
  sessionMeta.forEach((m, id) => {
    const w = getWin(id); if(!w) return;
    if(w.classList.contains("maximized")){
      if(m.state !== SessionState.ACTIVE) setState(id, SessionState.ACTIVE);
      touch(id);
      return;
    }
    if(m.state === SessionState.ACTIVE && nowT - (m.lastActive || 0) > IDLE_AFTER_MS){ setState(id, SessionState.IDLE); return; }
    if(m.state === SessionState.IDLE && nowT - (m.lastActive || 0) > SUSPEND_AFTER_IDLE_MS && canSuspend(id)) suspend(id);
  });
  enforceActive(); enforceSuspended();
}, 10_000);

window.SessionLifecycle = {
  States: SessionState, Tiers: Tier,
  getState: id => sessionMeta.get(id)?.state || null,
  listSessions: () => [...sessionMeta.entries()].map(([id, m]) => ({ id, ...m })),
  setTier(t){ if(TIER_LIMITS[t]){ currentTier = t; enforceActive(); enforceSuspended(); enforceTotal(); } },
  getTier: () => currentTier,
  touch, suspend, restore, evict,
  close: closeSession,
  createSessionWindow,
  rehydrateSessions,
  limits,
  enforce(){ enforceActive(); enforceSuspended(); enforceTotal(); },
  pin(id, v=true){ const m = sessionMeta.get(id); if(m) m.pinned = !!v; },
  markUnsaved(id, v=true){ const m = sessionMeta.get(id); if(m) m.hasUnsavedWork = !!v; },
  markMedia(id, v=true){ const m = sessionMeta.get(id); if(m) m.mediaPlaying = !!v; },
};
window.createSessionWindow = createSessionWindow;
window.closeWindow = closeSession;
window.minimizeWindow = id => window.KBLX_minimizeToDock(getWin(id), { title:getWin(id)?.dataset.sessionTitle });
window.maximizeWindow = id => {
  const w = getWin(id);
  if(w){
    w.classList.toggle("maximized");
    if(w.classList.contains("maximized")) w.style.zIndex = "94000";
    syncShell();
  }
};
window.toggleCollapse = id => getWin(id)?.classList.toggle("collapsed");
window.restoreSession = restore;
window.suspendSession = suspend;

function syncHostModeLabel(){
  const el = document.getElementById("hostModeLabel");
  if(el) el.textContent = (document.body.dataset.sessionHost === "stack") ? "📚 STACK" : "🌊 FLOAT";
}
window.syncHostModeLabel = syncHostModeLabel;
syncHostModeLabel();

document.getElementById("toggleHostBtn")?.addEventListener("click", () => {
  const cur = document.body.dataset.sessionHost || "float";
  const next = cur === "float" ? "stack" : "float";
  document.body.dataset.sessionHost = next;
  (window.MXP?.state?.sessions || []).forEach(s => {
    if(!s.host) s.host = next;
    if(s.host === next){ s.x = undefined; s.y = undefined; }
  });
  window.MXP?.save?.();
  const hostEl = next === "stack" ? document.getElementById("stackWrap") : document.getElementById("sessionsLayer");
  document.querySelectorAll(".session-window").forEach(w => { if(w.parentElement !== hostEl) hostEl?.appendChild(w); });
  syncHostModeLabel();
  window.KBLX_TOAST?.("Host: " + (next === "stack" ? "📚 STACK" : "🌊 FLOAT"));
});

document.getElementById("urlInputNav")?.addEventListener("keydown", e => { if(e.key === "Enter") document.getElementById("goNavBtn")?.click(); });
document.getElementById("goNavBtn")?.addEventListener("click", () => {
  const inp = document.getElementById("urlInputNav");
  const w = activeWin();
  if(!w){ window.MXP.createSession("NAV"); return; }
  let u = inp.value.trim(); if(!u) return;
  if(!/^https?:\/\//i.test(u) && !u.startsWith("about:")) u = "https://" + u;
  const d = window.TabStore.get(w.dataset.sessionId);
  const a = d.tabs.find(t => t.id === d.activeId);
  if(a){
    window.TabStore.updateUrl(w.dataset.sessionId, a.id, u, u.replace(/^https?:\/\//,"").split("/")[0]);
    applyTabsToWindow(w, window.TabStore.get(w.dataset.sessionId));
  }
  inp.value = u;
});

document.getElementById("closeTabSwitcher")?.addEventListener("click", closeTabSwitcher);
document.getElementById("newTabBtn")?.addEventListener("click", () => {
  const w = switcherWin || activeWin();
  if(!w) return window.KBLX_TOAST?.("Abra uma sessão antes");
  window.TabStore.addTab(w.dataset.sessionId, "about:blank");
  applyTabsToWindow(w, window.TabStore.get(w.dataset.sessionId));
  if(switcherWin) renderTabSwitcher(w);
});
document.getElementById("newSessionBtn")?.addEventListener("click", () => window.MXP.createSession("SESSION"));
document.getElementById("openKobBtn")?.addEventListener("click", () => window.MXP.createSession("KOB"));

window.DualSession = {
  get activeWindow(){ return activeWin(); },
  get switcherWin(){ return switcherWin; },
  openTabSwitcher, closeTabSwitcher, renderTabSwitcher,
  applyTabsToWindow,
};
window.iFSw_openSwitcher = openTabSwitcher;

rehydrateExisting();
})();

/* ─────────────────────────────────────────────────────────────────────
   9. SECTION ADAPTERS
   ───────────────────────────────────────────────────────────────────── */
(function(){
"use strict";
const SEL = ".app > section:not([data-mxp-static])";
function sessionize(section){
  if(section.dataset.mxpSession === "1") return;
  if(section.classList.contains("session-window")) return;
  if(section.querySelector(":scope > .win-hdr")) return;
  if(!section.closest(".app")) return;
  section.dataset.mxpSession = "1";
  section.classList.add("session-window");
  section.dataset.sessionId = section.dataset.sessionId || section.id
    || ("sess-" + Math.random().toString(36).slice(2,9));
  const title = (section.querySelector(".section-title")?.textContent || "").trim()
             || section.dataset.title || section.id || "SESSION";
  section.dataset.sessionTitle = title;
  const hdr = document.createElement("header");
  hdr.className = "win-hdr";
  hdr.dataset.sessionHeader = "1";
  const titleEl = document.createElement("div");
  titleEl.className = "mxp-title";
  titleEl.textContent = title;
  titleEl.title = "Toque 2× para renomear";
  const controls = document.createElement("div");
  controls.className = "win-controls";
  controls.innerHTML =
    '<button type="button" data-sn="collapse" aria-label="Recolher">−</button>' +
    '<button type="button" data-sn="maximize" aria-label="Maximizar">⛶</button>' +
    '<button type="button" data-sn="minimize" aria-label="Minimizar">۞</button>' +
    '<button type="button" data-sn="close" aria-label="Fechar">×</button>';
  hdr.append(titleEl, controls);
  const body = document.createElement("div");
  body.className = "win-body";
  body.dataset.sessionBody = "1";
  while(section.firstChild) body.appendChild(section.firstChild);
  section.append(hdr, body);
  controls.addEventListener("click", e => {
    const btn = e.target.closest("[data-sn]"); if(!btn) return;
    switch(btn.dataset.sn){
      case "collapse": section.classList.toggle("collapsed"); break;
      case "maximize": section.classList.toggle("maximized"); break;
      case "minimize": window.KBLX_minimizeToDock(section, { title:section.dataset.sessionTitle }); break;
      case "close": section.classList.add("minimized"); window.KBLX_minimizeToDock(section, { title:section.dataset.sessionTitle }); break;
    }
    document.dispatchEvent(new CustomEvent("mxp:section-action", { detail:{ section, action:btn.dataset.sn } }));
  });
  let lastTap = 0;
  titleEl.addEventListener("click", () => {
    const nowT = Date.now();
    if(nowT - lastTap < 380){
      const novo = prompt("Nome da section:", section.dataset.sessionTitle);
      if(novo && novo.trim()){
        section.dataset.sessionTitle = novo.trim();
        titleEl.textContent = novo.trim();
        document.dispatchEvent(new CustomEvent("mxp:section-renamed", { detail:{ section, title:novo.trim() } }));
      }
      lastTap = 0;
    } else lastTap = nowT;
  });
}
function boot(){ document.querySelectorAll(SEL).forEach(sessionize); }
window.MXPSectionAdapter = { boot, sessionize };
boot();
if(document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot, { once:true });
})();

/* ─────────────────────────────────────────────────────────────────────
   10. MXP
   ───────────────────────────────────────────────────────────────────── */
(function(){
"use strict";
const $ = (s,r=document)=>r.querySelector(s);
const $$ = (s,r=document)=>[...r.querySelectorAll(s)];
const uid = (p="x") => p + "_" + Date.now().toString(36) + Math.random().toString(36).slice(2,7);

function activeWinId(){
  const wins = $$(".session-window:not(.minimized)");
  if(!wins.length) return null;
  let best = wins[0], bz = 0;
  wins.forEach(w => { const z = parseInt(getComputedStyle(w).zIndex) || 0; if(z >= bz){ bz = z; best = w; } });
  return best.id;
}

const BRIDGE = {
  "dual:theme-toggle": () => document.getElementById("themeToggle")?.click(),
  "dual:drawer":       () => window.toggleDrawer?.("drawerProfile"),
  "drawer:open":       () => window.toggleDrawer?.("drawerProfile"),
  "dual:new-session":  () => window.MXP.createSession("SESSION"),
  "dual:win-max":      () => window.maximizeWindow?.(activeWinId()),
  "dual:win-min":      () => window.minimizeWindow?.(activeWinId()),
  "dual:win-close":    () => window.closeWindow?.(activeWinId()),
  "dual:win-collapse": () => window.toggleCollapse?.(activeWinId()),
  "dual:win-tabs":     () => { const w = window.DualSession?.activeWindow; if(w) window.iFSw_openSwitcher?.(w); },
  "dual:focus-url":    () => document.getElementById("urlInputNav")?.focus(),
  "nav:go":            () => document.getElementById("goNavBtn")?.click(),
  "nav:next":          () => document.getElementById("stepBtn")?.click(),
  "session:new":       () => window.MXP.createSession("SESSION"),
  "session:collapse":  ctx => { const s = ctx?.section?.closest?.(".app > section.session-window") || ctx?.section; s?.classList.toggle("collapsed"); },
  "session:maximize":  ctx => { const s = ctx?.section?.closest?.(".app > section.session-window") || ctx?.section; s?.classList.toggle("maximized"); },
  "session:minimize":  ctx => { const s = ctx?.section?.closest?.(".app > section.session-window") || ctx?.section; if(s) window.KBLX_minimizeToDock(s, { title:s.dataset.sessionTitle }); },
  "session:close":     ctx => { const s = ctx?.section?.closest?.(".app > section.session-window") || ctx?.section; s?.classList.add("minimized"); },
  "theme:toggle":      () => document.getElementById("themeToggle")?.click(),
  "media:play":        () => window.Nebula?.hasSlices?.() ? window.Nebula.toggleSpeech() : window.KBLX_ACTIONS?.speak(),
  "media:pause":       () => { if("speechSynthesis" in window && !speechSynthesis.paused) speechSynthesis.pause(); },
  "media:stop":        () => { window.Nebula?.stopSpeech?.(); window.KBLX_ACTIONS?.stop?.(); },
  "media:next":        () => window.Nebula?.nextSlice?.(),
  "media:prev":        () => window.Nebula?.previousSlice?.(),
  "nebula:speak":      () => window.Nebula?.hasSlices?.() ? window.Nebula.toggleSpeech() : window.KBLX_ACTIONS?.speak(),
  "nebula:import":     () => document.getElementById("sbImportInput")?.click(),
  "nebula:paste":      () => { const t = prompt("Cole:"); if(t) window.Nebula?.loadDocument(t, "Colado"); },
  "nebula:clear":      () => window.Nebula?.clear?.(),
  "dialog:generate":   () => document.getElementById("generateBtn")?.click(),
  "dialog:step":       () => document.getElementById("stepBtn")?.click(),
  "dialog:clear":      () => document.getElementById("sbClear")?.click(),
  "dialog:copy":       () => document.getElementById("sbCopy")?.click(),
  "dialog:download":   () => document.getElementById("sbDownload")?.click(),
  "orb:next":          () => {
    const o = document.getElementById("sbOrb");
    if(o){
      o.dispatchEvent(new PointerEvent("pointerdown", { bubbles:true }));
      setTimeout(() => o.dispatchEvent(new PointerEvent("pointerup", { bubbles:true })), 10);
    }
  },
  "orb:wheel":         () => document.getElementById("arch-overlay")?.classList.add("open"),
  "aside:toggle":      () => document.getElementById("symbolBar")?.classList.toggle("collapsed"),
  "factory:open":      () => window.MXP.openFactory(),
  "factory:close":     () => window.MXP.closeFactory(),
  "state:reset":       () => {
    if(!confirm("Resetar MXP?")) return;
    MXPstate = defaultState(); saveMxp(); renderAll();
    window.KBLX_TOAST?.("estado resetado");
  },
  "extras:import-slicer":   () => document.getElementById("sbImportInput")?.click(),
  "extras:paste-slicer":    () => { const t = prompt("Cole:"); if(t) window.Nebula?.loadDocument(t, "Colado"); },
  "extras:generate":        () => document.getElementById("generateBtn")?.click(),
  "extras:toggle-carousel": () => document.getElementById("symbolBar")?.classList.toggle("carousel-hidden"),
};

const CATALOG = [
  { category:"DUAL · SYSTEM", items:[["dual:theme-toggle","☼","TEMA"],["dual:drawer","🔅","COCKPIT"],["state:reset","⌦","RESET"]] },
  { category:"DUAL · WINDOW", items:[["dual:new-session","＋","NOVA"],["dual:win-max","⛶","MAX"],["dual:win-min","۞","MIN"],["dual:win-collapse","−","COLAPSO"],["dual:win-close","×","FECHAR"],["dual:win-tabs","⊞","ABAS"]] },
  { category:"SECTION WINDOW", items:[["session:collapse","−","COLAPSO"],["session:maximize","⛶","MAX"],["session:minimize","۞","MIN"],["session:close","×","FECHAR"]] },
  { category:"NEBULA", items:[["nebula:speak","🎙","SPEAK"],["nebula:import","⌲","IMPORT"],["nebula:paste","✎","PASTE"],["nebula:clear","⌫","CLEAR"]] },
  { category:"DIALOGUE", items:[["dialog:generate","⇄","GERAR"],["dialog:step","→","+15"],["dialog:copy","⧉","COPY"],["dialog:download","↓","DL"],["dialog:clear","×","CLEAR"]] },
  { category:"MEDIA", items:[["media:play","▶","PLAY"],["media:pause","Ⅱ","PAUSE"],["media:stop","■","STOP"],["media:next","›","NEXT"],["media:prev","‹","PREV"]] },
  { category:"MXP", items:[["factory:open","◈","FACTORY"],["aside:toggle","☰","TOGGLE"],["session:new","◉","SESSION"]] },
];

function defaultState(){ return { version:15, slots:{ header:[], aside:[], footer:[], loose:[] }, sessions:[] }; }
let MXPstate = window.Store.get(window.KBLX_KEYS.mxp, null) || defaultState();
function saveMxp(){ window.Store.set(window.KBLX_KEYS.mxp, MXPstate); }
function hud(msg){ const el = $("#mxd-hud"); if(!el) return; if(msg){ el.textContent = msg; el.classList.add("is-live"); } else el.classList.remove("is-live"); }

function fire(action, ctx={}){
  if(!action) return;
  if(BRIDGE[action]){ try{ BRIDGE[action](ctx); }catch(e){ console.warn("bridge", action, e); } return; }
  window.dispatchEvent(new CustomEvent("MXP_ACTION", { detail:{ action, ctx } }));
}

function makeButton(item, slot){
  const b = document.createElement("button");
  b.type = "button";
  b.className = "mxp-btn";
  if(slot === "__factory__") b.classList.add("slot-factory");
  else if(slot.startsWith("session:")) b.classList.add("slot-session");
  else b.classList.add("slot-" + slot);
  b.dataset.id = item.id || uid("btn");
  b.dataset.action = item.action || "";
  b.dataset.label = item.label || "";
  b.dataset.icon = item.icon || "";
  b.dataset.slot = slot;
  if(item.binding) b.dataset.binding = item.binding;
  b.title = item.binding ? `${item.label} · vinculado a "${item.binding}"` : `${item.label} · ${item.action}`;
  b.innerHTML = `<span class="mxp-icon">${item.icon || "•"}</span><span class="mxp-label">${item.label || ""}</span>`;
  if(item.binding) b.classList.add("is-bound");
  return b;
}
function itemFromButton(btn){
  return { id:btn.dataset.id, action:btn.dataset.action, label:btn.dataset.label, icon:btn.dataset.icon, binding:btn.dataset.binding || "" };
}
function renderSlot(slot){
  const el = document.querySelector(`[data-slot="${slot}"]`); if(!el) return;
  el.innerHTML = "";
  (MXPstate.slots[slot] || []).forEach(it => el.appendChild(makeButton(it, slot)));
}
function renderFactory(){
  const root = $("#mxd-catalog"); if(!root) return;
  root.innerHTML = "";
  CATALOG.forEach(cat => {
    const wrap = document.createElement("section"); wrap.className = "mxd-cat";
    wrap.innerHTML = `<div class="mxd-cat-name">${cat.category}</div>`;
    const grid = document.createElement("div"); grid.className = "mxd-cat-grid";
    cat.items.forEach(([action, icon, label]) => grid.appendChild(makeButton({ id:uid("factory"), action, icon, label }, "__factory__")));
    wrap.appendChild(grid); root.appendChild(wrap);
  });
}
function renderAll(){ renderFactory(); renderSlot("header"); renderSlot("aside"); renderSlot("footer"); renderSlot("loose"); }

function createSession(name="SESSION"){
  if(window.SessionLifecycle?.createSessionWindow){
    const host = document.body.dataset.sessionHost === "stack" ? "stack" : "float";
    const id = window.SessionLifecycle.createSessionWindow({ name, src:"https://www.infodose.com.br/splash" });
    if(!id) return null;
    const s = { id, name, url:"https://www.infodose.com.br/splash", host };
    MXPstate.sessions.push(s);
    MXPstate.slots["session:" + id] = [];
    saveMxp();
    window.TabStore?.ensure(id, s.url);
    document.dispatchEvent(new CustomEvent("mxp:session-created", { detail:{ session:s } }));
    return s;
  }
  const host = document.body.dataset.sessionHost === "stack" ? "stack" : "float";
  const s = { id:uid("session"), name, url:"https://www.infodose.com.br/splash", host };
  MXPstate.sessions.push(s);
  MXPstate.slots["session:" + s.id] = [];
  saveMxp();
  return s;
}
function removeSession(id){
  MXPstate.sessions = MXPstate.sessions.filter(s => s.id !== id);
  delete MXPstate.slots["session:" + id];
  saveMxp();
}
function addToSlot(item, slot){
  MXPstate.slots[slot] ??= [];
  const copy = { ...item, id:item.id || uid("btn") };
  MXPstate.slots[slot].push(copy); saveMxp(); renderSlot(slot);
  window.KBLX_TOAST?.(`+ ${copy.label || copy.action} → ${slot}`);
}
function removeItem(id, slot){
  if(!MXPstate.slots[slot]) return;
  MXPstate.slots[slot] = MXPstate.slots[slot].filter(x => x.id !== id);
  saveMxp(); renderSlot(slot); window.KBLX_TOAST?.("removido");
}
function moveItem(id, from, to){
  if(from === to) return;
  const list = MXPstate.slots[from] || [];
  const i = list.findIndex(x => x.id === id);
  if(i < 0) return;
  const item = list.splice(i,1)[0];
  MXPstate.slots[to] ??= [];
  MXPstate.slots[to].push(item);
  saveMxp(); renderSlot(from); renderSlot(to);
}

let gesture = null, pendingTap = null;
const HOLD_MS = 500, TAP_DELAY = 240, MOVE_THRESHOLD = 12, DRAG_THRESHOLD = 18;
function flushPendingTap(){
  if(!pendingTap) return;
  clearTimeout(pendingTap.timer);
  const p = pendingTap; pendingTap = null;
  p.btn.classList.remove("is-firing");
  fire(p.item.action, { element:p.btn, slot:p.slot });
}
document.addEventListener("pointerdown", e => {
  const btn = e.target.closest(".mxp-btn"); if(!btn) return;
  if(btn.closest("[data-win-action]")) return;
  if(e.pointerType === "mouse" && e.button !== 0) return;
  gesture = { btn, pointerId:e.pointerId, startX:e.clientX, startY:e.clientY, x:e.clientX, y:e.clientY,
              slot:btn.dataset.slot, item:itemFromButton(btn), dragging:false, timer:null, ghost:null, dualHover:null };
  btn.classList.add("is-holding");
  gesture.timer = setTimeout(startFakeDrag, HOLD_MS);
}, { passive:true });
document.addEventListener("pointermove", e => {
  if(!gesture || gesture.pointerId !== e.pointerId) return;
  gesture.x = e.clientX; gesture.y = e.clientY;
  const dx = e.clientX - gesture.startX, dy = e.clientY - gesture.startY;
  if(!gesture.dragging && Math.hypot(dx, dy) > MOVE_THRESHOLD){
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
document.addEventListener("pointerup", e => {
  if(!gesture || gesture.pointerId !== e.pointerId) return;
  clearTimeout(gesture.timer);
  if(gesture.dragging){
    const moved = Math.hypot(e.clientX - gesture.startX, e.clientY - gesture.startY) > DRAG_THRESHOLD;
    if(moved) finishFakeDrag(e.clientX, e.clientY);
    else { cleanupDrag(); gesture = null; }
    return;
  }
  const { btn, slot, item } = gesture;
  btn.classList.remove("is-holding"); gesture = null;
  handleTap(btn, slot, item);
}, { passive:true });
document.addEventListener("pointercancel", () => {
  if(!gesture) return;
  clearTimeout(gesture.timer);
  gesture.btn.classList.remove("is-holding", "is-source");
  cleanupDrag(); hud(""); gesture = null;
});
function handleTap(btn, slot, item){
  if(slot === "__factory__"){ addToSlot({ ...item, id:uid("btn") }, "loose"); return; }
  if(pendingTap && pendingTap.btn === btn){
    clearTimeout(pendingTap.timer); pendingTap.btn.classList.remove("is-firing"); pendingTap = null;
    openContext(btn, slot); return;
  }
  if(pendingTap) flushPendingTap();
  btn.classList.add("is-firing");
  const timer = setTimeout(() => {
    if(pendingTap && pendingTap.btn === btn){
      pendingTap = null; btn.classList.remove("is-firing");
      fire(item.action, { element:btn, slot });
    }
  }, TAP_DELAY);
  pendingTap = { btn, timer, item, slot };
}
function startFakeDrag(){
  if(!gesture) return;
  if(pendingTap && pendingTap.btn === gesture.btn){
    clearTimeout(pendingTap.timer); pendingTap.btn.classList.remove("is-firing"); pendingTap = null;
  }
  gesture.dragging = true;
  gesture.btn.classList.remove("is-holding");
  gesture.btn.classList.add("is-source");
  document.body.classList.add("mxp-dragging");
  document.getElementById("mxd-trash")?.classList.add("is-active");
  hud("segure · solte em slot OU sobre DUAL tracejado");
  const g = document.createElement("div"); g.id = "mxd-ghost"; g.textContent = gesture.item.icon || "•";
  document.body.appendChild(g); gesture.ghost = g;
  requestAnimationFrame(() => g.classList.add("is-live"));
  moveGhost(gesture.x, gesture.y);
  if(navigator.vibrate) try{ navigator.vibrate(15); }catch(_){}
}
function moveGhost(x, y){ if(!gesture?.ghost) return; gesture.ghost.style.left = x + "px"; gesture.ghost.style.top = y + "px"; }
function getDropTarget(x, y){
  if(gesture?.ghost) gesture.ghost.style.display = "none";
  const el = document.elementFromPoint(x, y);
  if(gesture?.ghost) gesture.ghost.style.display = "grid";
  return el?.closest("[data-drop-target]");
}
function getDualTarget(x, y){
  if(gesture?.ghost) gesture.ghost.style.display = "none";
  const el = document.elementFromPoint(x, y);
  if(gesture?.ghost) gesture.ghost.style.display = "grid";
  return el?.closest("[data-dual-target]");
}
function updateDropTargets(x, y){
  $$("[data-drop-target]").forEach(el => el.classList.remove("is-drop-ready"));
  const trash = document.getElementById("mxd-trash"); trash?.classList.remove("is-over");
  const t = getDropTarget(x, y); if(!t) return;
  if(t.dataset.trash !== undefined){ trash?.classList.add("is-over"); hud("soltar para remover"); return; }
  t.classList.add("is-drop-ready"); hud(`soltar em · ${t.dataset.slot || "slot"}`);
}
function updateDualTargets(x, y){
  $$("[data-dual-target].is-dual-hover").forEach(el => el.classList.remove("is-dual-hover"));
  gesture.dualHover = null;
  const d = getDualTarget(x, y);
  if(d){ d.classList.add("is-dual-hover"); gesture.dualHover = d; hud(`⛓ vincular a · ${d.dataset.dualAction || "DUAL"}`); }
}
function finishFakeDrag(x, y){
  clearTimeout(gesture.timer);
  const dualTarget = getDualTarget(x, y);
  const target = getDropTarget(x, y);
  if(dualTarget && gesture.slot !== "__factory__" && !target){
    const da = dualTarget.dataset.dualAction;
    const list = MXPstate.slots[gesture.slot] || [];
    const idx = list.findIndex(i => i.id === gesture.item.id);
    if(idx >= 0){ list[idx].binding = da; list[idx].action = "dual:" + da; saveMxp(); renderSlot(gesture.slot); window.KBLX_TOAST?.(`⛓ vinculado a ${da}`); }
    cleanupDrag(); gesture = null; return;
  }
  if(target && target.dataset.trash !== undefined){
    if(gesture.slot !== "__factory__") removeItem(gesture.item.id, gesture.slot);
    cleanupDrag(); gesture = null; return;
  }
  if(target){
    const to = target.dataset.slot;
    if(gesture.slot === "__factory__") addToSlot({ ...gesture.item, id:uid("btn") }, to);
    else moveItem(gesture.item.id, gesture.slot, to);
    cleanupDrag(); gesture = null; return;
  }
  cleanupDrag(); gesture = null;
}
function cleanupDrag(){
  if(!gesture) return;
  gesture.btn.classList.remove("is-source");
  gesture.ghost?.remove(); gesture.ghost = null;
  document.getElementById("mxd-trash")?.classList.remove("is-active", "is-over");
  $$("[data-drop-target]").forEach(el => el.classList.remove("is-drop-ready"));
  $$("[data-dual-target].is-dual-hover").forEach(el => el.classList.remove("is-dual-hover"));
  document.body.classList.remove("mxp-dragging");
  hud("");
}
let contextItem = null;
function openContext(btn, slot){
  if(slot === "__factory__") return;
  contextItem = { btn, item:itemFromButton(btn), slot };
  const menu = document.getElementById("mxd-context");
  const head = document.getElementById("mxd-ctx-head");
  if(head) head.textContent = contextItem.item.label || contextItem.item.action;
  const r = btn.getBoundingClientRect();
  menu.style.left = Math.min(window.innerWidth - 190, Math.max(10, r.left)) + "px";
  menu.style.top  = Math.min(window.innerHeight - 220, r.bottom + 8) + "px";
  menu.classList.add("is-open");
}
function closeContext(){ document.getElementById("mxd-context")?.classList.remove("is-open"); contextItem = null; }
document.getElementById("mxd-context")?.addEventListener("click", e => {
  const a = e.target.closest("[data-context-action]")?.dataset.contextAction;
  if(!a || !contextItem) return;
  const { item, slot } = contextItem;
  if(a === "fire") fire(item.action, { item, slot });
  if(a === "duplicate") addToSlot({ ...item, id:uid("copy"), binding:"" }, slot);
  if(a === "unbind"){
    const list = MXPstate.slots[slot] || [];
    const i = list.findIndex(x => x.id === item.id);
    if(i >= 0){ list[i].binding = ""; saveMxp(); renderSlot(slot); }
  }
  if(a === "remove") removeItem(item.id, slot);
  closeContext();
});
document.addEventListener("pointerdown", e => {
  if(document.getElementById("mxd-context")?.classList.contains("is-open") && !e.target.closest("#mxd-context")) closeContext();
});
function openFactory(){ document.getElementById("mxd-factory")?.classList.add("is-open"); }
function closeFactory(){ document.getElementById("mxd-factory")?.classList.remove("is-open"); }
document.getElementById("mxd-factory")?.addEventListener("click", e => { if(e.target.id === "mxd-factory") closeFactory(); });
document.addEventListener("keydown", e => {
  if((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === "b"){
    e.preventDefault();
    document.getElementById("mxd-factory")?.classList.toggle("is-open");
  }
  if(e.key === "Escape"){ closeFactory(); closeContext(); }
});
function seedIfEmpty(){
  if(window.Store.get(window.KBLX_KEYS.root)) return;
  const s = MXPstate.slots;
  if(s.header?.length || s.aside?.length || s.footer?.length || s.loose?.length || MXPstate.sessions.length) return;
  s.header = [{ id:uid("s"), action:"dual:theme-toggle", icon:"☼", label:"TEMA" }];
  s.aside  = [
    { id:uid("s"), action:"extras:import-slicer", icon:"⌲", label:"SLICER" },
    { id:uid("s"), action:"extras:paste-slicer",  icon:"✎", label:"COLAR" },
    { id:uid("s"), action:"extras:generate",      icon:"⇄", label:"GERAR" },
    { id:uid("s"), action:"extras:toggle-carousel", icon:"◈", label:"ARQ." },
  ];
  s.footer = [
    { id:uid("s"), action:"factory:open", icon:"◈", label:"FACTORY" },
    { id:uid("s"), action:"dual:drawer",  icon:"🔅", label:"COCKPIT" },
  ];
  s.loose  = [
    { id:uid("s"), action:"dual:new-session", icon:"＋", label:"NOVA" },
    { id:uid("s"), action:"state:reset",      icon:"⌦", label:"RESET" },
  ];
  saveMxp();
}
renderAll();
window.MXP = {
  get state(){ return MXPstate; },
  CATALOG, fire, createSession, removeSession, addToSlot, removeItem, moveItem,
  save: saveMxp, render: renderAll, renderSlot, renderFactory,
  openFactory, closeFactory,
  reset(){ MXPstate = defaultState(); saveMxp(); renderAll(); },
  _seed: seedIfEmpty,
};
})();

/* ─────────────────────────────────────────────────────────────────────
   11. NEBULA RICH (parser + decorator)
   ───────────────────────────────────────────────────────────────────── */
(function(){
"use strict";
if(window.__NEBULA_RICH__) return;
window.__NEBULA_RICH__ = true;
const esc = s => String(s ?? "").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
const autoLink = u => { try{ const x = new URL(u); return `<a href="${x.href}" target="_blank" rel="noopener">${x.href}</a>`; }catch{ return u; } };
function inline(s){
  let h = esc(s);
  h = h.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (_,a,src) => `<img class="md-img" alt="${a}" src="${src}">`);
  h = h.replace(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g, (_,t,url) => `<a href="${url}" target="_blank" rel="noopener">${t}</a>`);
  h = h.replace(/\[([^\]]+)\]\(action:([a-z0-9_:\-.]+)\)/gi, (_,t,a) => `<button class="btn action" data-action="${a}">${t}</button>`);
  h = h.replace(/\[\[btn:([a-z0-9_:\-.]+)(?:\|([^\]]+))?\]\]/gi, (_,a,l) => `<button class="btn action" data-action="${a}">${l || a}</button>`);
  h = h.replace(/`([^`]+)`/g, (_,c) => `<code class="code-inline">${c}</code>`);
  h = h.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  h = h.replace(/(^|[^*])\*([^*]+)\*(?!\*)/g, "$1<em>$2</em>");
  h = h.replace(/~~([^~]+)~~/g, "<del>$1</del>");
  h = h.replace(/\bhttps?:\/\/[^\s<)]+/g, autoLink);
  return h;
}
const isHr = l => /^\s*(?:---|\*\*\*|___)\s*$/.test(l);
const isQuote = l => /^\s*>\s?/.test(l);
const isTableRow = l => /^\s*\|.*\|\s*$/.test(l);
const isFenceEnd = l => /^\s*(?:```|''')\s*$/.test(l);
function listInfo(l){
  const m = l.match(/^(\s*)([-+*]|\d+\.)\s+(.*)$/);
  if(!m) return null;
  return { indent:m[1].replace(/\t/g,"    ").length, ordered:/^\d+\.$/.test(m[2]), text:m[3] };
}
function splitRow(l){
  let s = l.trim();
  if(s.startsWith("|")) s = s.slice(1);
  if(s.endsWith("|")) s = s.slice(0,-1);
  return s.split("|").map(x => x.trim());
}
const isSep = l => { const c = splitRow(l); return c.length && c.every(x => /^:?-{3,}:?$/.test(x)); };
function parseTable(lines, start){
  const rows = []; let i = start;
  while(i < lines.length && isTableRow(lines[i])){ rows.push(splitRow(lines[i])); i++; }
  if(rows.length < 2 || !isSep(lines[start+1])) return null;
  const header = rows[0], body = rows.slice(2);
  const t = document.createElement("table"); t.className = "md-table";
  const thead = document.createElement("thead"), trh = document.createElement("tr");
  header.forEach(c => { const th = document.createElement("th"); th.innerHTML = inline(c); trh.appendChild(th); });
  thead.appendChild(trh); t.appendChild(thead);
  const tbody = document.createElement("tbody");
  body.forEach(r => {
    const tr = document.createElement("tr");
    header.forEach((_,k) => { const td = document.createElement("td"); td.innerHTML = inline(r[k] || ""); tr.appendChild(td); });
    tbody.appendChild(tr);
  });
  t.appendChild(tbody);
  const wrap = document.createElement("div"); wrap.className = "md-table-wrap"; wrap.appendChild(t);
  return { node:wrap, next:i };
}
function parseLists(lines, start){
  const first = listInfo(lines[start]); if(!first) return null;
  const root = document.createElement(first.ordered ? "ol" : "ul");
  root.className = "md-list";
  const stack = [{ indent:first.indent, ordered:first.ordered, list:root, lastLi:null }];
  let i = start;
  while(i < lines.length){
    const info = listInfo(lines[i]); if(!info) break;
    while(stack.length > 1 && info.indent < stack[stack.length-1].indent) stack.pop();
    let cur = stack[stack.length-1];
    if(info.indent > cur.indent && cur.lastLi){
      const n = document.createElement(info.ordered ? "ol" : "ul"); n.className = "md-list";
      cur.lastLi.appendChild(n);
      stack.push({ indent:info.indent, ordered:info.ordered, list:n, lastLi:null });
      cur = stack[stack.length-1];
    } else if(info.indent === cur.indent && info.ordered !== cur.ordered && cur.lastLi){
      const n = document.createElement(info.ordered ? "ol" : "ul"); n.className = "md-list";
      cur.lastLi.appendChild(n);
      stack.push({ indent:info.indent, ordered:info.ordered, list:n, lastLi:null });
      cur = stack[stack.length-1];
    }
    const li = document.createElement("li");
    const task = info.text.match(/^\[( |x|X)\]\s*(.*)$/);
    if(task){
      cur.list.classList.add("md-task");
      const box = document.createElement("input"); box.type = "checkbox"; box.checked = /x/i.test(task[1]); box.disabled = true;
      const span = document.createElement("span"); span.innerHTML = inline(task[2]);
      li.append(box, span);
    } else li.innerHTML = inline(info.text);
    cur.list.appendChild(li); cur.lastLi = li;
    i++;
  }
  return { node:root, next:i };
}
function parseFence(lines, start){
  const m = lines[start].match(/^\s*(?:```|''')([\w-]*)\s*$/); if(!m) return null;
  const lang = (m[1] || "").toLowerCase();
  const buf = []; let i = start + 1;
  while(i < lines.length && !isFenceEnd(lines[i])){ buf.push(lines[i]); i++; }
  const raw = buf.join("\n");
  if(lang === "html-raw"){
    const w = document.createElement("div"); w.className = "raw-html-card"; w.textContent = raw;
    return { node:w, next:i < lines.length ? i+1 : i };
  }
  const pre = document.createElement("pre"); pre.className = "md-code";
  const code = document.createElement("code");
  if(lang) code.className = "language-" + lang;
  code.textContent = raw;
  pre.appendChild(code);
  return { node:pre, next:i < lines.length ? i+1 : i };
}
function render(md){
  if(md == null) return "";
  const text = String(md);
  if(!text.trim()) return "";
  const lines = text.replace(/\r\n?/g,"\n").split("\n");
  const out = []; let i = 0, para = [];
  const flushP = () => {
    if(!para.length) return;
    const j = para.join(" ").trim();
    if(j){ const p = document.createElement("p"); p.innerHTML = inline(j); out.push(p.outerHTML); }
    para = [];
  };
  while(i < lines.length){
    const line = lines[i];
    if(!line.trim()){ flushP(); i++; continue; }
    const fence = parseFence(lines, i);
    if(fence){ flushP(); out.push(fence.node.outerHTML); i = fence.next; continue; }
    const hm = line.match(/^(#{1,6})\s+(.*)$/);
    if(hm){
      flushP();
      const h = document.createElement("h" + hm[1].length);
      h.innerHTML = inline(hm[2]);
      out.push(h.outerHTML); i++; continue;
    }
    if(i+1 < lines.length && /^[=-]{3,}\s*$/.test(lines[i+1]) && line.trim()){
      flushP();
      const lv = lines[i+1].trim()[0] === "=" ? 1 : 2;
      const h = document.createElement("h" + lv);
      h.innerHTML = inline(line.trim());
      out.push(h.outerHTML); i += 2; continue;
    }
    if(isHr(line)){ flushP(); out.push('<hr class="hr">'); i++; continue; }
    if(isQuote(line)){
      flushP();
      const buf = [];
      while(i < lines.length && isQuote(lines[i])){ buf.push(lines[i].replace(/^\s*>\s?/,"")); i++; }
      const bq = document.createElement("blockquote"); bq.className = "bq";
      bq.innerHTML = '<span class="copy-hint">Copiar</span>' + inline(buf.join(" "));
      out.push(bq.outerHTML); continue;
    }
    const call = line.match(/^\s*(::(info|warn|tip|note|success|danger)|::\.|:|\?)\s+(.*)$/i);
    if(call){
      let kind = "note";
      if(call[1] === "::.") kind = "aside";
      else if(call[1] === ":") kind = "note";
      else if(call[1] === "?") kind = "question";
      else kind = (call[2] || "info").toLowerCase();
      const buf = [call[3]]; let j = i + 1;
      while(j < lines.length){
        const nx = lines[j].trim();
        if(!nx) break;
        if(/^\s*(::(info|warn|tip|note|success|danger)|::\.|:|\?)\s+/.test(nx)) break;
        buf.push(nx); j++;
      }
      i = j;
      const d = document.createElement("div"); d.className = "callout " + kind;
      d.innerHTML = '<span class="copy-hint">Copiar</span>' + inline(buf.join(" "));
      out.push(d.outerHTML); continue;
    }
    if(isTableRow(line)){
      const t = parseTable(lines, i);
      if(t){ flushP(); out.push(t.node.outerHTML); i = t.next; continue; }
    }
    if(listInfo(line)){
      const l = parseLists(lines, i);
      if(l){ flushP(); out.push(l.node.outerHTML); i = l.next; continue; }
    }
    para.push(line.trim());
    i++;
  }
  flushP();
  return out.join("\n");
}
function decorate(root){
  if(!root?.querySelectorAll) return;
  root.querySelectorAll(".md-list").forEach(el => {
    if(el.closest(".list-card,.ascii-card,.no-beauty")) return;
    if(el.parentElement?.closest(".md-list")) return;
    if(el.parentElement?.classList.contains("list-card")) return;
    const wrap = document.createElement("div"); wrap.className = "list-card";
    el.parentNode.insertBefore(wrap, el); wrap.appendChild(el);
  });
  root.querySelectorAll("pre.md-code").forEach(pre => {
    if(pre.closest(".ascii-card,.no-beauty")) return;
    const t = (pre.textContent || "").trim(); if(!t) return;
    const box = (t.match(/[─│┌┐└┘╭╮╰╯═╬╠╣╦╩]/g) || []).length;
    const gridLike = /[-_=+*#\\/|]{3,}/.test(t);
    const multi = t.split("\n").length >= 2;
    if(box >= 4 || (multi && gridLike && box >= 1)){
      const fig = document.createElement("figure"); fig.className = "ascii-card";
      const p = document.createElement("pre"); p.textContent = t;
      fig.appendChild(p); pre.replaceWith(fig);
    }
  });
}
document.addEventListener("click", async e => {
  const hint = e.target.closest("#readerApp .copy-hint");
  if(hint){
    const host = hint.parentElement; if(!host) return;
    const txt = host.innerText.replace(/Copiar/i,"").trim();
    try{ await navigator.clipboard.writeText(txt); window.KBLX_TOAST?.("Copiado ✓"); }catch(_){}
    return;
  }
  const btn = e.target.closest("#readerApp button.btn.action[data-action]");
  if(btn){
    document.dispatchEvent(new CustomEvent("NEBULA_ACTION", { detail:{ action:btn.dataset.action, button:btn } }));
    window.MXP?.fire?.(btn.dataset.action, { source:"nebula-slice", button:btn });
  }
}, { passive:true });
window.NebulaRender = { render, decorate, version:1 };
window.NebulaRich = { render, decorate, version:1 };
})();

/* ─────────────────────────────────────────────────────────────────────
   12. NEBULA CORE
   ───────────────────────────────────────────────────────────────────── */
(function(){
"use strict";
const state = { slices:[], current:0, speaking:false, paused:false, documentTitle:"ESPAÇO DA MENTE", sliceArches:[], raw:"", title:"" };
const $ = id => document.getElementById(id);
const stage = $("sliceStage"); if(!stage) return;
const emptyState = $("emptyState"), fileInput = $("fileInput"), player = $("player");
const playButton = $("playButton"), playerTitle = $("playerTitle"), playerState = $("playerState");
const progressBar = $("progressBar"), documentTitle = $("documentTitle");

const ARCH_SYMBOLS = { ATLAS:"α",NOVA:"✦",VITALIS:"♾",PULSE:"◈",ARTEMIS:"☾",SERENA:"❋",KAOS:"⚡",GENUS:"⚙",LUMINE:"☀",SOLUS:"◌",RHEA:"∞",AION:"⧗",KODUX:"⇄",BLLUE:"◉",JESUS:"✝",KOBLLUX:"∆" };
const ARCH_ORDER = ["KOBLLUX","VITALIS","ARTEMIS","SERENA","LUMINE","KODUX","ATLAS","GENUS","PULSE","JESUS","SOLUS","BLLUE","NOVA","RHEA","KAOS","AION"];
function escapeRegex(s){ return String(s).replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }
function detectArchInText(raw){
  if(!raw) return null;
  const text = String(raw);
  for(const n of ARCH_ORDER){ if(new RegExp(escapeRegex(ARCH_SYMBOLS[n]) + "\\s*[·:\\-—]?\\s*" + n + "\\b","i").test(text)) return n; }
  for(const n of ARCH_ORDER){ if(new RegExp("^#{1,6}\\s*" + escapeRegex(n) + "\\b","im").test(text)) return n; }
  for(const n of ARCH_ORDER){ if(new RegExp("^" + escapeRegex(n) + "\\s*[·:\\-—]\\s","im").test(text)) return n; }
  for(const n of ARCH_ORDER){ if(new RegExp("\\b" + escapeRegex(n) + "\\b","i").test(text)) return n; }
  return null;
}
function archColor(n){ const m = window.ARCH_MAP; return (m && m[n]) ? `var(${m[n].tok})` : "var(--kob-voice-primary)"; }
function buildSliceArches(slices){ return slices.map(detectArchInText); }
function parseDocument(text){
  const lines = text.replace(/\r/g,"").split("\n");
  const slices = []; let cur = [];
  const push = () => { const v = cur.join("\n").trim(); if(v) slices.push(v); cur = []; };
  for(const line of lines){
    if(/^#{1,3}\s+/.test(line)){ if(cur.length) push(); cur.push(line); continue; }
    if(/^---+$/.test(line.trim())){ push(); continue; }
    cur.push(line);
  }
  if(cur.length) push();
  if(slices.length <= 1){
    const blocks = text.split(/\n\s*\n/).map(x => x.trim()).filter(Boolean);
    if(blocks.length > 1) return blocks;
  }
  return slices;
}
function markdownToHTML(text){
  return window.NebulaRender ? window.NebulaRender.render(text) : `<p>${text.replace(/</g,"&lt;")}</p>`;
}
function createSlice(content, index){
  const s = document.createElement("slice");
  const detected = state.sliceArches[index];
  const isAuto = !detected;
  const arch = detected || window.getArch?.() || "JESUS";
  s.dataset.index = index; s.dataset.state = "created";
  s.dataset.arch = arch; s.dataset.auto = isAuto ? "1" : "0";
  s.style.setProperty("--slice-arch-color", archColor(arch));
  s.innerHTML = `
    <div class="slice-content">
      <div class="slice-meta">
        <label>SLICE ${String(index+1).padStart(2,"0")}</label>
        <span class="slice-arch-chip ${isAuto ? "auto" : ""}"><i></i>${isAuto ? "◆ AUTO" : arch}</span>
        <span class="slice-number">${index+1} / ${state.slices.length}</span>
      </div>
      <div class="slice-body">${markdownToHTML(content)}</div>
    </div>`;
  window.NebulaRender?.decorate(s);
  return s;
}
function loadDocument(text, title){
  stopSpeech();
  state.raw = text; state.title = title || "Documento";
  state.slices = parseDocument(text); state.current = 0;
  state.documentTitle = title || "Documento";
  state.sliceArches = buildSliceArches(state.slices);
  if(documentTitle) documentTitle.textContent = state.documentTitle;
  if(playerTitle) playerTitle.textContent = state.documentTitle;
  stage.replaceChildren();
  state.slices.forEach((c,i) => stage.appendChild(createSlice(c,i)));
  if(emptyState) emptyState.style.display = state.slices.length ? "none" : "grid";
  showSlice(0);
  window.KBLX_SAVE?.();
}
function showSlice(index){
  if(!state.slices.length) return;
  if(index < 0) index = state.slices.length - 1;
  if(index >= state.slices.length) index = 0;
  state.current = index;
  stage.querySelectorAll("slice").forEach((s,i) => s.classList.toggle("active", i === index));
  if(progressBar) progressBar.style.width = `${((index+1)/state.slices.length)*100}%`;
  const detected = state.sliceArches[index];
  const arch = detected || window.getArch?.() || "JESUS";
  if(playerState) playerState.textContent = detected
    ? `Slice ${index+1}/${state.slices.length} · ${detected}`
    : `Slice ${index+1}/${state.slices.length} · ${arch} (auto)`;
  if(state.speaking) speakCurrentSlice();
}
function nextSlice(){ if(state.slices.length && state.current < state.slices.length - 1) showSlice(state.current + 1); else stopSpeech(); }
function previousSlice(){ if(state.slices.length) showSlice(state.current - 1); }
function getCurrentText(){
  const s = state.slices[state.current]; if(!s) return "";
  return s.replace(/```[\s\S]*?```/g, " código ")
    .replace(/^#{1,6}\s+/gm, "").replace(/[*_~`]/g, "")
    .replace(/^>\s*/gm, "").replace(/^[-*]\s+/gm, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1").replace(/\n+/g, " ").trim();
}
function speakCurrentSlice(){
  if(!("speechSynthesis" in window)){ if(playerState) playerState.textContent = "Speech indisponível"; return; }
  speechSynthesis.cancel();
  const text = getCurrentText(); if(!text) return;
  const archName = state.sliceArches[state.current] || window.getArch?.() || "JESUS";
  window.applyArch?.(archName);
  window.__sbSync?.(archName);
  const u = window.KBLX_VOICE
    ? window.KBLX_VOICE.forArch(archName, text)
    : new SpeechSynthesisUtterance(text);
  u.onstart = () => {
    state.speaking = true; state.paused = false;
    if(playButton) playButton.textContent = "Ⅱ";
    if(playerState) playerState.textContent = `🎙 ${archName} · slice ${state.current + 1}`;
    document.getElementById("sbOrb")?.classList.add("speaking");
  };
  u.onend = () => {
    if(state.speaking){
      if(state.current < state.slices.length - 1){ state.current++; showSlice(state.current); }
      else stopSpeech();
    }
  };
  u.onerror = () => {
    state.speaking = false;
    if(playButton) playButton.textContent = "▶";
    document.getElementById("sbOrb")?.classList.remove("speaking");
  };
  speechSynthesis.speak(u);
}
function toggleSpeech(){
  if(!state.slices.length) return;
  if(state.speaking){
    if(speechSynthesis.paused){ speechSynthesis.resume(); state.paused = false; if(playButton) playButton.textContent = "Ⅱ"; return; }
    speechSynthesis.pause(); state.paused = true; if(playButton) playButton.textContent = "▶"; return;
  }
  state.speaking = true; speakCurrentSlice();
}
function stopSpeech(){
  if("speechSynthesis" in window) speechSynthesis.cancel();
  state.speaking = false; state.paused = false;
  if(playButton) playButton.textContent = "▶";
  document.getElementById("sbOrb")?.classList.remove("speaking");
}
function clear(){
  state.slices = []; state.current = 0; state.sliceArches = []; state.raw = ""; state.title = "";
  stopSpeech(); stage.replaceChildren();
  if(emptyState) emptyState.style.display = "grid";
  if(playerTitle) playerTitle.textContent = "Nenhum";
  if(playerState) playerState.textContent = "Aguardando";
  if(progressBar) progressBar.style.width = "0%";
}
fileInput?.addEventListener("change", async e => {
  const f = e.target.files[0]; if(!f) return;
  const txt = await f.text(); loadDocument(txt, f.name);
});
document.addEventListener("keydown", e => {
  if(e.target.matches('textarea,input,[contenteditable="true"]')) return;
  if(e.key === "ArrowRight") nextSlice();
  if(e.key === "ArrowLeft") previousSlice();
});
let touchX = 0;
document.addEventListener("touchstart", e => { touchX = e.changedTouches[0].screenX; }, { passive:true });
document.addEventListener("touchend", e => {
  const d = e.changedTouches[0].screenX - touchX;
  if(Math.abs(d) < 80) return;
  if(!e.target.closest("#readerApp")) return;
  if(d < 0) nextSlice(); else previousSlice();
}, { passive:true });
window.Nebula = { loadDocument, showSlice, nextSlice, previousSlice, toggleSpeech, stopSpeech, clear, hasSlices:() => state.slices.length > 0, state, detectArchInText };
})();

/* ─────────────────────────────────────────────────────────────────────
   13. DIALOGUE
   ───────────────────────────────────────────────────────────────────── */
(function(){
"use strict";
const $ = s => document.querySelector(s);
const source = $("#sourceText"), conversation = $("#conversation"), counter = $("#counter");
const roundLabel = $("#roundLabel"), lexicalBank = $("#lexicalBank"), bankInfo = $("#bankInfo");
const chatWindow = $("#chatWindow");
if(!source || !conversation) return;
const state = { units:[], index:0, cycle:0, history:[], bank:{ prepositions:[], connectors:[], pronouns:[], articles:[], verbs:[], words:[], questions:[] } };
let generating = false;
function normalize(t){ return String(t || "").replace(/\r\n/g,"\n").replace(/\r/g,"\n").replace(/[ \t]+/g," ").replace(/\n{3,}/g,"\n\n").trim(); }
function splitText(text){
  text = normalize(text); if(!text) return [];
  return text.split(/(?<=[.!?;:])\s+|\n+/).map(x => x.trim()).filter(Boolean)
    .map((t,i) => ({ id:i, text:t, type:t.includes("?") ? "question" : "statement" }));
}
const PREPS = new Set("a ante após até com contra de desde em entre para per perante por sem sob sobre trás ao aos à às do dos da das no nos na nas pelo pelos pela pelas".split(" "));
const CONNS = new Set("e ou mas porém contudo todavia porque portanto então assim logo embora enquanto quando como se caso que também ainda já nem pois além antes depois".split(" "));
const PRONS = new Set("eu tu ele ela nós vos eles elas me te se nos vos lhe lhes isso isto aquilo esse essa este esta aquele aquela quem que qual quais algo nada tudo ninguém alguém".split(" "));
const ARTS = new Set("o a os as um uma uns umas".split(" "));
const STOP = new Set([...PREPS, ...CONNS, ...PRONS, ...ARTS]);
function wordsFrom(t){ return normalize(t).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").match(/[a-zA-ZÀ-ÿ]+(?:[-'][a-zA-ZÀ-ÿ]+)*/g) || []; }
function detectVerb(w){
  if(w.length < 4) return false;
  return /(?:ar|er|ir)$/.test(w) || /(?:ou|ei|iu|ava|ia|aram|eram|iram|ando|endo|indo)$/.test(w)
    || ["é","ser","sou","são","tem","tenho","há","pode","podem","deve","devem","faz","fazem","vai","vão","foi","foram","era","eram","está","estão","existe","existem"].includes(w);
}
function extractBank(text){
  const u = [...new Set(wordsFrom(text))];
  state.bank = {
    prepositions: u.filter(x => PREPS.has(x)),
    connectors: u.filter(x => CONNS.has(x)),
    pronouns: u.filter(x => PRONS.has(x)),
    articles: u.filter(x => ARTS.has(x)),
    verbs: u.filter(x => detectVerb(x)),
    words: u.filter(x => x.length >= 4 && !STOP.has(x)),
    questions: splitText(text).filter(x => x.type === "question").map(x => x.text),
  };
  renderBank();
}
function pick(l){ return l?.length ? l[Math.floor(Math.random() * l.length)] : ""; }
function srcWord(){ return pick(state.bank.words); }
function srcPrep(){ return pick(state.bank.prepositions); }
function srcConn(){ return pick(state.bank.connectors); }
function cleanP(t){ return String(t).replace(/[!?]+/g,"").replace(/[.]+$/,"").trim(); }
function lowerFirst(t){ return t.charAt(0).toLowerCase() + t.slice(1); }
function invert(text){
  const c = cleanP(text); if(!c) return "Existe outro lado dessa ideia.";
  const low = c.toLowerCase();
  if(/\bnão\b/.test(low)){ const pos = c.replace(/\bnão\b/ig,"").replace(/\s{2,}/g," ").trim(); return "Então existe a possibilidade de " + lowerFirst(pos) + "."; }
  if(/\b(sim|é|existe|há|pode|deve)\b/i.test(low)) return "Mas também podemos considerar que não " + lowerFirst(c) + ".";
  const w = srcWord(), p = srcPrep();
  if(w && p) return "O outro polo observa " + p + " " + w + " e propõe o contrário de " + lowerFirst(c) + ".";
  return "O outro lado propõe o contrário de " + lowerFirst(c) + ".";
}
function reverseQuestion(text){
  const c = cleanP(text), low = c.toLowerCase();
  if(/^o que\b/.test(low)) return "E o que acontece depois disso?";
  if(/^como\b/.test(low)) return "E por que isso acontece dessa maneira?";
  if(/^por que\b/.test(low)) return "E o que faria isso acontecer?";
  if(/^quando\b/.test(low)) return "E o que acontece antes disso?";
  if(/^onde\b/.test(low)) return "E o que existe além desse lugar?";
  if(/^quem\b/.test(low)) return "E quem responde por isso?";
  if(/^qual\b/.test(low)) return "E qual seria a possibilidade contrária?";
  const w = srcWord(), p = srcPrep();
  if(w && p) return "E se " + p + " " + w + " essa ideia pudesse ser vista de outro modo?";
  return "E se " + lowerFirst(c) + " pudesse ser visto de outra maneira?";
}
function alphaAbout(text){
  const c = cleanP(text), w = srcWord(), cn = srcConn();
  if(w && cn) return "Eu afirmo que " + lowerFirst(c) + ", " + cn + " " + w + " permanece dentro da questão.";
  return "Eu afirmo que " + lowerFirst(c) + " merece continuar sendo observado.";
}
function alphaAnswer(q){
  const c = cleanP(q), w = srcWord(), p = srcPrep();
  if(w && p) return "Eu respondo afirmando que " + lowerFirst(c) + " pode ser compreendido " + p + " " + w + ".";
  return "Eu respondo afirmando que " + lowerFirst(c) + " já contém uma possibilidade de resposta.";
}
const PAT = [5,3,6,9,7]; let patIdx = 0;
function nextArch(){
  const list = window.ARCH_LIST, i = list.indexOf(window.getArch());
  return list[(i + PAT[patIdx++ % PAT.length]) % list.length];
}
function archColor(n){ const m = window.ARCH_MAP; return (m && m[n]) ? `var(${m[n].tok})` : "var(--active-color)"; }
function createCycle(){
  if(!state.units.length) state.units = splitText(source.value);
  if(!state.units.length){ window.KBLX_TOAST?.("Insira um texto primeiro."); return false; }
  const arch = nextArch();
  const seed = state.units[state.index % state.units.length]; state.index++;
  const alpha = seed.type === "question" ? alphaAnswer(seed.text) : alphaAbout(seed.text);
  pushMessage("alpha", alpha, seed.type === "question" ? "resposta" : "semente", arch);
  const betaInv = invert(alpha); pushMessage("beta", betaInv, "inversa", arch);
  const betaQ = reverseQuestion(betaInv); pushMessage("beta", betaQ, "pergunta", arch);
  const alphaF = alphaAnswer(betaQ); pushMessage("alpha", alphaF, "afirmação", arch);
  state.cycle++;
  if(roundLabel) roundLabel.textContent = state.cycle + (state.cycle === 1 ? " ciclo" : " ciclos");
  updateNavDots();
  window.applyArch?.(arch);
  window.__sbSync?.(arch);
  window.KBLX_SAVE?.();
  return true;
}
function pushMessage(role, text, type, arch){
  const item = { role, text, type, arch, ts:Date.now() };
  state.history.push(item);
  renderMessage(item, state.history.length - 1);
  maybeScrollChat();
}
function maybeScrollChat(){
  if(!chatWindow) return;
  if((chatWindow.scrollHeight - chatWindow.scrollTop - chatWindow.clientHeight) < 200)
    requestAnimationFrame(() => { chatWindow.scrollTop = chatWindow.scrollHeight; });
}
function forceScrollChat(){ if(chatWindow) requestAnimationFrame(() => { chatWindow.scrollTop = chatWindow.scrollHeight; }); }
function renderMessage(item, idx){
  const el = document.createElement("article");
  el.className = "message " + item.role;
  el.dataset.arch = item.arch; el.dataset.idx = idx;
  el.style.setProperty("--arch-color", archColor(item.arch));
  const who = item.role === "alpha" ? "α ALFA" : "β BETA";
  const chip = `<span class="arch-chip"><i></i>${item.arch}</span>`;
  el.innerHTML = `<div class="msg-top"><span class="msg-who">${who}</span>${chip}<span class="msg-type">${item.type}</span></div><div class="msg-text"></div><div class="msg-actions"><button class="msg-mini" data-act="speak">◉ OUVIR</button><button class="msg-mini" data-act="copy">⧉ COPIAR</button><button class="msg-mini slicer" data-act="slicer">→ SLICER</button></div>`;
  el.querySelector(".msg-text").textContent = item.text;
  const speakBtn = el.querySelector('[data-act="speak"]');
  let lpTimer = null, lpFired = false;
  speakBtn.addEventListener("pointerdown", e => {
    e.preventDefault(); lpFired = false;
    lpTimer = setTimeout(() => {
      lpFired = true;
      speakSingle(item.text, el);
      if(navigator.vibrate) try{ navigator.vibrate(12); }catch(_){}
    }, 500);
  });
  speakBtn.addEventListener("pointerup", () => { clearTimeout(lpTimer); if(!lpFired) speakFromIndex(idx); });
  speakBtn.addEventListener("pointerleave", () => clearTimeout(lpTimer));
  speakBtn.addEventListener("pointercancel", () => clearTimeout(lpTimer));
  speakBtn.addEventListener("contextmenu", e => e.preventDefault());
  el.querySelector('[data-act="copy"]').addEventListener("click", async () => {
    try{ await navigator.clipboard.writeText(item.text); window.KBLX_TOAST?.("Copiado ✓"); }catch(_){}
  });
  el.querySelector('[data-act="slicer"]').addEventListener("click", () => {
    const header = `# ${who} · ${item.arch}\n_${item.type}_\n\n`;
    window.Nebula?.loadDocument(header + item.text, `${who} · ${item.arch}`);
    window.KBLX_TOAST?.("Enviado ✓");
    document.getElementById("s0")?.scrollIntoView({ behavior:"smooth", block:"start" });
  });
  conversation.appendChild(el);
}
function renderBank(){
  const b = state.bank;
  const all = [...b.prepositions, ...b.connectors, ...b.pronouns, ...b.articles, ...b.verbs, ...b.words];
  const tok = (arr, cls) => arr.map(x => `<span class="token ${cls}">${x}</span>`).join("");
  if(lexicalBank) lexicalBank.innerHTML = tok(b.prepositions,"prep") + tok(b.connectors,"conn") + tok(b.pronouns,"pron") + tok(b.articles,"word") + tok(b.verbs,"word") + tok(b.words,"word");
  if(bankInfo) bankInfo.textContent = all.length + " elementos";
}
function updateNavDots(){ document.querySelectorAll(".nav-dot").forEach((d,i) => d.classList.toggle("on", i === state.cycle % 3)); }
function speakSingle(text, el){
  if(!("speechSynthesis" in window)){ window.KBLX_TOAST?.("Áudio indisponível"); return; }
  speechSynthesis.cancel();
  document.querySelectorAll(".message.playing").forEach(x => x.classList.remove("playing"));
  if(el) el.classList.add("playing");
  const arch = el?.dataset.arch || window.getArch();
  const u = window.KBLX_VOICE ? window.KBLX_VOICE.forArch(arch, text) : new SpeechSynthesisUtterance(text);
  const orb = document.getElementById("sbOrb");
  orb?.classList.add("speaking");
  u.onend = u.onerror = () => { if(el) el.classList.remove("playing"); orb?.classList.remove("speaking"); };
  speechSynthesis.speak(u);
  window.KBLX_TOAST?.(`🎙 ${arch} · bloco`);
}
let speakIdx = 0, speaking = false;
function speakFromIndex(startIdx){
  if(!("speechSynthesis" in window)){ window.KBLX_TOAST?.("Áudio indisponível"); return; }
  if(!state.history.length){ window.KBLX_TOAST?.("Gere a conversa primeiro"); return; }
  speechSynthesis.cancel();
  document.querySelectorAll(".message.playing").forEach(x => x.classList.remove("playing"));
  speaking = true; speakIdx = startIdx;
  document.getElementById("sbOrb")?.classList.add("speaking");
  speakNext();
}
function speakConversation(){ speakFromIndex(0); }
function speakNext(){
  if(!speaking || speakIdx >= state.history.length){
    speaking = false;
    document.getElementById("sbOrb")?.classList.remove("speaking");
    return;
  }
  const item = state.history[speakIdx];
  const el = conversation.querySelectorAll(".message")[speakIdx];
  if(el){
    el.classList.add("playing");
    el.scrollIntoView({ behavior:"smooth", block:"center" });
    window.applyArch?.(item.arch);
  }
  const u = window.KBLX_VOICE ? window.KBLX_VOICE.forArch(item.arch, item.text) : new SpeechSynthesisUtterance(item.text);
  u.onend = u.onerror = () => { if(el) el.classList.remove("playing"); speakIdx++; speakNext(); };
  speechSynthesis.speak(u);
}
$("#stepBtn")?.addEventListener("click", async () => {
  if(generating) return;
  if(!state.bank.words.length) extractBank(source.value);
  if(!state.units.length) state.units = splitText(source.value);
  if(!state.units.length){ window.KBLX_TOAST?.("Insira um texto primeiro."); return; }
  generating = true;
  try {
    const N = 15;
    for(let i = 0; i < N; i++){ createCycle(); await new Promise(r => setTimeout(r, 60)); }
    window.KBLX_TOAST?.(`${N} ciclos gerados ⇄`);
    forceScrollChat();
  } finally { generating = false; }
});
$("#navStep")?.addEventListener("click", () => $("#stepBtn")?.click());
$("#generateBtn")?.addEventListener("click", generateAll);
$("#parseBtn")?.addEventListener("click", () => {
  const u = splitText(source.value);
  if(!u.length){ window.KBLX_TOAST?.("Nenhum texto"); return; }
  state.units = u; state.index = 0; extractBank(source.value);
  window.KBLX_TOAST?.(u.length + " unidades · banco criado ✓");
});
$("#pasteBtn")?.addEventListener("click", async () => {
  try {
    const t = await navigator.clipboard.readText();
    if(!t){ window.KBLX_TOAST?.("Clipboard vazio"); return; }
    source.value = t; updateCounter();
    $("#parseBtn")?.click();
    window.KBLX_TOAST?.("Colado ✓");
  } catch(_){ window.KBLX_TOAST?.("Use colar do sistema"); }
});
$("#listenBtn")?.addEventListener("click", speakConversation);
async function generateAll(){
  if(generating) return;
  const units = splitText(source.value);
  if(!units.length){ window.KBLX_TOAST?.("Cole um texto"); source.focus(); return; }
  extractBank(source.value);
  state.units = units; state.index = 0; state.cycle = 0; state.history = [];
  conversation.innerHTML = "";
  generating = true;
  try {
    for(let i = 0; i < units.length; i++){ createCycle(); await new Promise(r => setTimeout(r, 45)); }
    window.KBLX_TOAST?.(`${units.length} ciclos gerados ✓`);
    forceScrollChat();
  } finally { generating = false; }
}
function updateCounter(){
  const n = source.value.length;
  if(counter) counter.textContent = n + (n === 1 ? " caractere" : " caracteres");
}
source.addEventListener("input", updateCounter);
if(!source.value){
  source.value = `Uma ideia começa pequena.
Ela encontra outra ideia?
Quando duas ideias conversam, algo muda.
O futuro precisa ser diferente?
Talvez a resposta esteja na própria pergunta.`;
  updateCounter();
}
document.getElementById("importBtn")?.addEventListener("click", () => document.getElementById("importSource")?.click());
document.getElementById("importSource")?.addEventListener("change", async e => {
  const f = e.target.files[0]; if(!f) return;
  try {
    const txt = await f.text();
    source.value = txt; updateCounter();
    state.units = splitText(txt); state.index = 0; extractBank(txt);
    window.KBLX_TOAST?.(`Importado: ${f.name} ✓`);
  } catch(_){ window.KBLX_TOAST?.("Falha ao ler"); }
  e.target.value = "";
});
document.getElementById("sendSlicerBtn")?.addEventListener("click", () => {
  const txt = source.value.trim();
  if(!txt){ window.KBLX_TOAST?.("Nada para enviar"); return; }
  window.Nebula?.loadDocument(txt, "Polo");
  window.KBLX_TOAST?.("Enviado ✓");
  document.getElementById("s0")?.scrollIntoView({ behavior:"smooth" });
});
document.getElementById("allToSlicerBtn")?.addEventListener("click", () => {
  if(!state.history.length){ window.KBLX_TOAST?.("Sem conversa"); return; }
  const md = state.history.map(m => {
    const who = m.role === "alpha" ? "ALFA" : "BETA";
    return `# ${who} · ${m.arch}\n_${m.type}_\n\n${m.text}`;
  }).join("\n\n---\n\n");
  window.Nebula?.loadDocument(md, "Conversa");
  window.KBLX_TOAST?.("Enviado ✓");
  document.getElementById("s0")?.scrollIntoView({ behavior:"smooth" });
});
window.AlfaBetaState = state;
window.KBLX_ACTIONS = {
  speak: speakConversation,
  speakFrom: speakFromIndex,
  stop(){
    speaking = false;
    if("speechSynthesis" in window) speechSynthesis.cancel();
    document.querySelectorAll(".message.playing").forEach(x => x.classList.remove("playing"));
    document.getElementById("sbOrb")?.classList.remove("speaking");
  }
};
window.KBLX_REBUILD_DIALOGUE = function(saved){
  if(!saved?.history?.length) return;
  state.units = saved.units || [];
  state.index = saved.index || 0;
  state.cycle = saved.cycle || 0;
  state.history = saved.history || [];
  state.bank = saved.bank || state.bank;
  conversation.innerHTML = "";
  state.history.forEach((item, i) => renderMessage(item, i));
  if(roundLabel) roundLabel.textContent = state.cycle + (state.cycle === 1 ? " ciclo" : " ciclos");
  if(saved.sourceText){ source.value = saved.sourceText; updateCounter(); }
  renderBank();
  forceScrollChat();
};
})();

/* ─────────────────────────────────────────────────────────────────────
   14. CHAT + DECK (App)
   ───────────────────────────────────────────────────────────────────── */
(function(){
"use strict";
const STORAGE = {
  API_KEY:"di_apiKey", MODEL:"di_modelName", SYSTEM_ROLE:"di_systemRole",
  USER_ID:"di_userName", CUSTOM_CSS:"di_customCss",
};
const $ = id => document.getElementById(id);
const App = {
  state:{ open:false, messages:[], isProcessing:false, isListening:false, recognition:null },
  init(){
    const s = localStorage;
    if($("apiKeyInput")) $("apiKeyInput").value = s.getItem(STORAGE.API_KEY) || "";
    const baseRole = s.getItem(STORAGE.SYSTEM_ROLE) || "Você é Dual.";
    if($("systemRoleInput")) $("systemRoleInput").value = baseRole;
    if($("inputUserId") && !$("inputUserId").value) $("inputUserId").value = s.getItem(STORAGE.USER_ID) || "";
    if($("inputModel") && !$("inputModel").value) $("inputModel").value = s.getItem(STORAGE.MODEL) || "";
    this.setupVoice();
    this.bindEvents();
    this.updateUI();
    this.toggleField(false, true);
    this.renderDeck();
    setTimeout(() => this.announce("KOBLLUX v15. Memória ativa."), 1200);
    if(typeof particlesJS !== "undefined"){
      particlesJS("particles-js", {
        particles:{
          number:{ value:24 }, color:{ value:["#0ff","#f0f"] }, shape:{ type:"circle" },
          opacity:{ value:0.4 }, size:{ value:2.4 },
          line_linked:{ enable:true, distance:150, color:"#ffffff", opacity:0.4, width:1 },
          move:{ enable:true, speed:1.5 }
        },
        retina_detect:true
      });
    }
  },
  setupVoice(){
    if(!("webkitSpeechRecognition" in window)) return;
    this.state.recognition = new webkitSpeechRecognition();
    this.state.recognition.lang = "pt-BR";
    this.state.recognition.continuous = true;
    this.state.recognition.interimResults = true;
    this.state.recognition.onstart = () => { this.state.isListening = true; $("btnVoice")?.classList.add("listening"); this.showToast("🎙️ Voz ativa..."); };
    this.state.recognition.onend = () => { if(this.state.isListening){ try{ this.state.recognition.start(); }catch(_){} } else $("btnVoice")?.classList.remove("listening"); };
    this.state.recognition.onresult = e => { let t = ""; for(let i = e.resultIndex; i < e.results.length; ++i) t += e.results[i][0].transcript; const u = $("userInput"); if(u) u.value = t; };
    this.state.recognition.onerror = e => { if(e.error !== "no-speech"){ this.state.isListening = false; $("btnVoice")?.classList.remove("listening"); } };
  },
  toggleVoice(){
    if(!this.state.recognition) return;
    if(this.state.isListening){ this.state.isListening = false; this.state.recognition.stop(); }
    else { window.speechSynthesis.cancel(); const u = $("userInput"); if(u) u.value = ""; try{ this.state.recognition.start(); }catch(_){} }
  },
  bindEvents(){
    if($("btnSend")) $("btnSend").onclick = () => this.handleSend();
    if($("userInput")) $("userInput").onkeypress = e => { if(e.key === "Enter") this.handleSend(); };
    if($("field-toggle-handle")) $("field-toggle-handle").onclick = () => this.toggleField();
    if($("btnCrystallize")) $("btnCrystallize").onclick = () => this.crystallizeSession();
    if($("inputUserId")) $("inputUserId").onchange = e => { localStorage.setItem(STORAGE.USER_ID, e.target.value); this.updateUI(); };
    if($("btnSaveConfig")) $("btnSaveConfig").onclick = () => {
      localStorage.setItem(STORAGE.API_KEY, $("apiKeyInput").value);
      localStorage.setItem(STORAGE.SYSTEM_ROLE, $("systemRoleInput").value);
      this.indexedDB.saveCustomCSS($("customCssInput").value);
      window.toggleDrawer?.("drawerSettings");
      this.announce("Salvo");
    };
    if($("btnSettings")) $("btnSettings").onclick = () => window.toggleDrawer?.("drawerSettings");
    if($("btnDeck")) $("btnDeck").onclick = () => { window.toggleDrawer?.("drawerDeck"); this.renderDeck(); };
    if($("btnClearCss")) $("btnClearCss").onclick = () => this.indexedDB.clearAsset(STORAGE.CUSTOM_CSS);
    if($("btnVoice")) $("btnVoice").onclick = () => this.toggleVoice();
    this.setupFileUpload();
  },
  setupFileUpload(){
    const input = $("fileUploadInput"); if(!input) return;
    if($("btnUploadFile")) $("btnUploadFile").onclick = () => input.click();
    input.onchange = e => {
      const file = e.target.files[0]; if(!file) return;
      const preview = $("filePreview");
      if(preview){
        const span = preview.querySelector(".file-info span");
        if(span) span.textContent = file.name;
        preview.classList.add("active");
      }
    };
  },
  async handleSend(){
    const input = $("userInput");
    const txt = input?.value.trim();
    if(!txt || this.state.isProcessing) return;
    if(txt.toLowerCase() === "/atlas"){
      input.value = "";
      this.addMessage("user", txt);
      let rep = "### ♾️ ATLAS KODUX\n";
      const ARQ = { Atlas:"Planejador", Nova:"Inspira", Vitalis:"Momentum", Pulse:"Emocional", Artemis:"Descoberta", Serena:"Cuidado", Kaos:"Transformador", Genus:"Fabricus", Lumine:"Alegria", Solus:"Sabedoria", Rhea:"Vínculo", Aion:"Tempo" };
      for(const [k, v] of Object.entries(ARQ)) rep += `- **${k}**: ${v}\n`;
      this.addMessage("ai", rep);
      return;
    }
    input.value = "";
    this.addMessage("user", txt);
    this.state.isProcessing = true;
    const key = localStorage.getItem(STORAGE.API_KEY);
    if(!key && !$("inputModel")?.value.includes(":free")){ this.announce("Erro: API Key."); this.state.isProcessing = false; return; }
    try {
      document.body.classList.add("loading");
      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method:"POST",
        headers:{ "Authorization":`Bearer ${key}`, "Content-Type":"application/json", "HTTP-Referer":location.origin },
        body: JSON.stringify({
          model: $("inputModel")?.value,
          messages:[
            { role:"system", content: $("systemRoleInput")?.value || "Você é Dual." },
            ...this.state.messages.slice(-10).map(m => ({ role:m.role, content:m.content })),
            { role:"user", content:txt }
          ]
        })
      });
      const data = await res.json();
      const aiContent = data.choices?.[0]?.message?.content || "Sem sinal.";
      this.addMessage("ai", aiContent);
    } catch(e){ this.announce("Erro conexão."); }
    finally {
      document.body.classList.remove("loading");
      this.state.isProcessing = false;
      this.toggleField(this.state.open, true);
    }
  },
  addMessage(role, text){
    const c = $("chat-container"); if(!c) return;
    const d = document.createElement("div");
    d.className = `msg-block ${role}`; d.dataset.raw = text || "";
    const html = role === "ai" && typeof marked !== "undefined" ? marked.parse(text) : String(text).replace(/\n/g, "<br>");
    d.innerHTML = html + `<div class="msg-tools">
      <button class="tool-btn" onclick="App.copyMsg(this)" title="Copiar">⧉</button>
      <button class="tool-btn" onclick="App.speakMsg(this)" title="Ouvir">◉</button>
    </div>`;
    this.state.messages.push({ role: role === "ai" ? "assistant" : "user", content:text });
    c.appendChild(d); c.scrollTop = c.scrollHeight;
  },
  copyMsg(btn){
    const b = btn.closest(".msg-block");
    if(b) navigator.clipboard.writeText(b.innerText.replace("⧉","").replace("◉","").trim());
    this.showToast("Copiado");
  },
  speakMsg(btn){
    const b = btn.closest(".msg-block");
    if(b) this.speakText(b.innerText.replace("⧉","").replace("◉","").trim());
  },
  speakText(text){
    if(!text || this.state.isListening) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "pt-BR"; u.rate = 1.1;
    window.speechSynthesis.speak(u);
  },
  announce(m){ this.showToast(m); },
  showToast(m, err){
    const t = $("nv-toast"); if(!t) return;
    t.textContent = m;
    t.style.borderLeft = err ? "4px solid #f44" : "4px solid var(--primary)";
    t.classList.add("show");
    setTimeout(() => t.classList.remove("show"), 3000);
    this.speakText(m);
  },
  updateUI(){ if($("usernameDisplay")) $("usernameDisplay").textContent = $("inputUserId")?.value || ""; },
  toggleField(f, silent){
    this.state.open = f !== undefined ? f : !this.state.open;
    $("chat-container")?.classList.toggle("collapsed", !this.state.open);
    document.body.classList.toggle("field-closed", !this.state.open);
  },
  async crystallizeSession(){
    if(!this.state.messages.length){ this.announce("Vazio não cristaliza."); return; }
    const title = this.state.messages.find(m => m.role === "user")?.content.substring(0, 30) || "Memória";
    await this.indexedDB.saveDeckItem({ id:Date.now(), date:new Date().toLocaleString(), title:title + "...", data:[...this.state.messages] });
    await this.renderDeck();
    this.announce("Memória salva.");
    if(!$("drawerDeck")?.classList.contains("open")) window.toggleDrawer?.("drawerDeck");
  },
  async renderDeck(){
    const items = await this.indexedDB.getDeck();
    const c = $("deckList"); if(!c) return;
    if(!items?.length){ c.innerHTML = '<div style="text-align:center;color:var(--text-muted);margin-top:20px">O vazio reina aqui.</div>'; return; }
    c.innerHTML = items.sort((a, b) => b.id - a.id).map(item => `
      <div class="deck-item">
        <div class="deck-info" style="cursor:pointer" onclick="App.restoreMemory(${item.id})">
          <h4>${item.title}</h4>
          <span>${item.date} • ${item.data.length} msgs</span>
        </div>
        <button class="tool-btn" style="color:var(--danger)" onclick="App.deleteMemory(${item.id})">✕</button>
      </div>`).join("");
  },
  async restoreMemory(id){
    const items = await this.indexedDB.getDeck();
    const item = items.find(i => i.id === id);
    if(!item) return;
    const c = $("chat-container"); if(c) c.innerHTML = "";
    this.state.messages = [];
    item.data.forEach(m => this.addMessage(m.role === "assistant" ? "ai" : "user", m.content));
    window.toggleDrawer?.("drawerDeck");
    this.announce("Memória restaurada.");
  },
  async deleteMemory(id){
    if(!confirm("Fragmentar cristal?")) return;
    await this.indexedDB.deleteDeckItem(id);
    this.renderDeck();
  },
  indexedDB:{
    async getDB(){
      return new Promise((res, rej) => {
        const q = indexedDB.open("InfodoseDB", 2);
        q.onupgradeneeded = e => {
          const d = e.target.result;
          if(!d.objectStoreNames.contains("assets")) d.createObjectStore("assets", { keyPath:"id" });
          if(!d.objectStoreNames.contains("deck")) d.createObjectStore("deck", { keyPath:"id" });
        };
        q.onsuccess = e => res(e.target.result);
        q.onerror = rej;
      });
    },
    async putAsset(i, d){ (await this.getDB()).transaction(["assets"],"readwrite").objectStore("assets").put({ id:i, ...d }); },
    async getAsset(i){
      return new Promise(async res => {
        (await this.getDB()).transaction(["assets"]).objectStore("assets").get(i).onsuccess = e => res(e.target.result);
      });
    },
    async clearAsset(i){
      (await this.getDB()).transaction(["assets"],"readwrite").objectStore("assets").delete(i);
      if(i === STORAGE.CUSTOM_CSS && $("custom-styles")) $("custom-styles").textContent = "";
    },
    async saveCustomCSS(c){ await this.putAsset(STORAGE.CUSTOM_CSS, { css:c }); this.loadCustomCSS(); },
    async loadCustomCSS(){
      const d = await this.getAsset(STORAGE.CUSTOM_CSS);
      if(d?.css){
        if($("custom-styles")) $("custom-styles").textContent = d.css;
        if($("customCssInput")) $("customCssInput").value = d.css;
      }
    },
    async saveDeckItem(i){ (await this.getDB()).transaction(["deck"],"readwrite").objectStore("deck").put(i); },
    async getDeck(){
      return new Promise(async res => {
        (await this.getDB()).transaction(["deck"]).objectStore("deck").getAll().onsuccess = e => res(e.target.result);
      });
    },
    async deleteDeckItem(i){ (await this.getDB()).transaction(["deck"],"readwrite").objectStore("deck").delete(i); },
  }
};
window.App = App;
window.addEventListener("load", () => App.init());
})();

/* ─────────────────────────────────────────────────────────────────────
   15. SYMBOL BAR
   ───────────────────────────────────────────────────────────────────── */
(function(){
"use strict";
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];

window.addEventListener("load", () => setTimeout(() => document.getElementById("loader")?.classList.add("hide"), 600));
let ticking = false;
function updProgress(){
  const doc = document.documentElement;
  const p = document.getElementById("progress");
  if(p) p.style.width = ((window.scrollY / (doc.scrollHeight - window.innerHeight)) * 100) + "%";
}
window.addEventListener("scroll", () => {
  if(!ticking){ requestAnimationFrame(() => { updProgress(); ticking = false; }); ticking = true; }
}, { passive:true });
updProgress();
if("IntersectionObserver" in window){
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if(e.isIntersecting){
        e.target.classList.add("in");
        const idx = $$(".section").indexOf(e.target);
        if(idx >= 0) $$(".nav-dot").forEach((d,i) => d.classList.toggle("on", i === idx));
      }
    });
  }, { threshold:0.15 });
  $$(".reveal").forEach(el => io.observe(el));
}

const ORDER = window.ARCH_LIST || [];
const MAP = window.ARCH_MAP || {};
const bar = $("#symbolBar"), carousel = $("#sbCarousel"), track = $("#sbTrack"), dots = $("#sbDots");
const orb = $("#sbOrb"), grip = $("#sbGrip");
if(!bar) return;
let sbIdx = 0;
function buildSb(){
  if(!track || !dots) return;
  track.innerHTML = ""; dots.innerHTML = "";
  ORDER.forEach((name, i) => {
    const a = MAP[name] || { sym:"∆", op:"0x00", tok:"--KBLX_B", hz:432 };
    const btn = document.createElement("button");
    btn.className = "sb-btn";
    btn.textContent = a.sym;
    btn.dataset.arch = name;
    btn.style.setProperty("--btn-c", `var(${a.tok})`);
    btn.title = `${name} · ${a.hz}Hz`;
    btn.addEventListener("click", () => {
      sbIdx = i; centerSb(true);
      window.applyArch(name);
      const r = btn.getBoundingClientRect();
      window.KBLX_RIPPLE((r.left + r.width/2)/window.innerWidth*100, (r.top + r.height/2)/window.innerHeight*100);
    });
    track.appendChild(btn);
    const dot = document.createElement("span");
    dot.className = "sb-dot" + (i === 0 ? " on" : "");
    dot.addEventListener("click", () => { sbIdx = i; centerSb(true); window.applyArch(name); });
    dots.appendChild(dot);
  });
}
function centerSb(useScroll){
  if(!track || !carousel) return;
  const btn = track.children[sbIdx]; if(!btn) return;
  [...dots.children].forEach((d,i) => d.classList.toggle("on", i === sbIdx));
  [...track.children].forEach((b,i) => b.classList.toggle("on", i === sbIdx));
  if(useScroll){
    const targetTop = btn.offsetTop - (carousel.clientHeight - btn.offsetHeight)/2;
    carousel.scrollTo({ top:Math.max(0, targetTop), behavior:"smooth" });
  }
}
window.__sbSync = function(name){
  const i = ORDER.indexOf(name);
  if(i >= 0){ sbIdx = i; centerSb(true); }
};
if(carousel){
  let sT = null;
  carousel.addEventListener("scroll", () => {
    clearTimeout(sT);
    sT = setTimeout(() => {
      const center = carousel.scrollTop + carousel.clientHeight/2;
      let best = 0, bd = Infinity;
      [...track.children].forEach((b,i) => {
        const bc = b.offsetTop + b.offsetHeight/2;
        const d = Math.abs(bc - center);
        if(d < bd){ bd = d; best = i; }
      });
      if(best !== sbIdx){
        sbIdx = best;
        [...dots.children].forEach((d,i) => d.classList.toggle("on", i === sbIdx));
        [...track.children].forEach((b,i) => b.classList.toggle("on", i === sbIdx));
      }
    }, 80);
  }, { passive:true });
}
$("#sbToggle")?.addEventListener("click", e => {
  e.stopPropagation();
  const c = bar.classList.toggle("collapsed");
  const t = $("#sbToggle"); if(t) t.textContent = c ? "▼" : "▲";
  if(!c) setTimeout(() => centerSb(false), 150);
});
let pressTimer = null, longFired = false, orbPatIdx = 0;
const ORB_PATTERN = [5,3,6,9,7];
function orbCycle3697(){
  const list = window.ARCH_LIST || []; if(!list.length) return;
  const step = ORB_PATTERN[orbPatIdx++ % ORB_PATTERN.length];
  const cur = list.indexOf(window.getArch());
  const next = list[(cur + step) % list.length];
  const r = orb.getBoundingClientRect();
  window.applyArch(next, { x:(r.left + r.width/2)/window.innerWidth*100, y:(r.top + r.height/2)/window.innerHeight*100 });
  window.__sbSync(next);
  window.KBLX_TOAST?.(`∆³ ${next} · +${step}`);
}
orb?.addEventListener("pointerdown", e => {
  e.preventDefault(); longFired = false;
  const r = orb.getBoundingClientRect();
  window.KBLX_RIPPLE((r.left + r.width/2)/window.innerWidth*100, (r.top + r.height/2)/window.innerHeight*100);
  pressTimer = setTimeout(() => {
    longFired = true;
    openWheel();
    if(navigator.vibrate) try{ navigator.vibrate(15); }catch(_){}
  }, 800);
});
orb?.addEventListener("pointerup", () => { clearTimeout(pressTimer); if(!longFired) orbCycle3697(); });
orb?.addEventListener("pointerleave", () => clearTimeout(pressTimer));
orb?.addEventListener("pointercancel", () => clearTimeout(pressTimer));
orb?.addEventListener("contextmenu", e => e.preventDefault());

let dragging = false, sx = 0, sy = 0, ox = 0, oy = 0;
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
grip?.addEventListener("pointerdown", e => {
  e.preventDefault(); e.stopPropagation();
  bar.classList.remove("snap-left","snap-right","snap-top","snap-bottom");
  dragging = true; sx = e.clientX; sy = e.clientY;
  const r = bar.getBoundingClientRect(); ox = r.left; oy = r.top;
  bar.style.transform = "none";
  bar.style.top = oy + "px"; bar.style.left = ox + "px";
  bar.style.right = "auto"; bar.style.bottom = "auto";
  bar.classList.add("is-dragging");
  try{ grip.setPointerCapture(e.pointerId); }catch(_){}
});
grip?.addEventListener("pointermove", e => {
  if(!dragging) return;
  bar.style.left = (ox + e.clientX - sx) + "px";
  bar.style.top = (oy + e.clientY - sy) + "px";
});
function endDrag(e){
  if(!dragging) return;
  dragging = false;
  bar.classList.remove("is-dragging");
  const vw = window.innerWidth, vh = window.innerHeight;
  const r = bar.getBoundingClientRect();
  bar.classList.remove("snap-left","snap-right","snap-top","snap-bottom");
  const headerH = 100;
  if(r.top < 100){
    bar.classList.add("snap-top");
    bar.style.top = ""; bar.style.bottom = "auto";
    bar.style.left = ""; bar.style.right = "8px"; bar.style.transform = "";
  } else if(r.bottom > vh - 100){
    bar.classList.add("snap-bottom");
    bar.style.top = "auto"; bar.style.bottom = "";
    bar.style.left = ""; bar.style.right = "8px"; bar.style.transform = "";
  } else {
    bar.style.top = clamp(r.top, headerH, vh - r.height - 80) + "px";
    bar.style.bottom = "auto"; bar.style.transform = "";
    if(r.left + r.width/2 < vw/2){ bar.classList.add("snap-left"); bar.style.left = "0"; bar.style.right = "auto"; }
    else { bar.classList.add("snap-right"); bar.style.right = "0"; bar.style.left = "auto"; }
  }
  try{ grip.releasePointerCapture(e.pointerId); }catch(_){}
  window.KBLX_SAVE?.();
}
grip?.addEventListener("pointerup", endDrag);
grip?.addEventListener("pointercancel", endDrag);

function unifiedPlay(){
  const nb = window.Nebula;
  if(nb?.hasSlices?.()) nb.toggleSpeech();
  else window.KBLX_ACTIONS?.speak();
}
function unifiedStop(){
  window.Nebula?.stopSpeech?.();
  window.KBLX_ACTIONS?.stop?.();
  window.KBLX_TOAST?.("Parado");
}
$("#sbSpeak")?.addEventListener("click", unifiedPlay);
$("#sbStop")?.addEventListener("click", unifiedStop);
$("#sbCopy")?.addEventListener("click", async () => {
  const hist = window.AlfaBetaState?.history || [];
  if(!hist.length){ window.KBLX_TOAST?.("Sem conversa"); return; }
  const txt = hist.map(m => `${m.role === "alpha" ? "ALFA" : "BETA"} [${m.arch}]: ${m.text}`).join("\n\n");
  try{ await navigator.clipboard.writeText(txt); window.KBLX_TOAST?.("Copiado ✓"); }catch(_){}
});
$("#sbClear")?.addEventListener("click", () => {
  window.KBLX_ACTIONS?.stop();
  if(window.Nebula?.hasSlices?.()) window.Nebula.clear();
  const st = window.AlfaBetaState;
  if(st){
    st.units = []; st.index = 0; st.cycle = 0; st.history = [];
    st.bank = { prepositions:[], connectors:[], pronouns:[], articles:[], verbs:[], words:[], questions:[] };
  }
  const conv = document.getElementById("conversation");
  if(conv) conv.innerHTML = '<div class="empty">O diálogo ainda não nasceu.</div>';
  const lex = document.getElementById("lexicalBank");
  if(lex) lex.innerHTML = '<span style="color:var(--DIM);font-size:11px">EXTRAIR BANCO para começar.</span>';
  const bi = document.getElementById("bankInfo"); if(bi) bi.textContent = "aguardando";
  const rl = document.getElementById("roundLabel"); if(rl) rl.textContent = "0 ciclos";
  const src = document.getElementById("sourceText"); if(src) src.value = "";
  const cnt = document.getElementById("counter"); if(cnt) cnt.textContent = "0 caracteres";
  window.KBLX_TOAST?.("Sistema reiniciado ✓");
  window.KBLX_SAVE?.();
});
$("#sbDownload")?.addEventListener("click", () => {
  const hist = window.AlfaBetaState?.history || [];
  if(!hist.length){ window.KBLX_TOAST?.("Sem conversa"); return; }
  const txt = hist.map(m => `${m.role === "alpha" ? "ALFA" : "BETA"} [${m.arch}]: ${m.text}`).join("\n\n");
  const payload = `KOBLLUX · ALFA⇄BETA · v15\n=========================\n\n${txt}\n\nGerado: ${new Date().toISOString()}`;
  const blob = new Blob([payload], { type:"text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = `kobllux-${Date.now()}.txt`;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  window.KBLX_TOAST?.("Download ✓");
});

const wheel = $("#archWheel");
if(wheel){
  ORDER.forEach(name => {
    const a = MAP[name] || { hz:432, sym:"∆", tok:"--KBLX_B" };
    const chip = document.createElement("button");
    chip.className = "arch-pick";
    chip.style.color = `var(${a.tok})`;
    chip.innerHTML = `<div class="a-orb" style="background:var(${a.tok})"></div><div class="a-name">${name}</div><div class="a-freq">${a.hz}Hz</div>`;
    chip.addEventListener("click", () => {
      const r = chip.getBoundingClientRect();
      window.applyArch(name, { x:(r.left + r.width/2)/window.innerWidth*100, y:(r.top + r.height/2)/window.innerHeight*100 });
      sbIdx = ORDER.indexOf(name); centerSb(true);
      closeWheel();
    });
    wheel.appendChild(chip);
  });
}
function openWheel(){ document.getElementById("arch-overlay")?.classList.add("open"); }
function closeWheel(){ document.getElementById("arch-overlay")?.classList.remove("open"); }
document.getElementById("arch-overlay")?.addEventListener("click", e => { if(e.target.id === "arch-overlay") closeWheel(); });
document.addEventListener("keydown", e => { if(e.key === "Escape") closeWheel(); });

const sbImport = document.getElementById("sbImportInput");
sbImport?.addEventListener("change", async e => {
  const f = e.target.files[0]; if(!f) return;
  try {
    const txt = await f.text();
    window.Nebula?.loadDocument(txt, f.name);
    window.KBLX_TOAST?.(`Slicer: ${f.name} ✓`);
    document.getElementById("s0")?.scrollIntoView({ behavior:"smooth" });
  } catch(_){ window.KBLX_TOAST?.("Falha"); }
  e.target.value = "";
});

(function(){
  const head = document.getElementById("sbExtrasHead"); if(!head) return;
  try{ if(localStorage.getItem("kobllux_sb_extras_hidden") === "1") bar.classList.add("extras-hidden"); }catch(_){}
  let lp = null, fired = false;
  head.addEventListener("pointerdown", () => {
    fired = false;
    lp = setTimeout(() => {
      fired = true;
      window.MXP?.openFactory();
      if(navigator.vibrate) try{ navigator.vibrate(15); }catch(_){}
    }, 550);
  });
  head.addEventListener("pointerup", () => clearTimeout(lp));
  head.addEventListener("pointerleave", () => clearTimeout(lp));
  head.addEventListener("click", e => {
    if(fired){ e.stopPropagation(); fired = false; return; }
    const hidden = bar.classList.toggle("extras-hidden");
    try{ localStorage.setItem("kobllux_sb_extras_hidden", hidden ? "1" : "0"); }catch(_){}
    window.KBLX_TOAST?.(hidden ? "Extras ocultos" : "Extras visíveis");
  });
})();

const MAIN_HDR = document.getElementById("main-header");
let lastY = 0, tick2 = false;
window.addEventListener("scroll", () => {
  if(tick2) return;
  requestAnimationFrame(() => {
    const y = window.scrollY;
    if(y <= 10) MAIN_HDR?.classList.remove("header-hidden");
    else if(y > lastY + 8) MAIN_HDR?.classList.add("header-hidden");
    else if(y < lastY - 8) MAIN_HDR?.classList.remove("header-hidden");
    lastY = y; tick2 = false;
  });
  tick2 = true;
}, { passive:true });

window.__sbGetPos = function(){
  return {
    top:bar.style.top, bottom:bar.style.bottom, left:bar.style.left, right:bar.style.right,
    snap:[...bar.classList].filter(c => c.startsWith("snap-")),
    collapsed:bar.classList.contains("collapsed"),
    extrasHidden:bar.classList.contains("extras-hidden"),
    carouselHidden:bar.classList.contains("carousel-hidden"),
  };
};
window.__sbRestore = function(pos){
  if(!pos) return;
  if(pos.top) bar.style.top = pos.top;
  if(pos.bottom) bar.style.bottom = pos.bottom;
  if(pos.left) bar.style.left = pos.left;
  if(pos.right) bar.style.right = pos.right;
  if(pos.snap) pos.snap.forEach(c => bar.classList.add(c));
  if(pos.collapsed){ bar.classList.add("collapsed"); const t = $("#sbToggle"); if(t) t.textContent = "▼"; }
  if(pos.extrasHidden) bar.classList.add("extras-hidden");
  if(pos.carouselHidden) bar.classList.add("carousel-hidden");
};

buildSb();
bar.classList.remove("collapsed");
const stBtn = $("#sbToggle"); if(stBtn) stBtn.textContent = "▲";
setTimeout(() => centerSb(true), 150);
})();

/* ─────────────────────────────────────────────────────────────────────
   16. PERSISTENCE
   ───────────────────────────────────────────────────────────────────── */
(function(){
"use strict";
const K = window.KBLX_KEYS;
window.KBLX_SAVE = function(){
  try {
    const modeClasses = ["mode-night","mode-day","mode-sunset"];
    const curMode = modeClasses.find(m => document.body.classList.contains(m)) || "mode-night";
    window.Store.set(K.ui, {
      mode:curMode,
      voiceArch:document.body.dataset.voiceArch,
      sessionHost:document.body.dataset.sessionHost,
      sb:window.__sbGetPos?.() || null,
    });
    window.Store.set(K.arch, window.getArch?.() || "JESUS");
    window.Store.set(K.bg, window.__bgState || {});
    window.Store.set(K.user, {
      id:document.getElementById("inputUserId")?.value || "",
      model:document.getElementById("inputModel")?.value || "",
      lastUrl:document.getElementById("urlInputNav")?.value || "",
    });
    if(window.AlfaBetaState){
      const st = window.AlfaBetaState;
      window.Store.set(K.dialog, {
        units:st.units, index:st.index, cycle:st.cycle, history:st.history, bank:st.bank,
        sourceText:document.getElementById("sourceText")?.value || "",
      });
    }
    if(window.Nebula?.state){
      window.Store.set(K.nebula, { raw:window.Nebula.state.raw || "", title:window.Nebula.state.title || "" });
    }
    if(window.MXP?.state){
      window.Store.set(K.mxp, window.MXP.state);
    }
    window.Store.set(K.root, { v:15, ts:Date.now(), NS:window.KBLX_NS });
  } catch(e){ console.warn("save error", e); }
};
window.KBLX_SNAPSHOT = function(){
  const snap = {};
  Object.entries(K).forEach(([k, key]) => {
    if(k !== "backup"){
      const v = window.Store.get(key);
      if(v != null) snap[k] = v;
    }
  });
  return snap;
};
window.KBLX_LOAD = function(){
  try {
    const root = window.Store.get(K.root);
    if(!root){
      document.dispatchEvent(new CustomEvent("kobllux:booted", { detail:{ fresh:true } }));
      return false;
    }
    const ui = window.Store.get(K.ui);
    if(ui){
      if(ui.mode){
        document.body.classList.remove("mode-night","mode-day","mode-sunset");
        document.body.classList.add(ui.mode);
      }
      if(ui.sessionHost){ document.body.dataset.sessionHost = ui.sessionHost; window.syncHostModeLabel?.(); }
      if(ui.sb && window.__sbRestore) window.__sbRestore(ui.sb);
      if(ui.voiceArch && window.applyArch) window.applyArch(ui.voiceArch);
    }
    const arch = window.Store.get(K.arch);
    if(arch && window.applyArch) window.applyArch(arch);
    const bg = window.Store.get(K.bg);
    if(bg){ window.__bgState = bg; window.__bgApply?.(); }
    const user = window.Store.get(K.user);
    if(user){
      const iu = document.getElementById("inputUserId"); if(iu && user.id) iu.value = user.id;
      const im = document.getElementById("inputModel"); if(im && user.model) im.value = user.model;
      const lu = document.getElementById("urlInputNav"); if(lu && user.lastUrl) lu.value = user.lastUrl;
    }
    const mxp = window.Store.get(K.mxp);
    if(mxp && window.MXP){ Object.assign(window.MXP.state, mxp); window.MXP.render(); }
    const dialog = window.Store.get(K.dialog);
    if(dialog && window.KBLX_REBUILD_DIALOGUE) window.KBLX_REBUILD_DIALOGUE(dialog);
    const nebula = window.Store.get(K.nebula);
    if(nebula?.raw && window.Nebula) window.Nebula.loadDocument(nebula.raw, nebula.title || "Documento");
    document.dispatchEvent(new CustomEvent("kobllux:booted", { detail:{ fresh:false } }));
    return true;
  } catch(e){ console.warn("load error", e); return false; }
};
let _sT = null;
window.KBLX_SAVE_DEBOUNCED = function(){ clearTimeout(_sT); _sT = setTimeout(() => window.KBLX_SAVE(), 400); };
window.addEventListener("beforeunload", () => window.KBLX_SAVE());
document.addEventListener("visibilitychange", () => { if(document.visibilityState === "hidden") window.KBLX_SAVE(); });
window.addEventListener("pagehide", () => window.KBLX_SAVE());

document.getElementById("exportState")?.addEventListener("click", () => {
  window.KBLX_SAVE();
  const snap = window.KBLX_SNAPSHOT();
  const blob = new Blob([JSON.stringify(snap, null, 2)], { type:"application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = `kobllux-backup-${Date.now()}.json`;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  window.KBLX_TOAST?.("Backup exportado ✓");
});
document.getElementById("importState")?.addEventListener("click", () => {
  const inp = document.createElement("input");
  inp.type = "file"; inp.accept = ".json,application/json";
  inp.addEventListener("change", async () => {
    const f = inp.files[0]; if(!f) return;
    try {
      const snap = JSON.parse(await f.text());
      if(!snap || !snap.root) return window.KBLX_TOAST?.("Backup inválido");
      Object.entries(snap).forEach(([k, v]) => {
        const key = K[k];
        if(key) window.Store.set(key, v);
      });
      window.KBLX_TOAST?.("Backup importado · recarregando…");
      setTimeout(() => location.reload(), 500);
    } catch(_){ window.KBLX_TOAST?.("Erro ao ler backup"); }
  });
  inp.click();
});
document.getElementById("resetAllState")?.addEventListener("click", () => {
  if(!confirm("Apagar TUDO?")) return;
  window.Store.clearAll();
  window.KBLX_TOAST?.("Tudo apagado · recarregando…");
  setTimeout(() => location.reload(), 500);
});
})();

/* ─────────────────────────────────────────────────────────────────────
   17. BOOT
   ───────────────────────────────────────────────────────────────────── */
(function(){
"use strict";
function boot(){
  const restored = window.KBLX_LOAD?.();
  if(!restored) window.MXP?._seed?.();
  window.SessionLifecycle?.rehydrateSessions?.();
  window.KBLX_restoreDockOnBoot?.();
  console.log("[KOBLLUX v15] boot completo · restored =", !!restored, "· sessions restauradas =", (window.MXP?.state?.sessions || []).length);
}
if(document.readyState === "loading"){
  document.addEventListener("DOMContentLoaded", () => setTimeout(boot, 100), { once:true });
} else {
  setTimeout(boot, 100);
}
})();