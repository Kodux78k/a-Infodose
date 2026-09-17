/* ═══════════════════════════════════════════════════════════
   §D · SYMBOLBAR · atlas-symbolbar · A Barra dos 16
   Arquétipo: ATLAS · Prefixo: atlas_
   Depende: vd-arquétipos, vitalis-diálogo, aion-save
   ═══════════════════════════════════════════════════════════ */
(function(){
"use strict";
const dv_q  = s => document.querySelector(s);
const dv_qa = s => [...document.querySelectorAll(s)];

/* ─── loader · hide + watchdog + safety ─── */
(function nova_loader_watchdog(){
  const NOVA_LOADER = document.getElementById("nova_loader");
  if(!NOVA_LOADER) return;

  let rt_hidden = false;

  function nova_loader_hide(){
    if(rt_hidden) return;
    rt_hidden = true;
    NOVA_LOADER.classList.add("hide");
    NOVA_LOADER.classList.add("kobllux_oculto");
    NOVA_LOADER.setAttribute("aria-hidden", "true");
    NOVA_LOADER.style.pointerEvents = "none";
    console.log("[nova_loader] escondido em", Date.now());
  }

  /* 1 · assim que o DOM respirar */
  if(document.readyState === "complete" || document.readyState === "interactive"){
    setTimeout(nova_loader_hide, 600);
  } else {
    document.addEventListener("DOMContentLoaded",
      ()=>setTimeout(nova_loader_hide, 600), {once:true});
  }

  /* 2 · no load da janela */
  window.addEventListener("load",
    ()=>setTimeout(nova_loader_hide, 400), {once:true});

  /* 3 · watchdog absoluto — 4s e sai, aconteça o que acontecer */
  setTimeout(nova_loader_hide, 4000);

  /* 4 · se o usuário clicar, some na hora */
  NOVA_LOADER.addEventListener("click", nova_loader_hide, {once:true});
})();

/* ─── progress bar ─── */
function aion_progress(){
  const doc = document.documentElement;
  const w = window.scrollY / (doc.scrollHeight - window.innerHeight);
  const el = document.getElementById("aion_progress");
  if(el) el.style.width = (w*100) + "%";
}
let rt_ticking = false;
window.addEventListener("scroll", ()=>{
  if(!rt_ticking){
    requestAnimationFrame(()=>{ aion_progress(); rt_ticking = false; });
    rt_ticking = true;
  }
}, {passive:true});
aion_progress();

/* ─── reveal observer ─── */
const artemis_io = new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      e.target.classList.add("in");
      const idx = dv_qa(".genus_section").indexOf(e.target);
      if(idx >= 0) dv_qa(".artemis_navdot").forEach((d,i)=>d.classList.toggle("on", i===idx));
    }
  });
}, {threshold: 0.15});
dv_qa(".nova_reveal").forEach(el=>artemis_io.observe(el));

/* ─── SymbolBar ─── */
const kd_order     = window.kd_order || [];
const kd_arch_map  = window.kd_arch_map || {};
const kobllux_bar  = dv_q("#kobllux_symbar");
const kobllux_car  = dv_q("#kobllux_carousel");
const kobllux_trk  = dv_q("#kobllux_track");
const kobllux_dots = dv_q("#kobllux_dots");
const kobllux_orb  = dv_q("#kobllux_orb");
const kodux_grip   = dv_q("#kodux_grip");
let kd_sbIdx = 0;

function genus_build_sb(){
  if(!kobllux_trk || !kobllux_dots) return;
  kobllux_trk.innerHTML = ""; kobllux_dots.innerHTML = "";
  kd_order.forEach((name, i)=>{
    const a = kd_arch_map[name] || {sym:"∆", op:"0x00", tok:"--vd-KBLX_B", hz:432};
    const btn = document.createElement("button");
    btn.className = "kobllux_btn";
    btn.textContent = a.sym;
    btn.dataset.arch = name;
    btn.style.setProperty("--kobllux-btn-c", `var(${a.tok})`);
    btn.title = `${name} · ${a.hz}Hz`;
    btn.addEventListener("click", ()=>{
      kd_sbIdx = i;
      kodux_center_sb(true);
      window.jesus_apply(name);
      const r = btn.getBoundingClientRect();
      window.pulse_ripple(
        (r.left+r.width/2)/window.innerWidth*100,
        (r.top+r.height/2)/window.innerHeight*100
      );
    });
    kobllux_trk.appendChild(btn);

    const dot = document.createElement("span");
    dot.className = "kobllux_dot" + (i===0 ? " on" : "");
    dot.addEventListener("click", ()=>{
      kd_sbIdx = i; kodux_center_sb(true); window.jesus_apply(name);
    });
    kobllux_dots.appendChild(dot);
  });
}

