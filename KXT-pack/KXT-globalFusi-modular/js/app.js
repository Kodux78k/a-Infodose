/* =========================================================
   DUAL.INFODOSE v5.1 — KOBΦ VOICE FIX + ADVANCED DOWNLOADS
   Atualizado: sincronização de tema automático corrigida
   CHAVES MIGRADAS → di_ system
========================================================= */

const STORAGE = {
    USER_NAME: 'di_userName',
    API_KEY: 'di_apiKey',
    MODEL: 'di_modelName',

    SYSTEM_ROLE: 'di_trainingText',
    TRAINING_FILE: 'di_trainingFileName',

    ASSISTANT_ENABLED: 'di_assistantEnabled',
    TRAINING_ACTIVE: 'di_trainingActive',

    INFODOSE_NAME: 'di_infodoseName',

    CONVERSATION: 'di_conversation',
    CRISTALIZADOS: 'di_cristalizados',

    // opcionais / expansão
    BG_IMAGE: 'di_bgImage',
    CUSTOM_CSS: 'di_customCss',
    SOLAR_MODE: 'di_solarMode',
    SOLAR_AUTO: 'di_solarAuto'
};


const FOOTER_TEXTS = {
    closed: { 
        ritual: [ "tocar o campo é consentir", "registro aguarda presença", "abrir é escolher ouvir" ], 
        tecnico: [ "latência detectada", "campo em espera", "aguardando input" ] 
    },
    open: { 
        sustentado: [ "campo ativo", "consciência expandida", "fluxo de dados aberto" ], 
        estavel: [ "sinal estabilizado", "link neural firme", "processando..." ] 
    },
    loading: [ "sincronizando neuro-link...", "buscando no éter...", "decodificando sinal...", "aguarde a fusão..." ]
};

let lastText = null;
function getRandomText(arr) { 
    if (!arr || arr.length === 0) return "Processando...";
    let t; 
    do { t = arr[Math.floor(Math.random() * arr.length)]; } while (t === lastText && arr.length > 1); 
    lastText = t; 
    return t; 
}

/* --- APP CORE --- */
/* ═══════════ MÓDULOS PORTADOS DO v7.9 (KODUX · KOBLLUX · Preview · Zip) ═══════════ */
const KODUX = {
    ARQUETIPOS: { "Atlas":{Essencia:"Planejador"}, "Nova":{Essencia:"Inspira"}, "Vitalis":{Essencia:"Momentum"}, "Pulse":{Essencia:"Emocional"}, "Artemis":{Essencia:"Descoberta"}, "Serena":{Essencia:"Cuidado"}, "Kaos":{Essencia:"Transformador"}, "Genus":{Essencia:"Fabricus"}, "Lumine":{Essencia:"Alegria"}, "Solus":{Essencia:"Sabedoria"}, "Rhea":{Essencia:"Vínculo"}, "Aion":{Essencia:"Tempo"} },
    PROJETO: { "I. INTRODUÇÃO":{fase:"KODUX (Δ³)",arquetipos:["Atlas","Nova","Pulse"]}, "II. ATO I":{fase:"BLLUE (Δ⁶)",arquetipos:["Vitalis","Pulse","Genus"]}, "III. ATO II":{fase:"EXPANSÃO (Δ⁹)",arquetipos:["Genus","Nova","Vitalis"]}, "IV. ATO III":{fase:"CONVERGÊNCIA (Δ⁹)",arquetipos:["Genus","Aion","Pulse"]}, "V. EPÍLOGO":{fase:"VERBO ETERNO (Δ⁷)",arquetipos:["Atlas","Aion","Genus"]} },
    systemBlock() { return `\n[SISTEMA KODUX V7.9]\nArquétipos: ${Object.keys(this.ARQUETIPOS).join(', ')}. Use V.E.E.B.`; }
};

const KoblluxCore = {
    async sha256Hex(s) {
        if (window.crypto && crypto.subtle) {
            const d = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s));
            return [...new Uint8Array(d)].map(b => b.toString(16).padStart(2, '0')).join('');
        }
        // fallback (contexto sem crypto.subtle, ex.: http em rede local)
        let h1 = 0xdeadbeef, h2 = 0x41c6ce57;
        for (let i = 0; i < s.length; i++) { const c = s.charCodeAt(i); h1 = Math.imul(h1 ^ c, 2654435761); h2 = Math.imul(h2 ^ c, 1597334677); }
        h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
        h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
        return ((h2 >>> 0).toString(16).padStart(8, '0') + (h1 >>> 0).toString(16).padStart(8, '0')).repeat(4);
    },
    classifyText(s) { const t = (s.match(/[\p{L}\p{N}_-]+/gu) || []); const endsV = ['ar','er','ir']; const verbs=[],nouns=[],adjs=[]; for (const w0 of t) { const w = w0.toLowerCase(); if (w.endsWith('mente')) { adjs.push(w0); continue; } if (endsV.some(e => w.endsWith(e))) { verbs.push(w0); continue; } if (w.endsWith('ção') || w.endsWith('são') || w.endsWith('dade')) { nouns.push(w0); continue; } if (/^[A-Z]/.test(w0)) { nouns.push(w0); continue; } } return { tokens: t, verbs, nouns, adjs }; },
    mapTrinity(pos) { return { UNO: pos.nouns[0] || 'NÚCLEO', DUAL: pos.verbs[0] || 'relaciona', TRINITY: pos.adjs[0] || 'integrado' }; },
    async process(input) {
        if (!input) return null;
        const pos = this.classifyText(input); const tri = this.mapTrinity(pos);
        const seal = await this.sha256Hex(input + new Date().toISOString());
        return { raw: input, pos, trinity: tri, seal: seal.slice(0, 16), log: `[KOBLLUX ∆7] UNO:${tri.UNO}|DUAL:${tri.DUAL}|TRI:${tri.TRINITY}::SEAL:${seal.slice(0, 8)}` };
    }
};

