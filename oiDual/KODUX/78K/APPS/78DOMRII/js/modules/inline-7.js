
// BOMBA: HTML TO JS INJECTOR PRO DOMRII
window.DUAL = window.DUAL || {};

DUAL.bomba.inject = function(html, target='#inject-here'){
  const js = `(function(h,s='${target}'){const p=new DOMParser(),c=p.parseFromString(h,'text/html'),f=document.createDocumentFragment(),t=document.querySelector(s)||document.body;Array.from(c.body.childNodes).forEach(n=>f.appendChild(document.importNode(n,true)));t.appendChild(f);Array.from(c.querySelectorAll('script')).forEach(x=>{const n=document.createElement('script');for(const a of x.attributes)n.setAttribute(a.name,a.value);n.textContent=x.textContent;document.body.appendChild(n)})})(\`${html.replace(/`/g,'\\`')}\`);`;

  const blob = new Blob([js],{type:'text/javascript'});
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'domrii-inject.js';
  a.click();

  toast('⚡ JS Injetável Exportado');
}
