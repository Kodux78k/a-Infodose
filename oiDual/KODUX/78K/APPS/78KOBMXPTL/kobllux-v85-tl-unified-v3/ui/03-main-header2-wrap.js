/* ui · main-header2-wrap */
KobBoot.mount('main-header2-wrap', `
  <div class="sn-scope" id="main-header2-wrap">
    <header class="topbarX header-visible" id="main-header2" data-kob-id="header2">
      <button type="button" class="hd2-b cockpit-btn" data-snc="cockpit" title="Cockpit sonoro (BPM · escala · timbre · reverb)" aria-label="Cockpit sonoro">⚙</button> 

      <button type="button" class="badgeX hd2-title" id="hd2Title" title="Arquivo ativo"><span class="hd2-short" id="hd2Short">KOBLLUX</span><span class="hd2-full" id="hd2Full"></span><span class="hd2-holo" id="hd2Holo"><i class="hm"></i><i class="ht"></i><b class="ha"></b></span></button>
    <!-- <div class="hd2-btns">
      <button type="button" class="hd2-b" data-action="import" data-file="f1" title="Importar → SEMENTE">🌱</button>
      <button type="button" class="hd2-b" data-action="import" data-file="f2" title="Importar → ESPELHO">🪞</button>
      <button type="button" class="hd2-b" data-snc="fractalMerge" title="Fusão fractal 369">⊕</button>
      <button type="button" class="hd2-b" data-action="play-sonoro" title="Soneto ▶ (trilha do texto)">🎵</button>
      <button type="button" class="hd2-b" data-snc="cockpit" title="Cockpit sonoro (BPM · escala · timbre · reverb)">⚙</button>
    </div> -->
      <div class="hd2-btns output-controls bota1">

        <!-- Copiar -->
        <button type="button" class="hd2-b output-control primary" data-action="copy-result" title="Copiar resultado" aria-label="Copiar resultado">⧉</button>

        <!-- Download -->
        <button type="button" class="hd2-b output-control" data-action="download-result" title="Baixar TXT" aria-label="Baixar TXT">↓</button>

        <!-- Ouvir -->
        <button type="button" class="hd2-b output-control tts-btn" id="ttsBtnTop" data-action="toggle-tts" title="Ouvir resultado" aria-label="Ouvir resultado">▷</button>

        <!-- Musical -->
        <button type="button" class="hd2-b output-control music-btn" id="musicBtnTop" data-action="play-sonoro" title="Sintetizar melodia" aria-label="Sintetizar melodia">🎵</button>

      </div>

      <!-- Tema -->
      <button id="theme-dot2" class="theme-dot" type="button" aria-label="Alternar tema" title="Alternar tema">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px;">
          <circle cx="12" cy="12" r="5"></circle>
          <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"></path>
        </svg>
      </button>

    </header>
  </div>
`);
