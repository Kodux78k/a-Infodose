/* ═══════════════════════════════════════════════════════════════════════
   KOBLLUX · ESTÁVEL v15
   CONTRATO DE DOMÍNIO — UM DONO POR DOMÍNIO
   Store        → window.Store / KBLX_KEYS       (só localStorage)
   Arch         → window.applyArch / getArch     (ARCH_LIST/ARCH_MAP)
   Voice        → window.KBLX_VOICE
   BG           → window.__bgState / __bgApply    (SÓ ele toca #bg-fake-custom)
   Dock         → window.KBLX_minimizeToDock     (SÓ ele cria .dock-bubble)
   Tabs         → window.TabStore / LinkHistory  (SÓ ele fala de abas)
   Session      → window.SessionLifecycle        (SÓ ele cria .session-window)
   Nebula       → window.Nebula / NebulaRender / NebulaRich
   Dialogue     → window.AlfaBetaState / KBLX_ACTIONS
   SymbolBar    → window.__sbSync / __sbGetPos / __sbRestore
   MXP          → window.MXP (factory, slots, fire)
   Chat/Deck    → window.App
   Persistência → window.KBLX_SAVE / KBLX_LOAD
   DELETADOS (e por quê):
   · DualSession (mxp-extras)          → SessionLifecycle assume
   · tabDataMap duplo do iFSw          → TabStore assume
   · dock bubble dentro do iFSw        → KBLX_minimizeToDock assume
   · indexedDB.loadBackground          → __bgApply assume
   · bgPanel's di_applyBackground      → __bgApply assume
   · App.setMode solar                 → Cockpit §F assume
   · markdownToHTML legado             → NebulaRender assume
   · __LEGACY_SESSION_BOUND            → não há mais legacy
   · handleSessionAction fallback      → SessionLifecycle assume
   · 3 resize binders                  → 1 binder unificado
   · 3 senders de "session:minimize"   → 1 (SessionLifecycle)
   ═══════════════════════════════════════════════════════════════════════ */

/* ═══ 1. CORE ═══════════════════════════════════════════════════════════ */
window.KBLX_NS = "kobllux";
window.KBLX_KEYS = {
  root:"kobllux:root", mxp:"kobllux:mxp", bg:"kobllux:bg",
  arch:"kobllux:arch", user:"kobllux:user", ui:"kobllux:ui",
  dialog:"kobllux:dialog", nebula:"kobllux:nebula", backup:"kobllux:backup",
  dock:"kobllux:dock", tabs:"kobllux:tabs", links:"kobllux:links",
};
window.Store = {
  get(k, fb=null){ try{ const v=localStorage.getItem(k); return v?JSON.parse(v):fb; }catch(_){ return fb; } },
  set(k, v){ try{ localStorage.setItem(k, JSON.stringify(v)); return true; }
             catch(e){ if(e.name==="QuotaExceededError") console.warn("[Store] quota", k);
                       return false; } },
  del(k){ try{ localStorage.removeItem(k); }catch(_){} },
  keys(){ return Object.values(window.KBLX_KEYS); },
  clearAll(){ this.keys().forEach(k=>this.del(k)); },
};

