(function(bundle,s='main'){
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
<html lang="pt-BR"><head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover, user-scalable=no">
  <meta name="theme-color" content="#000">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <link rel="apple-touch-icon" href="./icon-192.png">
 <link rel="manifest" href="./manifest.json">


  <link rel="stylesheet" href="https://kodux78k.github.io/oiDual--Y-/css/kob-.css" data-k-id="L_4">
  <link rel="stylesheet" href="https://kodux78k.github.io/oiDual--Y-/css/kxt-solar.css" data-k-id="L_5">
  <link rel="stylesheet" href="https://kodux78k.github.io/oiDual--Y-/css/kob-nanaiu.css" data-k-id="L_6">
  <link rel="stylesheet" href="https://kodux78k.github.io/oiDual--Y-/css/kob-dox-nanai-uv4.css" data-k-id="L_7">

  <link rel="stylesheet" href="https://kodux78k.github.io/oiDual--Y-/M0D/di_Pad/css/zpr.css" data-k-id="L_8">

 <link rel="stylesheet" href="https://www.infodose.com.br/css/main.css" data-k-id="L_0">  
<link rel="stylesheet" href="https://kodux78k.github.io/oiDual--Y-/M0D/KBF/main.css" data-k-id="L_1">
 <link rel="stylesheet" href="https://infodose.com.br/oiDual/KODUX/78K/APPS/78iFSw/dual-ifswin/css/main.css" data-k-id="L_2">
  <!-- CSS EXTERNOS -->

  <link rel="stylesheet" href="https://infodose.com.br/oiDual/KODUX/78K/APPS/78FusionOS/css/main.css" data-k-id="L_FUSIONOS">

<style data-k-id="SI_1">

    body, html { overflow-y: auto; }
  </style></head>
<body class="field-closed mode-night ui-safe-vertical" data-theme="dark" data-arch="" data-user="" data-zpr="9" data-intensity="0.72">
<div id="root">
  <div id="kxtsk-shell">
   <!-- TOPBAR -->
    <div class="os-topbar">
      <div class="os-brand">
        <svg class="icon-svg" aria-hidden="true"><use href="#icon-brand"></use></svg>
      </div>
      <div class="top-actions">
        <div class="win-navrow" onclick="event.stopPropagation()">
          <input class="win-urlbar" type="text" id="urlInputNav" placeholder="Digite uma URL..." spellcheck="false" autocomplete="off">
          <button class="win-go-btn" type="button" id="goNavBtn">Go</button>
          <button class="launcher-btn" id="openKobBtn" title="Nova janela">
            <svg class="icon-svg" aria-hidden="true"><use href="#icon-plus"></use></svg>
          </button>
          <button class="soft-btn" id="openLogsBtn">Logs</button>
        </div>
      </div>
    </div>

   <!-- STACK -->
    <div id="stackWrap">
      <!-- SESSÃO INICIAL -->
      <div class="session-window collapsed" id="session-iframe">
        <div class="win-hdr">
          <span class="win-title">
            <svg class="icon-svg" aria-hidden="true"><use href="#icon-globe"></use></svg>
            infodose
          </span>
          <div class="win-navrow" style="flex:1; min-width:0;">
          </div>
          <div class="win-controls">
                         <button type="button" data-action="collapse" title="Colapsar">
                <svg class="icon-svg" aria-hidden="true"><use href="#icon-minimize"></use></svg>
              </button>
              <button type="button" data-action="maximize" title="Maximizar">
                <svg class="icon-svg" aria-hidden="true"><use href="#icon-maximize"></use></svg>
              </button>
 <button type="button" data-action="minimize" title="Minimizar">
              <svg class="icon-svg" aria-hidden="true"><use href="#icon-globe"></use></svg>
            </button>
            <button type="button" data-action="close" title="Fechar">
              <svg class="icon-svg" aria-hidden="true"><use href="#icon-close"></use></svg>
            </button>
          </div>
        </div>
        <iframe class="win-frame" data-runtime="nav" id="frame" src="https://www.infodose.com.br" sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox" allow="fullscreen; accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture" loading="lazy"></iframe>
      </div>
    </div>
    <div class="bg-gradient"></div>
    <div id="bg-layer-fixed"></div>
    <div class="wrap">
      <div class="content">
      </div>
        <div id="kob-tts-outline"></div>
 <div class="ambient-light" aria-hidden="true">
        <div class="blob blob-1"></div>
        <div class="blob blob-2"></div>
      </div>
      <div id="snap-zone"></div>
      <div class="toaster-wrap" id="toasterWrap"></div>
      <div style="z-index:11111010" class="symbol-bar floating" id="symbolBar">
          <div style="display:none" class="fusion-card symbol-wra" id="mainCard">
          <div class="card-header symbol-wrap" id="cardHeader">
            <div class="avatar-slot" id="avatarTarget" title="Gerenciar Chaves (Cofre)"></div>
                           <div style="display:none;align-items:center;gap:8px">
 <div class="text-block">
              <div class="greeting-row">
                <span class="txt-thin" id="lblHello">Oi,</span>
                <span class="txt-heavy" id="lblName">Convidado</span>
              </div>
              <div class="brand-dual">DUAL</div>
            </div>
            <div class="clock-widget">
              <div class="time-display" id="clockTime">00:00</div>
              <span class="status-led">ONLINE</span>
            </div>
            <button class="hud-menu-btn" id="hudMenuBtn" title="Menu Rápido">
              <i data-lucide="menu"></i>
            </button>
          </div>
          <div class="orb-menu-trigger" style="display:none" id="orbMenuTrigger" title="Menu Rápido">●●●</div>
          <div class="drag-handle"></div>
          <div class="small-preview" style="display:none" id="smallPreview" title="Gerenciar Chaves">
            <div class="mini-avatar" id="smallMiniAvatar"></div>
            <div class="small-text" id="smallText">Aguardando ativação...</div>
            <div class="ident-badge" id="smallIdent">--</div>
                  </div>  </div>
          <div class="card-body" style="display:none" id="cardBody">
            <div class="input-wrappe stagger-ite">
              <input type="text" class="cyber-input" id="inputUser" placeholder="Identifique-se..." autocomplete="off">
            </div>
            <div class="activation-wrap stagger-item">
              <div class="activation-toggle" onclick="toggleSection('activationCard')">
                <div style="display:flex;align-items:center;gap:8px">
                  <div style="width:10px;height:10px;border-radius:99px;background:var(--neon-cyan)"></div>
                  <strong style="letter-spacing:1px;font-size:0.9rem">Ativação ASCII</strong>
                </div>
              </div>
              <div id="activationCard" class="activation-card activation-hidden">
                <div style="display:flex;align-items:flex-start;gap:10px">
                  <div style="display:flex;align-items:center;gap:8px">
                    <div class="mini-avatar" id="actMiniAvatar"></div>
                    <div>
                      <div style="font-weight:700">CÉREBRO</div>
                      <div style="font-size:0.78rem;opacity:0.6"><span id="actName">User</span></div>
                    </div>
                  </div>
                  <div class="activation-badge" id="actBadge" style="margin-left:auto; color:var(--neon-cyan); font-size:0.8em">v:--</div>
                </div>
                <pre id="actPre" class="activation-pre">Carregando...</pre>
                <div class="activation-controls" style="display:flex;gap:8px;margin-top:8px">
                  <button class="trigger-btn" id="copyActBtn">COPIAR</button>
                </div>
              </div>
            </div>
            <div class="activation-wrap stagger-itemm activation-hidden">
              <div class="activation-toggle" onclick="toggleSection('systemCard')">
                <div style="display:block;align-items:center;gap:8px">
                  <div style="width:10px;height:10px;border-radius:99px;background:var(--neon-purple)"></div>
                  <strong style="letter-spacing:1px;font-size:0.9rem">SYSTEM &amp; NEURAL</strong>
                </div>
                <div style="margin-left:auto;font-size:0.82rem;color:rgba(255,255,255,0.6)">CONFIG</div>
              </div>
              <div id="systemCard" class="activation-card activation-hidden">
                <div class="col">
                  <div class="section-title">IDENTIDADE DA INFODOSE</div>
                  <input type="text" id="infodoseNameInput" placeholder="Nome: World System..." style="width:100%;margin-bottom:8px;padding:8px;border-radius:6px;background:rgba(0,0,0,0.3);border:1px solid rgba(255,255,255,0.1);color:#fff">
                  <div class="section-title" style="margin-top:8px">CONEXÃO NEURAL (SK)</div>
                  <input type="password" id="apiKeyInput" placeholder="sk-or-..." autocomplete="off" style="width:100%;margin-bottom:6px;padding:8px;border-radius:6px;background:rgba(0,0,0,0.3);border:1px solid rgba(255,255,255,0.1);color:#fff">
                  <div class="model-toggle">
                    <select id="modelSelect" class="btn">
                      <option value="" disabled="" selected="">Selecione Modelo</option>
                      <option value="nvidia/nemotron-3-nano-30b-a3b:free">NemoTron (Free)</option>
                      <option value="allenai/molmo-2-8b:free">MolMo (Free)</option>
                      <option value="mistralai/devstral-2512:free">DevStral</option>
                      <option value="openai/gpt-oss-120b:free">OSS120b</option>
                    </select>
                  </div>
                  <div class="panel-divider" style="margin:10px 0; border-top:1px solid rgba(255,255,255,0.05)"></div>
                  <button id="saveSystemBtn" class="trigger-btn" style="margin-top:12px;background:var(--neon-cyan);color:#000;border:none;font-weight:700">SALVAR CONFIGURAÇÃO</button>
                </div>
              </div>
            </div>
            <div class="stagger-item" style="display:none">
                  <div style="display:none; gap:8px;">         
 <div class="stat-lbl" style="margin-bottom:6px; font-size:0.6rem; color:rgba(255,255,255,0.4)">INTERFACE MODE</div>
                <button class="trigger-btn mode-btn active-mode" id="btnModeCard" onclick="setMode('card')" style="flex:1" title="Modo Padrão">CARD</button>
                <button class="trigger-btn mode-btn" id="btnModeOrb" onclick="setMode('orb')" style="flex:1" title="Flutuante">ORB</button>
                <button class="trigger-btn mode-btn" id="btnModeHud" onclick="setMode('hud')" style="flex:1" title="Barra de Topo">HUD</button>
              </div>
            </div>
          </div>
        </div>
<!-- Botão Menu -->
    <div class="toggle-wrap">
      <button class="symbol-button main-toggle" id="toggleBtn" title="Menu / Iniciar">≡</button>
    </div>
          <div class="symbol-wrap">
            <button class="symbol-button" id="btn-prev" title="Voltar Bloco">◀</button>
          </div>
          <div class="symbol-wrap">
            <button class="symbol-button" id="btn-play" title="Play/Pause">▶</button>
          </div>
          <div class="symbol-wrap">
    <button class="symbol-button" id="tts-stop" title="Parar">■</button>
          </div>
          <button class="symbol-button" id="btn-arch" title="Trocar Arquétipo de Voz">
            <div class="orb-microphone-container">
              <div class="tts-orb-mini">
                <div class="ora" id="main-orb">
                  <div class="orb-core"></div>
                </div>
              </div>
            </div>
          </button>
<div class="symbol-button">
    <button id="orbBtn" class="orb-btn" aria-label="Toggle System">
      <div class="orb-core chip"></div>
    </button>
  </div>

<!-- ========== NOVO BOTÃO: TOGGLE DO VIEWPORT ========== -->
<div class="symbol-wrap">
  <button class="symbol-button" id="toggleViewportBtn" title="Mostrar/Ocultar Viewport">
    ⊞
  </button>
</div>
<!-- =================================================== -->

<style data-k-id="SI_0">
    .symbol-toolbar{
      display:flex;
      align-items:center;
      flex-wrap:wrap;
      gap:10px;
    }
    .orb{
      width:40%;
      height:40%;
      border-radius:50%;
      display:grid;
      place-items:center;
    }
    .orb-core{
      width:100%;
      height:100%;
      border-radius:50%;
      background:
        radial-gradient(circle at 30% 30%, var(--orb-accent), transparent 60%),
        radial-gradient(circle at 70% 70%, var(--orb-primary), var(--orb-secondary));
      box-shadow:
        0 0 18px var(--orb-primary),
        0 0 36px rgba(120,227,255,0.4);
      animation: orbSpin var(--orb-speed) linear infinite;
    }
    @keyframes orbSpin{
      to { transform: rotate(360deg); }
    }
    @keyframes orbPulse{
      from { transform: scale(1); }
      to { transform: scale(1.15); }
    }
    #orb-root.speaking .orb-core{
      animation:
        orbSpin 2s linear infinite,
        orbPulse 0.5s ease-in-out infinite alternate;
    }
  </style>

        <div id="dock"></div> 

 <!--   <div class="void-ambient"></div> -->
  <div style="z-index:0; border-radius:39px;" class="symbol-wrap monolith-wrapper">
    <div style="z-index:0" class="monolith">
      <div class="mono-header">
        <div class="mono-brand">
          <div class="brand-icon">
          </div>
          <div class="brand-title">DUAL <span style="opacity:0.3; margin:0 4px;">//</span> MONOLITH</div>
        </div>
        <div id="sysStatus" class="status-badge">STANDBY</div>
      </div>
      <div class="mono-body">
        <div id="viewVault" class="vault-view">
          <div class="actions-grid">
            <button id="createBtn" class="action-card btn-create">
              <span>NOVO</span>
            </button>
            <div id="dropZone" class="action-card dashed">
              <span style="font-family: var(--font-code)">UPLOAD</span>
            </div>
            <button id="backupBtn" class="action-card">
              <span>BACKUP</span>
            </button>
            <button id="safeBtn" class="action-card">
              <span id="safeLabel">SAFE</span>
            </button>
          </div>
          <div class="top-bar">
            <div class="brand-text"></div>
            <div class="sep"></div>
            <button id="themeToggle" class="theme-btn" title="Toggle Theme">
            </button>
          </div>
          <div class="sidebar right">
            <button class="symbol-button icon-btni nav-btni" data-url="https://www.infodose.com.br/splash.html" title="Void">Φ</button>
 <div class="symbol-wrap">
            <button class="symbol-button" data-id="Home" data-url="https://kodux78k.github.io/oiDual--Y-/M0D/iFS/">Φ</button>
          </div>
          <div class="symbol-wrap">
            <button class="symbol-button" data-id="78Frames" data-url="https://www.infodose.com.br/oiDual/KODUX/78K/APPS/78F.html">꩜</button>
          </div>
          <div class="symbol-wrap">
            <button class="symbol-button" data-id="Feeling" data-url="https://www.infodose.com.br/oiDual/KODUX/78K/APPS/78EM.html">◌</button>
          </div>
          <div class="symbol-wrap">
            <button class="symbol-button" data-id="Nebualayer" data-url="https://www.infodose.com.br/oiDual/KODUX/78K/APPS/78NP.html">◘</button>
          </div>
          </div>
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
          <div id="stackList" class="flex flex-col gap-3" style="padding-bottom: 3rem;"></div>
        </div>
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
      <div id="runtimeLayer" class="runtime-layer">
        <div class="runtime-bar">
          <div class="runtime-indicator">
            <div class="dot"></div>
            <span>a€Dual // ACTIVE</span>
          </div>
          <div class="flex items-center gap-2">
            <button id="exportBtn" class="btn-cancel" style="font-size:10px;">EXPORT TO NAV</button>
            <button id="closeRuntime" class="icon-btn" style="width:24px; height:24px; border:none; background:transparent;">
              <i data-lucide="x" style="width:16px;"></i>
            </button>
          </div>
        </div>
        <div class="runtime-frame-wrap">
        <iframe id="appFrame" style="border:0;width:100%;height:100%;display:block;" sandbox="allow-scripts allow-forms allow-modals allow-same-origin allow-pointer-lock">
          </iframe> 
          <div class="scanline"></div>
        </div>
      </div>
    </div>
  </div>
 <!-- <div id="particles-js"></div> -->
 <div style="pointer-events:none">
  <div id="orb-top" class="orb-bg"></div>
  <div id="orb-bottom" class="orb-bg"></div>
</div>
  <div class="symbol-wrap">
    <div class="v-pill" onclick="showForgeModal()">
      <div id="header-status" class="w-2 h-2 rounded-full shadow-[0_0_10px_currentColor]" style="background-color: var(--arch-color); color: var(--kob-voice-primary);"></div>
      <span id="displayUserHeader" class="uppercase">PILOTO</span>
    </div>
</div>
          <div class="hud-info" id="hudStatus">KOBLLUX · ORB NEXUS</div>
    <div class="flex items-center gap-2">
      <div id="tts-indicator" class="voice-wave hidden">
        <div class="bar" style="animation-delay: -0.2s"></div>
        <div class="bar" style="animation-delay: -0.1s"></div>
        <div class="bar"></div>
        <div class="bar" style="animation-delay: -0.3s"></div>
      </div>
      <div class="v-pill hidden" onclick="Identity.showInfodoseModal()">
        <span id="displayArchetypeBadge" class="uppercase text-[10px] tracking-widest text-white/80">...</span>
      </div>
    </div>
  </div>
  <!-- ===== UNIVERSE VIEWPORT – AGORA VISÍVEL ===== -->
  <div id="universe-viewport">
    <section class="screen-panel pt-32 px-6" id="view-cortex">
      <div class="max-w-3xl mx-auto h-full flex flex-col">
        <div class="flex justify-between items-end mb-8 fade-in">
          <div>
            <h1 class="text-5xl font-thin tracking-tighter text-white">Córtex</h1>
            <p class="text-xs text-white/40 font-bold tracking-widest mt-2 uppercase">Arquivo Mnemônico</p>
          </div>
          <button onclick="Cortex.openNewMemory()" class="v-pill bg-white/10 hover:bg-white/20 border-white/20">
            <i data-lucide="plus" class="w-4 h-4"></i>
            <span>Cristal</span>
          </button>
        </div>
        <div class="v-glass p-1 mb-8 flex items-center gap-3 px-4 fade-in" style="border-radius:18px; animation-delay: 0.1s;">
          <i data-lucide="search" class="w-4 h-4 text-white/40"></i>
          <input id="memory-search" oninput="Cortex.render()" class="bg-transparent w-full h-11 text-sm placeholder-white/20 font-medium" placeholder="Buscar nas matrizes...">
        </div>
        <div id="crystal-container" class="pb-24 fade-in" style="animation-delay:0.2s"></div>
      </div>
    </section>
    <section class="screen-panel flex flex-col items-center justify-center relative" id="view-nexus">
      <div class="text-center z-10 fade-in w-full px-6">
        <div id="hero-orb" class="w-72 h-72 mx-auto rounded-full relative cursor-pointer mb-10 transition-transform duration-500 hover:scale-105" onclick="Orb.sync()">
          <div class="absolute inset-0 rounded-full border border-white/20 animate-[spin_12s_linear_infinite]"></div>
          <div class="absolute inset-4 rounded-full border border-white/10 animate-[spin_18s_linear_infinite_reverse]"></div>
          <div id="orb-sync-ring"></div>
          <div id="orb-arch-visual">
            <img id="orb-arch-img" src="" alt="" draggable="false">
            <video id="orb-arch-video" src="" preload="metadata" draggable="false" playsinline="" webkit-playsinline=""></video>
          </div>
          <div class="absolute inset-0 flex items-center justify-center" id="orb-default-icon">
            <div class="w-36 h-36 bg-white/5 backdrop-blur-3xl rounded-full border border-white/10 shadow-[0_0_80px_var(--active-glow)] flex items-center justify-center">
               <i data-lucide="aperture" class="w-14 h-14 text-white/90"></i>
            </div>
          </div>
          <div id="orb-play-hint"><div class="play-hint-icon"><i data-lucide="play" class="w-5 h-5 text-white fill-white ml-1"></i></div></div>
          <div id="orb-opcode-badge">○ 0x00 · INICIAR · 396Hz</div>
        </div>
        <h1 id="hero-title" class="text-7xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/30">FUSION</h1>
        <p id="archetype-status-text" class="mt-4 text-xs text-white/40 uppercase tracking-[0.2em] font-bold">Inicializando...</p>
        <div class="mt-16 flex gap-4 justify-center">
          <button onclick="Navigation.to(0)" class="v-pill hover:bg-white/10 border-white/10"><i data-lucide="brain-circuit" class="w-4 h-4 text-white/70"></i> Córtex</button>
          <button onclick="Navigation.to(2)" class="v-pill hover:bg-white/10 border-white/10"><i data-lucide="play-circle" class="w-4 h-4 text-white/70"></i> DualTube</button>
          <button onclick="Navigation.to(3)" class="v-pill hover:bg-white/10 border-white/10"><i data-lucide="github" class="w-4 h-4 text-white/70"></i> Repositório</button>
        </div>
        <div class="mt-6">
           <p id="drk-line" class="text-[10px] text-white/20 italic font-serif">"O silêncio é a resposta."</p>
        </div>
      </div>
    </section>
    <section class="screen-panel pt-28 px-4" id="view-dualtube">
      <div class="max-w-5xl mx-auto pb-24">
        <div class="flex justify-between items-end mb-6 fade-in">
          <div>
            <h2 class="text-4xl font-thin tracking-tighter">Stream</h2>
            <p class="text-xs text-white/40 uppercase tracking-widest mt-1 font-bold">0x00 · Curadoria de Sinais</p>
          </div>
          <div class="text-right">
            <div class="text-3xl font-bold tracking-tighter" id="dt-watched-count">0</div>
            <div class="text-[9px] text-white/30 uppercase tracking-widest">Sincronizados</div>
          </div>
        </div>
        <div class="overflow-x-auto mb-6 fade-in" style="scrollbar-width:none">
          <div class="flex gap-2 pb-1" style="width:max-content">
            <button id="dttab-0" onclick="DualTube.setTab(0)" class="v-pill dt-tab dt-tab-on text-[10px] whitespace-nowrap"><i data-lucide="newspaper" class="w-3 h-3"></i> 0x01 · INFODOSE</button>
            <button id="dttab-1" onclick="DualTube.setTab(1)" class="v-pill dt-tab text-[10px] whitespace-nowrap"><i data-lucide="hexagon" class="w-3 h-3"></i> 0x02 · MATRIZ NEURAL</button>
            <button id="dttab-2" onclick="DualTube.setTab(2)" class="v-pill dt-tab text-[10px] whitespace-nowrap"><i data-lucide="music" class="w-3 h-3"></i> 0x03 · FREQUÊNCIAS</button>
            <button id="dttab-3" onclick="DualTube.setTab(3)" class="v-pill dt-tab text-[10px] whitespace-nowrap"><i data-lucide="brain" class="w-3 h-3"></i> 0x04 · COGNITIVA</button>
            <button id="dttab-4" onclick="DualTube.setTab(4)" class="v-pill dt-tab text-[10px] whitespace-nowrap"><i data-lucide="moon" class="w-3 h-3"></i> 0x05 · MEDITAÇÕES</button>
            <button id="dttab-5" onclick="DualTube.setTab(5)" class="v-pill dt-tab text-[10px] whitespace-nowrap"><i data-lucide="github" class="w-3 h-3"></i> 0x06 · VÍDEOS GIT</button>
            <button id="dttab-6" onclick="DualTube.setTab(6)" class="v-pill dt-tab text-[10px] whitespace-nowrap"><i data-lucide="headphones" class="w-3 h-3"></i> 0x07 · PODCASTS</button>
          </div>
        </div>
        <div id="dtpanel-0" class="fade-in">
          <div class="v-glass p-4 mb-6 flex items-center gap-3 border-[var(--active-color)]/20">
            <span class="text-2xl">⚡</span>
            <div>
              <p class="text-[11px] sm:text-sm font-bold tracking-widest uppercase text-[var(--active-color)]">JØRNΛL INTERDIMΞN§IØNΛL INFØDØ§Ξ — ΛTIVΛÇÃO DΞ CØN§CIÊNCIΛ ⚡</p>
              <p class="text-[9px] sm:text-[10px] text-white/40 mt-0.5">Sinais que atravessam todos os véus · Frequência 672Hz</p>
            </div>
          </div>
          <div id="dt-infodose-grid" class="flex gap-4 overflow-x-auto pb-4 snap-x"></div>
        </div>
        <div id="dtpanel-1" class="fade-in" style="display:none">
          <div class="v-glass p-4 mb-6 flex items-center gap-3 border-[var(--active-color)]/20">
            <span class="text-2xl">△</span>
            <div>
              <p class="text-sm font-bold tracking-widest uppercase text-[var(--active-color)]">Matriz Neural · 17 Arquétipos</p>
              <p class="text-[10px] text-white/40 mt-0.5">Selecione · Alterne abas · Copie prompts</p>
            </div>
          </div>
          <div id="dt-matriz-grid" class="grid gap-4" style="grid-template-columns: repeat(auto-fill, minmax(300px,1fr))"></div>
        </div>
        <div id="dtpanel-2" class="fade-in" style="display:none"><div id="dt-freq-grid" class="flex gap-4 overflow-x-auto pb-4 snap-x"></div></div>
        <div id="dtpanel-3" class="fade-in" style="display:none"><div id="dt-cogn-grid" class="flex gap-4 overflow-x-auto pb-4 snap-x"></div></div>
        <div id="dtpanel-4" class="fade-in" style="display:none"><div id="dt-medi-grid" class="flex gap-4 overflow-x-auto pb-4 snap-x"></div></div>
        <div id="dtpanel-5" class="fade-in" style="display:none">
          <div id="dt-ghv-container">
            <div class="v-glass p-4 mb-4 flex gap-3 items-center">
              <input id="dt-gh-url" placeholder="URL JSON do GitHub..." class="flex-1 bg-black/30 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-white/20 outline-none focus:border-[var(--active-color)]/50 font-mono">
              <button onclick="DualTube.loadGH()" class="v-pill text-xs bg-[var(--active-color)]/10 border-[var(--active-color)]/30 text-[var(--active-color)]">Carregar</button>
            </div>
            <div id="dt-ghv-grid" class="space-y-6"></div>
          </div>
        </div>
        <div id="dtpanel-6" class="fade-in" style="display:none">
          <div class="v-glass p-4 mb-4 flex gap-3 items-center">
            <input id="dt-pod-url" placeholder="URL JSON de podcasts..." class="flex-1 bg-black/30 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-white/20 outline-none focus:border-[var(--active-color)]/50 font-mono">
            <button onclick="DualTube.loadPod()" class="v-pill text-xs bg-[var(--active-color)]/10 border-[var(--active-color)]/30 text-[var(--active-color)]">Carregar</button>
          </div>
          <div id="dt-pod-grid" class="flex flex-col gap-3"></div>
        </div>
      </div>
    </section>
    <section class="screen-panel pt-32 px-6" id="view-github">
      <div class="max-w-4xl mx-auto pb-24">
        <div class="flex justify-between items-end mb-8 fade-in">
          <div>
            <h2 class="text-5xl font-thin tracking-tighter">Repositório</h2>
            <p class="text-xs text-white/40 uppercase tracking-widest mt-2 font-bold">⧉ 0x05 · CONVERGIR · GitHub Feed</p>
          </div>
          <div class="text-right">
            <div class="text-3xl font-bold tracking-tighter" id="gh-video-count">0</div>
            <div class="text-[9px] text-white/30 uppercase tracking-widest">Sinais</div>
          </div>
        </div>
        <div class="v-glass p-4 mb-6 fade-in" style="animation-delay:0.1s">
          <p class="text-[10px] text-white/30 uppercase tracking-widest mb-3 font-bold">⧉ Fonte GitHub · URL JSON</p>
          <div class="flex gap-3">
            <input id="gh-repo-url" value="https://raw.githubusercontent.com/KOBLLUX/KOBLLUX./main/videos.json" class="flex-1 bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 outline-none focus:border-[var(--active-color)]/50 transition font-mono" placeholder="https://raw.githubusercontent.com/user/repo/main/feed.json">
            <button onclick="GitHub.load()" class="v-pill bg-[var(--active-color)]/10 border-[var(--active-color)]/30 text-[var(--active-color)] hover:bg-[var(--active-color)]/20">Carregar</button>
          </div>
        </div>
        <div id="gh-status" class="text-[9px] text-white/25 font-mono mb-4 fade-in pl-1" style="animation-delay:0.12s"></div>
        <div class="flex gap-2 mb-6">
          <button id="gh-tab-videos" class="v-pill gh-tab-on text-xs" onclick="GitHub.setTab('videos')"><i data-lucide="play-circle" class="w-3 h-3"></i> Vídeos</button>
          <button id="gh-tab-podcasts" class="v-pill text-xs" style="display:none" onclick="GitHub.setTab('podcasts')"><i data-lucide="headphones" class="w-3 h-3"></i> Podcasts</button>
        </div>
        <div id="gh-panel-videos" class="space-y-12 fade-in" style="animation-delay:0.2s"></div>
        <div id="gh-panel-podcasts" class="space-y-4 fade-in" style="display:none;animation-delay:0.2s"></div>
        <div id="gh-empty" class="mt-12 p-8 v-glass border-dashed border-white/10 flex flex-col items-center justify-center text-center opacity-50">
          <i data-lucide="github" class="w-8 h-8 mb-3 text-white/30"></i>
          <p class="text-sm text-white/40 mb-1">Nenhum repositório carregado</p>
        </div>
      </div>
    </section>
  </div>
  <!-- ========================================= -->
  <div id="nav-indicator">
    <div class="dot" id="dot-0" onclick="Navigation.to(0)"></div>
    <div class="dot active" id="dot-1" onclick="Navigation.to(1)"></div>
    <div class="dot" id="dot-2" onclick="Navigation.to(2)"></div>
    <!-- <div class="dot" id="dot-3" onclick="Navigation.to(3)"></div> -->
  </div>
  <div id="global-player" class="v-glass overflow-hidden">
    <div class="absolute top-3 right-3 z-20 flex gap-2">
      <button onclick="Player.minimize()" data-action="minimize" class="w-8 h-8 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center hover:bg-white/20 transition border border-white/5"><i data-lucide="minus" class="w-3 h-3 text-white"></i></button>
      <button onclick="Player.expand()" id="player-expand-btn" class="w-8 h-8 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center hover:bg-[var(--active-color)]/40 transition border border-white/5"><i data-lucide="maximize-2" class="w-3 h-3 text-white"></i></button>
      <button onclick="Player.stop()" class="w-8 h-8 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center hover:bg-red-500/30 transition border border-white/5"><i data-lucide="x" class="w-3 h-3 text-white"></i></button>
    </div>
    <div id="player-frame-wrap" class="w-full h-full bg-black"></div>
  </div>
  <div id="modal-overlay" class="fixed inset-0 z-[200] hidden flex items-center justify-center p-4">
    <div id="modal-content" class="v-glass p-6 w-full max-w-2xl max-h-[85vh] overflow-y-auto transform scale-95 opacity-0 cortex-scroll"></div>
  </div>
  <div id="di_toast" class="fixed top-28 left-1/2 -translate-x-1/2 z-[300] pointer-events-none flex flex-col items-center gap-2"></div>
<script src="https://infodose.com.br/oiDual/KODUX/78K/APPS/78FusionOS/js/modules/78FusionOS.js" data-k-id="JS_0"></script>
</div>
      </div>
      <div id="keysModal" class="modal-overlay" aria-hidden="true">
        <div class="keys-card" role="dialog">
          <div class="keys-header">
            <div>
              <div id="keysTitle" style="font-weight:800;font-size:1.1rem;color:var(--neon-cyan)">USER KEYS MANAGER</div>
              <div style="color:rgba(255,255,255,0.6);font-size:0.85rem">Gerencie suas chaves API com segurança local (Cofre).</div>
            </div>
            <button id="closeKeysBtn" class="small-btn">X</button>
          </div>
          <div class="key-list" id="keyList"></div>
          <div class="form-section" style="margin-top:15px;padding-top:15px;border-top:1px solid rgba(255,255,255,0.05)">
            <div class="form-grid">
              <input id="keyNameInput" placeholder="Nome da chave (ex: Principal)">
              <input id="keyTokenInput" type="password" placeholder="Token / ESK (Opcional)">
            </div>
            <button id="addKeyBtn" class="small-btn" style="width:100%;margin-top:8px;background:rgba(255,255,255,0.1)">ADICIONAR CHAVE</button>
          </div>
          <div style="display:flex;gap:8px;justify-content:space-between;margin-top:15px;border-top:1px solid rgba(255,255,255,0.05);padding-top:12px">
            <div style="font-size:0.7rem;color:rgba(255,255,255,0.4);display:flex;align-items:center;gap:5px">
              <i data-lucide="shield-check" style="width:14px"></i>
              <span id="vaultStatusText">Cofre Aberto</span>
            </div>
            <div style="display:flex;gap:8px">
              <button id="lockVaultBtn" class="small-btn danger">BLOQUEAR</button>
            </div>
          </div>
        </div>
      </div>
      <div id="vaultModal" class="modal-overlay" aria-hidden="true">
        <div class="keys-card">
          <div class="vault-icon"><i data-lucide="lock" style="width:24px;height:24px"></i></div>
          <h3 style="margin:0 0 10px 0;font-weight:800">ACESSO AO COFRE</h3>
          <p style="margin:0 0 15px 0;font-size:0.9rem;color:rgba(255,255,255,0.6)">Seus dados estão criptografados. Digite a senha para desbloquear.</p>
          <input type="password" id="vaultPassInput" class="cyber-input" style="text-align:center;margin-bottom:12px" placeholder="Senha...">
          <div style="display:flex;gap:8px;justify-content:center">
            <button id="vaultCancelBtn" class="small-btn">Cancelar</button>
            <button id="vaultUnlockBtn" class="small-btn active-btn">DESBLOQUEAR</button>
          </div>
        </div>
      </div>
    </div>
  <script type="module" src="https://www.infodose.com.br/js/mainoff-.js" data-k-id="JS_1"></script>

  <script src="https://kodux78k.github.io/oiDual--Y-/M0D/kob-DH0/js/kob-outline-uni.js" data-k-id="JS_5"></script>
  <script src="https://kodux78k.github.io/oiDual--Y-/M0D/kard/js/modules/inline-000.js" data-k-id="JS_6"></script>
  <script src="https://kodux78k.github.io/oiDual--Y-/M0D/kard/js/modules/o0.js" data-k-id="JS_7"></script>
  <script src="https://kodux78k.github.io/oiDual--Y-/js/koblluxv30.js" data-k-id="JS_8"></script>
  <script src="https://kodux78k.github.io/oiDual--Y-/js/kodbrain-u66.js" data-k-id="JS_9"></script>
<script src="https://kodux78k.github.io/oiDual--Y-/js/kobllux-fusion.js" data-k-id="JS_10"></script>     

<svg style="display:none">
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
    <symbol id="icon-settings" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="3"></circle>
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
    </symbol>
    <symbol id="icon-send" viewBox="0 0 24 24">
      <line x1="22" y1="2" x2="11" y2="13"></line>
      <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
    </symbol>
    <symbol id="icon-voice" viewBox="0 0 24 24">
      <rect x="9" y="1" width="6" height="12" rx="3"></rect>
      <path d="M5 10a7 7 0 0 0 14 0"></path>
      <line x1="12" y1="19" x2="12" y2="23"></line>
      <line x1="8" y1="23" x2="16" y2="23"></line>
    </symbol>
    <symbol id="icon-upload" viewBox="0 0 24 24">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
      <polyline points="7 10 12 3 7 8"></polyline>
      <line x1="12" y1="3" x2="12" y2="15"></line>
    </symbol>
  </svg>
  <div class="sky-layer"><div class="sun-background"></div></div>
  <div id="bg-fake-custom"></div>
  <div id="nv-toast"></div>
  <div id="modeIndicator">CARREGANDO nO.Sºlar...</div>
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
          <div id="bgThumbPanel" style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-top:15px;"></div>
        </div>
      </div>
    </div>
  </div>
<!--
<div id="kblx-quick">
  <button class="kq-item" data-kq="edit">✦ Editar</button>
  <button class="kq-item" data-kq="symbol">◉ SymbolBar</button>
  <button class="kq-item" data-kq="frame">⟁ Session</button>
  <button class="kq-item" data-kq="dock">⌘ Dock</button>
  <button class="kq-item" data-kq="duplicate">📋 Duplicar</button>
  <button class="kq-item" data-kq="favorite">⭐ Favoritar</button>
  <button class="kq-item" data-kq="full">⋯ Mais</button>
</div>
-->
<div id="kblx-back">
  <div id="kblx-panel">
    <!-- HEADER -->
    <header class="kblx-head">
      <div class="p-chip">
        ⌘ KOBLLUX HUD · EDITOR DE ROTA
      </div>
      <button class="kblx-icon-btn" id="kblx-btn-close">
        ✕
      </button>
    </header>
    <!-- TITLE -->
    <div class="kblx-title-wrap">
      <h2 class="p-title" id="kblx-ttl">
        Botão
      </h2>
      <p class="kblx-sub">
        Editar destino do SymbolButton
      </p>
    </div>
    <!-- INPUT -->
    <section class="kblx-section">
      <label class="p-lbl" for="kblx-inp">
        Novo valor para <code>data-url</code>
      </label>
      <input id="kblx-inp" type="text" placeholder="arquivo.html ou https://..." spellcheck="false" autocomplete="off">
      <!-- preview -->
      <div class="kblx-preview" id="kblx-preview">
        Nenhuma rota definida
      </div>
    </section>
    <!-- PRESETS -->
    <section class="kblx-section">
      <div class="kblx-sec-head">
        <span>Presets</span>
      </div>
      <div class="kblx-presets">
        <button class="kblx-preset" data-url="index.html">
          Home
        </button>
        <button class="kblx-preset" data-url="hub.html">
          Hub
        </button>
        <button class="kblx-preset" data-url="render-response.html">
          Render
        </button>
        <button class="kblx-preset" data-url="https://google.com">
          URL
        </button>
      </div>
    </section>
    <!-- ACTIONS -->
<!-- troque o bloco .kblx-row por este -->
<div class="kblx-row">
  <button class="kblx-btn kblx-save" id="kblx-btn-save" type="button">⊙ Salvar no botão</button>
  <button class="kblx-btn kblx-inject" id="kblx-btn-orb-inject" type="button">◉ OrbInject</button>
  <button class="kblx-btn kblx-dup" id="kblx-btn-dup" type="button">⧉ Duplicar Orb</button>
  <button class="kblx-btn kblx-del" id="kblx-btn-del" type="button">⌫ Remover Orb</button>
  <button class="kblx-btn kblx-clear" id="kblx-btn-clear" type="button">⌫ Limpar</button>
</div>
  </div>
</div>
  <script type="module" src="https://www.infodose.com.br/js/kob.js" data-k-id="JS_12"></script>
 <!-- Seus Scripts Originais -->
  <script src="https://kodux78k.github.io/oi-Dual/js/modules/inline-000.js" data-k-id="JS_13"></script>
  <script src="https://kodux78k.github.io/oiDual--Y-/js/inline-1.js" data-k-id="JS_14"></script>
  <script src="https://kodux78k.github.io/oiDual-KxT-di_oi/js/modules/bgPanel.js" data-k-id="JS_15"></script>
  <script src="https://kodux78k.github.io/oiDual-KxT-di_oi/js/modules/inline-2.js" data-k-id="JS_16"></script>
  <script src="https://kodux78k.github.io/oiDual-KxT-di_oi/js/modules/inline-3.js" data-k-id="JS_17"></script>
  <script src="https://kodux78k.github.io/oiDual-KxT-di_oi/js/modules/inline-4.js" data-k-id="JS_18"></script> 
  <script src="https://kodux78k.github.io/oiDual--Y-/js/di_core.js" data-k-id="JS_19"></script>
  <script src="https://kodux78k.github.io/oiDual--Y-/js/di_mood.js" data-k-id="JS_20"></script>
<!-- <script src="https://kodux78k.github.io/oiDual--Y-/js/0RB-0S17.js"></script>
-->
<script src="https://kodux78k.github.io/oiDual--Y-/js/di-icon-btn.js" data-k-id="JS_21"></script>
<script data-k-id="JSI_22">
    function updateInterface(name){
      const safe = name || di_userName || 'Convidado';
      els.lblName.innerText = safe;
      els.input.value = safe;
      const activeKey = STATE.keys.find(k => k.active);
      els.smallIdent.innerText = activeKey ? activeKey.name : '--';
      els.actBadge.innerText = activeKey ? \`key:\${activeKey.name}\` : 'v:--';
      const orbBig  = makeOrbAvatar(safe, 64);
      const orbMid  = makeOrbAvatar(safe, 36);
      const orbMini = makeOrbAvatar(safe, 24);
      els.avatarTgt.innerHTML = orbBig;
      els.smallMiniAvatar.innerHTML = orbMini;
      els.actMiniAvatar.innerHTML = orbMid;
      els.actName.innerText = safe;
    }
  </script>
<script type="module" src="https://kodux78k.github.io/oiDual--Y-/M0D/0RB/js/modules/inline-1.js" data-k-id="JS_23"></script> 
    <!-- Scripts Integration -->
    <script src="https://www.infodose.com.br/js/modules/oiDual-S-0e1u.js" data-k-id="JS_24"></script>
<script type="module" src="https://www.infodose.com.br/js/modules/kob-Fetchh.js" data-k-id="JS_25"></script>
<!-- ORB Modules -->
<script type="module" src="https://kodux78k.github.io/oiDual--Y-/M0D/0RB/js/modules/inline-2.js" data-k-id="JS_27"></script>
<!-- Solar / di_core -->
    <script type="module" src="https://www.infodose.com.br/js/modules/synk.js" data-k-id="JS_28"></script>
    <script src="https://www.infodose.com.br/js/modules/myFrameh.js" data-k-id="JS_29"></script>
 <!-- <script src="https://kodux78k.github.io/oiDual--Y-/M0D/LS/js/insert-LS-3.js"></script> -->
  <!-- =========================================================
       BIBLIOTECA DE ÍCONES SVG INLINE
       ========================================================= -->
  <svg width="0" height="0" style="position:absolute;overflow:hidden" aria-hidden="true">
    <defs>
      <!-- Ícone da marca (substitui ⏣) -->
      <symbol id="icon-brand" viewBox="0 0 24 24">
        <path d="M12 2L2 7v10l10 5 10-5V7L12 2zm0 2.3L19.5 8 12 11.7 4.5 8 12 4.3zM4 9.7l7 3.5v7.1L4 16.8V9.7zm9 10.6v-7.1l7-3.5v7.1l-7 3.5z"></path>
      </symbol>
      <!-- Ícone de globo/navegador (substitui 🌐) -->
      <symbol id="icon-globe" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2"></circle>
        <path d="M2 12h20M12 2a15 15 0 010 20M12 2a15 15 0 000 20" fill="none" stroke="currentColor" stroke-width="2"></path>
      </symbol>
      <!-- Ícone de colapsar (substitui —) -->
      <symbol id="icon-minimize" viewBox="0 0 24 24">
        <rect x="4" y="11" width="16" height="2" rx="1"></rect>
      </symbol>
      <!-- Ícone de maximizar (substitui ⬜) -->
      <symbol id="icon-maximize" viewBox="0 0 24 24">
        <rect x="4" y="4" width="16" height="16" rx="2" fill="none" stroke="currentColor" stroke-width="2"></rect>
      </symbol>
      <!-- Ícone de restaurar/abaixar (substitui 🌐 no botão) -->
      <symbol id="icon-restore" viewBox="0 0 24 24">
        <rect x="4" y="4" width="16" height="16" rx="2" fill="none" stroke="currentColor" stroke-width="2"></rect>
        <path d="M8 4v4H4M16 4v4h4M8 20v-4H4M16 20v-4h4" fill="none" stroke="currentColor" stroke-width="2"></path>
      </symbol>
      <!-- Ícone de fechar (substitui ✕) -->
      <symbol id="icon-close" viewBox="0 0 24 24">
        <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"></path>
      </symbol>
      <!-- Ícone de adicionar/mais (substitui +) -->
      <symbol id="icon-plus" viewBox="0 0 24 24">
        <path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round"></path>
      </symbol>
    </defs>
  </svg>
  <div id="toast" class="toast-hidden">
    <span id="toastMsg">System Ready</span>
  </div>
<style id="symbol-button-drag-override">
/* ═══════════════════════════════════════════
   SYMBOL BUTTON · DRAG OVERRIDE
   ═══════════════════════════════════════════ */

.symbol-button {
  /* Permite interação por ponteiro/toque */
  cursor: grab;
  touch-action: none;

  /* Evita seleção de texto durante o arraste */
  user-select: none;
  -webkit-user-select: none;

  /* Habilita drag nativo WebKit quando aplicável */
  -webkit-user-drag: element;
  -webkit-touch-callout: none;

  /* Evita que o navegador interprete o gesto como seleção */
  -webkit-tap-highlight-color: transparent;
}

.symbol-button:active {
  cursor: grabbing;
  -webkit-user-drag: element;
}

/* Se o botão tiver SVG/glifo dentro */
.symbol-button *,
.symbol-button svg,
.symbol-button span {
  user-select: none;
  -webkit-user-select: none;
  -webkit-user-drag: none;

}
</style>
  <script src="https://infodose.com.br/oiDual/KODUX/78K/APPS/78iFSw/dual-ifswin/js/modules/resize-handles.js" data-k-id="JS_30"></script>
  <div class="theme-switch" id="themeSwitch" title="Alternar tema"></div>

  <!-- ====================== NOVO SCRIPT: DOCK + PLAYER + VIEWPORT TOGGLE ====================== -->
  <script>
    (function() {
      'use strict';

      // ---- DOCK MANAGER ----
      const Dock = {
        items: [],
        addItem(id, icon, onClick) {
          const dock = document.getElementById('dock');
          if (!dock) return;
          this.removeItem(id); // evita duplicados
          const btn = document.createElement('button');
          btn.className = 'dock-item symbol-button';
          btn.dataset.dockId = id;
          btn.innerHTML = icon;
          btn.addEventListener('click', onClick);
          dock.appendChild(btn);
          this.items.push(id);
        },
        removeItem(id) {
          const dock = document.getElementById('dock');
          if (!dock) return;
          const existing = dock.querySelector(\`[data-dock-id="\${id}"]\`);
          if (existing) existing.remove();
          this.items = this.items.filter(i => i !== id);
        }
      };

      // ---- PLAYER (sobrescreve para integrar com dock) ----
      window.Player = {
        minimize() {
          const player = document.getElementById('global-player');
          if (!player) return;
          if (player.style.display === 'none') return; // já minimizado
          player.style.display = 'none';
          Dock.addItem(
            'player',
            '▶', // ícone simples, pode ser substituído por SVG
            () => {
              player.style.display = '';
              Dock.removeItem('player');
            }
          );
        },
        expand() {
          const player = document.getElementById('global-player');
          if (player) {
            player.style.display = '';
            Dock.removeItem('player');
          }
        },
        stop() {
          const player = document.getElementById('global-player');
          if (player) {
            player.style.display = 'none';
            Dock.removeItem('player');
            // Adicione lógica para parar mídia se necessário
          }
        }
      };

      // ---- TOGGLE DO VIEWPORT ----
      const ViewportToggle = {
        isVisible: true,
        toggle() {
          const viewport = document.getElementById('universe-viewport');
          if (!viewport) return;
          this.isVisible = !this.isVisible;
          viewport.style.display = this.isVisible ? '' : 'none';
          const btn = document.getElementById('toggleViewportBtn');
          if (btn) btn.textContent = this.isVisible ? '⊞' : '⊟';
        }
      };

      // ---- INICIALIZAÇÃO ----
      document.addEventListener('DOMContentLoaded', function() {
        const toggleBtn = document.getElementById('toggleViewportBtn');
        if (toggleBtn) {
          toggleBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            ViewportToggle.toggle();
          });
        }

        // Se o Player.minimize já estiver definido em outro lugar, podemos manter a referência,
        // mas aqui estamos sobrescrevendo globalmente para garantir.
        // Caso queira preservar a implementação original, ajuste conforme necessário.
        // Aqui forçamos a nossa versão.
        if (typeof window.PlayerMinimizeOriginal === 'undefined') {
          // Se já existir um Player global, guardamos o original para não quebrar
          if (window.Player && window.Player.minimize) {
            window._PlayerMinimizeOriginal = window.Player.minimize;
          }
          // Sobrescrevemos
          window.Player = window.Player || {};
          window.Player.minimize = Player.minimize;
          window.Player.expand = Player.expand;
          window.Player.stop = Player.stop;
        }

        // Expor Dock e ViewportToggle globalmente
        window.Dock = Dock;
        window.ViewportToggle = ViewportToggle;
      });

    })();
  </script>
  <!-- ====================================================================================== -->

</body></html>`);