/* ui · symbolbar · controls */
KobBoot.into('#symbolBar', 'symbolbar.controls', `
  <div class="toggle-wrap">
    <button class="symbol-button main-toggle" id="toggleBtn" title="Menu / Iniciar">≡</button>
  </div>
  <div class="symbol-wrap sb-extras">
    <button class="symbol-button" id="btn-prev" title="Voltar Bloco">◀</button>
  </div>
  <div class="symbol-wrap sb-extras">
    <button class="symbol-button" id="btn-play" title="Play/Pause">▶</button>
  </div>
  <div class="symbol-wrap sb-extras">
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
  <div class="symbol-wrap sb-extras">
    <button class="symbol-button" id="toggleViewportBtn" title="Viewport" aria-pressed="false">⊟</button>
  </div>
  <div class="symbol-wrap sb-extras">
    <button class="symbol-button" id="sbxPlayerBtn" data-player-url="https://youtu.be/Bt_rLbMjJDk?si=O71F98mdiFqKbYO0" data-player-title="Player" title="Player">📺</button>
  </div>
`);
