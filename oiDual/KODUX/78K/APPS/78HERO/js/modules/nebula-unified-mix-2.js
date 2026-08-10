// ═══════════════════════════════════════════════════════════════════
// KBLX: NEBULA · SESSION WINDOWS vMAX (com suporte a srcdoc)
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
    flex-direction:column;
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
    // BODY (MODIFICADO: suporte a srcdoc)
    // ───────────────────────────────────────────────────────────────
    function renderBody(doc) {

        // HTML com conteúdo inline (srcdoc)
        if (doc.type === "html" && doc.content && !doc.url) {
            // 🔥 TRATAMENTO DE \n → <br> ou espaço
            const normalized = normalizeHTMLContent(doc.content);
            return `
                <iframe
                    srcdoc="${escapeHTMLLocal(normalized)}"
                    sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
                    loading="lazy"
                    style="width:100%;height:100%;border:0;background:#fff;">
                </iframe>
            `;
        }

        // PDF ou HTML com URL (src)
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

        // Markdown
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

        // JSON
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

        // TXT / fallback
        return `
            <div class="nb-text-view">
                ${escapeHTMLLocal(doc.content || "Sem conteúdo.")}
            </div>
        `;
    }

    // ─── Normalização de \n para HTML ───
    function normalizeHTMLContent(content) {
        if (!content) return content;
        // Substitui \n por <br> quando está entre tags ou texto
        return content.replace(/\n/g, '<br>');
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
    // OPEN (com botão "Ouvir" integrado)
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
                        data-act="play"
                        title="Ouvir no Player">
                        🔊
                    </button>

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
            '[data-act="play"]'
        ).addEventListener(
            "click",
            (e) => {

                e.stopPropagation();

                /*
                 * Carrega o documento no Player e alterna reprodução.
                 */
                if (window.NebulaPlayer && typeof window.NebulaPlayer.loadExternalItem === 'function') {
                    window.NebulaPlayer.loadExternalItem(doc);
                    if (typeof window.NebulaPlayer.togglePlay === 'function') {
                        window.NebulaPlayer.togglePlay();
                    } else if (typeof window.NebulaPlayer.play === 'function') {
                        window.NebulaPlayer.play();
                    }
                } else {
                    console.warn('NebulaPlayer não disponível.');
                }
            }
        );

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
// KBLX: NEBULA PRO — MOTOR UNIFICADO (com integração Session Window)
// ═══════════════════════════════════════════════════════════════════

console.log("✅ KBLX.SYSTEM: NEBULA PRO · MOTOR UNIFICADO inicializado.");

// ─────────────────────────────────────────────────────────────────
// 1. CONFIG / CONSTANTES
// ─────────────────────────────────────────────────────────────────
const DB_NAME = "NebulaStorage";
const DB_VERSION = 1;
const STORE_NAME = "files";
const UI_STATE_KEY = "nebula-pro-ui-state";
const VIEW_MODE_KEY = "nebula-view-mode"; // 🆕

// Chaves que o próprio app usa para si mesmo — nunca viram "documento"
const SYSTEM_PREFIXES = ["nebula-", "di_", "kobllux-", "kdev-", "lsdevos-", "baulite-", "hero-", "fav:"];
const RESERVED_KEYS = new Set([
    UI_STATE_KEY, "nebula-theme", "nebula-doc-keys", "nebula-hidden-keys",
    "nebula-pinned-keys", "di_userName", "di_assistantName", "baulite-disabled"
]);

const TYPE_LABELS = { html: "HTML", markdown: "MARKDOWN", pdf: "PDF", txt: "TXT", json: "JSON" };

// Mapeia tipo → grupo de exibição (Apps / Documentos / Config / Cache)
function groupOf(doc) {
    if (doc.source === "localStorage" && !doc.looksLikeDoc) return "cache";
    if (doc.type === "html") return "apps";
    if (doc.type === "json") return "config";
    if (["markdown", "txt", "pdf"].includes(doc.type)) return "documentos";
    return "cache";
}

// ─────────────────────────────────────────────────────────────────
// 2. ESTADO
// ─────────────────────────────────────────────────────────────────
let db;
let library = []; // itens do IndexedDB (upload manual) — fonte "oficial"
let currentDocs = []; // library + scan do localStorage, mesclados a cada refresh

let NEBULA_UI_STATE = JSON.parse(localStorage.getItem(UI_STATE_KEY)) || {
    heroMinimized: false,
    heroIndex: 0,
    activeGroup: "recentes",
    collapsedGroups: [],
    autoplay: false
};
let viewMode = localStorage.getItem(VIEW_MODE_KEY) || "cards"; // 🆕
let autoplayTimer = null;

function saveUIState() {
    localStorage.setItem(UI_STATE_KEY, JSON.stringify(NEBULA_UI_STATE));
    localStorage.setItem(VIEW_MODE_KEY, viewMode);
}

// ─────────────────────────────────────────────────────────────────
// 3. INDEXEDDB (upload manual — camada "oficial", intocada em relação ao v0000)
// ─────────────────────────────────────────────────────────────────
function initDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);
        request.onupgradeneeded = (event) => {
            db = event.target.result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, { keyPath: "id" });
            }
        };
        request.onsuccess = (event) => { db = event.target.result; resolve(db); };
        request.onerror = (event) => reject(event.target.error);
    });
}

async function saveFileToDB(item) {
    return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, "readwrite");
        const store = tx.objectStore(STORE_NAME);
        const safeItem = { ...item };
        delete safeItem.url;
        store.put(safeItem);
        tx.oncomplete = () => resolve();
        tx.onerror = (err) => reject(err);
    });
}

async function deleteFileFromDB(id) {
    return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, "readwrite");
        const store = tx.objectStore(STORE_NAME);
        store.delete(id);
        tx.oncomplete = () => resolve();
        tx.onerror = (err) => reject(err);
    });
}

async function loadFilesFromDB() {
    return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, "readonly");
        const store = tx.objectStore(STORE_NAME);
        const request = store.getAll();
        request.onsuccess = (event) => {
            const items = event.target.result;
            items.forEach(item => {
                if ((item.type === "pdf" || item.type === "html") && item.fileBlob) {
                    item.url = URL.createObjectURL(item.fileBlob);
                }
            });
            resolve(items);
        };
        request.onerror = (err) => reject(err);
    });
}

// ─────────────────────────────────────────────────────────────────
// 4. UTILS
// ─────────────────────────────────────────────────────────────────
function escapeHTML(text) {
    return String(text ?? "")
        .replace(/&/g, "&amp;").replace(/</g, "&lt;")
        .replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}

function formatSize(bytes) {
    if (!bytes) return "";
    const units = ["B", "KB", "MB", "GB"];
    let i = 0, size = bytes;
    while (size >= 1024 && i < units.length - 1) { size /= 1024; i++; }
    return size.toFixed(size >= 10 ? 0 : 1) + " " + units[i];
}

