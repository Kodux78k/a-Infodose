/* ui · fab */
KobBoot.mount('fab', `
  <div id="fab"><div class="menu">
      <button class="btn" data-action="home">Home</button>
      <button class="btn" data-action="back">Voltar</button>
      <button class="btn" id="btn-tts" data-action="tts">Voz: Off</button>
      <button class="btn" id="btn-tts-sel" data-action="tts-sel">Ler seleção</button>
      <button class="btn" id="btn-tts-stop" data-action="tts-stop">Parar voz</button>
      <button class="btn" data-action="demo">Gerar Demo</button>
      <button class="btn" id="btn-imp" data-action="importar">Auto‑Gerar</button>
      <button class="btn" id="btn-md" data-action="md">Exportar .md</button>
      <button class="btn" id="btn-pdf" data-action="pdf">Imprimir (PDF)</button>
      <button class="btn" id="btn-theme" data-action="theme">Tema: Blue‑1</button>
      <button class="btn" id="btn-reading" data-action="reading">Modo Leitura</button>
    </div><button class="fab-btn" id="fab-toggle">＋</button></div>
`);
