(()=>{'use strict';
const STYLE_ID='INLINE_CSS_RENDER_V1';
function appendCSS(css){
  if(!css || !css.trim()) return;
  let s=document.getElementById(STYLE_ID);
  if(!s){ s=document.createElement('style'); s.id=STYLE_ID; document.head.appendChild(s); }
  s.appendChild(document.createTextNode('\n'+css));
}
window.CSS_INNER = {
  // Varre o DOM e injeta CSS encontrado em blocos comuns
  applyFromDOM(){
    let css='';
    document.querySelectorAll('style[data-inline], [data-css-inline], pre[data-lang="css"], code.language-css, pre code.css').forEach(el=>{
      const t = (el.textContent||'').trim();
      if(t) css += '\n' + t;
    });
    appendCSS(css);
  },
  // Extrai <style>...</style> de uma string HTML e aplica
  applyFromHTML(html){
    if(!html) return;
    const re=/<style[^>]*>([\s\S]*?)<\/style>/gi; let m, css='';
    while((m=re.exec(html))){ css += '\n' + (m[1]||''); }
    appendCSS(css);
  }
};
document.addEventListener('DOMContentLoaded', ()=> CSS_INNER.applyFromDOM());
})();