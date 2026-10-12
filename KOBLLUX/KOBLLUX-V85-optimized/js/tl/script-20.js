/* TL · RGX opcional carregado sem bloquear o restante do runtime. */
document.addEventListener('DOMContentLoaded', async () => {
  const root = document.querySelector('#reader') || document.querySelector('#app') || document.body;
  root.dataset.koblluxRoot = '1';
  try {
    // O artefato MAP_RGX não veio no ZIP de origem. Mantém-se a tentativa
    // no caminho declarado originalmente, mas sem falhar todo o módulo TL.
    const mod = await import('./js/patches/MAP_RGX_v3_KOBLLUX.mjs');
    if (typeof mod.applyRGX === 'function') mod.applyRGX(root);
  } catch (err) {
    console.warn('[TL] Camada MAP_RGX opcional indisponível; restante do sistema preservado.', err);
  }
});
