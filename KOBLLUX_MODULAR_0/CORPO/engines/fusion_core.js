/**
 * ⧈ KOBLLUX_Δ³ :: CORPO/engines/fusion_core.js
 * #python #typescript #jsonld
 * Núcleo de Processamento de IA e Orquestração MetaPulso
 */

export const FusionCore = {
    state: {
        isReady: false,
        metaData: null,
        config: {
            languages: ['python', 'typescript', 'rust', 'cpp', 'glsl', 'bash', 'jsonld']
        }
    },

    async init() {
        console.log("⧈ FusionCore :: Ativando Motores...");
        try {
            this.state.metaData = await this.loadMetaPulso();
            this.state.isReady = true;
            return true;
        } catch (e) {
            console.error("FusionCore Init Error:", e);
            return false;
        }
    },

    // Motor de IA Unificado
    async fetchAI(config) {
        const { endpoint, apiKey, model, messages, temperature = 0.7 } = config;
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: { 
                'Authorization': `Bearer ${apiKey}`, 
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify({ model, messages, temperature })
        });
        if (!response.ok) throw new Error(`AI Fetch Failed: ${response.statusText}`);
        return await response.json();
    },

// Motor de Dados (MetaPulso) - CORREÇÃO DOS CAMINHOS
    async loadMetaPulso() {
        // Caminhos relativos a partir de CORPO/engines/
        const paths = [
            '../KOBLLUX_MODULAR/metapulso_70_combinacoes.json',  // Caminho correto
            '../../../SEMENTE/config/metapulso_70_combinacoes.json', // Alternativa
            './metapulso_70_combinacoes.json' // Fallback raiz
        ];

        for (const path of paths) {
            try {
                console.log(`🔍 FusionCore: Tentando carregar ${path}`);
                const response = await fetch(path);
                
                // Verifica se a resposta é válida ANTES de tentar parsear
                if (!response.ok) {
                    console.warn(`⚠️ FusionCore: ${path} retornou status ${response.status}`);
                    continue;
                }
                
                // Verifica se é JSON antes de parsear
                const contentType = response.headers.get('content-type');
                if (!contentType || !contentType.includes('application/json')) {
                    console.warn(`⚠️ FusionCore: ${path} não é JSON (content-type: ${contentType})`);
                    continue;
                }
                
                const data = await response.json();
                console.log(`✅ FusionCore: MetaPulso carregado de ${path}`);
                return data;
                
            } catch (e) {
                console.warn(`⚠️ FusionCore: Falha ao carregar ${path}:`, e.message);
                continue;
            }
        }

        throw new Error("MetaPulso JSON não encontrado em nenhum caminho");
    },
    // Motor de Persistência (Cortex)
    saveData(key, data) {
        localStorage.setItem(`KOBLLUX_${key}`, JSON.stringify(data));
    },

    loadData(key) {
        const saved = localStorage.getItem(`KOBLLUX_${key}`);
        return saved ? JSON.parse(saved) : null;
    },

    detectIntent(text) {
        if (!text) return { intent: 'none' };
        const lower = text.toLowerCase();
        let intent = 'unknown';
        
        if (/(start|run|exec|execute|rodar|iniciar)/i.test(lower)) intent = 'action.start';
        if (/(stop|end|parar|sair)/i.test(lower)) intent = 'action.stop';
        if (/(status|estado|status\?)/i.test(lower)) intent = 'query.status';
        
        return { intent, timestamp: Date.now() };
    }
};