function kodux_center_sb(useScroll){
  if(!kobllux_trk || !kobllux_car) return;
  const btn = kobllux_trk.children[kd_sbIdx]; if(!btn) return;
  [...kobllux_dots.children].forEach((d,i)=>d.classList.toggle("on", i===kd_sbIdx));
  [...kobllux_trk.children].forEach((b,i)=>b.classList.toggle("on", i===kd_sbIdx));
  if(useScroll){
    const top = btn.offsetTop - (kobllux_car.clientHeight - btn.offsetHeight)/2;
    kobllux_car.scrollTo({top: Math.max(0, top), behavior:'smooth'});
  }
}

window.__sbSync = function(name){
  const i = kd_order.indexOf(name);
  if(i >= 0){ kd_sbIdx = i; kodux_center_sb(true); }
};

if(kobllux_car){
  let rt_scrollt = null;
  kobllux_car.addEventListener('scroll', ()=>{
    clearTimeout(rt_scrollt);
    rt_scrollt = setTimeout(()=>{
      const center = kobllux_car.scrollTop + kobllux_car.clientHeight/2;
      let best = 0, bestDist = Infinity;
      [...kobllux_trk.children].forEach((b,i)=>{
        const bc = b.offsetTop + b.offsetHeight/2;
        const d = Math.abs(bc - center);
        if(d < bestDist){ bestDist = d; best = i; }
      });
      if(best !== kd_sbIdx){
        kd_sbIdx = best;
        [...kobllux_dots.children].forEach((d,i)=>d.classList.toggle("on", i===kd_sbIdx));
        [...kobllux_trk.children].forEach((b,i)=>b.classList.toggle("on", i===kd_sbIdx));
      }
    }, 80);
  }, {passive:true});
}

/* ─── collapse ─── */
dv_q("#kodux_toggle")?.addEventListener("click", (e)=>{
  e.stopPropagation();
  const c = kobllux_bar.classList.toggle("collapsed");
  dv_q("#kodux_toggle").textContent = c ? "▼" : "▲";
  if(!c) setTimeout(()=>kodux_center_sb(false), 150);
});

/* ─── ORB · ciclo 5-3-6-9-7 ─── */
let rt_press = null, rt_longfired = false, rt_orbpat = 0;
const vd_orbpat = [5,3,6,9,7];

function aion_orb_cycle(){
  const list = window.kd_order || []; if(!list.length) return;
  const step = vd_orbpat[rt_orbpat++ % vd_orbpat.length];
  const cur  = list.indexOf(window.jesus_arch());
  const next = list[(cur+step) % list.length];
  const r = kobllux_orb.getBoundingClientRect();
  window.jesus_apply(next, {
    x: (r.left+r.width/2)/window.innerWidth*100,
    y: (r.top+r.height/2)/window.innerHeight*100
  });
  window.__sbSync(next);
  window.pulse_toast(`∆³ ${next} · +${step}`);
}

kobllux_orb?.addEventListener("pointerdown", (e)=>{
  e.preventDefault(); rt_longfired = false;
  const r = kobllux_orb.getBoundingClientRect();
  window.pulse_ripple(
    (r.left+r.width/2)/window.innerWidth*100,
    (r.top+r.height/2)/window.innerHeight*100
  );
  rt_press = setTimeout(()=>{
    rt_longfired = true;
    kobllux_open_wheel();
    if(navigator.vibrate) try{navigator.vibrate(15)}catch(_){}
  }, 800);
});
kobllux_orb?.addEventListener("pointerup", ()=>{
  clearTimeout(rt_press);
  if(!rt_longfired) aion_orb_cycle();
});
kobllux_orb?.addEventListener("pointerleave", ()=>clearTimeout(rt_press));
kobllux_orb?.addEventListener("pointercancel", ()=>clearTimeout(rt_press));
kobllux_orb?.addEventListener("contextmenu", e=>e.preventDefault());

