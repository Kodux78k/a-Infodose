
/* KOBLLUX State Core V86 · legacy writes synchronized
   Fonte observável para novos componentes; preserva as APIs e chaves antigas.
   Não substitui os controladores legados automaticamente.
*/
(() => {
  'use strict';
  if (window.KOBState) return;
  const KEYS = Object.freeze({
    user: 'di_userName', assistant: 'di_assistantName',
    model: 'di_modelName', infodose: 'di_infodoseName',
    conversation: 'di_conversation', theme: 'infodoseTheme'
  });
  const defaults = Object.freeze({
    user: 'Convidado', assistant: 'Dual',
    model: 'nvidia/nemotron-3-nano-30b-a3b:free',
    infodose: 'Infodose', conversation: '', theme: 'dark',
    audio: { playing: false, muted: false }, settings: {}, history: []
  });
  const listeners = new Set();
  let revision = 0;
  let internalWrite = false;
  const read = (key, fallback) => {
    try { const value = localStorage.getItem(key); return value == null ? fallback : value; }
    catch (_) { return fallback; }
  };
  let state = {
    ...defaults,
    user: read(KEYS.user, defaults.user),
    assistant: read(KEYS.assistant, defaults.assistant),
    model: read(KEYS.model, defaults.model),
    infodose: read(KEYS.infodose, defaults.infodose),
    conversation: read(KEYS.conversation, defaults.conversation),
    theme: read(KEYS.theme, defaults.theme)
  };
  const snapshot = () => Object.freeze({
    ...state, audio: { ...state.audio },
    settings: { ...state.settings }, history: [...state.history]
  });
  const emit = (reason, changedKey) => {
    revision += 1;
    const detail = Object.freeze({ state: snapshot(), revision, reason, changedKey });
    window.dispatchEvent(new CustomEvent('kob:statechange', { detail }));
    listeners.forEach(fn => {
      try { fn(detail.state, detail); }
      catch (error) { console.error('[KOBState] listener failed', error); }
    });
  };
  const set = (key, value, options = {}) => {
    if (!Object.prototype.hasOwnProperty.call(defaults, key))
      throw new Error('[KOBState] Unknown state key: ' + key);
    const next = value && typeof value === 'object'
      ? (Array.isArray(value) ? [...value] : { ...value }) : value;
    state = { ...state, [key]: next };
    if (options.persist !== false && KEYS[key]) {
      internalWrite = true;
      try { localStorage.setItem(KEYS[key], typeof next === 'string' ? next : JSON.stringify(next)); }
      catch (_) {}
      finally { internalWrite = false; }
    }
    emit(options.reason || 'set', key);
    return snapshot();
  };
  const patch = (partial, options = {}) => {
    if (!partial || typeof partial !== 'object' || Array.isArray(partial))
      throw new TypeError('[KOBState] patch expects an object');
    const next = { ...state };
    for (const [key, value] of Object.entries(partial)) {
      if (!Object.prototype.hasOwnProperty.call(defaults, key)) continue;
      next[key] = value && typeof value === 'object'
        ? (Array.isArray(value) ? [...value] : { ...value }) : value;
    }
    state = next;
    if (options.persist !== false) {
      for (const [key, value] of Object.entries(partial)) {
        if (!KEYS[key]) continue;
        internalWrite = true;
        try { localStorage.setItem(KEYS[key], typeof value === 'string' ? value : JSON.stringify(value)); }
        catch (_) {}
        finally { internalWrite = false; }
      }
    }
    emit(options.reason || 'patch', Object.keys(partial));
    return snapshot();
  };
  window.KOBState = Object.freeze({
    get: snapshot, set, patch,
    subscribe(fn, immediate = true) {
      if (typeof fn !== 'function') throw new TypeError('subscribe expects a function');
      listeners.add(fn);
      if (immediate) fn(snapshot(), { revision, reason: 'subscribe', changedKey: null });
      return () => listeners.delete(fn);
    },
    get revision() { return revision; },
    keys: KEYS,
    version: '86.0.0',
    compatibility: Object.freeze({ legacyStorageSync: true, legacyKeys: Object.freeze(Object.values(KEYS)) })
  });
  window.addEventListener('storage', event => {
    const key = Object.keys(KEYS).find(name => KEYS[name] === event.key);
    if (!key) return;
    state = { ...state, [key]: event.newValue == null ? defaults[key] : event.newValue };
    emit('storage', key);
  });
  /* V86: sincroniza escritas legadas feitas no mesmo documento.
     A chamada original acontece primeiro; a guarda evita recursão quando KOBState persiste. */
  try {
    const proto = Storage.prototype;
    if (!proto.__kobV86Wrapped) {
      const REV_KEYS = Object.create(null); Object.keys(KEYS).forEach(k => { if (!(KEYS[k] in REV_KEYS)) REV_KEYS[KEYS[k]] = k; });
      const nativeSet = proto.setItem;
      const nativeRemove = proto.removeItem;
      const nativeClear = proto.clear;
      Object.defineProperty(proto, '__kobV86Wrapped', { value: true, configurable: false });
      proto.setItem = function(key, value) {
        nativeSet.call(this, key, value);
        if (this !== window.localStorage || internalWrite) return;
        const name = REV_KEYS[String(key)];
        if (name) set(name, String(value), { persist: false, reason: 'legacy-storage' });
      };
      proto.removeItem = function(key) {
        nativeRemove.call(this, key);
        if (this !== window.localStorage || internalWrite) return;
        const name = REV_KEYS[String(key)];
        if (name) set(name, defaults[name], { persist: false, reason: 'legacy-storage-remove' });
      };
      proto.clear = function() {
        nativeClear.call(this);
        if (this !== window.localStorage || internalWrite) return;
        state = { ...state };
        Object.keys(KEYS).forEach(name => { state[name] = defaults[name]; });
        emit('legacy-storage-clear', Object.keys(KEYS));
      };
    }
  } catch (error) { console.warn('[KOBState] legacy storage hook unavailable', error); }
  window.KOB_ARCHETYPES = Object.freeze([
    { id: 'atlas', label: 'Atlas', role: 'estrutura' },
    { id: 'nova', label: 'Nova', role: 'expansão' },
    { id: 'vitalis', label: 'Vitalis', role: 'energia' },
    { id: 'pulse', label: 'Pulse', role: 'ritmo' },
    { id: 'kaos', label: 'Kaos', role: 'ruptura' },
    { id: 'kodux', label: 'Kodux', role: 'vigilância' },
    { id: 'lumine', label: 'Lumine', role: 'clareza' },
    { id: 'aion', label: 'Aion', role: 'continuidade' },
    { id: 'kobllux', label: 'KOBLLUX', role: 'integração' },
    { id: 'infodose', label: 'Infodose', role: 'contexto' },
    { id: 'trinity', label: 'Trinity', role: 'síntese' }
  ]);
})();
