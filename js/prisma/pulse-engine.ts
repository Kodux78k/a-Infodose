// pulse-engine.ts
import { PrismaClient, Loop369 } from '@prisma/client';
const prisma = new PrismaClient();

interface UserContext {
  userId: string;
  energia: number; // 0-100
  humor: string;
  objetivo: string;
  horario: Date;
}

interface NextTrackResult {
  track: Track;
  crossfadeMs: number;
  transitionSound?: string;
  newColor: string;
  newAroma: string;
  newMessage: string;
  newFrequency: number;
}

export class PulseEngine {

  // 1. DETECTA ESTADO E CALCULA PRÓXIMO ARQUÉTIPO
  async calculateNextState(ctx: UserContext): Promise<string> {
    const current = await this.getUserState(ctx.userId);

    // Regras de transição baseadas no teu doc
    if (ctx.energia < 30) return 'vitalis'; // Energia caiu
    if (ctx.objetivo === 'concluido') return 'lumine'; // Objetivo concluído
    if (ctx.humor === 'disperso' && ctx.objetivo === 'focar') return 'atlas'; // Foco baixo
    if (ctx.horario.getHours() >= 22) return 'solus'; // Relaxamento noturno

    // Loop 369: se completou INTEGRACAO, volta pra PREPARACAO com novo arquétipo
    if (current.loopPhase === 'INTEGRACAO') {
      return await this.getNextArchetypeInFlow(current.currentArchetypeId);
    }

    return current.currentArchetypeId;
  }

  // 2. SELECIONA MÚSICA BASEADA EM ESTADO + ARQUÉTIPO + LOOP 369
  async selectTrack(archetypeId: string, ctx: UserContext): Promise<Track> {
    const userState = await this.getUserState(ctx.userId);
    const phase = userState.loopPhase;

    // Filtros por fase do Loop 369
    const intensityRange = {
      PREPARACAO: [0, 40],
      EXPANSAO: [40, 80],
      INTEGRACAO: [60, 100]
    }[phase];

    const tracks = await prisma.track.findMany({
      where: {
        archetypeId,
        mood: this.mapObjetivoToMood(ctx.objetivo),
        energy: { gte: intensityRange[0], lte: intensityRange[1] },
        bpm: this.getBpmRangeForEnergy(ctx.energia)
      },
      include: { archetype: true }
    });

    // Algoritmo: escolhe por menor distância euclidiana de BPM + Energy
    return this.pickBestMatch(tracks, ctx.energia);
  }

  // 3. CALCULA TRANSIÇÃO COM CROSSFADE
  async calculateTransition(fromTrackId: string, toTrackId: string): Promise<NextTrackResult> {
    const [fromTrack, toTrack] = await Promise.all([
      prisma.track.findUnique({ where: { id: fromTrackId }, include: { archetype: true } }),
      prisma.track.findUnique({ where: { id: toTrackId }, include: { archetype: true } })
    ]);

    // Busca regra de transição entre arquétipos
    const transition = await prisma.transition.findFirst({
      where: {
        fromArchetypeId: fromTrack.archetypeId,
        toArchetypeId: toTrack.archetypeId
      },
      orderBy: { priority: 'desc' }
    });

    const bpmDelta = Math.abs(toTrack.bpm - fromTrack.bpm);
    const energyDelta = Math.abs(toTrack.energy - fromTrack.energy);

    // Crossfade dinâmico: quanto maior o delta, mais longo
    const crossfadeMs = transition?.crossfadeMs || Math.min(8000, 2000 + bpmDelta * 50 + energyDelta * 30);

    return {
      track: toTrack,
      crossfadeMs,
      transitionSound: transition?.transitionSound,
      newColor: toTrack.color,
      newAroma: toTrack.aroma,
      newMessage: toTrack.archetype.frase,
      newFrequency: toTrack.frequency
    };
  }

  // 4. LOOP 369 - AVANÇA FASE E ATUALIZA UI
  async advanceLoop369(userId: string) {
    const state = await this.getUserState(userId);
    const phases: Loop369[] = ['PREPARACAO', 'EXPANSAO', 'INTEGRACAO'];
    const currentIdx = phases.indexOf(state.loopPhase);
    const nextPhase = phases[(currentIdx + 1) % 3];

    await prisma.userState.update({
      where: { userId },
      data: {
        loopPhase: nextPhase,
        loopStartAt: nextPhase === 'PREPARACAO'? new Date() : state.loopStartAt
      }
    });

    // Retorna ajustes de UI por fase
    return {
      PREPARACAO: { bpm: -10, intensity: -20, ui: 'dim', assistant: 'sussurro' },
      EXPANSAO: { bpm: +15, intensity: +30, ui: 'bright', assistant: 'ativo' },
      INTEGRACAO: { bpm: 0, intensity: +10, ui: 'glow', assistant: 'reflexivo' }
    }[nextPhase];
  }

  // Helpers
  private mapObjetivoToMood(obj: string): string {
    const map = {
      'focar': 'focus', 'estudar': 'focus',
      'criar': 'create', 'escrever': 'create',
      'treinar': 'workout', 'energia': 'workout',
      'relaxar': 'sleep', 'meditar': 'sleep',
      'emocionar': 'emotion'
    };
    return map[obj] || 'focus';
  }

  private getBpmRangeForEnergy(energia: number) {
    if (energia < 30) return { lte: 70 }; // Baixa
    if (energia < 70) return { gte: 70, lte: 100 }; // Média
    return { gte: 100 }; // Alta
  }

  private async getNextArchetypeInFlow(currentId: string): Promise<string> {
    // Sequência padrão: Atlas → Nova → Vitalis → Pulse → Serena → Atlas
    const flow = ['atlas', 'nova', 'vitalis', 'pulse', 'serena'];
    const current = await prisma.archetype.findUnique({ where: { id: currentId } });
    const idx = flow.indexOf(current.nome.toLowerCase());
    const nextNome = flow[(idx + 1) % flow.length];
    const next = await prisma.archetype.findFirst({ where: { nome: { contains: nextNome, mode: 'insensitive' } } });
    return next.id;
  }
}
