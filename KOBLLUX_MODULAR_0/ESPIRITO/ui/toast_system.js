/**
 * ⧈ KOBLLUX_Δ³ :: ESPIRITO/ui/toast_system.js
 * #typescript
 * Sistema de Notificações Efêmeras (Toasts)
 * Δ7: Gestão de Estado e Componentes (TypeScript)
 */
export const ToastSystem = {
    show(message, type = 'info', duration = 3000) {
        let container = document.getElementById('toasterWrap');
        if (!container) {
            container = document.createElement('div');
            container.id = 'toasterWrap';
            container.className = 'toaster-wrap';
            document.body.appendChild(container);
        }
        
        const toast = document.createElement('div');
        toast.className = `toaster ${type}`;
        toast.innerText = message;
        container.appendChild(toast);
        
        setTimeout(() => toast.classList.add('show'), 10);
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, duration);
    },
    
    success(message, duration = 3000) {
        this.show(message, 'success', duration);
    },
    
    error(message, duration = 3000) {
        this.show(message, 'error', duration);
    },
    
    info(message, duration = 3000) {
        this.show(message, 'info', duration);
    }
};