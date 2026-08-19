(function(){
  const brain = document.getElementById('brain') || document.querySelector('#brainPanel,#brain-panel');
  if (!brain) return;
  const target = brain.querySelector('.popover,.content,.items') || brain;
  const card = document.createElement('div');
  card.className = 'menuItem';
  card.style.marginTop = '8px';
  card.innerHTML = `
    <div style="font-weight:900">📲 KOB-DUX — Dispositivo Simbiótico</div>
    <div class="mut" style="display:block">
      Kael Dominus • Nephesh Elyon • BLLUE • Fit Lux • Kodux<br>
      Lei Final: (VERDADE × INTEGRAR) / Δ = ∞
    </div>`;
  target.appendChild(card);
})();