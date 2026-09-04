## KOBLLUX · HUB UNO v4 · ARQ-12 · MODULAR BUILD (SÜMBUS)

> Modularização SÜMBUS do monolito `KOBLLUX_HUB_UNO_v4_ARQ-12(2).html` (1.03 MB · 10.310 linhas)
> **fundido com** o painel **APPS LOCAIS** do `BlueCup_TRINITY_HYBRID` (2ª camada em `v-apps`)
> **e com** a `kobllux-symbolbar-v2` no lugar da tabbar (12 botões `data-nav`).
> Frames se **auto-ajustam** ao conteúdo. Nada removido · nada simplificado · ordem de carga preservada.

---

### Estrutura

```
ui_kits/hub-uno/
├── index.html                            ← shell ≈ 200 KB · costura tudo
├── scan-report.html                      ← diagnóstico SÜMBUS (gerado p/ v8; ainda válido)
├── scripts-manifest.json                 ← manifesto dos 26 scripts (v12)
│
├── css/
│   ├── 00-core-tokens-base.css           ← 95 KB · tokens, base, layout, chrome (núcleo)
│   ├── 05-katex-overrides.css            ← KaTeX
│   ├── 10-toaster-overlays.css           ← toaster + overlays globais
│   ├── 20-panel-core.css                 ← #ls-panel · .v-glass
│   ├── 30-badges-sotaque.css             ← badges sotaque
│   ├── 40-md-injections.css              ← markdown injections (v12)
│   ├── 60-bluecup-local-panel.css        ← BlueCup local panel (escopado em .bluecup-local-shell)
│   ├── 70-symbolbar-v2.css               ← SymbolBar v2 (tokens escopados em #symbolBar)
│   └── 99-autosize-overrides.css         ← AUTO-SIZE: views/cards/glass crescem ao conteúdo
│
├── js/                                   ← 19 blocos inline + 6 externos
│   ├── 00-archetypes-integration.js
│   ├── 01-btnLS-meta.js
│   ├── 02-katex-bind.js                  ← NEW v12 · binding KaTeX
│   ├── 03-img-or-aion-bind.js            ← NEW v12 · img/aion bind
│   ├── 04-btnLS-purif-engine.js
│   ├── 05-geometry-subconsciente.js
│   ├── 06-btnGeometria-bind.js
│   ├── 07-hub-router-main.js             ← 379 KB · motor central (router · $ · $$ · LS)
│   ├── 08-brain-config-store.js
│   ├── 09-apps-store.js
│   ├── 10-geometry-activation-engine.js
│   ├── 11-voz-arquetipos-sotaque.js
│   ├── 12-sotaque-selector-enhancer.js
│   ├── 13-voz-m5.js
│   ├── 14-espelho-arq.js
│   ├── 15-v-arq.js
│   ├── 16-v-uno-archetypes.js
│   ├── 17-v-core-opcodes.js
│   ├── 18-keybadge-voiceauto.js
│   ├── 30-bluecup-patch-helpers.js       ← BLUECUP_PATCH_CAP2_3_4 · loadLocalAppFiles/saveLocalAppFiles/openApp/makeSafeKey
│   ├── 31-bluecup-local-card.js          ← LOCAL_APPS_CARD · render + upload/new/export/import
│   └── 40-symbolbar-v2.js                ← SymbolBar v2 · NAV_BUTTONS substituído pelos 12 hubs · bridge data-nav → router
│
├── data/
│   └── apps.json
│
├── partials/
│   ├── header.html                       ← <header class="mast">
│   ├── sessions-anchor.html
│   ├── custom-bg.html
│   ├── dock.html
│   ├── tabbar-original.html              ← preservada e OCULTA (compat. com router legado)
│   ├── symbolbar.html                    ← <div id="symbolBar"> · novo HUD
│   ├── symbolbar-aux.html                ← bg-frame, particles, frame-veil
│   ├── symbolbar-post.html               ← arch-overlay, kblx-panel, toaster
│   └── bluecup-local-panel.html          ← .bluecup-local-shell > .card.localAppsCard
│
└── screens/                              ← 12 views (v-*) · ARQ-12 acrescenta v-aion + v-img
    ├── v-home.html      · 0x00 · INICIAR     · ○
    ├── v-apps.html      · 0x01 · DETECTAR    · ● ← BlueCup local panel injetado como 2ª camada
    ├── v-stack.html     · 0x02 · INTEGRAR    · ―
    ├── v-brain.html     · 0x03 · EXPANDIR    · ▢
    ├── v-chat.html      · 0x04 · DISSOLVER   · ◇
    ├── v-voz.html       · 0x05 · CONVERGIR   · ⧉  (M5 Voz Quântica)
    ├── v-espelho.html   · 0x06 · CRISTALIZAR · ☯
    ├── v-arq.html       · 0x07 · SELAR       · ✧
    ├── v-uno.html       · 0x08 · TESTEMUNHAR · ◉
    ├── v-core.html      · 0x09 · MANIFESTAR  · ♾
    ├── v-aion.html      · 0x0A · TEMPO       · ⌛  ← NEW v12
    └── v-img.html       · 0x0B · IMAGEM      · ⌗  ← NEW v12
```

