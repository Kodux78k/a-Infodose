
/* =============================================================
   FUSION CORE MONOLITH v1
   =============================================================
   ARQUITETURA
   01. DOM Registry
   02. Crypto
   03. Persistent State
   04. Avatar Engine
   05. Activation Engine
   06. Unified Interface
   07. Vault
   08. Keys
   09. Modes
   10. Gestures
   11. UI helpers
   12. Initialization
   IMPORTANTE:
   updateInterface() existe UMA ÚNICA VEZ.
   ============================================================= */
/* =============================================================
   01. DOM REGISTRY
   ============================================================= */
const byId = (...ids) =>
  ids
    .map(id => document.getElementById(id))
    .find(Boolean);
const els = {
  card: byId('mainCard'),
  header: byId('cardHeader'),
  avatarTgt: byId('avatarTarget'),
  input: byId(
    'kardinputUser',
    'inputUser',
    'userInput'
  ),
  lblHello: byId('lblHello'),
  lblName: byId('lblName'),
  clock: byId('clockTime'),
  smallPreview: byId('smallPreview'),
  smallMiniAvatar: byId('smallMiniAvatar'),
  smallText: byId('smallText'),
  smallIdent: byId('smallIdent'),
  actCard: byId('activationCard'),
  actPre: byId('actPre'),
  actName: byId('actName'),
  actMiniAvatar: byId('actMiniAvatar'),
  actBadge: byId('actBadge'),
  btnModeCard: byId('btnModeCard'),
  btnModeOrb: byId('btnModeOrb'),
  btnModeHud: byId('btnModeHud'),
  orbMenuTrigger: byId('orbMenuTrigger'),
  hudMenuBtn: byId('hudMenuBtn'),
  snapZone: byId('snap-zone'),
  keysModal: byId('keysModal'),
  keyList: byId('keyList'),
  keyName: byId('keyNameInput'),
  keyToken: byId('keyTokenInput'),
  addKeyBtn: byId('addKeyBtn'),
  closeKeysBtn: byId('closeKeysBtn'),
  lockVaultBtn: byId('lockVaultBtn'),
  vaultStatusText: byId('vaultStatusText'),
  vaultModal: byId('vaultModal'),
  vaultPass: byId('vaultPassInput'),
  vaultUnlock: byId('vaultUnlockBtn'),
  vaultCancel: byId('vaultCancelBtn'),
  systemCard: byId('systemCard'),
  saveSystemBtn: byId('saveSystemBtn'),
  copyActBtn: byId('copyActBtn'),
  infodoseNameInput: byId(
    'kardinfodoseNameInput',
    'infodoseNameInput',
    'cardInfodoseNameInput'
  ),
  apiKeyInput: byId(
    'kardapiKeyInput',
    'apiKeyInput',
    'cardApiKeyInput'
  ),
  modelSelect: byId(
    'kardmodelSelect',
    'modelSelect',
    'cardModelSelect'
  )
};
/* =============================================================
   02. CRYPTO ENGINE
   ============================================================= */
const CRYPTO = {
  algo: {
    name: 'AES-GCM',
    length: 256
  },
  pbkdf2: {
    name: 'PBKDF2',
    hash: 'SHA-256',
    iterations: 100000
  },
  async getKey(password, salt) {
    const enc = new TextEncoder();
    const material =
      await window.crypto.subtle.importKey(
        'raw',
        enc.encode(password),
        'PBKDF2',
        false,
        ['deriveKey']
      );
    return window.crypto.subtle.deriveKey(
      {
        ...this.pbkdf2,
        salt
      },
      material,
      this.algo,
      false,
      ['encrypt', 'decrypt']
    );
  },
  async encrypt(data, password) {
    const salt =
      window.crypto.getRandomValues(
        new Uint8Array(16)
      );
    const iv =
      window.crypto.getRandomValues(
        new Uint8Array(12)
      );
    const key =
      await this.getKey(password, salt);
    const encoded =
      new TextEncoder().encode(
        JSON.stringify(data)
      );
    const encrypted =
      await window.crypto.subtle.encrypt(
        {
          name: 'AES-GCM',
          iv
        },
        key,
        encoded
      );
    return JSON.stringify({
      s: Array.from(salt),
      iv: Array.from(iv),
      d: Array.from(
        new Uint8Array(encrypted)
      )
    });
  },
  async decrypt(bundleStr, password) {
    try {
      const bundle =
        JSON.parse(bundleStr);
      const salt =
        new Uint8Array(bundle.s);
      const iv =
        new Uint8Array(bundle.iv);
      const data =
        new Uint8Array(bundle.d);
      const key =
        await this.getKey(
          password,
          salt
        );
      const decrypted =
        await window.crypto.subtle.decrypt(
          {
            name: 'AES-GCM',
            iv
          },
          key,
          data
        );
      return JSON.parse(
        new TextDecoder().decode(
          decrypted
        )
      );
    } catch (error) {
      throw new Error(
        'Senha incorreta ou dados corrompidos'
      );
    }
  }
};
/* =============================================================
   03. STATE / PERSISTENCE
   ============================================================= */
const STORAGE_KEY =
  'fusion_os_data_v2';
const UI_STATE_KEY =
  'fusion_os_ui_state';
const FIRST_PREVIEW_KEY =
  'fusion_orb_smallpreview_shown';
let STATE = {
  keys: [],
  user: 'Convidado',
  isEncrypted: false,
  encryptedData: null
};
let SESSION_PASSWORD = null;
let apiKey =
  localStorage.getItem('di_apiKey') || '';
let modelName =
  localStorage.getItem('di_modelName') ||
  'nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free';
let userName =
  localStorage.getItem('di_userName') ||
  '';
let infodoseName =
  localStorage.getItem('di_infodoseName') ||
  '';
/* =============================================================
   UI STATE
   ============================================================= */
