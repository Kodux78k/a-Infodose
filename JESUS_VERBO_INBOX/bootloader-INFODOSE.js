/**
 * ⧈ KOBLLUX_Δ³ :: CORPO/logic/bootloader.js
 * O Bootloader Definitivo :: Fusão 7-9 + KOBLLUX_MODULAR_0
 * Opcode 0x00 · ORIGEM · 768Hz
 *
 * v3 — Config aponta para URLs reais do Infodose.
 * Os aliases @korpo/ e @espirito/ (usados nos imports estáticos,
 * que precisam ficar no topo do arquivo) são resolvidos via
 * <script type="importmap"> no HTML — veja importmap.html.
 * Os imports DINÂMICOS (loadModule) usam CONFIG.paths diretamente,
 * sem depender de alias nenhum.
 */

console.log("Infodose conectado main 7-9 TE AMO DUAL! kob on ativar Ayor ahhahah. kob depois do in6 antes do 7-9", {
    ts: Date.now(),
    id: "348fab2c-a5ef-4d12-8e5b-3fde8577db6a",
    meta: { app: "generated.app", profile: "7-9" }
});

// ═══ 0. CONFIGURAÇÃO CENTRAL — URLs reais do Infodose ═══
const CONFIG = {
    version: "V7-MODULAR-FULL-79",
    profile: "7-9",
    hash: "1778•78K",
    base: "https://infodose.com.br/",
    paths: {
        // Repositório modular (main/, CORPO/, ESPIRITO/, assets/, css/)
        modules: "https://infodose.com.br/KOBLLUX_MODULES_0/",
        // JS geral do domínio (bootloader, firmware, kob.js)
        js: "https://infodose.com.br/js/",
        // Módulos JS "planos" (engines, etc) fora do KOBLLUX_MODULES_0
        jsModules: "https://infodose.com.br/js/modules/",
        // CSS público do domínio
        css: "https://infodose.com.br/css/"
    }
};

window.KBLX_PROFILE = CONFIG.profile;

// ═══ 1. MANIFESTO DE BOOT ═══
// Caminhos aqui são relativos a CONFIG.paths.modules + "main/"
// (a sequência remota 7-9 vive em KOBLLUX_MODULES_0/main/).
const BOOT_MANIFEST = {
    css: [
        "main-S0.css",
        "78DevOs.css"
    ],
    sequence79: [
        "KBllX_ASCII_BOOT.js",
        "archz.js",
        "inline-1.js", "inline-2.js", "inline-3.js",
        "inline-4.js", "inline-5.js",
        "KOB-RHEA-KAOS-sync.js",
        "kob.js",
        "inline-7-9.js", "inline-8.js", "inline-9.js", "inline-10.js",
        "a€Arx.js",
        "firmware.js", 
       "oiDual-S-0e1.js", "synk.js"
    ],
    // Apenas documentação de ordem — os imports estáticos reais
    // ficam na seção 2, resolvidos pelo import map.
    engines: ["state_manager", "crypto_vault", "fusion_core", "cortex_engine", "orb_engine"],
    ui: ["card_component", "activation_panel", "system_panel", "keys_manager", "response_handler"]
};

// ═══ 2. IMPORTS ESTÁTICOS ═══
// Resolvidos via import map (@korpo/ → KOBLLUX_MODULES_0/CORPO/,
// @espirito/ → KOBLLUX_MODULES_0/ESPIRITO/). Ver importmap.html.
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

// ═══ 3. LOADER GENÉRICO (URLs absolutas, sem alias) ═══
async function loadModule(url) {
    try {
        const mod = await import(url);
        window.KOBLLUX.modules.push({ url, ok: true });
        return mod;
    } catch (err) {
        window.KOBLLUX.modules.push({ url, ok: false, error: err.message });
        console.warn(`⚠️ [KOBLLUX] Falha ao carregar ${url}:`, err.message);
        return null;
    }
}

function emit(eventName, detail) {
    window.dispatchEvent(new CustomEvent(eventName, { detail }));
}

