window.KBLX_NS = "kobllux";
window.KBLX_KEYS = {
  root:"kobllux:root",mxp:"kobllux:mxp",bg:"kobllux:bg",arch:"kobllux:arch",
  user:"kobllux:user",ui:"kobllux:ui",dialog:"kobllux:dialog",nebula:"kobllux:nebula",backup:"kobllux:backup"
};
window.Store = {
  get(k, fallback=null){ try{ const v = localStorage.getItem(k); return v ? JSON.parse(v) : fallback; } catch(_){ return fallback; } },
  set(k, v){ try{ localStorage.setItem(k, JSON.stringify(v)); return true; } catch(_){ return false; } },
  del(k){ try{ localStorage.removeItem(k); }catch(_){} },
  keys(){ return Object.values(window.KBLX_KEYS); },
  clearAll(){ this.keys().forEach(k=>this.del(k)); }
};