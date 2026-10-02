(function NebulaApp(){
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

  const persistDocs=()=>{try{localStorage.setItem(DOC_KEY,JSON.stringify(docs))}catch{}};
  const restoreDocs=()=>{try{const r=localStorage.getItem(DOC_KEY);if(r)docs=JSON.parse(r).filter(d=>d&&d.name)}catch{docs=[]}};

  // TTS
  let voices=[];
  const loadVoices=()=>{voices=window.speechSynthesis?speechSynthesis.getVoices():[]};
  if('speechSynthesis' in window){loadVoices();speechSynthesis.onvoiceschanged=loadVoices;
    setTimeout(loadVoices,400);setTimeout(loadVoices,1200)}
  function speak(text){
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

  function toast(msg){const el=$('#toast');el.textContent=msg;el.classList.add('on');
    clearTimeout(toast._t);toast._t=setTimeout(()=>el.classList.remove('on'),2400)}

  // Markdown
  function mdToHtml(src){
    const lines=String(src).replace(/\r\n?/g,'\n').split('\n');
    const out=[];let i=0;
    const inline=t=>t
      .replace(/`([^`]+)`/g,'<code>$1</code>')
      .replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>')
      .replace(/(^|[^*])\*([^*\n]+)\*/g,'$1<em>$2</em>')
      .replace(/~~(.+?)~~/g,'<del>$1</del>')
      .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g,'<a href="$2" target="_blank" rel="noopener">$1</a>');
    while(i<lines.length){
      const l=lines[i];
      if(/^\s*$/.test(l)){i++;continue}
      if(/^\s*```/.test(l)){const lang=l.trim().slice(3);i++;const buf=[];
        while(i<lines.length&&!/^\s*```/.test(lines[i])){buf.push(lines[i]);i++}i++;
        out.push(`<pre data-lang="${esc(lang)}"><code>${esc(buf.join('\n'))}</code></pre>`);continue}
      const h=l.match(/^(#{1,6})\s+(.*)$/);
      if(h){out.push(`<h${h[1].length}>${inline(h[2])}</h${h[1].length}>`);i++;continue}
      if(/^\s*(-{3,}|\*{3,}|_{3,})\s*$/.test(l)){out.push('<hr>');i++;continue}
      if(/^\s*>/.test(l)){const buf=[];
        while(i<lines.length&&/^\s*>/.test(lines[i])){buf.push(lines[i].replace(/^\s*>\s?/,''));i++}
        out.push('<blockquote>'+mdToHtml(buf.join('\n'))+'</blockquote>');continue}
      if(/^\s*\|/.test(l)&&i+1<lines.length&&/^\s*\|[\s:|-]+\|\s*$/.test(lines[i+1])){
        const sp=r=>r.trim().replace(/^\|/,'').replace(/\|$/,'').split('|').map(s=>s.trim());
        const head=sp(l);i+=2;const rows=[];
        while(i<lines.length&&/^\s*\|/.test(lines[i])){rows.push(sp(lines[i]));i++}
        out.push('<table><thead><tr>'+head.map(c=>`<th>${inline(c)}</th>`).join('')+'</tr></thead><tbody>'+
          rows.map(r=>'<tr>'+r.map(c=>`<td>${inline(c)}</td>`).join('')+'</tr>').join('')+'</tbody></table>');continue}
      if(/^\s*([-*+]|\d+\.)\s+/.test(l)){
        const ord=/^\s*\d+\./.test(l);const items=[];
        while(i<lines.length&&/^\s*([-*+]|\d+\.)\s+/.test(lines[i])){
          items.push(lines[i].replace(/^\s*([-*+]|\d+\.)\s+/,''));i++}
        const tag=ord?'ol':'ul';
        out.push(`<${tag}>`+items.map(t=>`<li>${inline(t)}</li>`).join('')+`</${tag}>`);continue}
      const buf=[];
      while(i<lines.length&&!/^\s*$/.test(lines[i])&&!/^(#{1,6}\s|>\s*|```|\s*([-*+]|\d+\.)\s)/.test(lines[i])){buf.push(lines[i]);i++}
      if(!buf.length){buf.push(lines[i]);i++}
      out.push('<p>'+inline(buf.join(' '))+'</p>');
    }
    return out.join('\n');
  }

  function applyArch(key){
    const normalized=String(key||'KOBLLUX').toUpperCase();
    const a=ARCHS[normalized]||ARCHS.KOBLLUX;currentArch=normalized;
    const r=document.documentElement;
    r.style.setProperty('--active',a.c1);r.style.setProperty('--active-2',a.c2);
    r.style.setProperty('--active-color',a.c1);r.style.setProperty('--active-secondary',a.c2);
    r.style.setProperty('--active-glow',hex2rgb(a.c1,.45));
    r.style.setProperty('--kob-voice-primary',a.c1);r.style.setProperty('--kob-voice-secondary',a.c2);
    document.body.dataset.arch=normalized.toLowerCase();
    document.body.dataset.voiceArch=normalized.toLowerCase();
    $$('.arch-chip').forEach(c=>c.classList.toggle('on',c.dataset.k===normalized));
    try{localStorage.setItem('nebula.arch',normalized)}catch{}
  }
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
  function updateSeedLabel(){
    const d=pendingSeedId?docs.find(x=>x.id===pendingSeedId):null;
    const txt=d?`Semente: ${d.name}`:'Semente: nenhuma marcada';
    $$('.g-seed-label').forEach(g=>g.textContent=txt);
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
          <button data-action="speak" title="Ouvir">🎙️</button>
          <button data-action="seed" title="Semente">🌱</button>
          <button data-action="fuse" title="Fundir">🪞</button>
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
    else if(a==='speak')speak((d.content||d.name).slice(0,5000));
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
          docs.unshift(d);persistDocs();rebuild();makePdfThumb(d);toast('📄 '+file.name);};
        r.readAsDataURL(file);
      }else{
        const r=new FileReader();
        r.onload=()=>{
          let content=r.result;
          if(ext==='json'){try{content=JSON.stringify(JSON.parse(content),null,2)}catch{}}
          docs.unshift({id:uid(),name:file.name,ext:ext||'txt',size:file.size,addedAt:Date.now(),content});
          persistDocs();rebuild();};
        r.readAsText(file);
      }
    });
  }
  async function makePdfThumb(d){
    if(!window.pdfjsLib||!d.dataUrl)return;
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
      if(filter!=='all'&&filter!=='fav'&&(d.ext||'').toLowerCase()!==filter)return false;
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
        </div>`;
      card.addEventListener('click',e=>{
        if(e.target.closest('.del'))return;
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
    if(ext==='pdf')await renderPdf(doc);
    else if(ext==='md'||ext==='markdown')$('#readerBody').innerHTML='<div class="md">'+mdToHtml(doc.content||'')+'</div>';
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
  $('#rWindow')?.addEventListener('click',()=>{if(!currentDoc)return;
    const d=currentDoc;let body='';
    if(d.content)body='<div class="md" style="padding:20px">'+mdToHtml(d.content)+'</div>';
    window.createSessionWindow?.({title:'📄 '+d.name,contentHtml:body});
    closeReader()});
  $('#rGerardo')?.addEventListener('click',()=>{
    if(!currentDoc||!currentDoc.content)return toast('Sem texto');
    const sents=currentDoc.content.split(/(?<=[.!?…])\s+/).map(s=>s.trim()).filter(Boolean);
    $('#readerBody').innerHTML='<div class="md">'+sents.map(s=>`<blockquote>${esc(s)}</blockquote>`).join('')+'</div>';
  });
  $('#rInject')?.addEventListener('click',()=>{if(!pendingSeedId)return toast('Marca uma Semente');
    const s=docs.find(x=>x.id===pendingSeedId);if(s){toast('🎧+ Injetado');speak(s.content||s.name)}});
  async function renderPdf(doc){
    if(!doc.dataUrl){$('#readerBody').innerHTML='PDF grande — reimporte';return}
    if(!window.pdfjsLib){$('#readerBody').innerHTML='⚠️ pdf.js ausente';return}
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

  const SOLAR_MODES=['day','sunset','night'];
  let solarAuto=localStorage.getItem('nebula.solar.auto')==='1';
  function setSolar(mode,auto){solarAuto=!!auto;
    document.body.classList.remove('solar-day','solar-sunset','solar-night');
    document.body.classList.add('solar-'+mode);
    try{localStorage.setItem('nebula.solar',mode);localStorage.setItem('nebula.solar.auto',solarAuto?'1':'0')}catch{}
    const l=$('#solarLabel');if(l)l.textContent=mode.toUpperCase()+(solarAuto?' · auto':'')}
  const solarByTime=()=>{const h=new Date().getHours();return(h>=6&&h<17)?'day':(h>=17&&h<19)?'sunset':'night'};
  $('#solarCycle')?.addEventListener('click',()=>{
    const cur=SOLAR_MODES.find(m=>document.body.classList.contains('solar-'+m))||'night';
    setSolar(SOLAR_MODES[(SOLAR_MODES.indexOf(cur)+1)%3],false)});
  $('#solarAuto')?.addEventListener('click',()=>{setSolar(solarByTime(),true);toast('Solar auto')});
  setInterval(()=>{if(solarAuto)setSolar(solarByTime(),true)},600000);
  const uName=$('#userName'),uModel=$('#userModel');
  try{const sU=localStorage.getItem('nebula.user'),sM=localStorage.getItem('nebula.model');
    if(sU)uName.value=sU;if(sM)uModel.value=sM}catch{}
  uName?.addEventListener('change',()=>{try{localStorage.setItem('nebula.user',uName.value)}catch{}});
  uModel?.addEventListener('change',()=>{try{localStorage.setItem('nebula.model',uModel.value)}catch{}});
  const patoSel=$('#patoPresetSelect');
  if(patoSel){patoSel.value=patoPreset;
    patoSel.addEventListener('change',()=>{patoPreset=patoSel.value;
      try{localStorage.setItem('nebula.pato.preset',patoPreset)}catch{}})}
  $('#exportState')?.addEventListener('click',()=>{
    const payload={app:'NEBULA',v:1,ts:new Date().toISOString(),
      docs:docs.filter(d=>!d.dataUrl||d.dataUrl.length<500000),arch:currentArch};
    const blob=new Blob([JSON.stringify(payload,null,2)],{type:'application/json'});
    const a=document.createElement('a');a.href=URL.createObjectURL(blob);
    a.download='nebula-backup-'+new Date().toISOString().slice(0,10)+'.json';
    a.click();toast('Backup exportado')});
  $('#resetState')?.addEventListener('click',()=>{
    if(!confirm('Resetar?'))return;
    ['nebula.docs.v1','nebula.arch','nebula.solar','nebula.solar.auto'].forEach(k=>{
      try{localStorage.removeItem(k)}catch{}});location.reload()});

  const bgEl=document.getElementById('bg-fake-custom') || document.body;
  let bgData='';try{bgData=localStorage.getItem('nebula.bg')||''}catch{}
  const applyBg=()=>{if(bgData){bgEl.style.backgroundImage=`url(${bgData})`;
    const op=+(document.getElementById('bgOpacity')?.value||60)/100;bgEl.style.opacity=op;
    const v=document.getElementById('bgOpacityVal');if(v)v.textContent=Math.round(op*100)+'%'}
    else{bgEl.style.backgroundImage='';bgEl.style.opacity='0'}};
  applyBg();
  $('#bgUpload')?.addEventListener('change',e=>{
    const f=e.target.files[0];if(!f)return;const r=new FileReader();
    r.onload=()=>{bgData=r.result;try{localStorage.setItem('nebula.bg',bgData)}catch{};applyBg()};
    r.readAsDataURL(f)});
  $('#bgClear')?.addEventListener('click',()=>{bgData='';
    try{localStorage.removeItem('nebula.bg')}catch{};applyBg()});
  $('#bgOpacity')?.addEventListener('input',()=>applyBg());

  $('#q')?.addEventListener('input',()=>{index=0;rebuild()});
  $('#filterBar')?.addEventListener('click',e=>{
    const b=e.target.closest('.tab-pill');if(!b)return;
    filter=b.dataset.f;$$('.tab-pill').forEach(x=>x.classList.toggle('on',x===b));index=0;rebuild()});
  $('#btnImport')?.addEventListener('click',()=>$('#fileInput').click());
  $('#fileInput')?.addEventListener('change',e=>{handleFiles(e.target.files);e.target.value=''});
  let dragDepth=0;
  window.addEventListener('dragenter',e=>{e.preventDefault();dragDepth++;$('#drop').classList.add('on')});
  window.addEventListener('dragover',e=>e.preventDefault());
  window.addEventListener('dragleave',e=>{e.preventDefault();dragDepth=Math.max(0,dragDepth-1);
    if(!dragDepth)$('#drop').classList.remove('on')});
  window.addEventListener('drop',e=>{e.preventDefault();dragDepth=0;$('#drop').classList.remove('on');
    if(e.dataTransfer?.files.length)handleFiles(e.dataTransfer.files)});

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

  const SB=[
    {icon:'[M]',label:'Espaço da Mente',act:()=>window.openEMD?.()},
    {icon:'[I]',label:'Importar',act:()=>$('#fileInput').click()},
    {icon:'[+]',label:'Exemplos',act:loadSamples},
    {icon:'[P]',label:'Pílulas',act:()=>$('#btnPills').click()},
    {icon:'[T]',label:'Tema',act:()=>window.DualTheme?.toggle()},
    {icon:'[N]',label:'Nova janela',act:()=>window.createSessionWindow?.({title:'Sessão'})},
    {icon:'[W]',label:'Splash Infodose',act:()=>window.createSessionWindow?.({title:'Splash',src:'https://www.infodose.com.br/splash'})},
    {icon:'[F]',label:'Factory',act:()=>window.MXP?.openFactory()}
  ];
  const sbItems=$('#sbItems'), symbolBar=$('#symbolBar'), sbToggle=$('#sbToggle'), sbOrb=$('#sbOrb'), sbCockpit=$('#sbCockpit');
  if(sbItems){
    sbItems.innerHTML=SB.map((a,i)=>`<button class="pill sm" data-sbi="${i}">${a.icon} ${a.label}</button>`).join('');
    sbItems.addEventListener('click',e=>{const b=e.target.closest('[data-sbi]');if(!b)return;
      const a=SB[+b.dataset.sbi];if(a?.act)a.act();
    });
  }
  function setSymbolBar(open){
    if(!symbolBar)return;
    symbolBar.classList.toggle('collapsed',!open);
    symbolBar.classList.toggle('open',open);
    symbolBar.setAttribute('aria-expanded',String(open));
    sbToggle?.setAttribute('aria-expanded',String(open));
    if(sbToggle)sbToggle.title=open?'Recolher menu':'Abrir menu';
  }
  sbToggle?.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();setSymbolBar(symbolBar.classList.contains('collapsed'));});
  function openUserCockpit(){
    const d=$('#drawerProfile'), ov=$('#drawerOverlay');
    if(!d)return;
    d.classList.add('on'); d.setAttribute('aria-hidden','false');
    ov?.classList.add('on'); ov?.setAttribute('aria-hidden','false');
  }
  function closeUserCockpit(){
    const d=$('#drawerProfile'), ov=$('#drawerOverlay');
    d?.classList.remove('on'); d?.setAttribute('aria-hidden','true');
    ov?.classList.remove('on'); ov?.setAttribute('aria-hidden','true');
  }
  window.KOBCockpit={open:openUserCockpit,close:closeUserCockpit,toggle:()=>{
    const d=$('#drawerProfile'); d?.classList.contains('on')?closeUserCockpit():openUserCockpit();
  }};
  sbCockpit?.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();openUserCockpit();});
  sbOrb?.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();
    setSymbolBar(true);
  });
  setSymbolBar(false);

  buildArchBar();
  try{applyArch(localStorage.getItem('nebula.arch')||'KOBLLUX')}catch{applyArch('KOBLLUX')}
  const savedSolar=localStorage.getItem('nebula.solar');
  if(savedSolar&&SOLAR_MODES.includes(savedSolar))setSolar(savedSolar,solarAuto);
  else setSolar(solarByTime(),solarAuto);
  restoreDocs();rebuild();
  if(!docs.length)setTimeout(loadSamples,500);

  window.KOBLLUX_VOICE={map:KOB_VOICES};
  window.Nebula={
    version:'almasliber-2.1',
    applyArch,speak,pushDerivedDoc,openReader,
    applyPato,merge369,markSeed,fundirComSemente,
    get docs(){return docs},get currentDoc(){return currentDoc},
    get arch(){return currentArch},get seedId(){return pendingSeedId}
  };
})();