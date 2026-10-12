/* ui · global-player */
KobBoot.mount('global-player', `
  <div id="global-player" class="v-glass overflow-hidden">
    <div class="absolute top-3 right-3 z-20 flex gap-2">
      <button onclick="Player.minimize()" class="w-8 h-8 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center hover:bg-white/20 transition border border-white/5"><i class="w-3 h-3 text-white ico" style="font-size:.75rem" aria-hidden="true">−</i></button>
      <button onclick="Player.expand()" id="player-expand-btn" class="w-8 h-8 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center hover:bg-[var(--active-color)]/40 transition border border-white/5"><i class="w-3 h-3 text-white ico" style="font-size:.75rem" aria-hidden="true">⤢</i></button>
      <button onclick="Player.stop()" class="w-8 h-8 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center hover:bg-red-500/30 transition border border-white/5"><i class="w-3 h-3 text-white ico" style="font-size:.75rem" aria-hidden="true">✕</i></button>
    </div>
    <div id="player-frame-wrap" class="w-full h-full bg-black"></div>
  </div>
`);
