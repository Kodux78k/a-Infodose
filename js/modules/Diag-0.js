(function(){
    if(window.__LDT_7134_PRO__) return;
    window.__LDT_7134_PRO__ = 1;

    // --- REGISTROS GLOBAIS ---
    const netLog = [], consoleLogs = [], domMutations = [];
    const eventRegistry = new WeakMap();

    // 1. Hook Event Listeners
    const originalAddEventListener = EventTarget.prototype.addEventListener;
    EventTarget.prototype.addEventListener = function(type, listener, options) {
        if (!eventRegistry.has(this)) eventRegistry.set(this, {});
        const events = eventRegistry.get(this);
        if (!events[type]) events[type] = [];
        events[type].push({ listener, options });
        return originalAddEventListener.call(this, type, listener, options);
    };

    // 2. Hook Network
    const originalFetch = window.fetch;
    window.fetch = async function(...args) {
        const start = performance.now();
        const url = args[0] instanceof Request ? args[0].url : args[0];
        const method = args[0] instanceof Request ? args[0].method : (args[1]?.method || 'GET');
        const entry = { type: 'Fetch', method, url, status: 'PENDING', duration: 0, size: 0, cache: 'MISS', t: Date.now() };
        netLog.push(entry); updateTabCounters();
        try {
            const response = await originalFetch.apply(this, args);
            entry.duration = Math.round(performance.now() - start);
            entry.status = response.status;
            entry.cache = response.headers.get('X-Cache') || (entry.duration < 5 ? 'HIT' : 'MISS');
            try { entry.size = (await response.clone().blob()).size; } catch(e) { entry.size = 0; }
            return response;
        } catch (err) {
            entry.status = 'FAILED'; entry.duration = Math.round(performance.now() - start);
            throw err;
        }
    };

    const originalXHRReadyState = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url) {
        this.__ldtMethod = method; this.__ldtUrl = url; this.__ldtStart = performance.now();
        return originalXHRReadyState.apply(this, arguments);
    };
    const originalXHRSend = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.send = function(body) {
        this.addEventListener('load', () => {
            const duration = Math.round(performance.now() - this.__ldtStart);
            let size = 0; try { size = this.responseText ? new Blob([this.responseText]).size : 0; } catch(e){}
            netLog.push({ type: 'XHR', method: this.__ldtMethod, url: this.__ldtUrl, status: this.status, duration, size, cache: duration < 5 ? 'HIT' : 'MISS', t: Date.now() });
            updateTabCounters();
        });
        return originalXHRSend.apply(this, arguments);
    };

    // 3. Console Tracker
    const originalLog = console.log;
    console.log = function(...args) {
        consoleLogs.push({ msg: args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' '), t: Date.now() });
        if(document.getElementById('ldt-console') && document.getElementById('ldt-console').classList.contains('ldt-active')) renderConsoleTab();
        updateTabCounters(); return originalLog.apply(console, args);
    };

    // --- INJEÇÃO CSS MOBILE FIRST ---
    const css = `
    #ldt-btn{position:fixed;right:16px;bottom:16px;width:56px;height:56px;border-radius:50%;border:none;background:#1a1a2e;color:#fff;cursor:pointer;z-index:999999;box-shadow:0 6px 16px rgba(0,0,0,0.4);transition:transform .2s;display:grid;place-items:center;padding:0}
    #ldt-btn:active{transform:scale(.92)}
    #ldt-btn svg{width:26px;height:26px;fill:currentColor}
    
    #ldt-panel{display:none;position:fixed;right:16px;bottom:84px;width:calc(100vw - 32px);max-width:420px;height:calc(100vh - 110px);max-height:600px;background:#0f0f1a;color:#e1e1e6;border-radius:14px;overflow:hidden;box-shadow:0 12px 40px rgba(0,0,0,0.6);font-family:'Fira Code',ui-monospace,monospace;font-size:12px;z-index:999999;flex-direction:column;border:1px solid #2a2a3e}
    
    #ldt-tabs{display:flex;background:#1a1a2e;border-bottom:1px solid #2a2a3e;flex-shrink:0;overflow-x:auto;-webkit-overflow-scrolling:touch;scrollbar-width:none}
    #ldt-tabs::-webkit-scrollbar{display:none}
    #ldt-tabs button{flex:1 0 auto;min-width:72px;background:transparent;color:#a0a0b8;border:none;padding:12px 8px;cursor:pointer;font-family:inherit;font-size:11px;font-weight:600;transition:all .2s;border-bottom:2px solid transparent;display:flex;flex-direction:column;align-items:center;gap:6px}
    #ldt-tabs button.ldt-active{color:#6c5ce7;border-bottom-color:#6c5ce7;background:#0f0f1a}
    #ldt-tabs button svg{width:16px;height:16px;fill:currentColor}
    
    .ldt-page{display:none;flex:1;overflow-y:auto;overflow-x:hidden;padding:12px;white-space:pre-wrap;font-size:11px;line-height:1.5;background:#0f0f1a;word-break:break-word}
    .ldt-page.ldt-active{display:flex;flex-direction:column}
    .ldt-page::-webkit-scrollbar{width:6px}.ldt-page::-webkit-scrollbar-thumb{background:#3a3a5a;border-radius:3px}
    
    .ldt-toolbar{display:flex;gap:6px;padding:10px 12px;background:#1a1a2e;border-bottom:1px solid #2a2a3e;flex-shrink:0;flex-wrap:wrap}
    .ldt-btn{background:#2a2a4a;border:1px solid #3a3a5a;color:#d0d0e8;padding:8px 14px;border-radius:8px;font-family:inherit;font-size:11px;font-weight:600;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;gap:6px;transition:all .15s;flex:1 0 auto;min-width:calc(50% - 6px)}
    .ldt-btn:active{transform:scale(.96);background:#3a3a6a}
    .ldt-btn svg{width:14px;height:14px;fill:currentColor}
    
    .ldt-grid-item{border-bottom:1px solid #2a2a3e;padding:8px 0;word-break:break-word}
    .ldt-accent{color:#6c5ce7;font-weight:bold}
    .ldt-green{color:#00b894}.ldt-amber{color:#fdcb6e}.ldt-pink{color:#e84393}
    `;
    document.head.appendChild(Object.assign(document.createElement('style'), { textContent: css }));

    // SVGs Inline Minimalistas
    const ico = {
        bug: `<svg viewBox="0 0 24 24"><path d="M20 8h-2.81c-.45-.78-1.07-1.45-1.82-1.96L17 4.41 15.59 3l-2.17 2.17C12.96 5.06 12.49 5 12 5c-.49 0-.96.06-1.41.17L8.41 3 7 4.41l1.62 1.63C7.88 6.55 7.26 7.22 6.81 8H4v2h2.09c-.05.33-.09.66-.09 1v1H4v2h2v1c0 .34.04.67.09 1H4v2h2.81c.46.78 1.07 1.46 1.82 1.97L7 21.59 8.41 23l2.17-2.17c.45.11.92.17 1.41.17.49 0 .96-.06 1.41-.17L15.59 23 17 21.59l-1.62-1.62c.76-.51 1.37-1.19 1.82-1.97H20v-2h-2.09c.05-.33.09-.66.09-1v-1h2v-2h-2v-1c0-.34-.04-.67-.09-1H20V8zm-6 8h-4v-2h4v2zm0-4h-4v-2h4v2z"/></svg>`,
        dom: `<svg viewBox="0 0 24 24"><path d="M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zm0 2v4h14V5H5zm0 6v8h14v-8H5z"/></svg>`,
        net: `<svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>`,
        db: `<svg viewBox="0 0 24 24"><path d="M12 3C7.03 3 3 4.79 3 7s4.03 4 9 4 9-1.79 9-4-4.03-4-9-4zm0 6c-4.97 0-9-1.79-9-4v2c0 2.21 4.03 4 9 4s9-1.79 9-4V7c0 2.21-4.03 4-9 4zm0 4c-4.97 0-9-1.79-9-4v2c0 2.21 4.03 4 9 4s9-1.79 9-4v-2c0 2.21-4.03 4-9 4zm0 4c-4.97 0-9-1.79-9-4v2c0 2.21 4.03 4 9 4s9-1.79 9-4v-2c0 2.21-4.03 4-9 4z"/></svg>`,
        perf: `<svg viewBox="0 0 24 24"><path d="M11 2v20c-5.07-.5-9-4.79-9-10s3.93-9.5 9-10zm2.03 0v8.99H22c-.47-4.74-4.24-8.52-8.97-8.99zm0 11.01V22c4.74-.47 8.5-4.25 8.97-8.99h-8.97z"/></svg>`,
        log: `<svg viewBox="0 0 24 24"><path d="M4 3h16a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zm1 2v14h14V5H5zm2 2h10v2H7V7zm0 4h7v2H7v-2zm0 4h10v2H7v-2z"/></svg>`,
        lh: `<svg viewBox="0 0 24 24"><path d="M12 2L1 21h22L12 2zm0 3.99L19.53 19H4.47L12 5.99zM13 16h-2v2h2v-2zm0-6h-2v4h2v-4z"/></svg>`,
        dl: `<svg viewBox="0 0 24 24"><path d="M13 10h5l-6 6-6-6h5V3h2v7zm-9 9h16v-7h2v7c0 1.103-.897 2-2 2H4c-1.103 0-2-.897-2-2v-7h2v7z"/></svg>`
    };

    // --- CONSTRUÇÃO UI ---
    const btn = document.createElement('button'); btn.id = 'ldt-btn'; btn.innerHTML = ico.bug;
    const panel = document.createElement('div'); panel.id = 'ldt-panel';
    panel.innerHTML = `
    <div id="ldt-tabs">
        <button data-tab="dom" class="ldt-active">${ico.dom}DOM</button>
        <button data-tab="net">${ico.net}NET<span></span></button>
        <button data-tab="storage">${ico.db}DB</button>
        <button data-tab="perf">${ico.perf}PERF</button>
        <button data-tab="console">${ico.log}LOG<span></span></button>
        <button data-tab="lh">${ico.lh}LITE</button>
    </div>
    <div id="ldt-dom" class="ldt-page ldt-active"></div>
    <div id="ldt-net" class="ldt-page"></div>
    <div id="ldt-storage" class="ldt-page" style="padding:0">
        <div class="ldt-toolbar" id="storage-tools">
            <button class="ldt-btn" data-fmt="txt">${ico.dl} TXT</button>
            <button class="ldt-btn" data-fmt="md">${ico.dl} MD</button>
            <button class="ldt-btn" data-fmt="json">${ico.dl} JSON</button>
            <button class="ldt-btn" data-fmt="js">⚡ INJECT</button>
        </div>
        <div id="storage-content" style="padding:12px;overflow:auto;flex:1"></div>
    </div>
    <div id="ldt-perf" class="ldt-page"></div>
    <div id="ldt-console" class="ldt-page"></div>
    <div id="ldt-lh" class="ldt-page"></div>
    <div class="ldt-toolbar" style="border-top:1px solid #2a2a3e;border-bottom:none">
        <button class="ldt-btn" id="ldt-export-btn" style="width:100%;min-width:100%">${ico.dl} GERAR SNAPSHOT COMPLETO</button>
    </div>
    `;
    document.body.append(btn, panel);

    const pages = {
        dom: panel.querySelector('#ldt-dom'),
        net: panel.querySelector('#ldt-net'),
        storage: panel.querySelector('#storage-content'),
        perf: panel.querySelector('#ldt-perf'),
        console: panel.querySelector('#ldt-console'),
        lh: panel.querySelector('#ldt-lh')
    };

    function showTab(tabId) {
        panel.querySelectorAll('.ldt-page').forEach(p => p.classList.remove('ldt-active'));
        panel.querySelectorAll('#ldt-tabs button').forEach(b => b.classList.remove('ldt-active'));
        document.getElementById(`ldt-${tabId}`).classList.add('ldt-active');
        panel.querySelector(`#ldt-tabs button[data-tab="${tabId}"]`).classList.add('ldt-active');
        
        // Auto-scroll da tab ativa no mobile
        const activeBtn = panel.querySelector(`#ldt-tabs button[data-tab="${tabId}"]`);
        activeBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });

        renderPage(tabId);
    }

    panel.querySelectorAll('#ldt-tabs button').forEach(b => b.addEventListener('click', (e) => {
        e.preventDefault(); showTab(b.dataset.tab);
    }));

    btn.addEventListener('click', (e) => {
        e.preventDefault();
        const isFlex = panel.style.display === 'flex';
        panel.style.display = isFlex ? 'none' : 'flex';
        if (!isFlex) showTab(panel.querySelector('#ldt-tabs button.ldt-active').dataset.tab);
    });

    function updateTabCounters() {
        const netBtn = panel.querySelector('#ldt-tabs button[data-tab="net"] span');
        if (netBtn && netLog.length) netBtn.textContent = `(${netLog.length})`;
        const logBtn = panel.querySelector('#ldt-tabs button[data-tab="console"] span');
        if (logBtn && consoleLogs.length) logBtn.textContent = `(${consoleLogs.length})`;
    }

    // --- RENDERERS ---
    function renderPage(tab) {
        if (tab === 'dom') renderElementsTab();
        if (tab === 'net') renderNetworkTab();
        if (tab === 'storage') renderStorageTab();
        if (tab === 'perf') renderMetricsTab();
        if (tab === 'console') renderConsoleTab();
        if (tab === 'lh') renderLighthouseTab();
    }

    function renderElementsTab() {
        let html = `<b class="ldt-accent"># BUNDLES (MOBILE)</b>\nJS: ${document.scripts.length} | CSS: ${document.styleSheets.length}\nImgs: ${document.images.length} | SVGs: ${document.querySelectorAll('svg').length}\n\n`;
        function walk(el, depth = 0) {
            let str = ' '.repeat(depth) + `<span class="ldt-pink">&lt;${el.tagName.toLowerCase()}</span>`;
            if (el.id) str += ` <span class="ldt-amber">id="${el.id}"</span>`;
            if (el.className && typeof el.className === 'string') str += ` class="${el.className.split(' ').join('.')}"`;
            str += '<span class="ldt-pink">&gt;</span>\n';
            for (let child of el.children) {
                if (child.id !== 'ldt-panel' && child.id !== 'ldt-btn') str += walk(child, depth + 2);
            }
            return str;
        }
        pages.dom.innerHTML = html + walk(document.body);
    }

    function renderNetworkTab() {
        let html = netLog.map(n => `<div class="ldt-grid-item">[${new Date(n.t).toLocaleTimeString()}] <b class="ldt-accent">${n.type}</b>\n${n.url}\nStatus: ${n.status} | ${n.duration}ms | ${(n.size/1024).toFixed(1)}KB</div>`).join('') || 'Vazio.';
        pages.net.innerHTML = html;
    }

    function getCache() {
        const c = { localStorage: {}, sessionStorage: {}, cookies: document.cookie || '', timestamp: Date.now() };
        for (let i = 0; i < localStorage.length; i++) c.localStorage[localStorage.key(i)] = localStorage.getItem(localStorage.key(i));
        for (let i = 0; i < sessionStorage.length; i++) c.sessionStorage[sessionStorage.key(i)] = sessionStorage.getItem(sessionStorage.key(i));
        return c;
    }

    function renderStorageTab() {
        const c = getCache(); let html = `<b class="ldt-accent"># LOCAL STORAGE</b>\n`;
        Object.keys(c.localStorage).forEach(k => html += `${k} = ${c.localStorage[k]}\n`);
        html += `\n<b class="ldt-accent"># SESSION STORAGE</b>\n`;
        Object.keys(c.sessionStorage).forEach(k => html += `${k} = ${c.sessionStorage[k]}\n`);
        html += `\n<b class="ldt-accent"># COOKIES</b>\n${c.cookies || 'vazio'}`;
        pages.storage.innerHTML = html; window.__LDT_CACHE__ = c;
    }

    function renderConsoleTab() {
        pages.console.innerHTML = consoleLogs.map(l => `<div class="ldt-grid-item">[${new Date(l.t).toLocaleTimeString()}]<br>${l.msg}</div>`).join('') || 'Logs vazios.';
    }

    // --- LOOP DE PERFORMANCE ---
    let fps = 0, lastFpsUpdate = Date.now(), frames = 0;
    function countFrames() {
        frames++; const now = Date.now();
        if (now >= lastFpsUpdate + 1000) { fps = Math.round((frames * 1000) / (now - lastFpsUpdate)); frames = 0; lastFpsUpdate = now; }
        requestAnimationFrame(countFrames);
    }
    requestAnimationFrame(countFrames);

    const observer = new MutationObserver(m => {
        m.forEach(mut => {
            let t = `[${new Date().toLocaleTimeString()}] `;
            if (mut.type === 'childList') t += `Nó ${mut.addedNodes.length ? 'add: <'+mut.addedNodes[0].nodeName.toLowerCase()+'>' : 'rem'}`;
            else if (mut.type === 'attributes') t += `Attr [${mut.attributeName}]`;
            domMutations.unshift(t); if(domMutations.length > 10) domMutations.pop();
        });
    });
    observer.observe(document.body, { attributes: true, childList: true, subtree: true });

    function renderMetricsTab() {
        if (!document.getElementById('ldt-perf').classList.contains('ldt-active')) return;
        let html = `<b class="ldt-accent"># PERFORMANCE LIVE</b>\nFPS:       <span class="ldt-green">${fps}</span>\nDOM Nodes: ${document.getElementsByTagName('*').length}\n`;
        if (performance.memory) html += `JS Heap:   ${(performance.memory.usedJSHeapSize / 1024 / 1024).toFixed(2)} MB\n`;
        html += `\n<b class="ldt-accent"># MUTATION (TOP 10)</b>\n${domMutations.join('\n') || 'Aguardando...'}`;
        pages.perf.innerHTML = html; setTimeout(renderMetricsTab, 1000);
    }

    function renderLighthouseTab() {
        const nodes = document.getElementsByTagName('*').length, reqs = netLog.length;
        let score = 100;
        if (nodes > 1000) score -= 20; if (reqs > 30) score -= 15;
        pages.lh.innerHTML = `<b class="ldt-accent"># LIGHTHOUSE MOBILE</b>\n\nSCORE: <b class="${score > 80 ? 'ldt-green' : 'ldt-amber'}" style="font-size: 16px;">${Math.max(10, score)}/100</b>\n\nRequests: ${reqs}\nDOM Nodes: ${nodes}\nCache Hit: ${reqs ? Math.round((netLog.filter(n=>n.cache==='HIT').length/reqs)*100) : 100}%`;
    }

    // --- DOWNLOADS ---
    function dl(name, content, type) {
        const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([content], {type})); a.download = name; a.click(); URL.revokeObjectURL(a.href);
    }

    panel.querySelectorAll('#storage-tools button').forEach(b => b.addEventListener('click', () => {
        const c = window.__LDT_CACHE__ || getCache(); const base = `cache-7134-${Date.now()}`; const fmt = b.dataset.fmt;
        if (fmt=='txt') dl(`${base}.txt`, JSON.stringify(c, null, 2), 'text/plain');
        if (fmt=='md') dl(`${base}.md`, `# Cache Dump\n\`\`\`json\n${JSON.stringify(c,null,2)}\n\`\`\``, 'text/markdown');
        if (fmt=='json') dl(`${base}.json`, JSON.stringify(c, null, 2), 'application/json');
        if (fmt=='js') dl(`${base}.js`, `(function(){const C=${JSON.stringify(c)};Object.entries(C.localStorage).forEach(([k,v])=>localStorage.setItem(k,v));Object.entries(C.sessionStorage).forEach(([k,v])=>sessionStorage.setItem(k,v));if(C.cookies)C.cookies.split(';').forEach(c=>document.cookie=c.trim());console.log('Cache Injetado!');})();`, 'text/javascript');
    }));

    panel.querySelector('#ldt-export-btn').addEventListener('click', () => {
        const snap = `<!DOCTYPE html><html><head><title>Snapshot</title><style>body{background:#0f0f1a;color:#e1e1e6;font-family:monospace;padding:10px}pre{background:#1a1a2e;padding:10px;overflow-x:auto}</style></head><body>
        <h2>Report Mobile</h2><pre>${pages.dom.innerText.replace(/</g, '&lt;')}</pre><pre>${JSON.stringify(netLog, null, 2)}</pre></body></html>`;
        dl(`snapshot-${Date.now()}.html`, snap, 'text/html');
    });

    })();
