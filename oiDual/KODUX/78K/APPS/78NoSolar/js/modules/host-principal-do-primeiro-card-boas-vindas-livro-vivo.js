/* Unificação dos cards em 3 blocos:
   1) welcome + ls + env
   2) solar (inalterado)
   3) geo + tips
*/
document.addEventListener('DOMContentLoaded', function () {
  try {
    // --- Host principal do primeiro card (Boas-vindas / Livro Vivo) ---
    const welcomeInner = document.querySelector('.card[data-card="welcome"] .card-body-inner');

    const lsCard  = document.querySelector('.card[data-card="ls"]');
    const envCard = document.querySelector('.card[data-card="env"]');
    const tipsCard = document.querySelector('.card[data-card="tips"]');
    const geoInner = document.querySelector('.card[data-card="geo"] .card-body-inner');

    // 1) Juntar LS dentro do card de Boas-vindas
    if (welcomeInner && lsCard) {
      const lsInner = lsCard.querySelector('.card-body-inner');
      if (lsInner) {
        const wrap = document.createElement('div');
        wrap.className = 'nv-subcard';
        wrap.innerHTML =
          '<p class="nv-subtitle">LocalStorage · Estado interno do Nos.S°lar</p>' +
          lsInner.innerHTML;
        welcomeInner.appendChild(wrap);
      }
      lsCard.remove();
    }

    // 2) Juntar Ambiente dentro do card de Boas-vindas
    if (welcomeInner && envCard) {
      const envInner = envCard.querySelector('.card-body-inner');
      if (envInner) {
        const wrap = document.createElement('div');
        wrap.className = 'nv-subcard';
        wrap.innerHTML =
          '<p class="nv-subtitle">Leitura rápida do ambiente solar</p>' +
          envInner.innerHTML;
        welcomeInner.appendChild(wrap);
      }
      envCard.remove();
    }

    // 3) Juntar Dicas dentro do card de Geo
    if (geoInner && tipsCard) {
      const tipsInner = tipsCard.querySelector('.card-body-inner');
      if (tipsInner) {
        const wrap = document.createElement('div');
        wrap.className = 'nv-subcard';
        wrap.innerHTML =
          '<p class="nv-subtitle">Dicas Meta-Humano-Máquina · manhã · tarde · noite</p>' +
          tipsInner.innerHTML;
        geoInner.appendChild(wrap);
      }
      tipsCard.remove();
    }

   
}
   catch (e) {
    console.warn('Patch de unificação de cards falhou:', e);
  }
});