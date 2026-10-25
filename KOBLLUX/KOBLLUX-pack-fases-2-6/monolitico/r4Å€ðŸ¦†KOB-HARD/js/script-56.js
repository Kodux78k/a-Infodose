
/* ═══════════════════════════════════════════════════════════════════════════
   KOB · USER VOICE — o nome do usuário como arquétipo vivo
   Depende de: kob-convergence-v1 (opcional), KBLX_VOICE.map, ARCH_MAP, ARCH_LIST
   Registra o usuário em ARCH_MAP + KBLX_VOICE.map + ARCH_LIST.
   Fusion = média de rate/pitch + voz base pt-BR. Cores vêm do hash do nome.
   ═══════════════════════════════════════════════════════════════════════════ */
(function KOBUserVoice(){
  'use strict';
  if (window.KOBUserVoice) return;

  const CONFIG_KEY = 'kob:user-voice';
  const NAME_INPUTS = ['inputUser', 'inputUserId'];

  let config = loadConfig();
  let lastName = '';

  function loadConfig() {
    try {
      const s = JSON.parse(localStorage.getItem(CONFIG_KEY) || '{}');
      return {
        enabled: !!s.enabled,
        fusion: (Array.isArray(s.fusion) && s.fusion.length === 2)
          ? s.fusion.map(x => String(x).toUpperCase())
          : ['ATLAS', 'NOVA']
      };
    } catch (_) { return { enabled: false, fusion: ['ATLAS', 'NOVA'] }; }
  }
  function saveConfig() {
    try { localStorage.setItem(CONFIG_KEY, JSON.stringify(config)); } catch (_) {}
  }
  function getUserName() {
    try { return String(localStorage.getItem('di_userName') || '').trim(); } catch (_) { return ''; }
  }
  function getUserKey() { return getUserName().toUpperCase(); }

  /* Mesma fórmula do koblluxv30.js — cores por hash do nome */
  function getUserColors() {
    const name = getUserName();
    if (!name) return null;
    const seed = [...name].reduce((a, c) => a + c.charCodeAt(0), 0);
    return {
      primary:   `hsl(${seed % 360} 100% 55%)`,
      secondary: `hsl(${(seed * 37) % 360} 90% 45%)`
    };
  }

  /* Fusion: voz base = a do arquétipo que fala pt-BR; rate/pitch = média */
  function getFusedVoice() {
    const [a, b] = config.fusion;
    const map = (window.KBLX_VOICE && window.KBLX_VOICE.map) || {};
    const va = map[a], vb = map[b];
    if (!va || !vb || !va.nome || !vb.nome) return null;
    let base = va;
    const isPtA = va.lang && String(va.lang).startsWith('pt');
    const isPtB = vb.lang && String(vb.lang).startsWith('pt');
    if (!isPtA && isPtB) base = vb;
    return {
      nome: base.nome,
      lang: base.lang || 'pt-BR',
      rate:  ((Number(va.rate)  || 1) + (Number(vb.rate)  || 1)) / 2,
      pitch: ((Number(va.pitch) || 1) + (Number(vb.pitch) || 1)) / 2,
      _fusion: [a, b],
      _base: base.nome
    };
  }

  function getUserHz() {
    const M = window.ARCH_MAP || {};
    const [a, b] = config.fusion;
    const hzA = (M[a] && M[a].hz) || 432;
    const hzB = (M[b] && M[b].hz) || 432;
    return Math.round((hzA + hzB) / 2);
  }

  /* ── REGISTRO nos 3 mapas globais ── */
  function apply() {
    const name = getUserName();
    const key = name.toUpperCase();
    const M = window.ARCH_MAP;
    const V = window.KBLX_VOICE;
    const L = window.ARCH_LIST;
    if (!M || !V || !V.map) return false;

    /* limpa nome anterior se mudou */
    if (lastName && lastName !== key) {
      delete M[lastName];
      delete V.map[lastName];
    }
    lastName = key;

    if (!name || !config.enabled) {
      if (document.body && document.body.dataset.arch === key) {
        try { window.applyArch && window.applyArch('KOBLLUX'); } catch (_) {}
      }
      delete M[key];
      delete V.map[key];
      return false;
    }

    const colors = getUserColors();
    const voice  = getFusedVoice();
    const hz     = getUserHz();

    if (colors) {
      document.documentElement.style.setProperty('--KBLX-USER',   colors.primary);
      document.documentElement.style.setProperty('--KBLX-USER-2', colors.secondary);
    }

    M[key] = {
      tok: '--KBLX-USER',
      op:  '0xFF',
      hz:  hz,
      sym: name[0] || '?',
      _isUser:  true,
      _colors:  colors,
      _voice:   voice
    };

    if (voice) V.map[key] = voice;
    if (L && !L.includes(key)) L.push(key);

    updateWheel();
    return true;
  }

  /* O applyArch não usa --KBLX-USER-2, então reforçamos a cor secundária */
  function enforceUserColors() {
    const cur = ((document.body && document.body.dataset.arch) || '').toUpperCase();
    if (cur !== getUserKey()) return;
    const c = getUserColors(); if (!c) return;
    const r = document.documentElement;
    r.style.setProperty('--kob-L-secondary',      c.secondary);
    r.style.setProperty('--active-secondary',     c.secondary);
    r.style.setProperty('--kob-voice-secondary',  c.secondary);
  }

  /* Adiciona o usuário na wheel de arquétipos (long-press do orb) */
  function updateWheel() {
    const wheel = document.getElementById('archWheel');
    if (!wheel) return;
    wheel.querySelectorAll('[data-is-user="1"]').forEach(e => e.remove());
    const name = getUserName(); if (!name) return;
    const c = getUserColors(); if (!c) return;
    const key = getUserKey();
    const chip = document.createElement('button');
    chip.className = 'arch-pick';
    chip.dataset.isUser = '1';
    chip.style.color = c.primary;
    chip.innerHTML =
      '<div class="a-orb" style="background:' + c.primary + '"></div>'
      + '<div class="a-name">🎤 ' + key + '</div>'
      + '<div class="a-freq">FUSÃO</div>';
    chip.addEventListener('click', (e) => {
      e.stopPropagation();
      try { window.applyArch && window.applyArch(key); } catch (_) {}
      if (window.__sbSync) window.__sbSync(key);
      document.getElementById('arch-overlay')?.classList.remove('open');
    });
    wheel.appendChild(chip);
  }

  /* ── WATCH do nome ── */
  function watchName() {
    const cur = getUserKey();
    if (cur !== lastName) { lastName = ''; apply(); paintAll(); }
  }
  NAME_INPUTS.forEach(id => {
    const el = document.getElementById(id);
    if (el && !el.__ubvWatched) {
      el.__ubvWatched = true;
      el.addEventListener('input', () => setTimeout(watchName, 400));
    }
  });
  setInterval(watchName, 2000);
  window.addEventListener('storage', (e) => {
    if (e.key === 'di_userName') { lastName = ''; watchName(); }
  });

  /* Reforça cor do usuário quando ele está ativo */
  window.addEventListener('kob:arch', () => setTimeout(enforceUserColors, 30));
  setInterval(enforceUserColors, 800);
  if (window.KOBLayers && typeof window.KOBLayers.refresh === 'function') {
    const orig = window.KOBLayers.refresh;
    window.KOBLayers.refresh = function() {
      const r = orig.apply(this, arguments);
      setTimeout(enforceUserColors, 0);
      return r;
    };
  }

  /* ── UI · Fusion Card (System & Neural) ── */
  function mountFusionCard() {
    const host = document.getElementById('systemCard');
    if (!host || document.getElementById('kobUserVoiceSection')) return;
    const saveBtn = document.getElementById('saveSystemBtn');
    if (!saveBtn) return;

    const sec = document.createElement('div');
    sec.id = 'kobUserVoiceSection';
    sec.style.cssText = 'margin-top:10px;padding:10px;border:1px solid rgba(80,200,200,0.28);border-radius:10px;background:rgba(80,200,200,0.05)';
    sec.innerHTML =
      '<div style="display:flex;align-items:center;gap:8px;margin-bottom:8px">'
      +   '<span style="font-size:1.1rem">🎤</span>'
      +   '<strong style="font-size:0.82rem;letter-spacing:0.03em;color:#50c8c8">VOZ DO USUÁRIO</strong>'
      + '</div>'
      + '<label style="display:flex;align-items:center;gap:8px;cursor:pointer;font-size:0.78rem;margin-bottom:6px">'
      +   '<input type="checkbox" id="kobUVToggle" style="width:14px;height:14px;accent-color:#50c8c8">'
      +   '<span>Ativar fusão (nome vira arquétipo)</span>'
      + '</label>'
      + '<div id="kobUVBody" style="display:none">'
      +   '<div style="display:flex;gap:6px;margin-bottom:6px">'
      +     '<select id="kobUVA" style="flex:1;padding:5px;background:rgba(0,0,0,0.4);border:1px solid rgba(80,200,200,0.3);border-radius:6px;color:#fff;font-size:0.72rem"></select>'
      +     '<span style="align-self:center;color:#50c8c8;font-weight:700">+</span>'
      +     '<select id="kobUVB" style="flex:1;padding:5px;background:rgba(0,0,0,0.4);border:1px solid rgba(80,200,200,0.3);border-radius:6px;color:#fff;font-size:0.72rem"></select>'
      +   '</div>'
      +   '<div id="kobUVInfo" style="font-size:0.68rem;color:rgba(255,255,255,0.6);margin-bottom:6px;line-height:1.5"></div>'
      +   '<button id="kobUVTest" type="button" style="width:100%;padding:6px;background:rgba(80,200,200,0.12);border:1px solid rgba(80,200,200,0.4);border-radius:6px;color:#50c8c8;font-size:0.7rem;font-weight:700;letter-spacing:0.06em;cursor:pointer">🔊 TESTAR VOZ FUSIONADA</button>'
      +   '<div style="margin-top:8px;padding:6px;background:rgba(0,0,0,0.22);border-left:2px solid #50c8c8;border-radius:0 6px 6px 0;font-size:0.66rem;color:rgba(255,255,255,0.55);line-height:1.5">'
      +     '<strong style="color:#50c8c8">💡 SUGESTÃO P/ SYSTEM PROMPT:</strong><br>'
      +     '<span id="kobUVPrompt">—</span>'
      +   '</div>'
      + '</div>';
    saveBtn.parentNode.insertBefore(sec, saveBtn);

    const toggle = sec.querySelector('#kobUVToggle');
    const body   = sec.querySelector('#kobUVBody');
    const selA   = sec.querySelector('#kobUVA');
    const selB   = sec.querySelector('#kobUVB');
    const info   = sec.querySelector('#kobUVInfo');
    const prompt = sec.querySelector('#kobUVPrompt');

    function populate() {
      const valid = (window.ARCH_LIST || []).filter(n => {
        const m = window.KBLX_VOICE?.map?.[n];
        return m && m.nome && n !== getUserKey();
      });
      [selA, selB].forEach(sel => {
        sel.innerHTML = valid.map(n => '<option value="' + n + '">' + n + '</option>').join('');
      });
      if (valid.includes(config.fusion[0])) selA.value = config.fusion[0];
      if (valid.includes(config.fusion[1])) selB.value = config.fusion[1];
    }
    function refresh() {
      toggle.checked = config.enabled;
      body.style.display = config.enabled ? 'block' : 'none';
      const name = getUserName(), voice = getFusedVoice();
      if (!name) { info.textContent = 'Digite seu nome no campo "Identifique-se" acima primeiro.'; }
      else if (!voice) { info.textContent = name + ' · aguardando arquétipos carregarem.'; }
      else {
        const c = getUserColors();
        info.innerHTML =
          '<span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:' + c.primary + ';vertical-align:middle;margin-right:6px"></span>'
          + '<strong style="color:#50c8c8">' + name + '</strong>'
          + ' · ' + config.fusion[0] + ' + ' + config.fusion[1]
          + ' · <strong>' + getUserHz() + 'Hz</strong>'
          + '<br><span style="opacity:.6">voz base: ' + voice._base + ' · rate ' + voice.rate.toFixed(2) + ' · pitch ' + voice.pitch.toFixed(2) + '</span>';
      }
      prompt.textContent = name
        ? ('O usuário se chama "' + name + '". Quando esse nome aparecer no texto, trate como arquétipo especial: use a voz fusionada de ' + config.fusion[0] + ' + ' + config.fusion[1] + '.')
        : 'Digite seu nome para gerar a sugestão.';
    }

    toggle.addEventListener('change', () => {
      config.enabled = toggle.checked; saveConfig(); apply(); refresh();
      const k = document.getElementById('kobUVKcaToggle'); if (k) k.checked = config.enabled;
    });
    selA.addEventListener('change', () => {
      config.fusion[0] = selA.value; saveConfig(); apply(); refresh();
      const k = document.getElementById('kobUVKcaA'); if (k) k.value = selA.value;
    });
    selB.addEventListener('change', () => {
      config.fusion[1] = selB.value; saveConfig(); apply(); refresh();
      const k = document.getElementById('kobUVKcaB'); if (k) k.value = selB.value;
    });
    sec.querySelector('#kobUVTest').addEventListener('click', testVoice);

    populate(); refresh();
    let t = 0;
    const iv = setInterval(() => {
      if (window.ARCH_MAP && Object.keys(window.ARCH_MAP).length > 10) { populate(); refresh(); clearInterval(iv); }
      if (++t > 60) clearInterval(iv);
    }, 200);
  }

  /* ── UI · painel do visualizador (KCA) ── */
  function mountKcaPanel() {
    const panel = document.getElementById('kca-panel');
    if (!panel || document.getElementById('kobUserVoiceKca')) return;
    const foot = panel.querySelector('.kca-foot');
    if (!foot) return;

    const sec = document.createElement('section');
    sec.id = 'kobUserVoiceKca';
    sec.innerHTML =
      '<div class="kca-label">🎤 Voz do usuário · fusão</div>'
      + '<label class="kca-check" style="margin-bottom:6px">'
      +   '<input type="checkbox" id="kobUVKcaToggle">'
      +   '<span>Ativar</span>'
      + '</label>'
      + '<div id="kobUVKcaBody" style="display:none">'
      +   '<div style="display:flex;gap:4px;margin-bottom:6px">'
      +     '<select id="kobUVKcaA" style="flex:1;padding:4px;background:rgba(0,0,0,0.35);border:1px solid var(--kca-line,rgba(0,242,255,0.2));border-radius:6px;color:#cfe;font:600 10px/1 inherit;outline:none"></select>'
      +     '<select id="kobUVKcaB" style="flex:1;padding:4px;background:rgba(0,0,0,0.35);border:1px solid var(--kca-line,rgba(0,242,255,0.2));border-radius:6px;color:#cfe;font:600 10px/1 inherit;outline:none"></select>'
      +   '</div>'
      +   '<div id="kobUVKcaInfo" style="font:500 10px/1.4 ui-monospace,monospace;color:#9aa4b8;padding:4px 6px;background:rgba(0,0,0,0.25);border-radius:6px;margin-bottom:6px"></div>'
      +   '<div class="kca-aud" style="grid-template-columns:1fr">'
      +     '<button type="button" class="kca-btn" id="kobUVKcaTest">🔊 TESTAR</button>'
      +   '</div>'
      + '</div>';
    panel.insertBefore(sec, foot);

    const toggle = sec.querySelector('#kobUVKcaToggle');
    const body   = sec.querySelector('#kobUVKcaBody');
    const selA   = sec.querySelector('#kobUVKcaA');
    const selB   = sec.querySelector('#kobUVKcaB');
    const info   = sec.querySelector('#kobUVKcaInfo');

    function populate() {
      const valid = (window.ARCH_LIST || []).filter(n => {
        const m = window.KBLX_VOICE?.map?.[n];
        return m && m.nome && n !== getUserKey();
      });
      [selA, selB].forEach(sel => {
        sel.innerHTML = valid.map(n => '<option value="' + n + '">' + n + '</option>').join('');
      });
      if (valid.includes(config.fusion[0])) selA.value = config.fusion[0];
      if (valid.includes(config.fusion[1])) selB.value = config.fusion[1];
    }
    function refresh() {
      toggle.checked = config.enabled;
      body.style.display = config.enabled ? 'block' : 'none';
      const name = getUserName(), voice = getFusedVoice();
      if (!name) info.textContent = 'sem nome definido';
      else if (!voice) info.textContent = name + ' · aguardando';
      else info.innerHTML = '<strong>' + name + '</strong> · ' + config.fusion[0] + '+' + config.fusion[1] + '<br>' + getUserHz() + 'Hz · base ' + voice._base;
    }

    toggle.addEventListener('change', () => {
      config.enabled = toggle.checked; saveConfig(); apply(); refresh();
      const f = document.getElementById('kobUVToggle'); if (f) f.checked = config.enabled;
      const b = document.getElementById('kobUVBody'); if (b) b.style.display = config.enabled ? 'block' : 'none';
    });
    selA.addEventListener('change', () => {
      config.fusion[0] = selA.value; saveConfig(); apply(); refresh();
      const f = document.getElementById('kobUVA'); if (f) f.value = selA.value;
    });
    selB.addEventListener('change', () => {
      config.fusion[1] = selB.value; saveConfig(); apply(); refresh();
      const f = document.getElementById('kobUVB'); if (f) f.value = selB.value;
    });
    sec.querySelector('#kobUVKcaTest').addEventListener('click', testVoice);

    populate(); refresh();
    let t = 0;
    const iv = setInterval(() => {
      if (window.ARCH_MAP && Object.keys(window.ARCH_MAP).length > 10) { populate(); refresh(); clearInterval(iv); }
      if (++t > 60) clearInterval(iv);
    }, 200);
  }

  function testVoice() {
    const name = getUserName();
    if (!name) { if (window.KBLX_TOAST) KBLX_TOAST('Digite seu nome primeiro'); return; }
    const voice = getFusedVoice(); if (!voice) return;
    try {
      speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(
        'Olá, eu sou ' + name + '. Minha voz é a fusão de ' + config.fusion[0] + ' com ' + config.fusion[1] + '.'
      );
      u.lang = voice.lang;
      u.rate = voice.rate;
      u.pitch = voice.pitch;
      const found = speechSynthesis.getVoices().find(v => v.name && v.name.toLowerCase().includes(voice.nome.toLowerCase()));
      if (found) u.voice = found;
      speechSynthesis.speak(u);
    } catch (_) {}
  }

  function paintAll() { mountFusionCard(); mountKcaPanel(); }

  /* Boot: retry até ARCH_MAP / KBLX_VOICE existirem */
  let tries = 0;
  (function boot() {
    if (apply()) { paintAll(); return; }
    if (++tries > 100) return;
    setTimeout(boot, 150);
  })();
  [500, 1500, 3000, 5000].forEach(t => setTimeout(paintAll, t));
  window.addEventListener('load', () => setTimeout(paintAll, 800));

  /* ── API pública ── */
  window.KOBUserVoice = {
    get enabled() { return config.enabled; },
    set enabled(v) { config.enabled = !!v; saveConfig(); apply(); paintAll(); },
    get fusion() { return config.fusion.slice(); },
    set fusion(v) {
      if (Array.isArray(v) && v.length === 2) {
        config.fusion = v.map(x => String(x).toUpperCase());
        saveConfig(); apply(); paintAll();
      }
    },
    get name()   { return getUserName(); },
    get colors() { return getUserColors(); },
    get voice()  { return getFusedVoice(); },
    get hz()     { return getUserHz(); },
    apply, test: testVoice,
    systemPromptSuggestion() {
      const name = getUserName();
      if (!name) return '';
      return 'O usuário se chama "' + name + '". Quando esse nome aparecer no texto, trate como arquétipo especial: use a voz fusionada de ' + config.fusion[0] + ' + ' + config.fusion[1] + '.';
    }
  };

  console.log(
    '%c[KOB-USER-VOICE] %cpronto · KOBUserVoice.enabled=true para ativar',
    'background:#50c8c8;color:#000;padding:2px 8px;border-radius:3px',
    'color:#50c8c8'
  );
})();
