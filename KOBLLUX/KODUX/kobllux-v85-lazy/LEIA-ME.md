# KOBLLUX V85 · lazy-local

Alterações sobre `index-v85-mod.html` (nada além disto foi tocado):
1. `<script src="./vendor/Tone.js">` removido do carregamento inicial.
2. Delivery Registry (`KOB_DELIVERY`) no módulo kob-perf: `load('tone'|'pdfjs')`, local primeiro, CDN como alternativa, 1 carga por lib, retry se falhar.
3. `startSonoroPlayback()` carrega o Tone no 1º play; o `pointerdown` nos botões de som já inicia a carga.
4. `KOBLoadPDF` mantém o contrato, agora local-first.
5. `sw.js` registrado (só http/https): pré-cache de shell/vendor + cache em runtime dos hosts infodose/github.io/cdnjs/fonts.

Deploy: publique a pasta inteira (mesmo nível: index-v85-lazy.html, sw.js, vendor/).
Para PDF offline: `sh tools/fetch-vendor.sh` (precisa de internet) e publique `vendor/pdfjs/`.
Suba `VERSION` em sw.js a cada release.

Não testado em Safari/iPhone (player, TTS, Soneto, Reader PDF).
