/* ═══════════════════════════════════════════════════════════
   §G · SESSIONS · rhea-janelas · Janelas Flutuantes
   Arquétipo: RHEA · Prefixo: rhea_
   Depende: genus-mxp, kodux-dock
   ═══════════════════════════════════════════════════════════ */
(function(){
"use strict";
const dv_q  = s => document.querySelector(s);
const dv_qa = s => [...document.querySelectorAll(s)];

const rhea_layer = document.getElementById('rhea_sessions');
const atlas_stack = document.getElementById('rhea_stack');
const atlas_dock  = document.getElementById('rhea_dock');

const aion_tabdata = new WeakMap();
let kd_active = null;
let rhea_switcher = null;

/* ─── host mode ─── */
function atlas_hostmode(){
  return document.body.dataset.sessionHost === 'stack' ? 'stack' : 'float';
}
function rhea_hostfor(s){ return s && s.host ? s.host : atlas_hostmode(); }
function atlas_getcontainer(mode){ return mode === 'stack' ? atlas_stack : rhea_layer; }
function rhea_refresh(){
  if(!rhea_layer) return;
  rhea_layer.dataset.empty = rhea_layer.children.length ? '0' : '1';
}

/* ─── z-stack ─── */
const rhea_zstack = [];
function atlas_front(win){
  if(!win) return;
  const i = rhea_zstack.indexOf(win);
  if(i !== -1) rhea_zstack.splice(i,1);
  rhea_zstack.push(win);
  rhea_zstack.forEach((w,idx)=>{
    if(!w.classList.contains('atlas_maximized'))
      w.style.zIndex = String(1000 + idx*10);
  });
  kd_active = win;
  const inp = document.getElementById('atlas_urlbar');
  if(inp){
    const d = aion_tabdata.get(win);
    const t = d?.tabs.find(x=>x.id===d.activeId);
    inp.value = t?.url || '';
  }
}

/* ─── tab data ─── */
function aion_tabdata_get(win){
  if(!aion_tabdata.has(win)){
    const src = win.querySelector('.rhea_win-frame')?.src || 'about:blank';
    const tab = {
      id: 'tab-' + Date.now(),
      url: src,
      title: src.replace(/^https?:\/\//,'').split('/')[0] || 'Nova Aba',
      fav: false, createdAt: Date.now()
    };
    aion_tabdata.set(win, {tabs:[tab], activeId: tab.id});
  }
  return aion_tabdata.get(win);
}
function rhea_active_tab(win){
  const d = aion_tabdata.get(win);
  return d?.tabs.find(t=>t.id===d.activeId) || d?.tabs[0] || null;
}
function nova_tab(win, url='about:blank'){
  const d = aion_tabdata.get(win); if(!d) return;
  const tab = {
    id: 'tab-' + Date.now() + '-' + Math.random().toString(36).slice(2,7),
    url,
    title: url.replace(/^https?:\/\//,'').split('/')[0] || 'Nova Aba',
    fav: false, createdAt: Date.now()
  };
  d.tabs.push(tab); d.activeId = tab.id;
  aion_render_count(win);
  const f = win.querySelector('.rhea_win-frame');
  if(f) f.src = url;
  kaos_close_tabs();
}
function kaos_remove_tab(win, tabId){
  const d = aion_tabdata.get(win);
  if(!d || d.tabs.length<=1) return;
  const i = d.tabs.findIndex(t=>t.id===tabId); if(i<0) return;
  d.tabs.splice(i,1);
  if(d.activeId === tabId)
    d.activeId = d.tabs[Math.min(i, d.tabs.length-1)].id;
  aion_render_count(win);
  const f = win.querySelector('.rhea_win-frame');
  const a = rhea_active_tab(win);
  if(f && a) f.src = a.url;
  if(document.getElementById('rhea_tabs').classList.contains('open'))
    rhea_render_tabs(win);
}
function rhea_set_active(win, tabId){
  const d = aion_tabdata.get(win); if(!d) return;
  if(!d.tabs.some(t=>t.id===tabId)) return;
  d.activeId = tabId;
  aion_render_count(win);
  const f = win.querySelector('.rhea_win-frame');
  const a = rhea_active_tab(win);
  if(f && a) f.src = a.url;
  atlas_front(win);
}
function aion_render_count(win){
  const d = aion_tabdata.get(win); if(!d) return;
  const b = win.querySelector('.rhea_tab-counter');
  if(b) b.textContent = d.tabs.length;
}

/* ─── tabs ─── */
function rhea_open_tabs(win){
  rhea_switcher = win;
  rhea_render_tabs(win);
  document.getElementById('rhea_tabs').classList.add('open');
}
function kaos_close_tabs(){
  document.getElementById('rhea_tabs').classList.remove('open');
  if(rhea_switcher) atlas_front(rhea_switcher);
  rhea_switcher = null;
}
function rhea_render_tabs(win){
  const grid = document.getElementById('rhea_tabgrid');
  const d = aion_tabdata.get(win);
  if(!d) return grid.innerHTML = '';
  grid.innerHTML = '';
  d.tabs.forEach(tab=>{
    const c = document.createElement('div');
    c.className = 'rhea_tab-card' + (tab.id===d.activeId ? ' active' : '');
    c.innerHTML = `
      <div class="rhea_tab-title">${tab.title}</div>
      <div class="rhea_tab-url">${tab.url}</div>
      <div class="rhea_tab-state"><span class="rhea_tab-dot"></span> ATIVA</div>
      <button class="kaos_tab-close" title="Fechar">×</button>
      <button class="rhea_tab-fav ${tab.fav?'active':''}" title="Fav">${tab.fav?'★':'☆'}</button>`;
    c.addEventListener('click', e=>{
      if(e.target.closest('.kaos_tab-close') || e.target.closest('.rhea_tab-fav')) return;
      rhea_set_active(win, tab.id);
      kaos_close_tabs();
    });
    c.querySelector('.kaos_tab-close').addEventListener('click', e=>{
      e.stopPropagation(); kaos_remove_tab(win, tab.id);
    });
    c.querySelector('.rhea_tab-fav').addEventListener('click', e=>{
      e.stopPropagation(); tab.fav = !tab.fav; rhea_render_tabs(win);
    });
    grid.appendChild(c);
  });
}

/* ─── build session ─── */
function genus_build_session(session){
  const win = document.createElement('article');
  win.className = "rhea_session-window genus_mxp-window";
  win.dataset.sessionId = session.id;
  win.dataset.type = "session";
  win.dataset.runtime = "nav";

  if(session.x !== undefined && session.y !== undefined){
    win.style.position = "fixed";
    win.style.left = session.x + "px";
    win.style.top  = session.y + "px";
    win.style.margin = "0";
    win.style.zIndex = "9600";
  }
  if(session.w) win.style.width = session.w + "px";
  if(session.h) win.style.height = session.h + "px";
  if(session.maximized) win.classList.add("atlas_maximized");
  if(session.minimized) win.classList.add("solus_minimized");
  if(session.collapsed) win.classList.add("kodux_collapsed");

  const url = session.url || "https://www.infodose.com.br/splash";

  win.innerHTML = `
    <div class="atlas_win-hdr" data-part="header">
      <div class="atlas_win-controls">
        <button type="button" data-action="collapse" title="Colapsar" aria-label="Colapsar">−</button>
        <button type="button" data-action="tab-switcher" class="rhea_tab-counter" title="Abas">1</button>
        <button type="button" data-action="maximize" title="Maximizar" aria-label="Maximizar">⛶</button>
        <button type="button" data-action="minimize" title="Minimizar" aria-label="Minimizar">۞</button>
        <button type="button" data-sn="run" title="Executar">▶</button>
        <button type="button" data-sn="close" title="Fechar">×</button>
      </div>
      <span class="genus_mxp-title" data-part="title" title="Toque 2× para renomear">${session.name}</span>
      <span class="rhea_state-badge">● active</span>
    </div>
    <div class="atlas_win-body">
      <div class="genus_win-slot-bar genus_slot" data-drop-target data-slot="session:${session.id}"></div>
      <iframe class="rhea_win-frame" data-runtime="nav" src="${url}"
        allow="autoplay; fullscreen; encrypted-media; picture-in-picture; clipboard-write"
        allowfullscreen loading="lazy"
        referrerpolicy="no-referrer-when-downgrade"></iframe>
    </div>
    <div class="atlas_resize-handle atlas_resize-y"></div>
    <div class="atlas_resize-handle atlas_resize-x"></div>
    <div class="atlas_resize-handle atlas_resize-corner"></div>`;

  win.querySelector('[data-sn="run"]').addEventListener('click', ()=>{
    const items = window.genus_mxp?.state?.slots?.["session:"+session.id] || [];
    if(!items.length){ window.pulse_toast("session vazia"); return; }
    items.forEach((it,i)=>setTimeout(
      ()=>window.genus_mxp?.fire?.(it.action,{slot:"session:"+session.id}),
      i*150
    ));
    window.pulse_toast(`executando ${items.length} ações`);
  });
  win.querySelector('[data-sn="close"]').addEventListener('click', ()=>{
    if(!confirm("Fechar session?")) return;
    window.genus_mxp?.removeSession?.(session.id);
    win.remove();
    rhea_refresh();
    if(kd_active === win) kd_active = null;
  });

  win.querySelectorAll('.atlas_win-controls [data-action]').forEach(btn=>{
    btn.addEventListener('click', (e)=>{
      if(e.defaultPrevented) return;
      if(window.__LEGACY_SESSION_BOUND) return;
      kodux_session_action(win, session, btn.dataset.action);
    });
  });

  const titleEl = win.querySelector('[data-part="title"]');
  let rt_titleLastTap = 0;
  titleEl.addEventListener('click', e=>{
    e.stopPropagation();
    const now = Date.now();
    if(now - rt_titleLastTap < 380){
      const novo = prompt("Nome da session:", session.name);
      if(novo && novo.trim()){
        session.name = novo.trim();
        titleEl.textContent = session.name;
        window.genus_mxp?.save?.();
        window.pulse_toast("renomeada");
      }
      rt_titleLastTap = 0;
    } else { rt_titleLastTap = now; }
  });

  atlas_attach_drag(win, session);
  atlas_attach_resize(win, session);
  win.addEventListener('pointerdown', ()=>atlas_front(win), {passive:true});
  aion_tabdata_get(win);
  aion_render_count(win);
  return win;
}

/* ─── session actions ─── */
function kodux_session_action(win, session, action){
  switch(action){
    case 'collapse':
      win.classList.toggle('kodux_collapsed');
      session.collapsed = win.classList.contains('kodux_collapsed');
      window.genus_mxp?.save?.();
      break;
    case 'maximize':
      win.classList.toggle('atlas_maximized');
      session.maximized = win.classList.contains('atlas_maximized');
      window.genus_mxp?.save?.();
      break;
    case 'minimize':
      window.kodux_minimize_to_dock(win, {
        title: session.name,
        onMinimize: ()=>{ session.minimized = true; window.genus_mxp?.save?.(); },
        onRestore:  ()=>{ session.minimized = false; window.genus_mxp?.save?.(); }
      });
      break;
    case 'tab-switcher':
      window.rhea_janelas?.open_tabs?.(win);
      break;
    case 'close':
      window.genus_mxp?.removeSession?.(session.id);
      win.remove();
      rhea_refresh();
      break;
  }
}

/* ─── drag ─── */
function atlas_attach_drag(win, session){
  const handle = win.querySelector('[data-part="header"]');
  if(!handle) return;
  let rt_drag = null;
  handle.addEventListener('pointerdown', (e)=>{
    if(e.target.closest('button')) return;
    if(e.target.closest('[data-part="title"]')) return;
    const r = win.getBoundingClientRect();
    rt_drag = {id:e.pointerId, sx:e.clientX, sy:e.clientY, ox:r.left, oy:r.top, moved:false};
    try{ handle.setPointerCapture(e.pointerId); }catch(_){}
  });
  handle.addEventListener('pointermove', (e)=>{
    if(!rt_drag || rt_drag.id !== e.pointerId) return;
    const dx = e.clientX - rt_drag.sx, dy = e.clientY - rt_drag.sy;
    if(!rt_drag.moved && Math.hypot(dx,dy) < 6) return;
    rt_drag.moved = true;
    win.classList.add('atlas_dragging');
    win.style.position = 'fixed';
    win.style.left = (rt_drag.ox + dx) + 'px';
    win.style.top  = (rt_drag.oy + dy) + 'px';
    win.style.zIndex = '9650';
    win.style.margin = '0';
  });
  const end = (e)=>{
    if(!rt_drag || (e && rt_drag.id !== e.pointerId)) return;
    win.classList.remove('atlas_dragging');
    if(rt_drag.moved){
      const r = win.getBoundingClientRect();
      session.x = r.left; session.y = r.top;
      window.genus_mxp?.save?.();
    }
    rt_drag = null;
  };
  handle.addEventListener('pointerup', end);
  handle.addEventListener('pointercancel', end);
}

/* ─── resize ─── */
function atlas_attach_resize(win, session){
  const bind = (handle, mode)=>{
    if(!handle) return;
    let rt_r = null;
    handle.addEventListener('pointerdown', (e)=>{
      if(win.classList.contains('atlas_maximized')) return;
      e.preventDefault(); e.stopPropagation();
      const rect = win.getBoundingClientRect();
      if(getComputedStyle(win).position !== 'fixed'){
        win.style.position = 'fixed';
        win.style.left = rect.left + 'px';
        win.style.top  = rect.top + 'px';
        win.style.margin = '0';
        win.style.zIndex = '9650';
      }
      win.style.width  = rect.width + 'px';
      win.style.height = rect.height + 'px';
      win.style.maxHeight = 'none';
      rt_r = {id:e.pointerId, sx:e.clientX, sy:e.clientY, w:rect.width, h:rect.height};
      try{ handle.setPointerCapture(e.pointerId); }catch(_){}
    });
    handle.addEventListener('pointermove', (e)=>{
      if(!rt_r || rt_r.id !== e.pointerId) return;
      const dx = e.clientX - rt_r.sx, dy = e.clientY - rt_r.sy;
      if(mode !== 'x'){ win.style.height = Math.max(180, rt_r.h + dy) + 'px'; }
      if(mode !== 'y'){ win.style.width  = Math.max(220, rt_r.w + dx) + 'px'; }
    });
    const end = (e)=>{
      if(!rt_r || (e && rt_r.id !== e.pointerId)) return;
      const rect = win.getBoundingClientRect();
      session.w = rect.width; session.h = rect.height;
      window.genus_mxp?.save?.();
      rt_r = null;
    };
    handle.addEventListener('pointerup', end);
    handle.addEventListener('pointercancel', end);
  };
  bind(win.querySelector('.atlas_resize-y'), 'y');
  bind(win.querySelector('.atlas_resize-x'), 'x');
  bind(win.querySelector('.atlas_resize-corner'), 'corner');
}

/* ─── render all sessions ─── */
function rhea_render_sessions(){
  if(!rhea_layer || !atlas_stack) return;
  rhea_layer.innerHTML = "";
  atlas_stack.innerHTML = "";
  const sessions = window.genus_mxp?.state?.sessions || [];
  sessions.forEach(s=>{
    const mode = rhea_hostfor(s);
    const host = atlas_getcontainer(mode);
    if(!host) return;
    const win = genus_build_session(s);
    host.appendChild(win);
    if(window.genus_mxp?.state?.slots)
      window.genus_mxp.state.slots["session:"+s.id] ??= [];
    window.genus_mxp?.renderSlot?.("session:"+s.id);
  });
  rhea_refresh();
}

/* ─── handlers ─── */
document.getElementById('kaos_tabclose')?.addEventListener('click', kaos_close_tabs);
document.getElementById('nova_newsession')?.addEventListener('click',
  ()=>window.genus_mxp?.createSession?.());
document.getElementById('rhea_togglehost')?.addEventListener('click', ()=>{
  const cur = document.body.dataset.sessionHost || 'float';
  const next = cur === 'float' ? 'stack' : 'float';
  document.body.dataset.sessionHost = next;
  (window.genus_mxp?.state?.sessions || []).forEach(s=>{
    if(!s.host) s.host = next;
    if(s.host === next){ s.x = undefined; s.y = undefined; }
  });
  window.genus_mxp?.save?.();
  rhea_render_sessions();
  window.pulse_toast('Host: ' + (next === 'stack' ? 'CLASSIC' : 'FLOATING'));
});
document.getElementById('atlas_urlbar')?.addEventListener('keydown', (e)=>{
  if(e.key === 'Enter') document.getElementById('atlas_gobtn')?.click();
});
document.getElementById('atlas_gobtn')?.addEventListener('click', ()=>{
  const inp = document.getElementById('atlas_urlbar');
  const url = inp.value.trim(); if(!url) return;
  if(!kd_active){ window.genus_mxp?.createSession?.(); return; }
  let u = url;
  if(!/^https?:\/\//i.test(u) && !u.startsWith('about:')) u = 'https://' + u;
  kd_active.querySelector('.rhea_win-frame').src = u;
  const a = rhea_active_tab(kd_active);
  if(a){ a.url = u; a.title = u.replace(/^https?:\/\//,'').split('/')[0]; }
  inp.value = u;
});

/* ─── exports ─── */
window.rhea_janelas = {
  get ativo(){ return kd_active; },
  front: atlas_front,
  render: rhea_render_sessions,
  open_tabs: rhea_open_tabs,
  close_tabs: kaos_close_tabs,
  build: genus_build_session,
  hostfor: rhea_hostfor,
  container: atlas_getcontainer,
  createWindow: (name="SESSION") => window.genus_mxp?.createSession?.(name)
};

console.log('[rhea-janelas] online · RHEA teceu as janelas');
})();