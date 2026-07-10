// ESPIRITO/ui/swiss_knife.js
// ─────────────────────────────────────────────────────────────
// Canivete Suíço · versão modular
// Extraído do monólito HTML original. Segue o mesmo contrato de
// ResponseHandler: mount(container) → injeta HTML + liga eventos.
// Não injeta CSS/fontes/scripts externos — isso é papel do
// bootloader (SEMENTE/bootloader.js, fase phaseCSS/phaseExternal).
// ─────────────────────────────────────────────────────────────

export class SwissKnifeUI {
    constructor() {
        this.element = null;
        this._pressTimer = null;
    }

    mount(container) {
        this.element = document.createElement('div');
        this.element.id = 'swiss-knife-root';
        this.element.innerHTML = this.getHTML();
        container.appendChild(this.element);

        this.initEvents();
        console.log('🔪 SwissKnifeUI montado');
        document.dispatchEvent(new CustomEvent('kobllux:swissknife-ready'));
    }

    getHTML() {
        return `
        <!-- ── BACKGROUNDS (1x cada) ─────────────────────────── -->
        <div class="bg-gradient-base" style="opacity:.39"></div>
        <div id="bg-layer-fixed"></div>
        <div class="nebula"></div>
        <div id="bg-fake-custom"></div>
        <div class="sky-layer"><div class="sun-background"></div></div>
        <div class="ambient-light"></div>
        <div id="particles"></div>

        <!-- ── DISTORTION SVG ────────────────────────────────── -->
        <svg style="display:none;">
          <filter id="distort">
            <feTurbulence baseFrequency="0.01" numOctaves="3" result="turb"></feTurbulence>
            <feDisplacementMap in="SourceGraphic" in2="turb" scale="30"></feDisplacementMap>
          </filter>
        </svg>

        <!-- ── ICON SPRITES ──────────────────────────────────── -->
        <svg style="display:none;">
          <symbol id="icon-orb" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="7"></circle>
            <circle cx="12" cy="12" r="8"></circle>
          </symbol>
          <symbol id="icon-cards" viewBox="0 0 24 24">
            <rect x="2" y="2" width="16" height="16" rx="2"></rect>
            <path d="M22 6v14a2 2 0 0 1-2 2H6"></path>
          </symbol>
          <symbol id="icon-gem" viewBox="0 0 24 24">
            <path d="M6 3h12l4 6-10 12L2 9z"></path>
          </symbol>
        </svg>

        <!-- ── ÁUDIO ─────────────────────────────────────────── -->
        <audio id="transitionSound" src="https://kodux78k.github.io/oiDual-oiio/suave_portal.mp3" preload="auto"></audio>
        <div id="modeIndicator">CARREGANDO nO.Sºlar...</div>
        <div id="snap-zone"></div>
        <div class="toaster-wrap" id="toasterWrap"></div>
        <div id="nv-toast"></div>

        <!-- ── SYMBOL BAR ────────────────────────────────────── -->
        <div class="symbol-bar floating" id="symbolBar">
          <div class="blob blob-1"></div><div class="blob blob-2"></div>
          <div class="symbol-toolbar">
            <div class="orb-container">
              <button id="orbBtn" class="orb" aria-label="Toggle System">
                <div class="orb-core"></div>
              </button>
            </div>
          </div>
          <div class="toggle-wrap">
            <button class="symbol-button main-toggle" id="toggleBtn" title="Menu / Iniciar">≡</button>
          </div>
          <div class="symbol-wrap">
            <button class="symbol-button" id="btn-prev" title="Voltar Bloco" data-action="back">◀</button>
          </div>
          <div class="symbol-wrap">
            <button class="symbol-button" id="btn-play" title="Play/Pause" data-action="nav">▶</button>
          </div>
          <div class="symbol-wrap">
            <button class="symbol-button" id="tts-stop" title="Parar" data-action="back">■</button>
          </div>
          <button class="symbol-button" id="btn-arch" title="Trocar Arquétipo de Voz">
            <div class="orb-microphone-container">
              <div class="tts-orb-mini">
                <div class="orb-coret" id="main-orb"><div class="orb-coret"></div></div>
              </div>
            </div>
          </button>
          <div class="hud-info" id="hudStatus">KOBLLUX · ORB NEXUS</div>
        </div>

        <div id="arch-overlay"></div>

        <!-- ── SOLAR COCKPIT ─────────────────────────────────── -->
        <div class="header-orb" id="orbToggle" title="Acessar Cockpit do Usuário">
          <svg><use href="#icon-orb"></use></svg>
        </div>
        <div id="usernameDisplay"></div>
        <div id="drawerOverlay" class="drawer-overlay"></div>
        <div id="drawerProfile" class="drawer" aria-hidden="true">
          <div class="drawer-content">
            <div class="drawer-header">
              <h3>
                <svg style="width:20px;height:20px;margin-right:8px;stroke:var(--secondary)"><use href="#icon-orb"></use></svg>
                Cockpit Solar
              </h3>
              <button class="btn-icon" id="drawerCloseBtn" style="width:38px;height:38px;border-radius:12px;">✕</button>
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

        <!-- ── MONOLITH VAULT ────────────────────────────────── -->
        <div class="void-ambient"></div>
        <div class="monolith-wrapper">
          <div class="monolith">
            <div class="mono-header">
              <div class="mono-brand">
                <div class="brand-icon"></div>
                <div class="brand-title">DUAL <span style="opacity:0.3;margin:0 4px;">//</span> MONOLITH</div>
              </div>
              <div id="sysStatus" class="status-badge">STANDBY</div>
            </div>
            <div class="mono-body">
              <div id="viewVault" class="vault-view">
                <div class="actions-grid">
                  <button id="createBtn" class="action-card btn-create"><span>NOVO</span></button>
                  <div id="dropZone" class="action-card dashed"><span style="font-family:var(--font-code)">UPLOAD</span></div>
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
                <div class="sidebar right">
                  <button class="symbol-button icon-btnn nav-btn" data-url="https://www.infodose.com.br/splash.html" data-action="nav" title="Void">Φ</button>
                  <button class="symbol-button icon-btnn nav-btn" data-url="https://kodux78k.github.io/oiDual--Y-/M0D/KKP/index.html" title="a€dualDex">꩜</button>
                  <button class="symbol-button icon-btnn nav-btn" data-url="https://kodux78k.github.io/oiDual-SmB/" title="a€SUMBUS">☼</button>
                  <div class="symbol-wrap"><button class="symbol-button" data-id="phi" data-url="https://www.infodose.com.br/oiDual/KODUX/78K/APPS/78F.html">🌌</button></div>
                  <div class="symbol-wrap"><button class="symbol-button" data-id="viv" data-url="https://www.infodose.com.br/oiDual/KODUX/78K/APPS/78EM.html">🛋️</button></div>
                  <div class="symbol-wrap"><button class="symbol-button" data-id="home" data-url="https://kodux78k.github.io/oiDual-idHome/">◌</button></div>
                  <div class="symbol-wrap"><button class="symbol-button" data-id="doc" data-url="https://www.infodose.com.br/oiDual/KODUX/78K/APPS/78NP.html">◘</button></div>
                </div>
                <div class="sidebar left">
                  <button id="uploadBtn" class="icon-btn" title="Import File"><i class="fa-solid fa-upload"></i></button>
                  <input type="file" id="uploadInput" hidden accept=".html,.js,.json">
                  <button id="remoteBtn" class="icon-btn" title="Fetch Remote"><i class="fa-solid fa-globe"></i></button>
                </div>
                <div class="list-header">
                  <span class="list-label">VAULT STORAGE</span>
                  <span class="list-label" id="vaultCount">0 ITEMS</span>
                </div>
                <div id="stackList" class="flex flex-col gap-3" style="padding-bottom:3rem;"></div>
              </div>
              <div id="viewEditor" class="editor-view state-translated-x">
                <div class="editor-header">
                  <div class="editor-title">:: MODULE CREATOR</div>
                  <button id="cancelEditor" class="btn-cancel">CANCELAR</button>
                </div>
                <input id="modTitle" type="text" placeholder="NOME DO MÓDULO" class="input-title">
                <div class="code-area"><textarea id="modContent"></textarea></div>
                <div class="flex gap-3"><button id="saveEditor" class="btn-save">SALVAR NO VAULT</button></div>
              </div>
            </div>
            <div class="mono-footer"><div id="pulseBar"></div></div>
            <div id="runtimeLayer" class="runtime-layer">
              <div class="runtime-bar">
                <div class="runtime-indicator"><div class="dot"></div><span>a€Dual // ACTIVE</span></div>
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
          </div>
        </div>

        <div id="toast" class="toast-hidden"><span id="toastMsg">System Ready</span></div>

        <!-- ── QUICK MENU ────────────────────────────────────── -->
        <div id="kblx-quick">
          <button class="kq-item" data-kq="edit">✦ Editar</button>
          <button class="kq-item" data-kq="symbol">◉ SymbolBar</button>
          <button class="kq-item" data-kq="frame">⟁ Session</button>
          <button class="kq-item" data-kq="dock">⌘ Dock</button>
          <button class="kq-item" data-kq="duplicate">📋 Duplicar</button>
          <button class="kq-item" data-kq="favorite">⭐ Favoritar</button>
          <button class="kq-item" data-kq="full">⋯ Mais</button>
        </div>

        <!-- ── ROUTE EDITOR (NAGATANAZARE) ───────────────────── -->
        <div id="kblx-back" aria-hidden="true">
          <div id="kblx-panel">
            <div class="kblx-head">
              <div class="p-chip">⌘ NAGATANAZARE · QUICK ROUTE</div>
              <button class="kblx-icon-btn" id="kblx-btn-close" type="button">✕</button>
            </div>
            <div class="kblx-title-wrap">
              <h2 class="p-title" id="kblx-ttl">Botão</h2>
              <p class="kblx-sub" id="kblx-sub">Escolha rápido, salve e injete sem cobrir a tela.</p>
            </div>
            <div class="kblx-current" id="kblx-current">Nenhuma rota definida.</div>
            <section class="kblx-section">
              <label class="p-lbl" for="kblx-inp">Novo valor para <code>data-url</code></label>
              <input id="kblx-inp" type="text" placeholder="arquivo.html  ou  https://..." spellcheck="false" autocomplete="off">
            </section>
            <div class="kblx-actions">
              <button class="kblx-btn kblx-save" id="kblx-btn-save" type="button">Salvar</button>
              <button class="kblx-btn kblx-inject" id="kblx-btn-orb-inject" type="button">SymbolBar</button>
              <button class="kblx-btn kblx-frame" id="kblx-btn-frame" type="button">Session Frame</button>
            </div>
            <div class="kblx-more-row">
              <button class="kblx-mini" id="kblx-btn-more" type="button">Mais</button>
              <button class="kblx-mini" id="kblx-btn-clear" type="button">Limpar</button>
            </div>
            <div class="kblx-advanced" id="kblx-advanced">
              <section class="kblx-section">
                <div class="kblx-note" style="margin-top:0">Presets rápidos</div>
                <div class="kblx-more-row">
                  <button class="kblx-mini" type="button" data-orb-preset="orb">◉ Orb</button>
                  <button class="kblx-mini" type="button" data-orb-preset="frame">⟁ Frame</button>
                  <button class="kblx-mini" type="button" data-orb-preset="dock">⌘ Dock</button>
                </div>
              </section>
              <section class="kblx-section">
                <div class="kblx-note">Long press em qualquer <code>.symbol-button[data-url]</code> abre este painel.</div>
              </section>
            </div>
          </div>
        </div>`;
    }

