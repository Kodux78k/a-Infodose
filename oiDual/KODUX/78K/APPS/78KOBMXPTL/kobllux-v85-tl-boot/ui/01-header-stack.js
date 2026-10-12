/* ui · header-stack */
KobBoot.mount('header-stack', `
  <div class="header-stack">
    <header class="sys-topbar" id="system-topbar">
      <button class="icon-btn" id="menuBtn" aria-label="Menu">☰</button>
      <div class="sys-brand"><span class="brand-dot"></span>A.<strong style="color:var(--kob-voice-primary);font-weight:900">INFODOSE</strong></div>
      <div class="sys-actions">
        <button class="icon-btn theme-dot" id="themeToggle" data-dual-target="" data-dual-action="theme:toggle" aria-label="Tema"></button>
        <button class="icon-btn" id="notifBtn" data-dual-target="" data-dual-action="notif:open" aria-label="Notificações">♧</button>
      </div>
    </header>
  </div>
`);