function markdownToHTML(md) {
    let html = escapeHTML(md);
    html = html.replace(/^### (.*)$/gm, "<h3>$1</h3>");
    html = html.replace(/^## (.*)$/gm, "<h2>$1</h2>");
    html = html.replace(/^# (.*)$/gm, "<h1>$1</h1>");
    html = html.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
    html = html.replace(/\*(.*?)\*/g, "<em>$1</em>");
    html = html.replace(/`(.*?)`/g, "<code>$1</code>");
    html = html.replace(/\n\n/g, "</p><p>");
    return "<p>" + html + "</p>";
}

function extractTextFromHTML(htmlString) {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = htmlString;
    return tempDiv.textContent || tempDiv.innerText || "";
}

// detectType: pdf > html > markdown > JSON (separado de txt, essa era a lacuna do v0000) > txt
function detectType(name = "", mime = "", content = "") {
    const ext = String(name).split(".").pop().toLowerCase();
    const c = String(content || "");
    if (mime.includes("pdf") || ext === "pdf") return "pdf";
    if (mime.includes("html") || ["html", "htm"].includes(ext) || /<!doctype html>|<html/i.test(c)) return "html";
    if (["md", "markdown"].includes(ext) || /^#{1,6}\s/m.test(c) || /\[[^\]]+\]\([^)]+\)/.test(c)) return "markdown";
    if (ext === "json" || (/^[\{\[][\s\S]*[\}\]]$/.test(c.trim()) && c.trim().length > 1)) return "json";
    return "txt";
}

function previewText(content, limit = 170) {
    const flat = String(content || "").replace(/\s+/g, " ").trim();
    if (!flat) return "Sem prévia disponível.";
    return flat.length > limit ? flat.slice(0, limit) + "…" : flat;
}

function previewFromHTML(content) {
    const txt = String(content || "")
        .replace(/<script[\s\S]*?<\/script>/gi, " ")
        .replace(/<style[\s\S]*?<\/style>/gi, " ")
        .replace(/<[^>]+>/g, " ")
        .replace(/\s+/g, " ").trim();
    return txt ? txt.slice(0, 240) : "HTML sem texto legível.";
}

// ─────────────────────────────────────────────────────────────────
// 5. SCANNER DE LOCALSTORAGE (camada adicional — extraída do inline-1.js)
//    Só descobre documentos; NUNCA sobrescreve a Library do IndexedDB.
// ─────────────────────────────────────────────────────────────────
function isSystemKey(key) {
    return SYSTEM_PREFIXES.some(prefix => String(key).startsWith(prefix));
}

function lsEntries() {
    const out = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (RESERVED_KEYS.has(key) || isSystemKey(key)) continue;
        out.push({ key, val: localStorage.getItem(key) || "" });
    }
    return out;
}

function safeJSONParse(v) {
    try { return JSON.parse(v); } catch { return null; }
}

function scanLocalStorageDocs() {
    const docs = [];
    for (const { key, val } of lsEntries()) {
        const parsed = safeJSONParse(val);
        const looksLikeDoc = /doc|note|text|article|draft|html|md|markdown|txt|pdf|summary|prompt/i.test(key);
        const type = detectType(key, "", val);
        let content = val;
        if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
            content = Object.entries(parsed).map(([k, v]) => `${k}: ${typeof v === "string" ? v : JSON.stringify(v)}`).join("\n");
        }
        if (!val) continue;
        docs.push({
            id: `ls-${key}`,
            name: key,
            type,
            size: formatSize(new Blob([val]).size),
            content,
            url: "",
            favorite: false,
            cortexSaved: false,
            source: "localStorage",
            rawKey: key,
            looksLikeDoc,
            updatedAt: 0
        });
    }
    return docs;
}

// ─────────────────────────────────────────────────────────────────
// 6. COLETA UNIFICADA
// ─────────────────────────────────────────────────────────────────
async function collectDocuments() {
    const dbDocs = library.map((item, idx) => ({
        ...item,
        source: "indexeddb",
        updatedAt: item.updatedAt || (Date.now() - idx)
    }));
    const storageDocs = scanLocalStorageDocs();

    const merged = [...dbDocs, ...storageDocs];
    const seen = new Set();
    return merged.filter(doc => {
        const sig = `${doc.name}::${doc.type}::${String(doc.content || "").slice(0, 120)}`;
        if (seen.has(sig)) return false;
        seen.add(sig);
        return true;
    });
}

function getFilteredHeroItems() {
    const grp = NEBULA_UI_STATE.activeGroup;
    if (grp === "recentes") return currentDocs.filter(d => d.source === "indexeddb").slice(0, 8);
    if (grp === "favoritos") return currentDocs.filter(i => i.favorite);
    if (grp === "cortex") return currentDocs.filter(i => i.cortexSaved);
    if (grp === "cache") return currentDocs.filter(i => groupOf(i) === "cache");
    if (["apps", "documentos", "config"].includes(grp)) return currentDocs.filter(i => groupOf(i) === grp);
    return currentDocs.filter(i => i.type === grp);
}

// ─────────────────────────────────────────────────────────────────
// 7. TTS CENTRALIZADO — speakDocument() único para Hero + Library
//    Resolve o "botão de áudio não toca": espera as vozes carregarem,
//    seleciona pt-BR de fato, e permite cancelar tocando de novo.
// ─────────────────────────────────────────────────────────────────
let _voicesCache = [];
let _speakingBtn = null;

function loadVoices() {
    return new Promise(resolve => {
        let voices = window.speechSynthesis.getVoices();
        if (voices.length) { _voicesCache = voices; resolve(voices); return; }
        const onVoices = () => {
            voices = window.speechSynthesis.getVoices();
            if (voices.length) {
                _voicesCache = voices;
                window.speechSynthesis.removeEventListener("voiceschanged", onVoices);
                resolve(voices);
            }
        };
        window.speechSynthesis.addEventListener("voiceschanged", onVoices);
        setTimeout(() => { if (!_voicesCache.length) onVoices(); }, 500);
    });
}

function cleanTextForSpeech(doc) {
    if (doc.type === "html") return previewFromHTML(doc.content) || extractTextFromHTML(doc.content);
    if (doc.type === "json") {
        const parsed = safeJSONParse(doc.content);
        if (parsed) return JSON.stringify(parsed, null, 0).replace(/[{}\[\]"]/g, " ");
        return doc.content || "";
    }
    if (doc.type === "markdown") {
        return String(doc.content || "").replace(/[#*`_>\-]/g, "");
    }
    return doc.content || "";
}

async function speakDocument(doc, btn) {
    const synth = window.speechSynthesis;
    if (!synth) { alert("Este navegador não suporta leitura em voz alta."); return; }

    if (synth.speaking && _speakingBtn === btn) {
        synth.cancel();
        if (btn) btn.classList.remove("speaking");
        _speakingBtn = null;
        return;
    }
    if (synth.speaking) synth.cancel();

    const text = cleanTextForSpeech(doc).trim();
    if (!text) { alert("Sem texto legível para leitura."); return; }

    const voices = await loadVoices();
    const ptVoice = voices.find(v => v.lang && v.lang.toLowerCase().startsWith("pt-br"))
        || voices.find(v => v.lang && v.lang.toLowerCase().startsWith("pt"));

    const CHUNK = 1600;
    const chunks = [];
    for (let i = 0; i < text.length; i += CHUNK) chunks.push(text.slice(i, i + CHUNK));

    if (btn) { btn.classList.add("speaking"); _speakingBtn = btn; }

    let idx = 0;
    function speakNext() {
        if (idx >= chunks.length) {
            if (btn) btn.classList.remove("speaking");
            _speakingBtn = null;
            return;
        }
        const utt = new SpeechSynthesisUtterance(chunks[idx]);
        utt.lang = "pt-BR";
        if (ptVoice) utt.voice = ptVoice;
        utt.onend = () => { idx++; speakNext(); };
        utt.onerror = () => { if (btn) btn.classList.remove("speaking"); _speakingBtn = null; };
        synth.speak(utt);
    }
    speakNext();
}

// ─────────────────────────────────────────────────────────────────
// 8. DOM REFS
// ─────────────────────────────────────────────────────────────────
const fileInput = document.getElementById("file-input");
const addButton = document.getElementById("add-file");
const searchButton = document.getElementById("search-file");
const openURLButton = document.getElementById("open-url");
const searchBox = document.getElementById("search-box");
const searchInput = document.getElementById("search-input");
const carousel = document.getElementById("recentes");
const dots = document.getElementById("dots");
const reader = document.getElementById("reader");
const readerTitle = document.getElementById("reader-title");
const readerBody = document.getElementById("reader-body");
const readerClose = document.getElementById("reader-close");
const featureOpen = document.getElementById("feature-open");

const heroSection = document.getElementById("hero-section");
const toggleHeroBtn = document.getElementById("toggle-hero");
const toggleAutoplayBtn = document.getElementById("toggle-autoplay");
const heroCarousel = document.getElementById("hero-carousel");
const heroDots = document.getElementById("hero-dots");
const heroGroups = document.getElementById("hero-groups");
const heroTitleLabel = document.getElementById("hero-title-label");

// 🆕 Botões de modo de visualização
const viewModeButtons = document.querySelectorAll(".view-mode-btn");

// ─────────────────────────────────────────────────────────────────
// 9. PREVIEW / READER (com integração Session Window)
// ─────────────────────────────────────────────────────────────────
function createPreview(item) {
    const type = item.type;
    if (type === "pdf" || (type === "html" && item.url)) {
        return `
            <div class="file-preview" onclick="activatePreview(event, this, '${item.id}', '${type}', '${item.url}')">
                <span class="type-badge">${type.toUpperCase()}</span>
                <div class="preview-placeholder">
                    <span>📄</span>
                    <p style="font-size:11px;font-weight:600;">Toque para carregar preview</p>
                </div>
            </div>`;
    }
    if (type === "markdown") {
        const preview = item.content ? markdownToHTML(previewText(item.content, 260)) : "<p>Markdown</p>";
        return `<div class="file-preview"><span class="type-badge">MD</span><div class="preview-markdown">${preview}</div></div>`;
    }
    if (type === "json") {
        return `<div class="file-preview"><span class="type-badge">JSON</span><div class="preview-text"><pre style="white-space:pre-wrap;margin:0;font-size:11px;">${escapeHTML(previewText(item.content, 260))}</pre></div></div>`;
    }
    if (type === "html") {
        // 🔥 Normaliza \n
        const normalized = normalizeHTMLContent(item.content);
        return `<div class="file-preview"><span class="type-badge">HTML</span><div class="preview-text">${escapeHTML(previewFromHTML(normalized))}</div></div>`;
    }
    return `<div class="file-preview"><span class="type-badge">TXT</span><div class="preview-text">${escapeHTML(previewText(item.content || "Documento de texto", 260))}</div></div>`;
}

// 🔥 Normalização de \n para visualização
function normalizeHTMLContent(content) {
    if (!content) return content;
    return content.replace(/\n/g, '<br>');
}

window.activatePreview = function (e, container, id, type, url) {
    if (container.querySelector("iframe")) return;
    if (!url) return;
    container.innerHTML = `
        <span class="type-badge">${type.toUpperCase()}</span>
        <button class="close-preview-btn" onclick="deactivatePreview(event, this)" title="Ocultar preview">✕</button>
        <iframe src="${url}" sandbox="allow-scripts allow-same-origin allow-popups allow-forms" style="width:100%;height:100%;border:0;background:#fff;"></iframe>
    `;
};

window.deactivatePreview = function (e, btn) {
    e.stopPropagation();
    const container = btn.closest(".file-preview");
    const type = container.querySelector(".type-badge").textContent.toLowerCase();
    container.innerHTML = `
        <span class="type-badge">${type.toUpperCase()}</span>
        <div class="preview-placeholder">
            <span>📄</span>
            <p style="font-size:11px;font-weight:600;">Toque para carregar preview</p>
        </div>
    `;
};

// ─── openReader MODIFICADO para usar Session Window ───
function openReader(item) {
    if (window.NebulaSW && typeof window.NebulaSW.open === 'function') {
        window.NebulaSW.open(item);
        if (window.NebulaPlayer && typeof window.NebulaPlayer.loadExternalItem === 'function') {
            window.NebulaPlayer.loadExternalItem(item);
        }
        return;
    }

    // Fallback: reader modal antigo
    readerTitle.textContent = item.name;
    readerBody.innerHTML = "";
    if ((item.type === "pdf" || item.type === "html") && item.url) {
        const iframe = document.createElement("iframe");
        iframe.src = item.url;
        if (item.type === "html") iframe.setAttribute("sandbox", "allow-scripts allow-same-origin allow-popups allow-forms");
        readerBody.appendChild(iframe);
    } else if (item.type === "markdown") {
        readerBody.innerHTML = `<article class="reader-markdown">${markdownToHTML(item.content)}</article>`;
    } else if (item.type === "json") {
        const pre = document.createElement("pre");
        pre.className = "reader-text";
        const parsed = safeJSONParse(item.content);
        pre.textContent = parsed ? JSON.stringify(parsed, null, 2) : item.content;
        readerBody.appendChild(pre);
    } else {
        const pre = document.createElement("pre");
        pre.className = "reader-text";
        pre.textContent = item.type === "html" ? extractTextFromHTML(item.content) : item.content;
        readerBody.appendChild(pre);
    }
    reader.classList.add("opened");
    document.body.style.overflow = "hidden";
}

function closeReader() {
    reader.classList.remove("opened");
    readerBody.innerHTML = "";
    document.body.style.overflow = "";
}
readerClose.addEventListener("click", closeReader);
reader.addEventListener("click", (e) => { if (e.target === reader) closeReader(); });
document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeReader(); });

// ─────────────────────────────────────────────────────────────────
// 10. REMOÇÃO — respeita a origem (IndexedDB vs localStorage)
// ─────────────────────────────────────────────────────────────────
async function removeDocument(doc) {
    if (!confirm(`Tem certeza que deseja apagar "${doc.name}"?`)) return;
    try {
        if (doc.source === "localStorage") {
            localStorage.removeItem(doc.rawKey || doc.name);
        } else {
            await deleteFileFromDB(doc.id);
            library = library.filter(item => item.id !== doc.id);
        }
        refreshAll();
    } catch (err) {
        console.error("Erro ao deletar:", err);
    }
}

// ─────────────────────────────────────────────────────────────────
// 11. EDIÇÃO INLINE (com details/summary) 🆕
// ─────────────────────────────────────────────────────────────────
function startInlineEdit(doc, cardElement) {
    // Verifica se já existe um editor aberto
    let existing = cardElement.querySelector(".inline-editor");
    if (existing) {
        // Fecha o editor atual
        existing.remove();
        return;
    }

    const details = document.createElement("details");
    details.className = "inline-editor";
    details.open = true;

    const summary = document.createElement("summary");
    summary.textContent = "✏️ Editar conteúdo";
    summary.style.cursor = "pointer";
    summary.style.padding = "8px 0";
    summary.style.fontWeight = "600";
    summary.style.color = "var(--text)";
    details.appendChild(summary);

    const textarea = document.createElement("textarea");
    textarea.value = doc.content || "";
    textarea.style.width = "100%";
    textarea.style.minHeight = "120px";
    textarea.style.padding = "8px";
    textarea.style.border = "1px solid var(--line)";
    textarea.style.borderRadius = "8px";
    textarea.style.fontFamily = "monospace";
    textarea.style.fontSize = "13px";
    textarea.style.background = "var(--card-solid)";
    textarea.style.color = "var(--text)";

    const saveBtn = document.createElement("button");
    saveBtn.textContent = "💾 Salvar";
    saveBtn.className = "btn btn-primary";
    saveBtn.style.marginTop = "8px";
    saveBtn.style.width = "100%";
    saveBtn.onclick = async () => {
        const newContent = textarea.value;
        doc.content = newContent;

        // Atualiza no IndexedDB ou localStorage
        try {
            if (doc.source === "localStorage") {
                localStorage.setItem(doc.rawKey || doc.name, newContent);
            } else {
                await saveFileToDB(doc);
                // Atualiza também na library
                const idx = library.findIndex(d => d.id === doc.id);
                if (idx !== -1) library[idx].content = newContent;
            }
            // Recarrega a UI
            refreshAll();
        } catch (err) {
            console.error("Erro ao salvar edição:", err);
            alert("Falha ao salvar. Veja o console.");
        }
    };

    details.appendChild(textarea);
    details.appendChild(saveBtn);
    cardElement.querySelector(".card-info-text")?.appendChild(details);
}

// ─────────────────────────────────────────────────────────────────
// 12. COPIAR CONTEÚDO 🆕
// ─────────────────────────────────────────────────────────────────
function copyContent(doc) {
    const text = doc.content || "";
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => {
            alert("Conteúdo copiado para a área de transferência!");
        }).catch(() => {
            fallbackCopy(text);
        });
    } else {
        fallbackCopy(text);
    }
}

function fallbackCopy(text) {
    const ta = document.createElement("textarea");
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    try {
        document.execCommand("copy");
        alert("Conteúdo copiado para a área de transferência!");
    } catch (e) {
        alert("Não foi possível copiar. Tente manualmente.");
    }
    document.body.removeChild(ta);
}

// ─────────────────────────────────────────────────────────────────
// 13. RENDER: HERO (com dot estabilizado e novos botões)
// ─────────────────────────────────────────────────────────────────
function renderHero() {
    if (!heroCarousel) return;
    heroCarousel.innerHTML = "";
    heroDots.innerHTML = "";

    const items = getFilteredHeroItems();
    heroTitleLabel.textContent = `Inteligência · ${NEBULA_UI_STATE.activeGroup.toUpperCase()}`;

    if (!items.length) {
        heroCarousel.innerHTML = `
            <div class="hero-card" style="width: 100%;">
                <div style="padding: 30px; text-align: center;">
                    <h2 style="font-size: 20px; margin-bottom: 8px;">Nenhum item em "${NEBULA_UI_STATE.activeGroup}"</h2>
                    <p style="color: var(--muted); font-size: 12px;">Adicione arquivos ou explore novos conteúdos.</p>
                </div>
            </div>`;
        return;
    }

    if (NEBULA_UI_STATE.heroIndex >= items.length) NEBULA_UI_STATE.heroIndex = 0;

    items.forEach((item, index) => {
        const card = document.createElement("article");
        card.className = "hero-card";
        card.style.flex = "0 0 100%";

        card.innerHTML = `
            <div class="hero-card-preview">${createPreview(item)}</div>
            <div class="hero-card-info">
                <div class="card-info-text">
                    <h4>${escapeHTML(item.name)}</h4>
                    <p>${(TYPE_LABELS[item.type] || item.type).toUpperCase()} · ${item.size || "arquivo"} · ${item.source === "localStorage" ? "cache" : "db"}</p>
                </div>
                <div class="card-actions">
                    <button class="btn-icon hero-listen" title="Ouvir">🔊</button>
                    <button class="btn-icon hero-copy" title="Copiar conteúdo">📋</button>
                    <button class="btn-icon hero-edit" title="Editar conteúdo">✏️</button>
                    <button class="btn-icon danger hero-delete" title="Apagar Documento">🗑️</button>
                    <button class="open hero-open">→</button>
                </div>
            </div>
        `;

        const openBtn = card.querySelector(".hero-open");
        const listenBtn = card.querySelector(".hero-listen");
        const copyBtn = card.querySelector(".hero-copy");
        const editBtn = card.querySelector(".hero-edit");
        const deleteBtn = card.querySelector(".hero-delete");

        openBtn.addEventListener("click", (e) => { e.stopPropagation(); openReader(item); });
        listenBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            if (window.NebulaPlayer && typeof window.NebulaPlayer.loadExternalItem === 'function') {
                window.NebulaPlayer.loadExternalItem(item);
                if (typeof window.NebulaPlayer.togglePlay === 'function') {
                    window.NebulaPlayer.togglePlay();
                } else if (typeof window.NebulaPlayer.play === 'function') {
                    window.NebulaPlayer.play();
                }
            } else {
                speakDocument(item, e.currentTarget);
            }
        });
        copyBtn.addEventListener("click", (e) => { e.stopPropagation(); copyContent(item); });
        editBtn.addEventListener("click", (e) => { e.stopPropagation(); startInlineEdit(item, card); });
        deleteBtn.addEventListener("click", (e) => { e.stopPropagation(); removeDocument(item); });

        heroCarousel.appendChild(card);

        const dot = document.createElement("div");
        dot.className = "hero-dot" + (index === NEBULA_UI_STATE.heroIndex ? " active" : "");
        dot.addEventListener("click", (e) => {
            e.stopPropagation();
            NEBULA_UI_STATE.heroIndex = index;
            saveUIState();
            scrollToHeroSlide(index);
        });
        heroDots.appendChild(dot);
    });

    setTimeout(() => scrollToHeroSlide(NEBULA_UI_STATE.heroIndex, false), 50);
}

