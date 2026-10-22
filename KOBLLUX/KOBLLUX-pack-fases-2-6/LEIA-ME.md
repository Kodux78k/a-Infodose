# KOBLLUX · pack upgrade (fases 2–6)

## monolitico/  — arquivo único
- `KOBLLUX-MXDB-DATAS.upgraded.html` — tudo embutido (inclui Tone.js e as 6 fases).
- `KOBLLUX-MXDB-DATAS.upgraded-lite.html` — igual, sem o Tone inline; precisa de `vendor/Tone.js` ao lado (cai no CDN se faltar).
- Ambos já contêm o patch V86 (`kob-v86-patch-js`) que está no seu arquivo, antes das fases.

## modular/  — mesmo sistema, um arquivo por bloco
- `index.html` — o monólito com cada `<script>/<style>` trocado por `<script src>` / `<link>` **no mesmo ponto**.
  Ordem de execução e de cascata idênticas ao monólito. Atributos (id, data-*, type=module) preservados.
- `js/NNN-nome.js` (43) e `css/NNN-nome.css` (33): NNN = ordem original. O nome vem de `data-kodux-source` / `data-inlined-from` / id.
  Primeira linha de cada arquivo: `/* @kob-mod NNN · nome · head|body · fonte */`.
- `vendor/Tone.js` — o bloco `kob-tone-inline` (a tag fica no lugar, vazia, com `data-src`).
- `manifest.json` — tabela de módulos (ordem, arquivo, bytes, fonte).
- `build.py` — `split` / `join` / `check` / `css-report`.
  - `python3 build.py join modular/ saida.html` reconstrói o monólito (testado: **idêntico byte a byte** ao upgraded.html).
  - Edite os arquivos soltos e rode `join` quando quiser gerar o monólito de novo.
- `index.bundle.html` + `css/kob.bundle.css` — **experimental**: 1 CSS só (ver abaixo).

**Rodar o modular:** sirva por http (`python3 -m http.server`, GitHub Pages…). Em `file://` os 3 scripts `type=module`
e a leitura de CSS (`KOB.perf.cssCoverage`) são bloqueados pelo navegador.

## Bootloader?
Não coloquei um carregador dinâmico para os scripts legados: `<script src>` síncrono já executa em ordem exata,
enquanto um loader roda depois do parse e faria sumir listeners de DOMContentLoaded e atrasaria o primeiro paint.
O "bootloader" útil já existe: `KOB.boot()` (fase 3) para módulos novos e `KOB.lazy` (fase 5) para Tone/PDF/vozes.

## CSS grande (unificar?)
`009-tokens-kblx-core-arch-rules.css` (165 KB) e `007-orb-core-blobs.css` (78 KB) são os maiores. Medido: só ~16 KB (3%) de
regras são duplicatas EXATAS (12 KB delas no 007). Juntar tudo num arquivo não reduz bytes, só requisições.
`index.bundle.html` usa `css/kob.bundle.css` (mesma ordem, duplicatas exatas anteriores removidas). Não foi validado visualmente:
compare lado a lado com `index.html` antes de adotar. O ganho grande está nas 125 regras por arquétipo
(`KOB.perf.archRules()` → converter para variáveis).

## fases/
`fase2…fase6.js` soltos + `assemble.py` (injeta no monólito; `--split-tone` gera a versão lite).
Correção desta versão: o `<style>` da fase 6 usava o mesmo id `kob-perf-css` de um estilo já existente; agora é `kob-perf-css-v2`.
