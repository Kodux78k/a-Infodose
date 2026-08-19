/* ===== elementos.js ===== */
(function() {
            'use strict';

            // Elementos
            const tabBtns = document.querySelectorAll('.tab-btn');
            const iframes = document.querySelectorAll('.tab-iframe');

            // Troca de abas
            function switchTab(tabId) {
                // Botões
                tabBtns.forEach(btn => btn.classList.toggle('active', btn.dataset.tab === tabId));
                // Iframes
                iframes.forEach(frame => {
                    const isActive = frame.dataset.tab === tabId;
                    frame.classList.toggle('active', isActive);
                });
            }

            // Eventos dos botões
            tabBtns.forEach(btn => {
                btn.addEventListener('click', () => switchTab(btn.dataset.tab));
            });

            // Tema
            const themeDot = document.getElementById('theme-dot');
            const themes = ['dark', 'light', 'neon'];
            let themeIndex = 0;

            themeDot?.addEventListener('click', () => {
                themeIndex = (themeIndex + 1) % themes.length;
                const theme = themes[themeIndex];
                document.documentElement.setAttribute('data-theme', theme);
                document.dispatchEvent(new CustomEvent('themechange', { detail: { theme } }));
            });

            // Placeholder
            window.launchApp = appId => console.log('[launchApp]', appId);

            console.log('✅ KODUX iCloud · Layout com Iframes carregado');
        })();