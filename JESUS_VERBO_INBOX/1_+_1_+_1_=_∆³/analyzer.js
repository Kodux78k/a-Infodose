/**
 * 🔍 ORB ANALYZER · Sistema de Coleta e Análise de Dados
 * Sincronização em tempo real com o editor FUSION
 */

class OrbAnalyzer {
    constructor() {
        this.data = {
            functions: [],
            classes: [],
            modules: [],
            lines: 0,
            size: 0,
            lastUpdate: null
        };
        this.listeners = [];
        this.filterMode = 'all'; // all, functions, classes, modules
    }

    /**
     * Analisa código e extrai estruturas
     */
    analyzeCode(code) {
        if (!code) {
            this.data = { functions: [], classes: [], modules: [], lines: 0, size: 0, lastUpdate: null };
            this.notifyListeners();
            return;
        }

        // Conta linhas
        const lines = code.split('\n').length;
        
        // Encontra funções
        const functionRegex = /(?:function|const|let|var)\s+(\w+)\s*=?\s*(?:function)?\s*\(/g;
        const functions = [];
        let match;
        while ((match = functionRegex.exec(code)) !== null) {
            functions.push({
                name: match[1],
                type: 'function',
                line: code.substring(0, match.index).split('\n').length,
                description: this.extractDescription(code, match.index)
            });
        }

        // Encontra classes
        const classRegex = /class\s+(\w+)(?:\s+extends\s+(\w+))?\s*{/g;
        const classes = [];
        while ((match = classRegex.exec(code)) !== null) {
            classes.push({
                name: match[1],
                extends: match[2] || null,
                type: 'class',
                line: code.substring(0, match.index).split('\n').length,
                methods: this.extractMethods(code, match.index),
                description: this.extractDescription(code, match.index)
            });
        }

        // Encontra imports/modules
        const moduleRegex = /(?:import|require)\s+(?:{[^}]+}|[^;\s]+)\s+from\s+['"]([^'"]+)['"]/g;
        const modules = [];
        while ((match = moduleRegex.exec(code)) !== null) {
            modules.push({
                name: match[1],
                type: 'module',
                line: code.substring(0, match.index).split('\n').length
            });
        }

        this.data = {
            functions,
            classes,
            modules,
            lines,
            size: code.length,
            lastUpdate: new Date().toLocaleTimeString('pt-BR')
        };

        this.notifyListeners();
    }

    /**
     * Extrai métodos de uma classe
     */
    extractMethods(code, classStartIndex) {
        const methodRegex = /(\w+)\s*\([^)]*\)\s*{/g;
        const methods = [];
        const classBody = code.substring(classStartIndex, code.indexOf('}', classStartIndex) + 1);
        let match;
        
        while ((match = methodRegex.exec(classBody)) !== null) {
            methods.push({
                name: match[1],
                signature: match[0]
            });
        }
        
        return methods;
    }

    /**
     * Extrai descrição (comentário anterior)
     */
    extractDescription(code, position) {
        const beforeText = code.substring(Math.max(0, position - 200), position);
        const commentMatch = beforeText.match(/\/\/\s*([^\n]+)/);
        return commentMatch ? commentMatch[1] : '';
    }

    /**
     * Filtra dados por tipo
     */
    getFiltered(filterMode = 'all') {
        this.filterMode = filterMode;
        
        switch(filterMode) {
            case 'functions':
                return this.data.functions;
            case 'classes':
                return this.data.classes;
            case 'modules':
                return this.data.modules;
            default:
                return [...this.data.functions, ...this.data.classes, ...this.data.modules];
        }
    }

    /**
     * Registra listener para mudanças
     */
    onChange(callback) {
        this.listeners.push(callback);
    }

    /**
     * Notifica listeners
     */
    notifyListeners() {
        this.listeners.forEach(cb => cb(this.data));
    }

    /**
     * Obtém estatísticas
     */
    getStats() {
        return {
            totalFunctions: this.data.functions.length,
            totalClasses: this.data.classes.length,
            totalModules: this.data.modules.length,
            totalItems: this.data.functions.length + this.data.classes.length + this.data.modules.length,
            lines: this.data.lines,
            size: this.formatSize(this.data.size),
            lastUpdate: this.data.lastUpdate
        };
    }

    /**
     * Formata tamanho de arquivo
     */
    formatSize(bytes) {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    /**
     * Retorna dados em JSON para exportar
     */
    exportJSON() {
        return JSON.stringify(this.data, null, 2);
    }

    /**
     * Limpa dados
     */
    reset() {
        this.data = { functions: [], classes: [], modules: [], lines: 0, size: 0, lastUpdate: null };
        this.notifyListeners();
    }
}

// Instância global
window.orbAnalyzer = new OrbAnalyzer();

console.log('🔍 OrbAnalyzer inicializado');
