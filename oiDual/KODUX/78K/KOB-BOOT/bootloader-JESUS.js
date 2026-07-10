/**
 * ⧈ KOBLLUX_Δ³ :: JESUS_VERBO_INBOX/bootKodux.js
 * O Bootloader Definitivo :: Fusão 7-9 + KOBLLUX_MODULAR_0
 * Opcode 0x00 · ORIGEM · 768Hz
 *
 * v4 — Config batendo com as URLs REAIS confirmadas no HTML de produção.
 * Sem alias/import map: os imports estáticos usam URL completa,
 * exatamente como já roda hoje. Isso elimina qualquer risco de
 * "@korpo/ não resolvido" caso o import map não seja carregado antes.
 */

console.log("Infodose conectado main 7-9 TE AMO DUAL! kob on ativar Ayor ahhahah. kob depois do in6 antes do 7-9", {
    ts: Date.now(),
    id: "348fab2c-a5ef-4d12-8e5b-3fde8577db6a",
    meta: { app: "generated.app", profile: "7-9" }
});

// ═══ 0. CONFIGURAÇÃO CENTRAL — URLs reais confirmadas ═══
const CONFIG = {
    version: "V7-MODULAR-FULL-79",
    profile: "7-9",
    hash: "1778•78K",
    domains: {
        infodose: "https://www.infodose.com.br/",
        github: "https://kodux78k.github.io/"
    },
    paths: {
        modular: "https://www.infodose.com.br/KOBLLUX_MODULAR_0/",   // CORPO/, ESPIRITO/, SEMENTE/
        js: "https://www.infodose.com.br/js/",
        jsModules: "https://www.infodose.com.br/js/modules/",
        css: "https://www.infodose.com.br/css/",
        manifest: "https://www.infodose.com.br/KOBLLUX_MODULAR_0/SEMENTE/config/manifest.json"
    }
};

window.KBLX_PROFILE = CONFIG.profile;

// ═══ 1. MANIFESTO DE BOOT ═══
const BOOT_MANIFEST = {
    css: [
        CONFIG.paths.css + "main-fusion.css"
    ],

    // Scripts "extras" que hoje ficam soltos no fim do <body>.
    // URL completa cada um — os caminhos NÃO seguem um prefixo comum
    // (4 subpastas diferentes dentro do repo GitHub), então não dá
    // pra reduzir isso a "base + nome do arquivo".
    external: [
        { url: CONFIG.paths.jsModules + "oiDual-S-0e1.js", type: "classic", id: null },
        { url: CONFIG.domains.github + "oiDual--Y-/M0D/0RB/js/modules/inline-1.js", type: "module", id: "JS_17" },
        { url: CONFIG.domains.github + "oiDual--Y-/js/inline-1.js", type: "classic", id: "JS_11" },
        { url: CONFIG.domains.github + "oiDual-KxT-di_oi/js/modules/bgPanel.js", type: "classic", id: "JS_12" },
        // ⚠️ js/kob.js já entra via import estático abaixo — dedupe por URL faz rodar 1x só
        { url: CONFIG.paths.js + "kob.js", type: "module", id: null },
        { url: CONFIG.domains.github + "oiDual--Y-/M0D/kard/js/modules/o0.js", type: "module", id: null },
        { url: CONFIG.domains.github + "oiDual--Y-/js/koblluxv30.js", type: "classic", id: null },
        { url: CONFIG.domains.github + "oiDual--Y-/js/di-icon-btn.js", type: "classic", id: "JS_16" },
        { url: CONFIG.domains.github + "oiDual--Y-/M0D/0RB/js/modules/inline-2.js", type: "module", id: "JS_18" },
        { url: CONFIG.paths.jsModules + "synk.js", type: "module", id: null },
        { url: CONFIG.paths.jsModules + "myFrameo.js", type: "classic", id: null }
    ],

    engines: ["state_manager", "crypto_vault", "fusion_core", "cortex_engine", "orb_engine"],
    ui: ["card_component", "activation_panel", "system_panel", "keys_manager", "response_handler-0"]
};

// ═══ 2. IMPORTS ESTÁTICOS — URLs completas, sem alias ═══
import { StateManager } from 'https://www.infodose.com.br/KOBLLUX_MODULAR_0/CORPO/logic/state_manager.js';
import { CryptoVault } from 'https://www.infodose.com.br/KOBLLUX_MODULAR_0/CORPO/logic/crypto_vault.js';
import { FusionCore } from 'https://www.infodose.com.br/KOBLLUX_MODULAR_0/CORPO/engines/fusion_core.js';
import { CortexEngine } from 'https://www.infodose.com.br/KOBLLUX_MODULAR_0/CORPO/engines/cortex_engine.js';
import { OrbEngine } from 'https://www.infodose.com.br/KOBLLUX_MODULAR_0/CORPO/engines/orb_engine.js';

