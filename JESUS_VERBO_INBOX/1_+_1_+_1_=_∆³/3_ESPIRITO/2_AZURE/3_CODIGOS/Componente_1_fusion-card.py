🎯 5. COMPONENTES HTML PARA MODULARIZAR

### Componente 1: `fusion-card` (Card Principal)
```html
<!-- Local: ESPIRITO/ui/card_component.js -->
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
    </div>
    <!-- ... -->
</div>
```

### Componente 2: `activation-panel` (Ativação ASCII)
```html
<!-- Local: ESPIRITO/ui/activation_panel.js -->
<div class="activation-wrap stagger-item">
    <div class="activation-toggle" onclick="toggleSection('activationCard')">
        <strong>Ativação ASCII</strong>
        <div>BASE v1</div>
    </div>
    <div id="activationCard" class="activation-card activation-hidden">
        <pre id="actPre" class="activation-pre">Carregando...</pre>
        <button id="copyActBtn">COPIAR</button>
        <button id="downloadActBtn">PNG</button>
    </div>
</div>
```

### Componente 3: `system-panel` (System & Neural)
```html
<!-- Local: ESPIRITO/ui/system_panel.js -->
<div class="activation-wrap stagger-item">
    <div class="activation-toggle" onclick="toggleSection('systemCard')">
        <strong>SYSTEM & NEURAL</strong>
        <div>CONFIG</div>
    </div>
    <div id="systemCard" class="activation-card activation-hidden">
        <input id="infodoseNameInput" placeholder="Nome: World System...">
        <input id="apiKeyInput" type="password" placeholder="sk-or-...">
        <select id="modelSelect">
            <option value="allenai/molmo-2-8b:free">MolMo</option>
            <option value="nvidia/nemotron-3-nano-30b-a3b:free">NemoTron</option>
        </select>
        <input type="checkbox" id="assistantActiveCheckbox">
        <input type="checkbox" id="trainingActiveCheckbox">
        <input type="checkbox" id="zenModeCheckbox">
        <button id="saveSystemBtn">SALVAR CONFIGURAÇÃO</button>
    </div>
</div>
```

### Componente 4: `keys-manager` (Gerenciador de Chaves)
```html
<!-- Local: ESPIRITO/ui/keys_manager.js -->
<div id="keysModal" class="modal-overlay">
    <div class="keys-card">
        <div class="keys-header">
            <div id="keysTitle">USER KEYS MANAGER</div>
            <button id="closeKeysBtn">X</button>
        </div>
        <div class="key-list" id="keyList"></div>
        <div class="form-section">
            <input id="keyNameInput" placeholder="Nome da chave">
            <input id="keyTokenInput" type="password" placeholder="Token">
            <input id="keyWebhookInput" placeholder="Webhook URL">
            <button id="addKeyBtn">ADICIONAR CHAVE</button>
        </div>
    </div>
</div>
```

### Componente 5: `response-handler` (Respostas)
```html
<!-- Local: ESPIRITO/ui/response_handler.js -->
<div class="response-container" id="response">
    <div class="page initial active">
        <strong>Clique no ◉ e diga "Oi, Dual".</strong>
        <em>Sempre único. Sempre seu.</em>
    </div>
    <div class="response-controls">
        <div class="control-buttons">
            <button class="control-btn copy-button">Copiar</button>
            <button class="control-btn paste-button">Colar</button>
            <button id="toggleBtn" class="control-btn toggle-button">Check</button>
            <button id="crystalBtn" class="control-btn">Cristais</button>
        </div>
        <div class="pagination">
            <button data-action="prev">⟵</button>
            <span id="pageIndicator">1 / 1</span>
            <button data-action="next">⟶</button>
        </div>
    </div>
</div>
``` 