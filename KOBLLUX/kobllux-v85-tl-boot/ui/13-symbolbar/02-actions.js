/* ui · symbolbar · actions */
KobBoot.into('#symbolBar', 'symbolbar.actions', `
  <div class="sb-extras">
    <button class="sb-act" id="sbSpeak" title="Ouvir">▶</button>
    <button class="sb-act" id="sbStop" title="Parar">■</button>
    <button class="sb-act" id="sbCopy" title="Copiar">⧉</button>
    <button class="sb-act danger" id="sbClear" title="Limpar">×</button>
    <button style="grid-column:1/-1; aspect-ratio:auto; height:20px; font-size:10px; min-width:39px;" class="sb-actwide" id="sbDownload" title="Baixar">↓</button>
  </div>
`);
