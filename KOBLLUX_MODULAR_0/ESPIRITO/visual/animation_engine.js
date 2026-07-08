/**
 * ⧈ KOBLLUX_Δ³ :: ESPIRITO/visual/animation_engine.js
 * #glsl #typescript
 * Motor de Animações e Shaders CSS
 */

export const AnimationEngine = {
    init() {
        console.log("AnimationEngine: Ativado");
    },

    fadeIn(el, delay = 0) {
        if (!el) return;
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = `opacity 0.6s ease ${delay}s, transform 0.6s ease ${delay}s`;
        
        requestAnimationFrame(() => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        });
    },

    pulse(el) {
        if (!el) return;
        el.animate([
            { transform: 'scale(1)', opacity: 1 },
            { transform: 'scale(1.05)', opacity: 0.8 },
            { transform: 'scale(1)', opacity: 1 }
        ], {
            duration: 1000,
            iterations: 1
        });
    }
};
