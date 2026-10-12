/* [FINAL] KOB.el(id): referência cacheada dos hosts principais. Marca data-kob-id nos elementos e cai
   pro seletor legado se o cache estiver vazio/desconectado. Aditivo: nada existente foi migrado. */
(function(){
  if (window.KOB && window.KOB.el) return;
  const MAP = { symbolbar:'#symbolBar', 'session-stack':'#stackWrap', 'session-float':'#sessionsLayer',
    dock:'#dock', 'fusion-layer':'#fusionLayer', workspace:'#workspace', loose:'[data-slot="loose"]' };
  const cache = {};
  function el(id){
    let n = cache[id];
    if (n && n.isConnected) return n;
    n = document.querySelector('[data-kob-id="'+id+'"]') || (MAP[id] && document.querySelector(MAP[id])) || null;
    if (n){ if(!n.dataset.kobId) n.dataset.kobId = id; cache[id] = n; }
    return n;
  }
  window.KOB = { el, map: MAP, tag(){ Object.keys(MAP).forEach(el); return Object.keys(cache).filter(k=>cache[k]); } };
  const go = ()=>window.KOB.tag();
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', go); else go();
  window.addEventListener('load', ()=>setTimeout(go, 1500));
})();
