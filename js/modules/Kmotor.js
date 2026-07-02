  // Matriz de 41 Arquétipos unificada[span_1](start_span)[span_1](end_span)
        const ARCHETYPES = [
            "atlas","nova","vitalis","pulse","kaos","kodux","lumine",
            "aion","kobllux","artemis","serena","genus","solus",
            "rhea","uno","dual","trinity","infodose","horus","bllue",
            "velor","elya","sylon","naira","thenir","eloh","novael",
            "aelya","ignyra","lumara","kaythar","sylla","anamyx",
            "yamantek","metalux","kd1","koφd1","christos",
            "aek_dion","aekael_domnnus","nephesh_elyon"
        ];

        // Perfis de Voz Customizados para o sintetizador[span_2](start_span)[span_2](end_span)
        const ARCH_TTS_PROFILES = {
            atlas: { rate: 0.92, pitch: 0.45 },
            nova: { rate: 1.12, pitch: 0.75 },
            kobllux: { rate: 0.98, pitch: 0.50 },
            kodux: { rate: 1.02, pitch: 0.60 },
            artemis: { rate: 1.04, pitch: 0.65 },
            uno: { rate: 1.00, pitch: 0.50 }
        };

        class MotorMonolith {
            constructor() {
                this.dbName = 'motor78k_db';
                this.storeName = 'document_chunks';
                this.db = null;
                
                this.activeArch = 'atlas';
                this.engineStep = 1;
                this.jumpStep = 0;
                this.phiFlux = 0.50;
                
                this.mergedText = "";
                this.ttsChunks = [];
                this.currentTtsIdx = 0;
                this.isPaused = false;
            }

            async init() {
                return new Promise((resolve, reject) => {
                    const req = indexedDB.open(this.dbName, 1);
                    req.onupgradeneeded = e => {
                        const db = e.target.result;
                        if (!db.objectStoreNames.contains(this.storeName)) {
                            db.createObjectStore(this.storeName, { keyPath: 'id', autoIncrement: true });
                        }
                    };
                    req.onsuccess = e => { this.db = e.target.result; resolve(); };
                    req.onerror = e => reject(e.target.error);
                });
            }

            // Indexação de Arquivos na Base Semântica Local
            async processFile(file) {
                const text = await file.text();
                const chunks = this.generateChunks(text);
                const tx = this.db.transaction([this.storeName], 'readwrite');
                const store = tx.objectStore(this.storeName);
                chunks.forEach(chunk => store.put({ fonte: file.name, texto: chunk, ts: Date.now() }));
                return new Promise(res => tx.oncomplete = () => res(chunks.length));
            }

            generateChunks(text, size = 300, overlap = 60) {
                const words = text.split(/\s+/);
                const chunks = [];
                for (let i = 0; i < words.length; i += (size - overlap)) {
                    const chunk = words.slice(i, i + size).join(' ').trim();
                    if (chunk.length > 5) chunks.push(chunk);
                }
                return chunks;
            }

            async queryContext(query) {
                const terms = query.toLowerCase().match(/\w+/g) || [];
                if (!terms.length) return [];
                const tx = this.db.transaction([this.storeName], 'readonly');
                const store = tx.objectStore(this.storeName);
                const all = await store.getAll();
                return all.map(c => ({
                    ...c,
                    score: terms.filter(t => c.texto.toLowerCase().includes(t)).length
                })).filter(r => r.score > 0).sort((a,b) => b.score - a.score).slice(0, 3);
            }

            // Algoritmo Iterativo de Interleaving 3-6-9 Dinâmico[span_3](start_span)[span_3](end_span)
            integrateFractals(t1, t2) {
                const parseSentences = t => (t.replace(/\n+/g, ' ').match(/[^.!?]+[.!?]+|[^.!?]+$/g) || []).map(s => s.trim()).filter(Boolean);
                const s1 = parseSentences(t1);
                const s2 = parseSentences(t2);
                const maxLen = Math.max(s1.length, s2.length);
                const combined = [];

                for (let i = 0; i < maxLen; i++) {
                    // ECL-1: Desvio estocástico regulado pelo nível do Fluxo Φ[span_4](start_span)[span_4](end_span)
                    if (Math.random() < this.phiFlux) {
                        if (Math.random() < 0.5 && s1[i]) combined.push({ text: s1[i], src: 'Polo Alfa' });
                        else if (s2[i]) combined.push({ text: s2[i], src: 'Polo Beta' });
                    } else {
                        // Modo Determinístico padrão baseado em Ciclos Recorrentes[span_5](start_span)[span_5](end_span)
                        const cycle = i % 9;
                        if (cycle < 3) {
                            if (s1[i]) combined.push({ text: s1[i], src: 'Alfa' });
                            if (s2[i]) combined.push({ text: s2[i], src: 'Beta' });
                        } else {
                            if (s2[i]) combined.push({ text: s2[i], src: 'Beta' });
                            if (s1[i]) combined.push({ text: s1[i], src: 'Alfa' });
                        }
                    }
                }

                // Distribuição de Sequência Circular baseada em di_getSequence()[span_6](start_span)[span_6](end_span)
                let currentIdx = ARCHETYPES.indexOf(this.activeArch);
                if (currentIdx < 0) currentIdx = 0;

                const processedBlocks = combined.map((item, index) => {
                    const arch = ARCHETYPES[currentIdx];
                    currentIdx = (currentIdx + this.engineStep + this.jumpStep) % ARCHETYPES.length;
                    return { arch, text: item.text, source: item.src };
                });

                this.mergedText = processedBlocks.map(b => `[${b.arch.toUpperCase()}] — ${b.text}`).join('\n\n');
                return processedBlocks;
            }

            // Motor TTS Integrado
            speakCurrentChunk() {
                if (this.currentTtsIdx >= this.ttsChunks.length) {
                    this.stopSpeech();
                    return;
                }
                
                speechSynthesis.cancel();
                const chunk = this.ttsChunks[this.currentTtsIdx];
                const u = new SpeechSynthesisUtterance(chunk.text);
                u.lang = 'pt-BR';
                
                const profile = ARCH_TTS_PROFILES[chunk.arch] || { rate: 1.0, pitch: 0.5 };
                u.rate = profile.rate;
                u.pitch = profile.pitch;

                document.getElementById('dock-title').textContent = chunk.text;
                document.getElementById('dock-meta').textContent = `Voz: ${chunk.arch.toUpperCase()} (${this.currentTtsIdx+1}/${this.ttsChunks.length})`;

                u.onend = () => {
                    this.currentTtsIdx++;
                    this.speakCurrentChunk();
                };

                speechSynthesis.speak(u);
            }

            stopSpeech() {
                speechSynthesis.cancel();
                this.isPaused = false;
                document.getElementById('btn-play').textContent = '▶';
                document.getElementById('dock-title').textContent = 'Standby · Execução Encerrada';
            }
        }

        // Instanciação e Amarrações de Interface (UI Hooks)
        const core = new MotorMonolith();

        window.addEventListener('DOMContentLoaded', async () => {
            await core.init();
            renderArchGrid();
            await updateLibraryUI();
        });

        // Controle da Gaveta (Mobile Drawer)
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('overlay');
        function toggleDrawer() {
            sidebar.classList.toggle('open');
            overlay.classList.toggle('show');
        }
        document.getElementById('menu-btn').onclick = toggleDrawer;
        overlay.onclick = toggleDrawer;

        // Comutador de Abas Internas (Tabs System)
        document.querySelectorAll('.tab-link').forEach(btn => {
            btn.onclick = () => {
                document.querySelectorAll('.tab-link').forEach(b => b.classList.remove('active'));
                document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
                btn.classList.add('active');
                document.getElementById(`tab-${btn.dataset.tab}`).classList.add('active');
            };
        });

        // Renderizador da Grade de Arquétipos[span_7](start_span)[span_7](end_span)
        function renderArchGrid() {
            const grid = document.getElementById('arch-grid');
            grid.innerHTML = ARCHETYPES.map(arch => `
                <div class="arch-mini-btn ${arch === core.activeArch ? 'active' : ''}" data-id="${arch}">
                    ${arch.toUpperCase()}
                </div>
            `).join('');

            document.querySelectorAll('.arch-mini-btn').forEach(b => {
                b.onclick = () => {
                    document.querySelectorAll('.arch-mini-btn').forEach(x => x.classList.remove('active'));
                    b.classList.add('active');
                    core.activeArch = b.dataset.id;
                    document.getElementById('dock-meta').textContent = `Arquétipo Ativo: ${core.activeArch.toUpperCase()}`;
                };
            });
        }

        // Atualização da UI do Banco Local
        async function updateLibraryUI() {
            const tx = core.db.transaction([core.storeName], 'readonly');
            const store = tx.objectStore(core.storeName);
            const chunks = await store.getAll();
            
            const map = {};
            chunks.forEach(c => map[c.fonte] = (map[c.fonte] || 0) + 1);
            
            const list = document.getElementById('compiled-files');
            list.innerHTML = '';
            let count = 0;
            for(const [name, qty] of Object.entries(map)) {
                count++;
                list.innerHTML += `
                    <li class="file-item">
                        <span style="overflow:hidden; text-overflow:ellipsis; white-space:nowrap; max-width:180px;">${name} (${qty})</span>
                    </li>
                `;
            }
            document.getElementById('file-count').textContent = count;
        }

        // Upload e Ingestão de Documentos
        document.getElementById('file-input').onchange = async (e) => {
            if (!e.target.files.length) return;
            document.getElementById('engine-status').textContent = "Indexando...";
            for (const file of e.target.files) {
                await core.processFile(file);
            }
            await updateLibraryUI();
            document.getElementById('engine-status').textContent = "Index: Online OK";
            e.target.value = '';
            toggleDrawer();
        };

        // Parametria do Motor 3-6-9
        document.querySelectorAll('[data-engine]').forEach(b => {
            b.onclick = () => {
                document.querySelectorAll('[data-engine]').forEach(x => x.classList.remove('is-active'));
                b.classList.add('is-active');
                core.engineStep = parseInt(b.dataset.engine);
            };
        });

        document.querySelectorAll('[data-jump]').forEach(b => {
            b.onclick = () => {
                document.querySelectorAll('[data-jump]').forEach(x => x.classList.remove('is-active'));
                b.classList.add('is-active');
                core.jumpStep = parseInt(b.dataset.jump);
            };
        });

        // Trigger de Integração Fractal
        document.getElementById('btn-merge').onclick = () => {
            const t1 = document.getElementById('t1').value.trim();
            const t2 = document.getElementById('t2').value.trim();
            if (!t1 || !t2) return alert("Preencha ambos os polos de texto para mesclar.");

            document.getElementById('engine-status').textContent = "Fundindo...";
            const blocks = core.integrateFractals(t1, t2);
            
            // Renderização dos resultados na UI
            const out = document.getElementById('fusor-output');
            out.innerHTML = blocks.map(b => `
                <div class="fractal-block" style="border-left: 2px solid var(--accent-purple)">
                    <div class="fractal-meta">
                        <span style="color: var(--accent-glow)">⬡ ${b.arch.toUpperCase()}</span>
                        <span style="color: var(--text-muted)">• ${b.source}</span>
                    </div>
                    <div>${b.text}</div>
                </div>
            `).join('');

            // Popula os chunks para áudio (TTS)
            core.ttsChunks = blocks;
            core.currentTtsIdx = 0;
            
            // Recalcula o Fluxo baseado no rendimento da operação
            core.phiFlux = Math.min(1.0, Math.max(0.0, core.phiFlux + (blocks.length * 0.01) - 0.05));
            document.getElementById('phi-fill').style.width = `${core.phiFlux * 100}%`;
            document.getElementById('phi-val').textContent = core.phiFlux.toFixed(2);

            document.getElementById('engine-status').textContent = "Index: Online OK";
            document.getElementById('dock-title').textContent = `Fusão Concluída: ${blocks.length} fragmentos gerados.`;
        };

        // Mecânica de Chat Semântico (RAG Local)
        async function runChat() {
            const input = document.getElementById('chat-input');
            const q = input.value.trim();
            if (!q) return;

            appendMsg('user', q);
            input.value = '';

            document.getElementById('engine-status').textContent = "Buscando base...";
            const ctx = await core.queryContext(q);
            
            let reply = "";
            if (ctx.length) {
                reply = `[${core.activeArch.toUpperCase()} RAG BASE] Encontrei as seguintes correlações diretas no banco de dados local:\n\n` + 
                        ctx.map(c => `• "...${c.texto}..." (Fonte: ${c.fonte})`).join('\n\n');
            } else {
                reply = `[SYSTEM FALLBACK] Nenhum chunk semântico correspondente foi localizado no IndexedDB. Tente carregar mais arquivos na gaveta lateral.`;
            }

            appendMsg('system', reply);
            document.getElementById('engine-status').textContent = "Index: Online OK";
        }

        document.getElementById('send-btn').onclick = runChat;
        document.getElementById('chat-input').onkeydown = e => { if (e.key === 'Enter') runChat(); };

        function appendMsg(sender, text) {
            const out = document.getElementById('chat-output');
            const div = document.createElement('div');
            div.className = `message ${sender}`;
            div.innerHTML = `<div>${text.replace(/\n/g, '<br>')}</div><div class="message-meta">${new Date().toLocaleTimeString()}</div>`;
            out.appendChild(div);
            out.scrollTop = out.scrollHeight;
        }

        // Eventos do Dock Reprodutor (TTS)
        document.getElementById('btn-play').onclick = () => {
            if (!core.ttsChunks.length) return alert("Gere uma fusão na aba anterior para habilitar a fila de áudio.");
            
            if (speechSynthesis.speaking && !core.isPaused) {
                speechSynthesis.pause();
                core.isPaused = true;
                document.getElementById('btn-play').textContent = '▶';
            } else if (core.isPaused) {
                speechSynthesis.resume();
                core.isPaused = false;
                document.getElementById('btn-play').textContent = '⏸';
            } else {
                document.getElementById('btn-play').textContent = '⏸';
                core.speakCurrentChunk();
            }
        };

        document.getElementById('btn-stop').onclick = () => core.stopSpeech();
        document.getElementById('btn-prev').onclick = () => {
            if (core.currentTtsIdx > 0) {
                core.currentTtsIdx--;
                core.speakCurrentChunk();
            }
        };

        // Reset Total
        document.getElementById('clear-db-btn').onclick = async () => {
            if (confirm("Deseja expurgar permanentemente todos os registros do IndexedDB local?")) {
                const tx = core.db.transaction([core.storeName], 'readwrite');
                await tx.objectStore(core.storeName).clear();
                await updateLibraryUI();
                alert("Banco local reiniciado.");
                toggleDrawer();
            }
        };
