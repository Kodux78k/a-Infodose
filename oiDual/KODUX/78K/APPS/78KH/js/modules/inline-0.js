
    /**
     * KOBLLUX_MONOLITH_FINAL Engine
     * Incorporates KODUX OS Boot, TabEngine, Browser, Notes, and Plugins.
     */
    const OS = {
      state: { booted: false },

      // 1. Storage Layer (Strict Validation: di_ prefix)
      Storage: {
        prefix: 'di_',
        save(key, data) {
          try { localStorage.setItem(this.prefix + key, JSON.stringify(data)); }
          catch (e) { console.error("Storage Error", e); }
        },
        load(key, defaultVal = null) {
          try {
            const item = localStorage.getItem(this.prefix + key);
            return item ? JSON.parse(item) : defaultVal;
          } catch (e) { return defaultVal; }
        },
        remove(key) { localStorage.removeItem(this.prefix + key); }
      },

      // 2. Popup System (Strict Validation: textContent)
      Popup: {
        show(title, htmlContent, buttons = []) {
          const layer     = document.getElementById('popup-layer');
          const box       = document.getElementById('popup-box');
          const titleEl   = document.getElementById('popup-title');
          const bodyEl    = document.getElementById('popup-body');
          const actionsEl = document.getElementById('popup-actions');

          titleEl.textContent = title;
          bodyEl.innerHTML    = htmlContent;
          actionsEl.innerHTML = '';

          if (buttons.length === 0) {
            buttons = [{ text: 'OK', type: 'primary', onClick: () => OS.Popup.hide() }];
          }

          buttons.forEach(btn => {
            const b = document.createElement('button');
            b.textContent = btn.text;
            b.className   = `popup-btn ${btn.type === 'primary' ? 'primary' : 'secondary'}`;
            b.onclick = () => { if (btn.onClick) btn.onClick(); OS.Popup.hide(); };
            actionsEl.appendChild(b);
          });

          layer.classList.add('visible');
          requestAnimationFrame(() => {
            layer.classList.add('opaque');
            box.classList.add('popped');
          });
        },
        hide() {
          const layer = document.getElementById('popup-layer');
          const box   = document.getElementById('popup-box');
          layer.classList.remove('opaque');
          box.classList.remove('popped');
          setTimeout(() => layer.classList.remove('visible'), 300);
        },
        prompt(title, placeholder, callback) {
          const inputHtml = `<input type="text" id="popup-input" placeholder="${placeholder}">`;
          this.show(title, inputHtml, [
            { text: 'Cancelar', type: 'secondary' },
            { text: 'Confirmar', type: 'primary', onClick: () => {
              const val = document.getElementById('popup-input').value;
              callback(val);
            }}
          ]);
          setTimeout(() => document.getElementById('popup-input').focus(), 100);
        }
      },

      // 3. Window Manager (Strict Validation: 78px minimize state)
      WindowManager: {
        counter: 1,
        
        createSessionWindow({ id, title = '//', icon = '🌐', content = '' }) {
          if (id && document.getElementById(id)) {
            this.toggleMaximize(id);
            return id;
          }

          const winId = id || `session-${Date.now()}-${this.counter++}`;
          const stackWrap = document.getElementById('stackWrap');

          const section = document.createElement('div');
          section.className = 'session-window';
          section.id = winId;

          section.innerHTML = `
            <div class="win-hdr" onclick="OS.WindowManager.handleHeaderClick(event, '${winId}')">
              <div class="win-title"><i class="fa-solid ${icon}"></i> &nbsp; ${title}</div>
              <div class="win-controls" onclick="event.stopPropagation()">
                <button onclick="OS.WindowManager.toggleMaximize('${winId}')" title="Maximizar">⬜</button>
                <button onclick="OS.WindowManager.minimizeWindow('${winId}')" title="Minimizar">🔘</button>
                <button onclick="OS.WindowManager.closeWindow('${winId}')" title="Fechar">✕</button>
              </div>
            </div>
            ${content}
          `;

          stackWrap.appendChild(section);
          this.updateMaximizedStacks();
          return winId;
        },

        handleHeaderClick(e, winId) {
          if (e.target.closest('.win-controls')) return;
          this.toggleMaximize(winId);
        },

        toggleMaximize(winId) {
          const win = document.getElementById(winId);
          if (!win) return;
          win.classList.toggle('maximized');
          win.classList.remove('minimized', 'minimized-78', 'peeked', 'collapsed');
          
          if (win.classList.contains('maximized')) {
            document.querySelectorAll('.session-window').forEach(w => w.style.zIndex = '1');
            win.style.zIndex = '92000';
          } else {
            win.style.zIndex = '1';
          }
          this.updateMaximizedStacks();
        },

        minimizeWindow(winId) {
          const win = document.getElementById(winId);
          if (!win) return;

          if (!win.classList.contains('minimized-78')) {
            win.classList.add('minimized-78', 'peeked', 'collapsed');
            win.classList.remove('maximized');
            this.updateMaximizedStacks();
          } else {
            win.classList.remove('minimized-78');
            win.classList.add('minimized', 'collapsed');
            this.updateMaximizedStacks();

            const dock = document.getElementById('dock');
            const bubble = document.createElement('div');
            bubble.className = 'dock-bubble glass-panel';
            bubble.style.padding = "10px 14px";
            bubble.style.cursor = "pointer";
            bubble.style.background = "rgba(10,14,40,.9)";
            bubble.textContent = '🔘';
            bubble.id = `dock-${winId}`;

            bubble.onclick = () => {
              win.classList.remove('minimized');
              bubble.remove();
              this.updateMaximizedStacks();
            };
            dock.appendChild(bubble);
          }
        },

        closeWindow(winId) {
          const win = document.getElementById(winId);
          if (!win) return;
          const bubble = document.getElementById(`dock-${winId}`);
          if (bubble) bubble.remove();
          win.remove();
          this.updateMaximizedStacks();
        },

        updateMaximizedStacks() {
          const maxWins = Array.from(document.querySelectorAll('.session-window.maximized'));
          maxWins.forEach(win => {
             win.style.top = `calc(var(--topbar-h, 50px) + var(--safe-top))`;
          });
        }
      },

      // 4. Tab Engine & Browser
      TabEngine: {
        tabs: [],
        activeTabId: null,

        init() {
          this.tabs = OS.Storage.load('tabs', []);
          if (this.tabs.length === 0) {
            this.createTab();
          } else {
            this.activeTabId = this.tabs[0].id;
            this.renderActiveTab();
          }
          this.updateUI();
        },

        createTab(url = '') {
          const id = 'tab_' + Date.now();
          this.tabs.push({ id, url, title: 'Nova Aba' });
          this.activeTabId = id;
          this.saveState();
          this.renderActiveTab();
          this.updateUI();
        },

        closeTab(id) {
          this.tabs = this.tabs.filter(t => t.id !== id);
          const iframe = document.getElementById(`iframe_${id}`);
          if (iframe) iframe.remove();
          if (this.tabs.length === 0) {
            this.createTab();
          } else if (this.activeTabId === id) {
            this.activeTabId = this.tabs[this.tabs.length - 1].id;
            this.renderActiveTab();
          }
          this.saveState();
          this.renderSwitcherGrid();
          this.updateUI();
        },

        switchTab(id) {
          this.activeTabId = id;
          this.renderActiveTab();
          this.hideTabSwitcher();
          this.updateUI();
        },

        saveState() { OS.Storage.save('tabs', this.tabs); },

        renderActiveTab() {
          const container  = document.getElementById('iframe-container');
          const addressBar = document.getElementById('address-bar');
          if (!container || !addressBar) return;

          container.querySelectorAll('iframe').forEach(ifr => ifr.style.display = 'none');
          document.getElementById('browser-empty-state').style.display = 'none';

          const activeTab = this.tabs.find(t => t.id === this.activeTabId);
          if (!activeTab) return;

          addressBar.value = activeTab.url;

          if (!activeTab.url) {
            document.getElementById('browser-empty-state').style.display = 'flex';
          } else {
            let iframe = document.getElementById(`iframe_${activeTab.id}`);
            if (!iframe) {
              iframe = document.createElement('iframe');
              iframe.id      = `iframe_${activeTab.id}`;
              iframe.sandbox = "allow-scripts allow-same-origin allow-forms allow-popups";
              iframe.src     = activeTab.url;
              iframe.onload  = () => {
                try {
                  activeTab.title = iframe.contentDocument.title || activeTab.url;
                } catch (e) {
                  activeTab.title = activeTab.url.replace(/^https?:\/\//, '').split('/')[0];
                }
                this.saveState();
              };
              container.appendChild(iframe);
            }
            iframe.style.display = 'block';
          }
        },

        updateActiveTabUrl(url) {
          const tab = this.tabs.find(t => t.id === this.activeTabId);
          if (tab) {
            tab.url   = url;
            tab.title = url;
            this.saveState();
            const oldIframe = document.getElementById(`iframe_${tab.id}`);
            if (oldIframe) oldIframe.remove();
            this.renderActiveTab();
          }
        },

        updateUI() {
          const tabEl = document.getElementById('tab-count');
          if (tabEl) tabEl.textContent = this.tabs.length;
        },

        showTabSwitcher() {
          this.renderSwitcherGrid();
          document.getElementById('tab-switcher').style.display = 'flex';
        },
        hideTabSwitcher() {
          document.getElementById('tab-switcher').style.display = 'none';
        },

        renderSwitcherGrid() {
          const grid = document.getElementById('tabs-grid');
          if(!grid) return;
          grid.innerHTML = '';
          this.tabs.forEach(tab => {
            const isActive = tab.id === this.activeTabId;
            const el = document.createElement('div');
            el.className = `tab-card glass-panel${isActive ? ' is-active' : ''}`;
            el.innerHTML = `
              <div class="tab-card-header">
                <span class="tab-card-title">${tab.title || 'Nova Aba'}</span>
                <button class="tab-close-btn" onclick="event.stopPropagation(); OS.TabEngine.closeTab('${tab.id}')">
                  <i class="fa-solid fa-xmark"></i>
                </button>
              </div>
              <div class="tab-card-preview" onclick="OS.TabEngine.switchTab('${tab.id}')">
                <i class="fa-solid ${tab.url ? 'fa-globe' : 'fa-plus'}"></i>
              </div>
            `;
            grid.appendChild(el);
          });
        },

        newTab() {
          this.createTab();
          this.hideTabSwitcher();
        }
      },

      Browser: {
        navigateBar() {
          let url = document.getElementById('address-bar').value.trim();
          if (!url) return;
          if (!/^https?:\/\//i.test(url)) {
            if (url.includes('.') && !url.includes(' ')) {
              url = 'https://' + url;
            } else {
              url = 'https://www.bing.com/search?q=' + encodeURIComponent(url);
            }
          }
          OS.TabEngine.updateActiveTabUrl(url);
        },
        reload() {
          const tab = OS.TabEngine.tabs.find(t => t.id === OS.TabEngine.activeTabId);
          if (tab && tab.url) {
            const iframe = document.getElementById(`iframe_${tab.id}`);
            if (iframe) iframe.src = iframe.src;
          }
        },
        loadUrl(url) {
          const addr = document.getElementById('address-bar');
          if(addr) addr.value = url;
          OS.TabEngine.updateActiveTabUrl(url);
        }
      },

      // 5. Plugins Engine
      Plugins: {
        list: [],
        init() {
          this.list = OS.Storage.load('plugins', []);
          this.executeAll();
        },
        promptInstall() {
          const html = `
            <p style="font-size:.75rem;text-align:left;margin-bottom:.5rem;">Cole o código JavaScript do plugin:</p>
            <textarea id="plugin-code" placeholder="OS.Popup.show('Hello', 'Plugin rodando!');"></textarea>
            <input type="text" id="plugin-name" placeholder="Nome do Plugin">
          `;
          OS.Popup.show("Novo Plugin", html, [
            { text: 'Cancelar', type: 'secondary' },
            { text: 'Instalar', type: 'primary', onClick: () => {
              const code = document.getElementById('plugin-code').value;
              const name = document.getElementById('plugin-name').value || 'Plugin ' + (this.list.length + 1);
              if (code) {
                this.list.push({ id: Date.now(), name, code, active: true });
                OS.Storage.save('plugins', this.list);
                this.renderList();
                this.execute(code);
                OS.Popup.show("Sucesso", "Plugin instalado e executado.");
              }
            }}
          ]);
        },
        remove(id) {
          this.list = this.list.filter(p => p.id !== id);
          OS.Storage.save('plugins', this.list);
          this.renderList();
        },
        renderList() {
          const container = document.getElementById('plugins-list');
          if (!container) return;
          if (this.list.length === 0) {
            container.innerHTML = `
              <div style="text-align:center;color:var(--muted);margin-top:2.5rem;">
                <i class="fa-solid fa-puzzle-piece" style="font-size:2.5rem;display:block;margin-bottom:.75rem;"></i>
                <p>Nenhum plugin instalado.</p>
              </div>`;
            return;
          }
          container.innerHTML = this.list.map(p => `
            <div class="plugin-card glass-panel">
              <div>
                <h4>${p.name}</h4>
                <p style="font-size:.75rem;color:#34d399;">Ativo</p>
              </div>
              <button class="plugin-remove-btn" onclick="OS.Plugins.remove(${p.id})"><i class="fa-solid fa-trash"></i></button>
            </div>
          `).join('');
        },
        execute(code) {
          try {
            const fn = new Function('OS', code);
            fn(OS);
          } catch (e) {
            OS.Popup.show("Erro no Plugin", `<p style="color:var(--danger);font-size:.75rem;">${e.message}</p>`);
          }
        },
        executeAll() {
          this.list.filter(p => p.active).forEach(p => this.execute(p.code));
        }
      },

      // 6. Apps Configuration
      Apps: {
        registry: [
          { id: 'browser', name: 'Navegador', icon: 'fa-compass', colorClass: 'icon-blue', action: () => OS.Apps.openBrowser() },
          { id: 'notes', name: 'Notas', icon: 'fa-note-sticky', colorClass: 'icon-yellow', action: () => OS.Apps.openNotes() },
          { id: 'plugins', name: 'Plugins', icon: 'fa-puzzle-piece', colorClass: 'icon-purple', action: () => OS.Apps.openPlugins() },
          { id: 'settings', name: 'Ajustes', icon: 'fa-gear', colorClass: 'icon-gray', action: () => OS.Popup.show('Sistema', 'KODUX OS v3<br>Armazenamento Integrado') }
        ],

        openBrowser() {
          const content = `
            <div class="app-content" style="padding:0;">
              <div class="browser-header">
                <button class="browser-back-btn" onclick="OS.WindowManager.closeWindow('window-browser')"><i class="fa-solid fa-home"></i></button>
                <div class="address-form">
                  <i class="fa-solid fa-lock"></i>
                  <input type="text" id="address-bar" placeholder="Pesquisar ou URL" onkeydown="if(event.key==='Enter'){OS.Browser.navigateBar();event.preventDefault();}">
                  <button style="background:transparent;border:none;color:var(--muted);cursor:pointer;" onclick="OS.Browser.reload()"><i class="fa-solid fa-rotate-right"></i></button>
                </div>
                <button class="tab-count-btn" onclick="OS.TabEngine.showTabSwitcher()"><span id="tab-count">1</span></button>
              </div>
              <div id="iframe-container">
                <div id="browser-empty-state" class="empty-state">
                  <i class="fa-solid fa-globe" style="font-size:2.5rem;margin-bottom:1rem;"></i>
                  <p>Motor de Busca Local.</p>
                </div>
              </div>
              <div id="tab-switcher" style="display:none;">
                <div class="tabs-header">
                  <h2 style="font-weight:700;">Abas Abertas</h2>
                  <button class="new-tab-btn" onclick="OS.TabEngine.newTab()"><i class="fa-solid fa-plus"></i></button>
                </div>
                <div id="tabs-grid"></div>
                <div style="margin-top:auto;padding-top:2rem;display:flex;justify-content:center;">
                  <button style="padding:.75rem 2rem;border-radius:999px;border:none;font-weight:600;cursor:pointer;" onclick="OS.TabEngine.hideTabSwitcher()">Concluído</button>
                </div>
              </div>
            </div>
          `;
          OS.WindowManager.createSessionWindow({ id: 'window-browser', title: 'Navegador', icon: 'fa-compass', content });
          OS.TabEngine.init();
        },

        openNotes() {
          const notesData = OS.Storage.load('notes_data', '');
          const content = `
            <div class="app-content" style="padding:0;">
              <div class="notes-header">
                <span style="font-weight:600;">Bloco de Notas</span>
                <button class="notes-save-btn" onclick="OS.Storage.save('notes_data', document.getElementById('notes-content').value); OS.Popup.show('Notas', 'Salvo com sucesso!');">Salvar</button>
              </div>
              <textarea id="notes-content" placeholder="Comece a digitar...">${notesData}</textarea>
            </div>
          `;
          OS.WindowManager.createSessionWindow({ id: 'window-notes', title: 'Notas', icon: 'fa-note-sticky', content });
        },

        openPlugins() {
          const content = `
            <div class="app-content" style="padding:0;">
              <div class="plugins-header">
                <span style="font-weight:600;">Plugins JS</span>
                <button class="plugins-add-btn" onclick="OS.Plugins.promptInstall()"><i class="fa-solid fa-plus"></i></button>
              </div>
              <div id="plugins-list"></div>
            </div>
          `;
          OS.WindowManager.createSessionWindow({ id: 'window-plugins', title: 'Plugins', icon: 'fa-puzzle-piece', content });
          OS.Plugins.renderList();
        }
      },

      // 7. Core Boot System
      UI: {
        updateClock() {
          const now = new Date();
          const el  = document.getElementById('sys-time');
          if (el) el.textContent = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
        },
        buildHome() {
          const grid = document.getElementById('app-grid');
          grid.innerHTML = OS.Apps.registry.map(app => `
            <div class="app-icon-cell" onclick="(${app.action.toString()})()">
              <button class="app-icon-btn ${app.colorClass}">
                <i class="fa-solid ${app.icon}"></i>
              </button>
              <span>${app.name}</span>
            </div>
          `).join('');
        }
      },

      boot() {
        const progressBar = document.getElementById('boot-progress');
        let progress = 0;
        const interval = setInterval(() => {
          progress += Math.random() * 20;
          if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            setTimeout(() => this.finishBoot(), 500);
          }
          progressBar.style.width = `${progress}%`;
        }, 150);
      },

      finishBoot() {
        const bootScreen = document.getElementById('boot-screen');
        bootScreen.style.opacity = '0';
        setTimeout(() => bootScreen.remove(), 800);

        this.UI.buildHome();
        this.Plugins.init();

        this.UI.updateClock();
        setInterval(() => this.UI.updateClock(), 10000);

        this.state.booted = true;
      }
    };

    window.addEventListener('load', () => OS.boot());
  
