/**
 * ⧈ KOBLLUX_Δ³ :: CORPO/engines/fusion_core.js
 * #python #typescript #jsonld
 * Núcleo de Processamento de IA e Orquestração MetaPulso
 */

//  KOBLLUX_Δ³ :: CORPO/engines/fusion_core.js (CORRIGIDO)

export const FusionCore = {
    state: {
        isReady: false,
        metaData: null,
        config: {
            languages: ['python', 'typescript', 'rust', 'cpp', 'glsl', 'bash', 'jsonld']
        } 
    },

    async init() {
        console.log(" FusionCore :: Ativando Motores...");
        try {
            this.state.metaData = await this.loadMetaPulso();
            this.state.isReady = true;
            return true;
        } catch (e) {
            console.error("FusionCore Init Error: ", e);
            return false;
        }
    },

    // Motor de Dados (MetaPulso) - PATHS CORRIGIDOS

    


    async loadMetaPulso() {
        // Lista de paths possíveis (ordem de tentativa)
        const paths = [
            // Path absoluto a partir da raiz do servidor
            'https://www.infodose.com.br/KOBLLUX_MODULAR/SEMENTE/config/metapulso_70_combinacoes.json',
            'https://www.infodose.com.br/KOBLLUX_MODULAR/metapulso_70_combinacoes.json',
            // Paths relativos usando import.meta.url
            new URL('https://www.infodose.com.br/KOBLLUX_MODULAR_0/SEMENTE/config/metapulso_70_combinacoes.json', import.meta.url).href,
            new URL('../../../metapulso_70_combinacoes.json', import.meta.url).href,
            // Fallbacks relativos tradicionais
            './SEMENTE/config/metapulso_70_combinacoes.json',
            '../SEMENTE/config/metapulso_70_combinacoes.json',
            '../../SEMENTE/config/metapulso_70_combinacoes.json'
        ];

        for (const path of paths) {
            try {
                console.log(` FusionCore: Tentando carregar ${path}`);
                const response = await fetch(path);
                if (response.ok) {
                    console.log(`✅ FusionCore: MetaPulso carregado com sucesso`);
                    return await response.json();
                }
                console.warn(`️ FusionCore: ${path} retornou status ${response.status}`);
            } catch (e) {
                console.warn(`⚠️ FusionCore: Erro ao carregar ${path} - ${e.message}`);
            }
        }

        throw new Error("MetaPulso JSON não encontrado em nenhum path disponível");
    
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
