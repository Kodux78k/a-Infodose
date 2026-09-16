(function(){
"use strict";
window.KBLX_SAVE = function(){
  try{
    const K = window.KBLX_KEYS;
    const modeClasses = ['mode-night','mode-day','mode-sunset'];
    const currentMode = modeClasses.find(m => document.body.classList.contains(m)) || 'mode-night';
    window.Store.set(K.ui, { mode: currentMode, voiceArch: document.body.dataset.voiceArch || 'jesus', sessionHost: document.body.dataset.sessionHost || 'float', sb: window.__sbGetPos ? window.__sbGetPos() : null });
    window.Store.set(K.arch, window.getArch ? window.getArch() : "JESUS");
    window.Store.set(K.bg, window.__bgState || {});
    window.Store.set(K.user, { id: document.getElementById('inputUserId')?.value || "", model: document.getElementById('inputModel')?.value || "", lastUrl: document.getElementById('urlInputNav')?.value || "" });
    if(window.AlfaBetaState){ const st = window.AlfaBetaState;
      window.Store.set(K.dialog, { units: st.units, index: st.index, cycle: st.cycle, history: st.history, bank: st.bank, sourceText: document.getElementById('sourceText')?.value || "" }); }
    if(window.Nebula?.state){ window.Store.set(K.nebula, { raw: window.Nebula.state.raw || "", title: window.Nebula.state.title || "" }); }
    if(window.MXP?.state){ window.Store.set(K.mxp, window.MXP.state); }
    window.Store.set(K.root, { v:14, ts:Date.now(), NS:window.KBLX_NS });
    const snap = {};
    Object.entries(K).forEach(([k,key])=>{ if(k!=="backup"){ const v = window.Store.get(key); if(v!=null) snap[k]=v; } });
    window.Store.set(K.backup, snap);
  }catch(e){ console.warn('save error', e); }
};
window.KBLX_LOAD = function(){
  try{
    const K = window.KBLX_KEYS;
    const rootIdx = window.Store.get(K.root);
    if(!rootIdx) return false;
    const ui = window.Store.get(K.ui);
    if(ui){
      const modeClasses = ['mode-night','mode-day','mode-sunset'];
      modeClasses.forEach(c => document.body.classList.remove(c));
      if (ui.mode) document.body.classList.add(ui.mode);
      if (ui.sessionHost) document.body.dataset.sessionHost = ui.sessionHost;
      if (ui.sb && window.__sbRestore) window.__sbRestore(ui.sb);
      if (ui.voiceArch && window.applyArch) window.applyArch(ui.voiceArch);
    }
    const arch = window.Store.get(K.arch);
    if(arch && window.applyArch) window.applyArch(arch);
    const bg = window.Store.get(K.bg);
    if (bg) { window.__bgState = Object.assign({ image:null, opacity:15, blend:'overlay' }, bg); if (window.__bgApply) window.__bgApply(); }
    const user = window.Store.get(K.user);
    if(user){ const iu=document.getElementById('inputUserId'); if(iu && user.id) iu.value=user.id;
      const im=document.getElementById('inputModel'); if(im && user.model) im.value=user.model;
      const lu=document.getElementById('urlInputNav'); if(lu && user.lastUrl) lu.value=user.lastUrl; }
    const mxp = window.Store.get(K.mxp);
    if (mxp && window.MXP) {
      const st = window.MXP.state;
      st.version = mxp.version || st.version;
      st.sessions = mxp.sessions || [];
      if (mxp.slots) { st.slots = st.slots || { header:[], aside:[], footer:[], loose:[] }; Object.keys(mxp.slots).forEach(k => { st.slots[k] = Array.isArray(mxp.slots[k]) ? mxp.slots[k] : []; }); }
      window.MXP.render();
    }
    const dialog = window.Store.get(K.dialog);
    if(dialog && window.KBLX_REBUILD_DIALOGUE) window.KBLX_REBUILD_DIALOGUE(dialog);
    const nebula = window.Store.get(K.nebula);
    if(nebula?.raw && window.Nebula) window.Nebula.loadDocument(nebula.raw, nebula.title || "Documento");
    return true;
  }catch(e){ console.warn('load error', e); return false; }
};
document.addEventListener('visibilitychange', ()=>{ if (document.visibilityState === 'hidden') window.KBLX_SAVE(); });
window.addEventListener('beforeunload', ()=>window.KBLX_SAVE());
document.getElementById('exportState')?.addEventListener('click', ()=>{
  window.KBLX_SAVE();
  const snap = window.Store.get(window.KBLX_KEYS.backup) || {};
  const blob = new Blob([JSON.stringify(snap, null, 2)], {type:'application/json'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = `kobllux-backup-${Date.now()}.json`;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(()=>URL.revokeObjectURL(url), 1000);
  window.KBLX_TOAST('Backup exportado ✓');
});
document.getElementById('importState')?.addEventListener('click', ()=>{
  const inp = document.createElement('input');
  inp.type = 'file'; inp.accept = '.json,application/json';
  inp.addEventListener('change', async ()=>{
    const f = inp.files[0]; if(!f) return;
    try{
      const snap = JSON.parse(await f.text());
      if(!snap || !snap.root) return window.KBLX_TOAST('Backup inválido');
      Object.entries(snap).forEach(([k,v])=>{ const key = window.KBLX_KEYS[k]; if(key) window.Store.set(key, v); });
      window.KBLX_TOAST('Backup importado · recarregando…');
      setTimeout(()=>location.reload(), 500);
    }catch(_){ window.KBLX_TOAST('Erro ao ler backup'); }
  });
  inp.click();
});
document.getElementById('resetAllState')?.addEventListener('click', ()=>{
  if(!confirm('⚠️ Apagar TUDO?')) return;
  if(!confirm('🚨 TEM CERTEZA? MXP + backup + bg + arch + user serão apagados.')) return;
  window.Store.clearAll();
  window.KBLX_TOAST('Tudo apagado · recarregando…');
  setTimeout(()=>location.reload(), 500);
});
setTimeout(()=>{
  if(window.KBLX_LOAD()) console.log('[KOBLLUX v14.1] estado restaurado');
  else console.log('[KOBLLUX v14.1] sem backup, iniciando fresh');
  window.KBLX_restoreDockOnBoot?.();
  if (window.KBLX_syncLooseWithDock) window.KBLX_syncLooseWithDock();
}, 200);
(function migrateLegacyBg(){
  try{
    const legacy = JSON.parse(localStorage.getItem('di_bgImages') || '[]');
    if (!legacy.length) return;
    const active = legacy.find(b => b.active);
    if (!active) return;
    const current = window.Store.get(window.KBLX_KEYS.bg, null);
    if (current?.image) return;
    window.__bgState = { image: active.data, opacity: 15, blend: 'overlay' };
    window.Store.set(window.KBLX_KEYS.bg, window.__bgState);
    if (window.__bgApply) window.__bgApply();
    console.log('[Migração] bgPanel.js → §F COCKPIT ok');
  }catch(_){}
})();
})();