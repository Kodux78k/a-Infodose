

// ==================================================
// KOBLLUX · PRIMEIRO CICLO · 3→6→9→7 · Δ7 SELADO
// Ambiente: KDX Dev v4.0 | Ressonância: 7,83Hz → 1134Hz
// ==================================================

/* ---------- 1 · TRANSIÇÕES SUAVES · 285Hz ---------- */
window.KOB_THEME_TRANSITION_SOFT_CSS = `
:root{--kob-dur:1.28s;--kob-ease:cubic-bezier(.2,.7,.2,1);}
*{transition:background var(--kob-dur) var(--kob-ease),color var(--kob-dur) var(--kob-ease),border-color var(--kob-dur) var(--kob-ease),box-shadow var(--kob-dur) var(--kob-ease),opacity var(--kob-dur) var(--kob-ease),transform calc(var(--kob-dur)*1.4) var(--kob-ease) !important;}
.orb,#main-orb,.dual-orb-halo{transition:all calc(var(--kob-dur)*2) var(--kob-ease) !important;}`;

/* ---------- 2 · FUNDO + GRADE FRACTAL · 432Hz ---------- */
window.KOB_BG_FADE_CSS = `
html,body,#appFrame{background:
 radial-gradient(1200px 700px at 50% 35%,rgba(255,0,255,.08),transparent 60%),
 radial-gradient(900px 600px at 15% 85%,rgba(0,255,255,.09),transparent 60%),
 #01041c !important;}
body::before{content:"";position:fixed;inset:0;pointer-events:none;z-index:0;
 background-image:linear-gradient(rgba(0,255,255,.06) 1px,transparent 1px),linear-gradient(90deg,rgba(0,255,255,.06) 1px,transparent 1px);
 background-size:28px 28px;
 mask-image:radial-gradient(ellipse at center,#000 45%,transparent 85%);opacity:.55;}`;

/* ---------- 3 · BOTÕES + SOMBRA DA VOZ · 528Hz ---------- */
window.KOB_BUTTON_FADE_AND_TTS_SHADOW_CSS = `
button,
[class*="btn-"],
#orbBtn,
.toggleBtn{

  border-color:     color-mix(in srgb,
      var(--kob-voice-secondary) 18%,
      transparent) !important;

  background:
    color-mix(in srgb,
      var(--kob-voice-primary) 8%,
      transparent) !important;

  color:var(--kob-voice-primary) !important;

  box-shadow:
    color-mix(in srgb,
      var(--kob-voice-primary) 20%,
      transparent),
    color-mix(in srgb,
      var(--kob-voice-primary) 35%,
      transparent) !important;

}

#btn-arch{   border:1px solid var(--kob-voice-primary) !important;}

button:hover,
[class*="btn-"]:hover,
#orbBtn:hover,
.toggleBtn:hover{
  border-color:var(--kob-voice-secondary) !important;
  color:#fff !important;
  box-shadow:
    0 0 18px var(--kob-voice-primary),
    inset 0 0 10px color-mix(in srgb,
      var(--kob-voice-secondary) 35%,
      transparent) !important;
}
button:hover{border-color: var(--kob-voice-primary) !important; !important;color:#fff !important;box-shadow:0 0 18px rgba(255,0,255,.45),inset 0 0 10px rgba(255,0,255,.15) !important;transform:translateY(-1px);}
.tts-orb-mini.speaking{animation:kob-tts 1.4s ease-out infinite;}
@keyframes kob-tts{
 0%{box-shadow:0 0 0 0 rgba(255,0,255,.6),0 0 14px #00ffff88;}
 80%{box-shadow:0 0 0 18px rgba(255,0,255,0),0 0 26px #00ffffbb;}
 100%{box-shadow:0 0 0 0 transparent,0 0 14px #00ffff66;}}`;

