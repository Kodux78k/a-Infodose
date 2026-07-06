
    particlesJS('particles-js', {
      particles: {
        number: {
          value: 39,
          density: { enable: true, value_area: 700 }
        },
        color: { value: ["#00ffff", "#ff00ff"] },
        shape: { type: "circle" },
        opacity: { value: 0.5, random: true },
        size: { value: 3, random: true },
        move: {
          enable: true,
          speed: 1.5,
          direction: "none",
          random: true,
          out_mode: "out",
          straight: false,
          attract: { enable: true, rotateX: 500, rotateY: 1000 }
        }
      },
      retina_detect: true
    });

    function goToIndex() {
      const logo = document.getElementById("logo");
      const sound = document.getElementById("transitionSound");

      logo.classList.add("distort");

      sound.volume = 0;
      sound.play().catch(() => {});

      gsap.to(logo, {
        scale: 0,
        duration: 1.2,
        ease: "power3.out"
      });

      gsap.to(".infodose", { opacity: 0, duration: 0.8, delay: 0.3 });
      gsap.to(".frase", { opacity: 0, duration: 0.8, delay: 0.3 });

      setTimeout(() => {
        document.body.style.animation = "fadeOutBody 1.2s forwards";
      }, 800);

      setTimeout(() => {
        window.location.href = "./index.html";
      }, 1600);
    }
  