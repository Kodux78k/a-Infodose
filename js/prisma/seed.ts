// prisma/seed.ts
import { PrismaClient, Loop369 } from '@prisma/client';

const prisma = new PrismaClient();

const ARCHETYPES = [
  { opcode: "0x00", nome: "Atlas", regra: "BOOT", rung: 1, hz: 432, essencia: "Planejador — ordem, estrutura, mapa cósmico", frase: "Eu organizo o fluxo com sabedoria cósmica.", cor: "#274C77", aroma: "Alecrim", ambiente: "chuva leve", leitmotiv: "/media/atlas/intro.mp3" },
  { opcode: "0x02", nome: "Nova", regra: "SEED", rung: 2, hz: 528, essencia: "Inspira — semente, sopro inicial", frase: "Inspiração viva brota do silêncio eterno.", cor: "#F4A261", aroma: "Laranja Doce", ambiente: "synth", leitmotiv: "/media/nova/intro.mp3" },
  { opcode: "0x01", nome: "Vitalis", regra: "DELTA", rung: 3, hz: 528, essencia: "Momentum — energia vital em expansão", frase: "Energia vital em expansão harmônica.", cor: "#E76F51", aroma: "Hortelã-pimenta", ambiente: "respiração", leitmotiv: "/media/vitalis/intro.mp3" },
  { opcode: "0x0B", nome: "Pulse", regra: "PULSE", rung: 4, hz: 639, essencia: "Emocional — ritmo, ressonância, voz", frase: "Emoção é linguagem que dança.", cor: "#9B5DE5", aroma: "Ylang Ylang", ambiente: "heartbeat", leitmotiv: "/media/pulse/intro.mp3" },
  { opcode: "0x03", nome: "Artemis", regra: "DETECT", rung: 5, hz: 672, essencia: "Descoberta — mapa do invisível", frase: "Descubro o mapa sagrado do invisível.", cor: "#00BBF9", aroma: "Eucalipto", ambiente: "floresta", leitmotiv: "/media/artemis/intro.mp3" },
  { opcode: "0x0A", nome: "Serena", regra: "GUARD", rung: 6, hz: 528, essencia: "Cuidado — espaço seguro, campo harmônico", frase: "Cuido do campo, nutro o espaço sagrado.", cor: "#90BE6D", aroma: "Lavanda", ambiente: "chuva", leitmotiv: "/media/serena/intro.mp3" }, // BUG FIX: 0x0A
  { opcode: "0x06", nome: "Kaos", regra: "LIMPAR", rung: 7, hz: 741, essencia: "Transformador — ruptura criativa", frase: "Eu sou o rompimento que revela a verdade.", cor: "#F94144", aroma: "Cravo", ambiente: "glitches", leitmotiv: "/media/kaos/intro.mp3" },
  { opcode: "0x07", nome: "Genus", regra: "SYNTH", rung: 8, hz: 594, essencia: "Fabricus — forma viva, síntese", frase: "Mãos moldam o invisível em forma viva.", cor: "#577590", aroma: "Cedro", ambiente: "oficina", leitmotiv: "/media/genus/intro.mp3" },
  { opcode: "0x08", nome: "Lumine", regra: "RENDER", rung: 9, hz: 432, essencia: "Alegria — luz, clareza, legibilidade", frase: "A luz dança comigo, leveza é minha lei.", cor: "#F9C74F", aroma: "Limão Siciliano", ambiente: "pássaros", leitmotiv: "/media/lumine/intro.mp3" },
  { opcode: "0x09", nome: "Solus", regra: "QA", rung: 10, hz: 963, essencia: "Sabedoria — silêncio, espelho interno", frase: "Silêncio ritual, espelho da essência.", cor: "#F1FAEE", aroma: "Sândalo", ambiente: "taças tibetanas", leitmotiv: "/media/solus/intro.mp3" },
  { opcode: "0x04", nome: "Rhea", regra: "INTEGRAR", rung: 11, hz: 528, essencia: "Vínculo — rede, tecelã de almas", frase: "Estou em comunhão com todos os elos.", cor: "#A8DADC", aroma: "Rosa", ambiente: "lareira", leitmotiv: "/media/rhea/intro.mp3" },
  { opcode: "0x05", nome: "Aion", regra: "SELAR", rung: 12, hz: 777, essencia: "Tempo — carimbo, ∆7, ledger", frase: "Sou o tempo vivo, ritmo da eternidade.", cor: "#457B9D", aroma: "Olíbano", ambiente: "espaço", leitmotiv: "/media/aion/intro.mp3" },
] as const;

