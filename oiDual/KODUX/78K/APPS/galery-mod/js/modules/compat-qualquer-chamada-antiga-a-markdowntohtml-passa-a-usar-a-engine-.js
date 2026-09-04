// ═══════════════════════════════════════════════════════════════════
    // KBLX: NEBULA · SESSION WINDOWS vMAX
    // ═══════════════════════════════════════════════════════════════════
    (function () {
        "use strict";
        if (window.NebulaSW) return;
        const MIN_W = 220, MIN_H = 160, EDGE_PAD = 10;
        const openWindows = new Map();
        let zTop = 9000;
        const clickTimers = Object.create(null);

        function injectStyles() {
            if (document.getElementById("nebula-sw-style")) return;
            const style = document.createElement("style"); style.id = "nebula-sw-style";
            style.textContent = `
    #nb-sw-stack{ position:fixed; inset:0; pointer-events:none; z-index:8900; }
    #nb-sw-dock{ position:fixed; left:10px; bottom:calc(90px + env(safe-area-inset-bottom,0px)); display:flex; gap:8px; z-index:99999; pointer-events:auto; flex-wrap:wrap; max-width:calc(100% - 20px); }
    .nb-dock-bubble{ width:40px; height:40px; border-radius:50%; background:rgba(20,20,26,.92); border:1px solid rgba(255,255,255,.14); display:flex; align-items:center; justify-content:center; font-size:16px; cursor:pointer; backdrop-filter:blur(10px); -webkit-backdrop-filter:blur(10px); box-shadow:0 6px 18px rgba(0,0,0,.35); user-select:none; }
    .nb-session-window{ position:fixed; top:80px; left:12px; width:min(420px,calc(100% - 24px)); height:320px; background:rgba(16,16,20,.96); border:1px solid rgba(255,255,255,.12); border-radius:16px; box-shadow:0 16px 40px rgba(0,0,0,.5); overflow:hidden; display:flex; flex-direction:column; pointer-events:auto; backdrop-filter:blur(14px); -webkit-backdrop-filter:blur(14px); transition: height .18s ease, width .18s ease, top .18s ease, left .18s ease, border-radius .18s ease; contain:layout paint; }
    .nb-session-window.collapsed{ height:44px !important; }
    .nb-session-window.peeked{ height:min(46vh,420px); }
    .nb-session-window.maximized{ position:fixed !important; z-index:2147483000 !important; top:0 !important; left:0 !important; width:100% !important; height:100% !important; max-width:none !important; max-height:none !important; border-radius:0 !important; }
    .nb-session-window.maximized:not(.peeked):not(.collapsed):not(.minimized){ top:0 !important; left:0 !important; width:100vw !important; height:100vh !important; }
    .nb-session-window.minimized{ display:none; }
    .nb-win-body{ flex:1 1 auto; min-height:0; position:relative; overflow:auto; background:#0b0b0e; }
    .nb-win-body iframe{ display:block; width:100%; height:100%; border:0; background:#fff; }
    .nb-win-body .nb-text-view, .nb-win-body .nb-md-view{ padding:14px; color:#e8e8ef; font-size:13px; line-height:1.5; white-space:pre-wrap; overflow:auto; height:100%; box-sizing:border-box; }
    .nb-win-hdr{ display:flex; align-items:center; justify-content:space-between; gap:8px; min-height:44px; padding:8px 10px; background:rgba(255,255,255,.04); border-bottom:1px solid rgba(255,255,255,.08); cursor:pointer; flex:0 0 auto; user-select:none; z-index:5; }
    .nb-win-title{ font-size:12px; font-weight:700; color:#fff; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; flex:1; }
    .nb-win-controls{ display:flex; gap:4px; flex:0 0 auto; }
    .nb-win-controls button{ width:24px; height:24px; border:0; border-radius:8px; background:rgba(255,255,255,.06); color:#fff; font-size:11px; cursor:pointer; display:flex; align-items:center; justify-content:center; }
    .nb-win-controls button:active{ background:rgba(255,255,255,.14); }
            `; document.head.appendChild(style);
        }

        function ensureShell() {
            injectStyles(); let stack = document.getElementById("nb-sw-stack");
            if (!stack) { stack = document.createElement("div"); stack.id = "nb-sw-stack"; document.body.appendChild(stack); }
            let dock = document.getElementById("nb-sw-dock");
            if (!dock) { dock = document.createElement("div"); dock.id = "nb-sw-dock"; document.body.appendChild(dock); }
            return { stack, dock };
        }

        function bringToFront(win) {
            if (win.classList.contains("maximized")) { win.style.zIndex = "2147483000"; return; }
            zTop += 1; win.style.zIndex = String(zTop);
        }

        function escapeHTMLLocal(str) { return String(str ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;"); }

        function renderBody(doc) {
            if (doc.type === "slice") return `<div class="nb-slice-host" data-slice-host></div>`;
            if ((doc.type === "pdf" || doc.type === "html") && doc.url) return `<iframe src="${escapeHTMLLocal(doc.url)}" sandbox="allow-scripts allow-same-origin allow-popups allow-forms" loading="lazy"></iframe>`;
            if (doc.type === "markdown" && typeof window.markdownToHTML === "function") return `<div class="nb-md-view">${window.markdownToHTML(doc.content || "")}</div>`;
            if (doc.type === "json") {
                let pretty = doc.content || ""; try { pretty = JSON.stringify(JSON.parse(doc.content), null, 2); } catch (e) {}
                return `<div class="nb-text-view">${escapeHTMLLocal(pretty)}</div>`;
            }
            return `<div class="nb-text-view">${escapeHTMLLocal(doc.content || "Sem conteúdo.")}</div>`;
        }

        function handleHeaderClick(e, id) {
            if (e.target.closest(".nb-win-controls")) return;
            if (!clickTimers[id]) {
                clickTimers[id] = setTimeout(() => {
                    delete clickTimers[id]; const entry = openWindows.get(id);
                    if (entry && entry.el.classList.contains("maximized")) { bringToFront(entry.el); return; }
                    togglePeek(id);
                }, 250);
            } else {
                clearTimeout(clickTimers[id]); delete clickTimers[id]; toggleMaximize(id);
            }
        }

        function togglePeek(id) {
            const entry = openWindows.get(id); if (!entry) return; const win = entry.el;
            if (win.classList.contains("peeked")) {
                win.classList.remove("peeked"); win.style.top = "0"; win.style.left = "0"; win.style.width = "100%"; win.style.height = "100%";
            } else {
                win.classList.add("peeked"); win.classList.remove("collapsed");
                win.style.width = "min(420px, calc(100% - 0px))"; win.style.height = "min(46vh, 178px)"; win.style.top = "0px"; win.style.left = "0px";
            }
            bringToFront(win);
        }

        function toggleCollapse(id) { const entry = openWindows.get(id); if (!entry) return; const win=entry.el; if(win.classList.contains("maximized")){ toggleMaximize(id); return; } win.classList.toggle("collapsed"); win.classList.remove("peeked"); bringToFront(win); }

        function toggleMaximize(id) {
            const entry = openWindows.get(id); if (!entry) return; const win = entry.el;
            if (win.classList.contains("maximized")) {
                win.classList.remove("maximized", "collapsed", "peeked", "minimized");
                if (entry.restoreState) {
                    win.style.top = entry.restoreState.top; win.style.left = entry.restoreState.left;
                    win.style.width = entry.restoreState.width; win.style.height = entry.restoreState.height;
                }
                win.querySelector('[data-act="maximize"]').textContent = "⬜"; bringToFront(win); return;
            }
            const rect = win.getBoundingClientRect();
            entry.restoreState = { top: `${rect.top}px`, left: `${rect.left}px`, width: `${rect.width}px`, height: `${rect.height}px` };
            win.classList.remove("collapsed", "peeked", "minimized"); win.classList.add("maximized");
            win.style.top = "0"; win.style.left = "0"; win.style.width = "100vw"; win.style.height = "100vh";
            win.querySelector('[data-act="maximize"]').textContent = "❐"; bringToFront(win);
        }

        function minimizeWindow(id) {
            const entry = openWindows.get(id); if (!entry) return; const win=entry.el;
            if (win.classList.contains("maximized")) toggleMaximize(id);
            win.classList.add("minimized");
            const { dock } = ensureShell(); let bubble = document.getElementById(`nb-dock-${id}`);
            if (!bubble) {
                bubble = document.createElement("div"); bubble.className = "nb-dock-bubble"; bubble.id = `nb-dock-${id}`; bubble.title = entry.docRef.name || "Documento";
                bubble.textContent = { pdf: "📕", html: "🌐", markdown: "📝", json: "📋", txt: "📄" }[entry.docRef.type] || "📄";
                bubble.addEventListener("click", () => { entry.el.classList.remove("minimized"); bubble.remove(); bringToFront(entry.el); }); dock.appendChild(bubble);
            }
        }

        function closeWindow(id) {
            const entry = openWindows.get(id); if (!entry) return;
            const bubble = document.getElementById(`nb-dock-${id}`); if (bubble) bubble.remove(); entry.el.remove(); openWindows.delete(id);
        }

        function open(doc) {
            if (!doc || !doc.id) return; const { stack } = ensureShell();
            if (openWindows.has(doc.id)) {
                const entry = openWindows.get(doc.id); const win = entry.el; win.classList.remove("minimized");
                if (!win.classList.contains("maximized")) { win.classList.add("peeked"); win.classList.remove("collapsed"); }
                const bubble = document.getElementById(`nb-dock-${doc.id}`); if (bubble) bubble.remove(); bringToFront(win); return;
            }

            const win = document.createElement("div"); win.className = "nb-session-window peeked"; win.id = `nb-win-${doc.id}`;
            const icon = { pdf: "📕", html: "🌐", markdown: "📝", json: "📋", txt: "📄" }[doc.type] || "📄";

            win.innerHTML = `
                <div class="nb-win-hdr"><div class="nb-win-title">${icon} ${escapeHTMLLocal(doc.name || "Documento")}</div>
                    <div class="nb-win-controls"><button data-act="collapse">—</button><button data-act="maximize">⬜</button><button data-act="minimize">🔘</button><button data-act="close">✕</button></div>
                </div><div class="nb-win-body">${renderBody(doc)}</div>`;

            win.querySelector('[data-act="collapse"]').addEventListener("click", e => { e.stopPropagation(); toggleCollapse(doc.id); });
            win.querySelector('[data-act="maximize"]').addEventListener("click", e => { e.stopPropagation(); toggleMaximize(doc.id); });
            win.querySelector('[data-act="minimize"]').addEventListener("click", e => { e.stopPropagation(); minimizeWindow(doc.id); });
            win.querySelector('[data-act="close"]').addEventListener("click", e => { e.stopPropagation(); closeWindow(doc.id); });
            win.querySelector(".nb-win-hdr").addEventListener("click", e => handleHeaderClick(e, doc.id));
            win.addEventListener("pointerdown", () => bringToFront(win));

            const offset = (openWindows.size % 6) * 18; win.style.top = `calc(80px + ${offset}px)`; win.style.left = `calc(12px + ${offset}px)`;
            stack.appendChild(win);
            openWindows.set(doc.id, { el: win, docRef: doc, restoreState: null });
            if (doc.type === "slice" && window.NebulaSliceEngine?.mount) requestAnimationFrame(() => window.NebulaSliceEngine.mount(win.querySelector("[data-slice-host]"), doc));
            bringToFront(win);
        }

        window.NebulaSW = { open, close: closeWindow, closeAll: () => Array.from(openWindows.keys()).forEach(closeWindow) };
    })();

    // ═══════════════════════════════════════════════════════════════════
    // KBLX: NEBULA PRO — MOTOR UNIFICADO 
    // ═══════════════════════════════════════════════════════════════════
    const DB_NAME = "NebulaStorage"; const DB_VERSION = 1; const STORE_NAME = "files";
    const UI_STATE_KEY = "nebula-pro-ui-state";
    const SYSTEM_PREFIXES = ["nebula-", "di_", "kobllux-", "kdev-", "lsdevos-", "baulite-", "hero-", "fav:"];
    const RESERVED_KEYS = new Set([UI_STATE_KEY, "nebula-theme", "nebula-doc-keys", "nebula-hidden-keys", "nebula-pinned-keys", "di_userName", "di_assistantName", "baulite-disabled"]);
    const TYPE_LABELS = { html: "HTML", markdown: "MARKDOWN", pdf: "PDF", txt: "TXT", json: "JSON" };

    let db; let library = []; let currentDocs = [];
    let NEBULA_UI_STATE = JSON.parse(localStorage.getItem(UI_STATE_KEY)) || { heroMinimized: false, heroIndex: 0, activeGroup: "recentes", collapsedGroups: [], autoplay: false };
    let autoplayTimer = null;

    function saveUIState() { localStorage.setItem(UI_STATE_KEY, JSON.stringify(NEBULA_UI_STATE)); }

    function groupOf(doc) {
        if (doc.source === "localStorage" && !doc.looksLikeDoc) return "cache";
        if (doc.type === "html") return "apps"; if (doc.type === "json") return "config";
        if (["markdown", "txt", "pdf"].includes(doc.type)) return "documentos"; return "cache";
    }

    function initDB() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(DB_NAME, DB_VERSION);
            request.onupgradeneeded = e => { db = e.target.result; if (!db.objectStoreNames.contains(STORE_NAME)) db.createObjectStore(STORE_NAME, { keyPath: "id" }); };
            request.onsuccess = e => { db = e.target.result; resolve(db); }; request.onerror = e => reject(e.target.error);
        });
    }

    async function saveFileToDB(item) {
        return new Promise((resolve, reject) => {
            const tx = db.transaction(STORE_NAME, "readwrite"); const safeItem = { ...item }; delete safeItem.url;
            tx.objectStore(STORE_NAME).put(safeItem); tx.oncomplete = () => resolve(); tx.onerror = err => reject(err);
        });
    }

    async function deleteFileFromDB(id) { return new Promise((resolve, reject) => { const tx = db.transaction(STORE_NAME, "readwrite"); tx.objectStore(STORE_NAME).delete(id); tx.oncomplete = () => resolve(); tx.onerror = err => reject(err); }); }

    async function loadFilesFromDB() {
        return new Promise((resolve, reject) => {
            const tx = db.transaction(STORE_NAME, "readonly"); const request = tx.objectStore(STORE_NAME).getAll();
            request.onsuccess = e => {
                const items = e.target.result;
                items.forEach(item => { if ((item.type === "pdf" || item.type === "html") && item.fileBlob) item.url = URL.createObjectURL(item.fileBlob); }); resolve(items);
            }; request.onerror = err => reject(err);
        });
    }

    function escapeHTML(text) { return String(text ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;"); }
    function formatSize(bytes) { if (!bytes) return ""; const units = ["B", "KB", "MB", "GB"]; let i = 0, size = bytes; while (size >= 1024 && i < units.length - 1) { size /= 1024; i++; } return size.toFixed(size >= 10 ? 0 : 1) + " " + units[i]; }
    /* ============================================================
       KOBLLUX · NEBULA MD RENDER CORE (v1)
       Fonte única de verdade para Markdown em toda a Nebula Library:
       Hero preview, Reader e Al Slicer chamam esta mesma engine.
       ============================================================ */
    (function(){
      'use strict';
      if (window.NebulaMD) return; // idempotente

      function inlineMD(value){
        let s = escapeHTML(value);
        s = s.replace(/!\[([^\]]*)\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g, (_,alt,src)=>`<img class="md-img" alt="${escapeHTML(alt)}" src="${src}">`);
        s = s.replace(/\[\[btn:([a-z0-9_-]+)(?:\|([^\]]+))?\]\]/gi, (_,action,label)=>`<button class="btn action" data-action="${action}">${escapeHTML(label||action)}</button>`);
        s = s.replace(/\[([^\]]+)\]\(action:([a-z0-9_-]+)\)/gi, (_,label,action)=>`<button class="btn action" data-action="${action}">${escapeHTML(label)}</button>`);
        s = s.replace(/\[\[([^\]]+)\]\]/g, (_,k)=>`<span class="kbd">${k}</span>`);
        s = s.replace(/`([^`]+)`/g, (_,c)=>`<code class="code-inline">${c}</code>`);
        s = s.replace(/\[([^\]]+)\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g, (_,label,href)=>`<a href="${href}" target="_blank" rel="noopener noreferrer">${label}</a>`);
        s = s.replace(/\*\*([^*]+)\*\*|__([^_]+)__/g, (_,a,b)=>`<strong>${a||b}</strong>`);
        s = s.replace(/(?<!\*)\*(?!\*)([^*\n]+?)\*(?!\*)|(?<!_)_(?!_)([^_\n]+?)_(?!_)/g, (_,a,b)=>`<em>${a||b}</em>`);
        s = s.replace(/~~([^~]+)~~/g, (_,t)=>`<del>${t}</del>`);
        s = s.replace(/(^|[\s(])(https?:\/\/[^\s<)]+)/g, (_,pre,url)=>`${pre}<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`);
        s = s.replace(/ {2,}\n|\\\n/g, '<br>');
        return s;
      }

      function parseTable(lines){
        const rows = lines.map(l=>l.trim().replace(/^\|/,'').replace(/\|$/,'').split('|').map(c=>c.trim()));
        if (!rows.length) return '';
        const isSep = r => r.every(c=>/^:?-{2,}:?$/.test(c));
        const sepIdx = (rows.length>1 && isSep(rows[1])) ? 1 : -1;
        const header = rows[0];
        const aligns = sepIdx===1 ? rows[1].map(c=>{const l=c.startsWith(':'),r=c.endsWith(':');return l&&r?'center':r?'right':l?'left':'';}) : [];
        const body = sepIdx===1 ? rows.slice(2) : rows.slice(1);
        const colCount = Math.max(header.length, ...body.map(r=>r.length), 1);
        let out = '<div class="md-table-wrap"><table class="md-table"><thead><tr>';
        for (let i=0;i<colCount;i++) out += `<th${aligns[i]?` data-align="${aligns[i]}"`:''}>${inlineMD(header[i]||'')}</th>`;
        out += '</tr></thead><tbody>';
        body.forEach(row=>{ out+='<tr>'; for(let i=0;i<colCount;i++) out+=`<td${aligns[i]?` data-align="${aligns[i]}"`:''}>${inlineMD(row[i]||'')}</td>`; out+='</tr>'; });
        out += '</tbody></table></div>';
        return out;
      }

      function renderMarkdown(source){
        const lines = String(source ?? '').replace(/\r\n?/g,'\n').split('\n');
        const out = []; let i = 0, paragraph = [];
        const flush = ()=>{ if(!paragraph.length) return; const v=paragraph.join(' ').trim(); if(v) out.push(`<p>${inlineMD(v)}</p>`); paragraph=[]; };

        while (i < lines.length){
          const line = lines[i], trimmed = line.trim();

          if (!trimmed){ flush(); i++; continue; }

          const fence = line.match(/^\s*(?:```|''')([\w-]*)\s*$/);
          if (fence){
            flush(); const lang=(fence[1]||'').toLowerCase(); i++; const code=[];
            while (i<lines.length && !/^\s*(?:```|''')\s*$/.test(lines[i])){ code.push(lines[i]); i++; }
            if (i<lines.length) i++;
            out.push(`<pre class="md-code"><span class="copy-hint">Copiar</span><code${lang?` class="lang-${lang}"`:''}>${escapeHTML(code.join('\n'))}</code></pre>`);
            continue;
          }

          const heading = line.match(/^\s{0,3}(#{1,6})\s+(.+?)\s*#*\s*$/);
          if (heading){ flush(); const lvl=heading[1].length; out.push(`<h${lvl}>${inlineMD(heading[2])}</h${lvl}>`); i++; continue; }

          if (/^\s*(?:---+|\*\*\*+|___+)\s*$/.test(line)){ flush(); out.push('<hr class="hr">'); i++; continue; }

          if (/^\s*\|.*\|\s*$/.test(line)){
            flush(); const tlines=[];
            while (i<lines.length && /^\s*\|.*\|\s*$/.test(lines[i])){ tlines.push(lines[i]); i++; }
            out.push(parseTable(tlines)); continue;
          }

          if (/^\s*>+/.test(line)){
            flush(); const items=[];
            while (i<lines.length && /^\s*>+/.test(lines[i])){ const m=lines[i].match(/^\s*(>+)\s?(.*)$/); items.push({level:m[1].length,text:m[2]}); i++; }
            let html='', cur=0;
            for (const it of items){
              while (it.level>cur){ cur++; html+=`<blockquote class="bq${cur>1?` bq-l${Math.min(cur,3)}`:''}">`; }
              while (it.level<cur){ html+='</blockquote>'; cur--; }
              html += `<div class="bq-line">${inlineMD(it.text)}</div>`;
            }
            while (cur>0){ html+='</blockquote>'; cur--; }
            out.push(html); continue;
          }

          const callout = line.match(/^\s*(::(?:info|warn|tip|note|meta|ritual|success|danger|aside|question)|::\.|:|\?)\s+(.*)$/i);
          if (callout){
            flush(); let marker=(callout[1]||'').toLowerCase(), kind;
            if (marker==='::.') kind='aside'; else if (marker===':') kind='note'; else if (marker==='?') kind='question';
            else kind = marker.startsWith('::') ? marker.slice(2) : (marker||'note');
            const content=[callout[2]]; i++;
            while (i<lines.length && lines[i].trim() && !/^\s*(::(?:info|warn|tip|note|meta|ritual|success|danger|aside|question)|::\.|:|\?)\s+/i.test(lines[i])){ content.push(lines[i].trim()); i++; }
            out.push(`<div class="callout ${kind}"><span class="copy-hint">Copiar</span>${inlineMD(content.join(' '))}</div>`);
            continue;
          }

          const task0 = line.match(/^\s*[-*+]\s+\[( |x|X)\]\s+(.*)$/);
          if (task0){
            const items=[];
            while (i<lines.length){ const m=lines[i].match(/^\s*[-*+]\s+\[( |x|X)\]\s+(.*)$/); if(!m) break; items.push(m); i++; }
            out.push(`<ul class="md-list md-task">${items.map(m=>`<li class="md-li"><input type="checkbox" disabled ${/x/i.test(m[1])?'checked':''}><span>${inlineMD(m[2])}</span></li>`).join('')}</ul>`);
            continue;
          }

          if (/^\s*[-*+]\s+/.test(line)){
            const items=[];
            while (i<lines.length && /^\s*[-*+]\s+/.test(lines[i]) && !/^\s*[-*+]\s+\[( |x|X)\]/.test(lines[i])){ items.push(lines[i].replace(/^\s*[-*+]\s+/,'')); i++; }
            out.push(`<ul class="md-list">${items.map(t=>`<li class="md-li">${inlineMD(t)}</li>`).join('')}</ul>`);
            continue;
          }

          if (/^\s*\d+[.)]\s+/.test(line)){
            const items=[];
            while (i<lines.length && /^\s*\d+[.)]\s+/.test(lines[i])){ items.push(lines[i].replace(/^\s*\d+[.)]\s+/,'')); i++; }
            out.push(`<ol class="md-list">${items.map(t=>`<li class="md-li">${inlineMD(t)}</li>`).join('')}</ol>`);
            continue;
          }

          const imgLn = line.match(/^\s*!\[([^\]]*)\]\(([^)\s]+)(?:\s+"[^"]*")?\)\s*$/);
          if (imgLn){ flush(); out.push(`<img class="md-img" src="${imgLn[2]}" alt="${escapeHTML(imgLn[1])}">`); i++; continue; }

          paragraph.push(trimmed); i++;
        }
        flush();
        return out.join('');
      }

      const API = {
        version: '1.0.0',
        escapeHTML, inlineMD, parseTable,
        render: renderMarkdown,
        renderInto(target, source){
          const el = typeof target === 'string' ? document.querySelector(target) : target;
          if (!el) return null;
          el.classList.add('nebula-md');
          el.innerHTML = renderMarkdown(source);
          return el;
        }
      };
      window.NebulaMD = API;
      console.info('[NebulaMD] Render Core ativo', API.version);
    })();

    /* Compat: qualquer chamada antiga a markdownToHTML(...) passa a usar a engine única. */
    function markdownToHTML(md) { return window.NebulaMD.render(md); }
    function extractTextFromHTML(htmlString) { const tempDiv = document.createElement("div"); tempDiv.innerHTML = htmlString; return tempDiv.textContent || tempDiv.innerText || ""; }
    
    function detectType(name = "", mime = "", content = "") {
        const ext = String(name).split(".").pop().toLowerCase(); const c = String(content || "");
        if (mime.includes("pdf") || ext === "pdf") return "pdf";
        if (mime.includes("html") || ["html", "htm"].includes(ext) || /<!doctype html>|<html/i.test(c)) return "html";
        if (["md", "markdown"].includes(ext) || /^#{1,6}\s/m.test(c) || /\[[^\]]+\]\([^)]+\)/.test(c)) return "markdown";
        if (ext === "json" || (/^[\{\[][\s\S]*[\}\]]$/.test(c.trim()) && c.trim().length > 1)) return "json"; return "txt";
    }
    
    function previewText(content, limit = 170) { const flat = String(content || "").replace(/\s+/g, " ").trim(); return !flat ? "Sem prévia disponível." : flat.length > limit ? flat.slice(0, limit) + "…" : flat; }
    function previewFromHTML(content) { const txt = String(content || "").replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<style[\s\S]*?<\/style>/gi, " ").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim(); return txt ? txt.slice(0, 240) : "HTML sem texto legível."; }

    function scanLocalStorageDocs() {
        const docs = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i); if (RESERVED_KEYS.has(key) || SYSTEM_PREFIXES.some(prefix => String(key).startsWith(prefix))) continue;
            const val = localStorage.getItem(key) || ""; let parsed = null; try { parsed = JSON.parse(val); } catch (e) {}
            const looksLikeDoc = /doc|note|text|article|draft|html|md|markdown|txt|pdf|summary|prompt/i.test(key);
            const type = detectType(key, "", val); let content = val;
            if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) content = Object.entries(parsed).map(([k, v]) => `${k}: ${typeof v === "string" ? v : JSON.stringify(v)}`).join("\n");
            if (!val) continue; docs.push({ id: `ls-${key}`, name: key, type, size: formatSize(new Blob([val]).size), content, url: "", favorite: false, cortexSaved: false, source: "localStorage", rawKey: key, looksLikeDoc, updatedAt: 0 });
        } return docs;
    }

    async function collectDocuments() {
        const dbDocs = library.map((item, idx) => ({ ...item, source: "indexeddb", updatedAt: item.updatedAt || (Date.now() - idx) }));
        const storageDocs = scanLocalStorageDocs(); const merged = [...dbDocs, ...storageDocs]; const seen = new Set();
        return merged.filter(doc => { const sig = `${doc.name}::${doc.type}::${String(doc.content || "").slice(0, 120)}`; if (seen.has(sig)) return false; seen.add(sig); return true; });
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

    let _voicesCache = []; let _speakingBtn = null;
    function loadVoices() {
        return new Promise(resolve => {
            let voices = window.speechSynthesis.getVoices(); if (voices.length) { _voicesCache = voices; resolve(voices); return; }
            const onVoices = () => { voices = window.speechSynthesis.getVoices(); if (voices.length) { _voicesCache = voices; window.speechSynthesis.removeEventListener("voiceschanged", onVoices); resolve(voices); } };
            window.speechSynthesis.addEventListener("voiceschanged", onVoices); setTimeout(() => { if (!_voicesCache.length) onVoices(); }, 500);
        });
    }
    
    function cleanTextForSpeech(doc) {
        if (doc.type === "html") return previewFromHTML(doc.content) || extractTextFromHTML(doc.content);
        if (doc.type === "json") { try { const parsed = JSON.parse(doc.content); if (parsed) return JSON.stringify(parsed, null, 0).replace(/[{}\[\]"]/g, " "); } catch(e){} return doc.content || ""; }
        if (doc.type === "markdown") return String(doc.content || "").replace(/[#*`_>\-]/g, ""); return doc.content || "";
    }

    async function speakDocument(doc, btn) {
        const synth = window.speechSynthesis; if (!synth) { alert("Navegador sem suporte a leitura em voz alta."); return; }
        if (synth.speaking && _speakingBtn === btn) { synth.cancel(); if (btn) btn.classList.remove("speaking"); _speakingBtn = null; return; }
        if (synth.speaking) synth.cancel();
        const text = cleanTextForSpeech(doc).trim(); if (!text) { alert("Sem texto legível para leitura."); return; }
        const voices = await loadVoices(); const ptVoice = voices.find(v => v.lang && v.lang.toLowerCase().startsWith("pt-br")) || voices.find(v => v.lang && v.lang.toLowerCase().startsWith("pt"));
        const chunks = []; for (let i = 0; i < text.length; i += 1600) chunks.push(text.slice(i, i + 1600));
        
        if (btn) { btn.classList.add("speaking"); _speakingBtn = btn; } let idx = 0;
        function speakNext() {
            if (idx >= chunks.length) { if (btn) btn.classList.remove("speaking"); _speakingBtn = null; return; }
            const utt = new SpeechSynthesisUtterance(chunks[idx]); utt.lang = "pt-BR"; if (ptVoice) utt.voice = ptVoice;
            utt.onend = () => { idx++; speakNext(); }; utt.onerror = () => { if (btn) btn.classList.remove("speaking"); _speakingBtn = null; }; synth.speak(utt);
        }
        speakNext();
    }

    function createPreview(item) {
        const type = item.type;
        if (type === "pdf" || (type === "html" && item.url)) { return `<div class="file-preview" onclick="activatePreview(event, this, '${item.id}', '${type}', '${item.url}')"><span class="type-badge">${type.toUpperCase()}</span><div class="preview-placeholder"><span>📄</span><p style="font-size:11px;font-weight:600;">Toque para carregar preview</p></div></div>`; }
        if (type === "markdown") return `<div class="file-preview"><span class="type-badge">MD</span><div class="preview-markdown nebula-md">${item.content ? window.NebulaMD.render(item.content) : "<p>Markdown</p>"}</div></div>`;
        if (type === "json") return `<div class="file-preview"><span class="type-badge">JSON</span><div class="preview-text"><pre style="white-space:pre-wrap;margin:0;font-size:11px;">${escapeHTML(previewText(item.content, 260))}</pre></div></div>`;
        if (type === "html") return `<div class="file-preview"><span class="type-badge">HTML</span><div class="preview-text">${escapeHTML(previewFromHTML(item.content))}</div></div>`;
        return `<div class="file-preview"><span class="type-badge">TXT</span><div class="preview-text">${escapeHTML(previewText(item.content || "Documento de texto", 260))}</div></div>`;
    }

    window.activatePreview = function (e, container, id, type, url) {
        if (container.querySelector("iframe")) return; if (!url) return;
        container.innerHTML = `<span class="type-badge">${type.toUpperCase()}</span><button class="close-preview-btn" onclick="deactivatePreview(event, this)" title="Ocultar preview">✕</button><iframe src="${url}" sandbox="allow-scripts allow-same-origin allow-popups allow-forms" style="width:100%;height:100%;border:0;background:#fff;"></iframe>`;
    };
    window.deactivatePreview = function (e, btn) {
        e.stopPropagation(); const container = btn.closest(".file-preview"); const type = container.querySelector(".type-badge").textContent.toLowerCase();
        container.innerHTML = `<span class="type-badge">${type.toUpperCase()}</span><div class="preview-placeholder"><span>📄</span><p style="font-size:11px;font-weight:600;">Toque para carregar preview</p></div>`;
    };

    const reader = document.getElementById("reader");
    const readerTitle = document.getElementById("reader-title");
    const readerBody = document.getElementById("reader-body");
    
    function openReader(item) {
        if (window.NebulaSW && typeof window.NebulaSW.open === 'function') { window.NebulaSW.open(item); return; }
        readerTitle.textContent = item.name; readerBody.innerHTML = "";
        if ((item.type === "pdf" || item.type === "html") && item.url) { const iframe = document.createElement("iframe"); iframe.src = item.url; if (item.type === "html") iframe.setAttribute("sandbox", "allow-scripts allow-same-origin allow-popups allow-forms"); readerBody.appendChild(iframe); } 
        else if (item.type === "markdown") { const article = document.createElement("article"); article.className = "reader-markdown nebula-md"; window.NebulaMD.renderInto(article, item.content); readerBody.appendChild(article); } 
        else if (item.type === "json") { const pre = document.createElement("pre"); pre.className = "reader-text"; let parsed = null; try{ parsed = JSON.parse(item.content); }catch(e){} pre.textContent = parsed ? JSON.stringify(parsed, null, 2) : item.content; readerBody.appendChild(pre); } 
        else { const pre = document.createElement("pre"); pre.className = "reader-text"; pre.textContent = item.type === "html" ? extractTextFromHTML(item.content) : item.content; readerBody.appendChild(pre); }
        reader.classList.add("opened"); document.body.style.overflow = "hidden";
    }
    function closeReader() { reader.classList.remove("opened"); readerBody.innerHTML = ""; document.body.style.overflow = ""; }
    document.getElementById("reader-close").addEventListener("click", closeReader);
    reader.addEventListener("click", (e) => { if (e.target === reader) closeReader(); });

    async function removeDocument(doc) {
        if (!confirm(`Tem certeza que deseja apagar "${doc.name}"?`)) return;
        try { if (doc.source === "localStorage") { localStorage.removeItem(doc.rawKey || doc.name); } else { await deleteFileFromDB(doc.id); library = library.filter(item => item.id !== doc.id); } refreshAll(); } catch (err) {}
    }

    const heroCarousel = document.getElementById("hero-carousel"); const heroDots = document.getElementById("hero-dots");
    function renderHero() {
        if (!heroCarousel) return; heroCarousel.innerHTML = ""; heroDots.innerHTML = ""; const items = getFilteredHeroItems();
        document.getElementById("hero-title-label").textContent = `Inteligência · ${NEBULA_UI_STATE.activeGroup.toUpperCase()}`;
        if (!items.length) { heroCarousel.innerHTML = `<div class="hero-card" style="width: 100%;"><div style="padding: 30px; text-align: center;"><h2 style="font-size: 20px; margin-bottom: 8px;">Nenhum item em "${NEBULA_UI_STATE.activeGroup}"</h2><p style="color: var(--muted); font-size: 12px;">Adicione arquivos ou explore novos conteúdos.</p></div></div>`; return; }
        if (NEBULA_UI_STATE.heroIndex >= items.length) NEBULA_UI_STATE.heroIndex = 0;
        items.forEach((item, index) => {
            const card = document.createElement("article"); card.className = "hero-card"; card.style.flex = "0 0 100%";
            card.innerHTML = `<div class="hero-card-preview">${createPreview(item)}</div><div class="hero-card-info"><div><h4>${escapeHTML(item.name)}</h4><p>${(TYPE_LABELS[item.type] || item.type).toUpperCase()} · ${item.size || "arquivo"} · ${item.source === "localStorage" ? "cache" : "db"}</p></div><div class="card-actions"><button class="btn-icon hero-listen" title="Ouvir">🔊</button><button class="btn-icon danger hero-delete" title="Apagar">🗑️</button><button class="open hero-open">→</button></div></div>`;
            card.querySelector(".hero-open").addEventListener("click", e => { e.stopPropagation(); openReader(item); });
            card.querySelector(".hero-listen").addEventListener("click", e => { e.stopPropagation(); speakDocument(item, e.currentTarget); });
            card.querySelector(".hero-delete").addEventListener("click", e => { e.stopPropagation(); removeDocument(item); });
            heroCarousel.appendChild(card);
            const dot = document.createElement("button"); dot.className = index === NEBULA_UI_STATE.heroIndex ? "active" : "";
            dot.addEventListener("click", e => { e.stopPropagation(); NEBULA_UI_STATE.heroIndex = index; saveUIState(); scrollToHeroSlide(index); }); heroDots.appendChild(dot);
        }); setTimeout(() => scrollToHeroSlide(NEBULA_UI_STATE.heroIndex, false), 50);
    }
    function scrollToHeroSlide(index, smooth = true) {
        const cards = heroCarousel.querySelectorAll(".hero-card");
        if (cards[index]) { cards[index].scrollIntoView({ behavior: smooth ? "smooth" : "auto", inline: "center", block: "nearest" }); heroDots.querySelectorAll("button").forEach((d, i) => d.classList.toggle("active", i === index)); }
    }

    function makeStableScrollHandler(scrollEl, cardSelector, dotsEl, dotSelector, onSettle) {
        let settleTimer = null; return () => { clearTimeout(settleTimer); settleTimer = setTimeout(() => {
            const cards = scrollEl.querySelectorAll(cardSelector); if (!cards.length) return; const center = scrollEl.scrollLeft + scrollEl.offsetWidth / 2; let closest = 0, dist = Infinity;
            cards.forEach((c, idx) => { const cCenter = c.offsetLeft + c.offsetWidth / 2; const d = Math.abs(center - cCenter); if (d < dist) { dist = d; closest = idx; } });
            dotsEl.querySelectorAll(dotSelector).forEach((d, i) => d.classList.toggle("active", i === closest)); onSettle(closest);
        }, 90); };
    }

    heroCarousel.addEventListener("scroll", makeStableScrollHandler(heroCarousel, ".hero-card", heroDots, "button", (closest) => { NEBULA_UI_STATE.heroIndex = closest; saveUIState(); }));

    function setupAutoplay() {
        clearInterval(autoplayTimer); if (!NEBULA_UI_STATE.autoplay) return;
        autoplayTimer = setInterval(() => {
            const items = getFilteredHeroItems(); if (items.length <= 1) return;
            NEBULA_UI_STATE.heroIndex = (NEBULA_UI_STATE.heroIndex + 1) % items.length; saveUIState(); scrollToHeroSlide(NEBULA_UI_STATE.heroIndex);
        }, 5500);
    }

    const carousel = document.getElementById("recentes"); const dotsCarousel = document.getElementById("dots");
    function renderLibrary(filter = "") {
        carousel.innerHTML = ""; const normalized = filter.toLowerCase().trim(); const items = currentDocs.filter(item => item.name.toLowerCase().includes(normalized));
        if (!items.length) { carousel.innerHTML = `<div class="empty">Nenhum documento encontrado.</div>`; dotsCarousel.innerHTML = ""; return; }
        items.forEach((item) => {
            const card = document.createElement("article"); card.className = "slide";
            card.innerHTML = `${createPreview(item)}<div class="card-info"><div class="card-info-text"><h4>${escapeHTML(item.name)}</h4><p>${(TYPE_LABELS[item.type] || item.type).toUpperCase()} · ${item.size || "arquivo"} · ${item.source === "localStorage" ? "cache" : "db"}</p></div><div class="card-actions"><button class="btn-icon listen-btn" title="Ouvir Documento">🔊</button><button class="btn-icon danger delete-btn" title="Apagar Documento">🗑️</button><button class="open">→</button></div></div>`;
            card.querySelector(".listen-btn").addEventListener("click", e => { e.stopPropagation(); speakDocument(item, e.currentTarget); });
            card.querySelector(".delete-btn").addEventListener("click", e => { e.stopPropagation(); removeDocument(item); });
            card.querySelector(".open").addEventListener("click", e => { e.stopPropagation(); openReader(item); }); carousel.appendChild(card);
        });
        dotsCarousel.innerHTML = ""; carousel.querySelectorAll(".slide").forEach((slide, index) => { const dot = document.createElement("button"); if (index === 0) dot.classList.add("active"); dotsCarousel.appendChild(dot); });
    }
    carousel.addEventListener("scroll", makeStableScrollHandler(carousel, ".slide", dotsCarousel, "button", () => {}));

    const fileInput = document.getElementById("file-input");
    async function addFile(file) {
        const type = detectType(file.name, file.type, ""); let item = { id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(), name: file.name, type, size: formatSize(file.size), content: "", url: "", favorite: false, cortexSaved: false, updatedAt: Date.now() };
        if (type === "pdf" || type === "html") { item.fileBlob = file; item.url = URL.createObjectURL(file); if (type === "html") item.content = await file.text(); } else { item.content = await file.text(); item.type = detectType(file.name, file.type, item.content); }
        library.unshift(item); try { await saveFileToDB(item); } catch (err) {}
    }
    function refreshAll() {
      collectDocuments().then(docs => {
        currentDocs = docs;
        const searchInput = document.getElementById("search-input");
        renderLibrary(searchInput && searchInput.value ? searchInput.value : "");
        renderHero();
        if (typeof renderExplorer === "function") renderExplorer(NEBULA_UI_STATE.exploreCategory || "todos");
        if (typeof renderMiniApps === "function") renderMiniApps();
        saveUIState();
      });
    }

    document.getElementById("add-file").addEventListener("click", () => fileInput.click());
    fileInput.addEventListener("change", async event => { const files = Array.from(event.target.files); for (const file of files) await addFile(file); fileInput.value = ""; refreshAll(); document.dispatchEvent(new Event("fileAdded")); });

    const searchBtn = document.getElementById("search-file"); const searchBox = document.getElementById("search-box"); const searchInput = document.getElementById("search-input");
    searchBtn.addEventListener("click", () => { searchBox.classList.toggle("visible"); if (searchBox.classList.contains("visible")) searchInput.focus(); });
    searchInput.addEventListener("input", event => renderLibrary(event.target.value));

    document.getElementById("open-url").addEventListener("click", async () => {
        const url = prompt("Cole a URL do arquivo ou site externo:"); if (!url) return;
        const clean = url.split("?")[0].toLowerCase(); let type = clean.endsWith(".pdf") ? "pdf" : "html";
        let item = { id: Date.now().toString(), name: url.split("/").pop() || "Documento Web", type, url, content: "", size: "Link", favorite: false, cortexSaved: false, updatedAt: Date.now() };
        library.unshift(item); await saveFileToDB(item); refreshAll();
    });

    const heroSection = document.getElementById("hero-section"); const toggleHeroBtn = document.getElementById("toggle-hero");
    if (NEBULA_UI_STATE.heroMinimized) { heroSection.classList.add("minimized"); toggleHeroBtn.style.transform = "rotate(-90deg)"; }
    toggleHeroBtn.addEventListener("click", e => { e.stopPropagation(); NEBULA_UI_STATE.heroMinimized = !heroSection.classList.contains("minimized"); heroSection.classList.toggle("minimized", NEBULA_UI_STATE.heroMinimized); toggleHeroBtn.style.transform = NEBULA_UI_STATE.heroMinimized ? "rotate(-90deg)" : "rotate(0deg)"; saveUIState(); });

    const toggleAutoplayBtn = document.getElementById("toggle-autoplay");
    toggleAutoplayBtn.addEventListener("click", e => { e.stopPropagation(); NEBULA_UI_STATE.autoplay = !NEBULA_UI_STATE.autoplay; toggleAutoplayBtn.textContent = NEBULA_UI_STATE.autoplay ? "⏸" : "▶"; saveUIState(); setupAutoplay(); });
    toggleAutoplayBtn.textContent = NEBULA_UI_STATE.autoplay ? "⏸" : "▶";

    document.getElementById("hero-groups").querySelectorAll(".group-pill").forEach(pill => {
        if (pill.getAttribute("data-group") === NEBULA_UI_STATE.activeGroup) { document.getElementById("hero-groups").querySelectorAll(".group-pill").forEach(p => p.classList.remove("active")); pill.classList.add("active"); }
        pill.addEventListener("click", e => { e.stopPropagation(); document.getElementById("hero-groups").querySelectorAll(".group-pill").forEach(p => p.classList.remove("active")); e.target.classList.add("active"); NEBULA_UI_STATE.activeGroup = e.target.getAttribute("data-group"); NEBULA_UI_STATE.heroIndex = 0; saveUIState(); renderHero(); });
    });

    window.addEventListener("DOMContentLoaded", async () => {
        try { await initDB(); const savedItems = await loadFilesFromDB(); if (savedItems && savedItems.length > 0) library = savedItems; else { library = [{ id: "demo-md", name: "Arquitetura Nebula Pro.md", type: "markdown", content: "# NEBULA PRO\n## Recent Intelligence Hero\nO Hero exibe os arquivos recentes.\n**Cortex** fornece os dados.\nA experiência é unificada.", size: "Markdown", favorite: true, cortexSaved: true, updatedAt: Date.now() }]; } refreshAll(); setupAutoplay(); loadVoices(); } catch (err) { console.error("[KBLX.DB] Erro na inicialização:", err); }
    });
    window.addEventListener("storage", () => refreshAll());


    /* =========================================================
       NEBULA UNIFIED CORE · EXPLORER + MINI APPS + SLICER
       Edite os mini apps aqui: NEBULA_APP_REGISTRY
    ========================================================= */
    (function(){
      "use strict";
      const ICONS={pdf:"📕",markdown:"📝",json:"📋",txt:"📄",html:"🌐",slice:"✦"};
      const MAP={
        todos:{title:"Tudo",icon:"◉",filter:()=>true},
        ia:{title:"Inteligência",icon:"◎",filter:x=>x.cortexSaved||x.type==='json'},
        leitura:{title:"Leitura",icon:"◫",filter:x=>x.type==='pdf'||x.type==='markdown'||x.favorite},
        sistema:{title:"Sistema",icon:"▣",filter:x=>x.type==='json'||x.type==='txt'},
        criacao:{title:"Criação",icon:"✦",filter:x=>x.type==='html'}
      };

      /* ======================================================
         REGISTRO CENTRAL DOS MINI APPS
         Troque apenas url para apontar um mini app real.
      ====================================================== */
      const REGISTRY=[
        {id:'dual-infodose',name:'Dual Infodose',kind:'ia',icon:'◉',desc:'IA · Chat · Voz',url:null},
        {id:'slice-reader',name:'Slice Reader',kind:'leitura',icon:'◫',desc:'Texto · Slices · Player',url:null,internal:'slice-reader'},
        {id:'tab-engine',name:'Tab Engine',kind:'sistema',icon:'▣',desc:'Abas · Sessões',url:null},
        {id:'baulite',name:'BaúLite',kind:'sistema',icon:'◈',desc:'Dados · Biblioteca',url:null},
        {id:'cortex',name:'Cortex',kind:'ia',icon:'◎',desc:'Conhecimento · RAG',url:null},
        {id:'workspace',name:'Workspace',kind:'criacao',icon:'⌘',desc:'Projetos · Espaços',url:null}
      ];
      window.NEBULA_APP_REGISTRY=REGISTRY;

      const docs=()=>typeof currentDocs!=='undefined'&&Array.isArray(currentDocs)?currentDocs:[];
      const safe=v=>typeof escapeHTML==='function'?escapeHTML(v):String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));
      const icon=t=>ICONS[t]||'◌';

      function fileAsSlice(item){
        return {id:`slice-${item.id}`,name:item.name||'Texto',type:'slice',content:String(item?.content||''),source:item.source||'nebula',favorite:item.favorite,cortexSaved:item.cortexSaved};
      }
      function openItem(item){
        if(!item||!item.id)return;
        const target=(item.type==='markdown'||item.type==='txt')?fileAsSlice(item):item;
        if(window.NebulaSW?.open)window.NebulaSW.open(target);else if(typeof openReader==='function')openReader(target);
      }
      function categoryItems(cat){return docs().filter((MAP[cat]||MAP.todos).filter).sort((a,b)=>(b.updatedAt||0)-(a.updatedAt||0));}
      function registryItem(name){return REGISTRY.find(x=>x.name.toLowerCase()===String(name).toLowerCase())||null;}

      function appShell(app){
        const html=`<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>html,body{height:100%;margin:0}body{font-family:Inter,system-ui;background:#050608;color:#f4f7fa;display:grid;place-items:center;padding:28px;box-sizing:border-box}main{width:min(720px,100%);padding:28px;border:1px solid rgba(255,255,255,.1);border-radius:24px;background:rgba(255,255,255,.03);text-align:center}h1{margin:0 0 10px;font-size:28px}p{margin:0;color:#87929b;line-height:1.6}</style></head><body><main><div style="font-size:42px">${safe(app.icon||'◉')}</div><h1>${safe(app.name)}</h1><p>${safe(app.desc||'Experiência Nebula')}</p></main></body></html>`;
        return {id:`app-${app.id}`,name:app.name,type:'html',url:URL.createObjectURL(new Blob([html],{type:'text/html'})),content:html};
      }

      window.openApp=function(nameOrObj){
        if(typeof nameOrObj==='object'){openItem(nameOrObj);return;}
        const app=registryItem(nameOrObj);
        if(app?.internal==='slice-reader'){
          const first=docs().find(x=>x.type==='markdown'||x.type==='txt');
          if(first){openItem(first);return;}
          openItem({id:'slice-demo',name:'Slice Reader · Demo',type:'slice',content:'# Slice Reader\n\nO motor de slices está integrado ao Session Window.\n\nSelecione um Markdown ou TXT na Biblioteca para usar o mesmo visualizador.'});return;
        }
        if(app?.url){openItem({id:`app-${app.id}`,name:app.name,type:'html',url:app.url,content:''});return;}
        const doc=docs().find(x=>x.name===nameOrObj||x.id===nameOrObj);if(doc){openItem(doc);return;}
        openItem(appShell(app||{id:String(nameOrObj).toLowerCase().replace(/[^a-z0-9]+/g,'-'),name:String(nameOrObj),icon:'◉',desc:'Experiência aberta em Session Window.'}));
      };

      window.selectCategory=function(btn){
        document.querySelectorAll('#exploreTabs button').forEach(b=>b.classList.remove('active'));btn?.classList.add('active');
        const cat=btn?.dataset.category||'todos';
        if(typeof NEBULA_UI_STATE!=='undefined'){NEBULA_UI_STATE.exploreCategory=cat;saveUIState?.();}
        renderExplorer(cat);
      };

      function renderExplorer(cat){
        const panel=document.getElementById('exploreResults');if(!panel)return;
        const cfg=MAP[cat]||MAP.todos,items=categoryItems(cat);
        panel.innerHTML=`<div class="explore-results-head"><div class="explore-results-title">${cfg.icon} ${cfg.title}</div><div class="explore-results-count">${items.length} recurso${items.length===1?'':'s'}</div></div><div class="explore-rail"></div>`;
        const rail=panel.querySelector('.explore-rail');
        if(!items.length)rail.innerHTML='<div class="explore-empty">Nenhum recurso desta categoria ainda.</div>';
        items.slice(0,50).forEach(item=>{const b=document.createElement('button');b.type='button';b.className='explore-card';b.innerHTML=`<div class="ec-icon">${icon(item.type)}</div><strong>${safe(item.name||'Recurso')}</strong><small>${((typeof TYPE_LABELS!=='undefined'&&TYPE_LABELS[item.type])||item.type||'RECURSO').toUpperCase()} · ABRIR</small>`;b.onclick=()=>openItem(item);rail.appendChild(b);});
        panel.classList.add('open');
      }
      window.renderExplorer=renderExplorer;

      function renderMiniApps(){
        const rail=document.getElementById('appRail');if(!rail)return;
        rail.querySelectorAll('[data-dynamic="true"]').forEach(x=>x.remove());
        REGISTRY.forEach(app=>{
          const existing=[...rail.querySelectorAll('.mini-card')].find(x=>x.dataset.appName===app.name);
          if(existing){existing.dataset.appKind=app.kind;return;}
          const card=document.createElement('article');card.className='mini-card';card.dataset.dynamic='true';card.dataset.appKind=app.kind;card.dataset.appName=app.name;card.innerHTML=`<div class="mini-icon">${app.icon}</div><h3>${safe(app.name)}</h3><p>${safe(app.desc)}</p>`;card.onclick=()=>window.openApp(app.name);rail.appendChild(card);
        });
        docs().filter(x=>x.type==='html'&&x.url).forEach(item=>{const card=document.createElement('article');card.className='mini-card';card.dataset.dynamic='true';card.dataset.appKind='criacao';card.dataset.appName=item.name;card.innerHTML=`<span class="mini-app-badge">WEBFRAME</span><div class="mini-icon">🌐</div><h3>${safe(item.name||'HTML App')}</h3><p>HTML · WebFrame · Session Window</p>`;card.onclick=()=>openItem(item);rail.appendChild(card);});
      }
      window.renderMiniApps=renderMiniApps;

      function bindPills(){
        const track=document.getElementById('pCarouselTrack');if(!track||track.dataset.unifiedBound)return;track.dataset.unifiedBound='1';let sx=0,sy=0,moved=false;
        track.addEventListener('pointerdown',e=>{sx=e.clientX;sy=e.clientY;moved=false},{capture:true});
        track.addEventListener('pointermove',e=>{if(Math.hypot(e.clientX-sx,e.clientY-sy)>12)moved=true},{capture:true});
        track.addEventListener('pointerup',e=>{if(moved)return;const pill=e.target.closest('.pill-card');if(!pill)return;const idx=[...track.querySelectorAll('.pill-card')].indexOf(pill),data=window.__NEBULA_APP_CARDS?.[idx];if(!data)return;const html=`<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>html,body{margin:0;height:100%}body{background:#080a0d;color:#fff;font-family:Inter,system-ui;display:grid;place-items:center;padding:24px;box-sizing:border-box;text-align:center}.box{width:min(780px,100%)}img{display:block;width:100%;max-height:58vh;object-fit:cover;border-radius:24px}h1{font-size:28px;margin:18px 0 8px}p{opacity:.7;line-height:1.6}</style></head><body><div class="box"><img src="${safe(data.image)}"><h1>${safe(data.title)}</h1><p>${safe(data.desc)}</p></div></body></html>`;openItem({id:`pill-${data.id}`,name:data.title,type:'html',url:URL.createObjectURL(new Blob([html],{type:'text/html'})),content:html});},{capture:true});
      }

      window.nebulaRefreshUnified=function(){
        const cat=(typeof NEBULA_UI_STATE!=='undefined'&&NEBULA_UI_STATE.exploreCategory)||'todos';
        const btn=document.querySelector(`#exploreTabs button[data-category="${cat}"]`)||document.querySelector('#exploreTabs button[data-category="todos"]');
        if(btn){document.querySelectorAll('#exploreTabs button').forEach(b=>b.classList.remove('active'));btn.classList.add('active');}
        renderExplorer(cat);renderMiniApps();
      };

      /* =====================================================
         SLICE ENGINE BRIDGE · baseado no Slice Reader enviado
      ===================================================== */
      window.NebulaSliceEngine=(function(){
        function escape(t){return String(t??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}
        /* Delegado à engine única NebulaMD — sem parser duplicado.
           Mantém o mesmo nome/assinatura pois mount() chama md(content) diretamente. */
        function md(text){ return window.NebulaMD ? window.NebulaMD.render(text) : escape(text||''); }
        function parse(text){const lines=String(text||'').replace(/\r/g,'').split('\n'),out=[];let cur=[];const push=()=>{const v=cur.join('\n').trim();if(v)out.push(v);cur=[];};for(const line of lines){if(/^#{1,3}\s+/.test(line)){if(cur.length)push();cur.push(line);continue;}if(/^---+$/.test(line.trim())){push();continue;}cur.push(line);}if(cur.length)push();if(out.length<=1){const blocks=String(text||'').split(/\n\s*\n/).map(x=>x.trim()).filter(Boolean);if(blocks.length>1)return blocks;}return out;}
        function cleanSpeech(s){return String(s||'').replace(/```[\s\S]*?```/g,' código ').replace(/^#{1,6}\s+/gm,'').replace(/[*_~`]/g,'').replace(/^>\s*/gm,'').replace(/^[-*]\s+/gm,'').replace(/\[([^\]]+)\]\([^)]+\)/g,'$1').replace(/\n+/g,' ').trim();}
        function mount(host,doc){
          if(!host)return;const slices=parse(doc.content||'');let current=0,speaking=false;
          host.innerHTML=`<div class="slice-bridge"><div class="slice-bridge-viewport"><div class="slice-bridge-stage"></div><div class="slice-bridge-nav"><button data-prev>↑</button><button data-next>↓</button></div><div class="slice-bridge-player"><button class="play" data-play>▶</button><div class="info"><div class="title" data-title></div><div class="state" data-state></div><div class="bar"><i data-bar></i></div></div><button class="mini" data-prev2>‹</button><button class="mini" data-next2>›</button><button class="mini" data-stop>■</button></div></div></div>`;
          const root=host.firstElementChild,stage=root.querySelector('.slice-bridge-stage'),title=root.querySelector('[data-title]'),stateEl=root.querySelector('[data-state]'),bar=root.querySelector('[data-bar]'),play=root.querySelector('[data-play]');
          const pages=slices.map((content,i)=>{const page=document.createElement('section');page.className='slice-bridge-page';page.innerHTML=`<div class="slice-bridge-content"><div class="slice-bridge-meta"><label>SLICE ${String(i+1).padStart(2,'0')}</label><span>${i+1} / ${slices.length}</span></div><div class="slice-bridge-body nebula-md">${md(content)}</div></div>`;stage.appendChild(page);return page;});
          title.textContent=doc.name||'Documento';
          function update(){if(!pages.length){stateEl.textContent='Sem conteúdo';return;}if(current<0)current=pages.length-1;if(current>=pages.length)current=0;pages.forEach((p,i)=>p.classList.toggle('active',i===current));bar.style.width=`${((current+1)/pages.length)*100}%`;stateEl.textContent=`Slice ${current+1} de ${pages.length}`;}
          function next(){if(!pages.length)return;if(current<pages.length-1){current++;update();if(speaking)speak();}else stop();}function prev(){if(!pages.length)return;current--;update();if(speaking)speak();}
          function speak(){if(!('speechSynthesis'in window)||!pages.length)return;speechSynthesis.cancel();const text=cleanSpeech(slices[current]);if(!text)return;const u=new SpeechSynthesisUtterance(text);u.lang='pt-BR';u.rate=1;u.pitch=1;u.volume=1;u.onstart=()=>{speaking=true;play.textContent='Ⅱ';stateEl.textContent=`Lendo slice ${current+1}`};u.onend=()=>{if(speaking){if(current<pages.length-1){current++;update();speak();}else stop();}};u.onerror=()=>stop();speechSynthesis.speak(u);}
          function stop(){window.speechSynthesis?.cancel?.();speaking=false;play.textContent='▶';update();}function toggle(){if(!pages.length)return;if(speaking&&speechSynthesis.paused){speechSynthesis.resume();play.textContent='Ⅱ';stateEl.textContent=`Lendo slice ${current+1}`;return;}if(speaking){speechSynthesis.pause();play.textContent='▶';stateEl.textContent='Pausado';return;}speaking=true;speak();}
          root.querySelector('[data-prev]').onclick=prev;root.querySelector('[data-next]').onclick=next;root.querySelector('[data-prev2]').onclick=prev;root.querySelector('[data-next2]').onclick=next;root.querySelector('[data-stop]').onclick=stop;play.onclick=toggle;let touchX=0;root.addEventListener('touchstart',e=>{touchX=e.changedTouches[0].screenX},{passive:true});root.addEventListener('touchend',e=>{const dx=e.changedTouches[0].screenX-touchX;if(Math.abs(dx)>=60){if(dx<0)next();else prev();}},{passive:true});update();return {destroy:stop,next,prev,play:toggle};
        }
        return {mount,parse,markdownToHTML:md};
      })();

      function boot(){try{window.nebulaRefreshUnified();bindPills();setTimeout(bindPills,700);}catch(err){console.warn('[NEBULA] unified boot',err);}}
      document.addEventListener('fileAdded',()=>setTimeout(()=>window.nebulaRefreshUnified(),50));
      window.addEventListener('storage',()=>setTimeout(()=>window.nebulaRefreshUnified(),50));
      if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
    })();

    // CICLO ∅⁺/∅⁻ — RÉGUA ARQUETÍPICA
    (function () {
        "use strict"; const PESOS_ARQUETIPOS = { "NOVA": 0.12, "ATLAS": 0.18, "VITALIS": 0.14, "PULSE": 0.10, "ARTEMIS": 0.08, "SERENA": 0.10, "KAOS": 0.05, "GENUS": 0.12, "LUMINE": 0.06, "RHEA": 0.03, "SOLUS": 0.01, "AION": 0.01, "KODUX": 0.01, "BLLUE": 0.01, "JESUS": 0.01, "KOBLLUX": 0.01, "INFODOSE": 0.01, "HORUS": 0.01 };
        let cicloPasso = 0; const CICLO_PASSOS = [ { simb: "∅⁻" }, { simb: "∆ⁿ" }, { simb: "01" }, { simb: "02" }, { simb: "03" }, { simb: "∆ⁿ" } ];
        function atualizarPainelCiclo() {
            if (cicloPasso >= CICLO_PASSOS.length) cicloPasso = 0; const passo = CICLO_PASSOS[cicloPasso++];
            const entries = Object.entries(PESOS_ARQUETIPOS); const total = entries.reduce((s, [, p]) => s + p, 0);
            let rand = Math.random() * total, arqNome = entries[entries.length - 1][0]; for (const [nome, peso] of entries) { rand -= peso; if (rand <= 0) { arqNome = nome; break; } }
            const peso = PESOS_ARQUETIPOS[arqNome] || 0; const delta = (library.length * 10 + 1134 > 0) ? (library.length * 10 + 1134 % 9 || 9) / (library.length * 10 + 1134 + 1) : 0.001;
            if (document.getElementById("ciclo-passo")) document.getElementById("ciclo-passo").textContent = passo.simb || "01";
            if (document.getElementById("ciclo-arq")) document.getElementById("ciclo-arq").textContent = arqNome;
            if (document.getElementById("ciclo-peso")) document.getElementById("ciclo-peso").textContent = peso.toFixed(3);
            if (document.getElementById("ciclo-delta")) document.getElementById("ciclo-delta").textContent = delta.toFixed(4);
        }
        setTimeout(atualizarPainelCiclo, 300); document.addEventListener("fileAdded", () => setTimeout(atualizarPainelCiclo, 100));
    })();