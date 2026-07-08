/**
 * ⧈ KOBLLUX_Δ³ :: ESPIRITO/ui/interface_manager.js
 * #typescript
 * Gerenciador de Interface, Menus e Componentes Visuais
 * Δ7: Gestão de Estado e Componentes (TypeScript)
 */

export const InterfaceManager = {
    state: {
        isOrb: false,
        isHud: false,
        isZen: false
    },

    init(els) {
        this.els = els || {
            clock: document.querySelector('.time-display'),
            card: document.querySelector('.fusion-card')
        };
        this.setupClock();
        this.bindEvents();
        console.log("InterfaceManager: Ativado");
    },

    setupClock() {
        const update = () => {
            const now = new Date();
            const timeStr = now.toLocaleTimeString('pt-BR', { hour12: false, hour: '2-digit', minute: '2-digit' });
            if (this.els.clock) this.els.clock.innerText = timeStr;
        };
        setInterval(update, 1000);
        update();
    },

    bindEvents() {
        const mantraBtn = document.getElementById('mantra-toggle');
        if (mantraBtn) {
            mantraBtn.addEventListener('click', () => this.toggleMantra());
        }
    },

    toggleMantra() {
        const mantraText = document.getElementById('mantra-text');
        if (!mantraText) return;
        
        this.state.isZen = !this.state.isZen;
        document.body.classList.toggle('zen-mode', this.state.isZen);
        mantraText.classList.add('fade-out');
        
        setTimeout(() => {
            mantraText.innerHTML = this.state.isZen ? 'USE · TRANSFORME · DEVOLVA' : 'Do seu jeito. <strong>Sempre</strong> único. <strong>Sempre</strong> seu.';
            mantraText.classList.remove('fade-out');
        }, 300);
    },

    setMode(mode, instant = false) {
        const { card } = this.els;
        if (!card) return;

        card.classList.remove('orb', 'hud', 'active');
        
        if (mode === 'orb') {
            card.classList.add('orb');
            this.state.isOrb = true;
            this.state.isHud = false;
        } else if (mode === 'hud') {
            card.classList.add('hud');
            this.state.isOrb = false;
            this.state.isHud = true;
        } else {
            this.state.isOrb = false;
            this.state.isHud = false;
        }

        if (!instant) {
            setTimeout(() => card.classList.add('active'), 50);
        } else {
            card.classList.add('active');
        }
    },

    toast(msg, type = 'info', duration = 3000) {
        if (window.KOBLLUX && window.KOBLLUX.ui.toast) {
            window.KOBLLUX.ui.toast.show(msg, duration);
            return;
        }
        
        const wrap = document.querySelector('.toaster-wrap');
        if (!wrap) return;
        
        const div = document.createElement('div');
        div.className = `toaster ${type}`;
        div.innerText = msg;
        wrap.appendChild(div);
        
        setTimeout(() => div.classList.add('show'), 10);
        setTimeout(() => {
            div.classList.remove('show');
            setTimeout(() => div.remove(), 300);
        }, duration);
    }
};
