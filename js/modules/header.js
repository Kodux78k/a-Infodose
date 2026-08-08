(function(bundle, s = 'header') {
  const p = new DOMParser();
  const c = p.parseFromString(
    bundle,
    'text/html'
  );
  const t =
    document.querySelector(s) ||
    document.body;
  // CSS
  Array.from(
      c.querySelectorAll('style')
    )
    .forEach(style => {
      const n =
        document.createElement('style');
      n.textContent =
        style.textContent;
      document.head.appendChild(n);
    });
  // HTML
  const f =
    document.createDocumentFragment();
  Array.from(
      c.body.childNodes
    )
    .forEach(node => {
      if (node.nodeName !== 'SCRIPT') {
        f.appendChild(
          document.importNode(node, true)
        );
      }
    });
  t.appendChild(f);
  // JS
  Array.from(
      c.querySelectorAll('script')
    )
    .forEach(x => {
      const n =
        document.createElement('script');
      for (
        const a of x.attributes
      )
        n.setAttribute(
          a.name,
          a.value
        );
      n.textContent =
        x.textContent;
      document.body.appendChild(n);
    });
})(`<style>
@import url("https://www.infodose.com.br/oiDual/KODUX/78K/APPS/78HERO/css/main-v4.css");
@import url("https://www.infodose.com.br/oiDual/KODUX/78K/APPS/78HERO/css/main-v0.css");
@import url("https://www.infodose.com.br/oiDual/KODUX/78K/APPS/78HERO/css/main-v6.css");
.app-frame{ inset:1 ; height:100vh; width:100vw;}
</style>
    
<!-- <link rel="stylesheet" href="https://www.infodose.com.br/oiDual/KODUX/78K/APPS/78HERO/css/main.css"> -->

    <script type="module" src="https://www.infodose.com.br/js/modules/Dual_[Theme].js"></script> 

     <div class="dual-app">
<!-- ═══════════════════════════════════════════════════════
     HEADER GLOBAL
     1. TOCAR NO HEADER
        → COLAPSA MAIN
     2. TOCAR NA BOLINHA
        → MUDA TEMA
     3. ROLAR PARA BAIXO
        → HEADER SOBE
     4. ROLAR PARA CIMA
        → HEADER VOLTA
═══════════════════════════════════════════════════════ -->
<header>
   <div class="topbar header-visible" id="main-headerr">


    <!-- ÁREA DO SISTEMA -->
  <!-- Topo KODUX iCloud -->
    <div class="kodux-nav">
      <div class="kodux-brand" id="main-header">
        <svg viewBox="0 0 24 24"><path d="M17.5,19c-3.6,0-6.5-2.9-6.5-6.5s2.9-6.5,6.5-6.5s6.5,2.9,6.5,6.5S21.1,19,17.5,19z M17.5,8c-2.5,0-4.5,2-4.5,4.5 s2,4.5,4.5,4.5s4.5-2,4.5-4.5S20,8,17.5,8z"></path></svg>
      </div>
      <div class="kodux-avatar" onclick="launchApp('profile')" title="Perfil KODUX"></div>
    </div>  
    <!-- ÚNICO CONTROLE DE TEMA -->

  <button id="theme-dot" class="theme-dot" type="button" aria-label="Alternar tema" title="Alternar tema">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px;"><circle cx="12" cy="12" r="5"></circle><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"></path></svg>
       </button>  


 <!-- Abas de Navegação Inferior -->
      <div class="footer-tabs">

        <button class="nav-item active" data-tab="inicio"><span>⌂</span>Início</button>
        <button class="nav-item" data-tab="biblioteca"><span>▤</span>Biblioteca</button>
        <button class="nav-item" data-tab="cortex"><span>◉</span>Cortex</button>
        <button class="nav-item" data-tab="ajustes"><span>⚙</span>Ajustes</button>
        <button class="nav-item" data-tab="kblx"><span>⚡</span>KBLX</button>
 </div>
</div>
 </header> 


        <div id="main-content">

    <!-- ============================================================
    ABAS (conteúdo)
    ============================================================ -->

    <!-- ABA INÍCIO (Home + painéis) -->
    <div id="tab-inicio" class="tab-content active">
        <!-- HK COMPONENTS -->
        <div id="hkHome">
            <header class="hk-header-vision">
                <div class="hk-status-bar">
                    <span id="hkClock">--:--</span>
                    <div style="display:flex; gap:6px; align-items:center;">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21l-12-18h24z"></path></svg>
                        <span>369</span>
                        <div style="width:25px; height:12px; border:1px solid white; border-radius:3px; padding:1px;">
                            <div style="width:70%; height:100%; background:white;"></div>
                        </div>
                    </div>
                </div>
                <nav class="hk-nav-glass">
                    <div class="hk-nav-left">
                        <svg class="hk-brand-logo" viewBox="0 0 24 24"><path d="M17.5,19c-3.6,0-6.5-2.9-6.5-6.5s2.9-6.5,6.5-6.5s6.5,2.9,6.5,6.5S21.1,19,17.5,19z M17.5,8c-2.5,0-4.5,2-4.5,4.5s2,4.5,4.5,4.5s4.5-2,4.5-4.5S20,8,17.5,8z"></path></svg>
                        <span style="font-weight:600; font-size:17px;">KODUX iCloud</span>
                    </div>
                    <div class="hk-nav-right">
                        <button class="hk-icon-btn" id="hkExport">⇧</button>
                        <button class="hk-icon-btn" id="hkGrid">⊞</button>
                        <div class="hk-avatar-vinyl" id="hkAvatar"></div>
                    </div>
                </nav>
            </header>

            <section class="hk-card hk-profile-card" data-hk-open="nebula">
                <div class="hk-avatar-vinyl hk-vinyl-large"></div>
                <div class="hk-profile-info">
                    <h1>Espaço da Mente</h1>
                    <p>Nébula Pro · Grito Vivo · KBLX 3×6×9×7</p>
                    <div class="hk-badge-icloud" id="hkArchBadge">KOBLLUX · toque para entrar</div>
                </div>
            </section>

            <section class="hk-card hk-list-card" data-hk-open="nebula">
                <div class="hk-card-header">
                    <div class="hk-icon-box" style="background:#007aff22;">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="#007aff"><path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"></path></svg>
                    </div>
                    <div class="hk-card-title-group">
                        <h3>Library</h3>
                        <span id="hkLibCount">● carregando…</span>
                    </div>
                </div>
                <div class="hk-card-content" id="hkLibList"><div class="hk-empty-row">Abrindo IndexedDB…</div></div>
            </section>

            <section class="hk-card hk-storage-card">
                <div class="hk-storage-row">
                    <span>Sementes fundidas</span>
                    <span style="color:var(--hk-text-secondary);" id="hkStorageLabel">0 documentos</span>
                </div>
                <div class="hk-storage-bar"><div class="a"></div><div class="b"></div><div class="c"></div></div>
            </section>

            <div class="hk-app-grid">
                <button class="hk-app-item" data-hk-open="nebula"><div class="hk-app-icon" style="background:linear-gradient(to bottom,#22D3EE,#0a7ea4);">✦</div><span class="hk-app-label">Nébula</span></button>
                <button class="hk-app-item" data-hk-open="grito"><div class="hk-app-icon" style="background:linear-gradient(to bottom,#7a57ff,#5cc6ff);">◈</div><span class="hk-app-label">Grito Vivo</span></button>
                <button class="hk-app-item" data-hk-open="library"><div class="hk-app-icon" style="background:#1C1C1E;">📁</div><span class="hk-app-label">Library</span></button>
                <button class="hk-app-item" data-hk-open="player"><div class="hk-app-icon" style="background:#FF9500;">🎧</div><span class="hk-app-label">Player</span></button>
            </div>
        </div>

    

        <!-- CICLO PAINEL -->
        <div id="ciclo-painel">
            <span><span style="color:var(--accent);">∅ PASSO:</span> <span id="ciclo-passo" style="color:#fff;">01</span></span>
            <span><span style="color:var(--accent);">⍟ ARQ:</span> <span id="ciclo-arq" style="color:#fff;">ATLAS</span></span>
            <span><span style="color:var(--accent);">∅ PESO:</span> <span id="ciclo-peso" style="color:#fff;">0.180</span></span>
            <span><span style="color:var(--accent);">∆:</span> <span id="ciclo-delta" style="color:#fff;">0.001</span></span>
            <span><span style="color:var(--accent);">∅ EQUAÇÃO:</span> <span style="color:#888;">01→02→03→∆ⁿ</span></span>
        </div>
    </div>

    <!-- ABA BIBLIOTECA (Nébula) -->
    <div id="tab-biblioteca" class="tab-content">
       <iframe
        class="app-frame"
        src="https://www.infodose.com.br/oiDual/KODUX/78K/APPS/78HERO/"
        loading="lazy"
        allowfullscreen>
    </iframe>
    </div>

    <!-- ABA CORTEX (placeholder) -->


<!-- ABA CORTEX -->
<div id="tab-cortex" class="tab-content">
    <iframe
        class="app-frame"
        src="https://www.infodose.com.br/oiDual/KODUX/78K/APPS/78iFSwOS/"
        loading="lazy"
        allowfullscreen>
    </iframe>
</div>

    </div>

    <!-- ABA AJUSTES (placeholder) -->
   
 <!-- ABA AJUSTES -->
<div id="tab-ajustes" class="tab-content">
    <iframe
        class="app-frame"
        src="https://www.infodose.com.br/oiDual/KODUX/78K/APPS/78KARD/"
        loading="lazy"
        allowfullscreen>
    </iframe>
</div>
   </div>

   
    <!-- ============================================================
    MODAL READER E INPUT
    ============================================================ -->
    <input type="file" id="file-input" multiple="" accept=".txt,.md,.html,.pdf">
    <div class="reader" id="reader">
        <div class="reader-head">
            <div class="reader-title" id="reader-title">Título</div>
            <button class="reader-close" id="reader-close">×</button>
        </div>
        <div class="reader-body" id="reader-body"></div>
    </div>
</div>
    <!-- ============================================================
    SCRIPTS (Nébula + KBLX + BaúLite Unificado)
    ============================================================ -->
    

<script src="https://www.infodose.com.br/oiDual/KODUX/78K/APPS/78HERO/js/modules/inline-0.js"></script>
<script src="https://www.infodose.com.br/oiDual/KODUX/78K/APPS/78HERO/js/modules/inline-1.js"></script>`);