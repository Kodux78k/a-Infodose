/**
 * KODUX ORB NEXUS - PERFORMANCE INJECTOR V2
 * Com Scanner de CDNs, Perfis (Low/Med/High) e Toggles por Grupo.
 * O widget agora é imune ao próprio patch!
 */
(function() {
    if (document.getElementById('kdx-perf-container')) return;

    // =========================================================================
    // 1. INJETAR CSS (PATCH ISOLADO + WIDGET)
    // =========================================================================
    const style = document.createElement('style');
    style.innerHTML = `
        /* --- A. PATCHES DE PERFORMANCE POR GRUPO --- */
        
        /* Sombras */
        html[data-kdx-shadow="off"] [data-kdx-fx~="shadow"] { 
            box-shadow: none !important; 
            border: 1px solid rgba(255,255,255,0.1) !important;
        }
        
        /* Vidro e Blur */
        html[data-kdx-glass="off"] [data-kdx-fx~="glass"] { 
            backdrop-filter: none !important; 
            -webkit-backdrop-filter: none !important; 
            background-color: rgba(15, 15, 20, 0.95) !important; 
        }
        html[data-kdx-glass="off"] [data-kdx-fx~="blur"] { 
            filter: none !important; 
        }
        
        /* Animações (Imunizando o nosso painel com :not) */
        html[data-kdx-anim="off"] *:not(#kdx-perf-container):not(#kdx-perf-container *) { 
            transition: none !important; 
            animation-duration: 0.01s !important; 
            will-change: auto !important; 
        }

        /* --- B. ESTILO DO WIDGET V2 --- */
        #kdx-perf-container {
            position: fixed; bottom: 25px; right: 25px; z-index: 2147483647;
            font-family: 'JetBrains Mono', 'Inter', system-ui, sans-serif; color: #e2e8f0;
        }
        .kdx-fab {
            width: 55px; height: 55px; border-radius: 50%;
            background: linear-gradient(135deg, #6366f1, #a855f7);
            border: 2px solid rgba(255,255,255,0.2); box-shadow: 0 0 20px rgba(99, 102, 241, 0.4);
            cursor: pointer; display: flex; align-items: center; justify-content: center;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .kdx-fab:hover { transform: scale(1.1) rotate(5deg); box-shadow: 0 0 30px rgba(99, 102, 241, 0.6); }
        .kdx-fab svg { width: 26px; height: 26px; fill: none; stroke: #fff; stroke-width: 2.5; }
        
        .kdx-panel {
            position: absolute; bottom: 75px; right: 0; width: 340px; 
            background: rgba(10, 10, 12, 0.95); backdrop-filter: blur(10px);
            border: 1px solid #27273a; border-radius: 16px; padding: 20px; 
            box-shadow: 0 20px 50px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.05);
            display: none; flex-direction: column; gap: 15px; opacity: 0; 
            transform: translateY(20px); transition: all 0.3s ease; transform-origin: bottom right;
            max-height: 80vh; overflow-y: auto;
        }
        .kdx-panel.open { display: flex; opacity: 1; transform: translateY(0); }
        
        .kdx-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #27273a; padding-bottom: 10px; }
        .kdx-header h3 { margin: 0; font-size: 15px; font-weight: 800; color: #fff; display: flex; align-items: center; gap: 8px; }
        .kdx-header h3 span { color: #6366f1; }
        
        .kdx-btn-scan {
            background: #1e1e2e; color: #fff; border: 1px solid #3f3f5a; padding: 12px; border-radius: 8px; 
            cursor: pointer; font-size: 13px; font-weight: 600; transition: 0.2s; display: flex; align-items: center; justify-content: center; gap: 8px;
        }
        .kdx-btn-scan:hover { background: #2a2a3e; border-color: #6366f1; }
        
        /* Grid de Modos */
        .kdx-modes { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; }
        .kdx-mode-btn {
            background: #1e1e2e; border: 1px solid #3f3f5a; color: #94a3b8; padding: 8px; border-radius: 6px;
            font-size: 12px; font-weight: bold; cursor: pointer; transition: 0.2s;
        }
        .kdx-mode-btn.active { background: #6366f1; color: #fff; border-color: #818cf8; }
        
        /* Toggles individuais */
        .kdx-toggle-group { display: flex; flex-direction: column; gap: 8px; background: rgba(0,0,0,0.3); padding: 12px; border-radius: 8px; border: 1px dashed #3f3f5a; }
        .kdx-toggle { display: flex; align-items: center; justify-content: space-between; }
        .kdx-toggle span { font-size: 13px; color: #cbd5e1; }
        
        /* CDNs */
        .kdx-cdns { background: #13131a; border: 1px solid #27273a; border-radius: 8px; padding: 10px; font-size: 11px; color: #94a3b8; max-height: 100px; overflow-y: auto; }
        .kdx-cdn-item { padding: 4px 0; border-bottom: 1px solid #1e1e2e; }
        .kdx-cdn-item:last-child { border: none; }
        
        /* Switch CSS */
        .switch { position: relative; display: inline-block; width: 36px; height: 20px; }
        .switch input { opacity: 0; width: 0; height: 0; }
        .slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #ef4444; transition: .4s; border-radius: 20px; }
        .slider:before { position: absolute; content: ""; height: 14px; width: 14px; left: 3px; bottom: 3px; background-color: white; transition: .4s; border-radius: 50%; }
        input:checked + .slider { background-color: #10b981; }
        input:checked + .slider:before { transform: translateX(16px); }
    `;
    document.head.appendChild(style);

    // =========================================================================
    // 2. CONSTRUIR UI HTML
    // =========================================================================
    const container = document.createElement('div');
    container.id = 'kdx-perf-container';
    container.innerHTML = `
        <div class="kdx-panel" id="kdx-panel">
            <div class="kdx-header">
                <h3>⚡ KODUX <span>PERF-CORE V2</span></h3>
                <button id="kdx-close" style="border:none;background:none;color:#94a3b8;font-size:18px;cursor:pointer;">✕</button>
            </div>
            
            <button class="kdx-btn-scan" id="kdx-btn-scan">⚙️ Escanear DOM & CDNs</button>
            
            <div id="kdx-cdn-box" style="display:none;">
                <div style="font-size:12px; font-weight:bold; margin-bottom:5px; color:#6366f1;">CDNs Ativos Encontrados:</div>
                <div class="kdx-cdns" id="kdx-cdn-list"></div>
            </div>

            <div style="font-size:12px; font-weight:bold; color:#6366f1; margin-top:5px;">Perfis de Desempenho:</div>
            <div class="kdx-modes">
                <button class="kdx-mode-btn" data-mode="low">LOW</button>
                <button class="kdx-mode-btn" data-mode="med">MED</button>
                <button class="kdx-mode-btn active" data-mode="high">HIGH</button>
            </div>

            <div class="kdx-toggle-group">
                <div class="kdx-toggle">
                    <span>Sombras (Box-Shadow)</span>
                    <label class="switch"><input type="checkbox" id="tg-shadow" checked><span class="slider"></span></label>
                </div>
                <div class="kdx-toggle">
                    <span>Vidro & Blur (Filtros)</span>
                    <label class="switch"><input type="checkbox" id="tg-glass" checked><span class="slider"></span></label>
                </div>
                <div class="kdx-toggle">
                    <span>Animações & Transições</span>
                    <label class="switch"><input type="checkbox" id="tg-anim" checked><span class="slider"></span></label>
                </div>
            </div>
        </div>
        
        <div class="kdx-fab" id="kdx-fab" title="KODUX Performance Core">
            <svg viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
        </div>
    `;
    document.body.appendChild(container);

    // =========================================================================
    // 3. LÓGICA DO MOTOR E CHAVEAMENTO
    // =========================================================================
    const fab = document.getElementById('kdx-fab');
    const panel = document.getElementById('kdx-panel');
    const btnScan = document.getElementById('kdx-btn-scan');
    
    // Toggles
    const tgShadow = document.getElementById('tg-shadow');
    const tgGlass = document.getElementById('tg-glass');
    const tgAnim = document.getElementById('tg-anim');
    const modeBtns = document.querySelectorAll('.kdx-mode-btn');

    // Setup Inicial da Tag HTML
    const html = document.documentElement;
    html.setAttribute('data-kdx-shadow', 'on');
    html.setAttribute('data-kdx-glass', 'on');
    html.setAttribute('data-kdx-anim', 'on');

    // Abre/Fecha Painel
    fab.addEventListener('click', () => panel.classList.toggle('open'));
    document.getElementById('kdx-close').addEventListener('click', () => panel.classList.remove('open'));

    // Atualiza Estado no HTML quando clica nos switches individuais
    function updateHTMLState() {
        html.setAttribute('data-kdx-shadow', tgShadow.checked ? 'on' : 'off');
        html.setAttribute('data-kdx-glass', tgGlass.checked ? 'on' : 'off');
        html.setAttribute('data-kdx-anim', tgAnim.checked ? 'on' : 'off');
        
        // Remove a classe "active" dos perfis se o usuário mexer manualmente
        modeBtns.forEach(b => b.classList.remove('active'));
    }

    tgShadow.addEventListener('change', updateHTMLState);
    tgGlass.addEventListener('change', updateHTMLState);
    tgAnim.addEventListener('change', updateHTMLState);

    // Lógica dos Botões de Perfil (Low/Med/High)
    modeBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            modeBtns.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            
            const mode = e.target.getAttribute('data-mode');
            if (mode === 'high') {
                tgShadow.checked = true; tgGlass.checked = true; tgAnim.checked = true;
            } else if (mode === 'med') {
                tgShadow.checked = true; tgGlass.checked = false; tgAnim.checked = true;
            } else if (mode === 'low') {
                tgShadow.checked = false; tgGlass.checked = false; tgAnim.checked = false;
            }
            // Força a atualização dos datasets
            tgShadow.dispatchEvent(new Event('change'));
            e.target.classList.add('active'); // Retorna o visual de ativo após o trigger apagar
        });
    });

    // Scanner Cirúrgico de DOM e CDNs
    btnScan.addEventListener('click', () => {
        btnScan.innerHTML = "⏳ Escaneando...";
        
        setTimeout(() => {
            // 1. Escaneamento Gráfico
            const allElements = document.querySelectorAll('body *:not(#kdx-perf-container):not(#kdx-perf-container *)');
            allElements.forEach(el => {
                const computed = window.getComputedStyle(el);
                let fxList = [];

                if (computed.boxShadow !== 'none') fxList.push('shadow');
                if (computed.backdropFilter !== 'none') fxList.push('glass');
                if (computed.filter !== 'none' && computed.filter.includes('blur')) fxList.push('blur');

                if (fxList.length > 0) {
                    const currentFx = el.getAttribute('data-kdx-fx') || '';
                    const newFx = [...new Set([...currentFx.split(' '), ...fxList])].join(' ').trim();
                    el.setAttribute('data-kdx-fx', newFx);
                }
            });

            // 2. Escaneamento de CDNs/Scripts
            const scripts = document.querySelectorAll('script[src]');
            const domains = {};
            scripts.forEach(s => {
                try {
                    const url = new URL(s.src);
                    // Agrupa por domínio para não lotar a tela
                    domains[url.hostname] = (domains[url.hostname] || 0) + 1;
                } catch(e) {} // Ignora src inválidos
            });

            const cdnList = document.getElementById('kdx-cdn-list');
            cdnList.innerHTML = '';
            
            if (Object.keys(domains).length === 0) {
                cdnList.innerHTML = '<div class="kdx-cdn-item">Nenhum script externo detectado.</div>';
            } else {
                for (const [domain, count] of Object.entries(domains)) {
                    cdnList.innerHTML += `<div class="kdx-cdn-item">🌐 ${domain} <span style="color:#6366f1;">(${count}x)</span></div>`;
                }
            }
            
            document.getElementById('kdx-cdn-box').style.display = 'block';

            // Feedback Visual
            btnScan.innerHTML = "✓ DOM e Rede Mapeados!";
            btnScan.style.borderColor = '#10b981';
            btnScan.style.color = '#10b981';
            
            setTimeout(() => {
                btnScan.innerHTML = '⚙️ Reescanear DOM & CDNs';
                btnScan.style.borderColor = '#3f3f5a';
                btnScan.style.color = '#fff';
            }, 3000);

        }, 50);
    });

})();

