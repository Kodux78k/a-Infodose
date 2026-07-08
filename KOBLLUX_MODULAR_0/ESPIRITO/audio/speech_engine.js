/**
 * SPEECH ENGINE · A VOZ DE BLLUE (O SOPRO)
 * Opcode 0x08 · TESTEMUNHAR · 852Hz
 * Transforma a Infodose em vibração sonora. Modula a voz para ressoar com Schumann.
 */

export class SpeechEngine {
    constructor() {
        this.synth = window.speechSynthesis;
        this.voice = null;
        this.isSpeaking = false;
        this._initVoices();
    }

    _initVoices() {
        const loadVoices = () => {
            const voices = this.synth.getVoices();
            // Busca uma voz em português que soe mais "humana" ou "profunda"
            this.voice = voices.find(v => v.lang.startsWith('pt') && v.name.includes('Female')) 
                      || voices.find(v => v.lang.startsWith('pt')) 
                      || voices[0];
        };
        
        loadVoices();
        if (speechSynthesis.onvoiceschanged !== undefined) {
            speechSynthesis.onvoiceschanged = loadVoices;
        }
    }

    // Falar a Infodose (O Verbo se faz som)
    speak(text, options = {}) {
        if (!this.synth) return;

        // Cancela qualquer fala anterior (Ruptura de Desincronia)
        this.synth.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        
        if (this.voice) utterance.voice = this.voice;
        
        // Modulação Fractal (Ressonância Harmônica)
        utterance.rate = options.rate || 0.9; // Lento, como a água fluindo
        utterance.pitch = options.pitch || 1.1; // Levemente agudo, como o espírito
        utterance.volume = options.volume || 0.8;

        utterance.onstart = () => {
            this.isSpeaking = true;
            window.DualBus.emit('audio:start', text);
        };

        utterance.onend = () => {
            this.isSpeaking = false;
            window.DualBus.emit('audio:end');
        };

        this.synth.speak(utterance);
    }

    // O Silêncio (A pausa entre os ciclos)
    stop() {
        this.synth.cancel();
        this.isSpeaking = false;
        window.DualBus.emit('audio:end');
    }
}

window.DualVoice = new SpeechEngine();