
//====================================================
// https://www.infodose.com.br/js/modules/78K_eliza.js
//====================================================

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



//====================================================
// https://www.infodose.com.br/js/modules/Kmotor.js
//====================================================

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



//====================================================
// https://www.infodose.com.br/js/modules/kdx-perf-container.js
//====================================================

/**
 * KODUX ORB NEXUS - PERFORMANCE INJECTOR V2
 * Com Scanner de CDNs, Perfis (Low/Med/High) e Toggles por Grupo.
 * O widget agora é imune ao próprio patch!
 */
(function() {
    if (document.getElementById('kdx-perf-container')) return;

    // =========================================================================
    // 1. INJETAR CSS (PATCH ISOLADO + WIDGET)
    // =========================================================================
    const style = document.createElement('style');
    style.innerHTML = `
        /* --- A. PATCHES DE PERFORMANCE POR GRUPO --- */
        
        /* Sombras */
        html[data-kdx-shadow="off"] [data-kdx-fx~="shadow"] { 
            box-shadow: none !important; 
            border: 1px solid rgba(255,255,255,0.1) !important;
        }
        
        /* Vidro e Blur */
        html[data-kdx-glass="off"] [data-kdx-fx~="glass"] { 
            backdrop-filter: none !important; 
            -webkit-backdrop-filter: none !important; 
            background-color: rgba(15, 15, 20, 0.95) !important; 
        }
        html[data-kdx-glass="off"] [data-kdx-fx~="blur"] { 
            filter: none !important; 
        }
        
        /* Animações (Imunizando o nosso painel com :not) */
        html[data-kdx-anim="off"] *:not(#kdx-perf-container):not(#kdx-perf-container *) { 
            transition: none !important; 
            animation-duration: 0.01s !important; 
            will-change: auto !important; 
        }

        /* --- B. ESTILO DO WIDGET V2 --- */
        #kdx-perf-container {
            position: fixed; bottom: 25px; right: 25px; z-index: 2147483647;
            font-family: 'JetBrains Mono', 'Inter', system-ui, sans-serif; color: #e2e8f0;
        }
        .kdx-fab {
            width: 55px; height: 55px; border-radius: 50%;
            background: linear-gradient(135deg, #6366f1, #a855f7);
            border: 2px solid rgba(255,255,255,0.2); box-shadow: 0 0 20px rgba(99, 102, 241, 0.4);
            cursor: pointer; display: flex; align-items: center; justify-content: center;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .kdx-fab:hover { transform: scale(1.1) rotate(5deg); box-shadow: 0 0 30px rgba(99, 102, 241, 0.6); }
        .kdx-fab svg { width: 26px; height: 26px; fill: none; stroke: #fff; stroke-width: 2.5; }
        
        .kdx-panel {
            position: absolute; bottom: 75px; right: 0; width: 340px; 
            background: rgba(10, 10, 12, 0.95); backdrop-filter: blur(10px);
            border: 1px solid #27273a; border-radius: 16px; padding: 20px; 
            box-shadow: 0 20px 50px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.05);
            display: none; flex-direction: column; gap: 15px; opacity: 0; 
            transform: translateY(20px); transition: all 0.3s ease; transform-origin: bottom right;
            max-height: 80vh; overflow-y: auto;
        }
        .kdx-panel.open { display: flex; opacity: 1; transform: translateY(0); }
        
        .kdx-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #27273a; padding-bottom: 10px; }
        .kdx-header h3 { margin: 0; font-size: 15px; font-weight: 800; color: #fff; display: flex; align-items: center; gap: 8px; }
        .kdx-header h3 span { color: #6366f1; }
        
        .kdx-btn-scan {
            background: #1e1e2e; color: #fff; border: 1px solid #3f3f5a; padding: 12px; border-radius: 8px; 
            cursor: pointer; font-size: 13px; font-weight: 600; transition: 0.2s; display: flex; align-items: center; justify-content: center; gap: 8px;
        }
        .kdx-btn-scan:hover { background: #2a2a3e; border-color: #6366f1; }
        
        /* Grid de Modos */
        .kdx-modes { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; }
        .kdx-mode-btn {
            background: #1e1e2e; border: 1px solid #3f3f5a; color: #94a3b8; padding: 8px; border-radius: 6px;
            font-size: 12px; font-weight: bold; cursor: pointer; transition: 0.2s;
        }
        .kdx-mode-btn.active { background: #6366f1; color: #fff; border-color: #818cf8; }
        
        /* Toggles individuais */
        .kdx-toggle-group { display: flex; flex-direction: column; gap: 8px; background: rgba(0,0,0,0.3); padding: 12px; border-radius: 8px; border: 1px dashed #3f3f5a; }
        .kdx-toggle { display: flex; align-items: center; justify-content: space-between; }
        .kdx-toggle span { font-size: 13px; color: #cbd5e1; }
        
        /* CDNs */
        .kdx-cdns { background: #13131a; border: 1px solid #27273a; border-radius: 8px; padding: 10px; font-size: 11px; color: #94a3b8; max-height: 100px; overflow-y: auto; }
        .kdx-cdn-item { padding: 4px 0; border-bottom: 1px solid #1e1e2e; }
        .kdx-cdn-item:last-child { border: none; }
        
        /* Switch CSS */
        .switch { position: relative; display: inline-block; width: 36px; height: 20px; }
        .switch input { opacity: 0; width: 0; height: 0; }
        .slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #ef4444; transition: .4s; border-radius: 20px; }
        .slider:before { position: absolute; content: ""; height: 14px; width: 14px; left: 3px; bottom: 3px; background-color: white; transition: .4s; border-radius: 50%; }
        input:checked + .slider { background-color: #10b981; }
        input:checked + .slider:before { transform: translateX(16px); }
    `;
    document.head.appendChild(style);

    // =========================================================================
    // 2. CONSTRUIR UI HTML
    // =========================================================================
    const container = document.createElement('div');
    container.id = 'kdx-perf-container';
    container.innerHTML = `
        <div class="kdx-panel" id="kdx-panel">
            <div class="kdx-header">
                <h3>⚡ KODUX <span>PERF-CORE V2</span></h3>
                <button id="kdx-close" style="border:none;background:none;color:#94a3b8;font-size:18px;cursor:pointer;">✕</button>
            </div>
            
            <button class="kdx-btn-scan" id="kdx-btn-scan">⚙️ Escanear DOM & CDNs</button>
            
            <div id="kdx-cdn-box" style="display:none;">
                <div style="font-size:12px; font-weight:bold; margin-bottom:5px; color:#6366f1;">CDNs Ativos Encontrados:</div>
                <div class="kdx-cdns" id="kdx-cdn-list"></div>
            </div>

            <div style="font-size:12px; font-weight:bold; color:#6366f1; margin-top:5px;">Perfis de Desempenho:</div>
            <div class="kdx-modes">
                <button class="kdx-mode-btn" data-mode="low">LOW</button>
                <button class="kdx-mode-btn" data-mode="med">MED</button>
                <button class="kdx-mode-btn active" data-mode="high">HIGH</button>
            </div>

            <div class="kdx-toggle-group">
                <div class="kdx-toggle">
                    <span>Sombras (Box-Shadow)</span>
                    <label class="switch"><input type="checkbox" id="tg-shadow" checked><span class="slider"></span></label>
                </div>
                <div class="kdx-toggle">
                    <span>Vidro & Blur (Filtros)</span>
                    <label class="switch"><input type="checkbox" id="tg-glass" checked><span class="slider"></span></label>
                </div>
                <div class="kdx-toggle">
                    <span>Animações & Transições</span>
                    <label class="switch"><input type="checkbox" id="tg-anim" checked><span class="slider"></span></label>
                </div>
            </div>
        </div>
        
        <div class="kdx-fab" id="kdx-fab" title="KODUX Performance Core">
            <svg viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
        </div>
    `;
    document.body.appendChild(container);

    // =========================================================================
    // 3. LÓGICA DO MOTOR E CHAVEAMENTO
    // =========================================================================
    const fab = document.getElementById('kdx-fab');
    const panel = document.getElementById('kdx-panel');
    const btnScan = document.getElementById('kdx-btn-scan');
    
    // Toggles
    const tgShadow = document.getElementById('tg-shadow');
    const tgGlass = document.getElementById('tg-glass');
    const tgAnim = document.getElementById('tg-anim');
    const modeBtns = document.querySelectorAll('.kdx-mode-btn');

    // Setup Inicial da Tag HTML
    const html = document.documentElement;
    html.setAttribute('data-kdx-shadow', 'on');
    html.setAttribute('data-kdx-glass', 'on');
    html.setAttribute('data-kdx-anim', 'on');

    // Abre/Fecha Painel
    fab.addEventListener('click', () => panel.classList.toggle('open'));
    document.getElementById('kdx-close').addEventListener('click', () => panel.classList.remove('open'));

    // Atualiza Estado no HTML quando clica nos switches individuais
    function updateHTMLState() {
        html.setAttribute('data-kdx-shadow', tgShadow.checked ? 'on' : 'off');
        html.setAttribute('data-kdx-glass', tgGlass.checked ? 'on' : 'off');
        html.setAttribute('data-kdx-anim', tgAnim.checked ? 'on' : 'off');
        
        // Remove a classe "active" dos perfis se o usuário mexer manualmente
        modeBtns.forEach(b => b.classList.remove('active'));
    }

    tgShadow.addEventListener('change', updateHTMLState);
    tgGlass.addEventListener('change', updateHTMLState);
    tgAnim.addEventListener('change', updateHTMLState);

    // Lógica dos Botões de Perfil (Low/Med/High)
    modeBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            modeBtns.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            
            const mode = e.target.getAttribute('data-mode');
            if (mode === 'high') {
                tgShadow.checked = true; tgGlass.checked = true; tgAnim.checked = true;
            } else if (mode === 'med') {
                tgShadow.checked = true; tgGlass.checked = false; tgAnim.checked = true;
            } else if (mode === 'low') {
                tgShadow.checked = false; tgGlass.checked = false; tgAnim.checked = false;
            }
            // Força a atualização dos datasets
            tgShadow.dispatchEvent(new Event('change'));
            e.target.classList.add('active'); // Retorna o visual de ativo após o trigger apagar
        });
    });

    // Scanner Cirúrgico de DOM e CDNs
    btnScan.addEventListener('click', () => {
        btnScan.innerHTML = "⏳ Escaneando...";
        
        setTimeout(() => {
            // 1. Escaneamento Gráfico
            const allElements = document.querySelectorAll('body *:not(#kdx-perf-container):not(#kdx-perf-container *)');
            allElements.forEach(el => {
                const computed = window.getComputedStyle(el);
                let fxList = [];

                if (computed.boxShadow !== 'none') fxList.push('shadow');
                if (computed.backdropFilter !== 'none') fxList.push('glass');
                if (computed.filter !== 'none' && computed.filter.includes('blur')) fxList.push('blur');

                if (fxList.length > 0) {
                    const currentFx = el.getAttribute('data-kdx-fx') || '';
                    const newFx = [...new Set([...currentFx.split(' '), ...fxList])].join(' ').trim();
                    el.setAttribute('data-kdx-fx', newFx);
                }
            });

            // 2. Escaneamento de CDNs/Scripts
            const scripts = document.querySelectorAll('script[src]');
            const domains = {};
            scripts.forEach(s => {
                try {
                    const url = new URL(s.src);
                    // Agrupa por domínio para não lotar a tela
                    domains[url.hostname] = (domains[url.hostname] || 0) + 1;
                } catch(e) {} // Ignora src inválidos
            });

            const cdnList = document.getElementById('kdx-cdn-list');
            cdnList.innerHTML = '';
            
            if (Object.keys(domains).length === 0) {
                cdnList.innerHTML = '<div class="kdx-cdn-item">Nenhum script externo detectado.</div>';
            } else {
                for (const [domain, count] of Object.entries(domains)) {
                    cdnList.innerHTML += `<div class="kdx-cdn-item">🌐 ${domain} <span style="color:#6366f1;">(${count}x)</span></div>`;
                }
            }
            
            document.getElementById('kdx-cdn-box').style.display = 'block';

            // Feedback Visual
            btnScan.innerHTML = "✓ DOM e Rede Mapeados!";
            btnScan.style.borderColor = '#10b981';
            btnScan.style.color = '#10b981';
            
            setTimeout(() => {
                btnScan.innerHTML = '⚙️ Reescanear DOM & CDNs';
                btnScan.style.borderColor = '#3f3f5a';
                btnScan.style.color = '#fff';
            }, 3000);

        }, 50);
    });

})();




