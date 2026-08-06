
        (function() {
            if (window.__KBLX_RUNTIME) return;
            window.__KBLX_RUNTIME = true;

            const KBLX_PATTERNS = [
                { name: 'KBLX_A', pattern: '<' }, { name: 'KBLX_B', pattern: '\\[' },
                { name: 'KBLX_C', pattern: '["\'`]' }, { name: 'KBLX_D', pattern: '\\(' },
                { name: 'KBLX_E', pattern: '\\{' }, { name: 'KBLX_F', pattern: '\\/' },
                { name: 'KBLX_G', pattern: '>' }, { name: 'KBLX_H', pattern: '\\s{2,}' },
                { name: 'KBLX_I', pattern: '[./\\\\\\-_]' }, { name: 'KBLX_J', pattern: ':' },
                { name: 'KBLX_K', pattern: '(\\/\\*|\\/\\/)' }, { name: 'KBLX_L', pattern: '(;|\\/>|\\)|\\]|\\})' },
                { name: 'KBLX_N', pattern: '[a-zA-Z][a-zA-Z0-9_]*' }, { name: 'KBLX_P', pattern: '\\d+' },
                { name: 'KBLX_R', pattern: ',' }, { name: 'KBLX_T', pattern: '(=|\\s)' },
                { name: 'KBLX_X', pattern: '\\*' }, { name: 'KBLX_EXP', pattern: '[\\n\\r]+' }
            ];
            const KBLX_REGEX = new RegExp(
                KBLX_PATTERNS.map(({ name, pattern }) => `(?<${name}>${pattern})`).join('|'), 'g'
            );

            function hashTokens(tokens) {
                let h1 = 0xdeadbeef ^ 0, h2 = 0x41c6ce57 ^ 0;
                const str = tokens.map(t => t.type + t.value).join('|');
                for (let i = 0; i < str.length; i++) {
                    const ch = str.charCodeAt(i);
                    h1 = Math.imul(h1 ^ ch, 2654435761);
                    h2 = Math.imul(h2 ^ ch, 1597334677);
                }
                h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
                h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
                return 'kblx_' + (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(36);
            }

            function fractalPack(tokens, level = 1) {
                if (level === 1) return JSON.stringify(tokens);
                if (level === 2) return btoa(JSON.stringify(tokens.map(t => t.type[5] + t.value)));
                return tokens.map(t => (t.type.charCodeAt(5) << 8) | t.value.length).join(',');
            }
            function fractalUnpack(packed, level = 1) {
                try { if (level === 1) return JSON.parse(packed); if (level === 2) return JSON.parse(atob(packed)); } catch { return null; }
            }

            class EventBus {
                constructor() { this._listeners = new Map(); }
                on(event, cb) { if (!this._listeners.has(event)) this._listeners.set(event, new Set()); this._listeners.get(event).add(cb); return () => this.off(event, cb); }
                off(event, cb) { this._listeners.get(event)?.delete(cb); }
                emit(event, payload = {}) { this._listeners.get(event)?.forEach(cb => { try { cb({ event, timestamp: Date.now(), ...payload }); } catch (err) { console.error('[KBLX Bus]', err); } }); this._listeners.get('*')?.forEach(cb => cb({ event, timestamp: Date.now(), ...payload })); }
            }

            const LS_KEYS = { LATEST: 'kblx:latest', HISTORY: 'kblx:history', ARCHIVE: 'kblx:archive_' };
            function saveToLS(tokens, stats, code) {
                const signature = hashTokens(tokens);
                const payload = { signature, tokens: fractalPack(tokens, 1), stats, codeSize: code.length, tokenCount: tokens.length, savedAt: Date.now() };
                try {
                    localStorage.setItem(LS_KEYS.LATEST, JSON.stringify(payload));
                    const history = JSON.parse(localStorage.getItem(LS_KEYS.HISTORY) || '[]');
                    history.unshift({ signature, tokenCount: tokens.length, codeSize: code.length, savedAt: payload.savedAt, compact: fractalPack(tokens, 2) });
                    if (history.length > 50) history.length = 50;
                    localStorage.setItem(LS_KEYS.HISTORY, JSON.stringify(history));
                    return signature;
                } catch (err) { console.warn('[KBLX LS] Falha ao persistir:', err); return signature; }
            }
            function loadFromLS() {
                try { const raw = localStorage.getItem(LS_KEYS.LATEST); if (!raw) return null; const data = JSON.parse(raw); data.tokens = fractalUnpack(data.tokens, 1); return data; } catch { return null; }
            }
            function loadHistory() { try { return JSON.parse(localStorage.getItem(LS_KEYS.HISTORY) || '[]'); } catch { return []; } }
            function clearKBLXStorage() { localStorage.removeItem(LS_KEYS.LATEST); localStorage.removeItem(LS_KEYS.HISTORY); }

            function tokenize(code) {
                const tokens = []; let match; KBLX_REGEX.lastIndex = 0;
                while ((match = KBLX_REGEX.exec(code)) !== null) {
                    const groups = match.groups;
                    for (const [name, value] of Object.entries(groups)) { if (value !== undefined) { tokens.push({ type: name, value, index: match.index }); break; } }
                }
                return tokens;
            }
            function count(tokens) { const counts = {}; tokens.forEach(t => { counts[t.type] = (counts[t.type] || 0) + 1; }); return counts; }

            function extractCDNUrls(tokens) {
                const urls = []; let inAttr = false, currentUrl = '', currentType = null;
                for (let i = 0; i < tokens.length; i++) {
                    const t = tokens[i];
                    if (t.type === 'KBLX_N' && (t.value === 'src' || t.value === 'href')) { inAttr = true; currentType = t.value; currentUrl = ''; continue; }
                    if (inAttr && t.type === 'KBLX_C') { if (currentUrl) { if (currentUrl.startsWith('http') || currentUrl.startsWith('//')) { urls.push({ url: currentUrl, type: currentType, index: t.index }); } inAttr = false; currentUrl = ''; } continue; }
                    if (inAttr && t.type !== 'KBLX_T') currentUrl += t.value;
                }
                return urls;
            }
            function findDuplicateCDNs(tokens) { const urls = extractCDNUrls(tokens); const seen = new Map(), dupes = []; urls.forEach(u => { const norm = u.url.replace(/[?#].*$/, '').replace(/[\.\-][\d]+\.[\d]+\.[\d]+/g, '').replace(/[\.\-]min(?=\.)/g, ''); if (seen.has(norm)) dupes.push({ original: u, firstSeen: seen.get(norm) }); else seen.set(norm, u); }); return dupes; }
            function deltaSignature(tokensA, tokensB) { const sigA = new Set(tokensA.map(t => t.type + '|' + t.value)); const sigB = new Set(tokensB.map(t => t.type + '|' + t.value)); let common = 0; sigA.forEach(v => { if (sigB.has(v)) common++; }); return 1 - (common / Math.max(sigA.size, sigB.size, 1)); }
            function validateRender(code, expectedSignature) { const tokens = tokenize(code); return hashTokens(tokens) === expectedSignature; }

            const bus = new EventBus();
            let _last = { tokens: [], stats: {}, signature: null, code: '' };

            window.KBLX = {
                patterns: KBLX_PATTERNS, regex: KBLX_REGEX, tokenize, count, hash: hashTokens,
                extractCDNUrls, findDuplicateCDNs, delta: deltaSignature, validate: validateRender,
                save: saveToLS, load: loadFromLS, history: loadHistory, clearStorage: clearKBLXStorage,
                pack: fractalPack, unpack: fractalUnpack,
                on: bus.on.bind(bus), off: bus.off.bind(bus), emit: bus.emit.bind(bus),
                get last() { return _last; }, set last(v) { _last = v; },
                process(code, { emitEvent = true, persist = true } = {}) {
                    const tokens = tokenize(code); const stats = count(tokens); const signature = persist ? saveToLS(tokens, stats, code) : hashTokens(tokens);
                    _last = { tokens, stats, signature, code, processedAt: Date.now() };
                    if (emitEvent) bus.emit('kblx:processed', _last);
                    return _last;
                }
            };
            window.addEventListener('beforeunload', () => { if (_last.tokens.length) saveToLS(_last.tokens, _last.stats, _last.code); });
            console.log('✅ KBLX HUB ∆³ registrado — Tokens | Bus | Régua | Persistência');
        })();
    