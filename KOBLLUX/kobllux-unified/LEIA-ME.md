# KOBLLUX · fusão unificada (V85 lazy-local + 78TL)

index.html      shell KOBLLUX V85 (Tone/PDF.js sob demanda) + botão "ABRIR 78TL" no Cockpit (também KOB_78TL.open())
tl/             78TL_v2 modularizado (css/, js/, html/, index.html; monolith.html = original de referência)
sw.js           offline: shell, vendor e tl/ em cache (suba VERSION a cada release)
vendor/         Tone.js local; vendor/pdfjs/ via `sh tools/fetch-vendor.sh` (precisa de internet)

Integração: o 78TL roda isolado em iframe (globais, IDs e CSS não colidem). Compartilham localStorage (mesma origem)
e o registro de PDF.js (KOB_DELIVERY). Fusão no nível de código (TTS único, temas únicos) NÃO foi feita.
Publique a pasta inteira. Não testado em navegador/Safari.
