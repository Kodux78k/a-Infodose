/* 78TL · script-20 — engine RGX (módulo)
   Original: `import { applyRGX } from './js/patches/MAP_RGX_v3_KOBLLUX.mjs'` em <script> clássico
   (SyntaxError no navegador → nunca executava). Agora: <script type="module"> + import dinâmico
   protegido. Se o arquivo js/patches/MAP_RGX_v3_KOBLLUX.mjs não existir, o engine fica desativado
   sem quebrar o resto. */
(async () => {
  let applyRGX;
  try { ({ applyRGX } = await import('./patches/MAP_RGX_v3_KOBLLUX.mjs')); }
  catch (e) { console.info('[78TL] MAP_RGX_v3_KOBLLUX.mjs ausente — engine RGX desativado'); return; }

  const run = () => {
    // raiz onde o markdown é renderizado
    const root =
      document.querySelector('#reader') ||
      document.querySelector('#app')    ||
      document.body;
    // marca o root pra animação do TTS e estilo local
    root.dataset.koblluxRoot = '1';
    // ativa o engine (chips, callouts, botões, IA, TTS)
    applyRGX(root);
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run); else run();
})();
