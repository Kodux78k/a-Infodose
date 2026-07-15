const DB_NAME = "kodux_nl_db_v1";
const LEGACY_DB = "kodux_nl_db_legacy";

function createDefaultDB() {
  return {
    version: 1,
    checklist: [
      { id: "hotel", label: "Hotel / Pousada", emoji: "🏨", checked: false },
      { id: "cabeleireiro", label: "Cabeleireiro", emoji: "💇‍♀️", checked: false },
      { id: "maquiagem", label: "Maquiagem", emoji: "💄", checked: false },
      { id: "transporte", label: "Transporte (vans / carros)", emoji: "🚗", checked: false },
      { id: "fotografo", label: "Fotógrafo / Vídeo", emoji: "📸", checked: false },
      { id: "decoracao", label: "Decoração / Flores", emoji: "🌿", checked: false },
      { id: "musica", label: "Música / DJ", emoji: "🎵", checked: false },
      { id: "cerimonial", label: "Cerimonial / Assessoria", emoji: "🤵", checked: false }
    ],
    playerState: { currentTrackId: null, isPlaying: false }
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

function migrateLegacyIfNeeded() {
  const legacy = localStorage.getItem(LEGACY_DB);
  if (legacy) {
    try {
      const parsed = JSON.parse(legacy);
      const newDB = createDefaultDB();
      if (parsed && parsed.checklist) {
        newDB.checklist.forEach(item => {
          const legacyItem = parsed.checklist.find(li => li.id === item.id);
          if (legacyItem) item.checked = legacyItem.checked;
        });
      }
      saveDB(newDB);
      localStorage.removeItem(LEGACY_DB);
      return newDB;
    } catch (e) { return createDefaultDB(); }
  }
  return loadDB() || createDefaultDB();
}

window.KOBLLUX_DB = {
  init: migrateLegacyIfNeeded,
  load: loadDB,
  save: saveDB,
  createDefault: createDefaultDB
};