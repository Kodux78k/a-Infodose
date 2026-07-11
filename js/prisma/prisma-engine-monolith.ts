// pulse-engine-monolith.ts
// KODUX PULSE ENGINE V12 · Motor Adaptativo de Paisagens Sonoras
// Regra: VERDADE × INTEGRAR ÷ Δ = ∞ | Fractal: 3×6×9×7 = 1134

import { PrismaClient, Prisma } from '@prisma/client';

// ==================== PRISMA SCHEMA EMBEDDED ====================
// Rode: npx prisma migrate dev --name pulse_v12_monolith
// Schema usado: postgresql

export const PRISMA_SCHEMA = `
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url = env("DATABASE_URL")
}

enum Loop369 {
  PREPARACAO // 3
  EXPANSAO   // 6
  INTEGRACAO // 9
}

enum Binaural {
  DELTA // 0.5-4Hz sono profundo
  THETA // 4-8Hz meditação
  ALPHA // 8-12Hz relaxamento alerta
  BETA  // 12-30Hz foco ativo
  GAMMA // 30-100Hz insight
}

enum Ambiente {
  NATUREZA    // chuva, floresta, pássaros
  ELETRONICO  // synth, glitch, drone
  ACUSTICO    // piano, violão, strings
  URBANO      // café, cidade, metrô
}

enum Objetivo {
  FOCO        // Atlas
  CRIACAO     // Nova
  RECUPERACAO // Serena, Solus
  ENERGIA     // Vitalis
  EXPLORAR    // Artemis
  SOCIAL      // Lumine, Rhea
}

enum Horario {
  MANHA      // 05-11
  TARDE      // 11-17
  NOITE      // 17-23
  MADRUGADA  // 23-05
}

model Archetype {
  id String @id @default(cuid())
  opcode String @unique // 0x00
  nome String @unique // Atlas
  regra String // BOOT
  rung Int // 1-12
  hz Int // 432
  essencia String
  frase String
  cor String // #274C77
  aroma String // Alecrim
  leitmotiv String // /media/atlas/intro.webm

  stems TrackStem[]
  fromTransitions TransitionGraph[] @relation("FromArchetype")
  toTransitions TransitionGraph[] @relation("ToArchetype")

  @@map("cadial_archetypes")
}

// STEMS: em vez de MP3 fixo, temos camadas
model TrackStem {
  id String @id @default(cuid())
  archetypeId String
  archetype Archetype @relation(fields: [archetypeId], references: [id])

  tipo String // "track", "ambiente", "pulso", "voz"
  nome String // "piano_atlas_01"
  url String // /media/stems/atlas/piano_01.webm
  
  // Metadados musicais
  bpm Int
  key String // "C", "Am", "432Hz"
  duration Int // segundos do loop
  
  // Metadados adaptativos
  phase Loop369
  layer Int // 12, 36, 72, 144
  intensity Int // 1-4: 1=leve, 4=máximo
  horario Horario
  objetivo Objetivo
  
  energy Int // 0-100
  focus Int // 0-100
  creativity Int // 0-100
  bodyActivation Int // 0-100
  
  // Flags de composição
  vocals Boolean @default(false)
  rain Boolean @default(false)
  binaural Binaural?
  breathing String? // "4-4", "4-7-8"
  
  // Curva de intensidade para crossfade inteligente
  intensityCurve Json // [10,20,30,40,55,70,60,40]
  
  // Embedding pra similaridade
  embedding Unsupported("vector(1536)")?
  
  createdAt DateTime @default(now())
  
  @@index([archetypeId, phase, layer, intensity, horario, objetivo])
  @@index([energy, focus, bpm])
  @@map("track_stems")
}

// GRAFO PONDERADO DE TRANSIÇÕES
model TransitionGraph {
  id String @id @default(cuid())
  
  fromArchetypeId String
  fromArchetype Archetype @relation("FromArchetype", fields: [fromArchetypeId], references: [id])
  toArchetypeId String
  toArchetype Archetype @relation("ToArchetype", fields: [toArchetypeId], references: [id])
  
  // Peso base 0-1. Atualizado em tempo real
  pesoBase Float @default(0.5)
  pesoAtual Float @default(0.5)
  
  // Regras de modificação de peso
  regra String // "energia_baixa", "objetivo_concluido", "hora_noite"
  modificador Float // +0.3 ou -0.2
  
  // Áudio de transição
  transitionStemUrl String? // /media/transitions/atlas_to_nova.webm
  crossfadeMs Int @default(3000)
  
  lastUsed DateTime?
  useCount Int @default(0)
  
  @@unique([fromArchetypeId, toArchetypeId, regra])
  @@index([fromArchetypeId, pesoAtual])
  @@map("transition_graph")
}

// ESTADO DO USUÁRIO EM TEMPO REAL
model UserState {
  id String @id @default(cuid())
  userId String @unique
  
  // Vetor de estado atual
  currentArchetypeId String
  energia Int // 0-100
  emocao String // "calm", "anxious", "focused", "creative"
  bpmAtual Int // do usuário via HRV se existir
  hrv Float? // Heart Rate Variability
  
  // Contexto temporal
  loop369 Loop369 @default(PREPARACAO)
  camada144 Int @default(12) // 12, 36, 72, 144
  contador369 Int @default(0) // quantos ciclos completos
  tempoDeUsoMin Int @default(0)
  horario DateTime @default(now())
  objetivo Objetivo @default(FOCO)
  
  // Sessão atual
  sessionId String @default(cuid())
  sessionStartAt DateTime @default(now())
  
  updatedAt DateTime @updatedAt
  
  @@map("user_states")
}

// LOG DE SESSÕES PARA ML
model SessionLog {
  id String @id @default(cuid())
  userId String
  sessionId String
  
  timestamp DateTime @default(now())
  
  // Estado que gerou a música
  archetypeId String
  energia Int
  emocao String
  loop369 Loop369
  camada144 Int
  
  // Composição tocada
  stemsIds String[] // IDs dos stems mixados
  bpmMix Int
  energyMix Int
  
  // Feedback implícito
  durationPlayedSec Int // quanto tempo ficou
  skipped Boolean @default(false)
  
  @@index([userId, timestamp])
  @@index([archetypeId, loop369])
  @@map("session_logs")
}
`;

