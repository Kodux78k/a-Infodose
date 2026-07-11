(function() {
  // =========================================
  // 1. ACORDEÃO (mantido original)
  // =========================================
  function makeCollapsible(node) {
    if (!node || node.dataset.accordionInit) return;
    node.dataset.accordionInit = "true";
    const header = node.querySelector('.accordion-header');
    const body = node.querySelector('.collapsible-body');
    if (!header || !body) return;
    if (!header.querySelector('.indicator')) {
      const indicator = document.createElement('span');
      indicator.className = 'indicator';
      indicator.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>';
      header.appendChild(indicator);
    }
    if (!node.classList.contains('is-collapsed') && !node.classList.contains('is-open')) node.classList.add('is-open');
    if (node.classList.contains('is-collapsed')) body.style.height = '0px';
    header.addEventListener('click', (e) => {
      const targetTag = e.target.tagName.toLowerCase();
      if (['input', 'select', 'button', 'textarea'].includes(targetTag)) return;
      const isCollapsed = node.classList.contains('is-collapsed');
      if (isCollapsed) {
        node.classList.remove('is-collapsed');
        node.classList.add('is-open');
        body.style.height = body.scrollHeight + 'px';
        body.addEventListener('transitionend', function handler(ev) {
          if (ev.propertyName === 'height') {
            body.style.height = 'auto';
            body.removeEventListener('transitionend', handler);
          }
        });
      } else {
        body.style.height = body.scrollHeight + 'px';
        void body.offsetHeight;
        node.classList.remove('is-open');
        node.classList.add('is-collapsed');
        body.style.height = '0px';
      }
    });
  }
  window.KobAccordion = {
    open: (card) => { card = (typeof card === 'string') ? document.querySelector(card) : card; if(card){ card.classList.remove('is-collapsed'); card.classList.add('is-open'); } },
    close: (card) => { card = (typeof card === 'string') ? document.querySelector(card) : card; if(card){ card.classList.remove('is-open'); card.classList.add('is-collapsed'); } },
    toggle: (card) => { card = (typeof card === 'string') ? document.querySelector(card) : card; card && card.querySelector('.accordion-header')?.click(); }
  };
  const observer = new MutationObserver((muts) => {
    muts.forEach((m) => {
      m.addedNodes && m.addedNodes.forEach((node) => {
        if (!(node instanceof Element)) return;
        if (node.matches && node.matches('.accordion')) makeCollapsible(node);
        node.querySelectorAll && node.querySelectorAll('.accordion').forEach((el) => makeCollapsible(el));
      });
    });
  });
  if (document.body) observer.observe(document.body, { childList: true, subtree: true });
  document.querySelectorAll('.accordion').forEach(makeCollapsible);

  // =========================================
  // 2. BASE DE ARQUÉTIPOS + USER
  // =========================================
  const di_userNameRaw = localStorage.getItem("di_userName") || "";
  const userKey = di_userNameRaw.trim().toLowerCase();
  const displayUserName = di_userNameRaw.trim() || "User";
  
  let ARCHETYPES_BASE = [
  "atlas", "nova", "vitalis", "pulse", "kaos", "kodux", "lumine",
  "aion", "kobllux", "artemis", "serena", "genus", "solus",
  "rhea", "uno", "dual", "trinity", "infodose", "horus", "bllue",
   "luxara",
  "velor", "elysha", "sylon", "naira", "thenir", "eloh", "novael",
  "aelya", "ignyra", "lumara", "kaythar", "elya", "sylla", "anamyx",
  "yamantek", "metalux", "kd1", "koφd1", "christos",
  "aek_dion", "aekael_domnnus", "nephesh_elyon"
];

if (userKey && !ARCHETYPES_BASE.includes(userKey)) {
  ARCHETYPES_BASE.push(userKey);
}

const ARCHETYPES = [...ARCHETYPES_BASE];

const ARCH_NAMES = {
  atlas: "Atlas",
  nova: "Nova",
  vitalis: "Vitalis",
  pulse: "Pulse",
  kaos: "Kaos",
  kodux: "Kodux",
  lumine: "Lumine",
  aion: "Aion",
  kobllux: "Kobllux",
  artemis: "Artemis",
  serena: "Serena",
  genus: "Genus",
  solus: "Solus",
  rhea: "Rhea",
  uno: "Uno",
  dual: "Dual",
  trinity: "Trinity",
  infodose: "Infodose",
  horus: "Horus",
  bllue: "Bllue",

elysha: "Elysha",
Luxara: "Luxara",

  velor: "Velor",

  sylon: "Sylon",
  naira: "Naira",
  thenir: "Thenir",
  eloh: "Eloh",
  novael: "Novael",

  aelya: "Aelya",
  ignyra: "Ignyra",
  lumara: "Lumara",

  kaythar: "Kaythar",
  sylla: "Sylla",
    elya: "Elya",
  anamyx: "Anamyx",

  yamantek: "Yamantek",
  metalux: "Metalux",
  kd1: "KD1",
  "koφd1": "KOΦD1",
  christos: "Christos",

  k_dion: "a€K_Dion",
  kael_domnnus: "a€Kael DommnuS",
  nephesh_elyon: "a€Nephesh Elyon"
};
  if (userKey) ARCH_NAMES[userKey] = di_userNameRaw.trim();

  const userOption = document.getElementById("diUserOption");
  if (userOption) {
    userOption.value = userKey || "user";
    userOption.textContent = `${displayUserName} (Usuário/Núcleo)`;
  }

  // =========================================
  // 3. MOTOR 3·6·9 (com persistência)
  // =========================================
  let di_engineStep = parseInt(localStorage.getItem('kobllux_engine_step') || '0', 10);
  let di_reverse = localStorage.getItem('kobllux_reverse_mode') === 'true';
  let di_jump = parseInt(localStorage.getItem('kobllux_jump_step') || '0', 10);
  let di_use3697 = localStorage.getItem('kobllux_cycle_3697') === 'true';

  function saveEngineState() {
    localStorage.setItem('kobllux_engine_step', String(di_engineStep));
    localStorage.setItem('kobllux_reverse_mode', String(di_reverse));
    localStorage.setItem('kobllux_jump_step', String(di_jump));
    localStorage.setItem('kobllux_cycle_3697', String(di_use3697));
  }

  function syncEngineUI() {
    document.querySelectorAll('[data-engine]').forEach(btn => {
      const val = parseInt(btn.dataset.engine, 10);
      if (val === di_engineStep) btn.classList.add('is-active');
      else btn.classList.remove('is-active');
    });
    document.querySelectorAll('[data-jump]').forEach(btn => {
      const val = parseInt(btn.dataset.jump, 10);
      if (val === di_jump) btn.classList.add('is-active');
      else btn.classList.remove('is-active');
    });
    const reverseBtn = document.getElementById('reverseToggle');
    if (reverseBtn) {
      reverseBtn.textContent = `Reverse: ${di_reverse ? 'ON' : 'OFF'}`;
      reverseBtn.classList.toggle('is-active', di_reverse);
    }
    const cycleBtn = document.getElementById('cycle3697');
    if (cycleBtn) {
      cycleBtn.textContent = `3-6-9-7: ${di_use3697 ? 'ON' : 'OFF'}`;
      cycleBtn.classList.toggle('is-active', di_use3697);
    }
  }

  function di_getSequence(startIndex, length) {
    const total = ARCHETYPES.length;
    const sequence = [];
    let currentIndex = ((startIndex % total) + total) % total;
    const pattern = di_use3697 ? [3, 6, 9, 7] : [di_engineStep];
    for (let i = 0; i < length; i++) {
      sequence.push(ARCHETYPES[currentIndex]);
      let step = pattern[i % pattern.length];
      if (di_reverse) step *= -1;
      step += di_jump;
      currentIndex = (currentIndex + step) % total;
      if (currentIndex < 0) currentIndex += total;
    }
    return sequence;
  }

  function updateStatusWithEngine() {
    const statusBar = document.getElementById('statusBar');
    if (statusBar && !statusBar.textContent.includes('Opcode')) {
      statusBar.textContent = `Motor ${di_engineStep} · ${di_reverse ? 'Reverse' : 'Forward'} · salto +${di_jump} · ${di_use3697 ? '3-6-9-7' : 'Linear'}`;
    }
  }

  // eventos dos controles
  document.querySelectorAll('[data-engine]').forEach(btn => {
    btn.addEventListener('click', () => {
      di_engineStep = parseInt(btn.dataset.engine, 10);
      saveEngineState();
      syncEngineUI();
      updateStatusWithEngine();
      showToast(`Motor +${di_engineStep} ativado`);
    });
  });
  document.querySelectorAll('[data-jump]').forEach(btn => {
    btn.addEventListener('click', () => {
      di_jump = parseInt(btn.dataset.jump, 10);
      saveEngineState();
      syncEngineUI();
      updateStatusWithEngine();
      showToast(`Salto extra +${di_jump}`);
    });
  });
  const reverseBtnDom = document.getElementById('reverseToggle');
  if (reverseBtnDom) {
    reverseBtnDom.addEventListener('click', () => {
      di_reverse = !di_reverse;
      saveEngineState();
      syncEngineUI();
      updateStatusWithEngine();
      showToast(`Reverse ${di_reverse ? 'ATIVADO' : 'DESATIVADO'}`);
    });
  }
  const cycleBtnDom = document.getElementById('cycle3697');
  if (cycleBtnDom) {
    cycleBtnDom.addEventListener('click', () => {
      di_use3697 = !di_use3697;
      saveEngineState();
      syncEngineUI();
      updateStatusWithEngine();
      showToast(`Ciclo 3-6-9-7 ${di_use3697 ? 'ATIVADO' : 'DESATIVADO'}`);
    });
  }
  syncEngineUI();
  updateStatusWithEngine();

  // =========================================
  // 4. DOM ELEMENTOS
  // =========================================
  const dom = {
    input: document.getElementById('inputText'),
    output: document.getElementById('outputContainer'),
    genBtn: document.getElementById('genBtn'),
    archSelect: document.getElementById('startArch'),
    cycleCheck: document.getElementById('cycleMode'),
    body: document.body,
    copyBtn: document.getElementById('copyBtn'),
    clearBtn: document.getElementById('clearBtn'),
    downloadBtn: document.getElementById('downloadBtn'),
    statusBar: document.getElementById('statusBar'),
    hudStatus: document.getElementById('hudStatus'),
    toastContainer: document.getElementById('toast-container'),
    mainCard: document.getElementById('mainHeroCard')
  };

  function showToast(message, isError = false) {
    if (!dom.toastContainer) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    if (!isError) {
      const currentColor = getComputedStyle(document.body).getPropertyValue('--kob-voice-primary').trim();
      if (currentColor) toast.style.background = currentColor;
    } else toast.style.background = "#c44";
    dom.toastContainer.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  }

  if (dom.input) {
    const savedInput = localStorage.getItem('kobllux_draft_input');
    if (savedInput) dom.input.value = savedInput;
  }

  if (dom.archSelect) {
    dom.archSelect.addEventListener('change', (e) => {
      dom.body.setAttribute('data-arch', e.target.value);
    });
  }

  // =========================================
  // 5. FUNÇÃO GERAR FRACTAIS (COM MOTOR)
  // =========================================
  function generateFractals() {
    if (!dom.input || !dom.output || !dom.archSelect || !dom.cycleCheck) return;
    const text = dom.input.value.trim();
    if (!text) {
      showToast("Aviso: Texto de entrada vazio.", true);
      return;
    }
    localStorage.setItem('kobllux_draft_input', text);

    const sentencesMatch = text.replace(/\n+/g, ' ').match(/[^.!?]+[.!?]+|[^.!?]+$/g);
    const sentences = sentencesMatch ? sentencesMatch.map(s => s.trim()).filter(Boolean) : [];
    if (sentences.length === 0) return;

    const startArchName = dom.archSelect.value;
    const startIdx = ARCHETYPES.indexOf(startArchName);
    const isCycleMode = dom.cycleCheck.checked;

    // SEQUÊNCIA VIA MOTOR 3·6·9
    const sequence = isCycleMode ? di_getSequence(startIdx, sentences.length) : [ARCHETYPES[startIdx]];

    dom.output.innerHTML = '';
    let resultTextForExport = "";

    sentences.forEach((sentence, i) => {
      const currentArchName = isCycleMode ? sequence[i] : ARCHETYPES[startIdx];

      const block = document.createElement('div');
      block.className = 'para-block accordion is-open';
      block.style.animationDelay = `${i * 0.1}s`;

      const dummyBody = document.createElement('body');
      dummyBody.setAttribute('data-arch', currentArchName);
      document.documentElement.appendChild(dummyBody);
      const archColor = getComputedStyle(dummyBody).getPropertyValue('--kob-voice-primary').trim();
      document.documentElement.removeChild(dummyBody);

      block.style.setProperty('--kob-voice-primary', archColor);
      block.style.setProperty('--kob-voice-bg-soft', `color-mix(in srgb, ${archColor} 12%, transparent)`);
      block.style.borderLeftColor = archColor;
      block.style.setProperty('--card-accent', archColor);

      const displayArchName = ARCH_NAMES[currentArchName] || currentArchName;

      block.innerHTML = `
        <div class="accordion-header">
          <div class="arch-tag" style="color: ${archColor}; border-color: color-mix(in srgb, ${archColor} 30%, rgba(255,255,255,0.1))">
            ${displayArchName} · Δ
          </div>
        </div>
        <div class="collapsible-body">
          <div class="content-inner">${escapeHtml(sentence)}</div>
        </div>
      `;
      dom.output.appendChild(block);
      resultTextForExport += `${displayArchName.toUpperCase()} — ${sentence}\n\n`;
    });

    localStorage.setItem('kobllux_last_result', resultTextForExport.trim());
    const total = sentences.length;
    if (dom.statusBar) dom.statusBar.textContent = `Opcode 0x0B · Motor 3·6·9 · ${total} Fractal(s) Gerado(s)`;
    if (dom.hudStatus) dom.hudStatus.textContent = `Δ-${total}`;
    
    if (dom.mainCard && dom.mainCard.classList.contains('is-open')) {
      dom.mainCard.querySelector('.accordion-header')?.click();
    }
    showToast(`Integração concluída | Motor: +${di_engineStep} | Reverse: ${di_reverse ? 'ON' : 'OFF'} | Salto: +${di_jump} | ${di_use3697 ? 'Ciclo 3697' : 'Linear'}`);
  }

  function escapeHtml(str) {
    return str.replace(/[&<>]/g, function(m) {
      if (m === '&') return '&amp;';
      if (m === '<') return '&lt;';
      if (m === '>') return '&gt;';
      return m;
    });
  }

  // eventos principais
  if (dom.genBtn) dom.genBtn.addEventListener('click', generateFractals);
  if (dom.input) {
    dom.input.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') generateFractals();
    });
  }

  // copiar / limpar / download
  if (dom.copyBtn) {
    dom.copyBtn.addEventListener('click', async () => {
      const content = localStorage.getItem('kobllux_last_result');
      if (!content) { showToast("Nenhum fractal para copiar.", true); return; }
      try {
        await navigator.clipboard.writeText(content);
        showToast("Fractais copiados para o Códex");
      } catch (err) {
        const ta = document.createElement('textarea');
        ta.value = content;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        showToast("Fractais copiados (fallback)");
      }
    });
  }
  if (dom.clearBtn) {
    dom.clearBtn.addEventListener('click', () => {
      if (dom.input) dom.input.value = '';
      if (dom.output) dom.output.innerHTML = '<div class="empty-state">Sistema reiniciado. Aguardando novos dados.</div>';
      localStorage.removeItem('kobllux_last_result');
      localStorage.removeItem('kobllux_draft_input');
      if (dom.statusBar) dom.statusBar.textContent = 'Sistema em repouso · Matrix Pronta';
      if (dom.hudStatus) dom.hudStatus.textContent = '78K-ID';
      if (dom.mainCard && dom.mainCard.classList.contains('is-collapsed')) dom.mainCard.querySelector('.accordion-header')?.click();
      showToast("Memória Limpa");
    });
  }
  if (dom.downloadBtn) {
    dom.downloadBtn.addEventListener('click', () => {
      const content = localStorage.getItem('kobllux_last_result');
      if (!content) { showToast("Nenhum fractal para transferir.", true); return; }
      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `KOBLLUX_Fractais_${new Date().toISOString().slice(0,10)}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast("Transferência Concluída");
    });
  }

  // data-arch inicial
  if (dom.archSelect) dom.body.setAttribute('data-arch', dom.archSelect.value);
})();



(async () => {
  try {
    const ARCHETYPES = await fetch(
      "https://www.infodose.com.br/js/modules/archetypes.json"
    ).then(r => r.json());

    const select = document.getElementById("startArch");
    const userName = localStorage.getItem("di_userName") || "User";

    if (select && Array.isArray(ARCHETYPES) && ARCHETYPES.length) {
      select.innerHTML = "";

      const userOpt = document.createElement("option");
      userOpt.value = userName.toLowerCase();
      userOpt.textContent = `${userName} (Usuário/Núcleo)`;
      select.appendChild(userOpt);

      ARCHETYPES.forEach(a => {
        const opt = document.createElement("option");
        opt.value = a.id || a.name || "";
        opt.textContent = a.name || a.id || "Archetype";
        select.appendChild(opt);
      });

      window.ARCHETYPES = ARCHETYPES;
      window.ARCHETYPE_IDS = ARCHETYPES.map(a => a.id);
      window.ARCHETYPE_NAMES = ARCHETYPES.map(a => a.name);
      window.ARCHETYPE_MAP = Object.fromEntries(
        ARCHETYPES.map(a => [a.id, a])
      );
    }

    console.log("[78K] Archetypes JSON carregado");
  } catch (err) {
    console.error("[78K] Falha ao carregar archetypes.json", err);
  }
})();

lucide.createIcons();

    const els = {
      card: document.getElementById('mainCard'),
      header: document.getElementById('cardHeader'),
      avatarTgt: document.getElementById('avatarTarget'),
      input: document.getElementById('inputUser'),
      lblHello: document.getElementById('lblHello'),
      lblName: document.getElementById('lblName'),
      clock: document.getElementById('clockTime'),
      smallPreview: document.getElementById('smallPreview'),
      smallMiniAvatar: document.getElementById('smallMiniAvatar'),
      smallText: document.getElementById('smallText'),
      smallIdent: document.getElementById('smallIdent'),
      actCard: document.getElementById('activationCard'),
      actPre: document.getElementById('actPre'),
      actName: document.getElementById('actName'),
      actMiniAvatar: document.getElementById('actMiniAvatar'),
      actBadge: document.getElementById('actBadge'),
      securityStatus: document.getElementById('securityStatus'),
      // Buttons
      btnModeCard: document.getElementById('btnModeCard'),
      btnModeOrb: document.getElementById('btnModeOrb'),
      btnModeHud: document.getElementById('btnModeHud'),
      orbMenuTrigger: document.getElementById('orbMenuTrigger'),
      hudMenuBtn: document.getElementById('hudMenuBtn'),
      snapZone: document.getElementById('snap-zone'),
      // Keys UI
      keysModal: document.getElementById('keysModal'),
      keyList: document.getElementById('keyList'),
      keyName: document.getElementById('keyNameInput'),
      keyToken: document.getElementById('keyTokenInput'),
      keyWebhook: document.getElementById('keyWebhookInput'),
      addKeyBtn: document.getElementById('addKeyBtn'),
      closeKeysBtn: document.getElementById('closeKeysBtn'),
      testWebhookBtn: document.getElementById('testWebhookBtn'),
      exportKeysBtn: document.getElementById('exportKeysBtn'),
      importKeysBtn: document.getElementById('importKeysBtn'),
      importFileInput: document.getElementById('importFileInput'),
      lockVaultBtn: document.getElementById('lockVaultBtn'),
      vaultStatusText: document.getElementById('vaultStatusText'),
      // Vault UI
      vaultModal: document.getElementById('vaultModal'),
      vaultPass: document.getElementById('vaultPassInput'),
      vaultUnlock: document.getElementById('vaultUnlockBtn'),
      vaultCancel: document.getElementById('vaultCancelBtn'),
      // New System UI
      systemCard: document.getElementById('systemCard'),
      toggleBtnF: document.getElementById('toggleBtnF')
    };

    // --- CRYPTO UTILS ---
    const CRYPTO = {
      algo: { name: 'AES-GCM', length: 256 },
      pbkdf2: { name: 'PBKDF2', hash: 'SHA-256', iterations: 100000 },
      salt: window.crypto.getRandomValues(new Uint8Array(16)), 
      async getKey(password, salt) {
        const enc = new TextEncoder();
        const keyMaterial = await window.crypto.subtle.importKey("raw", enc.encode(password), "PBKDF2", false, ["deriveKey"]);
        return window.crypto.subtle.deriveKey({ ...this.pbkdf2, salt: salt }, keyMaterial, this.algo, false, ["encrypt", "decrypt"]);
      },
      async encrypt(data, password) {
        const salt = window.crypto.getRandomValues(new Uint8Array(16));
        const iv = window.crypto.getRandomValues(new Uint8Array(12));
        const key = await this.getKey(password, salt);
        const encoded = new TextEncoder().encode(JSON.stringify(data));
        const encrypted = await window.crypto.subtle.encrypt({ name: "AES-GCM", iv: iv }, key, encoded);
        const bundle = { s: Array.from(salt), iv: Array.from(iv), d: Array.from(new Uint8Array(encrypted)) };
        return JSON.stringify(bundle);
      },
      async decrypt(bundleStr, password) {
        try {
          const bundle = JSON.parse(bundleStr);
          const salt = new Uint8Array(bundle.s);
          const iv = new Uint8Array(bundle.iv);
          const data = new Uint8Array(bundle.d);
          const key = await this.getKey(password, salt);
          const decrypted = await window.crypto.subtle.decrypt({ name: "AES-GCM", iv: iv }, key, data);
          return JSON.parse(new TextDecoder().decode(decrypted));
        } catch(e) { throw new Error("Senha incorreta ou dados corrompidos"); }
      }
    };

    // --- STATE & PERSISTENCE ---
    const STORAGE_KEY = 'fusion_os_data_v2';
    const UI_STATE_KEY = 'fusion_os_ui_state';
    
    let STATE = {
      keys: [], 
      user: 'Convidado',
      isEncrypted: false,
      encryptedData: null
    };
    let SESSION_PASSWORD = null;

    function saveUIState() {
        const mode = state.isOrb ? 'orb' : (state.isHud ? 'hud' : 'card');
        const uiState = {
            mode: mode,
            left: els.card.style.left,
            top: els.card.style.top,
            zen: document.body.classList.contains('zen-mode')
        };
        localStorage.setItem(UI_STATE_KEY, JSON.stringify(uiState));
    }
    
    function loadUIState() {
        const raw = localStorage.getItem(UI_STATE_KEY);
        if(!raw) return;
        try {
            const ui = JSON.parse(raw);
            if(ui.zen) {
                document.body.classList.add('zen-mode');
                document.getElementById('mantra-toggle').classList.add('collapsed');
                if(document.getElementById('zenModeCheckbox')) document.getElementById('zenModeCheckbox').checked = true;
            }
            if (ui.mode === 'orb' || ui.mode === 'hud') {
                els.card.style.transition = 'none'; 
                if (ui.mode === 'orb') {
                    if(ui.left) els.card.style.left = ui.left;
                    if(ui.top) els.card.style.top = ui.top;
                    window.setMode('orb', true);
                } else {
                    window.setMode('hud', true);
                }
                setTimeout(() => els.card.style.transition = '', 200);
            }
        } catch(e) { console.error("UI Load Error", e); }
    }

    function saveData() {
      const payload = { keys: STATE.keys, user: STATE.user };
      if (SESSION_PASSWORD) {
        CRYPTO.encrypt(payload, SESSION_PASSWORD).then(enc => {
          localStorage.setItem(STORAGE_KEY, JSON.stringify({ isEncrypted: true, data: enc }));
          STATE.isEncrypted = true;
          STATE.encryptedData = enc;
          updateSecurityUI();
        });
      } else {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ isEncrypted: false, data: payload }));
      }
    }

    async function loadData() {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (parsed.isEncrypted) {
        STATE.isEncrypted = true;
        STATE.encryptedData = parsed.data;
        updateSecurityUI();
      } else {
        STATE.keys = parsed.data.keys || [];
        STATE.user = parsed.data.user || 'Convidado';
        
        const active = STATE.keys.find(k=>k.active);
        if(active && active.token) {
           localStorage.setItem('di_apiKey', active.token);
           if(typeof apiKey !== 'undefined') apiKey = active.token;
        }
        
        if(STATE.user !== 'Convidado') {
           localStorage.setItem('di_userName', STATE.user);
           if(typeof userName !== 'undefined') userName = STATE.user;
           if(document.getElementById('userNameInput')) document.getElementById('userNameInput').value = STATE.user;
           if(document.getElementById('inputUser')) document.getElementById('inputUser').value = STATE.user;
        }

        updateInterface(STATE.user);
        renderKeysList();
      }
    }

    const hashStr = s => { let h=0xdeadbeef; for(let i=0;i<s.length;i++){h=Math.imul(h^s.charCodeAt(i),2654435761);} return (h^h>>>16)>>>0; };
    const createSvg = (id,sz) => `<svg viewBox="0 0 100 100" width="${sz}" height="${sz}"><defs><linearGradient id="g${id}"><stop offset="0%" stop-color="#00f2ff"/><stop offset="100%" stop-color="#bd00ff"/></linearGradient></defs><circle cx="50" cy="50" r="48" fill="#080b12" stroke="rgba(255,255,255,0.1)"/><circle cx="50" cy="50" r="20" fill="url(#g${id})" opacity="0.9"/></svg>`;
    const createMiniSvg = (name,sz=30) => {
      const s = hashStr(name||'D'); const h1=s%360; const h2=(s*37)%360;
      const grad = `<linearGradient id="gm${s}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="hsl(${h1},90%,50%)"/><stop offset="1" stop-color="hsl(${h2},90%,50%)"/></linearGradient>`;
      return `<svg width="${sz}" height="${sz}" viewBox="0 0 32 32"><defs>${grad}</defs><rect width="32" height="32" rx="8" fill="#0a1016"/><circle cx="16" cy="16" r="6" fill="url(#gm${s})"/></svg>`;
    };

    function updateInterface(name){
      const safe = name || 'Convidado';
      els.lblName.innerText = safe;
      els.input.value = safe;
      const activeKey = STATE.keys.find(k=>k.active);
      els.smallIdent.innerText = activeKey ? activeKey.name : '--';
      els.actBadge.innerText = activeKey ? `key:${activeKey.name}` : 'v:--';
      els.smallMiniAvatar.innerHTML = createMiniSvg(safe);
      els.actMiniAvatar.innerHTML = createMiniSvg(safe,36);
      els.actName.innerText = safe;
      els.avatarTgt.innerHTML = createSvg('Main',64);
      const phrases = ["Foco estÃ¡vel.","Ritmo criativo.","PercepÃ§Ã£o sutil."];
      els.smallText.innerText = activeKey ? `${activeKey.name} [ATIVO]` : (safe==='Convidado'?'Aguardando...':`${safe} Â· ${phrases[safe.length%phrases.length]}`);
      const line = `+${'-'.repeat(safe.length+4)}+`;
      els.actPre.innerText = `${line}\n| ${safe.toUpperCase()} |\n${line}\nID: ${hashStr(safe).toString(16)}`;

      const tiUser = document.getElementById('displayUser');
      if(tiUser) tiUser.innerText = 'User: ' + safe;
    }

    function updateSecurityUI() {
      if (SESSION_PASSWORD) {
        els.securityStatus.innerText = "COFRE DESTRANCADO"; els.securityStatus.style.color = "var(--neon-success)";
        els.vaultStatusText.innerText = "Cofre Protegido (Destrancado)"; els.lockVaultBtn.innerText = "TRANCAR";
      } else if (STATE.isEncrypted) {
        els.securityStatus.innerText = "CRIPTOGRAFADO"; els.securityStatus.style.color = "var(--neon-gold)";
        els.vaultStatusText.innerText = "Cofre Trancado"; els.lockVaultBtn.innerText = "REDEFINIR";
      } else {
        els.securityStatus.innerText = "SEM PROTEÃÃO"; els.securityStatus.style.color = "rgba(255,255,255,0.5)";
        els.vaultStatusText.innerText = "Cofre Aberto (Sem senha)"; els.lockVaultBtn.innerText = "CRIAR SENHA";
      }
    }

    function renderKeysList(){
      els.keyList.innerHTML = '';
      if(STATE.keys.length===0){ els.keyList.innerHTML = '<div style="color:rgba(255,255,255,0.3);text-align:center;padding:20px">Nenhuma chave armazenada.</div>'; return; }
      STATE.keys.forEach(k=>{
        const div = document.createElement('div');
        div.className = `key-item ${k.active?'active-item':''}`;
        const typeInfo = k.webhook ? '<span style="color:var(--neon-purple)">WEBHOOK</span>' : 'API KEY';
        div.innerHTML = `
          <div class="meta"><div style="font-weight:700;font-size:0.9rem">${escapeHtml(k.name)}</div><div style="font-size:0.75rem;color:rgba(255,255,255,0.5)">${typeInfo}</div></div>
          <div class="actions">
            ${!k.active ? `<button class="small-btn" onclick="setActiveKey('${k.id}')">ATIVAR</button>` : `<span style="font-size:0.7rem;font-weight:700;color:var(--neon-cyan);margin-right:10px">ATIVA</span>`}
            <button class="small-btn danger" onclick="removeKey('${k.id}')"><i data-lucide="trash-2" style="width:14px"></i></button>
          </div>`;
        els.keyList.appendChild(div);
      });
      lucide.createIcons();
    }

    function addKey() {
      const name = els.keyName.value.trim();
      const token = els.keyToken.value.trim();
      const webhook = els.keyWebhook.value.trim();
      if(!name){ showToaster('Nome obrigatÃ³rio','error'); return; }
      const newKey = { id: Date.now().toString(36), name, token, webhook, active: STATE.keys.length===0 };
      STATE.keys.push(newKey);
      if(newKey.active && newKey.token) {
        localStorage.setItem('di_apiKey', newKey.token);
        if(typeof apiKey !== 'undefined') apiKey = newKey.token;
      }
      saveData(); renderKeysList(); updateInterface(STATE.user);
      els.keyName.value=''; els.keyToken.value=''; els.keyWebhook.value='';
      showToaster('Chave adicionada!', 'success');
    }

    window.removeKey = (id) => {
      if(confirm('Remover chave permanentemente?')){
        STATE.keys = STATE.keys.filter(k=>k.id!==id);
        saveData(); renderKeysList(); updateInterface(STATE.user);
      }
    };

    window.setActiveKey = (id) => {
      let activatedToken = null;
      STATE.keys.forEach(k=> {
        k.active = (k.id===id);
        if(k.active) activatedToken = k.token;
      });
      if(activatedToken) {
        localStorage.setItem('di_apiKey', activatedToken);
        if(typeof apiKey !== 'undefined') apiKey = activatedToken;
        if(document.getElementById('apiKeyInput')) document.getElementById('apiKeyInput').value = activatedToken;
        showToaster('Chave sincronizada com o Chat.', 'success');
      }
      saveData(); renderKeysList(); updateInterface(STATE.user);
    };

    // --- VAULT EVENTS ---
    els.testWebhookBtn.addEventListener('click', async () => { showToaster('Ping enviado (simulado)','success'); });
    function openManager() {
      if (STATE.isEncrypted && !SESSION_PASSWORD) { els.vaultModal.style.display='flex'; els.vaultPass.focus(); } 
      else { els.keysModal.style.display='flex'; }
    }
    els.vaultUnlock.addEventListener('click', async () => {
      const pass = els.vaultPass.value;
      try {
        const decrypted = await CRYPTO.decrypt(STATE.encryptedData, pass);
        SESSION_PASSWORD = pass; STATE.keys = decrypted.keys; STATE.user = decrypted.user;
        const active = STATE.keys.find(k=>k.active);
        if(active && active.token) { localStorage.setItem('di_apiKey', active.token); if(typeof apiKey !== 'undefined') apiKey = active.token; }
        if(STATE.user) { localStorage.setItem('di_userName', STATE.user); if(typeof userName !== 'undefined') userName = STATE.user; }
        els.vaultModal.style.display='none'; els.keysModal.style.display='flex'; els.vaultPass.value='';
        renderKeysList(); updateSecurityUI(); showToaster('Cofre destrancado.', 'success');
      } catch(e) { showToaster('Senha incorreta.', 'error'); }
    });
    els.lockVaultBtn.addEventListener('click', () => {
       if (!SESSION_PASSWORD && !STATE.isEncrypted) {
         const newPass = prompt("Defina uma senha para o Cofre:");
         if(newPass) { SESSION_PASSWORD=newPass; saveData(); showToaster("Cofre trancado.", 'success'); }
       } else if (SESSION_PASSWORD) {
         SESSION_PASSWORD=null; els.keysModal.style.display='none'; showToaster("SessÃ£o do cofre encerrada.", 'success');
       } else {
         showToaster("Cofre jÃ¡ criptografado. Desbloqueie para redefinir.", 'error');
       }
       updateSecurityUI();
    });
    els.vaultCancel.addEventListener('click', ()=> els.vaultModal.style.display='none');
    els.closeKeysBtn.addEventListener('click', ()=> els.keysModal.style.display='none');
    els.addKeyBtn.addEventListener('click', addKey);

    // --- CINEMATIC GESTURES & MODES (REFINED V7) ---

    let state = {
        isOrb: false,
        isHud: false,
        isDragging: false,
        timer: null,
        startX: 0,
        startY: 0,
        dragOffsetX: 0,
        dragOffsetY: 0,
        pointerId: null
    };

    const HUD_SNAP_THRESHOLD = 60; // DistÃ¢ncia do topo para snapar
    const SWIPE_DOWN_THRESHOLD = 80; // DistÃ¢ncia para puxar HUD
    const LONG_PRESS_MS = 350; // Tempo para virar Orb via long press

    // Passive: false para permitir preventDefault() se necessÃ¡rio
    els.card.addEventListener('pointerdown', handleStart, { passive: false });
    window.addEventListener('pointermove', handleMove, { passive: false });
    window.addEventListener('pointerup', handleEnd, { passive: false });

    // Opening Configs
    els.avatarTgt.addEventListener('click', (e)=>{ if(!state.isOrb && !state.isHud) openManager(); });
    els.orbMenuTrigger.addEventListener('click', (e)=>{ e.stopPropagation(); window.setMode('card'); toggleSection('systemCard', true); });
    els.hudMenuBtn.addEventListener('click', (e)=>{ e.stopPropagation(); window.setMode('card'); toggleSection('systemCard', true); });
    
    // Open Config from Header click in HUD Mode
    els.header.addEventListener('click', (e) => {
        if(state.isHud && !state.isDragging && !e.target.closest('.hud-menu-btn')) {
             window.setMode('card');
             toggleSection('systemCard', true);
        }
    });

    els.card.addEventListener('contextmenu', (e)=>{
        if(state.isOrb || state.isHud) { e.preventDefault(); window.setMode('card'); }
    });

    function handleStart(e) {
      // Ignorar interaÃ§Ãµes internas (inputs, textareas)
      if(e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || (e.target.tagName === 'BUTTON' && !e.target.closest('.orb-menu-trigger'))) return;
      
      // No modo Card, sÃ³ permitir arrastar pelo Header
      if(!state.isOrb && !state.isHud && !els.header.contains(e.target)) return;

      state.startX = e.clientX;
      state.startY = e.clientY;
      state.pointerId = e.pointerId;

      // Se jÃ¡ for Orb/Hud -> Iniciar arraste imediato
      if(state.isOrb || state.isHud) {
          state.isDragging = true;
          try { els.card.setPointerCapture(e.pointerId); } catch(err){}
          
          const rect = els.card.getBoundingClientRect();
          state.dragOffsetX = e.clientX - rect.left;
          state.dragOffsetY = e.clientY - rect.top;
          els.card.style.transition = 'none';
          return;
      }

      // Se for Card: Iniciar timer de Long Press, mas monitorar movimento para "swipe up"
      state.timer = setTimeout(() => {
          transmuteToOrb(e);
          saveUIState();
      }, LONG_PRESS_MS);
    }
    
    function handleMove(e) {
      // DetecÃ§Ã£o de Swipe Up / Side Drag no modo Card antes do timer acabar
      if(!state.isOrb && !state.isHud && state.timer) {
          const dx = e.clientX - state.startX;
          const dy = e.clientY - state.startY;
          const dist = Math.hypot(dx, dy);
          
          // Se moveu o suficiente (swipe), cancelar timer e virar Orb imediatamente
          // LÃ³gica: Se arrastar pra cima (dy < -10) ou muito pros lados (dx > 18)
          if (dist > 12 && (dy < -10 || Math.abs(dx) > 18)) { 
              clearTimeout(state.timer); state.timer = null;
              
              // Transmutar e continuar arrastando
              transmuteToOrb(e); 
              
              // Recalcular offset para o drag nÃ£o "pular"
              const rect = els.card.getBoundingClientRect();
              state.dragOffsetX = e.clientX - rect.left;
              state.dragOffsetY = e.clientY - rect.top;
              try { els.card.setPointerCapture(e.pointerId); } catch(err){}
              els.card.style.transition = 'none';
          }
          
          // Se foi um movimento pequeno (jitter), talvez cancelar se for scroll? 
          // Deixamos o browser decidir o scroll se nÃ£o for drag.
      }
    
      if(!state.isDragging) return;

      e.preventDefault(); // Prevenir scroll da pÃ¡gina enquanto arrasta o Orb/HUD

      if(state.isOrb) {
          const x = e.clientX - state.dragOffsetX;
          const y = e.clientY - state.dragOffsetY;
          els.card.style.left = `${x}px`;
          els.card.style.top = `${y}px`;
          
          if(y < HUD_SNAP_THRESHOLD) els.snapZone.classList.add('active');
          else els.snapZone.classList.remove('active');

      } else if (state.isHud) {
          const deltaY = e.clientY - state.startY;
          if(deltaY > 0) {
             els.card.style.transform = `translateX(-50%) translateY(${deltaY * 0.4}px)`;
             if(deltaY > SWIPE_DOWN_THRESHOLD) els.snapZone.classList.add('active');
             else els.snapZone.classList.remove('active');
          }
      }
    }
    
    function handleEnd(e) {
      if(state.timer){ clearTimeout(state.timer); state.timer=null; }
      
      if(state.isDragging) {
          state.isDragging = false;
          try { els.card.releasePointerCapture && els.card.releasePointerCapture(state.pointerId); } catch(err){}
          els.card.style.transition = ''; 
          els.snapZone.classList.remove('active');

          if(state.isOrb) {
              const rect = els.card.getBoundingClientRect();
              if(rect.top < HUD_SNAP_THRESHOLD) {
                  setMode('hud');
              } else {
                  saveUIState();
              }
          } else if (state.isHud) {
              const deltaY = e.clientY - state.startY;
              if (deltaY > SWIPE_DOWN_THRESHOLD) {
                  const x = e.clientX - 34; 
                  const y = e.clientY - 10;
                  els.card.style.left = `${x}px`;
                  els.card.style.top = `${y}px`;
                  setMode('orb');
              } else {
                  els.card.style.transform = `translateX(-50%) translateY(0)`;
              }
          }
      } else {
          // Clique simples no header do Card (Toggle)
          if(!state.isOrb && !state.isHud && els.header.contains(e.target)) {
               toggleCardState();
          }
      }
      state.pointerId = null;
    }
    
    function transmuteToOrb(eOrX) {
      // Aceita evento ou coordenadas, mas preferimos evento para capturar pointer
      let x, y, ev;
      if(eOrX && eOrX.clientX !== undefined) { ev = eOrX; x = ev.clientX; y = ev.clientY; }
      else { return; } // Precisa de evento para fluidez total

      if(navigator.vibrate) navigator.vibrate(40);
      els.card.classList.add('orb','closed'); 
      els.card.classList.remove('content-visible');
      
      // Centralizar visualmente (serÃ¡ sobrescrito pelo drag move imediato)
      els.card.style.left = (x - 34) + 'px'; 
      els.card.style.top = (y - 34) + 'px';
      
      state.isOrb=true; state.isHud=false;
      
      // Iniciar drag imediatamente
      state.isDragging = true;
      if(ev && ev.pointerId) {
          state.pointerId = ev.pointerId;
          try { els.card.setPointerCapture(ev.pointerId); } catch(e){}
          const rect = els.card.getBoundingClientRect();
          state.dragOffsetX = x - rect.left;
          state.dragOffsetY = y - rect.top;
      }

      updateModeButtons('orb');
    }

    function revertToCard() {
      state.isOrb=false; state.isHud=false;
      els.card.style.transition='all 0.5s var(--ease-smooth)'; 
      els.card.style.left=''; els.card.style.top=''; 
      els.card.style.width=''; els.card.style.height=''; 
      els.card.style.transform='';
      els.card.classList.remove('orb','hud','closed'); 
      setTimeout(()=>els.card.classList.add('content-visible'),300);
    }
    
    window.setMode = (mode, isInitialLoad = false) => {
        updateModeButtons(mode);

        if(mode === 'card') {
            revertToCard();
        } else if (mode === 'orb') {
            state.isOrb = true; state.isHud = false;
            els.card.classList.add('orb', 'closed');
            els.card.classList.remove('hud', 'content-visible');
            els.card.style.transform = 'none';
        } else if (mode === 'hud') {
            state.isHud = true; state.isOrb = false;
            els.card.classList.add('hud', 'closed'); 
            els.card.classList.remove('orb', 'content-visible');
            els.card.style.top = ''; 
            els.card.style.left = ''; 
            els.card.style.transform = '';
        }
        
        if(!isInitialLoad) saveUIState();
    };

    function updateModeButtons(mode) {
        [els.btnModeCard, els.btnModeOrb, els.btnModeHud].forEach(b=>b.classList.remove('active-mode'));
        if(mode==='card') els.btnModeCard.classList.add('active-mode');
        if(mode==='orb') els.btnModeOrb.classList.add('active-mode');
        if(mode==='hud') els.btnModeHud.classList.add('active-mode');
    }

    function toggleCardState() {
      if(els.card.classList.contains('animating')) return;
      const isClosed=els.card.classList.contains('closed'); els.card.classList.add('animating');
      if(isClosed) { els.card.classList.remove('closed'); els.card.animate([{transform:'scale(0.95)',opacity:0.8},{transform:'scale(1)',opacity:1}],{duration:400}).onfinish=()=>{els.card.classList.remove('animating');els.card.classList.add('content-visible');} }
      else { els.card.classList.remove('content-visible'); els.card.animate([{transform:'translateY(0)',opacity:1},{transform:'translateY(10px)',opacity:1}],{duration:200}).onfinish=()=>{els.card.classList.add('closed');els.card.classList.remove('animating');} }
    }
    
    // Helpers
    function escapeHtml(s){ return s ? s.replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])) : ''; }
    function showToaster(txt,type='default'){ const t=document.createElement('div'); t.className=`toaster ${type}`; t.innerText=txt; document.getElementById('toasterWrap').appendChild(t); setTimeout(()=>t.classList.add('show'),10); setTimeout(()=>{t.classList.remove('show');setTimeout(()=>t.remove(),300)},2500); }
    function toggleSection(id, forceOpen = false){ 
        const el = document.getElementById(id);
        const h = el.classList.contains('activation-hidden'); 
        if(forceOpen && !h) return; // Already open
        el.classList.toggle('activation-hidden', !forceOpen && !h); 
        el.classList.toggle('activation-open', forceOpen || h); 
    }
    window.toggleActivation = () => toggleSection('activationCard');

    // Logic Init
    els.input.addEventListener('input', (e)=>{ 
       STATE.user=e.target.value; 
       localStorage.setItem('di_userName', STATE.user); 
       if(typeof userName !== 'undefined') userName=STATE.user;
       updateInterface(e.target.value); saveData(); 
    });
    
    // INITIAL LOAD
    setTimeout(()=>{ 
        els.card.classList.add('active'); 
        els.avatarTgt.classList.add('shown'); 
        loadData(); 
        loadUIState(); 
        updateChatUI();
    }, 100);
    setInterval(()=>{ els.clock.innerText = new Date().toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'}); },1000);

const API_ENDPOINT = 'https://openrouter.ai/api/v1/chat/completions';
    const TEMPERATURE = 0.2;

    let training = localStorage.getItem('di_trainingText') || '';
    let trainingFileName = localStorage.getItem('di_trainingFileName') || '';
    let assistantEnabled = (localStorage.getItem('di_assistantEnabled') === '1');
    let trainingActive = (localStorage.getItem('di_trainingActive') !== '0'); 
    let conversation = [];
    let pages = [], currentPage = 0, autoAdvance = true;

    // Configs
    let apiKey = localStorage.getItem('di_apiKey') || '';
    let modelName = localStorage.getItem('di_modelName') || 'nvidia/nemotron-3-nano-30b-a3b:free';
    let userName = localStorage.getItem('di_userName') || '';
    let infodoseName = localStorage.getItem('di_infodoseName') || '';
    const CRYSTAL_KEY = 'di_cristalizados';

// === Model Selector ===
const modelSelect = document.getElementById('modelSelect');

// carregar modelo salvo
const savedModel = localStorage.getItem('di_modelName');
if (savedModel) {
  modelName = savedModel;
  if (modelSelect) modelSelect.value = savedModel;
}

// escutar mudanÃ§a
modelSelect?.addEventListener('change', e => {
  modelName = e.target.value;
  localStorage.setItem('di_modelName', modelName);
  showToaster?.(`Modelo ativo: ${modelName}`, 'default');
});

    const createEl = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html) e.innerHTML = html; return e; };

    function updateChatUI() {
       const uEl = document.getElementById('displayUser');
       const iEl = document.getElementById('displayInfodose');
       if(uEl) uEl.innerText = 'User: ' + (userName || 'â');
       if(iEl) iEl.innerText = 'Infodose: ' + (infodoseName || 'â');
       
       // Settings Inputs
       if(document.getElementById('apiKeyInput')) document.getElementById('apiKeyInput').value = apiKey;
       if(document.getElementById('modelInput')) document.getElementById('modelInput').value = modelName;
       if(document.getElementById('infodoseNameInput')) document.getElementById('infodoseNameInput').value = infodoseName;
       
       // Toggles
       if(document.getElementById('assistantActiveCheckbox')) document.getElementById('assistantActiveCheckbox').checked = assistantEnabled;
       if(document.getElementById('trainingActiveCheckbox')) document.getElementById('trainingActiveCheckbox').checked = trainingActive;
       
       // Update Chat Toggle Button Visual
       updateToggleBtnVisual();
    }
    
    function updateToggleBtnVisual() {
        const btn = els.toggleBtnF;
        if(assistantEnabled) {
            btn.classList.add('active');
            btn.title = "Assistant ON";
        } else {
            btn.classList.remove('active');
            btn.title = "Assistant OFF";
        }
    }

    // TTS Logic ... (Same as before)
    const speakText = (txt, onend)=> {
      if (!txt) { if (onend) onend(); return; }
      const u = new SpeechSynthesisUtterance(txt);
      u.lang = 'pt-BR'; u.rate = 0.99; u.pitch = 1.1;
      if (window._vozes) u.voice = window._vozes.find(v=>v.lang==='pt-BR') || window._vozes[0];
      if (onend) u.onend = onend;
      speechSynthesis.speak(u);
    };

   /* === PATCH JS: substituir splitBlocks + renderPaginatedResponse + speakPage/changePage/showLoading === */

