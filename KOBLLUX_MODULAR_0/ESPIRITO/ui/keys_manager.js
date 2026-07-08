// ESPIRITO/ui/keys_manager.js

export class KeysManager {
    constructor() {
        this.element = null;
    }

    mount(container) {
        this.element = document.createElement('div');
        this.element.innerHTML = this.getHTML();
        container.appendChild(this.element);
        
        this.initEvents();
        console.log('🧿 KeysManager montado');
    }

    getHTML() {
        return `
            <div id="keysModal" class="modal-overlay" aria-hidden="true">
                <div class="keys-card" role="dialog">
                    <div class="keys-header">
                        <div>
                            <div id="keysTitle" style="font-weight:800;font-size:1.1rem;color:var(--neon-cyan)">USER KEYS MANAGER</div>
                            <div style="color:rgba(255,255,255,0.6);font-size:0.85rem">Gerencie suas chaves API com segurança local (Cofre).</div>
                        </div>
                        <button id="closeKeysBtn" class="small-btn">X</button>
                    </div>
                    <div class="key-list" id="keyList"></div>
                    <div class="form-section">
                        <div class="form-grid">
                            <input id="keyNameInput" placeholder="Nome da chave (ex: Principal)">
                            <input id="keyTokenInput" type="password" placeholder="Token / ESK (Opcional)">
                        </div>
                        <div class="form-row">
                            <input id="keyWebhookInput" placeholder="Webhook URL (https://...)" style="flex:1">
                            <button id="testWebhookBtn" class="small-btn" title="Testar Conexão">PING</button>
                        </div>
                        <button id="addKeyBtn" class="small-btn" style="width:100%;margin-top:8px;background:rgba(255,255,255,0.1)">ADICIONAR CHAVE</button>
                    </div>
                    <div style="display:flex;gap:8px;justify-content:space-between;margin-top:15px;border-top:1px solid rgba(255,255,255,0.05);padding-top:12px">
                        <div style="font-size:0.7rem;color:rgba(255,255,255,0.4);display:flex;align-items:center;gap:5px">
                            <i data-lucide="shield-check" style="width:14px"></i> <span id="vaultStatusText">Cofre Aberto</span>
                        </div>
                        <div style="display:flex;gap:8px">
                            <button id="lockVaultBtn" class="small-btn danger">BLOQUEAR</button>
                            <button id="exportKeysBtn" class="small-btn">Export</button>
                            <button id="importKeysBtn" class="small-btn">Import</button>
                            <input id="importFileInput" type="file" accept="application/json" style="display:none">
                        </div>
                    </div>
                </div>
            </div>

            <div id="vaultModal" class="modal-overlay" aria-hidden="true">
                <div class="keys-card">
                    <div class="vault-icon"><i data-lucide="lock" style="width:24px;height:24px"></i></div>
                    <h3 style="margin:0 0 10px 0;font-weight:800">ACESSO AO COFRE</h3>
                    <p style="margin:0 0 15px 0;font-size:0.9rem;color:rgba(255,255,255,0.6)">Seus dados estão criptografados. Digite a senha para desbloquear.</p>
                    <input type="password" id="vaultPassInput" class="cyber-input" style="text-align:center;margin-bottom:12px" placeholder="Senha...">
                    <div style="display:flex;gap:8px;justify-content:center">
                        <button id="vaultCancelBtn" class="small-btn">Cancelar</button>
                        <button id="vaultUnlockBtn" class="small-btn active-btn">DESBLOQUEAR</button>
                    </div>
                </div>
            </div>
        `;
    }

    initEvents() {
        const closeBtn = this.element.querySelector('#closeKeysBtn');
        const keysModal = this.element.querySelector('#keysModal');
        
        if (closeBtn && keysModal) {
            closeBtn.addEventListener('click', () => {
                keysModal.style.display = 'none';
            });
        }
    }

    open() {
        const keysModal = this.element.querySelector('#keysModal');
        if (keysModal) keysModal.style.display = 'flex';
    }

    close() {
        const keysModal = this.element.querySelector('#keysModal');
        if (keysModal) keysModal.style.display = 'none';
    }
}