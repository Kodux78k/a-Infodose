(function DualThemeController(){
  "use strict";
  const ROOT=document.documentElement;
  const HEADER=document.getElementById("main-header");
  const MAIN=document.getElementById("main-content");
  const STORAGE_KEY="almasliber-theme";
  const VALID=["dark","light"];

  function readStored(){try{const s=localStorage.getItem(STORAGE_KEY);if(VALID.includes(s))return s}catch{}return null}
  function prefersLight(){try{return window.matchMedia&&window.matchMedia('(prefers-color-scheme: light)').matches}catch{return false}}

  function applyTheme(next){
    next=VALID.includes(next)?next:"dark";
    ROOT.dataset.theme=next;
    try{localStorage.setItem(STORAGE_KEY,next)}catch{}
    // atualiza theme-color meta (browser UI)
    const meta=document.querySelector('meta[name="theme-color"]');
    if(meta)meta.setAttribute('content',next==="light"?"#f5f5f7":"#05060a");
    // dispara evento
    window.dispatchEvent(new CustomEvent("dual:theme-change",{detail:{theme:next}}));
    // atualiza título dos botões (acessibilidade)
    document.querySelectorAll('.theme-dot').forEach(b=>{
      b.setAttribute('aria-label',`Alternar para tema ${next==="light"?"escuro":"claro"}`);
      b.title=`Tema: ${next==="light"?"claro":"escuro"} · clique para alternar`;
    });
  }

  function current(){return ROOT.dataset.theme||"dark"}

  window.DualTheme={
    set:applyTheme,
    get:current,
    toggle(){applyTheme(current()==="light"?"dark":"light")}
  };

  // DELEGAÇÃO GLOBAL — funciona mesmo se #theme-dot for clonado depois
  document.addEventListener('click',function(e){
    const dot=e.target.closest('#theme-dot, #theme-dot2, .theme-dot');
    if(!dot)return;
    // ignora se estiver dentro de um container que já tem handler próprio (nenhum aqui)
    e.preventDefault();
    e.stopPropagation();
    window.DualTheme.toggle();
  },true);

  // HEADER: clique colapsa main · scroll esconde/mostra
  if(HEADER&&MAIN){
    HEADER.addEventListener("click",function(e){
      if(e.target.closest(".bota1, .win-navrow, input, button, .top-actions, .theme-dot"))return;
      MAIN.classList.toggle("hidden");
      HEADER.classList.toggle("is-collapsed",MAIN.classList.contains("hidden"));
      window.dispatchEvent(new CustomEvent("dual:content-collapse",{detail:{collapsed:MAIN.classList.contains("hidden")}}));
    });
  }

  let lastY=window.scrollY,ticking=false;
  const TH=8;
  function updateHeader(){
    const y=window.scrollY;
    if(y<=10){HEADER.classList.remove("header-hidden");HEADER.classList.add("header-visible");lastY=y;ticking=false;return}
    if(y>lastY+TH){HEADER.classList.remove("header-visible");HEADER.classList.add("header-hidden")}
    else if(y<lastY-TH){HEADER.classList.remove("header-hidden");HEADER.classList.add("header-visible")}
    lastY=y;ticking=false;
  }
  window.addEventListener("scroll",()=>{if(!ticking){requestAnimationFrame(updateHeader);ticking=true}},{passive:true});

  // INIT: stored > prefers > dark
  const initial=readStored()||(prefersLight()?"light":"dark");
  applyTheme(initial);
  console.log('[Dual Theme] ready ·',initial);
})();