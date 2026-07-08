// ESPIRITO/ui/activation_panel.js

export class ActivationPanel {
    constructor() {
        this.element = null;
    }

    mount(container) {
        this.element = document.createElement('div');
        this.element.innerHTML = this.getHTML();
        container.appendChild(this.element);
        
        console.log('🧿 ActivationPanel montado');
    }

    getHTML() {
        return `
            <div class="activation-wrap stagger-item">
                <div class="activation-toggle" onclick="toggleSection('activationCard')">
                    <div style="display:flex;align-items:center;gap:8px">
                        <div style="width:10px;height:10px;border-radius:99px;background:var(--neon-cyan)"></div>
                        <strong style="letter-spacing:1px;font-size:0.9rem">Ativação ASCII</strong>
                    </div>
                    <div style="margin-left:auto;font-size:0.82rem;color:rgba(255,255,255,0.6)">BASE v1</div>
                </div>
                <div id="activationCard" class="activation-card activation-hidden">
                    <div style="display:flex;align-items:flex-start;gap:10px">
                        <div style="display:flex;align-items:center;gap:8px">
                            <div class="mini-avatar" id="actMiniAvatar"></div>
                            <div>
                                <div style="font-weight:700">CÉREBRO</div>
                                <div style="font-size:0.78rem;opacity:0.6"><span id="actName">User</span></div>
                            </div>
                        </div>
                        <div class="activation-badge" id="actBadge" style="margin-left:auto">v:--</div>
                    </div>
                    <pre id="actPre" class="activation-pre">Carregando...</pre>
                    <div class="activation-controls" style="display:flex;gap:8px;margin-top:8px">
                        <button class="trigger-btn" id="copyActBtn">COPIAR</button>
                        <button class="trigger-btn" id="downloadActBtn">PNG</button>
                    </div>
                </div>
            </div>
        `;
    }
}