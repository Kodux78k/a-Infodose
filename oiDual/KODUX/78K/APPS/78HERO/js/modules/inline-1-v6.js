
  (() => {
    'use strict';

    const STORAGE_KEY = 'nebula-pro-ui-state';
    const SYSTEM_PREFIXES = ['nebula-', 'di_', 'kobllux-', 'kdev-', 'lsdevos-', 'baulite-', 'hero-'];
    const RESERVED_KEYS = new Set([
      STORAGE_KEY, 'nebula-theme', 'nebula-doc-keys', 'nebula-hidden-keys', 'nebula-pinned-keys',
      'di_userName', 'di_assistantName', 'baulite-disabled'
    ]);
    const DB_NAME = 'NebulaStorage';
    const DB_VERSION = 1;
    const STORE_NAME = 'files';

    const state = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    state.heroIndex = Number.isFinite(state.heroIndex) ? state.heroIndex : 0;
    state.activeGroup = state.activeGroup || 'recentes';
    state.heroMinimized = !!state.heroMinimized;
    state.autoplay = state.autoplay !== false;

    const els = {
      topStatus: document.getElementById('topStatus'),
      msDocs: document.getElementById('msDocs'),
      msCache: document.getElementById('msCache'),
      msKeys: document.getElementById('msKeys'),
      heroSection: document.getElementById('hero-section'),
      heroTitleLabel: document.getElementById('heroTitleLabel'),
      heroCarousel: document.getElementById('heroCarousel'),
      heroDots: document.getElementById('heroDots'),
      heroGroups: document.getElementById('heroGroups'),
      recentCarousel: document.getElementById('recentCarousel'),
      recentDots: document.getElementById('recentDots'),
      searchBox: document.getElementById('searchBox'),
      searchInput: document.getElementById('searchInput'),
      semanticSearchInput: document.getElementById('semanticSearchInput'),
      reader: document.getElementById('reader'),
      readerTitle: document.getElementById('readerTitle'),
      readerBody: document.getElementById('readerBody'),
      fileInput: document.getElementById('fileInput'),
      bauModal: document.getElementById('bauModal'),
      bauFab: document.getElementById('bauFab'),
      bauClose: document.getElementById('bauClose'),
      bauRefresh: document.getElementById('bauRefresh'),
      bauImport: document.getElementById('bauImport'),
      dashboardStats: document.getElementById('dashboardStats'),
      groupStats: document.getElementById('groupStats'),
      libraryGrid: document.getElementById('libraryGrid'),
      draftsGrid: document.getElementById('draftsGrid'),
      vaultGrid: document.getElementById('vaultGrid'),
      rawList: document.getElementById('rawList'),
      rawMeta: document.getElementById('rawMeta'),
      searchResultsContainer: document.getElementById('searchResultsContainer'),
      presetsGrid: document.getElementById('presetsGrid'),
      orbStats: document.getElementById('orbStats'),
      orbCards: document.getElementById('orbCards'),
      orbFilters: document.getElementById('orbFilters'),
      themeToggle: document.getElementById('themeToggle'),
      toggleAutoplay: document.getElementById('toggleAutoplay'),
      toggleHero: document.getElementById('toggleHero'),
      addFile: document.getElementById('addFile'),
      searchFile: document.getElementById('searchFile'),
      openUrl: document.getElementById('openUrl'),
      openBauFromFeature: document.getElementById('openBauFromFeature'),
      refreshNow: document.getElementById('refreshNow'),
      focusLibrary: document.getElementById('focusLibrary'),
      navLibrary: document.getElementById('navLibrary'),
      navCortex: document.getElementById('navCortex'),
      navSettings: document.getElementById('navSettings'),
      heroCardTemplate: document.getElementById('heroCardTemplate'),
    };

    let db = null;
    let autoplayTimer = null;
    let currentDocs = [];
    let orbFilter = 'all';
    let activeHeroGroup = state.activeGroup;

    const PRESETS = [
      { key: 'hero.autoplay', label: 'Autoplay', desc: 'Hero em rotação automática', enabled: state.autoplay !== false },
      { key: 'hero.minimized', label: 'Hero Compacto', desc: 'Encolhe o Hero principal', enabled: !!state.heroMinimized },
      { key: 'reader.inline', label: 'Reader Inline', desc: 'Abre previews sem sair da página', enabled: true },
      { key: 'cache.live', label: 'Cache Vivo', desc: 'Recarrega ao salvar/importar', enabled: true },
      { key: 'orb.live', label: 'Orb Vivo', desc: 'Sempre mostra estatísticas ativas', enabled: true },
      { key: 'baulite.raw', label: 'Baú Bruto', desc: 'Permite editar localStorage', enabled: true },
    ];

    const TYPE_LABELS = {
      html: 'HTML',
      markdown: 'MARKDOWN',
      md: 'MARKDOWN',
      pdf: 'PDF',
      txt: 'TXT',
      text: 'TXT',
      json: 'JSON',
      url: 'URL',
      cache: 'CACHE',
      doc: 'DOC'
    };

    function saveState() {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        heroIndex: state.heroIndex || 0,
        activeGroup: activeHeroGroup,
        heroMinimized: !!state.heroMinimized,
        autoplay: !!state.autoplay,
      }));
    }

    function setTheme(theme) {
      document.body.setAttribute('data-theme', theme);
      localStorage.setItem('nebula-theme', theme);
    }

    function escapeHTML(str) {
      return String(str ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
    }

    function prettyBytes(n) {
      if (!Number.isFinite(n) || n <= 0) return '0 B';
      const units = ['B', 'KB', 'MB', 'GB'];
      let i = 0;
      let size = n;
      while (size >= 1024 && i < units.length - 1) { size /= 1024; i++; }
      return size.toFixed(size >= 10 ? 0 : 1) + ' ' + units[i];
    }

    function safeJSONParse(v) {
      try { return JSON.parse(v); } catch { return null; }
    }

    function inferType(v) {
      if (v == null || v === '') return 'empty';
      const parsed = safeJSONParse(v);
      if (parsed !== null) {
        if (Array.isArray(parsed)) return 'json[array]';
        if (parsed && typeof parsed === 'object') return 'json[object]';
        return 'json';
      }
      const s = String(v).trim();
      if (/^https?:\/\//i.test(s)) return 'url';
      if (/<html|<\/[a-z]+>|<!doctype html>/i.test(s)) return 'html';
      if (/^#{1,6}\s/m.test(s) || /\[[^\]]+\]\([^)]+\)/.test(s)) return 'markdown';
      if (s.length > 120 && /\n/.test(s)) return 'text';
      if (/^[\{\[][\s\S]*[\}\]]$/.test(s)) return 'json';
      return 'text';
    }

    function detectType(name = '', mime = '', content = '') {
      const ext = String(name).split('.').pop().toLowerCase();
      const c = String(content || '');
      if (mime.includes('pdf') || ext === 'pdf') return 'pdf';
      if (mime.includes('html') || ['html', 'htm'].includes(ext) || /<!doctype html>|<html/i.test(c)) return 'html';
      if (['md', 'markdown'].includes(ext) || /^#{1,6}\s/m.test(c) || /\[[^\]]+\]\([^)]+\)/.test(c)) return 'markdown';
      if (['json'].includes(ext) || (/^[\{\[][\s\S]*[\}\]]$/.test(c.trim()) && c.trim().length > 1)) return 'json';
      if (['txt', 'text'].includes(ext)) return 'txt';
      return 'txt';
    }

    function previewText(content, limit = 120) {
      const flat = String(content || '').replace(/\s+/g, ' ').trim();
      if (!flat) return 'Sem prévia disponível.';
      return flat.length > limit ? flat.slice(0, limit) + '…' : flat;
    }

    function previewFromHTML(content) {
      const txt = String(content || '')
        .replace(/<script[\s\S]*?<\/script>/gi, ' ')
        .replace(/<style[\s\S]*?<\/style>/gi, ' ')
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
      return txt ? txt.slice(0, 240) : 'HTML sem texto legível.';
    }

    function normalizeName(name) {
      return String(name || 'Documento').replace(/^.*[\\/]/, '');
    }

    function lsEntries() {
      const out = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (RESERVED_KEYS.has(key)) continue;
        out.push({ key, val: localStorage.getItem(key) || '' });
      }
      return out;
    }

    function isSystemKey(key) {
      return SYSTEM_PREFIXES.some(prefix => String(key).startsWith(prefix)) || String(key).includes(':');
    }

    function getGroupsFromStorage() {
      const groups = {};
      for (const { key } of lsEntries()) {
        let prefix = 'outros';
        if (/^doc[:._-]/i.test(key) || /document/i.test(key)) prefix = 'docs';
        else if (/^draft[:._-]/i.test(key) || /rascunho/i.test(key)) prefix = 'drafts';
        else if (/^html[:._-]/i.test(key) || key.endsWith('.html')) prefix = 'html';
        else if (/^md[:._-]/i.test(key) || key.endsWith('.md')) prefix = 'markdown';
        else if (/^txt[:._-]/i.test(key) || key.endsWith('.txt')) prefix = 'txt';
        else if (/pdf/i.test(key)) prefix = 'pdf';
        else if (/cache|store|state|hero|orb|vault/i.test(key)) prefix = 'cache';
        groups[prefix] = groups[prefix] || [];
        groups[prefix].push(key);
      }
      return groups;
    }

    const MemoryCore = {
      cache: new Map(),
      load() {
        this.cache.clear();
        const entries = lsEntries();
        for (const { key, val } of entries) {
          this.cache.set(key, val);
        }
      },
      set(key, value) {
        localStorage.setItem(key, value);
        this.load();
      },
      delete(key) {
        localStorage.removeItem(key);
        this.load();
      },
      reload() { this.load(); },
      search(query) {
        const q = String(query || '').trim().toLowerCase();
        if (!q) return [];
        const scored = [];
        for (const [key, value] of this.cache.entries()) {
          const text = String(value || '');
          const hay = `${key}\n${text}`.toLowerCase();
          const hits = (hay.match(new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length;
          if (hits > 0) {
            scored.push({ key, value, score: hits, type: inferType(value) });
          } else {
            const keyScore = key.toLowerCase().includes(q) ? 1 : 0;
            if (keyScore) scored.push({ key, value, score: keyScore, type: inferType(value) });
          }
        }
        return scored.sort((a, b) => b.score - a.score || a.key.localeCompare(b.key));
      }
    };
    window.MemoryCore = MemoryCore;
    MemoryCore.load();

    function openReader({ title, html, text, url, kind }) {
      els.readerTitle.textContent = title || 'Documento';
      els.readerBody.innerHTML = '';
      if (url && kind === 'pdf') {
        const iframe = document.createElement('iframe');
        iframe.src = url;
        els.readerBody.appendChild(iframe);
      } else if (url && kind === 'html') {
        const iframe = document.createElement('iframe');
        iframe.src = url;
        els.readerBody.appendChild(iframe);
      } else if (kind === 'markdown') {
        const wrap = document.createElement('div');
        wrap.className = 'reader-markdown';
        wrap.innerHTML = markdownToHTML(text || '');
        els.readerBody.appendChild(wrap);
      } else {
        const div = document.createElement('div');
        div.className = 'reader-text';
        div.textContent = text || html || 'Sem conteúdo.';
        els.readerBody.appendChild(div);
      }
      els.reader.classList.add('opened');
    }

    function closeReader() {
      els.reader.classList.remove('opened');
      els.readerBody.innerHTML = '';
    }

    function markdownToHTML(md) {
      const safe = escapeHTML(String(md || ''));
      return safe
        .replace(/^###### (.*)$/gm, '<h6>$1</h6>')
        .replace(/^##### (.*)$/gm, '<h5>$1</h5>')
        .replace(/^#### (.*)$/gm, '<h4>$1</h4>')
        .replace(/^### (.*)$/gm, '<h3>$1</h3>')
        .replace(/^## (.*)$/gm, '<h2>$1</h2>')
        .replace(/^# (.*)$/gm, '<h1>$1</h1>')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/\`(.*?)\`/g, '<code>$1</code>')
        .replace(/^\s*-\s+(.*)$/gm, '<li>$1</li>')
        .replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')
        .replace(/\n{2,}/g, '</p><p>')
        .replace(/^(?!<[hulp]|<ul>|<li>)(.+)$/gm, '<p>$1</p>');
    }

    async function initDB() {
      return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);
        request.onupgradeneeded = event => {
          db = event.target.result;
          if (!db.objectStoreNames.contains(STORE_NAME)) {
            db.createObjectStore(STORE_NAME, { keyPath: 'id' });
          }
        };
        request.onsuccess = event => { db = event.target.result; resolve(db); };
        request.onerror = event => reject(event.target.error);
      });
    }

    async function saveFileToDB(item) {
      return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        store.put(item);
        tx.oncomplete = () => resolve();
        tx.onerror = err => reject(err);
      });
    }

    async function loadFilesFromDB() {
      return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const request = store.getAll();
        request.onsuccess = event => {
          const items = event.target.result || [];
          resolve(items.map(item => {
            if (item.type === 'pdf' || item.type === 'html') {
              if (!item.url && item.fileBlob) item.url = URL.createObjectURL(item.fileBlob);
            }
            return item;
          }));
        };
        request.onerror = err => reject(err);
      });
    }

    function makeDoc(item, source = 'db') {
      const name = normalizeName(item.name || item.key || 'Documento');
      const content = String(item.content || item.text || item.value || '');
      const type = item.type || detectType(name, item.mime || '', content);
      const size = item.size || prettyBytes((content || '').length || (item.fileBlob?.size || 0));
      const updatedAt = item.updatedAt || item.createdAt || Date.now();
      const tags = Array.isArray(item.tags) ? item.tags : [];
      const favorite = !!item.favorite;
      const preview = item.preview || (
        type === 'html' ? previewFromHTML(content) :
        type === 'markdown' ? previewText(content, 170) :
        type === 'json' ? previewText(content, 170) :
        previewText(content, 170)
      );
      const url = item.url || '';
      return {
        id: String(item.id || item.key || `${source}-${name}-${updatedAt}`),
        name,
        type,
        size,
        updatedAt,
        content,
        url,
        source,
        favorite,
        tags,
        preview,
        mime: item.mime || '',
        path: item.path || '',
        rawKey: item.key || '',
        fileBlob: item.fileBlob || null
      };
    }

    async function collectDocuments() {
      const docs = [];
      const dbDocs = await loadFilesFromDB().catch(() => []);
      dbDocs.forEach(item => docs.push(makeDoc(item, 'indexeddb')));

      const storageDocs = [];
      for (const { key, val } of lsEntries()) {
        const parsed = safeJSONParse(val);
        const inferred = inferType(val);
        const keyType = /pdf/i.test(key) ? 'pdf' : /html|htm/i.test(key) ? 'html' : /md|markdown/i.test(key) ? 'markdown' : /txt/i.test(key) ? 'txt' : inferred;
        const looksLikeDoc = /doc|note|text|article|draft|html|md|markdown|txt|pdf|cache|hero|library|vault|summary|prompt/i.test(key) || inferred !== 'empty' || keyType !== 'text';
        if (!looksLikeDoc) continue;
        let content = val;
        if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
          content = Object.entries(parsed).map(([k,v]) => `${k}: ${typeof v === 'string' ? v : JSON.stringify(v)}`).join('\n');
        }
        storageDocs.push(makeDoc({
          id: `ls-${key}`,
          name: key,
          type: keyType === 'text' ? 'txt' : keyType,
          size: prettyBytes(String(val || '').length),
          updatedAt: Date.now(),
          content,
          key,
          favorite: /fav|star|pinned/i.test(key),
          tags: [isSystemKey(key) ? 'cache' : 'doc']
        }, 'localStorage'));
      }

      const merged = [...docs, ...storageDocs];
      const seen = new Set();
      return merged.filter(doc => {
        const sig = `${doc.name}::${doc.type}::${doc.content.slice(0,120)}`;
        if (seen.has(sig)) return false;
        seen.add(sig);
        return true;
      }).sort((a,b) => (b.updatedAt || 0) - (a.updatedAt || 0));
    }

    function groupDocs(docs, group) {
      const g = String(group || 'recentes');
      if (g === 'recentes') return docs.slice(0, 20);
      if (g === 'docs') return docs.filter(d => ['txt','markdown','html','json','pdf'].includes(d.type));
      if (g === 'html') return docs.filter(d => d.type === 'html');
      if (g === 'pdf') return docs.filter(d => d.type === 'pdf');
      if (g === 'markdown') return docs.filter(d => d.type === 'markdown');
      if (g === 'txt') return docs.filter(d => d.type === 'txt');
      if (g === 'cache') return docs.filter(d => d.source === 'localStorage' || d.tags.includes('cache'));
      if (g === 'favoritos') return docs.filter(d => d.favorite);
      return docs;
    }

    function renderPreview(doc) {
      if (doc.type === 'pdf' && doc.url) {
        const iframe = document.createElement('iframe');
        iframe.className = 'preview-pdf';
        iframe.src = doc.url;
        return iframe;
      }
      if (doc.type === 'html' && doc.url) {
        const iframe = document.createElement('iframe');
        iframe.className = 'preview-html';
        iframe.src = doc.url;
        return iframe;
      }
      if (doc.type === 'markdown') {
        const div = document.createElement('div');
        div.className = 'preview-markdown';
        div.innerHTML = markdownToHTML(doc.preview || doc.content || '');
        return div;
      }
      const div = document.createElement('div');
      div.className = 'preview-text';
      div.textContent = doc.preview || doc.content || 'Sem prévia disponível.';
      return div;
    }

    function renderHero(docs) {
      const filtered = groupDocs(docs, activeHeroGroup);
      els.heroCarousel.innerHTML = '';
      els.heroDots.innerHTML = '';

      if (!filtered.length) {
        els.heroCarousel.innerHTML = '<div style="padding:18px;color:var(--muted);">Nenhum documento encontrado no cache.</div>';
        return;
      }

      filtered.slice(0, 12).forEach((doc, index) => {
        const card = els.heroCardTemplate.content.firstElementChild.cloneNode(true);
        const preview = card.querySelector('.hero-preview');
        const title = card.querySelector('h4');
        const meta = card.querySelector('p');
        const badges = card.querySelector('.badge-row');

        preview.appendChild(renderPreview(doc));
        if (!(doc.type === 'pdf' || doc.type === 'html')) {
          const hint = document.createElement('div');
          hint.className = 'preview-placeholder';
          hint.innerHTML = '<span>📄</span><p style="font-size:11px;font-weight:600;">Toque para carregar preview</p>';
          preview.prepend(hint);
        }

        title.textContent = doc.name;
        meta.textContent = `${(TYPE_LABELS[doc.type] || doc.type || 'DOC').toUpperCase()} · ${doc.size || 'arquivo'} · ${doc.source === 'localStorage' ? 'cache' : 'db'}`;
        badges.innerHTML = '';
        const badgeData = [
          doc.type.toUpperCase(),
          doc.favorite ? 'FAVORITO' : null,
          doc.source === 'localStorage' ? 'CACHE' : 'DB'
        ].filter(Boolean);
        badgeData.forEach(b => {
          const s = document.createElement('span');
          s.className = 'badge';
          s.textContent = b;
          badges.appendChild(s);
        });

        card.querySelector('.hero-open').addEventListener('click', e => {
          e.stopPropagation();
          openReader({
            title: doc.name,
            html: doc.content,
            text: doc.content,
            url: doc.url,
            kind: doc.type
          });
        });

        card.querySelector('.hero-listen').addEventListener('click', e => {
          e.stopPropagation();
          const synth = window.speechSynthesis;
          if (synth.speaking) { synth.cancel(); return; }
          const text = doc.type === 'html' ? previewFromHTML(doc.content) : (doc.content || '');
          if (!text.trim()) return alert('Sem texto legível para leitura.');
          const utt = new SpeechSynthesisUtterance(text.substring(0, 3000));
          utt.lang = 'pt-BR';
          synth.speak(utt);
        });

        card.querySelector('.hero-favorite').addEventListener('click', e => {
          e.stopPropagation();
          const key = `fav:${doc.id}`;
          const next = localStorage.getItem(key) === '1' ? '0' : '1';
          localStorage.setItem(key, next);
          refreshAll();
        });

        card.querySelector('.hero-delete').addEventListener('click', e => {
          e.stopPropagation();
          if (doc.source === 'localStorage') {
            if (confirm(`Apagar ${doc.name} do cache?`)) {
              localStorage.removeItem(doc.rawKey || doc.name);
              refreshAll();
            }
          } else {
            if (confirm(`Remover ${doc.name} do IndexedDB?`)) {
              removeDbDoc(doc.id).then(refreshAll);
            }
          }
        });

        preview.addEventListener('click', () => openReader({
          title: doc.name,
          html: doc.content,
          text: doc.content,
          url: doc.url,
          kind: doc.type
        }));

        els.heroCarousel.appendChild(card);

        const dot = document.createElement('div');
        dot.className = 'hero-dot' + (index === (state.heroIndex || 0) ? ' active' : '');
        dot.addEventListener('click', () => {
          state.heroIndex = index;
          saveState();
          scrollToHeroSlide(index);
        });
        els.heroDots.appendChild(dot);
      });

      setTimeout(() => scrollToHeroSlide(state.heroIndex || 0, false), 50);
    }

    function renderRecentCarousel(docs) {
      const filtered = docs.slice(0, 12);
      els.recentCarousel.innerHTML = '';
      els.recentDots.innerHTML = '';
      if (!filtered.length) {
        els.recentCarousel.innerHTML = '<div style="padding:18px;color:var(--muted);">Nenhum item recente.</div>';
        return;
      }

      filtered.forEach((doc, index) => {
        const slide = document.createElement('article');
        slide.className = 'slide';
        slide.innerHTML = `
          <div class="file-preview">
            <div class="type-badge">${escapeHTML((TYPE_LABELS[doc.type] || doc.type || 'DOC').toUpperCase())}</div>
          </div>
          <div class="card-info">
            <div class="card-info-text">
              <h4>${escapeHTML(doc.name)}</h4>
              <p>${escapeHTML(doc.size || 'arquivo')} · ${doc.source === 'localStorage' ? 'cache' : 'db'} · ${new Date(doc.updatedAt || Date.now()).toLocaleString('pt-BR')}</p>
            </div>
            <div class="card-actions">
              <button class="btn-icon hero-listen" title="Ouvir">🔊</button>
              <button class="btn-icon danger hero-delete" title="Apagar">🗑️</button>
              <button class="open hero-open">→</button>
            </div>
          </div>
        `;
        slide.querySelector('.file-preview').appendChild(renderPreview(doc));
        slide.querySelector('.hero-open').addEventListener('click', () => openReader({ title: doc.name, html: doc.content, text: doc.content, url: doc.url, kind: doc.type }));
        slide.querySelector('.hero-listen').addEventListener('click', () => {
          const synth = window.speechSynthesis;
          if (synth.speaking) { synth.cancel(); return; }
          const text = doc.type === 'html' ? previewFromHTML(doc.content) : (doc.content || '');
          if (!text.trim()) return;
          const utt = new SpeechSynthesisUtterance(text.substring(0, 3000));
          utt.lang = 'pt-BR';
          synth.speak(utt);
        });
        slide.querySelector('.hero-delete').addEventListener('click', () => {
          if (doc.source === 'localStorage') {
            if (confirm(`Apagar ${doc.name}?`)) { localStorage.removeItem(doc.rawKey || doc.name); refreshAll(); }
          } else {
            if (confirm(`Remover ${doc.name}?`)) { removeDbDoc(doc.id).then(refreshAll); }
          }
        });
        els.recentCarousel.appendChild(slide);

        const dot = document.createElement('div');
        dot.className = 'dot' + (index === 0 ? ' active' : '');
        els.recentDots.appendChild(dot);
      });
    }

    function scrollToHeroSlide(index, smooth = true) {
      const cards = els.heroCarousel.querySelectorAll('.hero-card');
      if (cards[index]) {
        cards[index].scrollIntoView({ behavior: smooth ? 'smooth' : 'auto', inline: 'center', block: 'nearest' });
        els.heroDots.querySelectorAll('.hero-dot').forEach((d, i) => d.classList.toggle('active', i === index));
      }
    }

    function renderStats(docs) {
      const cacheEntries = lsEntries();
      const cacheBytes = cacheEntries.reduce((sum, e) => sum + String(e.val || '').length + String(e.key || '').length, 0);
      const countByType = docs.reduce((acc, doc) => {
        acc[doc.type] = (acc[doc.type] || 0) + 1;
        return acc;
      }, {});
      els.msDocs.textContent = String(docs.length);
      els.msCache.textContent = String(cacheEntries.length);
      els.msKeys.textContent = String(localStorage.length);
      els.topStatus.textContent = `${docs.length} docs · ${prettyBytes(cacheBytes)} cache`;

      els.dashboardStats.innerHTML = '';
      const stats = [
        ['Documentos', docs.length],
        ['Cache Keys', cacheEntries.length],
        ['IndexedDB', docs.filter(d => d.source === 'indexeddb').length],
        ['LocalStorage', docs.filter(d => d.source === 'localStorage').length],
        ['Favoritos', docs.filter(d => d.favorite).length],
        ['Tamanho', prettyBytes(cacheBytes)],
      ];
      stats.forEach(([label, value]) => {
        const el = document.createElement('div');
        el.className = 'stat-card';
        el.innerHTML = `<div class="value">${escapeHTML(String(value))}</div><div class="label">${escapeHTML(label)}</div>`;
        els.dashboardStats.appendChild(el);
      });

      els.groupStats.innerHTML = '';
      const groups = getGroupsFromStorage();
      Object.entries(groups).forEach(([prefix, keys]) => {
        const div = document.createElement('div');
        div.className = 'group-stat';
        div.innerHTML = `<div class="count">${keys.length}</div><div class="label">${escapeHTML(prefix)}</div>`;
        els.groupStats.appendChild(div);
      });
      if (Object.keys(groups).length === 0) {
        els.groupStats.innerHTML = '<p style="color:var(--muted);">Nenhum grupo encontrado.</p>';
      }

      return countByType;
    }

    function matchesTabFilter(doc, filter) {
      if (filter === 'all') return true;
      if (filter === 'docs') return ['txt','markdown','html','json','pdf'].includes(doc.type);
      if (filter === 'cache') return doc.source === 'localStorage';
      if (filter === 'html') return doc.type === 'html';
      if (filter === 'pdf') return doc.type === 'pdf';
      return true;
    }

    function renderCardGrid(container, docs) {
      container.innerHTML = '';
      const set = docs || [];
      if (!set.length) {
        container.innerHTML = '<p style="color:var(--muted);padding:10px 2px;">Nenhum item encontrado.</p>';
        return;
      }
      set.forEach(doc => {
        const card = document.createElement('article');
        card.className = 'card-item';
        card.innerHTML = `
          <div class="title">${escapeHTML(doc.name)}</div>
          <div class="meta">${escapeHTML((TYPE_LABELS[doc.type] || doc.type || 'DOC').toUpperCase())} · ${escapeHTML(doc.size || 'arquivo')} · ${escapeHTML(doc.source)}</div>
          <div class="preview">${escapeHTML(doc.preview || previewText(doc.content, 120))}</div>
          <div class="actions">
            <button data-action="view">👁️ Ver</button>
            <button data-action="copy">📋 Copiar</button>
            <button data-action="fav">${doc.favorite ? '★' : '☆'} Favorito</button>
          </div>
        `;
        card.querySelector('[data-action="view"]').addEventListener('click', () => openReader({ title: doc.name, html: doc.content, text: doc.content, url: doc.url, kind: doc.type }));
        card.querySelector('[data-action="copy"]').addEventListener('click', async () => {
          try {
            await navigator.clipboard.writeText(doc.content || '');
            alert('Copiado!');
          } catch {
            const ta = document.createElement('textarea');
            ta.value = doc.content || '';
            document.body.appendChild(ta);
            ta.select();
            document.execCommand('copy');
            ta.remove();
            alert('Copiado!');
          }
        });
        card.querySelector('[data-action="fav"]').addEventListener('click', () => {
          localStorage.setItem(`fav:${doc.id}`, localStorage.getItem(`fav:${doc.id}`) === '1' ? '0' : '1');
          refreshAll();
        });
        container.appendChild(card);
      });
    }

    function renderRaw() {
      const entries = lsEntries();
      els.rawMeta.textContent = `${entries.length} chave(s) · ${prettyBytes(entries.reduce((sum, e) => sum + String(e.val || '').length, 0))}`;
      els.rawList.innerHTML = '';
      if (!entries.length) {
        els.rawList.innerHTML = '<p style="color:var(--muted);">Baú vazio.</p>';
        return;
      }

      entries.forEach(({ key, val }) => {
        const item = document.createElement('div');
        item.className = 'raw-item';
        const type = inferType(val);
        const disabled = localStorage.getItem('baulite-disabled')?.includes(key) ? true : false;
        item.innerHTML = `
          <div class="raw-head">
            <div>
              <div class="raw-key">${escapeHTML(key)}${disabled ? ' <span class="raw-type">(desativado)</span>' : ''}</div>
              <div class="raw-type">${escapeHTML(type)} · ${prettyBytes(String(val || '').length)}</div>
            </div>
            <div class="raw-ctr">
              <div class="raw-switch ${disabled ? 'on' : ''}" title="Ativar/Desativar"></div>
              <button class="raw-btn" data-action="view">Ver</button>
              <button class="raw-btn" data-action="edit">Editar</button>
              <button class="raw-btn" data-action="copy">Copiar</button>
              <button class="raw-btn" data-action="del">Apagar</button>
            </div>
          </div>
          <div class="raw-val">${escapeHTML(String(val || ''))}</div>
        `;
        const sw = item.querySelector('.raw-switch');
        sw.addEventListener('click', () => {
          const list = new Set((localStorage.getItem('baulite-disabled') ? JSON.parse(localStorage.getItem('baulite-disabled')) : []));
          list.has(key) ? list.delete(key) : list.add(key);
          localStorage.setItem('baulite-disabled', JSON.stringify([...list]));
          refreshAll();
        });
        item.querySelector('[data-action="view"]').addEventListener('click', () => alert(`🔍 ${key}\n\n${val || ''}`));
        item.querySelector('[data-action="edit"]').addEventListener('click', () => {
          const next = prompt(`Editar valor de\n${key}`, val ?? '');
          if (next == null) return;
          MemoryCore.set(key, String(next));
          refreshAll();
        });
        item.querySelector('[data-action="copy"]').addEventListener('click', async () => {
          try { await navigator.clipboard.writeText(val || ''); alert('Copiado!'); }
          catch { alert('Não foi possível copiar.'); }
        });
        item.querySelector('[data-action="del"]').addEventListener('click', () => {
          if (confirm(`Apagar ${key}?`)) {
            MemoryCore.delete(key);
            refreshAll();
          }
        });
        els.rawList.appendChild(item);
      });
    }

    function performSearch(query) {
      const q = String(query || '').trim();
      if (!q) {
        els.searchResultsContainer.innerHTML = '';
        return;
      }

      const docs = currentDocs.filter(doc => `${doc.name}\n${doc.content}\n${doc.type}\n${doc.source}`.toLowerCase().includes(q.toLowerCase()));
      const cacheResults = MemoryCore.search(q);

      const seen = new Set();
      const merged = [];

      docs.forEach(doc => {
        const key = `doc:${doc.id}`;
        if (seen.has(key)) return;
        seen.add(key);
        merged.push({
          key: doc.name,
          score: 10,
          value: doc.preview || previewText(doc.content, 120),
          open: () => openReader({ title: doc.name, html: doc.content, text: doc.content, url: doc.url, kind: doc.type })
        });
      });

      cacheResults.forEach(r => {
        const key = `cache:${r.key}`;
        if (seen.has(key)) return;
        seen.add(key);
        merged.push({
          key: r.key,
          score: r.score,
          value: previewText(r.value, 140),
          open: () => openReader({ title: r.key, text: r.value, kind: inferType(r.value) })
        });
      });

      if (!merged.length) {
        els.searchResultsContainer.innerHTML = `<div style="color:var(--muted);text-align:center;padding:20px;">Nenhum resultado para "${escapeHTML(q)}"</div>`;
        return;
      }

      els.searchResultsContainer.innerHTML = '';
      merged.sort((a,b) => b.score - a.score).slice(0, 60).forEach(item => {
        const row = document.createElement('div');
        row.className = 'search-result-item';
        row.innerHTML = `
          <div class="key">${escapeHTML(item.key)}</div>
          <div class="score">${item.score} match(es)</div>
          <div class="value-preview">${escapeHTML(item.value)}</div>
        `;
        row.addEventListener('click', item.open);
        els.searchResultsContainer.appendChild(row);
      });
    }

    function renderPresets() {
      els.presetsGrid.innerHTML = '';
      PRESETS.forEach(preset => {
        const item = document.createElement('div');
        item.className = 'preset-item';
        item.innerHTML = `
          <div class="info">
            <div class="label">${escapeHTML(preset.label)}</div>
            <div class="key">${escapeHTML(preset.desc)}</div>
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
            els.heroSection.classList.toggle('minimized', state.heroMinimized);
          }
          saveState();
        });
        els.presetsGrid.appendChild(item);
      });
    }

    function renderOrb(docs) {
      const filtered = orbFilter === 'all' ? docs : docs.filter(doc => matchesTabFilter(doc, orbFilter));
      const sourceCounts = {
        indexeddb: docs.filter(d => d.source === 'indexeddb').length,
        localStorage: docs.filter(d => d.source === 'localStorage').length,
      };
      const typeCounts = docs.reduce((acc, doc) => {
        acc[doc.type] = (acc[doc.type] || 0) + 1;
        return acc;
      }, {});
      const cacheEntries = lsEntries();
      const cacheBytes = cacheEntries.reduce((sum, e) => sum + String(e.val || '').length, 0);

      els.orbStats.innerHTML = '';
      const stats = [
        ['Docs', docs.length],
        ['Cache', cacheEntries.length],
        ['IndexedDB', sourceCounts.indexeddb],
        ['LocalStorage', sourceCounts.localStorage],
        ['HTML', typeCounts.html || 0],
        ['PDF', typeCounts.pdf || 0],
        ['MD', typeCounts.markdown || 0],
        ['TXT', typeCounts.txt || 0],
      ];
      stats.forEach(([label, value]) => {
        const el = document.createElement('div');
        el.className = 'orb-stat-card';
        el.innerHTML = `<div class="number">${escapeHTML(String(value))}</div><div class="label">${escapeHTML(label)}</div>`;
        els.orbStats.appendChild(el);
      });

      els.orbCards.innerHTML = '';
      const visible = filtered.slice(0, 20);
      visible.forEach(doc => {
        const card = document.createElement('div');
        card.className = 'orb-func-card';
        const miniBars = Array.from({ length: 8 }, (_, i) => {
          const h = [10, 16, 22, 14, 26, 18, 12, 20][i];
          const cls = h > 20 ? 'warn' : (h < 13 ? 'danger' : '');
          return `<div class="bar ${cls}" style="height:${h}px"></div>`;
        }).join('');
        card.innerHTML = `
          <div class="name">${escapeHTML(doc.name)} <span class="type-badge2">${escapeHTML((TYPE_LABELS[doc.type] || doc.type || 'DOC').toUpperCase())}</span></div>
          <div class="meta">
            <span>${escapeHTML(doc.source)}</span>
            <span>${escapeHTML(doc.size || '')}</span>
            <span>${new Date(doc.updatedAt || Date.now()).toLocaleString('pt-BR')}</span>
          </div>
          <div class="desc">${escapeHTML(doc.preview || previewText(doc.content, 130))}</div>
          <div class="orb-mini-chart">${miniBars}</div>
          <div class="actions">
            <button data-action="open">Abrir</button>
            <button data-action="fav">${doc.favorite ? 'Desfav' : 'Fav'}</button>
          </div>
        `;
        card.querySelector('[data-action="open"]').addEventListener('click', () => openReader({ title: doc.name, html: doc.content, text: doc.content, url: doc.url, kind: doc.type }));
        card.querySelector('[data-action="fav"]').addEventListener('click', () => {
          localStorage.setItem(`fav:${doc.id}`, localStorage.getItem(`fav:${doc.id}`) === '1' ? '0' : '1');
          refreshAll();
        });
        els.orbCards.appendChild(card);
      });
    }

    function renderLibraryViews(docs) {
      const libraryDocs = docs.filter(doc => matchesTabFilter(doc, 'docs'));
      const draftsDocs = docs.filter(doc => /draft|rascunho|wip/i.test(`${doc.name} ${doc.content}`));
      const vaultDocs = docs.filter(doc => ['html','json','markdown'].includes(doc.type) || /template|asset|style|script|css/i.test(doc.name));
      renderCardGrid(els.libraryGrid, libraryDocs);
      renderCardGrid(els.draftsGrid, draftsDocs);
      renderCardGrid(els.vaultGrid, vaultDocs);
    }

    function renderAll() {
      MemoryCore.reload();
      collectDocuments().then(docs => {
        currentDocs = docs.map(doc => ({
          ...doc,
          favorite: localStorage.getItem(`fav:${doc.id}`) === '1' || doc.favorite
        }));

        renderStats(currentDocs);
        renderHero(currentDocs);
        renderRecentCarousel(currentDocs);
        renderLibraryViews(currentDocs);
        renderRaw();
        renderPresets();
        renderOrb(currentDocs);
        if (els.semanticSearchInput.value.trim()) performSearch(els.semanticSearchInput.value);
        els.heroSection.classList.toggle('minimized', !!state.heroMinimized);
        els.toggleAutoplay.textContent = state.autoplay ? '⏸' : '▶';
        els.toggleHero.textContent = state.heroMinimized ? '▲' : '▼';
        document.querySelectorAll('.pill').forEach(btn => btn.classList.toggle('active', btn.dataset.group === activeHeroGroup));
      });
    }

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
      els.fileInput.value = '';
      els.fileInput.click();
    }

    function openURLPrompt() {
      const url = prompt('Cole uma URL ou caminho para abrir:');
      if (!url) return;
      const type = /pdf/i.test(url) ? 'pdf' : /html?|htm/i.test(url) ? 'html' : 'url';
      openReader({ title: url, url, kind: type, text: url });
    }

    function setupAutoplay() {
      if (autoplayTimer) clearInterval(autoplayTimer);
      if (!state.autoplay) return;
      autoplayTimer = setInterval(() => {
        const cards = els.heroCarousel.querySelectorAll('.hero-card');
        if (!cards.length) return;
        state.heroIndex = (state.heroIndex + 1) % cards.length;
        saveState();
        scrollToHeroSlide(state.heroIndex);
      }, 6000);
    }

    function bindUI() {
      const theme = localStorage.getItem('nebula-theme') || 'dark';
      setTheme(theme);

      els.themeToggle.addEventListener('click', () => {
        const next = document.body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        setTheme(next);
      });

      els.toggleAutoplay.addEventListener('click', () => {
        state.autoplay = !state.autoplay;
        els.toggleAutoplay.textContent = state.autoplay ? '⏸' : '▶';
        saveState();
        setupAutoplay();
      });

      els.toggleHero.addEventListener('click', () => {
        state.heroMinimized = !state.heroMinimized;
        els.heroSection.classList.toggle('minimized', state.heroMinimized);
        els.toggleHero.textContent = state.heroMinimized ? '▲' : '▼';
        saveState();
      });

      els.addFile.addEventListener('click', openFilePicker);
      els.searchFile.addEventListener('click', () => {
        els.searchBox.classList.add('visible');
        els.searchInput.focus();
      });
      els.openUrl.addEventListener('click', openURLPrompt);
      els.openBauFromFeature.addEventListener('click', () => openBau());
      els.refreshNow.addEventListener('click', refreshAll);
      els.focusLibrary.addEventListener('click', () => {
        document.getElementById('recentCarousel').scrollIntoView({ behavior:'smooth', block:'center' });
      });
      els.navLibrary.addEventListener('click', () => document.querySelector('.section:nth-of-type(2)').scrollIntoView({ behavior:'smooth', block:'start' }));
      els.navCortex.addEventListener('click', () => openBau('orb'));
      els.navSettings.addEventListener('click', () => openBau('tools'));

      els.bauFab.addEventListener('click', () => openBau());
      els.bauClose.addEventListener('click', closeBau);
      els.bauRefresh.addEventListener('click', refreshAll);
      els.bauImport.addEventListener('click', importJSON);
      document.getElementById('clearCache').addEventListener('click', () => {
        if (!confirm('Limpar chaves do sistema do cache?')) return;
        lsEntries().forEach(({ key }) => {
          if (!RESERVED_KEYS.has(key) && !/^fav:/.test(key)) localStorage.removeItem(key);
        });
        refreshAll();
      });
      document.getElementById('exportJSON').addEventListener('click', exportJSON);

      els.searchInput.addEventListener('input', () => {
        const q = els.searchInput.value.trim();
        if (q) {
          els.searchBox.classList.add('visible');
          els.semanticSearchInput.value = q;
          performSearch(q);
        } else {
          els.semanticSearchInput.value = '';
        }
      });
      els.semanticSearchInput.addEventListener('input', () => performSearch(els.semanticSearchInput.value));

      els.fileInput.addEventListener('change', async (e) => {
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

      document.querySelectorAll('.pill').forEach(btn => {
        btn.addEventListener('click', () => {
          document.querySelectorAll('.pill').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          activeHeroGroup = btn.dataset.group || 'recentes';
          state.activeGroup = activeHeroGroup;
          saveState();
          renderHero(currentDocs);
        });
      });

      document.querySelectorAll('.nav-item').forEach(btn => {
        btn.addEventListener('click', () => {
          document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
          btn.classList.add('active');
        });
      });

      els.bauTabs.addEventListener('click', (e) => {
        const btn = e.target.closest('button[data-tab]');
        if (!btn) return;
        switchTab(btn.dataset.tab);
      });

      els.orbFilters.addEventListener('click', (e) => {
        const btn = e.target.closest('button[data-filter]');
        if (!btn) return;
        orbFilter = btn.dataset.filter;
        els.orbFilters.querySelectorAll('button').forEach(b => b.classList.toggle('active', b === btn));
        renderOrb(currentDocs);
      });

      els.reader.addEventListener('click', (e) => {
        if (e.target === els.reader) closeReader();
      });

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          closeReader();
          closeBau();
        }
      });

      window.addEventListener('storage', () => refreshAll());
      window.__refreshExplorer = refreshAll;
    }

    function switchTab(tabId) {
      document.querySelectorAll('.bau-tabs button').forEach(btn => btn.classList.toggle('active', btn.dataset.tab === tabId));
      document.querySelectorAll('.bau-tab-pane').forEach(pane => pane.classList.toggle('active', pane.id === `tab-${tabId}`));
      if (tabId === 'search') {
        els.semanticSearchInput.focus();
        performSearch(els.semanticSearchInput.value);
      }
      if (tabId === 'raw') renderRaw();
      if (tabId === 'dashboard') renderStats(currentDocs);
      if (tabId === 'tools') renderPresets();
      if (tabId === 'orb') renderOrb(currentDocs);
    }

    function openBau(tab = 'dashboard') {
      els.bauModal.classList.add('open');
      els.bauModal.setAttribute('aria-hidden', 'false');
      switchTab(tab);
    }
    function closeBau() {
      els.bauModal.classList.remove('open');
      els.bauModal.setAttribute('aria-hidden', 'true');
    }

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

    async function refreshAll() {
      MemoryCore.reload();
      if (!db) {
        try { await initDB(); } catch {}
      }
      currentDocs = await collectDocuments();
      currentDocs = currentDocs.map(doc => ({
        ...doc,
        favorite: localStorage.getItem(`fav:${doc.id}`) === '1' || doc.favorite
      })).sort((a,b) => (b.updatedAt || 0) - (a.updatedAt || 0));
      renderStats(currentDocs);
      renderHero(currentDocs);
      renderRecentCarousel(currentDocs);
      renderLibraryViews(currentDocs);
      renderRaw();
      renderPresets();
      renderOrb(currentDocs);
      if (els.semanticSearchInput.value.trim()) performSearch(els.semanticSearchInput.value);
      els.heroSection.classList.toggle('minimized', !!state.heroMinimized);
      els.toggleAutoplay.textContent = state.autoplay ? '⏸' : '▶';
      els.toggleHero.textContent = state.heroMinimized ? '▲' : '▼';
      setupAutoplay();
      saveState();
    }

    function removeDbDoc(id) {
      if (!db) return Promise.resolve();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        tx.objectStore(STORE_NAME).delete(id);
        tx.oncomplete = () => resolve();
        tx.onerror = err => reject(err);
      });
    }

    // init
    bindUI();
    refreshAll();
  })();
  