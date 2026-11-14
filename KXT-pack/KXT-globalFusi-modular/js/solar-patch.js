(function () {
    'use strict';
    if (window.__SOLAR_UPGRADE_PATCH__) return;
    window.__SOLAR_UPGRADE_PATCH__ = true;

    var $ = function (s, r) { return (r || document).querySelector(s); };

    // ═══════════════════════════════════════════════════════════════
    // 1. FIX CICLO SOLAR — força background inline (resolve "não muda")
    // ═══════════════════════════════════════════════════════════════
    var BG = {
        day:    'radial-gradient(circle at 30% 20%, #ffffff 0%, #f2f8ff 18%, #d0e9ff 40%, #9ed0ff 65%, #6bb9ff 85%, #59a8ff 100%)',
        sunset: 'linear-gradient(180deg, #fbcfe8 0%, #fb923c 20%, #4c1d95 60%, #111827 100%)',
        night:  'radial-gradient(circle at 20% 0%, #0b1020 0%, #121c3b 40%, #1a237e 80%, #000000 100%)'
    };
    var THEME = {
        day:    { text: '#1a1a1a', primary: '#0284c7', secondary: '#7c3aed' },
        sunset: { text: '#ffffff', primary: '#f97316', secondary: '#a855f7' },
        night:  { text: '#e4ecff', primary: '#00f5ff', secondary: '#ff4bff' }
    };

    function applyModeVisual(mode, silent) {
        mode = mode || 'night';
        var bg = BG[mode] || BG.night;
        var tv = THEME[mode] || THEME.night;

        // Força background via inline COM !important (vence qualquer CSS)
        document.body.style.setProperty('background', bg, 'important');
        document.body.style.setProperty('color', tv.text, 'important');

        // Reforça também a classe (para CSS externo que precise dela)
        document.body.classList.remove('mode-day', 'mode-sunset', 'mode-night');
        document.body.classList.add('mode-' + mode);

        // Variáveis CSS (afetam acentos, labels, botões)
        var r = document.documentElement;
        r.style.setProperty('--primary', tv.primary);
        r.style.setProperty('--secondary', tv.secondary);

        // Persiste
        try { localStorage.setItem('di_solarMode', mode); } catch (_) {}

        // Feedback visual
        try { if (typeof App !== 'undefined' && App.updateUI) App.updateUI(); } catch (_) {}

        syncModeButtons(mode);
        if (!silent && window.__kxtUiReady) showToast('☀ Modo: ' + mode.toUpperCase());
    }

    // Patch em App.setMode quando disponível (para o Cockpit original também funcionar)
    function patchSetMode() {
        if (typeof App === 'undefined' || !App || typeof App.setMode !== 'function') return false;
        if (App.setMode.__solarPatched) return true;

        var orig = App.setMode.bind(App);
        App.setMode = function (m) {
            try { orig(m); } catch (_) { /* ignora falha interna */ }
            applyModeVisual(m);
        };
        App.setMode.__solarPatched = true;

        // Aplica o modo atual agora
        try { applyModeVisual(App.state.solarMode || 'night', true); } catch (_) {}
        return true;
    }

    var tries = 0;
    var t = setInterval(function () {
        if (patchSetMode() || ++tries > 60) clearInterval(t);
    }, 200);

    // ═══════════════════════════════════════════════════════════════
    // 2. HEADER 2 — barra top com título + controles
    // ═══════════════════════════════════════════════════════════════
    function injectHeaderCSS() {
        if (document.getElementById('solar-h2-css')) return;
        var st = document.createElement('style');
        st.id = 'solar-h2-css';
        st.textContent = [
            '#solarHeader2{position:fixed;top:0;left:0;right:0;height:44px;display:flex;align-items:center;gap:6px;padding:0 10px;',
            'background:linear-gradient(180deg,color-mix(in srgb,var(--bg-deep) 96%,transparent),color-mix(in srgb,var(--bg-deep) 72%,transparent));',
            'backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);',
            'border-bottom:1px solid rgba(255,255,255,0.08);z-index:9998;color:var(--text-main);font-family:var(--font-ui);',
            'transition:transform .28s cubic-bezier(.4,0,.2,1),opacity .22s ease}',
            '#solarHeader2.hidden{transform:translateY(-100%);opacity:0;pointer-events:none}',
            '#solarHeader2 .h2-brand{display:flex;align-items:center;gap:8px;font-weight:800;font-size:10px;',
            'letter-spacing:.14em;text-transform:uppercase;color:var(--text-muted);flex-shrink:0}',
            '#solarHeader2 .h2-dot{width:6px;height:6px;border-radius:50%;background:var(--primary);',
            'box-shadow:0 0 10px var(--primary);animation:h2pulse 2s infinite}',
            '@keyframes h2pulse{0%,100%{opacity:1}50%{opacity:.35}}',
            '#solarHeader2 .h2-title{flex:1;min-width:0;text-align:left;padding:4px 8px;height:28px;',
            'display:flex;align-items:center;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;',
            'background:transparent;border:0;color:var(--text-main);font:600 10.5px/1 var(--font-code);',
            'letter-spacing:.06em;text-transform:uppercase;cursor:pointer;border-radius:6px}',
            '#solarHeader2 .h2-title:hover{background:rgba(255,255,255,0.04)}',
            '#solarHeader2 .h2-short{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}',
            '#solarHeader2 .h2-btn{width:32px;height:32px;flex-shrink:0;display:inline-flex;align-items:center;',
            'justify-content:center;border-radius:9px;border:1px solid rgba(255,255,255,0.08);',
            'background:rgba(255,255,255,0.04);color:var(--text-main);cursor:pointer;font-size:13px;',
            'transition:all .18s ease}',
            '#solarHeader2 .h2-btn:hover{background:rgba(255,255,255,0.1);border-color:var(--primary);color:var(--primary)}',
            '#solarHeader2 .h2-btn.playing{background:color-mix(in srgb,var(--primary) 20%,transparent);',
            'border-color:var(--primary);color:var(--primary);box-shadow:0 0 10px color-mix(in srgb,var(--primary) 40%,transparent)}',
            '#solarHeader2 .h2-theme{width:32px;height:32px;border-radius:50%;border:1px solid rgba(255,255,255,0.12);',
            'background:rgba(255,255,255,0.04);cursor:pointer;display:grid;place-items:center;',
            'transition:all .2s ease;flex-shrink:0}',
            '#solarHeader2 .h2-theme::before{content:"";width:10px;height:10px;border-radius:50%;',
            'background:var(--primary);box-shadow:0 0 12px var(--primary)}',
            '#solarHeader2 .h2-theme:hover{border-color:var(--primary);transform:scale(1.06)}',
            '#solarHeader2 .h2-modes{display:flex;gap:2px;flex-shrink:0;background:rgba(0,0,0,0.3);',
            'border-radius:8px;padding:2px;border:1px solid rgba(255,255,255,0.06)}',
            '#solarHeader2 .h2-mode{padding:4px 8px;border:0;border-radius:6px;background:transparent;',
            'color:var(--text-muted);font:700 9px/1 var(--font-code);letter-spacing:.05em;cursor:pointer;',
            'transition:all .15s ease}',
            '#solarHeader2 .h2-mode.active{background:color-mix(in srgb,var(--primary) 20%,transparent);color:var(--primary)}',
            '/* Push de elementos que colidiriam com a barra */',
            '.header-orb{top:84px !important}',
            '#usernameDisplay{top:164px !important}',
            '#chat-container{padding-top:184px !important}',
            '#modeIndicator{display:none !important}','.top-bar{top:44px !important}','body.h2-hidden .top-bar{top:0 !important}',
            '@media(max-width:520px){#solarHeader2{gap:4px;padding:0 6px}',
            '#solarHeader2 .h2-brand small{display:none}',
            '#solarHeader2 .h2-btn{width:28px;height:28px;font-size:12px}',
            '#solarHeader2 .h2-mode{padding:3px 5px;font-size:8px}}'
        ].join('');
        document.head.appendChild(st);
    }

    function buildHeader2() {
        if (document.getElementById('solarHeader2')) return;
        injectHeaderCSS();

        var bar = document.createElement('div');
        bar.id = 'solarHeader2';
        bar.innerHTML = ''
            + '<div class="h2-brand"><span class="h2-dot"></span><span id="solarH2Brand">SOLAR</span></div>'
            + '<button type="button" class="h2-title" id="solarH2Title" title="Documento ativo">'
            +   '<span class="h2-short" id="solarH2Short">DUAL.INFODOSE</span>'
            + '</button>'
            + '<div class="h2-modes" role="group" aria-label="Modo solar">'
            +   '<button type="button" class="h2-mode" data-mode="day" title="Dia">DIA</button>'
            +   '<button type="button" class="h2-mode" data-mode="sunset" title="Pôr do sol">SOL</button>'
            +   '<button type="button" class="h2-mode active" data-mode="night" title="Noite">NOITE</button>'
            + '</div>'
            + '<button type="button" class="h2-btn" id="solarH2Copy" title="Copiar conversa">⧉</button>'
            + '<button type="button" class="h2-btn" id="solarH2Download" title="Baixar conversa">↓</button>'
            + '<button type="button" class="h2-btn" id="solarH2TTS" title="Som ligado — toque para silenciar · segure para ouvir a última resposta">🔊</button>'
            + '<button type="button" class="h2-btn" id="solarH2Music" title="Ambient / trilha">🎵</button>'
            + '<button type="button" class="h2-theme" id="solarH2Theme" title="Próximo tema"></button>';

        document.body.appendChild(bar);

        // Mode pills
        bar.querySelectorAll('.h2-mode').forEach(function (btn) {
            btn.addEventListener('click', function () {
                var m = btn.dataset.mode;
                try {
                    if (typeof App !== 'undefined' && App.setMode) {
                        App.state.isAutoSolar = false;
                        App.setMode(m);
                    } else {
                        applyModeVisual(m);
                    }
                } catch (_) { applyModeVisual(m); }
            });
        });

        // Theme dot
        $('#solarH2Theme').addEventListener('click', function () {
            try {
                if (typeof App !== 'undefined' && App.cycleSolar) App.cycleSolar();
                else {
                    var cur = (App && App.state && App.state.solarMode) || 'night';
                    var next = cur === 'day' ? 'sunset' : cur === 'sunset' ? 'night' : 'day';
                    applyModeVisual(next);
                }
            } catch (_) {
                applyModeVisual((App && App.state && App.state.solarMode) === 'day' ? 'sunset' : 'day');
            }
        });

        // Copy
        $('#solarH2Copy').addEventListener('click', function () {
            var msgs = [];
            try { msgs = App && App.state && App.state.messages || []; } catch (_) {}
            var txt = msgs.map(function (m) { return '[' + m.role + '] ' + m.content; }).join('\n\n');
            if (!txt) { showToast('Sem mensagens'); return; }
            navigator.clipboard.writeText(txt).then(function () {
                showToast('⧉ Copiado (' + msgs.length + ' mensagens)');
            });
        });

        // Download
        $('#solarH2Download').addEventListener('click', function () {
            var msgs = [];
            try { msgs = App && App.state && App.state.messages || []; } catch (_) {}
            var txt = msgs.map(function (m) { return '[' + m.role + '] ' + m.content; }).join('\n\n');
            if (!txt) { showToast('Sem mensagens'); return; }
            var blob = new Blob([txt], { type: 'text/plain;charset=utf-8' });
            var url = URL.createObjectURL(blob);
            var a = document.createElement('a');
            a.href = url;
            a.download = 'solar-conversa-' + Date.now() + '.txt';
            document.body.appendChild(a); a.click(); a.remove();
            setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
            showToast('↓ Baixado');
        });

        // TTS — última resposta IA
        if (window.KXT_TTS) KXT_TTS.bindButton($('#solarH2TTS'));   // liga/desliga geral · segurar = ouvir última resposta

        // Music — Web Audio ambient (pad sintetizado, sem dependências)
        var ambCtx = null, ambGain = null, ambOsc = [];
        $('#solarH2Music').addEventListener('click', function () {
            var btn = this;
            try {
                if (!ambCtx) ambCtx = new (window.AudioContext || window.webkitAudioContext)();
            } catch (e) { showToast('Áudio indisponível'); return; }
            if (ambCtx.state === 'suspended') ambCtx.resume();

            if (ambGain && ambGain.gain.value > 0.01) {
                ambGain.gain.linearRampToValueAtTime(0, ambCtx.currentTime + 0.6);
                var toStop = ambOsc; ambOsc = []; ambGain = null;
                setTimeout(function () { toStop.forEach(function (o) { try { o.stop(); } catch (_) {} }); }, 700);
                btn.classList.remove('playing');
                showToast('🎵 Ambient OFF');
                return;
            }

            ambGain = ambCtx.createGain();
            ambGain.gain.value = 0;
            ambGain.connect(ambCtx.destination);

            // Acorde Cmaj7 (C E G B) em 3 oitavas
            [130.81, 164.81, 196.00, 246.94, 261.63, 329.63].forEach(function (f, i) {
                var o = ambCtx.createOscillator();
                o.type = 'sine';
                o.frequency.value = f;
                o.detune.value = (i - 2.5) * 2;
                var g = ambCtx.createGain();
                g.gain.value = 0.16;
                o.connect(g).connect(ambGain);
                o.start();
                ambOsc.push(o);
            });
            ambGain.gain.linearRampToValueAtTime(0.055, ambCtx.currentTime + 1.8);
            btn.classList.add('playing');
            showToast('🎵 Ambient ON');
        });
    }

    function syncModeButtons(mode) {
        if (!mode) { try { mode = (App && App.state && App.state.solarMode) || 'night'; } catch (_) { mode = 'night'; } }
        document.querySelectorAll('#solarHeader2 .h2-mode').forEach(function (b) {
            b.classList.toggle('active', b.dataset.mode === mode);
        });
    }

    function updateTitle(text) {
        var el = document.getElementById('solarH2Short');
        if (!el) return;
        var t = String(text || '').trim().slice(0, 32) || 'DUAL.INFODOSE';
        el.textContent = t;
    }

    function watchActiveDoc() {
        function fromMessages() {
            try {
                var msgs = (App && App.state && App.state.messages) || [];
                for (var i = 0; i < msgs.length; i++) {
                    if (msgs[i].role === 'user') { updateTitle(msgs[i].content.slice(0, 32)); return; }
                }
            } catch (_) {}
        }
        fromMessages();
        var chat = document.getElementById('chat-container');
        if (chat) new MutationObserver(fromMessages).observe(chat, { childList: true });
    }

    // ═══════════════════════════════════════════════════════════════
    // 3. COCKPIT EXPANDIDO (Background Engine / Backup / Perf)
    // ═══════════════════════════════════════════════════════════════
    function expandCockpit() {
        var body = document.querySelector('#drawerProfile .drawer-body');
        if (!body) return false;
        if (document.getElementById('solarBgOp')) return true;

        var section = document.createElement('div');
        section.id = 'solarExtrasCockpit';
        section.innerHTML = ''
            + '<div class="cockpit-item" style="border-color:color-mix(in srgb,var(--primary) 40%,transparent);margin-top:10px">'
            +   '<div class="cockpit-label">⚙ Background Engine</div>'
            +   '<label style="font-size:.75rem;color:var(--text-muted);display:flex;justify-content:space-between;margin-top:6px">'
            +     '<span>Opacidade</span><span id="solarBgOpVal" style="font-family:var(--font-code);color:var(--primary)">12%</span>'
            +   '</label>'
            +   '<input id="solarBgOp" type="range" min="0" max="100" value="12" style="width:100%;accent-color:var(--primary);margin-top:4px">'
            +   '<label style="font-size:.75rem;color:var(--text-muted);display:block;margin-top:10px">Blend</label>'
            +   '<select id="solarBgBlend" style="width:100%;padding:6px 10px;border-radius:8px;border:1px solid rgba(255,255,255,.1);background:rgba(0,0,0,.3);color:var(--text-main);font-family:var(--font-code);font-size:.8rem;outline:none;margin-top:4px">'
            +     '<option value="lighten">Lighten (padrão)</option>'
            +     '<option value="normal">Normal</option>'
            +     '<option value="multiply">Multiply</option>'
            +     '<option value="screen">Screen</option>'
            +     '<option value="overlay">Overlay</option>'
            +     '<option value="soft-light">Soft Light</option>'
            +     '<option value="luminosity">Luminosity</option>'
            +   '</select>'
            +   '<div style="display:grid;grid-template-columns:repeat(5,1fr);gap:4px;margin-top:8px">'
            +     '<button class="solar-preset" data-op="0">0%</button>'
            +     '<button class="solar-preset" data-op="12">12%</button>'
            +     '<button class="solar-preset" data-op="35">35%</button>'
            +     '<button class="solar-preset" data-op="60">60%</button>'
            +     '<button class="solar-preset" data-op="100">100%</button>'
            +   '</div>'
            + '</div>'
            + '<div class="cockpit-item" style="margin-top:10px">'
            +   '<div class="cockpit-label">💾 Backup / Estado</div>'
            +   '<div class="control-row" style="margin-top:6px">'
            +     '<button class="btn-block" id="solarBackupExport" type="button">⬇ Exportar</button>'
            +     '<button class="btn-block" id="solarBackupImport" type="button">⬆ Importar</button>'
            +   '</div>'
            +   '<button class="btn-block" id="solarResetAll" type="button" style="width:100%;margin-top:8px;border-color:rgba(255,80,100,.4);color:#ff6b6b">⌦ Resetar tudo</button>'
            + '</div>'
            + '<div class="cockpit-item" style="margin-top:10px">'
            +   '<div class="cockpit-label">⚡ Preferências</div>'
            +   '<label style="font-size:.75rem;color:var(--text-muted);display:flex;justify-content:space-between;margin-top:6px">'
            +     '<span>Vidro (blur)</span><span id="solarGlassVal" style="font-family:var(--font-code);color:var(--primary)">20px</span>'
            +   '</label>'
            +   '<input id="solarGlass" type="range" min="0" max="32" step="1" value="20" style="width:100%;accent-color:var(--primary);margin-top:4px">'
            +   '<label style="display:flex;align-items:center;gap:8px;margin-top:10px;font-size:.8rem;cursor:pointer">'
            +     '<input type="checkbox" id="solarPerfLite" style="width:16px;height:16px;accent-color:var(--primary)">'
            +     '<span>Performance lite (sem blur/animação)</span>'
            +   '</label>'
            + '</div>';

        // distribui nas seções do cockpit único: Background Engine → Background · Backup/Preferências → Sistema
        var bgSec = document.getElementById('cockpitBg'), sysSec = document.getElementById('cockpitSystem');
        var kids = Array.prototype.slice.call(section.children);
        if (bgSec && sysSec && kids.length >= 3) { bgSec.appendChild(kids[0]); kids.slice(1).forEach(function (k) { sysSec.appendChild(k); }); }
        else body.appendChild(section);

        // ── Background opacity ──
        var bgOp = $('#solarBgOp'), bgOpVal = $('#solarBgOpVal'), bgLayer = $('#bg-fake-custom');
        var savedOp = localStorage.getItem('solar:bg:opacity') || '12';
        bgOp.value = savedOp; bgOpVal.textContent = savedOp + '%';
        if (bgLayer) bgLayer.style.opacity = (parseInt(savedOp, 10) / 100).toString();

        bgOp.addEventListener('input', function () {
            var v = bgOp.value;
            bgOpVal.textContent = v + '%';
            if (bgLayer) bgLayer.style.opacity = (parseInt(v, 10) / 100).toString();
            localStorage.setItem('solar:bg:opacity', v);
        });

        section.querySelectorAll('.solar-preset').forEach(function (b) {
            b.style.cssText = 'padding:6px 0;border-radius:6px;border:1px solid rgba(255,255,255,.1);background:rgba(255,255,255,.03);color:var(--text-main);cursor:pointer;font-family:var(--font-code);font-size:.7rem';
            b.addEventListener('click', function () { bgOp.value = b.dataset.op; bgOp.dispatchEvent(new Event('input')); });
        });

        // ── Blend ──
        var bgBlend = $('#solarBgBlend'), savedBlend = localStorage.getItem('solar:bg:blend') || 'lighten';
        bgBlend.value = savedBlend;
        if (bgLayer) bgLayer.style.mixBlendMode = savedBlend;
        bgBlend.addEventListener('change', function () {
            if (bgLayer) bgLayer.style.mixBlendMode = bgBlend.value;
            localStorage.setItem('solar:bg:blend', bgBlend.value);
        });

        // ── Chave SK compartilhada ──
        var cockpitKey = $('#cockpitApiKey');
        if (cockpitKey) {
          cockpitKey.value = localStorage.getItem('di_apiKey') || '';
          cockpitKey.addEventListener('change', function(){ window.di_setApiKey(cockpitKey.value); });
          cockpitKey.addEventListener('blur', function(){ window.di_setApiKey(cockpitKey.value); });
        }

        // busca de modelos OpenRouter: ver ponte final (card + cockpit)

        // ── Backup ──
        $('#solarBackupExport').addEventListener('click', function () {
            var data = {};
            for (var i = 0; i < localStorage.length; i++) {
                var k = localStorage.key(i);
                if (/^(di_|solar|fusion_os)/.test(k)) data[k] = localStorage.getItem(k);
            }
            var blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            var a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = 'solar-backup-' + Date.now() + '.json';
            document.body.appendChild(a); a.click(); a.remove();
            setTimeout(function () { URL.revokeObjectURL(a.href); }, 1000);
            showToast('⬇ Backup exportado');
        });

        $('#solarBackupImport').addEventListener('click', function () {
            var inp = document.createElement('input');
            inp.type = 'file'; inp.accept = '.json,application/json';
            inp.addEventListener('change', function () {
                var f = inp.files && inp.files[0]; if (!f) return;
                f.text().then(function (txt) {
                    try {
                        var d = JSON.parse(txt);
                        if (!d || typeof d !== 'object') throw 0;
                        if (!confirm('Importar backup? Substitui configs atuais.')) return;
                        Object.keys(d).forEach(function (k) { try { localStorage.setItem(k, d[k]); } catch (_) {} });
                        showToast('⬆ Importado — recarregando…');
                        setTimeout(function () { location.reload(); }, 700);
                    } catch (_) { showToast('❌ JSON inválido'); }
                });
            });
            inp.click();
        });

        $('#solarResetAll').addEventListener('click', function () {
            if (!confirm('Apagar TUDO e recarregar?')) return;
            ['di_apiKey','di_modelName','di_userName','di_trainingText','di_systemRole','di_bgImages','di_orModelsCache','di_kobSeal','di_kodux','di_usageLog','di_usageRange','di_ttsOn','di_blobOp','di_infodoseName','di_solarMode',
             'di_solarAuto','solar:bg:opacity','solar:bg:blend','solar:bg:mode','solar:glass','solar:perf-lite',
             'fusion_os_data_v2','fusion_os_ui_state','fusion_os_state_v2_3'].forEach(function (k) {
                try { localStorage.removeItem(k); } catch (_) {}
            });
            try { indexedDB.deleteDatabase('InfodoseDB'); } catch (_) {}
            showToast('⌦ Resetado — recarregando…');
            setTimeout(function () { location.reload(); }, 700);
        });

        // ── Glass blur ──
        var glass = $('#solarGlass'), glassVal = $('#solarGlassVal');
        var savedGlass = localStorage.getItem('solar:glass') || '20';
        glass.value = savedGlass; glassVal.textContent = savedGlass + 'px';
        function applyGlass(v) {
            document.querySelectorAll('.drawer-content, .fusion-card, .keys-card').forEach(function (el) {
                el.style.backdropFilter = 'blur(' + v + 'px) saturate(180%)';
                el.style.webkitBackdropFilter = 'blur(' + v + 'px) saturate(180%)';
            });
        }
        applyGlass(savedGlass);
        glass.addEventListener('input', function () {
            glassVal.textContent = glass.value + 'px';
            localStorage.setItem('solar:glass', glass.value);
            applyGlass(glass.value);
        });

        // ── Perf-lite ──
        var perfLite = $('#solarPerfLite');
        var isLite = localStorage.getItem('solar:perf-lite') === '1';
        perfLite.checked = isLite;
        togglePerfLite(isLite);
        perfLite.addEventListener('change', function () {
            togglePerfLite(perfLite.checked);
            localStorage.setItem('solar:perf-lite', perfLite.checked ? '1' : '0');
            showToast('⚡ Perf-lite: ' + (perfLite.checked ? 'ON' : 'OFF'));
        });

        function togglePerfLite(on) {
            document.documentElement.classList.toggle('solar-perf-lite', on);
            var st = document.getElementById('solar-perf-css');
            if (on) {
                if (!st) { st = document.createElement('style'); st.id = 'solar-perf-css'; document.head.appendChild(st); }
                st.textContent = '.solar-perf-lite *{animation-duration:0s!important;transition-duration:0s!important}'
                    + '.solar-perf-lite .blob,.solar-perf-lite .sun-background,.solar-perf-lite #particles-js{display:none!important}'
                    + '.solar-perf-lite .drawer-content,.solar-perf-lite .fusion-card{backdrop-filter:none!important;-webkit-backdrop-filter:none!important}';
            } else if (st) st.remove();
        }

        return true;
    }

    // ═══════════════════════════════════════════════════════════════
    // 4. Utilitário: toast
    // ═══════════════════════════════════════════════════════════════
    function showToast(msg) {
        var t = document.getElementById('nv-toast');
        if (t) {
            t.textContent = msg;
            t.classList.add('show');
            clearTimeout(showToast._t);
            showToast._t = setTimeout(function () { t.classList.remove('show'); }, 2500);
            return;
        }
        if (typeof window.KBLX_TOAST === 'function') { try { window.KBLX_TOAST(msg); return; } catch (_) {} }
        console.log('[solar]', msg);
    }

    // ═══════════════════════════════════════════════════════════════
    // 5. Scroll hide/show do header 2
    // ═══════════════════════════════════════════════════════════════
    function installScrollHide() {
        var h2 = document.getElementById('solarHeader2');
        if (!h2) return;
        var lastY = window.scrollY, ticking = false;
        window.addEventListener('scroll', function () {
            if (ticking) return;
            requestAnimationFrame(function () {
                var y = window.scrollY;
                if (y <= 10) h2.classList.remove('hidden');
                else if (y > lastY + 8) h2.classList.add('hidden');
                else if (y < lastY - 8) h2.classList.remove('hidden');
                document.body.classList.toggle('h2-hidden', h2.classList.contains('hidden'));
                lastY = y; ticking = false;
            });
            ticking = true;
        }, { passive: true });
    }

    // ═══════════════════════════════════════════════════════════════
    // 6. BOOT com retry
    // ═══════════════════════════════════════════════════════════════
    var bootTries = 0;
    function boot() {
        bootTries++;
        var allOk = true;

        if (!document.getElementById('solarHeader2')) {
            buildHeader2();
            installScrollHide();
        }
        if (!expandCockpit()) allOk = false;

        try {
            var cur = (App && App.state && App.state.solarMode) || 'night';
            applyModeVisual(cur, true);
        } catch (_) {}

        if (bootTries === 1) watchActiveDoc();

        if (!allOk && bootTries < 30) setTimeout(boot, 300);
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { setTimeout(boot, 100); });
    else setTimeout(boot, 100);
    KXT_ready(function () { setTimeout(boot, 500); setTimeout(function () { window.__kxtUiReady = true; }, 2200); });

    // Re-monta o cockpit quando o drawer abre
    document.addEventListener('click', function (e) {
        if (e.target.closest('#orbToggle') || e.target.closest('[onclick*="toggleDrawer"]')) {
            setTimeout(expandCockpit, 150);
        }
    }, { passive: true });

    // ═══════════════════════════════════════════════════════════════
    // 7. API pública
    // ═══════════════════════════════════════════════════════════════
    window.SolarUpgrade = {
        setMode: applyModeVisual,
        rebuild: boot,
        updateTitle: updateTitle,
        get mode() { try { return (App && App.state && App.state.solarMode) || 'night'; } catch (_) { return 'night'; } }
    };

    console.log('%c[SOLAR-UPGRADE]%c ✓ Header 2 + Cockpit expandido + Solar cycle fix',
        'background:#00f5ff;color:#000;padding:2px 8px;border-radius:3px',
        'color:#00f5ff');
})();