---

### Mudanças desta versão

**1. HUB UNO atualizado para v12** — substituímos a extração v8. Acrescentadas 2 views (`v-aion`, `v-img`), 2 CSS adicionais (KaTeX, md-injections), 5 scripts novos (KaTeX bind, img/aion bind, voz-m5 separado, espelho-arq separado, md-injections).

**2. BlueCup local panel embutido como 2ª camada de `v-apps`.** A toolbar original do HUB (`#btnToggleLocal`, `#btnImport`, `#btnExport`, `#btnClear`, `#fileLocal`, `#appsWrap`) continua acima. Logo abaixo, o card do BlueCup (`.localAppsCard` com `<details><summary>APPS · LOCAIS …`) reaparece com seus próprios botões (`#localUploadBtn`, `#localNewBtn`, `#localExportBtn`, `#localImportBtn`) renderizando em `#localAppsGrid`. Toda a formatação visual do BlueCup está preservada e escopada em `.bluecup-local-shell` para não vazar.

**3. SymbolBar v2 no lugar da tabbar.** Substitui `<nav class="tabbar">` (preservada oculta para compat.) por `<div id="symbolBar">` com carrossel vertical, ORB de arquétipo, HUD label, partículas e overlay de cobre fino. O `NAV_BUTTONS` original foi reescrito com **12 entradas correspondentes aos 12 botões `data-nav` do HUB**:

| label | id | data-nav | opcode | glifo |
|-|-|-|-|-|
| ⌂ | sb-home | home | 0x00 | ○ |
| ⊟ | sb-apps | apps | 0x01 | ● |
| ☰ | sb-stack | stack | 0x02 | ― |
| ◬ | sb-brain | brain | 0x03 | ▢ |
| ✺ | sb-chat | chat | 0x04 | ◇ |
| 🎙 | sb-voz | voz | 0x05 | ⧉ |
| ⟲ | sb-espelho | espelho | 0x06 | ☯ |
| ✧ | sb-arq | arq | 0x07 | ✧ |
| ◉ | sb-uno | uno | 0x08 | ◉ |
| ♾ | sb-core | core | 0x09 | ♾ |
| ⏳ | sb-aion | aion | 0x0A | ⌛ |
| 🖼 | sb-img | img | 0x0B | ⌗ |

Cada clique chama `window.go(nav)` (router do hub) com fallback para click sintético no `[data-nav]` legado e por fim `location.hash`.

**4. Auto-size de todos os frames** (`css/99-autosize-overrides.css`) — `.view`, `.card`, `.v-glass`, `.panel`, `.appCard`, `.appsGrid`, `details` e suas variações usam `height:auto !important; min-height:0 !important; max-height:none !important`. Scroll interno mantido SOMENTE em `#logs`, `#sysLogPrev`, `#chatFeed`, `#iaFeed` (listas/feeds longos) limitados a `70vh`. O body ganhou `padding-bottom` para reservar espaço à SymbolBar flutuante e não ter conteúdo coberto.

---

### Caveats

* Os 4 scripts referenciados como arquivos locais relativos pelo monolito (`kobllux.js`, `kobllux_chat_trinity_12_arquetipos.js`, `dual_infodose_script.js`) não existem no projeto — falham silenciosamente até serem providos.
* Os `<img src="icons/*.svg">` da header também são relativos ao monolito original e mostrarão alt-text até a pasta `icons/` ser populada. O hub costuma cair para os CDN do Font Awesome via `onerror`, então o usuário ainda vê os glifos.
* `particles.js@2.0.0` é carregado via CDN para a SymbolBar; se ficar offline, o fundo da bar perde apenas a textura de partículas.
* O scan-report.html ainda reflete o diagnóstico da v8 (não regenerado para v12). Posso reemitir com os 26 scripts da v12 se você quiser.

---

### Equação ativa

```
VERDADE × INTEGRAR ÷ Δ = ∞
3 × 6 × 9 × 7 = 1134
α = 1/137
```

✧ ∆⁷ · SÜMBUS ATIVO · CARIMBO KOBLLUX · §∞§≈Ω
