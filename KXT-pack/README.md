# KXT Final v2 — pacote

```
KXT-pack/
├─ monolith/Kxt-final-v2.html   ← tudo em 1 arquivo (abre e roda)
└─ modular/                     ← o MESMO app, partido em módulos + bootloader
   ├─ index.html                ← só os nomes das divs: <div data-kxt="card"></div> ...
   ├─ boot.js                   ← bootloader (+ shim de robustez)
   ├─ css/   base · tokens · ambient · card · layout · chat · cockpit
   ├─ tpl/   icons · ambient · card · solarbtn · topbar · chat · cockpit   (HTML criado via JS)
   └─ js/    orb · app · card-core · di-override · card-fix · bg-thumbs · bridge · usage · tts · text-beauty · list-beauty · solar-patch
```

## Como o bootloader funciona
1. Lê as `<div data-kxt="...">` do `index.html` (só o nome do módulo).
2. Injeta o CSS de cada módulo (`css/*.css`), na ordem.
3. Para cada div: carrega `tpl/<nome>.js` (o HTML do módulo como string) e monta dentro dela.
4. Carrega os scripts de `js/` **em sequência** (a ordem dos scripts deixa de ser um risco).
5. Só depois dispara `App.init()` e cia. (`KXT_flush`). Se um módulo falhar, o boot continua e loga `[KXT boot] falhou: ...`.

| div `data-kxt` | o que monta |
|---|---|
| `icons` | sprite de ícones SVG |
| `ambient` | background fake, partículas, sky e os **2 blobs** |
| `card` | card, cofre de chaves, toaster |
| `solarbtn` | só o botãozinho do sol (abre o cockpit) |
| `topbar` | engrenagem, deck, cristalizar, nome |
| `chat` | conversa, campo de envio, deck |
| `cockpit` | Solar · Neural · Uso · Identidade · Background · Sistema |

**Adicionar um módulo:** crie `tpl/meu.js` (`KXT.tpl["meu"] = "<div>…</div>";`), ponha `<div data-kxt="meu"></div>` no `index.html` e inclua `"meu"` em `CFG.dom` (e CSS/JS em `CFG.css`/`CFG.js`) no `boot.js`.

**Rodar:** abra `modular/index.html` (usa `<script>`/`<link>` clássicos, sem `import()`/`fetch`, então funciona até em `file://`) ou sirva a pasta (`python3 -m http.server`). Mantenha a pasta inteira junta.

## O que mudou nesta versão
- **Cockpit em vidro** (`backdrop-filter`), sem fundos sólidos, no estilo do card · abas mantidas + aba **📊 Uso**.
- **Painel de Uso:** respostas, tokens (↑ enviados / ↓ recebidos), custo (grátis × pago, pelo preço do OpenRouter), modelo mais usado, "memória da conversa" vs. limite do modelo, últimas respostas com tempo e erros, "O que é um token?", exportar/limpar. Se a API não informa tokens, estima e avisa.
- **🔊/🔇 no topo:** liga/desliga TODA a voz (App, card, patches). Segurar = ouvir a última resposta. Salvo entre sessões.
- **Blobs:** 2 blobs (cor primária/secundária do usuário), bem mais suaves (12%), com slider em Background.
- **Removida** a opção "viewport 200% / cover" do patch: gravava `data-bg-mode` e nenhum CSS reagia a ele.
- **Preview local que não funcionava:** o parser travava em `<script src>` síncronos (particles, marked, html2pdf) e na fonte do Google, e o App só iniciava no `window.onload`; em preview sandbox o `localStorage` lança erro. Agora: CDNs/fonte assíncronos, init no DOM pronto, cada passo do `init` isolado, `localStorage` bloqueado cai pra memória, `marked` ausente usa markdown de fallback.
