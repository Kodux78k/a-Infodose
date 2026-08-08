// ═══════════════════════════════════════════════════════════════════
// KBLX: NEBULA PRO — MOTOR UNIFICADO
// Base: main-v0000.js (motor) + camada extraída de inline-1.js (scanner LocalStorage)
// ═══════════════════════════════════════════════════════════════════

console.log("✅ KBLX.SYSTEM: NEBULA PRO · MOTOR UNIFICADO inicializado.");

// ─────────────────────────────────────────────────────────────────
// 1. CONFIG / CONSTANTES
// ─────────────────────────────────────────────────────────────────
const DB_NAME = "NebulaStorage";
const DB_VERSION = 1;
const STORE_NAME = "files";
const UI_STATE_KEY = "nebula-pro-ui-state";

// Chaves que o próprio app usa para si mesmo — nunca viram "documento"
const SYSTEM_PREFIXES = ["nebula-", "di_", "kobllux-", "kdev-", "lsdevos-", "baulite-", "hero-", "fav:"];
const RESERVED_KEYS = new Set([
    UI_STATE_KEY, "nebula-theme", "nebula-doc-keys", "nebula-hidden-keys",
    "nebula-pinned-keys", "di_userName", "di_assistantName", "baulite-disabled"
]);

const TYPE_LABELS = { html: "HTML", markdown: "MARKDOWN", pdf: "PDF", txt: "TXT", json: "JSON" };

// Mapeia tipo → grupo de exibição (Apps / Documentos / Config / Cache)
function groupOf(doc) {
    if (doc.source === "localStorage" && !doc.looksLikeDoc) return "cache";
    if (doc.type === "html") return "apps";
    if (doc.type === "json") return "config";
    if (["markdown", "txt", "pdf"].includes(doc.type)) return "documentos";
    return "cache";
}

// ─────────────────────────────────────────────────────────────────
// 2. ESTADO
// ─────────────────────────────────────────────────────────────────
let db;
let library = []; // itens do IndexedDB (upload manual) — fonte "oficial"
let currentDocs = []; // library + scan do localStorage, mesclados a cada refresh

let NEBULA_UI_STATE = JSON.parse(localStorage.getItem(UI_STATE_KEY)) || {
    heroMinimized: false,
    heroIndex: 0,
    activeGroup: "recentes",
    collapsedGroups: [],
    autoplay: false
};
let autoplayTimer = null;

function saveUIState() {
    localStorage.setItem(UI_STATE_KEY, JSON.stringify(NEBULA_UI_STATE));
}

// ─────────────────────────────────────────────────────────────────
// 3. INDEXEDDB (upload manual — camada "oficial", intocada em relação ao v0000)
// ─────────────────────────────────────────────────────────────────
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

// ─────────────────────────────────────────────────────────────────
// 4. UTILS
// ─────────────────────────────────────────────────────────────────
function escapeHTML(text) {
    return String(text ?? "")
        .replace(/&/g, "&amp;").replace(/</g, "&lt;")
        .replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}

