"use strict";

console.log("[Studio Core] Extensão carregada com sucesso.");

// --- Bloco Inline Extraído #1 ---

    (() => {
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

      // Função para Ocultar / Exibir o container DualTube com segurança
      function toggleDualTube() {
        const viewDT = document.getElementById('view-dualtube');
        const icon = document.getElementById('toggle-dt-icon');
        
        if (viewDT) {
          if (viewDT.classList.contains('hidden')) {
            viewDT.classList.remove('hidden');
            if (icon) icon.className = 'ph ph-eye text-xl';
          } else {
            viewDT.classList.add('hidden');
            if (icon) icon.className = 'ph ph-eye-slash text-xl';
          }
        }
      }

      window.KoduxShell = {
        setMode,
        resetIdle,
        toggleDualTube
      };

      window.toggleDualTube = toggleDualTube;

      ['pointerdown', 'pointermove', 'touchstart', 'mousemove', 'scroll'].forEach(ev => {
        document.addEventListener(ev, resetIdle, { passive: true });
      });

      document.addEventListener('keydown', resetIdle);

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          const player = document.getElementById('global-player');
          if (player) {
            player.style.display = 'block';
            player.classList.add('open');
          }
        }
      });

      setMode(bodyPlayer?.dataset.mode || 'player');
      resetIdle();
    })();
  
