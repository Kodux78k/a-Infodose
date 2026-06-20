export async function di_initParticles(){

  if(typeof particlesJS === "undefined"){

    await new Promise((resolve,reject)=>{

      const s=document.createElement("script");

      s.src=
      "https://cdn.jsdelivr.net/npm/particles.js@2.0.0/particles.min.js";

      s.onload=resolve;
      s.onerror=reject;

      document.head.appendChild(s);

    });

  }

  const root=
  getComputedStyle(
    document.documentElement
  );

  const active=
  root.getPropertyValue(
    "--active-color"
  ).trim() || "#00f5ff";

  particlesJS("particles-js",{

    particles:{

      number:{
        value:
          matchMedia("(pointer:coarse)").matches
          ? 28
          : 60
      },

      color:{
        value:[
          active,
          "#ff00ff"
        ]
      },

      shape:{
        type:"circle"
      },

      opacity:{
        value:.35
      },

      size:{
        value:2.5,
        random:true
      },

      line_linked:{
        enable:
          !matchMedia("(pointer:coarse)").matches,

        distance:140,
        color:active,
        opacity:.18,
        width:1
      },

      move:{
        enable:true,
        speed:
          matchMedia("(pointer:coarse)").matches
          ? 0.8
          : 1.6,

        out_mode:"out"
      }

    },

    interactivity:{

      detect_on:"window",

      events:{

        onhover:{
          enable:true,
          mode:"grab"
        },

        onclick:{
          enable:true,
          mode:"push"
        }

      },

      modes:{

        grab:{
          distance:120
        },

        push:{
          particles_nb:3
        }

      }

    },

    retina_detect:true

  });

}