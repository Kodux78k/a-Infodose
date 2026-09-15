(function(){
  "use strict";
  if (window.__NEBULA_ENHANCE__) return;
  window.__NEBULA_ENHANCE__ = true;

  const stage = document.getElementById('sliceStage') || document.body;

  /* ---------- 1) envolve listas de topo em .list-card ---------- */
  function wrapLists(root){
    root.querySelectorAll('ul.md-list, ol.md-list').forEach(el => {
      /* pula se já estiver num card, num ascii, ou aninhada em outra lista */
      if (el.closest('.list-card, .ascii-card, .no-beauty')) return;
      if (el.parentElement && el.parentElement.closest('ul.md-list, ol.md-list')) return;
      /* pula se já foi envolvida */
      if (el.parentElement && el.parentElement.classList.contains('list-card')) return;

      const wrap = document.createElement('div');
      wrap.className = 'list-card';
      el.parentNode.insertBefore(wrap, el);
      wrap.appendChild(el);
    });
  }

  /* ---------- 2) promove <pre> com cara de ASCII para .ascii-card ---------- */
  function enhanceASCII(root){
    root.querySelectorAll('pre.md-code, pre').forEach(pre => {
      if (pre.closest('.ascii-card, .no-beauty')) return;
      const t = (pre.textContent || '').trim();
      if (!t) return;
      const boxChars = (t.match(/[─│┌┐└┘╭╮╰╯═╬╠╣╦╩]/g) || []).length;
      const gridLike = /[-_=+*#\\/|]{3,}/.test(t);
      const multiline = t.split('\n').length >= 2;
      if (boxChars >= 4 || (multiline && gridLike && boxChars >= 1)){
        const fig = document.createElement('figure');
        fig.className = 'ascii-card';
        const p = document.createElement('pre');
        p.textContent = t;
        fig.appendChild(p);
        pre.replaceWith(fig);
      }
    });
  }

  /* ---------- 3) clicar no .copy-hint copia o bloco ---------- */
  document.addEventListener('click', async e => {
    const host = e.target.closest('#readerApp .md-code, #readerApp .bq, #readerApp .callout');
    if (!host) return;
    if (!host.querySelector('.copy-hint')) return;
    if (e.target.closest('a,button,.btn')) return;
    const txt = host.innerText.replace(/Copiar/i,'').trim();
    try { await navigator.clipboard.writeText(txt); window.KBLX_TOAST?.('Copiado ✓'); } catch(_){}
  }, { passive:true });

  /* ---------- 4) botões data-action → MXP / evento ---------- */
  document.addEventListener('click', e => {
    const btn = e.target.closest('#readerApp button.btn.action[data-action]');
    if (!btn) return;
    const action = btn.dataset.action;
    document.dispatchEvent(new CustomEvent('NEBULA_ACTION', { detail:{ action, button: btn } }));
    if (window.MXP && typeof window.MXP.fire === 'function'){
      window.MXP.fire(action, { source:'nebula-slice', button: btn });
    }
  }, { passive:true });

  /* ---------- 5) roda quando slices entram/saem ---------- */
  function run(root){
    if (!root || !root.querySelectorAll) return;
    wrapLists(root);
    enhanceASCII(root);
  }

  const obs = new MutationObserver(muts => {
    let touched = false;
    for (const m of muts){
      for (const n of m.addedNodes || []){
        if (n.nodeType === 1 && (n.matches?.('slice') || n.closest?.('#sliceStage'))){
          touched = true; break;
        }
      }
      if (touched) break;
    }
    if (touched) run(stage);
  });
  obs.observe(stage, { childList:true, subtree:true });

  /* gatilhos suaves extras (troca de slice ativa) */
  document.addEventListener('click', e => {
    if (e.target.closest('#readerApp')) setTimeout(() => run(stage), 60);
  }, { passive:true });

  if (document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', () => run(stage), { once:true });
  } else {
    run(stage);
  }

  console.log('[NebulaEnhance] list-card + ascii + copy-hint online');
})();