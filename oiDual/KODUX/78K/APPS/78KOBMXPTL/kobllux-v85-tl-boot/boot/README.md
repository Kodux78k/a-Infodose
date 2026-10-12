# KobBoot — bootloader de interface

- `boot/kob-boot.js` — runtime (mount / into). Todo elemento injetado recebe `data-boot="nome"`.
- `ui/NN-nome.js` — uma parte da UI = um script. Ordem no `index.html` = ordem no DOM.
- `ui/NN-symbolbar/` — grupo: `00-shell.js` cria `#symbolBar` vazio; cada subgrupo entra com `KobBoot.into('#symbolBar', ...)`:
  grip · actions · mxp · carousel · controls · dock · monolith · btn-art · status
- Mover/remover/reordenar uma parte = mover/remover a linha `<script>` no index.
- `KobBoot.report()` no console lista partes montadas e erros.
