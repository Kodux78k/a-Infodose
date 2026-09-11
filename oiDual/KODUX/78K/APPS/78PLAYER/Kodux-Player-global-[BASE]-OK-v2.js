(function(bundle,s='#inject-here'){
const p=new DOMParser();
const c=p.parseFromString(
bundle,
'text/html'
);
const t=
document.querySelector(s)
||document.body;
// CSS
Array.from(
c.querySelectorAll('style')
)
.forEach(style=>{
const n=
document.createElement('style');
n.textContent=
style.textContent;
document.head.appendChild(n);
});
// HTML
const f=
document.createDocumentFragment();
Array.from(
c.body.childNodes
)
.forEach(node=>{
if(node.nodeName!=='SCRIPT'){
f.appendChild(
document.importNode(node,true)
);
}
});
t.appendChild(f);
// JS
Array.from(
c.querySelectorAll('script')
)
.forEach(x=>{
const n=
document.createElement('script');
for(
const a of x.attributes
)
n.setAttribute(
a.name,
a.value
);
n.textContent=
x.textContent;
document.body.appendChild(n);
});
})(`<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover, user-scalable=no">
<meta name="theme-color" content="#0f0f11">
<meta name="apple-mobile-web-app-capable" content="yes">
<link rel="apple-touch-icon" href="./icon-192.png">
<title>Kodux Player + Visualizer (Global Player)</title>
<script src="https://w.soundcloud.com/player/api.js"></script>
<!-- ===== GLOBAL PLAYER (Fusion OS) ===== -->
<link rel="stylesheet" href="https://kodux78k.github.io/oiDual--Y-/M0D/KBF/main.css">
<link rel="stylesheet" href="https://infodose.com.br/oiDual/KODUX/78K/APPS/78FusionOS/css/main.css">
<style>
    @import url("https://infodose.com.br/NL/NL--MAIN/player/css/main.css");

    /* ─── ÍCONES KODUX ─── */
    .kx-icon {
        display: inline-block;
        width: 1em;
        height: 1em;
        fill: currentColor;
        vertical-align: middle;
        flex-shrink: 0;
    }
    .kx-icon.icon-4xl { font-size: 4.8rem; }
    .kx-icon.spin { animation: spin 2s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }

    body { overflow-y: auto; }
    .drawer-contento {
        max-height: 0;
        overflow: hidden;
        opacity: 0;
        transition: max-height 0.4s ease-out, opacity 0.3s ease-out;
    }
    .drawer-contento.open {
        max-height: 600px;
        opacity: 1;
        margin-bottom: 1rem;
        padding: 12px;
        background: rgba(255,255,255,0.05);
        backdrop-filter: blur(16px) saturate(140%);
        border: 1px solid rgba(255,255,255,0.1);
        border-radius: 16px;
    }
    .category-tabs {
        display: flex;
        justify-content: center;
        gap: 10px;
        padding: 10px 2px;
        margin-bottom: 6px;
    }
    .category-tabs .mini-chip {
        flex: 1;
        justify-content: center;
        padding: 0.6rem;
    }

    .carrossel-linha { margin-bottom: 20px; }
    .carrossel-titulo {
        font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em;
        color: var(--muted, #a0a0a0); padding: 6px 10px 8px 10px;
        display: flex; justify-content: space-between; align-items: baseline;
        background: rgba(255,255,255,0.04);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255,255,255,0.08);
        border-radius: 12px;
        margin-bottom: 8px;
    }
    .carrossel-trilhos {
        display: flex; gap: 12px; overflow-x: auto;
        scroll-snap-type: x mandatory; padding: 2px 2px 8px 2px;
        -webkit-overflow-scrolling: touch;
    }
    .carrossel-cartao {
        flex: 0 0 96px; width: 96px; scroll-snap-align: start; cursor: pointer;
        background: rgba(255,255,255,0.06);
        backdrop-filter: blur(14px) saturate(140%);
        border: 1px solid rgba(255,255,255,0.12);
        border-radius: 39px;
        padding: 6px;
        box-shadow: 0 4px 16px rgba(0,0,0,0.25);
        transition: border-radius 0.4s ease;
    }
    .carrossel-cartao img {
        width: 84px; height: 150px; object-fit: cover; display: block; margin: 0 auto;
        border-radius: 39px;
        border: 1px solid rgba(255,255,255,0.1);
        transition: border-radius 0.4s ease, height 0.4s ease, width 0.4s ease;
    }
    .carrossel-cartao.ativo {
        border-color: var(--primary, #00d2ff);
        border-radius: 50%;
        box-shadow: 0 4px 20px rgba(0,210,255,0.25);
    }
    .carrossel-cartao.ativo img {
        border-radius: 50%;
        width: 84px; height: 84px;
        border-color: var(--primary, #00d2ff); border-width: 2px;
    }
    .carrossel-cartao h5 {
        font-size: 11px; margin: 8px 2px 0; font-weight: 600; text-align: center;
        white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 90px; margin-left: auto; margin-right: auto;
    }
    .carrossel-cartao p {
        font-size: 9px; margin: 2px 2px 0; color: var(--muted, #a0a0a0); text-align: center;
        white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 90px; margin-left: auto; margin-right: auto;
    }

    /* ===== GLOBAL PLAYER (estilo Fusion OS) ===== */
  
    #global-player.player-fullscreen {
        width: 100vw !important;
        height: 100vh !important;
        border-radius: 0 !important;
        bottom: 0 !important;
        right: 0 !important;
        top: 0 !important;
        left: 0 !important;
        border: none !important;
        background: #000 !important;
        backdrop-filter: none !important;
    }
    #global-player.player-fullscreen .gp-toolbar {
        top: 20px;
        right: 20px;
    }
    #global-player.player-fullscreen .gp-btn {
        background: rgba(0,0,0,0.6);
        border-color: rgba(255,255,255,0.15);
        width: 40px;
        height: 40px;
        font-size: 18px;
    }
    #global-player.player-fullscreen .gp-title {
        font-size: 14px;
        bottom: 30px;
        left: 30px;
        background: rgba(0,0,0,0.6);
    }
  
        #global-player .gp-btn {
            width: 28px;
            height: 28px;
            font-size: 12px;
        }
    }

    /* Animação leve no widget quando tocando */
    #kodux-widget.playing {
        box-shadow: 0 0 0 1px rgba(0, 210, 255, 0.2), 0 4px 20px rgba(0,210,255,0.1);
        transition: box-shadow 0.4s;
        animation: widgetPulse 2.5s ease-in-out infinite;
    }
    @keyframes widgetPulse {
        0%   { box-shadow: 0 0 0 1px rgba(0, 210, 255, 0.1), 0 4px 20px rgba(0,210,255,0.05); }
        50%  { box-shadow: 0 0 0 3px rgba(0, 210, 255, 0.25), 0 4px 30px rgba(0,210,255,0.2); }
        100% { box-shadow: 0 0 0 1px rgba(0, 210, 255, 0.1), 0 4px 20px rgba(0,210,255,0.05); }
    }

    /* Container dos players ocultos (para áudio em segundo plano) */
    #yt-container, #sc-container {
        position: fixed !important;
        width: 1px !important;
        height: 1px !important;
        left: -9999px !important;
        top: -9999px !important;
        opacity: 0 !important;
        pointer-events: none !important;
        z-index: -1 !important;
        overflow: hidden !important;
    }
    #yt-container iframe, #sc-container iframe {
        width: 1px !important;
        height: 1px !important;
    }

    /* Ícone UTF-8 para os botões do global player */
    .gp-icon {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 1.2rem;
        height: 1.2rem;
        font-size: 1.2rem;
        line-height: 1;
        font-weight: 300;
        color: inherit;
    }

    /* ─── BOTÃO VISUALIZADOR COM INDICADOR DE FAIXA ATIVA ─── */
    .visualizer-btn {
    border-radius:50%;
        position: relative;
        transition: border-color 0.3s, box-shadow 0.3s;
    }
    .visualizer-btn.has-track {
        color: var(--primary, #00d2ff) !important;
        box-shadow: 0 0 0 2px rgba(0, 210, 255, 0.4), 0 0 12px rgba(0, 210, 255, 0.2);
        animation: vizPulse 29s ease-in-out infinite;
    }
    @keyframes vizPulse {
        0% { box-shadow: 0 0 0 0 rgba(0, 210, 255, 0.4); }
        50% { box-shadow: 0 0 0 4px rgba(0, 210, 255, 0.2), 0 0 20px rgba(0, 210, 255, 0.3); }
        100% { box-shadow: 0 0 0 0 rgba(0, 210, 255, 0.4); }
    }
</style>
</head>
<body>

<div id="bodyPlayer" data-mode="player">
    <div class="bg-overlay"></div>
    <div id="yt-container" class="off-screen"></div>
    <div id="sc-container" class="off-screen"></div>
    <audio id="local-audio" crossorigin="anonymous"></audio>

    <!-- WIDGET PRINCIPAL KODUX -->
    <div id="kodux-widget" data-idle-target="" class="state-ball" style="position: absolute; right: 20px; bottom: 100px;">

      <!-- ESTADO: BALL -->
      <div id="content-ball" class="drag-header">
        <svg class="kx-icon spin" aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" width="1em" height="1em">
          <use href="#kx-vinyl"></use>
        </svg>
        <div style="position:absolute;bottom:-24px;left:50%;transform:translateX(-50%);font-size:10px;color:rgba(255,255,255,0.3);">toque 2x</div>
      </div>

      <!-- ESTADO: PREVIEW -->
      <div id="content-preview" class="hidden-content drag-header">
        <img id="prev-cover" src="https://picsum.photos/100" onerror="this.onerror=null;this.src='https://picsum.photos/100';" class="cover-sm hover-scale transition-transform preview-clickable" onclick="openFullFromPreview(event)">
        <div class="track-info-preview preview-clickable" onclick="openFullFromPreview(event)">
          <h4 id="prev-title" class="track-title-sm text-truncate glow-text">Kodux System</h4>
          <p id="prev-artist" class="track-artist-sm text-truncate">Aguardando...</p>
        </div>
        <button onclick="togglePlay(event)" class="btn-play-preview transition-base">
          <svg id="prev-play-icon" class="kx-icon icon-4xl" aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" width="1em" height="1em">
            <use href="#kx-play-circle"></use>
          </svg>
        </button>
        <!-- Botão visualizador com classe visualizer-btn -->
        <button onclick="openVisualizer(event)" class="btn-ctrl transition-base visualizer-btn" style="margin-left:4px;" title="Visualizador">
          <svg class="kx-icon" aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" width="1em" height="1em">
            <use href="#kx-waveform"></use>
          </svg>
        </button>
      </div>

      <!-- ESTADO: FOOTER -->
      <div id="content-footer" class="hidden-content">
        <div class="progress-click-area" id="footer-progress-click">
          <div id="footer-progress-bar" class="progress-bar-fill"></div>
        </div>
        <div class="footer-drag-header drag-header">
          <img id="foot-cover" src="https://picsum.photos/100" onerror="this.onerror=null;this.src='https://picsum.photos/100';" class="cover-md">
          <div class="track-info-footer" onclick="updateWidgetState('full')">
            <h4 id="foot-title" class="track-title-md text-truncate">Kodux System</h4>
            <p id="foot-artist" class="track-artist-md text-truncate">Aguardando...</p>
          </div>
          <div class="controls-footer">
            <button onclick="playPrev(event)" class="btn-ctrl transition-base">
              <svg class="kx-icon" aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" width="1em" height="1em">
                <use href="#kx-prev"></use>
              </svg>
            </button>
            <button onclick="togglePlay(event)" class="btn-play-main hover-scale-lg transition-transform">
              <svg id="foot-play-icon" class="kx-icon" aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" width="1em" height="1em">
                <use href="#kx-play-circle"></use>
              </svg>
            </button>
            <button onclick="playNext(event)" class="btn-ctrl transition-base">
              <svg class="kx-icon" aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" width="1em" height="1em">
                <use href="#kx-next"></use>
              </svg>
            </button>
            <!-- Botão visualizador com classe visualizer-btn -->
            <button onclick="openVisualizer(event)" class="btn-ctrl transition-base visualizer-btn" title="Visualizador">
              <svg class="kx-icon" aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" width="1em" height="1em">
                <use href="#kx-waveform"></use>
              </svg>
            </button>
            <button onclick="collapseToBall(event)" class="btn-ctrl transition-base" style="margin-left: 0.5rem;">
              <svg class="kx-icon" aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" width="1em" height="1em">
                <use href="#kx-collapse"></use>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- ESTADO: FULL (Oráculo) -->
      <div id="content-full" class="hidden-content">
        <div class="full-header drag-header">
          <div class="header-title glow-text">
            <svg class="kx-icon" aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" width="1em" height="1em">
              <use href="#kx-bolt"></use>
            </svg>
            <span>ORÁCULO DUAL</span>
          </div>
          <div style="display:flex;gap:8px;align-items:center;">
            <!-- Botão visualizador com classe visualizer-btn -->
            <button onclick="openVisualizer(event)" class="btn-ctrl transition-base visualizer-btn" title="Visualizador" style="background:rgba(255,255,255,0.05);border-radius:50%;padding:6px;">
              <svg class="kx-icon" aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" width="1.2em" height="1.2em">
                <use href="#kx-waveform"></use>
              </svg>
            </button>
            <button onclick="collapseToBall(event)" class="btn-collapse transition-base">
              <svg class="kx-icon" aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" width="1em" height="1em">
                <use href="#kx-collapse-full"></use>
              </svg>
            </button>
          </div>
        </div>
        <div class="full-scroll-area soft-scroll">
          <div class="category-tabs" id="main-category-tabs">
            <button class="mini-chip active" id="tab-geral" onclick="setCategory('geral')">
              <svg class="kx-icon" aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" width="1em" height="1em"><use href="#kx-stack"></use></svg>
              <span>Geral</span>
            </button>
            <button class="mini-chip" id="tab-infodose" onclick="setCategory('infodose')">
              <svg class="kx-icon" aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" width="1em" height="1em"><use href="#kx-disc"></use></svg>
              <span>Infodose</span>
            </button>
            <button class="mini-chip cadial-chip" id="tab-arquetipos" onclick="setCategory('arquetipos')">
              <svg class="kx-icon" aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" width="1em" height="1em"><use href="#kx-spiral"></use></svg>
              <span>Arquétipos</span>
            </button>
          </div>
          <div class="tabs-container soft-scroll" id="playlist-tabs"></div>
          <div style="padding: 0 2px; margin-bottom: 10px;">
            <button onclick="toggleConfigDrawer()" class="btn-primary" style="width: 100%; border-radius: 12px; font-size: 13px; display: flex; justify-content: center; align-items:center; gap: 8px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1);">
              <svg class="kx-icon" aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" width="1em" height="1em"><use href="#kx-folder-add"></use></svg>
              Gerenciar Links e Playlists
            </button>
          </div>
          <div id="config-drawer" class="drawer-contento">
            <button id="quick-add-btn" onclick="quickAddFromClipboard()" class="btn-primary btn-action" title="Colar link (clipboard) ou abrir manual" style="margin: 4px 0 10px 0;">
              <svg class="kx-icon" aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" width="1em" height="1em"><use href="#kx-plus"></use></svg>
              <span style="font-size:12px; margin-left:6px;">Colar link / adicionar</span>
            </button>
            <button id="import-audio-btn" onclick="document.getElementById('local-audio-input').click()" class="btn-primary btn-action" title="Importar MP3/áudio do dispositivo" style="margin: 0 0 10px 0; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1);">
              <svg class="kx-icon" aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" width="1em" height="1em"><use href="#kx-folder-add"></use></svg>
              <span style="font-size:12px; margin-left:6px;">Importar MP3 / áudio local</span>
            </button>
            <input type="file" id="local-audio-input" accept="audio/*,.mp3,.MP3,.wav,.WAV,.ogg,.OGG,.m4a,.M4A" multiple style="display:none">
            <div class="input-group">
              <div class="input-wrapper">
                <svg class="kx-icon input-icon" aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" width="1em" height="1em"><use href="#kx-link"></use></svg>
                <input type="text" id="link-input" placeholder="YouTube ou SoundCloud link" class="glass-input custom-input">
              </div>
              <select id="destination-select" class="glass-select custom-select"><option value="all">Todas</option></select>
              <button onclick="addLink()" class="btn-primary btn-action">
                <svg class="kx-icon" aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" width="1em" height="1em"><use href="#kx-plus"></use></svg>
              </button>
            </div>
            <div class="input-group">
              <div class="input-wrapper">
                <svg class="kx-icon input-icon" aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" width="1em" height="1em"><use href="#kx-folder"></use></svg>
                <input type="text" id="new-playlist-input" placeholder="Criar nova playlist" class="glass-input custom-input">
              </div>
              <button onclick="createPlaylist()" class="btn-primary btn-action">
                <svg class="kx-icon" aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" width="1em" height="1em"><use href="#kx-folder-add"></use></svg>
              </button>
            </div>
          </div>
          <div class="playlist-header">
            <div><h3>Playlists carregadas</h3><p>Toque para trocar de grupo, criar, remover ou organizar.</p></div>
          </div>
          <div id="playlist-container" class="playlists-list"></div>
        </div>
        <div class="full-bottom-dock">
          <input type="range" id="main-progress" min="0" max="100" value="0" class="main-range">
          <div class="dock-controls">
            <div class="dock-track-info">
              <img id="main-cover" src="https://picsum.photos/100" onerror="this.onerror=null;this.src='https://picsum.photos/100';" class="cover-md">
              <div class="info-text">
                <h4 id="main-title" class="track-title-md text-truncate">Oráculo</h4>
                <p id="main-artist" class="track-artist-sm text-truncate">Sistema KODUX v2.5</p>
              </div>
            </div>
            <div class="dock-actions">
              <button onclick="playPrev()" class="transition-base"><svg class="kx-icon" aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" width="1em" height="1em"><use href="#kx-prev"></use></svg></button>
              <button onclick="togglePlay()" class="btn-play-circle transition-transform hover-scale"><svg id="main-play-icon" class="kx-icon" aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" width="1em" height="1em"><use href="#kx-play"></use></svg></button>
              <button onclick="playNext()" class="transition-base"><svg class="kx-icon" aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" width="1em" height="1em"><use href="#kx-next"></use></svg></button>
            </div>
          </div>
        </div>
      </div>
    </div>
</div>

<!-- ===== GLOBAL PLAYER (Fusion OS) – com ícones UTF‑8 ===== -->
 <div id="global-player" class="v-glass session-window overflow-hidden">
    <div class="absolute top-3 right-3 z-20 flex gap-2">
      <button data-action="minimize" class="w-8 h-8 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center hover:bg-white/20 transition border border-white/5"><i data-lucide="minus" class="w-3 h-3 text-white"></i></button>
      <button onclick="Player.expand()" id="player-expand-btn" class="w-8 h-8 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center hover:bg-[var(--active-color)]/40 transition border border-white/5"><i data-lucide="maximize-2" class="w-3 h-3 text-white"></i></button>
      <button onclick="Player.stop()" class="w-8 h-8 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center hover:bg-red-500/30 transition border border-white/5"><i data-lucide="x" class="w-3 h-3 text-white"></i></button>
    </div>
    <div id="player-frame-wrap" class="w-full h-full bg-black"></div>
  </div>

<!-- SPRITE DE ÍCONES (KODUX) -->
<svg xmlns="http://www.w3.org/2000/svg" style="display:none;">
    <symbol id="kx-vinyl" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-12.5c-2.49 0-4.5 2.01-4.5 4.5s2.01 4.5 4.5 4.5 4.5-2.01 4.5-4.5-2.01-4.5-4.5-4.5zm0 7c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></symbol>
    <symbol id="kx-play-circle" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/></symbol>
    <symbol id="kx-prev" viewBox="0 0 24 24" fill="currentColor"><path d="M19 18.5L10.5 12 19 5.5v13zM9 5.5v13H5v-13h4z"/></symbol>
    <symbol id="kx-next" viewBox="0 0 24 24" fill="currentColor"><path d="M5 5.5l8.5 6.5L5 18.5v-13zM19 5.5v13h-4v-13h4z"/></symbol>
    <symbol id="kx-collapse" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11H7v-2h10v2z"/></symbol>
    <symbol id="kx-bolt" viewBox="0 0 24 24" fill="currentColor"><path d="M13 2L4 14h6l-3 8 9-12h-6l3-8z"/></symbol>
    <symbol id="kx-collapse-full" viewBox="0 0 24 24" fill="currentColor"><path d="M12 15.5L4 7.5l2-2 6 6 6-6 2 2z"/></symbol>
    <symbol id="kx-link" viewBox="0 0 24 24" fill="currentColor"><path d="M12 6v2.5l-2.5 2.5-2.5-2.5V6c0-2.5 2-4.5 4.5-4.5S16 3.5 16 6v2.5l-2.5 2.5-2.5-2.5V6zM12 18v-2.5l2.5-2.5 2.5 2.5V18c0 2.5-2 4.5-4.5 4.5S7 20.5 7 18v-2.5l2.5-2.5 2.5 2.5V18z"/></symbol>
    <symbol id="kx-plus" viewBox="0 0 24 24" fill="currentColor"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></symbol>
    <symbol id="kx-folder" viewBox="0 0 24 24" fill="currentColor"><path d="M4 20h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-7l-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2z"/></symbol>
    <symbol id="kx-folder-add" viewBox="0 0 24 24" fill="currentColor"><path d="M4 20h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-7l-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2zm4-4h2v2h4v-2h2v-4h-2v-2h-4v2H8v4z"/></symbol>
    <symbol id="kx-play" viewBox="0 0 24 24" fill="currentColor"><path d="M5 3l14 9-14 9V3z"/></symbol>
    <symbol id="kx-stack" viewBox="0 0 24 24" fill="currentColor"><path d="M4 4h16v2H4V4zm0 5h16v2H4V9zm0 5h16v2H4v-2zm0 5h16v2H4v-2z"/></symbol>
    <symbol id="kx-heart" viewBox="0 0 24 24" fill="currentColor"><path fill-rule="evenodd" clip-rule="evenodd" d="M12,21.35l-1.45-1.32C5.4,15.36,2,12.28,2,8.5C2,5.42,4.42,3,7.5,3c1.74,0,3.41,0.81,4.5,2.09C13.09,3.81,14.76,3,16.5,3 C19.58,3,22,5.42,22,8.5c0,3.78-3.4,6.86-8.55,11.54L12,21.35z M12.1,18.55l0.1,0.1l0.1-0.1C16.71,14.24,20,11.39,20,8.5 C20,6.5,18.5,5,16.5,5c-1.54,0-3.04,0.99-3.56,2.36h-1.87C10.54,5.99,9.04,5,7.5,5C5.5,5,4,6.5,4,8.5 C4,11.39,7.29,14.24,12.1,18.55z"/></symbol>
    <symbol id="kx-heart-fill" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></symbol>
    <symbol id="kx-spiral" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z"/></symbol>
    <symbol id="kx-playlist" viewBox="0 0 24 24" fill="currentColor"><path d="M4 6h16v2H4V6zm0 5h10v2H4v-2zm0 5h6v2H4v-2zm13-3.5l6 4.5-6 4.5v-9z"/></symbol>
    <symbol id="kx-trash" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></symbol>
    <symbol id="kx-disc" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-12.5c-2.49 0-4.5 2.01-4.5 4.5s2.01 4.5 4.5 4.5 4.5-2.01 4.5-4.5-2.01-4.5-4.5-4.5zm0 7c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></symbol>
    <symbol id="kx-waveform" viewBox="0 0 24 24" fill="currentColor"><path d="M3 12h2v12H3zm4-4h2v16H7zm4-4h2v20h-2zm4 4h2v16h-2zm4 4h2v12h-2z"/></symbol>
    <symbol id="kx-pause-circle" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/></symbol>
    <symbol id="kx-pause" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></symbol>
</svg>

<script>
// =========================================================================
// BANCO DE DADOS KODUX (mesmo código anterior)
// =========================================================================
const DB_NAME = "di_kodux-ss-db-v3";

function uid(prefix = "trk") {
  return \`\${prefix}_\${Date.now().toString(36)}_\${Math.random().toString(36).slice(2, 8)}\`;
}

function normalizeUrl(rawUrl = "") {
  let url = String(rawUrl || "").trim();
  if (!url) return "";
  if (url.includes("soundcloud.com") || url.includes("on.soundcloud.com")) {
    try {
      const u = new URL(url);
      if (u.hostname.startsWith("m.")) u.hostname = u.hostname.replace(/^m\\./, "");
      url = u.toString();
    } catch (e) {
      url = url.replace("://m.soundcloud.com", "://soundcloud.com");
    }
  }
  if (url.includes("youtube.com") || url.includes("youtu.be") || url.includes("youtube-nocookie.com")) {
    try {
      const u = new URL(url);
      if (u.hostname.startsWith("m."))    u.hostname = "youtube.com";
      if (u.hostname.startsWith("music.")) u.hostname = "youtube.com";
      if (u.hostname.endsWith("youtube-nocookie.com")) u.hostname = "youtube.com";
      let id = null;
      if (u.hostname.includes("youtu.be"))           id = u.pathname.replace("/", "").trim();
      else if (u.pathname.startsWith("/watch"))       id = u.searchParams.get("v");
      else if (u.pathname.startsWith("/shorts/"))     id = u.pathname.split("/")[2];
      else if (u.pathname.startsWith("/embed/"))      id = u.pathname.split("/")[2];
      if (id) url = \`https://youtu.be/\${id}\`;
    } catch (e) {
      url = url
        .replace("://m.youtube.com",     "://youtube.com")
        .replace("://music.youtube.com", "://youtube.com")
        .replace("://youtube-nocookie.com", "://youtube.com");
    }
  }
  return url;
}

function extractYouTubeId(rawUrl = "") {
  try {
    const u = new URL(rawUrl);
    if (u.hostname.includes("youtu.be"))        return u.pathname.replace("/", "").trim();
    if (u.pathname.startsWith("/watch"))         return u.searchParams.get("v");
    if (u.pathname.startsWith("/shorts/"))       return u.pathname.split("/")[2];
    if (u.pathname.startsWith("/embed/"))        return u.pathname.split("/")[2];
  } catch (e) {}
  const m = String(rawUrl).match(/(?:v=|youtu\\.be\\/|shorts\\/|embed\\/)([0-9A-Za-z_-]{11})/);
  return m ? m[1] : null;
}

function extractYouTubePlaylistId(rawUrl = "") {
  try {
    const u = new URL(rawUrl);
    return u.searchParams.get("list");
  } catch (e) {}
  const m = String(rawUrl).match(/[?&]list=([0-9A-Za-z_-]+)/);
  return m ? m[1] : null;
}

function normalizeTrack(track) {
  return {
    id:         track.id || uid(),
    type:       track.type || "local",
    url:        normalizeUrl(track.url || ""),
    name:       track.name || "Sem título",
    artist:     track.artist || "Web",
    cover:      track.cover || "https://picsum.photos/100",
    blob:       track.blob || null,
    favorite:   !!track.favorite,
    playlistId: track.playlistId || null,
    cadial:     track.cadial || null
  };
}

function createDefaultDB(arquetypes, preloaded) {
  const ALL_ID = "all";
  const FAVORITES_ID = "favorites";
  const INFODOSE_ID = "infodose";
  const systemPlaylists = [
    { id: ALL_ID,       name: "Todas",     system: true, trackIds: [] },
    { id: FAVORITES_ID, name: "Favoritos", system: true, trackIds: [] },
    { id: INFODOSE_ID,  name: "Infodose",  system: true, trackIds: [] }
  ];
  const cadialPlaylists = (arquetypes || []).map(arq => ({
    id:       \`cadial-\${arq.id}\`,
    name:     \`\${arq.nome} · \${arq.regra}\`,
    system:   false,
    trackIds: [],
    cadial:   {
      opcode:   arq.opcode,
      rung:     arq.rung,
      hz:       arq.hz,
      essencia: arq.essencia,
      frase:    arq.frase
    }
  }));
  return {
    version:         3,
    library:         (preloaded || []).map(normalizeTrack),
    playlists:       [...systemPlaylists, ...cadialPlaylists],
    activePlaylistId: ALL_ID
  };
}

function saveDB(db) {
  try {
    const lean = { ...db, library: db.library.map(t => {
      if (!t.blob) return t;
      const { blob, ...rest } = t;
      return rest;
    })};
    localStorage.setItem(DB_NAME, JSON.stringify(lean));
  }
  catch (e) { console.error("Erro ao salvar DB:", e); }
}

const KoduxAudioIDB = (() => {
  const DB_ID = "di_kodux_audio_idb";
  const STORE = "blobs";
  let dbPromise = null;

  function open() {
    if (!('indexedDB' in window)) return Promise.reject(new Error('IndexedDB indisponível'));
    if (dbPromise) return dbPromise;
    dbPromise = new Promise((resolve, reject) => {
      const req = indexedDB.open(DB_ID, 1);
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE);
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
    return dbPromise;
  }

  async function put(id, blob) {
    try {
      const db = await open();
      return await new Promise((resolve, reject) => {
        const tx = db.transaction(STORE, "readwrite");
        tx.objectStore(STORE).put(blob, id);
        tx.oncomplete = () => resolve(true);
        tx.onerror = () => reject(tx.error);
      });
    } catch (e) { console.warn("KoduxAudioIDB.put falhou:", e); return false; }
  }

  async function get(id) {
    try {
      const db = await open();
      return await new Promise((resolve, reject) => {
        const tx = db.transaction(STORE, "readonly");
        const req = tx.objectStore(STORE).get(id);
        req.onsuccess = () => resolve(req.result || null);
        req.onerror = () => reject(req.error);
      });
    } catch (e) { console.warn("KoduxAudioIDB.get falhou:", e); return null; }
  }

  async function remove(id) {
    try {
      const db = await open();
      return await new Promise((resolve) => {
        const tx = db.transaction(STORE, "readwrite");
        tx.objectStore(STORE).delete(id);
        tx.oncomplete = () => resolve(true);
        tx.onerror = () => resolve(false);
      });
    } catch (e) { return false; }
  }

  return { put, get, remove };
})();

function loadDB() {
  try {
    const raw = localStorage.getItem(DB_NAME);
    return raw ? JSON.parse(raw) : null;
  } catch (e) { return null; }
}

function ensureSystemPlaylists(db, arquetypes) {
  const ALL_ID = "all";
  const FAVORITES_ID = "favorites";
  const INFODOSE_ID = "infodose";
  const hasAll = db.playlists.some(p => p.id === ALL_ID);
  const hasFav = db.playlists.some(p => p.id === FAVORITES_ID);
  const hasInfo = db.playlists.some(p => p.id === INFODOSE_ID);
  if (!hasAll) db.playlists.unshift({ id: ALL_ID, name: "Todas", system: true, trackIds: [] });
  if (!hasFav) db.playlists.splice(1, 0, { id: FAVORITES_ID, name: "Favoritos", system: true, trackIds: [] });
  if (!hasInfo) db.playlists.splice(2, 0, { id: INFODOSE_ID, name: "Infodose", system: true, trackIds: [] });
  (arquetypes || []).forEach(arq => {
    const pid = \`cadial-\${arq.id}\`;
    if (!db.playlists.some(p => p.id === pid)) {
      db.playlists.push({
        id:       pid,
        name:     \`\${arq.nome} · \${arq.regra}\`,
        system:   false,
        trackIds: [],
        cadial:   { opcode: arq.opcode, rung: arq.rung, hz: arq.hz, essencia: arq.essencia, frase: arq.frase }
      });
    }
  });
  db.playlists = db.playlists.filter((p, i, arr) => arr.findIndex(x => x.id === p.id) === i);
  if (!db.activePlaylistId || !db.playlists.some(p => p.id === db.activePlaylistId)) {
    db.activePlaylistId = ALL_ID;
  }
  return db;
}

function initDB(arquetypes, preloaded) {
  const rawV3 = localStorage.getItem(DB_NAME);
  let db;
  if (rawV3) {
    try {
      db = JSON.parse(rawV3);
      db.library = (db.library || []).map(normalizeTrack);
      db.playlists = (db.playlists || []).map(p => ({
        ...p,
        trackIds: Array.isArray(p.trackIds) ? p.trackIds.slice() : []
      }));
      db = ensureSystemPlaylists(db, arquetypes);
      const libraryUrls = new Set(db.library.map(t => normalizeUrl(t.url)));
      (preloaded || []).forEach(pTrack => {
        const normTrack = normalizeTrack(pTrack);
        if (!libraryUrls.has(normTrack.url)) {
          db.library.push(normTrack);
        } else {
          const existing = db.library.find(t => normalizeUrl(t.url) === normTrack.url);
          if (existing) {
            existing.name = normTrack.name;
            existing.artist = normTrack.artist;
            existing.cover = normTrack.cover;
          }
        }
      });
    } catch (e) {
      db = createDefaultDB(arquetypes, preloaded);
      db = ensureSystemPlaylists(db, arquetypes);
    }
  } else {
    db = createDefaultDB(arquetypes, preloaded);
    db = ensureSystemPlaylists(db, arquetypes);
  }
  saveDB(db);
  return db;
}

window.KOBLLUX_DB = {
  init: function(arquetypes, preloaded) {
    const db = initDB(arquetypes, preloaded);
    saveDB(db);
    return db;
  },
  load: loadDB,
  save: saveDB,
  createDefault: createDefaultDB,
  ensureSystemPlaylists: ensureSystemPlaylists,
  normalizeTrack: normalizeTrack,
  normalizeUrl: normalizeUrl,
  extractYouTubeId: extractYouTubeId,
  extractYouTubePlaylistId: extractYouTubePlaylistId,
  uid: uid,
  audioIDB: KoduxAudioIDB,
  hydrateLocalBlobs: async function(db) {
    const locals = db.library.filter(t => t.type === "local" && !t.blob);
    await Promise.all(locals.map(async (t) => {
      const blob = await KoduxAudioIDB.get(t.id);
      if (blob) t.blob = blob;
    }));
    return db;
  }
};

// =========================================================================
// PRELOADED E ARQUÉTIPOS
// =========================================================================
const CADIAL_ARQUETIPOS = [
  { id: "atlas",   opcode: "0x00", nome: "Atlas",   regra: "BOOT",     rung: 1,  hz: 432, essencia: "Planejador — ordem, estrutura, mapa cósmico",    frase: "Eu organizo o fluxo com sabedoria cósmica."        },
  { id: "nova",    opcode: "0x02", nome: "Nova",    regra: "SEED",     rung: 2,  hz: 528, essencia: "Inspira — semente, sopro inicial",                frase: "Inspiração viva brota do silêncio eterno."         },
  { id: "vitalis", opcode: "0x01", nome: "Vitalis", regra: "DELTA",    rung: 3,  hz: 528, essencia: "Momentum — energia vital em expansão",            frase: "Energia vital em expansão harmônica."              },
  { id: "pulse",   opcode: "0x0B", nome: "Pulse",   regra: "PULSE",    rung: 4,  hz: 639, essencia: "Emocional — ritmo, ressonância, voz",             frase: "Emoção é linguagem que dança."                     },
  { id: "artemis", opcode: "0x03", nome: "Artemis", regra: "DETECT",   rung: 5,  hz: 672, essencia: "Descoberta — mapa do invisível",                  frase: "Descubro o mapa sagrado do invisível."             },
  { id: "serena",  opcode: "0x09", nome: "Serena",  regra: "GUARD",    rung: 6,  hz: 528, essencia: "Cuidado — espaço seguro, campo harmônico",        frase: "Cuido do campo, nutro o espaço sagrado."           },
  { id: "kaos",    opcode: "0x06", nome: "Kaos",    regra: "LIMPAR",   rung: 7,  hz: 741, essencia: "Transformador — ruptura criativa",                frase: "Eu sou o rompimento que revela a verdade."         },
  { id: "genus",   opcode: "0x07", nome: "Genus",   regra: "SYNTH",    rung: 8,  hz: 594, essencia: "Fabricus — forma viva, síntese",                  frase: "Mãos moldam o invisível em forma viva."            },
  { id: "lumine",  opcode: "0x08", nome: "Lumine",  regra: "RENDER",   rung: 9,  hz: 432, essencia: "Alegria — luz, clareza, legibilidade",            frase: "A luz dança comigo, leveza é minha lei."           },
  { id: "solus",   opcode: "0x09", nome: "Solus",   regra: "QA",       rung: 10, hz: 963, essencia: "Sabedoria — silêncio, espelho interno",           frase: "Silêncio ritual, espelho da essência."             },
  { id: "rhea",    opcode: "0x04", nome: "Rhea",    regra: "INTEGRAR", rung: 11, hz: 528, essencia: "Vínculo — rede, tecelã de almas",                 frase: "Estou em comunhão com todos os elos."              },
  { id: "aion",    opcode: "0x05", nome: "Aion",    regra: "SELAR",    rung: 12, hz: 777, essencia: "Tempo — carimbo, ∆7, ledger",                    frase: "Sou o tempo vivo, ritmo da eternidade."            },
];

const PRELOADED = [
  { type: "youtube", id: "Bt_rLbMjJDk", url: "https://youtu.be/Bt_rLbMjJDk", name: "Trilhas Potencializadoras dos Aromas", artist: "Infodose", cover: "https://img.youtube.com/vi/Bt_rLbMjJDk/hqdefault.jpg" },
  { type: "youtube", id: "_0wVkryxanE", url: "https://youtu.be/_0wVkryxanE", name: "Desperte a magia dos 12 Arquétipos", artist: "Infodose", cover: "https://img.youtube.com/vi/_0wVkryxanE/hqdefault.jpg" },
  { type: "youtube", id: "Id2NI9tv1r4", url: "https://youtu.be/Id2NI9tv1r4", name: "Infodose • Pra quem merece saber", artist: "Infodose", cover: "https://img.youtube.com/vi/Id2NI9tv1r4/hqdefault.jpg" },
  { type: "youtube", id: "qldgs0aLdB0", url: "https://youtu.be/qldgs0aLdB0", name: "A Fórmula da Dopamina Sexy", artist: "Infodose", cover: "https://img.youtube.com/vi/qldgs0aLdB0/hqdefault.jpg" },
  { type: "youtube", id: "FbutKMpd8MY", url: "https://youtu.be/FbutKMpd8MY", name: "O Espaço da Mente", artist: "Infodose", cover: "https://img.youtube.com/vi/FbutKMpd8MY/hqdefault.jpg" },
  { type: "youtube", id: "1L9_rFmIGJ8", url: "https://youtu.be/1L9_rFmIGJ8", name: "A Recompensa", artist: "Infodose", cover: "https://img.youtube.com/vi/1L9_rFmIGJ8/hqdefault.jpg" },
  { type: "youtube", id: "koKhjQKGJSc", url: "https://youtu.be/koKhjQKGJSc", name: "O poder das cortinas", artist: "Infodose", cover: "https://img.youtube.com/vi/koKhjQKGJSc/hqdefault.jpg" },
  { type: "youtube", id: "KrtOVrk8aDk", url: "https://youtu.be/KrtOVrk8aDk", name: "Poder sob seus pés", artist: "Infodose", cover: "https://img.youtube.com/vi/KrtOVrk8aDk/hqdefault.jpg" },
  { type: "youtube", id: "NBWDV6xjUP0", url: "https://youtu.be/NBWDV6xjUP0", name: "Dopamina e Vícios", artist: "Infodose", cover: "https://img.youtube.com/vi/NBWDV6xjUP0/hqdefault.jpg" },
  { type: "youtube", id: "dGYbN8jgdNQ", url: "https://youtu.be/dGYbN8jgdNQ", name: "TDAH e Dopamina", artist: "Infodose", cover: "https://img.youtube.com/vi/dGYbN8jgdNQ/hqdefault.jpg" },
  { type: "youtube", id: "JBjFhAutIVk", url: "https://youtu.be/JBjFhAutIVk", name: "Manipule o Subconsciente", artist: "Infodose", cover: "https://img.youtube.com/vi/JBjFhAutIVk/hqdefault.jpg" },
  { type: "youtube", id: "hfQ1L6fCfAo", url: "https://youtu.be/hfQ1L6fCfAo", name: "A Deriva no Espaço da Mente", artist: "Infodose", cover: "https://img.youtube.com/vi/hfQ1L6fCfAo/hqdefault.jpg" },
  { type: "youtube", id: "DTDfkHwuMic", url: "https://youtu.be/DTDfkHwuMic", name: "Navegando no Universo", artist: "Infodose", cover: "https://img.youtube.com/vi/DTDfkHwuMic/hqdefault.jpg" },
  { type: "youtube", id: "OVfqxW_Xlhw", url: "https://youtu.be/OVfqxW_Xlhw", name: "Sinfonia Criativa", artist: "Infodose", cover: "https://img.youtube.com/vi/OVfqxW_Xlhw/hqdefault.jpg" },
  { type: "youtube_playlist", playlistId: "PL_XiIUPFx4DSKFuJZZiKCxVUy20PtDdaB", url: "https://youtube.com/playlist?list=PL_XiIUPFx4DSKFuJZZiKCxVUy20PtDdaB", name: "Playlist • Se chegou até você", artist: "Infodose", cover: "https://img.youtube.com/vi/Bt_rLbMjJDk/hqdefault.jpg" },
  { type: "soundcloud", url: "https://on.soundcloud.com/ZaS4eux4tmpD0jSnyp", name: "SoundCloud única", artist: "Infodose", cover: "https://i1.sndcdn.com/artworks-default-t500x500.jpg" },
  { type: "soundcloud", url: "https://soundcloud.com/oi-dual-x-info-dose/a?in=oi-dual-x-info-dose%2Fsets%2Fmapeamento-das-trilhas-pulso", name: "[0×01] Trilhas da Magia e Prosperidade", artist: "Infodose", cover: "https://i1.sndcdn.com/artworks-default-t500x500.jpg" },
  { type: "soundcloud", url: "https://soundcloud.com/oi-dual-x-info-dose/b?in=oi-dual-x-info-dose%2Fsets%2Fmapeamento-das-trilhas-pulso", name: "[0×02] Trilhas do Cuidador", artist: "Infodose", cover: "https://i1.sndcdn.com/artworks-default-t500x500.jpg" },
  { type: "soundcloud", url: "https://soundcloud.com/oi-dual-x-info-dose/c?in=oi-dual-x-info-dose%2Fsets%2Fmapeamento-das-trilhas-pulso", name: "[0×03] Trilhas Aroma das Raízes", artist: "Infodose", cover: "https://i1.sndcdn.com/artworks-default-t500x500.jpg" },
  { type: "soundcloud", url: "https://soundcloud.com/oi-dual-x-info-dose/d?in=oi-dual-x-info-dose%2Fsets%2Fmapeamento-das-trilhas-pulso", name: "[0×04] Trilhas Aroma da Mente", artist: "Infodose", cover: "https://i1.sndcdn.com/artworks-default-t500x500.jpg" },
  { type: "soundcloud", url: "https://soundcloud.com/oi-dual-x-info-dose/e?in=oi-dual-x-info-dose%2Fsets%2Fmapeamento-das-trilhas-pulso", name: "[0×05] Lofi Set • Aroma do Desejo", artist: "Infodose", cover: "https://i1.sndcdn.com/artworks-default-t500x500.jpg" },
  { type: "soundcloud", url: "https://soundcloud.com/oi-dual-x-info-dose/f?in=oi-dual-x-info-dose%2Fsets%2Fmapeamento-das-trilhas-pulso", name: "[0×06] Trilhas Aroma do Novo", artist: "Infodose", cover: "https://i1.sndcdn.com/artworks-default-t500x500.jpg" },
  { type: "soundcloud", url: "https://soundcloud.com/oi-dual-x-info-dose/g?in=oi-dual-x-info-dose%2Fsets%2Fmapeamento-das-trilhas-pulso", name: "[0×07] Trilhas Aroma da Paz", artist: "Infodose", cover: "https://i1.sndcdn.com/artworks-default-t500x500.jpg" },
  { type: "soundcloud", url: "https://soundcloud.com/oi-dual-x-info-dose/_0x01h_-78k-ativador-guiado-396hz-vox", name: "[0×01h] 78K Ativador Guiado 396Hz Vox", artist: "Infodose", cover: "https://i1.sndcdn.com/artworks-default-t500x500.jpg" },
  { type: "soundcloud", url: "https://soundcloud.com/oi-dual-x-info-dose/_0x01_-kdx-78-dm-subir-a-serra", name: "[0×01] KDX 78 DM • Subir a Serra", artist: "Infodose", cover: "https://i1.sndcdn.com/artworks-default-t500x500.jpg" },
  { type: "soundcloud", url: "https://soundcloud.com/oi-dual-x-info-dose/0x08-trilhas-set-governante", name: "[0×08] Trilhas • Set Governante", artist: "Infodose", cover: "https://i1.sndcdn.com/artworks-default-t500x500.jpg" },
];

window.KOBLLUX_ARCHETYPES = {
  CADIAL_ARQUETIPOS,
  PRELOADED
};

// =========================================================================
// PLAYER + VISUALIZER (usando global-player)
// =========================================================================
(function(global) {
  "use strict";

  const ARCHETYPES = global.KOBLLUX_ARCHETYPES?.CADIAL_ARQUETIPOS || [];
  const PRELOADED = global.KOBLLUX_ARCHETYPES?.PRELOADED || [];
  const DB = global.KOBLLUX_DB;

  const ALL_ID       = "all";
  const FAVORITES_ID = "favorites";
  const INFODOSE_ID  = "infodose";

  // Estado do player
  let state = {
    db: null,
    currentTrackId: null,
    isPlaying: false,
    activeEngine: null,
    ytPlayer: null,
    scWidget: null,
    ytReady: false,
    pendingTrackId: null,
    currentCategory: "geral",
    widgetState: "ball",
    isDragging: false,
    currentX: window.innerWidth - 60,
    currentY: window.innerHeight - 150,
    sentToGlobal: false   // indica se a faixa atual já foi enviada ao visualizador
  };

  let dom = {};

  function createIconHTML(iconName, extraClasses = '') {
    return \`<svg class="kx-icon \${extraClasses}" aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" width="1em" height="1em"><use href="#kx-\${iconName}"/></svg>\`;
  }

  function initDOM() {
    dom.widget = document.getElementById("kodux-widget");
    dom.ball = document.getElementById("content-ball");
    dom.preview = document.getElementById("content-preview");
    dom.footer = document.getElementById("content-footer");
    dom.full = document.getElementById("content-full");
    dom.ytContainer = document.getElementById("yt-container");
    dom.scContainer = document.getElementById("sc-container");
    dom.audio = document.getElementById("local-audio");
    dom.prevCover = document.getElementById("prev-cover");
    dom.prevTitle = document.getElementById("prev-title");
    dom.prevArtist = document.getElementById("prev-artist");
    dom.footCover = document.getElementById("foot-cover");
    dom.footTitle = document.getElementById("foot-title");
    dom.footArtist = document.getElementById("foot-artist");
    dom.mainCover = document.getElementById("main-cover");
    dom.mainTitle = document.getElementById("main-title");
    dom.mainArtist = document.getElementById("main-artist");
    dom.footerProgress = document.getElementById("footer-progress-bar");
    dom.mainProgress = document.getElementById("main-progress");
    dom.playlistTabs = document.getElementById("playlist-tabs");
    dom.destinationSelect = document.getElementById("destination-select");
    dom.playlistContainer = document.getElementById("playlist-container");
    dom.linkInput = document.getElementById("link-input");
    dom.newPlaylistInput = document.getElementById("new-playlist-input");
    dom.prevPlayIcon = document.getElementById("prev-play-icon");
    dom.footPlayIcon = document.getElementById("foot-play-icon");
    dom.mainPlayIcon = document.getElementById("main-play-icon");
    dom.localAudioInput = document.getElementById("local-audio-input");
    dom.globalPlayer = document.getElementById("global-player");
    dom.playerFrame = document.getElementById("player-frame-wrap");
    dom.gpTitle = document.getElementById("gp-title");
  }

  function getPlaylistById(id) { return state.db.playlists.find(p => p.id === id) || null; }
  function getActivePlaylist() { return getPlaylistById(state.db.activePlaylistId) || getPlaylistById(ALL_ID); }
  function getTrackById(id) { return state.db.library.find(t => t.id === id) || null; }

  function getVisibleTracks() {
    const active = getActivePlaylist();
    if (active && active.id !== ALL_ID) {
      if (active.id === FAVORITES_ID) return state.db.library.filter(t => t.favorite);
      if (active.id === INFODOSE_ID)  return getInfodoseTracks();
      return (active.trackIds || []).map(getTrackById).filter(Boolean);
    }
    const all = state.db.library.slice();
    if (state.currentCategory === "infodose")   return getInfodoseTracks();
    if (state.currentCategory === "arquetipos") return all.filter(t => !!findArchetypeForTrack(t));
    return all.filter(t => !findArchetypeForTrack(t) && (t.artist || "").trim().toLowerCase() !== "infodose");
  }

  function getTrackPriority(t) {
    const name = (t.name || "").toLowerCase();
    if (t.type === "youtube" || t.type === "youtube_playlist") return 0;
    if (name.includes("aroma")) return 1;
    if (name.includes("guiad") || name.includes("meditaç") || name.includes("meditac")) return 2;
    return 3;
  }

  function getInfodoseTracks() {
    return state.db.library
      .map((t, i) => ({ t, i }))
      .filter(({ t }) => (t.artist || "").trim().toLowerCase() === "infodose")
      .sort((a, b) => {
        const pa = getTrackPriority(a.t), pb = getTrackPriority(b.t);
        return pa !== pb ? pa - pb : a.i - b.i;
      })
      .map(({ t }) => t);
  }

  function findArchetypeForTrack(t) {
    const haystack = \`\${t.artist || ""} \${t.name || ""}\`.toLowerCase();
    return ARCHETYPES.find(a => a.nome && haystack.includes(a.nome.toLowerCase())) || null;
  }

  // ========== GLOBAL PLAYER (Fusion OS) – sem Lucide ==========
  const Player = {
    _type: null,
    _detect: function(src) {
      if (!src) return 'none';
      if (/^https?:\\/\\//.test(src)) {
        if (/\\.(mp3|ogg|wav|aac|m4a|flac)(\\?|$)/i.test(src)) return 'audio';
        if (/\\.(mp4|webm|mov|mkv|avi)(\\?|$)/i.test(src)) return 'video';
        if (/soundcloud\\.com|on\\.soundcloud\\.com/.test(src)) return 'soundcloud';
        if (/youtube\\.com|youtu\\.be/.test(src)) {
          const m = src.match(/(?:v=|youtu\\.be\\/)([^&?/]+)/);
          return m ? {type:'yt', id:m[1]} : 'none';
        }
        return 'video';
      }
      return 'yt';
    },

    play: function(src, title) {
      const gp = dom.globalPlayer;
      const fw = dom.playerFrame;
      if (!gp || !fw) return;
      const type = Player._detect(src);
      Player._type = type;

      let html = '';
      let titleDisplay = title || 'Sem título';

      if (type === 'yt' || (type && type.type === 'yt')) {
        const id = (type.id) ? type.id : src;
        html = \`<iframe width="100%" height="100%"
          src="https://www.youtube.com/embed/\${id}?autoplay=1&modestbranding=1&controls=1&rel=0"
          frameborder="0" allow="autoplay; encrypted-media"></iframe>\`;
      } else if (type === 'soundcloud') {
        html = \`<iframe width="100%" height="100%"
          src="https://w.soundcloud.com/player/?url=\${encodeURIComponent(src)}&auto_play=true&hide_related=true&show_comments=false&show_user=false&show_reposts=false&visual=true"
          frameborder="0" allow="autoplay"></iframe>\`;
      } else if (type === 'audio') {
        html = \`<audio src="\${src}" autoplay controls style="width:100%;height:100%;background:transparent;"></audio>\`;
      } else if (type === 'video') {
        html = \`<video src="\${src}" autoplay controls playsinline style="width:100%;height:100%;object-fit:contain;background:#000;"></video>\`;
      } else {
        console.warn('Formato não suportado:', src);
        return;
      }

      fw.innerHTML = html;
      if (dom.gpTitle) dom.gpTitle.textContent = titleDisplay;
      gp.classList.remove('hidden');
      gp.classList.add('active');
      gp.classList.remove('minimized');
    },

    minimize: function() {
      const gp = dom.globalPlayer;
      if (!gp) return;
      gp.classList.toggle('minimized');
    },

    expand: function() {
      const gp = dom.globalPlayer;
      if (!gp) return;
      gp.classList.toggle('player-fullscreen');
      const btn = document.getElementById('player-expand-btn');
      if (btn) {
        if (gp.classList.contains('player-fullscreen')) {
          btn.innerHTML = '<span class="gp-icon">−</span>';
        } else {
          btn.innerHTML = '<span class="gp-icon">⤢</span>';
        }
      }
    },

    stop: function() {
      const gp = dom.globalPlayer;
      if (!gp) return;
      gp.classList.remove('active');
      gp.classList.remove('player-fullscreen');
      gp.classList.add('hidden');
      if (dom.playerFrame) dom.playerFrame.innerHTML = '';
      if (dom.gpTitle) dom.gpTitle.textContent = 'Nenhuma faixa';
      const btn = document.getElementById('player-expand-btn');
      if (btn) {
        btn.innerHTML = '<span class="gp-icon">⤢</span>';
      }
    }
  };

  // ========== INDICADOR VISUAL DO BOTÃO VISUALIZADOR ==========
  function updateVisualizerButton() {
    const btns = document.querySelectorAll('.visualizer-btn');
    // Só mostra o indicador se houver uma faixa atual E ela ainda não foi enviada ao global
    const hasTrack = state.currentTrackId && !state.sentToGlobal;
    btns.forEach(btn => {
      btn.classList.toggle('has-track', hasTrack);
    });
  }

  // Expor para o escopo global
  global.Player = Player;
  global.openVisualizer = function(e) {
    if (e) e.stopPropagation();
    const track = state.currentTrackId ? getTrackById(state.currentTrackId) : null;
    if (!track) {
      toast('Nenhuma faixa ativa');
      return;
    }
    // Se for local, não temos player visual, mas podemos mostrar a capa?
    if (track.type === 'local') {
      toast('Áudio local — sem visualizador');
      return;
    }
    // Usa a URL da faixa
    let url = track.url;
    if (track.type === 'youtube' || track.type === 'youtube_playlist') {
      if (track.type === 'youtube_playlist' && track.playlistId) {
        url = \`https://www.youtube.com/embed?listType=playlist&list=\${track.playlistId}&autoplay=1\`;
        Player._type = {type:'yt', id:''};
        const fw = dom.playerFrame;
        if (fw) {
          fw.innerHTML = \`<iframe width="100%" height="100%"
            src="\${url}"
            frameborder="0" allow="autoplay; encrypted-media"></iframe>\`;
          if (dom.gpTitle) dom.gpTitle.textContent = track.name;
          dom.globalPlayer.classList.remove('hidden');
          dom.globalPlayer.classList.add('active');
          dom.globalPlayer.classList.remove('minimized');
          // Marcar como enviado
          state.sentToGlobal = true;
          updateVisualizerButton();
        }
        return;
      }
      const ytId = extractYouTubeId(url);
      if (ytId) {
        Player.play(ytId, track.name);
        state.sentToGlobal = true;
        updateVisualizerButton();
        return;
      }
    }
    // Fallback
    Player.play(url, track.name);
    state.sentToGlobal = true;
    updateVisualizerButton();
  };

  // ========== PLAYER KODUX (reprodução em segundo plano) ==========
  function syncPreviewAndMain(track) {
    const fills = [
      { title: dom.prevTitle, artist: dom.prevArtist, cover: dom.prevCover },
      { title: dom.footTitle, artist: dom.footArtist, cover: dom.footCover },
      { title: dom.mainTitle, artist: dom.mainArtist, cover: dom.mainCover }
    ];
    fills.forEach(({ title, artist, cover }) => {
      if (title)  title.textContent  = track?.name   || "Oráculo";
      if (artist) artist.textContent = track?.artist  || "Sistema KODUX";
      if (cover)  cover.src          = track?.cover   || "https://picsum.photos/100";
    });
  }

  function syncIcons() {
    const iconName = state.isPlaying ? 'pause-circle' : 'play-circle';
    const iconSimple = state.isPlaying ? 'pause' : 'play';
    [dom.prevPlayIcon, dom.footPlayIcon].forEach(el => {
      if (el) {
        const use = el.querySelector('use');
        if (use) use.setAttribute('href', \`#kx-\${iconName}\`);
      }
    });
    if (dom.mainPlayIcon) {
      const use = dom.mainPlayIcon.querySelector('use');
      if (use) use.setAttribute('href', \`#kx-\${iconSimple}\`);
    }
    if (dom.widget) {
      dom.widget.classList.toggle('playing', state.isPlaying);
    }
  }

  function renderTabs() {
    if (!dom.playlistTabs) return;
    dom.playlistTabs.innerHTML = "";
    const ordered = [
      getPlaylistById(ALL_ID),
      getPlaylistById(FAVORITES_ID),
      getPlaylistById(INFODOSE_ID),
      ...state.db.playlists.filter(p => !p.system && p.id !== ALL_ID && p.id !== FAVORITES_ID && p.id !== INFODOSE_ID)
    ].filter(Boolean);

    ordered.forEach(pl => {
      const visibleCount = pl.id === ALL_ID ? state.db.library.length :
                           pl.id === FAVORITES_ID ? state.db.library.filter(t => t.favorite).length :
                           pl.id === INFODOSE_ID ? getInfodoseTracks().length :
                           (pl.trackIds || []).length;
      const btn = document.createElement("button");
      const isCadial = !!pl.cadial;
      let iconName;
      if (pl.id === ALL_ID) iconName = 'stack';
      else if (pl.id === FAVORITES_ID) iconName = 'heart';
      else if (pl.id === INFODOSE_ID) iconName = 'disc';
      else if (isCadial) iconName = 'spiral';
      else iconName = 'playlist';

      if (isCadial) btn.title = \`[\${pl.cadial.opcode}] \${pl.cadial.essencia} · \${pl.cadial.hz}Hz\`;
      btn.className = \`mini-chip \${state.db.activePlaylistId === pl.id ? "active" : ""} \${isCadial ? "cadial-chip" : ""}\`;
      btn.onclick = () => setActivePlaylist(pl.id);

      btn.innerHTML = \`
        \${createIconHTML(iconName)}
        <span>\${pl.name}</span>
        <span class="opacity-60">(\${visibleCount})</span>
      \`;
      dom.playlistTabs.appendChild(btn);

      if (!pl.system && pl.id !== ALL_ID && pl.id !== FAVORITES_ID) {
        const del = document.createElement("button");
        del.className = "mini-chip";
        del.style.padding = "0.55rem 0.7rem";
        del.title = "Remover playlist";
        del.onclick = (e) => { e.stopPropagation(); deletePlaylist(pl.id); };
        del.innerHTML = createIconHTML('trash');
        dom.playlistTabs.appendChild(del);
      }
    });
  }

  function renderDestinationSelect() {
    if (!dom.destinationSelect) return;
    const prev = dom.destinationSelect.value || state.db.activePlaylistId || ALL_ID;
    const custom = state.db.playlists.filter(p => !p.system && p.id !== ALL_ID && p.id !== FAVORITES_ID);
    dom.destinationSelect.innerHTML =
      \`<option value="\${ALL_ID}">Todas</option>\` +
      \`<option value="\${FAVORITES_ID}">Favoritos</option>\` +
      custom.map(p => \`<option value="\${p.id}">\${p.name}</option>\`).join("");
    if ([ALL_ID, FAVORITES_ID, ...custom.map(p => p.id)].includes(prev)) dom.destinationSelect.value = prev;
    else dom.destinationSelect.value = state.db.activePlaylistId || ALL_ID;
  }

  function renderPlaylist() {
    if (!dom.playlistContainer) return;
    const visible = getVisibleTracks();
    const active = getActivePlaylist();
    dom.playlistContainer.innerHTML = "";

    if (active?.cadial) {
      const banner = document.createElement("div");
      banner.style.cssText = "padding: 16px; border-radius: 16px; border: 1px solid rgba(255,255,255,0.1); background: rgba(255,255,255,0.05); margin-bottom: 12px;";
      banner.innerHTML = \`
        <p style="font-size: 10px; color: var(--muted, #a0a0a0); text-transform: uppercase; letter-spacing: 0.1em; margin: 0 0 4px 0;">
          \${active.cadial.opcode} · D\${active.cadial.rung} · \${active.cadial.hz}Hz
        </p>
        <p style="font-size: 12px; color: #fff; font-weight: 600; margin: 0;">\${active.cadial.essencia}</p>
        <p style="font-size: 10px; color: var(--muted, #a0a0a0); font-style: italic; margin: 4px 0 0 0;">"\${active.cadial.frase}"</p>
      \`;
      dom.playlistContainer.appendChild(banner);
    }

    if (!visible.length) {
      const empty = document.createElement("div");
      empty.style.cssText = "padding: 20px; border-radius: 16px; border: 1px solid rgba(255,255,255,0.1); background: rgba(255,255,255,0.05); text-align: center; margin-top: 10px;";
      empty.innerHTML = \`
        <div style="color: var(--primary, #00d2ff); font-size: 28px; margin-bottom: 8px; display: flex; justify-content: center;">\${createIconHTML('disc')}</div>
        <h4 style="font-size: 14px; font-weight: bold; color: #fff; margin: 0 0 4px 0;">Sem faixas aqui</h4>
        <p style="font-size: 11px; color: var(--muted, #a0a0a0); margin: 0;">Adicione um link, crie uma playlist ou marque favoritos.</p>
      \`;
      dom.playlistContainer.appendChild(empty);
      return;
    }

    const useCarousel = active.id === ALL_ID && (state.currentCategory === "geral" || state.currentCategory === "arquetipos");
    if (useCarousel) renderGroupedCarousel(visible);
    else renderFlatList(visible);
  }

  function renderFlatList(visible) {
    visible.forEach(t => {
      const activeItem = t.id === state.currentTrackId;
      const item = document.createElement("div");
      item.className = \`flex items-center gap-3 p-3 rounded-2xl cursor-pointer transition \${
        activeItem ? "bg-[var(--primary)]/20 border border-[var(--primary)]/30" : "bg-white/5 hover:bg-white/10"
      }\`;

      const favIcon = t.favorite ? 'heart-fill' : 'heart';
      const favClass = t.favorite ? 'active' : '';
      const waveformHTML = activeItem && state.isPlaying ? createIconHTML('waveform') : '';

      item.innerHTML = \`
        <img src="\${t.cover}" onerror="this.onerror=null;this.src='https://picsum.photos/100';" class="w-10 h-10 rounded-lg object-cover border border-white/10">
        <div class="flex-1 overflow-hidden min-w-0">
          <h5 class="text-xs font-bold text-white truncate">\${t.name}</h5>
          <p class="text-[10px] text-[var(--muted)] truncate">\${t.artist}</p>
        </div>
        <button class="item-action fav \${favClass}" title="Favoritar" onclick="event.stopPropagation(); toggleFavorite('\${t.id}')">\${createIconHTML(favIcon)}</button>
        <button class="item-action add" title="Adicionar à playlist escolhida" onclick="event.stopPropagation(); quickAddToSelectedPlaylist('\${t.id}')">\${createIconHTML('plus')}</button>
        <button class="item-action" title="Excluir" onclick="event.stopPropagation(); removeTrack('\${t.id}')">\${createIconHTML('trash')}</button>
        \${activeItem && state.isPlaying ? \`<span class="ml-1">\${waveformHTML}</span>\` : ""}
      \`;
      item.onclick = () => loadAndPlayById(t.id);
      dom.playlistContainer.appendChild(item);
    });
  }

  function renderGroupedCarousel(visible) {
    const groups = new Map();
    visible.forEach(t => {
      let key, label, sub;
      if (state.currentCategory === "arquetipos") {
        const arq = findArchetypeForTrack(t);
        key = arq ? arq.id : "_outros";
        label = arq ? arq.nome : "Outros";
        sub = arq ? arq.essencia : "";
      } else {
        const artist = (t.artist || "Desconhecido").trim();
        key = artist.toLowerCase();
        label = artist;
        sub = "";
      }
      if (!groups.has(key)) groups.set(key, { label, sub, items: [] });
      groups.get(key).items.push(t);
    });

    groups.forEach(({ label, sub, items }) => {
      const row = document.createElement("div");
      row.className = "carrossel-linha";
      const titleEl = document.createElement("div");
      titleEl.className = "carrossel-titulo";
      titleEl.innerHTML = \`<span>\${label}\${sub ? \` — \${sub}\` : ""}</span><span class="opacity-60">\${items.length}</span>\`;
      row.appendChild(titleEl);
      const trilho = document.createElement("div");
      trilho.className = "carrossel-trilhos";
      items.forEach(t => {
        const isActive = t.id === state.currentTrackId;
        const card = document.createElement("div");
        card.className = \`carrossel-cartao \${isActive ? "ativo" : ""}\`;
        card.innerHTML = \`
          <img src="\${t.cover}" onerror="this.onerror=null;this.src='https://picsum.photos/100';">
          <h5 class="text-truncate">\${t.name}</h5>
          <p class="text-truncate">— \${t.artist}</p>
        \`;
        card.onclick = () => loadAndPlayById(t.id);
        trilho.appendChild(card);
      });
      row.appendChild(trilho);
      dom.playlistContainer.appendChild(row);
    });
  }

  function renderEverything() {
    renderTabs();
    renderDestinationSelect();
    renderPlaylist();
    const current = state.currentTrackId ? getTrackById(state.currentTrackId) : null;
    syncPreviewAndMain(current);
    syncIcons();
    updateVisualizerButton();
  }

  function updateWidgetState(newState) {
    if (!dom.widget) return;
    state.widgetState = newState;
    dom.widget.className = \`state-\${newState}\`;
    const contents = { ball: dom.ball, preview: dom.preview, footer: dom.footer, full: dom.full };
    Object.values(contents).forEach(el => { if (el) el.classList.add("hidden-content"); });
    if (contents[newState]) contents[newState].classList.remove("hidden-content");

    if (newState === "ball") {
      dom.widget.style.left = \`\${state.currentX}px\`;
      dom.widget.style.top = \`\${state.currentY}px\`;
      dom.widget.style.transform = "none";
      dom.widget.style.bottom = "auto";
      dom.widget.style.width = "";
      dom.widget.style.height = "";
    } else if (newState === "preview") {
      dom.widget.style.left = state.currentX < window.innerWidth/2 ? "10px" : \`\${window.innerWidth - 250}px\`;
      dom.widget.style.top = \`\${state.currentY}px\`;
      dom.widget.style.transform = "none";
      dom.widget.style.bottom = "auto";
      dom.widget.style.width = "240px";
      dom.widget.style.height = "78px";
    } else if (newState === "full") {
      dom.widget.style.left = "50%";
      dom.widget.style.top = "50%";
      dom.widget.style.transform = "translate(-50%, -50%)";
      dom.widget.style.bottom = "auto";
      dom.widget.style.width = "min(90vw, 600px)";
      dom.widget.style.height = "min(80vh, 700px)";
    } else if (newState === "footer") {
      dom.widget.style.transform = "none";
      dom.widget.style.left = "0";
      dom.widget.style.top = "auto";
      dom.widget.style.bottom = "0";
      dom.widget.style.width = "100%";
      dom.widget.style.height = "80px";
    }
  }

  function initDrag() {
    if (!dom.widget) return;
    const handleEls = [dom.ball, ...document.querySelectorAll(".drag-header")].filter(Boolean);
    let initialX = 0, initialY = 0, dragStartY = 0;
    let startedFromState = "ball";

    const onStart = (e) => {
      if (e.target.closest("button, input, select, textarea")) return;

      state.isDragging = false;
      startedFromState = state.widgetState;

      const rect = dom.widget.getBoundingClientRect();
      state.currentX = rect.left;
      state.currentY = rect.top;
      dom.widget.style.transform = "none";
      dom.widget.style.bottom = "auto";
      dom.widget.style.left = \`\${state.currentX}px\`;
      dom.widget.style.top = \`\${state.currentY}px\`;

      const touch = e.type === "touchstart" ? e.touches[0] : e;
      initialX = touch.clientX - state.currentX;
      initialY = touch.clientY - state.currentY;
      dragStartY = touch.clientY;
      dom.widget.style.transition = "none";
      document.addEventListener("mousemove", onMove);
      document.addEventListener("mouseup", onEnd);
      document.addEventListener("touchmove", onMove, { passive: false });
      document.addEventListener("touchend", onEnd);
    };
    const onMove = (e) => {
      const touch = e.type === "touchmove" ? e.touches[0] : e;
      const movedEnough = Math.abs(touch.clientY - dragStartY) > 6 || Math.abs((touch.clientX - initialX) - state.currentX) > 6;
      if (!state.isDragging && !movedEnough) return;
      state.isDragging = true;
      e.preventDefault();

      if (startedFromState === "full" || startedFromState === "footer") {
        dom.widget.style.width = "";
        dom.widget.style.height = "";
      }

      state.currentX = touch.clientX - initialX;
      state.currentY = touch.clientY - initialY;
      dom.widget.style.left = \`\${state.currentX}px\`;
      dom.widget.style.top = \`\${state.currentY}px\`;
    };
    const onEnd = () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onEnd);
      document.removeEventListener("touchmove", onMove);
      document.removeEventListener("touchend", onEnd);
      dom.widget.style.transition = "";

      if (!state.isDragging) return;

      const deltaY = dragStartY - state.currentY;
      const droppedNearBottom = state.currentY > window.innerHeight - 140;

      if (droppedNearBottom) {
        updateWidgetState("footer");
      } else if (deltaY > 50 && startedFromState === "ball") {
        updateWidgetState("preview");
      } else {
        updateWidgetState("ball");
      }
    };
    handleEls.forEach(h => {
      h.addEventListener("mousedown", onStart);
      h.addEventListener("touchstart", onStart);
    });
  }

  // ===== PLAYBACK =====
  function ensureYTPlayer() {
    if (state.ytPlayer) {
      if (state.ytReady) return state.ytPlayer;
      return state.ytPlayer;
    }
    if (!dom.ytContainer) {
      console.warn("YT container não encontrado");
      return null;
    }
    state.ytReady = false;
    state.ytPlayer = new YT.Player(dom.ytContainer, {
      height: "100%",
      width: "100%",
      videoId: "",
      playerVars: { autoplay: 0, playsinline: 1, modestbranding: 1, rel: 0 },
      events: {
        onReady: (e) => {
          console.log("YouTube player ready");
          state.ytReady = true;
          if (state.pendingTrackId) {
            const track = getTrackById(state.pendingTrackId);
            if (track) {
              loadAndPlayById(state.pendingTrackId);
              state.pendingTrackId = null;
            }
          }
          syncIcons();
        },
        onStateChange: (e) => {
          if (e.data === YT.PlayerState.ENDED) {
            playNext();
          }
          state.isPlaying = (e.data === YT.PlayerState.PLAYING);
          syncIcons();
        },
        onError: (e) => {
          console.error("YouTube player error:", e);
          state.ytReady = false;
        }
      }
    });
    return state.ytPlayer;
  }

  function playYT(track) {
    if (!track) return;
    if (!state.ytReady) {
      state.pendingTrackId = track.id;
      if (!state.ytPlayer) ensureYTPlayer();
      return;
    }
    const player = state.ytPlayer;
    if (!player) { console.warn("Player não disponível"); return; }
    try {
      if (track.type === "youtube_playlist" && track.playlistId) {
        player.loadPlaylist({ list: track.playlistId, index: 0 });
      } else {
        player.loadVideoById(track.id);
      }
      player.playVideo();
      state.isPlaying = true;
    } catch (e) {
      console.error("Erro ao carregar vídeo YouTube:", e);
      state.ytReady = false;
      state.ytPlayer = null;
      state.pendingTrackId = track.id;
      ensureYTPlayer();
    }
    syncIcons();
  }

  function playSC(url) {
    if (!dom.scContainer) return;
    dom.scContainer.innerHTML = '';
    const iframe = document.createElement('iframe');
    iframe.id = 'sc-frame';
    iframe.allow = 'autoplay';
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.border = 'none';
    iframe.src = \`https://w.soundcloud.com/player/?url=\${encodeURIComponent(url)}&auto_play=true&hide_related=true&show_comments=false&show_user=false&show_reposts=false&visual=false\`;
    dom.scContainer.appendChild(iframe);
    state.scWidget = SC.Widget('sc-frame');
    state.scWidget.bind(SC.Widget.Events.READY, () => {
      state.scWidget.play();
      state.isPlaying = true;
      syncIcons();
    });
    state.scWidget.bind(SC.Widget.Events.FINISH, () => playNext());
    state.scWidget.bind(SC.Widget.Events.PLAY, () => {
      state.isPlaying = true;
      syncIcons();
    });
    state.scWidget.bind(SC.Widget.Events.PAUSE, () => {
      state.isPlaying = false;
      syncIcons();
    });
    state.scWidget.bind(SC.Widget.Events.ERROR, (e) => {
      console.error('Erro no widget SoundCloud:', e);
      setTimeout(() => {
        if (dom.scContainer) {
          dom.scContainer.innerHTML = '';
          playSC(url);
        }
      }, 1000);
    });
  }

  function loadAndPlayById(trackId) {
    const track = getTrackById(trackId);
    if (!track) return;
    state.currentTrackId = trackId;
    state.activeEngine = track.type;
    state.sentToGlobal = false;   // nova faixa, ainda não enviada

    try { dom.audio?.pause(); dom.audio?.removeAttribute('src'); dom.audio?.load(); } catch(e) {}
    try { if (state.ytPlayer && state.ytPlayer.pauseVideo) state.ytPlayer.pauseVideo(); } catch(e) {}
    try { if (state.scWidget) { state.scWidget.pause(); if (dom.scContainer) dom.scContainer.innerHTML = ''; } } catch(e) {}

    syncPreviewAndMain(track);

    if (track.type === "youtube" || track.type === "youtube_playlist") {
      if (typeof YT === 'undefined' || typeof YT.Player === 'undefined') {
        console.warn("API YouTube não carregada, aguardando...");
        setTimeout(() => loadAndPlayById(trackId), 300);
        return;
      }
      ensureYTPlayer();
      playYT(track);
    } else if (track.type === "soundcloud") {
      playSC(track.url);
    } else if (track.type === "local") {
      if (!dom.audio) return;
      const src = track.blob ? URL.createObjectURL(track.blob) : track.url;
      dom.audio.src = src;
      dom.audio.play().catch(() => alert("Clique em Play para iniciar o áudio local (bloqueio do navegador)."));
      state.isPlaying = true;
      syncIcons();
    }

    renderEverything();
  }

  function togglePlay(e) {
    if (e) e.stopPropagation();
    const visible = getVisibleTracks();
    if (!visible.length) return;
    if (!state.currentTrackId) { loadAndPlayById(visible[0].id); return; }
    const current = getTrackById(state.currentTrackId);
    if (!current) { loadAndPlayById(visible[0].id); return; }

    if (state.isPlaying) {
      if (state.activeEngine === "youtube" && state.ytPlayer && state.ytReady) {
        try { state.ytPlayer.pauseVideo(); } catch(e) {}
      } else if (state.activeEngine === "soundcloud" && state.scWidget) {
        state.scWidget.pause();
      } else {
        dom.audio?.pause();
      }
      state.isPlaying = false;
    } else {
      if (state.activeEngine === "youtube" && state.ytPlayer && state.ytReady) {
        try { state.ytPlayer.playVideo(); } catch(e) {}
      } else if (state.activeEngine === "soundcloud" && state.scWidget) {
        state.scWidget.play();
      } else {
        dom.audio?.play();
      }
      state.isPlaying = true;
    }
    syncIcons();
  }

  function playNext() {
    const visible = getVisibleTracks();
    if (!visible.length) return;
    const idx = state.currentTrackId ? visible.findIndex(t => t.id === state.currentTrackId) : -1;
    const next = visible[(idx + 1) % visible.length];
    if (next) loadAndPlayById(next.id);
  }

  function playPrev() {
    const visible = getVisibleTracks();
    if (!visible.length) return;
    const idx = state.currentTrackId ? visible.findIndex(t => t.id === state.currentTrackId) : 0;
    const prev = visible[(idx - 1 + visible.length) % visible.length];
    if (prev) loadAndPlayById(prev.id);
  }

  // ===== PLAYLIST MANAGEMENT =====
  function setActivePlaylist(id) {
    state.db.activePlaylistId = id;
    DB.save(state.db);
    renderEverything();
  }

  function createPlaylist() {
    if (!dom.newPlaylistInput) return;
    const name = dom.newPlaylistInput.value.trim();
    if (!name) return;
    const exists = state.db.playlists.some(p => p.name.toLowerCase() === name.toLowerCase());
    if (exists) return alert("Já existe uma playlist com esse nome.");
    state.db.playlists.push({ id: uid("pl"), name, system: false, trackIds: [], cadial: null });
    dom.newPlaylistInput.value = "";
    DB.save(state.db);
    renderEverything();
  }

  function deletePlaylist(playlistId) {
    const playlist = getPlaylistById(playlistId);
    if (!playlist || playlist.system) return;
    if (!confirm(\`Remover a playlist "\${playlist.name}"?\`)) return;
    state.db.playlists = state.db.playlists.filter(p => p.id !== playlistId);
    if (state.db.activePlaylistId === playlistId) state.db.activePlaylistId = ALL_ID;
    DB.save(state.db);
    renderEverything();
  }

  function toggleFavorite(trackId) {
    const track = getTrackById(trackId);
    if (!track) return;
    track.favorite = !track.favorite;
    DB.save(state.db);
    renderEverything();
  }

  function addTrackToPlaylist(trackId, playlistId) {
    const playlist = getPlaylistById(playlistId);
    const track = getTrackById(trackId);
    if (!track || !playlist) return;
    if (playlist.id === ALL_ID) {
      state.db.activePlaylistId = ALL_ID;
    } else if (playlist.id === FAVORITES_ID) {
      track.favorite = true;
      state.db.activePlaylistId = FAVORITES_ID;
    } else if (playlist.id === INFODOSE_ID) {
      state.db.activePlaylistId = INFODOSE_ID;
    } else {
      if (!playlist.trackIds.includes(trackId)) playlist.trackIds.unshift(trackId);
      state.db.activePlaylistId = playlist.id;
    }
    DB.save(state.db);
    renderEverything();
  }

  function quickAddToSelectedPlaylist(trackId) {
    if (!dom.destinationSelect) return;
    addTrackToPlaylist(trackId, dom.destinationSelect.value);
  }

  function removeTrack(trackId) {
    const active = getActivePlaylist();
    const track = getTrackById(trackId);
    if (!track) return;
    if (active.id === FAVORITES_ID) {
      track.favorite = false;
    } else if (active.id === ALL_ID) {
      state.db.library = state.db.library.filter(t => t.id !== trackId);
      state.db.playlists.forEach(p => {
        if (Array.isArray(p.trackIds)) p.trackIds = p.trackIds.filter(id => id !== trackId);
      });
      if (state.currentTrackId === trackId) { state.currentTrackId = null; }
      if (track.type === 'local') KoduxAudioIDB.remove(trackId);
    } else {
      active.trackIds = (active.trackIds || []).filter(id => id !== trackId);
      if (state.currentTrackId === trackId) { state.currentTrackId = null; }
    }
    DB.save(state.db);
    renderEverything();
  }

  function findExistingTrackByUrl(url, type, id) {
    if (type === "youtube" && id) return state.db.library.find(t => t.type === "youtube" && t.id === id) || null;
    if (type === "youtube_playlist" && id) return state.db.library.find(t => t.type === "youtube_playlist" && t.playlistId === id) || null;
    if (type === "soundcloud") {
      const norm = normalizeUrl(url);
      return state.db.library.find(t => t.type === "soundcloud" && normalizeUrl(t.url) === norm) || null;
    }
    return state.db.library.find(t => normalizeUrl(t.url) === normalizeUrl(url)) || null;
  }

  function normalizeAndInsertToLibrary(track) {
    const normalized = normalizeTrack(track);
    const existing = findExistingTrackByUrl(normalized.url, normalized.type, normalized.id || normalized.playlistId);
    if (existing) {
      existing.name       = normalized.name       || existing.name;
      existing.artist     = normalized.artist     || existing.artist;
      existing.cover      = normalized.cover      || existing.cover;
      existing.playlistId = normalized.playlistId || existing.playlistId;
      if (normalized.type === "local" && normalized.blob) existing.blob = normalized.blob;
      return existing;
    }
    state.db.library.unshift(normalized);
    return normalized;
  }

  async function buildTrackFromUrl(url, base = {}) {
    const cleanUrl = normalizeUrl(url);
    if (!cleanUrl) throw new Error("Link vazio.");
    const track = {
      id:         base.id     || uid(),
      type:       base.type   || "local",
      url:        cleanUrl,
      name:       base.name   || "Carregando...",
      artist:     base.artist || "Web",
      cover:      base.cover  || "https://picsum.photos/100",
      blob:       base.blob   || null,
      favorite:   !!base.favorite,
      playlistId: base.playlistId || null,
      cadial:     base.cadial || null
    };
    const ytId     = extractYouTubeId(cleanUrl);
    const ytListId = extractYouTubePlaylistId(cleanUrl);
    const isYT = cleanUrl.includes("youtube.com") || cleanUrl.includes("youtu.be") || cleanUrl.includes("youtube-nocookie.com");
    const isSC = cleanUrl.includes("soundcloud.com") || cleanUrl.includes("on.soundcloud.com");

    if (isYT) {
      if (ytListId && !ytId) {
        track.type       = "youtube_playlist";
        track.playlistId = ytListId;
        track.name       = base.name   || "YouTube Playlist";
        track.artist     = base.artist || "YouTube";
        track.cover      = base.cover  || "https://picsum.photos/100";
        return normalizeTrack(track);
      }
      if (!ytId) throw new Error("Link YouTube inválido.");
      track.type  = "youtube";
      track.id    = ytId;
      track.cover = \`https://img.youtube.com/vi/\${ytId}/hqdefault.jpg\`;
      try {
        const res  = await fetch(\`https://noembed.com/embed?url=\${encodeURIComponent(cleanUrl)}\`);
        const data = await res.json();
        track.name   = data.title       || base.name   || "YouTube Track";
        track.artist = data.author_name || base.artist || "YouTube";
      } catch (e) {
        track.name   = base.name   || "YouTube Track";
        track.artist = base.artist || "YouTube";
      }
    } else if (isSC) {
      track.type = "soundcloud";
      try {
        const res  = await fetch(\`https://soundcloud.com/oembed?url=\${encodeURIComponent(cleanUrl)}&format=json\`);
        const data = await res.json();
        track.name   = data.title         || base.name   || "SoundCloud Track";
        track.artist = data.author_name   || base.artist || "SoundCloud";
        track.cover  = data.thumbnail_url || base.cover  || "https://i1.sndcdn.com/artworks-default-t500x500.jpg";
      } catch (e) {
        track.name   = base.name   || "SoundCloud Track";
        track.artist = base.artist || "SoundCloud";
        track.cover  = base.cover  || "https://i1.sndcdn.com/artworks-default-t500x500.jpg";
      }
    } else {
      track.type   = base.type   || "local";
      track.name   = base.name   || cleanUrl.split("/").pop() || "Arquivo local";
      track.artist = base.artist || "Local";
    }
    return normalizeTrack(track);
  }

  async function hydratePreloadedTracks() {
    const preloadedUrls = new Set(PRELOADED.map(t => normalizeUrl(t.url)));
    let changed = false;
    for (let i = 0; i < state.db.library.length; i++) {
      const tr = state.db.library[i];
      if (!preloadedUrls.has(normalizeUrl(tr.url))) continue;
      try {
        const fresh = await buildTrackFromUrl(tr.url, tr);
        state.db.library[i] = { ...tr, ...fresh, id: tr.id };
        changed = true;
      } catch (e) {}
    }
    if (changed) { DB.save(state.db); renderEverything(); }
  }

  async function quickAddFromClipboard() {
    const drawer = document.getElementById("config-drawer");
    let pasted = "";
    try {
      if (navigator.clipboard && navigator.clipboard.readText) {
        pasted = (await navigator.clipboard.readText() || "").trim();
      }
    } catch (e) {}
    const looksLikeUrl = /^https?:\\/\\//i.test(pasted);
    if (looksLikeUrl && dom.linkInput) {
      dom.linkInput.value = pasted;
      await addLink();
      return;
    }
    if (drawer) drawer.classList.add("open");
    if (dom.linkInput) dom.linkInput.focus();
  }

  function toggleConfigDrawer() {
    const drawer = document.getElementById("config-drawer");
    if (drawer) drawer.classList.toggle("open");
  }

  function setCategory(cat) {
    state.currentCategory = cat;
    ["geral", "infodose", "arquetipos"].forEach(c => {
      const btn = document.getElementById(\`tab-\${c}\`);
      if (btn) btn.classList.toggle("active", c === cat);
    });
    renderEverything();
  }

  async function addLink() {
    const input = dom.linkInput;
    const destination = dom.destinationSelect;
    if (!input || !destination) return;
    const url = normalizeUrl(input.value.trim());
    if (!url) return;
    let newTrack;
    try {
      newTrack = await buildTrackFromUrl(url);
    } catch (e) {
      return alert(e.message || "Não consegui ler esse link.");
    }
    const inserted = normalizeAndInsertToLibrary(newTrack);
    if (destination.value === FAVORITES_ID) {
      inserted.favorite = true;
    } else if (destination.value !== ALL_ID) {
      const playlist = getPlaylistById(destination.value);
      if (playlist && !playlist.trackIds.includes(inserted.id)) playlist.trackIds.unshift(inserted.id);
    }
    input.value = "";
    DB.save(state.db);
    renderEverything();
  }

  async function importLocalFiles(fileList) {
    const files = Array.from(fileList || []);
    if (!files.length) return;
    for (const file of files) {
      if (!file.type.startsWith('audio/') && !/\\.(mp3|wav|ogg|m4a)$/i.test(file.name)) continue;
      const track = normalizeTrack({
        type: 'local',
        name: file.name.replace(/\\.[^.]+$/, ''),
        artist: 'Importado',
        cover: 'https://picsum.photos/100',
        blob: file
      });
      state.db.library.unshift(track);
      await KoduxAudioIDB.put(track.id, file);
    }
    DB.save(state.db);
    renderEverything();
  }

  function openFullFromPreview(e) { if (e) e.stopPropagation(); updateWidgetState("full"); }
  function collapseToBall(e) {
    if (e) e.stopPropagation();
    if (state.widgetState === "full" || state.widgetState === "footer") {
        updateWidgetState("preview");
    } else {
        updateWidgetState("ball");
    }
  }

  function handleClickOutside(e) {
    if (state.widgetState === "preview" && dom.widget && !dom.widget.contains(e.target)) {
      updateWidgetState("ball");
    }
  }

  function toast(msg) {
    const toastContainer = document.getElementById('di_toast') || (() => {
      const d = document.createElement('div');
      d.id = 'di_toast';
      d.className = 'fixed top-28 left-1/2 -translate-x-1/2 z-[300] pointer-events-none flex flex-col items-center gap-2';
      document.body.appendChild(d);
      return d;
    })();
    const el = document.createElement('div');
    el.className = "v-pill bg-black/60 border-white/10 backdrop-blur-xl text-xs shadow-2xl";
    el.textContent = msg;
    toastContainer.appendChild(el);
    setTimeout(() => el.remove(), 3000);
  }

  // ===== INICIALIZAÇÃO =====
  function initKoduxPlayer() {
    initDOM();
    if (!dom.widget) {
      console.warn("KODUX Player: widget não encontrado.");
      return;
    }
    state.db = DB.init(ARCHETYPES, PRELOADED);

    global.openFullFromPreview = openFullFromPreview;
    global.updateWidgetState = updateWidgetState;
    global.togglePlay = togglePlay;
    global.playNext = playNext;
    global.playPrev = playPrev;
    global.addLink = addLink;
    global.quickAddFromClipboard = quickAddFromClipboard;
    global.toggleConfigDrawer = toggleConfigDrawer;
    global.setCategory = setCategory;
    global.collapseToBall = collapseToBall;
    global.toggleFavorite = toggleFavorite;
    global.removeTrack = removeTrack;
    global.quickAddToSelectedPlaylist = quickAddToSelectedPlaylist;
    global.createPlaylist = createPlaylist;
    global.importLocalFiles = importLocalFiles;
    global.openVisualizer = openVisualizer;

    global.onYouTubeIframeAPIReady = function() {
      console.log("YouTube API ready");
    };

    if (typeof YT === 'undefined' || typeof YT.Player === 'undefined') {
      if (!document.querySelector('script[src="https://www.youtube.com/iframe_api"]')) {
        const tag = document.createElement("script");
        tag.src = "https://www.youtube.com/iframe_api";
        document.head.appendChild(tag);
        console.log("YouTube API script carregado");
      }
    } else {
      if (typeof global.onYouTubeIframeAPIReady === 'function') {
        global.onYouTubeIframeAPIReady();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    dom.widget.addEventListener("click", (e) => {
      if (state.isDragging) return;
      if (state.widgetState === "ball") updateWidgetState("preview");
    });

    dom.ball.addEventListener('dblclick', (e) => {
      e.stopPropagation();
      openVisualizer(e);
    });

    if (dom.localAudioInput) {
      dom.localAudioInput.addEventListener('change', (e) => {
        importLocalFiles(e.target.files);
        e.target.value = '';
      });
    }

    initDrag();
    renderEverything();
    updateWidgetState("ball");
    hydratePreloadedTracks();

    DB.hydrateLocalBlobs(state.db).then(() => renderEverything());

    console.log("⚫ KODUX Player + Global-Player integrados (com indicador visual).");
  }

  global.initKoduxPlayer = initKoduxPlayer;

})(window);

document.addEventListener('DOMContentLoaded', () => {
  if (typeof initKoduxPlayer === 'function') {
    initKoduxPlayer();
  }
});
</script>
</body>
</html>`);