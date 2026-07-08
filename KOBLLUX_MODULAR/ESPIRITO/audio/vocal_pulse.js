/**
 * ⧈ KOBLLUX_Δ³ :: ESPIRITO/audio/vocal_pulse.js
 * #typescript
 * Processamento de Voz e TTS (Text-to-Speech)
 * Δ7: Gestão de Estado (TypeScript)
 */

export const VocalPulse = {
    isSpeaking: false,

    init() {
        console.log("VocalPulse: Ativado");
        // Forçar carregamento de vozes
        if ('speechSynthesis' in window) {
            window.speechSynthesis.getVoices();
        }
    },

    speak(text, voiceIndex = 0) {
        if (!('speechSynthesis' in window)) return;
        
        window.speechSynthesis.cancel();
        const msg = new SpeechSynthesisUtterance(text);
        msg.lang = 'pt-BR';
        msg.rate = 1.0;
        msg.pitch = 1.0;
        
        const voices = window.speechSynthesis.getVoices();
        if (voices.length > 0) {
            msg.voice = voices[voiceIndex] || voices[0];
        }

        msg.onstart = () => { 
            this.isSpeaking = true; 
            console.log("VocalPulse: Falando...");
        };
        msg.onend = () => { 
            this.isSpeaking = false; 
            console.log("VocalPulse: Silêncio");
        };
        
        window.speechSynthesis.speak(msg);
    },

    stop() {
        window.speechSynthesis.cancel();
        this.isSpeaking = false;
    }
};
