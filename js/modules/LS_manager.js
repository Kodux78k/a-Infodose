// =========================================
// 10. GERENCIADOR DE FRACTAIS DA SESSÃO
// =========================================

const SESSION_STORAGE_KEY = 'kobllux_session_files';
let SESSION_FILES = JSON.parse(localStorage.getItem(SESSION_STORAGE_KEY) || '[]');

// Captura toda vez que gerar fractal
function saveFractalToSession(archName, sentence, timestamp = Date.now()) {
  const file = {
    id: `fractal_${timestamp}_${Math.random().toString(36).slice(2,8)}`,
    arch: archName,
    archDisplay: ARCH_NAMES[archName] || archName,
    content: sentence,
    timestamp: timestamp,
    date: new Date(timestamp).toLocaleString('pt-BR'),
    selected: false
  };
  SESSION_FILES.unshift(file); // mais recente primeiro
  localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(SESSION_FILES));
  updateSessionCounter();
}

// Hook na generateFractals() existente
const _originalGenerateFractals = generateFractals;
generateFractals = function() {
  _originalGenerateFractals();

  // Captura cada bloco gerado
  setTimeout(() => {
    const blocks = document.querySelectorAll('.para-block');
    blocks.forEach(block => {
      const arch = block.getAttribute('data-arch') || dom.archSelect.value;
      const content = block.querySelector('.content-inner')?.innerText || '';
      if (content) saveFractalToSession(arch, content);
    });
    if (blocks.length) showToaster(`${blocks.length} fractais salvos na sessão`, 'success');
  }, 100);
};

