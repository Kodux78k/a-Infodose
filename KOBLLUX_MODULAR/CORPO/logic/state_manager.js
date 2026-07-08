/**
 * ⧈ KOBLLUX_Δ³ :: CORPO/logic/state_manager.js
 * #typescript
 * Gestão Central de Estado e Sincronização
 */
export const StateManager = {
    state: {
        user: { name: "PILOTO", id: "001" },
        triad: { color: 'Azul', essence: 'Silêncio', element: 'Água' },
        cortex: { crystals: [], matrices: [] },
        ui: { mode: 'normal', theme: 'dark' }
    },

    init() {
        console.log("StateManager: Ativado");
        this.loadLocalState();
    },

    loadLocalState() {
        const saved = localStorage.getItem('KOBLLUX_STATE');
        if (saved) {
            this.state = { ...this.state, ...JSON.parse(saved) };
        }
    },

    saveState() {
        localStorage.setItem('KOBLLUX_STATE', JSON.stringify(this.state));
    },

    update(path, value) {
        const parts = path.split('.');
        let current = this.state;
        for (let i = 0; i < parts.length - 1; i++) {
            current = current[parts[i]];
        }
        current[parts[parts.length - 1]] = value;
        this.saveState();
        this.notify(path, value);
    },

    notify(path, value) {
        // Usa o EventBus global se disponível, senão CustomEvent
        if (window.DualBus) {
            window.DualBus.emit('state:changed', { path, value });
        } else {
            window.dispatchEvent(new CustomEvent('kobllux-state-change', { 
                detail: { path, value } 
            }));
        }
    }
};