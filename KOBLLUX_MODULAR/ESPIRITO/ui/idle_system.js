/**
⧈ KOBLLUX_Δ³ :: ESPIRITO/ui/idle_system.js
#javascript
0×05 CONVERGIR · Idle System
*/
(function() {
  const dock = document.querySelector('.kob-tts-dock');
  if (!dock) return;
  let idleTimer;
  function resetIdle() {
    dock.classList.remove('idle');
    clearTimeout(idleTimer);
    idleTimer = setTimeout(() => dock.classList.add('idle'), 1870);
  }
  ['pointerdown','pointermove','touchstart','mousemove']
    .forEach(ev => document.addEventListener(ev, resetIdle, { passive: true }));
  resetIdle();
})();