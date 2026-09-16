(function(){
  "use strict";
  if (window.__NEBULA_RICH__) return;
  window.__NEBULA_RICH__ = true;
  const esc = s => String(s ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  const autoLink = u => { try { const x = new URL(u); return `<a href="${x.href}" target="_blank" rel="noopener">${x.href}</a>`; } catch { return u; } };
  function inline(s){
    let h = esc(s);
    h = h.replace(/!\[([^\]]*)\]\(([^)]+)\)/g,(_,a,src)=>`<img class="md-img" alt="${a}" src="${src}">`);
    h = h.replace(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g,(_,t,url)=>`<a href="${url}" target="_blank" rel="noopener">${t}</a>`);
    h = h.replace(/\[([^\]]+)\]\(action:([a-z0-9_:\-.]+)\)/gi,(_,t,a)=>`<button class="btn action" data-action="${a}">${t}</button>`);
    h = h.replace(/\[\[btn:([a-z0-9_:\-.]+)(?:\|([^\]]+))?\]\]/gi,(_,a,l)=>`<button class="btn action" data-action="${a}">${l||a}</button>`);
    h = h.replace(/`([^`]+)`/g,(_,c)=>`<code class="code-inline">${c}</code>`);
    h = h.replace(/\*\*([^*]+)\*\*/g,'<strong>$1</strong>');
    h = h.replace(/(^|[^*])\*([^*]+)\*(?!\*)/g,'$1<em>$2</em>');
    h = h.replace(/~~([^~]+)~~/g,'<del>$1</del>');
    h = h.replace(/\bhttps?:\/\/[^\s<)]+/g, autoLink);
    return h;
  }
  const isHr = l => /^\s*(?:---|\*\*\*|___)\s*$/.test(l);
  const isQuote = l => /^\s*>\s?/.test(l);
  const isTableRow = l => /^\s*\|.*\|\s*$/.test(l);
  const isFenceEnd = l => /^\s*(?:```|''')\s*$/.test(l);
  function listInfo(l){ const m = l.match(/^(\s*)([-+*]|\d+\.)\s+(.*)$/); if (!m) return null; return { indent: m[1].replace(/\t/g,'    ').length, ordered: /^\d+\.$/.test(m[2]), text: m[3] }; }
  function splitRow(l){ let s = l.trim(); if (s.startsWith('|')) s = s.slice(1); if (s.endsWith('|')) s = s.slice(0,-1); return s.split('|').map(x=>x.trim()); }
  const isSep = l => { const c = splitRow(l); return c.length && c.every(x=>/^:?-{3,}:?$/.test(x)); };
  function parseTable(lines,start){
    const rows = []; let i = start;
    while (i < lines.length && isTableRow(lines[i])) { rows.push(splitRow(lines[i])); i++; }
    if (rows.length < 2 || !isSep(lines[start+1])) return null;
    const header = rows[0], body = rows.slice(2);
    const t = document.createElement('table'); t.className = 'md-table';
    const thead = document.createElement('thead'); const trh = document.createElement('tr');
    header.forEach(c=>{ const th = document.createElement('th'); th.innerHTML = inline(c); trh.appendChild(th); });
    thead.appendChild(trh); t.appendChild(thead);
    const tbody = document.createElement('tbody');
    body.forEach(r=>{ const tr = document.createElement('tr'); header.forEach((_,k)=>{ const td = document.createElement('td'); td.innerHTML = inline(r[k]||''); tr.appendChild(td); }); tbody.appendChild(tr); });
    t.appendChild(tbody);
    const wrap = document.createElement('div'); wrap.className = 'md-table-wrap'; wrap.appendChild(t);
    return { node: wrap, next: i };
  }
  function parseLists(lines,start){
    const first = listInfo(lines[start]); if (!first) return null;
    const root = document.createElement(first.ordered ? 'ol' : 'ul'); root.className = 'md-list';
    const stack = [{ indent:first.indent, ordered:first.ordered, list:root, lastLi:null }];
    let i = start;
    while (i < lines.length){
      const info = listInfo(lines[i]); if (!info) break;
      while (stack.length > 1 && info.indent < stack[stack.length-1].indent) stack.pop();
      let cur = stack[stack.length-1];
      if (info.indent > cur.indent && cur.lastLi){ const nested = document.createElement(info.ordered ? 'ol' : 'ul'); nested.className = 'md-list'; cur.lastLi.appendChild(nested); stack.push({ indent:info.indent, ordered:info.ordered, list:nested, lastLi:null }); cur = stack[stack.length-1]; }
      else if (info.indent === cur.indent && info.ordered !== cur.ordered && cur.lastLi){ const nested = document.createElement(info.ordered ? 'ol' : 'ul'); nested.className = 'md-list'; cur.lastLi.appendChild(nested); stack.push({ indent:info.indent, ordered:info.ordered, list:nested, lastLi:null }); cur = stack[stack.length-1]; }
      const li = document.createElement('li');
      const task = info.text.match(/^\[( |x|X)\]\s*(.*)$/);
      if (task){ cur.list.classList.add('md-task'); const box = document.createElement('input'); box.type='checkbox'; box.checked=/x/i.test(task[1]); box.disabled = true; const span = document.createElement('span'); span.innerHTML = inline(task[2]); li.append(box, span); }
      else { li.innerHTML = inline(info.text); }
      cur.list.appendChild(li); cur.lastLi = li; i++;
    }
    return { node: root, next: i };
  }
  function parseFence(lines,start){
    const m = lines[start].match(/^\s*(?:```|''')([\w-]*)\s*$/); if (!m) return null;
    const lang = (m[1]||'').toLowerCase(); const buf = []; let i = start + 1;
    while (i < lines.length && !isFenceEnd(lines[i])) { buf.push(lines[i]); i++; }
    const raw = buf.join('\n');
    if (lang === 'html-raw'){ const w = document.createElement('div'); w.className = 'raw-html-card'; w.innerHTML = raw; return { node:w, next: i < lines.length ? i+1 : i }; }
    const pre = document.createElement('pre'); pre.className = 'md-code';
    const code = document.createElement('code'); if (lang) code.className = 'language-' + lang; code.textContent = raw; pre.appendChild(code);
    return { node:pre, next: i < lines.length ? i+1 : i };
  }
  function render(md){
    if (md == null) return ''; const text = String(md); if (!text.trim()) return '';
    const lines = text.replace(/\r\n?/g,'\n').split('\n'); const out = []; let i = 0, para = [];
    const flushP = () => { if (!para.length) return; const joined = para.join(' ').trim(); if (joined){ const p = document.createElement('p'); p.innerHTML = inline(joined); out.push(p.outerHTML); } para = []; };
    while (i < lines.length){
      const line = lines[i]; if (!line.trim()){ flushP(); i++; continue; }
      const fence = parseFence(lines, i); if (fence){ flushP(); out.push(fence.node.outerHTML); i = fence.next; continue; }
      const hm = line.match(/^(#{1,6})\s+(.*)$/);
      if (hm){ flushP(); const h = document.createElement('h' + hm[1].length); h.innerHTML = inline(hm[2]); out.push(h.outerHTML); i++; continue; }
      if (i+1 < lines.length && /^[=-]{3,}\s*$/.test(lines[i+1]) && line.trim()){ flushP(); const lv = lines[i+1].trim()[0] === '=' ? 1 : 2; const h = document.createElement('h' + lv); h.innerHTML = inline(line.trim()); out.push(h.outerHTML); i += 2; continue; }
      if (isHr(line)){ flushP(); out.push('<hr class="hr">'); i++; continue; }
      if (isQuote(line)){ flushP(); const buf = []; while (i < lines.length && isQuote(lines[i])){ buf.push(lines[i].replace(/^\s*>\s?/,'')); i++; } const bq = document.createElement('blockquote'); bq.className = 'bq'; bq.innerHTML = '<span class="copy-hint">Copiar</span>' + inline(buf.join(' ')); out.push(bq.outerHTML); continue; }
      const call = line.match(/^\s*(::(info|warn|tip|note|success|danger)|::\.|:|\?)\s+(.*)$/i);
      if (call){
        let kind = 'note';
        if (call[1] === '::.') kind = 'aside'; else if (call[1] === ':') kind = 'note'; else if (call[1] === '?') kind = 'question'; else kind = (call[2] || 'info').toLowerCase();
        const buf = [call[3]]; let j = i + 1;
        while (j < lines.length){ const nx = lines[j].trim(); if (!nx) break; if (/^\s*(::(info|warn|tip|note|success|danger)|::\.|:|\?)\s+/.test(nx)) break; buf.push(nx); j++; }
        i = j; const d = document.createElement('div'); d.className = 'callout ' + kind; d.innerHTML = '<span class="copy-hint">Copiar</span>' + inline(buf.join(' ')); out.push(d.outerHTML); continue;
      }
      if (isTableRow(line)){ const t = parseTable(lines, i); if (t){ flushP(); out.push(t.node.outerHTML); i = t.next; continue; } }
      if (listInfo(line)){ const l = parseLists(lines, i); if (l){ flushP(); out.push(l.node.outerHTML); i = l.next; continue; } }
      para.push(line.trim()); i++;
    }
    flushP(); return out.join('\n');
  }
  window.NebulaRender = { render, version: 1 };
  function decorate(root){
    if (!root || !root.querySelectorAll) return;
    root.querySelectorAll('.md-list').forEach(el => { if (el.closest('.list-card, .ascii-card, .no-beauty')) return; if (el.parentElement && el.parentElement.closest('.md-list')) return; if (el.parentElement && el.parentElement.classList.contains('list-card')) return; const wrap = document.createElement('div'); wrap.className = 'list-card'; el.parentNode.insertBefore(wrap, el); wrap.appendChild(el); });
    root.querySelectorAll('pre.md-code').forEach(pre => { if (pre.closest('.ascii-card, .no-beauty')) return; const t = (pre.textContent || '').trim(); if (!t) return; const boxChars = (t.match(/[─│┌┐└┘╭╮╰╯═╬╠╣╦╩]/g) || []).length; const gridLike = /[-_=+*#\\/|]{3,}/.test(t); const multiline = t.split('\n').length >= 2; if (boxChars >= 4 || (multiline && gridLike && boxChars >= 1)){ const fig = document.createElement('figure'); fig.className = 'ascii-card'; const p = document.createElement('pre'); p.textContent = t; fig.appendChild(p); pre.replaceWith(fig); } });
  }
  document.addEventListener('click', async e => {
    const hint = e.target.closest('#readerApp .copy-hint');
    if (hint){ const host = hint.parentElement; if (!host) return; const txt = host.innerText.replace(/Copiar/i,'').trim(); try { await navigator.clipboard.writeText(txt); window.KBLX_TOAST?.('Copiado ✓'); } catch(_){} return; }
    const btn = e.target.closest('#readerApp button.btn.action[data-action]');
    if (btn){ const action = btn.dataset.action; document.dispatchEvent(new CustomEvent('NEBULA_ACTION', { detail:{ action, button: btn } })); if (window.MXP && typeof window.MXP.fire === 'function'){ window.MXP.fire(action, { source:'nebula-slice', button: btn }); } }
  }, { passive:true });
  function reRenderAllSlices(){
    const Neb = window.Nebula; if (!Neb || !Neb.state || !Neb.state.slices) return;
    const slices = Neb.state.slices; if (!slices.length) return;
    const stage = document.getElementById('sliceStage'); if (!stage) return;
    const bodies = stage.querySelectorAll('slice .slice-body');
    bodies.forEach((body, i) => { const raw = slices[i]; if (raw == null) return; body.innerHTML = render(raw); });
    decorate(stage);
  }
  function install(){
    const Neb = window.Nebula; if (!Neb || typeof Neb.loadDocument !== 'function') return false;
    if (Neb.__richHooked) return true; Neb.__richHooked = true;
    const _orig = Neb.loadDocument.bind(Neb);
    Neb.loadDocument = function(text, title){ _orig(text, title); try { reRenderAllSlices(); } catch (err){ console.warn('[NebulaRich] re-render:', err); } };
    console.log('[NebulaRich] hookado em Nebula.loadDocument ✓');
    return true;
  }
  if (!install()){ let tries = 0; const t = setInterval(() => { if (install() || ++tries > 60) clearInterval(t); }, 50); }
  function boot(){ install(); reRenderAllSlices(); }
  if (document.readyState === 'loading'){ document.addEventListener('DOMContentLoaded', boot, { once:true }); } else { boot(); }
  window.NebulaRich = { render, decorate, reRenderAllSlices, version: 1 };
  console.log('[NebulaRich] parser rico + decorator online ✓');
})();