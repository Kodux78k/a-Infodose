/* ui · misc-modal-overlay */
KobBoot.mount('misc-modal-overlay', `
  <div id="modal-overlay" class="fixed inset-0 z-[200] hidden flex items-center justify-center p-4">
    <div id="modal-content" class="v-glass p-6 w-full max-w-2xl max-h-[85vh] overflow-y-auto transform scale-95 opacity-0 cortex-scroll"></div>
  </div>
  <div id="di_toast" aria-live="polite" class="fixed top-28 left-1/2 -translate-x-1/2 z-[300] pointer-events-none flex flex-col items-center gap-2"></div>

  <!-- ARCH OVERLAY + BAULITE -->
  <div id="arch-overlay"><div class="arch-wheel" id="archWheel"><div class="arch-wheel-title">∆³ · Segure o ORB</div></div></div>
  <div id="baulite-container"><div class="baulite-root"><div class="bl-head"><div><div class="bl-title">∆³ · BAÚ LITE</div><div class="bl-sub">CICLO · TOKENS · MENSAGENS</div></div><button class="bl-close" id="blClose">✕</button></div><div class="bl-tree" id="blTree"><div class="empty">Gere a conversa — o Baú se alimenta do motor.</div></div></div></div>

  <!-- DRAWER · COCKPIT -->
  <div style="z-index:5" id="drawerOverlay" class="drawer-overlay" onclick="toggleDrawer('drawerProfile')"></div>
`);
