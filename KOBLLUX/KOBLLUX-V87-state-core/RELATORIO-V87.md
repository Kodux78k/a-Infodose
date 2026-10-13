# KOBLLUX V87 · State Core integrado

## Base
- Arquivo de origem: `KOBLLUX-V86-in-[archz].html` (fornecido nesta conversa).
- Saída: `index.html` monolítico.
- Tamanho: 1,786,364 bytes.
- SHA-256: `8f77acf784791b04c03438cb4bda801dabcc765e27e6a6ac5c9d377fb0dde2b2`.

## Mudanças
1. Atualizado `KOBState` para V87, preservando as seis chaves anteriores e incluindo `di_activeArchetype`.
2. Adicionada API `KOBState.setArchetype()` para escrita explícita do arquétipo sem mudar o formato legado (ex.: `ATLAS`).
3. Adicionado histórico persistente independente em `kob:history:v1`, limitado aos 500 itens mais recentes, com `history.add()`, `history.list()`, `history.count()` e `history.clear()`.
4. Conectado o `pushMessage()` existente ao histórico persistente sem substituir seu renderizador local.
5. Adicionada observação de eventos reais `playing`, `pause`, `ended` e `emptied` em elementos HTML audio/video. Players/Tone que não usem elementos de mídia podem informar estado via `KOBState.setAudio(...)`.
6. Mantida a interceptação de `localStorage.setItem/removeItem/clear` para sincronizar gravações legadas das chaves centrais.

## Verificação estática
- Scripts inline verificados com `node --check`: 32.
- Erros de sintaxe encontrados: 0.
- Substituição do bridge: 1; integração de `pushMessage`: 1.

## Limites conhecidos
- Não foi realizado teste de execução real no Safari/iPhone nesta geração.
- O estado de áudio automático cobre elementos HTML `<audio>`/`<video>`; para Tone.js/Web Audio, o módulo de player deve chamar `KOBState.setAudio({ playing: true/false, source: 'tone' })` nos eventos reais do motor.
- Histórico persistente guarda os itens que passam pelo `pushMessage()` encontrado nesta base. Outras conversas/módulos não são automaticamente capturados se usarem outros renderizadores.
- O HTML continua usando dependências e recursos externos existentes; não é uma garantia de operação totalmente offline.
- O campo `di_conversation` não foi reaproveitado para histórico, para evitar alterar seu formato legado.
