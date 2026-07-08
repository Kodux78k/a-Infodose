/**
⧈ KOBLLUX_Δ³ :: ESPIRITO/player/player_shell.js
#javascript
0×02 INTEGRAR · Body Player Shell
Gerencia iframe, watermark e symbol bar
*/
export const PlayerShell = {
  init() {
    console.log('PlayerShell: Ativado');
    this.bindNavigation();
    this.bindSymbolBar();
  },

  bindNavigation() {
    const buttons = ['btn-phi', 'btn-viv', 'btn-home', 'btn-doc'];
    buttons.forEach(id => {
      const btn = document.getElementById(id);
      if (btn) {
        btn.addEventListener('click', () => {
          const url = btn.dataset.url;
          if (url) this.navigate(url);
        });
      }
    });
  },

  navigate(url) {
    const frame = document.getElementById('frame');
    if (frame) frame.src = url;
  },

  bindSymbolBar() {
    const prev = document.getElementById('btn-prev');
    const play = document.getElementById('btn-play');
    const next = document.getElementById('btn-next');
    // bind play/pause/prev/next do frame
  }
};