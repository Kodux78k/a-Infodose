(function(){
  "use strict";
  if (window.NebulaRender) return;

  /* ---------- escape / helpers ---------- */
  const esc = s => String(s ?? "")
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;');

  function autoLink(u){
    try { const x = new URL(u); return `<a href="${x.href}" target="_blank" rel="noopener">${x.href}</a>`; }
    catch { return u; }
  }

  /* ---------- inline ---------- */
  function inline(s){
    let h = esc(s);
    h = h.replace(/!\[([^\]]*)\]\(([^)]+)\)/g,
      (_,a,src)=>`<img class="md-img" alt="${a}" src="${src}">`);
    h = h.replace(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g,
      (_,t,url)=>`<a href="${url}" target="_blank" rel="noopener">${t}</a>`);
    h = h.replace(/\[([^\]]+)\]\(action:([a-z0-9_:\-.]+)\)/gi,
      (_,t,a)=>`<button class="btn action" data-action="${a}">${t}</button>`);
    h = h.replace(/\[\[btn:([a-z0-9_:\-.]+)(?:\|([^\]]+))?\]\]/gi,
      (_,a,l)=>`<button class="btn action" data-action="${a}">${l||a}</button>`);
    h = h.replace(/`([^`]+)`/g,
      (_,c)=>`<code class="code-inline">${c}</code>`);
    h = h.replace(/\*\*([^*]+)\*\*/g,'<strong>$1</strong>');
    h = h.replace(/(^|[^*])\*([^*]+)\*(?!\*)/g,'$1<em>$2</em>');
    h = h.replace(/~~([^~]+)~~/g,'<del>$1</del>');
    h = h.replace(/\bhttps?:\/\/[^\s<)]+/g, autoLink);
    return h;
  }

  /* ---------- detectores de linha ---------- */
  const isHr        = l => /^\s*(?:---|\*\*\*|___)\s*$/.test(l);
  const isQuote     = l => /^\s*>\s?/.test(l);
  const isTableRow  = l => /^\s*\|.*\|\s*$/.test(l);
  const isFenceOpen = l => /^\s*(?:```|''')([\w-]*)\s*$/.test(l);
  const isFenceEnd  = l => /^\s*(?:```|''')\s*$/.test(l);
  const listInfo = l => {
    const m = l.match(/^(\s*)([-+*]|\d+\.)\s+(.*)$/);
    if (!m) return null;
    return {
      indent: m[1].replace(/\t/g,'    ').length,
      ordered: /^\d+\.$/.test(m[2]),
      text: m[3]
    };
  };

  /* ---------- tabelas ---------- */
  function splitRow(l){
    let s = l.trim();
    if (s.startsWith('|')) s = s.slice(1);
    if (s.endsWith('|'))   s = s.slice(0,-1);
    return s.split('|').map(x=>x.trim());
  }
  function isSep(l){
    const c = splitRow(l);
    return c.length && c.every(x=>/^:?-{3,}:?$/.test(x));
  }
  function parseTable(lines,start){
    const rows = []; let i = start;
    while (i < lines.length && isTableRow(lines[i])) { rows.push(splitRow(lines[i])); i++; }
    if (rows.length < 2 || !isSep(lines[start+1])) return null;
    const header = rows[0], body = rows.slice(2);

    const t = document.createElement('table');
    t.className = 'md-table';
    const thead = document.createElement('thead');
    const trh = document.createElement('tr');
    header.forEach(c=>{
      const th = document.createElement('th'); th.innerHTML = inline(c); trh.appendChild(th);
    });
    thead.appendChild(trh); t.appendChild(thead);

    const tbody = document.createElement('tbody');
    body.forEach(r=>{
      const tr = document.createElement('tr');
      header.forEach((_,k)=>{
        const td = document.createElement('td'); td.innerHTML = inline(r[k]||''); tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });
    t.appendChild(tbody);

    const wrap = document.createElement('div');
    wrap.className = 'md-table-wrap';
    wrap.appendChild(t);
    return { node: wrap, next: i };
  }

  /* ---------- listas (com aninhamento por indentação) ---------- */
  function parseLists(lines,start){
    const first = listInfo(lines[start]); if (!first) return null;
    const root = document.createElement(first.ordered ? 'ol' : 'ul');
    root.className = 'md-list';

    const stack = [{ indent:first.indent, ordered:first.ordered, list:root, lastLi:null }];
    let i = start;

    while (i < lines.length){
      const info = listInfo(lines[i]); if (!info) break;
      while (stack.length > 1 && info.indent < stack[stack.length-1].indent) stack.pop();

      let cur = stack[stack.length-1];

      if (info.indent > cur.indent && cur.lastLi){
        const nested = document.createElement(info.ordered ? 'ol' : 'ul');
        nested.className = 'md-list';
        cur.lastLi.appendChild(nested);
        stack.push({ indent:info.indent, ordered:info.ordered, list:nested, lastLi:null });
        cur = stack[stack.length-1];
      } else if (info.indent === cur.indent && info.ordered !== cur.ordered && cur.lastLi){
        const nested = document.createElement(info.ordered ? 'ol' : 'ul');
        nested.className = 'md-list';
        cur.lastLi.appendChild(nested);
        stack.push({ indent:info.indent, ordered:info.ordered, list:nested, lastLi:null });
        cur = stack[stack.length-1];
      }

      const li = document.createElement('li');
      const task = info.text.match(/^\[( |x|X)\]\s*(.*)$/);
      if (task){
        root.classList.add('md-task');
        cur.list.classList.add('md-task');
        const box = document.createElement('input');
        box.type='checkbox'; box.checked=/x/i.test(task[1]); box.disabled = true;
        const span = document.createElement('span');
        span.innerHTML = inline(task[2]);
        li.append(box, span);
      } else {
        li.innerHTML = inline(info.text);
      }
      cur.list.appendChild(li);
      cur.lastLi = li;
      i++;
    }
    return { node: root, next: i };
  }

  /* ---------- code fences ---------- */
  function parseFence(lines,start){
    const m = lines[start].match(/^\s*(?:```|''')([\w-]*)\s*$/);
    if (!m) return null;
    const lang = (m[1]||'').toLowerCase();
    const buf = []; let i = start + 1;
    while (i < lines.length && !isFenceEnd(lines[i])) { buf.push(lines[i]); i++; }
    const raw = buf.join('\n');

    if (lang === 'html-raw'){
      const w = document.createElement('div');
      w.className = 'raw-html-card';
      w.innerHTML = raw;
      return { node:w, next: i < lines.length ? i+1 : i };
    }

    const pre  = document.createElement('pre');
    pre.className = 'md-code';
    const code = document.createElement('code');
    if (lang) code.className = 'language-' + lang;
    code.textContent = raw;
    pre.appendChild(code);
    return { node:pre, next: i < lines.length ? i+1 : i };
  }

  /* ---------- render principal ---------- */
  function render(md){
    if (!md) return '';
    const lines = String(md).replace(/\r\n?/g,'\n').split('\n');
    const out = [];
    let i = 0;
    let para = [];

    const flushP = () => {
      if (!para.length) return;
      const p = document.createElement('p');
      p.innerHTML = inline(para.join(' ').trim());
      out.push(p.outerHTML);
      para = [];
    };

    while (i < lines.length){
      const line = lines[i];

      /* vazio */
      if (!line.trim()){ flushP(); i++; continue; }

      /* fence */
      const fence = parseFence(lines, i);
      if (fence){ flushP(); out.push(fence.node.outerHTML); i = fence.next; continue; }

      /* heading ATX */
      const hm = line.match(/^(#{1,6})\s+(.*)$/);
      if (hm){
        flushP();
        const h = document.createElement('h' + hm[1].length);
        h.innerHTML = inline(hm[2]);
        out.push(h.outerHTML);
        i++; continue;
      }

      /* heading Setext */
      if (i+1 < lines.length &&
          /^[=-]{3,}\s*$/.test(lines[i+1]) &&
          line.trim()){
        flushP();
        const lv = lines[i+1].trim()[0] === '=' ? 1 : 2;
        const h = document.createElement('h' + lv);
        h.innerHTML = inline(line.trim());
        out.push(h.outerHTML);
        i += 2; continue;
      }

      /* hr */
      if (isHr(line)){ flushP(); out.push('<hr class="hr">'); i++; continue; }

      /* blockquote */
      if (isQuote(line)){
        flushP();
        const buf = [];
        while (i < lines.length && isQuote(lines[i])){
          buf.push(lines[i].replace(/^\s*>\s?/,''));
          i++;
        }
        const bq = document.createElement('blockquote');
        bq.className = 'bq';
        bq.innerHTML = inline(buf.join(' '));
        out.push(bq.outerHTML);
        continue;
      }

      /* callout */
      const call = line.match(/^\s*(::(info|warn|tip|note|success|danger)|::\.|:|\?)\s+(.*)$/i);
      if (call){
        let kind = 'note';
        if (call[1] === '::.') kind = 'aside';
        else if (call[1] === ':') kind = 'note';
        else if (call[1] === '?') kind = 'question';
        else kind = (call[2] || 'info').toLowerCase();

        const buf = [call[3]];
        let j = i + 1;
        while (j < lines.length){
          const nx = lines[j].trim();
          if (!nx) break;
          if (/^\s*(::(info|warn|tip|note|success|danger)|::\.|:|\?)\s+/.test(nx)) break;
          buf.push(nx); j++;
        }
        i = j;
        const d = document.createElement('div');
        d.className = 'callout ' + kind;
        d.innerHTML = '<span class="copy-hint">Copiar</span>' + inline(buf.join(' '));
        out.push(d.outerHTML);
        continue;
      }

      /* tabela */
      if (isTableRow(line)){
        const t = parseTable(lines, i);
        if (t){ flushP(); out.push(t.node.outerHTML); i = t.next; continue; }
      }

      /* lista */
      if (listInfo(line)){
        const l = parseLists(lines, i);
        if (l){ flushP(); out.push(l.node.outerHTML); i = l.next; continue; }
      }

      para.push(line.trim());
      i++;
    }
    flushP();
    return out.join('\n\n');
  }

  window.NebulaRender = { render, version: 1 };
  console.log('[NebulaRender] parser rico online (tabelas · listas · callouts · task · details)');
})();