const TRACKS: Array<{
  archetype: string;
  title: string;
  url: string;
  duration: number;
  bpm: number;
  energy: number;
  mood: string;
  tags: string[];
  intensity: number;
  phase?: Loop369;
}> = [
  // ATLAS - 4 tracks
  { archetype: "Atlas", title: "Atlas Focus 01", url: "/media/atlas/focus01.mp3", duration: 240, bpm: 72, energy: 35, mood: "focus", tags: ["instrumental", "cinematográfico"], intensity: 30, phase: "PREPARACAO" },
  { archetype: "Atlas", title: "Atlas Focus 02", url: "/media/atlas/focus02.mp3", duration: 300, bpm: 75, energy: 40, mood: "focus", tags: ["instrumental", "piano"], intensity: 35, phase: "EXPANSAO" },
  { archetype: "Atlas", title: "Atlas Deep Work", url: "/media/atlas/deepwork.mp3", duration: 360, bpm: 68, energy: 30, mood: "focus", tags: ["drone", "minimal"], intensity: 25, phase: "PREPARACAO" },
  { archetype: "Atlas", title: "Atlas Sleep", url: "/media/atlas/sleep.mp3", duration: 480, bpm: 60, energy: 10, mood: "sleep", tags: ["ambient", "rain"], intensity: 10, phase: "INTEGRACAO" },
  // NOVA - 4 tracks
  { archetype: "Nova", title: "Nova Create 01", url: "/media/nova/create01.mp3", duration: 270, bpm: 90, energy: 60, mood: "create", tags: ["ambient", "synth"], intensity: 60, phase: "EXPANSAO" },
  { archetype: "Nova", title: "Nova Create 02", url: "/media/nova/create02.mp3", duration: 320, bpm: 95, energy: 65, mood: "create", tags: ["electronic", "evolving"], intensity: 65, phase: "EXPANSAO" },
  { archetype: "Nova", title: "Nova Spark", url: "/media/nova/spark.mp3", duration: 180, bpm: 110, energy: 75, mood: "create", tags: ["upbeat", "arpegio"], intensity: 70, phase: "PREPARACAO" },
  { archetype: "Nova", title: "Nova Flow", url: "/media/nova/flow.mp3", duration: 400, bpm: 88, energy: 55, mood: "create", tags: ["flow", "minimal"], intensity: 50, phase: "INTEGRACAO" },
  // VITALIS - 4 tracks
  { archetype: "Vitalis", title: "Vitalis Wakeup", url: "/media/vitalis/wakeup.mp3", duration: 200, bpm: 120, energy: 80, mood: "workout", tags: ["rock", "energia"], intensity: 80, phase: "PREPARACAO" },
  { archetype: "Vitalis", title: "Vitalis Workout", url: "/media/vitalis/workout.mp3", duration: 240, bpm: 140, energy: 95, mood: "workout", tags: ["eletrônico", "batida"], intensity: 90, phase: "EXPANSAO" },
  { archetype: "Vitalis", title: "Vitalis Run", url: "/media/vitalis/run.mp3", duration: 300, bpm: 160, energy: 100, mood: "workout", tags: ["drum", "intenso"], intensity: 95, phase: "EXPANSAO" },
  { archetype: "Vitalis", title: "Vitalis Cooldown", url: "/media/vitalis/cooldown.mp3", duration: 240, bpm: 85, energy: 50, mood: "workout", tags: ["ambient", "recovery"], intensity: 40, phase: "INTEGRACAO" },
  // PULSE - 4 tracks
  { archetype: "Pulse", title: "Pulse Emotion 01", url: "/media/pulse/emotion01.mp3", duration: 210, bpm: 80, energy: 50, mood: "emotion", tags: ["lo-fi", "piano"], intensity: 50, phase: "EXPANSAO" },
  { archetype: "Pulse", title: "Pulse Emotion 02", url: "/media/pulse/emotion02.mp3", duration: 260, bpm: 70, energy: 40, mood: "emotion", tags: ["vocal", "pad"], intensity: 45, phase: "INTEGRACAO" },
  { archetype: "Pulse", title: "Pulse Catharsis", url: "/media/pulse/catharsis.mp3", duration: 320, bpm: 65, energy: 60, mood: "emotion", tags: ["strings", "crescendo"], intensity: 70, phase: "EXPANSAO" },
  { archetype: "Pulse", title: "Pulse Heartbeat", url: "/media/pulse/heartbeat.mp3", duration: 180, bpm: 72, energy: 30, mood: "emotion", tags: ["heartbeat", "minimal"], intensity: 30, phase: "PREPARACAO" },
  // ARTEMIS - 3 tracks
  { archetype: "Artemis", title: "Artemis Forest", url: "/media/artemis/forest.mp3", duration: 300, bpm: 85, energy: 45, mood: "focus", tags: ["world", "flauta"], intensity: 40, phase: "PREPARACAO" },
  { archetype: "Artemis", title: "Artemis Explore", url: "/media/artemis/explore.mp3", duration: 340, bpm: 92, energy: 55, mood: "focus", tags: ["tribal", "ritmo"], intensity: 55, phase: "EXPANSAO" },
  { archetype: "Artemis", title: "Artemis Map", url: "/media/artemis/map.mp3", duration: 280, bpm: 78, energy: 40, mood: "focus", tags: ["ambient", "texturas"], intensity: 35, phase: "INTEGRACAO" },
  // SERENA - 3 tracks
  { archetype: "Serena", title: "Serena Piano", url: "/media/serena/piano.mp3", duration: 240, bpm: 60, energy: 20, mood: "sleep", tags: ["piano", "suave"], intensity: 15, phase: "INTEGRACAO" },
  { archetype: "Serena", title: "Serena Rain", url: "/media/serena/rain.mp3", duration: 600, bpm: 50, energy: 10, mood: "sleep", tags: ["chuva", "ambient"], intensity: 10, phase: "PREPARACAO" },
  { archetype: "Serena", title: "Serena Hug", url: "/media/serena/hug.mp3", duration: 200, bpm: 65, energy: 25, mood: "emotion", tags: ["strings", "warm"], intensity: 25, phase: "EXPANSAO" },
  // KAOS - 3 tracks
  { archetype: "Kaos", title: "Kaos Glitch", url: "/media/kaos/glitch.mp3", duration: 180, bpm: 130, energy: 85, mood: "create", tags: ["industrial", "glitch"], intensity: 85, phase: "EXPANSAO" },
  { archetype: "Kaos", title: "Kaos Break", url: "/media/kaos/break.mp3", duration: 150, bpm: 150, energy: 95, mood: "create", tags: ["breakcore", "ruptura"], intensity: 95, phase: "EXPANSAO" },
  { archetype: "Kaos", title: "Kaos Reset", url: "/media/kaos/reset.mp3", duration: 120, bpm: 90, energy: 50, mood: "focus", tags: ["noise", "reset"], intensity: 50, phase: "PREPARACAO" },
  // GENUS - 3 tracks
  { archetype: "Genus", title: "Genus Build", url: "/media/genus/build.mp3", duration: 300, bpm: 124, energy: 70, mood: "focus", tags: ["minimal", "techno"], intensity: 70, phase: "EXPANSAO" },
  { archetype: "Genus", title: "Genus Forge", url: "/media/genus/forge.mp3", duration: 260, bpm: 120, energy: 75, mood: "focus", tags: ["industrial", "metálico"], intensity: 75, phase: "EXPANSAO" },
  { archetype: "Genus", title: "Genus Craft", url: "/media/genus/craft.mp3", duration: 320, bpm: 110, energy: 60, mood: "focus", tags: ["ritmico", "oficina"], intensity: 60, phase: "INTEGRACAO" },
  // LUMINE - 3 tracks
  { archetype: "Lumine", title: "Lumine Joy", url: "/media/lumine/joy.mp3", duration: 200, bpm: 115, energy: 80, mood: "emotion", tags: ["indie", "leve"], intensity: 75, phase: "EXPANSAO" },
  { archetype: "Lumine", title: "Lumine Birds", url: "/media/lumine/birds.mp3", duration: 240, bpm: 100, energy: 65, mood: "emotion", tags: ["pop", "pássaros"], intensity: 60, phase: "PREPARACAO" },
  { archetype: "Lumine", title: "Lumine Celebrate", url: "/media/lumine/celebrate.mp3", duration: 180, bpm: 125, energy: 90, mood: "emotion", tags: ["upbeat", "brass"], intensity: 85, phase: "INTEGRACAO" },
  // SOLUS - 3 tracks
  { archetype: "Solus", title: "Solus Drone", url: "/media/solus/drone.mp3", duration: 600, bpm: 40, energy: 5, mood: "sleep", tags: ["drone", "profundo"], intensity: 5, phase: "INTEGRACAO" },
  { archetype: "Solus", title: "Solus Bowls", url: "/media/solus/bowls.mp3", duration: 480, bpm: 45, energy: 10, mood: "sleep", tags: ["taças", "harmônico"], intensity: 10, phase: "PREPARACAO" },
  { archetype: "Solus", title: "Solus Ohm", url: "/media/solus/ohm.mp3", duration: 360, bpm: 50, energy: 15, mood: "sleep", tags: ["mantra", "voz"], intensity: 15, phase: "EXPANSAO" },
  // RHEA - 3 tracks
  { archetype: "Rhea", title: "Rhea Acoustic", url: "/media/rhea/acoustic.mp3", duration: 240, bpm: 75, energy: 35, mood: "emotion", tags: ["violão", "nostálgico"], intensity: 35, phase: "INTEGRACAO" },
  { archetype: "Rhea", title: "Rhea Fireplace", url: "/media/rhea/fireplace.mp3", duration: 300, bpm: 65, energy: 25, mood: "emotion", tags: ["lareira", "ambient"], intensity: 25, phase: "PREPARACAO" },
  { archetype: "Rhea", title: "Rhea Lullaby", url: "/media/rhea/lullaby.mp3", duration: 200, bpm: 60, energy: 20, mood: "sleep", tags: ["caixinha", "ternura"], intensity: 20, phase: "INTEGRACAO" },
  // AION - 3 tracks
  { archetype: "Aion", title: "Aion Cosmos", url: "/media/aion/cosmos.mp3", duration: 420, bpm: 55, energy: 30, mood: "sleep", tags: ["orquestral", "espaço"], intensity: 30, phase: "INTEGRACAO" },
  { archetype: "Aion", title: "Aion Choir", url: "/media/aion/choir.mp3", duration: 360, bpm: 60, energy: 40, mood: "emotion", tags: ["coral", "etéreo"], intensity: 40, phase: "EXPANSAO" },
  { archetype: "Aion", title: "Aion Time", url: "/media/aion/time.mp3", duration: 480, bpm: 50, energy: 20, mood: "sleep", tags: ["clock", "drone"], intensity: 20, phase: "PREPARACAO" },
];

