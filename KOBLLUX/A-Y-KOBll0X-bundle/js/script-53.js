
(function(){
  "use strict";
  function read(k,fb){ try{ var v=localStorage.getItem(k); return (v==null||v==='')?fb:v; }catch(e){ return fb; } }
  function activeArch(){ try{ return (document.body&&document.body.getAttribute('data-arch'))||(window.getArch&&window.getArch())||''; }catch(e){ return ''; } }
  function paintComposite(){
    var user=read('di_userName','Convidado'), infodose=read('di_infodoseName','Infodose'), arch=activeArch();
    var composite=(arch?arch+' · ':'')+infodose;
    ['assistantComposite','infodoseComposite','compositeName'].forEach(function(id){ var el=document.getElementById(id); if(el) el.textContent=composite; });
    document.querySelectorAll('[data-composite-name]').forEach(function(el){ el.textContent=composite; });
    try{
      var u=read('di_userName','');
      if(document.body && document.body.getAttribute('data-user')!==u) document.body.setAttribute('data-user',u);
      if(document.documentElement.getAttribute('data-user')!==u) document.documentElement.setAttribute('data-user',u);
    }catch(e){}
  }
  window.addEventListener('kob:statechange', paintComposite);
  window.addEventListener('kob:arch', paintComposite);
  if(window.KOBState && typeof window.KOBState.subscribe==='function'){ try{ window.KOBState.subscribe(function(){ paintComposite(); }); }catch(e){} }
  paintComposite();
  window.KOBIdentity={paintComposite:paintComposite};
})();