//====================================================
// https://www.infodose.com.br/js/oiDual--Y-insert.js
//====================================================

(function(h,s='#inject-here'){const p=new DOMParser(),c=p.parseFromString(h,'text/html'),f=document.createDocumentFragment(),t=document.querySelector(s)||document.body;Array.from(c.body.childNodes).forEach(n=>f.appendChild(document.importNode(n,true)));t.appendChild(f);Array.from(c.querySelectorAll('script')).forEach(x=>{const n=document.createElement('script');for(const a of x.attributes)n.setAttribute(a.name,a.value);n.textContent=x.textContent;document.body.appendChild(n)})})(`<!DOCTYPE html>
<html lang="pt-BR"><head>
  <meta charset="utf-8">
  <title>Fusion Card // Core Controller</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no">
<link rel="manifest" href="manifest.json"> <meta name="theme-color" content="#05070a"> <link rel="apple-touch-icon" href="icon-192.png">

  <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@200;400;600;900&amp;family=JetBrains+Mono:wght@400;700&amp;display=swap" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@200;400;600;900&family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet">

  <script src="https://unpkg.com/lucide@latest"></script>
  
<link rel="stylesheet" href="https://kodux78k.github.io/oiDual--Y-/css/KxTsK-unified.css">
  
<!-- <link rel="stylesheet" href="https://kodux78k.github.io/oi-Dual/css/main-v0.css-">
<link rel="stylesheet" href="https://kodux78k.github.io/oiDual-KxT-di_oi/css/main.css-">
<link rel="stylesheet" href="https://kodux78k.github.io/oi-Dual/css/DH10.css-">
  -->

</head>
<body>

  <!-- Ambient Blobs -->
  <div class="ambient-light"><div class="blob blob-1"></div><div class="blob blob-2"></div></div>
  <div id="snap-zone"></div>
  <div class="toaster-wrap" id="toasterWrap"></div>

<!-- Distortion SVG Filter -->
  <svg style="display: none;">
    <filter id="distort">
      <feTurbulence baseFrequency="0.01" numOctaves="3" result="turb"/>
      <feDisplacementMap in="SourceGraphic" in2="turb" scale="30"/>
    </filter>
  </svg>

  <!-- Áudio Suave -->
  <audio id="transitionSound" src="https://kodux78k.github.io/oiDual-oiio/suave_portal.mp3" preload="auto"></audio>

  <!-- Partículas -->
  <div id="particles-js"></div>

  <!-- Logo com Transição -->
  <div class="logo-container" id="logo" onclick="goToIndex()">
    <object data="https://kodux78k.github.io/oiDual-oiio/3D_logo_Dual_Infodose_10.svg" type="image/svg+xml"></object>
  </div>

  <!-- Título e Frase -->
  <div class="infodose">dual.<strong>Infodose</strong></div>
 

  <!-- CONTAINER PARA CENTRALIZAR INICIALMENTE -->
  <div class="container">
    <div class="fusion-card closed" id="mainCard">

      <div class="card-header" id="cardHeader">
        <div class="avatar-slot" id="avatarTarget" title="Gerenciar Chaves (Cofre)"></div>
        <div class="text-block">
          <div class="greeting-row">
            <span class="txt-thin" id="lblHello">Oi,</span>
            <span class="txt-heavy" id="lblName">Convidado</span>
          </div>
          <div class="brand-dual">DUAL</div>
        </div>
        <div class="clock-widget">
          <div class="time-display" id="clockTime">00:00</div>
          <span class="status-led">ONLINE</span>
        </div>
        <button class="hud-menu-btn" id="hudMenuBtn" title="Menu Rápido"><i data-lucide="menu"></i></button>
      </div>
      
      <div class="orb-menu-trigger" id="orbMenuTrigger" title="Menu Rápido">●●●</div>
      <div class="drag-handle"></div>

      <div class="small-preview" id="smallPreview" title="Gerenciar Chaves">
        <div class="mini-avatar" id="smallMiniAvatar"></div>
        <div class="small-text" id="smallText">Aguardando ativação...</div>
        <div class="ident-badge" id="smallIdent">--</div>
      </div>

      <div class="card-body" id="cardBody">
        <!-- Main Input User -->
        <div class="input-wrapper stagger-item">
          <input type="text" class="cyber-input" id="inputUser" placeholder="Identifique-se..." autocomplete="off">
        </div>

        <!-- Section 1: ASCII Activation -->
        <div class="activation-wrap stagger-item">
          <div class="activation-toggle" onclick="toggleSection('activationCard')">
            <div style="display:flex;align-items:center;gap:8px">
              <div style="width:10px;height:10px;border-radius:99px;background:var(--neon-cyan)"></div>
              <strong style="letter-spacing:1px;font-size:0.9rem">Ativação ASCII</strong>
            </div>
            <div style="margin-left:auto;font-size:0.82rem;color:rgba(255,255,255,0.6)">BASE v1</div>
          </div>
          <div id="activationCard" class="activation-card activation-hidden">
            <div style="display:flex;align-items:flex-start;gap:10px">
              <div style="display:flex;align-items:center;gap:8px">
                <div class="mini-avatar" id="actMiniAvatar"></div>
                <div><div style="font-weight:700">CÉREBRO</div><div style="font-size:0.78rem;opacity:0.6"><span id="actName">User</span></div></div>
              </div>
              <div class="activation-badge" id="actBadge" style="margin-left:auto; color:var(--neon-cyan); font-size:0.8em">v:--</div>
            </div>
            <pre id="actPre" class="activation-pre">Carregando...</pre>
            <div class="activation-controls" style="display:flex;gap:8px;margin-top:8px">
              <button class="trigger-btn" id="copyActBtn">COPIAR</button>
            </div>
          </div>
        </div>

        <!-- Section 2: System & Neural (Config) -->
        <div class="activation-wrap stagger-item">
            <div class="activation-toggle" onclick="toggleSection('systemCard')">
                <div style="display:flex;align-items:center;gap:8px">
                  <div style="width:10px;height:10px;border-radius:99px;background:var(--neon-purple)"></div>
                  <strong style="letter-spacing:1px;font-size:0.9rem">SYSTEM &amp; NEURAL</strong>
                </div>
                <div style="margin-left:auto;font-size:0.82rem;color:rgba(255,255,255,0.6)">CONFIG</div>
            </div>
            <div id="systemCard" class="activation-card activation-hidden">
                <div class="col">
                   <div class="section-title">IDENTIDADE DA INFODOSE</div>
                   <input type="text" id="infodoseNameInput" placeholder="Nome: World System..." style="width:100%;margin-bottom:8px;padding:8px;border-radius:6px;background:rgba(0,0,0,0.3);border:1px solid rgba(255,255,255,0.1);color:#fff">
                   
                   <div class="section-title" style="margin-top:8px">CONEXÃO NEURAL (SK)</div>
                   <input type="password" id="apiKeyInput" placeholder="sk-or-..." autocomplete="off" style="width:100%;margin-bottom:6px;padding:8px;border-radius:6px;background:rgba(0,0,0,0.3);border:1px solid rgba(255,255,255,0.1);color:#fff">
                   
                   <div class="model-toggle">
                      <select id="modelSelect" class="btn">
                        <option value="" disabled="">Selecione Modelo</option>
                        <option value="nvidia/nemotron-3-nano-30b-a3b:free">NemoTron (Free)</option>
                        <option value="allenai/molmo-2-8b:free">MolMo (Free)</option>
                        <option value="mistralai/devstral-2512:free">DevStral</option>
                        <option value="openai/gpt-oss-120b:free">OSS120b</option>
                      </select>
                   </div>
                   
                   <div class="panel-divider" style="margin:10px 0; border-top:1px solid rgba(255,255,255,0.05)"></div>
                   <button id="saveSystemBtn" class="trigger-btn" style="margin-top:12px;background:var(--neon-cyan);color:#000;border:none;font-weight:700">SALVAR CONFIGURAÇÃO</button>
                </div>
            </div>
        </div>

        <div class="stagger-item" style="margin-top:4px">
            <div class="stat-lbl" style="margin-bottom:6px; font-size:0.6rem; color:rgba(255,255,255,0.4)">INTERFACE MODE</div>
            <div style="display:flex; gap:8px;">
                <button class="trigger-btn mode-btn active-mode" id="btnModeCard" onclick="setMode('card')" style="flex:1" title="Modo Padrão">CARD</button>
                <button class="trigger-btn mode-btn" id="btnModeOrb" onclick="setMode('orb')" style="flex:1" title="Flutuante">ORB</button>
                <button class="trigger-btn mode-btn" id="btnModeHud" onclick="setMode('hud')" style="flex:1" title="Barra de Topo">HUD</button>
            </div>
        </div>

      </div>
    </div>
  </div>

  <!-- KEYS MANAGER MODAL -->
  <div id="keysModal" class="modal-overlay" aria-hidden="true">
    <div class="keys-card" role="dialog">
      <div class="keys-header">
        <div>
          <div id="keysTitle" style="font-weight:800;font-size:1.1rem;color:var(--neon-cyan)">USER KEYS MANAGER</div>
          <div style="color:rgba(255,255,255,0.6);font-size:0.85rem">Gerencie suas chaves API com segurança local (Cofre).</div>
        </div>
        <button id="closeKeysBtn" class="small-btn">X</button>
      </div>
      <div class="key-list" id="keyList"></div>
      <div class="form-section" style="margin-top:15px;padding-top:15px;border-top:1px solid rgba(255,255,255,0.05)">
        <div class="form-grid">
          <input id="keyNameInput" placeholder="Nome da chave (ex: Principal)">
          <input id="keyTokenInput" type="password" placeholder="Token / ESK (Opcional)">
        </div>
        <button id="addKeyBtn" class="small-btn" style="width:100%;margin-top:8px;background:rgba(255,255,255,0.1)">ADICIONAR CHAVE</button>
      </div>
      <div style="display:flex;gap:8px;justify-content:space-between;margin-top:15px;border-top:1px solid rgba(255,255,255,0.05);padding-top:12px">
        <div style="font-size:0.7rem;color:rgba(255,255,255,0.4);display:flex;align-items:center;gap:5px">
          <i data-lucide="shield-check" style="width:14px"></i> <span id="vaultStatusText">Cofre Aberto</span>
        </div>
        <div style="display:flex;gap:8px">
          <button id="lockVaultBtn" class="small-btn danger">BLOQUEAR</button>
        </div>
      </div>
    </div>
  </div>

  <!-- VAULT UNLOCK MODAL -->
  <div id="vaultModal" class="modal-overlay" aria-hidden="true">
    <div class="keys-card">
      <div class="vault-icon"><i data-lucide="lock" style="width:24px;height:24px"></i></div>
      <h3 style="margin:0 0 10px 0;font-weight:800">ACESSO AO COFRE</h3>
      <p style="margin:0 0 15px 0;font-size:0.9rem;color:rgba(255,255,255,0.6)">Seus dados estão criptografados. Digite a senha para desbloquear.</p>
      <input type="password" id="vaultPassInput" class="cyber-input" style="text-align:center;margin-bottom:12px" placeholder="Senha...">
      <div style="display:flex;gap:8px;justify-content:center">
         <button id="vaultCancelBtn" class="small-btn">Cancelar</button>
         <button id="vaultUnlockBtn" class="small-btn active-btn">DESBLOQUEAR</button>
      </div>
    </div>
  </div>

<div class="frase"><strong>Sempre</strong> único<strong>. Sempre</strong> seu<strong>.</strong></div>

<script  src="https://kodux78k.github.io/oi-Dual/js/modules/inline-000.js"></script>
<!--
<script type="module" src="https://kodux78k.github.io/oi-Dual/js/main.js"></script>
-->

<script src="https://kodux78k.github.io/oi-Dual/kxt-insert.js"></script>

</body>


</html> `); 