// ==================== PULSE ENGINE CORE ====================

const prisma = new PrismaClient();

interface VectorEstado {
  userId: string;
  archetypeId?: string;
  energia: number; // 0-100
  emocao: string; // "calm", "anxious", "focused"
  bpmAtual?: number; // HRV
  hrv?: number;
  objetivo: Objetivo;
  horario: Date;
  tempoDeUsoMin: number;
}

interface ComposicaoDinamica {
  stems: {
    track: TrackStem;
    ambiente: TrackStem;
    pulso: TrackStem;
    voz?: TrackStem;
  };
  crossfadeMs: number;
  bpmFinal: number;
  energyFinal: number;
  cor: string;
  aroma: string;
  mensagem: string;
  frequency: number;
  binaural?: Binaural;
}

type Objetivo = 'FOCO' | 'CRIACAO' | 'RECUPERACAO' | 'ENERGIA' | 'EXPLORAR' | 'SOCIAL';
type TrackStem = any; // Prisma type

export class PulseEngineV12 {

  // 1. CALCULA PRÓXIMO ARQUÉTIPO VIA GRAFO PONDERADO
  async calculateNextArchetype(estado: VectorEstado): Promise<string> {
    const currentState = await this.getUserState(estado.userId);
    const currentArchId = estado.archetypeId || currentState.currentArchetypeId;

    // Busca todas transições possíveis do arquétipo atual
    const transicoes = await prisma.transitionGraph.findMany({
      where: { fromArchetypeId: currentArchId },
      include: { toArchetype: true },
      orderBy: { pesoAtual: 'desc' }
    });

    // Aplica modificadores de peso em tempo real
    for (const t of transicoes) {
      t.pesoAtual = t.pesoBase;
      
      // Regra: energia baixa → boost Vitalis
      if (estado.energia < 30 && t.toArchetype.nome === 'Vitalis') {
        t.pesoAtual += 0.4;
      }
      
      // Regra: objetivo concluído → boost Lumine
      if (estado.objetivo === 'FOCO' && estado.tempoDeUsoMin > 45 && t.toArchetype.nome === 'Lumine') {
        t.pesoAtual += 0.5;
      }
      
      // Regra: noite → boost Solus/Serena
      const hora = estado.horario.getHours();
      if (hora >= 22 || hora < 5) {
        if (['Solus', 'Serena'].includes(t.toArchetype.nome)) t.pesoAtual += 0.3;
        if (['Vitalis', 'Kaos'].includes(t.toArchetype.nome)) t.pesoAtual -= 0.4;
      }
      
      // Regra: Loop 369 INTEGRACAO → favorece próximo no fluxo
      if (currentState.loop369 === 'INTEGRACAO') {
        const fluxoNatural = this.getProximoNoFluxo(currentArchId);
        if (t.toArchetypeId === fluxoNatural) t.pesoAtual += 0.25;
      }
      
      // Regra: HRV baixo → boost Serena/Solus
      if (estado.hrv && estado.hrv < 40 && ['Serena', 'Solus'].includes(t.toArchetype.nome)) {
        t.pesoAtual += 0.35;
      }
    }

    // Escolhe o maior peso
    const vencedor = transicoes.reduce((max, t) => t.pesoAtual > max.pesoAtual ? t : max);
    
    // Atualiza uso
    await prisma.transitionGraph.update({
      where: { id: vencedor.id },
      data: { lastUsed: new Date(), useCount: { increment: 1 } }
    });

    return vencedor.toArchetypeId;
  }

