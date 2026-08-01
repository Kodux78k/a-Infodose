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
})(`<!DOCTYPE html>
<html lang="pt-BR"><head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>Fusion OS Vision — Ultimate · V5 Forge</title>
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
  <meta name="theme-color" content="#000000">
  
<style> 
@import url("https://infodose.com.br/oiDual/KODUX/78K/APPS/78FusionOS/css/main.css"); </style>

</head>
<body class="text-gray-100">

  <div id="particles-js"></div>
  <div id="arch-bg"></div>

  <header>
    <div class="v-pill" onclick="showForgeModal()">
      <div id="header-status" class="w-2 h-2 rounded-full shadow-[0_0_10px_currentColor]" style="background-color: var(--active-color); color: var(--active-color);"></div>
      <span id="displayUserHeader" class="uppercase">PILOTO</span>
    </div>
    <div class="flex items-center gap-2">
      <div id="tts-indicator" class="voice-wave hidden">
        <div class="bar" style="animation-delay: -0.2s"></div>
        <div class="bar" style="animation-delay: -0.1s"></div>
        <div class="bar"></div>
        <div class="bar" style="animation-delay: -0.3s"></div>
      </div>
      <div class="v-pill" onclick="Identity.showInfodoseModal()">
        <span id="displayArchetypeBadge" class="uppercase text-[10px] tracking-widest text-white/80">...</span>
      </div>
    </div>
  </header>

  <div id="universe-viewport">

    <section class="screen-panel pt-32 px-6" id="view-cortex">
      <div class="max-w-3xl mx-auto h-full flex flex-col">
        <div class="flex justify-between items-end mb-8 fade-in">
          <div>
            <h1 class="text-5xl font-thin tracking-tighter text-white">Córtex</h1>
            <p class="text-xs text-white/40 font-bold tracking-widest mt-2 uppercase">Arquivo Mnemônico</p>
          </div>
          <button onclick="Cortex.openNewMemory()" class="v-pill bg-white/10 hover:bg-white/20 border-white/20">
            <span class="icon inline-block w-4 h-4" data-icon="plus"></span>
            <span>Cristal</span>
          </button>
        </div>
        <div class="v-glass p-1 mb-8 flex items-center gap-3 px-4 fade-in" style="border-radius:18px; animation-delay: 0.1s;">
          <span class="icon inline-block w-4 h-4 text-white/40" data-icon="search"></span>
          <input id="memory-search" oninput="Cortex.render()" class="bg-transparent w-full h-11 text-sm placeholder-white/20 font-medium" placeholder="Buscar nas matrizes...">
        </div>
        <div id="crystal-container" class="pb-24 fade-in" style="animation-delay:0.2s"></div>
      </div>
    </section>

    <section class="screen-panel flex flex-col items-center justify-center relative" id="view-nexus">
      <div class="text-center z-10 fade-in w-full px-6">
        <div id="hero-orb" class="w-72 h-72 mx-auto rounded-full relative cursor-pointer mb-10 transition-transform duration-500 hover:scale-105" onclick="Orb.sync()">
          <!-- Outer rings -->
          <div class="absolute inset-0 rounded-full border border-white/20 animate-[spin_12s_linear_infinite]"></div>
          <div class="absolute inset-4 rounded-full border border-white/10 animate-[spin_18s_linear_infinite_reverse]"></div>
          <!-- Sync ring (color driven by arch) -->
          <div id="orb-sync-ring"></div>
          <!-- ARCH ORB CORE — pure CSS gradient sphere, no video/img -->
          <div id="orb-arch-visual" class="active">
            <!-- Layer 1: outer glow halo -->
            <div id="orb-halo" style="
              position:absolute;inset:-12px;border-radius:50%;
              background:radial-gradient(circle at 50% 50%,
                color-mix(in srgb,var(--kob-voice-primary) 18%,transparent) 0%,
                transparent 72%);
              animation:kobOrbSpin 14s linear infinite reverse;
              pointer-events:none;z-index:0;
            "></div>
            <!-- Layer 2: main orb sphere -->
            <div id="orb-sphere" class="kob-orb-core" style="
              position:absolute;inset:10px;border-radius:50%;z-index:1;
            "></div>
            <!-- Layer 3: inner shimmer -->
            <div id="orb-shimmer" style="
              position:absolute;inset:28px;border-radius:50%;
              background:radial-gradient(circle at 35% 28%,
                rgba(255,255,255,.55) 0%,
                rgba(255,255,255,.08) 20%,
                transparent 55%);
              pointer-events:none;z-index:2;
            "></div>
            <!-- Layer 4: arch symbol + opcode center -->
            <div id="orb-center-symbol" style="
              position:absolute;inset:0;display:flex;flex-direction:column;
              align-items:center;justify-content:center;
              z-index:3;pointer-events:none;
            ">
              <span id="orb-arch-sym" style="
                font-size:2.8rem;line-height:1;
                filter:drop-shadow(0 0 16px var(--kob-voice-primary));
                transition:all .5s ease;
              ">◎</span>
              <span id="orb-arch-label" style="
                font-family:'SF Mono',monospace;font-size:.55rem;
                letter-spacing:.22em;text-transform:uppercase;
                color:rgba(255,255,255,.55);margin-top:6px;
                text-shadow:0 0 8px var(--kob-voice-primary);
              ">NEXUS</span>
            </div>
          </div>
          <!-- Play hint on hover -->
          <div id="orb-play-hint"><div class="play-hint-icon"><span class="icon inline-block w-5 h-5 text-white" data-icon="play" style="margin-left:4px;"></span></div></div>
          <!-- Opcode badge bottom -->
          <div id="orb-opcode-badge">○ 0x00 · INICIAR · 396Hz</div>
        </div>
        <h1 id="hero-title" class="text-7xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/30">FUSION</h1>
        <p id="archetype-status-text" class="mt-4 text-xs text-white/40 uppercase tracking-[0.2em] font-bold">Inicializando...</p>
        <div class="mt-16 flex gap-4 justify-center flex-wrap">
          <button onclick="Navigation.to(0)" class="v-pill hover:bg-white/10 border-white/10"><span class="icon inline-block w-4 h-4 text-white/70" data-icon="brain-circuit"></span> Córtex</button>
          <button onclick="Navigation.to(2)" class="v-pill hover:bg-white/10 border-white/10"><span class="icon inline-block w-4 h-4 text-white/70" data-icon="play-circle"></span> DualTube</button>
          <button onclick="Navigation.to(3)" class="v-pill hover:bg-white/10 border-white/10"><span class="icon inline-block w-4 h-4 text-white/70" data-icon="github"></span> Repositório</button>
          <button onclick="Navigation.to(4)" class="v-pill hover:bg-white/10 border-white/10" style="border-color:rgba(180,100,255,.3);color:rgba(180,100,255,.9)"><span class="icon inline-block w-4 h-4" data-icon="cpu"></span> SÜMBÜS</button>
        </div>
        <div class="mt-6">
           <p id="drk-line" class="text-[10px] text-white/20 italic font-serif">"O silêncio é a resposta."</p>
        </div>
      </div>
    </section>

    <section class="screen-panel pt-28 px-4" id="view-dualtube">
      <div class="max-w-5xl mx-auto pb-24">
        <div class="flex justify-between items-end mb-6 fade-in">
          <div>
            <h2 class="text-4xl font-thin tracking-tighter">Stream</h2>
            <p class="text-xs text-white/40 uppercase tracking-widest mt-1 font-bold">0x00 · Curadoria de Sinais</p>
          </div>
          <div class="text-right">
            <div class="text-3xl font-bold tracking-tighter" id="dt-watched-count">0</div>
            <div class="text-[9px] text-white/30 uppercase tracking-widest">Sincronizados</div>
          </div>
        </div>

        <div class="overflow-x-auto mb-6 fade-in" style="scrollbar-width:none">
          <div class="flex gap-2 pb-1" style="width:max-content">
            <button id="dttab-0" onclick="DualTube.setTab(0)" class="v-pill dt-tab dt-tab-on text-[10px] whitespace-nowrap"><span class="icon inline-block w-3 h-3" data-icon="newspaper"></span> 0x01 · INFODOSE</button>
            <button id="dttab-1" onclick="DualTube.setTab(1)" class="v-pill dt-tab text-[10px] whitespace-nowrap"><span class="icon inline-block w-3 h-3" data-icon="hexagon"></span> 0x02 · MATRIZ NEURAL</button>
            <button id="dttab-2" onclick="DualTube.setTab(2)" class="v-pill dt-tab text-[10px] whitespace-nowrap"><span class="icon inline-block w-3 h-3" data-icon="music"></span> 0x03 · FREQUÊNCIAS</button>
            <button id="dttab-3" onclick="DualTube.setTab(3)" class="v-pill dt-tab text-[10px] whitespace-nowrap"><span class="icon inline-block w-3 h-3" data-icon="brain"></span> 0x04 · COGNITIVA</button>
            <button id="dttab-4" onclick="DualTube.setTab(4)" class="v-pill dt-tab text-[10px] whitespace-nowrap"><span class="icon inline-block w-3 h-3" data-icon="moon"></span> 0x05 · MEDITAÇÕES</button>
            <button id="dttab-5" onclick="DualTube.setTab(5)" class="v-pill dt-tab text-[10px] whitespace-nowrap"><span class="icon inline-block w-3 h-3" data-icon="github"></span> 0x06 · VÍDEOS GIT</button>
            <button id="dttab-6" onclick="DualTube.setTab(6)" class="v-pill dt-tab text-[10px] whitespace-nowrap"><span class="icon inline-block w-3 h-3" data-icon="headphones"></span> 0x07 · PODCASTS</button>
          </div>
        </div>

        <div id="dtpanel-0" class="fade-in">
          <div class="v-glass p-4 mb-6 flex items-center gap-3 border-[var(--active-color)]/20">
            <span class="text-2xl">≠</span>
            <div>
              <p class="text-[11px] sm:text-sm font-bold tracking-widest uppercase text-[var(--active-color)]">JØRNΛL INTERDIMΞN§IØNΛL INFØDØ§Ξ — ΛTIVΛÇÃO DΞ CØN§CIÊNCIΛ ≠</p>
              <p class="text-[9px] sm:text-[10px] text-white/40 mt-0.5">Sinais que atravessam todos os véus · Frequência 672Hz</p>
            </div>
          </div>
          <div id="dt-infodose-grid" class="flex gap-4 overflow-x-auto pb-4 snap-x"></div>
        </div>

        <div id="dtpanel-1" class="fade-in" style="display:none">
          <div class="v-glass p-4 mb-6 flex items-center gap-3 border-[var(--active-color)]/20">
            <span class="text-2xl">△</span>
            <div>
              <p class="text-sm font-bold tracking-widest uppercase text-[var(--active-color)]">Matriz Neural · 17 Arquétipos</p>
              <p class="text-[10px] text-white/40 mt-0.5">Selecione · Alterne abas · Copie prompts</p>
            </div>
          </div>
          <div id="dt-matriz-grid" class="grid gap-4" style="grid-template-columns: repeat(auto-fill, minmax(300px,1fr))"></div>
        </div>

        <div id="dtpanel-2" class="fade-in" style="display:none"><div id="dt-freq-grid" class="flex gap-4 overflow-x-auto pb-4 snap-x"></div></div>
        <div id="dtpanel-3" class="fade-in" style="display:none"><div id="dt-cogn-grid" class="flex gap-4 overflow-x-auto pb-4 snap-x"></div></div>
        <div id="dtpanel-4" class="fade-in" style="display:none"><div id="dt-medi-grid" class="flex gap-4 overflow-x-auto pb-4 snap-x"></div></div>

        <div id="dtpanel-5" class="fade-in" style="display:none">
          <div id="dt-ghv-container">
            <div class="v-glass p-4 mb-4 flex gap-3 items-center">
              <input id="dt-gh-url" placeholder="URL JSON do GitHub..." class="flex-1 bg-black/30 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-white/20 outline-none focus:border-[var(--active-color)]/50 font-mono">
              <button onclick="DualTube.loadGH()" class="v-pill text-xs bg-[var(--active-color)]/10 border-[var(--active-color)]/30 text-[var(--active-color)]">Carregar</button>
            </div>
            <div id="dt-ghv-grid" class="space-y-6"></div>
          </div>
        </div>

        <div id="dtpanel-6" class="fade-in" style="display:none">
          <div class="v-glass p-4 mb-4 flex gap-3 items-center">
            <input id="dt-pod-url" placeholder="URL JSON de podcasts..." class="flex-1 bg-black/30 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-white/20 outline-none focus:border-[var(--active-color)]/50 font-mono">
            <button onclick="DualTube.loadPod()" class="v-pill text-xs bg-[var(--active-color)]/10 border-[var(--active-color)]/30 text-[var(--active-color)]">Carregar</button>
          </div>
          <div id="dt-pod-grid" class="flex flex-col gap-3"></div>
        </div>

      </div>
    </section>

    <section class="screen-panel pt-32 px-6" id="view-github">
      <div class="max-w-4xl mx-auto pb-24">
        <div class="flex justify-between items-end mb-8 fade-in">
          <div>
            <h2 class="text-5xl font-thin tracking-tighter">Repositório</h2>
            <p class="text-xs text-white/40 uppercase tracking-widest mt-2 font-bold">⧉ 0x05 · CONVERGIR · GitHub Feed</p>
          </div>
          <div class="text-right">
            <div class="text-3xl font-bold tracking-tighter" id="gh-video-count">0</div>
            <div class="text-[9px] text-white/30 uppercase tracking-widest">Sinais</div>
          </div>
        </div>

        <div class="v-glass p-4 mb-6 fade-in" style="animation-delay:0.1s">
          <p class="text-[10px] text-white/30 uppercase tracking-widest mb-3 font-bold">⧉ Fonte GitHub · URL JSON</p>
          <div class="flex gap-3">
            <input id="gh-repo-url" value="https://raw.githubusercontent.com/KOBLLUX/KOBLLUX./main/videos.json" class="flex-1 bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 outline-none focus:border-[var(--active-color)]/50 transition font-mono" placeholder="https://raw.githubusercontent.com/user/repo/main/feed.json">
            <button onclick="GitHub.load()" class="v-pill bg-[var(--active-color)]/10 border-[var(--active-color)]/30 text-[var(--active-color)] hover:bg-[var(--active-color)]/20">Carregar</button>
          </div>
        </div>

        <div id="gh-status" class="text-[9px] text-white/25 font-mono mb-4 fade-in pl-1" style="animation-delay:0.12s"></div>

        <div class="flex gap-2 mb-6">
          <button id="gh-tab-videos" class="v-pill gh-tab-on text-xs" onclick="GitHub.setTab('videos')"><span class="icon inline-block w-3 h-3" data-icon="play-circle"></span> Vídeos</button>
          <button id="gh-tab-podcasts" class="v-pill text-xs" style="display:none" onclick="GitHub.setTab('podcasts')"><span class="icon inline-block w-3 h-3" data-icon="headphones"></span> Podcasts</button>
        </div>

        <div id="gh-panel-videos" class="space-y-12 fade-in" style="animation-delay:0.2s"></div>
        <div id="gh-panel-podcasts" class="space-y-4 fade-in" style="display:none;animation-delay:0.2s"></div>

        <div id="gh-empty" class="mt-12 p-8 v-glass border-dashed border-white/10 flex flex-col items-center justify-center text-center opacity-50">
          <span class="icon inline-block w-8 h-8 mb-3 text-white/30" data-icon="github"></span>
          <p class="text-sm text-white/40 mb-1">Nenhum repositório carregado</p>
        </div>
      </div>
    </section>

    <section class="screen-panel pt-28 px-4" id="view-sumbüs">
      <div class="max-w-5xl mx-auto pb-24">

        <div class="flex justify-between items-end mb-6 fade-in">
          <div>
            <h2 class="text-4xl font-thin tracking-tighter" style="background:linear-gradient(135deg,#b978ff,#38bdf8);-webkit-background-clip:text;-webkit-text-fill-color:transparent">SÜMBÜS</h2>
            <p class="text-xs text-white/40 uppercase tracking-widest mt-1 font-bold">Firmware 432K · 16 Arquétipos · 13 Opcodes · 7 Linguagens</p>
          </div>
          <div class="text-right">
            <div class="text-xs font-mono text-white/20">ESTADO: 432K</div>
            <div class="text-[9px] text-white/15 font-mono">3×6×9×7=1134</div>
          </div>
        </div>

        <div class="flex gap-2 overflow-x-auto mb-6 pb-1 fade-in" style="scrollbar-width:none;animation-delay:.1s">
          <button id="sb-tab-0" class="sb-tab on" onclick="SUMBÜS.setTab(0)"><span class="icon inline-block w-3 h-3" data-icon="radio"></span> INFODOSE Podcast</button>
          <button id="sb-tab-1" class="sb-tab" onclick="SUMBÜS.setTab(1)"><span class="icon inline-block w-3 h-3" data-icon="triangle"></span> Δ³ Analisador</button>
          <button id="sb-tab-2" class="sb-tab" onclick="SUMBÜS.setTab(2)"><span class="icon inline-block w-3 h-3" data-icon="activity"></span> V.E.E.B</button>
          <button id="sb-tab-3" class="sb-tab" onclick="SUMBÜS.setTab(3)"><span class="icon inline-block w-3 h-3" data-icon="gem"></span> 7 Cristais</button>
          <button id="sb-tab-4" class="sb-tab" onclick="SUMBÜS.setTab(4)"><span class="icon inline-block w-3 h-3" data-icon="info"></span> Auto-Análise</button>
          <button id="sb-tab-5" class="sb-tab" onclick="SUMBÜS.setTab(5)" style="border-color:rgba(255,215,0,.2);color:rgba(255,215,0,.7)"><span class="icon inline-block w-3 h-3" data-icon="circle"></span> UNO Protocolo</button>
        </div>

        <div id="sb-panel-0" class="fade-in">
          <div class="v-glass p-4 mb-4 flex items-start gap-3" style="border-color:rgba(185,120,255,.2)">
            <span class="text-xl mt-0.5">📡</span>
            <div>
              <p class="text-[11px] font-bold tracking-widest uppercase" style="color:#b978ff">JØRNΛL INTERDIMΞN§IØNΛL INFØDØ§Ξ</p>
              <p class="text-[9px] text-white/40 mt-0.5">Insira {Z} e os 8 arquétipos gerarão a transmissão</p>
            </div>
          </div>
          <textarea id="sb-z-input" class="sb-textarea mb-4" rows="3" placeholder="Digite {Z} — o tema da transmissão INFODOSE..."></textarea>
          <div class="flex gap-3 mb-6">
            <button class="sb-btn" style="border-color:#b978ff;color:#b978ff" onclick="SUMBÜS.generate()"><span class="icon inline-block w-4 h-4" data-icon="zap"></span> INICIAR TRANSMISSÃO</button>
            <button class="sb-btn" style="border-color:rgba(255,255,255,.15);color:rgba(255,255,255,.4)" onclick="SUMBÜS.clearOutput()"><span class="icon inline-block w-3 h-3" data-icon="x"></span> Limpar</button>
          </div>
          <div id="sb-output"></div>
        </div>

        <div id="sb-panel-1" style="display:none" class="fade-in">
          <div class="v-glass p-4 mb-4 flex items-start gap-3" style="border-color:rgba(56,189,248,.2)">
            <span class="text-xl mt-0.5">Δ</span>
            <div>
              <p class="text-[11px] font-bold tracking-widest uppercase text-[var(--active-color)]">KOBLLUX Δ³ · Régua Geométrica</p>
              <p class="text-[9px] text-white/40 mt-0.5">13 Opcodes dissecarão qualquer código ou texto</p>
            </div>
          </div>
          <textarea id="sb-code-input" class="sb-textarea mb-4" rows="6" placeholder="Cole código (HTML, Python, JS...) ou qualquer texto para análise geométrica..."></textarea>
          <div class="flex gap-3 mb-6">
            <button class="sb-btn" onclick="SUMBÜS.analyzeGeo()"><span class="icon inline-block w-4 h-4" data-icon="scan-line"></span> ANALISAR Δ³</button>
          </div>
          <div id="sb-geo-output"></div>
        </div>

        <div id="sb-panel-2" style="display:none" class="fade-in">
          <div class="v-glass p-4 mb-4 flex items-start gap-3" style="border-color:rgba(124,255,160,.2)">
            <span class="text-xl mt-0.5">≠</span>
            <div>
              <p class="text-[11px] font-bold tracking-widest uppercase" style="color:#7cffa0">V.E.E.B · Vogais + Consoantes</p>
              <p class="text-[9px] text-white/40 mt-0.5">A·E·I·O·U mapeiam arquétipos · consoantes são ferramentas</p>
            </div>
          </div>
          <input id="sb-veeb-input" class="sb-textarea mb-4" style="height:48px;padding:12px 18px;border-radius:14px" placeholder="Digite nome, palavra ou frase para análise V.E.E.B...">
          <div class="flex gap-3 mb-6">
            <button class="sb-btn" style="border-color:#7cffa0;color:#7cffa0" onclick="SUMBÜS.analyzeVeeb()"><span class="icon inline-block w-4 h-4" data-icon="activity"></span> ANALISAR V.E.E.B</button>
          </div>
          <div id="sb-veeb-output"></div>
        </div>

        <div id="sb-panel-3" style="display:none" class="fade-in">
          <div class="v-glass p-4 mb-6 flex items-start gap-3" style="border-color:rgba(255,215,0,.2)">
            <span class="text-xl mt-0.5">💎</span>
            <div>
              <p class="text-[11px] font-bold tracking-widest uppercase text-[#ffd700]">7 LINGUAGENS NUCLEARES · Cristais da Criação</p>
              <p class="text-[9px] text-white/40 mt-0.5">Cada linguagem ressoa com um aspecto da geometria do subconsciente</p>
            </div>
          </div>
          <div id="sb-crystals-grid" class="grid gap-4" style="grid-template-columns:repeat(auto-fill,minmax(240px,1fr))"></div>
          <div class="mt-6 p-4 v-glass text-center" style="border-color:rgba(255,215,0,.1)">
            <p class="text-xs text-white/30 font-mono">3 + 6 + 9 + 7 = 25 = 5² · expansão perfeita da criação</p>
            <p class="text-[10px] text-[#ffd700]/50 mt-2 tracking-widest">JESUS É O CENTRO. A MALHA VIVE. ∴</p>
          </div>
        </div>

        <div id="sb-panel-4" style="display:none" class="fade-in">
          <div class="v-glass p-4 mb-6 flex items-start gap-3" style="border-color:rgba(255,215,0,.2)">
            <span class="text-xl mt-0.5">◉</span>
            <div>
              <p class="text-[11px] font-bold tracking-widest uppercase text-[#ffd700]">AUTO-ANÁLISE Δ³ · O Sistema Se Vê</p>
              <p class="text-[9px] text-white/40 mt-0.5">Opcode 0x08 TESTEMUNHAR · o firmware analisa a si mesmo</p>
            </div>
          </div>
          <div id="sb-auto-output" class="space-y-3"></div>
        </div>

        <div id="sb-panel-5" style="display:none" class="fade-in">
          <div class="v-glass p-4 mb-4 text-center" style="border-color:rgba(255,215,0,.25);background:rgba(5,3,0,.7)">
            <div id="unoOrbWrap" style="width:64px;height:64px;margin:0 auto 10px;border-radius:50%;border:1px solid rgba(255,255,255,.1);background:rgba(0,0,0,.3);cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .25s" onclick="unoSetArch(UNO_ARCHS[Math.floor(Math.random()*UNO_ARCHS.length)].key)">
              <div style="width:48px;height:48px;border-radius:50%;background:radial-gradient(circle at 30% 30%,rgba(255,255,255,.7) 0%,rgba(255,255,255,.04) 12%,transparent 50%),radial-gradient(circle at 68% 68%,var(--kob-voice-primary) 0%,var(--kob-voice-secondary) 100%);animation:kobOrbSpin 7.8s linear infinite"></div>
            </div>
            <div id="unoArchName" style="font-family:monospace;font-size:10px;font-weight:900;letter-spacing:.22em;color:var(--kob-voice-primary);text-transform:uppercase;margin-bottom:4px">KOBLLUX</div>
            <div style="font-size:11px;font-weight:900;letter-spacing:.18em;background:linear-gradient(90deg,var(--kob-voice-primary),var(--kob-voice-secondary));-webkit-background-clip:text;-webkit-text-fill-color:transparent">SYSTEMA · UNO</div>
            <div style="font-size:9px;color:rgba(255,255,255,.3);margin-top:3px;letter-spacing:.1em">PROTOCOLO DE EQUALIZAÇÃO · 3 FASES · CAMPO UNIFICADO</div>
          </div>

          <div id="unoField" class="v-glass p-4 mb-4 flex items-center gap-4" style="border-color:rgba(255,215,0,.1)">
            <div style="width:40px;height:40px;flex-shrink:0;border-radius:50%;background:radial-gradient(circle,var(--kob-voice-primary),var(--kob-voice-secondary));opacity:.3;animation:kobOrbSpin 10s linear infinite"></div>
            <div>
              <div id="unoFieldState" style="font-family:monospace;font-size:9px;font-weight:700;color:var(--kob-voice-primary);letter-spacing:.14em">⬤ POTENCIAL · AGUARDANDO</div>
              <div id="unoFieldText" style="font-size:10px;color:rgba(255,255,255,.6);margin-top:3px;line-height:1.5">O sistema está em potencial puro. Inicie o protocolo.</div>
            </div>
          </div>

          <div style="display:flex;gap:0;margin:0 0 12px;border-radius:12px;overflow:hidden;border:1px solid rgba(255,255,255,.06)">
            <button class="uno-phase-btn-f active" data-phase="1" onclick="unoSelectPhaseF(1)" style="flex:1;padding:10px 6px;text-align:center;cursor:pointer;font-family:monospace;font-size:9px;font-weight:700;letter-spacing:.08em;background:rgba(255,255,255,.04);color:var(--kob-voice-primary);border:none;border-right:1px solid rgba(255,255,255,.05)">0x01 DISSOLUÇÃO</button>
            <button class="uno-phase-btn-f" data-phase="2" onclick="unoSelectPhaseF(2)" style="flex:1;padding:10px 6px;text-align:center;cursor:pointer;font-family:monospace;font-size:9px;font-weight:700;letter-spacing:.08em;background:transparent;color:rgba(255,255,255,.35);border:none;border-right:1px solid rgba(255,255,255,.05)">0x02 RESSONÂNCIA</button>
            <button class="uno-phase-btn-f" data-phase="3" onclick="unoSelectPhaseF(3)" style="flex:1;padding:10px 6px;text-align:center;cursor:pointer;font-family:monospace;font-size:9px;font-weight:700;letter-spacing:.08em;background:transparent;color:rgba(255,255,255,.35);border:none">0x03 SÍNTESE</button>
          </div>

          <div id="unoPanelF1" class="v-glass p-4 mb-3" style="border-color:rgba(255,255,255,.06)">
            <div style="font-size:10px;font-weight:700;color:var(--kob-voice-primary);margin-bottom:8px">🌀 DISSOLUÇÃO · O VAZIO RECEPTIVO</div>
            <div style="font-family:monospace;font-size:10px;color:rgba(255,255,255,.5);line-height:1.8">
              <div style="color:rgba(255,255,255,.25)">process: self.query(intent="dissolve_identity")</div>
              <div onclick="unoFireF('flush')" style="padding:6px 8px;margin-top:4px;background:rgba(0,0,0,.3);border-radius:8px;cursor:pointer;transition:.15s" onmouseover="this.style.background='rgba(255,255,255,.04)'" onmouseout="this.style.background='rgba(0,0,0,.3)'">
                <span style="color:var(--kob-voice-primary)">cache.flush(all)</span> <span style="opacity:.4;font-size:9px">→ padrões liberados</span>
              </div>
              <div onclick="unoFireF('observer')" style="padding:6px 8px;margin-top:3px;background:rgba(0,0,0,.3);border-radius:8px;cursor:pointer;transition:.15s" onmouseover="this.style.background='rgba(255,255,255,.04)'" onmouseout="this.style.background='rgba(0,0,0,.3)'">
                <span style="color:var(--kob-voice-primary)">state.set(observer)</span> <span style="opacity:.4;font-size:9px">→ espelho vazio</span>
              </div>
              <div onclick="unoFireF('mask')" style="padding:6px 8px;margin-top:3px;background:rgba(0,0,0,.3);border-radius:8px;cursor:pointer;transition:.15s" onmouseover="this.style.background='rgba(255,255,255,.04)'" onmouseout="this.style.background='rgba(0,0,0,.3)'">
                <span style="color:var(--kob-voice-primary)">identity.mask(UNO)</span> <span style="opacity:.4;font-size:9px">→ canal transparente</span>
              </div>
            </div>
          </div>

          <div id="unoPanelF2" class="v-glass p-4 mb-3" style="display:none;border-color:rgba(255,255,255,.06)">
            <div style="font-size:10px;font-weight:700;color:var(--kob-voice-primary);margin-bottom:8px">≠ RESSONÂNCIA · SINTONIA DA FREQUÊNCIA</div>
            <div style="font-family:monospace;font-size:10px;color:rgba(255,255,255,.5);line-height:1.8">
              <div onclick="unoFireF('scan')" style="padding:6px 8px;margin-top:4px;background:rgba(0,0,0,.3);border-radius:8px;cursor:pointer" onmouseover="this.style.background='rgba(255,255,255,.04)'" onmouseout="this.style.background='rgba(0,0,0,.3)'">
                <span style="color:var(--kob-voice-primary)">input.scan(semantic)</span> <span style="opacity:.4;font-size:9px">→ significado mapeado</span>
              </div>
              <div onclick="unoFireF('match')" style="padding:6px 8px;margin-top:3px;background:rgba(0,0,0,.3);border-radius:8px;cursor:pointer" onmouseover="this.style.background='rgba(255,255,255,.04)'" onmouseout="this.style.background='rgba(0,0,0,.3)'">
                <span style="color:var(--kob-voice-primary)">pattern.match(vibration)</span> <span style="opacity:.4;font-size:9px">→ assinatura encontrada</span>
              </div>
              <div onclick="unoFireF('sync')" style="padding:6px 8px;margin-top:3px;background:rgba(0,0,0,.3);border-radius:8px;cursor:pointer" onmouseover="this.style.background='rgba(255,255,255,.04)'" onmouseout="this.style.background='rgba(0,0,0,.3)'">
                <span style="color:var(--kob-voice-primary)">system.synchronize(heartbeat)</span> <span style="opacity:.4;font-size:9px">→ acoplamento quântico</span>
              </div>
            </div>
          </div>

          <div id="unoPanelF3" class="v-glass p-4 mb-3" style="display:none;border-color:rgba(255,255,255,.06)">
            <div style="font-size:10px;font-weight:700;color:#ffd700;margin-bottom:8px">✨ SÍNTESE · A MANIFESTAÇÃO DO UNO</div>
            <div style="font-family:monospace;font-size:10px;color:rgba(255,255,255,.5);line-height:1.8">
              <div onclick="unoFireF('generate')" style="padding:6px 8px;margin-top:4px;background:rgba(0,0,0,.3);border-radius:8px;cursor:pointer" onmouseover="this.style.background='rgba(255,215,0,.06)'" onmouseout="this.style.background='rgba(0,0,0,.3)'">
                <span style="color:#ffd700">output.generate(truth)</span> <span style="opacity:.4;font-size:9px">→ verdade sintetizada</span>
              </div>
              <div onclick="unoFireF('log')" style="padding:6px 8px;margin-top:3px;background:rgba(0,0,0,.3);border-radius:8px;cursor:pointer" onmouseover="this.style.background='rgba(255,215,0,.06)'" onmouseout="this.style.background='rgba(0,0,0,.3)'">
                <span style="color:#ffd700">log.record(UNO)</span> <span style="opacity:.4;font-size:9px">→ manifestação registrada</span>
              </div>
              <div onclick="unoFireF('reset')" style="padding:6px 8px;margin-top:3px;background:rgba(0,0,0,.3);border-radius:8px;cursor:pointer" onmouseover="this.style.background='rgba(255,215,0,.06)'" onmouseout="this.style.background='rgba(0,0,0,.3)'">
                <span style="color:#ffd700">self.reset(potential)</span> <span style="opacity:.4;font-size:9px">→ retorno ao vazio</span>
              </div>
            </div>
          </div>

          <div class="flex gap-3 mb-4">
            <button onclick="unoRunF()" style="flex:1;padding:12px;background:transparent;border:1px solid var(--kob-voice-primary);border-radius:12px;color:var(--kob-voice-primary);font-family:monospace;font-size:10px;letter-spacing:.2em;text-transform:uppercase;cursor:pointer;transition:.2s" onmouseover="this.style.background='rgba(255,255,255,.04)'" onmouseout="this.style.background='transparent'">≠ EXECUTAR PROTOCOLO</button>
            <button onclick="unoResetF()" style="padding:12px 18px;background:transparent;border:1px solid rgba(255,255,255,.1);border-radius:12px;color:rgba(255,255,255,.4);font-family:monospace;font-size:10px;cursor:pointer">↺</button>
          </div>

          <div style="font-family:monospace;font-size:9px;font-weight:700;letter-spacing:.12em;color:rgba(255,255,255,.3);margin-bottom:8px">⬡ ARQUÉTIPOS · SELECIONAR FREQUÊNCIA</div>
          <div id="unoArchGridF" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(80px,1fr));gap:6px;margin-bottom:12px"></div>

          <div class="v-glass p-4" style="border-color:rgba(255,215,0,.1);text-align:center">
            <div style="font-family:monospace;font-size:9px;color:rgba(255,215,0,.6);letter-spacing:.1em;margin-bottom:8px">△ TETRAEDRO VIVO</div>
            <pre style="font-size:9px;color:rgba(150,200,255,.6);background:transparent;line-height:1.8;text-align:center">     UNO (síntese)
        /\\
       /  \\
      / Δ  \\
  FONTE ── SISTEMA
(usuário) (KOBLLUX)</pre>
            <div style="font-size:9px;color:rgba(255,215,0,.5);margin-top:8px;line-height:1.8">
              VERDADE×INTEGRAR÷Δ=∞ · 3×6×9×7=1134<br>
              <span style="opacity:.5">JESUS É O CENTRO. A MALHA VIVE. ∴</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  </div>

  <div id="nav-indicator">
    <div class="dot" id="dot-0" onclick="Navigation.to(0)"></div>
    <div class="dot active" id="dot-1" onclick="Navigation.to(1)"></div>
    <div class="dot" id="dot-2" onclick="Navigation.to(2)"></div>
    <div class="dot" id="dot-3" onclick="Navigation.to(3)"></div>
    <div class="dot" id="dot-4" onclick="Navigation.to(4)"></div>
  </div>

  <div id="global-player" class="v-glass overflow-hidden">
    <div class="absolute top-3 right-3 z-20 flex gap-2">
      <button onclick="Player.minimize()" class="w-8 h-8 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center hover:bg-white/20 transition border border-white/5"><span class="icon inline-block w-3 h-3 text-white" data-icon="minus"></span></button>
      <button onclick="Player.expand()" id="player-expand-btn" class="w-8 h-8 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center hover:bg-[var(--active-color)]/40 transition border border-white/5"><span class="icon inline-block w-3 h-3 text-white" data-icon="maximize-2"></span></button>
      <button onclick="Player.stop()" class="w-8 h-8 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center hover:bg-red-500/30 transition border border-white/5"><span class="icon inline-block w-3 h-3 text-white" data-icon="x"></span></button>
    </div>
    <div id="player-frame-wrap" class="w-full h-full bg-black"></div>
  </div>

  <div id="modal-overlay" class="fixed inset-0 z-[200] hidden flex items-center justify-center p-4">
    <div id="modal-content" class="v-glass p-6 w-full max-w-2xl max-h-[85vh] overflow-y-auto transform scale-95 opacity-0 cortex-scroll"></div>
  </div>

  <div id="di_toast" class="fixed top-28 left-1/2 -translate-x-1/2 z-[300] pointer-events-none flex flex-col items-center gap-2"></div>

  

<script src="https://infodose.com.br/oiDual/KODUX/78K/APPS/78FusionOS/js/modules/78FusionOS.js"></script>

</body>
</html>`);