(function() {
  // ============================================================
  // 1. ACORDEÃO (Kob.Accordion)
  // ============================================================
  function makeCollapsible(node) {
    if (!node || node.dataset.accordionInit) return;
    node.dataset.accordionInit = "true";
    const header = node.querySelector('.accordion-header');
    const body = node.querySelector('.collapsible-body');
    if (!header || !body) return;
    if (!header.querySelector('.indicator')) {
      const indicator = document.createElement('span');
      indicator.className = 'indicator';
      indicator.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>';
      header.appendChild(indicator);
    }
    if (!node.classList.contains('is-collapsed') && !node.classList.contains('is-open')) node.classList.add('is-open');
    if (node.classList.contains('is-collapsed')) body.style.height = '0px';
    header.addEventListener('click', (e) => {
      const targetTag = e.target.tagName.toLowerCase();
      if (['input', 'select', 'button', 'textarea'].includes(targetTag)) return;
      const isCollapsed = node.classList.contains('is-collapsed');
      if (isCollapsed) {
        node.classList.remove('is-collapsed');
        node.classList.add('is-open');
        body.style.height = body.scrollHeight + 'px';
        body.addEventListener('transitionend', function handler(ev) {
          if (ev.propertyName === 'height') {
            body.style.height = 'auto';
            body.removeEventListener('transitionend', handler);
          }
        });
      } else {
        body.style.height = body.scrollHeight + 'px';
        void body.offsetHeight;
        node.classList.remove('is-open');
        node.classList.add('is-collapsed');
        body.style.height = '0px';
      }
    });
  }

  const accordion = {
    open: (card) => {
      card = (typeof card === 'string') ? document.querySelector(card) : card;
      if (card) { card.classList.remove('is-collapsed'); card.classList.add('is-open'); }
    },
    close: (card) => {
      card = (typeof card === 'string') ? document.querySelector(card) : card;
      if (card) { card.classList.remove('is-open'); card.classList.add('is-collapsed'); }
    },
    toggle: (card) => {
      card = (typeof card === 'string') ? document.querySelector(card) : card;
      card && card.querySelector('.accordion-header')?.click();
    },
    _init: () => {
      document.querySelectorAll('.accordion').forEach(makeCollapsible);
      const observer = new MutationObserver((muts) => {
        muts.forEach((m) => {
          m.addedNodes && m.addedNodes.forEach((node) => {
            if (!(node instanceof Element)) return;
            if (node.matches && node.matches('.accordion')) makeCollapsible(node);
            node.querySelectorAll && node.querySelectorAll('.accordion').forEach((el) => makeCollapsible(el));
          });
        });
      });
      if (document.body) observer.observe(document.body, { childList: true, subtree: true });
    }
  };

  // ============================================================
  // 2. MOTOR 3·6·9 (Kob.Engine)
  // ============================================================
  const engine = (function() {
    // estado interno
    let _step = parseInt(localStorage.getItem('kobllux_engine_step') || '0', 10);
    let _reverse = localStorage.getItem('kobllux_reverse_mode') === 'true';
    let _jump = parseInt(localStorage.getItem('kobllux_jump_step') || '0', 10);
    let _use3697 = localStorage.getItem('kobllux_cycle_3697') === 'true';

    // arquétipos (preenchidos depois)
   // =========================================
      // 2. BASE DE ARQUÉTIPOS + USER
      // =========================================
      const di_userNameRaw = localStorage.getItem("di_userName") || "";
      const userKey = di_userNameRaw.trim().toLowerCase();
      const displayUserName = di_userNameRaw.trim() || "User";

      let ARCHETYPES_BASE = [
        "atlas", "nova", "vitalis", "pulse", "kaos", "kodux", "lumine",
        "aion", "kobllux", "artemis", "serena", "genus", "solus",
        "rhea", "uno", "dual", "trinity", "infodose", "horus", "bllue",
        "luxara",
        "velor", "elysha", "sylon", "naira", "thenir", "eloh", "novael",
        "aelya", "ignyra", "lumara", "kaythar", "elya", "sylla", "anamyx",
        "yamantek", "metalux", "kd1", "koφd1", "christos",
        "aek_dion", "aekael_domnnus", "nephesh_elyon"
      ];

      if (userKey && !ARCHETYPES_BASE.includes(userKey)) {
        ARCHETYPES_BASE.push(userKey);
      }

      let archetypes = [...ARCHETYPES_BASE];

      let archNames = {
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
        elysha: "Elysha",
        luxara: "Luxara",
        velor: "Velor",
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
        elya: "Elya",
        anamyx: "Anamyx",
        yamantek: "Yamantek",
        metalux: "Metalux",
        kd1: "KD1",
        "koφd1": "KOΦD1",
        christos: "Christos",
        k_dion: "a€K_Dion",
        kael_domnnus: "a€Kael DommnuS",
        nephesh_elyon: "a€Nephesh Elyon"
      };
      if (userKey) archNames[userKey] = di_userNameRaw.trim();

      const userOption = document.getElementById("diUserOption");
      if (userOption) {
        userOption.value = userKey || "user";
        userOption.textContent = `${displayUserName} (Usuário/Núcleo)`;
      }


    // utilitários
    function saveState() {
      localStorage.setItem('kobllux_engine_step', String(_step));
      localStorage.setItem('kobllux_reverse_mode', String(_reverse));
      localStorage.setItem('kobllux_jump_step', String(_jump));
      localStorage.setItem('kobllux_cycle_3697', String(_use3697));
    }

    function syncUI() {
      document.querySelectorAll('[data-engine]').forEach(btn => {
        const val = parseInt(btn.dataset.engine, 10);
        btn.classList.toggle('is-active', val === _step);
      });
      document.querySelectorAll('[data-jump]').forEach(btn => {
        const val = parseInt(btn.dataset.jump, 10);
        btn.classList.toggle('is-active', val === _jump);
      });
      const reverseBtn = document.getElementById('reverseToggle');
      if (reverseBtn) {
        reverseBtn.textContent = `Reverse: ${_reverse ? 'ON' : 'OFF'}`;
        reverseBtn.classList.toggle('is-active', _reverse);
      }
      const cycleBtn = document.getElementById('cycle3697');
      if (cycleBtn) {
        cycleBtn.textContent = `3-6-9-7: ${_use3697 ? 'ON' : 'OFF'}`;
        cycleBtn.classList.toggle('is-active', _use3697);
      }
      const statusBar = document.getElementById('statusBar');
      if (statusBar && !statusBar.textContent.includes('Opcode')) {
        statusBar.textContent = `Motor ${_step} · ${_reverse ? 'Reverse' : 'Forward'} · salto +${_jump} · ${_use3697 ? '3-6-9-7' : 'Linear'}`;
      }
    }

    // API pública
    const engineAPI = {
      get step() { return _step; },
      get reverse() { return _reverse; },
      get jump() { return _jump; },
      get use3697() { return _use3697; },

      setStep(val) {
        _step = val;
        saveState();
        syncUI();
        return this;
      },
      toggleReverse() {
        _reverse = !_reverse;
        saveState();
        syncUI();
        return this;
      },
      setJump(val) {
        _jump = val;
        saveState();
        syncUI();
        return this;
      },
      toggle3697() {
        _use3697 = !_use3697;
        saveState();
        syncUI();
        return this;
      },

      getSequence(startIndex, length) {
        const total = archetypes.length;
        if (total === 0) return [];
        const seq = [];
        let idx = ((startIndex % total) + total) % total;
        const pattern = _use3697 ? [3, 6, 9, 7] : [_step];
        for (let i = 0; i < length; i++) {
          seq.push(archetypes[idx]);
          let step = pattern[i % pattern.length];
          if (_reverse) step *= -1;
          step += _jump;
          idx = (idx + step) % total;
          if (idx < 0) idx += total;
        }
        return seq;
      },

      // sincroniza com a lista de arquétipos (usado pelo carregamento JSON)
      _setArchetypes(list, names) {
        archetypes = list;
        archNames = names;
      },

      getArchetypeName(id) {
        return archNames[id] || id;
      },

      // reinicia UI
      _syncUI: syncUI
    };

    // eventos dos botões (setup)
    document.querySelectorAll('[data-engine]').forEach(btn => {
      btn.addEventListener('click', () => {
        engineAPI.setStep(parseInt(btn.dataset.engine, 10));
        showToast(`Motor +${engineAPI.step} ativado`);
      });
    });
    document.querySelectorAll('[data-jump]').forEach(btn => {
      btn.addEventListener('click', () => {
        engineAPI.setJump(parseInt(btn.dataset.jump, 10));
        showToast(`Salto extra +${engineAPI.jump}`);
      });
    });
    const reverseBtn = document.getElementById('reverseToggle');
    if (reverseBtn) {
      reverseBtn.addEventListener('click', () => {
        engineAPI.toggleReverse();
        showToast(`Reverse ${engineAPI.reverse ? 'ATIVADO' : 'DESATIVADO'}`);
      });
    }
    const cycleBtn = document.getElementById('cycle3697');
    if (cycleBtn) {
      cycleBtn.addEventListener('click', () => {
        engineAPI.toggle3697();
        showToast(`Ciclo 3-6-9-7 ${engineAPI.use3697 ? 'ATIVADO' : 'DESATIVADO'}`);
      });
    }

    syncUI();
    return engineAPI;
  })();

  // ============================================================
  // 3. KOB.VOICE (com espera de vozes)
  // ============================================================
  const voice = (function() {
    // Promise que resolve quando as vozes estiverem carregadas
    const voicesReady = new Promise((resolve) => {
      const check = () => {
        const voices = speechSynthesis.getVoices();
        if (voices.length) {
          resolve(voices);
        } else {
          speechSynthesis.onvoiceschanged = () => {
            resolve(speechSynthesis.getVoices());
          };
        }
      };
      check();
    });

    function getArchetype(id) {
      return window.ARCHETYPE_MAP?.[id] || null;
    }

    function apply369(cfg = {}) {
      const clone = { ...cfg };
      const eng = window.Kob?.Engine || window.KobEngine;
      if (eng) {
        if (typeof eng.step === 'number') {
          clone.rate = (clone.rate ?? 1) + (eng.step * 0.05);
        }
        if (typeof eng.jump === 'number') {
          clone.pitch = (clone.pitch ?? 1) + (eng.jump * 0.08);
        }
        if (eng.reverse) {
          clone.pitch = Math.max(0.2, 2 - (clone.pitch ?? 1));
        }
      }
      clone.rate = Math.max(0.1, Math.min(10, clone.rate ?? 1));
      clone.pitch = Math.max(0, Math.min(2, clone.pitch ?? 1));
      return clone;
    }

    function createUtterance(text, archetypeId) {
      const base = getArchetype(archetypeId) || {};
      const cfg = apply369(base);
      const u = new SpeechSynthesisUtterance(text);
      u.lang = cfg.lang || 'pt-BR';
      u.pitch = cfg.pitch ?? 1;
      u.rate = cfg.rate ?? 1;
      u.volume = cfg.volume ?? 1;

      // seleção de voz (assíncrona)
      voicesReady.then((voices) => {
        if (cfg.voice) {
          const voice =
            voices.find(v => v.name === cfg.voice) ||
            voices.find(v => v.name.includes(cfg.voice)) ||
            voices.find(v => v.lang === u.lang);
          if (voice) u.voice = voice;
        }
      });
      return u;
    }

    async function speak(text, archetypeId) {
      await voicesReady; // garante que as vozes estão carregadas
      speechSynthesis.cancel();
      const u = createUtterance(text, archetypeId);
      speechSynthesis.speak(u);
      return u;
    }

    function stop() {
      speechSynthesis.cancel();
    }

    return {
      getVoices: () => voicesReady.then(v => v),
      getArchetype,
      apply369,
      createUtterance,
      speak,
      stop
    };
  })();

  // ============================================================
  // 4. NAMESPACE GLOBAL window.Kob
  // ============================================================
  window.Kob = {
    Accordion: accordion,
    Engine: engine,
    Voice: voice,
    // futuros: Drag, Copy, Fractal, etc.
  };

  // Mantém compatibilidade com versões anteriores
  window.KobAccordion = accordion;
  window.KobEngine = engine;
  window.KobVoice = voice;

  // Inicializa acordeão
  accordion._init();

  // ============================================================
  // 5. FUNÇÕES AUXILIARES (toast, escape, etc.)
  // ============================================================
  function showToast(message, isError = false) {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    if (!isError) {
      const color = getComputedStyle(document.body).getPropertyValue('--kob-voice-primary').trim();
      if (color) toast.style.background = color;
    } else {
      toast.style.background = '#c44';
    }
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  }

  function escapeHtml(str) {
    return str.replace(/[&<>]/g, (m) => {
      if (m === '&') return '&amp;';
      if (m === '<') return '&lt;';
      if (m === '>') return '&gt;';
      return m;
    });
  }

  // ============================================================
  // 6. DOM ELEMENTOS E LÓGICA PRINCIPAL (FRACTAIS)
  // ============================================================
  (function() {
    const dom = {
      input: document.getElementById('inputText'),
      output: document.getElementById('outputContainer'),
      genBtn: document.getElementById('genBtn'),
      archSelect: document.getElementById('startArch'),
      cycleCheck: document.getElementById('cycleMode'),
      body: document.body,
      copyBtn: document.getElementById('copyBtn'),
      clearBtn: document.getElementById('clearBtn'),
      downloadBtn: document.getElementById('downloadBtn'),
      statusBar: document.getElementById('statusBar'),
      hudStatus: document.getElementById('hudStatus'),
      toastContainer: document.getElementById('toast-container'),
      mainCard: document.getElementById('mainHeroCard')
    };

    // Carrega rascunho
    if (dom.input) {
      const saved = localStorage.getItem('kobllux_draft_input');
      if (saved) dom.input.value = saved;
    }

    // data-arch inicial
    if (dom.archSelect) {
      dom.body.setAttribute('data-arch', dom.archSelect.value);
      dom.archSelect.addEventListener('change', (e) => {
        dom.body.setAttribute('data-arch', e.target.value);
      });
    }

    function generateFractals() {
      if (!dom.input || !dom.output || !dom.archSelect || !dom.cycleCheck) return;
      const text = dom.input.value.trim();
      if (!text) {
        showToast('Aviso: Texto de entrada vazio.', true);
        return;
      }
      localStorage.setItem('kobllux_draft_input', text);

      const sentencesMatch = text.replace(/\n+/g, ' ').match(/[^.!?]+[.!?]+|[^.!?]+$/g);
      const sentences = sentencesMatch ? sentencesMatch.map(s => s.trim()).filter(Boolean) : [];
      if (sentences.length === 0) return;

      const startArchName = dom.archSelect.value;
      const archetypes = window.ARCHETYPES || [];
      const startIdx = archetypes.indexOf(startArchName);
      const isCycleMode = dom.cycleCheck.checked;

      let sequence = [];
      if (isCycleMode) {
        sequence = window.Kob.Engine.getSequence(startIdx, sentences.length);
      } else {
        sequence = Array(sentences.length).fill(archetypes[startIdx] || startArchName);
      }

      dom.output.innerHTML = '';
      let resultText = '';

      sentences.forEach((sentence, i) => {
        const archId = sequence[i] || startArchName;
        const block = document.createElement('div');
        block.className = 'para-block accordion is-open';
        block.style.animationDelay = `${i * 0.1}s`;

        // obtém cor do arquétipo (via elemento dummy)
        const dummy = document.createElement('body');
        dummy.setAttribute('data-arch', archId);
        document.documentElement.appendChild(dummy);
        const archColor = getComputedStyle(dummy).getPropertyValue('--kob-voice-primary').trim();
        document.documentElement.removeChild(dummy);

        block.style.setProperty('--kob-voice-primary', archColor);
        block.style.setProperty('--kob-voice-bg-soft', `color-mix(in srgb, ${archColor} 12%, transparent)`);
        block.style.borderLeftColor = archColor;
        block.style.setProperty('--card-accent', archColor);

        const displayName = window.Kob.Engine.getArchetypeName(archId) || archId;
        block.innerHTML = `
          <div class="accordion-header">
            <div class="arch-tag" style="color: ${archColor}; border-color: color-mix(in srgb, ${archColor} 30%, rgba(255,255,255,0.1))">
              ${displayName} · Δ
            </div>
          </div>
          <div class="collapsible-body">
            <div class="content-inner">${escapeHtml(sentence)}</div>
          </div>
        `;
        dom.output.appendChild(block);
        resultText += `${displayName.toUpperCase()} — ${sentence}\n\n`;
      });

      localStorage.setItem('kobllux_last_result', resultText.trim());
      const total = sentences.length;
      if (dom.statusBar) dom.statusBar.textContent = `Opcode 0x0B · Motor 3·6·9 · ${total} Fractal(s) Gerado(s)`;
      if (dom.hudStatus) dom.hudStatus.textContent = `Δ-${total}`;

      if (dom.mainCard && dom.mainCard.classList.contains('is-open')) {
        dom.mainCard.querySelector('.accordion-header')?.click();
      }
      showToast(`Integração concluída | Motor: +${window.Kob.Engine.step} | Reverse: ${window.Kob.Engine.reverse ? 'ON' : 'OFF'} | Salto: +${window.Kob.Engine.jump} | ${window.Kob.Engine.use3697 ? 'Ciclo 3697' : 'Linear'}`);
    }

    // eventos
    if (dom.genBtn) dom.genBtn.addEventListener('click', generateFractals);
    if (dom.input) {
      dom.input.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') generateFractals();
      });
    }

    // copiar
    if (dom.copyBtn) {
      dom.copyBtn.addEventListener('click', async () => {
        const content = localStorage.getItem('kobllux_last_result');
        if (!content) { showToast('Nenhum fractal para copiar.', true); return; }
        try {
          await navigator.clipboard.writeText(content);
          showToast('Fractais copiados para o Códex');
        } catch {
          const ta = document.createElement('textarea');
          ta.value = content;
          document.body.appendChild(ta);
          ta.select();
          document.execCommand('copy');
          document.body.removeChild(ta);
          showToast('Fractais copiados (fallback)');
        }
      });
    }

    // limpar
    if (dom.clearBtn) {
      dom.clearBtn.addEventListener('click', () => {
        if (dom.input) dom.input.value = '';
        if (dom.output) dom.output.innerHTML = '<div class="empty-state">Sistema reiniciado. Aguardando novos dados.</div>';
        localStorage.removeItem('kobllux_last_result');
        localStorage.removeItem('kobllux_draft_input');
        if (dom.statusBar) dom.statusBar.textContent = 'Sistema em repouso · Matrix Pronta';
        if (dom.hudStatus) dom.hudStatus.textContent = '78K-ID';
        if (dom.mainCard && dom.mainCard.classList.contains('is-collapsed')) {
          dom.mainCard.querySelector('.accordion-header')?.click();
        }
        showToast('Memória Limpa');
      });
    }

    // download
    if (dom.downloadBtn) {
      dom.downloadBtn.addEventListener('click', () => {
        const content = localStorage.getItem('kobllux_last_result');
        if (!content) { showToast('Nenhum fractal para transferir.', true); return; }
        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `KOBLLUX_Fractais_${new Date().toISOString().slice(0,10)}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        showToast('Transferência Concluída');
      });
    }
  })();

  // ============================================================
  // 7. CARREGAMENTO DO JSON DE ARQUÉTIPOS
  // ============================================================
  (async function loadArchetypes() {
    try {
      const response = await fetch('https://www.infodose.com.br/js/modules/archetypes.json');
      const data = await response.json();
      if (!Array.isArray(data)) throw new Error('JSON inválido');

      // atualiza lista no engine
      const ids = data.map(a => a.id || a.name);
      const names = Object.fromEntries(data.map(a => [a.id || a.name, a.name || a.id]));
      window.Kob.Engine._setArchetypes(ids, names);

      // guarda mapa completo para o Voice
      window.ARCHETYPE_MAP = Object.fromEntries(data.map(a => [a.id, a]));

      // popula o select (se existir)
      const select = document.getElementById('startArch');
      if (select) {
        const userName = localStorage.getItem('di_userName') || 'User';
        select.innerHTML = '';
        const userOpt = document.createElement('option');
        userOpt.value = userName.toLowerCase();
        userOpt.textContent = `${userName} (Usuário/Núcleo)`;
        select.appendChild(userOpt);
        data.forEach(a => {
          const opt = document.createElement('option');
          opt.value = a.id || a.name || '';
          opt.textContent = a.name || a.id || 'Archetype';
          select.appendChild(opt);
        });
        // reaplica data-arch
        document.body.setAttribute('data-arch', select.value);
      }

      // dispara evento de pronto
      window.dispatchEvent(new Event('kob:archetypes-ready'));
      console.log('[78K] Archetypes JSON carregado');
    } catch (err) {
      console.error('[78K] Falha ao carregar archetypes.json', err);
    }
  })();

})();