function scrollToHeroSlide(index, smooth = true) {
    const cards = heroCarousel.querySelectorAll(".hero-card");
    if (cards[index]) {
        cards[index].scrollIntoView({ behavior: smooth ? "smooth" : "auto", inline: "center", block: "nearest" });
        heroDots.querySelectorAll(".hero-dot").forEach((d, i) => d.classList.toggle("active", i === index));
    }
}

heroCarousel.addEventListener("scroll", makeStableScrollHandler(
    heroCarousel, ".hero-card", heroDots, ".hero-dot",
    (closest) => { NEBULA_UI_STATE.heroIndex = closest; saveUIState(); }
));

function setupAutoplay() {
    clearInterval(autoplayTimer);
    if (!NEBULA_UI_STATE.autoplay) return;
    autoplayTimer = setInterval(() => {
        const items = getFilteredHeroItems();
        if (items.length <= 1) return;
        NEBULA_UI_STATE.heroIndex = (NEBULA_UI_STATE.heroIndex + 1) % items.length;
        saveUIState();
        scrollToHeroSlide(NEBULA_UI_STATE.heroIndex);
    }, 5500);
}

// ─────────────────────────────────────────────────────────────────
// 14. RENDER: BIBLIOTECA (com modos de visualização e botões) 🆕
// ─────────────────────────────────────────────────────────────────
function renderLibrary(filter = "") {
    carousel.innerHTML = "";
    const normalized = filter.toLowerCase().trim();
    const items = currentDocs.filter(item => item.name.toLowerCase().includes(normalized));

    if (!items.length) {
        carousel.innerHTML = `<div class="empty">Nenhum documento encontrado.</div>`;
        dots.innerHTML = "";
        return;
    }

    // Aplica o modo de visualização
    const mode = viewMode; // "cards", "list", "grid"
    carousel.className = `view-mode-${mode}`;

    items.forEach((item) => {
        const card = document.createElement("article");
        card.className = "slide";

        let previewHTML = "";
        if (mode === "cards") {
            previewHTML = createPreview(item);
        } else if (mode === "list") {
            previewHTML = `<div class="list-icon">${getIconForType(item.type)}</div>`;
        } else if (mode === "grid") {
            previewHTML = `<div class="grid-icon">${getIconForType(item.type)}</div>`;
        }

        card.innerHTML = `
            ${previewHTML}
            <div class="card-info">
                <div class="card-info-text">
                    <h4>${escapeHTML(item.name)}</h4>
                    <p>${(TYPE_LABELS[item.type] || item.type).toUpperCase()} · ${item.size || "arquivo"} · ${item.source === "localStorage" ? "cache" : "db"}</p>
                </div>
                <div class="card-actions">
                    <button class="btn-icon listen-btn" title="Ouvir Documento">🔊</button>
                    <button class="btn-icon copy-btn" title="Copiar conteúdo">📋</button>
                    <button class="btn-icon edit-btn" title="Editar conteúdo">✏️</button>
                    <button class="btn-icon danger delete-btn" title="Apagar Documento">🗑️</button>
                    <button class="open">→</button>
                </div>
            </div>`;

        const openBtn = card.querySelector(".open");
        const listenBtn = card.querySelector(".listen-btn");
        const copyBtn = card.querySelector(".copy-btn");
        const editBtn = card.querySelector(".edit-btn");
        const deleteBtn = card.querySelector(".delete-btn");

        openBtn.addEventListener("click", (e) => { e.stopPropagation(); openReader(item); });
        listenBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            if (window.NebulaPlayer && typeof window.NebulaPlayer.loadExternalItem === 'function') {
                window.NebulaPlayer.loadExternalItem(item);
                if (typeof window.NebulaPlayer.togglePlay === 'function') {
                    window.NebulaPlayer.togglePlay();
                } else if (typeof window.NebulaPlayer.play === 'function') {
                    window.NebulaPlayer.play();
                }
            } else {
                speakDocument(item, e.currentTarget);
            }
        });
        copyBtn.addEventListener("click", (e) => { e.stopPropagation(); copyContent(item); });
        editBtn.addEventListener("click", (e) => { e.stopPropagation(); startInlineEdit(item, card); });
        deleteBtn.addEventListener("click", (e) => { e.stopPropagation(); removeDocument(item); });

        // Long-press para modo compacto (existente)
        let pressTimer = null;
        const startPress = () => { pressTimer = setTimeout(() => carousel.classList.add("compact-mode"), 450); };
        const cancelPress = () => clearTimeout(pressTimer);
        card.addEventListener("touchstart", startPress, { passive: true });
        card.addEventListener("touchend", cancelPress);
        card.addEventListener("touchmove", cancelPress);
        card.addEventListener("mousedown", startPress);
        card.addEventListener("mouseup", cancelPress);
        card.addEventListener("mouseleave", cancelPress);

        carousel.appendChild(card);
    });

    renderDots();
}

