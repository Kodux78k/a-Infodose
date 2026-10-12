/* ui · tabswitcheroverlay */
KobBoot.mount('tabswitcheroverlay', `
  <div class="tab-switcher-overlay session-window peeked" id="tabSwitcherOverlay">
    <div class="tab-switcher-panel">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;gap:8px">
        <small id="tabSwitcherTitle" style="font-family:var(--mono);letter-spacing:.16em;color:var(--kob-voice-primary)">ABAS</small>
        <div style="display:flex;gap:6px;align-items:center">
          <button id="newTabBtn" class="icon-btn" title="Nova aba">＋</button>
          <button id="closeTabSwitcher" class="icon-btn">✕</button>
        </div>
      </div>
      <div class="tab-grid" id="tabGrid"></div>
    </div>
  </div>
`);
