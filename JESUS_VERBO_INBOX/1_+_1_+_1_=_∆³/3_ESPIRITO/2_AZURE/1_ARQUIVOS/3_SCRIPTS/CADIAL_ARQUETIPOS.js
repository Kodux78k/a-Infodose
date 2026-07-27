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