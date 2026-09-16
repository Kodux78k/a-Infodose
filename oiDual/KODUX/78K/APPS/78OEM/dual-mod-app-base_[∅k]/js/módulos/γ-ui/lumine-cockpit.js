/* ═══════════════════════════════════════════════════════════
   §F · COCKPIT · lumine-cockpit · O Painel Solar
   Arquétipo: LUMINE · Prefixo: lumine_
   Depende: vd-store, vd-arquétipos
   ═══════════════════════════════════════════════════════════ */
(function(){
"use strict";
const dv_q = s => document.querySelector(s);

/* ─── toggle drawer ─── */
window.lumine_toggle_drawer = function(id){
  const dr = document.getElementById(id || 'lumine_cockpit');
  const ov = document.getElementById('lumine_doverlay');
  if(!dr) return;
  const open = dr.classList.toggle('open');
  ov?.classList.toggle('open', open);
  dr.setAttribute('aria-hidden', open ? 'false' : 'true');
};

/* ─── estado do bg ─── */
window.serena_bgstate = window.aion_store
  ? (window.aion_store.ler(window.vd_keys.lumine_bg, {}) || {})
  : {};

window.serena_apply_bg = function(){
  const layer = document.getElementById('serena_bg');
  if(!layer) return;
  const s = window.serena_bgstate || {};
  if(s.image){
    layer.style.backgroundImage = `url('${s.image}')`;
    layer.style.opacity = (s.opacity ?? 15)/100;
    layer.style.mixBlendMode = s.blend || 'overlay';
  } else {
    layer.style.backgroundImage = '';
    layer.style.opacity = 0;
  }
  const st = document.getElementById('serena_bgstatus');
  if(st) st.textContent = s.image ? 'imagem carregada' : 'Nenhum';
  const th = document.getElementById('serena_bgthumb');
  if(th) th.innerHTML = s.image ? `<img src="${s.image}" alt="bg">` : '';
  const op = document.getElementById('lumine_opacity');
  if(op) op.value = s.opacity ?? 15;
  const opv = document.getElementById('lumine_valop');
  if(opv) opv.textContent = (s.opacity ?? 15) + '%';
  const bl = document.getElementById('lumine_blend');
  if(bl) bl.value = s.blend || 'overlay';
};

window.serena_update_bg = function(attr, val){
  window.serena_bgstate = window.serena_bgstate || {};
  window.serena_bgstate[attr] = val;
  window.serena_apply_bg();
  if(window.aion_save) window.aion_save();
};

/* ─── upload ─── */
const serena_bgupload = document.getElementById('serena_bgupload');
if(serena_bgupload){
  serena_bgupload.addEventListener('change', async (e)=>{
    const f = e.target.files[0]; if(!f) return;
    const reader = new FileReader();
    reader.onload = (ev)=>{
      window.serena_bgstate = window.serena_bgstate || {};
      window.serena_bgstate.image = ev.target.result;
      window.serena_apply_bg();
      window.pulse_toast('Background aplicado ✓');
      if(window.aion_save) window.aion_save();
    };
    reader.readAsDataURL(f);
  });
}

/* ─── ciclo solar ─── */
function lumine_cycle_solar(){
  const modes = ['lumine-mode-night','lumine-mode-day','lumine-mode-sunset'];
  const cur = modes.find(m=>document.body.classList.contains(m)) || 'lumine-mode-night';
  const idx = (modes.indexOf(cur) + 1) % modes.length;
  modes.forEach(m=>document.body.classList.remove(m));
  document.body.classList.add(modes[idx]);
  const el = document.getElementById('lumine_status');
  if(el) el.textContent = modes[idx].replace('lumine-mode-','').toUpperCase();
  if(window.aion_save) window.aion_save();
}
document.getElementById('lumine_cycle')?.addEventListener('click', lumine_cycle_solar);
document.getElementById('lumine_tema')?.addEventListener('click', lumine_cycle_solar);

document.getElementById('lumine_auto')?.addEventListener('click', ()=>{
  const h = new Date().getHours();
  const mode = (h >= 6 && h < 12) ? 'lumine-mode-day'
             : (h >= 12 && h < 18) ? 'lumine-mode-sunset'
             : 'lumine-mode-night';
  document.body.classList.remove('lumine-mode-day','lumine-mode-sunset','lumine-mode-night');
  document.body.classList.add(mode);
  const el = document.getElementById('lumine_status');
  if(el) el.textContent = 'AUTO · ' + mode.replace('lumine-mode-','').toUpperCase();
  window.pulse_toast('Auto 🕒 ' + mode);
  if(window.aion_save) window.aion_save();
});

/* ─── inputs serena ─── */
const serena_userid = document.getElementById('serena_userid');
if(serena_userid){
  serena_userid.addEventListener('input', ()=>{ if(window.aion_save) window.aion_save(); });
}
const kodux_model = document.getElementById('kodux_model');
if(kodux_model){
  kodux_model.addEventListener('input', ()=>{ if(window.aion_save) window.aion_save(); });
}

/* ─── handlers ─── */
document.getElementById('genus_menu')?.addEventListener('click',
  ()=>window.lumine_toggle_drawer('lumine_cockpit'));
document.getElementById('kobllux_orbtoggle')?.addEventListener('click',
  ()=>window.lumine_toggle_drawer('lumine_cockpit'));
document.getElementById('pulse_notif')?.addEventListener('click',
  ()=>window.pulse_toast('Sem notificações'));

/* ─── boot ─── */
window.serena_apply_bg();
console.log('[lumine-cockpit] online · LUMINE acendeu o painel');
})();