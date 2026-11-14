
(function(){
  var qsa = function(s, r){ return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  /* 1) wrapLists: envolve ul/ol de topo em .list-card (defensivo; mdToHtml ja faz isso) */
  function wrapLists(r){
    qsa("ul, ol", r).forEach(function(el){
      if(el.closest && el.closest(".list-card, .ascii-card, .no-beauty")) return;
      if(el.parentElement && el.parentElement.tagName === "LI") return;
      if(el.parentElement && el.parentElement.classList && el.parentElement.classList.contains("list-card")) return;
      var wrap = document.createElement("div");
      wrap.className = "list-card";
      el.parentNode.insertBefore(wrap, el);
      wrap.appendChild(el);
    });
  }
  /* 2) enhanceASCII: <pre> com cara de ASCII art -> figure.ascii-card */
  function enhanceASCII(r){
    qsa("pre", r).forEach(function(pre){
      if(pre.closest && pre.closest(".ascii-card, .no-beauty")) return;
      var t = (pre.textContent || "").trim();
      if(!t) return;
      var box = (t.match(/[─│┌┐└┘╭╮╰╯═╬╠╣╦╩]/g) || []).length;
      var grid = /[-_=+*#|]{3,}/.test(t);
      var multi = t.split("\n").length >= 2;
      if(box >= 4 || (multi && grid && box >= 1)){
        var fig = document.createElement("figure");
        fig.className = "ascii-card";
        var p = document.createElement("pre");
        p.textContent = t;
        fig.appendChild(p);
        if(pre.replaceWith){ pre.replaceWith(fig); }
        else if(pre.parentNode){ pre.parentNode.replaceChild(fig, pre); }
      }
    });
  }
  /* 3) copy-hint em pre/bq/callout */
  function addHints(r){
    qsa("pre.md-code, blockquote.bq, .callout, pre", r).forEach(function(host){
      if(host.querySelector && host.querySelector(".copy-hint")) return;
      host.style.position = "relative";
      var sp = document.createElement("span");
      sp.className = "copy-hint";
      sp.textContent = "COPIAR";
      host.appendChild(sp);
    });
  }
  /* 4) converte tokens [[btn:]] e [[sfx|]] remanescentes em botoes (TreeWalker, espelha Bloco F) */
  var RX = /\[\[(sfx\|[^\]]+|btn:[a-zA-Z0-9_\-:]+(?:\|[^\]]*)?)\]\]/g;
  function skip(el){
    var p = el;
    while(p && p.nodeType === 1){
      var t = p.tagName;
      if(t === "CODE" || t === "PRE" || t === "SCRIPT" || t === "STYLE" || t === "TEXTAREA" || t === "INPUT") return true;
      p = p.parentElement;
    }
    return false;
  }
  function replaceNode(node){
    var text = node.nodeValue;
    if(!text) return;
    RX.lastIndex = 0;
    if(!RX.test(text)) return;
    RX.lastIndex = 0;
    var frag = document.createDocumentFragment();
    var last = 0, m;
    while((m = RX.exec(text)) !== null){
      if(m.index > last) frag.appendChild(document.createTextNode(text.slice(last, m.index)));
      var inner = m[1];
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "btn action";
      if(inner.indexOf("sfx|") === 0){
        btn.setAttribute("data-sfx", inner.slice(4).trim());
        btn.textContent = "\u266B " + inner.slice(4).trim();
      } else {
        var rest = inner.slice(4);
        var pipe = rest.indexOf("|");
        var act = (pipe >= 0 ? rest.slice(0, pipe) : rest).trim();
        var label = (pipe >= 0 ? rest.slice(pipe + 1) : act).trim();
        btn.setAttribute("data-action", act);
        btn.textContent = label || act;
      }
      frag.appendChild(btn);
      last = RX.lastIndex;
    }
    if(last < text.length) frag.appendChild(document.createTextNode(text.slice(last)));
    if(node.parentNode) node.parentNode.replaceChild(frag, node);
  }
  function scanTokens(r){
    try{
      var root = r || document.body;
      if(!root) return;
      var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
        acceptNode: function(n){
          if(!n.nodeValue) return NodeFilter.FILTER_REJECT;
          if(skip(n.parentElement)) return NodeFilter.FILTER_REJECT;
          RX.lastIndex = 0;
          return RX.test(n.nodeValue) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
        }
      });
      var nodes = [];
      while(walker.nextNode()) nodes.push(walker.currentNode);
      nodes.forEach(replaceNode);
    }catch(e){}
  }
  function beautify(){
    var md = document.querySelector(".md") || document.body;
    wrapLists(md);
    enhanceASCII(md);
    addHints(md);
    scanTokens(document.body);
  }
  /* 5) click delegation: SFX/ACTION -> postMessage pro pai; copy-hint -> copiar; resto -> KOB_TTS */
  document.addEventListener("click", function(e){
    var sfxBtn = e.target.closest && e.target.closest("[data-sfx]");
    if(sfxBtn){
      e.preventDefault();
      parent.postMessage({ type: "KOB_SFX", desc: sfxBtn.getAttribute("data-sfx") || "" }, "*");
      return;
    }
    var actBtn = e.target.closest && e.target.closest("button.btn.action[data-action]");
    if(actBtn){
      e.preventDefault();
      parent.postMessage({ type: "NEBULA_ACTION", action: actBtn.getAttribute("data-action") || "", label: (actBtn.textContent || "").trim() }, "*");
      return;
    }
    if(e.target && e.target.classList && e.target.classList.contains("copy-hint")){
      e.preventDefault();
      var host = e.target.parentElement;
      var txt = (host ? (host.innerText || "") : "").replace(/COPIAR/gi, "").trim();
      try{ if(navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(txt); }catch(err){}
      return;
    }
    if(e.target.closest && e.target.closest("a, button, input, textarea, select")) return;
    var t = e.target.closest && e.target.closest("p, li, h1, h2, h3, blockquote, .callout");
    if(!t) return;
    var s = (t.innerText || "").replace(/COPIAR/gi, "").trim();
    if(s.length > 1) parent.postMessage({ type: "KOB_TTS", text: s }, "*");
  });
  /* boot + re-beautifica com debounce (evita loop do MutationObserver) */
  var running = false;
  function debounced(){
    if(running) return;
    running = true;
    setTimeout(function(){ beautify(); running = false; }, 120);
  }
  if(document.readyState === "loading") document.addEventListener("DOMContentLoaded", beautify);
  else beautify();
  try{ new MutationObserver(debounced).observe(document.body, { childList: true, subtree: true }); }catch(e){}
})();
