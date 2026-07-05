async function bootstrapDI(jsonUrl = 'di.base.json') {
  const res = await fetch(jsonUrl);
  const base = await res.json();

  // --- LOCALSTORAGE ---
  Object.entries(base.identity).forEach(([k, v]) => {
    if (localStorage.getItem(k) === null) localStorage.setItem(k, v);
  });

  Object.entries(base.modes).forEach(([k, v]) => {
    if (localStorage.getItem(k) === null) {
      localStorage.setItem(k, typeof v === 'boolean' ? (v ? '1' : '0') : v);
    }
  });

  Object.entries(base.training).forEach(([k, v]) => {
    if (localStorage.getItem(k) === null) localStorage.setItem(k, v);
  });

  // --- INDEXED DB (ASSETS) ---
  if (base.storage.customCss) {
    App?.indexedDB?.putAsset?.('di_customCss', { css: base.storage.customCss });
  }

  console.log('[DI_BOOTSTRAP] Sistema carregado', {
    user: base.identity.di_userName,
    dual: base.identity.di_infodoseName,
    version: base.meta.version
  });

  return base;
}