/* simples parser markdown leve (bold, italic, inline code, links, codeblocks, lists) */
function mdToHtml(md){
  if(!md) return '';
  // code block ``` ``` 
  md = md.replace(/```([^`]*)```/gs, function(_, code){ return '<pre><code>' + escapeHtml(code) + '</code></pre>'; });
  // inline code `code`
  md = md.replace(/`([^`]+)`/g, function(_, c){ return '<code>' + escapeHtml(c) + '</code>'; });
  // links [text](url)
  md = md.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
  // bold **text**
  md = md.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  // italic *text*
  md = md.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  // unordered lists (- or *)
  md = md.replace(/(^|\n)[\-\*]\s+(.+?)(?=\n|$)/g, function(_, pre, item){ return pre + '<li>' + item + '</li>'; });
  md = md.replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>');
  // paragraphs: remaining single newlines -> <br>, double newlines -> separate paragraphs
  const paras = md.split(/\n{2,}/).map(p => p.trim()).filter(Boolean);
  return paras.map(p => '<p>' + p.replace(/\n/g,'<br>') + '</p>').join('');
}

/* divide texto em grupos de 3 blocos (fallback para sentenÃ§as) */
const splitBlocks = text => {
  if (!text || !text.trim()) return [['Sem conteÃºdo.','','']];
  let paras = text.split(/\n\s*\n/).map(p=>p.trim()).filter(Boolean);
  // se muitos pequenos parÃ¡grafos e nÃ£o mÃºltiplo de 3, quebra por sentenÃ§as
  if (paras.length < 3 || paras.length % 3 !== 0) {
    const sens = text.match(/[^\.!\?]+[\.!\?]+/g) || [text];
    paras = sens.map(s=>s.trim()).filter(Boolean);
  }
  const groups = [];
  for (let i=0;i<paras.length;i+=3) groups.push(paras.slice(i,i+3));
  return groups;
};

