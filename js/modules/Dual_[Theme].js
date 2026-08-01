(function(bundle,s='#inject-here'){
const p=new DOMParser();
const c=p.parseFromString(
bundle,
'text/html'
);
const t=
document.querySelector(s)
||document.body;
// CSS
Array.from(
c.querySelectorAll('style')
)
.forEach(style=>{
const n=
document.createElement('style');
n.textContent=
style.textContent;
document.head.appendChild(n);
});
// HTML
const f=
document.createDocumentFragment();
Array.from(
c.body.childNodes
)
.forEach(node=>{
if(node.nodeName!=='SCRIPT'){
f.appendChild(
document.importNode(node,true)
);
}
});
t.appendChild(f);
// JS
Array.from(
c.querySelectorAll('script')
)
.forEach(x=>{
const n=
document.createElement('script');
for(
const a of x.attributes
)
n.setAttribute(
a.name,
a.value
);
n.textContent=
x.textContent;
document.body.appendChild(n);
});
})(`<!DOCTYPE html>
<html lang="pt-BR" data-theme="dark">
<head>
<meta charset="UTF-8">
<meta
    name="viewport"
    content="width=device-width,
             initial-scale=1,
             maximum-scale=1,
             user-scalable=no">
<title>DUAL · Global System</title>
<style>
/* ═══════════════════════════════════════════════════════
   DUAL CORE · GLOBAL TOKENS
═══════════════════════════════════════════════════════ */
:root {
    color-scheme: dark;
    --bg: #050507;
    --panel:
        rgba(18, 18, 22, .82);
    --panel-solid:
        #121216;
    --border:
        rgba(255, 255, 255, .10);
    --text:
        #f5f5f7;
    --muted:
        rgba(255, 255, 255, .52);
    --cyan:
        #00e5ff;
    --purple:
        #bf5af2;
    --gold:
        #ffd60a;
    --input-bg:
        rgba(255, 255, 255, .055);
    --button-bg:
        rgba(255, 255, 255, .07);
    --topbar-bg:
        rgba(5, 5, 7, .82);
    --dock-bg:
        rgba(10, 10, 13, .92);
    --shadow:
        0 10px 40px
        rgba(0, 0, 0, .35);
    --radius:
        18px;
    --transition:
        .25s ease;
}
/* ═══════════════════════════════════════════════════════
   LIGHT
═══════════════════════════════════════════════════════ */
html[data-theme="light"] {
    color-scheme: light;
    --bg:
        #f5f5f7;
    --panel:
        rgba(255, 255, 255, .85);
    --panel-solid:
        #ffffff;
    --border:
        rgba(0, 0, 0, .08);
    --text:
        #1a1a1e;
    --muted:
        rgba(0, 0, 0, .50);
    --cyan:
        #007aff;
    --purple:
        #af52de;
    --gold:
        #d4a017;
    --input-bg:
        rgba(0, 0, 0, .035);
    --button-bg:
        rgba(0, 0, 0, .045);
    --topbar-bg:
        rgba(255, 255, 255, .82);
    --dock-bg:
        rgba(255, 255, 255, .92);
    --shadow:
        0 10px 40px
        rgba(0, 0, 0, .10);
}
/* ═══════════════════════════════════════════════════════
   RESET
═══════════════════════════════════════════════════════ */
* {
    box-sizing:
        border-box;
    -webkit-tap-highlight-color:
        transparent;
}
html,
body {
    margin:
        0;
    padding:
        0;
    width:
        100%;
    min-height:
        100%;
    background:
        var(--bg);
    color:
        var(--text);
    font-family:
        -apple-system,
        BlinkMacSystemFont,
        "SF Pro Display",
        "SF Pro Text",
        Inter,
        system-ui,
        sans-serif;
    transition:
        background-color
        var(--transition),
        color
        var(--transition);
}
/* ═══════════════════════════════════════════════════════
   APP
═══════════════════════════════════════════════════════ */
.dual-app {
    min-height:
        100vh;
    background:
        var(--bg);
    color:
        var(--text);
}
/* ═══════════════════════════════════════════════════════
   HEADER FLUTUANTE
═══════════════════════════════════════════════════════ */
.topbar {
    position:
        fixed;
    top:
        0;
    left:
        0;
    right:
        0;
    z-index:
        1000;
    display:
        flex;
    align-items:
        center;
    justify-content:
        space-between;
    min-height:
        56px;
    padding:
        10px 16px;
    background:
        var(--topbar-bg);
    border-bottom:
        1px solid
        var(--border);
    backdrop-filter:
        blur(24px);
    -webkit-backdrop-filter:
        blur(24px);
    transform:
        translateY(0);
    transition:
        transform
        .32s
        cubic-bezier(.22, 1, .36, 1),
        opacity
        .25s
        ease,
        background
        var(--transition),
        border-color
        var(--transition);
}
/* ═══════════════════════════════════════════════════════
   HEADER ESCONDIDO DURANTE SCROLL DOWN
═══════════════════════════════════════════════════════ */
.topbar.header-hidden {
    transform:
        translateY(
            calc(-100% - 12px)
        );
    opacity:
        .15;
    pointer-events:
        none;
}
/* ═══════════════════════════════════════════════════════
   HEADER VISÍVEL
═══════════════════════════════════════════════════════ */
.topbar.header-visible {
    transform:
        translateY(0);
    opacity:
        1;
    pointer-events:
        auto;
}
/* ═══════════════════════════════════════════════════════
   BRAND
═══════════════════════════════════════════════════════ */
.brand {
    display:
        flex;
    align-items:
        center;
    gap:
        10px;
    font-weight:
        700;
    letter-spacing:
        .08em;
}
.badge {
    padding:
        5px 9px;
    border-radius:
        999px;
    background:
        var(--button-bg);
    color:
        var(--muted);
    font-size:
        10px;
    letter-spacing:
        .08em;
}
/* ═══════════════════════════════════════════════════════
   THEME DOT
   UMA ÚNICA BOLINHA
═══════════════════════════════════════════════════════ */
.theme-dot {
    position:
        relative;
    width:
        30px;
    height:
        30px;
    padding:
        0;
    border:
        1px solid
        var(--border);
    border-radius:
        50%;
    background:
        var(--button-bg);
    color:
        var(--text);
    cursor:
        pointer;
    display:
        grid;
    place-items:
        center;
    transition:
        transform
        .2s ease,
        background
        var(--transition),
        border-color
        var(--transition),
        box-shadow
        var(--transition);
}
.theme-dot::before {
    content:
        "";
    width:
        10px;
    height:
        10px;
    border-radius:
        50%;
    background:
        var(--cyan);
    box-shadow:
        0 0 12px
        var(--cyan);
    transition:
        all
        var(--transition);
}
.theme-dot:hover {
    transform:
        scale(1.08);
    border-color:
        var(--cyan);
    box-shadow:
        0 0 20px
        color-mix(
            in srgb,
            var(--cyan) 20%,
            transparent
        );
}
/* ═══════════════════════════════════════════════════════
   CONTENT
═══════════════════════════════════════════════════════ */
#main-content {
    padding-top:
        56px;
    opacity:
        1;
    visibility:
        visible;
    pointer-events:
        auto;
    max-height:
        50000px;
    overflow:
        hidden;
    transition:
        opacity
        .35s
        ease,
        max-height
        .35s
        ease,
        visibility
        .35s
        ease,
        padding
        .35s
        ease;
}
/* ═══════════════════════════════════════════════════════
   HEADER COLLAPSE
   CLIQUE NO HEADER
═══════════════════════════════════════════════════════ */
#main-content.hidden {
    opacity:
        0;
    visibility:
        hidden;
    pointer-events:
        none;
    max-height:
        0;
    padding-top:
        0;
    padding-bottom:
        0;
}
/* ═══════════════════════════════════════════════════════
   CONTENT
═══════════════════════════════════════════════════════ */
.content {
    width:
        min(
            900px,
            100%
        );
    margin:
        0 auto;
    padding:
        28px 18px 120px;
}
/* ═══════════════════════════════════════════════════════
   PANELS
═══════════════════════════════════════════════════════ */
.panel,
.card,
.modal,
.drawer,
.sidebar,
.sheet,
.deck,
.overlay-panel,
.fractal-block,
.preview-card {
    background:
        var(--panel);
    color:
        var(--text);
    border:
        1px solid
        var(--border);
    border-radius:
        var(--radius);
    box-shadow:
        var(--shadow);
    backdrop-filter:
        blur(20px);
    -webkit-backdrop-filter:
        blur(20px);
    transition:
        background
        var(--transition),
        border-color
        var(--transition),
        color
        var(--transition),
        box-shadow
        var(--transition);
}
/* ═══════════════════════════════════════════════════════
   FIELD
═══════════════════════════════════════════════════════ */
.field {
    display:
        grid;
    gap:
        8px;
    margin-bottom:
        18px;
}
.field label {
    color:
        var(--muted);
    font-size:
        12px;
    font-weight:
        600;
}
textarea,
input,
select {
    width:
        100%;
    padding:
        14px;
    border:
        1px solid
        var(--border);
    border-radius:
        14px;
    outline:
        none;
    background:
        var(--input-bg);
    color:
        var(--text);
    font:
        inherit;
}
/* ═══════════════════════════════════════════════════════
   DEMO
═══════════════════════════════════════════════════════ */
.demo {
    min-height:
        1200px;
    padding:
        24px;
}
</style>
</head>
<body>
<div class="dual-app">
<!-- ═══════════════════════════════════════════════════════
     HEADER GLOBAL
     1. TOCAR NO HEADER
        → COLAPSA MAIN
     2. TOCAR NA BOLINHA
        → MUDA TEMA
     3. ROLAR PARA BAIXO
        → HEADER SOBE
     4. ROLAR PARA CIMA
        → HEADER VOLTA
═══════════════════════════════════════════════════════ -->
<header
    class="topbar header-visible"
    id="main-header">
    <!-- ÁREA DO SISTEMA -->
    <div class="brand">
        <span>
            DUAL
        </span>
        <span class="badge">
            GLOBAL
        </span>
    </div>
    <!-- ÚNICO CONTROLE DE TEMA -->

  <button
        id="theme-dot"
        class="theme-dot"
        type="button"
        aria-label="Alternar tema"
        title="Alternar tema">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px;"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
       </button>  


</header>
<!-- ═══════════════════════════════════════════════════════
     MAIN
═══════════════════════════════════════════════════════ -->
<main id="main-content">
    <div class="content">
        <section style="display:none" class="panel demo">
        </section>
    </div>
</main>
</div>
<script>
/* ═══════════════════════════════════════════════════════
   DUAL MONOLITH
   THEME + HEADER COLLAPSE + SMART HEADER
═══════════════════════════════════════════════════════ */
(() => {
"use strict";
/* ═══════════════════════════════════════════════════════
   ELEMENTOS
═══════════════════════════════════════════════════════ */
const ROOT =
    document.documentElement;
const HEADER =
    document.getElementById(
        "main-header"
    );
const MAIN =
    document.getElementById(
        "main-content"
    );
const THEME_DOT =
    document.getElementById(
        "theme-dot"
    );
/* ═══════════════════════════════════════════════════════
   THEME ENGINE
═══════════════════════════════════════════════════════ */
const STORAGE_KEY =
    "dual-theme";
function applyTheme(theme) {
    const nextTheme =
        theme === "light"
            ? "light"
            : "dark";
    ROOT.dataset.theme =
        nextTheme;
    try {
        localStorage.setItem(
            STORAGE_KEY,
            nextTheme
        );
    } catch (error) {
        console.warn(
            "DUAL Theme · localStorage indisponível"
        );
    }
    /*
     * Evento global.
     *
     * Qualquer módulo do sistema pode ouvir:
     *
     * window.addEventListener(
     *     "dual:theme-change",
     *     e => {}
     * );
     */
    window.dispatchEvent(
        new CustomEvent(
            "dual:theme-change",
            {
                detail: {
                    theme:
                        nextTheme
                }
            }
        )
    );
}
function getInitialTheme() {
    try {
        const saved =
            localStorage.getItem(
                STORAGE_KEY
            );
        if (
            saved === "light" ||
            saved === "dark"
        ) {
            return saved;
        }
    } catch (error) {}
    return "dark";
}
/* ═══════════════════════════════════════════════════════
   API GLOBAL
═══════════════════════════════════════════════════════ */
window.DualTheme = {
    set(theme) {
        applyTheme(
            theme
        );
    },
    toggle() {
        const current =
            ROOT.dataset.theme ||
            "dark";
        applyTheme(
            current === "light"
                ? "dark"
                : "light"
        );
    },
    get() {
        return (
            ROOT.dataset.theme ||
            "dark"
        );
    }
};
/* ═══════════════════════════════════════════════════════
   BOLINHA DE TEMA
═══════════════════════════════════════════════════════ */
if (THEME_DOT) {
    THEME_DOT.addEventListener(
        "click",
        event => {
            /*
             * Impede que o clique
             * chegue ao header.
             *
             * Assim a bolinha troca
             * o tema sem colapsar
             * o conteúdo.
             */
            event.stopPropagation();
            DualTheme.toggle();
        }
    );
}
/* ═══════════════════════════════════════════════════════
   HEADER → COLLAPSE DO MAIN
═══════════════════════════════════════════════════════ */
if (HEADER && MAIN) {
    HEADER.addEventListener(
        "click",
        event => {
            /*
             * Se o clique veio da bolinha,
             * não executa o collapse.
             */
            if (
                event.target.closest(
                    "#theme-dot"
                )
            ) {
                return;
            }
            MAIN.classList.toggle(
                "hidden"
            );
            const collapsed =
                MAIN.classList.contains(
                    "hidden"
                );
            HEADER.classList.toggle(
                "is-collapsed",
                collapsed
            );
            /*
             * Evento para futuras
             * Symbol Bars / Navigation.
             */
            window.dispatchEvent(
                new CustomEvent(
                    "dual:content-collapse",
                    {
                        detail: {
                            collapsed
                        }
                    }
                )
            );
        }
    );
}
/* ═══════════════════════════════════════════════════════
   SMART HEADER
   SCROLL DOWN → ESCONDE
   SCROLL UP   → MOSTRA
═══════════════════════════════════════════════════════ */
let lastScrollY =
    window.scrollY;
let ticking =
    false;
const SCROLL_THRESHOLD =
    8;
/* Função de controle */
function updateHeader() {
    const currentScrollY =
        window.scrollY;
    /*
     * No topo:
     * sempre mostra.
     */
    if (
        currentScrollY <= 10
    ) {
        HEADER.classList.remove(
            "header-hidden"
        );
        HEADER.classList.add(
            "header-visible"
        );
        lastScrollY =
            currentScrollY;
        ticking =
            false;
        return;
    }
    /*
     * Scroll para baixo
     * → header sobe.
     */
    if (
        currentScrollY >
        lastScrollY +
        SCROLL_THRESHOLD
    ) {
        HEADER.classList.remove(
            "header-visible"
        );
        HEADER.classList.add(
            "header-hidden"
        );
    }
    /*
     * Scroll para cima
     * → header retorna.
     */
    else if (
        currentScrollY <
        lastScrollY -
        SCROLL_THRESHOLD
    ) {
        HEADER.classList.remove(
            "header-hidden"
        );
        HEADER.classList.add(
            "header-visible"
        );
    }
    lastScrollY =
        currentScrollY;
    ticking =
        false;
}
/* Scroll otimizado */
window.addEventListener(
    "scroll",
    () => {
        if (
            !ticking
        ) {
            window.requestAnimationFrame(
                updateHeader
            );
            ticking =
                true;
        }
    },
    {
        passive:
            true
    }
);
/* ═══════════════════════════════════════════════════════
   INICIALIZAÇÃO
═══════════════════════════════════════════════════════ */
applyTheme(
    getInitialTheme()
);
console.log(
    "DUAL · GLOBAL SYSTEM READY"
);
})();
</script>
</body>
</html>`);