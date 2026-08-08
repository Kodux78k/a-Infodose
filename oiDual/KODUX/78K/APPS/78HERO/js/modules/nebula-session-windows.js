// ═══════════════════════════════════════════════════════════════════
// KBLX: NEBULA · SESSION WINDOWS (iFS adaptado pros previews de documentos)
// Self-contained: injeta o próprio CSS, não depende de nenhum arquivo externo.
// API pública: NebulaSW.open(doc)  /  NebulaSW.closeAll()
// ═══════════════════════════════════════════════════════════════════
(function () {
    "use strict";

    if (window.NebulaSW) return; // evita registrar duas vezes

    const MIN_W = 220, MIN_H = 160, EDGE_PAD = 10;
    const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
    const openWindows = new Map(); // doc.id -> { el, docRef }
    let zTop = 9000;
    const clickTimers = {};

    // ── CSS injetado (uma vez) ──
    function injectStyles() {
        if (document.getElementById("nebula-sw-style")) return;
        const style = document.createElement("style");
        style.id = "nebula-sw-style";
        style.textContent = `
#nb-sw-stack{position:fixed;inset:0;pointer-events:none;z-index:8900;}
#nb-sw-dock{position:fixed;left:10px;bottom:calc(10px + env(safe-area-inset-bottom,0px));display:flex;gap:8px;z-index:9999;pointer-events:auto;flex-wrap:wrap;max-width:calc(100% - 20px);}
.nb-dock-bubble{width:40px;height:40px;border-radius:50%;background:rgba(20,20,26,.92);border:1px solid rgba(255,255,255,.14);display:flex;align-items:center;justify-content:center;font-size:16px;cursor:pointer;backdrop-filter:blur(10px);box-shadow:0 6px 18px rgba(0,0,0,.35);}
.nb-session-window{position:fixed;top:80px;left:12px;width:min(420px,calc(100% - 24px));height:320px;background:rgba(16,16,20,.96);border:1px solid rgba(255,255,255,.12);border-radius:16px;box-shadow:0 16px 40px rgba(0,0,0,.5);overflow:hidden;display:flex;flex-direction:column;pointer-events:auto;backdrop-filter:blur(14px);transition:height .18s ease, width .18s ease;}
.nb-session-window.collapsed{height:44px !important;}
.nb-session-window.peeked{height:min(46vh,420px);}
.nb-session-window.maximized{top:0 !important;left:0 !important;right:0;bottom:0;width:100% !important;height:100% !important;border-radius:0;max-width:none;}
.nb-session-window.minimized{display:none;}
.nb-session-window.resizing{transition:none;}
.nb-win-hdr{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:8px 10px;background:rgba(255,255,255,.04);border-bottom:1px solid rgba(255,255,255,.08);cursor:pointer;flex:0 0 auto;user-select:none;}
.nb-win-title{font-size:12px;font-weight:700;color:#fff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;flex:1;}
.nb-win-controls{display:flex;gap:4px;flex:0 0 auto;}
.nb-win-controls button{width:24px;height:24px;border:0;border-radius:8px;background:rgba(255,255,255,.06);color:#fff;font-size:11px;cursor:pointer;display:flex;align-items:center;justify-content:center;}
.nb-win-controls button:active{background:rgba(255,255,255,.14);}
.nb-win-body{flex:1;position:relative;overflow:auto;background:#0b0b0e;}
.nb-win-body iframe{width:100%;height:100%;border:0;background:#fff;}
.nb-win-body .nb-text-view{padding:14px;color:#e8e8ef;font-size:13px;line-height:1.5;white-space:pre-wrap;}
.nb-win-body .nb-md-view{padding:14px;color:#e8e8ef;font-size:13px;line-height:1.6;}
.ifsw-handle-y{position:absolute;left:0;right:0;bottom:0;height:10px;cursor:ns-resize;}
.ifsw-handle-x{position:absolute;top:0;bottom:0;right:0;width:10px;cursor:ew-resize;}
.ifsw-handle-corner{position:absolute;right:0;bottom:0;width:16px;height:16px;cursor:nwse-resize;}
        `;
        document.head.appendChild(style);
    }

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

    function bringToFront(win) {
        zTop += 1;
        win.style.zIndex = String(zTop);
    }

    function renderBody(doc) {
        // pdf / html com URL própria -> iframe de verdade
        if ((doc.type === "pdf" || doc.type === "html") && doc.url) {
            return `<iframe src="${doc.url}" sandbox="allow-scripts allow-same-origin allow-popups allow-forms" loading="lazy"></iframe>`;
        }
        // demais tipos: renderiza o conteúdo diretamente (sem iframe, mais leve)
        if (doc.type === "markdown" && typeof window.markdownToHTML === "function") {
            return `<div class="nb-md-view">${window.markdownToHTML(doc.content || "")}</div>`;
        }
        if (doc.type === "json") {
            let pretty = doc.content || "";
            try { pretty = JSON.stringify(JSON.parse(doc.content), null, 2); } catch (e) {}
            return `<div class="nb-text-view">${escapeHTMLLocal(pretty)}</div>`;
        }
        return `<div class="nb-text-view">${escapeHTMLLocal(doc.content || "Sem conteúdo.")}</div>`;
    }

    function escapeHTMLLocal(str) {
        return String(str ?? "")
            .replace(/&/g, "&amp;").replace(/</g, "&lt;")
            .replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
    }

    function handleHeaderClick(e, id) {
        if (e.target.closest(".nb-win-controls")) return;
        if (!clickTimers[id]) {
            clickTimers[id] = setTimeout(() => {
                delete clickTimers[id];
                togglePeek(id);
            }, 250);
        } else {
            clearTimeout(clickTimers[id]);
            delete clickTimers[id];
            toggleMaximize(id);
        }
    }

    function togglePeek(id) {
        const entry = openWindows.get(id);
        if (!entry) return;
        entry.el.classList.toggle("peeked");
        entry.el.classList.remove("collapsed");
        bringToFront(entry.el);
    }

    function toggleCollapse(id) {
        const entry = openWindows.get(id);
        if (!entry) return;
        entry.el.classList.toggle("collapsed");
        entry.el.classList.remove("peeked");
    }

    function toggleMaximize(id) {
        const entry = openWindows.get(id);
        if (!entry) return;
        entry.el.classList.toggle("maximized");
        entry.el.classList.remove("collapsed", "minimized");
        bringToFront(entry.el);
    }

    function minimizeWindow(id) {
        const entry = openWindows.get(id);
        if (!entry) return;
        entry.el.classList.add("minimized");
        entry.el.classList.remove("maximized", "collapsed", "peeked");

        const { dock } = ensureShell();
        let bubble = document.getElementById(`nb-dock-${id}`);
        if (!bubble) {
            bubble = document.createElement("div");
            bubble.className = "nb-dock-bubble";
            bubble.id = `nb-dock-${id}`;
            bubble.title = entry.docRef.name || "Documento";
            const icon = { pdf: "📕", html: "🌐", markdown: "📝", json: "📋", txt: "📄" }[entry.docRef.type] || "📄";
            bubble.textContent = icon;
            bubble.addEventListener("click", () => {
                entry.el.classList.remove("minimized");
                bubble.remove();
                bringToFront(entry.el);
            });
            dock.appendChild(bubble);
        }
    }

    function closeWindow(id) {
        const entry = openWindows.get(id);
        if (!entry) return;
        const bubble = document.getElementById(`nb-dock-${id}`);
        if (bubble) bubble.remove();
        entry.el.remove();
        openWindows.delete(id);
    }

    function closeAll() {
        Array.from(openWindows.keys()).forEach(closeWindow);
    }

    // ── Resize (Y / X / canto) ──
    function bindResize(win, handle, axis) {
        let active = false, startX = 0, startY = 0, startW = 0, startH = 0, pid = null;
        handle.addEventListener("pointerdown", (e) => {
            if (e.button != null && e.button !== 0) return;
            active = true;
            pid = e.pointerId;
            startX = e.clientX; startY = e.clientY;
            const rect = win.getBoundingClientRect();
            startW = rect.width; startH = rect.height;
            win.classList.remove("collapsed", "peeked", "maximized");
            win.classList.add("resizing");
            handle.setPointerCapture?.(e.pointerId);
            e.preventDefault();

            const move = (ev) => {
                if (!active || ev.pointerId !== pid) return;
                ev.preventDefault();
                const dx = ev.clientX - startX, dy = ev.clientY - startY;
                const maxW = window.innerWidth - EDGE_PAD;
                const maxH = window.innerHeight - EDGE_PAD;
                if (axis === "y" || axis === "corner") {
                    win.style.height = `${clamp(startH + dy, MIN_H, maxH)}px`;
                }
                if (axis === "x" || axis === "corner") {
                    win.style.width = `${clamp(startW + dx, MIN_W, maxW)}px`;
                }
            };
            const up = (ev) => {
                if (ev && ev.pointerId !== pid) return;
                active = false;
                window.removeEventListener("pointermove", move);
                window.removeEventListener("pointerup", up);
                window.removeEventListener("pointercancel", up);
                win.classList.remove("resizing");
            };
            window.addEventListener("pointermove", move, { passive: false });
            window.addEventListener("pointerup", up, { passive: true });
            window.addEventListener("pointercancel", up, { passive: true });
        }, { passive: false });
    }

    function attachHandles(win) {
        const hy = document.createElement("div"); hy.className = "ifsw-handle-y";
        const hx = document.createElement("div"); hx.className = "ifsw-handle-x";
        const hc = document.createElement("div"); hc.className = "ifsw-handle-corner";
        win.appendChild(hy); win.appendChild(hx); win.appendChild(hc);
        bindResize(win, hy, "y");
        bindResize(win, hx, "x");
        bindResize(win, hc, "corner");
    }

    // ── API pública ──
    function open(doc) {
        if (!doc || !doc.id) return;
        const { stack } = ensureShell();

        // Já existe janela pra esse doc? Só traz pra frente e garante visível.
        if (openWindows.has(doc.id)) {
            const entry = openWindows.get(doc.id);
            entry.el.classList.remove("minimized", "collapsed");
            entry.el.classList.add("peeked");
            const bubble = document.getElementById(`nb-dock-${doc.id}`);
            if (bubble) bubble.remove();
            bringToFront(entry.el);
            return;
        }

        const win = document.createElement("div");
        win.className = "nb-session-window peeked";
        win.id = `nb-win-${doc.id}`;
        const icon = { pdf: "📕", html: "🌐", markdown: "📝", json: "📋", txt: "📄" }[doc.type] || "📄";

        win.innerHTML = `
            <div class="nb-win-hdr">
                <div class="nb-win-title">${icon} ${escapeHTMLLocal(doc.name || "Documento")}</div>
                <div class="nb-win-controls">
                    <button data-act="collapse" title="Colapsar">—</button>
                    <button data-act="maximize" title="Maximizar">⬜</button>
                    <button data-act="minimize" title="Minimizar">🔘</button>
                    <button data-act="close" title="Fechar">✕</button>
                </div>
            </div>
            <div class="nb-win-body">${renderBody(doc)}</div>
        `;

        win.querySelector('[data-act="collapse"]').addEventListener("click", (e) => { e.stopPropagation(); toggleCollapse(doc.id); });
        win.querySelector('[data-act="maximize"]').addEventListener("click", (e) => { e.stopPropagation(); toggleMaximize(doc.id); });
        win.querySelector('[data-act="minimize"]').addEventListener("click", (e) => { e.stopPropagation(); minimizeWindow(doc.id); });
        win.querySelector('[data-act="close"]').addEventListener("click", (e) => { e.stopPropagation(); closeWindow(doc.id); });
        win.querySelector(".nb-win-hdr").addEventListener("click", (e) => handleHeaderClick(e, doc.id));
        win.addEventListener("pointerdown", () => bringToFront(win));

        // Empilha em cascata leve pra não abrir tudo exatamente no mesmo lugar
        const offset = (openWindows.size % 6) * 18;
        win.style.top = `calc(80px + ${offset}px)`;
        win.style.left = `calc(12px + ${offset}px)`;

        attachHandles(win);
        stack.appendChild(win);
        openWindows.set(doc.id, { el: win, docRef: doc });
        bringToFront(win);
    }

    window.NebulaSW = { open, close: closeWindow, closeAll };

    window.handleHeaderClick = window.handleHeaderClick || handleHeaderClick;
    window.togglePeek = window.togglePeek || togglePeek;
    window.toggleCollapse = window.toggleCollapse || toggleCollapse;
    window.toggleMaximize = window.toggleMaximize || toggleMaximize;
    window.minimizeWindow = window.minimizeWindow || minimizeWindow;
    window.closeWindow = window.closeWindow || closeWindow;
})();
