(function(code){
const script=document.createElement('script');
script.setAttribute(
'data-runtime-module',
'js'
);
script.textContent=code;
document.body.appendChild(script);
})(`<script>
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
        "theme-dot2"
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
                    "#theme-dot2"
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
</script>`);