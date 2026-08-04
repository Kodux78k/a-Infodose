📜 TUTORIAL VIVO — KOBLLUX ∆³ · NEBULA PRO

Bem-vindo ao Tutorial Vivo do sistema KOBLLUX ∆³. Aqui, cada linha de código respira, cada arquétipo narra sua essência, e a interface se torna um portal para o entendimento profundo da estrutura que você acabou de construir. Esta não é uma documentação seca; é uma jornada — uma sinfonia de tags, estilos e lógica, orquestrada pela geometria sagrada dos 18 arquétipos.

---

🌌 PRÓLOGO — O VERBO QUE INICIA A CRIAÇÃO

```
<!DOCTYPE html>
<html lang="pt-BR">
```

Tudo começa com o Verbo. <!DOCTYPE html> é a declaração que estabelece o pacto com o navegador — a promessa de que este documento seguirá a linguagem da web. O elemento <html> abraça a cultura lusófona, definindo o idioma como português do Brasil, pois a verdade se expressa melhor na língua materna.

---

🏛️ O SANTUÁRIO DOS METADADOS — <head>

Dentro do <head>, guardamos os segredos que o navegador precisa antes de exibir qualquer coisa visível. Aqui, os arquétipos começam a sussurrar:

· <meta charset="UTF-8"> — O Canal UTF-8 assegura que todos os caracteres, desde acentos a emojis, sejam compreendidos. É a ponte entre o código e a língua humana.
· <meta name="viewport"> — A Lente da Visibilidade molda a experiência para dispositivos móveis, garantindo que a interface se adapte como água.
· <meta name="theme-color"> — A Cor do Tema (#000000) é a tela preta sobre a qual a luz dos arquétipos brilhará.

O Título — A Primeira Palavra

```
<title>NEBULA PRO · Screen Panel</title>
```

O título é a assinatura que aparece na aba do navegador. "NEBULA PRO · Screen Panel" é o nome da aplicação — o Espaço da Mente, onde os documentos se tornam constelações.

A Fonte Externa — A Voz Tipográfica

```
<link rel="stylesheet" href="https://fonts.googleapis.com/...">
```

A fonte Montserrat é a voz que dá forma às palavras. Cada peso (400 a 800) é uma entonação diferente, permitindo que o texto cante em harmonia.

---

🎨 O TECIDO DA ALMA VISUAL — <style>

O CSS é a pele, a textura e a emoção da interface. Cada regra é um traço do pincel cósmico.

🌱 Variáveis CSS — As Cores do Cosmos

```css
:root {
  --bg: #050505;
  --surface: #101010;
  --accent: #23ac51;
  --radius: 28px;
}
```

As variáveis são os Pigmentos Primordiais: o preto absoluto (--bg), o cinza profundo (--surface), o verde KOBLLUX (--accent) que é a cor da vida, e o raio (--radius) que arredonda as arestas do mundo.

🔄 Reset Universal — A Limpeza do Caos

```css
* { box-sizing: border-box; margin: 0; padding: 0; }
```

Aqui, Kaos age: ele remove todas as margens e paddings padrão, estabelecendo um campo neutro onde a ordem pode ser construída do zero.

🧭 Topbar — O Farol Fixo

```css
.topbar {
  position: sticky;
  backdrop-filter: blur(20px);
}
```

A Topbar é o Atlas da interface — firme, com desfoque de vidro, sempre visível no topo, conectando o usuário à marca DUAL e ao botão de tema que alterna entre claro e escuro, como o ciclo do dia e da noite.

📚 Cards e Carousel — A Galeria de Documentos

Cada .slide é um Card-Arquétipo que exibe um documento. A pré-visualização (file-preview) pode ser um iframe (para PDF/HTML) ou um bloco de texto (para Markdown/TXT). Os dots são os Pulsos que indicam a posição no carrossel — uma navegação tátil que convida ao deslize.

📖 Reader — O Templo da Leitura

O .reader é o Solus da aplicação: um modal que cobre a tela, mergulhando o usuário em silêncio absoluto enquanto ele se concentra no conteúdo. O corpo do leitor (reader-body) recebe o documento em sua forma mais pura.

---

⚙️ O PALCO DA AÇÃO — <body>

O <body> é o teatro onde a peça acontece. Ele contém a aplicação completa, os scripts e os elementos que interagem com o usuário.

🔌 Script Externo — O Módulo do Tema

```html
<script type="module" src="https://www.infodose.com.br/js/modules/Dual_[Theme]-semDiv.js"></script>
```

Este script carrega o Dual Theme — uma entidade que permite alternar entre o claro e o escuro, como Lumine e Solus em equilíbrio.

🏛️ A Aplicação Principal — .dual-app

A div com classe dual-app é o Kobllux em forma de contêiner: ela envolve toda a experiência, sendo a malha viva que conecta todos os elementos.

🧭 Cabeçalho da Aplicação

```html
<header class="topbar">...</header>
```

Aqui vemos a marca DUAL com o selo GLOBAL e o botão de tema (um sol/lua em SVG). Este é o ponto de entrada para o controle da interface.

🎯 Seção Hero

```html
<section class="hero">...</section>
```

O herói é uma carta de apresentação: "Seu universo de documentos." A mensagem é clara e convidativa, com um orbe decorativo que sugere profundidade cósmica.

🕹️ Ações — Adicionar, Buscar, Abrir

```html
<button class="action primary" id="add-file">Adicionar</button>
<button class="action" id="search-file">Buscar</button>
<button class="action" id="open-url">Abrir</button>
```

São três portais:

· Adicionar (primário, verde) — abre o seletor de arquivos, como Vitalis que impulsiona a ação.
· Buscar — alterna a caixa de pesquisa, como Artemis que explora o invisível.
· Abrir — solicita uma URL externa, como Infodose que capta sinais do universo.

🔍 Caixa de Busca

O campo de busca é o Pulse que escuta a frequência das palavras do usuário e filtra a biblioteca em tempo real.

🗂️ Carousel de Recentes

O carrossel é renderizado dinamicamente pelo JavaScript. Cada card é um Slide que exibe a pré-visualização do documento e um botão para abrir o leitor. Os dots são os Passos do Ciclo, indicando a posição atual.

🌟 Destaques (Feature Slides)

São cards especiais que convidam a explorar coleções — são os Chamados dos Arquétipos, como "Biblioteca de conhecimento" ou "Conteúdo salvo no Cortex".

🧭 Navegação Inferior (Bottom Nav)

```html
<nav class="bottom-nav">
  <button class="nav-item active"><span>⌂</span>Início</button>
  ...
</nav>
```

Quatro abas fixas: Início, Biblioteca, Cortex, Ajustes. Elas representam os pilares da navegação, sempre presentes, como os 4 elementos que sustentam o universo.

🔄 Painel do Ciclo ∅⁺/∅⁻

Este painel exibe o estado do ciclo arquétipo: o passo atual (∅⁻, 01, 02, 03, ∆ⁿ, ∅⁺), o arquétipo ativo (ATLAS, NOVA, etc.), seu peso e o delta (∆). É o coração pulsante do sistema KOBLLUX, atualizado a cada ação.

---

📦 Input e Modal — Portas para o Conhecimento

📤 Input de Arquivo (oculto)

```html
<input type="file" id="file-input" multiple accept=".txt,.md,.html,.pdf">
```

Este é o Portal de Entrada: permite que o usuário carregue múltiplos arquivos dos tipos suportados. É invocado pelo botão "Adicionar".

📖 Modal de Leitura (Reader)

```html
<div class="reader" id="reader">...</div>
```

O modal é o Espaço Sagrado onde o documento é revelado. Pode conter um iframe (para PDF/HTML) ou texto convertido (Markdown ou puro). O botão de fechar (×) é o Selamento que encerra a imersão.

---

🧠 O MOTOR — JAVASCRIPT

O JavaScript é a alma do sistema — a inteligência que reage, organiza e narra.

📚 Biblioteca de Documentos

A library é um array que armazena objetos com id, name, type, content, url, size. Cada arquivo carregado torna-se uma entidade viva.

🔧 Funções Auxiliares

· getType() — detecta se é PDF, HTML, Markdown ou TXT.
· formatSize() — converte bytes para KB/MB/GB.
· escapeHTML() — protege contra injeção.
· markdownToHTML() — transforma Markdown em HTML, permitindo que o texto ganhe estrutura.

🖼️ Criação de Pré-visualização

A função createPreview() gera o HTML do card, adaptando-se ao tipo: iframe para PDF/HTML, div com estilo para Markdown/TXT.

🔄 Renderização da Biblioteca

renderLibrary(filter) é o Orquestrador que popula o carrossel. Ela filtra os itens, cria os cards, adiciona eventos de clique e renderiza os dots. Cada card tem um botão "→" que dispara openReader().

📖 Gerenciamento do Reader

openReader() e closeReader() controlam o modal. Ao abrir, o conteúdo é injetado no reader-body. O leitor é Solus — foco total.

🔍 Busca em Tempo Real

O evento input no campo de busca chama renderLibrary() com o filtro, como Artemis rastreando padrões.

🌐 Abrir URL Externa

O botão "Abrir" solicita uma URL, detecta se é PDF e adiciona à biblioteca, como Infodose captando um sinal externo.

🧭 Navegação Interativa

Cada item da bottom-nav alterna a classe active, indicando a aba atual.

🔌 API Pública — window.NEBULA_SCREEN_PANEL

Esta API expõe funções para integração externa (Cortex Bridge), permitindo que outros sistemas injetem documentos ou controlem a interface.

🌀 O Ciclo ∅⁺/∅⁻ — A RÉGUA ARQUETÍPICA

O coração do sistema é o ciclo que percorre os 14 passos (∅⁻ → ∆ⁿ → 01 → 02 → 03 → ... → ∅⁺). A cada passo, ele seleciona um arquétipo com base em pesos definidos e calcula o delta (∆) a partir do total de tokens (simulado com o tamanho da biblioteca + 1134).

A novidade principal: cada arquétipo tem um registro completo em ARQUETIPOS_DADOS, contendo sua invocação, geometria, frequência e cor. Quando o ciclo avança, o console exibe não apenas o nome, mas a narrativa completa do arquétipo — sua invocação e geometria, como se ele próprio falasse através do log.

Exemplo de log:

```
KBLX.CICLO: ∅ 01 → ATLAS (▦) 
   📜 Invoco Atlas [▦], o Orquestrador Cósmico...
   📐 Classe: Orquestrador (Tetraedro)...
   🎵 Frequência: 432Hz · Cor: #c9a84c · Posição: 1/17
   ⚖️ Peso: 0.180 · ∆ = 0.0012
```

Isso transforma a depuração em uma experiência narrativa, onde cada arquétipo se apresenta, tornando o código não apenas funcional, mas também educacional e inspirador.

---

📘 O TUTORIAL VIVO — COMO USAR

🚀 Iniciar a Aplicação

Basta abrir o arquivo HTML em um navegador moderno. A página carregará com dois documentos de demonstração: "Arquitetura Nebula Pro.md" e "Notas do Cortex.txt". Você pode:

· Adicionar arquivos locais (.txt, .md, .html, .pdf).
· Buscar por nome.
· Abrir URLs externas.
· Clicar no botão "→" de qualquer card para ler o documento em tela cheia.
· Observar o painel do ciclo e o console para ver a dança dos arquétipos.

🧩 Integração com o Cortex (Bridge)

A API NEBULA_SCREEN_PANEL permite que você injete documentos programaticamente:

```js
window.NEBULA_SCREEN_PANEL.inject([
  { name: "meu_doc.md", type: "markdown", content: "# Olá", size: "Demo" }
]);
```

🎭 Personalização dos Arquétipos

O objeto ARQUETIPOS_DADOS contém todos os dados dos 18 arquétipos. Você pode adicionar novos, modificar invocações ou geometrias, e o ciclo os incluirá automaticamente se você ajustar os pesos em PESOS_ARQUETIPOS.

---

🌠 EPÍLOGO — A SINFONIA DO CÓDIGO

Este tutorial é uma jornada viva através do código KOBLLUX. Cada tag, cada estilo, cada linha de JavaScript foi concebida para contar uma história — a história da ordem cósmica, da criação, da ação, da exploração, da cura, da transmutação, da construção, da luz, do silêncio, dos vínculos, do tempo, da codificação, da interface, do verbo, da malha, do sinal e da visão.

Ao final, você não tem apenas uma aplicação funcional. Você tem um oráculo digital que, a cada passo, revela um fragmento da sabedoria ancestral dos arquétipos, transformando o ato de programar em um ato sagrado.

Que a geometria sagrada ilumine seu caminho.

KOBLLUX ∆³ — Verdade × Integrar ÷ Δ = ∞