const renderPaginatedResponse = text => {
  // cancel TTS ongoing
  try { speechSynthesis.cancel(); } catch(e){}
  autoAdvance = true;
  const respEl = document.getElementById('response');
  // remove previous generated pages but keep the controls and initial page if present
  Array.from(respEl.querySelectorAll('.page')).forEach(p => {
    if (!p.classList.contains('initial')) p.remove();
  });
  pages = [];
  const groups = splitBlocks(text);
  const controls = respEl.querySelector('.response-controls');
  const titles = ['ð Recompensa Inicial','ðï¸ ExploraÃ§Ã£o e Curiosidade','â¡ AntecipaÃ§Ã£o Vibracional'];

  groups.forEach((tris, gi) => {
    const page = createEl('div', gi===0 ? 'page active' : 'page');
    // content container
    tris.forEach((body, j) => {
      const cls = j===0 ? 'intro' : j===1 ? 'middle' : 'ending';
      // convert markdown-lite to html inside block-body
      const htmlBody = mdToHtml(body);
      const b = createEl('div','response-block '+cls, `<h3>${titles[j]}</h3><div class="block-body">${htmlBody}</div>`);
      const meta = createEl('div','meta');
      const crystalBtn = createEl('button','crystal-btn','â¶');
      crystalBtn.title = 'Cristalizar';
      crystalBtn.addEventListener('click', (ev)=>{
        ev.stopPropagation();
        cristalizar({ title: titles[j], content: body });
        crystalBtn.innerText = 'â'; setTimeout(()=> crystalBtn.innerText = 'â¶', 1200);
      });
      meta.appendChild(crystalBtn);
      b.appendChild(meta);

      // state & click behavior (TTS / expand -> trigger AI)
      b.dataset.state = '';
      b.addEventListener('click', (ev) => {
        // prevent inner meta buttons from toggling
        if (ev.target.closest('.meta')) return;
        const alreadySpoken = b.dataset.state === 'spoken';
        if (!alreadySpoken) {
          try { speechSynthesis.cancel(); } catch(e){}
          // speak only visible text (collapse tags removed)
          const textToSpeak = b.querySelector('.block-body') ? b.querySelector('.block-body').innerText : body;
          speakText(textToSpeak);
          b.classList.add('clicked'); b.dataset.state = 'spoken';
        } else {
          // expand and call AI
          b.classList.add('expanded'); b.dataset.state = '';
          if (!assistantEnabled) {
            assistantEnabled = true; localStorage.setItem('di_assistantEnabled','1');
            updateToggleBtnVisual();
            if (training && trainingActive) conversation.unshift({ role:'system', content: training });
          }
          const blockText = `${titles[j]}\n\n${body}`;
          showLoading('Pulso em ExpansÃ£o...');
          speakText('Pulso em ExpansÃ£o...');
          conversation.push({ role:'user', content: blockText });
          callAI();
        }
      });

      page.appendChild(b);
    });

    page.appendChild(createEl('p','footer-text',`<em>Do seu jeito. <strong>Sempre</strong> Ãºnico. <strong>Sempre</strong> seu.</em>`));
    // insert new page before controls (so controls always at bottom)
    if (controls && controls.parentNode) respEl.insertBefore(page, controls);
    else respEl.appendChild(page);
    pages.push(page);
  });

  currentPage = 0;
  const pi = document.getElementById('pageIndicator');
  if (pi) pi.textContent = `1 / ${pages.length}`;
  // start speaking first page
  speakPage(0);
};

