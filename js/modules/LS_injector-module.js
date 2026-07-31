(function(h,s='#inject-here'){
const p=new DOMParser(),
c=p.parseFromString(h,'text/html'),
f=document.createDocumentFragment(),
t=document.querySelector(s)||document.body;
Array.from(c.body.childNodes)
.forEach(n=>f.appendChild(document.importNode(n,true)));
t.appendChild(f);
Array.from(c.querySelectorAll('script'))
.forEach(x=>{
const n=document.createElement('script');
for(const a of x.attributes)
n.setAttribute(a.name,a.value);
n.textContent=x.textContent;
document.body.appendChild(n);
});
})(`<style>
    /* ========================================== */
    /* CSS CORE MOBILE-FIRST & SAFE AREAS         */
    /* ========================================== */

    :root {
      --bg-dark: #05070a; --bg-panel: #0d1117; --bg-card: #161b22;
      --neon-cyan: #00ffff; --neon-magenta: #ff00ff; --neon-yellow: #fbbf24;
      --text-main: #c9d1d9; --text-muted: #8b949e;
      --safe-top: env(safe-area-inset-top, 0px); --safe-bottom: env(safe-area-inset-bottom, 0px);
      --nav-height: 60px; --header-height: 56px;
      --card-p: 12px; --font-size-base: 14px;
    }
    body[data-mode="compact"] { --card-p: 8px; --font-size-base: 12px; }
    body {
      background-color: var(--bg-dark); color: var(--text-main); font-family: 'Inter', system-ui, sans-serif;
      min-height: 100vh; min-height: 100dvh; padding-top: env(safe-area-inset-top); padding-bottom: env(safe-area-inset-bottom);
      padding-left: env(safe-area-inset-left); padding-right: env(safe-area-inset-right); overflow: auto; display: flex; flex-direction: column;
      font-size: var(--font-size-base);
    }
   
  </style> 

<div class="accordion-header" onclick="UI.toggleAccordion('acc-baulite')">
  <span>📦 Baú Lite - LocalStorage</span>
  <svg id="icon-acc-baulite" class="lucide w-4 h-4" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg>
</div>
<div id="acc-baulite" class="flex-col p-2">
  <div id="baulite-container"></div>
</div>

<!-- ========== BAÚ LS (EMBUTIDO E CORRIGIDO) ========== -->
<script>
  (function() {
    'use strict';

    // Aguarda o DOM e o container
    const container = document.getElementById('baulite-container');
    if (!container) return;
    if (container.querySelector('.baulite-root')) return; // já injetado

    // ========== CONFIGURAÇÃO ==========
    const LS_KEYS = {
      HTML: 'lastHTML',
      USER_SYMBOL: 'userSymbol',
      SKS: 'di_apiKey',
      SK_ACTIVE: 'openrouter_active'
    };

    const DISABLED_KEY = 'infodose:presets.disabled';

    const PRESETS = [
      { key: 'di_userName', label: 'Usuário' },
      { key: 'di_assistantName', label: 'Assistente' },
      { key: 'di_apiKey', label: 'Chave OpenRouter (legacy)' },
      { key: 'di_modelName', label: 'Modelo IA' },
      { key: 'uno:theme', label: 'Tema' },
      { key: 'uno:bg', label: 'Fundo Custom' },
      { key: 'infodose:cssCustom', label: 'CSS Custom' },
      { key: 'infodose:voices', label: 'Vozes Arquetípicas' }
    ];

    // ========== INJETA CSS ==========
    const style = document.createElement('style');
    style.textContent = \`
     /* ========================================== */
    /* NATIVE CSS UTILITIES (REPOSITÓRIO TAILWIND)*/
    /* ========================================== */
    .w-full{width:100%} .h-full{height:100%} .w-3{width:0.75rem} .h-3{height:0.75rem} .w-4{width:1rem} .h-4{height:1rem} .w-5{width:1.25rem} .h-5{height:1.25rem} .w-6{width:1.5rem} .h-6{height:1.5rem} .w-10{width:2.5rem} .h-10{height:2.5rem} .w-12{width:3rem} .h-12{height:3rem} .max-w-\\[120px\\]{max-width:120px} .max-h-40{max-height:10rem}
    .flex{display:flex} .inline{display:inline} .grid{display:grid} .hidden{display:none} .flex-1{flex:1} .flex-col{flex-direction:column} .flex-wrap{flex-wrap:wrap} .shrink-0{flex-shrink:0}
    .items-center{align-items:center} .items-start{align-items:flex-start} .justify-between{justify-content:space-between} .justify-center{justify-content:center} .justify-start{justify-content:flex-start} .grid-cols-2{grid-template-columns:repeat(2,minmax(0,1fr))}
    .gap-2{gap:0.5rem} .gap-3{gap:0.75rem} .space-y-1> :not([hidden])~ :not([hidden]){margin-top:0.25rem} .space-y-6> :not([hidden])~ :not([hidden]){margin-top:1.5rem}
    .p-1{padding:0.25rem} .p-2{padding:0.5rem} .p-3{padding:0.75rem} .p-4{padding:1rem} .px-1\\.5{padding-left:0.375rem;padding-right:0.375rem} .px-2{padding-left:0.5rem;padding-right:0.5rem} .px-4{padding-left:1rem;padding-right:1rem} .py-0\\.5{padding-top:0.125rem;padding-bottom:0.125rem} .py-1{padding-top:0.25rem;padding-bottom:0.25rem} .pb-2{padding-bottom:0.5rem} .pb-\\[calc\\(var\\(--nav-height\\)\\+var\\(--safe-bottom\\)\\)\\]{padding-bottom:calc(var(--nav-height) + var(--safe-bottom))} .mb-2{margin-bottom:0.5rem} .mb-3{margin-bottom:0.75rem} .mt-1{margin-top:0.25rem} .ml-1{margin-left:0.25rem} .ml-2{margin-left:0.5rem} .-ml-1{margin-left:-0.25rem}
    .absolute{position:absolute} .relative{position:relative} .fixed{position:fixed} .sticky{position:sticky} .inset-0{inset:0} .top-0{top:0} .top-4{top:1rem} .top-20{top:5rem} .bottom-4{bottom:1rem} .bottom-6{bottom:1.5rem} .right-4{right:1rem} .right-6{right:1.5rem} .left-1\\/2{left:50%} .z-10{z-index:10} .z-50{z-index:50} .z-\\[9999\\]{z-index:9999} .z-\\[99999\\]{z-index:99999}
    .text-\\[9px\\]{font-size:9px} .text-\\[10px\\]{font-size:10px} .text-xs{font-size:0.75rem;line-height:1rem} .text-sm{font-size:0.875rem;line-height:1.25rem} .font-bold{font-weight:700} .font-mono{font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace} .tracking-widest{letter-spacing:0.1em} .uppercase{text-transform:uppercase} .truncate{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
    .text-white{color:#fff} .text-gray-400{color:#9ca3af} .text-gray-500{color:#6b7280} .text-cyan-50{color:#ecfeff} .text-cyan-300{color:#67e8f9} .text-cyan-400{color:#22d3ee} .text-yellow-400{color:#facc15} .text-magenta-400{color:#f472b6} .text-red-300{color:#fca5a5} .text-red-400{color:#f87171} .text-green-400{color:#4ade80} .hover\\:text-white:hover{color:#fff} .hover\\:text-cyan-400:hover{color:#22d3ee} .hover\\:text-red-300:hover{color:#fca5a5}
    .bg-black{background-color:#000} .bg-gray-800{background-color:#1f2937} .bg-gray-900{background-color:#111827} .bg-zinc-900{background-color:#18181b} .bg-\\[\\#0d1117\\]{background-color:#0d1117} .bg-\\[\\#161b22\\]{background-color:#161b22} .bg-cyan-600{background-color:#0891b2} .bg-black\\/50{background-color:rgb(0 0 0 / 0.5)} .bg-black\\/80{background-color:rgb(0 0 0 / 0.8)} .bg-gray-800\\/50{background-color:rgb(31 41 55 / 0.5)} .bg-cyan-900\\/90{background-color:rgb(22 78 99 / 0.9)} .hover\\:bg-black:hover{background-color:#000}
    .border{border-width:1px} .border-b{border-bottom-width:1px} .border-gray-600{border-color:#4b5563} .border-gray-700{border-color:#374151} .border-gray-800{border-color:#1f2937} .border-\\[\\#30363d\\]{border-color:#30363d} .border-cyan-400{border-color:#22d3ee} .border-cyan-800{border-color:#155e75} .border-magenta-500{border-color:#ec4899} .border-white\\/10{border-color:rgb(255 255 255 / 0.1)}
    .rounded{border-radius:0.25rem} .rounded-full{border-radius:9999px}
    .shadow-lg{box-shadow:0 10px 15px -3px rgb(0 0 0 / 0.1)} .shadow-\\[0_4px_15px_rgba\\(0\\,255\\,255\\,0\\.4\\)\\]{box-shadow:0 4px 15px rgba(0,255,255,0.4)} .shadow-\\[0_0_15px_rgba\\(0\\,255\\,255\\,0\\.4\\)\\]{box-shadow:0 0 15px rgba(0,255,255,0.4)}
    .-translate-x-1\\/2{transform:translateX(-50%)} .transition-transform{transition:transform 150ms} .transition-all{transition:all 150ms} .transition-opacity{transition:opacity 300ms}
    .opacity-0{opacity:0} .pointer-events-none{pointer-events:none} .cursor-pointer{cursor:pointer} .overflow-y-auto{overflow-y:auto} .overflow-auto{overflow:auto}
    @media (min-width: 640px) { .sm\\:text-xs { font-size: 0.75rem; line-height: 1rem; } }
    .lucide { fill: none; stroke: currentColor; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; display: inline-block; vertical-align: middle; }
    /* ========================================== */
    /* COMPONENTES DA INTERFACE                   */
    /* ========================================== */
    .glass { background: rgba(13, 17, 23, 0.85); backdrop-filter: blur(12px); }
    .glass-top { border-bottom: 1px solid #30363d; }
    .glass-bottom { border-top: 1px solid #30363d; }
    .view-panel { display: none; flex: 1; width: 100%; height: 100%; overflow-y: auto; position: relative; }
    .view-panel.active { display: flex; flex-direction: column; }
    .btn-cyber { background: transparent; border: 1px solid #30363d; color: var(--text-main); border-radius: 8px; transition: all 0.2s ease; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px; }
    .btn-cyber:active { transform: scale(0.96); }
    .btn-cyber.primary { border-color: var(--neon-cyan); color: var(--neon-cyan); }
    .btn-cyber.primary:active { background: rgba(0,255,255,0.1); }
    .btn-cyber.danger { border-color: var(--neon-magenta); color: var(--neon-magenta); }
    .btn-cyber.warning { border-color: var(--neon-yellow); color: var(--neon-yellow); }
    .CodeMirror { height: 100% !important; font-family: 'JetBrains Mono', monospace; font-size: var(--font-size-base); background: var(--bg-dark) !important; }
    #mobileNav {
      position: fixed; bottom: 0; left: 0; right: 0; height: calc(var(--nav-height) + var(--safe-bottom)); padding-bottom: var(--safe-bottom);
      z-index: 100; display: flex; justify-content: space-around; align-items: center;
    }
    .nav-item { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; color: var(--text-muted); font-size: 10px; font-weight: 600; text-transform: uppercase; height: 100%; cursor: pointer; transition: color 0.2s; }
    .nav-item svg { margin-bottom: 4px; transition: transform 0.2s; }
    .nav-item.active { color: var(--neon-cyan); }
    .nav-item.active.runtime { color: var(--neon-magenta); }
    .nav-item.active svg { transform: translateY(-2px); }
    #drawer { position: fixed; top: 0; left: -100%; width: 300px; bottom: 0; background: var(--bg-panel); border-right: 1px solid #30363d; z-index: 1000; transition: left 0.3s cubic-bezier(0.4, 0, 0.2, 1); display: flex; flex-direction: column; padding-top: var(--safe-top); }
    #drawer.open { left: 0; }
    #drawer-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.6); backdrop-filter: blur(3px); z-index: 999; opacity: 0; pointer-events: none; transition: opacity 0.3s; }
    #drawer-overlay.open { opacity: 1; pointer-events: auto; }
    .accordion-header { background: #161b22; padding: 12px; font-weight: 600; font-size: 13px; display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #30363d; border-bottom: 1px solid #30363d; position: sticky; top: 0; z-index: 10; cursor: pointer; }
    .card-resource { background: var(--bg-card); border: 1px solid #30363d; border-radius: 12px; padding: var(--card-p); margin: 8px 12px; display: flex; flex-direction: column; gap: 8px; }
    #runtime-overlay {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      background: rgba(13, 17, 23, 0.95);
      border-top: 1px solid var(--neon-magenta);
      backdrop-filter: blur(10px);
      z-index: 50;
      display: flex;
      flex-direction: column;
      max-height: 28%; /* reduzido de 40% para 28% */
      transform: translateY(100%);
      transition: transform 0.3s ease;
    }
    #runtime-overlay.open {
      transform: translateY(0);
    }
    #preview-wrapper { width: 100%; height: 100%; background: #fff; transition: all 0.3s; margin: 0 auto; position: relative; }
    #sandbox-frame { width: 100%; height: 100%; border: none; }
    .pulse-dot { width: 8px; height: 8px; background: var(--neon-magenta); border-radius: 50%; box-shadow: 0 0 10px var(--neon-magenta); animation: pulse 2s infinite; }
    @keyframes pulse { 0% { opacity: 1; transform: scale(1); } 50% { opacity: 0.4; transform: scale(1.2); } 100% { opacity: 1; transform: scale(1); } }
    #preview-wrapper.runtime-fullscreen { position: fixed !important; inset: 0 !important; width: 100vw !important; height: 100dvh !important; max-width: none !important; max-height: none !important; z-index: 99999 !important; margin: 0 !important; background: #fff !important; }
    #preview-wrapper.runtime-fullscreen #sandbox-frame { width: 100% !important; height: 100% !important; }
    #btn-fullscreen.is-active { color: #00ffff; border-color: #00ffff; background: rgba(0,255,255,.12); box-shadow: 0 0 15px rgba(0,255,255,.25); }
    #preview-wrapper:fullscreen { width: 100vw !important; height: 100vh !important; background: #fff; }
    #preview-wrapper:fullscreen #sandbox-frame { width: 100%; height: 100%; }
    #preview-wrapper:-webkit-full-screen { width: 100vw !important; height: 100vh !important; }
    #btn-exit-full { display: none; }
    #preview-wrapper:fullscreen #btn-exit-full,
    #preview-wrapper:-webkit-full-screen #btn-exit-full,
    #preview-wrapper.runtime-fullscreen #btn-exit-full { display: flex !important; }
    #workspace { min-height: 0; }
    #view-editor .flex-1 { height: 100%; }
    #view-runtime .flex-1 { overflow: auto; height: 100%; }
    #drawer { overflow-y: auto; height: 100%; }
    #drawer .flex-1 { overflow-y: auto; }
    /* Ajustes finos para o modal KBLX em mobile */
    #kblx-modal .bg-\\[\\#0d1117\\] { margin: 0 auto; }
    #kblx-output {
      -webkit-overflow-scrolling: touch;
      scroll-behavior: smooth;
      word-break: break-all;
      white-space: pre-wrap;
      overflow: auto !important;
    }
    #kblx-output::-webkit-scrollbar { width: 4px; height: 4px; }
    #kblx-output::-webkit-scrollbar-thumb { background: #4b5563; border-radius: 8px; }
    @media (max-width: 480px) {
      #kblx-output { max-height: 45vh !important; }
    }
 /* Baú Lite - Estilos KBLX (adaptado para container) */
      .baulite-root * { box-sizing: border-box; margin: 0; padding: 0; }
      .baulite-root {
        font-family: 'Montserrat', system-ui, sans-serif;
        color: #c9d1d9;
        font-size: 13px;
        max-height: 100%;
        overflow-y: auto;
        padding: 4px 0;
      }
      .baulite-root .app { display: flex; flex-direction: column; gap: 12px; }
      .baulite-root .card {
        background: rgba(0,0,0,0.25);
        backdrop-filter: blur(8px);
        border-radius: 12px;
        padding: 10px 12px;
        border: 1px solid rgba(255,255,255,0.08);
      }
      .baulite-root .small { font-size: .75rem; color: #8b949e; margin-top: 4px; }
      .baulite-root .hdr {
        display: flex;
        gap: 8px;
        align-items: center;
        justify-content: space-between;
        border-bottom: 1px solid rgba(255,255,255,0.08);
        padding-bottom: 8px;
        margin-bottom: 8px;
        flex-wrap: wrap;
      }
      .baulite-root .ttl { font-weight: 900; letter-spacing: .06em; font-size: 1rem; color: #00ffff; }
      .baulite-root .actions { display: flex; gap: 6px; flex-wrap: wrap; }
      .baulite-root .meta { color: #8b949e; font-size: 11px; margin: 4px 0 8px; }
      .baulite-root .list { display: grid; gap: 8px; }
      .baulite-root .item {
        background: rgba(255,255,255,0.04);
        border: 1px solid rgba(255,255,255,0.08);
        border-radius: 10px;
        padding: 8px;
        display: grid;
        gap: 6px;
      }
      .baulite-root .item .head {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 6px;
        flex-wrap: wrap;
      }
      .baulite-root .key {
        font-weight: 700;
        max-width: 60%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-size: 0.85rem;
      }
      .baulite-root .type { font-size: 10px; color: #8b949e; }
      .baulite-root .val {
        font: 11px/1.4 ui-monospace, monospace;
        background: rgba(0,0,0,0.3);
        border: 1px solid rgba(255,255,255,0.06);
        border-radius: 8px;
        padding: 6px;
        max-height: 90px;
        overflow: auto;
        word-break: break-word;
        white-space: pre-wrap;
      }
      .baulite-root .switch {
        inline-size: 36px;
        block-size: 22px;
        border-radius: 999px;
        border: 1px solid rgba(255,255,255,0.15);
        background: rgba(255,255,255,0.1);
        position: relative;
        cursor: pointer;
        flex: 0 0 auto;
      }
      .baulite-root .switch::after {
        content: "";
        position: absolute;
        inset: 3px auto 3px 3px;
        width: 16px;
        border-radius: 999px;
        background: #fff;
        transition: all .18s;
      }
      .baulite-root .switch.on { background: rgba(25,226,123,0.25); }
      .baulite-root .switch.on::after { left: 17px; }
      .baulite-root details.presets {
        border: 1px solid rgba(255,255,255,0.08);
        border-radius: 10px;
        padding: 6px;
        background: rgba(255,255,255,0.02);
        margin-bottom: 8px;
      }
      .baulite-root .presets-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
        gap: 8px;
        margin-top: 6px;
      }
      .baulite-root .preset {
        border: 1px solid rgba(255,255,255,0.08);
        border-radius: 8px;
        background: rgba(255,255,255,0.03);
        padding: 8px;
        display: grid;
        gap: 4px;
      }
      .baulite-root .img-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
        gap: 8px;
      }
      .baulite-root .img-card {
        border: 1px solid rgba(255,255,255,0.08);
        background: rgba(255,255,255,0.02);
        border-radius: 8px;
        padding: 6px;
      }
      .baulite-root .img-card img { width: 100%; height: auto; display: block; border-radius: 6px; }
      .baulite-root button {
        background: rgba(255,255,255,0.06);
        border: none;
        color: #c9d1d9;
        padding: 5px 10px;
        border-radius: 8px;
        font-size: .8rem;
        cursor: pointer;
        transition: .15s;
        display: inline-flex;
        gap: 4px;
        align-items: center;
      }
      .baulite-root button:hover { background: rgba(255,255,255,0.12); }
      .baulite-root .btn-ghost { background: transparent; border: 1px dashed rgba(255,255,255,0.15); }
      .baulite-root input, .baulite-root select {
        width: 100%;
        margin: 4px 0;
        padding: 6px 8px;
        border-radius: 8px;
        border: 1px solid rgba(255,255,255,0.1);
        background: rgba(0,0,0,0.3);
        color: #c9d1d9;
        font-family: inherit;
        outline: none;
        font-size: .8rem;
      }
      .baulite-root i { font-style: normal; display: inline-block; width: 1.2em; text-align: center; }
    \`;
    container.appendChild(style);

    // ========== CRIA ESTRUTURA BASE ==========
    const root = document.createElement('div');
    root.className = 'baulite-root';
    container.appendChild(root);

    // Elemento oculto para download
    const dlLink = document.createElement('a');
    dlLink.id = 'baulite-dl';
    dlLink.style.display = 'none';
    root.appendChild(dlLink);

    // Container do app
    const appDiv = document.createElement('div');
    appDiv.className = 'app';
    appDiv.id = 'baulite-app';
    root.appendChild(appDiv);

    // Painel principal
    const panelDiv = document.createElement('div');
    panelDiv.className = 'panel';
    panelDiv.innerHTML = \`
      <div class="hdr">
        <div class="ttl">LocalStorage • Baú Lite</div>
        <div class="actions">
          <button id="baulite-lsRescan"><i>⟲</i> Re-scan</button>
          <button id="baulite-lsExport"><i>⇑</i> Exportar</button>
          <label for="baulite-lsImportFile" style="display:inline-block">
            <button type="button"><i>⇓</i> Importar</button>
          </label>
          <input id="baulite-lsImportFile" type="file" accept="application/json" hidden>
          <button id="baulite-lsClearDisabled" class="btn-ghost"><i>⌫</i> Limpar desativados</button>
        </div>
      </div>

      <details class="presets" open>
        <summary><strong>Presets (ON/OFF global)</strong></summary>
        <div class="presets-grid" id="baulite-presetsGrid"></div>
      </details>

      <div class="meta"><span id="baulite-lsCount">—</span> • <span id="baulite-lsSize">—</span></div>
      <div class="list" id="baulite-lsList"></div>

      <details class="presets" style="margin-top:8px" open>
        <summary><strong>Pré-visualização de Imagens</strong></summary>
        <div class="img-grid" id="baulite-imgGrid"></div>
      </details>
    \`;
    root.appendChild(panelDiv);

    // ========== UTILITÁRIOS ==========
    const $ = (sel, ctx = root) => ctx.querySelector(sel);
    const $$ = (sel, ctx = root) => ctx.querySelectorAll(sel);

    function saveFile(name, str) {
      const blob = new Blob([str], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = $('#baulite-dl');
      a.href = url;
      a.download = name;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 800);
    }

    function prettyBytes(n) {
      if (!Number.isFinite(n) || n <= 0) return '0 B';
      const u = ['B', 'KB', 'MB', 'GB'];
      let i = 0;
      while (n >= 1024 && i < u.length - 1) {
        n /= 1024;
        i++;
      }
      return n.toFixed(2) + ' ' + u[i];
    }

    function isJson(v) {
      try { JSON.parse(v); return true; } catch { return false; }
    }

    function inferType(v) {
      if (v == null || v === '') return 'empty';
      if (isJson(v)) {
        const p = JSON.parse(v);
        if (Array.isArray(p)) return 'json[array]';
        if (p && typeof p === 'object') return 'json[object]';
        return 'json[' + (typeof p) + ']';
      }
      if (/^data:image\\//i.test(v) || /\\.(png|jpe?g|gif|webp|svg)(\\?|$)/i.test(v)) return 'image';
      if (/^(true|false|1|0)$/i.test(v)) return 'boolean-like';
      if (/^https?:\\/\\//i.test(v)) return 'url';
      if (/^data:/i.test(v)) return 'data-url';
      return 'string';
    }

    // ========== GERENCIAMENTO DE DADOS ==========
    function disabledSet() {
      try { return new Set(JSON.parse(localStorage.getItem(DISABLED_KEY) || '[]')); }
      catch { return new Set(); }
    }

    function saveDisabled(set) {
      localStorage.setItem(DISABLED_KEY, JSON.stringify(Array.from(set)));
    }

    function toggleDisabled(k) {
      const s = disabledSet();
      s.has(k) ? s.delete(k) : s.add(k);
      saveDisabled(s);
      renderPresets();
      renderLS();
    }

    function lsEntries() {
      const out = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        const v = localStorage.getItem(k) || '';
        out.push({ key: k, val: v });
      }
      return out.sort((a, b) => a.key.localeCompare(b.key));
    }

    function lsSizeBytes() {
      let sum = 0;
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        const v = localStorage.getItem(k) || '';
        sum += k.length + v.length;
      }
      return sum;
    }

    // ========== RENDERIZAÇÃO ==========
    function renderPresets() {
      const grid = $('#baulite-presetsGrid');
      if (!grid) return;
      grid.innerHTML = '';
      const dis = disabledSet();

      PRESETS.forEach(p => {
        const val = localStorage.getItem(p.key);
        const on = !dis.has(p.key);

        const wrap = document.createElement('div');
        wrap.className = 'preset';

        const head = document.createElement('div');
        head.style.cssText = 'display:flex;justify-content:space-between;align-items:center;padding:0;border:0';

        const nameDiv = document.createElement('div');
        nameDiv.innerHTML = \`<strong>\${p.label}</strong><div class="type">\${p.key}</div>\`;

        const sw = document.createElement('div');
        sw.className = 'switch' + (on ? ' on' : '');
        sw.title = on ? 'Desativar (não apaga)' : 'Ativar';
        sw.addEventListener('click', () => toggleDisabled(p.key));

        head.append(nameDiv, sw);

        const meta = document.createElement('div');
        meta.className = 'val';
        meta.textContent = val
          ? (inferType(val).startsWith('json') ? JSON.stringify(JSON.parse(val), null, 2) : val)
          : '—';

        wrap.append(head, meta);
        grid.append(wrap);
      });
    }

    function addImagePreview(key, src) {
      const g = $('#baulite-imgGrid');
      const card = document.createElement('div');
      card.className = 'img-card';
      const cap = document.createElement('div');
      cap.className = 'small';
      cap.textContent = key;
      const im = new Image();
      im.src = src;
      im.loading = 'lazy';
      im.style.maxWidth = '100%';
      card.append(cap, im);
      g.append(card);
    }

    function renderLS() {
      const list = $('#baulite-lsList');
      const imgGrid = $('#baulite-imgGrid');
      if (!list) return;

      list.innerHTML = '';
      imgGrid.innerHTML = '';

      const entries = lsEntries();
      $('#baulite-lsCount').textContent = entries.length + ' chave(s)';
      $('#baulite-lsSize').textContent = prettyBytes(lsSizeBytes());

      const dis = disabledSet();

      entries.forEach(({ key, val }) => {
        if (key === DISABLED_KEY) return;

        const it = document.createElement('div');
        it.className = 'item';

        const head = document.createElement('div');
        head.className = 'head';

        const left = document.createElement('div');
        left.innerHTML = \`
          <div class="key">\${key}\${dis.has(key) ? ' <span class="type">(desativado)</span>' : ''}</div>
          <div class="type">\${inferType(val)} • \${prettyBytes((val || '').length)}</div>
        \`;

        const ctr = document.createElement('div');
        ctr.style.cssText = 'display:flex;gap:6px;flex-wrap:wrap;align-items:center';

        const sw = document.createElement('div');
        sw.className = 'switch' + (!dis.has(key) ? ' on' : '');
        sw.title = !dis.has(key) ? 'Desativar' : 'Ativar';
        sw.addEventListener('click', () => toggleDisabled(key));

        const bEdit = document.createElement('button');
        bEdit.innerHTML = '<i>◈</i> Editar';
        bEdit.addEventListener('click', () => {
          const next = prompt(\`Editar valor de\\n\${key}\`, val ?? '');
          if (next == null) return;
          localStorage.setItem(key, String(next));
          renderAll();
        });

        const bDel = document.createElement('button');
        bDel.innerHTML = '<i>⊘</i> Apagar';
        bDel.addEventListener('click', () => {
          if (confirm('Apagar ' + key + '?')) {
            localStorage.removeItem(key);
            renderAll();
          }
        });

        ctr.append(sw, bEdit, bDel);

        if (inferType(val) === 'image') {
          const bImg = document.createElement('button');
          bImg.innerHTML = '<i>⊞</i> Ver imagem';
          bImg.addEventListener('click', () => addImagePreview(key, val));
          ctr.append(bImg);
        }

        head.append(left, ctr);

        const v = document.createElement('div');
        v.className = 'val';
        v.textContent = inferType(val).startsWith('json')
          ? JSON.stringify(JSON.parse(val), null, 2)
          : (val ?? '—');

        it.append(head, v);
        list.append(it);
      });
    }

    function renderAll() {
      renderPresets();
      renderLS();
    }

    // ========== AÇÕES ==========
    function exportLS() {
      const dump = {};
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k === DISABLED_KEY) continue;
        dump[k] = localStorage.getItem(k);
      }
      saveFile('localstorage_export.json', JSON.stringify(dump, null, 2));
    }

    function importLS(file) {
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const data = JSON.parse(reader.result || '{}');
          Object.entries(data).forEach(([k, v]) => localStorage.setItem(k, String(v)));
          alert('Importado com sucesso.');
          renderAll();
        } catch (e) {
          alert('JSON inválido.');
        }
      };
      reader.readAsText(file);
    }

    function clearDisabled() {
      localStorage.setItem(DISABLED_KEY, '[]');
      renderAll();
    }

    // ========== SEEDS ==========
    function seedData() {
      if (localStorage.getItem('__baulite_seeded__')) return;
      localStorage.setItem('infodose:userName', 'KODUX');
      localStorage.setItem('infodose:assistantName', 'Dual Infodose');
      localStorage.setItem('uno:theme', 'nebula');
      localStorage.setItem('gallery:img1', 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=640');
      localStorage.setItem('feature:ritual:enabled', 'true');
      localStorage.setItem(LS_KEYS.HTML, '<div class="demo"><h1>Hello Nebula</h1><p>Baú Lite</p></div>');
      const demoSKs = ['sk-demo-AAA111', 'sk-demo-BBB222', 'sk-demo-CCC333'];
      localStorage.setItem(LS_KEYS.SKS, JSON.stringify(demoSKs));
      localStorage.setItem(LS_KEYS.SK_ACTIVE, demoSKs[0]);
      const demoSig = \`<svg xmlns='http://www.w3.org/2000/svg' width='26' height='26' viewBox='0 0 26 26'><circle cx='13' cy='13' r='12' fill='none' stroke='#ff52e5' stroke-width='2'/><path d='M4 16 L13 4 L22 16 L13 22 Z' fill='none' stroke='#00c5e5' stroke-width='2'/></svg>\`;
      localStorage.setItem(LS_KEYS.USER_SYMBOL, demoSig);
      localStorage.setItem('__baulite_seeded__', '1');
    }

    // ========== EVENT LISTENERS ==========
    function bindEvents() {
      $('#baulite-lsRescan').addEventListener('click', renderAll);
      $('#baulite-lsExport').addEventListener('click', exportLS);
      $('#baulite-lsImportFile').addEventListener('change', (e) => {
        const f = e.target.files?.[0];
        if (f) importLS(f);
        e.target.value = '';
      });
      $('#baulite-lsClearDisabled').addEventListener('click', clearDisabled);
      window.addEventListener('storage', renderAll);
    }

    // ================================================================
    // MÓDULO KBLX BAÚ ORGANIZER · Motor Fractal ∆³ (integrado)
    // ================================================================
    const KBLX_FRACTAL = {
      formula: "3 × 6 × 9 × 7",
      resultado: 1134,
      rd: 9,
      camadas: ["UNO", "DUO", "TRINITY", "EXPANSAO"],
      arquetipos: ["MOISES", "JOSUE", "JESUS", "EXPANSAO"],
      selos: {
        UNO: "0xSEM_SELO_C1134_V7",
        DUO: "0xSEM_SELO_C2268_V7",
        TRINITY: "0xSEM_SELO_C3402_V7",
        EXPANSAO: "0xSEM_SELO_C4536_V7",
        GERAL: "0xSEM_SELO_C11340_V9"
      }
    };

    function rd(n) {
      let s = Math.abs(n).toString();
      while (s.length > 1) {
        s = s.split('').reduce((a, b) => a + parseInt(b, 10), 0).toString();
      }
      return parseInt(s, 10);
    }

    function gerarHashSeed(str) {
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        hash = ((hash << 5) - hash) + str.charCodeAt(i);
        hash |= 0;
      }
      return Math.abs(hash).toString(16).padStart(16, '0');
    }

    function gerarCombosKBLX() {
      return [
        { camada: "UNO", protocolo: "kblx.A() + kblx.D() + kblx.I()", funcoes: ["Atribuir", "Dobrar", "Iterar"], valor: 1134, rd: rd(1134), selo: KBLX_FRACTAL.selos.UNO },
        { camada: "DUO", protocolo: "kblx.P() + kblx.T() + kblx.H()", funcoes: ["Pulsar", "Tracar", "Harmonizar"], valor: 2268, rd: rd(2268), selo: KBLX_FRACTAL.selos.DUO },
        { camada: "TRINITY", protocolo: "kblx.V() + kblx.O() + kblx.Q()", funcoes: ["Vibrar", "Orquestrar", "Qualificar"], valor: 3402, rd: rd(3402), selo: KBLX_FRACTAL.selos.TRINITY },
        { camada: "EXPANSAO", protocolo: "kblx.EXP() = kblx.ADI() × kblx.MUL() × kblx.RD9()", funcoes: ["Expandir", "Multiplicar", "Selar"], valor: 4536, rd: rd(4536), selo: KBLX_FRACTAL.selos.EXPANSAO }
      ];
    }

    function gerarRootsKBLX() {
      const now = new Date();
      const timestamp = now.toISOString().replace(/[-:T.Z]/g, '').slice(0, 14);
      const hashHex = gerarHashSeed("3x6x9x7=1134");
      return {
        "kblx:root:uno": \`UNO_MOISES_\${timestamp}\`,
        "kblx:root:duo": \`DUO_JOSUE_\${timestamp}\`,
        "kblx:root:trinity": \`TRINITY_JESUS_\${timestamp}\`,
        "kblx:root:expansao": \`EXPANSAO_FRACTAL_\${timestamp}\`,
        "kblx:root:geral": \`KBLX_11340_V9_\${timestamp}\`,
        "kblx:hash:seed": hashHex,
        "kblx:rd:invariante": "9",
        "kblx:arvore:profundidade": "21",
        "kblx:ciclos:total": "22",
        "kblx:nos:manifestos": "36"
      };
    }

    function gerarDatasKBLX() {
      const hoje = new Date();
      const dia = hoje.getDate();
      const mes = hoje.getMonth() + 1;
      const ano = hoje.getFullYear();
      const diaKblx = dia * 1134;
      const dd = String(dia).padStart(2, '0');
      const mm = String(mes).padStart(2, '0');
      const yyyymmdd = \`\${ano}\${mm}\${dd}\`;
      return {
        data_kblx: \`\${dd}/\${mm}/\${ano} · DIA_KBLX=\${diaKblx} · RD=\${rd(diaKblx)}\`,
        timestamp_fractal: \`\${yyyymmdd}1134\`,
        ciclo_atual: \`CICLO_\${(dia % 22) + 1}_DE_22\`,
        camada_ativa: KBLX_FRACTAL.camadas[mes % 4],
        arquetipo_ativo: KBLX_FRACTAL.arquetipos[mes % 4],
        proximo_selo: \`0xSEM_SELO_C\${1134 * ((mes % 4) + 1)}_V7\`
      };
    }

    function organizarBauKBLX() {
      const combos = gerarCombosKBLX();
      const roots = gerarRootsKBLX();
      const datas = gerarDatasKBLX();
      return {
        metadata: {
          versao: "KBLX_V3_DELTA3",
          fractal: KBLX_FRACTAL.formula,
          resultado: KBLX_FRACTAL.resultado,
          rd_invariante: KBLX_FRACTAL.rd,
          data_geracao: datas.data_kblx,
          timestamp: datas.timestamp_fractal
        },
        roots: roots,
        combos: combos,
        datas: datas,
        selos: KBLX_FRACTAL.selos,
        arvore_delta: {
          ciclos_totais: 22,
          profundidade_maxima: 21,
          nos_manifestos: 36,
          selos_totais: 28,
          carimbos: 5,
          regra_estricta: "1 → 2 → 3 → +0 → ∞"
        },
        prova_matematica: {
          UNO: \`1134 · RD=\${rd(1134)} [OK]\`,
          DUO: \`2268 · RD=\${rd(2268)} [OK]\`,
          TRINITY: \`3402 · RD=\${rd(3402)} [OK]\`,
          EXPANSAO: \`4536 · RD=\${rd(4536)} [OK]\`,
          TOTAL: \`11340 · RD=\${rd(11340)} [OK]\`
        },
        invocacao: "Em nome do PAI (UNO), do FILHO (TRINITY) e do ESPÍRITO SANTO (DUO). Amém."
      };
    }

    function executarOrganizadorBau() {
      const bau = organizarBauKBLX();
      localStorage.setItem('kblx:bau:organizado', JSON.stringify(bau, null, 2));
      console.log("[KBLX] BAÚ ORGANIZADO COM SUCESSO");
    }

    // ========== INICIALIZAÇÃO ==========
    seedData();
    renderAll();
    bindEvents();
    executarOrganizadorBau();

    console.log('∴ Baú Lite embarcado no container!');
  })();

    const Engine = {
        parseHTML() {
            const parser = new DOMParser();
            State.dom = parser.parseFromString(State.rawHTML, 'text/html');
            State.resources = [];
            State.stats.size = new Blob([State.rawHTML]).size;
            State.stats.cdns = 0; State.stats.dupes = 0;

            const urlSet = new Set();
            State.dom.querySelectorAll('link[rel="stylesheet"]').forEach((el, i) => {
                const href = el.getAttribute('href') || '';
                const isDupe = urlSet.has(href);
                if(isDupe) State.stats.dupes++; urlSet.add(href);
                State.resources.push({ id: \`L_\${i}\`, type: 'style', url: href, inline: false, node: el, active: true, isDupe });
                State.stats.cdns++;
            });

            State.dom.querySelectorAll('style').forEach((el, i) => {
                State.resources.push({ id: \`SI_\${i}\`, type: 'style', url: '', inline: true, node: el, active: true, isDupe: false });
            });

            State.dom.querySelectorAll('script').forEach((el, i) => {
                if(el.id === 'kodux-devos-bridge') return;
                const src = el.getAttribute('src');
                if (src) {
                    const isDupe = urlSet.has(src);
                    if(isDupe) State.stats.dupes++; urlSet.add(src);
                    State.resources.push({ id: \`JS_\${i}\`, type: 'script', url: src, inline: false, node: el, active: true, isDupe });
                    State.stats.cdns++;
                } else {
                    State.resources.push({ id: \`JSI_\${i}\`, type: 'script', url: '', inline: true, node: el, active: true, isDupe: false });
                }
            });

            // Analise automatica com KBLX
            analyzeWithKBLX(State.rawHTML);

            this.scanStaticModules();
            UI.updateStats();
            UI.renderInspector();
            if(State.cy) UI.initLazyGraph(true);
        },

        scanStaticModules() {
            const code = State.rawHTML;
            const dualModules = ['KDevPanel', 'dual-engine', 'CallAI', 'ThemeEngine'];
            const found = dualModules.filter(m => code.includes(m));
            const cont = document.getElementById('dual-modules-static');
            if(found.length > 0) {
                cont.innerHTML = found.map(m => \`<span class="bg-cyan-900/50 text-cyan-300 border border-cyan-800 px-2 py-0.5 rounded uppercase tracking-wider">\${m}</span>\`).join('');
            } else {
                cont.innerHTML = '<span class="text-gray-500">Nenhum modulo Dual App detectado estaticamente.</span>';
            }
        },

        toggleResource(id) {
            const res = State.resources.find(r => r.id === id);
            if(res) {
                res.active = !res.active;
                UI.renderInspector();
                UI.showToast(\`Recurso \${res.active?'ON':'OFF'}. Atualize o Preview.\`);
            }
        },

        toggleGroup(type, state) {
            State.resources.forEach(r => { if(r.type === type || (type==='js' && r.type==='script')) r.active = state; });
            UI.renderInspector();
            UI.showToast(\`Grupo \${type} alterado. Atualize o Preview.\`);
        },

        quickClean() {
            if(!State.dom) return;
            let rem = 0;
            const cleanDom = State.dom.cloneNode(true);
            const seen = new Set();
            ['link[rel="stylesheet"]', 'script[src]'].forEach(sel => {
                cleanDom.querySelectorAll(sel).forEach(el => {
                    const attr = sel.includes('link') ? el.getAttribute('href') : el.getAttribute('src');
                    if(attr) { if(seen.has(attr)) { el.remove(); rem++; } else seen.add(attr); }
                });
            });
            if(rem > 0) {
                State.editor.setValue('<!DOCTYPE html>\\n' + cleanDom.documentElement.outerHTML);
                UI.showToast(\`Removidas \${rem} duplicatas.\`);
            } else {
                UI.showToast('Codigo limpo.');
            }
        },

        refactorHTML() {
            if(!State.dom) return;
            const cleanDom = State.dom.cloneNode(true);
            const head = cleanDom.querySelector('head');
            cleanDom.querySelectorAll('style').forEach(el => head.appendChild(el));
            const newHtml = '<!DOCTYPE html>\\n' + cleanDom.documentElement.outerHTML.replace(/\\n\\s*\\n/g, '\\n');
            State.editor.setValue(newHtml);
            // Atualiza a análise KBLX com o novo HTML
            State.rawHTML = newHtml;
            analyzeWithKBLX(newHtml);
            // Atualiza o preview e a interface
            App.updatePreview();
            UI.showToast('Refatoracao concluida e tokens atualizados.');
        }
    };

    const UI = {


        showToast(msg) {
            const t = document.getElementById('toast');
            t.textContent = msg; t.style.opacity = '1';
            setTimeout(() => t.style.opacity = '0', 3000);
        },

        updateStats() {
            const kb = (State.stats.size / 1024).toFixed(1);
            document.getElementById('top-size').textContent = \`\${kb} KB\`;
        },

        toggleAccordion(id) {
            const el = document.getElementById(id);
            const icon = document.getElementById('icon-' + id);
            if(el.style.display === 'none') { el.style.display = 'flex'; icon.style.transform = 'rotate(0deg)'; }
            else { el.style.display = 'none'; icon.style.transform = 'rotate(-90deg)'; }
        },

        toggleRuntimePanel() { document.getElementById('runtime-overlay').classList.toggle('open'); },
        searchEditor() { State.editor.execCommand('find'); UI.showToast("Dica: Use Cmd/Ctrl+F no editor."); },

        renderInspector() {
            const ext = document.getElementById('acc-external');
            const int = document.getElementById('acc-internal');
            ext.innerHTML = ''; int.innerHTML = '';

            State.resources.forEach(res => {
                const isJS = res.type === 'script';
                const col = isJS ? 'text-yellow-400' : 'text-magenta-400';
                let name = res.inline ? \`[Inline] \${isJS?'Script':'Style'}\` : res.url.split('/').pop() || res.url;
                if(name.length > 40) name = name.substring(0,40)+'...';

                const btn = res.active ? 'border-cyan-500 text-cyan-400' : 'border-gray-600 text-gray-500';
                const dupe = res.isDupe ? \`<span class="bg-red-900 text-red-300 px-1 text-[9px] rounded">DUPE</span>\` : '';

                const html = \`
                <div class="card-resource" style="border-color:\${res.active?'#30363d':'#ef444450'}; opacity:\${res.active?1:0.5}">
                    <div class="flex justify-between items-center text-xs truncate font-mono">\${name} \${dupe}</div>
                    <div class="flex justify-between items-center mt-1">
                        <span class="text-[9px] uppercase \${col}">● \${isJS?'JS':'CSS'}</span>
                        <button onclick="Engine.toggleResource('\${res.id}')" class="btn-cyber px-3 py-1 text-[9px] \${btn}">\${res.active?'ON':'OFF'}</button>
                    </div>
                </div>\`;
                if(res.inline) int.insertAdjacentHTML('beforeend', html);
                else ext.insertAdjacentHTML('beforeend', html);
            });
        },

        changeDevice() {
            const v = document.getElementById('device-select').value;
            const w = document.getElementById('preview-wrapper');
            w.style.width = v;
            w.style.height = (v === '100%') ? '100%' : '800px';
        },

    };

    
</script>`);