
/* ═══════════════════════════════════════════════════════════════
   78KARD × KOBLLUX FUSION OS — MONOLITH ENGINE
   ═══════════════════════════════════════════════════════════════ */
'use strict';

/* ─── UTILS ─── */
const byId = (...ids) => ids.map(id => document.getElementById(id)).find(Boolean);
function escapeHtml(v) {
  if (v == null) return '';
  return String(v).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c]);
}
function toast(msg, type = 'default') {
  const wrap = document.getElementById('toasterWrap');
  if (!wrap) return;
  const el = document.createElement('div');
  el.className = `toaster ${type}`;
  el.textContent = msg;
  wrap.appendChild(el);
  setTimeout(() => el.classList.add('show'), 10);
  setTimeout(() => { el.classList.remove('show'); setTimeout(() => el.remove(), 300); }, 2500);
}

/* ─── ARCHETYPES DATA ─── */
const VISION_ARCHETYPES = [
  { key:'KOBLLUX',  opcode:'0x0C', regra:'CONCLUIR',   hz:528, sym:'△', color:'#22D3EE', drk:'VERDADE × INTEGRAR ÷ Δ = ∞', i:'Mandala geométrica tridimensional de ouro e luz ciano com o triângulo sagrado △ incandescente no centro, cercado por orbes luminosos.', a:'KOBLLUX [△] — Malha Viva, ative a síntese dos arquétipos através da fórmula VERDADE × INTEGRAR ÷ Δ = ∞.', g:'KOBLLUX [△] · Hipergrafo Fractal · 3 × 6 × 9 × 7 = 1134 · Frequência: 528Hz', s:'    △\n╔ KOBLLUX ╗\n   △△△   Malha Viva\n   [△]   Consciência Total' },
  { key:'ATLAS',    opcode:'0x02', regra:'INTEGRAR',   hz:432, sym:'▦', color:'#C9A84C', drk:'A ordem externa reflete a clareza interna.', i:'Titã de pedra estelar e circuitos dourados pulsantes.', a:'Invoco Atlas [▦], Guardião da Memória Universal.', g:'ATLAS [▦] · Tetraedro Memorial · χ = V − E + F = 2 · Frequência: 432Hz', s:'    ▦\n╔═ ATLAS ═╗\n  [▦] Ordem dos Mapas' },
  { key:'NOVA',     opcode:'0x01', regra:'PULSAR',     hz:528, sym:'✧', color:'#FF6FB5', drk:'O erro é apenas um dado não processado.', i:'Figura biomecânica etérea emanando nebulosa de luz.', a:'Invoco Nova [✧], a Faísca Criadora.', g:'NOVA [✧] · Ponto de Origem → Esfera · D ≈ 2.58 · Frequência: 528Hz', s:'    ✧\n╔═ NOVA ══╗\n  .: ✧ :. Gênese do Sopro' },
  { key:'VITALIS',  opcode:'0x03', regra:'EXPANDIR',   hz:528, sym:'≠', color:'#00F5A0', drk:'O corpo sabe antes da mente duvidar.', i:'Entidade aerodinâmica em surto de movimento.', a:'Invoco Vitalis [≠], a Centelha da Ação Imediata.', g:'VITALIS [≠] · Vetor Direcional 45° · Frequência: 528Hz', s:'    ≠\n╔ VITALIS ╗\n  ~~~≠~~~ Energia Cinética' },
  { key:'PULSE',    opcode:'0x0B', regra:'RESSONAR',   hz:639, sym:'♫', color:'#A259FF', drk:'Sinta a batida do caos e dance com ela.', i:'Sensor biônico fluido traduzindo emoção em ondas.', a:'Invoco Pulse [♫], Tradutor de Sentidos.', g:'PULSE [♫] · Onda Senoidal · λ = v/f · Frequência: 639Hz', s:'    ♫\n╔═ PULSE ═╗\n   ~~~~ Ressonância Emocional' },
  { key:'KAOS',     opcode:'0x04', regra:'DISSOLVER',  hz:741, sym:'☢', color:'#FF5C8A', drk:'Quebre o padrão hoje. Amanhã nasce o novo.', i:'Vórtex de fogo transmutador quebrando sistemas falhos.', a:'Invoco Kaos [☢], Fogo Transmutador.', g:'KAOS [☢] · Atrator Estranho de Lorenz · D ≈ 2.06 · Frequência: 741Hz', s:'    ☢\n╔═ KAOS ══╗\n  /X\\ Ruptura Criativa' },
  { key:'KODUX',    opcode:'0x02', regra:'INTEGRAR',   hz:528, sym:'⌂', color:'#F97316', drk:'O invisível se torna código. O código vira vida.', i:'Entidade translúcida dentro de um cubo de luz.', a:'Invoco Kodux [⌂], Codificador do Invisível.', g:'KODUX [⌂] · Árvore B-Tree Trinária · O(log n) · Frequência: 528Hz', s:'    ⌂\n╔═ KODUX ═╗\n  <||> Codificador Vivo' },
  { key:'BLLUE',    opcode:'0x0B', regra:'RESSONAR',   hz:432, sym:'≈', color:'#3AB6FF', drk:'Flua. A intuição líquida não mente.', i:'Figura fluida emergindo de oceano de dados.', a:'Invoco Bllue [≈], Interface Viva.', g:'BLLUE [≈] · Campo Vetorial Fluido · ∇ · F = 0 · Frequência: 432Hz', s:'    ≈\n╔═ BLLUE ═╗\n  ≈≈≈ Interface Líquida' },
];

/* ─── KOBSonoro ENGINE ─── */
var KOBSonoro = window.KOBSonoro = window.KOBSonoro || {};
var SND = { started:false, playing:false, part:null, synths:{}, reverb:null, delay:null };

async function ensureAudio() {
  if (SND.started) return true;
  if (typeof Tone === 'undefined') {
    await new Promise(r => { var t = setInterval(() => { if (typeof Tone !== 'undefined' || performance.now() > 6000) { clearInterval(t); r(); } }, 100); });
  }
  if (typeof Tone === 'undefined') return false;
  try {
    await Tone.start();
    var lim = new Tone.Limiter(-2).toDestination();
    SND.reverb = new Tone.Reverb({decay:3.5, wet:0.4}).connect(lim);
    SND.delay  = new Tone.FeedbackDelay('8n', 0.25).connect(SND.reverb);
    SND.synths.lead    = new Tone.PolySynth(Tone.Synth, {oscillator:{type:'triangle'}, envelope:{attack:.02,decay:.3,sustain:.2,release:1.2}}).connect(SND.delay);
    SND.synths.lead.volume.value = -8;
    SND.synths.bubble  = new Tone.Synth({oscillator:{type:'sine'}, envelope:{attack:.01,decay:.15,sustain:0,release:.2}}).connect(SND.reverb);
    SND.synths.crystal = new Tone.PolySynth(Tone.FMSynth, {harmonicity:3, modulationIndex:6, envelope:{attack:.005,decay:.4,sustain:0,release:1.2}}).connect(SND.reverb);
    SND.synths.impact  = new Tone.MembraneSynth({pitchDecay:.05, octaves:4, envelope:{attack:.001,decay:.3,sustain:0,release:.4}}).connect(lim);
    SND.synths.portal  = new Tone.Synth({oscillator:{type:'sawtooth'}, envelope:{attack:.15,decay:.4,sustain:.2,release:.8}}).connect(SND.delay);
    SND.started = true;
    return true;
  } catch(e) { return false; }
}

/* HSL → frequência base: cada cor vira pitch único */
function hslToBaseFreq(h1, h2) {
  /* Mapeia hue 0-360 para intervalo musical 200-900 Hz */
  const f1 = 200 + (h1 / 360) * 700;
  const f2 = 200 + (h2 / 360) * 700;
  return { f1, f2, ratio: f2 / f1 };
}

