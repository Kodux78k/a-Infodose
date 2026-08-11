
    // ══════════════════════════════════════════════════════════════════
    // KBLX: NÉBULA UNIFICADO — biblioteca de documentos (fundido em Almasliber)
    // Fonte: nebula-unified.js (78HERO) — motor de IndexedDB + scanner de
    // localStorage + TTS + reader, adaptado ao shell/design da Almasliber OS.
    // ══════════════════════════════════════════════════════════════════
    console.log("✅ KBLX.SYSTEM: NÉBULA UNIFICADO · fundido em Almasliber OS.");

    // ── 1. CONFIG / CONSTANTES ──────────────────────────────────────
    const NEB_DB_NAME = "NebulaStorage";
    const NEB_DB_VERSION = 1;
    const NEB_STORE_NAME = "files";
    const NEB_UI_STATE_KEY = "nebula-pro-ui-state";

    // Chaves que o próprio ecossistema usa para si mesmo — nunca viram "documento"
    const NEB_SYSTEM_PREFIXES = ["nebula-", "di_", "kobllux-", "kdev-", "lsdevos-", "baulite-", "hero-", "fav:"];
    const NEB_RESERVED_KEYS = new Set([
      NEB_UI_STATE_KEY, "nebula-theme", "nebula-doc-keys", "nebula-hidden-keys",
      "nebula-pinned-keys", "di_userName", "di_assistantName", "baulite-disabled"
    ]);

    const NEB_TYPE_LABELS = { html: "HTML", markdown: "MARKDOWN", pdf: "PDF", txt: "TXT", json: "JSON" };

    // Mapeia tipo → grupo de exibição (Apps / Documentos / Config / Cache)
    function nebGroupOf(doc) {
      if (doc.source === "localStorage" && !doc.looksLikeDoc) return "cache";
      if (doc.type === "html") return "apps";
      if (doc.type === "json") return "config";
      if (["markdown", "txt", "pdf"].includes(doc.type)) return "documentos";
      return "cache";
    }

    // ── 2. ESTADO ────────────────────────────────────────────────────
    let nebDb;
    let nebLibrary = []; // itens do IndexedDB (upload manual) — fonte "oficial"
    let nebCurrentDocs = []; // library + scan do localStorage, mesclados a cada refresh

    let NEB_UI_STATE = JSON.parse(localStorage.getItem(NEB_UI_STATE_KEY)) || {
      docIndex: 0,
      activeGroup: "recentes",
      autoplay: false
    };
    let nebAutoplayTimer = null;

    function nebSaveUIState() {
      localStorage.setItem(NEB_UI_STATE_KEY, JSON.stringify(NEB_UI_STATE));
    }

    // ── 3. INDEXEDDB (upload manual — camada "oficial") ─────────────
    function nebInitDB() {
      return new Promise((resolve, reject) => {
        const request = indexedDB.open(NEB_DB_NAME, NEB_DB_VERSION);
        request.onupgradeneeded = (event) => {
          nebDb = event.target.result;
          if (!nebDb.objectStoreNames.contains(NEB_STORE_NAME)) {
            nebDb.createObjectStore(NEB_STORE_NAME, { keyPath: "id" });
          }
        };
        request.onsuccess = (event) => { nebDb = event.target.result;
          resolve(nebDb); };
        request.onerror = (event) => reject(event.target.error);
      });
    }

    async function nebSaveFileToDB(item) {
      return new Promise((resolve, reject) => {
        const tx = nebDb.transaction(NEB_STORE_NAME, "readwrite");
        const store = tx.objectStore(NEB_STORE_NAME);
        const safeItem = { ...item };
        delete safeItem.url;
        store.put(safeItem);
        tx.oncomplete = () => resolve();
        tx.onerror = (err) => reject(err);
      });
    }

    async function nebDeleteFileFromDB(id) {
      return new Promise((resolve, reject) => {
        const tx = nebDb.transaction(NEB_STORE_NAME, "readwrite");
        const store = tx.objectStore(NEB_STORE_NAME);
        store.delete(id);
        tx.oncomplete = () => resolve();
        tx.onerror = (err) => reject(err);
      });
    }

    async function nebLoadFilesFromDB() {
      return new Promise((resolve, reject) => {
        const tx = nebDb.transaction(NEB_STORE_NAME, "readonly");
        const store = tx.objectStore(NEB_STORE_NAME);
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

    // ── 4. UTILS ─────────────────────────────────────────────────────
    function nebEscapeHTML(text) {
      return String(text ?? "")
        .replace(/&/g, "&amp;").replace(/</g, "&lt;")
        .replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
    }

    function nebFormatSize(bytes) {
      if (!bytes) return "";
      const units = ["B", "KB", "MB", "GB"];
      let i = 0,
        size = bytes;
      while (size >= 1024 && i < units.length - 1) { size /= 1024;
        i++; }
      return size.toFixed(size >= 10 ? 0 : 1) + " " + units[i];
    }

    function nebMarkdownToHTML(md) {
      let html = nebEscapeHTML(md);
      html = html.replace(/^### (.*)$/gm, "<h3>$1</h3>");
      html = html.replace(/^## (.*)$/gm, "<h2>$1</h2>");
      html = html.replace(/^# (.*)$/gm, "<h1>$1</h1>");
      html = html.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
      html = html.replace(/\*(.*?)\*/g, "<em>$1</em>");
      html = html.replace(/`(.*?)`/g, "<code>$1</code>");
      html = html.replace(/\n\n/g, "</p><p>");
      return "<p>" + html + "</p>";
    }

    function nebExtractTextFromHTML(htmlString) {
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = htmlString;
      return tempDiv.textContent || tempDiv.innerText || "";
    }

    // detectType: pdf > html > markdown > JSON > txt
    function nebDetectType(name = "", mime = "", content = "") {
      const ext = String(name).split(".").pop().toLowerCase();
      const c = String(content || "");
      if (mime.includes("pdf") || ext === "pdf") return "pdf";
      if (mime.includes("html") || ["html", "htm"].includes(ext) || /<!doctype html>|<html/i.test(c)) return "html";
      if (["md", "markdown"].includes(ext) || /^#{1,6}\s/m.test(c) || /\[[^\]]+\]\([^)]+\)/.test(c)) return "markdown";
      if (ext === "json" || (/^[\{\[][\s\S]*[\}\]]$/.test(c.trim()) && c.trim().length > 1)) return "json";
      return "txt";
    }

    function nebPreviewText(content, limit = 170) {
      const flat = String(content || "").replace(/\s+/g, " ").trim();
      if (!flat) return "Sem prévia disponível.";
      return flat.length > limit ? flat.slice(0, limit) + "…" : flat;
    }

    function nebPreviewFromHTML(content) {
      const txt = String(content || "")
        .replace(/<script[\s\S]*?<\/script>/gi, " ")
        .replace(/<style[\s\S]*?<\/style>/gi, " ")
        .replace(/<[^>]+>/g, " ")
        .replace(/\s+/g, " ").trim();
      return txt ? txt.slice(0, 240) : "HTML sem texto legível.";
    }

    // ── 5. SCANNER DE LOCALSTORAGE (descobre documentos sem nunca
    //    sobrescrever a Library "oficial" do IndexedDB) ──────────────
    function nebIsSystemKey(key) {
      return NEB_SYSTEM_PREFIXES.some(prefix => String(key).startsWith(prefix));
    }

    function nebLsEntries() {
      const out = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (NEB_RESERVED_KEYS.has(key) || nebIsSystemKey(key)) continue;
        out.push({ key, val: localStorage.getItem(key) || "" });
      }
      return out;
    }

    function nebSafeJSONParse(v) {
      try { return JSON.parse(v); } catch { return null; }
    }

    function nebScanLocalStorageDocs() {
      const docs = [];
      for (const { key, val } of nebLsEntries()) {
        const parsed = nebSafeJSONParse(val);
        const looksLikeDoc = /doc|note|text|article|draft|html|md|markdown|txt|pdf|summary|prompt/i.test(key);
        const type = nebDetectType(key, "", val);
        let content = val;
        if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
          content = Object.entries(parsed).map(([k, v]) => `${k}: ${typeof v === "string" ? v : JSON.stringify(v)}`).join("\n");
        }
        if (!val) continue;
        docs.push({
          id: `ls-${key}`,
          name: key,
          type,
          size: nebFormatSize(new Blob([val]).size),
          content,
          url: "",
          favorite: false,
          cortexSaved: false,
          source: "localStorage",
          rawKey: key,
          looksLikeDoc,
          updatedAt: 0
        });
      }
      return docs;
    }

    // ── 6. COLETA UNIFICADA (IndexedDB + localStorage, deduplicado) ──
    async function nebCollectDocuments() {
      const dbDocs = nebLibrary.map((item, idx) => ({
        ...item,
        source: "indexeddb",
        updatedAt: item.updatedAt || (Date.now() - idx)
      }));
      const storageDocs = nebScanLocalStorageDocs();

      const merged = [...dbDocs, ...storageDocs];
      const seen = new Set();
      return merged.filter(doc => {
        const sig = `${doc.name}::${doc.type}::${String(doc.content || "").slice(0, 120)}`;
        if (seen.has(sig)) return false;
        seen.add(sig);
        return true;
      });
    }

    function nebGetFilteredDocs() {
      const grp = NEB_UI_STATE.activeGroup;
      const term = (nebSearchInput && nebSearchInput.value || "").toLowerCase().trim();
      let list;
      if (grp === "recentes") list = nebCurrentDocs.filter(d => d.source === "indexeddb").slice(0, 12);
      else if (grp === "favoritos") list = nebCurrentDocs.filter(i => i.favorite);
      else if (grp === "cortex") list = nebCurrentDocs.filter(i => i.cortexSaved);
      else if (grp === "cache") list = nebCurrentDocs.filter(i => nebGroupOf(i) === "cache");
      else if (["apps", "documentos", "config"].includes(grp)) list = nebCurrentDocs.filter(i => nebGroupOf(i) === grp);
      else list = nebCurrentDocs.filter(i => i.type === grp);
      if (term) list = list.filter(i => i.name.toLowerCase().includes(term));
      return list;
    }

    // ── 7. TTS CENTRALIZADO ──────────────────────────────────────────
    let _nebVoicesCache = [];
    let _nebSpeakingBtn = null;

    function nebLoadVoices() {
      return new Promise(resolve => {
        let voices = window.speechSynthesis.getVoices();
        if (voices.length) { _nebVoicesCache = voices;
          resolve(voices); return; }
        const onVoices = () => {
          voices = window.speechSynthesis.getVoices();
          if (voices.length) {
            _nebVoicesCache = voices;
            window.speechSynthesis.removeEventListener("voiceschanged", onVoices);
            resolve(voices);
          }
        };
        window.speechSynthesis.addEventListener("voiceschanged", onVoices);
        setTimeout(() => { if (!_nebVoicesCache.length) onVoices(); }, 500);
      });
    }

    function nebCleanTextForSpeech(doc) {
      if (doc.type === "html") return nebPreviewFromHTML(doc.content) || nebExtractTextFromHTML(doc.content);
      if (doc.type === "json") {
        const parsed = nebSafeJSONParse(doc.content);
        if (parsed) return JSON.stringify(parsed, null, 0).replace(/[{}\[\]"]/g, " ");
        return doc.content || "";
      }
      if (doc.type === "markdown") return String(doc.content || "").replace(/[#*`_>\-]/g, "");
      return doc.content || "";
    }

    async function nebSpeakDocument(doc, btn) {
      const synth = window.speechSynthesis;
      if (!synth) { alert("Este navegador não suporta leitura em voz alta."); return; }

      if (synth.speaking && _nebSpeakingBtn === btn) {
        synth.cancel();
        if (btn) btn.classList.remove("speaking");
        _nebSpeakingBtn = null;
        return;
      }
      if (synth.speaking) synth.cancel();

      const text = nebCleanTextForSpeech(doc).trim();
      if (!text) { alert("Sem texto legível para leitura."); return; }

      const voices = await nebLoadVoices();
      const ptVoice = voices.find(v => v.lang && v.lang.toLowerCase().startsWith("pt-br")) ||
        voices.find(v => v.lang && v.lang.toLowerCase().startsWith("pt"));

      const CHUNK = 1600;
      const chunks = [];
      for (let i = 0; i < text.length; i += CHUNK) chunks.push(text.slice(i, i + CHUNK));

      if (btn) { btn.classList.add("speaking");
        _nebSpeakingBtn = btn; }

      let idx = 0;

      function speakNext() {
        if (idx >= chunks.length) {
          if (btn) btn.classList.remove("speaking");
          _nebSpeakingBtn = null;
          return;
        }
        const utt = new SpeechSynthesisUtterance(chunks[idx]);
        utt.lang = "pt-BR";
        if (ptVoice) utt.voice = ptVoice;
        utt.onend = () => { idx++;
          speakNext(); };
        utt.onerror = () => { if (btn) btn.classList.remove("speaking");
          _nebSpeakingBtn = null; };
        synth.speak(utt);
      }
      speakNext();
    }

    // ── 8. DOM REFS ──────────────────────────────────────────────────
    const nebFileInput = document.getElementById("nebulaFileInput");
    const nebAddBtn = document.getElementById("nebulaAdd");
    const nebSearchToggleBtn = document.getElementById("nebulaSearchToggle");
    const nebOpenUrlBtn = document.getElementById("nebulaOpenUrl");
    const nebSearchBox = document.getElementById("nebulaSearchBox");
    const nebSearchInput = document.getElementById("nebulaSearchInput");
    const nebGroupsEl = document.getElementById("nebulaGroups");
    const nebCarousel = document.getElementById("nebulaCarousel");
    const nebDots = document.getElementById("nebulaDots");
    const nebAutoplayBtn = document.getElementById("nebulaAutoplay");
    const nebSummarySub = document.getElementById("nebulaSummarySub");
    const nebReader = document.getElementById("nebulaReader");
    const nebReaderTitle = document.getElementById("nebulaReaderTitle");
    const nebReaderBody = document.getElementById("nebulaReaderBody");
    const nebReaderClose = document.getElementById("nebulaReaderClose");

    // ── 9. PREVIEW / READER ──────────────────────────────────────────
    function nebCreatePreview(item) {
      const type = item.type;
      if (type === "pdf" || (type === "html" && item.url)) {
        return `
          <div class="file-preview" onclick="nebActivatePreview(event, this, '${item.id}', '${type}', '${item.url}')">
            <span class="type-badge">${type.toUpperCase()}</span>
            <div class="preview-placeholder">
              <span>📄</span>
            </div>
          </div>`;
      }
      if (type === "markdown") {
        const preview = item.content ? nebMarkdownToHTML(nebPreviewText(item.content, 140)) : "<p>Markdown</p>";
        return `<div class="file-preview"><span class="type-badge">MD</span><div class="preview-markdown">${preview}</div></div>`;
      }
      if (type === "json") {
        return `<div class="file-preview"><span class="type-badge">JSON</span><div class="preview-text">${nebEscapeHTML(nebPreviewText(item.content, 140))}</div></div>`;
      }
      if (type === "html") {
        return `<div class="file-preview"><span class="type-badge">HTML</span><div class="preview-text">${nebEscapeHTML(nebPreviewFromHTML(item.content))}</div></div>`;
      }
      return `<div class="file-preview"><span class="type-badge">TXT</span><div class="preview-text">${nebEscapeHTML(nebPreviewText(item.content || "Documento de texto", 140))}</div></div>`;
    }

    window.nebActivatePreview = function(e, container, id, type, url) {
      if (container.querySelector("iframe")) return;
      if (!url) return;
      container.innerHTML = `
        <span class="type-badge">${type.toUpperCase()}</span>
        <button class="close-preview-btn" onclick="nebDeactivatePreview(event, this)" title="Ocultar preview">✕</button>
        <iframe src="${url}" sandbox="allow-scripts allow-same-origin allow-popups allow-forms"></iframe>
      `;
    };

    window.nebDeactivatePreview = function(e, btn) {
      e.stopPropagation();
      const container = btn.closest(".file-preview");
      const type = container.querySelector(".type-badge").textContent.toLowerCase();
      container.innerHTML = `
        <span class="type-badge">${type.toUpperCase()}</span>
        <div class="preview-placeholder"><span>📄</span></div>
      `;
    };

    function nebOpenReader(item) {
      if (window.NebulaSW && typeof window.NebulaSW.open === "function") {
        window.NebulaSW.open(item);
        return;
      }
      nebReaderTitle.textContent = item.name;
      nebReaderBody.innerHTML = "";
      if ((item.type === "pdf" || item.type === "html") && item.url) {
        const iframe = document.createElement("iframe");
        iframe.src = item.url;
        if (item.type === "html") iframe.setAttribute("sandbox", "allow-scripts allow-same-origin allow-popups allow-forms");
        nebReaderBody.appendChild(iframe);
      } else if (item.type === "markdown") {
        nebReaderBody.innerHTML = `<article class="reader-markdown">${nebMarkdownToHTML(item.content)}</article>`;
      } else if (item.type === "json") {
        const pre = document.createElement("pre");
        pre.className = "reader-text";
        const parsed = nebSafeJSONParse(item.content);
        pre.textContent = parsed ? JSON.stringify(parsed, null, 2) : item.content;
        nebReaderBody.appendChild(pre);
      } else {
        const pre = document.createElement("pre");
        pre.className = "reader-text";
        pre.textContent = item.type === "html" ? nebExtractTextFromHTML(item.content) : item.content;
        nebReaderBody.appendChild(pre);
      }
      nebReader.classList.add("opened");
      document.body.style.overflow = "hidden";
    }

    function nebCloseReader() {
      nebReader.classList.remove("opened");
      nebReaderBody.innerHTML = "";
      document.body.style.overflow = "";
    }
    if (nebReaderClose) nebReaderClose.addEventListener("click", nebCloseReader);
    if (nebReader) nebReader.addEventListener("click", (e) => { if (e.target === nebReader) nebCloseReader(); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") nebCloseReader(); });

    // ── 10. REMOÇÃO ───────────────────────────────────────────────────
    async function nebRemoveDocument(doc) {
      if (!confirm(`Tem certeza que deseja apagar "${doc.name}"?`)) return;
      try {
        if (doc.source === "localStorage") {
          localStorage.removeItem(doc.rawKey || doc.name);
        } else {
          await nebDeleteFileFromDB(doc.id);
          nebLibrary = nebLibrary.filter(item => item.id !== doc.id);
        }
        nebRefreshAll();
      } catch (err) {
        console.error("[NÉBULA] Erro ao deletar:", err);
      }
    }

    // ── 11. RENDER: CARDS + DOTS ─────────────────────────────────────
    function nebRenderDocs() {
      if (!nebCarousel) return;
      nebCarousel.innerHTML = "";
      nebDots.innerHTML = "";

      const items = nebGetFilteredDocs();

      if (!items.length) {
        nebCarousel.innerHTML = `<div class="doc-empty">Nenhum item em "${NEB_UI_STATE.activeGroup}".</div>`;
        return;
      }

      if (NEB_UI_STATE.docIndex >= items.length) NEB_UI_STATE.docIndex = 0;

      items.forEach((item, index) => {
        const card = document.createElement("article");
        card.className = "doc-card snap";

        card.innerHTML = `
          <div class="doc-card-preview">${nebCreatePreview(item)}</div>
          <div class="doc-card-info">
            <div>
              <h4>${nebEscapeHTML(item.name)}</h4>
              <p>${(NEB_TYPE_LABELS[item.type] || item.type).toUpperCase()} · ${item.size || "arquivo"} · ${item.source === "localStorage" ? "cache" : "db"}</p>
            </div>
            <div class="doc-card-actions">
              <button class="doc-icon-btn listen-btn" title="Ouvir">🔊</button>
              <button class="doc-icon-btn danger delete-btn" title="Apagar">🗑️</button>
              <button class="doc-open-btn open-btn" title="Abrir">→</button>
            </div>
          </div>
        `;

        card.querySelector(".listen-btn").addEventListener("click", (e) => {
          e.stopPropagation();
          nebSpeakDocument(item, e.currentTarget);
        });
        card.querySelector(".delete-btn").addEventListener("click", (e) => { e.stopPropagation();
          nebRemoveDocument(item); });
        card.querySelector(".open-btn").addEventListener("click", (e) => { e.stopPropagation();
          nebOpenReader(item); });
        card.addEventListener("click", () => nebOpenReader(item));

        nebCarousel.appendChild(card);

        const dot = document.createElement("div");
        dot.className = "doc-dot" + (index === NEB_UI_STATE.docIndex ? " active" : "");
        nebDots.appendChild(dot);
      });

      if (nebSummarySub) {
        const total = nebCurrentDocs.length;
        const cacheCount = nebCurrentDocs.filter(i => nebGroupOf(i) === "cache").length;
        nebSummarySub.textContent = `Nébula · ${total} itens · ${cacheCount} em cache`;
      }
    }

    function nebMakeStableScrollHandler(scrollEl, cardSelector, dotsEl, dotSelector) {
      let settleTimer = null;
      return () => {
        clearTimeout(settleTimer);
        settleTimer = setTimeout(() => {
          const cards = scrollEl.querySelectorAll(cardSelector);
          if (!cards.length) return;
          const center = scrollEl.scrollLeft + scrollEl.offsetWidth / 2;
          let closest = 0,
            dist = Infinity;
          cards.forEach((c, idx) => {
            const cCenter = c.offsetLeft + c.offsetWidth / 2;
            const d = Math.abs(center - cCenter);
            if (d < dist) { dist = d;
              closest = idx; }
          });
          dotsEl.querySelectorAll(dotSelector).forEach((d, i) => d.classList.toggle("active", i === closest));
          NEB_UI_STATE.docIndex = closest;
          nebSaveUIState();
        }, 90);
      };
    }
    if (nebCarousel) {
      nebCarousel.addEventListener("scroll", nebMakeStableScrollHandler(nebCarousel, ".doc-card", nebDots, ".doc-dot"));
    }

    function nebScrollToSlide(index, smooth = true) {
      if (!nebCarousel) return;
      const cards = nebCarousel.querySelectorAll(".doc-card");
      if (cards[index]) {
        cards[index].scrollIntoView({ behavior: smooth ? "smooth" : "auto", inline: "center", block: "nearest" });
        nebDots.querySelectorAll(".doc-dot").forEach((d, i) => d.classList.toggle("active", i === index));
      }
    }

    function nebSetupAutoplay() {
      clearInterval(nebAutoplayTimer);
      if (!NEB_UI_STATE.autoplay) return;
      nebAutoplayTimer = setInterval(() => {
        const items = nebGetFilteredDocs();
        if (items.length <= 1) return;
        NEB_UI_STATE.docIndex = (NEB_UI_STATE.docIndex + 1) % items.length;
        nebSaveUIState();
        nebScrollToSlide(NEB_UI_STATE.docIndex);
      }, 5500);
    }

    // ── 12. UPLOAD / URL EXTERNA ──────────────────────────────────────
    async function nebAddFile(file) {
      const type = nebDetectType(file.name, file.type, "");
      let item = {
        id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
        name: file.name,
        type,
        size: nebFormatSize(file.size),
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
        item.type = nebDetectType(file.name, file.type, item.content);
      }

      nebLibrary.unshift(item);
      try { await nebSaveFileToDB(item); } catch (err) {}
    }

    function nebRefreshAll() {
      nebCollectDocuments().then(docs => {
        nebCurrentDocs = docs;
        nebRenderDocs();
        nebSaveUIState();
      });
    }

    // ── 13. EVENTOS ────────────────────────────────────────────────────
    if (nebAddBtn && nebFileInput) nebAddBtn.addEventListener("click", () => nebFileInput.click());
    if (nebFileInput) nebFileInput.addEventListener("change", async event => {
      const files = Array.from(event.target.files);
      for (const file of files) await nebAddFile(file);
      nebFileInput.value = "";
      nebRefreshAll();
      document.dispatchEvent(new Event("nebulaFileAdded"));
    });

    if (nebSearchToggleBtn && nebSearchBox) {
      nebSearchToggleBtn.addEventListener("click", () => {
        nebSearchBox.classList.toggle("visible");
        if (nebSearchBox.classList.contains("visible") && nebSearchInput) nebSearchInput.focus();
      });
    }
    if (nebSearchInput) nebSearchInput.addEventListener("input", () => nebRenderDocs());

    if (nebOpenUrlBtn) nebOpenUrlBtn.addEventListener("click", async () => {
      const url = prompt("Cole a URL do arquivo ou site externo:");
      if (!url) return;
      const clean = url.split("?")[0].toLowerCase();
      let type = clean.endsWith(".pdf") ? "pdf" : "html";

      let item = {
        id: Date.now().toString(),
        name: url.split("/").pop() || "Documento Web",
        type,
        url,
        content: "",
        size: "Link",
        favorite: false,
        cortexSaved: false,
        updatedAt: Date.now()
      };

      nebLibrary.unshift(item);
      await nebSaveFileToDB(item);
      nebRefreshAll();
    });

    if (nebGroupsEl) {
      nebGroupsEl.querySelectorAll(".group-pill").forEach(pill => {
        if (pill.getAttribute("data-group") === NEB_UI_STATE.activeGroup) {
          nebGroupsEl.querySelectorAll(".group-pill").forEach(p => p.classList.remove("active"));
          pill.classList.add("active");
        }
        pill.addEventListener("click", (e) => {
          nebGroupsEl.querySelectorAll(".group-pill").forEach(p => p.classList.remove("active"));
          e.currentTarget.classList.add("active");
          NEB_UI_STATE.activeGroup = e.currentTarget.getAttribute("data-group");
          NEB_UI_STATE.docIndex = 0;
          nebSaveUIState();
          nebRenderDocs();
        });
      });
    }

    if (nebAutoplayBtn) {
      nebAutoplayBtn.textContent = NEB_UI_STATE.autoplay ? "⏸" : "▶";
      nebAutoplayBtn.addEventListener("click", () => {
        NEB_UI_STATE.autoplay = !NEB_UI_STATE.autoplay;
        nebAutoplayBtn.textContent = NEB_UI_STATE.autoplay ? "⏸" : "▶";
        nebSaveUIState();
        nebSetupAutoplay();
      });
    }

    // ── 14. INIT ─────────────────────────────────────────────────────
    (async function nebInit() {
      try {
        await nebInitDB();
        const savedItems = await nebLoadFilesFromDB();
        if (savedItems && savedItems.length > 0) {
          nebLibrary = savedItems;
        } else {
          nebLibrary = [{
            id: "demo-md",
            name: "Arquitetura Nébula Unificada.md",
            type: "markdown",
            content: "# NÉBULA UNIFICADO\nMotor de biblioteca fundido em Almasliber OS.\n**IndexedDB** guarda os uploads oficiais.\n**localStorage** é escaneado e cai no grupo *Cache*.\n- PDF\n- TXT\n- HTML\n- Markdown\n`Leitura em voz alta` disponível em cada card.",
            size: "Markdown",
            favorite: true,
            cortexSaved: true,
            updatedAt: Date.now()
          }];
        }
        nebRefreshAll();
        nebSetupAutoplay();
        nebLoadVoices();
      } catch (err) {
        console.error("[NÉBULA.DB] Erro na inicialização:", err);
      }
    })();

    window.addEventListener("storage", () => nebRefreshAll());
  