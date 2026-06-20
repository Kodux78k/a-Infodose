class KOBParticles{

  constructor(canvas,config={}){

    this.canvas=canvas;
    this.ctx=canvas.getContext("2d");

    this.running=true;

    this.cfg={

      count:50,

      speed:.35,

      maxSpeed:.7,

      size:3,

      attract:true,

      attractStrength:.003,

      linkDistance:140,

      maxParticles:250,

      color1:getComputedStyle(
        document.documentElement
      ).getPropertyValue(
        "--kob-voice-primary"
      ).trim(),

      color2:getComputedStyle(
        document.documentElement
      ).getPropertyValue(
        "--kob-voice-secondary"
      ).trim(),

      ...config
    };

    this.particles=[];

    this.resize();

    window.addEventListener(
      "resize",
      ()=>this.resize()
    );

    document.addEventListener(
      "visibilitychange",
      ()=>{
        this.running=!document.hidden;

        if(this.running)
          this.animate();
      }
    );

    this.createParticles();

    this.animate();
  }

  refreshTheme(){

    const css=
    getComputedStyle(
      document.documentElement
    );

    this.cfg.color1=
    css.getPropertyValue(
      "--kob-voice-primary"
    ).trim();

    this.cfg.color2=
    css.getPropertyValue(
      "--kob-voice-secondary"
    ).trim();

  }

  resize(){

    const ratio=
    window.devicePixelRatio||1;

    this.canvas.width=
    innerWidth*ratio;

    this.canvas.height=
    innerHeight*ratio;

    this.canvas.style.width=
    innerWidth+"px";

    this.canvas.style.height=
    innerHeight+"px";

    this.ctx.setTransform(
      ratio,0,0,ratio,0,0
    );

  }

  createParticles(){

    this.particles=[];

    for(
      let i=0;
      i<this.cfg.count;
      i++
    ){

      this.particles.push({

        x:
        Math.random()*innerWidth,

        y:
        Math.random()*innerHeight,

        vx:
        (Math.random()-.5)
        *this.cfg.speed,

        vy:
        (Math.random()-.5)
        *this.cfg.speed,

        pulse:
        Math.random()
        *Math.PI*2,

        size:
        Math.random()*3+1,

        opacity:
        Math.random()*.5+.4,

        color:
        Math.random()>.5
        ?this.cfg.color1
        :this.cfg.color2

      });

    }

  }

  spawn(x,y,amount=12){

    if(
      this.particles.length>
      this.cfg.maxParticles
    ) return;

    const now=
    performance.now();

    for(
      let i=0;
      i<amount;
      i++
    ){

      this.particles.push({

        x,
        y,

        vx:
        (Math.random()-.5)*2,

        vy:
        (Math.random()-.5)*2,

        pulse:
        Math.random()
        *Math.PI*2,

        size:
        Math.random()*3+1,

        opacity:1,

        born:now,

        life:2200,

        color:
        Math.random()>.5
        ?this.cfg.color1
        :this.cfg.color2

      });

    }

  }

  update(){

    const now=
    performance.now();

    for(
      const p
      of this.particles
    ){

      if(this.cfg.attract){

        const cx=
        innerWidth/2;

        const cy=
        innerHeight/2;

        p.vx+=
        (cx-p.x)
        *this.cfg.attractStrength;

        p.vy+=
        (cy-p.y)
        *this.cfg.attractStrength;
      }

      p.vx=
      Math.max(
        -this.cfg.maxSpeed,
        Math.min(
          this.cfg.maxSpeed,
          p.vx
        )
      );

      p.vy=
      Math.max(
        -this.cfg.maxSpeed,
        Math.min(
          this.cfg.maxSpeed,
          p.vy
        )
      );

      p.x+=p.vx;
      p.y+=p.vy;

      p.pulse+=.02;

      if(
        p.x<0||
        p.x>innerWidth
      ) p.vx*=-1;

      if(
        p.y<0||
        p.y>innerHeight
      ) p.vy*=-1;

    }

    this.particles=
    this.particles.filter(p=>{

      if(!p.life)
        return true;

      const age=
      now-p.born;

      p.opacity=
      Math.max(
        0,
        1-age/p.life
      );

      return age<p.life;

    });

  }

  drawLinks(){

    const ctx=
    this.ctx;

    for(
      let i=0;
      i<this.particles.length;
      i++
    ){

      for(
        let j=i+1;
        j<this.particles.length;
        j++
      ){

        const a=
        this.particles[i];

        const b=
        this.particles[j];

        const dist=
        Math.hypot(
          a.x-b.x,
          a.y-b.y
        );

        if(
          dist>
          this.cfg.linkDistance
        ) continue;

        const alpha=
        1-
        dist/
        this.cfg.linkDistance;

        const g=
        ctx.createLinearGradient(
          a.x,a.y,
          b.x,b.y
        );

        g.addColorStop(
          0,
          this.cfg.color1
        );

        g.addColorStop(
          1,
          this.cfg.color2
        );

        ctx.globalAlpha=
        alpha*.35;

        ctx.strokeStyle=g;

        ctx.lineWidth=1;

        ctx.beginPath();

        ctx.moveTo(
          a.x,a.y
        );

        ctx.lineTo(
          b.x,b.y
        );

        ctx.stroke();

      }

    }

    ctx.globalAlpha=1;

  }

  drawParticles(){

    const ctx=
    this.ctx;

    for(
      const p
      of this.particles
    ){

      const radius=
      p.size+
      Math.sin(
        p.pulse
      )*.4;

      ctx.globalAlpha=
      p.opacity;

      ctx.beginPath();

      ctx.arc(
        p.x,
        p.y,
        radius,
        0,
        Math.PI*2
      );

      ctx.fillStyle=
      p.color;

      ctx.shadowBlur=12;

      ctx.shadowColor=
      p.color;

      ctx.fill();

    }

    ctx.shadowBlur=0;
    ctx.globalAlpha=1;

  }

  render(){

    this.ctx.clearRect(
      0,
      0,
      innerWidth,
      innerHeight
    );

    this.drawLinks();

    this.drawParticles();

  }

  animate(){

    if(!this.running)
      return;

    this.update();

    this.render();

    requestAnimationFrame(
      ()=>this.animate()
    );

  }

}

const engine=
new KOBParticles(
  document.getElementById(
    "bgParticles"
  )
);

engine.canvas.addEventListener(
  "pointerdown",
  e=>{

    engine.spawn(
      e.clientX,
      e.clientY,
      15
    );

  }
);

new MutationObserver(
  ()=>engine.refreshTheme()
).observe(
  document.documentElement,
  {
    attributes:true,
    subtree:true
  }
);