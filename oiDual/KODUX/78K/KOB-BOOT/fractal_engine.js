// ESPIRITO/core/fractal_engine.js
// ─────────────────────────────────────────────────────────────
// Motor Tríplice de Reversão 3·6·9 + TTS multiarquetípico.
// Extraído do <script> inline do "Canivete Suíço". Mesma lógica,
// agora encapsulada — sem depender de IDs fixos no DOM global,
// recebe os elementos via config no construtor.
// ─────────────────────────────────────────────────────────────

const FALLBACK_ARCH_CONFIGS = {
    atlas:   { rate: 1.0, pitch: 0.9, color: '#00e5ff' },
    nova:    { rate: 1.2, pitch: 1.3, color: '#a855f7' },
    artemis: { rate: 0.9, pitch: 0.8, color: '#ec4899' },
    vitalis: { rate: 1.0, pitch: 1.1, color: '#22c55e' },
    pulse:   { rate: 1.3, pitch: 1.0, color: '#eab308' },
    kaos:    { rate: 1.5, pitch: 0.7, color: '#ef4444' },
    kodux:   { rate: 1.1, pitch: 1.0, color: '#00ffcc' },
    lumine:  { rate: 1.0, pitch: 1.2, color: '#fffb00' }
};

const BASE_ARCHETYPES = [
    'atlas', 'nova', 'vitalis', 'pulse', 'kaos', 'kodux', 'lumine', 'aion',
    'kobllux', 'artemis', 'serena', 'genus', 'solus', 'rhea', 'uno', 'dual',
    'trinity', 'infodose', 'horus', 'bllue'
];

export class FractalEngine369 {
    constructor({ input, output, archSelect, cycleCheck, statusBar, hudStatus, toastContainer } = {}) {
        this.dom = { input, output, archSelect, cycleCheck, statusBar, hudStatus, toastContainer };

        const userNameRaw = localStorage.getItem('di_userName') || '';
        this.userKey = userNameRaw.trim().toLowerCase();
        this.archetypes = [...BASE_ARCHETYPES];
        if (this.userKey && !this.archetypes.includes(this.userKey)) {
            this.archetypes.push(this.userKey);
        }
        window.ARCHETYPES = this.archetypes;
        window.KOB_USER_NAME = userNameRaw;

        this.step = parseInt(localStorage.getItem('kobllux_engine_step') || '3', 10);
        this.reverse = localStorage.getItem('kobllux_reverse_mode') === 'true';
        this.jump = parseInt(localStorage.getItem('kobllux_jump_step') || '0', 10);
        this.use3697 = localStorage.getItem('kobllux_cycle_3697') === 'true';

        this.parsedSentences = [];
        this.computedSequence = [];
        this.currentIndex = 0;
        this.isPlaying = false;
    }

    // ── PERSISTÊNCIA ────────────────────────────────────────
    saveState() {
        localStorage.setItem('kobllux_engine_step', String(this.step));
        localStorage.setItem('kobllux_reverse_mode', String(this.reverse));
        localStorage.setItem('kobllux_jump_step', String(this.jump));
        localStorage.setItem('kobllux_cycle_3697', String(this.use3697));
    }

    getArchConfig(name) {
        if (window.ARCHETYPE_MAP?.[name]) {
            const a = window.ARCHETYPE_MAP[name];
            return { rate: a.rate || 1.0, pitch: a.pitch || 1.0, color: a.color || '#00e5ff' };
        }
        return FALLBACK_ARCH_CONFIGS[name] || { rate: 1.0, pitch: 1.0, color: '#00e5ff' };
    }

    // ── SEQUÊNCIA 3-6-9-7 ───────────────────────────────────
    getSequence(startIndex, length) {
        const total = this.archetypes.length;
        const seq = [];
        let idx = ((startIndex % total) + total) % total;
        const pattern = this.use3697 ? [3, 6, 9, 7] : [this.step];
        for (let i = 0; i < length; i++) {
            seq.push(this.archetypes[idx]);
            let s = pattern[i % pattern.length];
            if (this.reverse) s *= -1;
            s += this.jump;
            idx = ((idx + s) % total + total) % total;
        }
        return seq;
    }

