(function(bundle,s='#Dual-Theme'){
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
c.querySelectorAll('zstyle')
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



/* =========================================================
KOBLLUX × DUAL
GLOBAL THEME OVERRIDE
LIGHT / DARK / GLASS / ARCHETYPE
========================================================= */

/* =========================================================
CORE TOKENS
========================================================= */

:root {

color-scheme:
    dark;
/* BASE */
--bg:
    #050507;
--bg-elevated:
    #0a0a0e;
--panel:
    rgba(18, 18, 22, .68);
--panel-solid:
    #121216;
--surface:
    rgba(255, 255, 255, .045);
--surface-hover:
    rgba(255, 255, 255, .08);
/* TEXTO */
--text:
    #f5f5f7;
--text-strong:
    #ffffff;
--muted:
    rgba(255, 255, 255, .58);
--subtle:
    rgba(255, 255, 255, .38);
/* BORDAS */
--border:
    rgba(255, 255, 255, .08);
--border-strong:
    rgba(255, 255, 255, .15);
/* INPUT */
--input-bg:
    rgba(255, 255, 255, .055);
--input-text:
    var(--text);
--placeholder:
    rgba(255, 255, 255, .35);
/* BUTTON */
--button-bg:
    rgba(255, 255, 255, .07);
--button-hover:
    rgba(255, 255, 255, .12);
--button-text:
    var(--text);
/* GLASS */
--glass-bg:
    rgba(255, 255, 255, .055);
--glass-border:
    rgba(255, 255, 255, .08);
--glass-blur:
    24px;
--glass-saturate:
    150%;
/* SHADOW */
--shadow:
    0 20px 60px
    rgba(0, 0, 0, .28);
/* GEOMETRIA */
--radius:
    39px;
--radius-small:
    20px;
/* SISTEMA */
--transition:
    .25s ease;

}

/* =========================================================
LIGHT MODE
========================================================= */

html[data-theme=“light”] {

color-scheme:
    light;
/* BASE CLARA */
--bg:
    #f5f5f7;
--bg-elevated:
    #ffffff;
/* GLASS CLARO */
--panel:
    rgba(255, 255, 255, .72);
--panel-solid:
    #ffffff;
--surface:
    rgba(0, 0, 0, .025);
--surface-hover:
    rgba(0, 0, 0, .055);
/* TEXTO */
--text:
    #1c1c1e;
--text-strong:
    #000000;
--muted:
    rgba(28, 28, 30, .60);
--subtle:
    rgba(28, 28, 30, .38);
/* BORDAS */
--border:
    rgba(0, 0, 0, .07);
--border-strong:
    rgba(0, 0, 0, .12);
/* INPUT */
--input-bg:
    rgba(0, 0, 0, .035);
--input-text:
    #1c1c1e;
--placeholder:
    rgba(28, 28, 30, .38);
/* BUTTON */
--button-bg:
    rgba(0, 0, 0, .045);
--button-hover:
    rgba(0, 0, 0, .08);
--button-text:
    #1c1c1e;
/* GLASS */
--glass-bg:
    rgba(255, 255, 255, .64);
--glass-border:
    rgba(0, 0, 0, .07);
/* SHADOW */
--shadow:
    0 20px 60px
    rgba(0, 0, 0, .10);

}

/* =========================================================
GLOBAL RESET
========================================================= */

* {
    box-sizing:
    border-box;
    -webkit-tap-highlight-color:
    transparent;

}

/* =========================================================
GLOBAL BASE
========================================================= */

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
transition:
    background
    var(--transition),
    color
    var(--transition);

}

/* =========================================================
MAIN GLOBAL
========================================================= */

#main-content {

width:
    100%;
min-height:
    100vh;
padding-top:
    56px;
padding-left:
    0;
padding-right:
    0;
background:
    var(--bg);
color:
    var(--text);

}

/* =========================================================
CONTENT
========================================================= */

.content {

width:
    100%;
max-width:
    100%;
margin:
    0 auto;
padding:
    28px
    0
    120px;

}

/* =========================================================
TYPOGRAPHY
========================================================= */

h1,
h2,
h3,
h4,
h5,
h6 {

color:
    var(--text-strong);

}