function saveUIState() {
  const mode =
    state.isOrb
      ? 'orb'
      : state.isHud
        ? 'hud'
        : 'card';
  const uiState = {
    mode,
    left:
      els.card?.style.left || '',
    top:
      els.card?.style.top || ''
  };
  localStorage.setItem(
    UI_STATE_KEY,
    JSON.stringify(uiState)
  );
}
function loadUIState() {
  const raw =
    localStorage.getItem(UI_STATE_KEY);
  if (!raw) return;
  try {
    const ui =
      JSON.parse(raw);
    if (
      ui.mode === 'orb' ||
      ui.mode === 'hud'
    ) {
      if (els.card) {
        els.card.style.transition = 'none';
      }
      if (ui.mode === 'orb') {
        if (ui.left && els.card)
          els.card.style.left = ui.left;
        if (ui.top && els.card)
          els.card.style.top = ui.top;
        setMode('orb', true);
      } else {
        setMode('hud', true);
      }
      setTimeout(() => {
        if (els.card)
          els.card.style.transition = '';
      }, 200);
    }
  } catch (error) {
    console.error(
      'UI Load Error',
      error
    );
  }
}
/* =============================================================
   DATA SAVE
   ============================================================= */
function saveData() {
  const payload = {
    keys: STATE.keys,
    user: STATE.user
  };
  if (SESSION_PASSWORD) {
    CRYPTO
      .encrypt(
        payload,
        SESSION_PASSWORD
      )
      .then(enc => {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({
            isEncrypted: true,
            data: enc
          })
        );
        STATE.isEncrypted = true;
        STATE.encryptedData = enc;
        updateSecurityUI();
      })
      .catch(error => {
        console.error(
          'Vault save error:',
          error
        );
      });
  } else {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        isEncrypted: false,
        data: payload
      })
    );
  }
}
/* =============================================================
   DATA LOAD
   ============================================================= */
async function loadData() {
  const raw =
    localStorage.getItem(
      STORAGE_KEY
    );
  if (!raw) {
    updateInterface(
      userName || 'Convidado'
    );
    return;
  }
  try {
    const parsed =
      JSON.parse(raw);
    if (parsed.isEncrypted) {
      STATE.isEncrypted = true;
      STATE.encryptedData = parsed.data;
      updateSecurityUI();
    } else {
      STATE.keys =
        parsed.data?.keys || [];
      STATE.user =
        parsed.data?.user ||
        'Convidado';
      const active =
        STATE.keys.find(
          key => key.active
        );
      if (
        active &&
        active.token
      ) {
        localStorage.setItem(
          'di_apiKey',
          active.token
        );
        apiKey = active.token;
      }
      if (
        STATE.user !==
        'Convidado'
      ) {
        localStorage.setItem(
          'di_userName',
          STATE.user
        );
        userName =
          STATE.user;
      }
      updateInterface(
        STATE.user
      );
      renderKeysList();
    }
  } catch (error) {
    console.error(
      'Data load error:',
      error
    );
    showToaster(
      'Erro ao carregar dados.',
      'error'
    );
  }
  if (els.apiKeyInput)
    els.apiKeyInput.value =
      apiKey;
  if (els.infodoseNameInput)
    els.infodoseNameInput.value =
      infodoseName;
  if (els.modelSelect)
    els.modelSelect.value =
      modelName;
}
/* =============================================================
   HASH
   ============================================================= */
function hashStr(s) {
  let h = 0xdeadbeef;
  for (
    let i = 0;
    i < s.length;
    i++
  ) {
    h = Math.imul(
      h ^ s.charCodeAt(i),
      2654435761
    );
  }
  return (
    h ^
    h >>> 16
  ) >>> 0;
}
/* =============================================================
   04. AVATAR ENGINE
   ============================================================= */
function makeOrbAvatar(
  name = 'DUAL',
  size = 64
) {
  const safe =
    String(name || 'DUAL')
      .trim() || 'DUAL';
  const seed =
    [...safe].reduce(
      (acc, ch) =>
        acc + ch.charCodeAt(0),
      0
    );
  const h1 =
    seed % 360;
  const h2 =
    (seed * 37) % 360;
  const uid =
    Math.random()
      .toString(36)
      .slice(2, 7);
  const base =
    `orb_${seed.toString(36)}_${uid}`;
  const coreId =
    `${base}_core`;
  const ringId =
    `${base}_ring`;
  return `
    <div
      class="dual-orb-wrap"
      style="
        --orb-size:${size}px;
        --orb-primary:hsl(${h1},100%,62%);
        --orb-secondary:hsl(${h2},92%,48%);
      "
      aria-label="${escapeHtml(safe)}"
      role="img"
    >
      <svg
        class="dual-orb-svg"
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <radialGradient
            id="${coreId}"
            cx="50%"
            cy="50%"
            r="50%"
          >
            <stop
              offset="0%"
              stop-color="hsl(${h1},100%,66%)"
              stop-opacity="1"
            />
            <stop
              offset="55%"
              stop-color="hsl(${h2},92%,46%)"
              stop-opacity=".9"
            />
            <stop
              offset="100%"
              stop-color="hsl(${h2},100%,12%)"
              stop-opacity="0"
            />
          </radialGradient>
          <linearGradient
            id="${ringId}"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop
              offset="0%"
              stop-color="hsl(${h1},100%,76%)"
            />
            <stop
              offset="100%"
              stop-color="hsl(${h2},100%,58%)"
            />
          </linearGradient>
        </defs>
        <circle
          cx="50"
          cy="50"
          r="46"
          fill="#05070c"
        />
        <circle
          cx="50"
          cy="50"
          r="40"
          fill="url(#${coreId})"
          opacity=".28"
        />
        <circle
          cx="50"
          cy="50"
          r="38"
          fill="none"
          stroke="url(#${ringId})"
          stroke-width="1"
        />
        <circle
          cx="50"
          cy="50"
          r="46"
          fill="none"
          stroke="url(#${ringId})"
          stroke-width="2.5"
          stroke-dasharray="70 20 10 30"
          stroke-linecap="round"
          opacity=".86"
        />
        <circle
          cx="50"
          cy="50"
          r="8"
          fill="#ffffff"
          opacity=".22"
        />
        <circle
          cx="50"
          cy="50"
          r="3"
          fill="#ffffff"
          opacity=".85"
        />
      </svg>
      <div class="dual-orb-shell">
        <div class="dual-orb-halo"></div>
        <div class="dual-orb-core"></div>
      </div>
    </div>
  `;
}
window.makeOrbAvatar =
  makeOrbAvatar;
