/* ╔══════════════════════════════════════════════════════════════╗
   ⚫ KOBLLUX DUAL APP · KODUX PLAYER & API BRIDGE
   Conecta o Espelho de Vidro ao Cérebro (API Porta 8000)
   ╚══════════════════════════════════════════════════════════════╝ */

const KOBLLUX_API = "http://localhost:8000/core";

const intentionInput = document.getElementById('intentionInput');
const responseText = document.getElementById('responseText');
const orbWrap = document.getElementById('orbWrap');
const orbContainer = document.getElementById('orbContainer');

// Inicializa o Player ao carregar
document.addEventListener('DOMContentLoaded', () => {
    // Renderiza o ORB inicial
    renderOrb("KOBLLUX");

    // Listener para o Enter no campo de intenção
    intentionInput.addEventListener('keypress', async (e) => {
        if (e.key === 'Enter' && intentionInput.value.trim() !== '') {
            await sendIntention(intentionInput.value.trim());
        }
    });

    // Clique no ORB para falar a última resposta
    orbContainer.addEventListener('click', () => {
        if (responseText.textContent && responseText.textContent !== "Aguardando o pulso...") {
            speakText(responseText.textContent, window.KOBLLUX_VOICES ? window.KOBLLUX_VOICES['kobllux'] : null);
        }
    });
});

// Envia a intenção para a API do KOBLLUX
async function sendIntention(text) {
    responseText.textContent = "O vórtice está processando...";
    orbWrap.classList.add('speaking');

    try {
        const response = await fetch(KOBLLUX_API, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: text })
        });
        
        if (!response.ok) throw new Error("Falha na conexão com o núcleo.");
        
        const data = await response.json();
        const infodose = data.response || "O silêncio respondeu.";
        
        responseText.textContent = infodose;
        speakText(infodose, window.KOBLLUX_VOICES ? window.KOBLLUX_VOICES['kobllux'] : null);
        
    } catch (error) {
        responseText.textContent = "O núcleo está em silêncio. Verifique a API na porta 8000.";
        orbWrap.classList.remove('speaking');
    }
}

// Renderiza o ORB 3D baseado no nome/arquétipo
function renderOrb(name = "KOBLLUX") {
    // Lógica simplificada de cor baseada no nome (Seed 1134)
    const seed = Array.from(name).reduce((a, c) => a + c.charCodeAt(0), 0) * 1134;
    const h1 = seed % 360;
    const h2 = (h1 + 120) % 360;
    
    orbWrap.style.setProperty('--orb-primary', `hsl(${h1}, 80%, 60%)`);
    orbWrap.style.setProperty('--orb-secondary', `hsl(${h2}, 80%, 40%)`);
}

// Motor de Voz (Web Speech API)
function speakText(text, archetypeConfig = null) {
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        
        if (archetypeConfig) {
            utterance.lang = archetypeConfig.lang || 'pt-BR';
            utterance.rate = archetypeConfig.rate || 1.0;
            utterance.pitch = archetypeConfig.pitch || 1.0;
            
            const voices = window.speechSynthesis.getVoices();
            const match = voices.find(v => v.name.toLowerCase().includes(archetypeConfig.voice.toLowerCase()));
            if (match) utterance.voice = match;
        } else {
            utterance.lang = 'pt-BR';
        }

        utterance.onend = () => orbWrap.classList.remove('speaking');
        utterance.onerror = () => orbWrap.classList.remove('speaking');
        
        window.speechSynthesis.speak(utterance);
    } else {
        orbWrap.classList.remove('speaking');
    }
}