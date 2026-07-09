// ESPIRITO/ui/response_handler.js

export class ResponseHandler {
    constructor() {
        this.element = null;
    }

    mount(container) {
        this.element = document.createElement('div');
        this.element.innerHTML = this.getHTML();
        container.appendChild(this.element);
        
        this.initEvents();
        console.log('🧿 ResponseHandler montado');
    }

    getHTML() {
        return `
            <div class="response-container" id="response">
                <div class="page initial active">
                    <strong>Clique no ◉ e diga "Oi, Dual".</strong><br>
                    <em>Sempre único. Sempre seu.</em>
                </div>
                <div class="response-controls">
                    <div class="control-buttons">
                        <button class="control-btn copy-button" title="Copiar tudo">
                            <svg viewBox="0 0 24 24" width="20"><circle cx="12" cy="12" r="10"></circle><rect x="6" y="6" width="12" height="12"></rect></svg>
                        </button>
                        <button class="control-btn paste-button" title="Colar">
                            <svg viewBox="0 0 24 24" width="20"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="4" x2="12" y2="20"></line></svg>
                        </button>
                        <button id="toggleBtnF" class="control-btn toggle-button" title="Check Connection & Training">
                            <svg viewBox="0 0 24 24" width="20" height="20" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M18.36 6.64a9 9 0 1 1-12.73 0"></path>
                                <line x1="12" y1="2" x2="12" y2="12"></line>
                            </svg>
                        </button>
                        <button id="crystalBtn" class="control-btn" title="Cristalizados">
                            <svg viewBox="0 0 24 24" width="20" height="20"><path d="M12 2l2.9 6.3L21 10l-5 3.6L17.8 21 12 17.7 6.2 21 7 13.6 2 10l6.1-1.7L12 2z"></path></svg>
                        </button>
                    </div>
                    <div class="pagination">
                        <button data-action="prev">⟵</button>
                        <span id="pageIndicator">1 / 1</span>
                        <button data-action="next">⟶</button>
                    </div>
                </div>
            </div>

            <div class="input-container">                <input id="userInput" type="text" placeholder="Diga: 'oi, Dual'...">
                <button id="sendBtn" title="Enviar">➤</button>
                <button id="voiceBtn" title="Falar">
                    <object data="Reset_buttom_Dual-Infodose.svg" type="image/svg+xml" width="36" height="36" style="pointer-events: none;"></object>
                </button>
            </div>

            <div id="crystalModal" class="modal">
                <div class="box">
                    <h3>Cristalizados</h3>
                    <div class="row" style="margin-bottom:8px">
                        <button id="exportAllCrystal" class="btn btn-prim">Exportar todos</button>
                        <button id="clearAllCrystal" class="btn btn-sec">Limpar tudo</button>
                    </div>
                    <div class="crystal-list" id="crystalList"></div>
                    <div style="margin-top:12px;display:flex;justify-content:flex-end;gap:8px">
                        <button id="closeCrystal" class="btn btn-sec">Fechar</button>
                    </div>
                </div>
            </div>

            <div id="mantra-toggle">
                <span id="mantra-text">Do seu jeito. <strong>Sempre</strong> único. <strong>Sempre</strong> seu.</span>
            </div>

           <div class="wrap">

  <!-- Container onde os módulos UI serão injetados -->


 <div class="content">
      <iframe id="frame" src="about:blank"></iframe>
      <div id="kob-tts-outline"></div>
    </div>
  </div>

  <!-- ═══ CORPO: ESTRUTURA BASE (Vaso Vazio) ═══ -->
   <!-- ── BACKGROUNDS (1x cada) ─────────────────────────────── -->
  <div class="bg-gradient-base" style="opacity:.39"></div>
  <div id="bg-layer-fixed"></div>
  <div class="nebula"></div>
  <div id="bg-fake-custom"></div>
  <div class="sky-layer"><div class="sun-background"></div></div>


  <div class="ambient-light"><div class="blob blob-1"></div><div class="blob blob-2"></div></div>
  <div id="particles-js"><canvas class="particles-js-canvas-el"></canvas></div>

<section style="min-height:100vh">
  <div id="snap-zone"></div>
 <div class="infodose">dual.<strong>Infodose</strong></div>
</section>

   
 
  <!-- ════════════════════════════════════════════════════════
       HUD · SYMBOL BAR
  ════════════════════════════════════════════════════════ -->
  <div class="symbol-bar floating" id="symbolBar">
    <!-- ORB -->

<div class="blob blob-1"></div><div class="blob blob-2"></div>

    <div class="symbol-toolbar">
      <div class="orb-container">
        <button id="orbBtn" class="orb" aria-label="Toggle System">
          <div class="orb-core"></div>
        </button>
      </div>
    </div>
    

    <!-- Menu toggle -->
    <div class="toggle-wrap">
      <button class="symbol-button main-toggle" id="toggleBtn" title="Menu / Iniciar">≡</button>
    </div>
    <!-- Controles TTS -->
    <div class="symbol-wrap">
      <button class="symbol-button" id="btn-prev" title="Voltar Bloco" data-action="back">◀</button>
    </div>
    <div class="symbol-wrap">
      <button class="symbol-button" id="btn-play" title="Play/Pause" data-action="nav">▶</button>
    </div>
    <div class="symbol-wrap">
      <button class="symbol-button" id="tts-stop" title="Parar" data-action="back">■</button>
    </div>
    <!-- Arquétipo -->
    <button class="symbol-button" id="btn-arch" title="Trocar Arquétipo de Voz">
      <div class="orb-microphone-container">
        <div class="tts-orb-mini">
          <div class="orb-coret" id="main-orb">
            <div class="orb-coret"></div>
          </div>
        </div>
      </div>
    </button>
    <div class="hud-info" id="hudStatus">KOBLLUX · ORB NEXUS</div>
  </div>
  <!-- ── Arch Overlay ──────────────────────────────────────── -->
  <!-- ── Arch Overlay ──────────────────────────────────────── -->
  <div id="arch-overlay"></div>
  <!-- ════════════════════════════════════════════════════════
       SOLAR COCKPIT · ORB TOGGLE
  ════════════════════════════════════════════════════════ -->
  <div class="header-orb" id="orbToggle" title="Acessar Cockpit do Usuário" onclick="toggleDrawer('drawerProfile')">
    <svg><use href="#icon-orb"></use></svg>
  </div>
  <div id="usernameDisplay"></div>
  <div id="drawerOverlay" class="drawer-overlay" onclick="toggleDrawer()"></div>
  <div id="drawerProfile" class="drawer" aria-hidden="true">
    <div class="drawer-content">
      <div class="drawer-header">
        <h3>
          <svg style="width:20px;height:20px;margin-right:8px;stroke:var(--secondary)"><use href="#icon-orb"></use></svg>
          Cockpit Solar
        </h3>
        <button class="btn-icon" style="width:38px;height:38px;border-radius:12px;" onclick="toggleDrawer('drawerProfile')">✕</button>
      </div>
      <div class="drawer-body">
          <div id="bgThumbPanel" style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-top:15px;"></div>
        <div class="cockpit-item" style="text-align:center;margin-bottom:15px;">
          <div class="cockpit-label">Ciclo Solar</div>
          <div id="statusSolarMode" style="font-size:1.2rem;font-weight:bold;margin:5px 0;">AUTO</div>
          <div class="control-row">
            <button class="btn-block" id="btnCycleSolar">Manual ☀️/🌙</button>
            <button class="btn-block" id="btnAutoSolar">Auto 🕒</button>
          </div>
        </div>
        <div class="cockpit-grid">
          <div class="cockpit-item">
            <div class="cockpit-label">Identificação</div>
            <input type="text" id="inputUserId" class="cockpit-input" placeholder="Viajante">
          </div>
          <div class="cockpit-item">
            <div class="cockpit-label">Modelo IA</div>
            <input type="text" id="inputModel" class="cockpit-input" placeholder="google/gemini-2.0-flash-exp">
          </div>
          <div class="cockpit-item">
            <div class="cockpit-label">Background</div>
            <div style="display:flex;justify-content:space-between;align-items:center;">
              <span id="bgStatusText" style="font-size:0.8rem;color:var(--text-muted)">Nenhum</span>
              <label class="btn-icon" style="width:30px;height:30px;border-radius:5px;">
                <input type="file" id="bgUploadInput" accept="image/*" style="display:none">
                <svg><use href="#icon-cards"></use></svg>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- ════════════════════════════════════════════════════════
       KOBLLUX ROUTE EDITOR  (LONG-PRESS · versão legacy — id único)
       ⚠ Este bloco era o 1º kblx-back duplicado.
         IDs renomeados → kblx-legacy-*
  ════════════════════════════════════════════════════════ -->
  <!-- ╔══════════════════════════════════════════╗
       ║  KOBLLUX · LONG-PRESS URL EDITOR (v1)  ║
       ║  Segurar 3s → edita data-url do botão  ║
       ╚══════════════════════════════════════════╝ -->
  <!-- <div id="kblx-legacy-back">
    <div id="kblx-legacy-panel">
      <div class="p-chip">⌘ KOBLLUX HUD · EDITOR DE ROTA</div>
      <div class="p-title" id="kblx-legacy-ttl">Botão</div>
      <label class="p-lbl" for="kblx-legacy-inp">Novo valor para data-url</label>
      <input id="kblx-legacy-inp" type="text" placeholder="arquivo.html  ou  https://..." spellcheck="false" autocomplete="off">
      <div class="kblx-row">
        <button class="kblx-btn kblx-save" id="kblx-legacy-btn-save">⊙ Salvar no botão</button>
        <button class="kblx-btn kblx-close" id="kblx-legacy-btn-close">✕ Fechar</button>
      </div>
    </div>
  </div> -->
  <!-- ════════════════════════════════════════════════════════
       MONOLITH VAULT
  ════════════════════════════════════════════════════════ -->
  <div class="void-ambient"></div>
  <div class="monolith-wrapper">
    <div class="monolith">
      <div class="mono-header">
        <div class="mono-brand">
          <div class="brand-icon"></div>
          <div class="brand-title">DUAL <span style="opacity:0.3; margin:0 4px;">//</span> MONOLITH</div>
        </div>
        <div id="sysStatus" class="status-badge">STANDBY</div>
      </div>
      <div class="mono-body">
        <!-- VAULT VIEW -->
        <div id="viewVault" class="vault-view">
          <div class="actions-grid">
            <button id="createBtn" class="action-card btn-create"><span>NOVO</span></button>
            <div id="dropZone" class="action-card dashed">
              <span style="font-family:var(--font-code)">UPLOAD</span>
            </div>
            <button id="backupBtn" class="action-card"><span>BACKUP</span></button>
            <button id="safeBtn" class="action-card"><span id="safeLabel">SAFE</span></button>
          </div>
          <div class="top-bar">
            <div class="brand-text"></div>
            <div class="sep"></div>
            <button id="themeToggle" class="theme-btn" title="Toggle Theme">
              <i class="fa-solid fa-circle-half-stroke"></i>
            </button>
          </div>
          <!-- Sidebar direita: atalhos de navegação -->
          <div class="sidebar right">
            <button class="symbol-button icon-btnn nav-btn" data-url="https://www.infodose.com.br/splash.html" data-action="nav" data-hover="true" title="Void">Φ</button>
            <button class="symbol-button icon-btnn nav-btn" data-url="https://kodux78k.github.io/oiDual--Y-/M0D/KKP/index.html" title="a€dualDex">꩜</button>
            <button class="symbol-button icon-btnn nav-btn" data-url="https://kodux78k.github.io/oiDual-SmB/" title="a€SUMBUS">☼</button>
            <div class="symbol-wrap">
              <button class="symbol-button" data-id="phi" data-url="https://www.infodose.com.br/oiDual/KODUX/78K/APPS/78F.html">🌌</button>
            </div>
            <div class="symbol-wrap">
              <button class="symbol-button" data-id="viv" data-url="https://www.infodose.com.br/oiDual/KODUX/78K/APPS/78EM.html">🛋️</button>
            </div>
            <div class="symbol-wrap">
              <button class="symbol-button" data-id="home" data-url="https://kodux78k.github.io/oiDual-idHome/">◌</button>
            </div>
            <div class="symbol-wrap">
              <button class="symbol-button" data-id="doc" data-url="https://www.infodose.com.br/oiDual/KODUX/78K/APPS/78NP.html">◘</button>
            </div>
          </div>
          <!-- Sidebar esquerda -->
          <div class="sidebar left">
            <button id="uploadBtn" class="icon-btn" title="Import File">
              <i class="fa-solid fa-upload"></i>
            </button>
            <input type="file" id="uploadInput" hidden="" accept=".html,.js,.json">
            <button id="remoteBtn" class="icon-btn" title="Fetch Remote">
              <i class="fa-solid fa-globe"></i>
            </button>
          </div>
          <div class="list-header">
            <span class="list-label">VAULT STORAGE</span>
            <span class="list-label" id="vaultCount">0 ITEMS</span>
          </div>
          <div id="stackList" class="flex flex-col gap-3" style="padding-bottom:3rem;"></div>
        </div>
        <!-- EDITOR VIEW -->
        <div id="viewEditor" class="editor-view state-translated-x">
          <div class="editor-header">
            <div class="editor-title">:: MODULE CREATOR</div>
            <button id="cancelEditor" class="btn-cancel">CANCELAR</button>
          </div>
          <input id="modTitle" type="text" placeholder="NOME DO MÓDULO" class="input-title">
          <div class="code-area">
            <textarea id="modContent" placeholder=""></textarea>
          </div>
          <div class="flex gap-3">
            <button id="saveEditor" class="btn-save">SALVAR NO VAULT</button>
          </div>
        </div>
      </div>
      <div class="mono-footer">
        <div id="pulseBar"></div>
      </div>
      <!-- RUNTIME LAYER -->
      <div id="runtimeLayer" class="runtime-layer">
        <div class="runtime-bar">
          <div class="runtime-indicator">
            <div class="dot"></div>
            <span>a€Dual // ACTIVE</span>
          </div>
          <div class="flex items-center gap-2">
            <button id="exportBtn" class="btn-cancel" style="font-size:10px;">EXPORT TO NAV</button>
            <button id="closeRuntime" class="icon-btn" style="width:24px;height:24px;border:none;background:transparent;">
              <i data-lucide="x" style="width:16px;"></i>
            </button>
          </div>
        </div>
        <div class="runtime-frame-wrap">
          <iframe id="appFrame" style="border:0;width:100%;height:100%;display:block;" sandbox="allow-scripts allow-forms allow-modals allow-same-origin allow-pointer-lock"></iframe>
          <div class="scanline"></div>
        </div>
      </div>
    </div><!-- .monolith -->
  </div><!-- .monolith-wrapper -->
  <!-- TOAST (Vault) -->
  <div id="toast" class="toast-hidden">
    <span id="toastMsg">System Ready</span>
  </div>
  <!-- ════════════════════════════════════════════════════════
       KOBLLUX QUICK MENU
  ════════════════════════════════════════════════════════ -->
  <div id="kblx-quick">
    <button class="kq-item" data-kq="edit">✦ Editar</button>
    <button class="kq-item" data-kq="symbol">◉ SymbolBar</button>
    <button class="kq-item" data-kq="frame">⟁ Session</button>
    <button class="kq-item" data-kq="dock">⌘ Dock</button>
    <button class="kq-item" data-kq="duplicate">📋 Duplicar</button>
    <button class="kq-item" data-kq="favorite">⭐ Favoritar</button>
    <button class="kq-item" data-kq="full">⋯ Mais</button>
  </div>
            <div id="fusion-soft-layer"></div>
            <div id="navRoot"></div>
        `;
    }

    initEvents() {
        const sendBtn = this.element.querySelector('#sendBtn');
        const userInput = this.element.querySelector('#userInput');
        
        if (sendBtn && userInput) {
            sendBtn.addEventListener('click', () => {
                const text = userInput.value;
                if (text) {
                    console.log('📤 Enviando:', text);
                    userInput.value = '';
                }
            });
        }
    }
}