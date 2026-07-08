/**
 * ⧈ KOBLLUX_Δ³ :: CORPO/engines/orb_engine.js
 * #typescript #glsl
 * Motor de Estados e Transições do Orb/Interface
 */

export const OrbEngine = {
    states: {
        NORMAL: 'normal',
        ORB: 'orb',
        HUD: 'hud',
        EXPANDED: 'expanded'
    },
    
    currentMode: 'normal',

    init() {
        console.log("OrbEngine: Ativado");
        this.setupDragAndDrop();
    },

    setMode(mode) {
        const card = document.querySelector('.fusion-card');
        if (!card) return;

        // Remove all mode classes
        Object.values(this.states).forEach(s => card.classList.remove(s));
        
        // Add new mode
        card.classList.add(mode);
        this.currentMode = mode;
        
        if (mode === this.states.ORB) {
            card.style.left = '20px';
            card.style.top = '20px';
        } else if (mode === this.states.NORMAL) {
            card.style.left = '';
            card.style.top = '';
        }

        console.log(`OrbEngine: Modo alterado para ${mode}`);
    },

    setupDragAndDrop() {
        const card = document.querySelector('.fusion-card');
        if (!card) return;

        let isDragging = false;
        let startX, startY, initialLeft, initialTop;

        card.addEventListener('mousedown', (e) => {
            if (this.currentMode !== this.states.ORB && this.currentMode !== this.states.HUD) return;
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            initialLeft = card.offsetLeft;
            initialTop = card.offsetTop;
            card.style.cursor = 'grabbing';
        });

        window.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;
            card.style.left = `${initialLeft + dx}px`;
            card.style.top = `${initialTop + dy}px`;
        });

        window.addEventListener('mouseup', () => {
            if (!isDragging) return;
            isDragging = false;
            card.style.cursor = 'grab';
            
            // Snap to zone logic
            const snapZone = document.getElementById('snap-zone');
            if (snapZone && card.offsetTop < 80) {
                this.setMode(this.states.HUD);
            }
        });
    }
};