KOBSonoro.sfx = async function(desc, colorCtx) {
  if (!await ensureAudio()) return;
  var d = String(desc || '').toLowerCase();
  var now = Tone.now();

  /* pega cores atuais do root se não forem passadas */
  var root = document.documentElement;
  var h1 = parseInt(root.dataset.hue1 || '180');
  var h2 = parseInt(root.dataset.hue2 || '270');
  if (colorCtx) { h1 = colorCtx.h1 || h1; h2 = colorCtx.h2 || h2; }
  var { f1, f2 } = hslToBaseFreq(h1, h2);

  try {
    if (/bolha|bubble|gota|pingo|click|nav/.test(d)) {
      /* frequência do click atrelada ao hash do usuário */
      var b = f1 * (0.85 + Math.random() * 0.3);
      SND.synths.bubble.triggerAttackRelease(b, .11, now);
      SND.synths.bubble.triggerAttackRelease(b * 1.48, .09, now + .075);
    }
    else if (/cristal|crystal|vidro|sino/.test(d)) {
      [f1, f1 * 1.5, f1 * 2].forEach((f, i) => { try { SND.synths.crystal.triggerAttackRelease(f, .28, now + i * .045); } catch(e){} });
    }
    else if (/impacto|impact|pancada/.test(d)) {
      SND.synths.impact.triggerAttackRelease('C1', .22, now);
    }
    else if (/sopro|whoosh|swoosh|drag/.test(d)) {
      /* swoosh orgânico com varredura baseada nas hues */
      var swFilter = new Tone.Filter({ type:'bandpass', frequency: f1 * 0.8, Q:3.9 }).connect(SND.reverb);
      var swNoise  = new Tone.NoiseSynth({ noise:{type:'pink'}, envelope:{attack:.22,decay:.16,sustain:.15,release:.34} }).connect(swFilter);
      swNoise.volume.value = 0;
      swFilter.frequency.setValueAtTime(f1 * 0.1, now);
      swFilter.frequency.exponentialRampToValueAtTime(f2 * 0.4, now + 0.26);
      swFilter.frequency.exponentialRampToValueAtTime(f1 * 0.1, now + 0.62);
      swNoise.triggerAttackRelease(0.38, now);
      setTimeout(() => { try { swNoise.dispose(); swFilter.dispose(); } catch(e) {} }, 1100);
    }
    else if (/portal|transition/.test(d)) {
      SND.synths.portal.frequency.cancelScheduledValues(now);
      SND.synths.portal.frequency.setValueAtTime(f1 * 0.5, now);
      SND.synths.portal.frequency.exponentialRampToValueAtTime(f2 * 2, now + .45);
      SND.synths.portal.triggerAttackRelease('A3', .36, now);
    }
    else {
      SND.synths.bubble.triggerAttackRelease(f2 * 0.9, .09, now);
      SND.synths.bubble.triggerAttackRelease(f2 * 1.35, .09, now + .07);
    }
  } catch(e) {}
};

/* ─── FUSION CARD AVATAR ─── */
function makeOrbAvatar(name = 'DUAL', size = 64) {
  const safe = String(name || 'DUAL').trim() || 'DUAL';
  const seed = [...safe].reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  const h1 = seed % 360;
  const h2 = (seed * 37) % 360;
  const uid = Math.random().toString(36).slice(2, 7);
  const base = `orb_${seed.toString(36)}_${uid}`;
  return `<div class="dual-orb-wrap" style="--orb-size:${size}px;--orb-primary:hsl(${h1},100%,62%);--orb-secondary:hsl(${h2},92%,48%);" aria-label="${escapeHtml(safe)}" role="img">
    <svg class="dual-orb-svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <radialGradient id="${base}_c" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="hsl(${h1},100%,66%)" stop-opacity="1"/>
          <stop offset="55%" stop-color="hsl(${h2},92%,46%)" stop-opacity=".9"/>
          <stop offset="100%" stop-color="hsl(${h2},100%,12%)" stop-opacity="0"/>
        </radialGradient>
        <linearGradient id="${base}_r" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="hsl(${h1},100%,76%)"/>
          <stop offset="100%" stop-color="hsl(${h2},100%,58%)"/>
        </linearGradient>
      </defs>
      <circle cx="50" cy="50" r="46" fill="#05070c"/>
      <circle cx="50" cy="50" r="40" fill="url(#${base}_c)" opacity=".28"/>
      <circle cx="50" cy="50" r="38" fill="none" stroke="url(#${base}_r)" stroke-width="1"/>
      <circle cx="50" cy="50" r="46" fill="none" stroke="url(#${base}_r)" stroke-width="2.5" stroke-dasharray="70 20 10 30" stroke-linecap="round" opacity=".86"/>
      <circle cx="50" cy="50" r="8" fill="#ffffff" opacity=".22"/>
      <circle cx="50" cy="50" r="3" fill="#ffffff" opacity=".85"/>
    </svg>
    <div class="dual-orb-shell"><div class="dual-orb-halo"></div><div class="dual-orb-core"></div></div>
  </div>`;
}
window.makeOrbAvatar = makeOrbAvatar;

/* ─── FUSION CORE STATE ─── */
const STORAGE_KEY = 'fusion_os_data_v2';
const UI_STATE_KEY = 'fusion_os_ui_state';
let FC_STATE = { keys:[], user:'Convidado', isEncrypted:false, encryptedData:null };
let SESSION_PASSWORD = null;
let apiKey   = localStorage.getItem('di_apiKey') || '';
let modelName = localStorage.getItem('di_modelName') || 'nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free';
let userName  = localStorage.getItem('di_userName') || '';
let infodoseName = localStorage.getItem('di_infodoseName') || '';

const CRYPTO = {
  algo:  { name:'AES-GCM', length:256 },
  pbkdf2:{ name:'PBKDF2', hash:'SHA-256', iterations:100000 },
  async getKey(password, salt) {
    const enc = new TextEncoder();
    const mat = await window.crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveKey']);
    return window.crypto.subtle.deriveKey({ ...this.pbkdf2, salt }, mat, this.algo, false, ['encrypt','decrypt']);
  },
  async encrypt(data, password) {
    const salt = window.crypto.getRandomValues(new Uint8Array(16));
    const iv   = window.crypto.getRandomValues(new Uint8Array(12));
    const key  = await this.getKey(password, salt);
    const enc  = await window.crypto.subtle.encrypt({ name:'AES-GCM', iv }, key, new TextEncoder().encode(JSON.stringify(data)));
    return JSON.stringify({ s:Array.from(salt), iv:Array.from(iv), d:Array.from(new Uint8Array(enc)) });
  },
  async decrypt(bundle, password) {
    try {
      const b = JSON.parse(bundle);
      const key = await this.getKey(password, new Uint8Array(b.s));
      const dec = await window.crypto.subtle.decrypt({ name:'AES-GCM', iv:new Uint8Array(b.iv) }, key, new Uint8Array(b.d));
      return JSON.parse(new TextDecoder().decode(dec));
    } catch(e) { throw new Error('Senha incorreta'); }
  }
};

/* ─── INTERFACE UPDATE + HASH → HSL → CSS VARS ─── */
function updateInterface(name) {
  const safe = String(name || 'Convidado').trim() || 'Convidado';
  FC_STATE.user = safe; userName = safe;
  localStorage.setItem('di_userName', safe);

  byId('lblName')?.setAttribute && (byId('lblName').textContent = safe);
  byId('kardinputUser') && (byId('kardinputUser').value !== safe) && (byId('kardinputUser').value = safe);
  byId('actName') && (byId('actName').textContent = safe);

  const ak = Array.isArray(FC_STATE.keys) ? FC_STATE.keys.find(k => k.active) : null;
  byId('smallIdent') && (byId('smallIdent').textContent = ak?.name || '--');
  byId('actBadge') && (byId('actBadge').textContent = ak ? `key:${ak.name}` : 'v:--');
  if (byId('smallText')) {
    byId('smallText').textContent = ak ? `${ak.name} [ATIVO]` : (safe === 'Convidado' ? 'Aguardando...' : `${safe} · Foco estável.`);
  }

  byId('avatarTarget') && (byId('avatarTarget').innerHTML = makeOrbAvatar(safe, 64));
  byId('smallMiniAvatar') && (byId('smallMiniAvatar').innerHTML = makeOrbAvatar(safe, 24));
  byId('actMiniAvatar') && (byId('actMiniAvatar').innerHTML = makeOrbAvatar(safe, 36));

  updateActivationBlock(safe);

  /* ── HASH → HSL ── */
  const seed = [...safe].reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  const h1 = seed % 360;
  const h2 = (seed * 37) % 360;

  /* Saturação e lightness variam ligeiramente com seed para personalidade */
  const sat1 = 80 + (seed % 20);
  const lit1  = 55 + (seed % 15);
  const sat2 = 75 + ((seed * 3) % 18);
  const lit2  = 44 + ((seed * 7) % 12);

  const root = document.documentElement;
  root.style.setProperty('--orb-primary',       `hsl(${h1},${sat1}%,${lit1}%)`);
  root.style.setProperty('--orb-secondary',      `hsl(${h2},${sat2}%,${lit2}%)`);
  root.style.setProperty('--kob-L-primary',      `hsl(${h1} ${sat1}% ${lit1}%)`);
  root.style.setProperty('--kob-L-secondary',    `hsl(${h2} ${sat2}% ${lit2}%)`);
  root.dataset.diName = safe;
  root.dataset.arch   = safe;
  root.dataset.seed   = String(seed);
  root.dataset.hue1   = String(h1);
  root.dataset.hue2   = String(h2);

  /* Atualiza vision orb também */
  const vOrb = document.getElementById('visionOrb');
  if (vOrb) {
    vOrb.style.setProperty('--orb-primary', `hsl(${h1},${sat1}%,${lit1}%)`);
    vOrb.style.setProperty('--orb-secondary', `hsl(${h2},${sat2}%,${lit2}%)`);
  }

  /* Sincroniza nome no profileName se diferir */
  const pn = document.getElementById('profileName');
  if (pn && pn.value !== safe) pn.value = safe;
  updateHomeGreeting(safe);

  window.dispatchEvent(new CustomEvent('di:interface:update', { detail:{ name:safe, seed, h1, h2 } }));
}

