(function(h,s='#DEVOS'){const p=new DOMParser(),c=p.parseFromString(h,'text/html'),f=document.createDocumentFragment(),t=document.querySelector(s)||document.body;Array.from(c.body.childNodes).forEach(n=>f.appendChild(document.importNode(n,true)));t.appendChild(f);Array.from(c.querySelectorAll('script')).forEach(x=>{const n=document.createElement('script');for(const a of x.attributes)n.setAttribute(a.name,a.value);n.textContent=x.textContent;document.body.appendChild(n)})})(`
 <!-- ========================================== -->
  <!-- KODUX DEV PANEL IMPLEMENTATION (UI)        -->
  <!-- ========================================== -->
  
  <!DOCTYPE html>
<html><head>

<meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no">
<link rel="manifest" href="manifest.json"> <meta name="theme-color" content="#05070a"> <link rel="apple-touch-icon" href="icon-192.png">


<link rel="stylesheet" href="https://www.infodose.com.br/css/78DevOs.css"></head>
<body>

<div class="kdev-wrapper">
  <!-- Trigger Button -->
  <button id="dev-btn" onclick="KDevPanel.toggle()" class="kdev-btn">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="kdev-icon kdev-icon-lg"><polyline points="4 17 10 11 4 5"></polyline><line x1="12" y1="19" x2="20" y2="19"></line></svg>
    <span class="kdev-btn-text">Dev Panel</span>
  </button>
  <!-- Panel Drawer -->
  <div id="dev-panel" class="kdev-panel">
     <!-- Header -->
     <div class="kdev-header">
         <div>
             <h3 class="kdev-title">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="kdev-icon kdev-icon-md"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect><rect x="9" y="9" width="6" height="6"></rect><line x1="9" y1="1" x2="9" y2="4"></line><line x1="15" y1="1" x2="15" y2="4"></line><line x1="9" y1="20" x2="9" y2="23"></line><line x1="15" y1="20" x2="15" y2="23"></line><line x1="20" y1="9" x2="23" y2="9"></line><line x1="20" y1="14" x2="23" y2="14"></line><line x1="1" y1="9" x2="4" y2="9"></line><line x1="1" y1="14" x2="4" y2="14"></line></svg> 
                Fusion DevOS
             </h3>
             <p class="kdev-subtitle kdev-font-mono">Inspeção de Assets &amp; Variáveis</p>
         </div>
         <button onclick="KDevPanel.toggle()" class="kdev-close">
             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="kdev-icon kdev-icon-md"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
         </button>
     </div>
     <!-- Content -->
     <div class="kdev-content">
         <!-- Theme Variables -->
         <div>
             <h4 class="kdev-section-title">
                 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="kdev-icon kdev-icon-sm"><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"></circle><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"></circle><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"></circle><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"></circle><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"></path></svg> 
                 Variáveis CSS Globais
             </h4>
             <div class="kdev-var-box">
                 <div class="kdev-var-row">
                     <span class="kdev-var-name kdev-font-mono">--bg (Fundo Topo)</span>
                     <div class="kdev-var-controls">
                         <span id="val--bg" class="kdev-var-val">#050505</span>
                         <input type="color" value="#050505" oninput="KDevPanel.updateVar('--bg', this.value)" class="kdev-color-input">
                     </div>
                 </div>
                 <div class="kdev-var-row">
                     <span class="kdev-var-name kdev-font-mono">--bg-dark (Fundo Base)</span>
                     <div class="kdev-var-controls">
                         <span id="val--bg-dark" class="kdev-var-val">#000000</span>
                         <input type="color" value="#000000" oninput="KDevPanel.updateVar('--bg-dark', this.value)" class="kdev-color-input">
                     </div>
                 </div>
                 <div class="kdev-var-row">
                     <span class="kdev-var-name kdev-font-mono">--active-color</span>
                     <div class="kdev-var-controls">
                         <span id="val--active-color" class="kdev-var-val">#3b82f6</span>
                         <input type="color" value="#3b82f6" oninput="KDevPanel.updateVar('--active-color', this.value)" class="kdev-color-input">
                     </div>
                 </div>
             </div>
         </div>
         <!-- Active Links/Scripts -->
         <div>
             <div class="kdev-res-header">
                 <h4 class="kdev-section-title">
                     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="kdev-icon kdev-icon-sm"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg> 
                     Recursos (Links &amp; Scripts)
                 </h4>
                 <button onclick="KDevPanel.scan()" class="kdev-refresh">
                     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="kdev-icon kdev-icon-sm"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path><path d="M3 3v5h5"></path></svg>
                 </button>
             </div>
             <!-- Add New Resource -->
             <div class="kdev-add-row">
                 <select id="dev-new-type" class="kdev-select">
                     <option value="css">CSS</option>
                     <option value="js">JS</option>
                 </select>
                 <input id="dev-new-url" type="text" placeholder="https://..." class="kdev-input">
                 <button onclick="KDevPanel.addResource()" class="kdev-add-btn">
                     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="kdev-icon kdev-icon-sm"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                 </button>
             </div>
             <!-- Resources List -->
             <div id="dev-resources-list" class="kdev-res-list">
                 <!-- Injected by JS -->
             </div>
         </div>
     </div>
     <!-- Footer Controls -->
     <div class="kdev-footer">
         <button onclick="KDevPanel.exportHTML()" class="kdev-export-btn">
             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="kdev-icon kdev-icon-md"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
             Exportar HTML Final
         </button>
         <p class="kdev-footer-text kdev-font-mono">O painel será removido automaticamente do código exportado.</p>
     </div>
  </div>
</div>

<script src="https://www.infodose.com.br/js/modules/k-DevOs.js"</script>

  <!-- ORIGINAL SCRIPTS -->

  <script src="https://unpkg.com/lucide@latest"></script>
  

  <!-- ========================================== -->
  <!-- KODUX DEV PANEL IMPLEMENTATION (LOGIC)     -->
  <!-- ========================================== -->
  

</body>
</html>
`);
