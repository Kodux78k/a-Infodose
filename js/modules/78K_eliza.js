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
