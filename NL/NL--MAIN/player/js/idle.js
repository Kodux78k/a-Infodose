(function() {
  const bodyPlayer = document.getElementById('bodyPlayer');
  const idleSelector = '.kob-tts-dock, #kodux-widget, [data-idle-target]';
  let idleTimer = null;

  function getIdleTargets() {
    return document.querySelectorAll(idleSelector);
  }

  function setIdleState(isIdle) {
    getIdleTargets().forEach(el => el.classList.toggle('idle', isIdle));
  }

  function resetIdle() {
    setIdleState(false);
    clearTimeout(idleTimer);
    idleTimer = setTimeout(() => setIdleState(true), 1870);
  }

  function setMode(mode = 'player') {
    if (!bodyPlayer) return;
    bodyPlayer.dataset.mode = mode;
  }

  window.KoduxShell = {
    setMode,
    resetIdle
  };

  ['pointerdown', 'pointermove', 'touchstart', 'mousemove', 'scroll'].forEach(ev => {
    document.addEventListener(ev, resetIdle, { passive: true });
  });

  document.addEventListener('keydown', resetIdle);

  setMode(bodyPlayer?.dataset.mode || 'player');
  resetIdle();
})();