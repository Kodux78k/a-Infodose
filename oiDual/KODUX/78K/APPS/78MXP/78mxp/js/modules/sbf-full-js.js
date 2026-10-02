(function KOBSymbolBarFull(){
'use strict';
if(window.__KOB_SBF__)return;window.__KOB_SBF__=true;
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>Array.from(r.querySelectorAll(s));
const LS={get(k,d=null){try{const v=localStorage.getItem(k);return v==null?d:v}catch{return d}},
  set(k,v){try{localStorage.setItem(k,v)}catch{}},
  json(k,d){try{const v=localStorage.getItem(k);return v?JSON.parse(v):d}catch{return d}}};
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
const bar=$('#symbolBar');if(!bar)return;
const hudEl=$('#sbHud');
function say(msg){
  if(hudEl)hudEl.textContent=msg;
  const t=$('#toast');if(t){t.textContent=msg;t.classList.add('on');clearTimeout(say._t);say._t=setTimeout(()=>t.classList.remove('on'),1800)}
}

/* ───────────── ARQUÉTIPOS · orb + carrossel ───────────── */
const Arch={
  keys(){return $$('.arch-chip').map(c=>c.dataset.k)},
  cur(){return (window.Nebula&&window.Nebula.arch)||'KOBLLUX'},
  set(k){if(window.Nebula&&window.Nebula.applyArch)window.Nebula.applyArch(k);this.paint()},
  next(d){const ks=this.keys();if(!ks.length)return;const i=ks.indexOf(this.cur());this.set(ks[(i+(d||1)+ks.length)%ks.length]);say('◍ '+this.cur())},
  build(){
    const tr=$('#sbTrack');if(!tr)return;
    tr.innerHTML=$$('.arch-chip').map(c=>{
      const k=c.dataset.k,c1=c.style.getPropertyValue('--chip-c1')||'#22d3ee',c2=c.style.getPropertyValue('--chip-c2')||'#0e7c9e';
      return '<button type="button" class="sbf-arch" data-k="'+esc(k)+'" style="--c1:'+c1+';--c2:'+c2+'"><i></i>'+esc(k)+'</button>'}).join('');
    tr.addEventListener('click',e=>{const b=e.target.closest('.sbf-arch');if(!b)return;this.set(b.dataset.k);say('◍ '+b.dataset.k)});
    tr.addEventListener('scroll',()=>this.dots(),{passive:true});
  },
  dots(){
    const tr=$('#sbTrack'),d=$('#sbDots');if(!tr||!d)return;
    const n=Math.max(1,Math.ceil(tr.scrollWidth/Math.max(1,tr.clientWidth)));
    const at=Math.min(n-1,Math.round(tr.scrollLeft/Math.max(1,tr.clientWidth)));
    if(d.children.length!==n)d.innerHTML=new Array(n+1).join('<b></b>');
    Array.from(d.children).forEach((b,i)=>b.classList.toggle('on',i===at));
  },
  paint(){
    const k=this.cur(),ks=this.keys(),i=Math.max(0,ks.indexOf(k));
    $('#sbStatus').textContent='0x'+i.toString(16).toUpperCase().padStart(2,'0')+' · '+k;
    const v=window.KOBLLUX_VOICE&&window.KOBLLUX_VOICE.map&&window.KOBLLUX_VOICE.map[k];
    $('#sbSub').textContent=v?(v.nome+' · '+v.lang):'—';
    $$('.sbf-arch',bar).forEach(c=>{const on=c.dataset.k===k;c.classList.toggle('on',on);if(on&&bar.classList.contains('show-carousel')&&!this._noScroll)c.scrollIntoView({inline:'center',block:'nearest'})});
    this.dots();
  },
  init(){
    this.build();this.paint();
    new MutationObserver(()=>this.paint()).observe(document.body,{attributes:true,attributeFilter:['data-arch']});
  }
};

/* ───────────── VOZ · play / pausa / blocos ───────────── */
const norm=x=>String(x||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
let lastSel='';
document.addEventListener('selectionchange',()=>{const s=String(getSelection&&getSelection()||'').trim();if(s.length>1)lastSel=s});
function splitBlocks(text){
  const raw=(text.match(/[^.!?…\n]+[.!?…]*\s*/g)||[text]).map(s=>s.trim()).filter(Boolean),out=[];let buf='';
  for(const s of raw){if(buf&&(buf+' '+s).length>200){out.push(buf);buf=s}else buf=buf?buf+' '+s:s}
  if(buf)out.push(buf);
  return out.flatMap(b=>b.length>260?(b.match(/.{1,240}(\s|$)/g)||[b]).map(x=>x.trim()).filter(Boolean):[b]);
}
const TTS={
  blocks:[],i:0,playing:false,paused:false,token:0,src:'',
  text(){
    if(lastSel)return lastSel;
    const N=window.Nebula,d=N&&(N.currentDoc||(N.docs&&N.docs[0]));
    if(d&&d.content)return String(d.content).replace(/[#*_`>~]/g,'').trim();
    const r=$('#reader');return r?String(r.innerText||'').trim():'';
  },
  load(){
    if(!('speechSynthesis' in window)){say('TTS indisponível neste navegador');return false}
    const t=this.text();if(!t){say('Nada para ouvir · selecione um texto ou abra um documento');return false}
    if(t!==this.src){this.src=t;this.blocks=splitBlocks(t);this.i=0}
    return this.blocks.length>0;
  },
  pick(cfg){
    const L=speechSynthesis.getVoices(),n=norm(cfg.nome),l=norm(cfg.lang).split('-')[0];
    return L.find(v=>norm(v.name).includes(n)&&norm(v.lang).startsWith(l))||L.find(v=>norm(v.lang).startsWith(l))||L.find(v=>norm(v.lang).startsWith('pt'));
  },
  speakAt(i){
    if(i<0||i>=this.blocks.length){this.stop(true);say('■ fim');return}
    this.i=i;const tok=++this.token;speechSynthesis.cancel();
    const map=(window.KOBLLUX_VOICE&&window.KOBLLUX_VOICE.map)||{};
    const cfg=map[Arch.cur()]||map.KOBLLUX||{nome:'Luciana',lang:'pt-BR',rate:1,pitch:1};
    const u=new SpeechSynthesisUtterance(this.blocks[i]);
    u.pitch=cfg.pitch;u.rate=cfg.rate;u.lang=cfg.lang;
    const v=this.pick(cfg);if(v){u.voice=v;u.lang=v.lang||cfg.lang}
    u.onend=()=>{if(tok===this.token&&this.playing&&!this.paused)this.speakAt(i+1)};
    u.onerror=()=>{};
    speechSynthesis.speak(u);this.sync();
  },
  toggle(){
    if(!('speechSynthesis' in window)){say('TTS indisponível');return}
    if(this.playing&&!this.paused){speechSynthesis.pause();this.paused=true;this.sync();return}
    if(this.playing&&this.paused){speechSynthesis.resume();this.paused=false;this.sync();return}
    if(!this.load())return;
    this.playing=true;this.paused=false;this.speakAt(this.i);
  },
  step(d){
    if(!this.load())return;
    this.playing=true;this.paused=false;
    this.speakAt(Math.max(0,Math.min(this.blocks.length-1,this.i+d)));
  },
  prev(){this.step(-1)},next(){this.step(1)},
  stop(reset){
    this.token++;
    if('speechSynthesis' in window)speechSynthesis.cancel();
    this.playing=false;this.paused=false;if(reset!==false)this.i=0;this.sync();
  },
  clear(){this.stop(true);this.blocks=[];this.src='';lastSel='';try{getSelection().removeAllRanges()}catch{}say('× limpo')},
  sync(){
    const live=this.playing&&!this.paused,p=$('#sbPlay');
    if(p){p.textContent=live?'❚❚':'▶';p.classList.toggle('on',this.playing)}
    bar.classList.toggle('is-speaking',live);
    if(this.playing&&hudEl)hudEl.textContent=(live?'▶ ':'❚❚ ')+(this.i+1)+'/'+this.blocks.length;
  },
  async copy(){
    const t=this.text();if(!t){say('Nada para copiar');return}
    try{await navigator.clipboard.writeText(t)}catch{
      const ta=document.createElement('textarea');ta.value=t;document.body.appendChild(ta);ta.select();try{document.execCommand('copy')}catch{}ta.remove()}
    say('⧉ copiado · '+t.length+' car.');
  },
  download(){
    const t=this.text();if(!t){say('Nada para baixar');return}
    const a=document.createElement('a');
    a.href=URL.createObjectURL(new Blob([t],{type:'text/plain;charset=utf-8'}));
    a.download='kobllux-'+Arch.cur().toLowerCase()+'-'+new Date().toISOString().slice(0,16).replace(/[-:T]/g,'')+'.txt';
    document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},800);say('↓ baixado');
  }
};

/* ───────────── VIEWPORT + PLAYER ───────────── */
const Viewport={
  toggle(){document.body.classList.toggle('sbx-hide-stack');this.sync();say(document.body.classList.contains('sbx-hide-stack')?'⊞ sessões ocultas':'⊟ sessões visíveis')},
  sync(){const b=$('#sbViewport');if(!b)return;const hid=document.body.classList.contains('sbx-hide-stack');
    b.textContent=hid?'⊞':'⊟';b.setAttribute('aria-pressed',String(hid));b.classList.toggle('on',hid)}
};
function safeUrl(raw){
  let u=String(raw||'').trim();if(!u)return '';
  if(/^[a-z][a-z0-9+.\-]*:/i.test(u))return /^https?:/i.test(u)?u:'';
  if(u.startsWith('//'))return 'https:'+u;
  if(/^(\.{0,2}\/|#)/.test(u))return u;
  if(/^[\w\-]+(\.[\w\-]+)+(?=[\/?#:]|$)/.test(u)&&!/\.(html?|php|js|json|css)(\?|#|$)/i.test(u))return 'https://'+u;
  return u;
}
function openUrl(u,label){
  if(window.createSessionWindow){window.createSessionWindow({title:label||'Navegação',src:u});return}
  window.open(u,'_blank','noopener');
}
const Player={
  embed(url){const m=String(url||'').match(/(?:youtu\.be\/|[?&]v=|embed\/)([\w-]{11})/);return m?'https://www.youtube.com/embed/'+m[1]:safeUrl(url)},
  open(){const b=$('#sbPlayer'),url=this.embed(b&&b.dataset.playerUrl);if(!url){say('URL do player inválida');return}
    openUrl(url,(b&&b.dataset.playerTitle)||'Player')}
};

/* ───────────── ATALHOS (symbols) ───────────── */
const Shortcuts={
  KEY:'sbx_symbols_v1',
  defaults:[
    {id:'void',url:'https://www.infodose.com.br/splash.html',label:'Void',icon:'Φ',visible:true},
    {id:'Home',url:'https://kodux78k.github.io/oiDual--Y-/M0D/iFS/',label:'Home',icon:'Φ',visible:true},
    {id:'78Frames',url:'https://www.infodose.com.br/oiDual/KODUX/78K/APPS/78F.html',label:'78Frames',icon:'꩜',visible:true},
    {id:'Feeling',url:'https://www.infodose.com.br/oiDual/KODUX/78K/APPS/78EM.html',label:'Feeling',icon:'◌',visible:true},
    {id:'Nebualayer',url:'https://www.infodose.com.br/oiDual/KODUX/78K/APPS/78NP.html',label:'Nebualayer',icon:'◘',visible:true}
  ],
  items:[],lastUrl:'',
  slug(s){return String(s||'').toLowerCase().replace(/[^\w]+/g,'-').replace(/^-+|-+$/g,'')||'sym'},
  load(){
    const st=LS.json(this.KEY,null);
    this.items=(st&&Array.isArray(st.items))
      ?st.items.filter(i=>i&&i.id&&i.url&&i.label).map(i=>({id:String(i.id),url:i.url,label:String(i.label),icon:i.icon||'🔗',visible:i.visible!==false}))
      :this.defaults.map(d=>({...d}));
  },
  save(){LS.set(this.KEY,JSON.stringify({v:1,items:this.items}))},
  render(){
    const host=$('#sbShortcuts');if(!host)return;
    host.innerHTML=this.items.filter(i=>i.visible).map(i=>
      '<button type="button" class="sbf-sym" data-id="'+esc(i.id)+'" title="'+esc(i.label)+'">'+esc(i.icon||'🔗')+'</button>').join('')+
      '<button type="button" class="sbf-sym util" id="quickAddBtn" title="Adicionar atalho (usa a URL atual)">＋</button>'+
      '<button type="button" class="sbf-sym util" id="sbxEditBtn" title="Editar atalhos">✎</button>';
    this.renderModal();
  },
  open(id){
    const it=this.items.find(x=>x.id===id);if(!it)return;
    const u=safeUrl(it.url);if(!u){say('URL inválida');return}
    this.lastUrl=u;LS.set('kob_last_url',u);openUrl(u,it.label);
  },
  openEdit(){const m=$('#symbol-edit-modal');if(m){m.classList.add('active');this.renderModal()}},
  closeEdit(){const m=$('#symbol-edit-modal');if(m)m.classList.remove('active')},
  isOpen(){const m=$('#symbol-edit-modal');return !!(m&&m.classList.contains('active'))},
  renderModal(){
    const list=$('#symbol-edit-list');if(!list)return;
    if(!this.items.length){list.innerHTML='<div class="sbx-mempty">Nenhum atalho. Adicione abaixo.</div>';return}
    list.innerHTML=this.items.map((it,i)=>
      '<div class="symbol-item" data-i="'+i+'"><div class="label">'+esc(it.icon||'🔗')+' '+esc(it.label)+'<small>'+esc(it.url)+'</small></div>'+
      '<div class="actions"><button type="button" class="toggle-vis'+(it.visible?' active':'')+'" data-a="vis" title="Visível/oculto"></button>'+
      '<button type="button" data-a="del" title="Remover">✕</button></div></div>').join('');
  },
  add(url,label,icon){
    const u=safeUrl(url),l=String(label||'').trim();
    if(!u||!l){say('Preencha uma URL válida e um rótulo');return false}
    const ic=String(icon||'').trim()||Array.from(l)[0].toUpperCase();
    this.items.push({id:this.slug(l)+'-'+Date.now().toString(36),url:u,label:l,icon:ic,visible:true});
    this.save();this.render();return true;
  },
  quickAdd(){
    const nav=($('#urlInputNav')||{}).value||'',cand=safeUrl(this.lastUrl||nav.trim());
    this.openEdit();
    const u=$('#newSymbolUrl'),l=$('#newSymbolLabel'),i=$('#newSymbolIcon');
    if(u)u.value=cand||'';if(i)i.value='';
    if(l){let host='';try{host=cand?new URL(cand,location.href).hostname.replace(/^www\./,'').split('.')[0]:''}catch{}
      l.value=host?host.charAt(0).toUpperCase()+host.slice(1):'';setTimeout(()=>{try{(cand?l:u).focus()}catch{}},50)}
    if(!cand)say('Sem URL ativa · preencha abaixo');
  },
  init(){
    this.load();this.render();
    bar.addEventListener('click',e=>{
      const b=e.target.closest('.sbf-sym');if(!b)return;
      if(b.id==='quickAddBtn')this.quickAdd();else if(b.id==='sbxEditBtn')this.openEdit();else if(b.dataset.id)this.open(b.dataset.id);
    });
    const m=$('#symbol-edit-modal');
    m.addEventListener('click',e=>{
      if(e.target===m){this.closeEdit();return}
      const row=e.target.closest('.symbol-item'),a=e.target.closest('[data-a]');
      if(row&&a){const i=+row.dataset.i;
        if(a.dataset.a==='vis')this.items[i].visible=!this.items[i].visible;else this.items.splice(i,1);
        this.save();this.render()}
    });
    const on=(id,fn)=>{const el=document.getElementById(id);if(el)el.addEventListener('click',fn)};
    on('closeSymbolModal',()=>this.closeEdit());on('closeSymbolModalBtn',()=>this.closeEdit());
    const add=()=>{const u=$('#newSymbolUrl'),l=$('#newSymbolLabel'),i=$('#newSymbolIcon');
      if(this.add(u.value,l.value,i.value)){u.value='';l.value='';i.value='';say('＋ atalho adicionado')}};
    on('addSymbolBtn',add);
    ['newSymbolUrl','newSymbolLabel','newSymbolIcon'].forEach(id=>{const el=document.getElementById(id);if(el)el.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();add()}})});
    on('resetSymbolsBtn',()=>{if(confirm('Restaurar a lista padrão de atalhos?')){this.items=this.defaults.map(d=>({...d}));this.save();this.render()}});
  }
};

/* ───────────── MXP · FACTORY / SLOTS / DRAG ───────────── */
const MX_KEY='kobllux_mxp_v2',SLOTS=['header','aside','footer','loose'];
const SLOT_LABEL={header:'HEADER',aside:'ASIDE · barra',footer:'FOOTER',loose:'SOLTO'};
const run=fn=>()=>{try{fn()}catch(err){console.warn('[MXP]',err)}};
const CAT=[
  {cat:'Sistema',items:[
    {id:'theme',icon:'◐',label:'TEMA',run:run(()=>window.DualTheme&&window.DualTheme.toggle())},
    {id:'cockpit',icon:'⌘',label:'COCKPIT',run:run(()=>window.KOBCockpit&&window.KOBCockpit.open())},
    {id:'factory',icon:'◈',label:'FACTORY',run:run(()=>MXP.openFactory())},
    {id:'reset',icon:'↺',label:'RESET MXP',run:run(()=>{if(confirm('Limpar todos os botões dos slots?')){state=blank();save();renderAll();say('↺ layout MXP limpo')}})}]},
  {cat:'Mente',items:[
    {id:'mente',icon:'M',label:'MENTE',run:run(()=>window.openEMD&&window.openEMD())},
    {id:'import',icon:'⇪',label:'IMPORTAR',run:run(()=>{const f=$('#fileInput');if(f)f.click()})},
    {id:'samples',icon:'✦',label:'EXEMPLOS',run:run(()=>{const b=$('#btnSample');if(b)b.click()})},
    {id:'pills',icon:'⚗',label:'PÍLULAS',run:run(()=>{const b=$('#btnPills');if(b)b.click()})}]},
  {cat:'Sessões',items:[
    {id:'nova',icon:'+',label:'NOVA',run:run(()=>window.createSessionWindow&&window.createSessionWindow({title:'Sessão MXP'}))},
    {id:'splash',icon:'◎',label:'SPLASH',run:run(()=>openUrl('https://www.infodose.com.br/splash','Splash'))},
    {id:'viewport',icon:'⊟',label:'VIEWPORT',run:run(()=>Viewport.toggle())},
    {id:'player',icon:'▣',label:'PLAYER',run:run(()=>Player.open())}]},
  {cat:'Voz',items:[
    {id:'play',icon:'▶',label:'PLAY',run:run(()=>TTS.toggle())},
    {id:'stop',icon:'■',label:'STOP',run:run(()=>TTS.stop(true))},
    {id:'prev',icon:'◀',label:'ANTES',run:run(()=>TTS.prev())},
    {id:'next',icon:'▷',label:'PRÓX',run:run(()=>TTS.next())},
    {id:'arch',icon:'◍',label:'ARQ +',run:run(()=>Arch.next(1))},
    {id:'copy',icon:'⧉',label:'COPIAR',run:run(()=>TTS.copy())}]},
  {cat:'Layout',items:[
    {id:'snaptop',icon:'⤒',label:'BARRA ⤒',run:run(()=>window.KOBSnap&&window.KOBSnap.snapTop())},
    {id:'snapfree',icon:'⤓',label:'BARRA ⤓',run:run(()=>window.KOBSnap&&window.KOBSnap.reset())},
    {id:'hud',icon:'▭',label:'CARD·HUD',run:run(()=>window.FusionCard&&window.FusionCard.setMode('hud'))},
    {id:'orb',icon:'●',label:'CARD·ORB',run:run(()=>window.FusionCard&&window.FusionCard.setMode('orb'))},
    {id:'card',icon:'▤',label:'CARD',run:run(()=>window.FusionCard&&window.FusionCard.setMode('card'))}]},
  {cat:'Atalhos',items:[
    {id:'symbols',icon:'✎',label:'ATALHOS',run:run(()=>Shortcuts.openEdit())},
    {id:'symadd',icon:'＋',label:'ADD URL',run:run(()=>Shortcuts.quickAdd())}]}
];
const DEF={};CAT.forEach(g=>g.items.forEach(i=>{DEF[i.id]=i}));
const blank=()=>({v:2,slots:{header:[],aside:[],footer:[],loose:[]}});
let state=LS.json(MX_KEY,null);
if(!state||!state.slots)state=blank();
SLOTS.forEach(s=>{if(!Array.isArray(state.slots[s]))state.slots[s]=[]});
const save=()=>LS.set(MX_KEY,JSON.stringify(state));
const uid=()=>'m'+Math.random().toString(36).slice(2,8)+Date.now().toString(36).slice(-3);
const slotEl=s=>s==='loose'?$('#mxp-loose-layer'):$('[data-slot="'+s+'"][data-drop-target]');

function mkBtn(inst,slot){
  const d=DEF[inst.id];if(!d)return null;
  const b=document.createElement('button');b.type='button';
  b.className='mxp-btn slot-'+slot+(inst.bound?' is-bound':'');
  b.dataset.u=inst.u;b.dataset.mxp=inst.id;
  const lab=inst.label||d.label;
  b.title=lab+(inst.bound?' · ⛓ '+inst.bound:'');
  b.innerHTML='<span class="mxp-icon">'+esc(d.icon)+'</span><span class="mxp-label">'+esc(lab)+'</span>';
  if(slot==='loose'){b.style.left=(inst.x==null?50:inst.x)+'%';b.style.top=(inst.y==null?60:inst.y)+'%'}
  return b;
}
function renderAll(){
  SLOTS.forEach(s=>{
    const host=slotEl(s);if(!host)return;host.textContent='';
    state.slots[s]=state.slots[s].filter(i=>DEF[i.id]);
    state.slots[s].forEach(i=>{const b=mkBtn(i,s);if(b)host.appendChild(b)});
  });
}
function find(u){for(const s of SLOTS){const a=state.slots[s],i=a.findIndex(x=>x.u===u);if(i>=0)return{slot:s,idx:i,inst:a[i]}}return null}
function detach(u){const f=find(u);return f?state.slots[f.slot].splice(f.idx,1)[0]:null}
function put(inst,slot,idx,pos){
  if(slot==='loose'){inst.x=pos.x;inst.y=pos.y}else{delete inst.x;delete inst.y}
  const a=state.slots[slot];
  if(idx==null||idx<0||idx>a.length)a.push(inst);else a.splice(idx,0,inst);
}
const pct=(v,max)=>Math.max(3,Math.min(97,Math.round(v/max*1000)/10));
const here=(x,y)=>({x:pct(x,innerWidth),y:pct(y,innerHeight)});

function fireInst(inst,node){
  if(node){node.classList.add('is-firing');setTimeout(()=>node.classList.remove('is-firing'),260)}
  if(inst.bound){
    const t=$(inst.bound);
    if(t){if(t.tagName==='INPUT')t.focus();else t.click();return}
    say('⛓ alvo não encontrado');return;
  }
  const d=DEF[inst.id];if(d)d.run();
}
const selFor=el=>{const a=el.getAttribute('data-dual-action');if(a)return '[data-dual-action="'+a+'"]';return el.id?'#'+el.id:''};

/* fábrica */
function renderFactory(){
  const c=$('#mxd-catalog');if(!c)return;
  c.innerHTML=CAT.map(g=>'<div class="mxd-cat"><div class="mxd-cat-name">'+g.cat+'</div><div class="mxd-cat-grid">'+
    g.items.map(d=>'<button type="button" class="mxp-btn slot-factory" data-mxp="'+d.id+'"><span class="mxp-icon">'+esc(d.icon)+'</span><span class="mxp-label">'+esc(d.label)+'</span></button>').join('')+
    '</div></div>').join('');
}
function openFactory(){renderFactory();const f=$('#mxd-factory');f.classList.add('is-open');f.setAttribute('aria-hidden','false')}
function closeFactory(){const f=$('#mxd-factory');f.classList.remove('is-open','is-dragging');f.setAttribute('aria-hidden','true')}

/* menu de contexto */
const ctx=$('#mxd-context');
function closeCtx(){ctx.classList.remove('is-open');ctx.innerHTML=''}
function openCtx(inst,node){
  const d=DEF[inst.id],cur=find(inst.u);
  let html='<div class="ctx-head">'+esc(inst.label||d.label)+(cur?' · '+SLOT_LABEL[cur.slot]:'')+'</div>'+
    '<button data-c="fire">▶ Disparar</button>';
  SLOTS.filter(s=>!cur||s!==cur.slot).forEach(s=>{html+='<button data-c="move" data-s="'+s+'">⇄ Mover → '+SLOT_LABEL[s]+'</button>'});
  if(inst.bound)html+='<button data-c="unbind">⛓ Desvincular</button>';
  html+='<button data-c="rename">✎ Renomear</button><button data-c="dup">⧉ Duplicar</button><button class="ctx-danger" data-c="del">× Remover</button>';
  ctx.innerHTML=html;ctx.classList.add('is-open');
  const r=node.getBoundingClientRect(),w=ctx.offsetWidth,hh=ctx.offsetHeight;
  ctx.style.left=Math.max(8,Math.min(r.left,innerWidth-w-8))+'px';
  ctx.style.top=(r.bottom+6+hh>innerHeight?Math.max(8,r.top-hh-6):r.bottom+6)+'px';
  ctx.dataset.u=inst.u;
}
ctx.addEventListener('click',e=>{
  const b=e.target.closest('button[data-c]');if(!b)return;
  const u=ctx.dataset.u,f=find(u);closeCtx();if(!f)return;
  const c=b.dataset.c;
  if(c==='fire')fireInst(f.inst);
  else if(c==='move'){const i=detach(u);put(i,b.dataset.s,null,{x:50,y:60});say('⇄ '+SLOT_LABEL[b.dataset.s])}
  else if(c==='unbind'){delete f.inst.bound;say('⛓ desvinculado')}
  else if(c==='rename'){const v=prompt('Rótulo do botão',f.inst.label||DEF[f.inst.id].label);if(v!=null&&v.trim())f.inst.label=v.trim().slice(0,14)}
  else if(c==='dup'){const n={...f.inst,u:uid()};if(f.slot==='loose'){n.x=Math.min(97,(n.x||50)+6);n.y=Math.min(97,(n.y||60)+6)}state.slots[f.slot].splice(f.idx+1,0,n)}
  else if(c==='del'){detach(u);say('× removido')}
  save();renderAll();
});
document.addEventListener('pointerdown',e=>{if(ctx.classList.contains('is-open')&&!e.target.closest('#mxd-context'))closeCtx()},true);

/* arrastar */
const LONG=340,MOVE=8,DBL=260;
const ghost=$('#mxd-ghost'),hud=$('#mxd-hud'),trash=$('#mxd-trash'),factory=$('#mxd-factory');
let P=null,lastTap={};
const hudSet=t=>{hud.textContent=t;hud.classList.add('is-live')};
const blockScroll=e=>{if(P&&P.drag)e.preventDefault()};
function clearMarks(){
  $$('.is-drop-ready').forEach(n=>n.classList.remove('is-drop-ready'));
  $$('.is-dual-hover').forEach(n=>n.classList.remove('is-dual-hover'));
  trash.classList.remove('is-over');
}
function probe(x,y){
  const els=document.elementsFromPoint(x,y).filter(el=>!el.closest('#mxd-ghost'));
  if(els.some(el=>el.id==='mxd-trash'))return{k:'trash'};
  const slot=els.map(el=>el.closest&&el.closest('[data-drop-target]')).find(Boolean);
  if(slot)return{k:'slot',el:slot,slot:slot.dataset.slot};
  const dual=els.map(el=>el.closest&&el.closest('[data-dual-target]')).find(el=>el&&!el.closest('#mxd-factory,#symbolBar,.mxp-btn'));
  if(dual)return{k:'dual',el:dual};
  if(els.some(el=>el.closest&&el.closest('#symbolBar,#mxd-context,#symbol-edit-modal')))return{k:'none'};
  return{k:'loose'};
}
function startDrag(){
  if(!P||P.drag)return;
  P.drag=true;clearTimeout(P.timer);
  P.b.classList.remove('is-holding');
  if(!P.factory)P.b.classList.add('is-source');
  ghost.innerHTML='<span>'+esc((DEF[P.mxp]||{}).icon||'◆')+'</span>';
  ghost.style.left=P.cx+'px';ghost.style.top=P.cy+'px';ghost.classList.add('is-live');
  document.body.classList.add('mxp-dragging');
  trash.classList.add('is-active');
  if(P.factory)factory.classList.add('is-dragging');
  closeCtx();
  if(navigator.vibrate)navigator.vibrate(25);
  document.addEventListener('touchmove',blockScroll,{passive:false});
  hudSet('arraste para um slot · lixeira remove');
  update(P.cx,P.cy);
}
function update(x,y){
  clearMarks();const t=probe(x,y);P.t=t;
  ghost.classList.toggle('is-dim',t.k==='none');
  if(t.k==='trash'){trash.classList.add('is-over');hudSet('× remover')}
  else if(t.k==='slot'){t.el.classList.add('is-drop-ready');hudSet('→ '+SLOT_LABEL[t.slot])}
  else if(t.k==='dual'){t.el.classList.add('is-dual-hover');hudSet('⛓ vincular · '+(t.el.getAttribute('data-dual-action')||t.el.id||'alvo'))}
  else if(t.k==='loose')hudSet('◌ solto aqui');
  else hudSet('solte num slot da barra');
}
function slotIndex(el,x,y,skip){
  const kids=$$('.mxp-btn',el).filter(k=>k.dataset.u!==skip);
  const i=kids.findIndex(k=>{const r=k.getBoundingClientRect();return y<r.top||(y<=r.bottom&&x<r.left+r.width/2)});
  return i<0?kids.length:i;
}
function finish(x,y){
  const t=P.t||probe(x,y),pos=here(x,y);
  if(t.k==='none'||t.k==='trash'&&P.factory){say(t.k==='none'?'cancelado':'—');return}
  if(P.factory){
    const inst={u:uid(),id:P.mxp};
    if(t.k==='slot')put(inst,t.slot,t.slot==='loose'?null:slotIndex(t.el,x,y,null),pos);
    else if(t.k==='dual'){const sel=selFor(t.el);if(sel)inst.bound=sel;put(inst,'loose',null,pos)}
    else put(inst,'loose',null,pos);
    say('＋ '+DEF[P.mxp].label+' → '+SLOT_LABEL[find(inst.u).slot]);
    return;
  }
  const f=find(P.u);if(!f)return;
  if(t.k==='trash'){detach(P.u);say('× removido');return}
  if(t.k==='dual'){const sel=selFor(t.el);if(sel){f.inst.bound=sel;say('⛓ vinculado · '+sel)}else say('alvo sem id');return}
  const inst=detach(P.u);
  if(t.k==='slot')put(inst,t.slot,t.slot==='loose'?null:slotIndex(t.el,x,y,P.u),pos);
  else put(inst,'loose',null,pos);
  say('⇄ '+SLOT_LABEL[find(inst.u).slot]);
}
function endAll(){
  clearTimeout(P&&P.timer);
  document.removeEventListener('touchmove',blockScroll);
  document.body.classList.remove('mxp-dragging');
  ghost.classList.remove('is-live','is-dim');trash.classList.remove('is-active');
  clearMarks();factory.classList.remove('is-dragging');
  setTimeout(()=>hud.classList.remove('is-live'),700);
}
document.addEventListener('pointerdown',e=>{
  const b=e.target.closest&&e.target.closest('.mxp-btn');if(!b||(e.button&&e.button>0))return;
  P={id:e.pointerId,b,x:e.clientX,y:e.clientY,cx:e.clientX,cy:e.clientY,factory:!!b.closest('#mxd-catalog'),mxp:b.dataset.mxp,u:b.dataset.u,drag:false,t:null};
  b.classList.add('is-holding');
  P.timer=setTimeout(startDrag,LONG);
  try{b.setPointerCapture(e.pointerId)}catch{}
});
window.addEventListener('pointermove',e=>{
  if(!P||e.pointerId!==P.id)return;
  P.cx=e.clientX;P.cy=e.clientY;
  if(!P.drag){
    if(Math.hypot(e.clientX-P.x,e.clientY-P.y)>MOVE){
      if(P.factory){clearTimeout(P.timer);P.b.classList.remove('is-holding')}   // arrasto rápido na fábrica = rolagem
      else startDrag();
    }
    return;
  }
  e.preventDefault();
  ghost.style.left=e.clientX+'px';ghost.style.top=e.clientY+'px';
  update(e.clientX,e.clientY);
},{passive:false});
function up(e){
  if(!P||e.pointerId!==P.id)return;
  const p=P;P=null;
  p.b.classList.remove('is-holding','is-source');
  try{p.b.releasePointerCapture(p.id)}catch{}
  if(p.drag){P=p;try{finish(e.clientX,e.clientY)}finally{endAll();P=null}save();renderAll();return}
  clearTimeout(p.timer);
  if(Math.hypot(e.clientX-p.x,e.clientY-p.y)>MOVE)return;
  if(p.factory){const d=DEF[p.mxp];if(d){p.b.classList.add('is-firing');setTimeout(()=>p.b.classList.remove('is-firing'),260);d.run()}return}
  const f=find(p.u);if(!f)return;
  const now=Date.now();
  if(lastTap.u===p.u&&now-lastTap.t<DBL){clearTimeout(lastTap.timer);lastTap={};openCtx(f.inst,p.b)}
  else{lastTap={u:p.u,t:now,timer:setTimeout(()=>{lastTap={};const g=find(p.u);if(g)fireInst(g.inst,p.b)},DBL)}}
}
window.addEventListener('pointerup',up);
window.addEventListener('pointercancel',e=>{
  if(!P||e.pointerId!==P.id)return;
  const p=P;P=null;p.b.classList.remove('is-holding','is-source');endAll();
});
document.addEventListener('contextmenu',e=>{if(e.target.closest&&e.target.closest('.mxp-btn'))e.preventDefault()});
$('#mxdClose').addEventListener('click',closeFactory);
factory.addEventListener('click',e=>{if(e.target===factory)closeFactory()});

window.MXP={get state(){return state},CATALOG:CAT,DEF,fire:id=>DEF[id]&&DEF[id].run(),save,openFactory,closeFactory,renderFactory,renderAll,
  place(id,slot,pos){const i={u:uid(),id};put(i,slot,null,pos||{x:50,y:60});save();renderAll();return i.u},
  reset(){state=blank();save();renderAll()}};

/* ───────────── BARRA · ligações ───────────── */
function wireBar(){
  const on=(id,fn)=>{const el=document.getElementById(id);if(el)el.addEventListener('click',fn)};
  on('sbPlay',()=>TTS.toggle());on('sbStop',()=>TTS.stop(true));on('sbPrev',()=>TTS.prev());
  on('sbCopy',()=>TTS.copy());on('sbClear',()=>TTS.clear());on('sbDownload',()=>TTS.download());
  on('sbViewport',()=>Viewport.toggle());on('sbPlayer',()=>Player.open());
  on('sbPilot',()=>window.KOBCockpit&&window.KOBCockpit.open());

  /* orb: fechada = abre (handler antigo) · aberta = próximo arquétipo · segurar = roda */
  const orb=$('#sbOrb');let lp=null,lpFired=false;
  orb.addEventListener('pointerdown',()=>{
    if(bar.classList.contains('collapsed'))return;
    lpFired=false;lp=setTimeout(()=>{lpFired=true;bar.classList.toggle('show-carousel');Arch._noScroll=false;Arch.paint();
      say(bar.classList.contains('show-carousel')?'◍ roda de arquétipos':'◍ roda oculta');if(navigator.vibrate)navigator.vibrate(18)},520);
  });
  ['pointerup','pointerleave','pointercancel'].forEach(t=>orb.addEventListener(t,()=>clearTimeout(lp)));
  bar.addEventListener('click',e=>{
    if(!e.target.closest('#sbOrb')||bar.classList.contains('collapsed'))return;
    e.stopImmediatePropagation();e.preventDefault();
    if(lpFired){lpFired=false;return}
    Arch.next(1);
  },true);

  /* EXTRAS: toque = recolhe o slot · segurar = FACTORY */
  const head=$('#sbExtrasHead');let hl=null,hf=false;
  head.addEventListener('pointerdown',()=>{hf=false;hl=setTimeout(()=>{hf=true;openFactory();if(navigator.vibrate)navigator.vibrate(30)},520)});
  ['pointerup','pointerleave','pointercancel'].forEach(t=>head.addEventListener(t,()=>clearTimeout(hl)));
  head.addEventListener('click',()=>{if(hf){hf=false;return}bar.classList.toggle('extras-closed');LS.set('sbf_extras_closed',bar.classList.contains('extras-closed')?'1':'0')});
  if(LS.get('sbf_extras_closed')==='1')bar.classList.add('extras-closed');
  head.addEventListener('contextmenu',e=>e.preventDefault());

  /* piloto + hud */
  const pilot=()=>{const n=LS.get('di_userName')||'';$('#sbPilot').textContent=n&&n!=='Convidado'?n:'PILOTO'};
  pilot();
  document.addEventListener('input',e=>{if(e.target&&(e.target.id==='inputUser'||e.target.id==='inputUserId'))setTimeout(pilot,30)});
  window.addEventListener('storage',e=>{if(e.key==='di_userName')pilot()});
  new MutationObserver(()=>{pilot();Arch.dots()}).observe(bar,{attributes:true,attributeFilter:['class','aria-expanded']});
  Viewport.sync();
}

document.addEventListener('keydown',e=>{
  if(e.key!=='Escape')return;
  if(ctx.classList.contains('is-open'))closeCtx();
  else if(Shortcuts.isOpen())Shortcuts.closeEdit();
  else if(factory.classList.contains('is-open'))closeFactory();
});

/* boot */
renderFactory();renderAll();Arch.init();Shortcuts.init();wireBar();TTS.sync();
if('speechSynthesis' in window){try{speechSynthesis.getVoices()}catch{}}
window.KOBSymbolBar={Arch,TTS,Viewport,Player,Shortcuts,MXP:window.MXP,version:'sbf-full-1'};
})();