// UI do Modal de Downloads
function createDownloadModal() {
  if (document.getElementById('sessionDownloadModal')) return;

  const modal = document.createElement('div');
  modal.id = 'sessionDownloadModal';
  modal.className = 'modal-overlay';
  modal.style.display = 'none';
  modal.innerHTML = `
    <div class="modal-content glass" style="max-width: 700px;">
      <div class="modal-header">
        <h2><i data-lucide="download-cloud"></i> Fractais da Sessão</h2>
        <button id="closeSessionModal" class="icon-btn"><i data-lucide="x"></i></button>
      </div>

      <div class="modal-toolbar">
        <div class="session-stats">
          <span id="sessionCount">0</span> fractais ·
          <span id="sessionSelected">0</span> selecionados
        </div>
        <div class="toolbar-actions">
          <button id="selectAllBtn" class="small-btn">Selecionar Todos</button>
          <button id="clearSessionBtn" class="small-btn danger">Limpar Sessão</button>
        </div>
      </div>

      <div id="sessionFileList" class="session-list"></div>

      <div class="modal-footer">
        <button id="downloadSelectedBtn" class="btn btn-primary">
          <i data-lucide="download"></i> Baixar Selecionados (.zip)
        </button>
        <button id="downloadAllTxtBtn" class="btn btn-sec">
          <i data-lucide="file-text"></i> Exportar Tudo (.txt)
        </button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);

  // Eventos
  document.getElementById('closeSessionModal').onclick = () => modal.style.display = 'none';
  document.getElementById('selectAllBtn').onclick = toggleSelectAll;
  document.getElementById('clearSessionBtn').onclick = clearSession;
  document.getElementById('downloadSelectedBtn').onclick = downloadSelectedZip;
  document.getElementById('downloadAllTxtBtn').onclick = downloadAllTxt;

  lucide.createIcons();
}

function openSessionModal() {
  createDownloadModal();
  renderSessionList();
  document.getElementById('sessionDownloadModal').style.display = 'flex';
}

function renderSessionList() {
  const list = document.getElementById('sessionFileList');
  const count = document.getElementById('sessionCount');
  const selected = document.getElementById('sessionSelected');

  if (!list) return;

  list.innerHTML = '';
  count.textContent = SESSION_FILES.length;
  selected.textContent = SESSION_FILES.filter(f => f.selected).length;

  if (SESSION_FILES.length === 0) {
    list.innerHTML = '<div class="empty-state">Nenhum fractal gerado ainda. Use o Gerador 3·6·9.</div>';
    return;
  }

  SESSION_FILES.forEach(file => {
    const item = document.createElement('div');
    item.className = `session-item ${file.selected? 'selected' : ''}`;
    item.innerHTML = `
      <label class="session-checkbox">
        <input type="checkbox" ${file.selected? 'checked' : ''} data-id="${file.id}">
        <span class="checkmark"></span>
      </label>
      <div class="session-meta">
        <div class="session-arch" style="color: var(--arch-${file.arch})">
          ${file.archDisplay} · Δ
        </div>
        <div class="session-content">${escapeHtml(file.content.slice(0, 120))}...</div>
        <div class="session-date">${file.date}</div>
      </div>
      <button class="small-btn" onclick="copySessionFile('${file.id}')">
        <i data-lucide="copy" style="width:14px"></i>
      </button>
    `;

    item.querySelector('input').onchange = (e) => {
      file.selected = e.target.checked;
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(SESSION_FILES));
      renderSessionList();
    };

    list.appendChild(item);
  });

  lucide.createIcons();
}

function toggleSelectAll() {
  const allSelected = SESSION_FILES.every(f => f.selected);
  SESSION_FILES.forEach(f => f.selected =!allSelected);
  localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(SESSION_FILES));
  renderSessionList();
}

function clearSession() {
  if (!confirm('Apagar todos os fractais desta sessão?')) return;
  SESSION_FILES = [];
  localStorage.removeItem(SESSION_STORAGE_KEY);
  renderSessionList();
  showToaster('Sessão limpa', 'success');
}

window.copySessionFile = async (id) => {
  const file = SESSION_FILES.find(f => f.id === id);
  if (!file) return;
  await navigator.clipboard.writeText(file.content);
  showToaster('Fractal copiado', 'success');
};

async function downloadSelectedZip() {
  const selected = SESSION_FILES.filter(f => f.selected);
  if (selected.length === 0) {
    showToaster('Nenhum fractal selecionado', true);
    return;
  }

  // Gera ZIP usando JSZip
  if (!window.JSZip) {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js';
    document.head.appendChild(script);
    await new Promise(r => script.onload = r);
  }

  const zip = new JSZip();
  const folder = zip.folder(`KOBLLUX_Sessao_${Date.now()}`);

  selected.forEach((file, i) => {
    const filename = `${String(i+1).padStart(3,'0')}_${file.arch}_${file.id}.txt`;
    const header = `ARQUÉTIPO: ${file.archDisplay}\nDATA: ${file.date}\nID: ${file.id}\n${'='.repeat(50)}\n\n`;
    folder.file(filename, header + file.content);
  });

  // Adiciona manifesto
  const manifest = {
    session_date: new Date().toISOString(),
    total_fractals: selected.length,
    archetypes: [...new Set(selected.map(f => f.arch))],
    motor: `+${di_engineStep} · ${di_reverse? 'Reverse' : 'Forward'} · salto+${di_jump}`
  };
  folder.file('_manifesto.json', JSON.stringify(manifest, null, 2));

  const blob = await zip.generateAsync({ type: 'blob' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `KOBLLUX_Fractais_${new Date().toISOString().slice(0,10)}.zip`;
  a.click();
  URL.revokeObjectURL(a.href);

  showToaster(`${selected.length} fractais baixados`, 'success');
}

function downloadAllTxt() {
  if (SESSION_FILES.length === 0) {
    showToaster('Sessão vazia', true);
    return;
  }

  let txt = `KOBLLUX · SESSÃO COMPLETA\n`;
  txt += `Data: ${new Date().toLocaleString('pt-BR')}\n`;
  txt += `Motor: +${di_engineStep} · ${di_reverse? 'Reverse' : 'Forward'} · salto+${di_jump}\n`;
  txt += `Total: ${SESSION_FILES.length} fractais\n`;
  txt += `${'='.repeat(60)}\n\n`;

  SESSION_FILES.forEach((file, i) => {
    txt += `[${i+1}] ${file.archDisplay.toUpperCase()} · ${file.date}\n`;
    txt += `${'-'.repeat(60)}\n`;
    txt += `${file.content}\n\n`;
  });

  const blob = new Blob([txt], { type: 'text/plain;charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `KOBLLUX_Sessao_Completa_${Date.now()}.txt`;
  a.click();
  URL.revokeObjectURL(a.href);
  showToaster('Sessão exportada', 'success');
}

function updateSessionCounter() {
  const btn = document.getElementById('sessionDownloadBtn');
  if (btn) {
    const count = SESSION_FILES.length;
    btn.innerHTML = `<i data-lucide="download-cloud"></i> Sessão (${count})`;
    lucide.createIcons();
  }
}

// Adiciona botão na toolbar principal
function injectSessionButton() {
  const toolbar = document.querySelector('.main-toolbar') || document.querySelector('.toolbar') || dom.genBtn?.parentElement;
  if (!toolbar || document.getElementById('sessionDownloadBtn')) return;

  const btn = document.createElement('button');
  btn.id = 'sessionDownloadBtn';
  btn.className = 'btn btn-sec';
  btn.innerHTML = `<i data-lucide="download-cloud"></i> Sessão (0)`;
  btn.onclick = openSessionModal;
  toolbar.appendChild(btn);
  lucide.createIcons();
}

// CSS injetado
const sessionCSS = `
.modal-overlay {
  position: fixed; inset: 0; background: rgba(0,0,0,0.8);
  display: flex; align-items: center; justify-content: center;
  z-index: 9999; backdrop-filter: blur(10px);
}
.modal-content {
  width: 90%; max-height: 85vh; overflow: hidden;
  display: flex; flex-direction: column; border-radius: 20px;
}
.modal-header {
  display: flex; justify-content: space-between; align-items: center;
  padding: 20px; border-bottom: 1px solid rgba(255,255,255,0.1);
}
.modal-toolbar {
  display: flex; justify-content: space-between; align-items: center;
  padding: 12px 20px; border-bottom: 1px solid rgba(255,255,255,0.1);
}
.session-stats { font-size: 0.85rem; opacity: 0.7; }
.session-list {
  flex: 1; overflow-y: auto; padding: 10px;
}
.session-item {
  display: flex; gap: 12px; padding: 12px; margin-bottom: 8px;
  background: rgba(255,255,0.03); border-radius: 12px;
  border: 1px solid transparent; transition: all 0.2s;
}
.session-item.selected {
  background: rgba(0,242,255,0.1);
  border-color: var(--neon-cyan);
}
.session-checkbox { padding-top: 4px; }
.session-meta { flex: 1; min-width: 0; }
.session-arch { font-weight: 700; font-size: 0.85rem; margin-bottom: 4px; }
.session-content {
  font-size: 0.8rem; opacity: 0.8; line-height: 1.4;
  overflow: hidden; text-overflow: ellipsis; display: -webkit-box;
  -webkit-line-clamp: 2; -webkit-box-orient: vertical;
}
.session-date { font-size: 0.7rem; opacity: 0.5; margin-top: 4px; }
.modal-footer {
  padding: 20px; border-top: 1px solid rgba(255,255,255,0.1);
  display: flex; gap: 10px;
}
.empty-state {
  text-align: center; padding: 40px; opacity: 0.5;
}
`;

const style = document.createElement('style');
style.textContent = sessionCSS;
document.head.appendChild(style);

// Inicializa
setTimeout(() => {
  injectSessionButton();
  updateSessionCounter();
}, 500);

console.log('[KODUX] Gerenciador de Sessão ativo');
