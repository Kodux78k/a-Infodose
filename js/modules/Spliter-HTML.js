// Estado global da aplicação
let rawHTML = "";
let selectedElementRef = null; 
let activeTabId = 'tab-head';

// Inicialização de escutas de arquivo
document.getElementById('fileInput').onchange = e => {
    const file = e.target.files[0];
    if (!file) return;
    document.getElementById('statusFile').textContent = `Arquivo: ${file.name}`;
    const reader = new FileReader();
    reader.onload = () => {
        rawHTML = reader.result;
        processHTML();
    };
    reader.readAsText(file);
};

async function pasteFromClipboard() {
    try {
        rawHTML = await navigator.clipboard.readText();
        document.getElementById('statusFile').textContent = "Origem: Área de transferência (Colado)";
        processHTML();
    } catch (err) {
        alert("Permissão para acessar área de transferência negada.");
    }
}

// Motor de Processamento Principal
function processHTML() {
    if (!rawHTML.trim()) return;

    const parser = new DOMParser();
    const doc = parser.parseFromString(rawHTML, "text/html");

    // 1. Processamento de Cabeçalho (Removendo styles internos e links para isolamento)
    const headClone = doc.head.cloneNode(true);
    headClone.querySelectorAll('style, link[rel="stylesheet"]').forEach(el => el.remove());
    document.getElementById('code-head').value = headClone.innerHTML.trim();

    // 2. Processamento do Body Interno (Removendo scripts e styles injetados no meio do HTML)
    const bodyClone = doc.body.cloneNode(true);
    bodyClone.querySelectorAll('script, style').forEach(el => el.remove());
    document.getElementById('code-body').value = bodyClone.innerHTML.trim();

    // 3. Processamento de CSS Extrativo
    const internalStyles = [...doc.querySelectorAll('style')].map(s => s.innerHTML.trim()).join('\n\n');
    const externalStyles = [...doc.querySelectorAll('link[rel="stylesheet"]')].map(l => l.outerHTML).join('\n');
    document.getElementById('code-css-internal').value = internalStyles;
    document.getElementById('code-css-external').value = externalStyles;

    // 4. Processamento de JavaScript Extrativo
    const internalScripts = [...doc.querySelectorAll('script:not([src])')].map(s => s.innerHTML.trim()).join('\n\n');
    const externalScripts = [...doc.querySelectorAll('script[src]')].map(s => s.outerHTML).join('\n');
    document.getElementById('code-js-internal').value = internalScripts;
    document.getElementById('code-js-external').value = externalScripts;

    // Atualizar interfaces visuais do ecossistema Studio
    runDiagnostics(doc, rawHTML);
    buildDOMTree(doc.body);
    
    // Atualiza numeração de linhas de todas as caixas
    ['head', 'body', 'css-internal', 'css-external', 'js-internal', 'js-external'].forEach(id => {
        updateLineNumbers(id);
    });
    updateStatusBar();
}

// Gutter de Linhas customizado Vanilla (Sync de Scroll e Inputs)
function updateLineNumbers(id) {
    const textarea = document.getElementById(`code-${id}`);
    const gutter = document.getElementById(`gutter-${id}`);
    if (!textarea || !gutter) return;

    const lines = textarea.value.split('\n').length;
    let lineNumbersHTML = '';
    for (let i = 1; i <= lines; i++) {
        lineNumbersHTML += i + '<br>';
    }
    gutter.innerHTML = lineNumbersHTML;
}

function syncEditor(id) {
    updateLineNumbers(id);
    updateStatusBar();
}

function syncScroll(id) {
    const textarea = document.getElementById(`code-${id}`);
    const gutter = document.getElementById(`gutter-${id}`);
    if (textarea && gutter) {
        gutter.scrollTop = textarea.scrollTop;
    }
}

// Gerenciamento de Janelas/Tabs
function switchTab(tabId) {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.content-area').forEach(c => c.classList.remove('active'));
    
    activeTabId = tabId;
    event.currentTarget.classList.add('active');
    document.getElementById(tabId).classList.add('active');
    updateStatusBar();
}

