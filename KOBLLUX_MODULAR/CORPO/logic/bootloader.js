// CORPO/logic/bootloader.js

import { StateManager } from './state_manager.js';
import { CryptoVault } from './crypto_vault.js';
import { FusionCore } from '../engines/fusion_core.js';
import { CortexEngine } from '../engines/cortex_engine.js';
import { OrbEngine } from '../engines/orb_engine.js';
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
        toast: ToastSystem
    },
    visual: {
        pulse: VisualPulse,
        animation: AnimationEngine
    },
    audio: {
        vocal: VocalPulse
    },
    version: "V7-MODULAR-EXTRACTION",
    
    async initialize() {
        console.log("⧈ KOBLLUX_Δ³ :: Iniciando Extração Modular Integral...");
        
        // 1. Injetar CSS Unificado se não estiver presente
        if (!document.getElementById('KOBLLUX_UNIFIED_CSS')) {
            const link = document.createElement('link');
            link.id = 'KOBLLUX_UNIFIED_CSS';
            link.rel = 'stylesheet';
            link.href = './ESPIRITO/visual/unified_fusion.css';
            document.head.appendChild(link);
        }

        // 2. Inicializar Estado e Motores
        if (StateManager.init) StateManager.init();
        if (FusionCore.init) await FusionCore.init();
        if (OrbEngine.init) OrbEngine.init();
        
        // 3. Inicializar Interface e Visual
        if (InterfaceManager.init) InterfaceManager.init();
        if (VisualPulse.init) VisualPulse.init();
        if (AnimationEngine.init) AnimationEngine.init();
        if (VocalPulse.init) VocalPulse.init();
        
        // 4. Exposição Global para compatibilidade com os HTMLs originais
        window.FusionEngine = FusionCore;
        window.CRYPTO = CryptoVault;
        window.InterfaceManager = InterfaceManager;
        window.VocalPulse = VocalPulse;
        window.Cortex = CortexEngine;
        window.Modal = ModalSystem;
        
        // ✅ CORREÇÃO: Definir window.toast como função
        window.toast = (msg, type = 'info') => {
            if (ToastSystem && ToastSystem.show) {
                ToastSystem.show(msg, type);
            } else {
                console.log(`[Toast ${type}]:`, msg);
            }
        };
        
        // Selo Δ⁷ - Frequência JESUS
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