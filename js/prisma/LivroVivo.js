// =========================================
// KOBLLUX · LIVRO VIVO ENGINE
// TXT/MD → ÁRVORE SEMÂNTICA → LAYOUT ENGINE → RENDER
// =========================================

class LivroVivo {
  constructor() {
    this.parser = {
      '#': 'titulo', // TÍTULO
      '##': 'subtitulo', // SUBTÍTULO
      '-': 'lista', // LISTA
      '>': 'citacao', // CITAÇÃO
      '```': 'codigo', // CÓDIGO
      '|': 'tabela', // TABELA
      '@IMG': 'imagem', // IMAGEM
      '@2COL': 'duas-colunas', // DUAS COLUNAS
      '@BOX': 'bloco', // BLOCO
      '@CALL': 'chamada', // CHAMADA
      '@NOTE': 'insight' // INSIGHT
    };
  }

  // TXT/MD → ÁRVORE SEMÂNTICA
  parse(texto) {
    const linhas = texto.split('\n');
    const arvore = [];
    let buffer = null;

    linhas.forEach(linha => {
      const trim = linha.trim();
      if (!trim) return;

      // Detecta elementos
      if (trim.startsWith('# ')) {
        arvore.push({ tipo: 'titulo', conteudo: trim.slice(2), z: 22 });
      } else if (trim.startsWith('## ')) {
        arvore.push({ tipo: 'subtitulo', conteudo: trim.slice(3), z: 21 });
      } else if (trim.startsWith('@2COL')) {
        buffer = { tipo: 'duas-colunas', esquerda: [], direita: [], z: 24 };
      } else if (trim.startsWith('@BOX')) {
        arvore.push({ tipo: 'bloco', conteudo: trim.slice(5), z: 31 });
      } else if (trim.startsWith('@CALL')) {
        arvore.push({ tipo: 'chamada', conteudo: trim.slice(6), z: 41 });
      } else if (trim.startsWith('@NOTE')) {
        arvore.push({ tipo: 'insight', conteudo: trim.slice(6), z: 32 });
      } else if (trim.startsWith('```')) {
        if (buffer?.tipo === 'codigo') {
          arvore.push(buffer);
          buffer = null;
        } else {
          buffer = { tipo: 'codigo', conteudo: '', z: 23 };
        }
      } else if (buffer?.tipo === 'codigo') {
        buffer.conteudo += linha + '\n';
      } else {
        arvore.push({ tipo: 'paragrafo', conteudo: trim, z: 20 });
      }
    });

    return arvore;
  }

  // ÁRVORE SEMÂNTICA → HTML
  render(arvore, formato = 'html') {
    if (formato === 'ascii') return this.renderASCII(arvore);
    if (formato === 'pdf') return this.renderPDF(arvore);

    const html = arvore.map(no => {
      const z = no.z || 20;
      const attrs = `data-z="${this.getZName(z)}" style="z-index:${z}"`;

      switch (no.tipo) {
        case 'titulo':
          return `<h1 ${attrs} class="lv-titulo">${no.conteudo}</h1>`;
        case 'subtitulo':
          return `<h2 ${attrs} class="lv-subtitulo">${no.conteudo}</h2>`;
        case 'insight':
          return `<div ${attrs} class="lv-note glass">
            <i data-lucide="lightbulb"></i>
            <p>${no.conteudo}</p>
          </div>`;
        case 'chamada':
          return `<div ${attrs} class="lv-call">
            <strong>${no.conteudo}</strong>
          </div>`;
        case 'bloco':
          return `<pre ${attrs} class="lv-box"><code>${no.conteudo}</code></pre>`;
        case 'codigo':
          return `<pre ${attrs} class="lv-codigo"><code>${this.escapeHtml(no.conteudo)}</code></pre>`;
        case 'duas-colunas':
          return `<div ${attrs} class="lv-2col grid md:grid-cols-2 gap-4">
            <div class="lv-col-esq">${no.esquerda.join('<br>')}</div>
            <div class="lv-col-dir">${no.direita.join('<br>')}</div>
          </div>`;
        default:
          return `<p ${attrs} class="lv-paragrafo">${no.conteudo}</p>`;
      }
    }).join('\n');

    return html;
  }

  getZName(z) {
    const map = {
      0: 'fundo', 10: 'decoracao', 20: 'conteudo', 21: 'conteudo', 22: 'conteudo',
      23: 'conteudo', 24: 'conteudo', 30: 'insights', 31: 'insights', 32: 'insights',
      40: 'chamadas', 41: 'chamadas', 50: 'navegacao', 60: 'ia',
      70: 'interacoes', 80: 'debug', 90: 'emergencia'
    };
    return map[z] || 'conteudo';
  }

  escapeHtml(str) {
    return str.replace(/[&<>]/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[m]));
  }

  // RENDER ASCII
  renderASCII(arvore) {
    return arvore.map(no => {
      switch (no.tipo) {
        case 'titulo': return `\n${'='.repeat(60)}\n${no.conteudo.toUpperCase()}\n${'='.repeat(60)}\n`;
        case 'insight': return `\n[INSIGHT] ${no.conteudo}\n`;
        case 'chamada': return `\n>>> ${no.conteudo} <<<\n`;
        default: return no.conteudo;
      }
    }).join('\n');
  }
}

// USO:
const livro = new LivroVivo();
const texto = `
# CAPÍTULO 01
## A Jornada Interior

Cada passo que você dá em direção a si mesmo,
aproxima você da sua melhor versão.

@NOTE Você não encontra o caminho. Você se torna o caminho.

@BOX
def evoluir(mente):
    foco = mente.clareza()
    energia = mente.acao()
    return foco * energia

@CALL LEMBRETE: Você é o criador.
`;

const arvore = livro.parse(texto);
const html = livro.render(arvore, 'html');
document.getElementById('pages').innerHTML = html;
