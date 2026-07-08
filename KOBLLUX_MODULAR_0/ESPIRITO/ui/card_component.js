// ESPIRITO/ui/card_component.js

export class CardComponent {
    constructor() {
        this.element = null;
    }

    mount(container) {
        this.element = document.createElement('div');
        this.element.innerHTML = this.getHTML();
        container.appendChild(this.element);
        
        // Inicializar eventos
        this.initEvents();
        
        console.log('🧿 CardComponent montado');
    }

    getHTML() {
        return `
            <div class="container">
                <div class="fusion-card closed" id="mainCard">
                    <div class="card-header" id="cardHeader">
                        <div class="avatar-slot" id="avatarTarget"></div>
                        <div class="text-block">
                            <div class="greeting-row">
                                <span class="txt-thin" id="lblHello">Oi, </span>
                                <span class="txt-heavy" id="lblName">Convidado</span>
                            </div>
                            <div class="brand-dual">DUAL</div>
                        </div>
                        <div class="clock-widget">
                            <div class="time-display" id="clockTime">00:00</div>
                            <span class="status-led">ONLINE</span>
                        </div>
                        <button class="hud-menu-btn" id="hudMenuBtn" title="Menu Rápido">
                            <i data-lucide="menu"></i>
                        </button>
                    </div>

                    <div class="orb-menu-trigger" id="orbMenuTrigger" title="Menu Rápido">●●●</div>
                    <div class="drag-handle"></div>

                    <div class="small-preview" id="smallPreview" title="Gerenciar Chaves">
                        <div class="mini-avatar" id="smallMiniAvatar"></div>
                        <div class="small-text" id="smallText">Aguardando ativação...</div>
                        <div class="ident-badge" id="smallIdent">--</div>
                    </div>

                    <div class="card-body" id="cardBody">
                        <div class="input-wrapper stagger-item">
                            <input type="text" class="cyber-input" id="inputUser" placeholder="Identifique-se..." autocomplete="off">
                        </div>

                        <div class="stagger-item" style="margin-top:4px">
                            <div class="stat-lbl" style="margin-bottom:6px">INTERFACE MODE</div>
                            <div style="display:flex; gap:8px;">
                                <button class="trigger-btn mode-btn active-mode" id="btnModeCard" onclick="setMode('card')" style="flex:1" title="Modo Padrão">CARD</button>
                                <button class="trigger-btn mode-btn" id="btnModeOrb" onclick="setMode('orb')" style="flex:1" title="Flutuante">ORB</button>
                                <button class="trigger-btn mode-btn" id="btnModeHud" onclick="setMode('hud')" style="flex:1" title="Barra de Topo">HUD</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    initEvents() {
        const cardHeader = this.element.querySelector('#cardHeader');
        const mainCard = this.element.querySelector('#mainCard');
        
        if (cardHeader && mainCard) {
            cardHeader.addEventListener('click', () => {
                mainCard.classList.toggle('closed');
            });
        }
    }
}