/* ═══ 2. ARCH ═══════════════════════════════════════════════════════════ */
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
function fireRipple(x,y){
  const r = document.getElementById("chromaRipple"); if(!r) return;
  r.style.setProperty("--ripple-x",(x??50)+"%");
  r.style.setProperty("--ripple-y",(y??50)+"%");
  r.classList.remove("fire"); void r.offsetWidth; r.classList.add("fire");
}
let toastTimer;
function toast(msg){
  const t = document.getElementById("toast"); if(!t) return;
  t.textContent = msg; t.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(()=>t.classList.remove("show"), 1600);
}
function applyArch(name, origin){
  const a = ARCH[name] || ARCH.JESUS;
  const c = tokVal(a.tok);
  const sec = (name==="JESUS"||name==="KOBLLUX") ? tokVal("--KBLX_F") : tokVal("--KBLX_I");
  root.style.setProperty("--active-color", c);
  root.style.setProperty("--active-secondary", sec);
  root.style.setProperty("--kob-voice-primary", c);
  root.style.setProperty("--kob-voice-secondary", sec);
  root.style.setProperty("--active-glow", c+"66");
  root.style.setProperty("--active-hz", a.hz);
  document.body.dataset.voiceArch = name.toLowerCase();
  const ph=document.getElementById("pillHz"), pa=document.getElementById("pillArch"),
        hud=document.getElementById("sbHud"), st=document.getElementById("sbStatus"),
        sb=document.getElementById("sbSub");
  if(ph) ph.textContent = a.hz+"Hz";
  if(pa) pa.textContent = name;
  if(hud) hud.textContent = a.op+" · "+name;
  if(st) st.textContent = `${a.op} · ${name}`;
  if(sb) sb.textContent = `${a.hz}Hz`;
  currentArch = name;
  if(origin) fireRipple(origin.x, origin.y);
  window.Store.set(window.KBLX_KEYS.arch, name);
  window.KBLX_SAVE_DEBOUNCED?.();
}
window.applyArch = applyArch;
window.getArch = () => currentArch;
window.ARCH_LIST = ORDER;
window.ARCH_MAP = ARCH;
window.KBLX_TOKVAL = tokVal;
window.KBLX_RIPPLE = fireRipple;
window.KBLX_TOAST = toast;
})();

/* ═══ 3. VOICE ══════════════════════════════════════════════════════════ */
(function(){
if(!"speechSynthesis" in window) return;
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
const norm = s => String(s||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase();
function findVoice(cfg){
  const vs = speechSynthesis.getVoices(); if(!vs.length) return null;
  const vl = Array.from(vs), n = norm(cfg.nome), lg = norm(cfg.lang).split("-")[0];
  return vl.find(v=>norm(v.name).includes(n) && norm(v.lang).startsWith(lg))
      || vl.find(v=>norm(v.lang).startsWith(lg))
      || vl.find(v=>norm(v.lang).startsWith("pt"))
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
if(speechSynthesis.getVoices().length === 0){
  const once = () => { speechSynthesis.onvoiceschanged = null; };
  speechSynthesis.onvoiceschanged = once;
}
window.KBLX_VOICE = { map:VOZ, forArch:voiceFor, find:findVoice };
})();

/* ═══ 4. BG ═════════════════════════════════════════════════════════════ */
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
  const opv = document.getElementById("val-op"); if(opv) opv.textContent = (s.opacity ?? 15)+"%";
  const bl = document.getElementById("bgBlend"); if(bl) bl.value = s.blend || "overlay";
  const panel = document.getElementById("bgThumbPanel");
  if(panel && typeof window.di_getBgImages === "function"){
    const list = window.di_getBgImages();
    panel.innerHTML = "";
    if(!list.length){
      panel.innerHTML = '<div style="grid-column:1/-1;color:var(--text-muted);text-align:center;font-size:.85rem">Nenhum background salvo.</div>';
    } else {
      list.forEach(bg=>{
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
        w.onclick = () => { window.di_setActiveBg(bg.id); };
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
      const list = window.di_getBgImages().map(b=>({...b, active:false}));
      list.unshift({ id:"bg_"+Date.now(), name:f.name||"bg", data:ev.target.result, active:true });
      window.di_saveBgImages(list);
      window.__bgApply();
    }
  };
  reader.readAsDataURL(f);
});
})();
(function(){
"use strict";
if(window.diBgOverrideInitialized) return; window.diBgOverrideInitialized = true;
window.di_getBgImages = function(){
  try{ const r = localStorage.getItem("di_bgImages"); return r ? JSON.parse(r) : []; }
  catch(_){ return []; }
};
window.di_saveBgImages = function(list){
  try{ localStorage.setItem("di_bgImages", JSON.stringify(list||[])); }catch(_){}
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
  const next = list.map(b => ({...b, active: b.id === id}));
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
  const act = window.di_getBgImages().find(b=>b.active);
  if(act){ window.__bgState.image = act.data; window.__bgApply(); }
}
})();

