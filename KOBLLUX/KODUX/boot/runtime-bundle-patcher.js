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
})(`<style id="kd-patch-blobs-zindex">
/* ══════════════════════════════════════════════════════
   PATCH · BLOBS VISÍVEIS NO LOADER + Z-INDEX LIMPO
   Cole antes do </body>
══════════════════════════════════════════════════════ */

/* 1) Blobs VISÍVEIS durante o loader (antes do boot) */
.kd-blob   { opacity: .22 !important; }
.kd-blob-1 { opacity: .22 !important; }
.kd-blob-2 { opacity: .18 !important; }
.kd-blob-3 { opacity: .28 !important; }

/* 2) Pós-boot: mantém os valores originais (não regride) */
body.kd-booted .kd-blob   { opacity: .32 !important; }
body.kd-booted .kd-blob-2 { opacity: .28 !important; }

/* 3) Z-index stack unificado (elimina os 3 conflitos de #kdc) */
#kd-stage         { z-index: 9000;  }   /* fundo persistente */
#kd-stage .kd-blob{ z-index: 9001;  }   /* blobs sobre o stage bg */
.kodux-boot-veil  { z-index: 9002;  }   /* veil sobre os blobs */
#kodux-boot       { z-index: 9010;  }   /* tela de boot */
#kdc              {
  position: fixed;
  inset: 0;
  z-index: 9020;          /* card acima do boot, abaixo de modais */
  pointer-events: none;
  mix-blend-mode: normal;
}
#kdc.fusao-ativa  { mix-blend-mode: lighten; }

/* 4) Stage desce para trás depois do boot */
body.kd-booted #kd-stage { z-index: -1; }

/* 5) Modais e toasts mantêm supremacia */
.modal-overlay    { z-index: 99998 !important; }
.toaster-wrap     { z-index: 99999 !important; }
#nv-toast         { z-index: 100000 !important; }
#kd-qa-menu       { z-index: 100001 !important; }
</style>
<script id="kd-safe-theme-guard">
/* ══════════════════════════════════════════════════════
   SAFE-THEME GUARD — KODUX Solar Boot
   Restaura variáveis de voz + modo se HTML injetado
   sobrescrever o :root. Roda em DOMContentLoaded + load.
══════════════════════════════════════════════════════ */
(function() {
  'use strict';

  /* Paleta base por modo */
  var THEMES = {
    night: {
      '--kob-voice-primary':   '#00f2ff',
      '--kob-voice-secondary': '#bd00ff',
      '--kob-voice-accent':    '#39ffb6',
      '--bg':                  '#07090d',
      '--text':                '#eaf2ff',
      '--muted':               '#7f8da3'
    },
    day: {
      '--kob-voice-primary':   '#007aff',
      '--kob-voice-secondary': '#6e40c9',
      '--kob-voice-accent':    '#00b894',
      '--bg':                  '#f0f4ff',
      '--text':                '#17202b',
      '--muted':               'rgba(20,30,50,.55)'
    },
    sunset: {
      '--kob-voice-primary':   '#ff9d42',
      '--kob-voice-secondary': '#ff5577',
      '--kob-voice-accent':    '#ffd60a',
      '--bg':                  '#1a0a00',
      '--text':                '#fff8f0',
      '--muted':               'rgba(255,220,180,.65)'
    }
  };

  /* ── Detecta o modo atual ── */
  function currentMode() {
    var html  = document.documentElement;
    var body  = document.body;
    /* Tenta via dataset/class (day/night/sunset) */
    var m = html.dataset.theme || html.dataset.mode ||
            (body.classList.contains('mode-day')    ? 'day'    :
             body.classList.contains('mode-sunset') ? 'sunset' :
             body.classList.contains('mode-night')  ? 'night'  : null);
    /* Fallback: localStorage */
    if (!m) { try { m = localStorage.getItem('di_solarMode'); } catch(_){} }
    return m || 'night';
  }

  /* ── Aplica as vars no :root ── */
  function applyTheme(mode) {
    var palette = THEMES[mode] || THEMES.night;
    var root    = document.documentElement;
    Object.keys(palette).forEach(function(k) {
      root.style.setProperty(k, palette[k]);
    });
    /* marca o modo no html para seletores CSS */
    root.setAttribute('data-theme', mode);
    root.setAttribute('data-mode',  mode);
    document.body.setAttribute('data-mode', mode);
  }

  /* ── Guard: verifica se as vars ainda estão certas ── */
  function guard() {
    var root   = document.documentElement;
    var mode   = currentMode();
    var palette = THEMES[mode] || THEMES.night;
    var style   = getComputedStyle(root);
    /* checa só a primary — se sumiram, restaura tudo */
    var primary = style.getPropertyValue('--kob-voice-primary').trim();
    if (!primary || primary === 'initial' || primary === '') {
      applyTheme(mode);
    }
  }

  /* ── API pública ── */
  window.KoduxSafeTheme = {
    apply: applyTheme,
    guard: guard,
    mode:  currentMode
  };

  /* ── Boot ── */
  function init() {
    applyTheme(currentMode());
    /* Roda o guard a cada 2s para pegar injeções tardias */
    setInterval(guard, 2000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  window.addEventListener('load', function() { applyTheme(currentMode()); });

  /* Escuta mudanças de modo feitas pelo SolarUpgrade ou App */
  document.addEventListener('solar:mode', function(e) {
    if (e && e.detail && e.detail.mode) applyTheme(e.detail.mode);
  });

  console.log('%c[SAFE-THEME]%c ✓ Guard ativo — modo: ' + currentMode(),
    'background:#39ffb6;color:#000;padding:2px 6px;border-radius:3px',
    'color:#39ffb6');
})();
</script>`);