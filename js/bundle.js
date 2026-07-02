
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
// https://www.infodose.com.br/js/kxt-insert.js
//====================================================

(function(h,s='#inject-here'){const p=new DOMParser(),c=p.parseFromString(h,'text/html'),f=document.createDocumentFragment(),t=document.querySelector(s)||document.body;Array.from(c.body.childNodes).forEach(n=>f.appendChild(document.importNode(n,true)));t.appendChild(f);Array.from(c.querySelectorAll('script')).forEach(x=>{const n=document.createElement('script');for(const a of x.attributes)n.setAttribute(a.name,a.value);n.textContent=x.textContent;document.body.appendChild(n)})})(`<!DOCTYPE html>
<html lang="pt-BR"><head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
  <title>Dual.Infodose v7.9 · KOBLLUX VISIO</title>

  <meta name="theme-color" content="#050811">
  <link rel="manifest" href="./manifest.json">
<link rel="apple-touch-icon" href="./icon-192.png">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&family=JetBrains+Mono:wght@400;700&display=swap">
  <script src="https://cdn.jsdelivr.net/npm/particles.js@2.0.0/particles.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/highlight.js@11.10.0/build/highlight.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/highlight.js@11.10.0/styles/github-dark.min.css" id="hljs-theme">
  <script>hljs.highlightAll();</script>
  
  
  
  
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/highlight.js@11.10.0/styles/github-dark.min.css" id="hljs-theme">
  



  
  
<link rel="stylesheet" href="https://kodux78k.github.io/oiDual-KxT-di_oi/css/main.css"></head>

<body class="field-closed mode-night">

  <svg style="display:none">
    <symbol id="icon-orb" viewBox="0 0 24 24"><circle cx="12" cy="12" r="7"></circle><circle cx="12" cy="12" r="8"></circle></symbol>
    <symbol id="icon-cards" viewBox="0 0 24 24"><rect x="2" y="2" width="16" height="16" rx="2"></rect><path d="M22 6v14a2 2 0 0 1-2 2H6"></path></symbol>
    <symbol id="icon-gem" viewBox="0 0 24 24"><path d="M6 3h12l4 6-10 12L2 9z"></path></symbol>
    <symbol id="icon-settings" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></symbol>
    <symbol id="icon-send" viewBox="0 0 24 24"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></symbol>
    <symbol id="icon-copy" viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></symbol>
    <symbol id="icon-trash" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></symbol>
    <symbol id="icon-voice" viewBox="0 0 24 24"><rect x="9" y="1" width="6" height="12" rx="3"></rect><path d="M5 10a7 7 0 0 0 14 0"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></symbol>
    <symbol id="icon-edit" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></symbol>
    <symbol id="icon-restore" viewBox="0 0 24 24"><polyline points="1 4 1 10 7 10"></polyline><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path></symbol>
    <symbol id="icon-upload" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></symbol>
    <symbol id="icon-download" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></symbol>
    <symbol id="icon-sandbox" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path></symbol>
    <symbol id="icon-pdf" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></symbol>
    <symbol id="icon-mic" viewBox="0 0 24 24"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></symbol>
    <symbol id="icon-md" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2" ry="2"></rect><polyline points="7 15 9 13 11 15"></polyline><line x1="9" y1="15" x2="9" y2="9"></line></symbol>
    <symbol id="icon-eye" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></symbol>
    <symbol id="icon-code" viewBox="0 0 24 24"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></symbol>
    <symbol id="icon-maximize" viewBox="0 0 24 24"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path></symbol>
  </svg>
    
  <div class="sky-layer"><div class="sun-background"></div></div>
  <div id="particles-js"></div>
  <div id="bg-fake-custom"></div> 
  <div id="nv-toast"></div>
  <div id="modeIndicator">CARREGANDO nO.Sºlar...</div>

  <div class="header-orb" id="orbToggle" title="Acessar Cockpit do Usuário"><svg><use href="#icon-orb"></use></svg></div>
  <div id="usernameDisplay"></div>

  <div class="top-bar">
    <div class="top-grp"><button class="btn-icon" id="btnSettings" title="Configurações"><svg><use href="#icon-settings"></use></svg></button></div>
    <div class="top-grp"><button class="btn-icon" id="btnDeck" title="Deck"><svg><use href="#icon-cards"></use></svg></button><button class="btn-icon" id="btnCrystallize" title="Cristalizar"><svg><use href="#icon-gem"></use></svg></button></div>
  </div>

  <div id="chat-container" class="collapsed">
    <div class="msg-block system">Dual.Infodose v7.9 · KOBLLUX VISIO<br>Memória Cristalizada &amp; HTML Matrix<br>KODUX INTEGRATED [ATLAS + V.E.E.B]</div>
  </div>

  <div class="input-dock">
    <div id="filePreview" class="file-preview"><div class="file-info"><span></span></div><div class="file-actions"></div></div>
    <input type="file" id="fileUploadInput" accept="image/*,.pdf,.txt,.json,.js,.css,.html" style="display:none;">
    <div id="field-toggle-handle"><span class="footer-dot"></span>tocar o campo é consentir</div>
    <div class="input-row">
        <button class="btn-icon" id="btnVoice" title="Voz"><svg><use href="#icon-voice"></use></svg></button>
        <button class="btn-icon" id="btnUploadFile" title="Enviar Arquivo"><svg><use href="#icon-upload"></use></svg></button>
        <input type="text" id="userInput" class="glass-input" placeholder="Emitir pulso..." autocomplete="off">
        <button class="btn-icon btn-primary" id="btnSend" title="Enviar"><svg><use href="#icon-send"></use></svg></button>
    </div>
  </div>

  <div id="drawerSettings" class="drawer">
    <div class="drawer-content">
      <div class="drawer-header"><h3>Configuração Neural</h3><button class="btn-icon" onclick="toggleDrawer('drawerSettings')">✕</button></div>
      <div class="drawer-body">
        <div class="form-group"><label>Chave Dual (API Key)</label><input type="password" id="apiKeyInput" class="glass-input" style="border-radius:8px;width:100%" placeholder="sk-..."></div>
        <div class="form-group"><label>Dual (Prompt)</label><textarea id="systemRoleInput" class="glass-textarea" placeholder="Você é o Oráculo..."></textarea></div>
        <hr style="border-color:rgba(255,255,255,0.1);margin:15px 0;">
        <div class="form-group"><label>Seu (Style)</label><input type="file" id="cssUploadInput" accept=".css,text/plain" style="margin-bottom:5px;font-size:0.8rem;"><textarea id="customCssInput" class="glass-textarea" placeholder="Cole CSS aqui..."></textarea><button class="btn-block" id="btnClearCss" style="margin-top:5px;color:var(--danger)">Remover CSS</button></div>
        <button class="btn-block active" id="btnSaveConfig" style="margin-top:15px;">Salvar Tudo</button>
        <button class="btn-block" style="margin-top:10px;color:var(--danger);border-color:var(--danger)" onclick="if(confirm('Resetar tudo?')){localStorage.clear();location.reload();}">Factory Reset</button>
      </div>
    </div>
  </div>

  <div id="drawerProfile" class="drawer">
    <div class="drawer-content">
      <div class="drawer-header"><h3><svg style="width:20px;height:20px;margin-right:8px;stroke:var(--secondary)"><use href="#icon-orb"></use></svg> Cockpit Solar</h3><button class="btn-icon" onclick="toggleDrawer('drawerProfile')">✕</button></div>
      <div class="drawer-body">
        <div class="cockpit-item" style="text-align:center;margin-bottom:15px;"><div class="cockpit-label">Ciclo Solar</div><div id="statusSolarMode" style="font-size:1.2rem;font-weight:bold;margin:5px 0;">AUTO</div><div class="control-row"><button class="btn-block" id="btnCycleSolar">Manual ☀️/🌙</button><button class="btn-block" id="btnAutoSolar">Auto 🕒</button></div></div>
        <div class="cockpit-grid">
            <div class="cockpit-item"><div class="cockpit-label">Identificação</div><input type="text" id="inputUserId" class="cockpit-input" placeholder="Anônimo"></div>
            <div class="cockpit-item"><div class="cockpit-label">Modelo IA</div><input type="text" id="inputModel" class="cockpit-input" placeholder="google/gemini-2.0-flash-exp"></div>
            <div class="cockpit-item"><div class="cockpit-label">Background</div><div style="display:flex;justify-content:space-between;align-items:center;"><span id="bgStatusText" style="font-size:0.8rem;color:var(--text-muted)">Nenhum</span><label class="btn-icon" style="width:30px;height:30px;border-radius:5px;"><input type="file" id="bgUploadInput" accept="image/*" style="display:none"><svg><use href="#icon-cards"></use></svg></label></div></div>
       <div id="bgThumbPanel" style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-top:15px;"></div>
         </div>
      </div>
    </div>
  </div>
  
  <div id="drawerDeck" class="drawer">
    <div class="drawer-content">
      <div class="drawer-header"><h3>Memórias Cristalizadas</h3><button class="btn-icon" onclick="toggleDrawer('drawerDeck')">✕</button></div>
      <div class="drawer-body" id="deckList"><div style="text-align:center;color:var(--text-muted);margin-top:20px">O vazio reina aqui.<br>Use o botão 💎 para salvar.</div></div>
    </div>
  </div>





<!-- ============ TEXT BEAUTY & INTERACTION PATCH — V3 (aditivo) ============ -->



<!-- ============ /TEXT BEAUTY & INTERACTION PATCH — V3 ============ -->

<!-- -------------------------
   END BEAUTY.v3
   ------------------------- -->



<!-- -------------------------
   TRINITY (livro_vivo_trinity_override.js) injetado
   ------------------------- -->
<!-- Begin: livro_vivo_trinity_override.js -->

<!-- End: livro_vivo_trinity_override.js -->
<!-- -------------------------
   END TRINITY
   ------------------------- -->


<!-- -------------------------
   OVERRIDE LOADER: garante execução pós-render
   ------------------------- -->

<!-- -------------------------
   END OVERRIDE LOADER
   ------------------------- -->

<!-- <script type="module" src="https://kodux78k.github.io/oiDual-KxT-di_oi/js/main.js"></script> ============================
   FIM DO PATCH
   ============================ -->

  

<script src="https://kodux78k.github.io/oiDual-0i/0RB-0S17.js"></script>


<script src="https://kodux78k.github.io/oiDual-KxT-di_oi/js/modules/bgPanel.js"></script>

<!-- 1 -->
<script src="https://kodux78k.github.io/oiDual-KxT-di_oi/js/modules/inline-1.js"></script>

<!-- 2 -->
<script src="https://kodux78k.github.io/oiDual-KxT-di_oi/js/modules/inline-2.js"></script>

<!-- 3 -->
<script src="https://kodux78k.github.io/oiDual-KxT-di_oi/js/modules/inline-3.js"></script>

<!-- 4 -->
<script src="https://kodux78k.github.io/oiDual-KxT-di_oi/js/modules/inline-4.js"></script>





<iframe
  src="https://kodux78k.github.io/oiDual-H0/DH0-10.html"
  sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
  allow="fullscreen; accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture"
  loading="lazy"
  style="

    background: rgba(0,0,0,0);
    width: 100%;
    height: 100%;
  min-height:100dvh;
    z-index: 0;
    border: 0;
    border-radius: 4px;
  ">
</iframe>

<style> body,html {min-height:100vh; height:100%;overflow:auto;} 
</style>
</body></html>`);

