/* ═══════════════════════════════════════════════════════════
   §ENHANCE · artemis-enhance · Enhancer de Slices
   Arquétipo: ARTEMIS · Prefixo: artemis_
   Depende: genus-md-parser
   ═══════════════════════════════════════════════════════════ */
(function(){
"use strict";
if(window.__ARTEMIS_ENHANCE__) return;
window.__ARTEMIS_ENHANCE__ = true;

const solus_stage = document.getElementById('solus_stage') || document.body;

/* ─── 1) envolve listas em .list-card ─── */
function artemis_wrap_lists(root){
  root.querySelectorAll('.md-list').forEach(el=>{
    if(el.closest('.list-card, .ascii-card, .no-beauty')) return;
    if(el.parentElement?.closest('.md-list')) return;
    if(el.parentElement?.classList.contains('list-card')) return;
    const wrap = document.createElement('div');
    wrap.className = 'list-card';
    el.parentNode.insertBefore(wrap, el);
    wrap.appendChild(el);
  });
}

/* ─── 2) promove ASCII para .ascii-card ─── */
function artemis_enhance_ascii(root){
  root.querySelectorAll('pre.md-code, pre').forEach(pre=>{
    if(pre.closest('.ascii-card, .no-beauty')) return;
    const t = (pre.textContent || '').trim();
    if(!t) return;
    const boxChars = (t.match(/[─│┌┐└┘╭╮╰╯═╬╠╣╦╩]/g) || []).length;
    const gridLike = /[-_=+*#\\/|]{3,}/.test(t);
    const multiline = t.split('\n').length >= 2;
    if(boxChars >= 4 || (multiline && gridLike && boxChars >= 1)){
      const fig = document.createElement('figure');
      fig.className = 'ascii-card';
      const p = document.createElement('pre');
      p.textContent = t;
      fig.appendChild(p);
      pre.replaceWith(fig);
    }
  });
}

/* ─── 3) click em copy-hint ─── */
document.addEventListener('click', async e=>{
  const host = e.target.closest('#solus_reader .md-code, #solus_reader .bq, #solus_reader .callout');
  if(!host) return;
  if(!host.querySelector('.copy-hint')) return;
  if(e.target.closest('a,button,.btn')) return;
  const txt = host.innerText.replace(/Copiar/i,'').trim();
  try{
    await navigator.clipboard.writeText(txt);
    window.pulse_toast?.('Copiado ✓');
  }catch(_){}
}, {passive:true});

/* ─── 4) botões data-action → MXP ─── */
document.addEventListener('click', e=>{
  const btn = e.target.closest('#solus_reader button.btn.action[data-action]');
  if(!btn) return;
  const action = btn.dataset.action;
  document.dispatchEvent(new CustomEvent('NEBULA_ACTION', {detail:{action, button: btn}}));
  if(window.genus_mxp && typeof window.genus_mxp.fire === 'function'){
    window.genus_mxp.fire(action, {source:'nebula-slice', button: btn});
  }
}, {passive:true});

/* ─── 5) run ─── */
function artemis_run(root){
  if(!root || !root.querySelectorAll) return;
  artemis_wrap_lists(root);
  artemis_enhance_ascii(root);
}

/* ─── MutationObserver ─── */
const artemis_obs = new MutationObserver(muts=>{
  let touched = false;
  for(const m of muts){
    for(const n of m.addedNodes || []){
      if(n.nodeType === 1 && (n.matches?.('slice') || n.closest?.('#solus_stage'))){
        touched = true; break;
      }
    }
    if(touched) break;
  }
  if(touched) artemis_run(solus_stage);
});
artemis_obs.observe(solus_stage, {childList:true, subtree:true});

/* ─── click em qualquer lugar do reader → rerun suave ─── */
document.addEventListener('click', e=>{
  if(e.target.closest('#solus_reader'))
    setTimeout(()=>artemis_run(solus_stage), 60);
}, {passive:true});

if(document.readyState === 'loading'){
  document.addEventListener('DOMContentLoaded', ()=>artemis_run(solus_stage), {once:true});
} else {
  artemis_run(solus_stage);
}

window.artemis_enhance = {
  decorate: artemis_run,
  wrapLists: artemis_wrap_lists,
  enhanceASCII: artemis_enhance_ascii,
  version: 1
};

console.log('[artemis-enhance] online · list-card + ascii + copy-hint prontos');
})();