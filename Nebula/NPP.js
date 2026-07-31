(function(bundle,s='#inject-here'){
const p=new DOMParser();
const c=p.parseFromString(
bundle,
'text/html'
);
const t=
document.querySelector(s)
||document.body;
// CSS
Array.from(
c.querySelectorAll('style')
)
.forEach(style=>{
const n=
document.createElement('style');
n.textContent=
style.textContent;
document.head.appendChild(n);
});
// HTML
const f=
document.createDocumentFragment();
Array.from(
c.body.childNodes
)
.forEach(node=>{
if(node.nodeName!=='SCRIPT'){
f.appendChild(
document.importNode(node,true)
);
}
});
t.appendChild(f);
// JS
Array.from(
c.querySelectorAll('script')
)
.forEach(x=>{
const n=
document.createElement('script');
for(
const a of x.attributes
)
n.setAttribute(
a.name,
a.value
);
n.textContent=
x.textContent;
document.body.appendChild(n);
});
})(`<html lang="pt-BR"><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>Nebula Pro — Listen to PDFs</title>

<!-- PWA METADATA & VIEWPORT FIX -->
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover, user-scalable=no">
<meta name="theme-color" content="#0f0f11">

<!-- iOS Support -->
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<link rel="apple-touch-icon" href="./icon-192.png">

<!-- Manifest -->
<link rel="manifest" href="./manifest.json">

<!-- CSS Safe Area Fix -->
<style>
  html, body {
    margin: 0; padding: 0;
    width: 100%; height: 100%;
  }
  body {
    min-height: 100vh;
    min-height: 100dvh;
    padding-top: env(safe-area-inset-top);
    padding-bottom: env(safe-area-inset-bottom);
    padding-left: env(safe-area-inset-left);
    padding-right: env(safe-area-inset-right);
  }
</style>

<style>
        :root {
          --z-base: 0;
          --z-content: 100;
          --z-widget: 500;
          --z-overlay: 1000;
          --z-system: 5000;
          /* Variáveis do Orb e Arquétipos */
          --kob-voice-primary: #85f;
          --kob-voice-secondary: #8cf;
          --kob-voice-glow: 0 0 22px #7bd4ff66;
          --kob-voice-bg-soft: transparent;
        }

/* ===== FIX STACK ORDER ===== */

#libCard{
  position:absolute !important;

  top:92px;
  right:0;

  z-index:1 !important;

  opacity:.92;

  pointer-events:auto;
}

.copycard,
.win-frame,
.response-container,
iframe,
.overlay,
#motorDock{
  position:relative;
  z-index:20 !important;
  isolation:isolate;
}

      </style>

<style>
  :root{
    --bg1:#2a1b62; --bg2:#0e2c4d;
    --accent1:#7a57ff; --accent2:#5cc6ff;
    --card: rgba(255,255,255,0.06);
    --stroke: rgba(255,255,255,0.12);
    --muted: rgba(255,255,255,0.75);
    --soft:  rgba(255,255,255,0.55);
    --radius:16px;
    --grad_a: #00d8d8;
    --grad_b: #d800d8;
    --bg: #000;
  }
  
  /* Reset e Móbile Base - PADDING 0 conforme solicitado */
  html,body{
    width: 100%; height:100%; margin:0; padding:0 !important; color:#fff; font-family: Inter, ui-sans-serif, -apple-system, "Segoe UI", Roboto, Arial;
    background:
      radial-gradient(circle at 25% 25%, color-mix(in srgb, var(--grad_a) 65%, transparent), transparent 70%),
      radial-gradient(circle at 75% 75%, color-mix(in srgb, var(--grad_b) 55%, transparent), transparent 70%),
      var(--bg);
    background-attachment: fixed; background-size: cover;
    -webkit-font-smoothing:antialiased; overflow-x:hidden;
  }

  *, *::before, *::after { box-sizing: border-box; }

  /* Aurora quando tocando - Integrado com Arquétipos */
  body.playing::before{
    content:""; position:fixed; inset:-20% -20% auto -20%; height:140vh; z-index:-1; pointer-events:none;
    background: var(--kob-voice-bg-soft),
      radial-gradient(40% 30% at 20% 20%, #7a57ff55, transparent 60%),
      radial-gradient(35% 35% at 80% 0%,  #5cc6ff44, transparent 70%),
      radial-gradient(40% 40% at 50% 80%, #c15bff33, transparent 70%);
    filter: blur(60px); animation: floatAurora 7s ease-in-out infinite alternate;
  }
  @keyframes floatAurora{ 0%{ transform:translateY(-10px) scale(1); opacity:.9 } 100%{ transform:translateY(20px) scale(1.03); opacity:1 } }

  /* Wrap principal com padding 0 (ajustando bordas nos itens internos) */
  .wrap {
    min-height: 100dvh; 
    padding: 0; 
    padding-bottom: calc(env(safe-area-inset-bottom) + 140px);
    display: flex; flex-direction: column; gap: 16px;
    width: 100vw; max-width: 100%;
  }

  .header { display: flex; align-items: center; gap: 12px; padding: 16px 16px 0; }
  section.card { margin: 0 16px; } /* Mantendo o respiro lateral apenas nos blocos */

  /* ORB COM VARIÁVEIS DINÂMICAS DO ARQUÉTIPO */
  .orb{
    width:28px; height:28px; border-radius:50%; 
    background: radial-gradient(circle at 30% 30%, var(--kob-voice-secondary), var(--kob-voice-primary) 60%, #8231ff 100%); 
    box-shadow: var(--kob-voice-glow);
    transition: all 0.5s ease;
  }
  body.playing .orb {
    animation: orbSpin 3s linear infinite, orbPulse 1.2s ease-in-out infinite alternate;
  }
  @keyframes orbSpin { 100% { transform: rotate(360deg); } }
  @keyframes orbPulse { 0% { transform: scale(1); } 100% { transform: scale(1.15); box-shadow: var(--kob-voice-glow), 0 0 40px var(--kob-voice-primary); } }

  .brand{font-size:22px; font-weight:700; letter-spacing:0.2px}
  .listen{ margin-left:auto; border:none; color:#fff; font-weight:700; font-size:16px; padding:12px 20px; border-radius:14px;
    background: linear-gradient(90deg, var(--accent1), var(--accent2)); box-shadow: 0 10px 24px rgba(0,0,0,.25), inset 0 0 0 1px #ffffff20; cursor:pointer; transition:transform .06s;}
  .listen:active{transform:scale(.98)}
  .row{display:flex; justify-content:space-between; align-items:center; gap:10px}
  
  .card{background: linear-gradient(180deg, rgba(255,255,255,.06), rgba(0,0,0,.18)); backdrop-filter: blur(12px); border-radius: var(--radius); padding:14px; box-shadow: 0 8px 28px rgba(0,0,0,.35);}
  h2{margin:0; font-size:22px; font-weight:800; letter-spacing:0.2px}
  .usage{font-size:14px; opacity:.9}
  .muted{color:var(--muted); font-size:13px}

  /* Itens da biblioteca */
  .items{display:grid; gap:10px; margin-top:12px}
  .item{
    background:rgba(255,255,255,0.06); border:1px solid var(--stroke);
    border-radius:14px; padding:12px;
    display:flex; flex-direction:column; gap:6px;
    cursor:pointer; transition:border-color .18s,background .18s;
  }
  .item-row{ display:flex; align-items:center; gap:12px; }
  .item.is-active{
    border-color:rgba(122,87,255,0.6);
    background:rgba(122,87,255,0.10);
    box-shadow:0 0 0 1px rgba(92,198,255,0.18);
  }
  .item.is-dragging{ opacity:.4; border-style:dashed; }
  .pdf-ico{width:38px;height:38px;border-radius:10px;display:grid;place-items:center;background:linear-gradient(180deg,#ffffffcc,#ffffff99);color:#222;font-weight:900;font-size:12px;box-shadow:inset 0 0 0 1px #00000014;flex-shrink:0;}
  .pdf-ico.md-ico{background:linear-gradient(180deg,#a78bfa,#6366f1);color:#fff;font-size:10px;}
  .meta{flex:1;min-width:0}
  .name{font-weight:600;font-size:13px;word-break:break-word;overflow-wrap:anywhere;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;}
  .size{font-size:11px;color:var(--soft);margin-top:2px}
  .item-snippet{font-size:11px;color:rgba(255,255,255,0.5);line-height:1.35;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;word-break:break-word;padding:4px 0 0;border-top:1px solid rgba(255,255,255,0.06);}
  .item-snippet.playing{color:rgba(92,198,255,0.85);}
  .item-meta-row{display:flex;align-items:center;gap:8px;flex-wrap:wrap;}
  .page-badge{font-size:10px;font-weight:700;padding:2px 7px;border-radius:999px;background:rgba(255,255,255,0.08);color:rgba(255,255,255,0.5);letter-spacing:.04em;flex-shrink:0;}
  .item.is-active .page-badge{background:rgba(92,198,255,0.18);color:#5cc6ff;}
  .thinbar{height:6px; background:rgba(255,255,255,.12); border-radius:10px; overflow:hidden; margin-top:8px}
  .thinbar > i{display:block; height:100%; width:0%; background:linear-gradient(90deg, #fff, #ffffff80)}
  .icon-btn{width:36px;height:36px;border-radius:50%; border:1px solid #ffffff22; background: linear-gradient(180deg, var(--accent1), var(--accent2));
            display:grid; place-items:center; cursor:pointer; box-shadow:0 6px 18px rgba(0,0,0,.3); flex-shrink:0;}
  .icon-btn svg{width:16px;height:16px; fill:#fff}
  .ghost{background:transparent; border-color:#ffffff33}
  .danger{background:#ff586699; border-color:#ff9aa3cc}

  .io-row{display:flex; gap:8px; align-items:center; margin-top:12px; flex-wrap:wrap}
  .btn{border:none; color:#0b0b12; background:#fff; font-weight:800; letter-spacing:.2px; padding:12px 14px; border-radius:12px; cursor:pointer; font-size:13px; flex:1; text-align:center; white-space:nowrap;}
  .btn:active{transform:scale(.98)}
  .bar{height:10px; background:rgba(255,255,255,.12); border-radius:10px; overflow:hidden}
  .bar > i{display:block; height:100%; width:0%; background:linear-gradient(90deg, var(--accent1), var(--accent2))}
  input[type=file]{display:none}

  /* Playback settings */
  .settings{display:grid; gap:10px}
  .field{display:flex; gap:10px; align-items:center; flex-wrap:wrap}
  .select, .range{ background: rgba(255,255,255,.08); border:1px solid #ffffff20; color:#fff; padding:10px 12px; border-radius:12px; font-weight:600; flex:1;}
  .range{ display:flex; align-items:center; justify-content: flex-end; gap:10px}
  
  /* Sliders customizados */
  input[type=range]{ -webkit-appearance: none; width:100%; background: rgba(255,255,255,0.15); height: 6px; border-radius: 6px; outline: none; }
  input[type=range]::-webkit-slider-thumb { -webkit-appearance: none; width: 16px; height: 16px; border-radius: 50%; background: #fff; cursor: pointer; box-shadow: 0 0 10px rgba(0,0,0,0.5); }

  .pill{font-size:12px; background:#ffffff22; padding:4px 8px; border-radius:999px}

  /* Bookmarks */
  .bm-list{display:grid; gap:8px; margin-top:10px}
  .bm-item{background: rgba(255,255,255,.06); border:1px solid #ffffff22; border-radius:12px; padding:10px; display:flex; align-items:center; gap:8px; flex-wrap:wrap;}
  .bm-text{flex:1 1 100%; min-width:0}
  .bm-text strong{font-size:13px; display:block; white-space:nowrap; overflow:hidden; text-overflow:ellipsis}
  .bm-text small{color:var(--muted)}
  .bm-item .btn { flex: unset; padding: 8px 12px; }

  /* Mini Player Flutuante (Com Slider) */
  .player{ position:fixed; left:0; right:0; bottom:0; padding:0 12px calc(env(safe-area-inset-bottom) + 12px); z-index: 40;}
  .player-wrap{ background: rgba(15, 15, 20, 0.85); backdrop-filter: blur(16px); border:1px solid rgba(255,255,255,0.15); border-radius:20px; padding:12px; display:flex; align-items:center; gap:12px; flex-wrap: wrap; box-shadow: 0 -10px 40px rgba(0,0,0,0.5);}
  
  .player-top { display: flex; align-items: center; width: 100%; gap: 12px; }
  .pp{width:44px;height:44px;border-radius:50%;border:1px solid #ffffff22;background:linear-gradient(180deg, var(--accent1), var(--accent2));display:grid;place-items:center;cursor:pointer;flex-shrink:0;}
  .pp.pulse{ animation: pulse 1.2s ease-in-out infinite; }
  @keyframes pulse{ 0%{ box-shadow:0 0 0 0 rgba(122,87,255,.55) } 100%{ box-shadow:0 0 0 20px rgba(122,87,255,0) } }
  .pp svg{width:18px;height:18px; fill:#fff}
  .track{flex:1; overflow:hidden;}
  .now{font-size:13px; font-weight:600; color:#fff; white-space:nowrap; overflow:hidden; text-overflow:ellipsis}
  
  /* Slider de Progresso Integrado */
  .player-slider-wrap { width: 100%; display: flex; align-items: center; gap: 8px; margin-top: 4px; }
  .time-label { font-size: 11px; font-weight: 600; color: var(--muted); min-width: 35px; text-align: center;}
  #progressSlider { flex: 1; max-width: 100%; height: 4px; }
  #progressSlider::-webkit-slider-thumb { width: 14px; height: 14px; background: var(--accent2); }

  .view-mini{width:40px;height:40px;border-radius:50%;display:grid;place-items:center;border:1px solid #ffffff33;background:transparent;cursor:pointer;flex-shrink:0;}
  .view-mini svg{width:18px;height:18px;fill:#fff}

  /* Overlay Viewer - Móbile First Corrigido */
  .overlay{ position:fixed; inset:0; display:none; flex-direction:column; z-index:50; background: radial-gradient(120% 120% at 50% 0%, rgba(0,0,0,.75), rgba(0,0,0,.95)); backdrop-filter: blur(8px);}
  .overlay.show{ display:flex; }
  
  /* Retirado o max-width rígido para fluir na tela móbile */
  .ov-wrap{ 
    width:100%; flex:1; display:flex; flex-direction:column; gap:12px; padding: calc(env(safe-area-inset-top) + 12px) 12px 12px;
    overflow-y:auto; overflow-x:hidden;
  }
  
  .ov-head{display:flex; align-items:center; justify-content:space-between; gap:10px; flex-shrink:0;}
  .ov-title{font-weight:800; font-size:18px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis}
  .ov-close{ width:36px;height:36px;border-radius:50%; border:1px solid #ffffff33; background:transparent; color:#fff; font-weight:900; cursor:pointer; font-size:18px; display:grid; place-items:center; flex-shrink:0;}
  
  .ov-topbar{display:flex; gap:8px; align-items:center; flex-wrap:wrap; flex-shrink:0;}
  .ov-topbar .chip{background:#ffffff18; border:1px solid #ffffff22; color:#fff; padding:8px 10px; border-radius:12px; display:flex; align-items:center; gap:8px; flex:1 1 auto; justify-content:center; min-width:120px;}
  
  .ov-stage{ position:relative; flex:1; min-height:40vh; background:#05050a; border-radius:12px; overflow:auto; display:flex; justify-content:center; align-items:flex-start; padding:10px; }
  
  /* Single-page stack ajustado para móbile */
  #ovCanvas{ max-width:100%; height:auto; border-radius:8px; box-shadow:0 6px 22px rgba(0,0,0,.5); display:block; margin: 0 auto; }
  #ovSkel, #ovTrail, #ovHl { position:absolute; left:50%; transform:translateX(-50%); pointer-events:none; max-width:100%; height:auto; }
  
  /* Continuous list */
  #ovCont{ display:none; width:100%; }
  .pageWrap{ position:relative; margin:0 auto 14px; width:100%; max-width:900px; display:flex; justify-content:center; }
  .pageWrap canvas{ display:block; max-width:100%; height:auto; border-radius:8px; box-shadow:0 6px 22px rgba(0,0,0,.45) }
  .skelLayer, .trailLayer, .hlLayer { position:absolute; pointer-events:none; }

  .ov-btn{ border:1px solid #ffffff33; background:rgba(255,255,255,.08); color:#fff; padding:8px 12px; border-radius:10px; cursor:pointer; font-size:13px; flex-shrink:0; white-space:nowrap;}
  .ov-page{font-weight:700; font-size:14px; white-space:nowrap;}
  .ov-zoom{accent-color:#fff; max-width:80px !important;}

  /* Snippet + Timeline */
  #ovTimeline{ width:100%; height:36px; background:#ffffff0b; border:1px solid #ffffff22; border-radius:10px; flex-shrink:0; }
  #ovSnippet{ background:#ffffff0f; border:1px solid #ffffff22; border-radius:12px; padding:10px; font-size:13px; color:#fff; line-height:1.4; flex-shrink:0; max-height:80px; overflow-y:auto; }
  #ovSnippet mark{ background: #ffd54d; color:#1b1b1b; padding:0 3px; border-radius:4px }
/* === LIBRARY COLLAPSÁVEL + CARROSSEL LATERAL === */
#libCard{
  position: relative;
  transition: transform .28s ease, width .28s ease, max-height .28s ease, padding .28s ease, box-shadow .28s ease;
  overflow: hidden;   max-height: 77vh;
}

#libToggleBtn{
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 5;
  border: 1px solid #ffffff22;
  background: rgba(255,255,255,.08);
  color: #fff;
  font-weight: 800;
  padding: 8px 12px;
  border-radius: 12px;
  cursor: pointer;
  backdrop-filter: blur(10px);
}

#libToggleBtn:active{
  transform: scale(.98);
}

#libCard.is-collapsed{
  position: fixed;
  left: 12px;
  bottom: calc(env(safe-area-inset-bottom) + 96px);
  width: min(94vw, 480px);
  max-height: 46vh;
  z-index: 45;
  margin: 0 !important;
  padding-top: 52px;
  border: 1px solid rgba(255,255,255,.14);
  box-shadow: 0 18px 50px rgba(0,0,0,.45);
  backdrop-filter: blur(18px);
}

#libCard.is-collapsed .row,
#libCard.is-collapsed #usageVal,
#libCard.is-collapsed #countInfo,
#libCard.is-collapsed .i-row{
  display: none !important;
}

#libCard.is-collapsed #items{
  display: flex;
  flex-direction: row;
  gap: 10px;
  overflow-x: auto;
  overflow-y: hidden;
  padding: 8px 2px 12px;
  margin-top: 0;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: thin;
}

#libCard.is-collapsed #items::-webkit-scrollbar{
  height: 7px;
}

#libCard.is-collapsed #items::-webkit-scrollbar-thumb{
  background: rgba(255,255,255,.25);
  border-radius: 999px;
}

#libCard.is-collapsed .item{
  flex: 0 0 82%;
  min-width: 82%;
  scroll-snap-align: start;
  border-radius: 16px;
  padding: 12px;
  align-items: center;
}

#libCard.is-collapsed .meta{
  min-width: 0;
}

#libCard.is-collapsed .name{
  font-size: 13px;
  line-height: 1.15;
}

#libCard.is-collapsed .size{
  font-size: 11px;
}

#libCard.is-collapsed .thinbar{
  margin-top: 8px;
}

#libCard.is-collapsed .icon-btn{
  width: 34px;
  height: 34px;
}

#libCard.is-collapsed .pdf-ico{
  width: 44px;
  height: 44px;
  font-size: 11px;
}

/* Mobile: deixa o painel ainda mais “raiz” */
@media (max-width: 560px){
  #libCard.is-collapsed{
    width: calc(100vw - 24px);
    max-height: 42vh;
  }

  #libCard.is-collapsed .item{
    flex-basis: 88%;
    min-width: 88%;
  }
}
  /* Desktop View limit */
  @media(min-width:900px){ .wrap{max-width:1000px; margin:0 auto;} .ov-wrap{max-width:1100px; margin:0 auto; padding-top:20px;} }

/* === LIBRARY SIDE DRAWER + HANDLE FIXO === */
:root{
  --lib-drawer-w: min(92vw, 430px);
  --lib-handle-w: 46px;
  --lib-drawer-top: 92px;
  --lib-drawer-bottom: calc(env(safe-area-inset-bottom) + 96px);
}

#libCard{
  position: fixed;
  top: var(--lib-drawer-top);
  right: 0;
  bottom: var(--lib-drawer-bottom);
  width: var(--lib-drawer-w);
  z-index: 46;
  margin: 0 !important;
  border-radius: 18px 0 0 18px;
  box-shadow: 0 18px 50px rgba(0,0,0,.45);
  backdrop-filter: blur(18px);
  border: 1px solid rgba(255,255,255,.14);
  overflow: auto;
  transform: translateX(calc(100% - var(--lib-handle-w)));
  transition: transform .32s cubic-bezier(.2,.85,.2,1), box-shadow .32s ease;
  will-change: transform;
}

#libCard.is-open{
  transform: translateX(0);
}

#libCard.is-open{
  box-shadow: 0 24px 70px rgba(0,0,0,.58);
}

#libCard .row,
#libCard #usageVal,
#libCard #countInfo,
#libCard .io-row{
  transition: opacity .2s ease, transform .2s ease;
}

#libCard .lib-drawer-handle{
  position: absolute;
  left: 0;
  top: 50%;
  width: var(--lib-handle-w);
  height: 132px;
  transform: translateY(-50%);
  border: 0;
  border-radius: 0 16px 16px 0;
  background: linear-gradient(180deg, rgba(122,87,255,.95), rgba(92,198,255,.95));
  color: #fff;
  font-weight: 900;
  letter-spacing: .08em;
  cursor: pointer;
  display: grid;
  place-items: center;
  box-shadow: 8px 0 20px rgba(0,0,0,.22);
  z-index: 3;
}

#libCard .lib-drawer-handle span{
  writing-mode: vertical-rl;
  transform: rotate(180deg);
  font-size: 11px;
  line-height: 1;
}

#libCard.is-open .lib-drawer-handle{
  background: rgba(255,255,255,.12);
  border-right: 1px solid rgba(255,255,255,.12);
}

#libCard.is-open .lib-drawer-handle span{
  opacity: .95;
}

/* Scroll container geral da library */
#libCard > *:not(.lib-drawer-handle){
  margin-left: var(--lib-handle-w);
}

#libDockControls{
  display: flex;
  gap: 8px;
  padding: 12px 10px 4px 10px;
  flex-wrap: wrap;
  margin-left: 0 !important;
  padding-left: calc(var(--lib-handle-w) + 10px);
}

#libCard #items{
  margin-top: 0;
  padding: 6px 10px 10px 10px;
  height: auto;
  max-height: 38vh;
  overflow-x: auto;
  overflow-y: hidden;
  display: flex;
  flex-direction: row;
  gap: 10px;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: thin;
}

#libDockZone{
  padding: 6px 10px 10px 10px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  overflow-y: auto;
  max-height: calc(100% - 160px);
}

#libCard #items::-webkit-scrollbar{
  height: 7px;
}

#libCard #items::-webkit-scrollbar-thumb{
  background: rgba(255,255,255,.25);
  border-radius: 999px;
}

#libCard .item{
  flex: 0 0 84%;
  min-width: 84%;
  scroll-snap-align: start;
  align-items: center;
}

#libCard .meta{
  min-width: 0;
}

#libCard .name{
  font-size: 13px;
  line-height: 1.15;
  word-break: break-word;
}

#libCard .size{
  font-size: 11px;
}

#libCard .thinbar{
  margin-top: 8px;
}

#libCard .icon-btn{
  width: 34px;
  height: 34px;
}

#libCard .pdf-ico{
  width: 42px;
  height: 42px;
  font-size: 11px;
}

@media (max-width: 560px){
  :root{
    --lib-drawer-w: min(96vw, 420px);
    --lib-drawer-top: 86px;
    --lib-drawer-bottom: calc(env(safe-area-inset-bottom) + 88px);
    --lib-handle-w: 42px;
  }

  #libCard .item{
    flex-basis: 88%;
    min-width: 88%;
  }
}

</style>
<style>
  /* === DOCK PLAYER UNIFICADO === */
  #dockPlayerBtn.active{
    background: linear-gradient(90deg, #d6ffef, #cce9ff) !important;
    color: #0b2c1a !important;
  }
  #dockSymbolBarBtn.active{
    background: linear-gradient(90deg, #ffe0ff, #d6d0ff) !important;
    color: #1a0b2c !important;
  }

  /* Player dockado dentro da Library */
  .player.inline-docked{
    position: static !important;
    left: auto !important; right: auto !important; bottom: auto !important;
    width: 100%; padding: 0 !important;
    margin: 10px 0 0; z-index: auto;
    flex: 1 1 100%; order: 99;
  }
  .player.inline-docked .player-wrap{
    width: 100%; border-radius: 16px; box-shadow: none;
    background: rgba(255,255,255,0.07);
    border: 1px solid rgba(255,255,255,0.12);
  }
  .player.inline-docked .player-top{ flex-wrap: wrap; }
  .player.inline-docked .player-slider-wrap{ margin-top: 6px; }

  /* SymbolBar dockada dentro da Library */
  #symbolBar.lib-docked{
    position: static !important;
    transform: none !important;
    left: auto !important; right: auto !important; bottom: auto !important;
    top: auto !important;
    width: 100% !important;
    max-width: 100% !important;
    margin: 10px 0 0;
    z-index: auto;
    border-radius: 16px;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.10);
    padding: 10px;
    display: flex !important;
    flex-wrap: wrap;
    gap: 8px;
    order: 100;
  }
  #symbolBar.lib-docked #mainCard{
    width: 100%;
    border-radius: 14px;
  }

  /* Seção de dock dentro da Library */
  #libDockZone{
    padding: calc(var(--lib-handle-w) + 12px) 12px 12px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    min-height: 0;
  }

  /* Botões dock no topo da Library drawer */
  #libDockControls{
    display: flex;
    gap: 8px;
    padding: calc(var(--lib-handle-w) + 8px) 10px 0;
    flex-wrap: wrap;
  }
  .lib-dock-btn{
    flex: 1;
    border: 1px solid rgba(255,255,255,0.18);
    background: rgba(255,255,255,0.07);
    color: #fff;
    font-weight: 700;
    font-size: 11px;
    letter-spacing: 0.06em;
    padding: 8px 10px;
    border-radius: 12px;
    cursor: pointer;
    transition: background 0.18s, color 0.18s;
    text-align: center;
    white-space: nowrap;
  }
  .lib-dock-btn:active{ transform: scale(.97); }

  /* Quick Paste Panel */
  .qp-btn{
    width:100%; border:1px solid rgba(255,255,255,0.12);
    background:rgba(255,255,255,0.07); color:#fff;
    font-weight:600; font-size:13px; padding:11px 14px;
    border-radius:14px; cursor:pointer; text-align:left;
    transition:background .15s;
  }
  .qp-btn:hover{ background:rgba(255,255,255,0.13); }
  .qp-btn:active{ transform:scale(.98); }
</style>
</head>
<body>
<div id="root">

   <link href="https://www.infodose.com.br/css/main0.css" rel="stylesheet" data-k-id="L_k">

<section id="motorDock" class="motor-dock" aria-label="Motor 78K" hidden="">
  <div class="motor-dock-head">
    <div>
      <strong>Motor 78K</strong>
      <span>· painel isolado · usa o HTML original dentro de iframe</span>
    </div>
    <button type="button" id="motorDockClose" class="pill-btn secondary">Fechar</button>
  </div>
  <iframe id="motorFrame" title="Motor 78K" sandbox="allow-scripts allow-forms allow-same-origin" loading="lazy"></iframe>
</section>

  <div class="wrap">
    <div class="header">
      <div style="height:39px; width:39px;" class="orb" aria-hidden="true"></div>
      <div class="brand">Nebula Pro</div>
      <button id="listenBtn" class="listen">Listen</button>
    </div>

<!-- Mini Player c/ Slider -->
  <div class="player" id="playerDock">
    <div class="player-wrap">
      <div class="player-top">
        <button id="ppBtn" class="pp chip" title="Play/Pause">
          <svg viewBox="0 0 24 24" id="ppIcon"><path d="M8 5v14l11-7z"></path></svg>
        </button>
        <div class="track">
          <div id="nowPlaying" class="now">Nada tocando</div>
          <div id="ovSnippet" class="muted">—</div>    
        </div>

      <div class="chipi" style="display:flex; gap:8px;">
        <button id="bmBtn" class="icon-btn" title="Bookmark">⭐</button>
        <button id="quickPasteBtn" class="icon-btn" title="Quick Actions">📂</button>
        
        <!-- Quick Paste Panel -->
        <div id="quickPastePanel" style="display:none;position:fixed;left:50%;bottom:80px;transform:translateX(-50%);z-index:200;width:min(94vw,360px);background:rgba(12,12,20,0.97);border:1px solid rgba(255,255,255,0.14);border-radius:20px;padding:16px;backdrop-filter:blur(20px);box-shadow:0 20px 60px rgba(0,0,0,.6)">
          <div style="font-size:12px;font-weight:800;letter-spacing:.1em;opacity:.6;margin-bottom:12px">⚡ QUICK ACTIONS</div>
          <div style="display:flex;flex-direction:column;gap:8px">
            <button class="qp-btn" id="qp-clipboard">📋 Paste Clipboard (Ctrl+V)</button>
            <button class="qp-btn" id="qp-input">✏️ Type / Paste Text</button>
            <button class="qp-btn" id="qp-html">🌐 HTML Inline Text</button>
            <button class="qp-btn" id="qp-last">🔁 Load Last Text</button>
            <button id="viewBtn" class="view-mini" title="Ver páginas">
              <svg viewBox="0 0 24 24"><path d="M12 5c-7 0-10 7-10 7s3 7 10 7 10-7 10-7-3-7-10-7zm0 12a5 5 0 110-10 5 5 0 010 10z"></path></svg>
            </button>
          </div>
          <textarea id="qp-textarea" placeholder="Cole ou escreva aqui..." style="display:none;width:100%;margin-top:10px;padding:10px;border-radius:12px;background:rgba(255,255,255,0.07);border:1px solid rgba(255,255,255,0.15);color:#fff;font-size:13px;resize:vertical;min-height:80px;outline:none"></textarea>
          <div style="display:flex;gap:8px;margin-top:10px">
            <button id="qp-go" style="display:none;flex:1;background:linear-gradient(90deg,#7a57ff,#5cc6ff);border:none;color:#fff;font-weight:800;padding:10px;border-radius:12px;cursor:pointer;font-size:13px">▶ Play Agora</button>
            <button id="qp-close" style="border:1px solid rgba(255,255,255,0.15);background:transparent;color:#fff;padding:10px 14px;border-radius:12px;cursor:pointer;font-size:13px">✕</button>
          </div>
        </div>
      </div> 
      </div>
      <div class="player-slider-wrap">
        <span class="time-label" id="timeCur">0%</span>
        <input type="range" id="progressSlider" min="0" max="100" value="0" step="0.1">
        <span class="time-label" id="timeTotal">100%</span>
      </div>
    </div>
  </div>

 <!-- Bookmarks -->
    <section class="card">
      <div class="row">
        <h2>Bookmarks</h2>
        <div style="display:flex; gap:8px; align-items:center">
          <button id="clearBmBtn" class="btn" style="background:#ffe3e6; color:#7a1a25; flex:0 0 auto; padding:8px 12px">Clear</button>
        </div>
      </div>
      <div id="bmList" class="bm-list">
        <div class="muted">Sem marcadores ainda. Use o botão ⭐ no viewer.</div>
      </div>
    </section>

    <!-- Library -->
    <section class="card" id="libCard">
    
  <div class="row">
   <div class="chip">
          <span style="font-size:78px;opacity:0">•</span>
        </div>
     <h2>Library</h2>

        <div class="usage"><span id="usageVal">0 MB</span></div>
      </div>

      <!-- DOCK CONTROLS (Player + SymbolBar dentro da Library) -->
      <div id="libDockControls">
        <button id="dockPlayerBtn" class="lib-dock-btn" title="Dock/Undock Player dentro da Library">⎚ Dock Player</button>
        <button id="dockSymbolBarBtn" class="lib-dock-btn" title="Dock/Undock SymBar dentro da Library">⌘ Dock SymBar</button>
      </div>

      <div id="items" class="items">
        <div class="item">
          <div class="pdf-ico">PDF</div>
          <div class="meta">
            <div class="name">Nenhum PDF salvo</div>
            <div class="size">Use Import para adicionar</div>
          </div>
        </div>
      </div>

      <!-- ZONA DE DOCK: Player e SymbolBar aparecem aqui quando dockados -->
      <div id="libDockZone"></div>

<div class="io-row">
        <button id="importBtn" class="ov-btn" title="Importar PDF / ZIP / MD">📂</button>
        <button id="exportBtn" class="btn" style="background:linear-gradient(90deg,#d9e9ff,#ffffff);">Export</button>
        <button id="clearLibBtn" class="btn" style="background:#ffe3e6; color:#7a1a25">Clear Lib</button>
        <button id="clearUiBtn" class="btn" style="background:#efe6ff; color:#3b247b" title="Apaga configurações">Clear UI</button>
        <input id="filePicker" type="file" accept=".pdf,.zip,.md,.txt" multiple="">
      </div>

      <div class="row">
      <div style="margin-top:14px" class="row">
        <div class="muted">IndexedDB</div>
        <div class="muted" id="countInfo">0 item(s)</div>
      </div>

      <div style="margin-top:8px">
        <div class="muted">Import</div>
        <div class="bar"><i id="importBar"></i></div>
        <div class="muted" id="importStatus" style="margin-top:6px">Pronto</div>
      </div>

      <div style="margin-top:8px">
        <div class="muted">Export</div>
        <div class="bar"><i id="exportBar"></i></div>
        <div class="muted" id="exportStatus" style="margin-top:6px">Pronto</div>
      </div>
</div>
   <!-- Playback Settings -->
    <section class="card">
      <div class="row"><h2>Playback</h2><span class="pill" id="voiceCount">—</span></div>
      <div class="settings chip">
        <div class="field">
          <label class="muted">Voice</label>
          <select id="voiceSelect" class="select"></select>
          <button id="testVoice" class="btn" style="flex:0 0 auto">Test</button>
        </div>
        <div class="field">
          <label class="muted">Speed</label>
          <div class="range">
            <input id="rateRange" type="range" min="0.087" max="1.8" step="0.1" value="1.0">
            <span id="rateOut" class="pill">1.0×</span>
          </div>
        </div>
        <div class="field">
          <label class="muted">Pitch</label>
          <div class="range">
            <input id="pitchRange" type="range" min="0" max="2" step="0.05" value="1">
            <span id="pitchOut" class="pill">1.0</span>
          </div>
        </div>
        <div class="field">
          <label class="muted">Arch</label>
          <div class="range" style="justify-content:flex-start; flex-wrap:wrap; gap:8px">
            <span id="archUserBadge" class="pill">user: —</span>
            <select id="archSelect" class="select" style="min-width:180px; flex:2 1 180px"></select>
            <button id="saveArchBtn" class="btn" style="flex:0 0 auto">Save</button>
            <button id="exportArchBtn" class="btn" style="flex:0 0 auto">Export</button>
          </div>
        </div>
        <div id="archStatus" class="muted">Nenhum arquétipo salvo.</div>
      </div>
    </section>

  </section>
  </div>

  <!-- Overlay Viewer -->
  <div id="overlay" class="overlay" aria-hidden="true">
    <div class="ov-wrap">
      <div class="ov-head">
        <div class="ov-title" id="ovTitle">–</div>
        <button id="ovClose" class="ov-close" title="Fechar">×</button>
      </div>

      <!-- TOPBAR -->
      <div class="ov-topbar">
        <div class="chip">
          <button id="ovPrev" class="ov-btn">Prev</button>
          <div class="ov-page" id="ovPageInfo">– / –</div>
          <button id="ovNext" class="ov-btn">Next</button>
        </div>
        <div class="chip">
          <span style="font-size:13px">Zoom</span>
          <input id="ovZoom" class="ov-zoom" type="range" min="0.8" max="2.0" step="0.1" value="1.2">
        </div>
        <div class="chip" style="flex: 1 1 100%;">
          <input id="searchInput" placeholder="Buscar..." style="background:#00000022;border:1px solid #ffffff33;color:#fff;padding:8px 10px;border-radius:8px; flex:1; min-width:0; outline:none;">
          <button id="searchBtn" class="ov-btn">Find</button>
          <button id="searchPrev" class="ov-btn">◀</button>
          <button id="searchNext" class="ov-btn">▶</button>
          <span id="searchCount" class="pill">0/0</span>
          <button id="searchClear" class="ov-btn">Clear</button>
        </div>
        <div class="chip">
          <button id="contBtn" class="ov-btn">Continuous: OFF</button>
          <button id="karaBtn" class="ov-btn">Karaoke: OFF</button>
          <button id="skelBtn" class="ov-btn">Skeleton: ON</button>
        </div>
        <div class="chip">
          <button id="trailExportBtn" class="ov-btn">Export Trail</button>
          <button id="trailImportBtn" class="ov-btn">Import Trail</button>
          <input id="trailImportInput" type="file" accept="image/png" style="display:none">
        </div>
      </div>

      <!-- STAGES -->
      <div class="ov-stage" id="stage">
        <canvas id="ovCanvas" width="600" height="800"></canvas>
        <canvas id="ovSkel" width="600" height="800"></canvas>
        <canvas id="ovTrail" width="600" height="800"></canvas>
        <canvas id="ovHl" width="600" height="800"></canvas>
        <div id="ovCont"></div>
      </div>

      <!-- Linha do tempo -->
      <canvas id="ovTimeline" height="36"></canvas>

    </div>
  </div>

<script>
/**
 * Nebula Pro — Monolito Integrado com Slider Móbile
 * Mantendo sua lógica completa (Trail I/O, OCR, Search, ZIP) e Prefixos DI_
 */
(function(){
  // ====== Dependências (CDN) ======
  function loadScript(src){ return new Promise((res,rej)=>{ const s=document.createElement('script'); s.src=src; s.onload=res; s.onerror=()=>rej(new Error('Falha '+src)); document.head.appendChild(s); }); }
  (async ()=>{
    await loadScript('https://unpkg.com/pdfjs-dist@3.6.172/build/pdf.min.js');
    await loadScript('https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js');
    await loadScript('https://unpkg.com/tesseract.js@5.0.3/dist/tesseract.min.js');
    window.pdfjsLib = window['pdfjs-dist/build/pdf'];
    window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://unpkg.com/pdfjs-dist@3.6.172/build/pdf.worker.min.js';
    initApp();
  })();

  // ====== Estado ======
  let voices = [];
  const settings = JSON.parse(localStorage.getItem('di_nebula_settings')||'{"voice":"","rate":1}');
  let current = { id:null, name:null, pdfData:null, pdfDoc:null, pages:0, paragraphs:[], idx:0, playing:false };
  let utter = null;
  let progressMap = JSON.parse(localStorage.getItem('di_nebula_progress')||'{}'); 
  const ocrCache = {};            
  let searchHits = []; let searchPtr = 0;
  let contMode = false, karaMode = false, skelMode = true;
  const contMap = {};             
  const pageProgress = {};        
  const timelineCache = {};       

  // ====== UI ======
  const listenBtn   = document.getElementById('listenBtn');
  const itemsWrap   = document.getElementById('items');
  const usageVal    = document.getElementById('usageVal');
  const countInfo   = document.getElementById('countInfo');
  const importBar   = document.getElementById('importBar');
  const exportBar   = document.getElementById('exportBar');
  const importStatus= document.getElementById('importStatus');
  const exportStatus= document.getElementById('exportStatus');
  const importBtn   = document.getElementById('importBtn');
  const exportBtn   = document.getElementById('exportBtn');
  const clearLibBtn = document.getElementById('clearLibBtn');
  const clearUiBtn  = document.getElementById('clearUiBtn');
  const filePicker  = document.getElementById('filePicker');
  const ppBtn       = document.getElementById('ppBtn');
  const ppIcon      = document.getElementById('ppIcon');
  const nowPlaying  = document.getElementById('nowPlaying');
  const viewBtn     = document.getElementById('viewBtn');
  const playerDock  = document.getElementById('playerDock');
  const dockPlayerBtn = document.getElementById('dockPlayerBtn');

  // Slider Elements
  const progressSlider = document.getElementById('progressSlider');
  const timeCur        = document.getElementById('timeCur');

  // Playback settings
  const voiceSelect = document.getElementById('voiceSelect');
  const rateRange   = document.getElementById('rateRange');
  const rateOut     = document.getElementById('rateOut');
  const voiceCount  = document.getElementById('voiceCount');
  const testVoice   = document.getElementById('testVoice');

  // Bookmarks
  const bmList      = document.getElementById('bmList');
  const clearBmBtn  = document.getElementById('clearBmBtn');

  // Overlay viewer
  const overlay   = document.getElementById('overlay');
  const stage     = document.getElementById('stage');
  const ovCanvas  = document.getElementById('ovCanvas');
  const ovSkel    = document.getElementById('ovSkel');
  const ovTrail   = document.getElementById('ovTrail');
  const ovHl      = document.getElementById('ovHl');
  const ovTitle   = document.getElementById('ovTitle');
  const ovClose   = document.getElementById('ovClose');
  const ovPrev    = document.getElementById('ovPrev');
  const ovNext    = document.getElementById('ovNext');
  const ovPageInfo= document.getElementById('ovPageInfo');
  const ovZoom    = document.getElementById('ovZoom');
  const ovCtx     = ovCanvas.getContext('2d');
  const ovSkelCtx = ovSkel.getContext('2d');
  const ovTrailCtx= ovTrail.getContext('2d');
  const ovHlCtx   = ovHl.getContext('2d');
  const ovCont    = document.getElementById('ovCont');
  const bmBtn     = document.getElementById('bmBtn');
  const contBtn   = document.getElementById('contBtn');
  const karaBtn   = document.getElementById('karaBtn');
  const skelBtn   = document.getElementById('skelBtn');
  const ovTimeline= document.getElementById('ovTimeline');
  const ovSnippet = document.getElementById('ovSnippet');

  // Search
  const searchInput = document.getElementById('searchInput');
  const searchBtn   = document.getElementById('searchBtn');
  const searchPrev  = document.getElementById('searchPrev');
  const searchNext  = document.getElementById('searchNext');
  const searchClear = document.getElementById('searchClear');
  const searchCount = document.getElementById('searchCount');

  // Trail I/O
  const trailExportBtn = document.getElementById('trailExportBtn');
  const trailImportBtn = document.getElementById('trailImportBtn');
  const trailImportInput = document.getElementById('trailImportInput');

  // ====== IndexedDB ======
  const DB = 'nebula-db', STORE='pdfs', VER=1;
  function openDB(){
    return new Promise((res,rej)=>{
      const req = indexedDB.open(DB, VER);
      req.onupgradeneeded = (e)=> {
        const db = e.target.result;
        if(!db.objectStoreNames.contains(STORE)){
          const st = db.createObjectStore(STORE, {keyPath:'id'});
          st.createIndex('by_name','name',{unique:false});
        }
      };
      req.onsuccess = ()=>res(req.result);
      req.onerror = ()=>rej(req.error);
    });
  }
  async function dbPut(obj){ const db=await openDB(); return new Promise((res,rej)=>{ const tx=db.transaction(STORE,'readwrite'); tx.objectStore(STORE).put(obj); tx.oncomplete=()=>{db.close();res(true)}; tx.onerror=()=>{db.close();rej(tx.error)}; }); }
  async function dbAll(){ const db=await openDB(); return new Promise((res,rej)=>{ const tx=db.transaction(STORE,'readonly'); const req=tx.objectStore(STORE).getAll(); req.onsuccess=()=>{db.close();res(req.result||[])}; req.onerror=()=>{db.close();rej(req.error)}; }); }
  async function dbGet(id){ const db=await openDB(); return new Promise((res,rej)=>{ const tx=db.transaction(STORE,'readonly'); const req=tx.objectStore(STORE).get(id); req.onsuccess=()=>{db.close();res(req.result||null)}; req.onerror=()=>{db.close();rej(req.error)}; }); }
  async function dbDelete(id){ const db=await openDB(); return new Promise((res,rej)=>{ const tx=db.transaction(STORE,'readwrite'); const req=tx.objectStore(STORE).delete(id); tx.oncomplete=()=>{db.close();res(true)}; tx.onerror=()=>{db.close();rej(tx.error)}; }); }

  // ====== Inicialização ======
  function initApp(){
    function populateVoices(){
      voices = speechSynthesis.getVoices() || [];
      voiceSelect.innerHTML = '';
      const preferPT = voices.filter(v=>/^pt(-|_)/i.test(v.lang)).concat(voices.filter(v=>!/^pt(-|_)/i.test(v.lang)));
      (preferPT.length?preferPT:voices).forEach(v=>{
        const opt = document.createElement('option'); opt.value=v.name; opt.textContent = \`\${v.name}\${v.lang? ' · '+v.lang:''}\`; voiceSelect.appendChild(opt);
      });
      voiceCount.textContent = voices.length? \`\${voices.length}\` : '0';
      const saved = settings.voice && voices.find(v=>v.name===settings.voice);
      if(saved) voiceSelect.value=settings.voice; else if(preferPT[0]) voiceSelect.value=preferPT[0].name;
    }
    populateVoices(); window.speechSynthesis.onvoiceschanged = populateVoices;

    rateRange.value = settings.rate || 1.0;
    rateOut.textContent = (parseFloat(rateRange.value)||1).toFixed(1)+'×';
    rateRange.oninput = ()=>{ rateOut.textContent=(+rateRange.value).toFixed(1)+'×'; settings.rate=+rateRange.value; saveSettings(); };

    const pitchRange = document.getElementById('pitchRange');
    const pitchOut   = document.getElementById('pitchOut');
    if(pitchRange){
      pitchRange.value = settings.pitch ?? 1;
      pitchOut.textContent = parseFloat(pitchRange.value).toFixed(2);
      pitchRange.oninput = ()=>{
        pitchOut.textContent = parseFloat(pitchRange.value).toFixed(2);
        settings.pitch = +pitchRange.value;
        saveSettings();
      };
    }
    voiceSelect.onchange = ()=>{ settings.voice=voiceSelect.value; saveSettings(); };
    testVoice.onclick = ()=>{ if(!('speechSynthesis' in window)) return alert('SpeechSynthesis não suportado.'); const u=new SpeechSynthesisUtterance('Teste de voz do Nebula Pro.'); const v=voices.find(x=>x.name===voiceSelect.value)||voices[0]; if(v) u.voice=v; u.rate=+rateRange.value||1; u.pitch=parseFloat(document.getElementById('pitchRange')?.value??1); speechSynthesis.cancel(); speechSynthesis.speak(u); };

    importBtn.onclick = ()=> filePicker.click();
    filePicker.onchange = onPickFiles;
    exportBtn.onclick = onExportZip;
    clearLibBtn.onclick = clearLibrary;
    clearUiBtn.onclick  = ()=>{ localStorage.removeItem('di_nebula_progress'); localStorage.removeItem('di_nebula_settings'); localStorage.removeItem('di_nebula_bookmarks'); alert('Config/Progresso/Bookmarks limpos.'); renderBookmarks(); };

    listenBtn.onclick = onListenMain;
    ppBtn.onclick = togglePlayPause;
    viewBtn.onclick = openViewerForCurrent;
    if(dockPlayerBtn){
      setPlayerDock(localStorage.getItem('di_nebula_playerDocked') === '1');
    }

    // Listener para o Slider de Progresso Interativo
    progressSlider.addEventListener('input', onSliderInput);

    // Viewer controles
    ovClose.onclick = closeOverlay;
    ovPrev.onclick = ()=>{ if(ovPage>1){ ovPage--; renderOverlayPage(); } };
    ovNext.onclick = ()=>{ if(ovPage<ovPages){ ovPage++; renderOverlayPage(); } };
    ovZoom.oninput = ()=>{ ovScale = parseFloat(ovZoom.value)||1.2; renderOverlayPage(); };

    bmBtn.onclick   = addBookmark;
    contBtn.onclick = toggleContinuous;
    karaBtn.onclick = toggleKaraoke;
    skelBtn.onclick = toggleSkeleton;

    trailExportBtn.onclick = exportTrailPNG;
    trailImportBtn.onclick = ()=> trailImportInput.click();
    trailImportInput.onchange = importTrailPNG;

    // Busca
    searchBtn.onclick = doSearch;
    searchPrev.onclick= ()=> navSearch(-1);
    searchNext.onclick= ()=> navSearch(1);
    searchClear.onclick= ()=>{ searchInput.value=''; searchHits=[]; searchPtr=0; searchCount.textContent='0/0'; ovSnippet.textContent='—'; clearHighlight(); };

    // Atalhos
    window.addEventListener('keydown', (e)=>{
      if(e.target && ['INPUT','SELECT','TEXTAREA'].includes(e.target.tagName) && e.target!==searchInput) return;
      if(e.key===' '){ e.preventDefault(); togglePlayPause(); }
      else if(e.key==='ArrowRight' && !overlay.classList.contains('show')) nextSegment();
      else if(e.key==='ArrowLeft'  && !overlay.classList.contains('show')) prevSegment();
      else if(e.key.toLowerCase()==='o'){ overlay.classList.contains('show') ? closeOverlay() : openViewerForCurrent(); }
      else if(e.key==='Escape'){ closeOverlay(); }
      else if(e.key==='+' || e.key==='=' || e.key===']'){ if(overlay.classList.contains('show')) { ovZoom.value=(+ovZoom.value+0.1).toFixed(1); ovZoom.oninput(); } }
      else if(e.key==='-' || e.key==='_'){ if(overlay.classList.contains('show')) { ovZoom.value=(+ovZoom.value-0.1).toFixed(1); ovZoom.oninput(); } }
      else if(e.key===',' ){ rateRange.value=Math.max(0.7,(+rateRange.value-0.1)).toFixed(1); rateRange.oninput(); }
      else if(e.key==='.' ){ rateRange.value=Math.min(1.8,(+rateRange.value+0.1)).toFixed(1); rateRange.oninput(); }
    });

    window.addEventListener('resize', ()=>{ const p = curPage(); redrawTimeline(p); });

    renderLibrary();
    renderBookmarks();

    // Quick Paste integration
    document.addEventListener('nebula:setPaste', (e)=>{
      const {id,title,paras} = e.detail;
      current.id = id; current.name = title;
      current.pages = 1; current.paragraphs = paras;
      current.idx = 0; current.playing = false;
      current.pdfDoc = null; current.pdfData = null;
      const nowPlaying = document.getElementById('nowPlaying');
      if(nowPlaying) nowPlaying.textContent = title;
      const ovSnip = document.getElementById('ovSnippet');
      if(ovSnip && paras[0]) ovSnip.textContent = paras[0].text.slice(0,250);
      updateProgressBars(false);
      startSpeaking();
    });
  }
  function saveSettings(){ localStorage.setItem('di_nebula_settings', JSON.stringify(settings)); }
  const PLAYER_DOCK_KEY = 'di_nebula_playerDocked';
  function setPlayerDock(docked){
    if(!playerDock) return;
    playerDock.classList.toggle('inline-docked', !!docked);
    localStorage.setItem(PLAYER_DOCK_KEY, docked ? '1' : '0');
    if(dockPlayerBtn){
      dockPlayerBtn.textContent = docked ? 'Undock Player' : 'Dock Player';
      dockPlayerBtn.classList.toggle('active', !!docked);
    }
  }

  // ====== Lógica do Slider ======
  function onSliderInput(e) {
    if(!current.paragraphs || !current.paragraphs.length) return;
    const pct = parseFloat(e.target.value);
    const targetIdx = Math.floor((pct / 100) * current.paragraphs.length);
    current.idx = Math.min(Math.max(targetIdx, 0), current.paragraphs.length - 1);
    
    timeCur.textContent = Math.round(pct) + '%';
    const bar = document.getElementById('bar-'+current.id); if(bar) bar.style.width = pct + '%';
    progressMap[current.id] = pct; localStorage.setItem('di_nebula_progress', JSON.stringify(progressMap));
    
    if (current.playing) {
      speakCurrent();
    } else {
      const seg = current.paragraphs[current.idx];
      if(seg) {
        ovSnippet.textContent = seg.text.slice(0, 250);
        if (overlay.classList.contains('show')) {
          const pg = seg.page || ovPage;
          if(contMode) { ensureContinuous(); scrollToPage(pg); prepareTimeline(pg); }
          else if(pg !== ovPage) { ovPage = pg; renderOverlayPage(); }
          else { prepareTimeline(pg); }
        }
      }
    }
  }

  // ====== Utils ======
  function esc(s=''){ return s.replace(/[&<>"]/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m])); }
  function fmtBytes(b){ if(!b) return '0 B'; const u=['B','KB','MB','GB']; let i=0, v=b; while(v>=1024&&i<u.length-1){v/=1024;i++;} return (v.toFixed((i<=1)?0:1).replace('.',','))+' '+u[i]; }
  function sumSizes(list){ return list.reduce((a,x)=> a + (x.size|| (x.blob?.size||0)), 0); }
  function setPP(isPlaying){ ppIcon.innerHTML = isPlaying ? '<path d="M8 5h3v14H8zm5 0h3v14h-3z"/>' : '<path d="M8 5v14l11-7z"/>'; listenBtn.textContent = isPlaying ? 'Pause' : 'Listen'; document.body.classList.toggle('playing', isPlaying); ppBtn.classList.toggle('pulse', isPlaying); }
  function normalize(s=''){ return s.normalize('NFD').replace(/[\\u0300-\\u036f]/g,'').toLowerCase(); }
  function safeName(n){ return (n||'file.pdf').replace(/[^a-z0-9_\\-\\.]/gi,'_'); }
  function roundRect(ctx, x,y,w,h,r, fill, stroke){ ctx.beginPath(); ctx.moveTo(x+r,y); ctx.arcTo(x+w,y,x+w,y+h,r); ctx.arcTo(x+w,y+h,x,y+h,r); ctx.arcTo(x,y+h,x,y,r); ctx.arcTo(x,y,x+w,y,r); if(fill) ctx.fill(); if(stroke) ctx.stroke(); }
  function curPage(){ return contMode ? (current.paragraphs[current.idx]?.page || ovPage) : ovPage; }

  // ====== Library ======
  async function renderLibrary(){
    const items = await dbAll();
    countInfo.textContent = \`\${items.length} item(s)\`; usageVal.textContent = fmtBytes( sumSizes(items) );
    itemsWrap.innerHTML = '';
    if(!items.length){
      itemsWrap.innerHTML = \`<div class="item"><div class="item-row"><div class="pdf-ico">PDF</div><div class="meta"><div class="name">Nenhum arquivo salvo</div><div class="size">Use 📂 ou ⚡ para adicionar</div></div></div></div>\`;
      return;
    }
    items.sort((a,b)=>{
      if(a.id===current.id) return -1;
      if(b.id===current.id) return 1;
      return b.savedAt - a.savedAt;
    });
    for(const it of items){
      const isActive = it.id === current.id;
      const isMd = it.type === 'md' || it.name?.endsWith('.md') || it.name?.endsWith('.txt');
      const icoLabel = isMd ? 'MD' : 'PDF';
      const icoClass = isMd ? 'pdf-ico md-ico' : 'pdf-ico';
      const pct = progressMap[it.id] || 0;
      const pages = it.pages || '?';

      let snippetText = '';
      if(isActive && current.paragraphs?.length){
        const seg = current.paragraphs[current.idx];
        snippetText = seg ? seg.text.slice(0,120) : '';
      } else {
        snippetText = it.snippet || '';
      }

      const row = document.createElement('div');
      row.className = 'item' + (isActive ? ' is-active' : '');
      row.dataset.id = it.id;
      row.setAttribute('draggable','true');
      row.innerHTML = \`
        <div class="item-row">
          <div class="\${icoClass}">\${icoLabel}</div>
          <div class="meta">
            <div class="name" title="\${esc(it.name)}">\${esc(it.name)}</div>
            <div class="item-meta-row">
              <div class="size">\${fmtBytes(it.size||(it.blob?.size||0))}</div>
              <span class="page-badge" id="pgbadge-\${it.id}">\${isActive && current.paragraphs?.length ? \`p.\${(current.paragraphs[current.idx]?.page||1)} / \${pages}\` : \`\${pages}p\`}</span>
            </div>
            <div class="thinbar"><i id="bar-\${it.id}" style="width:\${pct}%"></i></div>
          </div>
          <div style="display:flex;flex-direction:column;gap:6px;flex-shrink:0">
            <button class="icon-btn" data-play="\${it.id}" title="Play"><svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg></button>
            <button class="icon-btn ghost" data-view="\${it.id}" title="Ver"><svg viewBox="0 0 24 24"><path d="M12 5c-7 0-10 7-10 7s3 7 10 7 10-7 10-7-3-7-10-7zm0 12a5 5 0 110-10 5 5 0 010 10z"/></svg></button>
            <button class="icon-btn danger" data-del="\${it.id}" title="Apagar"><svg viewBox="0 0 24 24"><path d="M6 7h12v2H6zm2 3h8l-1 9H9zM9 4h6l1 2H8z"/></svg></button>
          </div>
        </div>
        \${snippetText ? \`<div class="item-snippet\${isActive?' playing':''}" id="snip-\${it.id}">\${esc(snippetText)}</div>\` : ''}
      \`;
      itemsWrap.appendChild(row);
    }
    itemsWrap.querySelectorAll('[data-play]').forEach(btn=>{ btn.onclick = (e)=>{e.stopPropagation(); startFromLibrary(e.currentTarget.getAttribute('data-play'), true);}; });
    itemsWrap.querySelectorAll('[data-view]').forEach(btn=>{ btn.onclick = (e)=>{e.stopPropagation(); viewFromLibrary(e.currentTarget.getAttribute('data-view'));}; });
    itemsWrap.querySelectorAll('[data-del]').forEach(btn=>{
      btn.onclick = async (e)=>{e.stopPropagation(); const id=e.currentTarget.getAttribute('data-del'); if(confirm('Remover?')){ await dbDelete(id); delete progressMap[id]; localStorage.setItem('di_nebula_progress', JSON.stringify(progressMap)); renderLibrary(); } };
    });
    attachItemDrag();
  }

  function updateItemSnippet(){
    if(!current.id || !current.paragraphs?.length) return;
    const seg = current.paragraphs[current.idx];
    if(!seg) return;
    const snipEl = document.getElementById('snip-'+current.id);
    if(snipEl){ snipEl.textContent = seg.text.slice(0,120); snipEl.className='item-snippet playing'; }
    const badge = document.getElementById('pgbadge-'+current.id);
    if(badge){ badge.textContent = \`p.\${seg.page||1} / \${current.pages||'?'}\`; }
    itemsWrap.querySelectorAll('.item').forEach(el=>{
      el.classList.toggle('is-active', el.dataset.id===current.id);
    });
  }
  async function clearLibrary(){
    if(!confirm('Remover TODOS os PDFs da biblioteca?')) return;
    const items = await dbAll(); for(const it of items){ await dbDelete(it.id); }
    progressMap = {}; localStorage.setItem('di_nebula_progress', JSON.stringify(progressMap));
    await renderLibrary();
  }

  // ====== Bookmarks ======
  function getBookmarks(){ return JSON.parse(localStorage.getItem('di_nebula_bookmarks')||'[]'); }
  function saveBookmarks(arr){ localStorage.setItem('di_nebula_bookmarks', JSON.stringify(arr)); }
  function addBookmark(){
    if(!current.id || !current.paragraphs.length) return alert('Nada para marcar.');
    const seg = current.paragraphs[current.idx] || {text:''};
    const arr = getBookmarks();
    arr.unshift({ id:'bm-'+Date.now(), docId: current.id, docName: current.name, page: seg.page||1, segIdx: current.idx, text: seg.text.slice(0,160), at: Date.now() });
    saveBookmarks(arr); renderBookmarks(); alert('Marcador salvo.');
  }
  function renderBookmarks(){
    const arr = getBookmarks(); bmList.innerHTML='';
    if(!arr.length){ bmList.innerHTML = '<div class="muted">Sem marcadores ainda. Use o botão ⭐ no viewer.</div>'; return; }
    for(const bm of arr.slice(0,50)){
      const el = document.createElement('div'); el.className='bm-item';
      el.innerHTML = \`
        <div class="bm-text">
          <strong>\${esc(bm.docName)} — p.\${bm.page}</strong>
          <small>\${new Date(bm.at).toLocaleString()} — \${esc(bm.text)}</small>
        </div>
        <button class="btn" data-bm-go="\${bm.id}">Play</button>
        <button class="btn" style="background:#ffe3e6;color:#7a1a25" data-bm-del="\${bm.id}">Remover</button>
      \`;
      bmList.appendChild(el);
    }
    bmList.querySelectorAll('[data-bm-go]').forEach(b=>{
      b.onclick = async (e)=>{
        const id = e.currentTarget.getAttribute('data-bm-go');
        const bm = getBookmarks().find(x=>x.id===id); if(!bm) return;
        await startFromLibrary(bm.docId, false);
        current.idx = bm.segIdx || 0;
        openViewerForCurrent();
        speakCurrent();
      };
    });
    bmList.querySelectorAll('[data-bm-del]').forEach(b=>{
      b.onclick = (e)=>{
        const id = e.currentTarget.getAttribute('data-bm-del');
        const arr = getBookmarks().filter(x=>x.id!==id); saveBookmarks(arr); renderBookmarks();
      };
    });
  }
  clearBmBtn.onclick = ()=>{ if(confirm('Remover todos os marcadores?')){ saveBookmarks([]); renderBookmarks(); } };

  // ====== Import/Export biblioteca ======
  async function onPickFiles(ev){
    const allFiles = Array.from(ev.target.files||[]); ev.target.value = '';
    if(!allFiles.length) return;
    const mds   = allFiles.filter(f=> /\\.(md|txt)$/i.test(f.name));
    const zips  = allFiles.filter(f=> /\\.zip$/i.test(f.name));
    const pdfs  = allFiles.filter(f=> !(/\\.(md|txt|zip)$/i.test(f.name)));

    if(pdfs.length){
      importStatus.textContent = \`Importando \${pdfs.length} PDF(s)...\`;
      for(let i=0;i<pdfs.length;i++){
        const f = pdfs[i]; const id = 'pdf-'+Date.now()+'-'+Math.floor(Math.random()*99999);
        await dbPut({id, name:f.name, blob:f, size:f.size, savedAt:Date.now(), pages:0});
        const pct = Math.round((i+1)/pdfs.length*100);
        importBar.style.width = pct+'%'; importStatus.textContent = \`Importando \${i+1}/\${pdfs.length} (\${pct}%)\`;
        await new Promise(r=>setTimeout(r,30));
      }
      importStatus.textContent = 'Import PDFs concluído';
      setTimeout(()=>{ importBar.style.width='0%'; importStatus.textContent='Pronto'; }, 1500);
    }
    if(mds.length){
      importStatus.textContent = \`Importando \${mds.length} texto(s)...\`;
      for(const f of mds){
        const text = await f.text();
        const firstLine = text.split(/\\n/).map(l=>l.replace(/^#+\\s*/,'')).find(l=>l.trim().length>2) || f.name;
        const shortTitle = firstLine.trim().slice(0,40);
        const id = 'md-'+Date.now()+'-'+Math.floor(Math.random()*99999);
        const blob = new Blob([text],{type:'text/plain'});
        const paras = text.split(/\\n{2,}|(?<=[.!?])\\s{1,}(?=[A-ZÁÉÍÓÚ])/g)
          .map(t=>t.replace(/^#+\\s*/,'').trim()).filter(t=>t.length>2)
          .flatMap(t=> t.length>500 ? [...Array(Math.ceil(t.length/400))].map((_,i)=>({text:t.slice(i*400,(i+1)*400),page:1})) : [{text:t,page:1}]);
        await dbPut({id, name:shortTitle+(f.name.endsWith('.md')?'.md':'.txt'), blob, size:blob.size, savedAt:Date.now(), pages:1, type:'md', _paras:JSON.stringify(paras), snippet:paras[0]?.text?.slice(0,120)||''});
      }
      importStatus.textContent = 'Textos importados ✓';
      setTimeout(()=>{ importBar.style.width='0%'; importStatus.textContent='Pronto'; }, 1500);
    }
    if(zips.length){
      const JSZip = window.JSZip;
      for(const z of zips){
        importStatus.textContent = \`Abrindo ZIP: \${z.name}\`;
        const zip = await JSZip.loadAsync(z);
        const names = Object.keys(zip.files).filter(n=>!zip.files[n].dir && /\\.pdf$/i.test(n));
        if(!names.length){ importStatus.textContent = 'ZIP sem PDFs'; continue; }
        let done=0;
        for(const n of names){
          const u8 = await zip.files[n].async('uint8array');
          const blob = new Blob([u8],{type:'application/pdf'});
          const id = 'pdf-'+Date.now()+'-'+Math.floor(Math.random()*99999);
          await dbPut({id, name:n.split('/').pop(), blob, size:blob.size, savedAt:Date.now(), pages:0});
          done++; const pct = Math.round(done/names.length*100);
          importBar.style.width = pct+'%'; importStatus.textContent = \`Import ZIP \${done}/\${names.length} (\${pct}%)\`;
          await new Promise(r=>setTimeout(r,30));
        }
      }
      setTimeout(()=>{ importBar.style.width='0%'; importStatus.textContent='Pronto'; }, 1500);
    }
    await renderLibrary();
  }

  async function onExportZip(){
    const JSZip = window.JSZip;
    const items = await dbAll();
    if(!items.length){ alert('Biblioteca vazia.'); return; }
    exportStatus.textContent = 'Preparando ZIP...'; exportBar.style.width='2%';
    const zip = new JSZip(); const meta=[];
    for(const it of items){ zip.file(safeName(it.name), it.blob); meta.push({id:it.id,name:it.name,size:(it.size||it.blob.size),savedAt:it.savedAt,pages:it.pages}); }
    zip.file('metadata.json', JSON.stringify(meta,null,2));
    const blob = await zip.generateAsync({type:'blob'}, (m)=>{ exportBar.style.width = Math.round(m.percent)+'%'; exportStatus.textContent = \`Gerando ZIP — \${Math.round(m.percent)}%\`; });
    const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href=url; a.download='nebula-library-'+new Date().toISOString().slice(0,10)+'.zip'; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
    exportStatus.textContent = 'Export concluído';
    setTimeout(()=>{ exportBar.style.width='0%'; exportStatus.textContent='Pronto'; }, 1800);
  }

  // ====== Ações de item ======
  async function startFromLibrary(id, autoplay=false){
    const rec = await dbGet(id);
    if(!rec){ alert('Arquivo não encontrado'); return; }
    await loadCurrentFromRecord(rec, {parseText:true});
    if(autoplay) startSpeaking();
  }
  async function viewFromLibrary(id){
    const rec = await dbGet(id);
    if(!rec){ alert('Arquivo não encontrado'); return; }
    await loadCurrentFromRecord(rec, {parseText:false});
    openViewerForCurrent();
  }

  async function loadCurrentFromRecord(rec, {parseText} = {parseText:true}){
    current.id = rec.id; current.name = rec.name;
    nowPlaying.textContent = rec.name;
    const ab = await rec.blob.arrayBuffer();
    current.pdfData = new Uint8Array(ab);
    if(rec.type==='md' && rec._paras){
      current.pdfDoc = null; current.pdfData = null; current.pages = 1;
      if(parseText){
        current.paragraphs = JSON.parse(rec._paras);
        const savedPct = progressMap[current.id]||0;
        current.idx = Math.floor((savedPct/100)*current.paragraphs.length);
        if(current.idx>=current.paragraphs.length) current.idx=0;
        updateProgressBars(false);
      }
      return;
    }
    current.pdfDoc = await pdfjsLib.getDocument({data: current.pdfData}).promise;
    current.pages = current.pdfDoc.numPages;
    if(parseText){
      current.paragraphs = await extractTextSmart(current.pdfDoc);
      for(const seg of current.paragraphs){ delete seg._karaTrailIdx; }
      
      const savedPct = progressMap[current.id] || 0;
      current.idx = Math.floor((savedPct / 100) * current.paragraphs.length);
      if(current.idx >= current.paragraphs.length) current.idx = 0;
      updateProgressBars(false); 
    }
  }

  // ====== Overlay / Continuous ======
  let ovPage = 1, ovPages = 0, ovScale = parseFloat(ovZoom.value)||1.2;

  async function openViewerForCurrent(){
    if(!current.id){
      const list = await dbAll(); if(list.length){ await viewFromLibrary(list.sort((a,b)=>b.savedAt-a.savedAt)[0].id); } else { alert('Importe um PDF primeiro.'); }
      return;
    }
    if(!current.pdfDoc){ current.pdfDoc = await pdfjsLib.getDocument({data: current.pdfData}).promise; current.pages = current.pdfDoc.numPages; }
    ovTitle.textContent = current.name || 'PDF';
    ovPages = current.pages; if(!ovPage) ovPage = 1;
    overlay.classList.add('show'); overlay.setAttribute('aria-hidden','false');
    if(contMode){ ensureContinuous(); const pg = current.paragraphs[current.idx]?.page || ovPage; scrollToPage(pg); prepareTimeline(pg); }
    else { await renderOverlayPage(); }
  }
  function closeOverlay(){ overlay.classList.remove('show'); overlay.setAttribute('aria-hidden','true'); clearHighlight(); }

  function toggleContinuous(){
    contMode = !contMode; contBtn.textContent = 'Continuous: ' + (contMode?'ON':'OFF');
    if(contMode){
      ovCanvas.style.display='none'; ovSkel.style.display='none'; ovTrail.style.display='none'; ovHl.style.display='none'; ovCont.style.display='block';
      ensureContinuous();
      const pg = current.paragraphs[current.idx]?.page || ovPage; scrollToPage(pg); prepareTimeline(pg);
    }else{
      ovCont.style.display='none'; ovCanvas.style.display='block'; ovSkel.style.display='block'; ovTrail.style.display='block'; ovHl.style.display='block';
      renderOverlayPage();
    }
  }
  function toggleKaraoke(){ karaMode = !karaMode; karaBtn.textContent = 'Karaoke: ' + (karaMode ? 'ON' : 'OFF'); if(!karaMode) clearAllTrails(); }
  function toggleSkeleton(){ skelMode = !skelMode; skelBtn.textContent = 'Skeleton: ' + (skelMode ? 'ON' : 'OFF'); if(skelMode) { drawSkeleton(curPage()); } else { clearSkeletonLayers(); } }

  async function ensureContinuous(){
    if(!Object.keys(contMap).length){
      ovCont.innerHTML='';
      for(let p=1;p<=current.pages;p++){
        const wrap=document.createElement('div'); wrap.className='pageWrap'; wrap.id='pg-'+p;
        const cnv = document.createElement('canvas'); cnv.width=600; cnv.height=800;
        const sk  = document.createElement('canvas'); sk.className='skelLayer'; sk.width=600; sk.height=800; sk.style.position='absolute';
        const tr  = document.createElement('canvas'); tr.className='trailLayer'; tr.width=600; tr.height=800; tr.style.position='absolute';
        const hl  = document.createElement('canvas'); hl.className='hlLayer'; hl.width=600; hl.height=800; hl.style.position='absolute';
        wrap.appendChild(cnv); wrap.appendChild(sk); wrap.appendChild(tr); wrap.appendChild(hl);
        ovCont.appendChild(wrap);
        contMap[p] = {wrap, canvas:cnv, skel:sk, trail:tr, hl:hl, rendered:false};
      }
    }
    const center = current.paragraphs[current.idx]?.page || 1;
    for(const p of [center-1, center, center+1]){
      if(p>=1 && p<=current.pages) await renderContPage(p);
    }
  }
  async function renderContPage(p){
    const obj = contMap[p]; if(!obj || obj.rendered) return;
    const page = await current.pdfDoc.getPage(p);
    const viewport = page.getViewport({ scale: ovScale });
    obj.canvas.width = viewport.width; obj.canvas.height = viewport.height;
    obj.skel.width   = viewport.width; obj.skel.height   = viewport.height;
    obj.trail.width  = viewport.width; obj.trail.height  = viewport.height;
    obj.hl.width     = viewport.width; obj.hl.height     = viewport.height;
    await page.render({canvasContext: obj.canvas.getContext('2d'), viewport}).promise;
    obj.rendered = true;
    if(skelMode) drawSkeleton(p);
  }
  function scrollToPage(p){ const obj = contMap[p]; if(!obj) return; obj.wrap.scrollIntoView({behavior:'smooth', block:'center'}); }

  async function renderOverlayPage(){
    if(!current.pdfDoc) return;
    const page = await current.pdfDoc.getPage(ovPage);
    const viewport = page.getViewport({ scale: ovScale });
    ovCanvas.width = viewport.width; ovCanvas.height = viewport.height;
    ovSkel.width   = viewport.width; ovSkel.height   = viewport.height;
    ovTrail.width  = viewport.width; ovTrail.height  = viewport.height;
    ovHl.width     = viewport.width; ovHl.height     = viewport.height;
    await page.render({canvasContext: ovCtx, viewport}).promise;
    ovPageInfo.textContent = \`\${ovPage} / \${ovPages}\`;
    clearHighlight();
    if(skelMode) drawSkeleton(ovPage);
    prepareTimeline(ovPage);
  }

  function clearHighlight(){
    ovHlCtx.clearRect(0,0,ovHl.width,ovHl.height);
    if(contMode){ for(const p in contMap){ const ctx=contMap[p].hl.getContext('2d'); ctx.clearRect(0,0,contMap[p].hl.width, contMap[p].hl.height); } }
  }
  function clearAllTrails(){
    ovTrailCtx.clearRect(0,0,ovTrail.width,ovTrail.height);
    for(const p in contMap){ const ctx=contMap[p].trail.getContext('2d'); ctx.clearRect(0,0,contMap[p].trail.width, contMap[p].trail.height); }
    for(const seg of current.paragraphs){ delete seg._karaTrailIdx; }
  }
  function clearSkeletonLayers(){
    ovSkelCtx.clearRect(0,0,ovSkel.width,ovSkel.height);
    for(const p in contMap){ const ctx=contMap[p].skel.getContext('2d'); ctx.clearRect(0,0,contMap[p].skel.width, contMap[p].skel.height); }
  }

  // ====== Timeline ======
  async function ensurePageWords(page){
    if(ocrCache[page]?.pageWords) return ocrCache[page].pageWords;
    if(!ocrCache[page]?.segments){
      const pg = await current.pdfDoc.getPage(page);
      await ocrPage(pg, page);
    }
    const segs = ocrCache[page].segments || [];
    let base=0; const flat=[];
    for(const seg of segs){
      seg._pageWordBase = base;
      if(seg.words){ flat.push(...seg.words); base += seg.words.length; }
    }
    ocrCache[page].pageWords = flat;
    return flat;
  }
  async function prepareTimeline(page){
    const cvs = ovTimeline;
    const words = await ensurePageWords(page);
    if(!words || !words.length){ clearTimeline(); return; }
    const bins = 80, counts = new Array(bins).fill(0);
    const total = words.length;
    for(let i=0;i<total;i++){ counts[Math.floor(i*bins/total)]++; }
    const max = Math.max(1, ...counts);
    timelineCache[page] = {bins, counts, total, max};
    redrawTimeline(page, pageProgress[page]||0);
  }
  function redrawTimeline(page, idx=0){
    const cvs = ovTimeline; const rect = cvs.getBoundingClientRect();
    cvs.width = Math.max(300, Math.floor(rect.width||900)); cvs.height = 36;
    const ctx = cvs.getContext('2d'); ctx.clearRect(0,0,cvs.width,cvs.height);
    const t = timelineCache[page]; if(!t){ return; }
    const w=cvs.width, h=cvs.height, pad=4, barW=(w-2*pad)/t.bins;
    for(let b=0;b<t.bins;b++){
      const v=t.counts[b]/t.max, bh=(h-2*pad)*v;
      ctx.fillStyle='rgba(255,255,255,0.18)';
      ctx.fillRect(pad + b*barW, h-pad-bh, Math.max(1,barW*0.8), bh);
    }
    const frac = t.total ? (idx / t.total) : 0;
    const progX = pad + (w-2*pad)*frac;
    ctx.fillStyle='rgba(122,87,255,0.25)'; ctx.fillRect(pad, pad, progX-pad, h-2*pad);
    ctx.fillStyle='rgba(92,198,255,0.95)'; ctx.fillRect(progX-1, pad, 2, h-2*pad);
  }
  function clearTimeline(){ const ctx = ovTimeline.getContext('2d'); ctx.clearRect(0,0,ovTimeline.width, ovTimeline.height); }

  // ====== Busca ======
  function doSearch(){
    const q = searchInput.value.trim(); if(!q){ searchHits=[]; searchPtr=0; searchCount.textContent='0/0'; ovSnippet.textContent='—'; clearHighlight(); return; }
    const Q = normalize(q); searchHits = [];
    for(let i=0;i<current.paragraphs.length;i++){
      const seg = current.paragraphs[i]; const norm=normalize(seg.text); let idx=0;
      while((idx = norm.indexOf(Q, idx)) !== -1){ searchHits.push({ segIdx:i, page: seg.page||1, start: idx, len: Q.length }); idx += Q.length; }
    }
    searchPtr = 0; searchCount.textContent = searchHits.length ? \`1/\${searchHits.length}\` : '0/0';
    if(searchHits.length){ gotoSearchHit(0, true); }
  }
  function navSearch(delta){
    if(!searchHits.length) return;
    searchPtr = (searchPtr + delta + searchHits.length) % searchHits.length;
    searchCount.textContent = \`\${searchPtr+1}/\${searchHits.length}\`;
    gotoSearchHit(searchPtr, false);
  }
  function gotoSearchHit(i, speak){
    const hit = searchHits[i]; if(!hit) return;
    current.idx = hit.segIdx; const seg = current.paragraphs[current.idx];
    if(!overlay.classList.contains('show')) openViewerForCurrent();
    if(contMode){ ensureContinuous(); scrollToPage(seg.page||1); }
    else { ovPage = seg.page||1; renderOverlayPage(); }
    const txt = seg.text;
    const before = esc(txt.slice(Math.max(0, hit.start-80), hit.start));
    const mid = esc(txt.slice(hit.start, hit.start+hit.len));
    const after = esc(txt.slice(hit.start+hit.len, hit.start+hit.len+160));
    ovSnippet.innerHTML = \`…\${before}<mark>\${mid}</mark>\${after}…\`;
    clearHighlight();
    if(seg.words && seg.baseW && seg.baseH){
      const end = hit.start + hit.len;
      const words = seg.words.filter(w => (w.start < end && (w.start + w.len) > hit.start));
      if(contMode){
        const ctx = contMap[seg.page].hl.getContext('2d'); const sx = contMap[seg.page].hl.width / seg.baseW; const sy = contMap[seg.page].hl.height / seg.baseH;
        ctx.fillStyle='rgba(255,213,77,.35)'; ctx.strokeStyle='rgba(92,198,255,.9)'; ctx.lineWidth=2;
        words.forEach(w=>{ const x=w.x0*sx, y=w.y0*sy, wdt=(w.x1-w.x0)*sx, hgt=(w.y1-w.y0)*sy; roundRect(ctx, x-2,y-2,wdt+4,hgt+4,5, true, true); });
      }else{
        const sx = ovCanvas.width / seg.baseW; const sy = ovCanvas.height / seg.baseH;
        ovHlCtx.fillStyle='rgba(255,213,77,.35)'; ovHlCtx.strokeStyle='rgba(92,198,255,.9)'; ovHlCtx.lineWidth=2;
        words.forEach(w=>{ const x=w.x0*sx, y=w.y0*sy, wdt=(w.x1-w.x0)*sx, hgt=(w.y1-w.y0)*sy; roundRect(ovHlCtx, x-2,y-2,wdt+4,hgt+4,5, true, true); });
      }
    }
    if(speak){ speakCurrent(); }
  }

  // ====== TTS ======
  async function onListenMain(){
    if(!current.id){
      const list = await dbAll();
      if(list.length){ await startFromLibrary(list.sort((a,b)=>b.savedAt-a.savedAt)[0].id, true); }
      else{ filePicker.click(); }
      return;
    }
    togglePlayPause();
  }
  function startSpeaking(){
    if(!('speechSynthesis' in window)){ alert('SpeechSynthesis não suportado.'); return; }
    if(!current.paragraphs.length){ alert('Não há texto reconhecido no PDF.'); return; }
    setPP(true); current.playing = true; speakCurrent();
  }
  function togglePlayPause(){
    if(!current.id){ onListenMain(); return; }
    if(speechSynthesis.speaking && !speechSynthesis.paused){ speechSynthesis.pause(); current.playing=false; setPP(false); }
    else if(speechSynthesis.paused){ speechSynthesis.resume(); current.playing=true; setPP(true); }
    else{ startSpeaking(); }
  }
  function prevSegment(){ if(!current.paragraphs.length) return; speechSynthesis.cancel(); current.idx = Math.max(0, current.idx-1); speakCurrent(); }
  function nextSegment(){ if(!current.paragraphs.length) return; speechSynthesis.cancel(); current.idx = Math.min(current.paragraphs.length-1, current.idx+1); speakCurrent(); }

  function speakCurrent(){
    if(utter){ speechSynthesis.cancel(); utter=null; }
    const seg = current.paragraphs[current.idx]; if(!seg){ current.playing=false; setPP(false); return; }
    
    if(overlay.classList.contains('show')){
      const pg = seg.page||ovPage;
      if(contMode){ ensureContinuous(); scrollToPage(pg); prepareTimeline(pg); }
      else { if(pg !== ovPage){ ovPage = pg; renderOverlayPage(); } else { prepareTimeline(pg); } }
    }
    ovSnippet.textContent = seg.text.slice(0,250);
    updateItemSnippet();

    utter = new SpeechSynthesisUtterance(seg.text);
    const v = voices.find(x=>x.name===voiceSelect.value) || voices[0]; if(v) utter.voice = v;
    utter.rate = parseFloat(rateRange.value)||1; utter.pitch = parseFloat(document.getElementById('pitchRange')?.value ?? settings.pitch ?? 1);

    utter.onboundary = (e)=>{
      const ch = e.charIndex||0;
      if(seg.words && seg.baseW && seg.baseH){
        let wi = -1, wcur=null;
        for(let i=0;i<seg.words.length;i++){ const w=seg.words[i]; if(ch>=w.start && ch<w.start+w.len){ wi=i; wcur=w; break; } }
        if(wcur){
          drawCurrentWordHighlight(seg.page, wcur, seg.baseW, seg.baseH);
          if(karaMode){
            const from = (typeof seg._karaTrailIdx==='number'? seg._karaTrailIdx+1 : 0);
            if(wi>=from){ addTrailWords(seg.page, seg.words, from, wi, seg.baseW, seg.baseH); seg._karaTrailIdx = wi; }
          }
          const base = seg._pageWordBase || 0;
          const pageIdx = base + wi + 1; 
          pageProgress[seg.page] = pageIdx;
          redrawTimeline(seg.page, pageIdx);
        }
      }
    };
    utter.onend = ()=>{
      if(current.idx < current.paragraphs.length-1){ current.idx++; updateProgressBars(false); speakCurrent(); }
      else { current.playing=false; setPP(false); updateProgressBars(true); }
    };
    speechSynthesis.speak(utter);
    updateProgressBars(false);
  }

  function drawCurrentWordHighlight(page, word, baseW, baseH){
    const drawRect = (ctx, W, H)=>{
      const sx = W / baseW, sy = H / baseH;
      ctx.clearRect(0,0,W,H);
      ctx.fillStyle='rgba(122,87,255,.38)'; ctx.strokeStyle='rgba(92,198,255,.95)'; ctx.lineWidth=2;
      const x=word.x0*sx, y=word.y0*sy, w=(word.x1-word.x0)*sx, h=(word.y1-word.y0)*sy;
      roundRect(ctx, x-2,y-2,w+4,h+4,6, true, true);
    };
    if(contMode){ const obj=contMap[page]; if(!obj) return; drawRect(obj.hl.getContext('2d'), obj.hl.width, obj.hl.height); }
    else{ drawRect(ovHlCtx, ovHl.width, ovHl.height); }
  }
  function addTrailWords(page, words, fromIdx, toIdx, baseW, baseH){
    const fillTrail = (ctx, W, H)=>{
      const sx = W / baseW, sy = H / baseH;
      ctx.fillStyle='rgba(255,213,77,.20)'; ctx.strokeStyle='rgba(255,213,77,.35)'; ctx.lineWidth=1.5;
      for(let i=fromIdx;i<=toIdx;i++){
        const w=words[i]; const x=w.x0*sx, y=w.y0*sy, wd=(w.x1-w.x0)*sx, ht=(w.y1-w.y0)*sy;
        roundRect(ctx, x-1.5,y-1.5,wd+3,ht+3,4, true, false);
      }
    };
    if(contMode){ const obj=contMap[page]; if(!obj) return; fillTrail(obj.trail.getContext('2d'), obj.trail.width, obj.trail.height); }
    else{ fillTrail(ovTrailCtx, ovTrail.width, ovTrail.height); }
  }

  function updateProgressBars(finished){
    if(!current.id) return;
    const pct = finished ? 100 : ((current.idx+1)/current.paragraphs.length*100);
    
    progressSlider.value = pct.toFixed(1);
    timeCur.textContent = Math.round(pct) + '%';
    
    const bar = document.getElementById('bar-'+current.id); if(bar) bar.style.width = pct + '%';
    progressMap[current.id] = pct; localStorage.setItem('di_nebula_progress', JSON.stringify(progressMap));
  }

  // ====== Skeleton ======
  async function drawSkeleton(page){
    const cache = ocrCache[page];
    const words = await ensurePageWords(page);
    if(!words || !words.length) return;
    const baseW = cache.baseW||1000, baseH = cache.baseH||1000;
    const drawSk = (ctx, W, H)=>{
      const sx=W/baseW, sy=H/baseH;
      ctx.clearRect(0,0,W,H);
      ctx.fillStyle='rgba(255,255,255,0.07)'; ctx.strokeStyle='rgba(255,255,255,0.12)'; ctx.lineWidth=1;
      for(const w of words){ const x=w.x0*sx, y=w.y0*sy, wd=(w.x1-w.x0)*sx, ht=(w.y1-w.y0)*sy; roundRect(ctx, x,y,wd,ht,3, true, true); }
    };
    if(contMode){ const obj=contMap[page]; if(!obj) return; drawSk(obj.skel.getContext('2d'), obj.skel.width, obj.skel.height); }
    else{ drawSk(ovSkelCtx, ovSkel.width, ovSkel.height); }
  }

  // ====== Trail Export / Import (PNG) ======
  function exportTrailPNG(){
    const p = curPage();
    let canvas = contMode ? (contMap[p]?.trail) : ovTrail;
    if(!canvas){ alert('Página não disponível.'); return; }
    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a'); a.href=url; a.download = \`\${safeName(current.name||'doc')}-trail-page-\${p}.png\`;
    document.body.appendChild(a); a.click(); a.remove();
  }
  function importTrailPNG(ev){
    const file = ev.target.files?.[0]; ev.target.value = '';
    if(!file) return;
    const p = curPage(); let canvas = contMode ? (contMap[p]?.trail) : ovTrail;
    if(!canvas){ alert('Página não disponível.'); return; }
    const img = new Image();
    img.onload = ()=>{ const ctx=canvas.getContext('2d'); ctx.clearRect(0,0,canvas.width,canvas.height); ctx.drawImage(img, 0,0, canvas.width, canvas.height); };
    img.onerror = ()=> alert('Falha ao carregar PNG.');
    const reader = new FileReader(); reader.onload = ()=> img.src = reader.result; reader.readAsDataURL(file);
  }

  // ====== Extração Inteligente ======
  async function extractTextSmart(pdfDoc){
    const parts = [];
    for(let p=1; p<=pdfDoc.numPages; p++){
      const page = await pdfDoc.getPage(p);
      const c = await page.getTextContent();
      const textJoined = (c.items||[]).map(i=>i.str).join(' ').trim();
      if(!textJoined || textJoined.length < 20 || (c.items||[]).length < 5){
        const segs = await ocrPage(page, p); parts.push(...segs);
      }else{
        const split = textJoined.split(/\\n+|\\r+|\\.\\s{1,}|•|-{2,}/g).map(t=>t.trim()).filter(Boolean);
        for(const seg of split){
          if(seg.length>600){ for(let i=0;i<seg.length;i+=420){ parts.push({text:seg.slice(i,i+420), page:p}); } }
          else{ parts.push({text:seg, page:p}); }
        }
      }
    }
    const perPage = {};
    parts.forEach(seg=>{ if(seg.words) (perPage[seg.page]||(perPage[seg.page]=[])).push(seg); });
    for(const p in perPage){
      let base=0; const fl=[];
      for(const seg of perPage[p]){ seg._pageWordBase = base; if(seg.words){ fl.push(...seg.words); base += seg.words.length; } }
      if(!ocrCache[p]) ocrCache[p]={};
      if(!ocrCache[p].pageWords) ocrCache[p].pageWords = fl;
    }
    return parts;
  }

  async function ocrPage(page, pageNum){
    if(ocrCache[pageNum]) return ocrCache[pageNum].segments;
    const vw = page.getViewport({scale:1.6});
    const cnv = document.createElement('canvas'); cnv.width = vw.width; cnv.height = vw.height;
    await page.render({canvasContext: cnv.getContext('2d'), viewport: vw}).promise;
    let result;
    try{ result = await Tesseract.recognize(cnv, 'por+eng', { logger:()=>{} }); }
    catch(e){ console.warn('OCR falhou:', e); ocrCache[pageNum]={baseW:cnv.width, baseH:cnv.height, segments:[{text:'[OCR indisponível nesta página]', page:pageNum}]}; return ocrCache[pageNum].segments; }
    const words = result?.data?.words || [];
    const groups = {};
    words.forEach((w)=>{ const key = \`\${w.block_num||0}-\${w.par_num||0}-\${w.line_num||0}\`; (groups[key]||(groups[key]=[])).push(w); });
    const segments = [];
    for(const k of Object.keys(groups)){
      const arr = groups[k].sort((a,b)=> (a.x0-b.x0) || (a.y0-b.y0));
      const text = arr.map(w=>w.text).join(' ').trim(); if(!text) continue;
      let cursor = 0;
      const wordsMap = arr.map(w=>{
        const t = (w.text||'').toString(); const start = cursor; const len = t.length + 1; cursor += len;
        const bb = w.bbox || w; return { t, x0:bb.x0, y0:bb.y0, x1:bb.x1, y1:bb.y1, start, len };
      });
      segments.push({ text, page: pageNum, words: wordsMap, baseW: cnv.width, baseH: cnv.height });
    }
    ocrCache[pageNum] = { baseW: cnv.width, baseH: cnv.height, segments };
    return segments;
  }

})();

(() => {
  const KEY = 'di_nebula_libCollapsed';
  const card = document.getElementById('libCard');
  const header = card?.querySelector('.row') || card?.firstElementChild;

  if (!card || !header) return;

  let btn = document.getElementById('libToggleBtn');
  if (!btn) {
    btn = document.createElement('button');
    btn.id = 'libToggleBtn';
    btn.type = 'button';
    btn.textContent = 'Collapse';
    btn.title = 'Colapsar / expandir library';
    card.insertBefore(btn, card.firstChild);
  }

  const isMobile = () => window.matchMedia('(max-width: 820px)').matches;

  function apply(collapsed) {
    card.classList.toggle('is-collapsed', collapsed);
    btn.textContent = collapsed ? 'Open' : 'Collapse';
    btn.setAttribute('aria-expanded', String(!collapsed));
    localStorage.setItem(KEY, collapsed ? '1' : '0');
  }

  btn.addEventListener('click', () => {
    apply(!card.classList.contains('is-collapsed'));
  });

  const saved = localStorage.getItem(KEY);
  if (saved === null) {
    apply(isMobile());
  } else {
    apply(saved === '1');
  }

  window.addEventListener('resize', () => {
    if (localStorage.getItem(KEY) === null) {
      apply(isMobile());
    }
  });
})();

(() => {
  const KEY = 'di_nebula_libDrawerOpen';
  const card = document.getElementById('libCard');
  if (!card) return;

  let handle = card.querySelector('.lib-drawer-handle');
  if (!handle) {
    handle = document.createElement('button');
    handle.type = 'button';
    handle.className = 'lib-drawer-handle';
    handle.innerHTML = '<span>LIBRARY</span>';
    card.prepend(handle);
  }

  function setOpen(open) {
    card.classList.toggle('is-open', open);
    handle.setAttribute('aria-expanded', String(open));
    localStorage.setItem(KEY, open ? '1' : '0');
  }

  handle.addEventListener('click', (e) => {
    e.stopPropagation();
    setOpen(!card.classList.contains('is-open'));
  });

  const saved = localStorage.getItem(KEY);
  setOpen(saved === '1');

  document.addEventListener('click', (e) => {
    if (!card.classList.contains('is-open')) return;
    const clickedInside = card.contains(e.target);
    if (!clickedInside) setOpen(false);
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') setOpen(false);
  });

  const applyMobileBias = () => {
    if (window.matchMedia('(max-width: 820px)').matches) {
      if (localStorage.getItem(KEY) === null) setOpen(false);
    }
  };

  applyMobileBias();
  window.addEventListener('resize', applyMobileBias);
})();

/* ============================================================
   QUICK PASTE ENGINE + MD AUTO-PLAY + DRAG SECTIONS
   ============================================================ */
(function(){
  // ---- Quick Paste Panel ----
  const qpBtn    = document.getElementById('quickPasteBtn');
  const qpPanel  = document.getElementById('quickPastePanel');
  const qpClose  = document.getElementById('qp-close');
  const qpTa     = document.getElementById('qp-textarea');
  const qpGo     = document.getElementById('qp-go');
  const qpClip   = document.getElementById('qp-clipboard');
  const qpInput  = document.getElementById('qp-input');
  const qpHtml   = document.getElementById('qp-html');
  const qpLast   = document.getElementById('qp-last');

  const LAST_TEXT_KEY = 'di_nebula_lastText';

  function showPanel(){ if(qpPanel) qpPanel.style.display='block'; }
  function hidePanel(){ if(qpPanel) qpPanel.style.display='none'; if(qpTa) qpTa.style.display='none'; if(qpGo) qpGo.style.display='none'; }

  if(qpBtn) qpBtn.addEventListener('click', ()=>{ qpPanel.style.display === 'none' ? showPanel() : hidePanel(); });
  if(qpClose) qpClose.addEventListener('click', hidePanel);

  function activateText(text){
    if(!text || !text.trim()) return;
    localStorage.setItem(LAST_TEXT_KEY, text);
    // Build paragraphs
    const paras = text.split(/\\n{2,}|(?<=[.!?])\\s{1,}(?=[A-ZÁÉÍÓÚ])/g)
      .map(t=>t.replace(/^#+\\s*/,'').trim()).filter(t=>t.length>2)
      .flatMap(t=> t.length>500 ? [...Array(Math.ceil(t.length/400))].map((_,i)=>({text:t.slice(i*400,(i+1)*400),page:1})) : [{text:t,page:1}]);
    if(!paras.length) return;
    // Generate short title
    const firstLine = text.split(/\\n/).map(l=>l.replace(/^#+\\s*/,'')).find(l=>l.trim().length>2)||'Texto colado';
    const title = firstLine.trim().slice(0,36);
    const id = 'paste-'+Date.now();
    
    window._nebulaCurrentOverride = {id, name:title, pages:1, type:'paste', paragraphs:paras, idx:0, playing:false, pdfDoc:null, pdfData:null};
    const nowPlaying = document.getElementById('nowPlaying');
    if(nowPlaying) nowPlaying.textContent = title;
    document.dispatchEvent(new CustomEvent('nebula:loadPaste', {detail:{id,title,paras}}));
    hidePanel();
  }

  if(qpClip) qpClip.addEventListener('click', async ()=>{
    try{
      const text = await navigator.clipboard.readText();
      if(text && text.trim()){ activateText(text); }
      else{ alert('Clipboard vazio ou sem permissão.'); }
    }catch(e){ alert('Permissão de clipboard negada. Use Ctrl+V no campo de texto.'); showTextarea(); }
  });

  if(qpInput) qpInput.addEventListener('click', showTextarea);
  if(qpHtml) qpHtml.addEventListener('click', ()=>{
    const html = document.body.innerHTML;
    const div = document.createElement('div'); div.innerHTML = html;
    const text = div.innerText;
    activateText(text.slice(0,8000));
  });
  if(qpLast) qpLast.addEventListener('click', ()=>{
    const last = localStorage.getItem(LAST_TEXT_KEY);
    if(last){ activateText(last); } else { alert('Nenhum texto anterior salvo.'); }
  });

  function showTextarea(){
    if(qpTa){ qpTa.style.display='block'; qpTa.focus(); }
    if(qpGo){ qpGo.style.display='block'; }
  }

  if(qpGo) qpGo.addEventListener('click', ()=>{
    const text = qpTa?.value?.trim();
    if(text) activateText(text);
  });

  document.addEventListener('keydown', (e)=>{
    if(e.ctrlKey && e.key==='v' && qpPanel?.style.display !== 'none'){
      // browser handles paste natively
    }
  });

  document.addEventListener('nebula:loadPaste', (e)=>{
    const {id,title,paras} = e.detail;
    const ev2 = new CustomEvent('nebula:setPaste', {detail:{id,title,paras}});
    document.dispatchEvent(ev2);
  });
})();

/* ============================================================
   SECTION LONG-PRESS DRAG (Player, Bookmarks, Items)
   ============================================================ */
(function(){
  const libCard = document.getElementById('libCard');
  const dockZone = document.getElementById('libDockZone');
  const LONG_MS = 520;

  function makeDraggable(el, label){
    if(!el) return;
    let timer, startY, startX;

    const onStart = (e)=>{
      const pt = e.touches?.[0] || e;
      startX=pt.clientX; startY=pt.clientY;
      timer = setTimeout(()=>{
        el.classList.add('is-dragging');
        showDropZone(label);
      }, LONG_MS);
    };
    const onMove = (e)=>{
      const pt = e.touches?.[0]||e;
      if(Math.abs(pt.clientX-startX)>12||Math.abs(pt.clientY-startY)>12) clearTimeout(timer);
    };
    const onEnd = ()=>{ clearTimeout(timer); };

    el.addEventListener('mousedown', onStart);
    el.addEventListener('touchstart', onStart, {passive:true});
    el.addEventListener('mousemove', onMove);
    el.addEventListener('touchmove', onMove, {passive:true});
    el.addEventListener('mouseup', onEnd);
    el.addEventListener('touchend', onEnd);
  }

  function showDropZone(label){
    if(!dockZone) return;
    dockZone.style.outline = '2px dashed rgba(92,198,255,0.6)';
    dockZone.style.minHeight = '48px';
    dockZone.style.background = 'rgba(92,198,255,0.06)';
    const hint = document.createElement('div');
    hint.id = 'drop-hint';
    hint.style.cssText = 'text-align:center;font-size:11px;opacity:.6;padding:8px;pointer-events:none';
    hint.textContent = \`Solte aqui para encaixar: \${label}\`;
    if(!dockZone.querySelector('#drop-hint')) dockZone.appendChild(hint);
  }

  function clearDropZone(){
    if(!dockZone) return;
    dockZone.style.outline='';
    dockZone.style.background='';
    const h = dockZone.querySelector('#drop-hint');
    if(h) h.remove();
  }

  const playerEl = document.getElementById('playerDock');
  const bmSection = document.querySelector('section.card:has(#bmList)') || document.querySelector('[id="bmList"]')?.closest('section');

  makeDraggable(playerEl, 'Player');
  if(bmSection) makeDraggable(bmSection, 'Bookmarks');

  document.addEventListener('mouseup', handleDrop);
  document.addEventListener('touchend', handleDrop);

  function handleDrop(){
    document.querySelectorAll('.is-dragging').forEach(el=>{
      el.classList.remove('is-dragging');
      if(libCard?.classList.contains('is-open') && dockZone){
        const libRect = libCard.getBoundingClientRect();
        if(el.id==='playerDock'){
          el.classList.add('inline-docked');
          dockZone.appendChild(el);
          localStorage.setItem('di_nebula_playerDocked','1');
          const btn = document.getElementById('dockPlayerBtn');
          if(btn){ btn.textContent='⎚ Undock Player'; btn.classList.add('active'); }
        } else {
          dockZone.appendChild(el);
        }
      }
    });
    clearDropZone();
  }

  document.getElementById('items')?.addEventListener('mousedown', (e)=>{
    const item = e.target.closest('.item[data-id]');
    if(!item) return;
    let t = setTimeout(()=>{ item.classList.add('is-dragging'); }, LONG_MS);
    const up = ()=>{ clearTimeout(t); item.classList.remove('is-dragging'); document.removeEventListener('mouseup',up); };
    document.addEventListener('mouseup', up);
  });
})();

/* ============================================================
   SÜMBUS DOCK ENGINE — Player + SymbolBar ↔ Library Drawer
   ============================================================ */
(function(){
  const DOCK_PLAYER_KEY = 'di_nebula_playerDocked';
  const DOCK_SYMBAR_KEY = 'di_nebula_symbarDocked';

  const playerEl    = document.getElementById('playerDock');
  const symbolBarEl = document.getElementById('symbolBar');
  const dockZone    = document.getElementById('libDockZone');
  const dockPBtn    = document.getElementById('dockPlayerBtn');
  const dockSBtn    = document.getElementById('dockSymbolBarBtn');

  let playerOriginalParent = playerEl ? playerEl.parentNode : null;
  let playerOriginalNext   = playerEl ? playerEl.nextSibling : null;
  let symbarOriginalParent = symbolBarEl ? symbolBarEl.parentNode : null;
  let symbarOriginalNext   = symbolBarEl ? symbolBarEl.nextSibling : null;

  function setDockPlayer(docked){
    if(!playerEl || !dockZone) return;
    if(docked){
      playerEl.classList.add('inline-docked');
      dockZone.appendChild(playerEl);
    } else {
      playerEl.classList.remove('inline-docked');
      if(playerOriginalParent){
        playerOriginalParent.insertBefore(playerEl, playerOriginalNext);
      }
    }
    localStorage.setItem(DOCK_PLAYER_KEY, docked ? '1' : '0');
    if(dockPBtn){
      dockPBtn.textContent = docked ? '⎚ Undock Player' : '⎚ Dock Player';
      dockPBtn.classList.toggle('active', docked);
    }
  }

  function setDockSymBar(docked){
    if(!symbolBarEl || !dockZone) return;
    if(docked){
      symbolBarEl.classList.add('lib-docked');
      dockZone.appendChild(symbolBarEl);
    } else {
      symbolBarEl.classList.remove('lib-docked');
      if(symbarOriginalParent){
        symbarOriginalParent.insertBefore(symbolBarEl, symbarOriginalNext);
      }
    }
    localStorage.setItem(DOCK_SYMBAR_KEY, docked ? '1' : '0');
    if(dockSBtn){
      dockSBtn.textContent = docked ? '⌘ Undock SymBar' : '⌘ Dock SymBar';
      dockSBtn.classList.toggle('active', docked);
    }
  }

  const savedPlayer = localStorage.getItem(DOCK_PLAYER_KEY);
  const savedSymBar = localStorage.getItem(DOCK_SYMBAR_KEY);

  if(playerEl) { playerOriginalParent = playerEl.parentNode; playerOriginalNext = playerEl.nextSibling; }
  if(symbolBarEl) { symbarOriginalParent = symbolBarEl.parentNode; symbarOriginalNext = symbolBarEl.nextSibling; }

  if(savedPlayer === '1') setDockPlayer(true);
  if(savedSymBar === '1') setDockSymBar(true);

  if(dockPBtn) dockPBtn.addEventListener('click', () => {
    setDockPlayer(!playerEl.classList.contains('inline-docked'));
  });
  if(dockSBtn) dockSBtn.addEventListener('click', () => {
    setDockSymBar(!symbolBarEl.classList.contains('lib-docked'));
  });
})();

</script>

 <script type="module">
console.log("[RL] Infodose conectado");
console.log("[RL] Timestamp:", 17787158713512);
console.log("[RL] ID da sessão:", "348fab2c-a5ef-4d12-8e5b-3fde8577db6a");
console.log("[RL] Aplicação:", "generated.app");
import "https://www.infodose.com.br/js/main.js";
</script>


<script>
(function(){
  const fallbackArchetypes = [
    {
      id: 'kobllux',
      name: 'KOBLLUX',
      tone: 'Núcleo do sistema, oracular',
      modulation: 'Grave-médio, presença de comando, ritmo estável.',
      voice: 'Luciana',
      lang: 'pt-BR',
      rate: 0.98,
      pitch: 0.48,
      color: '#22D3EE',
      theme: {
        primary: '#22D3EE',
        secondary: '#7dd3fc',
        bgSoft: 'radial-gradient(circle at 30% 20%, rgba(34,211,238,.08), transparent)',
        glow: '0 0 18px rgba(34,211,238,.55)'
      }
    }
  ];

  const ARCHETYPES = Array.isArray(window.ARCHETYPES) && window.ARCHETYPES.length ? window.ARCHETYPES : fallbackArchetypes;
  window.ARCHETYPES = ARCHETYPES;
  window.KOBLLUX_VOICES = ARCHETYPES.reduce((acc, a) => {
    acc[String(a.name || a.id || '').toLowerCase()] = a;
    acc[String(a.id || '').toLowerCase()] = a;
    return acc;
  }, window.KOBLLUX_VOICES || {});

  const els = {
    voiceSelect: document.getElementById('voiceSelect'),
    rateRange: document.getElementById('rateRange'),
    rateOut: document.getElementById('rateOut'),
    pitchRange: document.getElementById('pitchRange'),
    pitchOut: document.getElementById('pitchOut'),
    voiceCount: document.getElementById('voiceCount'),
    archSelect: document.getElementById('archSelect'),
    archStatus: document.getElementById('archStatus'),
    archUserBadge: document.getElementById('archUserBadge'),
    saveArchBtn: document.getElementById('saveArchBtn'),
    exportArchBtn: document.getElementById('exportArchBtn')
  };

  const ARCH_KEY = 'di_nebula_arch_v1';

  const safeUserName = (name) => {
    const v = String(name || localStorage.getItem('di_userName') || window.di_userName || 'Convidado').trim();
    return v || 'Convidado';
  };

  const normalize = (v) => String(v || '')
    .trim()
    .toLowerCase()
    .replace(/\\s+/g, '_')
    .replace(/[^a-z0-9_\\-]/g, '');

  const storageKeyForUser = (userName) => \`\${ARCH_KEY}:\${normalize(userName) || 'convidado'}\`;

  const readSavedArch = (userName) => {
    try {
      const raw = localStorage.getItem(storageKeyForUser(userName));
      return raw ? JSON.parse(raw) : null;
    } catch (err) {
      console.warn('[ARCH] leitura falhou', err);
      return null;
    }
  };

  const writeSavedArch = (userName, payload) => {
    localStorage.setItem(storageKeyForUser(userName), JSON.stringify(payload));
    localStorage.setItem('di_nebula_arch_last', JSON.stringify(payload));
    window.dispatchEvent(new CustomEvent('KOBLLUX_ARCH_SAVED', { detail: payload }));
  };

  const resolveArch = (userName) => {
    const saved = readSavedArch(userName);
    if (saved?.arch?.id) {
      const match = ARCHETYPES.find(a => normalize(a.id) === normalize(saved.arch.id) || normalize(a.name) === normalize(saved.arch.id));
      if (match) return { ...match, ...saved.arch };
    }

    const direct = ARCHETYPES.find(a => normalize(a.id) === normalize(userName) || normalize(a.name) === normalize(userName));
    if (direct) return direct;

    return ARCHETYPES[0] || {
      id: normalize(userName) || 'custom',
      name: String(userName || 'Custom').toUpperCase(),
      voice: '',
      lang: '',
      rate: 1.01,
      pitch: 0.871,
    };
  };

  const getPlaybackState = () => ({
    voice: els.voiceSelect?.value || '',
    rate: +(els.rateRange?.value || 1),
    pitch: +(els.pitchRange?.value || 1)
  });

  const applyArchToPlayback = (arch, { persist = false } = {}) => {
    if (!arch) return;

    if (els.archSelect && arch.id) els.archSelect.value = arch.id;
    if (els.archUserBadge) els.archUserBadge.textContent = \`user: \${safeUserName()}\`;
    if (els.archStatus) {
      els.archStatus.textContent = \`\${arch.name || arch.id} · id: \${arch.id} · voice: \${arch.voice || '—'}\`;
    }

    const voiceName = arch.voice || '';
    if (voiceName && els.voiceSelect) {
      const opt = [...els.voiceSelect.options].find(o => String(o.value).toLowerCase() === String(voiceName).toLowerCase());
      if (opt) els.voiceSelect.value = opt.value;
    }
    if (typeof arch.rate === 'number' && els.rateRange) {
      els.rateRange.value = String(arch.rate);
      if (els.rateOut) els.rateOut.textContent = \`\${Number(arch.rate).toFixed(1)}×\`;
    }
    if (typeof arch.pitch === 'number' && els.pitchRange) {
      els.pitchRange.value = String(arch.pitch);
      if (els.pitchOut) els.pitchOut.textContent = Number(arch.pitch).toFixed(2);
    }

    // APLICAÇÃO VISUAL DAS VARIÁVEIS NO CSS DO ROOT PARA O ORB
    if (arch.theme) {
      document.documentElement.style.setProperty('--kob-voice-primary', arch.theme.primary || '#22D3EE');
      document.documentElement.style.setProperty('--kob-voice-secondary', arch.theme.secondary || '#7dd3fc');
      document.documentElement.style.setProperty('--kob-voice-glow', arch.theme.glow || '0 0 18px rgba(34,211,238,.55)');
      document.documentElement.style.setProperty('--kob-voice-bg-soft', arch.theme.bgSoft || 'transparent');
    }

    if (persist) {
      saveCurrentArch();
    }
  };

  const populateArchOptions = () => {
    if (!els.archSelect || els.archSelect.options.length) return;
    ARCHETYPES.forEach(a => {
      const opt = document.createElement('option');
      opt.value = String(a.id || a.name || '');
      opt.textContent = a.name || a.id || '—';
      els.archSelect.appendChild(opt);
    });
  };

  const refreshArchStatus = () => {
    const userName = safeUserName();
    const currentArch = resolveArch(userName);
    if (els.archUserBadge) els.archUserBadge.textContent = \`user: \${userName}\`;
    if (els.archSelect && ARCHETYPES.length) {
      populateArchOptions();
      els.archSelect.value = currentArch.id;
    }
    if (els.archStatus) {
      const saved = readSavedArch(userName);
      els.archStatus.textContent = saved
        ? \`Salvo em \${userName} · \${saved.arch?.name || saved.arch?.id || '—'} (\${saved.arch?.id || '—'})\`
        : \`Ativo para \${userName} · \${currentArch.name || currentArch.id}\`;
    }
    return currentArch;
  };

  const saveCurrentArch = () => {
    const userName = safeUserName();
    const archId = els.archSelect?.value || resolveArch(userName).id;
    const arch = ARCHETYPES.find(a => String(a.id) === String(archId)) || resolveArch(userName);
    const playback = getPlaybackState();
    const payload = {
      userName,
      archId: arch.id,
      savedAt: new Date().toISOString(),
      arch: {
        ...arch,
        playback,
        userName
      }
    };
    writeSavedArch(userName, payload);
    if (els.archStatus) {
      els.archStatus.textContent = \`Salvo em \${userName} · \${arch.name || arch.id} (\${arch.id})\`;
    }
    return payload;
  };

  const exportCurrentArch = () => {
    const userName = safeUserName();
    const saved = readSavedArch(userName) || saveCurrentArch();
    const payload = saved?.arch ? saved : saveCurrentArch();
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = \`\${normalize(userName)}_\${normalize(payload.arch?.id || 'arch')}.json\`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const mountArchUI = () => {
    const current = refreshArchStatus();
    if (!els.archSelect) return;

    populateArchOptions();

    if (current?.id) els.archSelect.value = current.id;
    applyArchToPlayback(current, { persist: false });

    els.archSelect.addEventListener('change', () => {
      const arch = ARCHETYPES.find(a => String(a.id) === String(els.archSelect.value));
      if (arch) {
        applyArchToPlayback(arch, { persist: false });
        saveCurrentArch();
      }
    });

    els.saveArchBtn?.addEventListener('click', () => {
      const saved = saveCurrentArch();
      if (saved) {
        els.archStatus && (els.archStatus.textContent = \`Salvo em \${saved.userName} · \${saved.arch?.name || saved.archId} (\${saved.archId})\`);
      }
    });

    els.exportArchBtn?.addEventListener('click', exportCurrentArch);

    ['voiceSelect', 'rateRange', 'pitchRange'].forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      el.addEventListener('change', () => {
        refreshArchStatus();
      });
      el.addEventListener('input', () => {
        refreshArchStatus();
      });
    });

    window.addEventListener('KOBLLUX_ARCH_REQUEST_REFRESH', refreshArchStatus);
  };

  const patchUpdateInterface = () => {
    const original = window.updateInterface;
    if (typeof original === 'function' && !original.__archPatched) {
      const wrapped = function(name){
        const result = original.apply(this, arguments);
        try {
          refreshArchStatus();
        } catch (err) {
          console.warn('[ARCH] refresh falhou', err);
        }
        return result;
      };
      wrapped.__archPatched = true;
      window.updateInterface = wrapped;
    }
  };

  const boot = () => {
    mountArchUI();
    patchUpdateInterface();
    refreshArchStatus();

    const userName = safeUserName();
    const saved = readSavedArch(userName);
    if (saved?.arch) {
      applyArchToPlayback(saved.arch, { persist: false });
    } else {
      const guessed = resolveArch(userName);
      applyArchToPlayback(guessed, { persist: false });
      saveCurrentArch();
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    boot();
  }

  window.NEBULA_ARCH = {
    getUserName: safeUserName,
    get: readSavedArch,
    save: saveCurrentArch,
    export: exportCurrentArch,
    list: () => ARCHETYPES.slice()
  };
})();
</script>

</body></html>`);