    // ── GERAÇÃO DE BLOCOS ───────────────────────────────────
    generate() {
        const { input, output, archSelect, cycleCheck } = this.dom;
        if (!input || !output) return;

        const text = input.value.trim();
        if (!text) return this._toast('Aviso: Texto de entrada vazio.', true);
        localStorage.setItem('kobllux_draft_input', text);

        const match = text.replace(/\n+/g, ' ').match(/[^.!?]+[.!?]+|[^.!?]+$/g);
        this.parsedSentences = match ? match.map(s => s.trim()).filter(Boolean) : [];
        if (!this.parsedSentences.length) return;

        const startName = archSelect?.value || this.archetypes[0];
        let startIdx = this.archetypes.indexOf(startName);
        if (startIdx === -1) startIdx = 0;

        const cycle = !!cycleCheck?.checked;
        this.computedSequence = cycle
            ? this.getSequence(startIdx, this.parsedSentences.length)
            : Array(this.parsedSentences.length).fill(this.archetypes[startIdx]);

        output.innerHTML = '';
        let exportText = '';
        this.parsedSentences.forEach((sentence, i) => {
            const arch = this.computedSequence[i];
            const cfg = this.getArchConfig(arch);
            const block = document.createElement('div');
            block.className = 'para-block accordion is-open';
            block.id = `fractal-block-${i}`;
            block.style.cssText = `padding:12px;margin-bottom:8px;border-radius:8px;border-left:4px solid ${cfg.color};background:rgba(255,255,255,.02);`;
            block.innerHTML = `
                <div class="accordion-header" style="display:flex;justify-content:space-between;font-size:.8rem;font-family:'JetBrains Mono';">
                  <span style="color:${cfg.color};font-weight:bold;text-transform:uppercase;">${arch} · Δ</span>
                </div>
                <div class="collapsible-body" style="margin-top:6px;font-size:.85rem;line-height:1.4;color:rgba(255,255,255,.85);">
                  ${this._escape(sentence)}
                </div>`;
            output.appendChild(block);
            exportText += `${arch.toUpperCase()} — ${sentence}\n\n`;
        });

        localStorage.setItem('kobllux_last_result', exportText.trim());
        this._updateStatus();
        this._toast(`Matriz Sincronizada: ${this.parsedSentences.length} blocos.`);
    }

    // ── TTS ─────────────────────────────────────────────────
    speak() {
        if (!this.isPlaying || this.currentIndex >= this.parsedSentences.length) {
            return this.stop();
        }
        speechSynthesis.cancel();

        const arch = this.computedSequence[this.currentIndex];
        const cfg = this.getArchConfig(arch);
        document.documentElement.style.setProperty('--kob-voice-primary', cfg.color);
        document.body.dataset.arch = arch;

        if (this.dom.hudStatus) {
            this.dom.hudStatus.textContent = `Δ [${this.currentIndex + 1}/${this.parsedSentences.length}] · ${arch.toUpperCase()}`;
        }

        const utter = new SpeechSynthesisUtterance(this.parsedSentences[this.currentIndex]);
        utter.rate = cfg.rate;
        utter.pitch = cfg.pitch;
        const ptVoice = speechSynthesis.getVoices().find(v => v.lang.includes('pt-BR') || v.lang.includes('pt_BR'));
        if (ptVoice) utter.voice = ptVoice;

        utter.onend = () => { this.currentIndex++; this.speak(); };
        speechSynthesis.speak(utter);
    }

    togglePlay() {
        if (!this.parsedSentences.length) {
            this.generate();
            if (!this.parsedSentences.length) return this._toast('Insira um texto.', true);
        }
        this.isPlaying = !this.isPlaying;
        if (this.isPlaying) {
            speechSynthesis.paused ? speechSynthesis.resume() : this.speak();
        } else {
            speechSynthesis.pause();
        }
    }

    stop() {
        speechSynthesis.cancel();
        this.isPlaying = false;
        this.currentIndex = 0;
    }

    // ── UTIL ────────────────────────────────────────────────
    _updateStatus() {
        if (this.dom.statusBar) {
            this.dom.statusBar.textContent =
                `Motor +${this.step} · ${this.reverse ? 'Reverse' : 'Forward'} · Salto +${this.jump} · ${this.use3697 ? 'Ciclo 3697' : 'Linear'}`;
        }
    }

    _toast(msg, isError = false) {
        const c = this.dom.toastContainer;
        if (!c) return;
        const t = document.createElement('div');
        t.className = 'toast';
        t.textContent = msg;
        t.style.background = isError ? '#ef4444' : 'var(--kob-voice-primary, #00e5ff)';
        c.appendChild(t);
        setTimeout(() => t.remove(), 3000);
    }

    _escape(str) {
        return str.replace(/[&<>]/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[m]));
    }
}
