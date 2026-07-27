/* ═══════════════════════════════════════════════════════════
   0x01 · PULSAR · V · D5
   ═══════════════════════════════════════════════════════════
   Arquivo   : kobllux-class-id-o-c-digo-que-respira/js/L4_0x01_canvas_V_D5.js
   Opcode    : 0x01 · PULSAR · ● · 432Hz
   V.E.E.B.  : Vibração
   Degrau    : D5 (block)
   Fórmula   : Vibração · f₁=432Hz · P(t)=A·sin(2π·432·t) · impulso sonoro
   ─────────────────────────────────────────────────────────────
   ORQUESTRAÇÃO:
   Nível     : 4 · UTILITARIOS
   Opcode Δ  : 0x05 · Carregar na posição 4 da cadeia
   Nota      : Função utilitária (fallback)
   ─────────────────────────────────────────────────────────────
   Métricas  :
     S = 195  (Σbᵢ·2^(i-1) · bytes[0..7] mod 2)
     V(1) = 0.0000  (V₀·cos(3π/6), V₀=432)
     χ = 3  (V-E+F = funções-arrows+returns)
   ─────────────────────────────────────────────────────────────
   VERDADE × INTEGRAR ÷ Δ = ∞  ·  3×6×9×7=1134  ·  α=1/137
═══════════════════════════════════════════════════════════ */
// ── Canvas background particles ──────────────────────────
(function SUMBÜS_BG() {
  const canvas = document.getElementById('bg-canvas');
  const ctx    = canvas.getContext('2d');
  let W, H;
  const CORS = [
    [155,89,182],  // corpo
    [52,152,219],  // mente
    [0,255,208],   // espirito
    [200,169,110], // dourado
    [46,204,113],  // verde
    [127,140,141]  // cinza
  ];
  function resize(){ W=canvas.width=window.innerWidth; H=canvas.height=window.innerHeight; }
  window.addEventListener('resize', resize); resize();

  const pts = Array.from({length:60}, ()=> {
    const c = CORS[Math.floor(Math.random()*CORS.length)];
    return {
      x:Math.random()*W, y:Math.random()*H,
      vx:(Math.random()-.5)*.35, vy:(Math.random()-.5)*.35,
      r:Math.random()*1.2+.2,
      a:Math.random()*.3+.05,
      p:Math.random()*Math.PI*2,
      ps:(Math.random()*.4+.2)*.01,
      c
    };
  });

  function draw() {
    requestAnimationFrame(draw);
    ctx.clearRect(0,0,W,H);
    // connections
    for(let i=0;i<pts.length;i++) {
      for(let j=i+1;j<pts.length;j++) {
        const dx=pts[i].x-pts[j].x, dy=pts[i].y-pts[j].y;
        const d=Math.sqrt(dx*dx+dy*dy);
        if(d<110){
          const a=(1-d/110)*.05;
          const c=pts[i].c;
          ctx.beginPath();
          ctx.strokeStyle=`rgba(${c[0]},${c[1]},${c[2]},${a})`;
          ctx.lineWidth=.4;
          ctx.moveTo(pts[i].x,pts[i].y);
          ctx.lineTo(pts[j].x,pts[j].y);
          ctx.stroke();
        }
      }
    }
    for(const p of pts) {
      p.pulse+=p.ps; p.x+=p.vx; p.y+=p.vy;
      if(p.x<0)p.x=W; if(p.x>W)p.x=0;
      if(p.y<0)p.y=H; if(p.y>H)p.y=0;
      const r=p.r*(1+Math.sin(p.pulse)*.25);
      const a=p.a*(0.75+Math.sin(p.pulse)*.25);
      ctx.save();
      ctx.shadowColor=`rgba(${p.c[0]},${p.c[1]},${p.c[2]},.4)`;
      ctx.shadowBlur=5;
      ctx.beginPath();
      ctx.arc(p.x,p.y,Math.max(.1,r),0,Math.PI*2);
      ctx.fillStyle=`rgba(${p.c[0]},${p.c[1]},${p.c[2]},${a})`;
      ctx.fill();
      ctx.restore();
    }
  }
  draw();
})();

// ── Copiar código ───────────────────────────────────────