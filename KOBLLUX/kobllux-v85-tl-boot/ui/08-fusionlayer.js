/* ui · fusionlayer */
KobBoot.mount('fusionlayer', `
  <div id="fusionLayer">
    <div id="snap-zone"></div>
    <div class="fc-stage">
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

          <button class="hud-menu-btn" id="hudMenuBtn" title="Menu Rápido">
            <span class="ico" aria-hidden="true">☰</span>
          </button>
        </div>

        <div class="orb-menu-trigger" id="orbMenuTrigger" title="Menu Rápido">●●●</div>
        <div class="drag-handle"></div>

        <div class="small-preview" id="smallPreview" title="Gerenciar Chaves">
          <div class="mini-avatar" id="smallMiniAvatar"></div>

          <button class="fusion-go-btn" id="fusionGoBtn" type="button" onclick="event.stopPropagation();window.KOBCockpit&amp;&amp;window.KOBCockpit.open()" title="Abrir cockpit">
            <span class="fusion-go-icon">⌘</span>
            <span class="fusion-go-text">COCKPIT</span>
          </button>

          <div class="small-text" id="smallText"></div>
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
                  <div>
                    <div style="font-weight:700">CÉREBRO</div>
                    <div style="font-size:0.78rem;opacity:0.6"><span id="actName">User</span></div>
                  </div>
                </div>
                <div class="activation-badge" id="actBadge" style="margin-left:auto;color:var(--neon-cyan);font-size:0.8em">v:--</div>
              </div>

              <pre id="actPre" class="activation-pre">Carregando...</pre>

              <div class="activation-controls" style="display:flex;gap:8px;margin-top:8px">
                <button class="trigger-btn" id="copyActBtn">COPIAR</button>
              </div>
            </div>
          </div>

          <!-- Section 2: System & Neural -->
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

                <div class="model-toggle">
                  <select id="modelSelect" class="btn">
                    <option value="" disabled="" selected="">Selecione Modelo</option>
                    <option value="nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free">NemoTron (Free)</option>
                    <option value="poolside/laguna-xs.2:free">laguna (Free)</option>
                    <option value="inclusionai/ring-2.6-1t:free">ring</option>
                    <option value="google/gemma-4-31b-it:free">google gemma</option>
                  </select>
                </div>

                <div class="panel-divider" style="margin:10px 0;border-top:1px solid rgba(255,255,255,0.05)"></div>

                <button id="saveSystemBtn" class="trigger-btn" style="margin-top:12px;background:var(--neon-cyan);color:#000;font-weight:700">
                  SALVAR CONFIGURAÇÃO
                </button>
              </div>
            </div>
          </div>

          <div class="stagger-item" style="display:none;margin-top:4px">
            <div class="stat-lbl" style="margin-bottom:6px;font-size:0.6rem;color:rgba(255,255,255,0.4)">INTERFACE MODE</div>
            <div style="display:flex;gap:8px;">
              <button class="trigger-btn mode-btn active-mode" id="btnModeCard" onclick="setMode('card')" style="flex:1" title="Modo Padrão">CARD</button>
              <button class="trigger-btn mode-btn" id="btnModeOrb" onclick="setMode('orb')" style="flex:1" title="Flutuante">ORB</button>
              <button class="trigger-btn mode-btn" id="btnModeHud" onclick="setMode('hud')" style="flex:1" title="Barra de Topo">HUD</button>
            </div>
          </div>
        </div>
    

        <div class="nebula"></div>

        <div class="wrap" id="root">

          <details class="acc" open="">
            <summary><span class="chev"></span><h2>✨ Builder v2 – Áudio + PDF</h2></summary><div class="sec"><p>Abra o painel “Auto‑Gerar” pelo botão +.</p><div class="demo-cta" style="display:flex;gap:8px;flex-wrap:wrap;margin-top:8px"><button class="btn" data-action="demo">Gerar Demo</button><button class="btn" data-action="importar">Auto‑Gerar</button><button class="btn" data-action="md">Exportar .md</button><button class="btn" data-action="pdf">Imprimir (PDF)</button></div></div></details></div>
  <!-- ============ Σ KaTeX — FAB ACTION PATCH (safe with FAB_MINI) ============ -->
  <!-- ============ LIST/ASCII BEAUTY PATCH — V2 (hierarquia + traço-cápsula) ============ -->
  <!-- ============ /LIST/ASCII BEAUTY PATCH — V2 ============ -->
  <!-- ============ TEXT BEAUTY & INTERACTION PATCH — V3 (aditivo) ============ -->
  <!-- ============ /TEXT BEAUTY & INTERACTION PATCH — V3 ============ -->
  <!-- MD Smart Generator · Monólito BUGADÃO v3 -->
  <!-- KOBLLUX :: PATCH ÚNICO — TTS por Blocos (v2 • Dock Vertical + Drag + Auto-Wire) -->
  <!-- /KOBLLUX :: PATCH ÚNICO — TTS por Blocos -->
  <!-- KOBLLUX :: TTS v32 — Dock + Outline + Vozes PT-BR + ASCII + Status compacto -->
  <!-- KOBLLUX :: TTS v32.2 — Patch Correto (clique + dock + limpeza de texto) -->
  <!-- BIG_LOCK_RESET_v1 — limpa locks e força preferências de base -->
  <!-- KOBLLUX · Vozes Arquétipas — Patch Inline (UPDATED) -->
  <!-- KOBLLUX · PATCH de Tema de Voz (cor por arquétipo) -->
  <!-- KOBLLUX · Soft Transition Override (fade de cores) -->
  <!-- KOBLLUX · Soft Fade Extra para BACKGROUND -->
  <!-- KOBLLUX · PATCH Buttons Fade + TTS Dock Soft Shadow -->
  <!-- KOBLLUX · ASCII Carousel v1 (marca ::anim ... ::end com \`\`\`ascii dentro) -->
  <!-- KOBLLUX PATCH :: FAB auto-close on action click / outside click -->
  <!-- KOBLLUX PATCH :: Converter (RTF→MD, tabelista, tokens, buttons) -->
  <!-- KOBLLUX PATCH :: FAB fecha logo após clicar em uma ação -->
  <!-- KOBLLUX · PATCH Gatilhos de Arquétipo (tags + frases) -->
  <!-- KOBLLUX · Bloquinho de Vozes + Gatilhos (Ion, Solus, Artemis, Pulse) -->
  <!-- Scripts modulares (inline) -->













































      </div>
    </div>
    <div class="toaster-wrap" id="toasterWrap"></div>
    <div id="keysModal" class="modal-overlay" aria-hidden="true">
      <div class="keys-card" role="dialog">
        <div class="keys-header">
          <div>
            <div id="keysTitle" style="font-weight:800;font-size:1.1rem;color:var(--neon-cyan)">USER KEYS MANAGER</div>
            <div style="color:rgba(255,255,255,.6);font-size:.85rem">Gerencie suas chaves API com segurança local (Cofre).</div>
          </div>
          <button id="closeKeysBtn" class="small-btn">X</button>
        </div>
        <div class="key-list" id="keyList"></div>
        <div class="form-section" style="margin-top:15px;padding-top:15px;border-top:1px solid rgba(255,255,255,.05)">
          <div class="form-grid">
            <input id="keyNameInput" placeholder="Nome da chave (ex: Principal)">
            <input id="keyTokenInput" type="password" placeholder="Token / ESK (Opcional)">
          </div>
          <button id="addKeyBtn" class="small-btn" style="width:100%;margin-top:8px;background:rgba(255,255,255,.1)">ADICIONAR CHAVE</button>
        </div>
        <div style="display:flex;gap:8px;justify-content:space-between;margin-top:15px;border-top:1px solid rgba(255,255,255,.05);padding-top:12px">
          <div style="font-size:.7rem;color:rgba(255,255,255,.4);display:flex;align-items:center;gap:5px">
            <i class="ico" style="font-size:14px" aria-hidden="true">🛡</i>
            <span id="vaultStatusText">Cofre Aberto</span>
          </div>
          <div style="display:flex;gap:8px"><button id="lockVaultBtn" class="small-btn danger">BLOQUEAR</button></div>
        </div>
      </div>
    </div>
    <div id="vaultModal" class="modal-overlay" aria-hidden="true">
      <div class="keys-card">
        <div class="vault-icon"><i class="ico" style="font-size:24px" aria-hidden="true">🔒</i></div>
        <h3 style="margin:0 0 10px 0;font-weight:800">ACESSO AO COFRE</h3>
        <p style="margin:0 0 15px 0;font-size:.9rem;color:rgba(255,255,255,.6)">Seus dados estão criptografados. Digite a senha para desbloquear.</p>
        <input type="password" id="vaultPassInput" class="cyber-input" style="text-align:center;margin-bottom:12px" placeholder="Senha...">
        <div style="display:flex;gap:8px;justify-content:center">
          <button id="vaultCancelBtn" class="small-btn">Cancelar</button>
          <button id="vaultUnlockBtn" class="small-btn active-btn">DESBLOQUEAR</button>
        </div>
      </div>
    </div>
  </div>
`);
