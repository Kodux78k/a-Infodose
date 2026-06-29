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
button,[class*="btn-"],#orbBtn,.toggleBtn{border:1px solid rgba(0,255,255,.35) !important;background:rgba(0,255,255,.04) !important;color:#b8ffff !important;box-shadow:inset 0 0 8px rgba(0,255,255,.08) !important;}
button:hover{border-color: border: var(--kob-voice-primary) !important; !important;color:#fff !important;box-shadow:0 0 18px rgba(255,0,255,.45),inset 0 0 10px rgba(255,0,255,.15) !important;transform:translateY(-1px);}
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