/* ─── drag ─── */
let rt_dragging = false, rt_sx = 0, rt_sy = 0, rt_ox = 0, rt_oy = 0;
function kodux_clamp(v,a,b){ return Math.max(a, Math.min(b, v)); }
function kodux_clearsnap(){
  kobllux_bar.classList.remove("snap-left","snap-right","snap-top","snap-bottom");
}

kodux_grip?.addEventListener("pointerdown", (e)=>{
  e.preventDefault(); e.stopPropagation();
  kodux_clearsnap();
  rt_dragging = true;
  rt_sx = e.clientX; rt_sy = e.clientY;
  const r = kobllux_bar.getBoundingClientRect();
  rt_ox = r.left; rt_oy = r.top;
  kobllux_bar.style.transform = "none";
  kobllux_bar.style.top = rt_oy + "px";
  kobllux_bar.style.left = rt_ox + "px";
  kobllux_bar.style.right = "auto";
  kobllux_bar.style.bottom = "auto";
  kobllux_bar.classList.add("kodux_is-dragging");
  try{ kodux_grip.setPointerCapture(e.pointerId); }catch(_){}
});

kodux_grip?.addEventListener("pointermove", (e)=>{
  if(!rt_dragging) return;
  kobllux_bar.style.left = (rt_ox + e.clientX - rt_sx) + "px";
  kobllux_bar.style.top  = (rt_oy + e.clientY - rt_sy) + "px";
});

function kodux_enddrag(e){
  if(!rt_dragging) return;
  rt_dragging = false;
  kobllux_bar.classList.remove("kodux_is-dragging");
  const vw = window.innerWidth, vh = window.innerHeight;
  const r  = kobllux_bar.getBoundingClientRect();
  const cx = r.left + r.width/2;
  kodux_clearsnap();
  const headerH = 44 + 44 + 12;
  const nearTop = r.top < 100, nearBottom = r.bottom > vh - 100, nearLeft = cx < vw/2;
  if(nearTop){
    kobllux_bar.classList.add("snap-top");
    kobllux_bar.style.top = ""; kobllux_bar.style.bottom = "auto";
    kobllux_bar.style.left = ""; kobllux_bar.style.right = "8px";
    kobllux_bar.style.transform = "";
  } else if(nearBottom){
    kobllux_bar.classList.add("snap-bottom");
    kobllux_bar.style.top = "auto"; kobllux_bar.style.bottom = "";
    kobllux_bar.style.left = ""; kobllux_bar.style.right = "8px";
    kobllux_bar.style.transform = "";
  } else {
    const safeY = kodux_clamp(r.top, headerH, vh - r.height - 80);
    kobllux_bar.style.top = safeY + "px";
    kobllux_bar.style.bottom = "auto";
    kobllux_bar.style.transform = "";
    if(nearLeft){
      kobllux_bar.classList.add("snap-left");
      kobllux_bar.style.left = "0"; kobllux_bar.style.right = "auto";
    } else {
      kobllux_bar.classList.add("snap-right");
      kobllux_bar.style.right = "0"; kobllux_bar.style.left = "auto";
    }
  }
  try{ kodux_grip.releasePointerCapture(e.pointerId); }catch(_){}
  if(window.aion_save) window.aion_save();
}
kodux_grip?.addEventListener("pointerup", kodux_enddrag);
kodux_grip?.addEventListener("pointercancel", kodux_enddrag);

/* ─── play/stop unificado ─── */
function bllue_unified_play(){
  const nb = window.solus_nebula;
  if(nb && nb.hasSlices && nb.hasSlices()){ nb.toggleSpeech(); return; }
  window.bllue_actions?.speak();
}
function solus_unified_stop(){
  const nb = window.solus_nebula;
  if(nb && nb.hasSlices && nb.hasSlices()){ nb.stopSpeech(); }
  window.bllue_actions?.stop();
  window.pulse_toast("Parado");
}
dv_q("#bllue_speak")?.addEventListener("click", bllue_unified_play);
dv_q("#solus_stop")?.addEventListener("click", solus_unified_stop);