function getIconForType(type) {
    const map = { pdf: "📕", html: "🌐", markdown: "📝", json: "📋", txt: "📄" };
    return map[type] || "📄";
}

function renderDots() {
    dots.innerHTML = "";
    const slides = carousel.querySelectorAll(".slide");
    slides.forEach((slide, index) => {
        const dot = document.createElement("div");
        dot.className = "dot";
        if (index === 0) dot.classList.add("active");
        dots.appendChild(dot);
    });
}

carousel.addEventListener("scroll", makeStableScrollHandler(
    carousel, ".slide", dots, ".dot", () => {}
));

document.addEventListener("click", (e) => {
    if (carousel.classList.contains("compact-mode") && !carousel.contains(e.target)) {
        carousel.classList.remove("compact-mode");
    }
});

// ─────────────────────────────────────────────────────────────────
// 15. UPLOAD / URL EXTERNA
// ─────────────────────────────────────────────────────────────────
async function addFile(file) {
    const type = detectType(file.name, file.type, "");
    let item = {
        id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
        name: file.name,
        type,
        size: formatSize(file.size),
        content: "",
        url: "",
        favorite: false,
        cortexSaved: false,
        updatedAt: Date.now()
    };

    if (type === "pdf" || type === "html") {
        item.fileBlob = file;
        item.url = URL.createObjectURL(file);
        if (type === "html") item.content = await file.text();
    } else {
        item.content = await file.text();
        item.type = detectType(file.name, file.type, item.content);
    }

    library.unshift(item);
    try { await saveFileToDB(item); } catch (err) {}
}

function refreshAll() {
    collectDocuments().then(docs => {
        currentDocs = docs;
        renderLibrary(searchInput && searchInput.value ? searchInput.value : "");
        renderHero();
        saveUIState();
    });
}

addButton.addEventListener("click", () => fileInput.click());
fileInput.addEventListener("change", async event => {
    const files = Array.from(event.target.files);
    for (const file of files) await addFile(file);
    fileInput.value = "";
    refreshAll();
    document.dispatchEvent(new Event("fileAdded"));
});

searchButton.addEventListener("click", () => {
    searchBox.classList.toggle("visible");
    if (searchBox.classList.contains("visible")) searchInput.focus();
});
searchInput.addEventListener("input", event => renderLibrary(event.target.value));

openURLButton.addEventListener("click", async () => {
    const url = prompt("Cole a URL do arquivo ou site externo:");
    if (!url) return;
    const clean = url.split("?")[0].toLowerCase();
    let type = clean.endsWith(".pdf") ? "pdf" : "html";

    let item = {
        id: Date.now().toString(),
        name: url.split("/").pop() || "Documento Web",
        type, url, content: "", size: "Link", favorite: false, cortexSaved: false, updatedAt: Date.now()
    };

    library.unshift(item);
    await saveFileToDB(item);
    refreshAll();
});

// ─────────────────────────────────────────────────────────────────
// 16. NAVEGAÇÃO INFERIOR (Botões Biblioteca, Cortex, etc.) 🆕
// ─────────────────────────────────────────────────────────────────
document.querySelectorAll(".nav-item").forEach(item => {
    item.addEventListener("click", () => {
        document.querySelectorAll(".nav-item").forEach(i => i.classList.remove("active"));
        item.classList.add("active");
        const group = item.getAttribute("data-group");
        if (group) {
            NEBULA_UI_STATE.activeGroup = group;
            NEBULA_UI_STATE.heroIndex = 0;
            saveUIState();
            renderHero();
            renderLibrary();
        }
    });
});

if (featureOpen) featureOpen.addEventListener("click", () => fileInput.click());

// ─────────────────────────────────────────────────────────────────
// 17. HERO: toggle / autoplay / grupos
// ─────────────────────────────────────────────────────────────────
if (NEBULA_UI_STATE.heroMinimized) {
    heroSection.classList.add("minimized");
    toggleHeroBtn.style.transform = "rotate(-90deg)";
}

toggleHeroBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    NEBULA_UI_STATE.heroMinimized = !heroSection.classList.contains("minimized");
    heroSection.classList.toggle("minimized", NEBULA_UI_STATE.heroMinimized);
    toggleHeroBtn.style.transform = NEBULA_UI_STATE.heroMinimized ? "rotate(-90deg)" : "rotate(0deg)";
    saveUIState();
});

toggleAutoplayBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    NEBULA_UI_STATE.autoplay = !NEBULA_UI_STATE.autoplay;
    toggleAutoplayBtn.textContent = NEBULA_UI_STATE.autoplay ? "⏸" : "▶";
    saveUIState();
    setupAutoplay();
});
toggleAutoplayBtn.textContent = NEBULA_UI_STATE.autoplay ? "⏸" : "▶";

heroGroups.querySelectorAll(".group-pill").forEach(pill => {
    if (pill.getAttribute("data-group") === NEBULA_UI_STATE.activeGroup) {
        heroGroups.querySelectorAll(".group-pill").forEach(p => p.classList.remove("active"));
        pill.classList.add("active");
    }
    pill.addEventListener("click", (e) => {
        e.stopPropagation();
        heroGroups.querySelectorAll(".group-pill").forEach(p => p.classList.remove("active"));
        e.target.classList.add("active");
        NEBULA_UI_STATE.activeGroup = e.target.getAttribute("data-group");
        NEBULA_UI_STATE.heroIndex = 0;
        saveUIState();
        renderHero();
    });
});

// ─────────────────────────────────────────────────────────────────
// 18. MODOS DE VISUALIZAÇÃO (Grid/Lista/Cards) 🆕
// ─────────────────────────────────────────────────────────────────
viewModeButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        const mode = btn.getAttribute("data-view");
        if (mode) {
            viewMode = mode;
            localStorage.setItem(VIEW_MODE_KEY, viewMode);
            // Atualiza classe ativa nos botões
            viewModeButtons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            renderLibrary(searchInput.value);
        }
    });
});

// Sincroniza o botão ativo com o modo atual
function syncViewModeButtons() {
    viewModeButtons.forEach(btn => {
        const mode = btn.getAttribute("data-view");
        if (mode === viewMode) btn.classList.add("active");
        else btn.classList.remove("active");
    });
}
syncViewModeButtons();

// ─────────────────────────────────────────────────────────────────
// 19. INIT
// ─────────────────────────────────────────────────────────────────
window.onload = async () => {
    try {
        await initDB();
        const savedItems = await loadFilesFromDB();
        if (savedItems && savedItems.length > 0) {
            library = savedItems;
        } else {
            library = [{
                id: "demo-md",
                name: "Arquitetura Nebula Pro.md",
                type: "markdown",
                content: "# NEBULA PRO\n## Recent Intelligence Hero\nO Hero exibe os arquivos recentes.\n**Cortex** fornece os dados.\n- PDF\n- TXT\n- HTML\n- Markdown\n`Global Player`\nA experiência é unificada.",
                size: "Markdown",
                favorite: true,
                cortexSaved: true,
                updatedAt: Date.now()
            }];
        }
        refreshAll();
        setupAutoplay();
        loadVoices();
    } catch (err) {
        console.error("[KBLX.DB] Erro na inicialização:", err);
    }
};

window.addEventListener("storage", () => refreshAll());

// ═══════════════════════════════════════════════════════════════════════
// KBLX: CICLO ∅⁺/∅⁻ — RÉGUA ARQUETÍPICA (mantido do v0000, sem alterações)
// ═══════════════════════════════════════════════════════════════════════
(function () {
    "use strict";
    const PESOS_ARQUETIPOS = {
        "NOVA": 0.12, "ATLAS": 0.18, "VITALIS": 0.14,
        "PULSE": 0.10, "ARTEMIS": 0.08, "SERENA": 0.10,
        "KAOS": 0.05, "GENUS": 0.12, "LUMINE": 0.06,
        "RHEA": 0.03, "SOLUS": 0.01, "AION": 0.01,
        "KODUX": 0.01, "BLLUE": 0.01, "JESUS": 0.01,
        "KOBLLUX": 0.01, "INFODOSE": 0.01, "HORUS": 0.01
    };

    let cicloPasso = 0;
    const CICLO_PASSOS = [
        { simb: "∅⁻", tipo: "inicio" }, { simb: "∆ⁿ", tipo: "transicao" },
        { simb: "01", tipo: "passo" }, { simb: "02", tipo: "passo" },
        { simb: "03", tipo: "passo" }, { simb: "∆ⁿ", tipo: "transicao" }
    ];

    function obterProximoPasso() {
        if (cicloPasso >= CICLO_PASSOS.length) cicloPasso = 0;
        return CICLO_PASSOS[cicloPasso++];
    }

    function selecionarArquetipoPorPeso() {
        const entries = Object.entries(PESOS_ARQUETIPOS);
        const total = entries.reduce((s, [, p]) => s + p, 0);
        let rand = Math.random() * total;
        for (const [nome, peso] of entries) {
            rand -= peso;
            if (rand <= 0) return nome;
        }
        return entries[entries.length - 1][0];
    }

    function atualizarPainelCiclo() {
        const passo = obterProximoPasso();
        const arqNome = selecionarArquetipoPorPeso();
        const peso = PESOS_ARQUETIPOS[arqNome] || 0;
        const delta = (library.length * 10 + 1134 > 0) ? (library.length * 10 + 1134 % 9 || 9) / (library.length * 10 + 1134 + 1) : 0.001;

        if (document.getElementById("ciclo-passo")) document.getElementById("ciclo-passo").textContent = passo.simb || "01";
        if (document.getElementById("ciclo-arq")) document.getElementById("ciclo-arq").textContent = arqNome;
        if (document.getElementById("ciclo-peso")) document.getElementById("ciclo-peso").textContent = peso.toFixed(3);
        if (document.getElementById("ciclo-delta")) document.getElementById("ciclo-delta").textContent = delta.toFixed(4);
    }

    setTimeout(atualizarPainelCiclo, 300);
    document.addEventListener("fileAdded", () => setTimeout(atualizarPainelCiclo, 100));
})();