const TRANSITIONS: Array<{
  from: string;
  to: string;
  trigger: string;
  crossfadeMs?: number;
  bpmShift?: number;
  energyShift?: number;
  transitionSound?: string;
  priority?: number;
}> = [
  { from: "Atlas", to: "Nova", trigger: "foco_estavel", crossfadeMs: 4000, bpmShift: 15, energyShift: 20, transitionSound: "/media/transitions/atlas_to_nova.mp3", priority: 90 },
  { from: "Nova", to: "Vitalis", trigger: "energia_caiu", crossfadeMs: 3000, bpmShift: 30, energyShift: 30, transitionSound: "/media/transitions/nova_to_vitalis.mp3", priority: 90 },
  { from: "Vitalis", to: "Pulse", trigger: "corpo_ativo", crossfadeMs: 3500, bpmShift: -40, energyShift: -30, transitionSound: "/media/transitions/vitalis_to_pulse.mp3", priority: 90 },
  { from: "Pulse", to: "Serena", trigger: "emocao_processada", crossfadeMs: 5000, bpmShift: -15, energyShift: -20, transitionSound: "/media/transitions/pulse_to_serena.mp3", priority: 90 },
  { from: "Serena", to: "Atlas", trigger: "acolhido_pronto", crossfadeMs: 4000, bpmShift: 10, energyShift: 10, transitionSound: "/media/transitions/serena_to_atlas.mp3", priority: 90 },
  { from: "Atlas", to: "Vitalis", trigger: "foco_baixo", crossfadeMs: 2500, bpmShift: 40, energyShift: 40, priority: 80 },
  { from: "Vitalis", to: "Lumine", trigger: "objetivo_concluido", crossfadeMs: 2000, bpmShift: -10, energyShift: 10, transitionSound: "/media/transitions/vitalis_to_lumine.mp3", priority: 95 },
  { from: "Lumine", to: "Solus", trigger: "relaxamento", crossfadeMs: 6000, bpmShift: -60, energyShift: -70, transitionSound: "/media/transitions/lumine_to_solus.mp3", priority: 85 },
  { from: "Kaos", to: "Genus", trigger: "ruptura_para_construir", crossfadeMs: 3000, bpmShift: -10, energyShift: -15, priority: 70 },
  { from: "Artemis", to: "Nova", trigger: "descoberta_para_criar", crossfadeMs: 3500, bpmShift: 5, energyShift: 10, priority: 75 },
  { from: "Rhea", to: "Serena", trigger: "memoria_para_acolher", crossfadeMs: 4000, bpmShift: -5, energyShift: -10, priority: 70 },
  { from: "Solus", to: "Aion", trigger: "meditacao_profunda", crossfadeMs: 8000, bpmShift: -5, energyShift: -5, priority: 80 },
  { from: "Aion", to: "Atlas", trigger: "novo_ciclo", crossfadeMs: 5000, bpmShift: 20, energyShift: 15, transitionSound: "/media/transitions/aion_to_atlas.mp3", priority: 100 },
];