window.makeMiniAvatar =
  name =>
    makeOrbAvatar(
      name,
      24
    );
/* =============================================================
   05. ACTIVATION ENGINE
   ============================================================= */
function root369(name) {
  const clean =
    String(name || '')
      .trim();
  if (!clean)
    return '--';
  let n =
    [...clean].reduce(
      (acc, ch) =>
        acc + ch.charCodeAt(0),
      0
    );
  while (n > 9) {
    n =
      String(n)
        .split('')
        .reduce(
          (a, b) =>
            a + Number(b),
          0
        );
  }
  return n;
}
function padTo(
  text,
  size
) {
  text =
    String(text);
  if (
    text.length >= size
  ) {
    return text.slice(
      0,
      size
    );
  }
  return (
    text +
    ' '.repeat(
      size - text.length
    )
  );
}
function createAsciiActivation(
  name
) {
  const clean =
    String(name || '')
      .trim() ||
      'Convidado';
  const displayName =
    `${clean}.Dual Infodose`;
  const title =
    'CÉREBRO-ORÁCULO — BASE v1';
  const width = 35;
  const top =
    `+${'-'.repeat(width)}+`;
  const titleLine =
    `| ${padTo(
      title,
      width - 2
    )} |`;
  const nameLine =
    `Ativar: ${displayName}`;
  return {
    ascii: [
      top,
      titleLine,
      top,
      nameLine
    ].join('\n'),
    displayName,
    root:
      root369(clean),
    title
  };
}
window.updateActivationBlock =
  function(name) {
    const data =
      createAsciiActivation(
        name
      );
    if (els.actPre) {
      els.actPre.textContent =
        data.ascii;
    }
    if (els.actBadge) {
      const active =
        STATE.keys.find(
          key => key.active
        );
      els.actBadge.textContent =
        active
          ? `key:${active.name}`
          : `v:${data.root}`;
    }
  };
/* =============================================================
   06. UNIFIED INTERFACE
   =============================================================
   ÚNICA definição de updateInterface.
   Esta função substitui as duas versões anteriores.
   ============================================================= */
function updateInterface(
  name
) {
  const safe =
    String(
      name ||
      'Convidado'
    )
      .trim() ||
      'Convidado';
  /*
    01 — STATE
  */
  STATE.user =
    safe;
  userName =
    safe;
  localStorage.setItem(
    'di_userName',
    safe
  );
  /*
    02 — TEXTO PRINCIPAL
  */
  if (els.lblName) {
    els.lblName.textContent =
      safe;
  }
  if (
    els.input &&
    els.input.value !== safe
  ) {
    els.input.value =
      safe;
  }
  if (els.actName) {
    els.actName.textContent =
      safe;
  }
  /*
    03 — CHAVE ATIVA
  */
  const activeKey =
    Array.isArray(STATE.keys)
      ? STATE.keys.find(
          key => key.active
        )
      : null;
  const keyName =
    activeKey?.name ||
    '--';
  if (els.smallIdent) {
    els.smallIdent.textContent =
      keyName;
  }
  if (els.actBadge) {
    els.actBadge.textContent =
      activeKey
        ? `key:${keyName}`
        : 'v:--';
  }
  /*
    04 — SMALL PREVIEW
  */
  if (els.smallText) {
    if (activeKey) {
      els.smallText.textContent =
        `${keyName} [ATIVO]`;
    }
    else if (
      safe === 'Convidado'
    ) {
      els.smallText.textContent =
        'Aguardando...';
    }
    else {
      const phrases = [
        'Foco estável.',
        'Ritmo criativo.',
        'Percepção sutil.'
      ];
      els.smallText.textContent =
        `${safe} · ${
          phrases[
            safe.length %
            phrases.length
          ]
        }`;
    }
  }
  /*
    05 — AVATARES
  */
  const avatar =
    makeOrbAvatar(
      safe,
      64
    );
  if (els.avatarTgt) {
    els.avatarTgt.innerHTML =
      avatar;
  }
  if (els.smallMiniAvatar) {
    els.smallMiniAvatar.innerHTML =
      makeOrbAvatar(
        safe,
        24
      );
  }
  if (els.actMiniAvatar) {
    els.actMiniAvatar.innerHTML =
      makeOrbAvatar(
        safe,
        36
      );
  }
  /*
    06 — ASCII
  */
  if (
    typeof window
      .updateActivationBlock ===
    'function'
  ) {
    window.updateActivationBlock(
      safe
    );
  }
  /*
    07 — IDENTIDADE CROMÁTICA
  */
  const seed =
    [...safe].reduce(
      (acc, char) =>
        acc +
        char.charCodeAt(0),
      0
    );
  const h1 =
    seed % 360;
  const h2 =
    (seed * 37) % 360;
  document.documentElement
    .style
    .setProperty(
      '--kob-voice-primary',
      `hsl(${h1} 100% 55%)`
    );
  document.documentElement
    .style
    .setProperty(
      '--kob-voice-secondary',
      `hsl(${h2} 90% 45%)`
    );
  /*
    08 — DATA ATTRIBUTES
  */
  document.documentElement
    .dataset
    .diName =
      safe;
  document.documentElement
    .dataset
    .arch =
      safe;
  /*
    09 — EVENTO EXTERNO
  */
  window.dispatchEvent(
    new CustomEvent(
      'di:interface:update',
      {
        detail: {
          name: safe,
          key:
            activeKey ||
            null,
          seed,
          h1,
          h2
        }
      }
    )
  );
}
/* =============================================================
   07. SECURITY UI
   ============================================================= */
function updateSecurityUI() {
  if (
    !els.vaultStatusText ||
    !els.lockVaultBtn
  ) {
    return;
  }
  if (SESSION_PASSWORD) {
    els.vaultStatusText.textContent =
      'Cofre Protegido (Destrancado)';
    els.lockVaultBtn.textContent =
      'TRANCAR';
  }
  else if (STATE.isEncrypted) {
    els.vaultStatusText.textContent =
      'Cofre Trancado';
    els.lockVaultBtn.textContent =
      'REDEFINIR';
  }
  else {
    els.vaultStatusText.textContent =
      'Cofre Aberto (Sem senha)';
    els.lockVaultBtn.textContent =
      'CRIAR SENHA';
  }
}
/* =============================================================
   08. KEYS ENGINE
   ============================================================= */