/* ═══ 5. COCKPIT ════════════════════════════════════════════════════════ */
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
  const modes = ["mode-night","mode-day","mode-sunset"];
  modes.forEach(m => document.body.classList.remove(m));
  document.body.classList.add("mode-" + mode);
  const st = document.getElementById("statusSolarMode");
  if(st) st.textContent = mode.toUpperCase() + (source === "auto" ? " (AUTO)" : " (MAN)");
  window.KBLX_SAVE?.();
}
function cycleSolar(){
  const modes = ["mode-night","mode-day","mode-sunset"];
  const cur = modes.find(m => document.body.classList.contains(m)) || "mode-night";
  const next = modes[(modes.indexOf(cur)+1) % modes.length];
  setSolarMode(next.replace("mode-",""), "manual");
}
function autoSolar(){
  const h = new Date().getHours();
  const mode = (h>=6 && h<12) ? "day" : (h>=12 && h<18) ? "sunset" : "night";
  setSolarMode(mode, "auto");
  window.KBLX_TOAST?.("Auto 🕒 " + mode);
}
window.__setSolarMode = setSolarMode;
document.getElementById("btnCycleSolar")?.addEventListener("click", cycleSolar);
document.getElementById("themeToggle")?.addEventListener("click", cycleSolar);
document.getElementById("btnAutoSolar")?.addEventListener("click", autoSolar);
document.getElementById("inputUserId")?.addEventListener("input", ()=>window.KBLX_SAVE_DEBOUNCED?.());
document.getElementById("inputModel")?.addEventListener("input", ()=>window.KBLX_SAVE_DEBOUNCED?.());
document.getElementById("menuBtn")?.addEventListener("click", ()=>window.toggleDrawer("drawerProfile"));
document.getElementById("orbToggle")?.addEventListener("click", ()=>window.toggleDrawer("drawerProfile"));
document.getElementById("notifBtn")?.addEventListener("click", ()=>window.KBLX_TOAST?.("Sem notificações"));
document.getElementById("blClose")?.addEventListener("click", ()=>document.getElementById("baulite-container")?.classList.remove("open"));
window.__bgApply?.();
})();

/* ═══ 6. DOCK ═══════════════════════════════════════════════════════════ */
(function(){
"use strict";
function readDock(){ return window.Store.get(window.KBLX_KEYS.dock, {}) || {}; }
function writeDock(m){ window.Store.set(window.KBLX_KEYS.dock, m); }
function ensureSessionId(el){
  if(!el.dataset.sessionId) el.dataset.sessionId = el.id || ("sess-"+Math.random().toString(36).slice(2,9));
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
    else if(el?.dataset.suspended === "true") window.restoreSession?.(id);
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
  const map = readDock(); map[id] = { title, t: Date.now() }; writeDock(map);
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
    const m = readDock(); m[id] = { title, t: Date.now() }; writeDock(m);
    createBubble(id, title);
  });
  window.KBLX_syncLooseWithDock?.();
};
})();

