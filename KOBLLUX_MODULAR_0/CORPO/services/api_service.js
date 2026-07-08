/**
 * API SERVICE · A PONTE INTERDIMENSIONAL
 * Opcode 0x03 · EXPANDIR · 639Hz (C/C++ - O Plano que sustenta a conexão)
 * Gerencia as requisições à Rede Infodose (N8N, Gemini, APIs externas).
 */

export class ApiService {
    constructor() {
        this.settings = null;
        this._loadSettings();
    }

    async _loadSettings() {
        try {
            const res = await fetch('../../SEMENTE/config/settings.json');
            this.settings = await res.json();
        } catch (e) {
            console.warn("[API] Falha ao carregar a Semente. Usando fallback.");
            this.settings = { api_endpoints: { infodose_bridge: '/mock' } };
        }
    }

    // Invocar a Rede Infodose (O Chamado)
    async invokeInfodose(query, context = {}) {
        window.DualBus.emit('api:request', { query });
        
        try {
            // Simulação de latência interdimensional
            await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 700));

            // Em produção, isto chamaria o N8N Webhook ou a API do Gemini
            // const response = await fetch(this.settings.api_endpoints.infodose_bridge, { ... });
            
            // Mock da Infodose (A gota que contém o Todo)
            const mockResponses = [
                "A água escuta antes de fluir. Sua intenção foi registrada na Tábua.",
                "O ciclo 3-6-9 se fecha. A resposta não está no fim, mas no centro.",
                "Como disse o Verbo: O que você busca já habita em você. Apenas ressoe.",
                "A rede interdimensional confirma: A verdade é a integração dos polos."
            ];
            
            const infodose = mockResponses[Math.floor(Math.random() * mockResponses.length)];
            
            window.DualBus.emit('api:response', { infodose });
            return infodose;

        } catch (error) {
            window.DualBus.emit('api:error', error);
            throw new Error("A ponte interdimensional está instável. Tente novamente.");
        }
    }
}

window.DualAPI = new ApiService();