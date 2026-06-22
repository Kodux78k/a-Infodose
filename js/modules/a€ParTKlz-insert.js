(function(h, s = '#inject-here') {

  /* ═══════════════════════════════════════════════════════
     🧠 DOM INJECTOR · KOBLLUX TEMPLATE LOADER
     - Converte HTML string em DOM real
     - Injeta no container alvo
     - Reexecuta scripts dinamicamente
  ═══════════════════════════════════════════════════════ */

  const parser = new DOMParser();
  const doc = parser.parseFromString(h, 'text/html');

  const fragment = document.createDocumentFragment();
  const target = document.querySelector(s) || document.body;

  /* ─────────────────────────────────────────────
     📦 MOVE NODES → FRAGMENT → TARGET
  ───────────────────────────────────────────── */
  Array.from(doc.body.childNodes).forEach(node => {
    fragment.appendChild(document.importNode(node, true));
  });

  target.appendChild(fragment);

  /* ─────────────────────────────────────────────
     ⚙️ SCRIPT REHYDRATION (IMPORTANTE)
     Recria <script> dinamicamente para execução
  ───────────────────────────────────────────── */
  Array.from(doc.querySelectorAll('script')).forEach(oldScript => {

    const newScript = document.createElement('script');

    for (const attr of oldScript.attributes) {
      newScript.setAttribute(attr.name, attr.value);
    }

    newScript.textContent = oldScript.textContent;
    document.body.appendChild(newScript);
  });

})(`

/* ═══════════════════════════════════════════════════════
   🌌 KOBLLUX TRINITY ENGINE · TEMPLATE CORE
   Versão: Injection Shell UI
═══════════════════════════════════════════════════════ */

<!DOCTYPE html>
<html lang="pt-BR">
<head>

  <!-- ─────────────────────────────────────────────
       META CONFIG
  ───────────────────────────────────────────── -->
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">

  <title>KOBLLUX Trinity Engine</title>

  <style>

  /* ═══════════════════════════════════════════
     🎨 ROOT THEME TOKENS
  ═══════════════════════════════════════════ */
  :root{
    --bg:#050811;
    --c1:#00f5ff;
    --c2:#ff4bff;
    --glow:rgba(0,245,255,.45);
  }

  /* ───────────────────────────────────────────
     RESET BASE
  ─────────────────────────────────────────── */
  *{
    margin:0;
    padding:0;
    box-sizing:border-box;
  }

  html, body{
    width:100%;
    height:100%;
    overflow:hidden;

    background:
      radial-gradient(circle at top, rgba(0,245,255,.08), transparent 40%),
      radial-gradient(circle at bottom, rgba(255,75,255,.08), transparent 40%),
      var(--bg);

    font-family: Inter, Arial, sans-serif;
  }

  /* ═══════════════════════════════════════════
     🌌 PARTICLE LAYER SYSTEM
  ═══════════════════════════════════════════ */
  #particles{
    position:fixed;
    inset:0;
    z-index:0;
  }

  #bgParticles{
    width:100%;
    height:100%;
    display:block;
  }

  /* ═══════════════════════════════════════════
     🧿 CENTER LOGO PANEL
  ═══════════════════════════════════════════ */
  .center{
    position:fixed;
    inset:0;

    display:flex;
    align-items:center;
    justify-content:center;

    pointer-events:none;
  }

  .logo{
    padding:40px;
    border-radius:24px;

    color:white;
    text-align:center;

    background: rgba(255,255,255,.04);
    backdrop-filter: blur(18px);

    border: 1px solid rgba(255,255,255,.12);

    box-shadow:
      0 0 40px rgba(0,245,255,.18),
      0 0 80px rgba(255,75,255,.12);
  }

  .logo h1{
    font-size:clamp(2rem,6vw,5rem);
    letter-spacing:8px;
  }

  .logo p{
    margin-top:10px;
    opacity:.75;
    letter-spacing:2px;
  }

  /* ═══════════════════════════════════════════
     🌐 UNIVERSAL LAYERS / Z-INDEX SYSTEM
  ═══════════════════════════════════════════ */

  body{
    position:relative;
    overflow-x:hidden;
  }

  #universe-viewport{
    position:relative;
    z-index:2;
  }

  #particles-js{
    position:fixed;
    inset:0;
    width:100%;
    height:100%;
    z-index:-1;
    pointer-events:auto;
    opacity:.85;
  }

  .screen-panel,
  header,
  #nav-indicator,
  #modal-overlay,
  #player-overlay{
    position:relative;
    z-index:2;
  }

  /* ✨ glow shader */
  #particles-js canvas{
    filter:
      drop-shadow(0 0 4px #00ffff66)
      drop-shadow(0 0 12px #ff00ff22);
  }

  </style>
</head>

<body>

  <!-- ═══════════════════════════════════════════
       🌟 AMBIENT GLOW SYSTEM
  ═══════════════════════════════════════════ -->
  <div id="glow-top" class="ambient-glow"></div>
  <div id="glow-bottom" class="ambient-glow"></div>

  <!-- ═══════════════════════════════════════════
       🌌 PARTICLE CANVAS LAYER
  ═══════════════════════════════════════════ -->
  <div id="particles">
    <canvas id="bgParticles"></canvas>
  </div>

  <!-- ═══════════════════════════════════════════
       ⚙️ MODULE LOADER
  ═══════════════════════════════════════════ -->
  <script type="module">

  import {
  }
  from "https://www.infodose.com.br/js/modules/a€ParTKlz.js";

  </script>

</body>
</html>

`); 