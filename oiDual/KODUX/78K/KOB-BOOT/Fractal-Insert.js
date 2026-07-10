// fractal-mirror.js - Auto-injetor de espelho fractal com UI flutuante
(function() {
  // --- CSS embutido ---
  const style = document.createElement('style');
  style.textContent = `
    /* Fractal Mirror UI - Flutuante */
    #fractal-mirror-btn {
      position: fixed;
      bottom: 24px;
      right: 24px;
      width: 56px;
      height: 56px;
      border-radius: 50%;
      background: radial-gradient(circle at 30% 30%, #7c6df0, #4a3cb5);
      border: none;
      box-shadow: 0 6px 24px rgba(124, 109, 240, 0.5);
      color: #fff;
      font-size: 28px;
      cursor: pointer;
      z-index: 9999;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform 0.2s, box-shadow 0.2s;
      user-select: none;
    }
    #fractal-mirror-btn:hover {
      transform: scale(1.08);
      box-shadow: 0 8px 32px rgba(124, 109, 240, 0.7);
    }
    #fractal-mirror-panel {
      position: fixed;
      bottom: 96px;
      right: 24px;
      width: 420px;
      max-width: calc(100vw - 48px);
      max-height: 70vh;
      background: rgba(18, 22, 30, 0.92);
      backdrop-filter: blur(16px);
      border: 1px solid rgba(255,255,255,0.12);
      border-radius: 20px;
      padding: 20px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.6);
      z-index: 9998;
      display: none;
      flex-direction: column;
      gap: 14px;
      color: #e8ecf5;
      font-family: system-ui, -apple-system, sans-serif;
      transition: opacity 0.25s ease;
    }
    #fractal-mirror-panel.open {
      display: flex;
    }
    #fractal-mirror-panel .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-weight: 600;
      font-size: 1.1rem;
      letter-spacing: 0.02em;
    }
    #fractal-mirror-panel .header button {
      background: none;
      border: none;
      color: #aaa;
      font-size: 20px;
      cursor: pointer;
      padding: 0 8px;
    }
    #fractal-mirror-panel .header button:hover {
      color: #fff;
    }
    #fractal-mirror-panel textarea {
      width: 100%;
      min-height: 120px;
      background: rgba(0,0,0,0.35);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 12px;
      color: #e8ecf5;
      font-size: 14px;
      padding: 12px;
      resize: vertical;
      font-family: 'JetBrains Mono', monospace, system-ui;
      outline: none;
    }
    #fractal-mirror-panel textarea:focus {
      border-color: #7c6df0;
    }
    #fractal-mirror-panel .actions {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
    }
    #fractal-mirror-panel .actions button {
      flex: 1;
      padding: 10px 12px;
      border: none;
      border-radius: 40px;
      font-weight: 600;
      cursor: pointer;
      transition: 0.2s;
      background: rgba(255,255,255,0.08);
      color: #e8ecf5;
      font-size: 0.9rem;
    }
    #fractal-mirror-panel .actions button.primary {
      background: #7c6df0;
      color: #fff;
    }
    #fractal-mirror-panel .actions button.primary:hover {
      background: #6a5cdb;
    }
    #fractal-mirror-panel .actions button:hover {
      background: rgba(255,255,255,0.16);
    }
    #fractal-mirror-panel .status {
      font-size: 0.8rem;
      opacity: 0.6;
      margin-top: -4px;
    }
    #fractal-mirror-panel .preview {
      background: rgba(0,0,0,0.3);
      border-radius: 10px;
      padding: 10px;
      font-size: 0.8rem;
      max-height: 100px;
      overflow-y: auto;
      white-space: pre-wrap;
      word-break: break-word;
      border: 1px solid rgba(255,255,255,0.05);
      font-family: 'JetBrains Mono', monospace;
    }
    @media (max-width: 500px) {
      #fractal-mirror-panel {
        right: 12px;
        left: 12px;
        width: auto;
        bottom: 80px;
        max-height: 60vh;
      }
      #fractal-mirror-btn {
        bottom: 16px;
        right: 16px;
        width: 48px;
        height: 48px;
        font-size: 24px;
      }
    }
  `;
  document.head.appendChild(style);

  // --- HTML da UI ---
  const panelHTML = `
    <div id="fractal-mirror-panel">
      <div class="header">
        <span>🌀 Espelho Fractal</span>
        <button id="fractal-mirror-close">✕</button>
      </div>
      <textarea id="fractal-mirror-input" placeholder="Cole o HTML, JS ou texto a ser injetado..."></textarea>
      <div class="actions">
        <button id="fractal-mirror-inject" class="primary">⚡ Injetar</button>
        <button id="fractal-mirror-clear">Limpar</button>
        <button id="fractal-mirror-paste">📋 Colar</button>
      </div>
      <div class="status" id="fractal-mirror-status">Pronto</div>
      <div class="preview" id="fractal-mirror-preview">—</div>
    </div>
  `;

  // --- Criação dos elementos DOM ---
  const container = document.createElement('div');
  container.innerHTML = `
    <button id="fractal-mirror-btn" title="Abrir Espelho Fractal">🌀</button>
    ${panelHTML}
  `;
  document.body.appendChild(container);

  // --- Referências ---
  const btn = document.getElementById('fractal-mirror-btn');
  const panel = document.getElementById('fractal-mirror-panel');
  const closeBtn = document.getElementById('fractal-mirror-close');
  const input = document.getElementById('fractal-mirror-input');
  const injectBtn = document.getElementById('fractal-mirror-inject');
  const clearBtn = document.getElementById('fractal-mirror-clear');
  const pasteBtn = document.getElementById('fractal-mirror-paste');
  const statusEl = document.getElementById('fractal-mirror-status');
  const previewEl = document.getElementById('fractal-mirror-preview');

  // --- Funções ---
  function togglePanel(open) {
    panel.classList.toggle('open', open);
    if (open) {
      input.focus();
    }
  }

  function setStatus(msg, isError = false) {
    statusEl.textContent = msg;
    statusEl.style.color = isError ? '#f28b82' : '';
  }

  function updatePreview(text) {
    const truncated = text.length > 200 ? text.slice(0, 200) + '…' : text;
    previewEl.textContent = truncated || '—';
  }

  // --- Função de injeção (espelho fractal) ---
  // Recebe um HTML string e o insere no body, recriando scripts.
  function injectHTML(htmlString) {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlString, 'text/html');
      const fragment = document.createDocumentFragment();

      // Move todos os nós do body do HTML injetado para o fragmento
      Array.from(doc.body.childNodes).forEach(node => {
        fragment.appendChild(document.importNode(node, true));
      });

      // Insere no final do body atual
      document.body.appendChild(fragment);

      // Recria todos os scripts (inclusive módulos)
      doc.querySelectorAll('script').forEach(oldScript => {
        const newScript = document.createElement('script');
        // Copia atributos
        Array.from(oldScript.attributes).forEach(attr => {
          newScript.setAttribute(attr.name, attr.value);
        });
        // Se for inline, copia conteúdo
        if (!oldScript.src) {
          newScript.textContent = oldScript.textContent;
        }
        document.body.appendChild(newScript);
      });

      // Também processa scripts que possam ter sido carregados via src? Eles serão baixados normalmente.
      setStatus(`✅ Injetado com sucesso! ${doc.querySelectorAll('script').length} scripts processados.`);
      return true;
    } catch (err) {
      setStatus(`❌ Erro ao injetar: ${err.message}`, true);
      console.error(err);
      return false;
    }
  }

  // --- Eventos ---
  btn.addEventListener('click', () => {
    const isOpen = panel.classList.contains('open');
    togglePanel(!isOpen);
  });

  closeBtn.addEventListener('click', () => {
    togglePanel(false);
  });

  // Fechar ao clicar fora (opcional)
  document.addEventListener('click', (e) => {
    if (panel.classList.contains('open')) {
      const target = e.target;
      if (!panel.contains(target) && target !== btn) {
        togglePanel(false);
      }
    }
  });

  // Injetar
  injectBtn.addEventListener('click', () => {
    const content = input.value.trim();
    if (!content) {
      setStatus('⚠️ Nada para injetar.', true);
      return;
    }
    // Tenta detectar se é HTML (presença de tags) ou JS puro
    // Se for JS puro (não contém '<'), executa como script
    if (!content.includes('<')) {
      try {
        // Avalia como código JavaScript
        const result = eval(content);
        setStatus(`✅ Código executado. Resultado: ${result}`);
        updatePreview(content);
        // Se result for uma string HTML, injeta?
        if (typeof result === 'string' && result.includes('<')) {
          // Opcional: injetar o resultado
          injectHTML(result);
        }
      } catch (err) {
        setStatus(`❌ Erro ao executar: ${err.message}`, true);
      }
      return;
    }

    // Caso contrário, injeta como HTML
    const success = injectHTML(content);
    if (success) {
      updatePreview(content);
    }
  });

  // Clear
  clearBtn.addEventListener('click', () => {
    input.value = '';
    previewEl.textContent = '—';
    setStatus('Limpo.');
  });

  // Paste (usando API de clipboard)
  pasteBtn.addEventListener('click', async () => {
    try {
      const text = await navigator.clipboard.readText();
      input.value = text;
      updatePreview(text);
      setStatus('📋 Conteúdo colado da área de transferência.');
    } catch (err) {
      setStatus('❌ Não foi possível ler a área de transferência. Permissão necessária.', true);
    }
  });

  // Atualizar preview ao digitar
  input.addEventListener('input', () => {
    updatePreview(input.value);
  });

  // Tecla de atalho: Ctrl+Enter para injetar
  input.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'Enter') {
      e.preventDefault();
      injectBtn.click();
    }
  });

  // Inicialização
  setStatus('Pronto. Cole HTML ou JS e clique em Injetar.');
  updatePreview('');

  console.log('🌀 Espelho Fractal ativo. Use o botão flutuante no canto inferior direito.');
})();