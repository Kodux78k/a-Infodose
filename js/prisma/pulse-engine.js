import { pulseEngine } from './pulse-engine-monolith';

const composicao = await pulseEngine.montarComposicao({
  userId: '123',
  energia: 45,
  emocao: 'focused',
  objetivo: 'FOCO',
  horario: new Date(),
  tempoDeUsoMin: 12
});

// Toca: composicao.stems.track + ambiente + pulso
// Aplica: composicao.cor, composicao.aroma, composicao.mensagem
