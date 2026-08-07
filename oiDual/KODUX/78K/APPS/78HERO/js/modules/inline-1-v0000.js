        // ── PRESETS ──
        function renderPresets() {
            const grid = document.getElementById('baulite-presets');
            if (!grid) return;
            grid.innerHTML = '';
            PRESETS.forEach(preset => {
                const item = document.createElement('div');
                item.className = 'preset-item';
                item.innerHTML = `
                    <div class="info">
                        <div class="label">${escapeHTML(preset.label)}</div>
                        <div class="desc">${escapeHTML(preset.desc)}</div>
                    </div>
                    <div class="switch ${preset.enabled ? 'on' : ''}" data-key="${escapeHTML(preset.key)}"></div>
                `;
                const sw = item.querySelector('.switch');
                sw.addEventListener('click', () => {
                    sw.classList.toggle('on');
                    if (preset.key === 'hero.autoplay') {
                        state.autoplay = sw.classList.contains('on');
                        setupAutoplay();
                    }
                    if (preset.key === 'hero.minimized') {
                        state.heroMinimized = sw.classList.contains('on');
                        const heroSection = document.getElementById('hero-section');
                        if (heroSection) heroSection.classList.toggle('minimized', state.heroMinimized);
                    }
                    saveState();
                });
                grid.appendChild(item);
            });
        }

        // ── FERRAMENTAS ──
        function exportJSON() {
            const data = {};
            lsEntries().forEach(({ key, val }) => {
                if (RESERVED_KEYS.has(key)) return;
                data[key] = val;
            });
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'baulite-export.json';
            a.click();
            setTimeout(() => URL.revokeObjectURL(url), 1000);
        }

        function importJSON() {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.json,application/json';
            input.onchange = async () => {
                const file = input.files && input.files[0];
                if (!file) return;
                const text = await file.text();
                try {
                    const data = JSON.parse(text);
                    Object.entries(data).forEach(([k, v]) => MemoryCore.set(k, String(v)));
                    refreshAll();
                    alert('Importado com sucesso.');
                } catch {
                    alert('JSON inválido.');
                }
            };
            input.click();
        }

        function clearSystemCache() {
            if (!confirm('Limpar chaves do sistema do cache?')) return;
            lsEntries().forEach(({ key }) => {
                if (!RESERVED_KEYS.has(key) && !/^fav:/.test(key)) localStorage.removeItem(key);
            });
            refreshAll();
        }

        // ── AUTOPLAY ──
        function setupAutoplay() {
            if (autoplayTimer) clearInterval(autoplayTimer);
            if (!state.autoplay) return;
            autoplayTimer = setInterval(() => {
                const heroCarousel = document.getElementById('hero-carousel');
                if (!heroCarousel) return;
                const cards = heroCarousel.querySelectorAll('.hero-card');
                if (!cards.length) return;
                state.heroIndex = (state.heroIndex + 1) % cards.length;
                saveState();
                scrollToHeroSlide(state.heroIndex);
            }, 6000);
        }

        // ── REMOVER DOC DO DB ──
        async function removeDbDoc(id) {
            if (!db) return;
            return new Promise((resolve, reject) => {
                const tx = db.transaction(STORE_NAME, 'readwrite');
                const store = tx.objectStore(STORE_NAME);
                const req = store.delete(id);
                tx.oncomplete = () => resolve();
                tx.onerror = err => reject(err);
            });
        }

        // ── LEITURA DE ARQUIVOS ──
        async function readFileToDoc(file) {
            const type = detectType(file.name, file.type || '', '');
            const id = `doc-${Date.now()}-${Math.random().toString(36).slice(2,8)}`;
            if (type === 'pdf') {
                const blob = file.slice(0, file.size, 'application/pdf');
                const url = URL.createObjectURL(blob);
                return {
                    id, name: file.name, type, mime: file.type || 'application/pdf',
                    size: prettyBytes(file.size), updatedAt: Date.now(), content: '', url, fileBlob: blob,
                    source: 'indexeddb', favorite: false, tags: ['upload']
                };
            }
            if (type === 'html') {
                const text = await file.text();
                const blob = new Blob([text], { type: 'text/html;charset=utf-8' });
                const url = URL.createObjectURL(blob);
                return {
                    id, name: file.name, type, mime: file.type || 'text/html',
                    size: prettyBytes(file.size), updatedAt: Date.now(), content: text, url, fileBlob: blob,
                    source: 'indexeddb', favorite: false, tags: ['upload']
                };
            }
            const text = await file.text();
            return {
                id, name: file.name, type, mime: file.type || 'text/plain',
                size: prettyBytes(file.size), updatedAt: Date.now(), content: text, url: '',
                source: 'indexeddb', favorite: false, tags: ['upload']
            };
        }

        function openFilePicker() {
            const fileInput = document.getElementById('file-input');
            if (fileInput) { fileInput.value = ''; fileInput.click(); }
        }

        function openURLPrompt() {
            const url = prompt('Cole uma URL ou caminho para abrir:');
            if (!url) return;
            const type = /pdf/i.test(url) ? 'pdf' : /html?|htm/i.test(url) ? 'html' : 'url';
            openReader({ title: url, url, kind: type, text: url });
        }

        // ── REFRESH ALL ──
        function refreshAll() {
            MemoryCore.reload();
            if (!db) {
                initDB().then(() => { refreshAll(); }).catch(() => {});
                return;
            }
            collectDocuments().then(docs => {
                currentDocs = docs.map(doc => ({
                    ...doc,
                    favorite: localStorage.getItem(`fav:${doc.id}`) === '1' || doc.favorite
                })).sort((a,b) => (b.updatedAt || 0) - (a.updatedAt || 0));
                renderStats(currentDocs);
                renderHero(currentDocs);
                renderRecentCarousel(currentDocs);
                renderRaw();
                renderPresets();
                const searchInput = document.getElementById('baulite-search-input');
                if (searchInput && searchInput.value.trim()) performSearch(searchInput.value);

                const heroSection = document.getElementById('hero-section');
                if (heroSection) heroSection.classList.toggle('minimized', !!state.heroMinimized);
                const toggleAutoplay = document.getElementById('toggle-autoplay');
                const toggleHero = document.getElementById('toggle-hero');
                if (toggleAutoplay) toggleAutoplay.textContent = state.autoplay ? '⏸' : '▶';
                if (toggleHero) toggleHero.textContent = state.heroMinimized ? '▲' : '▼';
                setupAutoplay();
                saveState();

                // HK Library
                const hkLibCount = document.getElementById('hkLibCount');
                const hkLibList = document.getElementById('hkLibList');
                const hkStorageLabel = document.getElementById('hkStorageLabel');
                if (hkLibCount) hkLibCount.textContent = '● ' + docs.length + (docs.length === 1 ? ' item' : ' itens');
                if (hkStorageLabel) hkStorageLabel.textContent = docs.length + ' documento' + (docs.length === 1 ? '' : 's') + ' na Library';
                if (hkLibList) {
                    if (docs.length === 0) {
                        hkLibList.innerHTML = '<div class="hk-empty-row">Nenhum documento ainda. Toque para abrir a Library.</div>';
                    } else {
                        hkLibList.innerHTML = docs.slice(0, 3).map(d => {
                            const ic = { txt: '📄', md: '📝', pdf: '📕', html: '🌐', json: '📋', cache: '🗂️' }[d.type] || '📄';
                            return '<div class="hk-list-item"><span class="hk-item-icon">' + ic + '</span>' +
                                '<div class="hk-item-info"><span class="hk-item-name">' + escapeHTML(d.name) + '</span>' +
                                '<span class="hk-item-meta">' + (d.type || 'txt').toUpperCase() + ' · ' + d.size + '</span></div></div>';
                        }).join('');
                    }
                }
            });
        }

        // ── BIND UI ──
        function bindUI() {
            const theme = localStorage.getItem('nebula-theme') || 'dark';
            document.body.setAttribute('data-theme', theme);

            // Toggle theme
            const themeDot = document.getElementById('theme-dot');
            if (themeDot) {
                themeDot.addEventListener('click', () => {
                    const next = document.body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
                    document.body.setAttribute('data-theme', next);
                    localStorage.setItem('nebula-theme', next);
                });
            }

            // Toggle hero
            const toggleHeroBtn = document.getElementById('toggle-hero');
            if (toggleHeroBtn) {
                toggleHeroBtn.addEventListener('click', () => {
                    state.heroMinimized = !state.heroMinimized;
                    const heroSection = document.getElementById('hero-section');
                    if (heroSection) heroSection.classList.toggle('minimized', state.heroMinimized);
                    toggleHeroBtn.textContent = state.heroMinimized ? '▲' : '▼';
                    saveState();
                });
            }

            // Toggle autoplay
            const toggleAutoplayBtn = document.getElementById('toggle-autoplay');
            if (toggleAutoplayBtn) {
                toggleAutoplayBtn.addEventListener('click', () => {
                    state.autoplay = !state.autoplay;
                    toggleAutoplayBtn.textContent = state.autoplay ? '⏸' : '▶';
                    saveState();
                    setupAutoplay();
                });
            }

            // Add file
            const addFileBtn = document.getElementById('add-file');
            if (addFileBtn) addFileBtn.addEventListener('click', openFilePicker);

            // Search file (biblioteca)
            const searchFileBtn = document.getElementById('search-file');
            const searchBox = document.getElementById('search-box');
            const searchInput = document.getElementById('search-input');
            if (searchFileBtn && searchBox && searchInput) {
                searchFileBtn.addEventListener('click', () => {
                    searchBox.classList.toggle('visible');
                    if (searchBox.classList.contains('visible')) searchInput.focus();
                });
                searchInput.addEventListener('input', () => {
                    const q = searchInput.value.trim();
                    if (q) {
                        const semInput = document.getElementById('baulite-search-input');
                        if (semInput) semInput.value = q;
                        performSearch(q);
                    } else {
                        const semInput = document.getElementById('baulite-search-input');
                        if (semInput) semInput.value = '';
                        const container = document.getElementById('baulite-search-results');
                        if (container) container.innerHTML = '';
                    }
                });
            }

            // Open URL
            const openUrlBtn = document.getElementById('open-url');
            if (openUrlBtn) openUrlBtn.addEventListener('click', openURLPrompt);

            // Feature open
            const featureOpen = document.getElementById('feature-open');
            if (featureOpen) featureOpen.addEventListener('click', openFilePicker);

            // File input change
            const fileInput = document.getElementById('file-input');
            if (fileInput) {
                fileInput.addEventListener('change', async (e) => {
                    const files = Array.from(e.target.files || []);
                    if (!files.length) return;
                    for (const file of files) {
                        const item = await readFileToDoc(file);
                        await saveFileToDB(item);
                        if (item.type === 'html' && item.content) {
                            localStorage.setItem(`doc:${file.name}:${Date.now()}`, item.content.slice(0, 20000));
                        }
                        if (item.type === 'txt' || item.type === 'markdown' || item.type === 'json') {
                            localStorage.setItem(`doc:${file.name}:${Date.now()}`, item.content.slice(0, 40000));
                        }
                    }
                    refreshAll();
                });
            }

            // Hero group pills
            document.querySelectorAll('.group-pill').forEach(btn => {
                btn.addEventListener('click', function() {
                    document.querySelectorAll('.group-pill').forEach(b => b.classList.remove('active'));
                    this.classList.add('active');
                    activeHeroGroup = this.dataset.group || 'recentes';
                    state.activeGroup = activeHeroGroup;
                    saveState();
                    renderHero(currentDocs);
                });
            });

            // BaúLite tabs (na aba KBLX)
            const tabsContainer = document.getElementById('baulite-tabs');
            if (tabsContainer) {
                tabsContainer.addEventListener('click', (e) => {
                    const btn = e.target.closest('button[data-tab]');
                    if (!btn) return;
                    tabsContainer.querySelectorAll('button').forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    const tab = btn.dataset.tab;
                    document.querySelectorAll('#kblx-baulite-panel .tab-pane').forEach(pane => {
                        pane.classList.toggle('active', pane.id === `btab-${tab}`);
                    });
                    if (tab === 'raw') renderRaw();
                    if (tab === 'dashboard') renderStats(currentDocs);
                    if (tab === 'tools') renderPresets();
                    if (tab === 'search') {
                        const inp = document.getElementById('baulite-search-input');
                        if (inp && inp.value.trim()) performSearch(inp.value);
                    }
                });
            }

            // BaúLite refresh
            const refreshBtn = document.getElementById('baulite-refresh');
            if (refreshBtn) refreshBtn.addEventListener('click', refreshAll);

            // BaúLite export
            const exportBtn = document.getElementById('baulite-export');
            if (exportBtn) exportBtn.addEventListener('click', exportJSON);

            // BaúLite import
            const importBtn = document.getElementById('baulite-import');
            if (importBtn) importBtn.addEventListener('click', importJSON);

            // BaúLite search input
            const searchInputBaulite = document.getElementById('baulite-search-input');
            if (searchInputBaulite) {
                searchInputBaulite.addEventListener('input', () => performSearch(searchInputBaulite.value));
            }

            // BaúLite clear cache
            const clearCacheBtn = document.getElementById('baulite-clear-cache');
            if (clearCacheBtn) clearCacheBtn.addEventListener('click', clearSystemCache);

            // BaúLite export JSON (tools)
            const exportJsonBtn = document.getElementById('baulite-export-json');
            if (exportJsonBtn) exportJsonBtn.addEventListener('click', exportJSON);

            // BaúLite import JSON (tools)
            const importJsonBtn = document.getElementById('baulite-import-json');
            if (importJsonBtn) importJsonBtn.addEventListener('click', importJSON);

            // Reader close
            const readerClose = document.getElementById('reader-close');
            if (readerClose) readerClose.addEventListener('click', closeReader);

            // Close reader on backdrop click
            const reader = document.getElementById('reader');
            if (reader) {
                reader.addEventListener('click', (e) => {
                    if (e.target === reader) closeReader();
                });
            }

            // Esc key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    closeReader();
                }
            });

            // Storage events
            window.addEventListener('storage', () => refreshAll());

            // Expose refresh to global
            window.__refreshExplorer = refreshAll;
        }

        // ── INIT ──
        async function init() {
            await initDB();
            bindUI();
            refreshAll();
        }

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
        } else {
            init();
        }

    })();