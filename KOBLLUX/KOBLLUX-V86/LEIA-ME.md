# KOBLLUX V86 · State Core

Abra `index.html` no ambiente habitual do KOBLLUX. Para publicar, mantenha o nome `index.html`.

Esta versão preserva as APIs e chaves antigas e sincroniza as seis chaves centrais com `window.KOBState`, inclusive quando um módulo legado escreve diretamente em `localStorage`. O estado observável pode ser consultado com `KOBState.get()` e acompanhado com `KOBState.subscribe((state, meta) => ...)`.

**Atenção:** o pacote é um monólito, mas não é garantidamente offline: recursos externos continuam sendo usados. A validação foi estática; teste player, voz, identidade, tema, Symbol Bar, MXP e restauração de sessões no Safari antes de substituir sua base principal.
