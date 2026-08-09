// ═══════════════════════════════════════════════════════════════════
// KBLX: NEBULA · SESSION WINDOWS vMAX
// (conteúdo integral do arquivo fornecido)
// ═══════════════════════════════════════════════════════════════════
(function () {
    "use strict";

    if (window.NebulaSW) return;

    const MIN_W = 220;
    const MIN_H = 160;
    const EDGE_PAD = 10;

    const openWindows = new Map();

    let zTop = 9000;

    const clickTimers = Object.create(null);

    // ───────────────────────────────────────────────────────────────
    // CSS
    // ───────────────────────────────────────────────────────────────
    function injectStyles() {
        if (document.getElementById("nebula-sw-style")) return;

        const style = document.createElement("style");
        style.id = "nebula-sw-style";

        style.textContent = `
#nb-sw-stack{
    position:fixed;
    inset:0;
    pointer-events:none;
    z-index:8900;
}

#nb-sw-dock{
    position:fixed;
    left:10px;
    bottom:calc(10px + env(safe-area-inset-bottom,0px));
    display:flex;
    gap:8px;
    z-index:99999;
    pointer-events:auto;
    flex-wrap:wrap;
    max-width:calc(100% - 20px);
}

.nb-dock-bubble{
    width:40px;
    height:40px;
    border-radius:50%;
    background:rgba(20,20,26,.92);
    border:1px solid rgba(255,255,255,.14);
    display:flex;
    align-items:center;
    justify-content:center;
    font-size:16px;
    cursor:pointer;
    backdrop-filter:blur(10px);
    -webkit-backdrop-filter:blur(10px);
    box-shadow:0 6px 18px rgba(0,0,0,.35);
    user-select:none;
    -webkit-tap-highlight-color:transparent;
}

.nb-session-window{
    position:fixed;
    top:80px;
    left:12px;

    width:min(420px,calc(100% - 24px));
    height:320px;

    background:rgba(16,16,20,.96);
    border:1px solid rgba(255,255,255,.12);
    border-radius:16px;

    box-shadow:0 16px 40px rgba(0,0,0,.5);

    overflow:hidden;

    display:flex;
    flex-direction:column;

    pointer-events:auto;

    backdrop-filter:blur(14px);
    -webkit-backdrop-filter:blur(14px);

    transition:
        height .18s ease,
        width .18s ease,
        top .18s ease,
        left .18s ease,
        border-radius .18s ease;

    contain:layout paint;
}

.nb-session-window.collapsed{
    height:44px !important;
}

.nb-session-window.peeked{
    height:min(46vh,420px);
}

/* ───────────────────────────────────────────────────────────────
   MAXIMIZED — ESTADO PROTEGIDO
   ─────────────────────────────────────────────────────────────── */


.nb-session-window.maximized{
    position:fixed !important;

    /* continua sendo um estado maximized */
    z-index:2147483000 !important;

    /* posição padrão do maximized */
    top:0 !important;
    left:0 !important;

    /*
     * IMPORTANTE:
     * não usar width/height:100vw/100vh aqui.
     * Peek e Collapse precisam poder controlar
     * o tamanho mesmo com .maximized ativo.
     */
    width:100% !important;
    height:100% !important;

    max-width:none !important;
    max-height:none !important;

    border-radius:0 !important;

    transition:
        width .18s ease,
        height .18s ease,
        top .18s ease,
        left .18s ease,
        border-radius .18s ease !important;
}

/*
 * Enquanto maximizado, o estado continua ativo,
 * mas o tamanho passa a ser controlado pelas outras classes.
 */
.nb-session-window.maximized:not(.peeked):not(.collapsed):not(.minimized){
    top:0 !important;
    left:0 !important;
    width:100vw !important;
    height:100vh !important;
    max-width:none !important;
    max-height:none !important;
}

.nb-session-window.maximized.peeked{
    top:12px !important;
    left:12px !important;
    width:min(560px, calc(100vw - 24px)) !important;
    height:min(48vh, 430px) !important;
    max-width:none !important;
    max-height:none !important;
    border-radius:18px !important;
}

.nb-session-window.maximized.collapsed{
    top:12px !important;
    left:12px !important;
    width:min(460px, calc(100vw - 24px)) !important;
    height:44px !important;
    max-width:none !important;
    max-height:none !important;
    border-radius:18px !important;
}

/*
 * Minimized continua podendo esconder a janela,
 * mas NÃO remove .maximized.
 */
.nb-session-window.minimized{
    display:none;
}

/*
 * Corpo sempre ocupa o espaço restante.
 */
.nb-win-body{
    flex:1 1 auto;
    min-height:0;
    position:relative;
    overflow:auto;
    background:#0b0b0e;
}

/*
 * iframe ocupa todo o body.
 */
.nb-win-body iframe{
    display:block;
    width:100%;
    height:100%;
    min-width:100%;
    min-height:100%;
    border:0;
    background:#fff;
}

/*
 * Views internas
 */
.nb-win-body .nb-text-view{
    padding:14px;
    color:#e8e8ef;
    font-size:13px;
    line-height:1.5;
    white-space:pre-wrap;
    overflow:auto;
    height:100%;
    box-sizing:border-box;
}

.nb-win-body .nb-md-view{
    padding:14px;
    color:#e8e8ef;
    font-size:13px;
    line-height:1.6;
    overflow:auto;
    height:100%;
    box-sizing:border-box;
}

/* ───────────────────────────────────────────────────────────────
   HEADER
   ─────────────────────────────────────────────────────────────── */

.nb-win-hdr{
    display:flex;
    align-items:center;
    justify-content:space-between;
    gap:8px;

    min-height:44px;
    padding:8px 10px;

    background:rgba(255,255,255,.04);
    border-bottom:1px solid rgba(255,255,255,.08);

    cursor:pointer;

    flex:0 0 auto;

    user-select:none;
    -webkit-user-select:none;

    position:relative;
    z-index:5;
}

.nb-win-title{
    font-size:12px;
    font-weight:700;
    color:#fff;

    white-space:nowrap;
    overflow:hidden;
    text-overflow:ellipsis;

    flex:1;
}

.nb-win-controls{
    display:flex;
    gap:4px;
    flex:0 0 auto;
}

.nb-win-controls button{
    width:24px;
    height:24px;

    border:0;
    border-radius:8px;

    background:rgba(255,255,255,.06);
    color:#fff;

    font-size:11px;

    cursor:pointer;

    display:flex;
    align-items:center;
    justify-content:center;

    user-select:none;
    -webkit-tap-highlight-color:transparent;
}

.nb-win-controls button:active{
    background:rgba(255,255,255,.14);
}

/*
 * Indicador visual de maximizado
 */
.nb-session-window.maximized .nb-win-hdr{
    background:rgba(255,255,255,.055);
}

/* ───────────────────────────────────────────────────────────────
   RESIZE
   ─────────────────────────────────────────────────────────────── */

.ifsw-handle-y{
    position:absolute;
    left:0;
    right:0;
    bottom:0;
    height:10px;
    cursor:ns-resize;
    z-index:20;
}

.ifsw-handle-x{
    position:absolute;
    top:0;
    bottom:0;
    right:0;
    width:10px;
    cursor:ew-resize;
    z-index:20;
}

.ifsw-handle-corner{
    position:absolute;
    right:0;
    bottom:0;
    width:16px;
    height:16px;
    cursor:nwse-resize;
    z-index:21;
}

.nb-session-window.maximized .ifsw-handle-y,
.nb-session-window.maximized .ifsw-handle-x,
.nb-session-window.maximized .ifsw-handle-corner{
    display:none;
}

.nb-session-window.resizing{
    transition:none !important;
}
        `;document.head.appendChild(style);
    }

    // ───────────────────────────────────────────────────────────────
    // SHELL
    // ───────────────────────────────────────────────────────────────
    function ensureShell() {
        injectStyles();

        let stack = document.getElementById("nb-sw-stack");

        if (!stack) {
            stack = document.createElement("div");
            stack.id = "nb-sw-stack";
            document.body.appendChild(stack);
        }

        let dock = document.getElementById("nb-sw-dock");

        if (!dock) {
            dock = document.createElement("div");
            dock.id = "nb-sw-dock";
            document.body.appendChild(dock);
        }

        return { stack, dock };
    }

    // ───────────────────────────────────────────────────────────────
    // Z-INDEX
    // ───────────────────────────────────────────────────────────────
    function bringToFront(win) {

        /*
         * Maximized sempre fica no topo absoluto.
         */
        if (win.classList.contains("maximized")) {
            win.style.zIndex = "2147483000";
            return;
        }

        zTop += 1;

        win.style.zIndex = String(zTop);
    }

    // ───────────────────────────────────────────────────────────────
    // ESCAPE
    // ───────────────────────────────────────────────────────────────
    function escapeHTMLLocal(str) {
        return String(str ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    // ───────────────────────────────────────────────────────────────
    // BODY
    // ───────────────────────────────────────────────────────────────
    function renderBody(doc) {

        if (
            (doc.type === "pdf" || doc.type === "html") &&
            doc.url
        ) {
            return `
                <iframe
                    src="${escapeHTMLLocal(doc.url)}"
                    sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
                    loading="lazy">
                </iframe>
            `;
        }

        if (
            doc.type === "markdown" &&
            typeof window.markdownToHTML === "function"
        ) {
            return `
                <div class="nb-md-view">
                    ${window.markdownToHTML(doc.content || "")}
                </div>
            `;
        }

        if (doc.type === "json") {

            let pretty = doc.content || "";

            try {
                pretty = JSON.stringify(
                    JSON.parse(doc.content),
                    null,
                    2
                );
            } catch (e) {}

            return `
                <div class="nb-text-view">
                    ${escapeHTMLLocal(pretty)}
                </div>
            `;
        }

        return `
            <div class="nb-text-view">
                ${escapeHTMLLocal(doc.content || "Sem conteúdo.")}
            </div>
        `;
    }

    // ───────────────────────────────────────────────────────────────
    // HEADER
    // ───────────────────────────────────────────────────────────────
    function handleHeaderClick(e, id) {

        if (e.target.closest(".nb-win-controls")) {
            return;
        }

        if (!clickTimers[id]) {

            clickTimers[id] = setTimeout(() => {

                delete clickTimers[id];

                /*
                 * Se estiver maximizado, clique simples no header
                 * NÃO altera o estado.
                 */
                const entry = openWindows.get(id);

                if (
                    entry &&
                    entry.el.classList.contains("maximized")
                ) {
                    bringToFront(entry.el);
                    return;
                }

                togglePeek(id);

            }, 250);

        } else {

            clearTimeout(clickTimers[id]);
            delete clickTimers[id];

            /*
             * DUPLO CLIQUE = única forma via header
             * de entrar/sair do fullscreen.
             */
            toggleMaximize(id);
        }
    }

    // ───────────────────────────────────────────────────────────────
    // PEEK
    // ───────────────────────────────────────────────────────────────
    function togglePeek(id) {

    const entry = openWindows.get(id);
    if (!entry) return;

    const win = entry.el;

    /*
     * MAXIMIZED continua ativo.
     *
     * O Peek agora altera somente a geometria.
     * NÃO remove .maximized.
     */

    if (win.classList.contains("peeked")) {

        // Volta ao tamanho maximized
        win.classList.remove("peeked");

        win.style.top = "0";
        win.style.left = "0";
        win.style.width = "100%";
        win.style.height = "100%";

    } else {

        // Entra no Peek mantendo .maximized
        win.classList.add("peeked");
        win.classList.remove("collapsed");

        /*
         * Tamanho pequeno/variável.
         * Você pode ajustar esses dois valores.
         */
        win.style.width = "min(420px, calc(100% - 0px))";
        win.style.height = "min(46vh, 178px)";

        /*
         * Mantém uma posição confortável.
         */
        win.style.top = "0px";
        win.style.left = "0px";
    }

    bringToFront(win);
}
    // ───────────────────────────────────────────────────────────────
    // COLLAPSE
    // ───────────────────────────────────────────────────────────────
    function toggleCollapse(id) {

        const entry = openWindows.get(id);

        if (!entry) return;

        const win = entry.el;

        /*
         * Collapse agora funciona mesmo com maximized ativo.
         * O estado maximized permanece, só o tamanho muda.
         */
        win.classList.toggle("collapsed");
        win.classList.remove("peeked");

        bringToFront(win);
    }

    // ───────────────────────────────────────────────────────────────
    // MAXIMIZE / RESTORE
    // ───────────────────────────────────────────────────────────────
    function toggleMaximize(id) {

        const entry = openWindows.get(id);

        if (!entry) return;

        const win = entry.el;

        if (win.classList.contains("maximized")) {

            /*
             * RESTAURA.
             */
            win.classList.remove("maximized");

            win.classList.remove(
                "collapsed",
                "peeked",
                "minimized"
            );

            /*
             * Recupera tamanho/posição anterior.
             */
            if (entry.restoreState) {

                win.style.top = entry.restoreState.top;
                win.style.left = entry.restoreState.left;
                win.style.width = entry.restoreState.width;
                win.style.height = entry.restoreState.height;
            }

            win.querySelector(
                '[data-act="maximize"]'
            ).textContent = "⬜";

            win.querySelector(
                '[data-act="maximize"]'
            ).title = "Maximizar";

            bringToFront(win);

            return;
        }

        /*
         * SALVA O ESTADO ANTES DO FULLSCREEN.
         */
        const rect = win.getBoundingClientRect();

        entry.restoreState = {
            top: `${rect.top}px`,
            left: `${rect.left}px`,
            width: `${rect.width}px`,
            height: `${rect.height}px`
        };

        /*
         * Entra no MAXIMIZED.
         */
        win.classList.remove(
            "collapsed",
            "peeked",
            "minimized"
        );

        win.classList.add("maximized");

        win.style.top = "0";
        win.style.left = "0";
        win.style.width = "100vw";
        win.style.height = "100vh";

        win.querySelector(
            '[data-act="maximize"]'
        ).textContent = "❐";

        win.querySelector(
            '[data-act="maximize"]'
        ).title = "Restaurar";

        bringToFront(win);
    }

    // ───────────────────────────────────────────────────────────────
    // MINIMIZE
    // ───────────────────────────────────────────────────────────────
    function minimizeWindow(id) {

        const entry = openWindows.get(id);

        if (!entry) return;

        const win = entry.el;

        /*
         * IMPORTANTE:
         *
         * NÃO removemos .maximized.
         *
         * Portanto:
         *
         * MAXIMIZED → MINIMIZE → RESTORE
         *
         * volta MAXIMIZED.
         */
        win.classList.add("minimized");

        /*
         * Não fazemos:
         *
         * remove("maximized")
         *
         * Isso era justamente o problema.
         */

        const { dock } = ensureShell();

        let bubble = document.getElementById(
            `nb-dock-${id}`
        );

        if (!bubble) {

            bubble = document.createElement("div");

            bubble.className = "nb-dock-bubble";
            bubble.id = `nb-dock-${id}`;

            bubble.title =
                entry.docRef.name || "Documento";

            const icon = {
                pdf: "📕",
                html: "🌐",
                markdown: "📝",
                json: "📋",
                txt: "📄"
            }[entry.docRef.type] || "📄";

            bubble.textContent = icon;

            bubble.addEventListener("click", () => {

                /*
                 * Remove apenas o MINIMIZED.
                 *
                 * Se estava maximizado, continua maximizado.
                 */
                entry.el.classList.remove("minimized");

                bubble.remove();

                bringToFront(entry.el);
            });

            dock.appendChild(bubble);
        }
    }

    // ───────────────────────────────────────────────────────────────
    // CLOSE
    // ───────────────────────────────────────────────────────────────
    function closeWindow(id) {

        const entry = openWindows.get(id);

        if (!entry) return;

        const bubble = document.getElementById(
            `nb-dock-${id}`
        );

        if (bubble) {
            bubble.remove();
        }

        entry.el.remove();

        openWindows.delete(id);
    }

    function closeAll() {

        Array.from(openWindows.keys())
            .forEach(closeWindow);
    }

    // ───────────────────────────────────────────────────────────────
    // RESIZE
    // ───────────────────────────────────────────────────────────────
    function bindResize(win, handle, axis) {

        let active = false;
        let startX = 0;
        let startY = 0;
        let startW = 0;
        let startH = 0;
        let pid = null;

        handle.addEventListener(
            "pointerdown",
            (e) => {

                if (
                    e.button != null &&
                    e.button !== 0
                ) {
                    return;
                }

                /*
                 * Maximizado não pode ser redimensionado.
                 */
                if (
                    win.classList.contains("maximized")
                ) {
                    return;
                }

                active = true;

                pid = e.pointerId;

                startX = e.clientX;
                startY = e.clientY;

                const rect =
                    win.getBoundingClientRect();

                startW = rect.width;
                startH = rect.height;

                win.classList.remove(
                    "collapsed",
                    "peeked"
                );

                win.classList.add("resizing");

                handle.setPointerCapture?.(
                    e.pointerId
                );

                e.preventDefault();

                const move = (ev) => {

                    if (
                        !active ||
                        ev.pointerId !== pid
                    ) {
                        return;
                    }

                    ev.preventDefault();

                    const dx =
                        ev.clientX - startX;

                    const dy =
                        ev.clientY - startY;

                    const maxW =
                        window.innerWidth -
                        EDGE_PAD;

                    const maxH =
                        window.innerHeight -
                        EDGE_PAD;

                    if (
                        axis === "y" ||
                        axis === "corner"
                    ) {

                        win.style.height =
                            `${clamp(
                                startH + dy,
                                MIN_H,
                                maxH
                            )}px`;
                    }

                    if (
                        axis === "x" ||
                        axis === "corner"
                    ) {

                        win.style.width =
                            `${clamp(
                                startW + dx,
                                MIN_W,
                                maxW
                            )}px`;
                    }
                };

                const up = (ev) => {

                    if (
                        ev &&
                        ev.pointerId !== pid
                    ) {
                        return;
                    }

                    active = false;

                    window.removeEventListener(
                        "pointermove",
                        move
                    );

                    window.removeEventListener(
                        "pointerup",
                        up
                    );

                    window.removeEventListener(
                        "pointercancel",
                        up
                    );

                    win.classList.remove(
                        "resizing"
                    );
                };

                window.addEventListener(
                    "pointermove",
                    move,
                    { passive:false }
                );

                window.addEventListener(
                    "pointerup",
                    up,
                    { passive:true }
                );

                window.addEventListener(
                    "pointercancel",
                    up,
                    { passive:true }
                );
            },
            { passive:false }
        );
    }

    // ───────────────────────────────────────────────────────────────
    // HANDLES
    // ───────────────────────────────────────────────────────────────
    function attachHandles(win) {

        const hy =
            document.createElement("div");

        hy.className =
            "ifsw-handle-y";

        const hx =
            document.createElement("div");

        hx.className =
            "ifsw-handle-x";

        const hc =
            document.createElement("div");

        hc.className =
            "ifsw-handle-corner";

        win.appendChild(hy);
        win.appendChild(hx);
        win.appendChild(hc);

        bindResize(win, hy, "y");
        bindResize(win, hx, "x");
        bindResize(win, hc, "corner");
    }

    // ───────────────────────────────────────────────────────────────
    // OPEN
    // ───────────────────────────────────────────────────────────────
    function open(doc) {

        if (!doc || !doc.id) {
            return;
        }

        const { stack } =
            ensureShell();

        /*
         * Já existe.
         */
        if (openWindows.has(doc.id)) {

            const entry =
                openWindows.get(doc.id);

            const win = entry.el;

            win.classList.remove(
                "minimized"
            );

            /*
             * NÃO força peek aqui.
             *
             * Se a janela estava maximizada,
             * continua maximizada.
             */
            if (
                !win.classList.contains("maximized")
            ) {
                win.classList.add("peeked");
                win.classList.remove("collapsed");
            }

            const bubble =
                document.getElementById(
                    `nb-dock-${doc.id}`
                );

            if (bubble) {
                bubble.remove();
            }

            bringToFront(win);

            return;
        }

        // ─────────────────────────────────────────────
        // NOVA JANELA
        // ─────────────────────────────────────────────

        const win =
            document.createElement("div");

        win.className =
            "nb-session-window peeked";

        win.id =
            `nb-win-${doc.id}`;

        const icon = {
            pdf: "📕",
            html: "🌐",
            markdown: "📝",
            json: "📋",
            txt: "📄"
        }[doc.type] || "📄";

        win.innerHTML = `
            <div class="nb-win-hdr">

                <div class="nb-win-title">
                    ${icon}
                    ${escapeHTMLLocal(
                        doc.name ||
                        "Documento"
                    )}
                </div>

                <div class="nb-win-controls">

                    <button
                        data-act="collapse"
                        title="Colapsar">
                        —
                    </button>

                    <button
                        data-act="maximize"
                        title="Maximizar">
                        ⬜
                    </button>

                    <button
                        data-act="minimize"
                        title="Minimizar">
                        🔘
                    </button>

                    <button
                        data-act="close"
                        title="Fechar">
                        ✕
                    </button>

                </div>

            </div>

            <div class="nb-win-body">
                ${renderBody(doc)}
            </div>
        `;

        // ─────────────────────────────────────────────
        // CONTROLES
        // ─────────────────────────────────────────────

        win.querySelector(
            '[data-act="collapse"]'
        ).addEventListener(
            "click",
            (e) => {

                e.stopPropagation();

                toggleCollapse(doc.id);
            }
        );

        win.querySelector(
            '[data-act="maximize"]'
        ).addEventListener(
            "click",
            (e) => {

                e.stopPropagation();

                toggleMaximize(doc.id);
            }
        );

        win.querySelector(
            '[data-act="minimize"]'
        ).addEventListener(
            "click",
            (e) => {

                e.stopPropagation();

                minimizeWindow(doc.id);
            }
        );

        win.querySelector(
            '[data-act="close"]'
        ).addEventListener(
            "click",
            (e) => {

                e.stopPropagation();

                closeWindow(doc.id);
            }
        );

        // ─────────────────────────────────────────────
        // HEADER
        // ─────────────────────────────────────────────

        win.querySelector(
            ".nb-win-hdr"
        ).addEventListener(
            "click",
            (e) => {

                handleHeaderClick(
                    e,
                    doc.id
                );
            }
        );

        // ─────────────────────────────────────────────
        // CLICK NA JANELA
        // ─────────────────────────────────────────────

        win.addEventListener(
            "pointerdown",
            () => {

                /*
                 * Mesmo quando maximizado,
                 * garante prioridade absoluta.
                 */
                bringToFront(win);
            }
        );

        // ─────────────────────────────────────────────
        // CASCATA
        // ─────────────────────────────────────────────

        const offset =
            (openWindows.size % 6) * 18;

        win.style.top =
            `calc(80px + ${offset}px)`;

        win.style.left =
            `calc(12px + ${offset}px)`;

        // ─────────────────────────────────────────────
        // RESIZE
        // ─────────────────────────────────────────────

        attachHandles(win);

        stack.appendChild(win);

        openWindows.set(
            doc.id,
            {
                el: win,
                docRef: doc,
                restoreState: null
            }
        );

        bringToFront(win);
    }

    // ───────────────────────────────────────────────────────────────
    // API
    // ───────────────────────────────────────────────────────────────

    window.NebulaSW = {
        open,
        close: closeWindow,
        closeAll
    };

    /*
     * Compatibilidade com código externo existente.
     */
    window.handleHeaderClick =
        window.handleHeaderClick ||
        handleHeaderClick;

    window.togglePeek =
        window.togglePeek ||
        togglePeek;

    window.toggleCollapse =
        window.toggleCollapse ||
        toggleCollapse;

    window.toggleMaximize =
        window.toggleMaximize ||
        toggleMaximize;

    window.minimizeWindow =
        window.minimizeWindow ||
        minimizeWindow;

    window.closeWindow =
        window.closeWindow ||
        closeWindow;

})();

// ═══════════════════════════════════════════════════════════════════
// INTEGRAÇÃO COM NEBULA UNIFIED
// ═══════════════════════════════════════════════════════════════════
(function() {
    "use strict";

    // Guarda a referência original do openReader (caso exista)
    const originalOpenReader = window.openReader;

    // Substitui openReader para usar a Session Window
    window.openReader = function(item) {
        // Se a Session Window estiver disponível, usa ela
        if (window.NebulaSW && typeof window.NebulaSW.open === 'function') {
            // O objeto 'item' já deve conter os campos esperados:
            // id, name, type, content, url, etc.
            window.NebulaSW.open(item);
            return;
        }

        // Fallback: se a Session Window não existir, chama o reader antigo
        if (typeof originalOpenReader === 'function') {
            originalOpenReader(item);
        } else {
            console.warn('Nenhum leitor disponível para o documento:', item);
        }
    };

    // Os listeners originais (nos cards) continuam chamando openReader(item)
    // e agora serão redirecionados para a Session Window.
    // Nenhum ID ou classe foi alterado.
    // O preview interno (.file-preview) continua usando activatePreview() e deactivatePreview().
})();