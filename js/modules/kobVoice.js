/* ==========================================================
 * 78K - KOBVOICE GLOBAL PATCH
 * ========================================================== */

(() => {

  function getVoices() {
    return speechSynthesis.getVoices();
  }

  // força carregar vozes no Safari/iOS
  speechSynthesis.onvoiceschanged = () => {};

  function getArchetype(id) {
    return window.ARCHETYPE_MAP?.[id] || null;
  }

  function apply369(cfg = {}) {

    const clone = { ...cfg };

    if (typeof window.di_engineStep === "number") {
      clone.rate = (clone.rate ?? 1) + (window.di_engineStep * 0.05);
    }

    if (typeof window.di_jump === "number") {
      clone.pitch = (clone.pitch ?? 1) + (window.di_jump * 0.08);
    }

    if (window.di_reverse) {
      clone.pitch = Math.max(
        0.2,
        2 - (clone.pitch ?? 1)
      );
    }

    clone.rate = Math.max(0.1, Math.min(10, clone.rate ?? 1));
    clone.pitch = Math.max(0, Math.min(2, clone.pitch ?? 1));

    return clone;
  }

  function createUtterance(text, archetypeId) {

    const base = getArchetype(archetypeId) || {};

    const cfg = apply369(base);

    const u = new SpeechSynthesisUtterance(text);

    u.lang = cfg.lang || "pt-BR";
    u.pitch = cfg.pitch ?? 1;
    u.rate = cfg.rate ?? 1;
    u.volume = cfg.volume ?? 1;

    const voices = getVoices();

    if (cfg.voice) {

      const voice =
        voices.find(v => v.name === cfg.voice) ||
        voices.find(v => v.name.includes(cfg.voice)) ||
        voices.find(v => v.lang === u.lang);

      if (voice)
        u.voice = voice;

    }

    return u;
  }

  function speak(text, archetypeId) {

    speechSynthesis.cancel();

    const utterance = createUtterance(
      text,
      archetypeId
    );

    speechSynthesis.speak(utterance);

    return utterance;
  }

  function stop() {
    speechSynthesis.cancel();
  }

  window.KobVoice = {

    getVoices,

    getArchetype,

    apply369,

    createUtterance,

    speak,

    stop

  };

})();