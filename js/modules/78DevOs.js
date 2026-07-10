(function(h,s='#DEVOS'){const p=new DOMParser(),c=p.parseFromString(h,'text/html'),f=document.createDocumentFragment(),t=document.querySelector(s)||document.body;Array.from(c.body.childNodes).forEach(n=>f.appendChild(document.importNode(n,true)));t.appendChild(f);Array.from(c.querySelectorAll('script')).forEach(x=>{const n=document.createElement('script');for(const a of x.attributes)n.setAttribute(a.name,a.value);n.textContent=x.textContent;document.body.appendChild(n)})})(`
<!-- ========================================== -->
<!-- KODUX DEV PANEL IMPLEMENTATION (UI)        -->
<!-- ========================================== -->

<style id="kdev-styles">
  /* CSS Base e Isolamento */
  .kdev-wrapper * {
    box-sizing: border-box;
    font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  }
  
  .kdev-font-mono {
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  }

  /* SVG Icons */
  .kdev-icon { fill: none; stroke: currentColor; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
  .kdev-icon-lg { width: 1.25rem; height: 1.25rem; }
  .kdev-icon-md { width: 1rem; height: 1rem; }
  .kdev-icon-sm { width: 0.75rem; height: 0.75rem; }

  /* Trigger Button */
  .kdev-btn {
    position: fixed;
    bottom: 1.5rem;
    left: 1.5rem;
    z-index: 99998;
    background-color: rgba(0, 0, 0, 0.8);
    backdrop-filter: blur(24px);
    -webkit-backdrop-filter: blur(24px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: rgba(255, 255, 255, 0.7);
    padding: 0.75rem;
    border-radius: 1rem;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
  }
  .kdev-btn:hover {
    color: white;
    transform: scale(1.05);
    border-color: rgba(59, 130, 246, 0.5);
  }
  .kdev-btn svg { transition: color 0.3s ease; }
  .kdev-btn:hover svg { color: #60a5fa; }
  
  .kdev-btn-text {
    font-size: 10px;
    font-weight: bold;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    display: none;
  }
  @media (min-width: 768px) {
    .kdev-btn-text { display: block; }
  }

  /* Panel Drawer */
  .kdev-panel {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    width: 90%;
    background-color: rgba(5, 5, 5, 0.95);
    backdrop-filter: blur(64px);
    -webkit-backdrop-filter: blur(64px);
    border-right: 1px solid rgba(255, 255, 255, 0.1);
    z-index: 99999;
    transform: translateX(-100%);
    transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
    display: flex;
    flex-direction: column;
    box-shadow: 20px 0 50px rgba(0, 0, 0, 0.5);
  }
  @media (min-width: 768px) {
    .kdev-panel { width: 420px; }
  }
  .kdev-panel--open { transform: translateX(0); }

  /* Header */
  .kdev-header {
    padding: 1.5rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: rgba(255, 255, 255, 0.02);
  }
  .kdev-title {
    color: white;
    font-weight: bold;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    font-size: 0.75rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin: 0;
  }
  .kdev-title svg { color: #3b82f6; }
  .kdev-subtitle {
    font-size: 9px;
    color: rgba(255, 255, 255, 0.3);
    margin: 0.25rem 0 0 0;
  }
  .kdev-close {
    color: rgba(255, 255, 255, 0.3);
    background-color: rgba(255, 255, 255, 0.05);
    padding: 0.5rem;
    border-radius: 0.5rem;
    border: none;
    cursor: pointer;
    transition: color 0.3s ease;
    display: flex;
  }
  .kdev-close:hover { color: white; }

  /* Content */
  .kdev-content {
    padding: 1.5rem;
    flex: 1;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }
  .kdev-content::-webkit-scrollbar { width: 4px; }
  .kdev-content::-webkit-scrollbar-track { background: transparent; }
  .kdev-content::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 4px; }

  .kdev-section-title {
    font-size: 10px;
    text-transform: uppercase;
    color: rgba(255, 255, 255, 0.4);
    font-weight: bold;
    letter-spacing: 0.2em;
    margin: 0 0 1rem 0;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  /* Variables Section */
  .kdev-var-box {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    background-color: rgba(255, 255, 255, 0.02);
    padding: 1rem;
    border-radius: 0.75rem;
    border: 1px solid rgba(255, 255, 255, 0.05);
  }
  .kdev-var-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .kdev-var-name {
    font-size: 10px;
    color: rgba(255, 255, 255, 0.7);
    transition: color 0.3s ease;
  }
  .kdev-var-row:hover .kdev-var-name { color: white; }
  .kdev-var-controls { display: flex; align-items: center; gap: 0.5rem; }
  .kdev-var-val { font-size: 9px; color: rgba(255, 255, 255, 0.3); }
  .kdev-color-input {
    width: 1.5rem;
    height: 1.5rem;
    border-radius: 0.25rem;
    cursor: pointer;
    background: transparent;
    border: none;
    outline: none;
    padding: 0;
  }

  /* Resources Section */
  .kdev-res-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }
  .kdev-res-header .kdev-section-title { margin-bottom: 0; }
  .kdev-refresh {
    color: #60a5fa;
    background: none;
    border: none;
    padding: 0.25rem;
    cursor: pointer;
    transition: color 0.3s;
    display: flex;
  }
  .kdev-refresh:hover { color: white; }

  .kdev-add-row {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 1rem;
  }
  .kdev-select {
    background-color: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 0.5rem;
    font-size: 10px;
    color: white;
    padding: 0 0.5rem;
    outline: none;
  }
  .kdev-select option { background-color: #050505; color: white; }
  .kdev-input {
    flex: 1;
    background-color: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 0.5rem;
    padding: 0.5rem 0.75rem;
    font-size: 10px;
    color: white;
    outline: none;
    transition: border-color 0.3s;
  }
  .kdev-input:focus { border-color: rgba(59, 130, 246, 0.5); }
  .kdev-add-btn {
    background-color: rgba(59, 130, 246, 0.2);
    color: #60a5fa;
    padding: 0 0.75rem;
    border-radius: 0.5rem;
    border: 1px solid rgba(59, 130, 246, 0.3);
    cursor: pointer;
    transition: background-color 0.3s;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .kdev-add-btn:hover { background-color: rgba(59, 130, 246, 0.4); }

  /* Resource Cards (Injected via JS) */
  .kdev-res-list { display: flex; flex-direction: column; gap: 0.5rem; }
  .kdev-res-empty { font-size: 10px; color: rgba(255,255,255,0.3); text-align: center; padding: 1rem 0; margin: 0; }
  .kdev-card {
    padding: 0.75rem;
    border-radius: 0.75rem;
    border: 1px solid;
    transition: all 0.3s;
  }
  .kdev-card--normal { background-color: rgba(255, 255, 255, 0.02); border-color: rgba(255, 255, 255, 0.05); }
  .kdev-card--kodux { background-color: rgba(30, 58, 138, 0.1); border-color: rgba(59, 130, 246, 0.3); }
  .kdev-card--disabled { opacity: 0.5; filter: grayscale(100%); }
  
  .kdev-card-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; }
  .kdev-badges { display: flex; align-items: center; gap: 0.5rem; }
  .kdev-badge { padding: 0.125rem 0.5rem; border-radius: 0.25rem; font-size: 8px; font-weight: bold; text-transform: uppercase; }
  .kdev-badge--css { color: #f472b6; background-color: rgba(244, 114, 182, 0.1); }
  .kdev-badge--js { color: #facc15; background-color: rgba(250, 204, 21, 0.1); }
  .kdev-badge-kodux { font-size: 8px; font-weight: bold; letter-spacing: 0.1em; color: #60a5fa; text-transform: uppercase; display: flex; align-items: center; gap: 0.25rem; }
  
  /* Toggle Switch */
  .kdev-toggle { position: relative; display: inline-flex; align-items: center; cursor: pointer; }
  .kdev-toggle-input { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border-width: 0; }
  .kdev-toggle-bg { width: 1.75rem; height: 1rem; background-color: rgba(255, 255, 255, 0.1); border-radius: 9999px; transition: background-color 0.3s; position: relative; }
  .kdev-toggle-bg::after { content: ''; position: absolute; top: 2px; left: 2px; background-color: white; border: 1px solid #d1d5db; border-radius: 50%; height: 0.75rem; width: 0.75rem; transition: transform 0.3s; }
  .kdev-toggle-input:checked + .kdev-toggle-bg { background-color: #3b82f6; }
  .kdev-toggle-input:checked + .kdev-toggle-bg::after { transform: translateX(100%); border-color: white; }

  .kdev-card-bottom { display: flex; align-items: center; gap: 0.5rem; }
  .kdev-res-input {
    flex: 1;
    background-color: rgba(0, 0, 0, 0.4);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 0.25rem;
    padding: 0.375rem 0.5rem;
    font-size: 9px;
    color: rgba(255, 255, 255, 0.7);
    outline: none;
    transition: border-color 0.3s, color 0.3s;
  }
  .kdev-res-input:focus { border-color: rgba(59, 130, 246, 0.5); color: white; }
  .kdev-delete { color: rgba(255, 255, 255, 0.2); background: none; border: none; padding: 0.25rem; cursor: pointer; transition: color 0.3s; display: flex; }
  .kdev-delete:hover { color: #f87171; }

  /* Footer Controls */
  .kdev-footer {
    padding: 1.5rem;
    border-top: 1px solid rgba(255, 255, 255, 0.05);
    background-color: rgba(0, 0, 0, 0.5);
  }
  .kdev-export-btn {
    width: 100%;
    background-color: #2563eb;
    color: white;
    padding: 0.75rem;
    border-radius: 0.75rem;
    font-size: 10px;
    font-weight: bold;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    border: none;
    cursor: pointer;
    transition: background-color 0.3s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    box-shadow: 0 0 15px rgba(37, 99, 235, 0.3);
  }
  .kdev-export-btn:hover { background-color: #3b82f6; }
  .kdev-footer-text {
    text-align: center;
    font-size: 8px;
    color: rgba(255, 255, 255, 0.3);
    margin: 0.75rem 0 0 0;
  }
</style>

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
                 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="kdev-icon kdev-icon-sm"><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg> 
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

<!-- ORIGINAL SCRIPTS -->
<script src="https://kodux78k.github.io/oiDual--Y-/M0D/diHome/js/modules/inline-0B.js"></script>
<script src="https://kodux78k.github.io/oiDual--Y-/M0D/diHome/js/modules/inline-0.js"></script>
<script src="https://kodux78k.github.io/oiDual--Y-/M0D/diHome/js/modules/inline-1.js"></script>
<script src="https://kodux78k.github.io/oiDual--Y-/M0D/diHome/js/modules/inline-0K.js"></script>

<!-- ========================================== -->
<!-- KODUX DEV PANEL IMPLEMENTATION (LOGIC)     -->
<!-- ========================================== -->
<script>
  const KDevPanel = {
      isOpen: false,
      resources: [],
      
      init() {
          this.scan();
      },

      toggle() {
          const panel = document.getElementById('dev-panel');
          this.isOpen = !this.isOpen;
          if(this.isOpen) {
              this.scan(); 
              panel.classList.add('kdev-panel--open');
          } else {
              panel.classList.remove('kdev-panel--open');
          }
      },

      updateVar(varName, value) {
          document.documentElement.style.setProperty(varName, value);
          const displaySpan = document.getElementById(`val${varName}`);
          if(displaySpan) displaySpan.innerText = value;
      },

      scan() {
          this.resources = [];
          const elements = document.querySelectorAll('link[rel="stylesheet"], script[src]');
          
          elements.forEach((el) => {
              const type = el.tagName.toLowerCase() === 'link' ? 'css' : 'js';
              const url = type === 'css' ? el.href : el.src;
              
              const isCore = url.includes('tailwindcss') || url.includes('lucide');
              const isKodux = url.includes('kodux');
              
              let active = true;
              if(type === 'css') active = !el.disabled;
              else active = el.getAttribute('data-dev-disabled') !== 'true';

              this.resources.push({ el, type, url, active, isCore, isKodux });
          });
          
          this.render();
      },

      render() {
          const container = document.getElementById('dev-resources-list');
          container.innerHTML = '';
          
          if (this.resources.length === 0) {
              container.innerHTML = '<p class="kdev-res-empty">Nenhum recurso encontrado.</p>';
              return;
          }

          this.resources.forEach((res, i) => {
              const isCSS = res.type === 'css';
              const bgClass = res.isKodux ? 'kdev-card--kodux' : 'kdev-card--normal';
              const badgeClass = isCSS ? 'kdev-badge--css' : 'kdev-badge--js';
              const statusClass = !res.active ? 'kdev-card--disabled' : '';
              
              const shieldSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="kdev-icon kdev-icon-sm" style="display:inline; padding-bottom:1px;"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><path d="m9 12 2 2 4-4"></path></svg>`;
              const trashSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="kdev-icon kdev-icon-sm"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>`;

              const html = `
                  <div class="kdev-card ${bgClass} ${statusClass}" id="res-card-${i}">
                      <div class="kdev-card-top">
                          <div class="kdev-badges">
                              <span class="kdev-badge ${badgeClass}">${res.type}</span>
                              ${res.isKodux ? `<span class="kdev-badge-kodux">${shieldSvg} Kodux</span>` : ''}
                          </div>
                          
                          <label class="kdev-toggle">
                              <input type="checkbox" class="kdev-toggle-input" ${res.active ? 'checked' : ''} onchange="KDevPanel.toggleResource(${i}, this.checked)">
                              <div class="kdev-toggle-bg"></div>
                          </label>
                      </div>
                      
                      <div class="kdev-card-bottom">
                          <input type="text" value="${res.url}" onchange="KDevPanel.updateUrl(${i}, this.value)" class="kdev-res-input kdev-font-mono">
                          <button onclick="KDevPanel.deleteResource(${i})" class="kdev-delete" title="Remover Tag">${trashSvg}</button>
                      </div>
                  </div>
              `;
              container.insertAdjacentHTML('beforeend', html);
          });
      },

      toggleResource(i, isActive) {
          const res = this.resources[i];
          res.active = isActive;
          
          if (res.type === 'css') {
              res.el.disabled = !isActive;
          } else {
              if (!isActive) {
                  res.el.setAttribute('data-dev-disabled', 'true');
                  res.el.type = 'javascript/blocked'; 
              } else {
                  res.el.removeAttribute('data-dev-disabled');
                  res.el.type = 'text/javascript';
                  
                  const newScript = document.createElement('script');
                  newScript.src = res.url;
                  res.el.parentNode.replaceChild(newScript, res.el);
                  res.el = newScript; 
              }
          }
          
          const card = document.getElementById(`res-card-${i}`);
          if(isActive) {
              card.classList.remove('kdev-card--disabled');
          } else {
              card.classList.add('kdev-card--disabled');
          }
      },

      updateUrl(i, newUrl) {
          const res = this.resources[i];
          res.url = newUrl;
          if (res.type === 'css') {
              res.el.href = newUrl;
          } else {
              const newScript = document.createElement('script');
              newScript.src = newUrl;
              res.el.parentNode.replaceChild(newScript, res.el);
              res.el = newScript;
          }
          this.scan(); 
      },

      addResource() {
          const type = document.getElementById('dev-new-type').value;
          const url = document.getElementById('dev-new-url').value;
          
          if(!url) return;

          if (type === 'css') {
              const link = document.createElement('link');
              link.rel = 'stylesheet';
              link.href = url;
              document.head.appendChild(link);
          } else {
              const script = document.createElement('script');
              script.src = url;
              document.body.appendChild(script);
          }
          
          document.getElementById('dev-new-url').value = '';
          this.scan();
      },

      deleteResource(i) {
          const res = this.resources[i];
          res.el.remove();
          this.scan();
      },

      exportHTML() {
          const cloneDoc = document.documentElement.cloneNode(true);
          
          const panelToRemove = cloneDoc.querySelector('.kdev-wrapper');
          const stylesToRemove = cloneDoc.querySelector('#kdev-styles');
          
          const scriptTags = cloneDoc.querySelectorAll('script');
          scriptTags.forEach(script => {
              if(script.innerHTML.includes('KDevPanel')) {
                  script.remove();
              }
          });

          if(panelToRemove) panelToRemove.remove();
          if(stylesToRemove) stylesToRemove.remove();
          
          const blockedScripts = cloneDoc.querySelectorAll('script[data-dev-disabled="true"]');
          blockedScripts.forEach(s => s.remove());

          const computedBg = document.documentElement.style.getPropertyValue('--bg');
          if (computedBg) {
             const styleTag = document.createElement('style');
             styleTag.innerHTML = `
              :root {
                  --bg: ${document.documentElement.style.getPropertyValue('--bg')};
                  --bg-dark: ${document.documentElement.style.getPropertyValue('--bg-dark')};
                  --active-color: ${document.documentElement.style.getPropertyValue('--active-color')};
              }
             `;
             cloneDoc.querySelector('head').appendChild(styleTag);
          }

          const htmlContent = '<!DOCTYPE html>\n' + cloneDoc.outerHTML;
          const blob = new Blob([htmlContent], { type: 'text/html' });
          const url = URL.createObjectURL(blob);
          
          const a = document.createElement('a');
          a.href = url;
          a.download = 'FusionOS_Export.html';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
      }
  };

  document.addEventListener('DOMContentLoaded', () => {
      KDevPanel.init();
  });
</script>`);
