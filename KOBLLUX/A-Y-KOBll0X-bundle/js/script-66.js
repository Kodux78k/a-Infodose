
(function(){
  "use strict";
  if(window.__MXP_HEADER_TRILHA__) return;
  window.__MXP_HEADER_TRILHA__ = true;

  var toast = function(m){ try{ if(window.KBLX_TOAST) window.KBLX_TOAST(m); else console.log("[toast]", m); }catch(e){}; };
  var LBL_ON  = "\uD83C\uDFB5 Trilha";      /* 🎵 */
  var LBL_OFF = "\u23F8 Pausar";            /* ⏸ */
  var LBL_IMP = "\uD83D\uDCC1";             /* 📂 */

  function isPlaying(){
    try{ return !!(window.KOBSonoro && typeof window.KOBSonoro.isPlaying === "function" && window.KOBSonoro.isPlaying()); }catch(e){ return false; }
  }
  function setState(on){
    window.__trilha_on = !!on;
    try{ window.dispatchEvent(new CustomEvent("kob:track:state", { detail:{ on:!!on, origin:"header-trilha" } })); }catch(e){}
    syncButtons();
  }
  function playTrilha(){
    try{ if(typeof window.startSonoroPlayback === "function"){ window.startSonoroPlayback(); setState(true); return; } }catch(e){}
    var b = document.querySelector('[data-action="play-sonoro"]');
    if(b){ b.click(); setState(true); return; }
    try{ window.dispatchEvent(new CustomEvent("kob:track:request", { detail:{ when:"now", origin:"header-trilha" } })); }catch(e){}
    setState(true);
  }
  function pauseTrilha(){
    try{ if(typeof window.stopSonoroPlayback === "function"){ window.stopSonoroPlayback(); setState(false); return; } }catch(e){}
    try{ window.dispatchEvent(new CustomEvent("kob:track:pause", { detail:{ origin:"header-trilha" } })); }catch(e){}
    setState(false);
  }
  function toggle(){ if(window.__trilha_on || isPlaying()) pauseTrilha(); else playTrilha(); }

  /* ---- CSS mínimo ---- */
  try{
    var st = document.createElement("style");
    st.textContent =
      "#mxpTrilhaFab,#mxpImpFab{position:fixed;right:14px;z-index:99999;font:700 12px/1 system-ui,sans-serif;padding:9px 13px;border-radius:999px;border:1px solid rgba(0,242,255,.5);background:rgba(8,12,20,.85);color:#00f2ff;cursor:pointer;box-shadow:0 6px 18px rgba(0,0,0,.5);backdrop-filter:blur(6px);transition:transform .15s,background .15s;}" +
      "#mxpTrilhaFab{bottom:78px;}#mxpImpFab{bottom:28px;font-size:16px;padding:9px 11px;}" +
      "#mxpTrilhaFab.active{background:rgba(0,242,255,.22);color:#fff;border-color:#00f2ff;}" +
      "#mxpTrilhaFab:active,#mxpImpFab:active{transform:scale(.94);}";
    document.head.appendChild(st);
  }catch(e){}

  /* ---- botão flutuante de trilha ---- */
  var fab = document.createElement("button");
  fab.type = "button";
  fab.id = "mxpTrilhaFab";
  fab.textContent = LBL_ON;
  fab.addEventListener("click", function(e){ e.stopPropagation(); toggle(); });
  document.body.appendChild(fab);

  /* ---- botão Importar JSON ---- */
  var imp = document.createElement("button");
  imp.type = "button";
  imp.id = "mxpImpFab";
  imp.textContent = LBL_IMP;
  imp.title = "Importar JSON de trilha (KOBLLUX MPC Fusion)";
  var input = document.createElement("input");
  input.type = "file";
  input.accept = ".json,application/json";
  input.style.display = "none";
  imp.addEventListener("click", function(e){ e.stopPropagation(); input.click(); });
  input.addEventListener("change", function(){
    var f = input.files && input.files[0];
    input.value = "";
    if(!f) return;
    try{
      f.text().then(function(txt){
        var obj;
        try{ obj = JSON.parse(txt); }catch(err){ toast("JSON inválido"); return; }
        var padsOk = obj && Array.isArray(obj.pads) && obj.pads.length >= 16;
        var patOk = obj && obj.patterns && (obj.patterns.A || obj.patterns.B || obj.patterns.C || obj.patterns.D);
        if(!padsOk && !patOk){ toast("JSON inválido"); return; }
        var nome = obj.name || obj.stamp || "Trilha importada";
        try{
          if(window.KOBMPC && typeof window.KOBMPC.loadPreset === "function"){
            window.KOBMPC.loadPreset(obj);
          } else if(window.KOBSonoro && typeof window.KOBSonoro.loadPreset === "function"){
            window.KOBSonoro.loadPreset(obj);
          } else {
            window.dispatchEvent(new CustomEvent("kob:mpc:preset", { detail: obj }));
          }
        }catch(e){}
        /* play automático */
        setTimeout(function(){
          if(!isPlaying()) playTrilha();
        }, 250);
        toast("Trilha carregada: " + String(nome).slice(0,40));
      }).catch(function(){ toast("Falha ao ler arquivo"); });
    }catch(e){ toast("Falha ao ler arquivo"); }
  });
  document.body.appendChild(imp);
  document.body.appendChild(input);

  /* ---- sincroniza estado nos botões (fab + botões de música existentes) ---- */
  function syncButtons(){
    var on = !!window.__trilha_on;
    fab.textContent = on ? LBL_OFF : LBL_ON;
    fab.classList.toggle("active", on);
    try{
      document.querySelectorAll('[data-action="play-sonoro"], .music-btn, #musicBtn, #musicBtnTop, #sonoroPlayBtn').forEach(function(b){
        b.classList.toggle("playing", on);
        b.classList.toggle("active", on);
      });
    }catch(e){}
  }
  try{
    window.addEventListener("kob:track:state", function(e){
      var on = e && e.detail && (e.detail.on === true || e.detail.on === false) ? e.detail.on : isPlaying();
      window.__trilha_on = !!on;
      syncButtons();
    });
  }catch(e){}

  /* ---- hook nos botões de música existentes: após clique, sonda estado por ~1.8s ---- */
  try{
    document.querySelectorAll('[data-action="play-sonoro"], .music-btn, #musicBtn, #musicBtnTop, #sonoroPlayBtn').forEach(function(b){
      b.addEventListener("click", function(){
        [120, 400, 800, 1400, 1900].forEach(function(t){
          setTimeout(function(){ setState(isPlaying()); }, t);
        });
      });
    });
  }catch(e){}

  /* ---- polling leve de sincronização (2s) ---- */
  setInterval(function(){
    var p = isPlaying();
    if(p !== !!window.__trilha_on){ setState(p); }
  }, 2000);

  setState(isPlaying());
  console.log("[MXP] Header Trilha pronto — botão flutuante toggle + Importar JSON (MPC Fusion)");
})();
