# 78TL_v2 · modularização
- Origem: monolith.html (284.915 bytes) → 3 CSS, 43 JS, marcação em html/markup.html, index.html com a ordem original.
- Round-trip: reinserindo os arquivos no index, o resultado é byte-idêntico ao monolith.html (verificado antes das duas correções abaixo).
- script-20: `import` em <script> clássico (SyntaxError, nunca rodava) → agora <script type="module"> com import dinâmico protegido. O arquivo js/patches/MAP_RGX_v3_KOBLLUX.mjs NÃO veio no upload: sem ele o engine RGX segue desativado (aviso no console).
- script-42: `import "https://www.infodose.com.br/js/main.js"` (mesmo erro) → import desativado e comentado; os console.log continuam. Reativar executa código remoto, que nunca rodou nesta versão.
- js/kob-bridge.js (novo): carrega PDF.js sob demanda quando um .pdf é escolhido (o script-18 só lia PDF se pdfjsLib já existisse).
- Dependência externa restante: KaTeX via cdn.jsdelivr.net (carregado em runtime).
- Não gerei bundle.js: os scripts são independentes e um erro em um não pode derrubar os demais.
- Não testado em navegador.
