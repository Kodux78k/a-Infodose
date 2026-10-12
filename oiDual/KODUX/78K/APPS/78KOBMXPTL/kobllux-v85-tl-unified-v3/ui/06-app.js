/* ui · app */
KobBoot.mount('app', `
  <main class="app">
    <section class="section reveal" id="workspace" data-mxp-static="">
      <div class="section-head"><span class="section-num">00</span><div><div class="section-title">Workspace</div><div class="section-sub">único · menu · grupos · sessions · loose (estado, não outro sistema)</div></div></div>
      <nav class="ws-menu" id="wsMenu" aria-label="Workspace">
        <div class="ws-row ws-grp"><button type="button" class="ws-slide" data-d="l" aria-label="←">‹</button><div class="ws-strip"></div><button type="button" class="ws-slide" data-d="r" aria-label="→">›</button></div>
        <div class="ws-row ws-mod"><button type="button" class="ws-slide" data-d="l" aria-label="←">‹</button><div class="ws-strip"></div><button type="button" class="ws-slide" data-d="r" aria-label="→">›</button></div>
        <div class="ws-actions"><button class="action primary" style="flex:1;min-width:120px" id="newSessionBtn">＋ NOVA SESSION</button>
          <button class="action" style="flex:1;min-width:120px" id="toggleHostBtn">⇄ HOST: <span id="hostModeLabel">FLOAT</span></button></div>
      </nav>
      <div class="dose" style="--arch-color:var(--kob-voice-primary)"><div class="mxp-slot" data-slot="loose" data-drop-target="" style="min-height:64px"></div></div>
    </section>
    <section class="section reveal" id="pillsSection">
      <div class="section-head"><span class="section-num">05</span><div><div class="section-title">Pílulas · Docs</div><div class="section-sub">importe · exemplos · semente 🌱 + fusão 🪞 · 💊 abre a barra de pílulas</div></div></div>
      <div id="nebulaRoot">
        <div id="filterBar">
          <button class="tab-pill on" data-f="all">Todos</button>
          <button class="tab-pill" data-f="fav">★ Fav</button>
          <button class="tab-pill" data-f="md">MD</button>
          <button class="tab-pill" data-f="txt">TXT</button>
          <button class="tab-pill" data-f="pdf">PDF</button>
        </div>
        <input id="q" type="search" placeholder="Buscar documentos...">
        <div id="stage"></div>
        <div id="dots"></div>
        <div id="empty">Nenhum documento. Toque em <b>📥 Importar</b> ou <b>✨ Exemplos</b>.</div>
        <div id="navDock" style="display:none">
          <button id="prev" type="button">‹</button>
          <button id="next" type="button">›</button>
        </div>
        <div id="docPillsBar"></div>
        <div id="nebulaToolbar" class="bota1">
          <button class="pill sm" id="btnImport" data-dual-target="" data-dual-action="mente:import">📥 Importar</button>
          <button class="pill sm" id="btnSample" data-dual-target="" data-dual-action="mente:samples">✨ Exemplos</button>
          <button class="pill sm" id="btnPills" data-dual-target="" data-dual-action="mente:pills">💊 Pílulas</button>
          <button class="pill sm" onclick="document.getElementById('s0')?.scrollIntoView({behavior:'smooth'})">🧠 Espaço da Mente</button>
        </div>
      </div>

      <input id="nbFileInput" type="file" multiple="" accept=".txt,.md,.html,.pdf,.json,.csv" style="display:none">
    </section>
    <section class="section reveal" id="sonoroSection">
      <div class="section-head"><span class="section-num">06</span><div><div class="section-title">Espaço da Mente · Soneto</div><div class="section-sub">modo SONETO · semente + espelho → fusão 369 · voz do arquétipo · síntese Tone.js</div></div></div>
      <div id="sonetoRoot" class="sn-scope">
        <div id="sn-inject-here" class="content">

          <div class="blob blob1"></div>
          <div class="blob blob2"></div>
          <div class="blob blob3"></div>

          <div class="wrap">

  <!-- TÍTULO -->
            <div>
              <h1 class="title">ESPAÇO DA MENTE</h1>
              <p class="sub">Fractal 369 · Estúdio Vivo · Sonoro</p>
            </div>

  <!-- 01 · SEMENTE -->
            <details id="sessionSeed" class="collapse-section">
              <summary class="collapse-summary" draggable="true">
                <div class="summary-left">
                  <span class="summary-index">01</span>
                  <div class="summary-info">
                    <div class="summary-title">Semente</div>
                    <div class="summary-sub">Texto 1 · entrada principal</div>
                  </div>
                </div>
                <div class="summary-actions">
                  <button type="button" class="mxp-action" data-action="import" data-target="t1" data-file="f1" title="Importar" aria-label="Importar">+</button>
                  <button type="button" class="mxp-action" data-action="paste" data-target="t1" title="Colar" aria-label="Colar">⧋</button>
                </div>
                <span class="summary-chevron" aria-hidden="true">↓</span>
              </summary>
              <div class="collapse-body">
                <div class="collapse-inner">
                  <label class="input-label" for="t1">Texto 1 · Semente</label>
                  <textarea id="t1" placeholder="Cola tua ideia aqui... ou áudio transcrito..."></textarea>
                  <div class="field-actions">
                    <button type="button" class="field-action" data-action="import" data-target="t1" data-file="f1">+ Importar</button>
                    <button type="button" class="field-action" data-action="paste" data-target="t1">⧋ Colar</button>
                    <button type="button" class="field-action" data-action="clear-field" data-target="t1">✕ Limpar</button>
                  </div>
                  <input type="file" id="f1" accept=".txt,.html,.md">
                </div>
              </div>
            </details>

  <!-- 02 · ESPELHO -->
            <details id="sessionMirror" class="collapse-section">
              <summary class="collapse-summary" draggable="true">
                <div class="summary-left">
                  <span class="summary-index">02</span>
                  <div class="summary-info">
                    <div class="summary-title">Espelho</div>
                    <div class="summary-sub">Texto 2 · segunda entrada</div>
                  </div>
                </div>
                <div class="summary-actions">
                  <button type="button" class="mxp-action" data-action="import" data-target="t2" data-file="f2" title="Importar" aria-label="Importar">+</button>
                  <button type="button" class="mxp-action" data-action="paste" data-target="t2" title="Colar" aria-label="Colar">⧋</button>
                </div>
                <span class="summary-chevron" aria-hidden="true">↓</span>
              </summary>
              <div class="collapse-body">
                <div class="collapse-inner">
                  <label class="input-label" for="t2">Texto 2 · Espelho</label>
                  <textarea id="t2" placeholder="Cola outro texto pra fundir..."></textarea>
                  <div class="field-actions">
                    <button type="button" class="field-action" data-action="import" data-target="t2" data-file="f2">+ Importar</button>
                    <button type="button" class="field-action" data-action="paste" data-target="t2">⧋ Colar</button>
                    <button type="button" class="field-action" data-action="clear-field" data-target="t2">✕ Limpar</button>
                  </div>
                  <input type="file" id="f2" accept=".txt,.html,.md">
                </div>
              </div>
            </details>

  <!-- FUNDIR -->
            <button class="btn" type="button" data-snc="fractalMerge">⊕ FUNDIR FRACTAL</button>

  <!-- 03 · RESULTADO -->
            <details id="sessionResult" class="collapse-section">
              <summary class="collapse-summary" draggable="true">
                <div class="summary-left">
                  <span class="summary-index">03</span>
                  <div class="summary-info">
                    <div class="summary-title">Resultado</div>
                    <div id="resultSummaryText" class="summary-sub">Fusão Fractal · 369</div>
                  </div>
                </div>
                <div class="summary-actions">
                  <button type="button" class="mxp-action" data-action="copy-result" title="Copiar" aria-label="Copiar">⧉</button>
                  <button type="button" class="mxp-action" data-action="download-result" title="Baixar" aria-label="Baixar">↓</button>
                  <button type="button" class="mxp-action" data-action="toggle-tts" title="Ouvir" aria-label="Ouvir">▷</button>
                  <button type="button" class="mxp-action music-btn" data-action="play-sonoro" title="Sintetizar" aria-label="Sintetizar">🎵</button>
                </div>
                <span class="summary-chevron" aria-hidden="true">↓</span>
              </summary>
              <div class="collapse-body">
                <div class="collapse-inner">

                  <div id="resultPanel" class="output-wrap" style="display:none">

                    <div class="output-header">
                      <div class="output-title">Resultado Fractal · 369</div>
                      <div class="output-controls">
                        <button type="button" class="output-control primary" data-action="copy-result" title="Copiar" aria-label="Copiar">⧉</button>
                        <button type="button" class="output-control" data-action="download-result" title="Baixar TXT" aria-label="Baixar TXT">↓</button>
                        <button type="button" class="output-control" data-action="result-to-seed" title="→ Semente" aria-label="→ Semente">→S</button>
                        <button type="button" class="output-control" data-action="result-to-mirror" title="→ Espelho" aria-label="→ Espelho">→E</button>
                        <button type="button" class="output-control swap" data-action="swap" title="Inverter" aria-label="Inverter">⇄</button>
                        <button type="button" class="output-control tts-btn" id="ttsBtn" data-action="toggle-tts" title="Ouvir resultado" aria-label="Ouvir resultado">🎧</button>
                        <button type="button" class="output-control music-btn" id="musicBtn" data-action="play-sonoro" title="Sintetizar melodia" aria-label="Sintetizar melodia">🎵</button>
                      </div>
                    </div>

                    <div class="view-tabs" role="tablist">
                      <button type="button" class="view-tab active" data-view="raw">RAW</button>
                      <button type="button" class="view-tab" data-view="rich">RICO</button>
                      <button type="button" class="view-tab" data-view="slices">FATIAS</button>
                      <button type="button" class="view-tab music" data-view="sonoro">♪ SONORO</button>
                    </div>

                    <div class="control-strip">

                      <div class="strip-panel" id="stripRaw" style="display:flex">
                        <span class="strip-info" id="stripRawInfo">—</span>
                      </div>

                      <div class="strip-panel" id="stripRich" style="display:none">
                        <button type="button" class="fmt-toggle" data-fmt="chapters"># Cap</button>
                        <button type="button" class="fmt-toggle" data-fmt="subtitles">## Sub</button>
                        <button type="button" class="fmt-toggle" data-fmt="callouts">! Dest</button>
                        <button type="button" class="fmt-toggle" data-fmt="pagebreaks">— Pág</button>
                        <label>Palavras <input type="number" id="fmtWords" value="12" min="4" max="60"></label>
                      </div>

                      <div class="strip-panel" id="stripSlices" style="display:none">
                        <div class="slicer-nav">
                          <button type="button" class="slicer-btn" data-slice="prev" title="Anterior">◀</button>
                          <button type="button" class="slicer-btn" data-slice="next" title="Próxima">▶</button>
                          <button type="button" class="slicer-btn slice-mode" data-slicemode="paragraph" title="Por parágrafo">¶</button>
                          <button type="button" class="slicer-btn slice-mode" data-slicemode="sentence" title="Por frase">.</button>
                          <button type="button" class="slicer-btn slice-mode" data-slicemode="char" title="Por caractere">#</button>
                          <input type="number" id="sliceSize" value="420" min="80" max="2000" step="20" title="Tamanho">
                          <button type="button" class="slicer-btn" data-slice="all" title="Mostrar todas">▦</button>
                          <button type="button" class="slicer-btn" id="slicePlayBtn" title="Ouvir fatia">🎧</button>
                        </div>
                        <span class="slice-counter" id="sliceCounter">— <b>0</b>/0 —</span>
                      </div>

                      <div class="strip-panel" id="stripSonoro" style="display:none">
                        <select id="sonoroTheme" class="sonoro-select" title="Escala Musical">
                          <option value="melancolia">Melancolia</option>
                          <option value="alegria">Alegria</option>
                          <option value="misterio">Mistério</option>
                          <option value="sonho">Sonho (Lídia)</option>
                          <option value="oriental">Zen (Hirajoshi)</option>
                          <option value="cyberpunk">Cyberpunk</option>
                        </select>
                        <select id="sonoroSynth" class="sonoro-select" title="Timbre"><option value="pluck">Pluck</option>
                          <option value="softKey">Piano Suave</option>
                          <option value="marimba">Marimba</option>
                          <option value="synthwave">Synthwave</option>
                          <option value="ambient">Ambient Pad</option>
                        </select>
                        <label>BPM <input type="number" id="sonoroBpm" value="130" min="60" max="240"></label>
                        <label>Rev <input type="number" id="sonoroReverb" value="40" min="0" max="100"></label>
                        <button type="button" class="slicer-btn music-play" id="sonoroPlayBtn" title="Tocar">▶</button>
                        <button type="button" class="slicer-btn" id="sonoroStopBtn" title="Parar">■</button>
                      </div>

                    </div>

                    <div id="out" class="output" role="region" aria-label="Resultado fractal"></div>

                  </div>

                  <div id="resultEmpty" class="dict-empty">Funde dois textos para ver o resultado aqui.</div>

                </div>
              </div>
            </details>

  <!-- 04 · PATO DO MUNDO -->
            <details id="sessionDictionary" class="collapse-section">
              <summary class="collapse-summary" draggable="true">
                <div class="summary-left">
                  <span class="summary-index">04</span>
                  <div class="summary-info">
                    <div class="summary-title">Pato do Mundo</div>
                    <div class="summary-sub">Dicionário de substituições</div>
                  </div>
                </div>
                <div class="summary-actions">
                  <div class="toggle-switch" data-action="toggle-dict" title="Ativar/Desativar" role="switch" aria-label="Ativar dicionário"></div>
                </div>
                <span class="summary-chevron" aria-hidden="true">↓</span>
              </summary>
              <div class="collapse-body">
                <div class="collapse-inner">

                  <div class="dict-toolbar">
                    <button type="button" class="dict-preset" data-preset="patoDoMundo">🦆 Pato do Mundo</button>
                    <button type="button" class="dict-preset" data-preset="kblx">🐾 KBLX básico</button>
                    <button type="button" class="dict-preset" data-preset="vazio">✕ Limpar</button>
                  </div>

                  <div class="rules-list" id="rulesList"></div>

                  <div class="dict-add-row">
                    <button type="button" id="addRuleBtn">+ Regra</button>
                    <button type="button" class="solid" id="exportRulesBtn">⇩ Exportar</button>
                    <button type="button" class="solid" id="importRulesBtn">⇧ Importar</button>
                    <input type="file" id="importFile" accept=".json" style="display:none">
                  </div>

                  <div class="dict-stats">
                    <div class="dict-stat"><b id="dsRules">0</b><span>Regras</span></div>
                    <div class="dict-stat"><b id="dsActive">0</b><span>Ativas</span></div>
                    <div class="dict-stat"><b id="dsSubs">0</b><span>Subs</span></div>
                  </div>

                </div>
              </div>
            </details>

  <!-- ARQUÉTIPO -->
            <select id="archSelect" class="arch-select" style="display:none;
    background:var(--glass);border:1px solid var(--border);
    border-radius:12px;padding:10px;color:var(--text);width:100%;
    margin-top:10px;font-size:14px;">
              <option value="">Escolher Arquétipo 78K...</option>
              <option value="kodux">KODUX · Laranja Violeta</option>
              <option value="kobllux">KOBLLUX · Ciano</option>
              <option value="atlas">ATLAS · Azul Dourado</option>
              <option value="nova">NOVA · Rosa Xoq</option>
              <option value="bllue">BLLUE · Azul Blue</option>
            </select>

            <button id="btn78k" class="btn btn-78k" style="display:none" type="button" data-snc="enviar78K">
    ENVIAR PRO 78K E OUVIR
            </button>

            <p class="hint">Salva esta página. É o anúncio. É o motor. É teu.</p>

          </div>
        </div>
      </div>
    </section>
    <section class="section reveal" id="s0">
      <div class="section-head"><span class="section-num">01</span><div><div class="section-title">Slicer · Nebula</div><div class="section-sub">Importe/cole → slices com voz</div></div></div>
      <div id="readerApp">
        <header class="reader-header">
          <div class="brand"><div class="brand-symbol">◉</div><div><div class="brand-title" id="documentTitle">ESPAÇO DA MENTE</div><div class="brand-subtitle">NEBULA · SLICE</div></div></div>
          <div class="header-actions">
            <button class="icon-btn" onclick="Nebula.openFile()">＋</button>
            <button class="icon-btn" onclick="Nebula.pasteText()">✎</button>
            <button class="icon-btn" onclick="Nebula.togglePlayer()">◌</button>
          </div>
        </header>
        <main class="reader-viewport">
          <div id="sliceStage"></div>
          <div id="emptyState" class="empty-state"><div class="empty-box"><div class="empty-symbol">◉</div><h1>Espaço da Mente</h1><p>Importe um TXT / MD / JSON ou cole um texto.</p><button class="import-button" onclick="Nebula.openFile()">＋ Importar</button></div></div>
          <div class="nav"><button onclick="Nebula.previousSlice()">↑</button><button onclick="Nebula.nextSlice()">↓</button></div>
          <div id="player" class="player">
            <div class="player-main"><button id="playButton" class="play-btn" onclick="Nebula.toggleSpeech()">▶</button></div>
            <div class="player-info"><div id="playerTitle" class="player-title">Nenhum</div><div id="playerState" class="player-state">Aguardando</div></div>
            <div class="progress-wrap"><div class="progress"><div id="progressBar" class="progress-bar"></div></div></div>
            <div class="player-controls-secondary"><button class="small-btn" onclick="Nebula.previousSlice()">‹</button><button class="small-btn" onclick="Nebula.nextSlice()">›</button><button class="small-btn" onclick="Nebula.stopSpeech()">■</button></div>
          </div>
        </main>
        <input id="fileInput" type="file" accept=".txt,.md,.markdown,.json,.csv,text/plain">
      </div>
    </section>
    <section class="section reveal" id="s3">
      <div class="section-head"><span class="section-num">04</span><div><div class="section-title">Conversa · 💬</div><div class="section-sub"><span class="round" id="roundLabel">0 ciclos</span><button class="msg-mini slicer" id="allToSlicerBtn" style="margin-left:8px">→ SLICER</button></div></div></div>
      <div class="chat-window" id="chatWindow">
        <div class="conversation" id="conversation"><div class="empty">O diálogo ainda não nasceu.<br><br><b>Cole um texto → extraia → gere a conversa.</b></div></div>
      </div>
    </section>
    <section class="section reveal" id="s2">
      <div class="section-head"><span class="section-num">03</span><div><div class="section-title">Banco Lexical</div><div class="section-sub" id="bankInfo">aguardando</div></div></div>
      <div class="dose" style="--arch-color:var(--KBLX_E)"><div class="bank" id="lexicalBank"><span style="color:var(--DIM);font-size:11px">EXTRAIR BANCO para começar.</span></div></div>
    </section>
    <section class="section reveal" id="cortexSection">
      <div class="section-head"><span class="section-num">07</span><div><div class="section-title">Córtex · Neural View</div><div class="section-sub">sessions MXP/iFSw como neurônios · seções como lobos · cristais de memória</div></div></div>
      <div id="cortexRoot">
        <div class="kc-tabs" role="tablist">
          <button type="button" class="kc-tab on" data-kc-tab="neural">⬡ NEURAL</button>
          <button type="button" class="kc-tab" data-kc-tab="crystals">◈ CRISTAIS <span class="kc-count" id="kcCrystalCount">0</span></button>
          <button type="button" class="kc-tab kc-tab-mini" data-kc-act="relayout" title="Reorganizar">⟳</button>
        </div>
        <div class="kc-pane" id="kcNeural">
          <div class="kc-stage"><svg id="kcSvg" viewBox="0 0 360 360" role="img" aria-label="Rede neural de sessions"></svg>
            <div class="kc-legend"><span class="lg a">● ativa</span><span class="lg d">◐ dock</span><span class="lg c">○ fechada</span><span class="lg l">⬡ lobo</span></div></div>
          <div class="kc-info" id="kcInfo"><div class="kc-hint">Toque num neurônio · 2 toques abre</div></div>
        </div>
        <div class="kc-pane" id="kcCrystals" hidden="">
          <div class="kc-search"><input id="kcSearch" type="search" placeholder="Buscar nas matrizes…" autocomplete="off"><button type="button" class="kc-btn" data-kc-act="crystal-new">＋ Cristal</button></div>
          <div class="kc-form" id="kcForm" hidden="">
            <textarea id="kcNewText" rows="4" placeholder="Memória a cristalizar…"></textarea>
            <input id="kcNewTags" type="text" placeholder="tags, separadas, por vírgula">
            <div class="kc-row"><button type="button" class="kc-btn" data-kc-act="crystal-cancel">Cancelar</button><button type="button" class="kc-btn pri" data-kc-act="crystal-save">Cristalizar</button></div>
          </div>
          <div id="kcList" class="kc-list"></div>
        </div>
      </div>
    </section>
    <section class="section reveal" id="s1">
      <div class="section-head"><span class="section-num">02</span><div><div class="section-title">Polo de Origem</div><div class="section-sub">Cole · importe · extraia · gere</div></div></div>
      <div class="dose" style="--arch-color:var(--kob-voice-primary)">
        <div class="input-head"><span class="label">Texto Fonte</span><span class="counter" id="counter">0</span></div>
        <textarea id="sourceText" spellcheck="false" placeholder="Cole qualquer texto aqui..."></textarea>
        <input type="file" id="importSource" class="import-input" accept=".txt,.md,.json,.csv,text/plain">
        <div class="actions">
          <button class="action" id="pasteBtn">◉ COLAR</button>
          <button class="action" id="importBtn">⌲ IMPORTAR</button>
          <button class="action" id="parseBtn">◇ EXTRAIR</button>
          <button class="action primary" id="stepBtn">⇄ +15</button>
          <button class="action primary" id="generateBtn">✦ GERAR TUDO</button>
          <button class="action slicer full" id="sendSlicerBtn">→ SLICER</button>
          <button class="action audio full" id="listenBtn">◉ OUVIR</button>
        </div>
      </div>
    </section>
  </main>
`);
