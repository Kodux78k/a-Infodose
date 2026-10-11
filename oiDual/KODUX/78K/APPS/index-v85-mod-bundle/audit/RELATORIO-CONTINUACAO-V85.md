# KOBLLUX V85 · Continuação — mapa de fronteiras e pacote modular controlado

## O que foi alterado

A variante modular preserva o HTML e a ordem dos módulos da V85 consolidada. A única extração executada nesta etapa é o payload de **Tone.js**, retirado do HTML e colocado em `vendor/Tone.js`. A chamada externa ocupa o mesmo ponto do documento e permanece síncrona (sem `async` ou `defer`), para não inverter a sequência com o motor Sonoro que aparece depois.

- HTML de entrada: 1,746,923 bytes
- HTML modular: 1,397,768 bytes
- Redução no HTML: 349,155 bytes
- Tone.js separado: 349,169 bytes
- Blocos CSS mantidos no documento: 27
- Scripts no HTML modular: 32

**Importante:** isto reduz o peso do arquivo HTML, mas não reduz por si só o total de bytes transferidos nem a memória de execução do Tone.js. A vantagem é separar o vendor, permitir cache próprio e preparar uma extração/lazy-load posterior. A carga do Tone continua no mesmo ponto e não foi convertida em lazy-load.

## Mapa de fronteiras

Veja `api-boundaries.csv` para os contratos mais sensíveis e os motivos para não movê-los às cegas.

- **Manter globais estáveis:** `KBLX_TOAST`, `KBLX_SAVE`, `__bgApply`, `__bgState`, `di_getBgImages`, `di_saveBgImages`, `di_applyBackground`, `KOBLoadPDF`, `toggleVoice`, `toggleDrawer`.
- **Não extrair como bloco único ainda:** `SymbolBar`, `MXP`, `.session-window`. As referências são muito distribuídas entre DOM, CSS e scripts; é necessário mapear cada ponto de entrada e os eventos de inicialização.
- **Orbe:** a duplicação byte-a-byte do gerador foi removida na fase 1, mantendo a primeira implementação e os aliases globais.
- **Identidade/UI:** `updateInterface` mantém as duas implementações não equivalentes. Não unificar apenas pelo nome.
- **PDF:** `KOBLoadPDF` já é um carregador sob demanda de PDF.js; mantê-lo separado do fluxo inicial é o contrato correto.
- **Áudio:** Tone.js é um payload de fornecedor; o motor Sonoro o utiliza mais adiante. A separação aqui mantém a posição de execução, sem afirmar que o player foi testado no Safari.

## Ordem e riscos

1. O HTML continua a ser a fonte da ordem de inicialização.
2. `vendor/Tone.js` é carregado exatamente no local onde o bundle inline estava.
3. Os 27 blocos de CSS permanecem inline para não alterar cascata, prioridade de carregamento ou flash visual nesta fase.
4. Os demais scripts e serviços não foram movidos.

## Validação executada

- Extração do payload Tone.js: exatamente 1 bloco encontrado e extraído.
- Verificação estrutural do HTML modular: 27 blocos CSS preservados; 32 tags de script.
- `node --check` de `vendor/Tone.js`: executada separadamente após o empacotamento.
- Teste real no Safari/iPhone de player, TTS, identidade, tema, Symbol Bar, MXP e restauração de sessões: **não executado**.

## Como usar

Descompacte o ZIP mantendo a estrutura de pastas e abra/publique `index.html` junto com `vendor/Tone.js`. Para uso em GitHub Pages, publique a pasta inteira. O HTML monolítico `KOBLLUX-V85-8704.html` continua disponível como fallback independente.
