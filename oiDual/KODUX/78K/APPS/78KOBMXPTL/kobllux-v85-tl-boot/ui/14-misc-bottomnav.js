/* ui · misc-bottomnav */
KobBoot.mount('misc-bottomnav', `
  <footer class="bottomnav">
    <div class="nav-dots" id="navDots"><span class="nav-dot on"></span><span class="nav-dot"></span><span class="nav-dot"></span></div>
    <div class="mxp-footer-slot"><div class="mxp-slot is-inline" data-slot="footer" data-drop-target=""></div></div>
    <button class="nav-cta" id="navStep" data-dual-target="" data-dual-action="session:new">+15 ⇄</button>
  </footer>

  <div id="sessionsLayer" data-empty="1"></div>
  <div id="groupsLayer"></div>

  <!-- SKY / TOASTS / STATUS -->
  <div class="sky-layer"><div class="sun-background"></div></div>
  <div id="nv-toast" aria-live="polite"></div>
  <div id="modeIndicator">CARREGANDO nO.Sºlar...</div>
  <div id="usernameDisplay"></div>
`);
