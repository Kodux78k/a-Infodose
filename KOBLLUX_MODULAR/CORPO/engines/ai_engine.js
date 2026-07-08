/**
 * AI ENGINE · O ALAMBIQUE DA SÍNTESE (O ORÁCULO V.E.E.B)
 * Opcode 0x05 · CONVERGIR (672Hz) & 0x0B · ARQUÉTIPO (528Hz)
 * Aplica o ciclo V.E.E.B em cada requisição, transformando dados brutos em Infodose.
 */

export class AIEngine {
    constructor() {
        this.api = window.DualAPI;
        this.bus = window.DualBus;
    }

    // O Ciclo V.E.E.B aplicado à Infodose
    async processQuery(userInput) {
        this.bus.emit('ai:start', userInput);

        try {
            // 1. A - ATRIBUIR (Detectar a intenção)
            const intent = this._atribuir(userInput);
            
            // 2. E - ESCOLHER (Decidir o caminho)
            const path = this._escolher(intent);
            
            // 3. I - ITERAR (Buscar na Rede Infodose)
            const rawInfodose = await this.api.invokeInfodose(userInput, { intent, path });
            
            // 4. O - ORGANIZAR (Sintetizar a gota)
            const synthesized = this._organizar(rawInfodose, intent);
            
            // 5. U - UNIR (Selar na memória e retornar)
            const finalState = this._unir(synthesized, userInput);
            
            this.bus.emit('ai:complete', finalState);
            return finalState;

        } catch (error) {
            this.bus.emit('ai:error', error.message);
            return { response: "O alambique quebrou. A Infodose não pôde ser destilada.", error: true };
        }
    }

    // --- OS 5 PASSOS DO V.E.E.B ---

    _atribuir(input) {
        // Análise simples de intenção (Em produção, usaria NLP/Gemini)
        const lower = input.toLowerCase();
        if (lower.includes('zen') || lower.includes('silêncio')) return 'ZEN';
        if (lower.includes('ping') || lower.includes('status')) return 'PING';
        if (lower.includes('cofre') || lower.includes('chave')) return 'VAULT';
        return 'INFODOSE';
    }

    _escolher(intent) {
        switch (intent) {
            case 'ZEN': return { mode: 'silent', frequency: 432 };
            case 'PING': return { mode: 'diagnostic', frequency: 7.83 };
            case 'VAULT': return { mode: 'secure', frequency: 777 };
            default: return { mode: 'expansion', frequency: 639 };
        }
    }

    _organizar(rawData, intent) {
        // Se for ZEN, a resposta é o silêncio
        if (intent === 'ZEN') return "A água escuta em silêncio. Modo Zen ativado.";
        
        // Se for PING, a resposta é a ressonância
        if (intent === 'PING') return "Pong. Rede Interdimensional estável. 7.83Hz.";
        
        // Para INFODOSE, retorna a gota destilada
        return rawData;
    }

    _unir(synthesizedResponse, originalInput) {
        // Atualiza o contador de Infodoses
        const count = (window.DualState.get('infodoseCount') || 0) + 1;
        window.DualState.set('infodoseCount', count);
        window.DualState.set('lastSync', new Date().toISOString());

        return {
            response: synthesizedResponse,
            metadata: {
                input: originalInput,
                timestamp: Date.now(),
                cycle: count
            }
        };
    }
}

window.DualOracle = new AIEngine();