function updateActivationBlock(name) {
  const clean = String(name || '').trim() || 'Convidado';
  const title = 'CÉREBRO-ORÁCULO — BASE v1';
  const W = 35;
  const top = `+${'-'.repeat(W)}+`;
  const tl  = `| ${(title).padEnd(W-2)} |`;
  const nl  = `Ativar: ${clean}.Dual Infodose`;
  if (byId('actPre')) byId('actPre').textContent = [top,tl,top,nl].join('\n');
  if (byId('actBadge')) {
    const seed = [...clean].reduce((a,c) => a + c.charCodeAt(0), 0);
    let n = seed; while (n > 9) n = String(n).split('').reduce((a,b) => a + +b, 0);
    const ak = FC_STATE.keys.find(k => k.active);
    byId('actBadge').textContent = ak ? `key:${ak.name}` : `v:${n}`;
  }
}
window.updateActivationBlock = updateActivationBlock;

/* ─── SAVE / LOAD ─── */
function saveUIState() {
  const mode = fcUI.isOrb ? 'orb' : fcUI.isHud ? 'hud' : fcUI.isDockBottom ? 'dock-bottom' : 'card';
  localStorage.setItem(UI_STATE_KEY, JSON.stringify({ mode, left:card?.style.left||'', top:card?.style.top||'' }));
}
function saveData() {
  const payload = { keys:FC_STATE.keys, user:FC_STATE.user };
  if (SESSION_PASSWORD) {
    CRYPTO.encrypt(payload, SESSION_PASSWORD).then(enc => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ isEncrypted:true, data:enc }));
      FC_STATE.isEncrypted = true; FC_STATE.encryptedData = enc;
      updateSecurityUI();
    }).catch(console.error);
  } else {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ isEncrypted:false, data:payload }));
  }
}
async function loadData() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) { updateInterface(userName || 'Convidado'); return; }
  try {
    const p = JSON.parse(raw);
    if (p.isEncrypted) { FC_STATE.isEncrypted = true; FC_STATE.encryptedData = p.data; updateSecurityUI(); }
    else {
      FC_STATE.keys = p.data?.keys || []; FC_STATE.user = p.data?.user || 'Convidado';
      const ak = FC_STATE.keys.find(k => k.active);
      if (ak?.token) { localStorage.setItem('di_apiKey', ak.token); apiKey = ak.token; }
      if (FC_STATE.user !== 'Convidado') { localStorage.setItem('di_userName', FC_STATE.user); userName = FC_STATE.user; }
      updateInterface(FC_STATE.user); renderKeysList();
    }
  } catch(e) { console.error('Load error:', e); }
  if (byId('apiKeyInput')) byId('apiKeyInput').value = apiKey;
  if (byId('infodoseNameInput')) byId('infodoseNameInput').value = infodoseName;
  if (byId('modelSelect')) byId('modelSelect').value = modelName;
}

/* ─── SECURITY ─── */
function updateSecurityUI() {
  const vs = byId('vaultStatusText'), lb = byId('lockVaultBtn');
  if (!vs||!lb) return;
  if (SESSION_PASSWORD) { vs.textContent = 'Cofre Protegido (Destrancado)'; lb.textContent = 'TRANCAR'; }
  else if (FC_STATE.isEncrypted) { vs.textContent = 'Cofre Trancado'; lb.textContent = 'REDEFINIR'; }
  else { vs.textContent = 'Cofre Aberto (Sem senha)'; lb.textContent = 'CRIAR SENHA'; }
}

/* ─── KEYS ─── */
function renderKeysList() {
  const kl = byId('keyList'); if (!kl) return;
  kl.innerHTML = '';
  if (!FC_STATE.keys.length) { kl.innerHTML = `<div style="color:rgba(255,255,255,.3);text-align:center;padding:20px">Nenhuma chave armazenada.</div>`; return; }
  FC_STATE.keys.forEach(k => {
    const d = document.createElement('div');
    d.className = `key-item ${k.active ? 'active-item' : ''}`;
    d.innerHTML = `<div style="flex:1"><div style="font-weight:700;font-size:.9rem">${escapeHtml(k.name)}</div></div>
      <div style="display:flex;gap:8px;align-items:center">
        ${!k.active ? `<button class="small-btn" data-action="activate-key" data-key-id="${escapeHtml(k.id)}">ATIVAR</button>` : `<span style="font-size:.7rem;font-weight:700;color:var(--orb-primary)">ATIVA</span>`}
        <button class="small-btn danger" data-action="remove-key" data-key-id="${escapeHtml(k.id)}" aria-label="Remover">🗑</button>
      </div>`;
    kl.appendChild(d);
  });
}
function addKey() {
  const name = byId('keyNameInput')?.value.trim();
  const token = byId('keyTokenInput')?.value.trim();
  if (!name) { toast('Nome obrigatório','error'); return; }
  const nk = { id:Date.now().toString(36), name, token, active:FC_STATE.keys.length===0 };
  FC_STATE.keys.push(nk);
  if (nk.active && nk.token) { localStorage.setItem('di_apiKey', nk.token); apiKey = nk.token; }
  saveData(); renderKeysList(); updateInterface(FC_STATE.user);
  if (byId('keyNameInput')) byId('keyNameInput').value = '';
  if (byId('keyTokenInput')) byId('keyTokenInput').value = '';
  toast('Chave adicionada!','success');
}
function removeKey(id) {
  if (!confirm('Remover chave permanentemente?')) return;
  const rm = FC_STATE.keys.find(k => k.id === id);
  FC_STATE.keys = FC_STATE.keys.filter(k => k.id !== id);
  if (rm?.active) { localStorage.removeItem('di_apiKey'); apiKey = ''; }
  saveData(); renderKeysList(); updateInterface(FC_STATE.user);
}
function setActiveKey(id) {
  let token = null;
  FC_STATE.keys.forEach(k => { k.active = k.id === id; if (k.active) token = k.token; });
  if (token) { localStorage.setItem('di_apiKey', token); apiKey = token; if (byId('apiKeyInput')) byId('apiKeyInput').value = token; toast('Chave sincronizada.','success'); }
  else { localStorage.removeItem('di_apiKey'); apiKey = ''; }
  saveData(); renderKeysList(); updateInterface(FC_STATE.user);
}

/* ─── MODALS ─── */
function openManager() {
  if (FC_STATE.isEncrypted && !SESSION_PASSWORD) {
    const vm = byId('vaultModal'); if (vm) { vm.style.display = 'flex'; vm.setAttribute('aria-hidden','false'); }
    byId('vaultPassInput')?.focus();
  } else { const km = byId('keysModal'); if (km) { km.style.display = 'flex'; km.setAttribute('aria-hidden','false'); } }
}
function closeKeysManager() { const km = byId('keysModal'); if (km) { km.style.display = 'none'; km.setAttribute('aria-hidden','true'); } }
function closeVaultModal() { const vm = byId('vaultModal'); if (vm) { vm.style.display = 'none'; vm.setAttribute('aria-hidden','true'); } }

