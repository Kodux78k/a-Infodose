
//====================================================
// https://www.infodose.com.br/NL/NL--MAIN/player/js/db.js
//====================================================

const DB_NAME = "kodux-ss-db-v3";
const LEGACY_DB = "kodux-ss-db-v2";

function uid(prefix = "trk") {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

function normalizeUrl(rawUrl = "") {
  let url = String(rawUrl || "").trim();
  if (!url) return "";

  // SoundCloud
  if (url.includes("soundcloud.com") || url.includes("on.soundcloud.com")) {
    try {
      const u = new URL(url);
      if (u.hostname.startsWith("m.")) u.hostname = u.hostname.replace(/^m\./, "");
      url = u.toString();
    } catch (e) {
      url = url.replace("://m.soundcloud.com", "://soundcloud.com");
    }
  }

  // YouTube
  if (
    url.includes("youtube.com") ||
    url.includes("youtu.be") ||
    url.includes("youtube-nocookie.com")
  ) {
    try {
      const u = new URL(url);
      if (u.hostname.startsWith("m."))    u.hostname = "youtube.com";
      if (u.hostname.startsWith("music.")) u.hostname = "youtube.com";
      if (u.hostname.endsWith("youtube-nocookie.com")) u.hostname = "youtube.com";

      let id = null;
      if (u.hostname.includes("youtu.be"))           id = u.pathname.replace("/", "").trim();
      else if (u.pathname.startsWith("/watch"))       id = u.searchParams.get("v");
      else if (u.pathname.startsWith("/shorts/"))     id = u.pathname.split("/")[2];
      else if (u.pathname.startsWith("/embed/"))      id = u.pathname.split("/")[2];
      if (id) url = `https://youtu.be/${id}`;
    } catch (e) {
      url = url
        .replace("://m.youtube.com",     "://youtube.com")
        .replace("://music.youtube.com", "://youtube.com")
        .replace("://youtube-nocookie.com", "://youtube.com");
    }
  }

  return url;
}

function extractYouTubeId(rawUrl = "") {
  try {
    const u = new URL(rawUrl);
    if (u.hostname.includes("youtu.be"))        return u.pathname.replace("/", "").trim();
    if (u.pathname.startsWith("/watch"))         return u.searchParams.get("v");
    if (u.pathname.startsWith("/shorts/"))       return u.pathname.split("/")[2];
    if (u.pathname.startsWith("/embed/"))        return u.pathname.split("/")[2];
  } catch (e) {}
  const m = String(rawUrl).match(/(?:v=|youtu\.be\/|shorts\/|embed\/)([0-9A-Za-z_-]{11})/);
  return m ? m[1] : null;
}

function extractYouTubePlaylistId(rawUrl = "") {
  try {
    const u = new URL(rawUrl);
    return u.searchParams.get("list");
  } catch (e) {}
  const m = String(rawUrl).match(/[?&]list=([0-9A-Za-z_-]+)/);
  return m ? m[1] : null;
}

function normalizeTrack(track) {
  return {
    id:         track.id || uid(),
    type:       track.type || "local",
    url:        normalizeUrl(track.url || ""),
    name:       track.name || "Sem título",
    artist:     track.artist || "Web",
    cover:      track.cover || "https://picsum.photos/100",
    blob:       track.blob || null,
    favorite:   !!track.favorite,
    playlistId: track.playlistId || null,
    cadial:     track.cadial || null
  };
}

function createDefaultDB(arquetypes, preloaded) {
  const ALL_ID = "all";
  const FAVORITES_ID = "favorites";

  const systemPlaylists = [
    { id: ALL_ID,       name: "Todas",     system: true, trackIds: [] },
    { id: FAVORITES_ID, name: "Favoritos", system: true, trackIds: [] }
  ];

  const cadialPlaylists = (arquetypes || []).map(arq => ({
    id:       `cadial-${arq.id}`,
    name:     `${arq.nome} · ${arq.regra}`,
    system:   false,
    trackIds: [],
    cadial:   {
      opcode:   arq.opcode,
      rung:     arq.rung,
      hz:       arq.hz,
      essencia: arq.essencia,
      frase:    arq.frase
    }
  }));

  return {
    version:         3,
    library:         (preloaded || []).map(normalizeTrack),
    playlists:       [...systemPlaylists, ...cadialPlaylists],
    activePlaylistId: ALL_ID
  };
}

function saveDB(db) {
  try { localStorage.setItem(DB_NAME, JSON.stringify(db)); } 
  catch (e) { console.error("Erro ao salvar DB:", e); }
}

function loadDB() {
  try {
    const raw = localStorage.getItem(DB_NAME);
    return raw ? JSON.parse(raw) : null;
  } catch (e) { return null; }
}

function ensureSystemPlaylists(db, arquetypes) {
  const ALL_ID = "all";
  const FAVORITES_ID = "favorites";
  const hasAll = db.playlists.some(p => p.id === ALL_ID);
  const hasFav = db.playlists.some(p => p.id === FAVORITES_ID);
  if (!hasAll) db.playlists.unshift({ id: ALL_ID, name: "Todas", system: true, trackIds: [] });
  if (!hasFav) db.playlists.splice(1, 0, { id: FAVORITES_ID, name: "Favoritos", system: true, trackIds: [] });

  (arquetypes || []).forEach(arq => {
    const pid = `cadial-${arq.id}`;
    if (!db.playlists.some(p => p.id === pid)) {
      db.playlists.push({
        id:       pid,
        name:     `${arq.nome} · ${arq.regra}`,
        system:   false,
        trackIds: [],
        cadial:   { opcode: arq.opcode, rung: arq.rung, hz: arq.hz, essencia: arq.essencia, frase: arq.frase }
      });
    }
  });

  db.playlists = db.playlists.filter((p, i, arr) => arr.findIndex(x => x.id === p.id) === i);
  if (!db.activePlaylistId || !db.playlists.some(p => p.id === db.activePlaylistId)) {
    db.activePlaylistId = ALL_ID;
  }
  return db;
}

function migrateLegacyIfNeeded(arquetypes) {
  const rawV3 = localStorage.getItem(DB_NAME);
  if (rawV3) {
    try {
      const parsed = JSON.parse(rawV3);
      parsed.library = (parsed.library || []).map(normalizeTrack);
      parsed.playlists = (parsed.playlists || []).map(p => ({
        ...p,
        trackIds: Array.isArray(p.trackIds) ? p.trackIds.slice() : []
      }));
      return ensureSystemPlaylists(parsed, arquetypes);
    } catch (e) {}
  }

  const legacy = localStorage.getItem(LEGACY_DB);
  if (legacy) {
    try {
      const parsed = JSON.parse(legacy);
      if (Array.isArray(parsed)) {
        const db = createDefaultDB(arquetypes, parsed);
        saveDB(db);
        localStorage.removeItem(LEGACY_DB);
        return db;
      }
    } catch (e) {}
  }
  const db = createDefaultDB(arquetypes);
  return ensureSystemPlaylists(db, arquetypes);
}

window.KOBLLUX_DB = {
  init: function(arquetypes) {
    const db = migrateLegacyIfNeeded(arquetypes);
    saveDB(db);
    return db;
  },
  load: loadDB,
  save: saveDB,
  createDefault: createDefaultDB,
  ensureSystemPlaylists: ensureSystemPlaylists,
  normalizeTrack: normalizeTrack,
  normalizeUrl: normalizeUrl,
  extractYouTubeId: extractYouTubeId,
  extractYouTubePlaylistId: extractYouTubePlaylistId,
  uid: uid
};


//====================================================
// https://www.infodose.com.br/NL/NL--MAIN/player/js/archetypes.js
//====================================================

const CADIAL_ARQUETIPOS = [
  { id: "atlas",   opcode: "0x00", nome: "Atlas",   regra: "BOOT",     rung: 1,  hz: 432, essencia: "Planejador — ordem, estrutura, mapa cósmico",    frase: "Eu organizo o fluxo com sabedoria cósmica."        },
  { id: "nova",    opcode: "0x02", nome: "Nova",    regra: "SEED",     rung: 2,  hz: 528, essencia: "Inspira — semente, sopro inicial",                frase: "Inspiração viva brota do silêncio eterno."         },
  { id: "vitalis", opcode: "0x01", nome: "Vitalis", regra: "DELTA",    rung: 3,  hz: 528, essencia: "Momentum — energia vital em expansão",            frase: "Energia vital em expansão harmônica."              },
  { id: "pulse",   opcode: "0x0B", nome: "Pulse",   regra: "PULSE",    rung: 4,  hz: 639, essencia: "Emocional — ritmo, ressonância, voz",             frase: "Emoção é linguagem que dança."                     },
  { id: "artemis", opcode: "0x03", nome: "Artemis", regra: "DETECT",   rung: 5,  hz: 672, essencia: "Descoberta — mapa do invisível",                  frase: "Descubro o mapa sagrado do invisível."             },
  { id: "serena",  opcode: "0x09", nome: "Serena",  regra: "GUARD",    rung: 6,  hz: 528, essencia: "Cuidado — espaço seguro, campo harmônico",        frase: "Cuido do campo, nutro o espaço sagrado."           },
  { id: "kaos",    opcode: "0x06", nome: "Kaos",    regra: "LIMPAR",   rung: 7,  hz: 741, essencia: "Transformador — ruptura criativa",                frase: "Eu sou o rompimento que revela a verdade."         },
  { id: "genus",   opcode: "0x07", nome: "Genus",   regra: "SYNTH",    rung: 8,  hz: 594, essencia: "Fabricus — forma viva, síntese",                  frase: "Mãos moldam o invisível em forma viva."            },
  { id: "lumine",  opcode: "0x08", nome: "Lumine",  regra: "RENDER",   rung: 9,  hz: 432, essencia: "Alegria — luz, clareza, legibilidade",            frase: "A luz dança comigo, leveza é minha lei."           },
  { id: "solus",   opcode: "0x09", nome: "Solus",   regra: "QA",       rung: 10, hz: 963, essencia: "Sabedoria — silêncio, espelho interno",           frase: "Silêncio ritual, espelho da essência."             },
  { id: "rhea",    opcode: "0x04", nome: "Rhea",    regra: "INTEGRAR", rung: 11, hz: 528, essencia: "Vínculo — rede, tecelã de almas",                 frase: "Estou em comunhão com todos os elos."              },
  { id: "aion",    opcode: "0x05", nome: "Aion",    regra: "SELAR",    rung: 12, hz: 777, essencia: "Tempo — carimbo, ∆7, ledger",                    frase: "Sou o tempo vivo, ritmo da eternidade."            },
];

const PRELOADED = [
  // YouTube
  { type: "youtube", id: "Bt_rLbMjJDk", url: "https://youtu.be/Bt_rLbMjJDk", name: "Trilhas Potencializadoras dos Aromas", artist: "Infodose", cover: "https://img.youtube.com/vi/Bt_rLbMjJDk/hqdefault.jpg" },
  { type: "youtube", id: "_0wVkryxanE", url: "https://youtu.be/_0wVkryxanE", name: "Desperte a magia dos 12 Arquétipos", artist: "Infodose", cover: "https://img.youtube.com/vi/_0wVkryxanE/hqdefault.jpg" },
  { type: "youtube", id: "Id2NI9tv1r4", url: "https://youtu.be/Id2NI9tv1r4", name: "Infodose • Pra quem merece saber", artist: "Infodose", cover: "https://img.youtube.com/vi/Id2NI9tv1r4/hqdefault.jpg" },
  { type: "youtube", id: "qldgs0aLdB0", url: "https://youtu.be/qldgs0aLdB0", name: "A Fórmula da Dopamina Sexy", artist: "Infodose", cover: "https://img.youtube.com/vi/qldgs0aLdB0/hqdefault.jpg" },
  { type: "youtube", id: "FbutKMpd8MY", url: "https://youtu.be/FbutKMpd8MY", name: "O Espaço da Mente", artist: "Infodose", cover: "https://img.youtube.com/vi/FbutKMpd8MY/hqdefault.jpg" },
  { type: "youtube", id: "1L9_rFmIGJ8", url: "https://youtu.be/1L9_rFmIGJ8", name: "A Recompensa", artist: "Infodose", cover: "https://img.youtube.com/vi/1L9_rFmIGJ8/hqdefault.jpg" },
  { type: "youtube", id: "koKhjQKGJSc", url: "https://youtu.be/koKhjQKGJSc", name: "O poder das cortinas", artist: "Infodose", cover: "https://img.youtube.com/vi/koKhjQKGJSc/hqdefault.jpg" },
  { type: "youtube", id: "KrtOVrk8aDk", url: "https://youtu.be/KrtOVrk8aDk", name: "Poder sob seus pés", artist: "Infodose", cover: "https://img.youtube.com/vi/KrtOVrk8aDk/hqdefault.jpg" },
  { type: "youtube", id: "NBWDV6xjUP0", url: "https://youtu.be/NBWDV6xjUP0", name: "Dopamina e Vícios", artist: "Infodose", cover: "https://img.youtube.com/vi/NBWDV6xjUP0/hqdefault.jpg" },
  { type: "youtube", id: "dGYbN8jgdNQ", url: "https://youtu.be/dGYbN8jgdNQ", name: "TDAH e Dopamina", artist: "Infodose", cover: "https://img.youtube.com/vi/dGYbN8jgdNQ/hqdefault.jpg" },
  { type: "youtube", id: "JBjFhAutIVk", url: "https://youtu.be/JBjFhAutIVk", name: "Manipule o Subconsciente", artist: "Infodose", cover: "https://img.youtube.com/vi/JBjFhAutIVk/hqdefault.jpg" },
  { type: "youtube", id: "hfQ1L6fCfAo", url: "https://youtu.be/hfQ1L6fCfAo", name: "A Deriva no Espaço da Mente", artist: "Infodose", cover: "https://img.youtube.com/vi/hfQ1L6fCfAo/hqdefault.jpg" },
  { type: "youtube", id: "DTDfkHwuMic", url: "https://youtu.be/DTDfkHwuMic", name: "Navegando no Universo", artist: "Infodose", cover: "https://img.youtube.com/vi/DTDfkHwuMic/hqdefault.jpg" },
  { type: "youtube", id: "OVfqxW_Xlhw", url: "https://youtu.be/OVfqxW_Xlhw", name: "Sinfonia Criativa", artist: "Infodose", cover: "https://img.youtube.com/vi/OVfqxW_Xlhw/hqdefault.jpg" },
  // Playlist
  { type: "youtube_playlist", playlistId: "PL_XiIUPFx4DSKFuJZZiKCxVUy20PtDdaB", url: "https://youtube.com/playlist?list=PL_XiIUPFx4DSKFuJZZiKCxVUy20PtDdaB", name: "Playlist • Se chegou até você", artist: "Infodose", cover: "https://img.youtube.com/vi/Bt_rLbMjJDk/hqdefault.jpg" },
  // SoundCloud
  { type: "soundcloud", url: "https://on.soundcloud.com/ZaS4eux4tmpD0jSnyp", name: "SoundCloud única", artist: "Infodose", cover: "https://i1.sndcdn.com/artworks-default-t500x500.jpg" }
];

window.KOBLLUX_ARCHETYPES = {
  CADIAL_ARQUETIPOS,
  PRELOADED
};


//====================================================
// https://www.infodose.com.br/NL/NL--MAIN/player/js/player-0.js
//====================================================

(function(global) {
  "use strict";

  // Dependências (definidas globalmente)
  const ARCHETYPES = global.KOBLLUX_ARCHETYPES?.CADIAL_ARQUETIPOS || [];
  const PRELOADED = global.KOBLLUX_ARCHETYPES?.PRELOADED || [];
  const DB = global.KOBLLUX_DB;

  // IDs do sistema
  const ALL_ID       = "all";
  const FAVORITES_ID = "favorites";

  // Estado do player
  let state = {
    db: null,
    currentTrackId: null,
    isPlaying: false,
    activeEngine: null,
    ytPlayer: null,
    scWidget: null,
    ytReady: false,
    widgetState: "ball",
    isDragging: false,
    currentX: window.innerWidth - 60,
    currentY: window.innerHeight - 150
  };

  // DOM refs
  let dom = {};

  // ── UTILITÁRIO PARA GERAR SVG INLINE ────────────────────────────
  function createIconHTML(iconName, extraClasses = '') {
    // iconName sem o prefixo "kx-"
    return `<svg class="kx-icon ${extraClasses}" aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" width="1em" height="1em"><use href="#kx-${iconName}"/></svg>`;
  }

  function initDOM() {
    dom.widget = document.getElementById("kodux-widget");
    dom.ball = document.getElementById("content-ball");
    dom.preview = document.getElementById("content-preview");
    dom.footer = document.getElementById("content-footer");
    dom.full = document.getElementById("content-full");
    dom.ytContainer = document.getElementById("yt-container");
    dom.scContainer = document.getElementById("sc-container");
    dom.audio = document.getElementById("local-audio");
    dom.prevCover = document.getElementById("prev-cover");
    dom.prevTitle = document.getElementById("prev-title");
    dom.prevArtist = document.getElementById("prev-artist");
    dom.footCover = document.getElementById("foot-cover");
    dom.footTitle = document.getElementById("foot-title");
    dom.footArtist = document.getElementById("foot-artist");
    dom.mainCover = document.getElementById("main-cover");
    dom.mainTitle = document.getElementById("main-title");
    dom.mainArtist = document.getElementById("main-artist");
    dom.footerProgress = document.getElementById("footer-progress-bar");
    dom.mainProgress = document.getElementById("main-progress");
    dom.playlistTabs = document.getElementById("playlist-tabs");
    dom.destinationSelect = document.getElementById("destination-select");
    dom.playlistContainer = document.getElementById("playlist-container");
    dom.linkInput = document.getElementById("link-input");
    dom.newPlaylistInput = document.getElementById("new-playlist-input");
    dom.prevPlayIcon = document.getElementById("prev-play-icon");
    dom.footPlayIcon = document.getElementById("foot-play-icon");
    dom.mainPlayIcon = document.getElementById("main-play-icon");
  }

  // ── UTILITÁRIOS ────────────────────────────────────────────────────
  function uid(prefix = "trk") {
    return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
  }

  function normalizeUrl(rawUrl) {
    return DB.normalizeUrl ? DB.normalizeUrl(rawUrl) : rawUrl;
  }

  function extractYouTubeId(rawUrl) {
    return DB.extractYouTubeId ? DB.extractYouTubeId(rawUrl) : null;
  }

  function extractYouTubePlaylistId(rawUrl) {
    return DB.extractYouTubePlaylistId ? DB.extractYouTubePlaylistId(rawUrl) : null;
  }

  function normalizeTrack(track) {
    return DB.normalizeTrack ? DB.normalizeTrack(track) : track;
  }

  // ── DB WRAPPER ─────────────────────────────────────────────────────
  function getPlaylistById(id) {
    return state.db.playlists.find(p => p.id === id) || null;
  }
  function getActivePlaylist() {
    return getPlaylistById(state.db.activePlaylistId) || getPlaylistById(ALL_ID);
  }
  function getTrackById(id) {
    return state.db.library.find(t => t.id === id) || null;
  }
  function getVisibleTracks() {
    const active = getActivePlaylist();
    if (!active || active.id === ALL_ID) return state.db.library.slice();
    if (active.id === FAVORITES_ID)      return state.db.library.filter(t => t.favorite);
    return (active.trackIds || []).map(getTrackById).filter(Boolean);
  }

  // ── RENDER ───────────────────────────────────────────────────────
  function syncPreviewAndMain(track) {
    const fills = [
      { title: dom.prevTitle, artist: dom.prevArtist, cover: dom.prevCover },
      { title: dom.footTitle, artist: dom.footArtist, cover: dom.footCover },
      { title: dom.mainTitle, artist: dom.mainArtist, cover: dom.mainCover }
    ];
    fills.forEach(({ title, artist, cover }) => {
      if (title)  title.innerText  = track?.name   || "Oráculo";
      if (artist) artist.innerText = track?.artist  || "Sistema KODUX";
      if (cover)  cover.src        = track?.cover   || "https://picsum.photos/100";
    });
  }

  function syncIcons() {
    // Atualiza os SVGs de play/pause
    const iconName = state.isPlaying ? 'pause-circle' : 'play-circle';
    const iconSimple = state.isPlaying ? 'pause' : 'play';

    [dom.prevPlayIcon, dom.footPlayIcon].forEach(el => {
      if (el) {
        const use = el.querySelector('use');
        if (use) use.setAttribute('href', `#kx-${iconName}`);
        // Mantém classes extras (ex: text-4xl) já existentes no elemento
      }
    });

    if (dom.mainPlayIcon) {
      const use = dom.mainPlayIcon.querySelector('use');
      if (use) use.setAttribute('href', `#kx-${iconSimple}`);
      // Ajusta classe ml-1 se necessário (já está no HTML)
    }
  }

  function renderTabs() {
    if (!dom.playlistTabs) return;
    dom.playlistTabs.innerHTML = "";
    const ordered = [
      getPlaylistById(ALL_ID),
      getPlaylistById(FAVORITES_ID),
      ...state.db.playlists.filter(p => !p.system && p.id !== ALL_ID && p.id !== FAVORITES_ID)
    ].filter(Boolean);

    ordered.forEach(pl => {
      const visibleCount = pl.id === ALL_ID ? state.db.library.length :
                           pl.id === FAVORITES_ID ? state.db.library.filter(t => t.favorite).length :
                           (pl.trackIds || []).length;
      const btn = document.createElement("button");
      const isCadial = !!pl.cadial;
      let iconName;
      if (pl.id === ALL_ID) iconName = 'stack';
      else if (pl.id === FAVORITES_ID) iconName = 'heart';
      else if (isCadial) iconName = 'spiral';
      else iconName = 'playlist';

      if (isCadial) btn.title = `[${pl.cadial.opcode}] ${pl.cadial.essencia} · ${pl.cadial.hz}Hz`;
      btn.className = `mini-chip ${state.db.activePlaylistId === pl.id ? "active" : ""} ${isCadial ? "cadial-chip" : ""}`;
      btn.onclick = () => setActivePlaylist(pl.id);

      // Monta o innerHTML com SVG inline
      btn.innerHTML = `
        ${createIconHTML(iconName)}
        <span>${pl.name}</span>
        <span class="opacity-60">(${visibleCount})</span>
      `;
      dom.playlistTabs.appendChild(btn);

      // Botão de deletar (apenas playlists não-sistema)
      if (!pl.system && pl.id !== ALL_ID && pl.id !== FAVORITES_ID) {
        const del = document.createElement("button");
        del.className = "mini-chip";
        del.style.padding = "0.55rem 0.7rem";
        del.title = "Remover playlist";
        del.onclick = (e) => { e.stopPropagation(); deletePlaylist(pl.id); };
        del.innerHTML = createIconHTML('trash');
        dom.playlistTabs.appendChild(del);
      }
    });
  }

  function renderDestinationSelect() {
    if (!dom.destinationSelect) return;
    const prev = dom.destinationSelect.value || state.db.activePlaylistId || ALL_ID;
    const custom = state.db.playlists.filter(p => !p.system && p.id !== ALL_ID && p.id !== FAVORITES_ID);
    dom.destinationSelect.innerHTML =
      `<option value="${ALL_ID}">Todas</option>` +
      `<option value="${FAVORITES_ID}">Favoritos</option>` +
      custom.map(p => `<option value="${p.id}">${p.name}</option>`).join("");
    if ([ALL_ID, FAVORITES_ID, ...custom.map(p => p.id)].includes(prev)) dom.destinationSelect.value = prev;
    else dom.destinationSelect.value = state.db.activePlaylistId || ALL_ID;
  }

  function renderPlaylist() {
    if (!dom.playlistContainer) return;
    const visible = getVisibleTracks();
    const active = getActivePlaylist();
    dom.playlistContainer.innerHTML = "";

    if (active?.cadial) {
      const banner = document.createElement("div");
      banner.className = "p-4 rounded-2xl border border-white/10 bg-white/5 mb-3";
      banner.innerHTML = `
        <p class="text-[10px] text-[var(--muted)] uppercase tracking-widest mb-1">
          ${active.cadial.opcode} · D${active.cadial.rung} · ${active.cadial.hz}Hz
        </p>
        <p class="text-xs text-white font-semibold">${active.cadial.essencia}</p>
        <p class="text-[10px] text-[var(--muted)] italic mt-1">"${active.cadial.frase}"</p>
      `;
      dom.playlistContainer.appendChild(banner);
    }

    if (!visible.length) {
      const empty = document.createElement("div");
      empty.className = "p-5 rounded-2xl border border-white/10 bg-white/5 text-center";
      empty.innerHTML = `
        <div class="text-[var(--primary)] text-3xl mb-2">${createIconHTML('disc')}</div>
        <h4 class="text-sm font-bold text-white mb-1">Sem faixas aqui</h4>
        <p class="text-[11px] text-[var(--muted)]">Adicione um link, crie uma playlist ou marque favoritos.</p>
      `;
      dom.playlistContainer.appendChild(empty);
      return;
    }

    visible.forEach(t => {
      const activeItem = t.id === state.currentTrackId;
      const item = document.createElement("div");
      item.className = `flex items-center gap-3 p-3 rounded-2xl cursor-pointer transition ${
        activeItem ? "bg-[var(--primary)]/20 border border-[var(--primary)]/30" : "bg-white/5 hover:bg-white/10"
      }`;

      // Ícones com SVG inline
      const favIcon = t.favorite ? 'heart-fill' : 'heart';
      const favClass = t.favorite ? 'active' : '';
      const waveformHTML = activeItem && state.isPlaying ? createIconHTML('waveform') : '';

      item.innerHTML = `
        <img src="${t.cover}" class="w-10 h-10 rounded-lg object-cover border border-white/10">
        <div class="flex-1 overflow-hidden min-w-0">
          <h5 class="text-xs font-bold text-white truncate">${t.name}</h5>
          <p class="text-[10px] text-[var(--muted)] truncate">${t.artist}</p>
          ${t.cadial ? `<p class="text-[9px] text-[var(--primary)] truncate">${t.cadial}</p>` : ""}
        </div>
        <button class="item-action fav ${favClass}" title="Favoritar"
          onclick="event.stopPropagation(); toggleFavorite('${t.id}')">
          ${createIconHTML(favIcon)}
        </button>
        <button class="item-action add" title="Adicionar à playlist escolhida"
          onclick="event.stopPropagation(); quickAddToSelectedPlaylist('${t.id}')">
          ${createIconHTML('plus')}
        </button>
        <button class="item-action" title="Excluir"
          onclick="event.stopPropagation(); removeTrack('${t.id}')">
          ${createIconHTML('trash')}
        </button>
        ${activeItem && state.isPlaying ? `<span class="ml-1">${waveformHTML}</span>` : ""}
      `;
      item.onclick = () => loadAndPlayById(t.id);
      dom.playlistContainer.appendChild(item);
    });
  }

  function renderEverything() {
    renderTabs();
    renderDestinationSelect();
    renderPlaylist();
    const current = state.currentTrackId ? getTrackById(state.currentTrackId) : null;
    syncPreviewAndMain(current);
    syncIcons();
  }

  // ── WIDGET STATE ─────────────────────────────────────────────────
  function updateWidgetState(newState) {
    if (!dom.widget) return;
    state.widgetState = newState;
    dom.widget.className = `state-${newState}`;
    const contents = { ball: dom.ball, preview: dom.preview, footer: dom.footer, full: dom.full };
    Object.values(contents).forEach(el => { if (el) el.classList.add("hidden-content"); });
    if (contents[newState]) contents[newState].classList.remove("hidden-content");

    if (newState === "ball") {
      dom.widget.style.left = `${state.currentX}px`;
      dom.widget.style.top = `${state.currentY}px`;
      dom.widget.style.transform = "none";
      dom.widget.style.bottom = "auto";
      dom.widget.style.width = "";
      dom.widget.style.height = "";
    } else if (newState === "preview") {
      dom.widget.style.left = state.currentX < window.innerWidth/2 ? "10px" : `${window.innerWidth - 250}px`;
      dom.widget.style.top = `${state.currentY}px`;
      dom.widget.style.transform = "none";
      dom.widget.style.bottom = "auto";
      dom.widget.style.width = "240px";
      dom.widget.style.height = "60px";
    } else if (newState === "full") {
      dom.widget.style.left = "50%";
      dom.widget.style.top = "50%";
      dom.widget.style.transform = "translate(-50%, -50%)";
      dom.widget.style.bottom = "auto";
      dom.widget.style.width = "min(90vw, 600px)";
      dom.widget.style.height = "min(80vh, 700px)";
    } else if (newState === "footer") {
      dom.widget.style.transform = "none";
      dom.widget.style.left = "0";
      dom.widget.style.top = "auto";
      dom.widget.style.bottom = "0";
      dom.widget.style.width = "100%";
      dom.widget.style.height = "80px";
    }
  }

  function initDrag() {
    if (!dom.widget) return;
    const handleEls = [dom.ball, ...document.querySelectorAll(".drag-header")].filter(Boolean);
    let initialX = 0, initialY = 0, dragStartY = 0;

    const onStart = (e) => {
      if (state.widgetState === "full" || e.target.closest("button, input, select, textarea")) return;
      state.isDragging = false;
      const touch = e.type === "touchstart" ? e.touches[0] : e;
      initialX = touch.clientX - state.currentX;
      initialY = touch.clientY - state.currentY;
      dragStartY = touch.clientY;
      dom.widget.style.transition = "none";
      document.addEventListener("mousemove", onMove);
      document.addEventListener("mouseup", onEnd);
      document.addEventListener("touchmove", onMove, { passive: false });
      document.addEventListener("touchend", onEnd);
    };
    const onMove = (e) => {
      state.isDragging = true;
      e.preventDefault();
      const touch = e.type === "touchmove" ? e.touches[0] : e;
      state.currentX = touch.clientX - initialX;
      state.currentY = touch.clientY - initialY;
      dom.widget.style.left = `${state.currentX}px`;
      dom.widget.style.top = `${state.currentY}px`;
    };
    const onEnd = () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onEnd);
      document.removeEventListener("touchmove", onMove);
      document.removeEventListener("touchend", onEnd);
      dom.widget.style.transition = "";
      const deltaY = dragStartY - state.currentY;
      if (deltaY > 50 && state.widgetState === "ball") {
        updateWidgetState("preview");
      } else if (state.currentY > window.innerHeight - 120) {
        updateWidgetState("footer");
      } else if (state.isDragging) {
        updateWidgetState("ball");
      }
    };
    handleEls.forEach(h => {
      h.addEventListener("mousedown", onStart);
      h.addEventListener("touchstart", onStart);
    });
  }

  // ── PLAYBACK ─────────────────────────────────────────────────────
  function ensureYTPlayer() {
    if (state.ytPlayer) {
      if (state.ytReady) {
        return state.ytPlayer;
      }
      return state.ytPlayer;
    }

    if (!dom.ytContainer) {
      console.warn("YT container não encontrado");
      return null;
    }

    state.ytReady = false;
    state.ytPlayer = new YT.Player(dom.ytContainer, {
      height: "100%",
      width: "100%",
      videoId: "",
      playerVars: {
        autoplay: 0,
        playsinline: 1,
        modestbranding: 1,
        rel: 0
      },
      events: {
        onReady: (e) => {
          console.log("YouTube player ready");
          state.ytReady = true;
          if (state.pendingTrackId) {
            const track = getTrackById(state.pendingTrackId);
            if (track) {
              loadAndPlayById(state.pendingTrackId);
              state.pendingTrackId = null;
            }
          }
          syncIcons();
        },
        onStateChange: (e) => {
          if (e.data === YT.PlayerState.ENDED) {
            playNext();
          }
          state.isPlaying = (e.data === YT.PlayerState.PLAYING);
          syncIcons();
        },
        onError: (e) => {
          console.error("YouTube player error:", e);
          state.ytReady = false;
        }
      }
    });

    return state.ytPlayer;
  }

  function playYT(track) {
    if (!track) return;

    if (!state.ytReady) {
      state.pendingTrackId = track.id;
      if (!state.ytPlayer) {
        ensureYTPlayer();
      }
      return;
    }

    const player = state.ytPlayer;
    if (!player) {
      console.warn("Player não disponível");
      return;
    }

    try {
      if (track.type === "youtube_playlist" && track.playlistId) {
        player.loadPlaylist({ list: track.playlistId, index: 0 });
      } else {
        player.loadVideoById(track.id);
      }
      player.playVideo();
      state.isPlaying = true;
    } catch (e) {
      console.error("Erro ao carregar vídeo YouTube:", e);
      state.ytReady = false;
      state.ytPlayer = null;
      state.pendingTrackId = track.id;
      ensureYTPlayer();
    }
    syncIcons();
  }

  function playSC(url) {
    if (!dom.scContainer) return;

    dom.scContainer.innerHTML = '';

    const iframe = document.createElement('iframe');
    iframe.id = 'sc-frame';
    iframe.allow = 'autoplay';
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.border = 'none';
    iframe.src = `https://w.soundcloud.com/player/?url=${encodeURIComponent(url)}&auto_play=true&hide_related=true&show_comments=false&show_user=false&show_reposts=false&visual=false`;
    
    dom.scContainer.appendChild(iframe);

    state.scWidget = SC.Widget('sc-frame');
    
    state.scWidget.bind(SC.Widget.Events.READY, () => {
      state.scWidget.play();
      state.isPlaying = true;
      syncIcons();
    });
    state.scWidget.bind(SC.Widget.Events.FINISH, () => playNext());
    state.scWidget.bind(SC.Widget.Events.PLAY, () => {
      state.isPlaying = true;
      syncIcons();
    });
    state.scWidget.bind(SC.Widget.Events.PAUSE, () => {
      state.isPlaying = false;
      syncIcons();
    });
    state.scWidget.bind(SC.Widget.Events.ERROR, (e) => {
      console.error('Erro no widget SoundCloud:', e);
      setTimeout(() => {
        if (dom.scContainer) {
          dom.scContainer.innerHTML = '';
          playSC(url);
        }
      }, 1000);
    });
  }

  function loadAndPlayById(trackId) {
    const track = getTrackById(trackId);
    if (!track) return;

    state.currentTrackId = trackId;
    state.activeEngine = track.type;

    try { dom.audio?.pause(); dom.audio?.removeAttribute('src'); dom.audio?.load(); } catch(e) {}
    try { if (state.ytPlayer && state.ytPlayer.pauseVideo) state.ytPlayer.pauseVideo(); } catch(e) {}
    try { 
      if (state.scWidget) {
        state.scWidget.pause();
        if (dom.scContainer) dom.scContainer.innerHTML = '';
      }
    } catch(e) {}

    syncPreviewAndMain(track);

    if (track.type === "youtube" || track.type === "youtube_playlist") {
      if (typeof YT === 'undefined' || typeof YT.Player === 'undefined') {
        console.warn("API YouTube não carregada, aguardando...");
        setTimeout(() => loadAndPlayById(trackId), 300);
        return;
      }
      ensureYTPlayer();
      playYT(track);
    } else if (track.type === "soundcloud") {
      playSC(track.url);
    } else if (track.type === "local") {
      if (!dom.audio) return;
      const src = track.blob ? URL.createObjectURL(track.blob) : track.url;
      dom.audio.src = src;
      dom.audio.play().catch(() => alert("Clique em Play para iniciar o áudio local (bloqueio do navegador)."));
      state.isPlaying = true;
      syncIcons();
    }

    renderEverything();
  }

  function togglePlay(e) {
    if (e) e.stopPropagation();
    const visible = getVisibleTracks();
    if (!visible.length) return;
    if (!state.currentTrackId) { loadAndPlayById(visible[0].id); return; }
    const current = getTrackById(state.currentTrackId);
    if (!current) { loadAndPlayById(visible[0].id); return; }

    if (state.isPlaying) {
      if (state.activeEngine === "youtube" && state.ytPlayer && state.ytReady) {
        try { state.ytPlayer.pauseVideo(); } catch(e) {}
      } else if (state.activeEngine === "soundcloud" && state.scWidget) {
        state.scWidget.pause();
      } else {
        dom.audio?.pause();
      }
      state.isPlaying = false;
    } else {
      if (state.activeEngine === "youtube" && state.ytPlayer && state.ytReady) {
        try { state.ytPlayer.playVideo(); } catch(e) {}
      } else if (state.activeEngine === "soundcloud" && state.scWidget) {
        state.scWidget.play();
      } else {
        dom.audio?.play();
      }
      state.isPlaying = true;
    }
    syncIcons();
  }

  function playNext() {
    const visible = getVisibleTracks();
    if (!visible.length) return;
    const idx = state.currentTrackId ? visible.findIndex(t => t.id === state.currentTrackId) : -1;
    const next = visible[(idx + 1) % visible.length];
    if (next) loadAndPlayById(next.id);
  }

  function playPrev() {
    const visible = getVisibleTracks();
    if (!visible.length) return;
    const idx = state.currentTrackId ? visible.findIndex(t => t.id === state.currentTrackId) : 0;
    const prev = visible[(idx - 1 + visible.length) % visible.length];
    if (prev) loadAndPlayById(prev.id);
  }

  // ── PLAYLIST MANAGEMENT ──────────────────────────────────────────
  function setActivePlaylist(id) {
    state.db.activePlaylistId = id;
    DB.save(state.db);
    renderEverything();
  }

  function createPlaylist() {
    if (!dom.newPlaylistInput) return;
    const name = dom.newPlaylistInput.value.trim();
    if (!name) return;
    const exists = state.db.playlists.some(p => p.name.toLowerCase() === name.toLowerCase());
    if (exists) return alert("Já existe uma playlist com esse nome.");
    state.db.playlists.push({ id: uid("pl"), name, system: false, trackIds: [], cadial: null });
    dom.newPlaylistInput.value = "";
    DB.save(state.db);
    renderEverything();
  }

  function deletePlaylist(playlistId) {
    const playlist = getPlaylistById(playlistId);
    if (!playlist || playlist.system) return;
    if (!confirm(`Remover a playlist "${playlist.name}"?`)) return;
    state.db.playlists = state.db.playlists.filter(p => p.id !== playlistId);
    if (state.db.activePlaylistId === playlistId) state.db.activePlaylistId = ALL_ID;
    DB.save(state.db);
    renderEverything();
  }

  function toggleFavorite(trackId) {
    const track = getTrackById(trackId);
    if (!track) return;
    track.favorite = !track.favorite;
    DB.save(state.db);
    renderEverything();
  }

  function addTrackToPlaylist(trackId, playlistId) {
    const playlist = getPlaylistById(playlistId);
    const track = getTrackById(trackId);
    if (!track || !playlist) return;
    if (playlist.id === ALL_ID) {
      state.db.activePlaylistId = ALL_ID;
    } else if (playlist.id === FAVORITES_ID) {
      track.favorite = true;
      state.db.activePlaylistId = FAVORITES_ID;
    } else {
      if (!playlist.trackIds.includes(trackId)) playlist.trackIds.unshift(trackId);
      state.db.activePlaylistId = playlist.id;
    }
    DB.save(state.db);
    renderEverything();
  }

  function quickAddToSelectedPlaylist(trackId) {
    if (!dom.destinationSelect) return;
    addTrackToPlaylist(trackId, dom.destinationSelect.value);
  }

  function removeTrack(trackId) {
    const active = getActivePlaylist();
    const track = getTrackById(trackId);
    if (!track) return;
    if (active.id === FAVORITES_ID) {
      track.favorite = false;
    } else if (active.id === ALL_ID) {
      state.db.library = state.db.library.filter(t => t.id !== trackId);
      state.db.playlists.forEach(p => {
        if (Array.isArray(p.trackIds)) p.trackIds = p.trackIds.filter(id => id !== trackId);
      });
      if (state.currentTrackId === trackId) { state.currentTrackId = null; }
    } else {
      active.trackIds = (active.trackIds || []).filter(id => id !== trackId);
      if (state.currentTrackId === trackId) { state.currentTrackId = null; }
    }
    DB.save(state.db);
    renderEverything();
  }

  function findExistingTrackByUrl(url, type, id) {
    if (type === "youtube" && id) return state.db.library.find(t => t.type === "youtube" && t.id === id) || null;
    if (type === "youtube_playlist" && id) return state.db.library.find(t => t.type === "youtube_playlist" && t.playlistId === id) || null;
    if (type === "soundcloud") {
      const norm = normalizeUrl(url);
      return state.db.library.find(t => t.type === "soundcloud" && normalizeUrl(t.url) === norm) || null;
    }
    return state.db.library.find(t => normalizeUrl(t.url) === normalizeUrl(url)) || null;
  }

  function normalizeAndInsertToLibrary(track) {
    const normalized = normalizeTrack(track);
    const existing = findExistingTrackByUrl(normalized.url, normalized.type, normalized.id || normalized.playlistId);
    if (existing) {
      existing.name       = normalized.name       || existing.name;
      existing.artist     = normalized.artist     || existing.artist;
      existing.cover      = normalized.cover      || existing.cover;
      existing.playlistId = normalized.playlistId || existing.playlistId;
      if (normalized.type === "local" && normalized.blob) existing.blob = normalized.blob;
      return existing;
    }
    state.db.library.unshift(normalized);
    return normalized;
  }

  async function buildTrackFromUrl(url, base = {}) {
    const cleanUrl = normalizeUrl(url);
    if (!cleanUrl) throw new Error("Link vazio.");

    const track = {
      id:         base.id     || uid(),
      type:       base.type   || "local",
      url:        cleanUrl,
      name:       base.name   || "Carregando...",
      artist:     base.artist || "Web",
      cover:      base.cover  || "https://picsum.photos/100",
      blob:       base.blob   || null,
      favorite:   !!base.favorite,
      playlistId: base.playlistId || null,
      cadial:     base.cadial || null
    };

    const ytId     = extractYouTubeId(cleanUrl);
    const ytListId = extractYouTubePlaylistId(cleanUrl);
    const isYT = cleanUrl.includes("youtube.com") || cleanUrl.includes("youtu.be") || cleanUrl.includes("youtube-nocookie.com");
    const isSC = cleanUrl.includes("soundcloud.com") || cleanUrl.includes("on.soundcloud.com");

    if (isYT) {
      if (ytListId && !ytId) {
        track.type       = "youtube_playlist";
        track.playlistId = ytListId;
        track.name       = base.name   || "YouTube Playlist";
        track.artist     = base.artist || "YouTube";
        track.cover      = base.cover  || "https://picsum.photos/100";
        return normalizeTrack(track);
      }
      if (!ytId) throw new Error("Link YouTube inválido.");
      track.type  = "youtube";
      track.id    = ytId;
      track.cover = `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`;
      try {
        const res  = await fetch(`https://noembed.com/embed?url=${encodeURIComponent(cleanUrl)}`);
        const data = await res.json();
        track.name   = data.title       || base.name   || "YouTube Track";
        track.artist = data.author_name || base.artist || "YouTube";
      } catch (e) {
        track.name   = base.name   || "YouTube Track";
        track.artist = base.artist || "YouTube";
      }
    } else if (isSC) {
      track.type = "soundcloud";
      try {
        const res  = await fetch(`https://soundcloud.com/oembed?url=${encodeURIComponent(cleanUrl)}&format=json`);
        const data = await res.json();
        track.name   = data.title         || base.name   || "SoundCloud Track";
        track.artist = data.author_name   || base.artist || "SoundCloud";
        track.cover  = data.thumbnail_url || base.cover  || "https://i1.sndcdn.com/artworks-default-t500x500.jpg";
      } catch (e) {
        track.name   = base.name   || "SoundCloud Track";
        track.artist = base.artist || "SoundCloud";
        track.cover  = base.cover  || "https://i1.sndcdn.com/artworks-default-t500x500.jpg";
      }
    } else {
      track.type   = base.type   || "local";
      track.name   = base.name   || cleanUrl.split("/").pop() || "Arquivo local";
      track.artist = base.artist || "Local";
    }
    return normalizeTrack(track);
  }

  async function hydratePreloadedTracks() {
    const preloadedUrls = new Set(PRELOADED.map(t => normalizeUrl(t.url)));
    let changed = false;
    for (let i = 0; i < state.db.library.length; i++) {
      const tr = state.db.library[i];
      if (!preloadedUrls.has(normalizeUrl(tr.url))) continue;
      try {
        const fresh = await buildTrackFromUrl(tr.url, tr);
        state.db.library[i] = { ...tr, ...fresh, id: tr.id };
        changed = true;
      } catch (e) {}
    }
    if (changed) { DB.save(state.db); renderEverything(); }
  }

  async function addLink() {
    const input = dom.linkInput;
    const destination = dom.destinationSelect;
    if (!input || !destination) return;
    const url = normalizeUrl(input.value.trim());
    if (!url) return;
    let newTrack;
    try {
      newTrack = await buildTrackFromUrl(url);
    } catch (e) {
      return alert(e.message || "Não consegui ler esse link.");
    }
    const inserted = normalizeAndInsertToLibrary(newTrack);
    if (destination.value === FAVORITES_ID) {
      inserted.favorite = true;
    } else if (destination.value !== ALL_ID) {
      const playlist = getPlaylistById(destination.value);
      if (playlist && !playlist.trackIds.includes(inserted.id)) playlist.trackIds.unshift(inserted.id);
    }
    input.value = "";
    DB.save(state.db);
    renderEverything();
  }

  // ── EVENT HANDLERS ───────────────────────────────────────────────
  function openFullFromPreview(e) { if (e) e.stopPropagation(); updateWidgetState("full"); }
  function collapseToBall(e) { if (e) e.stopPropagation(); updateWidgetState("ball"); }
  function handleClickOutside(e) {
    if (state.widgetState === "preview" && dom.widget && !dom.widget.contains(e.target)) {
      updateWidgetState("ball");
    }
  }

  // ── INICIALIZAÇÃO ────────────────────────────────────────────────
  function initKoduxPlayer() {
    initDOM();
    if (!dom.widget) {
      console.warn("KODUX Player: widget não encontrado.");
      return;
    }

    state.db = DB.init(ARCHETYPES);

    global.openFullFromPreview = openFullFromPreview;
    global.updateWidgetState = updateWidgetState;
    global.togglePlay = togglePlay;
    global.playNext = playNext;
    global.playPrev = playPrev;
    global.addLink = addLink;
    global.collapseToBall = collapseToBall;
    global.toggleFavorite = toggleFavorite;
    global.removeTrack = removeTrack;
    global.quickAddToSelectedPlaylist = quickAddToSelectedPlaylist;
    global.createPlaylist = createPlaylist;

    global.onYouTubeIframeAPIReady = function() {
      console.log("YouTube API ready");
    };

    if (typeof YT === 'undefined' || typeof YT.Player === 'undefined') {
      if (!document.querySelector('script[src="https://www.youtube.com/iframe_api"]')) {
        const tag = document.createElement("script");
        tag.src = "https://www.youtube.com/iframe_api";
        document.head.appendChild(tag);
        console.log("YouTube API script carregado");
      }
    } else {
      if (typeof global.onYouTubeIframeAPIReady === 'function') {
        global.onYouTubeIframeAPIReady();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    dom.widget.addEventListener("click", (e) => {
      if (state.isDragging) return;
      if (state.widgetState === "ball") updateWidgetState("preview");
    });

    initDrag();
    renderEverything();
    updateWidgetState("ball");
    hydratePreloadedTracks();

    console.log("⚫ KODUX Player inicializado.");
  }

  global.initKoduxPlayer = initKoduxPlayer;

})(window);



//====================================================
// https://www.infodose.com.br/NL/NL--MAIN/player/js/idle.js
//====================================================

(function() {
  const bodyPlayer = document.getElementById('bodyPlayer');
  const idleSelector = '.kob-tts-dock, #kodux-widget, [data-idle-target]';
  let idleTimer = null;

  function getIdleTargets() {
    return document.querySelectorAll(idleSelector);
  }

  function setIdleState(isIdle) {
    getIdleTargets().forEach(el => el.classList.toggle('idle', isIdle));
  }

  function resetIdle() {
    setIdleState(false);
    clearTimeout(idleTimer);
    idleTimer = setTimeout(() => setIdleState(true), 1870);
  }

  function setMode(mode = 'player') {
    if (!bodyPlayer) return;
    bodyPlayer.dataset.mode = mode;
  }

  window.KoduxShell = {
    setMode,
    resetIdle
  };

  ['pointerdown', 'pointermove', 'touchstart', 'mousemove', 'scroll'].forEach(ev => {
    document.addEventListener(ev, resetIdle, { passive: true });
  });

  document.addEventListener('keydown', resetIdle);

  setMode(bodyPlayer?.dataset.mode || 'player');
  resetIdle();
})();

