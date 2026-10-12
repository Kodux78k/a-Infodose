/* ui · symbolbar · btn-art */
KobBoot.into('#symbolBar', 'symbolbar.btn-art', `
  <div style="pointer-events:none">
    <div id="orb-top" class="orb-bg"></div>
    <div id="orb-bottom" class="orb-bg"></div>
  </div>
  <div class="symbol-toolbar">
    <button id="orbBtn" class="orb-btn" aria-label="Toggle System">
      <div class="orb-core"></div>
    </button>
  </div>
`);