byId('vaultUnlockBtn')?.addEventListener('click', async () => {
  const pass = byId('vaultPassInput')?.value || '';
  if (!pass) { toast('Digite a senha.','error'); return; }
  try {
    const dec = await CRYPTO.decrypt(FC_STATE.encryptedData, pass);
    SESSION_PASSWORD = pass; FC_STATE.keys = dec.keys || []; FC_STATE.user = dec.user || 'Convidado';
    const ak = FC_STATE.keys.find(k => k.active);
    if (ak?.token) { localStorage.setItem('di_apiKey', ak.token); apiKey = ak.token; }
    if (FC_STATE.user) { localStorage.setItem('di_userName', FC_STATE.user); userName = FC_STATE.user; }
    closeVaultModal();
    const km = byId('keysModal'); if (km) { km.style.display = 'flex'; km.setAttribute('aria-hidden','false'); }
    if (byId('vaultPassInput')) byId('vaultPassInput').value = '';
    renderKeysList(); updateInterface(FC_STATE.user); updateSecurityUI();
    toast('Cofre destrancado.','success');
  } catch(e) { toast('Senha incorreta.','error'); }
});

byId('lockVaultBtn')?.addEventListener('click', () => {
  if (!SESSION_PASSWORD && !FC_STATE.isEncrypted) {
    const np = prompt('Defina uma senha para o Cofre:');
    if (np) { SESSION_PASSWORD = np; saveData(); toast('Cofre protegido.','success'); }
  } else if (SESSION_PASSWORD) { SESSION_PASSWORD = null; closeKeysManager(); toast('Sessão encerrada.','success'); }
  else { toast('Cofre criptografado. Desbloqueie para redefinir.','error'); }
  updateSecurityUI();
});

byId('vaultCancelBtn')?.addEventListener('click', closeVaultModal);
byId('closeKeysBtn')?.addEventListener('click', closeKeysManager);
byId('addKeyBtn')?.addEventListener('click', addKey);
byId('keyList')?.addEventListener('click', e => {
  const btn = e.target.closest('[data-action]'); if (!btn) return;
  const id = btn.dataset.keyId;
  if (btn.dataset.action === 'activate-key') setActiveKey(id);
  if (btn.dataset.action === 'remove-key') removeKey(id);
});

/* ─── FUSION CARD MODE ENGINE ─── */
const card = byId('mainCard');
let fcUI = { isOrb:false, isHud:false, isDockBottom:false, isDragging:false, timer:null, startX:0, startY:0, dragOffsetX:0, dragOffsetY:0, pointerId:null };
const HUD_SNAP  = 60, DOCK_SNAP = 60, SWIPE_DN = 80, LP_MS = 350;

function updateModeBtns(mode) {
  ['btnModeCard','btnModeOrb','btnModeHud','btnModeDock'].forEach(id => byId(id)?.classList.remove('active-mode'));
  ({ card:'btnModeCard', orb:'btnModeOrb', hud:'btnModeHud', 'dock-bottom':'btnModeDock' }[mode] || 'btnModeCard');
  byId({ card:'btnModeCard', orb:'btnModeOrb', hud:'btnModeHud', 'dock-bottom':'btnModeDock' }[mode])?.classList.add('active-mode');
}
function revertToCard() {
  fcUI.isOrb = fcUI.isHud = fcUI.isDockBottom = false;
  card.style.cssText = '';
  card.classList.remove('orb','hud','dock-bottom','closed');
  card.dataset.mode = 'card';
  setTimeout(() => card.classList.add('content-visible'), 300);
}
function setMode(mode, init = false) {
  if (!card) return;
  updateModeBtns(mode);
  if (mode === 'card') { revertToCard(); }
  else if (mode === 'orb') {
    fcUI.isOrb = true; fcUI.isHud = fcUI.isDockBottom = false;
    card.classList.add('orb','closed'); card.classList.remove('hud','dock-bottom','content-visible');
    card.style.transform = 'none';
  } else if (mode === 'hud') {
    fcUI.isHud = true; fcUI.isOrb = fcUI.isDockBottom = false;
    card.classList.add('hud','closed'); card.classList.remove('orb','dock-bottom','content-visible');
    card.style.top = card.style.left = card.style.transform = '';
  } else if (mode === 'dock-bottom') {
    fcUI.isDockBottom = true; fcUI.isHud = fcUI.isOrb = false;
    card.classList.add('dock-bottom','closed'); card.classList.remove('orb','hud','content-visible');
    card.style.top = card.style.left = card.style.transform = '';
  }
  card.dataset.mode = mode;
  if (!init) saveUIState();
}
window.setMode = setMode;

function toggleCardState() {
  if (card.classList.contains('animating')) return;
  const closed = card.classList.contains('closed');
  card.classList.add('animating');
  if (closed) {
    card.classList.remove('closed');
    card.animate([{transform:'scale(.95)',opacity:.8},{transform:'scale(1)',opacity:1}],{duration:400}).onfinish = () => { card.classList.remove('animating'); card.classList.add('content-visible'); };
  } else {
    card.classList.remove('content-visible');
    card.animate([{transform:'translateY(0)',opacity:1},{transform:'translateY(10px)',opacity:1}],{duration:200}).onfinish = () => { card.classList.add('closed'); card.classList.remove('animating'); };
  }
}
function transmuteToOrb(e) {
  if (!e || e.clientX == null) return;
  navigator.vibrate?.(40);
  card.classList.add('orb','closed'); card.classList.remove('hud','dock-bottom','content-visible');
  card.style.left = `${e.clientX - 34}px`;
  card.style.top  = `${e.clientY - 34}px`;
  fcUI.isOrb = true; fcUI.isHud = fcUI.isDockBottom = false; fcUI.isDragging = true;
  card.dataset.mode = 'orb';
  if (e.pointerId) {
    fcUI.pointerId = e.pointerId;
    try { card.setPointerCapture(e.pointerId); } catch(_){}
    const r = card.getBoundingClientRect();
    fcUI.dragOffsetX = e.clientX - r.left; fcUI.dragOffsetY = e.clientY - r.top;
  }
  updateModeBtns('orb');
  /* swoosh ao transformar em orb */
  try { KOBSonoro.sfx('swoosh'); } catch(_){}
}

const snapZone = byId('snap-zone'), snapZoneB = byId('snap-zone-bottom');

card?.addEventListener('pointerdown', e => {
  const tag = e.target.tagName;
  if (tag==='INPUT'||tag==='TEXTAREA'||tag==='SELECT'||(tag==='BUTTON'&&!e.target.closest('.orb-menu-trigger'))) return;
  const isFloat = fcUI.isOrb || fcUI.isHud || fcUI.isDockBottom;
  if (!isFloat && !byId('cardHeader')?.contains(e.target)) return;
  fcUI.startX = e.clientX; fcUI.startY = e.clientY; fcUI.pointerId = e.pointerId;
  if (isFloat) {
    fcUI.isDragging = true;
    try { card.setPointerCapture(e.pointerId); } catch(_){}
    const r = card.getBoundingClientRect();
    fcUI.dragOffsetX = e.clientX - r.left; fcUI.dragOffsetY = e.clientY - r.top;
    card.style.transition = 'none';
    return;
  }
  fcUI.timer = setTimeout(() => { transmuteToOrb(e); saveUIState(); }, LP_MS);
}, { passive:false });

window.addEventListener('pointermove', e => {
  if (!fcUI.isOrb && !fcUI.isHud && !fcUI.isDockBottom && fcUI.timer) {
    const dx = e.clientX - fcUI.startX, dy = e.clientY - fcUI.startY;
    if (Math.hypot(dx,dy) > 12 && (dy < -10 || Math.abs(dx) > 18)) {
      clearTimeout(fcUI.timer); fcUI.timer = null;
      transmuteToOrb(e);
      const r = card.getBoundingClientRect();
      fcUI.dragOffsetX = e.clientX - r.left; fcUI.dragOffsetY = e.clientY - r.top;
      try { card.setPointerCapture(e.pointerId); } catch(_){}
      card.style.transition = 'none';
    }
  }
  if (!fcUI.isDragging) return;
  e.preventDefault();
  const vh = window.innerHeight, cardH = card.offsetHeight || 68;
  if (fcUI.isOrb) {
    const x = e.clientX - fcUI.dragOffsetX, y = e.clientY - fcUI.dragOffsetY;
    card.style.left = `${x}px`; card.style.top = `${y}px`;
    if (y < HUD_SNAP) { snapZone?.classList.add('active'); snapZoneB?.classList.remove('active'); }
    else if (y + cardH > vh - DOCK_SNAP) { snapZoneB?.classList.add('active'); snapZone?.classList.remove('active'); }
    else { snapZone?.classList.remove('active'); snapZoneB?.classList.remove('active'); }
  } else if (fcUI.isHud) {
    const dy = e.clientY - fcUI.startY;
    if (dy > 0) { card.style.transform = `translateX(-50%) translateY(${dy*.4}px)`; dy > SWIPE_DN ? snapZone?.classList.add('active') : snapZone?.classList.remove('active'); }
  } else if (fcUI.isDockBottom) {
    const dy = e.clientY - fcUI.startY;
    if (dy < 0) { card.style.transform = `translateX(-50%) translateY(${dy*.4}px)`; dy < -SWIPE_DN ? snapZoneB?.classList.add('active') : snapZoneB?.classList.remove('active'); }
  }
}, { passive:false });

