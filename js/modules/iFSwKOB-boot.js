(function(KOBLLUX_BOOT) {
  'use strict';

  // =========================================================
  // LISTA DE SCRIPTS EXTERNOS (ordem original do HTML)
  // =========================================================
  const SCRIPTS = [
    { src: "https://infodose.com.br/oiDual/KODUX/78K/APPS/78PLAYER/Player-[di_jogador]-87-OK-0.js" },
    { src: "https://www.infodose.com.br/js/mainoff-.js", type: "module" },
    { src: "https://kodux78k.github.io/oiDual--Y-/M0D/kob-DH0/js/kob-outline-uni.js" },
    { src: "https://kodux78k.github.io/oiDual--Y-/M0D/kard/js/modules/inline-000.js" },
    { src: "https://kodux78k.github.io/oiDual--Y-/M0D/kard/js/modules/o0.js" },
    { src: "https://kodux78k.github.io/oiDual--Y-/js/koblluxv30.js" },
    { src: "https://kodux78k.github.io/oiDual--Y-/js/kodbrain-u66.js" },
    { src: "https://kodux78k.github.io/oiDual--Y-/js/kobllux-fusion.js" },
    { src: "https://kodux78k.github.io/oiDual--Y-/M0D/0RB/js/modules/inline-1.js", type: "module" },
    { src: "https://www.infodose.com.br/js/modules/oiDual-S-0e1u.js" },
    { src: "https://www.infodose.com.br/js/modules/kob-Fetchh.js", type: "module" },
    { src: "https://kodux78k.github.io/oiDual--Y-/M0D/0RB/js/modules/inline-2.js", type: "module" },
    { src: "https://www.infodose.com.br/js/modules/synk.js", type: "module" },
    { src: "https://www.infodose.com.br/js/modules/myFrameh.js" },
    { src: "https://infodose.com.br/oiDual/KODUX/78K/APPS/78iFSw/dual-ifswin/js/modules/resize-handles.js" },
    { src: "https://www.infodose.com.br/js/kob.js", type: "module" },
    { src: "https://kodux78k.github.io/oi-Dual/js/modules/inline-000.js" },
    { src: "https://kodux78k.github.io/oiDual--Y-/js/inline-1.js" },
    { src: "https://kodux78k.github.io/oiDual-KxT-di_oi/js/modules/bgPanel.js" },
    { src: "https://kodux78k.github.io/oiDual-KxT-di_oi/js/modules/inline-2.js" },
    { src: "https://kodux78k.github.io/oiDual-KxT-di_oi/js/modules/inline-3.js" },
    { src: "https://kodux78k.github.io/oiDual-KxT-di_oi/js/modules/inline-4.js" },
    { src: "https://kodux78k.github.io/oiDual--Y-/js/di_core.js" },
    { src: "https://kodux78k.github.io/oiDual--Y-/js/di_mood.js" },
    { src: "https://kodux78k.github.io/oiDual--Y-/js/di-icon-btn.js" }
  ];

  // =========================================================
  // BLOCOS INLINE (extraídos do HTML)
  // =========================================================

  // INLINE 1: updateInterface
  const INLINE1 = `
    function updateInterface(name){
      const safe = name || di_userName || 'Convidado';
      els.lblName.innerText = safe;
      els.input.value = safe;
      const activeKey = STATE.keys.find(k => k.active);
      els.smallIdent.innerText = activeKey ? activeKey.name : '--';
      els.actBadge.innerText = activeKey ? 'key:'+activeKey.name : 'v:--';
      const orbBig  = makeOrbAvatar(safe, 64);
      const orbMid  = makeOrbAvatar(safe, 36);
      const orbMini = makeOrbAvatar(safe, 24);
      els.avatarTgt.innerHTML = orbBig;
      els.smallMiniAvatar.innerHTML = orbMini;
      els.actMiniAvatar.innerHTML = orbMid;
      els.actName.innerText = safe;
    }
  `;

  // INLINE 2: core principal (iFSw, DevPanel, Player, Dock, SymbolBar, ViewportToggle, Navigation)
  // Este bloco é o mesmo que estava no final do HTML, com a modificação no método getSessions
  // para considerar data-hidden="true" e excluir views ocultas do indicador de navegação.
  const INLINE2 = `
    (function () {
      'use strict';

      // =============================================
      // 1. SEMENTE APP (INFODOSE 369)
      // =============================================
      const SEMENTE_APP_SRCDOC = \`
        <!DOCTYPE html>
        <html><head>
        <style>:root { --z-base: 0; --z-content: 100; --z-widget: 500; --z-overlay: 1000; --z-system: 5000; }</style>
        <style>
          :root{
            --bg-top:#EDEBF3; --bg-bot:#E4E1EE;
            --card:rgba(255,255,255,.68); --card-solid:#ffffff; --card-strong:rgba(255,255,255,.86);
            --line:rgba(60,60,67,.10); --line-strong:rgba(60,60,67,.16);
            --text:#1c1b1f; --text-2:#6c6a75; --text-3:#9997a3;
            --accent:#6C4CE0; --accent-ink:#4A2FB5; --accent-soft:rgba(108,76,224,.12);
            --gold:#C7973F; --gold-soft:rgba(199,151,63,.14);
            --radius-lg:26px; --radius-md:18px; --radius-sm:12px;
            --shadow:0 1px 2px rgba(28,27,31,.04), 0 10px 28px -14px rgba(28,27,31,.28);
          }
          *{box-sizing:border-box; -webkit-tap-highlight-color:transparent;}
          html,body{height:100%; margin:0; font-family:-apple-system,BlinkMacSystemFont,sans-serif; color:var(--text); background: radial-gradient(120% 60% at 18% -6%, #F6E9DA 0%, transparent 55%), radial-gradient(140% 70% at 100% 0%, #DCE6F5 0%, transparent 50%), linear-gradient(180deg,var(--bg-top),var(--bg-bot) 60%, #DEDAEA 100%); background-attachment:fixed; -webkit-font-smoothing:antialiased;}
          .app{ min-height:100dvh; display:flex; flex-direction:column; position:relative; }
          header.top{ padding:20px 20px 6px; position:sticky; top:0; z-index:30; backdrop-filter:blur(22px); background:rgba(237,235,243,.72); border-bottom:1px solid transparent;}
          .eyebrow{ font-size:11px; letter-spacing:.14em; text-transform:uppercase; color:var(--accent-ink); font-weight:700; display:flex; align-items:center; gap:6px; }
          .eyebrow .dot{width:5px;height:5px;border-radius:50%;background:var(--accent); box-shadow:0 0 0 3px var(--accent-soft);}
          h1.large{font-size:30px; letter-spacing:-.02em; font-weight:750; margin:0; line-height:1.05;}
          main{flex:1; padding:14px 0 120px;}
          .screen{display:none;} .screen.active{display:block;}
          .card{ background:var(--card); backdrop-filter:blur(18px); border:1px solid rgba(255,255,255,.55); border-radius:var(--radius-lg); box-shadow:var(--shadow); padding:18px; margin: 0 14px;}
          .btn{ appearance:none; border:none; padding:13px 18px; border-radius:16px; font-size:15px; font-weight:650; display:inline-flex; align-items:center; justify-content:center; gap:8px; width:100%; cursor:pointer; }
          .btn-primary{background:linear-gradient(160deg,var(--accent),var(--accent-ink)); color:#fff; }
          .fab{ position:fixed; right:22px; bottom:96px; width:58px; height:58px; border-radius:50%; background:linear-gradient(160deg,var(--accent),var(--accent-ink)); color:#fff; font-size:22px; display:flex; align-items:center; justify-content:center; cursor:pointer; border: none; box-shadow:0 14px 30px -10px rgba(74,47,181,.6); z-index: 35;}
          nav.tabbar{ position:fixed; left:0; right:0; bottom:0; z-index:40; padding:8px 10px 10px; backdrop-filter:blur(24px); background:rgba(255,255,255,.72); border-top:1px solid rgba(255,255,255,.6); }
          .tabbar-inner{ display:flex; justify-content:space-around; }
          .tab{ background:none; border:none; display:flex; flex-direction:column; align-items:center; gap:3px; color:var(--text-3); font-size:10px; font-weight:600; cursor:pointer; padding:4px 8px; }
          .tab.active{color:var(--accent-ink);}
        </style></head>
        <body>
          <iframe
            src="https://infodose.com.br/oiDual/KODUX/78K/APPS/78iFSwOS/KOB-in-oiDual—Y-[EX].html"
           
            style="background: rgba(0,0,0,0); width: 100%; height: 100%; min-height:100dvh; z-index: 0; border: 0; border-radius: 4px;">
          </iframe>
        </body></html>
      \`;

      // =============================================
      // 2. iFSw ENGINE (Session Windows)
      // =============================================
      const iFSw = {
        windowCounter: 1,
        clickTimers: {},
        stackWrap: document.getElementById('stackWrap'),
        dock: document.getElementById('dock'),

        getWin(id) { return document.getElementById(id); },

        handleHeaderClick(e, winId) {
          if (e.target.closest('.win-controls')) return;
          if (!this.clickTimers[winId]) {
            this.clickTimers[winId] = setTimeout(() => {
              delete this.clickTimers[winId];
              this.togglePeek(winId);
            }, 250);
          } else {
            clearTimeout(this.clickTimers[winId]);
            delete this.clickTimers[winId];
            this.toggleMaximize(winId);
          }
        },

        togglePeek(winId) {
          const win = this.getWin(winId);
          if (!win) return;
          win.classList.toggle('peeked');
          win.classList.remove('collapsed');
        },

        toggleCollapse(winId) {
          const win = this.getWin(winId);
          if (!win) return;
          win.classList.toggle('collapsed');
          win.classList.remove('peeked');
        },

        toggleMaximize(winId) {
          const win = this.getWin(winId);
          if (!win) return;
          win.classList.toggle('maximized');
          win.classList.remove('minimized');
          if (win.classList.contains('maximized')) {
            document.querySelectorAll('.session-window').forEach(w => w.style.zIndex = '1');
            win.style.zIndex = '92000';
          } else {
            win.style.zIndex = '1';
            win.classList.remove('peeked', 'collapsed');
          }
        },

        minimizeWindow(winId, icon, title) {
          const win = this.getWin(winId);
          if (!win) return;
          win.classList.add('minimized');
          win.classList.remove('maximized', 'collapsed', 'peeked');

          const bubble = document.createElement('div');
          bubble.className = 'dock-bubble';
          bubble.textContent = icon || '📄';
          bubble.title = title || 'Restaurar';
          bubble.id = 'dock-'+winId;
          bubble.onclick = () => {
            win.classList.remove('minimized');
            bubble.remove();
            win.scrollIntoView({ behavior: 'smooth', block: 'center' });
          };
          this.dock.appendChild(bubble);
        },

        closeWindow(winId) {
          const win = this.getWin(winId);
          if (!win) return;
          const bubble = document.getElementById('dock-'+winId);
          if (bubble) bubble.remove();
          win.remove();
        },

        createSessionWindow(options) {
          const title = options.title || 'Session';
          const icon = options.icon || '🌐';
          const id = 'session-'+Date.now()+'-'+this.windowCounter++;

          const section = document.createElement('div');
          section.className = 'session-window';
          section.id = id;

          const iframeAttr = options.srcdoc
            ? 'srcdoc="'+options.srcdoc.replace(/"/g, '&quot;')+'"'
            : 'src="'+options.src+'"';

          section.innerHTML = \`
            <div class="win-hdr" onclick="iFSw.handleHeaderClick(event, '\${id}')">
              <div class="win-title">\${icon} \${title}</div>
              <div class="win-controls" onclick="event.stopPropagation()">
                <button onclick="iFSw.toggleCollapse('\${id}')" title="Colapsar">—</button>
                <button onclick="iFSw.toggleMaximize('\${id}')" title="Maximizar">⬜</button>
                <button onclick="iFSw.minimizeWindow('\${id}', '\${icon}', '\${title}')" title="Minimizar para o Dock">🔘</button>
                <button onclick="iFSw.closeWindow('\${id}')" title="Fechar">✕</button>
              </div>
            </div>
            <iframe
              class="win-frame"
              \${iframeAttr}
              >
            </iframe>
          \`;

          this.stackWrap.appendChild(section);
          section.scrollIntoView({ behavior: 'smooth', block: 'center' });
          return id;
        }
      };
      window.iFSw = iFSw;

      // =============================================
      // 3. DEV PANEL
      // =============================================
      const DevPanel = {
        isOpen: false,

        toggle() {
          this.isOpen = !this.isOpen;
          document.getElementById('dev-panel').classList.toggle('active', this.isOpen);
          if (this.isOpen) this.refreshSessionsList();
        },

        getSessions() {
          const panels = Array.from(document.querySelectorAll('#universe-viewport > .screen-panel'));
          return panels.map((p, idx) => ({
            element: p,
            id: p.id,
            title: p.getAttribute('data-title') || p.id.replace('view-', '').toUpperCase(),
            icon: p.getAttribute('data-icon') || 'square',
            locked: p.getAttribute('data-locked') === 'true',
            hidden: p.style.display === 'none' || p.dataset.hidden === 'true',
            index: idx
          }));
        },

        refreshSessionsList() {
          const sessions = this.getSessions();
          const listContainer = document.getElementById('dev-sessions-list');
          const selectTarget = document.getElementById('dev-inject-target');

          listContainer.innerHTML = '';
          selectTarget.innerHTML = '<option value="NEW_SESSION">+ Criar Nova Session Window</option>';

          sessions.forEach(s => {
            const opt = document.createElement('option');
            opt.value = s.id;
            opt.textContent = '['+s.id+'] '+s.title;
            selectTarget.appendChild(opt);

            const card = document.createElement('div');
            card.className = 'dev-card flex items-center justify-between';
            card.innerHTML = \`
              <div>
                <span class="text-xs font-mono font-bold text-white/90">\${s.title}</span>
                <span class="block text-[9px] text-white/30 font-mono">#\${s.id}</span>
              </div>
              <div class="flex gap-2">
                <button onclick="DevPanel.toggleSessionVisibility('\${s.id}')" class="dev-btn \${!s.hidden ? 'dev-btn-active' : ''}">
                  \${!s.hidden ? '👁️ ON' : '🙈 OFF'}
                </button>
              </div>
            \`;
            listContainer.appendChild(card);
          });

          this.updateNavigationUI();
        },

        toggleSessionVisibility(id) {
          const el = document.getElementById(id);
          if (!el) return;
          el.style.display = (el.style.display === 'none') ? 'block' : 'none';
          this.refreshSessionsList();
        },

        updateNavigationUI() {
          const sessions = this.getSessions().filter(s => !s.hidden);
          const navContainer = document.getElementById('nav-indicator');
          const nexusShortcuts = document.getElementById('nexus-shortcut-buttons');

          if (navContainer) {
            navContainer.innerHTML = '';
            sessions.forEach((s, idx) => {
              const dot = document.createElement('div');
              dot.className = 'dot ' + (idx === 1 ? 'active' : '');
              dot.id = 'dot-'+idx;
              dot.onclick = () => {
                if (typeof Navigation !== 'undefined' && Navigation.to) {
                  Navigation.to(idx);
                }
              };
              navContainer.appendChild(dot);
            });
          }

          if (nexusShortcuts) {
            nexusShortcuts.innerHTML = '';
            sessions.forEach((s) => {
              if (s.id === 'view-nexus') return;
              const btn = document.createElement('button');
              btn.className = 'v-pill hover:bg-white/10 border-white/10';
              btn.onclick = () => {
                const visibleIndex = sessions.findIndex(item => item.id === s.id);
                if (typeof Navigation !== 'undefined' && Navigation.to) {
                  Navigation.to(visibleIndex);
                }
              };
              btn.innerHTML = '<span class="icon inline-block w-4 h-4 text-white/70" data-icon="'+s.icon+'"></span> '+s.title;
              nexusShortcuts.appendChild(btn);
            });
          }
        },

        injectContent() {
          const targetId = document.getElementById('dev-inject-target').value;
          const fileInput = document.getElementById('dev-file-input');
          const codeInline = document.getElementById('dev-code-inline').value;

          if (fileInput.files.length > 0) {
            const file = fileInput.files[0];
            const reader = new FileReader();
            reader.onload = (e) => {
              this.processAndInject(targetId, e.target.result, file.name);
            };
            reader.readAsText(file);
          } else if (codeInline.trim() !== '') {
            this.processAndInject(targetId, codeInline, 'Custom Script');
          } else {
            alert('Por favor, selecione um arquivo ou insira o código.');
          }
        },

        processAndInject(targetId, content, title) {
          let container;

          if (targetId === 'NEW_SESSION') {
            const newId = 'view-custom-'+Date.now();
            container = document.createElement('section');
            container.className = 'screen-panel pt-28 px-4';
            container.id = newId;
            container.setAttribute('data-title', title.replace(/\\.[^/.]+$/, ""));
            container.setAttribute('data-icon', 'code');
            document.getElementById('universe-viewport').appendChild(container);
          } else {
            container = document.getElementById(targetId);
            if (!container) {
              alert('View não encontrada. Tente recarregar.');
              return;
            }
          }

          if (!content.includes('<html') && !content.includes('<div') && !content.includes('<section')) {
            const scriptEl = document.createElement('script');
            scriptEl.textContent = content;
            container.appendChild(scriptEl);
          } else {
            const wrapper = document.createElement('div');
            wrapper.className = 'max-w-5xl mx-auto pb-24 v-glass p-6 rounded-2xl';
            wrapper.innerHTML = content;
            container.appendChild(wrapper);

            Array.from(wrapper.querySelectorAll('script')).forEach(oldScript => {
              const newScript = document.createElement('script');
              Array.from(oldScript.attributes).forEach(attr => newScript.setAttribute(attr.name, attr.value));
              newScript.appendChild(document.createTextNode(oldScript.innerHTML));
              oldScript.parentNode.replaceChild(newScript, oldScript);
            });
          }

          alert('Conteúdo injetado com sucesso em #'+container.id+'!');
          this.refreshSessionsList();
        },

        createIFSW() {
          const url = document.getElementById('dev-ifsw-url').value;
          const title = document.getElementById('dev-ifsw-title').value || 'App Session';
          if (!url) return alert('Informe a URL.');
          iFSw.createSessionWindow({ title: title, src: url, icon: '🖥️' });
          this.toggle();
        },

        launchSementeApp() {
          iFSw.createSessionWindow({
            title: "INFODOSE 369",
            icon: "🌱",
            srcdoc: SEMENTE_APP_SRCDOC
          });
          this.toggle();
        }
      };
      window.DevPanel = DevPanel;

      // =============================================
      // 4. GLOBAL DOCK
      // =============================================
      const Dock = {
        items: new Map(),
        getRoot() {
          return document.getElementById('dock');
        },
        removeItem(id) {
          const dock = this.getRoot();
          if (!dock) return;
          const old = dock.querySelector('[data-dock-id="'+CSS.escape(String(id))+'"]');
          if (old) old.remove();
          this.items.delete(String(id));
        },
        addItem(id, icon, onClick, title) {
          const dock = this.getRoot();
          if (!dock) return null;
          id = String(id);
          this.removeItem(id);
          const btn = document.createElement('button');
          btn.type = 'button';
          btn.className = 'dock-item symbol-button symbol-wrap';
          btn.dataset.dockId = id;
          btn.title = title || id;
          btn.setAttribute('aria-label', title || id);
          if (typeof icon === 'string' && icon.trim().startsWith('<')) {
            btn.innerHTML = icon;
          } else {
            btn.textContent = icon || '●';
          }
          btn.addEventListener('click', function (event) {
            event.preventDefault();
            event.stopPropagation();
            if (typeof onClick === 'function') onClick(event);
          });
          dock.appendChild(btn);
          this.items.set(id, btn);
          return btn;
        },
        has(id) {
          return this.items.has(String(id));
        },
        clear() {
          const dock = this.getRoot();
          if (!dock) return;
          dock.innerHTML = '';
          this.items.clear();
        }
      };
      window.Dock = Dock;

      // =============================================
      // 5. UNIVERSAL PLAYER
      // =============================================
      const previousPlayer = window.Player && typeof window.Player === 'object' ? window.Player : {};

      const Player = {
        current: { url: '', title: '', type: '', playing: false },

        getElement() {
          return document.getElementById('global-player');
        },
        getFrameWrap() {
          return document.getElementById('player-frame-wrap');
        },

        show() {
          const player = this.getElement();
          if (!player) return;
          player.style.display = '';
          player.classList.remove('is-minimized', 'player-minimized');
          Dock.removeItem('player');
        },

        hide() {
          const player = this.getElement();
          if (!player) return;
          player.style.display = 'none';
          player.classList.add('is-minimized');
          this._dockPlayer();
        },

        _dockPlayer() {
          Dock.addItem('player', '▶', () => {
            this.show();
            this.resume();
          }, this.current.title || 'Player');
        },

        play(url, title, options) {
          if (!url) {
            console.warn('[Player] URL vazia.');
            return false;
          }
          const player = this.getElement();
          const wrap = this.getFrameWrap();
          if (!player || !wrap) {
            console.warn('[Player] Elementos não encontrados.');
            return false;
          }

          this.current.url = String(url);
          this.current.title = title || 'Universal Player';
          this.current.type = options.type || this.detectType(url);
          this.current.playing = true;

          this.show();
          wrap.innerHTML = '';
          const type = this.current.type;

          if (type === 'youtube') {
            const videoId = this.extractYouTubeId(url);
            if (!videoId) {
              console.warn('[Player] ID do YouTube não encontrado.');
              return false;
            }
            const iframe = document.createElement('iframe');
            iframe.id = 'universal-player-frame';
            iframe.src = 'https://www.youtube.com/embed/'+encodeURIComponent(videoId)+'?autoplay=1&rel=0&playsinline=1';
            iframe.title = this.current.title;
            iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
            iframe.allowFullscreen = true;
            iframe.style.cssText = 'width:100%;height:100%;border:0;display:block;background:#000;';
            wrap.appendChild(iframe);
            return true;
          }

          if (type === 'video' || /\\.(mp4|webm|ogg|m4v)(\\?.*)?$/i.test(url)) {
            const video = document.createElement('video');
            video.id = 'universal-player-video';
            video.src = url;
            video.controls = true;
            video.autoplay = true;
            video.playsInline = true;
            video.setAttribute('webkit-playsinline', '');
            video.style.cssText = 'width:100%;height:100%;display:block;object-fit:contain;background:#000;';
            wrap.appendChild(video);
            video.play().catch(() => {});
            return true;
          }

          if (type === 'audio' || /\\.(mp3|wav|ogg|m4a|aac|flac)(\\?.*)?$/i.test(url)) {
            const audio = document.createElement('audio');
            audio.id = 'universal-player-audio';
            audio.src = url;
            audio.controls = true;
            audio.autoplay = true;
            audio.style.cssText = 'width:100%;position:absolute;left:0;right:0;bottom:0;';
            wrap.appendChild(audio);
            audio.play().catch(() => {});
            return true;
          }

          // Fallback: iframe genérico
          const iframe = document.createElement('iframe');
          iframe.id = 'universal-player-frame';
          iframe.src = url;
          iframe.title = this.current.title;
          iframe.style.cssText = 'width:100%;height:100%;border:0;display:block;background:#000;';
          iframe.allow = 'autoplay; fullscreen; picture-in-picture; encrypted-media';
          iframe.setAttribute('allowfullscreen', '');
          wrap.appendChild(iframe);
          return true;
        },

        detectType(url) {
          const value = String(url).toLowerCase();
          if (value.includes('youtube.com') || value.includes('youtu.be')) return 'youtube';
          if (/\\.(mp4|webm|ogg|m4v)(\\?.*)?$/i.test(value)) return 'video';
          if (/\\.(mp3|wav|ogg|m4a|aac|flac)(\\?.*)?$/i.test(value)) return 'audio';
          return 'iframe';
        },

        extractYouTubeId(url) {
          try {
            const value = String(url).trim();
            const short = value.match(/youtu\\.be\\/([a-zA-Z0-9_-]{6,})/);
            if (short) return short[1];
            const parsed = new URL(value);
            const v = parsed.searchParams.get('v');
            if (v) return v;
            const embed = parsed.pathname.match(/\\/(?:embed|shorts|live)\\/([a-zA-Z0-9_-]{6,})/);
            if (embed) return embed[1];
          } catch (e) {}
          return null;
        },

        pause() {
          const video = document.getElementById('universal-player-video');
          const audio = document.getElementById('universal-player-audio');
          if (video) video.pause();
          if (audio) audio.pause();
          this.current.playing = false;
        },

        resume() {
          const video = document.getElementById('universal-player-video');
          const audio = document.getElementById('universal-player-audio');
          const media = video || audio;
          if (media) {
            media.play().catch(() => {});
            this.current.playing = true;
          }
        },

        minimize() { this.hide(); },

        expand() {
          this.show();
          const player = this.getElement();
          if (player) player.classList.toggle('player-expanded');
        },

        stop() {
          const wrap = this.getFrameWrap();
          if (wrap) wrap.innerHTML = '';
          this.current = { url: '', title: '', type: '', playing: false };
          this.hide();
          Dock.removeItem('player');
        }
      };

      // Mescla com métodos anteriores não conflitantes
      Object.assign(Player, previousPlayer);
      Player.play = Player.play.bind(Player);
      Player.minimize = Player.minimize.bind(Player);
      Player.expand = Player.expand.bind(Player);
      Player.stop = Player.stop.bind(Player);
      Player.pause = Player.pause.bind(Player);
      Player.resume = Player.resume.bind(Player);
      window.Player = Player;

      // =============================================
      // 6. VIEWPORT TOGGLE
      // =============================================
      const ViewportToggle = {
        isVisible: true,

        init() {
          const viewport = document.getElementById('universe-viewport');
          if (!viewport) return;
          this.isVisible = viewport.style.display !== 'none';
          this.syncButton();
        },

        toggle() {
          const viewport = document.getElementById('universe-viewport');
          if (!viewport) return;
          this.isVisible = !this.isVisible;
          viewport.style.display = this.isVisible ? '' : 'none';
          this.syncButton();
        },

        show() {
          const viewport = document.getElementById('universe-viewport');
          if (!viewport) return;
          this.isVisible = true;
          viewport.style.display = '';
          this.syncButton();
        },

        hide() {
          const viewport = document.getElementById('universe-viewport');
          if (!viewport) return;
          this.isVisible = false;
          viewport.style.display = 'none';
          this.syncButton();
        },

        syncButton() {
          const btn = document.getElementById('toggleViewportBtn');
          if (!btn) return;
          btn.textContent = this.isVisible ? '⊞' : '⊟';
          btn.setAttribute('aria-label', this.isVisible ? 'Ocultar Viewport' : 'Mostrar Viewport');
          btn.title = this.isVisible ? 'Ocultar Viewport' : 'Mostrar Viewport';
        }
      };
      window.ViewportToggle = ViewportToggle;

      // =============================================
      // 7. SYMBOL BAR ENGINE (com persistência)
      // =============================================
      const SymbolBar = {
        storageKey: 'symbolBarConfig',
        defaultItems: [
          { id: 'home', url: 'https://www.infodose.com.br', label: 'Infodose', icon: '🏠', visible: true },
          { id: '78frames', url: 'https://www.infodose.com.br/oiDual/KODUX/78K/APPS/78F.html', label: '78Frames', icon: '꩜', visible: true },
          { id: 'feeling', url: 'https://www.infodose.com.br/oiDual/KODUX/78K/APPS/78EM.html', label: 'Feeling', icon: '◌', visible: true },
          { id: 'nebula', url: 'https://www.infodose.com.br/oiDual/KODUX/78K/APPS/78NP.html', label: 'Nebula', icon: '◘', visible: true },
          { id: 'void', url: 'https://www.infodose.com.br/splash.html', label: 'Void', icon: 'Φ', visible: true },
          { id: 'hub', url: 'https://kodux78k.github.io/oiDual--Y-/M0D/iFS/', label: 'Hub', icon: 'Φ', visible: true },
        ],
        items: [],

        load() {
          const stored = localStorage.getItem(this.storageKey);
          if (stored) {
            try {
              this.items = JSON.parse(stored);
              this.items = this.items.map(item => ({ ...item, visible: item.visible !== false }));
              return;
            } catch (e) {}
          }
          this.items = JSON.parse(JSON.stringify(this.defaultItems));
          this.save();
        },

        save() {
          localStorage.setItem(this.storageKey, JSON.stringify(this.items));
        },

        render() {
          const container = document.getElementById('symbol-buttons-container');
          if (!container) return;
          container.innerHTML = '';
          this.items.forEach(item => {
            if (!item.visible) return;
            const btn = document.createElement('button');
            btn.className = 'symbol-button';
            btn.dataset.url = item.url;
            btn.dataset.id = item.id;
            btn.innerHTML = (item.icon || '🔗') + ' ' + item.label;
            btn.onclick = (e) => {
              e.stopPropagation();
              this.loadUrl(item.url);
            };
            container.appendChild(btn);
          });
          this.renderEditModal();
        },

        loadUrl(url) {
          const frame = document.getElementById('frame');
          if (frame) {
            frame.src = url;
          } else {
            iFSw.createSessionWindow({ title: 'Navegação', src: url, icon: '🌐' });
          }
        },

        openEditModal() {
          document.getElementById('symbol-edit-modal').classList.add('active');
          this.renderEditModal();
        },

        closeEditModal() {
          document.getElementById('symbol-edit-modal').classList.remove('active');
        },

        renderEditModal() {
          const list = document.getElementById('symbol-edit-list');
          if (!list) return;
          list.innerHTML = '';
          this.items.forEach((item, index) => {
            const div = document.createElement('div');
            div.className = 'symbol-item';
            div.innerHTML = \`
              <div class="label">
                \${item.icon || '🔗'} \${item.label}
                <small>\${item.url}</small>
              </div>
              <div class="actions">
                <button class="toggle-vis \${item.visible ? 'active' : ''}" data-index="\${index}" title="Visível/Oculto"></button>
                <button class="remove-btn" data-index="\${index}" title="Remover">✕</button>
              </div>
            \`;
            list.appendChild(div);

            const toggle = div.querySelector('.toggle-vis');
            toggle.addEventListener('click', (e) => {
              e.stopPropagation();
              const idx = parseInt(toggle.dataset.index);
              this.items[idx].visible = !this.items[idx].visible;
              this.save();
              this.render();
            });

            const remove = div.querySelector('.remove-btn');
            remove.addEventListener('click', (e) => {
              e.stopPropagation();
              const idx = parseInt(remove.dataset.index);
              this.items.splice(idx, 1);
              this.save();
              this.render();
            });
          });
        },

        addItem(url, label) {
          if (!url || !label) return;
          const id = 'sym-'+Date.now();
          this.items.push({ id, url, label, icon: '🔗', visible: true });
          this.save();
          this.render();
        },

        resetToDefault() {
          this.items = JSON.parse(JSON.stringify(this.defaultItems));
          this.save();
          this.render();
        },

        quickAddCurrentUrl() {
          const frame = document.getElementById('frame');
          if (frame && frame.src && frame.src !== 'about:blank') {
            let url = frame.src;
            const label = prompt('Rótulo para este link:', url.replace(/^https?:\\/\\//, '').split('/')[0] || 'Link');
            if (label) this.addItem(url, label);
          } else {
            alert('Nenhum iframe com URL ativa. Abra uma página primeiro.');
          }
        },

        // Colapsa/expande os itens pré-definidos (não mexe na página).
        itemsCollapsed: false,
        toggleItemsVisibility() {
          const container = document.getElementById('symbol-buttons-container');
          if (!container) return;
          this.itemsCollapsed = !this.itemsCollapsed;
          container.style.display = this.itemsCollapsed ? 'none' : 'flex';
          const quickAdd = document.getElementById('quickAddBtn');
          if (quickAdd) quickAdd.style.display = this.itemsCollapsed ? 'none' : '';
        }
      };
      window.SymbolBar = SymbolBar;

      // =============================================
      // 8. DRAG DA SYMBOL BAR + LONG PRESS
      // =============================================
      let dragState = {
        active: false,
        startX: 0,
        startY: 0,
        offsetX: 0,
        offsetY: 0,
        moved: false,
        longPressTimer: null,
        isLongPress: false
      };

      function initDrag() {
        const bar = document.getElementById('symbol-bar');
        if (!bar) return;

        const onStart = (e) => {
          const target = e.target.closest('.symbol-btn, .main-toggle, #quickAddBtn');
          if (target) {
            if (target.id === 'symbolToggleBtn') {
              dragState.longPressTimer = setTimeout(() => {
                dragState.isLongPress = true;
                SymbolBar.openEditModal();
                e.preventDefault();
              }, 600);
            }
            return;
          }
          const touch = e.touches ? e.touches[0] : e;
          dragState.active = true;
          dragState.startX = touch.clientX;
          dragState.startY = touch.clientY;
          dragState.offsetX = bar.offsetLeft;
          dragState.offsetY = bar.offsetTop;
          dragState.moved = false;
          bar.classList.add('dragging');
          bar.style.cursor = 'grabbing';
        };

        const onMove = (e) => {
          const touch = e.touches ? e.touches[0] : e;
          if (dragState.active) {
            const dx = touch.clientX - dragState.startX;
            const dy = touch.clientY - dragState.startY;
            if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
              dragState.moved = true;
              if (dragState.longPressTimer) {
                clearTimeout(dragState.longPressTimer);
                dragState.longPressTimer = null;
              }
            }
            if (dragState.moved) {
              let newX = dragState.offsetX + dx;
              let newY = dragState.offsetY + dy;
              bar.style.left = newX + 'px';
              bar.style.top = newY + 'px';
              bar.style.transform = 'none';
              bar.style.bottom = 'auto';
              bar.style.right = 'auto';
            }
            e.preventDefault();
          } else {
            if (dragState.longPressTimer) {
              clearTimeout(dragState.longPressTimer);
              dragState.longPressTimer = null;
            }
          }
        };

        const onEnd = (e) => {
          if (dragState.longPressTimer) {
            clearTimeout(dragState.longPressTimer);
            dragState.longPressTimer = null;
          }
          if (dragState.active) {
            if (!dragState.moved) {
              // clique simples sem arraste – pode ser usado para outras ações
            }
            dragState.active = false;
            bar.classList.remove('dragging');
            bar.style.cursor = 'grab';
          }
          dragState.isLongPress = false;
        };

        bar.addEventListener('mousedown', onStart);
        document.addEventListener('mousemove', onMove);
        document.addEventListener('mouseup', onEnd);
        bar.addEventListener('touchstart', onStart, { passive: false });
        document.addEventListener('touchmove', onMove, { passive: false });
        document.addEventListener('touchend', onEnd);
      }

      // =============================================
      // 9. DATA-PLAYER-URL BINDING
      // =============================================
      function bindPlayerButtons() {
        document.addEventListener('click', function (e) {
          const btn = e.target.closest('[data-player-url]');
          if (!btn) return;
          e.preventDefault();
          e.stopPropagation();
          Player.play(
            btn.dataset.playerUrl,
            btn.dataset.playerTitle || 'Universal Player'
          );
        });
      }

      // =============================================
      // 10. INICIALIZAÇÃO GERAL
      // =============================================
      function bootKobllux() {
        // Carrega Symbol Bar
        SymbolBar.load();
        SymbolBar.render();

        // Toggle principal (≡): clique curto colapsa/expande os ITENS
        // pré-definidos da symbol bar (não a página). Segurar = editar.
        const toggleBtn = document.getElementById('symbolToggleBtn');
        if (toggleBtn) {
          toggleBtn.addEventListener('click', function (e) {
            if (dragState.isLongPress) {
              dragState.isLongPress = false;
              return;
            }
            SymbolBar.toggleItemsVisibility();
          });
        }

        // Quick add
        const quickAdd = document.getElementById('quickAddBtn');
        if (quickAdd) {
          quickAdd.addEventListener('click', function (e) {
            e.stopPropagation();
            SymbolBar.quickAddCurrentUrl();
          });
        }

        // Modal controls
        document.getElementById('closeSymbolModal').addEventListener('click', () => SymbolBar.closeEditModal());
        document.getElementById('closeSymbolModalBtn').addEventListener('click', () => SymbolBar.closeEditModal());
        document.getElementById('symbol-edit-modal').addEventListener('click', (e) => {
          if (e.target === e.currentTarget) SymbolBar.closeEditModal();
        });
        document.getElementById('addSymbolBtn').addEventListener('click', () => {
          const url = document.getElementById('newSymbolUrl').value.trim();
          const label = document.getElementById('newSymbolLabel').value.trim();
          if (url && label) {
            SymbolBar.addItem(url, label);
            document.getElementById('newSymbolUrl').value = '';
            document.getElementById('newSymbolLabel').value = '';
          } else alert('Preencha URL e Rótulo.');
        });
        document.getElementById('resetSymbolsBtn').addEventListener('click', () => {
          if (confirm('Restaurar a lista padrão?')) SymbolBar.resetToDefault();
        });

        // Viewport toggle button (se existir no HTML)
        const viewportBtn = document.getElementById('toggleViewportBtn');
        if (viewportBtn) {
          viewportBtn.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            ViewportToggle.toggle();
          });
        }
        ViewportToggle.init();

        // Player minimize via botões existentes com data-action ou classes
        document.querySelectorAll('#global-player [data-action="minimize"]').forEach(el => {
          el.addEventListener('click', (e) => { e.preventDefault(); Player.minimize(); });
        });

        // Inicia drag
        initDrag();

        // Bind para data-player-url
        bindPlayerButtons();

        // Expõe atalho global
        window.KOBLLUX = window.KOBLLUX || {};
        window.KOBLLUX.Player = Player;
        window.KOBLLUX.Dock = Dock;
        window.KOBLLUX.Viewport = ViewportToggle;
        window.KOBLLUX.play = function (url, title, options) {
          return Player.play(url, title, options);
        };

        // Atualiza navegação do DevPanel
        setTimeout(() => DevPanel.updateNavigationUI(), 300);

        console.log('[KOBLLUX] Trinity Core ✓');
      }

      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', bootKobllux, { once: true });
      } else {
        bootKobllux();
      }

    })();
  `;

  // =========================================================
  // FUNÇÕES DE CARREGAMENTO
  // =========================================================

  function loadScript(item) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      if (item.src) script.src = item.src;
      if (item.type) script.type = item.type;
      if (item.async) script.async = item.async;
      if (item.defer) script.defer = item.defer;
      script.onload = () => resolve({ status: 'loaded', src: item.src, type: item.type || 'classic' });
      script.onerror = () => reject({ status: 'error', src: item.src, type: item.type || 'classic' });
      document.head.appendChild(script);
    });
  }

  function execInline(code) {
    try {
      const script = document.createElement('script');
      script.textContent = code;
      document.head.appendChild(script);
      return true;
    } catch (e) {
      console.error('[KOBLLUX] Erro ao executar inline:', e);
      return false;
    }
  }

  // =========================================================
  // BOOTLOADER
  // =========================================================

  async function boot() {
    console.log('[KOBLLUX] Iniciando bootloader...');
    const results = [];

    for (const item of SCRIPTS) {
      try {
        const res = await loadScript(item);
        results.push(res);
        console.log('[KOBLLUX] Carregado:', item.src);
      } catch (err) {
        results.push(err);
        console.warn('[KOBLLUX] Falha ao carregar:', item.src, err);
      }
    }

    // Executa inline1 (updateInterface)
    const inline1Ok = execInline(INLINE1);
    console.log('[KOBLLUX] inline1 (updateInterface) executado:', inline1Ok);

    // Executa inline2 (core principal)
    const inline2Ok = execInline(INLINE2);
    console.log('[KOBLLUX] inline2 (core) executado:', inline2Ok);

    // Registra diagnóstico
    window.KOBLLUX_BOOT = {
      status: 'ready',
      scripts: results,
      inline1: inline1Ok,
      inline2: inline2Ok,
      timestamp: Date.now()
    };
    console.log('[KOBLLUX] Boot completo', window.KOBLLUX_BOOT);
  }

  // Inicia
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    boot();
  }

})();