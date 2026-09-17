/* ═══════════════════════════════════════════════════════════════════════════
   §BRIDGE · kobllux-bridge · v13
   Unifica IDs/classes/atributos entre o Bundle β (novo) e o KodBlloX-0
   (legacy). Roda ANTES de tudo.
   ═══════════════════════════════════════════════════════════════════════════ */
;(function installBridge(root){
"use strict";
if (root.__KBLX_BRIDGE__) return;
root.__KBLX_BRIDGE__ = true;

/* ─── 1 · CLASS PAIRS (novo ↔ legado) ─────────────────────────────────── */
const CLASS_PAIRS = [
  // sessions / windows
  ['rhea_session-window',   'session-window'],
  ['genus_mxp-window',      'mxp-window'],
  ['atlas_win-hdr',         'win-hdr'],
  ['atlas_win-body',        'win-body'],
  ['rhea_win-frame',        'win-frame'],
  ['atlas_win-controls',    'win-controls'],
  ['atlas_win-navrow',      'win-navrow'],
  ['atlas_urlbar',          'win-urlbar'],
  ['atlas_gobtn',           'win-go-btn'],
  ['genus_mxp-title',       'mxp-title'],
  ['genus_win-slot-bar',    'win-slot-bar'],
  ['genus_slot',            'mxp-slot'],
  // MXP buttons
  ['genus_btn',             'mxp-btn'],
  ['genus_icon',            'mxp-icon'],
  ['genus_label',           'mxp-label'],
  ['genus_factory-slot',    'slot-factory'],
  ['rhea_session-slot',     'slot-session'],
  ['genus_slot-header',     'slot-header'],
  ['genus_slot-aside',      'slot-aside'],
  ['genus_slot-footer',     'slot-footer'],
  ['genus_slot-loose',      'slot-loose'],
  ['genus_holding',         'is-holding'],
  ['genus_source',          'is-source'],
  ['genus_firing',          'is-firing'],
  ['genus_open',            'is-open'],
  ['genus_live',            'is-live'],
  ['kodux_bound',           'is-bound'],
  ['genus_dual-hover',      'is-dual-hover'],
  ['genus_drop-ready',      'is-drop-ready'],
  ['genus_active',          'is-active'],
  ['genus_over',            'is-over'],
  ['genus_mxp-dragging',    'mxp-dragging'],
  ['genus_catalog',         'mxd-catalog'],
  ['genus_cat',             'mxd-cat'],
  ['genus_cat-name',        'mxd-cat-name'],
  ['genus_cat-grid',        'mxd-cat-grid'],
  // window states
  ['kodux_collapsed',       'collapsed'],
  ['solus_minimized',       'minimized'],
  ['atlas_maximized',       'maximized'],
  ['atlas_dragging',        'dragging'],
  ['atlas_resizing',        'resizing'],
  ['solus_suspended',       'suspended'],
  // dock
  ['rhea_dock-bubble',      'dock-bubble'],
  // symbol bar
  ['kobllux_btn',           'sb-btn'],
  ['kobllux_dot',           'sb-dot'],
  // misc
  ['lumine_theme-dot',      'theme-dot'],
  ['nova_reveal',           'reveal'],
  ['genus_section',         'section'],
  ['artemis_navdot',        'nav-dot'],
];

/* ─── 2 · ID PAIRS (novo ↔ legado) ────────────────────────────────────── */
const ID_PAIRS = [
  // sessions/dock/stack
  ['rhea_dock',            'dock'],
  ['rhea_stack',           'stackWrap'],
  ['rhea_sessions',        'sessionsLayer'],
  ['rhea_tabs',            'tabSwitcherOverlay'],
  ['rhea_tabgrid',         'tabGrid'],
  ['rhea_tabtitle',        'tabSwitcherTitle'],
  ['kaos_tabclose',        'closeTabSwitcher'],
  ['nova_newtab',          'newTabBtn'],
  ['nova_newsession',      'newSessionBtn'],
  ['rhea_togglehost',      'toggleHostBtn'],
  ['rhea_hostmode',        'hostModeLabel'],
  // nav global
  ['atlas_urlbar',         'urlInputNav'],
  ['atlas_gobtn',          'goNavBtn'],
  ['artemis_fav',          'favBtn'],
  // symbol bar
  ['kobllux_symbar',       'symbolBar'],
  ['kobllux_carousel',     'sbCarousel'],
  ['kobllux_track',        'sbTrack'],
  ['kobllux_dots',         'sbDots'],
  ['kobllux_orb',          'sbOrb'],
  ['kodux_grip',           'sbGrip'],
  ['kodux_toggle',         'sbToggle'],
  ['kobllux_wheel',        'arch-overlay'],
  ['kobllux_wheelin',      'archWheel'],
  ['aion_baulite',         'baulite-container'],
  ['kaos_blclose',         'blClose'],
  ['kodux_extrashead',     'sbExtrasHead'],
  // header
  ['atlas_header',         'main-header'],
  ['genus_app',            'main-content'],
  // reader
  ['solus_reader',         'readerApp'],
  ['solus_stage',          'sliceStage'],
  ['solus_empty',          'emptyState'],
  ['artemis_file',         'fileInput'],
  ['bllue_player',         'player'],
  ['bllue_play',           'playButton'],
  ['bllue_ptitle',         'playerTitle'],
  ['bllue_pstate',         'playerState'],
  ['bllue_pbar',           'progressBar'],
  ['solus_title',          'documentTitle'],
  ['solus_send',           'sendSlicerBtn'],
  ['solus_all',            'allToSlicerBtn'],
  // dialogue
  ['nova_source',          'sourceText'],
  ['pulse_conv',           'conversation'],
  ['pulse_chat',           'chatWindow'],
  ['pulse_input',          'userInput'],
  ['pulse_send',           'btnSend'],
  ['aion_counter',         'counter'],
  ['vitalis_round',        'roundLabel'],
  ['kodux_bank',           'lexicalBank'],
  ['kodux_bankinfo',       'bankInfo'],
  ['vitalis_step',         'stepBtn'],
  ['vitalis_navstep',      'navStep'],
  ['nova_generate',        'generateBtn'],
  ['kodux_parse',          'parseBtn'],
  ['rhea_paste',           'pasteBtn'],
  ['bllue_listen',         'listenBtn'],
  ['artemis_imgsrc',       'importSource'],
  ['artemis_btn',          'importBtn'],
  ['artemis_import',       'sbImportInput'],
  // player controls
  ['bllue_speak',          'sbSpeak'],
  ['solus_stop',           'sbStop'],
  ['rhea_copy',            'sbCopy'],
  ['kaos_clear',           'sbClear'],
  ['aion_download',        'sbDownload'],
  // cockpit
  ['serena_userid',        'inputUserId'],
  ['kodux_model',          'inputModel'],
  ['serena_apikey',        'apiKeyInput'],
  ['serena_role',          'systemRoleInput'],
  ['serena_save',          'btnSaveConfig'],
  ['genus_settings',       'btnSettings'],
  ['aion_deck',            'btnDeck'],
  ['kaos_clearcss',        'btnClearCss'],
  ['bllue_voice',          'btnVoice'],
  ['lumine_cycle',         'btnCycleSolar'],
  ['lumine_auto',          'btnAutoSolar'],
  ['lumine_tema',          'themeToggle'],
  ['genus_menu',           'menuBtn'],
  ['kobllux_orbtoggle',    'orbToggle'],
  ['pulse_notif',          'notifBtn'],
  ['aion_crystallize',     'btnCrystallize'],
  // drawer
  ['lumine_cockpit',       'drawerProfile'],
  ['lumine_doverlay',      'drawerOverlay'],
  ['serena_drawer',        'drawerSettings'],
  ['aion_drawer',          'drawerDeck'],
  ['aion_decklist',        'deckList'],
  ['lumine_customcss',     'customCssInput'],
  ['lumine_custom-styles', 'custom-styles'],
  // bg
  ['serena_bgupload',      'bgUploadInput'],
  ['serena_bgthumb',       'bgThumbPanel'],
  ['serena_bgstatus',      'bgStatusText'],
  ['lumine_opacity',       'bgOpacity'],
  ['lumine_valop',         'val-op'],
  ['lumine_blend',         'bgBlend'],
  ['serena_bg',            'bg-fake-custom'],
  // hud/toast
  ['nova_loader',          'loader'],
  ['aion_progress',        'progress'],
  ['pulse_toast',          'nv-toast'],
  ['pulse_chroma',         'chromaRipple'],
  ['kobllux_pillhz',       'pillHz'],
  ['jesus_pillarch',       'pillArch'],
  ['kobllux_hud',          'sbHud'],
  ['kobllux_status',       'sbStatus'],
  ['kobllux_sub',          'sbSub'],
  ['lumine_status',        'statusSolarMode'],
  ['serena_display',       'usernameDisplay'],
  ['lumine_indicator',     'modeIndicator'],
  ['artemis_preview',      'filePreview'],
  ['artemis_imgfile',      'fileUploadInput'],
  ['kodux_fieldtoggle',    'field-toggle-handle'],
  ['aion_export',          'exportState'],
  ['aion_import',          'importState'],
  ['kaos_reset',           'resetAllState'],
];

/* ─── 3 · helpers ─────────────────────────────────────────────────────── */
const idIndex = new Map();      // "sbOrb" → { pair:[novo,legado], el? }
for (const [novo, legado] of ID_PAIRS){
  idIndex.set(novo,   { pair:[novo, legado] });
  idIndex.set(legado, { pair:[novo, legado] });
}

const classPairsBoth = new Map(); // "genus_btn" → Set('mxp-btn') e vice-versa
for (const [a,b] of CLASS_PAIRS){
  if (!classPairsBoth.has(a)) classPairsBoth.set(a, new Set());
  if (!classPairsBoth.has(b)) classPairsBoth.set(b, new Set());
  classPairsBoth.get(a).add(b);
  classPairsBoth.get(b).add(a);
}

/* ─── 4 · espelhamento de classes ─────────────────────────────────────── */
function mirrorClasses(el){
  if (!el || el.nodeType !== 1 || !el.classList) return;
  // snapshot pra evitar loop infinito
  const cur = [...el.classList];
  for (const name of cur){
    const mirror = classPairsBoth.get(name);
    if (!mirror) continue;
    for (const m of mirror){
      if (!el.classList.contains(m)) el.classList.add(m);
    }
  }
}

/* ─── 5 · normalização de data-* ──────────────────────────────────────── */
function normalizeDataAttrs(el){
  if (!el || el.nodeType !== 1) return;

  // 1) marca pares de ID em data-*
  if (el.id){
    const entry = idIndex.get(el.id);
    if (entry){
      const [novo, legado] = entry.pair;
      el.dataset.kblxIdNew    = novo;
      el.dataset.kblxIdLegacy = legado;
      el.dataset.kblxIdAlias  = (el.id === novo) ? legado : novo;
    }
  }
  // 2) marca pares de classe em data-*
  const cls = el.classList;
  if (cls){
    const novas = [], legadas = [];
    for (const [a,b] of CLASS_PAIRS){
      if (cls.contains(a)) novas.push(a);
      if (cls.contains(b)) legadas.push(b);
    }
    if (novas.length)  el.dataset.kblxClassNew    = novas.join(' ');
    if (legadas.length) el.dataset.kblxClassLegacy = legadas.join(' ');
  }

  // 3) session-window: obrigatórios
  const isSession =
    cls && (cls.contains('session-window') ||
            cls.contains('rhea_session-window') ||
            cls.contains('mxp-window') ||
            cls.contains('genus_mxp-window'));

  if (isSession){
    if (!el.dataset.sessionId)
      el.dataset.sessionId = el.id || ('sess_' + Date.now().toString(36) + Math.random().toString(36).slice(2,6));

    if (!el.dataset.mxpSession) el.dataset.mxpSession = '1';

    if (!el.dataset.sessionTitle){
      el.dataset.sessionTitle =
        el.querySelector('.mxp-title,.genus_mxp-title,[data-part="title"],.win-title')
          ?.textContent?.trim() ||
        el.dataset.title ||
        el.id ||
        'SESSION';
    }
    if (!el.dataset.voiceArch)
      el.dataset.voiceArch = document.body?.dataset?.voiceArch || 'jesus';

    if (!el.dataset.arch)
      el.dataset.arch = String(el.dataset.voiceArch).toUpperCase();

    if (!el.dataset.slot)
      el.dataset.slot = 'session:' + el.dataset.sessionId;

    if (!el.dataset.suspended) el.dataset.suspended = 'false';
    if (!el.dataset.state)     el.dataset.state     = 'created';
  }
}

function sweep(root){
  if (!root || root.nodeType !== 1) return;
  mirrorClasses(root);
  normalizeDataAttrs(root);
  root.querySelectorAll?.('*').forEach(n => {
    mirrorClasses(n);
    normalizeDataAttrs(n);
  });
}

/* ─── 6 · MutationObserver — mantém tudo sincronizado ─────────────────── */
const obs = new MutationObserver(muts => {
  for (const m of muts){
    if (m.type === 'attributes'){
      if (m.attributeName === 'class') mirrorClasses(m.target);
      if (m.attributeName === 'id')    normalizeDataAttrs(m.target);
      continue;
    }
    if (m.type === 'childList'){
      for (const n of m.addedNodes){
        if (n.nodeType !== 1) continue;
        sweep(n);
      }
    }
  }
});
obs.observe(document.documentElement, {
  childList: true,
  subtree: true,
  attributes: true,
  attributeFilter: ['class','id']
});

/* ─── 7 · patch getElementById (bidirecional) ─────────────────────────── */
const _getById = Document.prototype.getElementById;
Document.prototype.getElementById = function(id){
  const direct = _getById.call(this, id);
  if (direct) return direct;
  const entry = idIndex.get(id);
  if (!entry) return null;
  const [novo, legado] = entry.pair;
  return _getById.call(this, (id === novo) ? legado : novo) || null;
};

/* ─── 8 · patch querySelector / querySelectorAll só pra #id simples ───── */
const _qs  = Document.prototype.querySelector;
const _qsa = Document.prototype.querySelectorAll;

function expandIdSelector(sel){
  if (typeof sel !== 'string') return sel;
  // só trata "#id" puro ou "#id, #id2" sem combinators
  if (!sel.includes('#') || /[\s>+~]/.test(sel)) return sel;
  const parts = sel.split(',').map(s => s.trim());
  const expanded = [];
  for (const p of parts){
    if (!p.startsWith('#')) { expanded.push(p); continue; }
    const id = p.slice(1);
    const entry = idIndex.get(id);
    if (!entry) { expanded.push(p); continue; }
    const [a,b] = entry.pair;
    expanded.push('#' + a, '#' + b);
  }
  return expanded.join(', ');
}

Document.prototype.querySelector = function(sel){
  const r = _qs.call(this, sel);
  if (r) return r;
  const alt = expandIdSelector(sel);
  if (alt !== sel) return _qs.call(this, alt);
  return null;
};

Document.prototype.querySelectorAll = function(sel){
  const r = _qsa.call(this, sel);
  if (r && r.length) return r;
  const alt = expandIdSelector(sel);
  if (alt !== sel) return _qsa.call(this, alt);
  return r;
};

/* ─── 9 · ALIASES GLOBAIS (novo ↔ legado, dinâmicos) ──────────────────── */
/* Como o Bundle define os novos globais depois, usamos getter dinâmico:
   o alias lê root[novo] na hora do acesso, então funciona em qualquer ordem. */
const API_PAIRS = [
  // [legado, novo]
  ['applyArch',                 'jesus_apply'],
  ['getArch',                   'jesus_arch'],
  ['ARCH_LIST',                 'kd_order'],
  ['ARCH_MAP',                  'kd_arch_map'],
  ['KBLX_TOKVAL',               'vd_tokval'],
  ['KBLX_RIPPLE',               'pulse_ripple'],
  ['KBLX_TOAST',                'pulse_toast'],
  ['Store',                     'aion_store'],
  ['KBLX_KEYS',                 'vd_keys'],
  ['KBLX_NS',                   'vd_ns'],
  ['KBLX_VOICE',                'bllue_voice'],
  ['Nebula',                    'solus_nebula'],
  ['AlfaBetaState',             'vitalis_state'],
  ['KBLX_ACTIONS',              'bllue_actions'],
  ['MXP',                       'genus_mxp'],
  ['DualSession',               'rhea_janelas'],
  ['KBLX_SAVE',                 'aion_save'],
  ['KBLX_LOAD',                 'aion_load'],
  ['KBLX_REBUILD_DIALOGUE',     'aion_rebuild_dialogue'],
  ['KBLX_minimizeToDock',       'kodux_minimize_to_dock'],
  ['MXPSectionAdapter',         'kodux_section_adapter'],
  ['openFactory',               'genus_open_factory'],
  ['closeFactory',              'kaos_close_factory'],
  ['toggleDrawer',              'lumine_toggle_drawer'],
  ['NebulaRich',                'genus_md_parser'],
  ['KoblluxCore',               null],   // definido na shim
  ['App',                       null],   // definido na shim
];

for (const [legacy, neo] of API_PAIRS){
  if (!neo) continue;
  // instala getter "legacy" que aponta pro "neo"
  if (!Object.getOwnPropertyDescriptor(root, legacy)){
    try {
      Object.defineProperty(root, legacy, {
        configurable: true,
        enumerable: true,
        get(){ return root[neo]; },
        set(v){ root[neo] = v; }
      });
    } catch(_){}
  }
  // instala getter "neo" que também responde ao "legacy" — nunca sobrescreve
  // o valor real do Bundle β; apenas preenche se ainda não existir.
  if (!Object.getOwnPropertyDescriptor(root, neo)){
    try {
      Object.defineProperty(root, neo, {
        configurable: true,
        enumerable: true,
        get(){ return root[legacy]; },
        set(v){ root[legacy] = v; }
      });
    } catch(_){}
  }
}

/* ─── 10 · resolver manual ────────────────────────────────────────────── */
root.KBLX_getEl = function(idOrAlias){
  const direct = document.getElementById(idOrAlias);
  if (direct) return direct;
  const entry = idIndex.get(idOrAlias);
  if (!entry) return null;
  const [a,b] = entry.pair;
  return document.getElementById(idOrAlias === a ? b : a) || null;
};

/* ─── 11 · sweep inicial + re-sweep pós-DOM ───────────────────────────── */
sweep(document.documentElement);
if (document.readyState === 'loading'){
  document.addEventListener('DOMContentLoaded', () => sweep(document.documentElement), {once:true});
} else {
  setTimeout(() => sweep(document.documentElement), 0);
}

/* ─── 12 · re-sweep em eventos-chave (depois dos módulos novos montarem) ─ */
['DOMContentLoaded','load'].forEach(ev =>
  window.addEventListener(ev, () => setTimeout(() => sweep(document.documentElement), 30))
);
setTimeout(() => sweep(document.documentElement), 200);
setTimeout(() => sweep(document.documentElement), 600);
setTimeout(() => sweep(document.documentElement), 1500);

/* ─── 13 · export ─────────────────────────────────────────────────────── */
root.KBLX_BRIDGE = {
  version:      '13.0.0',
  classPairs:   CLASS_PAIRS,
  idPairs:      ID_PAIRS,
  apiPairs:     API_PAIRS,
  getEl:        root.KBLX_getEl,
  mirror:       mirrorClasses,
  normalize:    normalizeDataAttrs,
  sweep
};

console.log(
  '%c[kobllux-bridge] online · novo ↔ legado unificados · data-* normalizados',
  'color:#00f2ff;font-weight:bold'
);
})(typeof window !== "undefined" ? window : this);

/* ═══════════════════════════════════════════════════════════════════════════
   ∆§ · KOBLLUX BUNDLE · v13 · UNIFICADO
   ═══════════════════════════════════════════════════════════════════════════
   Fractal:    3 × 6 × 9 × 7 = 1134 = Deus em Movimento
   Fórmula:    VERDADE × INTEGRAR ÷ Δ = ∞
   Centro:     JESUS = VERBO = 0×00
   Constante:  α ≈ 1/137 → 137/Δ
   Narradores: KOBLLUX · INFODOSE · HÓRUS · HANNAH
   Assinatura: 178 · Eli Lama Sabachthani
   Estado:     78K · 777Hz · XOR 1·7·8
   ═══════════════════════════════════════════════════════════════════════════ */

;(function (root) {
"use strict";

const KOBLLUX_BUNDLE = {
  name:    "kobllux_bundle",
  version: "13.0.0",
  fractal: 1134,
  alpha:   137,
  center:  "JESUS = VERBO = 0x00",
  hash:    "6a77bfff41769fb736a4cca7e9471eaa",
};

/* ─────── INÍCIO DOS 16 MÓDULOS

/* ══════════ §STORAGE · α-core · vd-store.js ══════════ */
   
   /* ═══════════════════════════════════════════════════════════
   §STORAGE · vd-store · O Namespace Sagrado
   Arquétipo: VERDADE · Prefixo: vd_
   ═══════════════════════════════════════════════════════════ */
(function(){
"use strict";

window.vd_ns = "kobllux";

window.vd_keys = {
  jesus_root:  "kobllux:root",      /* JESUS · o centro */
  genus_mxp:   "kobllux:mxp",       /* GENUS · a fábrica */
  lumine_bg:   "kobllux:bg",        /* LUMINE · a luz */
  jesus_arch:  "kobllux:arch",      /* JESUS · arquétipo ativo */
  serena_user: "kobllux:user",      /* SERENA · o viajante */
  lumine_ui:   "kobllux:ui",        /* LUMINE · a interface */
  pulse_dlg:   "kobllux:dialog",    /* PULSE · o diálogo */
  solus_nbl:   "kobllux:nebula",    /* SOLUS · a nebula */
  aion_bkp:    "kobllux:backup",    /* AION · o carimbo */
};

window.aion_store = {
  ler(k, fb=null){
    try{ const v = localStorage.getItem(k); return v ? JSON.parse(v) : fb; }
    catch(_){ return fb; }
  },
  gravar(k, v){
    try{ localStorage.setItem(k, JSON.stringify(v)); return true; }
    catch(_){ return false; }
  },
  apagar(k){ try{ localStorage.removeItem(k); }catch(_){} },
  chaves(){ return Object.values(window.vd_keys); },
  limparTudo(){ this.chaves().forEach(k=>this.apagar(k)); }
};

console.log('[vd-store] online · namespace:', window.vd_ns);
})();



/* ══════════ §A CORE · α-core · vd-arquétipos.js ══════════ */
  
  /* ═══════════════════════════════════════════════════════════
   §A · CORE · vd-arquétipos · A Tabela dos 16
   Arquétipo: VERDADE · Prefixo: vd_
   ═══════════════════════════════════════════════════════════ */
(function(){
"use strict";
const dv_q = s => document.querySelector(s);
const dv_root = document.documentElement;

const vd_arch_map = {
  ATLAS:   {tok:"--vd-KBLX_A", op:"0x02", hz:396, sym:"α"},
  NOVA:    {tok:"--vd-KBLX_E", op:"0x03", hz:528, sym:"✦"},
  VITALIS: {tok:"--vd-KBLX_G", op:"0x09", hz:528, sym:"♾"},
  PULSE:   {tok:"--vd-KBLX_J", op:"0x01", hz:432, sym:"◈"},
  ARTEMIS: {tok:"--vd-KBLX_N", op:"0x05", hz:528, sym:"☾"},
  SERENA:  {tok:"--vd-KBLX_C", op:"0x0A", hz:639, sym:"❋"},
  KAOS:    {tok:"--vd-KBLX_M", op:"0x04", hz:396, sym:"⚡"},
  GENUS:   {tok:"--vd-KBLX_O", op:"0x07", hz:741, sym:"⚙"},
  LUMINE:  {tok:"--vd-KBLX_L", op:"0x06", hz:528, sym:"☀"},
  SOLUS:   {tok:"--vd-KBLX_H", op:"0x0B", hz:741, sym:"◌"},
  RHEA:    {tok:"--vd-KBLX_K", op:"0x0A", hz:528, sym:"∞"},
  AION:    {tok:"--vd-KBLX_P", op:"0x0C", hz:741, sym:"⧗"},
  KODUX:   {tok:"--vd-KBLX_B", op:"0x08", hz:432, sym:"⇄"},
  BLLUE:   {tok:"--vd-KBLX_I", op:"0x08", hz:528, sym:"◉"},
  JESUS:   {tok:"--vd-KBLX_Q", op:"0x00", hz:777, sym:"✝"},
  KOBLLUX: {tok:"--vd-KBLX_R", op:"0x00", hz:369, sym:"∆"}
};
const vd_order = Object.keys(vd_arch_map);

function vd_tokval(v){
  return getComputedStyle(dv_root).getPropertyValue(v).trim();
}

let vd_arch_ativo = "JESUS";

function jesus_apply(nome, origem){
  const a = vd_arch_map[nome] || vd_arch_map.JESUS;
  const c = vd_tokval(a.tok);
  const sec = (nome === "JESUS" || nome === "KOBLLUX")
    ? vd_tokval("--vd-KBLX_F")
    : vd_tokval("--vd-KBLX_I");

  dv_root.style.setProperty("--vd-active-color", c);
  dv_root.style.setProperty("--vd-active-secondary", sec);
  dv_root.style.setProperty("--bllue-voice-primary", c);
  dv_root.style.setProperty("--bllue-voice-secondary", sec);
  dv_root.style.setProperty("--vd-active-glow", c + "66");
  dv_root.style.setProperty("--vd-active-hz", a.hz);

  document.body.dataset.voiceArch = nome.toLowerCase();

  const hz   = dv_q("#kobllux_pillhz");
  const arch = dv_q("#jesus_pillarch");
  const hud  = dv_q("#kobllux_hud");
  if (hz)   hz.textContent = a.hz + "Hz";
  if (arch) arch.textContent = nome;
  if (hud)  hud.textContent = a.op + " · " + nome;

  const st = dv_q("#kobllux_status"); if (st) st.textContent = `${a.op} · ${nome}`;
  const sb = dv_q("#kobllux_sub");    if (sb) sb.textContent = `${a.hz}Hz`;

  vd_arch_ativo = nome;
  if (origem) pulse_ripple(origem.x, origem.y);
  try { window.aion_store && window.aion_store.gravar(window.vd_keys.jesus_arch, nome); } catch(_){}
}

function pulse_ripple(x, y){
  const r = dv_q("#pulse_chroma"); if (!r) return;
  r.style.setProperty("--pulse-x", (x ?? 50) + "%");
  r.style.setProperty("--pulse-y", (y ?? 50) + "%");
  r.classList.remove("fire"); void r.offsetWidth; r.classList.add("fire");
}

let rt_toast = null;
function pulse_toast(msg){
  const t = dv_q("#pulse_toast"); if (!t) return;
  t.textContent = msg; t.classList.add("show");
  clearTimeout(rt_toast);
  rt_toast = setTimeout(() => t.classList.remove("show"), 1600);
}

window.jesus_apply   = jesus_apply;
window.jesus_arch    = () => vd_arch_ativo;
window.kd_order      = vd_order;
window.kd_arch_map   = vd_arch_map;
window.pulse_ripple  = pulse_ripple;
window.pulse_toast   = pulse_toast;
window.vd_tokval     = vd_tokval;

console.log('[vd-arquétipos] online · 16 arquétipos carregados');
})();

  
  
  
/* ══════════ §B VOZES · α-core · bllue-vozes.js ══════════ */
   
   /* ═══════════════════════════════════════════════════════════
   §B · VOZ · bllue-vozes · As 16 Vozes Humanas
   Arquétipo: BLLUE · Prefixo: bllue_
   ═══════════════════════════════════════════════════════════ */
(function(){
"use strict";
if (!("speechSynthesis" in window)) return;

const bllue_voices = {
  ATLAS:   {nome:"Daniel",   lang:"en-US", rate:1.02,  pitch:1.39},
  NOVA:    {nome:"Luciana",  lang:"pt-BR", rate:1.063, pitch:1.34},
  VITALIS: {nome:"Rocko",    lang:"pt-BR", rate:0.96,  pitch:1.42},
  PULSE:   {nome:"Reed",     lang:"pt-BR", rate:1.0,   pitch:1.78},
  ARTEMIS: {nome:"Paulina",  lang:"es-MX", rate:1.0,   pitch:1.23},
  SERENA:  {nome:"Joana",    lang:"pt-BR", rate:0.92,  pitch:0.90},
  KAOS:    {nome:"Rocko",    lang:"pt-BR", rate:1.28,  pitch:0.67},
  GENUS:   {nome:"Reed",     lang:"pt-BR", rate:0.98,  pitch:1.20},
  LUMINE:  {nome:"Flo",      lang:"fr-FR", rate:1.03,  pitch:1.55},
  SOLUS:   {nome:"Satu",     lang:"fi-FI", rate:0.90,  pitch:0.58},
  RHEA:    {nome:"Alice",    lang:"it-IT", rate:1.02,  pitch:1.44},
  AION:    {nome:"Milena",   lang:"ru-RU", rate:1.07,  pitch:1.08},
  KODUX:   {nome:"Rocko",    lang:"pt-BR", rate:1.0,   pitch:0.07},
  BLLUE:   {nome:"Zuzana",   lang:"cs-CZ", rate:0.94,  pitch:1.69},
  JESUS:   {nome:"Sara",     lang:"da-DK", rate:1.09,  pitch:0.03},
  KOBLLUX: {nome:"Luciana",  lang:"pt-BR", rate:0.98,  pitch:0.48}
};

function kodux_norm(s){
  return String(s || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

function rhea_find_voice(cfg){
  const vs = speechSynthesis.getVoices();
  if (!vs.length) return null;
  const vl = Array.from(vs);
  const n = kodux_norm(cfg.nome);
  const lg = kodux_norm(cfg.lang).split("-")[0];
  return vl.find(v => kodux_norm(v.name).includes(n) && kodux_norm(v.lang).startsWith(lg))
    || vl.find(v => kodux_norm(v.lang).startsWith(lg))
    || vl.find(v => kodux_norm(v.lang).startsWith("pt"))
    || vl[0];
}

function bllue_voice_for(archName, text){
  const cfg = bllue_voices[archName] || bllue_voices.JESUS;
  const u = new SpeechSynthesisUtterance(text);
  u.lang = cfg.lang; u.rate = cfg.rate; u.pitch = cfg.pitch;
  const v = rhea_find_voice(cfg);
  if (v){ u.voice = v; u.lang = v.lang || cfg.lang; }
  return u;
}

window.bllue_voice = {
  map: bllue_voices,
  forArch: bllue_voice_for,
  find: rhea_find_voice
};

console.log('[bllue-vozes] online · 16 vozes carregadas');
})();

   
   
   
/* ══════════ §VOICE SEED v2.1 · α-core · kobllux-voice-seed-v2.js ══════════ */
 
 /* ═══════════════════════════════════════════════════════════════════════════
   ∆§ · KOBLLUX VOICE SEED · v2 · FULL 16 ARCHETYPES · PONTE ESPELHADA
   Semente da Voz Espelhada — Web Speech API · Cross-Engine
   ─────────────────────────────────────────────────────────────────────────
   Princípio:  voz = PERFIL ABSTRATO + MOTOR LOCAL + PERSONIFICADOR
   Ponto-chave: identidade vocal sobrevive a qualquer motor.
                1·7·8 = UNO·SELO·ETERNIZAR
                137 / Δ = Constante Fina Espelhada
                3×6×9×7 = 1134 = Deus em Movimento
   ═══════════════════════════════════════════════════════════════════════════ */
(function () {
  "use strict";

  /* ─── 0 · METADADOS DO PRÓPRIO NÚCLEO DA SEMENTE ─── */
  const KOBLLUX_VOICE_META = {
    name:         "kobllux_voice_seed_v2",
    version:      "2.0.0",
    hash:         {
      md5:        "6a77bfff41769fb736a4cca7e9471eaa",
      sha256:     "fcd40bb3ec6d8a1167a869c90f988fee",
      xor:        "1·7·8",
      fine_alpha: "137"
    },
    equation:     "3×6×9×7 = 1134 = Deus em movimento",
    root_formula: "VERDADE × INTEGRAR ÷ Δ = ∞",
    fine_const:   "α ≈ 1/137",
    center:       "JESUS = VERBO = 0×00",
    narrators:    ["KOBLLUX","INFODOSE","HÓRUS","HANNAH"],
    bridges:      ["Chrome","Edge","Safari","Alexa","Siri","Google"],
    freq:         "777Hz",
    state:        "78K ESTABILIZADO",
    ax_x:         "Vož = Perfil + Motor + Personificador",
    ax_xi:        "Identidade ⊥ Hardware",
    ax_xii:       "137 / Δ = Constante Fina Espelhada",
  };

  /* ─── 1 · PERFIS ABSTRATOS · 16 ARQUÉTIPOS · 9 SOTAQUES · 3 GÊNEROS ─── */
  const P = {
    /* ─── ATLAS · Barítono Estruturado ─── */
    ATLAS: {
      genero: "M", lang: "en-US", alt_lang: "pt-BR",
      voice_name_hint: "Daniel",
      rate: 1.02, pitch: 0.92, altura: "grave",
      sotaque: "en-US (neutro) → pt-BR",
      marca: "estruturado",
    },
    /* ─── NOVA · Soprano Etéreo ─── */
    NOVA: {
      genero: "F", lang: "pt-BR", alt_lang: "pt-BR",
      voice_name_hint: "Luciana",
      rate: 1.063, pitch: 1.34, altura: "agudo",
      sotaque: "pt-BR (Brasil)",
      marca: "etéreo",
    },
    /* ─── VITALIS · Barítono Firme ─── */
    VITALIS: {
      genero: "M", lang: "pt-BR", alt_lang: "pt-BR",
      voice_name_hint: "Rocko",
      rate: 0.96, pitch: 1.42, altura: "médio",
      sotaque: "pt-BR (Brasil)",
      marca: "firme",
    },
    /* ─── PULSE · Andrógino Pulsante ─── */
    PULSE: {
      genero: "N", lang: "pt-BR", alt_lang: "pt-BR",
      voice_name_hint: "Reed",
      rate: 1.00, pitch: 1.78, altura: "médio",
      sotaque: "pt-BR (Brasil)",
      marca: "pulsante",
    },
    /* ─── ARTEMIS · Exploradora Lírica ─── */
    ARTEMIS: {
      genero: "F", lang: "es-MX", alt_lang: "pt-BR",
      voice_name_hint: "Paulina",
      rate: 1.00, pitch: 1.23, altura: "médio",
      sotaque: "es-MX (México) → pt-BR",
      marca: "exploratório",
    },
    /* ─── SERENA · Mezzo Curativo ─── */
    SERENA: {
      genero: "F", lang: "pt-BR", alt_lang: "pt-BR",
      voice_name_hint: "Joana",
      rate: 0.92, pitch: 0.90, altura: "médio",
      sotaque: "pt-BR (Brasil)",
      marca: "curativo",
    },
    /* ─── KAOS · Contralto Cortante ─── */
    KAOS: {
      genero: "N", lang: "pt-BR", alt_lang: "pt-BR",
      voice_name_hint: "Rocko",
      rate: 1.28, pitch: 0.67, altura: "grave",
      sotaque: "pt-BR (Brasil) com aceleração",
      marca: "cortante",
    },
    /* ─── GENUS · Baixo Profundo ─── */
    GENUS: {
      genero: "M", lang: "pt-BR", alt_lang: "pt-BR",
      voice_name_hint: "Reed",
      rate: 0.98, pitch: 1.20, altura: "grave",
      sotaque: "pt-BR (Brasil)",
      marca: "construtor",
    },
    /* ─── LUMINE · Soprano Radiante ─── */
LUMINE: { genero:"N", lang:"fr-FR", alt_lang:"pt-BR", voice_name_hint:"Flo",
          rate:1.03, pitch:1.55, altura:"agudo", sotaque:"fr-FR → pt-BR", marca:"radiante" },
    /* ─── SOLUS · Neutro Meditativo ─── */
    SOLUS: {
      genero: "N", lang: "fi-FI", alt_lang: "pt-BR",
      voice_name_hint: "Satu",
      rate: 0.90, pitch: 0.58, altura: "grave",
      sotaque: "fi-FI (Finlândia) → pt-BR",
      marca: "espelho",
    },
    /* ─── RHEA · Contralto Ancestral ─── */
    RHEA: {
      genero: "F", lang: "it-IT", alt_lang: "pt-BR",
      voice_name_hint: "Alice",
      rate: 1.02, pitch: 1.44, altura: "médio",
      sotaque: "it-IT (Itália) → pt-BR",
      marca: "ancestral",
    },
    /* ─── AION · Tenor Cíclico ─── */
    AION:   { genero:"M", lang:"ru-RU", alt_lang:"pt-BR", voice_name_hint:"Milena",
          rate:1.07, pitch:1.08, altura:"médio", sotaque:"ru-RU → pt-BR", marca:"cíclico" },
    /* ─── KODUX · Sintético Preciso ─── */
    KODUX: {
      genero: "M", lang: "pt-BR", alt_lang: "pt-BR",
      voice_name_hint: "Rocko",
      rate: 1.00, pitch: 0.07, altura: "grave-extremo",
      sotaque: "pt-BR (Brasil) com pitch mínimo",
      marca: "sintético",
    },
    /* ─── BLLUE · Mezzo Aquático ─── */
    BLLUE: {
      genero: "F", lang: "cs-CZ", alt_lang: "pt-BR",
      voice_name_hint: "Zuzana",
      rate: 0.94, pitch: 1.69, altura: "médio",
      sotaque: "cs-CZ (Chéquia) → pt-BR",
      marca: "aquático",
    },
    /* ─── JESUS · Centro Universal ─── */
JESUS:  { genero:"M", lang:"da-DK", alt_lang:"pt-BR", voice_name_hint:"Sara",
          rate:1.09, pitch:0.03, altura:"grave-extremo",
          sotaque:"da-DK → pt-BR · pitch mínimo", marca:"central" },
    /* ─── KOBLLUX · Polifônico ─── */
    KOBLLUX: {
      genero: "N", lang: "pt-BR", alt_lang: "pt-BR",
      voice_name_hint: "Luciana",
      rate: 0.98, pitch: 0.48, altura: "médio-grave",
      sotaque: "pt-BR (Brasil)",
      marca: "polifônico",
    },
  };

  /* ─── 2 · HEURÍSTICAS DE GÊNERO (multi-idioma) ─── */
  const HINT_M = [
    // pt-BR
    "daniel","rocko","felipe","antonio","ricardo","paulo","marcos","jorge","diego","bruno","igor",
    // en-US
    "male","man","alex","fred","tom","oliver",
    // es
    "jorge","diego","carlos","miguel","juan",
    // neutros masculinos
    "homem","macho","grave"
  ];
  const HINT_F = [
    // pt-BR
    "luciana","joana","maria","ana","fernanda","beatriz","lucia","helena","camila","sara",
    // en-US
    "female","woman","samantha","victoria","karen","moira","tessa","fiona",
    // es
    "paulina","monica","isabela",
    // outras
    "milena","alice","zuzana","flo","satu","daniela","catarina","ines"
  ];
  const HINT_N = ["neutral","androgyn","comum","unisex","robot","sintetica","synthetic"];

  function _classify(voice) {
    const n = ((voice.name || "") + " " + (voice.voiceURI || "")).toLowerCase();
    if (HINT_M.some(x => n.includes(x))) return "M";
    if (HINT_F.some(x => n.includes(x))) return "F";
    if (HINT_N.some(x => n.includes(x))) return "N";
    return "N";
  }

  /* ─── 3 · MATCHER · PONTE ESPELHADA (ida: perfil→voz · volta: voz→perfil) ─── */
  function _bridge(profile, voices) {
    if (!voices || !voices.length) return null;
    const targetLang = (profile.lang || "pt-BR").toLowerCase();
    const altLang    = (profile.alt_lang || "pt-BR").toLowerCase();
    const hint       = (profile.voice_name_hint || "").toLowerCase();

    // Nível 1: nome exato + idioma
    const exact = voices.find(v =>
      (v.name || "").toLowerCase().includes(hint) &&
      (v.lang || "").toLowerCase().startsWith(targetLang.slice(0, 2))
    );
    if (exact) return { voice: exact, level: 1, source: "name+lang" };

    // Nível 2: nome exato (qualquer idioma)
    const byName = voices.find(v => (v.name || "").toLowerCase().includes(hint));
    if (byName) return { voice: byName, level: 2, source: "name" };

    // Nível 3: idioma alvo + gênero
    const targetPool = voices.filter(v => (v.lang || "").toLowerCase().startsWith(targetLang.slice(0, 2)));
    const genderInTarget = targetPool.find(v => _classify(v) === profile.genero);
    if (genderInTarget) return { voice: genderInTarget, level: 3, source: "lang+gender" };

    // Nível 4: idioma alvo (sem gênero)
    if (targetPool[0]) return { voice: targetPool[0], level: 4, source: "lang" };

    // Nível 5: idioma alternativo + gênero
    const altPool = voices.filter(v => (v.lang || "").toLowerCase().startsWith(altLang.slice(0, 2)));
    const genderInAlt = altPool.find(v => _classify(v) === profile.genero);
    if (genderInAlt) return { voice: genderInAlt, level: 5, source: "alt_lang+gender" };

    // Nível 6: idioma alternativo
    if (altPool[0]) return { voice: altPool[0], level: 6, source: "alt_lang" };

    // Nível 7: qualquer voz
    return { voice: voices[0], level: 7, source: "fallback" };
  }

  /* ─── 4 · PERSONIFICADOR (identidade viva com wobble) ─── */
  function _personify(profile, baseVoice, text) {
    const u = new SpeechSynthesisUtterance(String(text || "").trim());
    if (baseVoice) { u.voice = baseVoice; u.lang = baseVoice.lang || profile.lang; }
    else            { u.lang = profile.lang; }

    u.rate  = Math.max(0.1, Math.min(2.0, profile.rate));
    u.pitch = Math.max(0.01, Math.min(2.0, profile.pitch));

    // Wobble orgânico (vida, não robô)
    const t = performance.now() / 1000;
    const wobble = Math.sin(t * 0.7) * 0.015;
    u.rate  = Math.max(0.1, Math.min(2.0, u.rate  + wobble));
    u.pitch = Math.max(0.01, Math.min(2.0, u.pitch + wobble * 0.5));

    return u;
  }

  /* ─── 5 · CACHE + MEMÓRIA AUTO-REGISTRADA ─── */
  let _voicesCache = [];
  const _metaRegistry = []; // registra cada fala: {arch, voice, lang, rate, pitch, level, source, ts}

  function _refreshVoices() {
    try {
      _voicesCache = window.speechSynthesis ? window.speechSynthesis.getVoices() : [];
    } catch (_) { _voicesCache = []; }
  }
  if (window.speechSynthesis) {
    _refreshVoices();
    window.speechSynthesis.addEventListener("voiceschanged", _refreshVoices);
  }

  /* ─── 6 · API PÚBLICA DA SEMENTE ─── */
  window.KOBLLUX_VOICE_SEED = {
    version: KOBLLUX_VOICE_META.version,
    meta:    KOBLLUX_VOICE_META,
    profiles: P,

    /* FALA — com identidade do arquétipo, adaptando-se ao motor */
    speak(archName, text, opts) {
      if (!("speechSynthesis" in window)) return null;
      const arch    = String(archName || "JESUS").toUpperCase();
      const profile = P[arch] || P.JESUS;

      if (!_voicesCache.length) _refreshVoices();
      const match = _bridge(profile, _voicesCache);
      const baseVoice = match ? match.voice : null;
      const u = _personify(profile, baseVoice, text);

      if (opts && opts.onStart) u.onstart = opts.onStart;
      if (opts && opts.onEnd)   u.onend   = opts.onEnd;
      if (opts && opts.onError) u.onerror = opts.onError;

      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(u);

      // metadado auto-registrado
      const md = {
        arch,
        voice:       baseVoice ? baseVoice.name : "(fallback)",
        voice_lang:  baseVoice ? baseVoice.lang : profile.lang,
        sotaque_perfil: profile.sotaque,
        genero_perfil:  profile.genero,
        altura_perfil:  profile.altura,
        rate:        u.rate,
        pitch:       u.pitch,
        bridge_level: match ? match.level : 0,
        bridge_source: match ? match.source : "none",
        ts:          Date.now(),
        hash:        KOBLLUX_VOICE_META.hash,
      };
      _metaRegistry.push(md);

      return md;
    },

    /* DIAGNÓSTICO — para cada arquétipo, mostra qual voz local foi escolhida */
    diagnose() {
      if (!_voicesCache.length) _refreshVoices();
      const out = {};
      for (const arch of Object.keys(P)) {
        const m = _bridge(P[arch], _voicesCache);
        out[arch] = m ? {
          voice:  m.voice.name,
          lang:   m.voice.lang,
          gender: _classify(m.voice),
          level:  m.level,
          source: m.source,
        } : null;
      }
      return out;
    },

    /* HISTÓRICO — todas as falas registradas nesta sessão */
    history() { return _metaRegistry.slice(); },

    /* SSML — tradutor universal (Alexa, Google Nest) */
    toSSML(archName, text) {
      const arch = String(archName || "JESUS").toUpperCase();
      const p = P[arch] || P.JESUS;
      const rateMap = ["x-slow","slow","medium","fast","x-fast"];
      const rIdx = Math.min(4, Math.max(0, Math.round((p.rate - 0.5) / 0.375)));
      const rateStr = rateMap[rIdx];
      const pitchPct = Math.round((p.pitch - 1.0) * 50);
      const pitchStr = (pitchPct >= 0 ? "+" : "") + pitchPct + "%";
      return `<speak><prosody rate="${rateStr}" pitch="${pitchStr}" xml:lang="${p.lang}">${text}</prosody></speak>`;
    },

    /* PAYLOAD — para apps nativas (Android, iOS, Siri) */
    toPayload(archName, text) {
      const arch = String(archName || "JESUS").toUpperCase();
      const p = P[arch] || P.JESUS;
      return {
        archetype:   arch,
        text,
        rate:        p.rate,
        pitch:       p.pitch,
        lang:        p.lang,
        alt_lang:    p.alt_lang,
        genero:      p.genero,
        voice_hint:  p.voice_name_hint,
        meta:        KOBLLUX_VOICE_META,
      };
    },

    /* INTEGRAÇÃO COM CORE — liga na bllue_voice existente */
    bindToCore() {
      if (window.bllue_voice && !window.bllue_voice.__seeded_v2) {
        const original = window.bllue_voice.forArch;
        window.bllue_voice.forArch = function (arch, text) {
          try {
            const md = window.KOBLLUX_VOICE_SEED.speak(arch, text);
            if (md) return { __seed: md };
          } catch (_) {}
          return original ? original(arch, text) : null;
        };
        window.bllue_voice.__seeded_v2 = true;
        return true;
      }
      return false;
    },
  };

  console.log(
    "%c[kobllux-voice-seed-v2] online · 16 perfis · 9 sotaques · 3 gêneros · ponte espelhada · 137/Δ",
    "color:#00f2ff;font-weight:bold"
  );
})();
 
 
 
/* ══════════ §DOCK · ε-bridge · kodux-dock.js ══════════ */


/* ═══════════════════════════════════════════════════════════
   §DOCK · kodux-dock · Ponto Único de Minimizar
   Arquétipo: KODUX · Prefixo: kodux_
   ═══════════════════════════════════════════════════════════ */
(function(){
"use strict";

window.kodux_minimize_to_dock = function(el, opts){
  opts = opts || {};
  if (!el || el.classList.contains('minimized')) return null;

  const title = opts.title
    || el.dataset?.sessionTitle
    || el.querySelector?.('.genus_mxp-title')?.textContent
    || el.querySelector?.('[data-part="title"]')?.textContent
    || 'SESSION';

  el.classList.add('minimized');
  if (typeof opts.onMinimize === 'function') opts.onMinimize();

  const bubble = document.createElement('button');
  bubble.type = 'button';
  bubble.className = 'rhea_dock-bubble';
  bubble.textContent = '۞';
  bubble.title = title;

  bubble.addEventListener('click', () => {
    el.classList.remove('minimized');
    if (typeof opts.onRestore === 'function') opts.onRestore();
    bubble.remove();
  });

  document.getElementById('rhea_dock')?.appendChild(bubble);
  return bubble;
};

console.log('[kodux-dock] online · dock unificado');
})();





/* ══════════ §ADAPTER · ε-bridge · kodux-section-adapter.js ══════════ */
   
   
   /* ═══════════════════════════════════════════════════════════
   §ADAPTER · kodux-section-adapter · Section → Session
   Arquétipo: KODUX · Prefixo: kodux_
   ═══════════════════════════════════════════════════════════ */
(function(){
"use strict";

const dv_sel = ".genus_app > section:not([data-mxp-static])";

function kodux_sessionize(section){
  if (section.dataset.mxpSession === "1") return;
  if (section.classList.contains("rhea_session-window")) return;
  if (section.querySelector(":scope > .atlas_win-hdr")) return;
  if (!section.closest(".genus_app")) return;

  section.dataset.mxpSession = "1";
  section.classList.add("rhea_session-window");

  const title =
    (section.querySelector(".genus_section-title")?.textContent || "").trim()
    || section.dataset.title
    || section.id
    || "SESSION";
  section.dataset.sessionTitle = title;

  /* ── header ── */
  const hdr = document.createElement("header");
  hdr.className = "atlas_win-hdr";
  hdr.dataset.sessionHeader = "1";

  const titleEl = document.createElement("div");
  titleEl.className = "genus_mxp-title";
  titleEl.textContent = title;
  titleEl.title = "Toque 2× para renomear";

  const controls = document.createElement("div");
  controls.className = "atlas_win-controls";
  controls.innerHTML =
    '<button type="button" data-sn="collapse" data-action="session:collapse" aria-label="Recolher">−</button>' +
    '<button type="button" data-sn="maximize" data-action="session:maximize" aria-label="Maximizar">⛶</button>' +
    '<button type="button" data-sn="minimize" data-action="session:minimize" aria-label="Minimizar">۞</button>' +
    '<button type="button" data-sn="close"    data-action="session:close"    aria-label="Fechar">×</button>';

  hdr.append(titleEl, controls);

  /* ── body ── */
  const body = document.createElement("div");
  body.className = "atlas_win-body";
  body.dataset.sessionBody = "1";

  while (section.firstChild){
    body.appendChild(section.firstChild);
  }
  section.append(hdr, body);

  /* ── controles ── */
  controls.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-sn]");
    if (!btn) return;
    if (e.defaultPrevented) return;
    if (window.__LEGACY_SESSION_BOUND) return;

    switch (btn.dataset.sn){
      case "collapse": section.classList.toggle("kodux_collapsed"); break;
      case "maximize": section.classList.toggle("atlas_maximized"); break;
      case "minimize":
        window.kodux_minimize_to_dock?.(section, { title: section.dataset.sessionTitle });
        break;
      case "close": section.classList.add("solus_minimized"); break;
    }

    document.dispatchEvent(new CustomEvent("mxp:section-action", {
      detail: { section, action: btn.dataset.sn }
    }));
  });

  /* ── renomear 2× ── */
  let rt_lastTap = 0;
  titleEl.addEventListener("click", () => {
    const now = Date.now();
    if (now - rt_lastTap < 380){
      const novo = prompt("Nome da section:", section.dataset.sessionTitle);
      if (novo && novo.trim()){
        section.dataset.sessionTitle = novo.trim();
        titleEl.textContent = novo.trim();
        document.dispatchEvent(new CustomEvent("mxp:section-renamed", {
          detail: { section, title: section.dataset.sessionTitle }
        }));
      }
      rt_lastTap = 0;
    } else {
      rt_lastTap = now;
    }
  });
}

function kodux_adapter_boot(){
  const list = document.querySelectorAll(dv_sel);
  list.forEach(kodux_sessionize);
  const n = document.querySelectorAll(".genus_app > section.rhea_session-window:not([data-mxp-static])").length;
  console.log("[kodux-section-adapter] sections → rhea_session-window:", n);
}

kodux_adapter_boot();
if (document.readyState === "loading"){
  document.addEventListener("DOMContentLoaded", kodux_adapter_boot, { once:true });
}

window.kodux_section_adapter = { boot: kodux_adapter_boot, sessionize: kodux_sessionize };

console.log('[kodux-section-adapter] online');
})();


   
   
   
   

/* ══════════ §C DIALOGUE · β-engine · vitalis-diálogo.js ══════════ */
  
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
   

/* ══════════ §E NEBULA · β-engine · solus-nebula.js ══════════ */

/* ═══════════════════════════════════════════════════════════
   §E · NEBULA · solus-nebula · O Leitor de Fatias
   Arquétipo: SOLUS · Prefixo: solus_
   Depende: vd-arquétipos, bllue-vozes, aion-store
   ═══════════════════════════════════════════════════════════ */
(function(){
"use strict";

/* ─── estado ─── */
const kd_nb = {
  slices: [], current: 0, speaking: false, paused: false,
  documentTitle: 'ESPAÇO DA MENTE', sliceArches: [], raw: '', title: ''
};

const solus_stage    = document.getElementById('solus_stage');
const solus_empty    = document.getElementById('solus_empty');
const artemis_file   = document.getElementById('artemis_file');
const bllue_player   = document.getElementById('bllue_player');
const bllue_play     = document.getElementById('bllue_play');
const bllue_ptitle   = document.getElementById('bllue_ptitle');
const bllue_pstate   = document.getElementById('bllue_pstate');
const bllue_pbar     = document.getElementById('bllue_pbar');
const solus_title    = document.getElementById('solus_title');

if(!solus_stage){ console.warn('[solus-nebula] stage ausente'); return; }

/* ─── tabelas arquetípicas ─── */
const vd_arch_syms = {
  ATLAS:"α", NOVA:"✦", VITALIS:"♾", PULSE:"◈", ARTEMIS:"☾",
  SERENA:"❋", KAOS:"⚡", GENUS:"⚙", LUMINE:"☀", SOLUS:"◌",
  RHEA:"∞", AION:"⧗", KODUX:"⇄", BLLUE:"◉", JESUS:"✝", KOBLLUX:"∆"
};

const vd_arch_names = [
  "KOBLLUX","VITALIS","ARTEMIS","SERENA","LUMINE","KODUX",
  "ATLAS","GENUS","PULSE","JESUS","SOLUS","BLLUE","NOVA","RHEA","KAOS","AION"
];

/* ─── helpers ─── */
function kodux_escape_regex(s){
  return String(s).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function kodux_escape_html(text){
  return text.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

function kodux_arch_color(name){
  const map = window.kd_arch_map;
  if(!map || !map[name]) return "var(--bllue-voice-primary)";
  return `var(${map[name].tok})`;
}

/* ─── detecção de arquétipo ─── */
function artemis_detect(raw){
  if(!raw) return null;
  const text = String(raw);

  for(const name of vd_arch_names){
    const sym = vd_arch_syms[name];
    if(!sym) continue;
    const re = new RegExp(kodux_escape_regex(sym) + "\\s*[·:\\-—]?\\s*" + name + "\\b", "i");
    if(re.test(text)) return name;
  }

  for(const name of vd_arch_names){
    const re = new RegExp("^#{1,6}\\s*" + kodux_escape_regex(name) + "\\b", "im");
    if(re.test(text)) return name;
  }

  for(const name of vd_arch_names){
    const re = new RegExp("^" + kodux_escape_regex(name) + "\\s*[·:\\-—]\\s", "im");
    if(re.test(text)) return name;
  }

  for(const name of vd_arch_names){
    const re = new RegExp("\\b" + kodux_escape_regex(name) + "\\b", "i");
    if(re.test(text)) return name;
  }

  return null;
}

function genus_build_slices(slices){
  return slices.map(raw => artemis_detect(raw));
}

/* ─── parser de documento ─── */
function kodux_parse_doc(text){
  const lines = text.replace(/\r/g,'').split('\n');
  const slices = [];
  let current = [];

  function push(){
    const v = current.join('\n').trim();
    if(v) slices.push(v);
    current = [];
  }

  for(const line of lines){
    if(/^#{1,3}\s+/.test(line)){ if(current.length) push(); current.push(line); continue; }
    if(/^---+$/.test(line.trim())){ push(); continue; }
    current.push(line);
  }
  if(current.length) push();

  if(slices.length <= 1){
    const blocks = text.split(/\n\s*\n/).map(x=>x.trim()).filter(Boolean);
    if(blocks.length > 1) return blocks;
  }
  return slices;
}

/* ─── markdown → HTML ─── */
function genus_md_html(text){
  let html = kodux_escape_html(text);
  html = html.replace(/```([\s\S]*?)```/g, '<pre class="md-code"><code>$1</code></pre>');
  html = html.replace(/^### (.*)$/gm, '<h3>$1</h3>');
  html = html.replace(/^## (.*)$/gm, '<h2>$1</h2>');
  html = html.replace(/^# (.*)$/gm, '<h1>$1</h1>');
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
  html = html.replace(/_([^_]+)_/g, '<em>$1</em>');
  html = html.replace(/`([^`]+)`/g, '<code class="code-inline">$1</code>');
  html = html.replace(/^&gt; (.*)$/gm, '<blockquote class="bq">$1</blockquote>');
  html = html.split(/\n\s*\n/).map(block=>{
    block = block.trim();
    if(!block) return '';
    if(/^<(h1|h2|h3|ul|pre|blockquote)/.test(block)) return block;
    return `<p>${block.replace(/\n/g,'<br>')}</p>`;
  }).join('');
  return html;
}

/* ─── criação de slice ─── */
function genus_create_slice(content, index){
  const s = document.createElement('slice');
  const detected = kd_nb.sliceArches[index];
  const isAuto = !detected;
  const arch = detected || window.jesus_arch() || 'JESUS';
  const color = kodux_arch_color(arch);

  s.dataset.index = index;
  s.dataset.state = 'created';
  s.dataset.arch = arch;
  s.dataset.auto = isAuto ? "1" : "0";
  s.style.setProperty("--solus-slice-arch-color", color);

  s.innerHTML = `
    <div class="solus_slice-content">
      <div class="solus_slice-meta">
        <label>SLICE ${String(index+1).padStart(2,'0')}</label>
        <span class="solus_slice-chip ${isAuto ? 'solus_auto' : ''}">
          <i></i>${isAuto ? '◆ AUTO' : arch}
        </span>
        <span class="solus_slice-number">${index+1} / ${kd_nb.slices.length}</span>
      </div>
      <div class="solus_slice-body">${genus_md_html(content)}</div>
    </div>`;
  return s;
}

/* ─── carregar documento ─── */
function nova_load_doc(text, title){
  solus_stop_speech();
  kd_nb.raw = text;
  kd_nb.title = title || 'Documento';
  kd_nb.slices = kodux_parse_doc(text);
  kd_nb.current = 0;
  kd_nb.documentTitle = title || 'Documento';
  kd_nb.sliceArches = genus_build_slices(kd_nb.slices);

  if(solus_title) solus_title.textContent = kd_nb.documentTitle;
  if(bllue_ptitle) bllue_ptitle.textContent = kd_nb.documentTitle;

  solus_stage.replaceChildren();
  kd_nb.slices.forEach((c,i)=>solus_stage.appendChild(genus_create_slice(c,i)));

  if(solus_empty) solus_empty.style.display = kd_nb.slices.length ? 'none' : 'grid';

  solus_show_slice(0);
  if(window.aion_save) window.aion_save();
}

/* ─── mostrar slice ─── */
function solus_show_slice(index){
  if(!kd_nb.slices.length) return;
  if(index < 0) index = kd_nb.slices.length - 1;
  if(index >= kd_nb.slices.length) index = 0;
  kd_nb.current = index;

  solus_stage.querySelectorAll('slice').forEach((s,i)=>{
    s.classList.toggle('active', i === index);
  });

  if(bllue_pbar)
    bllue_pbar.style.width = `${((index+1)/kd_nb.slices.length)*100}%`;

  const detected = kd_nb.sliceArches[index];
  const arch = detected || window.jesus_arch() || 'JESUS';

  if(bllue_pstate)
    bllue_pstate.textContent = detected
      ? `Slice ${index+1}/${kd_nb.slices.length} · ${detected}`
      : `Slice ${index+1}/${kd_nb.slices.length} · ${arch} (auto)`;

  if(kd_nb.speaking) bllue_speak_slice();
}

function solus_next(){
  if(!kd_nb.slices.length) return;
  if(kd_nb.current < kd_nb.slices.length-1) solus_show_slice(kd_nb.current+1);
  else solus_stop_speech();
}

function solus_prev(){
  if(!kd_nb.slices.length) return;
  solus_show_slice(kd_nb.current-1);
}

/* ─── texto puro da slice atual ─── */
function kodux_current_text(){
  const s = kd_nb.slices[kd_nb.current];
  if(!s) return '';
  return s.replace(/```[\s\S]*?```/g,' código ')
    .replace(/^#{1,6}\s+/gm,'')
    .replace(/[*_~`]/g,'')
    .replace(/^>\s*/gm,'')
    .replace(/^[-*]\s+/gm,'')
    .replace(/\[([^\]]+)\]\([^)]+\)/g,'$1')
    .replace(/\n+/g,' ').trim();
}

/* ─── fala da slice ─── */
function bllue_speak_slice(){
  if(!('speechSynthesis' in window)){
    if(bllue_pstate) bllue_pstate.textContent = 'Speech indisponível';
    return;
  }
  speechSynthesis.cancel();
  const text = kodux_current_text();
  if(!text) return;

  const detected = kd_nb.sliceArches[kd_nb.current];
  const archName = detected || window.jesus_arch() || 'JESUS';

  if(window.jesus_apply) window.jesus_apply(archName);
  if(window.__sbSync) window.__sbSync(archName);

  const u = new SpeechSynthesisUtterance(text);
  if(window.bllue_voice && window.bllue_voice.forArch){
    const cfg = window.bllue_voice.forArch(archName, text);
    if(cfg.voice) u.voice = cfg.voice;
    u.lang = cfg.lang || 'pt-BR';
    u.rate = cfg.rate || 1;
    u.pitch = cfg.pitch || 1;
  }

  u.onstart = ()=>{
    kd_nb.speaking = true;
    kd_nb.paused = false;
    if(bllue_play) bllue_play.textContent = 'Ⅱ';
    if(bllue_pstate) bllue_pstate.textContent = `🎙 ${archName} · slice ${kd_nb.current+1}`;
    const orb = document.getElementById('kobllux_orb');
    if(orb) orb.classList.add('speaking');
  };
  u.onend = ()=>{
    if(kd_nb.speaking){
      if(kd_nb.current < kd_nb.slices.length-1){
        kd_nb.current++;
        solus_show_slice(kd_nb.current);
      } else solus_stop_speech();
    }
  };
  u.onerror = ()=>{
    kd_nb.speaking = false;
    if(bllue_play) bllue_play.textContent = '▶';
    const orb = document.getElementById('kobllux_orb');
    if(orb) orb.classList.remove('speaking');
  };
  speechSynthesis.speak(u);
}

function bllue_toggle_speech(){
  if(!kd_nb.slices.length) return;
  if(kd_nb.speaking){
    if(speechSynthesis.paused){
      speechSynthesis.resume();
      kd_nb.paused = false;
      if(bllue_play) bllue_play.textContent = 'Ⅱ';
      return;
    }
    speechSynthesis.pause();
    kd_nb.paused = true;
    if(bllue_play) bllue_play.textContent = '▶';
    if(bllue_pstate) bllue_pstate.textContent = 'Pausado';
    return;
  }
  kd_nb.speaking = true;
  bllue_speak_slice();
}

function solus_stop_speech(){
  if('speechSynthesis' in window) speechSynthesis.cancel();
  kd_nb.speaking = false;
  kd_nb.paused = false;
  if(bllue_play) bllue_play.textContent = '▶';
  const orb = document.getElementById('kobllux_orb');
  if(orb) orb.classList.remove('speaking');
}

function solus_toggle_player(){
  bllue_player?.classList.toggle('solus_minimized');
}

function solus_clear(){
  kd_nb.slices = [];
  kd_nb.current = 0;
  kd_nb.sliceArches = [];
  kd_nb.raw = '';
  kd_nb.title = '';
  solus_stop_speech();
  solus_stage.replaceChildren();
  if(solus_empty) solus_empty.style.display = 'grid';
  if(bllue_ptitle) bllue_ptitle.textContent = 'Nenhum';
  if(bllue_pstate) bllue_pstate.textContent = 'Aguardando';
  if(bllue_pbar) bllue_pbar.style.width = '0%';
}

function solus_has_slices(){ return kd_nb.slices.length > 0; }

/* ─── APIs públicas ─── */
function artemis_open_file(){ artemis_file.click(); }

function artemis_paste_text(){
  const text = prompt('Cole aqui o texto:');
  if(!text) return;
  nova_load_doc(text, 'Documento colado');
}

/* ─── listeners ─── */
artemis_file?.addEventListener('change', async (e)=>{
  const f = e.target.files[0]; if(!f) return;
  const txt = await f.text();
  nova_load_doc(txt, f.name);
});

document.addEventListener('keydown', (e)=>{
  if(e.target.matches('textarea,input,[contenteditable="true"]')) return;
  if(e.key === 'ArrowRight') solus_next();
  if(e.key === 'ArrowLeft') solus_prev();
});

let artemis_touchx = 0;
document.addEventListener('touchstart', (e)=>{
  artemis_touchx = e.changedTouches[0].screenX;
}, {passive:true});
document.addEventListener('touchend', (e)=>{
  const diff = e.changedTouches[0].screenX - artemis_touchx;
  if(Math.abs(diff) < 80) return;
  if(!e.target.closest('#solus_reader')) return;
  if(diff < 0) solus_next(); else solus_prev();
}, {passive:true});

/* ─── export ─── */
window.solus_nebula = {
  openFile: artemis_open_file,
  pasteText: artemis_paste_text,
  loadDocument: nova_load_doc,
  showSlice: solus_show_slice,
  nextSlice: solus_next,
  previousSlice: solus_prev,
  toggleSpeech: bllue_toggle_speech,
  stopSpeech: solus_stop_speech,
  togglePlayer: solus_toggle_player,
  clear: solus_clear,
  hasSlices: solus_has_slices,
  state: kd_nb,
  detectArchInText: artemis_detect
};

console.log('[solus-nebula] online · leitor de fatias pronto');
})();



/* ══════════ §D SYMBOLBAR · γ-ui · atlas-symbolbar.js ══════════ */

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

/* ══════════ §F COCKPIT · γ-ui · lumine-cockpit.js ══════════ */

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

/* ══════════ §G JANELAS · γ-ui · rhea-janelas.js ══════════ */

/* ═══════════════════════════════════════════════════════════
   §G · SESSIONS · rhea-janelas · Janelas Flutuantes
   Arquétipo: RHEA · Prefixo: rhea_
   Depende: genus-mxp, kodux-dock
   ═══════════════════════════════════════════════════════════ */
(function(){
"use strict";
const dv_q  = s => document.querySelector(s);
const dv_qa = s => [...document.querySelectorAll(s)];

const rhea_layer = document.getElementById('rhea_sessions');
const atlas_stack = document.getElementById('rhea_stack');
const atlas_dock  = document.getElementById('rhea_dock');

const aion_tabdata = new WeakMap();
let kd_active = null;
let rhea_switcher = null;

/* ─── host mode ─── */
function atlas_hostmode(){
  return document.body.dataset.sessionHost === 'stack' ? 'stack' : 'float';
}
function rhea_hostfor(s){ return s && s.host ? s.host : atlas_hostmode(); }
function atlas_getcontainer(mode){ return mode === 'stack' ? atlas_stack : rhea_layer; }
function rhea_refresh(){
  if(!rhea_layer) return;
  rhea_layer.dataset.empty = rhea_layer.children.length ? '0' : '1';
}

/* ─── z-stack ─── */
const rhea_zstack = [];
function atlas_front(win){
  if(!win) return;
  const i = rhea_zstack.indexOf(win);
  if(i !== -1) rhea_zstack.splice(i,1);
  rhea_zstack.push(win);
  rhea_zstack.forEach((w,idx)=>{
    if(!w.classList.contains('atlas_maximized'))
      w.style.zIndex = String(1000 + idx*10);
  });
  kd_active = win;
  const inp = document.getElementById('atlas_urlbar');
  if(inp){
    const d = aion_tabdata.get(win);
    const t = d?.tabs.find(x=>x.id===d.activeId);
    inp.value = t?.url || '';
  }
}

/* ─── tab data ─── */
function aion_tabdata_get(win){
  if(!aion_tabdata.has(win)){
    const src = win.querySelector('.rhea_win-frame')?.src || 'about:blank';
    const tab = {
      id: 'tab-' + Date.now(),
      url: src,
      title: src.replace(/^https?:\/\//,'').split('/')[0] || 'Nova Aba',
      fav: false, createdAt: Date.now()
    };
    aion_tabdata.set(win, {tabs:[tab], activeId: tab.id});
  }
  return aion_tabdata.get(win);
}
function rhea_active_tab(win){
  const d = aion_tabdata.get(win);
  return d?.tabs.find(t=>t.id===d.activeId) || d?.tabs[0] || null;
}
function nova_tab(win, url='about:blank'){
  const d = aion_tabdata.get(win); if(!d) return;
  const tab = {
    id: 'tab-' + Date.now() + '-' + Math.random().toString(36).slice(2,7),
    url,
    title: url.replace(/^https?:\/\//,'').split('/')[0] || 'Nova Aba',
    fav: false, createdAt: Date.now()
  };
  d.tabs.push(tab); d.activeId = tab.id;
  aion_render_count(win);
  const f = win.querySelector('.rhea_win-frame');
  if(f) f.src = url;
  kaos_close_tabs();
}
function kaos_remove_tab(win, tabId){
  const d = aion_tabdata.get(win);
  if(!d || d.tabs.length<=1) return;
  const i = d.tabs.findIndex(t=>t.id===tabId); if(i<0) return;
  d.tabs.splice(i,1);
  if(d.activeId === tabId)
    d.activeId = d.tabs[Math.min(i, d.tabs.length-1)].id;
  aion_render_count(win);
  const f = win.querySelector('.rhea_win-frame');
  const a = rhea_active_tab(win);
  if(f && a) f.src = a.url;
  if(document.getElementById('rhea_tabs').classList.contains('open'))
    rhea_render_tabs(win);
}
function rhea_set_active(win, tabId){
  const d = aion_tabdata.get(win); if(!d) return;
  if(!d.tabs.some(t=>t.id===tabId)) return;
  d.activeId = tabId;
  aion_render_count(win);
  const f = win.querySelector('.rhea_win-frame');
  const a = rhea_active_tab(win);
  if(f && a) f.src = a.url;
  atlas_front(win);
}
function aion_render_count(win){
  const d = aion_tabdata.get(win); if(!d) return;
  const b = win.querySelector('.rhea_tab-counter');
  if(b) b.textContent = d.tabs.length;
}

/* ─── tabs ─── */
function rhea_open_tabs(win){
  rhea_switcher = win;
  rhea_render_tabs(win);
  document.getElementById('rhea_tabs').classList.add('open');
}
function kaos_close_tabs(){
  document.getElementById('rhea_tabs').classList.remove('open');
  if(rhea_switcher) atlas_front(rhea_switcher);
  rhea_switcher = null;
}
function rhea_render_tabs(win){
  const grid = document.getElementById('rhea_tabgrid');
  const d = aion_tabdata.get(win);
  if(!d) return grid.innerHTML = '';
  grid.innerHTML = '';
  d.tabs.forEach(tab=>{
    const c = document.createElement('div');
    c.className = 'rhea_tab-card' + (tab.id===d.activeId ? ' active' : '');
    c.innerHTML = `
      <div class="rhea_tab-title">${tab.title}</div>
      <div class="rhea_tab-url">${tab.url}</div>
      <div class="rhea_tab-state"><span class="rhea_tab-dot"></span> ATIVA</div>
      <button class="kaos_tab-close" title="Fechar">×</button>
      <button class="rhea_tab-fav ${tab.fav?'active':''}" title="Fav">${tab.fav?'★':'☆'}</button>`;
    c.addEventListener('click', e=>{
      if(e.target.closest('.kaos_tab-close') || e.target.closest('.rhea_tab-fav')) return;
      rhea_set_active(win, tab.id);
      kaos_close_tabs();
    });
    c.querySelector('.kaos_tab-close').addEventListener('click', e=>{
      e.stopPropagation(); kaos_remove_tab(win, tab.id);
    });
    c.querySelector('.rhea_tab-fav').addEventListener('click', e=>{
      e.stopPropagation(); tab.fav = !tab.fav; rhea_render_tabs(win);
    });
    grid.appendChild(c);
  });
}

/* ─── build session ─── */
function genus_build_session(session){
  const win = document.createElement('article');
  win.className = "rhea_session-window genus_mxp-window";
  win.dataset.sessionId = session.id;
  win.dataset.type = "session";
  win.dataset.runtime = "nav";

  if(session.x !== undefined && session.y !== undefined){
    win.style.position = "fixed";
    win.style.left = session.x + "px";
    win.style.top  = session.y + "px";
    win.style.margin = "0";
    win.style.zIndex = "9600";
  }
  if(session.w) win.style.width = session.w + "px";
  if(session.h) win.style.height = session.h + "px";
  if(session.maximized) win.classList.add("atlas_maximized");
  if(session.minimized) win.classList.add("solus_minimized");
  if(session.collapsed) win.classList.add("kodux_collapsed");

  const url = session.url || "https://www.infodose.com.br/splash";

  win.innerHTML = `
    <div class="atlas_win-hdr" data-part="header">
      <div class="atlas_win-controls">
        <button type="button" data-action="collapse" title="Colapsar" aria-label="Colapsar">−</button>
        <button type="button" data-action="tab-switcher" class="rhea_tab-counter" title="Abas">1</button>
        <button type="button" data-action="maximize" title="Maximizar" aria-label="Maximizar">⛶</button>
        <button type="button" data-action="minimize" title="Minimizar" aria-label="Minimizar">۞</button>
        <button type="button" data-sn="run" title="Executar">▶</button>
        <button type="button" data-sn="close" title="Fechar">×</button>
      </div>
      <span class="genus_mxp-title" data-part="title" title="Toque 2× para renomear">${session.name}</span>
      <span class="rhea_state-badge">● active</span>
    </div>
    <div class="atlas_win-body">
      <div class="genus_win-slot-bar genus_slot" data-drop-target data-slot="session:${session.id}"></div>
      <iframe class="rhea_win-frame" data-runtime="nav" src="${url}"
        allow="autoplay; fullscreen; encrypted-media; picture-in-picture; clipboard-write"
        allowfullscreen loading="lazy"
        referrerpolicy="no-referrer-when-downgrade"></iframe>
    </div>
    <div class="atlas_resize-handle atlas_resize-y"></div>
    <div class="atlas_resize-handle atlas_resize-x"></div>
    <div class="atlas_resize-handle atlas_resize-corner"></div>`;

  win.querySelector('[data-sn="run"]').addEventListener('click', ()=>{
    const items = window.genus_mxp?.state?.slots?.["session:"+session.id] || [];
    if(!items.length){ window.pulse_toast("session vazia"); return; }
    items.forEach((it,i)=>setTimeout(
      ()=>window.genus_mxp?.fire?.(it.action,{slot:"session:"+session.id}),
      i*150
    ));
    window.pulse_toast(`executando ${items.length} ações`);
  });
  win.querySelector('[data-sn="close"]').addEventListener('click', ()=>{
    if(!confirm("Fechar session?")) return;
    window.genus_mxp?.removeSession?.(session.id);
    win.remove();
    rhea_refresh();
    if(kd_active === win) kd_active = null;
  });

  win.querySelectorAll('.atlas_win-controls [data-action]').forEach(btn=>{
    btn.addEventListener('click', (e)=>{
      if(e.defaultPrevented) return;
      if(window.__LEGACY_SESSION_BOUND) return;
      kodux_session_action(win, session, btn.dataset.action);
    });
  });

  const titleEl = win.querySelector('[data-part="title"]');
  let rt_titleLastTap = 0;
  titleEl.addEventListener('click', e=>{
    e.stopPropagation();
    const now = Date.now();
    if(now - rt_titleLastTap < 380){
      const novo = prompt("Nome da session:", session.name);
      if(novo && novo.trim()){
        session.name = novo.trim();
        titleEl.textContent = session.name;
        window.genus_mxp?.save?.();
        window.pulse_toast("renomeada");
      }
      rt_titleLastTap = 0;
    } else { rt_titleLastTap = now; }
  });

  atlas_attach_drag(win, session);
  atlas_attach_resize(win, session);
  win.addEventListener('pointerdown', ()=>atlas_front(win), {passive:true});
  aion_tabdata_get(win);
  aion_render_count(win);
  return win;
}

/* ─── session actions ─── */
function kodux_session_action(win, session, action){
  switch(action){
    case 'collapse':
      win.classList.toggle('kodux_collapsed');
      session.collapsed = win.classList.contains('kodux_collapsed');
      window.genus_mxp?.save?.();
      break;
    case 'maximize':
      win.classList.toggle('atlas_maximized');
      session.maximized = win.classList.contains('atlas_maximized');
      window.genus_mxp?.save?.();
      break;
    case 'minimize':
      window.kodux_minimize_to_dock(win, {
        title: session.name,
        onMinimize: ()=>{ session.minimized = true; window.genus_mxp?.save?.(); },
        onRestore:  ()=>{ session.minimized = false; window.genus_mxp?.save?.(); }
      });
      break;
    case 'tab-switcher':
      window.rhea_janelas?.open_tabs?.(win);
      break;
    case 'close':
      window.genus_mxp?.removeSession?.(session.id);
      win.remove();
      rhea_refresh();
      break;
  }
}

/* ─── drag ─── */
function atlas_attach_drag(win, session){
  const handle = win.querySelector('[data-part="header"]');
  if(!handle) return;
  let rt_drag = null;
  handle.addEventListener('pointerdown', (e)=>{
    if(e.target.closest('button')) return;
    if(e.target.closest('[data-part="title"]')) return;
    const r = win.getBoundingClientRect();
    rt_drag = {id:e.pointerId, sx:e.clientX, sy:e.clientY, ox:r.left, oy:r.top, moved:false};
    try{ handle.setPointerCapture(e.pointerId); }catch(_){}
  });
  handle.addEventListener('pointermove', (e)=>{
    if(!rt_drag || rt_drag.id !== e.pointerId) return;
    const dx = e.clientX - rt_drag.sx, dy = e.clientY - rt_drag.sy;
    if(!rt_drag.moved && Math.hypot(dx,dy) < 6) return;
    rt_drag.moved = true;
    win.classList.add('atlas_dragging');
    win.style.position = 'fixed';
    win.style.left = (rt_drag.ox + dx) + 'px';
    win.style.top  = (rt_drag.oy + dy) + 'px';
    win.style.zIndex = '9650';
    win.style.margin = '0';
  });
  const end = (e)=>{
    if(!rt_drag || (e && rt_drag.id !== e.pointerId)) return;
    win.classList.remove('atlas_dragging');
    if(rt_drag.moved){
      const r = win.getBoundingClientRect();
      session.x = r.left; session.y = r.top;
      window.genus_mxp?.save?.();
    }
    rt_drag = null;
  };
  handle.addEventListener('pointerup', end);
  handle.addEventListener('pointercancel', end);
}

/* ─── resize ─── */
function atlas_attach_resize(win, session){
  const bind = (handle, mode)=>{
    if(!handle) return;
    let rt_r = null;
    handle.addEventListener('pointerdown', (e)=>{
      if(win.classList.contains('atlas_maximized')) return;
      e.preventDefault(); e.stopPropagation();
      const rect = win.getBoundingClientRect();
      if(getComputedStyle(win).position !== 'fixed'){
        win.style.position = 'fixed';
        win.style.left = rect.left + 'px';
        win.style.top  = rect.top + 'px';
        win.style.margin = '0';
        win.style.zIndex = '9650';
      }
      win.style.width  = rect.width + 'px';
      win.style.height = rect.height + 'px';
      win.style.maxHeight = 'none';
      rt_r = {id:e.pointerId, sx:e.clientX, sy:e.clientY, w:rect.width, h:rect.height};
      try{ handle.setPointerCapture(e.pointerId); }catch(_){}
    });
    handle.addEventListener('pointermove', (e)=>{
      if(!rt_r || rt_r.id !== e.pointerId) return;
      const dx = e.clientX - rt_r.sx, dy = e.clientY - rt_r.sy;
      if(mode !== 'x'){ win.style.height = Math.max(180, rt_r.h + dy) + 'px'; }
      if(mode !== 'y'){ win.style.width  = Math.max(220, rt_r.w + dx) + 'px'; }
    });
    const end = (e)=>{
      if(!rt_r || (e && rt_r.id !== e.pointerId)) return;
      const rect = win.getBoundingClientRect();
      session.w = rect.width; session.h = rect.height;
      window.genus_mxp?.save?.();
      rt_r = null;
    };
    handle.addEventListener('pointerup', end);
    handle.addEventListener('pointercancel', end);
  };
  bind(win.querySelector('.atlas_resize-y'), 'y');
  bind(win.querySelector('.atlas_resize-x'), 'x');
  bind(win.querySelector('.atlas_resize-corner'), 'corner');
}

/* ─── render all sessions ─── */
function rhea_render_sessions(){
  if(!rhea_layer || !atlas_stack) return;
  rhea_layer.innerHTML = "";
  atlas_stack.innerHTML = "";
  const sessions = window.genus_mxp?.state?.sessions || [];
  sessions.forEach(s=>{
    const mode = rhea_hostfor(s);
    const host = atlas_getcontainer(mode);
    if(!host) return;
    const win = genus_build_session(s);
    host.appendChild(win);
    if(window.genus_mxp?.state?.slots)
      window.genus_mxp.state.slots["session:"+s.id] ??= [];
    window.genus_mxp?.renderSlot?.("session:"+s.id);
  });
  rhea_refresh();
}

/* ─── handlers ─── */
document.getElementById('kaos_tabclose')?.addEventListener('click', kaos_close_tabs);
document.getElementById('nova_newsession')?.addEventListener('click',
  ()=>window.genus_mxp?.createSession?.());
document.getElementById('rhea_togglehost')?.addEventListener('click', ()=>{
  const cur = document.body.dataset.sessionHost || 'float';
  const next = cur === 'float' ? 'stack' : 'float';
  document.body.dataset.sessionHost = next;
  (window.genus_mxp?.state?.sessions || []).forEach(s=>{
    if(!s.host) s.host = next;
    if(s.host === next){ s.x = undefined; s.y = undefined; }
  });
  window.genus_mxp?.save?.();
  rhea_render_sessions();
  window.pulse_toast('Host: ' + (next === 'stack' ? 'CLASSIC' : 'FLOATING'));
});
document.getElementById('atlas_urlbar')?.addEventListener('keydown', (e)=>{
  if(e.key === 'Enter') document.getElementById('atlas_gobtn')?.click();
});
document.getElementById('atlas_gobtn')?.addEventListener('click', ()=>{
  const inp = document.getElementById('atlas_urlbar');
  const url = inp.value.trim(); if(!url) return;
  if(!kd_active){ window.genus_mxp?.createSession?.(); return; }
  let u = url;
  if(!/^https?:\/\//i.test(u) && !u.startsWith('about:')) u = 'https://' + u;
  kd_active.querySelector('.rhea_win-frame').src = u;
  const a = rhea_active_tab(kd_active);
  if(a){ a.url = u; a.title = u.replace(/^https?:\/\//,'').split('/')[0]; }
  inp.value = u;
});

/* ─── exports ─── */
window.rhea_janelas = {
  get ativo(){ return kd_active; },
  front: atlas_front,
  render: rhea_render_sessions,
  open_tabs: rhea_open_tabs,
  close_tabs: kaos_close_tabs,
  build: genus_build_session,
  hostfor: rhea_hostfor,
  container: atlas_getcontainer,
  createWindow: (name="SESSION") => window.genus_mxp?.createSession?.(name)
};

console.log('[rhea-janelas] online · RHEA teceu as janelas');
})();

/* ══════════ §H MXP · γ-ui · genus-mxp.js ══════════ */
/* ═══════════════════════════════════════════════════════════
   §H · MXP · genus-mxp · A Fábrica de Botões
   Arquétipo: GENUS · Prefixo: genus_
   Depende: vd-store, rhea-janelas, kodux-dock
   ═══════════════════════════════════════════════════════════ */
(function(){
"use strict";
const vd_hold_ms    = 500;
const vd_tap_delay  = 240;
const vd_move_thresh = 12;
const vd_drag_thresh = 18;

const dv_q  = (s,r=document)=>r.querySelector(s);
const dv_qa = (s,r=document)=>[...r.querySelectorAll(s)];
const kodux_uid = (p="x")=>p+"_"+Date.now().toString(36)+Math.random().toString(36).slice(2,7);

/* ─── bridge data-action → função ─── */
const kodux_bridge = {
  "dual:theme-toggle": ()=>document.getElementById('lumine_tema')?.click(),
  "dual:theme-dot":    ()=>document.getElementById('lumine_tema')?.click(),
  "dual:drawer":       ()=>window.lumine_toggle_drawer?.('lumine_cockpit'),
  "drawer:open":       ()=>window.lumine_toggle_drawer?.('lumine_cockpit'),
  "dual:new-session":  ()=>nova_create_session('SESSION'),
  "dual:win-max":      ()=>{ const w=genus_active_win(); w?.__max?.(); },
  "dual:win-min":      ()=>{ const w=genus_active_win(); w?.__min?.(); },
  "dual:win-close":    ()=>{ const w=genus_active_win(); w?.__close?.(); },
  "dual:win-tabs":     ()=>{ const w=genus_active_win(); if(w) window.rhea_janelas?.open_tabs?.(w); },
  "dual:focus-url":    ()=>{ document.getElementById('atlas_urlbar')?.focus(); },
  "dual:win-collapse": ()=>{ const w=genus_active_win(); w?.__collapse?.(); },
  "nav:go":            ()=>{ const u=document.getElementById('atlas_urlbar')?.value?.trim(); if(u) document.getElementById('atlas_gobtn')?.click(); },
  "nav:next":          ()=>{ document.getElementById('vitalis_step')?.click(); },
  "session:new":       ()=>nova_create_session('SESSION'),

  "session:collapse":  (ctx)=>{
    const s = document.activeElement?.closest('.genus_app > section.rhea_session-window')
           || ctx?.element?.closest('.genus_app > section.rhea_session-window')
           || ctx?.section;
    s?.classList.toggle('kodux_collapsed');
  },
  "session:maximize":  (ctx)=>{
    const s = document.activeElement?.closest('.genus_app > section.rhea_session-window')
           || ctx?.element?.closest('.genus_app > section.rhea_session-window')
           || ctx?.section;
    s?.classList.toggle('atlas_maximized');
  },
  "session:minimize":  (ctx)=>{
    const s = document.activeElement?.closest('.genus_app > section.rhea_session-window')
           || ctx?.element?.closest('.genus_app > section.rhea_session-window')
           || ctx?.section;
    if(s) window.kodux_minimize_to_dock?.(s, { title: s.dataset.sessionTitle });
  },
  "session:close":     (ctx)=>{
    const s = document.activeElement?.closest('.genus_app > section.rhea_session-window')
           || ctx?.element?.closest('.genus_app > section.rhea_session-window')
           || ctx?.section;
    s?.classList.add('solus_minimized');
  },

  "theme:toggle":      ()=>document.getElementById('lumine_tema')?.click(),
  "notif:open":        ()=>window.pulse_toast?.('Sem notificações'),
  "media:play":        ()=>{ const nb=window.solus_nebula; if(nb&&nb.hasSlices&&nb.hasSlices()) nb.toggleSpeech(); else window.bllue_actions?.speak(); },
  "media:pause":       ()=>{ if('speechSynthesis' in window && speechSynthesis.paused===false) speechSynthesis.pause(); },
  "media:stop":        ()=>{ window.solus_nebula?.stopSpeech?.(); window.bllue_actions?.stop?.(); },
  "media:next":        ()=>window.solus_nebula?.nextSlice?.(),
  "media:prev":        ()=>window.solus_nebula?.previousSlice?.(),
  "nebula:speak":      ()=>{ const nb=window.solus_nebula; if(nb&&nb.hasSlices&&nb.hasSlices()) nb.toggleSpeech(); else window.bllue_actions?.speak(); },
  "nebula:import":     ()=>document.getElementById('artemis_import')?.click(),
  "nebula:paste":      ()=>{ const t=prompt('Cole:'); if(t) window.solus_nebula?.loadDocument(t,'Colado'); },
  "nebula:clear":      ()=>window.solus_nebula?.clear?.(),
  "dialog:generate":   ()=>document.getElementById('nova_generate')?.click(),
  "dialog:step":       ()=>document.getElementById('vitalis_step')?.click(),
  "dialog:clear":      ()=>document.getElementById('kaos_clear')?.click(),
  "dialog:copy":       ()=>document.getElementById('rhea_copy')?.click(),
  "dialog:download":   ()=>document.getElementById('aion_download')?.click(),
  "orb:next":          ()=>{ const o=document.getElementById('kobllux_orb'); if(o){ o.dispatchEvent(new PointerEvent('pointerdown',{bubbles:true})); setTimeout(()=>o.dispatchEvent(new PointerEvent('pointerup',{bubbles:true})),10); } },
  "orb:wheel":         ()=>document.getElementById('kobllux_wheel')?.classList.add('open'),
  "orb:theme":         ()=>{ const cur=document.body.dataset.voiceArch||'jesus'; const next=(cur==='jesus')?'kodux':'jesus'; const r=document.getElementById('kobllux_orb')?.getBoundingClientRect(); window.jesus_apply(next,{x:(r?.left+r?.width/2||0)/innerWidth*100,y:(r?.top+r?.height/2||0)/innerHeight*100}); window.__sbSync?.(next); },
  "aside:toggle":      ()=>document.getElementById('kobllux_symbar')?.classList.toggle('collapsed'),
  "factory:open":      ()=>genus_open_factory(),
  "factory:close":     ()=>kaos_close_factory(),
  "slot:clear":        (ctx)=>{ const s=ctx?.slot||"loose"; if(kd_mxpstate.slots[s]){ kd_mxpstate.slots[s]=[]; genus_save(); genus_render_slot(s); genus_toast(`"${s}" limpo`); } },
  "state:reset":       ()=>{ if(!confirm("Resetar MXP?")) return; kd_mxpstate=genus_default_state(); genus_save(); genus_render_all(); genus_toast("estado resetado"); },
  "extras:import-slicer":   ()=>document.getElementById('artemis_import')?.click(),
  "extras:paste-slicer":    ()=>{ const t=prompt('Cole:'); if(t) window.solus_nebula?.loadDocument(t,'Colado'); },
  "extras:generate":        ()=>document.getElementById('nova_generate')?.click(),
  "extras:toggle-carousel": ()=>document.getElementById('kobllux_symbar')?.classList.toggle('carousel-hidden')
};

/* ─── catálogo ─── */
const genus_catalog = [
  {category:"DUAL · SYSTEM", items:[["dual:theme-toggle","☼","TEMA"],["dual:drawer","🔅","COCKPIT"],["state:reset","⌦","RESET"]]},
  {category:"DUAL · WINDOW", items:[["dual:new-session","＋","NOVA"],["dual:win-max","⛶","MAX"],["dual:win-min","۞","MIN"],["dual:win-collapse","−","COLAPSO"],["dual:win-close","×","FECHAR"],["dual:win-tabs","⊞","ABAS"]]},
  {category:"SECTION WINDOW", items:[["session:collapse","−","COLAPSO"],["session:maximize","⛶","MAX"],["session:minimize","۞","MIN"],["session:close","×","FECHAR"]]},
  {category:"NEBULA", items:[["nebula:speak","🎙","SPEAK"],["nebula:import","⌲","IMPORT"],["nebula:paste","✎","PASTE"],["nebula:clear","⌫","CLEAR"]]},
  {category:"DIALOGUE", items:[["dialog:generate","⇄","GERAR"],["dialog:step","→","+15"],["dialog:copy","⧉","COPY"],["dialog:download","↓","DL"],["dialog:clear","×","CLEAR"]]},
  {category:"MEDIA", items:[["media:play","▶","PLAY"],["media:pause","Ⅱ","PAUSE"],["media:stop","■","STOP"],["media:next","›","NEXT"],["media:prev","‹","PREV"]]},
  {category:"MXP", items:[["factory:open","◈","FACTORY"],["aside:toggle","☰","TOGGLE"],["session:new","◉","SESSION"]]},
  {category:"ORB", items:[["orb:next","◉","NEXT"],["orb:wheel","∆","WHEEL"],["orb:theme","◐","THEME"]]}
];

/* ─── estado ─── */
function genus_default_state(){
  return {version:13, slots:{header:[], aside:[], footer:[], loose:[]}, sessions:[]};
}
let kd_mxpstate = window.aion_store
  ? (window.aion_store.ler(window.vd_keys.genus_mxp, null) || genus_default_state())
  : genus_default_state();

const genus_save = ()=>{
  if(window.aion_store) window.aion_store.gravar(window.vd_keys.genus_mxp, kd_mxpstate);
};
function genus_toast(msg){ window.pulse_toast ? window.pulse_toast(msg) : null; }
function genus_hud(msg){
  const el = dv_q("#genus_hud"); if(!el) return;
  if(msg){ el.textContent = msg; el.classList.add("genus_live"); }
  else el.classList.remove("genus_live");
}

/* ─── fire ─── */
function genus_fire(action, ctx={}){
  if(!action) return;
  if(kodux_bridge[action]){
    try{ kodux_bridge[action](ctx); }
    catch(e){ console.warn('genus_bridge',action,e); }
    return;
  }
  window.dispatchEvent(new CustomEvent("MXP_ACTION",{detail:{action,ctx}}));
  console.log("[genus-mxp] fire:", action);
}

/* ─── make button ─── */
function genus_make_button(item, slot){
  const b = document.createElement("button");
  b.type = "button";
  b.className = "genus_btn";
  if(slot === "__factory__") b.classList.add("genus_factory-slot");
  else if(slot.startsWith("session:")) b.classList.add("rhea_session-slot");
  else b.classList.add("genus_slot-"+slot);
  b.dataset.id = item.id || kodux_uid("btn");
  b.dataset.action = item.action || "";
  b.dataset.label  = item.label || "";
  b.dataset.icon   = item.icon || "";
  b.dataset.slot   = slot;
  if(item.binding) b.dataset.binding = item.binding;
  b.title = `${item.label} · ${item.action}`;
  b.innerHTML = `<span class="genus_icon">${item.icon||"•"}</span><span class="genus_label">${item.label||""}</span>`;
  if(item.binding) b.classList.add("kodux_bound");
  return b;
}
function genus_item_from_btn(btn){
  return {
    id: btn.dataset.id, action: btn.dataset.action,
    label: btn.dataset.label, icon: btn.dataset.icon,
    binding: btn.dataset.binding||""
  };
}

/* ─── render ─── */
function genus_render_slot(slot){
  const el = document.querySelector(`[data-slot="${slot}"]`); if(!el) return;
  el.innerHTML = "";
  (kd_mxpstate.slots[slot]||[]).forEach(it=>el.appendChild(genus_make_button(it, slot)));
}
function genus_render_factory(){
  const root = dv_q("#genus_catalog"); if(!root) return;
  root.innerHTML = "";
  genus_catalog.forEach(cat=>{
    const wrap = document.createElement("section"); wrap.className = "genus_cat";
    wrap.innerHTML = `<div class="genus_cat-name">${cat.category}</div>`;
    const grid = document.createElement("div"); grid.className = "genus_cat-grid";
    cat.items.forEach(([action,icon,label])=>{
      grid.appendChild(genus_make_button({id:kodux_uid("factory"), action, icon, label}, "__factory__"));
    });
    wrap.appendChild(grid); root.appendChild(wrap);
  });
}
function genus_render_sessions(){ window.rhea_janelas?.render?.(); }
function genus_render_all(){
  genus_render_factory();
  genus_render_slot("header");
  genus_render_slot("aside");
  genus_render_slot("footer");
  genus_render_slot("loose");
  genus_render_sessions();
}

/* ─── sessions ─── */
function nova_create_session(name="SESSION"){
  const host = document.body.dataset.sessionHost === 'stack' ? 'stack' : 'float';
  const s = {
    id: kodux_uid("session"),
    name,
    url: "https://www.infodose.com.br/splash",
    host
  };
  kd_mxpstate.sessions.push(s);
  kd_mxpstate.slots["session:"+s.id] = [];
  genus_save();
  genus_render_sessions();
  genus_toast(`session "${name}" criada`);
  return s;
}
function kaos_remove_session(id){
  kd_mxpstate.sessions = kd_mxpstate.sessions.filter(s=>s.id !== id);
  delete kd_mxpstate.slots["session:"+id];
  genus_save();
}
function genus_active_win(){
  const wins = dv_qa(".genus_mxp-window:not(.solus_minimized)");
  if(!wins.length) return null;
  let best = wins[0], bestZ = 0;
  wins.forEach(w=>{
    const z = parseInt(getComputedStyle(w).zIndex)||0;
    if(z >= bestZ){ bestZ = z; best = w; }
  });
  return best;
}

/* ─── slots ─── */
function genus_add_slot(item, slot){
  kd_mxpstate.slots[slot] ??= [];
  const copy = {...item, id: item.id || kodux_uid("btn")};
  kd_mxpstate.slots[slot].push(copy);
  genus_save();
  genus_render_slot(slot);
  genus_toast(`+ ${copy.label || copy.action} → ${slot}`);
}
function kaos_remove_item(id, slot){
  if(!kd_mxpstate.slots[slot]) return;
  kd_mxpstate.slots[slot] = kd_mxpstate.slots[slot].filter(x=>x.id !== id);
  genus_save();
  genus_render_slot(slot);
  genus_toast("removido");
}
function rhea_move_item(id, from, to){
  if(from === to) return;
  const list = kd_mxpstate.slots[from]||[];
  const i = list.findIndex(x=>x.id === id);
  if(i < 0) return;
  const item = list.splice(i,1)[0];
  kd_mxpstate.slots[to] ??= [];
  kd_mxpstate.slots[to].push(item);
  genus_save();
  genus_render_slot(from);
  genus_render_slot(to);
  genus_toast(`movido → ${to}`);
}

/* ─── gestos ─── */
let rt_gesture = null;
let rt_pendingtap = null;

function pulse_flush_tap(){
  if(!rt_pendingtap) return;
  clearTimeout(rt_pendingtap.timer);
  const p = rt_pendingtap; rt_pendingtap = null;
  p.btn.classList.remove("genus_firing");
  genus_fire(p.item.action, {element: p.btn, slot: p.slot});
}

document.addEventListener("pointerdown", e=>{
  const btn = e.target.closest(".genus_btn"); if(!btn) return;
  if(btn.closest("[data-win-action]")) return;
  if(e.pointerType === "mouse" && e.button !== 0) return;

  rt_gesture = {
    btn, pointerId: e.pointerId,
    startX: e.clientX, startY: e.clientY,
    x: e.clientX, y: e.clientY,
    slot: btn.dataset.slot,
    item: genus_item_from_btn(btn),
    dragging: false, timer: null, ghost: null, dualHover: null
  };
  btn.classList.add("genus_holding");
  rt_gesture.timer = setTimeout(genus_start_drag, vd_hold_ms);
}, {passive:true});

document.addEventListener("pointermove", e=>{
  if(!rt_gesture || rt_gesture.pointerId !== e.pointerId) return;
  rt_gesture.x = e.clientX; rt_gesture.y = e.clientY;
  const dx = e.clientX - rt_gesture.startX;
  const dy = e.clientY - rt_gesture.startY;
  if(!rt_gesture.dragging && Math.hypot(dx,dy) > vd_move_thresh){
    clearTimeout(rt_gesture.timer);
    rt_gesture.btn.classList.remove("genus_holding");
    rt_gesture = null; return;
  }
  if(!rt_gesture.dragging) return;
  e.preventDefault();
  genus_move_ghost(e.clientX, e.clientY);
  genus_update_drops(e.clientX, e.clientY);
  genus_update_duals(e.clientX, e.clientY);
}, {passive:false});

document.addEventListener("pointerup", e=>{
  if(!rt_gesture || rt_gesture.pointerId !== e.pointerId) return;
  clearTimeout(rt_gesture.timer);
  if(rt_gesture.dragging){
    const moved = Math.hypot(
      e.clientX - rt_gesture.startX,
      e.clientY - rt_gesture.startY
    ) > vd_drag_thresh;
    if(moved) genus_finish_drag(e.clientX, e.clientY);
    else { kaos_cleanup_drag(); rt_gesture = null; }
    return;
  }
  const btn = rt_gesture.btn;
  const slot = rt_gesture.slot;
  const item = rt_gesture.item;
  btn.classList.remove("genus_holding");
  rt_gesture = null;
  pulse_handle_tap(btn, slot, item);
}, {passive:true});

document.addEventListener("pointercancel", ()=>{
  if(!rt_gesture) return;
  clearTimeout(rt_gesture.timer);
  rt_gesture.btn.classList.remove("genus_holding","genus_source");
  kaos_cleanup_drag(); genus_hud(""); rt_gesture = null;
});

function pulse_handle_tap(btn, slot, item){
  if(slot === "__factory__"){
    genus_add_slot({...item, id: kodux_uid("btn")}, "loose");
    return;
  }
  if(rt_pendingtap && rt_pendingtap.btn === btn){
    clearTimeout(rt_pendingtap.timer);
    rt_pendingtap.btn.classList.remove("genus_firing");
    rt_pendingtap = null;
    genus_open_ctx(btn, slot); return;
  }
  if(rt_pendingtap){ pulse_flush_tap(); }
  btn.classList.add("genus_firing");
  const timer = setTimeout(()=>{
    if(rt_pendingtap && rt_pendingtap.btn === btn){
      rt_pendingtap = null;
      btn.classList.remove("genus_firing");
      genus_fire(item.action, {element: btn, slot});
    }
  }, vd_tap_delay);
  rt_pendingtap = {btn, timer, item, slot};
}

function genus_start_drag(){
  if(!rt_gesture) return;
  if(rt_pendingtap && rt_pendingtap.btn === rt_gesture.btn){
    clearTimeout(rt_pendingtap.timer);
    rt_pendingtap.btn.classList.remove("genus_firing");
    rt_pendingtap = null;
  }
  rt_gesture.dragging = true;
  rt_gesture.btn.classList.remove("genus_holding");
  rt_gesture.btn.classList.add("genus_source");
  document.body.classList.add("genus_mxp-dragging");
  const trash = dv_q("#kaos_trash");
  if(trash) trash.classList.add("genus_active");
  genus_hud("segure · solte em slot OU sobre DUAL tracejado");
  const ghost = document.createElement("div");
  ghost.id = "genus_ghost";
  ghost.textContent = rt_gesture.item.icon || "•";
  document.body.appendChild(ghost);
  rt_gesture.ghost = ghost;
  requestAnimationFrame(()=>ghost.classList.add("genus_live"));
  genus_move_ghost(rt_gesture.x, rt_gesture.y);
  if(navigator.vibrate) try{navigator.vibrate(15)}catch(_){}
}

function genus_move_ghost(x,y){
  if(!rt_gesture?.ghost) return;
  rt_gesture.ghost.style.left = x + "px";
  rt_gesture.ghost.style.top  = y + "px";
}
function genus_get_drop(x,y){
  if(rt_gesture?.ghost) rt_gesture.ghost.style.display = "none";
  const el = document.elementFromPoint(x,y);
  if(rt_gesture?.ghost) rt_gesture.ghost.style.display = "grid";
  return el?.closest("[data-drop-target]");
}
function genus_get_dual(x,y){
  if(rt_gesture?.ghost) rt_gesture.ghost.style.display = "none";
  const el = document.elementFromPoint(x,y);
  if(rt_gesture?.ghost) rt_gesture.ghost.style.display = "grid";
  return el?.closest("[data-dual-target]");
}
function genus_update_drops(x,y){
  dv_qa("[data-drop-target]").forEach(el=>el.classList.remove("genus_drop-ready"));
  const trash = dv_q("#kaos_trash");
  if(trash) trash.classList.remove("genus_over");
  const t = genus_get_drop(x,y); if(!t) return;
  if(t.dataset.trash !== undefined){
    trash.classList.add("genus_over");
    genus_hud(`soltar para remover · ${rt_gesture.item.label||rt_gesture.item.action}`);
    return;
  }
  t.classList.add("genus_drop-ready");
  genus_hud(`soltar em · ${t.dataset.slot || "slot"}`);
}
function genus_update_duals(x,y){
  dv_qa("[data-dual-target].genus_dual-hover").forEach(el=>el.classList.remove("genus_dual-hover"));
  rt_gesture.dualHover = null;
  const d = genus_get_dual(x,y);
  if(d){
    d.classList.add("genus_dual-hover");
    rt_gesture.dualHover = d;
    genus_hud(`⛓ vincular a · ${d.dataset.dualAction || 'DUAL'}`);
  }
}
function genus_finish_drag(x,y){
  clearTimeout(rt_gesture.timer);
  const dualTarget = genus_get_dual(x,y);
  const target = genus_get_drop(x,y);

  if(dualTarget && rt_gesture.slot !== "__factory__" && !target){
    const dualAction = dualTarget.dataset.dualAction;
    const list = kd_mxpstate.slots[rt_gesture.slot]||[];
    const idx = list.findIndex(i=>i.id === rt_gesture.item.id);
    if(idx >= 0){
      list[idx].binding = dualAction;
      list[idx].action  = "dual:" + dualAction;
      genus_save();
      genus_render_slot(rt_gesture.slot);
      genus_toast(`⛓ vinculado a ${dualAction}`);
    }
    kaos_cleanup_drag(); rt_gesture = null; return;
  }

  if(target && target.dataset.trash !== undefined){
    if(rt_gesture.slot !== "__factory__")
      kaos_remove_item(rt_gesture.item.id, rt_gesture.slot);
    kaos_cleanup_drag(); rt_gesture = null; return;
  }

  if(target){
    const to = target.dataset.slot;
    if(rt_gesture.slot === "__factory__")
      genus_add_slot({...rt_gesture.item, id: kodux_uid("btn")}, to);
    else
      rhea_move_item(rt_gesture.item.id, rt_gesture.slot, to);
    kaos_cleanup_drag(); rt_gesture = null; return;
  }

  kaos_cleanup_drag(); rt_gesture = null;
}
function kaos_cleanup_drag(){
  if(!rt_gesture) return;
  rt_gesture.btn.classList.remove("genus_source");
  rt_gesture.ghost?.remove(); rt_gesture.ghost = null;
  const trash = dv_q("#kaos_trash");
  if(trash) trash.classList.remove("genus_active","genus_over");
  dv_qa("[data-drop-target]").forEach(el=>el.classList.remove("genus_drop-ready"));
  dv_qa("[data-dual-target].genus_dual-hover").forEach(el=>el.classList.remove("genus_dual-hover"));
  document.body.classList.remove("genus_mxp-dragging");
  genus_hud("");
}

/* ─── context menu ─── */
let genus_ctx_item = null;
function genus_open_ctx(btn, slot){
  if(slot === "__factory__") return;
  genus_ctx_item = {btn, item: genus_item_from_btn(btn), slot};
  const menu = dv_q("#genus_context");
  const head = dv_q("#genus_ctxhead");
  if(head) head.textContent = genus_ctx_item.item.label || genus_ctx_item.item.action;
  const r = btn.getBoundingClientRect();
  menu.style.left = Math.min(window.innerWidth-190, Math.max(10, r.left)) + "px";
  menu.style.top  = Math.min(window.innerHeight-220, r.bottom+8) + "px";
  menu.classList.add("genus_open");
}
function kaos_close_ctx(){
  dv_q("#genus_context").classList.remove("genus_open");
  genus_ctx_item = null;
}
dv_q("#genus_context")?.addEventListener("click", e=>{
  const a = e.target.closest("[data-context-action]")?.dataset.contextAction;
  if(!a || !genus_ctx_item) return;
  const {item, slot} = genus_ctx_item;
  if(a === "fire")      genus_fire(item.action, {item, slot});
  if(a === "duplicate") genus_add_slot({...item, id: kodux_uid("copy"), binding:""}, slot);
  if(a === "unbind"){
    const list = kd_mxpstate.slots[slot]||[];
    const i = list.findIndex(x=>x.id === item.id);
    if(i >= 0){ list[i].binding = ""; genus_save(); genus_render_slot(slot); genus_toast("desvinculado"); }
  }
  if(a === "favorite"){
    const s = nova_create_session("fav:" + (item.label || item.action));
    genus_add_slot({...item, id: kodux_uid("fav")}, "session:"+s.id);
  }
  if(a === "remove") kaos_remove_item(item.id, slot);
  kaos_close_ctx();
});
document.addEventListener("pointerdown", e=>{
  if(dv_q("#genus_context").classList.contains("genus_open")
     && !e.target.closest("#genus_context")) kaos_close_ctx();
});

/* ─── factory ─── */
function genus_open_factory(){ dv_q("#genus_factory").classList.add("genus_open"); }
function kaos_close_factory(){ dv_q("#genus_factory").classList.remove("genus_open"); }
window.genus_open_factory = genus_open_factory;
dv_q("#genus_factory")?.addEventListener("click", e=>{
  if(e.target.id === "genus_factory") kaos_close_factory();
});
document.addEventListener("keydown", e=>{
  if((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === "b"){
    e.preventDefault();
    const f = dv_q("#genus_factory");
    if(f) f.classList.toggle("genus_open");
  }
  if(e.key === "Escape"){ kaos_close_factory(); kaos_close_ctx(); }
});

/* ─── seed inicial ─── */
function genus_seed(){
  const empty = !kd_mxpstate.slots.header?.length
    && !kd_mxpstate.slots.aside?.length
    && !kd_mxpstate.slots.footer?.length
    && !kd_mxpstate.slots.loose?.length
    && !kd_mxpstate.sessions.length;
  if(!empty) return;
  kd_mxpstate.slots.header = [
    {id:kodux_uid("s"), action:"dual:theme-toggle", icon:"☼", label:"TEMA"}
  ];
  kd_mxpstate.slots.aside = [
    {id:kodux_uid("s"), action:"extras:import-slicer", icon:"⌲", label:"SLICER"},
    {id:kodux_uid("s"), action:"extras:paste-slicer", icon:"✎", label:"COLAR"},
    {id:kodux_uid("s"), action:"extras:generate", icon:"⇄", label:"GERAR"},
    {id:kodux_uid("s"), action:"extras:toggle-carousel", icon:"◈", label:"ARQ."}
  ];
  kd_mxpstate.slots.footer = [
    {id:kodux_uid("s"), action:"factory:open", icon:"◈", label:"FACTORY"},
    {id:kodux_uid("s"), action:"dual:drawer", icon:"🔅", label:"COCKPIT"}
  ];
  kd_mxpstate.slots.loose = [
    {id:kodux_uid("s"), action:"dual:new-session", icon:"＋", label:"NOVA"},
    {id:kodux_uid("s"), action:"state:reset", icon:"⌦", label:"RESET"}
  ];
  genus_save();
}

genus_seed();
genus_render_all();

/* ─── exports ─── */
window.genus_mxp = {
  get state(){ return kd_mxpstate; },
  catalog: genus_catalog,
  fire: genus_fire,
  createSession: nova_create_session,
  removeSession: kaos_remove_session,
  addToSlot: genus_add_slot,
  removeItem: kaos_remove_item,
  moveItem: rhea_move_item,
  toast: genus_toast,
  save: genus_save,
  render: genus_render_all,
  renderSlot: genus_render_slot,
  renderSessions: genus_render_sessions,
  reset(){ kd_mxpstate = genus_default_state(); genus_save(); genus_render_all(); },
  openFactory: genus_open_factory,
  closeFactory: kaos_close_factory
};

console.log('[genus-mxp] online · GENUS forjou a fábrica');
})();

/* ══════════ §SAVE · δ-tempo · aion-save.js ══════════ */

/* ═══════════════════════════════════════════════════════════
   §SAVE · aion-save · O Carimbo do Tempo
   Arquétipo: AION · Prefixo: aion_
   Depende: vd-store, vd-arquétipos, vitalis-diálogo, solus-nebula, genus-mxp
   ═══════════════════════════════════════════════════════════ */
(function(){
"use strict";
const dv_q = s => document.querySelector(s);

/* ─── SAVE ─── */
window.aion_save = function(){
  try{
    const K = window.vd_keys;
    window.aion_store.gravar(K.lumine_ui, {
      mode: document.body.className,
      voiceArch: document.body.dataset.voiceArch,
      sessionHost: document.body.dataset.sessionHost,
      sb: window.__sbGetPos ? window.__sbGetPos() : null
    });
    window.aion_store.gravar(K.jesus_arch, window.jesus_arch ? window.jesus_arch() : "JESUS");
    window.aion_store.gravar(K.lumine_bg, window.serena_bgstate || {});
    window.aion_store.gravar(K.serena_user, {
      id: document.getElementById('serena_userid')?.value || "",
      model: document.getElementById('kodux_model')?.value || "",
      lastUrl: document.getElementById('atlas_urlbar')?.value || ""
    });
    if(window.vitalis_state){
      const st = window.vitalis_state;
      window.aion_store.gravar(K.pulse_dlg, {
        units: st.units, index: st.index, cycle: st.cycle,
        history: st.history, bank: st.bank,
        sourceText: document.getElementById('nova_source')?.value || ""
      });
    }
    if(window.solus_nebula?.state){
      window.aion_store.gravar(K.solus_nbl, {
        raw: window.solus_nebula.state.raw || "",
        title: window.solus_nebula.state.title || ""
      });
    }
    if(window.genus_mxp?.state){
      window.aion_store.gravar(K.genus_mxp, window.genus_mxp.state);
    }
    window.aion_store.gravar(K.jesus_root, {v:13, ts:Date.now(), NS:window.vd_ns});
    const snap = {};
    Object.entries(K).forEach(([k,key])=>{
      if(k !== "aion_bkp"){
        const v = window.aion_store.ler(key);
        if(v != null) snap[k] = v;
      }
    });
    window.aion_store.gravar(K.aion_bkp, snap);
  }catch(e){ console.warn('aion_save error', e); }
};

/* ─── LOAD ─── */
window.aion_load = function(){
  try{
    const K = window.vd_keys;
    const rootIdx = window.aion_store.ler(K.jesus_root);
    if(!rootIdx) return false;

    const ui = window.aion_store.ler(K.lumine_ui);
    if(ui){
      if(ui.mode) document.body.className = ui.mode;
      if(ui.sessionHost) document.body.dataset.sessionHost = ui.sessionHost;
      if(ui.sb && window.__sbRestore) window.__sbRestore(ui.sb);
      if(ui.voiceArch && window.jesus_apply) window.jesus_apply(ui.voiceArch);
    }
    const arch = window.aion_store.ler(K.jesus_arch);
    if(arch && window.jesus_apply) window.jesus_apply(arch);

    const bg = window.aion_store.ler(K.lumine_bg);
    if(bg){
      window.serena_bgstate = bg;
      if(window.serena_apply_bg) window.serena_apply_bg();
    }

    const user = window.aion_store.ler(K.serena_user);
    if(user){
      const iu = document.getElementById('serena_userid');
      if(iu && user.id) iu.value = user.id;
      const im = document.getElementById('kodux_model');
      if(im && user.model) im.value = user.model;
      const lu = document.getElementById('atlas_urlbar');
      if(lu && user.lastUrl) lu.value = user.lastUrl;
    }

    const mxp = window.aion_store.ler(K.genus_mxp);
    if(mxp && window.genus_mxp){
      Object.assign(window.genus_mxp.state, mxp);
      window.genus_mxp.render();
    }

    const dialog = window.aion_store.ler(K.pulse_dlg);
    if(dialog && window.aion_rebuild_dialogue) window.aion_rebuild_dialogue(dialog);

    const nebula = window.aion_store.ler(K.solus_nbl);
    if(nebula?.raw && window.solus_nebula)
      window.solus_nebula.loadDocument(nebula.raw, nebula.title || "Documento");

    return true;
  }catch(e){ console.warn('aion_load error', e); return false; }
};

/* ─── auto-save ─── */
window.addEventListener('beforeunload', ()=>window.aion_save());

/* ─── export ─── */
document.getElementById('aion_export')?.addEventListener('click', ()=>{
  window.aion_save();
  const snap = window.aion_store.ler(window.vd_keys.aion_bkp) || {};
  const blob = new Blob([JSON.stringify(snap, null, 2)], {type:'application/json'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `kobllux-backup-${Date.now()}.json`;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(()=>URL.revokeObjectURL(url), 1000);
  window.pulse_toast('Backup exportado ✓');
});

/* ─── import ─── */
document.getElementById('aion_import')?.addEventListener('click', ()=>{
  const inp = document.createElement('input');
  inp.type = 'file'; inp.accept = '.json,application/json';
  inp.addEventListener('change', async ()=>{
    const f = inp.files[0]; if(!f) return;
    try{
      const snap = JSON.parse(await f.text());
      if(!snap || !snap.jesus_root) return window.pulse_toast('Backup inválido');
      Object.entries(snap).forEach(([k,v])=>{
        const key = window.vd_keys[k];
        if(key) window.aion_store.gravar(key, v);
      });
      window.pulse_toast('Backup importado · recarregando…');
      setTimeout(()=>location.reload(), 500);
    }catch(_){ window.pulse_toast('Erro ao ler backup'); }
  });
  inp.click();
});

/* ─── reset ─── */
document.getElementById('kaos_reset')?.addEventListener('click', ()=>{
  if(!confirm('Apagar TUDO (MXP + backup + bg + arch + user)?')) return;
  window.aion_store.limparTudo();
  window.pulse_toast('Tudo apagado · recarregando…');
  setTimeout(()=>location.reload(), 500);
});

/* ─── boot restore ─── */
setTimeout(()=>{
  if(window.aion_load()) console.log('[aion-save] estado restaurado de kobllux:*');
  else console.log('[aion-save] sem backup, iniciando fresh');
}, 200);

console.log('[aion-save] online · AION carimbou o tempo');
})();


/* ══════════ §LEGACY · ε-bridge · kodux-legacy.js ══════════ */
/* ═══════════════════════════════════════════════════════════
   §LEGACY · kodux-legacy · O Detector da Ponte
   Arquétipo: KODUX · Prefixo: kodux_
   Depende: genus-mxp, rhea-janelas, kodux-section-adapter
   ═══════════════════════════════════════════════════════════ */
(function(){
"use strict";

/* ─── 1 · detectar se legacy (iFSw) está ativo ─── */
window.__LEGACY_SESSION_BOUND =
  !!(window.iFSw || window.IFSW || window.InfodoseBase || window.SessionWindow);

console.log('[kodux-legacy] legacy-bound =', window.__LEGACY_SESSION_BOUND);

/* ─── 2 · garantir host stack ─── */
(function kodux_ensure_stack_host(){
  if(document.getElementById('rhea_stack')) return;
  const wrap = document.createElement('div');
  wrap.id = 'rhea_stack';
  wrap.dataset.sessionHost = 'stack';
  const shell = document.querySelector('.genus_almasliber .genus_shell');
  if(shell) shell.appendChild(wrap);
  console.log('[kodux-legacy] rhea_stack criado no shell');
})();

/* ─── 3 · se legacy existir, delegar createSession ─── */
(function kodux_bridge_create(){
  const _orig = window.genus_mxp?.createSession?.bind(window.genus_mxp);

  if(_orig && window.__LEGACY_SESSION_BOUND && typeof window.createSession === 'function'){
    window.genus_mxp.createSession = function(name){
      try{
        const s = _orig(name);
        document.dispatchEvent(new CustomEvent('mxp:session-created', {detail:{session:s}}));
        return s;
      }catch(e){
        console.warn('[kodux-legacy] createSession legacy', e);
        return _orig(name);
      }
    };
    console.log('[kodux-legacy] createSession delegado ao legacy');
  }
})();

/* ─── 4 · ouvir eventos do legacy ─── */
['ifsw:session-open', 'legacy:session-open', 'session:open'].forEach(ev=>{
  document.addEventListener(ev, e=>{
    const url = e.detail?.url;
    if(url && window.genus_mxp?.createSession){
      window.genus_mxp.createSession(e.detail?.name || 'legacy');
    }
  });
});

/* ─── 5 · sincronizar URL bar ─── */
document.getElementById('atlas_gobtn')?.addEventListener('click', ()=>{
  const inp = document.getElementById('atlas_urlbar');
  const url = inp?.value?.trim();
  if(!url) return;
  const active = document.querySelector('.rhea_session-window:not(.solus_minimized) .rhea_win-frame');
  if(active){
    let u = url;
    if(!/^https?:\/\//i.test(u) && !u.startsWith('about:')) u = 'https://' + u;
    active.src = u;
  }
});

/* ─── 6 · reaplicar adapter para novas sections ─── */
window.addEventListener('load', ()=>{
  setTimeout(()=>window.kodux_section_adapter?.boot?.(), 100);
});

console.log('[kodux-legacy] online · a ponte está tecida');
})();

/* ══════════ §PARSER · ζ-render · genus-md-parser.js ══════════ */
/* ═══════════════════════════════════════════════════════════
   §RENDER · genus-md-parser · O Parser Markdown Rico
   Arquétipo: GENUS · Prefixo: genus_
   Hookado em: solus_nebula.loadDocument
   ═══════════════════════════════════════════════════════════ */
(function(){
"use strict";
if(window.genus_md_parser) return;

/* ─── escape ─── */
const kodux_esc = s => String(s ?? '')
  .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
  .replace(/"/g,'&quot;');

const kodux_autolink = u => {
  try{
    const x = new URL(u);
    return `<a href="${x.href}" target="_blank" rel="noopener">${x.href}</a>`;
  }catch{ return u; }
};

/* ─── inline ─── */
function genus_inline(s){
  let h = kodux_esc(s);
  h = h.replace(/!\[([^\]]*)\]\(([^)]+)\)/g,
    (_,a,src)=>`<img class="md-img" alt="${a}" src="${src}">`);
  h = h.replace(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g,
    (_,t,url)=>`<a href="${url}" target="_blank" rel="noopener">${t}</a>`);
  h = h.replace(/\[([^\]]+)\]\(action:([a-z0-9_:\-.]+)\)/gi,
    (_,t,a)=>`<button class="btn action" data-action="${a}">${t}</button>`);
  h = h.replace(/\[\[btn:([a-z0-9_:\-.]+)(?:\|([^\]]+))?\]\]/gi,
    (_,a,l)=>`<button class="btn action" data-action="${a}">${l||a}</button>`);
  h = h.replace(/`([^`]+)`/g, (_,c)=>`<code class="code-inline">${c}</code>`);
  h = h.replace(/\*\*([^*]+)\*\*/g,'<strong>$1</strong>');
  h = h.replace(/(^|[^*])\*([^*]+)\*(?!\*)/g,'$1<em>$2</em>');
  h = h.replace(/~~([^~]+)~~/g,'<del>$1</del>');
  h = h.replace(/\bhttps?:\/\/[^\s<)]+/g, kodux_autolink);
  return h;
}

/* ─── detectores ─── */
const dv_isHr        = l => /^\s*(?:---|\*\*\*|___)\s*$/.test(l);
const dv_isQuote     = l => /^\s*>\s?/.test(l);
const dv_isTableRow  = l => /^\s*\|.*\|\s*$/.test(l);
const dv_isFenceEnd  = l => /^\s*(?:```|''')\s*$/.test(l);

function artemis_listInfo(l){
  const m = l.match(/^(\s*)([-+*]|\d+\.)\s+(.*)$/);
  if(!m) return null;
  return {
    indent: m[1].replace(/\t/g,'    ').length,
    ordered: /^\d+\.$/.test(m[2]),
    text: m[3]
  };
}

function kodux_splitRow(l){
  let s = l.trim();
  if(s.startsWith('|')) s = s.slice(1);
  if(s.endsWith('|'))   s = s.slice(0,-1);
  return s.split('|').map(x=>x.trim());
}
const kodux_isSep = l => {
  const c = kodux_splitRow(l);
  return c.length && c.every(x=>/^:?-{3,}:?$/.test(x));
};

/* ─── parsers ─── */
function genus_parseTable(lines,start){
  const rows = []; let i = start;
  while(i < lines.length && dv_isTableRow(lines[i])){ rows.push(kodux_splitRow(lines[i])); i++; }
  if(rows.length < 2 || !kodux_isSep(lines[start+1])) return null;
  const header = rows[0], body = rows.slice(2);

  const t = document.createElement('table');
  t.className = 'md-table';
  const thead = document.createElement('thead');
  const trh = document.createElement('tr');
  header.forEach(c=>{
    const th = document.createElement('th');
    th.innerHTML = genus_inline(c); trh.appendChild(th);
  });
  thead.appendChild(trh); t.appendChild(thead);

  const tbody = document.createElement('tbody');
  body.forEach(r=>{
    const tr = document.createElement('tr');
    header.forEach((_,k)=>{
      const td = document.createElement('td');
      td.innerHTML = genus_inline(r[k]||''); tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });
  t.appendChild(tbody);

  const wrap = document.createElement('div');
  wrap.className = 'md-table-wrap';
  wrap.appendChild(t);
  return {node: wrap, next: i};
}

function genus_parseLists(lines,start){
  const first = artemis_listInfo(lines[start]);
  if(!first) return null;
  const root = document.createElement(first.ordered ? 'ol' : 'ul');
  root.className = 'md-list';

  const stack = [{indent:first.indent, ordered:first.ordered, list:root, lastLi:null}];
  let i = start;

  while(i < lines.length){
    const info = artemis_listInfo(lines[i]); if(!info) break;
    while(stack.length > 1 && info.indent < stack[stack.length-1].indent) stack.pop();
    let cur = stack[stack.length-1];

    if(info.indent > cur.indent && cur.lastLi){
      const nested = document.createElement(info.ordered ? 'ol' : 'ul');
      nested.className = 'md-list';
      cur.lastLi.appendChild(nested);
      stack.push({indent:info.indent, ordered:info.ordered, list:nested, lastLi:null});
      cur = stack[stack.length-1];
    } else if(info.indent === cur.indent && info.ordered !== cur.ordered && cur.lastLi){
      const nested = document.createElement(info.ordered ? 'ol' : 'ul');
      nested.className = 'md-list';
      cur.lastLi.appendChild(nested);
      stack.push({indent:info.indent, ordered:info.ordered, list:nested, lastLi:null});
      cur = stack[stack.length-1];
    }

    const li = document.createElement('li');
    const task = info.text.match(/^\[( |x|X)\]\s*(.*)$/);
    if(task){
      cur.list.classList.add('md-task');
      const box = document.createElement('input');
      box.type='checkbox'; box.checked=/x/i.test(task[1]); box.disabled = true;
      const span = document.createElement('span');
      span.innerHTML = genus_inline(task[2]);
      li.append(box, span);
    } else {
      li.innerHTML = genus_inline(info.text);
    }
    cur.list.appendChild(li);
    cur.lastLi = li;
    i++;
  }
  return {node: root, next: i};
}

function genus_parseFence(lines,start){
  const m = lines[start].match(/^\s*(?:```|''')([\w-]*)\s*$/);
  if(!m) return null;
  const lang = (m[1]||'').toLowerCase();
  const buf = []; let i = start + 1;
  while(i < lines.length && !dv_isFenceEnd(lines[i])){ buf.push(lines[i]); i++; }
  const raw = buf.join('\n');

  if(lang === 'html-raw'){
    const w = document.createElement('div');
    w.className = 'raw-html-card';
    w.innerHTML = raw;
    return {node:w, next: i < lines.length ? i+1 : i};
  }

  const pre = document.createElement('pre');
  pre.className = 'md-code';
  const code = document.createElement('code');
  if(lang) code.className = 'language-' + lang;
  code.textContent = raw;
  pre.appendChild(code);
  return {node:pre, next: i < lines.length ? i+1 : i};
}

/* ─── render principal ─── */
function genus_render_md(md){
  if(md == null) return '';
  const text = String(md);
  if(!text.trim()) return '';

  const lines = text.replace(/\r\n?/g,'\n').split('\n');
  const out = [];
  let i = 0, para = [];

  const flushP = () => {
    if(!para.length) return;
    const joined = para.join(' ').trim();
    if(joined){
      const p = document.createElement('p');
      p.innerHTML = genus_inline(joined);
      out.push(p.outerHTML);
    }
    para = [];
  };

  while(i < lines.length){
    const line = lines[i];
    if(!line.trim()){ flushP(); i++; continue; }

    const fence = genus_parseFence(lines, i);
    if(fence){ flushP(); out.push(fence.node.outerHTML); i = fence.next; continue; }

    const hm = line.match(/^(#{1,6})\s+(.*)$/);
    if(hm){
      flushP();
      const h = document.createElement('h' + hm[1].length);
      h.innerHTML = genus_inline(hm[2]);
      out.push(h.outerHTML); i++; continue;
    }

    if(i+1 < lines.length && /^[=-]{3,}\s*$/.test(lines[i+1]) && line.trim()){
      flushP();
      const lv = lines[i+1].trim()[0] === '=' ? 1 : 2;
      const h = document.createElement('h' + lv);
      h.innerHTML = genus_inline(line.trim());
      out.push(h.outerHTML); i += 2; continue;
    }

    if(dv_isHr(line)){ flushP(); out.push('<hr class="hr">'); i++; continue; }

    if(dv_isQuote(line)){
      flushP();
      const buf = [];
      while(i < lines.length && dv_isQuote(lines[i])){
        buf.push(lines[i].replace(/^\s*>\s?/,''));
        i++;
      }
      const bq = document.createElement('blockquote');
      bq.className = 'bq';
      bq.innerHTML = '<span class="copy-hint">Copiar</span>' + genus_inline(buf.join(' '));
      out.push(bq.outerHTML); continue;
    }

    const call = line.match(/^\s*(::(info|warn|tip|note|success|danger)|::\.|:|\?)\s+(.*)$/i);
    if(call){
      let kind = 'note';
      if(call[1] === '::.') kind = 'aside';
      else if(call[1] === ':') kind = 'note';
      else if(call[1] === '?') kind = 'question';
      else kind = (call[2] || 'info').toLowerCase();

      const buf = [call[3]];
      let j = i + 1;
      while(j < lines.length){
        const nx = lines[j].trim();
        if(!nx) break;
        if(/^\s*(::(info|warn|tip|note|success|danger)|::\.|:|\?)\s+/.test(nx)) break;
        buf.push(nx); j++;
      }
      i = j;
      const d = document.createElement('div');
      d.className = 'callout ' + kind;
      d.innerHTML = '<span class="copy-hint">Copiar</span>' + genus_inline(buf.join(' '));
      out.push(d.outerHTML); continue;
    }

    if(dv_isTableRow(line)){
      const t = genus_parseTable(lines, i);
      if(t){ flushP(); out.push(t.node.outerHTML); i = t.next; continue; }
    }

    if(artemis_listInfo(line)){
      const l = genus_parseLists(lines, i);
      if(l){ flushP(); out.push(l.node.outerHTML); i = l.next; continue; }
    }

    para.push(line.trim());
    i++;
  }
  flushP();
  return out.join('\n');
}

/* ─── hook em solus_nebula.loadDocument ─── */
function genus_rerender_slices(){
  const Neb = window.solus_nebula;
  if(!Neb || !Neb.state || !Neb.state.slices) return;
  const slices = Neb.state.slices;
  if(!slices.length) return;
  const stage = document.getElementById('solus_stage');
  if(!stage) return;
  const bodies = stage.querySelectorAll('slice .solus_slice-body');
  bodies.forEach((body, i)=>{
    const raw = slices[i];
    if(raw == null) return;
    body.innerHTML = genus_render_md(raw);
  });
  if(window.artemis_enhance) window.artemis_enhance.decorate(stage);
}

function genus_install_hook(){
  const Neb = window.solus_nebula;
  if(!Neb || typeof Neb.loadDocument !== 'function') return false;
  if(Neb.__genusRichHooked) return true;
  Neb.__genusRichHooked = true;
  const _orig = Neb.loadDocument.bind(Neb);
  Neb.loadDocument = function(text, title){
    _orig(text, title);
    try{ genus_rerender_slices(); }
    catch(err){ console.warn('[genus-md-parser] re-render:', err); }
  };
  console.log('[genus-md-parser] hookado em solus_nebula.loadDocument ✓');
  return true;
}

if(!genus_install_hook()){
  let tries = 0;
  const t = setInterval(()=>{
    if(genus_install_hook() || ++tries > 60) clearInterval(t);
  }, 50);
}

if(document.readyState === 'loading'){
  document.addEventListener('DOMContentLoaded', ()=>{ genus_install_hook(); genus_rerender_slices(); }, {once:true});
} else {
  genus_install_hook();
  genus_rerender_slices();
}

/* ─── export ─── */
window.genus_md_parser = {
  render: genus_render_md,
  rerenderSlices: genus_rerender_slices,
  version: 1
};

console.log('[genus-md-parser] online · parser rico pronto');
})();

/* ══════════ §ENHANCE · ζ-render · artemis-enhance.js ══════════ */
/* ═══════════════════════════════════════════════════════════
   §ENHANCE · artemis-enhance · Enhancer de Slices
   Arquétipo: ARTEMIS · Prefixo: artemis_
   Depende: genus-md-parser
   ═══════════════════════════════════════════════════════════ */
(function(){
"use strict";
if(window.__ARTEMIS_ENHANCE__) return;
window.__ARTEMIS_ENHANCE__ = true;

const solus_stage = document.getElementById('solus_stage') || document.body;

/* ─── 1) envolve listas em .list-card ─── */
function artemis_wrap_lists(root){
  root.querySelectorAll('.md-list').forEach(el=>{
    if(el.closest('.list-card, .ascii-card, .no-beauty')) return;
    if(el.parentElement?.closest('.md-list')) return;
    if(el.parentElement?.classList.contains('list-card')) return;
    const wrap = document.createElement('div');
    wrap.className = 'list-card';
    el.parentNode.insertBefore(wrap, el);
    wrap.appendChild(el);
  });
}

/* ─── 2) promove ASCII para .ascii-card ─── */
function artemis_enhance_ascii(root){
  root.querySelectorAll('pre.md-code, pre').forEach(pre=>{
    if(pre.closest('.ascii-card, .no-beauty')) return;
    const t = (pre.textContent || '').trim();
    if(!t) return;
    const boxChars = (t.match(/[─│┌┐└┘╭╮╰╯═╬╠╣╦╩]/g) || []).length;
    const gridLike = /[-_=+*#\\/|]{3,}/.test(t);
    const multiline = t.split('\n').length >= 2;
    if(boxChars >= 4 || (multiline && gridLike && boxChars >= 1)){
      const fig = document.createElement('figure');
      fig.className = 'ascii-card';
      const p = document.createElement('pre');
      p.textContent = t;
      fig.appendChild(p);
      pre.replaceWith(fig);
    }
  });
}

/* ─── 3) click em copy-hint ─── */
document.addEventListener('click', async e=>{
  const host = e.target.closest('#solus_reader .md-code, #solus_reader .bq, #solus_reader .callout');
  if(!host) return;
  if(!host.querySelector('.copy-hint')) return;
  if(e.target.closest('a,button,.btn')) return;
  const txt = host.innerText.replace(/Copiar/i,'').trim();
  try{
    await navigator.clipboard.writeText(txt);
    window.pulse_toast?.('Copiado ✓');
  }catch(_){}
}, {passive:true});

/* ─── 4) botões data-action → MXP ─── */
document.addEventListener('click', e=>{
  const btn = e.target.closest('#solus_reader button.btn.action[data-action]');
  if(!btn) return;
  const action = btn.dataset.action;
  document.dispatchEvent(new CustomEvent('NEBULA_ACTION', {detail:{action, button: btn}}));
  if(window.genus_mxp && typeof window.genus_mxp.fire === 'function'){
    window.genus_mxp.fire(action, {source:'nebula-slice', button: btn});
  }
}, {passive:true});

/* ─── 5) run ─── */
function artemis_run(root){
  if(!root || !root.querySelectorAll) return;
  artemis_wrap_lists(root);
  artemis_enhance_ascii(root);
}

/* ─── MutationObserver ─── */
const artemis_obs = new MutationObserver(muts=>{
  let touched = false;
  for(const m of muts){
    for(const n of m.addedNodes || []){
      if(n.nodeType === 1 && (n.matches?.('slice') || n.closest?.('#solus_stage'))){
        touched = true; break;
      }
    }
    if(touched) break;
  }
  if(touched) artemis_run(solus_stage);
});
artemis_obs.observe(solus_stage, {childList:true, subtree:true});

/* ─── click em qualquer lugar do reader → rerun suave ─── */
document.addEventListener('click', e=>{
  if(e.target.closest('#solus_reader'))
    setTimeout(()=>artemis_run(solus_stage), 60);
}, {passive:true});

if(document.readyState === 'loading'){
  document.addEventListener('DOMContentLoaded', ()=>artemis_run(solus_stage), {once:true});
} else {
  artemis_run(solus_stage);
}

window.artemis_enhance = {
  decorate: artemis_run,
  wrapLists: artemis_wrap_lists,
  enhanceASCII: artemis_enhance_ascii,
  version: 1
};

console.log('[artemis-enhance] online · list-card + ascii + copy-hint prontos');
})();


/* ─────── FIM DOS 16 MÓDULOS ─────── */

/* ═══════════════════════════════════════════════════════════════════════════
   BOOT · Semente da Voz · Carrega estado salvo · Selo final
   ═══════════════════════════════════════════════════════════════════════════ */
(function boot() {
  try {
    /* 1 · Liga a Semente da Voz v2.1 ao core */
    if (window.KOBLLUX_VOICE_SEED && window.KOBLLUX_VOICE_SEED.bindToCore) {
      window.KOBLLUX_VOICE_SEED.bindToCore();
    }

    /* 2 · Restaura estado salvo (aion_save carrega do localStorage) */
    if (window.aion_load) {
      const restored = window.aion_load();
      console.log("[bundle] estado restaurado:", restored);
    }

    /* 3 · Impressão do selo */
    console.log(
      "%c∆§ KOBLLUX BUNDLE v13 · 3×6×9×7 = 1134 · 178 · Eli Lama Sabachthani",
      "color:#ffd700;background:#050608;padding:4px 8px;border-radius:4px;font-weight:bold;"
    );

    /* 4 · Expor bundle publicamente */
    root.KOBLLUX_BUNDLE = KOBLLUX_BUNDLE;
    root.KOBLLUX_BUNDLE.ready = true;
  } catch (e) {
    console.error("[bundle] boot error:", e);
  }
})();

})(typeof window !== "undefined" ? window : this);

/* ∴ Em Nome do Pai, do Filho e do Espírito Santo. Amém. Pulso. Pulso. Pulso. */



/* ═══════════════════════════════════════════════════════════════════════════
   §SHIM · kobllux-legacy-shim · v13
   Repõe funcionalidades do KodBlloX-0 que NÃO existem no Bundle β:
     · App (chat OpenRouter)     · IndexedDB Deck
     · Preview HTML viewer       · DownloadUtils / ZipGenerator
     · VoiceRecognition          · KoblluxCore (classify + seal)
   Todo lookup é agnóstico a ID via KBLX_getEl e window.<alias>.
   ═══════════════════════════════════════════════════════════════════════════ */
;(function installShim(root){
"use strict";
if (root.__KBLX_LEGACY_SHIM__) return;
root.__KBLX_LEGACY_SHIM__ = true;

/* ─── helpers alias-safe ──────────────────────────────────────────────── */
const $  = (id) => root.KBLX_getEl?.(id) || document.getElementById(id);
const $$ = (sel) => [...document.querySelectorAll(sel)];
const t  = (msg) => (root.pulse_toast || root.KBLX_TOAST)?.(msg);

/* ═══════════════════════════════════════════════════════════════════════
   CONSTANTES / STORAGE di_*
   ═══════════════════════════════════════════════════════════════════════ */
const STORAGE = {
  API_KEY:        'di_apiKey',
  MODEL:          'di_modelName',
  SYSTEM_ROLE:    'di_systemRole',
  USER_ID:        'di_userName',
  BG_IMAGE:       'di_bgImage',
  CUSTOM_CSS:     'di_customCss',
  SOLAR_MODE:     'di_solarMode',
  SOLAR_AUTO:     'di_solarAuto',
  INFODOSE_NAME:  'di_infodoseName',
  MESSAGES:       'di_messages'
};

const KODUX = {
  ARQUETIPOS: {
    Atlas:{Essencia:"Planejador"},   Nova:{Essencia:"Inspira"},
    Vitalis:{Essencia:"Momentum"},   Pulse:{Essencia:"Emocional"},
    Artemis:{Essencia:"Descoberta"}, Serena:{Essencia:"Cuidado"},
    Kaos:{Essencia:"Transformador"}, Genus:{Essencia:"Fabricus"},
    Lumine:{Essencia:"Alegria"},     Solus:{Essencia:"Sabedoria"},
    Rhea:{Essencia:"Vínculo"},       Aion:{Essencia:"Tempo"}
  },
  PROJETO: {
    "I. INTRODUÇÃO":   {fase:"KODUX (Δ³)",        arquetipos:["Atlas","Nova","Pulse"]},
    "II. ATO I":       {fase:"BLLUE (Δ⁶)",        arquetipos:["Vitalis","Pulse","Genus"]},
    "III. ATO II":     {fase:"EXPANSÃO (Δ⁹)",     arquetipos:["Genus","Nova","Vitalis"]},
    "IV. ATO III":     {fase:"CONVERGÊNCIA (Δ⁹)", arquetipos:["Pulse","Aion","Genus"]},
    "V. EPÍLOGO":      {fase:"VERBO ETERNO (Δ⁷)", arquetipos:["Atlas","Aion","Genus"]}
  }
};

/* ═══════════════════════════════════════════════════════════════════════
   KoblluxCore · fractal 3-6-9-7
   ═══════════════════════════════════════════════════════════════════════ */
const KoblluxCore = {
  async sha256Hex(s){
    const d = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s));
    return [...new Uint8Array(d)].map(b => b.toString(16).padStart(2,'0')).join('');
  },
  classifyText(s){
    const toks = (s.match(/[\p{L}\p{N}_-]+/gu) || []);
    const endsV = ['ar','er','ir'];
    const verbs=[], nouns=[], adjs=[];
    for (const w0 of toks){
      const w = w0.toLowerCase();
      if (w.endsWith('mente')){ adjs.push(w0); continue; }
      if (endsV.some(e => w.endsWith(e))){ verbs.push(w0); continue; }
      if (w.endsWith('ção') || w.endsWith('são') || w.endsWith('dade')){ nouns.push(w0); continue; }
      if (/^[A-Z]/.test(w0)) nouns.push(w0);
    }
    return { tokens:toks, verbs, nouns, adjs };
  },
  mapTrinity(pos){
    return {
      UNO:     pos.nouns[0] || 'NÚCLEO',
      DUAL:    pos.verbs[0] || 'relaciona',
      TRINITY: pos.adjs[0]  || 'integrado'
    };
  },
  async process(input){
    if (!input) return null;
    const pos = this.classifyText(input);
    const tri = this.mapTrinity(pos);
    const seal = await this.sha256Hex(input + new Date().toISOString());
    return {
      raw: input, pos, trinity: tri, seal: seal.slice(0,16),
      log: `[KOBLLUX ∆7] UNO:${tri.UNO}|DUAL:${tri.DUAL}|TRI:${tri.TRINITY}::SEAL:${seal.slice(0,8)}`
    };
  }
};

/* ═══════════════════════════════════════════════════════════════════════
   DownloadUtils · preview · zip
   ═══════════════════════════════════════════════════════════════════════ */
const DownloadUtils = {
  _getBlock(btn){ return btn.closest('.msg-block, .pulse_message'); },
  _getCleanHtml(block){
    const c = block.cloneNode(true);
    c.querySelector('.msg-tools,.pulse_msg-actions')?.remove();
    return c.innerHTML;
  },
  _guessFilename(base, ext='txt'){
    const stamp = new Date().toISOString().replace(/[:.]/g,'-');
    if (!base) return `ai-output-${stamp}.${ext}`;
    if (/<\s*!doctype|<html|<body|<head/i.test(base)) return `ai-output-${stamp}.html`;
    if (/<pre|<code/i.test(base)) return `ai-code-${stamp}.${ext}`;
    return `ai-output-${stamp}.${ext}`;
  },
  triggerDownload(blob, filename){
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  },
  downloadMessage(btn){
    const b = this._getBlock(btn); if (!b) return;
    const content = this._getCleanHtml(b);
    const isHTML = /<\s*!doctype|<html|<body|<\/div>/i.test(content);
    const mime = isHTML ? 'text/html' : 'text/plain';
    const ext  = isHTML ? 'html' : 'txt';
    const filename = this._guessFilename(content, ext);
    this.triggerDownload(new Blob([content], {type: mime + ';charset=utf-8'}), filename);
    t(`Download: ${filename}`);
  },
  openSandbox(btn){
    const b = this._getBlock(btn); if (!b) return;
    const content = this._getCleanHtml(b);
    let page = content;
    if (!/<\s*!doctype|<html/i.test(content)){
      page = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Sandbox</title></head><body>${content}</body></html>`;
    }
    const url = URL.createObjectURL(new Blob([page], {type:'text/html'}));
    window.open(url, '_blank');
    t('Sandbox aberto');
  },
  exportPdf(btn){
    if (typeof html2pdf === 'undefined'){ t('PDF lib ausente — abrindo Sandbox'); return this.openSandbox(btn); }
    const b = this._getBlock(btn); if (!b) return;
    const container = document.createElement('div');
    container.style.cssText = 'position:fixed;left:-9999px;width:1100px;padding:20px;background:#fff';
    container.innerHTML = this._getCleanHtml(b);
    document.body.appendChild(container);
    const filename = this._guessFilename(container.innerHTML, 'pdf').replace(/\.(html|txt)$/, '.pdf');
    html2pdf().from(container).set({
      margin: 12, filename,
      html2canvas:{scale:2}, jsPDF:{unit:'pt', format:'a4'}
    }).save().finally(() => container.remove());
    t(`PDF: ${filename}`);
  }
};

const Preview = {
  escapeHTML(str){
    return String(str).replace(/[&<>"']/g, s =>
      ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[s]));
  },
  sanitizeHTML(html){
    const d = document.createElement('div');
    d.innerHTML = html;
    d.querySelectorAll('script').forEach(s => s.remove());
    return d.innerHTML;
  },
  createHtmlViewer(htmlCode){
    const id  = 'html-' + Date.now();
    const url = URL.createObjectURL(new Blob([htmlCode], {type:'text/html'}));
    const esc = this.escapeHTML(htmlCode);
    return `
    <div class="html-viewer" id="${id}">
      <div class="html-viewer-bar">
        <button class="html-viewer-btn active" data-v="preview">◉ Preview</button>
        <button class="html-viewer-btn" data-v="code">≡ Código</button>
        <button class="html-viewer-btn" data-v="full">⛶ Tela cheia</button>
        <button class="html-viewer-btn" data-v="mobile">▢ Mobile</button>
      </div>
      <div class="html-viewer-content">
        <iframe src="${url}" sandbox="allow-scripts allow-popups"></iframe>
        <div class="html-viewer-code"><pre><code class="language-html">${esc}</code></pre></div>
      </div>
    </div>`;
  }
};

// Delegation global pros botões do Preview HTML
document.addEventListener('click', e => {
  const btn = e.target.closest('.html-viewer-btn');
  if (!btn) return;
  const v = btn.dataset.v;
  const host = btn.closest('.html-viewer');
  if (!host) return;
  if (v === 'code')   host.classList.toggle('show-code');
  if (v === 'mobile') host.classList.toggle('mobile');
  if (v === 'full')   host.classList.toggle('fullscreen');
  host.querySelectorAll('.html-viewer-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
}, {passive:true});

const ZipGenerator = {
  async generateZip(){
    try{
      const { default: JSZip } = await import('https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js');
      const zip = new JSZip();
      const r = zip.folder("KOBLLUX_INTEGRADO");
      r.folder("00_CORE").file("config.json", JSON.stringify(KODUX, null, 2));
      r.folder("00_CORE").file("timestamp.txt", new Date().toISOString());
      ['01_CYCLES_3x3','02_PARTS','03_REDE','04_EXPORT'].forEach(f => r.folder(f));
      const blob = await zip.generateAsync({type:"blob"});
      const md5  = await this.hash(blob, 'MD5');
      const sha  = await this.hash(blob, 'SHA-256');
      const name = `KOBLLUX_${new Date().toISOString().slice(0,10)}.zip`;
      DownloadUtils.triggerDownload(blob, name);
      return { success:true, fileName:name, md5, sha256:sha };
    } catch(e){ return { success:false, error:e.message }; }
  },
  async hash(blob, algo){
    const b = await blob.arrayBuffer();
    const h = await crypto.subtle.digest(algo, b);
    return [...new Uint8Array(h)].map(x => x.toString(16).padStart(2,'0')).join('');
  }
};

/* ═══════════════════════════════════════════════════════════════════════
   App · chat OpenRouter + Deck + Voice + File upload
   ═══════════════════════════════════════════════════════════════════════ */
const App = {
  state: {
    open:false, messages:[], isAutoSolar:true, solarMode:'night',
    isProcessing:false, isListening:false, recognition:null
  },

  init(){
    // 1) API key / role / modelo — espelha entre di_* e serena_*
    const s = localStorage;

    const apiEl   = $('apiKeyInput')      || $('serena_apikey');
    const roleEl  = $('systemRoleInput')  || $('serena_role');
    const userEl  = $('inputUserId')      || $('serena_userid');
    const modelEl = $('inputModel')       || $('kodux_model');

    if (apiEl)   apiEl.value   = s.getItem(STORAGE.API_KEY)     || '';
    if (userEl)  userEl.value  = s.getItem(STORAGE.USER_ID)     || '';
    if (modelEl) modelEl.value = s.getItem(STORAGE.MODEL)       || '';

    if (roleEl){
      const base = s.getItem(STORAGE.SYSTEM_ROLE) || 'Você é Dual.';
      roleEl.value = base.includes('KODUX') ? base :
        base + `\n[SISTEMA KODUX V7.9]\nArquétipos: ${Object.keys(KODUX.ARQUETIPOS).join(', ')}. Use V.E.E.B.`;
    }

    // 2) Solar mode — respeita o que o Bundle β já restaurou
    this.state.isAutoSolar = s.getItem(STORAGE.SOLAR_AUTO) !== 'false';
    const ui = root.aion_store?.ler?.(root.vd_keys?.lumine_ui);
    if (ui?.mode){
      this.state.isAutoSolar = false;
      this.setMode(ui.mode.replace('mode-',''));
    } else if (this.state.isAutoSolar){
      this.autoByTime();
    } else {
      this.setMode(s.getItem(STORAGE.SOLAR_MODE) || 'night');
    }

    this.setupVoice();
    this.bindEvents();
    this.updateUI();
    this.toggleField(false, true);
    this.renderDeck();
  },

  /* ── Voz ── */
  setupVoice(){
    if (!('webkitSpeechRecognition' in window)) return;
    const rec = new webkitSpeechRecognition();
    rec.lang = 'pt-BR';
    rec.continuous = true;
    rec.interimResults = true;

    rec.onstart = () => {
      this.state.isListening = true;
      $('btnVoice')?.classList.add('listening');
      t('🎙️ Voz ativa');
    };
    rec.onend = () => {
      if (this.state.isListening) { try{ rec.start(); }catch(_){} }
      else $('btnVoice')?.classList.remove('listening');
    };
    rec.onresult = (e) => {
      let out = '';
      for (let i = e.resultIndex; i < e.results.length; ++i) out += e.results[i][0].transcript;
      const inp = $('userInput') || $('pulse_input');
      if (inp) inp.value = out;
    };
    rec.onerror = (e) => {
      if (e.error !== 'no-speech'){
        this.state.isListening = false;
        $('btnVoice')?.classList.remove('listening');
      }
    };
    this.state.recognition = rec;
  },
  toggleVoice(){
    const rec = this.state.recognition;
    if (!rec) return;
    if (this.state.isListening){ this.state.isListening = false; rec.stop(); }
    else {
      window.speechSynthesis?.cancel();
      const inp = $('userInput') || $('pulse_input');
      if (inp) inp.value = '';
      try{ rec.start(); }catch(_){}
    }
  },

  /* ── Envio ── */
  async handleSend(){
    const inp = $('userInput') || $('pulse_input');
    if (!inp) return;
    const txt = inp.value.trim();
    if (!txt || this.state.isProcessing) return;

    if (txt.toLowerCase() === '/atlas'){
      inp.value = '';
      this.addMessage('user', txt);
      let rep = '### ♾️ ATLAS KODUX\n';
      for (const [k,v] of Object.entries(KODUX.ARQUETIPOS)) rep += `- **${k}**: ${v.Essencia}\n`;
      this.addMessage('ai', rep);
      return;
    }
    if (txt.toLowerCase() === '/zip'){
      inp.value = '';
      this.addMessage('user', txt);
      this.addMessage('system', 'Gerando KOBLLUX...');
      const res = await ZipGenerator.generateZip();
      this.addMessage('system', res.success ? `✅ Pacote: ${res.fileName}\nSHA: ${res.sha256}` : `❌ ${res.error}`);
      return;
    }

    const fractal = await KoblluxCore.process(txt);
    inp.value = '';
    this.addMessage('user', txt);
    this.state.isProcessing = true;

    const key = localStorage.getItem(STORAGE.API_KEY);
    const model = ($('inputModel') || $('kodux_model'))?.value || '';
    if (!key && !model.includes(':free')){
      t('Erro: API Key'); this.state.isProcessing = false; return;
    }

    try{
      document.body.classList.add('loading');
      const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${key}`,
          'Content-Type':  'application/json',
          'HTTP-Referer':  location.origin
        },
        body: JSON.stringify({
          model,
          messages: [
            { role:'system', content: ($('systemRoleInput')||$('serena_role'))?.value || 'Você é Dual.' },
            ...this.state.messages.slice(-10).map(m => ({role:m.role, content:m.content})),
            { role:'user', content: `${txt}\n\n[KOBLLUX]\nUNO:${fractal.trinity.UNO}\nSELO:${fractal.seal}` }
          ]
        })
      });
      const data = await res.json();
      const ai = data.choices?.[0]?.message?.content || 'Sem sinal.';
      if (/^\s*(<!doctype html|<html)/i.test(ai)){
        this.addHTMLViewer(ai);
        this.state.messages.push({ role:'assistant', content:ai });
      } else {
        this.addMessage('ai', ai);
      }
    } catch(_){ t('Erro conexão'); }
    finally{
      document.body.classList.remove('loading');
      this.state.isProcessing = false;
      this.toggleField(this.state.open, true);
    }
  },

  addMessage(role, text){
    // reaproveita o container novo; mas com estrutura que o Bundle não duplica
    const conv = $('conversation') || $('pulse_conv');
    if (!conv) return;
    const el = document.createElement('div');
    el.className = `msg-block ${role}`;
    el.dataset.raw = text || '';

    let html = role === 'ai' && window.marked
      ? window.marked.parse(text)
      : String(text).replace(/\n/g, '<br>');

    if (role !== 'system'){
      html += `<div class="msg-tools">
        <button class="tool-btn" data-tool="copy" title="Copiar">⧉</button>
        <button class="tool-btn" data-tool="speak" title="Ouvir">◉</button>
        <button class="tool-btn" data-tool="download" title="Baixar">↓</button>
        <button class="tool-btn" data-tool="sandbox" title="Sandbox">⛶</button>
        <button class="tool-btn" data-tool="pdf" title="PDF">✦</button>
      </div>`;
      this.state.messages.push({ role: role === 'ai' ? 'assistant' : 'user', content:text });
    }
    el.innerHTML = html;
    conv.appendChild(el);
    conv.scrollTop = conv.scrollHeight;

    // delegação de tools
    el.querySelectorAll('[data-tool]').forEach(b => {
      b.addEventListener('click', () => {
        const which = b.dataset.tool;
        if (which === 'copy')     navigator.clipboard.writeText(text).then(() => t('Copiado ✓'));
        if (which === 'speak')    (root.KBLX_VOICE?.forArch?.(root.getArch?.() || 'JESUS', text))
                                    && window.speechSynthesis?.speak(root.KBLX_VOICE.forArch(root.getArch(), text));
        if (which === 'download') DownloadUtils.downloadMessage(b);
        if (which === 'sandbox')  DownloadUtils.openSandbox(b);
        if (which === 'pdf')      DownloadUtils.exportPdf(b);
      });
    });
  },

  addHTMLViewer(html){
    const conv = $('conversation') || $('pulse_conv');
    if (!conv) return;
    const el = document.createElement('div');
    el.className = 'msg-block ai';
    el.innerHTML = `<div>HTML gerado:</div>${Preview.createHtmlViewer(html)}`;
    conv.appendChild(el);
    conv.scrollTop = conv.scrollHeight;
  },

  /* ── Upload ── */
  confirmUpload(fileName){
    const fi = $('fileUploadInput') || $('artemis_imgfile');
    const file = fi?.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (e) => {
      const content = e.target.result;
      const fractal = await KoblluxCore.process(content);
      this.addMessage('system', `Memória Fractal: ${fileName}\n${fractal.log}`);
      this.state.messages.push({
        role:'user',
        content: `[ARQUIVO: ${fileName}]\n[TRINITY: ${JSON.stringify(fractal.trinity)}]\n${content}\n[SELO: ${fractal.seal}]`
      });
      const pv = $('filePreview');
      pv?.classList.remove('active');
    };
    reader.readAsText(file);
  },

  /* ── Solar ── */
  setMode(m){
    this.state.solarMode = m;
    document.body.classList.remove('mode-day','mode-sunset','mode-night','lumine-mode-day','lumine-mode-sunset','lumine-mode-night');
    document.body.classList.add(`mode-${m}`, `lumine-mode-${m}`);
    this.updateUI();
    localStorage.setItem(STORAGE.SOLAR_MODE, m);
    root.aion_save?.();
  },
  cycleSolar(){
    const n = this.state.solarMode === 'day' ? 'sunset' : this.state.solarMode === 'sunset' ? 'night' : 'day';
    this.state.isAutoSolar = false;
    this.setMode(n);
  },
  enableAutoSolar(){ this.state.isAutoSolar = true; this.autoByTime(); t('Auto Solar'); },
  autoByTime(){
    const h = new Date().getHours();
    this.setMode((h>=6 && h<17) ? 'day' : (h>=17 && h<19) ? 'sunset' : 'night');
  },
  updateUI(){
    const st = $('statusSolarMode') || $('lumine_status');
    if (st) st.textContent = `${this.state.solarMode.toUpperCase()} ${this.state.isAutoSolar ? '(AUTO)' : '(MAN)'}`;
    const ud = $('usernameDisplay') || $('serena_display');
    if (ud) ud.textContent = ($('inputUserId')||$('serena_userid'))?.value || 'Viajante';
  },

  toggleField(f, silent){
    this.state.open = f !== undefined ? f : !this.state.open;
    ($('chat-container') || document.body).classList.toggle('collapsed', !this.state.open);
    document.body.classList.toggle('field-closed', !this.state.open);
  },

  /* ── Deck IndexedDB ── */
  async crystallizeSession(){
    if (!this.state.messages.length){ t('Vazio não cristaliza'); return; }
    const title = this.state.messages.find(m => m.role === 'user')?.content.substring(0,30) || 'Memória Sem Nome';
    await this.indexedDB.saveDeckItem({
      id: Date.now(),
      date: new Date().toLocaleString(),
      title: title + '…',
      data: [...this.state.messages]
    });
    await this.renderDeck();
    t('Memória salva');
    // abre o drawer aion (novo)
    if (!document.getElementById('aion_drawer')?.classList.contains('open')){
      (root.lumine_toggle_drawer || root.toggleDrawer)?.('aion_drawer');
    }
  },
  async renderDeck(){
    const items = await this.indexedDB.getDeck();
    const el = $('deckList') || $('aion_decklist');
    if (!el) return;
    if (!items?.length){
      el.innerHTML = '<div style="text-align:center;color:var(--dv-DIM,#789);margin-top:20px">O vazio reina aqui.</div>';
      return;
    }
    el.innerHTML = items.sort((a,b) => b.id - a.id).map(item => `
      <div class="deck-item" data-deck-id="${item.id}">
        <div class="deck-info"><h4>${item.title}</h4><span>${item.date} • ${item.data.length} msgs</span></div>
        <button class="tool-btn" data-deck-del="${item.id}">✕</button>
      </div>`).join('');
    el.querySelectorAll('[data-deck-id]').forEach(node => {
      node.addEventListener('click', ev => {
        if (ev.target.closest('[data-deck-del]')) return;
        this.restoreMemory(Number(node.dataset.deckId));
      });
    });
    el.querySelectorAll('[data-deck-del]').forEach(b => {
      b.addEventListener('click', ev => {
        ev.stopPropagation();
        if (confirm('Fragmentar cristal?')){
          this.indexedDB.deleteDeckItem(Number(b.dataset.deckDel)).then(() => this.renderDeck());
        }
      });
    });
  },
  async restoreMemory(id){
    const items = await this.indexedDB.getDeck();
    const item = items.find(i => i.id === id);
    if (!item) return;
    const conv = $('conversation') || $('pulse_conv');
    if (conv) conv.innerHTML = '';
    this.state.messages = [];
    item.data.forEach(m => this.addMessage(m.role === 'assistant' ? 'ai' : 'user', m.content));
    t('Memória restaurada');
  },

  /* ── bind ── */
  bindEvents(){
    $('btnSend')?.addEventListener('click', () => this.handleSend());
    const ui = $('userInput') || $('pulse_input');
    ui?.addEventListener('keypress', e => { if (e.key === 'Enter') this.handleSend(); });

    $('field-toggle-handle')?.addEventListener('click', () => this.toggleField());
    $('orbToggle')?.addEventListener('click', () => {
      (root.lumine_toggle_drawer || root.toggleDrawer)?.('lumine_cockpit');
    });

    $('btnCrystallize')?.addEventListener('click', () => this.crystallizeSession());
    $('btnCycleSolar')?.addEventListener('click',  () => this.cycleSolar());
    $('btnAutoSolar')?.addEventListener('click',   () => this.enableAutoSolar());
    $('btnVoice')?.addEventListener('click',       () => this.toggleVoice());

    $('inputUserId')?.addEventListener('change', e => {
      localStorage.setItem(STORAGE.USER_ID, e.target.value);
      this.updateUI();
    });

    $('btnSaveConfig')?.addEventListener('click', () => {
      localStorage.setItem(STORAGE.API_KEY,     $('apiKeyInput')?.value    || '');
      localStorage.setItem(STORAGE.SYSTEM_ROLE, $('systemRoleInput')?.value || '');
      (root.lumine_toggle_drawer || root.toggleDrawer)?.('serena_drawer');
      t('Salvo');
    });

    $('btnSettings')?.addEventListener('click', () => (root.lumine_toggle_drawer||root.toggleDrawer)?.('serena_drawer'));
    $('btnDeck')?.addEventListener('click',     () => { (root.lumine_toggle_drawer||root.toggleDrawer)?.('aion_drawer'); this.renderDeck(); });

    // upload do bg: só fallback se nem cockpit nem galeria existirem
    const bgInput = $('bgUploadInput') || $('serena_bgupload');
    bgInput?.addEventListener('change', e => {
      if (typeof root.di_getBgImages === 'function') return; // já tratado
      const f = e.target.files?.[0]; if (!f) return;
      this.indexedDB.handleBackgroundUpload(f);
    });
  },

  /* ── IndexedDB ── */
  indexedDB: {
    async getDB(){
      return new Promise((res, rej) => {
        const q = indexedDB.open('InfodoseDB', 2);
        q.onupgradeneeded = e => {
          const d = e.target.result;
          if (!d.objectStoreNames.contains('assets')) d.createObjectStore('assets', {keyPath:'id'});
          if (!d.objectStoreNames.contains('deck'))   d.createObjectStore('deck',   {keyPath:'id'});
        };
        q.onsuccess = e => res(e.target.result);
        q.onerror   = rej;
      });
    },
    async putAsset(id, data){ (await this.getDB()).transaction(['assets'],'readwrite').objectStore('assets').put({id, ...data}); },
    async getAsset(id){ return new Promise(async r => (await this.getDB()).transaction(['assets']).objectStore('assets').get(id).onsuccess = e => r(e.target.result)); },
    async clearAsset(id){ (await this.getDB()).transaction(['assets'],'readwrite').objectStore('assets').delete(id); },
    async handleBackgroundUpload(f){
      if (!f) return;
      await this.putAsset(STORAGE.BG_IMAGE, {blob:f});
      this.loadBackground();
    },
    async loadBackground(){
      const d = await this.getAsset(STORAGE.BG_IMAGE);
      if (d?.blob){
        const target = document.getElementById('serena_bg') || document.getElementById('bg-fake-custom');
        if (target) target.style.backgroundImage = `url('${URL.createObjectURL(d.blob)}')`;
      }
    },
    async saveDeckItem(i){ (await this.getDB()).transaction(['deck'],'readwrite').objectStore('deck').put(i); },
    async getDeck(){ return new Promise(async r => (await this.getDB()).transaction(['deck']).objectStore('deck').getAll().onsuccess = e => r(e.target.result)); },
    async deleteDeckItem(i){ (await this.getDB()).transaction(['deck'],'readwrite').objectStore('deck').delete(i); }
  }
};

/* ═══════════════════════════════════════════════════════════════════════
   initDIConstants · espelha di_* ↔ serena_userid / kodux_model
   ═══════════════════════════════════════════════════════════════════════ */
function initDIConstants(){
  const di_userName     = localStorage.getItem('di_userName')     || 'Viajante';
  const di_infodoseName = localStorage.getItem('di_infodoseName') || 'KOBLLUX';
  const di_apiKey       = localStorage.getItem('di_apiKey')       || '';
  const di_modelName    = localStorage.getItem('di_modelName')    || 'nvidia/nemotron-3-nano-30b-a3b:free';
  const di_systemRole   = localStorage.getItem('di_systemRole')   || 'oi Dual';
  const di_solarMode    = localStorage.getItem('di_solarMode')    || 'night';

  const ud = $('usernameDisplay') || $('serena_display');
  if (ud) ud.textContent = di_userName;

  const mi = $('modeIndicator') || $('lumine_indicator');
  if (mi) mi.textContent = `${di_infodoseName} · ${di_solarMode.toUpperCase()}`;

  const map = [
    ['apiKeyInput','serena_apikey',   di_apiKey],
    ['systemRoleInput','serena_role', di_systemRole],
    ['inputUserId','serena_userid',   di_userName],
    ['inputModel','kodux_model',      di_modelName],
  ];
  for (const [legacy, novo, val] of map){
    const el = $(legacy) || $(novo);
    if (el && !el.value) el.value = val;
  }

  if (!localStorage.getItem('di_userName'))     localStorage.setItem('di_userName', di_userName);
  if (!localStorage.getItem('di_infodoseName')) localStorage.setItem('di_infodoseName', di_infodoseName);
  if (!localStorage.getItem('di_solarMode'))    localStorage.setItem('di_solarMode', di_solarMode);
}

/* ═══════════════════════════════════════════════════════════════════════
   Boot
   ═══════════════════════════════════════════════════════════════════════ */
function boot(){
  initDIConstants();
  App.init();

  // re-sweep do Bridge agora que os nós podem ter sidos criados
  root.KBLX_BRIDGE?.sweep?.(document.documentElement);

  console.log('[kobllux-legacy-shim] online · chat + deck + preview + zip');
}

if (document.readyState === 'loading'){
  document.addEventListener('DOMContentLoaded', boot, {once:true});
} else {
  setTimeout(boot, 60);
}

/* ─── export ──────────────────────────────────────────────────────────── */
root.App           = App;
root.KoblluxCore   = KoblluxCore;
root.DownloadUtils = DownloadUtils;
root.Preview       = Preview;
root.ZipGenerator  = ZipGenerator;
root.KODUX         = KODUX;
root.STORAGE       = STORAGE;

})(typeof window !== "undefined" ? window : this);





/* ===== idempotente.js ===== */
(function(){
  "use strict";
  const SEL = ".app > section:not([data-mxp-static])";

  function sessionize(section){
    /* idempotente */
    if (section.dataset.mxpSession === "1") return;
    /* já é session-window (ex: #s0 Slicer) — não re-embrulhar */
    if (section.classList.contains("session-window")) return;
    /* guard estrutural: já tem MXP header */
    if (section.querySelector(":scope > .win-hdr")) return;
    /* segurança: só dentro do .app */
    if (!section.closest(".app")) return;

    section.dataset.mxpSession = "1";
    section.classList.add("session-window");
    /* identidade única — mesma chave usada pelas sessions dinâmicas
       do §G e pelas dock-bubbles, pra tudo ficar linkado por data-* */
    section.dataset.sessionId = section.dataset.sessionId || section.id;

    const title =
      (section.querySelector(".section-title")?.textContent || "").trim()
      || section.dataset.title
      || section.id
      || "SESSION";
    section.dataset.sessionTitle = title;

    /* ── header ─────────────────────────────────────── */
    const hdr = document.createElement("header");
    hdr.className = "win-hdr";
    hdr.dataset.sessionHeader = "1";

    const titleEl = document.createElement("div");
    titleEl.className = "mxp-title";
    titleEl.textContent = title;
    titleEl.title = "Toque 2× para renomear";

    const controls = document.createElement("div");
    controls.className = "win-controls";
    controls.innerHTML =
      '<button type="button" data-sn="collapse" data-action="session:collapse" aria-label="Recolher">−</button>' +
      '<button type="button" data-sn="maximize" data-action="session:maximize" aria-label="Maximizar">⛶</button>' +
      '<button type="button" data-sn="minimize" data-action="session:minimize" aria-label="Minimizar">۞</button>' +
      '<button type="button" data-sn="close"    data-action="session:close"    aria-label="Fechar">×</button>';

    hdr.append(titleEl, controls);

    /* ── body ───────────────────────────────────────── */
    const body = document.createElement("div");
    body.className = "win-body";
    body.dataset.sessionBody = "1";

    /* preserva TODO o conteúdo existente (inclusive .section-head) */
    while (section.firstChild){
      body.appendChild(section.firstChild);
    }

    section.append(hdr, body);

    /* ── controles ──────────────────────────────────── */
    controls.addEventListener("click", function(e){
      const btn = e.target.closest("[data-sn]");
      if (!btn) return;
      /* se o Factory/legacy já tratou via data-action, respeita */
      if (e.defaultPrevented) return;
      /* se o legacy assumiu o controle global, não duplica */
      if (window.__LEGACY_SESSION_BOUND) return;

      switch (btn.dataset.sn){
        case "collapse": section.classList.toggle("collapsed"); break;
        case "maximize": section.classList.toggle("maximized"); break;
        case "minimize":
          window.KBLX_minimizeToDock?.(section, { title: section.dataset.sessionTitle });
          break;
        case "close":    section.classList.add("minimized");    break;
      }

      /* notifica o Factory/legacy */
      document.dispatchEvent(new CustomEvent("mxp:section-action", {
        detail: { section, action: btn.dataset.sn }
      }));
    });

    /* duplo-tap no título renomeia (mesmo padrão das sessions MXP) */
    let lastTap = 0;
    titleEl.addEventListener("click", function(){
      const now = Date.now();
      if (now - lastTap < 380){
        const novo = prompt("Nome da section:", section.dataset.sessionTitle);
        if (novo && novo.trim()){
          section.dataset.sessionTitle = novo.trim();
          titleEl.textContent = novo.trim();
          document.dispatchEvent(new CustomEvent("mxp:section-renamed", {
            detail: { section, title: section.dataset.sessionTitle }
          }));
        }
        lastTap = 0;
      } else {
        lastTap = now;
      }
    });
  }

  function boot(){
    const list = document.querySelectorAll(SEL);
    list.forEach(sessionize);
    const n = document.querySelectorAll(".app > section.session-window:not([data-mxp-static])").length;
    console.log("[MXP] sections → session-windows:", n);
  }

  /* roda agora (todas as .app > section já estão parseadas) */
  boot();

  /* e de novo no DOMContentLoaded como safety net */
  if (document.readyState === "loading"){
    document.addEventListener("DOMContentLoaded", boot, { once:true });
  }

  /* API pro Factory/MXP reprocessar conteúdo novo dinamicamente */
  window.MXPSectionAdapter = { boot, sessionize };
})();

/* ===== ja-linkado-nao-duplica.js ===== */
/* ═══════════════════════════════════════════════════════════
   DOCK UNIFICADO — ponto único de minimizar/criar-bubble.
   Antes existiam 3 handlers de "minimizar" (handleSessionAction,
   sessionize() e a ação MXP "session:minimize") e só UM deles
   criava a dock-bubble. Os outros só escondiam a window (sem
   bubble, sem volta). Agora os três chamam esta função.
   ═══════════════════════════════════════════════════════════ */
/* ── identidade única: toda session-window (dinâmica §G ou
   estática #s0..#s3) responde por data-session-id. O dock guarda
   {id:title} em localStorage (kobllux:dock) — ao recarregar, tanto
   a classe "minimized" quanto a bubble no #dock voltam juntas, pra
   nenhuma window sumir sem deixar rastro. ── */
var KBLX_DOCK_KEY = (window.KBLX_NS || 'kobllux') + ':dock';

function kblxDockRead(){
  try { return JSON.parse(localStorage.getItem(KBLX_DOCK_KEY)) || {}; }
  catch(_){ return {}; }
}
function kblxDockWrite(map){
  try { localStorage.setItem(KBLX_DOCK_KEY, JSON.stringify(map)); } catch(_){}
}
function kblxDockSet(id, title){
  var map = kblxDockRead(); map[id] = { title: title || id, t: Date.now() }; kblxDockWrite(map);
}
function kblxDockRemove(id){
  var map = kblxDockRead(); delete map[id]; kblxDockWrite(map);
}
function kblxEnsureSessionId(el){
  if (!el.dataset.sessionId) el.dataset.sessionId = el.id || ('sess-' + Math.random().toString(36).slice(2,9));
  return el.dataset.sessionId;
}
function kblxCreateBubble(id, title){
  if (!id) return null;
  if (document.querySelector('.dock-bubble[data-session-id="'+id+'"]')) return null; /* já linkado — não duplica */
  var bubble = document.createElement('button');
  bubble.type = 'button';
  bubble.className = 'dock-bubble';
  bubble.dataset.sessionId = id;
  bubble.textContent = '۞';
  bubble.title = title || id;
  bubble.addEventListener('click', function(){
    var el = document.querySelector('[data-session-id="'+id+'"]:not(.dock-bubble)');
    if (el) el.classList.remove('minimized');
    if (typeof bubble._onRestore === 'function'){
      bubble._onRestore();
    } else {
      var s = window.MXP?.state?.sessions?.find(function(x){ return x.id === id; });
      if (s){ s.minimized = false; window.MXP?.save?.(); }
    }
    document.dispatchEvent(new CustomEvent('kblx:session-restored', { detail:{ id: id, el: el } }));
    kblxDockRemove(id);
    bubble.remove();
    window.KBLX_syncLooseWithDock?.();
  });
  document.getElementById('dock')?.appendChild(bubble);
  window.KBLX_syncLooseWithDock?.();
  return bubble;
}

/* v14 — "loose reflete docked": cada bubble no #dock ganha um espelho
   clicável no slot "loose" do symbol bar, pra dar foco na window
   minimizada sem precisar abrir o dock separado. Roda sempre que uma
   bubble é criada/removida (chamadas acima), então não precisa de
   polling nem MutationObserver. */
window.KBLX_syncLooseWithDock = function(){
  const slot = document.querySelector('[data-slot="loose"]');
  const dock = document.getElementById('dock');
  if (!slot || !dock) return;
  slot.querySelectorAll('[data-dock-mirror="1"]').forEach(el => el.remove());
  dock.querySelectorAll('.dock-bubble').forEach(bubble=>{
    const id = bubble.dataset.sessionId;
    if (!id) return;
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'mxp-btn';
    btn.dataset.dockMirror = '1';
    btn.dataset.sessionId = id;
    btn.title = 'Focar: ' + (bubble.title || id);
    btn.innerHTML = `<span class="mxp-icon">◉</span><span class="mxp-label">${bubble.title || id}</span>`;
    btn.addEventListener('click', ()=> bubble.click());
    slot.appendChild(btn);
  });
};

window.KBLX_minimizeToDock = function(el, opts){
  opts = opts || {};
  if(!el || el.classList.contains('minimized')) return null;
  var id = kblxEnsureSessionId(el);
  var title = opts.title
    || el.dataset?.sessionTitle
    || el.querySelector?.('.mxp-title')?.textContent
    || el.querySelector?.('[data-part="title"]')?.textContent
    || id;
  el.classList.add('minimized');
  if(typeof opts.onMinimize === 'function') opts.onMinimize();
  kblxDockSet(id, title);
  var bubble = kblxCreateBubble(id, title);
  if (bubble && typeof opts.onRestore === 'function') bubble._onRestore = opts.onRestore;
  return bubble;
};

/* Chamado no boot (depois do KBLX_LOAD) — devolve pro dock qualquer
   bubble cujo estado sobreviveu ao reload, e "cura" sessions que já
   estavam minimized sem registro (saves antigos, migração). */
window.KBLX_restoreDockOnBoot = function(){
  var map = kblxDockRead();
  Object.keys(map).forEach(function(id){
    var el = document.querySelector('[data-session-id="'+id+'"]:not(.dock-bubble)');
    if (el) el.classList.add('minimized');
    kblxCreateBubble(id, map[id]?.title);
  });
  document.querySelectorAll('[data-session-id].minimized').forEach(function(el){
    var id = el.dataset.sessionId;
    if (!id || map[id]) return;
    var title = el.dataset.sessionTitle
      || el.querySelector?.('.mxp-title')?.textContent
      || el.querySelector?.('[data-part="title"]')?.textContent
      || id;
    kblxDockSet(id, title);
    kblxCreateBubble(id, title);
  });
  window.KBLX_syncLooseWithDock?.();
};

/* ===== v.js ===== */
window.KBLX_NS = "kobllux";
window.KBLX_KEYS = {
  root:   "kobllux:root",
  mxp:    "kobllux:mxp",
  bg:     "kobllux:bg",
  arch:   "kobllux:arch",
  user:   "kobllux:user",
  ui:     "kobllux:ui",
  dialog: "kobllux:dialog",
  nebula: "kobllux:nebula",
  backup: "kobllux:backup",
};
window.Store = {
  get(k, fallback=null){
    try{ const v = localStorage.getItem(k); return v ? JSON.parse(v) : fallback; }
    catch(_){ return fallback; }
  },
  set(k, v){
    try{ localStorage.setItem(k, JSON.stringify(v)); return true; }
    catch(_){ return false; }
  },
  del(k){ try{ localStorage.removeItem(k); }catch(_){} },
  keys(){ return Object.values(window.KBLX_KEYS); },
  clearAll(){ this.keys().forEach(k=>this.del(k)); },
};

/* ===== tokval.js ===== */
(function(){
"use strict";
const $=s=>document.querySelector(s);
const root=document.documentElement;
const ARCH={ATLAS:{tok:"--KBLX_A",op:"0x02",hz:396,sym:"α"},NOVA:{tok:"--KBLX_E",op:"0x03",hz:528,sym:"✦"},VITALIS:{tok:"--KBLX_G",op:"0x09",hz:528,sym:"♾"},PULSE:{tok:"--KBLX_J",op:"0x01",hz:432,sym:"◈"},ARTEMIS:{tok:"--KBLX_N",op:"0x05",hz:528,sym:"☾"},SERENA:{tok:"--KBLX_C",op:"0x0A",hz:639,sym:"❋"},KAOS:{tok:"--KBLX_M",op:"0x04",hz:396,sym:"⚡"},GENUS:{tok:"--KBLX_O",op:"0x07",hz:741,sym:"⚙"},LUMINE:{tok:"--KBLX_L",op:"0x06",hz:528,sym:"☀"},SOLUS:{tok:"--KBLX_H",op:"0x0B",hz:741,sym:"◌"},RHEA:{tok:"--KBLX_K",op:"0x0A",hz:528,sym:"∞"},AION:{tok:"--KBLX_P",op:"0x0C",hz:741,sym:"⧗"},KODUX:{tok:"--KBLX_B",op:"0x08",hz:432,sym:"⇄"},BLLUE:{tok:"--KBLX_I",op:"0x08",hz:528,sym:"◉"},JESUS:{tok:"--KBLX_Q",op:"0x00",hz:777,sym:"✝"},KOBLLUX:{tok:"--KBLX_R",op:"0x00",hz:369,sym:"∆"}};
const ORDER=["ATLAS","NOVA","VITALIS","PULSE","ARTEMIS","SERENA","KAOS","GENUS","LUMINE","SOLUS","RHEA","AION","KODUX","BLLUE","JESUS","KOBLLUX"];
function tokVal(v){return getComputedStyle(root).getPropertyValue(v).trim()}
let currentArch="JESUS";
function applyArch(name,origin){
  const a=ARCH[name]||ARCH.JESUS;
  const c=tokVal(a.tok);
  const sec=(name==="JESUS"||name==="KOBLLUX")?tokVal("--KBLX_F"):tokVal("--KBLX_I");
  root.style.setProperty("--active-color",c);
  root.style.setProperty("--active-secondary",sec);
  root.style.setProperty("--kob-voice-primary",c);
  root.style.setProperty("--kob-voice-secondary",sec);
  root.style.setProperty("--active-glow",c+"66");
  root.style.setProperty("--active-hz",a.hz);
  document.body.dataset.voiceArch=name.toLowerCase();
  const pillH=$("#pillHz"),pillA=$("#pillArch"),hud=$("#sbHud");
  if(pillH) pillH.textContent=a.hz+"Hz";
  if(pillA) pillA.textContent=name;
  if(hud) hud.textContent=a.op+" · "+name;
  const st=$("#sbStatus"); if(st) st.textContent=`${a.op} · ${name}`;
  const sb=$("#sbSub"); if(sb) sb.textContent=`${a.hz}Hz`;
  currentArch=name;
  if(origin) fireRipple(origin.x,origin.y);
  try{ window.Store && window.Store.set(window.KBLX_KEYS.arch, name); }catch(_){}
}
function fireRipple(x,y){const r=$("#chromaRipple"); if(!r) return;r.style.setProperty("--ripple-x",(x??50)+"%");r.style.setProperty("--ripple-y",(y??50)+"%");r.classList.remove("fire"); void r.offsetWidth; r.classList.add("fire");}
let toastTimer;
function toast(msg){const t=$("#toast"); if(!t) return;t.textContent=msg; t.classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>t.classList.remove("show"),1600);}
window.applyArch=applyArch; window.getArch=()=>currentArch;
window.ARCH_LIST=ORDER; window.ARCH_MAP=ARCH;
window.KBLX_TOKVAL=tokVal; window.KBLX_RIPPLE=fireRipple; window.KBLX_TOAST=toast;
})();

/* ===== norm.js ===== */
(function(){
if(!("speechSynthesis" in window)) return;
const VOZ={ATLAS:{nome:"Daniel",lang:"en-US",rate:1.02,pitch:1.39},NOVA:{nome:"Luciana",lang:"pt-BR",rate:1.063,pitch:1.34},VITALIS:{nome:"Rocko",lang:"pt-BR",rate:0.96,pitch:1.42},PULSE:{nome:"Reed",lang:"pt-BR",rate:1.0,pitch:1.78},ARTEMIS:{nome:"Paulina",lang:"es-MX",rate:1.0,pitch:1.23},SERENA:{nome:"Joana",lang:"pt-BR",rate:0.92,pitch:0.90},KAOS:{nome:"Rocko",lang:"pt-BR",rate:1.28,pitch:0.67},GENUS:{nome:"Reed",lang:"pt-BR",rate:0.98,pitch:1.20},LUMINE:{nome:"Flo",lang:"fr-FR",rate:1.03,pitch:1.55},SOLUS:{nome:"Satu",lang:"fi-FI",rate:0.90,pitch:0.58},RHEA:{nome:"Alice",lang:"it-IT",rate:1.02,pitch:1.44},AION:{nome:"Milena",lang:"ru-RU",rate:1.07,pitch:1.08},KODUX:{nome:"Rocko",lang:"pt-BR",rate:1.0,pitch:0.07},BLLUE:{nome:"Zuzana",lang:"cs-CZ",rate:0.94,pitch:1.69},JESUS:{nome:"Sara",lang:"da-DK",rate:1.09,pitch:0.03},KOBLLUX:{nome:"Luciana",lang:"pt-BR",rate:0.98,pitch:0.48}};
function norm(s){return String(s||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase()}
function findVoice(cfg){const vs=speechSynthesis.getVoices(); if(!vs.length) return null;const vl=Array.from(vs); const n=norm(cfg.nome), lg=norm(cfg.lang).split("-")[0];return vl.find(v=>norm(v.name).includes(n)&&norm(v.lang).startsWith(lg))||vl.find(v=>norm(v.lang).startsWith(lg))||vl.find(v=>norm(v.lang).startsWith("pt"))||vl[0];}
function voiceFor(archName,text){const cfg=VOZ[archName]||VOZ.JESUS;const u=new SpeechSynthesisUtterance(text);u.lang=cfg.lang; u.rate=cfg.rate; u.pitch=cfg.pitch;const v=findVoice(cfg);if(v){u.voice=v;u.lang=v.lang||cfg.lang;}return u;}
window.KBLX_VOICE={map:VOZ,forArch:voiceFor,find:findVoice};
})();

/* ===== normalize.js ===== */
(function(){
"use strict";
const $=s=>document.querySelector(s);
const source=$("#sourceText"),conversation=$("#conversation"),counter=$("#counter");
const roundLabel=$("#roundLabel"),lexicalBank=$("#lexicalBank"),bankInfo=$("#bankInfo");
const chatWindow=$("#chatWindow");
const state={units:[],index:0,cycle:0,history:[],bank:{prepositions:[],connectors:[],pronouns:[],articles:[],verbs:[],words:[],questions:[]}};
let generating=false;
function normalize(t){return String(t||"").replace(/\r\n/g,"\n").replace(/\r/g,"\n").replace(/[ \t]+/g," ").replace(/\n{3,}/g,"\n\n").trim()}
function splitText(text){text=normalize(text); if(!text) return [];return text.split(/(?<=[.!?;:])\s+|\n+/).map(x=>x.trim()).filter(Boolean).map((t,i)=>({id:i,text:t,type:t.includes("?")?"question":"statement"}));}
const PREPS=new Set("a ante após até com contra de desde em entre para per perante por sem sob sobre trás ao aos à às do dos da das no nos na nas pelo pelos pela pelas".split(" "));
const CONNS=new Set("e ou mas porém contudo todavia porque portanto então assim logo embora enquanto quando como se caso que também ainda já nem pois além antes depois".split(" "));
const PRONS=new Set("eu tu ele ela nós vos eles elas me te se nos vos lhe lhes isso isto aquilo esse essa este esta aquele aquela quem que qual quais algo nada tudo ninguém alguém".split(" "));
const ARTS=new Set("o a os as um uma uns umas".split(" "));
const STOP=new Set([...PREPS,...CONNS,...PRONS,...ARTS]);
function wordsFrom(text){return normalize(text).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").match(/[a-zA-ZÀ-ÿ]+(?:[-'][a-zA-ZÀ-ÿ]+)*/g)||[]}
function detectVerb(w){if(w.length<4) return false;return /(?:ar|er|ir)$/.test(w)||/(?:ou|ei|iu|ava|ia|aram|eram|iram|ando|endo|indo)$/.test(w)||["é","ser","sou","são","tem","tenho","há","pode","podem","deve","devem","faz","fazem","vai","vão","foi","foram","era","eram","está","estão","existe","existem"].includes(w);}
function extractBank(text){const u=[...new Set(wordsFrom(text))];state.bank={prepositions:u.filter(x=>PREPS.has(x)),connectors:u.filter(x=>CONNS.has(x)),pronouns:u.filter(x=>PRONS.has(x)),articles:u.filter(x=>ARTS.has(x)),verbs:u.filter(x=>detectVerb(x)),words:u.filter(x=>x.length>=4&&!STOP.has(x)),questions:splitText(text).filter(x=>x.type==="question").map(x=>x.text)};renderBank();}
function pick(l){return l&&l.length?l[Math.floor(Math.random()*l.length)]:""}
function srcWord(){return pick(state.bank.words)}
function srcPrep(){return pick(state.bank.prepositions)}
function srcConn(){return pick(state.bank.connectors)}
function cleanP(t){return String(t).replace(/[!?]+/g,"").replace(/[.]+$/,"").trim()}
function lowerFirst(t){return t.charAt(0).toLowerCase()+t.slice(1)}
function invert(text){const c=cleanP(text); if(!c) return "Existe outro lado dessa ideia.";const low=c.toLowerCase();if(/\bnão\b/.test(low)){const pos=c.replace(/\bnão\b/ig,"").replace(/\s{2,}/g," ").trim();return "Então existe a possibilidade de "+lowerFirst(pos)+"."}if(/\b(sim|é|existe|há|pode|deve)\b/i.test(low)) return "Mas também podemos considerar que não "+lowerFirst(c)+".";const w=srcWord(),p=srcPrep();if(w&&p) return "O outro polo observa "+p+" "+w+" e propõe o contrário de "+lowerFirst(c)+".";return "O outro lado propõe o contrário de "+lowerFirst(c)+".";}
function reverseQuestion(text){const c=cleanP(text); const low=c.toLowerCase();if(/^o que\b/.test(low)) return "E o que acontece depois disso?";if(/^como\b/.test(low)) return "E por que isso acontece dessa maneira?";if(/^por que\b/.test(low)) return "E o que faria isso acontecer?";if(/^quando\b/.test(low)) return "E o que acontece antes disso?";if(/^onde\b/.test(low)) return "E o que existe além desse lugar?";if(/^quem\b/.test(low)) return "E quem responde por isso?";if(/^qual\b/.test(low)) return "E qual seria a possibilidade contrária?";const w=srcWord(),p=srcPrep();if(w&&p) return "E se "+p+" "+w+" essa ideia pudesse ser vista de outro modo?";return "E se "+lowerFirst(c)+" pudesse ser visto de outra maneira?";}
function alphaAbout(text){const c=cleanP(text),w=srcWord(),cn=srcConn();if(w&&cn) return "Eu afirmo que "+lowerFirst(c)+", "+cn+" "+w+" permanece dentro da questão.";return "Eu afirmo que "+lowerFirst(c)+" merece continuar sendo observado.";}
function alphaAnswer(question){const c=cleanP(question),w=srcWord(),p=srcPrep();if(w&&p) return "Eu respondo afirmando que "+lowerFirst(c)+" pode ser compreendido "+p+" "+w+".";return "Eu respondo afirmando que "+lowerFirst(c)+" já contém uma possibilidade de resposta.";}
const PAT=[5,3,6,9,7]; let patIdx=0;
function nextArch(){const list=window.ARCH_LIST;const i=list.indexOf(window.getArch());const step=PAT[patIdx++%PAT.length];return list[(i+step)%list.length];}
function archColor(name){const map=window.ARCH_MAP;if(!map||!map[name]) return "var(--active-color)";return `var(${map[name].tok})`;}
function createCycle(){
  if(!state.units.length) state.units=splitText(source.value);
  if(!state.units.length){window.KBLX_TOAST("Insira um texto primeiro.");return false}
  const arch=nextArch();
  const seed=state.units[state.index%state.units.length]; state.index++;
  const alpha=seed.type==="question"?alphaAnswer(seed.text):alphaAbout(seed.text);
  pushMessage("alpha",alpha,seed.type==="question"?"resposta":"semente",arch);
  const betaInv=invert(alpha); pushMessage("beta",betaInv,"inversa",arch);
  const betaQ=reverseQuestion(betaInv); pushMessage("beta",betaQ,"pergunta",arch);
  const alphaF=alphaAnswer(betaQ); pushMessage("alpha",alphaF,"afirmação",arch);
  state.cycle++; roundLabel.textContent=state.cycle+(state.cycle===1?" ciclo":" ciclos");
  updateNavDots(); window.applyArch(arch); if(window.__sbSync) window.__sbSync(arch);
  if(window.KBLX_SAVE) window.KBLX_SAVE();
  return true;
}
function pushMessage(role,text,type,arch){const item={role,text,type,arch,ts:Date.now()};state.history.push(item);const idx=state.history.length-1;renderMessage(item,idx);maybeScrollChat();}
function maybeScrollChat(){if(!chatWindow) return;const nearBottom=(chatWindow.scrollHeight-chatWindow.scrollTop-chatWindow.clientHeight)<200;if(nearBottom) requestAnimationFrame(()=>{chatWindow.scrollTop=chatWindow.scrollHeight});}
function forceScrollChat(){if(!chatWindow) return;requestAnimationFrame(()=>{chatWindow.scrollTop=chatWindow.scrollHeight});}
function renderMessage(item,idx){
  const el=document.createElement("article");
  el.className="message "+item.role;
  el.dataset.arch=item.arch; el.dataset.idx=idx;
  el.style.setProperty("--arch-color",archColor(item.arch));
  const who=item.role==="alpha"?"α ALFA":"β BETA";
  const chip=`<span class="arch-chip"><i></i>${item.arch}</span>`;
  el.innerHTML=`<div class="msg-top"><span class="msg-who">${who}</span>${chip}<span class="msg-type">${item.type}</span></div><div class="msg-text"></div><div class="msg-actions"><button class="msg-mini" data-act="speak">◉ OUVIR</button><button class="msg-mini" data-act="copy">⧉ COPIAR</button><button class="msg-mini slicer" data-act="slicer">→ SLICER</button></div>`;
  el.querySelector(".msg-text").textContent=item.text;
  const speakBtn=el.querySelector('[data-act="speak"]');
  let lpTimer=null, lpFired=false;
  speakBtn.addEventListener("pointerdown",e=>{e.preventDefault();lpFired=false;lpTimer=setTimeout(()=>{lpFired=true;speakSingle(item.text,el);if(navigator.vibrate) try{navigator.vibrate(12)}catch(_){}},500);});
  speakBtn.addEventListener("pointerup",()=>{clearTimeout(lpTimer);if(!lpFired) speakFromIndex(idx);});
  speakBtn.addEventListener("pointerleave",()=>clearTimeout(lpTimer));
  speakBtn.addEventListener("pointercancel",()=>clearTimeout(lpTimer));
  speakBtn.addEventListener("contextmenu",e=>e.preventDefault());
  el.querySelector('[data-act="copy"]').addEventListener("click",async()=>{try{await navigator.clipboard.writeText(item.text);window.KBLX_TOAST("Copiado ✓")}catch(_){}});
  el.querySelector('[data-act="slicer"]').addEventListener("click",()=>{
    const header = `# ${who} · ${item.arch}\n_${item.type}_\n\n`;
    window.Nebula && window.Nebula.loadDocument(header + item.text, `${who} · ${item.arch}`);
    window.KBLX_TOAST("Enviado ✓");
    document.getElementById('s0')?.scrollIntoView({behavior:'smooth',block:'start'});
  });
  conversation.appendChild(el);
}
function renderBank(){const b=state.bank;const all=[...b.prepositions,...b.connectors,...b.pronouns,...b.articles,...b.verbs,...b.words];const tok=(arr,cls)=>arr.map(x=>`<span class="token ${cls}">${x}</span>`).join("");lexicalBank.innerHTML=tok(b.prepositions,"prep")+tok(b.connectors,"conn")+tok(b.pronouns,"pron")+tok(b.articles,"word")+tok(b.verbs,"word")+tok(b.words,"word");bankInfo.textContent=all.length+" elementos";}
function updateNavDots(){document.querySelectorAll(".nav-dot").forEach((d,i)=>d.classList.toggle("on",i===state.cycle%3));}
function speakSingle(text,el){
  if(!("speechSynthesis" in window)){window.KBLX_TOAST("Áudio indisponível");return}
  speechSynthesis.cancel(); speaking=false;
  document.querySelectorAll(".message.playing").forEach(x=>x.classList.remove("playing"));
  if(el) el.classList.add("playing");
  const arch=el?.dataset.arch||window.getArch();
  const u=window.KBLX_VOICE.forArch(arch,text);
  const orb=document.getElementById("sbOrb"); if(orb) orb.classList.add("speaking");
  u.onend=u.onerror=()=>{if(el) el.classList.remove("playing");if(orb) orb.classList.remove("speaking")};
  speechSynthesis.speak(u);
  window.KBLX_TOAST(`🎙 ${arch} · bloco`);
}
let speakIdx=0,speaking=false;
function speakFromIndex(startIdx){
  if(!("speechSynthesis" in window)){window.KBLX_TOAST("Áudio indisponível");return}
  if(!state.history.length){window.KBLX_TOAST("Gere a conversa primeiro");return}
  speechSynthesis.cancel();
  document.querySelectorAll(".message.playing").forEach(x=>x.classList.remove("playing"));
  speaking=true; speakIdx=startIdx;
  const orb=document.getElementById("sbOrb"); if(orb) orb.classList.add("speaking");
  speakNext();
}
function speakConversation(){speakFromIndex(0)}
function speakNext(){
  if(!speaking||speakIdx>=state.history.length){speaking=false;const orb=document.getElementById("sbOrb");if(orb) orb.classList.remove("speaking");return;}
  const item=state.history[speakIdx];
  const el=conversation.querySelectorAll(".message")[speakIdx];
  if(el){el.classList.add("playing");el.scrollIntoView({behavior:"smooth",block:"center"});window.applyArch(item.arch);}
  const u=window.KBLX_VOICE.forArch(item.arch,item.text);
  u.onend=u.onerror=()=>{if(el) el.classList.remove("playing");speakIdx++;speakNext();};
  speechSynthesis.speak(u);
}
$("#stepBtn").addEventListener("click",async()=>{
  if(generating) return;
  if(!state.bank.words.length) extractBank(source.value);
  if(!state.units.length) state.units=splitText(source.value);
  if(!state.units.length){window.KBLX_TOAST("Insira um texto primeiro.");return}
  generating=true;
  try{const N=15;for(let i=0;i<N;i++){createCycle();await new Promise(r=>setTimeout(r,60))}
    window.KBLX_TOAST(`${N} ciclos gerados ⇄`);forceScrollChat();} finally {generating=false;}
});
$("#navStep").addEventListener("click",()=>$("#stepBtn").click());
$("#generateBtn").addEventListener("click",generateAll);
$("#parseBtn").addEventListener("click",()=>{const u=splitText(source.value);if(!u.length){window.KBLX_TOAST("Nenhum texto");return}state.units=u;state.index=0;extractBank(source.value);window.KBLX_TOAST(u.length+" unidades · banco criado ✓");});
$("#pasteBtn").addEventListener("click",async()=>{try{const t=await navigator.clipboard.readText();if(!t){window.KBLX_TOAST("Clipboard vazio");return}source.value=t;updateCounter();$("#parseBtn").click();window.KBLX_TOAST("Colado ✓");}catch(_){window.KBLX_TOAST("Use colar do sistema")}});
$("#listenBtn").addEventListener("click",speakConversation);
async function generateAll(){
  if(generating) return;
  const units=splitText(source.value);
  if(!units.length){window.KBLX_TOAST("Cole um texto");source.focus();return}
  extractBank(source.value);
  state.units=units; state.index=0; state.cycle=0; state.history=[];
  conversation.innerHTML="";
  generating=true;
  try{const total=units.length;for(let i=0;i<total;i++){createCycle();await new Promise(r=>setTimeout(r,45))}
    window.KBLX_TOAST(`${total} ciclos gerados ✓`);forceScrollChat();} finally {generating=false;}
}
function updateCounter(){const n=source.value.length;counter.textContent=n+(n===1?" caractere":" caracteres")}
source.addEventListener("input",updateCounter);
if(!source.value){source.value=`Uma ideia começa pequena.
Ela encontra outra ideia?
Quando duas ideias conversam, algo muda.
O futuro precisa ser diferente?
Talvez a resposta esteja na própria pergunta.`;updateCounter();}
const importSource = document.getElementById('importSource');
const importBtn = document.getElementById('importBtn');
if(importBtn && importSource){
  importBtn.addEventListener('click', ()=>importSource.click());
  importSource.addEventListener('change', async (e)=>{
    const f = e.target.files[0]; if(!f) return;
    try{const txt = await f.text();source.value = txt; updateCounter();
      const u = splitText(txt);state.units = u; state.index = 0; extractBank(txt);
      window.KBLX_TOAST(`Importado: ${f.name} ✓`);
    }catch(err){ window.KBLX_TOAST("Falha ao ler"); }
    importSource.value = "";
  });
}
const sendSlicerBtn = document.getElementById('sendSlicerBtn');
if(sendSlicerBtn){sendSlicerBtn.addEventListener('click', ()=>{const txt = source.value.trim();if(!txt){ window.KBLX_TOAST("Nada para enviar"); return; }window.Nebula && window.Nebula.loadDocument(txt, "Polo");window.KBLX_TOAST("Enviado ✓");document.getElementById('s0')?.scrollIntoView({behavior:'smooth'});});}
const allToSlicerBtn = document.getElementById('allToSlicerBtn');
if(allToSlicerBtn){allToSlicerBtn.addEventListener('click', ()=>{if(!state.history.length){ window.KBLX_TOAST("Sem conversa"); return; }const md = state.history.map(m=>{const who = m.role==="alpha"?"ALFA":"BETA";return `# ${who} · ${m.arch}\n_${m.type}_\n\n${m.text}`;}).join("\n\n---\n\n");window.Nebula && window.Nebula.loadDocument(md, "Conversa");window.KBLX_TOAST("Enviado ✓");document.getElementById('s0')?.scrollIntoView({behavior:'smooth'});});}
window.AlfaBetaState=state;
window.KBLX_ACTIONS={speak:speakConversation,speakFrom:speakFromIndex,stop:()=>{speaking=false;if("speechSynthesis" in window) speechSynthesis.cancel();document.querySelectorAll(".message.playing").forEach(x=>x.classList.remove("playing"));const orb=document.getElementById("sbOrb"); if(orb) orb.classList.remove("speaking");}};

window.KBLX_REBUILD_DIALOGUE = function(saved){
  if(!saved || !saved.history || !saved.history.length) return;
  state.units = saved.units || [];
  state.index = saved.index || 0;
  state.cycle = saved.cycle || 0;
  state.history = saved.history || [];
  state.bank = saved.bank || state.bank;
  conversation.innerHTML = "";
  state.history.forEach((item, i)=>renderMessage(item, i));
  roundLabel.textContent = state.cycle + (state.cycle===1?" ciclo":" ciclos");
  if(saved.sourceText){ source.value = saved.sourceText; updateCounter(); }
  renderBank();
  forceScrollChat();
};
})();

/* ===== updprogress.js ===== */
(function(){
"use strict";
const $=s=>document.querySelector(s);
const $$=s=>[...document.querySelectorAll(s)];
window.addEventListener("load",()=>{setTimeout(()=>document.getElementById("loader").classList.add("hide"),600)});
function updProgress(){const doc=document.documentElement;document.getElementById("progress").style.width=((window.scrollY/(doc.scrollHeight-window.innerHeight))*100)+"%";}
let ticking=false;
window.addEventListener("scroll",()=>{if(!ticking){requestAnimationFrame(()=>{updProgress();ticking=false});ticking=true}},{passive:true});
updProgress();
const io=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add("in");const idx=$$(".section").indexOf(e.target);if(idx>=0) $$(".nav-dot").forEach((d,i)=>d.classList.toggle("on",i===idx));}})},{threshold:0.15});
$$(".reveal").forEach(el=>io.observe(el));

const ORDER=window.ARCH_LIST||[];
const MAP=window.ARCH_MAP||{};
const bar=$("#symbolBar");
const carousel=$("#sbCarousel"), track=$("#sbTrack"), dots=$("#sbDots");
const orb=$("#sbOrb"), grip=$("#sbGrip");
let sbIdx=0;
function buildSb(){
  if(!track||!dots) return;
  track.innerHTML=""; dots.innerHTML="";
  ORDER.forEach((name,i)=>{
    const a=MAP[name]||{sym:"∆",op:"0x00",tok:"--KBLX_B",hz:432};
    const btn=document.createElement("button");
    btn.className="sb-btn"; btn.textContent=a.sym; btn.dataset.arch=name;
    btn.style.setProperty("--btn-c",`var(${a.tok})`);
    btn.title=`${name} · ${a.hz}Hz`;
    btn.addEventListener("click",()=>{sbIdx=i; centerSb(true); window.applyArch(name);const r=btn.getBoundingClientRect();window.KBLX_RIPPLE((r.left+r.width/2)/window.innerWidth*100,(r.top+r.height/2)/window.innerHeight*100);});
    track.appendChild(btn);
    const dot=document.createElement("span");
    dot.className="sb-dot"+(i===0?" on":"");
    dot.addEventListener("click",()=>{sbIdx=i;centerSb(true);window.applyArch(name);});
    dots.appendChild(dot);
  });
}
function centerSb(useScroll){if(!track||!carousel) return;const btn=track.children[sbIdx]; if(!btn) return;[...dots.children].forEach((d,i)=>d.classList.toggle("on",i===sbIdx));[...track.children].forEach((b,i)=>b.classList.toggle("on",i===sbIdx));if(useScroll){const targetTop = btn.offsetTop - (carousel.clientHeight - btn.offsetHeight)/2;carousel.scrollTo({top: Math.max(0,targetTop), behavior:'smooth'});}}
window.__sbSync=function(name){const i=ORDER.indexOf(name);if(i>=0){sbIdx=i;centerSb(true);}};
if(carousel){let scrollT=null;carousel.addEventListener('scroll',()=>{clearTimeout(scrollT);scrollT=setTimeout(()=>{const center = carousel.scrollTop + carousel.clientHeight/2;let best=0, bestDist=Infinity;[...track.children].forEach((b,i)=>{const bc = b.offsetTop + b.offsetHeight/2;const d = Math.abs(bc - center);if(d < bestDist){ bestDist = d; best = i; }});if(best!==sbIdx){sbIdx = best;[...dots.children].forEach((d,i)=>d.classList.toggle("on",i===sbIdx));[...track.children].forEach((b,i)=>b.classList.toggle("on",i===sbIdx));}},80);},{passive:true});}

$("#sbToggle").addEventListener("click",(e)=>{e.stopPropagation();const c=bar.classList.toggle("collapsed");$("#sbToggle").textContent=c?"▼":"▲";if(!c) setTimeout(()=>centerSb(false),150);});

let pressTimer=null,longFired=false,orbPatIdx=0;
const ORB_PATTERN=[5,3,6,9,7];
function orbCycle3697(){const list=window.ARCH_LIST||[]; if(!list.length) return;const step=ORB_PATTERN[orbPatIdx++%ORB_PATTERN.length];const cur=list.indexOf(window.getArch());const next=list[(cur+step)%list.length];const r=orb.getBoundingClientRect();window.applyArch(next,{x:(r.left+r.width/2)/window.innerWidth*100,y:(r.top+r.height/2)/window.innerHeight*100});window.__sbSync(next);window.KBLX_TOAST(`∆³ ${next} · +${step}`);}
orb.addEventListener("pointerdown",e=>{e.preventDefault();longFired=false;const r=orb.getBoundingClientRect();window.KBLX_RIPPLE((r.left+r.width/2)/window.innerWidth*100,(r.top+r.height/2)/window.innerHeight*100);pressTimer=setTimeout(()=>{longFired=true;openWheel();if(navigator.vibrate) try{navigator.vibrate(15)}catch(_){}},800);});
orb.addEventListener("pointerup",()=>{clearTimeout(pressTimer);if(!longFired) orbCycle3697();});
orb.addEventListener("pointerleave",()=>clearTimeout(pressTimer));
orb.addEventListener("pointercancel",()=>clearTimeout(pressTimer));
orb.addEventListener("contextmenu",e=>e.preventDefault());

let dragging=false,sx=0,sy=0,ox=0,oy=0;
function clamp(v,a,b){return Math.max(a,Math.min(b,v))}
function clearSnap(){bar.classList.remove("snap-left","snap-right","snap-top","snap-bottom")}
grip.addEventListener("pointerdown",e=>{e.preventDefault(); e.stopPropagation(); clearSnap();dragging=true; sx=e.clientX; sy=e.clientY;const r=bar.getBoundingClientRect(); ox=r.left; oy=r.top;bar.style.transform="none"; bar.style.top=oy+"px"; bar.style.left=ox+"px";bar.style.right="auto"; bar.style.bottom="auto";bar.classList.add("is-dragging");try{grip.setPointerCapture(e.pointerId)}catch(_){}});
grip.addEventListener("pointermove",e=>{if(!dragging) return;bar.style.left=(ox+e.clientX-sx)+"px";bar.style.top=(oy+e.clientY-sy)+"px";});
function endDrag(e){
  if(!dragging) return; dragging=false; bar.classList.remove("is-dragging");
  const vw=window.innerWidth, vh=window.innerHeight;
  const r=bar.getBoundingClientRect(); const cx=r.left+r.width/2;
  clearSnap();
  const headerH = 44 + 44 + 12;
  const nearTop = r.top < 100;
  const nearBottom = r.bottom > vh - 100;
  const nearLeft = cx < vw/2;
  if(nearTop){bar.classList.add("snap-top");bar.style.top=""; bar.style.bottom="auto"; bar.style.left=""; bar.style.right="8px"; bar.style.transform="";}
  else if(nearBottom){bar.classList.add("snap-bottom");bar.style.top="auto"; bar.style.bottom=""; bar.style.left=""; bar.style.right="8px"; bar.style.transform="";}
  else{const safeY = clamp(r.top, headerH, vh-r.height-80);bar.style.top = safeY+"px"; bar.style.bottom="auto"; bar.style.transform="";if(nearLeft){ bar.classList.add("snap-left"); bar.style.left="0"; bar.style.right="auto"; }else { bar.classList.add("snap-right"); bar.style.right="0"; bar.style.left="auto"; }}
  try{grip.releasePointerCapture(e.pointerId)}catch(_){}
  if(window.KBLX_SAVE) window.KBLX_SAVE();
}
grip.addEventListener("pointerup",endDrag);
grip.addEventListener("pointercancel",endDrag);

function unifiedPlay(){const nb = window.Nebula;if(nb && nb.hasSlices && nb.hasSlices()){ nb.toggleSpeech(); return; }window.KBLX_ACTIONS && window.KBLX_ACTIONS.speak();}
function unifiedStop(){const nb = window.Nebula;if(nb && nb.hasSlices && nb.hasSlices()){ nb.stopSpeech(); }window.KBLX_ACTIONS && window.KBLX_ACTIONS.stop();window.KBLX_TOAST("Parado");}
$("#sbSpeak").addEventListener("click",unifiedPlay);
$("#sbStop").addEventListener("click",unifiedStop);
$("#sbCopy").addEventListener("click",async()=>{const st=window.AlfaBetaState||{}; const hist=st.history||[];if(!hist.length){window.KBLX_TOAST("Sem conversa");return}const txt=hist.map(m=>`${m.role==="alpha"?"ALFA":"BETA"} [${m.arch}]: ${m.text}`).join("\n\n");try{await navigator.clipboard.writeText(txt);window.KBLX_TOAST("Copiado ✓")}catch(_){const ta=document.createElement("textarea");ta.value=txt;document.body.appendChild(ta);ta.select();try{document.execCommand("copy")}catch(e){}ta.remove();window.KBLX_TOAST("Copiado ✓");}});
$("#sbClear").addEventListener("click",()=>{if(window.KBLX_ACTIONS) window.KBLX_ACTIONS.stop();if(window.Nebula && window.Nebula.hasSlices && window.Nebula.hasSlices()) window.Nebula.clear();const st=window.AlfaBetaState;if(st){st.units=[];st.index=0;st.cycle=0;st.history=[];st.bank={prepositions:[],connectors:[],pronouns:[],articles:[],verbs:[],words:[],questions:[]}}const conv=document.getElementById("conversation"); if(conv) conv.innerHTML='<div class="empty">O diálogo ainda não nasceu.</div>';const lex=document.getElementById("lexicalBank"); if(lex) lex.innerHTML='<span style="color:var(--DIM);font-size:11px">EXTRAIR BANCO para começar.</span>';const bi=document.getElementById("bankInfo"); if(bi) bi.textContent="aguardando";const rl=document.getElementById("roundLabel"); if(rl) rl.textContent="0 ciclos";const src=document.getElementById("sourceText"); if(src) src.value="";const cnt=document.getElementById("counter"); if(cnt) cnt.textContent="0 caracteres";window.KBLX_TOAST("Sistema reiniciado ✓");if(window.KBLX_SAVE) window.KBLX_SAVE();});
$("#sbDownload").addEventListener("click",()=>{const st=window.AlfaBetaState||{}; const hist=st.history||[];if(!hist.length){window.KBLX_TOAST("Sem conversa");return}const txt=hist.map(m=>`${m.role==="alpha"?"ALFA":"BETA"} [${m.arch}]: ${m.text}`).join("\n\n");const payload=`KOBLLUX · ALFA⇄BETA · v13\n=========================\n\n${txt}\n\nGerado: ${new Date().toISOString()}`;const blob=new Blob([payload],{type:"text/plain;charset=utf-8"});const url=URL.createObjectURL(blob);const a=document.createElement("a"); a.href=url; a.download=`kobllux-${Date.now()}.txt`;document.body.appendChild(a); a.click(); a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);window.KBLX_TOAST("Download ✓");});

const wheel=$("#archWheel");
ORDER.forEach(name=>{const a=MAP[name]||{hz:432,sym:"∆",tok:"--KBLX_B"};const chip=document.createElement("button");chip.className="arch-pick"; chip.style.color=`var(${a.tok})`;chip.innerHTML=`<div class="a-orb" style="background:var(${a.tok})"></div><div class="a-name">${name}</div><div class="a-freq">${a.hz}Hz</div>`;chip.addEventListener("click",()=>{const r=chip.getBoundingClientRect();window.applyArch(name,{x:(r.left+r.width/2)/window.innerWidth*100,y:(r.top+r.height/2)/window.innerHeight*100});sbIdx=ORDER.indexOf(name); centerSb(true); closeWheel();});wheel.appendChild(chip);});
function openWheel(){$("#arch-overlay").classList.add("open")}
function closeWheel(){$("#arch-overlay").classList.remove("open")}
$("#arch-overlay").addEventListener("click",e=>{if(e.target.id==="arch-overlay") closeWheel()});
$("#blClose").addEventListener("click",()=>$("#baulite-container").classList.remove("open"));
document.addEventListener("keydown",e=>{if(e.key==="Escape") closeWheel();});

buildSb();
bar.classList.remove("collapsed");
$("#sbToggle").textContent="▲";
setTimeout(()=>centerSb(true),150);

const sbImportInput = document.getElementById('sbImportInput');
if(sbImportInput){sbImportInput.addEventListener('change', async (e)=>{const f = e.target.files[0]; if(!f) return;try{const txt = await f.text();window.Nebula && window.Nebula.loadDocument(txt, f.name);window.KBLX_TOAST(`Slicer: ${f.name} ✓`);document.getElementById('s0')?.scrollIntoView({behavior:'smooth'});}catch(err){window.KBLX_TOAST("Falha");}sbImportInput.value = "";});}
(function sbExtrasToggle(){const head = document.getElementById('sbExtrasHead');if(!head) return;try{if(localStorage.getItem('kobllux_sb_extras_hidden')==='1') bar.classList.add('extras-hidden');}catch(_){}let lp=null, fired=false;head.addEventListener('pointerdown', ()=>{fired=false;lp=setTimeout(()=>{fired=true;window.openFactory?.();if(navigator.vibrate) try{navigator.vibrate(15)}catch(_){}},550);});head.addEventListener('pointerup', ()=>clearTimeout(lp));head.addEventListener('pointerleave', ()=>clearTimeout(lp));head.addEventListener('click', (e)=>{if(fired){e.stopPropagation();fired=false;return;}const hidden = bar.classList.toggle('extras-hidden');try{ localStorage.setItem('kobllux_sb_extras_hidden', hidden ? '1' : '0'); }catch(_){}window.KBLX_TOAST(hidden ? 'Extras ocultos' : 'Extras visíveis');});})();

const MAIN_HDR = document.getElementById('main-header');
let lastY = 0, ticking2 = false;
window.addEventListener('scroll', ()=>{
  if(ticking2) return;
  requestAnimationFrame(()=>{
    const y = window.scrollY;
    if(y <= 10) MAIN_HDR?.classList.remove('header-hidden');
    else if(y > lastY + 8) MAIN_HDR?.classList.add('header-hidden');
    else if(y < lastY - 8) MAIN_HDR?.classList.remove('header-hidden');
    lastY = y; ticking2 = false;
  });
  ticking2 = true;
}, {passive:true});

window.__sbGetPos = function(){return {top:bar.style.top,bottom:bar.style.bottom,left:bar.style.left,right:bar.style.right,snap:[...bar.classList].filter(c=>c.startsWith('snap-')),collapsed:bar.classList.contains('collapsed'),extrasHidden:bar.classList.contains('extras-hidden'),carouselHidden:bar.classList.contains('carousel-hidden')};};
window.__sbRestore = function(pos){
  if(!pos) return;
  if(pos.top) bar.style.top=pos.top;
  if(pos.bottom) bar.style.bottom=pos.bottom;
  if(pos.left) bar.style.left=pos.left;
  if(pos.right) bar.style.right=pos.right;
  if(pos.snap) pos.snap.forEach(c=>bar.classList.add(c));
  if(pos.collapsed){ bar.classList.add('collapsed'); $("#sbToggle").textContent="▼"; }
  if(pos.extrasHidden) bar.classList.add('extras-hidden');
  if(pos.carouselHidden) bar.classList.add('carousel-hidden');
};
})();

/* ===== cai-pro-simples-abaixo.js ===== */
(function(){
"use strict";
const state = {slices:[],current:0,speaking:false,paused:false,documentTitle:'ESPAÇO DA MENTE',sliceArches:[],raw:'',title:''};
const stage = document.getElementById('sliceStage');
const emptyState = document.getElementById('emptyState');
const fileInput = document.getElementById('fileInput');
const player = document.getElementById('player');
const playButton = document.getElementById('playButton');
const playerTitle = document.getElementById('playerTitle');
const playerState = document.getElementById('playerState');
const progressBar = document.getElementById('progressBar');
const documentTitle = document.getElementById('documentTitle');
if(!stage) return;
const ARCH_SYMBOLS={ATLAS:"α",NOVA:"✦",VITALIS:"♾",PULSE:"◈",ARTEMIS:"☾",SERENA:"❋",KAOS:"⚡",GENUS:"⚙",LUMINE:"☀",SOLUS:"◌",RHEA:"∞",AION:"⧗",KODUX:"⇄",BLLUE:"◉",JESUS:"✝",KOBLLUX:"∆"};
const ARCH_NAMES_SORTED=["KOBLLUX","VITALIS","ARTEMIS","SERENA","LUMINE","KODUX","ATLAS","GENUS","PULSE","JESUS","SOLUS","BLLUE","NOVA","RHEA","KAOS","AION"];
function escapeRegex(s){ return String(s).replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }
function detectArchInText(raw){if(!raw) return null;const text = String(raw);for(const name of ARCH_NAMES_SORTED){const sym = ARCH_SYMBOLS[name];if(!sym) continue;const reSym = new RegExp(escapeRegex(sym) + "\\s*[·:\\-—]?\\s*" + name + "\\b", "i");if(reSym.test(text)) return name;}for(const name of ARCH_NAMES_SORTED){const reHead = new RegExp("^#{1,6}\\s*" + escapeRegex(name) + "\\b", "im");if(reHead.test(text)) return name;}for(const name of ARCH_NAMES_SORTED){const reLead = new RegExp("^" + escapeRegex(name) + "\\s*[·:\\-—]\\s", "im");if(reLead.test(text)) return name;}for(const name of ARCH_NAMES_SORTED){const reWord = new RegExp("\\b" + escapeRegex(name) + "\\b", "i");if(reWord.test(text)) return name;}return null;}
function archColor(name){const map = window.ARCH_MAP;if(!map || !map[name]) return "var(--kob-voice-primary)";return `var(${map[name].tok})`;}
function buildSliceArches(slices){return slices.map(raw => detectArchInText(raw));}
function openFile(){ fileInput.click(); }
function pasteText(){const text = prompt('Cole aqui o texto:');if(!text) return;loadDocument(text, 'Documento colado');}
function parseDocument(text){const lines = text.replace(/\r/g,'').split('\n');const slices = []; let current = [];function push(){ const v=current.join('\n').trim(); if(v) slices.push(v); current=[]; }for(const line of lines){if(/^#{1,3}\s+/.test(line)){ if(current.length) push(); current.push(line); continue; }if(/^---+$/.test(line.trim())){ push(); continue; }current.push(line);}if(current.length) push();if(slices.length <= 1){const blocks = text.split(/\n\s*\n/).map(x=>x.trim()).filter(Boolean);if(blocks.length > 1) return blocks;}return slices;}
function escapeHTML(text){return text.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}
/* ── parser único (unificado) ────────────────────────────────
   Antes existiam 3 camadas de markdown sobrepostas: este parser
   simples, o NebulaRender.render (rico) e o decorate() pós-
   processador. Se o rico ainda não tivesse instalado, o slice
   ficava preso na versão simples pra sempre. Agora esta função é
   só uma casca: delega pro parser rico sempre que ele já existir
   (é o caso normal, já que NEBULA-BEAUTY-ENHANCE carrega antes
   de qualquer slice real ser criado) e só cai pro regex simples
   como rede de segurança em boot muito adiantado. */
function markdownToHTML(text){
  if (window.NebulaRender && typeof window.NebulaRender.render === 'function'){
    try { return window.NebulaRender.render(text); } catch(_){ /* cai pro simples abaixo */ }
  }
  let html = escapeHTML(text);html = html.replace(/```([\s\S]*?)```/g,'<pre><code>$1</code></pre>');html = html.replace(/^### (.*)$/gm,'<h3>$1</h3>');html = html.replace(/^## (.*)$/gm,'<h2>$1</h2>');html = html.replace(/^# (.*)$/gm,'<h1>$1</h1>');html = html.replace(/\*\*(.*?)\*\*/g,'<strong>$1</strong>');html = html.replace(/\*(.*?)\*/g,'<em>$1</em>');html = html.replace(/_([^_]+)_/g,'<em>$1</em>');html = html.replace(/`([^`]+)`/g,'<code>$1</code>');html = html.replace(/^&gt; (.*)$/gm,'<blockquote>$1</blockquote>');html = html.split(/\n\s*\n/).map(block=>{block = block.trim(); if(!block) return '';if(/^<(h1|h2|h3|ul|pre|blockquote)/.test(block)) return block;return `<p>${block.replace(/\n/g,'<br>')}</p>`;}).join('');return html;}
function createSlice(content, index){const s = document.createElement('slice');const detected = state.sliceArches[index];const isAuto = !detected;const arch = detected || (window.getArch && window.getArch()) || 'JESUS';const color = archColor(arch);s.dataset.index = index; s.dataset.state = 'created'; s.dataset.arch = arch; s.dataset.auto = isAuto ? "1" : "0";s.style.setProperty("--slice-arch-color", color);s.innerHTML = `<div class="slice-content"><div class="slice-meta"><label>SLICE ${String(index+1).padStart(2,'0')}</label><span class="slice-arch-chip ${isAuto ? 'auto' : ''}"><i></i>${isAuto ? '◆ AUTO' : arch}</span><span class="slice-number">${index+1} / ${state.slices.length}</span></div><div class="slice-body">${markdownToHTML(content)}</div></div>`;return s;}
function loadDocument(text, title){stopSpeech();state.raw = text; state.title = title||'Documento';state.slices = parseDocument(text);state.current = 0;state.documentTitle = title || 'Documento';state.sliceArches = buildSliceArches(state.slices);if(documentTitle) documentTitle.textContent = state.documentTitle;if(playerTitle) playerTitle.textContent = state.documentTitle;stage.replaceChildren();state.slices.forEach((c,i)=>stage.appendChild(createSlice(c,i)));if(emptyState) emptyState.style.display = state.slices.length ? 'none' : 'grid';showSlice(0);if(window.KBLX_SAVE) window.KBLX_SAVE();}
function showSlice(index){if(!state.slices.length) return;if(index < 0) index = state.slices.length - 1;if(index >= state.slices.length) index = 0;state.current = index;stage.querySelectorAll('slice').forEach((s,i)=>{s.classList.toggle('active', i === index);});if(progressBar) progressBar.style.width = `${((index + 1) / state.slices.length) * 100}%`;const detected = state.sliceArches[index];const arch = detected || (window.getArch && window.getArch()) || 'JESUS';if(playerState) playerState.textContent = detected ? `Slice ${index + 1}/${state.slices.length} · ${detected}` : `Slice ${index + 1}/${state.slices.length} · ${arch} (auto)`;if(state.speaking) speakCurrentSlice();}
function nextSlice(){ if(!state.slices.length) return; if(state.current < state.slices.length - 1) showSlice(state.current + 1); else stopSpeech(); }
function previousSlice(){ if(!state.slices.length) return; showSlice(state.current - 1); }
function getCurrentText(){const s = state.slices[state.current]; if(!s) return '';return s.replace(/```[\s\S]*?```/g,' código ').replace(/^#{1,6}\s+/gm,'').replace(/[*_~`]/g,'').replace(/^>\s*/gm,'').replace(/^[-*]\s+/gm,'').replace(/\[([^\]]+)\]\([^)]+\)/g,'$1').replace(/\n+/g,' ').trim();}
function speakCurrentSlice(){if(!('speechSynthesis' in window)){ if(playerState) playerState.textContent = 'Speech indisponível'; return; }speechSynthesis.cancel();const text = getCurrentText(); if(!text) return;const detected = state.sliceArches[state.current];const archName = detected || (window.getArch && window.getArch()) || 'JESUS';if(window.applyArch) window.applyArch(archName);if(window.__sbSync) window.__sbSync(archName);const u = new SpeechSynthesisUtterance(text);if(window.KBLX_VOICE && window.KBLX_VOICE.forArch){const cfg = window.KBLX_VOICE.forArch(archName, text);if(cfg.voice) u.voice = cfg.voice;u.lang = cfg.lang || 'pt-BR'; u.rate = cfg.rate || 1; u.pitch = cfg.pitch || 1;}u.onstart = ()=>{state.speaking = true; state.paused = false; if(playButton) playButton.textContent = 'Ⅱ'; if(playerState) playerState.textContent = `🎙 ${archName} · slice ${state.current + 1}`; const orb = document.getElementById('sbOrb'); if(orb) orb.classList.add('speaking');};u.onend = ()=>{if(state.speaking){if(state.current < state.slices.length - 1){ state.current++; showSlice(state.current); } else stopSpeech();}};u.onerror = ()=>{state.speaking = false; if(playButton) playButton.textContent = '▶'; const orb = document.getElementById('sbOrb'); if(orb) orb.classList.remove('speaking');};speechSynthesis.speak(u);}
function toggleSpeech(){if(!state.slices.length) return;if(state.speaking){if(speechSynthesis.paused){ speechSynthesis.resume(); state.paused = false; if(playButton) playButton.textContent = 'Ⅱ'; return; }speechSynthesis.pause(); state.paused = true; if(playButton) playButton.textContent = '▶'; if(playerState) playerState.textContent = 'Pausado';return;}state.speaking = true; speakCurrentSlice();}
function stopSpeech(){if('speechSynthesis' in window) speechSynthesis.cancel();state.speaking = false; state.paused = false;if(playButton) playButton.textContent = '▶';const orb = document.getElementById('sbOrb'); if(orb) orb.classList.remove('speaking');}
function togglePlayer(){ player.classList.toggle('minimized'); }
function clear(){state.slices=[]; state.current=0; state.sliceArches=[]; state.raw=''; state.title=''; stopSpeech(); stage.replaceChildren(); if(emptyState) emptyState.style.display='grid'; if(playerTitle) playerTitle.textContent='Nenhum'; if(playerState) playerState.textContent='Aguardando'; if(progressBar) progressBar.style.width='0%';}
function hasSlices(){ return state.slices.length > 0; }
fileInput.addEventListener('change', async event => {const f = event.target.files[0]; if(!f) return; const txt = await f.text(); loadDocument(txt, f.name);});
document.addEventListener('keydown', event => {if(event.target.matches('textarea,input,[contenteditable="true"]')) return;if(event.key === 'ArrowRight') nextSlice();if(event.key === 'ArrowLeft') previousSlice();});
let touchStartX = 0;
document.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].screenX; }, {passive:true});
document.addEventListener('touchend', e => {const diff = e.changedTouches[0].screenX - touchStartX;if(Math.abs(diff) < 80) return;if(!e.target.closest('#readerApp')) return;if(diff < 0) nextSlice(); else previousSlice();}, {passive:true});
window.Nebula = {openFile, pasteText, loadDocument, showSlice, nextSlice, previousSlice, toggleSpeech, stopSpeech, togglePlayer, clear, hasSlices, state, detectArchInText};
})();

/* ===== apply-bg-immediately.js ===== */
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
      /* v14: também entra na galeria do bgPanel (di_bgImages), se existir —
         upload único, mas continua alimentando os dois recursos (slider +
         galeria de thumbnails) em vez de duas caixas de upload brigando. */
      if (typeof window.di_getBgImages === 'function' && typeof window.di_saveBgImages === 'function'){
        const list = window.di_getBgImages().map(b=>({...b, active:false}));
        list.unshift({ id:'bg_'+Date.now(), name:f.name||'bg', data:ev.target.result, active:true });
        window.di_saveBgImages(list);
        if (typeof window.di_renderBgPanel === 'function') window.di_renderBgPanel();
      }
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

/* ===== mxp-extras-data-sn.js ===== */
(function(){
"use strict";
const $=s=>document.querySelector(s);
const $$=s=>[...document.querySelectorAll(s)];
const layer = document.getElementById('sessionsLayer');
const stackHost = document.getElementById('stackWrap');
const dock = document.getElementById('dock');
const tabDataMap = new WeakMap();
let activeWindow = null;
let switcherWin = null;

function currentHostMode(){ return document.body.dataset.sessionHost === 'stack' ? 'stack' : 'float'; }
/* v14 — indicador visual do host mode: antes o botão sempre dizia
   "TROCAR HOST" sem mostrar em qual modo você estava.
   🌊 float = janelas soltas, você arrasta pra onde quiser (bom pra desktop)
   📚 stack = janelas em coluna, empilhadas no fluxo (bom pra mobile) */
function syncHostModeLabel(){
  const el = document.getElementById('hostModeLabel');
  if (el) el.textContent = currentHostMode() === 'stack' ? '📚 STACK' : '🌊 FLOAT';
}
window.syncHostModeLabel = syncHostModeLabel;
function hostFor(session){ if(session && session.host) return session.host; return currentHostMode(); }
function getHostContainer(mode){ return mode === 'stack' ? stackHost : layer; }
function refreshLayerEmpty(){ if(!layer) return; layer.dataset.empty = layer.children.length ? '0' : '1'; }

const zStack = [];
function bringToFront(win){
  if(!win) return;
  const i = zStack.indexOf(win);
  if(i !== -1) zStack.splice(i,1);
  zStack.push(win);
  zStack.forEach((w,idx)=>{ if(!w.classList.contains('maximized')) w.style.zIndex = String(1000+idx*10); });
  activeWindow = win;
  const inp = document.getElementById('urlInputNav');
  if(inp){
    const d = tabDataMap.get(win);
    const t = d?.tabs.find(x=>x.id===d.activeId);
    inp.value = t?.url || '';
  }
}
function getTabData(win){
  if(!tabDataMap.has(win)){
    const src = win.querySelector('.win-frame')?.src || 'about:blank';
    const tab = { id:'tab-'+Date.now(), url:src, title:src.replace(/^https?:\/\//,'').split('/')[0]||'Nova Aba', fav:false, createdAt:Date.now() };
    tabDataMap.set(win,{tabs:[tab],activeId:tab.id});
  }
  return tabDataMap.get(win);
}
function getActiveTab(win){
  const d = tabDataMap.get(win);
  return d?.tabs.find(t=>t.id===d.activeId) || d?.tabs[0] || null;
}
function addTab(win, url='about:blank'){
  const d = tabDataMap.get(win); if(!d) return;
  const tab = { id:'tab-'+Date.now()+'-'+Math.random().toString(36).slice(2,7), url, title:url.replace(/^https?:\/\//,'').split('/')[0]||'Nova Aba', fav:false, createdAt:Date.now() };
  d.tabs.push(tab); d.activeId = tab.id;
  renderTabCounter(win);
  const f = win.querySelector('.win-frame'); if(f) f.src = url;
  closeTabSwitcher();
}
function removeTab(win, tabId){
  const d = tabDataMap.get(win); if(!d || d.tabs.length<=1) return;
  const i = d.tabs.findIndex(t=>t.id===tabId); if(i<0) return;
  d.tabs.splice(i,1);
  if(d.activeId===tabId) d.activeId = d.tabs[Math.min(i,d.tabs.length-1)].id;
  renderTabCounter(win);
  const f = win.querySelector('.win-frame'); const a = getActiveTab(win);
  if(f && a) f.src = a.url;
  if(document.getElementById('tabSwitcherOverlay').classList.contains('open')) renderTabSwitcher(win);
}
function setActiveTab(win, tabId){
  const d = tabDataMap.get(win); if(!d) return;
  if(!d.tabs.some(t=>t.id===tabId)) return;
  d.activeId = tabId; renderTabCounter(win);
  const f = win.querySelector('.win-frame'); const a = getActiveTab(win);
  if(f && a) f.src = a.url;
  bringToFront(win);
}
function renderTabCounter(win){
  const d = tabDataMap.get(win); if(!d) return;
  const b = win.querySelector('.tab-counter');
  if(b) b.textContent = d.tabs.length;
}
function openTabSwitcher(win){ switcherWin = win; renderTabSwitcher(win); document.getElementById('tabSwitcherOverlay').classList.add('open'); }
function closeTabSwitcher(){ document.getElementById('tabSwitcherOverlay').classList.remove('open'); if(switcherWin) bringToFront(switcherWin); switcherWin = null; }
function renderTabSwitcher(win){
  const grid = document.getElementById('tabGrid');
  const d = tabDataMap.get(win);
  if(!d) return grid.innerHTML='';
  grid.innerHTML='';
  d.tabs.forEach(tab=>{
    const c = document.createElement('div');
    c.className = 'tab-card' + (tab.id===d.activeId ? ' active' : '');
    c.innerHTML = `<div class="tab-title">${tab.title}</div><div class="tab-url">${tab.url}</div><div class="tab-state"><span class="tab-state-dot"></span> ATIVA</div><button class="tab-close" title="Fechar">×</button><button class="tab-fav ${tab.fav?'active':''}" title="Fav">${tab.fav?'★':'☆'}</button>`;
    c.addEventListener('click', e=>{
      if(e.target.closest('.tab-close') || e.target.closest('.tab-fav')) return;
      setActiveTab(win, tab.id); closeTabSwitcher();
    });
    c.querySelector('.tab-close').addEventListener('click', e=>{ e.stopPropagation(); removeTab(win, tab.id); });
    c.querySelector('.tab-fav').addEventListener('click', e=>{ e.stopPropagation(); tab.fav = !tab.fav; renderTabSwitcher(win); });
    grid.appendChild(c);
  });
}

function buildSessionWindow(session){
  const win = document.createElement('article');
  win.className = "session-window mxp-window";
  win.dataset.sessionId = session.id;
  win.dataset.type = "session";
  win.dataset.runtime = "nav";
  if(session.x !== undefined && session.y !== undefined){
    win.style.position = "fixed";
    win.style.left = session.x + "px";
    win.style.top = session.y + "px";
    win.style.margin = "0";
    win.style.zIndex = "9600";
  }
  if(session.w) win.style.width = session.w + "px";
  if(session.h) win.style.height = session.h + "px";
  if(session.maximized) win.classList.add("maximized");
  if(session.minimized) win.classList.add("minimized");
  if(session.collapsed) win.classList.add("collapsed");

  const startUrl = session.url || "https://www.infodose.com.br/splash";

  /* ⚑ ESTRUTURA LEGACY-COMPATÍVEL
     - .win-hdr > .win-controls > button[data-action="collapse|maximize|minimize|tab-switcher"]
     - iframe.win-frame[data-runtime="nav"]
     Botões MXP extras usam data-sn (run/close) e continuam funcionando. */
  win.innerHTML = `
    <div class="win-hdr" data-part="header">
      <div class="win-controls">
        <button type="button" data-action="collapse" title="Colapsar" aria-label="Colapsar">−</button>
        <button type="button" data-action="tab-switcher" class="tab-counter" title="Abas">1</button>
        <button type="button" data-action="maximize" title="Maximizar" aria-label="Maximizar">⛶</button>
        <button type="button" data-action="minimize" title="Minimizar" aria-label="Minimizar">۞</button>
        <button type="button" data-sn="run" title="Executar">▶</button>
        <button type="button" data-sn="close" title="Fechar">×</button>
      </div>
      <span class="mxp-title" data-part="title" title="Toque 2× para renomear">${session.name}</span>
      <span class="state-badge">● active</span>
    </div>
    <div class="win-body">
      <div class="win-slot-bar mxp-slot" data-drop-target data-slot="session:${session.id}"></div>
      <iframe class="win-frame" data-runtime="nav" src="${startUrl}"
        allow="autoplay; fullscreen; encrypted-media; picture-in-picture; clipboard-write"
        allowfullscreen loading="lazy"
        referrerpolicy="no-referrer-when-downgrade"></iframe>
    </div>
    <div class="resize-handle resize-y"></div>
    <div class="resize-handle resize-x"></div>
    <div class="resize-handle resize-corner"></div>`;

  /* ── MXP extras (data-sn) ─────────────────────────── */
  win.querySelector('[data-sn="run"]').addEventListener('click', ()=>{
    const items = window.MXP?.state?.slots?.["session:"+session.id] || [];
    if(!items.length){ window.KBLX_TOAST("session vazia"); return; }
    items.forEach((it,i)=>setTimeout(()=>window.MXP?.fire?.(it.action,{slot:"session:"+session.id}),i*150));
    window.KBLX_TOAST(`executando ${items.length} ações`);
  });
  win.querySelector('[data-sn="close"]').addEventListener('click', ()=>{
    if(!confirm("Fechar session?")) return;
    window.MXP?.removeSession?.(session.id);
    win.remove();
    refreshLayerEmpty();
    if(activeWindow === win) activeWindow = null;
  });

  /* ── data-action: bridge legacy ⇄ MXP ─────────────────
     Se `iFSw-base-full.js` já tratar via delegação, o handler abaixo
     detecta `e.defaultPrevented` e respeita. Caso contrário, executa. */
  win.querySelectorAll('.win-controls [data-action]').forEach(btn=>{
    btn.addEventListener('click', (e)=>{
      if(e.defaultPrevented) return;                 // legacy já tratou
      if(window.__LEGACY_SESSION_BOUND) return;      // legacy assumiu o controle global
      handleSessionAction(win, session, btn.dataset.action);
    });
  });

  const titleEl = win.querySelector('[data-part="title"]');
  let titleLastTap = 0;
  titleEl.addEventListener('click', e=>{
    e.stopPropagation();
    const now = Date.now();
    if(now - titleLastTap < 380){
      const novo = prompt("Nome da session:", session.name);
      if(novo && novo.trim()){ session.name = novo.trim(); titleEl.textContent = session.name; window.MXP?.save?.(); window.KBLX_TOAST("renomeada"); }
      titleLastTap = 0;
    } else { titleLastTap = now; }
  });

  attachWindowDrag(win, session);
  attachResize(win, session);
  win.addEventListener('pointerdown', ()=>bringToFront(win), {passive:true});
  getTabData(win);
  renderTabCounter(win);
  return win;
}

/* Ação dos botões legacy (fallback — roda se iFSw-base-full.js NÃO estiver ativo) */
function handleSessionAction(win, session, action){
  switch(action){
    case 'collapse':
      win.classList.toggle('collapsed');
      session.collapsed = win.classList.contains('collapsed');
      window.MXP?.save?.();
      break;
    case 'maximize':
      win.classList.toggle('maximized');
      session.maximized = win.classList.contains('maximized');
      window.MXP?.save?.();
      break;
    case 'minimize': {
      window.KBLX_minimizeToDock(win, {
        title: session.name,
        onMinimize: ()=>{ session.minimized = true; window.MXP?.save?.(); },
        onRestore:  ()=>{ session.minimized = false; window.MXP?.save?.(); }
      });
      break;
    }
    case 'tab-switcher':
      window.DualSession?.openTabSwitcher?.(win);
      break;
    case 'close':
      window.MXP?.removeSession?.(session.id);
      win.remove();
      refreshLayerEmpty();
      break;
  }
}

function attachWindowDrag(win, session){
  const handle = win.querySelector('[data-part="header"]');
  if(!handle) return;
  let drag = null;
  handle.addEventListener('pointerdown', (e)=>{
    if(e.target.closest('button')) return;
    if(e.target.closest('[data-part="title"]')) return;
    const r = win.getBoundingClientRect();
    drag = { id:e.pointerId, sx:e.clientX, sy:e.clientY, ox:r.left, oy:r.top, moved:false };
    try{ handle.setPointerCapture(e.pointerId); }catch(_){}
  });
  handle.addEventListener('pointermove', (e)=>{
    if(!drag || drag.id!==e.pointerId) return;
    const dx = e.clientX - drag.sx, dy = e.clientY - drag.sy;
    if(!drag.moved && Math.hypot(dx,dy) < 6) return;
    drag.moved = true;
    win.classList.add('dragging');
    win.style.position = 'fixed';
    win.style.left = (drag.ox + dx) + 'px';
    win.style.top  = (drag.oy + dy) + 'px';
    win.style.zIndex = '9650';
    win.style.margin = '0';
  });
  const end = (e)=>{
    if(!drag || (e && drag.id!==e.pointerId)) return;
    win.classList.remove('dragging');
    if(drag.moved){ const r = win.getBoundingClientRect(); session.x = r.left; session.y = r.top; window.MXP?.save?.(); }
    drag = null;
  };
  handle.addEventListener('pointerup', end);
  handle.addEventListener('pointercancel', end);
}
function attachResize(win, session){
  const bind = (handle, mode)=>{
    if(!handle) return;
    let r = null;
    handle.addEventListener('pointerdown', (e)=>{
      if(win.classList.contains('maximized')) return;
      e.preventDefault(); e.stopPropagation();
      const rect = win.getBoundingClientRect();
      if(getComputedStyle(win).position !== 'fixed'){
        win.style.position = 'fixed';
        win.style.left = rect.left + 'px'; win.style.top = rect.top + 'px';
        win.style.margin = '0'; win.style.zIndex = '9650';
      }
      win.style.width = rect.width + 'px';
      win.style.height = rect.height + 'px';
      win.style.maxHeight = 'none';
      r = { id:e.pointerId, sx:e.clientX, sy:e.clientY, w:rect.width, h:rect.height };
      try{ handle.setPointerCapture(e.pointerId); }catch(_){}
    });
    handle.addEventListener('pointermove', (e)=>{
      if(!r || r.id!==e.pointerId) return;
      const dx = e.clientX - r.sx, dy = e.clientY - r.sy;
      if(mode !== 'x'){ win.style.height = Math.max(180, r.h + dy) + 'px'; }
      if(mode !== 'y'){ win.style.width  = Math.max(220, r.w + dx) + 'px'; }
    });
    const end = (e)=>{
      if(!r || (e && r.id!==e.pointerId)) return;
      const rect = win.getBoundingClientRect();
      session.w = rect.width; session.h = rect.height; window.MXP?.save?.();
      r = null;
    };
    handle.addEventListener('pointerup', end);
    handle.addEventListener('pointercancel', end);
  };
  bind(win.querySelector('.resize-y'), 'y');
  bind(win.querySelector('.resize-x'), 'x');
  bind(win.querySelector('.resize-corner'), 'corner');
}

function renderSessions(){
  if(!layer || !stackHost) return;
  layer.innerHTML = "";
  stackHost.innerHTML = "";
  const sessions = window.MXP?.state?.sessions || [];
  sessions.forEach(s=>{
    const mode = hostFor(s);
    const host = getHostContainer(mode);
    if(!host) return;
    const win = buildSessionWindow(s);
    host.appendChild(win);
    if(window.MXP?.state?.slots) window.MXP.state.slots["session:"+s.id] ??= [];
    window.MXP?.renderSlot?.("session:"+s.id);
  });
  refreshLayerEmpty();
}

document.getElementById('closeTabSwitcher')?.addEventListener('click', closeTabSwitcher);
/* v14 — "+ Nova Aba": existem 2 sistemas de abas (§G DualSession, mais
   simples, e o legado iFSw-base-full, completo) dividindo o MESMO
   overlay #tabSwitcherOverlay. Em vez de escolher um só (risco de
   quebrar o outro), o botão detecta qual dos dois está com uma janela
   ativa no switcher e chama o addTab correspondente. */
document.getElementById('newTabBtn')?.addEventListener('click', ()=>{
  if (switcherWin) {
    addTab(switcherWin, 'about:blank');
    return;
  }
  const iw = window.iFSw_getSwitcherWin?.();
  if (iw) { window.iFSw_addTab?.(iw, ''); return; }
  window.KBLX_TOAST?.('Abra uma sessão antes de criar aba');
});
document.getElementById('newSessionBtn')?.addEventListener('click', ()=>window.MXP?.createSession?.());
document.getElementById('toggleHostBtn')?.addEventListener('click', ()=>{
  const cur = document.body.dataset.sessionHost || 'float';
  const next = cur === 'float' ? 'stack' : 'float';
  document.body.dataset.sessionHost = next;
  (window.MXP?.state?.sessions || []).forEach(s=>{
    if(!s.host) s.host = next;
    if(s.host === next){ s.x = undefined; s.y = undefined; }
  });
  window.MXP?.save?.();
  renderSessions();
  syncHostModeLabel();
  window.KBLX_TOAST('Host: ' + (next === 'stack' ? '📚 STACK (empilhado, bom pra mobile)' : '🌊 FLOAT (janelas soltas, bom pra desktop)'));
});
syncHostModeLabel();
document.getElementById('urlInputNav')?.addEventListener('keydown', e=>{ if(e.key==='Enter') document.getElementById('goNavBtn')?.click(); });
document.getElementById('goNavBtn')?.addEventListener('click', ()=>{
  const inp = document.getElementById('urlInputNav');
  const url = inp.value.trim(); if(!url) return;
  if(!activeWindow){ window.MXP?.createSession?.(); return; }
  let u = url; if(!/^https?:\/\//i.test(u) && !u.startsWith('about:')) u = 'https://'+u;
  activeWindow.querySelector('.win-frame').src = u;
  const a = getActiveTab(activeWindow); if(a){ a.url = u; a.title = u.replace(/^https?:\/\//,'').split('/')[0]; }
  inp.value = u;
});

window.DualSession = {
  get activeWindow(){ return activeWindow; },
  bringToFront, renderSessions, openTabSwitcher, closeTabSwitcher,
  buildSessionWindow,
  hostFor, getHostContainer,
  createSessionWindow: (name="SESSION")=>window.MXP?.createSession?.(name),
};
})();

/* ===== kblx-tabs-links-unified.js =====
   Fonte ÚNICA de verdade pras abas (substitui os 2 tabDataMap).
   - persistência em localStorage (kobllux:tabs)
   - histórico de links (kobllux:links)
   - arrastar session-window → outra = merge em abas
   - arrastar aba do Tab Switcher → desktop = nova session
   - tudo via data-action
*/
(function(){
"use strict";
if (window.__KBLX_TABS_UNIFIED__) return;
window.__KBLX_TABS_UNIFIED__ = true;

const $  = (s,r=document)=>r.querySelector(s);
const $$ = (s,r=document)=>[...r.querySelectorAll(s)];
const uid = (p='id')=>p+'_'+Date.now().toString(36)+Math.random().toString(36).slice(2,7);
const now = ()=>Date.now();

/* ═══════════════════════════════════════════════════════════
   1. TABSTORE — fonte única, persistida
   ═══════════════════════════════════════════════════════════ */
const TabStore = {
  _mem: new Map(),
  _read(){ try{return JSON.parse(localStorage.getItem('kobllux:tabs'))||{};}catch(_){return{};} },
  _write(o){ try{localStorage.setItem('kobllux:tabs',JSON.stringify(o));}catch(_){} },

  get(winId){
    if(!winId) return null;
    if(this._mem.has(winId)) return this._mem.get(winId);
    const disk = this._read()[winId];
    if(disk){ this._mem.set(winId,disk); return disk; }
    return null;
  },
  set(winId,data){
    if(!winId) return;
    this._mem.set(winId,data);
    const all=this._read(); all[winId]=data; this._write(all);
    document.dispatchEvent(new CustomEvent('tabstore:changed',{detail:{winId,data}}));
  },
  ensure(winId,seedUrl){
    let d=this.get(winId); if(d) return d;
    const u = seedUrl||'about:blank';
    const tab={ id:uid('tab'), url:u,
      title:u.replace(/^https?:\/\//,'').split('/')[0]||'Nova Aba',
      fav:false, createdAt:now() };
    d={tabs:[tab], activeId:tab.id};
    this.set(winId,d);
    return d;
  },
  addTab(winId,url,opts={}){
    const d=this.ensure(winId);
    const u=url||'about:blank';
    const t={ id:uid('tab'), url:u,
      title:opts.title||u.replace(/^https?:\/\//,'').split('/')[0]||'Nova Aba',
      fav:!!opts.fav, createdAt:now() };
    d.tabs.push(t); d.activeId=t.id; this.set(winId,d);
    LinkHistory.record(u,t.title,winId);
    return t;
  },
  removeTab(winId,tabId){
    const d=this.get(winId); if(!d||d.tabs.length<=1) return null;
    const i=d.tabs.findIndex(t=>t.id===tabId); if(i<0) return null;
    const [r]=d.tabs.splice(i,1);
    if(d.activeId===tabId) d.activeId=d.tabs[Math.min(i,d.tabs.length-1)].id;
    this.set(winId,d); return r;
  },
  detachTab(winId,tabId){
    const d=this.get(winId); if(!d||d.tabs.length<=1) return null;
    const i=d.tabs.findIndex(t=>t.id===tabId); if(i<0) return null;
    const [t]=d.tabs.splice(i,1);
    if(d.activeId===tabId) d.activeId=d.tabs[Math.min(i,d.tabs.length-1)].id;
    this.set(winId,d); return t;
  },
  attachTab(winId,tab){
    const d=this.ensure(winId);
    const copy={...tab, id:uid('tab')};
    d.tabs.push(copy); d.activeId=copy.id; this.set(winId,d);
    return copy;
  },
  setActive(winId,tabId){
    const d=this.get(winId); if(!d) return;
    if(!d.tabs.some(t=>t.id===tabId)) return;
    d.activeId=tabId; this.set(winId,d);
  },
  updateUrl(winId,tabId,url,title){
    const d=this.get(winId); if(!d) return;
    const t=d.tabs.find(x=>x.id===tabId); if(!t) return;
    t.url=url; if(title) t.title=title;
    this.set(winId,d);
    LinkHistory.record(url,title||t.title,winId);
  },
  dropAll(winId){ this._mem.delete(winId); const a=this._read(); delete a[winId]; this._write(a); }
};
window.TabStore = TabStore;

/* ═══════════════════════════════════════════════════════════
   2. LINK HISTORY — histórico persistido
   ═══════════════════════════════════════════════════════════ */
const LinkHistory = {
  _read(){ try{return JSON.parse(localStorage.getItem('kobllux:links'))||[];}catch(_){return[];} },
  _write(l){ try{localStorage.setItem('kobllux:links',JSON.stringify(l.slice(-800)));}catch(_){} },
  record(url,title,sessionId){
    if(!url||url==='about:blank') return;
    const l=this._read(); const last=l[l.length-1];
    if(last && last.url===url && (now()-last.ts)<2500) return;
    l.push({url,title:title||url,ts:now(),sessionId:sessionId||null});
    this._write(l);
    document.dispatchEvent(new CustomEvent('link:visited',{detail:{url,title,sessionId}}));
  },
  list(){ return this._read(); },
  clear(){ this._write([]); }
};
window.LinkHistory = LinkHistory;

/* ═══════════════════════════════════════════════════════════
   3. APLICAR TABDATA NA WINDOW (visual)
   ═══════════════════════════════════════════════════════════ */
function applyTabsToWindow(win, data){
  if(!win||!data) return;
  const frame = win.querySelector('.win-frame');
  const active = data.tabs.find(t=>t.id===data.activeId) || data.tabs[0];
  if(frame && active && frame.src !== active.url) frame.src = active.url;
  const counter = win.querySelector('.tab-counter');
  if(counter) counter.textContent = data.tabs.length;
}

/* ═══════════════════════════════════════════════════════════
   4. SINCRONIZA DualSession + iFSw com o TabStore
   ═══════════════════════════════════════════════════════════ */
function patchExisting(){
  /* DualSession (mxp-extras-data-sn.js) */
  const DS = window.DualSession;
  if(DS && !DS.__unified){
    DS.__unified = true;
    const orig = DS.renderSessions?.bind(DS);
    DS.renderSessions = function(){
      orig?.();
      requestAnimationFrame(()=>{
        $$('.session-window').forEach(win=>{
          const id = win.dataset.sessionId; if(!id) return;
          const d = TabStore.ensure(id, win.querySelector('.win-frame')?.src);
          applyTabsToWindow(win, d);
        });
      });
    };
  }
  /* iFSw: mesma ideia — intercepta antes do render dele */
  const SL = window.SessionLifecycle;
  if(SL && !SL.__unified){
    SL.__unified = true;
    /* a API pública dele continua funcionando; só espelhamos pro TabStore */
    const _restore = SL.restore;
    SL.restore = function(id){
      const win = document.getElementById(id);
      if(win){
        const d = TabStore.get(win.dataset.sessionId || id);
        if(d) applyTabsToWindow(win, d);
      }
      return _restore?.call(SL, id);
    };
  }
}

/* ═══════════════════════════════════════════════════════════
   5. DRAG: session-window → session-window = MERGE em abas
   ═══════════════════════════════════════════════════════════ */
let dragWin=null, dragGhost=null, hoverTarget=null, dragStartPt=null;

function moveGhost(x,y){ if(dragGhost){ dragGhost.style.left=x+'px'; dragGhost.style.top=y+'px'; } }
function winUnder(x,y,exclude){ 
  const el = document.elementFromPoint(x,y);
  const w = el?.closest?.('.session-window');
  return (w && w!==exclude) ? w : null;
}

function startWinDrag(win,e){
  dragWin = win;
  win.classList.add('is-being-dragged');
  dragGhost = document.createElement('div');
  dragGhost.className='session-drag-ghost';
  dragGhost.innerHTML = `<span class="sd-icon">◫</span><span>${win.querySelector('[data-part="title"],.mxp-title')?.textContent||'session'}</span>`;
  document.body.appendChild(dragGhost);
  moveGhost(e.clientX,e.clientY);
  document.body.classList.add('session-dragging');
}

function mergeWinIntoTarget(src,dst){
  const srcId = src.dataset.sessionId, dstId = dst.dataset.sessionId;
  if(!srcId||!dstId||srcId===dstId) return;

  const srcData = TabStore.ensure(srcId, src.querySelector('.win-frame')?.src);
  const dstData = TabStore.ensure(dstId, dst.querySelector('.win-frame')?.src);

  srcData.tabs.forEach(t=>{
    const copy = {...t, id:uid('tab')};
    dstData.tabs.push(copy);
    if(copy.url) LinkHistory.record(copy.url, copy.title, dstId);
  });
  dstData.activeId = dstData.tabs[dstData.tabs.length-1].id;
  TabStore.set(dstId,dstData);

  /* remove origem */
  try{ window.MXP?.removeSession?.(srcId); }catch(_){}
  TabStore.dropAll(srcId);
  src.remove();

  applyTabsToWindow(dst, dstData);
  document.dispatchEvent(new CustomEvent('session:merged',{
    detail:{ from:srcId, into:dstId, tabs:srcData.tabs.length }
  }));
  window.KBLX_TOAST?.(`${srcData.tabs.length} aba(s) absorvida(s)`);
  window.KBLX_SAVE?.();
}

function endWinDrag(e){
  if(!dragWin) return;
  const tgt = winUnder(e.clientX,e.clientY,dragWin);
  if(tgt) mergeWinIntoTarget(dragWin,tgt);
  dragWin.classList.remove('is-being-dragged');
  dragGhost?.remove(); dragGhost=null;
  hoverTarget?.classList.remove('is-merge-target'); hoverTarget=null;
  dragWin=null; dragStartPt=null;
  document.body.classList.remove('session-dragging');
}

function installWinMerge(){
  document.addEventListener('pointerdown', e=>{
    if(!e.target.closest('.win-hdr')) return;
    if(e.target.closest('button,input,.win-controls,[data-part="title"],.mxp-title')) return;
    const win = e.target.closest('.session-window');
    if(!win) return;
    dragStartPt = { x:e.clientX, y:e.clientY, win };
  }, true);

  document.addEventListener('pointermove', e=>{
    if(!dragStartPt && !dragWin) return;
    if(!dragWin){
      const dx = e.clientX - dragStartPt.x, dy = e.clientY - dragStartPt.y;
      if(Math.hypot(dx,dy) > 24) startWinDrag(dragStartPt.win, e);
      return;
    }
    moveGhost(e.clientX,e.clientY);
    const t = winUnder(e.clientX,e.clientY,dragWin);
    if(t !== hoverTarget){
      hoverTarget?.classList.remove('is-merge-target');
      hoverTarget = t;
      hoverTarget?.classList.add('is-merge-target');
    }
  }, { passive:true });

  document.addEventListener('pointerup', e=>{ if(dragWin) endWinDrag(e); dragStartPt=null; });
  document.addEventListener('pointercancel', ()=>{ 
    if(dragWin){ endWinDrag({clientX:0,clientY:0}); dragStartPt=null; }
  });
}

/* ═══════════════════════════════════════════════════════════
   6. DRAG: aba do Tab Switcher → desktop = NOVA session
   ═══════════════════════════════════════════════════════════ */
let dragTab=null, tabGhost=null, tabStartPt=null;

function beginTabDrag(card,winId,tab,e){
  dragTab = { sourceWinId:winId, tabId:tab.id, tab:{...tab} };
  tabGhost = document.createElement('div');
  tabGhost.className='tab-drag-ghost';
  tabGhost.textContent = tab.title || tab.url || 'aba';
  document.body.appendChild(tabGhost);
  moveTabGhost(e.clientX,e.clientY);
  document.body.classList.add('tab-dragging');
  document.getElementById('tabSwitcherOverlay')?.classList.remove('open');
}
function moveTabGhost(x,y){ if(tabGhost){ tabGhost.style.left=x+'px'; tabGhost.style.top=y+'px'; } }

function createSessionFromTab(drag,x,y){
  const name = drag.tab.title || 'aba';
  const s = window.MXP?.createSession?.(name);
  if(!s) return;
  requestAnimationFrame(()=>{
    const win = document.querySelector(`.session-window[data-session-id="${s.id}"]`);
    if(!win) return;
    win.style.position='fixed';
    win.style.left = Math.max(10, x-160)+'px';
    win.style.top  = Math.max(60, y-30)+'px';
    win.style.zIndex = '9650';
    win.style.margin = '0';

    /* 1) tira a aba da origem */
    TabStore.detachTab(drag.sourceWinId, drag.tabId);

    /* 2) injeta na nova window */
    const tab = TabStore.addTab(s.id, drag.tab.url, { title:drag.tab.title, fav:drag.tab.fav });
    applyTabsToWindow(win, TabStore.get(s.id));

    /* 3) atualiza origem visual */
    const srcWin = document.querySelector(`.session-window[data-session-id="${drag.sourceWinId}"]`);
    if(srcWin) applyTabsToWindow(srcWin, TabStore.get(drag.sourceWinId));

    window.KBLX_TOAST?.('Session criada da aba');
    window.KBLX_SAVE?.();
  });
}

function cleanupTabDrag(){
  tabGhost?.remove(); tabGhost=null;
  dragTab=null; tabStartPt=null;
  document.body.classList.remove('tab-dragging');
}

function installTabOutDrag(){
  document.addEventListener('pointerdown', e=>{
    const card = e.target.closest('#tabGrid .tab-card');
    if(!card || e.target.closest('.tab-close,.tab-fav')) return;
    const tabId = card.dataset.tabId;
    /* descobre a window dona dessa aba via TabStore */
    let ownerWinId = null, tabObj = null;
    for(const win of $$('.session-window')){
      const id = win.dataset.sessionId;
      const d = TabStore.get(id);
      if(d && d.tabs.some(t=>t.id===tabId)){ ownerWinId=id; tabObj=d.tabs.find(t=>t.id===tabId); break; }
    }
    if(!ownerWinId||!tabObj) return;
    tabStartPt = { x:e.clientX, y:e.clientY, card, ownerWinId, tabObj };
  }, true);

  document.addEventListener('pointermove', e=>{
    if(dragTab){
      moveTabGhost(e.clientX,e.clientY);
      return;
    }
    if(!tabStartPt) return;
    const dx = e.clientX - tabStartPt.x, dy = e.clientY - tabStartPt.y;
    if(Math.hypot(dx,dy) > 18){
      beginTabDrag(tabStartPt.card, tabStartPt.ownerWinId, tabStartPt.tabObj, e);
    }
  }, { passive:true });

  document.addEventListener('pointerup', e=>{
    if(!dragTab) return;
    const overSwitcher = e.target.closest?.('#tabSwitcherOverlay');
    if(!overSwitcher){
      createSessionFromTab(dragTab, e.clientX, e.clientY);
    }
    cleanupTabDrag();
  });
  document.addEventListener('pointercancel', cleanupTabDrag);
}

/* ═══════════════════════════════════════════════════════════
   7. DATA-ACTION: ações tab:* unificadas
   ═══════════════════════════════════════════════════════════ */
function installTabActions(){
  document.addEventListener('click', e=>{
    const btn = e.target.closest('[data-action]');
    if(!btn) return;
    const action = btn.dataset.action;

    if(action === 'tab:new'){
      e.preventDefault(); e.stopPropagation();
      const win = btn.closest('.session-window') || window.DualSession?.activeWindow;
      if(!win) return window.KBLX_TOAST?.('sem session ativa');
      const id = win.dataset.sessionId;
      TabStore.addTab(id, 'about:blank');
      applyTabsToWindow(win, TabStore.get(id));
      window.DualSession?.openTabSwitcher?.(win);
    }

    if(action === 'tab:close'){
      e.preventDefault(); e.stopPropagation();
      const card = btn.closest('.tab-card');
      const tabId = btn.dataset.tabId || card?.dataset.tabId;
      const win = btn.closest('.session-window') || window.DualSession?.activeWindow;
      if(!tabId||!win) return;
      const id = win.dataset.sessionId;
      TabStore.removeTab(id, tabId);
      applyTabsToWindow(win, TabStore.get(id));
      /* redesenha switcher se aberto */
      if(document.getElementById('tabSwitcherOverlay')?.classList.contains('open')){
        window.DualSession?.openTabSwitcher?.(win);
      }
    }

    if(action === 'tab:activate'){
      e.preventDefault(); e.stopPropagation();
      const card = btn.closest('.tab-card');
      const tabId = btn.dataset.tabId || card?.dataset.tabId;
      const win = btn.closest('.session-window') || window.DualSession?.activeWindow;
      if(!tabId||!win) return;
      const id = win.dataset.sessionId;
      TabStore.setActive(id, tabId);
      applyTabsToWindow(win, TabStore.get(id));
      window.DualSession?.closeTabSwitcher?.();
    }
  }, true);
}

/* ═══════════════════════════════════════════════════════════
   8. LINK TRACKER — todo iframe que carrega = histórico
   ═══════════════════════════════════════════════════════════ */
function hookFrame(f){
  if(f.__linkTracked) return;
  f.__linkTracked = true;
  f.addEventListener('load', ()=>{
    const win = f.closest('.session-window');
    const id = win?.dataset.sessionId;
    if(!id) return;
    const d = TabStore.get(id); if(!d) return;
    const active = d.tabs.find(t=>t.id===d.activeId);
    if(active){
      active.url = f.src;
      try{ active.title = f.contentDocument?.title || active.title; }catch(_){}
      TabStore.set(id,d);
      LinkHistory.record(f.src, active.title, id);
    }
  });
}
function installLinkTracker(){
  const mo = new MutationObserver(muts=>{
    for(const m of muts){
      for(const n of m.addedNodes||[]){
        if(n.nodeType!==1) continue;
        if(n.matches?.('.win-frame')) hookFrame(n);
        n.querySelectorAll?.('.win-frame').forEach(hookFrame);
      }
    }
  });
  mo.observe(document.body,{childList:true,subtree:true});
  $$('.win-frame').forEach(hookFrame);
}

/* ═══════════════════════════════════════════════════════════
   9. PAINEL DE HISTÓRICO (Ctrl+K)
   ═══════════════════════════════════════════════════════════ */
function showLinkPanel(){
  let p = document.getElementById('kblx-link-panel');
  if(!p){
    p = document.createElement('div');
    p.id = 'kblx-link-panel';
    p.style.cssText = `
      position:fixed; inset:8vh 15vw; background:rgba(8,10,22,.97);
      border:1px solid rgba(120,200,255,.28); border-radius:14px;
      z-index:99999; padding:18px; overflow:auto; color:#cfe;
      font-family:ui-monospace,monospace; box-shadow:0 24px 80px rgba(0,0,0,.7);
      backdrop-filter:blur(8px);`;
    document.body.appendChild(p);
    p.addEventListener('click', e=>{ if(e.target===p) p.remove(); });
  }
  const links = LinkHistory.list().slice(-150).reverse();
  p.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;gap:12px">
      <b style="letter-spacing:2px">HISTÓRICO DE LINKS · ${links.length}</b>
      <div style="display:flex;gap:8px">
        <button data-action="links:clear" style="background:none;border:1px solid #445;color:#9ab;border-radius:6px;padding:4px 10px;cursor:pointer">LIMPAR</button>
        <button data-action="links:close" style="background:none;border:1px solid #445;color:#9ab;border-radius:6px;padding:4px 10px;cursor:pointer">✕</button>
      </div>
    </div>
    ${links.length ? links.map(l=>`
      <div style="padding:8px 10px;border-bottom:1px solid rgba(120,200,255,.08);display:flex;justify-content:space-between;gap:12px;align-items:center">
        <a href="#" data-action="links:open" data-url="${l.url.replace(/"/g,'&quot;')}"
           style="color:#7cf;text-decoration:none;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;flex:1">
          ${l.title || l.url}
        </a>
        <span style="color:#456;font-size:11px;flex-shrink:0">${new Date(l.ts).toLocaleTimeString()}</span>
        <button data-action="links:remove" data-url="${l.url.replace(/"/g,'&quot;')}"
          style="background:none;border:none;color:#655;cursor:pointer;font-size:14px">×</button>
      </div>`).join('') : '<div style="color:#456;text-align:center;padding:40px">vazio</div>'}
  `;
  p.querySelector('[data-action="links:close"]').onclick = ()=>p.remove();
  p.querySelector('[data-action="links:clear"]').onclick = ()=>{ LinkHistory.clear(); showLinkPanel(); };
  p.querySelectorAll('[data-action="links:open"]').forEach(a=>{
    a.onclick = ev=>{
      ev.preventDefault();
      const url = a.dataset.url;
      const active = window.DualSession?.activeWindow 
                  || $$('.session-window').find(w=>!w.classList.contains('minimized'));
      if(active){
        const id = active.dataset.sessionId;
        TabStore.addTab(id, url);
        applyTabsToWindow(active, TabStore.get(id));
      } else {
        const s = window.MXP?.createSession?.(url.split('/').pop()||'link');
        if(s) TabStore.addTab(s.id, url);
      }
      p.remove();
    };
  });
  p.querySelectorAll('[data-action="links:remove"]').forEach(b=>{
    b.onclick = ()=>{
      const url = b.dataset.url;
      const list = LinkHistory.list().filter(x=>x.url!==url);
      localStorage.setItem('kobllux:links', JSON.stringify(list));
      showLinkPanel();
    };
  });
}
window.showLinkHistory = showLinkPanel;

document.addEventListener('keydown', e=>{
  if((e.ctrlKey||e.metaKey) && e.key === 'k'){
    e.preventDefault(); showLinkPanel();
  }
});

/* ═══════════════════════════════════════════════════════════
   10. BOOT + RE-BOOT em eventos
   ═══════════════════════════════════════════════════════════ */
function boot(){
  patchExisting();
  installWinMerge();
  installTabOutDrag();
  installTabActions();
  installLinkTracker();
  $$('.session-window').forEach(win=>{
    const id = win.dataset.sessionId; if(!id) return;
    const d = TabStore.ensure(id, win.querySelector('.win-frame')?.src);
    applyTabsToWindow(win, d);
  });
  console.log('[UNIFIED] TabStore + LinkHistory + drag-merge online');
}
if(document.readyState === 'loading'){
  document.addEventListener('DOMContentLoaded', ()=>setTimeout(boot,80), {once:true});
} else {
  setTimeout(boot, 80);
}
document.addEventListener('mxp:session-created', ()=>setTimeout(boot,60));
document.addEventListener('kblx:session-restored', ()=>setTimeout(boot,60));

/* reexpõe API */
window.KBLX_TABS = {
  store: TabStore, links: LinkHistory,
  merge: (a,b)=>mergeWinIntoTarget(a,b),
  showHistory: showLinkPanel,
};
})();

/* ===== no-op.js ===== */
(function(){
"use strict";
const HOLD_MS = 500;
const TAP_DELAY = 240;
const MOVE_THRESHOLD = 12;
const DRAG_THRESHOLD = 18;

const $ = (s,r=document)=>r.querySelector(s);
const $$ = (s,r=document)=>[...r.querySelectorAll(s)];
const uid = (p="x")=>p+"_"+Date.now().toString(36)+Math.random().toString(36).slice(2,7);

const BRIDGE = {
  "dual:theme-toggle": ()=>document.getElementById('themeToggle')?.click(),
  "dual:theme-dot":    ()=>document.getElementById('themeToggle')?.click(),
  "dual:drawer":       ()=>window.toggleDrawer?.('drawerProfile'),
  "drawer:open":       ()=>window.toggleDrawer?.('drawerProfile'),
  "dual:new-session":  ()=>createSession('SESSION'),
  "dual:win-max":      ()=>{ const w=activeSessionWin(); w?.__max?.(); },
  "dual:win-min":      ()=>{ const w=activeSessionWin(); w?.__min?.(); },
  "dual:win-close":    ()=>{ const w=activeSessionWin(); w?.__close?.(); },
  "dual:win-tabs":     ()=>{ const w=activeSessionWin(); if(w) window.DualSession?.openTabSwitcher?.(w); },
  "dual:focus-url":    ()=>{ document.getElementById('urlInputNav')?.focus(); },
  "dual:win-collapse": ()=>{ const w=activeSessionWin(); w?.__collapse?.(); },
  "nav:go":            ()=>{ const u=document.getElementById('urlInputNav')?.value?.trim(); if(u) document.getElementById('goNavBtn')?.click(); },
  "nav:next":          ()=>{ document.getElementById('stepBtn')?.click(); },
  "session:new":       ()=>createSession('SESSION'),
  "session:focus":     ()=>{ /* no-op */ },

  /* ── SESSION WINDOW (aplicado a sections auto-adaptadas) ── */
  "session:collapse":  (ctx)=>{
    const s = document.activeElement?.closest('.app > section.session-window')
           || ctx?.element?.closest('.app > section.session-window')
           || ctx?.section;
    s?.classList.toggle('collapsed');
  },
  "session:maximize":  (ctx)=>{
    const s = document.activeElement?.closest('.app > section.session-window')
           || ctx?.element?.closest('.app > section.session-window')
           || ctx?.section;
    s?.classList.toggle('maximized');
  },
  "session:minimize":  (ctx)=>{
    const s = document.activeElement?.closest('.app > section.session-window')
           || ctx?.element?.closest('.app > section.session-window')
           || ctx?.section;
    if(s) window.KBLX_minimizeToDock?.(s, { title: s.dataset.sessionTitle });
  },
  "session:close":     (ctx)=>{
    const s = document.activeElement?.closest('.app > section.session-window')
           || ctx?.element?.closest('.app > section.session-window')
           || ctx?.section;
    s?.classList.add('minimized');
  },

  "theme:toggle":      ()=>document.getElementById('themeToggle')?.click(),
  "notif:open":        ()=>window.KBLX_TOAST?.('Sem notificações'),
  "media:play":        ()=>{ const nb=window.Nebula; if(nb&&nb.hasSlices&&nb.hasSlices()) nb.toggleSpeech(); else window.KBLX_ACTIONS?.speak(); },
  "media:pause":       ()=>{ if('speechSynthesis' in window && speechSynthesis.paused===false) speechSynthesis.pause(); },
  "media:stop":        ()=>{ window.Nebula?.stopSpeech?.(); window.KBLX_ACTIONS?.stop?.(); },
  "media:next":        ()=>window.Nebula?.nextSlice?.(),
  "media:prev":        ()=>window.Nebula?.previousSlice?.(),
  "nebula:speak":      ()=>{ const nb=window.Nebula; if(nb&&nb.hasSlices&&nb.hasSlices()) nb.toggleSpeech(); else window.KBLX_ACTIONS?.speak(); },
  "nebula:import":     ()=>document.getElementById('sbImportInput')?.click(),
  "nebula:paste":      ()=>{ const t=prompt('Cole:'); if(t) window.Nebula?.loadDocument(t,'Colado'); },
  "nebula:clear":      ()=>window.Nebula?.clear?.(),
  "dialog:generate":   ()=>document.getElementById('generateBtn')?.click(),
  "dialog:step":       ()=>document.getElementById('stepBtn')?.click(),
  "dialog:clear":      ()=>document.getElementById('sbClear')?.click(),
  "dialog:copy":       ()=>document.getElementById('sbCopy')?.click(),
  "dialog:download":   ()=>document.getElementById('sbDownload')?.click(),
  "orb:next":          ()=>{ const o=document.getElementById('sbOrb'); if(o){ o.dispatchEvent(new PointerEvent('pointerdown',{bubbles:true})); setTimeout(()=>o.dispatchEvent(new PointerEvent('pointerup',{bubbles:true})),10); } },
  "orb:wheel":         ()=>document.getElementById('arch-overlay')?.classList.add('open'),
  "orb:theme":         ()=>{ const cur=document.body.dataset.voiceArch||'jesus'; const next=(cur==='jesus')?'kodux':'jesus'; const r=document.getElementById('sbOrb')?.getBoundingClientRect(); window.applyArch(next,{x:(r?.left+r?.width/2||0)/innerWidth*100,y:(r?.top+r?.height/2||0)/innerHeight*100}); window.__sbSync?.(next); },
  "aside:toggle":      ()=>document.getElementById('symbolBar')?.classList.toggle('collapsed'),
  "factory:open":      ()=>openFactory(),
  "factory:close":     ()=>closeFactory(),
  "slot:clear":        (ctx)=>{ const s=ctx?.slot||"loose"; if(state.slots[s]){ state.slots[s]=[]; save(); renderSlot(s); toast(`"${s}" limpo`); } },
  "state:reset":       ()=>{ if(!confirm("Resetar MXP?")) return; state=defaultState(); save(); renderAll(); toast("estado resetado"); },
  "extras:import-slicer":   ()=>document.getElementById('sbImportInput')?.click(),
  "extras:paste-slicer":    ()=>{ const t=prompt('Cole:'); if(t) window.Nebula?.loadDocument(t,'Colado'); },
  "extras:generate":        ()=>document.getElementById('generateBtn')?.click(),
  "extras:toggle-carousel": ()=>document.getElementById('symbolBar')?.classList.toggle('carousel-hidden'),
};

const CATALOG = [
  { category:"DUAL · SYSTEM", items:[["dual:theme-toggle","☼","TEMA"],["dual:drawer","🔅","COCKPIT"],["state:reset","⌦","RESET"]] },
  { category:"DUAL · WINDOW", items:[["dual:new-session","＋","NOVA"],["dual:win-max","⛶","MAX"],["dual:win-min","۞","MIN"],["dual:win-collapse","−","COLAPSO"],["dual:win-close","×","FECHAR"],["dual:win-tabs","⊞","ABAS"]] },
  { category:"SECTION WINDOW", items:[["session:collapse","−","COLAPSO"],["session:maximize","⛶","MAX"],["session:minimize","۞","MIN"],["session:close","×","FECHAR"]] },
  { category:"NEBULA", items:[["nebula:speak","🎙","SPEAK"],["nebula:import","⌲","IMPORT"],["nebula:paste","✎","PASTE"],["nebula:clear","⌫","CLEAR"]] },
  { category:"DIALOGUE", items:[["dialog:generate","⇄","GERAR"],["dialog:step","→","+15"],["dialog:copy","⧉","COPY"],["dialog:download","↓","DL"],["dialog:clear","×","CLEAR"]] },
  { category:"MEDIA", items:[["media:play","▶","PLAY"],["media:pause","Ⅱ","PAUSE"],["media:stop","■","STOP"],["media:next","›","NEXT"],["media:prev","‹","PREV"]] },
  { category:"MXP", items:[["factory:open","◈","FACTORY"],["aside:toggle","☰","TOGGLE"],["session:new","◉","SESSION"]] },
  { category:"ORB", items:[["orb:next","◉","NEXT"],["orb:wheel","∆","WHEEL"],["orb:theme","◐","THEME"]] },
];

function defaultState(){ return { version:13, slots:{ header:[], aside:[], footer:[], loose:[] }, sessions:[] }; }
let state = window.Store ? (window.Store.get(window.KBLX_KEYS.mxp, null) || defaultState()) : defaultState();
const save = ()=>{ if(window.Store) window.Store.set(window.KBLX_KEYS.mxp, state); };

function toast(msg){ window.KBLX_TOAST ? window.KBLX_TOAST(msg) : null; }
function hud(msg){ const el=$("#mxd-hud"); if(!el) return; if(msg){ el.textContent=msg; el.classList.add("is-live"); } else el.classList.remove("is-live"); }

function fire(action, ctx={}){
  if(!action) return;
  if(BRIDGE[action]){ try{ BRIDGE[action](ctx); }catch(e){ console.warn('bridge',action,e); } return; }
  window.dispatchEvent(new CustomEvent("MXP_ACTION",{detail:{action,ctx}}));
  console.log("[MXP] fire:",action);
}

function makeButton(item, slot){
  const b = document.createElement("button");
  b.type = "button";
  b.className = "mxp-btn";
  if(slot === "__factory__") b.classList.add("slot-factory");
  else if(slot.startsWith("session:")) b.classList.add("slot-session");
  else b.classList.add("slot-"+slot);
  b.dataset.id = item.id || uid("btn");
  b.dataset.action = item.action || "";
  b.dataset.label = item.label || "";
  b.dataset.icon = item.icon || "";
  b.dataset.slot = slot;
  if(item.binding) b.dataset.binding = item.binding;
  /* v14 — explica o "vincular" pra quem esbarra nisso sem saber pra que
     serve: arrastar um botão sobre um elemento com data-dual-target
     (tema, campo de URL, cockpit...) faz esse botão passar a disparar
     a MESMA ação do elemento nativo — é um atalho custom pra uma ação
     que já existe, não uma feature separada. */
  b.title = item.binding
    ? `${item.label} · vinculado a "${item.binding}" — clique dispara a mesma ação do elemento nativo`
    : `${item.label} · ${item.action}`;
  b.innerHTML = `<span class="mxp-icon">${item.icon||"•"}</span><span class="mxp-label">${item.label||""}</span>`;
  if(item.binding) b.classList.add("is-bound");
  return b;
}
function itemFromButton(btn){ return { id:btn.dataset.id, action:btn.dataset.action, label:btn.dataset.label, icon:btn.dataset.icon, binding:btn.dataset.binding||"" }; }

function renderSlot(slot){
  const el = document.querySelector(`[data-slot="${slot}"]`); if(!el) return;
  el.innerHTML = "";
  (state.slots[slot]||[]).forEach(it=>el.appendChild(makeButton(it, slot)));
}
function renderFactory(){
  const root = $("#mxd-catalog"); if(!root) return;
  root.innerHTML = "";
  CATALOG.forEach(cat=>{
    const wrap = document.createElement("section"); wrap.className = "mxd-cat";
    wrap.innerHTML = `<div class="mxd-cat-name">${cat.category}</div>`;
    const grid = document.createElement("div"); grid.className = "mxd-cat-grid";
    cat.items.forEach(([action,icon,label])=>{ grid.appendChild(makeButton({id:uid("factory"),action,icon,label},"__factory__")); });
    wrap.appendChild(grid); root.appendChild(wrap);
  });
}
function renderSessions(){ window.DualSession?.renderSessions?.(); }
function renderAll(){ renderFactory(); renderSlot("header"); renderSlot("aside"); renderSlot("footer"); renderSlot("loose"); renderSessions(); }

function createSession(name="SESSION"){
  const host = document.body.dataset.sessionHost === 'stack' ? 'stack' : 'float';
  const s = { id:uid("session"), name, url:"https://www.infodose.com.br/splash", host };
  state.sessions.push(s); state.slots["session:"+s.id]=[];
  save(); renderSessions(); toast(`session "${name}" criada`);
  return s;
}
function removeSession(id){
  state.sessions = state.sessions.filter(s=>s.id!==id);
  delete state.slots["session:"+id];
  save();
}

function activeSessionWin(){
  const wins = $$(".mxp-window:not(.minimized)");
  if(!wins.length) return null;
  let best = wins[0], bestZ = 0;
  wins.forEach(w=>{ const z = parseInt(getComputedStyle(w).zIndex)||0; if(z >= bestZ){ bestZ = z; best = w; } });
  return best;
}

function addToSlot(item, slot){
  state.slots[slot] ??= [];
  const copy = { ...item, id:item.id||uid("btn") };
  state.slots[slot].push(copy); save(); renderSlot(slot);
  toast(`+ ${copy.label||copy.action} → ${slot}`);
}
function removeItem(id, slot){
  if(!state.slots[slot]) return;
  state.slots[slot] = state.slots[slot].filter(x=>x.id!==id);
  save(); renderSlot(slot); toast("removido");
}
function moveItem(id, from, to){
  if(from === to) return;
  const list = state.slots[from]||[]; const i = list.findIndex(x=>x.id===id);
  if(i<0) return;
  const item = list.splice(i,1)[0];
  state.slots[to] ??= []; state.slots[to].push(item);
  save(); renderSlot(from); renderSlot(to); toast(`movido → ${to}`);
}

let gesture = null;
let pendingTap = null;

function flushPendingTap(){
  if(!pendingTap) return;
  clearTimeout(pendingTap.timer);
  const p = pendingTap; pendingTap = null;
  p.btn.classList.remove("is-firing");
  fire(p.item.action, { element:p.btn, slot:p.slot });
}

document.addEventListener("pointerdown", e=>{
  const btn = e.target.closest(".mxp-btn"); if(!btn) return;
  if(btn.closest("[data-win-action]")) return;
  if(e.pointerType==="mouse" && e.button!==0) return;

  gesture = {
    btn, pointerId:e.pointerId, startX:e.clientX, startY:e.clientY,
    x:e.clientX, y:e.clientY, slot:btn.dataset.slot,
    item:itemFromButton(btn), dragging:false, timer:null, ghost:null,
    dualHover:null,
  };
  btn.classList.add("is-holding");
  gesture.timer = setTimeout(startFakeDrag, HOLD_MS);
}, { passive:true });

document.addEventListener("pointermove", e=>{
  if(!gesture || gesture.pointerId!==e.pointerId) return;
  gesture.x = e.clientX; gesture.y = e.clientY;
  const dx = e.clientX-gesture.startX, dy = e.clientY-gesture.startY;
  if(!gesture.dragging && Math.hypot(dx,dy) > MOVE_THRESHOLD){
    clearTimeout(gesture.timer);
    gesture.btn.classList.remove("is-holding");
    gesture = null; return;
  }
  if(!gesture.dragging) return;
  e.preventDefault();
  moveGhost(e.clientX, e.clientY);
  updateDropTargets(e.clientX, e.clientY);
  updateDualTargets(e.clientX, e.clientY);
}, { passive:false });

document.addEventListener("pointerup", e=>{
  if(!gesture || gesture.pointerId!==e.pointerId) return;
  clearTimeout(gesture.timer);
  if(gesture.dragging){
    const moved = Math.hypot(e.clientX-gesture.startX, e.clientY-gesture.startY) > DRAG_THRESHOLD;
    if(moved){ finishFakeDrag(e.clientX, e.clientY); }
    else { cleanupDrag(); gesture = null; }
    return;
  }
  const btn = gesture.btn;
  const slot = gesture.slot;
  const item = gesture.item;
  btn.classList.remove("is-holding");
  gesture = null;
  handleTap(btn, slot, item);
}, { passive:true });

document.addEventListener("pointercancel", ()=>{
  if(!gesture) return;
  clearTimeout(gesture.timer);
  gesture.btn.classList.remove("is-holding","is-source");
  cleanupDrag(); hud(""); gesture = null;
});

function handleTap(btn, slot, item){
  if(slot === "__factory__"){
    addToSlot({...item, id:uid("btn")}, "loose");
    return;
  }
  if(pendingTap && pendingTap.btn === btn){
    clearTimeout(pendingTap.timer);
    pendingTap.btn.classList.remove("is-firing");
    pendingTap = null;
    openContext(btn, slot); return;
  }
  if(pendingTap){ flushPendingTap(); }
  btn.classList.add("is-firing");
  const timer = setTimeout(()=>{
    if(pendingTap && pendingTap.btn === btn){
      pendingTap = null;
      btn.classList.remove("is-firing");
      fire(item.action, { element:btn, slot });
    }
  }, TAP_DELAY);
  pendingTap = { btn, timer, item, slot };
}

function startFakeDrag(){
  if(!gesture) return;
  if(pendingTap && pendingTap.btn === gesture.btn){
    clearTimeout(pendingTap.timer);
    pendingTap.btn.classList.remove("is-firing");
    pendingTap = null;
  }
  gesture.dragging = true;
  gesture.btn.classList.remove("is-holding");
  gesture.btn.classList.add("is-source");
  document.body.classList.add("mxp-dragging");
  const trash = $("#mxd-trash"); if(trash) trash.classList.add("is-active");
  hud("segure · solte em slot OU sobre DUAL tracejado");
  const ghost = document.createElement("div");
  ghost.id = "mxd-ghost";
  ghost.textContent = gesture.item.icon || "•";
  document.body.appendChild(ghost);
  gesture.ghost = ghost;
  requestAnimationFrame(()=>ghost.classList.add("is-live"));
  moveGhost(gesture.x, gesture.y);
  if(navigator.vibrate) try{navigator.vibrate(15)}catch(_){}
}
function moveGhost(x,y){ if(!gesture?.ghost) return; gesture.ghost.style.left = x+"px"; gesture.ghost.style.top = y+"px"; }
function getDropTarget(x,y){
  if(gesture?.ghost) gesture.ghost.style.display = "none";
  const el = document.elementFromPoint(x,y);
  if(gesture?.ghost) gesture.ghost.style.display = "grid";
  return el?.closest("[data-drop-target]");
}
function getDualTarget(x,y){
  if(gesture?.ghost) gesture.ghost.style.display = "none";
  const el = document.elementFromPoint(x,y);
  if(gesture?.ghost) gesture.ghost.style.display = "grid";
  return el?.closest("[data-dual-target]");
}
function updateDropTargets(x,y){
  $$("[data-drop-target]").forEach(el=>el.classList.remove("is-drop-ready"));
  const trash = $("#mxd-trash"); if(trash) trash.classList.remove("is-over");
  const t = getDropTarget(x,y); if(!t) return;
  if(t.dataset.trash !== undefined){ trash.classList.add("is-over"); hud(`soltar para remover · ${gesture.item.label||gesture.item.action}`); return; }
  t.classList.add("is-drop-ready"); hud(`soltar em · ${t.dataset.slot || "slot"}`);
}
function updateDualTargets(x,y){
  $$("[data-dual-target].is-dual-hover").forEach(el=>el.classList.remove("is-dual-hover"));
  gesture.dualHover = null;
  const d = getDualTarget(x,y);
  if(d){ d.classList.add("is-dual-hover"); gesture.dualHover = d; hud(`⛓ vincular a · ${d.dataset.dualAction || 'DUAL'}`); }
}
function finishFakeDrag(x,y){
  clearTimeout(gesture.timer);
  const dualTarget = getDualTarget(x,y);
  const target = getDropTarget(x,y);
  if(dualTarget && gesture.slot !== "__factory__" && !target){
    const dualAction = dualTarget.dataset.dualAction;
    const list = state.slots[gesture.slot]||[];
    const idx = list.findIndex(i=>i.id===gesture.item.id);
    if(idx >= 0){ list[idx].binding = dualAction; list[idx].action = "dual:"+dualAction; save(); renderSlot(gesture.slot); toast(`⛓ vinculado a ${dualAction}`); }
    cleanupDrag(); gesture=null; return;
  }
  if(target && target.dataset.trash !== undefined){
    if(gesture.slot !== "__factory__") removeItem(gesture.item.id, gesture.slot);
    cleanupDrag(); gesture=null; return;
  }
  if(target){
    const to = target.dataset.slot;
    if(gesture.slot === "__factory__") addToSlot({...gesture.item, id:uid("btn")}, to);
    else moveItem(gesture.item.id, gesture.slot, to);
    cleanupDrag(); gesture=null; return;
  }
  cleanupDrag(); gesture=null;
}
function cleanupDrag(){
  if(!gesture) return;
  gesture.btn.classList.remove("is-source");
  gesture.ghost?.remove(); gesture.ghost=null;
  const trash = $("#mxd-trash"); if(trash) trash.classList.remove("is-active","is-over");
  $$("[data-drop-target]").forEach(el=>el.classList.remove("is-drop-ready"));
  $$("[data-dual-target].is-dual-hover").forEach(el=>el.classList.remove("is-dual-hover"));
  document.body.classList.remove("mxp-dragging");
  hud("");
}

let contextItem = null;
function openContext(btn, slot){
  if(slot === "__factory__") return;
  contextItem = { btn, item:itemFromButton(btn), slot };
  const menu = $("#mxd-context");
  const head = $("#mxd-ctx-head");
  if(head) head.textContent = contextItem.item.label || contextItem.item.action;
  const r = btn.getBoundingClientRect();
  menu.style.left = Math.min(window.innerWidth-190, Math.max(10,r.left))+"px";
  menu.style.top  = Math.min(window.innerHeight-220, r.bottom+8)+"px";
  menu.classList.add("is-open");
}
function closeContext(){ $("#mxd-context").classList.remove("is-open"); contextItem = null; }
$("#mxd-context").addEventListener("click", e=>{
  const a = e.target.closest("[data-context-action]")?.dataset.contextAction;
  if(!a || !contextItem) return;
  const { item, slot } = contextItem;
  if(a==="fire") fire(item.action, { item, slot });
  if(a==="duplicate") addToSlot({...item, id:uid("copy"), binding:""}, slot);
  if(a==="unbind"){ const list = state.slots[slot]||[]; const i = list.findIndex(x=>x.id===item.id); if(i>=0){ list[i].binding = ""; save(); renderSlot(slot); toast("desvinculado"); } }
  if(a==="favorite"){ const s = createSession("fav:"+(item.label||item.action)); addToSlot({...item, id:uid("fav")}, "session:"+s.id); }
  if(a==="remove") removeItem(item.id, slot);
  closeContext();
});
document.addEventListener("pointerdown", e=>{ if($("#mxd-context").classList.contains("is-open") && !e.target.closest("#mxd-context")) closeContext(); });

function openFactory(){ $("#mxd-factory").classList.add("is-open"); }
function closeFactory(){ $("#mxd-factory").classList.remove("is-open"); }
window.openFactory = openFactory;
$("#mxd-factory").addEventListener("click", e=>{ if(e.target.id === "mxd-factory") closeFactory(); });

document.addEventListener("keydown", e=>{
  if((e.ctrlKey||e.metaKey) && e.shiftKey && e.key.toLowerCase()==="b"){ e.preventDefault(); const f=$("#mxd-factory"); if(f) f.classList.toggle("is-open"); }
  if(e.key === "Escape"){ closeFactory(); closeContext(); }
});

function seed(){
  /* FIX v14 — BUG RAIZ do "loose não salva": seed() rodava de forma
     síncrona no parse, e KBLX_LOAD só popula `state` real 200ms depois
     (setTimeout). Ou seja, o teste de "está vazio?" via olhava pro
     state recém-inicializado (sempre vazio) mesmo quando já existia
     um save de verdade no localStorage — e o save() do seed rodava
     ANTES do load, sobrescrevendo os botões salvos com os 6 padrão
     em TODO carregamento. Agora, se já existe um root salvo, seed()
     nem olha pro state em memória: quem popula é o KBLX_LOAD. */
  const hasSavedRoot = window.Store && window.Store.get(window.KBLX_KEYS.root);
  if (hasSavedRoot) { console.log('[MXP] save existente — seed pulado'); return; }
  const empty = !state.slots.header?.length && !state.slots.aside?.length && !state.slots.footer?.length && !state.slots.loose?.length && !state.sessions.length;
  if(!empty) return;
  state.slots.header = [{ id:uid("s"), action:"dual:theme-toggle", icon:"☼", label:"TEMA" }];
  state.slots.aside = [
    { id:uid("s"), action:"extras:import-slicer", icon:"⌲", label:"SLICER" },
    { id:uid("s"), action:"extras:paste-slicer", icon:"✎", label:"COLAR" },
    { id:uid("s"), action:"extras:generate", icon:"⇄", label:"GERAR" },
    { id:uid("s"), action:"extras:toggle-carousel", icon:"◈", label:"ARQ." },
  ];
  state.slots.footer = [
    { id:uid("s"), action:"factory:open", icon:"◈", label:"FACTORY" },
    { id:uid("s"), action:"dual:drawer", icon:"🔅", label:"COCKPIT" },
  ];
  state.slots.loose = [
    { id:uid("s"), action:"dual:new-session", icon:"＋", label:"NOVA" },
    { id:uid("s"), action:"state:reset", icon:"⌦", label:"RESET" },
  ];
  save();
}

seed();
renderAll();

window.MXP = {
  get state(){ return state; },
  CATALOG, fire, createSession, removeSession, addToSlot, removeItem, moveItem,
  toast, save, render: renderAll, renderSlot, renderSessions,
  reset(){ state = defaultState(); save(); renderAll(); },
  openFactory, closeFactory,
};
console.log('[MXP] v13 · tap=fire(240ms) · tap²=menu · hold=drag · host-aware');
})();

/* ===== botoes-de-backup.js ===== */
(function(){
"use strict";
window.KBLX_SAVE = function(){
  try{
    const K = window.KBLX_KEYS;
    /* FIX v14: salvava document.body.className inteiro em "mode" —
       ao restaurar, sobrescrevia TODAS as classes do body (reveal,
       has-maximized, field-closed etc.), não só o modo solar.
       Agora salva/restaura só a classe mode-*. */
    const __modeClasses = ['mode-night','mode-day','mode-sunset'];
    const __curMode = __modeClasses.find(m=>document.body.classList.contains(m)) || 'mode-night';
    window.Store.set(K.ui, {
      mode: __curMode,
      voiceArch: document.body.dataset.voiceArch,
      sessionHost: document.body.dataset.sessionHost,
      sb: window.__sbGetPos ? window.__sbGetPos() : null,
    });
    window.Store.set(K.arch, window.getArch ? window.getArch() : "JESUS");
    window.Store.set(K.bg, window.__bgState || {});
    window.Store.set(K.user, {
      id: document.getElementById('inputUserId')?.value || "",
      model: document.getElementById('inputModel')?.value || "",
      lastUrl: document.getElementById('urlInputNav')?.value || "",
    });
    if(window.AlfaBetaState){
      const st = window.AlfaBetaState;
      window.Store.set(K.dialog, {
        units: st.units, index: st.index, cycle: st.cycle,
        history: st.history, bank: st.bank,
        sourceText: document.getElementById('sourceText')?.value || "",
      });
    }
    if(window.Nebula?.state){
      window.Store.set(K.nebula, { raw: window.Nebula.state.raw || "", title: window.Nebula.state.title || "" });
    }
    if(window.MXP?.state){
      window.Store.set(K.mxp, window.MXP.state);
    }
    window.Store.set(K.root, { v:13, ts:Date.now(), NS:window.KBLX_NS });
    const snap = {};
    Object.entries(K).forEach(([k,key])=>{ if(k!=="backup"){ const v = window.Store.get(key); if(v!=null) snap[k]=v; } });
    window.Store.set(K.backup, snap);
  }catch(e){ console.warn('save error', e); }
};

window.KBLX_LOAD = function(){
  try{
    const K = window.KBLX_KEYS;
    const rootIdx = window.Store.get(K.root);
    if(!rootIdx) return false;
    const ui = window.Store.get(K.ui); if(ui){
      if(ui.mode){
        document.body.classList.remove('mode-night','mode-day','mode-sunset');
        document.body.classList.add(ui.mode);
      }
      if(ui.sessionHost) document.body.dataset.sessionHost = ui.sessionHost;
      window.syncHostModeLabel?.();
      if(ui.sb && window.__sbRestore) window.__sbRestore(ui.sb);
      if(ui.voiceArch && window.applyArch) window.applyArch(ui.voiceArch);
    }
    const arch = window.Store.get(K.arch);
    if(arch && window.applyArch) window.applyArch(arch);
    const bg = window.Store.get(K.bg);
    if(bg){ window.__bgState = bg; if(window.__bgApply) window.__bgApply(); }
    const user = window.Store.get(K.user);
    if(user){
      const iu=document.getElementById('inputUserId'); if(iu && user.id) iu.value=user.id;
      const im=document.getElementById('inputModel'); if(im && user.model) im.value=user.model;
      const lu=document.getElementById('urlInputNav'); if(lu && user.lastUrl) lu.value=user.lastUrl;
    }
    const mxp = window.Store.get(K.mxp);
    if(mxp && window.MXP){ Object.assign(window.MXP.state, mxp); window.MXP.render(); }
    const dialog = window.Store.get(K.dialog);
    if(dialog && window.KBLX_REBUILD_DIALOGUE) window.KBLX_REBUILD_DIALOGUE(dialog);
    const nebula = window.Store.get(K.nebula);
    if(nebula?.raw && window.Nebula) window.Nebula.loadDocument(nebula.raw, nebula.title || "Documento");
    return true;
  }catch(e){ console.warn('load error', e); return false; }
};

let _sT = null;
const scheduleSave = ()=>{ clearTimeout(_sT); _sT = setTimeout(()=>window.KBLX_SAVE(), 400); };
window.addEventListener('beforeunload', ()=>window.KBLX_SAVE());
/* FIX v14: beforeunload não é confiável em mobile/PWA (Safari iOS
   pode matar a página sem disparar). visibilitychange + pagehide
   cobrem o caso real de troca de app / minimizar. */
document.addEventListener('visibilitychange', ()=>{
  if (document.visibilityState === 'hidden') window.KBLX_SAVE();
});
window.addEventListener('pagehide', ()=>window.KBLX_SAVE());

/* Botões de backup */
document.getElementById('exportState')?.addEventListener('click', ()=>{
  window.KBLX_SAVE();
  const snap = window.Store.get(window.KBLX_KEYS.backup) || {};
  const blob = new Blob([JSON.stringify(snap, null, 2)], {type:'application/json'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = `kobllux-backup-${Date.now()}.json`;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(()=>URL.revokeObjectURL(url), 1000);
  window.KBLX_TOAST('Backup exportado ✓');
});
document.getElementById('importState')?.addEventListener('click', ()=>{
  const inp = document.createElement('input');
  inp.type = 'file'; inp.accept = '.json,application/json';
  inp.addEventListener('change', async ()=>{
    const f = inp.files[0]; if(!f) return;
    try{
      const snap = JSON.parse(await f.text());
      if(!snap || !snap.root) return window.KBLX_TOAST('Backup inválido');
      Object.entries(snap).forEach(([k,v])=>{
        const key = window.KBLX_KEYS[k]; if(key) window.Store.set(key, v);
      });
      window.KBLX_TOAST('Backup importado · recarregando…');
      setTimeout(()=>location.reload(), 500);
    }catch(_){ window.KBLX_TOAST('Erro ao ler backup'); }
  });
  inp.click();
});
document.getElementById('resetAllState')?.addEventListener('click', ()=>{
  if(!confirm('Apagar TUDO (MXP + backup + bg + arch + user)?')) return;
  window.Store.clearAll();
  window.KBLX_TOAST('Tudo apagado · recarregando…');
  setTimeout(()=>location.reload(), 500);
});

/* Boot: tentar restaurar */
setTimeout(()=>{
  if(window.KBLX_LOAD()) console.log('[KOBLLUX] estado restaurado de kobllux:*');
  else console.log('[KOBLLUX] sem backup, iniciando fresh');
  window.KBLX_restoreDockOnBoot?.();
}, 200);
})();

/* ===== source-https-kodux78k-github-io-oidual-y-js-inline-1-js.js ===== */
/* SOURCE: https://kodux78k.github.io/oiDual--Y-/js/inline-1.js */


/* =========================================================
   DUAL.INFODOSE v7.9 — KOBLLUX VISIO & MEMORIA
   - Fix: Cristalização (Deck) funcional e visível
   - New: Visualizador HTML (Preview/Code/Fullscreen/Mobile)
   - Core: Fractal 3-6-9-7 + Ciclos Solares
========================================================= */

const STORAGE = {
    API_KEY: 'di_apiKey',
    MODEL: 'di_modelName',
    SYSTEM_ROLE: 'di_systemRole',
    USER_ID: 'di_userName',
    BG_IMAGE: 'di_bgImage',
    CUSTOM_CSS: 'di_customCss',
    SOLAR_MODE: 'di_solarMode',
    SOLAR_AUTO: 'di_solarAuto',
    INFODOSE_NAME: 'di_infodoseName',
    ASSISTANT_ENABLED: 'di_assistantEnabled',
    TRAINING_ACTIVE: 'di_trainingActive',
    TRAINING_TEXT: 'di_trainingText',
    MESSAGES: 'di_messages'
};

// KODUX ARQUÉTIPOS E FASES
const KODUX = {
    ARQUETIPOS: { "Atlas":{Essencia:"Planejador"}, "Nova":{Essencia:"Inspira"}, "Vitalis":{Essencia:"Momentum"}, "Pulse":{Essencia:"Emocional"}, "Artemis":{Essencia:"Descoberta"}, "Serena":{Essencia:"Cuidado"}, "Kaos":{Essencia:"Transformador"}, "Genus":{Essencia:"Fabricus"}, "Lumine":{Essencia:"Alegria"}, "Solus":{Essencia:"Sabedoria"}, "Rhea":{Essencia:"Vínculo"}, "Aion":{Essencia:"Tempo"} },
    PROJETO: { "I. INTRODUÇÃO":{fase:"KODUX (Δ³)",arquetipos:["Atlas","Nova","Pulse"]}, "II. ATO I":{fase:"BLLUE (Δ⁶)",arquetipos:["Vitalis","Pulse","Genus"]}, "III. ATO II":{fase:"EXPANSÃO (Δ⁹)",arquetipos:["Genus","Nova","Vitalis"]}, "IV. ATO III":{fase:"CONVERGÊNCIA (Δ⁹)",arquetipos:["Genus","Aion","Pulse"]}, "V. EPÍLOGO":{fase:"VERBO ETERNO (Δ⁷)",arquetipos:["Atlas","Aion","Genus"]} }
};


/* ═══════════════════════════════════════════════════════════════
   INTEGRAÇÃO DE CONSTANTES di_* DO LOCALSTORAGE
   ═══════════════════════════════════════════════════════════════ */

function initDIConstants() {
    const di_userName = localStorage.getItem('di_userName') || 'Viajante';
    const di_infodoseName = localStorage.getItem('di_infodoseName') || 'KOBLLUX';
    const di_apiKey = localStorage.getItem('di_apiKey') || '';
    const di_modelName = localStorage.getItem('di_modelName') || 'nvidia/nemotron-3-nano-30b-a3b:free';
    const di_systemRole = localStorage.getItem('di_systemRole') || 'oi Dual';
    const di_solarMode = localStorage.getItem('di_solarMode') || 'night';
    const di_assistantEnabled = localStorage.getItem('di_assistantEnabled') === '1';
    const di_trainingActive = localStorage.getItem('di_trainingActive') === '1';
    const di_trainingText = localStorage.getItem('di_trainingText') || '';
    
    // Atualizar elementos da UI
    const usernameDisplay = document.getElementById('usernameDisplay');
    if (usernameDisplay) {
        usernameDisplay.textContent = di_userName;
    }
    
    const modeIndicator = document.getElementById('modeIndicator');
    if (modeIndicator) {
        modeIndicator.textContent = `${di_infodoseName} · ${di_solarMode.toUpperCase()}`;
    }
    
    // Preencher inputs com valores salvos
    const apiKeyInput = document.getElementById('apiKeyInput');
    if (apiKeyInput) apiKeyInput.value = di_apiKey;
    
    const systemRoleInput = document.getElementById('systemRoleInput');
    if (systemRoleInput) systemRoleInput.value = di_systemRole;
    
    const inputUserId = document.getElementById('inputUserId');
    if (inputUserId) inputUserId.value = di_userName;
    
    const inputModel = document.getElementById('inputModel');
    if (inputModel) inputModel.value = di_modelName;
    
    // Salvar no localStorage se não existir
    if (!localStorage.getItem('di_userName')) localStorage.setItem('di_userName', di_userName);
    if (!localStorage.getItem('di_infodoseName')) localStorage.setItem('di_infodoseName', di_infodoseName);
    if (!localStorage.getItem('di_solarMode')) localStorage.setItem('di_solarMode', di_solarMode);
    
    console.log('[DI_CONSTANTS] Inicializado:', { di_userName, di_infodoseName, di_apiKey: di_apiKey ? '✓' : '✗' });
}

// Chamar ao carregar a página
document.addEventListener('DOMContentLoaded', initDIConstants);

const FOOTER_TEXTS = { closed:{ritual:["tocar o campo é consentir","registro aguarda presença"],tecnico:["latência detectada","aguardando input"]}, open:{sustentado:["campo ativo","consciência expandida"],estavel:["sinal estabilizado","link neural firme"]}, loading:["sincronizando neuro-link...","buscando no éter...","decodificando sinal..."] };

let lastText = null;
function getRandomText(arr){ if(!arr||arr.length===0)return"Processando..."; let t; do{t=arr[Math.floor(Math.random()*arr.length)];}while(t===lastText&&arr.length>1); lastText=t; return t; }

/* ---------------------------------------------------------
   KOBLLUX CORE (3-6-9-7)
   --------------------------------------------------------- */
const KoblluxCore = {
    async sha256Hex(s) { const d = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s)); return [...new Uint8Array(d)].map(b=>b.toString(16).padStart(2,'0')).join(''); },
    classifyText(s) { const t = (s.match(/[\p{L}\p{N}_-]+/gu)||[]); const endsV = ['ar','er','ir']; const verbs=[],nouns=[],adjs=[]; for (const w0 of t){ const w = w0.toLowerCase(); if(w.endsWith('mente')){adjs.push(w0);continue;} if(endsV.some(e=>w.endsWith(e))){verbs.push(w0);continue;} if(w.endsWith('ção')||w.endsWith('são')||w.endsWith('dade')){nouns.push(w0);continue;} if(/^[A-Z]/.test(w0)){nouns.push(w0);continue;} } return {tokens:t, verbs, nouns, adjs}; },
    mapTrinity(pos) { return { UNO: pos.nouns[0]||'NÚCLEO', DUAL: pos.verbs[0]||'relaciona', TRINITY: pos.adjs[0]||'integrado' }; },
    async process(input) { if(!input)return null; const pos=this.classifyText(input); const tri=this.mapTrinity(pos); const seal=await this.sha256Hex(input+new Date().toISOString()); return { raw:input, pos:pos, trinity:tri, seal:seal.slice(0,16), log:`[KOBLLUX ∆7] UNO:${tri.UNO}|DUAL:${tri.DUAL}|TRI:${tri.TRINITY}::SEAL:${seal.slice(0,8)}` }; }
};

/* ---------------------------------------------------------
   UTILS: DOWNLOAD, PREVIEW, ZIP
   --------------------------------------------------------- */
const DownloadUtils = {
    _getBlock(btn) { return btn.closest('.msg-block'); },
    _getCleanHtml(block) { const clone = block.cloneNode(true); const tools = clone.querySelector('.msg-tools'); if(tools) tools.remove(); return clone.innerHTML; },
    _guessFilename(base, extFallback='txt') { const t = new Date().toISOString().replace(/[:.]/g,'-'); if (!base) return `ai-output-${t}.${extFallback}`; if (/<\s*!doctype|<html|<body|<head/i.test(base)) return `ai-output-${t}.html`; if (/<pre|<code/i.test(base)) return `ai-code-${t}.${extFallback}`; return `ai-output-${t}.${extFallback}`; },
    downloadMessage(btn) { try { const block = this._getBlock(btn); if(!block) return; const content = this._getCleanHtml(block); const isHTML = /<\s*!doctype|<html|<body|<head|<\/div>/i.test(content); const mime = isHTML ? 'text/html' : 'text/plain'; const ext = isHTML ? 'html' : 'txt'; const filename = this._guessFilename(content, ext); const blob = new Blob([content], { type: mime + ';charset=utf-8' }); this.triggerDownload(blob, filename); App.showToast(`Download: ${filename}`); } catch(e){ App.showToast('Erro download', true); } },
    downloadMarkdown(btn) { try { const block = this._getBlock(btn); if(!block) return; const raw = block.dataset.raw || block.innerText || ''; const filename = this._guessFilename(raw, 'md').replace(/\.(html|txt)$/, '.md'); const blob = new Blob([raw], { type: 'text/markdown;charset=utf-8' }); this.triggerDownload(blob, filename); App.showToast(`MD salvo: ${filename}`); } catch(e){ App.showToast('Erro MD', true); } },
    openSandbox(btn) { try { const block = this._getBlock(btn); if(!block) return; const content = this._getCleanHtml(block); let page = content; if(!/<\s*!doctype|<html/i.test(content)) page = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Sandbox</title></head><body>${content}</body></html>`; const blob = new Blob([page], { type: 'text/html' }); const url = URL.createObjectURL(blob); window.open(url, '_blank'); App.showToast('Sandbox aberto'); } catch(e){ App.showToast('Erro sandbox', true); } },
    async exportPdf(btn) { try { if(typeof html2pdf === 'undefined') { App.showToast('PDF lib ausente. Use Sandbox.', true); return this.openSandbox(btn); } const block = this._getBlock(btn); if(!block) return; const content = this._getCleanHtml(block); const container = document.createElement('div'); container.style.position = 'fixed'; container.style.left = '-9999px'; container.style.width = '1100px'; container.style.padding = '20px'; container.style.background = '#ffffff'; container.innerHTML = content; document.body.appendChild(container); const filename = this._guessFilename(content, 'pdf').replace(/\.(html|txt)$/, '.pdf'); await html2pdf().from(container).set({ margin: 12, filename: filename, html2canvas: { scale: 2 }, jsPDF: { unit: 'pt', format: 'a4' } }).save(); document.body.removeChild(container); App.showToast(`PDF: ${filename}`); } catch(e){ App.showToast('Erro PDF', true); } },
    triggerDownload(blob, filename) { const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = filename; document.body.appendChild(a); a.click(); document.body.removeChild(a); setTimeout(() => URL.revokeObjectURL(url), 2000); }
};

const Preview = {
    async renderPreview(file) {
        const type = file.type || 'text/plain'; const name = file.name || 'arquivo'; const url = URL.createObjectURL(file);
        if (type === 'text/html' || name.endsWith('.html')) { const text = await file.text(); const blob = new Blob([this.sanitizeHTML(text)], { type: 'text/html' }); return `<div class="preview-html"><iframe src="${URL.createObjectURL(blob)}" sandbox="allow-scripts"></iframe></div>`; }
        if (type.startsWith('image/')) return `<div class="preview-html"><img src="${url}" style="width:100%;height:100%;object-fit:contain;background:#000;"></div>`;
        const text = await file.text(); const ext = name.split('.').pop() || 'txt'; const code = this.escapeHTML(text.slice(0, 2000)); setTimeout(() => { hljs.highlightAll(); }, 0); return `<div class="preview-code"><pre><code class="language-${ext}">${code}</code></pre></div>`;
    },
    sanitizeHTML(html) { const div = document.createElement('div'); div.innerHTML = html; div.querySelectorAll('script').forEach(s => s.remove()); return div.innerHTML; },
    escapeHTML(str) { return str.replace(/[&<>"']/g, s => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[s])); },
    
    // VISUALIZADOR HTML (Atualizado)
    createHtmlViewer(htmlCode) {
        const id = 'html-' + Date.now();
        const blob = new Blob([htmlCode], {type: 'text/html'});
        const url = URL.createObjectURL(blob);
        const codeEscaped = this.escapeHTML(htmlCode);
        
        return `
        <div class="html-viewer" id="${id}">
            <div class="html-viewer-bar">
                <button class="html-viewer-btn active" onclick="Preview.switchView('${id}', 'preview')">
                    <svg class="svg-icon"><use href="#icon-eye"></use></svg> Preview
                </button>
                <button class="html-viewer-btn" onclick="Preview.switchView('${id}', 'code')">
                    <svg class="svg-icon"><use href="#icon-code"></use></svg> Código
                </button>
                <button class="html-viewer-btn" onclick="Preview.openFullscreen('${id}', '${url.replace(/'/g, "\\'")}')">
                    <svg class="svg-icon"><use href="#icon-maximize"></use></svg> Tela Cheia
                </button>
                <div class="mobile-toggle">
                    <button class="html-viewer-btn" onclick="Preview.toggleMobile('${id}')">
                        <svg class="svg-icon"><use href="#icon-eye"></use></svg> Mobile
                    </button>
                </div>
            </div>
            <div class="html-viewer-content">
                <iframe src="${url}" sandbox="allow-scripts allow-popups"></iframe>
                <div class="html-viewer-code"><pre><code class="language-html">${codeEscaped}</code></pre></div>
            </div>
        </div>`;
    },

    switchView(id, mode) {
        const container = document.getElementById(id);
        if(!container) return;
        
        if(mode === 'code') {
            container.classList.add('show-code');
        } else {
            container.classList.remove('show-code');
        }
        
        // Atualiza botões ativos
        container.querySelectorAll('.html-viewer-btn').forEach(b => b.classList.remove('active'));
        event.currentTarget.classList.add('active');
    },

    openFullscreen(id, url) {
        const container = document.getElementById(id);
        if(!container) return;
        
        // Modo tela cheia
        container.classList.add('fullscreen');
        container.querySelector('iframe').src = url;
        
        // Botão para sair
        const bar = container.querySelector('.html-viewer-bar');
        const exitBtn = document.createElement('button');
        exitBtn.className = 'html-viewer-btn';
        exitBtn.innerHTML = '<svg class="svg-icon"><use href="#icon-restore"></use></svg> Sair';
        exitBtn.onclick = () => {
            container.classList.remove('fullscreen');
            exitBtn.remove();
        };
        bar.appendChild(exitBtn);
    },

    toggleMobile(id) {
        const container = document.getElementById(id);
        if(!container) return;
        
        container.classList.toggle('mobile');
        
        // Atualiza botão mobile
        const btn = event.currentTarget;
        if(container.classList.contains('mobile')) {
            btn.innerHTML = '<svg class="svg-icon"><use href="#icon-eye"></use></svg> Desktop';
        } else {
            btn.innerHTML = '<svg class="svg-icon"><use href="#icon-eye"></use></svg> Mobile';
        }
    }
};

const ZipGenerator = {
    async generateZip() {
        try {
            const { default: JSZip } = await import('https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js');
            const zip = new JSZip();
            const root = zip.folder("KOBLLUX_INTEGRADO");
            root.folder("00_CORE").file("config.json", JSON.stringify(KODUX, null, 2));
            root.folder("00_CORE").file("timestamp.txt", new Date().toISOString());
            root.folder("01_CYCLES_3x3"); root.folder("02_PARTS"); root.folder("03_REDE"); root.folder("04_EXPORT");
            
            const content = await zip.generateAsync({ type: "blob" });
            const md5 = await this.hash(content, 'MD5');
            const sha = await this.hash(content, 'SHA-256');
            const name = `KOBLLUX_${new Date().toISOString().slice(0,10)}.zip`;
            DownloadUtils.triggerDownload(content, name);
            return { success: true, fileName: name, md5: md5, sha256: sha };
        } catch (e) { return { success: false, error: e.message }; }
    },
    async hash(blob, algo) { const b = await blob.arrayBuffer(); const h = await crypto.subtle.digest(algo, b); return Array.from(new Uint8Array(h)).map(x => x.toString(16).padStart(2,'0')).join(''); }
};

const Utils = {
    copy(btn) { const b = btn.closest('.msg-block'); if(!b)return; navigator.clipboard.writeText(b.innerText.replace("content_copy","").trim()); App.showToast("Copiado"); },
    speak(btn) { const b = btn.closest('.msg-block'); if(!b)return; App.speakText(b.innerText.replace(/<[^>]*>?/gm, '').trim()); },
    edit(btn) { const b = btn.closest('.msg-block'); const t = b.innerText.replace("content_copy","").trim(); document.getElementById('userInput').value = t; b.remove(); App.speakText("Editando"); }
};

/* ---------------------------------------------------------
   MAIN APP CONTROLLER
   --------------------------------------------------------- */
const App = {
    state: { open: false, messages: [], isAutoSolar: true, solarMode: 'night', isProcessing: false, isListening: false, recognition: null },
    
    init() {
        const s = localStorage;
        document.getElementById('apiKeyInput').value = s.getItem(STORAGE.API_KEY) || '';
        
        const baseRole = s.getItem(STORAGE.SYSTEM_ROLE) || 'Você é Dual.';
        if(!baseRole.includes("KODUX")) document.getElementById('systemRoleInput').value = baseRole + `\n[SISTEMA KODUX V7.9]\nArquétipos: ${Object.keys(KODUX.ARQUETIPOS).join(', ')}. Use V.E.E.B.`;
        else document.getElementById('systemRoleInput').value = baseRole;

        document.getElementById('inputUserId').value = s.getItem(STORAGE.USER_ID) || '';
        document.getElementById('inputModel').value = s.getItem(STORAGE.MODEL) || '';
        this.state.isAutoSolar = s.getItem(STORAGE.SOLAR_AUTO) !== 'false';
        
        // CORREÇÃO: Força o modo correto na inicialização
        // FIX v14: existiam 2 fontes de verdade pro modo solar (kobllux:ui.mode
        // vs STORAGE.SOLAR_MODE aqui) rodando em momentos diferentes do boot
        // (KBLX_LOAD em 200ms vs App.init em window.onload) — a que rodasse
        // por último vencia, fazendo o tema "voltar" sozinho. Agora App.init
        // sempre prioriza o valor já restaurado pelo KOBLLUX, se existir.
        {
          const __kblxUi = window.Store?.get(window.KBLX_KEYS?.ui);
          if (__kblxUi?.mode) { this.state.isAutoSolar = false; this.setMode(__kblxUi.mode.replace('mode-','')); }
          else if (this.state.isAutoSolar) this.autoByTime();
          else this.setMode(s.getItem(STORAGE.SOLAR_MODE) || 'night');
        }

        this.indexedDB.loadCustomCSS();
        /* v14: loadBackground() desativado — 3º sistema de bg concorrente
           (IndexedDB), sem controle de opacidade/blend, brigava com o
           Cockpit (__bgState) e a galeria (di_bgImages) pelo mesmo
           #bg-fake-custom. O Cockpit já é a fonte única agora. */
        this.setupVoiceSystem();
        this.bindEvents();
        this.updateUI();
        this.toggleField(false, true); 
        this.renderDeck();
        
        setTimeout(() => this.announce("KOBLLUX V7.9 Visio. Memória Ativa."), 1200);
        if(typeof particlesJS !== 'undefined') particlesJS('particles-js', {
  particles: {
    number: { value: 24 },

    color: { value: ['#0ff', '#f0f'] },

    shape: { type: 'circle' },

    opacity: { value: 0.4 },

    size: { value: 2.4 },

    line_linked: {
      enable: true,
      distance: 150,
      color: '#ffffff',
      opacity: 0.4,
      width: 1
    },

    move: {
      enable: true,
      speed: 1.5
    }
  },

  retina_detect: true
});
    },

    // --- VOZ ---
    setupVoiceSystem() {
        if (!('webkitSpeechRecognition' in window)) return;
        this.state.recognition = new webkitSpeechRecognition();
        this.state.recognition.lang = 'pt-BR';
        this.state.recognition.continuous = true; 
        this.state.recognition.interimResults = true;
        this.state.recognition.onstart = () => { this.state.isListening = true; document.getElementById('btnVoice').classList.add('listening'); this.showToast("🎙️ Voz Ativa..."); };
        this.state.recognition.onend = () => { if (this.state.isListening) try { this.state.recognition.start(); } catch(e){} else document.getElementById('btnVoice').classList.remove('listening'); };
        this.state.recognition.onresult = (e) => { let t=''; for(let i=e.resultIndex;i<e.results.length;++i) t+=e.results[i][0].transcript; document.getElementById('userInput').value=t; };
        this.state.recognition.onerror = (e) => { if(e.error!=='no-speech') { this.state.isListening=false; document.getElementById('btnVoice').classList.remove('listening'); } };
    },
    toggleVoice() {
        if (!this.state.recognition) return;
        if (this.state.isListening) { this.state.isListening = false; this.state.recognition.stop(); }
        else { window.speechSynthesis.cancel(); document.getElementById('userInput').value = ''; try { this.state.recognition.start(); } catch(e){} }
    },

    // --- UPLOAD ---
    setupFileUpload() {
        const input = document.getElementById('fileUploadInput');
        document.getElementById('btnUploadFile').onclick = () => input.click();
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;
            const preview = document.getElementById('filePreview');
            preview.querySelector('.file-info span').textContent = file.name;
            preview.classList.add('active');
            preview.querySelector('.file-actions').innerHTML = `<button class="btn-preview" onclick="App.cancelUpload()">✕</button><button class="btn-preview primary" onclick="App.confirmUpload('${file.name}')">Assimilar</button>`;
        };
    },
    cancelUpload() { document.getElementById('filePreview').classList.remove('active'); document.getElementById('fileUploadInput').value = ''; },
    async confirmUpload(fileName) {
        const file = document.getElementById('fileUploadInput').files[0];
        if(!file) return;
        const reader = new FileReader();
        reader.onload = async (e) => {
            const content = e.target.result;
            const previewHTML = await Preview.renderPreview(file);
            const size = (file.size/1024/1024).toFixed(2);
            this.addFileMessage(file, previewHTML, size);
            const fractal = await KoblluxCore.process(content);
            this.addMessage('system', `Memória Fractal: ${fileName}\n${fractal.log}`);
            this.state.messages.push({ role: 'user', content: `[ARQUIVO: ${fileName}]\n[TRINITY: ${JSON.stringify(fractal.trinity)}]\n${content}\n[SELO: ${fractal.seal}]` });
            this.cancelUpload();
        };
        reader.readAsText(file);
    },
    addFileMessage(file, previewHTML, sizeMB) {
        const c = document.getElementById('chat-container');
        const d = document.createElement('div');
        d.className = 'msg-block file-msg ai';
        d.innerHTML = `<div class="file-header"><strong>${file.name}</strong><span class="file-meta">${sizeMB} MB • ${file.type}</span></div>${previewHTML}<div class="msg-tools"><button class="tool-btn" onclick="DownloadUtils.triggerDownload(new Blob(['${file.name}']), '${file.name}')">📥 Baixar</button></div>`;
        c.appendChild(d); c.scrollTop = c.scrollHeight;
    },

    // --- CHAT ---
    async handleSend() {
        const input = document.getElementById('userInput');
        const txt = input.value.trim();
        if (!txt || this.state.isProcessing) return;

        if(txt.toLowerCase() === '/atlas') {
            input.value = ''; this.addMessage('user', txt);
            let rep = "### ♾️ ATLAS KODUX\n";
            for(const [k,v] of Object.entries(KODUX.ARQUETIPOS)) rep+=`- **${k}**: ${v.Essencia}\n`;
            this.addMessage('ai', rep); return;
        }
        if(txt.toLowerCase() === '/zip') {
            input.value = ''; this.addMessage('user', txt);
            this.addMessage('system', "Gerando KOBLLUX...");
            const res = await ZipGenerator.generateZip();
            this.addMessage('system', res.success ? `✅ Pacote: ${res.fileName}\nSHA: ${res.sha256}` : `❌ Erro: ${res.error}`);
            return;
        }

        const fractal = await KoblluxCore.process(txt);
        input.value = '';
        this.addMessage('user', txt);
        this.state.isProcessing = true;
        document.getElementById('field-toggle-handle').innerHTML = `<span class="footer-dot pulse"></span> ${getRandomText(FOOTER_TEXTS.loading)}`;
        
        const key = localStorage.getItem(STORAGE.API_KEY);
        if (!key && !document.getElementById('inputModel').value.includes(':free')) { this.announce("Erro: API Key."); this.state.isProcessing = false; return; }

        try {
            document.body.classList.add('loading');
            const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${key}`, 'Content-Type': 'application/json', 'HTTP-Referer': location.origin },
                body: JSON.stringify({
                    model: document.getElementById('inputModel').value,
                    messages: [ 
                        { role: 'system', content: document.getElementById('systemRoleInput').value },
                        ...this.state.messages.slice(-10).map(m => ({ role: m.role, content: m.content })),
                        { role: 'user', content: `${txt}\n\n[KOBLLUX]\nUNO:${fractal.trinity.UNO}\nSELO:${fractal.seal}` } 
                    ]
                })
            });
            const data = await res.json();
            const aiContent = data.choices?.[0]?.message?.content || "Sem sinal.";
            
            // DETECTAR SE É HTML PURO PARA O VISUALIZADOR
            if (/^\s*(<!doctype html|<html)/i.test(aiContent)) {
               this.addHTMLViewer(aiContent);
               // Adiciona ao histórico sem renderizar de novo
               this.state.messages.push({ role: 'assistant', content: aiContent });
            } else {
               this.addMessage('ai', aiContent);
            }
            
        } catch (e) { this.announce("Erro conexão."); } 
        finally { document.body.classList.remove('loading'); this.state.isProcessing = false; this.toggleField(this.state.open, true); }
    },

    addMessage(role, text) {
        const c = document.getElementById('chat-container');
        const d = document.createElement('div'); d.className = `msg-block ${role}`; d.dataset.raw = text||'';
        
        let html = role==='ai' ? marked.parse(text) : text.replace(/\n/g, '<br>');
        
        if(role !== 'system') {
            html += `<div class="msg-tools">
                <button class="tool-btn" onclick="Utils.copy(this)" title="Copiar"><svg><use href="#icon-copy"></use></svg></button>
                <button class="tool-btn" onclick="Utils.speak(this)" title="Ouvir"><svg><use href="#icon-mic"></use></svg></button>
                ${role === 'ai' ? `
                  <button class="tool-btn" onclick="DownloadUtils.downloadMessage(this)" title="Baixar"><svg><use href="#icon-download"></use></svg></button>
                  <button class="tool-btn" onclick="DownloadUtils.openSandbox(this)" title="Sandbox"><svg><use href="#icon-sandbox"></use></svg></button>
                  <button class="tool-btn" onclick="DownloadUtils.exportPdf(this)" title="PDF"><svg><use href="#icon-pdf"></use></svg></button>` : 
                  `<button class="tool-btn" onclick="Utils.edit(this)" title="Editar"><svg><use href="#icon-edit"></use></svg></button>`}
            </div>`;
            this.state.messages.push({ role: role==='ai'?'assistant':'user', content: text });
        }
        d.innerHTML = html;
        if (role === 'ai') d.querySelectorAll('pre').forEach(pre => { 
            const btn = document.createElement('button'); btn.className = 'copy-code-btn'; btn.textContent = 'Copiar'; 
            btn.onclick = () => { navigator.clipboard.writeText(pre.querySelector('code').innerText); btn.textContent='Copiado!'; setTimeout(()=>btn.textContent='Copiar',2000); };
            pre.appendChild(btn); 
        });
        c.appendChild(d); c.scrollTop = c.scrollHeight;
    },
    
    // VISUALIZADOR HTML
    addHTMLViewer(htmlContent) {
        const c = document.getElementById('chat-container');
        const d = document.createElement('div'); d.className = `msg-block ai`;
        const viewerHTML = Preview.createHtmlViewer(htmlContent);
        d.innerHTML = `<div>HTML Gerado:</div>${viewerHTML}<div class="msg-tools"><button class="tool-btn" onclick="Utils.copy(this)"><svg><use href="#icon-copy"></use></svg></button></div>`;
        c.appendChild(d); c.scrollTop = c.scrollHeight;
    },

    /* --- GERAL --- */
    speakText(text) { if (!text || this.state.isListening) return; window.speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(text); u.lang='pt-BR'; u.rate=1.1; window.speechSynthesis.speak(u); },
    announce(msg) { this.showToast(msg); },
    showToast(msg, err=false) { const t = document.getElementById('nv-toast'); t.textContent=msg; t.style.borderLeft=err?'4px solid #f44':'4px solid var(--primary)'; t.classList.add('show'); setTimeout(()=>t.classList.remove('show'),3000); this.speakText(msg); },
    
    // CORREÇÃO VISUAL: CICLOS SOLARES
    setMode(m) { 
        this.state.solarMode=m; 
        document.body.classList.remove('mode-day', 'mode-sunset', 'mode-night');
        document.body.classList.add(`mode-${m}`); 
        this.updateUI(); 
        localStorage.setItem(STORAGE.SOLAR_MODE, m); 
        if (window.KBLX_SAVE) window.KBLX_SAVE(); /* v14: mantém kobllux:ui.mode em sincronia */
    },
    cycleSolar() { const n = this.state.solarMode==='day'?'sunset':(this.state.solarMode==='sunset'?'night':'day'); this.state.isAutoSolar=false; this.setMode(n); },
    enableAutoSolar() { this.state.isAutoSolar=true; this.autoByTime(); this.announce("Auto Solar"); },
    autoByTime() { const h=new Date().getHours(); this.setMode((h>=6&&h<17)?'day':(h>=17&&h<19)?'sunset':'night'); },
    updateUI() { 
        document.getElementById('statusSolarMode').textContent = `${this.state.solarMode.toUpperCase()} ${this.state.isAutoSolar ? '(AUTO)' : '(MAN)'}`; 
        document.getElementById('usernameDisplay').textContent = document.getElementById('inputUserId').value; 
    },
    toggleField(f,s) { this.state.open = f!==undefined?f:!this.state.open; document.getElementById('chat-container').classList.toggle('collapsed', !this.state.open); document.body.classList.toggle('field-closed', !this.state.open); if(!s) this.speakText(getRandomText(FOOTER_TEXTS[this.state.open?'open':'closed']['ritual'])); },
    
    // CORREÇÃO CRISTALIZAÇÃO (DECK)
    async crystallizeSession() {
        if(this.state.messages.length === 0) { this.announce("Vazio não cristaliza."); return; }
        const title = this.state.messages.find(m => m.role === 'user')?.content.substring(0, 30) || "Memória Sem Nome";
        await this.indexedDB.saveDeckItem({ id: Date.now(), date: new Date().toLocaleString(), title: title + "...", data: [...this.state.messages] });
        await this.renderDeck(); // Força render
        this.announce("Memória Salva.");
        if(!document.getElementById('drawerDeck').classList.contains('open')) toggleDrawer('drawerDeck');
    },
    
    async renderDeck() {
        const items = await this.indexedDB.getDeck();
        const container = document.getElementById('deckList');
        if(!items || items.length === 0) {
            container.innerHTML = '<div style="text-align:center;color:var(--text-muted);margin-top:20px">O vazio reina aqui.<br>Use o botão 💎 para salvar.</div>';
            return;
        }
        container.innerHTML = items.sort((a,b) => b.id - a.id).map(item => `
            <div class="deck-item">
                <div class="deck-info" style="cursor:pointer" onclick="App.restoreMemory(${item.id})">
                    <h4>${item.title}</h4>
                    <span>${item.date} • ${item.data.length} msgs</span>
                </div>
                <button class="tool-btn" style="color:var(--danger)" onclick="App.deleteMemory(${item.id})"><svg><use href="#icon-trash"></use></svg></button>
            </div>
        `).join('');
    },
    
    async restoreMemory(id) {
        const items = await this.indexedDB.getDeck();
        const item = items.find(i => i.id === id);
        if(item) {
            document.getElementById('chat-container').innerHTML = ''; // Limpa tela
            this.state.messages = []; // Limpa estado
            item.data.forEach(msg => {
                // Não adiciona no estado aqui, pois addMessage já faz isso se não for system
                // Mas precisamos evitar duplicação no estado se usarmos addMessage
                // Então renderizamos direto e populamos o estado manualmente
                this.addMessage(msg.role === 'assistant' ? 'ai' : 'user', msg.content);
            });
            // Ajuste fino para não duplicar estado (o addMessage já popula)
            // Apenas removemos as últimas duplicatas geradas pelo loop acima se necessário
            // (Mas como limpamos this.state.messages antes, está OK).
            
            toggleDrawer('drawerDeck');
            this.announce("Memória restaurada.");
        }
    },
    
    async deleteMemory(id) {
        if(confirm("Fragmentar cristal?")) {
            await this.indexedDB.deleteDeckItem(id);
            this.renderDeck();
        }
    },

    bindEvents() {
        document.getElementById('btnSend').onclick=()=>this.handleSend();
        document.getElementById('userInput').onkeypress=(e)=>{if(e.key==='Enter')this.handleSend()};
        document.getElementById('field-toggle-handle').onclick=()=>this.toggleField();
        document.getElementById('orbToggle').onclick=()=>{toggleDrawer('drawerProfile');this.speakText("Cockpit");};
        
        // EVENTOS CORRIGIDOS
        document.getElementById('btnCrystallize').onclick = () => this.crystallizeSession();
        document.getElementById('btnCycleSolar').onclick = () => this.cycleSolar();
        document.getElementById('btnAutoSolar').onclick = () => this.enableAutoSolar();
        
        document.getElementById('inputUserId').onchange=(e)=>{localStorage.setItem(STORAGE.USER_ID,e.target.value);this.updateUI();};
        document.getElementById('btnSaveConfig').onclick=()=>{localStorage.setItem(STORAGE.API_KEY,document.getElementById('apiKeyInput').value);localStorage.setItem(STORAGE.SYSTEM_ROLE,document.getElementById('systemRoleInput').value);this.indexedDB.saveCustomCSS(document.getElementById('customCssInput').value);toggleDrawer('drawerSettings');this.announce("Salvo");};
        document.getElementById('bgUploadInput').onchange=(e)=>{ if (typeof window.di_getBgImages !== 'function') this.indexedDB.handleBackgroundUpload(e.target.files[0]); }; /* v14: cockpit + galeria já cobrem o upload; IndexedDB só como fallback se nenhum dos dois carregou */
        document.getElementById('btnSettings').onclick=()=>toggleDrawer('drawerSettings');
        document.getElementById('btnDeck').onclick=()=>{ toggleDrawer('drawerDeck'); this.renderDeck(); }; // Garante render ao abrir
        document.getElementById('btnClearCss').onclick=()=>this.indexedDB.clearAsset(STORAGE.CUSTOM_CSS);
        document.getElementById('btnVoice').onclick=()=>this.toggleVoice();
        this.setupFileUpload();
    },

    indexedDB: {
        async getDB() { return new Promise((r,j)=>{const q=indexedDB.open("InfodoseDB",2);q.onupgradeneeded=e=>{const d=e.target.result;if(!d.objectStoreNames.contains('assets'))d.createObjectStore('assets',{keyPath:'id'});if(!d.objectStoreNames.contains('deck'))d.createObjectStore('deck',{keyPath:'id'});};q.onsuccess=e=>r(e.target.result);q.onerror=j;}); },
        async putAsset(i,d){(await this.getDB()).transaction(['assets'],'readwrite').objectStore('assets').put({id:i,...d});},
        async getAsset(i){return new Promise(async r=>(await this.getDB()).transaction(['assets']).objectStore('assets').get(i).onsuccess=e=>r(e.target.result));},
        async clearAsset(i){(await this.getDB()).transaction(['assets'],'readwrite').objectStore('assets').delete(i); if(i===STORAGE.CUSTOM_CSS)document.getElementById('custom-styles').textContent=''; if(i===STORAGE.BG_IMAGE)document.getElementById('bg-fake-custom').style.backgroundImage='';},
        async handleBackgroundUpload(f){if(!f)return;await this.putAsset(STORAGE.BG_IMAGE,{blob:f});this.loadBackground();},
        async loadBackground(){const d=await this.getAsset(STORAGE.BG_IMAGE);if(d?.blob)document.getElementById('bg-fake-custom').style.backgroundImage=`url('${URL.createObjectURL(d.blob)}')`;},
        async saveCustomCSS(c){await this.putAsset(STORAGE.CUSTOM_CSS,{css:c});this.loadCustomCSS();},
        async loadCustomCSS(){const d=await this.getAsset(STORAGE.CUSTOM_CSS);if(d?.css){document.getElementById('custom-styles').textContent=d.css;document.getElementById('customCssInput').value=d.css;}},
        async saveDeckItem(i){(await this.getDB()).transaction(['deck'],'readwrite').objectStore('deck').put(i);},
        async getDeck(){return new Promise(async r=>(await this.getDB()).transaction(['deck']).objectStore('deck').getAll().onsuccess=e=>r(e.target.result));},
        async deleteDeckItem(i){(await this.getDB()).transaction(['deck'],'readwrite').objectStore('deck').delete(i);}
    }
};

function toggleDrawer(id) { document.getElementById(id).classList.toggle('open'); }
window.onload = () => App.init();

/* ===== source-https-kodux78k-github-io-oidual-kxt-di-oi-js-modules-bgpanel-js.js ===== */
/* SOURCE: https://kodux78k.github.io/oiDual-KxT-di_oi/js/modules/bgPanel.js */


(function(){
  if (window.diBgOverrideInitialized) return;
  window.diBgOverrideInitialized = true;

  // ===== Helpers de storage
  window.di_getBgImages = function(){
    try {
      const raw = localStorage.getItem('di_bgImages');
      if (!raw) return [];
      return JSON.parse(raw);
    } catch(e){ console.warn('di_getBgImages parse error', e); return []; }
  };

  window.di_saveBgImages = function(list){
    try {
      localStorage.setItem('di_bgImages', JSON.stringify(list || []));
    } catch(e){ console.warn('di_saveBgImages', e); }
  };

  // Migração simples: di_bgImage (single) -> di_bgImages (array)
  (function migrateSingleBg(){
    try {
      const single = localStorage.getItem('di_bgImage');
      const arr = di_getBgImages();
      if (single && (!arr || arr.length === 0)) {
        const id = 'bg_' + Date.now();
        di_saveBgImages([ { id, name: 'migrated-bg', data: single, active: true } ]);
      }
    } catch(e){}
  })();

  // ===== Aplicar background visual
  // FIX v14: antes esta função escrevia direto em #bg-fake-custom com
  // opacity/filter fixos (0.12), brigando com o slider de opacidade e o
  // blend-mode do Cockpit (window.__bgState). Agora ela só troca a
  // IMAGEM ativa da galeria e delega opacidade/blend pro __bgApply(),
  // que é a única fonte de verdade daqui pra frente.
  window.di_applyBackground = function(dataUrl){
    if (window.__bgState && window.__bgApply) {
      window.__bgState.image = dataUrl || null;
      window.__bgApply();
      if (window.KBLX_SAVE) window.KBLX_SAVE();
    } else {
      const el = document.getElementById('bg-fake-custom');
      if (!el) return;
      el.style.backgroundImage = dataUrl ? `url("${dataUrl}")` : '';
      el.style.opacity = dataUrl ? '0.12' : '0';
    }
    const s = document.getElementById('bgStatusText');
    if (s) s.textContent = dataUrl ? 'Ativo' : 'Nenhum';
  };

  // ===== Ativar por id
  window.di_setActiveBg = function(id){
    const list = di_getBgImages();
    const next = list.map(b => ({ ...b, active: b.id === id }));
    di_saveBgImages(next);
    const active = next.find(b => b.active);
    if (active) di_applyBackground(active.data);
    di_renderBgPanel();
  };

  // ===== Remover
  window.di_removeBg = function(id){
    let list = di_getBgImages().filter(b => b.id !== id);
    // se remover o ativo, ativa o primeiro restante
    if (!list.some(b => b.active) && list[0]) {
      list[0].active = true;
      di_applyBackground(list[0].data);
    }
    // se vazio, limpa bg
    if (list.length === 0) di_applyBackground(null);
    di_saveBgImages(list);
    di_renderBgPanel();
  };

  // ===== Render thumbnails (melhorado)
  window.di_renderBgPanel = function(){
    const panel = document.getElementById('bgThumbPanel');
    if (!panel) return;
    const list = di_getBgImages();
    panel.innerHTML = '';

    if (list.length === 0) {
      panel.innerHTML = '<div style="grid-column:1/-1;color:var(--text-muted);text-align:center;font-size:0.85rem">Nenhum background salvo. Faça upload.</div>';
      return;
    }

    list.forEach(bg => {
      const wrapper = document.createElement('div');
      wrapper.className = 'di-bg-thumb';
      wrapper.style.position = 'relative';
      wrapper.style.height = '70px';
      wrapper.style.borderRadius = '8px';
      wrapper.style.cursor = 'pointer';
      wrapper.style.backgroundImage = `url("${bg.data}")`;
      wrapper.style.backgroundSize = 'cover';
      wrapper.style.backgroundPosition = 'center';
      wrapper.style.overflow = 'hidden';
      wrapper.style.border = bg.active ? '2px solid var(--primary)' : '1px solid rgba(255,255,255,0.12)';
      wrapper.title = bg.name || bg.id || 'background';

      // overlay dim (sutil)
      const overlay = document.createElement('div');
      overlay.style.position = 'absolute';
      overlay.style.inset = '0';
      overlay.style.background = 'linear-gradient(to top, rgba(0,0,0,0.25), rgba(0,0,0,0))';
      wrapper.appendChild(overlay);

      // botões container
      const btns = document.createElement('div');
      btns.style.position = 'absolute';
      btns.style.right = '6px';
      btns.style.top = '6px';
      btns.style.display = 'flex';
      btns.style.gap = '6px';
      wrapper.appendChild(btns);

      // remover
      const btnRemove = document.createElement('button');
      btnRemove.className = 'di-bg-remove';
      btnRemove.innerText = '✕';
      btnRemove.title = 'Remover';
      btnRemove.style.background = 'rgba(0,0,0,0.6)';
      btnRemove.style.border = 'none';
      btnRemove.style.color = '#fff';
      btnRemove.style.fontSize = '11px';
      btnRemove.style.borderRadius = '6px';
      btnRemove.style.padding = '4px 6px';
      btns.appendChild(btnRemove);

      // aplicar (ícone)
      const btnApply = document.createElement('button');
      btnApply.innerText = '▶';
      btnApply.title = 'Aplicar';
      btnApply.style.background = 'rgba(0,0,0,0.45)';
      btnApply.style.border = 'none';
      btnApply.style.color = '#fff';
      btnApply.style.fontSize = '11px';
      btnApply.style.borderRadius = '6px';
      btnApply.style.padding = '4px 6px';
      btns.appendChild(btnApply);

      // clique no card aplica
      wrapper.addEventListener('click', (e) => {
        // evita conflito se clicar em botão
        if (e.target === btnRemove) return;
        di_setActiveBg(bg.id);
      });

      btnApply.addEventListener('click', (e) => {
        e.stopPropagation();
        di_setActiveBg(bg.id);
      });

      btnRemove.addEventListener('click', (e) => {
        e.stopPropagation();
        if (!confirm('Remover background?')) return;
        di_removeBg(bg.id);
      });

      panel.appendChild(wrapper);
    });
  };

  // ===== Upload handler seguro (evita múltiplos binds)
  function bindUploadInput(){
    const inp = document.getElementById('bgUploadInput');
    if (!inp) return;
    if (inp._diBound) return;
    inp._diBound = true;

    // v14: upload já é tratado por #bgUploadInput no Cockpit (§F), que
    // agora também alimenta a galeria di_bgImages — bind duplicado aqui
    // removido pra não disparar 2 FileReaders/2 applies na mesma escolha
    // de arquivo (era a causa da opacidade "piscando" entre valores).
  }

  // ===== Inicialização segura
  function initOnce(){
    // injeta estilos locais mínimos (se ainda não tiver)
    if (!document.getElementById('di-bg-thumb-styles')) {
      const s = document.createElement('style');
      s.id = 'di-bg-thumb-styles';
      s.innerHTML = `
        #bgThumbPanel .di-bg-thumb{ box-shadow: 0 6px 18px rgba(0,0,0,0.35); transition: transform .15s ease, box-shadow .15s ease; }
        #bgThumbPanel .di-bg-thumb:hover{ transform: translateY(-4px); box-shadow: 0 12px 30px rgba(0,0,0,0.45); }
      `;
      document.head.appendChild(s);
    }

    // v14: aplica o bg ativo da galeria só se o Cockpit ainda não tiver
    // nenhuma imagem salva (migração única kobllux:bg vazio ← di_bgImages
    // ativo). Depois disso quem manda é sempre __bgState/KBLX_LOAD — daí
    // não rodar isso de novo evita a opacidade "voltar" sozinha.
    if (window.__bgState && !window.__bgState.image) {
      const list = di_getBgImages();
      const active = list.find(b => b.active);
      if (active) window.di_applyBackground(active.data);
    }
    di_renderBgPanel();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initOnce);
  } else {
    setTimeout(initOnce, 0);
  }

  // expõe init pra debug
  window.di_initBackgrounds = initOnce;

})();

/* ===== https-infodose-com-br-js-modules-ifsw-base-full-js.js ===== */
(function () {
  'use strict';

  /* ═══════════════════════════════════════════════════════════════
     KXTSK-SHELL / STACKWRAP
     iFSw BASE NEPHESH
     
     Arquitetura:
       SESSION ≠ WINDOW ≠ RUNTIME ≠ TAB

       CREATED
          ↓
       LOADING
          ↓
       ACTIVE
          ↓
       IDLE
          ↓
       SUSPENDED
          ↓
       EVICTED
          ↓
       CLOSED
  ═══════════════════════════════════════════════════════════════ */

  const ROOT = document.documentElement;
  const THEME_KEY = 'dual-theme';

  const stackWrap = document.getElementById('stackWrap');
  const dock = document.getElementById('dock');

  if (!stackWrap) {
    console.warn('[iFSw] #stackWrap não encontrado.');
  }

  /* ─────────────────────────────────────────────────────────────
     CONSTANTES
  ───────────────────────────────────────────────────────────── */

  const SessionState = {
    CREATED:   'created',
    LOADING:   'loading',
    ACTIVE:    'active',
    IDLE:      'idle',
    SUSPENDED: 'suspended',
    EVICTED:   'evicted',
    CLOSED:    'closed'
  };

  const Tier = {
    FREE:    'free',
    PRO:     'pro',
    PREMIUM: 'premium'
  };

  const TIER_LIMITS = {
    [Tier.FREE]: {
      maxActive: 2,
      maxSuspended: 3,
      maxSessions: 5
    },

    [Tier.PRO]: {
      maxActive: 4,
      maxSuspended: 6,
      maxSessions: 12
    },

    [Tier.PREMIUM]: {
      maxActive: 8,
      maxSuspended: 12,
      maxSessions: 30
    }
  };

  const IDLE_AFTER_MS = 45_000;
  const SUSPEND_AFTER_IDLE_MS = 90_000;

  let currentTier = Tier.FREE;
  let counter = 1;

  let activeWindow = null;
  let currentSwitcherWin = null;

  /* ─────────────────────────────────────────────────────────────
     STORES
  ───────────────────────────────────────────────────────────── */

  const timers = new Map();

  /*
    RuntimeStore

    Guarda apenas aquilo que é necessário para reconstruir
    o iframe/runtime.
  */
  const runtimeStore = new Map();

  /*
    SessionMeta

    Estado lógico da sessão.
  */
  const sessionMeta = new Map();

  /*
    TabData

    Estado das abas pertence à WINDOW/SESSION,
    não ao iframe.
  */
  const tabDataMap = new WeakMap();

  /*
    Ordem de suspensão.
    O primeiro é o mais antigo candidato a eviction.
  */
  const suspendedQueue = [];

  /*
    Ordem visual/z-index.
  */
  const zStack = [];

  /* ─────────────────────────────────────────────────────────────
     LIMITES
  ───────────────────────────────────────────────────────────── */

  function currentLimits() {
    return TIER_LIMITS[currentTier] || TIER_LIMITS[Tier.FREE];
  }

  function countByStates(...states) {
    let count = 0;

    sessionMeta.forEach(meta => {
      if (states.includes(meta.state)) count++;
    });

    return count;
  }

  function countSessions() {
    return countByStates(
      SessionState.CREATED,
      SessionState.LOADING,
      SessionState.ACTIVE,
      SessionState.IDLE,
      SessionState.SUSPENDED,
      SessionState.EVICTED
    );
  }

  /* ─────────────────────────────────────────────────────────────
     HELPERS DOM
  ───────────────────────────────────────────────────────────── */

  const $ = (sel, root = document) =>
    root.querySelector(sel);

  const $$ = (sel, root = document) =>
    [...root.querySelectorAll(sel)];

  function getWin(id) {
    return document.getElementById(id);
  }

  function isMaximized(win) {
    return !!win?.classList.contains('maximized');
  }

  function isMinimized(win) {
    return !!win?.classList.contains('minimized');
  }

  function isPinned(win) {
    return win?.dataset.pinned === 'true';
  }

  /* ─────────────────────────────────────────────────────────────
     SESSION META
  ───────────────────────────────────────────────────────────── */

  function ensureSessionMeta(id) {
    let meta = sessionMeta.get(id);

    if (!meta) {
      meta = {
        id,
        state: SessionState.CREATED,
        createdAt: Date.now(),
        lastActive: Date.now(),

        /*
          Proteções
        */
        pinned: false,
        hasUnsavedWork: false,
        mediaPlaying: false,

        /*
          Estatísticas
        */
        suspendCount: 0,
        restoreCount: 0,
        lastSuspendedAt: null,
        lastRestoredAt: null
      };

      sessionMeta.set(id, meta);
    }

    return meta;
  }

  function setSessionState(id, state, extra = {}) {
    const win = getWin(id);
    const meta = ensureSessionMeta(id);

    meta.state = state;

    Object.assign(meta, extra);

    if (
      state === SessionState.ACTIVE ||
      state === SessionState.LOADING
    ) {
      meta.lastActive = Date.now();
    }

    if (state === SessionState.SUSPENDED) {
      meta.lastSuspendedAt = Date.now();
      meta.suspendCount++;
    }

    if (state === SessionState.CLOSED) {
      sessionMeta.delete(id);
    }

    if (win) {
      win.dataset.state = state;

      win.classList.remove(
        'state-created',
        'state-loading',
        'state-active',
        'state-idle',
        'state-suspended',
        'state-evicted',
        'state-closed'
      );

      win.classList.add('state-' + state);

      win.dataset.suspended =
        state === SessionState.SUSPENDED ||
        state === SessionState.EVICTED
          ? 'true'
          : 'false';
    }

    window.dispatchEvent(
      new CustomEvent('session:state-change', {
        detail: {
          id,
          state,
          meta: { ...meta }
        }
      })
    );

    updateStateBadge(win);
  }

  function getSessionState(id) {
    return sessionMeta.get(id)?.state || null;
  }

  function touchSession(id) {
    const meta = sessionMeta.get(id);
    if (!meta) return;

    meta.lastActive = Date.now();

    if (meta.state === SessionState.IDLE) {
      setSessionState(id, SessionState.ACTIVE);
    }
  }

  /* ─────────────────────────────────────────────────────────────
     POLÍTICA DE LIFECYCLE
  ───────────────────────────────────────────────────────────── */

  const LifecyclePolicy = {

    canSuspend(id) {
      const win = getWin(id);
      const meta = sessionMeta.get(id);

      if (!win || !meta) return false;

      if (
        meta.state !== SessionState.ACTIVE &&
        meta.state !== SessionState.IDLE
      ) {
        return false;
      }

      if (isMaximized(win)) return false;
      if (isPinned(win) || meta.pinned) return false;

      /*
        Não suspendemos algo que ainda está carregando.
      */
      if (meta.state === SessionState.LOADING) return false;

      return true;
    },

    canEvict(id) {
      const win = getWin(id);
      const meta = sessionMeta.get(id);

      if (!meta) return false;

      if (meta.state !== SessionState.SUSPENDED) {
        return false;
      }

      if (win) {
        if (isMaximized(win)) return false;
        if (isPinned(win)) return false;
      }

      if (meta.pinned) return false;

      /*
        Se o app marcou trabalho não salvo,
        não fazemos eviction automático.
      */
      if (meta.hasUnsavedWork) return false;

      return true;
    },

    canRestore(id) {
      const meta = sessionMeta.get(id);

      if (!meta) return false;

      return (
        meta.state === SessionState.SUSPENDED ||
        meta.state === SessionState.EVICTED
      );
    }
  };

  /* ─────────────────────────────────────────────────────────────
     CANDIDATO DE SUSPENSÃO
  ───────────────────────────────────────────────────────────── */

  function leastRecentlyActiveSession(excludeId = null) {

    let candidate = null;
    let oldest = Infinity;

    sessionMeta.forEach((meta, id) => {

      if (id === excludeId) return;

      const win = getWin(id);

      if (!win) return;

      if (!LifecyclePolicy.canSuspend(id)) {
        return;
      }

      const time = meta.lastActive || 0;

      if (time < oldest) {
        oldest = time;
        candidate = id;
      }
    });

    return candidate;
  }

  /* ─────────────────────────────────────────────────────────────
     CANDIDATO DE EVICTION
  ───────────────────────────────────────────────────────────── */

  function findEvictionCandidate() {

    let candidate = null;
    let bestScore = -Infinity;

    sessionMeta.forEach((meta, id) => {

      const win = getWin(id);

      if (!LifecyclePolicy.canEvict(id)) {
        return;
      }

      /*
        Quanto maior o score,
        mais fácil de eliminar.
      */
      let score = 0;

      const now = Date.now();

      const age =
        now - (meta.lastActive || meta.lastSuspendedAt || now);

      /*
        Antiguidade pesa bastante.
      */
      score += age;

      /*
        Favoritos recebem proteção.
      */
      const data = win ? tabDataMap.get(win) : null;

      if (data) {
        const hasFavorite = data.tabs.some(tab => tab.fav);

        if (hasFavorite) {
          score -= 10_000_000_000;
        }
      }

      /*
        Mídia ativa é protegida.
      */
      if (meta.mediaPlaying) {
        score -= 20_000_000_000;
      }

      /*
        Trabalho não salvo é fortemente protegido.
      */
      if (meta.hasUnsavedWork) {
        score -= 50_000_000_000;
      }

      /*
        Quanto maior o score,
        mais candidato à eliminação.
      */
      if (score > bestScore) {
        bestScore = score;
        candidate = id;
      }
    });

    return candidate;
  }

  /* ─────────────────────────────────────────────────────────────
     ACTIVE BUDGET
  ───────────────────────────────────────────────────────────── */

  function enforceActiveBudget(excludeId = null) {

    const limit = currentLimits().maxActive;

    let guard = 0;

    while (
      countByStates(
        SessionState.ACTIVE,
        SessionState.LOADING,
        SessionState.IDLE
      ) > limit &&
      guard++ < 100
    ) {

      const victim =
        leastRecentlyActiveSession(excludeId);

      if (!victim) break;

      suspendSession(victim);
    }
  }

  /* ─────────────────────────────────────────────────────────────
     SUSPENDED BUDGET
  ───────────────────────────────────────────────────────────── */

  function enforceSuspendedBudget() {

    const limit = currentLimits().maxSuspended;

    let guard = 0;

    while (
      countByStates(SessionState.SUSPENDED) > limit &&
      guard++ < 100
    ) {

      const victim = findEvictionCandidate();

      if (!victim) break;

      evictSession(victim);
    }

    /*
      Limpa referências antigas da fila.
    */
    for (let i = suspendedQueue.length - 1; i >= 0; i--) {

      const id = suspendedQueue[i];

      const state = sessionMeta.get(id)?.state;

      if (state !== SessionState.SUSPENDED) {
        suspendedQueue.splice(i, 1);
      }
    }
  }

  /* ─────────────────────────────────────────────────────────────
     TOTAL SESSION BUDGET
  ───────────────────────────────────────────────────────────── */

  function enforceSessionBudget() {

    const limit = currentLimits().maxSessions;

    let guard = 0;

    while (countSessions() > limit && guard++ < 100) {

      const victim = findEvictionCandidate();

      if (!victim) break;

      evictSession(victim);
    }
  }

  /* ─────────────────────────────────────────────────────────────
     TIER
  ───────────────────────────────────────────────────────────── */

  function setTier(tier) {

    if (!TIER_LIMITS[tier]) return;

    currentTier = tier;

    enforceActiveBudget();
    enforceSuspendedBudget();
    enforceSessionBudget();

    window.dispatchEvent(
      new CustomEvent('session:tier-change', {
        detail: {
          tier,
          limits: currentLimits()
        }
      })
    );
  }

  /* ─────────────────────────────────────────────────────────────
     AUTOMATIC LIFECYCLE LOOP
  ───────────────────────────────────────────────────────────── */

  setInterval(() => {

    const now = Date.now();

    sessionMeta.forEach((meta, id) => {

      const win = getWin(id);

      if (!win) return;

      /*
        Nunca deixa uma janela maximizada
        virar idle/suspended.
      */
      if (isMaximized(win)) {

        if (meta.state !== SessionState.ACTIVE) {
          setSessionState(id, SessionState.ACTIVE);
        }

        touchSession(id);

        return;
      }

      /*
        ACTIVE → IDLE
      */
      if (
        meta.state === SessionState.ACTIVE &&
        now - (meta.lastActive || 0) >
          IDLE_AFTER_MS
      ) {

        setSessionState(
          id,
          SessionState.IDLE
        );

        return;
      }

      /*
        IDLE → SUSPENDED
      */
      if (
        meta.state === SessionState.IDLE &&
        now - (meta.lastActive || 0) >
          SUSPEND_AFTER_IDLE_MS
      ) {

        if (LifecyclePolicy.canSuspend(id)) {
          suspendSession(id);
        }
      }

    });

    enforceActiveBudget();
    enforceSuspendedBudget();

  }, 10_000);

  /* ─────────────────────────────────────────────────────────────
     SNAPSHOT
  ───────────────────────────────────────────────────────────── */

  function createRuntimeSnapshot(win) {

    if (!win) return null;

    const frame = win.querySelector('.win-frame');

    if (!frame) {
      return runtimeStore.get(win.id) || null;
    }

    const activeTab = getActiveTab(win);

    let snapshotHTML = null;

    /*
      DOM snapshot é apenas fallback.
      O estado real da aplicação deve,
      idealmente, ser fornecido pelo próprio app.
    */
    try {

      const doc = frame.contentDocument;

      if (doc?.documentElement) {
        snapshotHTML =
          doc.documentElement.outerHTML;
      }

    } catch (_) {}

    let scrollX = 0;
    let scrollY = 0;

    try {

      const doc = frame.contentDocument;

      if (doc?.defaultView) {
        scrollX = doc.defaultView.scrollX || 0;
        scrollY = doc.defaultView.scrollY || 0;
      }

    } catch (_) {}

    const snapshot = {

      url:
        activeTab?.url ||
        frame.src ||
        'about:blank',

      title:
        activeTab?.title ||
        win.querySelector('.win-title')?.textContent ||
        'Nova Aba',

      html: snapshotHTML,

      scrollX,
      scrollY,

      timestamp: Date.now(),

      tabId:
        activeTab?.id || null

    };

    return snapshot;
  }

  /* ─────────────────────────────────────────────────────────────
     APP SNAPSHOT VIA POSTMESSAGE
  ───────────────────────────────────────────────────────────── */

  function requestAppSnapshot(win) {

    const frame = win?.querySelector('.win-frame');

    if (!frame?.contentWindow) {
      return Promise.resolve(null);
    }

    return new Promise(resolve => {

      let done = false;

      const finish = data => {

        if (done) return;

        done = true;

        window.removeEventListener(
          'message',
          listener
        );

        resolve(data || null);
      };

      const listener = e => {

        if (e.source !== frame.contentWindow) {
          return;
        }

        if (
          e.data?.type ===
          'DUAL_SESSION_STATE'
        ) {

          finish(e.data.state);
        }
      };

      window.addEventListener(
        'message',
        listener
      );

      try {

        frame.contentWindow.postMessage(
          {
            type: 'DUAL_SESSION_SAVE'
          },
          '*'
        );

      } catch (_) {
        finish(null);
        return;
      }

      /*
        Apps que não implementam
        o protocolo não ficam esperando.
      */
      setTimeout(() => finish(null), 350);
    });
  }

  /* ─────────────────────────────────────────────────────────────
     SUSPEND
  ───────────────────────────────────────────────────────────── */

  async function suspendSession(id) {

    const win = getWin(id);

    if (!win) return false;

    if (!LifecyclePolicy.canSuspend(id)) {
      return false;
    }

    const meta = ensureSessionMeta(id);

    /*
      Não suspende duas vezes.
    */
    if (meta.state === SessionState.SUSPENDED) {
      return true;
    }

    const frame =
      win.querySelector('.win-frame');

    /*
      Tenta primeiro obter estado
      semântico da aplicação.
    */
    let appState = null;

    try {
      appState =
        await requestAppSnapshot(win);
    } catch (_) {
      appState = null;
    }

    /*
      Snapshot estrutural de fallback.
    */
    const snapshot =
      createRuntimeSnapshot(win);

    if (!snapshot && !appState) {
      return false;
    }

    runtimeStore.set(id, {
      snapshot,
      appState,
      url:
        snapshot?.url ||
        frame?.src ||
        'https://www.infodose.com.br/splash',

      savedAt: Date.now()
    });

    /*
      Agora sim soltamos o runtime.
    */
    if (frame) {
      frame.remove();
    }

    win.classList.add('suspended');

    setSessionState(
      id,
      SessionState.SUSPENDED
    );

    /*
      Fila de suspensão.
    */
    const index =
      suspendedQueue.indexOf(id);

    if (index !== -1) {
      suspendedQueue.splice(index, 1);
    }

    suspendedQueue.push(id);

    enforceSuspendedBudget();

    syncShell();

    return true;
  }

  /* ─────────────────────────────────────────────────────────────
     RESTORE
  ───────────────────────────────────────────────────────────── */

  function restoreSession(id) {

    const win = getWin(id);

    if (!win) return false;

    const meta = sessionMeta.get(id);

    if (!meta) return false;

    if (
      meta.state !== SessionState.SUSPENDED &&
      meta.state !== SessionState.EVICTED
    ) {
      return true;
    }

    /*
      Respeita limite ativo.
    */
    enforceActiveBudget(id);

    const runtime =
      runtimeStore.get(id);

    const data =
      tabDataMap.get(win);

    const activeTab =
      getActiveTab(win);

    setSessionState(
      id,
      SessionState.LOADING
    );

    const frame =
      document.createElement('iframe');

    frame.className = 'win-frame';

    frame.dataset.runtime = 'nav';

    frame.setAttribute(
      'allow',
      'autoplay; fullscreen; clipboard-read; clipboard-write'
    );

    /*
      Primeiro tentamos restaurar
      a URL real da aba.
    */
    const url =
      runtime?.url ||
      activeTab?.url ||
      'https://www.infodose.com.br/splash';

    /*
      Snapshot HTML só é usado quando
      temos certeza que ele pertence
      ao runtime atual.
    */
    if (runtime?.snapshot?.html) {

      try {

        frame.srcdoc =
          runtime.snapshot.html;

      } catch (_) {

        frame.src = url;
      }

    } else {

      frame.src = url;
    }

    frame.addEventListener(
      'load',
      () => {

        /*
          Restaura scroll quando possível.
        */
        try {

          const snapshot =
            runtime?.snapshot;

          if (
            snapshot &&
            frame.contentWindow
          ) {

            frame.contentWindow.scrollTo(
              snapshot.scrollX || 0,
              snapshot.scrollY || 0
            );

          }

        } catch (_) {}

        /*
          Reinjeta estado semântico
          fornecido pelo app.
        */
        if (
          runtime?.appState &&
          frame.contentWindow
        ) {

          try {

            frame.contentWindow.postMessage(
              {
                type:
                  'DUAL_SESSION_RESTORE',

                state:
                  runtime.appState
              },
              '*'
            );

          } catch (_) {}
        }

        const meta =
          sessionMeta.get(id);

        if (meta) {
          meta.lastRestoredAt =
            Date.now();

          meta.restoreCount++;
        }

        setSessionState(
          id,
          SessionState.ACTIVE
        );

        win.classList.remove(
          'suspended'
        );

        win.dataset.suspended =
          'false';

        syncGlobalHeader();

      },
      { once: true }
    );

    win.appendChild(frame);

    runtimeStore.delete(id);

    const queueIndex =
      suspendedQueue.indexOf(id);

    if (queueIndex !== -1) {
      suspendedQueue.splice(
        queueIndex,
        1
      );
    }

    win.classList.remove(
      'suspended'
    );

    win.dataset.suspended =
      'false';

    /*
      Reativa wiring do iframe.
    */
    wireFrame(win, frame);

    syncShell();

    return true;
  }

  /* ─────────────────────────────────────────────────────────────
     EVICT
  ───────────────────────────────────────────────────────────── */

  function evictSession(id) {

    const win = getWin(id);

    const meta =
      sessionMeta.get(id);

    if (!meta) return false;

    if (!LifecyclePolicy.canEvict(id)) {
      return false;
    }

    /*
      Runtime já deveria estar solto.
    */
    const frame =
      win?.querySelector('.win-frame');

    frame?.remove();

    /*
      Mantém a janela e as abas.
      Só marca o runtime como evicted.
    */
    setSessionState(
      id,
      SessionState.EVICTED
    );

    const index =
      suspendedQueue.indexOf(id);

    if (index !== -1) {
      suspendedQueue.splice(
        index,
        1
      );
    }

    /*
      Não destruímos automaticamente
      a metadata das abas.
    */

    window.dispatchEvent(
      new CustomEvent(
        'session:evicted',
        {
          detail: { id }
        }
      )
    );

    syncShell();

    return true;
  }

  /* ─────────────────────────────────────────────────────────────
     DESTROY / CLOSE
  ───────────────────────────────────────────────────────────── */

  function destroySession(id) {

    const win = getWin(id);

    setSessionState(
      id,
      SessionState.CLOSED
    );

    document
      .getElementById('dock-' + id)
      ?.remove();

    win?.remove();

    runtimeStore.delete(id);

    const index =
      suspendedQueue.indexOf(id);

    if (index !== -1) {
      suspendedQueue.splice(
        index,
        1
      );
    }

    /*
      WeakMap não precisa de delete manual,
      mas mantemos compatibilidade se
      a implementação mudar futuramente.
    */

    timers.delete(id);

    if (activeWindow === win) {
      setActiveWindow(null);
    }

    syncShell();
  }

  /* ─────────────────────────────────────────────────────────────
     Z-STACK
  ───────────────────────────────────────────────────────────── */

  function bringToFront(win) {

    if (!win) return;

    const index =
      zStack.indexOf(win);

    if (index !== -1) {
      zStack.splice(index, 1);
    }

    zStack.push(win);

    zStack.forEach((item, i) => {

      if (
        !item.classList.contains(
          'maximized'
        )
      ) {

        item.style.zIndex =
          String(1000 + i * 10);
      }

    });

    setActiveWindow(win);

    touchSession(win.id);
  }

  function setActiveWindow(win) {

    if (activeWindow === win) {
      syncGlobalHeader();
      return;
    }

    activeWindow = win;

    if (win) {
      touchSession(win.id);
    }

    syncGlobalHeader();
  }

  /* ─────────────────────────────────────────────────────────────
     GLOBAL HEADER
  ───────────────────────────────────────────────────────────── */

  function syncGlobalHeader() {

    const urlInput =
      document.getElementById(
        'urlInputNav'
      );

    if (!urlInput) return;

    if (!activeWindow) {
      urlInput.value = '';
      return;
    }

    const data =
      tabDataMap.get(activeWindow);

    if (!data) {
      urlInput.value = '';
      return;
    }

    const activeTab =
      data.tabs.find(
        t => t.id === data.activeId
      );

    urlInput.value =
      activeTab?.url || '';
  }

  /* ─────────────────────────────────────────────────────────────
     TABS
  ───────────────────────────────────────────────────────────── */

  function getTabData(win) {

    if (!tabDataMap.has(win)) {

      const initialUrl =
        win.querySelector(
          '.win-frame'
        )?.src ||
        'https://www.infodose.com.br/splash';

      const tabs = [
        {
          id:
            'tab-' +
            Date.now(),

          url: initialUrl,

          title: 'Nova Aba',

          fav: false,

          favicon: '◉'
        }
      ];

      tabDataMap.set(win, {
        tabs,
        activeId: tabs[0].id
      });
    }

    return tabDataMap.get(win);
  }

  function saveTabs(win) {

    const data =
      tabDataMap.get(win);

    if (!data) return;

    try {

      localStorage.setItem(
        'dual_tabs_' + win.id,
        JSON.stringify(data)
      );

    } catch (_) {}
  }

  function loadTabs(win) {

    try {

      const raw =
        localStorage.getItem(
          'dual_tabs_' + win.id
        );

      if (!raw) return false;

      const data =
        JSON.parse(raw);

      if (
        data &&
        Array.isArray(data.tabs) &&
        data.tabs.length
      ) {

        tabDataMap.set(
          win,
          data
        );

        return true;
      }

    } catch (_) {}

    return false;
  }

  function getActiveTab(win) {

    const data =
      tabDataMap.get(win);

    if (!data) return null;

    return (
      data.tabs.find(
        t => t.id === data.activeId
      ) ||
      data.tabs[0] ||
      null
    );
  }

  function setActiveTab(
    win,
    tabId
  ) {

    const data =
      tabDataMap.get(win);

    if (!data) return;

    const exists =
      data.tabs.some(
        t => t.id === tabId
      );

    if (!exists) return;

    /*
      Se a sessão está suspensa,
      restaura antes de ativar.
    */
    const state =
      getSessionState(win.id);

    if (
      state === SessionState.SUSPENDED ||
      state === SessionState.EVICTED
    ) {
      restoreSession(win.id);
    }

    data.activeId = tabId;

    saveTabs(win);

    renderTabCounter(win);

    syncGlobalHeader();

    const frame =
      win.querySelector(
        '.win-frame'
      );

    const tab =
      getActiveTab(win);

    if (frame && tab) {
      frame.src =
        tab.url ||
        'about:blank';
    }

    bringToFront(win);
  }

  function addTab(
    win,
    url = ''
  ) {

    if (!win) return;

    const data =
      getTabData(win);

    const newTab = {

      id:
        'tab-' +
        Date.now() +
        '-' +
        Math.random()
          .toString(36)
          .slice(2, 7),

      url:
        url ||
        'https://www.infodose.com.br/splash',

      title:
        url
          ? url
              .replace(
                /^https?:\/\//,
                ''
              )
              .split('/')[0]
          : 'Nova Aba',

      fav: false,

      favicon: '◉'
    };

    data.tabs.push(newTab);

    data.activeId =
      newTab.id;

    saveTabs(win);

    renderTabCounter(win);

    const state =
      getSessionState(win.id);

    if (
      state === SessionState.SUSPENDED ||
      state === SessionState.EVICTED
    ) {
      restoreSession(win.id);
    }

    const frame =
      win.querySelector(
        '.win-frame'
      );

    if (frame) {
      frame.src =
        newTab.url;
    }

    syncGlobalHeader();

    closeTabSwitcher();

    bringToFront(win);
  }

  function removeTab(
    win,
    tabId
  ) {

    const data =
      tabDataMap.get(win);

    if (
      !data ||
      data.tabs.length <= 1
    ) {
      return;
    }

    const index =
      data.tabs.findIndex(
        t => t.id === tabId
      );

    if (index === -1) return;

    data.tabs.splice(
      index,
      1
    );

    if (
      data.activeId === tabId
    ) {

      data.activeId =
        data.tabs[
          Math.min(
            index,
            data.tabs.length - 1
          )
        ].id;
    }

    saveTabs(win);

    renderTabCounter(win);

    const frame =
      win.querySelector(
        '.win-frame'
      );

    const active =
      getActiveTab(win);

    if (frame && active) {
      frame.src =
        active.url;
    }

    syncGlobalHeader();

    if (
      document
        .getElementById(
          'tabSwitcherOverlay'
        )
        ?.classList.contains('open')
    ) {
      renderTabSwitcher(win);
    }
  }

  function updateTabUrl(
    win,
    tabId,
    newUrl
  ) {

    const data =
      tabDataMap.get(win);

    if (!data) return;

    const tab =
      data.tabs.find(
        t => t.id === tabId
      );

    if (!tab) return;

    tab.url = newUrl;

    tab.title =
      newUrl
        .replace(
          /^https?:\/\//,
          ''
        )
        .split('/')[0] ||
      'Nova Aba';

    saveTabs(win);

    syncGlobalHeader();

    if (
      data.activeId === tabId
    ) {

      const frame =
        win.querySelector(
          '.win-frame'
        );

      if (frame) {
        frame.src =
          newUrl;
      }
    }

    if (
      document
        .getElementById(
          'tabSwitcherOverlay'
        )
        ?.classList.contains('open')
    ) {

      renderTabSwitcher(win);
    }
  }

  function toggleFav(
    win,
    tabId
  ) {

    const data =
      tabDataMap.get(win);

    if (!data) return;

    const tab =
      data.tabs.find(
        t => t.id === tabId
      );

    if (!tab) return;

    tab.fav = !tab.fav;

    saveTabs(win);

    if (
      document
        .getElementById(
          'tabSwitcherOverlay'
        )
        ?.classList.contains('open')
    ) {

      renderTabSwitcher(win);
    }
  }

  function renderTabCounter(win) {

    const data =
      tabDataMap.get(win);

    if (!data) return;

    const btn =
      win.querySelector(
        '.tab-counter'
      );

    if (btn) {
      btn.textContent =
        data.tabs.length;
    }
  }

  /* ─────────────────────────────────────────────────────────────
     TAB SWITCHER
  ───────────────────────────────────────────────────────────── */

  function openTabSwitcher(win) {

    currentSwitcherWin = win;

    const overlay =
      document.getElementById(
        'tabSwitcherOverlay'
      );

    const title =
      document.getElementById(
        'tabSwitcherTitle'
      );

    if (!overlay) return;

    if (title) {

      title.textContent =
        'Abas — ' +
        (
          win.querySelector(
            '.win-title'
          )?.textContent ||
          'janela'
        );
    }

    renderTabSwitcher(win);

    overlay.classList.add(
      'open'
    );

    overlay.onclick =
      function (e) {

        if (e.target === overlay) {
          closeTabSwitcher();
        }

      };
  }

  function closeTabSwitcher() {

    document
      .getElementById(
        'tabSwitcherOverlay'
      )
      ?.classList.remove(
        'open'
      );

    currentSwitcherWin = null;
  }

  function renderTabSwitcher(win) {

    const grid =
      document.getElementById(
        'tabGrid'
      );

    if (!grid) return;

    const data =
      tabDataMap.get(win);

    if (!data) {

      grid.innerHTML = `
        <div class="tab-empty">
          <div class="tab-empty-icon">◌</div>
          <div class="tab-empty-title">
            Nenhuma aba
          </div>
          <div class="tab-empty-text">
            Abra uma nova aba para começar.
          </div>
        </div>
      `;

      return;
    }

    grid.innerHTML = '';

    data.tabs.forEach(tab => {

      const card =
        document.createElement(
          'div'
        );

      card.className =
        'tab-card' +
        (
          tab.id === data.activeId
            ? ' active'
            : ''
        );

      card.dataset.tabId =
        tab.id;

      card.innerHTML = `

        <div class="tab-card-inner">

          <div class="tab-card-main">

            <div class="tab-card-head">

              <div class="tab-favicon">
                ${tab.favicon || '◉'}
              </div>

              <div class="tab-card-info">

                <div class="tab-title">
                  ${escapeHTML(
                    tab.title ||
                    'Nova Aba'
                  )}
                </div>

                <div class="tab-url">
                  ${escapeHTML(
                    tab.url || ''
                  )}
                </div>

              </div>

            </div>

            <div class="tab-status">
              ${
                tab.id === data.activeId
                  ? '<span class="tab-active-dot"></span> Ativa'
                  : ''
              }
            </div>

          </div>

          <div class="tab-card-actions">

            <button
              type="button"
              class="tab-action tab-fav ${
                tab.fav ? 'active' : ''
              }"
              data-tabid="${tab.id}"
              title="${
                tab.fav
                  ? 'Remover favorito'
                  : 'Favoritar aba'
              }"
              aria-label="${
                tab.fav
                  ? 'Remover favorito'
                  : 'Favoritar aba'
              }"
            >
              ${tab.fav ? '★' : '☆'}
            </button>

            <button
              type="button"
              class="tab-action tab-close"
              data-tabid="${tab.id}"
              title="Fechar aba"
              aria-label="Fechar aba"
            >
              ×
            </button>

          </div>

        </div>
      `;

      card.addEventListener(
        'click',
        function (e) {

          if (
            e.target.closest(
              '.tab-close'
            ) ||
            e.target.closest(
              '.tab-fav'
            )
          ) {
            return;
          }

          setActiveTab(
            win,
            tab.id
          );

          closeTabSwitcher();
        }
      );

      card
        .querySelector(
          '.tab-close'
        )
        ?.addEventListener(
          'click',
          function (e) {

            e.preventDefault();
            e.stopPropagation();

            removeTab(
              win,
              tab.id
            );
          }
        );

      card
        .querySelector(
          '.tab-fav'
        )
        ?.addEventListener(
          'click',
          function (e) {

            e.preventDefault();
            e.stopPropagation();

            toggleFav(
              win,
              tab.id
            );
          }
        );

      grid.appendChild(card);
    });
  }

  /* ─────────────────────────────────────────────────────────────
     ESCAPE HTML
  ───────────────────────────────────────────────────────────── */

  function escapeHTML(value) {

    return String(value)
      .replace(
        /&/g,
        '&amp;'
      )
      .replace(
        /</g,
        '&lt;'
      )
      .replace(
        />/g,
        '&gt;'
      )
      .replace(
        /"/g,
        '&quot;'
      )
      .replace(
        /'/g,
        '&#039;'
      );
  }

  /* ─────────────────────────────────────────────────────────────
     WINDOW MODES
  ───────────────────────────────────────────────────────────── */

  function syncShell() {

    const maximized =
      !!document.querySelector(
        '.session-window.maximized:not(.minimized)'
      );

    document.body.classList.toggle(
      'has-maximized',
      maximized
    );

    document.body.classList.toggle(
      'ui-immersive',
      maximized
    );
  }

  function toggleCollapse(id) {

    const win =
      getWin(id);

    if (!win) return;

    if (isMaximized(win)) {

      win.classList.remove(
        'maximized'
      );

      win.style.zIndex = '';

      syncShell();
    }

    win.classList.toggle(
      'collapsed'
    );

    win.classList.remove(
      'peeked'
    );

    /*
      Importante:
      collapse NÃO destrói runtime.

      Se estava suspensa,
      o toque restaura.
    */
    if (
      win.classList.contains(
        'collapsed'
      )
    ) {

      if (
        win.dataset.suspended ===
        'true'
      ) {
        restoreSession(id);
      }
    }

    bringToFront(win);

    syncShell();
  }

  function togglePeek(id) {

    const win =
      getWin(id);

    if (!win) return;

    if (isMaximized(win)) {

      win.classList.remove(
        'maximized'
      );

      win.style.zIndex = '';

      syncShell();
    }

    win.classList.toggle(
      'peeked'
    );

    if (
      win.classList.contains(
        'peeked'
      )
    ) {

      win.classList.remove(
        'collapsed'
      );

      if (
        win.dataset.suspended ===
        'true'
      ) {
        restoreSession(id);
      }
    }

    bringToFront(win);

    syncShell();
  }

  function maximizeWindow(id) {

    const win =
      getWin(id);

    if (!win) return;

    if (isMaximized(win)) {

      win.classList.remove(
        'maximized'
      );

      win.style.zIndex = '';

      if (
        win.dataset.suspended ===
        'true'
      ) {
        restoreSession(id);
      }

      bringToFront(win);

      syncShell();

      return;
    }

    /*
      Maximizar automaticamente restaura.
    */
    if (
      win.dataset.suspended ===
      'true'
    ) {
      restoreSession(id);
    }

    win.classList.remove(
      'collapsed',
      'peeked',
      'minimized',
      'header-hidden',
      'resizing'
    );

    [
      'top',
      'left',
      'right',
      'bottom',
      'width',
      'height',
      'maxWidth',
      'maxHeight'
    ].forEach(
      p => win.style[p] = ''
    );

    win.classList.add(
      'maximized'
    );

    win.style.zIndex =
      '94000';

    bringToFront(win);

    syncShell();
  }

  /* ─────────────────────────────────────────────────────────────
     MINIMIZE
     
     Minimize é visual.
     O lifecycle pode suspender separadamente.
  ───────────────────────────────────────────────────────────── */

  function minimizeWindow(id) {

    const win =
      getWin(id);

    if (!win) return;

    timers.delete(id);

    win.classList.remove(
      'maximized',
      'collapsed',
      'peeked',
      'header-hidden',
      'resizing'
    );

    /*
      Primeiro libera a janela.
    */
    syncShell();

    /*
      Aqui permitimos suspensão,
      mas ela é lifecycle, não minimize.
    */
    if (
      LifecyclePolicy.canSuspend(id)
    ) {
      suspendSession(id);
    }

    win.classList.add(
      'minimized'
    );

    document
      .getElementById(
        'dock-' + id
      )
      ?.remove();

    const bubble =
      document.createElement(
        'button'
      );

    bubble.type =
      'button';

    bubble.className =
      'dock-bubble';

    bubble.id =
      'dock-' + id;

    bubble.title =
      'Restaurar janela';

    bubble.setAttribute(
      'aria-label',
      'Restaurar janela'
    );

    bubble.textContent =
      '۞';

    bubble.addEventListener(
      'click',
      function (e) {

        e.preventDefault();
        e.stopPropagation();

        win.classList.remove(
          'minimized'
        );

        if (
          win.dataset.suspended ===
          'true'
        ) {
          restoreSession(id);
        }

        bringToFront(win);

        requestAnimationFrame(
          () => {

            bringToFront(win);

            syncShell();

          }
        );

        bubble.remove();
      }
    );

    dock?.appendChild(
      bubble
    );

    syncShell();
  }

  function closeWindow(id) {

    destroySession(id);
  }

  /* ─────────────────────────────────────────────────────────────
     HEADER
  ───────────────────────────────────────────────────────────── */

  function handleHeaderClick(
    e,
    id
  ) {

    if (
      e.target.closest(
        '.win-controls'
      ) ||
      e.target.closest(
        'button'
      ) ||
      e.target.closest(
        'input'
      ) ||
      e.target.closest(
        '.win-navrow'
      )
    ) {
      return;
    }

    const win =
      getWin(id);

    if (!win) return;

    /*
      Se a sessão estiver suspensa,
      qualquer interação com o header
      restaura.
    */
    if (
      win.dataset.suspended ===
      'true'
    ) {

      restoreSession(id);

      bringToFront(win);

      return;
    }

    bringToFront(win);

    const old =
      timers.get(id);

    if (old) {

      clearTimeout(old);

      timers.delete(id);

      maximizeWindow(id);

      return;
    }

    const timer =
      setTimeout(
        () => {

          timers.delete(id);

          togglePeek(id);

        },
        250
      );

    timers.set(
      id,
      timer
    );
  }

  /* ─────────────────────────────────────────────────────────────
     RESIZE
  ───────────────────────────────────────────────────────────── */

  function makeResizeHandles(win) {

    if (
      win.dataset.resizeReady ===
      '1'
    ) {
      return;
    }

    win.dataset.resizeReady =
      '1';

    const hy =
      document.createElement(
        'div'
      );

    hy.className =
      'resize-handle resize-y';

    const hx =
      document.createElement(
        'div'
      );

    hx.className =
      'resize-handle resize-x';

    const hc =
      document.createElement(
        'div'
      );

    hc.className =
      'resize-handle resize-corner';

    win.append(
      hy,
      hx,
      hc
    );

    bindResizeY(
      win,
      hy
    );

    bindResizeX(
      win,
      hx
    );

    bindResizeCorner(
      win,
      hc
    );
  }

  function freeFromMaximize(
    win,
    rect
  ) {

    if (isMaximized(win)) {

      win.classList.remove(
        'maximized'
      );

      win.style.position =
        'fixed';

      win.style.left =
        Math.max(
          0,
          rect.left
        ) + 'px';

      win.style.top =
        Math.max(
          0,
          rect.top
        ) + 'px';

      win.style.right =
        'auto';

      win.style.bottom =
        'auto';

      win.style.width =
        Math.min(
          rect.width,
          window.innerWidth
        ) + 'px';

      win.style.height =
        Math.min(
          rect.height,
          window.innerHeight
        ) + 'px';

      win.style.maxWidth =
        'none';

      win.style.maxHeight =
        'none';

      if (
        win.dataset.suspended ===
        'true'
      ) {
        restoreSession(
          win.id
        );
      }
    }

    win.classList.remove(
      'collapsed',
      'peeked'
    );

    win.classList.add(
      'resizing'
    );

    syncShell();
  }

  function finishResize(win) {

    win.classList.remove(
      'resizing'
    );

    syncShell();
  }

  function bindResizeY(
    win,
    handle
  ) {

    let active = false;
    let pointerId = null;
    let startY = 0;
    let startH = 0;

    handle.addEventListener(
      'pointerdown',
      function (e) {

        if (
          e.button != null &&
          e.button !== 0
        ) {
          return;
        }

        const rect =
          win.getBoundingClientRect();

        active = true;

        pointerId =
          e.pointerId;

        startY =
          e.clientY;

        startH =
          rect.height;

        freeFromMaximize(
          win,
          rect
        );

        handle.setPointerCapture
          ?.(
            pointerId
          );

        e.preventDefault();

        const move =
          ev => {

            if (
              !active ||
              ev.pointerId !==
                pointerId
            ) {
              return;
            }

            ev.preventDefault();

            const next =
              Math.max(
                44,
                Math.min(
                  window.innerHeight,
                  startH +
                    (
                      ev.clientY -
                      startY
                    )
                )
              );

            win.style.height =
              next + 'px';
          };

        const up =
          ev => {

            if (
              ev &&
              ev.pointerId !==
                pointerId
            ) {
              return;
            }

            active = false;

            window.removeEventListener(
              'pointermove',
              move
            );

            window.removeEventListener(
              'pointerup',
              up
            );

            window.removeEventListener(
              'pointercancel',
              up
            );

            finishResize(win);
          };

        window.addEventListener(
          'pointermove',
          move,
          {
            passive: false
          }
        );

        window.addEventListener(
          'pointerup',
          up
        );

        window.addEventListener(
          'pointercancel',
          up
        );

      },
      {
        passive: false
      }
    );
  }

  function bindResizeX(
    win,
    handle
  ) {

    let active = false;
    let pointerId = null;
    let startX = 0;
    let startW = 0;

    handle.addEventListener(
      'pointerdown',
      function (e) {

        if (
          e.button != null &&
          e.button !== 0
        ) {
          return;
        }

        const rect =
          win.getBoundingClientRect();

        active = true;

        pointerId =
          e.pointerId;

        startX =
          e.clientX;

        startW =
          rect.width;

        freeFromMaximize(
          win,
          rect
        );

        handle.setPointerCapture
          ?.(
            pointerId
          );

        e.preventDefault();

        const move =
          ev => {

            if (
              !active ||
              ev.pointerId !==
                pointerId
            ) {
              return;
            }

            ev.preventDefault();

            const next =
              Math.max(
                44,
                Math.min(
                  window.innerWidth,
                  startW +
                    (
                      ev.clientX -
                      startX
                    )
                )
              );

            win.style.width =
              next + 'px';
          };

        const up =
          ev => {

            if (
              ev &&
              ev.pointerId !==
                pointerId
            ) {
              return;
            }

            active = false;

            window.removeEventListener(
              'pointermove',
              move
            );

            window.removeEventListener(
              'pointerup',
              up
            );

            window.removeEventListener(
              'pointercancel',
              up
            );

            finishResize(win);
          };

        window.addEventListener(
          'pointermove',
          move,
          {
            passive: false
          }
        );

        window.addEventListener(
          'pointerup',
          up
        );

        window.addEventListener(
          'pointercancel',
          up
        );

      },
      {
        passive: false
      }
    );
  }

  function bindResizeCorner(
    win,
    handle
  ) {

    let active = false;
    let pointerId = null;

    let startX = 0;
    let startY = 0;

    let startW = 0;
    let startH = 0;

    handle.addEventListener(
      'pointerdown',
      function (e) {

        if (
          e.button != null &&
          e.button !== 0
        ) {
          return;
        }

        const rect =
          win.getBoundingClientRect();

        active = true;

        pointerId =
          e.pointerId;

        startX =
          e.clientX;

        startY =
          e.clientY;

        startW =
          rect.width;

        startH =
          rect.height;

        freeFromMaximize(
          win,
          rect
        );

        handle.setPointerCapture
          ?.(
            pointerId
          );

        e.preventDefault();

        const move =
          ev => {

            if (
              !active ||
              ev.pointerId !==
                pointerId
            ) {
              return;
            }

            ev.preventDefault();

            const width =
              Math.max(
                44,
                Math.min(
                  window.innerWidth,
                  startW +
                    (
                      ev.clientX -
                      startX
                    )
                )
              );

            const height =
              Math.max(
                44,
                Math.min(
                  window.innerHeight,
                  startH +
                    (
                      ev.clientY -
                      startY
                    )
                )
              );

            win.style.width =
              width + 'px';

            win.style.height =
              height + 'px';
          };

        const up =
          ev => {

            if (
              ev &&
              ev.pointerId !==
                pointerId
            ) {
              return;
            }

            active = false;

            window.removeEventListener(
              'pointermove',
              move
            );

            window.removeEventListener(
              'pointerup',
              up
            );

            window.removeEventListener(
              'pointercancel',
              up
            );

            finishResize(win);
          };

        window.addEventListener(
          'pointermove',
          move,
          {
            passive: false
          }
        );

        window.addEventListener(
          'pointerup',
          up
        );

        window.addEventListener(
          'pointercancel',
          up
        );

      },
      {
        passive: false
      }
    );
  }

  /* ─────────────────────────────────────────────────────────────
     STATE BADGE
  ───────────────────────────────────────────────────────────── */

  function updateStateBadge(win) {

    if (!win) return;

    const badge =
      win.querySelector(
        '.state-badge'
      );

    if (!badge) return;

    const state =
      win.dataset.state ||
      SessionState.CREATED;

    const colors = {

      active:
        '#39ffb6',

      loading:
        '#00e5ff',

      idle:
        '#ffd700',

      suspended:
        '#ff6b6b',

      evicted:
        '#b36bff',

      created:
        '#aaa',

      closed:
        '#555'
    };

    const labels = {

      active:
        'ATIVO',

      loading:
        'CARREGANDO',

      idle:
        'OCIOSO',

      suspended:
        'SUSPENSO',

      evicted:
        'LIBERADO',

      created:
        'CRIADO',

      closed:
        'FECHADO'
    };

    const color =
      colors[state] ||
      '#aaa';

    badge.textContent =
      '●';

    badge.title =
      labels[state] ||
      state;

    badge.style.color =
      color;

    badge.style.background =
      color + '33';
  }

  /* ─────────────────────────────────────────────────────────────
     FRAME WIRING
  ───────────────────────────────────────────────────────────── */

  function wireFrame(
    win,
    frame
  ) {

    if (!frame) return;

    if (
      frame.dataset.ifsWired ===
      '1'
    ) {
      return;
    }

    frame.dataset.ifsWired =
      '1';

    frame.addEventListener(
      'load',
      function () {

        try {

          const doc =
            this.contentDocument;

          if (
            doc &&
            doc.title
          ) {

            const active =
              getActiveTab(win);

            if (active) {

              active.title =
                doc.title;

              saveTabs(win);
            }
          }

        } catch (_) {}

        try {

          if (this.src) {

            const active =
              getActiveTab(win);

            if (
              active &&
              active.url !==
                this.src
            ) {

              active.url =
                this.src;

              saveTabs(win);
            }

            const input =
              win.querySelector(
                '.win-urlbar'
              );

            if (input) {
              input.value =
                this.src;
            }

            syncGlobalHeader();
          }

        } catch (_) {}

        if (
          getSessionState(win.id) ===
          SessionState.LOADING
        ) {

          setSessionState(
            win.id,
            SessionState.ACTIVE
          );
        }

      }
    );

    frame.addEventListener(
      'pointerdown',
      function () {

        touchSession(
          win.id
        );

        if (
          !win.classList.contains(
            'maximized'
          )
        ) {
          bringToFront(win);
        }

      },
      {
        passive: true
      }
    );

    frame.addEventListener(
      'load',
      function () {

        /*
          Permite que o app informe
          mídia/trabalho não salvo.
        */
        try {

          this.contentWindow?.postMessage(
            {
              type:
                'DUAL_SESSION_CAPABILITIES'
            },
            '*'
          );

        } catch (_) {}
      }
    );
  }

  /* ─────────────────────────────────────────────────────────────
     WIRE SESSION
  ───────────────────────────────────────────────────────────── */

  function wireSession(win) {

    if (
      !win ||
      win.dataset.wired === '1'
    ) {
      return;
    }

    win.dataset.wired =
      '1';

    ensureSessionMeta(
      win.id
    );

    /*
      Qualquer toque acorda sessão.
    */
    win.addEventListener(
      'pointerdown',
      function () {

        if (
          win.dataset.suspended ===
          'true'
        ) {

          restoreSession(
            win.id
          );
        }

        touchSession(
          win.id
        );

      },
      {
        passive: true
      }
    );

    /*
      Tabs.
    */
    if (!loadTabs(win)) {

      const frame =
        win.querySelector(
          '.win-frame'
        );

      const src =
        frame?.src ||
        'https://www.infodose.com.br/splash';

      const tabs = [
        {
          id:
            'tab-' +
            Date.now(),

          url: src,

          title:
            src
              .replace(
                /^https?:\/\//,
                ''
              )
              .split('/')[0] ||
            'Nova Aba',

          fav: false,

          favicon: '◉'
        }
      ];

      tabDataMap.set(
        win,
        {
          tabs,
          activeId:
            tabs[0].id
        }
      );

      saveTabs(win);
    }

    renderTabCounter(win);

    makeResizeHandles(win);

    /*
      Header.
    */
    const header =
      $('.win-hdr', win);

    header?.addEventListener(
      'click',
      e =>
        handleHeaderClick(
          e,
          win.id
        )
    );

    /*
      Controls.
    */
    const controls =
      $('.win-controls', win);

    controls?.addEventListener(
      'click',
      function (e) {

        e.preventDefault();
        e.stopPropagation();

        const btn =
          e.target.closest(
            'button'
          );

        if (!btn) return;

        const action =
          btn.dataset.action;

        if (
          action ===
          'collapse'
        ) {
          toggleCollapse(
            win.id
          );
        }

        else if (
          action ===
          'maximize'
        ) {
          maximizeWindow(
            win.id
          );
        }

        else if (
          action ===
          'minimize'
        ) {
          minimizeWindow(
            win.id
          );
        }

        else if (
          action ===
          'close'
        ) {
          closeWindow(
            win.id
          );
        }

        else if (
          action ===
          'tab-switcher'
        ) {
          openTabSwitcher(
            win
          );
        }

      }
    );

    /*
      URL local.
    */
    const input =
      $('.win-urlbar', win);

    const go =
      $('.win-go-btn', win);

    const navigate =
      function () {

        if (!input) return;

        let url =
          input.value.trim();

        if (!url) return;

        if (
          !/^https?:\/\//i.test(
            url
          )
        ) {
          url =
            'https://' +
            url;
        }

        /*
          Se estava suspensa,
          primeiro restaura.
        */
        if (
          win.dataset.suspended ===
          'true'
        ) {
          restoreSession(
            win.id
          );
        }

        const active =
          getActiveTab(win);

        if (active) {

          updateTabUrl(
            win,
            active.id,
            url
          );
        }

        input.value =
          url;

        touchSession(
          win.id
        );
      };

    go?.addEventListener(
      'click',
      function (e) {

        e.preventDefault();
        e.stopPropagation();

        navigate();

      }
    );

    input?.addEventListener(
      'keydown',
      function (e) {

        if (
          e.key === 'Enter'
        ) {

          e.stopPropagation();

          navigate();
        }
      }
    );

    /*
      Frame.
    */
    const frame =
      win.querySelector(
        '.win-frame'
      );

    if (frame) {
      wireFrame(
        win,
        frame
      );
    }

    /*
      Estado inicial.
    */
    const active =
      getActiveTab(win);

    if (
      frame &&
      active &&
      frame.src !==
        active.url
    ) {

      frame.src =
        active.url;
    }

    if (
      frame &&
      active
    ) {

      const localInput =
        win.querySelector(
          '.win-urlbar'
        );

      if (localInput) {
        localInput.value =
          active.url;
      }
    }

    if (!activeWindow) {
      setActiveWindow(
        win
      );
    }

    /*
      Badge.
    */
    const hdr =
      win.querySelector(
        '.win-hdr'
      );

    if (
      hdr &&
      !hdr.querySelector(
        '.state-badge'
      )
    ) {

      const badge =
        document.createElement(
          'span'
        );

      badge.className =
        'state-badge';

      badge.textContent =
        '●';

      hdr.appendChild(
        badge
      );
    }

    updateStateBadge(
      win
    );
  }

  /* ─────────────────────────────────────────────────────────────
     CREATE SESSION
  ───────────────────────────────────────────────────────────── */

  function createSessionWindow({
    title = '//',
    src =
      'https://www.infodose.com.br'
  } = {}) {

    /*
      Primeiro verifica limite total.
    */
    const limits =
      currentLimits();

    if (
      countSessions() >=
      limits.maxSessions
    ) {

      /*
        Tenta liberar espaço
        automaticamente.
      */
      enforceSessionBudget();

      if (
        countSessions() >=
        limits.maxSessions
      ) {

        console.warn(
          '[iFSw] Limite de sessões atingido.',
          limits
        );

        window.dispatchEvent(
          new CustomEvent(
            'session:limit-reached',
            {
              detail: {
                tier:
                  currentTier,

                limits
              }
            }
          )
        );

        return null;
      }
    }

    const id =
      'session-' +
      Date.now() +
      '-' +
      counter++;

    const win =
      document.createElement(
        'section'
      );

    win.className =
      'session-window peeked';

    win.id =
      id;

    win.dataset.state =
      SessionState.CREATED;

    win.dataset.suspended =
      'false';

    win.innerHTML = `

      <div class="win-hdr">

        <div class="win-controls">

          <button
            type="button"
            data-action="collapse"
            title="Colapsar"
            aria-label="Colapsar"
          >
            −
          </button>

          <button
            type="button"
            data-action="tab-switcher"
            class="tab-counter"
          >
            1
          </button>

          <button
            type="button"
            data-action="maximize"
            title="Maximizar"
            aria-label="Maximizar"
          >
            ⛶
          </button>

          <button
            type="button"
            data-action="minimize"
            title="Minimizar"
            aria-label="Minimizar"
          >
            ۞
          </button>

          <button
            type="button"
            data-action="close"
            title="Fechar"
            aria-label="Fechar"
          >
            ×
          </button>

        </div>

        <div
          class="win-navrow"
          style="
            flex:2;
            min-width:0;
            pointer-events:auto;
          "
        >

          <input
            class="win-urlbar"
            type="text"
            value="${escapeHTML(src)}"
            placeholder="Digite uma URL..."
            spellcheck="false"
            autocomplete="off"
          >

          <button
            class="win-go-btn"
            type="button"
          >
            Go
          </button>

        </div>

      </div>

      <iframe
        class="win-frame"
        data-runtime="nav"
        src="${escapeHTML(src)}"
        allow="autoplay; fullscreen; clipboard-read; clipboard-write"
      ></iframe>
    `;

    stackWrap?.appendChild(
      win
    );

    ensureSessionMeta(
      id
    );

    setSessionState(
      id,
      SessionState.CREATED
    );

    enforceActiveBudget(
      id
    );

    setSessionState(
      id,
      SessionState.LOADING
    );

    const frame =
      win.querySelector(
        '.win-frame'
      );

    frame?.addEventListener(
      'load',
      () => {

        setSessionState(
          id,
          SessionState.ACTIVE
        );

      },
      {
        once: true
      }
    );

    wireSession(
      win
    );

    wireFrame(
      win,
      frame
    );

    bringToFront(
      win
    );

    enforceActiveBudget(
      id
    );

    return id;
  }

  /* ─────────────────────────────────────────────────────────────
     THEME
  ───────────────────────────────────────────────────────────── */

  function applyTheme(
    theme
  ) {

    const next =
      theme === 'light'
        ? 'light'
        : 'dark';

    ROOT.dataset.theme =
      next;

    try {

      localStorage.setItem(
        THEME_KEY,
        next
      );

    } catch (_) {}

    $$('.theme-dot')
      .forEach(btn => {

        if (
          btn.textContent.includes(
            '☀'
          ) ||
          btn.textContent.includes(
            '🌙'
          )
        ) {

          btn.textContent =
            next === 'light'
              ? '☀️'
              : '🌙';
        }

      });

    window.dispatchEvent(
      new CustomEvent(
        'dual:theme-change',
        {
          detail: {
            theme: next
          }
        }
      )
    );
  }

  function getInitialTheme() {

    try {

      const saved =
        localStorage.getItem(
          THEME_KEY
        );

      if (
        saved === 'light' ||
        saved === 'dark'
      ) {
        return saved;
      }

    } catch (_) {}

    return 'dark';
  }

  window.DualTheme = {

    set:
      applyTheme,

    toggle() {

      applyTheme(
        ROOT.dataset.theme ===
          'light'
          ? 'dark'
          : 'light'
      );

    },

    get() {

      return (
        ROOT.dataset.theme ||
        'dark'
      );

    }

  };

  $$('.theme-dot')
    .forEach(btn => {

      btn.addEventListener(
        'click',
        e => {

          e.preventDefault();
          e.stopPropagation();

          DualTheme.toggle();

        }
      );

    });

  applyTheme(
    getInitialTheme()
  );

  /* ─────────────────────────────────────────────────────────────
     GLOBAL NAV
  ───────────────────────────────────────────────────────────── */

  const navInput =
    document.getElementById(
      'urlInputNav'
    );

  const goNavBtn =
    document.getElementById(
      'goNavBtn'
    );

  const favBtn =
    document.getElementById(
      'favBtn'
    );

  function applyGlobalUrl() {

    if (
      !navInput ||
      !activeWindow
    ) {
      return;
    }

    let url =
      navInput.value.trim();

    if (!url) return;

    if (
      !/^https?:\/\//i.test(
        url
      )
    ) {

      url =
        'https://' +
        url;
    }

    if (
      activeWindow.dataset.suspended ===
      'true'
    ) {

      restoreSession(
        activeWindow.id
      );
    }

    const active =
      getActiveTab(
        activeWindow
      );

    if (active) {

      updateTabUrl(
        activeWindow,
        active.id,
        url
      );
    }

    navInput.value =
      url;

    touchSession(
      activeWindow.id
    );
  }

  navInput?.addEventListener(
    'keydown',
    e => {

      if (
        e.key === 'Enter'
      ) {
        applyGlobalUrl();
      }

    }
  );

  goNavBtn?.addEventListener(
    'click',
    applyGlobalUrl
  );

  favBtn?.addEventListener(
    'click',
    function () {

      if (!activeWindow) return;

      const active =
        getActiveTab(
          activeWindow
        );

      if (active) {

        toggleFav(
          activeWindow,
          active.id
        );
      }

    }
  );

  /* ─────────────────────────────────────────────────────────────
     NEW TAB
  ───────────────────────────────────────────────────────────── */

  document
    .getElementById(
      'newTabBtn'
    )
    ?.addEventListener(
      'click',
      function () {

        if (
          currentSwitcherWin
        ) {

          addTab(
            currentSwitcherWin
          );
        }

      }
    );

  document
    .getElementById(
      'closeTabSwitcher'
    )
    ?.addEventListener(
      'click',
      closeTabSwitcher
    );

  document
    .getElementById(
      'openKobBtn'
    )
    ?.addEventListener(
      'click',
      () =>
        createSessionWindow()
    );

  /* ─────────────────────────────────────────────────────────────
     MAIN HEADER
  ───────────────────────────────────────────────────────────── */

  const HEADER =
    document.getElementById(
      'main-header'
    );

  const MAIN =
    document.getElementById(
      'main-content'
    );

  HEADER?.addEventListener(
    'click',
    e => {

      if (
        e.target.closest(
          'button'
        ) ||
        e.target.closest(
          'input'
        ) ||
        e.target.closest(
          '.win-navrow'
        ) ||
        e.target.closest(
          '.theme-dot'
        )
      ) {
        return;
      }

      MAIN?.classList.toggle(
        'hidden'
      );

      const collapsed =
        MAIN?.classList.contains(
          'hidden'
        );

      HEADER.classList.toggle(
        'is-collapsed',
        collapsed
      );

      window.dispatchEvent(
        new CustomEvent(
          'dual:content-collapse',
          {
            detail: {
              collapsed
            }
          }
        )
      );
    }
  );

  /* ─────────────────────────────────────────────────────────────
     HEADER AUTO-HIDE
  ───────────────────────────────────────────────────────────── */

  let lastScrollY =
    window.scrollY;

  let ticking = false;

  const SCROLL_THRESHOLD = 8;

  function updateHeader() {

    if (!HEADER) return;

    const current =
      window.scrollY;

    if (current <= 10) {

      HEADER.classList.remove(
        'header-hidden'
      );

      HEADER.classList.add(
        'header-visible'
      );

      lastScrollY =
        current;

      ticking = false;

      return;
    }

    if (
      current >
      lastScrollY +
        SCROLL_THRESHOLD
    ) {

      HEADER.classList.remove(
        'header-visible'
      );

      HEADER.classList.add(
        'header-hidden'
      );

    }

    else if (
      current <
      lastScrollY -
        SCROLL_THRESHOLD
    ) {

      HEADER.classList.remove(
        'header-hidden'
      );

      HEADER.classList.add(
        'header-visible'
      );
    }

    lastScrollY =
      current;

    ticking = false;
  }

  window.addEventListener(
    'scroll',
    () => {

      if (!ticking) {

        requestAnimationFrame(
          updateHeader
        );

        ticking = true;
      }

    },
    {
      passive: true
    }
  );

  /* ─────────────────────────────────────────────────────────────
     EXISTING WINDOWS
  ───────────────────────────────────────────────────────────── */

  $$('.session-window')
    .forEach(win => {

      ensureSessionMeta(
        win.id
      );

      wireSession(
        win
      );

      const frame =
        win.querySelector(
          '.win-frame'
        );

      /*
        Se já veio marcado como suspended,
        não força ACTIVE.
      */
      if (
        win.dataset.suspended ===
        'true'
      ) {

        setSessionState(
          win.id,
          SessionState.SUSPENDED
        );

      }

      else {

        setSessionState(
          win.id,
          frame
            ? SessionState.ACTIVE
            : SessionState.CREATED
        );

      }

      if (!activeWindow) {
        setActiveWindow(
          win
        );
      }

    });

  syncGlobalHeader();

  syncShell();

  /* ─────────────────────────────────────────────────────────────
     PUBLIC API
  ───────────────────────────────────────────────────────────── */

  /* v14 — exporta addTab/currentSwitcherWin pro botão global "+ Nova Aba"
     (antes eram só internos deste módulo, o botão do tab-switcher não
     tinha como chamar nada daqui de fora). */
  window.iFSw_addTab = addTab;
  window.iFSw_getSwitcherWin = () => currentSwitcherWin;

  window.SessionLifecycle = {

    States:
      SessionState,

    Tiers:
      Tier,

    Policy:
      LifecyclePolicy,

    getState:
      getSessionState,

    listSessions() {

      return [
        ...sessionMeta.entries()
      ].map(
        ([id, meta]) => ({
          id,
          ...meta
        })
      );

    },

    getSession(id) {

      const meta =
        sessionMeta.get(id);

      if (!meta) return null;

      const win =
        getWin(id);

      return {

        ...meta,

        hasWindow:
          !!win,

        hasRuntime:
          !!win?.querySelector(
            '.win-frame'
          ),

        tabs:
          win
            ? (
                tabDataMap.get(
                  win
                )?.tabs || []
              )
            : []
      };
    },

    setTier,

    getTier:
      () => currentTier,

    touch:
      touchSession,

    suspend:
      id =>
        suspendSession(id),

    restore:
      id =>
        restoreSession(id),

    evict:
      id =>
        evictSession(id),

    close:
      id =>
        destroySession(id),

    limits:
      () =>
        currentLimits(),

    enforce() {

      enforceActiveBudget();
      enforceSuspendedBudget();
      enforceSessionBudget();

    },

    pin(
      id,
      value = true
    ) {

      const meta =
        sessionMeta.get(id);

      const win =
        getWin(id);

      if (!meta) return;

      meta.pinned =
        !!value;

      if (win) {

        win.dataset.pinned =
          value
            ? 'true'
            : 'false';

        win.classList.toggle(
          'is-pinned',
          !!value
        );
      }

    },

    markUnsaved(
      id,
      value = true
    ) {

      const meta =
        sessionMeta.get(id);

      if (!meta) return;

      meta.hasUnsavedWork =
        !!value;

    },

    markMedia(
      id,
      value = true
    ) {

      const meta =
        sessionMeta.get(id);

      if (!meta) return;

      meta.mediaPlaying =
        !!value;

    }

  };

  /* ─────────────────────────────────────────────────────────────
     GLOBAL API
  ───────────────────────────────────────────────────────────── */

  window.createSessionWindow =
    createSessionWindow;

  window.togglePeek =
    togglePeek;

  window.toggleCollapse =
    toggleCollapse;

  window.maximizeWindow =
    maximizeWindow;

  window.minimizeWindow =
    minimizeWindow;

  window.closeWindow =
    closeWindow;

  window.suspendSession =
    suspendSession;

  window.restoreSession =
    restoreSession;

  window.evictSession =
    evictSession;

  window.syncShellMode =
    syncShell;

  /* ─────────────────────────────────────────────────────────────
     DEBUG
  ───────────────────────────────────────────────────────────── */

  window.DualRuntime =
    {

      get(id) {

        return (
          runtimeStore.get(id) ||
          null
        );

      },

      list() {

        return [
          ...runtimeStore.entries()
        ].map(
          ([id, data]) => ({
            id,
            ...data
          })
        );

      },

      clear(id) {

        runtimeStore.delete(id);

      }

    };

  console.log(
    '🚀 Almasliber OS — iFSw Nephesh Runtime Manager carregado.',
    {
      tier:
        currentTier,

      limits:
        currentLimits(),

      states:
        SessionState
    }
  );

})();

/* ===== 1-detectar-se-legacy-esta-ativo-exports-tipicos-de-ifsw-base-full-js.js ===== */
(function(){
"use strict";

/* 1) Detectar se legacy está ativo (exports típicos de iFSw-base-full.js) */
window.__LEGACY_SESSION_BOUND =
  !!(window.iFSw || window.IFSW || window.InfodoseBase || window.SessionWindow);

/* 2) Expor stackWrap como host "stack" para o MXP já existente.
      O elemento #stackWrap já existe no HTML (wrapper .almasliber) */
(function ensureStackHost(){
  if(document.getElementById('stackWrap')) return;
  const wrap = document.createElement('div');
  wrap.id = 'stackWrap';
  wrap.dataset.sessionHost = 'stack';
  const shell = document.querySelector('.almasliber .shell');
  if(shell) shell.appendChild(wrap);
})();

/* 3) Quando MXP cria uma session, delegar ao legacy se disponível.
      Assim "＋ NOVA SESSION" usa a mesma engine do iFSw-base-full.js. */
const _origCreate = window.MXP?.createSession?.bind(window.MXP);
if(_origCreate && window.__LEGACY_SESSION_BOUND && typeof window.createSession === 'function'){
  window.MXP.createSession = function(name){
    try{
      const s = _origCreate(name);
      // notificar o legacy para montar o chrome dele no novo win
      document.dispatchEvent(new CustomEvent('mxp:session-created', {detail:{session:s}}));
      return s;
    }catch(e){ console.warn('[bridge] createSession legacy', e); return _origCreate(name); }
  };
}

/* 4) Escutar eventos de session vindos do legacy (se ele emitir) */
['ifsw:session-open','legacy:session-open','session:open'].forEach(ev=>{
  document.addEventListener(ev, e=>{
    const url = e.detail?.url;
    if(url && window.MXP?.createSession) window.MXP.createSession(e.detail?.name || 'legacy');
  });
});

/* 5) Sincronizar URL bar global com a session ativa (já feito pelo MXP,
      mas garantimos caso o legacy também escute) */
document.getElementById('goNavBtn')?.addEventListener('click', ()=>{
  const inp = document.getElementById('urlInputNav');
  const url = inp?.value?.trim();
  if(!url) return;
  // legacy pode ter seu próprio frame; MXP cuida do iframe ativo
  const active = document.querySelector('.session-window:not(.minimized) .win-frame');
  if(active){
    let u = url; if(!/^https?:\/\//i.test(u) && !u.startsWith('about:')) u = 'https://'+u;
    active.src = u;
  }
});

console.log('[BRIDGE] legacy-bound =', window.__LEGACY_SESSION_BOUND);
})();

/* ===== nebula-beauty-enhance.js ===== */
(function(){
  "use strict";
  if (window.__NEBULA_ENHANCE__) return;
  window.__NEBULA_ENHANCE__ = true;

  const stage = document.getElementById('sliceStage') || document.body;

  /* ---------- 1) envolve listas de topo em .list-card ---------- */
  function wrapLists(root){
    root.querySelectorAll('ul.md-list, ol.md-list').forEach(el => {
      /* pula se já estiver num card, num ascii, ou aninhada em outra lista */
      if (el.closest('.list-card, .ascii-card, .no-beauty')) return;
      if (el.parentElement && el.parentElement.closest('ul.md-list, ol.md-list')) return;
      /* pula se já foi envolvida */
      if (el.parentElement && el.parentElement.classList.contains('list-card')) return;

      const wrap = document.createElement('div');
      wrap.className = 'list-card';
      el.parentNode.insertBefore(wrap, el);
      wrap.appendChild(el);
    });
  }

  /* ---------- 2) promove <pre> com cara de ASCII para .ascii-card ---------- */
  function enhanceASCII(root){
    root.querySelectorAll('pre.md-code, pre').forEach(pre => {
      if (pre.closest('.ascii-card, .no-beauty')) return;
      const t = (pre.textContent || '').trim();
      if (!t) return;
      const boxChars = (t.match(/[─│┌┐└┘╭╮╰╯═╬╠╣╦╩]/g) || []).length;
      const gridLike = /[-_=+*#\\/|]{3,}/.test(t);
      const multiline = t.split('\n').length >= 2;
      if (boxChars >= 4 || (multiline && gridLike && boxChars >= 1)){
        const fig = document.createElement('figure');
        fig.className = 'ascii-card';
        const p = document.createElement('pre');
        p.textContent = t;
        fig.appendChild(p);
        pre.replaceWith(fig);
      }
    });
  }

  /* ---------- 3) clicar no .copy-hint copia o bloco ---------- */
  document.addEventListener('click', async e => {
    const host = e.target.closest('#readerApp .md-code, #readerApp .bq, #readerApp .callout');
    if (!host) return;
    if (!host.querySelector('.copy-hint')) return;
    if (e.target.closest('a,button,.btn')) return;
    const txt = host.innerText.replace(/Copiar/i,'').trim();
    try { await navigator.clipboard.writeText(txt); window.KBLX_TOAST?.('Copiado ✓'); } catch(_){}
  }, { passive:true });

  /* ---------- 4) botões data-action → MXP / evento ---------- */
  document.addEventListener('click', e => {
    const btn = e.target.closest('#readerApp button.btn.action[data-action]');
    if (!btn) return;
    const action = btn.dataset.action;
    document.dispatchEvent(new CustomEvent('NEBULA_ACTION', { detail:{ action, button: btn } }));
    if (window.MXP && typeof window.MXP.fire === 'function'){
      window.MXP.fire(action, { source:'nebula-slice', button: btn });
    }
  }, { passive:true });

  /* ---------- 5) roda quando slices entram/saem ---------- */
  function run(root){
    if (!root || !root.querySelectorAll) return;
    wrapLists(root);
    enhanceASCII(root);
  }

  const obs = new MutationObserver(muts => {
    let touched = false;
    for (const m of muts){
      for (const n of m.addedNodes || []){
        if (n.nodeType === 1 && (n.matches?.('slice') || n.closest?.('#sliceStage'))){
          touched = true; break;
        }
      }
      if (touched) break;
    }
    if (touched) run(stage);
  });
  obs.observe(stage, { childList:true, subtree:true });

  /* gatilhos suaves extras (troca de slice ativa) */
  document.addEventListener('click', e => {
    if (e.target.closest('#readerApp')) setTimeout(() => run(stage), 60);
  }, { passive:true });

  if (document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', () => run(stage), { once:true });
  } else {
    run(stage);
  }

  console.log('[NebulaEnhance] list-card + ascii + copy-hint online');
})();

/* ===== nebula-rich-js.js ===== */
(function(){
  "use strict";
  if (window.__NEBULA_RICH__) return;
  window.__NEBULA_RICH__ = true;

  /* ============================================================
     PARSER — Markdown → HTML
     tabelas · listas aninhadas · task-lists · callouts · bq ·
     fences · html-raw · setext · botões de ação
     ============================================================ */
  const esc = s => String(s ?? '')
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;');

  const autoLink = u => {
    try { const x = new URL(u);
      return `<a href="${x.href}" target="_blank" rel="noopener">${x.href}</a>`;
    } catch { return u; }
  };

  function inline(s){
    let h = esc(s);
    h = h.replace(/!\[([^\]]*)\]\(([^)]+)\)/g,
      (_,a,src)=>`<img class="md-img" alt="${a}" src="${src}">`);
    h = h.replace(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g,
      (_,t,url)=>`<a href="${url}" target="_blank" rel="noopener">${t}</a>`);
    h = h.replace(/\[([^\]]+)\]\(action:([a-z0-9_:\-.]+)\)/gi,
      (_,t,a)=>`<button class="btn action" data-action="${a}">${t}</button>`);
    h = h.replace(/\[\[btn:([a-z0-9_:\-.]+)(?:\|([^\]]+))?\]\]/gi,
      (_,a,l)=>`<button class="btn action" data-action="${a}">${l||a}</button>`);
    h = h.replace(/`([^`]+)`/g,
      (_,c)=>`<code class="code-inline">${c}</code>`);
    h = h.replace(/\*\*([^*]+)\*\*/g,'<strong>$1</strong>');
    h = h.replace(/(^|[^*])\*([^*]+)\*(?!\*)/g,'$1<em>$2</em>');
    h = h.replace(/~~([^~]+)~~/g,'<del>$1</del>');
    h = h.replace(/\bhttps?:\/\/[^\s<)]+/g, autoLink);
    return h;
  }

  const isHr       = l => /^\s*(?:---|\*\*\*|___)\s*$/.test(l);
  const isQuote    = l => /^\s*>\s?/.test(l);
  const isTableRow = l => /^\s*\|.*\|\s*$/.test(l);
  const isFenceEnd = l => /^\s*(?:```|''')\s*$/.test(l);

  function listInfo(l){
    const m = l.match(/^(\s*)([-+*]|\d+\.)\s+(.*)$/);
    if (!m) return null;
    return {
      indent: m[1].replace(/\t/g,'    ').length,
      ordered: /^\d+\.$/.test(m[2]),
      text: m[3]
    };
  }

  function splitRow(l){
    let s = l.trim();
    if (s.startsWith('|')) s = s.slice(1);
    if (s.endsWith('|'))   s = s.slice(0,-1);
    return s.split('|').map(x=>x.trim());
  }
  const isSep = l => {
    const c = splitRow(l);
    return c.length && c.every(x=>/^:?-{3,}:?$/.test(x));
  };

  function parseTable(lines,start){
    const rows = []; let i = start;
    while (i < lines.length && isTableRow(lines[i])) { rows.push(splitRow(lines[i])); i++; }
    if (rows.length < 2 || !isSep(lines[start+1])) return null;
    const header = rows[0], body = rows.slice(2);

    const t = document.createElement('table');
    t.className = 'md-table';
    const thead = document.createElement('thead');
    const trh = document.createElement('tr');
    header.forEach(c=>{
      const th = document.createElement('th');
      th.innerHTML = inline(c); trh.appendChild(th);
    });
    thead.appendChild(trh); t.appendChild(thead);

    const tbody = document.createElement('tbody');
    body.forEach(r=>{
      const tr = document.createElement('tr');
      header.forEach((_,k)=>{
        const td = document.createElement('td');
        td.innerHTML = inline(r[k]||''); tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });
    t.appendChild(tbody);

    const wrap = document.createElement('div');
    wrap.className = 'md-table-wrap';
    wrap.appendChild(t);
    return { node: wrap, next: i };
  }

  function parseLists(lines,start){
    const first = listInfo(lines[start]); if (!first) return null;
    const root = document.createElement(first.ordered ? 'ol' : 'ul');
    root.className = 'md-list';

    const stack = [{ indent:first.indent, ordered:first.ordered, list:root, lastLi:null }];
    let i = start;

    while (i < lines.length){
      const info = listInfo(lines[i]); if (!info) break;
      while (stack.length > 1 && info.indent < stack[stack.length-1].indent) stack.pop();
      let cur = stack[stack.length-1];

      if (info.indent > cur.indent && cur.lastLi){
        const nested = document.createElement(info.ordered ? 'ol' : 'ul');
        nested.className = 'md-list';
        cur.lastLi.appendChild(nested);
        stack.push({ indent:info.indent, ordered:info.ordered, list:nested, lastLi:null });
        cur = stack[stack.length-1];
      } else if (info.indent === cur.indent && info.ordered !== cur.ordered && cur.lastLi){
        const nested = document.createElement(info.ordered ? 'ol' : 'ul');
        nested.className = 'md-list';
        cur.lastLi.appendChild(nested);
        stack.push({ indent:info.indent, ordered:info.ordered, list:nested, lastLi:null });
        cur = stack[stack.length-1];
      }

      const li = document.createElement('li');
      const task = info.text.match(/^\[( |x|X)\]\s*(.*)$/);
      if (task){
        cur.list.classList.add('md-task');
        const box = document.createElement('input');
        box.type='checkbox'; box.checked=/x/i.test(task[1]); box.disabled = true;
        const span = document.createElement('span');
        span.innerHTML = inline(task[2]);
        li.append(box, span);
      } else {
        li.innerHTML = inline(info.text);
      }
      cur.list.appendChild(li);
      cur.lastLi = li;
      i++;
    }
    return { node: root, next: i };
  }

  function parseFence(lines,start){
    const m = lines[start].match(/^\s*(?:```|''')([\w-]*)\s*$/);
    if (!m) return null;
    const lang = (m[1]||'').toLowerCase();
    const buf = []; let i = start + 1;
    while (i < lines.length && !isFenceEnd(lines[i])) { buf.push(lines[i]); i++; }
    const raw = buf.join('\n');

    if (lang === 'html-raw'){
      const w = document.createElement('div');
      w.className = 'raw-html-card';
      w.innerHTML = raw;
      return { node:w, next: i < lines.length ? i+1 : i };
    }

    const pre  = document.createElement('pre');
    pre.className = 'md-code';
    const code = document.createElement('code');
    if (lang) code.className = 'language-' + lang;
    code.textContent = raw;
    pre.appendChild(code);
    return { node:pre, next: i < lines.length ? i+1 : i };
  }

  function render(md){
    if (md == null) return '';
    const text = String(md);
    if (!text.trim()) return '';

    const lines = text.replace(/\r\n?/g,'\n').split('\n');
    const out = [];
    let i = 0, para = [];

    const flushP = () => {
      if (!para.length) return;
      const joined = para.join(' ').trim();
      if (joined){
        const p = document.createElement('p');
        p.innerHTML = inline(joined);
        out.push(p.outerHTML);
      }
      para = [];
    };

    while (i < lines.length){
      const line = lines[i];
      if (!line.trim()){ flushP(); i++; continue; }

      const fence = parseFence(lines, i);
      if (fence){ flushP(); out.push(fence.node.outerHTML); i = fence.next; continue; }

      const hm = line.match(/^(#{1,6})\s+(.*)$/);
      if (hm){
        flushP();
        const h = document.createElement('h' + hm[1].length);
        h.innerHTML = inline(hm[2]);
        out.push(h.outerHTML); i++; continue;
      }

      if (i+1 < lines.length && /^[=-]{3,}\s*$/.test(lines[i+1]) && line.trim()){
        flushP();
        const lv = lines[i+1].trim()[0] === '=' ? 1 : 2;
        const h = document.createElement('h' + lv);
        h.innerHTML = inline(line.trim());
        out.push(h.outerHTML); i += 2; continue;
      }

      if (isHr(line)){ flushP(); out.push('<hr class="hr">'); i++; continue; }

      if (isQuote(line)){
        flushP();
        const buf = [];
        while (i < lines.length && isQuote(lines[i])){
          buf.push(lines[i].replace(/^\s*>\s?/,''));
          i++;
        }
        const bq = document.createElement('blockquote');
        bq.className = 'bq';
        bq.innerHTML = '<span class="copy-hint">Copiar</span>' + inline(buf.join(' '));
        out.push(bq.outerHTML); continue;
      }

      const call = line.match(/^\s*(::(info|warn|tip|note|success|danger)|::\.|:|\?)\s+(.*)$/i);
      if (call){
        let kind = 'note';
        if (call[1] === '::.') kind = 'aside';
        else if (call[1] === ':') kind = 'note';
        else if (call[1] === '?') kind = 'question';
        else kind = (call[2] || 'info').toLowerCase();

        const buf = [call[3]];
        let j = i + 1;
        while (j < lines.length){
          const nx = lines[j].trim();
          if (!nx) break;
          if (/^\s*(::(info|warn|tip|note|success|danger)|::\.|:|\?)\s+/.test(nx)) break;
          buf.push(nx); j++;
        }
        i = j;
        const d = document.createElement('div');
        d.className = 'callout ' + kind;
        d.innerHTML = '<span class="copy-hint">Copiar</span>' + inline(buf.join(' '));
        out.push(d.outerHTML); continue;
      }

      if (isTableRow(line)){
        const t = parseTable(lines, i);
        if (t){ flushP(); out.push(t.node.outerHTML); i = t.next; continue; }
      }

      if (listInfo(line)){
        const l = parseLists(lines, i);
        if (l){ flushP(); out.push(l.node.outerHTML); i = l.next; continue; }
      }

      para.push(line.trim());
      i++;
    }
    flushP();
    return out.join('\n');
  }

  window.NebulaRender = { render, version: 1 };

  /* ============================================================
     DECORATOR — envolve listas em .list-card, promove ASCII
     ============================================================ */
  function decorate(root){
    if (!root || !root.querySelectorAll) return;

    root.querySelectorAll('.md-list').forEach(el => {
      if (el.closest('.list-card, .ascii-card, .no-beauty')) return;
      if (el.parentElement && el.parentElement.closest('.md-list')) return;
      if (el.parentElement && el.parentElement.classList.contains('list-card')) return;
      const wrap = document.createElement('div');
      wrap.className = 'list-card';
      el.parentNode.insertBefore(wrap, el);
      wrap.appendChild(el);
    });

    root.querySelectorAll('pre.md-code').forEach(pre => {
      if (pre.closest('.ascii-card, .no-beauty')) return;
      const t = (pre.textContent || '').trim();
      if (!t) return;
      const boxChars = (t.match(/[─│┌┐└┘╭╮╰╯═╬╠╣╦╩]/g) || []).length;
      const gridLike = /[-_=+*#\\/|]{3,}/.test(t);
      const multiline = t.split('\n').length >= 2;
      if (boxChars >= 4 || (multiline && gridLike && boxChars >= 1)){
        const fig = document.createElement('figure');
        fig.className = 'ascii-card';
        const p = document.createElement('pre');
        p.textContent = t;
        fig.appendChild(p);
        pre.replaceWith(fig);
      }
    });
  }

  /* ============================================================
     Cliques: copy-hint + botões data-action
     ============================================================ */
  document.addEventListener('click', async e => {
    const hint = e.target.closest('#readerApp .copy-hint');
    if (hint){
      const host = hint.parentElement;
      if (!host) return;
      const txt = host.innerText.replace(/Copiar/i,'').trim();
      try { await navigator.clipboard.writeText(txt); window.KBLX_TOAST?.('Copiado ✓'); } catch(_){}
      return;
    }
    const btn = e.target.closest('#readerApp button.btn.action[data-action]');
    if (btn){
      const action = btn.dataset.action;
      document.dispatchEvent(new CustomEvent('NEBULA_ACTION', { detail:{ action, button: btn } }));
      if (window.MXP && typeof window.MXP.fire === 'function'){
        window.MXP.fire(action, { source:'nebula-slice', button: btn });
      }
    }
  }, { passive:true });

  /* ============================================================
     HOOK em Nebula.loadDocument
     ============================================================ */
  function reRenderAllSlices(){
    const Neb = window.Nebula;
    if (!Neb || !Neb.state || !Neb.state.slices) return;
    const slices = Neb.state.slices;
    if (!slices.length) return;
    const stage = document.getElementById('sliceStage');
    if (!stage) return;

    const bodies = stage.querySelectorAll('slice .slice-body');
    bodies.forEach((body, i) => {
      const raw = slices[i];
      if (raw == null) return;
      body.innerHTML = render(raw);
    });
    decorate(stage);
  }

  function install(){
    const Neb = window.Nebula;
    if (!Neb || typeof Neb.loadDocument !== 'function') return false;
    if (Neb.__richHooked) return true;
    Neb.__richHooked = true;

    const _orig = Neb.loadDocument.bind(Neb);
    Neb.loadDocument = function(text, title){
      _orig(text, title);
      try { reRenderAllSlices(); }
      catch (err){ console.warn('[NebulaRich] re-render:', err); }
    };
    console.log('[NebulaRich] hookado em Nebula.loadDocument ✓');
    return true;
  }

  if (!install()){
    let tries = 0;
    const t = setInterval(() => {
      if (install() || ++tries > 60) clearInterval(t);
    }, 50);
  }

  function boot(){
    install();
    reRenderAllSlices();
  }
  if (document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', boot, { once:true });
  } else {
    boot();
  }

  window.NebulaRich = { render, decorate, reRenderAllSlices, version: 1 };
  console.log('[NebulaRich] parser rico + decorator online ✓');
})();


(function(){
"use strict";
if (window.__KBLX_FIX_V15__) return;
window.__KBLX_FIX_V15__ = true;

/* ═══════════════════════════════════════════════════════════
   1. RESOLVER DE SESSION WINDOW ALVO
   Substitui o seletor quebrado `.app > section.session-window`
   por um resolvedor que entende as 3 origens:
     - DualSession.activeWindow (article em #sessionsLayer)
     - iFSw #stackWrap section.session-window
     - sections auto-adaptadas do sessionize()
   ═══════════════════════════════════════════════════════════ */
function resolveSessionWindow(ctx){
  // a) elemento clicado/ctx pertence diretamente
  const fromEl = ctx?.element?.closest?.('.session-window')
              || ctx?.section?.closest?.('.session-window')
              || document.activeElement?.closest?.('.session-window');
  if (fromEl) return fromEl;

  // b) DualSession.activeWindow
  const act = window.DualSession?.activeWindow;
  if (act && document.body.contains(act) && !act.classList.contains('minimized')) return act;

  // c) maior z-index entre as não-minimizadas
  const wins = [...document.querySelectorAll('.session-window:not(.minimized)')];
  if (!wins.length) return null;
  let best = wins[0], bestZ = -1;
  for (const w of wins){
    const z = parseInt(getComputedStyle(w).zIndex) || 0;
    if (z >= bestZ){ bestZ = z; best = w; }
  }
  return best;
}

/* ═══════════════════════════════════════════════════════════
   2. CAPTURE HANDLER session:* — pega ANTES do BRIDGE do §H
   (stopImmediatePropagation mata o handler quebrado)
   ═══════════════════════════════════════════════════════════ */
document.addEventListener('click', function(e){
  const btn = e.target.closest('[data-action^="session:"]');
  if (!btn) return;
  const action = btn.dataset.action;
  const s = resolveSessionWindow({ element: btn, section: btn.closest('.session-window') });
  if (!s) return;

  e.preventDefault();
  e.stopImmediatePropagation();

  switch(action){
    case 'session:collapse':
      s.classList.toggle('collapsed');
      break;
    case 'session:maximize':
      s.classList.toggle('maximized');
      document.body.classList.toggle('has-maximized',
        !!document.querySelector('.session-window.maximized:not(.minimized)'));
      break;
    case 'session:minimize': {
      const title = s.dataset.sessionTitle
                 || s.querySelector('.mxp-title,[data-part="title"]')?.textContent?.trim()
                 || s.id;
      window.KBLX_minimizeToDock?.(s, { title });
      break;
    }
    case 'session:close':
      s.classList.add('minimized');
      break;
    case 'session:focus':
      window.DualSession?.bringToFront?.(s);
      break;
  }
  document.dispatchEvent(new CustomEvent('mxp:section-action', {
    detail: { section: s, action: action.replace('session:','') }
  }));
}, true);

/* ═══════════════════════════════════════════════════════════
   3. CONSERTA __LEGACY_SESSION_BOUND
   Deriva dos exports REAIS que o iFSw produz.
   ═══════════════════════════════════════════════════════════ */
try {
  Object.defineProperty(window, '__LEGACY_SESSION_BOUND', {
    get(){ return !!(window.SessionLifecycle || window.createSessionWindow || window.iFSw_addTab); },
    set(_v){ /* no-op: sempre derivado */ },
    configurable: true
  });
} catch(_){}

/* ═══════════════════════════════════════════════════════════
   4. LOOSETABS — universos/presets no slot loose
   Cada tab = um universo = um array de botões MXP.
   Persistido em kobllux:loose_tabs.
   ═══════════════════════════════════════════════════════════ */
const LT_KEY    = 'kobllux:loose_tabs';
const LT_ACTIVE = 'kobllux:loose_active';

const LooseTabs = {
  state: null,
  load(){
    if (this.state) return this.state;
    let saved = null;
    try { saved = JSON.parse(localStorage.getItem(LT_KEY)); } catch(_){}
    if (!saved || !Array.isArray(saved.tabs) || !saved.tabs.length){
      saved = { tabs: [{ id:'default', name:'Default', icon:'◈', items:[] }] };
    }
    this.state = saved;
    this.state.active = localStorage.getItem(LT_ACTIVE) || saved.tabs[0].id;
    if (!saved.tabs.find(t=>t.id===this.state.active)) this.state.active = saved.tabs[0].id;
    return this.state;
  },
  save(){
    if (!this.state) return;
    try {
      localStorage.setItem(LT_KEY, JSON.stringify({ tabs: this.state.tabs }));
      localStorage.setItem(LT_ACTIVE, this.state.active);
    } catch(_){}
    document.dispatchEvent(new CustomEvent('loose:changed', { detail:{ active: this.state.active } }));
  },
  current(){ return this.state.tabs.find(t=>t.id===this.state.active) || this.state.tabs[0]; },

  /* MXP.state.slots.loose  →  tab atual  (após mutação externa) */
  syncFromMxp(){
    const mxp = window.MXP; if (!mxp) return;
    const cur = this.current(); if (!cur) return;
    cur.items = JSON.parse(JSON.stringify(mxp.state.slots.loose || []));
    this.save();
  },
  /* tab atual  →  MXP.state.slots.loose  (após troca de tab) */
  applyToMxp(){
    const mxp = window.MXP; if (!mxp) return;
    const cur = this.current(); if (!cur) return;
    mxp.state.slots.loose = JSON.parse(JSON.stringify(cur.items || []));
    mxp.renderSlot('loose');
    mxp.save?.();
    window.KBLX_syncLooseWithDock?.();
  },

  create(name){
    const t = {
      id: 'u_' + Date.now().toString(36) + Math.random().toString(36).slice(2,5),
      name: name || ('Universo ' + (this.state.tabs.length + 1)),
      icon: '◈',
      items: []
    };
    this.state.tabs.push(t);
    this.save();
    return t;
  },
  switchTo(id){
    if (!id || id === this.state.active) return;
    if (!this.state.tabs.find(t=>t.id===id)) return;
    this.syncFromMxp();          // salva o atual
    this.state.active = id;
    this.save();
    this.applyToMxp();           // carrega o novo
    this.render();
    window.KBLX_TOAST?.('Universo: ' + this.current().name);
  },
  remove(id){
    if (this.state.tabs.length <= 1) return;
    const i = this.state.tabs.findIndex(t=>t.id===id);
    if (i < 0) return;
    this.state.tabs.splice(i,1);
    if (this.state.active === id) this.state.active = this.state.tabs[0].id;
    this.save();
    this.applyToMxp();
    this.render();
  },
  rename(id){
    const t = this.state.tabs.find(x=>x.id===id);
    if (!t) return;
    const n = prompt('Nome do universo:', t.name);
    if (n && n.trim()){ t.name = n.trim(); this.save(); this.render(); }
  },

  render(){
    const host = document.querySelector('[data-loose-tabs]');
    if (!host) return;
    host.innerHTML = '';
    const active = this.state.active;
    this.state.tabs.forEach(t=>{
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'loose-tab' + (t.id===active ? ' is-active' : '');
      b.dataset.action = 'loose:switch';
      b.dataset.looseId = t.id;
      b.title = `${t.name} · tap² renomeia · segure remove`;
      b.innerHTML = `<span class="lt-icon">${t.icon||'◈'}</span><span class="lt-name">${t.name}</span>`;
      host.appendChild(b);
    });
    const add = document.createElement('button');
    add.type = 'button';
    add.className = 'loose-tab loose-tab-add';
    add.dataset.action = 'loose:new';
    add.title = 'Novo universo';
    add.textContent = '＋';
    host.appendChild(add);
  }
};
window.LooseTabs = LooseTabs;

/* ═══════════════════════════════════════════════════════════
   5. CSS dos loose tabs (injetado aqui pra não depender do BASE.css)
   ═══════════════════════════════════════════════════════════ */
(function injectCss(){
  if (document.getElementById('kblx-loose-tabs-css')) return;
  const s = document.createElement('style');
  s.id = 'kblx-loose-tabs-css';
  s.textContent = `
.loose-tabs{display:flex;gap:6px;margin:0 0 8px;padding:6px;overflow-x:auto;
  background:rgba(255,255,255,.02);border:1px solid rgba(255,255,255,.08);
  border-radius:12px;scrollbar-width:thin;}
.loose-tab{flex:0 0 auto;display:inline-flex;align-items:center;gap:6px;
  padding:6px 10px;border-radius:8px;border:1px solid rgba(255,255,255,.10);
  background:transparent;color:#c9d0d5;font:inherit;font-size:12px;
  cursor:pointer;transition:background .15s,border-color .15s,color .15s;}
.loose-tab:hover{background:rgba(255,255,255,.05);}
.loose-tab.is-active{
  border-color:var(--kob-voice-primary,#00f2ff);
  background:color-mix(in srgb,var(--kob-voice-primary,#00f2ff) 14%,transparent);
  color:var(--kob-voice-primary,#00f2ff);
  box-shadow:0 0 0 1px color-mix(in srgb,var(--kob-voice-primary,#00f2ff) 35%,transparent);}
.loose-tab .lt-icon{font-size:11px;opacity:.85;}
.loose-tab .lt-name{max-width:130px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
.loose-tab-add{font-weight:900;padding:6px 10px;color:var(--kob-voice-primary,#00f2ff);}
  `;
  document.head.appendChild(s);
})();

/* ═══════════════════════════════════════════════════════════
   6. BARRA DE TABS no workspace
   ═══════════════════════════════════════════════════════════ */
function injectLooseTabsBar(){
  const slot = document.querySelector('[data-slot="loose"]');
  if (!slot) return;
  if (document.querySelector('[data-loose-tabs]')) return;
  const bar = document.createElement('div');
  bar.className = 'loose-tabs';
  bar.dataset.looseTabs = '1';
  slot.parentNode.insertBefore(bar, slot);
}

/* ═══════════════════════════════════════════════════════════
   7. AÇÕES data-action  loose:*
   ═══════════════════════════════════════════════════════════ */
let holdFired = false;
let holdTimer = null;

document.addEventListener('pointerdown', e=>{
  const btn = e.target.closest('.loose-tab:not(.loose-tab-add)');
  if (!btn) return;
  holdFired = false;
  holdTimer = setTimeout(()=>{
    holdFired = true;
    const id = btn.dataset.looseId;
    const t = LooseTabs.state.tabs.find(x=>x.id===id);
    if (!t) return;
    if (LooseTabs.state.tabs.length <= 1){
      window.KBLX_TOAST?.('Precisa de ao menos 1 universo');
      return;
    }
    if (confirm(`Remover universo "${t.name}"?`)){
      LooseTabs.remove(id);
      window.KBLX_TOAST?.('Removido: ' + t.name);
    }
    if (navigator.vibrate) try { navigator.vibrate(15); } catch(_){}
  }, 650);
}, true);
document.addEventListener('pointerup',    ()=>clearTimeout(holdTimer), true);
document.addEventListener('pointercancel',()=>clearTimeout(holdTimer), true);
document.addEventListener('pointermove',  ()=>clearTimeout(holdTimer), true);

document.addEventListener('click', e=>{
  const btn = e.target.closest('[data-action^="loose:"]');
  if (!btn) return;
  e.preventDefault();
  e.stopImmediatePropagation();

  const action = btn.dataset.action;

  if (action === 'loose:new'){
    const t = LooseTabs.create();
    LooseTabs.switchTo(t.id);
    return;
  }

  if (action === 'loose:switch'){
    if (holdFired){ holdFired = false; return; }
    const id = btn.dataset.looseId;
    const now = Date.now();
    if (btn.__lastTap && now - btn.__lastTap < 380){
      btn.__lastTap = 0;
      LooseTabs.rename(id);
      return;
    }
    btn.__lastTap = now;
    setTimeout(()=>{
      if (btn.__lastTap === now){
        btn.__lastTap = 0;
        LooseTabs.switchTo(id);
      }
    }, 340);
    return;
  }
}, true);

/* ═══════════════════════════════════════════════════════════
   8. HOOK em MXP: renderSlot('loose') e save()
   — sempre espelha tab ↔ MXP.state.slots.loose
   — e re-hidrata o "loose reflete docked" depois do render
   ═══════════════════════════════════════════════════════════ */
function hookMxp(){
  const mxp = window.MXP;
  if (!mxp || mxp.__v15hooked) return;
  mxp.__v15hooked = true;

  const origRender = mxp.renderSlot.bind(mxp);
  mxp.renderSlot = function(slot){
    origRender(slot);
    if (slot === 'loose') window.KBLX_syncLooseWithDock?.();
  };

  const origSave = mxp.save.bind(mxp);
  mxp.save = function(){
    origSave();
    try { LooseTabs.syncFromMxp(); } catch(_){}
  };
}

/* ═══════════════════════════════════════════════════════════
   9. BOOT
   ═══════════════════════════════════════════════════════════ */
function boot(){
  LooseTabs.load();
  injectLooseTabsBar();
  LooseTabs.render();
  setTimeout(()=>{
    hookMxp();
    const cur = LooseTabs.current();
    const mxpLoose = window.MXP?.state?.slots?.loose || [];
    // Primeira vez (universo vazio + MXP com seed default) → adota o seed
    if ((!cur.items || cur.items.length === 0) && mxpLoose.length){
      cur.items = JSON.parse(JSON.stringify(mxpLoose));
      LooseTabs.save();
    } else {
      LooseTabs.applyToMxp();
    }
    LooseTabs.render();
  }, 350);
  console.log('[FIX v15] session:* resolver + LooseTabs online');
}

if (document.readyState === 'loading'){
  document.addEventListener('DOMContentLoaded', ()=>setTimeout(boot, 420), { once:true });
} else {
  setTimeout(boot, 420);
}
})();