/* ─── copy ─── */
dv_q("#rhea_copy")?.addEventListener("click", async ()=>{
  const st = window.vitalis_state || {};
  const hist = st.history || [];
  if(!hist.length){ window.pulse_toast("Sem conversa"); return; }
  const txt = hist.map(m=>`${m.role==="alpha"?"ALFA":"BETA"} [${m.arch}]: ${m.text}`).join("\n\n");
  try{ await navigator.clipboard.writeText(txt); window.pulse_toast("Copiado ✓"); }
  catch(_){
    const ta = document.createElement("textarea");
    ta.value = txt;
    document.body.appendChild(ta);
    ta.select();
    try{ document.execCommand("copy"); }catch(e){}
    ta.remove();
    window.pulse_toast("Copiado ✓");
  }
});

/* ─── clear ─── */
dv_q("#kaos_clear")?.addEventListener("click", ()=>{
  window.bllue_actions?.stop();
  const nb = window.solus_nebula;
  if(nb && nb.hasSlices && nb.hasSlices()) nb.clear();
  const st = window.vitalis_state;
  if(st){
    st.units = []; st.index = 0; st.cycle = 0; st.history = [];
    st.bank = {prepositions:[], connectors:[], pronouns:[], articles:[], verbs:[], words:[], questions:[]};
  }
  const conv = document.getElementById("pulse_conv");
  if(conv) conv.innerHTML = '<div class="solus_empty-msg">O diálogo ainda não nasceu.</div>';
  const lex = document.getElementById("kodux_bank");
  if(lex) lex.innerHTML = '<span style="color:var(--dv-DIM);font-size:11px">EXTRAIR BANCO para começar.</span>';
  const bi = document.getElementById("kodux_bankinfo");
  if(bi) bi.textContent = "aguardando";
  const rl = document.getElementById("vitalis_round");
  if(rl) rl.textContent = "0 ciclos";
  const src = document.getElementById("nova_source");
  if(src) src.value = "";
  const cnt = document.getElementById("aion_counter");
  if(cnt) cnt.textContent = "0 caracteres";
  window.pulse_toast("Sistema reiniciado ✓");
  if(window.aion_save) window.aion_save();
});

/* ─── download ─── */
dv_q("#aion_download")?.addEventListener("click", ()=>{
  const st = window.vitalis_state || {};
  const hist = st.history || [];
  if(!hist.length){ window.pulse_toast("Sem conversa"); return; }
  const txt = hist.map(m=>`${m.role==="alpha"?"ALFA":"BETA"} [${m.arch}]: ${m.text}`).join("\n\n");
  const payload = `KOBLLUX · ALFA⇄BETA · v13\n=========================\n\n${txt}\n\nGerado: ${new Date().toISOString()}`;
  const blob = new Blob([payload], {type:"text/plain;charset=utf-8"});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = `kobllux-${Date.now()}.txt`;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(()=>URL.revokeObjectURL(url), 1000);
  window.pulse_toast("Download ✓");
});

/* ─── roda dos 16 ─── */
const kobllux_wheel = dv_q("#kobllux_wheelin");
kd_order.forEach(name=>{
  const a = kd_arch_map[name] || {hz:432, sym:"∆", tok:"--vd-KBLX_B"};
  const chip = document.createElement("button");
  chip.className = "kobllux_pick";
  chip.style.color = `var(${a.tok})`;
  chip.innerHTML = `<div class="kobllux_a-orb" style="background:var(${a.tok})"></div><div class="kobllux_a-name">${name}</div><div class="kobllux_a-freq">${a.hz}Hz</div>`;
  chip.addEventListener("click", ()=>{
    const r = chip.getBoundingClientRect();
    window.jesus_apply(name, {
      x: (r.left+r.width/2)/window.innerWidth*100,
      y: (r.top+r.height/2)/window.innerHeight*100
    });
    kd_sbIdx = kd_order.indexOf(name);
    kodux_center_sb(true);
    kaos_close_wheel();
  });
  kobllux_wheel?.appendChild(chip);
});

function kobllux_open_wheel(){ dv_q("#kobllux_wheel")?.classList.add("open"); }
function kaos_close_wheel(){ dv_q("#kobllux_wheel")?.classList.remove("open"); }
window.kobllux_open_wheel = kobllux_open_wheel;
window.kaos_close_wheel   = kaos_close_wheel;

dv_q("#kobllux_wheel")?.addEventListener("click", e=>{
  if(e.target.id === "kobllux_wheel") kaos_close_wheel();
});
dv_q("#kaos_blclose")?.addEventListener("click", ()=>{
  dv_q("#aion_baulite")?.classList.remove("open");
});
document.addEventListener("keydown", e=>{
  if(e.key === "Escape") kaos_close_wheel();
});

