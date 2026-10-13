# KOBLLUX V86 · State Core compatível

## Entrega
- `index.html`: monólito único, com Tone.js inline e sem dependência local `./vendor/Tone.js`.
- `LEIA-ME.md`: instruções e limites.

## Alteração arquitetural
- Mantém as chaves legadas (`di_userName`, `di_assistantName`, `di_modelName`, `di_infodoseName`, `di_conversation`, `infodoseTheme`).
- `KOBState` agora recebe também escritas feitas pelos módulos antigos via `localStorage.setItem`, `removeItem` e `clear`, emitindo `kob:statechange`.
- Escritas feitas pelo próprio `KOBState` são protegidas contra recursão.
- Preserva controladores, seletores e APIs existentes; não migra módulos em massa.

## Verificações estáticas
- HTML: 1753426 bytes
- SHA-256: `8efe8e7630cbc6345feb69f5b607ac1cd38f79a00272120bfa7535d0a9d3b321`
- Scripts inline encontrados/verificados com `node --check`: 31
- Erros de sintaxe nos scripts inline: 0
- Referências locais `./vendor/Tone.js` restantes: 0
- `KOBState` com sincronização legada: sim

## Limites importantes
- Verificação estática, não teste de execução no Safari/iPhone.
- Sincronização cobre apenas as seis chaves explicitadas no contrato `KOBState`; outras chaves legadas permanecem sob seus controladores atuais.
- O hook é instalado em `Storage.prototype`, com guarda de recursão. Se outro script posteriormente substituir esses métodos, a integração poderá ser sobreposta.
- Ainda há serviços, fontes, imagens e scripts externos; esta edição não prova funcionamento totalmente offline.
- Não altera nem apaga dados já salvos pelo usuário.
