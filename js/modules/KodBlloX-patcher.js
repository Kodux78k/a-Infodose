/* <!-- ═══════════════════════════════════════════════════════════
     FIX v15 · session:* resolver + LooseTabs (universos)
     ═══════════════════════════════════════════════════════════ -->
<script id="kblx-fix-v15"> */
(function(){
"use strict";
if (window.__KBLX_FIX_V15__) return;
window.__KBLX_FIX_V15__ = true;

/* ═══════════════════════════════════════════════════════════
   1. RESOLVER DE SESSION WINDOW ALVO
   Substitui o seletor quebrado `.app > section.session-window`
   por um resolvedor que entende as 3 origens:
     - DualSession.activeWindow (article em #sessionsLayer)
     - iFSw #stackWrap section.session-window
     - sections auto-adaptadas do sessionize()
   ═══════════════════════════════════════════════════════════ */
function resolveSessionWindow(ctx){
  // a) elemento clicado/ctx pertence diretamente
  const fromEl = ctx?.element?.closest?.('.session-window')
              || ctx?.section?.closest?.('.session-window')
              || document.activeElement?.closest?.('.session-window');
  if (fromEl) return fromEl;

  // b) DualSession.activeWindow
  const act = window.DualSession?.activeWindow;
  if (act && document.body.contains(act) && !act.classList.contains('minimized')) return act;

  // c) maior z-index entre as não-minimizadas
  const wins = [...document.querySelectorAll('.session-window:not(.minimized)')];
  if (!wins.length) return null;
  let best = wins[0], bestZ = -1;
  for (const w of wins){
    const z = parseInt(getComputedStyle(w).zIndex) || 0;
    if (z >= bestZ){ bestZ = z; best = w; }
  }
  return best;
}

/* ═══════════════════════════════════════════════════════════
   2. CAPTURE HANDLER session:* — pega ANTES do BRIDGE do §H
   (stopImmediatePropagation mata o handler quebrado)
   ═══════════════════════════════════════════════════════════ */
document.addEventListener('click', function(e){
  const btn = e.target.closest('[data-action^="session:"]');
  if (!btn) return;
  const action = btn.dataset.action;
  const s = resolveSessionWindow({ element: btn, section: btn.closest('.session-window') });
  if (!s) return;

  e.preventDefault();
  e.stopImmediatePropagation();

  switch(action){
    case 'session:collapse':
      s.classList.toggle('collapsed');
      break;
    case 'session:maximize':
      s.classList.toggle('maximized');
      document.body.classList.toggle('has-maximized',
        !!document.querySelector('.session-window.maximized:not(.minimized)'));
      break;
    case 'session:minimize': {
      const title = s.dataset.sessionTitle
                 || s.querySelector('.mxp-title,[data-part="title"]')?.textContent?.trim()
                 || s.id;
      window.KBLX_minimizeToDock?.(s, { title });
      break;
    }
    case 'session:close':
      s.classList.add('minimized');
      break;
    case 'session:focus':
      window.DualSession?.bringToFront?.(s);
      break;
  }
  document.dispatchEvent(new CustomEvent('mxp:section-action', {
    detail: { section: s, action: action.replace('session:','') }
  }));
}, true);

/* ═══════════════════════════════════════════════════════════
   3. CONSERTA __LEGACY_SESSION_BOUND
   Deriva dos exports REAIS que o iFSw produz.
   ═══════════════════════════════════════════════════════════ */
try {
  Object.defineProperty(window, '__LEGACY_SESSION_BOUND', {
    get(){ return !!(window.SessionLifecycle || window.createSessionWindow || window.iFSw_addTab); },
    set(_v){ /* no-op: sempre derivado */ },
    configurable: true
  });
} catch(_){}

/* ═══════════════════════════════════════════════════════════
   4. LOOSETABS — universos/presets no slot loose
   Cada tab = um universo = um array de botões MXP.
   Persistido em kobllux:loose_tabs.
   ═══════════════════════════════════════════════════════════ */
const LT_KEY    = 'kobllux:loose_tabs';
const LT_ACTIVE = 'kobllux:loose_active';

const LooseTabs = {
  state: null,
  load(){
    if (this.state) return this.state;
    let saved = null;
    try { saved = JSON.parse(localStorage.getItem(LT_KEY)); } catch(_){}
    if (!saved || !Array.isArray(saved.tabs) || !saved.tabs.length){
      saved = { tabs: [{ id:'default', name:'Default', icon:'◈', items:[] }] };
    }
    this.state = saved;
    this.state.active = localStorage.getItem(LT_ACTIVE) || saved.tabs[0].id;
    if (!saved.tabs.find(t=>t.id===this.state.active)) this.state.active = saved.tabs[0].id;
    return this.state;
  },
  save(){
    if (!this.state) return;
    try {
      localStorage.setItem(LT_KEY, JSON.stringify({ tabs: this.state.tabs }));
      localStorage.setItem(LT_ACTIVE, this.state.active);
    } catch(_){}
    document.dispatchEvent(new CustomEvent('loose:changed', { detail:{ active: this.state.active } }));
  },
  current(){ return this.state.tabs.find(t=>t.id===this.state.active) || this.state.tabs[0]; },

  /* MXP.state.slots.loose  →  tab atual  (após mutação externa) */
  syncFromMxp(){
    const mxp = window.MXP; if (!mxp) return;
    const cur = this.current(); if (!cur) return;
    cur.items = JSON.parse(JSON.stringify(mxp.state.slots.loose || []));
    this.save();
  },
  /* tab atual  →  MXP.state.slots.loose  (após troca de tab) */
  applyToMxp(){
    const mxp = window.MXP; if (!mxp) return;
    const cur = this.current(); if (!cur) return;
    mxp.state.slots.loose = JSON.parse(JSON.stringify(cur.items || []));
    mxp.renderSlot('loose');
    mxp.save?.();
    window.KBLX_syncLooseWithDock?.();
  },

  create(name){
    const t = {
      id: 'u_' + Date.now().toString(36) + Math.random().toString(36).slice(2,5),
      name: name || ('Universo ' + (this.state.tabs.length + 1)),
      icon: '◈',
      items: []
    };
    this.state.tabs.push(t);
    this.save();
    return t;
  },
  switchTo(id){
    if (!id || id === this.state.active) return;
    if (!this.state.tabs.find(t=>t.id===id)) return;
    this.syncFromMxp();          // salva o atual
    this.state.active = id;
    this.save();
    this.applyToMxp();           // carrega o novo
    this.render();
    window.KBLX_TOAST?.('Universo: ' + this.current().name);
  },
  remove(id){
    if (this.state.tabs.length <= 1) return;
    const i = this.state.tabs.findIndex(t=>t.id===id);
    if (i < 0) return;
    this.state.tabs.splice(i,1);
    if (this.state.active === id) this.state.active = this.state.tabs[0].id;
    this.save();
    this.applyToMxp();
    this.render();
  },
  rename(id){
    const t = this.state.tabs.find(x=>x.id===id);
    if (!t) return;
    const n = prompt('Nome do universo:', t.name);
    if (n && n.trim()){ t.name = n.trim(); this.save(); this.render(); }
  },

  render(){
    const host = document.querySelector('[data-loose-tabs]');
    if (!host) return;
    host.innerHTML = '';
    const active = this.state.active;
    this.state.tabs.forEach(t=>{
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'loose-tab' + (t.id===active ? ' is-active' : '');
      b.dataset.action = 'loose:switch';
      b.dataset.looseId = t.id;
      b.title = `${t.name} · tap² renomeia · segure remove`;
      b.innerHTML = `<span class="lt-icon">${t.icon||'◈'}</span><span class="lt-name">${t.name}</span>`;
      host.appendChild(b);
    });
    const add = document.createElement('button');
    add.type = 'button';
    add.className = 'loose-tab loose-tab-add';
    add.dataset.action = 'loose:new';
    add.title = 'Novo universo';
    add.textContent = '＋';
    host.appendChild(add);
  }
};
window.LooseTabs = LooseTabs;

/* ═══════════════════════════════════════════════════════════
   5. CSS dos loose tabs (injetado aqui pra não depender do BASE.css)
   ═══════════════════════════════════════════════════════════ */
(function injectCss(){
  if (document.getElementById('kblx-loose-tabs-css')) return;
  const s = document.createElement('style');
  s.id = 'kblx-loose-tabs-css';
  s.textContent = `
.loose-tabs{display:flex;gap:6px;margin:0 0 8px;padding:6px;overflow-x:auto;
  background:rgba(255,255,255,.02);border:1px solid rgba(255,255,255,.08);
  border-radius:12px;scrollbar-width:thin;}
.loose-tab{flex:0 0 auto;display:inline-flex;align-items:center;gap:6px;
  padding:6px 10px;border-radius:8px;border:1px solid rgba(255,255,255,.10);
  background:transparent;color:#c9d0d5;font:inherit;font-size:12px;
  cursor:pointer;transition:background .15s,border-color .15s,color .15s;}
.loose-tab:hover{background:rgba(255,255,255,.05);}
.loose-tab.is-active{
  border-color:var(--kob-voice-primary,#00f2ff);
  background:color-mix(in srgb,var(--kob-voice-primary,#00f2ff) 14%,transparent);
  color:var(--kob-voice-primary,#00f2ff);
  box-shadow:0 0 0 1px color-mix(in srgb,var(--kob-voice-primary,#00f2ff) 35%,transparent);}
.loose-tab .lt-icon{font-size:11px;opacity:.85;}
.loose-tab .lt-name{max-width:130px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
.loose-tab-add{font-weight:900;padding:6px 10px;color:var(--kob-voice-primary,#00f2ff);}
  `;
  document.head.appendChild(s);
})();

/* ═══════════════════════════════════════════════════════════
   6. BARRA DE TABS no workspace
   ═══════════════════════════════════════════════════════════ */
function injectLooseTabsBar(){
  const slot = document.querySelector('[data-slot="loose"]');
  if (!slot) return;
  if (document.querySelector('[data-loose-tabs]')) return;
  const bar = document.createElement('div');
  bar.className = 'loose-tabs';
  bar.dataset.looseTabs = '1';
  slot.parentNode.insertBefore(bar, slot);
}

/* ═══════════════════════════════════════════════════════════
   7. AÇÕES data-action  loose:*
   ═══════════════════════════════════════════════════════════ */
let holdFired = false;
let holdTimer = null;

document.addEventListener('pointerdown', e=>{
  const btn = e.target.closest('.loose-tab:not(.loose-tab-add)');
  if (!btn) return;
  holdFired = false;
  holdTimer = setTimeout(()=>{
    holdFired = true;
    const id = btn.dataset.looseId;
    const t = LooseTabs.state.tabs.find(x=>x.id===id);
    if (!t) return;
    if (LooseTabs.state.tabs.length <= 1){
      window.KBLX_TOAST?.('Precisa de ao menos 1 universo');
      return;
    }
    if (confirm(`Remover universo "${t.name}"?`)){
      LooseTabs.remove(id);
      window.KBLX_TOAST?.('Removido: ' + t.name);
    }
    if (navigator.vibrate) try { navigator.vibrate(15); } catch(_){}
  }, 650);
}, true);
document.addEventListener('pointerup',    ()=>clearTimeout(holdTimer), true);
document.addEventListener('pointercancel',()=>clearTimeout(holdTimer), true);
document.addEventListener('pointermove',  ()=>clearTimeout(holdTimer), true);

document.addEventListener('click', e=>{
  const btn = e.target.closest('[data-action^="loose:"]');
  if (!btn) return;
  e.preventDefault();
  e.stopImmediatePropagation();

  const action = btn.dataset.action;

  if (action === 'loose:new'){
    const t = LooseTabs.create();
    LooseTabs.switchTo(t.id);
    return;
  }

  if (action === 'loose:switch'){
    if (holdFired){ holdFired = false; return; }
    const id = btn.dataset.looseId;
    const now = Date.now();
    if (btn.__lastTap && now - btn.__lastTap < 380){
      btn.__lastTap = 0;
      LooseTabs.rename(id);
      return;
    }
    btn.__lastTap = now;
    setTimeout(()=>{
      if (btn.__lastTap === now){
        btn.__lastTap = 0;
        LooseTabs.switchTo(id);
      }
    }, 340);
    return;
  }
}, true);

/* ═══════════════════════════════════════════════════════════
   8. HOOK em MXP: renderSlot('loose') e save()
   — sempre espelha tab ↔ MXP.state.slots.loose
   — e re-hidrata o "loose reflete docked" depois do render
   ═══════════════════════════════════════════════════════════ */
function hookMxp(){
  const mxp = window.MXP;
  if (!mxp || mxp.__v15hooked) return;
  mxp.__v15hooked = true;

  const origRender = mxp.renderSlot.bind(mxp);
  mxp.renderSlot = function(slot){
    origRender(slot);
    if (slot === 'loose') window.KBLX_syncLooseWithDock?.();
  };

  const origSave = mxp.save.bind(mxp);
  mxp.save = function(){
    origSave();
    try { LooseTabs.syncFromMxp(); } catch(_){}
  };
}

/* ═══════════════════════════════════════════════════════════
   9. BOOT
   ═══════════════════════════════════════════════════════════ */
function boot(){
  LooseTabs.load();
  injectLooseTabsBar();
  LooseTabs.render();
  setTimeout(()=>{
    hookMxp();
    const cur = LooseTabs.current();
    const mxpLoose = window.MXP?.state?.slots?.loose || [];
    // Primeira vez (universo vazio + MXP com seed default) → adota o seed
    if ((!cur.items || cur.items.length === 0) && mxpLoose.length){
      cur.items = JSON.parse(JSON.stringify(mxpLoose));
      LooseTabs.save();
    } else {
      LooseTabs.applyToMxp();
    }
    LooseTabs.render();
  }, 350);
  console.log('[FIX v15] session:* resolver + LooseTabs online');
}

if (document.readyState === 'loading'){
  document.addEventListener('DOMContentLoaded', ()=>setTimeout(boot, 420), { once:true });
} else {
  setTimeout(boot, 420);
}
})();
/* </script> */