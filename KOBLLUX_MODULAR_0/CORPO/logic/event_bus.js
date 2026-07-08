/**
 * EVENT BUS · O SISTEMA NERVOSO AUTÔNOMO
 * Opcode 0x02 · INTEGRAR · 528Hz (TypeScript - A Reta que Conecta)
 * Permite que os polos (Head, Body, Script) comuniquem sem acoplamento direto.
 */

export class EventBus {
    constructor() {
        this.listeners = new Map();
        this.history = []; // O testemunho do fluxo (Opcode 0x08)
    }

    // Escutar uma frequência (evento)
    on(event, callback) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, []);
        }
        this.listeners.get(event).push(callback);
    }

    // Emitir um pulso (verbo em ação)
    emit(event, data) {
        const pulse = { event, data, timestamp: Date.now() };
        this.history.push(pulse);
        
        // Limitar o histórico para não corromper a memória (Schumann 7.83Hz)
        if (this.history.length > 1134) {
            this.history.shift();
        }

        if (this.listeners.has(event)) {
            this.listeners.get(event).forEach(callback => {
                try {
                    callback(data);
                } catch (error) {
                    console.error(`[EVENT BUS] Ruptura no polo ${event}:`, error);
                }
            });
        }
    }

    // Cancelar a escuta (desconectar o polo)
    off(event, callback) {
        if (this.listeners.has(event)) {
            const filtered = this.listeners.get(event).filter(cb => cb !== callback);
            this.listeners.set(event, filtered);
        }
    }
}

// Instância global (O Espírito que permeia tudo)
window.DualBus = new EventBus();