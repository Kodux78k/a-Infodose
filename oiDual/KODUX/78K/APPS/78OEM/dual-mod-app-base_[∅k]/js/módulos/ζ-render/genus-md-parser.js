/* ═══════════════════════════════════════════════════════════
   §RENDER · genus-md-parser · O Parser Markdown Rico
   Arquétipo: GENUS · Prefixo: genus_
   Hookado em: solus_nebula.loadDocument
   ═══════════════════════════════════════════════════════════ */
(function(){
"use strict";
if(window.genus_md_parser) return;

/* ─── escape ─── */
const kodux_esc = s => String(s ?? '')
  .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
  .replace(/"/g,'&quot;');

const kodux_autolink = u => {
  try{
    const x = new URL(u);
    return `<a href="${x.href}" target="_blank" rel="noopener">${x.href}</a>`;
  }catch{ return u; }
};

/* ─── inline ─── */
function genus_inline(s){
  let h = kodux_esc(s);
  h = h.replace(/!\[([^\]]*)\]\(([^)]+)\)/g,
    (_,a,src)=>`<img class="md-img" alt="${a}" src="${src}">`);
  h = h.replace(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g,
    (_,t,url)=>`<a href="${url}" target="_blank" rel="noopener">${t}</a>`);
  h = h.replace(/\[([^\]]+)\]\(action:([a-z0-9_:\-.]+)\)/gi,
    (_,t,a)=>`<button class="btn action" data-action="${a}">${t}</button>`);
  h = h.replace(/\[\[btn:([a-z0-9_:\-.]+)(?:\|([^\]]+))?\]\]/gi,
    (_,a,l)=>`<button class="btn action" data-action="${a}">${l||a}</button>`);
  h = h.replace(/`([^`]+)`/g, (_,c)=>`<code class="code-inline">${c}</code>`);
  h = h.replace(/\*\*([^*]+)\*\*/g,'<strong>$1</strong>');
  h = h.replace(/(^|[^*])\*([^*]+)\*(?!\*)/g,'$1<em>$2</em>');
  h = h.replace(/~~([^~]+)~~/g,'<del>$1</del>');
  h = h.replace(/\bhttps?:\/\/[^\s<)]+/g, kodux_autolink);
  return h;
}

/* ─── detectores ─── */
const dv_isHr        = l => /^\s*(?:---|\*\*\*|___)\s*$/.test(l);
const dv_isQuote     = l => /^\s*>\s?/.test(l);
const dv_isTableRow  = l => /^\s*\|.*\|\s*$/.test(l);
const dv_isFenceEnd  = l => /^\s*(?:```|''')\s*$/.test(l);

function artemis_listInfo(l){
  const m = l.match(/^(\s*)([-+*]|\d+\.)\s+(.*)$/);
  if(!m) return null;
  return {
    indent: m[1].replace(/\t/g,'    ').length,
    ordered: /^\d+\.$/.test(m[2]),
    text: m[3]
  };
}

function kodux_splitRow(l){
  let s = l.trim();
  if(s.startsWith('|')) s = s.slice(1);
  if(s.endsWith('|'))   s = s.slice(0,-1);
  return s.split('|').map(x=>x.trim());
}
const kodux_isSep = l => {
  const c = kodux_splitRow(l);
  return c.length && c.every(x=>/^:?-{3,}:?$/.test(x));
};

/* ─── parsers ─── */
function genus_parseTable(lines,start){
  const rows = []; let i = start;
  while(i < lines.length && dv_isTableRow(lines[i])){ rows.push(kodux_splitRow(lines[i])); i++; }
  if(rows.length < 2 || !kodux_isSep(lines[start+1])) return null;
  const header = rows[0], body = rows.slice(2);

  const t = document.createElement('table');
  t.className = 'md-table';
  const thead = document.createElement('thead');
  const trh = document.createElement('tr');
  header.forEach(c=>{
    const th = document.createElement('th');
    th.innerHTML = genus_inline(c); trh.appendChild(th);
  });
  thead.appendChild(trh); t.appendChild(thead);

  const tbody = document.createElement('tbody');
  body.forEach(r=>{
    const tr = document.createElement('tr');
    header.forEach((_,k)=>{
      const td = document.createElement('td');
      td.innerHTML = genus_inline(r[k]||''); tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });
  t.appendChild(tbody);

  const wrap = document.createElement('div');
  wrap.className = 'md-table-wrap';
  wrap.appendChild(t);
  return {node: wrap, next: i};
}

function genus_parseLists(lines,start){
  const first = artemis_listInfo(lines[start]);
  if(!first) return null;
  const root = document.createElement(first.ordered ? 'ol' : 'ul');
  root.className = 'md-list';

  const stack = [{indent:first.indent, ordered:first.ordered, list:root, lastLi:null}];
  let i = start;

  while(i < lines.length){
    const info = artemis_listInfo(lines[i]); if(!info) break;
    while(stack.length > 1 && info.indent < stack[stack.length-1].indent) stack.pop();
    let cur = stack[stack.length-1];

    if(info.indent > cur.indent && cur.lastLi){
      const nested = document.createElement(info.ordered ? 'ol' : 'ul');
      nested.className = 'md-list';
      cur.lastLi.appendChild(nested);
      stack.push({indent:info.indent, ordered:info.ordered, list:nested, lastLi:null});
      cur = stack[stack.length-1];
    } else if(info.indent === cur.indent && info.ordered !== cur.ordered && cur.lastLi){
      const nested = document.createElement(info.ordered ? 'ol' : 'ul');
      nested.className = 'md-list';
      cur.lastLi.appendChild(nested);
      stack.push({indent:info.indent, ordered:info.ordered, list:nested, lastLi:null});
      cur = stack[stack.length-1];
    }

    const li = document.createElement('li');
    const task = info.text.match(/^\[( |x|X)\]\s*(.*)$/);
    if(task){
      cur.list.classList.add('md-task');
      const box = document.createElement('input');
      box.type='checkbox'; box.checked=/x/i.test(task[1]); box.disabled = true;
      const span = document.createElement('span');
      span.innerHTML = genus_inline(task[2]);
      li.append(box, span);
    } else {
      li.innerHTML = genus_inline(info.text);
    }
    cur.list.appendChild(li);
    cur.lastLi = li;
    i++;
  }
  return {node: root, next: i};
}

function genus_parseFence(lines,start){
  const m = lines[start].match(/^\s*(?:```|''')([\w-]*)\s*$/);
  if(!m) return null;
  const lang = (m[1]||'').toLowerCase();
  const buf = []; let i = start + 1;
  while(i < lines.length && !dv_isFenceEnd(lines[i])){ buf.push(lines[i]); i++; }
  const raw = buf.join('\n');

  if(lang === 'html-raw'){
    const w = document.createElement('div');
    w.className = 'raw-html-card';
    w.innerHTML = raw;
    return {node:w, next: i < lines.length ? i+1 : i};
  }

  const pre = document.createElement('pre');
  pre.className = 'md-code';
  const code = document.createElement('code');
  if(lang) code.className = 'language-' + lang;
  code.textContent = raw;
  pre.appendChild(code);
  return {node:pre, next: i < lines.length ? i+1 : i};
}

