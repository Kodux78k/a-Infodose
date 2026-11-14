
/* Se KOBTextEvents já existir (rodou no 78TL_v2), reaproveita */
(function(){
  if(window.KOBTextEvents) return;
  /* ——— cópia exata do Bloco B do 78TL_v2 ——— */
  const names = () => {
    const s = new Set();
    try { const V = window.KOBLLUX_VOICES || {}; Object.keys(V).forEach(k => { s.add(String(V[k].name||k)); if(V[k].id) s.add(String(V[k].id)); }); } catch(e){}
    try { (window.ARCHETYPES||[]).forEach(a => { if(a.name) s.add(String(a.name)); if(a.id) s.add(String(a.id)); }); } catch(e){}
    ['Atlas','Nova','Vitalis','Pulse','Artemis','Serena','Kaos','Genus','Lumine','Solus','Rhea','Aion','KOBLLUX','Kodux','Bllue','Infodose','Jesus','Trinity','Dual','Uno']
      .forEach(n => s.add(n));
    return Array.from(s).sort((a,b)=>b.length-a.length);
  };
  let cache = {};
  function archRe(){
    const key = names().join('|');
    if(cache.key === key) return cache.re;
    const n = names().map(x => x.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'));
    const re = new RegExp('(?:^|[\\s\\[\\](){}<>|·—\\-:])(?:' + n.join('|') + ')(?:[\\s\\]\\[(){}<>|·—\\-:!?.,;]|$)', 'gi');
    cache = { key, re };
    return re;
  }
  const RX_BTN = /\[\[btn:([a-zA-Z0-9_\-:]+)(?:\|([^\]]+))?\]\]/g;
  const RX_LINK = /\[([^\]]+)\]\(action:([a-zA-Z0-9_\-:]+)\)/g;
  const RX_SFX = /\[\[sfx\|([^\]]+)\]\]/gi;
  const RX_BUG = /Documento\s+(?:gerado|convertido)\s+por\s+MD\s+Smart\s+Generator\s*\(?BUGAD[ÃA]O[^)\n]*\)?/i;

  function parse(md){
    let text = String(md || '');
    const events = [];
    let off = 0;
    text = text.replace(/```[\s\S]*?```/g, ()=>'\u0000CODE\u0000');
    text = text.replace(RX_BTN, (m, a, l) => { events.push({type:'action',action:a,label:l||a,offset:off}); return ''; });
    text = text.replace(RX_LINK, (m, l, a) => { events.push({type:'action',action:a,label:l,offset:off}); return ''; });
    text = text.replace(RX_SFX, (m, d) => { events.push({type:'sfx',desc:d.trim(),offset:off}); return ''; });
    text = text.replace(/^(?:\s*)SFX\s*[\/:\-—]\s*(.+)$/gim, (m, d) => { events.push({type:'sfx',desc:d.trim(),offset:off}); return ''; });
    text = text.replace(archRe(), (m, name, idx) => {
      events.push({type:'arch',arch:name.toUpperCase(),offset:off+idx});
      return ' ' + m.replace(name,'').trim();
    });
    text = text.replace(RX_BUG, () => { events.push({type:'track',when:'afterNarration',offset:off}); return ''; });
    text = text.replace(/\u0000CODE\u0000/g, '');
    text = text.replace(/[ \t]+/g,' ').replace(/\n{3,}/g,'\n\n').trim();
    events.sort((a,b)=>a.offset-b.offset);
    return { text, events };
  }
  function cleanForTTS(s){
    return String(s||'').replace(archRe(), (m,n)=>' '+m.replace(n,'').trim()).replace(/\s{2,}/g,' ').trim();
  }
  function dispatch(ev, ctx){
    ctx = ctx || {};
    try{
      if(ev.type==='arch')  window.dispatchEvent(new CustomEvent('kob:arch', { detail:{arch:ev.arch, origin:'text-events'} }));
      if(ev.type==='sfx')   window.dispatchEvent(new CustomEvent('kob:sfx', { detail:{desc:ev.desc} }));
      if(ev.type==='track') window.dispatchEvent(new CustomEvent('kob:track:request', { detail:{when:ev.when, text:ctx.text, title:ctx.title} }));
      if(ev.type==='action' && window.ACTIONS && typeof window.ACTIONS[ev.action]==='function')
        window.ACTIONS[ev.action]({dataset:{}, textContent:ev.label});
    }catch(e){}
  }
  window.KOBTextEvents = { parse, cleanForTTS, dispatch, archNames: names };
  console.log('[MXP] KOBTextEvents adicionado');
})();