    // ── EVENTOS ──────────────────────────────────────────────
    initEvents() {
        this._bindDrawer();
        this._bindQuickMenu();
        this._bindRouteEditor();
        this._bindNavButtons();
    }

    _bindDrawer() {
        const root = this.element;
        const open = () => this._toggleDrawer('drawerProfile');
        const close = () => this._toggleDrawer();
        root.querySelector('#orbToggle')?.addEventListener('click', open);
        root.querySelector('#drawerOverlay')?.addEventListener('click', close);
        root.querySelector('#drawerCloseBtn')?.addEventListener('click', close);
    }

    _toggleDrawer(id) {
        const overlay = this.element.querySelector('#drawerOverlay');
        this.element.querySelectorAll('.drawer').forEach(d => {
            const shouldOpen = d.id === id;
            d.classList.toggle('open', shouldOpen);
            d.setAttribute('aria-hidden', String(!shouldOpen));
        });
        overlay?.classList.toggle('open', !!id);
    }

    _bindQuickMenu() {
        const orbBtn = this.element.querySelector('#orbBtn');
        const qm = this.element.querySelector('#kblx-quick');
        if (!orbBtn || !qm) return;

        const start = (e) => {
            orbBtn.classList.add('tap');
            this._pressTimer = setTimeout(() => {
                qm.style.display = 'flex';
                qm.style.flexDirection = 'column';
                const cX = e.clientX ?? (e.touches?.[0]?.clientX ?? innerWidth / 2);
                const cY = e.clientY ?? (e.touches?.[0]?.clientY ?? innerHeight / 2);
                qm.style.left = `${Math.min(cX, innerWidth - 180)}px`;
                qm.style.top = `${Math.min(cY, innerHeight - 280)}px`;
                navigator.vibrate?.(40);
            }, 600);
        };
        const end = () => {
            clearTimeout(this._pressTimer);
            setTimeout(() => orbBtn.classList.remove('tap'), 200);
        };

        orbBtn.addEventListener('pointerdown', start);
        orbBtn.addEventListener('pointerup', end);
        orbBtn.addEventListener('pointerleave', end);

        qm.querySelectorAll('.kq-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const act = e.currentTarget.dataset.kq;
                qm.style.display = 'none';
                document.dispatchEvent(new CustomEvent('kobllux:quickmenu-action', { detail: { action: act } }));
            });
        });

        document.addEventListener('click', (e) => {
            if (qm.style.display === 'flex' && !qm.contains(e.target) && !orbBtn.contains(e.target)) {
                qm.style.display = 'none';
            }
        });
    }

    _bindRouteEditor() {
        const back = this.element.querySelector('#kblx-back');
        if (!back) return;
        this.element.querySelector('#kblx-btn-close')?.addEventListener('click', () => {
            back.setAttribute('aria-hidden', 'true');
        });
        this.element.querySelector('#kblx-btn-save')?.addEventListener('click', () => {
            const val = this.element.querySelector('#kblx-inp')?.value?.trim();
            const target = this._routeTarget;
            if (val && target) {
                target.dataset.url = val;
                this.element.querySelector('#kblx-current').textContent = val;
            }
        });
        this.element.querySelector('#kblx-btn-clear')?.addEventListener('click', () => {
            const inp = this.element.querySelector('#kblx-inp');
            if (inp) inp.value = '';
        });
    }

    _bindNavButtons() {
        // long-press em qualquer .symbol-button[data-url] abre o route editor
        this.element.querySelectorAll('.symbol-button[data-url], .nav-btn[data-url]').forEach(btn => {
            let timer;
            btn.addEventListener('pointerdown', () => {
                timer = setTimeout(() => {
                    this._routeTarget = btn;
                    const back = this.element.querySelector('#kblx-back');
                    const ttl = this.element.querySelector('#kblx-ttl');
                    const cur = this.element.querySelector('#kblx-current');
                    if (ttl) ttl.textContent = btn.title || btn.dataset.id || 'Botão';
                    if (cur) cur.textContent = btn.dataset.url || 'Nenhuma rota definida.';
                    back?.setAttribute('aria-hidden', 'false');
                }, 700);
            });
            const cancel = () => clearTimeout(timer);
            btn.addEventListener('pointerup', cancel);
            btn.addEventListener('pointerleave', cancel);
        });
    }
}
