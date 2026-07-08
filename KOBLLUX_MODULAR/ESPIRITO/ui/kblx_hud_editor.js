/**
⧈ KOBLLUX_Δ³ :: ESPIRITO/ui/kblx_hud_editor.js
#javascript
0×0B ARQUÉTIPO · KBLX HUD EDITOR PANEL
*/
export const KblxHudEditor = {
  init() {
    console.log('KblxHudEditor: Ativado');
    this.bindSave();
    this.bindClose();
  },

  bindSave() {
    const btn = document.getElementById('kblx-btn-save');
    const inp = document.getElementById('kblx-inp');
    if (btn && inp) {
      btn.addEventListener('click', () => {
        const url = inp.value;
        // salvar no botão de origem
      });
    }
  },

  bindClose() {
    const btn = document.getElementById('kblx-btn-close');
    const back = document.getElementById('kblx-back');
    if (btn && back) {
      btn.addEventListener('click', () => {
        back.setAttribute('aria-hidden', 'true');
      });
    }
  },

  open(targetBtnId) {
    const back = document.getElementById('kblx-back');
    if (back) back.setAttribute('aria-hidden', 'false');
  }
};