// Analisador Estático de Código & Auditoria
function runDiagnostics(doc, rawText) {
    // Detecção de Ecossistemas Tecnológicos
    const lowerText = rawText.toLowerCase();
    document.getElementById('lib-tailwind').classList.toggle('active', lowerText.includes('tailwind'));
    document.getElementById('lib-bootstrap').classList.toggle('active', lowerText.includes('bootstrap'));
    document.getElementById('lib-fontawesome').classList.toggle('active', lowerText.includes('fa-') || lowerText.includes('font-awesome'));
    document.getElementById('lib-svg').classList.toggle('active', lowerText.includes('<svg'));

    // Análise de Conflitos e Duplicações de IDs e Classes
    const auditContainer = document.getElementById('auditContainer');
    auditContainer.innerHTML = "";

    const idMap = {};
    doc.querySelectorAll('[id]').forEach(el => {
        idMap[el.id] = (idMap[el.id] || 0) + 1;
    });

    let issuesCount = 0;
    for (let id in idMap) {
        if (idMap[id] > 1) {
            issuesCount++;
            const item = document.createElement('div');
            item.className = 'issue-item';
            item.innerHTML = `⚠️ <span>ID Duplicado crítico detectado: <strong>#${id}</strong> (${idMap[id]}x)</span>`;
            auditContainer.appendChild(item);
        }
    }

    if (issuesCount === 0) {
        auditContainer.innerHTML = `<div style="color: var(--accent-green); font-size:12px;">✔ Estrutura limpa. Nenhum ID duplicado encontrado.</div>`;
    }
}

// Explorador de Árvore DOM Interativo (Focado em DIVs e Layout sem recursão infinita)
function buildDOMTree(rootElement) {
    const treeContainer = document.getElementById('domTree');
    treeContainer.innerHTML = "";
    
    function parseNode(element, currentGuiContainer) {
        // Filtramos para focar em elementos estruturais legíveis por humanos
        if (element.nodeType !== Node.ELEMENT_NODE) return;
        
        const nodeDiv = document.createElement('div');
        nodeDiv.className = "tree-node";
        
        // Formatação sintática do nó do Explorer
        let details = `<span style="color: #ff79c6">&lt;${element.tagName.toLowerCase()}&gt;</span>`;
        if (element.id) details += `<span style="color: #f1fa8c">#${element.id}</span>`;
        if (element.classList.length > 0) details += `<span style="color: #8be9fd">.${[...element.classList].join('.')}</span>`;
        
        nodeDiv.innerHTML = details;
        
        // Captura do clique para inspeção isolada de componente
        nodeDiv.onclick = (e) => {
            e.stopPropagation();
            document.querySelectorAll('.tree-node').forEach(n => n.classList.remove('selected'));
            nodeDiv.classList.add('selected');
            
            selectedElementRef = element;
            showInspectorDetails(element);
        };

        if (element.children.length > 0) {
            const childWrapper = document.createElement('div');
            childWrapper.style.paddingLeft = "8px";
            for (let child of element.children) {
                parseNode(child, childWrapper);
            }
            nodeDiv.appendChild(childWrapper);
        }
        
        currentGuiContainer.appendChild(nodeDiv);
    }

    // Varre a partir do Body recebido
    for (let topChild of rootElement.children) {
        parseNode(topChild, treeContainer);
    }
}

function showInspectorDetails(element) {
    const panel = document.getElementById('inspectorPanel');
    const details = document.getElementById('inspectorDetails');
    panel.style.display = 'block';
    
    details.innerHTML = `
        <strong>Tag:</strong> ${element.tagName.toLowerCase()}<br>
        <strong>Classes:</strong> ${element.className || 'Nenhuma'}<br>
        <strong>Filhos diretos:</strong> ${element.children.length}
    `;
}

function copySelectedDiv() {
    if (!selectedElementRef) return;
    const outerHtmlString = selectedElementRef.outerHTML;
    navigator.clipboard.writeText(outerHtmlString);
    alert("Código HTML da DIV selecionada copiado com sucesso!");
}

// Arquitetura de Reconstrução Inteligente e Compilação Base
function reconstructAndDownload() {
    const headContent = document.getElementById('code-head').value;
    const bodyContent = document.getElementById('code-body').value;
    const cssInternal = document.getElementById('code-css-internal').value;
    const cssExternal = document.getElementById('code-css-external').value;
    const jsInternal = document.getElementById('code-js-internal').value;
    const jsExternal = document.getElementById('code-js-external').value;

    // Montagem estruturada limpa, reinjetando os escopos em locais adequados e sem redundâncias
    const finalHTML = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    ${headContent}
    ${cssExternal}
    <style>
${cssInternal}
    </style>
</head>
<body>
    ${bodyContent}
    ${jsExternal}
    <script>
${jsInternal}
    </script>
</body>
</html>`;

    const blob = new Blob([finalHTML], { type: "text/html" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "studio_compiled_output.html";
    link.click();
}

function updateStatusBar() {
    let currentInput;
    if (activeTabId === 'tab-head') currentInput = document.getElementById('code-head');
    if (activeTabId === 'tab-body') currentInput = document.getElementById('code-body');
    if (activeTabId === 'tab-css') currentInput = document.getElementById('code-css-internal');
    if (activeTabId === 'tab-js') currentInput = document.getElementById('code-js-internal');

    if (!currentInput) return;
    const lines = currentInput.value.split('\n').length;
    const chars = currentInput.value.length;
    document.getElementById('statusMetrics').textContent = `Linhas: ${lines} | Caracteres: ${chars}`;
}
