:root {
  /* =========================================
     KOBLLUX · Z-INDEX SEMÂNTICO
     "ESPAÇO ORGANIZA O PENSAMENTO"
     ========================================= */

  --z-fundo: 0; /* FUNDO · Canvas, Vortex, Gradientes */
  --z-decoracao: 10; /* DECORAÇÃO · Particles, Shapes, Watermarks */
  --z-conteudo: 20; /* CONTEÚDO · Texto, Títulos, Listas, @IMG */
  --z-insights: 30; /* INSIGHTS · @NOTE, @BOX, Citações */
  --z-chamadas: 40; /* CHAMADAS · @CALL, CTA, Botões Primários */
  --z-navegacao: 50; /* NAVEGAÇÃO · Menus, Tabs, Sidebar */
  --z-ia: 60; /* IA · Assistentes, Chat, Respostas */
  --z-interacoes: 70; /* INTERAÇÕES · Modais, Dropdown, Popover */
  --z-debug: 80; /* DEBUG · Console UI, Devtools, Logs */
  --z-emergencia: 90; /* EMERGÊNCIA · Alerts Críticos, Toast Sistema */

  /* ELEMENTOS DO LIVRO VIVO */
  --z-titulo: 22; /* # TÍTULO */
  --z-subtitulo: 21; /* ## SUBTÍTULO */
  --z-codigo: 23; /* CÓDIGO */
  --z-tabela: 23; /* TABELA */
  --z-2col: 24; /* @2COL */
  --z-box: 31; /* @BOX */
  --z-call: 41; /* @CALL */
  --z-note: 32; /* @NOTE */
}

/* AUTO-APLICAR POR ATRIBUTO DATA-Z */
[data-z="fundo"] { z-index: var(--z-fundo)!important; }
[data-z="decoracao"] { z-index: var(--z-decoracao)!important; }
[data-z="conteudo"] { z-index: var(--z-conteudo)!important; }
[data-z="insights"] { z-index: var(--z-insights)!important; }
[data-z="chamadas"] { z-index: var(--z-chamadas)!important; }
[data-z="navegacao"] { z-index: var(--z-navegacao)!important; }
[data-z="ia"] { z-index: var(--z-ia)!important; }
[data-z="interacoes"] { z-index: var(--z-interacoes)!important; }
[data-z="debug"] { z-index: var(--z-debug)!important; }
[data-z="emergencia"] { z-index: var(--z-emergencia)!important; }