/* ─── render principal ─── */
function genus_render_md(md){
  if(md == null) return '';
  const text = String(md);
  if(!text.trim()) return '';

  const lines = text.replace(/\r\n?/g,'\n').split('\n');
  const out = [];
  let i = 0, para = [];

  const flushP = () => {
    if(!para.length) return;
    const joined = para.join(' ').trim();
    if(joined){
      const p = document.createElement('p');
      p.innerHTML = genus_inline(joined);
      out.push(p.outerHTML);
    }
    para = [];
  };

  while(i < lines.length){
    const line = lines[i];
    if(!line.trim()){ flushP(); i++; continue; }

    const fence = genus_parseFence(lines, i);
    if(fence){ flushP(); out.push(fence.node.outerHTML); i = fence.next; continue; }

    const hm = line.match(/^(#{1,6})\s+(.*)$/);
    if(hm){
      flushP();
      const h = document.createElement('h' + hm[1].length);
      h.innerHTML = genus_inline(hm[2]);
      out.push(h.outerHTML); i++; continue;
    }

    if(i+1 < lines.length && /^[=-]{3,}\s*$/.test(lines[i+1]) && line.trim()){
      flushP();
      const lv = lines[i+1].trim()[0] === '=' ? 1 : 2;
      const h = document.createElement('h' + lv);
      h.innerHTML = genus_inline(line.trim());
      out.push(h.outerHTML); i += 2; continue;
    }

    if(dv_isHr(line)){ flushP(); out.push('<hr class="hr">'); i++; continue; }

    if(dv_isQuote(line)){
      flushP();
      const buf = [];
      while(i < lines.length && dv_isQuote(lines[i])){
        buf.push(lines[i].replace(/^\s*>\s?/,''));
        i++;
      }
      const bq = document.createElement('blockquote');
      bq.className = 'bq';
      bq.innerHTML = '<span class="copy-hint">Copiar</span>' + genus_inline(buf.join(' '));
      out.push(bq.outerHTML); continue;
    }

    const call = line.match(/^\s*(::(info|warn|tip|note|success|danger)|::\.|:|\?)\s+(.*)$/i);
    if(call){
      let kind = 'note';
      if(call[1] === '::.') kind = 'aside';
      else if(call[1] === ':') kind = 'note';
      else if(call[1] === '?') kind = 'question';
      else kind = (call[2] || 'info').toLowerCase();

      const buf = [call[3]];
      let j = i + 1;
      while(j < lines.length){
        const nx = lines[j].trim();
        if(!nx) break;
        if(/^\s*(::(info|warn|tip|note|success|danger)|::\.|:|\?)\s+/.test(nx)) break;
        buf.push(nx); j++;
      }
      i = j;
      const d = document.createElement('div');
      d.className = 'callout ' + kind;
      d.innerHTML = '<span class="copy-hint">Copiar</span>' + genus_inline(buf.join(' '));
      out.push(d.outerHTML); continue;
    }

    if(dv_isTableRow(line)){
      const t = genus_parseTable(lines, i);
      if(t){ flushP(); out.push(t.node.outerHTML); i = t.next; continue; }
    }

    if(artemis_listInfo(line)){
      const l = genus_parseLists(lines, i);
      if(l){ flushP(); out.push(l.node.outerHTML); i = l.next; continue; }
    }

    para.push(line.trim());
    i++;
  }
  flushP();
  return out.join('\n');
}

/* ─── hook em solus_nebula.loadDocument ─── */
function genus_rerender_slices(){
  const Neb = window.solus_nebula;
  if(!Neb || !Neb.state || !Neb.state.slices) return;
  const slices = Neb.state.slices;
  if(!slices.length) return;
  const stage = document.getElementById('solus_stage');
  if(!stage) return;
  const bodies = stage.querySelectorAll('slice .solus_slice-body');
  bodies.forEach((body, i)=>{
    const raw = slices[i];
    if(raw == null) return;
    body.innerHTML = genus_render_md(raw);
  });
  if(window.artemis_enhance) window.artemis_enhance.decorate(stage);
}

function genus_install_hook(){
  const Neb = window.solus_nebula;
  if(!Neb || typeof Neb.loadDocument !== 'function') return false;
  if(Neb.__genusRichHooked) return true;
  Neb.__genusRichHooked = true;
  const _orig = Neb.loadDocument.bind(Neb);
  Neb.loadDocument = function(text, title){
    _orig(text, title);
    try{ genus_rerender_slices(); }
    catch(err){ console.warn('[genus-md-parser] re-render:', err); }
  };
  console.log('[genus-md-parser] hookado em solus_nebula.loadDocument ✓');
  return true;
}

if(!genus_install_hook()){
  let tries = 0;
  const t = setInterval(()=>{
    if(genus_install_hook() || ++tries > 60) clearInterval(t);
  }, 50);
}

if(document.readyState === 'loading'){
  document.addEventListener('DOMContentLoaded', ()=>{ genus_install_hook(); genus_rerender_slices(); }, {once:true});
} else {
  genus_install_hook();
  genus_rerender_slices();
}

/* ─── export ─── */
window.genus_md_parser = {
  render: genus_render_md,
  rerenderSlices: genus_rerender_slices,
  version: 1
};

console.log('[genus-md-parser] online · parser rico pronto');
})();