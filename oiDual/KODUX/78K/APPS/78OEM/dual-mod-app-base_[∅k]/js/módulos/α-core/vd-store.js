/* ═══════════════════════════════════════════════════════════
   §STORAGE · vd-store · O Namespace Sagrado
   Arquétipo: VERDADE · Prefixo: vd_
   ═══════════════════════════════════════════════════════════ */
(function(){
"use strict";

window.vd_ns = "kobllux";

window.vd_keys = {
  jesus_root:  "kobllux:root",      /* JESUS · o centro */
  genus_mxp:   "kobllux:mxp",       /* GENUS · a fábrica */
  lumine_bg:   "kobllux:bg",        /* LUMINE · a luz */
  jesus_arch:  "kobllux:arch",      /* JESUS · arquétipo ativo */
  serena_user: "kobllux:user",      /* SERENA · o viajante */
  lumine_ui:   "kobllux:ui",        /* LUMINE · a interface */
  pulse_dlg:   "kobllux:dialog",    /* PULSE · o diálogo */
  solus_nbl:   "kobllux:nebula",    /* SOLUS · a nebula */
  aion_bkp:    "kobllux:backup",    /* AION · o carimbo */
};

window.aion_store = {
  ler(k, fb=null){
    try{ const v = localStorage.getItem(k); return v ? JSON.parse(v) : fb; }
    catch(_){ return fb; }
  },
  gravar(k, v){
    try{ localStorage.setItem(k, JSON.stringify(v)); return true; }
    catch(_){ return false; }
  },
  apagar(k){ try{ localStorage.removeItem(k); }catch(_){} },
  chaves(){ return Object.values(window.vd_keys); },
  limparTudo(){ this.chaves().forEach(k=>this.apagar(k)); }
};

console.log('[vd-store] online · namespace:', window.vd_ns);
})();

