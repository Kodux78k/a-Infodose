// Player Database – usa KOBLLUX_PLAYER_DB para não conflitar com o checklist
const PLAYER_DB_NAME = "kodux-player-db-v3";
const PLAYER_LEGACY_DB = "kodux-player-db-legacy";

function playerUid(prefix = "trk") {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

function playerNormalizeUrl(rawUrl = "") {
  let url = String(rawUrl || "").trim();
  if (!url) return "";

  if (url.includes("soundcloud.com") || url.includes("on.soundcloud.com")) {
    try {
      const u = new URL(url);
      if (u.hostname.startsWith("m.")) u.hostname = u.hostname.replace(/^m\./, "");
      url = u.toString();
    } catch (e) {
      url = url.replace("://m.soundcloud.com", "://soundcloud.com");
    }
  }

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

function playerExtractYouTubeId(rawUrl = "") {
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

function playerExtractYouTubePlaylistId(rawUrl = "") {
  try {
    const u = new URL(rawUrl);
    return u.searchParams.get("list");
  } catch (e) {}
  const m = String(rawUrl).match(/[?&]list=([0-9A-Za-z_-]+)/);
  return m ? m[1] : null;
}

function playerNormalizeTrack(track) {
  return {
    id:         track.id || playerUid(),
    type:       track.type || "local",
    url:        playerNormalizeUrl(track.url || ""),
    name:       track.name || "Sem título",
    artist:     track.artist || "Web",
    cover:      track.cover || "https://picsum.photos/100",
    blob:       track.blob || null,
    favorite:   !!track.favorite,
    playlistId: track.playlistId || null,
    cadial:     track.cadial || null
  };
}

function playerCreateDefaultDB(arquetypes, preloaded) {
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
    library:         (preloaded || []).map(playerNormalizeTrack),
    playlists:       [...systemPlaylists, ...cadialPlaylists],
    activePlaylistId: ALL_ID
  };
}

function playerSaveDB(db) {
  try { localStorage.setItem(PLAYER_DB_NAME, JSON.stringify(db)); } 
  catch (e) { console.error("Erro ao salvar DB do player:", e); }
}

function playerLoadDB() {
  try {
    const raw = localStorage.getItem(PLAYER_DB_NAME);
    return raw ? JSON.parse(raw) : null;
  } catch (e) { return null; }
}

function playerEnsureSystemPlaylists(db, arquetypes) {
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

function playerMigrateLegacyIfNeeded(arquetypes) {
  const rawV3 = localStorage.getItem(PLAYER_DB_NAME);
  if (rawV3) {
    try {
      const parsed = JSON.parse(rawV3);
      parsed.library = (parsed.library || []).map(playerNormalizeTrack);
      parsed.playlists = (parsed.playlists || []).map(p => ({
        ...p,
        trackIds: Array.isArray(p.trackIds) ? p.trackIds.slice() : []
      }));
      return playerEnsureSystemPlaylists(parsed, arquetypes);
    } catch (e) {}
  }

  const legacy = localStorage.getItem(PLAYER_LEGACY_DB);
  if (legacy) {
    try {
      const parsed = JSON.parse(legacy);
      if (Array.isArray(parsed)) {
        const db = playerCreateDefaultDB(arquetypes, parsed);
        playerSaveDB(db);
        localStorage.removeItem(PLAYER_LEGACY_DB);
        return db;
      }
    } catch (e) {}
  }
  const db = playerCreateDefaultDB(arquetypes);
  return playerEnsureSystemPlaylists(db, arquetypes);
}

// Exporta com nome exclusivo para não conflitar com o checklist
window.KOBLLUX_PLAYER_DB = {
  init: function(arquetypes) {
    const db = playerMigrateLegacyIfNeeded(arquetypes);
    playerSaveDB(db);
    return db;
  },
  load: playerLoadDB,
  save: playerSaveDB,
  createDefault: playerCreateDefaultDB,
  ensureSystemPlaylists: playerEnsureSystemPlaylists,
  normalizeTrack: playerNormalizeTrack,
  normalizeUrl: playerNormalizeUrl,
  extractYouTubeId: playerExtractYouTubeId,
  extractYouTubePlaylistId: playerExtractYouTubePlaylistId,
  uid: playerUid
};