p,
span,
li,
label,
small {

color:
    inherit;

}

.text,
.text-primary {

color:
    var(--text);

}

.text-muted,
.muted,
.secondary {

color:
    var(--muted);

}

/* =========================================================
KOBLLUX ARCHETYPE COLORS
NÃO SOBRESCREVER
========================================================= */

.kob-voice-primary,
.voice-primary,
[data-voice-primary] {

color:
    var(--kob-voice-primary);

}

.kob-voice-secondary,
.voice-secondary,
[data-voice-secondary] {

color:
    var(--kob-voice-secondary);

}

/* =========================================================
ARCHETYPE COLOR HOOKS
O TEMA NÃO TOMA POSSE DESTAS CORES
========================================================= */

.kob-accent,
.voice-accent,
.archetype-color {

color:
    var(--kob-voice-primary);

}

.kob-accent-secondary,
.voice-accent-secondary {

color:
    var(--kob-voice-secondary);

}

/* =========================================================
GLOBAL GLASS
========================================================= */

.panel,
.card,
.modal,
.drawer,
.sidebar,
.sheet,
.deck,
.overlay-panel,
.fractal-block,
.preview-card,
.glass,
.surface,
[class*=“panel”],
[class*=“card”],
[class*=“modal”],
[class*=“drawer”] {

background:
    var(--glass-bg);
color:
    var(--text);
border:
    0;
border-radius:
    var(--radius);
box-shadow:
    var(--shadow);
backdrop-filter:
    blur(
        var(--glass-blur)
    )
    saturate(
        var(--glass-saturate)
    );
-webkit-backdrop-filter:
    blur(
        var(--glass-blur)
    )
    saturate(
        var(--glass-saturate)
    );
transition:
    background
    var(--transition),
    color
    var(--transition),
    box-shadow
    var(--transition);

}

/* =========================================================
LIGHT GLASS
========================================================= */

html[data-theme=“light”] .panel,
html[data-theme=“light”] .card,
html[data-theme=“light”] .modal,
html[data-theme=“light”] .drawer,
html[data-theme=“light”] .sidebar,
html[data-theme=“light”] .sheet,
html[data-theme=“light”] .deck,
html[data-theme=“light”] .overlay-panel,
html[data-theme=“light”] .preview-card {

background:
    rgba(
        255,
        255,
        255,
        .68
    );
box-shadow:
    0
    20px
    60px
    rgba(
        0,
        0,
        0,
        .08
    );

}

/* =========================================================
GLOBAL BUTTONS
SEMPRE SEM BORDA
========================================================= */

button,
.btn,
.button,
[role=“button”] {

border:
    0 !important;
outline:
    none;
border-radius:
    39px !important;
background:
    var(--button-bg);
color:
    var(--button-text);
font:
    inherit;
cursor:
    pointer;
transition:
    background
    var(--transition),
    color
    var(--transition),
    transform
    .2s ease,
    box-shadow
    var(--transition);

}

/* =========================================================
BUTTON HOVER
========================================================= */

button:hover,
.btn:hover,
.button:hover,
[role=“button”]:hover {

background:
    var(--button-hover);

}

/* =========================================================
BUTTON ACTIVE
========================================================= */

button:active,
.btn:active,
.button:active {

transform:
    scale(.96);

}

/* =========================================================
BUTTON PRIMARY
USA O ARCHETYPE
========================================================= */

.btn-primary,
.button-primary,
.primary-btn {

background:
    var(--kob-voice-primary);
color:
    #ffffff;
border:
    0 !important;

}

/* =========================================================
BUTTON SECONDARY
========================================================= */

.btn-secondary,
.button-secondary,
.secondary-btn {

background:
    var(--kob-voice-secondary);
color:
    #ffffff;
border:
    0 !important;

}

/* =========================================================
INPUTS
========================================================= */

input,
textarea,
select {

width:
    100%;
background:
    var(--input-bg);
color:
    var(--input-text);
border:
    0;
border-radius:
    39px;
outline:
    none;
padding:
    14px 18px;
font:
    inherit;
transition:
    background
    var(--transition),
    color
    var(--transition),
    box-shadow
    var(--transition);

}

