(function SessionRuntime(){
  'use strict';
  const stackWrap=document.getElementById('stackWrap');
  const dock=document.getElementById('dock');
  let counter=1;
  const timers=new Map();
  const $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const $=(s,r=document)=>r.querySelector(s);

  function syncShell(){
    const m=!!document.querySelector('.session-window.maximized:not(.minimized)');
    document.body.classList.toggle('has-maximized',m);
    document.body.classList.toggle('ui-immersive',m);
  }
  function bringToFront(w){if(!w)return;
    $$('.session-window').forEach(x=>{if(x!==w)x.style.zIndex='100'});w.style.zIndex='94000'}
  function togglePeek(id){const w=document.getElementById(id);if(!w||w.classList.contains('maximized'))return;
    w.classList.toggle('peeked');if(w.classList.contains('peeked'))w.classList.remove('collapsed');
    bringToFront(w);syncShell()}
  function toggleCollapse(id){const w=document.getElementById(id);if(!w||w.classList.contains('maximized'))return;
    w.classList.toggle('collapsed');if(w.classList.contains('collapsed'))w.classList.remove('peeked');
    bringToFront(w);syncShell()}
  function maximizeWindow(id){
    const w=document.getElementById(id);if(!w)return;
    if(w.classList.contains('maximized')){
      w.classList.remove('maximized','header-hidden');w.style.zIndex='100';syncShell();return;
    }
    w.classList.remove('collapsed','peeked','minimized','resizing','header-hidden');
    ['top','left','right','bottom','width','height','maxWidth','maxHeight'].forEach(p=>w.style[p]='');
    w.classList.add('maximized');bringToFront(w);syncShell();
  }
  function minimizeWindow(id){
    const w=document.getElementById(id);if(!w)return;timers.delete(id);
    w.classList.remove('maximized','collapsed','peeked','header-hidden','resizing');
    w.classList.add('minimized');
    document.getElementById('dock-'+id)?.remove();
    const b=document.createElement('button');
    b.type='button';b.className='dock-bubble';b.id='dock-'+id;
    b.title='Restaurar janela';b.textContent='۞';
    b.addEventListener('click',function(e){
      e.preventDefault();e.stopPropagation();b.remove();
      w.classList.remove('minimized');bringToFront(w);syncShell();
    });
    dock?.appendChild(b);syncShell();
  }
  function closeWindow(id){const w=document.getElementById(id);if(!w)return;timers.delete(id);
    document.getElementById('dock-'+id)?.remove();w.remove();syncShell()}
  function handleHeaderClick(e,id){
    if(e.target.closest('.win-controls')||e.target.closest('button')||e.target.closest('input'))return;
    const w=document.getElementById(id);if(!w)return;bringToFront(w);
    const old=timers.get(id);if(old){clearTimeout(old);timers.delete(id);maximizeWindow(id);return}
    const t=setTimeout(()=>{timers.delete(id);togglePeek(id)},250);timers.set(id,t);
  }
  function makeResizeHandles(w){
    if(w.dataset.resizeReady==='1')return;w.dataset.resizeReady='1';
    const hy=document.createElement('div');hy.className='resize-handle resize-y';
    const hx=document.createElement('div');hx.className='resize-handle resize-x';
    const hc=document.createElement('div');hc.className='resize-handle resize-corner';
    w.append(hy,hx,hc);
  }
  function wireSession(w){
    if(!w||w.dataset.wired==='1')return;w.dataset.wired='1';
    makeResizeHandles(w);
    $('.win-hdr',w)?.addEventListener('click',e=>handleHeaderClick(e,w.id));
    $('.win-controls',w)?.addEventListener('click',function(e){
      const btn=e.target.closest('button');if(!btn)return;
      const a=btn.dataset.action;if(!a)return;
      e.preventDefault();e.stopPropagation();
      if(a==='collapse')toggleCollapse(w.id);
      else if(a==='maximize')maximizeWindow(w.id);
      else if(a==='minimize')minimizeWindow(w.id);
      else if(a==='close')closeWindow(w.id);
    });
  }
  function createSessionWindow({title='//',src='',contentHtml=''}={}){
    const id='session-'+Date.now()+'-'+counter++;
    const w=document.createElement('section');
    w.className='session-window peeked';w.id=id;
    const t=String(title).replace(/[<>&"']/g,'');
    const s=String(src||'').replace(/"/g,'&quot;');
    const body=src?`<iframe class="win-frame" data-runtime="nav" src="${s}"></iframe>`
      :`<div class="win-content">${contentHtml||''}</div>`;
    w.innerHTML=`
      <div class="win-hdr"><div class="win-controls">
        <button type="button" data-action="collapse">−</button>
        <span class="win-title">${t}</span>
        <button type="button" data-action="maximize">⛶</button>
        <button type="button" data-action="minimize">۞</button>
        <button type="button" data-action="close" style="color:var(--red)">×</button>
      </div></div>${body}`;
    stackWrap.appendChild(w);wireSession(w);bringToFront(w);return w;
  }
  function applyUrlFromTopbar(){
    const v=(document.getElementById('urlInputNav')?.value||'').trim();if(!v)return;
    createSessionWindow({title:v,src:v});
  }
  document.getElementById('goNavBtn')?.addEventListener('click',applyUrlFromTopbar);
  document.getElementById('urlInputNav')?.addEventListener('keydown',e=>{
    if(e.key==='Enter'){e.preventDefault();applyUrlFromTopbar()}
  });
  document.getElementById('openKobBtn')?.addEventListener('click',()=>createSessionWindow());
  $$('.session-window').forEach(wireSession);
  syncShell();

  // API global
  Object.assign(window,{
    handleHeaderClick,togglePeek,toggleCollapse,maximizeWindow,
    minimizeWindow,closeWindow,createSessionWindow,syncShellMode:syncShell
  });
})();