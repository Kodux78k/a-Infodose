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
        
        
        class Motor78K {
            constructor() {
                this.dbName = 'motor78k_db';
                this.storeName = 'document_chunks';
                this.db = null;
                
                this.arquetipos = {
                    Atlas: {
                        prefixo: '• [Mapeamento Atlas] Estrutura e Próximos Passos:\n',
                        formatar: (trechos) => "Com base nas suas fontes, organizei a seguinte estrutura de tópicos:\n\n" + trechos.map(t => `- ${t.texto} (Origem: ${t.fonte})`).join('\n')
                    },
                    Nova: {
                        prefixo: '✦ [Conexão Nova] Insights e Expansão de Ideias:\n',
                        formatar: (trechos) => "Cruzando os dados informados, podemos projetar caminhos alternativos:\n\n" + trechos.map(t => `> Proposta associada a [${t.fonte}]: "${t.texto}"`).join('\n\n')
                    },
                    Artemis: {
                        prefixo: '✕ [Inquirição Artemis] Análise de Consistência e Limitações:\n',
                        formatar: (trechos) => "Avaliando criticamente os trechos retornados para encontrar pontos cegos:\n\n" + trechos.map(t => `? O que valida a premissa em [${t.fonte}]: "${t.texto}"?`).join('\n\n')
                    },
                    Uno: {
                        prefixo: '⌾ [Síntese Uno] Resumo Executivo e Essência:\n',
                        formatar: (trechos) => "Sintetizando o núcleo das informações coletadas em um único fluxo:\n\n" + trechos.map(t => t.texto).join(' ')
                    }
                };
                
                this.arquetipoAtivo = 'Atlas';
                
                // Regras Avançadas do Mecanismo ELIZA (Regex e Respostas Reflexivas em PT-BR)
                this.elizaRules = [
                    { pattern: /estou (.+)/i, replies: ["Por que você se sente $1?", "O que na sua arquitetura mental causou esse estado de $1?", "Se voltarmos um passo atrás, o que disparou isso?"] },
                    { pattern: /preciso (.+)/i, replies: ["O que obter $1 traria de concreto para o seu projeto?", "Como a falta de $1 está limitando seus testes?", "Qual o caminho mais rápido para suprir essa necessidade?"] },
                    { pattern: /por que (.+)/i, replies: ["Quais hipóteses você tem para $1?", "A resposta para $1 mudaria a forma como você estrutura seu código?", "O que o seu instinto diz sobre isso?"] },
                    { pattern: /não consigo (.+)/i, replies: ["O que está agindo como o principal gargalo para $1?", "Se dividirmos $1 em 3 sub-tarefas simples, qual seria a primeira?", "Isso é uma limitação técnica ou de modelagem conceitual?"] },
                    { pattern: /projeto (.+)/i, replies: ["Fale mais sobre a arquitetura estrutural do seu projeto.", "Como você descreveria o fluxo central dele para um observador externo?", "Quais os marcos fundamentais que determinam o sucesso dele?"] },
                    { pattern: /erro|falha|problema/i, replies: ["Erros e falhas costumam mapear com precisão as bordas do sistema. Onde o fluxo quebra?", "Como podemos transformar essa inconsistência em uma regra de validação robusta?"] }
                ];
                
                this.elizaFallbacks = [
                    "Isso é intrigante. Como esse ponto se conecta ao quadro geral do seu desenvolvimento?",
                    "Interessante. Você está visualizando isso mais como uma questão de infraestrutura ou de fluxo lógico?",
                    "Fale um pouco mais sobre os desdobramentos práticos dessa linha de raciocínio.",
                    "Se você tivesse que explicar esse exato conceito para si mesmo daqui a um ano, o que mudaria?"
                ];
            }

            // Inicialização do Storage Seguro via IndexedDB
            async init() {
                return new Promise((resolve, reject) => {
                    const request = indexedDB.open(this.dbName, 1);
                    
                    request.onupgradeneeded = (event) => {
                        const db = event.target.result;
                        if (!db.objectStoreNames.contains(this.storeName)) {
                            db.createObjectStore(this.storeName, { keyPath: 'id', autoIncrement: true });
                        }
                    };

                    request.onsuccess = (event) => {
                        this.db = event.target.result;
                        resolve();
                    };

                    request.onerror = (event) => reject(event.target.error);
                });
            }

            // Processamento, Parsing e Chonking de Entradas de Arquivos
            async processarArquivo(file) {
                const extensao = file.name.split('.').pop().toLowerCase();
                const textoBruto = await file.text();
                let textoLimpo = '';

                // Módulos de Parsing Dedicados
                if (extensao === 'json') {
                    try {
                        const obj = JSON.parse(textoBruto);
                        textoLimpo = JSON.stringify(obj, null, 2);
                    } catch(e) { textoLimpo = textoBruto; }
                } else if (extensao === 'html') {
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(textoBruto, 'text/html');
                    textoLimpo = doc.body.innerText || doc.documentElement.innerText;
                } else {
                    textoLimpo = textoBruto; // Fallback estrutural para TXT, Markdown e CSV
                }

                const chunks = this.gerarChunks(textoLimpo);
                await this.salvarChunks(file.name, chunks);
                return { nome: file.name, totalChunks: chunks.length };
            }

            // Algoritmo de Janela Deslizante de Chunks para RAG Local
            gerarChunks(texto, tamanhoChunk = 400, overlap = 80) {
                const palavras = texto.split(/\s+/);
                const chunks = [];
                let i = 0;

                while (i < palavras.length) {
                    const fim = Math.min(i + tamanhoChunk, palavras.length);
                    const chunkTexto = palavras.slice(i, fim).join(' ').trim();
                    if (chunkTexto.length > 5) {
                        chunks.push(chunkTexto);
                    }
                    i += (tamanhoChunk - overlap);
                }
                return chunks;
            }

            // Gravação Massiva no IndexedDB
            async salvarChunks(nomeArquivo, chunks) {
                const transaction = this.db.transaction([this.storeName], 'readwrite');
                const store = transaction.objectStore(this.storeName);

                for (const chunk of chunks) {
                    store.put({
                        fonte: nomeArquivo,
                        texto: chunk,
                        timestamp: Date.now()
                    });
                }

                return new Promise((resolve) => {
                    transaction.oncomplete = () => resolve();
                });
            }

            // Algoritmo de Busca de Similaridade por Frequência de Palavras-Chave (Engine RAG Local)
            async buscarContexto(query) {
                return new Promise((resolve) => {
                    const transaction = this.db.transaction([this.storeName], 'readonly');
                    const store = transaction.objectStore(this.storeName);
                    const request = store.getAll();

                    request.onsuccess = () => {
                        const todosChunks = request.result;
                        const termosQuery = query.toLowerCase().match(/\w+/g) || [];
                        
                        if (termosQuery.length === 0) { resolve([]); return; }

                        const resultados = [];

                        todosChunks.forEach(chunk => {
                            let score = 0;
                            const textoLower = chunk.texto.toLowerCase();
                            
                            termosQuery.forEach(termo => {
                                if (textoLower.includes(termo)) {
                                    score += 1;
                                    // Bônus de densidade se a palavra for longa
                                    if (termo.length > 4) score += 0.5;
                                }
                            });

                            if (score > 0) {
                                resultados.push({
                                    fonte: chunk.fonte,
                                    texto: chunk.texto,
                                    score: score
                                });
                            }
                        });

                        // Ordena por maior relevância e retorna os 4 melhores matches
                        resultados.sort((a, b) => b.score - a.score);
                        resolve(resultados.slice(0, 4));
                    };
                });
            }

            // Motor de Espelhamento de Conversação ELIZA
            processarEliza(pergunta) {
                for (const regra of this.elizaRules) {
                    const match = pergunta.match(regra.pattern);
                    if (match) {
                        const respostaBase = regra.replies[Math.floor(Math.random() * regra.replies.length)];
                        // Substitui o grupo capturado se houver
                        if (match[1]) {
                            return respostaBase.replace('$1', match[1].trim());
                        }
                        return respostaBase;
                    }
                }
                return this.elizaFallbacks[Math.floor(Math.random() * this.elizaFallbacks.length)];
            }

            // Orquestrador Central: Fusão de Camadas RAG + ELIZA + Arquétipos
            async processarPergunta(pergunta) {
                const trechosEncontrados = await this.buscarContexto(pergunta);
                const arq = this.arquetipos[this.arquetipoAtivo];
                
                let respostaFinal = '';
                let fontesUtilizadas = [];

                if (trechosEncontrados.length > 0) {
                    // Camada 2: RAG Ativo com Filtro do Arquétipo Operacional
                    respostaFinal = arq.prefixo + arq.formatar(trechosEncontrados);
                    fontesUtilizadas = [...new Set(trechosEncontrados.map(t => t.fonte))];
                } else {
                    // Camada 1: Sem correspondência local -> Fallback Reflexivo ELIZA
                    respostaFinal = `[Camada Reflexiva ELIZA]\n\n` + this.processarEliza(pergunta);
                }

                // Pergunta sugerida dinâmica para retroalimentar o loop cognitivo
                const sugestoes = [
                    "Essa abordagem gerou novas conexões conceituais?",
                    "Você gostaria de refinar a busca adicionando mais variáveis?",
                    "Faz sentido cruzar essa afirmação com outro documento do acervo?",
                    "Como isso impacta as premissas iniciais do seu escopo?"
                ];
                const perguntaSugerida = sugestoes[Math.floor(Math.random() * sugestoes.length)];

                return {
                    resposta: respostaFinal,
                    fontes: fontesUtilizadas,
                    sugestao: perguntaSugerida,
                    arquétipo: this.arquetipoAtivo
                };
            }

            // Listagem de Documentos Consolidados sem duplicatas
            async listarDocumentos() {
                return new Promise((resolve) => {
                    const transaction = this.db.transaction([this.storeName], 'readonly');
                    const store = transaction.objectStore(this.storeName);
                    const request = store.getAll();

                    request.onsuccess = () => {
                        const chunks = request.result;
                        const mapaDocs = {};
                        chunks.forEach(c => {
                            if (!mapaDocs[c.fonte]) {
                                mapaDocs[c.fonte] = 0;
                            }
                            mapaDocs[c.fonte]++;
                        });
                        resolve(mapaDocs);
                    };
                });
            }

            // Remoção Seletiva de Arquivos
            async removerDocumento(nomeFonte) {
                return new Promise((resolve) => {
                    const transaction = this.db.transaction([this.storeName], 'readwrite');
                    const store = transaction.objectStore(this.storeName);
                    const request = store.openCursor();

                    request.onsuccess = (event) => {
                        const cursor = event.target.result;
                        if (cursor) {
                            if (cursor.value.fonte === nomeFonte) {
                                cursor.delete();
                            }
                            cursor.continue();
                        } else {
                            resolve();
                        }
                    };
                });
            }

            // Reseta toda a base de dados IndexedDB
            async limparTudo() {
                return new Promise((resolve) => {
                    const transaction = this.db.transaction([this.storeName], 'readwrite');
                    const store = transaction.objectStore(this.storeName);
                    const request = store.clear();
                    request.onsuccess = () => resolve();
                });
            }
        }

        // ==========================================
        //  INTERFACE GRÁFICA & INTERAÇÃO (ENGINE GLUE)
        // ==========================================
        const motor = new Motor78K();
        
        // Elementos de Controle do DOM
        const chatOutput = document.getElementById('chat-output');
        const chatInput = document.getElementById('chat-input');
        const sendBtn = document.getElementById('send-btn');
        const fileInput = document.getElementById('file-input');
        const compiledFilesList = document.getElementById('compiled-files');
        const fileCountEl = document.getElementById('file-count');
        const clearDbBtn = document.getElementById('clear-db-btn');
        const voiceBtn = document.getElementById('voice-btn');
        const engineStatus = document.getElementById('engine-status');

        // Inicialização do Motor
        window.addEventListener('DOMContentLoaded', async () => {
            await motor.init();
            await atualizarBibliotecaUI();
        });

        // Loop de Renderização da Lista de Arquivos
        async function atualizarBibliotecaUI() {
            const docs = await motor.listarDocumentos();
            compiledFilesList.innerHTML = '';
            let contador = 0;

            for (const [nome, total] of Object.entries(docs)) {
                contador++;
                const li = document.createElement('li');
                li.className = 'file-item';
                li.innerHTML = `
                    <span class="file-item-name" title="${nome}">${nome} (${total} chunks)</span>
                    <button class="file-delete-btn" onclick="deletarArquivo('${nome}')">Remover</button>
                `;
                compiledFilesList.appendChild(li);
            }
            fileCountEl.textContent = contador;
        }

        // Deletar arquivo globalmente
        window.deletarArquivo = async (nome) => {
            engineStatus.textContent = "Removendo...";
            await motor.removerDocumento(nome);
            await atualizarBibliotecaUI();
            engineStatus.textContent = "Pronto (100% Local e Privado)";
        };

        // Evento de Upload de Arquivo
        fileInput.addEventListener('change', async (e) => {
            if (e.target.files.length === 0) return;
            engineStatus.textContent = "Indexando documento...";
            
            for (const file of e.target.files) {
                await motor.processarArquivo(file);
            }
            
            await atualizarBibliotecaUI();
            engineStatus.textContent = "Pronto (100% Local e Privado)";
            fileInput.value = '';
        });

        // Chaveador de Personalidades / Arquétipos
        document.querySelectorAll('.archetype-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.archetype-btn').forEach(b => b.classList.remove('active'));
                const targetBtn = e.currentTarget;
                targetBtn.classList.add('active');
                
                const archNome = targetBtn.getAttribute('data-arch');
                motor.arquetipoAtivo = archNome;
            });
        });

        // Limpar Base de Dados Completa
        clearDbBtn.addEventListener('click', async () => {
            if(confirm("Tem certeza que deseja apagar permanentemente todos os documentos indexados no seu navegador?")) {
                await motor.limparTudo();
                await atualizarBibliotecaUI();
                appendMessage('system', 'Base de dados local completamente limpa.', 'Atlas');
            }
        });

        // Envio de Mensagens para o Processador Central
        async function enviarMensagem() {
            const texto = chatInput.value.trim();
            if (!texto) return;

            appendMessage('user', texto);
            chatInput.value = '';
            engineStatus.textContent = "Processando RAG/ELIZA...";

            const resultado = await motor.processarPergunta(texto);
            
            appendMessage('system', resultado.resposta, resultado.arquétipo, resultado.fontes, resultado.sugestao);
            
            // Se a voz estiver habilitada, aciona Síntese de Fala Local
            if (synthActive) {
                falarTexto(resultado.resposta.replace(/<[^>]*>/g, ''));
            }

            engineStatus.textContent = "Pronto (100% Local e Privado)";
        }

        sendBtn.addEventListener('click', enviarMensagem);
        chatInput.addEventListener('keydown', (e) => { if(e.key === 'Enter') enviarMensagem(); });

        // Helper para injetar mensagens na UI de forma limpa e modular
        function appendMessage(sender, text, arquetipo = '', fontes = [], sugestao = '') {
            const msgDiv = document.createElement('div');
            msgDiv.className = `message ${sender} ${arquetipo}`;
            
            // Substitui quebras de linha por tags <br> para formatação correta do texto
            let textoFormatado = text.replace(/\n/g, '<br>');
            msgDiv.innerHTML = `<div>${textoFormatado}</div>`;

            if (fontes.length > 0 || sugestao) {
                const metaDiv = document.createElement('div');
                metaDiv.className = 'message-meta';
                
                if (fontes.length > 0) {
                    metaDiv.innerHTML += `<span>Fontes: ${fontes.map(f => `<span class="source-tag">${f}</span>`).join(' ')}</span>`;
                }
                if (sugestao) {
                    metaDiv.innerHTML += `<div style="width:100%; color: var(--accent-glow); font-style: italic; margin-top: 4px;">Sugerido: "${sugestao}"</div>`;
                }
                msgDiv.appendChild(metaDiv);
            }

            chatOutput.appendChild(msgDiv);
            chatOutput.scrollTop = chatOutput.scrollHeight;
        }

        // ==========================================
        //  MÓDULO OPCIONAL DE VOZ (SPEECH API BROWSER)
        // ==========================================
        let recognition = null;
        let speechActive = false;
        let synthActive = false;

        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechObj = window.SpeechRecognition || window.webkitSpeechRecognition;
            recognition = new SpeechObj();
            recognition.lang = 'pt-BR';
            recognition.continuous = false;
            recognition.interimResults = false;

            recognition.onstart = () => {
                voiceBtn.classList.add('active');
                speechActive = true;
                engineStatus.textContent = "Escutando...";
            };

            recognition.onresult = (event) => {
                const resultadoTexto = event.results[0][0].transcript;
                chatInput.value = resultadoTexto;
                enviarMensagem();
            };

            recognition.onerror = () => {
                desativarVozUI();
            };

            recognition.onend = () => {
                desativarVozUI();
            };
        } else {
            voiceBtn.style.display = 'none'; // Esconde se o browser não tiver suporte nativo
        }

        function desativarVozUI() {
            voiceBtn.classList.remove('active');
            speechActive = false;
            engineStatus.textContent = "Pronto (100% Local e Privado)";
        }

        voiceBtn.addEventListener('click', () => {
            if (!speechActive && recognition) {
                synthActive = true; // Ativa também a leitura da resposta por síntese caso use áudio
                recognition.start();
            } else if (recognition) {
                recognition.stop();
                synthActive = false;
            }
        });

        function falarTexto(texto) {
            if ('speechSynthesis' in window) {
                // Cancela falas anteriores em andamento
                window.speechSynthesis.cancel();
                const utterance = new SpeechSynthesisUtterance(texto);
                utterance.lang = 'pt-BR';
                utterance.rate = 1.1;
                window.speechSynthesis.speak(utterance);
            }
        }
  