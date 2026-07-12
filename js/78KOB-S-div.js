(function(h,s='#inject-here'){const p=new DOMParser(),c=p.parseFromString(h,'text/html'),f=document.createDocumentFragment(),t=document.querySelector(s)||document.body;Array.from(c.body.childNodes).forEach(n=>f.appendChild(document.importNode(n,true)));t.appendChild(f);Array.from(c.querySelectorAll('script')).forEach(x=>{const n=document.createElement('script');for(const a of x.attributes)n.setAttribute(a.name,a.value);n.textContent=x.textContent;document.body.appendChild(n)})})(`
<!DOCTYPE html>
<html lang="pt-BR" data-arch="" data-user="" data-opcode="0x00" data-camada="METΔ0">
<head>
    <meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover">
    <meta name="theme-color" content="#050510">
    <title>DUAL // FUSION SYSTEM</title>
    <!-- Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@200;400;500;600;800&family=JetBrains+Mono:wght@400;700&family=Montserrat:wght@200;400;600;900&display=swap" rel="stylesheet">
    <!-- Scripts -->
    <script src="https://unpkg.com/lucide@latest"></script>
    <!-- Combined CSS Links -->

<link rel="apple-touch-icon" href="./icon-192.png">

    <link href="https://www.infodose.com.br/css/main.css" rel="stylesheet">

 <link rel="stylesheet" href="https://www.infodose.com.br/css/responseAreaBeauty.css">
 <!--   <style>

.response-controls .pagination button:hover{
    background:color-mix(in srgb,var(--kob-voice-primary) 12%,transparent);
}
      /* Fusion Adjustments */
        .fusion-zone { position: relative; z-index: 100; pointer-events: auto; padding: 20px; }
        .modal-overlay { z-index: 9999; }
#cardBody{overflow-y:auto}

/* ===== DESABILITA PULSOS / ANIMAÇÕES ===== */

/*.response-container,
.response-block,
.response-controls,
.control-btn,
.pagination button,
.input-container,
.input-container input,
.input-container button{
    animation:none;
}*/

.footer-text{margin-top:12px;font-size:0.78em;text-align:center;font-style:italic}

.footer-text{
    align-self:center;
}

.footer-text{
    margin-top:12px;
    font-size:0.78em;
    font-style:italic;

    width:100%;
    display:block;
    text-align:center;
    margin-left:auto;
    margin-right:auto;
}

    </style> -->
</head>
<body> 
<style> /* ========== RESPONSE AREA ========== */
body, html{overflow-y:auto !important;}
 /* Orb */
 .orb {      
 background: radial-gradient(circle at 30% 30%, var(--grad-a, #78e7ff), transparent 78%),
                  radial-gradient(circle at 70% 70%, var(--kob-voice-secondary, #00f2ff), var(--orb-secondary, #3b82f6));
      box-shadow: 0 0 18px var(--kob-voice-primary), 0 0 36px rgba(120,227,255,0.4);
      animation: orbSpin var(--orb-speed) linear infinite;
      width: 100%; height: 100%; border-radius: 50%; display: grid; place-items: center;

      width: 56px; height: 56px; 

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
</style>

    <div id="root">
        <!-- Backgrounds -->

  <div id="snap-zone"></div>

 <!-- ── BACKGROUNDS (1x cada) ─────────────────────────────── -->
  <div class="bg-gradient-base" style="opacity:.39"></div>
  <div id="bg-layer-fixed"></div>
  <div class="nebula"></div>
  <div id="bg-fake-custom"></div>
  <div class="sky-layer"><div class="sun-background"></div></div>


  <div class="ambient-light"><div class="blob blob-1"></div><div class="blob blob-2"></div></div>
  <div id="particles-js"><canvas class="particles-js-canvas-el"></canvas></div>

<section style="min-height:100vh">
  <div id="snap-zones"></div>
 <div class="infodose">dual.<strong>Infodose</strong></div>
</section>

 <div class="wrap">
    <div class="content">
      <iframe id="frame" src="about:blank"></iframe>
      <div id="kob-tts-outline"></div>
    </div>
  </div>
 
  <!-- ════════════════════════════════════════════════════════
       HUD · SYMBOL BAR
  ════════════════════════════════════════════════════════ -->
  <div class="symbol-bar floating" id="symbolBar">
    <!-- ORB -->

<div class="blob blob-1"></div><div class="blob blob-2"></div>


    

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
            <div class="symbol-toolbar">
      <div class="orb-container">
        <button id="orbBtn" class="orb" aria-label="Toggle System">
          <div class="orb-core"></div>
        </button>
      </div>
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
  <!-- ════════════════════════════════════════════════════════
       KOBLLUX ROUTE EDITOR  (NAGATANAZARE · QUICK ROUTE — versão principal)
  ════════════════════════════════════════════════════════ -->
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
        <label class="p-lbl" for="kblx-inp">
          Novo valor para <code>data-url</code>
        </label>
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
          <div class="kblx-note">
            Long press em qualquer <code>.symbol-button[data-url]</code> abre este painel.
          </div>
        </section>
      </div>
    </div>
  </div>

    
     <div class="container">
    <div class="fusion-card closed" id="mainCard">

      <div class="card-header" id="cardHeader">
        <div class="avatar-slot" id="avatarTarget" title="Gerenciar Chaves (Cofre)"></div>
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
        <!-- Button visible only in HUD mode -->
        <button class="hud-menu-btn" id="hudMenuBtn" title="Menu Rápido"><i data-lucide="menu"></i></button>
      </div>
      
      <!-- Trigger visible only on Orb Hover -->
      <div class="orb-menu-trigger" id="orbMenuTrigger" title="Menu Rápido">●●●</div>
      <!-- Drag Handle for HUD -->
      <div class="drag-handle"></div>

      <div class="small-preview" id="smallPreview" title="Gerenciar Chaves">
        <div class="mini-avatar" id="smallMiniAvatar"></div>
        <div class="small-text" id="smallText">Aguardando ativação...</div>
        <div class="ident-badge" id="smallIdent">--</div>
      </div>

      <div class="card-body" id="cardBody">
        <!-- Main Input User -->
        <div class="input-wrapper stagger-item">
          <input type="text" class="cyber-input" id="inputUser" placeholder="Identifique-se..." autocomplete="off">
        </div>

        <!-- Section 1: ASCII Activation -->
        <div class="activation-wrap stagger-item">
          <div class="activation-toggle" onclick="toggleSection('activationCard')">
            <div style="display:flex;align-items:center;gap:8px">
              <div style="width:10px;height:10px;border-radius:99px;background:var(--neon-cyan)"></div>
              <strong style="letter-spacing:1px;font-size:0.9rem">Ativação ASCII</strong>
            </div>
            <div style="margin-left:auto;font-size:0.82rem;color:rgba(255,255,255,0.6)">BASE v1</div>
          </div>
          <div id="activationCard" class="activation-card activation-hidden">
            <div style="display:flex;align-items:flex-start;gap:10px">
              <div style="display:flex;align-items:center;gap:8px">
                <div class="mini-avatar" id="actMiniAvatar"></div>
                <div><div style="font-weight:700">CÉREBRO</div><div style="font-size:0.78rem;opacity:0.6"><span id="actName">User</span></div></div>
              </div>
              <div class="activation-badge" id="actBadge" style="margin-left:auto">v:--</div>
            </div>
            <pre id="actPre" class="activation-pre">Carregando...</pre>
            <div class="activation-controls" style="display:flex;gap:8px;margin-top:8px">
              <button class="trigger-btn" id="copyActBtn">COPIAR</button>
              <button class="trigger-btn" id="downloadActBtn">PNG</button>
            </div>
          </div>
        </div>

        <!-- Section 2: System & Neural (Config) - Embedded in Card -->
        <div class="activation-wrap stagger-item">
            <div class="activation-toggle" onclick="toggleSection('systemCard')">
                <div style="display:flex;align-items:center;gap:8px">
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
                   <input type="text" id="modelInput" placeholder="Modelo AI..." style="width:100%;margin-bottom:8px;padding:8px;border-radius:6px;background:rgba(0,0,0,0.3);border:1px solid rgba(255,255,255,0.1);color:#fff">
                   
                  <div class="model-toggle">
  <select id="modelSelect" class="btn btn-sec">
      <option value="" disabled selected>Selecione Modelo</option>
                  <option value="nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free">NemoTron (Free)</option>
                  <option value="poolside/laguna-xs.2:free">laguna (Free)</option>
                  <option value="inclusionai/ring-2.6-1t:free">ring</option>
                  <option value="google/gemma-4-31b-it:free">google gemma</option>
     <option value="custom-model">Custom</option>
  </select>
</div>
                   <div class="section-title" style="margin-top:8px">TREINAMENTO</div>
                   <div style="display:flex;gap:6px">
                       <input type="file" id="trainingUpload" accept=".txt" style="display:none">
                       <button class="trigger-btn" onclick="document.getElementById('trainingUpload').click()" style="padding:8px;flex:1">UPLOAD .TXT</button>
                       <button id="exportTrainingBtn" class="trigger-btn" style="padding:8px;flex:1">BAIXAR</button>
                   </div>
                   <div id="trainingFileName" class="small" style="margin-top:4px;color:#9bd;font-size:0.75rem">Vazio</div>

                   <div class="panel-divider" style="margin:10px 0"></div>

                   <div style="display:flex; flex-direction:column; gap:6px;">
                        <div style="display:flex;align-items:center;gap:6px;font-size:0.85rem">
                            <input type="checkbox" id="assistantActiveCheckbox"> <label>Infodose Ativa</label>
                        </div>
                        <div style="display:flex;align-items:center;gap:6px;font-size:0.85rem">
                            <input type="checkbox" id="trainingActiveCheckbox"> <label>Treinamento Ativo</label>
                        </div>
                        <div style="display:flex;align-items:center;gap:6px;font-size:0.85rem">
                            <input type="checkbox" id="zenModeCheckbox"> <label>Modo Zen</label>
                        </div>
                   </div>

                   <button id="saveSystemBtn" class="trigger-btn" style="margin-top:12px;background:var(--neon-cyan);color:#000;border:none;font-weight:700">SALVAR CONFIGURAÇÃO</button>
                </div>
            </div>
        </div>

        <div class="stagger-item" style="margin-top:4px">
            <div class="stat-lbl" style="margin-bottom:6px">INTERFACE MODE</div>
            <div style="display:flex; gap:8px;">
                <button class="trigger-btn mode-btn active-mode" id="btnModeCard" onclick="setMode('card')" style="flex:1" title="Modo Padrão">CARD</button>
                <button class="trigger-btn mode-btn" id="btnModeOrb" onclick="setMode('orb')" style="flex:1" title="Flutuante">ORB</button>
                <button class="trigger-btn mode-btn" id="btnModeHud" onclick="setMode('hud')" style="flex:1" title="Barra de Topo">HUD</button>
            </div>
        </div>

        
      </div>

    </div>
  </div>

  <div class="toaster-wrap" id="toasterWrap"></div>

  <!-- KEYS MANAGER MODAL -->
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
      <div class="form-section">
        <div class="form-grid">
          <input id="keyNameInput" placeholder="Nome da chave (ex: Principal)">
          <input id="keyTokenInput" type="password" placeholder="Token / ESK (Opcional)">
        </div>
        <div class="form-row">
          <input id="keyWebhookInput" placeholder="Webhook URL (https://...)" style="flex:1">
          <button id="testWebhookBtn" class="small-btn" title="Testar Conexão">PING</button>
        </div>
        <button id="addKeyBtn" class="small-btn" style="width:100%;margin-top:8px;background:rgba(255,255,255,0.1)">ADICIONAR CHAVE</button>
      </div>
      <div style="display:flex;gap:8px;justify-content:space-between;margin-top:15px;border-top:1px solid rgba(255,255,255,0.05);padding-top:12px">
        <div style="font-size:0.7rem;color:rgba(255,255,255,0.4);display:flex;align-items:center;gap:5px">
          <i data-lucide="shield-check" style="width:14px"></i> <span id="vaultStatusText">Cofre Aberto</span>
        </div>
        <div style="display:flex;gap:8px">
          <button id="lockVaultBtn" class="small-btn danger">BLOQUEAR</button>
          <button id="exportKeysBtn" class="small-btn">Export</button>
          <button id="importKeysBtn" class="small-btn">Import</button>
          <input id="importFileInput" type="file" accept="application/json" style="display:none">
        </div>
      </div>
    </div>
  </div>

  <!-- VAULT UNLOCK MODAL -->
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

  <div class="response-container" id="response">
    <div class="page initial active">
      <strong>Clique no ◉ e diga “Oi, Dual”.</strong><br>
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
        <button id="toggleBtnF" class="control-btn toggle-button" title="Check Connection &amp; Training">
          <!-- Toggle Icon (Power/Signal hybrid) -->
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

  <div class="input-container">
    <input id="userInput" type="text" placeholder="Diga: 'oi, Dual'...">
    <button id="sendBtn" title="Enviar">➤</button>
    <button id="voiceBtn" title="Falar">
    <!--  <object data="https://kodux78k.github.io/oiDual-diSyS/Reset_buttom_Dual-Infodose.svg" type="image/svg+xml" width="36" height="36" style="pointer-events: none;"></object> -->
       <div style="scale:0.87" class="orb-core"></div>
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

  
<button class="lock-button" src="./index.html"></button>

  <div class="controls" role="region" aria-label="Controles">
    <input id="uploadHTML" type="file" accept=".html" style="display:none">
    <button id="uploadComponentBtn" class="btn" title="Carregar HTML local">⧉</button>
    <button id="remoteComponentBtn" class="btn" title="Abrir componente remoto"> ☍ </button>
    <button id="toggleDecoderBtn" class="btn" title="Abrir decodificador">✦</button>
  </div>

  <div id="decoderBox" aria-hidden="true">
    <div style="display:flex;gap:8px;align-items:center">
      <input id="codeInput" placeholder="Selo (ex: DUAL)">
      <button id="decodeBtn" class="btn">Abrir</button>
      <button id="closeDecoder" class="btn">✖</button>
    </div>
  </div>

  <div style="display:none" id="pulsos-container" aria-hidden="true">
    <div id="pulsos"></div>
  </div>

  <!-- <p class="footer">Do seu jeito. <strong>Sempre</strong> único. <strong>Sempre</strong> seu.</p>
</div> -->

<!-- lightweight web component modal for remote/local pages -->






</div>

  

  


   </body>
</html>
`);
