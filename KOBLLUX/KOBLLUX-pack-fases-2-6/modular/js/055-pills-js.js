/* @kob-mod 055 · pills-js · body */

(function NebulaPillsApp(){
  'use strict';
  const $=s=>document.querySelector(s);
  const $$=s=>[...document.querySelectorAll(s)];

  const DOC_KEY='nebula.docs.v1';
  let docs=[],view=[],cards=[],index=0,filter='all';
  let dragX=0,dragging=false,startX=0,moved=false;
  const pdfCache=new Map();
  let pendingSeedId=null;
  let ttsPlaying=false,ttsCharIndex=0,ttsLastText='';
  let currentDoc=null;
  const ARCHS={
    KOBLLUX:{c1:'#22D3EE',c2:'#0E7C9E'},ATLAS:{c1:'#38BDF8',c2:'#1E3A8A'},
    NOVA:{c1:'#F72585',c2:'#7209B7'},VITALIS:{c1:'#22C55E',c2:'#166534'},
    PULSE:{c1:'#EC4899',c2:'#831843'},KAOS:{c1:'#FACC15',c2:'#B45309'},
    KODUX:{c1:'#F97316',c2:'#C2410C'},LUMINE:{c1:'#FDE047',c2:'#CA8A04'},
    AION:{c1:'#4F46E5',c2:'#3730A3'},ARTEMIS:{c1:'#A855F7',c2:'#5B21B6'},
    SERENA:{c1:'#38BDF8',c2:'#1E3A8A'},GENUS:{c1:'#E5E7EB',c2:'#4B5563'},
    SOLUS:{c1:'#0EA5E9',c2:'#0369A1'},RHEA:{c1:'#22C55E',c2:'#166534'},
    UNO:{c1:'#F97316',c2:'#C2410C'},DUAL:{c1:'#06B6D4',c2:'#0E7C9E'},
    TRINITY:{c1:'#EC4899',c2:'#831843'},INFODOSE:{c1:'#22C55E',c2:'#166534'},
    HORUS:{c1:'#F59E0B',c2:'#B45309'},BLLUE:{c1:'#3B82F6',c2:'#1E40AF'},
    JESUS:{c1:'#FFD700',c2:'#FFB84D'},K_DION:{c1:'#60A5FA',c2:'#93C5FD'},
    KAEL_DOMNNUS:{c1:'#F472B6',c2:'#F9A8D4'},NEPHESH_ELYON:{c1:'#C4B5FD',c2:'#DDD6FE'},
    KAYTHAR:{c1:'#E0F2FE',c2:'#BAE6FD'},SYLLA:{c1:'#D1FAE5',c2:'#A7F3D0'},
    ANAMYX:{c1:'#FEF3C7',c2:'#FDE68A'},VELOR:{c1:'#A78BFA',c2:'#C4B5FD'},
    ELYSHA:{c1:'#BAE6FD',c2:'#E0F2FE'},SYLON:{c1:'#34D399',c2:'#6EE7B7'},
    NAIRA:{c1:'#FDE68A',c2:'#FCD34D'},THENIR:{c1:'#F9A8D4',c2:'#FBCFE8'},
    ELOH:{c1:'#6366F1',c2:'#818CF8'},NOVAEL:{c1:'#7DD3FC',c2:'#BAE6FD'},
    AELYA:{c1:'#E9D5FF',c2:'#F3E8FF'},IGNYRA:{c1:'#F97316',c2:'#FED7AA'},
    LUMARA:{c1:'#92400E',c2:'#B45309'},LUXARA:{c1:'#92400E',c2:'#B45309'},
    YAMANTEK:{c1:'#FCD34D',c2:'#FDE68A'},KD1:{c1:'#9BE7FF',c2:'#6A5CFF'},
    KOφD1:{c1:'#8BE7FF',c2:'#7A8CFF'},METALUX:{c1:'#C79AFF',c2:'#F472B6'},
    CHRISTOS:{c1:'#FFB84D',c2:'#FFD166'}
  };
  const KOB_VOICES={
    ATLAS:{nome:"Daniel",lang:"en-US",rate:1.02,pitch:1.39},NOVA:{nome:"Luciana",lang:"pt-BR",rate:1.063,pitch:1.34},
    VITALIS:{nome:"Rocko",lang:"pt-BR",rate:.96,pitch:1.42},PULSE:{nome:"Reed",lang:"pt-BR",rate:1,pitch:1.78},
    ARTEMIS:{nome:"Paulina",lang:"es-MX",rate:1,pitch:1.23},SERENA:{nome:"Joana",lang:"pt-BR",rate:.92,pitch:.90},
    KAOS:{nome:"Rocko",lang:"pt-BR",rate:1.28,pitch:.67},GENUS:{nome:"Reed",lang:"pt-BR",rate:.98,pitch:1.20},
    LUMINE:{nome:"Flo",lang:"fr-FR",rate:1.03,pitch:1.55},SOLUS:{nome:"Satu",lang:"fi-FI",rate:.90,pitch:.58},
    RHEA:{nome:"Alice",lang:"it-IT",rate:1.02,pitch:1.44},AION:{nome:"Milena",lang:"ru-RU",rate:1.07,pitch:1.08},
    KODUX:{nome:"Rocko",lang:"pt-BR",rate:1,pitch:.07},BLLUE:{nome:"Zuzana",lang:"cs-CZ",rate:.94,pitch:1.69},
    JESUS:{nome:"Sara",lang:"da-DK",rate:1.09,pitch:.03},KOBLLUX:{nome:"Luciana",lang:"pt-BR",rate:.98,pitch:.48}
  };
  let currentArch='KOBLLUX';

  const uid=()=>Math.random().toString(36).slice(2,10)+Date.now().toString(36);
  const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const fmtSize=b=>!b&&b!==0?'—':b<1024?b+' B':b<1048576?(b/1024).toFixed(1)+' KB':(b/1048576).toFixed(1)+' MB';
  const fmtTime=ts=>{if(!ts)return'agora';const s=(Date.now()-ts)/1000;
    return s<60?'agora':s<3600?`há ${Math.floor(s/60)}min`:s<86400?`há ${Math.floor(s/3600)}h`:new Date(ts).toLocaleDateString('pt-BR')};
  const hex2rgb=(h,a)=>{h=h.replace('#','');
    const n=parseInt(h.length===3?h.split('').map(c=>c+c).join(''):h,16);
    return `rgba(${(n>>16)&255},${(n>>8)&255},${n&255},${a})`};

  /* ── [V5.12] MXDB · armazenamento local em IndexedDB (sem o teto de ~5 MB do localStorage; guarda PDFs e HTMLs grandes).
     Interface pequena (loadDocs/saveDocs) para depois trocar/espelhar o destino (ex.: sync) sem mexer nas pílulas. ── */
  const MXDB=window.MXDB=window.MXDB||(()=>{
    const DB='MXDB',STORE='docs';let dbp=null;
    const open=()=>dbp||(dbp=new Promise((res,rej)=>{
      if(!('indexedDB' in window)){rej(new Error('sem indexedDB'));return}
      const rq=indexedDB.open(DB,1);
      rq.onupgradeneeded=()=>{const db=rq.result;if(!db.objectStoreNames.contains(STORE))db.createObjectStore(STORE,{keyPath:'id'})};
      rq.onsuccess=()=>res(rq.result);rq.onerror=()=>rej(rq.error);
    }));
    const tx=(mode,fn)=>open().then(db=>new Promise((res,rej)=>{
      const t=db.transaction(STORE,mode),st=t.objectStore(STORE);let out;
      try{out=fn(st)}catch(e){rej(e);return}
      t.oncomplete=()=>res(out&&out.result!==undefined?out.result:out);t.onerror=()=>rej(t.error);t.onabort=()=>rej(t.error);
    }));
    return{
      plan:'local',
      loadDocs:()=>tx('readonly',st=>st.getAll()).then(l=>(l||[]).filter(d=>d&&d.name).sort((a,b)=>(a._o||0)-(b._o||0)).map(d=>{const c={...d};delete c._o;return c})).catch(()=>null),
      saveDocs:list=>tx('readwrite',st=>{st.clear();list.forEach((d,i)=>st.put({...d,_o:i}))})
    };
  })();
  let saveT=0;
  const persistDocs=()=>{
    clearTimeout(saveT);
    saveT=setTimeout(()=>{MXDB.saveDocs(docs).catch(()=>{try{localStorage.setItem(DOC_KEY,JSON.stringify(docs))}catch{}})},250);
  };
  const restoreDocs=()=>{
    const migrated=(()=>{try{return localStorage.getItem(DOC_KEY+'.mxdb')==='1'}catch{return false}})();
    if(!migrated){try{const r=localStorage.getItem(DOC_KEY);if(r)docs=JSON.parse(r).filter(d=>d&&d.name)}catch{docs=[]}}   /* leitura imediata do legado */
    MXDB.loadDocs().then(list=>{
      if(!list)return;                                      /* IndexedDB indisponível: segue no localStorage */
      if(!migrated){                                        /* 1ª vez: junta o legado ao MXDB e aposenta o localStorage */
        const by=new Map(list.map(d=>[d.id,d]));docs.forEach(d=>{if(!by.has(d.id))by.set(d.id,d)});
        const merged=[...docs.filter(d=>by.has(d.id)),...list.filter(d=>!docs.some(x=>x.id===d.id))];
        docs=merged;
        MXDB.saveDocs(docs).then(()=>{try{localStorage.setItem(DOC_KEY+'.mxdb','1');localStorage.removeItem(DOC_KEY)}catch{}}).catch(()=>{});
      }else docs=list;
      index=0;try{rebuild()}catch{}
    });
  };

  // TTS
  let voices=[];
  const loadVoices=()=>{voices=window.speechSynthesis?speechSynthesis.getVoices():[]};
  if('speechSynthesis' in window){loadVoices();speechSynthesis.onvoiceschanged=loadVoices;
    setTimeout(loadVoices,400);setTimeout(loadVoices,1200)}
  function speak(text){
    if(window.KOBBus&&window.KOBBus.say&&text){ return window.KOBBus.say(text); }   /* [v79] voz única, pelo data-arch (Kob.js) */
    if(!('speechSynthesis' in window)||!text)return;
    speechSynthesis.cancel();
    const a=ARCHS[currentArch]||ARCHS.KOBLLUX;
    const cfg=KOB_VOICES[currentArch]||KOB_VOICES.KOBLLUX;
    const u=new SpeechSynthesisUtterance(text);
    u.pitch=cfg.pitch;u.rate=cfg.rate;u.lang=cfg.lang;
    const normVoice=x=>String(x||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
    const wantName=normVoice(cfg.nome),wantLang=normVoice(cfg.lang).split('-')[0];
    const v=voices.find(v=>normVoice(v.name).includes(wantName)&&normVoice(v.lang).startsWith(wantLang))
      ||voices.find(v=>normVoice(v.lang).startsWith(wantLang))
      ||voices.find(v=>normVoice(v.lang).startsWith('pt'));
    if(v){u.voice=v;u.lang=v.lang||cfg.lang}
    ttsLastText=text;ttsCharIndex=0;ttsPlaying=true;
    u.onboundary=ev=>{if(typeof ev.charIndex==='number')ttsCharIndex=ev.charIndex};
    u.onend=()=>{ttsPlaying=false;ttsCharIndex=0};
    speechSynthesis.speak(u);
  }

  function toast(msg){const el=$('#nbToast');el.textContent=msg;el.classList.add('on');
    clearTimeout(toast._t);toast._t=setTimeout(()=>el.classList.remove('on'),2400)}

  // Markdown

  /* ── [V5.10] CSS Livro Vivo (listas em cartão · tabelas · citações · código) ─ uma única folha:
     usada no leitor (#readerBody) e dentro do HTML da session window (docHtml). Escopo: .md */
  const LIVRO_CSS=`.md{--kl-bd:color-mix(in srgb,currentColor 16%,transparent);--kl-bg:color-mix(in srgb,currentColor 5%,transparent);--kl-grad:linear-gradient(42deg,var(--a,#7bf3ff),var(--b,var(--a,#7bf3ff)))}
.md .list-card{background:var(--kl-bg);border:1px solid var(--kl-bd);border-radius:16px;padding:.6rem .85rem;margin:.85rem 0}
.md .list-card ul,.md .list-card ol{margin:.2rem 0;padding:0;list-style:none}
.md .list-card li{display:grid;grid-template-columns:auto 1fr;column-gap:.65rem;align-items:start;padding:.3rem .2rem}
.md .list-card li>ul,.md .list-card li>ol{grid-column:2;margin:.3rem 0 0}
.md .li-t{min-width:0}
.md .list-card ol.ol-neo{counter-reset:item}
.md .list-card ol.ol-neo>li{counter-increment:item}
.md .list-card ol.ol-neo>li::before{content:counters(item,".");min-width:1.65rem;height:1.65rem;padding:0 .55rem;box-sizing:border-box;display:grid;place-items:center;font:700 .8em/1 system-ui,sans-serif;font-variant-numeric:tabular-nums;border-radius:12px;background:var(--kl-grad);color:#000;box-shadow:0 2px 8px rgba(0,0,0,.3)}
.md .list-card ul.ul-neo>li::before{content:"";width:.8rem;height:.8rem;margin-top:.35em;border-radius:7px;background:var(--kl-grad);box-shadow:0 1px 5px rgba(0,0,0,.3)}
.md .list-card li.tk::before{display:none}
.md .list-card li>input[type=checkbox]{accent-color:var(--a,#7bf3ff);margin:.3em 0 0;pointer-events:none}
.md .tbl-wrap{overflow-x:auto;margin:.9rem 0;border:1px solid var(--kl-bd);border-radius:12px;background:var(--kl-bg)}
.md table.md-table{width:100%;border-collapse:collapse;min-width:max-content;font-size:.95em}
.md table.md-table th,.md table.md-table td{padding:.5rem .7rem;text-align:left;vertical-align:top;border-bottom:1px solid var(--kl-bd);border-right:1px solid var(--kl-bd)}
.md table.md-table th:last-child,.md table.md-table td:last-child{border-right:0}
.md table.md-table tbody tr:last-child td{border-bottom:0}
.md table.md-table th{font-weight:700;background:color-mix(in srgb,var(--a,#7bf3ff) 16%,transparent)}
.md table.md-table tbody tr:nth-child(even) td{background:color-mix(in srgb,currentColor 4%,transparent)}
.md blockquote.bq{border-left:3px solid var(--a,#7bf3ff);background:var(--kl-bg);border-radius:12px;padding:.55rem .85rem;margin:.85rem 0;opacity:1}
.md blockquote.bq>:first-child{margin-top:0}.md blockquote.bq>:last-child{margin-bottom:0}
.md blockquote.bq-l2{border-left-width:6px}.md blockquote.bq-l3{border-left-width:9px}
.md pre.md-code{position:relative;background:var(--kl-bg);border:1px solid var(--kl-bd);border-radius:12px;padding:.75rem .9rem;overflow:auto;font:500 13px/1.5 ui-monospace,SFMono-Regular,Consolas,monospace;margin:.85rem 0}
.md pre.md-code code{background:none;padding:0}
.md :not(pre)>code{background:var(--kl-bg);padding:.1rem .35rem;border-radius:6px}
.md hr{height:1px;border:0;background:linear-gradient(90deg,transparent,color-mix(in srgb,currentColor 30%,transparent),transparent);margin:1rem 0}`;
  (function injectLivroCss(){
    if(document.getElementById('kob-livro-css'))return;
    const st=document.createElement('style');st.id='kob-livro-css';
    st.textContent='.md{--a:var(--kob-L-primary,#7bf3ff);--b:var(--kob-L-secondary,var(--kob-L-primary,#7bf3ff))}\n'+LIVRO_CSS;
    document.head.appendChild(st);
  })();
  function mdToHtml(src,depth){
    const lines=String(src).replace(/\r\n?/g,'\n').split('\n');
    const out=[];let i=0;
    const inline=t=>t
      .replace(/`([^`]+)`/g,'<code>$1</code>')
      .replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>')
      .replace(/(^|[^*])\*([^*\n]+)\*/g,'$1<em>$2</em>')
      .replace(/~~(.+?)~~/g,'<del>$1</del>')
      .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g,'<a href="$2" target="_blank" rel="noopener">$1</a>');
    const LI_RE=/^(\s*)([-*+]|\d+[.)])\s+(.*)$/;
    const listTree=items=>{
      let pos=0;
      const build=ind=>{
        const ord=items[pos].ord,tag=ord?'ol':'ul';let h='',task=false;
        while(pos<items.length&&items[pos].ind===ind&&items[pos].ord===ord){
          const it=items[pos++];let t=it.t,cb='';
          const tm=t.match(/^\[( |x|X)\]\s+(.*)$/);
          if(tm){task=true;cb='<input type="checkbox" disabled'+(tm[1]===' '?'':' checked')+'>';t=tm[2]}
          let sub='';
          if(pos<items.length&&items[pos].ind>ind)sub=build(items[pos].ind);
          h+='<li'+(cb?' class="tk"':'')+'>'+cb+'<span class="li-t">'+inline(t)+'</span>'+sub+'</li>';
        }
        return '<'+tag+' class="'+(ord?'ol-neo':'ul-neo')+' md-list'+''+'">'+h+'</'+tag+'>';
      };
      let html='';
      while(pos<items.length)html+=build(items[pos].ind);
      return html;
    };
    while(i<lines.length){
      const l=lines[i];
      if(/^\s*$/.test(l)){i++;continue}
      if(/^\s*```/.test(l)){const lang=l.trim().slice(3);i++;const buf=[];
        while(i<lines.length&&!/^\s*```/.test(lines[i])){buf.push(lines[i]);i++}i++;
        out.push(`<pre class="md-code" data-lang="${esc(lang)}"><code>${esc(buf.join('\n'))}</code></pre>`);continue}
      const h=l.match(/^(#{1,6})\s+(.*)$/);
      if(h){out.push(`<h${h[1].length}>${inline(h[2])}</h${h[1].length}>`);i++;continue}
      if(/^\s*(-{3,}|\*{3,}|_{3,})\s*$/.test(l)){out.push('<hr>');i++;continue}
      if(/^\s*>/.test(l)){const buf=[];
        while(i<lines.length&&/^\s*>/.test(lines[i])){buf.push(lines[i].replace(/^\s*>\s?/,''));i++}
        const dp=depth||0;
        out.push('<blockquote class="bq'+(dp>0?' bq-l'+Math.min(3,dp+1):'')+'">'+mdToHtml(buf.join('\n'),dp+1)+'</blockquote>');continue}
      if(/^\s*\|/.test(l)&&i+1<lines.length&&/^\s*\|[\s:|-]+\|\s*$/.test(lines[i+1])){
        const sp=r=>r.trim().replace(/^\|/,'').replace(/\|$/,'').split('|').map(s=>s.trim());
        const head=sp(l);
        const al=sp(lines[i+1]).map(c=>/^:-+:$/.test(c)?'center':/^-+:$/.test(c)?'right':'');
        i+=2;const rows=[];
        while(i<lines.length&&/^\s*\|/.test(lines[i])){rows.push(sp(lines[i]));i++}
        const st=k=>al[k]?' style="text-align:'+al[k]+'"':'';
        out.push('<div class="tbl-wrap"><table class="md-table"><thead><tr>'+head.map((c,k)=>`<th${st(k)}>${inline(c)}</th>`).join('')+'</tr></thead><tbody>'+
          rows.map(r=>'<tr>'+r.map((c,k)=>`<td${st(k)}>${inline(c)}</td>`).join('')+'</tr>').join('')+'</tbody></table></div>');continue}
      if(LI_RE.test(l)){
        const items=[];
        while(i<lines.length){
          if(/^\s*$/.test(lines[i])&&items.length&&i+1<lines.length){const nm=lines[i+1].match(LI_RE);if(nm&&/\d/.test(nm[2])===items[items.length-1].ord){i++;continue}}
          const m=lines[i].match(LI_RE);if(!m)break;
          items.push({ind:m[1].replace(/\t/g,'  ').length,ord:/\d/.test(m[2]),t:m[3]});i++}
        out.push('<div class="list-card">'+listTree(items)+'</div>');continue}
      const buf=[];
      while(i<lines.length&&!/^\s*$/.test(lines[i])&&!/^(#{1,6}\s|>\s*|```|\s*([-*+]|\d+\.)\s)/.test(lines[i])){buf.push(lines[i]);i++}
      if(!buf.length){buf.push(lines[i]);i++}
      out.push('<p>'+inline(buf.join(' '))+'</p>');
    }
    return out.join('\n');
  }

  function applyArch(key){currentArch=String(key||'KOBLLUX').toUpperCase()}
  function buildArchBar(){
    const bar=$('#archBar');if(!bar)return;
    bar.innerHTML=Object.keys(ARCHS).map(k=>{const a=ARCHS[k];
      return `<button class="arch-chip" data-k="${k}" style="--chip-c1:${a.c1};--chip-c2:${a.c2};--chip-glow:${hex2rgb(a.c1,.45)}">
        <span class="swatch"></span>${k}</button>`}).join('');
    bar.addEventListener('click',e=>{const c=e.target.closest('.arch-chip');if(!c)return;
      applyArch(c.dataset.k);speak(c.dataset.k+' ativo')});
  }

  const TYPES={md:{label:'MD',c:'#7c5cff',g:'#'},markdown:{label:'MD',c:'#7c5cff',g:'#'},
    txt:{label:'TXT',c:'#19d3c5',g:'¶'},pdf:{label:'PDF',c:'#ff5c6c',g:'PDF'},
    json:{label:'JSON',c:'#ffb020',g:'{}'},csv:{label:'CSV',c:'#35d07f',g:'⊞'},
    html:{label:'HTML',c:'#ff7a45',g:'</>'},htm:{label:'HTML',c:'#ff7a45',g:'</>'}};
  const typeOf=e=>TYPES[(e||'').toLowerCase()]||{label:(e||'DOC').toUpperCase().slice(0,4),c:'#8b93a7',g:'◆'};

  const escapeRegex=s=>String(s).replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
  const PATO_PRESETS={
    pato:[{from:'de',to:'ðŸ¦†',wholeWord:true},{from:'do',to:'ðö¦†',wholeWord:true},
      {from:'não',to:'NÃ£o†',wholeWord:true},{from:'mundo',to:'möndö¦†',wholeWord:true},
      {from:'pato',to:'🦆 Pato',wholeWord:true}],
    basico:[{from:'de',to:'ðŸ¦†',wholeWord:true},{from:'do',to:'ðö¦†',wholeWord:true}],
    kblx:[{from:'de',to:'ðŸ¦†',wholeWord:true},{from:'do',to:'ðö¦†',wholeWord:true}]
  };
  let patoPreset=localStorage.getItem('nebula.pato.preset')||'pato';
  function applyPato(text,presetKey){
    const rules=PATO_PRESETS[presetKey||patoPreset]||[];
    let out=String(text||'');
    rules.forEach(r=>{
      const e=escapeRegex(r.from);let rx;
      try{rx=r.wholeWord?new RegExp(`(?<![\\p{L}\\p{N}_])${e}(?![\\p{L}\\p{N}_])`,'giu'):new RegExp(e,'giu')}
      catch{rx=new RegExp(e,'gi')}
      out=out.replace(rx,r.to);
    });
    return out;
  }
  function merge369(a,b){
    const s1=a.split(/[.!?]+/).filter(s=>s.trim());
    const s2=b.split(/[.!?]+/).filter(s=>s.trim());
    const max=Math.max(s1.length,s2.length);let res='';
    for(let i=0;i<max;i++){const p=i%3;
      if(p===0&&s1[i])res+=s1[i].trim()+'. ';
      else if(p===1&&s2[i])res+=s2[i].trim()+'. ';
      else if(p===2&&s1[i])res+=s1[i].trim()+'. ';
      else if(s2[i])res+=s2[i].trim()+'. ';}
    return res.trim();
  }
  function pushDerivedDoc(name,content,extra){
    const d={id:uid(),name,ext:'md',size:(content||'').length,addedAt:Date.now(),content,...extra};
    docs.unshift(d);persistDocs();rebuild();return d;
  }

  /* Colar do clipboard e criar uma pílula pela mesma infraestrutura dos docs derivados. */
  async function pasteFromClipboard(){
    let text='';
    try{
      if(navigator.clipboard && typeof navigator.clipboard.readText==='function'){
        text=await navigator.clipboard.readText();
      }
    }catch(err){console.warn('[NebulaPills] clipboard:',err);}
    if(!text || !text.trim()){
      try{
        let v;
        if(typeof window.KBLX_PROMPT==='function'){
          v=await window.KBLX_PROMPT('Cole o texto para criar a pílula:');
        }else{
          v=window.prompt('Cole o texto para criar a pílula:');
        }
        text=v||'';
      }catch(_){text='';}
    }
    if(!text || !text.trim()){toast('Clipboard vazio');return null;}
    text=text.trim();
    const isMd=/(^|\\n)#{1,3}\\s|```|\\*\\*[^*\\n]+\\*\\*|^[-*+]\\s+\\S|^\\d+\\.\\s+\\S|\\[[^\\]\\n]+\\]\\([^)\\n]+\\)|^>\\s/m.test(text);
    const ext=isMd?'md':'txt';
    const firstLine=(text.split(/\\r?\\n/)[0]||'')
      .replace(/^\\s*#{1,6}\\s*/,'')
      .replace(/[\\/\\\\:*?"<>|]+/g,' ')
      .replace(/\\s+/g,' ').trim();
    const stamp=new Date().toISOString().slice(0,16).replace(/[-:T]/g,'');
    const name=(firstLine.slice(0,42)||('colado-'+stamp))+'.'+ext;
    if(filter!=='all'){
      filter='all';
      $$('.tab-pill').forEach(x=>x.classList.toggle('on',x.dataset.f==='all'));
    }
    const search=$('#q'); if(search) search.value='';
    index=0;
    const doc=pushDerivedDoc(name,text,{ext,pasted:true});
    toast('Pílula "'+name+'" criada');
    const ps=document.getElementById('pillsSection');
    if(ps){ps.open=true;ps.scrollIntoView({behavior:'smooth',block:'start'});}
    return doc;
  }
  function updateSeedLabel(){
    const d=pendingSeedId?docs.find(x=>x.id===pendingSeedId):null;
    const txt=d?`Semente: ${d.name}`:'Semente: nenhuma marcada';
    $$('.g-seed-label').forEach(g=>g.textContent=txt);
    document.querySelectorAll('#pillsSection .card').forEach(c=>c.classList.toggle('is-seed',!!pendingSeedId&&c.dataset.id===pendingSeedId));
  }
  function markSeed(doc){
    if(!doc)return;
    if(pendingSeedId===doc.id){pendingSeedId=null;toast('Semente desmarcada');updateSeedLabel();return}
    pendingSeedId=doc.id;toast('💊 "'+doc.name+'" marcado como Semente');updateSeedLabel();
  }
  function fundirComSemente(doc){
    if(!doc)return;
    if(!pendingSeedId){markSeed(doc);return}
    if(pendingSeedId===doc.id){toast('Escolhe outro doc');return}
    const seed=docs.find(d=>d.id===pendingSeedId);
    if(!seed){pendingSeedId=null;updateSeedLabel();toast('Semente perdida');return}
    const fused=applyPato(merge369(seed.content||seed.name,doc.content||doc.name));
    pushDerivedDoc(`Fusão 369 · ${seed.name} + ${doc.name}`,fused,{fused:true,sources:[seed.addedAt,doc.addedAt]});
    pendingSeedId=null;updateSeedLabel();toast('⊕ Fundido');
  }

  function renderDocPills(){
    const box=$('#docPillsBar');if(!box)return;
    if(!docs.length){box.innerHTML='<span class="dp-empty">Nenhuma pílula ainda.</span>';return}
    box.innerHTML=docs.map(d=>{
      const t=typeOf(d.ext);const isSeed=d.id===pendingSeedId;
      return `<div class="doc-pill${isSeed?' is-seed':''}" data-id="${d.id}" style="--c:${t.c}">
        <span>${esc(t.g)}</span><span>${esc(d.name.slice(0,24))}</span>
        <span class="dp-acts">
          <button data-action="open" title="Abrir">📖</button>
          <button data-action="speak" title="Ouvir no fone · toque de novo para parar">🎧</button>
          <button data-action="copy" title="Copiar texto">⧉</button>
          <button data-kob-download="${d.id}" title="Baixar TXT">⤓</button>
          <button data-action="seed" data-mxp="mente:seed" title="Semente">🌱</button>
          <button data-action="fuse" data-mxp="mente:mirror" title="Espelho · fundir">🪞</button>
          <button data-action="del" title="Remover">✕</button>
        </span></div>`;
    }).join('');
  }
  $('#docPillsBar')?.addEventListener('click',e=>{
    const btn=e.target.closest('button[data-action]');if(!btn)return;
    const w=e.target.closest('.doc-pill');if(!w)return;
    const d=docs.find(x=>x.id===w.dataset.id);if(!d)return;
    const a=btn.dataset.action;
    if(a==='open')openReader(d);
    else if(a==='speak')hearToggle(d);
    else if(a==='copy')copyDoc(d);
    else if(a==='seed')markSeed(d);
    else if(a==='fuse')fundirComSemente(d);
    else if(a==='del'){docs=docs.filter(x=>x.id!==d.id);persistDocs();rebuild();toast('🗑️ Removido')}
  });
  $('#btnPills')?.addEventListener('click',()=>{
    const b=$('#docPillsBar');
    const showing=b.style.display==='flex';
    b.style.display=showing?'none':'flex';
    if(!showing)renderDocPills();
  });

  function b64ToUint8(dataUrl){const b64=dataUrl.split(',')[1]||'';const bin=atob(b64);
    const arr=new Uint8Array(bin.length);for(let i=0;i<bin.length;i++)arr[i]=bin.charCodeAt(i);return arr}
  function handleFiles(files){
    const list=Array.from(files||[]);if(!list.length)return;
    list.forEach(file=>{
      const ext=(file.name.split('.').pop()||'').toLowerCase();
      if(ext==='pdf'){
        const r=new FileReader();
        r.onload=()=>{
          const d={id:uid(),name:file.name,ext:'pdf',size:file.size,addedAt:Date.now(),dataUrl:r.result};
          docs.unshift(d);persistDocs();rebuild();toast('📄 '+file.name);};
        r.readAsDataURL(file);
      }else{
        const r=new FileReader();
        r.onload=()=>{
          let content=r.result;
          if(ext==='json'){try{const o=JSON.parse(content);if(isPillsBundle(o)){importPillsBundle(o);return}content=JSON.stringify(o,null,2)}catch{}}
          docs.unshift({id:uid(),name:file.name,ext:ext||'txt',size:file.size,addedAt:Date.now(),content});
          persistDocs();rebuild();};
        r.readAsText(file);
      }
    });
  }
  async function makePdfThumb(d){
    if(!d.dataUrl||!(await KOBLoadPDF()))return;
    try{
      const pdf=await pdfjsLib.getDocument({data:b64ToUint8(d.dataUrl)}).promise;
      d.pages=pdf.numPages;
      const page=await pdf.getPage(1);
      const vp=page.getViewport({scale:.45});
      const c=document.createElement('canvas');c.width=vp.width;c.height=vp.height;
      await page.render({canvasContext:c.getContext('2d'),viewport:vp}).promise;
      d.thumb=c.toDataURL('image/jpeg',.72);persistDocs();
    }catch{}
  }

  const stage=document.getElementById('stage');
  function rebuild(){
    const q=($('#q')?.value||'').trim().toLowerCase();
    view=docs.filter(d=>{
      if(filter==='fav'&&!d.fav)return false;
      if(filter==='fused'&&!d.fused)return false;
      if(filter==='today'||filter==='week'||filter==='month'){
        const t=Number(d.addedAt)||0,now=Date.now();
        if(filter==='today'){const z=new Date();z.setHours(0,0,0,0);if(t<z.getTime())return false}
        else if(t<now-(filter==='week'?7:30)*864e5)return false;
      }else if(filter!=='all'&&filter!=='fav'&&filter!=='fused'){
        if(d.fused)return false;                         /* fusões ficam só no grupo próprio */
        const e=(d.ext||'').toLowerCase();
        if(filter==='html'){if(e!=='html'&&e!=='htm')return false}
        else if(filter==='md'){if(e!=='md'&&e!=='markdown')return false}
        else if(e!==filter)return false;
      }
      if(!q)return true;
      return d.name.toLowerCase().includes(q)||(d.content&&d.content.toLowerCase().includes(q));
    });
    stage.innerHTML='';cards=[];
    view.forEach((d,i)=>{
      const t=typeOf(d.ext);
      const card=document.createElement('article');
      card.className='card';card.dataset.id=d.id;card.dataset.index=i;
      card.style.setProperty('--c',t.c);card.style.setProperty('--glow',hex2rgb(t.c,.30));
      const snippet=d.content?d.content.replace(/[#*`>_~\-]/g,' ').replace(/\s+/g,' ').trim().slice(0,180):(d.ext==='pdf'?'PDF':'Documento');
      card.innerHTML=`
        <button class="del">✕</button>
        <div class="thumb">
          <div class="thumb-img"${d.thumb?` style="background-image:url(${d.thumb})"`:''}></div>
          <div class="glyph">${esc(t.g)}</div>
        </div>
        <div class="card-body">
          <span class="badge">${t.label}${d.fav?' ★':''}</span>
          <h3>${esc(d.name)}</h3>
          <p class="snippet">${esc(snippet)}</p>
          <div class="card-foot"><span>${fmtSize(d.size)}</span><span>${fmtTime(d.addedAt)}</span></div>
          <div class="card-acts">
            <button type="button" data-ca="listen" data-mxp="mente:listen" title="Ouvir · Soneto">🎵</button>
            <button type="button" data-ca="hear" title="Ouvir no fone · toque de novo para parar">🎧</button>
            <button type="button" data-ca="copy" title="Copiar texto">⧉</button>
            <button type="button" data-ca="fuse" data-mxp="mente:mirror" title="Fundir · 1º toque marca a semente, 2º funde">⊕</button>
            <button type="button" data-ca="slice" title="Slice reader">✂</button>
            <button type="button" data-ca="win" data-mxp="mente:window" title="Session-window">▣</button>
            <button type="button" data-kob-download="${d.id}" title="Baixar TXT">⤓</button>
          </div>
        </div>`;
      card.addEventListener('click',e=>{
        if(e.target.closest('.del'))return;
        const ca=e.target.closest('[data-ca]');if(ca){e.stopPropagation();cardAct(ca.dataset.ca,d);return}   /* [v80] ações direto no card */
        if(moved)return;
        if(card.classList.contains('is-active'))openReader(d);
        else{index=i;layout()}
      });
      card.querySelector('.del').addEventListener('click',e=>{
        e.stopPropagation();docs=docs.filter(x=>x.id!==d.id);persistDocs();rebuild();toast('🗑️ Removido');
      });
      stage.appendChild(card);cards.push(card);
    });
    if(index>=view.length)index=Math.max(0,view.length-1);if(index<0)index=0;
    const dotsEl=$('#dots');dotsEl.innerHTML='';
    view.forEach((_,i)=>{const dot=document.createElement('span');dot.className='dot';
      dot.addEventListener('click',()=>{index=i;layout()});dotsEl.appendChild(dot)});
    $('#empty').classList.toggle('on',!view.length);
    $('#navDock').style.display=view.length?'flex':'none';
    layout();renderDocPills();
  }
  const spacing=()=>{const w=window.innerWidth;return w<520?Math.min(150,w*.42):w<860?170:205};
  function layout(){
    if(!cards.length)return;
    try{if(window.KOBActive&&view[index])KOBActive.doc(view[index])}catch(e){}   /* [v80] arquivo ativo → header */
    const SP=spacing();
    cards.forEach((el,i)=>{
      const off=i-index,abs=Math.abs(off);
      if(abs>4){el.style.opacity=0;el.style.pointerEvents='none';
        el.style.transform=`translate(-50%,-50%) translate3d(${off*SP}px,0,-1000px)`;
        el.style.zIndex=0;return}
      const x=off*SP+dragX,y=abs*14,z=-abs*210;
      const ry=off*-30+(dragX*-.035),sc=1-Math.min(abs,4)*.055;
      el.style.transform=`translate(-50%,-50%) translate3d(${x}px,${y}px,${z}px) rotateY(${ry}deg) scale(${sc})`;
      el.style.opacity=1-Math.min(abs,4)*.20;
      el.style.zIndex=100-abs;el.style.pointerEvents='auto';
      el.classList.toggle('is-active',off===0&&Math.abs(dragX)<55);
    });
    $$('.dot').forEach((d,i)=>d.classList.toggle('on',i===index));
  }
  function go(delta){if(!view.length)return;index=Math.max(0,Math.min(view.length-1,index+delta));layout()}
  stage.addEventListener('pointerdown',e=>{if(e.target.closest('.del'))return;
    dragging=true;moved=false;startX=e.clientX;dragX=0;stage.classList.add('dragging');
    try{stage.setPointerCapture(e.pointerId)}catch{}});
  stage.addEventListener('pointermove',e=>{if(!dragging)return;dragX=e.clientX-startX;
    if(Math.abs(dragX)>8)moved=true;layout()});
  function endDrag(){if(!dragging)return;dragging=false;stage.classList.remove('dragging');
    const dx=dragX;dragX=0;if(dx<-55)go(1);else if(dx>55)go(-1);else layout();
    setTimeout(()=>{moved=false},60)}
  stage.addEventListener('pointerup',endDrag);
  stage.addEventListener('pointercancel',endDrag);
  $('#prev')?.addEventListener('click',()=>go(-1));
  $('#next')?.addEventListener('click',()=>go(1));

  async function openReader(doc){
    currentDoc=doc;const t=typeOf(doc.ext);
    $('#rTitle').textContent=doc.name;
    $('#rFav').textContent=doc.fav?'★':'☆';
    $('#readerBody').innerHTML='<div class="pdf-loading">Carregando…</div>';
    $('#reader').classList.add('on');
    const ext=(doc.ext||'').toLowerCase();
    if(ext==='pdf'){if(!doc.thumb)makePdfThumb(doc).then(()=>{try{rebuild()}catch(e){}});await renderPdf(doc);}
    else if(ext==='md'||ext==='markdown')$('#readerBody').innerHTML='<div class="md">'+mdToHtml(doc.content||'')+'</div>';
    else if(/^(html?)$/.test(ext)&&doc.content){
      const fr=document.createElement('iframe');fr.className='html-frame';
      fr.setAttribute('sandbox','allow-scripts allow-popups allow-forms');   /* origem opaca: o HTML importado não alcança o app */
      fr.srcdoc=doc.content;$('#readerBody').innerHTML='';$('#readerBody').appendChild(fr);
    }
    else $('#readerBody').innerHTML='<pre class="plain">'+esc(doc.content||'(vazio)')+'</pre>';
  }
  function closeReader(){$('#reader').classList.remove('on');$('#readerBody').innerHTML='';
    currentDoc=null;if('speechSynthesis' in window)speechSynthesis.cancel()}
  $('#rClose')?.addEventListener('click',closeReader);
  $('#reader')?.addEventListener('click',e=>{if(e.target.id==='reader')closeReader()});
  $('#rFav')?.addEventListener('click',()=>{if(!currentDoc)return;
    currentDoc.fav=!currentDoc.fav;$('#rFav').textContent=currentDoc.fav?'★':'☆';persistDocs();rebuild()});
  $('#rSpeech')?.addEventListener('click',()=>{if(!currentDoc)return;
    const t=(currentDoc.content||currentDoc.name||'').slice(0,5000);
    if(t){speak(t);toast('🎙️ Lendo')}});
  $('#rPato')?.addEventListener('click',()=>{if(!currentDoc||!currentDoc.content)return;
    pushDerivedDoc(`${currentDoc.name} · Pato`,applyPato(currentDoc.content),{fromId:currentDoc.id});
    toast('🦆 Pato aplicado')});
  $('#rFundir')?.addEventListener('click',()=>fundirComSemente(currentDoc));
  $('#rDownload')?.addEventListener('click',()=>{if(!currentDoc)return;
    let url;if(currentDoc.dataUrl)url=currentDoc.dataUrl;
    else url=URL.createObjectURL(new Blob([currentDoc.content||''],{type:'text/plain;charset=utf-8'}));
    const a=document.createElement('a');a.href=url;a.download=currentDoc.name;
    document.body.appendChild(a);a.click();a.remove()});
  $('#rWindow')?.addEventListener('click',()=>{if(!currentDoc)return;openAsSession(currentDoc);closeReader()});   /* [v79] antes: createSessionWindow ignorava contentHtml */
  $('#rGerardo')?.addEventListener('click',()=>{
    if(!currentDoc||!currentDoc.content)return toast('Sem texto');
    const sents=currentDoc.content.split(/(?<=[.!?…])\s+/).map(s=>s.trim()).filter(Boolean);
    $('#readerBody').innerHTML='<div class="md">'+sents.map(s=>`<blockquote>${esc(s)}</blockquote>`).join('')+'</div>';
  });
  $('#rInject')?.addEventListener('click',()=>{if(!pendingSeedId)return toast('Marca uma Semente');
    const s=docs.find(x=>x.id===pendingSeedId);if(s){toast('🎧+ Injetado');speak(s.content||s.name)}});
  async function renderPdf(doc){
    if(!doc.dataUrl){$('#readerBody').innerHTML='PDF grande — reimporte';return}
    if(!(await KOBLoadPDF())){$('#readerBody').innerHTML='⚠️ pdf.js ausente';return}
    try{
      let pdf=pdfCache.get(doc.id);
      if(!pdf){pdf=await pdfjsLib.getDocument({data:b64ToUint8(doc.dataUrl)}).promise;pdfCache.set(doc.id,pdf)}
      doc.pages=pdf.numPages;$('#readerBody').innerHTML='';
      const wrap=document.createElement('div');wrap.className='pdf-wrap';$('#readerBody').appendChild(wrap);
      const maxPages=Math.min(pdf.numPages,40);
      for(let p=1;p<=maxPages;p++){
        const page=await pdf.getPage(p);const vp=page.getViewport({scale:1.6});
        const box=document.createElement('div');box.className='pdf-page';
        const c=document.createElement('canvas');c.width=vp.width;c.height=vp.height;
        box.appendChild(c);wrap.appendChild(box);
        await page.render({canvasContext:c.getContext('2d'),viewport:vp}).promise;
        await new Promise(r=>setTimeout(r,0));
      }
    }catch(err){$('#readerBody').innerHTML='❌ '+(err.message||'Erro')}
  }

  const patoSel=$('#patoPresetSelect');
  if(patoSel){patoSel.value=patoPreset;
    patoSel.addEventListener('change',()=>{patoPreset=patoSel.value;
      try{localStorage.setItem('nebula.pato.preset',patoPreset)}catch{}})}
  $('#q')?.addEventListener('input',()=>{index=0;rebuild()});
  $('#filterBar')?.addEventListener('click',e=>{
    const b=e.target.closest('.tab-pill');if(!b)return;
    filter=b.dataset.f;$$('.tab-pill').forEach(x=>x.classList.toggle('on',x===b));index=0;rebuild()});
  $('#btnImport')?.addEventListener('click',()=>$('#nbFileInput').click());
  $('#btnPaste')?.addEventListener('click',()=>{ pasteFromClipboard(); });
  $('#nbFileInput')?.addEventListener('change',e=>{handleFiles(e.target.files);e.target.value=''});
  const SAMPLES=[
    {name:'README.md',ext:'md',size:1800,content:`# NEBULA · Almasliber\n\n**Cards** funcionando. **Tema** ok. **Tone.js** ligado.\n\n## Uso\n- Card central → abrir\n- 🎙️ ouvir · 🌱 semente · 🪞 fundir\n- ⚙ Cockpit → solar, bg, backup\n- 🧠 Espaço da Mente → Fractal 369`},
    {name:'anotacoes.txt',ext:'txt',size:400,content:`Anotações\n=========\n\n- EMD em session window\n- Tone.js para sonoro\n- Tailwind removido\n- CSS puro, 1 controlador de tema`},
    {name:'config.json',ext:'json',size:200,content:JSON.stringify({app:'ALMASLIBER',versao:'2.1.0',tailwind:false,emd:true,tone:true},null,2)}
  ];
  function loadSamples(){
    const base=Date.now();
    SAMPLES.forEach((s,i)=>{if(docs.some(d=>d.name===s.name))return;
      docs.push({...s,id:uid(),addedAt:base-i*1000*60*17})});
    persistDocs();index=0;rebuild();toast('✨ Exemplos carregados');
  }
  $('#btnSample')?.addEventListener('click',loadSamples);

  restoreDocs();rebuild();
  if(!docs.length)setTimeout(loadSamples,500);

  window.KOBLLUX_VOICE=window.KOBLLUX_VOICE||{map:KOB_VOICES};
/* [v79] documento → session-window (MXP). Página temática + clique no parágrafo fala pela voz do arquétipo (postMessage KOB_TTS → Kob.js) */
  function docHtml(d){
    const cs=getComputedStyle(document.body),accent=(cs.getPropertyValue('--kob-voice-primary')||'').trim()||'#7bf3ff',accent2=(cs.getPropertyValue('--kob-L-secondary')||'').trim()||accent;
    const light=document.body.dataset.theme==='light';
    if(/^(html?)$/i.test(d.ext||'')&&d.content)return d.content;   /* [V5.12] HTML importado abre como página, não como texto */
    const body=d.content?mdToHtml(d.content):(d.dataUrl&&/^data:image/.test(d.dataUrl)?'<img src="'+d.dataUrl+'">':'<p>'+esc(d.name)+'</p>');
    return '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>'+esc(d.name)+'</title><style>:root{--a:'+accent+';--b:'+accent2+';color-scheme:'+(light?'light':'dark')+'}html,body{margin:0;background:transparent}body{font:15px/1.65 system-ui,sans-serif;padding:18px 18px 40px;background:color-mix(in srgb,'+(light?'#f6f8fb':'#0b0f18')+' 28%,transparent);color:'+(light?'#10151f':'#e8eef9')+'}h1,h2,h3{color:var(--a);line-height:1.25}blockquote{border-left:3px solid var(--a);margin:12px 0;padding:4px 12px;opacity:.9}code,pre{background:rgba(127,127,127,.15);border-radius:6px;padding:2px 5px}pre{padding:10px;overflow:auto}a{color:var(--a)}img{max-width:100%}.kh{font:700 10px ui-monospace,monospace;letter-spacing:.14em;opacity:.55;margin-bottom:10px}'+LIVRO_CSS+'</style></head><body><div class="kh">📄 '+esc(d.name)+' · toque num parágrafo para ouvir</div><div class="md">'+body+'</div><script>document.addEventListener("click",function(e){var t=e.target.closest("p,li,h1,h2,h3,blockquote");if(!t)return;var s=(t.innerText||"").trim();if(s.length>1)parent.postMessage({type:"KOB_TTS",text:s},"*")});<\/script></body></html>';
  }
  function openAsSession(d){
    if(!d)return toast('selecione um documento');
    const M=window.MXP;if(!M||!M.createSession){toast('MXP indisponível');return null}
    const html=docHtml(d);
    const url=html.length<110000?'data:text/html;charset=utf-8,'+encodeURIComponent(html):URL.createObjectURL(new Blob([html],{type:'text/html'}));
    return Promise.resolve(M.createSession('📄 '+d.name,{url:url,meta:{docId:d.id,kind:'doc'}})).then(function(s){toast('▣ documento em session-window');return s});
  }
  function activeDoc(){return view[index]||null}
  /* [v80] ações do card (antes só existiam dentro da pílula) */
  function cardAct(a,d){
    const S=window.KOBSonoro,text=d.content||d.name,nm=String(d.name||'').replace(/\.[^.]+$/,'');
    if(a==='listen'){if(S)S.playText(text,nm);else speak(text)}
    else if(a==='open')openReader(d);
    else if(a==='hear')hearToggle(d);
    else if(a==='copy')copyDoc(d);
    else if(a==='seed'){markSeed(d);if(S&&d.content)S.toSeed(d.content)}
    else if(a==='mirror'){if(S&&d.content){S.toMirror(d.content);toast('🪞 enviado ao espelho')}else toast('sem texto neste documento')}
    else if(a==='fuse')fundirComSemente(d);
    else if(a==='slice'){if(window.Nebula&&d.content){Nebula.loadDocument(d.content,d.name);window.KOBWorkspace&&KOBWorkspace.reveal('s0');const s0=document.getElementById('s0');s0&&s0.scrollIntoView({behavior:'smooth'});toast('✂ no slice reader')}else toast('sem texto neste documento')}
    else if(a==='win')openAsSession(d);
  }

  /* ── [V5.3] copiar · ouvir (toggle) · download vivo · exportar/importar JSON ── */
  let hearingId=null;
  function stopHearing(){
    try{ if(window.KOBBus&&typeof window.KOBBus.stop==='function') window.KOBBus.stop(); }catch(e){}
    try{ if('speechSynthesis' in window) speechSynthesis.cancel(); }catch(e){}
    ttsPlaying=false; hearingId=null;
  }
  function hearToggle(d){
    if(!d) return;
    const busy=('speechSynthesis' in window)&&(speechSynthesis.speaking||speechSynthesis.pending);
    if(busy&&hearingId===d.id){stopHearing();toast('⏹ Parado');return}
    const t=String(d.content||d.name||'').slice(0,5000);
    if(!t){toast('sem texto neste documento');return}
    hearingId=d.id; speak(t); toast('🎧 Ouvindo');
  }
  async function copyDoc(d){
    const t=String((d&&(d.content||d.name))||'');
    if(!t){toast('sem texto para copiar');return false}
    try{
      if(navigator.clipboard&&navigator.clipboard.writeText){await navigator.clipboard.writeText(t)}
      else throw new Error('no-clipboard');
    }catch(_){
      try{
        const ta=document.createElement('textarea');ta.value=t;ta.setAttribute('readonly','');
        ta.style.cssText='position:fixed;left:-9999px;top:0;opacity:0';
        document.body.appendChild(ta);ta.select();
        const ok=document.execCommand('copy');ta.remove();
        if(!ok)throw new Error('exec');
      }catch(e){toast('Não consegui copiar');return false}
    }
    toast('⧉ Copiado ✓');return true;
  }
  function saveBlob(blob,filename){
    const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=filename;
    document.body.appendChild(a);a.click();a.remove();
    setTimeout(()=>URL.revokeObjectURL(a.href),1500);
  }
  const safeName=n=>String(n||'documento').replace(/\.[^.]+$/,'').replace(/[^\w\-]+/g,'_').slice(0,60)||'documento';
  /* o handler antigo [data-kob-download] estava dentro de um bloco comentado: este é o ativo */
  if(!window.__kobPillDlLive){
    window.__kobPillDlLive=true;
    document.addEventListener('click',e=>{
      const btn=e.target.closest&&e.target.closest('[data-kob-download]');if(!btn)return;
      e.preventDefault();e.stopPropagation();
      const d=docs.find(x=>String(x.id)===String(btn.getAttribute('data-kob-download')));
      if(!d){toast('documento não encontrado');return}
      if(d.dataUrl){const a=document.createElement('a');a.href=d.dataUrl;a.download=d.name||'documento';document.body.appendChild(a);a.click();a.remove();return}
      saveBlob(new Blob([String(d.content||'')],{type:'text/plain;charset=utf-8'}),safeName(d.name)+'.txt');
      toast('⤓ Baixado');
    },true);
  }
  const PILL_FIELDS=['name','ext','content','dataUrl','fav','fused','addedAt','arch','fromId'];
  function exportPillsJSON(){
    if(!docs.length){toast('Nenhuma pílula para exportar');return null}
    const bundle={app:'KOBLLUX',kind:'kob-pills',version:1,exportedAt:new Date().toISOString(),count:docs.length,
      docs:docs.map(d=>{const o={};PILL_FIELDS.forEach(k=>{if(d[k]!==undefined)o[k]=d[k]});o.id=d.id;return o})};
    const stamp=new Date().toISOString().slice(0,10);
    saveBlob(new Blob([JSON.stringify(bundle,null,2)],{type:'application/json;charset=utf-8'}),'kob-pilulas-'+stamp+'.json');
    toast('⤓ '+docs.length+' pílulas exportadas');
    return bundle;
  }
  function isPillsBundle(o){
    return !!o&&(Array.isArray(o)||(typeof o==='object'&&(o.kind==='kob-pills'||Array.isArray(o.docs)||Array.isArray(o.pills))))&&
      (Array.isArray(o)?o:(o.docs||o.pills||[])).some(x=>x&&typeof x==='object'&&typeof x.name==='string'&&('content' in x||'dataUrl' in x));
  }
  function importPillsBundle(o){
    const arr=Array.isArray(o)?o:(o.docs||o.pills||[]);
    const sig=d=>String(d.name)+'|'+String(d.addedAt||'')+'|'+String((d.content||d.dataUrl||'').length);
    const have=new Set(docs.map(sig));const used=new Set(docs.map(d=>String(d.id)));
    const fresh=[];let skipped=0;
    arr.forEach(x=>{
      if(!x||typeof x!=='object'||typeof x.name!=='string'||!x.name){skipped++;return}
      if(typeof x.content!=='string'&&typeof x.dataUrl!=='string'){skipped++;return}
      const d={};PILL_FIELDS.forEach(k=>{if(x[k]!==undefined)d[k]=x[k]});
      d.addedAt=Number(d.addedAt)||Date.now();
      d.ext=d.ext||((d.name.split('.').pop()||'txt').toLowerCase());
      d.size=(d.content||d.dataUrl||'').length;
      if(have.has(sig(d))){skipped++;return}
      let id=x.id&&!used.has(String(x.id))?String(x.id):uid();
      used.add(id);d.id=id;have.add(sig(d));fresh.push(d);
    });
    if(fresh.length){docs=[...fresh,...docs];persistDocs();rebuild();
      const bar=$('#docPillsBar');if(bar&&bar.style.display==='flex')renderDocPills();}
    toast('⤒ '+fresh.length+' importadas'+(skipped?' · '+skipped+' ignoradas':''));
    return {imported:fresh.length,skipped};
  }
  function importPillsFiles(files){
    Array.from(files||[]).forEach(file=>{
      const r=new FileReader();
      r.onload=()=>{
        let o=null;try{o=JSON.parse(r.result)}catch(e){toast('JSON inválido: '+file.name);return}
        if(!isPillsBundle(o)){toast('Esse JSON não parece um pacote de pílulas');return}
        importPillsBundle(o);
      };
      r.readAsText(file);
    });
  }
  $('#btnPillsExport')?.addEventListener('click',exportPillsJSON);
  $('#btnPillsImport')?.addEventListener('click',()=>$('#pillsJsonInput')?.click());
  $('#pillsJsonInput')?.addEventListener('change',e=>{importPillsFiles(e.target.files);e.target.value=''});

  window.NebulaPills={
    version:'almasliber-2.2',
    copyDoc,hearToggle,exportPillsJSON,importPillsBundle,importPillsFiles,
    applyArch,speak,pushDerivedDoc,openReader,
    applyPato,merge369,markSeed,fundirComSemente,
    pasteFromClipboard,
    get docs(){return docs},get currentDoc(){return currentDoc},openAsSession,activeDoc,
    get arch(){return currentArch},get seedId(){return pendingSeedId}
  };
})();