const speakPage = i => {
  const page = pages[i]; if (!page) return;
  const body = Array.from(page.querySelectorAll('.block-body')).map(n => n.innerText).join(' ');
  speakText(body, () => {
    if (!autoAdvance) return;
    if (i < pages.length - 1) { changePage(1); speakPage(i+1); } else { speakText('Sempre Ãºnico, sempre seu.'); }
  });
};

const changePage = offset => {
  const np = currentPage + offset; if (np<0 || np>=pages.length) return;
  if (pages[currentPage]) pages[currentPage].classList.remove('active');
  if (pages[np]) pages[np].classList.add('active');
  currentPage = np;
  const pi = document.getElementById('pageIndicator');
  if (pi) pi.textContent = `${currentPage+1} / ${pages.length}`;
};

const showLoading = msg => {
  const respEl = document.getElementById('response');
  const controls = respEl.querySelector('.response-controls');
  respEl.querySelectorAll('.page').forEach(p => { if(!p.classList.contains('initial')) p.remove(); });
  const page = createEl('div','page active'); page.appendChild(createEl('p','footer-text',msg));
  if (controls && controls.parentNode) respEl.insertBefore(page, controls);
  else respEl.appendChild(page);
  pages = [page];
  currentPage = 0;
  const pi = document.getElementById('pageIndicator');
  if (pi) pi.textContent = 'â¦';
};

    async function callAI() {
      apiKey = localStorage.getItem('di_apiKey') || apiKey;

      if (!apiKey) {
        alert('Nenhuma API Key ativa! Ative uma chave no Card (Cofre) ou no Painel.');
        return;
      }
      const bodyObj = { model: modelName, messages: conversation.slice(), temperature: TEMPERATURE };
      const messagesToSend = [];
      if (assistantEnabled && trainingActive && training) messagesToSend.push({ role:'system', content: training });
      conversation.forEach(m => { if (m.role !== 'system') messagesToSend.push(m); });
      bodyObj.messages = messagesToSend;

      try {
        const resp = await fetch(API_ENDPOINT, {
          method:'POST', headers:{ 'Authorization':`Bearer ${apiKey}`, 'Content-Type':'application/json' },
          body: JSON.stringify(bodyObj)
        });
        if (!resp.ok) throw new Error('Erro API: ' + resp.status);
        const data = await resp.json();
        const answer = (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) ? data.choices[0].message.content.trim() : 'Resposta vazia';
        conversation.push({ role:'assistant', content: answer });
        renderPaginatedResponse(answer);
      } catch (err) {
        console.error(err);
        const errorMsg = 'Falha na conexÃ£o. Verifique se a chave estÃ¡ ativa no Card.';
        conversation.push({ role:'assistant', content: errorMsg });
        renderPaginatedResponse(errorMsg);
      }
    }

    async function sendMessage(){
      const respEl = document.getElementById('response');
      const initPage = respEl.querySelector('.page.initial');
      if (initPage) initPage.remove();
      const input = document.getElementById('userInput');
      const raw = input.value.trim(); if (!raw) return;
      input.value = '';
      speechSynthesis.cancel(); speakText('');

      if (raw.toLowerCase().includes('oi dual')) {
        assistantEnabled = true; localStorage.setItem('di_assistantEnabled','1');
        updateToggleBtnVisual();
        showLoading('Conectando Dual Infodose...');
        if (training && trainingActive) conversation.unshift({ role:'system', content: training });
      } else { showLoading('Processando...'); }
      conversation.push({ role:'user', content: raw });
      callAI();
    }
    
    // Quick Toggle Action
    els.toggleBtnF.addEventListener('click', () => {
        assistantEnabled = !assistantEnabled;
        localStorage.setItem('di_assistantEnabled', assistantEnabled ? '1' : '0');
        showToaster(assistantEnabled ? 'Assistant ON (Fetch Ativo)' : 'Assistant OFF (Fetch Desativado)', assistantEnabled ? 'success' : 'default');
        updateChatUI();
    });

    function cristalizar({ title, content }) {
      const list = JSON.parse(localStorage.getItem(CRYSTAL_KEY) || '[]');
      list.unshift({ id: Date.now(), title, content, user: userName, infodose: infodoseName, at: new Date().toISOString() });
      localStorage.setItem(CRYSTAL_KEY, JSON.stringify(list)); refreshCrystalList();
    }
    function refreshCrystalList() {
      const list = JSON.parse(localStorage.getItem(CRYSTAL_KEY) || '[]');
      const el = document.getElementById('crystalList'); el.innerHTML = '';
      if (!list.length) { el.innerHTML = '<div class="small">Vazio.</div>'; return; }
      list.forEach(it => {
        const row = createEl('div','crystal-item');
        const left = createEl('div','','<strong>'+it.title+'</strong><div class="small">'+(it.infodose||'')+'</div><div style="margin-top:4px;font-size:0.8em">'+it.content.slice(0,100)+'...</div>');
        const actions = createEl('div','actions');
        const copyBtn = createEl('button','btn btn-sec','Copy'); copyBtn.onclick=()=>navigator.clipboard.writeText(it.content);
        const delBtn = createEl('button','btn btn-sec','Del'); delBtn.onclick=()=>{ 
            const arr=JSON.parse(localStorage.getItem(CRYSTAL_KEY)||'[]'); 
            localStorage.setItem(CRYSTAL_KEY, JSON.stringify(arr.filter(x=>x.id!==it.id))); refreshCrystalList(); 
        };
        actions.append(copyBtn, delBtn); row.append(left, actions); el.appendChild(row);
      });
    }

    // --- SETUP CHAT UI EVENTS ---
    document.addEventListener('DOMContentLoaded', async () => {
      speechSynthesis.onvoiceschanged = () => { window._vozes = speechSynthesis.getVoices(); };

      try {
        particlesJS('particles-js',{ particles:{ number:{value:24},color:{value:['#0ff','#f0f']}, shape:{type:'circle'},opacity:{value:0.4},size:{value:2.4}, move:{enable:true,speed:1.5} }, retina_detect:true });
      } catch(e) { console.warn('particlesJS init failed', e); }

      document.getElementById('sendBtn').addEventListener('click', sendMessage);
      document.getElementById('userInput').addEventListener('keypress', e => { if (e.key==='Enter') sendMessage(); });
      document.querySelector('[data-action="prev"]').addEventListener('click', () => changePage(-1));
      document.querySelector('[data-action="next"]').addEventListener('click', () => changePage(1));

      document.getElementById('saveSystemBtn').addEventListener('click', () => {
         infodoseName = document.getElementById('infodoseNameInput').value.trim();
         assistantEnabled = document.getElementById('assistantActiveCheckbox').checked;
         trainingActive = document.getElementById('trainingActiveCheckbox').checked;
         
         const newKey = document.getElementById('apiKeyInput').value.trim();
         const newModel = document.getElementById('modelInput').value.trim();
         
         if(newKey) {
             apiKey = newKey;
             localStorage.setItem('di_apiKey', apiKey);
             if(typeof STATE !== 'undefined') {
                 const active = STATE.keys.find(k=>k.active);
                 if(active) { active.token = newKey; saveData(); }
             }
         }
         
         modelName = newModel || modelName;
         localStorage.setItem('di_modelName', modelName);

         const zen = document.getElementById('zenModeCheckbox').checked;
         if(zen) { 
             document.body.classList.add('zen-mode');
             document.getElementById('mantra-toggle').classList.add('collapsed');
         } else {
             document.body.classList.remove('zen-mode');
             document.getElementById('mantra-toggle').classList.remove('collapsed');
         }
         saveUIState(); 

         localStorage.setItem('di_infodoseName', infodoseName);
         localStorage.setItem('di_assistantEnabled', assistantEnabled?'1':'0'); localStorage.setItem('di_trainingActive', trainingActive?'1':'0');
         
         updateChatUI();
         toggleSection('systemCard', false);
         showToaster('ConfiguraÃ§Ãµes Salvas', 'success');
      });

      // Crystal
      document.getElementById('crystalBtn').addEventListener('click', ()=>{ refreshCrystalList(); document.getElementById('crystalModal').classList.add('active'); });
      document.getElementById('closeCrystal').addEventListener('click', ()=>document.getElementById('crystalModal').classList.remove('active'));
      document.getElementById('exportAllCrystal').addEventListener('click', ()=>{
          const list = JSON.parse(localStorage.getItem(CRYSTAL_KEY)||'[]');
          if(!list.length) return alert('Nada.');
          const b = new Blob([JSON.stringify(list,null,2)], {type:'application/json'});
          const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download='crystals.json'; a.click();
      });
      document.getElementById('clearAllCrystal').addEventListener('click', ()=>{ localStorage.removeItem(CRYSTAL_KEY); refreshCrystalList(); });

      updateChatUI();

      // --- ADDED: missing button handlers ---
      function getAllResponseText() {
        const blocks = Array.from(document.querySelectorAll('.response-block p')).map(p=>p.innerText.trim()).filter(Boolean);
        if(blocks.length) return blocks.join('\n\n');
        const resp = document.getElementById('response');
        return resp ? resp.innerText.trim() : '';
      }
      const copyBtn = document.querySelector('.control-btn.copy-button');
      if (copyBtn) copyBtn.addEventListener('click', async () => {
        try {
          const text = getAllResponseText();
          await navigator.clipboard.writeText(text);
          showToaster('Texto copiado', 'success');
        } catch (e) { showToaster('Falha ao copiar', 'error'); console.error(e); }
      });
      const pasteBtn = document.querySelector('.control-btn.paste-button');
      if (pasteBtn) pasteBtn.addEventListener('click', async () => {
        try {
          const txt = await navigator.clipboard.readText();
          const ui = document.getElementById('userInput');
          if (ui) { ui.value = txt; ui.focus(); showToaster('ConteÃºdo colado no campo', 'success'); }
        } catch (e) { showToaster('Falha ao colar (permissÃ£o negada?)', 'error'); console.error(e); }
      });
      const copyAct = document.getElementById('copyActBtn');
      if (copyAct) copyAct.addEventListener('click', async () => {
        try {
          const txt = document.getElementById('actPre').innerText;
          await navigator.clipboard.writeText(txt);
          showToaster('AtivaÃ§Ã£o copiada', 'success');
        } catch(e){ showToaster('Erro ao copiar ativaÃ§Ã£o', 'error'); console.error(e); }
      });
      const downloadAct = document.getElementById('downloadActBtn');
      if (downloadAct) downloadAct.addEventListener('click', async () => {
        try {
          const node = document.getElementById('actPre');
          const canvas = await html2canvas(node, { backgroundColor: null, scale: 2 });
          canvas.toBlob(blob => {
            const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'ativacao.png'; a.click();
            URL.revokeObjectURL(a.href);
          });
        } catch(e){ showToaster('Erro ao gerar PNG', 'error'); console.error(e); }
      });

      // Training import/export
      const trainingInput = document.getElementById('trainingUpload');
      const exportTrainingBtn = document.getElementById('exportTrainingBtn');
      const trainingNameEl = document.getElementById('trainingFileName');

      if (trainingInput) {
        trainingInput.addEventListener('change', async (ev) => {
          const f = ev.target.files && ev.target.files[0];
          if (!f) return;
          const txt = await f.text();
          training = txt;
          trainingFileName = f.name;
          localStorage.setItem('di_trainingText', training);
          localStorage.setItem('di_trainingFileName', trainingFileName);
          if (trainingNameEl) trainingNameEl.innerText = trainingFileName;
          showToaster('Treinamento importado', 'success');
        });
      }
      if (exportTrainingBtn) {
        exportTrainingBtn.addEventListener('click', () => {
          if (!training) { showToaster('Nenhum treinamento para exportar', 'error'); return; }
          const b = new Blob([training], { type: 'text/plain' });
          const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = (trainingFileName||'training.txt'); a.click();
        });
      }

      // Keys export/import
      const exportKeysBtn = document.getElementById('exportKeysBtn');
      const importKeysBtn = document.getElementById('importKeysBtn');
      const importFileInput = document.getElementById('importFileInput');

      if (exportKeysBtn) exportKeysBtn.addEventListener('click', () => {
        const b = new Blob([JSON.stringify(STATE.keys || [], null, 2)], { type: 'application/json' });
        const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = 'keys.json'; a.click();
      });
      if (importKeysBtn && importFileInput) {
        importKeysBtn.addEventListener('click', () => importFileInput.click());
        importFileInput.addEventListener('change', async (ev) => {
          const f = ev.target.files && ev.target.files[0];
          if (!f) return;
          try {
            const txt = await f.text();
            const parsed = JSON.parse(txt);
            if (!Array.isArray(parsed)) throw new Error('Formato invÃ¡lido');
            STATE.keys = parsed;
            saveData(); renderKeysList(); showToaster('Chaves importadas', 'success');
          } catch (e) { showToaster('Erro ao importar chaves', 'error'); console.error(e); }
        });
      }

    });

    // Mantra
    const mantraBtn = document.getElementById('mantra-toggle');
    const mantraText = document.getElementById('mantra-text');
    let mantraCollapsed = false;
    mantraBtn.addEventListener('click', () => {
      mantraCollapsed = !mantraCollapsed;
      if (mantraCollapsed) {
        mantraBtn.classList.add('collapsed'); document.body.classList.add('zen-mode');
        mantraText.classList.add('fade-out'); setTimeout(()=>{ mantraText.innerHTML = 'USE Â· TRANSFORME Â· DEVOLVA'; mantraText.classList.remove('fade-out'); },300);
      } else {
        mantraBtn.classList.remove('collapsed'); document.body.classList.remove('zen-mode');
        mantraText.classList.add('fade-out'); setTimeout(()=>{ mantraText.innerHTML = 'Do seu jeito. <strong>Sempre</strong> Ãºnico. <strong>Sempre</strong> seu.'; mantraText.classList.remove('fade-out'); },300);
      }
    });