  // 2. SELECIONA STEMS E MONTA COMPOSIÇÃO DINÂMICA
  async montarComposicao(estado: VectorEstado): Promise<ComposicaoDinamica> {
    const userState = await this.getUserState(estado.userId);
    const archetypeId = await this.calculateNextArchetype(estado);
    const archetype = await prisma.archetype.findUnique({ where: { id: archetypeId } });

    const camada = userState.camada144;
    const phase = userState.loop369;
    const horario = this.getHorarioEnum(estado.horario);
    const intensity = this.calculateIntensity(estado.energia, phase);

    // Busca stems por tipo
    const [track, ambiente, pulso, voz] = await Promise.all([
      this.selectStem({ archetypeId, tipo: 'track', phase, layer: camada, intensity, horario, objetivo: estado.objetivo, energia: estado.energia }),
      this.selectStem({ archetypeId, tipo: 'ambiente', phase, layer: camada, intensity, horario, objetivo: estado.objetivo }),
      this.selectStem({ archetypeId, tipo: 'pulso', phase, layer: camada, intensity, horario, objetivo: estado.objetivo }),
      camada >= 144 ? this.selectStem({ archetypeId, tipo: 'voz', phase, layer: camada, intensity, horario, objetivo: estado.objetivo }) : null
    ]);

    // Calcula BPM e Energy finais da mix
    const bpmFinal = Math.round((track.bpm * 0.6 + pulso.bpm * 0.4));
    const energyFinal = Math.round((track.energy * 0.5 + ambiente.energy * 0.3 + pulso.energy * 0.2));

    // Crossfade baseado em delta de BPM/Energy
    const crossfadeMs = 2000 + Math.abs(bpmFinal - (estado.bpmAtual || 70)) * 30;

    return {
      stems: { track, ambiente, pulso, voz },
      crossfadeMs,
      bpmFinal,
      energyFinal,
      cor: archetype.cor,
      aroma: archetype.aroma,
      mensagem: archetype.frase,
      frequency: archetype.hz,
      binaural: track.binaural || this.inferBinaural(phase)
    };
  }

