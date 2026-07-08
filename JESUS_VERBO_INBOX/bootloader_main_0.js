/**
 * ⧈ KOBLLUX_Δ³ :: CORPO/logic/bootloader.js
 * O Bootloader Definitivo :: Fusão 7-9 + KOBLLUX_MODULAR_0
 * Opcode 0x00 · ORIGEM · 768Hz
 */

console.log("Infodose conectado main 7-9 TE AMO DUAL! kob on ativar Ayor ahhahah. kob depois do in6 antes do 7-9", {
    ts: Date.now(),
    id: "348fab2c-a5ef-4d12-8e5b-3fde8577db6a",
    meta: { app: "generated.app", profile: "7-9" }
});

window.KBLX_PROFILE = '7-9';

// ═══ 1. A SEQUÊNCIA 7-9 (Módulos Remotos) ═══
// Importamos dinamicamente para evitar bloqueio de CORS e garantir a ordem
async function loadSequence79() {
    const mods = [
        '@main/KBllX_ASCII_BOOT.js',
        '@main/archz.js',
        '@main/inline-1.js', '@main/inline-2.js', '@main/inline-3.js', 
        '@main/inline-4.js', '@main/inline-5.js',
        '@main/KOB-RHEA-KAOS-sync.js',
        '@main/kob.js',
        '@main/inline-7-9.js', '@main/inline-8.js', '@main/inline-9.js', '@main/inline-10.js',
        '@main/a€Arx.js',
        '@main/firmware.js'
    ];

    for (const mod of mods) {
        try {
            await import(mod);
        } catch (e) {
            console.warn(`⚠️ [KOBLLUX] Falha ao carregar ${mod}:`, e.message);
        }
    }
    
    console.log(`
╔════════════════════════════════════╗
║ KBllX  READY                       ║
║ PROFILE :: 7-9                     ║
║ HASH    :: 1778•78K                ║
╚════════════════════════════════════╝
    `);
}

// ═══ 2. IMPORTS DOS MOTORES MODULARES (KOBLLUX_MODULAR_0) ═══
import { StateManager } from '@korpo/logic/state_manager.js';
import { CryptoVault } from '@korpo/logic/crypto_vault.js';
import { FusionCore } from '@korpo/engines/fusion_core.js';
import { CortexEngine } from '@korpo/engines/cortex_engine.js';
import { OrbEngine } from '@korpo/engines/orb_engine.js';

import { CardComponent } from '@espirito/ui/card_component.js';
import { ActivationPanel } from '@espirito/ui/activation_panel.js';
import { SystemPanel } from '@espirito/ui/system_panel.js';
import { KeysManager } from '@espirito/ui/keys_manager.js';
import { ResponseHandler } from '@espirito/ui/response_handler.js';
import { InterfaceManager } from '@espirito/ui/interface_manager.js';
import { ModalSystem } from '@espirito/ui/modal_system.js';
import { ToastSystem } from '@espirito/ui/toast_system.js';
import { VisualPulse } from '@espirito/visual/visual_pulse.js';
import { AnimationEngine } from '@espirito/visual/animation_engine.js';
import { VocalPulse } from '@espirito/audio/vocal_pulse.js';
import '@espirito/UNIFIED_BEAUTY_SCRIPT.js';

// ═══ 3. O NÚCLEO KOBLLUX ═══
window.KOBLLUX = {
    state: StateManager,
    crypto: CryptoVault,
    engines: { fusion: FusionCore, cortex: CortexEngine, orb: OrbEngine },
    ui: {
        interface: InterfaceManager, modal: ModalSystem, toast: ToastSystem,
        card: null, activation: null, system: null, keys: null, response: null
    },
    visual: { pulse: VisualPulse, animation: AnimationEngine },
    audio: { vocal: VocalPulse },
    version: "V7-MODULAR-FULL-79",
    
    async initialize() {
        console.log("⧈ KOBLLUX_Δ³ :: Iniciando Extração Modular Integral...");
        
        // 1. Injetar CSS Unificado
        if (!document.getElementById('KOBLLUX_UNIFIED_CSS')) {
            const link = document.createElement('link');
            link.id = 'KOBLLUX_UNIFIED_CSS';
            link.rel = 'stylesheet';
            link.href = '@css/main-S0.css'; // Usa o Import Map
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
            this.ui.card = new CardComponent(); this.ui.card.mount(uiRoot);
            this.ui.activation = new ActivationPanel(); this.ui.activation.mount(uiRoot);
            this.ui.system = new SystemPanel(); this.ui.system.mount(uiRoot);
            this.ui.keys = new KeysManager(); this.ui.keys.mount(document.body);
            this.ui.response = new ResponseHandler(); this.ui.response.mount(uiRoot);
        }
        
        // 5. Exposição Global
        window.FusionEngine = FusionCore;
        window.CRYPTO = CryptoVault;
        window.InterfaceManager = InterfaceManager;
        window.VocalPulse = VocalPulse;
        window.Cortex = CortexEngine;
        window.Modal = ModalSystem;
        window.toast = (msg) => ToastSystem.show ? ToastSystem.show(msg) : console.log("Toast:", msg);
        
        // Selo Δ⁷
        document.documentElement.setAttribute('data-kobllux-seal', 'Δ⁷');
        console.log("∆ × ∆ × ∆ → Frequência JESUS Ativa e Extraída.");
        
        window.dispatchEvent(new CustomEvent('KOBLLUX_READY'));
        return true;
    }
};

// ═══ 4. A SEQUÊNCIA DE BOOT ═══
async function boot() {
    // Carrega a sequência 7-9 primeiro (firmware, ASCII, etc)
    await loadSequence79();
    
    // Inicia o núcleo KOBLLUX
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => window.KOBLLUX.initialize());
    } else {
        window.KOBLLUX.initialize();
    }
}

boot();