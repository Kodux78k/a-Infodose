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

window.__bgState = window.Store ? (window.Store.get(window.KBLX_KEYS.bg, {}) || {}) : {};

window.__bgApply = function(){
  const layer = document.getElementById('bg-fake-custom');
  if(!layer) return;
  const s = window.__bgState || {};
  if(s.image){
    layer.style.backgroundImage = `url('${s.image}')`;
    layer.style.opacity = (s.opacity ?? 15)/100;
    layer.style.mixBlendMode = s.blend || 'overlay';
  } else {
    layer.style.backgroundImage = '';
    layer.style.opacity = 0;
  }
  const st = document.getElementById('bgStatusText'); if(st) st.textContent = s.image ? 'imagem carregada' : 'Nenhum';
  const th = document.getElementById('bgThumbPanel');
  if(th) th.innerHTML = s.image ? `<img src="${s.image}" alt="bg">` : '';
  const op = document.getElementById('bgOpacity'); if(op) op.value = s.opacity ?? 15;
  const opv = document.getElementById('val-op'); if(opv) opv.textContent = (s.opacity ?? 15) + '%';
  const bl = document.getElementById('bgBlend'); if(bl) bl.value = s.blend || 'overlay';
};

window.updateBgAttr = function(attr, val){
  window.__bgState = window.__bgState || {};
  window.__bgState[attr] = val;
  window.__bgApply();
  if(window.KBLX_SAVE) window.KBLX_SAVE();
};

const bgUpload = document.getElementById('bgUploadInput');
if(bgUpload){
  bgUpload.addEventListener('change', async (e)=>{
    const f = e.target.files[0]; if(!f) return;
    const reader = new FileReader();
    reader.onload = (ev)=>{
      window.__bgState = window.__bgState || {};
      window.__bgState.image = ev.target.result;
      window.__bgApply();
      window.KBLX_TOAST('Background aplicado ✓');
      if(window.KBLX_SAVE) window.KBLX_SAVE();
    };
    reader.readAsDataURL(f);
  });
}

function cycleSolar(){
  const modes = ['mode-night','mode-day','mode-sunset'];
  const cur = modes.find(m => document.body.classList.contains(m)) || 'mode-night';
  const idx = (modes.indexOf(cur) + 1) % modes.length;
  modes.forEach(m => document.body.classList.remove(m));
  document.body.classList.add(modes[idx]);
  const el = document.getElementById('statusSolarMode'); if(el) el.textContent = modes[idx].replace('mode-','').toUpperCase();
  if(window.KBLX_SAVE) window.KBLX_SAVE();
}
document.getElementById('btnCycleSolar')?.addEventListener('click', cycleSolar);
document.getElementById('themeToggle')?.addEventListener('click', cycleSolar);
document.getElementById('btnAutoSolar')?.addEventListener('click', ()=>{
  const h = new Date().getHours();
  const mode = (h >= 6 && h < 12) ? 'mode-day' : (h >= 12 && h < 18) ? 'mode-sunset' : 'mode-night';
  document.body.classList.remove('mode-day','mode-sunset','mode-night');
  document.body.classList.add(mode);
  const el = document.getElementById('statusSolarMode'); if(el) el.textContent = 'AUTO · ' + mode.replace('mode-','').toUpperCase();
  window.KBLX_TOAST('Auto 🕒 ' + mode);
  if(window.KBLX_SAVE) window.KBLX_SAVE();
});

const inputUser = document.getElementById('inputUserId');
if(inputUser){ inputUser.addEventListener('input', ()=>{ if(window.KBLX_SAVE) window.KBLX_SAVE(); }); }
const inputModel = document.getElementById('inputModel');
if(inputModel){ inputModel.addEventListener('input', ()=>{ if(window.KBLX_SAVE) window.KBLX_SAVE(); }); }

document.getElementById('menuBtn')?.addEventListener('click', ()=>window.toggleDrawer('drawerProfile'));
document.getElementById('orbToggle')?.addEventListener('click', ()=>window.toggleDrawer('drawerProfile'));
document.getElementById('notifBtn')?.addEventListener('click', ()=>window.KBLX_TOAST('Sem notificações'));

/* apply bg immediately */
window.__bgApply();
console.log('[Cockpit] online');
})();