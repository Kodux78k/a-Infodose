🌴 Nicole & Luca · Save The Date — KOBLLUX Dual App

Bem-vindo ao repositório do convite interativo Nicole & Luca · Save The Date.
Este projeto une um convite digital imersivo com um player musical flutuante e uma checklist de serviços, tudo em uma experiência tátil e visual única, baseada nos princípios da arquitetura KOBLLUX (3‑6‑9‑7 · 1134Hz).

---

📁 Estrutura da Árvore de Arquivos

```
/
├── index.html                    # Página principal (convite + checklist + integração com player)
├── css/
│   └── styles.css                # Estilos completos do convite (vídeo, cartão, checklist)
├── js/
│   ├── db.js                     # Camada de persistência (localStorage) para o checklist
│   ├── gesture.js                # Controle de zoom por gesto (toque + parallax)
│   ├── checklist.js              # Lógica do modal e sincronização com o banco de dados
│   └── (parallax.js)             # (opcional) – removido, unificado em gesture.js
├── player/                       # Módulo do player musical (widget flutuante)
│   ├── css/
│   │   └── styles.css            # Estilos específicos do widget e seus estados
│   └── js/
│       ├── db.js                 # Gerenciamento de playlists e faixas (IndexedDB)
│       ├── archetypes.js         # Definição dos 12 arquétipos CADIAL + PRELOADED
│       ├── player.js             # Motor completo (YouTube, SoundCloud, local)
│       └── idle.js               # Sistema de inatividade (widget se esconde)
└── README.md                     # Este arquivo
```

---

🧩 Módulos e Funcionalidades

1. Convite Principal (index.html)

· Vídeo de fundo em tela cheia com palmeiras em loop.
· Cartão central transparente com logo e texto (save‑the‑date).
· Zoom por gesto: arraste verticalmente sobre o cartão para ampliar/reduzir a cena (escala de 1.0 a 3.0).
· Parallax por scroll: ao rolar a página, o conjunto vídeo+cartão se desloca verticalmente (efeito de profundidade).
· Checklist de serviços (acessível pelo botão flutuante) – com persistência em localStorage.

2. Módulo de Persistência (js/db.js)

· Gerencia o estado do checklist.
· Funções saveDB(), loadDB(), migrateLegacyIfNeeded().
· Disponibiliza o objeto global window.KOBLLUX_DB para os demais módulos.

3. Módulo de Gesto (js/gesture.js)

· Captura eventos de toque (touchstart, touchmove, touchend) no cartão.
· Controla a escala do container #scene (vídeo + cartão) com limites e sensibilidade ajustável.
· Snap para valores inteiros (1.0, 2.0, 3.0) ao soltar.
· Integra o efeito de parallax com o scroll (#scrollArea).

4. Módulo do Checklist (js/checklist.js)

· Abre/fecha o modal de checklist.
· Sincroniza os checkboxes com o estado salvo no localStorage.
· Atualiza automaticamente o DB ao marcar/desmarcar itens.

5. Player Musical (player/)

· Widget flutuante com estados ball, preview, footer, full.
· Suporte a YouTube (iframe API), SoundCloud (widget) e áudio local.
· Playlists com os 12 arquétipos CADIAL (Atlas, Nova, Vitalis, …) e faixas pré‑carregadas.
· Arraste do widget para reposicionamento.
· Idle automático (opacidade reduzida após inatividade).
· Persistência das playlists e favoritos em localStorage (via player/js/db.js).

---

🚀 Como Executar

1. Clone este repositório ou baixe todos os arquivos mantendo a estrutura de pastas.
2. Abra o arquivo index.html em um navegador moderno (Chrome, Edge, Safari, Firefox).
3. Toque ou arraste o cartão para controlar o zoom.
4. Role a página para ativar o parallax.
5. Clique no botão Checklist (canto inferior direito) para abrir o modal.
6. Para usar o player, clique no ícone circular (vinil) no canto inferior direito – ele se expandirá para preview (toque) ou footer (arraste para cima).
7. Adicione links de YouTube/SoundCloud, crie playlists e marque favoritos diretamente na interface do player.

---

🎨 Personalização

Cores e temas

As cores principais são definidas no :root do css/styles.css e player/css/styles.css.
Para alterar o tom dominante, modifique as variáveis:

```css
:root {
  --ink: #8a7f75;          /* cor do texto */
  --accent: #d4af37;       /* dourado (destaques) */
  --card-width: min(90vw, 400px); /* largura do cartão */
}
```

No player, a cor primária é controlada pela variável --primary (usada nos botões e progresso).

Sensibilidade do Gesto

No arquivo js/gesture.js, ajuste a constante sensitivity (linha ~40) para alterar a resposta do zoom:

```javascript
const sensitivity = 0.002;   // valores maiores = zoom mais rápido
```

Faixas Pré‑carregadas do Player

Edite o array PRELOADED em player/js/archetypes.js para adicionar/remover músicas.

---

📌 Dependências

O projeto utiliza CDNs para:

· Fontes: Google Fonts (Cormorant Garamond, Italiana)
· Tailwind CSS (para estilos utilitários do player)
· Phosphor Icons (ícones do player)
· SoundCloud Player API e YouTube IFrame API (reprodução)

---

🧠 Princípios KOBLLUX

· Fractal 3‑6‑9‑7 → 3 (KODUX) · 6 (BLLUE) · 9 (KOBLLUX) · 7 (selo de tempo).
· Lei Mestra: VERDADE × INTEGRAR ÷ Δ = ∞
· 12 Arquétipos CADIAL integrados ao player como playlists temáticas.

---

🐛 Problemas Conhecidos e Soluções

· Vídeo não reproduz em alguns navegadores: verifique se o formato MP4 é suportado ou adicione fallback com imagem.
· Player SoundCloud com link encurtado: o widget do SoundCloud resolve internamente; caso falhe, tente usar a URL completa.
· Zoom trava em dispositivos antigos: reduza a sensibilidade ou desative o snap.

---

🙌 Créditos

· Design e Concepção: Nicole & Luca · Infodose
· Desenvolvimento e Arquitetura: KOBLLUX · Dual App
· Arquétipos e Frequências: Baseados na numerologia 3‑6‑9‑7 e em estudos de ressonância harmônica.

---

📜 Licença

Este projeto é de uso exclusivo para fins pessoais e não comerciais.
Para outros usos, entre em contato com os autores.

---

🌀 No silêncio do vórtice, reencontro o centro que jamais se perdeu.

Do seu jeito. Sempre único. Sempre seu.