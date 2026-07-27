# Plano de Unificação · KOBLLUX 78K

Resposta direta à pergunta: **melhor montar o plano antes de executar.** Não porque a tarefa seja impossível, mas porque são 5 arquivos monolíticos (~9.700 linhas somadas + os ~2.060 do 78K que já entreguei) com namespaces globais e IDs que colidem de verdade. Fazer merge cego agora reproduziria exatamente os bugs que você já mapeou no histórico (IDs duplicados, scripts duplicados, `const` redeclarado, corrida de inicialização). Um round de mapeamento resolve isso barato.

---

## 1. Inventário

| Arquivo | Papel | Linhas | Namespace global | Observação |
|---|---|---|---|---|
| `78Frames...OEM-v2-OAi` (+ 78K já injetado) | App principal (Fusor/Forja/Visão/Sigilo/Build/**78K**) | ~2.060 | `App`, `Fusor`, `TextForge`, `ImageForge`, `SigilEngine`, `Packer`, `Motor78K` | Base atual. |
| `78Frames-ASCII-mini-OEM-v4-modes` | Fusor **compacto**, sem seleção de arquétipo, com `data-theme` claro/escuro | 1.444 | funções soltas (sem `window.X` próprio) | Usa as **mesmas chaves** de localStorage (`fractal_ultimo`, `fractal_t2`) → boa notícia, já é interoperável na camada de dados. |
| `K8X_fractal_369_motor` | Motor Fusor **dual** com arquétipos | 2.380 | `window.KOBLLUX_ARCHETYPES`, `window.KOBLLUX` | Já conhecido. |
| `SVG-STUDIO-o0rb` | Estúdio de SVG + Orb 3D, 4 abas (Visualizar/Gerar/ORB/Biblioteca) | 1.656 | `window.KODUX` (bridge), `makeOrbAvatar`, `makeMiniAvatar` | Sistema de abas simples (`.tab` / `.tab-content` + `data-tab`), diferente do `App.navigate` do app principal. |
| `78NP` ("Nebula Pro — Listen to PDFs") | Leitor de PDF com TTS, cápsulas de voz por arquétipo | 3.093 | `window.ARCHETYPES`, `window.KOBLLUX_VOICES`, `window.NEBULA_ARCH`, `window.BottomSheet` | **Carrega ~15 scripts externos ao vivo** (pdf.js, jszip, tesseract.js, lucide, particles.js + vários módulos hospedados em `kodux78k.github.io/oiDual--Y-/...`). Não é um monólito autocontido como os outros. |

## 2. Colisões reais encontradas

- **Arquétipos duplicados com schemas diferentes**: `KOBLLUX_ARCHETYPES` (K8X) vs `ARCHETYPES`/`NEBULA_ARCH` (Nebula) vs o roster de 41 arquétipos que já existe no ecossistema. Precisa **uma fonte única de verdade** antes de plugar os dois motores juntos, senão um sobrescreve o outro silenciosamente (`window.ARCHETYPES = ...` é atribuição direta, não merge).
- **Dois sistemas de abas diferentes**: `App.navigate(viewId)` (nav inferior, `.view-section`) no app principal vs `.tab`/`data-tab` no SVG-STUDIO. Pra unificar sem duplicar lógica, um dos dois vira "citizen" do outro.
- **Nebula não é offline-first**: depende de 15 `<script src="https://...">` ao vivo, incluindo módulos hospedados no seu próprio GitHub Pages (`oiDual--Y-/M0D/...`). Colar isso dentro do monólito unificado funciona *apenas* se o navegador tiver rede — quebra a filosofia "self-contained/offline-capable" do resto do KOBLLUX. Isso é uma decisão sua, não técnica: (a) manter Nebula como link externo/iframe, (b) vendorizar os scripts (baixar e embutir), ou (c) aceitar que essa aba específica exige internet.
- **`BottomSheet`** (Nebula) e o padrão de `panel`/`accordion` do app principal são dois sistemas de UI de "gaveta" diferentes — dá pra conviver, mas não pra fundir automaticamente.

## 3. Respondendo cada pedido específico

1. **Mini-modes → pegar o `data-theme`**: dá pra portar o toggle claro/escuro (`toggleTheme()` + variáveis CSS por `[data-theme="light"]`) pro app unificado como preferência global, aplicada no `<html>` de todas as views — baixo risco, é só CSS + uma função.
2. **Fusão simples (sem arquétipo) igual ao mini-modes**: adiciono como **segundo modo dentro do painel Fusor já existente** ("Fusão Simples" vs "Fusão + Arquétipo"), reaproveitando o motor 369 que já está lá. Não precisa view nova.
3. **SVG Orb: mais abas OU scroll pra seção com o HTML inteiro embutido**: recomendo o **scroll-section**, não mais abas — abas somam estado escondido e mais JS de toggle; uma seção ancorada (`<section id="orb-full">` com `scroll-margin-top` + link "↓ ver estúdio completo") é mais simples e já serve pra "colar" outro app inteiro embaixo sem iframe (sem isolamento de contexto, compartilha CSS vars).
4. **Conectar a Nébula**: entra como **6ª view/tab** no app principal, mas com um aviso visível de "requer internet" e um botão único de "carregar módulos" (lazy-load dos 15 scripts só quando o usuário abre essa aba — evita carregar tudo isso sempre).

## 4. Arquitetura proposta (resumo)

```
KOBLLUX 78K UNIFICADO (1 arquivo .html)
├── App (shell: nav, tema, toast, accordion) ← já existe, ganha toggleTheme()
├── Fusor (369) — modo Simples | modo + Arquétipo ← mini-modes entra aqui
├── Forja (texto→ASCII) ← já existe
├── Visão (imagem→ASCII) ← já existe
├── 78K (Semântico/Imagem+Texto/Cripto) ← já existe
├── Sigilo / Build ← já existe
├── SVG Orb Studio (4 abas internas + scroll pra "estúdio completo")
└── Nébula (lazy-load, aviso de internet, arquétipos próprios isolados em `window.NEBULA_ARCH`)

Fonte única de arquétipos: window.KOBLLUX_ARCHETYPES (canônica)
  → Nebula/SVG passam a ler daqui em vez de manter cópia própria
```

## 5. Ordem de execução proposta

| Fase | Entrega | Risco |
|---|---|---|
| 0 | Consolidar roster de arquétipos numa fonte única | Médio (preciso decidir qual schema vira o canônico) |
| 1 | Portar tema claro/escuro do mini-modes pro shell | Baixo |
| 2 | Adicionar modo "Fusão Simples" no painel Fusor | Baixo |
| 3 | Integrar SVG Orb Studio como view + scroll-section | Médio |
| 4 | Integrar Nébula como view lazy-load | Alto (depende de decisão sobre CDN/vendorização) |

## 6. Preciso de 2 decisões suas antes de executar

1. **Nébula**: aceita manter os scripts externos ao vivo (`kodux78k.github.io/...`, unpkg, cdnjs), ou quer que eu tente vendorizar/embutir o que der pra embutir?
2. **Arquétipos**: o `KOBLLUX_ARCHETYPES` do K8X vira a fonte canônica, e eu adapto Nebula/SVG pra ler dele — confirma?

Me responde essas duas e eu já mando o arquivo unificado executado, fase por fase ou tudo de uma vez — o que for mais eficiente pra você.
