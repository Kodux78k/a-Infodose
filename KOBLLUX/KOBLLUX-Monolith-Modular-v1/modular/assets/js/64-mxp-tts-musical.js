
(function(){
  "use strict";
  if(window.__MXP_TTS_MUSICAL__) return;
  window.__MXP_TTS_MUSICAL__ = true;

  var RX_SFX = /\[\[sfx\|([^\]]+)\]\]/gi;
  var RX_BTN = /\[\[btn:([a-zA-Z0-9_\-:]+)(?:\|([^\]]+))?\]\]/g;
  var RX_ACT = /\[([^\]]+)\]\(action:([a-zA-Z0-9_\-:]+)\)/g;

  /* ---- augmenta KOBTextEvents existente (se faltar archRe / strip de tokens) ---- */
  try{
    if(window.KOBTextEvents){
      var KTE = window.KOBTextEvents;
      if(typeof KTE.archNames !== "function"){
        KTE.archNames = function(){
          try{ if(window.ARCH_LIST && window.ARCH_LIST.length) return window.ARCH_LIST.slice(); }catch(e){}
          return ["ATLAS","NOVA","VITALIS","PULSE","ARTEMIS","SERENA","KAOS","GENUS","LUMINE","SOLUS","RHEA","AION","KODUX","BLLUE","JESUS","KOBLLUX","INFODOSE"];
        };
      }
      if(typeof KTE.archRe !== "function"){
        var _cache = { key: "", re: null };
        KTE.archRe = function(){
          var names = KTE.archNames();
          var key = names.join("|");
          if(_cache.key === key && _cache.re) return _cache.re;
          var n = names.map(function(x){ return String(x).replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); });
          var re = new RegExp("(?:^|[\\s\\[\\](){}<>|·—\\-:])(" + n.join("|") + ")(?=[\\s\\]\\[(){}<>|·—\\-:!?.,;]|$)", "gi");
          _cache = { key: key, re: re };
          return re;
        };
      }
      if(!KTE.__musicalAugmented){
        KTE.__musicalAugmented = true;
        var _origClean = KTE.cleanForTTS;
        KTE.cleanForTTS = function(s){
          var out = String(s || "").replace(RX_SFX, " ").replace(RX_BTN, " ").replace(RX_ACT, "$1");
          try{ out = _origClean.call(KTE, out); }catch(e){ out = out.replace(KTE.archRe(), " "); }
          return out.replace(/[ \t]+/g, " ").replace(/\n{3,}/g, "\n\n").trim();
        };
      }
    }
  }catch(e){}

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
  function archRegex(){
    try{
      if(window.KOBTextEvents && typeof window.KOBTextEvents.archRe === "function") return window.KOBTextEvents.archRe();
    }catch(e){}
    var n = archNames().map(function(x){ return String(x).replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); });
    return new RegExp("(?:^|[\\s\\[\\](){}<>|·—\\-:])(" + n.join("|") + ")(?=[\\s\\]\\[(){}<>|·—\\-:!?.,;]|$)", "gi");
  }
  /* strip deterministico: remove sfx/btn tokens + arquétipos (igual ao cleanForTTS aumentado) */
  function stripAll(s){
    var out = String(s || "").replace(RX_SFX, " ").replace(RX_BTN, " ").replace(RX_ACT, "$1");
    try{
      if(window.KOBTextEvents && typeof window.KOBTextEvents.cleanForTTS === "function"){
        out = window.KOBTextEvents.cleanForTTS(out);
      } else {
        out = out.replace(archRegex(), " ");
      }
    }catch(e){ out = out.replace(archRegex(), " "); }
    return out.replace(/[ \t]+/g, " ").replace(/\n{3,}/g, "\n\n").trim();
  }

  function fireSfx(desc){
    try{
      if(window.KOBSonoro && typeof window.KOBSonoro.sfx === "function"){
        window.KOBSonoro.sfx(desc);
      } else {
        window.dispatchEvent(new CustomEvent("kob:sfx", { detail: { desc: desc } }));
      }
    }catch(e){}
  }

  function musicalStage(u, next){
    try{
      if(!u || !u.text){ return next ? next(u) : undefined; }
      var raw = String(u.text);

      /* 1) captura tokens [[sfx|desc]] com charIndex no texto cru */
      var sfx = [], m;
      RX_SFX.lastIndex = 0;
      while((m = RX_SFX.exec(raw)) !== null){
        sfx.push({ desc: m[1].trim(), rawIndex: m.index });
      }

      /* 2) arquétipos detectados (únicos, na ordem de aparecimento) */
      var arches = [], seen = {};
      var ar = archRegex(), am;
      while((am = ar.exec(raw)) !== null){
        var name = String(am[1] || "").toUpperCase();
        if(name && !seen[name]){ seen[name] = true; arches.push(name); }
      }

      /* 3) texto final que será falado */
      var finalText = stripAll(raw);
      u.text = finalText;

      /* 4) mapeia cada sfx para charIndex no texto final (prefixo stripado = posição exata) */
      var pending = sfx.map(function(s){
        var prefix = raw.slice(0, s.rawIndex);
        return { desc: s.desc, charIndex: stripAll(prefix).length, fired: false };
      }).sort(function(a, b){ return a.charIndex - b.charIndex; });

      /* 5) wrappers preservando handlers existentes */
      var oldStart = u.onstart, oldEnd = u.onend, oldBoundary = u.onboundary, oldError = u.onerror;
      var timers = [];

      u.onstart = function(ev){
        try{
          arches.forEach(function(arch, i){
            timers.push(setTimeout(function(){
              try{ window.dispatchEvent(new CustomEvent("kob:arch", { detail: { arch: arch, origin: "tts-musical" } })); }catch(e){}
            }, i * 120));
          });
          var playing = false;
          try{ playing = !!(window.KOBSonoro && typeof window.KOBSonoro.isPlaying === "function" && window.KOBSonoro.isPlaying()); }catch(e){}
          if(!playing && window.__trilha_on !== true){
            try{ window.dispatchEvent(new CustomEvent("kob:track:request", { detail: { when: "now", origin: "tts-musical" } })); }catch(e){}
            try{ if(window.KOBMPC && typeof window.KOBMPC.play === "function") window.KOBMPC.play(); }catch(e){}
            try{ if(window.KOBSonoro && typeof window.KOBSonoro.start === "function") window.KOBSonoro.start(); }catch(e){}
            try{ if(window.KOBSonoro && typeof window.KOBSonoro.play === "function") window.KOBSonoro.play(); }catch(e){}
          }
          /* fallback: se onboundary nao disparar, agenda SFX por setTimeout proporcional */
          var rate = Number(u.rate) || 1;
          var estSec = Math.max(2, finalText.length / (13.5 * rate));
          pending.forEach(function(s){
            if(s.charIndex <= 0){ s.fired = true; fireSfx(s.desc); return; }
            var at = (s.charIndex / Math.max(1, finalText.length)) * estSec * 1000;
            timers.push(setTimeout(function(){
              if(!s.fired){ s.fired = true; fireSfx(s.desc); }
            }, at + 200));
          });
        }catch(e){}
        if(typeof oldStart === "function"){ try{ oldStart.call(u, ev); }catch(e){} }
      };

      u.onboundary = function(ev){
        try{
          var ci = (ev && typeof ev.charIndex === "number") ? ev.charIndex : Infinity;
          for(var i = 0; i < pending.length; i++){
            var s = pending[i];
            if(!s.fired && ci >= s.charIndex){ s.fired = true; fireSfx(s.desc); }
          }
        }catch(e){}
        if(typeof oldBoundary === "function"){ try{ oldBoundary.call(u, ev); }catch(e){} }
      };

      function cleanup(){
        timers.forEach(function(t){ clearTimeout(t); });
        timers = [];
        for(var i = 0; i < pending.length; i++) pending[i].fired = true;
      }
      u.onend = function(ev){ cleanup(); if(typeof oldEnd === "function"){ try{ oldEnd.call(u, ev); }catch(e){} } };
      u.onerror = function(ev){ cleanup(); if(typeof oldError === "function"){ try{ oldError.call(u, ev); }catch(e){} } };
    }catch(e){}
    return next ? next(u) : undefined;
  }

  /* integração: preferencialmente via KOB_SPEECH (prioridade 0, roda antes do clean em prio 1), senão wrap do speak */
  try{
    if(window.KOB_SPEECH && typeof window.KOB_SPEECH.use === "function"){
      if(!window.KOB_SPEECH.has || !window.KOB_SPEECH.has("musical")){
        window.KOB_SPEECH.use("musical", 0, musicalStage);
      }
    } else if("speechSynthesis" in window && !window.speechSynthesis.speak.__musicalHooked){
      var orig = window.speechSynthesis.speak;
      window.speechSynthesis.speak = function(u){ musicalStage(u, function(x){ orig.call(window.speechSynthesis, x); }); };
      window.speechSynthesis.speak.__musicalHooked = true;
    }
  }catch(e){}
  console.log("[MXP] TTS Musical (arch stagger + sfx onboundary + auto-track) pronto");
})();
