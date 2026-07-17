 // Simulando uso normal da página
        localStorage.setItem('user_session', 'mobile_token_999');
        document.cookie = "theme=dark; path=/";
        document.getElementById('btn-test').addEventListener('click', () => {
            console.log('Ação Mobile disparada!', { platform: navigator.userAgent });
            const p = document.createElement('p'); p.textContent = '⚡ Mutação detectada no DOM!';
            document.querySelector('.card').appendChild(p);
        });
        document.getElementById('btn-fetch').addEventListener('click', () => {
            fetch('https://infodose.com.br').then(r => r.json()).then(d => console.log('Fetch OK', d));
        });
  

    
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
    </script> <script>

(function(){
if(window.__LDT_7134_PRO__) return;
window.__LDT_7134_PRO__ = 1;

// --- REGISTROS GLOBAIS DE INTERCEPTAÇÃO ---
const netLog = [];
const consoleLogs = [];
const domMutations = [];
const eventRegistry = new WeakMap();

// 1. Hook de Event Listeners (Upgrade 8)
const originalAddEventListener = EventTarget.prototype.addEventListener;
EventTarget.prototype.addEventListener = function(type, listener, options) {
    if (!eventRegistry.has(this)) {
        eventRegistry.set(this, {});
    }
    const events = eventRegistry.get(this);
    if (!events[type]) events[type] = [];
    events[type].push({ listener, options });
    return originalAddEventListener.call(this, type, listener, options);
};

// 2. Hook Completo de Network (Upgrade 1)
// Fetch Interceptor
const originalFetch = window.fetch;
window.fetch = async function(...args) {
    const start = performance.now();
    const url = args[0] instanceof Request ? args[0].url : args[0];
    const method = args[0] instanceof Request ? args[0].method : (args[1]?.method || 'GET');
    let payload = '';
    if (args[1]?.body) payload = String(args[1].body);

    const entry = { type: 'Fetch', method, url, status: 'PENDING', duration: 0, size: 0, cache: 'MISS', payload, t: Date.now() };
    netLog.push(entry);
    updateTabCounters();

    try {
        const response = await originalFetch.apply(this, args);
        const clone = response.clone();
        entry.duration = Math.round(performance.now() - start);
        entry.status = response.status;
        entry.cache = response.headers.get('X-Cache') || response.headers.get('Cf-Cache-Status') || (entry.duration < 2 ? 'HIT' : 'MISS');
        try {
            const blob = await clone.blob();
            entry.size = blob.size;
        } catch(e) { entry.size = 0; }
        return response;
    } catch (err) {
        entry.status = 'FAILED';
        entry.duration = Math.round(performance.now() - start);
        throw err;
    }
};

// XHR Interceptor
const originalXHRReadyState = XMLHttpRequest.prototype.open;
XMLHttpRequest.prototype.open = function(method, url) {
    this.__ldtMethod = method;
    this.__ldtUrl = url;
    this.__ldtStart = performance.now();
    return originalXHRReadyState.apply(this, arguments);
};
const originalXHRSend = XMLHttpRequest.prototype.send;
XMLHttpRequest.prototype.send = function(body) {
    this.__ldtPayload = body ? String(body) : '';
    this.addEventListener('load', () => {
        const duration = Math.round(performance.now() - this.__ldtStart);
        let size = 0;
        try { size = this.responseText ? new Blob([this.responseText]).size : 0; } catch(e){}
        netLog.push({
            type: 'XHR', method: this.__ldtMethod, url: this.__ldtUrl, status: this.status,
            duration, size, cache: duration < 2 ? 'HIT' : 'MISS', payload: this.__ldtPayload, t: Date.now()
        });
        updateTabCounters();
    });
    return originalXHRSend.apply(this, arguments);
};

// sendBeacon Interceptor
if (navigator.sendBeacon) {
    const originalSendBeacon = navigator.sendBeacon;
    navigator.sendBeacon = function(url, data) {
        netLog.push({
            type: 'Beacon', method: 'POST', url, status: 'Beacon Sent',
            duration: 0, size: data ? (data.size || data.length || 0) : 0, cache: 'BYPASS', payload: data ? String(data) : '', t: Date.now()
        });
        updateTabCounters();
        return originalSendBeacon.apply(this, arguments);
    };
}

// WebSocket Interceptor
const originalWS = window.WebSocket;
window.WebSocket = function(url, protocols) {
    const ws = protocols ? new originalWS(url, protocols) : new originalWS(url);
    netLog.push({ type: 'WS', method: 'WS CONNECT', url, status: 'OPENING', duration: 0, size: 0, cache: 'LIVE', payload: '', t: Date.now() });
    updateTabCounters();
    ws.addEventListener('open', () => {
        const active = netLog.find(n => n.url === url && n.status === 'OPENING');
        if (active) active.status = 'CONNECTED';
    });
    return ws;
};

// EventSource Interceptor
const originalES = window.EventSource;
window.EventSource = function(url, config) {
    const es = new originalES(url, config);
    netLog.push({ type: 'SSE', method: 'SSE INITIATE', url, status: 'STREAMING', duration: 0, size: 0, cache: 'LIVE', payload: '', t: Date.now() });
    updateTabCounters();
    return es;
};

// Console Tracker
const originalLog = console.log;
console.log = function(...args) {
    consoleLogs.push({ msg: args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' '), t: Date.now() });
    return originalLog.apply(console, args);
};

// --- INJEÇÃO DA INTERFACE VISUAL ---
const css = `
#ldt-btn{position:fixed;right:16px;bottom:16px;width:52px;height:52px;border-radius:50%;border:none;background:#1a1a2e;color:#fff;cursor:pointer;z-index:999999;box-shadow:0 4px 12px #0006;transition:transform.15s,background.15s;display:grid;place-items:center}
#ldt-btn:hover{background:#161626;transform:scale(1.05)}
#ldt-panel{display:none;position:fixed;right:16px;bottom:76px;width:460px;height:600px;background:#121214;color:#e1e1e6;border-radius:14px;overflow:hidden;box-shadow:0 8px 30px #000c;font-family:'Fira Code','JetBrains Mono',ui-monospace,monospace;font-size:12px;z-index:999999;flex-direction:column;border:1px solid #29292e}
#ldt-tabs{display:flex;background:#19191c;border-bottom:1px solid #29292e;flex-shrink:0;overflow-x:auto}
#ldt-tabs button{flex:1;min-width:70px;background:transparent;color:#a8a8b3;border:none;padding:10px 4px;cursor:pointer;font-family:inherit;font-size:11px;font-weight:500;transition:all.15s;border-bottom:2px solid transparent;display:flex;flex-direction:column;align-items:center;gap:4px}
#ldt-tabs button:hover{color:#fff;background:#202024}
#ldt-tabs button.ldt-active{color:#4895ef;border-bottom-color:#4895ef;background:#121214}
#ldt-tabs button svg{width:14px;height:14px;fill:currentColor}
.ldt-page{display:none;flex:1;overflow:auto;padding:12px;white-space:pre-wrap;font-size:11px;line-height:1.4;background:#121214}
.ldt-page.ldt-active{display:flex;flex-direction:column}
.ldt-toolbar{display:flex;gap:6px;padding:8px 12px;background:#19191c;border-bottom:1px solid #29292e;flex-shrink:0}
.ldt-btn{background:#202024;border:1px solid #29292e;color:#c4c4cc;padding:4px 8px;border-radius:4px;font-family:inherit;font-size:11px;cursor:pointer;display:inline-flex;align-items:center;gap:4px}
.ldt-btn:hover{background:#29292e;color:#fff}
.ldt-grid-item{border-bottom:1px solid #29292e;padding:6px 0}
.ldt-accent{color:#4895ef}
.ldt-green{color:#4caf50}
.ldt-amber{color:#ff9800}
.ldt-inspector-overlay{position:fixed;pointer-events:none;z-index:999998;border:2px solid #4895ef;background:rgba(72,149,239,0.1);transition:all 0.05s ease}
.ldt-inspector-tooltip{position:fixed;pointer-events:none;z-index:999999;background:#19191c;color:#fff;padding:8px;border-radius:6px;font-size:10px;font-family:sans-serif;box-shadow:0 4px 12px rgba(0,0,0,0.5);border:1px solid #29292e}
`;

document.head.appendChild(Object.assign(document.createElement('style'), { textContent: css }));

const ico = {
    bug: `<svg viewBox="0 0 24 24"><path d="M20 8h-2.81c-.45-.78-1.07-1.45-1.82-1.96L17 4.41 15.59 3l-2.17 2.17C12.96 5.06 12.49 5 12 5c-.49 0-.96.06-1.41.17L8.41 3 7 4.41l1.62 1.63C7.88 6.55 7.26 7.22 6.81 8H4v2h2.09c-.05.33-.09.66-.09 1v1H4v2h2v1c0 .34.04.67.09 1H4v2h2.81c.46.78 1.07 1.46 1.82 1.97L7 21.59 8.41 23l2.17-2.17c.45.11.92.17 1.41.17.49 0 .96-.06 1.41-.17L15.59 23 17 21.59l-1.62-1.62c.76-.51 1.37-1.19 1.82-1.97H20v-2h-2.09c.05-.33.09-.66.09-1v-1h2v-2h-2v-1c0-.34-.04-.67-.09-1H20V8zm-6 8h-4v-2h4v2zm0-4h-4v-2h4v2z"/></svg>`,
    dom: `<svg viewBox="0 0 24 24"><path d="M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zm0 2v4h14V5H5zm0 6v8h14v-8H5z"/></svg>`,
    net: `<svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>`,
    perf: `<svg viewBox="0 0 24 24"><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>`,
    lh: `<svg viewBox="0 0 24 24"><path d="M12 2L1 21h22L12 2zm0 3.99L19.53 19H4.47L12 5.99zM13 16h-2v2h2v-2zm0-6h-2v4h2v-4z"/></svg>`,
    aim: `<svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93z"/></svg>`
};

const btn = document.createElement('button'); btn.id = 'ldt-btn'; btn.innerHTML = ico.bug;
const panel = document.createElement('div'); panel.id = 'ldt-panel';
panel.innerHTML = `
<div id="ldt-tabs">
    <button data-tab="dom" class="ldt-active">${ico.dom}Elements</button>
    <button data-tab="net">${ico.net}Network</button>
    <button data-tab="storage">${ico.bug}Storage</button>
    <button data-tab="perf">${ico.perf}Metrics</button>
    <button data-tab="lh">${ico.lh}Lighthouse</button>
</div>
<div class="ldt-toolbar">
    <button class="ldt-btn" id="ldt-inspect-toggle">${ico.aim} Inspect</button>
    <button class="ldt-btn" id="ldt-export-btn">Full Export (.html Report)</button>
</div>
<div id="ldt-dom" class="ldt-page ldt-active"></div>
<div id="ldt-net" class="ldt-page"></div>
<div id="ldt-storage" class="ldt-page"></div>
<div id="ldt-perf" class="ldt-page"></div>
<div id="ldt-lh" class="ldt-page"></div>
`;
document.body.append(btn, panel);

// --- SELETORES E ABAS ---
const pages = {
    dom: panel.querySelector('#ldt-dom'),
    net: panel.querySelector('#ldt-net'),
    storage: panel.querySelector('#ldt-storage'),
    perf: panel.querySelector('#ldt-perf'),
    lh: panel.querySelector('#ldt-lh')
};

function showTab(tabId) {
    panel.querySelectorAll('.ldt-page').forEach(p => p.classList.remove('ldt-active'));
    panel.querySelectorAll('#ldt-tabs button').forEach(b => b.classList.remove('ldt-active'));
    pages[tabId].classList.add('ldt-active');
    panel.querySelector(`#ldt-tabs button[data-tab="${tabId}"]`).classList.add('ldt-active');
    renderPage(tabId);
}

panel.querySelectorAll('#ldt-tabs button').forEach(b => b.onclick = () => showTab(b.dataset.tab));
btn.onclick = () => {
    const isFlex = panel.style.display === 'flex';
    panel.style.display = isFlex ? 'none' : 'flex';
    if (!isFlex) showTab(panel.querySelector('#ldt-tabs button.ldt-active').dataset.tab);
};

// --- CONTADORES DINÂMICOS NAS ABAS ---
function updateTabCounters() {
    const netBtn = panel.querySelector('#ldt-tabs button[data-tab="net"]');
    if (netBtn) netBtn.innerHTML = `${ico.net}Network (${netLog.length})`;
}

// --- RENDERS DAS PÁGINAS ---

function renderPage(tab) {
    if (tab === 'dom') renderElementsTab();
    if (tab === 'net') renderNetworkTab();
    if (tab === 'storage') renderStorageTab();
    if (tab === 'perf') renderMetricsTab();
    if (tab === 'lh') renderLighthouseTab();
}

// Upgrade 3 & 7 — Elements & Bundle Analyzer
function renderElementsTab() {
    let html = `<b class="ldt-accent"># BUNDLE ANALYZER</b>\n`;
    const scripts = [...document.scripts];
    const styles = [...document.styleSheets];
    const imgs = [...document.images];
    const svgs = document.querySelectorAll('svg');
    const videos = document.querySelectorAll('video');

    html += `JS Files:   ${scripts.length} elements\n`;
    html += `CSS Files:  ${styles.length} stylesheets\n`;
    html += `Images:     ${imgs.length} assets\n`;
    html += `SVGs:       ${svgs.length} vectors\n`;
    html += `Videos:     ${videos.length} clips\n\n`;

    html += `<b class="ldt-accent"># LIVE DOM TREE</b>\n`;
    function walk(el, depth = 0) {
        let str = ' '.repeat(depth) + `<span class="ldt-green">&lt;${el.tagName.toLowerCase()}</span>`;
        if (el.id) str += ` <span class="ldt-amber">id="${el.id}"</span>`;
        if (el.className && typeof el.className === 'string') str += ` class="${el.className.split(' ').join('.')}"`;
        
        const listeners = eventRegistry.get(el);
        if (listeners) {
            str += ` <span class="ldt-accent">[evt: ${Object.keys(listeners).join(',')}]</span>`;
        }
        str += '<span class="ldt-green">&gt;</span>\n';
        
        for (let child of el.children) {
            if (!child.toSource && child.id !== 'ldt-panel' && child.id !== 'ldt-btn') {
                str += walk(child, depth + 2);
            }
        }
        return str;
    }
    html += walk(document.body);
    pages.dom.innerHTML = html;
}

// Upgrade 1 & 2 — Network & Resource Timing
function renderNetworkTab() {
    let html = netLog.map(n => {
        return `<div class="ldt-grid-item">[${new Date(n.t).toLocaleTimeString()}] <b class="ldt-accent">${n.method}</b> ${n.url.substring(0, 50)}...\n  Status: ${n.status} | Time: ${n.duration}ms | Size: ${(n.size/1024).toFixed(2)} KB | Cache: ${n.cache}</div>`;
    }).join('') || 'Nenhuma requisição capturada ainda.';

    html += `\n<b class="ldt-accent"># RESOURCE TIMING API (Waterfall Equivalente)</b>\n`;
    const resources = performance.getEntriesByType("resource");
    resources.slice(-10).forEach(r => {
        const dns = Math.round(r.domainLookupEnd - r.domainLookupStart);
        const tcp = Math.round(r.connectEnd - r.connectStart);
        const ttfb = Math.round(r.responseStart - r.requestStart);
        const download = Math.round(r.responseEnd - r.responseStart);
        html += `<div class="ldt-grid-item"><b>${r.name.split('/').pop() || r.name}</b> (${r.initiatorType})\n  DNS: ${dns}ms | TCP: ${tcp}ms | TTFB: ${ttfb}ms | Down: ${download}ms | Total: ${Math.round(r.duration)}ms</div>`;
    });

    pages.net.innerHTML = html;
}

// Upgrade 4, 5 & 6 — Cache Storage, SW & IndexedDB
async function renderStorageTab() {
    let html = `<b class="ldt-accent"># LOCAL & SESSION STORAGE</b>\n`;
    html += `localStorage Keys: ${localStorage.length}\n`;
    html += `sessionStorage Keys: ${sessionStorage.length}\n\n`;

    // Upgrade 5 — Service Worker
    html += `<b class="ldt-accent"># SERVICE WORKER STATE</b>\n`;
    if ('serviceWorker' in navigator) {
        const sw = navigator.serviceWorker.controller;
        html += `Controller: ${sw ? 'Active' : 'None'}\n`;
        if (sw) {
            html += `  Script URL: ${sw.scriptURL}\n`;
            html += `  State:      ${sw.state}\n`;
        }
    } else {
        html += `Service Workers não suportados neste browser.\n`;
    }
    html += `\n`;

    // Upgrade 6 — IndexedDB Databases
    html += `<b class="ldt-accent"># INDEXEDDB DATABASES</b>\n`;
    if (indexedDB.databases) {
        try {
            const dbs = await indexedDB.databases();
            if (dbs.length === 0) html += `Nenhum banco IndexedDB encontrado.\n`;
            dbs.forEach(db => html += ` DB Name: ${db.name} (v${db.version})\n`);
        } catch(e) { html += `Erro ao ler IndexedDB.\n`; }
    } else {
        html += `API indexedDB.databases não disponível.\n`;
    }
    html += `\n`;

    // Upgrade 4 — Cache Storage API
    html += `<b class="ldt-accent"># CACHE STORAGE KEYS</b>\n`;
    if (window.caches) {
        try {
            const keys = await caches.keys();
            if (keys.length === 0) html += `Nenhum asset em Cache Storage.\n`;
            for (let key of keys) {
                html += ` Cache Cluster: ${key}\n`;
                const opened = await caches.open(key);
                const requests = await opened.keys();
                requests.slice(0, 5).forEach(req => html += `  → ${req.url.substring(0, 60)}...\n`);
            }
        } catch(e) { html += `Erro ao varrer Cache Storage.\n`; }
    }

    pages.storage.innerHTML = html;
}

// Upgrade 9 & 10 — Metrics & Mutation Observer Live
let fps = 0, lastFpsUpdate = Date.now(), frames = 0;
function countFrames() {
    frames++;
    const now = Date.now();
    if (now >= lastFpsUpdate + 1000) {
        fps = Math.round((frames * 1000) / (now - lastFpsUpdate));
        frames = 0;
        lastFpsUpdate = now;
    }
    requestAnimationFrame(countFrames);
}
requestAnimationFrame(countFrames);

// Mutation Observer Setup (Upgrade 9)
const observer = new MutationObserver((mutations) => {
    mutations.forEach(m => {
        let text = `[${new Date().toLocaleTimeString()}] `;
        if (m.type === 'childList') {
            if (m.addedNodes.length) text += `Nó adicionado: <${m.addedNodes[0].nodeName.toLowerCase()}>`;
            if (m.removedNodes.length) text += `Nó removido: <${m.removedNodes[0].nodeName.toLowerCase()}>`;
        } else if (m.type === 'attributes') {
            text += `Atributo alterado: [${m.attributeName}] no <${m.target.nodeName.toLowerCase()}>`;
        }
        domMutations.unshift(text);
        if (domMutations.length > 20) domMutations.pop();
    });
});
observer.observe(document.body, { attributes: true, childList: true, subtree: true });

function renderMetricsTab() {
    if (!pages.perf.classList.contains('ldt-active')) return;

    let html = `<b class="ldt-accent"># PERFORMANCE LIVE ENGINE</b>\n`;
    html += `FPS:          <span class="ldt-green">${fps} FPS</span>\n`;
    html += `DOM Nodes:    ${document.getElementsByTagName('*').length} nós\n`;
    
    if (performance.memory) {
        html += `JS Heap Total: ${(performance.memory.totalJSHeapSize / 1024 / 1024).toFixed(2)} MB\n`;
        html += `JS Heap Used:  <span class="ldt-amber">${(performance.memory.usedJSHeapSize / 1024 / 1024).toFixed(2)} MB</span>\n`;
    } else {
        html += `Heap Memory:   N/A (Use o Chrome/Edge)\n`;
    }

    html += `\n<b class="ldt-accent"># MUTATION OBSERVER REALTIME (Top 10)</b>\n`;
    html += domMutations.join('\n') || 'Aguardando mutações no DOM... Altere alguma classe ou elemento.';

    pages.perf.innerHTML = html;
    setTimeout(renderMetricsTab, 1000); // Loop de atualização realtime
}

// Upgrade 11 — Lighthouse Lite
function renderLighthouseTab() {
    const nodes = document.getElementsByTagName('*').length;
    const reqs = netLog.length;
    
    // Cálculo Heurístico de Performance Score
    let perfScore = 100;
    if (nodes > 1500) perfScore -= 20;
    if (reqs > 50) perfScore -= 15;
    if (performance.now() > 4000) perfScore -= 15;
    perfScore = Math.max(10, perfScore);

    const hitRate = reqs > 0 ? Math.round((netLog.filter(n => n.cache === 'HIT').length / reqs) * 100) : 100;

    let html = `<b class="ldt-accent"># LIGHTHOUSE LITE SIMULATOR</b>\n\n`;
    html += `PERFORMANCE SCORE:  <b class="${perfScore > 80 ? 'ldt-green' : 'ldt-amber'}" style="font-size: 16px;">${perfScore}/100</b>\n`;
    html += `------------------------------------\n`;
    html += `Total Requests:     ${reqs} requisições\n`;
    html += `DOM Weight:         ${nodes} elementos\n`;
    html += `Cache Hit Rate:     <span class="ldt-green">${hitRate}%</span>\n`;
    html += `Total Memory Used:  ${performance.memory ? (performance.memory.usedJSHeapSize / 1024 / 1024).toFixed(1) + ' MB' : 'N/A'}\n`;
    
    pages.lh.innerHTML = html;
}

// --- UPGRADE 13: INSPECTOR VISUAL INTEGRADO ---
let inspectorActive = false;
const overlay = document.createElement('div'); overlay.className = 'ldt-inspector-overlay';
const tooltip = document.createElement('div'); tooltip.className = 'ldt-inspector-tooltip';

function activateInspector() {
    inspectorActive = true;
    panel.style.display = 'none'; // Minimiza painel temporariamente para não obstruir
    document.body.appendChild(overlay);
    document.body.appendChild(tooltip);
    document.addEventListener('mouseover', handleInspectMouseOver, true);
    document.addEventListener('click', handleInspectClick, true);
}

function deactivateInspector() {
    inspectorActive = false;
    if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
    if (tooltip.parentNode) tooltip.parentNode.removeChild(tooltip);
    document.removeEventListener('mouseover', handleInspectMouseOver, true);
    document.removeEventListener('click', handleInspectClick, true);
    panel.style.display = 'flex'; // Restaura painel
}

function handleInspectMouseOver(e) {
    if (e.target.id === 'ldt-btn' || panel.contains(e.target) || e.target === overlay) return;
    
    const el = e.target;
    const box = el.getBoundingClientRect();
    
    overlay.style.top = `${box.top + window.scrollY}px`;
    overlay.style.left = `${box.left + window.scrollX}px`;
    overlay.style.width = `${box.width}px`;
    overlay.style.height = `${box.height}px`;

    // Upgrade 7 — CSS Inspector Calculado Em Tempo Real
    const style = window.getComputedStyle(el);
    const listeners = eventRegistry.get(el);
    const eventCount = listeners ? Object.keys(listeners).length : 0;

    tooltip.style.top = `${e.clientY + 15}px`;
    tooltip.style.left = `${e.clientX + 15}px`;
    tooltip.innerHTML = `
        <b style="color:#4895ef">${el.tagName.toLowerCase()}${el.id ? '#'+el.id : ''}</b><br>
        Size: <b>${Math.round(box.width)} × ${Math.round(box.height)}px</b><br>
        Display: <b>${style.display}</b> | Position: <b>${style.position}</b><br>
        Flex/Grid: <b>${style.flexDirection || 'none'} / ${style.gridTemplateColumns !== 'none' ? 'yes' : 'no'}</b><br>
        Children: <b>${el.children.length}</b> | Events Bound: <b>${eventCount}</b>
    `;
}

function handleInspectClick(e) {
    if (e.target.id === 'ldt-btn' || panel.contains(e.target) || e.target === overlay) return;
    e.preventDefault();
    e.stopPropagation();
    
    deactivateInspector();
    showTab('dom');
}

panel.querySelector('#ldt-inspect-toggle').onclick = () => {
    if (!inspectorActive) activateInspector();
    else deactivateInspector();
};

// --- UPGRADE 12: EXPORT SNAPSHOT REPORT ---
panel.querySelector('#ldt-export-btn').onclick = () => {
    const diagnosticBundle = {
        dom: pages.dom.innerText,
        network: JSON.stringify(netLog, null, 2),
        console: JSON.stringify(consoleLogs, null, 2),
        performance: pages.perf.innerText,
        lighthouse: pages.lh.innerText,
        storageSnapshot: {
            localStorage: JSON.stringify(localStorage),
            sessionStorage: JSON.stringify(sessionStorage),
            cookies: document.cookie
        }
    };

    const standaloneReportHtml = `
    <!DOCTYPE html>
    <html>
    <head>
        <title>Diagnostic Snapshot Report - Pro 7134</title>
        <style>
            body { background: #121214; color: #e1e1e6; font-family: monospace; padding: 20px; }
            h2 { color: #4895ef; border-bottom: 1px solid #29292e; padding-bottom: 5px; }
            pre { background: #19191c; padding: 12px; border-radius: 6px; overflow: auto; max-height: 300px; border: 1px solid #29292e; white-space: pre-wrap;}
        </style>
    </head>
    <body>
        <h1>Diagnostic Report Summary (7134-Core Architecture)</h1>
        <p>Generated: ${new Date().toLocaleString()} on URL: ${window.location.href}</p>
        
        <h2>dom.html (Structure Tree & Bundles)</h2>
        <pre>${diagnosticBundle.dom.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>

        <h2>network.json (XHR, Fetch, Beacons, Sockets)</h2>
        <pre>${diagnosticBundle.network}</pre>

        <h2>console.log</h2>
        <pre>${diagnosticBundle.console}</pre>

        <h2>storage.json (Local, Session, Cookies)</h2>
        <pre>${JSON.stringify(diagnosticBundle.storageSnapshot, null, 2)}</pre>

        <h2>performance.json</h2>
        <pre>${diagnosticBundle.performance}</pre>

        <h2>report.md (Lighthouse Core Scores)</h2>
        <pre>${diagnosticBundle.lighthouse}</pre>
    </body>
    </html>
    `;

    const blob = new Blob([standaloneReportHtml], { type: 'text/html' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `diagnostic-${Math.floor(Math.random() * 9000) + 1000}.html`;
    a.click();
};

updateTabCounters();
})();
