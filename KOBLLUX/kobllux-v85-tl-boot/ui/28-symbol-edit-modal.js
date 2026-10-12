/* ui · symbol-edit-modal */
KobBoot.mount('symbol-edit-modal', `
  <div id="symbol-edit-modal" role="dialog" aria-modal="true" aria-labelledby="symbolModalTitle">
    <div class="modal-card">
      <h2 id="symbolModalTitle">⚙ Editar Symbol Bar<button class="close-modal" id="closeSymbolModal" type="button" aria-label="Fechar">✕</button></h2>
      <div id="symbol-edit-list"></div>
      <div class="add-btn-area">
        <input id="newSymbolUrl" placeholder="URL ou arquivo (https://… / app.html)" autocomplete="off" spellcheck="false">
        <input id="newSymbolLabel" placeholder="Rótulo" autocomplete="off">
        <input id="newSymbolIcon" placeholder="Ícone" maxlength="4" autocomplete="off" title="Glifo do botão (opcional)">
        <button class="sbx-mbtn primary" id="addSymbolBtn" type="button">Adicionar</button>
      </div>
      <div class="sbx-mrow">
        <button class="sbx-mbtn" id="resetSymbolsBtn" type="button">↺ Restaurar padrão</button>
        <button class="sbx-mbtn" id="closeSymbolModalBtn" type="button" style="margin-left:auto">Fechar</button>
      </div>
    </div>
  </div>
`);