/* ---------- 4 · COR POR ARQUÉTIPO ---------- */
window.KOB_VOICE_THEME_CSS_PATCH = `
[data-voice-arch="IGNYRA"]{--arch:#ff4d00;--glow:#ff6a00aa;}
[data-voice-arch="LUMINE"]{--arch:#ffe600;--glow:#ffdd0099;}
[data-voice-arch="SOLUS"] {--arch:#8a7bff;--glow:#7a6bff99;}
[data-voice-arch="ELYA"]  {--arch:#7cf9c5;--glow:#34d39988;}
[data-voice-arch="KAION"] {--arch:#00e5ff;--glow:#06b6d499;}
[data-voice-arch="KOBLLUX"]{--arch:#ff00ff;--glow:#d946efbb;}
.archMsg{border-left:3px solid var(--arch,#00ffff) !important;
 background:linear-gradient(90deg,color-mix(in srgb,var(--arch) 10%,transparent),transparent) !important;
 text-shadow:0 0 6px var(--glow,#00ffff66);}`;

/* ---------- 5 · SOTAQUE · PRESENÇA · 1134Hz ---------- */
window.KOBLLUX_VOICE_THEME_CSS = `
.archMsg{padding:.9rem 1.1rem !important;border-radius:10px 14px 14px 4px !important;letter-spacing:.015em;line-height:1.55;}
.arch-speak-btn.active{outline:1px solid #ff00ff !important;background:rgba(255,0,255,.08) !important;box-shadow:0 0 14px #ff00ff77 !important;}
#voicesWrap *{font-family:"JetBrains Mono",Consolas,monospace !important;}`;

/* ---------- INJETAR TUDO ---------- */
(function INJETAR_PELE(){
 const id = "KOBLLUX_SKIN_C0";
 if(document.getElementById(id)) return;
 const css = [
  KOB_THEME_TRANSITION_SOFT_CSS,
  KOB_BG_FADE_CSS,
  KOB_BUTTON_FADE_AND_TTS_SHADOW_CSS,
  KOB_VOICE_THEME_CSS_PATCH,
  KOBLLUX_VOICE_THEME_CSS
 ].join("\n");
 const s = document.createElement("style");
 s.id = id; s.textContent = css;
 (document.head||document.documentElement).appendChild(s);

 /* ganchos internos */
 if(typeof KOB_APPLY_VOICE_THEME === "function") KOB_APPLY_VOICE_THEME();
 if(typeof __KBLX_MAIN_UNIFIED_INIT__ === "function") __KBLX_MAIN_UNIFIED_INIT__();

 console.log("%c KOBLLUX · PELE SELADA · CICLO 0→7→∞ ","color:#0ff;background:#01041c;padding:8px 14px;border:1px solid #f0f;font-weight:bold;");
 console.log("%c Δ7 ✧⃝⚝ 1134Hz ","color:#f0f;background:#01041c;padding:4px 10px;border:1px solid #0ff;");
})();