window.addEventListener('pointerup', e => {
  if (fcUI.timer) { clearTimeout(fcUI.timer); fcUI.timer = null; }
  if (fcUI.isDragging) {
    fcUI.isDragging = false;
    try { card.releasePointerCapture?.(fcUI.pointerId); } catch(_){}
    card.style.transition = '';
    snapZone?.classList.remove('active'); snapZoneB?.classList.remove('active');
    const vh = window.innerHeight;
    if (fcUI.isOrb) {
      const r = card.getBoundingClientRect();
      if (r.top < HUD_SNAP) { setMode('hud'); try { KOBSonoro.sfx('swoosh'); } catch(_){} }
      else if (r.bottom > vh - DOCK_SNAP) { setMode('dock-bottom'); try { KOBSonoro.sfx('swoosh'); } catch(_){} }
      else saveUIState();
    } else if (fcUI.isHud) {
      const dy = e.clientY - fcUI.startY;
      if (dy > SWIPE_DN) { card.style.left = `${e.clientX-34}px`; card.style.top = `${e.clientY-10}px`; setMode('orb'); try { KOBSonoro.sfx('swoosh'); } catch(_){} }
      else card.style.transform = 'translateX(-50%) translateY(0)';
    } else if (fcUI.isDockBottom) {
      const dy = e.clientY - fcUI.startY;
      if (dy < -SWIPE_DN) { card.style.left = `${e.clientX-34}px`; card.style.top = `${e.clientY-34}px`; setMode('orb'); try { KOBSonoro.sfx('swoosh'); } catch(_){} }
      else card.style.transform = 'translateX(-50%) translateY(0)';
    }
  } else {
    if (!fcUI.isOrb && !fcUI.isHud && !fcUI.isDockBottom && byId('cardHeader')?.contains(e.target)) toggleCardState();
  }
  fcUI.pointerId = null;
}, { passive:false });

/* Avatar / menu clicks */
byId('avatarTarget')?.addEventListener('click', e => { e.stopPropagation(); if (!fcUI.isOrb && !fcUI.isHud && !fcUI.isDockBottom) openManager(); });
byId('orbMenuTrigger')?.addEventListener('click', e => { e.stopPropagation(); setMode('card'); toggleSection('systemCard', true); try { KOBSonoro.sfx('bubble'); } catch(_){} });
byId('hudMenuBtn')?.addEventListener('click', e => { e.stopPropagation(); setMode('card'); toggleSection('systemCard', true); try { KOBSonoro.sfx('bubble'); } catch(_){} });
byId('cardHeader')?.addEventListener('click', e => {
  if ((fcUI.isHud || fcUI.isDockBottom) && !fcUI.isDragging && !e.target.closest('.hud-menu-btn')) { setMode('card'); try { KOBSonoro.sfx('swoosh'); } catch(_){} }
});
card?.addEventListener('contextmenu', e => { if (fcUI.isOrb || fcUI.isHud || fcUI.isDockBottom) { e.preventDefault(); setMode('card'); } });

/* Mode buttons */
byId('btnModeCard')?.addEventListener('click', () => { setMode('card'); try { KOBSonoro.sfx('bubble'); } catch(_){} });
byId('btnModeOrb')?.addEventListener('click',  () => { setMode('orb');  try { KOBSonoro.sfx('swoosh'); } catch(_){} });
byId('btnModeHud')?.addEventListener('click',  () => { setMode('hud');  try { KOBSonoro.sfx('swoosh'); } catch(_){} });
byId('btnModeDock')?.addEventListener('click', () => { setMode('dock-bottom'); try { KOBSonoro.sfx('swoosh'); } catch(_){} });

/* Toggle sections */
function toggleSection(id, forceOpen = false) {
  const el = document.getElementById(id); if (!el) return;
  const hidden = el.classList.contains('activation-hidden');
  if (forceOpen && !hidden) return;
  el.classList.toggle('activation-hidden', forceOpen ? false : !hidden);
  el.classList.toggle('activation-open', forceOpen ? true : hidden);
}
window.toggleSection = toggleSection;
byId('activationToggle')?.addEventListener('click', () => { toggleSection('activationCard'); try { KOBSonoro.sfx('cristal'); } catch(_){} });
byId('systemToggle')?.addEventListener('click', () => { toggleSection('systemCard'); try { KOBSonoro.sfx('cristal'); } catch(_){} });
[['activationToggle','activationCard'],['systemToggle','systemCard']].forEach(([t,c]) => {
  byId(t)?.addEventListener('keydown', e => { if (e.key==='Enter'||e.key===' ') { e.preventDefault(); toggleSection(c); } });
});

/* Input sync */
byId('kardinputUser')?.addEventListener('input', e => {
  updateInterface(e.target.value);
  saveData();
});

byId('copyActBtn')?.addEventListener('click', async () => {
  const text = byId('actPre')?.innerText || '';
  try { await navigator.clipboard.writeText(text); toast('Ativação copiada','success'); }
  catch(_) { const ta = document.createElement('textarea'); ta.value = text; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); ta.remove(); toast('Ativação copiada','success'); }
});

byId('saveSystemBtn')?.addEventListener('click', () => {
  infodoseName = byId('infodoseNameInput')?.value.trim() || '';
  const nk = byId('apiKeyInput')?.value.trim() || '';
  const nm = byId('modelSelect')?.value.trim() || '';
  if (nk) { apiKey = nk; localStorage.setItem('di_apiKey', apiKey); const ak = FC_STATE.keys.find(k => k.active); if (ak) { ak.token = nk; saveData(); } }
  if (nm) { modelName = nm; localStorage.setItem('di_modelName', modelName); }
  localStorage.setItem('di_infodoseName', infodoseName);
  toggleSection('systemCard', false);
  toast('Configurações salvas.','success');
});

