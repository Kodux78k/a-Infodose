class KOBParticles{

  constructor(canvas,config={}){

    this.canvas=canvas;
    this.ctx=canvas.getContext("2d");

    this.mouse={
      x:null,
      y:null,
      radius:180
    };

    this.running=true;

    this.cfg={

      count:
      matchMedia("(pointer:coarse)").matches
      ?70
      :150,

      speed:1,

      size:2,

      color1:getComputedStyle(
        document.documentElement
      ).getPropertyValue("--c1").trim(),

      color2:getComputedStyle(
        document.documentElement
      ).getPropertyValue("--c2").trim(),

      linkDistance:160,

      mouseForce:.18,

      ...config

    };

    this.particles=[];

    this.resize();

    window.addEventListener(
      "resize",
      ()=>this.resize()
    );

    window.addEventListener(
      "mousemove",
      e=>{
        this.mouse.x=e.clientX;
        this.mouse.y=e.clientY;
      }
    );

    window.addEventListener(
      "touchmove",
      e=>{

        const t=e.touches[0];

        this.mouse.x=t.clientX;
        this.mouse.y=t.clientY;

      },
      {passive:true}
    );

    document.addEventListener(
      "visibilitychange",
      ()=>{

        this.running=
          !document.hidden;

        if(this.running)
          this.animate();

      }
    );

    this.createParticles();

    this.animate();
  }

  resize(){

    const ratio=
      window.devicePixelRatio||.87;

    this.canvas.width=
      innerWidth*ratio;

    this.canvas.height=
      innerHeight*ratio;

    this.canvas.style.width=
      innerWidth+"px";

    this.canvas.style.height=
      innerHeight+"px";

    this.ctx.setTransform(
      ratio,
      0,
      0,
      ratio,
      0,
      0
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
          Math.random()*Math.PI*2,

        color:
          Math.random()>.5
          ?this.cfg.color1
          :this.cfg.color2

      });

    }

  }

  update(){

    for(
      const p
      of this.particles
    ){

      p.x+=p.vx;
      p.y+=p.vy;

      p.pulse+=0.03;

      if(
        p.x<0 ||
        p.x>innerWidth
      ) p.vx*=-1;

      if(
        p.y<0 ||
        p.y>innerHeight
      ) p.vy*=-1;

      if(
        this.mouse.x!==null
      ){

        const dx=
          p.x-this.mouse.x;

        const dy=
          p.y-this.mouse.y;

        const dist=
          Math.hypot(dx,dy);

        if(
          dist<
          this.mouse.radius
        ){

          const force=
            (this.mouse.radius-dist)
            /this.mouse.radius;

          p.x+=
            dx*
            force*
            this.cfg.mouseForce;

          p.y+=
            dy*
            force*
            this.cfg.mouseForce;
        }
      }
    }
  }

  drawLinks(){

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
          dist<
          this.cfg.linkDistance
        ){

          const alpha=
            1-
            dist/
            this.cfg.linkDistance;

          const g=
            this.ctx.createLinearGradient(
              a.x,
              a.y,
              b.x,
              b.y
            );

          g.addColorStop(
            0,
            this.cfg.color1
          );

          g.addColorStop(
            1,
            this.cfg.color2
          );

          this.ctx.strokeStyle=g;

          this.ctx.globalAlpha=
            alpha*.4;

          this.ctx.lineWidth=1;

          this.ctx.beginPath();

          this.ctx.moveTo(
            a.x,
            a.y
          );

          this.ctx.lineTo(
            b.x,
            b.y
          );

          this.ctx.stroke();

        }
      }
    }

    this.ctx.globalAlpha=1;
  }

  drawParticles(){

    for(
      const p
      of this.particles
    ){

      const radius=
        this.cfg.size+
        Math.sin(
          p.pulse
        )*.7;

      this.ctx.beginPath();

      this.ctx.arc(
        p.x,
        p.y,
        radius,
        0,
        Math.PI*2
      );

      this.ctx.fillStyle=
        p.color;

      this.ctx.shadowBlur=15;

      this.ctx.shadowColor=
        p.color;

      this.ctx.fill();

    }

    this.ctx.shadowBlur=0;
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

    if(
      !this.running
    ) return;

    this.update();

    this.render();

    requestAnimationFrame(
      ()=>this.animate()
    );

  }

}

new KOBParticles(
  document.getElementById(
    "bgParticles"
  )
);
