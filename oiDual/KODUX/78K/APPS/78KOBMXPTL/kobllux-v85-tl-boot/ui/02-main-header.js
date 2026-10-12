/* ui · main-header */
KobBoot.mount('main-header', `
  <header class="sys-topbar" id="main-header">
    <input class="win-urlbar" type="text" id="urlInputNav" placeholder="URL global..." spellcheck="false" autocomplete="off" data-dual-target="" data-dual-action="nav:go">
    <button class="win-go-btn" type="button" id="goNavBtn" data-dual-target="" data-dual-action="nav:go">Go</button>
    <div class="top-pills">
      <div class="pill" id="pillHz"></div>
      <div class="pill arch" id="pillArch">
      </div>
  <!-- [FINAL] alvos das pills ao vivo (o runtime atualiza; dock/loose só aparecem quando > 0) -->
      <div class="pill" data-pill="active" title="Sessões ativas">⬡ 0 ATIVAS</div>
      <div class="pill" data-pill="dock" style="display:none" title="No dock (۞)">⚓ 0</div>
      <div class="pill" data-pill="loose" style="display:none" title="No loose (fechadas)">◈ 0</div>
    </div>
    <div class="mxp-header-slot"><div class="mxp-slot is-inline" data-slot="header" data-drop-target=""></div></div>
    <button class="launcher-btn" id="orbToggle" title="Cockpit Solar" data-dual-target="" data-dual-action="drawer:open">🔅</button>
  </header>
`);
