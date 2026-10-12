/* ui · drawerprofile */
KobBoot.mount('drawerprofile', `
  <div style="z-index:5" id="drawerProfile" class="drawer" aria-hidden="true">
    <div class="drawer-header"><h3>⚙ Cockpit Solar</h3><button class="drawer-close" onclick="toggleDrawer('drawerProfile')">✕</button></div>
    <div class="drawer-body">
      <div class="cockpit-item">
        <div class="cockpit-label">Background</div>
        <div style="display:flex;justify-content:space-between;align-items:center;gap:8px">
          <span id="bgStatusText" style="font-size:.8rem;color:var(--DIM)">Nenhum</span>
          <label class="sb-act" style="width:32px;height:32px;cursor:pointer"><input type="file" id="bgUploadInput" accept="image/*" style="display:none">⌲</label>
        </div>
      </div>
      <div id="bgThumbPanel"></div>
      <div class="cockpit-item" style="text-align:center">
        <div class="cockpit-label">Ciclo Solar</div>
        <div id="statusSolarMode" style="font-size:1rem;font-weight:900;margin:6px 0;font-family:var(--mono);color:var(--kob-voice-primary)">NIGHT</div>
        <div class="control-row"><button class="btn-block" id="btnCycleSolar">Manual ☀/🌙</button><button class="btn-block" id="btnAutoSolar">Auto 🕒</button></div>
      </div>
      <div class="cockpit-grid">
        <div class="cockpit-item"><div class="cockpit-label">Identificação</div><input type="text" id="inputUserId" class="cockpit-input" placeholder="Viajante"></div>
        <div class="cockpit-item"><div class="cockpit-label">Modelo IA</div><input type="text" id="inputModel" class="cockpit-input" placeholder="google/gemini-2.0-flash-exp"></div>
      </div>
      <div class="cockpit-item" style="border-color:color-mix(in srgb,var(--kob-voice-primary) 40%,transparent)">
        <h4 style="font-family:var(--mono);font-size:11px;color:var(--kob-voice-primary);letter-spacing:.14em;text-transform:uppercase">⚙ Background Engine</h4>
        <div class="panel-section"><label class="section-label"><span>Opacidade</span><span id="val-op">15%</span></label><input id="bgOpacity" type="range" min="0" max="100" value="15" oninput="updateBgAttr('opacity', this.value)"></div>
        <div class="panel-section"><label class="section-label"><span>Blend</span><span>CSS</span></label><select id="bgBlend" onchange="updateBgAttr('blend', this.value)"><option value="normal">Normal</option><option value="multiply">Multiply</option><option value="screen">Screen</option><option value="overlay" selected="">Overlay</option><option value="soft-light">Soft Light</option><option value="luminosity">Luminosity</option></select></div>
        <div class="panel-section"><label class="section-label"><span>Presets</span><span>BG</span></label><div class="preset-grid"><button class="preset-btn" onclick="updateBgAttr('opacity', 0)">0%</button><button class="preset-btn" onclick="updateBgAttr('opacity', 15)">15%</button><button class="preset-btn" onclick="updateBgAttr('opacity', 35)">35%</button><button class="preset-btn" onclick="updateBgAttr('opacity', 60)">60%</button><button class="preset-btn" onclick="updateBgAttr('opacity', 100)">100%</button></div></div>
      </div>
      <div class="cockpit-item">
        <div class="cockpit-label">Backup</div>
        <div class="control-row">
          <button class="btn-block" id="exportState">⬇ EXPORTAR</button>
          <button class="btn-block" id="importState">⬆ IMPORTAR</button>
        </div>
        <button class="btn-block" id="resetAllState" style="width:100%;margin-top:6px;border-color:rgba(255,80,100,.4);color:#ff6b6b">⌦ RESETAR TUDO</button>
      </div>
    </div>
  </div>
`);