/* ─── boot ─── */
genus_build_sb();
kobllux_bar?.classList.remove("collapsed");
const kodux_toggle = dv_q("#kodux_toggle");
if(kodux_toggle) kodux_toggle.textContent = "▲";
setTimeout(()=>kodux_center_sb(true), 150);

/* ─── import para slicer ─── */
const artemis_import = document.getElementById('artemis_import');
if(artemis_import){
  artemis_import.addEventListener('change', async (e)=>{
    const f = e.target.files[0]; if(!f) return;
    try{
      const txt = await f.text();
      window.solus_nebula?.loadDocument(txt, f.name);
      window.pulse_toast(`Slicer: ${f.name} ✓`);
      document.getElementById('solus_sec')?.scrollIntoView({behavior:'smooth'});
    }catch(err){ window.pulse_toast("Falha"); }
    artemis_import.value = "";
  });
}

/* ─── extras toggle ─── */
(function genus_extras_toggle(){
  const head = document.getElementById('kodux_extrashead');
  if(!head) return;
  try{
    if(localStorage.getItem('kobllux_sb_extras_hidden') === '1')
      kobllux_bar.classList.add('extras-hidden');
  }catch(_){}
  let rt_lp = null, rt_fired = false;
  head.addEventListener('pointerdown', ()=>{
    rt_fired = false;
    rt_lp = setTimeout(()=>{
      rt_fired = true;
      window.genus_open_factory?.();
      if(navigator.vibrate) try{navigator.vibrate(15)}catch(_){}
    }, 550);
  });
  head.addEventListener('pointerup', ()=>clearTimeout(rt_lp));
  head.addEventListener('pointerleave', ()=>clearTimeout(rt_lp));
  head.addEventListener('click', (e)=>{
    if(rt_fired){ e.stopPropagation(); rt_fired = false; return; }
    const hidden = kobllux_bar.classList.toggle('extras-hidden');
    try{ localStorage.setItem('kobllux_sb_extras_hidden', hidden ? '1' : '0'); }catch(_){}
    window.pulse_toast(hidden ? 'Extras ocultos' : 'Extras visíveis');
  });
})();

/* ─── header auto-hide ─── */
const atlas_header = document.getElementById('atlas_header');
let rt_lastY = 0, rt_ticking2 = false;
window.addEventListener('scroll', ()=>{
  if(rt_ticking2) return;
  requestAnimationFrame(()=>{
    const y = window.scrollY;
    if(y <= 10) atlas_header?.classList.remove('header-hidden');
    else if(y > rt_lastY + 8) atlas_header?.classList.add('header-hidden');
    else if(y < rt_lastY - 8) atlas_header?.classList.remove('header-hidden');
    rt_lastY = y; rt_ticking2 = false;
  });
  rt_ticking2 = true;
}, {passive:true});

/* ─── posição restore ─── */
window.__sbGetPos = function(){
  return {
    top: kobllux_bar.style.top,
    bottom: kobllux_bar.style.bottom,
    left: kobllux_bar.style.left,
    right: kobllux_bar.style.right,
    snap: [...kobllux_bar.classList].filter(c=>c.startsWith('snap-')),
    collapsed: kobllux_bar.classList.contains('collapsed'),
    extrasHidden: kobllux_bar.classList.contains('extras-hidden'),
    carouselHidden: kobllux_bar.classList.contains('carousel-hidden')
  };
};
window.__sbRestore = function(pos){
  if(!pos) return;
  if(pos.top) kobllux_bar.style.top = pos.top;
  if(pos.bottom) kobllux_bar.style.bottom = pos.bottom;
  if(pos.left) kobllux_bar.style.left = pos.left;
  if(pos.right) kobllux_bar.style.right = pos.right;
  if(pos.snap) pos.snap.forEach(c=>kobllux_bar.classList.add(c));
  if(pos.collapsed){
    kobllux_bar.classList.add('collapsed');
    const t = dv_q("#kodux_toggle");
    if(t) t.textContent = "▼";
  }
  if(pos.extrasHidden) kobllux_bar.classList.add('extras-hidden');
  if(pos.carouselHidden) kobllux_bar.classList.add('carousel-hidden');
};

console.log('[atlas-symbolbar] online · ATLAS construiu a barra');
})();