        // ═══════════════════════════════════════════════════════════════════
        // KBLX: SISTEMA NEBULA PRO — SCREEN PANEL (OCULTAR PREVIEW & STOP PROPAGATION)
        // ═══════════════════════════════════════════════════════════════════

        console.log("✅ KBLX.SYSTEM: NEBULA PRO · SCREEN PANEL inicializado.");

        const DB_NAME = "NebulaStorage";
        const DB_VERSION = 1;
        const STORE_NAME = "files";
        let db;
        let library = [];

        // Autoplay desativado por padrão para evitar refreshes
        let NEBULA_UI_STATE = JSON.parse(localStorage.getItem("nebula-pro-ui-state")) || {
            heroMinimized: false,
            heroIndex: 0,
            activeGroup: "recentes",
            collapsedGroups: [],
            autoplay: false
        };

        let autoplayTimer = null;

        function saveUIState() {
            localStorage.setItem("nebula-pro-ui-state", JSON.stringify(NEBULA_UI_STATE));
        }

        function initDB() {
            return new Promise((resolve, reject) => {
                const request = indexedDB.open(DB_NAME, DB_VERSION);
                request.onupgradeneeded = (event) => {
                    db = event.target.result;
                    if (!db.objectStoreNames.contains(STORE_NAME)) {
                        db.createObjectStore(STORE_NAME, { keyPath: "id" });
                    }
                };
                request.onsuccess = (event) => { db = event.target.result; resolve(db); };
                request.onerror = (event) => reject(event.target.error);
            });
        }

        async function saveFileToDB(item) {
            return new Promise((resolve, reject) => {
                const tx = db.transaction(STORE_NAME, "readwrite");
                const store = tx.objectStore(STORE_NAME);
                const safeItem = { ...item };
                delete safeItem.url;
                store.put(safeItem);
                tx.oncomplete = () => resolve();
                tx.onerror = (err) => reject(err);
            });
        }

        async function deleteFileFromDB(id) {
            return new Promise((resolve, reject) => {
                const tx = db.transaction(STORE_NAME, "readwrite");
                const store = tx.objectStore(STORE_NAME);
                store.delete(id);
                tx.oncomplete = () => resolve();
                tx.onerror = (err) => reject(err);
            });
        }

        async function loadFilesFromDB() {
            return new Promise((resolve, reject) => {
                const tx = db.transaction(STORE_NAME, "readonly");
                const store = tx.objectStore(STORE_NAME);
                const request = store.getAll();
                request.onsuccess = (event) => {
                    const items = event.target.result;
                    items.forEach(item => {
                        if ((item.type === "pdf" || item.type === "html") && item.fileBlob) {
                            item.url = URL.createObjectURL(item.fileBlob);
                        }
                    });
                    resolve(items);
                };
                request.onerror = (err) => reject(err);
            });
        }

        const fileInput = document.getElementById("file-input");
        const addButton = document.getElementById("add-file");
        const searchButton = document.getElementById("search-file");
        const openURLButton = document.getElementById("open-url");
        const searchBox = document.getElementById("search-box");
        const searchInput = document.getElementById("search-input");
        const carousel = document.getElementById("recentes");
        const dots = document.getElementById("dots");
        const reader = document.getElementById("reader");
        const readerTitle = document.getElementById("reader-title");
        const readerBody = document.getElementById("reader-body");
        const readerClose = document.getElementById("reader-close");
        const featureOpen = document.getElementById("feature-open");
        
        const heroSection = document.getElementById("hero-section");
        const toggleHeroBtn = document.getElementById("toggle-hero");
        const toggleAutoplayBtn = document.getElementById("toggle-autoplay");
        const heroCarousel = document.getElementById("hero-carousel");
        const heroDots = document.getElementById("hero-dots");
        const heroGroups = document.getElementById("hero-groups");
        const heroTitleLabel = document.getElementById("hero-title-label");

        function getType(name, type = "") {
            const ext = name.split(".").pop().toLowerCase();
            if (type.includes("pdf") || ext === "pdf") return "pdf";
            if (type.includes("html") || ext === "html" || ext === "htm") return "html";
            if (ext === "md" || ext === "markdown") return "markdown";
            return "txt";
        }

        function formatSize(bytes) {
            if (!bytes) return "";
            const units = ["B", "KB", "MB", "GB"];
            let i = 0, size = bytes;
            while (size >= 1024 && i < units.length - 1) { size /= 1024; i++; }
            return size.toFixed(size >= 10 ? 0 : 1) + " " + units[i];
        }

        function escapeHTML(text) {
            return text.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;");
        }

        function markdownToHTML(md) {
            let html = escapeHTML(md);
            html = html.replace(/^### (.*)$/gm, "<h3>$1</h3>");
            html = html.replace(/^## (.*)$/gm, "<h2>$1</h2>");
            html = html.replace(/^# (.*)$/gm, "<h1>$1</h1>");
            html = html.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
            html = html.replace(/\*(.*?)\*/g, "<em>$1</em>");
            html = html.replace(/`(.*?)`/g, "<code>$1</code>");
            html = html.replace(/\n\n/g, "</p><p>");
            return "<p>" + html + "</p>";
        }

        function extractTextFromHTML(htmlString) {
            const tempDiv = document.createElement("div");
            tempDiv.innerHTML = htmlString;
            return tempDiv.textContent || tempDiv.innerText || "";
        }

        // Preview com Lazy Load e Botão de Ocultar após ativado
        function createPreview(item) {
            const type = item.type;
            if (type === "pdf" || type === "html") {
                return `
                    <div class="file-preview" onclick="activatePreview(event, this, '${item.id}', '${type}', '${item.url}')">
                        <span class="type-badge">${type.toUpperCase()}</span>
                        <div class="preview-placeholder">
                            <span>📄</span>
                            <p style="font-size:11px;font-weight:600;">Toque para carregar preview</p>
                        </div>
                    </div>`;
            }
            if (type === "markdown") {
                const preview = item.content ? markdownToHTML(item.content) : "<p>Markdown</p>";
                return `<div class="file-preview"><span class="type-badge">MD</span><div class="preview-markdown">${preview}</div></div>`;
            }
            return `<div class="file-preview"><span class="type-badge">TXT</span><div class="preview-text">${escapeHTML(item.content || "Documento de texto")}</div></div>`;
        }

        window.activatePreview = function(e, container, id, type, url) {
            if (container.querySelector('iframe')) return; 
            container.innerHTML = `
                <span class="type-badge">${type.toUpperCase()}</span>
                <button class="close-preview-btn" onclick="deactivatePreview(event, this)" title="Ocultar preview">✕</button>
                <iframe src="${url}" sandbox="allow-scripts allow-same-origin allow-popups allow-forms" style="width:100%;height:100%;border:0;background:#fff;"></iframe>
            `;
        };

        window.deactivatePreview = function(e, btn) {
            e.stopPropagation();
            const container = btn.closest('.file-preview');
            const type = container.querySelector('.type-badge').textContent.toLowerCase();
            // Restaura o placeholder original
            container.innerHTML = `
                <span class="type-badge">${type.toUpperCase()}</span>
                <div class="preview-placeholder">
                    <span>📄</span>
                    <p style="font-size:11px;font-weight:600;">Toque para carregar preview</p>
                </div>
            `;
        };

        async function removeDocument(id) {
            if (!confirm("Tem certeza que deseja apagar este documento?")) return;
            try {
                await deleteFileFromDB(id);
                library = library.filter(item => item.id !== id);
                refreshAll();
            } catch (err) {
                console.error("Erro ao deletar:", err);
            }
        }

        if (NEBULA_UI_STATE.heroMinimized) {
            heroSection.classList.add('minimized');
            toggleHeroBtn.style.transform = 'rotate(-90deg)';
        }

        toggleHeroBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            NEBULA_UI_STATE.heroMinimized = !heroSection.classList.contains('minimized');
            heroSection.classList.toggle('minimized', NEBULA_UI_STATE.heroMinimized);
            toggleHeroBtn.style.transform = NEBULA_UI_STATE.heroMinimized ? 'rotate(-90deg)' : 'rotate(0deg)';
            saveUIState();
        });

        toggleAutoplayBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            NEBULA_UI_STATE.autoplay = !NEBULA_UI_STATE.autoplay;
            toggleAutoplayBtn.textContent = NEBULA_UI_STATE.autoplay ? "⏸" : "▶";
            saveUIState();
            setupAutoplay();
        });
        toggleAutoplayBtn.textContent = NEBULA_UI_STATE.autoplay ? "⏸" : "▶";

        heroGroups.querySelectorAll('.group-pill').forEach(pill => {
            if(pill.getAttribute('data-group') === NEBULA_UI_STATE.activeGroup) {
                heroGroups.querySelectorAll('.group-pill').forEach(p => p.classList.remove('active'));
                pill.classList.add('active');
            }
            pill.addEventListener('click', (e) => {
                e.stopPropagation();
                heroGroups.querySelectorAll('.group-pill').forEach(p => p.classList.remove('active'));
                e.target.classList.add('active');
                NEBULA_UI_STATE.activeGroup = e.target.getAttribute('data-group');
                NEBULA_UI_STATE.heroIndex = 0;
                saveUIState();
                renderHero();
            });
        });

        function getFilteredHeroItems() {
            const grp = NEBULA_UI_STATE.activeGroup;
            if (grp === 'recentes') return library.slice(0, 8);
            if (grp === 'favoritos') return library.filter(i => i.favorite);
            if (grp === 'cortex') return library.filter(i => i.cortexSaved);
            return library.filter(i => i.type === grp || (grp === 'markdown' && i.type === 'markdown'));
        }

        function renderHero() {
            if (!heroCarousel) return;
            heroCarousel.innerHTML = "";
            heroDots.innerHTML = "";

            const items = getFilteredHeroItems();
            heroTitleLabel.textContent = `Inteligência · ${NEBULA_UI_STATE.activeGroup.toUpperCase()}`;

            if (!items.length) {
                heroCarousel.innerHTML = `
                    <div class="hero-card" style="width: 100%;">
                        <div style="padding: 30px; text-align: center;">
                            <h2 style="font-size: 20px; margin-bottom: 8px;">Nenhum item em "${NEBULA_UI_STATE.activeGroup}"</h2>
                            <p style="color: var(--muted); font-size: 12px;">Adicione arquivos ou explore novos conteúdos.</p>
                        </div>
                    </div>
                `;
                return;
            }

            if (NEBULA_UI_STATE.heroIndex >= items.length) NEBULA_UI_STATE.heroIndex = 0;

            items.forEach((item, index) => {
                const card = document.createElement("article");
                card.className = "hero-card";
                card.style.flex = "0 0 100%";
                
                card.innerHTML = `
                    <div class="hero-card-preview" onclick="activatePreview(event, this, '${item.id}', '${item.type}', '${item.url}')">
                        <div class="preview-placeholder">
                            <span>📄</span>
                            <p style="font-size:11px;font-weight:600;">Toque para carregar preview</p>
                        </div>
                    </div>
                    <div class="hero-card-info">
                        <div>
                            <h4>${escapeHTML(item.name)}</h4>
                            <p>${item.type.toUpperCase()} · ${item.size || "arquivo"}</p>
                        </div>
                        <div class="card-actions">
                            <button class="btn-icon hero-listen" title="Ouvir">🔊</button>
                            <button class="btn-icon danger hero-delete" title="Apagar Documento">🗑️</button>
                            <button class="open hero-open">→</button>
                        </div>
                    </div>
                `;

                card.querySelector('.hero-open').addEventListener('click', (e) => {
                    e.stopPropagation();
                    openReader(item);
                });
                
                card.querySelector('.hero-listen').addEventListener('click', (e) => {
                    e.stopPropagation();
                    const synth = window.speechSynthesis;
                    if(synth.speaking) { synth.cancel(); return; }
                    let txt = item.type === "html" ? extractTextFromHTML(item.content) : (item.content || "");
                    if(!txt) return alert("Sem texto legível para leitura.");
                    const utt = new SpeechSynthesisUtterance(txt.substring(0, 3000));
                    utt.lang = 'pt-BR';
                    synth.speak(utt);
                });

                card.querySelector('.hero-delete').addEventListener('click', (e) => {
                    e.stopPropagation();
                    removeDocument(item.id);
                });

                heroCarousel.appendChild(card);

                const dot = document.createElement("div");
                dot.className = "hero-dot" + (index === NEBULA_UI_STATE.heroIndex ? " active" : "");
                dot.addEventListener('click', (e) => {
                    e.stopPropagation();
                    NEBULA_UI_STATE.heroIndex = index;
                    saveUIState();
                    scrollToHeroSlide(index);
                });
                heroDots.appendChild(dot);
            });

            setTimeout(() => scrollToHeroSlide(NEBULA_UI_STATE.heroIndex, false), 50);
        }

        function scrollToHeroSlide(index, smooth = true) {
            const cards = heroCarousel.querySelectorAll('.hero-card');
            if (cards[index]) {
                cards[index].scrollIntoView({ behavior: smooth ? 'smooth' : 'auto', inline: 'center', block: 'nearest' });
                heroDots.querySelectorAll('.hero-dot').forEach((d, i) => d.classList.toggle('active', i === index));
            }
        }

        heroCarousel.addEventListener('scroll', () => {
            const cards = heroCarousel.querySelectorAll('.hero-card');
            if (!cards.length) return;
            const center = heroCarousel.scrollLeft + heroCarousel.offsetWidth / 2;
            let closest = 0, dist = Infinity;
            cards.forEach((c, idx) => {
                const cCenter = c.offsetLeft + c.offsetWidth / 2;
                const d = Math.abs(center - cCenter);
                if (d < dist) { dist = d; closest = idx; }
            });
            if (closest !== NEBULA_UI_STATE.heroIndex) {
                NEBULA_UI_STATE.heroIndex = closest;
                saveUIState();
                heroDots.querySelectorAll('.hero-dot').forEach((d, i) => d.classList.toggle('active', i === closest));
            }
        });

        function setupAutoplay() {
            clearInterval(autoplayTimer);
            if (!NEBULA_UI_STATE.autoplay) return;
            autoplayTimer = setInterval(() => {
                const items = getFilteredHeroItems();
                if (items.length <= 1) return;
                NEBULA_UI_STATE.heroIndex = (NEBULA_UI_STATE.heroIndex + 1) % items.length;
                saveUIState();
                scrollToHeroSlide(NEBULA_UI_STATE.heroIndex);
            }, 5500);
        }

        function renderLibrary(filter = "") {
            carousel.innerHTML = "";
            const normalized = filter.toLowerCase().trim();
            const items = library.filter(item => item.name.toLowerCase().includes(normalized));

            if (!items.length) {
                carousel.innerHTML = `<div class="empty">Nenhum documento encontrado.</div>`;
                dots.innerHTML = "";
                return;
            }

            items.forEach((item) => {
                const card = document.createElement("article");
                card.className = "slide";
                
                card.innerHTML = `
                    ${createPreview(item)}
                    <div class="card-info">
                        <div class="card-info-text">
                            <h4>${escapeHTML(item.name)}</h4>
                            <p>${item.type.toUpperCase()} · ${item.size || "arquivo"}</p>
                        </div>
                        <div class="card-actions">
                            <button class="btn-icon listen-btn" title="Ouvir Documento">🔊</button>
                            <button class="btn-icon danger delete-btn" title="Apagar Documento">🗑️</button>
                            <button class="open">→</button>
                        </div>
                    </div>`;

                card.querySelector(".listen-btn").addEventListener("click", (e) => {
                    e.stopPropagation();
                    const synth = window.speechSynthesis;
                    if(synth.speaking) { synth.cancel(); return; } 
                    let textToSpeak = item.type === "html" ? extractTextFromHTML(item.content) : (item.content || "");
                    if(!textToSpeak) return alert("Sem texto legível.");
                    const utterance = new SpeechSynthesisUtterance(textToSpeak.substring(0, 3000));
                    utterance.lang = 'pt-BR';
                    synth.speak(utterance);
                });

                card.querySelector(".delete-btn").addEventListener("click", (e) => {
                    e.stopPropagation();
                    removeDocument(item.id);
                });

                card.querySelector(".open").addEventListener("click", (e) => {
                    e.stopPropagation();
                    openReader(item);
                });

                carousel.appendChild(card);
            });
            renderDots();
        }

        function renderDots() {
            dots.innerHTML = "";
            const slides = carousel.querySelectorAll(".slide");
            slides.forEach((slide, index) => {
                const dot = document.createElement("div");
                dot.className = "dot";
                if (index === 0) dot.classList.add("active");
                dots.appendChild(dot);
            });
        }

        carousel.addEventListener("scroll", () => {
            const slides = carousel.querySelectorAll(".slide");
            const dotList = dots.querySelectorAll(".dot");
            if (!slides.length) return;
            const center = carousel.scrollLeft + carousel.offsetWidth / 2;
            let closest = 0, distance = Infinity;
            slides.forEach((slide, index) => {
                const slideCenter = slide.offsetLeft + slide.offsetWidth / 2;
                const d = Math.abs(center - slideCenter);
                if (d < distance) { distance = d; closest = index; }
            });
            dotList.forEach((dot, index) => dot.classList.toggle("active", index === closest));
        });

        addButton.addEventListener("click", () => fileInput.click());

        fileInput.addEventListener("change", async event => {
            const files = Array.from(event.target.files);
            for (const file of files) await addFile(file);
            refreshAll();
            fileInput.value = "";
            document.dispatchEvent(new Event('fileAdded')); 
        });

        async function addFile(file) {
            const type = getType(file.name, file.type);
            let item = {
                id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
                name: file.name,
                type,
                size: formatSize(file.size),
                content: "",
                url: "",
                favorite: false,
                cortexSaved: false
            };

            if (type === "pdf" || type === "html") {
                item.fileBlob = file; 
                item.url = URL.createObjectURL(file);
                if (type === "html") item.content = await file.text();
            } else {
                item.content = await file.text();
            }

            library.unshift(item);
            try { await saveFileToDB(item); } catch (err) {}
        }

        function refreshAll() {
            renderLibrary();
            renderHero();
            saveUIState();
        }

        function openReader(item) {
            readerTitle.textContent = item.name;
            readerBody.innerHTML = "";
            if (item.type === "pdf" || item.type === "html") {
                const iframe = document.createElement("iframe");
                iframe.src = item.url;
                if (item.type === "html") {
                    iframe.setAttribute("sandbox", "allow-scripts allow-same-origin allow-popups allow-forms");
                }
                readerBody.appendChild(iframe);
            } else if (item.type === "markdown") {
                readerBody.innerHTML = `<article class="reader-markdown">${markdownToHTML(item.content)}</article>`;
            } else {
                const pre = document.createElement("pre");
                pre.className = "reader-text";
                pre.textContent = item.content;
                readerBody.appendChild(pre);
            }
            reader.classList.add("opened");
            document.body.style.overflow = "hidden";
        }

        function closeReader() {
            reader.classList.remove("opened");
            readerBody.innerHTML = "";
            document.body.style.overflow = "";
        }

        readerClose.addEventListener("click", closeReader);

        searchButton.addEventListener("click", () => {
            searchBox.classList.toggle("visible");
            if (searchBox.classList.contains("visible")) searchInput.focus();
        });

        searchInput.addEventListener("input", event => renderLibrary(event.target.value));

        openURLButton.addEventListener("click", async () => {
            const url = prompt("Cole a URL do arquivo ou site externo:");
            if (!url) return;
            const clean = url.split("?")[0].toLowerCase();
            let type = clean.endsWith(".pdf") ? "pdf" : "html";
            
            let item = {
                id: Date.now().toString(),
                name: url.split("/").pop() || "Documento Web",
                type, url, content: "", size: "Link", favorite: false, cortexSaved: false
            };
            
            library.unshift(item);
            await saveFileToDB(item);
            refreshAll();
        });

        document.querySelectorAll(".nav-item").forEach(item => {
            item.addEventListener("click", () => {
                document.querySelectorAll(".nav-item").forEach(i => i.classList.remove("active"));
                item.classList.add("active");
            });
        });

        if (featureOpen) {
            featureOpen.addEventListener("click", () => {
                fileInput.click();
            });
        }

        window.onload = async () => {
            try {
                await initDB();
                const savedItems = await loadFilesFromDB();
                if (savedItems && savedItems.length > 0) {
                    library = savedItems;
                } else {
                    library = [{
                        id: "demo-md",
                        name: "Arquitetura Nebula Pro.md",
                        type: "markdown",
                        content: "# NEBULA PRO\n## Recent Intelligence Hero\nO Hero exibe os arquivos recentes.\n**Cortex** fornece os dados.\n- PDF\n- TXT\n- HTML\n- Markdown\n`Global Player`\nA experiência é unificada.",
                        size: "Markdown",
                        favorite: true,
                        cortexSaved: true
                    }];
                }
                refreshAll();
                setupAutoplay();
            } catch (err) {
                console.error("[KBLX.DB] Erro na inicialização:", err);
            }
        };

        // ═══════════════════════════════════════════════════════════════════════
        // KBLX: CICLO ∅⁺/∅⁻ — RÉGUA ARQUETÍPICA
        // ═══════════════════════════════════════════════════════════════════════
        (function() {
            'use strict';
            const PESOS_ARQUETIPOS = {
                "NOVA": 0.12, "ATLAS": 0.18, "VITALIS": 0.14,
                "PULSE": 0.10, "ARTEMIS": 0.08, "SERENA": 0.10,
                "KAOS": 0.05, "GENUS": 0.12, "LUMINE": 0.06,
                "RHEA": 0.03, "SOLUS": 0.01, "AION": 0.01,
                "KODUX": 0.01, "BLLUE": 0.01, "JESUS": 0.01,
                "KOBLLUX": 0.01, "INFODOSE": 0.01, "HORUS": 0.01
            };

            let cicloPasso = 0;
            const CICLO_PASSOS = [
                { simb: "∅⁻", tipo: "inicio" }, { simb: "∆ⁿ", tipo: "transicao" },
                { simb: "01", tipo: "passo" }, { sigb: "02", tipo: "passo" },
                { simb: "03", tipo: "passo" }, { simb: "∆ⁿ", tipo: "transicao" }
            ];

            function obterProximoPasso() {
                if (cicloPasso >= CICLO_PASSOS.length) cicloPasso = 0;
                return CICLO_PASSOS[cicloPasso++];
            }

            function selecionarArquetipoPorPeso() {
                const entries = Object.entries(PESOS_ARQUETIPOS);
                const total = entries.reduce((s, [, p]) => s + p, 0);
                let rand = Math.random() * total;
                for (const [nome, peso] of entries) {
                    rand -= peso;
                    if (rand <= 0) return nome;
                }
                return entries[entries.length - 1][0];
            }

            function atualizarPainelCiclo() {
                const passo = obterProximoPasso();
                const arqNome = selecionarArquetipoPorPeso();
                const peso = PESOS_ARQUETIPOS[arqNome] || 0;
                const delta = (library.length * 10 + 1134 > 0) ? (library.length * 10 + 1134 % 9 || 9) / (library.length * 10 + 1134 + 1) : 0.001;

                if (document.getElementById('ciclo-passo')) document.getElementById('ciclo-passo').textContent = passo.simb || "01";
                if (document.getElementById('ciclo-arq')) document.getElementById('ciclo-arq').textContent = arqNome;
                if (document.getElementById('ciclo-peso')) document.getElementById('ciclo-peso').textContent = peso.toFixed(3);
                if (document.getElementById('ciclo-delta')) document.getElementById('ciclo-delta').textContent = delta.toFixed(4);
            }

            setTimeout(atualizarPainelCiclo, 300);
            document.addEventListener('fileAdded', () => setTimeout(atualizarPainelCiclo, 100));
        })();
  