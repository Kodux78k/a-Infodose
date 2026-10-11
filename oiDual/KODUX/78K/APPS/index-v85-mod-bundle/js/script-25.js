
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
    { id:'music',    ico:'🎵', title:'Tocar no Soneto (trilha do texto)', wc:'music' }
  ];
  const ALL = DEFS.map(d=>d.id);
  const $$ = (s,r=document)=>Array.from(r.querySelectorAll(s));
  let cfg = (function(){ try{ const o=JSON.parse(localStorage.getItem(KEY)||'null'); if(o && Array.isArray(o.on)) return { on:o.on.map(function(x){ return x==='voice'?'music':x; }) }; }catch(_){} return { on: ALL.slice() }; })();
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
      if (cfg.on.includes(d.id) && !has) ctl.appendChild(mk(d));
      else if (!cfg.on.includes(d.id) && has) has.remove();
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
    const tx = (win.innerText||'').replace(/[−⛶۞×◎🎵🔊]/g,' ').replace(/\s+/g,' ').trim().slice(0,1800);
    return { title:ti, text: tx || ti };
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
    toggle(id){ if(!ALL.includes(id)) return; const i=cfg.on.indexOf(id); if(i>=0) cfg.on.splice(i,1); else cfg.on.push(id); save(); applyAll(); try{ window.KBLX_TOAST && window.KBLX_TOAST((i>=0?'− ':'+ ')+id); }catch(_){} },
    reset(){ cfg={ on:ALL.slice() }; save(); applyAll(); try{ window.KBLX_TOAST && window.KBLX_TOAST('↺ controles padrão'); }catch(_){} },
    apply: applyAll
  };
})();

