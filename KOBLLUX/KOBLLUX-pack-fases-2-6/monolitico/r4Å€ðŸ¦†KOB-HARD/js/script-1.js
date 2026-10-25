
/* Captura a identidade ANTES dos módulos legados tentarem gravar um arquétipo padrão. */
(function(){
  var arch = '', user = '';
  try {
    var keys = ['di_activeArchetype','kobllux_active_archetype','KBLX_ARCH','di_archetype','kob:arch:active','infodose_arch'];
    for (var i=0;i<keys.length && !arch;i++) arch = localStorage.getItem(keys[i]) || '';
    user = localStorage.getItem('di_userName') || '';
  } catch(e) {}
  window.__KOB_PROFILE_BOOT__ = { arch: String(arch||'').trim(), user: String(user||'').trim() };
})();
