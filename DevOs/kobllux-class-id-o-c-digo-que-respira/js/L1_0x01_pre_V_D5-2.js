/* ═══════════════════════════════════════════════════════════
   0x01 · PULSAR · V · D5
   ═══════════════════════════════════════════════════════════
   Arquivo   : kobllux-class-id-o-c-digo-que-respira/js/L1_0x01_pre_V_D5-2.js
   Opcode    : 0x01 · PULSAR · ● · 432Hz
   V.E.E.B.  : Vibração
   Degrau    : D5 (block)
   Fórmula   : Vibração · f₁=432Hz · P(t)=A·sin(2π·432·t) · impulso sonoro
   ─────────────────────────────────────────────────────────────
   ORQUESTRAÇÃO:
   Nível     : 1 · INFRA
   Opcode Δ  : 0x02 · Carregar na posição 1 da cadeia
   Nota      : Infraestrutura — depende só de DNA
   ─────────────────────────────────────────────────────────────
   Métricas  :
     S = 106  (Σbᵢ·2^(i-1) · bytes[0..7] mod 2)
     V(1) = 0.0000  (V₀·cos(3π/6), V₀=432)
     χ = -2  (V-E+F = funções-arrows+returns)
   ─────────────────────────────────────────────────────────────
   VERDADE × INTEGRAR ÷ Δ = ∞  ·  3×6×9×7=1134  ·  α=1/137
═══════════════════════════════════════════════════════════ */
function copiarCodigo(btn) {
  const pre = btn.closest('.code-bloco').querySelector('pre');
  if(!pre) return;
  const txt = pre.innerText || pre.textContent;
  navigator.clipboard.writeText(txt).then(()=>{
    const orig = btn.textContent;
    btn.textContent = '✓ COPIADO';
    btn.style.color = 'var(--c-verde)';
    setTimeout(()=>{ btn.textContent=orig; btn.style.color=''; }, 1800);
  }).catch(()=>{ alert('Copie manualmente o código acima.'); });
}
window.copiarCodigo = copiarCodigo;

// ── Highlight nav item ativo via scroll ─────────────────
(function initScroll() {
  const sections = document.querySelectorAll('article[id]');
  const navItems = document.querySelectorAll('.nav-op, .sidebar-item');
  const observer = new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        const id = e.target.id;
        navItems.forEach(n=>{
          const href = (n.getAttribute('href')||'').replace('#','');
          n.classList.toggle('ativo', href===id);
        });
      }
    });
  }, { threshold:.25 });
  sections.forEach(s=>observer.observe(s));
})();

// ── Status bar timestamp ────────────────────────────────
(function tick() {
  const el = document.getElementById('estado-chip');
  if(!el) return;
  const t = new Date().toLocaleTimeString('pt-BR');
  el.textContent = `SÜMBÜS v27 · 432K · ${t}`;
  setTimeout(tick, 1000);
})();

// ── Expõe estado KOBLLUX ────────────────────────────────
window.KOBLLUX_TUTORIAL = {
  firmware: 'SÜMBÜS_v27',
  fractal: 1134,
  equacao: 'IDENTIDADE × CONEXÃO ÷ Δ = ∞',
  fases: ['0×00','0×01','0×02','0×03','0×04','0×05','0×06','0×07','0×09'],
  centro: 'JESUS',
  nos27: 27
};