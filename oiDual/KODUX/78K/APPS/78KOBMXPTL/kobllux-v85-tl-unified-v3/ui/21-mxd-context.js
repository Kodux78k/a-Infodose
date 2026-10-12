/* ui · mxd-context */
KobBoot.mount('mxd-context', `
  <div id="mxd-context">
    <div class="ctx-head" id="mxd-ctx-head">BOTÃO</div>
    <button data-context-action="fire"><span>▶</span> Disparar</button>
    <button data-context-action="duplicate"><span>＋</span> Duplicar aqui</button>
    <button data-context-action="unbind"><span>✂</span> Desvincular</button>
    <button data-context-action="favorite"><span>★</span> Nova session</button>
    <button data-context-action="remove" class="ctx-danger"><span>⌫</span> Remover</button>
  </div>
`);