textarea {

border-radius:
    24px;

}

input::placeholder,
textarea::placeholder {

color:
    var(--placeholder);

}

input:focus,
textarea:focus,
select:focus {

box-shadow:
    0
    0
    0
    3px
    color-mix(
        in srgb,
        var(--kob-voice-primary)
        18%,
        transparent
    );

}

/* =========================================================
BADGES / PILLS / CHIPS
========================================================= */

.badge,
.chip,
.tag,
.pill {

border:
    0;
border-radius:
    39px;
background:
    var(--surface);
color:
    var(--muted);

}

/* =========================================================
HEADER
========================================================= */

.topbar {

background:
    var(--glass-bg);
color:
    var(--text);
border:
    0;
border-bottom:
    0;
backdrop-filter:
    blur(
        24px
    )
    saturate(
        150%
    );
-webkit-backdrop-filter:
    blur(
        24px
    )
    saturate(
        150%
    );

}

/* =========================================================
THEME DOT
========================================================= */

.theme-dot {

border:
    0 !important;
border-radius:
    50% !important;
background:
    var(--surface);
color:
    var(--text);

}

/* =========================================================
OVERRIDE DE ELEMENTOS INLINE ESCUROS
LIGHT MODE
========================================================= */

html[data-theme=“light”]

[style*=“background:#000”],
html[data-theme=“light”]

[style*=“background: #000”],
html[data-theme=“light”]

[style*=“background:#050507”],
html[data-theme=“light”]

[style*=“background: #050507”] {

background:
    var(--bg) !important;

}

html[data-theme=“light”]

[style*=“background:#121216”],
html[data-theme=“light”]

[style*=“background: #121216”] {

background:
    var(--panel-solid) !important;

}

/* =========================================================
OVERRIDE DE TEXTO INLINE BRANCO
========================================================= */

html[data-theme=“light”]

[style*=“color:#fff”],
html[data-theme=“light”]

[style*=“color: #fff”],
html[data-theme=“light”]

[style*=“color:white”],
html[data-theme=“light”]

[style*=“color: white”],
html[data-theme=“light”]

[style*=“color:#ffffff”],
html[data-theme=“light”]

[style*=“color: #ffffff”] {

color:
    var(--text-strong) !important;

}

/* =========================================================
DIVISÓRIAS
========================================================= */

hr {

border:
    0;
border-top:
    1px solid
    var(--border);

}

/* =========================================================
KOBLLUX BLOB / ORB / GLOW
O LIGHT MODE NÃO MATA AS CORES DO ARCHETYPE
========================================================= */

.blob,
.orb,
.glow,
.voice-orb,
.archetype-orb {

background:
    radial-gradient(
        circle,
        var(--kob-voice-primary),
        transparent
        70%
    );
opacity:
    .65;
filter:
    blur(30px);
pointer-events:
    none;

}

/* =========================================================
OVERLAY DE ARCHETYPE
========================================================= */

.voice-overlay,
.archetype-overlay,
.kob-overlay {

background:
    linear-gradient(
        135deg,
        color-mix(
            in srgb,
            var(--kob-voice-primary)
            14%,
            transparent
        ),
        color-mix(
            in srgb,
            var(--kob-voice-secondary)
            10%,
            transparent
        )
    );
pointer-events:
    none;

}

/* =========================================================
LIGHT MODE
PRESERVA OS BLOBS
========================================================= */

html[data-theme=“light”]

.blob,
html[data-theme=“light”]

.orb,
html[data-theme=“light”]

.glow,
html[data-theme=“light”]

.voice-orb {

opacity:
    .48;
filter:
    blur(35px);

}

/* =========================================================
TRANSIÇÃO GLOBAL
========================================================= */

html.dual-theme-transition *,
html.dual-theme-transition {

transition:
    background
    .25s ease,
    background-color
    .25s ease,
    color
    .25s ease,
    box-shadow
    .25s ease,
    border-color
    .25s ease;

}

/* =========================================================
API DE COMPATIBILIDADE
========================================================= */

[data-theme=“light”] {

--theme-is-light:
    1;

}

[data-theme=“dark”] {

--theme-is-light:
    0;

}
</style>
</head>
<body>
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