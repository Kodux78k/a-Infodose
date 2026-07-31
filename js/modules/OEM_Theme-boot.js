
/*
╔════════════════════════════════════════════╗
║        KOBLLUX MONOLITHIC RUNTIME          ║
║        DROP → RUNTIME BUILDER              ║
║                                            ║
║        HTML + CSS + JS + BOOTLOADER        ║
╚════════════════════════════════════════════╝
*/
(function(){
"use strict";
// ═════════════════════════════════════════════
// RUNTIME STATE
// ═════════════════════════════════════════════
window.KOBLLUX_RUNTIME = {
  version:
    "MONOLITHIC-RUNTIME-1.0",
  started:
    Date.now(),
  status:
    "BOOTING"
};
// ═════════════════════════════════════════════
// HTML
// ═════════════════════════════════════════════
const HTML = `

  
    <!-- TOAST -->
    <div class="toast-wrap" id="toast-wrap"></div>

    <script>
        /* ══════════════════════════════════════════════════════════════════
           FRACTAL 369 v3 · compacto · com suporte a tema claro/escuro
           ══════════════════════════════════════════════════════════════════ */

        /* ── TEMA (data-theme) ── */
        function getTheme() {
            try { return localStorage.getItem('fractal_theme') || 'dark'; } catch { return 'dark'; }
        }

        function setTheme(t) {
            document.documentElement.setAttribute('data-theme', t);
            try { localStorage.setItem('fractal_theme', t); } catch {}
        }

        function toggleTheme() {
            const current = document.documentElement.getAttribute('data-theme') || 'dark';
            setTheme(current === 'dark' ? 'light' : 'dark');
            toast('Tema: ' + (current === 'dark' ? '☀️ Claro' : '🌙 Escuro'));
        }

        // Aplica o tema salvo
        setTheme(getTheme());

        /* ── 41 ARQUÉTIPOS BASE ── */
        const ARCHETYPES_BASE = [
            "atlas", "nova", "vitalis", "pulse", "kaos", "kodux", "lumine",
            "aion", "kobllux", "artemis", "serena", "genus", "solus",
            "rhea", "uno", "dual", "trinity", "infodose", "horus", "bllue",
            "velor", "elya", "sylon", "naira", "thenir", "eloh", "novael",
            "aelya", "ignyra", "lumara", "kaythar", "sylla", "anamyx",
            "yamantek", "metalux", "kd1", "koφd1", "christos",
            "aek_dion", "aekael_domnnus", "nephesh_elyon"
        ];

        const ARCH_NAMES = {
            atlas: "Atlas",
            nova: "Nova",
            vitalis: "Vitalis",
            pulse: "Pulse",
            kaos: "Kaos",
            kodux: "Kodux",
            lumine: "Lumine",
            aion: "Aion",
            kobllux: "Kobllux",
            artemis: "Artemis",
            serena: "Serena",
            genus: "Genus",
            solus: "Solus",
            rhea: "Rhea",
            uno: "Uno",
            dual: "Dual",
            trinity: "Trinity",
            infodose: "Infodose",
            horus: "Horus",
            bllue: "Bllue",
            velor: "Velor",
            elya: "Elya",
            sylon: "Sylon",
            naira: "Naira",
            thenir: "Thenir",
            eloh: "Eloh",
            novael: "Novael",
            aelya: "Aelya",
            ignyra: "Ignyra",
            lumara: "Lumara",
            kaythar: "Kaythar",
            sylla: "Sylla",
            anamyx: "Anamyx",
            yamantek: "Yamantek",
            metalux: "Metalux",
            kd1: "KD1",
            "koφd1": "KOΦD1",
            christos: "Christos",
            aek_dion: "a€K_Dion",
            aekael_domnnus: "a€Kael DommnuS",
            nephesh_elyon: "a€Nephesh Elyon"
        };

        const ARCH_COLORS = {
            kobllux: "#22D3EE",
            kodux: "#8B5CF6",
            atlas: "#F59E0B",
            nova: "#10B981",
            kaos: "#F43F5E",
            genus: "#F59E0B",
            rhea: "#EC4899",
            bllue: "#60A5FA",
            elya: "#A78BFA",
            aion: "#C084FC",
            sylon: "#34D399",
            lumine: "#FCD34D",
            infodose: "#22D3EE",
            vitalis: "#10B981",
            solus: "#F59E0B",
            horus: "#F59E0B",
            metalux: "#8B5CF6",
            artemis: "#6EE7B7",
            uno: "#60A5FA",
            dual: "#22D3EE",
            trinity: "#C084FC",
            serena: "#EC4899",
            naira: "#A78BFA",
            eloh: "#34D399",
            thenir: "#FB7185",
            kaythar: "#FCD34D",
            pulse: "#22D3EE",
            novael: "#60A5FA",
            aelya: "#6EE7B7",
            ignyra: "#FB7185",
            lumara: "#EC4899",
            sylla: "#34D399",
            anamyx: "#6EE7B7",
            yamantek: "#FCD34D",
            velor: "#A78BFA",
            kd1: "#8B5CF6",
            "koφd1": "#7C3AED",
            christos: "#C084FC",
            aek_dion: "#F59E0B",
            aekael_domnnus: "#F43F5E",
            nephesh_elyon: "#EC4899"
        };

        const ARCH_TTS = {
            kobllux: { rate: .98, pitch: .48 },
            kodux: { rate: 1.02, pitch: .55 },
            atlas: { rate: .95, pitch: .40 },
            nova: { rate: 1.10, pitch: .80 },
            kaos: { rate: 1.15, pitch: .60 },
            genus: { rate: 1.00, pitch: .52 },
            rhea: { rate: .93, pitch: .90 },
            bllue: { rate: 1.05, pitch: .70 },
            elya: { rate: .96, pitch: .85 },
            aion: { rate: .90, pitch: .35 },
            sylon: { rate: 1.08, pitch: .65 },
            lumine: { rate: .94, pitch: .78 },
            infodose: { rate: 1.12, pitch: .58 },
            vitalis: { rate: 1.06, pitch: .72 },
            solus: { rate: .88, pitch: .30 },
            horus: { rate: .92, pitch: .44 },
            metalux: { rate: 1.00, pitch: .50 },
            artemis: { rate: 1.04, pitch: .68 },
            uno: { rate: 1.05, pitch: .70 },
            dual: { rate: .98, pitch: .52 },
            trinity: { rate: .94, pitch: .42 },
            serena: { rate: .96, pitch: .82 },
            pulse: { rate: 1.10, pitch: .60 },
            velor: { rate: .91, pitch: .46 },
        };

        function archTTS(id) { return ARCH_TTS[id] || { rate: 1.00, pitch: .60 } }

        function archColor(id) { return ARCH_COLORS[id] || '#22D3EE' }

        function archName(id) { return ARCH_NAMES[id] || id }

        /* ── ECL-1 / Campo Φ ── */
        let di_phi = 0.50;
        let di_useECL = true;

        function updatePhi(delta) {
            di_phi = Math.max(0, Math.min(1, di_phi + delta));
            document.getElementById('phi-val').textContent = di_phi.toFixed(2);
            const eclBtn = document.getElementById('eclToggle');
            if (di_phi < .35) {
                eclBtn.textContent = 'CRUSE';
                eclBtn.classList.remove('is-active', 'rev');
            } else if (di_phi > .65) {
                eclBtn.textContent = 'ELECTRA';
                eclBtn.classList.add('is-active', 'rev');
            } else {
                eclBtn.textContent = 'Φ';
                eclBtn.classList.toggle('is-active', true);
                eclBtn.classList.remove('rev');
            }
            try { localStorage.setItem('fractal_phi', di_phi.toFixed(2)); } catch {}
        }

        /* ── MOTOR 78K — ENGINE STATE ── */
        let di_engineStep = 1;
        let di_reverse = false;
        let di_jump = 0;
        let di_use3697 = false;

        function syncEngineUI() {
            document.querySelectorAll('[data-engine]').forEach(btn => {
                btn.classList.toggle('is-active', parseInt(btn.dataset.engine) === di_engineStep);
            });
            document.querySelectorAll('[data-jump]').forEach(btn => {
                btn.classList.toggle('is-active', parseInt(btn.dataset.jump) === di_jump);
            });
            const rev = document.getElementById('reverseToggle');
            rev.textContent = \`Rev: \${di_reverse?'ON':'OFF'}\`;
            rev.classList.toggle('is-active', di_reverse);
            rev.classList.toggle('rev', di_reverse);
            const cy = document.getElementById('cycle3697');
            cy.textContent = \`3-6-9-7: \${di_use3697?'ON':'OFF'}\`;
            cy.classList.toggle('is-active', di_use3697);
            try {
                localStorage.setItem('kobllux_engine_step', di_engineStep);
                localStorage.setItem('kobllux_jump_step', di_jump);
                localStorage.setItem('kobllux_reverse_mode', di_reverse);
                localStorage.setItem('DI_369_cycle', di_use3697);
            } catch {}
        }

        document.querySelectorAll('[data-engine]').forEach(btn => {
            btn.addEventListener('click', () => { di_engineStep = parseInt(btn.dataset.engine);
                syncEngineUI(); });
        });
        document.querySelectorAll('[data-jump]').forEach(btn => {
            btn.addEventListener('click', () => { di_jump = parseInt(btn.dataset.jump);
                syncEngineUI(); });
        });
        document.getElementById('reverseToggle').addEventListener('click', () => { di_reverse = !di_reverse;
            syncEngineUI(); });
        document.getElementById('cycle3697').addEventListener('click', () => { di_use3697 = !di_use3697;
            syncEngineUI(); });
        document.getElementById('eclToggle').addEventListener('click', () => {
            const delta = di_phi < .5 ? .25 : -.25;
            updatePhi(delta);
        });

        /* di_getSequence */
        function di_getSequence(startIndex, length) {
            const total = ARCHETYPES_BASE.length;
            const sequence = [];
            let currentIndex = ((startIndex % total) + total) % total;
            const pattern = di_use3697 ? [3, 6, 9, 7] : [di_engineStep];
            for (let i = 0; i < length; i++) {
                sequence.push(ARCHETYPES_BASE[currentIndex]);
                let step = pattern[i % pattern.length];
                if (di_reverse) step *= -1;
                step += di_jump;
                currentIndex = (currentIndex + step) % total;
                if (currentIndex < 0) currentIndex += total;
            }
            return sequence;
        }

        /* ── STORAGE ── */
        function kls(key, val) {
            try {
                if (val === undefined) return localStorage.getItem(key);
                localStorage.setItem(key, typeof val === 'string' ? val : JSON.stringify(val));
            } catch {}
        }

        let currentArch = (() => {
            try {
                const saved = JSON.parse(localStorage.getItem('nebula.arch.last') || '{}');
                return saved?.arch?.id || 'kobllux';
            } catch { return 'kobllux'; }
        })();

        let mergedText = '';
        let fractalBlocks = [];
        let currentView = 'fractal';

        /* ─── APP ─── */
        const FractalApp = {

            merge() {
                const t1 = document.getElementById('t1').value.trim();
                const t2 = document.getElementById('t2').value.trim();
                if (!t1 || !t2) { toast('Cola 2 textos primeiro'); return; }

                const parse = t => (t.replace(/\\n+/g, ' ').match(/[^.!?]+[.!?]+|[^.!?]+$/g) || []).map(s => s.trim())
                    .filter(Boolean);
                const s1 = parse(t1);
                const s2 = parse(t2);

                const startIdx = ARCHETYPES_BASE.indexOf(currentArch);
                const totalSentences = Math.max(s1.length, s2.length);

                const combined = [];
                for (let i = 0; i < totalSentences; i++) {
                    const cycle = i % 9;
                    const useStochastic = di_useECL && Math.random() < di_phi;
                    if (useStochastic) {
                        const src = Math.random() < .5 ? s1 : s2;
                        if (src[i]) combined.push(src[i]);
                    } else {
                        if (cycle < 3) {
                            if (cycle === 0 && s1[i]) combined.push(s1[i]);
                            else if (cycle === 1 && s2[i]) combined.push(s2[i]);
                            else if (cycle === 2 && s1[i]) combined.push(s1[i]);
                            else if (s2[i]) combined.push(s2[i]);
                        } else if (cycle < 6) {
                            if (cycle === 3 && s1[i]) combined.push(s1[i]);
                            else if (cycle === 4 && s2[i]) combined.push(s2[i]);
                            else if (cycle === 5 && s2[i]) combined.push(s2[i]);
                            else if (s1[i]) combined.push(s1[i]);
                        } else {
                            if (cycle === 6 && s1[i]) combined.push(s1[i]);
                            else if (cycle === 7 && s2[i]) combined.push(s2[i]);
                            else if (s1[i]) combined.push(s1[i]);
                            else if (s2[i]) combined.push(s2[i]);
                        }
                    }
                }

                const sequence = di_getSequence(startIdx < 0 ? 0 : startIdx, combined.length);
                fractalBlocks = combined.map((text, i) => ({ arch: sequence[i], text }));
                mergedText = fractalBlocks.map(b => \`\${archName(b.arch).toUpperCase()} — \${b.text}\`).join('\\n\\n');

                const entropy = combined.length / Math.max(1, totalSentences * 2);
                updatePhi((entropy - .5) * .12);

                this.renderOutput();
                this.saveDraft(t1, t2);
                this.updateDock(\`\${archName(currentArch).toUpperCase()} · \${combined.length} blocos\`,
                    \`Motor 369 · Φ \${di_phi.toFixed(2)}\`);
                toast(\`✦ Integrado · \${combined.length} fractais\`);
                document.getElementById('out-section').style.display = 'flex';
                document.getElementById('out-section').style.flexDirection = 'column';
                document.getElementById('out-section').style.gap = '6px';
                document.getElementById('view-fractal').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            },

            renderOutput() {
                const vf = document.getElementById('view-fractal');
                const vt = document.getElementById('view-full');
                vf.innerHTML = fractalBlocks.map(b => \`
              <div class="fractal-block" style="border-left:2px solid \${archColor(b.arch)}44">
                <div class="fractal-meta">
                  <span style="color:\${archColor(b.arch)}">⬡</span>
                  <span style="color:\${archColor(b.arch)}">\${archName(b.arch)}</span>
                </div>
                <div class="fractal-text">\${esc(b.text)}</div>
              </div>
            \`).join('');
                vt.textContent = mergedText;
            },

            setView(v) {
                currentView = v;
                document.getElementById('view-fractal').style.display = v === 'fractal' ? 'block' : 'none';
                document.getElementById('view-full').style.display = v === 'full' ? 'block' : 'none';
                document.getElementById('vt-fractal').classList.toggle('active', v === 'fractal');
                document.getElementById('vt-full').classList.toggle('active', v === 'full');
            },

            copy() {
                if (!mergedText) { toast('Nada fundido ainda'); return; }
                navigator.clipboard.writeText(mergedText).then(() => toast('📋 Copiado'));
            },

            toggleTTS() {
                const panel = document.getElementById('arch-panel');
                const showing = panel.style.display === 'flex';
                panel.style.display = showing ? 'none' : 'flex';
                if (!showing) this.buildArchPills();
                else TTS.stop();
            },

            toggle78K() {
                const panel = document.getElementById('kob-panel');
                const showing = panel.style.display === 'flex';
                panel.style.display = showing ? 'none' : 'flex';
                if (!showing) this.update78KPanel();
            },

            update78KPanel() {
                const ls = k => { try { return localStorage.getItem(k) || '—'; } catch { return '—'; } };
                document.getElementById('m-step').textContent = ls('kobllux_engine_step');
                document.getElementById('m-jump').textContent = ls('kobllux_jump_step');
                const rev = ls('kobllux_reverse_mode');
                document.getElementById('m-rev').textContent = rev === 'true' ? '● ON' : '○ OFF';
                document.getElementById('m-phi').textContent = ls('fractal_phi') || di_phi.toFixed(2);
                document.getElementById('codex-display').textContent = mergedText || '—';
                document.getElementById('ecl-cruse').style.opacity = di_phi < .5 ? '1' : '.4';
                document.getElementById('ecl-electra').style.opacity = di_phi >= .5 ? '1' : '.4';
            },

            saveTo78K() {
                if (!mergedText) { toast('Nada fundido'); return; }
                const item = { key: 'fractal_ultimo', arch: currentArch, content: mergedText, timestamp: new Date()
                        .toISOString() };
                try {
                    localStorage.setItem('kobllux_last_result', mergedText);
                    localStorage.setItem('kobllux_DI_copy_last_result', JSON.stringify(item));
                    localStorage.setItem('fractal_ultimo', mergedText);
                    localStorage.setItem('DI_copy_last_result', mergedText);
                    localStorage.setItem('kobllux_draft_input', mergedText);
                    localStorage.setItem('fractal_arch', currentArch);
                    localStorage.setItem('fractal_phi', di_phi.toFixed(2));
                    window.dispatchEvent(new CustomEvent('di:storage', { detail: { key: 'kobllux_last_result',
                            newValue: mergedText } }));
                    toast('✦ Salvo no Códex');
                } catch (e) { toast('Erro: ' + e.message); }
            },

            saveDraft(t1, t2) {
                try {
                    localStorage.setItem('fractal_t1', t1);
                    localStorage.setItem('fractal_t2', t2);
                    localStorage.setItem('fractal_ultimo', mergedText);
                    localStorage.setItem('fractal_arch', currentArch);
                    localStorage.setItem('fractal_ts', new Date().toISOString());
                } catch {}
            },

            restoreSession() {
                try {
                    const last = localStorage.getItem('fractal_ultimo');
                    if (!last) { toast('Nenhuma sessão salva'); return; }
                    const t1 = localStorage.getItem('fractal_t1') || '';
                    const t2 = localStorage.getItem('fractal_t2') || '';
                    const arch = localStorage.getItem('fractal_arch') || 'kobllux';
                    const phi = parseFloat(localStorage.getItem('fractal_phi') || '0.5');
                    document.getElementById('t1').value = t1;
                    document.getElementById('t2').value = t2;
                    mergedText = last;
                    fractalBlocks = last.split('\\n\\n').map(chunk => {
                        const m = chunk.match(/^([A-ZÀ-Ü€Φ\\s_]+?) — (.+)/s);
                        if (m) {
                            const id = ARCHETYPES_BASE.find(a => archName(a).toUpperCase() === m[1].trim()) ||
                                'kobllux';
                            return { arch: id, text: m[2].trim() };
                        }
                        return { arch: 'kobllux', text: chunk };
                    }).filter(b => b.text);
                    updatePhi(phi - .50);
                    this.selectArch(arch);
                    this.renderOutput();
                    document.getElementById('out-section').style.display = 'flex';
                    document.getElementById('out-section').style.flexDirection = 'column';
                    document.getElementById('out-section').style.gap = '6px';
                    this.setView('fractal');
                    this.updateDock(\`\${archName(arch).toUpperCase()} · restaurado\`, \`Φ \${di_phi.toFixed(2)} · 78K\`);
                    toast('↺ Sessão restaurada');
                } catch (e) { toast('Erro: ' + e.message); }
            },

            buildArchPills() {
                let archList = ARCHETYPES_BASE;
                try {
                    const stored = localStorage.getItem('kobllux_archetypes');
                    if (stored) { const p = JSON.parse(stored); if (Array.isArray(p) && p.length) archList = p; }
                } catch (e) {}
                const scroll = document.getElementById('arch-scroll');
                scroll.innerHTML = archList.map(id => {
                    const sel = id === currentArch;
                    const col = archColor(id);
                    return \`<div class="arch-pill \${sel?'selected':''}" 
                style="background:\${sel?col+'1a':'rgba(255,255,255,0.04)'}; 
                       border-color:\${sel?col:'transparent'};
                       color:\${sel?col:'rgba(255,255,255,0.5)'}"
                onclick="FractalApp.selectArch('\${id}')">
                \${archName(id)}
              </div>\`;
                }).join('');
                this.updateArchRateInfo();
            },

            selectArch(id) {
                currentArch = id;
                document.querySelectorAll('.arch-pill').forEach(p => {
                    const pid = p.innerText.trim().toLowerCase();
                    const sel = pid === archName(id).toLowerCase();
                    const col = archColor(id);
                    p.classList.toggle('selected', sel);
                    p.style.background = sel ? col + '1a' : 'rgba(255,255,255,0.04)';
                    p.style.borderColor = sel ? col : 'transparent';
                    p.style.color = sel ? col : 'rgba(255,255,255,0.5)';
                });
                document.getElementById('arch-badge').textContent = \`◈ \${archName(id).toUpperCase()}\`;
                document.getElementById('arch-badge').style.color = archColor(id);
                document.getElementById('arch-badge2').textContent = archName(id).toUpperCase();
                document.getElementById('arch-badge2').style.color = archColor(id);
                this.updateArchRateInfo();
                try {
                    const prev = JSON.parse(localStorage.getItem('nebula.arch.last') || '{}');
                    localStorage.setItem('nebula.arch.last', JSON.stringify({ ...prev, archId: id, arch: { ...(
                            prev.arch || {}), id, color: archColor(id) } }));
                } catch {}
            },

            updateArchRateInfo() {
                const t = archTTS(currentArch);
                document.getElementById('arch-rate-info').textContent = \`rate:\${t.rate} pitch:\${t.pitch}\`;
            },

            cycleArch() {
                const idx = ARCHETYPES_BASE.indexOf(currentArch);
                const next = ARCHETYPES_BASE[(idx + 1) % ARCHETYPES_BASE.length];
                this.selectArch(next);
                toast(\`◈ \${archName(next).toUpperCase()}\`);
            },

            updateDock(title, sub) {
                document.getElementById('dock-now').textContent = title;
                document.getElementById('dock-sub').textContent = sub;
            },

            eclToggle() {
                const delta = di_phi < .5 ? .25 : -.25;
                updatePhi(delta);
            }
        };

        /* ══════════════════════════════════════════════════════════════════
           TTS
           ══════════════════════════════════════════════════════════════════ */
        const TTS = (() => {
            const TEM_VOZ = typeof window !== "undefined" && typeof window.speechSynthesis !== "undefined";
            if (!TEM_VOZ) {
                function no() { toast("🎧 Voz indisponível"); }
                return { play: no, pause: no, resume: no, stop: no, playPause: no, prev: no };
            }
            let chunks = [],
                idx = 0,
                paused = false,
                startTime = 0,
                totalEst = 0,
                timer = null;

            function getVoice(lang) {
                try {
                    const v = speechSynthesis.getVoices();
                    return v.find(vv => vv.lang === lang) || v.find(vv => vv.lang && vv.lang.startsWith((lang || "pt")
                        .split("-")[0])) || null;
                } catch (e) { return null; }
            }

            function chunkText(text, size) {
                size = size || 220;
                const sents = String(text || "").match(/[^.!?]+[.!?]*/g) || [text];
                const out = [];
                let cur = "";
                for (let i = 0; i < sents.length; i++) {
                    if ((cur + sents[i]).length > size) { if (cur) out.push(cur.trim());
                        cur = sents[i]; } else cur += sents[i];
                }
                if (cur.trim()) out.push(cur.trim());
                return out;
            }

            function setProgress(pct) {
                try { document.getElementById('dockSlider').value = Math.round(pct); } catch (e) {}
            }

            function fmt(s) { return Math.floor(s / 60) + ":" + String(s % 60).padStart(2, "0"); }

            function playChunk(i) {
                if (i >= chunks.length) { onDone(); return; }
                try {
                    const t = archTTS(currentArch);
                    const u = new SpeechSynthesisUtterance(chunks[i]);
                    u.lang = 'pt-BR';
                    u.rate = t.rate || 1;
                    u.pitch = t.pitch || 0.6;
                    const v = getVoice('pt-BR');
                    if (v) try { u.voice = v; } catch (e) {}
                    u.onend = function() { idx++;
                        setProgress(Math.round((idx / Math.max(1, chunks.length)) * 100));
                        playChunk(idx); };
                    u.onerror = function(e) { if (e && e.error !== 'interrupted') console.warn('TTS', e.error); };
                    speechSynthesis.speak(u);
                    document.getElementById('dock-pp').textContent = '⏸';
                    document.getElementById('dock-pp').classList.add('playing');
                } catch (e) { toast("TTS erro"); }
            }

            function onDone() {
                setProgress(100);
                setTimeout(() => setProgress(0), 1000);
                document.getElementById('dock-pp').textContent = '▶';
                document.getElementById('dock-pp').classList.remove('playing');
                clearInterval(timer);
                document.getElementById('dock-time').textContent = '0:00';
            }

            return {
                play: function() {
                    if (!mergedText) { toast('Integra um texto primeiro'); return; }
                    try { speechSynthesis.cancel(); } catch (e) {}
                    chunks = chunkText(mergedText);
                    idx = 0;
                    paused = false;
                    startTime = Date.now();
                    totalEst = Math.round(chunks.join(' ').length / 15);
                    document.getElementById('dock-total').textContent = fmt(totalEst);
                    clearInterval(timer);
                    timer = setInterval(() => {
                        const elapsed = Math.round((Date.now() - startTime) / 1000);
                        document.getElementById('dock-time').textContent = fmt(Math.min(elapsed, totalEst));
                    }, 1000);
                    playChunk(0);
                },
                pause: function() { try { speechSynthesis.pause(); } catch (e) {} paused = true;
                    clearInterval(timer);
                    document.getElementById('dock-pp').textContent = '▶'; },
                resume: function() { try { speechSynthesis.resume(); } catch (e) {} paused = false;
                    document.getElementById('dock-pp').textContent = '⏸'; },
                stop: function() {
                    try { speechSynthesis.cancel(); } catch (e) {}
                    paused = false;
                    idx = 0;
                    clearInterval(timer);
                    setProgress(0);
                    document.getElementById('dock-pp').textContent = '▶';
                    document.getElementById('dock-pp').classList.remove('playing');
                    document.getElementById('dock-time').textContent = '0:00';
                },
                playPause: function() {
                    try {
                        if (speechSynthesis.speaking && !paused) { this.pause(); } else if (paused) { this
                            .resume(); } else { this.play(); }
                    } catch (e) { this.play(); }
                },
                prev: function() { if (idx > 0) { idx = Math.max(0, idx - 1);
                        try { speechSynthesis.cancel(); } catch (e) {}
                        playChunk(idx); } }
            };
        })();

        document.getElementById('dock-pp').addEventListener('click', () => TTS.playPause());

        /* ── FILE IMPORT ── */
        function setupFile(fId, tId) {
            document.getElementById(fId).addEventListener('change', e => {
                const file = e.target.files[0];
                if (!file) return;
                const r = new FileReader();
                r.onload = ev => {
                    let txt = ev.target.result;
                    if (file.name.endsWith('.html')) { const d = document.createElement('div');
                        d.innerHTML = txt;
                        txt = (d.textContent || d.innerText || '').trim(); }
                    document.getElementById(tId).value = txt;
                    toast('📂 ' + file.name);
                };
                r.readAsText(file);
                e.target.value = '';
            });
        }
        setupFile('f1', 't1');
        setupFile('f2', 't2');

        /* ── LS HINTS ── */
        function buildHints() {
            const map1 = ['kobllux_draft_input', 'fractal_t1', 'kobllux_last_result', 'DI_copy_last_result'];
            const map2 = ['fractal_t2', 'blux_draft_input', 'fractal_ultimo'];

            function render(keys, tid, hid) {
                const el = document.getElementById(hid);
                el.innerHTML = '';
                keys.forEach(k => {
                    let v;
                    try { v = localStorage.getItem(k); } catch {}
                    if (!v) return;
                    const chip = document.createElement('span');
                    chip.className = 's-chip';
                    chip.textContent = '↑ ' + k.replace(/kobllux_|fractal_/g, '').slice(0, 16);
                    chip.title = v.slice(0, 100);
                    chip.onclick = () => { document.getElementById(tid).value = v;
                        toast('↑ ' + k); };
                    el.appendChild(chip);
                });
            }
            render(map1, 't1', 'ls-hints-1');
            render(map2, 't2', 'ls-hints-2');
        }

        /* ── TOAST ── */
        let _tt;

        function toast(msg) {
            const wrap = document.getElementById('toast-wrap');
            const t = document.createElement('div');
            t.className = 'toast';
            t.textContent = msg;
            wrap.appendChild(t);
            clearTimeout(_tt);
            _tt = setTimeout(() => { if (t.parentNode) t.remove(); }, 2500);
        }

        /* ── ESCAPE ── */
        function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

        /* ── PANEL TOGGLE ── */
        function togglePanel(header) {
            const panel = header.closest('.panel');
            panel.classList.toggle('collapsed');
        }

        /* ── INIT ── */
        (function init() {
            syncEngineUI();
            FractalApp.selectArch(currentArch);
            buildHints();
            FractalApp.updateDock('FRACTAL 369', 'pronto');
            if (speechSynthesis.onvoiceschanged !== undefined) speechSynthesis.onvoiceschanged = () => {};
            window.addEventListener('storage', buildHints);
            window.addEventListener('di:storage', buildHints);
            document.getElementById('panel-fusor').classList.remove('collapsed');
        })();

        console.log('%c FRACTAL 369 · compacto · tema adaptável', 'background:#0A0A0F;color:#00f2ff;font-size:14px;font-weight:bold;padding:4px 12px;border:1px solid #00f2ff;border-radius:4px;');
        console.log('%c data-theme: ' + document.documentElement.getAttribute('data-theme'), 'color:#bd00ff;font-size:11px;');
    </script>

`;
// ═════════════════════════════════════════════
// CSS
// ═════════════════════════════════════════════
const CSS = ``;
// ═════════════════════════════════════════════
// MOUNT HTML
// ═════════════════════════════════════════════
function mountHTML(){
  if(!HTML)
    return;
  const parser =
    new DOMParser();
  const doc =
    parser.parseFromString(
      HTML,
      "text/html"
    );
  const root =
    document.getElementById(
      "kobllux-runtime-root"
    )
    ||
    document.body;
  while(
    doc.body.firstChild
  ){
    root.appendChild(
      document.importNode(
        doc.body.firstChild,
        true
      )
    );
  }
}
// ═════════════════════════════════════════════
// MOUNT CSS
// ═════════════════════════════════════════════
function mountCSS(){
  if(!CSS)
    return;
  const style =
    document.createElement(
      "style"
    );
  style.id =
    "KOBLLUX_MONOLITH_CSS";
  style.textContent =
    CSS;
  document.head.appendChild(
    style
  );
}
// ═════════════════════════════════════════════
// EXECUTE BUNDLE
// ═════════════════════════════════════════════
function execute(code){
  if(!code.trim())
    return;
  const script =
    document.createElement(
      "script"
    );
  script.textContent =
    code;
  document.body.appendChild(
    script
  );
}
// ═════════════════════════════════════════════
// BOOT
// ═════════════════════════════════════════════
function boot(){
  mountCSS();
  mountHTML();
  execute(``);
  execute(``);
  window.KOBLLUX_RUNTIME.status =
    "READY";
  window.dispatchEvent(
    new CustomEvent(
      "KOBLLUX_READY"
    )
  );
}
// ═════════════════════════════════════════════
// DOM READY
// ═════════════════════════════════════════════
if(
  document.readyState
  ===
  "loading"
){
  document.addEventListener(
    "DOMContentLoaded",
    boot,
    {once:true}
  );
}else{
  boot();
}
})();
