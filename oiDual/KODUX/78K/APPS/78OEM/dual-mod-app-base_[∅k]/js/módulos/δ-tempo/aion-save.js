/* ═══════════════════════════════════════════════════════════
   §SAVE · aion-save · O Carimbo do Tempo
   Arquétipo: AION · Prefixo: aion_
   Depende: vd-store, vd-arquétipos, vitalis-diálogo, solus-nebula, genus-mxp
   ═══════════════════════════════════════════════════════════ */
(function(){
"use strict";
const dv_q = s => document.querySelector(s);

/* ─── SAVE ─── */
window.aion_save = function(){
  try{
    const K = window.vd_keys;
    window.aion_store.gravar(K.lumine_ui, {
      mode: document.body.className,
      voiceArch: document.body.dataset.voiceArch,
      sessionHost: document.body.dataset.sessionHost,
      sb: window.__sbGetPos ? window.__sbGetPos() : null
    });
    window.aion_store.gravar(K.jesus_arch, window.jesus_arch ? window.jesus_arch() : "JESUS");
    window.aion_store.gravar(K.lumine_bg, window.serena_bgstate || {});
    window.aion_store.gravar(K.serena_user, {
      id: document.getElementById('serena_userid')?.value || "",
      model: document.getElementById('kodux_model')?.value || "",
      lastUrl: document.getElementById('atlas_urlbar')?.value || ""
    });
    if(window.vitalis_state){
      const st = window.vitalis_state;
      window.aion_store.gravar(K.pulse_dlg, {
        units: st.units, index: st.index, cycle: st.cycle,
        history: st.history, bank: st.bank,
        sourceText: document.getElementById('nova_source')?.value || ""
      });
    }
    if(window.solus_nebula?.state){
      window.aion_store.gravar(K.solus_nbl, {
        raw: window.solus_nebula.state.raw || "",
        title: window.solus_nebula.state.title || ""
      });
    }
    if(window.genus_mxp?.state){
      window.aion_store.gravar(K.genus_mxp, window.genus_mxp.state);
    }
    window.aion_store.gravar(K.jesus_root, {v:13, ts:Date.now(), NS:window.vd_ns});
    const snap = {};
    Object.entries(K).forEach(([k,key])=>{
      if(k !== "aion_bkp"){
        const v = window.aion_store.ler(key);
        if(v != null) snap[k] = v;
      }
    });
    window.aion_store.gravar(K.aion_bkp, snap);
  }catch(e){ console.warn('aion_save error', e); }
};

/* ─── LOAD ─── */
window.aion_load = function(){
  try{
    const K = window.vd_keys;
    const rootIdx = window.aion_store.ler(K.jesus_root);
    if(!rootIdx) return false;

    const ui = window.aion_store.ler(K.lumine_ui);
    if(ui){
      if(ui.mode) document.body.className = ui.mode;
      if(ui.sessionHost) document.body.dataset.sessionHost = ui.sessionHost;
      if(ui.sb && window.__sbRestore) window.__sbRestore(ui.sb);
      if(ui.voiceArch && window.jesus_apply) window.jesus_apply(ui.voiceArch);
    }
    const arch = window.aion_store.ler(K.jesus_arch);
    if(arch && window.jesus_apply) window.jesus_apply(arch);

    const bg = window.aion_store.ler(K.lumine_bg);
    if(bg){
      window.serena_bgstate = bg;
      if(window.serena_apply_bg) window.serena_apply_bg();
    }

    const user = window.aion_store.ler(K.serena_user);
    if(user){
      const iu = document.getElementById('serena_userid');
      if(iu && user.id) iu.value = user.id;
      const im = document.getElementById('kodux_model');
      if(im && user.model) im.value = user.model;
      const lu = document.getElementById('atlas_urlbar');
      if(lu && user.lastUrl) lu.value = user.lastUrl;
    }

    const mxp = window.aion_store.ler(K.genus_mxp);
    if(mxp && window.genus_mxp){
      Object.assign(window.genus_mxp.state, mxp);
      window.genus_mxp.render();
    }

    const dialog = window.aion_store.ler(K.pulse_dlg);
    if(dialog && window.aion_rebuild_dialogue) window.aion_rebuild_dialogue(dialog);

    const nebula = window.aion_store.ler(K.solus_nbl);
    if(nebula?.raw && window.solus_nebula)
      window.solus_nebula.loadDocument(nebula.raw, nebula.title || "Documento");

    return true;
  }catch(e){ console.warn('aion_load error', e); return false; }
};

/* ─── auto-save ─── */
window.addEventListener('beforeunload', ()=>window.aion_save());

/* ─── export ─── */
document.getElementById('aion_export')?.addEventListener('click', ()=>{
  window.aion_save();
  const snap = window.aion_store.ler(window.vd_keys.aion_bkp) || {};
  const blob = new Blob([JSON.stringify(snap, null, 2)], {type:'application/json'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `kobllux-backup-${Date.now()}.json`;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(()=>URL.revokeObjectURL(url), 1000);
  window.pulse_toast('Backup exportado ✓');
});

/* ─── import ─── */
document.getElementById('aion_import')?.addEventListener('click', ()=>{
  const inp = document.createElement('input');
  inp.type = 'file'; inp.accept = '.json,application/json';
  inp.addEventListener('change', async ()=>{
    const f = inp.files[0]; if(!f) return;
    try{
      const snap = JSON.parse(await f.text());
      if(!snap || !snap.jesus_root) return window.pulse_toast('Backup inválido');
      Object.entries(snap).forEach(([k,v])=>{
        const key = window.vd_keys[k];
        if(key) window.aion_store.gravar(key, v);
      });
      window.pulse_toast('Backup importado · recarregando…');
      setTimeout(()=>location.reload(), 500);
    }catch(_){ window.pulse_toast('Erro ao ler backup'); }
  });
  inp.click();
});

/* ─── reset ─── */
document.getElementById('kaos_reset')?.addEventListener('click', ()=>{
  if(!confirm('Apagar TUDO (MXP + backup + bg + arch + user)?')) return;
  window.aion_store.limparTudo();
  window.pulse_toast('Tudo apagado · recarregando…');
  setTimeout(()=>location.reload(), 500);
});

/* ─── boot restore ─── */
setTimeout(()=>{
  if(window.aion_load()) console.log('[aion-save] estado restaurado de kobllux:*');
  else console.log('[aion-save] sem backup, iniciando fresh');
}, 200);

console.log('[aion-save] online · AION carimbou o tempo');
})();