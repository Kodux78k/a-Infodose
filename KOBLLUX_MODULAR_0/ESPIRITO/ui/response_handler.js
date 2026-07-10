// ESPIRITO/ui/response_handler.js

export class ResponseHandler {
    constructor() {
        this.element = null;
    }

    mount(container) {
        this.element = document.createElement('div');
        this.element.innerHTML = this.getHTML();
        container.appendChild(this.element);

        this.initEvents();
        console.log('🧿 ResponseHandler montado');
    }

    getHTML() {
        return `
            <div class="response-container" id="response">
                <div class="page initial active">
                    <strong>Clique no ◉ e diga "Oi, Dual".</strong><br>
                    <em>Sempre único. Sempre seu.</em>
                </div>
                <div class="response-controls">
                    <div class="control-buttons">
                        <button class="control-btn copy-button" title="Copiar tudo">
                            <svg viewBox="0 0 24 24" width="20"><circle cx="12" cy="12" r="10"></circle><rect x="6" y="6" width="12" height="12"></rect></svg>
                        </button>
                        <button class="control-btn paste-button" title="Colar">
                            <svg viewBox="0 0 24 24" width="20"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="4" x2="12" y2="20"></line></svg>
                        </button>
                        <button id="toggleBtnF" class="control-btn toggle-button" title="Check Connection & Training">
                            <svg viewBox="0 0 24 24" width="20" height="20" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M18.36 6.64a9 9 0 1 1-12.73 0"></path>
                                <line x1="12" y1="2" x2="12" y2="12"></line>
                            </svg>
                        </button>
                        <button id="crystalBtn" class="control-btn" title="Cristalizados">
                            <svg viewBox="0 0 24 24" width="20" height="20"><path d="M12 2l2.9 6.3L21 10l-5 3.6L17.8 21 12 17.7 6.2 21 7 13.6 2 10l6.1-1.7L12 2z"></path></svg>
                        </button>
                    </div>
                    <div class="pagination">
                        <button data-action="prev">⟵</button>
                        <span id="pageIndicator">1 / 1</span>
                        <button data-action="next">⟶</button>
                    </div>
                </div>
            </div>

            <div class="input-container">
                <input id="userInput" type="text" placeholder="Diga: 'oi, Dual'...">
                <button id="sendBtn" title="Enviar">➤</button>
                <button id="voiceBtn" title="Falar">
                    <object data="Reset_buttom_Dual-Infodose.svg" type="image/svg+xml" width="36" height="36" style="pointer-events: none;"></object>
                </button>
            </div>

            <div id="crystalModal" class="modal">
                <div class="box">
                    <h3>Cristalizados</h3>
                    <div class="row" style="margin-bottom:8px">
                        <button id="exportAllCrystal" class="btn btn-prim">Exportar todos</button>
                        <button id="clearAllCrystal" class="btn btn-sec">Limpar tudo</button>
                    </div>
                    <div class="crystal-list" id="crystalList"></div>
                    <div style="margin-top:12px;display:flex;justify-content:flex-end;gap:8px">
                        <button id="closeCrystal" class="btn btn-sec">Fechar</button>
                    </div>
                </div>
            </div>

            <div id="mantra-toggle">
                <span id="mantra-text">Do seu jeito. <strong>Sempre</strong> único. <strong>Sempre</strong> seu.</span>
            </div>

            <div class="wrap">
                <div class="content">
                    <iframe id="frame" src="about:blank"></iframe>
                    <div id="kob-tts-outline"></div>
                </div>
            </div>

            <div id="fusion-soft-layer"></div>
            <div id="navRoot"></div>
        `;
    }

    initEvents() {
        const sendBtn = this.element.querySelector('#sendBtn');
        const userInput = this.element.querySelector('#userInput');

        if (sendBtn && userInput) {
            sendBtn.addEventListener('click', () => {
                const text = userInput.value;
                if (text) {
                    console.log('📤 Enviando:', text);
                    userInput.value = '';
                }
            });
        }
    }
}
