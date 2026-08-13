/* ===== animacoes.js ===== */
// ============================================================
    // 1. ORB 3D AVATAR
    // ============================================================
    // [FUSION: unificado com KARD-Fusion-Card — gradIds únicos por render
    //  (seed+random) evitam colisão de <radialGradient>/<linearGradient> quando
    //  múltiplos orbs do mesmo nome aparecem simultâneos na tela; injectOrbStyles
    //  garante o CSS do orb mesmo se este trecho rodar antes do <style> global.]
    function injectOrbStyles() {
      if (document.getElementById('dual-orb-styles')) return;
      const style = document.createElement('style');
      style.id = 'dual-orb-styles';
      style.innerHTML = `
        @keyframes orbBreathe {
          0%, 100% { transform: translateZ(0) scale(1); opacity: .82; filter: brightness(1); }
          50%      { transform: translateZ(0) scale(1.08); opacity: 1;   filter: brightness(1.22); }
        }

/* animações */
@keyframes orbSpin {
  to { transform: rotate(780deg); }
}

        @keyframes orbPulse { 0% { transform: scale(.78); opacity: .55; } 100% { transform: scale(1.28); opacity: 0; } }
        @keyframes orbFloat {
          0%, 100% { transform: translateY(0px) rotateX(0deg) rotateY(0deg); }
          50%      { transform: translateY(-2px) rotateX(10deg) rotateY(-10deg); }
        }
      `;
      document.head.appendChild(style);
    }

    function makeOrbAvatar(name = 'DUAL', size = 64) {
      injectOrbStyles();
      const safe = String(name || 'DUAL').trim() || 'DUAL';
      const seed = safe.split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
      const h1 = seed % 360;
      const h2 = (seed * 37) % 360;
      const uid = Math.random().toString(36).slice(2, 7);
      const gradId = `orb_${seed.toString(36)}_${uid}`;

      return `
        <div class="dual-orb-wrap" id="${gradId}" style="--orb-size:${size}px; --orb-primary:hsl(${h1},100%,62%); --orb-secondary:hsl(${h2},92%,48%);" aria-label="${safe}" role="img">
          <svg class="dual-orb-svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <defs>
              <radialGradient id="${gradId}_core" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="hsl(${h1},100%,66%)" stop-opacity="1"/>
                <stop offset="55%" stop-color="hsl(${h2},92%,46%)" stop-opacity=".9"/>
                <stop offset="100%" stop-color="hsl(${h2},100%,12%)" stop-opacity="0"/>
              </radialGradient>
              <linearGradient id="${gradId}_ring" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="hsl(${h1},100%,76%)"/>
                <stop offset="100%" stop-color="hsl(${h2},100%,58%)"/>
              </linearGradient>
            </defs>
            <circle cx="50" cy="50" r="46" fill="#05070c"/>
            <circle cx="50" cy="50" r="40" fill="url(#${gradId}_core)" opacity=".28"/>
            <circle cx="50" cy="50" r="38" fill="none" stroke="url(#${gradId}_ring)" stroke-width="1"/>
            <circle cx="50" cy="50" r="46" fill="none" stroke="url(#${gradId}_ring)" stroke-width="2.5" stroke-dasharray="70 20 10 30" stroke-linecap="round" opacity=".86"/>
            <circle cx="50" cy="50" r="8" fill="#ffffff" opacity=".22" filter="blur(2px)"/>
            <circle cx="50" cy="50" r="3" fill="#ffffff" opacity=".85"/>
          </svg>
          <div class="dual-orb-shell">
            <div class="dual-orb-halo"></div>
            <div class="dual-orb-core"></div>
          </div>
        </div>
      `;
    }
    window.makeOrbAvatar = makeOrbAvatar;
    window.makeMiniAvatar = (name) => makeOrbAvatar(name, 24);

    // ============================================================
    // 2. UTILITÁRIOS: ASCII, root369, padTo
    // ============================================================
    function padTo(text, size) {
      text = String(text);
      if (text.length >= size) return text.slice(0, size);
      return text + ' '.repeat(size - text.length);
    }

    function root369(name) {
      const clean = (name || '').trim();
      if (!clean) return '--';
      let n = clean.split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
      while (n > 9) n = String(n).split('').reduce((a, b) => a + Number(b), 0);
      return n;
    }

    function createAsciiActivation(name) {
      const clean = (name || '').trim() || 'Convidado';
      const displayName = `${clean}.Dual Infodose`;
      const title = 'CÉREBRO-ORÁCULO — BASE v1';
      const width = 35;
      const top = `+${'-'.repeat(width)}+`;
      const titleLine = `| ${padTo(title, width - 2)} |`;
      const nameLine = `Ativar: ${displayName}`;
      return {
        ascii: [top, titleLine, top, nameLine].join('\n'),
        displayName,
        root: root369(clean),
        title
      };
    }

    // ============================================================
    // 3. ATUALIZAR INTERFACE (perfil + activation)
    // ============================================================
    function updateAllUI(name) {
      const safe = name || 'Convidado';
      localStorage.setItem('di_userName', safe);

      document.getElementById('heroName').textContent = safe;
      document.getElementById('heroHandle').textContent = '@' + safe.toLowerCase().replace(/\s/g, '');
      document.getElementById('heroAvatar').outerHTML = makeOrbAvatar(safe, 118);
      document.getElementById('topbarMiniOrb').innerHTML = makeOrbAvatar(safe, 32);

      const data = createAsciiActivation(safe);
      document.getElementById('actPreMain').textContent = data.ascii;
      document.getElementById('actBadgeMain').textContent = 'v:' + data.root;
      document.getElementById('actMiniOrb').innerHTML = makeOrbAvatar(safe, 40);

      const input = document.getElementById('inlineNameInput');
      if (input && input.value !== safe) input.value = safe;
    }

    // ============================================================
    // 4. TOASTER
    // ============================================================
    function showToaster(text, type = 'default') {
      const wrap = document.getElementById('toasterWrap');
      if (!wrap) return;
      const el = document.createElement('div');
      el.className = `toaster ${type}`;
      el.textContent = text;
      wrap.appendChild(el);
      requestAnimationFrame(() => el.classList.add('show'));
      setTimeout(() => {
        el.classList.remove('show');
        setTimeout(() => el.remove(), 300);
      }, 2800);
    }

    // ============================================================
    // 5. TEMAS (CLARO/ESCURO)
    // ============================================================
    const themeToggle = document.getElementById('themeToggle');
    themeToggle.addEventListener('click', function() {
      document.body.classList.toggle('theme-dark');
      this.textContent = document.body.classList.contains('theme-dark') ? '☀️' : '🌙';
      localStorage.setItem('theme', document.body.classList.contains('theme-dark') ? 'dark' : 'light');
    });

    if (localStorage.getItem('theme') === 'dark') {
      document.body.classList.add('theme-dark');
      themeToggle.textContent = '☀️';
    }

    // ============================================================
    // 6. BOTÕES COM FUNÇÕES REAIS (V10)
    // ============================================================
    document.getElementById('menuBtn').addEventListener('click', () => {
      showToaster('📋 Menu aberto (simulação)', 'default');
    });

    document.getElementById('notifBtn').addEventListener('click', () => {
      showToaster('🔔 Você tem 3 notificações', 'default');
    });

    document.getElementById('editProfileBtn').addEventListener('click', () => {
      const current = localStorage.getItem('di_userName') || 'Convidado';
      const novo = prompt('Digite seu novo nome:', current);
      if (novo && novo.trim()) {
        updateAllUI(novo.trim());
        showToaster('✅ Nome atualizado!', 'success');
      }
    });

    document.getElementById('profileMenuBtn').addEventListener('click', () => {
      showToaster('⚙️ Opções do perfil (em breve)', 'default');
    });

    document.getElementById('inlineNameInput').addEventListener('input', function() {
      const val = this.value.trim() || 'Convidado';
      updateAllUI(val);
    });

    document.getElementById('copyActBtnMain').addEventListener('click', function() {
      const pre = document.getElementById('actPreMain');
      if (!pre) return;
      navigator.clipboard.writeText(pre.textContent).then(() => {
        showToaster('📋 ASCII copiado!', 'success');
      }).catch(() => {
        const ta = document.createElement('textarea');
        ta.value = pre.textContent;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        ta.remove();
        showToaster('📋 ASCII copiado!', 'success');
      });
    });

    document.getElementById('speakActBtn').addEventListener('click', function() {
      const pre = document.getElementById('actPreMain');
      if (!pre) return;
      const text = pre.textContent;
      if (!('speechSynthesis' in window)) {
        showToaster('❌ TTS não suportado', 'error');
        return;
      }
      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = 'pt-BR';
      utter.rate = 0.9;
      speechSynthesis.cancel();
      speechSynthesis.speak(utter);
      showToaster('🔊 Ouvindo...', 'default');
    });

    document.getElementById('resetActBtn').addEventListener('click', function() {
      const saved = localStorage.getItem('di_userName') || 'Convidado';
      updateAllUI(saved);
      showToaster('↺ Resetado!', 'success');
    });

    document.getElementById('dosesViewAllBtn').addEventListener('click', () => {
      showToaster('💊 Lista de todas as doses (em breve)', 'default');
    });

    document.getElementById('memoriesViewAllBtn').addEventListener('click', () => {
      showToaster('🧠 Arquivo de memórias (em breve)', 'default');
    });

    document.getElementById('startChallengeBtn').addEventListener('click', () => {
      showToaster('🔥 Desafio iniciado! Vamos lá!', 'success');
    });

    // Navegação inferior
    document.getElementById('navLibraryBtn').addEventListener('click', () => {
      document.querySelector('[data-collapse="library"]').open = true;
      document.querySelector('[data-collapse="library"]').scrollIntoView({ behavior: 'smooth' });
    });

    document.getElementById('navResultsBtn').addEventListener('click', () => {
      showToaster('📊 Resultados (em construção)', 'default');
    });

    document.getElementById('navProfileBtn').addEventListener('click', () => {
      document.querySelector('.hero').scrollIntoView({ behavior: 'smooth' });
    });

    document.getElementById('navCreateBtn').addEventListener('click', () => {
      showToaster('➕ Criar novo item (em breve)', 'default');
    });

    // ============================================================
    // 7. INICIALIZAÇÃO (V10)
    // ============================================================
    const savedName = localStorage.getItem('di_userName') || 'Convidado';
    updateAllUI(savedName);

    window.addEventListener('storage', function(e) {
      if (e.key === 'di_userName') {
        updateAllUI(e.newValue || 'Convidado');
      }
    });

    document.dispatchEvent(new CustomEvent('di:name:update', { detail: { name: savedName } }));

    console.log('✅ Almasliber OS — Activation Card + Botões funcionais carregado.');

