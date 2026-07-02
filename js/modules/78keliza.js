/**
 * MOTOR78K v1.0 - ELIZA + RAG Local + Arquétipos
 * 100% Offline. Browser only.
 * @key "motor78k-local"
 * @sig "∞◌"
 * @id "4278111c"
 */

class Motor78K {
  constructor() {
    this.dbName = 'motor78k';
    this.storeName = 'docs';
    this.db = null;
    this.arquetipos = {
      Atlas: { estilo: 'organiza, cria planos e checklists', prompt: 'Organize em etapas:' },
      Nova: { estilo: 'sugere ideias e associacoes', prompt: 'E se você tentasse:' },
      Artemis:{ estilo: 'questiona premissas e inconsistencias', prompt: 'O que te faz pensar que:' },
      Uno: { estilo: 'sintetiza e resume', prompt: 'Em resumo:' }
    };
    this.arquetipoAtivo = 'Atlas';
    this.initDB();
  }

  /** 1. MEMORIA: IndexedDB + Cache */
  async initDB() {
    return new Promise((resolve, reject) => {
      const req = indexedDB.open(this.dbName, 1);
      req.onupgradeneeded = e => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName, { keyPath: 'id' });
        }
      };
      req.onsuccess = e => { this.db = e.target.result; resolve(); };
      req.onerror = e => reject(e);
    });
  }

  /** 2. ENTRADA: Parsers */
  async upload(arquivo) {
    const tipo = arquivo.name.split('.').pop().toLowerCase();
    const texto = await this.parse(arquivo, tipo);
    const chunks = this.chunkar(texto);
    await this.indexar(arquivo.name, chunks);
    localStorage.setItem(`motor78k_${arquivo.name}`, 'true');
    return { id: arquivo.name, chunks: chunks.length };
  }

  async parse(file, tipo) {
    if (tipo === 'txt' || tipo === 'md') return await file.text();
    if (tipo === 'json') return JSON.stringify(JSON.parse(await file.text()));
    if (tipo === 'html') return new DOMParser().parseFromString(await file.text(), 'text/html').body.innerText;
    if (tipo === 'pdf') return await this.parsePDF(file); // Precisa de pdf.js se quiser real
    return await file.text();
  }

  async parsePDF(file) {
    // Fallback simples: retorna nome. Troca por pdf.js se quiser extrair texto real
    return `[PDF] ${file.name} - Adicione pdfjs-dist para extrair texto real`;
  }

  chunkar(texto, size = 500) {
    const palavras = texto.split(/\s+/);
    const chunks = [];
    for (let i = 0; i < palavras.length; i += size) {
      chunks.push(palavras.slice(i, i + size).join(' '));
    }
    return chunks;
  }

  /** 3. INDEXADOR: Busca por keywords simples */
  async indexar(id, chunks) {
    const tx = this.db.transaction(this.storeName, 'readwrite');
    const store = tx.objectStore(this.storeName);
    store.put({ id, chunks, ts: Date.now() });
    return tx.complete;
  }

  async buscar(query) {
    const keywords = query.toLowerCase().match(/\w+/g) || [];
    const tx = this.db.transaction(this.storeName, 'readonly');
    const store = tx.objectStore(this.storeName);
    const docs = await store.getAll();
    const resultados = [];

    docs.forEach(doc => {
      doc.chunks.forEach(chunk => {
        const score = keywords.filter(k => chunk.toLowerCase().includes(k)).length;
        if (score > 0) resultados.push({ fonte: doc.id, texto: chunk, score });
      });
    });
    return resultados.sort((a, b) => b.score - a.score).slice(0, 5);
  }

  /** 4. ELIZA: Regras de conversacao */
  elizaRefletir(pergunta) {
    const reflexoes = [
      `O que te faz dizer que ${pergunta}?`,
      `Há alguma parte especifica que chama sua atencao em ${pergunta}?`,
      `Quando você fala em ${pergunta}, está pensando na arquitetura ou no fluxo de ideias?`
    ];
    return reflexoes[Math.floor(Math.random() * reflexoes.length)];
  }

  /** 5. MOTOR: Junta RAG + ELIZA + Arquétipo */
  async responder(pergunta) {
    const trechos = await this.buscar(pergunta);
    const arqu = this.arquetipos[this.arquetipoAtivo];

    let resposta = '';
    if (trechos.length > 0) {
      resposta = `${arqu.prompt}\n\n`;
      trechos.forEach(t => resposta += `> ${t.texto.slice(0, 200)}... [${t.fonte}]\n`);
    } else {
      resposta = this.elizaRefletir(pergunta);
    }

    return {
      resposta,
      fontes: [...new Set(trechos.map(t => t.fonte))],
      sugestao: 'Você gostaria de aprofundar essa ideia?'
    };
  }

  setArquetipo(nome) {
    if (this.arquetipos[nome]) this.arquetipoAtivo = nome;
  }

  listarArquivos() {
    return Object.keys(localStorage).filter(k => k.startsWith('motor78k_')).map(k => k.replace('motor78k_', ''));
  }
}

// EXPORT GLOBAL
window.Motor78K = Motor78K;