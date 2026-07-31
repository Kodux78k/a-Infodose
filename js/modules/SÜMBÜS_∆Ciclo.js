(function(h,s='#inject-here'){
const p=new DOMParser(),
c=p.parseFromString(h,'text/html'),
f=document.createDocumentFragment(),
t=document.querySelector(s)||document.body;
Array.from(c.body.childNodes)
.forEach(n=>f.appendChild(
document.importNode(n,true)
));
t.appendChild(f);
Array.from(c.querySelectorAll('script'))
.forEach(x=>{
const n=document.createElement('script');
for(const a of x.attributes)
n.setAttribute(a.name,a.value);
n.textContent=x.textContent;
document.body.appendChild(n);
});
})(`<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
<title>SÜMBÜS · System Architect</title>
<meta name="theme-color" content="#000204">

   <link href="https://www.infodose.com.br/css/a€uArX.css" rel="stylesheet" data-k-id="L_m1k">

<style> 
body, html{overflow-y:auto !important;}
 /* Orb */
 .orb {      
 background: radial-gradient(circle at 30% 30%, var(--grad-a, #78e7ff), transparent 78%),
                  radial-gradient(circle at 70% 70%, var(--kob-voice-secondary, #00f2ff), var(--orb-secondary, #3b82f6));
      box-shadow: 0 0 18px var(--kob-voice-primary), 0 0 36px rgba(120,227,255,0.4);
      animation: orbSpin var(--orb-speed) linear infinite;
      width: 100%; height: 100%; border-radius: 50%; display: grid; place-items: center;

      width: 56px; height: 56px; 

    }
    .orb-core {

      min-width: 100%; min-height: 100%; 
border-radius: 50%;
      background: radial-gradient(circle at 30% 30%, var(--orb-accent, #78e7ff), transparent 78%),
                  radial-gradient(circle at 70% 70%, var(--kob-voice-primary, #00f2ff), var(--kob-voice-secondary, #3b82f6));
      box-shadow: 0 0 18px var(--kob-voice-secondary), 0 0 36px rgba(120,227,255,0.4);
      animation: orbSpin var(--orb-speed) linear infinite;

      width: 56px; height: 56px; 

    }
    @keyframes orbSpin { to { transform: rotate(360deg); } }
    @keyframes orbPulse { from { transform: scale(1); } to { transform: scale(1.15); } }
</style>

<style>
  /* Colours used in the UNO loader */
  :root {
    --g1: #F0F;
    --g2: #0FF;
  }

  /* Basic page styling */
  html, body {
    height: 100%;
    margin: 0;
    background: #000;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  /* Loader container */
  .di-loader {
    --di-size: 36px;
    position: relative;
    width: var(--di-size);
    height: var(--di-size);
  }

  /* Rotating conic gradient ring */
  .di-ring {
    position: absolute;
    inset: 0;
    background: conic-gradient(from 90deg, var(--g1), var(--g2));
    border-radius: 50%;
    /* mask to create a donut shape */
    -webkit-mask: radial-gradient(
      farthest-side,
      transparent calc(50% - 1px),
      #000 calc(50% - 1px),
      #000 100%
    );
    mask: radial-gradient(
      farthest-side,
      transparent calc(50% - 1px),
      #000 calc(50% - 1px),
      #000 100%
    );
    animation: spin 6s linear infinite;
  }

  /* Pulsating stroke across the loader */
  .di-stroke {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 64%;
    height: 2px;
    background: linear-gradient(90deg, var(--g1), var(--g2));
    transform: translate(-50%, -50%);
    border-radius: 999px;
    animation: breath 2.4s ease-in-out infinite;
  }

  /* Container for orbiting dots */
  .di-dots {
    position: absolute;
    inset: 0;
    transform: rotate(-90deg);
    animation: orbit 4.2s linear infinite;
  }

  /* Individual dot styling */
  .di-dots i {
    --i: 0;
    position: absolute;
    left: 50%;
    top: 50%;
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: conic-gradient(var(--g1), var(--g2));
    -webkit-mask: radial-gradient(circle, #000 62%, transparent 63%);
    mask: radial-gradient(circle, #000 62%, transparent 63%);
    opacity: 0.85;
    transform: rotate(calc(var(--i) * 51deg)) translate(
      calc(7px + var(--i) * 2.2px)
    ) rotate(calc(var(--i) * -51deg));
    animation: pulse 4.2s linear infinite;
    animation-delay: calc(var(--i) * 0.6s);
  }

  /* Animations */
  @keyframes orbit {
    to {
      transform: rotate(270deg);
    }
  }
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
  @keyframes breath {
    0%,
    100% {
      opacity: 0.9;
    }
    50% {
      opacity: 1;
    }
  }
  @keyframes pulse {
    0%,
    70% {
      opacity: 0.55;
      transform: scale(0.92);
    }
    76%,
    84% {
      opacity: 1;
      transform: scale(1.12);
    }
    100% {
      opacity: 0.7;
      transform: scale(0.96);
    }
  }
</style>
 

<style>
:root {
  --glass-bg: rgba(7, 10, 15, 0.8); --glass-border: rgba(255, 255, 255, 0.08);
  --accent: #3b82f6; --critical: #ef4444; --warning: #f59e0b; --bg: #02040a;
  --cyan: #00e5ff; --magenta: #ff2ec4; --text: #f8fafc; --text-dim: #64748b;
}

body {
  background: var(--bg); color: var(--text);
  font-family: system-ui, -apple-system, sans-serif; margin: 0; overflow: auto;
}

/* SVG ICONS */
.ic{width:18px;height:18px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
.ic-lg{width:30px;height:30px}

/* DRAGGABLE TRIGGER */
#sumbus-trigger {
  position: fixed; left: 20px; bottom: 20px; width: 48px; height: 48px; border-radius: 120px;
  background: rgba(255, 255, 255, 0.05); cursor: grab; z-index: 10000;
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 0 0px rgba(37, 99, 235, 0.4); touch-action: none; border: 2px solid rgba(255,255,255,0.1);
color: var(--text);}
#sumbus-trigger:active { cursor: grabbing; transform: scale(0.9); }

/* DECK OVERLAY */
#sumbus-deck {
  position: fixed; inset: 0; background: rgba(1, 2, 4, 0.19); backdrop-filter: blur(40px);
  z-index: 9999; display: none; opacity: 0; transition: all 0.3s ease;
  grid-template-columns: 440px 1fr;
}
#sumbus-deck.active { display: grid; opacity: 1; }

.sidebar {
  background: #070a0f; border-right: 1px solid var(--glass-border);
  display: flex; flex-direction: column; height: 100vh;
}

.tab-btn {
  flex: 1; padding: 12px; font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px;
  color: #475569; border-bottom: 2px solid transparent; background: none; border: none; cursor: pointer;
}
.tab-btn.active { color: var(--accent); border-color: var(--accent); background: rgba(59, 130, 246, 0.05); }

.panel { display: none; flex-direction: column; flex: 1; overflow-y: auto; padding: 24px; }
.panel.active { display: flex; }

.conflict-card {
  background: rgba(239, 68, 68, 0.05); border: 1px solid rgba(239, 68, 68, 0.2);
  border-radius: 12px; padding: 12px; margin-bottom: 8px;
}
.status-badge { font-size: 8px; padding: 2px 6px; border-radius: 4px; font-weight: 900; text-transform: uppercase; }

/* TEXTAREA CODE VIEW & EDITOR */
#editor-container { flex: 1; background: #0b0e14; border-radius: 8px; overflow: hidden; display: flex; flex-direction: column; }
#code-textarea { width: 100%; height: 100%; background: transparent; color: var(--text);
  border: none; outline: none; padding: 16px; font-family: 'JetBrains Mono', monospace; font-size: 12px; resize: none; }

/* PREVIEW FRAME */
.preview-area { padding: 20px; display: flex; flex-direction: column; gap: 12px; position: relative; }
#main-iframe {
  background: white; border-radius: 16px; box-shadow: 0 40px 80px -20px rgba(0,0,0,0.8);
  width: 100%; height: 100%; border: none; transition: max-width 0.4s ease;
}
.scan-line {
  position: absolute; top: 0; left: 0; right: 0; height: 2px;
  background: rgba(59, 130, 246, 0.5); box-shadow: 0 0 15px #3b82f6; z-index: 10; display: none;
}
.scanning.scan-line { display: block; animation: scan 2s linear infinite; }
@keyframes scan { from { top: 0%; } to { top: 100%; } }

.btn { height: 48px; background: #0f172a; color: white; border-radius: 12px; font-size: 12px; font-weight: 800;
  display: flex; align-items: center; justify-content: center; gap: 8px; border: 1px solid var(--glass-border); cursor: pointer; }
.btn.primary { background: var(--text); border-color: var(--accent); }
.btn:hover { opacity: 0.8; }

@media (max-width: 768px) {
  body { overflow: hidden; }
  #sumbus-deck { grid-template-columns: 1fr; overflow-y: auto; height: 100vh; }
  .sidebar { height: auto; }
  .preview-area { min-height: 100dvh; }
}
</style>
</head>
<body>

<!-- SVG SPRITE INLINE -->
<svg hidden>
  <symbol id="i-shield" viewBox="0 0 100 100" aria-hidden="true">
          <defs>
            <radialGradient id="orb_az_df506_core" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stop-color="hsl(35,100%,66%)" stop-opacity="1"/>
              <stop offset="55%" stop-color="hsl(215,92%,46%)" stop-opacity=".9"/>
              <stop offset="100%" stop-color="hsl(215,100%,12%)" stop-opacity="0"/>
            </radialGradient>

            <linearGradient id="orb_az_df506_ring" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="hsl(35,100%,76%)"/>
              <stop offset="100%" stop-color="hsl(215,100%,58%)"/>
            </linearGradient>
          </defs>

          <circle cx="50" cy="50" r="46" fill="#05070c"/>
          <circle cx="50" cy="50" r="40" fill="url(#orb_az_df506_core)" opacity=".28"/>
          <circle cx="50" cy="50" r="38" fill="none" stroke="url(#orb_az_df506_ring)" stroke-width="1"/>
          <circle cx="50" cy="50" r="46" fill="none" stroke="url(#orb_az_df506_ring)" stroke-width="2.5"
            stroke-dasharray="70 20 10 30" stroke-linecap="round" opacity=".86"/>
          <circle cx="50" cy="50" r="8" fill="#ffffff" opacity=".22" filter="blur(2px)"/>
          <circle cx="50" cy="50" r="3" fill="#ffffff" opacity=".85"/></symbol>
  <symbol id="i-refresh" viewBox="0 0 24 24"><path d="M23 4v6h-6M1 20v-6h6M20.49 9A9 9 0 0 0 5.64 5.64M3.51 15a9 9 0 0 0 14.85 3.36"/></symbol>
  <symbol id="i-file-up" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="12" y2="12"/><line x1="15" y1="15" x2="12" y2="12"/></symbol>
  <symbol id="i-x" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></symbol>
  <symbol id="i-copy" viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></symbol>
  <symbol id="i-download" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></symbol>
  <symbol id="i-monitor" viewBox="0 0 24 24"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></symbol>
  <symbol id="i-smartphone" viewBox="0 0 24 24"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></symbol>
  <symbol id="i-radar" viewBox="0 0 24 24"><path d="M3 3v18h18"/><path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3"/><circle cx="12" cy="12" r="10"/></symbol>
  <symbol id="i-check" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></symbol>
</svg>

<!-- FLOATING TRIGGER -->
<div class="orb" id="sumbus-trigger" title="Drag to Move · Click to Open">

sümbüs

 <span class="di-loader" aria-hidden="true">
    <span class="di-ring"></span>
    <span class="di-stroke"></span>
    <span class="di-dots">
      <i style="--i:0"></i><i style="--i:1"></i><i style="--i:2"></i><i style="--i:3"></i><i style="--i:4"></i><i style="--i:5"></i><i style="--i:6"></i>
   </span>
  </span>

 <svg class="ic-olg oorb" style="display:none; color:#fff"><use href="#i-shield"/></svg>
 </div> </div>

<!-- SÜMBÜS INTERFACE -->
<div id="sumbus-deck">
  <div class="sidebar">
    <div style="padding:24px;border-bottom:1px solid var(--glass-border);display:flex;align-items:center;justify-content:space-between">
      <div style="display:flex;align-items:center;gap:12px">
        <div style="width:40px;height:40px;border-radius:12px;background:var(--accent);display:flex;align-items:center;justify-content:center;font-weight:900;font-size:20px;font-style:italic">S</div>
        <div>
          <h1 style="font-weight:900;font-size:20px;margin:0;letter-spacing:-1px">SÜMBÜS</h1>
          <p style="font-size:8px;color:var(--accent);font-family:monospace;letter-spacing:0.2em;margin:0">Recursive Architecture</p>
        </div>
      </div>
      <button onclick="recursiveLoop()" style="padding:8px;background:#1e293b;border:none;border-radius:8px;cursor:pointer">
        <svg class="ic" style="color:#fff"><use href="#i-refresh"/></svg>
      </button>
    </div>

    <div style="display:flex;border-bottom:1px solid var(--glass-border);background:rgba(0,0,0,0.2)">
      <button class="tab-btn active" onclick="showTab('build')">Build</button>
      <button class="tab-btn" onclick="showTab('scan')">Spatial Scan</button>
      <button class="tab-btn" onclick="showTab('code')">Code Editor</button>
    </div>

    <!-- BUILD PANEL -->
    <div id="panel-build" class="panel active">
      <section style="margin-bottom:24px">
        <label style="font-size:10px;font-weight:700;color:var(--text-dim);text-transform:uppercase;letter-spacing:1px;display:block;margin-bottom:12px">Base System</label>
        <div style="background:rgba(255,255,255,0.05);border:1px dashed rgba(255,255,255,0.1);border-radius:12px;padding:16px;text-align:center;position:relative">
          <input type="file" id="base-input" style="position:absolute;inset:0;opacity:0;cursor:pointer" accept=".html">
          <svg class="ic" style="margin:0 auto 8px;color:var(--text-dim)"><use href="#i-file-up"/></svg>
          <p id="base-name" style="font-size:11px;color:var(--text-dim);margin:0">Drag & Drop Base HTML</p>
        </div>
      </section>

      <section>
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px">
          <label style="font-size:10px;font-weight:700;color:var(--text-dim);text-transform:uppercase;letter-spacing:1px">Injection Layers</label>
          <button onclick="addLayer()" style="font-size:10px;font-weight:900;color:var(--accent);background:none;border:none;cursor:pointer">+ ADD LAYER</button>
        </div>
        <div id="layers-list" style="display:flex;flex-direction:column;gap:12px"></div>
      </section>
    </div>

    <!-- SCAN PANEL -->
    <div id="panel-scan" class="panel">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:24px">
        <h2 style="font-size:14px;font-weight:700;margin:0">Collision Analyzer</h2>
        <button onclick="runCollisionScan()" style="padding:6px 12px;background:var(--accent);border:none;border-radius:8px;font-size:10px;font-weight:700;cursor:pointer">RUN SCANNER</button>
      </div>
      <div id="scan-results" style="display:flex;flex-direction:column;gap:12px">
        <div style="text-align:center;padding:80px 0;opacity:0.3">
          <svg class="ic-lg" style="margin:0 auto 16px"><use href="#i-radar"/></svg>
          <p style="font-size:12px;text-transform:uppercase;letter-spacing:1px">Aguardando Análise</p>
        </div>
      </div>
    </div>

    <!-- CODE EDITOR PANEL (Editable) -->
    <div id="panel-code" class="panel" style="padding:0">
      <div id="editor-container">
        <div style="padding: 8px 12px; background: rgba(0,0,0,0.3); border-bottom: 1px solid var(--glass-border); display: flex; justify-content: flex-end;">
          <button onclick="applyCodeChanges()" style="padding: 4px 12px; background: var(--accent); border: none; border-radius: 6px; font-size: 10px; font-weight: 700; color: white; cursor: pointer;">APPLY CHANGES</button>
        </div>
        <textarea id="code-textarea"></textarea>
      </div>
    </div>

    <!-- ACTIONS -->
    <div style="padding:24px;background:#000;border-top:1px solid var(--glass-border);display:flex;flex-direction:column;gap:12px">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
        <button onclick="copyCode()" class="btn"><svg class="ic"><use href="#i-copy"/></svg> COPY</button>
        <button onclick="downloadCode()" class="btn"><svg class="ic"><use href="#i-download"/></svg> DOWNLOAD</button>
      </div>
      <button onclick="toggleDeck()" class="btn primary" style="letter-spacing:1px">EXIT ARCHITECT</button>
    </div>
  </div>

  <!-- PREVIEW AREA -->
  <div class="preview-area" id="preview-area">
    <div class="scan-line"></div>
    <div style="display:flex;align-items:center;justify-content:space-between;padding:0 8px">
      <div style="display:flex;align-items:center;gap:16px">
        <div style="display:flex;gap:6px">
          <div style="width:10px;height:10px;border-radius:50%;background:#ef4444"></div>
          <div style="width:10px;height:10px;border-radius:50%;background:#f59e0b"></div>
          <div style="width:10px;height:10px;border-radius:50%;background:#22c55e"></div>
        </div>
        <span style="font-size:9px;font-family:monospace;color:var(--text-dim);text-transform:uppercase" id="engine-status">SÜMBÜS Core: Idle</span>
      </div>
      <div style="display:flex;background:#0f172a;border-radius:8px;padding:4px;border:1px solid var(--glass-border)">
        <button onclick="resizeFrame('100%')" style="padding:8px;background:none;border:none;cursor:pointer"><svg class="ic" style="width:14px"><use href="#i-monitor"/></svg></button>
        <button onclick="resizeFrame('390px')" style="padding:8px;background:none;border:none;cursor:pointer"><svg class="ic" style="width:14px"><use href="#i-smartphone"/></svg></button>
      </div>
    </div>
    <div style="flex:1;position:relative">
      <iframe id="main-iframe" sandbox="allow-scripts allow-same-origin allow-forms"></iframe>
    </div>
  </div>
</div>

<script>
const Z_LEVELS = { BASE: 0, CONTENT: 100, WIDGET: 500, OVERLAY: 1000, SYSTEM: 5000 };
let state = { baseHtml: '', layers: [], finalHtml: '' };

// DRAG LOGIC
const trigger = document.getElementById('sumbus-trigger');
let isDragging = false, dragStart = { x: 0, y: 0 };
trigger.onpointerdown = (e) => { isDragging = true; dragStart = { x: e.clientX - trigger.offsetLeft, y: e.clientY - trigger.offsetTop }; trigger.setPointerCapture(e.pointerId); };
window.onpointermove = (e) => { if (!isDragging) return; trigger.style.left = \`\${e.clientX - dragStart.x}px\`; trigger.style.top = \`\${e.clientY - dragStart.y}px\`; trigger.style.bottom = 'auto'; };
window.onpointerup = () => { isDragging = false; };
trigger.onclick = (e) => { if (Math.abs(e.clientX - dragStart.x - trigger.offsetLeft) < 5) toggleDeck(); };

function toggleDeck() {
  const deck = document.getElementById('sumbus-deck');
  const isActive = deck.classList.toggle('active');
  if(isActive) updateEngine();
}

function showTab(tab) {
  document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.getElementById(\`panel-\${tab}\`).classList.add('active');
  event.target.classList.add('active');
  if(tab === 'code') document.getElementById('code-textarea').value = state.finalHtml;
}

document.getElementById('base-input').onchange = async (e) => {
  const file = e.target.files[0]; if(!file) return;
  state.baseHtml = await file.text(); document.getElementById('base-name').innerText = file.name; updateEngine();
};

function addLayer() {
  state.layers.push({ id: Date.now(), html: '', target: 'body', name: 'Untitled Layer' }); renderLayers();
}

function renderLayers() {
  const list = document.getElementById('layers-list'); list.innerHTML = '';
  state.layers.forEach(l => {
    const el = document.createElement('div');
    el.style.cssText = 'background:rgba(255,255,255,0.05);border:1px solid var(--glass-border);border-radius:12px;padding:12px;display:flex;flex-direction:column;gap:12px';
    el.innerHTML = \`
      <div style="display:flex;align-items:center;justify-content:space-between">
        <input type="text" value="\${l.name}" onchange="updateLayerProp(\${l.id}, 'name', this.value)"
               style="background:transparent;border:none;color:var(--accent);font-size:11px;font-weight:700">
        <button onclick="removeLayer(\${l.id})" style="background:none;border:none;cursor:pointer"><svg class="ic" style="width:14px;color:#64748b"><use href="#i-x"/></svg></button>
      </div>
      <div style="display:flex;gap:8px">
        <label style="flex:1;background:#0f172a;border:1px solid var(--glass-border);border-radius:8px;padding:6px;text-align:center;font-size:9px;font-weight:700;cursor:pointer">
          LINK HTML <input type="file" class="hidden" accept=".html" onchange="loadLayerFile(\${l.id}, this)" style="display:none">
        </label>
        <input type="text" placeholder="Target CSS" value="\${l.target}" onchange="updateLayerProp(\${l.id}, 'target', this.value)"
               style="flex:1;background:rgba(0,0,0,0.4);border:none;border-radius:8px;padding:0 8px;font-size:10px;font-family:monospace;color:var(--text-dim)">
      </div>\`;
    list.appendChild(el);
  });
}

window.updateLayerProp = (id, prop, val) => { state.layers.find(x => x.id === id)[prop] = val; updateEngine(); };
window.loadLayerFile = async (id, input) => { const file = input.files[0]; if(!file) return; const l = state.layers.find(x => x.id === id); l.html = await file.text(); l.name = file.name.split('.')[0]; renderLayers(); updateEngine(); };
window.removeLayer = (id) => { state.layers = state.layers.filter(x => x.id!== id); renderLayers(); updateEngine(); };

window.recursiveLoop = () => {
  if(!state.finalHtml) return;
  state.baseHtml = state.finalHtml; state.layers = [];
  document.getElementById('base-name').innerText = "LOOP_LAYER_" + Date.now();
  renderLayers(); updateEngine(); showTab('build');
};

function updateEngine() {
  if(!state.baseHtml) return;
  const parser = new DOMParser(); const doc = parser.parseFromString(state.baseHtml, 'text/html');
  const zStyle = doc.createElement('style');
  zStyle.textContent = \`:root { --z-base: \${Z_LEVELS.BASE}; --z-content: \${Z_LEVELS.CONTENT}; --z-widget: \${Z_LEVELS.WIDGET}; --z-overlay: \${Z_LEVELS.OVERLAY}; --z-system: \${Z_LEVELS.SYSTEM}; }\`;
  doc.head.appendChild(zStyle);

  state.layers.forEach(l => {
    if(!l.html) return;
    const lDoc = parser.parseFromString(l.html, 'text/html');
    Array.from(lDoc.querySelectorAll('style, link[rel="stylesheet"]')).forEach(s => doc.head.appendChild(s.cloneNode(true)));
    const target = doc.querySelector(l.target) || doc.body;
    Array.from(lDoc.body.childNodes).forEach(n => target.appendChild(n.cloneNode(true)));
    Array.from(lDoc.querySelectorAll('script')).forEach(s => { const ns = doc.createElement('script'); ns.textContent = s.textContent; doc.body.appendChild(ns); });
  });

  state.finalHtml = doc.documentElement.outerHTML;
  document.getElementById('main-iframe').srcdoc = state.finalHtml;
  document.getElementById('engine-status').innerText = 'Engine: Synchronized';
  document.getElementById('code-textarea').value = state.finalHtml;
}

// Funções do Editor de HTML integrado
window.applyCodeChanges = () => {
  const textareaContent = document.getElementById('code-textarea').value;
  state.baseHtml = textareaContent;
  state.layers = []; // Consolida na base
  state.finalHtml = textareaContent;
  document.getElementById('main-iframe').srcdoc = state.finalHtml;
  document.getElementById('engine-status').innerText = 'Engine: Editor Synced';
};

async function runCollisionScan() {
  const area = document.getElementById('preview-area'); const iframe = document.getElementById('main-iframe');
  area.classList.add('scanning'); document.getElementById('scan-results').innerHTML = '<div style="text-align:center;padding:40px;color:var(--accent)">VARRENDO...</div>';
  await new Promise(r => setTimeout(r, 1200));
  const frameDoc = iframe.contentDocument; const elements = Array.from(frameDoc.querySelectorAll('[id]')).filter(el => frameDoc.defaultView.getComputedStyle(el).position!== 'static');
  const rects = elements.map(el => ({id: el.id, rect: el.getBoundingClientRect(), z: parseInt(frameDoc.defaultView.getComputedStyle(el).zIndex) || 0}));
  const conflicts = [];
  for (let i = 0; i < rects.length; i++) for (let j = i + 1; j < rects.length; j++) {
    const a = rects[i], b = rects[j];
    const overlap =!(a.rect.right < b.rect.left || a.rect.left > b.rect.right || a.rect.bottom < b.rect.top || a.rect.top > b.rect.bottom);
    if(overlap) conflicts.push({a,b,level: a.z === b.z? 'CRITICAL' : 'WARNING'});
  }
  area.classList.remove('scanning'); renderScanResults(conflicts);
}

function renderScanResults(conflicts) {
  const container = document.getElementById('scan-results'); container.innerHTML = '';
  if(conflicts.length === 0) {
    container.innerHTML = '<div style="text-align:center;padding:40px;color:#22c55e;font-weight:700"><svg class="ic" style="margin:0 auto 8px"><use href="#i-check"/></svg>ÁREA LIMPA</div>';
  } else {
    conflicts.forEach(c => {
      const div = document.createElement('div'); div.className = 'conflict-card';
      div.innerHTML = \`<div style="display:flex;justify-content:space-between;margin-bottom:8px">
        <span class="status-badge" style="background:\${c.level==='CRITICAL'?'#ef4444':'#f59e0b'};color:#000">\${c.level}</span></div>
        <p style="font-size:11px;font-weight:700;margin:0">#\${c.a.id} vs #\${c.b.id}</p>\`;
      container.appendChild(div);
    });
  }
}

window.copyCode = async () => { await navigator.clipboard.writeText(state.finalHtml); event.target.innerText = 'COPIED!'; setTimeout(() => event.target.innerHTML = '<svg class="ic"><use href="#i-copy"/></svg> COPY', 1000); };
window.downloadCode = () => { const blob = new Blob([state.finalHtml], {type: 'text/html'}); const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'sumbus-system-final.html'; a.click(); };
window.resizeFrame = (w) => document.getElementById('main-iframe').style.maxWidth = w;
</script>
</body>
</html>`);