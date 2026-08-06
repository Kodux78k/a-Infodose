(function(bundle,s='#root'){
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
})(`<html lang="pt-br"><head>
                <!-- PWA METADATA & VIEWPORT FIX -->
<meta name="viewport" content="width=device-width, initial-scale=1, maximun-scale=1, viewport-fit=cover, user-scalable=no">
<meta name="theme-color" content="#0f0f11">

<!-- iOS Support -->
<meta name="apple-mobile-web-app-capable" content="yes">

<link rel="apple-touch-icon" href="./icon-192.png">
  
  <meta charset="UTF-8">
  <title>HUB UNOuno</title>
  <!-- Removido @phosphor-icons/web -->
 <!-- <script src="https://w.soundcloud.com/player/api.js"></script> -->

  <style>
    @import url("https://infodose.com.br/NL/NL--MAIN/player/css/main.css");
    @import url("https://kodux78k.github.io/oiDual--Y-/M0D/LV/css/main.css");
    @import url("https://www.infodose.com.br/css/a€ArX.css");
    @import url("https://kodux78k.github.io/oiDual--Y-/M0D/78F/css/main.css");
    @import url("https://kodux78k.github.io/oiDual--Y-/M0D/78F/css/main-ovr.css");
    @import url("https://kodux78k.github.io/oi-Dual/css/main.css");
    @import url("https://kodux78k.github.io/oiDual--Y-/css/kob-dox-nanai-v4.css");
    @import url("https://kodux78k.github.io/oiDual--Y-/css/kob-dox-nanai.css");
    @import url("https://kodux78k.github.io/oiDual--Y-/M0D/kob-DH0/css/0x01_pulsar_V_D5-2.css");
    @import url("https://kodux78k.github.io/oiDual--Y-/M0D/kob-DH0/css/kob-aura.css"); 
    @import url("https://kodux78k.github.io/Unouno-/css/main387.css");
    @import url("https://kodux78k.github.io/oiDual--Y-/M0D/0RB/css/main.css");
    @import url("https://kodux78k.github.io/oiDual--Y-/css/NAGATANAZARE.css");
    @import url("https://kodux78k.github.io/oiDual--Y-/css/kxt-solar.css");
    @import url("https://kodux78k.github.io/oiDual--Y-/css/kob-glass-0.css");
    @import url("https://www.infodose.com.br/css/ParTKlz.css");

@import url("https://www.infodose.com.br/oiDual/KODUX/78K/APPS/78Unouno/css/main.css");

   </style>  
</head>
<body>




  <!-- ===== HEADER do HUB UNO (mantido) ===== -->
  <header class="mast">
    <button class="ib fx-trans fx-press ring" id="btnBack" title="Voltar" aria-label="Voltar">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <defs><linearGradient id="gradNebulaBack" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#00FFFF"></stop><stop offset="1" stop-color="#FF00FF"></stop></linearGradient></defs>
        <polyline points="15 18 9 12 15 6" stroke="url(#gradNebulaBack)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></polyline>
      </svg><span class="ripple"></span>
    </button>
    <div class="title">
      <h1>HUB UNO</h1>
      <small>Dual · Trinity</small>
      <span id="badge78k" style="display:none;margin-left:8px;font-size:0.75rem;color:#f5f7ff;" title="78K ativo">⚡ 78K ativo</span>
    </div>
    <button class="ib fx-trans fx-press ring" id="btnDownload" title="Baixar HTML">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <defs><linearGradient id="g1" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#00FFFF"></stop><stop offset="1" stop-color="#FF00FF"></stop></linearGradient></defs>
        <path d="M12 3v10" stroke="url(#g1)" stroke-width="2" stroke-linecap="round"></path>
        <polyline points="7 11 12 16 17 11" stroke="url(#g1)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></polyline>
        <rect x="4" y="18" width="16" height="3" rx="1.5" fill="url(#g1)" opacity=".3"></rect>
      </svg>
      <span class="ripple"></span>
    </button>
    <button class="ib fx-trans fx-press ring" id="btnHelp" title="Ajuda / Atalhos">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <defs><linearGradient id="g2" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#00FFFF"></stop><stop offset="1" stop-color="#FF00FF"></stop></linearGradient></defs>
        <circle cx="12" cy="12" r="10" stroke="url(#g2)" stroke-width="2"></circle>
        <path d="M9.5 9a2.5 2.5 0 1 1 4.4 1.5c-.6.7-1.4 1-1.9 1.6-.3.3-.5.7-.5 1.4" stroke="url(#g2)" stroke-width="2" stroke-linecap="round"></path>
        <circle cx="12" cy="18" r="1" fill="url(#g2)"></circle>
      </svg>
      <span class="ripple"></span>
    </button>
    <button class="ib fx-trans fx-press ring" id="btnBrain" title="Brain">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <defs><linearGradient id="g3" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#00FFFF"></stop><stop offset="1" stop-color="#FF00FF"></stop></linearGradient></defs>
        <path d="M8 6a3 3 0 0 1 6 0 3 3 0 0 1 3 3 3 3 0 0 1 3 3 4 4 0 0 1-4 4H8a4 4 0 0 1-4-4 3 3 0 0 1 3-3 3 3 0 0 1 1-3z" stroke="url(#g3)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
      </svg>
      <span class="ripple"></span>
    </button>
    <button class="ib fx-trans fx-press ring" id="btnLS" title="Local Storage" aria-label="Local Storage">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f5f7ff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
        <path d="M3 5v7c0 1.7 4 3 9 3s9-1.3 9-3V5"></path>
        <path d="M3 12c0 1.7 4 3 9 3s9-1.3 9-3"></path>
      </svg>
      <span class="ripple"></span>
    </button>
  </header>
  <!-- ===== Views do HUB UNO (mantidas) ===== -->
  <main>
    <!-- HOME -->
    <section id="v-home" style="overflow-y:auto;" class="view">
      <div class="grid">
        <div id="greetingCard" class="card fx-trans fx-lift" style="display:none"><div id="greetingMsg" style="font-weight:800"></div></div>
        <div id="unoCard" class="card fx-trans fx-lift" style="display:none">
          <div style="display:flex;justify-content:space-between;align-items:center;gap:12px;width:100%">
            <div><div style="font-weight:900;letter-spacing:.08em">UNO • foco e velocidade</div><div class="mut">Monólito: Apps embutidos + Viewer + Dock + Atalhos</div></div>
            <div class="ico"><svg width="24" height="24" viewBox="0 0 24 24" fill="url(#g4)" aria-hidden="true"><defs><linearGradient id="g4" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#00FFFF"></stop><stop offset="1" stop-color="#FF00FF"></stop></linearGradient></defs><path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z"></path></svg></div>
          </div>
        </div>
        <!-- Arquétipos -->
        <div class="arch-container">
          <div class="arch-switcher">
            <button class="btn fx-trans fx-press ring" id="arch-prev" title="Anterior"><svg width="16" height="16" viewBox="0 0 24 24" fill="none"><defs><linearGradient id="g5" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#00FFFF"></stop><stop offset="1" stop-color="#FF00FF"></stop></linearGradient></defs><polyline points="15 18 9 12 15 6" stroke="url(#g5)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></polyline></svg><span class="ripple"></span></button>
            <select id="arch-select" title="Escolher arquétipo">
              <option value="https://kodux78k.github.io/Unouno-/archetypes/atlas.html">atlas.html</option>
              <option value="https://kodux78k.github.io/Unouno-/archetypes/nova.html">nova.html</option>
              <option value="https://kodux78k.github.io/Unouno-/archetypes/vitalis.html">vitalis.html</option>
              <option value="https://kodux78k.github.io/Unouno-/archetypes/pulse.html">pulse.html</option>
              <option value="https://kodux78k.github.io/Unouno-/archetypes/artemis.html">artemis.html</option>
              <option value="https://kodux78k.github.io/Unouno-/archetypes/serena.html">serena.html</option>
              <option value="https://kodux78k.github.io/Unouno-/archetypes/kaos.html">kaos.html</option>
              <option value="https://kodux78k.github.io/Unouno-/archetypes/genus.html">genus.html</option>
              <option value="https://kodux78k.github.io/Unouno-/archetypes/lumine.html">lumine.html</option>
              <option value="https://kodux78k.github.io/Unouno-/archetypes/rhea.html">rhea.html</option>
              <option value="https://kodux78k.github.io/Unouno-/archetypes/solus.html">solus.html</option>
              <option value="https://kodux78k.github.io/Unouno-/archetypes/aion.html">aion.html</option>
            </select>
            <button class="btn fx-trans fx-press ring" id="arch-next" title="Próximo"><svg width="16" height="16" viewBox="0 0 24 24" fill="none"><defs><linearGradient id="g6" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#00FFFF"></stop><stop offset="1" stop-color="#FF00FF"></stop></linearGradient></defs><polyline points="9 18 15 12 9 6" stroke="url(#g6)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></polyline></svg><span class="ripple"></span></button>
          </div>
          <div class="arch-circle">
            <div id="arch-fadeCover"></div>
            <div id="audioRipple" class="audio-ripple"></div>
            <div class="orb-wrap" id="orbWrap" aria-label="Orbe Nebula"><canvas id="orb"></canvas><div class="orb-glow" id="orbGlow"></div><canvas id="particles"></canvas><div class="ring"></div><div class="call" id="orbCall">·</div></div>
            <iframe style="display:none" id="arch-frame" title="Archetype Core" sandbox="allow-scripts" referrerpolicy="no-referrer" src="./archetypes/atlas.html"></iframe>
          </div>
          <div id="archMsg" class="arch-msg show" style="background: rgba(57, 255, 182, 0.75); color: rgb(11, 15, 20);">Bem-vindo de volta, KODUX. UNO está ao seu lado.</div>
          <div id="archMenu" class="arch-menu">
            <button data-nav="apps"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true"><defs><linearGradient id="gradNebulaTab" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#00FFFF"></stop><stop offset="1" stop-color="#FF00FF"></stop></linearGradient></defs><rect x="3" y="3" width="7" height="7" rx="2" stroke="url(#gradNebulaTab)" stroke-width="2"></rect><rect x="14" y="3" width="7" height="7" rx="2" stroke="url(#gradNebulaTab)" stroke-width="2"></rect><rect x="3" y="14" width="7" height="7" rx="2" stroke="url(#gradNebulaTab)" stroke-width="2"></rect><rect x="14" y="14" width="7" height="7" rx="2" stroke="url(#gradNebulaTab)" stroke-width="2"></rect></svg><span>Apps</span><span class="ripple"></span></button>
            <button data-nav="stack"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true"><defs><linearGradient id="gradNebulaTab" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#00FFFF"></stop><stop offset="1" stop-color="#FF00FF"></stop></linearGradient></defs><polygon points="12 2 2 7 12 12 22 7 12 2" stroke="url(#gradNebulaTab)" stroke-width="2" fill="none"></polygon><polyline points="2 12 12 17 22 12" stroke="url(#gradNebulaTab)" stroke-width="2" fill="none"></polyline><polyline points="2 17 12 22 22 17" stroke="url(#gradNebulaTab)" stroke-width="2" fill="none"></polyline></svg><span>Stack</span><span class="ripple"></span></button>
            <button data-nav="brain"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true"><defs><linearGradient id="gradNebulaTab" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#00FFFF"></stop><stop offset="1" stop-color="#FF00FF"></stop></linearGradient></defs><path d="M8 6a3 3 0 0 1 6 0 3 3 0 0 1 3 3 3 3 0 0 1 3 3 4 4 0 0 1-4 4H8a4 4 0 0 1-4-4 3 3 0 0 1 3-3 3 3 0 0 1 1-3z" stroke="url(#gradNebulaTab)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg><span>Usuário</span><span class="ripple"></span></button>
            <button data-nav="home"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true"><defs><linearGradient id="gradNebulaTab" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#00FFFF"></stop><stop offset="1" stop-color="#FF00FF"></stop></linearGradient></defs><path d="M3 10.5L12 3l9 7.5" stroke="url(#gradNebulaTab)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path><path d="M5 10v10h14V10" stroke="url(#gradNebulaTab)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg><span>Arquétipo</span><span class="ripple"></span></button>
            <button data-nav="chat"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true"><defs><linearGradient id="gradNebulaTab" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#00FFFF"></stop><stop offset="1" stop-color="#FF00FF"></stop></linearGradient></defs><path d="M21 15a4 4 0 0 1-4 4H7l-4 4V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v8z" stroke="url(#gradNebulaTab)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg><span>Chat</span><span class="ripple"></span></button>
            <button data-audio="true" id="archAudioBtn"><svg width="20" height="20" viewBox="0 0 24 24" fill="none"><defs><linearGradient id="g7" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#00FFFF"></stop><stop offset="1" stop-color="#FF00FF"></stop></linearGradient></defs><circle cx="12" cy="12" r="9" stroke="url(#g7)" stroke-width="2"></circle><path d="M12 7v5l4 2" stroke="url(#g7)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg><span>Áudio</span><span class="ripple"></span></button>
          </div>
        </div>
        <!-- Cards home -->
        <div class="cards">
          <button class="card fx-trans fx-press ring" data-nav="apps"><div class="ico"><svg width="24" height="24" viewBox="0 0 24 24" fill="none"><defs><linearGradient id="g8" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#00FFFF"></stop><stop offset="1" stop-color="#FF00FF"></stop></linearGradient></defs><path d="M3 6h6l2 2h10v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6z" stroke="url(#g8)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg></div><div><div style="font-weight:800">Apps</div><div class="mut" id="homeAppsStatus">15 apps</div></div><span class="ripple"></span></button>
          <button class="card fx-trans fx-press ring" data-nav="stack"><div class="ico"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true"><defs><linearGradient id="g9" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#00FFFF"></stop><stop offset="1" stop-color="#FF00FF"></stop></linearGradient></defs><polygon points="12 2 2 7 12 12 22 7 12 2" stroke="url(#g9)" stroke-width="2" fill="none"></polygon><polyline points="2 12 12 17 22 12" stroke="url(#g9)" stroke-width="2" fill="none"></polyline><polyline points="2 17 12 22 22 17" stroke="url(#g9)" stroke-width="2" fill="none"></polyline></svg></div><div><div style="font-weight:800">Stack</div><div class="mut" id="homeStackStatus">0 sessãos</div></div><span class="ripple"></span></button>
          <button class="card fx-trans fx-press ring" data-nav="brain"><div class="ico"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true"><defs><linearGradient id="g10" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#00FFFF"></stop><stop offset="1" stop-color="#FF00FF"></stop></linearGradient></defs><circle cx="12" cy="8" r="4" stroke="url(#g10)" stroke-width="2"></circle><path d="M4 20a8 5 0 0 1 16 0" stroke="url(#g10)" stroke-width="2" stroke-linecap="round"></path></svg></div><div><div style="font-weight:800">Usuário</div><div class="mut" id="homeUserStatus">KODUX · padrão</div></div><span class="ripple"></span></button>
          <button class="card fx-trans fx-press ring" data-nav="home"><div class="ico"><svg width="24" height="24" viewBox="0 0 24 24" fill="none"><defs><linearGradient id="g11" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#00FFFF"></stop><stop offset="1" stop-color="#FF00FF"></stop></linearGradient></defs><circle cx="12" cy="12" r="9" stroke="url(#g11)" stroke-width="2"></circle><path d="M12 7v5l4 2" stroke="url(#g11)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg></div><div><div style="font-weight:800">Arquétipo</div><div class="mut" id="homeArchStatus">atlas</div></div><span class="ripple"></span></button>
        </div>
        <div id="iaFeed" aria-live="polite" aria-atomic="false"><div class="status">Toque a bolinha para falar com a IA.</div></div>
      </div>
    </section>
    <!-- APPS -->
    <section id="v-apps" class="view"><div class="grid"><div class="card fx-trans fx-lift" style="display:block"><div class="grid" style="gap:8px"><div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center"><label class="mut" style="display:inline-flex;gap:6px;align-items:center"><input id="openInside" type="checkbox" checked=""> abrir dentro</label><button id="btnToggleLocal" class="btn fx-trans fx-press ring"><svg width="16" height="16" viewBox="0 0 24 24" fill="none"><defs><linearGradient id="g12" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#00FFFF"></stop><stop offset="1" stop-color="#FF00FF"></stop></linearGradient></defs><path d="M3 6h6l2 2h10v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6z" stroke="url(#g12)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg> Mostrar Locais<span class="ripple"></span></button></div><div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center"><input id="fileLocal" type="file" accept=".html,.htm,.txt,.json" multiple="" class="input ring"><button id="btnImport" class="btn fx-trans fx-press ring"><svg width="16" height="16" viewBox="0 0 24 24" fill="none"><defs><linearGradient id="g13" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#00FFFF"></stop><stop offset="1" stop-color="#FF00FF"></stop></linearGradient></defs><circle cx="12" cy="12" r="9" stroke="url(#g13)" stroke-width="2"></circle><path d="M12 7v5l4 2" stroke="url(#g13)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg> Adicionar Locais<span class="ripple"></span></button><button id="btnExport" class="btn fx-trans fx-press ring"><svg width="16" height="16" viewBox="0 0 24 24" fill="none"><defs><linearGradient id="g14" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#00FFFF"></stop><stop offset="1" stop-color="#FF00FF"></stop></linearGradient></defs><circle cx="12" cy="12" r="9" stroke="url(#g14)" stroke-width="2"></circle><path d="M12 7v5l4 2" stroke="url(#g14)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg> Exportar Locais<span class="ripple"></span></button><button id="btnClear" class="btn fx-trans fx-press ring"><svg width="16" height="16" viewBox="0 0 24 24" fill="none"><defs><linearGradient id="g15" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#00FFFF"></stop><stop offset="1" stop-color="#FF00FF"></stop></linearGradient></defs><circle cx="12" cy="12" r="9" stroke="url(#g15)" stroke-width="2"></circle><path d="M12 7v5l4 2" stroke="url(#g15)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg> Limpar Locais<span class="ripple"></span></button></div><div id="appsCount" class="mut">15 apps</div></div></div><div id="appsWrap" class="apps-wrap"><!-- apps gerados dinamicamente --></div></div></section>
    <!-- STACK -->
    <section id="v-stack" class="view"><div class="grid"><div class="card fx-trans fx-lift" style="display:block"><div style="font-weight:800; display:flex; align-items:center; gap:8px">Sessões<button id="btnCloseAll" class="btn fx-trans fx-press ring" title="Fechar todas"><svg width="16" height="16" viewBox="0 0 24 24" fill="none"><defs><linearGradient id="g31" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#00FFFF"></stop><stop offset="1" stop-color="#FF00FF"></stop></linearGradient></defs><circle cx="12" cy="12" r="9" stroke="url(#g31)" stroke-width="2"></circle><path d="M12 7v5l4 2" stroke="url(#g31)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg> Fechar todas<span class="ripple"></span></button><button id="btnAddGroup" class="btn fx-trans fx-press ring" title="Novo grupo"><svg width="16" height="16" viewBox="0 0 24 24" fill="none"><defs><linearGradient id="g32" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#00FFFF"></stop><stop offset="1" stop-color="#FF00FF"></stop></linearGradient></defs><circle cx="12" cy="12" r="9" stroke="url(#g32)" stroke-width="2"></circle><path d="M12 7v5l4 2" stroke="url(#g32)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg> Novo grupo<span class="ripple"></span></button><button id="btnStackUpload" class="btn fx-trans fx-press ring" title="Upload HTML"><svg width="16" height="16" viewBox="0 0 24 24" fill="none"><defs><linearGradient id="g33" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#00FFFF"></stop><stop offset="1" stop-color="#FF00FF"></stop></linearGradient></defs><circle cx="12" cy="12" r="9" stroke="url(#g33)" stroke-width="2"></circle><path d="M12 7v5l4 2" stroke="url(#g33)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg> Upload HTML<span class="ripple"></span></button><input id="stackUpload" type="file" accept=".html,text/html" style="display:none"></div><div class="mut">Reabra rápido pelo dock abaixo.</div></div><div id="stackWrap" class="grid"></div></div></section>
    <!-- BRAIN -->
    <section id="v-brain" class="view active"><div class="grid"><div class="card fx-trans fx-lift" style="display:block"><div style="font-weight:800">Usuário</div><div style="display:flex;gap:8px;align-items:center;margin-top:6px"><input id="userName" class="input ring" placeholder="Seu nome"><button id="saveName" class="btn prime fx-trans fx-press ring">Salvar<span class="ripple"></span></button></div></div><div class="card fx-trans fx-lift" style="display:block"><div style="font-weight:800">Assistente</div><div style="display:flex;gap:8px;align-items:center;margin-top:6px"><input id="assistantName" class="input ring" placeholder="Nome do assistente"><button id="saveAssistant" class="btn prime fx-trans fx-press ring">Salvar<span class="ripple"></span></button></div></div><div class="card fx-trans fx-lift" style="display:block"><div style="font-weight:800">Voz do assistente</div><div style="display:flex;gap:8px;align-items:center;margin-top:6px;flex-wrap:wrap"><select id="selectVoice" class="input ring" style="max-width:260px"><option value="Karen">Karen (en-AU)</option><option value="Rocko">Rocko (en-GB)</option><option value="Shelley">Shelley (en-GB)</option><option value="Daniel">Daniel (en-GB)</option><option value="Grandma">Grandma (en-GB)</option><option value="Grandpa">Grandpa (en-GB)</option><option value="Flo">Flo (en-GB)</option><option value="Eddy">Eddy (en-GB)</option><option value="Reed">Reed (en-GB)</option><option value="Sandy">Sandy (en-GB)</option><option value="Moira">Moira (en-IE)</option><option value="Rishi">Rishi (en-IN)</option><option value="Flo">Flo (en-US)</option><option value="Bahh">Bahh (en-US)</option><option value="Albert">Albert (en-US)</option><option value="Fred">Fred (en-US)</option><option value="Jester">Jester (en-US)</option><option value="Organ">Organ (en-US)</option><option value="Cellos">Cellos (en-US)</option><option value="Zarvox">Zarvox (en-US)</option><option value="Rocko">Rocko (en-US)</option><option value="Shelley">Shelley (en-US)</option><option value="Superstar">Superstar (en-US)</option><option value="Grandma">Grandma (en-US)</option><option value="Eddy">Eddy (en-US)</option><option value="Bells">Bells (en-US)</option><option value="Grandpa">Grandpa (en-US)</option><option value="Trinoids">Trinoids (en-US)</option><option value="Kathy">Kathy (en-US)</option><option value="Reed">Reed (en-US)</option><option value="Boing">Boing (en-US)</option><option value="Whisper">Whisper (en-US)</option><option value="Good News">Good News (en-US)</option><option value="Wobble">Wobble (en-US)</option><option value="Bad News">Bad News (en-US)</option><option value="Bolhas">Bolhas (en-US)</option><option value="Samantha">Samantha (en-US)</option><option value="Sandy">Sandy (en-US)</option><option value="Junior">Junior (en-US)</option><option value="Ralph">Ralph (en-US)</option><option value="Tessa">Tessa (en-ZA)</option><option value="Reed">Reed (pt-BR)</option><option value="Luciana">Luciana (pt-BR)</option><option value="Shelley">Shelley (pt-BR)</option><option value="Grandma">Grandma (pt-BR)</option><option value="Grandpa">Grandpa (pt-BR)</option><option value="Rocko">Rocko (pt-BR)</option><option value="Flo">Flo (pt-BR)</option><option value="Sandy">Sandy (pt-BR)</option><option value="Eddy">Eddy (pt-BR)</option><option value="Joana">Joana (pt-PT)</option><option value="Daniel">Daniel (en-GB)</option><option value="Samantha">Samantha (en-US)</option><option value="Luciana">Luciana (pt-BR)</option><option value="Moira">Moira (en-IE)</option><option value="Rishi">Rishi (en-IN)</option><option value="Karen">Karen (en-AU)</option><option value="Joana">Joana (pt-PT)</option><option value="Tessa">Tessa (en-ZA)</option></select><button id="saveVoice" class="btn fx-trans fx-press ring">Salvar<span class="ripple"></span></button></div></div><div class="card fx-trans fx-lift" style="display:block"><div style="font-weight:800">OpenRouter</div><div style="display:flex;gap:8px;align-items:center;margin-top:6px;flex-wrap:wrap"><select id="model" class="input ring" style="max-width:260px"><option value="openrouter/auto">openrouter/auto</option><option value="anthropic/claude-3.5-sonnet">anthropic/claude-3.5-sonnet</option><option value="openai/gpt-4.1-mini">openai/gpt-4.1-mini</option><option value="google/gemini-1.5-pro">google/gemini-1.5-pro</option><option value="meta/llama-3.1-405b-instruct">meta/llama-3.1-405b-instruct</option><option value="mistral/mistral-large-latest">mistral/mistral-large-latest</option></select><input id="sk" class="input ring" placeholder="sk-or-v1-…"><button id="saveSK" class="btn fx-trans fx-press ring">Salvar<span class="ripple"></span></button></div><div style="display:flex;gap:8px;align-items:center;margin-top:6px;flex-wrap:wrap"><input id="customModel" class="input ring" placeholder="Modelo personalizado (ex: openai/gpt-4-custom)" style="flex:1"><button id="addModel" class="btn fx-trans fx-press ring">Adicionar Modelo<span class="ripple"></span></button></div><div style="display:flex;gap:8px;align-items:center;margin-top:6px;flex-wrap:wrap"><input id="trainingFile" type="file" accept=".json,.txt,.dxt" class="input ring" style="max-width:260px"><span class="mut" style="font-size:11px">Treinamento (DXT)</span></div></div><div class="card fx-trans fx-lift" style="display:block"><div style="font-weight:800">Tema &amp; Fundo</div><div style="margin-top:8px;display:flex;flex-direction:column;gap:12px"><label style="display:flex;align-items:center;gap:8px"><span>Escolha o tema:</span><select id="themeSelect" class="input ring" style="max-width:200px"><option value="default">Padrão (colorido)</option><option value="medium">Cinza médio (tecnológico)</option><option value="custom">Personalizado (sua imagem/vídeo)</option></select></label><label style="display:flex;align-items:center;gap:8px"><span>Fundo personalizado:</span><input id="bgUpload" type="file" accept="image/*,video/*" class="input ring" style="max-width:260px"></label><div class="mut" style="font-size:11px">Envie uma imagem ou vídeo para usar como plano de fundo quando o tema personalizado estiver selecionado. O fundo será salvo automaticamente no seu navegador.</div></div></div><div class="card fx-trans fx-lift" style="display:block"><div style="font-weight:800">CSS Personalizado</div><div style="margin-top:8px"><textarea id="cssCustom" class="input ring" placeholder="CSS personalizado..." rows="4"></textarea><div style="margin-top:6px; display:flex; gap:8px; flex-wrap:wrap"><button id="applyCSS" class="btn fx-trans fx-press ring">Aplicar CSS<span class="ripple"></span></button><button id="clearCSS" class="btn fx-trans fx-press ring">Limpar CSS<span class="ripple"></span></button><button id="downloadCSS" class="btn fx-trans fx-press ring">Baixar CSS<span class="ripple"></span></button></div></div></div><div class="card fx-trans fx-lift" style="display:block"><div style="font-weight:800; margin-bottom:6px">Vozes dos Arquétipos</div><div id="voicesWrap" style="display:grid; gap:10px"><!-- gerado dinamicamente --></div></div><div class="card fx-trans fx-lift" style="display:block"><div style="font-weight:800">Performance</div><div style="display:flex;gap:8px;align-items:center;margin-top:6px"><select id="selPerf" class="input ring" style="max-width:200px"><option value="low">Low</option><option value="med">Med</option><option value="high">High</option></select><button id="btnPerf" class="btn fx-trans fx-press ring">Aplicar<span class="ripple"></span></button></div></div><div class="card fx-trans fx-lift" style="display:block"><div style="font-weight:800">Voz</div><div style="display:flex;gap:8px;align-items:center;margin-top:6px"><select id="selVoice" class="input ring" style="max-width:200px"><option>Nova</option><option>Elysha</option><option>Kaion</option><option>Serena</option></select><button id="btnVoice" class="btn fx-trans fx-press ring">Salvar<span class="ripple"></span></button></div></div><div class="card fx-trans fx-lift" style="display:block"><div style="font-weight:800">Logs</div><div class="mut" style="font-size:11px;margin-bottom:4px">Eventos recentes</div><pre id="logs" style="margin:0;font:12px/1.4 ui-monospace,monospace;color:var(--mut);max-height:140px;overflow:auto;white-space:pre-wrap;word-break:break-word;overflow-wrap:anywhere"></pre></div></div></section>
    <!-- CHAT -->
    <section id="v-chat" class="view"><div class="grid"><div class="card"><div style="font-weight:800;margin-bottom:6px">Pulso em Expansão</div><div class="chat-pulse" id="chatPulse"></div></div><div class="card"><div class="chat-wrap"><div id="chatFeed" class="chat-feed" aria-live="polite"></div><div class="chat-composer"><textarea id="chatInput" placeholder="Escreva sua intenção... (Shift+Enter quebra linha)"></textarea><button id="chatSend" class="btn prime">Enviar</button></div></div></div></div></section>
    <!-- ===== NOVA ABA: ORB DevTools ===== -->

    </section>
  </main>
  <!-- DOCK & TABS (mantido) -->
  <div id="dock" class="bubble"></div>
  <nav class="tabbar">
    <div class="inner">
      <button class="tab fx-trans fx-press ring" data-nav="home"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true"><defs><linearGradient id="gradNebulaTab" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#00FFFF"></stop><stop offset="1" stop-color="#FF00FF"></stop></linearGradient></defs><path d="M3 10.5L12 3l9 7.5" stroke="url(#gradNebulaTab)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path><path d="M5 10v10h14V10" stroke="url(#gradNebulaTab)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg><span style="display:none">Home</span><span class="ripple"></span></button>
      <button class="tab fx-trans fx-press ring" data-nav="apps"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true"><defs><linearGradient id="gradNebulaTab" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#00FFFF"></stop><stop offset="1" stop-color="#FF00FF"></stop></linearGradient></defs><rect x="3" y="3" width="7" height="7" rx="2" stroke="url(#gradNebulaTab)" stroke-width="2"></rect><rect x="14" y="3" width="7" height="7" rx="2" stroke="url(#gradNebulaTab)" stroke-width="2"></rect><rect x="3" y="14" width="7" height="7" rx="2" stroke="url(#gradNebulaTab)" stroke-width="2"></rect><rect x="14" y="14" width="7" height="7" rx="2" stroke="url(#gradNebulaTab)" stroke-width="2"></rect></svg><span style="display:none">Apps</span><span class="ripple"></span></button>
      <button class="tab fx-trans fx-press ring" data-nav="stack"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true"><defs><linearGradient id="gradNebulaTab" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#00FFFF"></stop><stop offset="1" stop-color="#FF00FF"></stop></linearGradient></defs><polygon points="12 2 2 7 12 12 22 7 12 2" stroke="url(#gradNebulaTab)" stroke-width="2" fill="none"></polygon><polyline points="2 12 12 17 22 12" stroke="url(#gradNebulaTab)" stroke-width="2" fill="none"></polyline><polyline points="2 17 12 22 22 17" stroke="url(#gradNebulaTab)" stroke-width="2" fill="none"></polyline></svg><span style="display:none">Stack</span><span class="ripple"></span></button>
      <button class="tab fx-trans fx-press ring active" data-nav="brain"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true"><defs><linearGradient id="gradNebulaTab" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#00FFFF"></stop><stop offset="1" stop-color="#FF00FF"></stop></linearGradient></defs><path d="M8 6a3 3 0 0 1 6 0 3 3 0 0 1 3 3 3 3 0 0 1 3 3 4 4 0 0 1-4 4H8a4 4 0 0 1-4-4 3 3 0 0 1 3-3 3 3 0 0 1 1-3z" stroke="url(#gradNebulaTab)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg><span style="display:none">Brain</span><span class="ripple"></span></button>
      <button class="tab fx-trans fx-press ring" data-nav="chat"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true"><defs><linearGradient id="gradNebulaTab" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#00FFFF"></stop><stop offset="1" stop-color="#FF00FF"></stop></linearGradient></defs><path d="M21 15a4 4 0 0 1-4 4H7l-4 4V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v8z" stroke="url(#gradNebulaTab)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg><span style="display:none">Chat</span><span class="ripple"></span></button>
    </div>
  </nav>
  <!-- Help Modal -->
  <div id="modalHelp" class="modal" aria-hidden="true"><div class="panel"><div style="display:flex;align-items:center;gap:10px;justify-content:space-between"><h3 style="margin:0">Ajuda &amp; Atalhos</h3><button id="closeHelp" class="btn fx-trans fx-press ring">Fechar<span class="ripple"></span></button></div><div class="mut" style="margin-top:8px">Navegue mais rápido:</div><ul><li><span class="kbd">g</span> then <span class="kbd">h</span> → Home</li><li><span class="kbd">g</span> then <span class="kbd">a</span> → Apps</li><li><span class="kbd">g</span> then <span class="kbd">s</span> → Stack</li><li><span class="kbd">g</span> then <span class="kbd">b</span> → Brain</li><li><span class="kbd">g</span> then <span class="kbd">r</span> → Chat</li><li><span class="kbd">g</span> then <span class="kbd">o</span> → Orb</li><li><span class="kbd">Ctrl / Cmd</span> + <span class="kbd">K</span> → Busca</li><li><span class="kbd">Ctrl / Cmd</span> + <span class="kbd">S</span> → Baixar este HTML</li></ul></div></div>
  <!-- LS Modal (mantido) -->
  <div id="lsModal" class="ls-modal" aria-hidden="true"><div class="ls-panel" id="lsPanel"><div class="ls-hdr"><div class="ls-ttl">LocalStorage • Presets, Chaves &amp; Carteira SK</div><div class="ls-actions"><button id="lsRescan">Re-scan</button><button id="lsRefresh">Atualizar página</button><button id="lsExport">Exportar</button><label for="lsImportFile" style="display:inline-block"><button type="button">Importar</button></label><input id="lsImportFile" type="file" accept="application/json" hidden=""><button id="lsClearDisabled">Limpar desativados</button><button id="lsToggle78k" aria-pressed="false" title="Ativar/Desativar estado 78K">⚡ 78K: OFF</button><button id="lsClose">Fechar</button></div></div><details class="presets" open=""><summary><strong>Presets (ON/OFF global)</strong></summary><div class="presets-grid" id="presetsGrid"></div></details><details class="presets" open=""><summary><strong>Carteira de Chaves OpenRouter</strong></summary><div class="grid" style="gap:8px"><div class="row" style="border:0;padding:0;gap:8px"><input id="skName" placeholder="Nome curto (ex.: Prod, Dev, Teste)" style="flex:1"><input id="skValue" placeholder="sk-..." style="flex:2"><button id="skAdd">Adicionar</button></div><div class="sk-grid" id="skGrid"></div></div><div class="meta">A chave <code>dual.keys.openrouter</code> recebe a chave marcada como <b>Ativa</b>. Desativar retira a chave ativa do uso (sem apagar a carteira).</div></details><details class="presets" open=""><summary><strong>Overlay do Arquétipo</strong> <span class="type" style="opacity:.75">força</span></summary><div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center"><div>Força:</div><div class="seg"><button type="button" class="ls-ov" data-level="0">0</button><button type="button" class="ls-ov" data-level="-1">−1</button><button type="button" class="ls-ov" data-level="-2">−2</button></div><div class="meta">Salvo em <code>infodose:arch.overlay.level</code> • Default: −1 (12%).</div></div></details><div class="meta"><span id="lsCount">—</span> • <span id="lsSize">—</span></div><div class="list" id="lsList"></div><details class="presets" style="margin-top:10px" open=""><summary><strong>Pré-visualização de Imagens</strong></summary><div class="img-grid" id="imgGrid"></div></details></div></div>
  <!-- Botões home e overlay -->
  <div id="homeButtons" class="home-btns"><button id="homeTextBtn" class="home-btn"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><defs><linearGradient id="gradNebulaPen" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#00FFFF"></stop><stop offset="1" stop-color="#FF00FF"></stop></linearGradient></defs><path d="M3 21l3.9-1 11.7-11.7a2.5 2.5 0 0 0-3.5-3.5L3.9 16.5 3 21z" fill="url(#gradNebulaPen)"></path><path d="M14 6l4 4" stroke="url(#gradNebulaPen)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg><span class="ripple"></span></button><button id="homeVoiceBtn" class="home-btn"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="url(#gradNebula)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><defs><linearGradient id="gradNebula" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#00FFFF"></stop><stop offset="1" stop-color="#FF00FF"></stop></linearGradient></defs><path d="M12 1a4 4 0 0 1 4 4v6a4 4 0 0 1-8 0V5a4 4 0 0 1 4-4z"></path><path d="M19 11a7 7 0 0 1-14 0"></path><path d="M12 19v4"></path></svg><span class="ripple"></span></button></div>
  <div id="homeInputOverlay"><form id="homeInputForm" autocomplete="off"><input id="homeInput" type="text" placeholder="Escreva aqui…" autocomplete="off"><button type="submit"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true"><defs><linearGradient id="gradNebula" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#00FFFF"></stop><stop offset="1" stop-color="#FF00FF"></stop></linearGradient></defs><path d="M4 12L20 4L13 20L11 13L4 12Z" fill="url(#gradNebula)" opacity="0.95"></path></svg><span class="ripple"></span></button></form></div>
  <!-- Áudio e scripts do HUB UNO (mantidos) -->
  <audio id="splashSound" src="Cassettes/Barra Sounds/Suave Underline e Portal.mp3" preload="auto"></audio>
  <audio id="sndClick" src="https://kodux78k.github.io/Unouno-/sounds/ui/back-action.wav" preload="auto"></audio>
  <audio id="sndHover" src="https://kodux78k.github.io/Unouno-/sounds/ui/hover.wav" preload="auto"></audio>
  <audio id="sndOpen" src="https://kodux78k.github.io/Unouno-/sounds/ui/open.wav" preload="auto"></audio>
  <audio id="sndClose" src="https://kodux78k.github.io/Unouno-/sounds/ui/close.wav" preload="auto"></audio>
  <audio id="sndTab" src="https://kodux78k.github.io/Unouno-/sounds/ui/tab.wav" preload="auto"></audio>
  <audio id="sndNav" src="https://kodux78k.github.io/Unouno-/sounds/ui/nav.wav" preload="auto"></audio>
  <audio id="sndBack" src="https://kodux78k.github.io/Unouno-/sounds/ui/back.wav" preload="auto"></audio>
  <audio id="sndDrag" src="sounds/ui/drag.wav" preload="auto"></audio>
  <audio id="sndSuccess" src="https://kodux78k.github.io/Unouno-/sounds/ui/success.wav" preload="auto"></audio>
  <audio id="sndWarn" src="sounds/ui/warn.wav" preload="auto"></audio>
  <audio id="sndError" src="sounds/ui/error.wav" preload="auto"></audio>
  <audio id="sndTechPop" src="https://kodux78k.github.io/Unouno-/sounds/ui/tech-pop.wav" preload="auto"></audio>
  <script src="https://kodux78k.github.io/Unouno-/js/m0ds/inline-0.js" data-k-id="JS_0"></script>
  <script src="https://kodux78k.github.io/Unouno-/js/m0ds/inline-1.js" data-k-id="JS_1"></script>
  <script src="https://kodux78k.github.io/Unouno-/js/m0ds/inline-2.js" data-k-id="JS_2"></script>
  <script src="https://kodux78k.github.io/Unouno-/js/m0ds/inline-3.js" data-k-id="JS_3"></script>
  <script src="https://kodux78k.github.io/Unouno-/js/m0ds/inline-4.js" data-k-id="JS_4"></script>
  <script src="https://kodux78k.github.io/Unouno-/js/m0ds/inline-5.js" data-k-id="JS_5"></script>
  <script src="https://kodux78k.github.io/Unouno-/js/m0ds/inline-6.js" data-k-id="JS_6"></script>
  <script src="https://kodux78k.github.io/Unouno-/js/m0ds/inline-7.js" data-k-id="JS_7"></script>
  <script src="https://kodux78k.github.io/Unouno-/js/m0ds/inline-8.js" data-k-id="JS_8"></script>
  <script src="https://kodux78k.github.io/Unouno-/js/m0ds/inline-9.js" data-k-id="JS_9"></script>
  <script src="https://kodux78k.github.io/Unouno-/js/m0ds/inline-10.js" data-k-id="JS_10"></script>
  <script src="https://kodux78k.github.io/Unouno-/js/m0ds/inline-11.js" data-k-id="JS_11"></script>
  <script src="https://kodux78k.github.io/Unouno-/js/m0ds/inline-12.js" data-k-id="JS_12"></script>
  <script src="https://kodux78k.github.io/Unouno-/js/m0ds/inline-13.js" data-k-id="JS_13"></script>
  <script src="https://kodux78k.github.io/Unouno-/js/m0ds/inline-14.js" data-k-id="JS_14"></script>
  <script src="https://kodux78k.github.io/Unouno-/js/m0ds/inline-15.js" data-k-id="JS_15"></script>
  <script src="https://kodux78k.github.io/Unouno-/js/m0ds/inline-16.js" data-k-id="JS_16"></script>
  <script src="https://kodux78k.github.io/Unouno-/js/m0ds/inline-17.js" data-k-id="JS_17"></script>
  <script src="https://kodux78k.github.io/Unouno-/js/m0ds/inline-18.js" data-k-id="JS_18"></script>
  <script src="https://kodux78k.github.io/Unouno-/js/m0ds/inline-19.js" data-k-id="JS_19"></script>
  <script src="https://kodux78k.github.io/Unouno-/js/m0ds/inline-20.js" data-k-id="JS_20"></script>
  <script src="https://kodux78k.github.io/Unouno-/js/m0ds/inline-21.js" data-k-id="JS_21"></script>
  <script src="https://kodux78k.github.io/Unouno-/js/m0ds/inline-22.js" data-k-id="JS_22"></script>
  <script src="https://kodux78k.github.io/Unouno-/js/m0ds/inline-23.js" data-k-id="JS_23"></script>
  <script src="https://kodux78k.github.io/Unouno-/js/m0ds/inline-24.js" data-k-id="JS_24"></script>
  <script src="https://kodux78k.github.io/Unouno-/js/m0ds/inline-25.js" data-k-id="JS_25"></script>
  <script src="https://kodux78k.github.io/Unouno-/js/m0ds/inline-26.js" data-k-id="JS_26"></script>
  <script src="https://kodux78k.github.io/Unouno-/js/m0ds/inline-27.js" data-k-id="JS_27"></script>
  <script src="https://kodux78k.github.io/Unouno-/js/m0ds/inline-28.js" data-k-id="JS_28"></script>
  <script src="https://kodux78k.github.io/Unouno-/js/m0ds/inline-29.js" data-k-id="JS_29"></script>
  <script src="https://kodux78k.github.io/Unouno-/js/m0ds/inline-30.js" data-k-id="JS_30"></script>
  <script src="https://kodux78k.github.io/Unouno-/js/m0ds/inline-31.js" data-k-id="JS_31"></script>
  <script src="https://kodux78k.github.io/Unouno-/js/modules/inline-8.js" data-k-id="JS_32"></script>
  <script type="module" src="https://www.infodose.com.br/js/modules/kob-fetch.js" data-k-id="JS_33"></script>
  <script type="module" src="https://www.infodose.com.br/js/modules/archz.js" data-k-id="JS_34"></script>
  <script type="module" src="https://www.infodose.com.br/js/modules/a€Arx.js" data-k-id="JS_35"></script>
</body></html>`);