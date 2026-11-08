(function(h, s = '#inject-here') {
  const parser = new DOMParser();
  const doc = parser.parseFromString(h, 'text/html');
  const fragment = document.createDocumentFragment();
  const target = document.querySelector(s) || document.body;
  
  Array.from(doc.body.childNodes).forEach(node => {
    fragment.appendChild(document.importNode(node, true));
  });
  target.appendChild(fragment);
  
  // rehidrata scripts (DOMParser não executa nada sozinho)
  Array.from(doc.querySelectorAll('script')).forEach(oldScript => {
    const newScript = document.createElement('script');
    for (const attr of oldScript.attributes) {
      newScript.setAttribute(attr.name, attr.value);
    }
    newScript.textContent = oldScript.textContent;
    document.body.appendChild(newScript);
  });
})(`

<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>KOBLLUX Trinity Engine</title>
  <style>
    :root{
      --bg:#050811;
      --c1:#00f5ff;
      --c2:#ff4bff;
      --glow:rgba(0,245,255,.45);
    }
    *{margin:0;padding:0;box-sizing:border-box;}
    html,body{
      width:100%;height:100%;
      background:
        radial-gradient(circle at top, rgba(0,245,255,.08), transparent 40%),
        radial-gradient(circle at bottom, rgba(255,75,255,.08), transparent 40%),
        var(--bg);
      font-family: Inter, Arial, sans-serif;
      position:relative;
      overflow:hidden;
    }

    #particles{
      position:fixed;
      inset:0;
      z-index:-1;
      pointer-events:auto;
      opacity:.85;
    }
    #bgParticles{
      width:100%;height:100%;display:block;
      filter:
        drop-shadow(0 0 4px #00ffff66)
        drop-shadow(0 0 12px #ff00ff22);
    }

    .center{
      position:fixed;inset:0;
      display:flex;align-items:center;justify-content:center;
      pointer-events:none;
      z-index:2;
    }
    .logo{
      padding:40px;border-radius:24px;
      color:white;text-align:center;
      background:rgba(255,255,255,.04);
      backdrop-filter:blur(18px);
      border:1px solid rgba(255,255,255,.12);
      box-shadow:
        0 0 40px rgba(0,245,255,.18),
        0 0 80px rgba(255,75,255,.12);
    }
    .logo h1{
      font-size:clamp(2rem,6vw,5rem);
      letter-spacing:8px;
    }
    .logo p{
      margin-top:10px;
      opacity:.75;
      letter-spacing:2px;
    }
  </style>
</head>
<body>

  <div id="particles">
    <canvas id="bgParticles"></canvas>
  </div>

  <div class="center">
    <div class="logo">
      <h1>KOBLLUX</h1>
      <p>TRINITY ENGINE</p>
    </div>
  </div>

  <script>
    class KOBParticles{
      constructor(canvas, config = {}){
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.mouse = { x: null, y: null, radius: 180 };
        this.running = true;

        const cs = getComputedStyle(document.documentElement);
        this.cfg = {
          count: matchMedia("(pointer:coarse)").matches ? 70 : 150,
          speed: 1,
          size: 2,
          color1: cs.getPropertyValue("--c1").trim() || "#00f5ff",
          color2: cs.getPropertyValue("--c2").trim() || "#ff4bff",
          linkDistance: 160,
          mouseForce: .18,
          ...config
        };

        this.particles = [];
        this.resize();

        window.addEventListener("resize", () => this.resize());
        window.addEventListener("mousemove", e => {
          this.mouse.x = e.clientX;
          this.mouse.y = e.clientY;
        });
        window.addEventListener("touchmove", e => {
          const t = e.touches[0];
          this.mouse.x = t.clientX;
          this.mouse.y = t.clientY;
        }, { passive: true });
        document.addEventListener("visibilitychange", () => {
          this.running = !document.hidden;
          if (this.running) this.animate();
        });

        this.createParticles();
        this.animate();
      }

      resize(){
        const ratio = window.devicePixelRatio || 1;
        this.canvas.width  = innerWidth  * ratio;
        this.canvas.height = innerHeight * ratio;
        this.canvas.style.width  = innerWidth  + "px";
        this.canvas.style.height = innerHeight + "px";
        this.ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      }

      createParticles(){
        this.particles = [];
        for (let i = 0; i < this.cfg.count; i++){
          this.particles.push({
            x: Math.random() * innerWidth,
            y: Math.random() * innerHeight,
            vx: (Math.random() - .5) * this.cfg.speed,
            vy: (Math.random() - .5) * this.cfg.speed,
            pulse: Math.random() * Math.PI * 2,
            color: Math.random() > .5 ? this.cfg.color1 : this.cfg.color2
          });
        }
      }

      update(){
        for (const p of this.particles){
          p.x += p.vx;
          p.y += p.vy;
          p.pulse += 0.03;

          if (p.x < 0 || p.x > innerWidth)  p.vx *= -1;
          if (p.y < 0 || p.y > innerHeight) p.vy *= -1;

          if (this.mouse.x !== null){
            const dx = p.x - this.mouse.x;
            const dy = p.y - this.mouse.y;
            const dist = Math.hypot(dx, dy);
            if (dist < this.mouse.radius){
              const force = (this.mouse.radius - dist) / this.mouse.radius;
              p.x += dx * force * this.cfg.mouseForce;
              p.y += dy * force * this.cfg.mouseForce;
            }
          }
        }
      }

      drawLinks(){
        for (let i = 0; i < this.particles.length; i++){
          for (let j = i + 1; j < this.particles.length; j++){
            const a = this.particles[i];
            const b = this.particles[j];
            const dist = Math.hypot(a.x - b.x, a.y - b.y);
            if (dist < this.cfg.linkDistance){
              const alpha = 1 - dist / this.cfg.linkDistance;
              const g = this.ctx.createLinearGradient(a.x, a.y, b.x, b.y);
              g.addColorStop(0, this.cfg.color1);
              g.addColorStop(1, this.cfg.color2);
              this.ctx.strokeStyle = g;
              this.ctx.globalAlpha = alpha * .4;
              this.ctx.lineWidth = 1;
              this.ctx.beginPath();
              this.ctx.moveTo(a.x, a.y);
              this.ctx.lineTo(b.x, b.y);
              this.ctx.stroke();
            }
          }
        }
        this.ctx.globalAlpha = 1;
      }

      drawParticles(){
        for (const p of this.particles){
          const radius = this.cfg.size + Math.sin(p.pulse) * .7;
          this.ctx.beginPath();
          this.ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
          this.ctx.fillStyle = p.color;
          this.ctx.shadowBlur = 15;
          this.ctx.shadowColor = p.color;
          this.ctx.fill();
        }
        this.ctx.shadowBlur = 0;
      }

      render(){
        this.ctx.clearRect(0, 0, innerWidth, innerHeight);
        this.drawLinks();
        this.drawParticles();
      }

      animate(){
        if (!this.running) return;
        this.update();
        this.render();
        requestAnimationFrame(() => this.animate());
      }
    }

    new KOBParticles(document.getElementById("bgParticles"));
  </script>

</body>
</html>

`);