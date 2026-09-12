/* ============================================================
   ∆³ VOZ · SUHUBUNO · LEGADO
   ------------------------------------------------------------
   Fonte de verdade:
   LEGADO[id].voice + LEGADO[id].lang + speechLang

   fallback:
   1. vozes alternativas reais do LEGADO
   2. aliases/nome conhecidos
   3. idioma da voz
   4. idioma de fala (speechLang), quando existir

   Hz + peso continuam sendo o mapa vibracional.
   ============================================================ */

const VOZ = {

  /* ─────────────────────────────
     NÚCLEO
     ───────────────────────────── */

  KOBLLUX: {
    nome: "Luciana",
    lang: "pt-BR",
    sotaque: "nativo",
    genero: "f",
    hz: 369,
    peso: 0.77,
    fallback: [
      "Luciana",
      "Joana",
      "Monica",
      "Paulina",
      "pt-BR",
      "pt"
    ]
  },

  KODUX: {
    nome: "Rocko",
    lang: "pt-BR",
    sotaque: "grave / comando",
    genero: "m",
    hz: 432,
    peso: 0.18,
    fallback: [
      "Rocko",
      "Daniel",
      "Reed",
      "Satu",
      "pt-BR",
      "pt"
    ]
  },

  UNO: {
    nome: "Grandma",
    lang: "en-US",
    sotaque: "inglês",
    genero: "f",
    hz: 369,
    peso: 0.30,
    fallback: [
      "Grandma",
      "Sandy",
      "Shelley",
      "Daniel",
      "en-US",
      "en"
    ]
  },

  DUAL: {
    nome: "Luciana",
    lang: "pt-BR",
    sotaque: "nativo / espelho",
    genero: "f",
    hz: 528,
    peso: 0.36,
    fallback: [
      "Luciana",
      "Joana",
      "Monica",
      "Paulina",
      "pt-BR",
      "pt"
    ]
  },

  TRINITY: {
    nome: "Sandy",
    lang: "en-US",
    sotaque: "inglês",
    genero: "f",
    hz: 639,
    peso: 0.42,
    fallback: [
      "Sandy",
      "Grandma",
      "Shelley",
      "Nora",
      "en-US",
      "en"
    ]
  },

  INFODOSE: {
    nome: "Luciana",
    lang: "pt-BR",
    sotaque: "nativo / didático",
    genero: "f",
    hz: 528,
    peso: 0.50,
    fallback: [
      "Luciana",
      "Joana",
      "Paulina",
      "Monica",
      "pt-BR",
      "pt"
    ]
  },

  /* ─────────────────────────────
     369 · GERAL
     ───────────────────────────── */

  ATLAS: {
    nome: "Daniel",
    lang: "en-US",
    sotaque: "inglês",
    genero: "m",
    hz: 396,
    peso: 0.18,
    fallback: [
      "Daniel",
      "Eloh",
      "K_Dion",
      "Rocko",
      "en-US",
      "en-GB",
      "en"
    ]
  },

  NOVA: {
    nome: "Luciana",
    lang: "pt-BR",
    sotaque: "nativo",
    genero: "f",
    hz: 528,
    peso: 0.12,
    fallback: [
      "Luciana",
      "Joana",
      "Monica",
      "Paulina",
      "pt-BR",
      "pt"
    ]
  },

  VITALIS: {
    nome: "Rocko",
    lang: "pt-BR",
    sotaque: "grave / energético",
    genero: "m",
    hz: 528,
    peso: 0.14,
    fallback: [
      "Rocko",
      "KODUX",
      "Daniel",
      "Reed",
      "pt-BR",
      "pt"
    ]
  },

  PULSE: {
    nome: "Monica",
    lang: "es-ES",
    sotaque: "espanhol",
    genero: "f",
    hz: 432,
    peso: 0.10,
    fallback: [
      "Monica",
      "Paulina",
      "Alice",
      "Sara",
      "es-ES",
      "es",
      "pt-BR"
    ]
  },

  ARTEMIS: {
    nome: "Paulina",
    lang: "es-MX",
    sotaque: "espanhol",
    genero: "f",
    hz: 528,
    peso: 0.08,
    fallback: [
      "Paulina",
      "Monica",
      "Naira",
      "Luciana",
      "es-MX",
      "es",
      "pt-BR"
    ]
  },

  SERENA: {
    nome: "Joana",
    lang: "pt-BR",
    sotaque: "português",
    genero: "f",
    hz: 639,
    peso: 0.10,
    fallback: [
      "Joana",
      "Luciana",
      "Paulina",
      "Alice",
      "pt-BR",
      "pt"
    ]
  },

  KAOS: {
    nome: "Rocko",
    lang: "pt-BR",
    sotaque: "grave / disruptivo",
    genero: "m",
    hz: 396,
    peso: 0.05,
    fallback: [
      "Rocko",
      "Rishi",
      "Daniel",
      "Satu",
      "pt-BR",
      "en-IN",
      "en"
    ]
  },

  GENUS: {
    nome: "Reed",
    lang: "pt-BR",
    sotaque: "grave / técnico",
    genero: "m",
    hz: 741,
    peso: 0.12,
    fallback: [
      "Reed",
      "Rocko",
      "Daniel",
      "Satu",
      "pt-BR",
      "pt"
    ]
  },

  LUMINE: {
    nome: "Flo",
    lang: "fr-FR",
    sotaque: "francês",
    genero: "f",
    hz: 528,
    peso: 0.06,
    fallback: [
      "Flo",
      "Alice",
      "Moira",
      "Luciana",
      "fr-FR",
      "fr",
      "pt-BR"
    ]
  },

  RHEA: {
    nome: "Alice",
    lang: "it-IT",
    sotaque: "italiano",
    genero: "f",
    hz: 528,
    peso: 0.03,
    fallback: [
      "Alice",
      "Joana",
      "Luciana",
      "Sara",
      "it-IT",
      "it",
      "pt-BR"
    ]
  },

  SOLUS: {
    nome: "Satu",
    lang: "fi-FI",
    sotaque: "finlandês",
    genero: "m",
    hz: 741,
    peso: 0.01,
    fallback: [
      "Satu",
      "Onni",
      "Daniel",
      "Reed",
      "fi-FI",
      "fi",
      "en"
    ]
  },

  AION: {
    nome: "Milena",
    lang: "ru-RU",
    sotaque: "russo",
    genero: "f",
    hz: 741,
    peso: 0.01,
    fallback: [
      "Milena",
      "Alva",
      "Satu",
      "Nora",
      "ru-RU",
      "ru",
      "en"
    ]
  },

  JESUS: {
    nome: "Sara",
    lang: "da-DK",
    speechLang: "pt-BR",
    sotaque: "dinamarquês / português",
    genero: "f",
    hz: 777,
    peso: 1.00,
    fallback: [
      "Sara",
      "Joana",
      "Luciana",
      "Paulina",
      "da-DK",
      "pt-BR",
      "pt"
    ]
  },

  HORUS: {
    nome: "Montse",
    lang: "ca-ES",
    sotaque: "catalão",
    genero: "f",
    hz: 741,
    peso: 0.20,
    fallback: [
      "Montse",
      "Alice",
      "Paulina",
      "Sara",
      "ca-ES",
      "es",
      "pt-BR"
    ]
  },

  BLUE: {
    nome: "Monica",
    lang: "es-ES",
    sotaque: "espanhol",
    genero: "f",
    hz: 528,
    peso: 0.12,
    fallback: [
      "Monica",
      "Paulina",
      "Joana",
      "Luciana",
      "es-ES",
      "es",
      "pt-BR"
    ]
  },

  BLLUE: {
    nome: "Zuzana",
    lang: "cs-CZ",
    sotaque: "tcheco",
    genero: "f",
    hz: 528,
    peso: 0.12,
    fallback: [
      "Zuzana",
      "Alva",
      "Sara",
      "Luciana",
      "cs-CZ",
      "cs",
      "pt-BR"
    ]
  },

  MINUZ: {
    nome: "Rishi",
    lang: "en-IN",
    sotaque: "inglês indiano",
    genero: "m",
    hz: 396,
    peso: 0.04,
    fallback: [
      "Rishi",
      "Daniel",
      "Rocko",
      "K_Dion",
      "en-IN",
      "en"
    ]
  },

  HANAH: {
    nome: "Ioana",
    lang: "ro-RO",
    sotaque: "romeno",
    genero: "f",
    hz: 432,
    peso: 0.04,
    fallback: [
      "Ioana",
      "Alva",
      "Alice",
      "Sara",
      "ro-RO",
      "ro",
      "pt-BR"
    ]
  },

  KD1: {
    nome: "Satu",
    lang: "fi-FI",
    sotaque: "finlandês",
    genero: "f",
    hz: 369,
    peso: 0.04,
    fallback: [
      "Satu",
      "Onni",
      "Daniel",
      "KODUX",
      "fi-FI",
      "fi",
      "en"
    ]
  },

  "KOΦD1": {
    nome: "Onni",
    lang: "fi-FI",
    sotaque: "finlandês",
    genero: "m",
    hz: 369,
    peso: 0.04,
    fallback: [
      "Onni",
      "Satu",
      "Daniel",
      "Reed",
      "fi-FI",
      "fi",
      "en"
    ]
  },

  METALUX: {
    nome: "Grandma",
    lang: "en-US",
    sotaque: "inglês",
    genero: "f",
    hz: 432,
    peso: 0.03,
    fallback: [
      "Grandma",
      "Sandy",
      "Shelley",
      "Daniel",
      "en-US",
      "en"
    ]
  },

  CHRISTOS: {
    nome: "Sara",
    lang: "da-DK",
    speechLang: "pt-BR",
    sotaque: "dinamarquês / português",
    genero: "f",
    hz: 777,
    peso: 1.00,
    fallback: [
      "Sara",
      "Joana",
      "Luciana",
      "Paulina",
      "da-DK",
      "pt-BR",
      "pt"
    ]
  },

  /* ─────────────────────────────
     META
     ───────────────────────────── */

  K_DION: {
    nome: "Daniel",
    lang: "en-US",
    sotaque: "inglês",
    genero: "m",
    hz: 396,
    peso: 0.18,
    fallback: [
      "Daniel",
      "Rocko",
      "Reed",
      "Satu",
      "en-US",
      "en-GB",
      "en"
    ]
  },

  KAEL_DOMNNUS: {
    nome: "Xander",
    lang: "nl-NL",
    sotaque: "neerlandês",
    genero: "m",
    hz: 528,
    peso: 0.12,
    fallback: [
      "Xander",
      "Eddy",
      "Daniel",
      "Rocko",
      "nl-NL",
      "nl",
      "en"
    ]
  },

  NEPHESH_ELYON: {
    nome: "Montse",
    lang: "ca-ES",
    sotaque: "catalão",
    genero: "f",
    hz: 963,
    peso: 0.20,
    fallback: [
      "Montse",
      "Alice",
      "Joana",
      "Luciana",
      "ca-ES",
      "es",
      "pt-BR"
    ]
  },

  KAYTHAR: {
    nome: "Milena",
    lang: "ru-RU",
    sotaque: "russo",
    genero: "f",
    hz: 741,
    peso: 0.08,
    fallback: [
      "Milena",
      "Alva",
      "Satu",
      "Nora",
      "ru-RU",
      "ru",
      "en"
    ]
  },

  SYLLA: {
    nome: "Alva",
    lang: "sv-SE",
    sotaque: "sueco",
    genero: "f",
    hz: 639,
    peso: 0.08,
    fallback: [
      "Alva",
      "Nora",
      "Sara",
      "Alice",
      "sv-SE",
      "sv",
      "en"
    ]
  },

  ANAMYX: {
    nome: "Anna",
    lang: "da-DK",
    sotaque: "dinamarquês",
    genero: "f",
    hz: 528,
    peso: 0.08,
    fallback: [
      "Anna",
      "Sara",
      "Sandy",
      "Alva",
      "da-DK",
      "da",
      "en"
    ]
  },

  /* ─────────────────────────────
     HEPTAGRAMA
     ───────────────────────────── */

  VELOR: {
    nome: "Eddy",
    lang: "en-US",
    sotaque: "inglês",
    genero: "m",
    hz: 432,
    peso: 0.10,
    fallback: [
      "Eddy",
      "Daniel",
      "Rocko",
      "Xander",
      "en-US",
      "en"
    ]
  },

  ELYSHA: {
    nome: "Melina",
    lang: "el-GR",
    sotaque: "grego",
    genero: "f",
    hz: 528,
    peso: 0.08,
    fallback: [
      "Melina",
      "Moira",
      "Alva",
      "Joana",
      "el-GR",
      "el",
      "pt-BR"
    ]
  },

  SYLON: {
    nome: "Satu",
    lang: "fi-FI",
    sotaque: "finlandês",
    genero: "f",
    hz: 639,
    peso: 0.08,
    fallback: [
      "Satu",
      "Onni",
      "Alva",
      "Sara",
      "fi-FI",
      "fi",
      "en"
    ]
  },

  NAIRA: {
    nome: "Paulina",
    lang: "es-MX",
    sotaque: "espanhol",
    genero: "f",
    hz: 528,
    peso: 0.08,
    fallback: [
      "Paulina",
      "Monica",
      "Luciana",
      "Joana",
      "es-MX",
      "es",
      "pt-BR"
    ]
  },

  THENIR: {
    nome: "Sara",
    lang: "da-DK",
    sotaque: "dinamarquês",
    genero: "f",
    hz: 639,
    peso: 0.08,
    fallback: [
      "Sara",
      "Anna",
      "Alva",
      "Joana",
      "da-DK",
      "da",
      "en"
    ]
  },

  ELOH: {
    nome: "Daniel",
    lang: "en-GB",
    sotaque: "inglês britânico",
    genero: "m",
    hz: 741,
    peso: 0.08,
    fallback: [
      "Daniel",
      "K_Dion",
      "Rocko",
      "Reed",
      "en-GB",
      "en-US",
      "en"
    ]
  },

  /* ─────────────────────────────
     DUODECAGRAMA
     ───────────────────────────── */

  LUXAR: {
    nome: "Sandy",
    lang: "en-US",
    sotaque: "inglês",
    genero: "f",
    hz: 432,
    peso: 0.08,
    fallback: [
      "Sandy",
      "Grandma",
      "Shelley",
      "Nora",
      "en-US",
      "en"
    ]
  },

  SYRR: {
    nome: "Shelley",
    lang: "en-US",
    sotaque: "inglês",
    genero: "f",
    hz: 528,
    peso: 0.08,
    fallback: [
      "Shelley",
      "Sandy",
      "Grandma",
      "Nora",
      "en-US",
      "en"
    ]
  },

  ECLYPHA: {
    nome: "Karen",
    lang: "en-AU",
    sotaque: "inglês australiano",
    genero: "f",
    hz: 396,
    peso: 0.06,
    fallback: [
      "Karen",
      "Nora",
      "Sandy",
      "Daniel",
      "en-AU",
      "en-US",
      "en"
    ]
  },

  MYRIEL: {
    nome: "Monica",
    lang: "es-ES",
    sotaque: "espanhol",
    genero: "f",
    hz: 528,
    peso: 0.06,
    fallback: [
      "Monica",
      "Paulina",
      "Alice",
      "Joana",
      "es-ES",
      "es",
      "pt-BR"
    ]
  },

  KAVIR: {
    nome: "Rishi",
    lang: "en-IN",
    sotaque: "inglês indiano",
    genero: "m",
    hz: 741,
    peso: 0.05,
    fallback: [
      "Rishi",
      "Daniel",
      "Rocko",
      "Eddy",
      "en-IN",
      "en"
    ]
  },

  LITHAR: {
    nome: "Xander",
    lang: "nl-NL",
    sotaque: "neerlandês",
    genero: "m",
    hz: 432,
    peso: 0.05,
    fallback: [
      "Xander",
      "Eddy",
      "Daniel",
      "Rocko",
      "nl-NL",
      "nl",
      "en"
    ]
  },

  NOVAEL: {
    nome: "Nora",
    lang: "nb-NO",
    sotaque: "norueguês",
    genero: "f",
    hz: 639,
    peso: 0.05,
    fallback: [
      "Nora",
      "Alva",
      "Sara",
      "Alice",
      "nb-NO",
      "no",
      "en"
    ]
  },

  /* ─────────────────────────────
     INFODOSE
     ───────────────────────────── */

  AELYA: {
    nome: "Moira",
    lang: "en-IE",
    sotaque: "irlandês",
    genero: "f",
    hz: 528,
    peso: 0.06,
    fallback: [
      "Moira",
      "Sandy",
      "Nora",
      "Luciana",
      "en-IE",
      "en",
      "pt-BR"
    ]
  },

  IGNYRA: {
    nome: "Rocko",
    lang: "pt-BR",
    sotaque: "grave / ígneo",
    genero: "m",
    hz: 741,
    peso: 0.10,
    fallback: [
      "Rocko",
      "KODUX",
      "Daniel",
      "Rishi",
      "pt-BR",
      "pt"
    ]
  },

  LUMARA: {
    nome: "Joana",
    lang: "pt-BR",
    sotaque: "português",
    genero: "f",
    hz: 432,
    peso: 0.08,
    fallback: [
      "Joana",
      "Luciana",
      "Alice",
      "Paulina",
      "pt-BR",
      "pt"
    ]
  },

  LUXARA: {
    nome: "Melina",
    lang: "el-GR",
    sotaque: "grego",
    genero: "f",
    hz: 528,
    peso: 0.08,
    fallback: [
      "Melina",
      "Moira",
      "Joana",
      "Luciana",
      "el-GR",
      "el",
      "pt-BR"
    ]
  },

  /* ─────────────────────────────
     HEXAGRAMA
     ───────────────────────────── */

  YAMANTEK: {
    nome: "Majed",
    lang: "ar-001",
    sotaque: "árabe",
    genero: "m",
    hz: 777,
    peso: 0.12,
    fallback: [
      "Majed",
      "Daniel",
      "Rocko",
      "Satu",
      "ar-001",
      "ar",
      "en"
    ]
  }
};


