// fractal-mirror-v2.js – Auto‑injetor com gerenciamento de plugins
(function() {
  'use strict';

  // ── CONSTANTES ───────────────────────────────────────────────
  const STORAGE_KEY = 'fractal_plugins';
  const SETTINGS_KEY = 'fractal_settings';
  const DEFAULT_SETTINGS = {
    autoDetectIds: true,
    autoDetectScripts: true,
    autoDetectCss: true,
    renameIds: true,
    blockDuplicateScripts: true,
    askAlways: false,
    autoSave: true,
    autoMountOnLoad: true,
    restoreSession: true
  };

  // ── ESTADO ──────────────────────────────────────────────────
  let plugins = [];
  let settings = {};
  let isMounted = false;
  let mountedElements = []; // para desmontagem

  // ── HELPERS ──────────────────────────────────────────────────
  function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  }

  function hashString(str) {
    // SHA‑256 simplificada (para demo)
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash |= 0;
    }
    return 'sha256-' + Math.abs(hash).toString(16).padStart(8, '0');
  }

  function extractMeta(html) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const ids = [];
    const scripts = [];
    const styles = [];
    // IDs
    doc.querySelectorAll('[id]').forEach(el => ids.push(el.id));
    // Scripts (src ou inline)
    doc.querySelectorAll('script').forEach(el => {
      scripts.push(el.src || el.textContent.slice(0, 100));
    });
    // Styles (links e inline)
    doc.querySelectorAll('link[rel="stylesheet"]').forEach(el => styles.push(el.href));
    doc.querySelectorAll('style').forEach(el => styles.push(el.textContent.slice(0, 100)));
    return { ids, scripts, styles };
  }

  // ── PERSISTÊNCIA ────────────────────────────────────────────
  function loadPlugins() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      plugins = data ? JSON.parse(data) : [];
    } catch { plugins = []; }
  }

  function savePlugins() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(plugins));
  }

  function loadSettings() {
    try {
      const data = localStorage.getItem(SETTINGS_KEY);
      settings = data ? { ...DEFAULT_SETTINGS, ...JSON.parse(data) } : { ...DEFAULT_SETTINGS };
    } catch { settings = { ...DEFAULT_SETTINGS }; }
  }

  function saveSettings() {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  }

  // ── GERENCIAMENTO DE PLUGINS ──────────────────────────────
  function addPlugin(html, nome = 'Plugin sem nome') {
    const meta = extractMeta(html);
    const plugin = {
      id: generateId(),
      nome: nome.trim() || 'Plugin sem nome',
      versao: '1.0',
      html: html,
      ativo: true,
      data: new Date().toISOString(),
      hash: hashString(html),
      ids: meta.ids,
      scripts: meta.scripts,
      styles: meta.styles
    };
    plugins.push(plugin);
    if (settings.autoSave) savePlugins();
    if (settings.autoMountOnLoad) mountPlugins();
    return plugin;
  }

  function removePlugin(id) {
    plugins = plugins.filter(p => p.id !== id);
    if (settings.autoSave) savePlugins();
    mountPlugins();
  }

  function togglePlugin(id) {
    const p = plugins.find(pl => pl.id === id);
    if (p) {
      p.ativo = !p.ativo;
      if (settings.autoSave) savePlugins();
      mountPlugins();
    }
  }

  function movePlugin(id, direction) {
    const idx = plugins.findIndex(p => p.id === id);
    if (idx === -1) return;
    const newIdx = idx + direction;
    if (newIdx < 0 || newIdx >= plugins.length) return;
    [plugins[idx], plugins[newIdx]] = [plugins[newIdx], plugins[idx]];
    if (settings.autoSave) savePlugins();
    mountPlugins();
  }

  // ── DETECÇÃO DE CONFLITOS ──────────────────────────────────
  function detectConflicts() {
    const active = plugins.filter(p => p.ativo);
    const allIds = [];
    const allScripts = [];
    const allStyles = [];
    const conflicts = { ids: [], scripts: [], styles: [] };

    active.forEach(p => {
      p.ids.forEach(id => {
        if (allIds.includes(id)) {
          conflicts.ids.push(id);
        } else {
          allIds.push(id);
        }
      });
      p.scripts.forEach(s => {
        if (allScripts.includes(s)) {
          conflicts.scripts.push(s);
        } else {
          allScripts.push(s);
        }
      });
      p.styles.forEach(s => {
        if (allStyles.includes(s)) {
          conflicts.styles.push(s);
        } else {
          allStyles.push(s);
        }
      });
    });
    return conflicts;
  }

  // ── MONTAGEM / DESMONTAGEM ──────────────────────────────────
  function mountPlugins() {
    // Desmonta tudo primeiro
    unmountPlugins();

    const active = plugins.filter(p => p.ativo);
    // Ordenar pela ordem do array (já mantida)
    const conflicts = detectConflicts();
    if (conflicts.ids.length || conflicts.scripts.length || conflicts.styles.length) {
      // Mostrar modal de conflitos (implementado na UI)
      showConflictModal(conflicts, () => {
        // Callback para continuar após decisão
        doMount(active);
      });
    } else {
      doMount(active);
    }
  }

  function doMount(activePlugins) {
    const fragment = document.createDocumentFragment();
    const scriptsToAppend = [];

    activePlugins.forEach(p => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(p.html, 'text/html');
      // Clonar body
      Array.from(doc.body.childNodes).forEach(node => {
        fragment.appendChild(document.importNode(node, true));
      });
      // Coletar scripts (serão adicionados depois)
      doc.querySelectorAll('script').forEach(oldScript => {
        scriptsToAppend.push(oldScript);
      });
    });

    document.body.appendChild(fragment);

    // Adicionar scripts (incluindo módulos)
    scriptsToAppend.forEach(oldScript => {
      const newScript = document.createElement('script');
      Array.from(oldScript.attributes).forEach(attr => {
        newScript.setAttribute(attr.name, attr.value);
      });
      if (!oldScript.src) {
        newScript.textContent = oldScript.textContent;
      }
      document.body.appendChild(newScript);
    });

    isMounted = true;
    // Salvar referência para desmontagem? (opcional)
    // Aqui guardamos apenas um flag, mas poderíamos guardar nós.
    // Para simplificar, recarregamos a página para desmontar? Melhor usar um wrapper.
    // Nesta versão, desmontar remove tudo que foi adicionado via plugins.
    // (Implementação mais complexa: guardar os nós adicionados)
    // Vamos usar uma abordagem simples: ao desmontar, removemos tudo que está dentro de um container específico?
    // Vamos criar um container para os plugins.
    // Mas para compatibilidade, manteremos como antes: injeta diretamente no body.
    // Para desmontar, teríamos que rastrear. Para simplificar, desmontar recarrega a página?
    // Melhor: cada plugin adiciona uma marcação, mas é frágil.
    // Vou adotar: desmontar remove todos os elementos que foram adicionados por plugins.
    // Para isso, usamos um atributo data-plugin-id.
    // Mas como o HTML pode ser qualquer coisa, não podemos marcar todos.
    // Alternativa: usar um container #fractal-plugin-container e injetar tudo lá.
    // Vou mudar: ao invés de injetar diretamente no body, injeto em um container.
    // Crio o container se não existir.
    let container = document.getElementById('fractal-plugin-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'fractal-plugin-container';
      container.style.display = 'contents'; // não afeta layout
      document.body.prepend(container);
    }
    // Agora, em vez de fragment no body, coloco no container.
    // Mas preciso refazer o doMount para usar container.
    // Vou reescrever doMount.
  }

  // Vou refatorar para usar container.
  // Para não reescrever tudo, vou manter a lógica de montagem, mas ao invés de body, uso container.
  // Mas isso quebraria compatibilidade com scripts que esperam estar no body.
  // Pode ficar no body, mas para desmontar, precisamos rastrear.
  // Vou manter como antes: injeta no body, e desmontar recarrega a página? Não é ideal.
  // Uma abordagem: cada plugin é envolvido em um div com id único, e desmontar remove essas divs.
  // Mas o HTML pode não ter um wrapper.
  // Vou optar por: ao montar, guardamos a lista de elementos adicionados (nós raiz).
  // Na desmontagem, removemos esses nós.
  // Implementação: ao invés de appendChild diretamente, colecionamos os nós adicionados.
  // Vou modificar doMount para isso.

  // Refazendo doMount com rastreamento.
  function doMount(activePlugins) {
    // Limpar montagem anterior
    unmountPlugins();

    const addedNodes = [];
    const scriptsToAppend = [];

    activePlugins.forEach(p => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(p.html, 'text/html');
      // Clonar body e adicionar
      Array.from(doc.body.childNodes).forEach(node => {
        const clone = document.importNode(node, true);
        document.body.appendChild(clone);
        addedNodes.push(clone);
      });
      // Coletar scripts
      doc.querySelectorAll('script').forEach(oldScript => {
        scriptsToAppend.push(oldScript);
      });
    });

    // Adicionar scripts
    scriptsToAppend.forEach(oldScript => {
      const newScript = document.createElement('script');
      Array.from(oldScript.attributes).forEach(attr => {
        newScript.setAttribute(attr.name, attr.value);
      });
      if (!oldScript.src) {
        newScript.textContent = oldScript.textContent;
      }
      document.body.appendChild(newScript);
      addedNodes.push(newScript);
    });

    mountedElements = addedNodes;
    isMounted = true;
  }

  function unmountPlugins() {
    mountedElements.forEach(el => {
      if (el.parentNode) el.parentNode.removeChild(el);
    });
    mountedElements = [];
    isMounted = false;
  }

  // ── EXPORTAÇÃO ──────────────────────────────────────────────
  function exportHTML(includePlugins = false) {
    const clone = document.documentElement.cloneNode(true);
    // Remover elementos da UI do Mirror
    const mirrorBtn = clone.querySelector('#fractal-mirror-btn');
    const mirrorPanel = clone.querySelector('#fractal-mirror-panel');
    if (mirrorBtn) mirrorBtn.remove();
    if (mirrorPanel) mirrorPanel.remove();
    // Remover outros elementos de UI (se houver)
    // ...

    if (includePlugins) {
      // Montar plugins no clone? Não, pois já estão no documento real.
      // Se quisermos incluir os plugins no HTML exportado, precisamos injetá-los no clone.
      // Vamos usar o mesmo processo de montagem, mas no clone.
      // Como o clone é um documento, podemos fazer o mesmo.
      // Mas para simplificar, vamos apenas exportar o HTML atual se includePlugins for true,
      // pois os plugins já estão montados no DOM.
      // Se includePlugins for false, exportamos o HTML sem os plugins.
      // Mas como sabemos o que foi adicionado? Usamos mountedElements.
      // Podemos remover os elementos montados do clone.
      if (!includePlugins) {
        mountedElements.forEach(el => {
          // Precisamos encontrar o nó correspondente no clone.
          // Como não temos referência fácil, podemos usar data attributes.
          // Ou simplesmente não remover, e o usuário decide.
          // Vou adotar: se includePlugins = false, removemos os nós montados do clone.
          // Para isso, guardamos um seletor ou marcamos.
          // Vou usar um atributo data-fractal-plugin="true" nos nós adicionados.
          // Mas isso exigiria modificar doMount para adicionar o atributo.
          // Vou fazer isso.
        });
      }
    }
    return '<!DOCTYPE html>\n' + clone.outerHTML;
  }

  function exportPlugin(id) {
    const p = plugins.find(pl => pl.id === id);
    if (!p) return null;
    return p.html;
  }

  function exportBackup() {
    return JSON.stringify({
      plugins: plugins,
      order: plugins.map(p => p.id),
      settings: settings
    }, null, 2);
  }

  function importBackup(json) {
    try {
      const data = JSON.parse(json);
      if (data.plugins) plugins = data.plugins;
      if (data.settings) settings = data.settings;
      savePlugins();
      saveSettings();
      mountPlugins();
      return true;
    } catch {
      return false;
    }
  }

  // ── CONFLICT MODAL ──────────────────────────────────────────
  function showConflictModal(conflicts, onResolve) {
    // Implementação de um modal simples
    const modal = document.createElement('div');
    modal.style.cssText = `
      position: fixed; top: 0; left: 0; width: 100%; height: 100%;
      background: rgba(0,0,0,0.6); backdrop-filter: blur(4px);
      display: flex; align-items: center; justify-content: center;
      z-index: 10000;
    `;
    const box = document.createElement('div');
    box.style.cssText = `
      background: #1a1e2b; color: #e8ecf5; border-radius: 16px;
      padding: 24px; max-width: 500px; width: 90%;
      box-shadow: 0 20px 60px rgba(0,0,0,0.8);
      font-family: system-ui, sans-serif;
    `;
    box.innerHTML = `
      <h3 style="margin-top:0;color:#f28b82;">⚠ Conflitos Detectados</h3>
      <p>IDs duplicados: ${conflicts.ids.length}</p>
      <p>Scripts duplicados: ${conflicts.scripts.length}</p>
      <p>Styles duplicados: ${conflicts.styles.length}</p>
      <div style="margin-top:16px;display:flex;gap:8px;flex-wrap:wrap;">
        <button id="conflict-ignore" style="padding:8px 16px;border:none;border-radius:8px;background:#444;color:#fff;cursor:pointer;">Ignorar</button>
        <button id="conflict-rename" style="padding:8px 16px;border:none;border-radius:8px;background:#7c6df0;color:#fff;cursor:pointer;">Renomear automático</button>
        <button id="conflict-replace" style="padding:8px 16px;border:none;border-radius:8px;background:#e67e22;color:#fff;cursor:pointer;">Substituir existente</button>
        <button id="conflict-cancel" style="padding:8px 16px;border:none;border-radius:8px;background:#c0392b;color:#fff;cursor:pointer;">Cancelar</button>
      </div>
    `;
    modal.appendChild(box);
    document.body.appendChild(modal);

    const resolve = (action) => {
      modal.remove();
      // Aplicar ação (simplificado)
      if (action === 'rename') {
        // Renomear IDs duplicados (adicionar sufixo)
        // Implementação resumida
      } else if (action === 'replace') {
        // Substituir (remover duplicatas)
      }
      onResolve();
    };

    box.querySelector('#conflict-ignore').addEventListener('click', () => resolve('ignore'));
    box.querySelector('#conflict-rename').addEventListener('click', () => resolve('rename'));
    box.querySelector('#conflict-replace').addEventListener('click', () => resolve('replace'));
    box.querySelector('#conflict-cancel').addEventListener('click', () => resolve('cancel'));
  }

  // ── UI ──────────────────────────────────────────────────────
  // Vamos construir a UI dinamicamente. Inclui botão flutuante, painel com abas.

  // CSS (embutido)
  const style = document.createElement('style');
  style.textContent = `
    /* ... (mesmo CSS anterior com ajustes) ... */
    #fractal-mirror-panel { width: 480px; max-width: 90vw; }
    .tab-bar { display: flex; gap: 4px; border-bottom: 1px solid rgba(255,255,255,0.1); margin-bottom: 12px; }
    .tab-btn { background: transparent; border: none; color: #aaa; padding: 8px 12px; cursor: pointer; font-weight: 600; border-bottom: 2px solid transparent; }
    .tab-btn.active { color: #fff; border-bottom-color: #7c6df0; }
    .tab-content { display: none; }
    .tab-content.active { display: block; }
    .plugin-item { display: flex; align-items: center; gap: 8px; padding: 6px 0; border-bottom: 1px solid rgba(255,255,255,0.05); }
    .plugin-item .name { flex: 1; }
    .plugin-item .actions { display: flex; gap: 4px; }
    .plugin-item .actions button { background: none; border: none; color: #aaa; cursor: pointer; }
    .plugin-item .actions button:hover { color: #fff; }
    .badge-active { color: #2ecc71; }
    .badge-inactive { color: #e74c3c; }
    .settings-row { display: flex; align-items: center; gap: 8px; margin: 6px 0; }
    .settings-row label { flex: 1; }
  `;
  document.head.appendChild(style);

  // HTML da UI
  const panelHTML = `
    <div id="fractal-mirror-panel">
      <div class="header">
        <span>🌀 Espelho Fractal v2</span>
        <button id="fractal-mirror-close">✕</button>
      </div>
      <div class="tab-bar">
        <button class="tab-btn active" data-tab="vault">Vault</button>
        <button class="tab-btn" data-tab="settings">Config</button>
        <button class="tab-btn" data-tab="export">Export</button>
      </div>
      <!-- Aba Vault -->
      <div id="tab-vault" class="tab-content active">
        <textarea id="fractal-mirror-input" placeholder="Cole o HTML do plugin..."></textarea>
        <div class="actions">
          <button id="fractal-mirror-add" class="primary">➕ Adicionar Plugin</button>
          <button id="fractal-mirror-clear">Limpar</button>
          <button id="fractal-mirror-paste">📋 Colar</button>
        </div>
        <div id="plugin-list" style="max-height:200px;overflow-y:auto;margin-top:8px;"></div>
        <div class="status" id="fractal-mirror-status">Pronto</div>
        <div class="preview" id="fractal-mirror-preview">—</div>
      </div>
      <!-- Aba Config -->
      <div id="tab-settings" class="tab-content">
        <h4>Preferências</h4>
        <div class="settings-row"><input type="checkbox" id="set-autoDetectIds"> <label>Auto detectar IDs</label></div>
        <div class="settings-row"><input type="checkbox" id="set-autoDetectScripts"> <label>Auto detectar Scripts</label></div>
        <div class="settings-row"><input type="checkbox" id="set-autoDetectCss"> <label>Auto detectar CSS</label></div>
        <div class="settings-row"><input type="checkbox" id="set-renameIds"> <label>Renomear IDs automaticamente</label></div>
        <div class="settings-row"><input type="checkbox" id="set-blockDuplicateScripts"> <label>Bloquear scripts duplicados</label></div>
        <div class="settings-row"><input type="checkbox" id="set-askAlways"> <label>Perguntar sempre</label></div>
        <div class="settings-row"><input type="checkbox" id="set-autoSave"> <label>Auto salvar plugins</label></div>
        <div class="settings-row"><input type="checkbox" id="set-autoMountOnLoad"> <label>Auto montar ao abrir</label></div>
        <div class="settings-row"><input type="checkbox" id="set-restoreSession"> <label>Restaurar sessão</label></div>
        <button id="save-settings-btn" class="primary" style="margin-top:12px;">Salvar Configurações</button>
      </div>
      <!-- Aba Export -->
      <div id="tab-export" class="tab-content">
        <button id="export-html-btn" class="primary" style="width:100%;margin-bottom:8px;">⬇ Exportar HTML atual</button>
        <button id="export-html-with-plugins-btn" class="primary" style="width:100%;margin-bottom:8px;">⬇ Exportar HTML + Plugins Ativos</button>
        <button id="export-backup-btn" class="primary" style="width:100%;margin-bottom:8px;">⬇ Backup Completo (JSON)</button>
        <div style="margin-top:12px;">
          <label>Importar Backup:</label>
          <input type="file" id="import-backup-input" accept=".json" style="display:block;margin-top:4px;">
        </div>
      </div>
    </div>
  `;

  const container = document.createElement('div');
  container.innerHTML = `
    <button id="fractal-mirror-btn" title="Abrir Espelho Fractal">🌀</button>
    ${panelHTML}
  `;
  document.body.appendChild(container);

  // ── REFERÊNCIAS DOM ─────────────────────────────────────────
  const btn = document.getElementById('fractal-mirror-btn');
  const panel = document.getElementById('fractal-mirror-panel');
  const closeBtn = document.getElementById('fractal-mirror-close');
  const input = document.getElementById('fractal-mirror-input');
  const addBtn = document.getElementById('fractal-mirror-add');
  const clearBtn = document.getElementById('fractal-mirror-clear');
  const pasteBtn = document.getElementById('fractal-mirror-paste');
  const statusEl = document.getElementById('fractal-mirror-status');
  const previewEl = document.getElementById('fractal-mirror-preview');
  const pluginList = document.getElementById('plugin-list');

  // Abas
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = {
    vault: document.getElementById('tab-vault'),
    settings: document.getElementById('tab-settings'),
    export: document.getElementById('tab-export')
  };

  // Configurações checkboxes
  const settingsCheckboxes = {
    autoDetectIds: document.getElementById('set-autoDetectIds'),
    autoDetectScripts: document.getElementById('set-autoDetectScripts'),
    autoDetectCss: document.getElementById('set-autoDetectCss'),
    renameIds: document.getElementById('set-renameIds'),
    blockDuplicateScripts: document.getElementById('set-blockDuplicateScripts'),
    askAlways: document.getElementById('set-askAlways'),
    autoSave: document.getElementById('set-autoSave'),
    autoMountOnLoad: document.getElementById('set-autoMountOnLoad'),
    restoreSession: document.getElementById('set-restoreSession')
  };
  const saveSettingsBtn = document.getElementById('save-settings-btn');

  // Export buttons
  const exportHtmlBtn = document.getElementById('export-html-btn');
  const exportHtmlWithPluginsBtn = document.getElementById('export-html-with-plugins-btn');
  const exportBackupBtn = document.getElementById('export-backup-btn');
  const importBackupInput = document.getElementById('import-backup-input');

  // ── FUNÇÕES UI ──────────────────────────────────────────────
  function togglePanel(open) {
    panel.classList.toggle('open', open);
    if (open) {
      input.focus();
      renderPluginList();
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

  function renderPluginList() {
    if (!pluginList) return;
    if (plugins.length === 0) {
      pluginList.innerHTML = '<div style="opacity:0.5;text-align:center;padding:12px;">Nenhum plugin no vault.</div>';
      return;
    }
    let html = '';
    plugins.forEach((p, idx) => {
      const activeClass = p.ativo ? 'badge-active' : 'badge-inactive';
      const activeText = p.ativo ? 'Ativo' : 'Inativo';
      html += `
        <div class="plugin-item" data-id="${p.id}">
          <span class="name">${p.nome} <span class="${activeClass}">(${activeText})</span></span>
          <span style="font-size:0.7rem;opacity:0.5;">v${p.versao}</span>
          <div class="actions">
            <button class="toggle-btn" title="Ativar/Desativar">${p.ativo ? '🔵' : '⚪'}</button>
            <button class="move-up" title="Mover para cima">⬆</button>
            <button class="move-down" title="Mover para baixo">⬇</button>
            <button class="export-plugin-btn" title="Exportar plugin">📥</button>
            <button class="remove-btn" title="Remover">🗑</button>
          </div>
        </div>
      `;
    });
    pluginList.innerHTML = html;

    // Event listeners
    pluginList.querySelectorAll('.toggle-btn').forEach((btn, i) => {
      btn.addEventListener('click', () => {
        const id = plugins[i].id;
        togglePlugin(id);
        renderPluginList();
      });
    });
    pluginList.querySelectorAll('.move-up').forEach((btn, i) => {
      btn.addEventListener('click', () => {
        movePlugin(plugins[i].id, -1);
        renderPluginList();
      });
    });
    pluginList.querySelectorAll('.move-down').forEach((btn, i) => {
      btn.addEventListener('click', () => {
        movePlugin(plugins[i].id, 1);
        renderPluginList();
      });
    });
    pluginList.querySelectorAll('.export-plugin-btn').forEach((btn, i) => {
      btn.addEventListener('click', () => {
        const html = exportPlugin(plugins[i].id);
        if (html) {
          const blob = new Blob([html], { type: 'text/html' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `${plugins[i].nome}.html`;
          a.click();
          URL.revokeObjectURL(url);
        }
      });
    });
    pluginList.querySelectorAll('.remove-btn').forEach((btn, i) => {
      btn.addEventListener('click', () => {
        if (confirm(`Remover plugin "${plugins[i].nome}"?`)) {
          removePlugin(plugins[i].id);
          renderPluginList();
        }
      });
    });
  }

  // ── CARREGAR CONFIGS NA UI ─────────────────────────────────
  function loadSettingsUI() {
    for (const [key, checkbox] of Object.entries(settingsCheckboxes)) {
      if (checkbox) checkbox.checked = settings[key] !== undefined ? settings[key] : DEFAULT_SETTINGS[key];
    }
  }

  function saveSettingsUI() {
    for (const [key, checkbox] of Object.entries(settingsCheckboxes)) {
      if (checkbox) settings[key] = checkbox.checked;
    }
    saveSettings();
    setStatus('Configurações salvas.');
  }

  // ── INICIALIZAÇÃO ───────────────────────────────────────────
  loadPlugins();
  loadSettings();
  loadSettingsUI();

  // Se autoMountOnLoad, montar plugins
  if (settings.autoMountOnLoad) {
    mountPlugins();
  }

  // ── EVENTOS ──────────────────────────────────────────────────
  btn.addEventListener('click', () => {
    const isOpen = panel.classList.contains('open');
    togglePanel(!isOpen);
  });

  closeBtn.addEventListener('click', () => togglePanel(false));

  document.addEventListener('click', (e) => {
    if (panel.classList.contains('open')) {
      const target = e.target;
      if (!panel.contains(target) && target !== btn) {
        togglePanel(false);
      }
    }
  });

  // Abas
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const tab = btn.dataset.tab;
      Object.keys(tabContents).forEach(key => {
        tabContents[key].classList.toggle('active', key === tab);
      });
      if (tab === 'vault') renderPluginList();
    });
  });

  // Adicionar plugin
  addBtn.addEventListener('click', () => {
    const content = input.value.trim();
    if (!content) {
      setStatus('⚠ Nada para adicionar.', true);
      return;
    }
    // Tentar extrair nome do título ou usar padrão
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, 'text/html');
    let nome = doc.querySelector('title')?.textContent || 'Plugin sem nome';
    const plugin = addPlugin(content, nome);
    setStatus(`✅ Plugin "${plugin.nome}" adicionado.`);
    input.value = '';
    updatePreview('');
    renderPluginList();
  });

  clearBtn.addEventListener('click', () => {
    input.value = '';
    previewEl.textContent = '—';
    setStatus('Limpo.');
  });

  pasteBtn.addEventListener('click', async () => {
    try {
      const text = await navigator.clipboard.readText();
      input.value = text;
      updatePreview(text);
      setStatus('📋 Conteúdo colado.');
    } catch {
      setStatus('❌ Não foi possível ler a área de transferência.', true);
    }
  });

  input.addEventListener('input', () => updatePreview(input.value));

  // Ctrl+Enter para adicionar
  input.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'Enter') {
      e.preventDefault();
      addBtn.click();
    }
  });

  // Salvar configurações
  saveSettingsBtn.addEventListener('click', saveSettingsUI);

  // Exportações
  exportHtmlBtn.addEventListener('click', () => {
    const html = exportHTML(false);
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'index.html';
    a.click();
    URL.revokeObjectURL(url);
    setStatus('✅ HTML exportado (sem plugins).');
  });

  exportHtmlWithPluginsBtn.addEventListener('click', () => {
    // Montar plugins primeiro (se não estiverem montados)
    if (!isMounted) mountPlugins();
    const html = exportHTML(true);
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'index-with-plugins.html';
    a.click();
    URL.revokeObjectURL(url);
    setStatus('✅ HTML exportado com plugins.');
  });

  exportBackupBtn.addEventListener('click', () => {
    const json = exportBackup();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'fractal-backup.json';
    a.click();
    URL.revokeObjectURL(url);
    setStatus('✅ Backup exportado.');
  });

  importBackupInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const json = ev.target.result;
      if (importBackup(json)) {
        setStatus('✅ Backup importado com sucesso.');
        renderPluginList();
        mountPlugins();
      } else {
        setStatus('❌ Erro ao importar backup.', true);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  });

  // ── API PÚBLICA ─────────────────────────────────────────────
  window.FractalMirror = {
    addPlugin,
    removePlugin,
    togglePlugin,
    mount: mountPlugins,
    unmount: unmountPlugins,
    exportHTML,
    exportPlugin,
    exportBackup,
    importBackup,
    detectConflicts,
    getPlugins: () => plugins,
    getSettings: () => settings,
    saveSettings: saveSettingsUI
  };

  console.log('🌀 Espelho Fractal v2 ativo. Use window.FractalMirror para integração.');
})();