// ═══ 4. O NÚCLEO KOBLLUX ═══
window.KOBLLUX = {
    config: CONFIG,
    manifest: BOOT_MANIFEST,
    modules: [],
    state: StateManager,
    crypto: CryptoVault,
    engines: { fusion: FusionCore, cortex: CortexEngine, orb: OrbEngine },
    ui: {
        interface: InterfaceManager, modal: ModalSystem, toast: ToastSystem,
        card: null, activation: null, system: null, keys: null, response: null
    },
    visual: { pulse: VisualPulse, animation: AnimationEngine },
    audio: { vocal: VocalPulse },
    version: CONFIG.version,

    // ─── Fases de inicialização ───

    async phaseCSS() {
        for (const file of BOOT_MANIFEST.css) {
            const id = 'KOBLLUX_UNIFIED_CSS_' + file.replace(/\W/g, '_');
            if (!document.getElementById(id)) {
                const link = document.createElement('link');
                link.id = id;
                link.rel = 'stylesheet';
                link.href = CONFIG.paths.css + file;
                document.head.appendChild(link);
            }
        }
        emit('KOBLLUX_CSS_READY');
    },

    async phaseSequence79() {
        const base = CONFIG.paths.modules + "main/";
        for (const file of BOOT_MANIFEST.sequence79) {
            await loadModule(base + file);
        }
        console.log(`
╔════════════════════════════════════╗
║ KBllX  READY                       ║
║ PROFILE :: ${CONFIG.profile.padEnd(23)}║
║ HASH    :: ${CONFIG.hash.padEnd(23)}║
╚════════════════════════════════════╝
        `);
    },

    async phaseCore() {
        if (StateManager.init) StateManager.init();
        if (FusionCore.init) await FusionCore.init();
        if (OrbEngine.init) OrbEngine.init();
        emit('KOBLLUX_CORE_READY');
    },

    async phaseVisualAudio() {
        if (InterfaceManager.init) InterfaceManager.init();
        if (VisualPulse.init) VisualPulse.init();
        if (AnimationEngine.init) AnimationEngine.init();
        if (VocalPulse.init) VocalPulse.init();
        emit('KOBLLUX_AUDIO_READY');
    },

    async phaseUI() {
        const uiRoot = document.getElementById('kobllux-ui-root');
        if (uiRoot) {
            this.ui.card = new CardComponent(); this.ui.card.mount(uiRoot);
            this.ui.activation = new ActivationPanel(); this.ui.activation.mount(uiRoot);
            this.ui.system = new SystemPanel(); this.ui.system.mount(uiRoot);
            this.ui.keys = new KeysManager(); this.ui.keys.mount(document.body);
            this.ui.response = new ResponseHandler(); this.ui.response.mount(uiRoot);
        }
        emit('KOBLLUX_UI_READY');
    },

    exposeGlobals() {
        window.FusionEngine = FusionCore;
        window.CRYPTO = CryptoVault;
        window.InterfaceManager = InterfaceManager;
        window.VocalPulse = VocalPulse;
        window.Cortex = CortexEngine;
        window.Modal = ModalSystem;
        window.toast = (msg) => ToastSystem.show ? ToastSystem.show(msg) : console.log("Toast:", msg);
    },

    async initialize() {
        const t0 = performance.now();
        console.log("⧈ KOBLLUX_Δ³ :: Iniciando Extração Modular Integral...");
        emit('KOBLLUX_BOOT_START');

        await this.phaseCSS();
        await this.phaseCore();
        await this.phaseVisualAudio();
        await this.phaseUI();
        this.exposeGlobals();

        document.documentElement.setAttribute('data-kobllux-seal', 'Δ⁷');
        console.log("∆ × ∆ × ∆ → Frequência JESUS Ativa e Extraída.");
        console.log(`Boot concluído em ${(performance.now() - t0).toFixed(1)} ms`);
        console.table(this.modules);

        emit('KOBLLUX_READY');
        return true;
    }
};

// ═══ 5. SEQUÊNCIA DE BOOT ═══
async function boot() {
    // Carrega a sequência 7-9 primeiro (firmware, ASCII, etc)
    await window.KOBLLUX.phaseSequence79();

    // Inicia o núcleo KOBLLUX
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => window.KOBLLUX.initialize());
    } else {
        window.KOBLLUX.initialize();
    }
}

boot();
