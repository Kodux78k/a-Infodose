

(()=>{'use strict';
if(window.__LIST_BEAUTY_V2__) return; window.__LIST_BEAUTY_V2__=true;

const q=(s,r=document)=>[...r.querySelectorAll(s)];

const wrapLists=(root=document)=>{
  const lists = q('ul,ol',root).filter(el=>{
    if(el.closest('nav,menu,.no-beauty,.editor,.toolbar')) return false;
    if(el.classList.contains('ul-neo')||el.classList.contains('ol-neo')) return false; // já cuidado
    return true;
  });
  for(const el of lists){
    const isOL = el.tagName==='OL';
    el.classList.add(isOL?'ol-neo':'ul-neo');
    // preserva estilos existentes do usuário
    if(!el.parentElement.classList.contains('list-card')){
      const wrap = document.createElement('div');
      wrap.className='list-card';
      el.replaceWith(wrap); wrap.appendChild(el);
    }
  }
};

const asciiScore = t=>{
  const box=/[─│┌┐└┘╭╮╰╯═╬╠╣╦╩]+/g, grid=/[-_=+*#\\/|]{3,}/g;
  const L=t.split('\n'); let h=0;
  for(const ln of L){ if(box.test(ln)||grid.test(ln)||ln.trim().startsWith('> ')) h++; }
  return h>=Math.max(2,Math.ceil(L.length*0.2));
};

const enhanceASCII=(root=document)=>{
  const cand=new Set([...q('pre',root),...q('code.language-text, code[class*="language-plaintext"]',root)]);
  q('p',root).forEach(p=>{ const x=p.innerText||''; if(x.includes('\n')&&asciiScore(x)) cand.add(p); });
  for(const el of cand){
    if(el.closest('.ascii-card,.no-beauty')) continue;
    const txt=(el.innerText||'').trim(); if(!asciiScore(txt)) continue;
    const fig=document.createElement('figure'); fig.className='ascii-card';
    const pre=document.createElement('pre'); pre.textContent=txt; fig.appendChild(pre);
    if(!el.closest('pre')){ const fc=document.createElement('figcaption'); fc.className='ascii-cap'; fc.textContent='ASCII • renderizado em bloco'; fig.appendChild(fc); }
    el.replaceWith(fig);
  }
};

/* Heurística opcional: se o UL já tiver data-bullet="dash" ou class style-dash, mantém.
   Caso NÃO tenha, deixamos como diamante (padrão), para não interferir nos teus looks. */
const applyDashCapsuleByAttr=(root=document)=>{
  q('ul.ul-neo',root).forEach(ul=>{
    if(ul.matches('.style-dash,[data-bullet="dash"]')) return;
    // não força nada; o usuário decide via classe/atributo
  });
};

const run=(ctx=document)=>{
  wrapLists(ctx);
  enhanceASCII(ctx);
  applyDashCapsuleByAttr(ctx);
};

if(window.__RENDERBUS__?.on){
  window.__RENDERBUS__.on('after', run, {name:'list-ascii-beauty-v2', priority:95});
}else{
  (document.readyState==='loading') ? document.addEventListener('DOMContentLoaded',()=>run(document)) : run(document);
  new MutationObserver(m=>m.forEach(x=>x.addedNodes&&x.addedNodes.forEach(n=>n.nodeType===1&&run(n))))
    .observe(document.body,{childList:true,subtree:true});
}
})();


(()=>{'use strict';
const esc = s => String(s||'')
  .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');

function applySetext(lines,i){
  // Detecta "Título\n=====" (H1) ou "Subtítulo\n-----" (H2)
  if(i+1 < lines.length){
    const next = lines[i+1].trim();
    if(/^=+$/.test(next)) return { level: 1, text: lines[i].trim(), skip: 2 };
    if(/^-+$/.test(next)) return { level: 2, text: lines[i].trim(), skip: 2 };
  }
  return null;
}

// ------- Flat: sobrescreve helpers do autoBuild se existirem -------
if(typeof window.autoBuild==='function'){
  const abSrc = window.autoBuild.toString();
  if(!abSrc.includes('__TITLES_PATCHED__')){
    const _autoBuild = window.autoBuild;
    window.autoBuild = function(text){
      // wrap original com Setext + escape em H2
      const lines = String(text||'').replace(/\r\n?/g,'\n').split('\n');
      let i=0, rebuilt=[];
      while(i<lines.length){
        const l = lines[i];
        const set = applySetext(lines,i);
        if(set){ // converte para ATX
          rebuilt.push('#'.repeat(set.level)+' '+set.text);
          i+=set.skip; continue;
        }
        rebuilt.push(l); i++;
      }
      // sinaliza patch
      const marker='__TITLES_PATCHED__';
      const saved = window.__current_md;
      window.__current_md = (rebuilt.join('\n'));
      const out = _autoBuild(window.__current_md);
      // corrige todos os <summary><h2> com escape
      document.querySelectorAll('#root details.acc summary h2').forEach(h=>{
        h.innerHTML = esc(h.textContent||'');
      });
      window.__current_md = saved;
      return out;
    }
  }
}

// ------- Nested: adiciona escape no momento de criar seção -------
if(typeof window.autoBuildNested==='function'){
  const __origN = window.autoBuildNested;
  window.autoBuildNested = function(text){
    const escText = t => esc(t).replace(/\s+#+\s*$/,''); // remove hashes finais
    // monkey-patch: intercepta newSectionAt com escape
    const create = (lvl, title)=>{
      const details = document.createElement('details');
      details.className='acc'; details.open=false;
      const sum=document.createElement('summary');
      sum.innerHTML='<span class="chev"></span><h2>'+ escText(title) +'</h2>';
      const cont=document.createElement('div'); cont.className='sec';
      details.append(sum, cont);
      return {details, cont};
    };
    // roda original, depois faz um passe extra pros h2 existentes
    const out = __origN(text);
    document.querySelectorAll('#root details.acc summary h2').forEach(h=>{
      h.innerHTML = esc(h.textContent||'');
    });
    return out;
  }
}
})();


(()=>{'use strict';
function looksTitle(line){
  const t=line.trim();
  if(t.length<80 && /^[A-ZÁÂÃÀÉÊÍÓÔÕÚÜÇ0-9][^.!?]{2,}$/.test(t)) return true; // curto e sem pontuação final
  return false;
}
function isSubtitle(line){
  const t=line.trim();
  return t.length<90 && /[:—–-]\s+/.test(t); // “Título: subtítulo”
}
function bulletsNormalize(line){
  // 1) item → 1. item ; • item → - item
  return line
    .replace(/^\s*(\d+)[\)\]]\s+/,'$1. ')
    .replace(/^\s*[•·]\s+/,'- ');
}
function markdownifyPlain(text){
  const L=String(text||'').replace(/\r\n?/g,'\n').split('\n');
  if(/^\s*#\s+/.test(text)) return text; // já tem H1
  let out=[], seenH1=false, i=0;
  while(i<L.length){
    let line=L[i];

    // HR por longos traços
    if(/^\s*[—–-]{6,}\s*$/.test(line)){ out.push(''); out.push('---'); out.push(''); i++; continue; }

    // título/subtítulo heurístico
    if(!seenH1 && looksTitle(line)){
      out.push('# '+line.trim()); out.push(''); seenH1=true; i++; continue;
    }
    if(isSubtitle(line) && seenH1){
      out.push('## '+line.trim()); out.push(''); i++; continue;
    }

    // listas simples e numeradas
    line = bulletsNormalize(line);

    // “Termo: valor” vira lista de definição simples → callout
    const def = line.match(/^\s*([A-ZÁÂÃÀÉÊÍÓÔÕÚÜÇ].{1,40}):\s+(.+)$/);
    if(def){ out.push(':'+def[1]+' — '+def[2]); i++; continue; }

    // blocos de código heurísticos (muitas chaves/`;`)
    if(/[{;}=].{0,}$/.test(line) && (line.includes('function')||line.includes('=>'))){
      const buf=[line]; i++;
      while(i<L.length && L[i].trim()){
        buf.push(L[i]); i++;
        if(buf.length>1 && /;\s*$/.test(buf[buf.length-1])) break;
      }
      out.push('```js'); out.push(...buf); out.push('```'); out.push('');
      continue;
    }

    out.push(line); i++;
  }
  return out.join('\n');
}

if(typeof window.preprocessMD==='function'){
  const __orig = window.preprocessMD;
  window.preprocessMD = function(text){
    let t=String(text||'');
    // Se não há nenhum header e parece “texto corrido”, aplica markdownify
    const lacksHeaders = !/^\s*#{1,6}\s+/m.test(t) && !/^\s*\S+\n[-=]{3,}\s*$/m.test(t);
    const manyWords = (t.match(/\S+/g)||[]).length>40;
    if(lacksHeaders && manyWords) t = markdownifyPlain(t);
    return __orig(t);
  }
}
})();


(()=>{'use strict';
const STYLE_ID='INLINE_CSS_RENDER_SAFE_V2';
function appendSafe(css){
  if(!css || !css.trim()) return;
  let s=document.getElementById(STYLE_ID);
  if(!s){ s=document.createElement('style'); s.id=STYLE_ID; document.head.appendChild(s); }
  s.appendChild(document.createTextNode('\n'+css));
}
window.CSS_INNER_SAFE = {
  applyFromDOM(root=document){
    let css='';
    root.querySelectorAll('style[data-inline]').forEach(el=>{
      const t=(el.textContent||'').trim(); if(t) css+='\n'+t;
    });
    appendSafe(css);
  },
  applyFromHTML(html){
    if(!html) return;
    // só <style data-inline>…</style>
    const re=/<style[^>]*\bdata-inline\b[^>]*>([\s\S]*?)<\/style>/gi; let m, css='';
    while((m=re.exec(html))) css+='\n'+(m[1]||'');
    appendSafe(css);
  }
};
document.addEventListener('DOMContentLoaded',()=> CSS_INNER_SAFE.applyFromDOM());
})();

(()=>{'use strict';
function loadOnceCSS(href,id){return new Promise(ok=>{ if(document.getElementById(id)) return ok();
  const l=document.createElement('link'); l.id=id; l.rel='stylesheet'; l.href=href; l.onload=ok; document.head.appendChild(l); });}
function loadOnceJS(src,id){return new Promise(ok=>{ if(document.getElementById(id)) return ok();
  const s=document.createElement('script'); s.id=id; s.src=src; s.defer=true; s.onload=ok; document.head.appendChild(s); });}
async function ensureKaTeX(){ if(window.renderMathInElement) return;
  const CDN="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist";
  await loadOnceCSS(`${CDN}/katex.min.css`,'katex_css');
  await loadOnceJS(`${CDN}/katex.min.js`,'katex_js');
  await loadOnceJS(`${CDN}/contrib/auto-render.min.js`,'katex_auto_js');
}
async function run(root){
  await ensureKaTeX();
  if(typeof window.KaTeXRender==='function') return window.KaTeXRender(root||document.body);
  if(window.renderMathInElement) window.renderMathInElement(root||document.body,{
    delimiters:[
      {left:"$$",right:"$$",display:true},
      {left:"\$begin:math:display$",right:"\\$end:math:display$",display:true},
      {left:"$", right:"$", display:false},
      {left:"\$begin:math:text$", right:"\\$end:math:text$", display:false},
    ],
    throwOnError:false,
    ignoredTags:["script","noscript","style","textarea","code","pre"]
  });
}
// envelopa os builders
['autoBuild','autoBuildNested'].forEach(name=>{
  const f=window[name];
  if(typeof f==='function' && !f.__kxKaTeXWrapped){
    window[name]=function(text){ const out=f(text); run(document.getElementById('root')); return out; }
    window[name].__kxKaTeXWrapped=true;
  }
});
})();


(()=>{'use strict';
if(window.__TEXT_BEAUTY_V3__) return; window.__TEXT_BEAUTY_V3__=true;

/* Utilitários */
const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>[...r.querySelectorAll(s)];
const esc=(s)=>s.replace(/[&<>"']/g,m=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[m]));

/* 0) Toggle edição rápida */
let EDIT_ON=false;
const toggleEdit=()=>{
  EDIT_ON=!EDIT_ON;
  document.body.toggleAttribute('data-edit', EDIT_ON);
  const host = document.getElementById('CONTENT') || document.querySelector('main, article, .render, .reader, body');
  if(host) host.contentEditable = EDIT_ON ? 'plaintext-only' : 'false';
};
document.addEventListener('keydown',e=>{
  if((e.ctrlKey||e.metaKey) && e.key.toLowerCase()==='e'){ e.preventDefault(); toggleEdit(); }
});

/* 1) Key:Value negrito (palavra:) + parênteses + chips [ ]
   - roda apenas em blocos de texto (p, li) e não mexe dentro de code/pre */
const processInline = (root=document)=>{
  const targets = $$('p, li, h1, h2, h3, h4, h5, h6', root).filter(n=>!n.closest('pre, code, .no-beauty'));
  const rxKV = /(^|\s)([A-Za-zÀ-ÿ0-9_]+):(?=\s|$)/g; // Palavra:
  const rxParen = /\(([^\n)]+)\)/g;                  // ( … )
  const rxChip  = /\[\[([^[\]]+)\]\]|\[([^[\]]+)\]/g; // [[a]] | [a]

  for(const el of targets){
    // evita processar múltiplas vezes
    if(el.dataset.inlineProcessed==='1') continue;
    el.dataset.inlineProcessed='1';

    const html = el.innerHTML;
    if(/<pre|<code|contenteditable/i.test(html)) continue;

    let out = html;

    // 1. Palavra:  → <strong>
    out = out.replace(rxKV, (m, sp, key)=> `${sp}<strong class="kv-key">${key}:</strong>`);

    // 2. ( ... )   → span-paren
    out = out.replace(rxParen, (m, inside)=> `<span class="span-paren">(${inside})</span>`);

    // 3. [ ... ] / [[ ... ]]  → chip/chip-btn
    out = out.replace(rxChip, (m, dbl, sgl)=>{
      const label = (dbl||sgl||'').trim();
      return `<span class="${dbl?'chip-btn':'chip'}" data-chip="${esc(label)}">${esc(label)}</span>`;
    });

    el.innerHTML = out;
  }
};

/* 2) Perguntas → .q-card (frases que terminam com '?') */
const processQuestions=(root=document)=>{
  const paras = $$('p', root).filter(n=>!n.closest('.q-card, pre, code, .no-beauty'));
  for(const p of paras){
    const txt = (p.innerText||'').trim();
    if(txt.endsWith('?') && !p.dataset.qProcessed){
      p.dataset.qProcessed='1';
      const wrap=document.createElement('div'); wrap.className='q-card';
      wrap.innerHTML = `<div class="q-ico">?</div><div class="q-body">${esc(txt)}</div>`;
      p.replaceWith(wrap);
    }
  }
};

/* 3) Flow text: melhora texto corrido, cria heading leve se linha for "Algo:" sozinha */
const beautifyFlow=(root=document)=>{
  const container = root.querySelector('.flow-text') || root; // se já tiver classe, usa; senão aplica heurística suave
  $$('p', container).forEach(p=>{
    const t=(p.innerText||'').trim();
    if(/^[^:\n]{3,}:\s*$/.test(t)){ // linha que termina com ":" vira heading leve
      p.classList.add('kv-head');
    }
    // Quebra parágrafos absurdamente longos em dois (heurística)
    if(t.length>600 && t.includes('. ')){
      const mark = t.indexOf('. ', Math.floor(t.length/2));
      if(mark>0){
        const a=t.slice(0, mark+1), b=t.slice(mark+1);
        const p2=p.cloneNode(); p2.textContent=b.trim();
        p.textContent=a.trim();
        p.insertAdjacentElement('afterend', p2);
      }
    }
  });
};

/* 4) Listas copiáveis: badge + click copy */
const enableCopyLists=(root=document)=>{
  const lists = $$('.list-card', root);
  for(const card of lists){
    if(card.querySelector('.copy-badge')) continue;
    const badge = document.createElement('div');
    badge.className='copy-badge'; badge.textContent='copiar';
    card.appendChild(badge);
    card.addEventListener('click', e=>{
      // evita copiar quando clicou em link/botão dentro
      if(e.target.closest('a,button,.chip,.chip-btn')) return;
      const txt = [...card.querySelectorAll('li')].map(li=>li.innerText.trim()).join('\n');
      navigator.clipboard.writeText(txt).then(()=>{
        badge.textContent='copiado!'; setTimeout(()=>badge.textContent='copiar',1200);
      });
    }, {passive:true});
  }
};

/* 5) HTML/SVG pass-through
   - ```html-raw ... ``` → renderiza
   - <div data-raw-html>…(escapado)…</div> → renderiza
*/
const renderRawHTML=(root=document)=>{
  // code fence transform
  $$('pre code', root).forEach(code=>{
    const cls = (code.className||'').toLowerCase();
    if(cls.includes('language-html-raw') || cls.includes('lang-html-raw')){
      const raw = code.textContent;
      const box = document.createElement('div');
      box.className='raw-html-card';
      box.innerHTML = `<div class="raw-note">HTML/SVG renderizado a partir de bloco <code>html-raw</code></div>`;
      const slot = document.createElement('div');
      slot.className='raw-slot';
      // injeta SEM esc, assumindo que o autor confia no conteúdo
      slot.innerHTML = raw;
      box.appendChild(slot);
      const pre = code.closest('pre');
      pre.replaceWith(box);
    }
  });

  // <div data-raw-html>…</div>
  $$('div[data-raw-html]', root).forEach(div=>{
    const raw = div.textContent; // assume texto escapado pelo md
    const box = document.createElement('div'); box.className='raw-html-card';
    const slot = document.createElement('div'); slot.className='raw-slot';
    slot.innerHTML = raw;
    box.appendChild(slot);
    div.replaceWith(box);
  });
};

/* 6) Delegação de cliques para chips (colchetes) */
document.addEventListener('click', e=>{
  const chip = e.target.closest('.chip, .chip-btn');
  if(chip){
    const label = chip.dataset.chip||chip.textContent.trim();
    // dispara um evento customizado para teu bus/orquestrador
    const ev = new CustomEvent('chip:click', {detail:{label, source:'text-beauty-v3'}});
    document.dispatchEvent(ev);
  }
}, {passive:true});

/* 7) Orquestração */
const run=(ctx=document)=>{
  processInline(ctx);
  processQuestions(ctx);
  beautifyFlow(ctx);
  enableCopyLists(ctx);
  renderRawHTML(ctx);
};

if(window.__RENDERBUS__?.on){
  window.__RENDERBUS__.on('after', run, {name:'text-beauty-v3', priority: 96});
}else{
  (document.readyState==='loading') ? document.addEventListener('DOMContentLoaded',()=>run(document)) : run(document);
  new MutationObserver(m=>m.forEach(x=>x.addedNodes&&x.addedNodes.forEach(n=>n.nodeType===1&&run(n))))
    .observe(document.body,{childList:true,subtree:true});
}
})();