function renderKeysList() {
  if (!els.keyList)
    return;
  els.keyList.innerHTML = '';
  if (
    STATE.keys.length === 0
  ) {
    els.keyList.innerHTML = `
      <div
        style="
          color:rgba(255,255,255,.3);
          text-align:center;
          padding:20px
        "
      >
        Nenhuma chave armazenada.
      </div>
    `;
    return;
  }
  STATE.keys.forEach(key => {
    const div =
      document.createElement(
        'div'
      );
    div.className =
      `key-item ${
        key.active
          ? 'active-item'
          : ''
      }`;
    const safeName =
      escapeHtml(
        key.name
      );
    div.innerHTML = `
      <div
        class="meta"
        style="flex:1"
      >
        <div
          style="
            font-weight:700;
            font-size:.9rem
          "
        >
          ${safeName}
        </div>
      </div>
      <div class="actions">
        ${
          !key.active
            ? `
              <button
                type="button"
                class="small-btn"
                data-action="activate-key"
                data-key-id="${escapeHtml(key.id)}"
              >
                ATIVAR
              </button>
            `
            : `
              <span
                style="
                  font-size:.7rem;
                  font-weight:700;
                  color:var(--neon-cyan);
                  margin-right:10px
                "
              >
                ATIVA
              </span>
            `
        }
        <button
          type="button"
          class="small-btn danger"
          data-action="remove-key"
          data-key-id="${escapeHtml(key.id)}"
          aria-label="Remover chave"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M3 6h18"/>
            <path
              d="
                M19 6v14
                c0 1-1 2-2 2H7
                c-1 0-2-1-2-2V6
              "
            />
            <path
              d="
                M8 4V3
                c0-1 1-2 2-2h4
                c1 0 2 1 2 2v1
              "
            />
            <line
              x1="10"
              x2="10"
              y1="11"
              y2="17"
            />
            <line
              x1="14"
              x2="14"
              y1="11"
              y2="17"
            />
          </svg>
        </button>
      </div>
    `;
    els.keyList.appendChild(
      div
    );
  });
}
function addKey() {
  const name =
    els.keyName
      ? els.keyName.value.trim()
      : '';
  const token =
    els.keyToken
      ? els.keyToken.value.trim()
      : '';
  if (!name) {
    showToaster(
      'Nome obrigatório',
      'error'
    );
    return;
  }
  const newKey = {
    id:
      Date.now()
        .toString(36),
    name,
    token,
    active:
      STATE.keys.length === 0
  };
  STATE.keys.push(
    newKey
  );
  if (
    newKey.active &&
    newKey.token
  ) {
    localStorage.setItem(
      'di_apiKey',
      newKey.token
    );
    apiKey =
      newKey.token;
  }
  saveData();
  renderKeysList();
  updateInterface(
    STATE.user
  );
  if (els.keyName)
    els.keyName.value = '';
  if (els.keyToken)
    els.keyToken.value = '';
  showToaster(
    'Chave adicionada!',
    'success'
  );
}
/* =============================================================
   KEY ACTIONS
   ============================================================= */
function removeKey(id) {
  if (
    !confirm(
      'Remover chave permanentemente?'
    )
  ) {
    return;
  }
  const removed =
    STATE.keys.find(
      key => key.id === id
    );
  STATE.keys =
    STATE.keys.filter(
      key => key.id !== id
    );
  if (
    removed?.active
  ) {
    localStorage.removeItem(
      'di_apiKey'
    );
    apiKey = '';
  }
  saveData();
  renderKeysList();
  updateInterface(
    STATE.user
  );
}
function setActiveKey(id) {
  let activatedToken =
    null;
  STATE.keys.forEach(key => {
    key.active =
      key.id === id;
    if (
      key.active
    ) {
      activatedToken =
        key.token;
    }
  });
  if (activatedToken) {
    localStorage.setItem(
      'di_apiKey',
      activatedToken
    );
    apiKey =
      activatedToken;
    if (els.apiKeyInput) {
      els.apiKeyInput.value =
        activatedToken;
    }
    showToaster(
      'Chave sincronizada com o Chat.',
      'success'
    );
  }
  else {
    localStorage.removeItem(
      'di_apiKey'
    );
    apiKey = '';
  }
  saveData();
  renderKeysList();
  updateInterface(
    STATE.user
  );
}
window.removeKey =
  removeKey;
window.setActiveKey =
  setActiveKey;
/* =============================================================
   09. VAULT
   ============================================================= */
