(function(){
      const KEY='di_nebula-gallery-theme';
      function toggleTheme(){const b=document.body;const next=b.dataset.theme==='light'?'dark':'light';b.dataset.theme=next;localStorage.setItem(KEY,next);return next;}
      const saved=localStorage.getItem(KEY);if(saved)document.body.dataset.theme=saved;
      window.NebulaUI={theme:toggleTheme,activateNav(btn){document.querySelectorAll('.bottom-nav button').forEach(b=>b.classList.remove('active'));btn?.classList.add('active');},scrollTo(id,block='center'){document.getElementById(id)?.scrollIntoView({behavior:'smooth',block});},closeAll(){window.NebulaSW?.closeAll?.()}};
      window.toggleTheme=toggleTheme;
      window.openSearch=function(){const box=document.getElementById('search-box'),input=document.getElementById('search-input');if(box&&input){box.classList.add('visible');input.focus();return;}const q=prompt('Pesquisar aplicativos ou documentos:');if(q)window.dispatchEvent(new CustomEvent('nebula:search',{detail:q}));};
      window.scrollApps=()=>NebulaUI.scrollTo('appRail');
      window.goHome=btn=>{NebulaUI.activateNav(btn);document.getElementById('galleryScroll')?.scrollTo({top:0,behavior:'smooth'});};
      window.goApps=btn=>{NebulaUI.activateNav(btn);NebulaUI.scrollTo('appRail');};
      window.goTabs=btn=>{NebulaUI.activateNav(btn);NebulaUI.scrollTo('exploreTabs');};
      window.goLibrary=btn=>{NebulaUI.activateNav(btn);NebulaUI.scrollTo('library-anchor','start');};
      window.goSettings=btn=>{NebulaUI.activateNav(btn);toggleTheme();};
      document.getElementById('theme-dot')?.addEventListener('click',toggleTheme);
    })();