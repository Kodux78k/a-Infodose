# KOBLLUX · upgrade fases 2–6

Ordem de instalação (já feita nos HTML prontos): fase2 → fase3 → fase4 → fase5 → fase6, no fim do <body>.

| Arquivo | O que faz |
|---|---|
| fase2-hooks.js | KOB.override / KOB.run / KOB.hookFn · applyArch canônico vira hook (arch:before/after) · session:create, tts:voice, ui:before · kill-switch por id · safe mode (?safe=1) |
| fase3-boot.js | KOB.register/boot (topo-sort, ciclo detectado, fases init→mount→hydrate) · KOB.store (get/set/on) · adaptadores dos módulos legados |
| fase4-webcomponents.js | kob-orb, kob-archetype-switch, kob-symbol-bar, kob-cockpit, kob-tts-toolbar · Shadow DOM · bus kob:* · ponte única para o legado |
| fase5-lazy.js | KOB.lazy (tone, pdf, voices) · Tone: inline → vendor/Tone.js → CDN · aquecimento por intenção · hooks com {needs:[...]} |
| fase6-perf-doctor.js | KOB.perf.report/cssCoverage/archRules/deferStyles/contain · KOB.doctor() |
| assemble.py | injeta as fases num monólito; --split-tone move o Tone (340 KB) para vendor/Tone.js |

HTML prontos: `KOBLLUX-MXDB-DATAS.upgraded.html` (arquivo único) e `...upgraded-lite.html` (+ `vendor/Tone.js`, ~340 KB a menos).

## Como usar no console
- `KOB.doctor()` — tabela de hooks, módulos, store e lazy.
- `KOB.enable('arch.sync-voice', false)` — desliga um override (persistido). `KOB.module('glass', false)` — desliga módulo.
- `?safe=1` na URL (ou `KOB.setSafe(true)`) — só overrides/módulos `core` rodam.
- `KOB.store.set('arch','NOVA')` — troca arquétipo pelo único escritor (applyArch).
- `KOB.perf.cssCoverage()` e `KOB.perf.archRules()` — mostram onde podar CSS e quais das 125 regras por arquétipo viram variáveis.

## Limites conhecidos
- Testado em Node com stubs (hooks, reentrância, kill-switch, store, topo-sort, lazy). NÃO testado em navegador real: abra o HTML e rode KOB.doctor().
- `updateInterface` está dentro de closures no monólito: o hook `ui:before` só pega se ela for exposta em window.
- Web components convivem com o DOM legado (#sbOrb, #symbolBar…), não o substituem. Teste: `<kob-orb></kob-orb><kob-archetype-switch></kob-archetype-switch>`.
- content-visibility só em `details.section:not([open])`; `contain` em session-window é opt-in (KOB.perf.contain).