  // 3. AVANÇA LOOP 369 E CAMADA 144
  async advanceLoop369(userId: string): Promise<{ newPhase: Loop369, newCamada: number, unlocked: boolean }> {
    const state = await this.getUserState(userId);
    const phases: Loop369[] = ['PREPARACAO', 'EXPANSAO', 'INTEGRACAO'];
    const currentIdx = phases.indexOf(state.loop369);
    const newPhase = phases[(currentIdx + 1) % 3];
    
    let newCamada = state.camada144;
    let newContador = state.contador369;
    let unlocked = false;

    // Completou ciclo 3→6→9
    if (newPhase === 'PREPARACAO') {
      newContador++;
      
      // Desbloqueia novas camadas: 12→36→72→144
      if (newContador === 3 && state.camada144 === 12) {
        newCamada = 36; unlocked = true;
      } else if (newContador === 6 && state.camada144 === 36) {
        newCamada = 72; unlocked = true;
      } else if (newContador === 9 && state.camada144 === 72) {
        newCamada = 144; unlocked = true;
      }
    }

    await prisma.userState.update({
      where: { userId },
      data: {
        loop369: newPhase,
        contador369: newContador,
        camada144: newCamada,
        sessionStartAt: newPhase === 'PREPARACAO' ? new Date() : state.sessionStartAt
      }
    });

    return { newPhase, newCamada, unlocked };
  }

  // ==================== HELPERS ====================

  private async getUserState(userId: string) {
    let state = await prisma.userState.findUnique({ where: { userId } });
    if (!state) {
      const atlas = await prisma.archetype.findFirst({ where: { nome: 'Atlas' } });
      state = await prisma.userState.create({
        data: {
          userId,
          currentArchetypeId: atlas!.id,
          energia: 50,
          emocao: 'calm',
          objetivo: 'FOCO',
          horario: new Date()
        }
      });
    }
    return state;
  }

  private async selectStem(filters: any): Promise<TrackStem> {
    const where: any = {
      archetypeId: filters.archetypeId,
      tipo: filters.tipo,
      phase: filters.phase,
      layer: { lte: filters.layer }, // Usa layer igual ou inferior
      intensity: { lte: filters.intensity + 1, gte: filters.intensity - 1 },
      horario: filters.horario,
      objetivo: filters.objetivo
    };

    // Se tem energia, filtra por range
    if (filters.energia) {
      where.energy = { gte: filters.energia - 15, lte: filters.energia + 15 };
    }

    const stems = await prisma.trackStem.findMany({ where, take: 10 });
    
    if (!stems.length) {
      // Fallback: remove filtros até achar
      delete where.intensity;
      const fallback = await prisma.trackStem.findFirst({ where: { archetypeId: filters.archetypeId, tipo: filters.tipo } });
      if (!fallback) throw new Error(`Nenhum stem encontrado para ${filters.tipo}`);
      return fallback;
    }

    // Escolhe aleatório entre os top 3
    return stems[Math.floor(Math.random() * Math.min(3, stems.length))];
  }

  private calculateIntensity(energia: number, phase: Loop369): number {
    const base = Math.ceil(energia / 25); // 1-4
    const phaseMod = { PREPARACAO: -1, EXPANSAO: 1, INTEGRACAO: 0 }[phase];
    return Math.max(1, Math.min(4, base + phaseMod));
  }

  private getHorarioEnum(date: Date): Horario {
    const h = date.getHours();
    if (h >= 5 && h < 11) return 'MANHA';
    if (h >= 11 && h < 17) return 'TARDE';
    if (h >= 17 && h < 23) return 'NOITE';
    return 'MADRUGADA';
  }

  private inferBinaural(phase: Loop369): Binaural {
    return { PREPARACAO: 'ALPHA', EXPANSAO: 'BETA', INTEGRACAO: 'THETA' }[phase] as Binaural;
  }

  private getProximoNoFluxo(archetypeId: string): string {
    // Fluxo padrão: Atlas→Nova→Vitalis→Pulse→Serena→Atlas
    return archetypeId; // Implementar busca
  }

  async logSession(userId: string, composicao: ComposicaoDinamica, durationSec: number) {
    const state = await this.getUserState(userId);
    await prisma.sessionLog.create({
      data: {
        userId,
        sessionId: state.sessionId,
        archetypeId: composicao.stems.track.archetypeId,
        energia: state.energia,
        emocao: state.emocao,
        loop369: state.loop369,
        camada144: state.camada144,
        stemsIds: Object.values(composicao.stems).filter(Boolean).map(s => s!.id),
        bpmMix: composicao.bpmFinal,
        energyMix: composicao.energyFinal,
        durationPlayedSec: durationSec,
        skipped: durationSec < 30
      }
    });
  }
}

