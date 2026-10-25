
/* ═══════════════════════════════════════════════════════════
   WORKSPACE ÚNICO (KOBWorkspace) + ARQUIVO ATIVO (KOBActive)
   - um menu só: grupos + módulos + sliders laterais; loose é estado dentro dele
   - header 2 mostra o título curto do arquivo ativo; tocando → marquee (rádio Pioneer)
   ═══════════════════════════════════════════════════════════ */
(function KOBWorkspace(){
  'use strict';
  if (window.KOBWorkspace) return;
  const $  = (s,r=document)=>r.querySelector(s);
  const $$ = (s,r=document)=>Array.from(r.querySelectorAll(s));
  const MODS = [
    { id:'mente',  label:'MENTE',   ico:'✦', grp:'mente', secs:['pillsSection','sonoroSection'] },
    { id:'slice',  label:'SLICE',   ico:'✂', grp:'ferr',  secs:['s0'] },
    { id:'chat',   label:'CHAT',    ico:'💬', grp:'ferr',  secs:['s3'] },
    { id:'lex',    label:'LEXICAL', ico:'📖', grp:'ferr',  secs:['s2'] },
    { id:'cortex', label:'CÓRTEX',  ico:'◎', grp:'sis',   secs:['cortexSection'] },
    { id:'dualtube', label:'DUALTUBE', ico:'▶', grp:'sis', secs:['dualtubeSection'] },
    { id:'origem', label:'ORIGEM',  ico:'⌂', grp:'sis',   secs:['s1'] }
  ];
  const GROUPS = [ {id:'all',label:'TODOS',ico:'◈'}, {id:'mente',label:'MENTE',ico:'✦'}, {id:'ferr',label:'FERRAMENTAS',ico:'⚒'}, {id:'sis',label:'SISTEMA',ico:'⌬'} ];
  const KEY = 'kob:ws:sel';
  let sel = (function(){ try{ return JSON.parse(localStorage.getItem(KEY)||'null') || {k:'mod',id:'mente'}; }catch(_){ return {k:'mod',id:'mente'}; } })();
  const moved = new Set();   /* módulos que a versão "universe" move pro viewport */

  function visibleSecs(){
    if (sel.k==='grp') return sel.id==='all' ? MODS.flatMap(m=>m.secs) : MODS.filter(m=>m.grp===sel.id).flatMap(m=>m.secs);
    const m = MODS.find(x=>x.id===sel.id); return m ? m.secs : MODS.flatMap(x=>x.secs);
  }
  function apply(){
    const vis = new Set(visibleSecs());
    MODS.forEach(m=>m.secs.forEach(id=>{ const e=document.getElementById(id); if(e) e.classList.toggle('ws-off', !vis.has(id) || moved.has(m.id)); }));
    $$('#wsMenu .ws-chip').forEach(c=>c.classList.toggle('on', c.dataset.k===sel.k && c.dataset.id===sel.id));
    try{ localStorage.setItem(KEY, JSON.stringify(sel)); }catch(_){}
    try{ window.KOBCortex && window.KOBCortex.refresh(); }catch(_){}
  }
  function show(k,id){
    if (k==='mod' && moved.has(id) && window.KOBUniverse){ window.KOBUniverse.open(id); return; }
    sel = {k,id}; apply();
  }
  function reveal(secId){
    const m = MODS.find(x=>x.secs.includes(secId)); if(!m) return;
    if (moved.has(m.id) && window.KOBUniverse){ window.KOBUniverse.open(m.id); return; }
    if (!visibleSecs().includes(secId)) show('mod', m.id);
  }
  function chip(k,o){ return `<button type="button" class="ws-chip" data-k="${k}" data-id="${o.id}">${o.ico} ${o.label}</button>`; }
  function build(){
    const nav = $('#wsMenu'); if (!nav || nav.dataset.built) return; nav.dataset.built='1';
    nav.querySelector('.ws-grp .ws-strip').innerHTML = GROUPS.map(g=>chip('grp',g)).join('');
    nav.querySelector('.ws-mod .ws-strip').innerHTML = MODS.map(m=>chip('mod',m)).join('');
    nav.addEventListener('click', e=>{
      const c = e.target.closest('.ws-chip'); if (c){ show(c.dataset.k, c.dataset.id); return; }
      const s = e.target.closest('.ws-slide'); if (s){ const st = s.parentElement.querySelector('.ws-strip'); st.scrollBy({left: (s.dataset.d==='r'?1:-1)*170, behavior:'smooth'}); }
    });
    apply();
  }
  [0,300,1200].forEach(t=>setTimeout(build,t)); document.addEventListener('DOMContentLoaded', build);
  window.KOBWorkspace = { MODS, GROUPS, show, reveal, apply, moved, get sel(){ return sel; } };
})();

(function KOBActive(){
  'use strict';
  if (window.KOBActive) return;
  const $ = s=>document.querySelector(s);
  const LIM = 16;
  const short = t=>{ t=String(t||'').trim(); return t.length>LIM ? t.slice(0,LIM-1)+'…' : t; };
  const A = { title:'', text:'' };
  function paint(){
    const sh=$('#hd2Short'), fu=$('#hd2Full'), ti=$('#hd2Title'); if(!sh) return;
    sh.textContent = short(A.title) || 'KOBLLUX';
    if (fu) fu.textContent = A.title || '';
    if (ti) ti.title = A.title || 'Arquivo ativo';
  }
  let mqT = 0;
  function runMarquee(){
    const ti=$('#hd2Title'), fu=$('#hd2Full'); if(!ti||!fu||!A.title||A.title.length<=LIM) return;
    fu.style.setProperty('--mq-dur', Math.max(6, Math.min(22, A.title.length*0.22))+'s');
    ti.classList.add('mq');
  }
  document.addEventListener('animationend', e=>{ if (e.target && e.target.id==='hd2Full'){ const ti=$('#hd2Title'); ti && ti.classList.remove('mq'); } });
  document.addEventListener('click', e=>{ if (e.target.closest && e.target.closest('#hd2Title')) runMarquee(); });
  window.addEventListener('kob:sonoro-state', e=>{
    const playing = !!(e.detail && e.detail.playing), ti=$('#hd2Title');
    clearInterval(mqT); ti && ti.classList.toggle('playing', playing);
    document.querySelectorAll('#main-header2 [data-action="play-sonoro"]').forEach(b=>b.classList.toggle('playing', playing));
    if (playing){ setTimeout(runMarquee, 2500); mqT = setInterval(runMarquee, 14000); } else if (ti) ti.classList.remove('mq');
  });
  /* fonte: título do Slicer (#documentTitle) */
  const dt = $('#documentTitle');
  if (dt) new MutationObserver(()=>{ const t=dt.textContent.trim(); if (t && t!=='ESPAÇO DA MENTE') A.title=t.replace(/\.[^.]+$/,''), paint(); }).observe(dt,{childList:true,characterData:true,subtree:true});
  window.KOBActive = {
    get title(){ return A.title; }, get text(){ return A.text; },
    set(title,text){ A.title=String(title||''); if(text!=null) A.text=String(text); paint(); },
    doc(d){ if(!d) return; this.set(String(d.name||'').replace(/\.[^.]+$/,''), d.content||''); },
    marquee: runMarquee
  };
  [200,1500].forEach(t=>setTimeout(paint,t));
})();

