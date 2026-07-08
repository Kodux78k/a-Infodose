// ESPIRITO/ui/system_panel.js

export class SystemPanel {
    constructor() {
        this.element = null;
    }

    mount(container) {
        this.element = document.createElement('div');
        this.element.innerHTML = this.getHTML();
        container.appendChild(this.element);
        
        this.initEvents();
        console.log('🧿 SystemPanel montado');
    }

    getHTML() {
        return `
            <div class="activation-wrap stagger-item">
                <div class="activation-toggle" onclick="toggleSection('systemCard')">
                    <div style="display:flex;align-items:center;gap:8px">
                        <div style="width:10px;height:10px;border-radius:99px;background:var(--neon-purple)"></div>
                        <strong style="letter-spacing:1px;font-size:0.9rem">SYSTEM & NEURAL</strong>
                    </div>
                    <div style="margin-left:auto;font-size:0.82rem;color:rgba(255,255,255,0.6)">CONFIG</div>
                </div>
                <div id="systemCard" class="activation-card activation-hidden">
                    <div class="col">
                        <div class="section-title">IDENTIDADE DA INFODOSE</div>
                        <input type="text" id="infodoseNameInput" placeholder="Nome: World System..." style="width:100%;margin-bottom:8px;padding:8px;border-radius:6px;background:rgba(0,0,0,0.3);border:1px solid rgba(255,255,255,0.1);color:#fff">

                        <div class="section-title" style="margin-top:8px">CONEXÃO NEURAL (SK)</div>
                        <input type="password" id="apiKeyInput" placeholder="sk-or-..." autocomplete="off" style="width:100%;margin-bottom:6px;padding:8px;border-radius:6px;background:rgba(0,0,0,0.3);border:1px solid rgba(255,255,255,0.1);color:#fff">
                        <input type="text" id="modelInput" placeholder="Modelo AI..." style="width:100%;margin-bottom:8px;padding:8px;border-radius:6px;background:rgba(0,0,0,0.3);border:1px solid rgba(255,255,255,0.1);color:#fff">

                        <div class="model-toggle">
                            <select id="modelSelect" class="btn btn-sec">
                                <option value="" disabled>Modelo</option>
                                <option value="allenai/molmo-2-8b:free">MolMo</option>
                                <option value="nvidia/nemotron-3-nano-30b-a3b:free">NemoTron</option>
                                <option value="mistralai/devstral-2512:free">DevStral</option>
                                <option value="openai/gpt-oss-120b:free">OSS120b</option>
                                <option value="custom-model">Custom</option>
                            </select>
                        </div>

                        <div class="section-title" style="margin-top:8px">TREINAMENTO</div>
                        <div style="display:flex;gap:6px">
                            <input type="file" id="trainingUpload" accept=".txt" style="display:none">
                            <button class="trigger-btn" onclick="document.getElementById('trainingUpload').click()" style="padding:8px;flex:1">UPLOAD .TXT</button>
                            <button id="exportTrainingBtn" class="trigger-btn" style="padding:8px;flex:1">BAIXAR</button>
                        </div>
                        <div id="trainingFileName" class="small" style="margin-top:4px;color:#9bd;font-size:0.75rem">Vazio</div>

                        <div class="panel-divider" style="margin:10px 0"></div>

                        <div style="display:flex; flex-direction:column; gap:6px;">
                            <div style="display:flex;align-items:center;gap:6px;font-size:0.85rem">
                                <input type="checkbox" id="assistantActiveCheckbox"> <label>Infodose Ativa</label>
                            </div>
                            <div style="display:flex;align-items:center;gap:6px;font-size:0.85rem">
                                <input type="checkbox" id="trainingActiveCheckbox"> <label>Treinamento Ativo</label>
                            </div>
                            <div style="display:flex;align-items:center;gap:6px;font-size:0.85rem">
                                <input type="checkbox" id="zenModeCheckbox"> <label>Modo Zen</label>
                            </div>
                        </div>

                        <button id="saveSystemBtn" class="trigger-btn" style="margin-top:12px;background:var(--neon-cyan);color:#000;border:none;font-weight:700">SALVAR CONFIGURAÇÃO</button>
                    </div>
                </div>
            </div>
        `;
    }

    initEvents() {
        const saveBtn = this.element.querySelector('#saveSystemBtn');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => {
                console.log('💾 Configuração salva');
                if (window.toast) window.toast('Configuração salva!', 'success');
            });
        }
    }
}