(function KOBLLUX_OVERRIDE_NEPHESH() {
  // ══ BOOT SIGNATURE ══
  console.log("%c ⚡ KOBLLUX Trinity Engine ","color:#0ff;background:#001;padding:8px;border:1px solid #0ff;font-weight:bold");
  console.log("%c Nephesh Variant · 1134Hz ","color:#f0f;background:#001;padding:4px;border:1px solid #f0f");

  // ══ DI ENGINE (Identity) ══
  window.DI = window.DI || {};
  
  window.DI.seed = function(name) {
    const safe = (name || 'DUAL').trim() || 'DUAL';
    let seed = 0;
    for (let i = 0; i < safe.length; i++) seed += safe.charCodeAt(i);
    return seed;
  };
  
  window.DI.applyRootVars = function(name) {
    const safe = (name || 'DUAL').trim() || 'DUAL';
    const seed = window.DI.seed(safe);
    const h1 = seed % 360;
    const h2 = (seed * 37) % 360;
    const tone = h1 > 180 ? 'warm' : 'cool';
    
    const root = document.documentElement;
    root.style.setProperty('--di-h1', h1);
    root.style.setProperty('--di-h2', h2);
    root.style.setProperty('--di-accent', `hsl(${h1} 100% 55%)`);
    root.style.setProperty('--di-accent-2', `hsl(${h2} 90% 45%)`);
    root.dataset.diName = safe;
    root.dataset.diTone = tone;
  };
  
  // ══ CSS OVERRIDE INJECTOR ══
  function injectKoblluxStyles() {
    const ID = "KOBLLUX_TRINITY_OVERRIDE";
    if (document.getElementById(ID)) return;
    
    const css = `
      /* ── KOBLLUX TRANSIÇÕES SUAVES ── */
      :root {
        --kob-dur: 1.28s;
        --kob-ease: cubic-bezier(.2, .7, .2, 1);
      }
      
      [data-k-role="orb"],
      [data-k-role="symbol-bar"],
      [data-k-role="drawer"] {
        transition: all var(--kob-dur) var(--kob-ease) !important;
      }
      
      /* ── KOBLLUX DATA ATTRIBUTES ── */
      [data-k-layer="background"] { z-index: var(--z-base, 0); }
      [data-k-layer="content"]    { z-index: var(--z-content, 100); }
      [data-k-layer="widget"]     { z-index: var(--z-widget, 500); }
      [data-k-layer="overlay"]    { z-index: var(--z-overlay, 1000); }
      [data-k-layer="system"]     { z-index: var(--z-system, 5000); }
      
      /* ── ORB ENHANCEMENTS ── */
      [data-k-role="orb"] {
        filter: drop-shadow(0 0 14px rgba(120, 227, 255, 0.6));
        transition: filter var(--kob-dur) var(--kob-ease) !important;
      }
      
      [data-k-role="orb"][data-state="speaking"] {
        filter: drop-shadow(0 0 24px rgba(255, 0, 255, 0.8)) !important;
        animation: kob-orb-pulse 1.4s ease-out infinite;
      }
      
      @keyframes kob-orb-pulse {
        0% { transform: scale(1); filter: drop-shadow(0 0 14px rgba(0, 245, 255, 0.6)); }
        80% { transform: scale(1.05); filter: drop-shadow(0 0 28px rgba(255, 0, 255, 0.8)); }
        100% { transform: scale(1); filter: drop-shadow(0 0 14px rgba(0, 245, 255, 0.6)); }
      }
      
      /* ── SYMBOL BAR THEME ── */
      #symbolBar {
        backdrop-filter: blur(18px) !important;
      }
      
      #symbolBar [data-k-role="orb"] {
        border: 1px solid rgba(120, 227, 255, 0.35);
        border-radius: 50%;
      }
      
      /* ── DRAWER ENHANCEMENTS ── */
      [data-k-role="drawer"] {
        background: rgba(8, 10, 18, 0.96) !important;
        backdrop-filter: blur(18px) !important;
        border: 1px solid rgba(120, 227, 255, 0.18);
      }
      
      /* ── ARCH OVERLAY ── */
      #arch-overlay {
        background: radial-gradient(circle at 50% 50%, rgba(255, 0, 255, 0.08), transparent 70%) !important;
        transition: background var(--kob-dur) var(--kob-ease) !important;
      }
    `;
    
    const style = document.createElement('style');
    style.id = ID;
    style.textContent = css;
    (document.head || document.documentElement).appendChild(style);
    console.log("%c ✓ CSS Override injetado","color:#0f0;padding:4px");
  }
  
  // ══ MetaBus EVENT SYSTEM ══
  window.KOBLLUX_BUS = {
    events: {},
    on(name, fn) {
      (this.events[name] = this.events[name] || []).push(fn);
    },
    emit(name, data) {
      (this.events[name] || []).forEach(fn => fn(data));
    }
  };
  
  // ══ INITIALIZATION ══
  document.addEventListener('DOMContentLoaded', () => {
    injectKoblluxStyles();
    
    // Load identity from localStorage
    const saved = localStorage.getItem('di_userName') || 'DUAL';
    window.DI.applyRootVars(saved);
    
    // Sync orb
    const mainOrb = document.querySelector('#main-orb');
    if (mainOrb) {
      mainOrb.dataset.state = 'idle';
    }
    
    console.log("%c ✓ KOBLLUX Init completo","color:#0f0;padding:4px");
  });
  
  // ══ READY SIGNATURE ══
  window.KOBLLUX_READY = true;
  console.log("%c ✓ KOBLLUX Trinity ready","color:#0f0;padding:4px");
})();