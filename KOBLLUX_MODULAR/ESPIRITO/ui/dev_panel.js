/**
 * ⧈ KOBLLUX_Δ³ :: ESPIRITO/ui/dev_panel.js
 * #javascript #typescript
 * Painel de Desenvolvimento KOBLLUX
 * Δ7: Gestão de Estado e Componentes (TypeScript)
 */

export class DevPanel {
    constructor() {
        this.isOpen = false;
        this.panel = null;
        console.log("⧈ DevPanel: Inicializado");
    }

    init() {
        console.log("⧈ DevPanel: Ativado");
        this.createPanel();
        this.bindEvents();
    }

    createPanel() {
        // Criar painel de desenvolvimento
        this.panel = document.createElement('div');
        this.panel.id = 'kobllux-dev-panel';
        this.panel.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            width: 300px;
            max-height: 80vh;
            background: rgba(10, 10, 20, 0.95);
            border: 1px solid rgba(0, 242, 255, 0.3);
            border-radius: 12px;
            padding: 16px;
            color: #fff;
            font-family: 'JetBrains Mono', monospace;
            font-size: 12px;
            z-index: 99999;
            display: none;
            overflow-y: auto;
            backdrop-filter: blur(10px);
        `;

        this.panel.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                <strong style="color: var(--neon-cyan, #00f2ff);">⧈ KOBLLUX Dev Panel</strong>
                <button id="dev-panel-close" style="background: none; border: none; color: #fff; cursor: pointer; font-size: 16px;">✕</button>
            </div>
            <div id="dev-panel-content">
                <div style="margin-bottom: 12px;">                    <strong>Status:</strong>
                    <div id="dev-status" style="color: var(--neon-success, #00ff9d); margin-top: 4px;">Online</div>
                </div>
                <div style="margin-bottom: 12px;">
                    <strong>Informações:</strong>
                    <div style="margin-top: 4px; line-height: 1.6;">
                        <div>Versão: V7-MODULAR</div>
                        <div>Frequência: 1134Hz</div>
                        <div>Arquitetura: Fractal 3×6×9×7</div>
                    </div>
                </div>
                <div>
                    <strong>Ações:</strong>
                    <div style="margin-top: 8px; display: flex; flex-direction: column; gap: 6px;">
                        <button id="dev-btn-inspect" style="background: rgba(0, 242, 255, 0.1); border: 1px solid rgba(0, 242, 255, 0.3); color: #fff; padding: 6px; border-radius: 6px; cursor: pointer;">🔍 Inspecionar DOM</button>
                        <button id="dev-btn-logs" style="background: rgba(0, 242, 255, 0.1); border: 1px solid rgba(0, 242, 255, 0.3); color: #fff; padding: 6px; border-radius: 6px; cursor: pointer;">📋 Ver Logs</button>
                        <button id="dev-btn-clear" style="background: rgba(255, 42, 109, 0.1); border: 1px solid rgba(255, 42, 109, 0.3); color: #fff; padding: 6px; border-radius: 6px; cursor: pointer;">🗑️ Limpar Console</button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(this.panel);
    }

    bindEvents() {
        const closeBtn = this.panel.querySelector('#dev-panel-close');
        const inspectBtn = this.panel.querySelector('#dev-btn-inspect');
        const logsBtn = this.panel.querySelector('#dev-btn-logs');
        const clearBtn = this.panel.querySelector('#dev-btn-clear');

        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.toggle());
        }

        if (inspectBtn) {
            inspectBtn.addEventListener('click', () => {
                console.log('⧈ KOBLLUX DevPanel: Inspecionando DOM...');
                console.log('Elementos principais:', {
                    mainCard: document.getElementById('mainCard'),
                    cardBody: document.getElementById('cardBody'),
                    userInput: document.getElementById('userInput'),
                    response: document.getElementById('response')
                });
            });
        }

        if (logsBtn) {
            logsBtn.addEventListener('click', () => {
                console.log('⧈ KOBLLUX DevPanel: Logs do sistema');                if (window.KOBLLUX) {
                    console.log('KOBLLUX State:', window.KOBLLUX.state);
                    console.log('KOBLLUX Engines:', window.KOBLLUX.engines);
                }
            });
        }

        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                console.clear();
                console.log('⧈ KOBLLUX DevPanel: Console limpo');
            });
        }
    }

    toggle() {
        this.isOpen = !this.isOpen;
        if (this.panel) {
            this.panel.style.display = this.isOpen ? 'block' : 'none';
        }
        console.log(`⧈ DevPanel: ${this.isOpen ? 'Aberto' : 'Fechado'}`);
    }

    show() {
        this.isOpen = true;
        if (this.panel) {
            this.panel.style.display = 'block';
        }
    }

    hide() {
        this.isOpen = false;
        if (this.panel) {
            this.panel.style.display = 'none';
        }
    }

    updateStatus(status, color = '#00ff9d') {
        const statusEl = this.panel?.querySelector('#dev-status');
        if (statusEl) {
            statusEl.textContent = status;
            statusEl.style.color = color;
        }
    }
}

// Exportar instância única (singleton)
export const devPanel = new DevPanel();