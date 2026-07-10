// SEMENTE/bootloader.js
// ─────────────────────────────────────────────────────────────
// KOBLLUX Bootloader · versão config-driven, manifest-based.
// Funde o "Canivete Suíço" (HTML monolítico) com ResponseHandler
// em um orquestrador único com fases nomeadas e injectScript()
// deduplicador. Dispara eventos de ciclo de vida em cada fase.
//
// Uso:
//   import { boot } from './SEMENTE/bootloader.js';
//   boot(MANIFEST);
// ─────────────────────────────────────────────────────────────

import { ResponseHandler } from 'https://www.infodose.com.br/KOBLLUX_MODULAR_0/ESPIRITO/ui/response_handler.js';
import { SwissKnifeUI } from 'https://www.infodose.com.br/KOBLLUX_MODULAR_0/ESPIRITO/ui/swiss_knife.js';
import { FractalEngine369 } from 'https://www.infodose.com.br/KOBLLUX_MODULAR_0/ESPIRITO/core/fractal_engine.js';
import { initBodyThemeSync } from 'https://www.infodose.com.br/KOBLLUX_MODULAR_0/ESPIRITO/core/body_theme_sync.js';

// ── MANIFEST PADRÃO (sobrescrevível na chamada de boot()) ────
export const DEFAULT_MANIFEST = {
    css: [
        'https://fonts.googleapis.com/css2?family=Inter:wght@200;400;500;600;800&family=JetBrains+Mono:wght@400;700&display=swap',
        'https://www.infodose.com.br/css/main.css'
    ],
    externalScripts: [
        { src: 'https://unpkg.com/lucide@latest', id: 'JS_0' },
        { src: 'https://kodux78k.github.io/oiDual--Y-/M0D/kob-DH0/js/kob-outline-un.js', id: 'JS_1' },
        { src: 'https://www.infodose.com.br/js/modules/kob-fetchh.js', id: 'JS_2', module: true },
        { src: 'https://www.infodose.com.br/js/kob.js', id: 'JS_3', module: true },
        { src: 'https://kodux78k.github.io/oiDual--Y-/M0D/kard/js/modules/o0.js', id: 'JS_6' },
        { src: 'https://kodux78k.github.io/oiDual--Y-/js/koblluxv30.js', id: 'JS_7' },
        { src: 'https://kodux78k.github.io/oiDual--Y-/js/di-icon-btn.js', id: 'JS_8' },
        { src: 'https://kodux78k.github.io/oiDual--Y-/M0D/0RB/js/modules/inline-1.js', id: 'JS_9', module: true },
        { src: 'https://kodux78k.github.io/oiDual--Y-/M0D/0RB/js/modules/inline-2.js', id: 'JS_10', module: true },
        { src: 'https://kodux78k.github.io/oiDual--Y-/js/inline-1.js', id: 'JS_11' },
        { src: 'https://kodux78k.github.io/oiDual-KxT-di_oi/js/modules/bgPanel.js', id: 'JS_12' },
        { src: 'https://kodux78k.github.io/oiDual--Y-/js/di_corei.js', id: 'JS_13' },
        { src: 'https://kodux78k.github.io/oiDual--Y-/js/di_mood.js', id: 'JS_14' }
    ],
    rootSelector: '#root'
};

// ── injectScript() dedup ─────────────────────────────────────
const _injected = new Set();
function injectScript({ src, id, module = false }) {
    if (_injected.has(src) || (id && document.querySelector(`[data-k-id="${id}"]`))) {
        return Promise.resolve();
    }
    _injected.add(src);
    return new Promise((resolve, reject) => {
        const s = document.createElement('script');
        s.src = src;
        if (module) s.type = 'module';
        if (id) s.dataset.kId = id;
        s.onload = () => resolve(s);
        s.onerror = () => reject(new Error(`Falha ao carregar: ${src}`));
        document.body.appendChild(s);
    });
}

function injectCSS(href) {
    if (document.querySelector(`link[href="${href}"]`)) return;
    const l = document.createElement('link');
    l.rel = 'stylesheet';
    l.href = href;
    document.head.appendChild(l);
}

function emitPhase(name, detail = {}) {
    document.dispatchEvent(new CustomEvent(`kobllux:${name}`, { detail }));
}

// ── FASES ─────────────────────────────────────────────────────
async function phaseCSS(manifest) {
    manifest.css.forEach(injectCSS);
    emitPhase('phase-css-done');
}

async function phaseCore(manifest, ctx) {
    ctx.root = document.querySelector(manifest.rootSelector) || document.body;

    ctx.responseHandler = new ResponseHandler();
    ctx.responseHandler.mount(ctx.root);

    ctx.swissKnife = new SwissKnifeUI();
    ctx.swissKnife.mount(ctx.root);

    emitPhase('phase-core-done');
}

async function phaseVisualAudio(manifest, ctx) {
    // partículas / áudio / distortion já vieram junto no HTML do
    // SwissKnifeUI (fase core) — aqui só ligamos o motor de TTS.
    ctx.fractalEngine = new FractalEngine369({
        input: document.getElementById('inputText'),
        output: document.getElementById('outputContainer'),
        archSelect: document.getElementById('startArch'),
        cycleCheck: document.getElementById('cycleMode'),
        statusBar: document.getElementById('statusBar'),
        hudStatus: document.getElementById('hudStatus'),
        toastContainer: document.getElementById('toasterWrap')
    });

    document.getElementById('btn-play')?.addEventListener('click', () => ctx.fractalEngine.togglePlay());
    document.getElementById('tts-stop')?.addEventListener('click', () => ctx.fractalEngine.stop());
    document.getElementById('orbBtn')?.addEventListener('click', () => ctx.fractalEngine.togglePlay());

    emitPhase('phase-visual-audio-done');
}

async function phaseUI(manifest, ctx) {
    // sincronização de tema body↔html sempre por último dentro da UI
    initBodyThemeSync();
    emitPhase('phase-ui-done');
}

async function phaseExternal(manifest) {
    for (const script of manifest.externalScripts) {
        try {
            await injectScript(script);
        } catch (err) {
            console.error('[Bootloader]', err.message);
        }
    }
    emitPhase('phase-external-done');
}

// ── ORQUESTRADOR ──────────────────────────────────────────────
export async function boot(manifestOverrides = {}) {
    const manifest = {
        ...DEFAULT_MANIFEST,
        ...manifestOverrides,
        css: manifestOverrides.css ?? DEFAULT_MANIFEST.css,
        externalScripts: manifestOverrides.externalScripts ?? DEFAULT_MANIFEST.externalScripts
    };

    const ctx = {};
    window.KOBLLUX = window.KOBLLUX || {};
    window.KOBLLUX.ctx = ctx;

    console.log('Sistema operacional SÜMBÜS Pronto.');

    await phaseCSS(manifest);
    await phaseCore(manifest, ctx);
    await phaseVisualAudio(manifest, ctx);
    await phaseUI(manifest, ctx);
    await phaseExternal(manifest);

    emitPhase('boot-complete', { ctx });
    console.log('[BOOTLOADER] Montagem full concluída.');
    return ctx;
}

// Auto-boot se importado diretamente como entrypoint
if (document.currentScript?.dataset.autoboot !== 'false') {
    document.addEventListener('DOMContentLoaded', () => boot(), { once: true });
}
