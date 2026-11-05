
/* ═══════════════════════════════════════════════════════════
   WIN-CONTROLS UNIFICADOS (KOBWinCtl)
   Uma lista única de controles (registry) → desenha as sections E
   injeta os extras (córtex/voz) nas windows MXP/iFSw.
   Editável: Factory > JANELA (win:toggle:<id>) ou data-wincontrols="a,b"
   na section. Persistido em localStorage kob:winctl.
   ═══════════════════════════════════════════════════════════ */
(function KOBWinCtl(){
  'use strict';
  if (window.KOBWinCtl) return;
  const KEY = 'kob:winctl';
  const DEFS = [
    { id:'collapse', ico:'−',  title:'Recolher',                       sn:'collapse', act:'session:collapse' },
    { id:'maximize', ico:'⛶', title:'Maximizar',                      sn:'maximize', act:'session:maximize' },
    { id:'minimize', ico:'۞', title:'Dock (single bar + loose)',       sn:'minimize', act:'session:minimize' },
    { id:'close',    ico:'×',  title:'Fechar → Workspace Loose',        sn:'close',    act:'session:close' },
    { id:'cortex',   ico:'◎',  title:'Ver no Córtex (neural view)',     wc:'cortex' },
    { id:'music',    ico:'🎵', title:'Tocar no Soneto (trilha do texto)', wc:'music' },
    { id:'copy',     ico:'⧉',  title:'Copiar (link da aba ativa · ou texto do documento)', wc:'copy', scope:'session' },
    { id:'download', ico:'⤓',  title:'Baixar session (abas em JSON · ou texto do documento)', wc:'download', scope:'session' }
  ];
  const ALL_IDS = DEFS.map(d=>d.id);
  const ALL = DEFS.filter(d=>d.scope!=='session').map(d=>d.id);      /* controles das sections */
  const SESS_DEFAULT = ['copy','download'];                           /* extras das session windows MXP/iFSw */
  const $$ = (s,r=document)=>Array.from(r.querySelectorAll(s));
  let cfg = (function(){ try{ const o=JSON.parse(localStorage.getItem(KEY)||'null'); if(o && Array.isArray(o.on)) return { on:o.on.map(function(x){ return x==='voice'?'music':x; }).filter(function(x){ return ALL.includes(x); }), sess:Array.isArray(o.sess)?o.sess:SESS_DEFAULT.slice() }; }catch(_){} return { on: ALL.slice(), sess: SESS_DEFAULT.slice() }; })();
  const save = ()=>{ try{ localStorage.setItem(KEY, JSON.stringify(cfg)); }catch(_){} };
  const enabled = (id, sec)=> (sec && sec.dataset && sec.dataset.wincontrols) ? sec.dataset.wincontrols.split(',').map(s=>s.trim()).includes(id) : cfg.on.includes(id);

  function mk(d){
    const b = document.createElement('button');
    b.type='button'; b.title=d.title; b.setAttribute('aria-label', d.title); b.textContent=d.ico;
    if (d.sn){ b.dataset.sn=d.sn; b.dataset.action=d.act; } else { b.dataset.wc=d.id; }
    return b;
  }
  function buildSection(sec){
    const ctl = sec.querySelector(':scope > .win-hdr .win-controls'); if (!ctl) return;
    ctl.textContent='';
    DEFS.filter(d=>enabled(d.id, sec)).forEach(d=>ctl.appendChild(mk(d)));
  }
  function extras(win){
    const ctl = win.querySelector('.win-controls'); if (!ctl) return;
    DEFS.filter(d=>d.wc).forEach(d=>{
      const has = ctl.querySelector(`[data-wc="${d.id}"]`);
      if (cfg.sess.includes(d.id) && !has) ctl.appendChild(mk(d));
      else if (!cfg.sess.includes(d.id) && has) has.remove();
    });
  }
  function applyAll(){
    $$('.app > section.session-window[data-mxp-session="1"]').forEach(buildSection);
    $$('.mxp-window, section.session-window[data-engine="ifsw"]').forEach(extras);
  }
  function titleOf(win){
    return (win.dataset.sessionTitle || (win.querySelector('.mxp-title')||{}).textContent || win.id || '').trim();
  }
  function textOf(win){
    const id = win.dataset.sessionId || win.id, M = window.MXP;
    const rec = M && M.state && M.state.sessions.find(s=>s.id===id);
    if (rec && rec.meta && rec.meta.docId && window.NebulaPills){
      const d = window.NebulaPills.docs.find(x=>String(x.id)===String(rec.meta.docId));
      if (d && d.content) return { title:String(d.name).replace(/\.[^.]+$/,''), text:d.content };
    }
    const ti = titleOf(win);
    const tx = (win.innerText||'').replace(/[−⛶۞×◎🎵🔊]/g,' ').replace(/\s+/g,' ').trim();
    return { title:ti, text: tx || ti };
  }
  /* ── ⧉ copiar · ⤓ baixar (session window) ── */
  function sessInfo(win){
    const id = win.dataset.sessionId || win.id, M = window.MXP, TS = window.TabStore;
    const rec = M && M.state && M.state.sessions.find(s=>s.id===id);
    const data = TS && TS.get && TS.get(id);
    const tab = data && data.tabs ? (data.tabs.find(t=>t.id===data.activeId) || data.tabs[0]) : null;
    let doc = null;
    if (rec && rec.meta && rec.meta.docId && window.NebulaPills) doc = window.NebulaPills.docs.find(x=>String(x.id)===String(rec.meta.docId)) || null;
    const fr = win.querySelector('.win-frame');
    return { id, rec, data, tab, doc, url:(tab&&tab.url)||(fr&&fr.getAttribute('src'))||'', name:(rec&&rec.name)||titleOf(win)||id };
  }
  const toastW = m=>{ try{ window.KBLX_TOAST && window.KBLX_TOAST(m); }catch(_){} };
  async function copyText(t){
    try{ if (navigator.clipboard && navigator.clipboard.writeText) { await navigator.clipboard.writeText(t); return true; } }catch(_){}
    try{ const ta=document.createElement('textarea'); ta.value=t; ta.setAttribute('readonly',''); ta.style.cssText='position:fixed;left:-9999px;opacity:0';
      document.body.appendChild(ta); ta.select(); const ok=document.execCommand('copy'); ta.remove(); return ok; }catch(_){ return false; }
  }
  function saveBlobW(blob, name){
    const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download=name; document.body.appendChild(a); a.click(); a.remove();
    setTimeout(()=>URL.revokeObjectURL(a.href),1500);
  }
  const slug = n=>String(n||'session').replace(/\.[^.]+$/,'').replace(/[^\w\-]+/g,'_').slice(0,50)||'session';
  async function winCopy(win){
    const i = sessInfo(win);
    const txt = (i.doc && i.doc.content) || i.url;
    if (!txt){ toastW('nada para copiar'); return; }
    toastW(await copyText(txt) ? '⧉ Copiado ✓' : 'Não consegui copiar');
  }
  function winDownload(win){
    const i = sessInfo(win);
    if (i.doc && typeof i.doc.content==='string' && i.doc.content){
      saveBlobW(new Blob([i.doc.content],{type:'text/plain;charset=utf-8'}), slug(i.doc.name)+'.txt'); toastW('⤓ Baixado'); return;
    }
    const tabs = (i.data && i.data.tabs ? i.data.tabs : (i.url ? [{url:i.url,title:i.name}] : [])).map(t=>({title:t.title||'',url:t.url,fav:!!t.fav}));
    const pack = { app:'KOBLLUX', kind:'kob-session', version:1, exportedAt:new Date().toISOString(), name:i.name, activeUrl:i.url, tabs };
    saveBlobW(new Blob([JSON.stringify(pack,null,2)],{type:'application/json;charset=utf-8'}), 'kob-session-'+slug(i.name)+'.json');
    toastW('⤓ Session baixada ('+tabs.length+' aba'+(tabs.length===1?'':'s')+')');
  }
  document.addEventListener('click', e=>{
    const b = e.target.closest && e.target.closest('[data-wc]'); if (!b) return;
    const win = b.closest('.session-window, .mxp-window'); if (!win) return;
    e.preventDefault(); e.stopPropagation();
    const id = win.dataset.sessionId || win.id;
    if (b.dataset.wc==='cortex'){
      const C = window.KOBCortex;
      if (C){ const st=C.state; C.refresh && C.refresh(); const key = (st.byId && st.byId['lobe:'+id]) ? 'lobe:'+id : id; C.select(key); }
      const cs = document.getElementById('cortexSection'); if (cs){ cs.classList.remove('collapsed','minimized'); cs.scrollIntoView({behavior:'smooth'}); }
    } else if (b.dataset.wc==='copy'){
      winCopy(win);
    } else if (b.dataset.wc==='download'){
      winDownload(win);
    } else if (b.dataset.wc==='music'){
      /* [v80] o botão de ouvir virou o da música do Soneto: o texto da window dá a trilha */
      const t = textOf(win), S = window.KOBSonoro;
      if (S) S.playText(t.text, t.title); else window.KOBBus && window.KOBBus.say && window.KOBBus.say(t.title);
    }
  }, true);

  const layers = ['#sessionsLayer','#stackWrap'];
  let _t=0; const sched = ()=>{ clearTimeout(_t); _t=setTimeout(applyAll,120); };
  const mo = new MutationObserver(sched);
  function arm(){ layers.forEach(s=>$$(s).forEach(n=>{ if(n.__wcw) return; n.__wcw=1; mo.observe(n,{childList:true,subtree:false}); })); }
  [200,900,2500,5000].forEach(t=>setTimeout(()=>{ arm(); applyAll(); },t));
  window.addEventListener('load', ()=>setTimeout(()=>{ arm(); applyAll(); },1200));

  window.KOBWinCtl = {
    DEFS, get on(){ return cfg.on.slice(); },
    toggle(id){ if(!ALL_IDS.includes(id)) return; const d=DEFS.find(x=>x.id===id), list=(d&&d.wc)?cfg.sess:cfg.on; const i=list.indexOf(id); if(i>=0) list.splice(i,1); else list.push(id); save(); applyAll(); try{ window.KBLX_TOAST && window.KBLX_TOAST((i>=0?'− ':'+ ')+id); }catch(_){} },
    reset(){ cfg={ on:ALL.slice(), sess:SESS_DEFAULT.slice() }; save(); applyAll(); try{ window.KBLX_TOAST && window.KBLX_TOAST('↺ controles padrão'); }catch(_){} },
    apply: applyAll
  };
})();

