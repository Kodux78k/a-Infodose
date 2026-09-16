/* ═══════════════════════════════════════════════════════════
   §C · DIALOGUE · vitalis-diálogo · O Motor ALFA⇄BETA
   Arquétipo: VITALIS · Prefixo: vitalis_
   Depende: vd-arquétipos, bllue-vozes, aion-store
   ═══════════════════════════════════════════════════════════ */
(function(){
"use strict";
const dv_q = s => document.querySelector(s);

const nova_src     = dv_q("#nova_source");
const pulse_conv   = dv_q("#pulse_conv");
const aion_cnt     = dv_q("#aion_counter");
const vitalis_round = dv_q("#vitalis_round");
const kodux_bank   = dv_q("#kodux_bank");
const kodux_bankinfo = dv_q("#kodux_bankinfo");
const pulse_chat   = dv_q("#pulse_chat");

/* ─── estado ─── */
const kd_state = {
  units: [], index: 0, cycle: 0, history: [],
  bank: {prepositions:[], connectors:[], pronouns:[], articles:[], verbs:[], words:[], questions:[]}
};
let rt_generating = false;
let rt_speaking = false;
let rt_speakidx = 0;

/* ─── normalizadores ─── */
function kodux_norm(t){
  return String(t||"").replace(/\r\n/g,"\n").replace(/\r/g,"\n")
    .replace(/[ \t]+/g," ").replace(/\n{3,}/g,"\n\n").trim();
}

function artemis_split(text){
  text = kodux_norm(text);
  if(!text) return [];
  return text.split(/(?<=[.!?;:])\s+|\n+/).map(x=>x.trim()).filter(Boolean)
    .map((t,i)=>({id:i, text:t, type: t.includes("?") ? "question" : "statement"}));
}

/* ─── stopwords ─── */
const dv_preps = new Set("a ante após até com contra de desde em entre para per perante por sem sob sobre trás ao aos à às do dos da das no nos na nas pelo pelos pela pelas".split(" "));
const dv_conns = new Set("e ou mas porém contudo todavia porque portanto então assim logo embora enquanto quando como se caso que também ainda já nem pois além antes depois".split(" "));
const dv_prons = new Set("eu tu ele ela nós vos eles elas me te se nos vos lhe lhes isso isto aquilo esse essa este esta aquele aquela quem que qual quais algo nada tudo ninguém alguém".split(" "));
const dv_arts  = new Set("o a os as um uma uns umas".split(" "));
const dv_stop  = new Set([...dv_preps, ...dv_conns, ...dv_prons, ...dv_arts]);

/* ─── extração de banco ─── */
function kodux_words(text){
  return kodux_norm(text).toLowerCase().normalize("NFD")
    .replace(/[\u0300-\u036f]/g,"")
    .match(/[a-zA-ZÀ-ÿ]+(?:[-'][a-zA-ZÀ-ÿ]+)*/g) || [];
}

function kodux_is_verb(w){
  if(w.length<4) return false;
  return /(?:ar|er|ir)$/.test(w) || /(?:ou|ei|iu|ava|ia|aram|eram|iram|ando|endo|indo)$/.test(w)
    || ["é","ser","sou","são","tem","tenho","há","pode","podem","deve","devem","faz","fazem",
        "vai","vão","foi","foram","era","eram","está","estão","existe","existem"].includes(w);
}

function kodux_extract(text){
  const u = [...new Set(kodux_words(text))];
  kd_state.bank = {
    prepositions: u.filter(x=>dv_preps.has(x)),
    connectors:   u.filter(x=>dv_conns.has(x)),
    pronouns:     u.filter(x=>dv_prons.has(x)),
    articles:     u.filter(x=>dv_arts.has(x)),
    verbs:        u.filter(x=>kodux_is_verb(x)),
    words:        u.filter(x=>x.length>=4 && !dv_stop.has(x)),
    questions:    artemis_split(text).filter(x=>x.type==="question").map(x=>x.text),
  };
  genus_render_bank();
}

/* ─── pickers ─── */
function kodux_pick(l){ return l && l.length ? l[Math.floor(Math.random()*l.length)] : ""; }
function kodux_word(){ return kodux_pick(kd_state.bank.words); }
function kodux_prep(){ return kodux_pick(kd_state.bank.prepositions); }
function kodux_conn(){ return kodux_pick(kd_state.bank.connectors); }
function kodux_clean(t){ return String(t).replace(/[!?]+/g,"").replace(/[.]+$/,"").trim(); }
function kodux_lower1(t){ return t.charAt(0).toLowerCase() + t.slice(1); }

/* ─── geração ALFA/BETA ─── */
function serena_invert(text){
  const c = kodux_clean(text); if(!c) return "Existe outro lado dessa ideia.";
  const low = c.toLowerCase();
  if(/\bnão\b/.test(low)){
    const pos = c.replace(/\bnão\b/ig,"").replace(/\s{2,}/g," ").trim();
    return "Então existe a possibilidade de " + kodux_lower1(pos) + ".";
  }
  if(/\b(sim|é|existe|há|pode|deve)\b/i.test(low))
    return "Mas também podemos considerar que não " + kodux_lower1(c) + ".";
  const w = kodux_word(), p = kodux_prep();
  if(w && p) return "O outro polo observa " + p + " " + w + " e propõe o contrário de " + kodux_lower1(c) + ".";
  return "O outro lado propõe o contrário de " + kodux_lower1(c) + ".";
}

function artemis_reverse(text){
  const c = kodux_clean(text); const low = c.toLowerCase();
  if(/^o que\b/.test(low))    return "E o que acontece depois disso?";
  if(/^como\b/.test(low))     return "E por que isso acontece dessa maneira?";
  if(/^por que\b/.test(low))  return "E o que faria isso acontecer?";
  if(/^quando\b/.test(low))   return "E o que acontece antes disso?";
  if(/^onde\b/.test(low))     return "E o que existe além desse lugar?";
  if(/^quem\b/.test(low))     return "E quem responde por isso?";
  if(/^qual\b/.test(low))     return "E qual seria a possibilidade contrária?";
  const w = kodux_word(), p = kodux_prep();
  if(w && p) return "E se " + p + " " + w + " essa ideia pudesse ser vista de outro modo?";
  return "E se " + kodux_lower1(c) + " pudesse ser visto de outra maneira?";
}

function jesus_about(text){
  const c = kodux_clean(text), w = kodux_word(), cn = kodux_conn();
  if(w && cn) return "Eu afirmo que " + kodux_lower1(c) + ", " + cn + " " + w + " permanece dentro da questão.";
  return "Eu afirmo que " + kodux_lower1(c) + " merece continuar sendo observado.";
}

function jesus_answer(q){
  const c = kodux_clean(q), w = kodux_word(), p = kodux_prep();
  if(w && p) return "Eu respondo afirmando que " + kodux_lower1(c) + " pode ser compreendido " + p + " " + w + ".";
  return "Eu respondo afirmando que " + kodux_lower1(c) + " já contém uma possibilidade de resposta.";
}

/* ─── ciclo arquétipico 5-3-6-9-7 ─── */
const vd_pat = [5,3,6,9,7];
let rt_patidx = 0;

function aion_next_arch(){
  const list = window.kd_order;
  const i = list.indexOf(window.jesus_arch());
  const step = vd_pat[rt_patidx++ % vd_pat.length];
  return list[(i+step) % list.length];
}

function kodux_arch_color(name){
  const map = window.kd_arch_map;
  if(!map || !map[name]) return "var(--vd-active-color)";
  return `var(${map[name].tok})`;
}

/* ─── o ciclo vital ─── */
function vitalis_cycle(){
  if(!kd_state.units.length) kd_state.units = artemis_split(nova_src.value);
  if(!kd_state.units.length){ window.pulse_toast("Insira um texto primeiro."); return false; }

  const arch = aion_next_arch();
  const seed = kd_state.units[kd_state.index % kd_state.units.length];
  kd_state.index++;

  const alpha = seed.type==="question" ? jesus_answer(seed.text) : jesus_about(seed.text);
  pulse_push("alpha", alpha, seed.type==="question" ? "resposta" : "semente", arch);

  const betaInv = serena_invert(alpha);       pulse_push("beta", betaInv, "inversa", arch);
  const betaQ   = artemis_reverse(betaInv);   pulse_push("beta", betaQ, "pergunta", arch);
  const alphaF  = jesus_answer(betaQ);        pulse_push("alpha", alphaF, "afirmação", arch);

  kd_state.cycle++;
  if(vitalis_round) vitalis_round.textContent = kd_state.cycle + (kd_state.cycle===1 ? " ciclo" : " ciclos");
  artemis_update_dots();
  window.jesus_apply(arch);
  if(window.__sbSync) window.__sbSync(arch);
  if(window.aion_save) window.aion_save();
  return true;
}

function pulse_push(role, text, type, arch){
  const item = {role, text, type, arch, ts:Date.now()};
  kd_state.history.push(item);
  genus_render_msg(item, kd_state.history.length - 1);
  genus_scroll_chat();
}

function genus_scroll_chat(){
  if(!pulse_chat) return;
  const nearBottom = (pulse_chat.scrollHeight - pulse_chat.scrollTop - pulse_chat.clientHeight) < 200;
  if(nearBottom) requestAnimationFrame(()=>{ pulse_chat.scrollTop = pulse_chat.scrollHeight; });
}

function genus_force_scroll(){
  if(!pulse_chat) return;
  requestAnimationFrame(()=>{ pulse_chat.scrollTop = pulse_chat.scrollHeight; });
}

/* ─── render de mensagem ─── */
function genus_render_msg(item, idx){
  const el = document.createElement("article");
  el.className = "pulse_message " + item.role;
  el.dataset.arch = item.arch;
  el.dataset.idx = idx;
  el.style.setProperty("--pulse-arch-color", kodux_arch_color(item.arch));

  const who = item.role === "alpha" ? "α ALFA" : "β BETA";
  const chip = `<span class="kobllux_arch-chip"><i></i>${item.arch}</span>`;

  el.innerHTML = `
    <div class="pulse_msg-top">
      <span class="pulse_msg-who">${who}</span>
      ${chip}
      <span class="pulse_msg-type">${item.type}</span>
    </div>
    <div class="pulse_msg-text"></div>
    <div class="pulse_msg-actions">
      <button class="pulse_msg-mini" data-act="speak">◉ OUVIR</button>
      <button class="pulse_msg-mini" data-act="copy">⧉ COPIAR</button>
      <button class="pulse_msg-mini solus_slicer" data-act="slicer">→ SLICER</button>
    </div>`;
  el.querySelector(".pulse_msg-text").textContent = item.text;

  const spk = el.querySelector('[data-act="speak"]');
  let rt_lp = null, rt_lpFired = false;
  spk.addEventListener("pointerdown", e => {
    e.preventDefault(); rt_lpFired = false;
    rt_lp = setTimeout(()=>{
      rt_lpFired = true;
      bllue_speak_single(item.text, el);
      if(navigator.vibrate) try{navigator.vibrate(12)}catch(_){}
    }, 500);
  });
  spk.addEventListener("pointerup", ()=>{ clearTimeout(rt_lp); if(!rt_lpFired) bllue_speak_from(idx); });
  spk.addEventListener("pointerleave", ()=>clearTimeout(rt_lp));
  spk.addEventListener("pointercancel", ()=>clearTimeout(rt_lp));
  spk.addEventListener("contextmenu", e=>e.preventDefault());

  el.querySelector('[data-act="copy"]').addEventListener("click", async()=>{
    try{ await navigator.clipboard.writeText(item.text); window.pulse_toast("Copiado ✓"); }catch(_){}
  });

  el.querySelector('[data-act="slicer"]').addEventListener("click", ()=>{
    const header = `# ${who} · ${item.arch}\n_${item.type}_\n\n`;
    window.solus_nebula && window.solus_nebula.loadDocument(header + item.text, `${who} · ${item.arch}`);
    window.pulse_toast("Enviado ✓");
    document.getElementById('solus_sec')?.scrollIntoView({behavior:'smooth', block:'start'});
  });

  pulse_conv.appendChild(el);
}

/* ─── render banco lexical ─── */
function genus_render_bank(){
  if(!kodux_bank) return;
  const b = kd_state.bank;
  const all = [...b.prepositions, ...b.connectors, ...b.pronouns, ...b.articles, ...b.verbs, ...b.words];
  const tok = (arr, cls) => arr.map(x=>`<span class="kodux_token ${cls}">${x}</span>`).join("");
  kodux_bank.innerHTML =
    tok(b.prepositions,"kodux_token-prep") +
    tok(b.connectors,"kodux_token-conn") +
    tok(b.pronouns,"kodux_token-pron") +
    tok(b.articles,"kodux_token-word") +
    tok(b.verbs,"kodux_token-word") +
    tok(b.words,"kodux_token-word");
  if(kodux_bankinfo) kodux_bankinfo.textContent = all.length + " elementos";
}

function artemis_update_dots(){
  document.querySelectorAll(".artemis_navdot").forEach((d,i)=>d.classList.toggle("on", i === kd_state.cycle % 3));
}

/* ─── voz ─── */
function bllue_speak_single(text, el){
  if(!("speechSynthesis" in window)){ window.pulse_toast("Áudio indisponível"); return; }
  speechSynthesis.cancel(); rt_speaking = false;
  document.querySelectorAll(".pulse_message.playing").forEach(x=>x.classList.remove("playing"));
  if(el) el.classList.add("playing");
  const arch = el?.dataset.arch || window.jesus_arch();
  const u = window.bllue_voice.forArch(arch, text);
  const orb = document.getElementById("kobllux_orb");
  if(orb) orb.classList.add("speaking");
  u.onend = u.onerror = ()=>{
    if(el) el.classList.remove("playing");
    if(orb) orb.classList.remove("speaking");
  };
  speechSynthesis.speak(u);
  window.pulse_toast(`🎙 ${arch} · bloco`);
}

function bllue_speak_from(startIdx){
  if(!("speechSynthesis" in window)){ window.pulse_toast("Áudio indisponível"); return; }
  if(!kd_state.history.length){ window.pulse_toast("Gere a conversa primeiro"); return; }
  speechSynthesis.cancel();
  document.querySelectorAll(".pulse_message.playing").forEach(x=>x.classList.remove("playing"));
  rt_speaking = true; rt_speakidx = startIdx;
  const orb = document.getElementById("kobllux_orb");
  if(orb) orb.classList.add("speaking");
  bllue_speak_next();
}

function bllue_speak_all(){ bllue_speak_from(0); }

function bllue_speak_next(){
  if(!rt_speaking || rt_speakidx >= kd_state.history.length){
    rt_speaking = false;
    const orb = document.getElementById("kobllux_orb");
    if(orb) orb.classList.remove("speaking");
    return;
  }
  const item = kd_state.history[rt_speakidx];
  const el = pulse_conv.querySelectorAll(".pulse_message")[rt_speakidx];
  if(el){
    el.classList.add("playing");
    el.scrollIntoView({behavior:"smooth", block:"center"});
    window.jesus_apply(item.arch);
  }
  const u = window.bllue_voice.forArch(item.arch, item.text);
  u.onend = u.onerror = ()=>{
    if(el) el.classList.remove("playing");
    rt_speakidx++;
    bllue_speak_next();
  };
  speechSynthesis.speak(u);
}

function solus_stop_speech(){
  rt_speaking = false;
  if("speechSynthesis" in window) speechSynthesis.cancel();
  document.querySelectorAll(".pulse_message.playing").forEach(x=>x.classList.remove("playing"));
  const orb = document.getElementById("kobllux_orb");
  if(orb) orb.classList.remove("speaking");
}

/* ─── listeners ─── */
document.getElementById("vitalis_step")?.addEventListener("click", async ()=>{
  if(rt_generating) return;
  if(!kd_state.bank.words.length) kodux_extract(nova_src.value);
  if(!kd_state.units.length) kd_state.units = artemis_split(nova_src.value);
  if(!kd_state.units.length){ window.pulse_toast("Insira um texto primeiro."); return; }
  rt_generating = true;
  try{
    const N = 15;
    for(let i=0;i<N;i++){ vitalis_cycle(); await new Promise(r=>setTimeout(r, 60)); }
    window.pulse_toast(`${N} ciclos gerados ⇄`);
    genus_force_scroll();
  } finally { rt_generating = false; }
});

document.getElementById("vitalis_navstep")?.addEventListener("click", ()=>{
  document.getElementById("vitalis_step")?.click();
});

document.getElementById("nova_generate")?.addEventListener("click", nova_generate_all);

async function nova_generate_all(){
  if(rt_generating) return;
  const units = artemis_split(nova_src.value);
  if(!units.length){ window.pulse_toast("Cole um texto"); nova_src.focus(); return; }
  kodux_extract(nova_src.value);
  kd_state.units = units;
  kd_state.index = 0;
  kd_state.cycle = 0;
  kd_state.history = [];
  pulse_conv.innerHTML = "";
  rt_generating = true;
  try{
    const total = units.length;
    for(let i=0;i<total;i++){
      vitalis_cycle();
      await new Promise(r=>setTimeout(r, 45));
    }
    window.pulse_toast(`${total} ciclos gerados ✓`);
    genus_force_scroll();
  } finally { rt_generating = false; }
}

document.getElementById("kodux_parse")?.addEventListener("click", ()=>{
  const u = artemis_split(nova_src.value);
  if(!u.length){ window.pulse_toast("Nenhum texto"); return; }
  kd_state.units = u;
  kd_state.index = 0;
  kodux_extract(nova_src.value);
  window.pulse_toast(u.length + " unidades · banco criado ✓");
});

document.getElementById("rhea_paste")?.addEventListener("click", async ()=>{
  try{
    const t = await navigator.clipboard.readText();
    if(!t){ window.pulse_toast("Clipboard vazio"); return; }
    nova_src.value = t;
    nova_update_counter();
    document.getElementById("kodux_parse")?.click();
    window.pulse_toast("Colado ✓");
  }catch(_){ window.pulse_toast("Use colar do sistema"); }
});

document.getElementById("bllue_listen")?.addEventListener("click", bllue_speak_all);

function nova_update_counter(){
  if(!aion_cnt) return;
  const n = nova_src.value.length;
  aion_cnt.textContent = n + (n===1 ? " caractere" : " caracteres");
}
nova_src?.addEventListener("input", nova_update_counter);

if(nova_src && !nova_src.value){
  nova_src.value = `Uma ideia começa pequena.
Ela encontra outra ideia?
Quando duas ideias conversam, algo muda.
O futuro precisa ser diferente?
Talvez a resposta esteja na própria pergunta.`;
  nova_update_counter();
}

/* ─── importação de arquivo fonte ─── */
const artemis_imgsrc = document.getElementById('artemis_imgsrc');
const artemis_btn_imp = document.getElementById('artemis_btn');
if(artemis_btn_imp && artemis_imgsrc){
  artemis_btn_imp.addEventListener('click', ()=>artemis_imgsrc.click());
  artemis_imgsrc.addEventListener('change', async (e)=>{
    const f = e.target.files[0]; if(!f) return;
    try{
      const txt = await f.text();
      nova_src.value = txt;
      nova_update_counter();
      const u = artemis_split(txt);
      kd_state.units = u;
      kd_state.index = 0;
      kodux_extract(txt);
      window.pulse_toast(`Importado: ${f.name} ✓`);
    }catch(err){ window.pulse_toast("Falha ao ler"); }
    artemis_imgsrc.value = "";
  });
}

/* ─── envio ao slicer ─── */
const solus_send = document.getElementById('solus_send');
if(solus_send){
  solus_send.addEventListener('click', ()=>{
    const txt = nova_src.value.trim();
    if(!txt){ window.pulse_toast("Nada para enviar"); return; }
    window.solus_nebula && window.solus_nebula.loadDocument(txt, "Polo");
    window.pulse_toast("Enviado ✓");
    document.getElementById('solus_sec')?.scrollIntoView({behavior:'smooth'});
  });
}

const solus_all = document.getElementById('solus_all');
if(solus_all){
  solus_all.addEventListener('click', ()=>{
    if(!kd_state.history.length){ window.pulse_toast("Sem conversa"); return; }
    const md = kd_state.history.map(m=>{
      const who = m.role === "alpha" ? "ALFA" : "BETA";
      return `# ${who} · ${m.arch}\n_${m.type}_\n\n${m.text}`;
    }).join("\n\n---\n\n");
    window.solus_nebula && window.solus_nebula.loadDocument(md, "Conversa");
    window.pulse_toast("Enviado ✓");
    document.getElementById('solus_sec')?.scrollIntoView({behavior:'smooth'});
  });
}

/* ─── exports ─── */
window.vitalis_state = kd_state;
window.bllue_actions = {
  speak: bllue_speak_all,
  speakFrom: bllue_speak_from,
  stop: solus_stop_speech
};

window.aion_rebuild_dialogue = function(saved){
  if(!saved || !saved.history || !saved.history.length) return;
  kd_state.units = saved.units || [];
  kd_state.index = saved.index || 0;
  kd_state.cycle = saved.cycle || 0;
  kd_state.history = saved.history || [];
  kd_state.bank = saved.bank || kd_state.bank;
  pulse_conv.innerHTML = "";
  kd_state.history.forEach((item, i)=>genus_render_msg(item, i));
  if(vitalis_round) vitalis_round.textContent = kd_state.cycle + (kd_state.cycle===1 ? " ciclo" : " ciclos");
  if(saved.sourceText){ nova_src.value = saved.sourceText; nova_update_counter(); }
  genus_render_bank();
  genus_force_scroll();
};

console.log('[vitalis-diálogo] online · motor ALFA⇄BETA pronto');
})();