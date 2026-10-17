/* Garante que o #loader sempre saia, mesmo sem os scripts remotos (idempotente com o do KodBlloX) */
(function(){
  const hide=()=>{const l=document.getElementById('loader');if(l)l.classList.add('hide')};
  window.addEventListener('load',()=>setTimeout(hide,600));
  setTimeout(hide,6000);
})();