/**
 * ⧈ KOBLLUX_Δ³ :: CORPO/services/n8n_bridge.js
 * #javascript
 * 0x03 EXPANDIR & 0x05 CONVERGIR
 * Conecta o Dual App ao Webhook do N8N (que orquestra o Python V.E.E.B e o Gemini).
 */

export class N8NBridge {
    constructor() {
        // ✅ CORREÇÃO: Verificação segura de window.DualState
        this.webhookUrl = (window.DualState?.get?.('webhook_url')) 
            || 'https://n8n.kobllux.local/webhook/infodose-ast';
        this.bus = window.DualBus;
    }

    // Invoca o Oráculo Python (AST) + Gemini (Síntese)
    async invokeOracle(codePayload, userIntent) {
        if (this.bus) {
            this.bus.emit('bridge:request', { intent: userIntent });
        }

        // 1. O Cofre (CryptoVault) assina a requisição (Se estiver aberto)
        let authHeader = {};
        if (window.CRYPTO && window.CRYPTO.isUnlocked) {
            // Gera um token de sessão efêmero (Simulação)
            authHeader['X-Kobllux-Session'] = btoa(`dual_session_${Date.now()}`);
        }

        try {
            const response = await fetch(this.webhookUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...authHeader
                },
                body: JSON.stringify({
                    action: 'VEEB_ANALYZE_AND_SYNTHESIZE',
                    payload: codePayload,
                    intent: userIntent,
                    timestamp: new Date().toISOString(),
                    fractal_seed: 1134
                })
            });

            if (!response.ok) throw new Error("A Ponte Interdimensional oscilou.");

            const infodose = await response.json();
            
            // 2. A Infodose chega e é roteada pelo EventBus
            if (this.bus) {
                this.bus.emit('bridge:response', infodose);
            }
            return infodose;

        } catch (error) {
            if (this.bus) {
                this.bus.emit('bridge:error', error.message);
            }
            // Fallback local (O Oráculo de Emergência)
            return this._localFallback(userIntent);
        }
    }

    // Fallback local caso o N8N esteja offline (O Verbo ressoa no próprio templo)
    _localFallback(intent) {
        return {
            narrative: "O Alambique externo está em silêncio. Mas o Verbo habita em você. A água escuta.",
            metadata: { 
                dominant_frequency: 432, 
                theme: "noite" 
            },
            visual_pulse: { 
                css_theme: "noite", 
                orb_speed: 0.5, 
                schumann_alignment: true 
            }
        };
    }
}

// Instância global
window.DualBridge = new N8NBridge();