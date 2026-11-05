
(function(){
  "use strict";
  if(window.__MXP_CLEAN_MARKED__) return;
  window.__MXP_CLEAN_MARKED__ = true;

  var RX_SFX = /\[\[sfx\|([^\]]+)\]\]/gi;
  var RX_BTN = /\[\[btn:([a-zA-Z0-9_\-:]+)(?:\|([^\]]+))?\]\]/g;
  var RX_ACT = /\[([^\]]+)\]\(action:([a-zA-Z0-9_\-:]+)\)/g;

  function escRe(x){ return String(x).replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }

  function archNames(){
    try{
      if(window.KOBTextEvents && typeof window.KOBTextEvents.archNames === "function"){
        var a = window.KOBTextEvents.archNames();
        if(a && a.length) return a;
      }
    }catch(e){}
    try{ if(window.ARCH_LIST && window.ARCH_LIST.length) return window.ARCH_LIST.slice(); }catch(e){}
    return ["ATLAS","NOVA","VITALIS","PULSE","ARTEMIS","SERENA","KAOS","GENUS","LUMINE","SOLUS","RHEA","AION","KODUX","BLLUE","JESUS","KOBLLUX","INFODOSE"];
  }

  /* garante archRe exposto (detecta TODAS as ocorrencias, marcadas ou nao) */
  try{
    if(window.KOBTextEvents && typeof window.KOBTextEvents.archRe !== "function"){
      var _cache = { key:"", re:null };
      window.KOBTextEvents.archRe = function(){
        var names = archNames();
        var key = names.join("|");
        if(_cache.key === key && _cache.re) return _cache.re;
        var n = names.map(escRe);
        var re = new RegExp("(?:^|[\\s\\[\\](){}<>|·—\\-:])(" + n.join("|") + ")(?=[\\s\\]\\[(){}<>|·—\\-:!?.,;]|$)", "gi");
        _cache = { key:key, re:re };
        return re;
      };
    }
  }catch(e){}

  /* REGRA NOVA: arquétipo em texto plano PERMANECE (é falado) e ainda dispara transição.
     Só é removido do texto lido se estiver marcado: [nome] [[nome]] **nome** <strong>nome</strong>.
     Tokens [[btn:]] e [[sfx|]] continuam sendo removidos inteiros. */
  function cleanMarked(s){
    var out = String(s || "").replace(RX_SFX, " ").replace(RX_BTN, " ").replace(RX_ACT, "$1");
    try{
      var names = archNames().map(escRe).join("|");
      if(names){
        var reBracket = new RegExp("\\[\\[?\\s*(?:" + names + ")\\s*\\]\\]?", "gi");
        var reBold    = new RegExp("\\*\\*(?:" + names + ")\\*\\*", "gi");
        var reStrong  = new RegExp("<strong>\\s*(?:" + names + ")\\s*</strong>", "gi");
        out = out.replace(reBracket, " ").replace(reBold, " ").replace(reStrong, " ");
      }
    }catch(e){}
    return out.replace(/[ \t]+/g, " ").replace(/\n{3,}/g, "\n\n").trim();
  }

  try{
    if(window.KOBTextEvents){
      window.KOBTextEvents.cleanForTTS = cleanMarked;
      window.KOBTextEvents.__markedOnly = true;
    }
    /* se existir KOB_SPEECH, nao precisa mudar nada — o estagio text-events chama cleanForTTS dinamicamente */
  }catch(e){}
  console.log("[MXP] cleanForTTS: arquétipo só removido se marcado (colchetes/negrito/strong); texto plano permanece e dispara transição");
})();
