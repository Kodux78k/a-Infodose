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
