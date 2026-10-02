/* ============================================================
   SNAP NO TOPO · symbolBar (ORB + barra)
   - arraste pelo grip (barra aberta) ou segure/arraste o ORB
   - solta perto do topo (< 64px) = cola no topo, abaixo do HUD
   - duplo toque no grip = volta para o canto original
   - posicao guardada em localStorage (kob.sbf.pos)
   API: window.KOBSnap.{snapTop,reset,state}
============================================================ */
(function KOBSnapTop(){
  const bar=document.getElementById('symbolBar');
  if(!bar)return;
  const grip=document.getElementById('sbfGrip'), orb=document.getElementById('sbOrb');
  const zone=document.getElementById('snap-zone');
  const KEY='kob.sbf.pos', TH=64, LONG=320, MOVE=9;
  let st=null, suppress=false;

  const vw=()=>document.documentElement.clientWidth;
  const vh=()=>window.innerHeight;
  const clampL=l=>Math.max(8,Math.min(l,vw()-bar.offsetWidth-8));
  const clampT=t=>Math.max(0,Math.min(t,vh()-bar.offsetHeight-4));
  const save=o=>{try{localStorage.setItem(KEY,JSON.stringify(o))}catch(e){}};

  function startDrag(){
    if(!st||st.drag)return;
    st.drag=true; clearTimeout(st.timer);
    const r=bar.getBoundingClientRect();
    bar.classList.remove('sbf-snap-top');
    bar.classList.add('sbf-free','sbf-dragging');
    bar.style.left=r.left+'px'; bar.style.top=r.top+'px';
    bar.style.right='auto'; bar.style.bottom='auto';
    try{bar.setPointerCapture(st.id)}catch(e){}
    if(navigator.vibrate)navigator.vibrate(20);
  }
  function begin(e){
    if(e.button>0)return;
    const r=bar.getBoundingClientRect();
    st={id:e.pointerId,x:e.clientX,y:e.clientY,ox:e.clientX-r.left,oy:e.clientY-r.top,drag:false,timer:null};
    if(e.currentTarget===orb&&bar.classList.contains('collapsed'))st.timer=setTimeout(startDrag,LONG);
  }
  function move(e){
    if(!st||e.pointerId!==st.id)return;
    if(!st.drag&&Math.hypot(e.clientX-st.x,e.clientY-st.y)>MOVE)startDrag();
    if(!st.drag)return;
    e.preventDefault();
    const l=clampL(e.clientX-st.ox), t=clampT(e.clientY-st.oy);
    bar.style.left=l+'px'; bar.style.top=t+'px';
    zone&&zone.classList.toggle('active',t<TH);
  }
  function end(e){
    if(!st||(e&&e.pointerId!==st.id))return;
    clearTimeout(st.timer);
    const was=st.drag; st=null;
    if(!was)return;
    try{bar.releasePointerCapture(e.pointerId)}catch(_){}
    zone&&zone.classList.remove('active');
    bar.classList.remove('sbf-dragging');
    suppress=true; setTimeout(()=>{suppress=false},60);
    const t=parseFloat(bar.style.top)||0;
    if(t<TH)snapTop(); else{
      save({mode:'free',lr:(parseFloat(bar.style.left)||0)/vw(),tr:t/vh()});
    }
  }
  function snapTop(){
    void bar.offsetWidth;
    bar.classList.add('sbf-free','sbf-snap-top');
    bar.style.top=''; bar.style.bottom='';
    save({mode:'snap-top',lr:(parseFloat(bar.style.left)||bar.getBoundingClientRect().left)/vw()});
    document.dispatchEvent(new CustomEvent('kob:symbolbar:snap',{detail:{edge:'top'}}));
  }
  function reset(){
    bar.classList.remove('sbf-free','sbf-snap-top','sbf-dragging');
    ['left','top','right','bottom'].forEach(p=>bar.style.removeProperty(p));
    try{localStorage.removeItem(KEY)}catch(e){}
  }
  function restore(){
    let p=null; try{p=JSON.parse(localStorage.getItem(KEY)||'null')}catch(e){}
    if(!p)return;
    bar.classList.add('sbf-free');
    bar.style.right='auto'; bar.style.bottom='auto';
    bar.style.left=clampL((p.lr||0)*vw())+'px';
    if(p.mode==='snap-top'){bar.classList.add('sbf-snap-top');bar.style.top='';}
    else if(p.mode==='free'){bar.style.top=clampT((p.tr||0)*vh())+'px';}
  }

  [grip,orb].forEach(h=>h&&h.addEventListener('pointerdown',begin));
  window.addEventListener('pointermove',move,{passive:false});
  window.addEventListener('pointerup',end);
  window.addEventListener('pointercancel',end);
  // depois de arrastar, o "click" nao pode abrir o menu/cockpit sem querer
  bar.addEventListener('click',e=>{if(suppress){e.stopImmediatePropagation();e.preventDefault();suppress=false}},true);
  grip&&grip.addEventListener('dblclick',reset);

  // barra expande/recolhe ou tela gira: mantem dentro da tela
  const keepIn=()=>{
    if(!bar.classList.contains('sbf-free')||bar.classList.contains('sbf-dragging'))return;
    bar.style.left=clampL(parseFloat(bar.style.left)||bar.getBoundingClientRect().left)+'px';
    if(!bar.classList.contains('sbf-snap-top')&&bar.style.top)bar.style.top=clampT(parseFloat(bar.style.top))+'px';
  };
  window.addEventListener('resize',keepIn);
  if(window.ResizeObserver)new ResizeObserver(keepIn).observe(bar);

  restore();
  window.KOBSnap={snapTop:()=>{if(!bar.classList.contains('sbf-free')){const r=bar.getBoundingClientRect();bar.style.left=clampL(r.left)+'px';bar.style.right='auto';bar.style.bottom='auto';}snapTop()},reset,
    get state(){return bar.classList.contains('sbf-snap-top')?'snap-top':(bar.classList.contains('sbf-free')?'free':'default')}};
})();