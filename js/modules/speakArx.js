function createUtterance(text, archetypeId){

    const cfg = getArchetypeConfig(archetypeId);

    const u = new SpeechSynthesisUtterance(text);

    if(!cfg) return u;

    u.lang = cfg.lang || "pt-BR";
    u.pitch = cfg.pitch ?? 1;
    u.rate = cfg.rate ?? 1;

    const voices = speechSynthesis.getVoices();

    const voice = voices.find(v =>
        v.name.includes(cfg.voice)
    );

    if(voice)
        u.voice = voice;

    return u;
}

speechSynthesis.speak(
    createUtterance(text,currentArchName)
);