(function(h,s='#inject-here'){const p=new DOMParser(),c=p.parseFromString(h,'text/html'),f=document.createDocumentFragment(),t=document.querySelector(s)||document.body;Array.from(c.body.childNodes).forEach(n=>f.appendChild(document.importNode(n,true)));t.appendChild(f);Array.from(c.querySelectorAll('script')).forEach(x=>{const n=document.createElement('script');for(const a of x.attributes)n.setAttribute(a.name,a.value);n.textContent=x.textContent;document.body.appendChild(n)})})(`<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">

<title>KOBLLUX Trinity Engine</title>

<style>

:root{
  --bg:#050811;
  --c1:#00f5ff;
  --c2:#ff4bff;
  --glow:rgba(0,245,255,.45);
}

*{
  margin:0;
  padding:0;
  box-sizing:border-box;
}

html,
body{
  width:100%;
  height:100%;
  overflow:hidden;
  background:
    radial-gradient(
      circle at top,
      rgba(0,245,255,.08),
      transparent 40%
    ),
    radial-gradient(
      circle at bottom,
      rgba(255,75,255,.08),
      transparent 40%
    ),
    var(--bg);

  font-family:
    Inter,
    Arial,
    sans-serif;
}

#particles{
  position:fixed;
  inset:0;
}

#bgParticles{
  width:100%;
  height:100%;
  display:block;
}

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

  background:
    rgba(255,255,255,.04);

  backdrop-filter:
    blur(18px);

  border:
    1px solid rgba(255,255,255,.12);

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
   KOBLLUX PARTICLES LAYER
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
  z-index:0;
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

/* brilho suave */

#particles-js canvas{
  filter:
    drop-shadow(0 0 4px #00ffff66)
    drop-shadow(0 0 12px #ff00ff22);
}

</style>
</head>
<body>

<!-- KOBLLUX PARTICLES -->

<div id="glow-top" class="ambient-glow"></div>
<div id="glow-bottom" class="ambient-glow"></div>

<div id="particles">
  <canvas id="bgParticles"></canvas>
</div>



<script type="module">

import {
}
from "https://www.infodose.com.br/js/modules/a€ParTKlz.js";


</script>

</body>
</html>`);
