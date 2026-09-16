(function(){
"use strict";
window.toggleDrawer = function(id){
  const dr = document.getElementById(id || 'drawerProfile');
  const ov = document.getElementById('drawerOverlay');
  if (!dr) return;
  const open = dr.classList.toggle('open');
  ov.classList.toggle('open', open);
  dr.setAttribute('aria-hidden', open ? 'false' : 'true');
};
window.__bgState = (window.Store && window.Store.get(window.KBLX_KEYS.bg, null)) || { image: null, opacity: 15, blend: 'overlay' };
window.__bgApply = function(){
  const layer = document.getElementById('bg-fake-custom');
  if(!layer) return;
  const s = window.__bgState || {};
  if (s.image) {
    layer.style.backgroundImage = `url("${s.image}")`;
    layer.style.opacity = ((s.opacity ?? 15) / 100);
    layer.style.mixBlendMode = s.blend || 'overlay';
  } else {
    layer.style.backgroundImage = '';
    layer.style.opacity = '0';
  }
  const status = document.getElementById('bgStatusText');
  if (status) status.textContent = s.image ? 'imagem carregada' : 'Nenhum';
  const thumb = document.getElementById('bgThumbPanel');
  if (thumb) {
    thumb.innerHTML = s.image
      ? `<div style="position:relative;border-radius:10px;overflow:hidden;aspect-ratio:16/9;background:url('${s.image}') center/cover"><button type="button" onclick="window.__bgClear()" style="position:absolute;top:6px;right:6px;width:26px;height:26px;border-radius:50%;border:0;background:rgba(0,0,0,.6);color:#fff;cursor:pointer">✕</button></div>`
      : '';
  }
  const op = document.getElementById('bgOpacity'); if (op) op.value = s.opacity ?? 15;
  const opv = document.getElementById('val-op'); if (opv) opv.textContent = (s.opacity ?? 15) + '%';
  const bl = document.getElementById('bgBlend'); if (bl) bl.value = s.blend || 'overlay';
};
window.updateBgAttr = function(attr, val){
  if (!window.__bgState) window.__bgState = {};
  if (attr === 'opacity') val = parseInt(val, 10) || 0;
  window.__bgState[attr] = val;
  window.__bgApply();
  if (window.KBLX_SAVE) window.KBLX_SAVE();
};
window.__bgClear = function(){
  window.__bgState = {image: null, opacity: 15, blend: 'overlay'};
  window.__bgApply();
  if (window.KBLX_SAVE) window.KBLX_SAVE();
  if (window.KBLX_TOAST) window.KBLX_TOAST('Background removido');
};
const bgUpload = document.getElementById('bgUploadInput');
if (bgUpload){
  bgUpload.addEventListener('change', async (e)=>{
    const f = e.target.files[0];
    if (!f) return;
    if (f.size > 8 * 1024 * 1024) { if (window.KBLX_TOAST) window.KBLX_TOAST('Imagem > 8MB'); return; }
    const reader = new FileReader();
    reader.onload = (ev)=>{
      if (!window.__bgState) window.__bgState = {};
      window.__bgState.image = ev.target.result;
      window.__bgApply();
      if (window.KBLX_TOAST) window.KBLX_TOAST('Background aplicado ✓');
      if (window.KBLX_SAVE) window.KBLX_SAVE();
    };
    reader.readAsDataURL(f);
    bgUpload.value = '';
  });
}
function cycleSolar(){
  const modes = ['mode-night','mode-day','mode-sunset'];
  const cur = modes.find(m => document.body.classList.contains(m)) || 'mode-night';
  const idx = (modes.indexOf(cur) + 1) % modes.length;
  modes.forEach(m => document.body.classList.remove(m));
  document.body.classList.add(modes[idx]);
  const el = document.getElementById('statusSolarMode'); if (el) el.textContent = modes[idx].replace('mode-','').toUpperCase();
  if (window.KBLX_SAVE) window.KBLX_SAVE();
}
document.getElementById('btnCycleSolar')?.addEventListener('click', cycleSolar);
document.getElementById('themeToggle')?.addEventListener('click', cycleSolar);
document.getElementById('btnAutoSolar')?.addEventListener('click', ()=>{
  const h = new Date().getHours();
  const mode = (h >= 6 && h < 12) ? 'mode-day' : (h >= 12 && h < 18) ? 'mode-sunset' : 'mode-night';
  document.body.classList.remove('mode-day','mode-sunset','mode-night');
  document.body.classList.add(mode);
  const el = document.getElementById('statusSolarMode'); if (el) el.textContent = 'AUTO · ' + mode.replace('mode-','').toUpperCase();
  if (window.KBLX_TOAST) window.KBLX_TOAST('Auto 🕒 ' + mode);
  if (window.KBLX_SAVE) window.KBLX_SAVE();
});
function syncHostUI(){
  const cur = document.body.dataset.sessionHost || 'float';
  document.querySelectorAll('[data-mode]').forEach(b => b.classList.toggle('primary', b.dataset.mode === cur));
}
document.getElementById('hostFloatBtn')?.addEventListener('click', ()=>{
  document.body.dataset.sessionHost = 'float';
  if (window.DualSession?.renderSessions) window.DualSession.renderSessions();
  if (window.MXP?.save) window.MXP.save();
  syncHostUI();
  if (window.KBLX_TOAST) window.KBLX_TOAST('Host: 🌊 Float');
});
document.getElementById('hostStackBtn')?.addEventListener('click', ()=>{
  document.body.dataset.sessionHost = 'stack';
  if (window.DualSession?.renderSessions) window.DualSession.renderSessions();
  if (window.MXP?.save) window.MXP.save();
  syncHostUI();
  if (window.KBLX_TOAST) window.KBLX_TOAST('Host: 📚 Stack');
});
syncHostUI();
document.getElementById('inputUserId')?.addEventListener('input', ()=>{ if(window.KBLX_SAVE) window.KBLX_SAVE(); });
document.getElementById('inputModel')?.addEventListener('input', ()=>{ if(window.KBLX_SAVE) window.KBLX_SAVE(); });
document.getElementById('menuBtn')?.addEventListener('click', ()=>window.toggleDrawer('drawerProfile'));
document.getElementById('orbToggle')?.addEventListener('click', ()=>window.toggleDrawer('drawerProfile'));
document.getElementById('notifBtn')?.addEventListener('click', ()=>window.KBLX_TOAST('Sem notificações'));
window.__bgApply();
console.log('[Cockpit v14] online · bg state:', window.__bgState);
})();