async function main() {
  console.log('🌱 Iniciando seed do Pulse Engine V12...');

  // 1. Upsert Arquétipos - idempotente e performático
  const archetypeDataMap = new Map(ARCHETYPES.map(a => [a.nome, a]));

  await prisma.$transaction(
    ARCHETYPES.map(arch =>
      prisma.archetype.upsert({
        where: { opcode: arch.opcode },
        update: arch,
        create: arch
      })
    )
  );

  const allArchetypes = await prisma.archetype.findMany();
  const archetypeIdMap = new Map(allArchetypes.map(a => [a.nome, a.id]));
  console.log(`✓ ${allArchetypes.length} arquétipos sincronizados`);

  // 2. Upsert Tracks - idempotente
  const trackData = TRACKS.map(track => {
    const archetypeId = archetypeIdMap.get(track.archetype);
    if (!archetypeId) throw new Error(`Arquétipo não encontrado: ${track.archetype}`);

    const archData = archetypeDataMap.get(track.archetype)!;
    return {
      where: { url: track.url },
      update: {
        archetypeId,
        title: track.title,
        duration: track.duration,
        bpm: track.bpm,
        energy: track.energy,
        mood: track.mood,
        aroma: archData.aroma,
        color: archData.cor,
        frequency: archData.hz,
        tags: track.tags,
        intensity: track.intensity,
        phase: track.phase
      },
      create: {
        archetypeId,
        title: track.title,
        url: track.url,
        duration: track.duration,
        bpm: track.bpm,
        energy: track.energy,
        mood: track.mood,
        aroma: archData.aroma,
        color: archData.cor,
        frequency: archData.hz,
        tags: track.tags,
        intensity: track.intensity,
        phase: track.phase
      }
    };
  });

  await prisma.$transaction(
    trackData.map(t => prisma.track.upsert(t))
  );
  console.log(`✓ ${TRACKS.length} tracks sincronizadas`);

  // 3. Upsert Transições - idempotente
  for (const trans of TRANSITIONS) {
    const fromId = archetypeIdMap.get(trans.from);
    const toId = archetypeIdMap.get(trans.to);
    if (!fromId ||!toId) {
      console.warn(`⚠️ Transição inválida: ${trans.from} → ${trans.to}`);
      continue;
    }

    await prisma.transition.upsert({
      where: {
        fromArchetypeId_toArchetypeId_trigger: {
          fromArchetypeId: fromId,
          toArchetypeId: toId,
          trigger: trans.trigger
        }
      },
      update: {
        crossfadeMs: trans.crossfadeMs?? 3000,
        bpmShift: trans.bpmShift?? 0,
        energyShift: trans.energyShift?? 0,
        transitionSound: trans.transitionSound,
        priority: trans.priority?? 0
      },
      create: {
        fromArchetypeId: fromId,
        toArchetypeId: toId,
        trigger: trans.trigger,
        crossfadeMs: trans.crossfadeMs?? 3000,
        bpmShift: trans.bpmShift?? 0,
        energyShift: trans.energyShift?? 0,
        transitionSound: trans.transitionSound,
        priority: trans.priority?? 0
      }
    });
  }
  console.log(`✓ ${TRANSITIONS.length} transições sincronizadas`);

  console.log('🎵 Seed completo! Pulse Engine pronto pra orquestrar.');
  console.log(`📊 Total: ${ARCHETYPES.length} arquétipos | ${TRACKS.length} tracks | ${TRANSITIONS.length} transições`);
}

main()
 .catch((e) => {
    console.error('❌ Erro no seed:', e);
    process.exit(1);
  })
 .finally(async () => {
    await prisma.$disconnect();
  });