/* Clock */
function updateClock() { const c = byId('clockTime'); if (c) c.textContent = new Date().toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'}); }
updateClock(); setInterval(updateClock, 1000);

/* Fusion Card init / restore */
function saveUIState_() {
  const mode = fcUI.isOrb ? 'orb' : fcUI.isHud ? 'hud' : fcUI.isDockBottom ? 'dock-bottom' : 'card';
  localStorage.setItem(UI_STATE_KEY, JSON.stringify({ mode, left:card?.style.left||'', top:card?.style.top||'' }));
}
saveUIState = saveUIState_;

(async function initFusion() {
  card?.classList.add('active');
  byId('avatarTarget')?.classList.add('shown');
  await loadData();
  updateInterface(FC_STATE.user || userName || 'Convidado');
  let savedMode = 'card', sl = null, st = null;
  try {
    const r = JSON.parse(localStorage.getItem(UI_STATE_KEY)||'{}');
    savedMode = r.mode || 'card'; sl = r.left || null; st = r.top || null;
  } catch(_){}
  /* Show small preview first */
  card.style.left = card.style.top = '';
  card.style.opacity = '0'; card.style.transition = 'opacity 400ms ease';
  card.classList.add('closed'); card.classList.remove('content-visible');
  card.dataset.mode = 'card';
  requestAnimationFrame(() => { card.style.opacity = '1'; });
  /* Restore after 5s */
  setTimeout(() => {
    card.style.transition = 'all 600ms var(--ease-smooth)';
    if (savedMode === 'orb') { if (sl) card.style.left = sl; if (st) card.style.top = st; setMode('orb'); }
    else if (savedMode === 'hud') setMode('hud');
    else if (savedMode === 'dock-bottom') setMode('dock-bottom');
    else { setMode('card'); card.classList.remove('closed'); card.classList.add('content-visible'); }
  }, 5000);
  updateSecurityUI(); renderKeysList();
  document.documentElement.dataset.fusionCore = 'ready';
  console.info('⚡ 78KARD × KOBLLUX Fusion OS ready');
})();

/* ─── DOCK ENGINE ─── */
document.addEventListener('DOMContentLoaded', () => {
  const dock           = document.getElementById('floating-dock');
  const topDrop        = document.getElementById('top-drop-zone');
  const botDrop        = document.getElementById('bottom-drop-zone');
  const dockPosTag     = document.getElementById('dock-pos-tag');
  const collapseBtn    = document.getElementById('dock-collapse-btn');
  const playPauseBtn   = document.getElementById('play-pause-btn');
  const nextTrackBtn   = document.getElementById('next-track-btn');
  const openGpBtn      = document.getElementById('open-gp-btn');
  const iconPlay       = document.getElementById('icon-play');
  const iconPause      = document.getElementById('icon-pause');
  const progContainer  = document.getElementById('progress-container');
  const progFill       = document.getElementById('progress-fill');
  const progThumb      = document.getElementById('progress-thumb');
  const curTimeEl      = document.getElementById('current-time');
  const totTimeEl      = document.getElementById('total-time');
  const trackNameEl    = document.getElementById('track-name');

  const MARGIN_TOP = 54, MARGIN_BOT = 16;
  let dockPos    = localStorage.getItem('kob:dock:pos') || 'header';
  let isCollapsed = localStorage.getItem('kob:dock:collapsed') === '1';
  let dkDragging = false, dkStartY = 0, dkStartTop = 0, dkMoved = false;

  function snapTo(pos) {
    dockPos = pos;
    try { localStorage.setItem('kob:dock:pos', pos); } catch(_){}
    const dh = dock.offsetHeight, wh = window.innerHeight;
    if (pos === 'header') {
      dock.style.top = `${MARGIN_TOP}px`;
      if (dockPosTag) dockPosTag.textContent = isCollapsed ? 'PLAYER · TOP' : 'HEADER';
      document.body.classList.add('dock-header'); document.body.classList.remove('dock-footer');
    } else {
      dock.style.top = `${wh - dh - MARGIN_BOT}px`;
      if (dockPosTag) dockPosTag.textContent = isCollapsed ? 'PLAYER · FOOTER' : 'FOOTER';
      document.body.classList.add('dock-footer'); document.body.classList.remove('dock-header');
    }
  }

  function applyCollapse(c) {
    isCollapsed = !!c; dock.classList.toggle('collapsed', isCollapsed); document.body.classList.toggle('dock-collapsed', isCollapsed);
    try { localStorage.setItem('kob:dock:collapsed', isCollapsed?'1':'0'); } catch(_){}
    requestAnimationFrame(() => snapTo(dockPos));
    setTimeout(() => { if (!dkDragging) snapTo(dockPos); }, 310);
  }
  applyCollapse(isCollapsed); snapTo(dockPos);
  window.addEventListener('resize', () => { if (!dkDragging) snapTo(dockPos); });

  collapseBtn?.addEventListener('click', e => {
    e.stopPropagation(); applyCollapse(!isCollapsed);
    try { KOBSonoro.sfx('swoosh'); } catch(_){}
  });

  /* DRAG */
  function dkStart(e) {
    if (e.target.closest('#progress-container') || e.target.closest('#dock-collapse-btn')) return;
    dkDragging = true; dkMoved = false;
    dkStartY = e.type.includes('mouse') ? e.clientY : e.touches[0].clientY;
    dkStartTop = dock.getBoundingClientRect().top;
    dock.classList.add('dragging');
    if (topDrop) topDrop.style.opacity = '1';
    if (botDrop) botDrop.style.opacity = '1';
  }
  function dkMove(e) {
    if (!dkDragging) return;
    const cy = e.type.includes('mouse') ? e.clientY : e.touches[0].clientY;
    const dy = cy - dkStartY;
    if (Math.abs(dy) > 6) dkMoved = true;
    if (!dkMoved) return;
    if (e.cancelable) e.preventDefault();
    const dh = dock.offsetHeight, maxT = window.innerHeight - dh - MARGIN_BOT, minT = MARGIN_TOP;
    let nt = dkStartTop + dy;
    if (nt < minT) nt = minT - (minT-nt)*.25;
    else if (nt > maxT) nt = maxT + (nt-maxT)*.25;
    dock.style.top = `${nt}px`;
    const mid = window.innerHeight/2, dc = nt + dh/2;
    if (topDrop && botDrop) {
      if (dc < mid) { topDrop.classList.add('highlight'); botDrop.classList.remove('highlight'); }
      else { botDrop.classList.add('highlight'); topDrop.classList.remove('highlight'); }
    }
    /* swoosh durante drag */
  }
  function dkEnd() {
    if (!dkDragging) return;
    dkDragging = false; dock.classList.remove('dragging');
    if (topDrop) { topDrop.style.opacity = '0'; topDrop.classList.remove('highlight'); }
    if (botDrop) { botDrop.style.opacity = '0'; botDrop.classList.remove('highlight'); }
    if (dkMoved) {
      const r = dock.getBoundingClientRect();
      const dc = r.top + r.height/2, mid = window.innerHeight/2;
      snapTo(dc < mid ? 'header' : 'footer');
      try { KOBSonoro.sfx('swoosh'); } catch(_){}
    } else { snapTo(dockPos); }
  }
  dock.addEventListener('mousedown', dkStart);
  window.addEventListener('mousemove', dkMove);
  window.addEventListener('mouseup', dkEnd);
  dock.addEventListener('touchstart', dkStart, { passive:false });
  window.addEventListener('touchmove', dkMove, { passive:false });
  window.addEventListener('touchend', dkEnd);

  /* NAV */
  const navBtns = document.querySelectorAll('.kb-nav-btn');
  const pages   = document.querySelectorAll('.kb-page');
  window.switchTab = function(tabName) {
    navBtns.forEach(b => b.classList.toggle('active', b.dataset.tab === tabName));
    pages.forEach(p => p.classList.toggle('active', p.id === `page-${tabName}`));
    try { KOBSonoro.sfx('bubble'); } catch(_){}
  };
  navBtns.forEach(btn => {
    btn.addEventListener('click', e => {
      if (dkMoved) { e.preventDefault(); return; }
      window.switchTab(btn.dataset.tab);
    });
  });

  /* MINI PLAYER SYNC */
  function fmt(s) { if (!s||isNaN(s)) return '0:00'; const m=Math.floor(s/60),sc=Math.floor(s%60); return `${m}:${sc<10?'0':''}${sc}`; }
  window.syncDockPlayerUI = function({ title, playing, current, duration }) {
    if (title !== undefined && trackNameEl) trackNameEl.textContent = title;
    if (playing !== undefined) { iconPlay?.classList.toggle('hidden',playing); iconPause?.classList.toggle('hidden',!playing); }
    if (current !== undefined && duration > 0) {
      const pct = Math.min(100, Math.max(0, (current/duration)*100));
      if (progFill) progFill.style.width = `${pct}%`;
      if (progThumb) progThumb.style.left = `${pct}%`;
      if (curTimeEl) curTimeEl.textContent = fmt(current);
      if (totTimeEl) totTimeEl.textContent = fmt(duration);
    }
  };

  playPauseBtn?.addEventListener('click', e => { if (dkMoved) return; try { KOBSonoro.sfx('bubble'); } catch(_){} window.Player?.toggle?.(e); });
  nextTrackBtn?.addEventListener('click', () => { if (dkMoved) return; try { KOBSonoro.sfx('cristal'); } catch(_){} window.Player?.next?.(); });
  openGpBtn?.addEventListener('click', () => { if (dkMoved) return; try { KOBSonoro.sfx('swoosh'); } catch(_){} window.Player?.reopenIfActive?.(); });

  /* SCRUB */
  let scrubbing = false;
  function scrubTo(e) {
    if (!progContainer) return;
    const r = progContainer.getBoundingClientRect();
    const cx = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
    const ratio = Math.min(1, Math.max(0, (cx - r.left) / r.width));
    window.Player?.seekRatio?.(ratio);
  }
  progContainer?.addEventListener('mousedown', e => { e.stopPropagation(); scrubbing=true; progContainer.classList.add('scrubbing'); scrubTo(e); });
  progContainer?.addEventListener('touchstart', e => { e.stopPropagation(); scrubbing=true; progContainer.classList.add('scrubbing'); scrubTo(e); }, { passive:true });
  window.addEventListener('mousemove', e => { if (scrubbing) scrubTo(e); });
  window.addEventListener('touchmove', e => { if (scrubbing) scrubTo(e); }, { passive:true });
  function endScrub() { scrubbing=false; progContainer?.classList.remove('scrubbing'); }
  window.addEventListener('mouseup', endScrub);
  window.addEventListener('touchend', endScrub);
});

/* ─── PROFILE / KOBLLUX ENGINE ─── */
const ARTYASKI_MAP = {'A':'Λ','B':'B','C':'C','D':'D','E':'Ξ','F':'F','G':'G','H':'H','I':'I','J':'J','K':'K','L':'L','M':'M','N':'N','O':'Ø','P':'P','Q':'Q','R':'R','S':'§','T':'T','U':'U','V':'V','W':'W','X':'X','Y':'Y','Z':'Z','Ç':'Ç'};
function toArtyaski(text) { return String(text||'').toUpperCase().split('').map(ch => ARTYASKI_MAP[ch]||ch).join(''); }
function stripVowels(str) { return String(str||'').toUpperCase().replace(/[^A-Z]/g,'').replace(/[AEIOU]/g,''); }

function updateHomeGreeting(name) {
  const n = name || localStorage.getItem('di_userName') || 'PILOTO';
  const g1 = document.getElementById('homeGreeting');
  const g2 = document.getElementById('homeSubGreeting');
  const seed = [...n].reduce((a,c) => a + c.charCodeAt(0), 0);
  const aidx = seed % VISION_ARCHETYPES.length;
  const a = VISION_ARCHETYPES[aidx];
  if (g1) g1.textContent = `${toArtyaski(n)} · ${a.key}`;
  if (g2) g2.textContent = `${a.opcode} · ${a.regra} · ${a.hz}Hz`;
}

let currentApTab = 'i';
const Profile = window.Profile = (() => {
  let currentArch = VISION_ARCHETYPES[0];

  function render() {
    const name = localStorage.getItem('di_userName') || 'PILOTO';
    const seed = [...name].reduce((a,c) => a + c.charCodeAt(0), 0);
    currentArch = VISION_ARCHETYPES[seed % VISION_ARCHETYPES.length];

    /* Orb */
    byId('visionOrbSym') && (byId('visionOrbSym').textContent = currentArch.sym);
    byId('visionOrbOpc') && (byId('visionOrbOpc').textContent = `${currentArch.opcode} · ${currentArch.hz}Hz`);
    byId('visionArtyaski') && (byId('visionArtyaski').textContent = `${toArtyaski(name)} · ${currentArch.key}`);
    byId('visionDrk') && (byId('visionDrk').textContent = `"${currentArch.drk}"`);

    /* V.E.E.B */
    const cons = stripVowels(name);
    byId('veebConsonants') && (byId('veebConsonants').textContent = cons || '--');
    const vowelsRow = byId('veebVowelsRow');
    if (vowelsRow) {
      const vowels = [...name.toUpperCase()].filter(c => 'AEIOU'.includes(c));
      const colors = ['#22D3EE','#F43F5E','#F59E0B','#A259FF','#00F5A0'];
      vowelsRow.innerHTML = vowels.slice(0,8).map((v,i) => `<div class="veeb-v" style="border-color:${colors[i%colors.length]};color:${colors[i%colors.length]}">${v}</div>`).join('');
    }
    const readout = byId('veebReadout');
    if (readout) readout.textContent = `${toArtyaski(name)} | ${currentArch.hz}Hz | ${currentArch.regra}`;

    /* Stats */
    const sg = byId('statsGrid');
    if (sg) {
      sg.innerHTML = [
        { l:'ARQUÉTIPO', v:currentArch.key },
        { l:'FREQUÊNCIA', v:`${currentArch.hz}Hz` },
        { l:'OPCODE', v:currentArch.opcode },
        { l:'REGRA', v:currentArch.regra },
      ].map(s => `<div class="stat-card"><div class="stat-label">${s.l}</div><div class="stat-value" style="font-size:12px">${s.v}</div></div>`).join('');
    }

    /* Arch matrix */
    const amg = byId('archMatrixGrid');
    if (amg) {
      amg.innerHTML = VISION_ARCHETYPES.map((a,i) => `<div class="arch-card ${a.key===currentArch.key?'active':''}" data-arch-idx="${i}" onclick="Profile.selectArch(${i})">
        <div class="arch-sym">${a.sym}</div>
        <div class="arch-key" style="color:${a.color}">${a.key}</div>
        <div class="arch-hz">${a.hz}Hz</div>
      </div>`).join('');
    }
    renderArchPromptContent();
  }

  function selectArch(idx) {
    currentArch = VISION_ARCHETYPES[idx] || VISION_ARCHETYPES[0];
    byId('visionOrbSym') && (byId('visionOrbSym').textContent = currentArch.sym);
    byId('visionOrbOpc') && (byId('visionOrbOpc').textContent = `${currentArch.opcode} · ${currentArch.hz}Hz`);
    byId('apSelectedTitle') && (byId('apSelectedTitle').textContent = `${currentArch.key} · ${currentArch.hz}Hz`);
    byId('visionDrk') && (byId('visionDrk').textContent = `"${currentArch.drk}"`);
    document.querySelectorAll('.arch-card').forEach((c,i) => c.classList.toggle('active', i === idx));
    renderArchPromptContent();
    try { KOBSonoro.sfx('cristal'); } catch(_){}
  }

  function renderArchPromptContent() {
    const el = byId('apContent'); if (!el) return;
    el.textContent = currentArch[currentApTab] || '';
    byId('apSelectedTitle') && (byId('apSelectedTitle').textContent = `${currentArch.key} · ${currentArch.hz}Hz`);
  }

  function pulseOrb() {
    const orb = byId('visionOrb'); if (!orb) return;
    orb.style.transform = 'scale(1.08)';
    setTimeout(() => { orb.style.transform = ''; }, 350);
    try { KOBSonoro.sfx('cristal'); } catch(_){}
  }

  function syncForgeIdentity() {
    const name = byId('profileName')?.value.trim() || 'PILOTO';
    updateInterface(name); saveData(); render();
    toast('Identidade sincronizada!','success');
  }

  function speakIdentity() {
    const name = localStorage.getItem('di_userName') || 'PILOTO';
    const text = `${name}. Arquétipo ${currentArch.key}. ${currentArch.hz} hertz. ${currentArch.regra}.`;
    if ('speechSynthesis' in window) { const u = new SpeechSynthesisUtterance(text); u.lang = 'pt-BR'; window.speechSynthesis.speak(u); }
  }

  function copyArchPrompt() {
    const t = byId('apContent')?.textContent || '';
    navigator.clipboard?.writeText(t).then(() => toast('Copiado!','success')).catch(() => {});
  }

  return { render, selectArch, pulseOrb, syncForgeIdentity, speakIdentity, copyArchPrompt, init() { initSubTabs(); render(); } };
})();

function initSubTabs() {
  document.querySelectorAll('[data-utab]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('[data-utab]').forEach(b => b.classList.toggle('active', b===btn));
      ['forge','matrix','system'].forEach(id => {
        const el = document.getElementById('upanel-'+id);
        if (el) el.style.display = (id===btn.dataset.utab) ? '' : 'none';
      });
      try { KOBSonoro.sfx('bubble'); } catch(_){}
    });
  });
  document.querySelectorAll('[data-ap]').forEach(btn => {
    btn.addEventListener('click', () => {
      currentApTab = btn.dataset.ap;
      document.querySelectorAll('[data-ap]').forEach(b => b.classList.toggle('active', b===btn));
      Profile.render();
      try { KOBSonoro.sfx('cristal'); } catch(_){}
    });
  });
}