function formatSize(bytes) {
    if (!bytes) return "";
    const units = ["B", "KB", "MB", "GB"];
    let i = 0, size = bytes;
    while (size >= 1024 && i < units.length - 1) { size /= 1024; i++; }
    return size.toFixed(size >= 10 ? 0 : 1) + " " + units[i];
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

// detectType: pdf > html > markdown > JSON (separado de txt, essa era a lacuna do v0000) > txt
function detectType(name = "", mime = "", content = "") {
    const ext = String(name).split(".").pop().toLowerCase();
    const c = String(content || "");
    if (mime.includes("pdf") || ext === "pdf") return "pdf";
    if (mime.includes("html") || ["html", "htm"].includes(ext) || /<!doctype html>|<html/i.test(c)) return "html";
    if (["md", "markdown"].includes(ext) || /^#{1,6}\s/m.test(c) || /\[[^\]]+\]\([^)]+\)/.test(c)) return "markdown";
    if (ext === "json" || (/^[\{\[][\s\S]*[\}\]]$/.test(c.trim()) && c.trim().length > 1)) return "json";
    return "txt";
}

function previewText(content, limit = 170) {
    const flat = String(content || "").replace(/\s+/g, " ").trim();
    if (!flat) return "Sem prévia disponível.";
    return flat.length > limit ? flat.slice(0, limit) + "…" : flat;
}

function previewFromHTML(content) {
    const txt = String(content || "")
        .replace(/<script[\s\S]*?<\/script>/gi, " ")
        .replace(/<style[\s\S]*?<\/style>/gi, " ")
        .replace(/<[^>]+>/g, " ")
        .replace(/\s+/g, " ").trim();
    return txt ? txt.slice(0, 240) : "HTML sem texto legível.";
}

// ─────────────────────────────────────────────────────────────────
// 5. SCANNER DE LOCALSTORAGE (camada adicional — extraída do inline-1.js)
//    Só descobre documentos; NUNCA sobrescreve a Library do IndexedDB.
// ─────────────────────────────────────────────────────────────────
function isSystemKey(key) {
    return SYSTEM_PREFIXES.some(prefix => String(key).startsWith(prefix));
}

function lsEntries() {
    const out = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (RESERVED_KEYS.has(key) || isSystemKey(key)) continue;
        out.push({ key, val: localStorage.getItem(key) || "" });
    }
    return out;
}

function safeJSONParse(v) {
    try { return JSON.parse(v); } catch { return null; }
}

function scanLocalStorageDocs() {
    const docs = [];
    for (const { key, val } of lsEntries()) {
        const parsed = safeJSONParse(val);
        const looksLikeDoc = /doc|note|text|article|draft|html|md|markdown|txt|pdf|summary|prompt/i.test(key);
        // Chaves que não parecem documento e não são JSON estruturado viram "cache", não somem —
        // mas ficam marcadas para cair no grupo Cache em vez de contaminar Documentos/Apps.
        const type = detectType(key, "", val);
        let content = val;
        if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
            content = Object.entries(parsed).map(([k, v]) => `${k}: ${typeof v === "string" ? v : JSON.stringify(v)}`).join("\n");
        }
        if (!val) continue;
        docs.push({
            id: `ls-${key}`,
            name: key,
            type,
            size: formatSize(new Blob([val]).size),
            content,
            url: "",
            favorite: false,
            cortexSaved: false,
            source: "localStorage",
            rawKey: key,
            looksLikeDoc,
            updatedAt: 0 // localStorage não guarda timestamp; fica sempre depois dos uploads reais
        });
    }
    return docs;
}

// ─────────────────────────────────────────────────────────────────
// 6. COLETA UNIFICADA (o que resolve o "duplo cérebro" do bug original)
// ─────────────────────────────────────────────────────────────────
async function collectDocuments() {
    const dbDocs = library.map((item, idx) => ({
        ...item,
        source: "indexeddb",
        updatedAt: item.updatedAt || (Date.now() - idx) // preserva ordem de upload
    }));
    const storageDocs = scanLocalStorageDocs();

    const merged = [...dbDocs, ...storageDocs];
    const seen = new Set();
    return merged.filter(doc => {
        const sig = `${doc.name}::${doc.type}::${String(doc.content || "").slice(0, 120)}`;
        if (seen.has(sig)) return false;
        seen.add(sig);
        return true;
    });
}

function getFilteredHeroItems() {
    const grp = NEBULA_UI_STATE.activeGroup;
    if (grp === "recentes") return currentDocs.filter(d => d.source === "indexeddb").slice(0, 8);
    if (grp === "favoritos") return currentDocs.filter(i => i.favorite);
    if (grp === "cortex") return currentDocs.filter(i => i.cortexSaved);
    if (grp === "cache") return currentDocs.filter(i => groupOf(i) === "cache");
    if (["apps", "documentos", "config"].includes(grp)) return currentDocs.filter(i => groupOf(i) === grp);
    return currentDocs.filter(i => i.type === grp);
}

// ─────────────────────────────────────────────────────────────────
// 7. TTS CENTRALIZADO — speakDocument() único para Hero + Library
//    Resolve o "botão de áudio não toca": espera as vozes carregarem,
//    seleciona pt-BR de fato, e permite cancelar tocando de novo.
// ─────────────────────────────────────────────────────────────────
let _voicesCache = [];
let _speakingBtn = null;

function loadVoices() {
    return new Promise(resolve => {
        let voices = window.speechSynthesis.getVoices();
        if (voices.length) { _voicesCache = voices; resolve(voices); return; }
        // Em muitos navegadores (Safari/iOS inclusive) as vozes chegam de forma assíncrona
        const onVoices = () => {
            voices = window.speechSynthesis.getVoices();
            if (voices.length) {
                _voicesCache = voices;
                window.speechSynthesis.removeEventListener("voiceschanged", onVoices);
                resolve(voices);
            }
        };
        window.speechSynthesis.addEventListener("voiceschanged", onVoices);
        // fallback: se voiceschanged nunca disparar, tenta de novo em 500ms
        setTimeout(() => { if (!_voicesCache.length) onVoices(); }, 500);
    });
}

