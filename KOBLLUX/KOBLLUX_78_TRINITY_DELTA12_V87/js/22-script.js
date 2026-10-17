/* ═══════════════════════════════════════════════════════════
   CÓRTEX · NEURAL VIEW  (KOBCortex)
   hub = KOBLLUX · lobos = seções · neurônios = sessions MXP/iFSw
   cristais = memória (mesma chave do interface-base: di_cortex_v27_ult)
   ═══════════════════════════════════════════════════════════ */
(function KOBCortex(){
  'use strict';
  if (window.KOBCortex) return;
  const root = document.getElementById('cortexRoot'); if (!root) return;
  const $  = (s,r=document)=>r.querySelector(s);
  const $$ = (s,r=document)=>Array.from(r.querySelectorAll(s));
  const NS = 'http://www.w3.org/2000/svg';
  const KEY = 'di_cortex_v27_ult';
  const CX = 180, CY = 180;
  const S = { tab:'neural', sel:null, nodes:[], edges:[], pos:{}, tapAt:0, tapId:null };
  const esc = s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const toast = m=>{ try{ window.KBLX_TOAST && window.KBLX_TOAST(m); }catch(_){} };
  const say = t=>{ try{ window.KOBBus && window.KOBBus.say && window.KOBBus.say(t); }catch(_){} };
  const V78 = ()=>window.KBLX_V78 || null;
  const short = (t,n)=>{ t=String(t||''); return t.length>n ? t.slice(0,n-1)+'…' : t; };
  const hostOf = u=>{ try{ return new URL(u).host; }catch(_){ return String(u||'').slice(0,28); } };

  /* ── coleta: estado → registry → DOM ─────────────────────── */
  function stateOfRec(s){
    if (s.state==='closed' || s.workspace) return 'closed';
    if (s.docked || s.minimized) return 'docked';
    return 'active';
  }
  function stateOfEl(el){
    if (el.classList.contains('kblx-workspace') || el.dataset.kblxClosed==='1') return 'closed';
    if (el.classList.contains('minimized')) return 'docked';
    if (el.classList.contains('collapsed')) return 'idle';
    return 'active';
  }
  function collect(){
    const nodes = [], edges = [], byId = {};
    const add = n=>{ nodes.push(n); byId[n.id]=n; return n; };
    add({ id:'hub', kind:'hub', label:'KOBLLUX', st:'active', r:17, ico:'✦' });
    $$('.app > section.session-window[id]').forEach(el=>{
      if (el.id==='cortexSection') return;
      const st = stateOfEl(el);
      add({ id:'lobe:'+el.id, ref:el.id, kind:'lobe', label:(el.dataset.sessionTitle||el.id), st, r:9, ico:'⬡', el });
      edges.push({ a:'hub', b:'lobe:'+el.id, live: st!=='closed' });
    });
    const recs = (window.MXP && window.MXP.state && window.MXP.state.sessions) || [];
    const seen = new Set();
    recs.forEach(s=>{
      seen.add(s.id);
      add({ id:s.id, ref:s.id, kind:'mxp', label:s.name||s.id, st:stateOfRec(s), r:11, ico:'◉', url:s.url, host:s.host, rec:s });
    });
    $$('section.session-window[data-engine="ifsw"]').forEach(el=>{
      if (seen.has(el.id)) return;
      const u = el.querySelector('.win-urlbar'); const url = u ? u.value : '';
      add({ id:el.id, ref:el.id, kind:'ifsw', label:(hostOf(url)||el.id), st:stateOfEl(el), r:10, ico:'◈', url, el });
    });
    const anchorLobe = ['lobe:sessions','lobe:workspace','lobe:session-iframe'].find(k=>byId[k]);
    nodes.forEach(n=>{
      if (n.kind!=='mxp' && n.kind!=='ifsw') return;
      let a = null;
      if (n.rec && n.rec.parentId && byId[n.rec.parentId]) a = n.rec.parentId;
      else if (n.rec && n.rec.meta && n.rec.meta.docId && byId['lobe:pillsSection']) a = 'lobe:pillsSection';
      else a = anchorLobe || 'hub';
      n.anchor = a;
      edges.push({ a, b:n.id, live:n.st==='active' });
    });
    S.nodes = nodes; S.edges = edges; S.byId = byId;
  }

  /* ── layout: anel de lobos + anéis de neurônios + relaxamento ── */
  function layout(){
    const pos = {}, N = S.nodes;
    const lobes = N.filter(n=>n.kind==='lobe');
    pos.hub = { x:CX, y:CY };
    lobes.forEach((n,i)=>{ const a = -Math.PI/2 + i*(2*Math.PI/Math.max(lobes.length,1)); n.ang=a; pos[n.id]={ x:CX+Math.cos(a)*98, y:CY+Math.sin(a)*98 }; });
    const kids = {};
    N.forEach(n=>{ if (n.anchor){ (kids[n.anchor]=kids[n.anchor]||[]).push(n); } });
    Object.keys(kids).forEach(k=>{
      const base = pos[k] || pos.hub, list = kids[k];
      const a0 = (S.byId[k] && S.byId[k].ang!=null) ? S.byId[k].ang : -Math.PI/2;
      list.forEach((n,i)=>{
        const spread = Math.min(1.9, 0.5*list.length);
        const a = a0 + (list.length>1 ? (i/(list.length-1)-.5)*spread : 0);
        const r = (S.byId[k] && S.byId[k].kind==='lobe') ? 52 : 38;
        n.ang = a;
        pos[n.id] = { x: base.x + Math.cos(a)*r, y: base.y + Math.sin(a)*r };
      });
    });
    N.forEach(n=>{ if(!pos[n.id]) pos[n.id]={x:CX+(Math.random()-.5)*40,y:CY+(Math.random()-.5)*40}; });
    for (let it=0; it<46; it++){
      for (let i=0;i<N.length;i++) for (let j=i+1;j<N.length;j++){
        const A=pos[N[i].id], B=pos[N[j].id]; let dx=B.x-A.x, dy=B.y-A.y; let d=Math.hypot(dx,dy)||.01;
        const min = N[i].r+N[j].r+24;
        if (d<min){ const f=(min-d)/2/d; dx*=f; dy*=f; if(N[i].id!=='hub'){A.x-=dx;A.y-=dy} if(N[j].id!=='hub'){B.x+=dx;B.y+=dy} }
      }
      N.forEach(n=>{ if(n.id==='hub')return; const p=pos[n.id]; const dx=p.x-CX, dy=p.y-CY, d=Math.hypot(dx,dy), R=160; if(d>R){ p.x=CX+dx/d*R; p.y=CY+dy/d*R; } });
    }
    S.pos = pos;
  }

  /* ── render SVG ──────────────────────────────────────────── */
  function el(tag, attrs, txt){ const e=document.createElementNS(NS,tag); for(const k in (attrs||{})) e.setAttribute(k,attrs[k]); if(txt!=null) e.textContent=txt; return e; }
  function render(){
    const svg = $('#kcSvg'); if (!svg) return;
    svg.textContent = '';
    const defs = el('defs');
    defs.innerHTML = '<radialGradient id="kcHub" cx="35%" cy="30%"><stop offset="0" stop-color="#fff" stop-opacity=".9"/><stop offset=".45" stop-color="var(--kc)"/><stop offset="1" stop-color="#2a1a4a"/></radialGradient><filter id="kcGlow" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="2.2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>';
    svg.appendChild(defs);
    [98,142,168].forEach(r=>svg.appendChild(el('circle',{cx:CX,cy:CY,r,class:'kc-ring'})));
    S.edges.forEach(e=>{
      const A=S.pos[e.a], B=S.pos[e.b]; if(!A||!B) return;
      const mx=(A.x+B.x)/2+(B.y-A.y)*.12, my=(A.y+B.y)/2-(B.x-A.x)*.12;
      svg.appendChild(el('path',{ d:`M${A.x.toFixed(1)} ${A.y.toFixed(1)} Q${mx.toFixed(1)} ${my.toFixed(1)} ${B.x.toFixed(1)} ${B.y.toFixed(1)}`, class:'kc-edge'+(e.live?' live':' dim') }));
    });
    S.nodes.forEach((n,i)=>{
      const p=S.pos[n.id]; if(!p) return;
      const g = el('g',{ class:`kc-node kind-${n.kind} st-${n.st}`+(S.sel===n.id?' sel':''), 'data-id':n.id, transform:`translate(${p.x.toFixed(1)} ${p.y.toFixed(1)})`, tabindex:'0', role:'button', 'aria-label':n.label });
      /* a animação CSS de 'transform' sobrescreve o attr transform → flutuação vai no grupo interno */
      const inner = el('g',{ class:'kc-in' });
      inner.style.animationDelay = (-(i*0.7%6)).toFixed(2)+'s';
      inner.appendChild(el('circle',{ class:'halo', r:n.r+6 }));
      inner.appendChild(el('circle',{ class:'body', r:n.r }));
      inner.appendChild(el('text',{ class:'ico', y:0 }, n.ico));
      inner.appendChild(el('text',{ class:'lbl', y:n.r+10 }, short(n.label, n.kind==='hub'?10:11)));
      g.appendChild(inner);
      svg.appendChild(g);
    });
    renderInfo();
  }

  /* ── painel de info + ações ──────────────────────────────── */
  const ST_TXT = { active:'ativa', docked:'no dock', closed:'fechada (loose)', idle:'recolhida' };
  function renderInfo(){
    const box = $('#kcInfo'); if (!box) return;
    const n = S.byId && S.byId[S.sel];
    if (!n){ const a=S.nodes.filter(x=>x.kind==='mxp'||x.kind==='ifsw'); box.innerHTML = `<div class="kc-hint">${a.length} neurônio(s) · toque num nó · 2 toques abre</div>`; return; }
    const meta = [n.kind.toUpperCase(), ST_TXT[n.st]||n.st, n.host?('host '+n.host):'', n.url?hostOf(n.url):''].filter(Boolean).join(' · ');
    const isSess = n.kind==='mxp'||n.kind==='ifsw';
    box.innerHTML = `<div class="kc-ititle">${esc(n.label)}</div><div class="kc-imeta">${esc(meta)}</div><div class="kc-row">`
      + `<button type="button" class="kc-btn pri" data-kc-do="open">↗ ABRIR</button>`
      + (isSess||n.kind==='lobe' ? `<button type="button" class="kc-btn" data-kc-do="dock">۞ DOCK</button><button type="button" class="kc-btn" data-kc-do="close">× LOOSE</button>` : '')
      + `<button type="button" class="kc-btn" data-kc-do="voice">🔊 VOZ</button>`
      + `<button type="button" class="kc-btn" data-kc-do="crystal">💎 CRISTAL</button>`
      + (isSess && n.st==='closed' ? `<button type="button" class="kc-btn" data-kc-do="destroy">🗑</button>` : '')
      + `</div>`;
  }
  function winOf(n){ return n.el || document.querySelector(`.session-window[data-session-id="${CSS.escape(n.ref||n.id)}"]:not(.dock-bubble):not(.mxp-btn)`) || document.getElementById(n.ref||n.id); }
  function openNode(n){
    if (!n || n.kind==='hub'){ document.getElementById('cortexSection')?.scrollIntoView({behavior:'smooth'}); return; }
    if (n.kind==='lobe' && window.KOBWorkspace) window.KOBWorkspace.reveal(n.ref);   /* [v80] módulo oculto no Workspace → mostra */
    const id = n.ref||n.id, w = winOf(n), v = V78();
    if (n.st==='closed'){ v && v.restoreSession(id); }
    else if (n.st==='docked'){ const b=document.querySelector(`.dock-bubble[data-session-id="${CSS.escape(id)}"]`); if (b) b.click(); else v && v.restoreSession(id); }
    const w2 = winOf(n) || w;
    if (w2){
      w2.classList.remove('collapsed','minimized');
      try{ window.DualSession && window.DualSession.bringToFront && window.DualSession.bringToFront(w2); }catch(_){}
      setTimeout(()=>w2.scrollIntoView({behavior:'smooth',block:'center'}),60);
    }
    schedule();
  }
  function act(what){
    const n = S.byId && S.byId[S.sel]; if (!n) return;
    const id = n.ref||n.id, v = V78();
    if (what==='open') openNode(n);
    else if (what==='dock'){ v && v.dockSession(id); }
    else if (what==='close'){ v && v.closeSession(id); }
    else if (what==='voice'){ say(n.label + (n.url?'. '+hostOf(n.url):'')); }
    else if (what==='crystal'){ addCrystal(`${n.label}\n${n.url||''}`.trim(), ['sessão', n.kind]); toast('💎 cristalizado'); }
    else if (what==='destroy'){ v && v.destroySession(id); }
    schedule();
  }

  /* ── cristais (compatível com o interface-base) ──────────── */
  function loadC(){ try{ const o=JSON.parse(localStorage.getItem(KEY)||'{}'); return Array.isArray(o.crystals)?o.crystals:[]; }catch(_){ return []; } }
  function saveC(list){ try{ localStorage.setItem(KEY, JSON.stringify({ crystals:list })); }catch(_){} }
  function addCrystal(content, tags){ const l=loadC(); l.unshift({ id:Date.now(), content, tags:tags||[], date:Date.now() }); saveC(l); renderCrystals(); }
  function renderCrystals(){
    const list = loadC(), q = ($('#kcSearch')||{value:''}).value.toLowerCase().trim();
    const cnt = $('#kcCrystalCount'); if (cnt) cnt.textContent = list.length;
    const box = $('#kcList'); if (!box) return;
    const f = list.filter(c=>!q || String(c.content).toLowerCase().includes(q) || (c.tags||[]).some(t=>String(t).toLowerCase().includes(q)));
    if (!f.length){ box.innerHTML = '<div class="kc-empty">○ nenhum cristal — toque em ＋ Cristal</div>'; return; }
    box.innerHTML = f.map(c=>`<div class="kc-card" data-cid="${c.id}"><div class="kc-id">REGISTRO #${String(c.id).slice(-6)}</div><div class="kc-txt">${esc(c.content)}</div><div class="kc-foot"><div class="kc-row">${(c.tags||[]).map(t=>`<span class="kc-tag">${esc(t)}</span>`).join('')}</div><div class="kc-row"><button type="button" class="kc-btn" data-kc-c="say">🔊</button><button type="button" class="kc-btn" data-kc-c="del">🗑</button></div></div></div>`).join('');
  }

  /* ── tabs / eventos ──────────────────────────────────────── */
  function setTab(t){
    S.tab = t;
    $$('.kc-tab[data-kc-tab]').forEach(b=>b.classList.toggle('on', b.dataset.kcTab===t));
    $('#kcNeural').hidden = t!=='neural'; $('#kcCrystals').hidden = t!=='crystals';
    if (t==='crystals') renderCrystals(); else refresh();
  }
  let _t = 0;
  function schedule(){ clearTimeout(_t); _t = setTimeout(refresh, 180); }
  function refresh(){ if (S.tab!=='neural') return; { const _c=document.getElementById('cortexSection'); if (_c && _c.dataset.suspended==='1') return; } try{ collect(); layout(); render(); }catch(e){ console.warn('[cortex]',e); } }
  function focusActive(){
    const a = S.nodes.find(n=>(n.kind==='mxp'||n.kind==='ifsw') && n.st==='active') || S.nodes.find(n=>n.kind==='lobe' && n.st==='active');
    if (a){ S.sel = a.id; render(); }
    document.getElementById('cortexSection')?.scrollIntoView({behavior:'smooth'});
  }

  root.addEventListener('click', e=>{
    const t = e.target;
    const tab = t.closest('[data-kc-tab]'); if (tab){ setTab(tab.dataset.kcTab); return; }
    const ka = t.closest('[data-kc-act]');
    if (ka){
      const a = ka.dataset.kcAct;
      if (a==='relayout'){ collect(); layout(); render(); toast('⟳ córtex reorganizado'); }
      else if (a==='crystal-new'){ setTab('crystals'); $('#kcForm').hidden=false; $('#kcNewText').focus(); }
      else if (a==='crystal-cancel'){ $('#kcForm').hidden=true; }
      else if (a==='crystal-save'){ const tx=$('#kcNewText').value.trim(); if(!tx) return; addCrystal(tx, $('#kcNewTags').value.split(',').map(s=>s.trim()).filter(Boolean)); $('#kcNewText').value=''; $('#kcNewTags').value=''; $('#kcForm').hidden=true; toast('💎 memória salva'); }
      return;
    }
    const kd = t.closest('[data-kc-do]'); if (kd){ act(kd.dataset.kcDo); return; }
    const kc = t.closest('[data-kc-c]');
    if (kc){
      const id = Number(kc.closest('[data-cid]').dataset.cid), c = loadC().find(x=>x.id===id);
      if (kc.dataset.kcC==='say' && c) say(c.content);
      else if (kc.dataset.kcC==='del'){ if(confirm('Dissolver memória?')){ saveC(loadC().filter(x=>x.id!==id)); renderCrystals(); } }
      return;
    }
    const g = t.closest('.kc-node');
    if (g){
      const id = g.dataset.id, now = Date.now();
      if (S.tapId===id && now-S.tapAt<380){ S.sel=id; openNode(S.byId[id]); }
      else { S.sel=id; render(); }
      S.tapId=id; S.tapAt=now;
    }
  });
  root.addEventListener('input', e=>{ if (e.target.id==='kcSearch') renderCrystals(); });
  root.addEventListener('keydown', e=>{ if ((e.key==='Enter'||e.key===' ') && e.target.classList && e.target.classList.contains('kc-node')){ e.preventDefault(); S.sel=e.target.dataset.id; render(); } });

  /* ── vivo: observa lobos/dock/loose/layers (debounced) ───── */
  const watch = [ '.app', '#dock', '[data-slot="loose"]', '#sessionsLayer', '#stackWrap' ];
  const mo = new MutationObserver(schedule);
  function arm(){
    watch.forEach(sel=>$$(sel).forEach(n=>{ if(n.__kcw) return; n.__kcw=1; mo.observe(n, sel==='.app' ? { subtree:true, attributes:true, attributeFilter:['class'] } : { childList:true, subtree:true }); }));
  }
  document.addEventListener('kblx:session-restored', schedule);
  window.addEventListener('session:limit-reached', schedule);
  new MutationObserver(schedule).observe(document.body, { attributes:true, attributeFilter:['data-arch','data-theme'] });
  [300,1200,3000,6000].forEach(t=>setTimeout(()=>{ arm(); refresh(); },t));
  window.addEventListener('load', ()=>setTimeout(()=>{ arm(); refresh(); renderCrystals(); },900));

  window.KOBCortex = { refresh, setTab, focusActive, select(id){ S.sel=id; if(S.tab!=='neural') setTab('neural'); else render(); }, addCrystal, relayout(){ collect(); layout(); render(); }, get state(){ return S; } };
  renderCrystals();
})();