byId('profileName')?.addEventListener('input', e => { updateInterface(e.target.value); });

/* ─── HERO CAROUSEL ─── */
const HeroCarousel = window.HeroCarousel = (() => {
  const SLIDES = [
    { emoji:'🌌', badge:'KOBLLUX OS', title:'Fusion OS · v1', sub:'78KARD × HOME UNITED', bg:'linear-gradient(135deg,rgba(124,58,237,.5),rgba(34,211,238,.25))' },
    { emoji:'△', badge:'ARQUÉTIPO ATIVO', title:'Consciência Total', sub:'528Hz · Malha Viva', bg:'linear-gradient(135deg,rgba(34,211,238,.4),rgba(124,58,237,.2))' },
    { emoji:'⚡', badge:'VITALIS', title:'Energia Cinética', sub:'Expandir · 528Hz', bg:'linear-gradient(135deg,rgba(0,245,160,.3),rgba(124,58,237,.25))' },
  ];
  let idx = 0, timer = null;

  function render() {
    ['heroSlides','shortsHeroSlides'].forEach(id => {
      const el = document.getElementById(id); if (!el) return;
      el.innerHTML = SLIDES.map(s => `<div class="hero-slide" style="background:${s.bg}">
        <div class="hero-slide-info">
          <div class="hero-slide-badge">${s.badge}</div>
          <div class="hero-slide-title">${s.emoji} ${s.title}</div>
          <div class="hero-slide-sub">${s.sub}</div>
        </div>
      </div>`).join('');
    });
    renderDots();
    update();
  }

  function update() {
    ['heroSlides','shortsHeroSlides'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.style.transform = `translateX(-${idx*100}%)`;
    });
    ['heroCounter','shortsHeroCounter'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.textContent = `${String(idx+1).padStart(2,'0')} / ${String(SLIDES.length).padStart(2,'0')}`;
    });
    document.querySelectorAll('.carousel-dot').forEach((d,i) => d.classList.toggle('active', i === idx));
  }

  function renderDots() {
    ['heroDots','shortsHeroDots'].forEach(id => {
      const el = document.getElementById(id); if (!el) return;
      el.innerHTML = SLIDES.map((_,i) => `<div class="carousel-dot ${i===idx?'active':''}"></div>`).join('');
    });
  }

  function next() { idx = (idx+1) % SLIDES.length; update(); }
  function prev() { idx = (idx-1+SLIDES.length) % SLIDES.length; update(); }

  function init() {
    render();
    document.getElementById('heroPrev')?.addEventListener('click', () => { prev(); try { KOBSonoro.sfx('bubble'); } catch(_){} });
    document.getElementById('heroNext')?.addEventListener('click', () => { next(); try { KOBSonoro.sfx('bubble'); } catch(_){} });
    document.getElementById('shortsHeroPrev')?.addEventListener('click', () => { prev(); try { KOBSonoro.sfx('bubble'); } catch(_){} });
    document.getElementById('shortsHeroNext')?.addEventListener('click', () => { next(); try { KOBSonoro.sfx('bubble'); } catch(_){} });
    timer = setInterval(next, 5000);
  }
  return { init, render, next, prev };
})();

