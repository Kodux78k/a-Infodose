# KXT × GLOBAL — fusão (versão modular)

Este `index.html` é o **seu** `Kxt-final-v2-globalFusi-mod.html`, sem alterações. Ele carrega, via `boot.js`:

```
boot.js        bootloader (+ shim: localStorage bloqueado → memória, KXT_ready, markdown de fallback)
css/           base · tokens · ambient · card · layout · chat · cockpit
tpl/           icons · ambient · card · solarbtn · topbar · chat · cockpit   (HTML criado via JS, montado nas <div data-kxt>)
js/            orb · app · card-core · di-override · card-fix · bg-thumbs · bridge · usage · tts · text-beauty · list-beauty · solar-patch
```

Mantenha a pasta inteira junta (abre direto em `file://` ou sirva com `python3 -m http.server`).

Diferenças em relação aos módulos que você tinha:
- `js/app.js` agora expõe `window.App = App` (antes `window.App` era `undefined`: ler a última resposta no TTS, migrar o background antigo etc. falhavam em silêncio).
- `tpl/card.js` não cria mais um 2º `#toasterWrap` (o do seu global já existia → ID duplicado).

Para um único arquivo, use `Kxt-final-v2-globalFusi-MONOLITO.html`.
