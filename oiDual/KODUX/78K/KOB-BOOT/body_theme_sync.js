// ESPIRITO/core/body_theme_sync.js
// ─────────────────────────────────────────────────────────────
// Copia data-arch e todas as CSS custom properties (--*) do
// <html> pro <body>, sempre por último, via MutationObserver.
// ─────────────────────────────────────────────────────────────

export function initBodyThemeSync() {
    let scheduled = false;
    const copiedVars = new Set();

    function sync() {
        scheduled = false;
        const html = document.documentElement;
        const body = document.body;
        if (!body) return;

        body.dataset.arch = html.dataset.arch || '';

        copiedVars.forEach(prop => {
            if (!html.style.getPropertyValue(prop)) {
                body.style.removeProperty(prop);
                copiedVars.delete(prop);
            }
        });

        const style = html.style;
        for (let i = 0; i < style.length; i++) {
            const prop = style[i];
            if (!prop.startsWith('--')) continue;
            body.style.setProperty(prop, style.getPropertyValue(prop));
            copiedVars.add(prop);
        }
    }

    function queue() {
        if (scheduled) return;
        scheduled = true;
        requestAnimationFrame(sync);
    }

    if (document.body) sync();
    else document.addEventListener('DOMContentLoaded', sync, { once: true });

    new MutationObserver(queue).observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['data-arch', 'style']
    });

    console.log('[BodyThemeSync] ativo');
}
