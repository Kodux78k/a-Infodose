
(function() {
  // =========================================
  // 1. ACORDEÃO E COMPORTAMENTO COLAPSÁVEL NATIVO
  // =========================================
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
  window.KobAccordion = {
    open: (card) => { card = (typeof card === 'string') ? document.querySelector(card) : card; if(card){ card.classList.remove('is-collapsed'); card.classList.add('is-open'); } },
    close: (card) => { card = (typeof card === 'string') ? document.querySelector(card) : card; if(card){ card.classList.remove('is-open'); card.classList.add('is-collapsed'); } },
    toggle: (card) => { card = (typeof card === 'string') ? document.querySelector(card) : card; card && card.querySelector('.accordion-header')?.click(); }
  };
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
  document.querySelectorAll('.accordion').forEach(makeCollapsible);

  // =========================================
  // 2. BASE DE ARQUÉTIPOS + USER PERSISTENCE
  // =========================================
  const di_userNameRaw = localStorage.getItem("di_userName") || "";
  const userKey = di_userNameRaw.trim().toLowerCase();
  const displayUserName = di_userNameRaw.trim() || "User";
  
  let ARCHETYPES_BASE = [
    "atlas", "nova", "vitalis", "pulse", "kaos", "kodux", "lumine",
    "aion", "kobllux", "artemis", "serena", "genus", "solus",
    "rhea", "uno", "dual", "trinity", "infodose", "horus", "bllue",
    "luxara", "velor", "elysha", "sylon", "naira", "thenir", "eloh", "novael",
    "aelya", "ignyra", "lumara", "kaythar", "elya", "sylla", "anamyx",
    "yamantek", "metalux", "kd1", "koφd1", "christos",
    "aek_dion", "aekael_domnnus", "nephesh_elyon"
  ];

  if (userKey && !ARCHETYPES_BASE.includes(userKey)) {
    ARCHETYPES_BASE.push(userKey);
  }

  const ARCHETYPES = [...ARCHETYPES_BASE];

  const ARCH_NAMES = {
    atlas: "Atlas", nova: "Nova", vitalis: "Vitalis", pulse: "Pulse", kaos: "Kaos",
    kodux: "Kodux", lumine: "Lumine", aion: "Aion", kobllux: "Kobllux", artemis: "Artemis",
    serena: "Serena", genus: "Genus", solus: "Solus", rhea: "Rhea", uno: "Uno",
    dual: "Dual", trinity: "Trinity", infodose: "Infodose", horus: "Horus", bllue: "Bllue",
    elysha: "Elysha", luxara: "Luxara", velor: "Velor", sylon: "Sylon", naira: "Naira",
    thenir: "Thenir", eloh: "Eloh", novael: "Novael", aelya: "Aelya", ignyra: "Ignyra",
    lumara: "Lumara", kaythar: "Kaythar", sylla: "Sylla", elya: "Elya", anamyx: "Anamyx",
    yamantek: "Yamantek", metalux: "Metalux", kd1: "KD1", "koφd1": "KOΦD1", christos: "Christos",
    k_dion: "a€K_Dion", kael_domnnus: "a€Kael DommnuS", nephesh_elyon: "a€Nephesh Elyon"
  };
  if (userKey) ARCH_NAMES[userKey] = di_userNameRaw.trim();

  // Mapeador estático auxiliar de parâmetros vocais por arquétipo
  const FALLBACK_ARCH_CONFIGS = {
    atlas: { rate: 1.0, pitch: 0.9, color: "#00e5ff" },
    nova: { rate: 1.2, pitch: 1.3, color: "#a855f7" },
    artemis: { rate: 0.9, pitch: 0.8, color: "#ec4899" },
    vitalis: { rate: 1.0, pitch: 1.1, color: "#22c55e" },
    pulse: { rate: 1.3, pitch: 1.0, color: "#eab308" },
    kaos: { rate: 1.5, pitch: 0.7, color: "#ef4444" },
    kodux: { rate: 1.1, pitch: 1.0, color: "#00ffcc" },
    lumine: { rate: 1.0, pitch: 1.2, color: "#fffb00" }
  };

  function getArchConfig(archName) {
    if (window.ARCHETYPE_MAP && window.ARCHETYPE_MAP[archName]) {
      const a = window.ARCHETYPE_MAP[archName];
      return { rate: a.rate || 1.0, pitch: a.pitch || 1.0, color: a.color || "#00e5ff" };
    }
    if (FALLBACK_ARCH_CONFIGS[archName]) return FALLBACK_ARCH_CONFIGS[archName];
    return { rate: 1.0, pitch: 1.0, color: "#00e5ff" };
  }

  // =========================================
  // 3. MOTOR TRÍPLICE DE REVERSÃO 3·6·9
  // =========================================
  let di_engineStep = parseInt(localStorage.getItem('kobllux_engine_step') || '3', 10);
  let di_reverse = localStorage.getItem('kobllux_reverse_mode') === 'true';
  let di_jump = parseInt(localStorage.getItem('kobllux_jump_step') || '0', 10);
  let di_use3697 = localStorage.getItem('kobllux_cycle_3697') === 'true';

  function saveEngineState() {
    localStorage.setItem('kobllux_engine_step', String(di_engineStep));
    localStorage.setItem('kobllux_reverse_mode', String(di_reverse));
    localStorage.setItem('kobllux_jump_step', String(di_jump));
    localStorage.setItem('kobllux_cycle_3697', String(di_use3697));
  }

  function syncEngineUI() {
    document.querySelectorAll('[data-engine]').forEach(btn => {
      const val = parseInt(btn.dataset.engine, 10);
      btn.classList.toggle('is-active', val === di_engineStep);
    });
    document.querySelectorAll('[data-jump]').forEach(btn => {
      const val = parseInt(btn.dataset.jump, 10);
      btn.classList.toggle('is-active', val === di_jump);
    });
    const reverseBtn = document.getElementById('reverseToggle');
    if (reverseBtn) {
      reverseBtn.textContent = `Reverse: ${di_reverse ? 'ON' : 'OFF'}`;
      reverseBtn.classList.toggle('is-active', di_reverse);
    }
    const cycleBtn = document.getElementById('cycle3697');
    if (cycleBtn) {
      cycleBtn.textContent = `3-6-9-7: ${di_use3697 ? 'ON' : 'OFF'}`;
      cycleBtn.classList.toggle('is-active', di_use3697);
    }
  }

  function di_getSequence(startIndex, length) {
    const total = ARCHETYPES.length;
    const sequence = [];
    let currentIndex = ((startIndex % total) + total) % total;
    const pattern = di_use3697 ? [3, 6, 9, 7] : [di_engineStep];
    for (let i = 0; i < length; i++) {
      sequence.push(ARCHETYPES[currentIndex]);
      let step = pattern[i % pattern.length];
      if (di_reverse) step *= -1;
      step += di_jump;
      currentIndex = (currentIndex + step) % total;
      if (currentIndex < 0) currentIndex += total;
    }
    return sequence;
  }

  function updateStatusWithEngine() {
    const statusBar = document.getElementById('statusBar');
    if (statusBar) {
      statusBar.textContent = `Motor +${di_engineStep} · ${di_reverse ? 'Reverse' : 'Forward'} · Salto +${di_jump} · ${di_use3697 ? 'Ciclo 3697' : 'Linear'}`;
    }
  }

  // =========================================
  // 4. MAPEAMENTO DE ELEMENTOS DO DOM (MATRIZ)
  // =========================================
  const dom = {
    input: document.getElementById('inputText'),
    output: document.getElementById('outputContainer'),
    genBtn: document.getElementById('genBtn'),
    archSelect: document.getElementById('startArch'),
    cycleCheck: document.getElementById('cycleMode'),
    statusBar: document.getElementById('statusBar'),
    hudStatus: document.getElementById('hudStatus'),
    toastContainer: document.getElementById('toasterWrap'),
    mainCard: document.getElementById('mainHeroCard')
  };

  function showToast(message, isError = false) {
    if (!dom.toastContainer) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    if (!isError) {
      const currentColor = getComputedStyle(document.body).getPropertyValue('--kob-voice-primary').trim();
      if (currentColor) toast.style.background = currentColor;
    } else {
      toast.style.background = "#ef4444";
    }
    dom.toastContainer.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  }

  // =========================================
  // 5. PROCESSADOR DE FRACTAIS & REPRODUÇÃO TTS
  // =========================================
  let parsedSentences = [];
  let computedSequence = [];
  let currentSentenceIndex = 0;
  let isPlaying = false;

  function generateFractals() {
    if (!dom.input || !dom.output || !dom.archSelect || !dom.cycleCheck) return;
    const text = dom.input.value.trim();
    if (!text) {
      showToast("Aviso: Texto de entrada vazio.", true);
      return;
    }
    localStorage.setItem('kobllux_draft_input', text);

    const sentencesMatch = text.replace(/\n+/g, ' ').match(/[^.!?]+[.!?]+|[^.!?]+$/g);
    parsedSentences = sentencesMatch ? sentencesMatch.map(s => s.trim()).filter(Boolean) : [];
    if (parsedSentences.length === 0) return;

    const startArchName = dom.archSelect.value;
    let startIdx = ARCHETYPES.indexOf(startArchName);
    if (startIdx === -1) startIdx = 0;
    
    const isCycleMode = dom.cycleCheck.checked;
    computedSequence = isCycleMode ? di_getSequence(startIdx, parsedSentences.length) : Array(parsedSentences.length).fill(ARCHETYPES[startIdx]);

    dom.output.innerHTML = '';
    let resultTextForExport = "";

    parsedSentences.forEach((sentence, i) => {
      const currentArchName = computedSequence[i];
      const block = document.createElement('div');
      block.className = 'para-block accordion is-open';
      block.id = `fractal-block-${i}`;
      block.style.animationDelay = `${i * 0.1}s`;
      block.style.padding = '12px';
      block.style.marginBottom = '8px';
      block.style.borderRadius = '8px';
      block.style.transition = 'background 0.3s, border 0.3s';

      const dummyBody = document.createElement('body');
      dummyBody.setAttribute('data-arch', currentArchName);
      document.documentElement.appendChild(dummyBody);
      const archColor = getComputedStyle(dummyBody).getPropertyValue('--kob-voice-primary').trim() || "#00e5ff";
      document.documentElement.removeChild(dummyBody);

      block.style.setProperty('--kob-voice-primary', archColor);
      block.style.borderLeft = `4px solid ${archColor}`;
      block.style.background = 'rgba(255,255,255,0.02)';

      const displayArchName = ARCH_NAMES[currentArchName] || currentArchName;
      block.innerHTML = `
        <div class="accordion-header" style="display:flex; justify-content:space-between; font-size:0.8rem; font-family:'JetBrains Mono';">
          <span style="color:${archColor}; font-weight:bold; text-transform:uppercase;">${displayArchName} · Δ</span>
        </div>
        <div class="collapsible-body" style="margin-top:6px; font-size:0.85rem; line-height:1.4; color:rgba(255,255,255,0.85);">
          ${escapeHtml(sentence)}
        </div>
      `;
      dom.output.appendChild(block);
      resultTextForExport += `${displayArchName.toUpperCase()} — ${sentence}\n\n`;
    });

    localStorage.setItem('kobllux_last_result', resultTextForExport.trim());
    updateStatusWithEngine();
    if (dom.hudStatus) dom.hudStatus.textContent = `Δ-${parsedSentences.length}`;
    showToast(`Matriz Sincronizada: ${parsedSentences.length} blocos.`);
  }

  function speakCurrentFractal() {
    if (!isPlaying || currentSentenceIndex >= parsedSentences.length) {
      stopSpeech();
      return;
    }

    window.speechSynthesis.cancel();

    // Destaque visual interativo do bloco ativo
    document.querySelectorAll('.para-block').forEach(b => {
      b.style.background = 'rgba(255,255,255,0.02)';
    });
    const activeBlock = document.getElementById(`fractal-block-${currentSentenceIndex}`);
    if (activeBlock) {
      activeBlock.style.background = 'rgba(255,255,255,0.1)';
      activeBlock.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    const currentArch = computedSequence[currentSentenceIndex];
    const cfg = getArchConfig(currentArch);

    document.documentElement.style.setProperty('--kob-voice-primary', cfg.color);
    document.body.setAttribute('data-arch', currentArch);
    
    const orbBtn = document.getElementById('orbBtn');
    if (orbBtn) orbBtn.classList.add('is-speaking');
    
    if (dom.hudStatus) {
      const displayArchName = ARCH_NAMES[currentArch] || currentArch;
      dom.hudStatus.textContent = `Δ [${currentSentenceIndex + 1}/${parsedSentences.length}] · ${displayArchName.toUpperCase()}`;
    }

    const utterance = new SpeechSynthesisUtterance(parsedSentences[currentSentenceIndex]);
    utterance.rate = cfg.rate;
    utterance.pitch = cfg.pitch;
    
    const voices = window.speechSynthesis.getVoices();
    const ptVoice = voices.find(v => v.lang.includes('pt-BR') || v.lang.includes('pt_BR'));
    if (ptVoice) utterance.voice = ptVoice;

    utterance.onend = () => {
      currentSentenceIndex++;
      speakCurrentFractal();
    };

    utterance.onerror = () => {
      if (orbBtn) orbBtn.classList.remove('is-speaking');
    };

    window.speechSynthesis.speak(utterance);
  }

  function togglePlay() {
    if (parsedSentences.length === 0) {
      generateFractals();
      if (parsedSentences.length === 0) {
        showToast("Insira um código estruturado ou texto.", true);
        return;
      }
    }

    const playBtn = document.getElementById('btn-play');

    if (isPlaying) {
      window.speechSynthesis.pause();
      isPlaying = false;
      if (playBtn) playBtn.textContent = "▶";
      const orbBtn = document.getElementById('orbBtn');
      if (orbBtn) orbBtn.classList.remove('is-speaking');
      if (dom.statusBar) dom.statusBar.textContent = "Sincronizador em Pausa.";
    } else {
      isPlaying = true;
      if (playBtn) playBtn.textContent = "⏸";
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
        const orbBtn = document.getElementById('orbBtn');
        if (orbBtn) orbBtn.classList.add('is-speaking');
      } else {
        speakCurrentFractal();
      }
      if (dom.statusBar) dom.statusBar.textContent = "Executando Leitura Multiarquetípica Ativa...";
    }
  }

  function stopSpeech() {
    window.speechSynthesis.cancel();
    isPlaying = false;
    currentSentenceIndex = 0;
    const playBtn = document.getElementById('btn-play');
    if (playBtn) playBtn.textContent = "▶";
    const orbBtn = document.getElementById('orbBtn');
    if (orbBtn) orbBtn.classList.remove('is-speaking');
    if (dom.statusBar) dom.statusBar.textContent = "Fluxo de Áudio Finalizado.";
    document.querySelectorAll('.para-block').forEach(b => b.style.background = 'rgba(255,255,255,0.02)');
  }

  function escapeHtml(str) {
    return str.replace(/[&<>]/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[m]));
  }

  // =========================================
  // 6. GATILHOS DE EVENTOS DO MOTOR E CONTROLES
  // =========================================
  document.querySelectorAll('[data-engine]').forEach(btn => {
    btn.addEventListener('click', () => {
      di_engineStep = parseInt(btn.dataset.engine, 10);
      saveEngineState();
      syncEngineUI();
      if(parsedSentences.length > 0) generateFractals();
    });
  });

  document.querySelectorAll('[data-jump]').forEach(btn => {
    btn.addEventListener('click', () => {
      di_jump = parseInt(btn.dataset.jump, 10);
      saveEngineState();
      syncEngineUI();
      if(parsedSentences.length > 0) generateFractals();
    });
  });

  const revToggle = document.getElementById('reverseToggle');
  if (revToggle) {
    revToggle.addEventListener('click', () => {
      di_reverse = !di_reverse;
      saveEngineState();
      syncEngineUI();
      if(parsedSentences.length > 0) generateFractals();
    });
  }

  const cycToggle = document.getElementById('cycle3697');
  if (cycToggle) {
    cycToggle.addEventListener('click', () => {
      di_use3697 = !di_use3697;
      saveEngineState();
      syncEngineUI();
      if(parsedSentences.length > 0) generateFractals();
    });
  }

  if (dom.genBtn) dom.genBtn.addEventListener('click', generateFractals);

  // Vincular barra HUD física de controle de reprodução
  const btnPlay = document.getElementById('btn-play');
  if (btnPlay) btnPlay.addEventListener('click', togglePlay);

  const btnStop = document.getElementById('tts-stop');
  if (btnStop) btnStop.addEventListener('click', stopSpeech);

  const btnPrev = document.getElementById('btn-prev');
  if (btnPrev) {
    btnPrev.addEventListener('click', () => {
      if (currentSentenceIndex > 0) {
        currentSentenceIndex--;
        if (isPlaying) speakCurrentFractal();
        else {
          document.querySelectorAll('.para-block').forEach(b => b.style.background = 'rgba(255,255,255,0.02)');
          const activeBlock = document.getElementById(`fractal-block-${currentSentenceIndex}`);
          if (activeBlock) activeBlock.style.background = 'rgba(255,255,255,0.1)';
        }
      }
    });
  }

  // Clipboard e utilitários da matriz
  document.getElementById('pasteBtn')?.addEventListener('click', async () => {
    try {
      const txt = await navigator.clipboard.readText();
      if (dom.input) {
        dom.input.value = txt;
        generateFractals();
      }
    } catch (err) {
      showToast("Clipboard indisponível.", true);
    }
  });

  document.getElementById('clearBtn')?.addEventListener('click', () => {
    if (dom.input) dom.input.value = '';
    if (dom.output) dom.output.innerHTML = '<div class="empty-state">Sistema reiniciado. Aguardando novos dados.</div>';
    stopSpeech();
    localStorage.removeItem('kobllux_last_result');
    localStorage.removeItem('kobllux_draft_input');
  });

  document.getElementById('copyBtn')?.addEventListener('click', async () => {
    const res = localStorage.getItem('kobllux_last_result');
    if (!res) return showToast("Matriz vazia.", true);
    await navigator.clipboard.writeText(res);
    showToast("Copiado para a área de transferência.");
  });

  document.getElementById('downloadBtn')?.addEventListener('click', () => {
    const res = localStorage.getItem('kobllux_last_result');
    if (!res) return showToast("Matriz vazia.", true);
    const blob = new Blob([res], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `KOBLLUX_Matrix_${new Date().toISOString().slice(0,10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  });

  // =========================================
  // 7. GESTOS: LONG-PRESS NO ORB PARA QUICK MENU
  // =========================================
  let pressTimer;
  function handleLongPressStart(e) {
    const orbBtn = document.getElementById('orbBtn');
    if (orbBtn) orbBtn.classList.add('tap');
    pressTimer = setTimeout(() => {
      const qm = document.getElementById('kblx-quick');
      if (qm) {
        qm.style.display = 'flex';
        qm.style.flexDirection = 'column';
        const cX = e.clientX || (e.touches && e.touches[0] ? e.touches[0].clientX : window.innerWidth / 2);
        const cY = e.clientY || (e.touches && e.touches[0] ? e.touches[0].clientY : window.innerHeight / 2);
        qm.style.left = `${Math.min(cX, window.innerWidth - 180)}px`;
        qm.style.top = `${Math.min(cY, window.innerHeight - 280)}px`;
        navigator.vibrate && navigator.vibrate(40);
      }
    }, 600);
  }

  function handleLongPressEnd() {
    clearTimeout(pressTimer);
    const orbBtn = document.getElementById('orbBtn');
    if (orbBtn) setTimeout(() => orbBtn.classList.remove('tap'), 200);
  }

  const mainOrb = document.getElementById('orbBtn');
  if (mainOrb) {
    mainOrb.addEventListener('pointerdown', handleLongPressStart);
    mainOrb.addEventListener('pointerup', handleLongPressEnd);
    mainOrb.addEventListener('pointerleave', handleLongPressEnd);
    mainOrb.addEventListener('click', (e) => {
      const qm = document.getElementById('kblx-quick');
      if (qm && qm.style.display === 'flex') return;
      togglePlay();
    });
  }

  // Configuração rápida dos botões internos do Quick Menu
  document.querySelectorAll('.kq-item').forEach(item => {
    item.addEventListener('click', (e) => {
      const act = e.currentTarget.dataset.kq;
      document.getElementById('kblx-quick').style.display = 'none';
      if (act === 'edit') togglePlay();
      else showToast(`Gatilho do módulo: ${act.toUpperCase()}`);
    });
  });

  document.addEventListener('click', (e) => {
    const qm = document.getElementById('kblx-quick');
    if (qm && !qm.contains(e.target) && !mainOrb.contains(e.target)) {
      qm.style.display = 'none';
    }
  });

  // =========================================
  // 8. DEEP LINKING INTEGRADO (?text=...)
  // =========================================
  const urlParams = new URLSearchParams(window.location.search);
  const textFromUrl = urlParams.get('text');
  if (textFromUrl && dom.input) {
    dom.input.value = decodeURIComponent(textFromUrl);
    setTimeout(() => {
      generateFractals();
      showToast("Carga injetada automaticamente via Link.");
    }, 600);
  }

  // Inicialização estável
  const savedInput = localStorage.getItem('kobllux_draft_input');
  if (savedInput && dom.input && !textFromUrl) dom.input.value = savedInput;
  
  syncEngineUI();
  window.speechSynthesis.onvoiceschanged = () => {};
})();

// Carregamento assíncrono complementar dos Arquétipos JSON externos
(async () => {
  try {
    const res = await fetch("https://www.infodose.com.br/js/modules/archetypes.json");
    const list = await res.json();
    const select = document.getElementById("startArch");
    const userName = localStorage.getItem("di_userName") || "User";

    if (select && Array.isArray(list) && list.length) {
      select.innerHTML = "";
      const userOpt = document.createElement("option");
      userOpt.value = userName.toLowerCase();
      userOpt.textContent = `${userName} (Usuário/Núcleo)`;
      select.appendChild(userOpt);

      list.forEach(a => {
        const opt = document.createElement("option");
        opt.value = a.id || a.name || "";
        opt.textContent = a.name || a.id || "Archetype";
        select.appendChild(opt);
      });

      window.ARCHETYPES = list;
      window.ARCHETYPE_MAP = Object.fromEntries(list.map(a => [a.id, a]));
    }
    console.log("[78K] Sincronização estendida archetypes.json completa.");
  } catch (err) {
    console.error("[78K] Erro ao consolidar catálogo de arquétipos", err);
  }
})();
