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
   5. pt-BR como porto seguro

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
      "Rocko",
      "Reed",
      "Satu",
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
      "Daniel",
      "Reed",
      "Joana",
      "pt-BR",
      "pt"
    ]
  },

  PULSE: {
    nome: "Reed",
    lang: "pt-BR",
    sotaque: "grave / pulsante",
    genero: "m",
    hz: 432,
    peso: 0.10,
    fallback: [
      "Reed",
      "Rocko",
      "Daniel",
      "Luciana",
      "Joana",
      "pt-BR",
      "pt"
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
      "Luciana",
      "Joana",
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
    genero: "f",
    hz: 741,
    peso: 0.01,
    fallback: [
      "Satu",
      "Daniel",
      "Reed",
      "Luciana",
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
      "Satu",
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
      "Daniel",
      "Reed",
      "Rocko",
      "fi-FI",
      "fi",
      "en"
    ]
  },

  "KOΦD1": {
    nome: "Satu",
    lang: "fi-FI",
    sotaque: "finlandês",
    genero: "f",
    hz: 369,
    peso: 0.04,

    aliases: [
      "KΦD1",
      "KΦD°1",
      "KOΦDX",
      "KOΦ°D1",
      "KΦD1",
      "KOΦDo°1"
    ],

    fallback: [
      "Satu",
      "Daniel",
      "Reed",
      "Rocko",
      "fi-FI",
      "fi",
      "en"
    ]
  },

  METALUX: {
    nome: "Grandma",
    lang: "pt-BR",
    sotaque: "inglês / português",
    genero: "f",
    hz: 432,
    peso: 0.03,
    fallback: [
      "Grandma",
      "Luciana",
      "Joana",
      "Sandy",
      "pt-BR",
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

    aliases: [
      "CHRISTOS",
      "CRISTO",
      "CRISTOS",
      "JESUS"
    ],

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
      "Alva",
      "Sara",
      "Daniel",
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
      "Rocko",
      "Reed",
      "Xander",
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
      "Daniel",
      "Rishi",
      "Reed",
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
   ALIASES · LEGADO
   ------------------------------------------------------------
   IDs alternativos apontam para a chave canônica.
   ============================================================ */

const VOZ_ALIASES = {

  /* Jesus / Christos */
  CHRISTOS: "CHRISTOS",
  CRISTO: "CHRISTOS",
  CRISTOS: "CHRISTOS",
  JESUS: "CHRISTOS",

  /* KOΦD1 */
  "KΦD1": "KOΦD1",
  "KΦD°1": "KOΦD1",
  "KOΦDX": "KOΦD1",
  "KOΦ°D1": "KOΦD1",
  "KOΦDO°1": "KOΦD1",
  "KΦDO°1": "KOΦD1"
};


/* ============================================================
   NORMALIZAÇÃO
   ============================================================ */

function normalizarVozTexto(valor) {
  return String(valor ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}


function normalizarLang(lang) {
  const valor = String(lang || "").trim();

  if (!valor) return "";

  const partes = valor.split("-");

  if (partes.length === 1) {
    return partes[0].toLowerCase();
  }

  return [
    partes[0].toLowerCase(),
    partes[1].toUpperCase(),
    ...partes.slice(2)
  ].join("-");
}


/* ============================================================
   RESOLVE CONFIG
   ------------------------------------------------------------
   Aceita:
   - KOBLLUX
   - christos
   - jesus
   - KOΦD1
   - aliases do legado
   ============================================================ */

function obterConfigVoz(chave) {

  const original = String(chave || "").trim();

  if (!original) return null;

  const upper = original.toUpperCase();

  /* chave direta */
  if (VOZ[upper]) {
    return VOZ[upper];
  }

  /* alias */
  const alias = VOZ_ALIASES[upper];

  if (alias && VOZ[alias]) {
    return VOZ[alias];
  }

  /* procura por aliases internos */
  for (const [id, cfg] of Object.entries(VOZ)) {

    if (
      Array.isArray(cfg.aliases) &&
      cfg.aliases.some(
        a => normalizarVozTexto(a) === normalizarVozTexto(original)
      )
    ) {
      return cfg;
    }
  }

  return null;
}


/* ============================================================
   RESOLVER LEGADO
   ------------------------------------------------------------
   Ordem:

   1. nome exato da voz
   2. voiceURI
   3. nome parcial
   4. nomes de fallback reais
   5. idioma específico
   6. idioma-base
   7. speechLang
   8. pt-BR
   9. primeira voz disponível
   ============================================================ */

function resolveVozLegacy(
  chave,
  voices = window.speechSynthesis
    ? speechSynthesis.getVoices()
    : []
) {

  const cfg = obterConfigVoz(chave);

  if (!Array.isArray(voices) || !voices.length) {
    return null;
  }

  /* ─────────────────────────────
     Sem configuração
     ───────────────────────────── */

  if (!cfg) {

    return (
      voices.find(v => /^pt-BR$/i.test(v.lang)) ||
      voices.find(v => /^pt/i.test(v.lang)) ||
      voices[0] ||
      null
    );
  }


  /* ─────────────────────────────
     Normalização
     ───────────────────────────── */

  const norm = normalizarVozTexto;


  /* ─────────────────────────────
     Lista de nomes
     ───────────────────────────── */

  const listaNomes = [
    cfg.nome,
    ...(cfg.fallback || [])
  ].filter(item => {

    if (!item) return false;

    /*
      códigos de idioma não são nomes
    */
    return !/^[a-z]{2,3}(?:-[a-z]{2,4})?$/i.test(
      String(item)
    );
  });


  /* ─────────────────────────────
     Procurador de nome
     ───────────────────────────── */

  const findName = nome => {

    const n = norm(nome);

    if (!n) return null;

    /*
      1 · nome exato
    */
    const exactName = voices.find(
      v => norm(v.name) === n
    );

    if (exactName) return exactName;


    /*
      2 · URI exata
    */
    const exactURI = voices.find(
      v => norm(v.voiceURI) === n
    );

    if (exactURI) return exactURI;


    /*
      3 · nome contendo termo
    */
    const partialName = voices.find(
      v => norm(v.name).includes(n)
    );

    if (partialName) return partialName;


    /*
      4 · termo contido no nome procurado
    */
    return voices.find(
      v => n.includes(norm(v.name))
    ) || null;
  };


  /* ─────────────────────────────
     1 · nomes de voz
     ───────────────────────────── */

  for (const nome of listaNomes) {

    const voice = findName(nome);

    if (voice) {
      return voice;
    }
  }


  /* ─────────────────────────────
     2 · idiomas
     ----------------------------------------------------------
     Primeiro o idioma próprio da voz.
     Depois speechLang.
     Depois idiomas declarados nos fallbacks.
     ───────────────────────────── */

  const langs = [
    cfg.lang,
    cfg.speechLang,

    ...(cfg.fallback || []).filter(
      x =>
        /^[a-z]{2,3}(?:-[a-z]{2,4})?$/i.test(
          String(x)
        )
    )
  ]
    .filter(Boolean)
    .map(normalizarLang);


  /*
    Remove duplicados preservando ordem.
  */
  const langsUnicos = [...new Set(langs)];


  /* ─────────────────────────────
     3 · idioma exato
     ───────────────────────────── */

  for (const lang of langsUnicos) {

    const exact = voices.find(
      v =>
        normalizarLang(v.lang).toLowerCase() ===
        lang.toLowerCase()
    );

    if (exact) {
      return exact;
    }
  }


  /* ─────────────────────────────
     4 · idioma regional
     ───────────────────────────── */

  for (const lang of langsUnicos) {

    const base = lang
      .split("-")[0]
      .toLowerCase();

    if (!base) continue;

    const regional = voices.find(
      v =>
        normalizarLang(v.lang)
          .toLowerCase()
          .split("-")[0] === base
    );

    if (regional) {
      return regional;
    }
  }


  /* ─────────────────────────────
     5 · português brasileiro
     ───────────────────────────── */

  return (
    voices.find(v => /^pt-BR$/i.test(v.lang)) ||
    voices.find(v => /^pt/i.test(v.lang)) ||
    voices[0] ||
    null
  );
}


/* ============================================================
   FALA · LEGADO
   ------------------------------------------------------------
   rate/pitch do LEGADO são o padrão vibracional.
   opts pode sobrescrever individualmente.
   ============================================================ */

function falarLegacy(texto, chave, opts = {}) {

  if (!texto) return null;

  if (
    !window.speechSynthesis ||
    typeof SpeechSynthesisUtterance === "undefined"
  ) {
    return null;
  }

  const cfg = obterConfigVoz(chave);

  if (!cfg) return null;


  const voices = speechSynthesis.getVoices();

  /*
    Cancela a fala anterior.
  */
  speechSynthesis.cancel();


  const u = new SpeechSynthesisUtterance(
    String(texto)
  );


  /* ─────────────────────────────
     Voz
     ───────────────────────────── */

  const voice = resolveVozLegacy(
    chave,
    voices
  );


  if (voice) {

    u.voice = voice;

    /*
      Se uma voz real foi encontrada,
      o idioma efetivo acompanha a voz.
    */
    u.lang =
      voice.lang ||
      cfg.speechLang ||
      cfg.lang ||
      "pt-BR";

  } else {

    u.lang =
      cfg.speechLang ||
      cfg.lang ||
      "pt-BR";
  }


  /* ─────────────────────────────
     Parâmetros LEGADO
     ───────────────────────────── */

  u.rate =
    opts.rate ??
    cfg.rate ??
    1;

  u.pitch =
    opts.pitch ??
    cfg.pitch ??
    1;

  u.volume =
    opts.volume ??
    1;


  /*
    Limites seguros do SpeechSynthesis.
  */
  u.rate = Math.min(
    10,
    Math.max(0.1, Number(u.rate) || 1)
  );

  u.pitch = Math.min(
    2,
    Math.max(0, Number(u.pitch) || 1)
  );

  u.volume = Math.min(
    1,
    Math.max(0, Number(u.volume) || 1)
  );


  speechSynthesis.speak(u);

  return u;
}


/* ============================================================
   APLICA OS VALORES VIBRACIONAIS DO LEGADO
   ------------------------------------------------------------
   Caso o catálogo seja consumido por outro motor:
   cfg.rate / cfg.pitch existem também como aliases
   de compatibilidade.

   ATENÇÃO:
   Não altera hz nem peso.
   ============================================================ */

for (const cfg of Object.values(VOZ)) {

  /*
    Só injeta se ainda não existir.
    Assim não quebra extensões futuras.
  */

  if (cfg.rate == null) {
    cfg.rate = 1;
  }

  if (cfg.pitch == null) {
    cfg.pitch = 1;
  }
}


/* ============================================================
   PATCH · TAXA/PITCH DO LEGADO
   ------------------------------------------------------------
   Mapa separado para manter o catálogo visual limpo.
   ============================================================ */

const VOZ_TONE_LEGADO = {

  K_DION:        { rate: 0.78, pitch: 1.18 },
  KAEL_DOMNNUS:  { rate: 0.78, pitch: 0.22 },
  NEPHESH_ELYON: { rate: 0.63, pitch: 0.69 },

  VELOR:  { rate: 1.04, pitch: 1.28 },
  ELYSHA: { rate: 1.18, pitch: 1.44 },
  SYLON:  { rate: 0.97, pitch: 0.82 },
  NAIRA:  { rate: 1.01, pitch: 1.18 },
  THENIR: { rate: 1.03, pitch: 0.06 },
  ELOH:   { rate: 0.86, pitch: 1.78 },

  LUXAR:  { rate: 1.06, pitch: 1.42 },
  SYRR:   { rate: 0.94, pitch: 1.56 },
  ECLYPHA:{ rate: 1.12, pitch: 1.68 },
  MYRIEL: { rate: 0.96, pitch: 1.32 },
  KAVIR:  { rate: 1.08, pitch: 1.62 },
  LITHAR: { rate: 0.91, pitch: 0.54 },
  NOVAEL: { rate: 1.05, pitch: 1.22 },

  AELYA:  { rate: 0.98, pitch: 1.72 },
  IGNYRA: { rate: 1.14, pitch: 1.58 },
  LUMARA: { rate: 0.87, pitch: 0.52 },
  LUXARA: { rate: 0.87, pitch: 0.52 },

  KAYTHAR: { rate: 0.95, pitch: 0.92 },
  SYLLA:   { rate: 1.02, pitch: 1.14 },
  ANAMYX:  { rate: 1.10, pitch: 1.82 },

  YAMANTEK: { rate: 0.92, pitch: 0.38 },

  KOBLLUX: { rate: 0.98,  pitch: 0.48 },
  KODUX:   { rate: 1.00,  pitch: 0.07 },

  ATLAS:    { rate: 1.02,  pitch: 1.39 },
  NOVA:     { rate: 1.063, pitch: 1.34 },
  VITALIS:  { rate: 0.96,  pitch: 1.42 },
  PULSE:    { rate: 1.00,  pitch: 1.78 },
  ARTEMIS:  { rate: 1.00,  pitch: 1.23 },
  SERENA:   { rate: 0.92,  pitch: 0.90 },
  KAOS:     { rate: 1.28,  pitch: 0.67 },
  GENUS:    { rate: 0.98,  pitch: 1.20 },
  LUMINE:   { rate: 1.03,  pitch: 1.55 },
  SOLUS:    { rate: 0.90,  pitch: 0.58 },
  RHEA:     { rate: 1.02,  pitch: 1.44 },
  AION:     { rate: 1.07,  pitch: 1.08 },

  UNO:       { rate: 0.90, pitch: 0.33 },
  DUAL:      { rate: 1.02, pitch: 1.02 },
  TRINITY:   { rate: 1.04, pitch: 0.36 },
  INFODOSE:  { rate: 1.06, pitch: 0.96 },
  HORUS:     { rate: 1.10, pitch: 0.14 },
  BLUE:      { rate: 0.94, pitch: 1.69 },
  BLLUE:     { rate: 0.94, pitch: 1.69 },
  MINUZ:     { rate: 0.98, pitch: 1.78 },
  HANAH:     { rate: 0.98, pitch: 0.78 },
  KD1:       { rate: 0.89, pitch: 0.03 },
  "KOΦD1":   { rate: 0.93, pitch: 0.10 },
  METALUX:   { rate: 0.80, pitch: 2.34 },

  CHRISTOS: { rate: 1.09, pitch: 0.03 },
  JESUS:    { rate: 1.09, pitch: 0.03 }
};


/* ============================================================
   INJETA RATE/PITCH DO LEGADO
   ------------------------------------------------------------ */

for (const [chave, tone] of Object.entries(VOZ_TONE_LEGADO)) {

  const cfg = VOZ[chave];

  if (!cfg) continue;

  cfg.rate = tone.rate;
  cfg.pitch = tone.pitch;
}


/* ============================================================
   iOS / SAFARI
   ------------------------------------------------------------
   As vozes podem chegar DEPOIS do carregamento da página.
   ============================================================ */

let VOZ_LEGADO_READY = false;

function initVozLegacy() {

  if (
    !window.speechSynthesis ||
    typeof speechSynthesis.getVoices !== "function"
  ) {
    return;
  }


  const carregar = () => {

    const voices = speechSynthesis.getVoices();

    VOZ_LEGADO_READY =
      Array.isArray(voices) &&
      voices.length > 0;
  };


  carregar();


  /*
    Safari/iOS pode popular a lista
    somente depois do primeiro ciclo.
  */

  if ("onvoiceschanged" in speechSynthesis) {

    speechSynthesis.addEventListener(
      "voiceschanged",
      carregar,
      { once: false }
    );
  }
}


initVozLegacy();