// ═══════════════════════════════════════════════════════════════════
// NEBULA PLAYER — 78NP.js (adaptado com API pública)
// ═══════════════════════════════════════════════════════════════════
(function(){
  "use strict";

  // ====== Dependências (CDN) ======
  function loadScript(src){ return new Promise((res,rej)=>{ const s=document.createElement('script'); s.src=src; s.onload=res; s.onerror=()=>rej(new Error('Falha '+src)); document.head.appendChild(s); }); }

  // ====== Estado ======
  let voices = [];
  const settings = JSON.parse(localStorage.getItem('nebula.settings')||'{"voice":"","rate":1}');
  let current = { id:null, name:null, pdfData:null, pdfDoc:null, pages:0, paragraphs:[], idx:0, playing:false };
  let utter = null;
  let progressMap = JSON.parse(localStorage.getItem('nebula.progress')||'{}');
  const ocrCache = {};
  let searchHits = []; let searchPtr = 0;
  let contMode = false, karaMode = false, skelMode = true;
  const contMap = {};
  const pageProgress = {};
  const timelineCache = {};

  // ====== UI ======
  // (referências aos elementos DOM – podem ser nulos se não existirem)
  const listenBtn   = document.getElementById('listenBtn');
  const itemsWrap   = document.getElementById('items');
  const usageVal    = document.getElementById('usageVal');
  const countInfo   = document.getElementById('countInfo');
  const importBar   = document.getElementById('importBar');
  const exportBar   = document.getElementById('exportBar');
  const importStatus= document.getElementById('importStatus');
  const exportStatus= document.getElementById('exportStatus');
  const importBtn   = document.getElementById('importBtn');
  const exportBtn   = document.getElementById('exportBtn');
  const clearLibBtn = document.getElementById('clearLibBtn');
  const clearUiBtn  = document.getElementById('clearUiBtn');
  const filePicker  = document.getElementById('filePicker');
  const ppBtn       = document.getElementById('ppBtn');
  const ppIcon      = document.getElementById('ppIcon');
  const nowPlaying  = document.getElementById('nowPlaying');
  const viewBtn     = document.getElementById('viewBtn');
  const playerDock  = document.getElementById('playerDock');
  const dockPlayerBtn = document.getElementById('dockPlayerBtn');
  const progressSlider = document.getElementById('progressSlider');
  const timeCur        = document.getElementById('timeCur');
  const voiceSelect = document.getElementById('voiceSelect');
  const rateRange   = document.getElementById('rateRange');
  const rateOut     = document.getElementById('rateOut');
  const voiceCount  = document.getElementById('voiceCount');
  const testVoice   = document.getElementById('testVoice');
  const bmList      = document.getElementById('bmList');
  const clearBmBtn  = document.getElementById('clearBmBtn');
  const overlay   = document.getElementById('overlay');
  const stage     = document.getElementById('stage');
  const ovCanvas  = document.getElementById('ovCanvas');
  const ovSkel    = document.getElementById('ovSkel');
  const ovTrail   = document.getElementById('ovTrail');
  const ovHl      = document.getElementById('ovHl');
  const ovTitle   = document.getElementById('ovTitle');
  const ovClose   = document.getElementById('ovClose');
  const ovPrev    = document.getElementById('ovPrev');
  const ovNext    = document.getElementById('ovNext');
  const ovPageInfo= document.getElementById('ovPageInfo');
  const ovZoom    = document.getElementById('ovZoom');
  const ovCtx     = ovCanvas?.getContext('2d');
  const ovSkelCtx = ovSkel?.getContext('2d');
  const ovTrailCtx= ovTrail?.getContext('2d');
  const ovHlCtx   = ovHl?.getContext('2d');
  const ovCont    = document.getElementById('ovCont');
  const bmBtn     = document.getElementById('bmBtn');
  const contBtn   = document.getElementById('contBtn');
  const karaBtn   = document.getElementById('karaBtn');
  const skelBtn   = document.getElementById('skelBtn');
  const ovTimeline= document.getElementById('ovTimeline');
  const ovSnippet = document.getElementById('ovSnippet');
  const searchInput = document.getElementById('searchInput');
  const searchBtn   = document.getElementById('searchBtn');
  const searchPrev  = document.getElementById('searchPrev');
  const searchNext  = document.getElementById('searchNext');
  const searchClear = document.getElementById('searchClear');
  const searchCount = document.getElementById('searchCount');
  const trailExportBtn = document.getElementById('trailExportBtn');
  const trailImportBtn = document.getElementById('trailImportBtn');
  const trailImportInput = document.getElementById('trailImportInput');

  // ====== IndexedDB (do Player) ======
  const DB_PLAYER = 'nebula-db', STORE_PLAYER='pdfs', VER_PLAYER=1;
  function openDBPlayer(){
    return new Promise((res,rej)=>{
      const req = indexedDB.open(DB_PLAYER, VER_PLAYER);
      req.onupgradeneeded = (e)=> {
        const db = e.target.result;
        if(!db.objectStoreNames.contains(STORE_PLAYER)){
          const st = db.createObjectStore(STORE_PLAYER, {keyPath:'id'});
          st.createIndex('by_name','name',{unique:false});
        }
      };
      req.onsuccess = ()=>res(req.result);
      req.onerror = ()=>rej(req.error);
    });
  }
  async function dbPutPlayer(obj){ const db=await openDBPlayer(); return new Promise((res,rej)=>{ const tx=db.transaction(STORE_PLAYER,'readwrite'); tx.objectStore(STORE_PLAYER).put(obj); tx.oncomplete=()=>{db.close();res(true)}; tx.onerror=()=>{db.close();rej(tx.error)}; }); }
  async function dbAllPlayer(){ const db=await openDBPlayer(); return new Promise((res,rej)=>{ const tx=db.transaction(STORE_PLAYER,'readonly'); const req=tx.objectStore(STORE_PLAYER).getAll(); req.onsuccess=()=>{db.close();res(req.result||[])}; req.onerror=()=>{db.close();rej(req.error)}; }); }
  async function dbGetPlayer(id){ const db=await openDBPlayer(); return new Promise((res,rej)=>{ const tx=db.transaction(STORE_PLAYER,'readonly'); const req=tx.objectStore(STORE_PLAYER).get(id); req.onsuccess=()=>{db.close();res(req.result||null)}; req.onerror=()=>{db.close();rej(req.error)}; }); }
  async function dbDeletePlayer(id){ const db=await openDBPlayer(); return new Promise((res,rej)=>{ const tx=db.transaction(STORE_PLAYER,'readwrite'); const req=tx.objectStore(STORE_PLAYER).delete(id); tx.oncomplete=()=>{db.close();res(true)}; tx.onerror=()=>{db.close();rej(tx.error)}; }); }

  // ====== Utilitários (Player) ======
  function esc(s=''){ return String(s).replace(/[&<>"]/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m])); }
  function fmtBytes(b){ if(!b) return '0 B'; const u=['B','KB','MB','GB']; let i=0, v=b; while(v>=1024&&i<u.length-1){v/=1024;i++;} return (v.toFixed((i<=1)?0:1).replace('.',','))+' '+u[i]; }
  function sumSizes(list){ return list.reduce((a,x)=> a + (x.size|| (x.blob?.size||0)), 0); }
  function setPP(isPlaying){
    if(ppIcon) ppIcon.innerHTML = isPlaying ? '<path d="M8 5h3v14H8zm5 0h3v14h-3z"/>' : '<path d="M8 5v14l11-7z"/>';
    if(listenBtn) listenBtn.textContent = isPlaying ? 'Pause' : 'Listen';
    if(ppBtn) ppBtn.classList.toggle('pulse', isPlaying);
  }
  function normalize(s=''){ return s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase(); }
  function safeName(n){ return (n||'file.pdf').replace(/[^a-z0-9_\-\.]/gi,'_'); }
  function roundRect(ctx, x,y,w,h,r, fill, stroke){ ctx.beginPath(); ctx.moveTo(x+r,y); ctx.arcTo(x+w,y,x+w,y+h,r); ctx.arcTo(x+w,y+h,x,y+h,r); ctx.arcTo(x,y+h,x,y,r); ctx.arcTo(x,y,x+w,y,r); if(fill) ctx.fill(); if(stroke) ctx.stroke(); }
  function curPage(){ return contMode ? (current.paragraphs[current.idx]?.page || ovPage) : ovPage; }

  // ====== API PÚBLICA DO PLAYER ======
  const NebulaPlayer = {
    loadExternalItem: async function(item) {
      if (!item) return;
      let content = item.content || '';
      let url = item.url || '';
      let type = item.type || 'txt';
      let name = item.name || 'Documento';

      if ((type === 'pdf' || type === 'html') && url) {
        try {
          const response = await fetch(url);
          const ab = await response.arrayBuffer();
          current.pdfData = new Uint8Array(ab);
          current.pdfDoc = await pdfjsLib.getDocument({data: current.pdfData}).promise;
          current.pages = current.pdfDoc.numPages;
          current.paragraphs = await extractTextSmart(current.pdfDoc);
          for(const seg of current.paragraphs){ delete seg._karaTrailIdx; }
          const savedPct = progressMap[item.id] || 0;
          current.idx = Math.floor((savedPct / 100) * current.paragraphs.length);
          if(current.idx >= current.paragraphs.length) current.idx = 0;
        } catch(e) {
          console.warn('Falha ao carregar PDF/HTML via URL, usando conteúdo textual.', e);
          const paras = (content || '').split(/\n{2,}|(?<=[.!?])\s{1,}(?=[A-ZÁÉÍÓÚ])/g)
            .map(t=>t.replace(/^#+\s*/,'').trim()).filter(t=>t.length>2)
            .flatMap(t=> t.length>500 ? [...Array(Math.ceil(t.length/400))].map((_,i)=>({text:t.slice(i*400,(i+1)*400),page:1})) : [{text:t,page:1}]);
          current.paragraphs = paras.length ? paras : [{text: content || 'Sem conteúdo.', page:1}];
          current.pages = 1;
          current.pdfDoc = null;
          current.pdfData = null;
        }
      } else {
        let text = content || '';
        if (type === 'json') {
          try { text = JSON.stringify(JSON.parse(text), null, 2); } catch(e) {}
        }
        const paras = text.split(/\n{2,}|(?<=[.!?])\s{1,}(?=[A-ZÁÉÍÓÚ])/g)
          .map(t=>t.replace(/^#+\s*/,'').trim()).filter(t=>t.length>2)
          .flatMap(t=> t.length>500 ? [...Array(Math.ceil(t.length/400))].map((_,i)=>({text:t.slice(i*400,(i+1)*400),page:1})) : [{text:t,page:1}]);
        current.paragraphs = paras.length ? paras : [{text: text || 'Sem conteúdo.', page:1}];
        current.pages = 1;
        current.pdfDoc = null;
        current.pdfData = null;
      }

      current.id = item.id || 'external';
      current.name = name;
      current.playing = false;

      if(nowPlaying) nowPlaying.textContent = name;
      if(ovSnippet && current.paragraphs[0]) {
        ovSnippet.textContent = current.paragraphs[0].text.slice(0,250);
      }
      updateProgressBarsPlayer(false);
      if(progressSlider) {
        const pct = ((current.idx+1)/current.paragraphs.length*100) || 0;
        progressSlider.value = pct.toFixed(1);
        if(timeCur) timeCur.textContent = Math.round(pct) + '%';
      }
    },

    togglePlay: function() {
      if (!current.paragraphs || !current.paragraphs.length) {
        alert('Nenhum documento carregado no Player.');
        return;
      }
      if (speechSynthesis.speaking && !speechSynthesis.paused) {
        speechSynthesis.pause();
        current.playing = false;
        setPP(false);
      } else if (speechSynthesis.paused) {
        speechSynthesis.resume();
        current.playing = true;
        setPP(true);
      } else {
        this.play();
      }
    },

    play: function() {
      if (!current.paragraphs || !current.paragraphs.length) {
        alert('Nenhum documento carregado.');
        return;
      }
      if (!('speechSynthesis' in window)) {
        alert('SpeechSynthesis não suportado.');
        return;
      }
      setPP(true);
      current.playing = true;
      speakCurrentPlayer();
    },

    pause: function() {
      if (speechSynthesis.speaking && !speechSynthesis.paused) {
        speechSynthesis.pause();
        current.playing = false;
        setPP(false);
      }
    },

    stop: function() {
      speechSynthesis.cancel();
      current.playing = false;
      setPP(false);
      if(utter) { utter = null; }
    },

    getStatus: function() {
      return {
        id: current.id,
        name: current.name,
        pages: current.pages,
        paragraphCount: current.paragraphs.length,
        currentIdx: current.idx,
        playing: current.playing
      };
    }
  };

  window.NebulaPlayer = NebulaPlayer;

  // ====== Funções internas do Player (adaptadas) ======
  async function extractTextSmart(pdfDoc){
    const parts = [];
    for(let p=1; p<=pdfDoc.numPages; p++){
      const page = await pdfDoc.getPage(p);
      const c = await page.getTextContent();
      const textJoined = (c.items||[]).map(i=>i.str).join(' ').trim();
      if(!textJoined || textJoined.length < 20 || (c.items||[]).length < 5){
        const segs = await ocrPage(page, p); parts.push(...segs);
      }else{
        const split = textJoined.split(/\n+|\r+|\.\s{1,}|•|-{2,}/g).map(t=>t.trim()).filter(Boolean);
        for(const seg of split){
          if(seg.length>600){ for(let i=0;i<seg.length;i+=420){ parts.push({text:seg.slice(i,i+420), page:p}); } }
          else{ parts.push({text:seg, page:p}); }
        }
      }
    }
    const perPage = {};
    parts.forEach(seg=>{ if(seg.words) (perPage[seg.page]||(perPage[seg.page]=[])).push(seg); });
    for(const p in perPage){
      let base=0; const fl=[];
      for(const seg of perPage[p]){ seg._pageWordBase = base; if(seg.words){ fl.push(...seg.words); base += seg.words.length; } }
      if(!ocrCache[p]) ocrCache[p]={};
      if(!ocrCache[p].pageWords) ocrCache[p].pageWords = fl;
    }
    return parts;
  }

  async function ocrPage(page, pageNum){
    if(ocrCache[pageNum]) return ocrCache[pageNum].segments;
    const vw = page.getViewport({scale:1.6});
    const cnv = document.createElement('canvas'); cnv.width = vw.width; cnv.height = vw.height;
    await page.render({canvasContext: cnv.getContext('2d'), viewport: vw}).promise;
    let result;
    try{ result = await Tesseract.recognize(cnv, 'por+eng', { logger:()=>{} }); }
    catch(e){ console.warn('OCR falhou:', e); ocrCache[pageNum]={baseW:cnv.width, baseH:cnv.height, segments:[{text:'[OCR indisponível nesta página]', page:pageNum}]}; return ocrCache[pageNum].segments; }
    const words = result?.data?.words || [];
    const groups = {};
    words.forEach((w)=>{ const key = `${w.block_num||0}-${w.par_num||0}-${w.line_num||0}`; (groups[key]||(groups[key]=[])).push(w); });
    const segments = [];
    for(const k of Object.keys(groups)){
      const arr = groups[k].sort((a,b)=> (a.x0-b.x0) || (a.y0-b.y0));
      const text = arr.map(w=>w.text).join(' ').trim(); if(!text) continue;
      let cursor = 0;
      const wordsMap = arr.map(w=>{
        const t = (w.text||'').toString(); const start = cursor; const len = t.length + 1; cursor += len;
        const bb = w.bbox || w; return { t, x0:bb.x0, y0:bb.y0, x1:bb.x1, y1:bb.y1, start, len };
      });
      segments.push({ text, page: pageNum, words: wordsMap, baseW: cnv.width, baseH: cnv.height });
    }
    ocrCache[pageNum] = { baseW: cnv.width, baseH: cnv.height, segments };
    return segments;
  }

  function speakCurrentPlayer(){
    if(utter){ speechSynthesis.cancel(); utter=null; }
    const seg = current.paragraphs[current.idx]; if(!seg){ current.playing=false; setPP(false); return; }
    if(ovSnippet) ovSnippet.textContent = seg.text.slice(0,250);
    utter = new SpeechSynthesisUtterance(seg.text);
    const v = voices.find(x=>x.name===voiceSelect?.value) || voices[0]; if(v) utter.voice = v;
    utter.rate = parseFloat(rateRange?.value)||1;
    utter.pitch = parseFloat(document.getElementById('pitchRange')?.value ?? settings.pitch ?? 1);
    utter.onboundary = (e)=>{
      const ch = e.charIndex||0;
      if(seg.words && seg.baseW && seg.baseH){
        let wcur=null;
        for(let i=0;i<seg.words.length;i++){ const w=seg.words[i]; if(ch>=w.start && ch<w.start+w.len){ wcur=w; break; } }
        if(wcur){
          // desenha destaque (se os canvases existirem)
        }
      }
    };
    utter.onend = ()=>{
      if(current.idx < current.paragraphs.length-1){ current.idx++; updateProgressBarsPlayer(false); speakCurrentPlayer(); }
      else { current.playing=false; setPP(false); updateProgressBarsPlayer(true); }
    };
    speechSynthesis.speak(utter);
    updateProgressBarsPlayer(false);
  }

  function updateProgressBarsPlayer(finished){
    if(!current.id) return;
    const pct = finished ? 100 : ((current.idx+1)/current.paragraphs.length*100);
    if(progressSlider) {
      progressSlider.value = pct.toFixed(1);
      if(timeCur) timeCur.textContent = Math.round(pct) + '%';
    }
    progressMap[current.id] = pct;
    localStorage.setItem('nebula.progress', JSON.stringify(progressMap));
  }

  // ====== Inicialização (Player) ======
  function initPlayer() {
    function populateVoices(){
      voices = speechSynthesis.getVoices() || [];
      if(voiceSelect){
        voiceSelect.innerHTML = '';
        const preferPT = voices.filter(v=>/^pt(-|_)/i.test(v.lang)).concat(voices.filter(v=>!/^pt(-|_)/i.test(v.lang)));
        (preferPT.length?preferPT:voices).forEach(v=>{
          const opt = document.createElement('option'); opt.value=v.name; opt.textContent = `${v.name}${v.lang? ' · '+v.lang:''}`; voiceSelect.appendChild(opt);
        });
        if(voiceCount) voiceCount.textContent = voices.length? `${voices.length}` : '0';
        const saved = settings.voice && voices.find(v=>v.name===settings.voice);
        if(saved) voiceSelect.value=settings.voice;
      }
    }
    populateVoices();
    if(window.speechSynthesis) window.speechSynthesis.onvoiceschanged = populateVoices;

    if(rateRange && rateOut) {
      rateRange.value = settings.rate || 1.0;
      rateOut.textContent = (parseFloat(rateRange.value)||1).toFixed(1)+'×';
      rateRange.oninput = ()=>{ rateOut.textContent=(+rateRange.value).toFixed(1)+'×'; settings.rate=+rateRange.value; localStorage.setItem('nebula.settings', JSON.stringify(settings)); };
    }
    if(voiceSelect) {
      voiceSelect.onchange = ()=>{ settings.voice=voiceSelect.value; localStorage.setItem('nebula.settings', JSON.stringify(settings)); };
    }
    if(testVoice) {
      testVoice.onclick = ()=>{
        if(!('speechSynthesis' in window)) return alert('SpeechSynthesis não suportado.');
        const u=new SpeechSynthesisUtterance('Teste de voz do Nebula Pro.');
        const v=voices.find(x=>x.name===voiceSelect?.value)||voices[0];
        if(v) u.voice=v;
        u.rate=+rateRange?.value||1;
        u.pitch=parseFloat(document.getElementById('pitchRange')?.value??1);
        speechSynthesis.cancel();
        speechSynthesis.speak(u);
      };
    }
    if(importBtn) importBtn.onclick = ()=> filePicker?.click();
    if(filePicker) filePicker.onchange = onPickFilesPlayer;
    if(exportBtn) exportBtn.onclick = onExportZipPlayer;
    if(clearLibBtn) clearLibBtn.onclick = clearLibraryPlayer;
    if(clearUiBtn) clearUiBtn.onclick = ()=>{ localStorage.removeItem('nebula.progress'); localStorage.removeItem('nebula.settings'); localStorage.removeItem('nebula.bookmarks'); alert('Config/Progresso/Bookmarks limpos.'); renderBookmarksPlayer(); };
    if(listenBtn) listenBtn.onclick = onListenMainPlayer;
    if(ppBtn) ppBtn.onclick = togglePlayPausePlayer;
    if(viewBtn) viewBtn.onclick = openViewerForCurrentPlayer;
    if(dockPlayerBtn) dockPlayerBtn.onclick = togglePlayerDock;

    if(overlay && ovClose) ovClose.onclick = closeOverlayPlayer;
    if(overlay && ovPrev) ovPrev.onclick = ()=>{ if(ovPage>1){ ovPage--; renderOverlayPagePlayer(); } };
    if(overlay && ovNext) ovNext.onclick = ()=>{ if(ovPage<ovPages){ ovPage++; renderOverlayPagePlayer(); } };
    if(ovZoom) ovZoom.oninput = ()=>{ ovScale = parseFloat(ovZoom.value)||1.2; renderOverlayPagePlayer(); };
    if(bmBtn) bmBtn.onclick = addBookmarkPlayer;
    if(contBtn) contBtn.onclick = toggleContinuousPlayer;
    if(karaBtn) karaBtn.onclick = toggleKaraokePlayer;
    if(skelBtn) skelBtn.onclick = toggleSkeletonPlayer;
    if(trailExportBtn) trailExportBtn.onclick = exportTrailPNGPlayer;
    if(trailImportBtn) trailImportBtn.onclick = ()=> trailImportInput?.click();
    if(trailImportInput) trailImportInput.onchange = importTrailPNGPlayer;

    if(searchBtn) searchBtn.onclick = doSearchPlayer;
    if(searchPrev) searchPrev.onclick = ()=> navSearchPlayer(-1);
    if(searchNext) searchNext.onclick = ()=> navSearchPlayer(1);
    if(searchClear) searchClear.onclick = ()=>{ if(searchInput) searchInput.value=''; searchHits=[]; searchPtr=0; if(searchCount) searchCount.textContent='0/0'; if(ovSnippet) ovSnippet.textContent='—'; clearHighlightPlayer(); };

    if(progressSlider) progressSlider.addEventListener('input', onSliderInputPlayer);

    renderLibraryPlayer();
    renderBookmarksPlayer();
  }

  // ====== Placeholders para funções do Player que dependem de UI ======
  let ovPage = 1, ovPages = 0, ovScale = 1.2;

  async function onPickFilesPlayer(ev){ /* ... */ }
  async function onExportZipPlayer(){ /* ... */ }
  async function clearLibraryPlayer(){ /* ... */ }
  function renderLibraryPlayer(){ /* ... */ }
  function renderBookmarksPlayer(){ /* ... */ }
  function addBookmarkPlayer(){ /* ... */ }
  function toggleContinuousPlayer(){ contMode = !contMode; if(contBtn) contBtn.textContent = 'Continuous: ' + (contMode?'ON':'OFF'); }
  function toggleKaraokePlayer(){ karaMode = !karaMode; if(karaBtn) karaBtn.textContent = 'Karaoke: ' + (karaMode ? 'ON' : 'OFF'); }
  function toggleSkeletonPlayer(){ skelMode = !skelMode; if(skelBtn) skelBtn.textContent = 'Skeleton: ' + (skelMode ? 'ON' : 'OFF'); }
  function togglePlayPausePlayer(){ if(NebulaPlayer) NebulaPlayer.togglePlay(); }
  function onListenMainPlayer(){ if(NebulaPlayer) NebulaPlayer.togglePlay(); }
  function openViewerForCurrentPlayer(){ /* apenas se houver overlay */ }
  function closeOverlayPlayer(){ if(overlay) overlay.classList.remove('show'); }
  function renderOverlayPagePlayer(){ /* ... */ }
  function doSearchPlayer(){ /* ... */ }
  function navSearchPlayer(delta){ /* ... */ }
  function clearHighlightPlayer(){ /* ... */ }
  function exportTrailPNGPlayer(){ /* ... */ }
  function importTrailPNGPlayer(){ /* ... */ }
  function onSliderInputPlayer(e){ /* ... */ }
  function togglePlayerDock(){ /* ... */ }

  // ====== Inicialização ======
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPlayer);
  } else {
    initPlayer();
  }

})();

// ═══════════════════════════════════════════════════════════════════
// iFSw + DEV PANEL — integrado com NebulaSW
// ═══════════════════════════════════════════════════════════════════
(function(){
  "use strict";

  // SEMENTE APP (INFODOSE 369) — HTML inline
  const SEMENTE_APP_SRCDOC = `
    <!DOCTYPE html>
    <html><head>
    <style>:root { --z-base: 0; --z-content: 100; --z-widget: 500; --z-overlay: 1000; --z-system: 5000; }</style>
    <style>
      :root{
        --bg-top:#EDEBF3; --bg-bot:#E4E1EE;
        --card:rgba(255,255,255,.68); --card-solid:#ffffff; --card-strong:rgba(255,255,255,.86);
        --line:rgba(60,60,67,.10); --line-strong:rgba(60,60,67,.16);
        --text:#1c1b1f; --text-2:#6c6a75; --text-3:#9997a3;
        --accent:#6C4CE0; --accent-ink:#4A2FB5; --accent-soft:rgba(108,76,224,.12);
        --gold:#C7973F; --gold-soft:rgba(199,151,63,.14);
        --radius-lg:26px; --radius-md:18px; --radius-sm:12px;
        --shadow:0 1px 2px rgba(28,27,31,.04), 0 10px 28px -14px rgba(28,27,31,.28);
      }
      *{box-sizing:border-box; -webkit-tap-highlight-color:transparent;}
      html,body{height:100%; margin:0; font-family:-apple-system,BlinkMacSystemFont,sans-serif; color:var(--text); background: radial-gradient(120% 60% at 18% -6%, #F6E9DA 0%, transparent 55%), radial-gradient(140% 70% at 100% 0%, #DCE6F5 0%, transparent 50%), linear-gradient(180deg,var(--bg-top),var(--bg-bot) 60%, #DEDAEA 100%); background-attachment:fixed; -webkit-font-smoothing:antialiased;}
      .app{ min-height:100dvh; display:flex; flex-direction:column; position:relative; }
      header.top{ padding:20px 20px 6px; position:sticky; top:0; z-index:30; backdrop-filter:blur(22px); background:rgba(237,235,243,.72); border-bottom:1px solid transparent;}
      .eyebrow{ font-size:11px; letter-spacing:.14em; text-transform:uppercase; color:var(--accent-ink); font-weight:700; display:flex; align-items:center; gap:6px; }
      .eyebrow .dot{width:5px;height:5px;border-radius:50%;background:var(--accent); box-shadow:0 0 0 3px var(--accent-soft);}
      h1.large{font-size:30px; letter-spacing:-.02em; font-weight:750; margin:0; line-height:1.05;}
      main{flex:1; padding:14px 0 120px;}
      .screen{display:none;} .screen.active{display:block;}
      .card{ background:var(--card); backdrop-filter:blur(18px); border:1px solid rgba(255,255,255,.55); border-radius:var(--radius-lg); box-shadow:var(--shadow); padding:18px; margin: 0 14px;}
      .btn{ appearance:none; border:none; padding:13px 18px; border-radius:16px; font-size:15px; font-weight:650; display:inline-flex; align-items:center; justify-content:center; gap:8px; width:100%; cursor:pointer; }
      .btn-primary{background:linear-gradient(160deg,var(--accent),var(--accent-ink)); color:#fff; }
      .fab{ position:fixed; right:22px; bottom:96px; width:58px; height:58px; border-radius:50%; background:linear-gradient(160deg,var(--accent),var(--accent-ink)); color:#fff; font-size:22px; display:flex; align-items:center; justify-content:center; cursor:pointer; border: none; box-shadow:0 14px 30px -10px rgba(74,47,181,.6); z-index: 35;}
      nav.tabbar{ position:fixed; left:0; right:0; bottom:0; z-index:40; padding:8px 10px 10px; backdrop-filter:blur(24px); background:rgba(255,255,255,.72); border-top:1px solid rgba(255,255,255,.6); }
      .tabbar-inner{ display:flex; justify-content:space-around; }
      .tab{ background:none; border:none; display:flex; flex-direction:column; align-items:center; gap:3px; color:var(--text-3); font-size:10px; font-weight:600; cursor:pointer; padding:4px 8px; }
      .tab.active{color:var(--accent-ink);}
    </style></head>
    <body>
      <div class="app">
        <header class="top"><div class="eyebrow"><span class="dot"></span> INFODOSE · 369</div><h1 class="large">Espaço da Mente</h1></header>
        <main>
          <section class="screen active" id="screen-espaco">
            <div class="card" style="text-align:center; padding: 40px 20px;">
              <h2 style="margin:0 0 10px; color:var(--accent-ink)">3·6·9 Ciclo Ativo</h2>
              <p style="font-size:14px; color:var(--text-2);">Você traz o que está dentro. O sistema organiza. A fusão transforma os dois em algo novo.</p>
              <br>
              <button class="btn btn-primary" onclick="alert('Funcionalidade encapsulada demonstrativa no Monolith.')">🎙 Falar (Simulação)</button>
            </div>
          </section>
        </main>
        <button class="fab">＋</button>
        <nav class="tabbar"><div class="tabbar-inner">
          <button class="tab active"><span class="tic">✦</span>Espaço</button>
          <button class="tab"><span class="tic">📚</span>Biblioteca</button>
          <button class="tab"><span class="tic">🌀</span>Fusão</button>
        </div></nav>
      </div>
    </body></html>
  `;

  // ─── DEV PANEL ───
  const DevPanel = {
    isOpen: false,

    toggle() {
      this.isOpen = !this.isOpen;
      document.getElementById('dev-panel').classList.toggle('active', this.isOpen);
      if (this.isOpen) this.refreshSessionsList();
    },

    getSessions() {
      const panels = Array.from(document.querySelectorAll('#universe-viewport > .screen-panel'));
      return panels.map((p, idx) => ({
        element: p,
        id: p.id,
        title: p.getAttribute('data-title') || p.id.replace('view-', '').toUpperCase(),
        icon: p.getAttribute('data-icon') || 'square',
        locked: p.getAttribute('data-locked') === 'true',
        hidden: p.style.display === 'none',
        index: idx
      }));
    },

    refreshSessionsList() {
      const sessions = this.getSessions();
      const listContainer = document.getElementById('dev-sessions-list');
      const selectTarget = document.getElementById('dev-inject-target');

      listContainer.innerHTML = '';
      selectTarget.innerHTML = '<option value="NEW_SESSION">+ Criar Nova Session Window</option>';

      sessions.forEach(s => {
        const opt = document.createElement('option');
        opt.value = s.id;
        opt.textContent = `[${s.id}] ${s.title}`;
        selectTarget.appendChild(opt);

        const card = document.createElement('div');
        card.className = 'dev-card flex items-center justify-between';
        card.innerHTML = `
          <div>
            <span class="text-xs font-mono font-bold text-white/90">${s.title}</span>
            <span class="block text-[9px] text-white/30 font-mono">#${s.id}</span>
          </div>
          <div class="flex gap-2">
            <button onclick="DevPanel.toggleSessionVisibility('${s.id}')" class="dev-btn ${!s.hidden ? 'dev-btn-active' : ''}">
              ${!s.hidden ? '👁️ ON' : '🙈 OFF'}
            </button>
          </div>
        `;
        listContainer.appendChild(card);
      });

      this.updateNavigationUI();
    },

    toggleSessionVisibility(id) {
      const el = document.getElementById(id);
      if (!el) return;
      el.style.display = (el.style.display === 'none') ? 'block' : 'none';
      this.refreshSessionsList();
    },

    updateNavigationUI() {
      const sessions = this.getSessions().filter(s => !s.hidden);
      const navContainer = document.getElementById('nav-indicator');
      const nexusShortcuts = document.getElementById('nexus-shortcut-buttons');

      if (navContainer) {
        navContainer.innerHTML = '';
        sessions.forEach((s, idx) => {
          const dot = document.createElement('div');
          dot.className = `dot ${idx === 1 ? 'active' : ''}`;
          dot.id = `dot-${idx}`;
          dot.onclick = () => {
            if (typeof Navigation !== 'undefined' && Navigation.to) {
              Navigation.to(idx);
            }
          };
          navContainer.appendChild(dot);
        });
      }

      if (nexusShortcuts) {
        nexusShortcuts.innerHTML = '';
        sessions.forEach((s) => {
          if (s.id === 'view-nexus') return;
          const btn = document.createElement('button');
          btn.className = 'v-pill hover:bg-white/10 border-white/10';
          btn.onclick = () => {
            const visibleIndex = sessions.findIndex(item => item.id === s.id);
            if (typeof Navigation !== 'undefined' && Navigation.to) {
              Navigation.to(visibleIndex);
            }
          };
          btn.innerHTML = `<span class="icon inline-block w-4 h-4 text-white/70" data-icon="${s.icon}"></span> ${s.title}`;
          nexusShortcuts.appendChild(btn);
        });
      }
    },

    injectContent() {
      const targetId = document.getElementById('dev-inject-target').value;
      const fileInput = document.getElementById('dev-file-input');
      const codeInline = document.getElementById('dev-code-inline').value;

      if (fileInput.files.length > 0) {
        const file = fileInput.files[0];
        const reader = new FileReader();
        reader.onload = (e) => {
          this.processAndInject(targetId, e.target.result, file.name);
        };
        reader.readAsText(file);
      } else if (codeInline.trim() !== '') {
        this.processAndInject(targetId, codeInline, 'Custom Script');
      } else {
        alert('Por favor, selecione um arquivo ou insira o código.');
      }
    },

    processAndInject(targetId, content, title) {
      let container;

      if (targetId === 'NEW_SESSION') {
        const newId = 'view-custom-' + Date.now();
        container = document.createElement('section');
        container.className = 'screen-panel pt-28 px-4';
        container.id = newId;
        container.setAttribute('data-title', title.replace(/\.[^/.]+$/, ""));
        container.setAttribute('data-icon', 'code');
        document.getElementById('universe-viewport').appendChild(container);
      } else {
        container = document.getElementById(targetId);
        if (!container) {
          alert('View não encontrada. Tente recarregar.');
          return;
        }
      }

      if (!content.includes('<html') && !content.includes('<div') && !content.includes('<section')) {
        const scriptEl = document.createElement('script');
        scriptEl.textContent = content;
        container.appendChild(scriptEl);
      } else {
        const wrapper = document.createElement('div');
        wrapper.className = 'max-w-5xl mx-auto pb-24 v-glass p-6 rounded-2xl';
        wrapper.innerHTML = content;
        container.appendChild(wrapper);

        Array.from(wrapper.querySelectorAll('script')).forEach(oldScript => {
          const newScript = document.createElement('script');
          Array.from(oldScript.attributes).forEach(attr => newScript.setAttribute(attr.name, attr.value));
          newScript.appendChild(document.createTextNode(oldScript.innerHTML));
          oldScript.parentNode.replaceChild(newScript, oldScript);
        });
      }

      alert(`Conteúdo injetado com sucesso em #${container.id}!`);
      this.refreshSessionsList();
    },

    createIFSW() {
      const url = document.getElementById('dev-ifsw-url').value;
      const title = document.getElementById('dev-ifsw-title').value || 'App Session';
      if (!url) return alert('Informe a URL.');
      if (!window.NebulaSW || typeof window.NebulaSW.open !== 'function') {
        alert('Motor NebulaSW não disponível.');
        return;
      }
      window.NebulaSW.open({
        id: 'ifsw-' + Date.now(),
        name: title,
        type: 'html',
        url: url,
        content: ''
      });
      this.toggle();
    },

    launchSementeApp() {
      if (!window.NebulaSW || typeof window.NebulaSW.open !== 'function') {
        alert('Motor NebulaSW não disponível.');
        return;
      }
      window.NebulaSW.open({
        id: 'semente-' + Date.now(),
        name: 'INFODOSE 369',
        type: 'html',
        content: SEMENTE_APP_SRCDOC,
        url: ''
      });
      this.toggle();
    }
  };

  window.DevPanel = DevPanel;

  document.addEventListener('click', (event) => {
    const panel = document.getElementById('dev-panel');
    const trigger = event.target.closest('[onclick="DevPanel.toggle()"]');

    if (
      DevPanel.isOpen &&
      panel &&
      !panel.contains(event.target) &&
      !trigger
    ) {
      DevPanel.toggle();
    }
  });

  window.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => DevPanel.updateNavigationUI(), 500);
  });

})();

// ═══════════════════════════════════════════════════════════════════
// KOBLLUX LOGGER / ORCHESTRATOR — relatório completo no console
// ═══════════════════════════════════════════════════════════════════
(function(){
  "use strict";

  const c = console;
  const style = {
    header: 'background: #1a1a2e; color: #b8c6db; font-weight: bold; padding: 4px 8px; border-radius: 4px;',
    accent: 'color: #a78bfa; font-weight: bold;',
    gold: 'color: #fbbf24; font-weight: bold;',
    cyan: 'color: #67e8f9;',
    green: 'color: #34d399;',
    red: 'color: #f87171;',
    dim: 'color: #6b7280;'
  };

  const log = (msg, ...args) => c.log(`%c${msg}`, style.header, ...args);
  const group = (name, fn) => { c.group(`%c${name}`, style.accent); fn(); c.groupEnd(); };
  const status = (label, value, color = 'cyan') => c.log(`%c${label}:`, style[color] || style.dim, value);

  const modules = [
    { name: 'NebulaSW', obj: window.NebulaSW, desc: 'Motor de janelas (Session Window) — gerencia janelas flutuantes com maximizar, minimizar, peek, collapse e dock.', methods: ['open', 'close', 'closeAll'] },
    { name: 'NebulaPlayer', obj: window.NebulaPlayer, desc: 'Player de áudio com TTS, OCR, destaque de palavras, timeline e suporte a PDF/HTML/Markdown/JSON.', methods: ['loadExternalItem', 'togglePlay', 'play', 'pause', 'stop', 'getStatus'] },
    { name: 'DevPanel', obj: window.DevPanel, desc: 'Painel de desenvolvimento — injeção de código, criação de janelas iFSW e lançamento da Semente App.', methods: ['toggle', 'createIFSW', 'launchSementeApp', 'injectContent'] },
    { name: 'openReader', obj: window.openReader, desc: 'Função global que abre um documento na Session Window (com fallback para o Reader antigo).', methods: [] },
    { name: 'markdownToHTML', obj: window.markdownToHTML, desc: 'Conversor de Markdown para HTML (usado nos previews e no Reader).', methods: [] },
    { name: 'activatePreview', obj: window.activatePreview, desc: 'Ativa o preview inline de PDF/HTML dentro dos cards.', methods: [] },
    { name: 'deactivatePreview', obj: window.deactivatePreview, desc: 'Desativa o preview inline, restaurando o placeholder.', methods: [] }
  ];

  c.clear();
  c.log('%c╔══════════════════════════════════════════════════════════════════╗', 'color: #a78bfa;');
  c.log('%c║            KOBLLUX · NEBULA PRO · DUAL INFODOSE 78K           ║', 'color: #fbbf24;');
  c.log('%c╚══════════════════════════════════════════════════════════════════╝', 'color: #a78bfa;');
  c.log('');

  log('🚀 BOOT LOADER · ORCHESTRATOR ATIVO');

  group('📦 MÓDULOS DETECTADOS', () => {
    modules.forEach(mod => {
      const loaded = !!mod.obj;
      c.log(`%c${loaded ? '✅' : '❌'} ${mod.name}`, loaded ? style.green : style.red);
      if (loaded) {
        c.log(`   %c${mod.desc}`, style.dim);
        if (mod.methods.length) {
          c.log(`   %cMétodos: ${mod.methods.join(', ')}`, style.cyan);
        }
        const props = Object.keys(mod.obj).filter(k => typeof mod.obj[k] !== 'function');
        if (props.length) {
          c.log(`   %cPropriedades: ${props.join(', ')}`, style.dim);
        }
      }
    });
  });

  group('📊 ESTADO ATUAL', () => {
    const windows = window.NebulaSW ? Array.from(document.querySelectorAll('.nb-session-window')) : [];
    status('Janelas abertas', windows.length);
    windows.forEach((w, i) => {
      const title = w.querySelector('.nb-win-title')?.textContent?.trim() || 'sem título';
      const classes = w.className.replace('nb-session-window', '').trim() || 'normal';
      c.log(`   %c#${i+1} ${title} (${classes})`, style.dim);
    });

    if (window.NebulaPlayer) {
      const st = window.NebulaPlayer.getStatus();
      status('Player', st.playing ? '▶ reproduzindo' : '⏹ parado');
      status('  Documento', st.name || 'nenhum');
      status('  Páginas', st.pages);
      status('  Parágrafos', st.paragraphCount);
      status('  Índice atual', st.currentIdx);
    } else {
      status('Player', 'não disponível');
    }

    const libCount = document.querySelectorAll('#items .item').length;
    status('Itens na biblioteca', libCount);
    const heroItems = document.querySelectorAll('.hero-card').length;
    status('Itens no Hero', heroItems);
    status('DevPanel', window.DevPanel?.isOpen ? 'aberto' : 'fechado');
  });

  group('⚙️ FUNCIONALIDADES PRINCIPAIS', () => {
    c.log('• Clique em → (seta) nos cards → abre Session Window');
    c.log('• Clique em 🔊 (ouvir) → carrega no Player e inicia TTS');
    c.log('• Clique em 📋 (copiar) → copia o conteúdo do documento');
    c.log('• Clique em ✏️ (editar) → abre editor inline com details/summary');
    c.log('• Botões de visualização: Cards, Lista, Grid');
    c.log('• Clique no preview do card → ativa preview inline');
    c.log('• Clique no ✕ do preview → desativa');
    c.log('• Session Window: maximize (⬜), minimize (🔘), collapse (—), close (✕), play (🔊)');
    c.log('• Dev Panel: toggle com botão no canto (ou via console: DevPanel.toggle())');
  });

  group('🔗 INTEGRAÇÕES', () => {
    c.log('• NebulaSW ↔ openReader: substituído para usar Session Window');
    c.log('• NebulaSW ↔ NebulaPlayer: botão 🔊 na janela carrega o Player');
    c.log('• DevPanel ↔ NebulaSW: createIFSW() e launchSementeApp() usam NebulaSW.open');
    c.log('• Hero/Biblioteca ↔ Player: botões 🔊 chamam NebulaPlayer.loadExternalItem()');
    c.log('• Preview inline ↔ activatePreview/deactivatePreview (independente)');
  });

  c.log('%c\n✨ SISTEMA PRONTO — TODOS OS MÓDULOS INTEGRADOS ✨', 'color: #fbbf24; font-weight: bold;');
  c.log('%cConsulte o código-fonte para detalhes de cada função.', style.dim);

})();