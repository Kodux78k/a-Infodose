// widget-pulse-integration.ts
class KoduxWidget {
  private pulseEngine = new PulseEngine();
  private audioContext = new AudioContext();
  private currentGain = this.audioContext.createGain();

  async onStateChange(newContext: UserContext) {
    // 1. Calcula próximo arquétipo
    const nextArchetypeId = await this.pulseEngine.calculateNextState(newContext);

    // 2. Seleciona música
    const nextTrack = await this.pulseEngine.selectTrack(nextArchetypeId, newContext);

    // 3. Calcula transição
    const currentTrackId = this.getCurrentTrackId();
    const transition = await this.pulseEngine.calculateTransition(currentTrackId, nextTrack.id);

    // 4. Executa crossfade
    await this.crossfadeTo(transition);

    // 5. Atualiza UI sincronizada
    this.updateUI({
      color: transition.newColor,
      aroma: transition.newAroma,
      message: transition.newMessage,
      frequency: transition.newFrequency
    });

    // 6. Registra evento
    await this.logPlayEvent(nextTrack.id, nextArchetypeId);

    // 7. Avança Loop 369 se necessário
    if (this.shouldAdvanceLoop()) {
      const loopUI = await this.pulseEngine.advanceLoop369(newContext.userId);
      this.applyLoop369UI(loopUI);
    }
  }

  private async crossfadeTo(t: NextTrackResult) {
    const newAudio = new Audio(t.track.url);
    const newGain = this.audioContext.createGain();
    newGain.gain.value = 0;

    // Toca som de transição se existir
    if (t.transitionSound) {
      const transitionAudio = new Audio(t.transitionSound);
      transitionAudio.play();
    }

    newAudio.play();

    // Crossfade
    this.currentGain.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + t.crossfadeMs / 1000);
    newGain.gain.linearRampToValueAtTime(1, this.audioContext.currentTime + t.crossfadeMs / 1000);

    this.currentGain = newGain;
  }

  private updateUI(data: {color: string, aroma: string, message: string, frequency: number}) {
    document.documentElement.style.setProperty('--primary', data.color);
    this.showAromaNotification(data.aroma);
    this.showMessage(data.message);
    this.playFrequencyTone(data.frequency); // 432Hz, 528Hz, etc
  }
}
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
