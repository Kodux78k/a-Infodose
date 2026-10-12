/* ui · symbolbar · monolith */
KobBoot.into('#symbolBar', 'symbolbar.monolith', `
  <div style="z-index:0; min-width:87vw; min-height:87dvh; border-radius:39px;" class="symbol-toolbar monolith-wrapper">
    <div style="z-index:0" class="monolith">
      <div class="mono-header">
        <div class="mono-brand">
          <div class="brand-icon"></div>
          <div class="brand-title">DUAL <span style="opacity:0.3; margin:0 4px;">//</span> MONOLITH</div>
        </div>
        <div id="sysStatus" class="status-badge">STANDBY</div>
      </div>
      <div class="mono-body">
        <div id="viewVault" class="vault-view">
          <div class="actions-grid">
            <button id="createBtn" class="action-card btn-create"><span>NOVO</span></button>
            <div id="dropZone" class="action-card dashed"><span style="font-family: var(--font-code)">UPLOAD</span></div>
            <button id="backupBtn" class="action-card"><span>BACKUP</span></button>
            <button id="safeBtn" class="action-card"><span id="safeLabel">SAFE</span></button>
          </div>
          <div class="top-bar">
            <div class="brand-text"></div>
            <div class="sep"></div>
            <button id="themeToggleSb" class="theme-btn" title="Toggle Theme"></button>
          </div>
          <div class="sidebar right">
            <button class="symbol-button icon-btni nav-btni" data-url="https://www.infodose.com.br/splash.html" title="Void">Φ</button>
            <div class="symbol-wrap"><button class="symbol-button" data-id="Home" data-url="https://kodux78k.github.io/oiDual--Y-/M0D/iFS/">Φ</button></div>
            <div class="symbol-wrap"><button class="symbol-button" data-id="78Frames" data-url="https://www.infodose.com.br/oiDual/KODUX/78K/APPS/78F.html">꩜</button></div>
            <div class="symbol-wrap"><button class="symbol-button" data-id="Feeling" data-url="https://www.infodose.com.br/oiDual/KODUX/78K/APPS/78EM.html">◌</button></div>
            <div class="symbol-wrap"><button class="symbol-button" data-id="Nebualayer" data-url="https://www.infodose.com.br/oiDual/KODUX/78K/APPS/78NP.html">◘</button></div>
            <div class="symbol-wrap"><button class="symbol-button" id="quickAddBtn" title="Adicionar atalho (usa a URL atual)">＋</button></div>
            <div class="symbol-wrap"><button class="symbol-button" id="sbxEditBtn" title="Editar atalhos">✎</button></div>
          </div>
          <div class="sidebar left">
            <button id="uploadBtn" class="icon-btn" title="Import File"><i class="fa-solid fa-upload"></i></button>
            <input type="file" id="uploadInput" hidden="" accept=".html,.js,.json">
            <button id="remoteBtn" class="icon-btn" title="Fetch Remote"><i class="fa-solid fa-globe"></i></button>
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
          <div class="code-area"><textarea id="modContent" placeholder=""></textarea></div>
          <div class="flex gap-3"><button id="saveEditor" class="btn-save">SALVAR NO VAULT</button></div>
        </div>
      </div>
      <div class="mono-footer"><div id="pulseBar"></div></div>
      <div id="runtimeLayer" class="runtime-layer">
        <div class="runtime-bar">
          <div class="runtime-indicator"><div class="dot"></div><span>a€Dual // ACTIVE</span></div>
          <div class="flex items-center gap-2">
            <button id="exportBtn" class="btn-cancel" style="font-size:10px;">EXPORT TO NAV</button>
            <button id="closeRuntime" class="icon-btn" style="width:24px; height:24px; border:none; background:transparent;"><i class="ico" style="font-size:16px" aria-hidden="true">✕</i></button>
          </div>
        </div>
        <div class="runtime-frame-wrap">
          <iframe loading="lazy" id="appFrame" style="border:0;width:100%;height:100%;display:block;" sandbox="allow-scripts allow-forms allow-modals allow-same-origin allow-pointer-lock"></iframe>
          <div class="scanline"></div>
        </div>
      </div>
    </div>
  </div>
      <!-- ORB BG -->
`);