/* ===== module.js ===== */
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

/* ===== www-infodose-com-br-js-main-2-js.js ===== */
console.log("[RL] Infodose conectado");
    console.log("[RL] Timestamp:", 17787158713512);
    console.log("[RL] ID da sessão:", "348fab2c-a5ef-4d12-8e5b-3fde8577db6a");
    console.log("[RL] Aplicação:", "generated.app");
    import "https://www.infodose.com.br/js/main-2.js";

/* ===== fallbackarchetypes.js ===== */
(function() {
      const fallbackArchetypes = [{
        id: 'kobllux',
        name: 'KOBLLUX',
        tone: 'Núcleo do sistema, oracular',
        modulation: 'Grave-médio, presença de comando, ritmo estável.',
        voice: 'Luciana',
        lang: 'pt-BR',
        rate: 0.98,
        pitch: 0.48,
        color: '#22D3EE',
        theme: {
          primary: '#22D3EE',
          secondary: '#7dd3fc',
          bgSoft: 'radial-gradient(circle at 30% 20%, rgba(34,211,238,.08), transparent)',
          glow: '0 0 18px rgba(34,211,238,.55)'
        }
      }];
      const ARCHETYPES = Array.isArray(window.ARCHETYPES) && window.ARCHETYPES.length ? window.ARCHETYPES :
        fallbackArchetypes;
      window.ARCHETYPES = ARCHETYPES;
      window.KOBLLUX_VOICES = ARCHETYPES.reduce((acc, a) => {
        acc[String(a.name || a.id || '').toLowerCase()] = a;
        acc[String(a.id || '').toLowerCase()] = a;
        return acc;
      }, window.KOBLLUX_VOICES || {});
      const els = {
        voiceSelect: document.getElementById('voiceSelect'),
        rateRange: document.getElementById('rateRange'),
        rateOut: document.getElementById('rateOut'),
        pitchRange: document.getElementById('pitchRange'),
        pitchOut: document.getElementById('pitchOut'),
        voiceCount: document.getElementById('voiceCount'),
        archSelect: document.getElementById('archSelect'),
        archStatus: document.getElementById('archStatus'),
        archUserBadge: document.getElementById('archUserBadge'),
        saveArchBtn: document.getElementById('saveArchBtn'),
        exportArchBtn: document.getElementById('exportArchBtn')
      };
      const ARCH_KEY = 'di_nebula_arch_v1';
      const safeUserName = (name) => {
        const v = String(name || localStorage.getItem('di_userName') || window.di_userName || 'Convidado').trim();
        return v || 'Convidado';
      };
      const normalize = (v) => String(v || '')
        .trim()
        .toLowerCase()
        .replace(/\s+/g, '_')
        .replace(/[^a-z0-9_\-]/g, '');
      const storageKeyForUser = (userName) => `${ARCH_KEY}:${normalize(userName) || 'convidado'}`;
      const readSavedArch = (userName) => {
        try {
          const raw = localStorage.getItem(storageKeyForUser(userName));
          return raw ? JSON.parse(raw) : null;
        } catch (err) {
          console.warn('[ARCH] leitura falhou', err);
          return null;
        }
      };
      const writeSavedArch = (userName, payload) => {
        localStorage.setItem(storageKeyForUser(userName), JSON.stringify(payload));
        localStorage.setItem('di_nebula_arch_last', JSON.stringify(payload));
        window.dispatchEvent(new CustomEvent('KOBLLUX_ARCH_SAVED', { detail: payload }));
      };
      const resolveArch = (userName) => {
        const saved = readSavedArch(userName);
        if (saved?.arch?.id) {
          const match = ARCHETYPES.find(a => normalize(a.id) === normalize(saved.arch.id) || normalize(a.name) === normalize(
            saved.arch.id));
          if (match) return { ...match, ...saved.arch };
        }
        const direct = ARCHETYPES.find(a => normalize(a.id) === normalize(userName) || normalize(a.name) === normalize(
        userName));
        if (direct) return direct;
        return ARCHETYPES[0] || {
          id: normalize(userName) || 'custom',
          name: String(userName || 'Custom').toUpperCase(),
          voice: '',
          lang: '',
          rate: 1.01,
          pitch: 0.871,
        };
      };
      const getPlaybackState = () => ({
        voice: els.voiceSelect?.value || '',
        rate: +(els.rateRange?.value || 1),
        pitch: +(els.pitchRange?.value || 1)
      });
      const applyArchToPlayback = (arch, { persist = false } = {}) => {
        if (!arch) return;
        if (els.archSelect && arch.id) els.archSelect.value = arch.id;
        if (els.archUserBadge) els.archUserBadge.textContent = `user: ${safeUserName()}`;
        if (els.archStatus) {
          els.archStatus.textContent = `${arch.name || arch.id} · id: ${arch.id} · voice: ${arch.voice || '—'}`;
        }
        const voiceName = arch.voice || '';
        if (voiceName && els.voiceSelect) {
          const opt = [...els.voiceSelect.options].find(o => String(o.value).toLowerCase() === String(voiceName)
          .toLowerCase());
          if (opt) els.voiceSelect.value = opt.value;
        }
        if (typeof arch.rate === 'number' && els.rateRange) {
          els.rateRange.value = String(arch.rate);
          if (els.rateOut) els.rateOut.textContent = `${Number(arch.rate).toFixed(1)}×`;
        }
        if (typeof arch.pitch === 'number' && els.pitchRange) {
          els.pitchRange.value = String(arch.pitch);
          if (els.pitchOut) els.pitchOut.textContent = Number(arch.pitch).toFixed(2);
        }
        if (arch.theme) {
          document.documentElement.style.setProperty('--kob-voice-primary', arch.theme.primary || '#22D3EE');
          document.documentElement.style.setProperty('--kob-voice-secondary', arch.theme.secondary || '#7dd3fc');
          document.documentElement.style.setProperty('--kob-voice-glow', arch.theme.glow || '0 0 18px rgba(34,211,238,.55)');
          document.documentElement.style.setProperty('--kob-voice-bg-soft', arch.theme.bgSoft || 'transparent');
        }
        if (persist) {
          saveCurrentArch();
        }
      };
      const populateArchOptions = () => {
        if (!els.archSelect || els.archSelect.options.length) return;
        ARCHETYPES.forEach(a => {
          const opt = document.createElement('option');
          opt.value = String(a.id || a.name || '');
          opt.textContent = a.name || a.id || '—';
          els.archSelect.appendChild(opt);
        });
      };
      const refreshArchStatus = () => {
        const userName = safeUserName();
        const currentArch = resolveArch(userName);
        if (els.archUserBadge) els.archUserBadge.textContent = `user: ${userName}`;
        if (els.archSelect && ARCHETYPES.length) {
          populateArchOptions();
          els.archSelect.value = currentArch.id;
        }
        if (els.archStatus) {
          const saved = readSavedArch(userName);
          els.archStatus.textContent = saved ?
            `Salvo em ${userName} · ${saved.arch?.name || saved.arch?.id || '—'} (${saved.arch?.id || '—'})` :
            `Ativo para ${userName} · ${currentArch.name || currentArch.id}`;
        }
        return currentArch;
      };
      const saveCurrentArch = () => {
        const userName = safeUserName();
        const archId = els.archSelect?.value || resolveArch(userName).id;
        const arch = ARCHETYPES.find(a => String(a.id) === String(archId)) || resolveArch(userName);
        const playback = getPlaybackState();
        const payload = {
          userName,
          archId: arch.id,
          savedAt: new Date().toISOString(),
          arch: {
            ...arch,
            playback,
            userName
          }
        };
        writeSavedArch(userName, payload);
        if (els.archStatus) {
          els.archStatus.textContent = `Salvo em ${userName} · ${arch.name || arch.id} (${arch.id})`;
        }
        return payload;
      };
      const exportCurrentArch = () => {
        const userName = safeUserName();
        const saved = readSavedArch(userName) || saveCurrentArch();
        const payload = saved?.arch ? saved : saveCurrentArch();
        const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${normalize(userName)}_${normalize(payload.arch?.id || 'arch')}.json`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
      };
      const mountArchUI = () => {
        const current = refreshArchStatus();
        if (!els.archSelect) return;
        populateArchOptions();
        if (current?.id) els.archSelect.value = current.id;
        applyArchToPlayback(current, { persist: false });
        els.archSelect.addEventListener('change', () => {
          const arch = ARCHETYPES.find(a => String(a.id) === String(els.archSelect.value));
          if (arch) {
            applyArchToPlayback(arch, { persist: false });
            saveCurrentArch();
          }
        });
        els.saveArchBtn?.addEventListener('click', () => {
          const saved = saveCurrentArch();
          if (saved) {
            els.archStatus && (els.archStatus.textContent =
              `Salvo em ${saved.userName} · ${saved.arch?.name || saved.archId} (${saved.archId})`);
          }
        });
        els.exportArchBtn?.addEventListener('click', exportCurrentArch);
        ['voiceSelect', 'rateRange', 'pitchRange'].forEach(id => {
          const el = document.getElementById(id);
          if (!el) return;
          el.addEventListener('change', () => {
            refreshArchStatus();
          });
          el.addEventListener('input', () => {
            refreshArchStatus();
          });
        });
        window.addEventListener('KOBLLUX_ARCH_REQUEST_REFRESH', refreshArchStatus);
      };
      const patchUpdateInterface = () => {
        const original = window.updateInterface;
        if (typeof original === 'function' && !original.__archPatched) {
          const wrapped = function(name) {
            const result = original.apply(this, arguments);
            try {
              refreshArchStatus();
            } catch (err) {
              console.warn('[ARCH] refresh falhou', err);
            }
            return result;
          };
          wrapped.__archPatched = true;
          window.updateInterface = wrapped;
        }
      };
      const boot = () => {
        mountArchUI();
        patchUpdateInterface();
        refreshArchStatus();
        const userName = safeUserName();
        const saved = readSavedArch(userName);
        if (saved?.arch) {
          applyArchToPlayback(saved.arch, { persist: false });
        } else {
          const guessed = resolveArch(userName);
          applyArchToPlayback(guessed, { persist: false });
          saveCurrentArch();
        }
      };
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', boot, { once: true });
      } else {
        boot();
      }
      window.NEBULA_ARCH = {
        getUserName: safeUserName,
        get: readSavedArch,
        save: saveCurrentArch,
        export: exportCurrentArch,
        list: () => ARCHETYPES.slice()
      };
    })();

/* ===== helper-pega-o-primeiro-id-existente.js ===== */
try {

/* FUSION CORE LOGIC (V7)
   Preserving di_ constants for external app communication
*/

// Helper: pega o primeiro ID existente
const byId = (...ids) => ids.map(id => document.getElementById(id)).find(Boolean);

// REFERENCES
const els = {
  card: byId('mainCard'),
  header: byId('cardHeader'),
  avatarTgt: byId('avatarTarget'),
  input: byId('kardinputUser', 'inputUser', 'userInput'),
  lblHello: byId('lblHello'),
  lblName: byId('lblName'),
  clock: byId('clockTime'),
  smallPreview: byId('smallPreview'),
  smallMiniAvatar: byId('smallMiniAvatar'),
  smallText: byId('smallText'),
  smallIdent: byId('smallIdent'),
  actCard: byId('activationCard'),
  actPre: byId('actPre'),
  actName: byId('actName'),
  actMiniAvatar: byId('actMiniAvatar'),
  actBadge: byId('actBadge'),
  // Buttons
  btnModeCard: byId('btnModeCard'),
  btnModeOrb: byId('btnModeOrb'),
  btnModeHud: byId('btnModeHud'),
  orbMenuTrigger: byId('orbMenuTrigger'),
  hudMenuBtn: byId('hudMenuBtn'),
  snapZone: byId('snap-zone'),
  // Keys UI
  keysModal: byId('keysModal'),
  keyList: byId('keyList'),
  keyName: byId('keyNameInput'),
  keyToken: byId('keyTokenInput'),
  addKeyBtn: byId('addKeyBtn'),
  closeKeysBtn: byId('closeKeysBtn'),
  lockVaultBtn: byId('lockVaultBtn'),
  vaultStatusText: byId('vaultStatusText'),
  // Vault UI
  vaultModal: byId('vaultModal'),
  vaultPass: byId('vaultPassInput'),
  vaultUnlock: byId('vaultUnlockBtn'),
  vaultCancel: byId('vaultCancelBtn'),
  // System UI
  systemCard: byId('systemCard'),
  saveSystemBtn: byId('saveSystemBtn'),
  copyActBtn: byId('copyActBtn')
};

// --- CRYPTO UTILS ---
const CRYPTO = {
  algo: { name: 'AES-GCM', length: 256 },
  pbkdf2: { name: 'PBKDF2', hash: 'SHA-256', iterations: 100000 },
  async getKey(password, salt) {
    const enc = new TextEncoder();
    const keyMaterial = await window.crypto.subtle.importKey("raw", enc.encode(password), "PBKDF2", false, ["deriveKey"]);
    return window.crypto.subtle.deriveKey({ ...this.pbkdf2, salt: salt }, keyMaterial, this.algo, false, ["encrypt", "decrypt"]);
  },
  async encrypt(data, password) {
    const salt = window.crypto.getRandomValues(new Uint8Array(16));
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const key = await this.getKey(password, salt);
    const encoded = new TextEncoder().encode(JSON.stringify(data));
    const encrypted = await window.crypto.subtle.encrypt({ name: "AES-GCM", iv: iv }, key, encoded);
    const bundle = { s: Array.from(salt), iv: Array.from(iv), d: Array.from(new Uint8Array(encrypted)) };
    return JSON.stringify(bundle);
  },
  async decrypt(bundleStr, password) {
    try {
      const bundle = JSON.parse(bundleStr);
      const salt = new Uint8Array(bundle.s);
      const iv = new Uint8Array(bundle.iv);
      const data = new Uint8Array(bundle.d);
      const key = await this.getKey(password, salt);
      const decrypted = await window.crypto.subtle.decrypt({ name: "AES-GCM", iv: iv }, key, data);
      return JSON.parse(new TextDecoder().decode(decrypted));
    } catch(e) { throw new Error("Senha incorreta ou dados corrompidos"); }
  }
};

// --- STATE & PERSISTENCE ---
const STORAGE_KEY = 'fusion_os_data_v2';
const UI_STATE_KEY = 'fusion_os_ui_state';

let STATE = {
  keys: [],
  user: 'Convidado',
  isEncrypted: false,
  encryptedData: null
};
let SESSION_PASSWORD = null;

// IMPORTANT: Loading initial di_ constants if available
let apiKey = localStorage.getItem('di_apiKey') || '';
let modelName = localStorage.getItem('di_modelName') || 'nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free';
let userName = localStorage.getItem('di_userName') || '';
let infodoseName = localStorage.getItem('di_infodoseName') || '';

function saveUIState() {
  const mode = state.isOrb ? 'orb' : (state.isHud ? 'hud' : 'card');
  const uiState = {
    mode: mode,
    left: els.card?.style.left || '',
    top: els.card?.style.top || ''
  };
  localStorage.setItem(UI_STATE_KEY, JSON.stringify(uiState));
}

function loadUIState() {
  const raw = localStorage.getItem(UI_STATE_KEY);
  if (!raw) return;
  try {
    const ui = JSON.parse(raw);
    if (ui.mode === 'orb' || ui.mode === 'hud') {
      if (els.card) els.card.style.transition = 'none';
      if (ui.mode === 'orb') {
        if (ui.left && els.card) els.card.style.left = ui.left;
        if (ui.top && els.card) els.card.style.top = ui.top;
        window.setMode('orb', true);
      } else {
        window.setMode('hud', true);
      }
      setTimeout(() => { if (els.card) els.card.style.transition = ''; }, 200);
    }
  } catch(e) { console.error("UI Load Error", e); }
}

function saveData() {
  const payload = { keys: STATE.keys, user: STATE.user };
  if (SESSION_PASSWORD) {
    CRYPTO.encrypt(payload, SESSION_PASSWORD).then(enc => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ isEncrypted: true, data: enc }));
      STATE.isEncrypted = true;
      STATE.encryptedData = enc;
      updateSecurityUI();
    });
  } else {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ isEncrypted: false, data: payload }));
  }
}

async function loadData() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return;
  const parsed = JSON.parse(raw);
  if (parsed.isEncrypted) {
    STATE.isEncrypted = true;
    STATE.encryptedData = parsed.data;
    updateSecurityUI();
  } else {
    STATE.keys = parsed.data.keys || [];
    STATE.user = parsed.data.user || 'Convidado';

    const active = STATE.keys.find(k => k.active);
    if (active && active.token) {
      localStorage.setItem('di_apiKey', active.token);
      apiKey = active.token;
    }

    if (STATE.user !== 'Convidado') {
      localStorage.setItem('di_userName', STATE.user);
      userName = STATE.user;
      const userInput = byId('kardinputUser', 'inputUser', 'userInput');
      if (userInput) userInput.value = STATE.user;
    }

    updateInterface(STATE.user);
    renderKeysList();
  }

  const apiInput = byId('kardapiKeyInput', 'apiKeyInput', 'cardApiKeyInput');
  const infoInput = byId('kardinfodoseNameInput', 'infodoseNameInput', 'cardInfodoseNameInput');
  const modelInput = byId('kardmodelSelect', 'modelSelect', 'cardModelSelect');

  if (apiInput) apiInput.value = apiKey;
  if (infoInput) infoInput.value = infodoseName;
  if (modelInput) modelInput.value = modelName;
}

const hashStr = s => { let h = 0xdeadbeef; for (let i = 0; i < s.length; i++) { h = Math.imul(h ^ s.charCodeAt(i), 2654435761); } return (h ^ h >>> 16) >>> 0; };

/* [FIX] updateInterface unificada — usa makeOrbAvatar (orb 3D animado) em vez das
   funções createSvg/createMiniSvg (removidas por serem redundantes e não usadas
   em mais nenhum lugar). Também é a única definição desta função no arquivo —
   havia uma segunda cópia mais abaixo que referenciava a variável inexistente
   "di_userName" e quebrava com ReferenceError sempre que "name" vinha vazio. */
function updateInterface(name) {
  const safe = name || 'Convidado';
  if (els.lblName) els.lblName.innerText = safe;
  if (els.input) els.input.value = safe;
  const activeKey = STATE.keys.find(k => k.active);
  if (els.smallIdent) els.smallIdent.innerText = activeKey ? activeKey.name : '--';
  if (els.actBadge) els.actBadge.innerText = activeKey ? `key:${activeKey.name}` : 'v:--';
  if (els.avatarTgt) els.avatarTgt.innerHTML = window.makeOrbAvatar ? window.makeOrbAvatar(safe, 64) : '';
  if (els.smallMiniAvatar) els.smallMiniAvatar.innerHTML = window.makeOrbAvatar ? window.makeOrbAvatar(safe, 24) : '';
  if (els.actMiniAvatar) els.actMiniAvatar.innerHTML = window.makeOrbAvatar ? window.makeOrbAvatar(safe, 36) : '';
  if (els.actName) els.actName.innerText = safe;
  const phrases = ["Foco estável.", "Ritmo criativo.", "Percepção sutil."];
  if (els.smallText) els.smallText.innerText = activeKey ? `${activeKey.name} [ATIVO]` : (safe === 'Convidado' ? 'Aguardando...' : `${safe} · ${phrases[safe.length % phrases.length]}`);
  const line = `+${'-'.repeat(safe.length + 4)}+`;
  if (els.actPre) els.actPre.innerText = `${line}\n| ${safe.toUpperCase()} |\n${line}\nID: ${hashStr(safe).toString(16)}`;
}

function updateSecurityUI() {
  if (!els.vaultStatusText || !els.lockVaultBtn) return;
  if (SESSION_PASSWORD) {
    els.vaultStatusText.innerText = "Cofre Protegido (Destrancado)";
    els.lockVaultBtn.innerText = "TRANCAR";
  } else if (STATE.isEncrypted) {
    els.vaultStatusText.innerText = "Cofre Trancado";
    els.lockVaultBtn.innerText = "REDEFINIR";
  } else {
    els.vaultStatusText.innerText = "Cofre Aberto (Sem senha)";
    els.lockVaultBtn.innerText = "CRIAR SENHA";
  }
}

function renderKeysList() {
  if (!els.keyList) return;
  els.keyList.innerHTML = '';
  if (STATE.keys.length === 0) {
    els.keyList.innerHTML = '<div style="color:rgba(255,255,255,0.3);text-align:center;padding:20px">Nenhuma chave armazenada.</div>';
    return;
  }
  STATE.keys.forEach(k => {
    const div = document.createElement('div');
    div.className = `key-item ${k.active ? 'active-item' : ''}`;
    div.innerHTML = `
      <div class="meta" style="flex:1"><div style="font-weight:700;font-size:0.9rem">${escapeHtml(k.name)}</div></div>
      <div class="actions">
        ${!k.active ? `<button class="small-btn" onclick="setActiveKey('${k.id}')">ATIVAR</button>` : `<span style="font-size:0.7rem;font-weight:700;color:var(--neon-cyan);margin-right:10px">ATIVA</span>`}
        <button class="small-btn danger" onclick="removeKey('${k.id}')">
          <!-- Ícone trash-2 inline -->
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 4V3c0-1 1-2 2-2h4c1 0 2 1 2 2v1"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
        </button>
      </div>`;
    els.keyList.appendChild(div);
  });
}

function addKey() {
  const name = els.keyName ? els.keyName.value.trim() : '';
  const token = els.keyToken ? els.keyToken.value.trim() : '';
  if (!name) { showToaster('Nome obrigatório', 'error'); return; }
  const newKey = { id: Date.now().toString(36), name, token, active: STATE.keys.length === 0 };
  STATE.keys.push(newKey);

  if (newKey.active && newKey.token) {
    localStorage.setItem('di_apiKey', newKey.token);
    apiKey = newKey.token;
  }

  saveData(); renderKeysList(); updateInterface(STATE.user);
  if (els.keyName) els.keyName.value = '';
  if (els.keyToken) els.keyToken.value = '';
  showToaster('Chave adicionada!', 'success');
}

window.removeKey = (id) => {
  if (confirm('Remover chave permanentemente?')) {
    STATE.keys = STATE.keys.filter(k => k.id !== id);
    saveData(); renderKeysList(); updateInterface(STATE.user);
  }
};

window.setActiveKey = (id) => {
  let activatedToken = null;
  STATE.keys.forEach(k => {
    k.active = (k.id === id);
    if (k.active) activatedToken = k.token;
  });

  if (activatedToken) {
    localStorage.setItem('di_apiKey', activatedToken);
    apiKey = activatedToken;
    const apiInput = byId('kardapiKeyInput', 'apiKeyInput', 'cardApiKeyInput');
    if (apiInput) apiInput.value = activatedToken;
    showToaster('Chave sincronizada com o Chat.', 'success');
  }

  saveData(); renderKeysList(); updateInterface(STATE.user);
};

// --- VAULT EVENTS ---
function openManager() {
  if (STATE.isEncrypted && !SESSION_PASSWORD) {
    if (els.vaultModal) els.vaultModal.style.display = 'flex';
    if (els.vaultPass) els.vaultPass.focus();
  } else {
    if (els.keysModal) els.keysModal.style.display = 'flex';
  }
}

if (els.vaultUnlock) els.vaultUnlock.addEventListener('click', async () => {
  const pass = els.vaultPass ? els.vaultPass.value : '';
  try {
    const decrypted = await CRYPTO.decrypt(STATE.encryptedData, pass);
    SESSION_PASSWORD = pass; STATE.keys = decrypted.keys; STATE.user = decrypted.user;
    const active = STATE.keys.find(k => k.active);

    if (active && active.token) { localStorage.setItem('di_apiKey', active.token); apiKey = active.token; }
    if (STATE.user) { localStorage.setItem('di_userName', STATE.user); userName = STATE.user; }

    if (els.vaultModal) els.vaultModal.style.display = 'none';
    if (els.keysModal) els.keysModal.style.display = 'flex';
    if (els.vaultPass) els.vaultPass.value = '';
    renderKeysList(); updateSecurityUI(); showToaster('Cofre destrancado.', 'success');
  } catch(e) { showToaster('Senha incorreta.', 'error'); }
});

if (els.lockVaultBtn) els.lockVaultBtn.addEventListener('click', () => {
  if (!SESSION_PASSWORD && !STATE.isEncrypted) {
    const newPass = prompt("Defina uma senha para o Cofre:");
    if (newPass) { SESSION_PASSWORD = newPass; saveData(); showToaster("Cofre trancado.", 'success'); }
  } else if (SESSION_PASSWORD) {
    SESSION_PASSWORD = null;
    if (els.keysModal) els.keysModal.style.display = 'none';
    showToaster("Sessão do cofre encerrada.", 'success');
  } else {
    showToaster("Cofre já criptografado. Desbloqueie para redefinir.", 'error');
  }
  updateSecurityUI();
});

if (els.vaultCancel) els.vaultCancel.addEventListener('click', () => { if (els.vaultModal) els.vaultModal.style.display = 'none'; });
if (els.closeKeysBtn) els.closeKeysBtn.addEventListener('click', () => { if (els.keysModal) els.keysModal.style.display = 'none'; });
if (els.addKeyBtn) els.addKeyBtn.addEventListener('click', addKey);

// --- CINEMATIC GESTURES & MODES (REFINED V7) ---
let state = {
  isOrb: false,
  isHud: false,
  isDragging: false,
  timer: null,
  startX: 0,
  startY: 0,
  dragOffsetX: 0,
  dragOffsetY: 0,
  pointerId: null
};

const FIRST_PREVIEW_DURATION = 5000;
const HUD_SNAP_THRESHOLD = 60;
const SWIPE_DOWN_THRESHOLD = 80;
const LONG_PRESS_MS = 350;

if (els.card) els.card.addEventListener('pointerdown', handleStart, { passive: false });
window.addEventListener('pointermove', handleMove, { passive: false });
window.addEventListener('pointerup', handleEnd, { passive: false });

// Opening Configs
if (els.avatarTgt) els.avatarTgt.addEventListener('click', (e) => { if (!state.isOrb && !state.isHud) openManager(); });
if (els.orbMenuTrigger) els.orbMenuTrigger.addEventListener('click', (e) => { e.stopPropagation(); window.setMode('card'); toggleSection('systemCard', true); });
if (els.hudMenuBtn) els.hudMenuBtn.addEventListener('click', (e) => { e.stopPropagation(); window.setMode('card'); toggleSection('systemCard', true); });

if (els.header) {
  els.header.addEventListener('click', (e) => {
    if (state.isHud && !state.isDragging && !e.target.closest('.hud-menu-btn')) {
      window.setMode('card');
      toggleSection('systemCard', true);
    }
  });
}

if (els.card) els.card.addEventListener('contextmenu', (e) => {
  if (state.isOrb || state.isHud) { e.preventDefault(); window.setMode('card'); }
});

function handleStart(e) {
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT' || (e.target.tagName === 'BUTTON' && !e.target.closest('.orb-menu-trigger'))) return;
  if (!state.isOrb && !state.isHud && !els.header?.contains(e.target)) return;

  state.startX = e.clientX;
  state.startY = e.clientY;
  state.pointerId = e.pointerId;

  if (state.isOrb || state.isHud) {
    state.isDragging = true;
    try { els.card.setPointerCapture(e.pointerId); } catch(err){}
    const rect = els.card.getBoundingClientRect();
    state.dragOffsetX = e.clientX - rect.left;
    state.dragOffsetY = e.clientY - rect.top;
    els.card.style.transition = 'none';
    return;
  }

  state.timer = setTimeout(() => {
    transmuteToOrb(e);
    saveUIState();
  }, LONG_PRESS_MS);
}

function handleMove(e) {
  if (!state.isOrb && !state.isHud && state.timer) {
    const dx = e.clientX - state.startX;
    const dy = e.clientY - state.startY;
    const dist = Math.hypot(dx, dy);

    if (dist > 12 && (dy < -10 || Math.abs(dx) > 18)) {
      clearTimeout(state.timer); state.timer = null;
      transmuteToOrb(e);
      const rect = els.card.getBoundingClientRect();
      state.dragOffsetX = e.clientX - rect.left;
      state.dragOffsetY = e.clientY - rect.top;
      try { els.card.setPointerCapture(e.pointerId); } catch(err){}
      els.card.style.transition = 'none';
    }
  }

  if (!state.isDragging) return;
  e.preventDefault();

  if (state.isOrb) {
    const x = e.clientX - state.dragOffsetX;
    const y = e.clientY - state.dragOffsetY;
    els.card.style.left = `${x}px`;
    els.card.style.top = `${y}px`;

    if (y < HUD_SNAP_THRESHOLD) els.snapZone?.classList.add('active');
    else els.snapZone?.classList.remove('active');

  } else if (state.isHud) {
    const deltaY = e.clientY - state.startY;
    if (deltaY > 0) {
      els.card.style.transform = `translateX(-50%) translateY(${deltaY * 0.4}px)`;
      if (deltaY > SWIPE_DOWN_THRESHOLD) els.snapZone?.classList.add('active');
      else els.snapZone?.classList.remove('active');
    }
  }
}

function handleEnd(e) {
  if (state.timer) { clearTimeout(state.timer); state.timer = null; }

  if (state.isDragging) {
    state.isDragging = false;
    try { els.card.releasePointerCapture && els.card.releasePointerCapture(state.pointerId); } catch(err){}
    els.card.style.transition = '';
    els.snapZone?.classList.remove('active');

    if (state.isOrb) {
      const rect = els.card.getBoundingClientRect();
      if (rect.top < HUD_SNAP_THRESHOLD) {
        setMode('hud');
      } else {
        saveUIState();
      }
    } else if (state.isHud) {
      const deltaY = e.clientY - state.startY;
      if (deltaY > SWIPE_DOWN_THRESHOLD) {
        const x = e.clientX - 34;
        const y = e.clientY - 10;
        els.card.style.left = `${x}px`;
        els.card.style.top = `${y}px`;
        setMode('orb');
      } else {
        els.card.style.transform = `translateX(-50%) translateY(0)`;
      }
    }
  } else {
    if (!state.isOrb && !state.isHud && els.header?.contains(e.target)) {
      toggleCardState();
    }
  }
  state.pointerId = null;
}

function transmuteToOrb(eOrX) {
  let x, y, ev;
  if (eOrX && eOrX.clientX !== undefined) { ev = eOrX; x = ev.clientX; y = ev.clientY; }
  else { return; }

  if (navigator.vibrate) navigator.vibrate(40);
  els.card.classList.add('orb', 'closed');
  els.card.classList.remove('content-visible');

  els.card.style.left = (x - 34) + 'px';
  els.card.style.top = (y - 34) + 'px';

  state.isOrb = true; state.isHud = false;

  state.isDragging = true;
  if (ev && ev.pointerId) {
    state.pointerId = ev.pointerId;
    try { els.card.setPointerCapture(ev.pointerId); } catch(e){}
    const rect = els.card.getBoundingClientRect();
    state.dragOffsetX = x - rect.left;
    state.dragOffsetY = y - rect.top;
  }

  updateModeButtons('orb');
}

function revertToCard() {
  state.isOrb = false; state.isHud = false;
  els.card.style.transition = 'all 0.5s var(--ease-smooth)';
  els.card.style.left = ''; els.card.style.top = '';
  els.card.style.width = ''; els.card.style.height = '';
  els.card.style.transform = '';
  els.card.classList.remove('orb', 'hud', 'closed');
  setTimeout(() => els.card.classList.add('content-visible'), 300);
}

window.setMode = (mode, isInitialLoad = false) => {
  updateModeButtons(mode);

  if (mode === 'card') {
    revertToCard();
  } else if (mode === 'orb') {
    state.isOrb = true; state.isHud = false;
    els.card.classList.add('orb', 'closed');
    els.card.classList.remove('hud', 'content-visible');
    els.card.style.transform = 'none';
  } else if (mode === 'hud') {
    state.isHud = true; state.isOrb = false;
    els.card.classList.add('hud', 'closed');
    els.card.classList.remove('orb', 'content-visible');
    els.card.style.top = '';
    els.card.style.left = '';
    els.card.style.transform = '';
  }

  if (!isInitialLoad) saveUIState();
};

function updateModeButtons(mode) {
  [els.btnModeCard, els.btnModeOrb, els.btnModeHud].forEach(b => b && b.classList.remove('active-mode'));
  if (mode === 'card' && els.btnModeCard) els.btnModeCard.classList.add('active-mode');
  if (mode === 'orb' && els.btnModeOrb) els.btnModeOrb.classList.add('active-mode');
  if (mode === 'hud' && els.btnModeHud) els.btnModeHud.classList.add('active-mode');
}

function toggleCardState() {
  if (els.card.classList.contains('animating')) return;
  const isClosed = els.card.classList.contains('closed');
  els.card.classList.add('animating');
  if (isClosed) {
    els.card.classList.remove('closed');
    els.card.animate([{ transform: 'scale(0.95)', opacity: 0.8 }, { transform: 'scale(1)', opacity: 1 }], { duration: 400 }).onfinish = () => {
      els.card.classList.remove('animating');
      els.card.classList.add('content-visible');
    };
  } else {
    els.card.classList.remove('content-visible');
    els.card.animate([{ transform: 'translateY(0)', opacity: 1 }, { transform: 'translateY(10px)', opacity: 1 }], { duration: 200 }).onfinish = () => {
      els.card.classList.add('closed');
      els.card.classList.remove('animating');
    };
  }
}

function escapeHtml(s) { return s ? s.replace(/[&<>"']/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c])) : ''; }
// [FUSION: showToaster unificado — usa a função global já definida no bloco ALMASLIBER CORE, mesmo #toasterWrap]
function toggleSection(id, forceOpen = false) {
  const el = document.getElementById(id);
  if (!el) return;
  const h = el.classList.contains('activation-hidden');
  if (forceOpen && !h) return;
  el.classList.toggle('activation-hidden', !forceOpen && !h);
  el.classList.toggle('activation-open', forceOpen || h);
}

// Logic Init
if (els.input) {
  els.input.addEventListener('input', (e) => {
    STATE.user = e.target.value;
    localStorage.setItem('di_userName', STATE.user);
    updateInterface(e.target.value);
    saveData();
  });
}

if (els.copyActBtn) {
  els.copyActBtn.addEventListener('click', async () => {
    try {
      const txt = document.getElementById('actPre')?.innerText || '';
      await navigator.clipboard.writeText(txt);
      showToaster('Ativação copiada', 'success');
    } catch(e) { showToaster('Erro ao copiar ativação', 'error'); }
  });
}

if (els.saveSystemBtn) {
  els.saveSystemBtn.addEventListener('click', () => {
    infodoseName = byId('kardinfodoseNameInput', 'infodoseNameInput', 'cardInfodoseNameInput')?.value.trim() || '';
    const newKey = byId('kardapiKeyInput', 'apiKeyInput', 'cardApiKeyInput')?.value.trim() || '';
    const newModel = byId('kardmodelSelect', 'modelSelect', 'cardModelSelect')?.value.trim() || '';

    if (newKey) {
      apiKey = newKey;
      localStorage.setItem('di_apiKey', apiKey);
      if (typeof STATE !== 'undefined') {
        const active = STATE.keys.find(k => k.active);
        if (active) { active.token = newKey; saveData(); }
      }
    }

    modelName = newModel || modelName;
    localStorage.setItem('di_modelName', modelName);
    localStorage.setItem('di_infodoseName', infodoseName);

    toggleSection('systemCard', false);
    showToaster('Configurações Salvas (di_ synced)', 'success');
  });
}

// KEY para controlar primeira exibição do small preview
const FIRST_PREVIEW_KEY = 'fusion_orb_smallpreview_shown';

function showFirstRunPreviewIfNeeded() {
  try {
    if (localStorage.getItem(FIRST_PREVIEW_KEY)) return;
    if (state.isOrb || state.isHud) return;

    const rawUi = localStorage.getItem(UI_STATE_KEY);
    if (rawUi) {
      try {
        const parsed = JSON.parse(rawUi);
        if (parsed && parsed.mode === 'orb') return;
      } catch(_) {}
    }

    els.card.classList.add('closed');
    if (els.smallPreview) {
      els.smallPreview.style.display = 'flex';
      els.smallPreview.style.opacity = 0;
      requestAnimationFrame(() => els.smallPreview.style.transition = 'opacity 260ms ease-out');
      requestAnimationFrame(() => els.smallPreview.style.opacity = 1);
    }

    els.card.classList.remove('content-visible');
    localStorage.setItem(FIRST_PREVIEW_KEY, '1');
    saveUIState();

  } catch (err) {
    console.error('First preview error', err);
  }
}

// INITIAL LOAD (CINEMATIC SMALL PREVIEW)
setTimeout(() => {
  els.card?.classList.add('active');
  els.avatarTgt?.classList.add('shown');

  loadData();

  const rawUi = localStorage.getItem(UI_STATE_KEY);
  let savedMode = 'card';
  let savedLeft = null;
  let savedTop = null;

  if (rawUi) {
    try {
      const parsed = JSON.parse(rawUi);
      savedMode = parsed.mode || 'card';
      savedLeft = parsed.left;
      savedTop = parsed.top;
    } catch(e) {}
  }

  forceSmallPreview();

  setTimeout(() => {
    restoreSavedMode(savedMode, savedLeft, savedTop);
  }, FIRST_PREVIEW_DURATION);

}, 100);

setInterval(() => {
  if (els.clock) {
    els.clock.innerText = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  }
}, 1000);

function forceSmallPreview() {
  state.isOrb = false;
  state.isHud = false;

  els.card.classList.remove('orb', 'hud');
  els.card.classList.add('closed');
  els.card.classList.remove('content-visible');

  els.card.style.left = '';
  els.card.style.top = '';
  els.card.style.transform = '';

  els.card.style.opacity = 0;
  els.card.style.transition = 'opacity 400ms ease';
  requestAnimationFrame(() => {
    els.card.style.opacity = 1;
  });
}

function restoreSavedMode(mode, left, top) {
  els.card.style.transition = 'all 600ms var(--ease-smooth)';

  if (mode === 'orb') {
    if (left) els.card.style.left = left;
    if (top) els.card.style.top = top;
    window.setMode('orb');
  } else if (mode === 'hud') {
    window.setMode('hud');
  } else {
    window.setMode('card');
    els.card.classList.remove('closed');
    els.card.classList.add('content-visible');
  }
}

(function () {
  function getNameValue() {
    const input = byId('inputUser', 'kardinputUser', 'userInput');
    const saved = localStorage.getItem('di_userName') || '';
    const current = input && input.value ? input.value.trim() : '';
    return current || saved || 'Convidado';
  }

  function root369(name) {
    const clean = (name || '').trim();
    if (!clean) return '--';
    let n = clean.split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
    while (n > 9) n = String(n).split('').reduce((a, b) => a + Number(b), 0);
    return n;
  }

  function padTo(text, size) {
    text = String(text);
    if (text.length >= size) return text.slice(0, size);
    return text + ' '.repeat(size - text.length);
  }

  function makeMiniAvatarHTML(name, size = 36) {
    const seed = (name || 'DUAL').split('').reduce((a, c) => a + c.charCodeAt(0), 0);
    const h1 = seed % 360;
    const h2 = (seed * 37) % 360;
    const id = 'g' + seed.toString(36);
    return `
      <svg width="${size}" height="${size}" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <defs>
          <linearGradient id="${id}" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="hsl(${h1},100%,55%)"/>
            <stop offset="100%" stop-color="hsl(${h2},90%,45%)"/>
          </linearGradient>
        </defs>
        <rect width="32" height="32" rx="7" fill="#071018"/>
        <circle cx="16" cy="16" r="7" fill="url(#${id})"/>
        <circle cx="16" cy="16" r="13" fill="none" stroke="rgba(255,255,255,.08)" stroke-width="1"/>
      </svg>
    `;
  }

  function createAsciiActivation(name) {
    const clean = (name || '').trim() || 'Convidado';
    const displayName = `${clean}.Dual Infodose`;
    const title = 'CÉREBRO-ORÁCULO — BASE v1';

    const width = 35;
    const top = `+${'-'.repeat(width)}+`;
    const titleLine = `| ${padTo(title, width - 2)} |`;
    const nameLine = `Ativar: ${displayName}`;

    return {
      ascii: [top, titleLine, top, nameLine].join('\n'),
      displayName,
      root: root369(clean),
      title
    };
  }

  function updateActivationBlock(name) {
    const els2 = {
      actPre: document.getElementById('actPre'),
      actName: document.getElementById('actName'),
      actTitle: document.getElementById('actTitle'),
      actMiniAvatar: document.getElementById('actMiniAvatar'),
      actBadge: document.getElementById('actBadge'),
      smallText: document.getElementById('smallText'),
      smallIdent: document.getElementById('smallIdent')
    };

    const data = createAsciiActivation(name);

    if (els2.actPre) els2.actPre.innerText = data.ascii;
    if (els2.actName) els2.actName.innerText = data.displayName;
    if (els2.actTitle) els2.actTitle.innerText = data.title;
    if (els2.actMiniAvatar) els2.actMiniAvatar.innerHTML = makeMiniAvatarHTML(name || 'DUAL', 36);

    if (els2.actBadge) {
      els2.actBadge.innerText = `v:${data.root}`;
      els2.actBadge.classList.remove('vibe-gold');
      if (data.root === 3 || data.root === 6 || data.root === 9) {
        els2.actBadge.classList.add('vibe-gold');
      }
    }

    if (els2.smallText) {
      els2.smallText.innerText = (name && name.trim())
        ? `${name.trim()} · canal ASCII ativo`
        : 'Aguardando ativação...';
    }

    if (els2.smallIdent) {
      els2.smallIdent.innerText = (name && name.trim()) ? `v:${data.root}` : '--';
    }
  }

  window.createAsciiActivation = createAsciiActivation;
  window.updateActivationBlock = updateActivationBlock;

  function bindLiveUpdate() {
    const input = byId('inputUser', 'kardinputUser', 'userInput');
    if (!input) return;

    const run = () => {
      const name = input.value.trim() || 'Convidado';
      localStorage.setItem('di_userName', name);
      updateInterface(name);
      updateActivationBlock(name);
    };

    input.addEventListener('input', run);
    input.addEventListener('blur', run);

    run();
  }

  function hookButtons() {
    const copyBtn = document.getElementById('copyActBtn');
    const dlBtn = document.getElementById('downloadActBtn');
    const actCard = document.getElementById('activationCard');

    if (copyBtn) {
      copyBtn.onclick = async () => {
        const pre = document.getElementById('actPre');
        if (!pre) return;
        try {
          await navigator.clipboard.writeText(pre.innerText);
        } catch (_) {
          const ta = document.createElement('textarea');
          ta.value = pre.innerText;
          document.body.appendChild(ta);
          ta.select();
          document.execCommand('copy');
          ta.remove();
        }
      };
    }

    if (dlBtn) {
      dlBtn.onclick = async () => {
        if (!window.html2canvas || !actCard) return;
        const canvas = await html2canvas(actCard, { backgroundColor: null, scale: 2 });
        const a = document.createElement('a');
        a.download = `activation-${Date.now()}.png`;
        a.href = canvas.toDataURL('image/png');
        a.click();
      };
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      bindLiveUpdate();
      hookButtons();
    });
  } else {
    bindLiveUpdate();
    hookButtons();
  }
})();
} catch (fusionErr) {
  console.error('[FUSION KARD] Erro no bloco principal do Fusion Card:', fusionErr);
  if (typeof showToaster === 'function') showToaster('⚠️ Fusion Card: erro ao iniciar (ver console)', 'error');
}

/* ===== global-hook.js ===== */
// 🔓 GLOBAL HOOK
//window.makeOrbAvatar = makeOrbAvatar;

// 🔹 ALIAS OPCIONAL (mini semântico)
//window.makeMiniAvatar = (name) => makeOrbAvatar(name, 24);

// 🔁 ===============================
// 🔁 UPDATE INTERFACE
// 🔁 ===============================
function updateInterface(name){
  const safe = name || 'DUAL';

  // 🔹 texto
  els.lblName.innerText = safe;
  els.input.value = safe;

  // 🔹 estado ativo
  const activeKey = STATE.keys.find(k => k.active);

  els.smallIdent.innerText = activeKey ? activeKey.name : '--';
  els.actBadge.innerText = activeKey ? `key:${activeKey.name}` : 'v:--';

  // 🔥 ORBS SINCRONIZADOS
  const orbBig  = makeOrbAvatar(safe, 64);
  const orbMid  = makeOrbAvatar(safe, 36);
  const orbMini = makeOrbAvatar(safe, 24);

  els.avatarTgt.innerHTML = orbBig;
  els.smallMiniAvatar.innerHTML = orbMini;
  els.actMiniAvatar.innerHTML = orbMid;

  // 🔹 nome ativo
  els.actName.innerText = safe;
}

/* ===== lucide-removido-portanto-nao-chamamos-createicons.js ===== */
window.addEventListener('DOMContentLoaded', () => {
      // Lucide removido, portanto não chamamos createIcons.
    });
try {
(() => {
  if (window.__DI_OVERRIDE_READY__) return;
  window.__DI_OVERRIDE_READY__ = true;

  const NAME_KEYS = ['di_userName', 'userName'];

  const SEL = {
    inputA: '#inputUser',
    inputB: '#infodoseNameInput',
    lblName: '#lblName',
    actName: '#actName',
    smallText: '#smallText',
    hudStatus: '#hudStatus',
    smallIdent: '#smallIdent',
    actBadge: '#actBadge',
    mainOrb: '#main-orb',
    avatarTarget: '#avatarTarget',
    smallMiniAvatar: '#smallMiniAvatar',
    actMiniAvatar: '#actMiniAvatar'
  };

  const $ = (s) => document.querySelector(s);

  function safeName(v) {
    return (v || '').trim() || 'DUAL';
  }

  function seed(name) {
    return [...name].reduce((a, c) => a + c.charCodeAt(0), 0);
  }

  function compute(name) {
    const s = seed(name);
    return {
      name,
      seed: s,
      h1: s % 360,
      h2: (s * 37) % 360
    };
  }

  function applyRoot(name) {
    const d = compute(name);
    const root = document.documentElement;

    root.style.setProperty('--kob-voice-primary', `hsl(${d.h1} 100% 55%)`);
    root.style.setProperty('--kob-voice-secondary', `hsl(${d.h2} 90% 45%)`);
    root.dataset.diName = d.name;
    root.dataset.arch = d.name;
  }

  function renderOrb(selector, name, size) {
    const el = $(selector);
    if (!el) return;

    if (typeof window.makeOrbAvatar === 'function') {
      el.innerHTML = window.makeOrbAvatar(name, size);
    }
  }

  function setText(selector, value) {
    const el = $(selector);
    if (el) el.textContent = value;
  }

  function sync(name) {
    const safe = safeName(name);

    localStorage.setItem('di_userName', safe);
    localStorage.setItem('userName', safe);

    applyRoot(safe);

    setText(SEL.lblName, safe);
    setText(SEL.actName, safe);
    setText(SEL.smallText, safe);
    setText(SEL.hudStatus, safe);

    const activeKey = (window.STATE || STATE)?.keys?.find?.(k => k.active);
    const keyName = activeKey ? activeKey.name : '--';

    setText(SEL.smallIdent, keyName);
    setText(SEL.actBadge, activeKey ? `key:${keyName}` : 'v:--');

    renderOrb(SEL.mainOrb, safe, 48);
    renderOrb(SEL.avatarTarget, safe, 64);
    renderOrb(SEL.smallMiniAvatar, safe, 24);
    renderOrb(SEL.actMiniAvatar, safe, 36);
  }

  function bind() {
    const inputs = [$(SEL.inputA), $(SEL.inputB)].filter(Boolean);
    const initial = safeName(
      $(SEL.inputA)?.value ||
      $(SEL.inputB)?.value ||
      localStorage.getItem('di_userName') ||
      localStorage.getItem('userName')
    );

    inputs.forEach((inp) => {
      if (!inp.value) inp.value = initial;
      inp.addEventListener('input', () => sync(inp.value));
      inp.addEventListener('change', () => sync(inp.value));
    });

    sync(initial);

    window.addEventListener('storage', (e) => {
      if (NAME_KEYS.includes(e.key)) sync(e.newValue);
    });

    document.addEventListener('di:name:update', (e) => {
      sync(e.detail?.name);
    });
  }

  window.di_overrideSync = sync;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bind);
  } else {
    bind();
  }
})();
} catch (fusionSyncErr) {
  console.error('[FUSION KARD] Erro no sync final de identidade:', fusionSyncErr);
}

/* ===== www-infodose-com-br-js-main-js.js ===== */
console.log("[RL] Infodose conectado");
console.log("[RL] Timestamp:", 17787158713512);
console.log("[RL] ID da sessão:", "348fab2c-a5ef-4d12-8e5b-3fde8577db6a");
console.log("[RL] Aplicação:", "generated.app");
import "https://www.infodose.com.br/js/main.js";

/* ===== aplicacao-visual-das-variaveis-no-css-do-root-para-o-orb.js ===== */
(function(){
  const fallbackArchetypes = [
    {
      id: 'kobllux',
      name: 'KOBLLUX',
      tone: 'Núcleo do sistema, oracular',
      modulation: 'Grave-médio, presença de comando, ritmo estável.',
      voice: 'Luciana',
      lang: 'pt-BR',
      rate: 0.98,
      pitch: 0.48,
      color: '#22D3EE',
      theme: {
        primary: '#22D3EE',
        secondary: '#7dd3fc',
        bgSoft: 'radial-gradient(circle at 30% 20%, rgba(34,211,238,.08), transparent)',
        glow: '0 0 18px rgba(34,211,238,.55)'
      }
    }
  ];
  const ARCHETYPES = Array.isArray(window.ARCHETYPES) && window.ARCHETYPES.length ? window.ARCHETYPES : fallbackArchetypes;
  window.ARCHETYPES = ARCHETYPES;
  window.KOBLLUX_VOICES = ARCHETYPES.reduce((acc, a) => {
    acc[String(a.name || a.id || '').toLowerCase()] = a;
    acc[String(a.id || '').toLowerCase()] = a;
    return acc;
  }, window.KOBLLUX_VOICES || {});
  const els = {
    voiceSelect: document.getElementById('voiceSelect'),
    rateRange: document.getElementById('rateRange'),
    rateOut: document.getElementById('rateOut'),
    pitchRange: document.getElementById('pitchRange'),
    pitchOut: document.getElementById('pitchOut'),
    voiceCount: document.getElementById('voiceCount'),
    archSelect: document.getElementById('archSelect'),
    archStatus: document.getElementById('archStatus'),
    archUserBadge: document.getElementById('archUserBadge'),
    saveArchBtn: document.getElementById('saveArchBtn'),
    exportArchBtn: document.getElementById('exportArchBtn')
  };
  const ARCH_KEY = 'di_nebula_arch_v1';
  const safeUserName = (name) => {
    const v = String(name || localStorage.getItem('di_userName') || window.di_userName || 'Convidado').trim();
    return v || 'Convidado';
  };
  const normalize = (v) => String(v || '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '_')
    .replace(/[^a-z0-9_\-]/g, '');
  const storageKeyForUser = (userName) => `${ARCH_KEY}:${normalize(userName) || 'convidado'}`;
  const readSavedArch = (userName) => {
    try {
      const raw = localStorage.getItem(storageKeyForUser(userName));
      return raw ? JSON.parse(raw) : null;
    } catch (err) {
      console.warn('[ARCH] leitura falhou', err);
      return null;
    }
  };
  const writeSavedArch = (userName, payload) => {
    localStorage.setItem(storageKeyForUser(userName), JSON.stringify(payload));
    localStorage.setItem('di_nebula_arch_last', JSON.stringify(payload));
    window.dispatchEvent(new CustomEvent('KOBLLUX_ARCH_SAVED', { detail: payload }));
  };
  const resolveArch = (userName) => {
    const saved = readSavedArch(userName);
    if (saved?.arch?.id) {
      const match = ARCHETYPES.find(a => normalize(a.id) === normalize(saved.arch.id) || normalize(a.name) === normalize(saved.arch.id));
      if (match) return { ...match, ...saved.arch };
    }
    const direct = ARCHETYPES.find(a => normalize(a.id) === normalize(userName) || normalize(a.name) === normalize(userName));
    if (direct) return direct;
    return ARCHETYPES[0] || {
      id: normalize(userName) || 'custom',
      name: String(userName || 'Custom').toUpperCase(),
      voice: '',
      lang: '',
      rate: 1.01,
      pitch: 0.871,
    };
  };
  const getPlaybackState = () => ({
    voice: els.voiceSelect?.value || '',
    rate: +(els.rateRange?.value || 1),
    pitch: +(els.pitchRange?.value || 1)
  });
  const applyArchToPlayback = (arch, { persist = false } = {}) => {
    if (!arch) return;
    if (els.archSelect && arch.id) els.archSelect.value = arch.id;
    if (els.archUserBadge) els.archUserBadge.textContent = `user: ${safeUserName()}`;
    if (els.archStatus) {
      els.archStatus.textContent = `${arch.name || arch.id} · id: ${arch.id} · voice: ${arch.voice || '—'}`;
    }
    const voiceName = arch.voice || '';
    if (voiceName && els.voiceSelect) {
      const opt = [...els.voiceSelect.options].find(o => String(o.value).toLowerCase() === String(voiceName).toLowerCase());
      if (opt) els.voiceSelect.value = opt.value;
    }
    if (typeof arch.rate === 'number' && els.rateRange) {
      els.rateRange.value = String(arch.rate);
      if (els.rateOut) els.rateOut.textContent = `${Number(arch.rate).toFixed(1)}×`;
    }
    if (typeof arch.pitch === 'number' && els.pitchRange) {
      els.pitchRange.value = String(arch.pitch);
      if (els.pitchOut) els.pitchOut.textContent = Number(arch.pitch).toFixed(2);
    }
    // APLICAÇÃO VISUAL DAS VARIÁVEIS NO CSS DO ROOT PARA O ORB
    if (arch.theme) {
      document.documentElement.style.setProperty('--kob-voice-primary', arch.theme.primary || '#22D3EE');
      document.documentElement.style.setProperty('--kob-voice-secondary', arch.theme.secondary || '#7dd3fc');
      document.documentElement.style.setProperty('--kob-voice-glow', arch.theme.glow || '0 0 18px rgba(34,211,238,.55)');
      document.documentElement.style.setProperty('--kob-voice-bg-soft', arch.theme.bgSoft || 'transparent');
    }
    if (persist) {
      saveCurrentArch();
    }
  };
  const populateArchOptions = () => {
    if (!els.archSelect || els.archSelect.options.length) return;
    ARCHETYPES.forEach(a => {
      const opt = document.createElement('option');
      opt.value = String(a.id || a.name || '');
      opt.textContent = a.name || a.id || '—';
      els.archSelect.appendChild(opt);
    });
  };
  const refreshArchStatus = () => {
    const userName = safeUserName();
    const currentArch = resolveArch(userName);
    if (els.archUserBadge) els.archUserBadge.textContent = `user: ${userName}`;
    if (els.archSelect && ARCHETYPES.length) {
      populateArchOptions();
      els.archSelect.value = currentArch.id;
    }
    if (els.archStatus) {
      const saved = readSavedArch(userName);
      els.archStatus.textContent = saved
        ? `Salvo em ${userName} · ${saved.arch?.name || saved.arch?.id || '—'} (${saved.arch?.id || '—'})`
        : `Ativo para ${userName} · ${currentArch.name || currentArch.id}`;
    }
    return currentArch;
  };
  const saveCurrentArch = () => {
    const userName = safeUserName();
    const archId = els.archSelect?.value || resolveArch(userName).id;
    const arch = ARCHETYPES.find(a => String(a.id) === String(archId)) || resolveArch(userName);
    const playback = getPlaybackState();
    const payload = {
      userName,
      archId: arch.id,
      savedAt: new Date().toISOString(),
      arch: {
        ...arch,
        playback,
        userName
      }
    };
    writeSavedArch(userName, payload);
    if (els.archStatus) {
      els.archStatus.textContent = `Salvo em ${userName} · ${arch.name || arch.id} (${arch.id})`;
    }
    return payload;
  };
  const exportCurrentArch = () => {
    const userName = safeUserName();
    const saved = readSavedArch(userName) || saveCurrentArch();
    const payload = saved?.arch ? saved : saveCurrentArch();
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${normalize(userName)}_${normalize(payload.arch?.id || 'arch')}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };
  const mountArchUI = () => {
    const current = refreshArchStatus();
    if (!els.archSelect) return;
    populateArchOptions();
    if (current?.id) els.archSelect.value = current.id;
    applyArchToPlayback(current, { persist: false });
    els.archSelect.addEventListener('change', () => {
      const arch = ARCHETYPES.find(a => String(a.id) === String(els.archSelect.value));
      if (arch) {
        applyArchToPlayback(arch, { persist: false });
        saveCurrentArch();
      }
    });
    els.saveArchBtn?.addEventListener('click', () => {
      const saved = saveCurrentArch();
      if (saved) {
        els.archStatus && (els.archStatus.textContent = `Salvo em ${saved.userName} · ${saved.arch?.name || saved.archId} (${saved.archId})`);
      }
    });
    els.exportArchBtn?.addEventListener('click', exportCurrentArch);
    ['voiceSelect', 'rateRange', 'pitchRange'].forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      el.addEventListener('change', () => {
        refreshArchStatus();
      });
      el.addEventListener('input', () => {
        refreshArchStatus();
      });
    });
    window.addEventListener('KOBLLUX_ARCH_REQUEST_REFRESH', refreshArchStatus);
  };
  const patchUpdateInterface = () => {
    const original = window.updateInterface;
    if (typeof original === 'function' && !original.__archPatched) {
      const wrapped = function(name){
        const result = original.apply(this, arguments);
        try {
          refreshArchStatus();
        } catch (err) {
          console.warn('[ARCH] refresh falhou', err);
        }
        return result;
      };
      wrapped.__archPatched = true;
      window.updateInterface = wrapped;
    }
  };
  const boot = () => {
    mountArchUI();
    patchUpdateInterface();
    refreshArchStatus();
    const userName = safeUserName();
    const saved = readSavedArch(userName);
    if (saved?.arch) {
      applyArchToPlayback(saved.arch, { persist: false });
    } else {
      const guessed = resolveArch(userName);
      applyArchToPlayback(guessed, { persist: false });
      saveCurrentArch();
    }
  };
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    boot();
  }
  window.NEBULA_ARCH = {
    getUserName: safeUserName,
    get: readSavedArch,
    save: saveCurrentArch,
    export: exportCurrentArch,
    list: () => ARCHETYPES.slice()
  };
})();

/* ===== varre-o-dom-e-injeta-css-encontrado-em-blocos-comuns.js ===== */
(()=>{'use strict';
const STYLE_ID='INLINE_CSS_RENDER_V1';
function appendCSS(css){
  if(!css || !css.trim()) return;
  let s=document.getElementById(STYLE_ID);
  if(!s){ s=document.createElement('style'); s.id=STYLE_ID; document.head.appendChild(s); }
  s.appendChild(document.createTextNode('\n'+css));
}
window.CSS_INNER = {
  // Varre o DOM e injeta CSS encontrado em blocos comuns
  applyFromDOM(){
    let css='';
    document.querySelectorAll('style[data-inline], [data-css-inline], pre[data-lang="css"], code.language-css, pre code.css').forEach(el=>{
      const t = (el.textContent||'').trim();
      if(t) css += '\n' + t;
    });
    appendCSS(css);
  },
  // Extrai <style>...</style> de uma string HTML e aplica
  applyFromHTML(html){
    if(!html) return;
    const re=/<style[^>]*>([\s\S]*?)<\/style>/gi; let m, css='';
    while((m=re.exec(html))){ css += '\n' + (m[1]||''); }
    appendCSS(css);
  }
};
document.addEventListener('DOMContentLoaded', ()=> CSS_INNER.applyFromDOM());
})();