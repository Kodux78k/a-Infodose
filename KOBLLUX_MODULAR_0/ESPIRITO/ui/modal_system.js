/**
 * ⧈ KOBLLUX_Δ³ :: ESPIRITO/ui/modal_system.js
 * #typescript
 * Sistema de Janelas Modais e Diálogos
 * Δ7: Gestão de Estado e Componentes (TypeScript)
 */
export const ModalSystem = {
    show(html, customClass = '') {
        let overlay = document.getElementById('modal-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 'modal-overlay';
            overlay.className = 'modal-overlay';
            overlay.innerHTML = `<div id="modal-content" class="keys-card ${customClass}"></div>`;
            document.body.appendChild(overlay);
        }
        
        const content = document.getElementById('modal-content');
        content.innerHTML = html;
        overlay.style.display = 'flex';
        
        if (window.lucide) window.lucide.createIcons();
    },
    
    hide() {
        const overlay = document.getElementById('modal-overlay');
        if (!overlay) return;
        overlay.style.display = 'none';
    },
    
    toggle() {
        const overlay = document.getElementById('modal-overlay');
        if (!overlay) return;
        overlay.style.display = overlay.style.display === 'flex' ? 'none' : 'flex';
    }
};