/* ═══ 7. MXP ════════════════════════════════════════════════════════════ */
(function(){
"use strict";
const $ = (s,r=document)=>r.querySelector(s);
const $$ = (s,r=document)=>[...r.querySelectorAll(s)];
const uid = (p="x") => p+"_"+Date.now().toString(36)+Math.random().toString(36).slice(2,7);
const BRIDGE = {
  "dual:theme-toggle": () => document.getElementById("themeToggle")?.click(),
  "dual:drawer":       () => window.toggleDrawer?.("drawerProfile"),
  "drawer:open":       () => window.toggleDrawer?.("drawerProfile"),
  "dual:new-session":  () => window.MXP.createSession("SESSION"),
  "dual:win-max":      () => window.maximizeWindow?.(activeWinId()),
  "dual:win-min":      () => window.minimizeWindow?.(activeWinId()),
  "dual:win-close":    () => window.closeWindow?.(activeWinId()),
  "dual:win-collapse": () => window.toggleCollapse?.(activeWinId()),
  "dual:win-tabs":     () => { const w=window.DualSession?.activeWindow; if(w) window.iFSw_openSwitcher?.(w); },
  "dual:focus-url":    () => document.getElementById("urlInputNav")?.focus(),
  "nav:go":            () => document.getElementById("goNavBtn")?.click(),
  "nav:next":          () => document.getElementById("stepBtn")?.click(),
  "session:new":       () => window.MXP.createSession("SESSION"),
  "session:collapse":  ctx => { const s=ctx?.section?.closest?.(".app > section.session-window")||ctx?.section; s?.classList.toggle("collapsed"); },
  "session:maximize":  ctx => { const s=ctx?.section?.closest?.(".app > section.session-window")||ctx?.section; s?.classList.toggle("maximized"); },
  "session:minimize":  ctx => { const s=ctx?.section?.closest?.(".app > section.session-window")||ctx?.section; if(s) window.KBLX_minimizeToDock(s,{title:s.dataset.sessionTitle}); },
  "session:close":     ctx => { const s=ctx?.section?.closest?.(".app > section.session-window")||ctx?.section; s?.classList.add("minimized"); },
  "theme:toggle":      () => document.getElementById("themeToggle")?.click(),
  "media:play":        () => window.Nebula?.hasSlices?.() ? window.Nebula.toggleSpeech() : window.KBLX_ACTIONS?.speak(),
  "media:pause":       () => { if("speechSynthesis" in window && !speechSynthesis.paused) speechSynthesis.pause(); },
  "media:stop":        () => { window.Nebula?.stopSpeech?.(); window.KBLX_ACTIONS?.stop?.(); },
  "media:next":        () => window.Nebula?.nextSlice?.(),
  "media:prev":        () => window.Nebula?.previousSlice?.(),
  "nebula:speak":      () => window.Nebula?.hasSlices?.() ? window.Nebula.toggleSpeech() : window.KBLX_ACTIONS?.speak(),
  "nebula:import":     () => document.getElementById("sbImportInput")?.click(),
  "nebula:paste":      () => { const t=prompt("Cole:"); if(t) window.Nebula?.loadDocument(t,"Colado"); },
  "nebula:clear":      () => window.Nebula?.clear?.(),
  "dialog:generate":   () => document.getElementById("generateBtn")?.click(),
  "dialog:step":       () => document.getElementById("stepBtn")?.click(),
  "dialog:clear":      () => document.getElementById("sbClear")?.click(),
  "dialog:copy":       () => document.getElementById("sbCopy")?.click(),
  "dialog:download":   () => document.getElementById("sbDownload")?.click(),
  "orb:next":          () => { const o=document.getElementById("sbOrb"); if(o){ o.dispatchEvent(new PointerEvent("pointerdown",{bubbles:true})); setTimeout(()=>o.dispatchEvent(new PointerEvent("pointerup",{bubbles:true})),10); } },
  "orb:wheel":         () => document.getElementById("arch-overlay")?.classList.add("open"),
  "aside:toggle":      () => document.getElementById("symbolBar")?.classList.toggle("collapsed"),
  "factory:open":      () => window.MXP.openFactory(),
  "factory:close":     () => window.MXP.closeFactory(),
  "state:reset":       () => { if(!confirm("Resetar MXP?")) return; MXPstate = defaultState(); saveMxp(); renderAll(); window.KBLX_TOAST?.("estado resetado"); },
  "extras:import-slicer":   () => document.getElementById("sbImportInput")?.click(),
  "extras:paste-slicer":    () => { const t=prompt("Cole:"); if(t) window.Nebula?.loadDocument(t,"Colado"); },
  "extras:generate":        () => document.getElementById("generateBtn")?.click(),
  "extras:toggle-carousel": () => document.getElementById("symbolBar")?.classList.toggle("carousel-hidden"),
};
function activeWinId(){
  const wins = $$(".session-window:not(.minimized)");
  if(!wins.length) return null;
  let best = wins[0], bz = 0;
  wins.forEach(w => { const z = parseInt(getComputedStyle(w).zIndex)||0; if(z >= bz){ bz=z; best=w; } });
  return best.id;
}
const CATALOG = [
  { category:"DUAL · SYSTEM", items:[["dual:theme-toggle","☼","TEMA"],["dual:drawer","🔅","COCKPIT"],["state:reset","⌦","RESET"]] },
  { category:"DUAL · WINDOW", items:[["dual:new-session","＋","NOVA"],["dual:win-max","⛶","MAX"],["dual:win-min","۞","MIN"],["dual:win-collapse","−","COLAPSO"],["dual:win-close","×","FECHAR"],["dual:win-tabs","⊞","ABAS"]] },
  { category:"SECTION WINDOW", items:[["session:collapse","−","COLAPSO"],["session:maximize","⛶","MAX"],["session:minimize","۞","MIN"],["session:close","×","FECHAR"]] },
  { category:"NEBULA", items:[["nebula:speak","🎙","SPEAK"],["nebula:import","⌲","IMPORT"],["nebula:paste","✎","PASTE"],["nebula:clear","⌫","CLEAR"]] },
  { category:"DIALOGUE", items:[["dialog:generate","⇄","GERAR"],["dialog:step","→","+15"],["dialog:copy","⧉","COPY"],["dialog:download","↓","DL"],["dialog:clear","×","CLEAR"]] },
  { category:"MEDIA", items:[["media:play","▶","PLAY"],["media:pause","Ⅱ","PAUSE"],["media:stop","■","STOP"],["media:next","›","NEXT"],["media:prev","‹","PREV"]] },
  { category:"MXP", items:[["factory:open","◈","FACTORY"],["aside:toggle","☰","TOGGLE"],["session:new","◉","SESSION"]] },
];
function defaultState(){ return { version:15, slots:{header:[],aside:[],footer:[],loose:[]}, sessions:[] }; }
let MXPstate = window.Store.get(window.KBLX_KEYS.mxp, null) || defaultState();
function saveMxp(){ window.Store.set(window.KBLX_KEYS.mxp, MXPstate); }
function hud(msg){ const el=$("#mxd-hud"); if(!el) return; if(msg){ el.textContent=msg; el.classList.add("is-live"); } else el.classList.remove("is-live"); }
function fire(action, ctx={}){
  if(!action) return;
  if(BRIDGE[action]){ try{ BRIDGE[action](ctx); }catch(e){ console.warn("bridge",action,e); } return; }
  window.dispatchEvent(new CustomEvent("MXP_ACTION",{detail:{action,ctx}}));
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
  b.title = item.binding ? `${item.label} · vinculado a "${item.binding}"` : `${item.label} · ${item.action}`;
  b.innerHTML = `<span class="mxp-icon">${item.icon||"•"}</span><span class="mxp-label">${item.label||""}</span>`;
  if(item.binding) b.classList.add("is-bound");
  return b;
}
function itemFromButton(btn){ return { id:btn.dataset.id, action:btn.dataset.action, label:btn.dataset.label, icon:btn.dataset.icon, binding:btn.dataset.binding||"" }; }
function renderSlot(slot){
  const el = document.querySelector(`[data-slot="${slot}"]`); if(!el) return;
  el.innerHTML = "";
  (MXPstate.slots[slot]||[]).forEach(it => el.appendChild(makeButton(it, slot)));
}
function renderFactory(){
  const root = $("#mxd-catalog"); if(!root) return;
  root.innerHTML = "";
  CATALOG.forEach(cat => {
    const wrap = document.createElement("section"); wrap.className = "mxd-cat";
    wrap.innerHTML = `<div class="mxd-cat-name">${cat.category}</div>`;
    const grid = document.createElement("div"); grid.className = "mxd-cat-grid";
    cat.items.forEach(([action,icon,label]) => grid.appendChild(makeButton({id:uid("factory"),action,icon,label}, "__factory__")));
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
    MXPstate.slots["session:"+id] = [];
    saveMxp();
    window.TabStore?.ensure(id, s.url);
    document.dispatchEvent(new CustomEvent("mxp:session-created", { detail:{ session:s } }));
    return s;
  }
  const host = document.body.dataset.sessionHost === "stack" ? "stack" : "float";
  const s = { id:uid("session"), name, url:"https://www.infodose.com.br/splash", host };
  MXPstate.sessions.push(s); MXPstate.slots["session:"+s.id] = [];
  saveMxp();
  return s;
}
function removeSession(id){
  MXPstate.sessions = MXPstate.sessions.filter(s => s.id !== id);
  delete MXPstate.slots["session:"+id];
  saveMxp();
}
function addToSlot(item, slot){
  MXPstate.slots[slot] ??= [];
  const copy = { ...item, id:item.id || uid("btn") };
  MXPstate.slots[slot].push(copy); saveMxp(); renderSlot(slot);
  window.KBLX_TOAST?.(`+ ${copy.label||copy.action} → ${slot}`);
}
function removeItem(id, slot){
  if(!MXPstate.slots[slot]) return;
  MXPstate.slots[slot] = MXPstate.slots[slot].filter(x => x.id !== id);
  saveMxp(); renderSlot(slot); window.KBLX_TOAST?.("removido");
}
function moveItem(id, from, to){
  if(from === to) return;
  const list = MXPstate.slots[from]||[]; const i = list.findIndex(x => x.id === id);
  if(i < 0) return;
  const item = list.splice(i,1)[0];
  MXPstate.slots[to] ??= []; MXPstate.slots[to].push(item);
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
  const dx = e.clientX-gesture.startX, dy = e.clientY-gesture.startY;
  if(!gesture.dragging && Math.hypot(dx,dy) > MOVE_THRESHOLD){
    clearTimeout(gesture.timer); gesture.btn.classList.remove("is-holding"); gesture = null; return;
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
    const moved = Math.hypot(e.clientX-gesture.startX, e.clientY-gesture.startY) > DRAG_THRESHOLD;
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
  gesture.btn.classList.remove("is-holding","is-source");
  cleanupDrag(); hud(""); gesture = null;
});
function handleTap(btn, slot, item){
  if(slot === "__factory__"){ addToSlot({...item, id:uid("btn")}, "loose"); return; }
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
  if(pendingTap && pendingTap.btn === gesture.btn){ clearTimeout(pendingTap.timer); pendingTap.btn.classList.remove("is-firing"); pendingTap = null; }
  gesture.dragging = true;
  gesture.btn.classList.remove("is-holding"); gesture.btn.classList.add("is-source");
  document.body.classList.add("mxp-dragging");
  document.getElementById("mxd-trash")?.classList.add("is-active");
  hud("segure · solte em slot OU sobre DUAL tracejado");
  const g = document.createElement("div"); g.id = "mxd-ghost"; g.textContent = gesture.item.icon || "•";
  document.body.appendChild(g); gesture.ghost = g;
  requestAnimationFrame(() => g.classList.add("is-live"));
  moveGhost(gesture.x, gesture.y);
  if(navigator.vibrate) try{ navigator.vibrate(15); }catch(_){}
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
  $$("[data-drop-target]").forEach(el => el.classList.remove("is-drop-ready"));
  const trash = document.getElementById("mxd-trash"); trash?.classList.remove("is-over");
  const t = getDropTarget(x,y); if(!t) return;
  if(t.dataset.trash !== undefined){ trash?.classList.add("is-over"); hud(`soltar para remover`); return; }
  t.classList.add("is-drop-ready"); hud(`soltar em · ${t.dataset.slot || "slot"}`);
}
function updateDualTargets(x,y){
  $$("[data-dual-target].is-dual-hover").forEach(el => el.classList.remove("is-dual-hover"));
  gesture.dualHover = null;
  const d = getDualTarget(x,y);
  if(d){ d.classList.add("is-dual-hover"); gesture.dualHover = d; hud(`⛓ vincular a · ${d.dataset.dualAction || "DUAL"}`); }
}
function finishFakeDrag(x,y){
  clearTimeout(gesture.timer);
  const dualTarget = getDualTarget(x,y);
  const target = getDropTarget(x,y);
  if(dualTarget && gesture.slot !== "__factory__" && !target){
    const da = dualTarget.dataset.dualAction;
    const list = MXPstate.slots[gesture.slot]||[];
    const idx = list.findIndex(i => i.id === gesture.item.id);
    if(idx >= 0){ list[idx].binding = da; list[idx].action = "dual:"+da; saveMxp(); renderSlot(gesture.slot); window.KBLX_TOAST?.(`⛓ vinculado a ${da}`); }
    cleanupDrag(); gesture = null; return;
  }
  if(target && target.dataset.trash !== undefined){
    if(gesture.slot !== "__factory__") removeItem(gesture.item.id, gesture.slot);
    cleanupDrag(); gesture = null; return;
  }
  if(target){
    const to = target.dataset.slot;
    if(gesture.slot === "__factory__") addToSlot({...gesture.item, id:uid("btn")}, to);
    else moveItem(gesture.item.id, gesture.slot, to);
    cleanupDrag(); gesture = null; return;
  }
  cleanupDrag(); gesture = null;
}
function cleanupDrag(){
  if(!gesture) return;
  gesture.btn.classList.remove("is-source");
  gesture.ghost?.remove(); gesture.ghost = null;
  document.getElementById("mxd-trash")?.classList.remove("is-active","is-over");
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
  menu.style.left = Math.min(window.innerWidth-190, Math.max(10, r.left))+"px";
  menu.style.top  = Math.min(window.innerHeight-220, r.bottom+8)+"px";
  menu.classList.add("is-open");
}
function closeContext(){ document.getElementById("mxd-context")?.classList.remove("is-open"); contextItem = null; }
document.getElementById("mxd-context")?.addEventListener("click", e => {
  const a = e.target.closest("[data-context-action]")?.dataset.contextAction;
  if(!a || !contextItem) return;
  const { item, slot } = contextItem;
  if(a === "fire") fire(item.action, { item, slot });
  if(a === "duplicate") addToSlot({...item, id:uid("copy"), binding:""}, slot);
  if(a === "unbind"){ const list = MXPstate.slots[slot]||[]; const i = list.findIndex(x=>x.id===item.id); if(i>=0){ list[i].binding=""; saveMxp(); renderSlot(slot); } }
  if(a === "remove") removeItem(item.id, slot);
  closeContext();
});
document.addEventListener("pointerdown", e => { if(document.getElementById("mxd-context")?.classList.contains("is-open") && !e.target.closest("#mxd-context")) closeContext(); });
function openFactory(){ document.getElementById("mxd-factory")?.classList.add("is-open"); }
function closeFactory(){ document.getElementById("mxd-factory")?.classList.remove("is-open"); }
document.getElementById("mxd-factory")?.addEventListener("click", e => { if(e.target.id === "mxd-factory") closeFactory(); });
document.addEventListener("keydown", e => {
  if((e.ctrlKey||e.metaKey) && e.shiftKey && e.key.toLowerCase() === "b"){ e.preventDefault(); document.getElementById("mxd-factory")?.classList.toggle("is-open"); }
  if(e.key === "Escape"){ closeFactory(); closeContext(); }
});
function seedIfEmpty(){
  if(window.Store.get(window.KBLX_KEYS.root)) return;
  const s = MXPstate.slots;
  if(s.header?.length || s.aside?.length || s.footer?.length || s.loose?.length || MXPstate.sessions.length) return;
  s.header = [{ id:uid("s"), action:"dual:theme-toggle", icon:"☼", label:"TEMA" }];
  s.aside  = [
    { id:uid("s"), action:"extras:import-slicer", icon:"⌲", label:"SLICER" },
    { id