function openManager() {
  if (
    STATE.isEncrypted &&
    !SESSION_PASSWORD
  ) {
    if (els.vaultModal) {
      els.vaultModal.style.display =
        'flex';
      els.vaultModal
        .setAttribute(
          'aria-hidden',
          'false'
        );
    }
    els.vaultPass?.focus();
  }
  else {
    if (els.keysModal) {
      els.keysModal.style.display =
        'flex';
      els.keysModal
        .setAttribute(
          'aria-hidden',
          'false'
        );
    }
  }
}
function closeKeysManager() {
  if (els.keysModal) {
    els.keysModal.style.display =
      'none';
    els.keysModal
      .setAttribute(
        'aria-hidden',
        'true'
      );
  }
}
function closeVaultModal() {
  if (els.vaultModal) {
    els.vaultModal.style.display =
      'none';
    els.vaultModal
      .setAttribute(
        'aria-hidden',
        'true'
      );
  }
}
els.vaultUnlock?.addEventListener(
  'click',
  async () => {
    const pass =
      els.vaultPass?.value || '';
    if (!pass) {
      showToaster(
        'Digite a senha.',
        'error'
      );
      return;
    }
    try {
      const decrypted =
        await CRYPTO.decrypt(
          STATE.encryptedData,
          pass
        );
      SESSION_PASSWORD =
        pass;
      STATE.keys =
        decrypted.keys || [];
      STATE.user =
        decrypted.user ||
        'Convidado';
      const active =
        STATE.keys.find(
          key => key.active
        );
      if (
        active &&
        active.token
      ) {
        localStorage.setItem(
          'di_apiKey',
          active.token
        );
        apiKey =
          active.token;
      }
      if (STATE.user) {
        localStorage.setItem(
          'di_userName',
          STATE.user
        );
        userName =
          STATE.user;
      }
      closeVaultModal();
      if (els.keysModal) {
        els.keysModal.style.display =
          'flex';
        els.keysModal
          .setAttribute(
            'aria-hidden',
            'false'
          );
      }
      if (els.vaultPass)
        els.vaultPass.value = '';
      renderKeysList();
      updateInterface(
        STATE.user
      );
      updateSecurityUI();
      showToaster(
        'Cofre destrancado.',
        'success'
      );
    } catch (error) {
      showToaster(
        'Senha incorreta.',
        'error'
      );
    }
  }
);
els.lockVaultBtn?.addEventListener(
  'click',
  () => {
    if (
      !SESSION_PASSWORD &&
      !STATE.isEncrypted
    ) {
      const newPass =
        prompt(
          'Defina uma senha para o Cofre:'
        );
      if (newPass) {
        SESSION_PASSWORD =
          newPass;
        saveData();
        showToaster(
          'Cofre protegido.',
          'success'
        );
      }
    }
    else if (
      SESSION_PASSWORD
    ) {
      SESSION_PASSWORD =
        null;
      closeKeysManager();
      showToaster(
        'Sessão do cofre encerrada.',
        'success'
      );
    }
    else {
      showToaster(
        'Cofre já criptografado. Desbloqueie para redefinir.',
        'error'
      );
    }
    updateSecurityUI();
  }
);
els.vaultCancel?.addEventListener(
  'click',
  closeVaultModal
);
els.closeKeysBtn?.addEventListener(
  'click',
  closeKeysManager
);
els.addKeyBtn?.addEventListener(
  'click',
  addKey
);
/* Delegação de eventos da lista */
els.keyList?.addEventListener(
  'click',
  event => {
    const button =
      event.target.closest(
        '[data-action]'
      );
    if (!button)
      return;
    const id =
      button.dataset.keyId;
    if (
      button.dataset.action ===
      'activate-key'
    ) {
      setActiveKey(id);
    }
    if (
      button.dataset.action ===
      'remove-key'
    ) {
      removeKey(id);
    }
  }
);
/* =============================================================
   10. MODE ENGINE
   ============================================================= */
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
const HUD_SNAP_THRESHOLD =
  60;
const SWIPE_DOWN_THRESHOLD =
  80;
const LONG_PRESS_MS =
  350;
/* =============================================================
   MODE BUTTONS
   ============================================================= */
function updateModeButtons(
  mode
) {
  [
    els.btnModeCard,
    els.btnModeOrb,
    els.btnModeHud
  ]
    .forEach(button => {
      button?.classList
        .remove(
          'active-mode'
        );
    });
  if (
    mode === 'card' &&
    els.btnModeCard
  ) {
    els.btnModeCard
      .classList
      .add('active-mode');
  }
  if (
    mode === 'orb' &&
    els.btnModeOrb
  ) {
    els.btnModeOrb
      .classList
      .add('active-mode');
  }
  if (
    mode === 'hud' &&
    els.btnModeHud
  ) {
    els.btnModeHud
      .classList
      .add('active-mode');
  }
}
/* =============================================================
   CARD
   ============================================================= */
function revertToCard() {
  state.isOrb =
    false;
  state.isHud =
    false;
  els.card.style.transition =
    'all .5s var(--ease-smooth)';
  els.card.style.left = '';
  els.card.style.top = '';
  els.card.style.width = '';
  els.card.style.height = '';
  els.card.style.transform = '';
  els.card.classList
    .remove(
      'orb',
      'hud',
      'closed'
    );
  setTimeout(() => {
    els.card.classList
      .add(
        'content-visible'
      );
  }, 300);
}
/* =============================================================
   PUBLIC SET MODE
   ============================================================= */
function setMode(
  mode,
  isInitialLoad = false
) {
  if (!els.card)
    return;
  updateModeButtons(
    mode
  );
  if (mode === 'card') {
    revertToCard();
  }
  else if (
    mode === 'orb'
  ) {
    state.isOrb =
      true;
    state.isHud =
      false;
    els.card.classList
      .add(
        'orb',
        'closed'
      );
    els.card.classList
      .remove(
        'hud',
        'content-visible'
      );
    els.card.style.transform =
      'none';
  }
  else if (
    mode === 'hud'
  ) {
    state.isHud =
      true;
    state.isOrb =
      false;
    els.card.classList
      .add(
        'hud',
        'closed'
      );
    els.card.classList
      .remove(
        'orb',
        'content-visible'
      );
    els.card.style.top = '';
    els.card.style.left = '';
    els.card.style.transform = '';
  }
  if (!isInitialLoad) {
    saveUIState();
  }
}
window.setMode =
  setMode;
/* =============================================================
   CARD TOGGLE
   ============================================================= */
function toggleCardState() {
  if (
    els.card.classList
      .contains('animating')
  ) {
    return;
  }
  const isClosed =
    els.card.classList
      .contains('closed');
  els.card.classList
    .add('animating');
  if (isClosed) {
    els.card.classList
      .remove('closed');
    const animation =
      els.card.animate(
        [
          {
            transform:
              'scale(.95)',
            opacity:.8
          },
          {
            transform:
              'scale(1)',
            opacity:1
          }
        ],
        {
          duration:400
        }
      );
    animation.onfinish =
      () => {
        els.card.classList
          .remove(
            'animating'
          );
        els.card.classList
          .add(
            'content-visible'
          );
      };
  }
  else {
    els.card.classList
      .remove(
        'content-visible'
      );
    const animation =
      els.card.animate(
        [
          {
            transform:
              'translateY(0)',
            opacity:1
          },
          {
            transform:
              'translateY(10px)',
            opacity:1
          }
        ],
        {
          duration:200
        }
      );
    animation.onfinish =
      () => {
        els.card.classList
          .add('closed');
        els.card.classList
          .remove(
            'animating'
          );
      };
  }
}
/* =============================================================
   TRANSMUTE
   ============================================================= */
