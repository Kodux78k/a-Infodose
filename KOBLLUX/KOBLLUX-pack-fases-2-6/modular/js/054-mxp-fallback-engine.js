/* @kob-mod 054 · mxp-fallback-engine · body */

/* ============================================================
   MXP · MOTOR DE RESERVA (monolito offline)
   O KodBlloX remoto continua dono do MXP quando carrega.
   Se, 2.5s depois do load, nada assumiu (sem iFSw / MXP / catalogo /
   botoes), este motor liga: FACTORY, slots header · aside · footer ·
   solto, arrastar, menu (tap²), vincular em alvo [data-dual-target],
   lixeira. Persistencia: localStorage kobllux_mxp_v2.
============================================================ */
(function MXPFallback(){
'use strict';
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>Array.from(r.querySelectorAll(s));
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
const LS={json(k,d){try{const v=localStorage.getItem(k);return v?JSON.parse(v):d}catch{return d}},set(k,v){try{localStorage.setItem(k,v)}catch{}}};

function remoteOwns(){
  const cat=$('#mxd-catalog');
  return !!(window.iFSw||window.MXP||window.KodBlloX||window.KBLX||(cat&&cat.children.length)||$('.mxp-btn'));
}
function boot(){
  if(window.__MXP_FALLBACK__)return;
  if(remoteOwns()){window.__MXP_REMOTE__=true;return}
  window.__MXP_FALLBACK__=true;

  const say=msg=>{const h=$('#mxd-hud');if(!h)return;h.textContent=msg;h.classList.add('is-live');clearTimeout(say._t);say._t=setTimeout(()=>h.classList.remove('is-live'),1500)};
  const click=sel=>()=>{const e=$(sel);if(e)e.click();else say('controle ausente · '+sel)};
  const KEY='kobllux_mxp_v2',SLOTS=['header','aside','footer','loose'];
  const SLOT_LABEL={header:'HEADER',aside:'ASIDE · barra',footer:'FOOTER',loose:'SOLTO'};
  const run=fn=>()=>{try{fn()}catch(err){console.warn('[MXP]',err)}};
  const CAT=[
    {cat:'Sistema',items:[
      {id:'theme',icon:'◐',label:'TEMA',run:click('#themeToggle')},
      {id:'cockpit',icon:'⌘',label:'COCKPIT',run:click('#orbToggle')},
      {id:'factory',icon:'◈',label:'FACTORY',run:run(()=>openFactory())},
      {id:'notif',icon:'♧',label:'NOTIF',run:click('#notifBtn')},
      {id:'reset',icon:'↺',label:'RESET MXP',run:run(()=>{if(confirm('Limpar todos os botões dos slots?')){state=blank();save();renderAll();say('↺ layout MXP limpo')}})}]},
    {cat:'Mente',items:[
      {id:'mente',icon:'M',label:'MENTE',run:()=>window.KOB_MXP_EXTRAS[0].items[0].run()},
      {id:'import',icon:'⇪',label:'IMPORTAR',run:click('#btnImport')},
      {id:'samples',icon:'✦',label:'EXEMPLOS',run:click('#btnSample')},
      {id:'pills',icon:'⚗',label:'PÍLULAS',run:()=>window.KOB_MXP_EXTRAS[0].items[3].run()}]},
    {cat:'Sessões',items:[
      {id:'nova',icon:'+',label:'NOVA',run:click('[data-dual-action="session:new"]')},
      {id:'viewport',icon:'⊟',label:'VIEWPORT',run:click('#toggleViewportBtn')},
      {id:'player',icon:'▣',label:'PLAYER',run:click('#sbxPlayerBtn')}]},
    {cat:'Voz',items:[
      {id:'play',icon:'▶',label:'PLAY',run:click('#btn-play')},
      {id:'stop',icon:'■',label:'STOP',run:click('#tts-stop')},
      {id:'prev',icon:'◀',label:'ANTES',run:click('#btn-prev')},
      {id:'arch',icon:'◍',label:'ARQUÉTIPO',run:click('#btn-arch')},
      {id:'copy',icon:'⧉',label:'COPIAR',run:click('#sbCopy')},
      {id:'clear',icon:'×',label:'LIMPAR',run:click('#sbClear')},
      {id:'down',icon:'↓',label:'BAIXAR',run:click('#sbDownload')}]},
    {cat:'Layout',items:[
      {id:'snaptop',icon:'⤒',label:'BARRA ⤒',run:run(()=>window.KOBSnap&&window.KOBSnap.snapTop())},
      {id:'snapfree',icon:'⤓',label:'BARRA ⤓',run:run(()=>window.KOBSnap&&window.KOBSnap.reset())},
      {id:'hud',icon:'▭',label:'CARD·HUD',run:run(()=>window.FusionCard&&window.FusionCard.setMode('hud'))},
      {id:'orb',icon:'●',label:'CARD·ORB',run:run(()=>window.FusionCard&&window.FusionCard.setMode('orb'))},
      {id:'card',icon:'▤',label:'CARD',run:run(()=>window.FusionCard&&window.FusionCard.setMode('card'))}]},
    {cat:'Atalhos',items:[
      {id:'symbols',icon:'✎',label:'ATALHOS',run:click('#sbxEditBtn')},
      {id:'symadd',icon:'＋',label:'ADD URL',run:click('#quickAddBtn')}]}
  ];
  const DEF={};CAT.forEach(g=>g.items.forEach(i=>{DEF[i.id]=i}));
  const blank=()=>({v:2,slots:{header:[],aside:[],footer:[],loose:[]}});
  let state=LS.json(KEY,null);if(!state||!state.slots)state=blank();
  SLOTS.forEach(s=>{if(!Array.isArray(state.slots[s]))state.slots[s]=[]});
  const save=()=>LS.set(KEY,JSON.stringify(state));
  const uid=()=>'m'+Math.random().toString(36).slice(2,8)+Date.now().toString(36).slice(-3);
  const slotEl=s=>$('[data-slot="'+s+'"][data-drop-target]');
  /* 1ª execução (sem layout salvo): footer nasce com FACTORY + COCKPIT, como no Mark 2 */
  if(!LS.json(KEY,null)){state.slots.footer=[{u:uid(),id:'factory'},{u:uid(),id:'cockpit'}];save();}

  function mkBtn(inst,slot){
    const d=DEF[inst.id];if(!d)return null;
    const b=document.createElement('button');b.type='button';
    b.className='mxp-btn slot-'+slot+(inst.bound?' is-bound':'');
    b.dataset.u=inst.u;b.dataset.mxp=inst.id;
    const lab=inst.label||d.label;b.title=lab+(inst.bound?' · ⛓ '+inst.bound:'');
    b.innerHTML='<span class="mxp-icon">'+esc(d.icon)+'</span><span class="mxp-label">'+esc(lab)+'</span>';
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
  function put(inst,slot,idx){const a=state.slots[slot];if(idx==null||idx<0||idx>a.length)a.push(inst);else a.splice(idx,0,inst)}
  function fireInst(inst,node){
    if(node){node.classList.add('is-firing');setTimeout(()=>node.classList.remove('is-firing'),260)}
    if(inst.bound){const t=$(inst.bound);if(t){if(t.tagName==='INPUT')t.focus();else t.click();return}say('⛓ alvo não encontrado');return}
    const d=DEF[inst.id];if(d)d.run();
  }
  const selFor=el=>{const a=el.getAttribute('data-dual-action');if(a)return '[data-dual-action="'+a+'"]';return el.id?'#'+el.id:''};

  function renderFactory(){
    const c=$('#mxd-catalog');if(!c)return;
    c.innerHTML=CAT.map(g=>'<div class="mxd-cat"><div class="mxd-cat-name">'+g.cat+'</div><div class="mxd-cat-grid">'+
      g.items.map(d=>'<button type="button" class="mxp-btn slot-factory" data-mxp="'+d.id+'"><span class="mxp-icon">'+esc(d.icon)+'</span><span class="mxp-label">'+esc(d.label)+'</span></button>').join('')+'</div></div>').join('');
  }
  const factory=$('#mxd-factory');
  function openFactory(){renderFactory();factory.classList.add('is-open');factory.setAttribute('aria-hidden','false')}
  function closeFactory(){factory.classList.remove('is-open','mxd-dragging');factory.style.pointerEvents='';factory.style.opacity='';factory.setAttribute('aria-hidden','true')}

  const ctx=$('#mxd-context');
  function closeCtx(){ctx.classList.remove('is-open');ctx.innerHTML=''}
  function openCtx(inst,node){
    const d=DEF[inst.id],cur=find(inst.u);
    let html='<div class="ctx-head">'+esc(inst.label||d.label)+(cur?' · '+SLOT_LABEL[cur.slot]:'')+'</div><button data-c="fire">▶ Disparar</button>';
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
    const u=ctx.dataset.u,f=find(u);closeCtx();if(!f)return;const c=b.dataset.c;
    if(c==='fire')fireInst(f.inst);
    else if(c==='move'){const i=detach(u);put(i,b.dataset.s,null);say('⇄ '+SLOT_LABEL[b.dataset.s])}
    else if(c==='unbind'){delete f.inst.bound;say('⛓ desvinculado')}
    else if(c==='rename'){const v=prompt('Rótulo do botão',f.inst.label||DEF[f.inst.id].label);if(v!=null&&v.trim())f.inst.label=v.trim().slice(0,14)}
    else if(c==='dup'){state.slots[f.slot].splice(f.idx+1,0,{...f.inst,u:uid()})}
    else if(c==='del'){detach(u);say('× removido')}
    save();renderAll();
  });
  document.addEventListener('pointerdown',e=>{if(ctx.classList.contains('is-open')&&!e.target.closest('#mxd-context'))closeCtx()},true);

  const LONG=340,MOVE=8,DBL=260;
  const ghost=$('#mxd-ghost'),hud=$('#mxd-hud'),trash=$('#mxd-trash');
  let P=null,lastTap={};
  const hudSet=t=>{hud.textContent=t;hud.classList.add('is-live')};
  const blockScroll=e=>{if(P&&P.drag)e.preventDefault()};
  function clearMarks(){$$('.is-drop-ready').forEach(n=>n.classList.remove('is-drop-ready'));$$('.is-dual-hover').forEach(n=>n.classList.remove('is-dual-hover'));trash.classList.remove('is-over')}
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
    if(!P||P.drag)return;P.drag=true;clearTimeout(P.timer);
    P.b.classList.remove('is-holding');if(!P.factory)P.b.classList.add('is-source');
    ghost.innerHTML='<span>'+esc((DEF[P.mxp]||{}).icon||'◆')+'</span>';
    ghost.style.left=P.cx+'px';ghost.style.top=P.cy+'px';ghost.classList.add('is-live');
    document.body.classList.add('mxp-dragging');trash.classList.add('is-active');
    if(P.factory){factory.style.pointerEvents='none';factory.style.opacity='.0'}
    closeCtx();if(navigator.vibrate)navigator.vibrate(25);
    document.addEventListener('touchmove',blockScroll,{passive:false});
    hudSet('arraste para um slot · lixeira remove');update(P.cx,P.cy);
  }
  function update(x,y){
    clearMarks();const t=probe(x,y);P.t=t;
    if(t.k==='trash'){trash.classList.add('is-over');hudSet('× remover')}
    else if(t.k==='slot'){t.el.classList.add('is-drop-ready');hudSet('→ '+SLOT_LABEL[t.slot])}
    else if(t.k==='dual'){t.el.classList.add('is-dual-hover');hudSet('⛓ vincular · '+(t.el.getAttribute('data-dual-action')||t.el.id||'alvo'))}
    else if(t.k==='loose')hudSet('◌ solto');else hudSet('solte num slot');
  }
  function slotIndex(el,x,y,skip){
    const kids=$$('.mxp-btn',el).filter(k=>k.dataset.u!==skip);
    const i=kids.findIndex(k=>{const r=k.getBoundingClientRect();return y<r.top||(y<=r.bottom&&x<r.left+r.width/2)});
    return i<0?kids.length:i;
  }
  function finish(x,y){
    const t=P.t||probe(x,y);
    if(t.k==='none'||(t.k==='trash'&&P.factory)){say(t.k==='none'?'cancelado':'—');return}
    if(P.factory){
      const inst={u:uid(),id:P.mxp};
      if(t.k==='slot')put(inst,t.slot,slotIndex(t.el,x,y,null));
      else if(t.k==='dual'){const sel=selFor(t.el);if(sel)inst.bound=sel;put(inst,'loose',null)}
      else put(inst,'loose',null);
      say('＋ '+DEF[P.mxp].label+' → '+SLOT_LABEL[find(inst.u).slot]);return;
    }
    const f=find(P.u);if(!f)return;
    if(t.k==='trash'){detach(P.u);say('× removido');return}
    if(t.k==='dual'){const sel=selFor(t.el);if(sel){f.inst.bound=sel;say('⛓ vinculado · '+sel)}else say('alvo sem id');return}
    const inst=detach(P.u);
    if(t.k==='slot')put(inst,t.slot,slotIndex(t.el,x,y,P.u));else put(inst,'loose',null);
    say('⇄ '+SLOT_LABEL[find(inst.u).slot]);
  }
  function endAll(){
    clearTimeout(P&&P.timer);document.removeEventListener('touchmove',blockScroll);
    document.body.classList.remove('mxp-dragging');ghost.classList.remove('is-live');trash.classList.remove('is-active');
    clearMarks();factory.style.pointerEvents='';factory.style.opacity='';
    setTimeout(()=>hud.classList.remove('is-live'),700);
  }
  document.addEventListener('pointerdown',e=>{
    const b=e.target.closest&&e.target.closest('.mxp-btn');if(!b||(e.button&&e.button>0))return;
    P={id:e.pointerId,b,x:e.clientX,y:e.clientY,cx:e.clientX,cy:e.clientY,factory:!!b.closest('#mxd-catalog'),mxp:b.dataset.mxp,u:b.dataset.u,drag:false,t:null};
    b.classList.add('is-holding');P.timer=setTimeout(startDrag,LONG);
    try{b.setPointerCapture(e.pointerId)}catch{}
  });
  window.addEventListener('pointermove',e=>{
    if(!P||e.pointerId!==P.id)return;P.cx=e.clientX;P.cy=e.clientY;
    if(!P.drag){
      if(Math.hypot(e.clientX-P.x,e.clientY-P.y)>MOVE){
        if(P.factory){clearTimeout(P.timer);P.b.classList.remove('is-holding')}else startDrag();
      }
      return;
    }
    e.preventDefault();ghost.style.left=e.clientX+'px';ghost.style.top=e.clientY+'px';update(e.clientX,e.clientY);
  },{passive:false});
  window.addEventListener('pointerup',e=>{
    if(!P||e.pointerId!==P.id)return;
    const p=P;P=null;p.b.classList.remove('is-holding','is-source');
    try{p.b.releasePointerCapture(p.id)}catch{}
    if(p.drag){P=p;try{finish(e.clientX,e.clientY)}finally{endAll();P=null}save();renderAll();return}
    clearTimeout(p.timer);
    if(Math.hypot(e.clientX-p.x,e.clientY-p.y)>MOVE)return;
    if(p.factory){const d=DEF[p.mxp];if(d){p.b.classList.add('is-firing');setTimeout(()=>p.b.classList.remove('is-firing'),260);d.run()}return}
    const f=find(p.u);if(!f)return;
    const now=Date.now();
    if(lastTap.u===p.u&&now-lastTap.t<DBL){clearTimeout(lastTap.timer);lastTap={};openCtx(f.inst,p.b)}
    else lastTap={u:p.u,t:now,timer:setTimeout(()=>{lastTap={};const g=find(p.u);if(g)fireInst(g.inst,p.b)},DBL)};
  });
  window.addEventListener('pointercancel',e=>{if(!P||e.pointerId!==P.id)return;const p=P;P=null;p.b.classList.remove('is-holding','is-source');endAll()});
  document.addEventListener('contextmenu',e=>{if(e.target.closest&&e.target.closest('.mxp-btn,#sbExtrasHead'))e.preventDefault()});

  /* abrir / fechar */
  document.addEventListener('click',e=>{
    const a=e.target.closest&&e.target.closest('[data-action]');if(!a)return;
    if(a.dataset.action==='factory:close'){closeFactory();return}
    if(a.dataset.action==='factory:open'){e.preventDefault();openFactory()}
  });
  factory.addEventListener('click',e=>{if(e.target===factory)closeFactory()});
  const head=$('#sbExtrasHead');
  if(head){let hl=null;
    head.addEventListener('pointerdown',()=>{hl=setTimeout(()=>{openFactory();if(navigator.vibrate)navigator.vibrate(30)},520)});
    ['pointerup','pointerleave','pointercancel'].forEach(t=>head.addEventListener(t,()=>clearTimeout(hl)));
  }
  document.addEventListener('keydown',e=>{if(e.key==='Escape'){if(ctx.classList.contains('is-open'))closeCtx();else if(factory.classList.contains('is-open'))closeFactory()}});

  window.MXP={get state(){return state},CATALOG:CAT,DEF,fire:id=>DEF[id]&&DEF[id].run(),save,openFactory,closeFactory,renderFactory,renderAll,
    place(id,slot){const i={u:uid(),id};put(i,slot,null);save();renderAll();return i.u},reset(){state=blank();save();renderAll()},fallback:true};
  renderFactory();renderAll();
}
window.addEventListener('load',()=>setTimeout(boot,2500));
})();