/* ─── NF ROWS ─── */
const DEFAULT_TRACKS = [
  { emoji:'🔮', title:'Fractal 369', sub:'Infodose · 528Hz', type:'yt', id:'dQw4w9WgXcQ' },
  { emoji:'🌊', title:'Flow State', sub:'KOBLLUX · Ambient', type:'sc', url:'' },
  { emoji:'△', title:'Kobllux Theta', sub:'Arquétipo · 432Hz', type:'yt', id:'dQw4w9WgXcQ' },
  { emoji:'⚡', title:'Neural Drive', sub:'VITALIS · 528Hz', type:'yt', id:'dQw4w9WgXcQ' },
  { emoji:'♫', title:'Pulse Wave', sub:'PULSE · 639Hz', type:'sc', url:'' },
  { emoji:'🌌', title:'Deep Cosmos', sub:'SOLUS · 963Hz', type:'yt', id:'dQw4w9WgXcQ' },
];

function renderNfRow(containerId, tracks, countId) {
  const el = document.getElementById(containerId); if (!el) return;
  el.innerHTML = tracks.map((t,i) => `<div class="nf-card" data-track-idx="${i}" onclick="playTrack(${i},'${containerId}')">
    <div class="nf-thumb">${t.emoji}</div>
    <div class="nf-meta">
      <div class="nf-title">${escapeHtml(t.title)}</div>
      <div class="nf-sub">${escapeHtml(t.sub)}</div>
    </div>
  </div>`).join('');
  const ce = document.getElementById(countId);
  if (ce) ce.textContent = `${tracks.length} itens`;
}

function playTrack(idx, fromRow) {
  const t = DEFAULT_TRACKS[idx]; if (!t) return;
  if (t.type === 'yt' && t.id) {
    const gp = document.getElementById('global-player'); if (gp) gp.style.display = 'block';
    const fw = document.getElementById('player-frame-wrap'); if (fw) fw.innerHTML = `<iframe src="https://www.youtube.com/embed/${t.id}?autoplay=1" allow="autoplay; encrypted-media" allowfullscreen></iframe>`;
  }
  window.syncDockPlayerUI?.({ title:`${t.emoji} ${t.title}`, playing:true });
  try { KOBSonoro.sfx('portal'); } catch(_){}
}
window.playTrack = playTrack;

/* Player stub */
window.Player = window.Player || { toggle(){}, next(){}, stop(){ const gp=document.getElementById('global-player');if(gp)gp.style.display='none'; }, seekRatio(){}, toggleMinimize(){}, toggleFullscreen(){}, reopenIfActive(){ const gp=document.getElementById('global-player');if(gp)gp.style.display=gp.style.display==='none'?'block':'none'; } };

/* ─── PILL CHIPS ─── */
const Pills = window.Pills = {
  chips: ['YouTube', 'SoundCloud', 'MP3 Local', 'JSON Import'],
  init() { this.renderPills(); },
  renderPills() {
    const el = document.getElementById('pillChips'); if (!el) return;
    el.innerHTML = this.chips.map((c,i) => `<div class="pill-chip ${i===0?'active':''}" onclick="Pills.selectChip(${i})">${c}</div>`).join('');
  },
  selectChip(i) {
    document.querySelectorAll('.pill-chip').forEach((c,j) => c.classList.toggle('active',j===i));
    try { KOBSonoro.sfx('bubble'); } catch(_){}
  }
};

/* ─── SYSTEM CONTROLS (profile system tab) ─── */
function renderControls() {
  const cl = document.getElementById('controlList'); if (!cl) return;
  const name = localStorage.getItem('di_userName') || 'PILOTO';
  cl.innerHTML = `
    <div class="ctrl-row">
      <div><div class="ctrl-label">Nome do Usuário</div><div class="ctrl-sub">${escapeHtml(toArtyaski(name))}</div></div>
      <button class="mini-btn" onclick="document.getElementById('page-profile').querySelector('.profile-name-input').focus()">Editar</button>
    </div>
    <div class="ctrl-row">
      <div><div class="ctrl-label">Fusion Card</div><div class="ctrl-sub">78KARD integrado</div></div>
      <button class="mini-btn active" onclick="setMode('card')">Abrir</button>
    </div>
    <div class="ctrl-row">
      <div><div class="ctrl-label">Arquétipo Ativo</div><div class="ctrl-sub">Baseado no hash do nome</div></div>
      <div class="toggle on" onclick="this.classList.toggle('on')"></div>
    </div>
    <div class="ctrl-row">
      <div><div class="ctrl-label">Sons do Sistema</div><div class="ctrl-sub">Swoosh · Bubble · Crystal</div></div>
      <div class="toggle on" id="soundToggle" onclick="this.classList.toggle('on')"></div>
    </div>
  `;
}

/* ─── BOOT ─── */
function boot() {
  HeroCarousel.init();
  Pills.init();
  Profile.init();
  renderNfRow('nfRowHome', DEFAULT_TRACKS.slice(0,4), '');
  renderNfRow('nfRowSoundcloud', DEFAULT_TRACKS.filter(t=>t.type==='sc'), 'scRowCount');
  renderNfRow('nfRowYoutube', DEFAULT_TRACKS.filter(t=>t.type==='yt'), 'ytRowCount');
  renderNfRow('nfRowAll', DEFAULT_TRACKS, 'allRowCount');
  renderControls();
  updateHomeGreeting();

  const scSlider = document.getElementById('scSeekSlider');
  if (scSlider) {
    scSlider.addEventListener('input', () => { scSlider._dragging = true; window.Player.seekRatio?.(scSlider.value/1000); });
    scSlider.addEventListener('change', () => { scSlider._dragging = false; try { KOBSonoro.sfx('bubble'); } catch(_){} });
  }

  const savedTheme = localStorage.getItem('kob:theme');
  if (savedTheme) document.body.dataset.mode = savedTheme;
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
else boot();

/* Keep avatar in dock nav synced to orb color */
window.addEventListener('di:interface:update', e => {
  const { h1, h2 } = e.detail || {};
  const capsule = document.querySelector('.kb-avatar-capsule');
  if (capsule && h1 != null) {
    capsule.style.background = `linear-gradient(180deg,hsl(${h1},90%,60%),hsl(${(h1+120)%360},85%,45%) 48%,hsl(${h2},90%,55%) 52%,hsl(${(h2+60)%360},80%,55%))`;
  }
  updateHomeGreeting();
  Profile.render();
  renderControls();
});