function transmuteToOrb(
  event
) {
  if (
    !event ||
    event.clientX === undefined
  ) {
    return;
  }
  const x =
    event.clientX;
  const y =
    event.clientY;
  navigator.vibrate?.(40);
  els.card.classList
    .add(
      'orb',
      'closed'
    );
  els.card.classList
    .remove(
      'content-visible'
    );
  els.card.style.left =
    `${x - 34}px`;
  els.card.style.top =
    `${y - 34}px`;
  state.isOrb =
    true;
  state.isHud =
    false;
  state.isDragging =
    true;
  if (event.pointerId) {
    state.pointerId =
      event.pointerId;
    try {
      els.card.setPointerCapture(
        event.pointerId
      );
    } catch (_) {}
    const rect =
      els.card.getBoundingClientRect();
    state.dragOffsetX =
      x - rect.left;
    state.dragOffsetY =
      y - rect.top;
  }
  updateModeButtons(
    'orb'
  );
}
/* =============================================================
   GESTURES
   ============================================================= */
function handleStart(
  event
) {
  const tag =
    event.target.tagName;
  if (
    tag === 'INPUT' ||
    tag === 'TEXTAREA' ||
    tag === 'SELECT' ||
    (
      tag === 'BUTTON' &&
      !event.target.closest(
        '.orb-menu-trigger'
      )
    )
  ) {
    return;
  }
  if (
    !state.isOrb &&
    !state.isHud &&
    !els.header?.contains(
      event.target
    )
  ) {
    return;
  }
  state.startX =
    event.clientX;
  state.startY =
    event.clientY;
  state.pointerId =
    event.pointerId;
  if (
    state.isOrb ||
    state.isHud
  ) {
    state.isDragging =
      true;
    try {
      els.card.setPointerCapture(
        event.pointerId
      );
    } catch (_) {}
    const rect =
      els.card.getBoundingClientRect();
    state.dragOffsetX =
      event.clientX -
      rect.left;
    state.dragOffsetY =
      event.clientY -
      rect.top;
    els.card.style.transition =
      'none';
    return;
  }
  state.timer =
    setTimeout(
      () => {
        transmuteToOrb(
          event
        );
        saveUIState();
      },
      LONG_PRESS_MS
    );
}
function handleMove(
  event
) {
  if (
    !state.isOrb &&
    !state.isHud &&
    state.timer
  ) {
    const dx =
      event.clientX -
      state.startX;
    const dy =
      event.clientY -
      state.startY;
    const distance =
      Math.hypot(
        dx,
        dy
      );
    if (
      distance > 12 &&
      (
        dy < -10 ||
        Math.abs(dx) > 18
      )
    ) {
      clearTimeout(
        state.timer
      );
      state.timer =
        null;
      transmuteToOrb(
        event
      );
      const rect =
        els.card
          .getBoundingClientRect();
      state.dragOffsetX =
        event.clientX -
        rect.left;
      state.dragOffsetY =
        event.clientY -
        rect.top;
      try {
        els.card.setPointerCapture(
          event.pointerId
        );
      } catch (_) {}
      els.card.style.transition =
        'none';
    }
  }
  if (
    !state.isDragging
  ) {
    return;
  }
  event.preventDefault();
  if (state.isOrb) {
    const x =
      event.clientX -
      state.dragOffsetX;
    const y =
      event.clientY -
      state.dragOffsetY;
    els.card.style.left =
      `${x}px`;
    els.card.style.top =
      `${y}px`;
    if (
      y <
      HUD_SNAP_THRESHOLD
    ) {
      els.snapZone?.classList
        .add('active');
    }
    else {
      els.snapZone?.classList
        .remove('active');
    }
  }
  else if (state.isHud) {
    const deltaY =
      event.clientY -
      state.startY;
    if (
      deltaY > 0
    ) {
      els.card.style.transform =
        `translateX(-50%) translateY(${deltaY * .4}px)`;
      if (
        deltaY >
        SWIPE_DOWN_THRESHOLD
      ) {
        els.snapZone?.classList
          .add('active');
      }
      else {
        els.snapZone?.classList
          .remove('active');
      }
    }
  }
}
function handleEnd(
  event
) {
  if (state.timer) {
    clearTimeout(
      state.timer
    );
    state.timer =
      null;
  }
  if (state.isDragging) {
    state.isDragging =
      false;
    try {
      els.card.releasePointerCapture?.(
        state.pointerId
      );
    } catch (_) {}
    els.card.style.transition =
      '';
    els.snapZone?.classList
      .remove('active');
    if (state.isOrb) {
      const rect =
        els.card
          .getBoundingClientRect();
      if (
        rect.top <
        HUD_SNAP_THRESHOLD
      ) {
        setMode(
          'hud'
        );
      }
      else {
        saveUIState();
      }
    }
    else if (
      state.isHud
    ) {
      const deltaY =
        event.clientY -
        state.startY;
      if (
        deltaY >
        SWIPE_DOWN_THRESHOLD
      ) {
        const x =
          event.clientX - 34;
        const y =
          event.clientY - 10;
        els.card.style.left =
          `${x}px`;
        els.card.style.top =
          `${y}px`;
        setMode(
          'orb'
        );
      }
      else {
        els.card.style.transform =
          'translateX(-50%) translateY(0)';
      }
    }
  }
  else {
    if (
      !state.isOrb &&
      !state.isHud &&
      els.header?.contains(
        event.target
      )
    ) {
      toggleCardState();
    }
  }
  state.pointerId =
    null;
}
/* =============================================================
   EVENT LISTENERS — GESTURES
   ============================================================= */
els.card?.addEventListener(
  'pointerdown',
  handleStart,
  { passive:false }
);
window.addEventListener(
  'pointermove',
  handleMove,
  { passive:false }
);
window.addEventListener(
  'pointerup',
  handleEnd,
  { passive:false }
);
/* =============================================================
   11. UI HELPERS
   ============================================================= */