const Preview = {
    escapeHTML(str) { return String(str).replace(/[&<>"']/g, s => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[s])); },
    sanitizeHTML(html) { const div = document.createElement('div'); div.innerHTML = html; div.querySelectorAll('script').forEach(s => s.remove()); return div.innerHTML; },
    async renderPreview(file) {
        const type = file.type || 'text/plain'; const name = file.name || 'arquivo'; const url = URL.createObjectURL(file);
        if (type === 'text/html' || /\.html?$/i.test(name)) {
            const text = await file.text();
            const blob = new Blob([this.sanitizeHTML(text)], { type: 'text/html;charset=utf-8' });
            return `<div class="preview-html"><iframe src="${URL.createObjectURL(blob)}" sandbox="allow-scripts"></iframe></div>`;
        }
        if (type.startsWith('image/')) return `<div class="preview-html"><img src="${url}" style="width:100%;height:100%;object-fit:contain;background:#000;"></div>`;
        if (type === 'application/pdf') return `<div class="preview-html"><iframe src="${url}"></iframe></div>`;
        const text = await file.text(); const ext = (name.split('.').pop() || 'txt').replace(/[^\w-]/g, '');
        return `<div class="preview-code"><pre><code class="language-${ext}">${this.escapeHTML(text.slice(0, 2000))}</code></pre></div>`;
    },
    createHtmlViewer(htmlCode) {
        const id = 'html-' + Date.now() + '-' + Math.floor(Math.random() * 1e4);
        const url = URL.createObjectURL(new Blob([htmlCode], { type: 'text/html;charset=utf-8' }));
        const codeEscaped = this.escapeHTML(htmlCode);
        return `<div class="html-viewer" id="${id}" data-url="${url}">
          <div class="html-viewer-bar">
            <button class="html-viewer-btn active" onclick="Preview.switchView('${id}','preview',event)"><svg class="svg-icon"><use href="#icon-eye"></use></svg> Preview</button>
            <button class="html-viewer-btn" onclick="Preview.switchView('${id}','code',event)"><svg class="svg-icon"><use href="#icon-code"></use></svg> Código</button>
            <button class="html-viewer-btn" onclick="Preview.openFullscreen('${id}')"><svg class="svg-icon"><use href="#icon-maximize"></use></svg> Tela Cheia</button>
            <div class="mobile-toggle"><button class="html-viewer-btn" onclick="Preview.toggleMobile('${id}',event)"><svg class="svg-icon"><use href="#icon-eye"></use></svg> Mobile</button></div>
          </div>
          <div class="html-viewer-content"><iframe src="${url}" sandbox="allow-scripts allow-popups"></iframe><div class="html-viewer-code"><pre><code class="language-html">${codeEscaped}</code></pre></div></div>
        </div>`;
    },
    switchView(id, mode, ev) {
        const c = document.getElementById(id); if (!c) return;
        c.classList.toggle('show-code', mode === 'code');
        c.querySelectorAll('.html-viewer-bar > .html-viewer-btn').forEach(b => b.classList.remove('active'));
        if (ev && ev.currentTarget) ev.currentTarget.classList.add('active');
    },
    openFullscreen(id) {
        const c = document.getElementById(id); if (!c || c.classList.contains('fullscreen')) return;
        c.classList.add('fullscreen');
        const bar = c.querySelector('.html-viewer-bar');
        const exit = document.createElement('button');
        exit.className = 'html-viewer-btn viewer-exit';
        exit.innerHTML = '<svg class="svg-icon"><use href="#icon-restore"></use></svg> Sair';
        exit.onclick = () => { c.classList.remove('fullscreen'); exit.remove(); };
        bar.appendChild(exit);
    },
    toggleMobile(id, ev) {
        const c = document.getElementById(id); if (!c) return;
        c.classList.toggle('mobile');
        const b = ev && ev.currentTarget;
        if (b) b.innerHTML = `<svg class="svg-icon"><use href="#icon-eye"></use></svg> ${c.classList.contains('mobile') ? 'Desktop' : 'Mobile'}`;
    }
};

const ZipGenerator = {
    async _loadJSZip() {
        if (window.JSZip) return window.JSZip;
        await new Promise((ok, fail) => {
            const s = document.createElement('script');
            s.src = 'https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js';
            s.onload = ok; s.onerror = () => fail(new Error('JSZip indisponível (rede/CSP)'));
            document.head.appendChild(s);
        });
        if (!window.JSZip) throw new Error('JSZip não inicializou');
        return window.JSZip;
    },
    async generateZip() {
        try {
            const JSZip = await this._loadJSZip();
            const zip = new JSZip();
            const root = zip.folder("KOBLLUX_INTEGRADO");
            const msgs = (window.App && App.state && App.state.messages) || [];
            root.folder("00_CORE").file("config.json", JSON.stringify(KODUX, null, 2));
            root.folder("00_CORE").file("timestamp.txt", new Date().toISOString());
            root.folder("01_CYCLES_3x3"); root.folder("02_PARTS"); root.folder("03_REDE");
            const exp = root.folder("04_EXPORT");
            exp.file("conversa.json", JSON.stringify(msgs, null, 2));
            exp.file("conversa.md", msgs.map(m => `**${m.role}**\n\n${m.content}`).join('\n\n---\n\n'));
            const content = await zip.generateAsync({ type: "blob" });
            const sha = await this.hash(content);
            const name = `KOBLLUX_${new Date().toISOString().slice(0, 10)}.zip`;
            DownloadUtils.triggerDownload(content, name);
            return { success: true, fileName: name, sha256: sha };
        } catch (e) { return { success: false, error: e.message }; }
    },
    async hash(blob) {
        try {
            if (!(window.crypto && crypto.subtle)) return 'n/d (sem crypto.subtle)';
            const h = await crypto.subtle.digest('SHA-256', await blob.arrayBuffer());
            return Array.from(new Uint8Array(h)).map(x => x.toString(16).padStart(2, '0')).join('');
        } catch (_) { return 'n/d'; }
    }
};


const App = {
    state: { 
        open: false, 
        messages: [], 
        isAutoSolar: true, 
        solarMode: null, // <-- inicializado como null para forçar sync inicial
        isProcessing: false,
        isListening: false,
        recognition: null 
    },
    
    init() {
        const s = localStorage;
        document.getElementById('apiKeyInput').value = s.getItem(STORAGE.API_KEY) || '';
        { const r = s.getItem(STORAGE.SYSTEM_ROLE); document.getElementById('systemRoleInput').value = (r !== null ? r : (s.getItem('di_systemRole') || 'Você é Dual')); }
        
        const savedUser = s.getItem(STORAGE.USER_NAME) || 'Convidado';
        document.getElementById('inputUserId').value = savedUser;
        document.getElementById('inputModel').value = s.getItem(STORAGE.MODEL) || 'arcee-ai/trinity-mini:free';

        const savedAuto = s.getItem(STORAGE.SOLAR_AUTO);
        this.state.isAutoSolar = savedAuto === 'false' ? false : true;
        
        // remove qualquer classe de modo pré-injetada (evita mismatch visual no boot)
        document.body.classList.remove('mode-day','mode-sunset','mode-night');

        if (this.state.isAutoSolar) this.autoByTime();
        else this.setMode(s.getItem(STORAGE.SOLAR_MODE) || 'night');

        // cada passo é isolado: se um falhar (IndexedDB bloqueado, sem voz…) os BOTÕES continuam ligando
        const safe = (n, f) => { try { const r = f(); if (r && r.catch) r.catch(e => console.warn('[init:' + n + ']', (e && e.message) || e)); } catch (e) { console.warn('[init:' + n + ']', e.message); } };
        safe('css', () => this.indexedDB.loadCustomCSS());
        // background: agora gerenciado pelo painel de thumbs (di_bgImages)
        safe('voz', () => this.setupVoiceSystem());
        safe('eventos', () => this.bindEvents());
        safe('ui', () => this.updateUI());
        safe('campo', () => this.toggleField(false, true));
        safe('deck', () => this.renderDeck());
        
        setTimeout(() => {
            const h = new Date().getHours();
            let greeting = "Bem-vindo de volta";
            if (h >= 5 && h < 12) greeting = "Bom dia";
            else if (h >= 12 && h < 18) greeting = "Boa tarde";
            else greeting = "Boa noite";
            this.announce(`Dual Infodose Online. ${greeting}, ${savedUser}.`);
        }, 1200);

        // partículas: o CDN é assíncrono — tenta de novo até carregar (sem travar nada se não vier)
        let _pTry = 0;
        const _startParticles = () => {
            if (typeof particlesJS !== 'undefined') { try { particlesJS('particles-js', {particles:{number:{value:30},color:{value:"#ffffff"},opacity:{value:0.5},size:{value:2},line_linked:{enable:true,distance:150,color:"#ffffff",opacity:0.2,width:1}}}); } catch (e) {} }
            else if (_pTry++ < 30) setTimeout(_startParticles, 500);
        };
        _startParticles();
    },

    setupVoiceSystem() {
        if (!('webkitSpeechRecognition' in window)) {
            console.warn("Voz não suportada neste navegador.");
            return;
        }
        const recognition = new webkitSpeechRecognition();
        recognition.lang = 'pt-BR';
        recognition.continuous = true; 
        recognition.interimResults = true;

        recognition.onstart = () => {
            this.state.isListening = true;
            document.getElementById('btnVoice').classList.add('listening');
            this.showToast("Canal de voz aberto. Fale...");
        };
        recognition.onend = () => {
            this.state.isListening = false;
            document.getElementById('btnVoice').classList.remove('listening');
        };
        recognition.onresult = (event) => {
            let finalTranscript = '';
            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) finalTranscript += event.results[i][0].transcript;
                else finalTranscript += event.results[i][0].transcript;
            }
            document.getElementById('userInput').value = finalTranscript;
        };
        recognition.onerror = (event) => {
            console.error("Erro voz:", event.error);
            this.state.isListening = false;
            document.getElementById('btnVoice').classList.remove('listening');
            if(event.error === 'no-speech') this.showToast("Nenhum som detectado.");
        };
        this.state.recognition = recognition;
    },

    toggleVoice() {
        if (!this.state.recognition) {
            alert("Voz não suportada ou não inicializada.");
            return;
        }
        if (this.state.isListening) this.state.recognition.stop();
        else {
            document.getElementById('userInput').value = ''; 
            try { this.state.recognition.start(); } catch (e) { console.error("Erro ao iniciar voz:", e); }
        }
    },

    setupFileUpload() {
        const input = document.getElementById('fileUploadInput');
        const preview = document.getElementById('filePreview');
        document.getElementById('btnUploadFile').onclick = () => input.click();
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;
            preview.querySelector('.file-info span').textContent = `${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`;
            preview.classList.add('active');
            const actions = preview.querySelector('.file-actions');
            actions.innerHTML = '';
            const cancel = document.createElement('button'); cancel.className = 'btn-preview'; cancel.textContent = '✕';
            cancel.onclick = () => this.cancelUpload();
            const ok = document.createElement('button'); ok.className = 'btn-preview primary'; ok.textContent = 'Assimilar';
            ok.onclick = () => this.confirmUpload(file.name);
            actions.append(cancel, ok);
        };
    },

    cancelUpload() {
        document.getElementById('filePreview').classList.remove('active');
        document.getElementById('fileUploadInput').value = '';
    },

    async confirmUpload(fileName) {
        const file = document.getElementById('fileUploadInput').files[0];
        if (!file) return;
        if (!this.state.open) this.toggleField(true, true);
        const previewHTML = await Preview.renderPreview(file);
        const size = (file.size / 1024 / 1024).toFixed(2);
        this.addFileMessage(file, previewHTML, size);

        const isText = /^text\//.test(file.type) || /json|javascript|xml|html|css|csv|markdown/.test(file.type) || /\.(txt|md|json|js|css|html?|csv|xml|py|ts|yml|yaml)$/i.test(file.name);
        if (isText) {
            let content = await file.text();
            if (content.length > 60000) content = content.slice(0, 60000) + '\n[...arquivo truncado em 60.000 caracteres]';
            let fractal = null;
            try { fractal = await KoblluxCore.process(content); } catch (_) {}
            this.addMessage('system', `Memória Fractal: ${fileName}${fractal ? '\n' + fractal.log : ''}`);
            this.state.messages.push({
                role: 'user',
                content: `[ARQUIVO: ${fileName}]${fractal ? `\n[TRINITY: ${JSON.stringify(fractal.trinity)}]` : ''}\n${content}${fractal ? `\n[SELO: ${fractal.seal}]` : ''}`
            });
            this.announce("Arquivo lido e correlacionado.");
        } else {
            this.addMessage('system', `Arquivo anexado (sem leitura de texto): ${fileName}`);
        }
        this.cancelUpload();
    },

    addFileMessage(file, previewHTML, sizeMB) {
        const c = document.getElementById('chat-container');
        const d = document.createElement('div');
        d.className = 'msg-block file-msg ai';
        d.innerHTML = `<div class="file-header"><strong></strong><span class="file-meta"></span></div>${previewHTML}<div class="msg-tools"></div>`;
        d.querySelector('strong').textContent = file.name;
        d.querySelector('.file-meta').textContent = `${sizeMB} MB • ${file.type || 'arquivo'}`;
        const dl = document.createElement('button'); dl.className = 'tool-btn'; dl.textContent = '📥 Baixar';
        dl.onclick = () => DownloadUtils.triggerDownload(file, file.name);
        d.querySelector('.msg-tools').appendChild(dl);
        c.appendChild(d); c.scrollTop = c.scrollHeight;
    },

    addHTMLViewer(htmlContent) {
        const c = document.getElementById('chat-container');
        const d = document.createElement('div'); d.className = 'msg-block ai'; d.dataset.raw = htmlContent;
        d.innerHTML = `<div>HTML Gerado:</div>${Preview.createHtmlViewer(htmlContent)}<div class="msg-tools"><button class="tool-btn" onclick="Utils.copy(this)" title="Copiar"><svg><use href="#icon-copy"></use></svg></button></div>`;
        c.appendChild(d); c.scrollTop = c.scrollHeight;
    },

    speakText(text) {
        if (!text || this.state.isListening || (window.KXT_TTS && !KXT_TTS.on)) return;
        window.speechSynthesis.cancel(); 
        const u = new SpeechSynthesisUtterance(text);
        u.lang = 'pt-BR'; u.rate = 1.1; 
        window.speechSynthesis.speak(u);
    },
    announce(text, isError = false) { this.showToast(text, isError); },

    async crystallizeSession() {
        if(this.state.messages.length === 0) {
            this.announce("O vazio não pode ser cristalizado.", true);
            return;
        }
        const title = this.state.messages.find(m => m.role === 'user')?.content || "Memória Sem Nome";
        const crystal = {
            id: Date.now(),
            date: new Date().toLocaleString(),
            title: title.substring(0, 25) + (title.length>25 ? "..." : ""),
            data: [...this.state.messages]
        };
        await this.indexedDB.saveDeckItem(crystal);
        this.renderDeck();
        this.announce("Memória Cristalizada.");
        const d = document.getElementById('drawerDeck');
        if(!d.classList.contains('open')) toggleDrawer('drawerDeck');
    },

    async renderDeck() {
        const items = await this.indexedDB.getDeck();
        const container = document.getElementById('deckList');
        if(!items || items.length === 0) {
            container.innerHTML = '<div style="text-align:center; color:var(--text-muted); margin-top:20px">O vazio reina aqui.<br>Use o botão 💎 para salvar.</div>';
            return;
        }
        container.innerHTML = items.sort((a,b) => b.id - a.id).map(item => `
            <div class="deck-item">
                <div class="deck-info">
                    <h4>${item.title}</h4>
                    <span>${item.date} • ${item.data.length} msgs</span>
                </div>
                <div style="display:flex; gap:10px">
                    <button class="tool-btn" onclick="App.restoreMemory(${item.id})"><svg><use href="#icon-restore"></use></svg></button>
                    <button class="tool-btn" style="color:var(--danger)" onclick="App.deleteMemory(${item.id})"><svg><use href="#icon-trash"></use></svg></button>
                </div>
            </div>
        `).join('');
    },

    async restoreMemory(id) {
        const items = await this.indexedDB.getDeck();
        const item = items.find(i => i.id === id);
        if(item) {
            document.getElementById('chat-container').innerHTML = '';
            this.state.messages = [];
            item.data.forEach(msg => this.addMessage(msg.role === 'assistant' ? 'ai' : 'user', msg.content));
            toggleDrawer('drawerDeck');
            this.announce("Memória restaurada.");
        }
    },

    async deleteMemory(id) {
        if(!confirm("Quebrar este cristal?")) return;
        await this.indexedDB.deleteDeckItem(id);
        this.renderDeck();
        this.announce("Fragmentos dispersos.");
    },

    async handleSend() {
        const input = document.getElementById('userInput');
        const txt = input.value.trim();
        if (!txt || this.state.isProcessing) return;
        if (!this.state.open) this.toggleField(true, true);

        // ── comandos locais ──
        const cmd = txt.toLowerCase();
        if (cmd === '/atlas') {
            input.value = ''; this.addMessage('user', txt);
            let rep = "### ♾️ ATLAS KODUX\n";
            for (const [k, v] of Object.entries(KODUX.ARQUETIPOS)) rep += `- **${k}**: ${v.Essencia}\n`;
            this.addMessage('ai', rep); return;
        }
        if (cmd === '/zip') {
            input.value = ''; this.addMessage('user', txt);
            this.addMessage('system', "Gerando KOBLLUX...");
            const res = await ZipGenerator.generateZip();
            this.addMessage('system', res.success ? `✅ Pacote: ${res.fileName}\nSHA: ${res.sha256}` : `❌ Erro: ${res.error}`);
            return;
        }

        input.value = '';
        this.addMessage('user', txt);          // já entra em state.messages
        this.state.isProcessing = true;

        const footerHandle = document.getElementById('field-toggle-handle');
        const loadTxt = getRandomText(FOOTER_TEXTS.loading);
        footerHandle.innerHTML = `<span class="footer-dot pulse" style="background:var(--primary)"></span> ${loadTxt}`;
        this.speakText(loadTxt);

        const key = (localStorage.getItem(STORAGE.API_KEY) || '').trim();
        const model = (document.getElementById('inputModel').value || localStorage.getItem(STORAGE.MODEL) || 'arcee-ai/trinity-mini:free').trim();
        let system = document.getElementById('systemRoleInput').value || 'Você é Dual.';
        if (localStorage.getItem('di_kodux') !== '0' && !system.includes('KODUX')) system += KODUX.systemBlock();

        // selo KOBLLUX (UNO/SELO) — só no payload, nunca na UI/histórico
        let seal = '';
        if (localStorage.getItem('di_kobSeal') !== '0') {
            try { const f = await KoblluxCore.process(txt); seal = `\n\n[KOBLLUX]\nUNO:${f.trinity.UNO}\nSELO:${f.seal}`; }
            catch (e) { console.warn('[KOBLLUX] selo ignorado', e); }
        }
        console.log('[AI_SEND]', { model, hasKey: !!key, historico: this.state.messages.length, selo: !!seal });

        if (!key && !model.includes(':free')) {
            console.warn('[AI_SEND] modelo pago sem API key:', model);
            this.addMessage('system', "❌ API Key ausente. Configure em SYSTEM & NEURAL (card) ou no Cockpit › Neural. Para testar sem chave, use um modelo :free.");
            this.announce("Erro: API Key necessária.", true);
            this.state.isProcessing = false;
            this.toggleField(this.state.open, true);
            return;
        }

        let t0 = performance.now(), usedPayload = null;
        try {
            document.body.classList.add('loading');
            const headers = { 'Content-Type': 'application/json', 'HTTP-Referer': (location.origin && location.origin !== 'null') ? location.origin : 'https://infodose.local', 'X-Title': 'Dual Infodose' };
            if (key) headers['Authorization'] = `Bearer ${key}`;
            const hist = this.state.messages.slice(-10).map(m => ({ role: m.role, content: m.content }));
            if (seal && hist.length && hist[hist.length - 1].role === 'user') hist[hist.length - 1].content += seal;
            const payload = { model, messages: [{ role: 'system', content: system }, ...hist] };
            usedPayload = payload;
            console.log('[AI_REQ]', payload.messages.length, 'msgs →', model);

            t0 = performance.now();
            const res = await fetch('https://openrouter.ai/api/v1/chat/completions', { method: 'POST', headers, body: JSON.stringify(payload) });
            console.log('[AI_RES]', res.status, res.statusText);

            const raw = await res.text();
            let data;
            try { data = JSON.parse(raw); }
            catch (_) { throw new Error(`HTTP ${res.status}: resposta não-JSON (${raw.slice(0, 120)})`); }

            if (!res.ok || data.error) {
                console.error('[AI_ERR]', res.status, data.error || raw);
                throw new Error(`HTTP ${res.status}: ${(data.error && (data.error.message || JSON.stringify(data.error))) || 'Erro desconhecido'}`);
            }

            const aiTxt = data.choices?.[0]?.message?.content;
            if (!aiTxt || !aiTxt.trim()) {
                const reason = data.choices?.[0]?.finish_reason || 'unknown';
                console.warn('[AI_DATA] resposta vazia', data);
                this.addMessage('system', `⚠️ Resposta vazia (finish_reason: ${reason}). Verifique modelo/chave.`);
                if (window.KXT_USAGE) KXT_USAGE.record({ model, pt: KXT_USAGE.estimate(JSON.stringify(payload.messages)), ct: 0, ms: performance.now() - t0, ok: false, est: true, err: 'Resposta vazia (' + reason + ')' });
                return;
            }
            console.log('[AI_OK]', aiTxt.length, 'chars');
            if (window.KXT_USAGE) {
                const u = data.usage || {};
                const estFlag = typeof u.prompt_tokens !== 'number' || typeof u.completion_tokens !== 'number';
                KXT_USAGE.record({
                    model: data.model || model,
                    pt: typeof u.prompt_tokens === 'number' ? u.prompt_tokens : KXT_USAGE.estimate(JSON.stringify(payload.messages)),
                    ct: typeof u.completion_tokens === 'number' ? u.completion_tokens : KXT_USAGE.estimate(aiTxt),
                    ms: performance.now() - t0, ok: true, est: estFlag, cost: typeof u.cost === 'number' ? u.cost : null
                });
            }

            // HTML puro → visualizador (Preview / Código / Tela cheia / Mobile)
            if (/^\s*(<!doctype html|<html)/i.test(aiTxt)) {
                this.addHTMLViewer(aiTxt);
                this.state.messages.push({ role: 'assistant', content: aiTxt });
            } else {
                this.addMessage('ai', aiTxt);
            }
        } catch (e) {
            console.error('[AI_CATCH]', e);
            if (window.KXT_USAGE) KXT_USAGE.record({ model, pt: usedPayload ? KXT_USAGE.estimate(JSON.stringify(usedPayload.messages)) : 0, ct: 0, ms: performance.now() - t0, ok: false, est: true, err: e.message });
            this.announce("Falha na conexão.", true);
            this.addMessage('system', `Erro: ${e.message}`);
        } finally {
            document.body.classList.remove('loading');
            this.state.isProcessing = false;
            this.toggleField(this.state.open, true);
        }
    },

    // --- NOVA FUNÇÃO ADDMESSAGE (com suporte a dataset.raw e ícones SVG)
    addMessage(role, text) {
        const c = document.getElementById('chat-container');
        const d = document.createElement('div');
        d.className = `msg-block ${role}`;
        d.dataset.raw = text || '';

        let html = role === 'ai' ? (window.marked && marked.parse ? marked.parse(text) : KXT_md(text)) : text.replace(/\n/g, '<br>');
        
        if(role !== 'system') {
            html += `<div class="msg-tools">
                <button class="tool-btn" onclick="Utils.copy(this)" title="Copiar"><svg><use href="#icon-copy"></use></svg></button>
                <button class="tool-btn" onclick="Utils.speak(this)" title="Ouvir"><svg><use href="#icon-mic"></use></svg></button>
                ${role === 'user' ? `<button class="tool-btn" onclick="Utils.edit(this)" title="Editar"><svg><use href="#icon-edit"></use></svg></button>` : ''}
                ${role === 'ai' ? `
                  <button class="tool-btn" onclick="DownloadUtils.downloadMessage(this)" title="Download bruto"><svg><use href="#icon-download"></use></svg></button>
                  <button class="tool-btn" onclick="DownloadUtils.openSandbox(this)" title="Abrir sandbox"><svg><use href="#icon-sandbox"></use></svg></button>
                  <button class="tool-btn" onclick="DownloadUtils.exportPdf(this)" title="Exportar PDF"><svg><use href="#icon-pdf"></use></svg></button>
                  <button class="tool-btn" onclick="DownloadUtils.downloadMarkdown(this)" title="Salvar como .md"><svg><use href="#icon-md"></use></svg></button>
                ` : ''}
            </div>`;
            this.state.messages.push({ role: role==='ai'?'assistant':'user', content: text });
        }
        
        d.innerHTML = html;
        
        if (role === 'ai') {
            const codeBlocks = d.querySelectorAll('pre');
            codeBlocks.forEach(pre => {
                const btn = document.createElement('button');
                btn.className = 'copy-code-btn';
                btn.textContent = 'Copiar Código';
                btn.onclick = (e) => {
                    e.stopPropagation();
                    const code = pre.querySelector('code').innerText;
                    navigator.clipboard.writeText(code);
                    btn.textContent = 'Copiado!';
                    btn.style.color = '#00ff00';
                    setTimeout(() => { btn.textContent = 'Copiar Código'; btn.style.color = ''; }, 2000);
                };
                pre.appendChild(btn);
                const codeEl = pre.querySelector('code');
                const src = codeEl ? codeEl.innerText : '';
                if (codeEl && (/language-html?\b/.test(codeEl.className) || /^\s*(<!doctype html|<html)/i.test(src))) {
                    const vb = document.createElement('button');
                    vb.className = 'view-code-btn'; vb.textContent = '▶ Visualizar';
                    vb.onclick = (e) => {
                        e.stopPropagation();
                        const next = pre.nextElementSibling;
                        if (next && next.classList.contains('html-viewer')) { next.remove(); vb.textContent = '▶ Visualizar'; return; }
                        pre.insertAdjacentHTML('afterend', Preview.createHtmlViewer(src));
                        vb.textContent = '■ Fechar';
                    };
                    pre.appendChild(vb);
                }
            });
        }
        
        c.appendChild(d);
        c.scrollTop = c.scrollHeight;
    },

    setMode(mode) {
        this.state.solarMode = mode;
        document.body.classList.remove('mode-day', 'mode-sunset', 'mode-night');
        document.body.classList.add(`mode-${mode}`);
        localStorage.setItem(STORAGE.SOLAR_MODE, mode);
        // sincroniza camadas visuais (sol, partículas, background)
        this.syncVisuals(mode);
        this.updateUI();
    },

    // centraliza ajustes visuais para evitar duplicação
    syncVisuals(mode) {
        const sun = document.querySelector('.sun-background');
        const particles = document.getElementById('particles-js');
        const bg = document.getElementById('bg-fake-custom');
        if (sun) {
            if (mode === 'day') sun.style.opacity = '0.5';
            else if (mode === 'sunset') sun.style.opacity = '0.4';
            else sun.style.opacity = '0';
        }
        if (particles) {
            if (mode === 'day') particles.style.opacity = '0.1';
            else particles.style.opacity = '0.3';
        }
        if (bg) {
            if (mode === 'day') bg.style.opacity = '0.15';
            else bg.style.opacity = '0.2';
        }
    },
    
    cycleSolar() {
        this.state.isAutoSolar = false;
        localStorage.setItem(STORAGE.SOLAR_AUTO, 'false');
        if (this.state.solarMode === 'day') this.setMode('sunset');
        else if (this.state.solarMode === 'sunset') this.setMode('night');
        else this.setMode('day');
        this.announce(`Modo ${this.translateMode(this.state.solarMode)}`);
    },

    enableAutoSolar() {
        this.state.isAutoSolar = true;
        localStorage.setItem(STORAGE.SOLAR_AUTO, 'true');
        this.autoByTime();
        this.announce("Sincronização Automática.");
    },

    autoByTime() {
        if (!this.state.isAutoSolar) return;
        const h = new Date().getHours();
        let m = 'night';
        if (h >= 6 && h < 17) m = 'day';
        else if (h >= 17 && h < 19) m = 'sunset';
        else m = 'night';

        // sempre aplica o modo (corrige mismatch entre state e classe do body)
        this.setMode(m);
    },

    translateMode(m) {
        if(m==='day') return 'DIA';
        if(m==='sunset') return 'OCASO';
        return 'NOITE';
    },

    toggleField(forceState, silent = false) {
        const isOpen = forceState !== undefined ? forceState : !this.state.open;
        this.state.open = isOpen;
        
        const chat = document.getElementById('chat-container');
        chat.classList.toggle('collapsed', !isOpen);
        document.body.classList.toggle('field-closed', !isOpen);
        
        if (this.state.isProcessing) return;

        const msgs = this.state.messages.length;
        const type = isOpen ? (msgs > 5 ? 'estavel' : 'sustentado') : (msgs > 5 ? 'tecnico' : 'ritual');
        const text = getRandomText(FOOTER_TEXTS[isOpen ? 'open' : 'closed'][type]);
        
        const handle = document.getElementById('field-toggle-handle');
        handle.innerHTML = `<span class="footer-dot"></span> ${text}`;
        
        if (!silent) this.speakText(text);
        if (isOpen) chat.scrollTop = chat.scrollHeight;
    },

    updateUI() {
        const m = this.state.solarMode;
        const auto = this.state.isAutoSolar;
        const label = document.getElementById('statusSolarMode');
        const ind = document.getElementById('modeIndicator');
        const btnAuto = document.getElementById('btnAutoSolar');
        
        label.textContent = `${this.translateMode(m)} ${auto ? '(AUTO)' : '(MANUAL)'}`;
        label.style.color = auto ? 'var(--primary)' : 'orange';
        ind.textContent = `SISTEMA: ${this.translateMode(m)} // ${auto ? 'SYNC' : 'OVERRIDE'}`;
        btnAuto.style.opacity = auto ? '1' : '0.5';
        document.getElementById('usernameDisplay').textContent = localStorage.getItem(STORAGE.USER_NAME) || document.getElementById('inputUserId').value || 'Convidado';
    },

    bindEvents() {
        document.getElementById('btnSend').onclick = () => this.handleSend();
        document.getElementById('userInput').onkeypress = (e) => { if(e.key==='Enter') this.handleSend(); };
        document.getElementById('field-toggle-handle').onclick = () => this.toggleField(undefined, false);
        this.bindOrbGestures();
        document.getElementById('btnCrystallize').onclick = () => this.crystallizeSession();
        document.getElementById('btnCycleSolar').onclick = () => this.cycleSolar();
        document.getElementById('btnAutoSolar').onclick = () => { this.enableAutoSolar(); this.updateUI(); };
        
        document.getElementById('inputUserId').onchange = (e) => {
            localStorage.setItem(STORAGE.USER_NAME, e.target.value);
            this.updateUI();
            this.announce(`Identidade redefinida: ${e.target.value}`);
        };

        document.getElementById('inputModel').onchange = (e) => {
            localStorage.setItem(STORAGE.MODEL, e.target.value);
            this.updateUI();
            this.showToast("Modelo Atualizado");
        };

        document.getElementById('btnSaveConfig').onclick = () => {
            if (window.di_saveNeural) window.di_saveNeural();
            this.indexedDB.saveCustomCSS(document.getElementById('customCssInput').value);
            this.announce("Configurações salvas.");
        };

        document.getElementById('btnSettings').onclick = () => window.openCockpit('neural');   // menu único: Cockpit › Neural
        document.getElementById('btnDeck').onclick = () => toggleDrawer('drawerDeck');
        document.getElementById('btnClearCss').onclick = () => this.indexedDB.clearAsset(STORAGE.CUSTOM_CSS);
        document.getElementById('btnVoice').onclick = () => this.toggleVoice();
        
        this.setupFileUpload();
    },

    bindOrbGestures() {
        const orb = document.getElementById('orbToggle');
        let timer = null, moved = false, fired = false;
        const clear = () => { if (timer) { clearTimeout(timer); timer = null; } };
        orb.addEventListener('pointerdown', () => {
            moved = false; fired = false; clear();
            timer = setTimeout(() => {
                timer = null; fired = true;
                toggleDrawer('drawerProfile');
                this.speakText("Cockpit Solar");
            }, 420);
        }, { passive: true });
        orb.addEventListener('pointermove', () => { moved = true; clear(); }, { passive: true });
        orb.addEventListener('pointerup', () => {
            const wasPending = !!timer; clear();
            if (wasPending && !moved && !fired) this.cycleSolar();   // toque rápido
        }, { passive: true });
        orb.addEventListener('pointercancel', clear, { passive: true });
        orb.addEventListener('contextmenu', (e) => e.preventDefault());
    },

    showToast(msg, isError = false) {
        const t = document.getElementById('nv-toast');
        t.textContent = msg; 
        t.style.borderLeft = isError ? '4px solid #ff4444' : '4px solid var(--primary)';
        t.classList.add('show');
        setTimeout(() => t.classList.remove('show'), 3000);
        this.speakText(msg);
    },

    indexedDB: {
        dbName: "InfodoseDB",
        async getDB() {
            return new Promise((res, rej) => {
                const r = indexedDB.open("InfodoseDB", 2);
                r.onupgradeneeded = e => {
                    const db = e.target.result;
                    if(!db.objectStoreNames.contains('assets')) db.createObjectStore('assets', {keyPath: 'id'});
                    if(!db.objectStoreNames.contains('deck')) db.createObjectStore('deck', {keyPath: 'id'});
                };
                r.onsuccess = e => res(e.target.result);
                r.onerror = e => rej(e);
            });
        },
        async putAsset(id, data) { const db = await this.getDB(); db.transaction(['assets'],'readwrite').objectStore('assets').put({id, ...data}); },
        async getAsset(id) { const db = await this.getDB(); return new Promise(r => { const q = db.transaction(['assets'],'readonly').objectStore('assets').get(id); q.onsuccess = () => r(q.result); }); },
        async clearAsset(id) { 
            const db = await this.getDB(); db.transaction(['assets'],'readwrite').objectStore('assets').delete(id);
            if(id === STORAGE.CUSTOM_CSS) { document.getElementById('custom-styles').textContent = ''; document.getElementById('customCssInput').value = ''; }
            if(id === STORAGE.BG_IMAGE) { document.getElementById('bg-fake-custom').style.backgroundImage = 'none'; document.getElementById('bgStatusText').textContent = 'Nenhum'; }
        },
        async handleBackgroundUpload(file) {
            if(!file) return;
            await this.putAsset(STORAGE.BG_IMAGE, {blob: file});
            this.loadBackground();
        },
        async loadBackground() {
            const d = await this.getAsset(STORAGE.BG_IMAGE);
            if(d && d.blob) {
                document.getElementById('bg-fake-custom').style.backgroundImage = `url('${URL.createObjectURL(d.blob)}')`;
                document.getElementById('bgStatusText').textContent = 'Ativo';
            }
        },
        async saveCustomCSS(css) { await this.putAsset(STORAGE.CUSTOM_CSS, {css}); this.loadCustomCSS(); },
        async loadCustomCSS() { 
            const d = await this.getAsset(STORAGE.CUSTOM_CSS); 
            if(d?.css) {
                document.getElementById('custom-styles').textContent = d.css;
                document.getElementById('customCssInput').value = d.css;
            }
        },
        async saveDeckItem(item) { const db = await this.getDB(); db.transaction(['deck'],'readwrite').objectStore('deck').put(item); },
        async getDeck() { const db = await this.getDB(); return new Promise(r => { const q = db.transaction(['deck'],'readonly').objectStore('deck').getAll(); q.onsuccess = () => r(q.result); }); },
        async deleteDeckItem(id) { const db = await this.getDB(); db.transaction(['deck'],'readwrite').objectStore('deck').delete(id); }
    }
};

