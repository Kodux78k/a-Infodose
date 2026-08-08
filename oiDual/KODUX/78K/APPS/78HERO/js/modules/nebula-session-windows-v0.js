// ═══════════════════════════════════════════════════════════════════
// KBLX: NEBULA · SESSION WINDOWS (iFS adaptado)
// Agora com o design e classes do IFS-css.html
// API pública: NebulaSW.open(doc)  /  NebulaSW.closeAll()
// ═══════════════════════════════════════════════════════════════════
(function () {
    "use strict";

    if (window.NebulaSW) return; // evita duplicação

    const MIN_W = 280, MIN_H = 160, EDGE_PAD = 10;
    const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
    const openWindows = new Map(); // doc.id -> { el, docRef }
    let zTop = 9000;
    const clickTimers = {};

    // ── Obtém ou cria os containers (usa os mesmos do IFS) ──
    function ensureShell() {
        let stack = document.getElementById("stackWrap");
        if (!stack) {
            stack = document.createElement("div");
            stack.id = "stackWrap";
            stack.style.cssText =
                "width:100%;max-width:800px;margin:40px auto 0;padding:0;" +
                "box-sizing:border-box;position:relative;z-index:1;" +
                "display:flex;flex-direction:column;gap:20px;";
            document.body.appendChild(stack);
        }

        let dock = document.getElementById("dock");
        if (!dock) {
            dock = document.createElement("div");
            dock.id = "dock";
            dock.style.cssText =
                "position:fixed;left:12px;bottom:calc(80px + env(safe-area-inset-bottom,0px));" +
                "display:flex;flex-direction:column;align-items:center;gap:10px;" +
                "padding:12px 10px;border-radius:24px;" +
                "background:rgba(0,0,0,0.55);backdrop-filter:blur(15px);" +
                "-webkit-backdrop-filter:blur(15px);border:1px solid rgba(255,255,255,0.1);" +
                "z-index:2500;transition:0.3s;";
            document.body.appendChild(dock);
        }

        return { stack, dock };
    }

    function bringToFront(win) {
        zTop += 1;
        win.style.zIndex = String(zTop);
    }

    // ── Renderiza o corpo da janela (usa classe .win-frame) ──
    function renderBody(doc) {
        if ((doc.type === "pdf" || doc.type === "html") && doc.url) {
            return `<iframe class="win-frame" src="${doc.url}" sandbox="allow-scripts allow-same-origin allow-popups allow-forms" loading="lazy"></iframe>`;
        }
        if (doc.type === "markdown" && typeof window.markdownToHTML === "function") {
            return `<div class="win-frame nb-md-view">${window.markdownToHTML(doc.content || "")}</div>`;
        }
        if (doc.type === "json") {
            let pretty = doc.content || "";
            try { pretty = JSON.stringify(JSON.parse(doc.content), null, 2); } catch (e) {}
            return `<div class="win-frame nb-text-view">${escapeHTML(pretty)}</div>`;
        }
        return `<div class="win-frame nb-text-view">${escapeHTML(doc.content || "Sem conteúdo.")}</div>`;
    }

    function escapeHTML(str) {
        return String(str ?? "")
            .replace(/&/g, "&amp;").replace(/</g, "&lt;")
            .replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
    }

    // ── Eventos do header (clique simples → peek, duplo → maximize) ──
    function handleHeaderClick(e, id) {
        if (e.target.closest(".win-controls")) return;
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

    // ── Estados ──
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
        let bubble = document.getElementById(`dock-${id}`);
        if (!bubble) {
            bubble = document.createElement("div");
            bubble.className = "dock-bubble";
            bubble.id = `dock-${id}`;
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
        const bubble = document.getElementById(`dock-${id}`);
        if (bubble) bubble.remove();
        entry.el.remove();
        openWindows.delete(id);
    }

    function closeAll() {
        Array.from(openWindows.keys()).forEach(closeWindow);
    }

    // ── Resize (Y / X / corner) com as mesmas classes do IFS ──
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
        // Só adiciona se ainda não existirem
        if (win.querySelector(".ifsw-handle-y")) return;

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

        // Se já existe, traz à frente e restaura
        if (openWindows.has(doc.id)) {
            const entry = openWindows.get(doc.id);
            entry.el.classList.remove("minimized", "collapsed");
            entry.el.classList.add("peeked");
            const bubble = document.getElementById(`dock-${doc.id}`);
            if (bubble) bubble.remove();
            bringToFront(entry.el);
            return;
        }

        // Cria a janela com as classes do IFS
        const win = document.createElement("div");
        win.className = "session-window peeked";
        win.id = `nb-win-${doc.id}`;
        const icon = { pdf: "📕", html: "🌐", markdown: "📝", json: "📋", txt: "📄" }[doc.type] || "📄";

        win.innerHTML = `
            <div class="win-hdr">
                <div class="win-title">${icon} ${escapeHTML(doc.name || "Documento")}</div>
                <div class="win-controls">
                    <button data-act="collapse" title="Colapsar">—</button>
                    <button data-act="maximize" title="Maximizar">⬜</button>
                    <button data-act="minimize" title="Minimizar">🌐</button>
                    <button data-act="close" title="Fechar">✕</button>
                </div>
            </div>
            ${renderBody(doc)}
        `;

        // Eventos dos botões
        win.querySelector('[data-act="collapse"]').addEventListener("click", (e) => {
            e.stopPropagation();
            toggleCollapse(doc.id);
        });
        win.querySelector('[data-act="maximize"]').addEventListener("click", (e) => {
            e.stopPropagation();
            toggleMaximize(doc.id);
        });
        win.querySelector('[data-act="minimize"]').addEventListener("click", (e) => {
            e.stopPropagation();
            minimizeWindow(doc.id);
        });
        win.querySelector('[data-act="close"]').addEventListener("click", (e) => {
            e.stopPropagation();
            closeWindow(doc.id);
        });

        // Clique no header (gerencia peek / maximize)
        win.querySelector(".win-hdr").addEventListener("click", (e) => {
            handleHeaderClick(e, doc.id);
        });

        // Traz para frente ao clicar na janela
        win.addEventListener("pointerdown", () => bringToFront(win));

        // Cascata leve
        const offset = (openWindows.size % 6) * 18;
        win.style.top = `calc(80px + ${offset}px)`;
        win.style.left = `calc(12px + ${offset}px)`;

        // Adiciona os handles de resize (com as classes do IFS)
        attachHandles(win);

        // Insere no container
        stack.appendChild(win);
        openWindows.set(doc.id, { el: win, docRef: doc });
        bringToFront(win);
    }

    // ── Exposição global ──
    window.NebulaSW = {
        open,
        close: closeWindow,
        closeAll
    };

    // Funções auxiliares expostas (para uso em atributos onclick, se necessário)
    window.handleHeaderClick = handleHeaderClick;
    window.togglePeek = togglePeek;
    window.toggleCollapse = toggleCollapse;
    window.toggleMaximize = toggleMaximize;
    window.minimizeWindow = minimizeWindow;
    window.closeWindow = closeWindow;

})();