function escapeHtml(
  value
) {
  if (
    value === null ||
    value === undefined
  ) {
    return '';
  }
  return String(value)
    .replace(
      /[&<>"']/g,
      char => ({
        '&':'&amp;',
        '<':'&lt;',
        '>':'&gt;',
        '"':'&quot;',
        "'":'&#39;'
      })[char]
    );
}
function showToaster(
  text,
  type = 'default'
) {
  const wrap =
    document.getElementById(
      'toasterWrap'
    );
  if (!wrap)
    return;
  const toaster =
    document.createElement(
      'div'
    );
  toaster.className =
    `toaster ${type}`;
  toaster.textContent =
    text;
  wrap.appendChild(
    toaster
  );
  setTimeout(
    () =>
      toaster.classList
        .add('show'),
    10
  );
  setTimeout(
    () => {
      toaster.classList
        .remove('show');
      setTimeout(
        () =>
          toaster.remove(),
        300
      );
    },
    2500
  );
}
function toggleSection(
  id,
  forceOpen = false
) {
  const element =
    document.getElementById(
      id
    );
  if (!element)
    return;
  const hidden =
    element.classList
      .contains(
        'activation-hidden'
      );
  if (
    forceOpen &&
    !hidden
  ) {
    return;
  }
  if (forceOpen) {
    element.classList
      .remove(
        'activation-hidden'
      );
    element.classList
      .add(
        'activation-open'
      );
  }
  else {
    element.classList
      .toggle(
        'activation-hidden',
        !hidden
      );
    element.classList
      .toggle(
        'activation-open',
        hidden
      );
  }
}
window.toggleSection =
  toggleSection;
/* =============================================================
   12. INPUT SYNC
   ============================================================= */
els.input?.addEventListener(
  'input',
  event => {
    const value =
      event.target.value;
    STATE.user =
      value;
    userName =
      value;
    localStorage.setItem(
      'di_userName',
      value
    );
    updateInterface(
      value
    );
    saveData();
  }
);
/* =============================================================
   ACTIVATION COPY
   ============================================================= */
els.copyActBtn?.addEventListener(
  'click',
  async () => {
    const text =
      els.actPre?.innerText ||
      '';
    try {
      await navigator
        .clipboard
        .writeText(
          text
        );
      showToaster(
        'Ativação copiada',
        'success'
      );
    }
    catch (_) {
      try {
        const textarea =
          document.createElement(
            'textarea'
          );
        textarea.value =
          text;
        document.body.appendChild(
          textarea
        );
        textarea.select();
        document.execCommand(
          'copy'
        );
        textarea.remove();
        showToaster(
          'Ativação copiada',
          'success'
        );
      }
      catch (error) {
        showToaster(
          'Erro ao copiar ativação',
          'error'
        );
      }
    }
  }
);
/* =============================================================
   SYSTEM SAVE
   ============================================================= */
els.saveSystemBtn?.addEventListener(
  'click',
  () => {
    infodoseName =
      els.infodoseNameInput
        ?.value
        .trim() ||
      '';
    const newKey =
      els.apiKeyInput
        ?.value
        .trim() ||
      '';
    const newModel =
      els.modelSelect
        ?.value
        .trim() ||
      '';
    if (newKey) {
      apiKey =
        newKey;
      localStorage.setItem(
        'di_apiKey',
        apiKey
      );
      const active =
        STATE.keys.find(
          key => key.active
        );
      if (active) {
        active.token =
          newKey;
        saveData();
      }
    }
    modelName =
      newModel ||
      modelName;
    localStorage.setItem(
      'di_modelName',
      modelName
    );
    localStorage.setItem(
      'di_infodoseName',
      infodoseName
    );
    toggleSection(
      'systemCard',
      false
    );
    showToaster(
      'Configurações salvas.',
      'success'
    );
  }
);
/* =============================================================
   MODE BUTTONS
   ============================================================= */
els.btnModeCard?.addEventListener(
  'click',
  () =>
    setMode('card')
);
els.btnModeOrb?.addEventListener(
  'click',
  () =>
    setMode('orb')
);
els.btnModeHud?.addEventListener(
  'click',
  () =>
    setMode('hud')
);
/* =============================================================
   HEADER / MENU
   ============================================================= */
els.avatarTgt?.addEventListener(
  'click',
  event => {
    event.stopPropagation();
    if (
      !state.isOrb &&
      !state.isHud
    ) {
      openManager();
    }
  }
);
els.orbMenuTrigger?.addEventListener(
  'click',
  event => {
    event.stopPropagation();
    setMode(
      'card'
    );
    toggleSection(
      'systemCard',
      true
    );
  }
);
els.hudMenuBtn?.addEventListener(
  'click',
  event => {
    event.stopPropagation();
    setMode(
      'card'
    );
    toggleSection(
      'systemCard',
      true
    );
  }
);
els.header?.addEventListener(
  'click',
  event => {
    if (
      state.isHud &&
      !state.isDragging &&
      !event.target.closest(
        '.hud-menu-btn'
      )
    ) {
      setMode(
        'card'
      );
      toggleSection(
        'systemCard',
        true
      );
    }
  }
);
els.card?.addEventListener(
  'contextmenu',
  event => {
    if (
      state.isOrb ||
      state.isHud
    ) {
      event.preventDefault();
      setMode(
        'card'
      );
    }
  }
);
/* =============================================================
   SECTION BUTTONS
   ============================================================= */
document
  .getElementById(
    'activationToggle'
  )
  ?.addEventListener(
    'click',
    () =>
      toggleSection(
        'activationCard'
      )
  );
document
  .getElementById(
    'systemToggle'
  )
  ?.addEventListener(
    'click',
    () =>
      toggleSection(
        'systemCard'
      )
  );
/* =============================================================
   KEYBOARD SECTION ACCESSIBILITY
   ============================================================= */
[
  [
    'activationToggle',
    'activationCard'
  ],
  [
    'systemToggle',
    'systemCard'
  ]
].forEach(
  ([triggerId, targetId]) => {
    document
      .getElementById(
        triggerId
      )
      ?.addEventListener(
        'keydown',
        event => {
          if (
            event.key === 'Enter' ||
            event.key === ' '
          ) {
            event.preventDefault();
            toggleSection(
              targetId
            );
          }
        }
      );
  }
);
/* =============================================================
   FIRST PREVIEW
   ============================================================= */
function showFirstRunPreviewIfNeeded() {
  try {
    if (
      localStorage.getItem(
        FIRST_PREVIEW_KEY
      )
    ) {
      return;
    }
    if (
      state.isOrb ||
      state.isHud
    ) {
      return;
    }
    const raw =
      localStorage.getItem(
        UI_STATE_KEY
      );
    if (raw) {
      try {
        const parsed =
          JSON.parse(raw);
        if (
          parsed &&
          parsed.mode === 'orb'
        ) {
          return;
        }
      } catch (_) {}
    }
    els.card?.classList
      .add('closed');
    if (els.smallPreview) {
      els.smallPreview.style.display =
        'flex';
      els.smallPreview.style.opacity =
        '0';
      requestAnimationFrame(
        () => {
          els.smallPreview.style.transition =
            'opacity 260ms ease-out';
          els.smallPreview.style.opacity =
            '1';
        }
      );
    }
    els.card?.classList
      .remove(
        'content-visible'
      );
    localStorage.setItem(
      FIRST_PREVIEW_KEY,
      '1'
    );
    saveUIState();
  }
  catch (error) {
    console.error(
      'First preview error:',
      error
    );
  }
}
/* =============================================================
   FORCE PREVIEW
   ============================================================= */
function forceSmallPreview() {
  state.isOrb =
    false;
  state.isHud =
    false;
  els.card?.classList
    .remove(
      'orb',
      'hud'
    );
  els.card?.classList
    .add('closed');
  els.card?.classList
    .remove(
      'content-visible'
    );
  if (!els.card)
    return;
  els.card.style.left =
    '';
  els.card.style.top =
    '';
  els.card.style.transform =
    '';
  els.card.style.opacity =
    '0';
  els.card.style.transition =
    'opacity 400ms ease';
  requestAnimationFrame(
    () => {
      els.card.style.opacity =
        '1';
    }
  );
}
/* =============================================================
   RESTORE MODE
   ============================================================= */
function restoreSavedMode(
  mode,
  left,
  top
) {
  if (!els.card)
    return;
  els.card.style.transition =
    'all 600ms var(--ease-smooth)';
  if (
    mode === 'orb'
  ) {
    if (left)
      els.card.style.left =
        left;
    if (top)
      els.card.style.top =
        top;
    setMode(
      'orb'
    );
  }
  else if (
    mode === 'hud'
  ) {
    setMode(
      'hud'
    );
  }
  else {
    setMode(
      'card'
    );
    els.card.classList
      .remove(
        'closed'
      );
    els.card.classList
      .add(
        'content-visible'
      );
  }
}
/* =============================================================
   CLOCK
   ============================================================= */
function updateClock() {
  if (!els.clock)
    return;
  els.clock.textContent =
    new Date()
      .toLocaleTimeString(
        'pt-BR',
        {
          hour:'2-digit',
          minute:'2-digit'
        }
      );
}
updateClock();
setInterval(
  updateClock,
  1000
);
/* =============================================================
   PORTAL HOOK
   ============================================================= */
function goToIndex() {
  const target =
    document.body
      .dataset
      .portalTarget ||
    'index.html';
  try {
    window.location.href =
      target;
  }
  catch (error) {
    console.error(
      'Portal navigation error:',
      error
    );
  }
}
window.goToIndex =
  goToIndex;
/* =============================================================
   CUSTOM EXTERNAL EVENT API
   ============================================================= */
window.addEventListener(
  'di:interface:update',
  event => {
    /*
      Hook reservado para o ecossistema DI.
      Exemplo externo:
      window.addEventListener(
        'di:interface:update',
        e => {
          console.log(e.detail);
        }
      );
    */
    document.documentElement
      .dataset
      .diReady =
      'true';
  }
);
/* =============================================================
   GLOBAL API
   ============================================================= */
window.FUSION_CORE = {
  version: 'MONOLITH-v1',
  state: STATE,
  ui: state,
  elements: els,
  crypto: CRYPTO,
  updateInterface,
  updateSecurityUI,
  renderKeysList,
  saveData,
  loadData,
  saveUIState,
  loadUIState,
  setMode,
  toggleSection,
  openManager,
  showToaster,
  makeOrbAvatar,
  createAsciiActivation,
  root369
};
/* =============================================================
   INITIALIZATION
   ============================================================= */
(async function initFusionCore() {
  try {
    els.card?.classList
      .add('active');
    els.avatarTgt?.classList
      .add('shown');
    /*
      Primeiro carrega dados.
    */
    await loadData();
    /*
      Sincroniza input inicial.
    */
    const initialName =
      STATE.user ||
      userName ||
      localStorage.getItem(
        'di_userName'
      ) ||
      'Convidado';
    updateInterface(
      initialName
    );
    /*
      UI STATE.
    */
    const rawUi =
      localStorage.getItem(
        UI_STATE_KEY
      );
    let savedMode =
      'card';
    let savedLeft =
      null;
    let savedTop =
      null;
    if (rawUi) {
      try {
        const parsed =
          JSON.parse(rawUi);
        savedMode =
          parsed.mode ||
          'card';
        savedLeft =
          parsed.left ||
          null;
        savedTop =
          parsed.top ||
          null;
      }
      catch (_) {}
    }
    /*
      Primeiro frame cinematográfico.
    */
    forceSmallPreview();
    /*
      Restauração após o preview.
    */
    setTimeout(
      () => {
        restoreSavedMode(
          savedMode,
          savedLeft,
          savedTop
        );
      },
      5000
    );
    /*
      Segurança.
    */
    updateSecurityUI();
    /*
      Lista.
    */
    renderKeysList();
    /*
      Preview first-run opcional.
    */
    showFirstRunPreviewIfNeeded();
    document.documentElement
      .dataset
      .fusionCore =
      'ready';
    console.info(
      '⚡ Fusion Core MONOLITH v1 ready'
    );
  }
  catch (error) {
    console.error(
      'Fusion Core initialization failed:',
      error
    );
    showToaster(
      'Falha na inicialização do Fusion Core.',
      'error'
    );
  }
})();
/* =============================================================
   END — FUSION CORE MONOLITH v1
   ============================================================= */
