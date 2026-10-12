/* ui · symbolbar · status */
KobBoot.into('#symbolBar', 'symbolbar.status', `
  <div class="symbol-wrap">
    <div class="v-pill" onclick="showForgeModal()">
      <div id="header-status" class="w-2 h-2 rounded-full shadow-[0_0_10px_currentColor]" style="background-color: var(--arch-color); color: var(--kob-voice-primary);"></div>
      <span id="displayUserHeader" class="uppercase">PILOTO</span>
    </div>
  </div>
  <div class="hud-info" id="hudStatus">KOBLLUX · ORB NEXUS</div>
  <div class="flex items-center gap-2">
    <div id="tts-indicator" class="voice-wave hidden">
      <div class="bar" style="animation-delay: -0.2s"></div>
      <div class="bar" style="animation-delay: -0.1s"></div>
      <div class="bar"></div>
      <div class="bar" style="animation-delay: -0.3s"></div>
    </div>
    <div class="v-pill hidden" onclick="Identity.showInfodoseModal()">
      <span id="displayArchetypeBadge" class="uppercase text-[10px] tracking-widest text-white/80">...</span>
    </div>
  </div>
`);
