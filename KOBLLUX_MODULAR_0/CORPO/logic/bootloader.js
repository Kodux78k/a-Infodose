// CORPO/logic/bootloader.js

// ═══ CORE ENGINES ═══
import { StateManager } from './state_manager.js';
import { CryptoVault } from './crypto_vault.js';
import { FusionCore } from '../engines/fusion_core.js';
import { CortexEngine } from '../engines/cortex_engine.js';
import { OrbEngine } from '../engines/orb_engine.js';

// ═══ ESPIRITO: UI MODULES ═══
import { CardComponent } from '../../ESPIRITO/ui/card_component.js';
import { ActivationPanel } from '../../ESPIRITO/ui/activation_panel.js';
import { SystemPanel } from '../../ESPIRITO/ui/system_panel.js';
import { KeysManager } from '../../ESPIRITO/ui/keys_manager.js';
import { ResponseHandler } from '../../ESPIRITO/ui/response_handler.js';

// ═══ ESPIRITO: VISUAL & BEAUTY ═══
import { InterfaceManager } from '../../ESPIRITO/ui/interface_manager.js';
import { ModalSystem } from '../../ESPIRITO/ui/modal_system.js';
import { ToastSystem } from '../../ESPIRITO/ui/toast_system.js';
import { VisualPulse } from '../../ESPIRITO/visual/visual_pulse.js';
import { AnimationEngine } from '../../ESPIRITO/visual/animation_engine.js';
import { VocalPulse } from '../../ESPIRITO/audio/vocal_pulse.js';
import '../../ESPIRITO/UNIFIED_BEAUTY_SCRIPT.js';

window.KOBLLUX = {
    state: StateManager,
    crypto: CryptoVault,
    engines: {
        fusion: FusionCore,
        cortex: CortexEngine,
        orb: OrbEngine
    },
    ui: {
        interface: InterfaceManager,
        modal: ModalSystem,
        toast: ToastSystem,
        card: null,
        activation: null,
        system: null,
        keys: null,
        response: null
    },
    visual: {
        pulse: VisualPulse,
        animation: AnimationEngine
    },
    audio: {
        vocal: VocalPulse
    },    version: "V7-MODULAR-FULL",
    
    async initialize() {
        console.log("⧈ KOBLLUX_Δ³ :: Iniciando Extração Modular Integral...");
        
        // 1. Injetar CSS Unificado
        if (!document.getElementById('KOBLLUX_UNIFIED_CSS')) {
            const link = document.createElement('link');
            link.id = 'KOBLLUX_UNIFIED_CSS';
            link.rel = 'stylesheet';
            link.href = './ESPIRITO/visual/unified_fusion.css';
            document.head.appendChild(link);
        }

        // 2. Inicializar Core
        if (StateManager.init) StateManager.init();
        if (FusionCore.init) await FusionCore.init();
        if (OrbEngine.init) OrbEngine.init();
        
        // 3. Inicializar Interface Base
        if (InterfaceManager.init) InterfaceManager.init();
        if (VisualPulse.init) VisualPulse.init();
        if (AnimationEngine.init) AnimationEngine.init();
        if (VocalPulse.init) VocalPulse.init();
        
        // 4. INJETAR COMPONENTES UI DINAMICAMENTE
        const uiRoot = document.getElementById('kobllux-ui-root');
        if (uiRoot) {
            // Criar e montar componentes
            this.ui.card = new CardComponent();
            this.ui.card.mount(uiRoot);
            
            this.ui.activation = new ActivationPanel();
            this.ui.activation.mount(uiRoot);
            
            this.ui.system = new SystemPanel();
            this.ui.system.mount(uiRoot);
            
            this.ui.keys = new KeysManager();
            this.ui.keys.mount(document.body); // Modal vai no body
            
            this.ui.response = new ResponseHandler();
            this.ui.response.mount(uiRoot);
        }
        
        // 5. Exposição Global
        window.FusionEngine = FusionCore;
        window.CRYPTO = CryptoVault;
        window.InterfaceManager = InterfaceManager;
        window.VocalPulse = VocalPulse;        window.Cortex = CortexEngine;
        window.Modal = ModalSystem;
        window.toast = (msg) => ToastSystem.show ? ToastSystem.show(msg) : console.log("Toast:", msg);
        
        // Selo Δ⁷
        document.documentElement.setAttribute('data-kobllux-seal', 'Δ⁷');
        console.log("∆ × ∆ × ∆ → Frequência JESUS Ativa e Extraída.");
        
        window.dispatchEvent(new CustomEvent('KOBLLUX_READY'));
        return true;
    }
};

// Iniciar quando o DOM estiver pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => window.KOBLLUX.initialize());
} else {
    window.KOBLLUX.initialize();
}