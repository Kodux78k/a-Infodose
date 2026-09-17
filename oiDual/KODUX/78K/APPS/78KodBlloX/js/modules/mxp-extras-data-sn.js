(function(){
"use strict";
const $=s=>document.querySelector(s);
const $$=s=>[...document.querySelectorAll(s)];
const layer = document.getElementById('sessionsLayer');
const stackHost = document.getElementById('stackWrap');
const dock = document.getElementById('dock');
const tabDataMap = new WeakMap();
let activeWindow = null;
let switcherWin = null;

function currentHostMode(){ return document.body.dataset.sessionHost === 'stack' ? 'stack' : 'float'; }
/* v14 — indicador visual do host mode: antes o botão sempre dizia
   "TROCAR HOST" sem mostrar em qual modo você estava.
   🌊 float = janelas soltas, você arrasta pra onde quiser (bom pra desktop)
   📚 stack = janelas em coluna, empilhadas no fluxo (bom pra mobile) */
function syncHostModeLabel(){
  const el = document.getElementById('hostModeLabel');
  if (el) el.textContent = currentHostMode() === 'stack' ? '📚 STACK' : '🌊 FLOAT';
}
window.syncHostModeLabel = syncHostModeLabel;
function hostFor(session){ if(session && session.host) return session.host; return currentHostMode(); }
function getHostContainer(mode){ return mode === 'stack' ? stackHost : layer; }
function refreshLayerEmpty(){ if(!layer) return; layer.dataset.empty = layer.children.length ? '0' : '1'; }

const zStack = [];
function bringToFront(win){
  if(!win) return;
  const i = zStack.indexOf(win);
  if(i !== -1) zStack.splice(i,1);
  zStack.push(win);
  zStack.forEach((w,idx)=>{ if(!w.classList.contains('maximized')) w.style.zIndex = String(1000+idx*10); });
  activeWindow = win;
  const inp = document.getElementById('urlInputNav');
  if(inp){
    const d = tabDataMap.get(win);
    const t = d?.tabs.find(x=>x.id===d.activeId);
    inp.value = t?.url || '';
  }
}
function getTabData(win){
  if(!tabDataMap.has(win)){
    const src = win.querySelector('.win-frame')?.src || 'about:blank';
    const tab = { id:'tab-'+Date.now(), url:src, title:src.replace(/^https?:\/\//,'').split('/')[0]||'Nova Aba', fav:false, createdAt:Date.now() };
    tabDataMap.set(win,{tabs:[tab],activeId:tab.id});
  }
  return tabDataMap.get(win);
}
function getActiveTab(win){
  const d = tabDataMap.get(win);
  return d?.tabs.find(t=>t.id===d.activeId) || d?.tabs[0] || null;
}
function addTab(win, url='about:blank'){
  const d = tabDataMap.get(win); if(!d) return;
  const tab = { id:'tab-'+Date.now()+'-'+Math.random().toString(36).slice(2,7), url, title:url.replace(/^https?:\/\//,'').split('/')[0]||'Nova Aba', fav:false, createdAt:Date.now() };
  d.tabs.push(tab); d.activeId = tab.id;
  renderTabCounter(win);
  const f = win.querySelector('.win-frame'); if(f) f.src = url;
  closeTabSwitcher();
}
function removeTab(win, tabId){
  const d = tabDataMap.get(win); if(!d || d.tabs.length<=1) return;
  const i = d.tabs.findIndex(t=>t.id===tabId); if(i<0) return;
  d.tabs.splice(i,1);
  if(d.activeId===tabId) d.activeId = d.tabs[Math.min(i,d.tabs.length-1)].id;
  renderTabCounter(win);
  const f = win.querySelector('.win-frame'); const a = getActiveTab(win);
  if(f && a) f.src = a.url;
  if(document.getElementById('tabSwitcherOverlay').classList.contains('open')) renderTabSwitcher(win);
}
function setActiveTab(win, tabId){
  const d = tabDataMap.get(win); if(!d) return;
  if(!d.tabs.some(t=>t.id===tabId)) return;
  d.activeId = tabId; renderTabCounter(win);
  const f = win.querySelector('.win-frame'); const a = getActiveTab(win);
  if(f && a) f.src = a.url;
  bringToFront(win);
}
function renderTabCounter(win){
  const d = tabDataMap.get(win); if(!d) return;
  const b = win.querySelector('.tab-counter');
  if(b) b.textContent = d.tabs.length;
}
function openTabSwitcher(win){ switcherWin = win; renderTabSwitcher(win); document.getElementById('tabSwitcherOverlay').classList.add('open'); }
function closeTabSwitcher(){ document.getElementById('tabSwitcherOverlay').classList.remove('open'); if(switcherWin) bringToFront(switcherWin); switcherWin = null; }
function renderTabSwitcher(win){
  const grid = document.getElementById('tabGrid');
  const d = tabDataMap.get(win);
  if(!d) return grid.innerHTML='';
  grid.innerHTML='';
  d.tabs.forEach(tab=>{
    const c = document.createElement('div');
    c.className = 'tab-card' + (tab.id===d.activeId ? ' active' : '');
    c.innerHTML = `<div class="tab-title">${tab.title}</div><div class="tab-url">${tab.url}</div><div class="tab-state"><span class="tab-state-dot"></span> ATIVA</div><button class="tab-close" title="Fechar">×</button><button class="tab-fav ${tab.fav?'active':''}" title="Fav">${tab.fav?'★':'☆'}</button>`;
    c.addEventListener('click', e=>{
      if(e.target.closest('.tab-close') || e.target.closest('.tab-fav')) return;
      setActiveTab(win, tab.id); closeTabSwitcher();
    });
    c.querySelector('.tab-close').addEventListener('click', e=>{ e.stopPropagation(); removeTab(win, tab.id); });
    c.querySelector('.tab-fav').addEventListener('click', e=>{ e.stopPropagation(); tab.fav = !tab.fav; renderTabSwitcher(win); });
    grid.appendChild(c);
  });
}

function buildSessionWindow(session){
  const win = document.createElement('article');
  win.className = "session-window mxp-window";
  win.dataset.sessionId = session.id;
  win.dataset.type = "session";
  win.dataset.runtime = "nav";
  if(session.x !== undefined && session.y !== undefined){
    win.style.position = "fixed";
    win.style.left = session.x + "px";
    win.style.top = session.y + "px";
    win.style.margin = "0";
    win.style.zIndex = "9600";
  }
  if(session.w) win.style.width = session.w + "px";
  if(session.h) win.style.height = session.h + "px";
  if(session.maximized) win.classList.add("maximized");
  if(session.minimized) win.classList.add("minimized");
  if(session.collapsed) win.classList.add("collapsed");

  const startUrl = session.url || "https://www.infodose.com.br/splash";

  /* ⚑ ESTRUTURA LEGACY-COMPATÍVEL
     - .win-hdr > .win-controls > button[data-action="collapse|maximize|minimize|tab-switcher"]
     - iframe.win-frame[data-runtime="nav"]
     Botões MXP extras usam data-sn (run/close) e continuam funcionando. */
  win.innerHTML = `
    <div class="win-hdr" data-part="header">
      <div class="win-controls">
        <button type="button" data-action="collapse" title="Colapsar" aria-label="Colapsar">−</button>
        <button type="button" data-action="tab-switcher" class="tab-counter" title="Abas">1</button>
        <button type="button" data-action="maximize" title="Maximizar" aria-label="Maximizar">⛶</button>
        <button type="button" data-action="minimize" title="Minimizar" aria-label="Minimizar">۞</button>
        <button type="button" data-sn="run" title="Executar">▶</button>
        <button type="button" data-sn="close" title="Fechar">×</button>
      </div>
      <span class="mxp-title" data-part="title" title="Toque 2× para renomear">${session.name}</span>
      <span class="state-badge">● active</span>
    </div>
    <div class="win-body">
      <div class="win-slot-bar mxp-slot" data-drop-target data-slot="session:${session.id}"></div>
      <iframe class="win-frame" data-runtime="nav" src="${startUrl}"
        allow="autoplay; fullscreen; encrypted-media; picture-in-picture; clipboard-write"
        allowfullscreen loading="lazy"
        referrerpolicy="no-referrer-when-downgrade"></iframe>
    </div>
    <div class="resize-handle resize-y"></div>
    <div class="resize-handle resize-x"></div>
    <div class="resize-handle resize-corner"></div>`;

  /* ── MXP extras (data-sn) ─────────────────────────── */
  win.querySelector('[data-sn="run"]').addEventListener('click', ()=>{
    const items = window.MXP?.state?.slots?.["session:"+session.id] || [];
    if(!items.length){ window.KBLX_TOAST("session vazia"); return; }
    items.forEach((it,i)=>setTimeout(()=>window.MXP?.fire?.(it.action,{slot:"session:"+session.id}),i*150));
    window.KBLX_TOAST(`executando ${items.length} ações`);
  });
  win.querySelector('[data-sn="close"]').addEventListener('click', ()=>{
    if(!confirm("Fechar session?")) return;
    window.MXP?.removeSession?.(session.id);
    win.remove();
    refreshLayerEmpty();
    if(activeWindow === win) activeWindow = null;
  });

  /* ── data-action: bridge legacy ⇄ MXP ─────────────────
     Se `iFSw-base-full.js` já tratar via delegação, o handler abaixo
     detecta `e.defaultPrevented` e respeita. Caso contrário, executa. */
  win.querySelectorAll('.win-controls [data-action]').forEach(btn=>{
    btn.addEventListener('click', (e)=>{
      if(e.defaultPrevented) return;                 // legacy já tratou
      if(window.__LEGACY_SESSION_BOUND) return;      // legacy assumiu o controle global
      handleSessionAction(win, session, btn.dataset.action);
    });
  });

  const titleEl = win.querySelector('[data-part="title"]');
  let titleLastTap = 0;
  titleEl.addEventListener('click', e=>{
    e.stopPropagation();
    const now = Date.now();
    if(now - titleLastTap < 380){
      const novo = prompt("Nome da session:", session.name);
      if(novo && novo.trim()){ session.name = novo.trim(); titleEl.textContent = session.name; window.MXP?.save?.(); window.KBLX_TOAST("renomeada"); }
      titleLastTap = 0;
    } else { titleLastTap = now; }
  });

  attachWindowDrag(win, session);
  attachResize(win, session);
  win.addEventListener('pointerdown', ()=>bringToFront(win), {passive:true});
  getTabData(win);
  renderTabCounter(win);
  return win;
}

/* Ação dos botões legacy (fallback — roda se iFSw-base-full.js NÃO estiver ativo) */
function handleSessionAction(win, session, action){
  switch(action){
    case 'collapse':
      win.classList.toggle('collapsed');
      session.collapsed = win.classList.contains('collapsed');
      window.MXP?.save?.();
      break;
    case 'maximize':
      win.classList.toggle('maximized');
      session.maximized = win.classList.contains('maximized');
      window.MXP?.save?.();
      break;
    case 'minimize': {
      window.KBLX_minimizeToDock(win, {
        title: session.name,
        onMinimize: ()=>{ session.minimized = true; window.MXP?.save?.(); },
        onRestore:  ()=>{ session.minimized = false; window.MXP?.save?.(); }
      });
      break;
    }
    case 'tab-switcher':
      window.DualSession?.openTabSwitcher?.(win);
      break;
    case 'close':
      window.MXP?.removeSession?.(session.id);
      win.remove();
      refreshLayerEmpty();
      break;
  }
}

function attachWindowDrag(win, session){
  const handle = win.querySelector('[data-part="header"]');
  if(!handle) return;
  let drag = null;
  handle.addEventListener('pointerdown', (e)=>{
    if(e.target.closest('button')) return;
    if(e.target.closest('[data-part="title"]')) return;
    const r = win.getBoundingClientRect();
    drag = { id:e.pointerId, sx:e.clientX, sy:e.clientY, ox:r.left, oy:r.top, moved:false };
    try{ handle.setPointerCapture(e.pointerId); }catch(_){}
  });
  handle.addEventListener('pointermove', (e)=>{
    if(!drag || drag.id!==e.pointerId) return;
    const dx = e.clientX - drag.sx, dy = e.clientY - drag.sy;
    if(!drag.moved && Math.hypot(dx,dy) < 6) return;
    drag.moved = true;
    win.classList.add('dragging');
    win.style.position = 'fixed';
    win.style.left = (drag.ox + dx) + 'px';
    win.style.top  = (drag.oy + dy) + 'px';
    win.style.zIndex = '9650';
    win.style.margin = '0';
  });
  const end = (e)=>{
    if(!drag || (e && drag.id!==e.pointerId)) return;
    win.classList.remove('dragging');
    if(drag.moved){ const r = win.getBoundingClientRect(); session.x = r.left; session.y = r.top; window.MXP?.save?.(); }
    drag = null;
  };
  handle.addEventListener('pointerup', end);
  handle.addEventListener('pointercancel', end);
}
function attachResize(win, session){
  const bind = (handle, mode)=>{
    if(!handle) return;
    let r = null;
    handle.addEventListener('pointerdown', (e)=>{
      if(win.classList.contains('maximized')) return;
      e.preventDefault(); e.stopPropagation();
      const rect = win.getBoundingClientRect();
      if(getComputedStyle(win).position !== 'fixed'){
        win.style.position = 'fixed';
        win.style.left = rect.left + 'px'; win.style.top = rect.top + 'px';
        win.style.margin = '0'; win.style.zIndex = '9650';
      }
      win.style.width = rect.width + 'px';
      win.style.height = rect.height + 'px';
      win.style.maxHeight = 'none';
      r = { id:e.pointerId, sx:e.clientX, sy:e.clientY, w:rect.width, h:rect.height };
      try{ handle.setPointerCapture(e.pointerId); }catch(_){}
    });
    handle.addEventListener('pointermove', (e)=>{
      if(!r || r.id!==e.pointerId) return;
      const dx = e.clientX - r.sx, dy = e.clientY - r.sy;
      if(mode !== 'x'){ win.style.height = Math.max(180, r.h + dy) + 'px'; }
      if(mode !== 'y'){ win.style.width  = Math.max(220, r.w + dx) + 'px'; }
    });
    const end = (e)=>{
      if(!r || (e && r.id!==e.pointerId)) return;
      const rect = win.getBoundingClientRect();
      session.w = rect.width; session.h = rect.height; window.MXP?.save?.();
      r = null;
    };
    handle.addEventListener('pointerup', end);
    handle.addEventListener('pointercancel', end);
  };
  bind(win.querySelector('.resize-y'), 'y');
  bind(win.querySelector('.resize-x'), 'x');
  bind(win.querySelector('.resize-corner'), 'corner');
}

function renderSessions(){
  if(!layer || !stackHost) return;
  layer.innerHTML = "";
  stackHost.innerHTML = "";
  const sessions = window.MXP?.state?.sessions || [];
  sessions.forEach(s=>{
    const mode = hostFor(s);
    const host = getHostContainer(mode);
    if(!host) return;
    const win = buildSessionWindow(s);
    host.appendChild(win);
    if(window.MXP?.state?.slots) window.MXP.state.slots["session:"+s.id] ??= [];
    window.MXP?.renderSlot?.("session:"+s.id);
  });
  refreshLayerEmpty();
}

document.getElementById('closeTabSwitcher')?.addEventListener('click', closeTabSwitcher);
/* v14 — "+ Nova Aba": existem 2 sistemas de abas (§G DualSession, mais
   simples, e o legado iFSw-base-full, completo) dividindo o MESMO
   overlay #tabSwitcherOverlay. Em vez de escolher um só (risco de
   quebrar o outro), o botão detecta qual dos dois está com uma janela
   ativa no switcher e chama o addTab correspondente. */
document.getElementById('newTabBtn')?.addEventListener('click', ()=>{
  if (switcherWin) {
    addTab(switcherWin, 'about:blank');
    return;
  }
  const iw = window.iFSw_getSwitcherWin?.();
  if (iw) { window.iFSw_addTab?.(iw, ''); return; }
  window.KBLX_TOAST?.('Abra uma sessão antes de criar aba');
});
document.getElementById('newSessionBtn')?.addEventListener('click', ()=>window.MXP?.createSession?.());
document.getElementById('toggleHostBtn')?.addEventListener('click', ()=>{
  const cur = document.body.dataset.sessionHost || 'float';
  const next = cur === 'float' ? 'stack' : 'float';
  document.body.dataset.sessionHost = next;
  (window.MXP?.state?.sessions || []).forEach(s=>{
    if(!s.host) s.host = next;
    if(s.host === next){ s.x = undefined; s.y = undefined; }
  });
  window.MXP?.save?.();
  renderSessions();
  syncHostModeLabel();
  window.KBLX_TOAST('Host: ' + (next === 'stack' ? '📚 STACK (empilhado, bom pra mobile)' : '🌊 FLOAT (janelas soltas, bom pra desktop)'));
});
syncHostModeLabel();
document.getElementById('urlInputNav')?.addEventListener('keydown', e=>{ if(e.key==='Enter') document.getElementById('goNavBtn')?.click(); });
document.getElementById('goNavBtn')?.addEventListener('click', ()=>{
  const inp = document.getElementById('urlInputNav');
  const url = inp.value.trim(); if(!url) return;
  if(!activeWindow){ window.MXP?.createSession?.(); return; }
  let u = url; if(!/^https?:\/\//i.test(u) && !u.startsWith('about:')) u = 'https://'+u;
  activeWindow.querySelector('.win-frame').src = u;
  const a = getActiveTab(activeWindow); if(a){ a.url = u; a.title = u.replace(/^https?:\/\//,'').split('/')[0]; }
  inp.value = u;
});

window.DualSession = {
  get activeWindow(){ return activeWindow; },
  bringToFront, renderSessions, openTabSwitcher, closeTabSwitcher,
  buildSessionWindow,
  hostFor, getHostContainer,
  createSessionWindow: (name="SESSION")=>window.MXP?.createSession?.(name),
};
})();