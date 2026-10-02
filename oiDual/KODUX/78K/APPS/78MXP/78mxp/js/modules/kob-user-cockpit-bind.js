(function(){
  const $=s=>document.querySelector(s);
  function close(){
    $('#drawerProfile')?.classList.remove('on');
    $('#drawerOverlay')?.classList.remove('on');
    $('#drawerProfile')?.setAttribute('aria-hidden','true');
    $('#drawerOverlay')?.setAttribute('aria-hidden','true');
  }
  $('#drawerClose')?.addEventListener('click',close);
  $('#drawerOverlay')?.addEventListener('click',close);
  $('#orbToggle')?.addEventListener('click',()=>window.KOBCockpit?.toggle());
  $('#btnCycleSolar')?.addEventListener('click',()=>window.DualTheme?.toggle?.());
  $('#btnAutoSolar')?.addEventListener('click',()=>window.DualTheme?.auto?.());
  const user=localStorage.getItem('di_userName')||'';
  const model=localStorage.getItem('di_modelName')||'';
  const ui=$('#inputUserId'), mi=$('#inputModel');
  if(ui)ui.value=user;
  if(mi)mi.value=model;
  ui?.addEventListener('change',()=>localStorage.setItem('di_userName',ui.value.trim()));
  mi?.addEventListener('change',()=>localStorage.setItem('di_modelName',mi.value.trim()));
})();