/* ui · kblx-back */
KobBoot.mount('kblx-back', `
  <div id="kblx-back">
    <div id="kblx-panel">
      <header class="kblx-head">
        <div class="p-chip">⌘ KOBLLUX HUD · EDITOR DE ROTA</div>
        <button class="kblx-icon-btn" id="kblx-btn-close">✕</button>
      </header>
      <div class="kblx-title-wrap">
        <h2 class="p-title" id="kblx-ttl">Botão</h2>
        <p class="kblx-sub">Editar destino do SymbolButton</p>
      </div>
      <section class="kblx-section">
        <label class="p-lbl" for="kblx-inp">Novo valor para <code>data-url</code></label>
        <input id="kblx-inp" type="text" placeholder="arquivo.html ou https://..." spellcheck="false" autocomplete="off">
        <div class="kblx-preview" id="kblx-preview">Nenhuma rota definida</div>
      </section>
      <section class="kblx-section">
        <div class="kblx-sec-head"><span>Presets</span></div>
        <div class="kblx-presets">
          <button class="kblx-preset" data-url="index.html">Home</button>
          <button class="kblx-preset" data-url="hub.html">Hub</button>
          <button class="kblx-preset" data-url="render-response.html">Render</button>
          <button class="kblx-preset" data-url="https://google.com">URL</button>
        </div>
      </section>
      <div class="kblx-row">
        <button class="kblx-btn kblx-save" id="kblx-btn-save" type="button">⊙ Salvar no botão</button>
        <button class="kblx-btn kblx-inject" id="kblx-btn-orb-inject" type="button">◉ OrbInject</button>
        <button class="kblx-btn kblx-dup" id="kblx-btn-dup" type="button">⧉ Duplicar Orb</button>
        <button class="kblx-btn kblx-del" id="kblx-btn-del" type="button">⌫ Remover Orb</button>
        <button class="kblx-btn kblx-clear" id="kblx-btn-clear" type="button">⌫ Limpar</button>
      </div>
    </div>
  </div>
`);