function cleanTextForSpeech(doc) {
    if (doc.type === "html") return previewFromHTML(doc.content) || extractTextFromHTML(doc.content);
    if (doc.type === "json") {
        const parsed = safeJSONParse(doc.content);
        if (parsed) return JSON.stringify(parsed, null, 0).replace(/[{}\[\]"]/g, " ");
        return doc.content || "";
    }
    if (doc.type === "markdown") {
        return String(doc.content || "").replace(/[#*`_>\-]/g, "");
    }
    return doc.content || "";
}

async function speakDocument(doc, btn) {
    const synth = window.speechSynthesis;
    if (!synth) { alert("Este navegador não suporta leitura em voz alta."); return; }

    // Toque de novo no mesmo botão = cancelar
    if (synth.speaking && _speakingBtn === btn) {
        synth.cancel();
        if (btn) btn.classList.remove("speaking");
        _speakingBtn = null;
        return;
    }
    if (synth.speaking) synth.cancel();

    const text = cleanTextForSpeech(doc).trim();
    if (!text) { alert("Sem texto legível para leitura."); return; }

    const voices = await loadVoices();
    const ptVoice = voices.find(v => v.lang && v.lang.toLowerCase().startsWith("pt-br"))
        || voices.find(v => v.lang && v.lang.toLowerCase().startsWith("pt"));

    // Divide em blocos para não estourar limite de utterance em textos longos
    const CHUNK = 1600;
    const chunks = [];
    for (let i = 0; i < text.length; i += CHUNK) chunks.push(text.slice(i, i + CHUNK));

    if (btn) { btn.classList.add("speaking"); _speakingBtn = btn; }

    let idx = 0;
    function speakNext() {
        if (idx >= chunks.length) {
            if (btn) btn.classList.remove("speaking");
            _speakingBtn = null;
            return;
        }
        const utt = new SpeechSynthesisUtterance(chunks[idx]);
        utt.lang = "pt-BR";
        if (ptVoice) utt.voice = ptVoice;
        utt.onend = () => { idx++; speakNext(); };
        utt.onerror = () => { if (btn) btn.classList.remove("speaking"); _speakingBtn = null; };
        synth.speak(utt);
    }
    speakNext();
}

// ─────────────────────────────────────────────────────────────────
// 8. DOM REFS
// ─────────────────────────────────────────────────────────────────
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

// ─────────────────────────────────────────────────────────────────
// 9. PREVIEW / READER
// ─────────────────────────────────────────────────────────────────
// Toque no preview de qualquer card = abre uma Session Window (iFS) flutuante,
// em vez de trocar o card inline. Dá pra ter vários docs abertos ao mesmo tempo.
window.openDocPreview = function (id) {
    const doc = currentDocs.find(d => d.id === id);
    if (!doc) return;
    if (window.NebulaSW) {
        window.NebulaSW.open(doc);
    } else {
        // fallback se o motor de janelas não estiver carregado
        openReader(doc);
    }
};

function createPreview(item) {
    const type = item.type;
    const hint = `<div class="preview-placeholder"><span>${{ pdf: "📕", html: "🌐", markdown: "📝", json: "📋" }[type] || "📄"}</span><p style="font-size:11px;font-weight:600;">Toque para abrir em janela</p></div>`;
    const openAttr = `onclick="window.openDocPreview('${item.id}')"`;

    if (type === "pdf" || (type === "html" && item.url)) {
        return `<div class="file-preview" ${openAttr}><span class="type-badge">${type.toUpperCase()}</span>${hint}</div>`;
    }
    if (type === "markdown") {
        const preview = item.content ? markdownToHTML(previewText(item.content, 200)) : "<p>Markdown</p>";
        return `<div class="file-preview" ${openAttr}><span class="type-badge">MD</span><div class="preview-markdown">${preview}</div></div>`;
    }
    if (type === "json") {
        return `<div class="file-preview" ${openAttr}><span class="type-badge">JSON</span><div class="preview-text"><pre style="white-space:pre-wrap;margin:0;font-size:11px;">${escapeHTML(previewText(item.content, 200))}</pre></div></div>`;
    }
    if (type === "html") {
        return `<div class="file-preview" ${openAttr}><span class="type-badge">HTML</span><div class="preview-text">${escapeHTML(previewFromHTML(item.content))}</div></div>`;
    }
    return `<div class="file-preview" ${openAttr}><span class="type-badge">TXT</span><div class="preview-text">${escapeHTML(previewText(item.content || "Documento de texto", 200))}</div></div>`;
}

function openReader(item) {
    readerTitle.textContent = item.name;
    readerBody.innerHTML = "";
    if ((item.type === "pdf" || item.type === "html") && item.url) {
        const iframe = document.createElement("iframe");
        iframe.src = item.url;
        if (item.type === "html") iframe.setAttribute("sandbox", "allow-scripts allow-same-origin allow-popups allow-forms");
        readerBody.appendChild(iframe);
    } else if (item.type === "markdown") {
        readerBody.innerHTML = `<article class="reader-markdown">${markdownToHTML(item.content)}</article>`;
    } else if (item.type === "json") {
        const pre = document.createElement("pre");
        pre.className = "reader-text";
        const parsed = safeJSONParse(item.content);
        pre.textContent = parsed ? JSON.stringify(parsed, null, 2) : item.content;
        readerBody.appendChild(pre);
    } else {
        const pre = document.createElement("pre");
        pre.className = "reader-text";
        pre.textContent = item.type === "html" ? extractTextFromHTML(item.content) : item.content;
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
reader.addEventListener("click", (e) => { if (e.target === reader) closeReader(); });
document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeReader(); });

// ─────────────────────────────────────────────────────────────────
// 10. REMOÇÃO — respeita a origem (IndexedDB vs localStorage)
// ─────────────────────────────────────────────────────────────────
async function removeDocument(doc) {
    if (!confirm(`Tem certeza que deseja apagar "${doc.name}"?`)) return;
    try {
        if (doc.source === "localStorage") {
            localStorage.removeItem(doc.rawKey || doc.name);
        } else {
            await deleteFileFromDB(doc.id);
            library = library.filter(item => item.id !== doc.id);
        }
        refreshAll();
    } catch (err) {
        console.error("Erro ao deletar:", err);
    }
}

// ─────────────────────────────────────────────────────────────────
// 11. RENDER: HERO (com dot estabilizado por debounce)
// ─────────────────────────────────────────────────────────────────
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
            </div>`;
        return;
    }

    if (NEBULA_UI_STATE.heroIndex >= items.length) NEBULA_UI_STATE.heroIndex = 0;

    items.forEach((item, index) => {
        const card = document.createElement("article");
        card.className = "hero-card";
        card.style.flex = "0 0 100%";

        card.innerHTML = `
            <div class="hero-card-preview">${createPreview(item)}</div>
            <div class="hero-card-info">
                <div>
                    <h4>${escapeHTML(item.name)}</h4>
                    <p>${(TYPE_LABELS[item.type] || item.type).toUpperCase()} · ${item.size || "arquivo"} · ${item.source === "localStorage" ? "cache" : "db"}</p>
                </div>
                <div class="card-actions">
                    <button class="btn-icon hero-listen" title="Ouvir">🔊</button>
                    <button class="btn-icon danger hero-delete" title="Apagar Documento">🗑️</button>
                    <button class="open hero-open">→</button>
                </div>
            </div>
        `;

        card.querySelector(".hero-open").addEventListener("click", (e) => { e.stopPropagation(); openReader(item); });
        card.querySelector(".hero-listen").addEventListener("click", (e) => {
            e.stopPropagation();
            speakDocument(item, e.currentTarget);
        });
        card.querySelector(".hero-delete").addEventListener("click", (e) => { e.stopPropagation(); removeDocument(item); });

        heroCarousel.appendChild(card);

        const dot = document.createElement("div");
        dot.className = "hero-dot" + (index === NEBULA_UI_STATE.heroIndex ? " active" : "");
        dot.addEventListener("click", (e) => {
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
    const cards = heroCarousel.querySelectorAll(".hero-card");
    if (cards[index]) {
        cards[index].scrollIntoView({ behavior: smooth ? "smooth" : "auto", inline: "center", block: "nearest" });
        heroDots.querySelectorAll(".hero-dot").forEach((d, i) => d.classList.toggle("active", i === index));
    }
}

// Dot "estabilizado": só recalcula o índice depois que o scroll para de se mover
// (resolve o bug do dot ficando um índice atrás)
function makeStableScrollHandler(scrollEl, cardSelector, dotsEl, dotSelector, onSettle) {
    let settleTimer = null;
    return () => {
        clearTimeout(settleTimer);
        settleTimer = setTimeout(() => {
            const cards = scrollEl.querySelectorAll(cardSelector);
            if (!cards.length) return;
            const center = scrollEl.scrollLeft + scrollEl.offsetWidth / 2;
            let closest = 0, dist = Infinity;
            cards.forEach((c, idx) => {
                const cCenter = c.offsetLeft + c.offsetWidth / 2;
                const d = Math.abs(center - cCenter);
                if (d < dist) { dist = d; closest = idx; }
            });
            dotsEl.querySelectorAll(dotSelector).forEach((d, i) => d.classList.toggle("active", i === closest));
            onSettle(closest);
        }, 90); // espera o scroll estabilizar antes de mover o dot
    };
}

heroCarousel.addEventListener("scroll", makeStableScrollHandler(
    heroCarousel, ".hero-card", heroDots, ".hero-dot",
    (closest) => { NEBULA_UI_STATE.heroIndex = closest; saveUIState(); }
));

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

// ─────────────────────────────────────────────────────────────────
// 12. RENDER: BIBLIOTECA (carousel principal)
// ─────────────────────────────────────────────────────────────────
function renderLibrary(filter = "") {
    carousel.innerHTML = "";
    const normalized = filter.toLowerCase().trim();
    const items = currentDocs.filter(item => item.name.toLowerCase().includes(normalized));

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
                    <p>${(TYPE_LABELS[item.type] || item.type).toUpperCase()} · ${item.size || "arquivo"} · ${item.source === "localStorage" ? "cache" : "db"}</p>
                </div>
                <div class="card-actions">
                    <button class="btn-icon listen-btn" title="Ouvir Documento">🔊</button>
                    <button class="btn-icon danger delete-btn" title="Apagar Documento">🗑️</button>
                    <button class="open">→</button>
                </div>
            </div>`;

        card.querySelector(".listen-btn").addEventListener("click", (e) => {
            e.stopPropagation();
            speakDocument(item, e.currentTarget);
        });
        card.querySelector(".delete-btn").addEventListener("click", (e) => { e.stopPropagation(); removeDocument(item); });
        card.querySelector(".open").addEventListener("click", (e) => { e.stopPropagation(); openReader(item); });

        // Segurar (long-press) = modo compacto: só alterna a classe, geometria fica 100% no CSS
        let pressTimer = null;
        const startPress = () => { pressTimer = setTimeout(() => carousel.classList.add("compact-mode"), 450); };
        const cancelPress = () => clearTimeout(pressTimer);
        card.addEventListener("touchstart", startPress, { passive: true });
        card.addEventListener("touchend", cancelPress);
        card.addEventListener("touchmove", cancelPress);
        card.addEventListener("mousedown", startPress);
        card.addEventListener("mouseup", cancelPress);
        card.addEventListener("mouseleave", cancelPress);

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

carousel.addEventListener("scroll", makeStableScrollHandler(
    carousel, ".slide", dots, ".dot", () => {}
));

// Toque fora do modo compacto (fora dos cards) volta ao normal
document.addEventListener("click", (e) => {
    if (carousel.classList.contains("compact-mode") && !carousel.contains(e.target)) {
        carousel.classList.remove("compact-mode");
    }
});

// ─────────────────────────────────────────────────────────────────
// 13. UPLOAD / URL EXTERNA
// ─────────────────────────────────────────────────────────────────
async function addFile(file) {
    const type = detectType(file.name, file.type, "");
    let item = {
        id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
        name: file.name,
        type,
        size: formatSize(file.size),
        content: "",
        url: "",
        favorite: false,
        cortexSaved: false,
        updatedAt: Date.now()
    };

    if (type === "pdf" || type === "html") {
        item.fileBlob = file;
        item.url = URL.createObjectURL(file);
        if (type === "html") item.content = await file.text();
    } else {
        item.content = await file.text();
        // Re-detecta com o conteúdo em mãos (ex: .txt que na verdade é JSON)
        item.type = detectType(file.name, file.type, item.content);
    }

    library.unshift(item);
    try { await saveFileToDB(item); } catch (err) {}
    // Importante: NÃO espelha o conteúdo no localStorage — é exatamente essa duplicação
    // que fazia o scanner "contaminar" a Biblioteca com os próprios uploads.
}

function refreshAll() {
    collectDocuments().then(docs => {
        currentDocs = docs;
        renderLibrary(searchInput && searchInput.value ? searchInput.value : "");
        renderHero();
        saveUIState();
    });
}

addButton.addEventListener("click", () => fileInput.click());
fileInput.addEventListener("change", async event => {
    const files = Array.from(event.target.files);
    for (const file of files) await addFile(file);
    fileInput.value = "";
    refreshAll();
    document.dispatchEvent(new Event("fileAdded"));
});

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
        type, url, content: "", size: "Link", favorite: false, cortexSaved: false, updatedAt: Date.now()
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

if (featureOpen) featureOpen.addEventListener("click", () => fileInput.click());

// ─────────────────────────────────────────────────────────────────
// 14. HERO: toggle / autoplay / grupos
// ─────────────────────────────────────────────────────────────────
if (NEBULA_UI_STATE.heroMinimized) {
    heroSection.classList.add("minimized");
    toggleHeroBtn.style.transform = "rotate(-90deg)";
}

toggleHeroBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    NEBULA_UI_STATE.heroMinimized = !heroSection.classList.contains("minimized");
    heroSection.classList.toggle("minimized", NEBULA_UI_STATE.heroMinimized);
    toggleHeroBtn.style.transform = NEBULA_UI_STATE.heroMinimized ? "rotate(-90deg)" : "rotate(0deg)";
    saveUIState();
});

toggleAutoplayBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    NEBULA_UI_STATE.autoplay = !NEBULA_UI_STATE.autoplay;
    toggleAutoplayBtn.textContent = NEBULA_UI_STATE.autoplay ? "⏸" : "▶";
    saveUIState();
    setupAutoplay();
});
toggleAutoplayBtn.textContent = NEBULA_UI_STATE.autoplay ? "⏸" : "▶";

