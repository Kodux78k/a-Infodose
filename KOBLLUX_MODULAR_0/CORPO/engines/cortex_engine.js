/**
 * ⧈ KOBLLUX_Δ³ :: CORPO/engines/cortex_engine.js
 * #typescript #jsonld
 * Sistema de Memórias e Matrizes (Córtex AI)
 */
export const CortexEngine = {
    init(state, keys) {
        this.STATE = state;
        this.KEYS = keys;
        console.log("CortexEngine: Ativado");
    },

    saveCortex() {
        localStorage.setItem(this.KEYS.CORTEX, JSON.stringify(this.STATE.cortex));
    },

    render(containerId, searchInputId) {
        const container = document.getElementById(containerId);
        const query = document.getElementById(searchInputId)?.value.toLowerCase() || "";
        if (!container) return;

        const filtered = this.STATE.cortex.crystals.filter(c => 
            c.content.toLowerCase().includes(query) || 
            c.tags.some(t => t.toLowerCase().includes(query))
        );

        container.innerHTML = filtered.map(c => `
            <div class="key-item ${c.pinned ? 'active-item' : ''}" style="animation: fadeIn 0.4s ease;">
                <div class="meta">
                    <div style="font-weight:700;font-size:0.9rem">
                        ${c.tags.map(t => `<span style="background:rgba(0,242,255,0.1);color:var(--neon-cyan);padding:2px 6px;border-radius:4px;font-size:0.7rem;margin-right:4px">${t}</span>`).join('')}
                    </div>
                    <div style="font-size:0.75rem;color:rgba(255,255,255,0.5);margin-top:4px">
                        ${c.content}
                    </div>
                </div>
                <div class="actions">
                    <button onclick="KOBLLUX.engines.cortex.togglePin(${c.id})" class="small-btn" title="Fixar">
                        ${c.pinned ? '📌' : '📍'}
                    </button>
                    <button onclick="KOBLLUX.engines.cortex.deleteMemory(${c.id})" class="small-btn danger" title="Remover">
                        🗑️
                    </button>
                </div>
            </div>
        `).join('');
        
        if (window.lucide) window.lucide.createIcons();
    },

    saveNewMemory(content, tags) {
        if (!content) return;
        const newMem = { id: Date.now(), content, tags, pinned: false };
        this.STATE.cortex.crystals.unshift(newMem);
        this.saveCortex();
        this.render('memory-container', 'memory-search');
        if (window.KOBLLUX.ui.toast) window.KOBLLUX.ui.toast("Memória Cristalizada");
    },

    togglePin(id) {
        const c = this.STATE.cortex.crystals.find(x => x.id === id);
        if (c) c.pinned = !c.pinned;
        this.saveCortex();
        this.render('memory-container', 'memory-search');
    },

    deleteMemory(id) {
        this.STATE.cortex.crystals = this.STATE.cortex.crystals.filter(c => c.id !== id);
        this.saveCortex();
        this.render('memory-container', 'memory-search');
    }
};