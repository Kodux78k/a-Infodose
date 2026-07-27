//====================================================
// https://www.infodose.com.br/NL/NL--MAIN/player/js/db.js
//====================================================

const DB_NAME = "di_kodux-ss-db-v3";

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

function initDB(arquetypes, preloaded) {
  const rawV3 = localStorage.getItem(DB_NAME);
  let db;

  if (rawV3) {
    try {
      db = JSON.parse(rawV3);
      db.library = (db.library || []).map(normalizeTrack);
      db.playlists = (db.playlists || []).map(p => ({
        ...p,
        trackIds: Array.isArray(p.trackIds) ? p.trackIds.slice() : []
      }));
      db = ensureSystemPlaylists(db, arquetypes);

      // Sincroniza forçadamente o preLoaded atualizado para não ficar preso em cache antigo
      const libraryUrls = new Set(db.library.map(t => normalizeUrl(t.url)));
      (preloaded || []).forEach(pTrack => {
        const normTrack = normalizeTrack(pTrack);
        if (!libraryUrls.has(normTrack.url)) {
          db.library.push(normTrack);
        } else {
          // Atualiza dados caso o nome/artista tenham mudado no arquivo preLoaded.js
          const existing = db.library.find(t => normalizeUrl(t.url) === normTrack.url);
          if (existing) {
            existing.name = normTrack.name;
            existing.artist = normTrack.artist;
            existing.cover = normTrack.cover;
          }
        }
      });
    } catch (e) {
      db = createDefaultDB(arquetypes, preloaded);
      db = ensureSystemPlaylists(db, arquetypes);
    }
  } else {
    db = createDefaultDB(arquetypes, preloaded);
    db = ensureSystemPlaylists(db, arquetypes);
  }

  saveDB(db);
  return db;
}

window.KOBLLUX_DB = {
  init: function(arquetypes, preloaded) {
    const db = initDB(arquetypes, preloaded);
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
