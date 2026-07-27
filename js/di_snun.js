(function(){
  const b=`<html lang="pt-BR" data-arch="" data-user="" data-opcode="0x00" data-camada="METΔ0"><head>
  <!-- ══════════════════════════════════════════════════════════
       BLOCO: META
       TIPO: meta
       GRUPO: meta
       TOGGLE: — (não removível)
       DESCRIÇÃO: charset, viewport, cor de tema da barra do navegador.
  ══════════════════════════════════════════════════════════ -->
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
  <meta name="theme-color" content="#050510">
  <title>DUAL // FUSION SYSTEM</title>
  <!-- ══════════════════════════════════════════════════════════
       BLOCO: FONTS
       TIPO: css-link (Google Fonts)
       GRUPO: fonts
       TOGGLE: on
       DESCRIÇÃO: Inter + JetBrains Mono + Montserrat.
  ══════════════════════════════════════════════════════════ -->
  <link data-k-id="L_0" data-k-group="fonts" data-k-toggle="on" href="https://fonts.googleapis.com/css2?family=Inter:wght@200;400;500;600;800&amp;family=JetBrains+Mono:wght@400;700&amp;family=Montserrat:wght@200;400;600;900&amp;display=swap" rel="stylesheet">
  <!-- ══════════════════════════════════════════════════════════
       BLOCO: LUCIDE ICONS
       TIPO: script (síncrono, no head)
       GRUPO: vendor
       TOGGLE: on
       DESCRIÇÃO: biblioteca de ícones Lucide, precisa carregar
       antes de qualquer script que chame lucide.createIcons().
  ══════════════════════════════════════════════════════════ -->
  <script data-k-id="JS_0" data-k-group="vendor" data-k-toggle="on" src="https://unpkg.com/lucide@latest"></script>
  <!-- ══════════════════════════════════════════════════════════
       BLOCO: CSS PRINCIPAL (HEAD)
       TIPO: css-link
       GRUPO: css-core
       TOGGLE: on (cada um independente)
       DESCRIÇÃO:
         mainu.css               → base visual do sistema
         main-fusionn.css        → camada de fusão (layout compartilhado)
         responseAreaBeautyy.css → estilo da área de resposta/chat
  ══════════════════════════════════════════════════════════ -->
  <link data-k-id="L_1" data-k-group="css-core" data-k-toggle="on" href="https://www.infodose.com.br/css/mainu.css" rel="stylesheet">
  <link data-k-id="L_2" data-k-group="css-core" data-k-toggle="on" rel="stylesheet" href="https://www.infodose.com.br/css/main-fusionn.css">
  <link data-k-id="L_3" data-k-group="css-core" data-k-toggle="on" rel="stylesheet" href="https://www.infodose.com.br/css/responseAreaBeautyy.css">
  <!-- ══════════════════════════════════════════════════════════
       BLOCO: BOOTLOADERS (HEAD, type=module)
       TIPO: script-module
       GRUPO: boot
       TOGGLE: on
       DESCRIÇÃO:
         bootKodux.js → orquestrador principal (carrega antes do body)
         bootKDXs.js  → orquestrador secundário / companion boot
       ⚠ Ordem importa: ambos rodam antes do <body> ser parseado.
  ══════════════════════════════════════════════════════════ -->
  <script data-k-id="JS_1" data-k-group="boot" data-k-toggle="on" type="module" src="https://www.infodose.com.br/JESUS_VERBO_INBOX/bootKodux.js"></script>
  <script data-k-id="JS_2" data-k-group="boot" data-k-toggle="on" type="module" src="https://www.infodose.com.br/JESUS_VERBO_INBOX/bootKDXs.js"></script>
<style data-k-id="SI_0" data-k-group="style-inline" data-k-toggle="on">
    .orb {
      background: radial-gradient(circle at 30% 30%, var(--grad-a, #78e7ff), transparent 78%),
                  radial-gradient(circle at 70% 70%, var(--kob-voice-secondary, #00f2ff), var(--orb-secondary, #3b82f6));
      box-shadow: 0 0 18px var(--kob-voice-primary), 0 0 36px rgba(120,227,255,0.4);
      animation: orbSpin var(--orb-speed) linear infinite;
      width: 56px; height: 56px;
      border-radius: 50%; display: grid; place-items: center;
    }
    .orb-core {
      min-width: 100%; min-height: 100%;
      border-radius: 50%;
      background: radial-gradient(circle at 30% 30%, var(--orb-accent, #78e7ff), transparent 78%),
                  radial-gradient(circle at 70% 70%, var(--kob-voice-primary, #00f2ff), var(--kob-voice-secondary, #3b82f6));
      box-shadow: 0 0 18px var(--kob-voice-secondary), 0 0 36px rgba(120,227,255,0.4);
      animation: orbSpin var(--orb-speed) linear infinite;
      width: 56px; height: 56px;
    }
    @keyframes orbSpin { to { transform: rotate(360deg); } }
    @keyframes orbPulse { from { transform: scale(1); } to { transform: scale(1.15); } }
  </style><style>
        :root {
          --z-base: 0;
          --z-content: 100;
          --z-widget: 500;
          --z-overlay: 1000;
          --z-system: 5000;
        }
      </style><style>
  @import url("https://kodux78k.github.io/oiDual--Y-/M0D/DBZP/css/ss5.css");
@import url("https://infodose.com.br/NL/NL--MAIN/player/css/patch.css");
 </style></head>
<body>
<!-- ══════════════════════════════════════════════════════════
     ROOT
══════════════════════════════════════════════════════════ -->
<div id="root">
  <!-- ══════════════════════════════════════════════════════════
       BLOCO: ESTILO INLINE · ORB
       TIPO: style-inline
       GRUPO: style-inline
       TOGGLE: on
       DESCRIÇÃO: define .orb e .orb-core (gradientes radiais,
       glow via var(--kob-voice-primary/secondary), animação
       orbSpin). Depende das CSS custom properties setadas em
       runtime pelos scripts de arquétipo/tema.
  ══════════════════════════════════════════════════════════ -->
  <!-- ══════════════════════════════════════════════════════════
       BLOCO: CORE · 78KOB-S
       TIPO: script (clássico)
       GRUPO: core
       TOGGLE: on
       DESCRIÇÃO: script central da variante 78KOB-S — provavelmente
       injeta/monta a estrutura de divs do sistema (nome sugere
       "78KOB-S-div"). Carrega antes dos módulos de integração.
  ══════════════════════════════════════════════════════════ -->
  <script data-k-id="JS_3" data-k-group="core" data-k-toggle="on" src="https://www.infodose.com.br/js/78KOB-S-div.js"></script>
  <!-- ══════════════════════════════════════════════════════════
       BLOCO: ORB MODULES (ESM)
       TIPO: script-module
       GRUPO: orb
       TOGGLE: on
       DESCRIÇÃO:
         inline-1.js (JS_17) → parte 1 do motor do orb (0RB/modules)
         inline-2.js (JS_18) → parte 2, carregada mais abaixo, depois
         dos módulos core — ordem original preservada.
  ══════════════════════════════════════════════════════════ -->
  <script data-k-id="JS_4" data-k-group="orb" data-k-toggle="on" type="module" src="https://kodux78k.github.io/oiDual--Y-/M0D/0RB/js/modules/inline-1.js"></script>
  <!-- ══════════════════════════════════════════════════════════
       BLOCO: UI · oiDual-S-0e1
       TIPO: script (clássico)
       GRUPO: ui
       TOGGLE: on
       DESCRIÇÃO: um dos três arquivos de UI que historicamente
       conflitam em render (junto com o0.js e koblluxv30.js).
       Mantenha isolado se for depurar DOM duplicado.
  ══════════════════════════════════════════════════════════ -->
  <script data-k-id="JS_5" data-k-group="ui" data-k-toggle="on" src="https://www.infodose.com.br/js/modules/oiDual-S-0e1.js"></script>
  <!-- ══════════════════════════════════════════════════════════
       BLOCO: FETCH / DATA
       TIPO: script-module
       GRUPO: data
       TOGGLE: on
       DESCRIÇÃO: kob-Fetchh.js — camada de requisições
       (fetch com timeout/fallback, conforme padrão já usado
       no fractal-369-engine).
  ══════════════════════════════════════════════════════════ -->
  <script data-k-id="JS_6" data-k-group="data" data-k-toggle="on" type="module" src="https://www.infodose.com.br/js/modules/kob-fetch.js"></script>
  <!-- ══════════════════════════════════════════════════════════
       BLOCO: VISUAL / BACKGROUND
       TIPO: script (clássico)
       GRUPO: visual
       TOGGLE: on
       DESCRIÇÃO:
         inline-1.js (JS_11) → efeitos visuais gerais (oiDual--Y-)
         bgPanel.js  (JS_12) → painel de troca de background
  ══════════════════════════════════════════════════════════ -->
  <script data-k-id="JS_7" data-k-group="visual" data-k-toggle="on" src="https://kodux78k.github.io/oiDual--Y-/js/inline-1.js"></script>
  <script data-k-id="JS_8" data-k-group="visual" data-k-toggle="on" src="https://kodux78k.github.io/oiDual-KxT-di_oi/js/modules/bgPanel.js"></script>
  <!-- ══════════════════════════════════════════════════════════
       BLOCO: CORE KOB
       TIPO: script / script-module
       GRUPO: core-kob
       TOGGLE: on
       DESCRIÇÃO:
         kob.js         → núcleo KOB (ESM)
         o0.js          → fábrica SVG pura (ESM) — não deve renderizar
                          nada sozinho, só gerar markup sob demanda.
         koblluxv30.js  → CSS vars + localStorage (clássico).
       ⚠ Estes três são o trio que historicamente disputa o DOM;
         separe o TOGGLE de cada um se for isolar bugs de render.
  ══════════════════════════════════════════════════════════ -->
  <script data-k-id="JS_9" data-k-group="core-kob" data-k-toggle="on" type="module" src="https://www.infodose.com.br/js/kob.js"></script>
  <script data-k-id="JS_10" data-k-group="core-kob" data-k-toggle="on" type="module" src="https://kodux78k.github.io/oiDual--Y-/M0D/kard/js/modules/o0.js"></script>
  <script data-k-id="JS_11" data-k-group="core-kob" data-k-toggle="on" src="https://kodux78k.github.io/oiDual--Y-/js/koblluxv30.js"></script>
  <!-- ══════════════════════════════════════════════════════════
       BLOCO: ICON BUTTONS
       TIPO: script (clássico)
       GRUPO: ui
       TOGGLE: on
       DESCRIÇÃO: di-icon-btn.js — comportamento dos botões de ícone
       (data-id, data-url etc.) usados na symbol-bar/monolith.
  ══════════════════════════════════════════════════════════ -->
  <script data-k-id="JS_12" data-k-group="ui" data-k-toggle="on" src="https://kodux78k.github.io/oiDual--Y-/js/di-icon-btn.js"></script>
  <!-- ══════════════════════════════════════════════════════════
       BLOCO: ORB MODULES · parte 2
       TIPO: script-module
       GRUPO: orb
       TOGGLE: on
       DESCRIÇÃO: inline-2.js (JS_18) — segunda metade do motor do
       orb, deve rodar depois de core-kob estar pronto.
  ══════════════════════════════════════════════════════════ -->
  <script data-k-id="JS_13" data-k-group="orb" data-k-toggle="on" type="module" src="https://kodux78k.github.io/oiDual--Y-/M0D/0RB/js/modules/inline-2.js"></script>
  <!-- ══════════════════════════════════════════════════════════
       BLOCO: SOLAR / SYNC
       TIPO: script-module
       GRUPO: solar
       TOGGLE: on
       DESCRIÇÃO: synk.js — sincronização (ciclo solar / di_core,
       equivalente ao "Solar / di_core" do comentário original).
  ══════════════════════════════════════════════════════════ -->
  <script data-k-id="JS_14" data-k-group="solar" data-k-toggle="on" type="module" src="https://www.infodose.com.br/js/modules/synk.js"></script>
  <!-- ══════════════════════════════════════════════════════════
       BLOCO: FRAME
       TIPO: script (clássico)
       GRUPO: frame
       TOGGLE: on
       DESCRIÇÃO: myFrameh.js — controla o iframe de sessão
       (equivalente ao #frame do Canivete Suíço). Último a carregar
       de propósito, igual ao padrão "roda por último" já usado
       no BODY THEME SYNC de outros bootloaders seus.
  ══════════════════════════════════════════════════════════ -->
  <script data-k-id="JS_15" data-k-group="frame" data-k-toggle="on" src="https://www.infodose.com.br/js/modules/myFrameh.js"></script>
</div><!-- #root -->


  <div id="bodyPlayer" data-mode="player">
    
    <!-- Background Decorativo -->
    <div class="bg-overlay"></div>

    <!-- Contêineres Ocultos (APIs) -->
    <div id="yt-container" class="off-screen"></div>
    <div id="sc-container" class="off-screen"></div>
    <audio id="local-audio" crossorigin="anonymous"></audio>

    <!-- WIDGET PRINCIPAL -->
    <div id="kodux-widget" data-idle-target="" class="state-ball" style="position: absolute; right: 20px; bottom: 100px;">
      
      <!-- ESTADO: BALL -->
      <div id="content-ball">
        <i class="ph-fill ph-vinyl-record spin"></i>
      </div>

      <!-- ESTADO: PREVIEW -->
      <div id="content-preview" class="hidden-content">
        <img id="prev-cover" src="https://picsum.photos/100" class="cover-sm hover-scale transition-transform preview-clickable" onclick="openFullFromPreview(event)">
        <div class="track-info-preview preview-clickable" onclick="openFullFromPreview(event)">
          <h4 id="prev-title" class="track-title-sm text-truncate glow-text">Kodux System</h4>
          <p id="prev-artist" class="track-artist-sm text-truncate">Aguardando...</p>
        </div>
        <button onclick="togglePlay(event)" class="btn-play-preview transition-base">
          <i id="prev-play-icon" class="ph-fill ph-play-circle icon-4xl"></i>
        </button>
      </div>

      <!-- ESTADO: FOOTER -->
      <div id="content-footer" class="hidden-content">
        <div class="progress-click-area" id="footer-progress-click">
          <div id="footer-progress-bar" class="progress-bar-fill"></div>
        </div>

        <div class="footer-drag-header drag-header">
          <img id="foot-cover" src="https://picsum.photos/100" class="cover-md">
          <div class="track-info-footer" onclick="updateWidgetState('full')">
            <h4 id="foot-title" class="track-title-md text-truncate">Kodux System</h4>
            <p id="foot-artist" class="track-artist-md text-truncate">Aguardando...</p>
          </div>
          <div class="controls-footer">
            <button onclick="playPrev(event)" class="btn-ctrl transition-base"><i class="ph-fill ph-skip-back"></i></button>
            <button onclick="togglePlay(event)" class="btn-play-main hover-scale-lg transition-transform"><i id="foot-play-icon" class="ph-fill ph-play-circle"></i></button>
            <button onclick="playNext(event)" class="btn-ctrl transition-base"><i class="ph-fill ph-skip-forward"></i></button>
            <button onclick="collapseToBall(event)" class="btn-ctrl transition-base" style="margin-left: 0.5rem;"><i class="ph ph-minus-circle"></i></button>
          </div>
        </div>
      </div>

      <!-- ESTADO: FULL -->
      <div id="content-full" class="hidden-content">
        
        <div class="full-header drag-header">
          <div class="header-title glow-text">
            <i class="ph-fill ph-lightning"></i>
            <span>ORÁCULO DUAL</span>
          </div>
          <button onclick="collapseToBall(event)" class="btn-collapse transition-base">
            <i class="ph ph-caret-down-bold"></i>
          </button>
        </div>

        <div class="full-scroll-area soft-scroll">
          <div class="tabs-container soft-scroll" id="playlist-tabs"></div>

          <div class="input-group">
            <div class="input-wrapper">
              <i class="ph ph-link input-icon"></i>
              <input type="text" id="link-input" placeholder="YouTube ou SoundCloud link" class="glass-input custom-input">
            </div>
            <select id="destination-select" class="glass-select custom-select">
              <option value="all">Todas</option>
            </select>
            <button onclick="addLink()" class="btn-primary btn-action">
              <i class="ph ph-plus-bold"></i>
            </button>
          </div>

          <div class="input-group">
            <div class="input-wrapper">
              <i class="ph ph-folder-simple input-icon"></i>
              <input type="text" id="new-playlist-input" placeholder="Criar nova playlist" class="glass-input custom-input">
            </div>
            <button onclick="createPlaylist()" class="btn-primary btn-action">
              <i class="ph ph-folder-plus"></i>
            </button>
          </div>

          <div class="playlist-header">
            <div>
              <h3>Playlists carregadas</h3>
              <p>Toque para trocar de grupo, criar, remover ou organizar.</p>
            </div>
          </div>

          <div id="playlist-container" class="playlists-list"></div>
        </div>

        <div class="full-bottom-dock">
          <input type="range" id="main-progress" min="0" max="100" value="0" class="main-range">
          
          <div class="dock-controls">
            <div class="dock-track-info">
              <img id="main-cover" src="https://picsum.photos/100" class="cover-md">
              <div class="info-text">
                <h4 id="main-title" class="track-title-md text-truncate">Oráculo</h4>
                <p id="main-artist" class="track-artist-sm text-truncate">Sistema KODUX v2.5</p>
              </div>
            </div>
            
            <div class="dock-actions">
              <button onclick="playPrev()" class="transition-base"><i class="ph-fill ph-skip-back"></i></button>
              <button onclick="togglePlay()" class="btn-play-circle transition-transform hover-scale">
                <i id="main-play-icon" class="ph-fill ph-play"></i>
              </button>
              <button onclick="playNext()" class="transition-base"><i class="ph-fill ph-skip-forward"></i></button>
            </div>
          </div>
        </div>

      </div>
    </div>

  </div>

  <script src="https://kodux78k.github.io/oiDual--Y-/M0D/DBZP/js/ss5.js"></script>
  <script>
    (() => {
      const bodyPlayer = document.getElementById('bodyPlayer');
      const idleSelector = '.kob-tts-dock, #kodux-widget, [data-idle-target]';
      let idleTimer = null;

      function getIdleTargets() {
        return document.querySelectorAll(idleSelector);
      }

      function setIdleState(isIdle) {
        getIdleTargets().forEach(el => el.classList.toggle('idle', isIdle));
      }

      function resetIdle() {
        setIdleState(false);
        clearTimeout(idleTimer);
        idleTimer = setTimeout(() => setIdleState(true), 1870);
      }

      function setMode(mode = 'player') {
        if (!bodyPlayer) return;
        bodyPlayer.dataset.mode = mode;
      }

      window.KoduxShell = {
        setMode,
        resetIdle
      };

      ['pointerdown', 'pointermove', 'touchstart', 'mousemove', 'scroll'].forEach(ev => {
        document.addEventListener(ev, resetIdle, { passive: true });
      });

      document.addEventListener('keydown', resetIdle);

      setMode(bodyPlayer?.dataset.mode || 'player');
      resetIdle();
    })();
  </script>


<script src="https://unpkg.com/@phosphor-icons/web"></script><script src="https://w.soundcloud.com/player/api.js"></script><script src="https://kodux78k.github.io/oiDual--Y-/M0D/DBZP/js/ss5.js"></script><script>
    (() => {
      const bodyPlayer = document.getElementById('bodyPlayer');
      const idleSelector = '.kob-tts-dock, #kodux-widget, [data-idle-target]';
      let idleTimer = null;

      function getIdleTargets() {
        return document.querySelectorAll(idleSelector);
      }

      function setIdleState(isIdle) {
        getIdleTargets().forEach(el => el.classList.toggle('idle', isIdle));
      }

      function resetIdle() {
        setIdleState(false);
        clearTimeout(idleTimer);
        idleTimer = setTimeout(() => setIdleState(true), 1870);
      }

      function setMode(mode = 'player') {
        if (!bodyPlayer) return;
        bodyPlayer.dataset.mode = mode;
      }

      window.KoduxShell = {
        setMode,
        resetIdle
      };

      ['pointerdown', 'pointermove', 'touchstart', 'mousemove', 'scroll'].forEach(ev => {
        document.addEventListener(ev, resetIdle, { passive: true });
      });

      document.addEventListener('keydown', resetIdle);

      setMode(bodyPlayer?.dataset.mode || 'player');
      resetIdle();
    })();
  </script></body></html>`;
  const d=document.createElement('div'); d.id='di_snun'; d.innerHTML=b;
  document.body.appendChild(d);
})();