(()=>{
  'use strict';
  const $=(s,r=document)=>r.querySelector(s);
  const $$=(s,r=document)=>[...r.querySelectorAll(s)];

  let emdRoot=null;

  // STATE
  const state={
    rawMerge:'',dictApplied:'',dictEnabled:false,dictRules:[],
    fmt:{chapters:true,subtitles:true,callouts:true,pagebreaks:false,wordsPerParagraph:12},
    view:'raw',slices:[],sliceIndex:0,sliceMode:'paragraph',sliceSize:420,sliceShowAll:false
  };
  let __lastSubs=0;
  let ttsPlaying=false,ttsUtter=null;

  // MOTOR 369
  const motor369={merge(a,b){
    const s1=a.split(/[.!?]+/).filter(s=>s.trim());
    const s2=b.split(/[.!?]+/).filter(s=>s.trim());
    const max=Math.max(s1.length,s2.length);let res='';
    for(let i=0;i<max;i++){const p=i%3;
      if(p===0&&s1[i])res+=s1[i].trim()+'. ';
      else if(p===1&&s2[i])res+=s2[i].trim()+'. ';
      else if(p===2&&s1[i])res+=s1[i].trim()+'. ';
      else if(s2[i])res+=s2[i].trim()+'. ';}
    return res;
  }};

  // MARKDOWN MIN
  const MD=(()=>{
    const esc=v=>String(v??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
    function inline(t){let s=esc(t);
      s=s.replace(/`([^`]+)`/g,(_,c)=>`<code>${c}</code>`);
      s=s.replace(/\*\*([^*]+)\*\*/g,'<strong>$1</strong>');
      s=s.replace(/(^|[^*])\*([^*]+)\*(?!\*)/g,'$1<em>$2</em>');
      return s;}
    function parse(text){
      const lines=String(text??'').replace(/\r\n?/g,'\n').split('\n');
      const out=[];let i=0;let para=[];
      const flush=()=>{if(!para.length)return;const j=para.join(' ').trim();if(j)out.push(`<p>${inline(j)}</p>`);para=[]};
      while(i<lines.length){
        const l=lines[i];
        if(!l.trim()){flush();i++;continue}
        const hm=l.match(/^(#{1,6})\s+(.*)$/);
        if(hm){flush();const n=hm[1].length;out.push(`<h${n}>${inline(hm[2])}</h${n}>`);i++;continue}
        if(/^\s*(?:-{3,}|\*{3,}|_{3,})\s*$/.test(l)){flush();out.push('<hr>');i++;continue}
        if(/^\s*>\s?/.test(l)){flush();const buf=[];
          while(i<lines.length&&/^\s*>\s?/.test(lines[i])){buf.push(lines[i].replace(/^\s*>\s?/,''));i++}
          out.push(`<blockquote>${inline(buf.join(' '))}</blockquote>`);continue}
        para.push(l.trim());i++;
      }
      flush();return out.join('\n');
    }
    return {render:parse};
  })();

  // SLICER
  function makeSlices(text){
    if(!text||!text.trim())return[];
    const m=state.sliceMode,s=state.sliceSize,c=[];
    if(m==='paragraph'){text.split(/\n{2,}/).forEach(p=>{const t=p.trim();if(t)c.push(t)})}
    else if(m==='sentence'){const rx=/[^.!?]+[.!?]+[\s]*/g;let mm,last=0;
      while((mm=rx.exec(text))!==null){c.push(mm[0].trim());last=rx.lastIndex}
      const t=text.slice(last).trim();if(t)c.push(t)}
    else{const w=text.split(/(\s+)/);let b='';for(const x of w){if((b+x).length>s&&b.trim()){c.push(b.trim());b=x}else b+=x}
      if(b.trim())c.push(b.trim())}
    if(!c.length&&text.trim())c.push(text.trim());
    return c;
  }
  function sliceTitle(t){const w=t.match(/[\wÀ-ú]+/g)||[];return (w.slice(0,4).join(' ')||'Fatia').slice(0,44)}

  // DICT
  const DICT_PRESETS={
    patoDoMundo:[
      {from:'de',to:'ðŸ¦†',wholeWord:true,enabled:true},
      {from:'do',to:'ðö¦†',wholeWord:true,enabled:true},
      {from:'diário',to:'ðŸ¦†Ariö',wholeWord:true,enabled:true},
      {from:'dual',to:'†ðual',wholeWord:false,enabled:true},
      {from:'mundo',to:'MöNdö¦†',wholeWord:true,enabled:true},
      {from:'não',to:'NÃ£o†',wholeWord:true,enabled:true},
      {from:'pato',to:'PaTo†',wholeWord:true,enabled:true}
    ],
    kblx:[
      {from:'de',to:'ðŸ¦†',wholeWord:true,enabled:true},
      {from:'do',to:'ðö¦†',wholeWord:true,enabled:true}
    ],
    vazio:[]
  };
  const escapeRegex=s=>String(s).replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
  function applyDictionary(text,rules){
    if(!text)return{text:'',total:0};
    const active=rules.filter(r=>r.enabled&&r.from).sort((a,b)=>b.from.length-a.from.length);
    let out=text,total=0;
    for(const rule of active){
      const e=escapeRegex(rule.from);let rx;
      try{rx=rule.wholeWord?new RegExp(`(?<![\\p{L}\\p{N}_])${e}(?![\\p{L}\\p{N}_])`,'giu'):new RegExp(e,'giu')}
      catch{rx=new RegExp(e,'gi')}
      let count=0;out=out.replace(rx,()=>{count++;return rule.to});total+=count;
    }
    return{text:out,total};
  }

  // TTS
  function toggleTTS(force){
    if(ttsPlaying){speechSynthesis.cancel();ttsPlaying=false;updateTTSBtn();return}
    const text=force||state.dictApplied;
    if(!text||!text.trim()){alert('Gera um resultado primeiro');return}
    speechSynthesis.cancel();
    ttsUtter=new SpeechSynthesisUtterance(text);
    const v=speechSynthesis.getVoices().find(v=>v.lang.startsWith('pt'));
    if(v)ttsUtter.voice=v;
    ttsUtter.rate=.95;
    ttsUtter.onend=()=>{ttsPlaying=false;updateTTSBtn()};
    ttsUtter.onerror=()=>{ttsPlaying=false;updateTTSBtn()};
    speechSynthesis.speak(ttsUtter);ttsPlaying=true;updateTTSBtn();
  }
  function updateTTSBtn(){
    $$('[data-emd-action="toggle-tts"]',emdRoot).forEach(b=>{
      b.classList.toggle('playing',ttsPlaying);b.textContent=ttsPlaying?'⏸':'🎧';
    });
    const sp=$('#emdSlicePlay',emdRoot);if(sp){sp.classList.toggle('active',ttsPlaying);sp.textContent=ttsPlaying?'⏸':'🎧'}
  }

  // SONORO
  let sonoroStarted=false,sonoroPlaying=false,sonoroPart=null;
  let sonoroSynths={},sonoroReverb=null,sonoroDelay=null,sonoroAnalyser=null;
  let sonoroSpans=[],sonoroRaf=null;
  const SONORO_SCALES={
    melancolia:['A3','B3','C4','D4','E4','F4','G#4','A4','B4','C5','D5','E5','F5','G#5','A5'],
    alegria:['C4','D4','E4','G4','A4','C5','D5','E5','G5','A5','C6','D6','E6','G6','A6'],
    misterio:['C4','D4','E4','F#4','G#4','A#4','C5','D5','E5','F#5','G#5','A#5','C6','D6','E6'],
    sonho:['F3','G3','A3','B3','C4','D4','E4','F4','G4','A4','B4','C5','D5','E5','F5'],
    oriental:['A3','A#3','D4','E4','F4','A4','A#4','D5','E5','F5','A5'],
    cyberpunk:['E3','F3','G#3','A3','B3','C4','D4','E4','F4','G#4','A4','B4','C5','D5','E5']
  };
  const AL='abcdefghijklmnopqrstuvwxyzáàãâéêíóôõúçñ';
  const toneOk=()=>typeof Tone!=='undefined'&&Tone;
  function initSonoro(){
    if(!toneOk()||sonoroStarted)return sonoroStarted;
    const revEl=$('#emdSonRev',emdRoot);
    const wet=revEl?Math.max(0,Math.min(100,parseInt(revEl.value,10)||40))/100:.4;
    sonoroReverb=new Tone.Reverb({decay:3.5,wet}).toDestination();
    sonoroDelay=new Tone.FeedbackDelay('8n',.25).connect(sonoroReverb);
    sonoroAnalyser=new Tone.Waveform(128);Tone.Destination.connect(sonoroAnalyser);
    sonoroSynths.softKey=new Tone.PolySynth(Tone.Synth,{oscillator:{type:'triangle'},envelope:{attack:.02,decay:.3,sustain:.2,release:1.2}}).connect(sonoroDelay);sonoroSynths.softKey.volume.value=-6;
    sonoroSynths.marimba=new Tone.PolySynth(Tone.Synth,{oscillator:{type:'sine'},envelope:{attack:.005,decay:.2,sustain:.01,release:.4}}).connect(sonoroDelay);sonoroSynths.marimba.volume.value=-4;
    sonoroSynths.synthwave=new Tone.PolySynth(Tone.AMSynth,{harmonicity:2.5,oscillator:{type:'sawtooth'}}).connect(sonoroDelay);sonoroSynths.synthwave.volume.value=-10;
    sonoroSynths.ambient=new Tone.PolySynth(Tone.DuoSynth).connect(sonoroDelay);sonoroSynths.ambient.volume.value=-12;
    sonoroSynths.quote=new Tone.PolySynth(Tone.FMSynth,{harmonicity:3,modulationIndex:4}).connect(sonoroReverb);
    sonoroSynths.bass=new Tone.MembraneSynth().toDestination();
    sonoroStarted=true;return true;
  }
  function parseEvents(text,theme){
    const ev=[];const sc=SONORO_SCALES[theme]||SONORO_SCALES.melancolia;
    let step=0;const sd=Tone.Time('16n').toSeconds();let inQ=false;
    for(let i=0;i<text.length;i++){
      const ch=text[i];const cl=ch.toLowerCase();
      const isUp=ch!==cl&&AL.includes(cl);
      if(ch==='"'||ch==='“'||ch==='”'||ch==="'"){inQ=!inQ;ev.push({time:step*sd,index:i,type:'quote-mark'});step++;continue}
      if(ch===' '||ch==='\n'){ev.push({time:step*sd,index:i,type:'space'});step+=ch==='\n'?3:1;continue}
      if(ch==='.'||ch==='!'||ch==='?'){const n=ch==='!'?'E1':ch==='?'?'G1':'C1';
        ev.push({time:step*sd,index:i,type:'bass',note:n,duration:'4n'});step+=4;continue}
      if(ch===','||ch===';'){ev.push({time:step*sd,index:i,type:'punct-pause'});step+=2;continue}
      const ai=AL.indexOf(cl);
      if(ai!==-1){
        let note=sc[ai%sc.length];if(isUp)note=Tone.Frequency(note).transpose(12).toNote();
        ev.push({time:step*sd,index:i,type:inQ?'quote':'main',isUppercase:isUp,note,duration:isUp?'8n':'16n'});
        step+=isUp?1.8:1.4;
      }else{ev.push({time:step*sd,index:i,type:'symbol'});step++}
    }
    ev.push({time:step*sd,type:'end'});return ev;
  }
  function renderViz(text){
    const viz=$('#emdSonViz',emdRoot);if(!viz)return;
    viz.innerHTML='';sonoroSpans=[];
    for(let i=0;i<text.length;i++){
      const s=document.createElement('span');s.className='sch';
      if(text[i]==='\n')s.innerHTML='<br>';
      else if(text[i]===' '){s.innerHTML='&nbsp;';s.classList.add('sch-space')}
      else s.textContent=text[i];
      viz.appendChild(s);sonoroSpans.push(s);
    }
  }
  function setupCanvas(){
    const c=$('#emdSonCanvas',emdRoot);if(!c)return;
    const dpr=window.devicePixelRatio||1;const r=c.getBoundingClientRect();
    c.width=r.width*dpr;c.height=r.height*dpr;
    const ctx=c.getContext('2d');ctx.setTransform(1,0,0,1,0,0);ctx.scale(dpr,dpr);
  }
  function drawWave(){
    sonoroRaf=requestAnimationFrame(drawWave);
    const c=$('#emdSonCanvas',emdRoot);if(!c)return;
    const ctx=c.getContext('2d');const w=c.getBoundingClientRect().width;const h=c.getBoundingClientRect().height;
    ctx.fillStyle='rgba(2,6,23,.35)';ctx.fillRect(0,0,w,h);
    if(!sonoroAnalyser||!sonoroPlaying){
      ctx.beginPath();ctx.strokeStyle='rgba(123,97,255,.28)';ctx.lineWidth=1.5;
      ctx.moveTo(0,h/2);ctx.lineTo(w,h/2);ctx.stroke();return;}
    const v=sonoroAnalyser.getValue();
    ctx.beginPath();ctx.lineWidth=2;ctx.strokeStyle='#00f5ff';ctx.shadowColor='rgba(0,245,255,.7)';ctx.shadowBlur=8;
    const sl=w/v.length;let x=0;
    for(let i=0;i<v.length;i++){const y=((v[i]+1)/2)*h;if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);x+=sl}
    ctx.lineTo(w,h/2);ctx.stroke();ctx.shadowBlur=0;
  }
  function renderSonoro(){
    const out=$('#emdOut',emdRoot);if(!out)return;
    const text=state.dictApplied||'';
    if(!text.trim()){out.innerHTML='<div class="emd-empty">Funde textos primeiro.</div>';return}
    out.innerHTML=`<div class="emd-son-wrap">
      <div class="emd-canvas-wrap"><canvas id="emdSonCanvas"></canvas></div>
      <div id="emdSonViz" class="emd-viz"></div>
      <div class="emd-hint">Letras → notas · MAIÚSCULAS → +oitava · citações → FM · . ! ? → graves</div></div>`;
    renderViz(text);setupCanvas();if(!sonoroRaf)drawWave();
  }
  function updateSonoroUI(){
    const p=$('#emdSonPlay',emdRoot);if(p){p.classList.toggle('active',sonoroPlaying);p.textContent=sonoroPlaying?'⏸':'▶'}
    $$('[data-emd-action="play-sonoro"]',emdRoot).forEach(b=>{
      b.classList.toggle('playing',sonoroPlaying);b.textContent=sonoroPlaying?'⏸':'🎵';
    });
  }
  async function startSonoro(){
    if(!toneOk()){alert('Tone.js não carregou');return}
    const text=state.dictApplied||'';
    if(!text.trim()){alert('Funde os textos primeiro');return}
    if(sonoroPlaying){stopSonoro();return}
    try{await Tone.start()}catch{}
    if(!initSonoro())return;
    if(!$('#emdSonViz',emdRoot))renderSonoro();
    renderViz(text);
    const th=$('#emdSonTheme',emdRoot)?.value||'melancolia';
    const sk=$('#emdSonSynth',emdRoot)?.value||'softKey';
    const main=sonoroSynths[sk]||sonoroSynths.softKey;
    const ev=parseEvents(text,th);
    if(sonoroPart){sonoroPart.dispose();sonoroPart=null}
    Tone.Transport.stop();Tone.Transport.cancel(0);
    sonoroPart=new Tone.Part((time,e)=>{
      if(e.type==='main')main.triggerAttackRelease(e.note,e.duration,time);
      else if(e.type==='quote')sonoroSynths.quote.triggerAttackRelease(e.note,e.duration,time);
      else if(e.type==='bass')sonoroSynths.bass.triggerAttackRelease(e.note,e.duration,time);
      else if(e.type==='end'){Tone.Draw.schedule(()=>stopSonoro(),time);return}
      Tone.Draw.schedule(()=>{
        const s=sonoroSpans[e.index];if(!s)return;
        let cls='sch-main';
        if(e.type==='quote'||e.type==='quote-mark')cls='sch-quote';
        else if(e.isUppercase)cls='sch-accent';
        else if(e.type==='bass'||e.type==='punct-pause')cls='sch-punct';
        s.classList.add(cls);
        if(e.index%14===0&&s.scrollIntoView)s.scrollIntoView({behavior:'smooth',block:'nearest'});
        setTimeout(()=>s.classList.remove(cls),220);
      },time);
    },ev).start(0);
    Tone.Transport.start();sonoroPlaying=true;updateSonoroUI();
  }
  function stopSonoro(){
    if(sonoroPart){try{sonoroPart.dispose()}catch{}sonoroPart=null}
    if(toneOk()){try{Tone.Transport.stop();Tone.Transport.cancel(0)}catch{}}
    sonoroSpans.forEach(s=>{s.className='sch'+(s.classList.contains('sch-space')?' sch-space':'')});
    sonoroPlaying=false;updateSonoroUI();
  }

  // REFRESH
  function refresh(){
    const prev=state.dictApplied;
    if(state.dictEnabled&&state.dictRules.length){
      const r=applyDictionary(state.rawMerge,state.dictRules);
      state.dictApplied=r.text;__lastSubs=r.total;
    }else{state.dictApplied=state.rawMerge;__lastSubs=0}
    if(sonoroPlaying&&state.dictApplied!==prev)stopSonoro();
    state.slices=makeSlices(state.dictApplied);
    renderView();updateStats();updateSummary();
  }
  function renderView(){
    const out=$('#emdOut',emdRoot);if(!out)return;
    const v=state.view;
    $$('.emd-tab',emdRoot).forEach(t=>t.classList.toggle('active',t.dataset.emdView===v));
    const sR=$('#emdStripRaw',emdRoot),sG=$('#emdStripRich',emdRoot),
      sS=$('#emdStripSlices',emdRoot),sSo=$('#emdStripSonoro',emdRoot);
    if(sR)sR.style.display=v==='raw'?'flex':'none';
    if(sG)sG.style.display=v==='rich'?'flex':'none';
    if(sS)sS.style.display=v==='slices'?'flex':'none';
    if(sSo)sSo.style.display=v==='sonoro'?'flex':'none';
    if(v==='raw'){
      const i=$('#emdRawInfo',emdRoot);
      if(i)i.innerHTML=`<b style="color:var(--emd-glow2)">${state.dictApplied.length.toLocaleString('pt-BR')}</b> chars · <b style="color:var(--emd-glow2)">${state.slices.length}</b> fatias · ${state.dictEnabled?'Pato ON':'OFF'}`;
    }
    out.classList.toggle('rich',v==='rich'||v==='sonoro');
    if(v==='raw'){out.textContent=state.dictApplied;out.scrollTop=0;return}
    if(v==='rich'){out.innerHTML=state.dictApplied?MD.render(state.dictApplied):'';out.scrollTop=0;return}
    if(v==='slices'){renderSlices();return}
    if(v==='sonoro'){renderSonoro();return}
  }
  function renderSlices(){
    const out=$('#emdOut',emdRoot);if(!out)return;
    const s=state.slices;
    if(!s.length){out.innerHTML='<div class="emd-empty">Sem fatias.</div>';updateCounter();return}
    if(state.sliceShowAll)out.innerHTML=s.map((x,i)=>sliceCard(x,i)).join('');
    else{const i=Math.max(0,Math.min(state.sliceIndex,s.length-1));out.innerHTML=sliceCard(s[i],i)}
    out.scrollTop=0;updateCounter();
  }
  function sliceCard(text,i){
    const total=state.slices.length;
    return `<div class="emd-slice">
      <div class="emd-tag">${String(i+1).padStart(2,'0')} / ${String(total).padStart(2,'0')}</div>
      <div class="emd-st">${sliceTitle(text)}</div>
      <div class="emd-sb">${MD.render(text)}</div>
      <div class="emd-sacts">
        <button type="button" data-emd-slice-copy="${i}">⧉ Copiar</button>
        <button type="button" data-emd-slice-seed="${i}">→ Semente</button>
        <button type="button" data-emd-slice-mirror="${i}">→ Espelho</button>
        <button type="button" data-emd-slice-play="${i}">🎧 Ouvir</button>
      </div></div>`;
  }
  function updateCounter(){
    const e=$('#emdSliceCounter',emdRoot);if(!e)return;
    const t=state.slices.length,c=t?(state.sliceIndex+1):0;
    e.innerHTML=`${state.sliceShowAll?'TODAS':'FATIA'} <b>${c}</b>/${t}`;
  }
  function updateSummary(){
    const e=$('#emdResultSum',emdRoot);if(!e)return;
    if(!state.rawMerge)e.textContent='Fusão Fractal · 369';
    else e.textContent=`${state.dictApplied.length.toLocaleString('pt-BR')} chars · ${state.slices.length} fatias`;
  }
  function updateStats(){
    const t=state.dictRules.length,a=state.dictRules.filter(r=>r.enabled).length,s=__lastSubs||0;
    const rr=$('#emdDsRules',emdRoot),ra=$('#emdDsActive',emdRoot),rs=$('#emdDsSubs',emdRoot);
    if(rr)rr.textContent=t;if(ra)ra.textContent=a;if(rs)rs.textContent=s;
  }

  // MERGE
  function doMerge(){
    const t1=$('#emdT1',emdRoot).value.trim();
    const t2=$('#emdT2',emdRoot).value.trim();
    if(!t1||!t2){alert('Cola 2 textos primeiro');return}
    state.rawMerge=motor369.merge(t1,t2);
    $('#emdResultPanel',emdRoot).style.display='block';
    $('#emdResultEmpty',emdRoot).style.display='none';
    localStorage.setItem('emd_ultimo',state.rawMerge);
    localStorage.setItem('emd_t1',t1);localStorage.setItem('emd_t2',t2);
    refresh();
    $('#emdResult',emdRoot).open=true;
  }

  // ACTIONS
  async function colar(id){const c=$('#'+id,emdRoot);if(!c)return;
    try{const t=await navigator.clipboard.readText();if(!t)return;c.value=t;c.dispatchEvent(new Event('input',{bubbles:true}));c.focus()}
    catch{alert('Clipboard bloqueado')}}
  async function copiar(){const t=state.dictApplied;if(!t)return alert('Sem resultado');
    try{await navigator.clipboard.writeText(t);alert('Copiado')}
    catch{const ta=document.createElement('textarea');ta.value=t;document.body.appendChild(ta);ta.select();document.execCommand('copy');ta.remove()}}
  function baixar(){const t=state.dictApplied;if(!t)return alert('Sem resultado');
    const b=new Blob([t],{type:'text/plain;charset=utf-8'});
    const u=URL.createObjectURL(b);const a=document.createElement('a');
    a.href=u;a.download=`espaco-da-mente-${new Date().toISOString().replace(/[:.]/g,'-')}.txt`;
    a.click();setTimeout(()=>URL.revokeObjectURL(u),1000)}
  function toSeed(){const t=state.dictApplied;if(!t)return;
    $('#emdT1',emdRoot).value=t;localStorage.setItem('emd_t1',t);$('#emdSeed',emdRoot).open=true}
  function toMirror(){const t=state.dictApplied;if(!t)return;
    $('#emdT2',emdRoot).value=t;localStorage.setItem('emd_t2',t);$('#emdMirror',emdRoot).open=true}
  function swap(){const a=$('#emdT1',emdRoot),b=$('#emdT2',emdRoot);const v=a.value;a.value=b.value;b.value=v;
    localStorage.setItem('emd_t1',a.value);localStorage.setItem('emd_t2',b.value)}
  function limpar(id){const c=$('#'+id,emdRoot);if(!c)return;c.value=''}
  function toNebula(){const t=state.dictApplied;if(!t)return alert('Sem resultado');
    if(!window.Nebula?.pushDerivedDoc)return alert('Nebula indisponível');
    window.Nebula.pushDerivedDoc(`Fractal 369 · ${new Date().toLocaleString('pt-BR')}`,t,{fused:true,from:'emd'});
    alert('⇧ Enviado ao Nebula')}
  function fromNebula(id){
    const d=window.Nebula?.currentDoc;
    if(!d){alert('Nenhum doc aberto no Nebula');return}
    const c=$('#'+id,emdRoot);if(!c)return;
    c.value=d.content||d.name;c.dispatchEvent(new Event('input',{bubbles:true}));
    alert(`⇩ "${d.name}" carregado`);
  }
  function toggleDict(){
    state.dictEnabled=!state.dictEnabled;
    localStorage.setItem('emd_dict_enabled',state.dictEnabled?'1':'0');
    const t=$('[data-emd-action="toggle-dict"]',emdRoot);if(t)t.classList.toggle('on',state.dictEnabled);
    refresh();
  }

  // DICT UI
  function renderRules(){
    const list=$('#emdRulesList',emdRoot);if(!list)return;
    list.innerHTML='';
    if(!state.dictRules.length){list.innerHTML='<div class="emd-empty">Nenhuma regra.</div>';updateStats();return}
    state.dictRules.forEach((r,i)=>{
      const row=document.createElement('div');
      row.className='emd-rule'+(r.enabled?' on':'')+(r.wholeWord?' wb-on':'');
      row.innerHTML=`
        <div class="chk">${r.enabled?'✓':''}</div>
        <input type="text" data-field="from" value="${r.from}">
        <div class="arrow">→</div>
        <input type="text" data-field="to" value="${r.to}">
        <div class="wb">WB</div>
        <button class="del">✕</button>`;
      row.querySelector('.chk').addEventListener('click',e=>{e.stopPropagation();state.dictRules[i].enabled=!state.dictRules[i].enabled;saveRules();renderRules();refresh()});
      row.querySelector('.wb').addEventListener('click',e=>{e.stopPropagation();state.dictRules[i].wholeWord=!state.dictRules[i].wholeWord;saveRules();renderRules();refresh()});
      row.querySelector('.del').addEventListener('click',e=>{e.stopPropagation();state.dictRules.splice(i,1);saveRules();renderRules();refresh()});
      row.querySelectorAll('input').forEach(inp=>{
        inp.addEventListener('input',e=>{state.dictRules[i][e.target.dataset.field]=e.target.value;saveRules();refresh()});
        inp.addEventListener('click',e=>e.stopPropagation());
      });
      list.appendChild(row);
    });
    updateStats();
  }
  const saveRules=()=>{try{localStorage.setItem('emd_dict_rules',JSON.stringify(state.dictRules))}catch{}};
  function loadRules(){try{const s=localStorage.getItem('emd_dict_rules');if(s){const p=JSON.parse(s);if(Array.isArray(p))return p}}catch{}return[]}

  // DELEGATION
  function bindAll(root){
    // Merge
    $('#emdMergeBtn',root)?.addEventListener('click',doMerge);

    // Actions
    root.addEventListener('click',e=>{
      const a=e.target.closest('[data-emd-action]');
      if(a){
        const act=a.dataset.emdAction;
        if(act==='paste'){e.stopPropagation();colar(a.dataset.target);return}
        if(act==='clear-field'){e.stopPropagation();limpar(a.dataset.target);return}
        if(act==='from-nebula'){e.stopPropagation();fromNebula(a.dataset.target);return}
        if(act==='copy-result'){e.stopPropagation();copiar();return}
        if(act==='download-result'){e.stopPropagation();baixar();return}
        if(act==='result-to-seed'){e.stopPropagation();toSeed();return}
        if(act==='result-to-mirror'){e.stopPropagation();toMirror();return}
        if(act==='swap'){e.stopPropagation();swap();return}
        if(act==='toggle-tts'){e.stopPropagation();toggleTTS();return}
        if(act==='play-sonoro'){e.stopPropagation();state.view='sonoro';renderView();setTimeout(startSonoro,60);return}
        if(act==='toggle-dict'){e.stopPropagation();toggleDict();return}
        if(act==='emd-to-nebula'){e.stopPropagation();toNebula();return}
      }
      const tab=e.target.closest('.emd-tab');
      if(tab){
        const nv=tab.dataset.emdView;
        if(nv!=='sonoro'&&sonoroPlaying)stopSonoro();
        state.view=nv;state.sliceShowAll=false;renderView();return;
      }
      const sn=e.target.closest('[data-emd-slice]');
      if(sn){
        const k=sn.dataset.emdSlice;const t=state.slices.length;if(!t)return;
        if(k==='next'&&!state.sliceShowAll)state.sliceIndex=(state.sliceIndex+1)%t;
        else if(k==='prev'&&!state.sliceShowAll)state.sliceIndex=(state.sliceIndex-1+t)%t;
        else if(k==='all')state.sliceShowAll=!state.sliceShowAll;
        renderSlices();return;
      }
      const sm=e.target.closest('.emd-smode');
      if(sm){
        state.sliceMode=sm.dataset.emdSmode;
        $$('.emd-smode',root).forEach(x=>x.classList.toggle('active',x.dataset.emdSmode===state.sliceMode));
        state.slices=makeSlices(state.dictApplied);state.sliceIndex=0;renderSlices();return;
      }
      const cp=e.target.closest('[data-emd-slice-copy]');
      if(cp){const i=parseInt(cp.dataset.emdSliceCopy,10);const t=state.slices[i];
        if(t)navigator.clipboard?.writeText(t);return}
      const sd=e.target.closest('[data-emd-slice-seed]');
      if(sd){const i=parseInt(sd.dataset.emdSliceSeed,10);const t=state.slices[i];
        if(t){$('#emdT1',root).value=t;$('#emdSeed',root).open=true};return}
      const mr=e.target.closest('[data-emd-slice-mirror]');
      if(mr){const i=parseInt(mr.dataset.emdSliceMirror,10);const t=state.slices[i];
        if(t){$('#emdT2',root).value=t;$('#emdMirror',root).open=true};return}
      const pl=e.target.closest('[data-emd-slice-play]');
      if(pl){const i=parseInt(pl.dataset.emdSlicePlay,10);const t=state.slices[i];
        if(t){state.sliceIndex=i;renderSlices();toggleTTS(t)};return}
      const f=e.target.closest('.emd-fmt');
      if(f){const k=f.dataset.emdFmt;state.fmt[k]=!state.fmt[k];f.classList.toggle('on',state.fmt[k]);saveFmt();refresh();return}
      const dp=e.target.closest('.emd-dict-p');
      if(dp){const k=dp.dataset.emdPreset;
        if(k==='vazio'){if(!confirm('Limpar?'))return;state.dictRules=[];saveRules();renderRules();refresh();return}
        const p=DICT_PRESETS[k];if(!p)return;state.dictRules=JSON.parse(JSON.stringify(p));
        saveRules();renderRules();refresh();return}
    });

    // Inputs
    $('#emdSliceSize',root)?.addEventListener('input',e=>{
      state.sliceSize=Math.max(80,Math.min(2000,parseInt(e.target.value,10)||420));
      if(state.sliceMode==='char'){state.slices=makeSlices(state.dictApplied);state.sliceIndex=0;renderSlices()}});
    $('#emdFmtWords',root)?.addEventListener('input',e=>{
      state.fmt.wordsPerParagraph=Math.max(4,Math.min(60,parseInt(e.target.value,10)||12));saveFmt()});
    $('#emdSlicePlay',root)?.addEventListener('click',()=>{
      const s=state.slices[state.sliceIndex]||state.dictApplied;toggleTTS(s)});
    $('#emdAddRule',root)?.addEventListener('click',()=>{
      state.dictRules.push({from:'',to:'',wholeWord:true,enabled:true});saveRules();renderRules()});
    $('#emdExportRules',root)?.addEventListener('click',()=>{
      const b=new Blob([JSON.stringify(state.dictRules,null,2)],{type:'application/json'});
      const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='pato.json';a.click()});
    $('#emdImportRules',root)?.addEventListener('click',()=>$('#emdImportFile',root).click());
    $('#emdImportFile',root)?.addEventListener('change',async e=>{
      const f=e.target.files[0];if(!f)return;
      try{const t=await f.text();const p=JSON.parse(t);
        if(!Array.isArray(p))throw 0;
        state.dictRules=p.map(r=>({from:String(r.from??''),to:String(r.to??''),wholeWord:!!r.wholeWord,enabled:r.enabled!==false}));
        saveRules();renderRules();refresh()}catch{alert('JSON inválido')}
      e.target.value=''});
    $('#emdSonPlay',root)?.addEventListener('click',startSonoro);
    $('#emdSonStop',root)?.addEventListener('click',stopSonoro);
    $('#emdSonBpm',root)?.addEventListener('input',e=>{if(sonoroStarted&&toneOk())Tone.Transport.bpm.rampTo(parseInt(e.target.value,10)||130,.2)});
    $('#emdSonRev',root)?.addEventListener('input',e=>{if(sonoroReverb)sonoroReverb.wet.value=Math.max(0,Math.min(100,parseInt(e.target.value,10)||0))/100});
    ['emdSonTheme','emdSonSynth'].forEach(id=>$('#'+id,root)?.addEventListener('change',()=>{
      if(sonoroPlaying){stopSonoro();setTimeout(startSonoro,80)}}));
    ['emdT1','emdT2'].forEach(id=>$('#'+id,root)?.addEventListener('input',e=>{
      localStorage.setItem(id==='emdT1'?'emd_t1':'emd_t2',e.target.value)}));
  }
  const saveFmt=()=>{try{localStorage.setItem('emd_fmt',JSON.stringify(state.fmt))}catch{}};
  function loadFmt(){try{const s=localStorage.getItem('emd_fmt');if(s)state.fmt={...state.fmt,...JSON.parse(s)}}catch{}}

  // BOOT EMD
  function bootEMD(root){
    emdRoot=root;
    state.dictRules=loadRules();
    if(!state.dictRules.length){state.dictRules=JSON.parse(JSON.stringify(DICT_PRESETS.patoDoMundo));saveRules()}
    state.dictEnabled=localStorage.getItem('emd_dict_enabled')==='1';
    loadFmt();
    const t1=localStorage.getItem('emd_t1'),t2=localStorage.getItem('emd_t2'),ult=localStorage.getItem('emd_ultimo');
    if(t1)$('#emdT1',root).value=t1;
    if(t2)$('#emdT2',root).value=t2;
    if(ult){state.rawMerge=ult;$('#emdResultPanel',root).style.display='block';$('#emdResultEmpty',root).style.display='none'}
    renderRules();
    const tsw=$('[data-emd-action="toggle-dict"]',root);if(tsw)tsw.classList.toggle('on',state.dictEnabled);
    $$('.emd-fmt',root).forEach(b=>b.classList.toggle('on',!!state.fmt[b.dataset.emdFmt]));
    const wi=$('#emdFmtWords',root);if(wi)wi.value=state.fmt.wordsPerParagraph;
    $$('.emd-smode',root).forEach(x=>x.classList.toggle('active',x.dataset.emdSmode===state.sliceMode));
    bindAll(root);
    refresh();
    updateTTSBtn();updateSonoroUI();
    console.log('[EMD] pronto · Fractal 369 + Pato + Sonoro');
  }

  // ABRIR EMD como session window
  window.openEMD=function(){
    // Se já existe, traz pra frente
    const existing=document.getElementById('session-emd') || document.getElementById('session-iframe');
    if(existing){
      existing.id='session-emd';
      existing.classList.remove('minimized','collapsed');
      existing.classList.add('peeked');
      if(!existing.querySelector('#emdSlot')){
        const slot=existing.querySelector('#initialEmdSlot');
        if(slot){
          slot.id='emdSlot';
          slot.appendChild(document.getElementById('tpl-emd').content.cloneNode(true));
          bootEMD(slot);
        }
      }
      window.maximizeWindow?.('session-emd');
      return existing;
    }
    const win=window.createSessionWindow({title:'Espaço da Mente'});
    if(!win)return null;
    win.id='session-emd';
    // Substitui frame por conteúdo do template
    win.querySelector('.win-frame')?.remove();
    const content=document.createElement('div');
    content.className='win-content';
    content.id='emdSlot';
    content.appendChild(document.getElementById('tpl-emd').content.cloneNode(true));
    win.appendChild(content);
    bootEMD(content);
    // Abre automaticamente maximizado
    setTimeout(()=>window.maximizeWindow?.('session-emd'),80);
    return win;
  };
  window.EMD={open:window.openEMD,get state(){return state}};
  /* FSW inicial: já nasce como Espaço da Mente, sem iframe/URL. */
  setTimeout(()=>{
    try{
      const win=document.getElementById('session-iframe');
      const slot=document.getElementById('initialEmdSlot');
      if(win && slot && !win.querySelector('#emdSlot')){
        win.id='session-emd';
        slot.id='emdSlot';
        slot.appendChild(document.getElementById('tpl-emd').content.cloneNode(true));
        bootEMD(slot);
        win.querySelector('.win-title')?.replaceChildren(document.createTextNode('ESPAÇO DA MENTE · FSW'));
      }
    }catch(err){ console.warn('[EMD] boot inicial:',err); }
  },120);

  console.log('[Almasliber ⊕ EMD] carregado · use 🧠 ou clique em "Espaço da Mente"');
})();