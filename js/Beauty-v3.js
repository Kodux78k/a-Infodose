(function(bundle,s='#inject-here'){
const p=new DOMParser();
const c=p.parseFromString(
bundle,
'text/html'
);
const t=
document.querySelector(s)
||document.body;
// CSS
Array.from(
c.querySelectorAll('style')
)
.forEach(style=>{
const n=
document.createElement('style');
n.textContent=
style.textContent;
document.head.appendChild(n);
});
// HTML
const f=
document.createDocumentFragment();
Array.from(
c.body.childNodes
)
.forEach(node=>{
if(node.nodeName!=='SCRIPT'){
f.appendChild(
document.importNode(node,true)
);
}
});
t.appendChild(f);
// JS
Array.from(
c.querySelectorAll('script')
)
.forEach(x=>{
const n=
document.createElement('script');
for(
const a of x.attributes
)
n.setAttribute(
a.name,
a.value
);
n.textContent=
x.textContent;
document.body.appendChild(n);
});
})(`<style id="NEBULA_MIN_CORE">
/* ========== VARIÁVEIS BASE (Nebula) ========== */
:root{
  --grad-a:#78e3ff;
  --grad-b:#b978ff;
  --bg:#070b14;
  --panel:#0c1120;
  --ink:#eaf6ff;
  --muted:#9db0cc;
  --radius:18px;
  --glow:0 0 20px rgba(120,240,255,.04) inset,0 0 60px rgba(180,120,255,.05);
  --ring:0 0 0 1px rgba(255,255,255,.08) inset,0 0 40px rgba(102,255,255,.08);
}

/* ========== RESET + FUNDO ========== */
*{box-sizing:border-box}
html,body{height:100%;margin:0}
body{

  color:var(--ink);
  font:400 16px/1.65 system-ui,-apple-system,Segoe UI,Roboto,sans-serif;
}
.wrap{max-width:900px;margin:0 auto;padding:20px}

/* ========== CARDS (details.acc) ========== */
details.acc{
  border-radius:var(--radius);
  background:rgba(255,255,255,.03);
  border:1px solid rgba(255,255,255,.1);
  box-shadow:var(--glow);
  margin:14px 0;
  transition:.25s all ease;
}
details.acc:hover{box-shadow:0 0 25px rgba(120,240,255,.08),0 0 80px rgba(180,120,255,.1);}
summary{
  display:flex;align-items:center;gap:10px;
  padding:14px 16px;cursor:pointer;
}
summary::-webkit-details-marker{display:none}
summary h2{margin:0;font-size:1.2rem;color:var(--ink);text-shadow:0 0 12px rgba(120,240,255,.4);}
.chev{
  width:10px;height:10px;
  border-right:2px solid var(--ink);
  border-bottom:2px solid var(--ink);
  transform:rotate(-45deg);
  transition:.2s;
}
details[open] .chev{transform:rotate(45deg)}
.sec{padding:0 16px 16px}

/* ========== BLOCOS INTERNOS ========== */
blockquote,.equation,.callout{
  border-radius:12px;
  padding:12px 14px;
  margin:12px 0;
  position:relative;
}
.copy-hint{
  position:absolute;right:10px;top:10px;
  font-size:.8rem;opacity:.6;
  pointer-events:none;
}
blockquote{border-left:3px solid var(--grad-a);background:rgba(255,255,255,.03);}
.equation{background:rgba(255,255,255,.03);font-family:ui-monospace,monospace;white-space:pre-wrap;}
.callout{border-left:3px solid var(--grad-b);background:rgba(255,255,255,.03);}
.callout.note{border-color:#7ad0ff}
.callout.warn{border-color:#ffda7a}
.callout.tip{border-color:#9ff7b9}
.callout.aside{border-color:var(--muted)}
.callout.success{border-color:#9ff7b9}
.callout.danger{border-color:#ff9f9f}
.callout.question{border-color:#b7a6ff}

/* ========== CÓDIGO, TABELAS, LISTAS ========== */
pre.md-code{
  position:relative;
  background:rgba(255,255,255,.03);
  border:1px solid rgba(255,255,255,.08);
  padding:12px 14px;border-radius:12px;
  overflow:auto;
  font:500 13px/1.5 ui-monospace,SFMono-Regular,Consolas,monospace;
  margin:12px 0;
}
code.code-inline{background:rgba(255,255,255,.06);padding:.1rem .3rem;border-radius:6px;}

table.md-table{width:100%;border-collapse:collapse;margin:12px 0;border-radius:12px;overflow:hidden}
table.md-table th,table.md-table td{border:1px solid rgba(255,255,255,.12);padding:8px 10px;vertical-align:top}
table.md-table th{background:rgba(255,255,255,.06);font-weight:700}

ul.md-list,ol.md-list{padding-left:1.1rem;margin:10px 0}
ul.md-task{list-style:none;padding-left:0}
ul.md-task li{display:flex;gap:.5rem;align-items:flex-start;margin:6px 0}
ul.md-task input[type=checkbox]{accent-color:var(--grad-a);pointer-events:none}

.hr{height:1px;border:0;background:linear-gradient(90deg,transparent,rgba(255,255,255,.2),transparent);margin:16px 0}
img.md-img{max-width:100%;display:block;margin:10px auto;border-radius:12px}

/* ========== BOTÕES ========== */
.btn{
  display:inline-block;
  border:1px solid rgba(255,255,255,.15);
  background:linear-gradient(45deg,rgba(120,240,255,.15),rgba(180,120,255,.12));
  border-radius:12px;
  padding:.55rem .8rem;
  color:var(--ink);
  backdrop-filter:blur(8px);
  box-shadow:0 0 20px rgba(120,240,255,.15);
  cursor:pointer;
  font:inherit;
  transition:.25s ease;
}
.btn:hover{background:linear-gradient(45deg,rgba(120,240,255,.25),rgba(180,120,255,.2));}

/* ========== FAB ========== */
#fab{position:fixed;right:14px;bottom:14px;z-index:100;display:flex;flex-direction:column;gap:10px}
.fab-btn{
  width:56px;height:56px;border-radius:50%;
  border:1px solid rgba(255,255,255,.14);
  background:linear-gradient(42deg,var(--grad-a),var(--grad-b));
  color:#000;font-weight:900;font-size:1.2rem;
  cursor:pointer;box-shadow:var(--ring);
}
#fab .menu{display:none;position:absolute;right:62px;bottom:0;flex-direction:column;gap:8px}
#fab.open .menu{display:flex}

/* ========== TOASTS ========== */
#toasts{position:fixed;bottom:16px;left:50%;transform:translateX(-50%);display:flex;flex-direction:column;gap:6px;z-index:99}
.toast{background:rgba(0,0,0,.7);color:#fff;padding:10px 14px;border-radius:10px;animation:fade 2s forwards}
@keyframes fade{0%{opacity:0;transform:translateY(10px)}15%{opacity:1;transform:translateY(0)}85%{opacity:1}100%{opacity:0;transform:translateY(-10px)}}

/* ========== IMPORTER ========== */
#imp{position:fixed;inset:0;display:none;z-index:50;background:rgba(0,0,0,.5);backdrop-filter:blur(10px)}
#imp .panel{
  position:absolute;bottom:0;left:0;right:0;
  background:var(--panel);
  border-top:1px solid rgba(255,255,255,.1);
  border-radius:20px 20px 0 0;
  padding:16px;
}
.tabs{display:flex;gap:10px;margin-bottom:10px}
.tab{flex:1;text-align:center;padding:8px;border-radius:8px;background:rgba(255,255,255,.08);cursor:pointer}
.tab.active{background:linear-gradient(42deg,var(--grad-a),var(--grad-b));color:#000;font-weight:700}
.tab-content{display:none}
.tab-content.active{display:block}
textarea{
  width:100%;height:160px;
  border-radius:10px;border:1px solid rgba(255,255,255,.1);
  background:#0a0e18;color:var(--ink);
  padding:12px;font:inherit;
}

/* ========== PRINT ========== */
@page{size:A4;margin:18mm}
@media print{#fab,#imp,#toasts,.copy-hint{display:none!important}body{background:#fff;color:#000}details.acc{background:#fff;border-color:#ddd;box-shadow:none}}
</style>

<!-- ============================================================
     NEBULA BEAUTY ENGINE · CSS + JS (snippet único)
     - Adiciona estilos para os elementos do parser (se ausentes)
     - Substitui markdownToHTML pelo parser completo
     - Mantém createPreview e openReader do motor original
     ============================================================ -->

<style id="nebula-beauty-css">
  /* ===== Estilos para os elementos gerados pelo parser ===== */
  /* (já existem no NEBULA_MIN_CORE, mas garantimos que estão aqui) */
  .md-code {
    background: rgba(255,255,255,.05);
    border: 1px solid rgba(255,255,255,.1);
    border-radius: 12px;
    padding: 12px 14px;
    overflow: auto;
    font: 500 13px/1.5 ui-monospace, monospace;
    margin: 12px 0;
  }
  .code-inline {
    background: rgba(255,255,255,.08);
    padding: .1rem .3rem;
    border-radius: 6px;
    font-size: .9em;
  }
  .md-table {
    width: 100%;
    border-collapse: collapse;
    margin: 12px 0;
    border-radius: 12px;
    overflow: hidden;
  }
  .md-table th, .md-table td {
    border: 1px solid rgba(255,255,255,.12);
    padding: 8px 10px;
    vertical-align: top;
  }
  .md-table th {
    background: rgba(255,255,255,.06);
    font-weight: 700;
  }
  .md-list, .md-task {
    padding-left: 1.1rem;
    margin: 10px 0;
  }
  .md-task {
    list-style: none;
    padding-left: 0;
  }
  .md-task li {
    display: flex;
    gap: .5rem;
    align-items: flex-start;
    margin: 6px 0;
  }
  .md-task input[type=checkbox] {
    accent-color: var(--grad-a, #78e3ff);
    pointer-events: none;
    margin-top: 4px;
  }
  .bq {
    border-left: 3px solid var(--grad-a, #78e3ff);
    background: rgba(255,255,255,.03);
    border-radius: 12px;
    padding: 10px 12px;
    margin: 12px 0;
    position: relative;
  }
  .bq .bq-line {
    margin: 6px 0;
  }
  .bq blockquote {
    margin: 8px 0 8px 20px;
    border-left: 2px solid rgba(255,255,255,.15);
    padding-left: 10px;
  }
  .callout {
    border-left: 3px solid var(--grad-b, #b978ff);
    background: rgba(255,255,255,.03);
    border-radius: 12px;
    padding: 12px 14px;
    margin: 12px 0;
    position: relative;
  }
  .callout.note { border-color: #7ad0ff; }
  .callout.warn { border-color: #ffda7a; }
  .callout.tip  { border-color: #9ff7b9; }
  .callout.aside { border-color: var(--muted, #9db0cc); }
  .callout.success { border-color: #9ff7b9; }
  .callout.danger { border-color: #ff9f9f; }
  .callout.question { border-color: #b7a6ff; }
  .copy-hint {
    position: absolute;
    right: 10px;
    top: 10px;
    font-size: .8rem;
    opacity: .6;
    pointer-events: none;
  }
  .md-img {
    max-width: 100%;
    display: block;
    margin: 10px auto;
    border-radius: 12px;
  }
  .hr {
    height: 1px;
    border: 0;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,.2), transparent);
    margin: 16px 0;
  }
  /* Ajuste fino para previews */
  .preview-markdown {
    font-size: 13px;
    line-height: 1.5;
    max-height: 120px;
    overflow: hidden;
    mask-image: linear-gradient(to bottom, black 60%, transparent);
    -webkit-mask-image: linear-gradient(to bottom, black 60%, transparent);
  }
  .preview-markdown h1, .preview-markdown h2, .preview-markdown h3 {
    margin: 4px 0;
    font-size: inherit;
    font-weight: 600;
  }
  .preview-markdown p {
    margin: 4px 0;
  }
  .reader-markdown {
    padding: 16px;
    max-width: 720px;
    margin: 0 auto;
  }
  .reader-markdown h1 { font-size: 1.8rem; margin: 1.2rem 0 .6rem; }
  .reader-markdown h2 { font-size: 1.5rem; margin: 1rem 0 .4rem; }
  .reader-markdown h3 { font-size: 1.2rem; margin: .8rem 0 .3rem; }
  .reader-markdown p { margin: .6rem 0; line-height: 1.6; }
  .reader-markdown blockquote { margin: .8rem 0; }
  .reader-markdown table { margin: 1rem 0; }
  .reader-markdown ul, .reader-markdown ol { margin: .6rem 0; padding-left: 1.5rem; }
  .reader-markdown .callout { margin: .8rem 0; }
</style>

<script>
/* ==============================================================
   NEBULA BEAUTY ENGINE · Substituição de markdownToHTML
   Adaptado para funcionar com o motor nebula-unified.js
   Mantém as funções originais createPreview e openReader
   ============================================================== */

(function() {
  "use strict";

  // — Utilitários (usa escapeHTML do motor se disponível)
  const esc = window.escapeHTML || function(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  };

  function autoLink(url) {
    try {
      const u = new URL(url);
      return \`<a href="\${u.href}" target="_blank" rel="noopener">\${u.href}</a>\`;
    } catch { return url; }
  }

  // — Parser inline
  function inlineMD(s) {
    let html = esc(s);
    html = html.replace(/!\\[([^\\]]*)\\]\\(([^)]+)\\)/g, (_, alt, src) =>
      \`<img class="md-img" alt="\${alt}" src="\${src}">\`
    );
    html = html.replace(/\\[([^\\]]+)\\]\\(([^)]+)\\)/g, (_, txt, href) =>
      \`<a href="\${href}" target="_blank" rel="noopener">\${txt}</a>\`
    );
    html = html.replace(/\`([^\`]+)\`/g, (_, code) =>
      \`<code class="code-inline">\${code}</code>\`
    );
    html = html.replace(/\\*\\*([^*]+)\\*\\*/g, "<strong>$1</strong>");
    html = html.replace(/(^|[^*])\\*([^*]+)\\*(?!\\*)/g, "$1<em>$2</em>");
    html = html.replace(/~~([^~]+)~~/g, "<del>$1</del>");
    html = html.replace(/\\bhttps?:\\/\\/[^\\s)]+/g, m => autoLink(m));
    html = html.replace(/\\[\\[btn:([a-z0-9_-]+)(?:\\|([^\\]]+))?\\]\\]/gi,
      (_, act, label) =>
        \`<button class="btn action" data-action="\${act}">\${label || act}</button>\`
    );
    return html;
  }

  // — Parser de bloco completo
  function renderMarkdown(md) {
    if (!md) return "";
    const lines = String(md).replace(/\\r\\n?/g, "\\n").split("\\n");
    const out = [];
    let i = 0;
    let inCode = false;
    let codeLang = "";
    let codeBuf = [];

    function flushCode() {
      if (!codeBuf.length) return;
      const pre = document.createElement("pre");
      pre.className = "md-code";
      const code = document.createElement("code");
      if (codeLang) code.className = \`lang-\${codeLang}\`;
      code.textContent = codeBuf.join("\\n");
      pre.appendChild(code);
      out.push(pre.outerHTML);
      codeBuf = [];
      inCode = false;
      codeLang = "";
    }

    function pushBlock(tag, className, content) {
      const el = document.createElement(tag);
      if (className) el.className = className;
      if (content) el.innerHTML = content;
      out.push(el.outerHTML);
    }

    while (i < lines.length) {
      const line = lines[i];

      // Fences de código
      const fenceOpen = line.match(/^\\s*(?:\`\`\`|''')\\s*([\\w-]*)\\s*$/);
      if (!inCode && fenceOpen) {
        flushCode();
        inCode = true;
        codeLang = fenceOpen[1] || "";
        i++;
        continue;
      }
      if (inCode) {
        const fenceClose = line.match(/^\\s*(?:\`\`\`|''')\\s*$/);
        if (fenceClose) {
          flushCode();
        } else {
          codeBuf.push(line);
        }
        i++;
        continue;
      }

      // Headings
      const hMatch = line.match(/^\\s*(#{1,6})\\s+(.+)/);
      if (hMatch) {
        const level = hMatch[1].length;
        const text = inlineMD(hMatch[2].trim());
        pushBlock(\`h\${level}\`, "", text);
        i++;
        continue;
      }

      // HR
      if (/^\\s*(?:---|\\*\\*\\*)\\s*$/.test(line)) {
        pushBlock("hr", "hr", "");
        i++;
        continue;
      }

      // Blockquotes aninhados
      if (/^\\s*>+/.test(line)) {
        const items = [];
        while (i < lines.length && /^\\s*>+/.test(lines[i])) {
          const m = lines[i].match(/^\\s*(>+)\\s?(.*)/);
          items.push({ level: m[1].length, text: m[2] });
          i++;
        }
        const rootBQ = document.createElement("blockquote");
        rootBQ.className = "bq";
        let currentLevel = 1;
        const stack = [rootBQ];
        items.forEach(({ level, text }) => {
          while (level > currentLevel) {
            const inner = document.createElement("blockquote");
            inner.className = "bq";
            stack[stack.length - 1].appendChild(inner);
            stack.push(inner);
            currentLevel++;
          }
          while (level < currentLevel) {
            stack.pop();
            currentLevel--;
          }
          const div = document.createElement("div");
          div.className = "bq-line";
          div.innerHTML = inlineMD(text);
          stack[stack.length - 1].appendChild(div);
        });
        out.push(rootBQ.outerHTML);
        continue;
      }

      // Callouts
      const callMatch = line.match(/^\\s*(::(info|warn|tip|note|success|danger)|::\\.|:|\\?)\\s+(.*)/i);
      if (callMatch) {
        let marker = callMatch[1].toLowerCase();
        let kind = "note";
        if (marker === "::.") kind = "aside";
        else if (marker === ":") kind = "note";
        else if (marker === "?") kind = "question";
        else kind = (callMatch[2] || "info").toLowerCase();

        let textBuf = [callMatch[3]];
        let j = i + 1;
        while (j < lines.length) {
          const next = lines[j].trim();
          if (!next) break;
          if (/^\\s*(::(info|warn|tip|note|success|danger)|::\\.|:|\\?)\\s+/.test(next)) break;
          textBuf.push(next);
          j++;
        }
        i = j;
        const content = inlineMD(textBuf.join(" "));
        pushBlock("div", \`callout \${kind}\`, \`<span class="copy-hint">Copiar</span>\${content}\`);
        continue;
      }

      // Tabelas
      if (/^\\s*\\|.*\\|\\s*$/.test(line)) {
        const rows = [];
        while (i < lines.length && /^\\s*\\|.*\\|\\s*$/.test(lines[i])) {
          rows.push(lines[i].trim());
          i++;
        }
        const table = document.createElement("table");
        table.className = "md-table";
        rows.forEach((r, idx) => {
          const cells = r.slice(1, -1).split("|").map(c => c.trim());
          if (idx === 1 && cells.every(c => /^:?-{3,}:?$/.test(c))) return;
          const tr = document.createElement("tr");
          cells.forEach(c => {
            const cell = document.createElement(idx === 0 ? "th" : "td");
            cell.innerHTML = inlineMD(c);
            tr.appendChild(cell);
          });
          table.appendChild(tr);
        });
        out.push(table.outerHTML);
        continue;
      }

      // Listas
      const listMatch = line.match(/^\\s*((?:[-*+])\\s+|\\d+\\.\\s+)(.*)/);
      if (listMatch) {
        const ordered = /^\\s*\\d+\\.\\s+/.test(line);
        const tag = ordered ? "ol" : "ul";
        const list = document.createElement(tag);
        list.className = "md-list";

        while (i < lines.length) {
          const l = lines[i];
          const m = l.match(/^\\s*((?:[-*+])\\s+|\\d+\\.\\s+)(.*)/);
          if (!m) break;
          const raw = m[2];
          const task = raw.match(/^\\s*\\[( |x|X)\\]\\s*(.*)/);
          const li = document.createElement("li");
          if (task) {
            list.classList.add("md-task");
            const box = document.createElement("input");
            box.type = "checkbox";
            box.checked = /x/i.test(task[1]);
            box.disabled = true;
            const span = document.createElement("span");
            span.innerHTML = inlineMD(task[2]);
            li.appendChild(box);
            li.appendChild(span);
          } else {
            li.innerHTML = inlineMD(raw);
          }
          list.appendChild(li);
          i++;
        }
        out.push(list.outerHTML);
        continue;
      }

      // Parágrafos
      if (line.trim() === "") {
        i++;
        continue;
      }
      const p = document.createElement("p");
      p.innerHTML = inlineMD(line.trim());
      out.push(p.outerHTML);
      i++;
    }

    flushCode();
    return out.join("\\n\\n");
  }

  // — Substituição da função markdownToHTML
  console.log("🔄 NEBULA BEAUTY: substituindo markdownToHTML pelo parser completo...");
  window.markdownToHTML = renderMarkdown;

  // — (Opcional) Re-renderiza a interface para aplicar o novo parser
  setTimeout(() => {
    if (typeof window.refreshAll === "function") {
      window.refreshAll();
      console.log("✅ UI atualizada com o novo parser.");
    } else if (typeof window.renderLibrary === "function") {
      window.renderLibrary();
    } else if (typeof window.renderHero === "function") {
      window.renderHero();
    }
  }, 100);

  console.log("✅ NEBULA BEAUTY ENGINE ativado (apenas markdownToHTML substituído).");
})();
</script>`);