// kob-glue-dh10.js — final, limpo, pronto para substituir o monólito
(function(){
  'use strict';
  if(window.__KOBLLUX_MONOLITH_FIXED_INIT__) { console.log('KOBLLUX fixed already init'); return; }
  window.__KOBLLUX_MONOLITH_FIXED_INIT__ = true;

  /* -----------------------------
     DOM helpers & toast
     ----------------------------- */
  const $ = (q,r=document)=> r && r.querySelector ? r.querySelector(q) : null;
  const $$ = (q,r=document)=> r && r.querySelectorAll ? [...r.querySelectorAll(q)] : [];
  const toastEl = $('#kx_toast') || null;
  function toast(msg, ms=1400){
    if(!toastEl){ console.log('KOBLLUX.toast:', msg); return; }
    toastEl.textContent = msg;
    toastEl.style.opacity = '1';
    clearTimeout(toast._t);
    toast._t = setTimeout(()=> toastEl.style.opacity='0', ms);
  }

  /* -----------------------------
     UI elements (tolerant selectors)
     ----------------------------- */
  const bar = $('#symbolBar') || document.querySelector('symbol-bar') ;
  const toggleBtn = $('#toggleBtn') || document.querySelector('main-toggle');
  const frame = $('#content-frame') || $('#frame') || $('#navFrame') || document.querySelector('iframe');
  const root = $('#root') || document.body;
  const hudStatus = $('#hudStatus');
  const outline = $('#kob-tts-outline') || (() => {
    const el = document.createElement('div');
    el.id = 'kob-tts-outline';
    el.style.position = 'absolute';
    el.style.pointerEvents = 'none';
    el.style.display = 'none';
    
    /* document.body.appendChild(el); */
    
    document.querySelector('.content').appendChild(el);

    return el;
  })();

  const BTN_PLAY = $('#btn-play');
  const BTN_NEXT = $('#btn-next');
  const BTN_PREV = $('#btn-prev');
  const BTN_ARCH = $('#btn-arch')|| document.querySelector('orb') ;

  /* -----------------------------
     Archetypes (keep structure compat)
     ----------------------------- *
  const ARCHETYPES = [
    { id:'kobllux', name:'KOBLLUX', voice:'Luciana',   lang:'pt-BR', rate:0.98, pitch:0.48, color:'#22D3EE' },
    { id:'kodux',   name:'KODUX',   voice:'Luciana',   lang:'pt-BR', rate:0.86, pitch:0.68, color:'#F97316' },
    { id:'atlas',   name:'ATLAS',   voice:'Reed',    lang:'en-US',  rate:1.00, pitch:0.93, color:'#38BDF8' },
    { id:'nova',    name:'NOVA',    voice:'Luciana', lang:'pt-BR',  rate:1.06, pitch:1.34, color:'#F97316' },
    { id:'vitalis', name:'VITALIS', voice:'Rocko',   lang:'pt-BR',  rate:0.96, pitch:1.42, color:'#22C55E' },
    { id:'pulse',   name:'PULSE',   voice:'Reed',    lang:'pt-BR',  rate:1.00, pitch:1.14, color:'#EC4899' },
    { id:'artemis', name:'ARTEMIS', voice:'Paulina', lang:'es-MX',  rate:1.00, pitch:1.23, color:'#A855F7' },
    { id:'serena',  name:'SERENA',  voice:'Joana',   lang:'pt-BR',  rate:0.92, pitch:0.90, color:'#38BDF8' },
    { id:'kaos',    name:'KAOS',    voice:'Rocko',   lang:'pt-BR',  rate:1.09, pitch:1.28, color:'#FACC15' },
    { id:'genus',   name:'GENUS',   voice:'Reed',    lang:'pt-BR',  rate:0.98, pitch:1.23, color:'#E5E7EB' },
    { id:'lumine',  name:'LUMINE',  voice:'Flo',     lang:'fr-FR',  rate:1.03, pitch:1.55, color:'#FDE047' },
    { id:'solus',   name:'SOLUS',   voice:'Satu',    lang:'fi-FI',  rate:0.96, pitch:0.87, color:'#0EA5E9' },
    { id:'rhea',    name:'RHEA',    voice:'Alice',   lang:'it-IT',  rate:1.02, pitch:0.59, color:'#22C55E' },
    { id:'aion',    name:'AION',    voice:'Monica',  lang:'es-ES',  rate:0.88, pitch:0.30, color:'#4F46E5' },
    { id:'uno',      name:'UNO',      voice:'Grandma', lang:'en-US', rate:0.90, pitch:0.93, color:'#F97316' },
    { id:'dual',     name:'DUAL',     voice:'Milena',    lang:'ru-RU', rate:1.02, pitch:1.02, color:'#06B6D4' },
    { id:'trinity',  name:'TRINITY',  voice:'Sandy',   lang:'en-US', rate:1.04, pitch:1.04, color:'#EC4899' },
    { id:'infodose', name:'INFODOSE', voice:'Luciana', lang:'pt-BR', rate:1.06, pitch:0.96, color:'#22C55E' },
    { id:'horus', name:'HORUS', voice:'Majed', lang:'ar-001', rate:0.94, pitch:0.82, color:'#F59E0B' }
  ];
  
*/
/* ─────────────────────────────────────────────
   ARCHETYPES · Unified Voice + Theme Registry
   usado por:
   - kob-glue-dh10.js
   - kob-voice-engine.js
   ───────────────────────────────────────────── */
 const ARCHETYPES = [

  {
    id:'kobllux',
    name:'KOBLLUX',
    voice:'Luciana',
    lang:'pt-BR',
    rate:0.98,
    pitch:0.39,
    color:'#22D3EE',
    theme:{
      primary:'#22D3EE',
      secondary:'#7dd3fc',
      bgSoft:'radial-gradient(circle at 30% 20%, rgba(34,211,238,.08), transparent)',
      glow:'0 0 18px rgba(34,211,238,.55)'
    }
  },

  {
    id:'kodux',
    name:'KODUX',
    voice:'Rocko',
    lang:'pt-BR',
    rate:0.86,
    pitch:0.18,
    color:'#F97316',
    theme:{
      primary:'#F97316',
      secondary:'#fb923c',
      bgSoft:'radial-gradient(circle at 60% 30%, rgba(249,115,22,.08), transparent)',
      glow:'0 0 18px rgba(249,115,22,.55)'
    }
  },

  {
    id:'atlas',
    name:'ATLAS',
    voice:'Reed',
    lang:'en-US',
    rate:1.00,
    pitch:0.78,
    color:'#78e3ff',
    theme:{
      primary:'#78e3ff',
      secondary:'#b978ff',
      bgSoft:'radial-gradient(circle at 40% 10%, rgba(120,227,255,.07), transparent)',
      glow:'0 0 18px rgba(120,227,255,.55)'
    }
  },

  {
    id:'nova',
    name:'NOVA',
    voice:'Luciana',
    lang:'pt-BR',
    rate:1.06,
    pitch:1.39,
    color:'#ff6b6b',
    theme:{
      primary:'#ff6b6b',
      secondary:'#ffb347',
      bgSoft:'radial-gradient(circle at 70% 20%, rgba(255,107,107,.08), transparent)',
      glow:'0 0 18px rgba(255,107,107,.55)'
    }
  },

  {
    id:'vitalis',
    name:'VITALIS',
    voice:'Rocko',
    lang:'pt-BR',
    rate:0.96,
    pitch:1.39,
    color:'#4ecdc4',
    theme:{
      primary:'#4ecdc4',
      secondary:'#45b7d1',
      bgSoft:'radial-gradient(circle at 50% 30%, rgba(78,205,196,.08), transparent)',
      glow:'0 0 18px rgba(78,205,196,.55)'
    }
  },

  {
    id:'pulse',
    name:'PULSE',
    voice:'Reed',
    lang:'pt-BR',
    rate:1.00,
    pitch:1.48,
    color:'#a8e6cf',
    theme:{
      primary:'#a8e6cf',
      secondary:'#d4a5a5',
      bgSoft:'radial-gradient(circle at 20% 40%, rgba(168,230,207,.08), transparent)',
      glow:'0 0 18px rgba(168,230,207,.55)'
    }
  },

  {
    id:'artemis',
    name:'ARTEMIS',
    voice:'Paulina',
    lang:'es-MX',
    rate:1.00,
    pitch:1.23,
    color:'#ffd93d',
    theme:{
      primary:'#ffd93d',
      secondary:'#ff9f1c',
      bgSoft:'radial-gradient(circle at 40% 60%, rgba(255,217,61,.08), transparent)',
      glow:'0 0 18px rgba(255,217,61,.55)'
    }
  },

  {
    id:'serena',
    name:'SERENA',
    voice:'Joana',
    lang:'pt-BR',
    rate:0.92,
    pitch:0.90,
    color:'#b8e1ff',
    theme:{
      primary:'#b8e1ff',
      secondary:'#a0b9ff',
      bgSoft:'radial-gradient(circle at 60% 30%, rgba(184,225,255,.08), transparent)',
      glow:'0 0 18px rgba(184,225,255,.55)'
    }
  },

  {
    id:'kaos',
    name:'KAOS',
    voice:'Rocko',
    lang:'pt-BR',
    rate:1.09,
    pitch:1.37,
    color:'#ff8066',
    theme:{
      primary:'#ff8066',
      secondary:'#b624ff',
      bgSoft:'radial-gradient(circle at 50% 20%, rgba(255,128,102,.08), transparent)',
      glow:'0 0 18px rgba(255,128,102,.55)'
    }
  },

  {
    id:'genus',
    name:'GENUS',
    voice:'Reed',
    lang:'pt-BR',
    rate:0.98,
    pitch:1.23,
    color:'#95e1d3',
    theme:{
      primary:'#95e1d3',
      secondary:'#f38181',
      bgSoft:'radial-gradient(circle at 50% 50%, rgba(149,225,211,.08), transparent)',
      glow:'0 0 18px rgba(149,225,211,.55)'
    }
  },

  {
    id:'lumine',
    name:'LUMINE',
    voice:'Flo',
    lang:'fr-FR',
    rate:1.03,
    pitch:1.78,
    color:'#f9f3b2',
    theme:{
      primary:'#f9f3b2',
      secondary:'#ffe69b',
      bgSoft:'radial-gradient(circle at 60% 40%, rgba(249,243,178,.08), transparent)',
      glow:'0 0 18px rgba(249,243,178,.55)'
    }
  },

  {
    id:'solus',
    name:'SOLUS',
    voice:'Satu',
    lang:'fi-FI',
    rate:0.99,
    pitch:0.78,
    color:'#ffb347',
    theme:{
      primary:'#ffb347',
      secondary:'#ff8c42',
      bgSoft:'radial-gradient(circle at 40% 20%, rgba(255,179,71,.08), transparent)',
      glow:'0 0 18px rgba(255,179,71,.55)'
    }
  },

  {
    id:'rhea',
    name:'RHEA',
    voice:'Alice',
    lang:'it-IT',
    rate:1.02,
    pitch:0.45,
    color:'#b5eaea',
    theme:{
      primary:'#b5eaea',
      secondary:'#80b3ff',
      bgSoft:'radial-gradient(circle at 50% 30%, rgba(181,234,234,.08), transparent)',
      glow:'0 0 18px rgba(181,234,234,.55)'
    }
  },

  {
    id:'aion',
    name:'AION',
    voice:'Milena',
    lang:'ru-RU',
    rate:0.88,
    pitch:0.30,
    color:'#c79aff',
    theme:{
      primary:'#c79aff',
      secondary:'#9f7aff',
      bgSoft:'radial-gradient(circle at 40% 50%, rgba(199,154,255,.08), transparent)',
      glow:'0 0 18px rgba(199,154,255,.55)'
    }
  },

  {
    id:'uno',
    name:'UNO',
    voice:'Grandma',
    lang:'en-US',
    rate:0.90,
    pitch:0.13,
    color:'#f97316',
    theme:{
      primary:'#f97316',
      secondary:'#fb923c',
      bgSoft:'radial-gradient(circle at 50% 20%, rgba(249,115,22,.08), transparent)',
      glow:'0 0 18px rgba(249,115,22,.55)'
    }
  },

  {
    id:'dual',
    name:'DUAL',
    voice:'Luciana',
    lang:'pt-BR',
    rate:1.02,
    pitch:1.02,
    color:'#06b6d4',
    theme:{
      primary:'#06b6d4',
      secondary:'#67e8f9',
      bgSoft:'radial-gradient(circle at 60% 30%, rgba(6,182,212,.08), transparent)',
      glow:'0 0 18px rgba(6,182,212,.55)'
    }
  },

  {
    id:'trinity',
    name:'TRINITY',
    voice:'Sandy',
    lang:'en-US',
    rate:1.04,
    pitch:0.33,
    color:'#ec4899',
    theme:{
      primary:'#ec4899',
      secondary:'#f472b6',
      bgSoft:'radial-gradient(circle at 50% 40%, rgba(236,72,153,.08), transparent)',
      glow:'0 0 18px rgba(236,72,153,.55)'
    }
  },

  {
    id:'infodose',
    name:'INFODOSE',
    voice:'Luciana',
    lang:'pt-BR',
    rate:1.06,
    pitch:0.96,
    color:'#22c55e',
    theme:{
      primary:'#22c55e',
      secondary:'#4ade80',
      bgSoft:'radial-gradient(circle at 60% 40%, rgba(34,197,94,.08), transparent)',
      glow:'0 0 18px rgba(34,197,94,.55)'
    }
  },

  {
    id:'horus',
    name:'HORUS',
    voice:'Flo',
    lang:'it-IT',
    rate:1.24,
    pitch:0.14,
    color:'#f59e0b',
    theme:{
      primary:'#f59e0b',
      secondary:'#fbbf24',
      bgSoft:'radial-gradient(circle at 40% 30%, rgba(245,158,11,.08), transparent)',
      glow:'0 0 18px rgba(245,158,11,.55)'
    }
  }

];


  /* -----------------------------
     State & Storage
     ----------------------------- */
  let state = {
    archIdx: 0,
    isSpeaking: false,
    blocks: [],
    currentBlockIdx: 0,
    isCollapsed: localStorage.getItem('kob_collapsed') === 'true'
  };

  const KOB_NS = 'kob_tts::v1::';
  const PST = k => KOB_NS + k;
  const StorageSafe = {
    get(k,d=null){ try{ const v = localStorage.getItem(PST(k)); return v==null? d : JSON.parse(v); }catch{return d} },
    set(k,v){ try{ localStorage.setItem(PST(k), JSON.stringify(v)); }catch{} }
  };

  /* -----------------------------
     Speech API (fallback)
     ----------------------------- */
  const synth = ('speechSynthesis' in window) ? window.speechSynthesis : null;
  if(!synth) toast('SpeechSynthesis não disponível');

  /* -----------------------------
     Idle & position helpers
     ----------------------------- */
  const IDLE_TIME = 9000;
  let idleTimer = null;
  function resetIdleTimer(){ if(!bar) return; bar.classList.remove('idle'); clearTimeout(idleTimer); idleTimer = setTimeout(()=> { if(!state.isCollapsed) bar.classList.add('idle'); }, IDLE_TIME); }

  function applyPosition(x,y){
    if(!bar) return;
    const maxX = window.innerWidth - bar.offsetWidth;
    const maxY = window.innerHeight - bar.offsetHeight;
    x = Math.max(0, Math.min(maxX, x)); y = Math.max(0, Math.min(maxY, y));
    bar.style.left = x + 'px'; bar.style.top = y + 'px';
    bar.classList.remove('snap-side','snap-side-right','snap-top','floating');
    if(y <= 40) bar.classList.add('snap-top');
    else if(x <= 40) bar.classList.add('snap-side');
    else if(x >= maxX - 40) bar.classList.add('snap-side-right');
    else bar.classList.add('floating');
  }

  function snapToEdges(){
    if(!bar) return;
    bar.style.transition = 'all .36s cubic-bezier(.175,.885,.32,1.275)';
    const r = bar.getBoundingClientRect();
    let x = r.left, y = r.top;
    if(y < 40){ y = 0; x = (window.innerWidth - r.width)/2; }
    else {
      if(x < 40) x = 0;
      if(x > window.innerWidth - r.width - 40) x = window.innerWidth - r.width;
    }
    applyPosition(x,y);
    try{ localStorage.setItem('kob_hud_pos', JSON.stringify({x,y})); }catch(e){}
    setTimeout(()=> bar.style.transition = '', 420);
  }

  /* -----------------------------
     Restore pos & HUD setup
     ----------------------------- */
  (function restore(){
    if(!bar) return;
    try{
      const s = JSON.parse(localStorage.getItem('kob_hud_pos') || '{"x":20,"y":120}');
      applyPosition(s.x, s.y);
    }catch(e){
      applyPosition(20,120);
    }
    if(state.isCollapsed) bar.classList.add('collapsed');
  })();

  (function setupHUD(){
    if(!bar) return;
    let dragging=false, start={x:0,y:0,ox:0,oy:0};
    bar.addEventListener('pointerdown', e => {
      if(e.target.closest('.symbol-button')) return;
      dragging = true; bar.classList.add('is-dragging');
      const rect = bar.getBoundingClientRect();
      start = { x: e.clientX, y: e.clientY, ox: e.clientX - rect.left, oy: e.clientY - rect.top };
      try{ bar.setPointerCapture(e.pointerId); }catch{}
    });
    bar.addEventListener('pointermove', e => {
      if(!dragging) return;
      bar.style.transition = 'none';
      applyPosition(e.clientX - start.ox, e.clientY - start.oy);
    });
    bar.addEventListener('pointerup', e => {
      if(!dragging) return;
      dragging = false; bar.classList.remove('is-dragging');
      try{ bar.releasePointerCapture(e.pointerId); }catch{}
      snapToEdges();
    });

    toggleBtn && toggleBtn.addEventListener('click', ()=>{
      state.isCollapsed = !state.isCollapsed;
      bar.classList.toggle('collapsed', state.isCollapsed);
      localStorage.setItem('kob_collapsed', state.isCollapsed);
      setTimeout(snapToEdges, 320);
    });

    ['mousemove','touchstart','mousedown','pointerdown'].forEach(ev=>{
      window.addEventListener(ev, resetIdleTimer, {passive:true});
    });
    resetIdleTimer();
  })();

  /* -----------------------------
     Symbol bar handler
     ----------------------------- */
  (function attachSymbolBarHandler(){
    if(!bar) return;
    bar.removeEventListener && bar.removeEventListener('click', ()=>{});
    bar.addEventListener('click', (ev) => {
      const btn = ev.target.closest('.symbol-button');
      if(!btn) return;

      // URL open buttons
      if(btn.dataset && btn.dataset.url){
        const url = String(btn.dataset.url).trim();
        if(url){
          try{
            if(frame && ('src' in frame)) frame.src = url;
            localStorage.setItem('kob_last_url', url);
            toast('Abrindo ' + url);
          }catch(e){
            console.warn('Erro ao abrir iframe:', e);
            toast('Erro ao abrir URL');
          }
        }
        return;
      }

      
      
      
      // TTS controls
      const bid = (btn.id || btn.dataset.id || btn.dataset.action || '').toString();

      const callTTS = (fnName) => {
        try{
          if(window.KOB_TTS && typeof window.KOB_TTS[fnName] === 'function'){
            window.KOB_TTS[fnName]();
            return true;
          }
          if(window.KOBLLUX && typeof window.KOBLLUX[fnName] === 'function'){
            window.KOBLLUX[fnName]();
            return true;
          }
          return false;
        }catch(err){
          console.warn('callTTS error', err);
          return false;
        }
      };

      switch(bid){
        case 'btn-play':
          callTTS('toggle') || callTTS('play') || callTTS('startSpeech') || callTTS('stopSpeech') || toast('TTS indisponível');
          break;
        case 'btn-next':
          callTTS('next') || (function(){
            if(window.KOBLLUX && window.KOBLLUX.state){
              window.KOBLLUX.state.currentBlockIdx = Math.min((window.KOBLLUX.state.blocks||[]).length-1, (window.KOBLLUX.state.currentBlockIdx||0)+1);
              if(window.KOBLLUX.state.isSpeaking) window.KOBLLUX.startSpeech && window.KOBLLUX.startSpeech();
            }
          })();
          break;
        case 'btn-prev':
          callTTS('prev') || (function(){
            if(window.KOBLLUX && window.KOBLLUX.state){
              window.KOBLLUX.state.currentBlockIdx = Math.max(0, (window.KOBLLUX.state.currentBlockIdx||0)-1);
              if(window.KOBLLUX.state.isSpeaking) window.KOBLLUX.startSpeech && window.KOBLLUX.startSpeech();
            }
          })();
          break;
        case 'btn-arch':
          callTTS('cycleArchetype') || (window.KOBLLUX && window.KOBLLUX.updateArchetype && window.KOBLLUX.updateArchetype((window.KOBLLUX.state.archIdx||0)+1));
          break;
        default:
          if(btn.dataset && btn.dataset.action === 'open-menu') toggleBtn && toggleBtn.click();
          break;
      }
    }, { passive: true });
  })();

  /* -----------------------------
     small util
     ----------------------------- */
  function hexToRgba(hex,a){ const c=(hex||'#000').replace('#',''); const r=parseInt(c.slice(0,2),16), g=parseInt(c.slice(2,4),16), b=parseInt(c.slice(4,6),16); return `rgba(${r},${g},${b},${a})`; }


/*function applyVoiceTheme(arch){

  const root = document.documentElement;

  root.style.setProperty('--kob-voice-primary', arch.theme.primary);
  root.style.setProperty('--kob-voice-secondary', arch.theme.secondary);
  root.style.setProperty('--kob-voice-bg-soft', arch.theme.bgSoft);
  root.style.setProperty('--kob-voice-glow', arch.theme.glow);

  document.body.dataset.voiceArch = arch.id;

}*/
  function applyVoiceTheme(arch) {
  if (!arch || !arch.theme) return;

  const root = document.documentElement;
  const body = document.body;

  const primary   = arch.theme.primary;
  const secondary = arch.theme.secondary;
  const soft      = arch.theme.soft || arch.theme.bgSoft;
  const glow      = arch.theme.glow;

  /* ─────────────
     TTS SYSTEM
  ───────────── */

  root.style.setProperty('--kob-tts-primary', primary);
  root.style.setProperty('--kob-tts-secondary', secondary);
  root.style.setProperty('--kob-tts-soft', soft);
  root.style.setProperty('--kob-tts-glow', glow);

  /* ─────────────
     VOICE SYSTEM (legacy)
  ───────────── */

  root.style.setProperty('--kob-voice-primary', primary);
  root.style.setProperty('--kob-voice-secondary', secondary);
  root.style.setProperty('--kob-voice-bg-soft', soft);
  root.style.setProperty('--kob-voice-glow', glow);

  /* ─────────────
     ARCH STATE
  ───────────── */

  body.setAttribute('data-voice-arch', arch.id);
}

  /* -----------------------------
     updateArchetype: update CSS + call engine.applyVoiceTheme if available
     ----------------------------- */
  function updateArchetype(idx){
    state.archIdx = (typeof idx === 'number') ? (idx % ARCHETYPES.length) : 0;
    const arch = ARCHETYPES[state.archIdx] || ARCHETYPES[0];

    // If engine available and has applyVoiceTheme, prefer engine to update UI theme
    try{
      if(window.KOBLLUX_VOICE_ENGINE && typeof window.KOBLLUX_VOICE_ENGINE.applyVoiceTheme === 'function'){
        // engine will handle CSS vars and body[data-voice-arch]
        window.KOBLLUX_VOICE_ENGINE.applyVoiceTheme(Object.assign({}, arch, { id: arch.id }));
      } else {
        // defensive local CSS vars
        const primary = arch.color || '#00f5ff';
        const soft = hexToRgba(primary, 0.14);
        document.documentElement.style.setProperty('--kob-voice-primary', primary);
        document.documentElement.style.setProperty('--kob-voice-secondary', primary);
        document.documentElement.style.setProperty('--kob-voice-bg-soft', soft);
        document.documentElement.style.setProperty('--kob-voice-outline', hexToRgba(primary, 0.28));
        if(document.body) document.body.setAttribute('data-voice-arch', arch.id);
      }
      if(hudStatus) hudStatus.textContent = arch.name;
    }catch(e){
      console.warn('updateArchetype fail', e);
    }

    try{
      if(outline){
        const primary = arch.color || '#00f5ff';
        outline.style.borderColor = primary;
        outline.style.boxShadow = `0 0 12px ${hexToRgba(primary,0.45)}, inset 0 0 8px ${hexToRgba(primary,0.2)}`;
        outline.style.background = hexToRgba(primary,0.06);
      }
    }catch(e){ console.warn('applyArchetypeTheme outline fail', e); }

    if(state.isSpeaking){ stopSpeech(); startSpeech(); }
  }

  /* -----------------------------
     Blocks scanning & status
     ----------------------------- */
  function scanBlocks(){
    try{
      const sel = 'h1,h2,h3,p,li,blockquote,pre,td,th';
      if(frame && frame.contentWindow){
        const doc = frame.contentDocument || frame.contentWindow.document;
        const nodes = [...doc.querySelectorAll(sel)].filter(n=> (n.innerText||'').trim().length > 0);
        if(nodes.length){ state.blocks = nodes; state.currentBlockIdx = 0; return; }
      }
    }catch(e){ /* cross-origin or other */ }

    const localNodes = [...(root.querySelectorAll ? root.querySelectorAll('h1,h2,h3,p,li,blockquote,pre,td,th') : [])].filter(n=> (n.innerText||'').trim().length > 0);
    state.blocks = localNodes;
    state.currentBlockIdx = 0;
  }

  function rebuildBlocks(){ scanBlocks(); setStatus(); }
  function setStatus(){ const el = $('#tts-status'); if(!el) return; if(!state.blocks.length) el.textContent='0/0'; else el.textContent = `${Math.min(state.currentBlockIdx+1, state.blocks.length)}/${state.blocks.length}`; }

  function showOutlineFor(node){
    if(!outline || !node){ outline.style.display='none'; return; }
    try{
      const rect = node.getBoundingClientRect();
      if(node.ownerDocument !== document && frame){
        const fRect = frame.getBoundingClientRect();
        outline.style.left = (fRect.left + rect.left) + 'px';
        outline.style.top = (fRect.top + rect.top) + 'px';
      } else {
        outline.style.left = (rect.left + window.scrollX) + 'px';
        outline.style.top = (rect.top + window.scrollY) + 'px';
      }
      outline.style.width = (rect.width + 8) + 'px';
      outline.style.height = (rect.height + 8) + 'px';
      outline.style.display = 'block';
    }catch(e){ outline.style.display = 'none'; }
  }
  function hideOutline(){ if(outline) outline.style.display = 'none'; }

  /* -----------------------------
     voice helpers (fallback)
     ----------------------------- */
  function findVoiceByNamePart(part){
    if(!synth) return null;
    const voices = synth.getVoices()||[];
    const v = voices.find(x => x.name && x.name.toLowerCase().includes(String(part||'').toLowerCase()));
    if(v) return v;
    return voices.find(x => /pt/i.test(x.lang)) || voices[0] || null;
  }

  /* -----------------------------
     speakCurrent() — uses engine when available, fallback to local synth
     ----------------------------- */
  function speakCurrent(){
    if(!state.blocks.length) rebuildBlocks();
    if(state.currentBlockIdx >= state.blocks.length){ stopSpeech(); toast('Fim da leitura'); return; }

    const el = state.blocks[state.currentBlockIdx];
    const arch = ARCHETYPES[state.archIdx] || ARCHETYPES[0];
    const txt = (el && el.innerText) ? el.innerText.trim() : '';
    if(!txt){ state.currentBlockIdx++; setStatus(); return speakCurrent(); }

    // Try to delegate to the voice engine
    const engine = window.KOBLLUX_VOICE_ENGINE || null;
    if(engine && typeof engine.activateArchetype === 'function' && typeof engine.speakWithCurrentArchetype === 'function'){
      try{
        engine.activateArchetype(arch.id);
        const ok = engine.speakWithCurrentArchetype(txt, {
          onStart(){
            showOutlineFor(el);
            setStatus();
          },
          onEnd(){
            if(state.isSpeaking){
              state.currentBlockIdx++;
              setTimeout(speakCurrent, 120);
            }
          },
          onError(){
            state.currentBlockIdx++;
            speakCurrent();
          }
        });
        if(ok) return;
      }catch(e){
        console.warn('voice engine call failed, falling back:', e);
      }
    }

    // fallback: use local SpeechSynthesis
    if(!synth){ toast('TTS indisponível'); return; }
    try{ synth.cancel(); }catch(e){}
    const u = new SpeechSynthesisUtterance(txt);
    const voice = findVoiceByNamePart(arch.voice);
    if(voice) u.voice = voice;
    if(arch.lang) u.lang = arch.lang;
    u.rate = arch.rate ?? 1;
    u.pitch = arch.pitch ?? 1;
    u.onstart = () => { showOutlineFor(el); setStatus(); };
    u.onend = () => {
      if(state.isSpeaking){ state.currentBlockIdx++; setStatus(); setTimeout(()=> speakCurrent(), 120); }
    };
    u.onerror = (ev) => { console.warn('tts error', ev); if(state.isSpeaking){ state.currentBlockIdx++; speakCurrent(); } };
    synth.speak(u);
  }

  /* -----------------------------
     start/stop
     ----------------------------- */
  function startSpeech(){
    if(!state.blocks.length) rebuildBlocks();
    if(!state.blocks.length){ toast('Nada para ler'); return; }
    state.isSpeaking = true;
    BTN_PLAY && (BTN_PLAY.textContent = '■');
    speakCurrent();
  }

  function stopSpeech(){
    state.isSpeaking = false;
    try{ synth && synth.cancel(); }catch(e){}
    BTN_PLAY && (BTN_PLAY.textContent = '▶');
    hideOutline();
    setStatus();
  }

  /* -----------------------------
     dock extras / selection read
     ----------------------------- */
  $('#tts-on') && $('#tts-on').addEventListener('click', ()=> { if(state.isSpeaking) stopSpeech(); else startSpeech(); });
  $('#tts-next') && $('#tts-next').addEventListener('click', ()=> { state.currentBlockIdx = Math.min(state.blocks.length-1, state.currentBlockIdx + 1); if(state.isSpeaking) speakCurrent(); else showOutlineFor(state.blocks[state.currentBlockIdx]); setStatus(); });
  $('#tts-prev') && $('#tts-prev').addEventListener('click', ()=> { state.currentBlockIdx = Math.max(0, state.currentBlockIdx - 1); if(state.isSpeaking) speakCurrent(); else showOutlineFor(state.blocks[state.currentBlockIdx]); setStatus(); });
  $('#tts-stop') && $('#tts-stop').addEventListener('click', ()=> stopSpeech());
  $('#tts-reset') && $('#tts-reset').addEventListener('click', ()=> { state.currentBlockIdx = 0; rebuildBlocks(); setStatus(); });
  $('#tts-reread') && $('#tts-reread').addEventListener('click', ()=> { state.currentBlockIdx = 0; startSpeech(); });
  $('#tts-sel') && $('#tts-sel').addEventListener('click', () => {
    const s = String(window.getSelection && window.getSelection());
    if (!s || !s.trim()) return toast('Selecione um trecho para ler.');

    const arch = ARCHETYPES[state.archIdx] || ARCHETYPES[0];

    // prefer engine speak
    try{
      if(window.KOBLLUX_VOICE_ENGINE && typeof window.KOBLLUX_VOICE_ENGINE.activateArchetype === 'function'){
        window.KOBLLUX_VOICE_ENGINE.activateArchetype(arch.id);
        const ok = window.KOBLLUX_VOICE_ENGINE.speakWithCurrentArchetype(s.trim(), {
          onStart(){ /* nothing */ },
          onEnd(){ /* nothing */ },
          onError(){ /* nothing */ }
        });
        if(ok) return;
      }
    }catch(e){ console.warn('engine speakWithCurrentArchetype failed', e); }

    // fallback local
    try { synth.cancel(); } catch(e){}
    const u = new SpeechSynthesisUtterance(String(sanitize(s)));
    const voice = findVoiceByNamePart(arch.voice);
    if (voice) u.voice = voice;
    if (arch.lang) u.lang = arch.lang;
    u.rate  = arch.rate ?? 1;
    u.pitch = arch.pitch ?? 1;
    synth.speak(u);
  });

  $('#tts-grid') && $('#tts-grid').addEventListener('click', ()=> {
    const prefs = StorageSafe.get('prefs', {});
    prefs.outline = !prefs.outline;
    StorageSafe.set('prefs', prefs);
    toast(prefs.outline ? 'Outline ativado' : 'Outline desativado');
  });

  function sanitize(txt){ return String(txt||'').replace(/\bCopiar\b/g,' ').replace(/\s{2,}/g,' ').trim(); }

  /* -----------------------------
     click to speak and click selection logic
     ----------------------------- */
  document.addEventListener('click', (ev) => {
    const selector = 'h1,h2,h3,p,li,blockquote,pre,td,th';
    const target = ev.target.closest ? ev.target.closest(selector) : null;
    if(!target) return;
    if(target.closest && (target.closest('#symbolBar') || target.closest('.kob-tts-dock'))) return;
    rebuildBlocks();
    let idx = state.blocks.findIndex(b => b.isEqualNode && b.isEqualNode(target));
    if(idx < 0){
      const ttext = (target.innerText || '').trim();
      idx = state.blocks.findIndex(b => (b.innerText||'').trim() === ttext);
    }
    if(idx >= 0) state.currentBlockIdx = idx;
    showOutlineFor(state.blocks[state.currentBlockIdx]);
    if(!state.isSpeaking) setStatus();
    const prefs = StorageSafe.get('prefs', {outline:true, clickToSpeak:true});
    if(prefs.clickToSpeak){ state.isSpeaking = true; startSpeech(); }
  }, {passive:true});

  // safe polyfill for isEqualNode usage
  Node.prototype.isEqualNode = Node.prototype.isEqualNode || function(other){ return this === other; };

  /* -----------------------------
     initial scan
     ----------------------------- */
  (function initial(){
    try{
      const last = localStorage.getItem('kob_last_url');
      if(last && frame && ('src' in frame)) frame.src = last;
    }catch(e){}
    try{ scanBlocks(); }catch(e){}
    setStatus();
    // inject basic voice theme CSS patch to ensure CSS vars exist (non-destructive)
    try{ injectVoiceThemeCSS(); }catch(e){}
  })();

  /* -----------------------------
     API exposure & compatibility wrapper
     ----------------------------- */
  window.KOBLLUX = window.KOBLLUX || {};
  Object.assign(window.KOBLLUX, { startSpeech, stopSpeech, rebuildBlocks, updateArchetype, state });

  // speakText wrapper: delegates to engine when possible, otherwise uses local synth
  window.KOBLLUX.speakText = window.KOBLLUX.speakText || function(txt, opts){
    try{
      const text = String(txt || '').trim();
      if(!text) return false;

      // Prefer engine
      if(window.KOBLLUX_VOICE_ENGINE && typeof window.KOBLLUX_VOICE_ENGINE.speakWithCurrentArchetype === 'function'){
        if(opts && opts.arch) window.KOBLLUX_VOICE_ENGINE.activateArchetype(opts.arch);
        return window.KOBLLUX_VOICE_ENGINE.speakWithCurrentArchetype(text, {
          onStart: opts && opts.onStart,
          onEnd:   opts && opts.onEnd,
          onError: opts && opts.onError
        });
      }

      // Legacy fallback
      const synthLocal = window.speechSynthesis;
      if(!synthLocal) return false;
      const utter = new SpeechSynthesisUtterance(text);
      // pick voice
      const voiceName = (opts && opts.voice) || (ARCHETYPES[state.archIdx] && ARCHETYPES[state.archIdx].voice) || null;
      const pickVoice = () => {
        try{
          const voices = synthLocal ? synthLocal.getVoices() : [];
          if(voiceName){
            const found = voices.find(v => v.name && v.name.toLowerCase().includes(String(voiceName).toLowerCase()));
            if(found) return found;
          }
          if(voices && voices.length) return voices.find(x => /pt/i.test(x.lang)) || voices[0];
        }catch(e){ /* ignore */ }
        return null;
      };
      const v = pickVoice();
      if(v) utter.voice = v;
      utter.rate = (opts && typeof opts.rate === 'number') ? opts.rate : (ARCHETYPES[state.archIdx] && ARCHETYPES[state.archIdx].rate) || 1.0;
      utter.pitch = (opts && typeof opts.pitch === 'number') ? opts.pitch : (ARCHETYPES[state.archIdx] && ARCHETYPES[state.archIdx].pitch) || 1.0;
      utter.lang = (opts && opts.lang) || (ARCHETYPES[state.archIdx] && ARCHETYPES[state.archIdx].lang) || 'pt-BR';
      try{ synthLocal.cancel(); }catch(e){}
      synthLocal.speak(utter);
      return true;
    }catch(e){
      console.warn('KOBLLUX.speakText failed', e);
      return false;
    }
  };

  /* -----------------------------
     injectVoiceThemeCSS (utility)
     ----------------------------- */
  function injectVoiceThemeCSS(){
    if(document.getElementById('KOB_VOICE_THEME_CSS_PATCH')) return;
    const patch = document.createElement('style');
    patch.id = 'KOB_VOICE_THEME_CSS_PATCH';
    patch.textContent = `
:root{ --kob-voice-theme-duration: 520ms; }
body, .nebula, details.acc, .btn, #fab, .kob-tts-dock, .kob-tts-panel.is-dock {
  transition: background var(--kob-voice-theme-duration) ease, box-shadow var(--kob-voice-theme-duration) ease, border-color var(--kob-voice-theme-duration) ease, color var(--kob-voice-theme-duration) ease;
}
`;
    document.head && document.head.appendChild(patch);

    if (!document.getElementById('KOBLLUX_VOICE_THEME_CSS')) {
      const style = document.createElement('style');
      style.id = 'KOBLLUX_VOICE_THEME_CSS';
      style.textContent = `
:root{
  --kob-voice-primary: #78e3ff;
  --kob-voice-secondary: #b978ff;
  --kob-voice-accent: #ffffff;
  --kob-voice-bg-soft: radial-gradient(900px 700px at 50% 10%,rgba(123,243,255,.06),transparent 80%), radial-gradient(600px 600px at 70% 100%,rgba(180,120,255,.04),transparent 80%), var(--bg);
  --kob-voice-glow: 0 0 18px rgba(0,216,216,0.55);
}
.kob-tts-dock{ background:var(--kob-voice-bg-soft); box-shadow:var(--kob-voice-glow); border-radius:12px; backdrop-filter:blur(16px); border:1px solid rgba(255,255,255,0.06); }
`;
      document.head.appendChild(style);
    }
  }

  /* -----------------------------
     small public helpers for debugging
     ----------------------------- */
  window.KOBLLUX.getArchetypes = () => ARCHETYPES.slice();
  window.KOBLLUX.setArchetypes = (arr) => { if(Array.isArray(arr)) { while(ARCHETYPES.length) ARCHETYPES.pop(); arr.forEach(a=>ARCHETYPES.push(a)); } };

  /* -----------------------------
     init: expose and set initial archetype
     ----------------------------- */
  try{
    updateArchetype(state.archIdx || 0);
  }catch(e){ console.warn('initial updateArchetype failed', e); }

  console.log('KOBLLUX glue init ✓');
  toast('KOBLLUX pronto ✓', 900);

})(); 
// end IIFE
/* ╔══════════════════════════════╗
   ║ KOBLLUX COB BRIDGE v1       ║
   ║ Colar no FINAL do COBJS     ║
   ╚══════════════════════════════╝ */

