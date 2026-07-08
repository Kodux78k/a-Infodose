// ESPIRITO/visual/visual_pulse.js

export const VisualPulse = {
    init() {
        console.log("VisualPulse: Ativado");
        this.initParticles();
    },

    initParticles() {
        if (window.particlesJS) {
            window.particlesJS('particles-js', {
                particles: {
                    number: { value: 40 },
                    color: { value: ['#0ff', '#f0f'] },
                    shape: { type: 'circle' },
                    opacity: { value: 0.4, random: true },
                    size: { value: 2.4, random: true },
                    line_linked: {
                        enable: true,
                        distance: 150,
                        color: '#00f2ff',
                        opacity: 0.1,
                        width: 1
                    },
                    move: {
                        enable: true,
                        speed: 1.5,
                        direction: 'none',
                        random: true,
                        straight: false,
                        out_mode: 'out',
                        bounce: false
                    }
                },
                interactivity: {
                    detect_on: 'canvas',
                    events: {
                        onhover: { enable: true, mode: 'grab' },
                        onclick: { enable: true, mode: 'push' },
                        resize: true
                    },
                    modes: {
                        grab: { distance: 140, line_linked: { opacity: 0.3 } },
                        push: { particles_nb: 4 }
                    }
                },
                retina_detect: true
            });
        }
    },

    updateColor(hex) {
        const blobs = document.querySelectorAll('.blob');
        blobs.forEach(blob => {
            blob.style.background = hex;
        });
        
        if (window.pJSDom && window.pJSDom[0]) {
            window.pJSDom[0].pJS.particles.color.value = hex;
            window.pJSDom[0].pJS.particles.line_linked.color = hex;
            window.pJSDom[0].pJS.fn.particlesRefresh();
        }
    }
};