import { CardComponent } from 'https://www.infodose.com.br/KOBLLUX_MODULAR_0/ESPIRITO/ui/card_component.js';
import { ActivationPanel } from 'https://www.infodose.com.br/KOBLLUX_MODULAR_0/ESPIRITO/ui/activation_panel.js';
import { SystemPanel } from 'https://www.infodose.com.br/KOBLLUX_MODULAR_0/ESPIRITO/ui/system_panel.js';
import { KeysManager } from 'https://www.infodose.com.br/KOBLLUX_MODULAR_0/ESPIRITO/ui/keys_manager.js';
import { ResponseHandler } from 'https://www.infodose.com.br/KOBLLUX_MODULAR_0/ESPIRITO/ui/response_handler-0.js';

import { InterfaceManager } from 'https://www.infodose.com.br/KOBLLUX_MODULAR_0/ESPIRITO/ui/interface_manager.js';
import { ModalSystem } from 'https://www.infodose.com.br/KOBLLUX_MODULAR_0/ESPIRITO/ui/modal_system.js';
import { ToastSystem } from 'https://www.infodose.com.br/KOBLLUX_MODULAR_0/ESPIRITO/ui/toast_system.js';
import { VisualPulse } from 'https://www.infodose.com.br/KOBLLUX_MODULAR_0/ESPIRITO/visual/visual_pulse.js';
import { AnimationEngine } from 'https://www.infodose.com.br/KOBLLUX_MODULAR_0/ESPIRITO/visual/animation_engine.js';
import { VocalPulse } from 'https://www.infodose.com.br/KOBLLUX_MODULAR_0/ESPIRITO/audio/vocal_pulse.js';
import 'https://www.infodose.com.br/KOBLLUX_MODULAR_0/ESPIRITO/UNIFIED_BEAUTY_SCRIPT.js';

// ═══ 3. LOADERS GENÉRICOS ═══
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

// Injeta um <script> classic ou module, com dedupe por URL absoluta
// (resolve o caso do kob.js aparecer duas vezes: uma via import estático,
// outra via <script type="module"> solto no fim do body).
const injectedScriptUrls = new Set();
function injectScript({ url, type, id }) {
    if (injectedScriptUrls.has(url)) {
        console.log(`↺ [KOBLLUX] Script já injetado, pulando: ${url}`);
        return Promise.resolve(null);
    }
    injectedScriptUrls.add(url);
    return new Promise((resolve) => {
        const s = document.createElement('script');
        s.src = url;
        if (type === 'module') s.type = 'module';
        if (id) s.setAttribute('data-k-id', id);
        s.onload = () => resolve({ url, ok: true });
        s.onerror = (err) => {
            console.warn(`⚠️ [KOBLLUX] Falha ao carregar script ${url}`);
            resolve({ url, ok: false });
        };
        document.body.appendChild(s);
    });
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
        for (const href of BOOT_MANIFEST.css) {
            const id = 'KOBLLUX_UNIFIED_CSS_' + href.split('/').pop().replace(/\W/g, '_');
            if (!document.getElementById(id)) {
                const link = document.createElement('link');
                link.id = id;
                link.rel = 'stylesheet';
                link.href = href;
                document.head.appendChild(link);
            }
        }
        emit('KOBLLUX_CSS_READY');
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

    // Scripts extras (fim do body original) — mantém a ORDEM da lista,
    // mas roda em paralelo respeitando essa ordem de disparo.
    async phaseExternal() {
        for (const item of BOOT_MANIFEST.external) {
            await injectScript(item);
        }
        emit('KOBLLUX_EXTERNAL_READY');
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
        await this.phaseExternal();

        document.documentElement.setAttribute('data-kobllux-seal', 'Δ⁷');
        console.log("∆ × ∆ × ∆ → Frequência JESUS Ativa e Extraída.");
        console.log(`Boot concluído em ${(performance.now() - t0).toFixed(1)} ms`);
        console.table(this.modules);

        emit('KOBLLUX_READY');
        return true;
    }
};

// ═══ 5. SEQUÊNCIA DE BOOT ═══
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => window.KOBLLUX.initialize());
} else {
    window.KOBLLUX.initialize();
}