(() => {

if(window.KOBLLUX?.bridgeLoaded){
   console.log("Bridge já ativa");
   return;
}

window.KOBLLUX=window.KOBLLUX||{};
window.KOBLLUX.bridgeLoaded=true;

const NS="KOBLLUX_BRIDGE";

/* =========================
   FRAME PRINCIPAL
========================= */

const getFrame=()=>{

return document.getElementById("motorFrame")
||document.getElementById("content-frame")
||document.getElementById("frame")
||document.querySelector("iframe");

};

/* =========================
   ENVIAR
========================= */

window.KOBLLUX.send=(type,payload={})=>{

const frame=getFrame();

if(!frame?.contentWindow)return false;

frame.contentWindow.postMessage({

ns:NS,
type,
payload,
ts:Date.now()

},"*");

return true;

};

/* =========================
   RECEBER
========================= */

window.addEventListener(

"message",

e=>{

const msg=e.data;

if(
!msg||
msg.ns!==NS||
!msg.type
)return;

switch(msg.type){

case"READY":

console.log(
"⚡ Motor pronto",
msg.payload
);

break;


case"PONG":

window.KOBLLUX.state=
window.KOBLLUX.state||{};

window.KOBLLUX.state.child=
msg.payload;

break;


case"STATE":

window.KOBLLUX.state=
window.KOBLLUX.state||{};

window.KOBLLUX.state.bridge=
msg.payload;

break;


case"ARCHETYPE_CHANGE":

if(
typeof
window.KOBLLUX.updateArchetype
==="function"
){

window.KOBLLUX
.updateArchetype(
msg.payload.idx
);

}

break;


case"SPEAK":

if(
typeof
window.KOBLLUX.speakText
==="function"
){

window.KOBLLUX.speakText(
msg.payload.text||""
);

}

break;


case"LOG":

console.log(
"[COB]",
msg.payload
);

break;

}

});

/* =========================
   EVENTOS DO SISTEMA
========================= */

window.addEventListener(

"KOBLLUX_VOICES_READY",

()=>{

console.log(
"🎙️ vozes integradas"
);

window.KOBLLUX.send(

"VOICES_READY",

{

total:
Object.keys(
window.KOBLLUX_VOICES||{}
).length

});

}

);

/* =========================
   HOOK ARCHETYPE
========================= */

if(

window.KOBLLUX
.updateArchetype

){

const old=
window.KOBLLUX
.updateArchetype;

window.KOBLLUX
.updateArchetype=

function(idx){

old.call(
this,
idx
);

const arche=

ARCHETYPES[idx];

window.KOBLLUX.send(

"ARCHETYPE_CHANGE",

{

idx,
id:arche?.id,
name:arche?.name,
voice:arche?.voice

});

};

}

/* =========================
   HOOK SPEECH
========================= */

if(
window.KOBLLUX
.speakText
){

const oldSpeak=
window.KOBLLUX
.speakText;

window.KOBLLUX
.speakText=

function(){

window.KOBLLUX.send(

"SPEAK",

{

text:
arguments[0]

});

return oldSpeak
.apply(
this,
arguments
);

};

}

/* =========================
   PING VIVO
========================= */

setInterval(()=>{

window.KOBLLUX.send(

"PING",

{

time:Date.now()

});

},5000);


/* =========================
   BOOT
========================= */

window.addEventListener(

"DOMContentLoaded",

()=>{

window.KOBLLUX.send(

"READY",

{

title:
document.title,

archs:
ARCHETYPES?.length||0

});

});

})();
// ╔═══════════════════════════════════════════════════════╗
// ║  KxaT-arch-loader.js                                 ║
// ║  Real-time Archetype Fetch + CSS Patch Engine        ║
// ║  KD1 · KOBLLUX · ATLAS MODE ✓                        ║
// ║                                                      ║
// ║  FLUXO:                                              ║
// ║  1. Tenta fetch do JSON remoto (URL configurável)    ║
// ║  2. Fallback para localStorage (sessão anterior)     ║
// ║  3. Fallback para ARCHETYPES local embutido          ║
// ║  4. Aplica html[data-arch] + CSS vars em runtime     ║
// ║  5. Expõe window.KOBLLUX_ARCH_LOADER para outros JS  ║
// ╚═══════════════════════════════════════════════════════╝

