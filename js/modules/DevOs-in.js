(function(h,s='#DEVOS'){const p=new DOMParser(),c=p.parseFromString(h,'text/html'),f=document.createDocumentFragment(),t=document.querySelector(s)||document.body;Array.from(c.body.childNodes).forEach(n=>f.appendChild(document.importNode(n,true)));t.appendChild(f);Array.from(c.querySelectorAll('script')).forEach(x=>{const n=document.createElement('script');for(const a of x.attributes)n.setAttribute(a.name,a.value);n.textContent=x.textContent;document.body.appendChild(n)})})(`
  <!-- ========================================== -->
  <!-- KODUX DEV PANEL IMPLEMENTATION (UI)        -->
  <!-- ========================================== -->
  
  <!DOCTYPE html>
<html><head>

<meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no">
<link rel="manifest" href="manifest.json"> <meta name="theme-color" content="#05070a"> <link rel="apple-touch-icon" href="icon-192.png">

<style>

:root{
    --bg:#0b0d10; --panel:#14171c; --border:#242830;
    --text:#e6e8eb; --muted:#8b929e; --accent:#6ee7b7; --accent2:#60a5fa;
  }
  *{box-sizing:border-box;}
  body{
    margin:0; font-family:ui-monospace,Menlo,Consolas,monospace;
    background:var(--bg); color:var(--text); min-height:100vh;
  }
  header{
    padding:1.25rem 1.5rem; border-bottom:1px solid var(--border);
    display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:.5rem;
  }
  header h1{font-size:1rem; margin:0; letter-spacing:.05em;}
  header h1 span{color:var(--accent);}
  header p{margin:0; font-size:.75rem; color:var(--muted);}

  main{
    display:grid; grid-template-columns:1fr 1fr; gap:1px; background:var(--border);
  }
  @media (max-width:800px){ main{grid-template-columns:1fr;} }

  .col{background:var(--bg); padding:1rem; display:flex; flex-direction:column; gap:.75rem;}
  .col h2{font-size:.8rem; color:var(--muted); margin:0; text-transform:uppercase; letter-spacing:.05em;}

  textarea, pre{
    width:100%; flex:1; min-height:320px; background:var(--panel);
    border:1px solid var(--border); border-radius:.5rem; color:var(--text);
    padding:.75rem; font-size:.8rem; line-height:1.5; resize:vertical;
    overflow:auto; white-space:pre-wrap; word-break:break-word;
  }

  .actions{display:flex; gap:.5rem; flex-wrap:wrap; align-items:center;}
  button{
    background:var(--accent); color:#06251a; border:none; border-radius:.375rem;
    padding:.5rem 1rem; font-weight:600; font-size:.8rem; cursor:pointer;
  }
  button.secondary{background:var(--panel); color:var(--text); border:1px solid var(--border);}
  button:hover{filter:brightness(1.08);}

  .stats{
    display:flex; gap:1rem; flex-wrap:wrap; font-size:.75rem; color:var(--muted);
  }
  .stats b{color:var(--accent2);}
  .not-found{color:#f97583; font-size:.72rem;}

/* =========================================================
   KOBLLUX CSS CORE — core/flex.css
   Bundle estático completo (uso direto via <link>, sem JS)
   Gerado a partir de js/dictionary.js
   ========================================================= */

/* ---- display ---- */
.flex{display:flex;}
.inline-flex{display:inline-flex;}
.block{display:block;}
.inline-block{display:inline-block;}
.inline{display:inline;}
.hidden{display:none;}
.grid{display:grid;}
.inline-grid{display:inline-grid;}
.table{display:table;}
.contents{display:contents;}
/* ---- flex ---- */
.flex-col{flex-direction:column;}
.flex-row{flex-direction:row;}
.flex-col-reverse{flex-direction:column-reverse;}
.flex-row-reverse{flex-direction:row-reverse;}
.flex-wrap{flex-wrap:wrap;}
.flex-nowrap{flex-wrap:nowrap;}
.flex-1{flex:1 1 0%;}
.flex-auto{flex:1 1 auto;}
.flex-initial{flex:0 1 auto;}
.flex-none{flex:none;}
.items-center{align-items:center;}
.items-start{align-items:flex-start;}
.items-end{align-items:flex-end;}
.items-stretch{align-items:stretch;}
.items-baseline{align-items:baseline;}
.justify-center{justify-content:center;}
.justify-between{justify-content:space-between;}
.justify-around{justify-content:space-around;}
.justify-evenly{justify-content:space-evenly;}
.justify-start{justify-content:flex-start;}
.justify-end{justify-content:flex-end;}
.self-center{align-self:center;}
.self-start{align-self:flex-start;}
.self-end{align-self:flex-end;}
.self-stretch{align-self:stretch;}
.gap-0{gap:0;}
.gap-1{gap:.25rem;}
.gap-2{gap:.5rem;}
.gap-3{gap:.75rem;}
.gap-4{gap:1rem;}
.gap-5{gap:1.25rem;}
.gap-6{gap:1.5rem;}
.gap-8{gap:2rem;}
.gap-10{gap:2.5rem;}
.gap-12{gap:3rem;}


/* =========================================================
   KOBLLUX CSS CORE — core/grid.css
   Bundle estático completo (uso direto via <link>, sem JS)
   Gerado a partir de js/dictionary.js
   ========================================================= */

/* ---- grid ---- */
.grid-cols-1{grid-template-columns:repeat(1,minmax(0,1fr));}
.grid-cols-2{grid-template-columns:repeat(2,minmax(0,1fr));}
.grid-cols-3{grid-template-columns:repeat(3,minmax(0,1fr));}
.grid-cols-4{grid-template-columns:repeat(4,minmax(0,1fr));}
.grid-cols-5{grid-template-columns:repeat(5,minmax(0,1fr));}
.grid-cols-6{grid-template-columns:repeat(6,minmax(0,1fr));}
.grid-cols-12{grid-template-columns:repeat(12,minmax(0,1fr));}
.col-span-1{grid-column:span 1 / span 1;}
.col-span-2{grid-column:span 2 / span 2;}
.col-span-3{grid-column:span 3 / span 3;}
.col-span-full{grid-column:1 / -1;}
.row-span-1{grid-row:span 1 / span 1;}
.row-span-2{grid-row:span 2 / span 2;}


/* =========================================================
   KOBLLUX CSS CORE — core/colors.css
   Bundle estático completo (uso direto via <link>, sem JS)
   Gerado a partir de js/dictionary.js
   ========================================================= */

/* ---- colors ---- */
.text-white{color:#fff;}
.text-black{color:#000;}
.text-gray-400{color:#9ca3af;}
.text-gray-500{color:#6b7280;}
.text-gray-700{color:#374151;}
.text-red-500{color:#ef4444;}
.text-green-500{color:#22c55e;}
.text-blue-500{color:#3b82f6;}
.bg-white{background:#fff;}
.bg-black{background:#000;}
.bg-gray-100{background:#f3f4f6;}
.bg-gray-800{background:#1f2937;}
.bg-red-500{background:#ef4444;}
.bg-green-500{background:#22c55e;}
.bg-blue-500{background:#3b82f6;}
.bg-transparent{background:transparent;}

/* =========================================================
   KOBLLUX CSS CORE — core/typography.css
   Bundle estático completo (uso direto via <link>, sem JS)
   Gerado a partir de js/dictionary.js
   ========================================================= */

/* ---- typography ---- */
.text-xs{font-size:.75rem;}
.text-sm{font-size:.875rem;}
.text-base{font-size:1rem;}
.text-lg{font-size:1.125rem;}
.text-xl{font-size:1.25rem;}
.text-2xl{font-size:1.5rem;}
.text-3xl{font-size:1.875rem;}
.text-4xl{font-size:2.25rem;}
.text-center{text-align:center;}
.text-left{text-align:left;}
.text-right{text-align:right;}
.text-justify{text-align:justify;}
.font-thin{font-weight:100;}
.font-light{font-weight:300;}
.font-normal{font-weight:400;}
.font-medium{font-weight:500;}
.font-semibold{font-weight:600;}
.font-bold{font-weight:700;}
.font-extrabold{font-weight:800;}
.italic{font-style:italic;}
.uppercase{text-transform:uppercase;}
.lowercase{text-transform:lowercase;}
.capitalize{text-transform:capitalize;}
.underline{text-decoration:underline;}
.line-through{text-decoration:line-through;}
.no-underline{text-decoration:none;}
.leading-none{line-height:1;}
.leading-tight{line-height:1.25;}
.leading-normal{line-height:1.5;}
.leading-relaxed{line-height:1.625;}
.tracking-tight{letter-spacing:-.025em;}
.tracking-wide{letter-spacing:.025em;}
.truncate{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
/* ---- transitions ---- */
.transition{transition:all .2s ease;}
.transition-colors{transition:color .2s ease,background-color .2s ease,border-color .2s ease;}
.duration-150{transition-duration:150ms;}
.duration-300{transition-duration:300ms;}
.ease-in-out{transition-timing-function:ease-in-out;}

/* =========================================================
   KOBLLUX CSS CORE — core/spacing.css
   Bundle estático completo (uso direto via <link>, sem JS)
   Gerado a partir de js/dictionary.js
   ========================================================= */

/* ---- size ---- */
.w-full{width:100%;}
.w-screen{width:100vw;}
.w-auto{width:auto;}
.w-1/2{width:50%;}
.w-1/3{width:33.333333%;}
.w-2/3{width:66.666667%;}
.w-1/4{width:25%;}
.w-3/4{width:75%;}
.h-full{height:100%;}
.h-screen{height:100vh;}
.h-auto{height:auto;}
.min-w-0{min-width:0;}
.min-h-screen{min-height:100vh;}
.max-w-xs{max-width:20rem;}
.max-w-sm{max-width:24rem;}
.max-w-md{max-width:28rem;}
.max-w-lg{max-width:32rem;}
.max-w-xl{max-width:36rem;}
.max-w-2xl{max-width:42rem;}
.max-w-full{max-width:100%;}
/* ---- spacing ---- */
.m-0{margin:0;}
.m-1{margin:.25rem;}
.m-2{margin:.5rem;}
.m-4{margin:1rem;}
.m-6{margin:1.5rem;}
.m-8{margin:2rem;}
.mx-auto{margin-left:auto;margin-right:auto;}
.mx-0{margin-left:0;margin-right:0;}
.my-0{margin-top:0;margin-bottom:0;}
.mt-0{margin-top:0;}
.mt-1{margin-top:.25rem;}
.mt-2{margin-top:.5rem;}
.mt-4{margin-top:1rem;}
.mt-6{margin-top:1.5rem;}
.mt-8{margin-top:2rem;}
.mb-0{margin-bottom:0;}
.mb-1{margin-bottom:.25rem;}
.mb-2{margin-bottom:.5rem;}
.mb-4{margin-bottom:1rem;}
.mb-6{margin-bottom:1.5rem;}
.mb-8{margin-bottom:2rem;}
.ml-2{margin-left:.5rem;}
.ml-4{margin-left:1rem;}
.mr-2{margin-right:.5rem;}
.mr-4{margin-right:1rem;}
.p-0{padding:0;}
.p-1{padding:.25rem;}
.p-2{padding:.5rem;}
.p-3{padding:.75rem;}
.p-4{padding:1rem;}
.p-6{padding:1.5rem;}
.p-8{padding:2rem;}
.px-2{padding-left:.5rem;padding-right:.5rem;}
.px-4{padding-left:1rem;padding-right:1rem;}
.px-6{padding-left:1.5rem;padding-right:1.5rem;}
.px-8{padding-left:2rem;padding-right:2rem;}
.py-1{padding-top:.25rem;padding-bottom:.25rem;}
.py-2{padding-top:.5rem;padding-bottom:.5rem;}
.py-3{padding-top:.75rem;padding-bottom:.75rem;}
.py-4{padding-top:1rem;padding-bottom:1rem;}
.py-6{padding-top:1.5rem;padding-bottom:1.5rem;}
/* ---- position ---- */
.relative{position:relative;}
.absolute{position:absolute;}
.fixed{position:fixed;}
.sticky{position:sticky;}
.inset-0{top:0;right:0;bottom:0;left:0;}
.top-0{top:0;}
.bottom-0{bottom:0;}
.left-0{left:0;}
.right-0{right:0;}
.z-0{z-index:0;}
.z-10{z-index:10;}
.z-50{z-index:50;}
.overflow-hidden{overflow:hidden;}
.overflow-auto{overflow:auto;}
.overflow-y-auto{overflow-y:auto;}
.cursor-pointer{cursor:pointer;}
.select-none{user-select:none;}
.pointer-events-none{pointer-events:none;}

/* =========================================================
   KOBLLUX CSS PATCH — classes não encontradas no dicionário
   Gerado pro teu HTML. Mobile-first, sem build.
   ========================================================= */

/* ---- transform + translate ---- */
.transform{transform:translateZ(0);}
.-translate-x-full{transform:translateX(-100%);}

/* ---- backdrop blur ---- */
.backdrop-blur-3xl{backdrop-filter:blur(64px);}
.backdrop-blur-xl{backdrop-filter:blur(24px);}

/* ---- background com opacidade ---- */
.bg-\[\#050505\]\/95{background:rgba(5,5,5,0.95);}
.bg-black\/50{background:rgba(0,0,0,0.5);}
.bg-black\/80{background:rgba(0,0,0,0.8);}
.bg-blue-500\/20{background:rgba(59,130,246,0.2);}
.bg-blue-600{background:#2563eb;}
.bg-white\/5{background:rgba(255,255,255,0.05);}
.bg-white\/\[0\.02\]{background:rgba(255,255,255,0.02);}

/* ---- border ---- */
.border-blue-500\/30{border-color:rgba(59,130,246,0.3);}
.border-none{border:none;}
.border-r{border-right:1px solid #e5e7eb;}
.border-white\/10{border-color:rgba(255,255,255,0.1);}
.border-white\/5{border-color:rgba(255,255,255,0.05);}

/* ---- position ---- */
.bottom-6{bottom:1.5rem;}
.inset-y-0{top:0;bottom:0;}
.left-6{left:1.5rem;}

/* ---- sizing ---- */
.h-3{height:.75rem;}
.h-4{height:1rem;}
.h-5{height:1.25rem;}
.h-6{height:1.5rem;}
.w-3{width:.75rem;}
.w-4{width:1rem;}
.w-5{width:1.25rem;}
.w-6{width:1.5rem;}
.w-\[90\%\]{width:90%;}

/* ---- spacing ---- */
.mt-3{margin-top:.75rem;}
.px-3{padding-left:.75rem;padding-right:.75rem;}
.space-y-2 > :not([hidden]) ~ :not([hidden]){margin-top:.5rem;}
.space-y-3 > :not([hidden]) ~ :not([hidden]){margin-top:.75rem;}
.space-y-8 > :not([hidden]) ~ :not([hidden]){margin-top:2rem;}

/* ---- typography ---- */
.font-display{font-family:ui-sans-serif,system-ui,sans-serif;}
.font-mono{font-family:ui-monospace,Menlo,Consolas,monospace;}
.text-\[10px\]{font-size:10px;}
.text-\[8px\]{font-size:8px;}
.text-\[9px\]{font-size:9px;}
.text-blue-400{color:#60a5fa;}
.text-white\/30{color:rgba(255,255,255,0.3);}
.text-white\/40{color:rgba(255,255,255,0.4);}
.text-white\/70{color:rgba(255,255,255,0.7);}
.tracking-\[0\.2em\]{letter-spacing:.2em;}
.tracking-widest{letter-spacing:.1em;}

/* ---- effects ---- */
.shadow-2xl{box-shadow:0 25px 50px -12px rgba(0,0,0,0.25);}
.shadow-\[0_0_15px_rgba\(37\,99\,235\,0\.3\)\]{box-shadow:0 0 15px rgba(37,99,235,0.3);}
.shadow-\[20px_0_50px_rgba\(0\,0\,0\,0\.5\)\]{box-shadow:20px 0 50px rgba(0,0,0,0.5);}

/* ---- transitions ---- */
.duration-500{transition-duration:500ms;}
.ease-\[cubic-bezier\(0\.16\,1\,0\.3\,1\)\]{transition-timing-function:cubic-bezier(0.16,1,0.3,1);}
.transition-all{transition:all.2s ease;}
.transition-transform{transition:transform.2s ease;}

/* ---- states ---- */
.hover\:bg-blue-500\/40:hover{background:rgba(59,130,246,0.4);}
.hover\:border-blue-500\/50:hover{border-color:rgba(59,130,246,0.5);}
.hover\:scale-105:hover{transform:scale(1.05);}
.focus\:border-blue-500\/50:focus{border-color:rgba(59,130,246,0.5);}
.group:hover.group-hover\:text-blue-400{color:#60a5fa;}
.outline-none{outline:none;}

/* ---- z-index ---- */
.z-\[99998\]{z-index:99998;}
.z-\[99999\]{z-index:99999;}

/* ---- responsive ---- */
@media (min-width:768px){
 .md\:w-\[420px\]{width:420px;}
}

/* ---- util ---- */
.group{position:relative;}
.dev-scroll{scroll-behavior:smooth;}



/* ============================================
   KOBLLUX mini-tailwind.css — gerado automaticamente
   Apenas as classes realmente usadas no HTML
   ============================================ */

.bg-transparent{background:transparent;}
.border{border:1px solid #e5e7eb;}
.border-b{border-bottom:1px solid #e5e7eb;}
.border-t{border-top:1px solid #e5e7eb;}
.cursor-pointer{cursor:pointer;}
.fixed{position:fixed;}
.flex{display:flex;}
.flex-1{flex:1 1 0%;}
.flex-col{flex-direction:column;}
.font-bold{font-weight:700;}
.gap-2{gap:.5rem;}
.group-hover\:text-white{color:#fff;}
.hidden{display:none;}
.hover\:bg-blue-500:hover{background:#3b82f6;}
.hover\:text-white:hover{color:#fff;}
.items-center{align-items:center;}
.justify-between{justify-content:space-between;}
.justify-center{justify-content:center;}
.left-0{left:0;}
.mb-4{margin-bottom:1rem;}
.mt-1{margin-top:.25rem;}
.overflow-y-auto{overflow-y:auto;}
.p-1{padding:.25rem;}
.p-2{padding:.5rem;}
.p-3{padding:.75rem;}
.p-4{padding:1rem;}
.p-6{padding:1.5rem;}
.px-2{padding-left:.5rem;padding-right:.5rem;}
.py-2{padding-top:.5rem;padding-bottom:.5rem;}
.py-3{padding-top:.75rem;padding-bottom:.75rem;}
.rounded{border-radius:.25rem;}
.rounded-2xl{border-radius:1rem;}
.rounded-lg{border-radius:.5rem;}
.rounded-xl{border-radius:.75rem;}
.text-blue-500{color:#3b82f6;}
.text-center{text-align:center;}
.text-white{color:#fff;}
.text-xs{font-size:.75rem;}
.transition{transition:all .2s ease;}
.transition-colors{transition:color .2s ease,background-color .2s ease,border-color .2s ease;}
.uppercase{text-transform:uppercase;}
.w-full{width:100%;}

@media (min-width:768px){
  .md\:block{display:block;}
}

/* =========================================================
   KOBLLUX CSS PATCH — classes não encontradas no dicionário
   Gerado pro teu HTML. Mobile-first, sem build.
   ========================================================= */

/* ---- transform + translate ---- */
.transform{transform:translateZ(0);}
.-translate-x-full{transform:translateX(-100%);}

/* ---- backdrop blur ---- */
.backdrop-blur-3xl{backdrop-filter:blur(64px);}
.backdrop-blur-xl{backdrop-filter:blur(24px);}

/* ---- background com opacidade ---- */
.bg-\[\#050505\]\/95{background:rgba(5,5,5,0.95);}
.bg-black\/50{background:rgba(0,0,0,0.5);}
.bg-black\/80{background:rgba(0,0,0,0.8);}
.bg-blue-500\/20{background:rgba(59,130,246,0.2);}
.bg-blue-600{background:#2563eb;}
.bg-white\/5{background:rgba(255,255,255,0.05);}
.bg-white\/\[0\.02\]{background:rgba(255,255,255,0.02);}

/* ---- border ---- */
.border-blue-500\/30{border-color:rgba(59,130,246,0.3);}
.border-none{border:none;}
.border-r{border-right:1px solid #e5e7eb;}
.border-white\/10{border-color:rgba(255,255,255,0.1);}
.border-white\/5{border-color:rgba(255,255,255,0.05);}

/* ---- position ---- */
.bottom-6{bottom:1.5rem;}
.inset-y-0{top:0;bottom:0;}
.left-6{left:1.5rem;}

/* ---- sizing ---- */
.h-3{height:.75rem;}
.h-4{height:1rem;}
.h-5{height:1.25rem;}
.h-6{height:1.5rem;}
.w-3{width:.75rem;}
.w-4{width:1rem;}
.w-5{width:1.25rem;}
.w-6{width:1.5rem;}
.w-\[90\%\]{width:90%;}

/* ---- spacing ---- */
.mt-3{margin-top:.75rem;}
.px-3{padding-left:.75rem;padding-right:.75rem;}
.space-y-2 > :not([hidden]) ~ :not([hidden]){margin-top:.5rem;}
.space-y-3 > :not([hidden]) ~ :not([hidden]){margin-top:.75rem;}
.space-y-8 > :not([hidden]) ~ :not([hidden]){margin-top:2rem;}

/* ---- typography ---- */
.font-display{font-family:ui-sans-serif,system-ui,sans-serif;}
.font-mono{font-family:ui-monospace,Menlo,Consolas,monospace;}
.text-\[10px\]{font-size:10px;}
.text-\[8px\]{font-size:8px;}
.text-\[9px\]{font-size:9px;}
.text-blue-400{color:#60a5fa;}
.text-white\/30{color:rgba(255,255,255,0.3);}
.text-white\/40{color:rgba(255,255,255,0.4);}
.text-white\/70{color:rgba(255,255,255,0.7);}
.tracking-\[0\.2em\]{letter-spacing:.2em;}
.tracking-widest{letter-spacing:.1em;}

/* ---- effects ---- */
.shadow-2xl{box-shadow:0 25px 50px -12px rgba(0,0,0,0.25);}
.shadow-\[0_0_15px_rgba\(37\,99\,235\,0\.3\)\]{box-shadow:0 0 15px rgba(37,99,235,0.3);}
.shadow-\[20px_0_50px_rgba\(0\,0\,0\,0\.5\)\]{box-shadow:20px 0 50px rgba(0,0,0,0.5);}

/* ---- transitions ---- */
.duration-500{transition-duration:500ms;}
.ease-\[cubic-bezier\(0\.16\,1\,0\.3\,1\)\]{transition-timing-function:cubic-bezier(0.16,1,0.3,1);}
.transition-all{transition:all.2s ease;}
.transition-transform{transition:transform.2s ease;}

/* ---- states ---- */
.hover\:bg-blue-500\/40:hover{background:rgba(59,130,246,0.4);}
.hover\:border-blue-500\/50:hover{border-color:rgba(59,130,246,0.5);}
.hover\:scale-105:hover{transform:scale(1.05);}
.focus\:border-blue-500\/50:focus{border-color:rgba(59,130,246,0.5);}
.group:hover.group-hover\:text-blue-400{color:#60a5fa;}
.outline-none{outline:none;}

/* ---- z-index ---- */
.z-\[99998\]{z-index:99998;}
.z-\[99999\]{z-index:99999;}

/* ---- responsive ---- */
@media (min-width:768px){
 .md\:w-\[420px\]{width:420px;}
}

/* ---- util ---- */
.group{position:relative;}
.dev-scroll{scroll-behavior:smooth;}

</style>
<link rel="stylesheet" href="./css/main.css"></head><body><button id="dev-btn" onclick="KDevPanel.toggle()" class="fixed bottom-6 left-6 z-[99998] bg-black/80 backdrop-blur-xl border border-white/10 text-white/70 hover:text-white p-3 rounded-2xl shadow-2xl transition-all hover:scale-105 hover:border-blue-500/50 group flex items-center gap-2">
</head>
 <body>
 <i data-lucide="terminal" class="w-5 h-5 group-hover:text-blue-400 transition-colors"></i>
    <span class="text-[10px] font-mono font-bold uppercase tracking-widest hidden md:block">Dev Panel</span>
  </button>

  <!-- Panel Drawer -->
  <div id="dev-panel" class="fixed inset-y-0 left-0 w-[90%] md:w-[420px] bg-[#050505]/95 backdrop-blur-3xl border-r border-white/10 z-[99999] transform -translate-x-full transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col shadow-[20px_0_50px_rgba(0,0,0,0.5)]">
     
     <!-- Header -->
     <div class="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
         <div>
             <h3 class="text-white font-display font-bold tracking-widest uppercase text-xs flex items-center gap-2">
                <i data-lucide="cpu" class="w-4 h-4 text-blue-500"></i> Fusion DevOS
             </h3>
             <p class="text-[9px] text-white/30 font-mono mt-1">Inspeção de Assets &amp; Variáveis</p>
         </div>
         <button onclick="KDevPanel.toggle()" class="text-white/30 hover:text-white bg-white/5 p-2 rounded-lg transition-colors"><i data-lucide="x" class="w-4 h-4"></i></button>
     </div>
     
     <!-- Content -->
     <div class="p-6 flex-1 overflow-y-auto dev-scroll space-y-8">
         
         <!-- Theme Variables -->
         <div>
             <h4 class="text-[10px] uppercase text-white/40 font-bold tracking-[0.2em] mb-4 flex items-center gap-2">
                 <i data-lucide="palette" class="w-3 h-3"></i> Variáveis CSS Globais
             </h4>
             <div class="space-y-3 bg-white/[0.02] p-4 rounded-xl border border-white/5">
                 
                 <div class="flex justify-between items-center group">
                     <span class="text-[10px] font-mono text-white/70 group-hover:text-white transition-colors">--bg (Fundo Topo)</span>
                     <div class="flex items-center gap-2">
                         <span id="val--bg" class="text-[9px] text-white/30 font-mono">#050505</span>
                         <input type="color" value="#050505" oninput="KDevPanel.updateVar('--bg', this.value)" class="w-6 h-6 rounded cursor-pointer bg-transparent border-none outline-none">
                     </div>
                 </div>
                 
                 <div class="flex justify-between items-center group">
                     <span class="text-[10px] font-mono text-white/70 group-hover:text-white transition-colors">--bg-dark (Fundo Base)</span>
                     <div class="flex items-center gap-2">
                         <span id="val--bg-dark" class="text-[9px] text-white/30 font-mono">#000000</span>
                         <input type="color" value="#000000" oninput="KDevPanel.updateVar('--bg-dark', this.value)" class="w-6 h-6 rounded cursor-pointer bg-transparent border-none outline-none">
                     </div>
                 </div>
                 
                 <div class="flex justify-between items-center group">
                     <span class="text-[10px] font-mono text-white/70 group-hover:text-white transition-colors">--active-color</span>
                     <div class="flex items-center gap-2">
                         <span id="val--active-color" class="text-[9px] text-white/30 font-mono">#3b82f6</span>
                         <input type="color" value="#3b82f6" oninput="KDevPanel.updateVar('--active-color', this.value)" class="w-6 h-6 rounded cursor-pointer bg-transparent border-none outline-none">
                     </div>
                 </div>
                 
             </div>
         </div>

         <!-- Active Links/Scripts -->
         <div>
             <div class="flex justify-between items-center mb-4">
                 <h4 class="text-[10px] uppercase text-white/40 font-bold tracking-[0.2em] flex items-center gap-2">
                     <i data-lucide="link" class="w-3 h-3"></i> Recursos (Links &amp; Scripts)
                 </h4>
                 <button onclick="KDevPanel.scan()" class="text-blue-400 hover:text-white transition p-1"><i data-lucide="refresh-cw" class="w-3 h-3"></i></button>
             </div>
             
             <!-- Add New Resource -->
             <div class="flex gap-2 mb-4">
                 <select id="dev-new-type" class="bg-white/5 border border-white/10 rounded-lg text-[10px] text-white px-2 outline-none">
                     <option value="css">CSS</option>
                     <option value="js">JS</option>
                 </select>
                 <input id="dev-new-url" type="text" placeholder="https://..." class="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-[10px] text-white outline-none focus:border-blue-500/50">
                 <button onclick="KDevPanel.addResource()" class="bg-blue-500/20 text-blue-400 px-3 rounded-lg border border-blue-500/30 hover:bg-blue-500/40 transition">
                     <i data-lucide="plus" class="w-3 h-3"></i>
                 </button>
             </div>

             <!-- Resources List -->
             <div id="dev-resources-list" class="space-y-2">
                 <!-- Injected by JS -->
             </div>
         </div>

     </div>
     
     <!-- Footer Controls -->
     <div class="p-6 border-t border-white/5 bg-black/50">
         <button onclick="KDevPanel.exportHTML()" class="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(37,99,235,0.3)]">
             <i data-lucide="download" class="w-4 h-4"></i> Exportar HTML Final
         </button>
         <p class="text-center text-[8px] text-white/30 mt-3 font-mono">O painel será removido automaticamente do código exportado.</p>
     </div>
  </div>


  <!-- ORIGINAL SCRIPTS -->

  <script src="https://unpkg.com/lucide@latest"></script>
  
  <script src="https://kodux78k.github.io/oiDual--Y-/M0D/diHome/js/modules/inline-0B.js"></script>
  <script src="https://kodux78k.github.io/oiDual--Y-/M0D/diHome/js/modules/inline-0.js"></script>
  <script src="https://kodux78k.github.io/oiDual--Y-/M0D/diHome/js/modules/inline-1.js"></script>
  <script src="https://kodux78k.github.io/oiDual--Y-/M0D/diHome/js/modules/inline-0K.js"></script>
  
  
    <script src="https://kodux78k.github.io/oiDual--Y-/M0D/DevOs/js/modules/inline-0-kdev.js"></script>

  <!-- ========================================== -->
  <!-- KODUX DEV PANEL IMPLEMENTATION (LOGIC)     -->
  <!-- ========================================== -->
  

</body>
</html>
`);