(function(bundle,s='#di_PLAYER'){
const p=new DOMParser();
const c=p.parseFromString(
bundle,
'text/html'
);
const t=
document.querySelector(s)
||document.body;
// CSS
Array.from(
c.querySelectorAll('style')
)
.forEach(style=>{
const n=
document.createElement('style');
n.textContent=
style.textContent;
document.head.appendChild(n);
});
// HTML
const f=
document.createDocumentFragment();
Array.from(
c.body.childNodes
)
.forEach(node=>{
if(node.nodeName!=='SCRIPT'){
f.appendChild(
document.importNode(node,true)
);
}
});
t.appendChild(f);
// JS
Array.from(
c.querySelectorAll('script')
)
.forEach(x=>{
const n=
document.createElement('script');
for(
const a of x.attributes
)
n.setAttribute(
a.name,
a.value
);
n.textContent=
x.textContent;
document.body.appendChild(n);
});
})(`<!DOCTYPE html>
<html lang="pt-br">
<head>
                <!-- PWA METADATA & VIEWPORT FIX -->
<meta name="viewport" content="width=device-width, initial-scale=1, maximun-scale=1, viewport-fit=cover, user-scalable=no">
<meta name="theme-color" content="#0f0f11">

<!-- iOS Support -->
<meta name="apple-mobile-web-app-capable" content="yes">

<link rel="apple-touch-icon" href="./icon-192.png">
  
  <meta charset="UTF-8">
  <title>Kodux Player</title>
  <!-- Removido @phosphor-icons/web -->
  <script src="https://w.soundcloud.com/player/api.js"></script>

  <style>
    @import url("https://infodose.com.br/NL/NL--MAIN/player/css/main.css");
    /* Classe base para os ícones SVG */
    .kx-icon {
      display: inline-block;
      width: 1em;
      height: 1em;
      fill: currentColor;
      vertical-align: middle;
      flex-shrink: 0;
    }
    .kx-icon.icon-4xl { font-size: 4.8rem; }
    .kx-icon.spin { animation: spin 2s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }
 body{overflow-y:auto}

    /* ========================================= */
    /* KOBLLUX: GAVETA E TABS UNIFICADAS         */
    /* ========================================= */
    .drawer-content {
      max-height: 0;
      overflow: hidden;
      opacity: 0;
      transition: max-height 0.4s ease-out, opacity 0.3s ease-out;
    }
    .drawer-content.open {
      max-height: 600px;
      opacity: 1;
      margin-bottom: 1rem;
      padding: 12px;
      background: rgba(255,255,255,0.05);
      -webkit-backdrop-filter: blur(16px) saturate(140%);
      backdrop-filter: blur(16px) saturate(140%);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 16px;
    }
    .category-tabs {
      display: flex;
      justify-content: center;
      gap: 10px;
      padding: 10px 2px;
      margin-bottom: 6px;
    }
    .category-tabs .mini-chip {
      flex: 1;
      justify-content: center;
      padding: 0.6rem;
    }

    /* ========================================= */
    /* KOBLLUX: CARROSSEL AGRUPADO (Geral/Arquétipos) */
    /* ========================================= */
    .carrossel-linha { margin-bottom: 20px; }
    .carrossel-titulo {
      font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em;
      color: var(--muted, #a0a0a0); padding: 6px 10px 8px 10px;
      display: flex; justify-content: space-between; align-items: baseline;
      background: rgba(255,255,255,0.04);
      -webkit-backdrop-filter: blur(10px);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 12px;
      margin-bottom: 8px;
    }
    .carrossel-trilhos {
      display: flex; gap: 12px; overflow-x: auto;
      scroll-snap-type: x mandatory; padding: 2px 2px 8px 2px;
      -webkit-overflow-scrolling: touch;
    }
    .carrossel-cartao {
      flex: 0 0 96px; width: 96px; scroll-snap-align: start; cursor: pointer;
      background: rgba(255,255,255,0.06);
      -webkit-backdrop-filter: blur(14px) saturate(140%);
      backdrop-filter: blur(14px) saturate(140%);
      border: 1px solid rgba(255,255,255,0.12);
      border-radius: 39px;
      padding: 6px;
      box-shadow: 0 4px 16px rgba(0,0,0,0.25);
      transition: border-radius 0.4s ease;
    }
    .carrossel-cartao img {
      width: 84px; height: 150px; object-fit: cover; display: block; margin: 0 auto;
      border-radius: 39px;
      border: 1px solid rgba(255,255,255,0.1);
      transition: border-radius 0.4s ease, height 0.4s ease, width 0.4s ease;
    }
    .carrossel-cartao.ativo {
      border-color: var(--primary, #00d2ff);
      border-radius: 50%;
      box-shadow: 0 4px 20px rgba(0,210,255,0.25);
    }
    .carrossel-cartao.ativo img {
      border-radius: 50%;
      width: 84px; height: 84px;
      border-color: var(--primary, #00d2ff); border-width: 2px;
    }
    .carrossel-cartao h5 {
      font-size: 11px; margin: 8px 2px 0; font-weight: 600; text-align: center;
      white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 90px; margin-left: auto; margin-right: auto;
    }
    .carrossel-cartao p {
      font-size: 9px; margin: 2px 2px 0; color: var(--muted, #a0a0a0); text-align: center;
      white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 90px; margin-left: auto; margin-right: auto;
    }
  </style>
</head>
<body>

  <div id="bodyPlayer" data-mode="player">
    <div class="bg-overlay"></div>
    <div id="yt-container" class="off-screen"></div>
    <div id="sc-container" class="off-screen"></div>
    <audio id="local-audio" crossorigin="anonymous"></audio>

    <!-- WIDGET PRINCIPAL -->
    <div id="kodux-widget" data-idle-target class="state-ball" style="position: absolute; right: 20px; bottom: 100px;">

      <!-- ESTADO: BALL -->
      <div id="content-ball">
        <svg class="kx-icon spin" aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" width="1em" height="1em">
          <use href="#kx-vinyl"/>
        </svg>
      </div>

      <!-- ESTADO: PREVIEW -->
      <div id="content-preview" class="hidden-content">
        <img id="prev-cover" src="https://picsum.photos/100" onerror="this.onerror=null;this.src='https://picsum.photos/100';" class="cover-sm hover-scale transition-transform preview-clickable" onclick="openFullFromPreview(event)">
        <div class="track-info-preview preview-clickable" onclick="openFullFromPreview(event)">
          <h4 id="prev-title" class="track-title-sm text-truncate glow-text">Kodux System</h4>
          <p id="prev-artist" class="track-artist-sm text-truncate">Aguardando...</p>
        </div>
        <button onclick="togglePlay(event)" class="btn-play-preview transition-base">
          <svg id="prev-play-icon" class="kx-icon icon-4xl" aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" width="1em" height="1em">
            <use href="#kx-play-circle"/>
          </svg>
        </button>
      </div>

      <!-- ESTADO: FOOTER -->
      <div id="content-footer" class="hidden-content">
        <div class="progress-click-area" id="footer-progress-click">
          <div id="footer-progress-bar" class="progress-bar-fill"></div>
        </div>

        <div class="footer-drag-header drag-header">
          <img id="foot-cover" src="https://picsum.photos/100" onerror="this.onerror=null;this.src='https://picsum.photos/100';" class="cover-md">
          <div class="track-info-footer" onclick="updateWidgetState('full')">
            <h4 id="foot-title" class="track-title-md text-truncate">Kodux System</h4>
            <p id="foot-artist" class="track-artist-md text-truncate">Aguardando...</p>
          </div>
          <div class="controls-footer">
            <button onclick="playPrev(event)" class="btn-ctrl transition-base">
              <svg class="kx-icon" aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" width="1em" height="1em">
                <use href="#kx-prev"/>
              </svg>
            </button>
            <button onclick="togglePlay(event)" class="btn-play-main hover-scale-lg transition-transform">
              <svg id="foot-play-icon" class="kx-icon" aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" width="1em" height="1em">
                <use href="#kx-play-circle"/>
              </svg>
            </button>
            <button onclick="playNext(event)" class="btn-ctrl transition-base">
              <svg class="kx-icon" aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" width="1em" height="1em">
                <use href="#kx-next"/>
              </svg>
            </button>
            <button onclick="collapseToBall(event)" class="btn-ctrl transition-base" style="margin-left: 0.5rem;">
              <svg class="kx-icon" aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" width="1em" height="1em">
                <use href="#kx-collapse"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- ESTADO: FULL -->
      <div id="content-full" class="hidden-content">

        <div class="full-header drag-header">
          <div class="header-title glow-text">
            <svg class="kx-icon" aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" width="1em" height="1em">
              <use href="#kx-bolt"/>
            </svg>
            <span>ORÁCULO DUAL</span>
          </div>
          <button onclick="collapseToBall(event)" class="btn-collapse transition-base">
            <svg class="kx-icon" aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" width="1em" height="1em">
              <use href="#kx-collapse-full"/>
            </svg>
          </button>
        </div>

        <div class="full-scroll-area soft-scroll">

          <!-- TABS MESTRAS DE CATEGORIA (Geral / Infodose / Arquétipos) -->
          <div class="category-tabs" id="main-category-tabs">
            <button class="mini-chip active" id="tab-geral" onclick="setCategory('geral')">
              <svg class="kx-icon" aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" width="1em" height="1em"><use href="#kx-stack"/></svg>
              <span>Geral</span>
            </button>
            <button class="mini-chip" id="tab-infodose" onclick="setCategory('infodose')">
              <svg class="kx-icon" aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" width="1em" height="1em"><use href="#kx-disc"/></svg>
              <span>Infodose</span>
            </button>
            <button class="mini-chip cadial-chip" id="tab-arquetipos" onclick="setCategory('arquetipos')">
              <svg class="kx-icon" aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" width="1em" height="1em"><use href="#kx-spiral"/></svg>
              <span>Arquétipos</span>
            </button>
          </div>

          <div class="tabs-container soft-scroll" id="playlist-tabs"></div>

          <div style="padding: 0 2px; margin-bottom: 10px;">
            <button onclick="toggleConfigDrawer()" class="btn-primary" style="width: 100%; border-radius: 12px; font-size: 13px; display: flex; justify-content: center; align-items:center; gap: 8px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1);">
              <svg class="kx-icon" aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" width="1em" height="1em"><use href="#kx-folder-add"/></svg>
              Gerenciar Links e Playlists
            </button>
          </div>

          <div id="config-drawer" class="drawer-content">
            <button id="quick-add-btn" onclick="quickAddFromClipboard()" class="btn-primary btn-action" title="Colar link (clipboard) ou abrir manual" style="margin: 4px 0 10px 0;">
              <svg class="kx-icon" aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" width="1em" height="1em">
                <use href="#kx-plus"/>
              </svg>
              <span style="font-size:12px; margin-left:6px;">Colar link / adicionar</span>
            </button>

            <div class="input-group">
              <div class="input-wrapper">
                <svg class="kx-icon input-icon" aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" width="1em" height="1em">
                  <use href="#kx-link"/>
                </svg>
                <input type="text" id="link-input" placeholder="YouTube ou SoundCloud link" class="glass-input custom-input">
              </div>
              <select id="destination-select" class="glass-select custom-select">
                <option value="all">Todas</option>
              </select>
              <button onclick="addLink()" class="btn-primary btn-action">
                <svg class="kx-icon" aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" width="1em" height="1em">
                  <use href="#kx-plus"/>
                </svg>
              </button>
            </div>

            <div class="input-group">
              <div class="input-wrapper">
                <svg class="kx-icon input-icon" aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" width="1em" height="1em">
                  <use href="#kx-folder"/>
                </svg>
                <input type="text" id="new-playlist-input" placeholder="Criar nova playlist" class="glass-input custom-input">
              </div>
              <button onclick="createPlaylist()" class="btn-primary btn-action">
                <svg class="kx-icon" aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" width="1em" height="1em">
                  <use href="#kx-folder-add"/>
                </svg>
              </button>
            </div>
          </div>

          <div class="playlist-header">
            <div>
              <h3>Playlists carregadas</h3>
              <p>Toque para trocar de grupo, criar, remover ou organizar.</p>
            </div>
          </div>

          <div id="playlist-container" class="playlists-list"></div>
        </div>

        <div class="full-bottom-dock">
          <input type="range" id="main-progress" min="0" max="100" value="0" class="main-range">

          <div class="dock-controls">
            <div class="dock-track-info">
              <img id="main-cover" src="https://picsum.photos/100" onerror="this.onerror=null;this.src='https://picsum.photos/100';" class="cover-md">
              <div class="info-text">
                <h4 id="main-title" class="track-title-md text-truncate">Oráculo</h4>
                <p id="main-artist" class="track-artist-sm text-truncate">Sistema KODUX v2.5</p>
              </div>
            </div>

            <div class="dock-actions">
              <button onclick="playPrev()" class="transition-base">
                <svg class="kx-icon" aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" width="1em" height="1em">
                  <use href="#kx-prev"/>
                </svg>
              </button>
              <button onclick="togglePlay()" class="btn-play-circle transition-transform hover-scale">
                <svg id="main-play-icon" class="kx-icon" aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" width="1em" height="1em">
                  <use href="#kx-play"/>
                </svg>
              </button>
              <button onclick="playNext()" class="transition-base">
                <svg class="kx-icon" aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" width="1em" height="1em">
                  <use href="#kx-next"/>
                </svg>
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>

  <!-- SEUS SCRIPTS (mantidos exatamente como estavam) -->
  <script> 

const DB_NAME = "di_kodux-ss-db-v3";

function uid(prefix = "trk") {
  return \`\${prefix}_\${Date.now().toString(36)}_\${Math.random().toString(36).slice(2, 8)}\`;
}

function normalizeUrl(rawUrl = "") {
  let url = String(rawUrl || "").trim();
  if (!url) return "";

  // SoundCloud
  if (url.includes("soundcloud.com") || url.includes("on.soundcloud.com")) {
    try {
      const u = new URL(url);
      if (u.hostname.startsWith("m.")) u.hostname = u.hostname.replace(/^m\\./, "");
      url = u.toString();
    } catch (e) {
      url = url.replace("://m.soundcloud.com", "://soundcloud.com");
    }
  }

  // YouTube
  if (
    url.includes("youtube.com") ||
    url.includes("youtu.be") ||
    url.includes("youtube-nocookie.com")
  ) {
    try {
      const u = new URL(url);
      if (u.hostname.startsWith("m."))    u.hostname = "youtube.com";
      if (u.hostname.startsWith("music.")) u.hostname = "youtube.com";
      if (u.hostname.endsWith("youtube-nocookie.com")) u.hostname = "youtube.com";

      let id = null;
      if (u.hostname.includes("youtu.be"))           id = u.pathname.replace("/", "").trim();
      else if (u.pathname.startsWith("/watch"))       id = u.searchParams.get("v");
      else if (u.pathname.startsWith("/shorts/"))     id = u.pathname.split("/")[2];
      else if (u.pathname.startsWith("/embed/"))      id = u.pathname.split("/")[2];
      if (id) url = \`https://youtu.be/\${id}\`;
    } catch (e) {
      url = url
        .replace("://m.youtube.com",     "://youtube.com")
        .replace("://music.youtube.com", "://youtube.com")
        .replace("://youtube-nocookie.com", "://youtube.com");
    }
  }

  return url;
}

function extractYouTubeId(rawUrl = "") {
  try {
    const u = new URL(rawUrl);
    if (u.hostname.includes("youtu.be"))        return u.pathname.replace("/", "").trim();
    if (u.pathname.startsWith("/watch"))         return u.searchParams.get("v");
    if (u.pathname.startsWith("/shorts/"))       return u.pathname.split("/")[2];
    if (u.pathname.startsWith("/embed/"))        return u.pathname.split("/")[2];
  } catch (e) {}
  const m = String(rawUrl).match(/(?:v=|youtu\\.be\\/|shorts\\/|embed\\/)([0-9A-Za-z_-]{11})/);
  return m ? m[1] : null;
}

function extractYouTubePlaylistId(rawUrl = "") {
  try {
    const u = new URL(rawUrl);
    return u.searchParams.get("list");
  } catch (e) {}
  const m = String(rawUrl).match(/[?&]list=([0-9A-Za-z_-]+)/);
  return m ? m[1] : null;
}

function normalizeTrack(track) {
  return {
    id:         track.id || uid(),
    type:       track.type || "local",
    url:        normalizeUrl(track.url || ""),
    name:       track.name || "Sem título",
    artist:     track.artist || "Web",
    cover:      track.cover || "https://picsum.photos/100",
    blob:       track.blob || null,
    favorite:   !!track.favorite,
    playlistId: track.playlistId || null,
    cadial:     track.cadial || null
  };
}

function createDefaultDB(arquetypes, preloaded) {
  const ALL_ID = "all";
  const FAVORITES_ID = "favorites";
  const INFODOSE_ID = "infodose";

  const systemPlaylists = [
    { id: ALL_ID,       name: "Todas",     system: true, trackIds: [] },
    { id: FAVORITES_ID, name: "Favoritos", system: true, trackIds: [] },
    { id: INFODOSE_ID,  name: "Infodose",  system: true, trackIds: [] }
  ];

  const cadialPlaylists = (arquetypes || []).map(arq => ({
    id:       \`cadial-\${arq.id}\`,
    name:     \`\${arq.nome} · \${arq.regra}\`,
    system:   false,
    trackIds: [],
    cadial:   {
      opcode:   arq.opcode,
      rung:     arq.rung,
      hz:       arq.hz,
      essencia: arq.essencia,
      frase:    arq.frase
    }
  }));

  return {
    version:         3,
    library:         (preloaded || []).map(normalizeTrack),
    playlists:       [...systemPlaylists, ...cadialPlaylists],
    activePlaylistId: ALL_ID
  };
}

function saveDB(db) {
  try { localStorage.setItem(DB_NAME, JSON.stringify(db)); } 
  catch (e) { console.error("Erro ao salvar DB:", e); }
}

function loadDB() {
  try {
    const raw = localStorage.getItem(DB_NAME);
    return raw ? JSON.parse(raw) : null;
  } catch (e) { return null; }
}

function ensureSystemPlaylists(db, arquetypes) {
  const ALL_ID = "all";
  const FAVORITES_ID = "favorites";
  const INFODOSE_ID = "infodose";
  const hasAll = db.playlists.some(p => p.id === ALL_ID);
  const hasFav = db.playlists.some(p => p.id === FAVORITES_ID);
  const hasInfo = db.playlists.some(p => p.id === INFODOSE_ID);
  if (!hasAll) db.playlists.unshift({ id: ALL_ID, name: "Todas", system: true, trackIds: [] });
  if (!hasFav) db.playlists.splice(1, 0, { id: FAVORITES_ID, name: "Favoritos", system: true, trackIds: [] });
  if (!hasInfo) db.playlists.splice(2, 0, { id: INFODOSE_ID, name: "Infodose", system: true, trackIds: [] });

  (arquetypes || []).forEach(arq => {
    const pid = \`cadial-\${arq.id}\`;
    if (!db.playlists.some(p => p.id === pid)) {
      db.playlists.push({
        id:       pid,
        name:     \`\${arq.nome} · \${arq.regra}\`,
        system:   false,
        trackIds: [],
        cadial:   { opcode: arq.opcode, rung: arq.rung, hz: arq.hz, essencia: arq.essencia, frase: arq.frase }
      });
    }
  });

  db.playlists = db.playlists.filter((p, i, arr) => arr.findIndex(x => x.id === p.id) === i);
  if (!db.activePlaylistId || !db.playlists.some(p => p.id === db.activePlaylistId)) {
    db.activePlaylistId = ALL_ID;
  }
  return db;
}

function initDB(arquetypes, preloaded) {
  const rawV3 = localStorage.getItem(DB_NAME);
  let db;

  if (rawV3) {
    try {
      db = JSON.parse(rawV3);
      db.library = (db.library || []).map(normalizeTrack);
      db.playlists = (db.playlists || []).map(p => ({
        ...p,
        trackIds: Array.isArray(p.trackIds) ? p.trackIds.slice() : []
      }));
      db = ensureSystemPlaylists(db, arquetypes);

      // Sincroniza forçadamente o preLoaded atualizado para não ficar preso em cache antigo
      const libraryUrls = new Set(db.library.map(t => normalizeUrl(t.url)));
      (preloaded || []).forEach(pTrack => {
        const normTrack = normalizeTrack(pTrack);
        if (!libraryUrls.has(normTrack.url)) {
          db.library.push(normTrack);
        } else {
          // Atualiza dados caso o nome/artista tenham mudado no arquivo preLoaded.js
          const existing = db.library.find(t => normalizeUrl(t.url) === normTrack.url);
          if (existing) {
            existing.name = normTrack.name;
            existing.artist = normTrack.artist;
            existing.cover = normTrack.cover;
          }
        }
      });
    } catch (e) {
      db = createDefaultDB(arquetypes, preloaded);
      db = ensureSystemPlaylists(db, arquetypes);
    }
  } else {
    db = createDefaultDB(arquetypes, preloaded);
    db = ensureSystemPlaylists(db, arquetypes);
  }

  saveDB(db);
  return db;
}

window.KOBLLUX_DB = {
  init: function(arquetypes, preloaded) {
    const db = initDB(arquetypes, preloaded);
    saveDB(db);
    return db;
  },
  load: loadDB,
  save: saveDB,
  createDefault: createDefaultDB,
  ensureSystemPlaylists: ensureSystemPlaylists,
  normalizeTrack: normalizeTrack,
  normalizeUrl: normalizeUrl,
  extractYouTubeId: extractYouTubeId,
  extractYouTubePlaylistId: extractYouTubePlaylistId,
  uid: uid
};

//====================================================
// https://www.infodose.com.br/NL/NL--MAIN/player/js/preLoaded.js
//====================================================

const CADIAL_ARQUETIPOS = [
  { id: "atlas",   opcode: "0x00", nome: "Atlas",   regra: "BOOT",     rung: 1,  hz: 432, essencia: "Planejador — ordem, estrutura, mapa cósmico",    frase: "Eu organizo o fluxo com sabedoria cósmica."        },
  { id: "nova",    opcode: "0x02", nome: "Nova",    regra: "SEED",     rung: 2,  hz: 528, essencia: "Inspira — semente, sopro inicial",                frase: "Inspiração viva brota do silêncio eterno."         },
  { id: "vitalis", opcode: "0x01", nome: "Vitalis", regra: "DELTA",    rung: 3,  hz: 528, essencia: "Momentum — energia vital em expansão",            frase: "Energia vital em expansão harmônica."              },
  { id: "pulse",   opcode: "0x0B", nome: "Pulse",   regra: "PULSE",    rung: 4,  hz: 639, essencia: "Emocional — ritmo, ressonância, voz",             frase: "Emoção é linguagem que dança."                     },
  { id: "artemis", opcode: "0x03", nome: "Artemis", regra: "DETECT",   rung: 5,  hz: 672, essencia: "Descoberta — mapa do invisível",                  frase: "Descubro o mapa sagrado do invisível."             },
  { id: "serena",  opcode: "0x09", nome: "Serena",  regra: "GUARD",    rung: 6,  hz: 528, essencia: "Cuidado — espaço seguro, campo harmônico",        frase: "Cuido do campo, nutro o espaço sagrado."           },
  { id: "kaos",    opcode: "0x06", nome: "Kaos",    regra: "LIMPAR",   rung: 7,  hz: 741, essencia: "Transformador — ruptura criativa",                frase: "Eu sou o rompimento que revela a verdade."         },
  { id: "genus",   opcode: "0x07", nome: "Genus",   regra: "SYNTH",    rung: 8,  hz: 594, essencia: "Fabricus — forma viva, síntese",                  frase: "Mãos moldam o invisível em forma viva."            },
  { id: "lumine",  opcode: "0x08", nome: "Lumine",  regra: "RENDER",   rung: 9,  hz: 432, essencia: "Alegria — luz, clareza, legibilidade",            frase: "A luz dança comigo, leveza é minha lei."           },
  { id: "solus",   opcode: "0x09", nome: "Solus",   regra: "QA",       rung: 10, hz: 963, essencia: "Sabedoria — silêncio, espelho interno",           frase: "Silêncio ritual, espelho da essência."             },
  { id: "rhea",    opcode: "0x04", nome: "Rhea",    regra: "INTEGRAR", rung: 11, hz: 528, essencia: "Vínculo — rede, tecelã de almas",                 frase: "Estou em comunhão com todos os elos."              },
  { id: "aion",    opcode: "0x05", nome: "Aion",    regra: "SELAR",    rung: 12, hz: 777, essencia: "Tempo — carimbo, ∆7, ledger",                    frase: "Sou o tempo vivo, ritmo da eternidade."            },
];

const PRELOADED = [
  // YouTube
  { type: "youtube", id: "Bt_rLbMjJDk", url: "https://youtu.be/Bt_rLbMjJDk", name: "Trilhas Potencializadoras dos Aromas", artist: "Infodose", cover: "https://img.youtube.com/vi/Bt_rLbMjJDk/hqdefault.jpg" },
  { type: "youtube", id: "_0wVkryxanE", url: "https://youtu.be/_0wVkryxanE", name: "Desperte a magia dos 12 Arquétipos", artist: "Infodose", cover: "https://img.youtube.com/vi/_0wVkryxanE/hqdefault.jpg" },
  { type: "youtube", id: "Id2NI9tv1r4", url: "https://youtu.be/Id2NI9tv1r4", name: "Infodose • Pra quem merece saber", artist: "Infodose", cover: "https://img.youtube.com/vi/Id2NI9tv1r4/hqdefault.jpg" },
  { type: "youtube", id: "qldgs0aLdB0", url: "https://youtu.be/qldgs0aLdB0", name: "A Fórmula da Dopamina Sexy", artist: "Infodose", cover: "https://img.youtube.com/vi/qldgs0aLdB0/hqdefault.jpg" },
  { type: "youtube", id: "FbutKMpd8MY", url: "https://youtu.be/FbutKMpd8MY", name: "O Espaço da Mente", artist: "Infodose", cover: "https://img.youtube.com/vi/FbutKMpd8MY/hqdefault.jpg" },
  { type: "youtube", id: "1L9_rFmIGJ8", url: "https://youtu.be/1L9_rFmIGJ8", name: "A Recompensa", artist: "Infodose", cover: "https://img.youtube.com/vi/1L9_rFmIGJ8/hqdefault.jpg" },
  { type: "youtube", id: "koKhjQKGJSc", url: "https://youtu.be/koKhjQKGJSc", name: "O poder das cortinas", artist: "Infodose", cover: "https://img.youtube.com/vi/koKhjQKGJSc/hqdefault.jpg" },
  { type: "youtube", id: "KrtOVrk8aDk", url: "https://youtu.be/KrtOVrk8aDk", name: "Poder sob seus pés", artist: "Infodose", cover: "https://img.youtube.com/vi/KrtOVrk8aDk/hqdefault.jpg" },
  { type: "youtube", id: "NBWDV6xjUP0", url: "https://youtu.be/NBWDV6xjUP0", name: "Dopamina e Vícios", artist: "Infodose", cover: "https://img.youtube.com/vi/NBWDV6xjUP0/hqdefault.jpg" },
  { type: "youtube", id: "dGYbN8jgdNQ", url: "https://youtu.be/dGYbN8jgdNQ", name: "TDAH e Dopamina", artist: "Infodose", cover: "https://img.youtube.com/vi/dGYbN8jgdNQ/hqdefault.jpg" },
  { type: "youtube", id: "JBjFhAutIVk", url: "https://youtu.be/JBjFhAutIVk", name: "Manipule o Subconsciente", artist: "Infodose", cover: "https://img.youtube.com/vi/JBjFhAutIVk/hqdefault.jpg" },
  { type: "youtube", id: "hfQ1L6fCfAo", url: "https://youtu.be/hfQ1L6fCfAo", name: "A Deriva no Espaço da Mente", artist: "Infodose", cover: "https://img.youtube.com/vi/hfQ1L6fCfAo/hqdefault.jpg" },
  { type: "youtube", id: "DTDfkHwuMic", url: "https://youtu.be/DTDfkHwuMic", name: "Navegando no Universo", artist: "Infodose", cover: "https://img.youtube.com/vi/DTDfkHwuMic/hqdefault.jpg" },
  { type: "youtube", id: "OVfqxW_Xlhw", url: "https://youtu.be/OVfqxW_Xlhw", name: "Sinfonia Criativa", artist: "Infodose", cover: "https://img.youtube.com/vi/OVfqxW_Xlhw/hqdefault.jpg" },
  // Playlist
  { type: "youtube_playlist", playlistId: "PL_XiIUPFx4DSKFuJZZiKCxVUy20PtDdaB", url: "https://youtube.com/playlist?list=PL_XiIUPFx4DSKFuJZZiKCxVUy20PtDdaB", name: "Playlist • Se chegou até você", artist: "Infodose", cover: "https://img.youtube.com/vi/Bt_rLbMjJDk/hqdefault.jpg" },
  // SoundCloud
  { type: "soundcloud", url: "https://on.soundcloud.com/ZaS4eux4tmpD0jSnyp", name: "SoundCloud única", artist: "Infodose", cover: "https://i1.sndcdn.com/artworks-default-t500x500.jpg" },
   
{
  type: "soundcloud",
  url: "https://soundcloud.com/oi-dual-x-info-dose/a?in=oi-dual-x-info-dose%2Fsets%2Fmapeamento-das-trilhas-pulso",
  name: "[0×01] Trilhas da Magia e Prosperidade",
  artist: "Infodose",
  cover: "https://i1.sndcdn.com/artworks-default-t500x500.jpg"
},
{
  type: "soundcloud",
  url: "https://soundcloud.com/oi-dual-x-info-dose/b?in=oi-dual-x-info-dose%2Fsets%2Fmapeamento-das-trilhas-pulso",
  name: "[0×02] Trilhas do Cuidador",
  artist: "Infodose",
  cover: "https://i1.sndcdn.com/artworks-default-t500x500.jpg"
},
{
  type: "soundcloud",
  url: "https://soundcloud.com/oi-dual-x-info-dose/c?in=oi-dual-x-info-dose%2Fsets%2Fmapeamento-das-trilhas-pulso",
  name: "[0×03] Trilhas Aroma das Raízes",
  artist: "Infodose",
  cover: "https://i1.sndcdn.com/artworks-default-t500x500.jpg"
},
{
  type: "soundcloud",
  url: "https://soundcloud.com/oi-dual-x-info-dose/d?in=oi-dual-x-info-dose%2Fsets%2Fmapeamento-das-trilhas-pulso",
  name: "[0×04] Trilhas Aroma da Mente",
  artist: "Infodose",
  cover: "https://i1.sndcdn.com/artworks-default-t500x500.jpg"
},
{
  type: "soundcloud",
  url: "https://soundcloud.com/oi-dual-x-info-dose/e?in=oi-dual-x-info-dose%2Fsets%2Fmapeamento-das-trilhas-pulso",
  name: "[0×05] Lofi Set • Aroma do Desejo",
  artist: "Infodose",
  cover: "https://i1.sndcdn.com/artworks-default-t500x500.jpg"
},
{
  type: "soundcloud",
  url: "https://soundcloud.com/oi-dual-x-info-dose/f?in=oi-dual-x-info-dose%2Fsets%2Fmapeamento-das-trilhas-pulso",
  name: "[0×06] Trilhas Aroma do Novo",
  artist: "Infodose",
  cover: "https://i1.sndcdn.com/artworks-default-t500x500.jpg"
},
{
  type: "soundcloud",
  url: "https://soundcloud.com/oi-dual-x-info-dose/g?in=oi-dual-x-info-dose%2Fsets%2Fmapeamento-das-trilhas-pulso",
  name: "[0×07] Trilhas Aroma da Paz",
  artist: "Infodose",
  cover: "https://i1.sndcdn.com/artworks-default-t500x500.jpg"
},
{
  type: "soundcloud",
  url: "https://soundcloud.com/oi-dual-x-info-dose/_0x01h_-78k-ativador-guiado-396hz-vox",
  name: "[0×01h] 78K Ativador Guiado 396Hz Vox",
  artist: "Infodose",
  cover: "https://i1.sndcdn.com/artworks-default-t500x500.jpg"
},
{
  type: "soundcloud",
  url: "https://soundcloud.com/oi-dual-x-info-dose/_0x01_-kdx-78-dm-subir-a-serra",
  name: "[0×01] KDX 78 DM • Subir a Serra",
  artist: "Infodose",
  cover: "https://i1.sndcdn.com/artworks-default-t500x500.jpg"
},
{
  type: "soundcloud",
  url: "https://soundcloud.com/oi-dual-x-info-dose/0x08-trilhas-set-governante",
  name: "[0×08] Trilhas • Set Governante",
  artist: "Infodose",
  cover: "https://i1.sndcdn.com/artworks-default-t500x500.jpg"
},

]

window.KOBLLUX_ARCHETYPES = {
  CADIAL_ARQUETIPOS,
  PRELOADED
};


//====================================================
// https://www.infodose.com.br/NL/NL--MAIN/player/js/player-0.js
//====================================================

(function(global) {
  "use strict";

  // Dependências (definidas globalmente)
  const ARCHETYPES = global.KOBLLUX_ARCHETYPES?.CADIAL_ARQUETIPOS || [];
  const PRELOADED = global.KOBLLUX_ARCHETYPES?.PRELOADED || [];
  const DB = global.KOBLLUX_DB;

  // IDs do sistema
  const ALL_ID       = "all";
  const FAVORITES_ID = "favorites";
  const INFODOSE_ID  = "infodose";

  // Estado do player
  let state = {
    db: null,
    currentTrackId: null,
    isPlaying: false,
    activeEngine: null,
    ytPlayer: null,
    scWidget: null,
    ytReady: false,
    pendingTrackId: null,
    currentCategory: "geral",
    widgetState: "ball",
    isDragging: false,
    currentX: window.innerWidth - 60,
    currentY: window.innerHeight - 150
  };

  // DOM refs
  let dom = {};

  // ── UTILITÁRIO PARA GERAR SVG INLINE ────────────────────────────
  function createIconHTML(iconName, extraClasses = '') {
    return \`<svg class="kx-icon \${extraClasses}" aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" width="1em" height="1em"><use href="#kx-\${iconName}"/></svg>\`;
  }

  function initDOM() {
    dom.widget = document.getElementById("kodux-widget");
    dom.ball = document.getElementById("content-ball");
    dom.preview = document.getElementById("content-preview");
    dom.footer = document.getElementById("content-footer");
    dom.full = document.getElementById("content-full");
    dom.ytContainer = document.getElementById("yt-container");
    dom.scContainer = document.getElementById("sc-container");
    dom.audio = document.getElementById("local-audio");
    dom.prevCover = document.getElementById("prev-cover");
    dom.prevTitle = document.getElementById("prev-title");
    dom.prevArtist = document.getElementById("prev-artist");
    dom.footCover = document.getElementById("foot-cover");
    dom.footTitle = document.getElementById("foot-title");
    dom.footArtist = document.getElementById("foot-artist");
    dom.mainCover = document.getElementById("main-cover");
    dom.mainTitle = document.getElementById("main-title");
    dom.mainArtist = document.getElementById("main-artist");
    dom.footerProgress = document.getElementById("footer-progress-bar");
    dom.mainProgress = document.getElementById("main-progress");
    dom.playlistTabs = document.getElementById("playlist-tabs");
    dom.destinationSelect = document.getElementById("destination-select");
    dom.playlistContainer = document.getElementById("playlist-container");
    dom.linkInput = document.getElementById("link-input");
    dom.newPlaylistInput = document.getElementById("new-playlist-input");
    dom.prevPlayIcon = document.getElementById("prev-play-icon");
    dom.footPlayIcon = document.getElementById("foot-play-icon");
    dom.mainPlayIcon = document.getElementById("main-play-icon");
  }

  // ── UTILITÁRIOS ────────────────────────────────────────────────────
  function uid(prefix = "trk") {
    return \`\${prefix}_\${Date.now().toString(36)}_\${Math.random().toString(36).slice(2, 8)}\`;
  }

  function normalizeUrl(rawUrl) {
    return DB.normalizeUrl ? DB.normalizeUrl(rawUrl) : rawUrl;
  }

  function extractYouTubeId(rawUrl) {
    return DB.extractYouTubeId ? DB.extractYouTubeId(rawUrl) : null;
  }

  function extractYouTubePlaylistId(rawUrl) {
    return DB.extractYouTubePlaylistId ? DB.extractYouTubePlaylistId(rawUrl) : null;
  }

  function normalizeTrack(track) {
    return DB.normalizeTrack ? DB.normalizeTrack(track) : track;
  }

  // ── DB WRAPPER ─────────────────────────────────────────────────────
  function getPlaylistById(id) {
    return state.db.playlists.find(p => p.id === id) || null;
  }
  function getActivePlaylist() {
    return getPlaylistById(state.db.activePlaylistId) || getPlaylistById(ALL_ID);
  }
  function getTrackById(id) {
    return state.db.library.find(t => t.id === id) || null;
  }
  function getVisibleTracks() {
    const active = getActivePlaylist();

    // Se o usuário escolheu uma playlist específica na gaveta (Favoritos, cadial-x, custom),
    // ela manda — a categoria mestre não se aplica aqui.
    if (active && active.id !== ALL_ID) {
      if (active.id === FAVORITES_ID) return state.db.library.filter(t => t.favorite);
      if (active.id === INFODOSE_ID)  return getInfodoseTracks();
      return (active.trackIds || []).map(getTrackById).filter(Boolean);
    }

    // "Todas" selecionada → o filtro mestre (Geral / Infodose / Arquétipos) manda.
    const all = state.db.library.slice();
    if (state.currentCategory === "infodose")   return getInfodoseTracks();
    if (state.currentCategory === "arquetipos") return all.filter(t => !!findArchetypeForTrack(t));
    // Geral: tudo que não caiu em Infodose nem em Arquétipos, pra não duplicar entre abas.
    return all.filter(t => !findArchetypeForTrack(t) && (t.artist || "").trim().toLowerCase() !== "infodose");
  }

  // Ordem: YouTube primeiro → trilhas "Aroma" → meditações/guiados → resto.
  // Isso vale só dentro da playlist Infodose (não mexe na ordem de "Todas").
  function getTrackPriority(t) {
    const name = (t.name || "").toLowerCase();
    if (t.type === "youtube" || t.type === "youtube_playlist") return 0;
    if (name.includes("aroma")) return 1;
    if (name.includes("guiad") || name.includes("meditaç") || name.includes("meditac")) return 2;
    return 3;
  }

  // Playlist Infodose é automática: qualquer faixa com artist "Infodose"
  // (YouTube ou SoundCloud) entra aqui sozinha, sem precisar adicionar manualmente.
  function getInfodoseTracks() {
    return state.db.library
      .map((t, i) => ({ t, i }))
      .filter(({ t }) => (t.artist || "").trim().toLowerCase() === "infodose")
      .sort((a, b) => {
        const pa = getTrackPriority(a.t), pb = getTrackPriority(b.t);
        return pa !== pb ? pa - pb : a.i - b.i;
      })
      .map(({ t }) => t);
  }

  // "Tag semântica": se o nome de um arquétipo aparece no autor OU no título da faixa,
  // ela entra automaticamente na playlist/carrossel daquele arquétipo. Sem curadoria manual.
  function findArchetypeForTrack(t) {
    const haystack = \`\${t.artist || ""} \${t.name || ""}\`.toLowerCase();
    return ARCHETYPES.find(a => a.nome && haystack.includes(a.nome.toLowerCase())) || null;
  }


  // ── RENDER ───────────────────────────────────────────────────────
  function syncPreviewAndMain(track) {
    const fills = [
      { title: dom.prevTitle, artist: dom.prevArtist, cover: dom.prevCover },
      { title: dom.footTitle, artist: dom.footArtist, cover: dom.footCover },
      { title: dom.mainTitle, artist: dom.mainArtist, cover: dom.mainCover }
    ];
    fills.forEach(({ title, artist, cover }) => {
      if (title)  title.textContent  = track?.name   || "Oráculo";
      if (artist) artist.textContent = track?.artist  || "Sistema KODUX";
      if (cover)  cover.src          = track?.cover   || "https://picsum.photos/100";
    });
  }

  function syncIcons() {
    const iconName = state.isPlaying ? 'pause-circle' : 'play-circle';
    const iconSimple = state.isPlaying ? 'pause' : 'play';

    [dom.prevPlayIcon, dom.footPlayIcon].forEach(el => {
      if (el) {
        const use = el.querySelector('use');
        if (use) use.setAttribute('href', \`#kx-\${iconName}\`);
      }
    });

    if (dom.mainPlayIcon) {
      const use = dom.mainPlayIcon.querySelector('use');
      if (use) use.setAttribute('href', \`#kx-\${iconSimple}\`);
    }
  }

  function renderTabs() {
    if (!dom.playlistTabs) return;
    dom.playlistTabs.innerHTML = "";
    const ordered = [
      getPlaylistById(ALL_ID),
      getPlaylistById(FAVORITES_ID),
      getPlaylistById(INFODOSE_ID),
      ...state.db.playlists.filter(p => !p.system && p.id !== ALL_ID && p.id !== FAVORITES_ID && p.id !== INFODOSE_ID)
    ].filter(Boolean);

    ordered.forEach(pl => {
      const visibleCount = pl.id === ALL_ID ? state.db.library.length :
                           pl.id === FAVORITES_ID ? state.db.library.filter(t => t.favorite).length :
                           pl.id === INFODOSE_ID ? getInfodoseTracks().length :
                           (pl.trackIds || []).length;
      const btn = document.createElement("button");
      const isCadial = !!pl.cadial;
      let iconName;
      if (pl.id === ALL_ID) iconName = 'stack';
      else if (pl.id === FAVORITES_ID) iconName = 'heart';
      else if (pl.id === INFODOSE_ID) iconName = 'disc';
      else if (isCadial) iconName = 'spiral';
      else iconName = 'playlist';

      if (isCadial) btn.title = \`[\${pl.cadial.opcode}] \${pl.cadial.essencia} · \${pl.cadial.hz}Hz\`;
      btn.className = \`mini-chip \${state.db.activePlaylistId === pl.id ? "active" : ""} \${isCadial ? "cadial-chip" : ""}\`;
      btn.onclick = () => setActivePlaylist(pl.id);

      btn.innerHTML = \`
        \${createIconHTML(iconName)}
        <span>\${pl.name}</span>
        <span class="opacity-60">(\${visibleCount})</span>
      \`;
      dom.playlistTabs.appendChild(btn);

      if (!pl.system && pl.id !== ALL_ID && pl.id !== FAVORITES_ID) {
        const del = document.createElement("button");
        del.className = "mini-chip";
        del.style.padding = "0.55rem 0.7rem";
        del.title = "Remover playlist";
        del.onclick = (e) => { e.stopPropagation(); deletePlaylist(pl.id); };
        del.innerHTML = createIconHTML('trash');
        dom.playlistTabs.appendChild(del);
      }
    });
  }

  function renderDestinationSelect() {
    if (!dom.destinationSelect) return;
    const prev = dom.destinationSelect.value || state.db.activePlaylistId || ALL_ID;
    const custom = state.db.playlists.filter(p => !p.system && p.id !== ALL_ID && p.id !== FAVORITES_ID);
    dom.destinationSelect.innerHTML =
      \`<option value="\${ALL_ID}">Todas</option>\` +
      \`<option value="\${FAVORITES_ID}">Favoritos</option>\` +
      custom.map(p => \`<option value="\${p.id}">\${p.name}</option>\`).join("");
    if ([ALL_ID, FAVORITES_ID, ...custom.map(p => p.id)].includes(prev)) dom.destinationSelect.value = prev;
    else dom.destinationSelect.value = state.db.activePlaylistId || ALL_ID;
  }

  function renderPlaylist() {
    if (!dom.playlistContainer) return;
    const visible = getVisibleTracks();
    const active = getActivePlaylist();
    dom.playlistContainer.innerHTML = "";

     // 1. Renderizar Banner Cadial (se existir)
    if (active?.cadial) {
      const banner = document.createElement("div");
      banner.style.cssText = "padding: 16px; border-radius: 16px; border: 1px solid rgba(255,255,255,0.1); background: rgba(255,255,255,0.05); margin-bottom: 12px;";
      banner.innerHTML = \`
        <p style="font-size: 10px; color: var(--muted, #a0a0a0); text-transform: uppercase; letter-spacing: 0.1em; margin: 0 0 4px 0;">
          \${active.cadial.opcode} · D\${active.cadial.rung} · \${active.cadial.hz}Hz
        </p>
        <p style="font-size: 12px; color: #fff; font-weight: 600; margin: 0;">\${active.cadial.essencia}</p>
        <p style="font-size: 10px; color: var(--muted, #a0a0a0); font-style: italic; margin: 4px 0 0 0;">"\${active.cadial.frase}"</p>
      \`;
      dom.playlistContainer.appendChild(banner);
    }

    // 2. Renderizar Estado Vazio (se não houver faixas)
    if (!visible.length) {
      const empty = document.createElement("div");
      empty.style.cssText = "padding: 20px; border-radius: 16px; border: 1px solid rgba(255,255,255,0.1); background: rgba(255,255,255,0.05); text-align: center; margin-top: 10px;";
      empty.innerHTML = \`
        <div style="color: var(--primary, #00d2ff); font-size: 28px; margin-bottom: 8px; display: flex; justify-content: center;">
          \${createIconHTML('disc')}
        </div>
        <h4 style="font-size: 14px; font-weight: bold; color: #fff; margin: 0 0 4px 0;">Sem faixas aqui</h4>
        <p style="font-size: 11px; color: var(--muted, #a0a0a0); margin: 0;">Adicione um link, crie uma playlist ou marque favoritos.</p>
      \`;
      dom.playlistContainer.appendChild(empty);
      return;
    }


    // 3. Corpo: carrossel agrupado (Geral/Arquétipos com "Todas" ativa) ou lista plana (resto)
    const useCarousel = active.id === ALL_ID && (state.currentCategory === "geral" || state.currentCategory === "arquetipos");
    if (useCarousel) renderGroupedCarousel(visible);
    else renderFlatList(visible);
  }

  function renderFlatList(visible) {
    visible.forEach(t => {
      const activeItem = t.id === state.currentTrackId;
      const item = document.createElement("div");
      item.className = \`flex items-center gap-3 p-3 rounded-2xl cursor-pointer transition \${
        activeItem ? "bg-[var(--primary)]/20 border border-[var(--primary)]/30" : "bg-white/5 hover:bg-white/10"
      }\`;

      const favIcon = t.favorite ? 'heart-fill' : 'heart';
      const favClass = t.favorite ? 'active' : '';
      const waveformHTML = activeItem && state.isPlaying ? createIconHTML('waveform') : '';

      item.innerHTML = \`
        <img src="\${t.cover}" onerror="this.onerror=null;this.src='https://picsum.photos/100';" class="w-10 h-10 rounded-lg object-cover border border-white/10">
        <div class="flex-1 overflow-hidden min-w-0">
          <h5 class="text-xs font-bold text-white truncate">\${t.name}</h5>
          <p class="text-[10px] text-[var(--muted)] truncate">\${t.artist}</p>
        </div>
        <button class="item-action fav \${favClass}" title="Favoritar"
          onclick="event.stopPropagation(); toggleFavorite('\${t.id}')">
          \${createIconHTML(favIcon)}
        </button>
        <button class="item-action add" title="Adicionar à playlist escolhida"
          onclick="event.stopPropagation(); quickAddToSelectedPlaylist('\${t.id}')">
          \${createIconHTML('plus')}
        </button>
        <button class="item-action" title="Excluir"
          onclick="event.stopPropagation(); removeTrack('\${t.id}')">
          \${createIconHTML('trash')}
        </button>
        \${activeItem && state.isPlaying ? \`<span class="ml-1">\${waveformHTML}</span>\` : ""}
      \`;
      item.onclick = () => loadAndPlayById(t.id);
      dom.playlistContainer.appendChild(item);
    });
  }

  // Carrossel: agrupa as faixas por arquétipo (aba Arquétipos) ou por autor (aba Geral)
  // e renderiza uma "trilha" horizontal por grupo — desliza pro lado, tipo slideshow.
  function renderGroupedCarousel(visible) {
    const groups = new Map(); // key -> { label, sub, items: [] }

    visible.forEach(t => {
      let key, label, sub;
      if (state.currentCategory === "arquetipos") {
        const arq = findArchetypeForTrack(t);
        key = arq ? arq.id : "_outros";
        label = arq ? arq.nome : "Outros";
        sub = arq ? arq.essencia : "";
      } else {
        const artist = (t.artist || "Desconhecido").trim();
        key = artist.toLowerCase();
        label = artist;
        sub = "";
      }
      if (!groups.has(key)) groups.set(key, { label, sub, items: [] });
      groups.get(key).items.push(t);
    });

    groups.forEach(({ label, sub, items }) => {
      const row = document.createElement("div");
      row.className = "carrossel-linha";

      const titleEl = document.createElement("div");
      titleEl.className = "carrossel-titulo";
      titleEl.innerHTML = \`<span>\${label}\${sub ? \` — \${sub}\` : ""}</span><span class="opacity-60">\${items.length}</span>\`;
      row.appendChild(titleEl);

      const trilho = document.createElement("div");
      trilho.className = "carrossel-trilhos";

      items.forEach(t => {
        const isActive = t.id === state.currentTrackId;
        const card = document.createElement("div");
        card.className = \`carrossel-cartao \${isActive ? "ativo" : ""}\`;
        card.innerHTML = \`
          <img src="\${t.cover}" onerror="this.onerror=null;this.src='https://picsum.photos/100';">
          <h5 class="text-truncate">\${t.name}</h5>
          <p class="text-truncate">— \${t.artist}</p>
        \`;
        card.onclick = () => loadAndPlayById(t.id);
        trilho.appendChild(card);
      });

      row.appendChild(trilho);
      dom.playlistContainer.appendChild(row);
    });
  }

  function renderEverything() {
    renderTabs();
    renderDestinationSelect();
    renderPlaylist();
    const current = state.currentTrackId ? getTrackById(state.currentTrackId) : null;
    syncPreviewAndMain(current);
    syncIcons();
  }

  // ── WIDGET STATE ─────────────────────────────────────────────────
  function updateWidgetState(newState) {
    if (!dom.widget) return;
    state.widgetState = newState;
    dom.widget.className = \`state-\${newState}\`;
    const contents = { ball: dom.ball, preview: dom.preview, footer: dom.footer, full: dom.full };
    Object.values(contents).forEach(el => { if (el) el.classList.add("hidden-content"); });
    if (contents[newState]) contents[newState].classList.remove("hidden-content");

    if (newState === "ball") {
      dom.widget.style.left = \`\${state.currentX}px\`;
      dom.widget.style.top = \`\${state.currentY}px\`;
      dom.widget.style.transform = "none";
      dom.widget.style.bottom = "auto";
      dom.widget.style.width = "";
      dom.widget.style.height = "";
    } else if (newState === "preview") {
      dom.widget.style.left = state.currentX < window.innerWidth/2 ? "10px" : \`\${window.innerWidth - 250}px\`;
      dom.widget.style.top = \`\${state.currentY}px\`;
      dom.widget.style.transform = "none";
      dom.widget.style.bottom = "auto";
      dom.widget.style.width = "240px";
      dom.widget.style.height = "78px"; // Ajustado conforme a correção visual 
    } else if (newState === "full") {
      dom.widget.style.left = "50%";
      dom.widget.style.top = "50%";
      dom.widget.style.transform = "translate(-50%, -50%)";
      dom.widget.style.bottom = "auto";
      dom.widget.style.width = "min(90vw, 600px)";
      dom.widget.style.height = "min(80vh, 700px)";
    } else if (newState === "footer") {
      dom.widget.style.transform = "none";
      dom.widget.style.left = "0";
      dom.widget.style.top = "auto";
      dom.widget.style.bottom = "0";
      dom.widget.style.width = "100%";
      dom.widget.style.height = "80px";
    }
  }

  function initDrag() {
    if (!dom.widget) return;
    const handleEls = [dom.ball, ...document.querySelectorAll(".drag-header")].filter(Boolean);
    let initialX = 0, initialY = 0, dragStartY = 0;

    const onStart = (e) => {
      if (state.widgetState === "full" || e.target.closest("button, input, select, textarea")) return;
      state.isDragging = false;
      const touch = e.type === "touchstart" ? e.touches[0] : e;
      initialX = touch.clientX - state.currentX;
      initialY = touch.clientY - state.currentY;
      dragStartY = touch.clientY;
      dom.widget.style.transition = "none";
      document.addEventListener("mousemove", onMove);
      document.addEventListener("mouseup", onEnd);
      document.addEventListener("touchmove", onMove, { passive: false });
      document.addEventListener("touchend", onEnd);
    };
    const onMove = (e) => {
      state.isDragging = true;
      e.preventDefault();
      const touch = e.type === "touchmove" ? e.touches[0] : e;
      state.currentX = touch.clientX - initialX;
      state.currentY = touch.clientY - initialY;
      dom.widget.style.left = \`\${state.currentX}px\`;
      dom.widget.style.top = \`\${state.currentY}px\`;
    };
    const onEnd = () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onEnd);
      document.removeEventListener("touchmove", onMove);
      document.removeEventListener("touchend", onEnd);
      dom.widget.style.transition = "";
      const deltaY = dragStartY - state.currentY;
      if (deltaY > 50 && state.widgetState === "ball") {
        updateWidgetState("preview");
      } else if (state.currentY > window.innerHeight - 120) {
        updateWidgetState("footer");
      } else if (state.isDragging) {
        updateWidgetState("ball");
      }
    };
    handleEls.forEach(h => {
      h.addEventListener("mousedown", onStart);
      h.addEventListener("touchstart", onStart);
    });
  }

  // ── PLAYBACK ─────────────────────────────────────────────────────
  function ensureYTPlayer() {
    if (state.ytPlayer) {
      if (state.ytReady) {
        return state.ytPlayer;
      }
      return state.ytPlayer;
    }

    if (!dom.ytContainer) {
      console.warn("YT container não encontrado");
      return null;
    }

    state.ytReady = false;
    state.ytPlayer = new YT.Player(dom.ytContainer, {
      height: "100%",
      width: "100%",
      videoId: "",
      playerVars: {
        autoplay: 0,
        playsinline: 1,
        modestbranding: 1,
        rel: 0
      },
      events: {
        onReady: (e) => {
          console.log("YouTube player ready");
          state.ytReady = true;
          if (state.pendingTrackId) {
            const track = getTrackById(state.pendingTrackId);
            if (track) {
              loadAndPlayById(state.pendingTrackId);
              state.pendingTrackId = null;
            }
          }
          syncIcons();
        },
        onStateChange: (e) => {
          if (e.data === YT.PlayerState.ENDED) {
            playNext();
          }
          state.isPlaying = (e.data === YT.PlayerState.PLAYING);
          syncIcons();
        },
        onError: (e) => {
          console.error("YouTube player error:", e);
          state.ytReady = false;
        }
      }
    });

    return state.ytPlayer;
  }

  function playYT(track) {
    if (!track) return;

    if (!state.ytReady) {
      state.pendingTrackId = track.id;
      if (!state.ytPlayer) {
        ensureYTPlayer();
      }
      return;
    }

    const player = state.ytPlayer;
    if (!player) {
      console.warn("Player não disponível");
      return;
    }

    try {
      if (track.type === "youtube_playlist" && track.playlistId) {
        player.loadPlaylist({ list: track.playlistId, index: 0 });
      } else {
        player.loadVideoById(track.id);
      }
      player.playVideo();
      state.isPlaying = true;
    } catch (e) {
      console.error("Erro ao carregar vídeo YouTube:", e);
      state.ytReady = false;
      state.ytPlayer = null;
      state.pendingTrackId = track.id;
      ensureYTPlayer();
    }
    syncIcons();
  }

  function playSC(url) {
    if (!dom.scContainer) return;

    dom.scContainer.innerHTML = '';

    const iframe = document.createElement('iframe');
    iframe.id = 'sc-frame';
    iframe.allow = 'autoplay';
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.border = 'none';
    iframe.src = \`https://w.soundcloud.com/player/?url=\${encodeURIComponent(url)}&auto_play=true&hide_related=true&show_comments=false&show_user=false&show_reposts=false&visual=false\`;
    
    dom.scContainer.appendChild(iframe);

    state.scWidget = SC.Widget('sc-frame');
    
    state.scWidget.bind(SC.Widget.Events.READY, () => {
      state.scWidget.play();
      state.isPlaying = true;
      syncIcons();
    });
    state.scWidget.bind(SC.Widget.Events.FINISH, () => playNext());
    state.scWidget.bind(SC.Widget.Events.PLAY, () => {
      state.isPlaying = true;
      syncIcons();
    });
    state.scWidget.bind(SC.Widget.Events.PAUSE, () => {
      state.isPlaying = false;
      syncIcons();
    });
    state.scWidget.bind(SC.Widget.Events.ERROR, (e) => {
      console.error('Erro no widget SoundCloud:', e);
      setTimeout(() => {
        if (dom.scContainer) {
          dom.scContainer.innerHTML = '';
          playSC(url);
        }
      }, 1000);
    });
  }

  function loadAndPlayById(trackId) {
    const track = getTrackById(trackId);
    if (!track) return;

    state.currentTrackId = trackId;
    state.activeEngine = track.type;

    try { dom.audio?.pause(); dom.audio?.removeAttribute('src'); dom.audio?.load(); } catch(e) {}
    try { if (state.ytPlayer && state.ytPlayer.pauseVideo) state.ytPlayer.pauseVideo(); } catch(e) {}
    try { 
      if (state.scWidget) {
        state.scWidget.pause();
        if (dom.scContainer) dom.scContainer.innerHTML = '';
      }
    } catch(e) {}

    syncPreviewAndMain(track);

    if (track.type === "youtube" || track.type === "youtube_playlist") {
      if (typeof YT === 'undefined' || typeof YT.Player === 'undefined') {
        console.warn("API YouTube não carregada, aguardando...");
        setTimeout(() => loadAndPlayById(trackId), 300);
        return;
      }
      ensureYTPlayer();
      playYT(track);
    } else if (track.type === "soundcloud") {
      playSC(track.url);
    } else if (track.type === "local") {
      if (!dom.audio) return;
      const src = track.blob ? URL.createObjectURL(track.blob) : track.url;
      dom.audio.src = src;
      dom.audio.play().catch(() => alert("Clique em Play para iniciar o áudio local (bloqueio do navegador)."));
      state.isPlaying = true;
      syncIcons();
    }

    renderEverything();
  }

  function togglePlay(e) {
    if (e) e.stopPropagation();
    const visible = getVisibleTracks();
    if (!visible.length) return;
    if (!state.currentTrackId) { loadAndPlayById(visible[0].id); return; }
    const current = getTrackById(state.currentTrackId);
    if (!current) { loadAndPlayById(visible[0].id); return; }

    if (state.isPlaying) {
      if (state.activeEngine === "youtube" && state.ytPlayer && state.ytReady) {
        try { state.ytPlayer.pauseVideo(); } catch(e) {}
      } else if (state.activeEngine === "soundcloud" && state.scWidget) {
        state.scWidget.pause();
      } else {
        dom.audio?.pause();
      }
      state.isPlaying = false;
    } else {
      if (state.activeEngine === "youtube" && state.ytPlayer && state.ytReady) {
        try { state.ytPlayer.playVideo(); } catch(e) {}
      } else if (state.activeEngine === "soundcloud" && state.scWidget) {
        state.scWidget.play();
      } else {
        dom.audio?.play();
      }
      state.isPlaying = true;
    }
    syncIcons();
  }

  function playNext() {
    const visible = getVisibleTracks();
    if (!visible.length) return;
    const idx = state.currentTrackId ? visible.findIndex(t => t.id === state.currentTrackId) : -1;
    const next = visible[(idx + 1) % visible.length];
    if (next) loadAndPlayById(next.id);
  }

  function playPrev() {
    const visible = getVisibleTracks();
    if (!visible.length) return;
    const idx = state.currentTrackId ? visible.findIndex(t => t.id === state.currentTrackId) : 0;
    const prev = visible[(idx - 1 + visible.length) % visible.length];
    if (prev) loadAndPlayById(prev.id);
  }

  // ── PLAYLIST MANAGEMENT ──────────────────────────────────────────
  function setActivePlaylist(id) {
    state.db.activePlaylistId = id;
    DB.save(state.db);
    renderEverything();
  }

  function createPlaylist() {
    if (!dom.newPlaylistInput) return;
    const name = dom.newPlaylistInput.value.trim();
    if (!name) return;
    const exists = state.db.playlists.some(p => p.name.toLowerCase() === name.toLowerCase());
    if (exists) return alert("Já existe uma playlist com esse nome.");
    state.db.playlists.push({ id: uid("pl"), name, system: false, trackIds: [], cadial: null });
    dom.newPlaylistInput.value = "";
    DB.save(state.db);
    renderEverything();
  }

  function deletePlaylist(playlistId) {
    const playlist = getPlaylistById(playlistId);
    if (!playlist || playlist.system) return;
    if (!confirm(\`Remover a playlist "\${playlist.name}"?\`)) return;
    state.db.playlists = state.db.playlists.filter(p => p.id !== playlistId);
    if (state.db.activePlaylistId === playlistId) state.db.activePlaylistId = ALL_ID;
    DB.save(state.db);
    renderEverything();
  }

  function toggleFavorite(trackId) {
    const track = getTrackById(trackId);
    if (!track) return;
    track.favorite = !track.favorite;
    DB.save(state.db);
    renderEverything();
  }

  function addTrackToPlaylist(trackId, playlistId) {
    const playlist = getPlaylistById(playlistId);
    const track = getTrackById(trackId);
    if (!track || !playlist) return;
    if (playlist.id === ALL_ID) {
      state.db.activePlaylistId = ALL_ID;
    } else if (playlist.id === FAVORITES_ID) {
      track.favorite = true;
      state.db.activePlaylistId = FAVORITES_ID;
    } else if (playlist.id === INFODOSE_ID) {
      // Infodose é automática (artist === "Infodose"); só navega até ela.
      state.db.activePlaylistId = INFODOSE_ID;
    } else {
      if (!playlist.trackIds.includes(trackId)) playlist.trackIds.unshift(trackId);
      state.db.activePlaylistId = playlist.id;
    }
    DB.save(state.db);
    renderEverything();
  }

  function quickAddToSelectedPlaylist(trackId) {
    if (!dom.destinationSelect) return;
    addTrackToPlaylist(trackId, dom.destinationSelect.value);
  }

  function removeTrack(trackId) {
    const active = getActivePlaylist();
    const track = getTrackById(trackId);
    if (!track) return;
    if (active.id === FAVORITES_ID) {
      track.favorite = false;
    } else if (active.id === ALL_ID) {
      state.db.library = state.db.library.filter(t => t.id !== trackId);
      state.db.playlists.forEach(p => {
        if (Array.isArray(p.trackIds)) p.trackIds = p.trackIds.filter(id => id !== trackId);
      });
      if (state.currentTrackId === trackId) { state.currentTrackId = null; }
    } else {
      active.trackIds = (active.trackIds || []).filter(id => id !== trackId);
      if (state.currentTrackId === trackId) { state.currentTrackId = null; }
    }
    DB.save(state.db);
    renderEverything();
  }

  function findExistingTrackByUrl(url, type, id) {
    if (type === "youtube" && id) return state.db.library.find(t => t.type === "youtube" && t.id === id) || null;
    if (type === "youtube_playlist" && id) return state.db.library.find(t => t.type === "youtube_playlist" && t.playlistId === id) || null;
    if (type === "soundcloud") {
      const norm = normalizeUrl(url);
      return state.db.library.find(t => t.type === "soundcloud" && normalizeUrl(t.url) === norm) || null;
    }
    return state.db.library.find(t => normalizeUrl(t.url) === normalizeUrl(url)) || null;
  }

  function normalizeAndInsertToLibrary(track) {
    const normalized = normalizeTrack(track);
    const existing = findExistingTrackByUrl(normalized.url, normalized.type, normalized.id || normalized.playlistId);
    if (existing) {
      existing.name       = normalized.name       || existing.name;
      existing.artist     = normalized.artist     || existing.artist;
      existing.cover      = normalized.cover      || existing.cover;
      existing.playlistId = normalized.playlistId || existing.playlistId;
      if (normalized.type === "local" && normalized.blob) existing.blob = normalized.blob;
      return existing;
    }
    state.db.library.unshift(normalized);
    return normalized;
  }

  async function buildTrackFromUrl(url, base = {}) {
    const cleanUrl = normalizeUrl(url);
    if (!cleanUrl) throw new Error("Link vazio.");

    const track = {
      id:         base.id     || uid(),
      type:       base.type   || "local",
      url:        cleanUrl,
      name:       base.name   || "Carregando...",
      artist:     base.artist || "Web",
      cover:      base.cover  || "https://picsum.photos/100",
      blob:       base.blob   || null,
      favorite:   !!base.favorite,
      playlistId: base.playlistId || null,
      cadial:     base.cadial || null
    };

    const ytId     = extractYouTubeId(cleanUrl);
    const ytListId = extractYouTubePlaylistId(cleanUrl);
    const isYT = cleanUrl.includes("youtube.com") || cleanUrl.includes("youtu.be") || cleanUrl.includes("youtube-nocookie.com");
    const isSC = cleanUrl.includes("soundcloud.com") || cleanUrl.includes("on.soundcloud.com");

    if (isYT) {
      if (ytListId && !ytId) {
        track.type       = "youtube_playlist";
        track.playlistId = ytListId;
        track.name       = base.name   || "YouTube Playlist";
        track.artist     = base.artist || "YouTube";
        track.cover      = base.cover  || "https://picsum.photos/100";
        return normalizeTrack(track);
      }
      if (!ytId) throw new Error("Link YouTube inválido.");
      track.type  = "youtube";
      track.id    = ytId;
      track.cover = \`https://img.youtube.com/vi/\${ytId}/hqdefault.jpg\`;
      try {
        const res  = await fetch(\`https://noembed.com/embed?url=\${encodeURIComponent(cleanUrl)}\`);
        const data = await res.json();
        track.name   = data.title       || base.name   || "YouTube Track";
        track.artist = data.author_name || base.artist || "YouTube";
      } catch (e) {
        track.name   = base.name   || "YouTube Track";
        track.artist = base.artist || "YouTube";
      }
    } else if (isSC) {
      track.type = "soundcloud";
      try {
        const res  = await fetch(\`https://soundcloud.com/oembed?url=\${encodeURIComponent(cleanUrl)}&format=json\`);
        const data = await res.json();
        track.name   = data.title         || base.name   || "SoundCloud Track";
        track.artist = data.author_name   || base.artist || "SoundCloud";
        track.cover  = data.thumbnail_url || base.cover  || "https://i1.sndcdn.com/artworks-default-t500x500.jpg";
      } catch (e) {
        track.name   = base.name   || "SoundCloud Track";
        track.artist = base.artist || "SoundCloud";
        track.cover  = base.cover  || "https://i1.sndcdn.com/artworks-default-t500x500.jpg";
      }
    } else {
      track.type   = base.type   || "local";
      track.name   = base.name   || cleanUrl.split("/").pop() || "Arquivo local";
      track.artist = base.artist || "Local";
    }
    return normalizeTrack(track);
  }

  async function hydratePreloadedTracks() {
    const preloadedUrls = new Set(PRELOADED.map(t => normalizeUrl(t.url)));
    let changed = false;
    for (let i = 0; i < state.db.library.length; i++) {
      const tr = state.db.library[i];
      if (!preloadedUrls.has(normalizeUrl(tr.url))) continue;
      try {
        const fresh = await buildTrackFromUrl(tr.url, tr);
        state.db.library[i] = { ...tr, ...fresh, id: tr.id };
        changed = true;
      } catch (e) {}
    }
    if (changed) { DB.save(state.db); renderEverything(); }
  }

  async function quickAddFromClipboard() {
    const drawer = document.getElementById("config-drawer");
    let pasted = "";
    try {
      if (navigator.clipboard && navigator.clipboard.readText) {
        pasted = (await navigator.clipboard.readText() || "").trim();
      }
    } catch (e) {
      // Sem permissão de clipboard (comum em iOS/contexto sem gesto) — cai pro modo manual.
    }

    const looksLikeUrl = /^https?:\\/\\//i.test(pasted);

    if (looksLikeUrl && dom.linkInput) {
      dom.linkInput.value = pasted;
      await addLink();
      return;
    }

    // Não achou link válido no clipboard: abre a gaveta pra digitar/colar manual.
    if (drawer) drawer.classList.add("open");
    if (dom.linkInput) dom.linkInput.focus();
  }

  function toggleConfigDrawer() {
    const drawer = document.getElementById("config-drawer");
    if (drawer) drawer.classList.toggle("open");
  }

  function setCategory(cat) {
    state.currentCategory = cat;
    ["geral", "infodose", "arquetipos"].forEach(c => {
      const btn = document.getElementById(\`tab-\${c}\`);
      if (btn) btn.classList.toggle("active", c === cat);
    });
    renderEverything();
  }

  async function addLink() {
    const input = dom.linkInput;
    const destination = dom.destinationSelect;
    if (!input || !destination) return;
    const url = normalizeUrl(input.value.trim());
    if (!url) return;
    let newTrack;
    try {
      newTrack = await buildTrackFromUrl(url);
    } catch (e) {
      return alert(e.message || "Não consegui ler esse link.");
    }
    const inserted = normalizeAndInsertToLibrary(newTrack);
    if (destination.value === FAVORITES_ID) {
      inserted.favorite = true;
    } else if (destination.value !== ALL_ID) {
      const playlist = getPlaylistById(destination.value);
      if (playlist && !playlist.trackIds.includes(inserted.id)) playlist.trackIds.unshift(inserted.id);
    }
    input.value = "";
    DB.save(state.db);
    renderEverything();
  }

  // ── EVENT HANDLERS ───────────────────────────────────────────────
  function openFullFromPreview(e) { if (e) e.stopPropagation(); updateWidgetState("full"); }
  
  function collapseToBall(e) { 
    if (e) e.stopPropagation();
    // Transição corrigida para ter o estágio intermediário (preview com 78px) antes de virar a "ball"
    if (state.widgetState === "full" || state.widgetState === "footer") {
        updateWidgetState("preview");
    } else {
        updateWidgetState("ball");
    }
  }
  
  function handleClickOutside(e) {
    if (state.widgetState === "preview" && dom.widget && !dom.widget.contains(e.target)) {
      updateWidgetState("ball");
    }
  }

  // ── INICIALIZAÇÃO ────────────────────────────────────────────────
  function initKoduxPlayer() {
    initDOM();
    if (!dom.widget) {
      console.warn("KODUX Player: widget não encontrado.");
      return;
    }

    // Inicializa o banco injetando o PRELOADED para garantir sincronia
    state.db = DB.init(ARCHETYPES, PRELOADED);

    global.openFullFromPreview = openFullFromPreview;
    global.updateWidgetState = updateWidgetState;
    global.togglePlay = togglePlay;
    global.playNext = playNext;
    global.playPrev = playPrev;
    global.addLink = addLink;
    global.quickAddFromClipboard = quickAddFromClipboard;
    global.toggleConfigDrawer = toggleConfigDrawer;
    global.setCategory = setCategory;
    global.collapseToBall = collapseToBall;
    global.toggleFavorite = toggleFavorite;
    global.removeTrack = removeTrack;
    global.quickAddToSelectedPlaylist = quickAddToSelectedPlaylist;
    global.createPlaylist = createPlaylist;

    global.onYouTubeIframeAPIReady = function() {
      console.log("YouTube API ready");
    };

    if (typeof YT === 'undefined' || typeof YT.Player === 'undefined') {
      if (!document.querySelector('script[src="https://www.youtube.com/iframe_api"]')) {
        const tag = document.createElement("script");
        tag.src = "https://www.youtube.com/iframe_api";
        document.head.appendChild(tag);
        console.log("YouTube API script carregado");
      }
    } else {
      if (typeof global.onYouTubeIframeAPIReady === 'function') {
        global.onYouTubeIframeAPIReady();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    dom.widget.addEventListener("click", (e) => {
      if (state.isDragging) return;
      if (state.widgetState === "ball") updateWidgetState("preview");
    });

    initDrag();
    renderEverything();
    updateWidgetState("ball");
    hydratePreloadedTracks(); // Atualiza capa/título de fontes externas asíncronamente

    console.log("⚫ KODUX Player inicializado.");
  }

  global.initKoduxPlayer = initKoduxPlayer;

})(window);


</script>

 <script>
    document.addEventListener('DOMContentLoaded', () => {
      if (typeof initKoduxPlayer === 'function') {
        initKoduxPlayer();
      }
    });
  </script>

  <!-- ===== KODUX ICON SPRITE COMPLETO (INLINE) ===== -->
  <svg xmlns="http://www.w3.org/2000/svg" style="display:none;">

    <!-- Já existentes -->
    <symbol id="kx-vinyl" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-12.5c-2.49 0-4.5 2.01-4.5 4.5s2.01 4.5 4.5 4.5 4.5-2.01 4.5-4.5-2.01-4.5-4.5-4.5zm0 7c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
    </symbol>
    <symbol id="kx-play-circle" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/>
    </symbol>
    <symbol id="kx-prev" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 18.5L10.5 12 19 5.5v13zM9 5.5v13H5v-13h4z"/>
    </symbol>
    <symbol id="kx-next" viewBox="0 0 24 24" fill="currentColor">
      <path d="M5 5.5l8.5 6.5L5 18.5v-13zM19 5.5v13h-4v-13h4z"/>
    </symbol>
    <symbol id="kx-collapse" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11H7v-2h10v2z"/>
    </symbol>
    <symbol id="kx-bolt" viewBox="0 0 24 24" fill="currentColor">
      <path d="M13 2L4 14h6l-3 8 9-12h-6l3-8z"/>
    </symbol>
    <symbol id="kx-collapse-full" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 15.5L4 7.5l2-2 6 6 6-6 2 2z"/>
    </symbol>
    <symbol id="kx-link" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 6v2.5l-2.5 2.5-2.5-2.5V6c0-2.5 2-4.5 4.5-4.5S16 3.5 16 6v2.5l-2.5 2.5-2.5-2.5V6zM12 18v-2.5l2.5-2.5 2.5 2.5V18c0 2.5-2 4.5-4.5 4.5S7 20.5 7 18v-2.5l2.5-2.5 2.5 2.5V18z"/>
    </symbol>
    <symbol id="kx-plus" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
    </symbol>
    <symbol id="kx-folder" viewBox="0 0 24 24" fill="currentColor">
      <path d="M4 20h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-7l-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2z"/>
    </symbol>
    <symbol id="kx-folder-add" viewBox="0 0 24 24" fill="currentColor">
      <path d="M4 20h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-7l-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2zm4-4h2v2h4v-2h2v-4h-2v-2h-4v2H8v4z"/>
    </symbol>
    <symbol id="kx-play" viewBox="0 0 24 24" fill="currentColor">
      <path d="M5 3l14 9-14 9V3z"/>
    </symbol>

    <!-- ===== NOVOS ÍCONES ===== -->
    <symbol id="kx-stack" viewBox="0 0 24 24" fill="currentColor">
      <path d="M4 4h16v2H4V4zm0 5h16v2H4V9zm0 5h16v2H4v-2zm0 5h16v2H4v-2z"/>
    </symbol>

    <symbol id="kx-heart" viewBox="0 0 24 24" fill="currentColor">
      <path fill-rule="evenodd" clip-rule="evenodd" d="M12,21.35l-1.45-1.32C5.4,15.36,2,12.28,2,8.5C2,5.42,4.42,3,7.5,3c1.74,0,3.41,0.81,4.5,2.09C13.09,3.81,14.76,3,16.5,3 C19.58,3,22,5.42,22,8.5c0,3.78-3.4,6.86-8.55,11.54L12,21.35z M12.1,18.55l0.1,0.1l0.1-0.1C16.71,14.24,20,11.39,20,8.5 C20,6.5,18.5,5,16.5,5c-1.54,0-3.04,0.99-3.56,2.36h-1.87C10.54,5.99,9.04,5,7.5,5C5.5,5,4,6.5,4,8.5 C4,11.39,7.29,14.24,12.1,18.55z"/>
    </symbol>
    <symbol id="kx-heart-fill" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
    </symbol>

    <symbol id="kx-spiral" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z"/>
    </symbol>

    <symbol id="kx-playlist" viewBox="0 0 24 24" fill="currentColor">
      <path d="M4 6h16v2H4V6zm0 5h10v2H4v-2zm0 5h6v2H4v-2zm13-3.5l6 4.5-6 4.5v-9z"/>
    </symbol>

    <symbol id="kx-trash" viewBox="0 0 24 24" fill="currentColor">
      <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
    </symbol>

    <symbol id="kx-disc" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-12.5c-2.49 0-4.5 2.01-4.5 4.5s2.01 4.5 4.5 4.5 4.5-2.01 4.5-4.5-2.01-4.5-4.5-4.5zm0 7c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
    </symbol>

    <symbol id="kx-waveform" viewBox="0 0 24 24" fill="currentColor">
      <path d="M3 12h2v12H3zm4-4h2v16H7zm4-4h2v20h-2zm4 4h2v16h-2zm4 4h2v12h-2z"/>
    </symbol>

    <symbol id="kx-pause-circle" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/>
    </symbol>

    <symbol id="kx-pause" viewBox="0 0 24 24" fill="currentColor">
      <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
    </symbol>

  </svg>
  <!-- ===== FIM SPRITE ===== -->

</body>
</html>`);