const Utils = {
    copy(btn) { navigator.clipboard.writeText(btn.closest('.msg-block').innerText); App.showToast("Copiado para a área de transferência"); },
    speak(btn) { App.speakText(btn.closest('.msg-block').innerText.replace(/<[^>]*>?/gm, '')); },
    edit(btn) {
        const blk = btn.closest('.msg-block'); 
        const txt = blk.innerText.replace("content_copy", "").trim(); 
        document.getElementById('userInput').value = txt;
        blk.remove();
        App.speakText("Modo edição ativado");
    }
};

// --- DOWNLOAD UTILS ATUALIZADO (SVG + PDF SCALE + MARKDOWN) ---
const DownloadUtils = {
  _getBlock(btn) { return btn.closest('.msg-block'); },

  _getCleanHtml(block) {
    const clone = block.cloneNode(true);
    const tools = clone.querySelector('.msg-tools');
    if (tools) tools.remove();
    return clone.innerHTML;
  },

  _guessFilename(base, extFallback='txt') {
    const t = new Date().toISOString().replace(/[:.]/g,'-');
    if (!base) return `ai-output-${t}.${extFallback}`;
    if (/<\s*!doctype|<html|<body|<head/i.test(base)) return `ai-output-${t}.html`;
    if (/<pre|<code/i.test(base)) return `ai-code-${t}.${extFallback}`;
    return `ai-output-${t}.${extFallback}`;
  },

  triggerDownload(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = filename;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  },

  downloadMessage(btn) {
    try {
      const block = this._getBlock(btn);
      if(!block) return;
      const content = this._getCleanHtml(block);
      const isHTML = /<\s*!doctype|<html|<body|<head|<\/div>/i.test(content);
      const mime = isHTML ? 'text/html' : 'text/plain';
      const ext = isHTML ? 'html' : 'txt';
      const filename = this._guessFilename(content, ext);
      const blob = new Blob([content], { type: mime + ';charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = filename;
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 2000);
      App.showToast(`Download iniciado: ${filename}`);
    } catch (e) {
      console.error(e);
      App.showToast('Erro ao gerar download', true);
    }
  },

  downloadMarkdown(btn) {
    try {
      const block = this._getBlock(btn);
      if(!block) return;
      const raw = block.dataset.raw || block.innerText || '';
      const filename = this._guessFilename(raw, 'md').replace(/\.(html|txt)$/, '.md');
      const blob = new Blob([raw], { type: 'text/markdown;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = filename;
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 2000);
      App.showToast(`Markdown salvo: ${filename}`);
    } catch (e) {
      console.error(e);
      App.showToast('Erro ao salvar .md', true);
    }
  },

  openSandbox(btn) {
    try {
      const block = this._getBlock(btn);
      if(!block) return;
      const content = this._getCleanHtml(block);
      let page = content;
      if(!/<\s*!doctype|<html/i.test(content)) {
        page = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Sandbox - AI Output</title></head><body>${content}</body></html>`;
      }
      const blob = new Blob([page], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
      App.showToast('Sandbox aberto em nova aba');
    } catch (e) {
      console.error(e);
      App.showToast('Erro ao abrir sandbox', true);
    }
  },

  async exportPdf(btn) {
    try {
      if(typeof html2pdf === 'undefined') {
        App.showToast('Biblioteca PDF indisponível. Abrindo sandbox...', true);
        return this.openSandbox(btn);
      }
      const block = this._getBlock(btn);
      if(!block) return;
      const content = this._getCleanHtml(block);

      const container = document.createElement('div');
      container.style.position = 'fixed'; container.style.left = '-9999px'; container.style.top = '0';
      container.style.width = '1100px'; container.style.padding = '20px'; container.style.background = '#ffffff';
      container.innerHTML = content;
      document.body.appendChild(container);

      const orientation = (container.scrollWidth > container.scrollHeight) ? 'landscape' : 'portrait';
      const filename = this._guessFilename(content, 'pdf').replace(/\.(html|txt)$/, '.pdf');

      await html2pdf().from(container).set({
        margin: [12, 12, 12, 12],
        filename: filename,
        html2canvas: { scale: 3, useCORS: true, logging: false },
        jsPDF: { unit: 'pt', format: 'a4', orientation: orientation }
      }).save();

      document.body.removeChild(container);
      App.showToast(`PDF gerado: ${filename}`);
    } catch (e) {
      console.error(e);
      App.showToast('Falha ao gerar PDF. Abrindo sandbox...', true);
      this.openSandbox(btn);
    }
  }
};

function toggleDrawer(id) { document.getElementById(id).classList.toggle('open'); }
window.App = App;   // `const App` não vira window.App — vários módulos usam window.App
KXT_ready(() => App.init());   // DOM pronto (não espera fonte/CDN como o window.onload)