(function () {
  'use strict';

  /* ─────────────────────────────────────────────────────────
     GUARD — roda só uma vez por sessão
  ───────────────────────────────────────────────────────── */
  if (window.__KxaT_ARCH_LOADER_INIT__) {
    console.log('[ArchLoader] já ativo.');
    return;
  }
  window.__KxaT_ARCH_LOADER_INIT__ = true;

  /* ─────────────────────────────────────────────────────────
     CONFIG — edite aqui para apontar para seu JSON
     O JSON remoto pode estar em:
       • GitHub Pages  → seu repo /arquetipos.json
       • Duo app       → gerado dinamicamente e servido
       • localStorage  → cache automático da sessão anterior
  ───────────────────────────────────────────────────────── */
  const CFG = {
    // URL primária do JSON de arquétipos (altere conforme necessário)
    remoteUrl: localStorage.getItem('kxat_arch_url') ||
      'https://www.infodose.com.br/js/modules/archetypes.json',

    // Chave localStorage para cache do JSON
    cacheKey: 'kxat_arch_cache',

    // Chave para o índice do arquétipo ativo
    archIdxKey: 'kob_arch_id',

    // Intervalo de re-fetch (ms) — 0 = sem polling automático
    // Defina ex: 30000 para atualizar a cada 30s em tempo real
    pollInterval: 0,

    // Timeout do fetch em ms
    fetchTimeout: 8000,
  };

  /* ─────────────────────────────────────────────────────────
     ROOT LAYER — mesma hierarquia do kob-glue-dh10.js
  ───────────────────────────────────────────────────────── */
  const HTML = document.documentElement;   // <html> — CSS selector root
  const BODY = document.body;
  const META = document.querySelector('meta[name="kob-arch"]');

  /* ─────────────────────────────────────────────────────────
     STATE
  ───────────────────────────────────────────────────────── */
  let _archetypes = [];   // array vivo — substituído pelo fetch
  let _activeIdx  = 0;
  let _pollTimer  = null;

  /* ─────────────────────────────────────────────────────────
     UTIL — hexToRgba
  ───────────────────────────────────────────────────────── */
  function hexToRgba(hex, a) {
    const c = String(hex || '#000').replace('#', '');
    const r = parseInt(c.slice(0, 2), 16);
    const g = parseInt(c.slice(2, 4), 16);
    const b = parseInt(c.slice(4, 6), 16);
    return `rgba(${r},${g},${b},${a})`;
  }

  /* ─────────────────────────────────────────────────────────
     UTIL — normaliza um arquétipo vindo do JSON
     Aceita o formato do arquetipos_2.json (arquetipos_visuais)
     E também o formato do KxaT-inline-00.js (ARCHETYPES array)
  ───────────────────────────────────────────────────────── */
  function normalizeArch(raw) {
    if (!raw || typeof raw !== 'object') return null;

    // Formato KxaT-inline-00.js já tem .theme completo
    if (raw.theme && raw.theme.primary) return raw;

    // Formato arquetipos_2.json — tem .p (primary), .s (secondary), .a (accent)
    const primary   = raw.p   || raw.color   || '#00f5ff';
    const secondary = raw.s   || primary;
    const color     = raw.p   || raw.color   || primary;

    return {
      id:      String(raw.name || raw.id || 'unknown').toLowerCase(),
      name:    String(raw.name || raw.id || 'UNKNOWN').toUpperCase(),
      opcode:  raw.opcode  || null,
      hz:      raw.hz      || 432,
      emoji:   raw.emoji   || '●',
      role:    raw.role    || '',
      voice:   raw.voice   || null,
      lang:    raw.lang    || 'pt-BR',
      rate:    raw.rate    || 1.0,
      pitch:   raw.pitch   || 1.0,
      color,
      theme: {
        primary,
        secondary,
        accent:  raw.a || secondary,
        bgSoft: `radial-gradient(circle at 40% 20%, ${hexToRgba(primary, 0.09)}, transparent)`,
        glow:   `0 0 18px ${hexToRgba(primary, 0.55)}`,
      }
    };
  }

  /* ─────────────────────────────────────────────────────────
     UTIL — normaliza um JSON inteiro
     Suporta:
       • Array direto: [{...}, {...}]
       • Objeto com .arquetipos_visuais (formato Blue)
       • Objeto com raiz livre de keys → pega o primeiro array
  ───────────────────────────────────────────────────────── */
  function normalizeJSON(data) {
    let arr = [];

    if (Array.isArray(data)) {
      arr = data;
    } else if (data && Array.isArray(data.arquetipos_visuais)) {
      // formato arquetipos_2.json — pega os visuais (têm cores)
      arr = data.arquetipos_visuais;
    } else if (data && typeof data === 'object') {
      // tenta achar qualquer array no primeiro nível
      const found = Object.values(data).find(v => Array.isArray(v));
      if (found) arr = found;
    }

    return arr.map(normalizeArch).filter(Boolean);
  }

  /* ─────────────────────────────────────────────────────────
     CSS PATCH — injeta as regras html[data-arch="X"]
     em runtime, para todos os arquétipos carregados
  ───────────────────────────────────────────────────────── */
  function injectArchCSS(archetypes) {
    const styleId = 'KXAT_ARCH_CSS_RUNTIME';
    let el = document.getElementById(styleId);
    if (!el) {
      el = document.createElement('style');
      el.id = styleId;
      document.head.appendChild(el);
    }

    const rules = archetypes.map(arch => {
      const t = arch.theme;
      return `
html[data-arch="${arch.id}"] {
  --kob-voice-primary:   ${t.primary};
  --kob-voice-secondary: ${t.secondary};
  --kob-voice-glow:      ${t.glow};
  --kob-voice-bg-soft:   ${t.bgSoft};
  --kob-tts-primary:     ${t.primary};
  --kob-tts-secondary:   ${t.secondary};
  --kob-tts-glow:        ${t.glow};
  --orb-primary:         ${t.primary};
  --orb-secondary:       ${t.secondary};
  --orb-accent:          ${t.accent || t.secondary};
  --grad-a:              ${t.primary};
}`.trim();
    }).join('\n\n');

    el.textContent = rules;
    console.log(`[ArchLoader] CSS patch injetado — ${archetypes.length} arquétipos`);
  }

  /* ─────────────────────────────────────────────────────────
     APPLY THEME — escreve nas 4 camadas
  ───────────────────────────────────────────────────────── */
  function applyTheme(arch) {
    if (!arch || !arch.theme) return;
    const t = arch.theme;

    // Layer 1 — html[data-arch] (CSS selector truth)
    HTML.setAttribute('data-arch',       arch.id);
    HTML.setAttribute('data-voice-arch', arch.id);

    // Layer 2 — body[data-voice-arch] (legacy compat)
    if (BODY) BODY.setAttribute('data-voice-arch', arch.id);

    // Layer 3 — meta[name="kob-arch"]
    if (META) META.setAttribute('content', arch.id);

    // Layer 4 — CSS custom properties (JS-driven, suplementam o CSS)
    const root = HTML;
    root.style.setProperty('--kob-voice-primary',   t.primary);
    root.style.setProperty('--kob-voice-secondary', t.secondary);
    root.style.setProperty('--kob-voice-bg-soft',   t.bgSoft);
    root.style.setProperty('--kob-voice-glow',      t.glow);
    root.style.setProperty('--kob-tts-primary',     t.primary);
    root.style.setProperty('--kob-tts-secondary',   t.secondary);
    root.style.setProperty('--orb-primary',         t.primary);
    root.style.setProperty('--orb-secondary',       t.secondary);
    root.style.setProperty('--orb-accent',          t.accent || t.secondary);
    root.style.setProperty('--grad-a',              t.primary);

    // HUD status text
    const hud = document.getElementById('hudStatus');
    if (hud) hud.textContent = arch.name + (arch.role ? ' · ' + arch.role : '');

    // Propaga para KOBLLUX global se disponível
    try {
      if (window.KOBLLUX && typeof window.KOBLLUX.applyVoiceTheme === 'function') {
        window.KOBLLUX.applyVoiceTheme(arch);
      }
    } catch (e) {}

    // Persiste ID no localStorage
    try { localStorage.setItem('kob_arch_id', arch.id); } catch (e) {}

    console.log(`[ArchLoader] Tema aplicado → ${arch.name} (${arch.id})`);
    window.dispatchEvent(new CustomEvent('KXAT_ARCH_CHANGED', { detail: arch }));
  }

  /* ─────────────────────────────────────────────────────────
     SET ACTIVE ARCHETYPE — por ID ou índice
  ───────────────────────────────────────────────────────── */
  function setArchById(id) {
    const idx = _archetypes.findIndex(a => a.id === id);
    if (idx >= 0) {
      _activeIdx = idx;
      applyTheme(_archetypes[idx]);
      return true;
    }
    return false;
  }

  function setArchByIndex(idx) {
    const len = _archetypes.length;
    if (!len) return false;
    _activeIdx = ((idx % len) + len) % len;
    applyTheme(_archetypes[_activeIdx]);
    return true;
  }

  function cycleArch(step = 1) {
    return setArchByIndex(_activeIdx + step);
  }

  /* ─────────────────────────────────────────────────────────
     LOAD ARCHETYPES — aplica array normalizado
  ───────────────────────────────────────────────────────── */
  function loadArchetypes(arr, source) {
    if (!Array.isArray(arr) || !arr.length) {
      console.warn('[ArchLoader] array vazio ou inválido, ignorado.');
      return;
    }

    _archetypes = arr;

    // Injeta CSS para todos os arquétipos
    injectArchCSS(_archetypes);

    // Expõe no KOBLLUX global (compatibilidade com kob-glue-dh10.js)
    try {
      if (window.KOBLLUX && typeof window.KOBLLUX.setArchetypes === 'function') {
        window.KOBLLUX.setArchetypes(_archetypes);
      }
    } catch (e) {}

    // Restaura arquétipo salvo ou usa o primeiro
    const savedId = localStorage.getItem(CFG.archIdxKey);
    const restored = savedId ? setArchById(savedId) : false;
    if (!restored) setArchByIndex(0);

    console.log(`[ArchLoader] ${arr.length} arquétipos carregados (fonte: ${source})`);
    window.dispatchEvent(new CustomEvent('KXAT_ARCH_LOADED', {
      detail: { archetypes: _archetypes, source }
    }));
  }

  /* ─────────────────────────────────────────────────────────
     CACHE localStorage
  ───────────────────────────────────────────────────────── */
  function saveCache(arr) {
    try {
      localStorage.setItem(CFG.cacheKey, JSON.stringify(arr));
    } catch (e) {}
  }

  function loadCache() {
    try {
      const raw = localStorage.getItem(CFG.cacheKey);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : null;
    } catch (e) {
      return null;
    }
  }

  /* ─────────────────────────────────────────────────────────
     FETCH remoto com timeout
  ───────────────────────────────────────────────────────── */
  async function fetchWithTimeout(url, ms) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), ms);
    try {
      const res = await fetch(url, {
        mode: 'cors',
        credentials: 'omit',
        signal: controller.signal,
      });
      clearTimeout(timer);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (e) {
      clearTimeout(timer);
      throw e;
    }
  }

  /* ─────────────────────────────────────────────────────────
     FETCH + MERGE — lógica principal
     1. Tenta URL remota
     2. Fallback localStorage cache
     3. Fallback ARCHETYPES local (window.KOBLLUX_VOICES)
  ───────────────────────────────────────────────────────── */
  async function fetchAndApply(url) {
    // ── 1. Remote fetch ──
    try {
      console.log(`[ArchLoader] Buscando ${url} …`);
      const data = await fetchWithTimeout(url, CFG.fetchTimeout);
      const arr  = normalizeJSON(data);

      if (arr.length) {
        saveCache(arr);          // atualiza cache
        loadArchetypes(arr, 'remote:' + url);
        return;
      }
      throw new Error('JSON sem arquétipos válidos');
    } catch (e) {
      console.warn(`[ArchLoader] Fetch remoto falhou (${e.message}), tentando cache…`);
    }

    // ── 2. localStorage cache ──
    const cached = loadCache();
    if (cached && cached.length) {
      loadArchetypes(cached, 'cache:localStorage');
      return;
    }

    // ── 3. Fallback — KOBLLUX_VOICES global (KxaT-inline-00.js)
    //       ou ARCHETYPES local (kob-glue-dh10.js)
    const fallbackVoices = window.KOBLLUX_VOICES
      ? Object.values(window.KOBLLUX_VOICES)
      : null;
    const fallbackGlobal = window.KOBLLUX && window.KOBLLUX.getArchetypes
      ? window.KOBLLUX.getArchetypes()
      : null;
    const fallback = fallbackVoices || fallbackGlobal || [];

    if (fallback.length) {
      const arr = normalizeJSON(fallback);
      loadArchetypes(arr, 'fallback:global');
      return;
    }

    console.error('[ArchLoader] Nenhuma fonte de arquétipos disponível.');
    window.dispatchEvent(new CustomEvent('KXAT_ARCH_ERROR', { detail: { url } }));
  }

  /* ─────────────────────────────────────────────────────────
     POLLING — re-fetch periódico para atualização em tempo real
     Uso: window.KOBLLUX_ARCH_LOADER.startPolling(30000)
  ───────────────────────────────────────────────────────── */
  function startPolling(intervalMs) {
    stopPolling();
    if (!intervalMs || intervalMs <= 0) return;
    _pollTimer = setInterval(() => fetchAndApply(CFG.remoteUrl), intervalMs);
    console.log(`[ArchLoader] Polling ativo — intervalo ${intervalMs}ms`);
  }

  function stopPolling() {
    if (_pollTimer) { clearInterval(_pollTimer); _pollTimer = null; }
  }

  /* ─────────────────────────────────────────────────────────
     setRemoteUrl — muda a URL e re-faz o fetch
     Útil quando a Duo app sabe o endpoint certo
  ───────────────────────────────────────────────────────── */
  function setRemoteUrl(url) {
    CFG.remoteUrl = url;
    try { localStorage.setItem('kxat_arch_url', url); } catch (e) {}
    console.log('[ArchLoader] URL atualizada →', url);
    return fetchAndApply(url);
  }

  /* ─────────────────────────────────────────────────────────
     patchFromObject — injeta um arquétipo avulso sem fetch
     Útil quando a Duo app envia via postMessage ou WebSocket
  ───────────────────────────────────────────────────────── */
  function patchFromObject(rawArch) {
    const arch = normalizeArch(rawArch);
    if (!arch) { console.warn('[ArchLoader] patchFromObject: objeto inválido'); return; }

    // Merge: adiciona ou substitui no array vivo
    const existing = _archetypes.findIndex(a => a.id === arch.id);
    if (existing >= 0) {
      _archetypes[existing] = arch;
    } else {
      _archetypes.push(arch);
    }

    // Rebake CSS
    injectArchCSS(_archetypes);

    // Aplica se for o ativo
    if (!_archetypes[_activeIdx] || _archetypes[_activeIdx].id === arch.id) {
      applyTheme(arch);
    }

    saveCache(_archetypes);
    console.log(`[ArchLoader] patchFromObject → ${arch.name} merged`);
    window.dispatchEvent(new CustomEvent('KXAT_ARCH_PATCHED', { detail: arch }));
  }

  /* ─────────────────────────────────────────────────────────
     patchFromJSON — recebe string ou objeto JSON completo
  ───────────────────────────────────────────────────────── */
  function patchFromJSON(jsonStringOrObj) {
    try {
      const data = typeof jsonStringOrObj === 'string'
        ? JSON.parse(jsonStringOrObj)
        : jsonStringOrObj;
      const arr = normalizeJSON(data);
      if (!arr.length) throw new Error('Nenhum arquétipo válido');
      loadArchetypes(arr, 'patchFromJSON');
    } catch (e) {
      console.warn('[ArchLoader] patchFromJSON falhou:', e.message);
    }
  }

  /* ─────────────────────────────────────────────────────────
     postMessage bridge — Duo app pode enviar:
     { type: 'KXAT_PATCH_ARCH', payload: { arch: {...} } }
     { type: 'KXAT_LOAD_JSON',  payload: { data: {...} } }
     { type: 'KXAT_SET_URL',    payload: { url: '...' }  }
     { type: 'KXAT_CYCLE',      payload: { step: 1 }     }
  ───────────────────────────────────────────────────────── */
  window.addEventListener('message', (e) => {
    const msg = e.data;
    if (!msg || typeof msg !== 'object') return;

    switch (msg.type) {
      case 'KXAT_PATCH_ARCH':
        if (msg.payload?.arch) patchFromObject(msg.payload.arch);
        break;
      case 'KXAT_LOAD_JSON':
        if (msg.payload?.data) patchFromJSON(msg.payload.data);
        break;
      case 'KXAT_SET_URL':
        if (msg.payload?.url) setRemoteUrl(msg.payload.url);
        break;
      case 'KXAT_CYCLE':
        cycleArch(msg.payload?.step ?? 1);
        break;
      case 'KXAT_SET_ARCH':
        if (msg.payload?.id) setArchById(msg.payload.id);
        break;
    }
  });

  /* ─────────────────────────────────────────────────────────
     Integração com KOBLLUX.updateArchetype existente
     Se kob-glue-dh10.js já existe, faz hook
  ───────────────────────────────────────────────────────── */
  function hookKOBLLUX() {
    if (!window.KOBLLUX) return;

    // Sobrescreve updateArchetype para usar nosso array vivo
    const _oldUpdate = window.KOBLLUX.updateArchetype;
    window.KOBLLUX.updateArchetype = function (idx) {
      // Tenta usar o array vivo do loader
      if (_archetypes.length) {
        setArchByIndex(idx);
      } else if (typeof _oldUpdate === 'function') {
        _oldUpdate.call(this, idx);
      }
    };

    // Expõe cycleArch no KOBLLUX
    window.KOBLLUX.cycleArch = cycleArch;
    console.log('[ArchLoader] Hook KOBLLUX.updateArchetype instalado');
  }

  /* ─────────────────────────────────────────────────────────
     API PÚBLICA — window.KOBLLUX_ARCH_LOADER
  ───────────────────────────────────────────────────────── */
  window.KOBLLUX_ARCH_LOADER = {
    // Leitura
    getArchetypes:  ()  => _archetypes.slice(),
    getActive:      ()  => _archetypes[_activeIdx] || null,
    getActiveIdx:   ()  => _activeIdx,

    // Navegação
    setArchById,
    setArchByIndex,
    cycleArch,

    // Fetch / Patch
    fetch:          ()  => fetchAndApply(CFG.remoteUrl),
    setRemoteUrl,
    patchFromObject,
    patchFromJSON,

    // Polling
    startPolling,
    stopPolling,

    // Config
    getCfg: ()  => ({ ...CFG }),
    setCfg: (patch) => Object.assign(CFG, patch),
  };

  /* ─────────────────────────────────────────────────────────
     BOOT
  ───────────────────────────────────────────────────────── */
  // Aguarda voices do KxaT-inline-00.js se necessário
  if (window.KOBLLUX_VOICES && Object.keys(window.KOBLLUX_VOICES).length) {
    // Voices já carregadas — usa como fallback imediato antes do fetch
    const arr = normalizeJSON(Object.values(window.KOBLLUX_VOICES));
    if (arr.length) {
      _archetypes = arr;
      injectArchCSS(arr);
      const savedId = localStorage.getItem(CFG.archIdxKey);
      if (savedId) setArchById(savedId); else setArchByIndex(0);
    }
  }

  // Fetch remoto — substitui o fallback quando chegar
  fetchAndApply(CFG.remoteUrl);

  // Hook KOBLLUX global (pode não estar pronto ainda)
  hookKOBLLUX();
  window.addEventListener('KOBLLUX_VOICES_READY', () => {
    hookKOBLLUX();
    // Re-enriquece o array com dados de voz do KxaT-inline-00.js
    if (window.KOBLLUX_VOICES) {
      _archetypes = _archetypes.map(arch => {
        const voice = window.KOBLLUX_VOICES[arch.id];
        if (voice) return Object.assign({}, arch, {
          voice: voice.voice || arch.voice,
          lang:  voice.lang  || arch.lang,
          rate:  voice.rate  || arch.rate,
          pitch: voice.pitch || arch.pitch,
        });
        return arch;
      });
      saveCache(_archetypes);
    }
  });

  // Polling automático se configurado
  if (CFG.pollInterval > 0) startPolling(CFG.pollInterval);

  console.log('[ArchLoader] ✓ KxaT-arch-loader ativo | html[data-arch] root | fetch:', CFG.remoteUrl);

})();
