# KOBLLUX — Monólito + Modular

Este ZIP contém duas formas da mesma base:

- `monolith/KOBLLUX-original-monolith.html`: cópia byte a byte do HTML enviado.
- `modular/index.html`: entrada modular com bootloader, CSS separado, scripts separados e fragmentos HTML montáveis.

## Arquitetura modular

- `bootloader.js`: orquestra os grupos.
- `groups/core.js`: estrutura persistente do sistema, incluindo headers, Symbol Bar, overlays e hosts.
- `groups/apps.js`: catálogo das seções `details` encontradas em `section.app`.
- `groups/legacy.js`: scripts originais na ordem de origem.
- `assets/css/`: cada bloco `<style>` original em arquivo separado, na ordem original; IDs e atributos de mídia são preservados nos links gerados.
- `assets/js/`: cada script inline original separado; scripts externos continuam referenciados por URL.
- `fragments/core/`: estrutura base do body em fragmentos.
- `fragments/apps/`: cada seção do app como fragmento independente.

## API

Depois que o bootloader terminar:

```js
KOBModules.list()
KOBModules.mount('sonoroSection')   // monta Soneto
KOBModules.unmount('sonoroSection')
KOBModules.toggle('cortexSection')
KOBModules.mountAll()
KOBModules.unmountAll()
KOBModules.isMounted('sonoroSection')
```

Os botões de módulos também são adicionados à Symbol Bar. O boot inicial monta todos os módulos para reconstruir a experiência completa do monólito. Depois disso, cada seção pode ser montada/desmontada individualmente.

A desmontagem preserva o próprio nó DOM em um `DocumentFragment`, mantendo o estado e os listeners que já foram registrados. Assim, o remount reutiliza o mesmo nó em vez de recriar uma cópia sem eventos.

## Execução

Como os módulos são carregados por `fetch()` e `import`, abra por um servidor HTTP/HTTPS (GitHub Pages funciona). Não abra `modular/index.html` diretamente em `file://`, pois o Safari bloqueia imports/fetch locais.

No GitHub Pages, publique o conteúdo da pasta `modular/` como raiz do site.

## Nota de fidelidade

A versão monolítica original está preservada sem alterações. A modular é uma reconstrução estrutural: o DOM visual foi separado em fragmentos, CSS e scripts foram externalizados e os scripts legados são carregados em ordem. Recursos que dependem de URLs externas continuam dependendo dessas origens.
