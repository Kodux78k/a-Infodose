
/* ═══════════════════════════════════════════════════════════
   KOB CATALOG · um único router MXP_ACTION para MENTE / SONORO /
   CÓRTEX / VOZ / JANELA. Tudo vira botão da Factory (data-action).
   ═══════════════════════════════════════════════════════════ */
(function KOBCatalog(){
  'use strict';
  if (window.__KOB_CATALOG__) return; window.__KOB_CATALOG__ = true;
  const $ = (s,r=document)=>r.querySelector(s);
  const toast = m=>{ try{ window.KBLX_TOAST && window.KBLX_TOAST(m); }catch(_){} };
  const go = id=>{ window.KOBWorkspace && window.KOBWorkspace.reveal(id); const e=document.getElementById(id); if(e){ e.classList.remove('collapsed','minimized'); e.scrollIntoView({behavior:'smooth',block:'start'}); } return e; };

  const CATS = [
    { category:'MENTE', items:[
      ['mente:slicer','M','MENTE'],['mente:import','⇪','IMPORTAR'],['mente:paste','▤','COLAR'],['mente:samples','✦','EXEMPLOS'],['mente:pills','⚗','PÍLULAS'],
      ['mente:pato','🦆','PATO'],['mente:seed','🌱','SEMENTE'],['mente:mirror','🪞','ESPELHO'],['mente:window','▣','JANELA'],
      ['mente:listen','🎙','OUVIR'],['mente:inject','🎧','INJETAR'],['mente:download','↓','BAIXAR'],['mente:gerardo','🧠','GERARDO'] ]},
    { category:'SONORO', items:[
      ['sonoro:open','♪','SONETO'],['sonoro:import','+','IMPORTAR'],['sonoro:copy','⧉','COPIAR'],['sonoro:download','↓','BAIXAR TXT'],
      ['sonoro:swap','⇄','INVERTER'],['sonoro:tts','🎧','OUVIR'],['sonoro:play','🎵','SINTETIZAR'],['sonoro:seed','🌱','→ SEMENTE'],
      ['sonoro:mirror','🪞','→ ESPELHO'],['sonoro:dict','📖','DICIONÁRIO'],['sonoro:merge','⊕','FUNDIR 369'],['sonoro:clear','⌫','LIMPAR'],
      ['sonoro:header','⇕','HEADER 2'],['sonoro:cockpit','⚙','COCKPIT SONORO'],['sonoro:auto','✦','CORRELACIONAR'] ]},
    { category:'WORKSPACE', items:[
      ['ws:grp:all','◈','TODOS'],['ws:grp:mente','✦','GRUPO MENTE'],['ws:grp:ferr','⚒','FERRAMENTAS'],['ws:grp:sis','⌬','SISTEMA'],
      ['ws:mod:mente','✦','MENTE'],['ws:mod:slice','✂','SLICE'],['ws:mod:chat','💬','CHAT'],['ws:mod:lex','📖','LEXICAL'],['ws:mod:cortex','◎','CÓRTEX'],['ws:mod:origem','⌂','ORIGEM'] ]},
    { category:'CÓRTEX', items:[
      ['cortex:open','◎','CÓRTEX'],['cortex:neural','⬡','NEURAL'],['cortex:crystals','◈','CRISTAIS'],
      ['cortex:relayout','⟳','REORGANIZAR'],['cortex:crystal-new','💎','NOVO CRISTAL'],['cortex:focus','◉','FOCAR ATIVA'] ]},
    { category:'VOZ', items:[
      ['voice:click','🔘','VOZ CLIQUE'],['voice:arch-next','⟳','TROCAR ARQ'],['voice:announce','📣','ANUNCIAR'],
      ['voice:sel','🗣','LER SELEÇÃO'],['voice:stop','⏹','CALAR'] ]},
    { category:'JANELA', items:[
      ['win:toggle:collapse','−','RECOLHER'],['win:toggle:maximize','⛶','MAXIMIZAR'],['win:toggle:minimize','۞','DOCK'],
      ['win:toggle:close','×','FECHAR→LOOSE'],['win:toggle:cortex','◎','CÓRTEX'],['win:toggle:music','🎵','MÚSICA'],['win:reset','↺','PADRÃO'] ]}
  ];
  function addCats(){
    const M = window.MXP; if (!M || !M.CATALOG) return false;
    CATS.forEach(c=>{
      const ex = M.CATALOG.find(x=>x.category===c.category);
      if (ex){ c.items.forEach(it=>{ if(!ex.items.some(y=>y[0]===it[0])) ex.items.push(it); }); }
      else M.CATALOG.push({ category:c.category, items:c.items.map(i=>i.slice()) });
    });
    return true;
  }
  addCats(); [300,1200,3000].forEach(t=>setTimeout(addCats,t)); window.addEventListener('load', ()=>setTimeout(addCats,500));

  /* ── MENTE ── */
  const NP = ()=>window.NebulaPills;
  const doc = ()=>{ const n=NP(); return n && (n.currentDoc || (n.activeDoc && n.activeDoc())); };
  function readerDo(btnId, fallback){
    const n = NP(), d = doc(); if (!n || !d){ toast('abra/selecione um documento'); return; }
    const reader = document.getElementById('reader');
    if (!reader || !reader.classList.contains('on')) n.openReader(d);
    setTimeout(()=>{ const b=document.getElementById(btnId); if (b) b.click(); else if (fallback) fallback(d); }, 160);
  }
  const ACT = {
    'mente:slicer':   ()=>go('s0'),
    'mente:import':   ()=>{ go('pillsSection'); $('#btnImport') && $('#btnImport').click(); },
    'mente:paste':    ()=>{ go('pillsSection'); const b=document.getElementById('btnPaste'); if(b)b.click(); else { const n=NP(); if(n&&n.pasteFromClipboard)n.pasteFromClipboard(); } },
    'mente:samples':  ()=>{ go('pillsSection'); $('#btnSample') && $('#btnSample').click(); },
    'mente:pills':    ()=>{ go('pillsSection'); $('#btnPills') && $('#btnPills').click(); },
    'mente:pato':     ()=>readerDo('rPato'),
    'mente:seed':     ()=>{ const n=NP(), d=doc(); if(n&&d) n.markSeed(d); else toast('selecione um documento'); },
    'mente:mirror':   ()=>{ const n=NP(), d=doc(); if(n&&d) n.fundirComSemente(d); else toast('selecione um documento'); },
    'mente:window':   ()=>{ const n=NP(), d=doc(); if(n&&d) n.openAsSession(d); else toast('selecione um documento'); },
    'mente:listen':   ()=>{ const n=NP(), d=doc(); if(n&&d) n.speak(d.content||d.name); else toast('selecione um documento'); },
    'mente:inject':   ()=>readerDo('rInject'),
    'mente:download': ()=>readerDo('rDownload'),
    'mente:gerardo':  ()=>readerDo('rGerardo'),
    /* ── SONORO: ponte pro data-action do Soneto ── */
    'sonoro:open':   ()=>go('sonoroSection'),
    'sonoro:import': ()=>sn('import'), 'sonoro:copy':()=>sn('copy-result'), 'sonoro:download':()=>sn('download-result'),
    'sonoro:swap':   ()=>sn('swap'), 'sonoro:tts':()=>sn('toggle-tts'), 'sonoro:play':()=>sn('play-sonoro'),
    'sonoro:seed':   ()=>sn('result-to-seed'), 'sonoro:mirror':()=>sn('result-to-mirror'), 'sonoro:dict':()=>sn('toggle-dict'),
    'sonoro:clear':  ()=>sn('clear-field'),
    'sonoro:cockpit':()=>{ window.KOBSonoro && window.KOBSonoro.cockpit(); },
    'sonoro:auto':   ()=>{ const S=window.KOBSonoro; if(S){ const p=S.autoCorrelate(); toast(p?('♪ '+p.bpm+' bpm · '+p.theme):'sem texto ativo'); } },
    'sonoro:merge':  ()=>{ window.KOBSonoro && window.KOBSonoro.fractalMerge(); },
    'sonoro:header': ()=>{ const h=document.documentElement; const off=h.getAttribute('data-h2')==='off'; h.setAttribute('data-h2','on'); off=false; toast('header 2: '+(off?'visível':'oculto')); },
    /* ── CÓRTEX ── */
    'cortex:open':       ()=>go('cortexSection'),
    'cortex:neural':     ()=>{ go('cortexSection'); window.KOBCortex && window.KOBCortex.setTab('neural'); },
    'cortex:crystals':   ()=>{ go('cortexSection'); window.KOBCortex && window.KOBCortex.setTab('crystals'); },
    'cortex:relayout':   ()=>{ window.KOBCortex && window.KOBCortex.relayout(); },
    'cortex:crystal-new':()=>{ go('cortexSection'); const c=window.KOBCortex; if(c){ c.setTab('crystals'); const f=$('#kcForm'); if(f){ f.hidden=false; $('#kcNewText').focus(); } } },
    'cortex:focus':      ()=>{ window.KOBCortex && window.KOBCortex.focusActive(); },
    /* ── VOZ (Kob.js) ── */
    'voice:click':    ()=>{ const B=window.KOBBus; if(!B) return; const m=B.cycleClickMode(); toast('voz do clique: '+m); },
    'voice:announce': ()=>{ const B=window.KOBBus; if(!B) return; toast('anunciar arquétipo: '+(B.toggleAnnounce()?'ON':'OFF')); },
    'voice:arch-next':()=>{ const B=window.KOBBus; if(B) toast('arquétipo → '+B.nextArch()); },
    'voice:stop':     ()=>{ window.KOBBus && window.KOBBus.stop(); },
    'voice:sel':      ()=>{ const t=String(getSelection()||'').trim(); if(t) window.KOBBus && window.KOBBus.say(t); else toast('selecione um texto'); },
    /* ── JANELA ── */
    'win:reset':      ()=>{ window.KOBWinCtl && window.KOBWinCtl.reset(); }
  };
  function sn(a){ const b=document.querySelector(`#sonetoRoot [data-action="${a}"], #main-header2 [data-action="${a}"]`); if(b){ if(a!=='toggle-tts' && a!=='play-sonoro') go('sonoroSection'); b.click(); } else toast('Soneto ainda carregando'); }
  window.addEventListener('MXP_ACTION', e=>{
    const a = e.detail && e.detail.action; if (!a) return;
    try{
      if (ACT[a]) ACT[a]();
      else if (a.indexOf('win:toggle:')===0 && window.KOBWinCtl) window.KOBWinCtl.toggle(a.slice(11));
      else if (a.indexOf('ws:')===0 && window.KOBWorkspace){ const q=a.split(':'); window.KOBWorkspace.show(q[1]==='grp'?'grp':'mod', q[2]); }
    }catch(err){ console.warn('[catalog]', a, err); }
  });
  window.KOBCatalog = { CATS, ACT, addCats };
})();