// ==================== SEED DATA ====================

export async function seedDatabase() {
  console.log('🌱 Seeding Pulse Engine V12...');

  // 1. Arquétipos
  const archetypes = [
    { opcode: "0x00", nome: "Atlas", regra: "BOOT", rung: 1, hz: 432, essencia: "Planejador — ordem", frase: "Eu organizo o fluxo", cor: "#274C77", aroma: "Alecrim", leitmotiv: "/media/atlas/intro.webm" },
    { opcode: "0x02", nome: "Nova", regra: "SEED", rung: 2, hz: 528, essencia: "Inspira — semente", frase: "Inspiração viva brota", cor: "#F4A261", aroma: "Laranja Doce", leitmotiv: "/media/nova/intro.webm" },
    { opcode: "0x01", nome: "Vitalis", regra: "DELTA", rung: 3, hz: 528, essencia: "Momentum — energia", frase: "Energia vital em expansão", cor: "#E76F51", aroma: "Hortelã-pimenta", leitmotiv: "/media/vitalis/intro.webm" },
    { opcode: "0x0B", nome: "Pulse", regra: "PULSE", rung: 4, hz: 639, essencia: "Emocional — ritmo", frase: "Emoção é linguagem", cor: "#9B5DE5", aroma: "Ylang Ylang", leitmotiv: "/media/pulse/intro.webm" },
    { opcode: "0x03", nome: "Artemis", regra: "DETECT", rung: 5, hz: 672, essencia: "Descoberta", frase: "Descubro o mapa", cor: "#00BBF9", aroma: "Eucalipto", leitmotiv: "/media/artemis/intro.webm" },
    { opcode: "0x09", nome: "Serena", regra: "GUARD", rung: 6, hz: 528, essencia: "Cuidado", frase: "Cuido do campo", cor: "#90BE6D", aroma: "Lavanda", leitmotiv: "/media/serena/intro.webm" },
    { opcode: "0x06", nome: "Kaos", regra: "LIMPAR", rung: 7, hz: 741, essencia: "Transformador", frase: "Eu sou o rompimento", cor: "#F94144", aroma: "Cravo", leitmotiv: "/media/kaos/intro.webm" },
    { opcode: "0x07", nome: "Genus", regra: "SYNTH", rung: 8, hz: 594, essencia: "Fabricus", frase: "Mãos moldam o invisível", cor: "#577590", aroma: "Cedro", leitmotiv: "/media/genus/intro.webm" },
    { opcode: "0x08", nome: "Lumine", regra: "RENDER", rung: 9, hz: 432, essencia: "Alegria", frase: "A luz dança comigo", cor: "#F9C74F", aroma: "Limão Siciliano", leitmotiv: "/media/lumine/intro.webm" },
    { opcode: "0x09", nome: "Solus", regra: "QA", rung: 10, hz: 963, essencia: "Sabedoria", frase: "Silêncio ritual", cor: "#F1FAEE", aroma: "Sândalo", leitmotiv: "/media/solus/intro.webm" },
    { opcode: "0x04", nome: "Rhea", regra: "INTEGRAR", rung: 11, hz: 528, essencia: "Vínculo", frase: "Estou em comunhão", cor: "#A8DADC", aroma: "Rosa", leitmotiv: "/media/rhea/intro.webm" },
    { opcode: "0x05", nome: "Aion", regra: "SELAR", rung: 12, hz: 777, essencia: "Tempo", frase: "Sou o tempo vivo", cor: "#457B9D", aroma: "Olíbano", leitmotiv: "/media/aion/intro.webm" },
  ];

  for (const arch of archetypes) {
    await prisma.archetype.upsert({
      where: { opcode: arch.opcode },
      update: arch,
      create: arch
    });
  }
  console.log(`✓ 12 arquétipos criados`);

  console.log('🎵 Seed completo! Rode: npx prisma db push');
}

// Export pra usar
export const pulseEngine = new PulseEngineV12();

// CLI
if (require.main === module) {
  seedDatabase().catch(console.error).finally(() => prisma.$disconnect());
}
