/**
 * FUSION OS // ORB WIDGET MODULE v2.4 (RAIDERS REGISTRY)
 * Architecture: Widget Loader / Self-Contained / IIFE
 * Features: Live Snapshots, Fusion/Sandbox, Raiders Groups, CDN Manifest Sync
 * Self-contained: No Tailwind, no Lucide, no runtime deps.
 */

const FusionOS = (() => {
    // --- 1. CONFIG & PRIVATE STATE ---
    const CONFIG = {
        key: 'fusion_os_state_v2_3',
        raidersKey: 'fusion_os_raiders_v1',
        rootId: 'fusion-os-root',
        fusionLayerId: 'navRoot',
        customCssRootId: 'custom-css-root',
        storageKeyLegacy: 'fusion_os_v5_ultimate',
        voice: false,
        // 🔗 Configure aqui seu manifest hospedado em CDN aprovada:
        // ex.: 'https://cdn.jsdelivr.net/gh/USER/REPO@main/raiders.json'
        raidersManifestUrl: null
    };

    // CDNs explicitamente aprovadas para manifestos
    const APPROVED_CDNS = [
        'cdn.jsdelivr.net',
        'unpkg.com',
        'cdnjs.cloudflare.com',
        'cdn.statically.io',
        'raw.githubusercontent.com',
        'fastly.jsdelivr.net'
    ];

    // --- 1.1 RAIDERS REGISTRY (EDITÁVEL / EXPORTÁVEL / CDN-READY) ---
    let RAIDERS_GROUPS = [
        { id: 'comm',  name: 'Comunicação',    icon: 'message',   color: '#22d3ee' },
        { id: 'hub',   name: 'Hubs & Portais', icon: 'globe',     color: '#34d399' },
        { id: 'docs',  name: 'Documentação',   icon: 'file',      color: '#a78bfa' },
        { id: 'tools', name: 'Ferramentas',    icon: 'wrench',    color: '#fb923c' },
        { id: 'view',  name: 'Views',          icon: 'eye',       color: '#f472b6' },
        { id: 'biz',   name: 'Negócios',       icon: 'briefcase', color: '#facc15' },
        { id: 'utils', name: 'Utilitários',    icon: 'grid',      color: '#94a3b8' },
        { id: 'test',  name: 'Testes',         icon: 'beaker',    color: '#c084fc' }
    ];

    let RAIDERS = {
        comm: [
            { code: 'OIDUAL',  name: '💬 OiDual 💬',        url: 'https://kodux78k.github.io/oiDual-dip/' },
            { code: 'VIVIVI',  name: '🧬 Vivivi System 🆔', url: 'https://kodux78k.github.io/oiDual-Vivivi-1/' },
            { code: 'KCHAT',   name: 'Kchat',               url: 'https://kodux78k.github.io/oiDual-78KChat/index.html' }
        ],
        hub: [
            { code: 'DELTA',   name: '🌐 Delta Hub 🔘',     url: 'https://kodux78k.github.io/DualInfodose-VirgemHuB/index.html', desc: 'Interface de conexão externa.' },
            { code: 'ASSERT',  name: 'ASSERT-HUB',          url: 'https://kodux78k.github.io/DualHubjhbarros/' },
            { code: 'PORTAL',  name: 'PORTAL',              url: 'https://kodux78k.github.io/PortalDual/index.html' },
            { code: 'NEBULA',  name: 'Nébula',              url: 'https://kodux78k.github.io/oiDual-PxR/' },
            { code: '78K',     name: '78K ID HOME',         url: 'https://kodux78k.github.io/oiDual-idHome/' },
            { code: 'NAV',     name: 'NAV',                 url: 'https://kodux78k.github.io/oiDual-infodek/' },
            { code: 'START',   name: 'starT',               url: 'https://kodux78k.github.io/oiDual-starT/' }
        ],
        docs: [
            { code: 'LIVROVIVO', name: 'LivroVivo', url: 'https://kodux78k.github.io/Dual-Docs/index.html' },
            { code: 'LV2',       name: 'LV2',       url: 'https://kodux78k.github.io/info-Doc/index.html' }
        ],
        tools: [
            { code: 'KXT',    name: 'Kxt',              url: 'https://kodux78k.github.io/oiDual-KxT/index.html' },
            { code: 'KXT2',   name: 'Dual_KxT v9',      url: 'https://kodux78k.github.io/oiDual-78KxaT-v4/' },
            { code: 'KXT56',  name: '78KXat Dual',      url: 'https://kodux78k.github.io/oiDual-78KxT/' },
            { code: 'KXTZ',   name: 'KxT KBllX',        url: 'https://kodux78k.github.io/oiDual-KxT/' },
            { code: 'HTMGK',  name: 'Htmagik',          url: 'https://kodux78k.github.io/oiDual-Htmagik-m/' },
            { code: 'DEX',    name: 'DeX',              url: 'https://kodux78k.github.io/oiDual-DeX/' },
            { code: 'DFB',    name: 'DfB (HtMagik v8)', url: 'https://kodux78k.github.io/oiDual-HtMagikv8/' },
            { code: 'KRDZ1',  name: 'dualKrdZ',         url: 'https://kodux78k.github.io/oiDual-78KrdZ-v1/' }
        ],
        view: [
            { code: 'VWR',   name: 'dual ViweR',    url: 'https://kodux78k.github.io/oiDual-VwR/index.html' },
            { code: 'VWRDI', name: 'VwR-di',        url: 'https://kodux78k.github.io/oiDual-VwR-di/' },
            { code: '78F',   name: 'Iframe 78frames', url: 'https://kodux78k.github.io/oiDual-78F/' }
        ],
        biz: [
            { code: 'ADU', name: 'Adega Urbana',              url: 'https://kodux78k.github.io/oiDual-AdegaUrbana/' },
            { code: 'CDI', name: 'CORRETORA DUALINFODOSE',    url: 'https://kodux78k.github.io/oiDual--Y-/main/blob/corretoraDual-app-m0d.html/' }
        ],
        utils: [
            { code: 'U87',    name: 'UNo87',          url: 'https://kodux78k.github.io/oiDual--Y-/HubUno-87-m0d.html/' },
            { code: 'U32',    name: 'UNo32',          url: 'https://kodux78k.github.io/oiDual--Y-/HubUno-32-m0d.html/' },
            { code: 'DH0',    name: 'DH0',            url: 'https://kodux78k.github.io/oiDual-H0/' },
            { code: 'DH10',   name: 'H0-di',          url: 'https://kodux78k.github.io/oiDual-H0/' },
            { code: 'APR',    name: 'APR',            url: 'https://kodux78k.github.io/ASSERT-app1/index.html' },
            { code: 'NR1035', name: 'ASSERT NR10/35', url: 'https://kodux78k.github.io/DualHubjhbarros/PWA_TICO_Ultra/' }
        ],
        test: [
            { code: 'TST',  name: 'TST',  url: 'https://kodux78k.github.io/oiDual-tst/' },
            { code: 'TST0', name: 'TST0', url: 'https://kodux78k.github.io/oiDual-tst0/' },
            { code: 'TST1', name: 'TST1', url: 'https://kodux78k.github.io/oiDual-tst1/' }
        ]
    };

    // BUILTINS é reconstruído a partir de RAIDERS (flat, indexado por code)
    let BUILTINS = {};
    function rebuildBuiltins() {
        BUILTINS = {};
        Object.entries(RAIDERS).forEach(([group, list]) => {
            list.forEach(r => {
                BUILTINS[r.code] = { ...r, group };
            });
        });
    }
    rebuildBuiltins();

    const DEFAULT_APPS = [
        { id: 'DELTA', ...RAIDERS.hub[0], group: 'hub', active: true }
    ];

    let _state = {
        active: false,
        installed: [],
        hiddenApps: [],
        customCSS: '',
        currentTab: 'dashboard',
        userData: { user: 'Visitante', system: 'SINGULARITY', stats: {} }
    };

    // --- SVG ICON LIBRARY (Lucide-compatible, no external deps) ---
    const Icons = {
        dashboard: (s = 20) => `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>`,
        layers: (s = 20) => `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/><path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"/><path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"/></svg>`,
        beaker: (s = 20) => `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 3h15"/><path d="M6 3v16a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V3"/><path d="M6 14h12"/></svg>`,
        power: (s = 20) => `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v10"/><path d="M18.4 6.6a9 9 0 1 1-12.77.04"/></svg>`,
        terminal: (s = 20) => `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 17 10 11 4 5"/><line x1="12" x2="20" y1="19" y2="19"/></svg>`,
        arrowRight: (s = 20) => `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>`,
        chevronDown: (s = 20) => `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>`,
        eyeOff: (s = 20) => `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49"/><path d="M14.084 14.158a3 3 0 0 1-4.242-4.242"/><path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143"/><path d="m2 2 20 20"/></svg>`,
        eye: (s = 20) => `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>`,
        trash: (s = 20) => `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>`,
        ghost: (s = 20) => `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 10h.01"/><path d="M15 10h.01"/><path d="M12 2a8 8 0 0 0-8 8v12l3-3 2.5 2.5L12 19l2.5 2.5L17 19l3 3V10a8 8 0 0 0-8-8z"/></svg>`,
        globe: (s = 20) => `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>`,
        message: (s = 20) => `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`,
        file: (s = 20) => `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/></svg>`,
        wrench: (s = 20) => `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>`,
        briefcase: (s = 20) => `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/><rect width="20" height="14" x="2" y="6" rx="2"/></svg>`,
        grid: (s = 20) => `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>`,
        box: (s = 20) => `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>`,
        icon: (name, s = 20) => (Icons[name] || Icons.box)(s)
    };

    // --- 1.2 MANIFEST HELPERS (CDN-READY) ---
    function isApprovedCdn(url) {
        try {
            const u = new URL(url, location.href);
            return APPROVED_CDNS.some(h => u.hostname === h || u.hostname.endsWith('.' + h));
        } catch { return false; }
    }

    function isValidManifest(m) {
        return m
            && Array.isArray(m.groups)
            && Array.isArray(m.raiders)
            && m.groups.every(g => g.id && g.name)
            && m.raiders.every(r => r.code && (r.url || r.html) && r.group);
    }

    function buildManifest() {
        return {
            version: '2.4.0',
            generatedAt: new Date().toISOString(),
            groups: RAIDERS_GROUPS,
            raiders: Object.entries(RAIDERS).flatMap(([group, list]) =>
                list.map(r => ({ ...r, group }))
            )
        };
    }

    function applyManifest(manifest) {
        if (!isValidManifest(manifest)) throw new Error('Manifest inválido');
        RAIDERS_GROUPS = manifest.groups.map(g => ({ ...g }));
        RAIDERS = {};
        manifest.raiders.forEach(r => {
            const g = r.group || 'tools';
            (RAIDERS[g] = RAIDERS[g] || []).push({
                code: r.code, name: r.name, url: r.url || null,
                html: r.html || null, desc: r.desc || '', icon: r.icon || 'box'
            });
        });
        // Garante grupos vazios também existam
        RAIDERS_GROUPS.forEach(g => { if (!RAIDERS[g.id]) RAIDERS[g.id] = []; });
        rebuildBuiltins();
        localStorage.setItem(CONFIG.raidersKey, JSON.stringify(manifest));
    }

    function loadSavedManifest() {
        const raw = localStorage.getItem(CONFIG.raidersKey);
        if (!raw) return;
        try {
            const m = JSON.parse(raw);
            applyManifest(m);
        } catch (e) { console.warn('raiders manifest inválido, ignorando', e); }
    }

    async function loadRaidersFromCdn(url) {
        if (!isApprovedCdn(url)) throw new Error('CDN não aprovada. Use jsDelivr, unpkg, cdnjs, statically ou raw.githubusercontent.');
        const resp = await fetch(url, { cache: 'no-cache' });
        if (!resp.ok) throw new Error('Falha HTTP ' + resp.status);
        const manifest = await resp.json();
        applyManifest(manifest);
        return manifest;
    }

    function exportManifestDownload() {
        const json = JSON.stringify(buildManifest(), null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'raiders.json';
        a.click();
        setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    }

    // --- 2. SUBSYSTEMS ---
    const Utils = {
        speak: (msg) => {
            if (!CONFIG.voice || !('speechSynthesis' in window)) return;
            try {
                window.speechSynthesis.cancel();
                const u = new SpeechSynthesisUtterance(msg);
                u.lang = 'pt-BR'; u.rate = 1.15;
                window.speechSynthesis.speak(u);
            } catch (e) { console.warn('TTS failed', e); }
        },
        save: () => {
            localStorage.setItem(CONFIG.key, JSON.stringify({
                installed: _state.installed,
                hiddenApps: _state.hiddenApps,
                customCSS: _state.customCSS
            }));
        },
        load: () => {
            const raw = localStorage.getItem(CONFIG.key) || localStorage.getItem(CONFIG.storageKeyLegacy);
            if (raw) {
                try {
                    const parsed = JSON.parse(raw);
                    _state.installed = parsed.installed || [...DEFAULT_APPS];
                    _state.hiddenApps = parsed.hiddenApps || [];
                    _state.customCSS = parsed.customCSS || '';
                } catch (e) {
                    _state.installed = [...DEFAULT_APPS];
                }
            } else {
                _state.installed = [...DEFAULT_APPS];
            }

            const kardDataRaw = localStorage.getItem('fusion_os_data_v2');
            if (kardDataRaw) {
                try {
                    const parsedKard = JSON.parse(kardDataRaw);
                    if (!parsedKard.isEncrypted && parsedKard.data) {
                        _state.userData.user = parsedKard.data.user || _state.userData.user;
                    } else {
                        _state.userData.user = window.di_userName || localStorage.getItem('di_userName') || _state.userData.user;
                    }
                } catch (e) { /* ignore */ }
            } else {
                _state.userData.user = window.di_userName || localStorage.getItem('di_userName') || _state.userData.user;
            }
            _state.userData.system = window.di_infodoseName || localStorage.getItem('di_infodoseName') || _state.userData.system;
        },
        triggerShake: () => {
            document.body.style.animation = "shake 0.32s cubic-bezier(.36,.07,.19,.97) both";
            setTimeout(() => document.body.style.animation = "", 340);
        },
        generateHash: (s) => {
            let h = 0xdeadbeef;
            for (let i = 0; i < s.length; i++) { h = Math.imul(h ^ s.charCodeAt(i), 2654435761); }
            return (h ^ (h >>> 16)) >>> 0;
        }
    };

    // --- 3. UI GENERATOR ---
    const UI = {
        styles: `
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700;800;900&family=JetBrains+Mono:wght@400;700&display=swap');

            #${CONFIG.rootId} { font-family: 'Inter', sans-serif; color: #fff; pointer-events: auto; }
            #${CONFIG.rootId} *, #${CONFIG.rootId} *::before, #${CONFIG.rootId} *::after { box-sizing: border-box; }
            #${CONFIG.rootId} button { font-family: inherit; cursor: pointer; }
            #${CONFIG.rootId} h2, #${CONFIG.rootId} h3, #${CONFIG.rootId} h4, #${CONFIG.rootId} p { margin: 0; }
            #${CONFIG.rootId} svg { display: block; }

            /* --- MONOLITH --- */
            .monolith-wrapper { position: fixed; inset: 0; display: flex; align-items: center; justify-content: center; padding: 24px; perspective: 2000px; z-index: 9998; pointer-events: none; }
            @media (min-width: 768px) { .monolith-wrapper { padding: 48px; } }
            .monolith { width: 100%; max-width: 1100px; height: 75vh; display: flex; flex-direction: column; position: relative; background: rgba(10, 10, 14, 0.95); backdrop-filter: blur(60px); -webkit-backdrop-filter: blur(60px); border: 1px solid rgba(255,255,255,0.08); border-radius: 40px; transform-origin: bottom center; clip-path: circle(0% at 50% 100%); transform: translateY(60px) scale(0.9); opacity: 0; transition: all 0.7s cubic-bezier(0.19, 1, 0.22, 1); pointer-events: none; overflow: hidden; box-shadow: 0 40px 100px -20px rgba(0,0,0,0.8); }
            .os-active .monolith { transform: translateY(0) scale(1); opacity: 1; clip-path: circle(150% at 50% 100%); pointer-events: auto; }

            /* --- HEADER --- */
            .os-header { height: 96px; position: relative; display: flex; align-items: center; justify-content: space-between; padding: 0 32px; background: rgba(0,0,0,0.12); border-bottom: 1px solid rgba(255,255,255,0.05); flex-shrink: 0; user-select: none; }
            @media (min-width: 768px) { .os-header { padding: 0 48px; } }
            .os-header-left, .os-header-right { position: relative; z-index: 20; display: flex; align-items: center; }
            .os-header-left { gap: 12px; }
            .os-header-right { gap: 20px; }
            .tab-btn { width: 44px; height: 44px; border-radius: 14px; transition: all .3s; color: rgba(255,255,255,0.3); display: flex; align-items: center; justify-content: center; background: transparent; border: 1px solid transparent; padding: 0; }
            .tab-btn:hover { color: #fff; background: rgba(255,255,255,0.04); }
            .tab-btn.active { color: #00f2ff; background: rgba(0,242,255,0.08); border-color: rgba(0,242,255,0.12); box-shadow: 0 0 12px rgba(0,242,255,0.06); }
            .os-header-center { position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); z-index: 10; display: flex; flex-direction: column; align-items: center; pointer-events: none; opacity: 0.8; width: 100%; max-width: 220px; }
            .os-system-id { font-size: 10px; font-weight: 900; letter-spacing: 0.4em; color: rgba(255,255,255,0.3); text-transform: uppercase; margin-bottom: 4px; text-align: center; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; width: 100%; text-shadow: 0 2px 6px rgba(0,0,0,0.5); }
            .os-context-row { display: flex; align-items: center; justify-content: center; width: 100%; gap: 8px; }
            .status-line { height: 1px; width: 32px; background: linear-gradient(90deg, transparent, rgba(0,242,255,0.5), transparent); }
            .os-context { font-size: 9px; color: #22d3ee; font-family: 'JetBrains Mono', monospace; letter-spacing: 0.1em; font-weight: 700; white-space: nowrap; }
            .os-user-block { display: none; flex-direction: column; align-items: flex-end; text-align: right; }
            @media (min-width: 768px) { .os-user-block { display: flex; } }
            .os-user-label { font-size: 8px; color: rgba(255,255,255,0.2); font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; }
            .os-user-name { font-size: 9px; color: rgba(34,211,238,0.8); font-family: 'JetBrains Mono', monospace; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; }
            .os-power-btn { width: 40px; height: 40px; border-radius: 50%; border: 1px solid rgba(255,255,255,0.05); background: rgba(255,255,255,0.05); color: rgba(255,255,255,0.3); display: flex; align-items: center; justify-content: center; transition: all .2s; padding: 0; }
            .os-power-btn:hover { background: rgba(239,68,68,0.1); border-color: rgba(239,68,68,0.3); color: #f87171; }

            /* --- MAIN --- */
            .os-main { flex: 1; overflow-y: auto; padding: 32px; background: linear-gradient(to bottom, transparent, rgba(0,0,0,0.2)); position: relative; z-index: 10; }
            @media (min-width: 768px) { .os-main { padding: 48px; } }

            /* --- RUNTIME --- */
            .runtime-layer { position: absolute; inset: 0; background: #050505; transform: translateY(100%); transition: transform .6s cubic-bezier(0.19, 1, 0.22, 1); z-index: 100; display: flex; flex-direction: column; }
            .runtime-layer.visible { transform: translateY(0); }
            .os-runtime-bar { height: 64px; background: #09090b; border-bottom: 1px solid rgba(255,255,255,0.1); display: flex; justify-content: space-between; align-items: center; padding: 0 32px; flex-shrink: 0; }
            .os-runtime-status { display: flex; align-items: center; gap: 12px; }
            .os-ping-wrap { position: relative; display: flex; height: 8px; width: 8px; }
            .os-ping { position: absolute; display: inline-flex; height: 100%; width: 100%; border-radius: 50%; background: #22d3ee; opacity: 0.75; animation: ping 1.1s cubic-bezier(0,0,0.2,1) infinite; }
            .os-ping-dot { position: relative; display: inline-flex; border-radius: 50%; height: 8px; width: 8px; background: #06b6d4; }
            @keyframes ping { 75%, 100% { transform: scale(2); opacity: 0; } }
            .os-runtime-title { font-size: 10px; color: #22d3ee; font-family: 'JetBrains Mono', monospace; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase; }
            .os-runtime-min-btn { padding: 8px 16px; border-radius: 8px; font-size: 9px; font-weight: 700; color: rgba(255,255,255,0.4); background: transparent; border: 1px solid transparent; transition: all .2s; text-transform: uppercase; letter-spacing: 0.1em; }
            .os-runtime-min-btn:hover { color: #fff; background: rgba(255,255,255,0.1); border-color: rgba(255,255,255,0.1); }
            .os-frame { flex: 1; border: none; background: #000; width: 100%; height: 100%; }

            /* --- ORB --- */
            :root { --orb-cyan: #00f2ff; --orb-purple: #bd00ff; }
            .orb-trigger { position: fixed; bottom: 30px; left: 50%; transform: translateX(-50%); width: 72px; height: 72px; cursor: pointer; z-index: 10010; display: grid; place-items: center; background: transparent; border: none; pointer-events: auto; outline: none; transition: transform 0.36s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
            .orb-trigger:hover { transform: translateX(-50%) scale(1.08); }
            .orb-core0 { width: 10px; height: 10px; background: #fff; border-radius: 50%; box-shadow: 0 0 18px rgba(255,255,255,0.95); transition: transform .36s, box-shadow .36s, background .36s; }
            .orb-ring { position: absolute; width: 52px; height: 52px; border-radius: 50%; border: 2px solid transparent; border-top-color: var(--orb-cyan); border-bottom-color: var(--orb-purple); animation: orb-spin 4s linear infinite; opacity: .75; transition: all .45s ease; }
            .os-active .orb-core0 { background: var(--orb-cyan); box-shadow: 0 0 30px var(--orb-cyan); transform: scale(1.18); }
            .os-active .orb-ring { animation-duration: 1.25s; opacity: 1; border-color: var(--orb-cyan); box-shadow: 0 0 20px rgba(0,242,255,0.18); }
            @keyframes orb-spin { to { transform: rotate(360deg); } }
            @keyframes shake { 0% { transform: translate(1px,1px); } 10% { transform: translate(-1px,-2px); } 100% { transform: translate(0); } }

            /* --- SCROLLBAR --- */
            .custom-scroll::-webkit-scrollbar { width: 6px; height: 6px; }
            .custom-scroll::-webkit-scrollbar-thumb { background: rgba(0, 242, 255, 0.16); border-radius: 10px; }
            .custom-scroll::-webkit-scrollbar-track { background: transparent; }

            /* --- EXIT BTN --- */
            .fusion-exit-ctrl-wrap { position: fixed; top: 32px; left: 50%; transform: translateX(-50%); z-index: 10020; touch-action: manipulation; }
            .fusion-exit-ctrl-wrap.hidden { display: none; }
            .fusion-exit-btn { width: 40px; height: 40px; padding: 0; display: inline-flex; align-items: center; justify-content: center; border-radius: 999px; color: var(--orb-cyan); background: rgba(0,0,0,0.45); border: 1px solid rgba(220,38,38,0.22); box-shadow: 0 8px 20px rgba(220,38,38,0.08); transition: transform .16s ease, background .16s ease, color .16s ease; cursor: pointer; }
            .fusion-exit-btn:hover { transform: scale(1.06); background: rgba(220,38,38,0.10); color: #fff; }

            /* --- ACCORDION --- */
            .accordion-item { transition: all .4s cubic-bezier(.25,1,.5,1); overflow: hidden; border: 1px solid rgba(255,255,255,0.05); background: linear-gradient(145deg, rgba(255,255,255,0.02) 0%, rgba(0,0,0,0.3) 100%); border-radius: 16px; height: 70px; position: relative; cursor: pointer; }
            .accordion-item.expanded { background: linear-gradient(145deg, rgba(0,242,255,0.04) 0%, rgba(0,0,0,0.45) 100%); border-color: rgba(0,242,255,0.18); box-shadow: 0 10px 40px -10px rgba(0,0,0,0.6); transform: scale(1.01); margin: 10px 0; }
            .preview-frame { width: 133%; height: 133%; pointer-events: none; opacity: .6; transform: scale(.75); transform-origin: top left; border: none; background: transparent; }
            .acc-header { height: 70px; display: flex; align-items: center; padding: 0 24px; gap: 20px; position: relative; z-index: 20; background: rgba(0,0,0,0.2); }
            .acc-icon { width: 40px; height: 40px; border-radius: 8px; background: rgba(255,255,255,0.05); display: flex; align-items: center; justify-content: center; border: 1px solid rgba(255,255,255,0.1); color: #22d3ee; flex-shrink: 0; }
            .acc-info { flex: 1; min-width: 0; }
            .acc-title-row { display: flex; align-items: center; gap: 8px; }
            .acc-title { font-size: 14px; font-weight: 700; color: #fff; letter-spacing: 0.02em; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
            .acc-code { font-size: 9px; background: rgba(255,255,255,0.05); padding: 2px 8px; border-radius: 4px; color: rgba(255,255,255,0.3); font-family: 'JetBrains Mono', monospace; flex-shrink: 0; }
            .acc-chevron { color: rgba(255,255,255,0.3); transition: transform .3s; flex-shrink: 0; }
            .accordion-item.expanded .acc-chevron { transform: rotate(180deg); }
            .acc-body { position: absolute; top: 70px; left: 0; width: 100%; height: 250px; background: rgba(0,0,0,0.4); display: flex; pointer-events: auto; }
            .acc-preview { width: 50%; height: 100%; border-right: 1px solid rgba(255,255,255,0.05); position: relative; overflow: hidden; background: #000; }
            .acc-preview-placeholder { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; color: rgba(255,255,255,0.1); z-index: 0; font-size: 9px; letter-spacing: 0.1em; text-transform: uppercase; }
            .acc-preview iframe { position: relative; z-index: 10; }
            .acc-preview-overlay { position: absolute; inset: 0; z-index: 20; }
            .acc-details { width: 50%; height: 100%; padding: 24px; display: flex; flex-direction: column; justify-content: space-between; }
            .acc-desc-label { font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em; color: #06b6d4; margin: 0 0 8px 0; font-weight: 700; }
            .acc-desc { font-size: 12px; color: rgba(255,255,255,0.5); line-height: 1.5; margin: 0; }
            .acc-actions { display: flex; flex-direction: column; gap: 8px; }
            .acc-launch-row { display: flex; gap: 8px; }
            .acc-btn { flex: 1; font-size: 10px; font-weight: 700; padding: 12px 0; border-radius: 8px; text-transform: uppercase; letter-spacing: 0.05em; transition: all .2s; border: none; }
            .acc-btn-sandbox { background: rgba(255,255,255,0.1); color: #fff; }
            .acc-btn-sandbox:hover { background: rgba(255,255,255,0.2); }
            .acc-btn-fusion { background: rgba(6,182,212,0.2); color: #22d3ee; }
            .acc-btn-fusion:hover { background: #06b6d4; color: #000; }
            .acc-mgmt-row { display: flex; gap: 8px; margin-top: 8px; padding-top: 8px; border-top: 1px solid rgba(255,255,255,0.05); }
            .acc-mgmt-btn { flex: 1; font-size: 9px; padding: 8px 0; background: transparent; border: none; color: rgba(255,255,255,0.3); display: flex; align-items: center; justify-content: center; gap: 4px; transition: color .2s; }
            .acc-mgmt-btn:hover { color: #fff; }
            .acc-mgmt-btn.danger:hover { color: #f87171; }

            /* --- GROUPS --- */
            .group-section { margin-bottom: 28px; }
            .group-header { display: flex; align-items: center; gap: 10px; margin-bottom: 12px; padding: 0 4px; }
            .group-icon { display: flex; align-items: center; justify-content: center; width: 28px; height: 28px; border-radius: 8px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.06); color: #22d3ee; flex-shrink: 0; }
            .group-title { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.15em; color: rgba(255,255,255,0.6); }
            .group-count { font-size: 9px; font-family: 'JetBrains Mono', monospace; background: rgba(255,255,255,0.05); padding: 2px 8px; border-radius: 999px; color: rgba(255,255,255,0.4); margin-left: auto; }

            /* --- RAIDERS AVAILABLE --- */
            .raiders-available-title { font-size: 12px; text-transform: uppercase; letter-spacing: 0.2em; color: rgba(255,255,255,0.4); margin: 32px 0 20px; padding-top: 24px; border-top: 1px solid rgba(255,255,255,0.05); }
            .raiders-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 8px; }
            .raider-chip { display: flex; flex-direction: column; gap: 4px; padding: 12px 14px; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); border-radius: 10px; text-align: left; transition: all .2s; color: #fff; cursor: pointer; }
            .raider-chip:hover { background: rgba(6,182,212,0.08); border-color: rgba(6,182,212,0.2); transform: translateY(-1px); }
            .raider-chip-name { font-size: 11px; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
            .raider-chip-code { font-size: 9px; font-family: 'JetBrains Mono', monospace; color: rgba(0,242,255,0.6); letter-spacing: 0.05em; }

            /* --- DASHBOARD --- */
            .dash-root { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; max-width: 672px; margin: 0 auto; transition: all .5s; }
            .dash-card { width: 100%; background: rgba(255,255,255,0.02); border-radius: 36px; padding: 32px; border: 1px solid rgba(255,255,255,0.1); position: relative; overflow: hidden; }
            .dash-card::before { content: ''; position: absolute; inset: 0; background: linear-gradient(135deg, rgba(6,182,212,0.05), rgba(168,85,247,0.05)); opacity: 0.5; transition: opacity .3s; pointer-events: none; }
            .dash-card:hover::before { opacity: 1; }
            .dash-card-inner { position: relative; z-index: 10; display: flex; flex-direction: column; align-items: center; gap: 32px; }
            @media (min-width: 768px) { .dash-card-inner { flex-direction: row; } }
            .dash-avatar { width: 96px; height: 96px; flex-shrink: 0; border-radius: 16px; overflow: hidden; box-shadow: 0 0 30px rgba(0,242,255,0.1); border: 1px solid rgba(255,255,255,0.05); }
            .dash-avatar svg { width: 100%; height: 100%; }
            .dash-info { text-align: center; flex: 1; min-width: 0; }
            @media (min-width: 768px) { .dash-info { text-align: left; } }
            .dash-greeting { display: flex; align-items: baseline; justify-content: center; gap: 12px; margin-bottom: 4px; }
            @media (min-width: 768px) { .dash-greeting { justify-content: flex-start; } }
            .dash-hello { font-size: 24px; color: rgba(255,255,255,0.4); font-weight: 200; }
            .dash-name { font-size: 30px; font-weight: 700; color: #fff; letter-spacing: -0.02em; }
            @media (min-width: 768px) { .dash-name { font-size: 36px; } }
            .dash-subtitle { font-size: 24px; text-transform: uppercase; margin-bottom: 8px; }
            .dash-stats { display: flex; flex-wrap: wrap; justify-content: center; gap: 16px; margin-top: 12px; }
            @media (min-width: 768px) { .dash-stats { justify-content: flex-start; } }
            .dash-stat { background: rgba(0,0,0,0.4); padding: 8px 16px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.05); text-align: center; }
            .dash-stat-label { display: block; font-size: 9px; color: rgba(255,255,255,0.4); text-transform: uppercase; letter-spacing: 0.1em; }
            .dash-stat-value { color: #34d399; font-family: 'JetBrains Mono', monospace; font-size: 14px; font-weight: 700; }
            .dash-terminal-wrap { margin-top: 32px; width: 100%; max-width: 480px; position: relative; }
            .dash-terminal-glow { position: absolute; inset: -2px; background: linear-gradient(to right, #06b6d4, #9333ea); border-radius: 12px; opacity: 0.2; filter: blur(4px); transition: opacity 1s; pointer-events: none; }
            .dash-terminal-wrap:hover .dash-terminal-glow { opacity: 0.6; }
            .dash-terminal { position: relative; display: flex; align-items: center; background: #000; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1); }
            .dash-terminal-icon { padding-left: 16px; color: #06b6d4; display: flex; align-items: center; }
            .dash-terminal-input { width: 100%; background: transparent; border: none; color: #fff; font-family: 'JetBrains Mono', monospace; font-size: 14px; padding: 16px; outline: none; text-transform: uppercase; letter-spacing: 0.1em; }
            .dash-terminal-input::placeholder { color: rgba(255,255,255,0.2); }
            .dash-terminal-submit { margin-right: 8px; padding: 8px; background: transparent; border: none; border-radius: 8px; color: #22d3ee; transition: background .2s; display: flex; align-items: center; }
            .dash-terminal-submit:hover { background: rgba(255,255,255,0.1); }
            .dash-terminal-hint { text-align: center; margin-top: 12px; font-size: 9px; color: rgba(255,255,255,0.2); text-transform: uppercase; letter-spacing: 0.3em; }
            .dash-empty { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; color: rgba(255,255,255,0.3); }
            .dash-empty svg { margin-bottom: 16px; opacity: 0.5; }
            .dash-empty p { margin: 0; }
            .apps-list { display: flex; flex-direction: column; gap: 16px; }

            /* --- LAB --- */
            .lab-root { height: 100%; display: flex; flex-direction: column; gap: 24px; padding-bottom: 40px; }
            .lab-panel { background: rgba(255,255,255,0.02); padding: 24px; border-radius: 24px; border: 1px solid rgba(255,255,255,0.05); }
            .lab-panel.grow { flex: 1; display: flex; flex-direction: column; }
            .lab-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 16px; gap: 12px; }
            .lab-title { font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #22d3ee; margin: 0; }
            .lab-title.purple { color: #c084fc; }
            .lab-upload { background: rgba(255,255,255,0.05); padding: 4px 12px; border-radius: 4px; font-size: 9px; cursor: pointer; border: 1px solid rgba(255,255,255,0.1); transition: background .2s; }
            .lab-upload:hover { background: rgba(255,255,255,0.1); }
            .lab-upload input { display: none; }
            .lab-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; height: 200px; }
            .lab-textarea { background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.05); border-radius: 12px; padding: 16px; font-size: 10px; font-family: 'JetBrains Mono', monospace; color: #a1a1aa; outline: none; resize: none; width: 100%; }
            .lab-textarea.output { color: rgba(6,182,212,0.7); }
            .lab-textarea.css-input { flex: 1; color: rgba(244,114,182,0.8); min-height: 160px; }
            .lab-textarea.manifest-input { height: 200px; color: rgba(34,211,238,0.85); }
            .lab-actions { display: flex; gap: 8px; margin-top: 12px; flex-wrap: wrap; }
            .lab-btn { font-weight: 700; padding: 8px 16px; border-radius: 12px; text-transform: uppercase; letter-spacing: 0.1em; font-size: 10px; transition: all .2s; border: none; }
            .lab-btn-convert { background: rgba(255,255,255,0.05); color: rgba(255,255,255,0.4); }
            .lab-btn-convert:hover { background: rgba(6,182,212,0.2); color: #22d3ee; }
            .lab-btn-inject { background: rgba(6,182,212,0.2); color: #22d3ee; }
            .lab-btn-inject:hover { background: #06b6d4; color: #fff; }
            .lab-save-row { display: flex; justify-content: space-between; align-items: center; margin-top: 12px; gap: 12px; }
            .lab-save-hint { font-size: 9px; color: rgba(255,255,255,0.2); }
            .lab-btn-save { background: rgba(168,85,247,0.2); color: #c084fc; font-weight: 700; padding: 8px 24px; border-radius: 8px; text-transform: uppercase; letter-spacing: 0.1em; font-size: 9px; transition: all .2s; border: none; }
            .lab-btn-save:hover { background: #a855f7; color: #fff; }
            .lab-cdn-row { display: flex; gap: 8px; margin-top: 12px; }
            .lab-cdn-input { flex: 1; background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.05); border-radius: 8px; padding: 10px 12px; font-size: 10px; font-family: 'JetBrains Mono', monospace; color: #a1a1aa; outline: none; }
            .lab-cdn-input:focus { border-color: rgba(6,182,212,0.3); }
        `,
        build: () => {
            if (!document.getElementById(CONFIG.fusionLayerId)) {
                const nav = document.createElement('div'); nav.id = CONFIG.fusionLayerId; document.body.appendChild(nav);
            }
            if (!document.getElementById(CONFIG.customCssRootId)) {
                const cssRoot = document.createElement('div'); cssRoot.id = CONFIG.customCssRootId; document.body.appendChild(cssRoot);
            }
            const existing = document.getElementById(CONFIG.rootId);
            if (existing) existing.remove();

            const container = document.createElement('div');
            container.id = CONFIG.rootId;
            container.innerHTML = `
                <style>${UI.styles}</style>
                <div class="monolith-wrapper">
                    <div class="monolith">
                        <header class="os-header">
                            <div class="os-header-left">
                                <button onclick="FusionOS.setTab('dashboard')" id="tab-dashboard" class="tab-btn" title="Perfil / Dashboard">${Icons.dashboard(20)}</button>
                                <button onclick="FusionOS.setTab('apps')" id="tab-apps" class="tab-btn" title="Módulos">${Icons.layers(20)}</button>
                                <button onclick="FusionOS.setTab('lab')" id="tab-lab" class="tab-btn" title="Laboratório">${Icons.beaker(20)}</button>
                            </div>

                            <div class="os-header-center">
                                <span id="sys-identity" class="os-system-id">${_state.userData.system}</span>
                                <div class="os-context-row">
                                    <div class="status-line"></div>
                                    <span id="header-context" class="os-context">DASHBOARD</span>
                                    <div class="status-line"></div>
                                </div>
                            </div>

                            <div class="os-header-right">
                                <div class="os-user-block">
                                    <span class="os-user-label">Operator</span>
                                    <span id="user-identity" class="os-user-name">${_state.userData.user}</span>
                                </div>
                                <button onclick="FusionOS.toggle()" class="os-power-btn" title="Fechar Sistema">${Icons.power(16)}</button>
                            </div>
                        </header>

                        <main id="monolith-content" class="os-main custom-scroll"></main>

                        <div id="os-runtime" class="runtime-layer">
                            <div class="os-runtime-bar">
                                <div class="os-runtime-status">
                                    <span class="os-ping-wrap">
                                        <span class="os-ping"></span>
                                        <span class="os-ping-dot"></span>
                                    </span>
                                    <span id="runtime-title" class="os-runtime-title">PROCESS_RUNNING</span>
                                </div>
                                <button onclick="FusionOS.closeRuntime()" class="os-runtime-min-btn">Minimizar</button>
                            </div>
                            <iframe id="os-frame" class="os-frame"></iframe>
                        </div>
                    </div>
                </div>

                <button class="orb-trigger" id="orb-trigger" aria-label="Toggle Fusion OS">
                    <div class="orb-ring"></div>
                    <div class="orb-core orb-core0"></div>
                </button>

                <div id="fusion-exit-ctrl" class="fusion-exit-ctrl-wrap hidden" role="dialog" aria-hidden="true">
                    <button onclick="FusionOS.exitFusion()" class="fusion-exit-btn" aria-label="Encerrar Fusão" title="Encerrar Fusão">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                            <circle cx="12" cy="12" r="8"></circle>
                            <line x1="8" y1="12" x2="16" y2="12"></line>
                        </svg>
                    </button>
                </div>
            `;
            document.body.appendChild(container);
            FusionOS.setTab(_state.currentTab || 'dashboard');
            const orb = document.getElementById('orb-trigger');
            if (orb) orb.addEventListener('click', () => FusionOS.toggle());
        },
        injectCustomCSS(css) {
            const root = document.getElementById(CONFIG.customCssRootId);
            if (!root) {
                const r = document.createElement('div');
                r.id = CONFIG.customCssRootId;
                document.body.appendChild(r);
            }
            document.getElementById(CONFIG.customCssRootId).innerHTML = `<style>${css}</style>`;
        },
        refreshIcons() { /* inline SVG, no-op */ }
    };

    // --- 4. PARSER ---
    const Parser = {
        convertFromHtmlSource(inputHtml) {
            if (!inputHtml) return '';
            const doc = new DOMParser().parseFromString(inputHtml, 'text/html');
            const styles = Array.from(doc.querySelectorAll('style')).map(s => s.innerHTML).join('\n');
            const bodyClone = doc.body.cloneNode(true);
            bodyClone.querySelectorAll('script, style').forEach(el => el.remove());
            const bodyHtml = bodyClone.innerHTML.trim();
            const scripts = Array.from(doc.querySelectorAll('script')).map(s => s.innerHTML).join('\n');
            const safeStyles = styles.replace(/`/g, '\\`').replace(/\$/g, '\\$');
            const safeBody = bodyHtml.replace(/`/g, '\\`').replace(/\$/g, '\\$');
            const safeScripts = scripts.replace(/`/g, '\\`').replace(/\$/g, '\\$');
            return `window.FusionModule = (() => {
    return {
        init() {
            const s = document.createElement('style'); s.innerHTML = \`${safeStyles}\`; document.head.appendChild(s);
            const c = document.createElement('div'); c.innerHTML = \`${safeBody}\`; document.body.appendChild(c);
            try { ${safeScripts} } catch(e) { console.error(e); }
        }
    };
})();
window.FusionModule.init();`;
        }
    };

    // --- 5. HELPERS DE RENDER ---
    function renderGroupHeader(group, count) {
        return `<div class="group-header">
            <div class="group-icon">${Icons.icon(group.icon, 16)}</div>
            <span class="group-title">${group.name}</span>
            <span class="group-count">${count}</span>
        </div>`;
    }

    function renderAppCard(app) {
        return `
            <div id="acc-${app.id}" class="accordion-item" onclick="FusionOS.toggleAccordion('${app.id}')">
                <div class="acc-header">
                    <div class="acc-icon">${Icons.icon(app.icon || 'box', 20)}</div>
                    <div class="acc-info">
                        <div class="acc-title-row">
                            <h3 class="acc-title">${app.name}</h3>
                            <span class="acc-code">${app.id}</span>
                        </div>
                    </div>
                    <div class="acc-chevron">${Icons.chevronDown(16)}</div>
                </div>
                <div class="acc-body">
                    <div class="acc-preview">
                        <div class="acc-preview-placeholder">Carregando Preview...</div>
                        <iframe data-src="${app.url || ''}" class="preview-frame"></iframe>
                        <div class="acc-preview-overlay"></div>
                    </div>
                    <div class="acc-details">
                        <div>
                            <h4 class="acc-desc-label">Descrição</h4>
                            <p class="acc-desc">${app.desc || ''}</p>
                        </div>
                        <div class="acc-actions">
                            <div class="acc-launch-row">
                                <button onclick="event.stopPropagation(); FusionOS.launch('${app.id}', 'sandbox')" class="acc-btn acc-btn-sandbox">Janela</button>
                                <button onclick="event.stopPropagation(); FusionOS.launch('${app.id}', 'fusion')" class="acc-btn acc-btn-fusion">Fusão</button>
                            </div>
                            <div class="acc-mgmt-row">
                                <button onclick="event.stopPropagation(); FusionOS.toggleAppVisibility('${app.id}')" class="acc-mgmt-btn">${Icons.eyeOff(12)} Ocultar</button>
                                <button onclick="event.stopPropagation(); FusionOS.removeApp('${app.id}')" class="acc-mgmt-btn danger">${Icons.trash(12)} Remover</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    function renderAppsTab() {
        const visibleInstalled = _state.installed.filter(a => !_state.hiddenApps.includes(a.id));
        const installedByGroup = {};
        visibleInstalled.forEach(app => {
            const g = app.group || 'tools';
            (installedByGroup[g] = installedByGroup[g] || []).push(app);
        });

        const installedCodes = new Set(_state.installed.map(a => a.code || a.id));
        const availableByGroup = {};
        Object.entries(RAIDERS).forEach(([g, list]) => {
            const avail = list.filter(r => !installedCodes.has(r.code));
            if (avail.length) availableByGroup[g] = avail;
        });

        let html = '';

        // --- Instalados ---
        if (visibleInstalled.length) {
            html += RAIDERS_GROUPS
                .filter(g => installedByGroup[g.id]?.length)
                .map(g => `
                    <div class="group-section">
                        ${renderGroupHeader(g, installedByGroup[g.id].length)}
                        <div class="apps-list">${installedByGroup[g.id].map(renderAppCard).join('')}</div>
                    </div>
                `).join('');
        } else {
            html += `<div class="dash-empty">${Icons.ghost(48)}<p>Nenhum raider instalado ainda.</p></div>`;
        }

        // --- Raiders Disponíveis ---
        const availGroups = RAIDERS_GROUPS.filter(g => availableByGroup[g.id]?.length);
        if (availGroups.length) {
            html += `<div class="raiders-available-title">Raiders Disponíveis (${availGroups.reduce((a, g) => a + availableByGroup[g.id].length, 0)})</div>`;
            html += availGroups.map(g => `
                <div class="group-section">
                    ${renderGroupHeader(g, availableByGroup[g.id].length)}
                    <div class="raiders-grid">
                        ${availableByGroup[g.id].map(r => `
                            <button class="raider-chip" onclick="FusionOS.installRaider('${r.code}')" title="Instalar ${r.code}">
                                <span class="raider-chip-name">${r.name}</span>
                                <span class="raider-chip-code">${r.code}</span>
                            </button>
                        `).join('')}
                    </div>
                </div>
            `).join('');
        }

        return html;
    }

    // --- 6. ENGINE CORE ---
    return {
        boot: () => {
            console.log("%c FUSION OS v2.4 // RAIDERS REGISTRY ", "background:#000; color:#00f2ff; font-weight:bold;");

            // 1. Tenta carregar manifest salvo localmente (prioridade baixa)
            loadSavedManifest();

            // 2. Auto-sync via CDN (prioridade alta) — se configurado
            if (CONFIG.raidersManifestUrl) {
                loadRaidersFromCdn(CONFIG.raidersManifestUrl)
                    .then(() => { console.log('%c RAIDERS: manifest sincronizado via CDN', 'color:#22d3ee'); FusionOS.render(); })
                    .catch(err => console.warn('RAIDERS: falha ao sincronizar manifest CDN —', err.message));
            }

            UI.build();
            Utils.load();
            if (_state.customCSS) UI.injectCustomCSS(_state.customCSS);

            const monolith = document.getElementById('monolith-content');
            if (monolith) {
                const labHtml = `
                    <div class="session-window" id="fusion-lab-placeholder" style="display:none;">
                        <div class="lab-panel">
                            <div class="lab-header">
                                <h2 class="lab-title">Conversor de Monólitos</h2>
                                <label class="lab-upload">
                                    Importar .html <input id="lab-upload-file" type="file" />
                                </label>
                            </div>
                            <div class="lab-grid">
                                <textarea id="lab-input" placeholder="HTML Source..." class="lab-textarea"></textarea>
                                <textarea id="lab-output" readonly placeholder="Kernel Output..." class="lab-textarea output"></textarea>
                            </div>
                            <div class="lab-actions">
                                <button id="lab-convert-btn" class="lab-btn lab-btn-convert">Converter</button>
                                <button id="lab-inject-btn" class="lab-btn lab-btn-inject">Injetar</button>
                            </div>
                        </div>
                    </div>
                `;
                const fragment = document.createRange().createContextualFragment(labHtml);
                monolith.appendChild(fragment);

                const fileInput = document.getElementById('lab-upload-file');
                if (fileInput) fileInput.addEventListener('change', (ev) => FusionOS.handleUpload(ev.target));

                const convertBtn = document.getElementById('lab-convert-btn');
                if (convertBtn) convertBtn.addEventListener('click', () => {
                    const source = document.getElementById('lab-input').value;
                    document.getElementById('lab-output').value = Parser.convertFromHtmlSource(source);
                    Utils.speak("Processado.");
                });

                const injectBtn = document.getElementById('lab-inject-btn');
                if (injectBtn) injectBtn.addEventListener('click', () => {
                    const code = document.getElementById('lab-output').value;
                    if (!code) return Utils.speak("Nenhum kernel para injetar.");
                    Utils.speak("Injetando módulo.");
                    try { eval(code); } catch (e) { console.error(e); Utils.speak("Erro ao injetar."); }
                });
            }

            const term = document.getElementById('os-terminal');
            if (term) {
                term.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter') {
                        const cmd = term.value.toUpperCase().trim();
                        if (cmd) FusionOS.handleCommand(cmd);
                        term.value = '';
                        term.blur();
                    }
                });
            }

            FusionOS.render();
        },

        register: ({ name, code, url = null, html = null, desc = '', group = 'tools', icon = 'box' }) => {
            if (!code || (!url && !html)) return;
            if (_state.installed.find(m => m.code === code || m.id === code)) return;
            const id = (code || name).toString();
            const module = { id, name, code, url, html, desc, group, icon };
            _state.installed.unshift(module);
            Utils.save();
            FusionOS.render();
            Utils.speak(`Protocolo ${name} instalado.`);
        },

        installRaider: (code) => {
            const raider = BUILTINS[code];
            if (!raider) { Utils.speak("Raider não encontrado."); return; }
            FusionOS.register({ ...raider, code });
            Utils.speak("Instalado.");
        },

        toggle: () => {
            _state.active = !_state.active;
            const root = document.getElementById(CONFIG.rootId);
            const orb = document.getElementById('orb-trigger');
            if (root) root.classList.toggle('os-active', _state.active);
            if (orb) orb.classList.toggle('active', _state.active);
            if (_state.active) {
                Utils.triggerShake();
                const greeting = _state.userData.user && _state.userData.user !== 'Visitante' ? `Bem vindo, ${_state.userData.user}.` : "Sistema conectado.";
                Utils.speak(greeting);
            }
        },

        render: () => {
            const content = document.getElementById('monolith-content');
            if (!content) return;
            const user = _state.userData;

            if (_state.currentTab === 'dashboard') {
                const nameHash = Utils.generateHash(user.user);
                const h1 = nameHash % 360;
                const avatarSvg = `<svg viewBox="0 0 100 100"><defs><linearGradient id="avGrad"><stop offset="0%" stop-color="hsl(${h1}, 90%, 50%)"/><stop offset="100%" stop-color="hsl(${(h1+40)%360}, 90%, 50%)"/></linearGradient></defs><circle cx="50" cy="50" r="45" fill="#080b12" stroke="rgba(255,255,255,0.1)" stroke-width="2"/><circle cx="50" cy="50" r="20" fill="url(#avGrad)"/></svg>`;

                content.innerHTML = `
                    <div class="dash-root">
                        <div class="dash-card">
                            <div class="dash-card-inner">
                                <div class="dash-avatar">${avatarSvg}</div>
                                <div class="dash-info">
                                    <div class="dash-greeting">
                                        <span class="dash-hello">Olá,</span>
                                        <span class="dash-name">${user.user}</span>
                                    </div>
                                    <div class="dash-subtitle">DUAL // FUSION</div>
                                    <div class="dash-stats">
                                        <div class="dash-stat">
                                            <span class="dash-stat-label">SISTEMA</span>
                                            <span class="dash-stat-value">ONLINE</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="dash-terminal-wrap">
                            <div class="dash-terminal-glow"></div>
                            <div class="dash-terminal">
                                <div class="dash-terminal-icon">${Icons.terminal(20)}</div>
                                <input id="os-terminal-input" type="text"
                                    placeholder="INSIRA CODE MAP OU COMANDO..."
                                    class="dash-terminal-input"
                                    autocomplete="off"
                                    onkeydown="if(event.key === 'Enter') { FusionOS.handleCommand(this.value.trim().toUpperCase()); this.value = ''; }"
                                >
                                <button class="dash-terminal-submit"
                                    onclick="FusionOS.handleCommand(document.getElementById('os-terminal-input').value.trim().toUpperCase()); document.getElementById('os-terminal-input').value = '';">
                                    ${Icons.arrowRight(16)}
                                </button>
                            </div>
                            <div class="dash-terminal-hint">Pressione ENTER para injetar código</div>
                        </div>
                    </div>
                `;
            } else if (_state.currentTab === 'apps') {
                content.innerHTML = renderAppsTab();
            } else if (_state.currentTab === 'lab') {
                content.innerHTML = `
                    <div class="lab-root">
                        <div class="lab-panel">
                            <div class="lab-header">
                                <h2 class="lab-title">Conversor de Monólitos</h2>
                                <label class="lab-upload">
                                    Importar .html <input type="file" id="lab-upload-file-2" />
                                </label>
                            </div>
                            <div class="lab-grid">
                                <textarea id="lab-input-2" placeholder="HTML Source..." class="lab-textarea"></textarea>
                                <textarea id="lab-output-2" readonly placeholder="Kernel Output..." class="lab-textarea output"></textarea>
                            </div>
                            <div class="lab-actions">
                                <button id="lab-convert-btn-2" class="lab-btn lab-btn-convert">Converter</button>
                                <button id="lab-inject-btn-2" class="lab-btn lab-btn-inject">Injetar</button>
                            </div>
                        </div>

                        <div class="lab-panel">
                            <div class="lab-header">
                                <h2 class="lab-title">Raiders Registry (Manifest)</h2>
                                <label class="lab-upload">
                                    Importar JSON <input type="file" id="raiders-import-file" accept="application/json" />
                                </label>
                            </div>
                            <textarea id="raiders-manifest" class="lab-textarea manifest-input" placeholder='{"groups":[...],"raiders":[...]}'>${JSON.stringify(buildManifest(), null, 2)}</textarea>
                            <div class="lab-cdn-row">
                                <input id="raiders-cdn-url" class="lab-cdn-input" placeholder="https://cdn.jsdelivr.net/gh/USER/REPO@main/raiders.json" value="${CONFIG.raidersManifestUrl || ''}">
                                <button id="raiders-sync-cdn-btn" class="lab-btn lab-btn-convert">Sync CDN</button>
                            </div>
                            <div class="lab-actions">
                                <button id="raiders-apply-btn" class="lab-btn lab-btn-inject">Aplicar Manifest</button>
                                <button id="raiders-export-btn" class="lab-btn lab-btn-convert">Exportar .json</button>
                                <button id="raiders-reset-btn" class="lab-btn lab-btn-convert">Reset local</button>
                            </div>
                            <div class="lab-save-row">
                                <span class="lab-save-hint">Grupos: ${RAIDERS_GROUPS.length} · Raiders: ${Object.values(RAIDERS).reduce((a, l) => a + l.length, 0)}</span>
                                <span class="lab-save-hint">CDN aprovadas: jsDelivr, unpkg, cdnjs, statically, raw.githubusercontent</span>
                            </div>
                        </div>

                        <div class="lab-panel grow">
                            <h2 class="lab-title purple" style="margin-bottom:16px;">Global Styles Override</h2>
                            <textarea id="css-input" placeholder="/* Cole seu CSS aqui */" class="lab-textarea css-input custom-scroll">${_state.customCSS || ''}</textarea>
                            <div class="lab-save-row">
                                <span class="lab-save-hint">Aplica-se imediatamente. Persistente.</span>
                                <button id="save-css-btn" class="lab-btn-save">Salvar CSS</button>
                            </div>
                        </div>
                    </div>
                `;

                setTimeout(() => FusionOS.wireLab(), 60);
            }
        },

        wireLab: () => {
            // --- Conversor ---
            const up = document.getElementById('lab-upload-file-2');
            if (up) up.addEventListener('change', (e) => FusionOS.handleUpload(e.target));

            const convBtn = document.getElementById('lab-convert-btn-2');
            if (convBtn) convBtn.addEventListener('click', () => {
                const src = document.getElementById('lab-input-2').value;
                document.getElementById('lab-output-2').value = Parser.convertFromHtmlSource(src);
                Utils.speak("Processado.");
            });

            const injBtn = document.getElementById('lab-inject-btn-2');
            if (injBtn) injBtn.addEventListener('click', () => {
                const code = document.getElementById('lab-output-2').value;
                if (!code) { Utils.speak("Nenhum kernel para injetar."); return; }
                try { eval(code); Utils.speak("Módulo injetado."); } catch (e) { console.error(e); Utils.speak("Erro ao injetar."); }
            });

            // --- CSS global ---
            const cssBtn = document.getElementById('save-css-btn');
            if (cssBtn) cssBtn.addEventListener('click', () => {
                const css = document.getElementById('css-input').value;
                _state.customCSS = css;
                UI.injectCustomCSS(css);
                Utils.save();
                Utils.speak("Estilos globais atualizados.");
            });

            // --- Raiders Manifest ---
            const applyBtn = document.getElementById('raiders-apply-btn');
            if (applyBtn) applyBtn.addEventListener('click', () => {
                try {
                    const txt = document.getElementById('raiders-manifest').value;
                    const m = JSON.parse(txt);
                    applyManifest(m);
                    FusionOS.render();
                    Utils.speak("Manifest aplicado.");
                } catch (e) {
                    alert('Manifest inválido: ' + e.message);
                }
            });

            const exportBtn = document.getElementById('raiders-export-btn');
            if (exportBtn) exportBtn.addEventListener('click', exportManifestDownload);

            const resetBtn = document.getElementById('raiders-reset-btn');
            if (resetBtn) resetBtn.addEventListener('click', () => {
                if (!confirm('Resetar para os Raiders padrão (remover manifest salvo)?')) return;
                localStorage.removeItem(CONFIG.raidersKey);
                location.reload();
            });

            const syncBtn = document.getElementById('raiders-sync-cdn-btn');
            if (syncBtn) syncBtn.addEventListener('click', async () => {
                const url = document.getElementById('raiders-cdn-url').value.trim();
                if (!url) { alert('Informe a URL do manifest.'); return; }
                try {
                    await loadRaidersFromCdn(url);
                    document.getElementById('raiders-manifest').value = JSON.stringify(buildManifest(), null, 2);
                    FusionOS.render();
                    Utils.speak("Manifest sincronizado da CDN.");
                } catch (e) {
                    alert('Falha: ' + e.message);
                }
            });

            const importFile = document.getElementById('raiders-import-file');
            if (importFile) importFile.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = (ev) => {
                    try {
                        const m = JSON.parse(ev.target.result);
                        applyManifest(m);
                        FusionOS.render();
                        Utils.speak("Arquivo importado.");
                    } catch (err) {
                        alert('JSON inválido: ' + err.message);
                    }
                };
                reader.readAsText(file);
            });
        },

        // --- API pública de Raiders ---
        exportRaiders: () => buildManifest(),
        importRaidersManifest: (obj) => { applyManifest(obj); FusionOS.render(); },
        syncRaidersFromCdn: async (url) => { await loadRaidersFromCdn(url); FusionOS.render(); },

        launch: async (code, mode) => {
            const module = _state.installed.find(m => m.code === code || m.id === code);
            if (!module) return Utils.speak("Módulo não encontrado.");

            if (mode === 'sandbox') {
                const rt = document.getElementById('os-runtime');
                const frame = document.getElementById('os-frame');
                if (!rt || !frame) return;
                rt.classList.add('visible');
                if (module.url) frame.src = module.url;
                else frame.srcdoc = module.html || '';
                Utils.speak(`Abrindo ${module.name}.`);
            } else if (mode === 'fusion') {
                FusionOS.performFusion(module);
            }
        },

        performFusion: async (module) => {
            const layer = document.getElementById(CONFIG.fusionLayerId);
            if (!layer) return alert("Erro: NavRoot não encontrado.");
            if (_state.active) FusionOS.toggle();
            document.getElementById('fusion-exit-ctrl').classList.remove('hidden');
            Utils.speak("Fusão iniciada.");

            if (module.url) {
                try {
                    const resp = await fetch(module.url);
                    if (!resp.ok) throw new Error("Network");
                    const content = await resp.text();
                    FusionOS.injectIntoDOM(layer, content);
                } catch (e) {
                    const ifr = document.createElement('iframe');
                    ifr.src = module.url;
                    ifr.style.cssText = "width:100vw; height:100vh; border:none; position:fixed; inset:0; z-index:10015; background:black;";
                    layer.appendChild(ifr);
                }
            } else if (module.html) {
                FusionOS.injectIntoDOM(layer, module.html);
            } else {
                Utils.speak("Conteúdo do módulo indisponível.");
            }
        },

        injectIntoDOM: (target, html) => {
            target.innerHTML = html;
            target.querySelectorAll('script').forEach(old => {
                const s = document.createElement('script');
                [...old.attributes].forEach(a => s.setAttribute(a.name, a.value));
                s.textContent = old.textContent;
                old.replaceWith(s);
            });
        },

        exitFusion: () => {
            const layer = document.getElementById(CONFIG.fusionLayerId);
            if (layer) layer.innerHTML = '';
            document.getElementById('fusion-exit-ctrl').classList.add('hidden');
            Utils.speak("Fusão encerrada.");
            if (!_state.active) FusionOS.toggle();
        },

        closeRuntime: () => {
            const rt = document.getElementById('os-runtime');
            if (!rt) return;
            rt.classList.remove('visible');
            setTimeout(() => {
                const frame = document.getElementById('os-frame');
                if (frame) frame.src = '';
            }, 500);
        },

        handleCommand: (cmd) => {
            if (!cmd) return;
            if (cmd === 'RESET') {
                localStorage.removeItem(CONFIG.key);
                localStorage.removeItem(CONFIG.raidersKey);
                location.reload();
                return;
            }

            const raider = BUILTINS[cmd];
            if (raider) {
                FusionOS.register({ ...raider, code: cmd });
                Utils.speak("Código aceito.");
            } else {
                const term = document.getElementById('os-terminal');
                if (term) {
                    term.style.borderColor = 'red';
                    term.style.color = 'red';
                    setTimeout(() => { term.style.borderColor = ''; term.style.color = ''; }, 500);
                }
                Utils.speak("Comando não reconhecido.");
            }
        },

        handleUpload: (inputEl) => {
            const file = inputEl.files ? inputEl.files[0] : (inputEl instanceof File ? inputEl : null);
            if (!file) return Utils.speak("Nenhum arquivo selecionado.");
            const reader = new FileReader();
            reader.onload = (e) => {
                const labIn = document.getElementById('lab-input-2') || document.getElementById('lab-input');
                if (labIn) labIn.value = e.target.result;
                const out = document.getElementById('lab-output-2') || document.getElementById('lab-output');
                if (out) out.value = Parser.convertFromHtmlSource(e.target.result);
                Utils.speak("Arquivo carregado.");
            };
            reader.readAsText(file);
        },

        toggleAccordion: (appId) => {
            const el = document.getElementById(`acc-${appId}`);
            if (!el) return;
            const isExpanded = el.classList.contains('expanded');
            document.querySelectorAll('.accordion-item').forEach(i => {
                i.classList.remove('expanded'); i.style.height = '70px';
            });
            if (!isExpanded) {
                el.classList.add('expanded'); el.style.height = '320px';
                const iframe = el.querySelector('iframe');
                if (iframe && !iframe.src && iframe.dataset.src) iframe.src = iframe.dataset.src;
            }
        },

        toggleAppVisibility: (id) => {
            if (_state.hiddenApps.includes(id)) {
                _state.hiddenApps = _state.hiddenApps.filter(h => h !== id);
                Utils.speak("App visível.");
            } else {
                _state.hiddenApps.push(id);
                Utils.speak("App ocultado.");
            }
            Utils.save();
            FusionOS.render();
        },

        removeApp: (id) => {
            if (!confirm("Remover este módulo permanentemente?")) return;
            _state.installed = _state.installed.filter(a => (a.id !== id && a.code !== id));
            Utils.save();
            FusionOS.render();
            Utils.speak("Módulo desinstalado.");
        },

        setTab: (tab) => {
            _state.currentTab = tab;
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            const btn = document.getElementById(`tab-${tab}`);
            if (btn) btn.classList.add('active');
            const contextMap = { 'dashboard': 'DASHBOARD', 'apps': 'MODULES', 'lab': 'SYSTEM_LAB' };
            const headerCtx = document.getElementById('header-context');
            if (headerCtx) headerCtx.innerText = contextMap[tab] || 'SYSTEM';
            FusionOS.render();
        }
    };
})();
FusionOS.boot();