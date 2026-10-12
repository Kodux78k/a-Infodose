/* ui · nav-indicator */
KobBoot.mount('nav-indicator', `
  <div style="display:none" id="nav-indicator">
    <div class="dot" id="dot-0" onclick="Navigation.to(0)"></div>
    <div class="dot active" id="dot-1" onclick="Navigation.to(1)"></div>
    <div class="dot" id="dot-2" onclick="Navigation.to(2)"></div>
  </div>
`);