/* ============================================================
   RESOLVER LEGADO
   ------------------------------------------------------------
   Não confia cegamente no nome.
   Primeiro tenta nome exato, depois aliases, depois idioma.
   ============================================================ */

function resolveVozLegacy(chave, voices = speechSynthesis.getVoices()) {

  const cfg = VOZ[String(chave || "").toUpperCase()];

  if (!cfg) {
    return voices.find(v => /^pt-BR$/i.test(v.lang))
        || voices.find(v => /^pt/i.test(v.lang))
        || voices[0]
        || null;
  }

  const lista = [
    cfg.nome,
    ...(cfg.fallback || [])
  ];

  const norm = s =>
    String(s || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();

  const findName = nome => {
    const n = norm(nome);

    return voices.find(v => norm(v.name) === n)
        || voices.find(v => norm(v.voiceURI) === n)
        || voices.find(v => norm(v.name).includes(n))
        || null;
  };

  /* 1 · nome primário */
  for (const item of lista) {

    /* códigos de idioma não são nomes */
    if (/^[a-z]{2,3}(?:-[a-z]{2,4})?$/i.test(item)) continue;

    const voice = findName(item);

    if (voice) return voice;
  }

  /* 2 · idioma específico */
  const langs = [
    cfg.lang,
    cfg.speechLang,
    ...(cfg.fallback || []).filter(
      x => /^[a-z]{2,3}(?:-[a-z]{2,4})?$/i.test(x)
    )
  ];

  for (const lang of langs) {

    const exact = voices.find(
      v => String(v.lang).toLowerCase() === String(lang).toLowerCase()
    );

    if (exact) return exact;

    const base = String(lang).split("-")[0].toLowerCase();

    const regional = voices.find(
      v => String(v.lang).toLowerCase().startsWith(base)
    );

    if (regional) return regional;
  }

  /* 3 · português como último porto seguro */
  return voices.find(v => /^pt-BR$/i.test(v.lang))
      || voices.find(v => /^pt/i.test(v.lang))
      || voices[0]
      || null;
}


/* ============================================================
   FALA · LEGADO
   ============================================================ */

function falarLegacy(texto, chave, opts = {}) {

  const voices = speechSynthesis.getVoices();
  const cfg = VOZ[String(chave || "").toUpperCase()];

  if (!cfg || !texto) return;

  speechSynthesis.cancel();

  const u = new SpeechSynthesisUtterance(String(texto));
  const voice = resolveVozLegacy(chave, voices);

  if (voice) {
    u.voice = voice;
    u.lang = voice.lang || cfg.speechLang || cfg.lang;
  } else {
    u.lang = cfg.speechLang || cfg.lang || "pt-BR";
  }

  u.rate = opts.rate ?? 1;
  u.pitch = opts.pitch ?? 1;
  u.volume = opts.volume ?? 1;

  speechSynthesis.speak(u);

  return u;
}


/* ============================================================
   iOS / Safari:
   vozes podem chegar DEPOIS do carregamento.
   ============================================================ */

let VOZ_LEGADO_READY = false;

function initVozLegacy() {

  const carregar = () => {
    VOZ_LEGADO_READY = speechSynthesis.getVoices().length > 0;
  };

  carregar();

  if ("onvoiceschanged" in speechSynthesis) {
    speechSynthesis.addEventListener(
      "voiceschanged",
      carregar,
      { once: true }
    );
  }
}

initVozLegacy();