# KOBLLUX V85 · build otimizado

## Alterações aplicadas
- `index.html`: scripts clássicos do body agora usam `defer`, preservando a ordem das tags e os pontos de montagem do `KobBoot`.
- CSS contíguo agrupado em `css/bundle-base.css`, `css/bundle-fusion.css`, `css/bundle-feature.css` e `css/bundle-tl.css`; a ordem das regras originais foi preservada dentro de cada grupo. Os arquivos-fonte individuais continuam no ZIP.
- Removida a tag eager de `vendor/Tone.js`: `KOB_DELIVERY`/`KOBLoadTone` continua responsável pelo carregamento sob demanda, local primeiro e CDN como fallback.
- PDF.js é solicitado no momento em que um PDF é escolhido no importador, através de `KOBLoadPDF`; a rotina de captura evita que o antigo handler processe o mesmo PDF em duplicidade.
- Adicionados `sw.js`, `pwa/manifest.json` e `icon-192.png`, que eram referenciados mas não estavam no ZIP recebido.
- Service Worker agora pré-armazena o shell e guarda recursos same-origin conforme são solicitados, em vez de forçar o download de todos os módulos no install.
- `precache.json` representa o shell mínimo.

## Mantido
- IDs e APIs globais existentes; nomes e conteúdos dos módulos originais continuam presentes.
- Ordem das tags de scripts no HTML; módulos ES continuam como módulos.
- Os arquivos CSS/JS de origem continuam no pacote para edição e comparação.

## Limites verificados
- Não concatenei JavaScript: vários módulos usam escopo global/lexical e há dependências entre inicializadores; concatenar sem análise de dependências poderia quebrar o runtime.
- Os 43 scripts TL e os componentes UI ainda são solicitados durante a abertura, embora os scripts clássicos deixem de bloquear a análise do HTML. Só Tone.js e PDF.js foram colocados em carregamento sob demanda com segurança observável neste pacote.
- `js/tl/script-20.js` tenta carregar `./js/patches/MAP_RGX_v3_KOBLLUX.mjs`, mas esse arquivo não existe no ZIP recebido. A importação agora falha de forma controlada e não impede o restante do runtime; para reativar essa camada, recupere o módulo original da fonte correta. Não inventei uma implementação substituta.
- A URL remota `https://www.infodose.com.br/js/main.js` importada por `js/tl/script-42.js` continua remota e requer rede se não estiver disponível por outro mecanismo.

## Testes executados
- Integridade ZIP e existência de recursos locais referenciados no HTML.
- Conferência de arquivos de precache e geração dos quatro bundles CSS.
- Não foi executado um teste de navegador real; valide em GitHub Pages/Infodose e teste áudio, importação PDF, SymbolBar, iFSw e modo offline antes de substituir a versão publicada.
