/* ═══════════ KXT TTS · liga/desliga GERAL da voz (botão do topo) ═══════════ */
(() => {
  if (window.KXT_TTS) return;
  const LS = localStorage, KEY = 'di_ttsOn';
  const T = { on: LS.getItem(KEY) !== '0' };
  const ss = window.speechSynthesis;

  // porteiro: bloqueia QUALQUER fala (App, card, patches) quando o som está desligado.
  // precisa ser o wrapper mais externo (carregado depois da ponte, que marca os orbs).
  if (ss && !ss.__kxtGate) {
    const orig = ss.speak.bind(ss);
    ss.speak = function (u) { if (!T.on && !(u && u.__force)) return; return orig(u); };
    ss.__kxtGate = true;
  }

  const btn = () => document.getElementById('solarH2TTS');
  function paint() {
    document.body.classList.toggle('tts-off', !T.on);
    const b = btn(); if (!b) return;
    b.textContent = T.on ? '🔊' : '🔇';
    b.classList.toggle('tts-off', !T.on);
    b.setAttribute('aria-pressed', String(T.on));
    b.title = T.on ? 'Som ligado — toque para silenciar · segure para ouvir a última resposta' : 'Som desligado — toque para ligar';
  }
  function toast(msg) { try { if (typeof window.showToaster === 'function') window.showToaster(msg, 'success'); } catch (e) {} }

  function set(on, opts) {
    T.on = !!on; LS.setItem(KEY, on ? '1' : '0');
    if (!on) { try { ss && ss.cancel(); } catch (e) {} document.querySelectorAll('.dual-orb-wrap').forEach((el) => el.classList.remove('speaking')); }
    paint();
    if (!(opts && opts.silent)) {
      toast(on ? '🔊 Som ligado' : '🔇 Som desligado');
      if (on && ss) { try { const u = new SpeechSynthesisUtterance('Som ligado'); u.lang = 'pt-BR'; u.__force = true; ss.speak(u); } catch (e) {} }
    }
  }

  function readLast() {
    if (!T.on) { toast('🔇 Ligue o som para ouvir'); return; }
    const msgs = (window.App && App.state && App.state.messages) || [];
    let last = null; for (let i = msgs.length - 1; i >= 0; i--) if (msgs[i].role === 'assistant') { last = msgs[i]; break; }
    if (!last) { toast('Nenhuma resposta da IA ainda'); return; }
    const text = String(last.content).replace(/<[^>]*>/g, '').trim(); if (!text || !ss) return;
    if (ss.speaking) { ss.cancel(); return; }
    const u = new SpeechSynthesisUtterance(text); u.lang = 'pt-BR'; u.rate = 1.1; ss.speak(u);
  }

  function bindButton(b) {
    if (!b || b.__kxtTts) return; b.__kxtTts = true;
    let timer = null, long = false;
    b.addEventListener('pointerdown', () => { long = false; clearTimeout(timer); timer = setTimeout(() => { long = true; readLast(); }, 600); }, { passive: true });
    const end = () => clearTimeout(timer);
    b.addEventListener('pointerup', end, { passive: true }); b.addEventListener('pointerleave', end, { passive: true }); b.addEventListener('pointercancel', end, { passive: true });
    b.addEventListener('click', () => { if (long) { long = false; return; } set(!T.on); });
    paint();
  }

  window.KXT_TTS = { get on() { return T.on; }, set, toggle: () => set(!T.on), bindButton, paint, readLast };
  if (window.KXT_ready) KXT_ready(paint);
})();