heroGroups.querySelectorAll(".group-pill").forEach(pill => {
    if (pill.getAttribute("data-group") === NEBULA_UI_STATE.activeGroup) {
        heroGroups.querySelectorAll(".group-pill").forEach(p => p.classList.remove("active"));
        pill.classList.add("active");
    }
    pill.addEventListener("click", (e) => {
        e.stopPropagation();
        heroGroups.querySelectorAll(".group-pill").forEach(p => p.classList.remove("active"));
        e.target.classList.add("active");
        NEBULA_UI_STATE.activeGroup = e.target.getAttribute("data-group");
        NEBULA_UI_STATE.heroIndex = 0;
        saveUIState();
        renderHero();
    });
});
// Nota: os pills "apps" / "documentos" / "config" / "cache" já funcionam na lógica de filtro
// acima (getFilteredHeroItems). Se ainda não existem no HTML, basta adicionar
// <button class="group-pill" data-group="apps">Apps</button> etc. — o JS já responde a eles.

// ─────────────────────────────────────────────────────────────────
// 15. INIT
// ─────────────────────────────────────────────────────────────────
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
                cortexSaved: true,
                updatedAt: Date.now()
            }];
        }
        refreshAll();
        setupAutoplay();
        loadVoices(); // pré-carrega vozes assim que possível, pra 1º toque no 🔊 já funcionar
    } catch (err) {
        console.error("[KBLX.DB] Erro na inicialização:", err);
    }
};

window.addEventListener("storage", () => refreshAll());

// ═══════════════════════════════════════════════════════════════════════
// KBLX: CICLO ∅⁺/∅⁻ — RÉGUA ARQUETÍPICA (mantido do v0000, sem alterações)
// ═══════════════════════════════════════════════════════════════════════
(function () {
    "use strict";
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
        { simb: "01", tipo: "passo" }, { simb: "02", tipo: "passo" },
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

        if (document.getElementById("ciclo-passo")) document.getElementById("ciclo-passo").textContent = passo.simb || "01";
        if (document.getElementById("ciclo-arq")) document.getElementById("ciclo-arq").textContent = arqNome;
        if (document.getElementById("ciclo-peso")) document.getElementById("ciclo-peso").textContent = peso.toFixed(3);
        if (document.getElementById("ciclo-delta")) document.getElementById("ciclo-delta").textContent = delta.toFixed(4);
    }

    setTimeout(atualizarPainelCiclo, 300);
    document.addEventListener("fileAdded", () => setTimeout(atualizarPainelCiclo, 100));
})();
