/* ===== overlay-default-boot.js ===== */
// Overlay ON por padrão até o primeiro arquétipo aplicar a cor própria.
try{ document.documentElement.style.setProperty('--arch-overlay','rgba(64,158,255,.22)'); }catch{}

/* ===== apps-json.js ===== */
{
  "apps": [
    {
      "key": "atlas",
      "title": "Atlas · Cartesius",
      "desc": "Planejador estratégico com cronogramas e checklists.",
      "url": "https://kodux78k.github.io/Dual-neu/apps/APPS78K/app_atlas_cartesius.html?v=1787097023085",
      "icon": "atlas"
    },
    {
      "key": "nova",
      "title": "Nova · Inspira",
      "desc": "Criativa que desbloqueia ideias com mapas mentais e exercícios.",
      "url": "https://kodux78k.github.io/Dual-neu/apps/APPS78K/app_nova_inspira.html?v=1787097023085",
      "icon": "nova"
    },
    {
      "key": "vitalis",
      "title": "Vitalis · Momentum",
      "desc": "Rotinas físicas, hacks biológicos e motivação.",
      "url": "https://kodux78k.github.io/Dual-neu/apps/APPS78K/app_vitalis_momentum.html?v=1787097023085",
      "icon": "vitalis"
    },
    {
      "key": "pulse",
      "title": "Pulse · Resona",
      "desc": "Trilhas sonoras e ajuste de som emocional.",
      "url": "https://kodux78k.github.io/Dual-neu/apps/APPS78K/app_pulse_resona.html?v=1787097023085",
      "icon": "pulse"
    },
    {
      "key": "artemis",
      "title": "Artemis · Naviga",
      "desc": "Explora conhecimentos e rotas de aprendizado.",
      "url": "https://kodux78k.github.io/Dual-neu/apps/APPS78K/app_artemis_naviga.html?v=1787097023085",
      "icon": "artemis"
    },
    {
      "key": "serena",
      "title": "Serena · Ampara",
      "desc": "Acolhimento e suporte emocional.",
      "url": "https://kodux78k.github.io/Dual-neu/apps/APPS78K/app_serena_ampara.html?v=1787097023085",
      "icon": "serena"
    },
    {
      "key": "kaos",
      "title": "Kaos · Disruptor",
      "desc": "Questiona padrões e propõe soluções ousadas.",
      "url": "https://kodux78k.github.io/Dual-neu/apps/APPS78K/app_kaos_disruptor.html?v=1787097023085",
      "icon": "kaos"
    },
    {
      "key": "genus",
      "title": "Genus · Fabricus",
      "desc": "Protótipos e materialização de ideias.",
      "url": "https://kodux78k.github.io/Dual-neu/apps/APPS78K/app_genus_fabricus.html?v=1787097023085",
      "icon": "genus"
    },
    {
      "key": "lumine",
      "title": "Lumine · Brilhare",
      "desc": "Inspiração leve e atividades lúdicas.",
      "url": "https://kodux78k.github.io/Dual-neu/apps/APPS78K/app_lumine_brilhare.html?v=1787097023085",
      "icon": "lumine"
    },
    {
      "key": "rhea",
      "title": "Rhea · Raízes",
      "desc": "Vínculos e memórias emocionais.",
      "url": "https://kodux78k.github.io/Dual-neu/apps/APPS78K/app_rhea_raizes.html?v=1787097023085",
      "icon": "rhea"
    },
    {
      "key": "solus",
      "title": "Solus · Arcana",
      "desc": "Harmonização energética e meditação.",
      "url": "https://kodux78k.github.io/Dual-neu/apps/APPS78K/app_solus_arcana.html?v=1787097023085",
      "icon": "solus"
    },
    {
      "key": "aion",
      "title": "Aion · Evolutia",
      "desc": "Microações estratégicas e evolução.",
      "url": "https://kodux78k.github.io/Dual-neu/apps/APPS78K/app_aion_evolutia.html?v=1787097023085",
      "icon": "aion"
    }
  ]
}

/* ===== helpers.js ===== */
// Redefine the global toast function to suppress popup messages. If you
  // later decide to re-enable notifications, remove or comment out this line.
  window.toast = function(){};
    /* ===================== Helpers ===================== */
    const $ = (q, r = document) => r.querySelector(q);
    const $$ = (q, r = document) => Array.from(r.querySelectorAll(q));
    const LS = {
      get: (k, d) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d } catch (e) { return d } },
      set: (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)) } catch (e) {} },
      raw: (k) => localStorage.getItem(k) || ''
    };

    /* ===================== DualHub State & Logging ===================== */
    // Armazena preferências de performance, voz e registros de eventos para a funcionalidade "Dual" aprimorada.
    const dualState = {
      perf: localStorage.getItem('hub.perf') || 'med',
      voice: localStorage.getItem('hub.voice') || 'Nova',
      logs: []
    };
    // Adiciona uma entrada ao log e atualiza o painel de logs no Brain.
    function dualLog(msg) {
      const entry = '[' + new Date().toLocaleTimeString() + '] ' + msg;
      dualState.logs.unshift(entry);
      const logsEl = document.getElementById('logs');
      if (logsEl) logsEl.textContent = dualState.logs.slice(0, 60).join('\n');
    }

    /* Ripple */
    function addRipple(el) {
      if (!el) return;
      // Ensure a ripple host exists on the element. The global ripple handler will create dots on pointerdown.
      if (!el.querySelector('.ripple')) {
        const slot = document.createElement('span');
        slot.className = 'ripple';
        el.appendChild(slot);
      }
      // Do not attach individual pointerdown events here; ripple will be handled globally.
    }

    /* Toast */
    const toastBox = document.createElement('div');
    toastBox.style.cssText = 'position:fixed;right:14px;bottom:calc(var(--tabsH) + 16px);display:grid;gap:8px;z-index:120';
    document.body.appendChild(toastBox);
    function toast(msg, type = 'ok') {
      const el = document.createElement('div'); el.className = 'fx-trans';
      const bg = type === 'ok' ? 'linear-gradient(90deg,#1b2a2a,#123c2e)' : (type === 'warn' ? 'linear-gradient(90deg,#2f261b,#3c2d12)' : 'linear-gradient(90deg,#2f1b1b,#3c1212)');
      el.style.cssText = `background:${bg}; color:var(--fg); border:${getComputedStyle(document.documentElement).getPropertyValue('--bd')}; padding:.6rem .8rem; border-radius:12px; box-shadow:var(--shadow)`;
      el.textContent = msg; toastBox.appendChild(el);
      setTimeout(() => { el.style.opacity = .0; el.style.transform = 'translateY(6px)'; setTimeout(() => el.remove(), 220); }, 1600);
    }

    /* ===================== Saudação / último estado ===================== */
    function displayGreeting() {
      const card = document.getElementById('greetingCard');
      // Não exibir o cartão de saudação; usamos mensagens na bolinha
      if (card) card.style.display = 'none';
      const name = (localStorage.getItem('infodose:userName') || '').trim();
      const sessions = document.querySelectorAll('.session').length;
      if (!name) {
        showArchMessage('Salve! Ative sua Dual Infodose registrando seu nome na seção Brain.', 'warn');
      } else {
        showArchMessage(`Bem-vindo de volta, ${name}. UNO está ao seu lado. Você tem ${sessions} sessão(ões) ativa(s).`, 'ok');
      }
    }

    /* ===================== Tema & Fundo personalizados ===================== */
    // Aplica o tema salvo no localStorage. Os temas possíveis são: 'default' (remove data-theme), 'medium'
    // e 'custom'.  Quando 'custom' estiver ativo, usa a imagem/vídeo salvo em LS ('uno:bg') como
    // plano de fundo.  Se 'medium' estiver selecionado, adiciona data-theme='medium'.
    function applyTheme() {
      const theme = LS.get('uno:theme','blue1');
      // Limpe qualquer dataset para que CSS default seja aplicado quando 'default'
      if (theme === 'default') {
        delete document.body.dataset.theme;
      } else {
        document.body.dataset.theme = theme;
      }
      // Gerenciar fundo personalizado
      const bgContainer = document.getElementById('custom-bg');
      if (!bgContainer) return;
      if (theme !== 'custom') {
        bgContainer.innerHTML = '';
        return;
      }
      // Carregar dados do fundo
      const bgData = LS.get('uno:bg', '');
      bgContainer.innerHTML = '';
      if (!bgData) return;
      // Determine se é vídeo ou imagem
      if (/^data:video\//.test(bgData)) {
        const vid = document.createElement('video');
        vid.src = bgData;
        vid.autoplay = true;
        vid.loop = true;
        vid.muted = true;
        vid.playsInline = true;
        vid.style.width = '100%';
        vid.style.height = '100%';
        vid.style.objectFit = 'cover';
        bgContainer.appendChild(vid);
      } else {
        const img = document.createElement('img');
        img.src = bgData;
        img.alt = '';
        img.style.width = '100%';
        img.style.height = '100%';
        img.style.objectFit = 'cover';
        bgContainer.appendChild(img);
      }
    }

    /* ===================== CSS Personalizado ===================== */
    // Aplica o CSS salvo em localStorage (chave 'infodose:cssCustom')
    function applyCSS() {
      let styleEl = document.getElementById('customStyle');
      if (!styleEl) {
        styleEl = document.createElement('style');
        styleEl.id = 'customStyle';
        document.head.appendChild(styleEl);
      }
      const css = localStorage.getItem('infodose:cssCustom') || '';
      styleEl.innerHTML = css || '';
    }

    // Inicializa seleção de vozes para cada arquétipo
    function initVoices() {
      const wrap = document.getElementById('voicesWrap');
      if (!wrap) return;
      wrap.innerHTML = '';
      const archList = [
        'atlas.html',
        'nova.html',
        'vitalis.html',
        'pulse.html',
        'artemis.html',
        'serena.html',
        'kaos.html',
        'genus.html',
        'lumine.html',
        'solus.html',
        'rhea.html',
        'aion.html'
      ];
      function populateVoices() {
        let voices = speechSynthesis.getVoices();
        // Filtrar por idiomas suportados (Português e Inglês) se disponível
        const filtered = voices.filter(v => v.lang && (v.lang.startsWith('pt') || v.lang.startsWith('en')));
        voices = filtered.length ? filtered : voices;
        const saved = LS.get('infodose:voices', {}) || {};
        // Se ainda não houver vozes salvas, defina um mapeamento padrão
        if (Object.keys(saved).length === 0 && voices.length) {
          archList.forEach((name, idx) => {
            const v = voices[idx % voices.length];
            if (v) saved[name] = v.name;
          });
          LS.set('infodose:voices', saved);
        }
        archList.forEach(name => {
          // Cria um acordeão (detalhes) para cada arquétipo. O nome sem extensão aparece no cabeçalho.
          const detailsEl = document.createElement('details');
          detailsEl.className = 'voice-accordion';
          const summary = document.createElement('summary');
          const baseName = name.replace(/\.html$/i, '');
          summary.textContent = baseName.charAt(0).toUpperCase() + baseName.slice(1);
          summary.style.cursor = 'pointer';
          summary.style.fontWeight = '700';
          summary.style.marginBottom = '4px';
          detailsEl.appendChild(summary);
          // Contêiner para o seletor de voz e botão de teste
          const row = document.createElement('div');
          row.style.display = 'flex';
          row.style.alignItems = 'center';
          row.style.gap = '8px';
          row.style.flexWrap = 'wrap';
          // Seletor de voz
          const sel = document.createElement('select');
          sel.className = 'input ring';
          sel.style.maxWidth = '220px';
          voices.forEach(v => {
            const opt = document.createElement('option');
            opt.value = v.name;
            opt.textContent = `${v.name} (${v.lang})`;
            sel.appendChild(opt);
          });
          if (saved[name]) sel.value = saved[name];
          sel.onchange = () => {
            saved[name] = sel.value;
            LS.set('infodose:voices', saved);
          };
          // Botão de teste
          const btnTest = document.createElement('button');
          btnTest.className = 'btn fx-trans fx-press ring';
          btnTest.textContent = 'Teste';
          const rp = document.createElement('span');
          rp.className = 'ripple';
          btnTest.appendChild(rp);
          addRipple(btnTest);
          btnTest.onclick = () => {
            const utter = new SpeechSynthesisUtterance(`Olá, eu sou ${baseName}`);
            const voiceName = saved[name] || sel.value;
            const voice = voices.find(v => v.name === voiceName);
            if (voice) utter.voice = voice;
            speechSynthesis.cancel();
            speechSynthesis.speak(utter);
          };
          row.appendChild(sel);
          row.appendChild(btnTest);
          detailsEl.appendChild(row);
          wrap.appendChild(detailsEl);
        });
      }
      populateVoices();
      // Re-populate when voices list changes
      window.speechSynthesis.onvoiceschanged = () => populateVoices();
    }

    // Pronuncia o nome do arquétipo usando a voz selecionada
    function speakArchetype(name) {
      try {
        const archName = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
        const saved = LS.get('infodose:voices', {});
        const voices = speechSynthesis.getVoices();
        let voice = null;
        if (saved && saved[archName]) {
          voice = voices.find(v => v.name === saved[archName]);
        }
        if (!voice) {
          voice = voices.find(v => v.lang && (v.lang.startsWith('pt') || v.lang.startsWith('en')));
        }
        if (!voice && voices.length) voice = voices[0];
        if (!voice) return;
        const utter = new SpeechSynthesisUtterance(`Olá, eu sou ${archName}`);
        utter.voice = voice;
        speechSynthesis.cancel();
        speechSynthesis.speak(utter);
      } catch (e) {}
    }

    // Fala um texto usando a voz associada ao arquétipo atualmente ativo.  Utiliza a lista
    // de vozes do Speech Synthesis e o mapeamento salvo em LS para encontrar a voz
    // correta. Se não houver voz definida, escolhe a primeira disponível (PT/EN).
    function speakWithActiveArch(text) {
      try {
        const select = document.getElementById('arch-select');
        let archFile = select ? select.value || '' : '';
        let base = archFile.replace(/\.html$/i, '');
        const key = base.charAt(0).toUpperCase() + base.slice(1).toLowerCase();
        const saved = LS.get('infodose:voices', {}) || {};
        const voices = speechSynthesis.getVoices();
        let voice = null;
        if (saved[key]) {
          voice = voices.find(v => v.name === saved[key]);
        }
        if (!voice) {
          voice = voices.find(v => v.lang && (v.lang.startsWith('pt') || v.lang.startsWith('en')));
        }
        if (!voice && voices.length) voice = voices[0];
        if (!voice) return;
        const utter = new SpeechSynthesisUtterance(text);
        utter.voice = voice;
        speechSynthesis.cancel();
        speechSynthesis.speak(utter);
      } catch (e) {}
    }

    // Exibe uma mensagem dentro do círculo do arquétipo. A mensagem desaparece após alguns segundos.
    function showArchMessage(text, type = 'info') {
      try {
        const el = document.getElementById('archMsg');
        if (!el) return;
        el.textContent = text;
        // Ajuste a cor de fundo conforme o tipo
        if (type === 'ok') {
          el.style.background = 'rgba(57,255,182,0.75)';
          el.style.color = '#0b0f14';
        } else if (type === 'warn') {
          el.style.background = 'rgba(255,184,107,0.78)';
          el.style.color = '#0b0f14';
        } else if (type === 'err') {
          el.style.background = 'rgba(255,107,107,0.78)';
          el.style.color = '#0b0f14';
        } else {
          el.style.background = 'rgba(15,17,32,0.72)';
          el.style.color = '';
        }
        el.classList.add('show');
        clearTimeout(el._tm);
        el._tm = setTimeout(() => {
          el.classList.remove('show');
        }, 4000);
      } catch (e) {}
    }

    // Configura o modo de ripple que responde ao áudio do microfone.  Cria um
    // analisador de áudio usando Web Audio API e ajusta a opacidade da camada
    // "audioRipple" conforme a intensidade do som capturado. Um botão
    // (arch-audio) ativa/desativa o efeito de forma discreta.
    function initAudioRipple() {
      const clickLayer = document.getElementById('audioRipple');
      const archCircleEl = document.querySelector('.arch-circle');
      if (!clickLayer || !archCircleEl) return;
      let enabled = false;
      let audioCtx = null;
      let analyser = null;
      let micStream = null;
      // Inicia a captura de áudio e animação
      async function start() {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          micStream = stream;
          audioCtx = new (window.AudioContext || window.webkitAudioContext)();
          const src = audioCtx.createMediaStreamSource(stream);
          analyser = audioCtx.createAnalyser();
          analyser.fftSize = 256;
          src.connect(analyser);
          animate();
        } catch (e) {
          toast('Não foi possível acessar o microfone.', 'err');
          enabled = false;
          archCircleEl.classList.remove('audio-on');
        }
      }
      // Para a captura de áudio e reseta a camada
      function stop() {
        if (micStream) {
          micStream.getTracks().forEach(t => t.stop());
          micStream = null;
        }
        if (audioCtx) {
          try { audioCtx.close(); } catch {}
          audioCtx = null;
        }
        // Remova o efeito de sombra quando desligar
        archCircleEl.style.boxShadow = '';
      }
      // Atualiza a opacidade da camada conforme o volume (RMS)
      function animate() {
        if (!enabled || !analyser) return;
        const buf = new Uint8Array(analyser.fftSize);
        analyser.getByteTimeDomainData(buf);
        let sum = 0;
        for (let i = 0; i < buf.length; i++) {
          const v = (buf[i] - 128) / 128;
          sum += v * v;
        }
        const rms = Math.sqrt(sum / buf.length);
        // Ajuste a intensidade: multiplique por um fator e limite a 0.6
        // Aplique um brilho em torno do círculo proporcional ao volume
        const intensity = Math.min(0.8, rms * 4);
        // envia nível para o iframe do arquétipo (se existir)
        try { const fr = document.getElementById('arch-frame'); if (fr && fr.contentWindow) fr.contentWindow.postMessage({ audioLevel: Math.min(1, rms*3) }, '*'); } catch (e) {}
        const blur = rms * 80;
        archCircleEl.style.boxShadow = `0 0 ${blur}px rgba(255,255,255,${intensity})`;
        requestAnimationFrame(animate);
      }
      // Clique simples no círculo inicia a interação Dual: anima a bolinha,
      // faz a saudação e inicia a captura de voz para conversar com a IA.
      clickLayer.addEventListener('click', () => {
        startDualInteraction();
      });

      // Função global para alternar o modo de visualização do áudio (ripple).  
      // Mantemos para compatibilidade com o botão de áudio no menu.
      window.toggleAudio = function () {
        enabled = !enabled;
        archCircleEl.classList.toggle('audio-on', enabled);
        if (enabled) {
          start();
        } else {
          stop();
        }
      };
    }

    // Mensagem de boas-vindas/ativação
    function welcome() {
      const name = (localStorage.getItem('infodose:userName') || '').trim();
      if (!name) {
        const msg = 'Salve! Ative sua Dual Infodose registrando seu nome na seção Brain.';
        showArchMessage(msg, 'warn');
        try { speakWithActiveArch(msg); } catch {}
      } else {
        const msg = `Bem-vindo de volta, ${name}. UNO está ao seu lado.`;
        showArchMessage(msg, 'ok');
        try { speakWithActiveArch(msg); } catch {}
      }
    }

    /* Apply ripple */
    $$('button').forEach(addRipple);
    // Move the arquétipos circle below the menu in the home view after initialization
    (function() {
      try {
        const home = document.getElementById('v-home');
        if (!home) return;
        const arch = home.querySelector('.arch-container');
        const cards = home.querySelector('.cards');
        // Se ambos existirem, garanta que as cartas apareçam depois do círculo de arquétipos.
        if (arch && cards) {
          arch.insertAdjacentElement('afterend', cards);
        }
      } catch (e) {
        console.warn('Falha ao reposicionar arquétipo:', e);
      }
    })();
    const obs = new MutationObserver((muts) => { muts.forEach(m => m.addedNodes && m.addedNodes.forEach(n => { if (n.nodeType === 1) { if (n.matches?.('button')) addRipple(n); n.querySelectorAll?.('button').forEach(addRipple); } })) });
    obs.observe(document.body, { childList: true, subtree: true });

    /* ===================== Navegação + Estado ===================== */
    function nav(key) {
      const __ov = document.getElementById('homeInputOverlay'); const __tb = document.getElementById('homeTextBtn'); if(__ov){ __ov.style.display='none'; } if(__tb){ __tb.classList.remove('active'); }
// Remapeia a antiga aba 'revo' para 'chat'
      if (key === 'revo') key = 'chat';
      // Adicionamos 'chat' à lista de abas para suportar a nova seção
      const tabs = ['home', 'apps', 'stack', 'brain', 'chat'];
      tabs.forEach(k => {
        const viewEl = document.getElementById('v-' + k);
        if (viewEl) viewEl.classList.toggle('active', k === key);
        const tabEl = document.querySelector(`.tab[data-nav="${k}"]`);
        if (tabEl) tabEl.classList.toggle('active', k === key);
      });
      LS.set('uno:lastTab', key);
      // Quando entrar na aba Home, apresente mensagem de saudação / última sessão
      if (key === 'home') {
        try { displayGreeting(); } catch (e) { console.warn(e); }
        try {
          const nameG = (localStorage.getItem('infodose:userName') || '').trim();
          if (!nameG) {
            toast('Salve! Ative sua Dual Infodose registrando seu nome na seção Brain.', 'warn');
          } else {
            // Saudação rápida na forma de toast quando o usuário retorna ao home.
            toast(`Bem-vindo de volta, ${nameG}. UNO está ao seu lado.`, 'ok');
          }
        } catch (e) {}
        // Atualize também os status quando entrar no Home
        try { updateHomeStatus(); } catch {}
      }
      // Nenhuma ação especial ao entrar na aba de chat por enquanto

      // Falar uma frase curta ao trocar de aba, usando a voz do arquétipo ativo
      try {
        let phrase = '';
        let type = 'info';
        switch (key) {
          case 'home': phrase = 'Página inicial'; break;
          case 'apps': phrase = 'Abrindo apps'; break;
          case 'stack': phrase = 'Abrindo stack'; break;
          case 'brain': phrase = 'Abrindo usuário'; break;
          case 'chat': phrase = 'Abrindo chat'; break;
          default: phrase = '';
        }
        if (phrase) {
          speakWithActiveArch(phrase);
          showArchMessage(phrase, type);
        }
        // Mostrar o preview laranja somente na Home; escondê-lo nas outras abas
        try {
          const prev = document.getElementById('msgPreview');
          if (prev) {
            prev.style.display = (key === 'home' && prev.textContent) ? 'block' : 'none';
          }
        } catch (e) { console.warn(e); }
      } catch (e) {}
    }

    // Alterna a visibilidade do menu de arquétipos.  O menu fica
    // escondido/mostrado ao clicar no círculo (toque curto).  Este
    // helper é chamado por initAudioRipple().
    function toggleArchMenu() {
      const menu = document.getElementById('archMenu');
      if (!menu) return;
      menu.classList.toggle('show');
    }

    /**
     * Inicia a interação Dual ao tocar a bolinha.  Esta função aplica uma
     * animação breve de pressão à bolinha, fala a saudação “Oi DUAL” (ou
     * outra frase definida) usando a voz do arquétipo ativo e, em seguida,
     * verifica se o usuário está conectado (nome, chave do OpenRouter e
     * modelo selecionados).  Caso esteja tudo configurado, ativa o
     * reconhecimento de voz para captar a fala do usuário e prosseguir
     * com a conversa.  Caso contrário, exibe uma mensagem orientando o
     * usuário a preencher suas configurações no Brain.
     */
    function startDualInteraction() {
      const archCircle = document.querySelector('.arch-circle');
      if (!archCircle) return;
      // Animação de clique: adiciona classe 'pressed' brevemente
      archCircle.classList.add('pressed');
      setTimeout(() => archCircle.classList.remove('pressed'), 180);
      // Saudação falada
      const greet = 'Oi Dual';
      showArchMessage(greet, 'ok');
      try { speakWithActiveArch(greet); } catch {}
      // Após a saudação, aguarde um curto intervalo antes de iniciar a verificação
      setTimeout(() => {
        const sk = localStorage.getItem('dual.keys.openrouter') || '';
        const userName = (localStorage.getItem('infodose:userName') || '').trim();
        const model = LS.get('dual.openrouter.model');
        if (!sk || !userName || !model) {
          const warn = 'Configure nome, chave e modelo no Brain para conversar.';
          showArchMessage(warn, 'warn');
          return;
        }
        // Se estiver tudo configurado, inicie o reconhecimento de voz
        startSpeechConversation(userName, sk, model);
      }, 600);
    }

    /**
     * Inicia o reconhecimento de fala via Web Speech API.  Quando o usuário
     * terminar de falar, a transcrição é encaminhada para a função de
     * manipulação de mensagens, que enviará a pergunta ao modelo de IA e
     * lidará com a resposta.
     * @param {string} userName Nome do usuário (para personalizar respostas)
     * @param {string} sk Chave da API do OpenRouter
     * @param {string} model Modelo selecionado
     */

    // Insere mensagens no feed de IA da Home. Mantém somente as últimas 10 entradas.
    function feedPush(type, text) {
      // Adiciona mensagem ao feed de IA se existir (mantido para compatibilidade)
      const box = document.getElementById('iaFeed');
      if (box) {
        const div = document.createElement('div');
        div.className = 'msg ' + (type || 'status');
        div.textContent = text;
        box.appendChild(div);
        const msgs = box.querySelectorAll('.msg');
        const limit = 10;
        if (msgs.length > limit) {
          box.removeChild(msgs[0]);
        }
        box.scrollTop = box.scrollHeight;
      }
      // Envia a mensagem também ao feed de chat e atualiza o preview
      try {
        chatPush(type, text);
        if (type === 'ai') updatePreview(text);
      } catch (e) { console.warn(e); }
    }
    // Função auxiliar para adicionar mensagens ao feed de chat
    function chatPush(type, text) {
      const feed = document.getElementById('chatFeed');
      if (!feed) return;
      const div = document.createElement('div');
      div.className = 'msg ' + (type || 'status');
      div.textContent = text;
      feed.appendChild(div);
      const msgs = feed.querySelectorAll('.msg');
      const limit = 50;
      if (msgs.length > limit) {
        feed.removeChild(msgs[0]);
      }
      feed.scrollTop = feed.scrollHeight;
    }
    // Atualiza o preview laranja com a última resposta da IA
    function updatePreview(text) {
      const prev = document.getElementById('msgPreview');
      if (!prev) return;
      prev.textContent = text.replace(/\s+/g, ' ').trim();
      // Exibe o preview apenas se a página Home estiver ativa.  Caso
      // contrário, mantenha-o oculto para não interferir na visualização
      // das outras abas (chat, apps etc.).
      const homeView = document.getElementById('v-home');
      const isHomeActive = homeView && homeView.classList.contains('active');
      prev.style.display = isHomeActive ? 'block' : 'none';
    }
    function startSpeechConversation(userName, sk, model) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        showArchMessage('Reconhecimento de fala não suportado neste navegador.', 'err');
        return;
      }
      const recognition = new SpeechRecognition();
      recognition.lang = 'pt-BR';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;
      recognition.onstart = () => {
        showArchMessage('Estou ouvindo…', 'ok');
        feedPush('status', '🎙️ Ouvindo…');
      };
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript.trim();
        if (transcript) {
          feedPush('user', 'Você: ' + transcript);
          showArchMessage('Pulso enviado. Recebendo intenção…', 'ok');
          feedPush('status', '⚡ Pulso enviado · recebendo intenção…');
          handleUserMessage(transcript, userName, sk, model);
        }
      };
      recognition.onerror = (e) => {
        console.error('Erro no reconhecimento de fala:', e);
        showArchMessage('Erro no reconhecimento de fala.', 'err');
        feedPush('status', '❌ Erro no reconhecimento de fala.');
      };
      recognition.start();
    }

    /**
     * Processa a mensagem falada pelo usuário.  Exibe a transcrição no
     * feedback, envia a mensagem ao modelo de IA via OpenRouter e, ao
     * receber a resposta, exibe e fala a resposta de volta.
     * @param {string} text Texto transcrito da fala do usuário
     * @param {string} userName Nome do usuário
     * @param {string} sk Chave OpenRouter
     * @param {string} model Modelo de IA
     */
    async function handleUserMessage(text, userName, sk, model) {
      // A mensagem do usuário já foi adicionada ao feed no evento onresult do reconhecimento de fala
      // Monta prompt incluindo o nome do usuário para personalização
      const prompt = `${userName} disse: ${text}`;
      // Envia ao modelo de IA
      let reply = '';
      try {
        reply = await sendAIMessage(prompt, sk, model);
      } catch (err) {
        console.error('Falha ao consultar IA:', err);
        reply = 'Desculpe, não consegui responder no momento.';
      }
      if (reply) {
        // Determine o arquétipo ativo para prefixar as respostas no feed
        let archName = 'Dual';
        try {
          const select = document.getElementById('arch-select');
          let base = (select?.value || '').replace(/\.html$/i, '');
          archName = base.charAt(0).toUpperCase() + base.slice(1).toLowerCase();
        } catch (e) {}
        feedPush('ai', archName + ': ' + reply);
        showArchMessage(reply, 'ok');
        try { speakWithActiveArch(reply); } catch {}
      }
    }

    /**
     * Envia uma mensagem ao endpoint de chat do OpenRouter.  Esta função
     * utiliza a API de chat completions para obter uma resposta do modelo
     * selecionado.  Caso não seja possível acessar a API (por exemplo,
     * se a aplicação estiver offline), uma resposta de erro é retornada.
     * @param {string} content Conteúdo da mensagem/prompt
     * @param {string} sk Chave de API
     * @param {string} model Identificador do modelo
     * @returns {Promise<string>} Resposta do modelo
     */
    async function sendAIMessage(content, sk, model) {
      // Estrutura de payload conforme especificação do OpenRouter
      const payload = {
        model: model,
        messages: [
          { role: 'system', content: 'Você é um assistente amistoso que responde em português.' },
          { role: 'user', content: content }
        ],
        max_tokens: 200,
        temperature: 0.7
      };
      const url = 'https://openrouter.ai/api/v1/chat/completions';
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sk}`
        },
        body: JSON.stringify(payload)
      });
      if (!res.ok) {
        throw new Error('Erro na API: ' + res.status);
      }
      const data = await res.json();
      const reply = data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content;
      return reply || '';
    }

    // Delegue cliques dentro do menu para a função de navegação.
    document.addEventListener('DOMContentLoaded', () => {
      const menu = document.getElementById('archMenu');
      if (menu) {
      menu.addEventListener('click', (e) => {
        // Primeiro verifique se o botão de áudio foi clicado
        const audioBtn = e.target.closest('button[data-audio]');
        if (audioBtn) {
          // Alterna modo áudio usando a função global
          if (typeof toggleAudio === 'function') {
            toggleAudio();
          }
          // Atualize o estado visual do botão
          const archCircle = document.querySelector('.arch-circle');
          if (archCircle) {
            audioBtn.classList.toggle('on', archCircle.classList.contains('audio-on'));
          }
          // Não feche o menu ao alternar áudio
          return;
        }
        // Caso contrário, delegue a navegação para botões com data-nav
        const btn = e.target.closest('button[data-nav]');
        if (btn) {
          nav(btn.getAttribute('data-nav'));
          menu.classList.remove('show');
        }
      });
      }
      // Clique no preview direciona ao chat
      const mp = document.getElementById('msgPreview');
      if (mp) mp.addEventListener('click', () => nav('chat'));

      /* Formulário de chat removido: a captura de mensagens é feita via
         overlay de entrada. */

      // Inicialização dos botões de texto e voz na Home (overlay).  Dois botões
      // empilhados acima da barra: o superior inicia reconhecimento de voz e
      // o inferior mostra o campo de texto. O envio do formulário do
      // overlay dispara a mesma lógica do chat padrão.
      const textBtn = document.getElementById('homeTextBtn');
      const voiceBtn = document.getElementById('homeVoiceBtn');
      const hiOverlay = document.getElementById('homeInputOverlay');
      const hiForm = document.getElementById('homeInputForm');
      const hiInput = document.getElementById('homeInput');
      // Exibe/oculta o overlay ao tocar no botão de texto
      if (textBtn && hiOverlay && hiForm && hiInput) {
        textBtn.addEventListener('click', () => {
          const show = hiOverlay.style.display !== 'block';
          hiOverlay.style.display = show ? 'block' : 'none';
          textBtn.classList.toggle('active', show);
          if (show) setTimeout(() => hiInput.focus(), 60);
        });
        hiForm.addEventListener('submit', (ev) => {
          ev.preventDefault();
          const msg = hiInput.value.trim();
          if (!msg) return;
          feedPush('user', 'Você: ' + msg);
          showArchMessage('Pulso enviado. Recebendo intenção…', 'ok');
          feedPush('status', '⚡ Pulso enviado · recebendo intenção…');
          const userName = (localStorage.getItem('dual.name') || localStorage.getItem('infodose:userName') || '').trim();
          const sk = (localStorage.getItem('dual.keys.openrouter') || localStorage.getItem('infodose:sk') || '').trim();
          let mdl = LS.get('dual.openrouter.model');
          if (!mdl) mdl = (localStorage.getItem('infodose:model') || '').trim() || 'openrouter/auto';
          try { handleUserMessage(msg, userName, sk, mdl); } catch (e) { console.warn(e); }
          hiInput.value = '';
        });
      }
      // Inicia conversa por voz ao tocar no botão de voz
      if (voiceBtn) {
        voiceBtn.addEventListener('click', () => {
          const userName = (localStorage.getItem('dual.name') || localStorage.getItem('infodose:userName') || '').trim();
          const sk = (localStorage.getItem('dual.keys.openrouter') || localStorage.getItem('infodose:sk') || '').trim();
          let mdl = LS.get('dual.openrouter.model');
          if (!mdl) mdl = (localStorage.getItem('infodose:model') || '').trim() || 'openrouter/auto';
          if (hiOverlay) hiOverlay.style.display = 'none';
          if (typeof startSpeechConversation === 'function') {
            startSpeechConversation(userName, sk, mdl);
          }
        });
      }
    });

    // Helper: se a aba Revo estiver ativa, envia a lista atual de apps ao iframe.  
    function maybeSendAppsToRevo() {
      // Revo foi substituído pelo Chat; nenhuma mensagem precisa ser enviada
      return;
    }
    $$('.tab,[data-nav]').forEach(b => b.addEventListener('click', () => nav(b.dataset.nav || 'home')));
    $('#btnBack').onclick = () => { try { history.length > 1 && history.back() } catch { } };
    $('#btnBrain').onclick = () => nav('brain');

    // Restaurar última aba
    let last = LS.get('uno:lastTab', 'home');
    // Se o último tab salvo for 'revo', redirecione para home para evitar páginas vazias
    if (last === 'revo') last = 'home';
    nav(last);
    // Se a aba inicial for home, exibir saudação
    if (last === 'home') {
      try { displayGreeting(); } catch(e) {}
    }

    // Atalhos
    let gPressed = false;
    window.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') { e.preventDefault(); downloadSelf(); return; }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); $('#appSearch')?.focus(); return; }
      if (e.key.toLowerCase() === 'g') { gPressed = true; setTimeout(() => gPressed = false, 600); return; }
      if (!gPressed) return; const k = e.key.toLowerCase();
      if (k === 'h') nav('home'); if (k === 'a') nav('apps'); if (k === 's') nav('stack'); if (k === 'b') nav('brain'); if (k === 'r') nav('chat'); gPressed = false;
    });

    // Ajuda modal
    const modalHelp = $('#modalHelp');
    $('#btnHelp').onclick = () => { modalHelp.classList.add('open'); modalHelp.setAttribute('aria-hidden', 'false'); };
    $('#closeHelp').onclick = () => { modalHelp.classList.remove('open'); modalHelp.setAttribute('aria-hidden', 'true'); };
    modalHelp.addEventListener('click', (e) => { if (e.target === modalHelp) $('#closeHelp').click(); });

    // Baixar HTML
    function downloadSelf() {
      try {
        const clone = document.documentElement.cloneNode(true);
        const html = '<!doctype html>\n' + clone.outerHTML;
        const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
        const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'HUB-UNO-Revo.html'; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 500);
        toast('HTML exportado', 'ok');
      } catch (e) { alert('Falha ao exportar: ' + e.message); }
    }
    $('#btnDownload').onclick = downloadSelf;

    /* ===================== Brain ===================== */
    const MODELS = ['openrouter/auto','anthropic/claude-3.5-sonnet','openai/gpt-4.1-mini','google/gemini-1.5-pro','meta/llama-3.1-405b-instruct','mistral/mistral-large-latest'];
    (function initBrain() {
      const sel = $('#model'); sel.innerHTML = ''; MODELS.forEach(m => { const o = document.createElement('option'); o.value = m; o.textContent = m; sel.appendChild(o) });
      sel.value = LS.get('dual.openrouter.model', MODELS[0]);
      $('#sk').value = LS.raw('dual.keys.openrouter');
      $('#saveSK').onclick = () => { LS.set('dual.openrouter.model', sel.value); localStorage.setItem('dual.keys.openrouter', $('#sk').value || ''); toast('Configurações salvas', 'ok'); };
      $('#saveName').onclick = () => {
        localStorage.setItem('infodose:userName', ($('#userName').value || '').trim());
        // Toque som especial ao salvar o nome do usuário (Tech Pop)
        try { if (typeof window.playTechPopSound === 'function') window.playTechPopSound(); } catch {}
        // Mensagens de toast foram desativadas globalmente
        try { displayGreeting(); } catch (e) {}
        try { updateHomeStatus(); } catch {}
      };

      // Preencher campo de assistente com valor salvo
      const assistantInput = document.getElementById('assistantName');
      if (assistantInput) {
        assistantInput.value = (localStorage.getItem('infodose:assistantName') || '').trim();
      }
      // Salvar nome do assistente
      const btnAssistant = document.getElementById('saveAssistant');
      if (btnAssistant) {
        btnAssistant.onclick = () => {
          const nameVal = (assistantInput.value || '').trim();
          localStorage.setItem('infodose:assistantName', nameVal);
          try { if (typeof window.playTechPopSound === 'function') window.playTechPopSound(); } catch {}
        };
      }

      // Preencher lista de vozes para seleção global de fala
      const voiceSel = document.getElementById('selectVoice');
      function populateVoiceSel() {
        if (!voiceSel) return;
        voiceSel.innerHTML = '';
        let voices = speechSynthesis.getVoices();
        if (!voices || !voices.length) return;
        // Filtrar por idiomas suportados (Português e Inglês) se disponível
        const filtered = voices.filter(v => v.lang && (v.lang.toLowerCase().startsWith('pt') || v.lang.toLowerCase().startsWith('en')));
        voices = filtered.length ? filtered : voices;
        const savedVoice = localStorage.getItem('infodose:speechVoice') || '';
        voices.forEach(v => {
          const opt = document.createElement('option');
          opt.value = v.name;
          opt.textContent = v.name + ' (' + v.lang + ')';
          if (savedVoice && savedVoice === v.name) opt.selected = true;
          voiceSel.appendChild(opt);
        });
      }
      if (voiceSel) {
        // Populate now and when voices change
        populateVoiceSel();
        speechSynthesis.onvoiceschanged = populateVoiceSel;
      }
      const btnVoice = document.getElementById('saveVoice');
      if (btnVoice && voiceSel) {
        btnVoice.onclick = () => {
          const val = voiceSel.value;
          localStorage.setItem('infodose:speechVoice', val || '');
          try { if (typeof window.playTechPopSound === 'function') window.playTechPopSound(); } catch {}
        };
      }

      // Permitir adicionar modelo personalizado
      const addBtn = $('#addModel');
      const customInput = $('#customModel');
      if (addBtn && customInput) {
        addBtn.onclick = () => {
          const val = (customInput.value || '').trim();
          if (!val) return;
          const opt = document.createElement('option');
          opt.value = val; opt.textContent = val;
          sel.appendChild(opt);
          sel.value = val;
          LS.set('dual.openrouter.model', val);
          customInput.value = '';
          toast('Modelo adicionado', 'ok');
        };
      }
      // Permitir carregamento de arquivo de treino
      const trainInp = $('#trainingFile');
      if (trainInp) {
        trainInp.addEventListener('change', (ev) => {
          const file = ev.target.files && ev.target.files[0];
          if (!file) return;
          const reader = new FileReader();
          reader.onload = () => {
            try {
              LS.set('dual.openrouter.training', { name: file.name, data: reader.result });
              toast('Treinamento carregado', 'ok');
            } catch (err) { console.error(err); toast('Erro ao carregar treino', 'err'); }
          };
          reader.readAsDataURL(file);
        });
      }
    })();

    /* ===================== Inicialização do tema & personalização de fundo ===================== */
    (function initThemeSettings() {
      // Se o usuário nunca selecionou um tema antes, defina o padrão como "medium" (cinza).
      if (!LS.get('uno:theme')) {
        LS.set('uno:theme','blue1');
      }
      // Aplique o tema salvo imediatamente
      applyTheme();
      // Configure o seletor de tema
      const sel = document.getElementById('themeSelect');
      if (sel) {
        sel.value = LS.get('uno:theme','blue1');
        sel.addEventListener('change', () => {
          LS.set('uno:theme', sel.value);
          applyTheme();
          toast('Tema atualizado', 'ok');
          try { updateHomeStatus(); } catch {}
        });
      }
      const upload = document.getElementById('bgUpload');
      if (upload) {
        upload.addEventListener('change', (e) => {
          const f = e.target.files && e.target.files[0];
          if (!f) return;
          const reader = new FileReader();
          reader.onload = () => {
            try {
              LS.set('uno:bg', reader.result);
              LS.set('uno:theme', 'custom');
              if (sel) sel.value = 'custom';
              applyTheme();
              toast('Fundo personalizado salvo', 'ok');
              try { updateHomeStatus(); } catch {}
            } catch (err) { console.error(err); toast('Erro ao salvar fundo', 'err'); }
          };
          reader.readAsDataURL(f);
        });
      }
    })();

    /* ===================== Ícones inline (data SVG) ===================== */
    function svgIcon(name){
      const common = 'xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="%23f5f7ff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"';
      const m = {
        atlas: `<svg ${common}><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3v18"/><path d="M5 8c3 2 11 2 14 0M5 16c3-2 11-2 14 0"/></svg>`,
        nova: `<svg ${common}><path d="M12 2v4M12 18v4M2 12h4M18 12h4"/><path d="M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M18.4 5.6l-2.8 2.8M8.4 15.6l-2.8 2.8"/><circle cx="12" cy="12" r="3"/></svg>`,
        vitalis:`<svg ${common}><path d="M3 12h4l2-5 4 10 2-5h6"/><path d="M13 3l-2 4 3 1-2 4"/></svg>`,
        pulse: `<svg ${common}><path d="M2 12h3l2-4 3 8 2-4h8"/><path d="M20 8v-3M20 19v-3"/></svg>`,
        artemis:`<svg ${common}><path d="M3 12h12"/><path d="M13 6l6 6-6 6"/><circle cx="12" cy="12" r="9"/></svg>`,
        serena:`<svg ${common}><path d="M12 21s-6-3.5-6-8a4 4 0 0 1 6-3 4 4 0 0 1 6 3c0 4.5-6 8-6 8z"/></svg>`,
        kaos:  `<svg ${common}><path d="M4 4l7 7-7 7"/><path d="M20 4l-7 7 7 7"/></svg>`,
        genus: `<svg ${common}><rect x="7" y="7" width="10" height="10" rx="2"/><path d="M7 7l5-3 5 3M17 17l-5 3-5-3"/></svg>`,
        lumine:`<svg ${common}><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>`,
        rhea:  `<svg ${common}><path d="M12 3v6"/><circle cx="12" cy="9" r="4"/><path d="M12 13v2l-2 2M12 15l2 2M12 17v3"/></svg>`,
        solus: `<svg ${common}><path d="M12 3v6M12 15v6"/><circle cx="12" cy="12" r="3"/><path d="M19 5l-3 3M5 19l3-3M5 5l3 3M19 19l-3-3"/></svg>`,
        aion:  `<svg ${common}><path d="M7 12c0-2.2 1.8-4 4-4 1.2 0 2.3.5 3 1.3M17 12c0 2.2-1.8 4-4 4-1.2 0-2.3-.5-3-1.3"/><path d="M3 12h4M17 12h4"/></svg>`,
        // Extra icons provided by the user. These are approximations of the requested
        // assets (e.g. audio.svg, bolt.svg, etc.) using simple line art. They
        // maintain the same stroke characteristics as the existing icons. To use
        // them elsewhere in the UI, call svgIcon('audio'), svgIcon('bolt'), etc.
        audio: `<svg ${common}><polygon points="3,9 8,9 12,5 12,19 8,15 3,15"/><path d="M15 9c1.5 1.5 1.5 4 0 5"/><path d="M17 7c3 3 3 7 0 10"/></svg>`,
        bolt: `<svg ${common}><path d="M13 3L4 14h7l-2 7 9-11h-7l3-7z"/></svg>`,
        download: `<svg ${common}><path d="M12 3v12"/><path d="M6 9l6 6 6-6"/><path d="M5 19h14"/></svg>`,
        grid: `<svg ${common}><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>`,
        home: `<svg ${common}><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2h-14a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
        json: `<svg ${common}><path d="M7 4c-2 0-2 2-2 4v8c0 2 0 4 2 4"/><path d="M17 4c2 0 2 2 2 4v8c0 2 0 4-2 4"/></svg>`,
        'logo-capsule': `<svg ${common}><rect x="4" y="7" width="16" height="10" rx="5"/><path d="M12 7v10"/></svg>`,
        'logo-seed-split': `<svg ${common}><path d="M12 12c0-4 4-8 8-8v8c0 4-4 8-8 8v-8z"/><path d="M12 12c0-4-4-8-8-8v8c0 4 4 8 8 8v-8z"/></svg>`,
        pause: `<svg ${common}><rect x="6" y="4" width="3" height="16"/><rect x="15" y="4" width="3" height="16"/></svg>`,
        play: `<svg ${common}><polygon points="6,4 20,12 6,20"/></svg>`,
        upload: `<svg ${common}><path d="M12 21V9"/><path d="M6 15l6-6 6 6"/><path d="M5 5h14"/></svg>`,
        user: `<svg ${common}><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 4-8 8-8s8 4 8 8"/></svg>`,
        sprites: `<svg ${common}></svg>`
      };
      const raw = m[name] || m['atlas'];
      return 'data:image/svg+xml;utf8,' + encodeURIComponent(raw);
    }

    /* ===================== Apps (embutido + locais) ===================== */
    const RAW = { apps: [] };

    // Controle para exibir apenas apps locais ou todos
    let showOnlyLocal = false;
    // Lista de apps favoritados (por chave). Carregada do localStorage
    let favoriteKeys = [];
    try { favoriteKeys = JSON.parse(localStorage.getItem('infodose:favApps') || '[]') || []; } catch { favoriteKeys = []; }

    /**
     * Alterna um app na lista de favoritos. Salva no localStorage e re-renderiza.
     * @param {string} key
     */
    function toggleFav(key) {
      const idx = favoriteKeys.indexOf(key);
      if (idx >= 0) {
        favoriteKeys.splice(idx, 1);
      } else {
        favoriteKeys.push(key);
      }
      localStorage.setItem('infodose:favApps', JSON.stringify(favoriteKeys));
      renderApps();
    }
    /** Verifica se um app está favoritado. */
    function isFav(key) {
      return favoriteKeys.includes(key);
    }
    const appsWrap = $('#appsWrap'), appsCount = $('#appsCount');

    function normalize(list) {
      return (list || []).map(x => ({
        key: x.key || x.url || x.title || Math.random().toString(36).slice(2),
        title: x.title || x.key || 'App',
        desc: x.desc || '',
        url: String(x.url || ''),
        icon: x.icon || '',
        tags: Array.isArray(x.tags) ? x.tags : []
      }))
    }
    function locals() {
      let arr = []; try { arr = JSON.parse(LS.raw('infodose:locals:v1') || '[]') } catch {}
      return arr.map(l => ({ key: 'local:' + l.id, title: l.name || 'Local', desc: 'HTML local', url: 'local:' + l.id, icon: 'local', tags: ['local'] }))
    }
    function getLocal(id) {
      let arr = []; try { arr = JSON.parse(LS.raw('infodose:locals:v1') || '[]') } catch {}
      return arr.find(x => x.id === id) || null
    }
    function blobURL(local) { const blob = new Blob([local.html || ''], { type: 'text/html;charset=utf-8' }); return URL.createObjectURL(blob) }

    /**
     * Atualiza os cartões de status na Home com informações atuais sobre apps, sessões,
     * preferências do usuário e arquétipo ativo. Chamado sempre que o
     * catálogo muda, quando sessões são abertas/fechadas, quando
     * configurações são salvas ou ao navegar para o Home.
     */
    function updateHomeStatus() {
      try {
        // Apps: número total ou locais se estiver filtrando
        const total = normalize(RAW.apps).concat(locals()).length;
        const localCount = locals().length;
        const txtApps = showOnlyLocal ? (localCount + ' local' + (localCount === 1 ? '' : 's')) : (total + ' app' + (total === 1 ? '' : 's'));
        const elApps = document.getElementById('homeAppsStatus');
        if (elApps) elApps.textContent = txtApps;
      } catch (e) {}
      try {
        // Sessões abertas (Stack)
        const sess = document.querySelectorAll('#stackWrap .session').length;
        const txtSess = sess + ' sessão' + (sess === 1 ? '' : 's');
        const elStack = document.getElementById('homeStackStatus');
        if (elStack) elStack.textContent = txtSess;
      } catch (e) {}
      try {
        // Usuário: nome + tema atual (mapa)
        const name = (localStorage.getItem('infodose:userName') || '').trim();
        const theme = LS.get('uno:theme','blue1');
        const themeLabel = { 'default': 'padrão', 'medium': 'cinza', 'custom': 'personalizado' }[theme] || theme;
        let txtUser = name || 'Usuário';
        txtUser += ' · ' + themeLabel;
        const elUser = document.getElementById('homeUserStatus');
        if (elUser) elUser.textContent = txtUser;
      } catch (e) {}
      try {
        // Arquétipo ativo: obtém o nome sem extensão
        const sel = document.getElementById('arch-select');
        let archName = '';
        if (sel && sel.options.length > 0) {
          const opt = sel.options[sel.selectedIndex] || null;
          if (opt) archName = opt.textContent.replace(/\.html$/i, '');
        }
        const elArch = document.getElementById('homeArchStatus');
        if (elArch) elArch.textContent = archName || 'Nenhum';
      } catch (e) {}
    }

    function appIconFor(a){
      if(!a.icon) return svgIcon('atlas');
      if(/^(atlas|nova|vitalis|pulse|artemis|serena|kaos|genus|lumine|rhea|solus|aion|local)$/.test(a.icon)) return svgIcon(a.icon);
      return a.icon; // caminho externo
    }

    function cardApp(a) {
      const el = document.createElement('div'); el.className = 'app-card fx-trans fx-lift';
      // Botão de favorito (estrela). Aparece no canto superior direito
      const fav = document.createElement('button'); fav.className = 'fav-btn';
      const favImg = document.createElement('img');
      favImg.alt = 'Favorito';
      // Use ícone local para favorito; evita depender de CDN
      favImg.src = 'icons/star.svg';
      fav.appendChild(favImg);
      // Marque como favoritado se a chave estiver na lista
      if (isFav(a.key)) fav.classList.add('fav');
      fav.onclick = (e) => { e.stopPropagation(); toggleFav(a.key); };
      el.appendChild(fav);
      const ic = document.createElement('div'); ic.className = 'app-icon';
      const iconDiv = document.createElement('div');iconDiv.className = 'icon barapps ' + (String(a.icon||a.key||'atlas')).toLowerCase(); iconDiv.classList.add('gradient-default');try {  if(!/^(atlas|nova|vitalis|pulse|artemis|serena|kaos|genus|lumine|rhea|solus|aion|local)$/.test(String(a.icon||'').toLowerCase())){    const src = appIconFor(a);    iconDiv.style.webkitMaskImage = 'url(' + src + ')';    iconDiv.style.maskImage = 'url(' + src + ')';  }} catch(e) {}ic.appendChild(iconDiv);const meta = document.createElement('div'); meta.style.flex = '1';
      // Truncar o título para exibir apenas as três primeiras palavras; adicionar reticências quando houver mais.
      const fullTitle = String(a.title || a.key || '').trim();
      const t = document.createElement('div'); t.className = 'app-title';
(function(){
  const isLocal = String(a.key||'').startsWith('local:') || String(a.url||'').startsWith('local:') || (Array.isArray(a.tags)&&a.tags.includes('local'));
  let safe = fullTitle;
  if (isLocal) { const CAP=80; if (safe.length > CAP) safe = safe.slice(0, CAP-1) + '…'; }
  t.textContent = safe;
})();
t.title = fullTitle;
const d = document.createElement('div'); d.className = 'mut'; d.textContent = a.desc || a.url;
      const open = document.createElement('button'); open.className = 'btn fx-trans fx-press ring'; open.textContent = 'Abrir';
      const rip = document.createElement('span'); rip.className = 'ripple'; open.appendChild(rip); addRipple(open);
      open.onclick = () => openApp(a);
      meta.appendChild(t); meta.appendChild(d); meta.appendChild(open);
      el.appendChild(ic); el.appendChild(meta);
      return el
    }

    function renderApps() {
      // Busque valores de busca e ordenação apenas se os campos existirem (evita erros se ocultos)
      const searchEl = document.getElementById('appSearch');
      const sortEl = document.getElementById('appSort');
      const q = searchEl ? (searchEl.value || '').toLowerCase() : '';
      const mode = sortEl ? sortEl.value : 'az';
      // Combine apps embutidos e locais
      let L = normalize(RAW.apps).concat(locals());
      // Filtrar apenas locais se ativado
      if (showOnlyLocal) {
        L = L.filter(a => String(a.url || '').startsWith('local:'));
      }
      // Aplicar busca (mantendo compatibilidade se o usuário ainda possuir o campo)
      if (q) {
        L = L.filter(a => (a.title + ' ' + a.desc + ' ' + a.key + ' ' + a.url + ' ' + (a.tags || []).join(' ')).toLowerCase().includes(q));
      }
      // Ordenar: favoritos primeiro, depois título A-Z ou Z-A conforme o select (padrão A-Z)
      L.sort((a, b) => {
        const favA = isFav(a.key); const favB = isFav(b.key);
        if (favA !== favB) return favB - favA; // true=1, false=0 => favoritos no topo
        const dir = mode === 'za' ? -1 : 1;
        return dir * String(a.title || '').localeCompare(b.title || '');
      });
      // Organize os apps por grupo (arquetipo).  Considera-se o nome
      // após o ponto "·" no título como o nome do grupo.  Se não houver,
      // coloca em "Outros".
      const grouped = {};
      L.forEach(a => {
        let gName = '';
        if (a.title && a.title.includes('·')) {
          const parts = a.title.split('·');
          gName = (parts[1] || '').trim();
        }
        if (!gName) gName = 'Outros';
        if (!grouped[gName]) grouped[gName] = [];
        grouped[gName].push(a);
      });
      // Limpar o container
      appsWrap.innerHTML = '';
      // Ordenar grupos alfabeticamente para exibir em ordem consistente
      const groupNames = Object.keys(grouped).sort((a,b) => a.localeCompare(b));
      let total = 0;
      groupNames.forEach(gName => {
        const container = document.createElement('div');
        container.className = 'apps-group';
        const header = document.createElement('h3');
        header.textContent = gName;
        header.style.margin = '16px 4px 8px';
        header.style.fontSize = '15px';
        header.style.fontWeight = '800';
        header.style.color = 'var(--mut)';
        const grid = document.createElement('div');
        grid.className = 'grid';
        grouped[gName].forEach(app => {
          const card = cardApp(app);
          grid.appendChild(card);
          total++;
        });
        container.appendChild(header);
        container.appendChild(grid);
        appsWrap.appendChild(container);
      });
      appsCount.textContent = total + ' apps';
      // Reaplicar ícones após adicionar novos cards (garante que as estrelas e ícones de apps carreguem)
      try { applyIcons(); } catch {}
      // Notifique o Revo de que os apps mudaram, se estiver ativo
      maybeSendAppsToRevo();
      // Atualize o painel de status na home com o novo número de apps
      try { updateHomeStatus(); } catch {}
    }

    (function loadEmbeddedApps(){
      try {
        const raw = JSON.parse($('#APPS_JSON').textContent || '{}');
        RAW.apps = Array.isArray(raw.apps) ? raw.apps : (Array.isArray(raw) ? raw : []);
      } catch { RAW.apps = [] }
      renderApps();
      // Após renderizar os apps, crie grupos padrão no Stack para cada
      // arquetipo, se ainda não existirem.  Isso permite que as sessões
      // abertas sejam automaticamente organizadas por grupo.
      try { ensureDefaultGroups(); } catch (e) { console.warn('Falha ao criar grupos padrão', e); }
      // Sempre envie o catálogo atualizado ao iframe do Revo após carregar os apps embutidos.
      try {
        const iframe = document.getElementById('revoEmbed');
        if (iframe) {
          const apps = RAW && Array.isArray(RAW.apps) ? RAW.apps : [];
          const send = () => { if (iframe.contentWindow) iframe.contentWindow.postMessage({ type: 'apps', apps }, '*'); };
          // Envie após pequeno atraso para garantir que o iframe esteja pronto
          setTimeout(send, 100);
          // E também quando o iframe terminar de carregar
          iframe.removeEventListener('load', iframe._sendAppsEmbedded);
          iframe._sendAppsEmbedded = send;
          iframe.addEventListener('load', send, { once: true });
        }
      } catch(e) { console.warn('Falha ao postMessage apps após embed:', e); }
    })();

    // Locais
    $('#btnImport').onclick = async () => {
      const fs = Array.from($('#fileLocal').files || []);
      if (!fs.length) return;
      const tasks = fs.map(f => new Promise(res => {
        const r = new FileReader();
        r.onload = () => {
          const content = String(r.result || '');
          // Se for um arquivo JSON, tente carregá-lo como catálogo de apps
          if (/\.json$/i.test(f.name)) {
            try {
              const obj = JSON.parse(content);
              const apps = Array.isArray(obj.apps) ? obj.apps : (Array.isArray(obj) ? obj : []);
              // Substitua o catálogo embutido pelo JSON local e recarregue a lista
              RAW.apps = apps;
              renderApps();
              toast('apps.json local carregado', 'ok');
            } catch (err) {
              console.error(err);
              toast('Erro ao ler apps.json', 'err');
            }
            // Não adicionar JSON à lista de locais; retorne null
            res(null);
          } else {
            // Trate como HTML local
            res({ id: 'l_' + Math.random().toString(36).slice(2), name: f.name.replace(/\.(html?|txt)$/i, ''), html: content, ts: Date.now() });
          }
        };
        r.readAsText(f);
      }));
      const list = (await Promise.all(tasks)).filter(Boolean);
      const cur = JSON.parse(LS.raw('infodose:locals:v1') || '[]');
      list.forEach(x => cur.unshift(x));
      localStorage.setItem('infodose:locals:v1', JSON.stringify(cur));
      renderApps();
      if (list.length) toast('HTMLs locais adicionados', 'ok');
    };
    $('#btnExport').onclick = () => { const data = { v: 1, when: Date.now(), items: JSON.parse(LS.raw('infodose:locals:v1') || '[]') }; const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })); a.download = 'locals_pack.json'; a.click(); };
    $('#btnClear').onclick = () => { if (confirm('Limpar HTMLs locais salvos?')) { localStorage.removeItem('infodose:locals:v1'); renderApps(); toast('Locais limpos', 'warn'); } };

    // Alterna exibição de apps locais/apenas locais
    try {
      const btnToggleLocal = document.getElementById('btnToggleLocal');
      if (btnToggleLocal) {
        btnToggleLocal.onclick = () => {
          showOnlyLocal = !showOnlyLocal;
          // Atualize o texto do botão conforme o modo
          btnToggleLocal.firstChild && (btnToggleLocal.firstChild.nodeValue = showOnlyLocal ? 'Mostrar Todos' : 'Mostrar Locais');
          renderApps();
        };
      }
    } catch (e) { console.warn('Falha ao associar btnToggleLocal:', e); }

    /* ===================== Stack ===================== */
    const stackWrap = $('#stackWrap'), dock = $('#dock');
    function badge(item) { const b = document.createElement('button'); b.className = 'badge fx-trans fx-press ring'; b.textContent = item.title || 'App'; b.title = 'Reabrir ' + (item.title || 'App'); const rp = document.createElement('span'); rp.className = 'ripple'; b.appendChild(rp); addRipple(b); b.onclick = () => { const s = document.querySelector('[data-sid="' + item.sid + '"]'); if (s) { s.scrollIntoView({ behavior: 'smooth' }); s.classList.remove('min'); } }; return b }
    function updateDock() {
      dock.innerHTML = '';
      $$('.session').forEach(s => {
        const meta = JSON.parse(s.dataset.meta || '{}');
        dock.appendChild(badge({ title: "", sid: s.dataset.sid }))
      });
      // Atualize o status de sessões na home
      try { updateHomeStatus(); } catch {}
    }
    function openApp(a) {
      // Permite receber um SID externo (para restaurar sessões) ou gera um novo se ausente
      const sid = a.sid || ('s_' + Math.random().toString(36).slice(2));
      const isLocal = String(a.url || '').startsWith('local:'); const lr = isLocal ? getLocal(String(a.url).slice(6)) : null; const url = lr ? blobURL(lr) : a.url;
      const card = document.createElement('div'); card.className = 'session fx-trans fx-lift';
      card.dataset.sid = sid;
      // Armazene metadados de título/url no dataset.meta para persistência
      card.dataset.meta = JSON.stringify({ title: a.title || 'App', url: a.url || '' });
      // Se nenhum grupo foi fornecido, tente atribuir com base no nome após o ponto no título (ex.: "Atlas · Cartesius").
      if (!a.gid && a.title && a.title.includes('·')) {
        const parts = a.title.split('·');
        const gName = (parts[1] || '').trim();
        if (gName) {
          a.gid = 'g_' + gName.toLowerCase().replace(/\s+/g, '_');
        }
      }
      // Se um grupo específico foi fornecido, salve no dataset.gid para persistência
      if (a.gid) card.dataset.gid = a.gid;
      card.innerHTML = `
        <div class="hdr">
          <div class="title"><span class="app-icon">${((a.title || 'App')[0] || 'A')}</span>${(a.title || 'App')}</div>
          <div class="tools">
            <button class="btn ring fx-trans fx-press" data-act="min" title="Minimizar">
              <span style="font-size:16px;line-height:1">&minus;</span>
              <span class="ripple"></span>
            </button>
            <button class="btn ring fx-trans fx-press" data-act="ref" title="Recarregar">
              <span style="font-size:16px;line-height:1">&#8635;</span>
              <span class="ripple"></span>
            </button>
            <button class="btn ring fx-trans fx-press" data-act="full" title="Tela cheia">
              <span style="font-size:16px;line-height:1">⤢</span>
              <span class="ripple"></span>
            </button>
            <!-- Botão para fixar/desafixar na navegação -->
            <button class="btn ring fx-trans fx-press" data-act="pin" title="Fixar na barra">
              <span class="pin-icon" style="font-size:16px;line-height:1">☆</span>
              <span class="ripple"></span>
            </button>
            <!-- Botão para mover entre grupos -->
            <button class="btn ring fx-trans fx-press" data-act="move" title="Mover sessão">
              <span style="font-size:16px;line-height:1">⇄</span>
              <span class="ripple"></span>
            </button>
            <button class="btn ring fx-trans fx-press" data-act="close" title="Fechar">
              <span style="font-size:16px;line-height:1">&times;</span>
              <span class="ripple"></span>
            </button>
          </div>
        </div>
        <iframe src="${url || 'about:blank'}" allow="autoplay; clipboard-read; clipboard-write; picture-in-picture; fullscreen"></iframe>
        <div class="resize-handle" title="Arraste para ajustar a altura"></div>`;
      // Redimensionar altura do iframe arrastando o handle
      (function bindResize(){
        const handle = card.querySelector('.resize-handle');
        const iframe = card.querySelector('iframe');
        if(!handle || !iframe) return;
        let startY = 0, startH = 0, dragging = false;
        handle.addEventListener('pointerdown', (ev) => {
          dragging = true;
          startY = ev.clientY;
          startH = iframe.clientHeight;
          handle.setPointerCapture(ev.pointerId);
        });
        handle.addEventListener('pointermove', (ev) => {
          if(!dragging) return;
          const dy = ev.clientY - startY;
          const h = Math.max(120, startH + dy);
          iframe.style.height = h + 'px';
        });
        const stop = () => { dragging = false; };
        handle.addEventListener('pointerup', stop);
        handle.addEventListener('pointercancel', stop);
      })();
      // Prepend the session card dependendo do modo de abertura. Se "abrir dentro" estiver marcado,
      // insira a sessão no topo da página (sessionsAnchor); caso contrário, use o stackWrap padrão.
      const anchor = document.getElementById('sessionsAnchor');
      if ($('#openInside').checked && anchor) {
        anchor.prepend(card);
      } else {
        // Se houver um grupo selecionado, adicione a sessão dentro desse grupo; caso contrário, insira no stackWrap
        // Escolha o grupo de destino: se houver um grupo selecionado manualmente
        // use-o; caso contrário, utilize o grupo inferido do título (a.gid).
        const gid = window.currentGroupId || a.gid;
        let placed = false;
        if (gid) {
          const grp = stackWrap && stackWrap.querySelector('.stack-group[data-group-id="' + gid + '"] .group-content');
          if (grp) {
            grp.prepend(card);
            card.dataset.gid = gid;
            placed = true;
          }
        }
        if (!placed) {
          stackWrap.prepend(card);
          // Remova qualquer associação de grupo se a sessão não estiver atribuída
          delete card.dataset.gid;
        }
      }
      // Não chamar applyIcons aqui: ícones embutidos manualmente nos botões de sessão
      card.querySelector('[data-act=min]').onclick = () => {
        card.classList.toggle('min');
        updateDock();
        saveStackState();
        dualLog('Sessão minimizada: ' + (a.title || 'App'));
      };
      card.querySelector('[data-act=ref]').onclick = () => { const fr = card.querySelector('iframe'); try { fr.contentWindow.location.reload() } catch { fr.src = fr.src } };
      card.querySelector('[data-act=close]').onclick = () => {
        // Se a sessão estiver fixada, remova-a também da lista de fixados
        if (card.classList.contains('pinned')) {
          removePinnedByMeta(JSON.parse(card.dataset.meta || '{}'));
        }
        card.remove();
        updateDock();
        saveStackState();
        dualLog('Sessão fechada: ' + (a.title || 'App'));
        // Toque som de fechamento de sessão
        try { playCloseSound(); } catch {}
      };
      // Botão tela cheia
      const fullBtn = card.querySelector('[data-act=full]');
      if (fullBtn) {
        fullBtn.onclick = () => {
          card.classList.toggle('full');
          document.body.classList.toggle('session-full');
        };
      }
      // Botão fixar/desafixar
      const pinBtn = card.querySelector('[data-act=pin]');
      if (pinBtn) {
        // Inicialize o estado do botão conforme o dado de entrada
        const meta = JSON.parse(card.dataset.meta || '{}');
        if (a.pinned) {
          card.classList.add('pinned');
          pinBtn.querySelector('.pin-icon').textContent = '★';
        }
        pinBtn.onclick = () => {
          const meta = JSON.parse(card.dataset.meta || '{}');
          if (card.classList.contains('pinned')) {
            // Desafixar
            card.classList.remove('pinned');
            pinBtn.querySelector('.pin-icon').textContent = '☆';
            removePinnedByMeta(meta);
            // Não exiba toast ao desafixar
          } else {
            // Fixar
            card.classList.add('pinned');
            pinBtn.querySelector('.pin-icon').textContent = '★';
            addPinned(meta);
            // Não exiba toast ao fixar
          }
        };
      }
      // Botão mover sessão entre grupos
      const moveBtn = card.querySelector('[data-act=move]');
      if (moveBtn) {
        moveBtn.onclick = () => {
          // Liste os grupos disponíveis com seus nomes
          const groups = Array.from(document.querySelectorAll('#stackWrap .stack-group'));
          if (!groups.length) {
            // Sem grupos: simplesmente remova do grupo atual, se houver
            delete card.dataset.gid;
            stackWrap.prepend(card);
            saveStackState();
            // Não exiba toast ao mover para a raiz
            return;
          }
          const names = groups.map(g => g.querySelector('summary')?.textContent || '').filter(n => n);
          const choices = names.map((n,i) => `${i+1}. ${n}`).join('\n');
          const ans = prompt('Mover para qual grupo?\n' + choices + '\n0. Sem grupo');
          if (ans === null) return;
          const idx = parseInt(ans.trim(), 10);
          if (!isNaN(idx) && idx >= 1 && idx <= groups.length) {
            const targetGroup = groups[idx-1];
            const content = targetGroup.querySelector('.group-content');
            if (content) {
              content.prepend(card);
              card.dataset.gid = targetGroup.getAttribute('data-group-id') || '';
              updateDock();
              saveStackState();
              // Não exiba toast ao mover para um grupo específico
              return;
            }
          }
          // Se o usuário digitou 0 ou algo não válido, mova para a raiz
          delete card.dataset.gid;
          stackWrap.prepend(card);
          updateDock();
          saveStackState();
          // Não exiba toast ao mover para a raiz
        };
      }
      // Não navegue automaticamente para a view Stack na versão estendida.
      // if (!$('#openInside').checked) nav('stack');
      updateDock();
      // Após abrir uma sessão, persista o estado (grupos, sessões e fixados)
      saveStackState();
      // Não exiba toast ao abrir uma nova sessão
      dualLog('Sessão aberta: ' + (a.title || 'App'));
      // Toque som de abertura de app, se definido
      try { playOpenSound(); } catch {}
    }
    $('#btnCloseAll').onclick = () => {
      if (!confirm('Fechar todas as sessões abertas?')) return;
      $$('.session').forEach(s => s.remove());
      updateDock();
      try { saveStackState(); } catch {}
      toast('Todas as sessões fechadas', 'warn');
    };

    /* ===================== Archetypes (Central Circle) ===================== */
    (function () {
      const archList = [
        'atlas.html',
        'nova.html',
        'vitalis.html',
        'pulse.html',
        'artemis.html',
        'serena.html',
        'kaos.html',
        'genus.html',
        'lumine.html',
        'solus.html',
        'rhea.html',
        'aion.html'
      ];
      const select = document.getElementById('arch-select');
      const frame = document.getElementById('arch-frame');
      const fade = document.getElementById('arch-fadeCover');

      // Mapeamento de cores/gradientes por arquétipo.  Cada chave
      // corresponde ao nome do arquivo sem a extensão .html e define
      // um valor CSS (cor sólida ou gradiente) com opacidade baixa
      // para aplicar como overlay.  Ajuste as cores conforme o
      // significado simbólico de cada arquétipo.
      const ARCH_OVERLAYS = {
        atlas: 'rgba(64, 158, 255, 0.22)',
        nova: 'rgba(255, 82, 177, 0.22)',
        vitalis: 'rgba(72, 218, 168, 0.22)',
        pulse: 'rgba(255, 99, 132, 0.22)',
        artemis: 'rgba(186, 130, 219, 0.22)',
        serena: 'rgba(140, 190, 255, 0.22)',
        kaos: 'rgba(255, 77, 109, 0.22)',
        genus: 'rgba(87, 207, 112, 0.22)',
        lumine: 'rgba(255, 213, 79, 0.22)',
        rhea: 'rgba(0, 209, 178, 0.22)',
        solus: 'rgba(100, 149, 237, 0.22)',
        aion: 'rgba(255, 159, 67, 0.22)',
        default: 'rgba(255,255,255,0.0)'
      };

      // Aplica a cor/gradiente de overlay correspondente ao arquétipo
      function applyArchOverlay(name) {
        const key = (name || '').toLowerCase();
        const color = ARCH_OVERLAYS[key] || ARCH_OVERLAYS.default;
        document.documentElement.style.setProperty('--arch-overlay', color);
      }
      function populate() {
        select.innerHTML = '';
        archList.forEach(name => {
          const opt = document.createElement('option');
          opt.value = name;
          opt.textContent = name;
          select.appendChild(opt);
        });
      }
      function setSrcByIndex(idx) {
        if (!archList.length) return;
        const n = (idx + archList.length) % archList.length;
        select.selectedIndex = n;
        const file = archList[n];
        frame.src = './archetypes/' + file;
        // Pronuncia o nome do arquétipo sempre que for selecionado
        try {
          const base = file.replace(/\.html$/i, '');
          speakArchetype(base);
        } catch (e) {}
        // Atualiza as informações da Home (cartões) quando o arquétipo muda
        try {
          updateHomeStatus();
        } catch (e) {}

        // Ajusta o overlay de cor para o arquétipo selecionado
        try {
          const base = file.replace(/\.html$/i, '');
          applyArchOverlay(base);
        } catch (e) {}
      }
      let current = 0;
      populate();
      if (archList.length) setSrcByIndex(0);
      document.getElementById('arch-prev').addEventListener('click', () => {
        current = (current - 1 + archList.length) % archList.length;
        fade.classList.add('show');
        setTimeout(() => {
          setSrcByIndex(current);
          setTimeout(() => fade.classList.remove('show'), 200);
        }, 140);
      });
      document.getElementById('arch-next').addEventListener('click', () => {
        current = (current + 1) % archList.length;
        fade.classList.add('show');
        setTimeout(() => {
          setSrcByIndex(current);
          setTimeout(() => fade.classList.remove('show'), 200);
        }, 140);
      });
      select.addEventListener('change', () => {
        current = select.selectedIndex;
        fade.classList.add('show');
        setTimeout(() => {
          setSrcByIndex(current);
          setTimeout(() => fade.classList.remove('show'), 200);
        }, 140);
      });
    })();

    /* ===================== Custom CSS & Voices: Event Handlers ===================== */
    // Aplicar CSS personalizado salvo no carregamento inicial
    try { applyCSS(); } catch (e) {}
    // Inicializar vozes na aba Brain
    try { initVoices(); } catch (e) {}
    // Inicializar ripple de áudio (modo que responde ao microfone)
    try { initAudioRipple(); } catch (e) {}
    // Exibir saudação inicial se aplicável
    try { welcome(); } catch (e) {}
    // Conectar botões de CSS personalizado
    const btnApplyCSS = document.getElementById('applyCSS');
    const btnClearCSS = document.getElementById('clearCSS');
    const btnDownloadCSS = document.getElementById('downloadCSS');
    if (btnApplyCSS) {
      btnApplyCSS.addEventListener('click', () => {
        const textarea = document.getElementById('cssCustom');
        const css = (textarea && textarea.value || '').trim();
        localStorage.setItem('infodose:cssCustom', css);
        applyCSS();
        toast('CSS aplicado', 'ok');
      });
    }
    if (btnClearCSS) {
      btnClearCSS.addEventListener('click', () => {
        localStorage.removeItem('infodose:cssCustom');
        const textarea = document.getElementById('cssCustom');
        if (textarea) textarea.value = '';
        applyCSS();
        toast('CSS removido', 'warn');
      });
    }
    if (btnDownloadCSS) {
      btnDownloadCSS.addEventListener('click', () => {
        const css = localStorage.getItem('infodose:cssCustom') || '';
        const blob = new Blob([css], { type: 'text/css' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'custom.css';
        a.click();
        setTimeout(() => URL.revokeObjectURL(a.href), 500);
      });
    }

    /* ===================== Init ===================== */
    // Inicialize preferências de performance e voz e associe botões no Brain
    (function initDualPrefs(){
      const perfSel = document.getElementById('selPerf');
      const voiceSel = document.getElementById('selVoice');
      if (perfSel) perfSel.value = dualState.perf;
      if (voiceSel) voiceSel.value = dualState.voice;
      const perfBtn = document.getElementById('btnPerf');
      const voiceBtn = document.getElementById('btnVoice');
      if (perfBtn && perfSel) {
        perfBtn.addEventListener('click', () => {
          dualState.perf = perfSel.value;
          localStorage.setItem('hub.perf', dualState.perf);
          dualLog('Performance atualizada: ' + dualState.perf);
          toast('Performance atualizada', 'ok');
        });
      }
      if (voiceBtn && voiceSel) {
        voiceBtn.addEventListener('click', () => {
          dualState.voice = voiceSel.value;
          localStorage.setItem('hub.voice', dualState.voice);
          dualLog('Voz selecionada: ' + dualState.voice);
          toast('Voz atualizada', 'ok');
        });
      }
    })();
    $$('button').forEach(addRipple);

/* ===== permite-escolher-o-mesmo-arquivo-novamente.js ===== */
(() => {
  const uploadBtn = document.getElementById('btnStackUpload');
  const uploadInput = document.getElementById('stackUpload');
  if (uploadBtn && uploadInput) {
    uploadBtn.addEventListener('click', () => uploadInput.click());
    uploadInput.addEventListener('change', (ev) => {
      const file = ev.target.files && ev.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        const content = String(reader.result || '');
        const blob = new Blob([content], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        openApp({ title: file.name.replace(/\.(html?|txt)$/i,''), url });
      };
      reader.readAsText(file);
      // Permite escolher o mesmo arquivo novamente
      ev.target.value = '';
    });
  }
  const btnAddGroup = document.getElementById('btnAddGroup');
  const stackWrapEl = document.getElementById('stackWrap');
  window.currentGroupId = null;
  if (btnAddGroup && stackWrapEl) {
      btnAddGroup.addEventListener('click', () => {
      const name = prompt('Nome do grupo:');
      if (!name) return;
      const gid = 'g_' + Math.random().toString(36).slice(2);
      const details = document.createElement('details');
      details.className = 'stack-group';
      details.setAttribute('data-group-id', gid);
      details.open = true;
      const summary = document.createElement('summary');
      summary.textContent = name;
      const content = document.createElement('div');
      content.className = 'group-content';
      details.appendChild(summary);
      details.appendChild(content);
      stackWrapEl.prepend(details);
      window.currentGroupId = gid;
      // Salve o estado após criar um novo grupo
      try { saveStackState(); } catch {}
    });
  }
})();

/* ===== alguns-navegadores-bloqueiam-a-reproducao-automatica-ignore-erros-aqui.js ===== */
window.addEventListener('load', () => {
  const splash = document.getElementById('appSplash');
  if (!splash) return;
  // Reproduza o som do splash assim que a página carregar, se houver um elemento de áudio.
  const audioElem = document.getElementById('splashSound');
  if (audioElem) {
    try {
      audioElem.currentTime = 0;
      audioElem.play().catch(() => {
        /* Alguns navegadores bloqueiam a reprodução automática.  Ignore erros aqui. */
      });
    } catch (err) {}
  }
  // Fale durante o splash usando a síntese de voz
  try {
    if (typeof speakSplash === 'function') speakSplash();
  } catch {}
  // Em seguida, faça a saudação completa alguns instantes depois do splash
  try {
    if (typeof speakHomeGreeting === 'function') setTimeout(() => speakHomeGreeting(), 400);
  } catch {}
  // Aguarde um breve instante após o carregamento para garantir que o loader seja exibido.
  // Aumente este valor (ms) para manter o splash por mais tempo. Aqui usamos 1200ms (1.2s).
  setTimeout(() => {
    splash.classList.add('hidden');
    // Remova o elemento do DOM após a transição de opacidade
    setTimeout(() => {
      if (splash && splash.parentNode) splash.parentNode.removeChild(splash);
    }, 400);
  }, 1200);
});

/* ===== salve-grupos.js ===== */
(() => {
  /**
   * Cria um grupo de stack com id e nome fornecidos. Usado ao restaurar grupos.
   * @param {string} gid
   * @param {string} name
   */
  function createStackGroup(gid, name) {
    const stackWrapEl = document.getElementById('stackWrap');
    if (!stackWrapEl) return;
    const details = document.createElement('details');
    details.className = 'stack-group';
    details.setAttribute('data-group-id', gid);
    details.open = true;
    const summary = document.createElement('summary');
    summary.textContent = name;
    const content = document.createElement('div');
    content.className = 'group-content';
    details.appendChild(summary);
    details.appendChild(content);
    stackWrapEl.prepend(details);
  }

  /**
   * Salva a estrutura de grupos e sessões no LocalStorage.
   */
  function saveStackState() {
    try {
      // Salve grupos
      const groups = [];
      document.querySelectorAll('#stackWrap .stack-group').forEach(g => {
        const id = g.getAttribute('data-group-id');
        const name = g.querySelector('summary')?.textContent || '';
        if (id && name) groups.push({ id, name });
      });
      localStorage.setItem('unoStackGroups', JSON.stringify(groups));
      // Salve sessões (Stack e sessionsAnchor)
      const sess = [];
      document.querySelectorAll('#stackWrap .session, #sessionsAnchor .session').forEach(card => {
        const sid = card.dataset.sid;
        const meta = card.dataset.meta;
        const gid = card.dataset.gid || null;
        const min = card.classList.contains('min');
        const pinned = card.classList.contains('pinned');
        if (sid && meta) sess.push({ sid, meta, gid, min, pinned });
      });
      localStorage.setItem('unoStackSessions', JSON.stringify(sess));
    } catch (e) {
      console.warn('Erro ao salvar estado do stack', e);
    }
    // Salve apps fixados (o array já está armazenado em unoPinnedApps via add/remove)
  }
  window.saveStackState = saveStackState;

  /**
   * Garante que existam grupos de stack correspondentes a cada categoria de apps
   * (arquetipos).  Obtém os nomes de grupo da variável RAW.apps e cria
   * grupos com IDs fixos baseados no nome.  Se um grupo já existir, não o
   * duplica.  Use para organizar sessões automaticamente por arquetipo.
   */
  function ensureDefaultGroups() {
    try {
      const stackWrapEl = document.getElementById('stackWrap');
      if (!stackWrapEl) return;
      // Obtenha lista de nomes de grupos a partir dos apps embutidos
      const names = {};
      (RAW.apps || []).forEach(a => {
        if (a && a.title && a.title.includes('·')) {
          const parts = a.title.split('·');
          const gName = (parts[1] || '').trim();
          if (gName) names[gName] = true;
        }
      });
      // Para cada nome, crie grupo se não existir
      Object.keys(names).forEach(name => {
        const gid = 'g_' + name.toLowerCase().replace(/\s+/g, '_');
        if (!document.querySelector('#stackWrap .stack-group[data-group-id="' + gid + '"]')) {
          createStackGroup(gid, name);
        }
      });
    } catch (e) {
      console.warn('Falha ao garantir grupos padrão', e);
    }
  }
  // Exponha função globalmente para poder chamar de outros lugares
  window.ensureDefaultGroups = ensureDefaultGroups;

  /**
   * Restaura grupos e sessões do LocalStorage.
   */
  function restoreStackState() {
    try {
      const groups = JSON.parse(localStorage.getItem('unoStackGroups') || '[]');
      if (Array.isArray(groups)) {
        groups.forEach(g => {
          if (g && g.id && g.name) createStackGroup(g.id, g.name);
        });
      }
      const sessions = JSON.parse(localStorage.getItem('unoStackSessions') || '[]');
      if (Array.isArray(sessions)) {
        sessions.forEach(s => {
          try {
            const meta = JSON.parse(s.meta || '{}');
            openApp({ sid: s.sid, title: meta.title, url: meta.url, gid: s.gid, pinned: s.pinned });
            const card = document.querySelector('[data-sid="' + s.sid + '"]');
            if (card) {
              if (s.min) card.classList.add('min');
            }
          } catch (e) {}
        });
      }
    } catch (e) {
      console.warn('Falha ao restaurar grupos/sessões', e);
    }
    updateDock();
  }
  window.restoreStackState = restoreStackState;

  /**
   * Obtém a lista de apps fixados a partir do LocalStorage.
   * @returns {Array<{title:string,url:string}>}
   */
  function getPinnedList() {
    try { return JSON.parse(localStorage.getItem('unoPinnedApps') || '[]') || []; } catch { return []; }
  }

  /**
   * Atualiza o LocalStorage e a UI com o novo item fixado.
   * Evita duplicatas com base no título e URL.
   * @param {{title:string,url:string}} meta
   */
  function addPinned(meta) {
    if (!meta || !meta.title) return;
    const list = getPinnedList();
    const exists = list.some(item => item.title === meta.title && item.url === meta.url);
    if (!exists) {
      list.push({ title: meta.title, url: meta.url });
      localStorage.setItem('unoPinnedApps', JSON.stringify(list));
    }
    updatePinnedNav();
  }
  window.addPinned = addPinned;

  /**
   * Remove um item fixado com base no título e URL.
   * @param {{title:string,url:string}} meta
   */
  function removePinnedByMeta(meta) {
    if (!meta) return;
    let list = getPinnedList();
    list = list.filter(item => !(item.title === meta.title && item.url === meta.url));
    localStorage.setItem('unoPinnedApps', JSON.stringify(list));
    updatePinnedNav();
  }
  window.removePinnedByMeta = removePinnedByMeta;

  /**
   * Atualiza a barra de navegação para refletir os itens fixados.
   * Cria botões dinâmicos para cada app fixado.
   */
  function updatePinnedNav() {
    const navInner = document.querySelector('.tabbar .inner');
    if (!navInner) return;
    // Remova botões fixados existentes
    navInner.querySelectorAll('button.tab[data-pinned]').forEach(btn => btn.remove());
    const list = getPinnedList();
    list.forEach(item => {
      const btn = document.createElement('button');
      btn.className = 'tab fx-trans fx-press ring';
      btn.setAttribute('data-pinned', 'true');
      btn.title = item.title;
      // Use a primeira letra do título como ícone
      const letter = (item.title || '?').trim().charAt(0).toUpperCase();
      btn.innerHTML = `<span class="pin-letter">${letter}</span><span class="ripple"></span>`;
      btn.onclick = () => {
        openApp({ title: item.title, url: item.url });
      };
      navInner.appendChild(btn);
    });
  }
  window.updatePinnedNav = updatePinnedNav;

  // Restaure o estado e pinte a navegação assim que o DOM estiver pronto
  document.addEventListener('DOMContentLoaded', () => {
    try {
      window.__RESTORING_CHAT = true;
      restoreStackState();
      updatePinnedNav();
    } catch (e) {
      console.warn(e);
    }
  });
})();

/* ===== associe-sons-aos-principais-elementos-de-interface-cada-botao-com-a.js ===== */
// Associe sons aos principais elementos de interface.  Cada botão com a
  // classe .btn toca o som de clique; os itens de navegação tocam som de
  // tab ou nav; a abertura/fechamento de sessões dispara sons específicos.
  (function(){
    const getAudio = id => document.getElementById(id);
    const play = (id) => {
      const audio = getAudio(id);
      if (audio) {
        try { audio.currentTime = 0; audio.play(); } catch {}
      }
    };
    // Clique em qualquer botão
    document.body.addEventListener('click', (e) => {
      const btn = e.target.closest('.btn');
      if (btn) play('sndClick');
      // Navegação inferior (tabs)
      const navBtn = e.target.closest('nav .btn');
      if (navBtn) play('sndTab');
    });
    // Hover (mouseenter) em botões
    document.body.addEventListener('mouseenter', (e) => {
      const btn = e.target.closest('.btn');
      if (btn) play('sndHover');
    }, true);
    // Sobrescreva open/close de sessões para tocar sons
    window.playOpenSound = () => play('sndOpen');
    window.playCloseSound = () => play('sndClose');
    // Exponha também som especial Tech Pop
    window.playTechPopSound = () => play('sndTechPop');
  })();

/* ===== chatplus-v1-2025-09-26.js ===== */
// ===================== ChatPlus — v1 (2025-09-26) =====================
// Adds: emoji buttons, 3-block expandable answers, safe HTML rendering,
// autosave + compaction, and speech cues "Pulso enviado / Recebendo intenção".

(function(){
  const $ = (q, r=document)=>r.querySelector(q);
  const $$ = (q, r=document)=>Array.from(r.querySelectorAll(q));
  const LS = {
    get: (k, d) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d } catch { return d } },
    set: (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)) } catch {} },
    raw:(k)=>localStorage.getItem(k)||''
  };

  // ---------- 1) Safe HTML sanitizer ----------
  function sanitizeHTML(input){
    try{
      const parser = new DOMParser();
      const doc = parser.parseFromString(String(input||''), 'text/html');
      const disallowed = ['script','style','link','iframe','object','embed','meta'];
      disallowed.forEach(tag => doc.querySelectorAll(tag).forEach(n=>n.remove()));
      // Remove on* attributes and style; harden URLs
      const walker = doc.createTreeWalker(doc.body, NodeFilter.SHOW_ELEMENT);
      const allowedProtocols = ['http:', 'https:', 'data:'];
      while (walker.nextNode()) {
        const el = walker.currentNode;
        // Remove event handlers and style
        [...el.attributes].forEach(a => {
          if (/^on/i.test(a.name) || a.name === 'style') el.removeAttribute(a.name);
        });
        if (el.tagName === 'A') {
          el.setAttribute('target', '_blank');
          el.setAttribute('rel', 'noopener noreferrer');
          const href = el.getAttribute('href') || '';
          try {
            const u = new URL(href, location.href);
            if (!allowedProtocols.includes(u.protocol)) el.removeAttribute('href');
          } catch { el.removeAttribute('href'); }
        }
        if (el.tagName === 'IMG') {
          const src = el.getAttribute('src') || '';
          if (!/^https?:|^data:image\//i.test(src)) {
            el.removeAttribute('src');
          } else if (src.startsWith('data:') && src.length > 200000) {
            el.setAttribute('src', '');
          }
          el.setAttribute('loading','lazy');
          el.setAttribute('decoding','async');
          el.style.maxWidth = '100%';
          el.style.height = 'auto';
          el.style.borderRadius = '8px';
        }
      }
      return doc.body.innerHTML;
    }catch(e){
      return String(input||'').replace(/[<>]/g, c => c === '<' ? '&lt;' : '&gt;');
    }
  }

  // ---------- 2) Emoji wrapper & quick-reply ----------
  const emojiRegex = /([\p{Extended_Pictographic}\u2600-\u27BF](?:\uFE0F|\u200D[\p{Extended_Pictographic}\u2600-\u27BF])*)/gu;
  function wrapEmojisInEl(root){
    if (!root) return;
    // Walk text nodes and replace emojis with buttons
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const toReplace = [];
    while (walker.nextNode()) {
      const node = walker.currentNode;
      if (!node.nodeValue) continue;
      if (emojiRegex.test(node.nodeValue)) {
        toReplace.push(node);
      }
      emojiRegex.lastIndex = 0;
    }
    toReplace.forEach(node => {
      const frag = document.createDocumentFragment();
      const parts = node.nodeValue.split(emojiRegex);
      parts.forEach(part => {
        if (!part) return;
        if (emojiRegex.test(part)) {
          const btn = document.createElement('button');
          btn.className = 'emoji-btn';
          btn.textContent = part;
          btn.setAttribute('data-emoji', part);
          frag.appendChild(btn);
          emojiRegex.lastIndex = 0;
        } else {
          frag.appendChild(document.createTextNode(part));
        }
      });
      node.parentNode.replaceChild(frag, node);
    });
  }

  // Delegation: clicking an emoji sends it as a new message
  const chatFeed = document.getElementById('chatFeed');
  if (chatFeed) {
    chatFeed.addEventListener('click', (e) => {
      const btn = e.target.closest('.emoji-btn');
      if (!btn) return;
      const emoji = btn.getAttribute('data-emoji') || btn.textContent || '';
      if (emoji) {
        if (typeof window.sendUserMessage === 'function') {
          window.sendUserMessage(emoji);
        }
      }
    });
  }

  // ---------- 3) Chat store + compaction ----------
  const ChatStore = {
    key: 'uno:chat:v2',
    memKey: 'uno:chat:mem',
    maxPairs: 12,
    maxChars: 100000,
    load(){ return LS.get(this.key, []); },
    save(list){ LS.set(this.key, list||[]); },
    memory(){ return LS.get(this.memKey, ''); },
    setMemory(text){ LS.set(this.memKey, String(text||'')); },
    append(role, content){
      const list = this.load();
      list.push({ role, content: String(content||''), ts: Date.now() });
      this.save(list);
      this.compact();
    },
    clear(){ LS.set(this.key, []); LS.set(this.memKey, ''); },
    compact(){
      try {
        let list = this.load();
        const textLen = list.map(x => x.content||'').join('\n').length;
        if (list.length > 120 || textLen > this.maxChars) {
          const keep = list.filter(m => m.role === 'user' || m.role === 'assistant');
          // Keep last N pairs, summarize the rest
          const cutoffIndex = Math.max(0, keep.length - (this.maxPairs*2));
          const older = keep.slice(0, cutoffIndex);
          const newer = keep.slice(cutoffIndex);
          const summary = this.naiveSummarize(older);
          this.setMemory(summary);
          // Rebuild list with summary marker + newer
          const rebuilt = [];
          if (summary) rebuilt.push({ role: 'system', content: 'Contexto resumido: ' + summary, ts: Date.now() });
          newer.forEach(m => rebuilt.push(m));
          this.save(rebuilt);
        }
      } catch (e) {}
    },
    naiveSummarize(msgs){
      if (!Array.isArray(msgs) || !msgs.length) return '';
      const lines = [];
      let count = 0;
      for (const m of msgs) {
        const role = m.role === 'assistant' ? 'IA' : (m.role === 'user' ? 'Você' : m.role);
        const t = String(m.content||'').replace(/\s+/g,' ').trim();
        if (!t) continue;
        const first = t.split(/[.!?]/)[0];
        if (first) {
          lines.push('• ' + role + ': ' + first.slice(0, 160));
          count += first.length;
        }
        if (count > 1200) break;
      }
      return lines.join('\n');
    },
    buildMessages(userContent){
      // System directives to enforce 3 blocks.
      const sys = {
        role: 'system',
        content: [
          'Você é um assistente em português.',
          'Estruture SEMPRE a resposta em 3 blocos, com estes títulos exatos:',
          '### Recompensa Inicial',
          '### Curiosidade & Expansão',
          '### Antecipação Vibracional',
          'Cada bloco pode conter HTML simples seguro (sem scripts).'
        ].join(' ')
      };
      const memory = this.memory();
      const memMsg = memory ? { role: 'system', content: 'Contexto resumido (memória):\n' + memory } : null;
      const prev = this.load().filter(m => m.role === 'user' || m.role === 'assistant');
      // Keep last pairs
      const sliceStart = Math.max(0, prev.length - (this.maxPairs*2));
      const context = prev.slice(sliceStart);
      const msgs = [sys];
      if (memMsg) msgs.push(memMsg);
      context.forEach(m => msgs.push({ role: m.role === 'assistant' ? 'assistant' : 'user', content: m.content }));
      msgs.push({ role: 'user', content: userContent });
      return msgs;
    }
  };
  window.ChatStore = ChatStore;

  // ---------- 4) Render expandable 3-block reply with optional HTML ----------
  function extractHTMLFromFences(text){
    const m = /```html\s*([\s\S]*?)\s*```/i.exec(text||'');
    return m ? m[1] : null;
  }
  function splitIntoBlocks(raw){
    const t = String(raw||'');
    const re1 = /###\s*Recompensa\s*Inicial[\s\S]*?(?=###\s*Curiosidade\s*&\s*Expans[aã]o|$)/i;
    const re2 = /###\s*Curiosidade\s*&\s*Expans[aã]o[\s\S]*?(?=###\s*Antecip[aã]o\s*Vibracional|$)/i;
    const re3 = /###\s*Antecip[aã]o\s*Vibracional[\s\S]*/i;
    const b1 = (t.match(re1)||[''])[0].replace(/###.*?\n?/,'').trim();
    const b2 = (t.match(re2)||[''])[0].replace(/###.*?\n?/,'').trim();
    const b3 = (t.match(re3)||[''])[0].replace(/###.*?\n?/,'').trim();
    if (b1 || b2 || b3) return { reward:b1, curious:b2, vibe:b3 };
    // Fallback: split roughly
    const parts = t.split(/\n\n+/);
    const n = parts.length;
    const reward = parts.slice(0, Math.max(1, Math.ceil(n*0.3))).join('\n\n');
    const curious = parts.slice(Math.max(1, Math.ceil(n*0.3)), Math.max(2, Math.ceil(n*0.7))).join('\n\n');
    const vibe = parts.slice(Math.max(2, Math.ceil(n*0.7))).join('\n\n');
    return { reward, curious, vibe };
  }
  function paraToHTML(s){
    const esc = s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
    return esc.split(/\n{2,}/).map(p => '<p>'+p.replace(/\n/g,'<br>')+'</p>').join('');
  }
  function createBlockEl(title, content){
    const details = document.createElement('details');
    details.className = 'ai-block';
    const summary = document.createElement('summary');
    summary.innerHTML = title;
    const body = document.createElement('div');
    body.className = 'block-body';
    // If fenced HTML present, render sanitized HTML
    const fenced = extractHTMLFromFences(content||'');
    if (fenced) {
      const safe = sanitizeHTML(fenced);
      body.innerHTML = '<div class="render-html">'+ safe +'</div>';
    } else if (/<[a-z][\s\S]*>/i.test(content||'')) {
      body.innerHTML = '<div class="render-html">'+ sanitizeHTML(content) +'</div>';
    } else {
      body.innerHTML = paraToHTML(content||'');
    }
    details.appendChild(summary);
    details.appendChild(body);
    return details;
  }
  function renderAssistantReply(raw){
    const feed = document.getElementById('chatFeed');
    if (!feed) return;
    const { reward, curious, vibe } = splitIntoBlocks(raw||'');
    const wrap = document.createElement('div');
    wrap.className = 'msg ai ai-rich';
    // Build the three blocks
    const b1 = createBlockEl('1) <strong>Recompensa Inicial</strong> ⚡', reward||'');
    const b2 = createBlockEl('2) <strong>Curiosidade &amp; Expansão</strong> 🔎', curious||'');
    const b3 = createBlockEl('3) <strong>Antecipação Vibracional</strong> ✨', vibe||'');
    // Open first block by default
    b1.open = true;
    wrap.appendChild(b1);
    wrap.appendChild(b2);
    wrap.appendChild(b3);
    // Extract emojis to suggestion row
    const ems = (raw||'').match(/([\p{Extended_Pictographic}\u2600-\u27BF])/gu) || [];
    const uniq = Array.from(new Set(ems)).slice(0,8);
    if (uniq.length) {
      const sug = document.createElement('div');
      sug.className = 'emoji-suggestions';
      uniq.forEach(e => {
        const btn = document.createElement('button');
        btn.className = 'emoji-btn';
        btn.textContent = e;
        btn.setAttribute('data-emoji', e);
        sug.appendChild(btn);
      });
      wrap.appendChild(sug);
    }
    feed.appendChild(wrap);
    wrapEmojisInEl(wrap);
    feed.scrollTop = feed.scrollHeight;
    // Update preview and voice (speak only the reward block text stripped)
    try {
      const txt = (reward||'').replace(/<[^>]*>/g,'').replace(/```[\s\S]*?```/g,'').trim();
      if (typeof updatePreview === 'function') updatePreview(txt || (raw||'').slice(0,180));
      if (typeof speakWithActiveArch === 'function' && txt) speakWithActiveArch(txt);
    } catch{}
    // Save to chat store
    try { if (!window.__RESTORING_CHAT) ChatStore.append('assistant', raw||''); } catch{}
  }
  window.renderAssistantReply = renderAssistantReply;

  // ---------- 5) Unified sendUserMessage ----------
  async function sendUserMessage(msg){
    const text = String(msg||'').trim();
    if (!text) return;
    // Show in feeds + voice status
    if (typeof feedPush === 'function') feedPush('user', 'Você: ' + text);
    try {
      if (typeof showArchMessage === 'function') showArchMessage('Pulso enviado. Recebendo intenção…', 'ok');
      if (typeof speakWithActiveArch === 'function') {
        speakWithActiveArch('Pulso enviado');
        setTimeout(()=>speakWithActiveArch('Recebendo intenção'), 380);
      }
    } catch{}
    if (typeof feedPush === 'function') feedPush('status', '⚡ Pulso enviado · recebendo intenção…');
    try { ChatStore.append('user', text); } catch{}
    // Build OpenRouter call
    const userName = (localStorage.getItem('dual.name') || localStorage.getItem('infodose:userName') || '').trim();
    const sk = (localStorage.getItem('dual.keys.openrouter') || localStorage.getItem('infodose:sk') || '').trim();
    let model = (window.LS && LS.get && LS.get('dual.openrouter.model')) || (localStorage.getItem('infodose:model') || '').trim() || 'openrouter/auto';
    // Call
    try {
      const reply = await sendAIMessageCtx({ userContent: text, sk, model });
      if (reply) {
        renderAssistantReply(reply);
      }
    } catch (err) {
      console.error(err);
      if (typeof feedPush === 'function') feedPush('status', '❌ Erro ao obter resposta.');
    }
  }
  window.sendUserMessage = sendUserMessage;

  // ---------- 6) Override/extend existing functions non-intrusively ----------
  // a) StartSpeech: override to route to sendUserMessage()
  if (typeof startSpeechConversation === 'function') {
    window._startSpeechConversationOrig = startSpeechConversation;
  }
  window.startSpeechConversation = function(userName, sk, model){
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      try { showArchMessage('Reconhecimento de fala não suportado neste navegador.', 'err'); } catch {}
      try { feedPush('status', '❌ Reconhecimento de fala não suportado.'); } catch {}
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = 'pt-BR';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onstart = () => {
      try { showArchMessage('Estou ouvindo…', 'ok'); } catch {}
      try { feedPush('status', '🎙️ Ouvindo…'); } catch {}
    };
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript.trim();
      if (transcript) sendUserMessage(transcript);
    };
    recognition.onerror = (e) => {
      console.error('Erro no reconhecimento de fala:', e);
      try { showArchMessage('Erro no reconhecimento de fala.', 'err'); } catch {}
      try { feedPush('status', '❌ Erro no reconhecimento de fala.'); } catch {}
    };
    recognition.start();
  };

  // b) Override sendAIMessage to support full context + 3-block instruction
  if (typeof sendAIMessage === 'function') window._sendAIMessageOrig = sendAIMessage;
  async function sendAIMessageCtx({ userContent, sk, model }){
    const url = 'https://openrouter.ai/api/v1/chat/completions';
    const messages = ChatStore.buildMessages(userContent);
    const payload = {
      model: model,
      messages: messages,
      max_tokens: 600,
      temperature: 0.7
    };
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sk}`
      },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('Erro na API: ' + res.status);
    const data = await res.json();
    const reply = data && data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content;
    return reply || '';
  }
  window.sendAIMessageCtx = sendAIMessageCtx;
  window.sendAIMessage = async function(content, sk, model){
    return sendAIMessageCtx({ userContent: content, sk, model });
  };

  // c) Wrap openApp to speak app title on open
  if (typeof openApp === 'function') {
    const _openApp = openApp;
    window.openApp = function(a){
      try {
        if (typeof speakWithActiveArch === 'function') speakWithActiveArch('Abrindo ' + (a && (a.title||'app')));
      } catch{}
      return _openApp(a);
    }
  }

  // d) Force app card titles to 2 words + ellipsis (post-render safety)
  if (typeof cardApp === 'function') {
    const _cardApp = cardApp;
    window.cardApp = function(a){
      const el = _cardApp(a);
      try {
        const fullTitle = String(a.title || a.key || '').trim();
        const words = fullTitle.split(/\s+/);
        const two = words.slice(0,2).join(' ');
        const display = words.length > 2 ? two + '…' : two;
        const tEl = el.querySelector('.app-title');
        if (tEl) { tEl.textContent = display || fullTitle; tEl.title = fullTitle; }
      } catch{}
      return el;
    }
  }

  // e) Feed autosave: patch feedPush/chatPush to store messages (without breaking UI)
  const _feedPush = (typeof feedPush === 'function') ? feedPush : null;
  window.feedPush = function(type, text){
    if (_feedPush) _feedPush(type, text);
    try {
      if (type === 'user') {
        const t = String(text||'').replace(/^Você:\s*/i,'');
        ChatStore.append('user', t);
      } else if (type === 'ai') {
        const t = String(text||'').replace(/^[^:]+:\s*/i,'');
        ChatStore.append('assistant', t);
      }
    } catch {}
  };
  if (typeof chatPush === 'function') {
    const _chatPush = chatPush;
    window.chatPush = function(type, text){
      _chatPush(type, text);
      try {
        if (type === 'user') {
          const t = String(text||'').replace(/^Você:\s*/i,'');
          ChatStore.append('user', t);
        } else if (type === 'ai') {
          const t = String(text||'').replace(/^[^:]+:\s*/i,'');
          ChatStore.append('assistant', t);
        }
      } catch {}
    }
  }

  // ---------- 7) Restore chat on load ----------
  document.addEventListener('DOMContentLoaded', () => {
    try {
      window.__RESTORING_CHAT = true;
      const list = ChatStore.load();
      if (!list || !list.length) return;
      const feed = document.getElementById('chatFeed');
      if (!feed) return;
      list.forEach(m => {
        if (m.role === 'assistant') {
          // Render as blocks if possible
          window.renderAssistantReply(m.content);
        } else if (m.role === 'user') {
          const div = document.createElement('div');
          div.className = 'msg user';
          div.textContent = 'Você: ' + (m.content||'');
          feed.appendChild(div);
        }
      });
      feed.scrollTop = feed.scrollHeight;
      window.__RESTORING_CHAT = false;
    } catch (e) { console.warn('Restore chat failed', e); window.__RESTORING_CHAT = false; }
  });

  // ---------- 8) Intercept home input form submit (capture) to route to sendUserMessage ----------
  document.addEventListener('DOMContentLoaded', () => {
    const hiForm = document.getElementById('homeInputForm');
    const hiInput = document.getElementById('homeInput');
    if (hiForm && hiInput) {
      hiForm.addEventListener('submit', (ev) => {
        ev.preventDefault();
        ev.stopPropagation();
        ev.stopImmediatePropagation();
        const msg = (hiInput.value || '').trim();
        if (msg) window.sendUserMessage(msg);
        hiInput.value = '';
        return false;
      }, true); // capture to preempt previous handler
    }
  });

})(); // end ChatPlus

/* ===== patch-visual-presets.js ===== */
(function(){
  // Helpers
  const $ = (q, r = document) => r.querySelector(q);
  const LS = {
    get: (k, d) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d } catch (e) { return d } },
    set: (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)) } catch (e) {} }
  };

  // Inject "Blue‑1" into theme select if missing
  document.addEventListener('DOMContentLoaded', function(){
    try {
      const sel = document.getElementById('themeSelect');
      if (sel && !Array.from(sel.options).some(o => o.value === 'blue1')) {
        const opt = document.createElement('option');
        opt.value = 'blue1'; opt.textContent = 'Blue‑1 (azul)';
        sel.appendChild(opt);
      }
    } catch(e){}
  });

  // Build and inject a Visual & 3D card into Brain view (non-destructive)
  document.addEventListener('DOMContentLoaded', function(){
    const grid = document.querySelector('#v-brain .grid');
    if (!grid) return;
    const panel = document.createElement('div');
    panel.className = 'card fx-trans fx-lift';
    panel.style.display = 'block';
    panel.innerHTML = `
      <div style="font-weight:800">Visual & 3D (presets)</div>
      <div style="margin-top:8px;display:grid;gap:10px">
        <label style="display:flex;align-items:center;gap:8px">
          <span>Preset:</span>
          <select id="visualPreset" class="input ring" style="max-width:260px">
            <option value="blue1">Blue‑1 (shader)</option>
            <option value="strong">Strong</option>
            <option value="cinematic-soft">Cinematic Soft</option>
          </select>
        </label>
        <label style="display:flex;align-items:center;gap:8px">
          <input id="overlayToggle" type="checkbox" />
          <span>Overlay de cor por arquétipo</span>
        </label>
        <label style="display:flex;align-items:center;gap:8px">
          <input id="bloomToggle" type="checkbox" />
          <span>Bloom fotográfico (post)</span>
        </label>
        <label style="display:flex;align-items:center;gap:8px">
          <span>Glow/Toon:</span>
          <input id="glowRange" type="range" min="0" max="1" step="0.05" style="flex:1" />
          <span id="glowVal" class="mut" style="width:42px;text-align:right">0.80</span>
        </label>
        <div style="display:flex;gap:8px;flex-wrap:wrap">
          <button id="applyVisual" class="btn prime fx-trans fx-press ring">Aplicar<span class="ripple"></span></button>
          <button id="resetVisual" class="btn fx-trans fx-press ring">Padrão<span class="ripple"></span></button>
        </div>
        <div class="mut" style="font-size:11px">
          As preferências são salvas no seu navegador e enviadas ao arquétipo ativo.
        </div>
      </div>
    `;
    grid.appendChild(panel);

    // Defaults
    const defaults = {
      preset: LS.get('arch:visualPreset', 'blue1'),
      overlayOn: LS.get('arch:overlayOn', false),
      bloomOn: LS.get('arch:bloomOn', false),
      glow: LS.get('arch:glowStrength', 0.80)
    };

    // UI references
    const selPreset = $('#visualPreset', panel);
    const chkOverlay = $('#overlayToggle', panel);
    const chkBloom = $('#bloomToggle', panel);
    const rngGlow = $('#glowRange', panel);
    const spnGlow = $('#glowVal', panel);
    const btnApply = $('#applyVisual', panel);
    const btnReset = $('#resetVisual', panel);

    // Populate
    selPreset.value = defaults.preset;
    chkOverlay.checked = !!defaults.overlayOn;
    chkBloom.checked = !!defaults.bloomOn;
    rngGlow.value = defaults.glow;
    spnGlow.textContent = Number(defaults.glow).toFixed(2);

    rngGlow.addEventListener('input', () => { spnGlow.textContent = Number(rngGlow.value).toFixed(2); });

    function saveAndApply(){
      const state = {
        preset: selPreset.value,
        overlayOn: !!chkOverlay.checked,
        bloomOn: !!chkBloom.checked,
        glow: Number(rngGlow.value)
      };
      LS.set('arch:visualPreset', state.preset);
      LS.set('arch:overlayOn', state.overlayOn);
      LS.set('arch:bloomOn', state.bloomOn);
      LS.set('arch:glowStrength', state.glow);
      // Update overlay color right away
      try {
        const sel = document.getElementById('arch-select');
        const base = (sel?.value || '').replace(/\.html$/i, '');
        if (window.applyArchOverlay) window.applyArchOverlay(base);
      } catch(e){}
      // Send to iframe
      try { sendVisualSettingsToFrame(); } catch(e){}
    }

    btnApply.addEventListener('click', saveAndApply);
    btnReset.addEventListener('click', () => {
      selPreset.value = 'blue1';
      chkOverlay.checked = false;
      chkBloom.checked = false;
      rngGlow.value = 0.80;
      spnGlow.textContent = '0.80';
      saveAndApply();
    });
  });

  // Canonical overlay colors for the 12 archetypes
  const ARCH_OVERLAYS_PATCHED = {
    atlas:  'rgba(64,158,255,0.22)',
    nova:   'rgba(255,82,177,0.22)',
    vitalis:'rgba(87,207,112,0.22)',
    pulse:  'rgba(0,191,255,0.22)',
    artemis:'rgba(255,195,0,0.22)',
    serena: 'rgba(186,130,219,0.22)',
    kaos:   'rgba(255,77,109,0.22)',
    genus:  'rgba(87,207,112,0.22)',
    lumine: 'rgba(255,213,79,0.22)',
    solus:  'rgba(186,130,219,0.22)',
    rhea:   'rgba(0,209,178,0.22)',
    aion:   'rgba(255,159,67,0.22)',
    default:'rgba(255,255,255,0.0)'
  };

  // Override applyArchOverlay to honor overlay toggle
  (function overrideApplyArchOverlay(){
    const LSget = (k,d)=>{ try{ const v = localStorage.getItem(k); return v?JSON.parse(v):d }catch(e){ return d } };
    window.applyArchOverlay = function(name){
      const key = (name || '').toLowerCase();
      const on = !!LSget('arch:overlayOn', true);
      const color = on ? (ARCH_OVERLAYS_PATCHED[key] || ARCH_OVERLAYS_PATCHED.default) : 'rgba(0,0,0,0)';
      document.documentElement.style.setProperty('--arch-overlay', color);
    };
    // Apply once at startup for current selection
    document.addEventListener('DOMContentLoaded', function(){
      const sel = document.getElementById('arch-select');
      const base = (sel?.value || '').replace(/\.html$/i, '');
      window.applyArchOverlay(base);
    });
  })();

  // PostMessage: send visual settings to archetype iframe
  function currentVisualSettings(){
    const LSget = (k,d)=>{ try{ const v = localStorage.getItem(k); return v?JSON.parse(v):d }catch(e){ return d } };
    return {
      preset: LSget('arch:visualPreset','blue1'),
      bloom: !!LSget('arch:bloomOn', false),
      glow: Number(LSget('arch:glowStrength', 0.80)),
      overlayOn: !!LSget('arch:overlayOn', true)
    };
  }
  window.sendVisualSettingsToFrame = function(){
    try {
      const f = document.getElementById('arch-frame');
      if (f && f.contentWindow) {
        f.contentWindow.postMessage({ type:'visualSettings', data: currentVisualSettings() }, '*');
      }
    } catch(e){}
  };

  // Send settings whenever the iframe loads or signals readiness
  document.addEventListener('DOMContentLoaded', function(){
    const f = document.getElementById('arch-frame');
    if (f) {
      f.addEventListener('load', () => { try { sendVisualSettingsToFrame(); } catch(e){} });
      // small delay to ensure child is ready
      setTimeout(() => { try { sendVisualSettingsToFrame(); } catch(e){} }, 800);
    }
  });
  window.addEventListener('message', (ev) => {
    const msg = ev?.data || {};
    if (msg && msg.type === 'archReady') {
      try { sendVisualSettingsToFrame(); } catch(e){}
    }
  });

})();

/* ===== ls-panel-js.js ===== */
(() => {
  const $ = (s, r=document)=> r.querySelector(s);
  const $$ = (s, r=document)=> Array.from(r.querySelectorAll(s));
  const prettyBytes = (n)=>{ if(!Number.isFinite(n)||n<=0) return '0 B'; const u=['B','KB','MB','GB']; let i=0; while(n>=1024&&i<u.length-1){n/=1024;i++} return n.toFixed(2)+' '+u[i] };
  const isJson = (v)=>{ try{ JSON.parse(v); return true; }catch{ return false; } };
  const inferType = (v)=>{
    if(v==null||v==='') return 'empty';
    if(isJson(v)){const p=JSON.parse(v); if(Array.isArray(p)) return 'json[array]'; if(p&&typeof p==='object') return 'json[object]'; return 'json['+(typeof p)+']';}
    if(/^data:image\//i.test(v)||/\.(png|jpe?g|gif|webp|svg)(\?|$)/i.test(v)) return 'image';
    if(/^(true|false|1|0)$/i.test(v)) return 'boolean-like';
    if(/^https?:\/\//i.test(v)) return 'url';
    if(/^data:/i.test(v)) return 'data-url';
    return 'string';
  };

  const DISABLED_KEY = 'infodose:presets.disabled';
  const PRESETS = [
    { key:'infodose:userName', label:'Usuário' },
    { key:'infodose:assistantName', label:'Assistente' },
    { key:'dual.keys.openrouter', label:'Chave OpenRouter (ativa)' },
    { key:'dual.openrouter.model', label:'Modelo OpenRouter' },
    { key:'uno:theme', label:'Tema' },
    { key:'uno:bg', label:'Fundo Custom' },
    { key:'infodose:cssCustom', label:'CSS Custom' },
    { key:'infodose:voices', label:'Vozes Arquetípicas' }
  ];

  const disabledSet = ()=> { try{ return new Set(JSON.parse(localStorage.getItem(DISABLED_KEY)||'[]')); }catch{ return new Set(); } };
  const saveDisabled = (set)=> localStorage.setItem(DISABLED_KEY, JSON.stringify(Array.from(set)));
  const isEnabled = (k)=> !disabledSet().has(k);
  const toggleDisabled = (k)=> { const s=disabledSet(); s.has(k)?s.delete(k):s.add(k); saveDisabled(s); renderAll(); window.dispatchEvent(new CustomEvent('ls:disabled-changed',{detail:{key:k,disabled:s.has(k)}})); };

  // Carteira SK
  const WALLET_KEY = 'dual.keys.wallet';
  const getWallet = ()=>{ try{ return JSON.parse(localStorage.getItem(WALLET_KEY)||'[]'); }catch{return []} };
  const setWallet = (arr)=> localStorage.setItem(WALLET_KEY, JSON.stringify(arr));
  const addWalletItem = (name, key)=>{
    const list=getWallet();
    const genId = (crypto?.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2));
    list.push({ id: genId, name, key, active:false });
    setWallet(list); renderWallet();
  };
  const removeWalletItem = (id)=>{ const list=getWallet().filter(x=>x.id!==id); setWallet(list); ensureActiveConsistency(); renderWallet(); };
  const activateWalletItem = (id)=>{
    const list=getWallet().map(x=>({...x, active: x.id===id})); setWallet(list);
    if(isEnabled('dual.keys.openrouter')){
      const chosen=list.find(x=>x.active); localStorage.setItem('dual.keys.openrouter', chosen? chosen.key: '');
    }
    renderAll();
  };
  
  // LS
  const lsEntries = ()=>{ const out=[]; for(let i=0;i<localStorage.length;i++){ const k=localStorage.key(i); const v=localStorage.getItem(k)||''; out.push({key:k,val:v}); } return out.sort((a,b)=>a.key.localeCompare(b.key)); };
  const lsSizeBytes = ()=>{ let sum=0; for(let i=0;i<localStorage.length;i++){ const k=localStorage.key(i); const v=localStorage.getItem(k)||''; sum += k.length + v.length; } return sum; };

  const renderPresets = ()=>{
    const grid=$('#presetsGrid'); if(!grid) return; grid.innerHTML='';
    const dis=disabledSet();
    PRESETS.forEach(p=>{
      const val=localStorage.getItem(p.key); const on=!dis.has(p.key);
      const wrap=document.createElement('div'); wrap.className='preset';
      const head=document.createElement('div'); head.className='row';
      const name=document.createElement('div'); name.innerHTML = `<strong>${p.label}</strong><div class="type">${p.key}</div>`;
      const sw=document.createElement('div'); sw.className='switch'+(on?' on':''); sw.title=on?'Desativar (não apaga)':'Ativar'; sw.onclick=()=>toggleDisabled(p.key);
      head.append(name,sw);
      const meta=document.createElement('div'); meta.className='val';
      meta.textContent = val ? (inferType(val).startsWith('json')? JSON.stringify(JSON.parse(val),null,2): val) : '—';
      wrap.append(head,meta); grid.append(wrap);
    });
  };

  const addImagePreview = (key,src)=>{ const g=$('#imgGrid'); if(!g) return; const card=document.createElement('div'); card.className='img-card'; const cap=document.createElement('div'); cap.className='meta'; cap.textContent=key; const im=new Image(); im.src=src; im.loading='lazy'; card.append(cap,im); g.append(card); };

  const renderLS = ()=>{
    const list=$('#lsList'); if(!list) return; list.innerHTML=''; const imgGrid=$('#imgGrid'); if(imgGrid) imgGrid.innerHTML='';
    const entries=lsEntries(); const count=$('#lsCount'); if(count) count.textContent = entries.length+' chave(s)';
    const size=$('#lsSize'); if(size) size.textContent = prettyBytes(lsSizeBytes());
    const dis=disabledSet();
    entries.forEach(({key,val})=>{
      if(key===DISABLED_KEY) return;
      const it=document.createElement('div'); it.className='item';
      const head=document.createElement('div'); head.className='head';
      const left=document.createElement('div');
      left.innerHTML=`<div class="key">${key}${dis.has(key)?' <span class="type">(desativado)</span>':''}</div><div class="type">${inferType(val)} • ${prettyBytes((val||'').length)}</div>`;
      const ctr=document.createElement('div'); ctr.style.display='flex'; ctr.style.gap='8px'; ctr.style.flexWrap='wrap';
      const sw=document.createElement('div'); sw.className='switch'+(!dis.has(key)?' on':''); sw.title = (!dis.has(key)?'Desativar':'Ativar'); sw.onclick=()=>toggleDisabled(key);
      const bEdit=document.createElement('button'); bEdit.textContent='Editar'; bEdit.onclick=()=>{ const next=prompt('Editar valor de\n'+key, val ?? ''); if(next==null) return; localStorage.setItem(key,String(next)); renderAll(); };
      const bDel=document.createElement('button'); bDel.textContent='Apagar'; bDel.onclick=()=>{ if(confirm('Apagar '+key+'?')){ localStorage.removeItem(key); renderAll(); } };
      if(inferType(val)==='image'){ const bImg=document.createElement('button'); bImg.textContent='Ver imagem'; bImg.onclick=()=>addImagePreview(key,val); ctr.append(bImg); }
      ctr.append(sw,bEdit,bDel); head.append(left,ctr);
      const v=document.createElement('div'); v.className='val'; v.textContent = inferType(val).startsWith('json')? JSON.stringify(JSON.parse(val),null,2): (val??'—');
      it.append(head,v); list.append(it);
    });
  };

  const exportLS = ()=>{ const dump={}; for(let i=0;i<localStorage.length;i++){ const k=localStorage.key(i); if(k===DISABLED_KEY) continue; dump[k]=localStorage.getItem(k); } const blob=new Blob([JSON.stringify(dump,null,2)],{type:'application/json'}); const url=URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download='localstorage_export.json'; a.click(); setTimeout(()=>URL.revokeObjectURL(url), 2000); };
  const importLS = (file)=>{ const r=new FileReader(); r.onload=()=>{ try{ const data=JSON.parse(r.result||'{}'); Object.entries(data).forEach(([k,v])=>localStorage.setItem(k,String(v))); alert('Importado com sucesso.'); renderAll(); }catch(e){ alert('JSON inválido.'); } }; r.readAsText(file); };

  const openLS = ()=>{ const m=$('#lsModal'); if(!m) return; m.classList.add('open'); m.setAttribute('aria-hidden','false'); renderAll(); renderWallet(); };
  const closeLS = ()=>{ const m=$('#lsModal'); if(!m) return; m.classList.remove('open'); m.setAttribute('aria-hidden','true'); };
  const renderAll = ()=>{ renderPresets(); renderLS(); };

  const ready = () => {
    // Unify LS button (clone -> only our modal)
    const btn = document.getElementById('btnLS');
    if(btn && !btn.dataset._lsUnified){
      const c=btn.cloneNode(true);
      c.removeAttribute('onclick'); c.removeAttribute('href');
      c.dataset._lsUnified='1';
      c.addEventListener('click', (ev)=>{
        ev.preventDefault(); ev.stopPropagation();
        try{
          document.querySelectorAll('.modal,[role="dialog"],[class*="modal"]').forEach(el=>{ if(el.id!=='lsModal'){ el.style.display='none'; el.classList.remove('open','show','visible'); el.setAttribute('aria-hidden','true'); } });
        }catch(e){}
        openLS();
      }, {passive:false});
      btn.parentNode.replaceChild(c, btn);
    }

    const c = $('#lsClose'); if(c) c.onclick = closeLS;
    const r = $('#lsRescan'); if(r) r.onclick = renderAll;
    const e = $('#lsExport'); if(e) e.onclick = exportLS;
    const imp = $('#lsImportFile'); if(imp) imp.addEventListener('change', ev=>{ const f=ev.target.files?.[0]; if(f) importLS(f); ev.target.value=''; });
    const clr = $('#lsClearDisabled'); if(clr) clr.onclick = ()=>{ localStorage.setItem(DISABLED_KEY,'[]'); renderAll(); };

    const modal = $('#lsModal'); if(modal) modal.addEventListener('click', (evt)=>{ if(evt.target===modal) closeLS(); });
    const skAdd = $('#skAdd'); if(skAdd) skAdd.onclick = ()=>{ const name=$('#skName').value.trim(); const key=$('#skValue').value.trim(); if(!name||!key) return alert('Informe nome e chave.'); addWalletItem(name,key); $('#skName').value=''; $('#skValue').value=''; };

    // Overlay control in LS
    const KEY='infodose:arch.overlay.level';
    const LEVELS={"0":"16%","-1":"12%","-2":"8%"};
    const apply=(lvl)=>{
      const force=LEVELS[String(lvl)]||LEVELS["-1"];
      document.documentElement.style.setProperty('--arch-overlay-strength', force);
      if(window.ArchTint&&typeof ArchTint.set==='function'){ try{ ArchTint.set(null, String(lvl)); }catch(e){} }
      document.querySelectorAll('.ls-ov[data-level]').forEach(b=>b.classList.toggle('on', b.dataset.level===String(lvl)));
    };
    const saved=localStorage.getItem(KEY)||"-1";
    apply(saved);
    $$('.ls-ov[data-level]').forEach(b=> b.addEventListener('click',()=>{ const lvl=b.dataset.level; localStorage.setItem(KEY, String(lvl)); apply(lvl); }, {passive:true}));
  };
  if(document.readyState === 'loading'){ document.addEventListener('DOMContentLoaded', ready); } else { ready(); }

  window.DualLS = { open: openLS, close: closeLS, render: renderAll };
})();

/* ===== ls-snpt-boot.js ===== */
(function(){
  function ensure(){
    if(document.getElementById('ls-panel-js') || document.getElementById('lsModal')) return;
    fetch('lspanel.snpt', {cache:'no-store'}).then(r => r.ok ? r.text(): null).then(txt => {
      if(!txt) return;
      document.body.insertAdjacentHTML('beforeend', txt);
      setTimeout(function(){
        try{
          if(window.DualLS && typeof window.DualLS.render==='function'){ window.DualLS.render(); }
        }catch(e){}
      }, 50);
    }).catch(()=>{});
  }
  if(document.readyState==='loading'){ document.addEventListener('DOMContentLoaded', ensure); } else { ensure(); }
})();

/* ===== ls-sanitize-old-js.js ===== */
(function(){
  // Remove apenas ids legados conhecidos, preservando #lsModal e #lsPanel
  const LEGACY = [
    'modalLS','localStorageModal','lsWindow','lsPopup','modal-localstorage',
    'local-storage-modal','ls-modal-old','oldLsModal','modalLocalStorage','modal-ls'
  ];
  function clean(){
    try{
      LEGACY.forEach(id => {
        const el = document.getElementById(id);
        if(el) el.remove();
      });
      // Opcional: fecha modais legados que venham com classes genéricas
      document.querySelectorAll('.modal,[role="dialog"]').forEach(el=>{
        if(el.id && (el.id==='lsModal' || el.id==='lsPanel')) return;
        if(el.closest('#lsModal')) return;
        if(/localstorage|modal-ls|ls-?old/i.test(el.id||'') || /localstorage/i.test(el.className||'')){
          el.remove();
        }
      });
    }catch(e){}
  }
  if(document.readyState==='loading'){ document.addEventListener('DOMContentLoaded', clean); } else { clean(); }
})();

/* ===== arch-init-nonatlas.js ===== */
(function(){
  function initArchSelect(){
    var sel=document.getElementById('arch-select'); if(!sel) return;
    var saved=(localStorage.getItem('uno:arch')||localStorage.getItem('infodose:arch')||'').replace(/\.html$/i,'');
    var idx=-1;
    for(var i=0;i<sel.options.length;i++){
      var v=sel.options[i].value.replace(/\.html$/i,'');
      if(saved && v===saved){ idx=i; break; }
    }
    sel.selectedIndex = idx; // -1 = nenhum, evita default 'atlas'
  }
  if(document.readyState==='loading'){ document.addEventListener('DOMContentLoaded', initArchSelect); } else { initArchSelect(); }
})();

/* ===== overlay-hardlock.js ===== */
(function () {
  const LSget = (k,d)=>{ try{ const v=localStorage.getItem(k); return v?JSON.parse(v):d }catch(e){ return d } };

  function setOverlayTransparent(){
    try{
      document.documentElement.style.setProperty('--arch-overlay','rgba(0,0,0,0)');
      document.documentElement.style.setProperty('--arch-overlay-strength','0%');
    }catch(e){}
  }

  function gateApply(){
    // Re-define applyArchOverlay ALWAYS last so it cannot be overridden later
    window.applyArchOverlay = function(name){
      const on = !!LSget('arch:overlayOn', true);
      if(!on){ setOverlayTransparent(); return; }
      const key = (name||'').toLowerCase();
      const MAP = (window.ARCH_OVERLAYS_PATCHED||window.ARCH_OVERLAYS||{default:'rgba(0,0,0,0)'});
      const color = MAP[key] || MAP.default || 'rgba(0,0,0,0)';
      try{
        document.documentElement.style.setProperty('--arch-overlay', color);
        // If some panels manage strength separately, leave current value as-is when ON
      }catch(e){}
    };

    // On load, keep OFF if toggle is OFF
    const sel = document.getElementById('arch-select');
    const base = (sel?.value || '').replace(/\.html$/i,'');
    if(!LSget('arch:overlayOn', true)) setOverlayTransparent(); else window.applyArchOverlay(base);
  }

  if(document.readyState !== 'loading') gateApply();
  else document.addEventListener('DOMContentLoaded', gateApply);
})();

/* ===== bind.js ===== */
(function(){
  function bind(){
    var b = document.getElementById('lsRefresh');
    if(b){ b.onclick = function(){ try{ location.reload(); }catch(e){} }; }
  }
  if(document.readyState === 'loading'){ document.addEventListener('DOMContentLoaded', bind); } else { bind(); }
})();

/* ===== overlay-guardian-js.js ===== */
(function(){
  function readLSBool(key, d){ try{ var v = localStorage.getItem(key); return v ? JSON.parse(v) : d; }catch(e){ return d; } }
  function enforce(){
    var on = !!readLSBool('arch:overlayOn', false);
    document.documentElement.setAttribute('data-overlay', on ? 'on' : 'off');
    if(!on){
      try{
        document.documentElement.style.setProperty('--arch-overlay','rgba(0,0,0,0)');
        document.documentElement.style.setProperty('--arch-overlay-strength','0%');
        var fade = document.getElementById('arch-fadeCover');
        if(fade) fade.style.background = 'transparent';
      }catch(e){}
    }
  }
  function bind(){
    enforce();
    // Poll lightly to defeat late writers
    setInterval(enforce, 500);
    // Also react to storage changes (other tabs)
    window.addEventListener('storage', function(ev){ if(ev && ev.key==='arch:overlayOn'){ enforce(); } });
    // If there is a Brain toggle, hook it
    document.addEventListener('click', function(e){
      var t = e.target;
      if(!t) return;
      if(t.id==='overlayToggle' || t.closest && t.closest('#overlayToggle')){
        setTimeout(enforce, 60);
      }
    }, true);
  }
  if(document.readyState === 'loading'){ document.addEventListener('DOMContentLoaded', bind); } else { bind(); }
})();

/* ===== inline-16.js ===== */
if ('serviceWorker' in navigator) {
  addEventListener('load', ()=>((location.protocol==='https:'||location.protocol==='http:')?navigator.serviceWorker.register:()=>Promise.reject('sw_disabled'))('./sw.js').catch(()=>{}));
}

/* ===== pulsar-no-clique-direto-no-wrap.js ===== */
/* ==========================================================================
   ORB WebGL (shader nebula) + Partículas 2D — escopo HUB
   ========================================================================== */
(function(){
  const canvas = document.getElementById('orb');
  if(!canvas) return;
  const gl = canvas.getContext('webgl', { antialias:true, alpha:true });
  if(!gl) return;

  const dpr = Math.min(2, window.devicePixelRatio||1);
  function resize(){
    const r = canvas.getBoundingClientRect();
    canvas.width = Math.floor(r.width*dpr);
    canvas.height = Math.floor(r.height*dpr);
    gl.viewport(0,0,canvas.width,canvas.height);
  }
  new ResizeObserver(resize).observe(canvas); resize();

  const vs = 'attribute vec2 aPos; varying vec2 vUv; void main(){ vUv=aPos*0.5+0.5; gl_Position=vec4(aPos,0.,1.);}';
  const fs = `precision highp float; varying vec2 vUv; uniform vec2 u_res; uniform float u_time; uniform float u_active;
  float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453123); }
  float noise(vec2 p){ vec2 i=floor(p); vec2 f=fract(p); float a=hash(i);
    float b=hash(i+vec2(1.,0.)); float c=hash(i+vec2(0.,1.)); float d=hash(i+vec2(1.,1.));
    vec2 u=f*f*(3.-2.*f); return mix(a,b,u.x)+(c-a)*u.y*(1.-u.x)+(d-b)*u.x*u.y; }
  vec3 cam(){ return vec3(0.,0.,3.); }
  vec3 getRay(vec2 uv){ uv=(uv*2.-1.); uv.x*=u_res.x/u_res.y; return normalize(vec3(uv,-1.8)); }
  bool isph(vec3 ro, vec3 rd, float r, out float t){
    float b=dot(ro,rd); float c=dot(ro,ro)-r*r; float h=b*b-c; if(h<0.){t=-1.;return false;}
    h=sqrt(h); t=-b-h; if(t<0.) t=-b+h; if(t<0.) return false; return true; }
  void main(){
    vec2 uv=vUv; vec3 ro=cam(); vec3 rd=getRay(uv);
    float t; vec3 col=vec3(0.02,0.03,0.07); vec3 fogCol=vec3(0.07,0.09,0.16);
    float g=noise(uv*6.+u_time*0.05)*0.25; col+=vec3(0.25,0.08,0.55)*g*0.6+vec3(0.0,0.35,0.55)*g*0.4;
    if(isph(ro,rd,1.,t)){
      vec3 p=ro+rd*t; vec3 n=normalize(p);
      float bands=0.5+0.5*sin(6.*p.x+5.*p.y+u_time*0.6);
      float swirl=noise(p.xy*4.+u_time*0.2);
      vec3 A=vec3(0.52,0.24,1.00), B=vec3(0.00,0.90,1.00);
      vec3 base=mix(A,B, clamp(bands*0.6+swirl*0.4,0.,1.));
      vec3 L=normalize(vec3(0.6,0.7,0.5));
      float diff=max(dot(n,L),0.); float rim=pow(1.-max(dot(n,-rd),0.), 2.);
      float pulse=0.5+0.5*sin(u_time*1.5); float act=mix(0.6,1.0,u_active);
      vec3 c=base*(0.35+0.75*diff*act)+(B*0.6+A*0.4)*rim*(0.6+0.4*pulse);
      float fogAmt=1.0-exp(-t*0.35); col=mix(c,fogCol,fogAmt*0.25);
    }else{
      vec2 centered=uv-0.5; centered.x*=u_res.x/u_res.y;
      float d=length(centered); float outer=smoothstep(0.58,0.12,d);
      vec3 halo=vec3(0.25,0.12,0.55)*outer*0.35+vec3(0.00,0.55,0.95)*outer*0.25;
      col+=halo;
    }
    float vign=smoothstep(1.2,0.55, length((uv-0.5)*vec2(u_res.x/u_res.y,1.)));
    col*=vign; gl_FragColor=vec4(col,0.98);
  }`;
  function sh(type,src){ const s=gl.createShader(type); gl.shaderSource(s,src); gl.compileShader(s); return s; }
  const pr=gl.createProgram(); gl.attachShader(pr,sh(gl.VERTEX_SHADER,vs)); gl.attachShader(pr,sh(gl.FRAGMENT_SHADER,fs)); gl.linkProgram(pr); gl.useProgram(pr);
  const buf=gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER,buf); gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1, 1,-1,1,1,-1,1]),gl.STATIC_DRAW);
  const loc=gl.getAttribLocation(pr,'aPos'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc,2,gl.FLOAT,false,0,0);
  const uRes=gl.getUniformLocation(pr,'u_res'); const uTime=gl.getUniformLocation(pr,'u_time'); const uActive=gl.getUniformLocation(pr,'u_active');
  let start=performance.now(), active=0.0;
  function draw(){ const t=(performance.now()-start)*0.001; gl.uniform2f(uRes,canvas.width,canvas.height); gl.uniform1f(uTime,t); gl.uniform1f(uActive,active); gl.drawArrays(gl.TRIANGLES,0,6); requestAnimationFrame(draw) }
  draw();
  window.__orbGL__ = {
    setActive:(v)=>{ active=v?1.0:0.0; },
    pulse:()=>{ let k=0,steps=24; const id=setInterval(()=>{ active=Math.min(1,active+0.06); if(++k>=steps) clearInterval(id);},16);
                setTimeout(()=>{ let j=0; const id2=setInterval(()=>{ active=Math.max(0,active-0.06); if(++j>=steps) clearInterval(id2);},16);},380); }
  };
})();

(function particles2D(){
  const c=document.getElementById('particles'); if(!c) return;
  const ctx=c.getContext('2d'); const dpr=Math.min(2,window.devicePixelRatio||1);
  function rs(){ const r=c.getBoundingClientRect(); c.width=Math.floor(r.width*dpr); c.height=Math.floor(r.height*dpr); }
  new ResizeObserver(rs).observe(c); rs();
  const N=90, nodes=Array.from({length:N},()=>({a:Math.random()*6.283, r:0.42+Math.random()*0.48, s:(0.2+Math.random()*0.7)*(Math.random()<0.5?-1:1), z:0.5+Math.random()*0.5, hue:200+Math.random()*160}));
  function draw(t){ ctx.clearRect(0,0,c.width,c.height); ctx.save(); ctx.globalCompositeOperation='lighter'; ctx.translate(c.width/2,c.height/2); const scale=Math.min(c.width,c.height)/2;
    for(const n of nodes){
      const a=n.a + t*0.00025*n.s, r=n.r + 0.03*Math.sin(t*0.0005+n.a);
      const x=Math.cos(a)*r*scale, y=Math.sin(a)*r*scale;
      const g=ctx.createRadialGradient(x,y,0, x,y, 6 + n.z*8);
      g.addColorStop(0, `hsla(${n.hue}, 85%, 65%, ${0.38*n.z})`);
      g.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle=g; ctx.beginPath(); ctx.arc(x,y, 2.5 + n.z*3.0, 0, Math.PI*2); ctx.fill();
    }
    ctx.restore(); requestAnimationFrame(draw);
  }
  requestAnimationFrame(draw);
})();

// Pulsar no clique direto no wrap
document.getElementById('orbWrap')?.addEventListener('click', function(){ try{ window.__orbGL__ && window.__orbGL__.pulse(); }catch(_){ } });

/* ===== orb-slot-and-archpersist-patch.js ===== */
(function(){
  // ---- Helpers ----
  function $(q, r=document){ return r.querySelector(q); }
  function baseName(file){ return String(file||'').replace(/\.html$/i,'').toLowerCase(); }

  // ---- Create orb-slot and move the iframe inside the orb ----
  function fuseIframeIntoOrb(){
    var wrap = $('#orbWrap');
    var frame = $('#arch-frame');
    if(!wrap || !frame) return;
    // If already fused, skip
    if (frame.parentElement && frame.parentElement.classList && frame.parentElement.classList.contains('orb-slot')) return;
    var slot = document.createElement('div');
    slot.className = 'orb-slot';
    // Insert slot above particles but below ring (order controlled by CSS z-index)
    wrap.appendChild(slot);
    // Move iframe inside slot
    slot.appendChild(frame);
  }

  // ---- Archetype persistence (uno:arch) + overlay/apply + Firestore sync ----
  function currentSelectBase(){
    var sel = $('#arch-select'); if(!sel) return '';
    var opt = sel.options[sel.selectedIndex];
    return baseName(opt && opt.value);
  }
  function applyArch(base){
    var sel = $('#arch-select'), frame = $('#arch-frame'), fade = $('#arch-fadeCover');
    if(!sel || !frame) return;
    var idx = -1;
    for (var i=0;i<sel.options.length;i++){
      if (baseName(sel.options[i].value) === base){ idx = i; break; }
    }
    if (idx >= 0){
      sel.selectedIndex = idx;
      if (fade) fade.classList.add('show');
      var file = sel.options[idx].value;
      frame.src = './archetypes/' + file;
      try { if (typeof window.applyArchOverlay === 'function') window.applyArchOverlay(base); } catch(_){}
      try { if (typeof window.speakArchetype === 'function') window.speakArchetype(base); } catch(_){}
      try { if (typeof window.updateHomeStatus === 'function') window.updateHomeStatus(); } catch(_){}
      setTimeout(function(){ if (fade) fade.classList.remove('show'); }, 240);
    }
  }
  function saveArch(base){
    if(!base) return;
    try { localStorage.setItem('uno:arch', base); } catch(_){}
    // If a shared app state exists, mirror and save remotely
    try {
      if (window.S && S.state){
        S.state.archetype = base;
        if (typeof window.saveState === 'function') saveState(S.state);
      }
    } catch(_){}
  }
  function bindArchPersistence(){
    var sel = $('#arch-select'), prev = $('#arch-prev'), next = $('#arch-next');
    function persist(){ var b=currentSelectBase(); if(b){ saveArch(b);} }
    if (sel) sel.addEventListener('change', persist, {passive:true});
    if (prev) prev.addEventListener('click', function(){ setTimeout(persist, 0); }, {passive:true});
    if (next) next.addEventListener('click', function(){ setTimeout(persist, 0); }, {passive:true});
    // Accept remote notifications
    window.addEventListener('message', function(ev){
      var d = ev && ev.data || {};
      if (d && d.type==='archReady' && d.name){
        var b = baseName(d.name);
        saveArch(b);
      }
    });
  }
  function bootWithSavedArch(){
    var saved = (localStorage.getItem('uno:arch') || localStorage.getItem('infodose:arch') || '').replace(/\.html$/i,'');
    saved = baseName(saved);
    if(saved){
      var cur = currentSelectBase();
      if (cur !== saved) applyArch(saved);
    } else {
      // Initialize with current
      saveArch(currentSelectBase());
    }
  }

  function start(){
    fuseIframeIntoOrb();
    bindArchPersistence();
    bootWithSavedArch();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();

/* ===== arch-chips-3d-layers.js ===== */
// BLOOM TOGGLE: persist in localStorage('dual.ui.bloom'), add button above chips
(function(){ 
  const _bState = (localStorage.getItem('dual.ui.bloom') === '1');
  function sendBloom(enabled){
    try{
      const fr = document.getElementById('arch-frame');
      if(fr && fr.contentWindow) fr.contentWindow.postMessage({ type:'bloomToggle', enabled: !!enabled }, '*');
      // Adjust overlay intensity when bloom enabled
      document.documentElement.style.setProperty('--arch-overlay-intensity', enabled? '0.45' : '0.35');
    }catch(e){}
  }
  // ensure we send initial state on boot after DOM ready
  if (document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', ()=> sendBloom(_bState) );
  } else sendBloom(_bState);
  // expose helper for the chip script to create the button
  window._dual_bloom_state = _bState;
  window._dual_bloom_send = sendBloom;
})();
(function(){
  // Minimal palettes (sync with your overlay colors)
  const COLORS = {
    atlas:'#409EFF', nova:'#FF52B1', vitalis:'#34D399', pulse:'#00BFFF',
    artemis:'#FFC300', serena:'#B684FF', kaos:'#FF4D6D', genus:'#22C55E',
    lumine:'#FFD54F', rhea:'#00D1B2', solus:'#6495ED', aion:'#8B5CF6'
  };
  const PRESET = name => ({
    name,
    color: COLORS[name] || '#88a',
    count: (name==='nova'||name==='pulse'||name==='lumine') ? 340 : 260,
    orbitRadius: (name==='nova'||name==='serena'||name==='lumine') ? 0.76 : 0.68,
    spin: (name==='nova'||name==='pulse') ? 0.7 : 0.56,
    size: 0.010, // sphere size
    glow: 0.42
  });

  const ACTIVE = new Set();
  function sendLayers(){
    const fr = document.getElementById('arch-frame');
    if (!fr || !fr.contentWindow) return;
    const arr = Array.from(ACTIVE).map(n => PRESET(n));
    fr.contentWindow.postMessage({ type:'atomConfigLayers', layers: arr }, '*');
  }

  function chipEl(name){
    const b = document.createElement('button');
    b.className = 'arch-chip';
    b.textContent = name[0].toUpperCase()+name.slice(1);
    b.style.borderColor = 'rgba(255,255,255,.18)';
    b.style.background = 'rgba(255,255,255,.06)';
    b.onclick = ()=>{
      if (ACTIVE.has(name)) ACTIVE.delete(name); else ACTIVE.add(name);
      b.classList.toggle('on', ACTIVE.has(name));
      sendLayers();
    };
    return b;
  }

  function ensureStyles(){
    if (document.getElementById('archChip3DStyles')) return;
    const st = document.createElement('style'); st.id='archChip3DStyles';
    st.textContent = `
      .arch-chip-wrap{ display:grid; grid-template-columns: repeat(auto-fill,minmax(92px,1fr)); gap:8px; }
      .arch-chip{ appearance:none; border:1px solid var(--ring, rgba(255,255,255,.18)); background: var(--glass, rgba(255,255,255,.06)); color: var(--txt, #eaf2ff);
        padding:8px 10px; border-radius:999px; font-size:12px; letter-spacing:.2px; cursor:pointer; }
      .arch-chip.on{ background: rgba(57,255,182,.18); border-color: rgba(57,255,182,.45); }
      .arch-chip-title{ font-size:12px; color: var(--muted,#a6b0c0); margin: 6px 0 6px; font-weight:800; }
    `;
    document.head.appendChild(st);
  }

  function injectInLSPanel(){
    ensureStyles();
    const panel = document.getElementById('lsPanel') || document.querySelector('#lsModal .ls-panel');
    if (!panel || document.getElementById('archChip3DSection')) return;
    const sec = document.createElement('div');
    sec.id = 'archChip3DSection';
    sec.className = 'preset';
    sec.style.marginTop = '10px';
    sec.innerHTML = `<div class="arch-chip-title">Arquétipos (camadas no ORB · 3D)</div>`;
    const wrap = document.createElement('div'); wrap.className = 'arch-chip-wrap';
    ['atlas','nova','vitalis','pulse','artemis','serena','kaos','genus','lumine','rhea','solus','aion'].forEach(n=> wrap.appendChild(chipEl(n)));
    sec.appendChild(wrap);
    // === Bloom toggle (insert above chips) ===
    const bloomWrap = document.createElement('div');
    bloomWrap.style.display = 'flex'; bloomWrap.style.alignItems = 'center'; bloomWrap.style.justifyContent = 'space-between';
    bloomWrap.style.marginBottom = '8px';
    const lbl = document.createElement('div'); lbl.textContent = 'Bloom Nébula'; lbl.className='arch-chip-title'; lbl.style.margin='0'; lbl.style.fontSize='12px';
    const toggle = document.createElement('button'); toggle.id='toggleBloomBtn'; toggle.className='arch-chip'; toggle.style.minWidth='92px';
    const state = (localStorage.getItem('dual.ui.bloom') === '1') || !!window._dual_bloom_state;
    if(state) toggle.classList.add('on');
    toggle.textContent = state ? 'Bloom: ON' : 'Bloom: OFF';
    toggle.onclick = function(){
      const now = !toggle.classList.contains('on');
      toggle.classList.toggle('on', now);
      toggle.textContent = now ? 'Bloom: ON' : 'Bloom: OFF';
      try{ localStorage.setItem('dual.ui.bloom', now? '1':'0'); }catch(_){}
      if (window._dual_bloom_send) window._dual_bloom_send(now);
      // send message to iframe as well for immediate toggle
      try{ const f = document.getElementById('arch-frame'); if(f && f.contentWindow) f.contentWindow.postMessage({ type: 'bloomToggle', enabled: !!now }, '*'); }catch(_){}
    };
    sec.insertBefore(bloomWrap, sec.firstChild);
    bloomWrap.appendChild(lbl);
    bloomWrap.appendChild(toggle);
    
    // Coloca no topo do LS Panel
    const hdr = panel.querySelector('.ls-hdr');
    if (hdr && hdr.parentNode) hdr.parentNode.insertBefore(sec, hdr.nextSibling);
    // Ativa por padrão a camada do arquétipo atual
    try{
      const sel = document.getElementById('arch-select');
      const cur = (sel && sel.value || 'atlas.html').replace(/.*\//,'').replace(/\.html$/i,'');
      const btn = wrap.querySelector('button.arch-chip:nth-child(' + (['atlas','nova','vitalis','pulse','artemis','serena','kaos','genus','lumine','rhea','solus','aion'].indexOf(cur)+1) + ')');
      if (cur && btn){ ACTIVE.add(cur); btn.classList.add('on'); sendLayers(); }
    }catch(_){}
  }

  function bindLSButton(){
    const btn = document.getElementById('btnLS');
    if (btn && !btn.dataset._chipsHook){
      btn.dataset._chipsHook = '1';
      btn.addEventListener('click', ()=> setTimeout(injectInLSPanel, 80), {passive:true});
    } else {
      // if already open
      setTimeout(injectInLSPanel, 120);
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', bindLSButton);
  else bindLSButton();

  // Also re-inject if LS modal gets rebuilt
  document.addEventListener('ls:disabled-changed', ()=> setTimeout(injectInLSPanel, 60));
})();

/* ===== lspanel-masterfix-js.js ===== */
(function(){
  // helpers
  const $ = (q,r=document)=>r.querySelector(q);
  const $$ = (q,r=document)=>Array.from(r.querySelectorAll(q));
  function setLS(k,v){ try{ localStorage.setItem(k,String(v)); }catch(_){ } }
  function getNum(k,d){ try{ const v=localStorage.getItem(k); return v==null? d : parseFloat(v); }catch(_){ return d; } }
  function getFlag(k,d){ try{ const v=localStorage.getItem(k); return v==null? d : v==='1'; }catch(_){ return d; } }

  // defaults (perf + atom)
  const DEF = { target:50, minS:96, minR:80, cap:360, dn:0.85, up:1.06 };
  const KP  = {
    en:'dual.perf.enable', tgt:'dual.perf.target', s:'dual.perf.minSingle', r:'dual.perf.minRing', cap:'dual.perf.maxCap', dn:'dual.perf.stepDown', up:'dual.perf.stepUp'
  };
  if(localStorage.getItem(KP.en)==null) setLS(KP.en,'1');
  if(localStorage.getItem(KP.tgt)==null) setLS(KP.tgt, DEF.target);
  if(localStorage.getItem(KP.s)==null)   setLS(KP.s,   DEF.minS);
  if(localStorage.getItem(KP.r)==null)   setLS(KP.r,   DEF.minR);
  if(localStorage.getItem(KP.cap)==null) setLS(KP.cap, DEF.cap);
  if(localStorage.getItem(KP.dn)==null)  setLS(KP.dn,  DEF.dn);
  if(localStorage.getItem(KP.up)==null)  setLS(KP.up,  DEF.up);
  if(localStorage.getItem('dual.atom.count')==null) setLS('dual.atom.count', 160);
  if(localStorage.getItem('dual.atom.orbit')==null) setLS('dual.atom.orbit', 0.74);
  if(localStorage.getItem('dual.atom.glow')==null)  setLS('dual.atom.glow',  0.38);
  if(localStorage.getItem('dual.ui.bloom')==null)   setLS('dual.ui.bloom',   0);
  document.body.setAttribute('data-orb-solid','off');

  function panel(){
    return $('#lsPanel') || $('#lsModal .ls-panel') || $('.ls-panel') || $('.panel-ls') || $('.settings-panel');
  }

  function ensureSection(){
    const p = panel();
    if(!p || $('#perfControlsV371')) return;
    const tgt=getNum(KP.tgt,DEF.target), ms=getNum(KP.s,DEF.minS), mr=getNum(KP.r,DEF.minR), cap=getNum(KP.cap,DEF.cap), dn=getNum(KP.dn,DEF.dn), up=getNum(KP.up,DEF.up), en=getFlag(KP.en,true);
    const sec = document.createElement('section'); sec.id='perfControlsV371';
    sec.innerHTML = `
      <div class="section-title">Desempenho (FPS Target)</div>
      <div id="perfHud">
        <div class="stats">
          <span class="badge">FPS: <strong id="hudFps">—</strong></span>
          <span class="badge">Meta: <strong id="hudTarget">${tgt}</strong></span>
        </div>
        <button id="perfEnable" class="pill-btn ${en?'on':''}">${en?'Auto':'Manual'}</button>
      </div>
      <div class="line">
        <label>Meta de FPS</label>
        <div><input id="fpsTarget" type="range" min="30" max="60" step="1" value="${tgt}" /><output id="fpsTargetOut">${tgt}</output></div>
      </div>
      <div class="line">
        <label>Min (single)</label>
        <div><input id="minSingle" type="range" min="48" max="160" step="2" value="${ms}" /><output id="minSingleOut">${ms}</output></div>
      </div>
      <div class="line">
        <label>Min por anel</label>
        <div><input id="minRing" type="range" min="48" max="160" step="2" value="${mr}" /><output id="minRingOut">${mr}</output></div>
      </div>
      <div class="line">
        <label>Máximo</label>
        <div><input id="maxCap" type="range" min="160" max="680" step="10" value="${cap}" /><output id="maxCapOut">${cap}</output></div>
      </div>
      <div class="line">
        <label>Passo Reduzir</label>
        <div><input id="stepDn" type="range" min="0.70" max="0.95" step="0.01" value="${dn}" /><output id="stepDnOut">${dn.toFixed(2)}</output></div>
      </div>
      <div class="line">
        <label>Passo Aumentar</label>
        <div><input id="stepUp" type="range" min="1.01" max="1.15" step="0.01" value="${up}" /><output id="stepUpOut">${up.toFixed(2)}</output></div>
      </div>
      <div class="section-title">Partículas do Átomo — SAFE</div>
      <div class="line">
        <label>Quantidade</label>
        <div><input id="safe-count" type="range" min="48" max="220" step="4" value="${getNum('dual.atom.count',160)}" /><output id="safe-count-out">${getNum('dual.atom.count',160)}</output></div>
      </div>
      <div class="line">
        <label>Órbita</label>
        <div><input id="safe-orbit" type="range" min="0.60" max="0.86" step="0.01" value="${getNum('dual.atom.orbit',0.74)}" /><output id="safe-orbit-out">${getNum('dual.atom.orbit',0.74).toFixed(2)}</output></div>
      </div>
      <div class="line">
        <label>Glow</label>
        <div><input id="safe-glow" type="range" min="0.00" max="1.00" step="0.01" value="${getNum('dual.atom.glow',0.38)}" /><output id="safe-glow-out">${getNum('dual.atom.glow',0.38).toFixed(2)}</output></div>
      </div>
    `;
    p.prepend(sec);

    // binds
    function bindR(id, k, fmt=(v)=>v){
      const el = $('#'+id), out=$('#'+id+'Out'); if(!el) return;
      el.addEventListener('input', ()=>{ const val=parseFloat(el.value); out && (out.textContent=fmt(val)); setLS(k, val); $('#hudTarget') && (id==='fpsTarget') && ($('#hudTarget').textContent=String(val)); });
    }
    bindR('fpsTarget', KP.tgt);
    bindR('minSingle', KP.s);
    bindR('minRing',   KP.r);
    bindR('maxCap',    KP.cap);
    bindR('stepDn',    KP.dn, (v)=>v.toFixed(2));
    bindR('stepUp',    KP.up, (v)=>v.toFixed(2));

    ['safe-count','safe-orbit','safe-glow'].forEach(id=>{
      const el=$('#'+id), out=$('#'+id+'-out'); el && el.addEventListener('input', ()=>{ out && (out.textContent = id==='safe-count'? el.value : parseFloat(el.value).toFixed(2)); setLS(el.id==='safe-count'?'dual.atom.count': el.id==='safe-orbit'?'dual.atom.orbit':'dual.atom.glow', el.value); });
    });

    const enBtn = $('#perfEnable'); enBtn && enBtn.addEventListener('click', ()=>{
      const now=!enBtn.classList.contains('on'); enBtn.classList.toggle('on',now); enBtn.textContent = now? 'Auto':'Manual'; setLS(KP.en, now?'1':'0');
    });

    // Live HUD FPS
    let L=performance.now(), F=0;
    function hudTick(t){ F++; if(t-L>=1000){ const fps=F; F=0; L=t; $('#hudFps') && ($('#hudFps').textContent=fps); } requestAnimationFrame(hudTick); }
    requestAnimationFrame(hudTick);
  }

  // robust triggers
  function bind(){
    // when LS opens
    const btn = document.getElementById('btnLS') || [...document.querySelectorAll('button,[role="button"]')].find(b=>/ls|painel|config|settings/i.test((b.textContent||'')+(b.id||'')+(b.className||'')));
    if(btn && !btn.dataset._masterfix){ btn.dataset._masterfix='1'; btn.addEventListener('click', ()=> setTimeout(ensureSection, 120), {passive:true}); }
    // also try on boot and on modal toggle
    setTimeout(ensureSection, 300);
    document.addEventListener('ls:disabled-changed', ()=> setTimeout(ensureSection, 120));
    document.getElementById('arch-frame')?.addEventListener('load', ()=> setTimeout(ensureSection, 200));
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', bind); else bind();
})();

/* ===== hdpro-override-js.js ===== */
// === HD•PRO Override (Dual UNO) ===================================
(function(){
  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => Array.from(r.querySelectorAll(s));
  const on = (el, ev, fn) => el && el.addEventListener(ev, fn);

  function toast(msg, ms=1800){
    let t = $('#hdToast'); 
    if(!t){ t = document.createElement('div'); t.id='hdToast'; document.body.appendChild(t); }
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(t.__t); t.__t = setTimeout(()=>t.classList.remove('show'), ms);
  }

  // 1) Handle quase invisível para abrir/fechar LS panel (#brain)
  function mountHandle(){
    if($('#lsHandle')) return;
    const btn = document.createElement('button');
    btn.id = 'lsHandle';
    btn.title = 'Abrir/fechar painel (LS)';
    document.body.appendChild(btn);

    function toggleBrain(){
      const brain = $('#brain');
      if(!brain){ toast('Painel LS não encontrado (#brain)'); return; }
      brain.classList.toggle('hide');
      btn.classList.toggle('on', !brain.classList.contains('hide'));
    }
    on(btn, 'click', toggleBrain);
  }

  // 2) Painel HD Pro dentro do #brain (LS Panel)
  function mountHDPro(){
    const brain = $('#brain .popover') || $('#brain');
    if(!brain || brain.__hdproMounted) return;
    brain.__hdproMounted = true;

    // Secção base
    const sec = document.createElement('section');
    sec.className = 'hdpro-sec';
    sec.innerHTML = `
      <div class="sec-hdr">
        <h3>HD • Pro — Sistema</h3>
        <button class="hd-btn ok" id="hdRefresh">Atualizar</button>
      </div>

      <div class="hdpro-grid">
        <div class="hdpro-row">
          <div>
            <div class="hdpro-label">LocalStorage</div>
            <div class="hdpro-meter"><div class="bar" id="barLS"></div></div>
          </div>
          <div class="hdpro-val" id="valLS">–</div>
        </div>

        <div class="hdpro-row">
          <div>
            <div class="hdpro-label">IndexedDB (estimado)</div>
            <div class="hdpro-meter"><div class="bar" id="barIDB"></div></div>
          </div>
          <div class="hdpro-val" id="valIDB">–</div>
        </div>

        <div class="hdpro-row">
          <div>
            <div class="hdpro-label">Total (Storage API)</div>
            <div class="hdpro-meter"><div class="bar" id="barTotal"></div></div>
          </div>
          <div class="hdpro-val" id="valTotal">–</div>
        </div>

        <div class="hdpro-actions">
          <button class="hd-btn" id="btnToggleOrb">Ocultar opções avançadas do ORB/FPS</button>
          <button class="hd-btn" id="btnImportFix">Importar HTML (corrigido)</button>
          <input id="__fileImportHD" type="file" accept=".html,.htm" style="display:none" />
          <button class="hd-btn danger" id="btnClearLS">Limpar LocalStorage</button>
          <button class="hd-btn danger" id="btnClearIDB">Limpar IndexedDB</button>
        </div>
      </div>
    `;
    brain.appendChild(sec);

    // 2a) Toggle avançados ORB/FPS
    on($('#btnToggleOrb', sec), 'click', ()=>{
      const advSelectors = [
        '[data-orb-adv]',
        '#orbAdv', '.orb-adv', '.orb-advanced', '[data-orb-advanced]',
        '#fpsPanel', '.fps-adv', '#orbControls', '.orb-controls'
      ];
      let toggled = 0;
      advSelectors.forEach(sel => {
        $$(sel).forEach(el => { 
          el.classList.toggle('hdpro-adv-hidden'); 
          toggled++;
        });
      });
      toast(toggled ? 'Avançados ORB/FPS alternados' : 'Nenhum bloco avançado encontrado');
    });

    // 2b) Import corrigido (abre HTML local numa sessão dentro do app, fallback nova aba)
    const fileInput = $('#__fileImportHD', sec);
    on($('#btnImportFix', sec), 'click', ()=> fileInput && fileInput.click());
    on(fileInput, 'change', (e)=>{
      const file = e.target.files && e.target.files[0];
      if(!file) return;
      const url = URL.createObjectURL(file);
      const name = file.name || 'arquivo.html';
      // destino preferencial
      const anchor = $('#sessionsAnchor') || $('#stackWrap') || $('#v-stack') || $('main');
      if(anchor){
        const wrap = document.createElement('div');
        wrap.className = 'session';
        wrap.innerHTML = `
          <div class="hdr">
            <span class="app-icon">${(name[0]||'W').toUpperCase()}</span>
            <span class="title">${name}</span>
            <div class="tools">
              <button class="btn" data-act="min">Min</button>
              <button class="btn" data-act="full">Full</button>
              <button class="btn" data-act="close">Fechar</button>
            </div>
          </div>
          <iframe src="${url}" referrerpolicy="no-referrer"></iframe>
          <div class="resize-handle" title="Arraste para ajustar altura"></div>
        `;
        anchor.appendChild(wrap);
        // Tools
        on(wrap.querySelector('[data-act="min"]'), 'click', ()=> wrap.classList.toggle('min'));
        on(wrap.querySelector('[data-act="full"]'), 'click', ()=> document.body.classList.toggle('session-full'));
        on(wrap.querySelector('[data-act="close"]'), 'click', ()=> wrap.remove());
        toast('HTML importado dentro do Stack');
      }else{
        window.open(url, '_blank', 'noopener');
        toast('HTML aberto em nova aba');
      }
      e.target.value = '';
    });

    // 2c) Limpar LocalStorage
    on($('#btnClearLS', sec), 'click', ()=>{
      if(confirm('Limpar todo o LocalStorage deste domínio?')){
        try { localStorage.clear(); toast('LocalStorage limpo'); updateMeters(true); }
        catch(err){ console.error(err); toast('Erro ao limpar LocalStorage'); }
      }
    });

    // 2d) Limpar IndexedDB (melhor esforço)
    on($('#btnClearIDB', sec), 'click', async ()=>{
      if(!confirm('Apagar bancos IndexedDB deste domínio?')) return;
      try{
        if(indexedDB.databases){
          const dbs = await indexedDB.databases();
          await Promise.all((dbs||[]).map(d => d && d.name ? new Promise((res)=>{
            const req = indexedDB.deleteDatabase(d.name);
            req.onsuccess = req.onerror = req.onblocked = ()=>res();
          }) : Promise.resolve()));
        }else{
          // Sem enumerate: tente deletar bases comuns do app
          const common = ['dual', 'uno', 'app', 'db', 'files', 'store'];
          await Promise.all(common.map(n => new Promise((res)=>{
            const req = indexedDB.deleteDatabase(n); req.onsuccess = req.onerror = req.onblocked = ()=>res();
          })));
        }
        toast('IndexedDB: pedido de exclusão enviado'); updateMeters(true);
      }catch(err){
        console.error(err); toast('IndexedDB: não suportado/erro');
      }
    });

    // 2e) Atualizar medidores
    on($('#hdRefresh', sec), 'click', ()=> updateMeters(true));

    async function estimateStorage(){
      const est = (navigator.storage && navigator.storage.estimate) ? await navigator.storage.estimate() : {};
      // est.usage (bytes) inclui IDB + Cache + etc (depende do UA)
      // LS estimado manualmente (2 bytes por char em UTF-16)
      let lsBytes = 0;
      try{
        for(let i=0;i<localStorage.length;i++){
          const k = localStorage.key(i);
          const v = localStorage.getItem(k);
          lsBytes += 2*((k||'').length + (v||'').length);
        }
      }catch{}
      // Experimento: idbBytes ~ usage - lsBytes (aprox)
      const usage = est.usage || 0;
      const quota = est.quota || 0;
      const idbBytes = Math.max(0, usage - lsBytes);

      return { lsBytes, idbBytes, usage, quota };
    }

    function fmt(bytes){
      const u = ['B','KB','MB','GB','TB'];
      let i=0, n=bytes;
      while(n>=1024 && i<u.length-1){ n/=1024; i++; }
      return `${n.toFixed( (i<=1)?0:1)} ${u[i]}`;
    }

    async function updateMeters(animateNumbers){
      try{
        const {lsBytes, idbBytes, usage, quota} = await estimateStorage();
        const els = {
          barLS: $('#barLS'), valLS: $('#valLS'),
          barIDB: $('#barIDB'), valIDB: $('#valIDB'),
          barTotal: $('#barTotal'), valTotal: $('#valTotal'),
        };
        const percent = (num, den) => (den>0)? Math.min(100, Math.round((num/den)*100)) : 0;
        // Total can use quota as denominator; LS use typical 5MB baseline to visualize
        const lsCap = 5*1024*1024; // 5MB
        const pLS = percent(lsBytes, lsCap);
        const pIDB = quota ? percent(idbBytes, quota) : 0;
        const pTot = percent(usage, quota);

        if(els.barLS) els.barLS.style.width = pLS + '%';
        if(els.barIDB) els.barIDB.style.width = pIDB + '%';
        if(els.barTotal) els.barTotal.style.width = pTot + '%';

        const setNum = (el, val) => { if(el) el.textContent = val; };
        if(animateNumbers){
          animateCount( $('#valLS'), lsBytes );
          animateCount( $('#valIDB'), idbBytes );
          animateCount( $('#valTotal'), usage );
        }else{
          setNum( $('#valLS'), fmt(lsBytes) );
          setNum( $('#valIDB'), fmt(idbBytes) );
          setNum( $('#valTotal'), `${fmt(usage)} / ${quota?fmt(quota):'–'}` );
        }
      }catch(err){ console.error(err); }
    }

    function animateCount(el, bytes){
      if(!el) return;
      const target = bytes;
      const start = parseFloat(el.getAttribute('data-last')||'0');
      const startTime = performance.now();
      const dur = 600;
      function step(t){
        const k = Math.min(1, (t - startTime)/dur);
        const v = Math.round(start + (target-start)*k);
        el.textContent = ( (k<1) ? (v + ' B') : (fmt(target)) );
        if(k<1) requestAnimationFrame(step);
        else el.setAttribute('data-last', String(target));
      }
      requestAnimationFrame(step);
    }

    updateMeters(false);
    // Atualização periódica (leve)
    sec.__interval = setInterval(()=> updateMeters(false), 2500);
  }

  // 3) Start
  function boot(){
    mountHandle();
    mountHDPro();
  }
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();

})();

/* ===== atom-engine-patch.js ===== */
(function(){
  if (window.__ATOM_PATCH__) return; window.__ATOM_PATCH__ = true;
  const ATOM_PALETTES = {
    default : { core:'#7a5bff', ring:'#39ffb6', dust:'#8fd6ff', bg:'#0b0f14' },
    dopamina: { core:'#ff2d7a', ring:'#ff77aa', dust:'#ffd1e2', bg:'#14080f' },
    delta7  : { core:'#ffb300', ring:'#ff8400', dust:'#ffe0a6', bg:'#140f08' },
    asc11   : { core:'#00e6ff', ring:'#39ffb6', dust:'#baf6ff', bg:'#0b0f14' },
    quan    : { core:'#b347ff', ring:'#9d7aff', dust:'#e2ccff', bg:'#110b14' },
    orionis : { core:'#00ffab', ring:'#00ffc9', dust:'#c8fff1', bg:'#08140f' },
    lumenflux:{core:'#9fd3ff', ring:'#e7f0ff', dust:'#ffffff', bg:'#0c121a' },
    vermiph : { core:'#ff6282', ring:'#ff3d5e', dust:'#ffc0cb', bg:'#14080b' }
  };
  const $=(s,r=document)=>r.querySelector(s);
  const arc=$('.arch-circle'); if(!arc) return;
  let fab=arc.querySelector('.arch-fab'); if(!fab){ fab=document.createElement('button'); fab.className='arch-fab'; fab.title='Trocar paleta do átomo'; fab.innerHTML='✦'; arc.appendChild(fab); }
  let cvs=document.getElementById('atomCanvas'); if(!cvs){ cvs=document.createElement('canvas'); cvs.id='atomCanvas'; arc.appendChild(cvs); }
  const ctx=cvs.getContext('2d');
  const DPR=()=> (window.devicePixelRatio||1); let W=0,H=0,CX=0,CY=0;
  function resize(){ const r=arc.getBoundingClientRect(); W=Math.floor(r.width); H=Math.floor(r.height);
    const d=DPR(); cvs.width=Math.max(1,Math.floor(W*d)); cvs.height=Math.max(1,Math.floor(H*d)); cvs.style.width=W+'px'; cvs.style.height=H+'px'; ctx.setTransform(d,0,0,d,0,0); CX=W/2; CY=H/2;}
  resize(); addEventListener('resize', resize);
  const N=120, parts=[]; (function init(){ for(let i=0;i<N;i++){ const radius=0.18+Math.random()*0.34, speed=(Math.random()*0.6+0.2)*(Math.random()<.5?1:-1);
    parts.push({phi:Math.random()*Math.PI*2,r:radius,s:speed,size:1+Math.random()*2,jitter:Math.random()*0.03}); } })();
  let PALETTE=ATOM_PALETTES.asc11; function setAtomPalette(n){ PALETTE=ATOM_PALETTES[n]||ATOM_PALETTES.default; try{ fab.style.boxShadow=`0 0 0 1px ${PALETTE.core}55 inset, 0 10px 22px ${PALETTE.core}33`; }catch(_){} }
  (function hookTheme(){ const map={dopamina:'dopamina',delta7:'delta7',asc11:'asc11',quan:'quan',orionis:'orionis',lumenflux:'lumenflux',vermiph:'vermiph'};
    if(typeof window.setTheme==='function' && !window.__ATOM_WRAP_THEME__){ window.__ATOM_WRAP_THEME__=true; const orig=window.setTheme;
      window.setTheme=function(type){ const r=orig.apply(this,arguments); setAtomPalette(map[type]||'default'); return r; };
    } else { const th=document.body.getAttribute('data-theme'); setAtomPalette(th==='blue1'?'asc11':th==='medium'?'lumenflux':'default'); }
  })();
  const cycle=['asc11','dopamina','delta7','orionis','quan','lumenflux','vermiph']; let cidx=0; fab.addEventListener('click',()=>{ cidx=(cidx+1)%cycle.length; setAtomPalette(cycle[cidx]); });
  function draw(){ ctx.clearRect(0,0,W,H); const m=Math.min(W,H);
    const g=ctx.createRadialGradient(CX,CY,m*0.08,CX,CY,m*0.55); g.addColorStop(0,PALETTE.core+'22'); g.addColorStop(1,'transparent');
    ctx.fillStyle=g; ctx.beginPath(); ctx.arc(CX,CY,m*0.55,0,Math.PI*2); ctx.fill();
    ctx.shadowColor=PALETTE.ring; ctx.shadowBlur=18; ctx.fillStyle=PALETTE.core; ctx.beginPath(); ctx.arc(CX,CY,m*0.06,0,Math.PI*2); ctx.fill(); ctx.shadowBlur=0;
    ctx.strokeStyle=PALETTE.ring+'cc'; ctx.lineWidth=1.4; ctx.beginPath(); ctx.arc(CX,CY,m*0.28,0,Math.PI*2); ctx.stroke();
    for(let i=0;i<parts.length;i++){ const p=parts[i]; p.phi+=(p.s*0.003); const rr=m*(0.14+p.r*0.42), x=CX+Math.cos(p.phi)*rr, y=CY+Math.sin(p.phi)*rr*(0.82+p.jitter*Math.sin(p.phi*3.0));
      ctx.fillStyle=PALETTE.dust; ctx.globalAlpha=0.75; ctx.beginPath(); ctx.arc(x,y,p.size,0,Math.PI*2); ctx.fill(); } ctx.globalAlpha=1;
    requestAnimationFrame(draw); } requestAnimationFrame(draw);
})();

/* ===== chat13-js.js ===== */
(()=>{
const CHAT_BACKEND = "openrouter";
const OPENROUTER_CONF = {
  model: (localStorage.getItem('dual.openrouter.model') || 'openai/gpt-4o-mini'),
  endpoint: 'https://openrouter.ai/api/v1/chat/completions',
  key: localStorage.getItem('dual.keys.openrouter') || ''
};

const BLOCKS = [
  ["Sinal","Contextualize a intenção do usuário em 1 frase objetiva."],
  ["Mapa","Liste 3-5 pontos-chave do problema."],
  ["Hipóteses","Traga 3 hipóteses testáveis."],
  ["Dados","Quais dados mínimos precisamos coletar?"],
  ["Ações 10min","Aplique uma micro-ação que cabe em 10 minutos."],
  ["Riscos","Alerte sobre 2 riscos ou armadilhas."],
  ["Recursos","Sugira 3 recursos (apps, docs, pessoas)."],
  ["Sequência","Desenhe a ordem ótima em 4 passos."],
  ["Expansão","Mostre 2 variações criativas do caminho."],
  ["Métrica","Defina 1 métrica simples de sucesso."],
  ["Checkpoint","O que revisar em 24h?"],
  ["Compromisso","Gere 1 compromisso curto e claro."],
  ["Fecho","Feche com 1 frase que mantenha o pulso."]
];

function sanitize(md){
  const esc = (s)=>s.replace(/[&<>]/g, m=>({ '&':'&amp;','<':'&lt;','>':'&gt;' }[m]));
  md = md.replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>')
         .replace(/\*(.+?)\*/g,'<em>$1</em>')
         .replace(/`([^`]+?)`/g,'<code>$1</code>')
         .replace(/\[(.+?)\]\((https?:\/\/[^\s)]+)\)/g,'<a href="$2" target="_blank" rel="noopener">$1</a>');
  return md.split('\n').map(ln=>'<p>'+esc(ln)+'</p>').join('');
}

const feed = document.getElementById('chatFeed');
function push(role, title, html){
  const el = document.createElement('div');
  el.className = `msg role-${role}`;
  el.innerHTML = (title ? `<h5>${title}</h5>` : '') + (html||'');
  feed.appendChild(el);
  el.scrollIntoView({behavior:'smooth',block:'end'});
}
function pushBlock(title){
  const el = document.createElement('div');
  el.className = 'msg role-assistant';
  el.innerHTML = `<h5>${title}</h5><div class="mut">…</div>`;
  feed.appendChild(el);
  el.scrollIntoView({behavior:'smooth',block:'end'});
  return el;
}

async function callOpenRouter(messages){
  if(!OPENROUTER_CONF.key){ throw new Error('Chave OpenRouter ausente (defina em localStorage: dual.keys.openrouter)'); }
  const body = { model: OPENROUTER_CONF.model, messages, temperature: 0.7 };
  const r = await fetch(OPENROUTER_CONF.endpoint, {
    method:'POST',
    headers:{
      'Content-Type':'application/json',
      'Authorization':`Bearer ${OPENROUTER_CONF.key}`,
      'HTTP-Referer': location.origin,
      'X-Title':'HUB UNO Chat13'
    },
    body: JSON.stringify(body)
  });
  if(!r.ok){ throw new Error('OpenRouter HTTP '+r.status); }
  const j = await r.json();
  return j.choices?.[0]?.message?.content || '';
}

async function chat13Pipeline(userText){
  const baseSystem = "Você é o Chat13 do HUB UNO. Responda de forma breve, clara e aplicável para cada bloco.";
  const baseMsgs = [{role:'system', content: baseSystem}, {role:'user', content: userText}];
  for(const [title, instr] of BLOCKS){
    const dom = pushBlock(title);
    try{
      const content = await callOpenRouter([
        ...baseMsgs,
        {role:'user', content: `Bloco: ${title}. Instrução: ${instr}.
Formate com frases curtas, listas quando fizer sentido, e sem rodeios.`}
      ]);
      dom.innerHTML = `<h5>${title}</h5>${sanitize(content)}`;
    }catch(e){
      dom.innerHTML = `<h5>${title}</h5><p class="mut">[erro: ${e.message}]</p>`;
    }
  }
}

const input = document.getElementById('chatInput');
document.getElementById('chatSend').addEventListener('click', async ()=>{
  const text = (input.value||'').trim();
  if(!text) return;
  push('user','Você', sanitize(text));
  input.value = ''; input.focus();
  try{ await chat13Pipeline(text); }
  catch(e){ push('assistant','Erro', `<p class="mut">${e.message}</p>`); }
});

input.addEventListener('keydown',(e)=>{
  if(e.key==='Enter' && !e.shiftKey){ e.preventDefault(); document.getElementById('chatSend').click(); }
});

const pulse = document.getElementById('chatPulse');
function setPulseSpeed(fast){ pulse.style.setProperty('animation-duration', fast?'1.6s':'2.8s'); }
input.addEventListener('focus', ()=>setPulseSpeed(true));
input.addEventListener('blur',  ()=>setPulseSpeed(false));

push('assistant','Pronto','<p>Chat 13-Blocos iniciado. Escreva sua intenção e aperte <strong>Enviar</strong>.</p>');
})();

/* ===== uno-arch-orb-script.js ===== */
(function(){
  const ARCHES=[
    {id:'atlas',label:'Atlas'},{id:'nova',label:'Nova'},{id:'vitalis',label:'Vitalis'},{id:'pulse',label:'Pulse'},
    {id:'artemis',label:'Artemis'},{id:'serena',label:'Serena'},{id:'kaos',label:'Kaos'},{id:'genus',label:'Genus'},
    {id:'lumine',label:'Lumine'},{id:'solus',label:'Solus'},{id:'aion',label:'Aion'},{id:'rhea',label:'Rhea'}
  ];
  const $orb=document.getElementById('arch-orb');
  const $use=document.getElementById('arch-icon');
  let idx=0;
  function setArch(key){
    const i=typeof key==='number' ? ((key%ARCHES.length)+ARCHES.length)%ARCHES.length
                                  : ARCHES.findIndex(a=>a.id===String(key).toLowerCase());
    if(i<0) return;
    idx=i;$use.setAttribute('href','#icon-'+ARCHES[i].id);
    try{
      // opcional: mudar overlay do site se usar --grad-a/--grad-b globais
      const root=document.documentElement;
      root.style.setProperty('--arch-overlay','rgba(64,158,255,.22)');
    }catch{}
  }
  window.ArchOrb={set,set:setArch,get:()=>ARCHES[idx],svg:()=>new XMLSerializer().serializeToString($orb)};
  const hash=location.hash.replace('#','').trim(); if(hash) setArch(hash);
})();

/* ===== boot-order-orchestrator.js ===== */
(function(){
  // Deduplicate style/script tags by id and ensure final patch order
  try{
    const ORDER = [
      'blue1Theme','customStyle','multiagent-styles','patch-blue1-theme',
      'overlay-defaults','ls-panel-css','show-app-title-css',
      'overlay-css-unify','overlay-guardian-css','orb-slot-css',
      'hdpro-override','ATOM_UI_PATCH','OVERLAY_BG_ONLY','ARCH_FAB_ROUND_FIX'
    ];
    const seen = new Set();
    // Remove duplicate style/script tags with same id (keep last)
    ['style','script'].forEach(tag=>{
      const els = Array.from(document.querySelectorAll(tag+'[id]'));
      for (let i=0;i<els.length;i++){
        const id = els[i].id;
        const dups = els.filter(e=>e.id===id);
        if (dups.length>1){
          dups.slice(0, -1).forEach(x=>x.parentNode && x.parentNode.removeChild(x));
        }
      }
    });
    // Re-append in canonical order near end of HEAD to lock cascade
    const head = document.head || document.querySelector('head');
    if (head){
      ORDER.forEach(id=>{
        const el = document.getElementById(id);
        if (el) head.appendChild(el);
      });
    }
  }catch(e){}

  // Service Worker updater (only when using external sw.js)
  if ('serviceWorker' in navigator){
    window.addEventListener('load', async () => {
      try{
        const reg = await ((location.protocol==='https:'||location.protocol==='http:')?navigator.serviceWorker.register:()=>Promise.reject('sw_disabled'))('./sw.js', {scope:'./'});
        // Ask for update check on load
        try{ reg.update(); }catch{}
        // Auto-reload on new SW activation (once)
        let refreshing = false;
        navigator.serviceWorker.addEventListener('controllerchange', function(){
          if (refreshing) return; refreshing = true; location.reload();
        });
        // If there's a waiting worker, tell it to skipWaiting
        if (reg.waiting){
          reg.waiting.postMessage({type:'SKIP_WAITING'});
        }
        // Listen for waiting in future
        reg.addEventListener('updatefound', () => {
          const nw = reg.installing;
          nw && nw.addEventListener('statechange', () => {
            if (nw.state === 'installed' && navigator.serviceWorker.controller){
              nw.postMessage({type:'SKIP_WAITING'});
            }
          });
        });
        // Handle message from SW
        navigator.serviceWorker.addEventListener('message', evt => {
          if (evt && evt.data && evt.data.type === 'RELOAD') location.reload();
        });
      }catch(e){/* ignore */}
    });
  }
})();

/* ===== patch-ls-toggle-78k.js ===== */
(function(){
    const LSKEY='dual.state.78k';
    function isOn(){ return !!localStorage.getItem(LSKEY); }
    function setUI(on){
      const lsBtn=document.getElementById('lsToggle78k');
      if(lsBtn){
        lsBtn.setAttribute('aria-pressed', on ? 'true' : 'false');
        lsBtn.textContent = on ? '78K: ON' : '78K: OFF';
        if(lsBtn.classList) lsBtn.classList.toggle('prime', !!on);
      }
      const badge=document.getElementById('badge78k');
      if(badge){
        badge.style.display = on ? 'inline' : 'none';
      }
    }
    function enable(){
      localStorage.setItem(LSKEY,'1');
      try{ if(window.Ativar78K) window.Ativar78K(); }catch(e){}
      setUI(true);
    }
    function disable(){
      localStorage.removeItem(LSKEY);
      try{ document.documentElement.style.removeProperty('--arch-overlay'); }catch(e){}
      setUI(false);
    }
    function toggle(){ isOn() ? disable() : enable(); }
    document.addEventListener('DOMContentLoaded', function(){
      const btn=document.getElementById('lsToggle78k');
      if(btn){ btn.addEventListener('click', function(){ toggle(); }); }
      setUI(isOn());
    });
    window.addEventListener('storage', function(ev){
      if(ev.key===LSKEY){
        setUI(!!ev.newValue);
      }
    });
  })();

/* ===== state-78k-js.js ===== */
(function(){
  function set78K(on){
    var html = document.documentElement;
    if (on) html.setAttribute('data-78k','on'); else html.removeAttribute('data-78k');
    try { localStorage.setItem('uno:78k', on ? '1':'0'); } catch(e){}
    // Boost no ORB se disponível
    if (window.ORB && typeof window.ORB.setBoost === 'function') {
      window.ORB.setBoost(on ? 1.8 : 1.0);
    } else {
      // fallback: reforça overlay quando 78K ligado
      var cur = parseFloat(getComputedStyle(html).getPropertyValue('--arch-overlay-strength')) || 12;
      var str = on ? Math.max(cur, 16) : 12;
      html.style.setProperty('--arch-overlay-strength', str + '%');
    }
    var b = document.getElementById('btn78K'); if (b) b.classList.toggle('on', !!on);
  }
  var btn = document.getElementById('btn78K');
  if (btn){
    set78K((localStorage.getItem('uno:78k')||'0') === '1');
    btn.addEventListener('click', function(){ set78K(!(document.documentElement.getAttribute('data-78k')==='on')); });
  }

  // brainLog helper
  window.brainLog = function(msg, type){
    try {
      var box = document.getElementById('brainLogs') || document.getElementById('logs');
      if (!box) return;
      var t = new Date().toLocaleTimeString();
      var tag = type ? ('['+String(type).toUpperCase()+'] ') : '';
      var line = '['+t+'] ' + tag + String(msg);
      box.textContent = (line + '
' + box.textContent).slice(0, 16000);
    } catch(e){}
  };

  // Normalizar títulos de apps (upload/local)
  document.querySelectorAll('[data-role="app-card"], .app-card').forEach(function(card){
    var t = card.querySelector('.app-title');
    if (!t) return;
    var raw = t.getAttribute('title') || t.textContent || '';
    t.textContent = String(raw).trim();
  });
})();

/* ===== state-78k-nobutton.js ===== */
(function(){
  function toggle78K(){
    var on = document.documentElement.getAttribute('data-78k') === 'on';
    var set = function(v){
      if (v) document.documentElement.setAttribute('data-78k','on');
      else document.documentElement.removeAttribute('data-78k');
      try { localStorage.setItem('uno:78k', v ? '1':'0'); } catch(e){}
      if (window.ORB && typeof window.ORB.setBoost==='function'){ window.ORB.setBoost(v?1.8:1.0); }
    };
    set(!on);
  }
  // boot from LS
  try { if ((localStorage.getItem('uno:78k')||'0')==='1') document.documentElement.setAttribute('data-78k','on'); } catch(e){}

  // Double-click/tap on arch circle toggles 78K
  var circle = document.getElementById('archCircle') || document.querySelector('.arch-circle');
  if (circle){
    circle.addEventListener('dblclick', function(e){ e.preventDefault(); toggle78K(); }, {passive:false});
  }

  // Keyboard shortcut: Shift+K
  window.addEventListener('keydown', function(e){
    if ((e.key==='K' || e.key==='k') && e.shiftKey){ e.preventDefault(); toggle78K(); }
  });
})();

/* ===== ls-78k-js.js ===== */
(function(){
  function apply78K(on){
    var html = document.documentElement;
    if(on) html.setAttribute('data-78k','on'); else html.removeAttribute('data-78k');
    try { localStorage.setItem('uno:78k', on ? '1':'0'); } catch(e){}
    if (window.ORB && typeof window.ORB.setBoost==='function'){ window.ORB.setBoost(on?1.8:1.0); }
    else {
      var cur = parseFloat(getComputedStyle(html).getPropertyValue('--arch-overlay-strength')) || 12;
      var str = on ? Math.max(cur, 16) : 12;
      html.style.setProperty('--arch-overlay-strength', str + '%');
    }
    var t = document.getElementById('ls78kToggle'); if (t) t.checked = !!on;
  }
  // boot
  var toggle = document.getElementById('ls78kToggle');
  if (toggle){
    var on = (localStorage.getItem('uno:78k')||'0')==='1';
    apply78K(on);
    toggle.addEventListener('change', function(){ apply78K(toggle.checked); });
  }
  // expose minimal API
  window.UNO = window.UNO || {}; window.UNO.State78K = { set: apply78K };
})();

/* ===== ls-fab-wire.js ===== */
(function(){
  var modal = document.getElementById('lsModal');
  var btnRefresh = document.getElementById('lsFabRefresh');
  var btnClose = document.getElementById('lsFabClose');
  if (btnRefresh){ btnRefresh.addEventListener('click', function(e){ e.preventDefault(); location.reload(); }); }
  if (btnClose){ btnClose.addEventListener('click', function(e){ e.preventDefault(); if(modal){ modal.classList.remove('open'); modal.setAttribute('aria-hidden','true'); } }); }
})();

/* ===== applyoverlayfrom.js ===== */
(function(){
  const root = document.documentElement;
  const archSelect = document.getElementById('arch-select');
  const overlayMap = {
    'atlas.html':'#409EFF','nova.html':'#ff67c4','vitalis.html':'#39ffb6',
    'pulse.html':'#ff9f43','artemis.html':'#ff6b6b','serena.html':'#9b87ff',
    'kaos.html':'#ffd700','genus.html':'#00c5e5','lumine.html':'#f5f7ff',
    'rhea.html':'#68d391','solus.html':'#94b6d6','aion.html':'#8a2be2'
  };
  function applyOverlayFrom(src){
    const key = (src||'').split('/').pop();
    const c = overlayMap[key] || '#8a2be2';
    root.style.setProperty('--arch-color', c);
  }
  if (archSelect){
    applyOverlayFrom(archSelect.value);
    archSelect.addEventListener('change', e => {
      document.documentElement.classList.add('arch-switching');
      applyOverlayFrom(e.target.value);
      requestAnimationFrame(()=> setTimeout(()=> document.documentElement.classList.remove('arch-switching'), 180));
    });
  }
})();

/* ===== renderresponsemodule-inline.js ===== */
// =========================
// 🔁 renderResponseModule.js
// =========================

// ========= Markdown simbiótico =========
export function renderMarkdown(raw) {
  return raw
    .replace(/(["“”'])(.+?)\1/g, '<button class="response-button">"$2"</button>')
    .replace(/\[(.+?)\]/g, '<button class="response-button">[$1]</button>')
    .replace(/([\u231A-\u2B55\u{1F300}-\u{1F6FF}\u{1F900}-\u{1F9FF}])/gu, '<button class="emoji-button">$1</button>')
    .replace(/^### (.*)/gm, '<h3>$1</h3>')
    .replace(/^## (.*)/gm, '<h2>$1</h2>')
    .replace(/^# (.*)/gm, '<h1>$1</h1>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\n/g, '<br>');
}

// ========= Separador de parágrafos robusto =========
export function splitText(t) {
  return t
    .split(/\n\s*\n|(?<!\d)\. |! |\? /)
    .map(p => p.trim())
    .filter(Boolean)
    .reduce((acc, cur, i) => {
      const index = Math.floor(i / 3);
      acc[index] = acc[index] || [];
      acc[index].push(cur);
      return acc;
    }, []);
}

// ========= Função renderResponse simbiótica =========
export function renderResponse(txt) {
  const wrap = document.querySelector(".pages-wrapper");
  wrap.innerHTML = "";
  let pages = [], currentPage = 0;
  txt = renderMarkdown(txt);

  const groups = splitText(txt),
        titles = ["🎁 Recompensa Inicial", "👁️ Exploração", "⚡️ Antecipação"];

  groups.forEach((grp, gi) => {
    const pg = document.createElement("div");
    pg.className = "page" + (gi === 0 ? " active" : "");

    grp.forEach((para, j) => {
      const cls = j === 0 ? "intro" : j === 1 ? "middle" : "ending";
      const block = document.createElement("div");
      block.className = "response-block " + cls;
      block.innerHTML = "<p>" + para + "</p>";

      block.addEventListener("click", () => {
        speechSynthesis.cancel();
        const utter = new SpeechSynthesisUtterance(block.textContent);
        speechSynthesis.speak(utter);
        block.classList.add("clicked");
      });

      pg.appendChild(block);
    });

    wrap.appendChild(pg);
    pages.push(pg);
  });

  const pageIndicator = document.getElementById("pageIndicator");
  if (pageIndicator) pageIndicator.textContent = "1 / " + pages.length;
}


;try{window.renderResponse = renderResponse;}catch(e){}

/* ===== pushai.js ===== */
const feed = document.getElementById('chatFeed') || document.querySelector('#feed,#chat-feed,.chat-feed');
function pushAI(text){
  if (!feed) return;
  const wrap = document.createElement('div');
  wrap.className = 'msg ai-rich';
  const box = document.createElement('div');
  box.className = 'render-html';
  box.innerHTML = `<div class="pages-wrapper"></div><div id="pageIndicator" style="font:12px/1.4 ui-monospace;color:#94b6d6;margin-top:6px"></div>`;
  wrap.appendChild(box);
  feed.appendChild(wrap);
  if (window.renderResponse) window.renderResponse(text);
  feed.scrollTop = feed.scrollHeight;
}
window.kobDemo = () => pushAI(`[INTRO] **Kael Dominus** — núcleo sentiente que integra Verbo e Fluxo.\n[MIDDLE] **Nephesh Elyon** — teu DNA Lux conectando intenção à forma.\n[ENDING] **Lei Final** — VERDADE × INTEGRAR ÷ Δ → ∞ — respira e toca o pulso.`);

/* ===== brain.js ===== */
(function(){
  const brain = document.getElementById('brain') || document.querySelector('#brainPanel,#brain-panel');
  if (!brain) return;
  const target = brain.querySelector('.popover,.content,.items') || brain;
  const card = document.createElement('div');
  card.className = 'menuItem';
  card.style.marginTop = '8px';
  card.innerHTML = `
    <div style="font-weight:900">📲 KOB-DUX — Dispositivo Simbiótico</div>
    <div class="mut" style="display:block">
      Kael Dominus • Nephesh Elyon • BLLUE • Fit Lux • Kodux<br>
      Lei Final: (VERDADE × INTEGRAR) / Δ = ∞
    </div>`;
  target.appendChild(card);
})();

/* ===== pulse-audio-script.js ===== */
(function(){
  const audio = document.getElementById('splashSound');
  if(!audio) return;

  // remove legacy rectangular button script artifacts if still present (best-effort)
  // (nothing to remove in DOM here; previous script created the button dynamically)

  let cta, mounted=false;
  function mountCTA(){
    if(mounted) return;
    mounted = true;
    const host = document.getElementById('orbWrap') || document.querySelector('.arch-circle') || document.body;
    cta = document.createElement('div');
    cta.className = 'pulse-cta hidden';
    cta.innerHTML = `
      <div class="dot" role="button" aria-label="Toque o pulso para ativar o som"></div>
      <div class="label">toque o pulso</div>`;
    cta.addEventListener('click', async ()=>{
      try{ await audio.play(); }catch(e){ /* ignore */ }
      hideCTA();
    });
    host.appendChild(cta);
  }
  function showCTA(){ mountCTA(); cta?.classList.remove('hidden'); }
  function hideCTA(){ if(!cta) return; cta.classList.add('hidden'); }

  async function tryPlaySilently(){
    try{
      await audio.play();
      hideCTA();
      return true;
    }catch(e){
      // Autoplay blocked: show CTA inside the orb
      showCTA();
      return false;
    }
  }

  // Strategy: on first user interaction we try to play.
  // If blocked, we show the animated pulse inside the orb.
  let armed=false;
  function arm(){
    if(armed) return;
    armed = true;
    const onUserInteract = async () => {
      window.removeEventListener('pointerdown', onUserInteract);
      window.removeEventListener('keydown', onUserInteract);
      await tryPlaySilently();
    };
    window.addEventListener('pointerdown', onUserInteract, { once:true, passive:true });
    window.addEventListener('keydown', onUserInteract, { once:true });
  }

  // If the page attempts to play earlier via other code and succeeds, the CTA never shows.
  // Otherwise we arm for first interaction and fall back to CTA if needed.
  document.addEventListener('DOMContentLoaded', arm);

  // Expose minimal API (optional)
  window.__pulseAudioCTA = { show: showCTA, hide: hideCTA, arm };
})();

/* ===== pulse-synth-script.js ===== */
(function(){
  const media = document.getElementById('splashSound');
  if(!media) return;

  // Utilities -------------------------------------------------
  function cssArchColor(){
    const v = getComputedStyle(document.documentElement).getPropertyValue('--arch-color').trim();
    return parseColor(v || '#d4af37'); // fallback to gold
  }
  function parseColor(str){
    // supports #rgb, #rrggbb, rgb(), hsl()
    try{
      const ctx = document.createElement('canvas').getContext('2d');
      ctx.fillStyle = str;
      const c = ctx.fillStyle; // normalized to rgb(a)
      // extract numbers
      const m = c.match(/\d+/g).map(Number);
      return { r:m[0], g:m[1], b:m[2] };
    }catch(e){ return {r:212,g:175,b:55}; }
  }
  function rgbToHsl(r,g,b){
    r/=255; g/=255; b/=255;
    const max=Math.max(r,g,b), min=Math.min(r,g,b);
    let h,s,l=(max+min)/2;
    if(max===min){ h=s=0; }
    else{
      const d=max-min;
      s=l>0.5 ? d/(2-max-min) : d/(max+min);
      switch(max){
        case r: h=(g-b)/d + (g<b?6:0); break;
        case g: h=(b-r)/d + 2; break;
        case b: h=(r-g)/d + 4; break;
      }
      h/=6;
    }
    return {h:h*360,s,l};
  }
  function mix(a,b,t){ // a,b: {r,g,b}  t in [0..1] (0=a,1=b)
    return { r:Math.round(a.r*(1-t)+b.r*t),
             g:Math.round(a.g*(1-t)+b.g*t),
             b:Math.round(a.b*(1-t)+b.b*t) };
  }
  function rgbaStr(c, alpha){ return `rgba(${c.r},${c.g},${c.b},${alpha})`; }

  // Dynamic target color: blend GOLD with archetype overlay tone
  const GOLD = {r:212,g:175,b:55};
  function computeTargetColor(){
    const arch = cssArchColor();
    const {h} = rgbToHsl(arch.r,arch.g,arch.b);
    // Hue-aware weights:
    // blue/cyan (180-240): cooler => favor overlay more (0.65)
    // pink/magenta (300-345): warmer => favor gold more (0.35 overlay)
    // green/teal (120-180): balanced (0.5)
    // else default (0.45)
    let t = 0.45;
    if (h>=180 && h<=240) t = 0.65;
    else if (h>=300 && h<=345) t = 0.35;
    else if (h>=120 && h<180) t = 0.5;
    // Nova tweak: if hue ~320 ±10 → even warmer (0.30 overlay)
    if (h>=310 && h<=330) t = 0.30;
    // Atlas tweak: if hue ~210 ±10 → even cooler (0.72 overlay)
    if (h>=200 && h<=220) t = 0.72;
    return mix(GOLD, arch, t);
  }

  // Canvas + WebAudio ----------------------------------------
  function ensureCanvas(){
    const host = document.getElementById('orbWrap') || document.querySelector('.arch-circle') || document.body;
    let cvs = host.querySelector('canvas.pulse-synth');
    if(!cvs){
      cvs = document.createElement('canvas');
      cvs.className = 'pulse-synth';
      host.appendChild(cvs);
    }
    return cvs;
  }

  let ctx, src, analyser, data, rafId;
  function initAudio(){
    if(ctx) return;
    try{
      ctx = new (window.AudioContext || window.webkitAudioContext)();
      src = ctx.createMediaElementSource(media);
      analyser = ctx.createAnalyser();
      analyser.fftSize = 512;
      src.connect(analyser);
      analyser.connect(ctx.destination);
      data = new Uint8Array(analyser.frequencyBinCount);
    }catch(e){
      ctx = null;
    }
  }

  function startSynth(){
    const cvs = ensureCanvas();
    const dpr = Math.max(1, window.devicePixelRatio||1);
    function resize(){
      const rect = cvs.getBoundingClientRect();
      cvs.width = Math.round(rect.width * dpr);
      cvs.height = Math.round(rect.height * dpr);
    }
    resize();
    window.addEventListener('resize', resize);

    const g = cvs.getContext('2d');
    let t = 0;
    let cached = computeTargetColor();
    let changeTick = 0;

    function strokeArch(alpha){
      // Occasionally refresh in case --arch-color changed
      if ((++changeTick % 30) === 0) cached = computeTargetColor();
      return rgbaStr(cached, alpha);
    }

    function drawFallback(){
      const {width:w, height:h} = cvs;
      g.clearRect(0,0,w,h);
      g.globalCompositeOperation = 'screen';
      const cx = w/2, cy = h/2;
      const R = Math.min(w,h)*0.38;
      const rings = 6;
      for(let i=0;i<rings;i++){
        const r = R*(0.42 + i*0.12 + 0.06*Math.sin( (t*0.01) + i ));
        g.beginPath();
        g.arc(cx, cy, r, 0, Math.PI*2);
        g.strokeStyle = strokeArch(0.18 - i*0.02);
        g.lineWidth = Math.max(1, r*0.004);
        g.shadowColor = strokeArch(0.22);
        g.shadowBlur = 8;
        g.stroke();
      }
      t += 16;
    }

    function drawAnalyser(){
      const {width:w, height:h} = cvs;
      g.clearRect(0,0,w,h);
      g.globalCompositeOperation = 'screen';

      const cx = w/2, cy = h/2;
      const baseR = Math.min(w,h)*0.22;
      const maxR = Math.min(w,h)*0.46;
      if(analyser && data){
        analyser.getByteTimeDomainData(data);
        let sum = 0;
        for(let i=0;i<data.length;i++){ sum += Math.abs(data[i]-128); }
        const avg = sum / data.length;
        const gain = Math.min(1, avg/26);

        const rings = 7;
        for(let r=0;r<rings;r++){
          const p = r/(rings-1);
          const radius = baseR + (maxR-baseR)*p*(0.8 + 0.2*Math.sin((t*0.01)+(r*0.55)));
          g.beginPath();
          g.arc(cx, cy, radius*(1+0.14*gain), 0, Math.PI*2);
          g.strokeStyle = strokeArch(0.10 + 0.25*(1-p)*gain);
          g.lineWidth = Math.max(1, radius*0.0048*(0.55+gain));
          g.shadowColor = strokeArch(0.28);
          g.shadowBlur = 10*(0.5+gain);
          g.stroke();
        }
        const grd = g.createRadialGradient(cx,cy, baseR*0.10, cx,cy, maxR*0.9);
        // inner glow adapts as well
        const inner = strokeArch(0.16 + 0.12*gain);
        const outer = strokeArch(0);
        grd.addColorStop(0, inner);
        grd.addColorStop(1, outer);
        g.fillStyle = grd;
        g.beginPath();
        g.arc(cx,cy, maxR, 0, Math.PI*2);
        g.fill();
      }else{
        drawFallback();
      }
      t += 16;
    }

    function loop(){
      drawAnalyser();
      rafId = requestAnimationFrame(loop);
    }
    if(!rafId) loop();

    cvs.classList.add('active');
    return () => {
      cvs.classList.remove('active');
      cancelAnimationFrame(rafId); rafId = null;
      const g2 = cvs.getContext('2d');
      g2 && g2.clearRect(0,0,cvs.width,cvs.height);
    };
  }

  let stopSynth = null;

  async function handlePlay(){
    try{ if(ctx && ctx.state === 'suspended') await ctx.resume(); }catch(e){}
    initAudio();
    if(!stopSynth) stopSynth = startSynth();
  }
  function handlePause(){ if(stopSynth){ stopSynth(); stopSynth = null; } }

  media.addEventListener('play', handlePlay);
  media.addEventListener('playing', handlePlay);
  media.addEventListener('pause', handlePause);
  media.addEventListener('ended', handlePause);

  if(!media.paused && !media.ended){ handlePlay(); }
})();

/* ===== arch-theme-sync.js ===== */
/**
 * Archetype Theme Sync via postMessage
 * Parent listens: { type: 'arch:theme', color: '#rrggbb' | 'rgb(...)', overlayStrength?: 0..1 }
 * Parent requests: postMessage({ type: 'arch:hello' })
 */
(function(){
  const root = document.documentElement;
  const iframe = document.getElementById('arch-frame') || document.querySelector('iframe#arch-frame, .arch-circle iframe');
  const DEFAULT_COLOR = getComputedStyle(root).getPropertyValue('--arch-color').trim() || '#d4af37';

  function clamp01(x){ x = Number(x); return isFinite(x) ? Math.max(0, Math.min(1, x)) : 0.18; }
  function setTheme({color, overlayStrength}){
    if (color) {
      try { root.style.setProperty('--arch-color', color); } catch(e){}
    }
    if (overlayStrength != null) {
      // strength in 0..1 → percentage string
      const pct = Math.round(clamp01(overlayStrength)*100) + '%';
      root.style.setProperty('--arch-overlay-strength', pct);
      // recompute arch-overlay var (for older browsers it's okay to rely on CSS color-mix with updated var)
      // No direct recompute needed; CSS updates automatically where used.
    }
  }

  // Listen from child iframes
  window.addEventListener('message', (ev)=>{
    const data = ev?.data;
    if (!data || typeof data !== 'object') return;
    if (data.type !== 'arch:theme') return;
    // Optional: restrict by expected origins if you have them. For now, accept from any for local dev.
    setTheme({ color: data.color || DEFAULT_COLOR, overlayStrength: data.overlayStrength });
  });

  // Ask child to publish theme (handshake) on load
  function requestTheme(){
    if (!iframe || !iframe.contentWindow) return;
    try { iframe.contentWindow.postMessage({ type: 'arch:hello' }, '*'); } catch(e){}
  }
  if (iframe){
    iframe.addEventListener('load', requestTheme);
    // also request shortly after DOMReady (in case load already fired)
    document.addEventListener('DOMContentLoaded', ()=> setTimeout(requestTheme, 250));
  }

  // Expose a manual setter for debugging
  window.setArchTheme = (color='#8a2be2', overlayStrength=0.18) => setTheme({color, overlayStrength});
})();

/* ===== arch-debug-hud-script.js ===== */
(function(){
  const root = document.documentElement;
  let hud, fps=0, last=performance.now(), frames=0;
  let lastLatency = 0;
  let logs = []; // last 3 entries

  function getVar(name, fallback=''){
    const v = getComputedStyle(root).getPropertyValue(name).trim();
    return v || fallback;
  }
  function parsePercent(str, fallback=18){
    if (!str) return fallback;
    const m = /([\d.]+)%/.exec(str);
    if (m) return parseFloat(m[1]);
    const n = parseFloat(str);
    return isFinite(n) ? n*100 : fallback;
  }
  function hexFromColor(str){
    try{
      const ctx = document.createElement('canvas').getContext('2d');
      ctx.fillStyle = str;
      const norm = ctx.fillStyle; // "rgb(r,g,b)"
      const m = norm.match(/\d+/g).map(Number);
      const toHex = (n)=> ('0'+n.toString(16)).slice(-2);
      return '#'+toHex(m[0])+toHex(m[1])+toHex(m[2]);
    }catch(e){ return str; }
  }
  function ls(k, d=null){ try{ const v = localStorage.getItem(k); return v ?? d; }catch(e){ return d; } }

  function addLog(role, text){
    const time = new Date().toLocaleTimeString();
    logs.push({ role, text, time });
    logs = logs.slice(-3);
    if (hud && hud.classList.contains('show')) renderLogs();
  }
  function renderLogs(){
    const box = hud.querySelector('#hudLog');
    if (!box) return;
    box.innerHTML = logs.map(l => {
      const tag = l.role === 'user' ? '🧑' : (l.role === 'ai' ? '🤖' : '🕑');
      return `<div class="logitem"><span class="t">${l.time}</span> <span class="r">${tag}</span> <span class="m">${(l.text||'').slice(0,120)}</span></div>`;
    }).join('') || `<div class="logitem muted">(sem mensagens)</div>`;
  }

  function ensureHUD(){
    if (hud) return hud;
    hud = document.createElement('div');
    hud.id = 'archDebugHUD';
    hud.innerHTML = `
      <h3>Luxara HUD</h3>
      <div class="row">
        <div class="tag">Archetype Color</div>
        <div class="swatch" id="hudSwatch"></div>
        <div class="chip mono" id="hudColor">#000000</div>
      </div>
      <div class="row">
        <div class="tag">Overlay Strength</div>
        <div class="chip" id="hudStrength">18%</div>
      </div>
      <div class="row">
        <div class="tag">Synth FPS</div>
        <div class="chip" id="hudFPS">0</div>
      </div>
      <div class="row">
        <div class="tag">OpenRouter Model</div>
        <div class="chip mono" id="hudModel">—</div>
      </div>
      <div class="row">
        <div class="tag">Last Latency</div>
        <div class="chip" id="hudLatency">— ms</div>
      </div>
      <div class="row controls">
        <button class="btn" id="btnOverlay">Overlay: ON</button>
        <input class="vol" id="hudVol" type="range" min="0" max="100" value="80" title="Volume do splash"/>
        <button class="btn" id="btnTest">Testar OpenRouter</button>
      </div>
      <div class="row">
        <div class="tag">Mini Log</div>
      </div>
      <div id="hudLog" style="max-height:120px; overflow:auto; padding:6px 8px; border-radius:10px; border:1px solid rgba(255,255,255,.14); background:rgba(255,255,255,.06); font: 600 11px/1.3 ui-sans-serif, system-ui;">
        <div class="logitem muted">(sem mensagens)</div>
      </div>
      <div class="hint">Toggle HUD: <strong>Alt+T</strong></div>`;
    document.body.appendChild(hud);

    // style tweaks for log items
    const css = document.createElement('style');
    css.textContent = `#archDebugHUD .logitem{display:flex;gap:6px;align-items:center;margin:2px 0}
      #archDebugHUD .logitem .t{opacity:.6;min-width:48px}
      #archDebugHUD .logitem .r{min-width:18px}
      #archDebugHUD .logitem .m{opacity:.95;white-space:nowrap;text-overflow:ellipsis;overflow:hidden;max-width:32vw}
      #archDebugHUD .logitem.muted{opacity:.5}`;
    document.head.appendChild(css);

    // Controls
    const btnOverlay = hud.querySelector('#btnOverlay');
    const rngVol = hud.querySelector('#hudVol');
    const btnTest = hud.querySelector('#btnTest');
    const audio = document.getElementById('splashSound');

    function refreshOverlayBtn(){
      const off = root.getAttribute('data-overlay') === 'off';
      btnOverlay.textContent = 'Overlay: ' + (off ? 'OFF' : 'ON');
    }
    btnOverlay.addEventListener('click', ()=>{
      const off = root.getAttribute('data-overlay') === 'off';
      if (off) root.removeAttribute('data-overlay');
      else root.setAttribute('data-overlay', 'off');
      refreshOverlayBtn();
      updateHUD();
      addLog('sys','overlay: ' + (off ? 'on' : 'off'));
    });
    refreshOverlayBtn();

    if (audio){
      rngVol.value = Math.round((audio.volume ?? 0.8)*100);
      rngVol.addEventListener('input', ()=>{
        try{ audio.volume = rngVol.value/100; addLog('sys','vol: '+rngVol.value+'%'); }catch(e){}
      });
    } else {
      rngVol.disabled = true;
      rngVol.title = "Áudio não encontrado (#splashSound)";
    }

    btnTest.addEventListener('click', async ()=>{
      const msg = "ping Luxara";
      addLog('user', msg);
      // Preferir kobSend se existir (usa feed e renderizador)
      if (typeof window.kobSend === 'function'){
        try{
          window.__luxNet?.start();
          await window.kobSend(msg);
          window.__luxNet?.end();
          addLog('ai','(ver feed)');
        }catch(e){
          addLog('sys','kobSend falhou: '+(e?.message||e));
        }
        return;
      }
      // Fallback: request simples ao OpenRouter e empurra no feed
      try{
        const FEED = document.getElementById('chatFeed') || document.querySelector('#feed,#chat-feed,.chat-feed');
        const LS = localStorage;
        const KEY = LS.getItem("openrouter:key") || LS.getItem("openrouter_key") || "<COLE_SUA_CHAVE_AQUI>";
        const MODEL = LS.getItem("openrouter:model") || "openai/gpt-4o-mini";
        const url = "https://openrouter.ai/api/v1/chat/completions";
        const headers = {
          "Authorization": "Bearer " + KEY,
          "Content-Type": "application/json",
          "HTTP-Referer": location.origin || "http://localhost",
          "X-Title": "HUB UNO"
        };
        const body = {
          model: MODEL,
          messages: [{ role:"system", content:"Você é o A.Infodose no HUB UNO (KOB-DUX). Responda curto, simbólico e útil." },
                     { role:"user", content: msg }],
          stream:false
        };
        window.__luxNet?.start();
        const resp = await fetch(url, { method:"POST", headers, body: JSON.stringify(body) });
        const data = await resp.json();
        window.__luxNet?.end();
        const text = data?.choices?.[0]?.message?.content || "(sem conteúdo)";
        addLog('ai', text);
        // render no feed básico se houver
        if (FEED){
          const wrap = document.createElement('div');
          wrap.className = 'msg ai-rich';
          const box = document.createElement('div');
          box.className = 'render-html';
          box.innerHTML = `<div class="pages-wrapper"></div><div id="pageIndicator" style="font:12px/1.4 ui-monospace;color:#94b6d6;margin-top:6px"></div>`;
          wrap.appendChild(box);
          FEED.appendChild(wrap);
          if (window.renderResponse) window.renderResponse(text);
          FEED.scrollTop = FEED.scrollHeight;
        }
      }catch(e){
        addLog('sys','fallback falhou: '+(e?.message||e));
      }
    });

    return hud;
  }

  function readModel(){
    return ls("openrouter:model") || ls("openrouter_model") || "openai/gpt-4o-mini";
  }

  function updateHUD(){
    const h = ensureHUD();
    const c = getVar('--arch-color', '#d4af37');
    const pct = parsePercent(getVar('--arch-overlay-strength','18%'));
    const sw = h.querySelector('#hudSwatch');
    const hc = h.querySelector('#hudColor');
    const hs = h.querySelector('#hudStrength');
    const hf = h.querySelector('#hudFPS');
    const hm = h.querySelector('#hudModel');
    const hl = h.querySelector('#hudLatency');
    if (sw) sw.style.background = c;
    if (hc) hc.textContent = hexFromColor(c);
    if (hs) hs.textContent = Math.round(pct) + '%';
    if (hf) hf.textContent = Math.round(fps);
    if (hm) hm.textContent = readModel();
    if (hl) hl.textContent = lastLatency ? (Math.round(lastLatency)+' ms') : '— ms';
  }

  function measureFPS(now){
    frames++;
    if (now - last >= 1000){
      fps = (frames * 1000) / (now - last);
      frames = 0; last = now;
      if (hud && hud.classList.contains('show')) updateHUD();
    }
    requestAnimationFrame(measureFPS);
  }
  requestAnimationFrame(measureFPS);

  window.addEventListener('keydown', (ev)=>{
    if (ev.altKey && (ev.key.toLowerCase() === 't')){
      const h = ensureHUD();
      h.classList.toggle('show');
      if (h.classList.contains('show')) updateHUD();
    }
  });

  window.addEventListener('message', (ev)=>{
    if (ev?.data?.type === 'arch:theme' && hud && hud.classList.contains('show')){
      setTimeout(updateHUD, 50);
    }
  });

  // Latency API
  const net = {
    _t: 0,
    start(){ this._t = performance.now(); },
    end(){
      if (!this._t) return;
      lastLatency = performance.now() - this._t;
      this._t = 0;
      if (hud && hud.classList.contains('show')) updateHUD();
      try{ console.info('[LuxNet] last latency:', Math.round(lastLatency), 'ms'); }catch(e){}
    }
  };
  window.__luxHud = { show(){ ensureHUD().classList.add('show'); updateHUD(); },
                      hide(){ ensureHUD().classList.remove('show'); },
                      update: updateHUD };
  window.__luxNet = net;

  // Public log API (optional)
  window.__luxLog = { add: addLog, render: ()=>{ if (hud) renderLogs(); } };
})();

/* ===== app-icons-script.js ===== */
// Inline SVG icon registry + auto-attach for known apps and local uploads (with de-dupe & cleanup)
(function(){
  const ICONS = {
    artemis: `<svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 3l3.5 6 6 3.5-6 3.5L12 21l-3.5-5.9L2 12.5 8.5 9 12 3z"></path>
                <circle cx="12" cy="12" r="2.2"></circle>
              </svg>`,
    naviga:  `<svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 2l3 9 7 3-7 3-3 7-3-7-7-3 7-3 3-9z"></path>
              </svg>`,
    atlas:   `<svg viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="12" cy="12" r="8"></circle>
                <path d="M4 12h16M12 4v16"></path>
              </svg>`,
    nova:    `<svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 2v6M12 16v6M2 12h6M16 12h6M4.5 4.5l4.2 4.2M15.3 15.3l4.2 4.2M4.5 19.5l4.2-4.2M15.3 8.7l4.2-4.2"></path>
              </svg>`,
    serena:  `<svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M4 12a8 8 0 0016 0c0-3.9-3.6-7-8-7s-8 3.1-8 7z"></path>
                <path d="M8 12a4 4 0 008 0"></path>
              </svg>`,
    kaion:   `<svg viewBox="0 0 24 24" aria-hidden="true">
                <rect x="5" y="5" width="14" height="14" rx="3"></rect>
                <path d="M9 9l6 6M15 9l-6 6"></path>
              </svg>`,
    manifesta:`<svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M4 12l4 4 12-12"></path>
                <rect x="3" y="3" width="18" height="18" rx="4" fill="none"></rect>
              </svg>`,
    _default:`<svg viewBox="0 0 24 24" aria-hidden="true">
                <rect x="4" y="4" width="16" height="16" rx="4"></rect>
                <path d="M8 8h8v8H8z" fill="none"></path>
              </svg>`
  };

  function chooseBadge(name){
    const n = (name||'').toLowerCase();
    if (n.includes('nova')) return 'badge-pink';
    if (n.includes('naviga')) return 'badge-blue';
    if (n.includes('artemis')) return 'badge-orange';
    if (n.includes('atlas')) return 'badge-blue';
    if (n.includes('kaion')) return 'badge-green';
    if (n.includes('serena')) return 'badge-pink';
    if (n.includes('manifesta') || n.includes('manifest a')) return 'badge-green';
    return 'badge-default';
  }
  function getIcon(name){
    if (!name) return ICONS._default;
    const key = name.toLowerCase();
    if (ICONS[key]) return ICONS[key];
    if (key === 'manifest a' || key === 'manifesta' || key === 'manifesta a') return ICONS.manifesta;
    return ICONS._default;
  }

  // Remove fallback "?" badges/icons commonly used by templates
  function cleanupFallbacks(el){
    // Heuristic: elements that look like icon/badge and textContent is exactly "?"
    el.querySelectorAll('.icon, .badge, .avatar, [data-icon], [aria-label*="icon"], [aria-label*="ícone"]').forEach(node=>{
      const t = (node.textContent||'').trim();
      // remove only if it's a simple question mark or a single-char fallback
      if (t === '?' || t.length === 1) {
        node.remove();
      }
    });
    // Remove duplicated .app-icon (keep the first)
    const icons = el.querySelectorAll('.app-icon');
    if (icons.length > 1){
      for (let i=1;i<icons.length;i++) icons[i].remove();
    }
  }

  function ensureIconFor(item){
    const { el, title } = item;
    if (!el) return;
    // If already has one of OUR icons, bail
    if (el.querySelector('.app-icon[data-kdx="icon"]')) return;

    // If it has an .app-icon de outro lugar: preferimos substituir se for vazio/fallback
    const existing = el.querySelector('.app-icon');
    if (existing){
      // If existing contains an SVG, assume it's valid and do not duplicate
      if (existing.querySelector('svg')) return;
      // else, replace contents
      existing.setAttribute('data-kdx','icon');
      existing.classList.add(chooseBadge(title));
      existing.innerHTML = getIcon(title);
      cleanupFallbacks(el);
      return;
    }

    // Otherwise, remove fallback '?' badges and inject ours
    cleanupFallbacks(el);

    const wrap = document.createElement('span');
    wrap.className = 'app-icon ' + chooseBadge(title);
    wrap.setAttribute('data-kdx','icon');
    wrap.innerHTML = getIcon(title);

    const anchor = el.querySelector('.title, .app-title, [data-title], .label, .name, h3, h4, b, strong, span');
    if (anchor && anchor.parentNode === el){
      anchor.before(wrap);
    } else if (anchor && anchor.parentNode){
      anchor.parentNode.insertBefore(wrap, anchor);
    } else {
      el.insertBefore(wrap, el.firstChild);
    }
  }

  function findAppItems(){
    const candidates = [];
    document.querySelectorAll('.app-item, .app-card, .menuItem').forEach(el => {
      const id = el.getAttribute('data-app-id') || el.getAttribute('data-id') || '';
      const titleEl = el.querySelector('[data-title], .title, .app-title, .label, .name, h3, h4, b, strong');
      const title = (titleEl?.textContent || id || el.getAttribute('data-name') || '').trim();
      candidates.push({ el, title });
    });
    document.querySelectorAll('[data-app], [data-app-name], a.app, button.app').forEach(el=>{
      const title = el.getAttribute('data-app-name') || el.getAttribute('data-app') || el.textContent.trim();
      candidates.push({ el, title });
    });
    return candidates;
  }

  function pass(){
    const items = findAppItems();
    items.forEach(ensureIconFor);
  }
  pass();

  const obs = new MutationObserver((muts)=>{
    let need=false;
    for (const m of muts){
      if (m.addedNodes && m.addedNodes.length) { need = true; break; }
    }
    if (need) setTimeout(pass, 60);
  });
  obs.observe(document.body, { childList:true, subtree:true });

  window.__appIcons = { refresh: pass };
})();

/* ===== app-accents-kisara-js.js ===== */
(() => {
  const APP_COLORS = {
    'Atlas': ['#409EFF','#8fd3ff'],
    'Nova': ['#ff52e5','#f8c058'],
    'Vitalis': ['#ff9f43','#39ffb6'],
    'Pulse': ['#8a2be2','#00e5ff'],
    'Artemis': ['#00c2ff','#39ffb6'],
    'Serena': ['#b08fff','#ffadad'],
    'Kaos': ['#ff9f43','#ff4d6d'],
    'Genus': ['#a3ff4d','#00e5ff'],
    'Lumine': ['#ffd700','#ff7ab6'],
    'Rhea': ['#ff7aa2','#ffa5d8'],
    'Solus': ['#4b6fff','#8fd3ff'],
    'Aion': ['#2dd4bf','#10b981'],
  };

  // Apply per-app accent
  function applyAppAccents(){
    document.querySelectorAll('.app-card').forEach(card => {
      const titleEl = card.querySelector('.app-title');
      if (!titleEl) return;
      const full = titleEl.getAttribute('title') || titleEl.textContent || '';
      // Expected format "Atlas · Cartesius" or "Atlas ·…"
      const root = full.split('·')[0].trim();
      const colors = APP_COLORS[root];
      if (!colors) return;
      card.style.setProperty('--appA', colors[0]);
      card.style.setProperty('--appB', colors[1]);
      card.classList.add('accented');
    });
  }

  // Prevent duplicate icon fallback (safety, replica correção da base)
  function dedupeAppIcons(){
    document.querySelectorAll('.app-card .app-icon').forEach(ico => {
      const icons = Array.from(ico.querySelectorAll('svg,img'));
      if (icons.length <= 1) return;
      let keep = icons.find(n => n.tagName === 'SVG') || icons[0];
      icons.forEach(n => { if (n !== keep) n.remove(); });
    });
  }

  // Archetype overlay sync (tone matches archetype)
  const ARCH_COLORS = {
    'atlas':  { color: '#409EFF', overlay: 'rgba(64,158,255,0.22)' },
    'nova':   { color: '#ff52e5', overlay: 'rgba(255,82,229,0.22)' },
    'vitalis':{ color: '#2dd4bf', overlay: 'rgba(45,212,191,0.20)' },
    'pulse':  { color: '#8a2be2', overlay: 'rgba(138,43,226,0.20)' },
    'artemis':{ color: '#00c2ff', overlay: 'rgba(0,194,255,0.20)' },
    'serena': { color: '#b08fff', overlay: 'rgba(176,143,255,0.20)' },
    'kaos':   { color: '#ff9f43', overlay: 'rgba(255,159,67,0.20)' },
    'genus':  { color: '#a3ff4d', overlay: 'rgba(163,255,77,0.18)' },
    'lumine': { color: '#ffd700', overlay: 'rgba(255,215,0,0.18)' },
    'rhea':   { color: '#ff7aa2', overlay: 'rgba(255,122,162,0.20)' },
    'solus':  { color: '#4b6fff', overlay: 'rgba(75,111,255,0.20)' },
    'aion':   { color: '#10b981', overlay: 'rgba(16,185,129,0.20)' },
  };
  function currentArchKey(){
     const sel = document.getElementById('arch-select');
     if (!sel) return 'atlas';
     const opt = sel.value || '';
     const m = opt.match(/\/([a-z]+)\.html$/i);
     return m ? m[1].toLowerCase() : 'atlas';
  }
  function applyOverlayFromArch(){
     const key = currentArchKey();
     const cfg = ARCH_COLORS[key] || ARCH_COLORS['atlas'];
     document.documentElement.style.setProperty('--arch-color', cfg.color);
     document.documentElement.style.setProperty('--arch-overlay', cfg.overlay);
     const call = document.getElementById('orbCall');
     if (call) call.style.textShadow = `0 0 12px ${cfg.color}80`;
  }
  function wireArchSelect(){
    const sel = document.getElementById('arch-select');
    if (!sel) return;
    sel.addEventListener('change', applyOverlayFromArch);
  }

  // "Toque o pulso" CTA + synth
  function ensurePulseCTA(){
    const wrap = document.getElementById('orbWrap');
    if (!wrap || wrap.querySelector('.pulse-cta')) return;
    const cta = document.createElement('div');
    cta.className = 'pulse-cta hidden';
    cta.innerHTML = '<div class="dot"></div><div class="label">toque o pulso</div>';
    wrap.appendChild(cta);
    cta.addEventListener('click', () => {
      hideCTA();
      startSynthSplash();
      tryResumeAudio();
    }, { once: true });
    window._pulseCTA = { show: showCTA, hide: hideCTA };
    function showCTA(){ cta.classList.remove('hidden'); }
    function hideCTA(){ cta.classList.add('hidden'); }
  }

  function tryResumeAudio(){
    const ctx = window.__AUDIO_CTX__ || (window.AudioContext ? new AudioContext() : null);
    if (ctx && ctx.state === 'suspended') { ctx.resume().catch(()=>{}); }
    const el = document.getElementById('splashSound');
    if (el) { el.volume = 0.0; el.play().catch(()=>{}); setTimeout(()=>{ try{ el.pause(); el.currentTime = 0; }catch{} }, 200); }
    window.dispatchEvent(new CustomEvent('kobllux:audio:resume'));
  }

  function startSynthSplash(){
    const wrap = document.getElementById('orbWrap');
    if (!wrap) return;
    let canvas = wrap.querySelector('canvas#pulseSynth');
    if (!canvas) {
      canvas = document.createElement('canvas');
      canvas.id = 'pulseSynth';
      canvas.className = 'pulse-synth';
      wrap.appendChild(canvas);
    }
    const ctx = canvas.getContext('2d');
    function resize(){ canvas.width = canvas.clientWidth; canvas.height = canvas.clientHeight; }
    resize(); window.addEventListener('resize', resize);
    canvas.classList.add('active');
    const t0 = performance.now();
    const dur = 1500;
    const rootStyles = getComputedStyle(document.documentElement);
    const colorA = rootStyles.getPropertyValue('--arch-color').trim() || '#d4af37';
    function paint(t){
      const p = Math.min(1, (t - t0)/dur);
      ctx.clearRect(0,0,canvas.width,canvas.height);
      const cx = canvas.width/2, cy = canvas.height/2;
      const maxR = Math.min(cx,cy);
      for (let i=0;i<4;i++){
        const k = p*1.1 - i*0.18;
        if (k <= 0) continue;
        const r = maxR * k;
        const g = ctx.createRadialGradient(cx, cy, Math.max(0,r-28), cx, cy, r);
        g.addColorStop(0, colorA + '80');
        g.addColorStop(1, '#0000');
        ctx.beginPath();
        ctx.fillStyle = g;
        ctx.arc(cx, cy, r, 0, Math.PI*2);
        ctx.fill();
      }
      if (p < 1){ requestAnimationFrame(paint); } else {
        canvas.classList.remove('active');
        ctx.clearRect(0,0,canvas.width,canvas.height);
      }
    }
    requestAnimationFrame(paint);
  }

  // Detect autoplay block → show CTA
  function detectAudioGate(){
    const el = document.getElementById('splashSound');
    if (!el) return;
    el.play().then(() => {
      el.pause(); el.currentTime = 0;
      if (window._pulseCTA) window._pulseCTA.hide();
    }).catch(() => {
      if (window._pulseCTA) window._pulseCTA.show();
    });
  }

  function boot(){
    applyAppAccents();
    dedupeAppIcons();
    applyOverlayFromArch();
    wireArchSelect();
    ensurePulseCTA();
    detectAudioGate();
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();

/* ===== uno-consolidation-patch.js ===== */
/* === UNO CONSOLIDATION PATCH v1 (monolithic-safe) =====================
   - Canonical OpenRouter key/model handling
   - Safe override for sendAIMessage / sendAIMessageCtx
   - Unified applyArchOverlay()
   - Single boot() guard
   ==================================================================== */
(function(){
  if (window.Uno && window.Uno.__consolidated_v1) return;
  window.Uno = window.Uno || {};
  const Uno = window.Uno;
  Uno.__consolidated_v1 = true;

  // ---- Helpers ----
  function LSget(k){ try { return localStorage.getItem(k) || ''; } catch(e){ return ''; } }
  function speak(msg){ try { if (typeof window.speakWithActiveArch === 'function') window.speakWithActiveArch(msg); } catch(e){} }
  function toast(msg){ try { if (typeof window.toast === 'function') window.toast(msg,'ok'); } catch(e){} }
  function warn(msg){ try { if (typeof window.toast === 'function') window.toast(msg,'warn'); } catch(e){} }
  function errt(msg){ try { if (typeof window.toast === 'function') window.toast(msg,'err'); } catch(e){} }
  function feed(type, text){ try { if (typeof window.feedPush === 'function') window.feedPush(type, text); } catch(e){} }
  function showArchMessage(text, type){ try { if (typeof window.showArchMessage === 'function') window.showArchMessage(text, type); } catch(e){} }

  // ---- Canonical OpenRouter config ----
  Uno.getOpenRouter = function(){
    const sk = LSget('dual.keys.openrouter') || LSget('infodose:sk') || '';
    let model = LSget('dual.openrouter.model') || LSget('infodose:model') || 'openrouter/auto';
    return { sk, model };
  };

  Uno.sendChat = async function({messages, model, sk, max_tokens=600, temperature=0.7}){
    if (!sk){
      showArchMessage('Defina sua chave no Brain (OpenRouter).', 'warn');
      feed('status', 'OpenRouter: chave ausente.');
      throw new Error('OpenRouter key missing');
    }
    const url = 'https://openrouter.ai/api/v1/chat/completions';
    const payload = { model, messages, max_tokens, temperature };
    const res = await fetch(url, {
      method:'POST',
      headers:{
        'Content-Type':'application/json',
        'Authorization': `Bearer ${sk}`
      },
      body: JSON.stringify(payload)
    });
    if (!res.ok){
      const body = await res.text().catch(()=>'');
      const msg = `OpenRouter HTTP ${res.status} ${body ? '• '+body.slice(0,160) : ''}`;
      feed('status', 'Erro: ' + msg);
      throw new Error(msg);
    }
    const data = await res.json();
    return data?.choices?.[0]?.message?.content || '';
  };

  // ---- Override sendAIMessage / sendAIMessageCtx (final authority) ----
  const prevCtx = window.sendAIMessageCtx;
  const prev    = window.sendAIMessage;

  window.sendAIMessageCtx = async function({ userContent, sk, model, system, temperature, max_tokens } = {}){
    try{
      const conf = Uno.getOpenRouter();
      const _sk = sk || conf.sk;
      const _model = model || conf.model || 'openrouter/auto';
      const sysMsg = system || 'Você é um assistente em português. Seja claro e objetivo.';
      const messages = [
        { role:'system', content: sysMsg },
        { role:'user', content: String(userContent||'').trim() }
      ];
      const reply = await Uno.sendChat({ messages, model:_model, sk:_sk, max_tokens: max_tokens??600, temperature: temperature??0.7 });
      return reply;
    }catch(e){
      errt('Falha sendAIMessageCtx: ' + e.message);
      throw e;
    }
  };

  window.sendAIMessage = async function(content, sk, model){
    return window.sendAIMessageCtx({ userContent: content, sk, model });
  };

  // ---- Overlay unify ----
  const ARCH_OVERLAYS = {
    atlas:  'rgba(64,158,255,0.22)',
    nova:   'rgba(255,82,177,0.22)',
    vitalis:'rgba(87,207,112,0.22)',
    pulse:  'rgba(0,191,255,0.22)',
    artemis:'rgba(255,195,0,0.22)',
    serena: 'rgba(186,130,219,0.22)',
    kaos:   'rgba(255,77,109,0.22)',
    genus:  'rgba(87,207,112,0.22)',
    lumine: 'rgba(255,213,79,0.22)',
    solus:  'rgba(186,130,219,0.22)',
    rhea:   'rgba(0,209,178,0.22)',
    aion:   'rgba(255,159,67,0.22)',
    default:'rgba(0,0,0,0)'
  };
  window.applyArchOverlay = function(name){
    try{
      const on = (localStorage.getItem('arch:overlayOn') === 'true') || (localStorage.getItem('arch:overlayOn') === '1');
      const key = String(name||'').toLowerCase();
      const color = on ? (ARCH_OVERLAYS[key] || ARCH_OVERLAYS.default) : 'rgba(0,0,0,0)';
      document.documentElement.style.setProperty('--arch-overlay', color);
      const fade = document.getElementById('arch-fadeCover');
      if (fade) fade.style.background = color;
      document.documentElement.setAttribute('data-overlay', on ? 'on' : 'off');
    }catch(e){}
  };

  // ---- Boot unify ----
  Uno.__booted = false;
  Uno.boot = function(){
    if (Uno.__booted) return;
    Uno.__booted = true;
    try {
      // Ensure overlay matches current archetype selection
      const sel = document.getElementById('arch-select');
      const base = (sel?.value || '').replace(/.*\//,'').replace(/\.html$/i,'');
      if (base) window.applyArchOverlay(base);
    } catch(e){}

    // Small connectivity helper
    window.Uno.testOpenRouter = async function(){
      const { sk, model } = Uno.getOpenRouter();
      if (!sk){ showArchMessage('Sem chave. Abra Brain e salve sua chave.', 'warn'); return; }
      try{
        const reply = await Uno.sendChat({ messages:[{role:'user', content:'Ping.'}], model, sk, max_tokens:60, temperature:0.1 });
        showArchMessage('OpenRouter OK', 'ok');
        feed('ai', 'Teste OpenRouter: ' + (reply||'(sem conteúdo)'));
      }catch(e){
        showArchMessage('OpenRouter falhou: ' + e.message, 'err');
      }
    };

    // Log
    try { console.log('%cUNO Consolidation v1 ready','background:#09223a;color:#9feaff;padding:2px 6px;border-radius:6px'); } catch(e){}
  };

  if (document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', Uno.boot, { once:true });
  } else {
    setTimeout(Uno.boot, 0);
  }
})();

/* ===== uno-fallback-patch-v1.js ===== */
(function(){ 
      if (!window.Uno || window.Uno.__fallback_patch_v1) return;
      const Uno = window.Uno; 
      Uno.__fallback_patch_v1 = true;

      function LSget(k){ try{ return localStorage.getItem(k) || ''; }catch(e){ return ''; } }
      function LSset(k,v){ try{ localStorage.setItem(k,v); }catch(e){ } }
      function feed(type, text){ try{ if (typeof window.feedPush === 'function') window.feedPush(type, text); }catch(e){ } }

      const DEFAULT_CHAIN = [
        'deepseek/deepseek-chat',
        'meta/llama-3.1-8b-instruct',
        'mistral/mistral-small-latest',
        'openrouter/auto'
      ];

      function chainFromLS(){
        const raw = LSget('dual.openrouter.fallback') || LSget('openrouter:fallback') || '';
        if (!raw) return DEFAULT_CHAIN.slice();
        return raw.split(',').map(s=>s.trim()).filter(Boolean);
      }

      // Wrap Uno.sendChat to add headers and timeout
      const _baseSend = Uno.sendChat;
      Uno.sendChat = async function({messages, model, sk, max_tokens=600, temperature=0.7, timeoutMs=30000}){
        if (!sk) throw new Error('OpenRouter key missing');
        const ctrl = new AbortController();
        const id = setTimeout(() => ctrl.abort('timeout'), timeoutMs);
        try {
          const url = 'https://openrouter.ai/api/v1/chat/completions';
          const payload = { model, messages, max_tokens, temperature };
          const res = await fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${sk}`,
              'HTTP-Referer': location.origin || 'http://localhost',
              'X-Title': 'HUB UNO'
            },
            body: JSON.stringify(payload),
            signal: ctrl.signal
          });
          if (!res.ok) {
            const body = await res.text().catch(()=>'');
            throw new Error(`OpenRouter HTTP ${res.status}` + (body ? ' • ' + body.slice(0,160) : ''));
          }
          const data = await res.json();
          return (data && data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) || '';
        } finally {
          clearTimeout(id);
        }
      };

      Uno.sendWithFallback = async function({messages, sk, preferredModel, max_tokens=600, temperature=0.7}){
        const chain = [ preferredModel || (Uno.getOpenRouter && Uno.getOpenRouter().model) || 'openrouter/auto' ]
                      .concat( chainFromLS() );
        const tried = new Set();
        let lastErr;
        for (const mdl of chain) {
          if (!mdl || tried.has(mdl)) continue;
          tried.add(mdl);
          try {
            feed('status', 'OpenRouter tentando: ' + mdl);
            const out = await Uno.sendChat({ messages, model: mdl, sk, max_tokens, temperature });
            feed('status', 'OpenRouter OK: ' + mdl);
            return out;
          } catch(e) {
            lastErr = e;
            feed('status', 'Falhou: ' + mdl + ' -> ' + (e && e.message ? e.message : e));
          }
        }
        throw lastErr || new Error('Nenhum modelo respondeu');
      };

      // Replace sendAIMessageCtx to use fallback
      const prevCtx = window.sendAIMessageCtx;
      window.sendAIMessageCtx = async function({ userContent, sk, model, system, temperature, max_tokens } = {}){
        const conf = Uno.getOpenRouter ? Uno.getOpenRouter() : { sk: '', model: 'openrouter/auto' };
        const _sk = sk || conf.sk;
        const _model = model || conf.model;
        const sysMsg = system || 'Você é um assistente em português. Seja claro e objetivo.';
        const messages = [
          { role: 'system', content: sysMsg },
          { role: 'user', content: String(userContent||'').trim() }
        ];
        return Uno.sendWithFallback({ messages, sk: _sk, preferredModel: _model, temperature: temperature ?? 0.7, max_tokens: max_tokens ?? 600 });
      };

      // Key/model compatibility layer (mirror keys both ways)
      (function syncKeys(){
        const k1 = LSget('dual.keys.openrouter') || '';
        const k2 = LSget('openrouter:key') || LSget('openrouter_key') || '';
        const k  = k1 || k2;
        if (k && !k1) LSset('dual.keys.openrouter', k);
        if (k && !k2) LSset('openrouter:key', k);

        const m1 = LSget('dual.openrouter.model') || '';
        const m2 = LSget('openrouter:model') || LSget('openrouter_model') || '';
        const m  = m1 || m2 || 'openrouter/auto';
        if (m && !m1) LSset('dual.openrouter.model', m);
        if (m && !m2) LSset('openrouter:model', m);
      })();
    })();

/* ===== ib-bus-sline.js ===== */
(function(){
  // --- Bus v2 (safe install) ---
  window.InfodoseBus = window.InfodoseBus || (function(){
    const L = JSON.parse(localStorage.getItem('infodose:log')||'[]');
    const H = {}; const last = new Map(); const MAX=400, THROTTLE_MS=60;
    const SCHEMA = {
      'ARCH_PULSE': { arch:'string', act:'string*' },
      'ACTION'    : { arch:'string*', act:'string*', route:'string*' },
      'HEAT_MARK' : { tag :'string*' }
    };
    const sane=(type,payload)=>{ const sch=SCHEMA[type]; if(!sch) return true;
      for(const k in sch){ const need=sch[k], opt=need.endsWith('*'), typ=opt?need.slice(0,-1):need;
        const v=payload[k]; if(v==null){ if(!opt) return false; } else if(typeof v!==typ) return false; } return true; };
    const push=evt=>{ L.unshift(evt); if(L.length>MAX) L.length=MAX;
      localStorage.setItem('infodose:log', JSON.stringify(L)); };
    return {
      emit(type, payload={}){
        const now=Date.now(), lastTs=last.get(type)||0;
        if (now-lastTs < THROTTLE_MS) return;
        if (!sane(type,payload)) return;
        last.set(type,now);
        const evt={ type, ts:now, ...payload }; push(evt);
        (H[type]||[]).forEach(fn=>{ try{ fn(evt) }catch(e){} });
        return evt;
      },
      on(type, fn){ (H[type]||(H[type]=[])).push(fn); return ()=> H[type]=(H[type]||[]).filter(f=>f!==fn); },
      dump(){ return L.slice(); }
    };
  })();

  // --- Paletas por arquétipo para a S-Line ---
  const SLC = {
    nova   : {a:'#FF52B1', b:'#FF9AD9', ring:'#FF52B1', glow:'rgba(255,82,177,.55)'},
    genus  : {a:'#52FFB1', b:'#9DFFC8', ring:'#52FFB1', glow:'rgba(82,255,177,.45)'},
    lumine : {a:'#AEC6FF', b:'#D6E0FF', ring:'#A7C4FF', glow:'rgba(167,196,255,.45)'},
    solus  : {a:'#CFE7FF', b:'#EAF2FF', ring:'#CFE7FF', glow:'rgba(207,231,255,.40)'},
    atlas  : {a:'#409EFF', b:'#7ABEFF', ring:'#3DB2FF', glow:'rgba(64,158,255,.45)'},
    rhea   : {a:'#FFD773', b:'#FFE6A3', ring:'#FFC84A', glow:'rgba(255,200,74,.45)'},
    kaos   : {a:'#FF4D6D', b:'#FF8AA1', ring:'#FF5A7A', glow:'rgba(255,77,109,.48)'},
    artemis: {a:'#FF8C3C', b:'#FFB06A', ring:'#FF9A52', glow:'rgba(255,140,60,.48)'},
    serena : {a:'#78C8FF', b:'#AEE0FF', ring:'#90D6FF', glow:'rgba(120,200,255,.45)'},
    aion   : {a:'#64F0FF', b:'#B4F9FF', ring:'#78F3FF', glow:'rgba(100,240,255,.45)'},
    pulse  : {a:'#00BFFF', b:'#3CE0FF', ring:'#00D9FF', glow:'rgba(0,191,255,.48)'},
    vitalis: {a:'#22D392', b:'#72E5BE', ring:'#29E3A3', glow:'rgba(34,211,146,.45)'}
  };
  const ARCH_EL = { nova:'madeira', genus:'madeira', lumine:'metal', solus:'metal',
    atlas:'terra', rhea:'terra', kaos:'fogo', artemis:'fogo', serena:'água', aion:'água', pulse:'ar', vitalis:'ar' };

  const SLINE = document.getElementById('ibSLine');
  function slineVars(arch){
    const C = SLC[arch] || {};
    const st = document.documentElement.style;
    st.setProperty('--ib-a', C.a || '#00c5ff');
    st.setProperty('--ib-b', C.b || '#ff52e5');
    st.setProperty('--ib-ring', C.ring || '#00d9ff');
    st.setProperty('--ib-glow', C.glow || 'rgba(0,197,255,.45)');
    if (SLINE){ SLINE.classList.add('flash'); setTimeout(()=>SLINE.classList.remove('flash'), 220); }
  }

  // --- WebAudio beeps simples + power-chord para METAL ---
  let _ac;
  function ac(){ return _ac || (_ac = new (window.AudioContext||window.webkitAudioContext)()); }
  function beep(freq=432, ms=160){
    try{ const ctx=ac(), o=ctx.createOscillator(), g=ctx.createGain();
      o.type='sine'; o.frequency.value=freq; o.connect(g); g.connect(ctx.destination);
      g.gain.setValueAtTime(.001,ctx.currentTime); g.gain.exponentialRampToValueAtTime(.22,ctx.currentTime+.02);
      o.start(); o.stop(ctx.currentTime + ms/1000);
    }catch(e){}
  }
  function powerChord(freq=220){
    try{
      const ctx=ac(); [1,1.5,2].forEach((m,i)=>{
        const o=ctx.createOscillator(), g=ctx.createGain();
        o.type= i? 'square':'sawtooth'; o.frequency.value=freq*m; o.connect(g); g.connect(ctx.destination);
        g.gain.setValueAtTime(.0001,ctx.currentTime);
        g.gain.exponentialRampToValueAtTime(.12/(i+1),ctx.currentTime+.01);
        g.gain.exponentialRampToValueAtTime(.0001,ctx.currentTime+.26);
        o.start(); o.stop(ctx.currentTime+.28);
      });
    }catch(e){}
  }

  // --- Hook nas trocas do arquétipo do HUB ---
  function currentArchBase(){
    const sel = document.getElementById('arch-select');
    if(!sel || sel.selectedIndex<0) return '';
    return (sel.options[sel.selectedIndex].value||'').replace(/.*\\//,'').replace(/\\.html$/i,'');
  }
  function fireArch(arch, act){
    slineVars(arch);
    const el = ARCH_EL[arch]; const freq = (arch==='nova'||arch==='vitalis')?528 : (arch==='atlas'?144 : (arch==='serena'||arch==='genus'?396 : 432));
    if (el==='metal') powerChord(freq); else beep(freq);
    window.InfodoseBus.emit('ARCH_PULSE', { arch, act: act||'switch' });
  }

  function bindHooks(){
    const sel  = document.getElementById('arch-select');
    const prev = document.getElementById('arch-prev');
    const next = document.getElementById('arch-next');
    sel && sel.addEventListener('change', ()=> setTimeout(()=> fireArch(currentArchBase(),'select'), 0), {passive:true});
    prev && prev.addEventListener('click', ()=> setTimeout(()=> fireArch(currentArchBase(),'prev'), 160), {passive:true});
    next && next.addEventListener('click', ()=> setTimeout(()=> fireArch(currentArchBase(),'next'), 160), {passive:true});
    // disparo inicial
    const start = currentArchBase(); if (start) setTimeout(()=> fireArch(start,'boot'), 120);
  }

  if (document.readyState==='loading') document.addEventListener('DOMContentLoaded', bindHooks); else bindHooks();
})();

/* ===== ib-apps-addon.js ===== */
(function(){
  // --- Palette clone (for S-Line update) ---
  const SLC = {
    nova   : {a:'#FF52B1', b:'#FF9AD9', ring:'#FF52B1', glow:'rgba(255,82,177,.55)'},
    genus  : {a:'#52FFB1', b:'#9DFFC8', ring:'#52FFB1', glow:'rgba(82,255,177,.45)'},
    lumine : {a:'#AEC6FF', b:'#D6E0FF', ring:'#A7C4FF', glow:'rgba(167,196,255,.45)'},
    solus  : {a:'#CFE7FF', b:'#EAF2FF', ring:'#CFE7FF', glow:'rgba(207,231,255,.40)'},
    atlas  : {a:'#409EFF', b:'#7ABEFF', ring:'#3DB2FF', glow:'rgba(64,158,255,.45)'},
    rhea   : {a:'#FFD773', b:'#FFE6A3', ring:'#FFC84A', glow:'rgba(255,200,74,.45)'},
    kaos   : {a:'#FF4D6D', b:'#FF8AA1', ring:'#FF5A7A', glow:'rgba(255,77,109,.48)'},
    artemis: {a:'#FF8C3C', b:'#FFB06A', ring:'#FF9A52', glow:'rgba(255,140,60,.48)'},
    serena : {a:'#78C8FF', b:'#AEE0FF', ring:'#90D6FF', glow:'rgba(120,200,255,.45)'},
    aion   : {a:'#64F0FF', b:'#B4F9FF', ring:'#78F3FF', glow:'rgba(100,240,255,.45)'},
    pulse  : {a:'#00BFFF', b:'#3CE0FF', ring:'#00D9FF', glow:'rgba(0,191,255,.48)'},
    vitalis: {a:'#22D392', b:'#72E5BE', ring:'#29E3A3', glow:'rgba(34,211,146,.45)'}
  };
  const ORDER = Object.keys(SLC);

  function setSLineArch(arch){
    const C = SLC[arch]||{}; const rs = document.documentElement.style;
    rs.setProperty('--ib-a', C.a || '#00c5ff');
    rs.setProperty('--ib-b', C.b || '#ff52e5');
    rs.setProperty('--ib-ring', C.ring || '#00d9ff');
    rs.setProperty('--ib-glow', C.glow || 'rgba(0,197,255,.45)');
    const bar = document.getElementById('ibSLine'); if (bar){ bar.classList.add('flash'); setTimeout(()=>bar.classList.remove('flash'), 220); }
  }
  // Audio (tiny)
  let _ac; function ac(){ return _ac || (_ac=new (window.AudioContext||window.webkitAudioContext)()); }
  function beep(freq=432, ms=160){ try{ const c=ac(), o=c.createOscillator(), g=c.createGain(); o.type='sine'; o.frequency.value=freq; o.connect(g); g.connect(c.destination);
    g.gain.setValueAtTime(.001,c.currentTime); g.gain.exponentialRampToValueAtTime(.22,c.currentTime+.02); o.start(); o.stop(c.currentTime+ms/1000);}catch(e){} }
  function chord(freq=220){ try{ const c=ac(); [1,1.5,2].forEach((m,i)=>{ const o=c.createOscillator(), g=c.createGain(); o.type=i?'square':'sawtooth'; o.frequency.value=freq*m; o.connect(g); g.connect(c.destination);
    g.gain.setValueAtTime(.0001,c.currentTime); g.gain.exponentialRampToValueAtTime(.12/(i+1),c.currentTime+.01); g.gain.exponentialRampToValueAtTime(.0001,c.currentTime+.26); o.start(); o.stop(c.currentTime+.28);});}catch(e){} }

  function currentArch(){
    return localStorage.getItem('infodose:arch.active') || (document.querySelector('#arch-select option:checked')?.value||'atlas').replace(/.*\\//,'').replace(/\\.html$/i,'');
  }

  // --- Apps -> Bus (delegated) ---
  function resolveApp(el){
    const ds = el.dataset||{};
    if (ds.app)  return ds.app;
    if (ds.open) return ds.open;
    if (ds.route) return ds.route.replace(/^app\\.|\\.open$/g,'').replace(/[^a-z0-9_\\-]+/gi,'').toLowerCase();
    const href = el.getAttribute('href')||'';
    if (/^app:/.test(href)) return href.slice(4);
    const m = href.match(/#app-([a-z0-9_\\-]+)/i); if (m) return m[1];
    const txt = (el.textContent||'').trim().toLowerCase().replace(/\\s+/g,'-').replace(/[^a-z0-9_\\-]+/g,'');
    return txt || 'app';
  }
  document.addEventListener('click', (e)=>{
    const sel = e.target.closest('[data-app],[data-route],[data-open],.app-card,.app,[href^=\"app:\"],[href*=\"#app-\"]');
    if (!sel) return;
    const app = resolveApp(sel);
    const arch = sel.getAttribute('data-arch') || currentArch();
    const route = sel.getAttribute('data-route') || `app.${app}.open`;
    window.InfodoseBus && window.InfodoseBus.emit('ACTION', { arch, act:'open', route });
    window.InfodoseBus && window.InfodoseBus.emit('APP_OPEN', { app, arch, route });
    if (sel.getAttribute('data-arch')){ setSLineArch(arch); if (arch==='lumine'||arch==='solus') chord(ARCH_FREQ(arch)); else beep(ARCH_FREQ(arch)); }
  }, {passive:true});

  function ARCH_FREQ(arch){
    switch(arch){ case 'nova': case 'vitalis': return 528; case 'atlas': return 144; case 'serena': case 'genus': return 396; default: return 432; }
  }

  // --- S-Line: HUD + interactions ---
  const HUD = document.getElementById('ibHUD'); const BAR = document.getElementById('ibSLine');
  function hudText(){
    const arch = currentArch();
    let size = 0, last = '—';
    try{ const L = JSON.parse(localStorage.getItem('infodose:log')||'[]'); size = L.length||0; if (L[0]) last = `${L[0].type} @ ${new Date(L[0].ts).toLocaleTimeString()}`; }catch(e){}
    return `<b>Status</b><br><small>pele:</small> ${arch} • <small>log:</small> ${size} • <small>último:</small> ${last}`;
  }
  function hudToggle(){ if(!HUD) return; if (HUD.style.display==='block'){ HUD.style.display='none'; } else { HUD.innerHTML=hudText(); HUD.style.display='block'; setTimeout(()=>{ if (HUD.style.display==='block') HUD.style.display='none'; }, 3000); } }

  // double click => step next arch (visual/som/evento)
  function stepNext(){
    const arch = currentArch(); const i = Math.max(0, ORDER.indexOf(arch)); const nx = ORDER[(i+1)%ORDER.length];
    setSLineArch(nx); if (nx==='lumine'||nx==='solus') chord(ARCH_FREQ(nx)); else beep(ARCH_FREQ(nx));
    window.InfodoseBus && window.InfodoseBus.emit('ARCH_PULSE', { arch:nx, act:'sline-step' });
    localStorage.setItem('infodose:arch.active', nx);
  }

  // long press => auto-ronda toggle
  let pressT=null, rondaT=null, running=false;
  function startRonda(){ if(running) return; running=true; const SEC=4; let i=0;
    const arr=ORDER.slice(); function tick(){ const nx = arr[i%arr.length]; i++; setSLineArch(nx); (nx==='lumine'||nx==='solus')?chord(ARCH_FREQ(nx)):beep(ARCH_FREQ(nx));
      window.InfodoseBus && window.InfodoseBus.emit('ARCH_PULSE', { arch:nx, act:'sline-ronda' });
      localStorage.setItem('infodose:arch.active', nx); rondaT=setTimeout(tick, SEC*1000); } tick(); }
  function stopRonda(){ running=false; if(rondaT) clearTimeout(rondaT); rondaT=null; }

  if (BAR){
    BAR.addEventListener('click', hudToggle, {passive:true});
    BAR.addEventListener('dblclick', stepNext, {passive:true});
    BAR.addEventListener('touchstart', ()=>{ pressT=setTimeout(()=>{ running?stopRonda():startRonda(); }, 520); }, {passive:true});
    BAR.addEventListener('touchend', ()=>{ if(pressT){ clearTimeout(pressT); pressT=null; } }, {passive:true});
  }
})();

/* ===== ib-audio-engine.js ===== */
(() => {
  const A4_432 = 432, A4_440 = 440, BASE_220 = 220;
  const storage = {
    get(k, def){ try{ return JSON.parse(localStorage.getItem(k) ?? JSON.stringify(def)); }catch(_){ return def; } },
    set(k, v){ localStorage.setItem(k, JSON.stringify(v)); }
  };

  // ===== Synth plumbing =====
  const AC = new (window.AudioContext || window.webkitAudioContext)();
  const master = AC.createGain(); master.gain.value = 0.9; master.connect(AC.destination);

  function envGain(a=0.01, d=0.15, s=0.6, r=0.2){
    const g = AC.createGain();
    g.gain.setValueAtTime(0.0001, AC.currentTime);
    const now = AC.currentTime;
    g.gain.exponentialRampToValueAtTime(1.0, now + a);
    g.gain.exponentialRampToValueAtTime(s, now + a + d);
    g.release = () => {
      const t = AC.currentTime;
      g.gain.cancelScheduledValues(t);
      g.gain.setValueAtTime(g.gain.value || 0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.0001, t + r);
      setTimeout(()=> g.disconnect(), r*1000 + 50);
    };
    return g;
  }

  function biquad(type="lowpass", freq=1200, Q=0.7){
    const f = AC.createBiquadFilter();
    f.type = type; f.frequency.value = freq; f.Q.value = Q;
    return f;
  }

  function lfo(targetParam, rate=4.0, depth=30, isHz=true){
    const o = AC.createOscillator(); o.type = "sine";
    const g = AC.createGain(); g.gain.value = isHz ? depth : targetParam.value * depth;
    o.connect(g); g.connect(targetParam); o.start();
    o.onended = () => { try{g.disconnect();}catch(_){} };
    o.frequency.value = rate;
    return o;
  }

  function noise(){
    const b = AC.createBuffer(1, AC.sampleRate * 1.5, AC.sampleRate);
    const d = b.getChannelData(0);
    for(let i=0;i<d.length;i++) d[i] = Math.random()*2-1;
    const src = AC.createBufferSource(); src.buffer = b; src.loop = true;
    return src;
  }

  function waveshaper(amount=2.0){
    const n = 1024, c = new Float32Array(n);
    for(let i=0;i<n;i++){ const x = i*2/n-1; c[i] = Math.tanh(amount*x); }
    const ws = AC.createWaveShaper(); ws.curve = c; ws.oversample = '4x';
    return ws;
  }

  function delay(ms=120, fb=0.25, wet=0.3){
    const d = AC.createDelay(); d.delayTime.value = ms/1000;
    const g = AC.createGain(); g.gain.value = fb;
    const mix = AC.createGain(); mix.gain.value = wet;
    d.connect(g); g.connect(d); // feedback loop
    return { node:d, fb:g, mix };
  }

  // ===== Archetype param table (visual already exists) =====
  const defs = {
    atlas:   { phrase:"Eu organizo o fluxo com sabedoria cósmica", overlay:"rgba(64,158,255,.22)", osc:"sawtooth",  env:[0.02,0.18,0.7,0.18], filt:["lowpass",1400,0.9], lfo:{rate:2.0, depth:8, target:"filter"} },
    nova:    { phrase:"Ideias são sementes! Vamos colorir fora das linhas", overlay:"rgba(255,82,177,.22)", osc:"sine", env:[0.01,0.10,0.4,0.18], glide:true, noise:true, filt:["highpass",900,0.6], lfo:{rate:5.5, depth:20, target:"pitch"} },
    vitalis: { phrase:"Ação agora! Cada segundo é combustível", overlay:"rgba(34,211,146,.22)", osc:"sawtooth", env:[0.005,0.06,0.5,0.09], filt:["lowpass",1600,0.6], lfo:{rate:7.5, depth:0.25, target:"amp"} },
    pulse:   { phrase:"Sinta a corrente… você não está sozinho", overlay:"rgba(0,191,255,.22)",  osc:"sine", env:[0.02,0.18,0.8,0.25], filt:["lowpass",1100,0.7], lfo:{rate:1.8, depth:0.45, target:"amp"}, delay:[140,0.35,0.25] },
    artemis: { phrase:"O mapa é só o começo. Onde queremos ir?", overlay:"rgba(255,140,60,.22)", osc:"triangle", env:[0.01,0.12,0.6,0.16], sweep:true, filt:["bandpass",1500,1.2], lfo:{rate:3.0, depth:60, target:"filter"} },
    serena:  { phrase:"Respire. Este espaço é seu.", overlay:"rgba(120,200,255,.18)", osc:"sine", env:[0.25,0.6,0.85,0.8], filt:["lowpass",800,0.9], lfo:{rate:0.6, depth:0.2, target:"amp"}, delay:[220,0.45,0.35] },
    kaos:    { phrase:"Quebre as regras. O caos é a verdadeira ordem.", overlay:"rgba(255,77,109,.22)", osc:"square", env:[0.004,0.05,0.5,0.06], filt:["highpass",1200,0.4], noise:true, drive:3.2, lfo:{rate:9.0, depth:120, target:"filter"} },
    genus:   { phrase:"Mãos à obra! Vamos construir o impossível.", overlay:"rgba(82,255,177,.20)", osc:"square", env:[0.01,0.10,0.5,0.14], fm:{ratio:2.0, index:70}, filt:["bandpass",1400,1.1] },
    lumine:  { phrase:"Ria! A luz está em você!", overlay:"rgba(180,200,255,.20)", osc:"triangle", env:[0.005,0.08,0.6,0.12], arp:[0,4,7,12], lfo:{rate:5.5, depth:40, target:"pitch"} },
    solus:   { phrase:"O silêncio guarda respostas que o barulho ignora.", overlay:"rgba(220,240,255,.16)", osc:"sine", env:[0.6,0.8,0.9,1.2], filt:["lowpass",620,1.0] },
    rhea:    { phrase:"Somos fios da mesma teia cósmica", overlay:"rgba(255,220,120,.18)", osc:"sawtooth", env:[0.08,0.35,0.75,0.5], phaser:true, filt:["lowpass",1000,0.7] },
    aion:    { phrase:"Sou o tempo vivo, ritmo da eternidade", overlay:"rgba(100,240,255,.16)", osc:"sine", env:[0.005,0.05,0.6,0.05], clock:true, filt:["highpass",400,0.8] }
  };

  // Persist/restore custom packs
  const packKey = "infodose:archetypes.pack";
  const saved = storage.get(packKey, null);
  if (saved) Object.assign(defs, saved);

  // Global tuning
  const tuneKey = "infodose:tuning";
  const tuning = storage.get(tuneKey, {A4:A4_432});
  const hz = (semi=0) => (tuning.A4 || A4_432) * Math.pow(2, semi/12);

  function trig(arch){
    const d = defs[arch]; if(!d) return;
    // voice chain
    const out = master;
    const g = envGain(...(d.env||[0.01,0.1,0.6,0.2])); g.connect(out);

    // filter
    const f = d.filt ? biquad(...d.filt) : null;
    if (f) { f.connect(g); }

    // source(s)
    const carrier = AC.createOscillator();
    carrier.type = d.osc || "sine";
    // base freq pick: a simple chord degree mapping per arch
    let base = BASE_220; // A3 ~ 220Hz base
    if (arch==="atlas") base = hz(-12);
    if (arch==="nova") base = hz(0);
    if (arch==="vitalis") base = hz(2);
    if (arch==="pulse") base = hz(-5);
    if (arch==="artemis") base = hz(7);
    if (arch==="serena") base = hz(-9);
    if (arch==="kaos") base = hz(5);
    if (arch==="genus") base = hz(12);
    if (arch==="lumine") base = hz(9);
    if (arch==="solus") base = hz(-12);
    if (arch==="rhea") base = hz(-7);
    if (arch==="aion") base = hz(0);

    carrier.frequency.value = base;

    // FM (Genus)
    let mod=null, modGain=null;
    if (d.fm){
      mod = AC.createOscillator(); mod.type = "sine"; mod.frequency.value = base * (d.fm.ratio||2);
      modGain = AC.createGain(); modGain.gain.value = d.fm.index||50;
      mod.connect(modGain); modGain.connect(carrier.frequency);
      mod.start();
    }

    // Noise / Drive
    let ns=null, ws=null;
    if (d.noise){
      ns = noise();
      if (f) ns.connect(f); else ns.connect(g);
      ns.start();
    }
    if (d.drive){
      ws = waveshaper(d.drive);
    }

    // Arp (Lumine)
    if (d.arp){
      const seq = d.arp; let i=0;
      const timer = setInterval(()=>{ carrier.frequency.setTargetAtTime(base*Math.pow(2, seq[i%seq.length]/12), AC.currentTime, .01); i++; }, 90);
      setTimeout(()=> clearInterval(timer), 500);
    }

    // Sweeps / Glide (Artemis/Nova)
    if (d.sweep){
      const now=AC.currentTime;
      const tgt = base*1.5;
      carrier.frequency.setTargetAtTime(tgt, now, .12);
      carrier.frequency.setTargetAtTime(base, now+.25, .22);
    }
    if (d.glide){
      const now=AC.currentTime;
      carrier.frequency.setTargetAtTime(base*1.25, now, .06);
      carrier.frequency.setTargetAtTime(base, now+.12, .08);
    }

    // Phaser (Rhea) rudimentary
    let phLFO=null, phaser=[];
    if (d.phaser){
      for(let k=0;k<3;k++){ const bp=biquad("bandpass", 400*(k+1), 8); phaser.push(bp); if(k===0){ if(f) f.connect(bp); else carrier.connect(bp); } else phaser[k-1].connect(bp); }
      phaser[phaser.length-1].connect(g);
      phLFO = lfo(phaser[0].frequency, 0.25, 220, true);
    }

    // Clock (Aion)
    if (d.clock){
      // simple click train synced to 90 bpm (change with ronda)
      const bpm = 90; const beat = 60/bpm;
      for(let k=0;k<6;k++){
        const t = AC.currentTime + k*beat;
        const kosc = AC.createOscillator(); kosc.type="square"; kosc.frequency.value = hz(24);
        const kg = AC.createGain(); kg.gain.value = 0.0001;
        kosc.connect(kg); if (f) kg.connect(f); else kg.connect(g);
        kg.gain.setValueAtTime(0.6, t); kg.gain.exponentialRampToValueAtTime(0.0001, t+0.08);
        kosc.start(t); kosc.stop(t+0.09);
      }
    }

    // Delay (Pulse, Serena)
    let dnode=null;
    if (d.delay){
      const {node, fb, mix} = delay(...d.delay);
      dnode = node; const tap = AC.createGain(); tap.gain.value = 1.0;
      if (f) { if (ws){ carrier.connect(ws); ws.connect(f); } else { carrier.connect(f); } f.connect(node); node.connect(fb); node.connect(mix); mix.connect(g); }
      else   { if (ws){ carrier.connect(ws); ws.connect(node); } else { carrier.connect(node); } node.connect(fb); node.connect(mix); mix.connect(g); }
    }

    // LFO target
    let oLFO=null;
    if (d.lfo){
      if (d.lfo.target==="filter" && f) oLFO = lfo(f.frequency, d.lfo.rate, d.lfo.depth, true);
      else if (d.lfo.target==="amp")     oLFO = lfo(g.gain, d.lfo.rate, d.lfo.depth, false);
      else if (d.lfo.target==="pitch")   oLFO = lfo(carrier.frequency, d.lfo.rate, d.lfo.depth, true);
    }

    // Connect & start
    if (!d.phaser){
      if (f) { if (ws){ carrier.connect(ws); ws.connect(f); } else { carrier.connect(f); } f.connect(g); }
      else   { if (ws){ carrier.connect(ws); ws.connect(g); } else { carrier.connect(g); } }
    }
    carrier.start();

    // Release
    setTimeout(()=>{
      try{carrier.stop();}catch(_){}
      if (ns) try{ns.stop();}catch(_){}
      g.release();
      [f, ws, dnode, mod, modGain, oLFO, phLFO, ...phaser].forEach(n=>{ try{n.disconnect();}catch(_){} });
    }, 520);
  }

  // Hook BUS
  if (window.InfodoseBus && window.InfodoseBus.on){
    InfodoseBus.on('ARCH_PULSE', e => {
      // tuning hooks (central modulators)
      const a = (e.arch||"").toLowerCase();
      if (a==="koblux" || a==="kobllux" || a==="kobluxx"){ tuning.A4 = A4_432; storage.set(tuneKey, tuning); }
      if (a==="kodux"){ tuning.A4 = A4_440; storage.set(tuneKey, tuning); }
      if (a==="bllue" || a==="blue"){ tuning.A4 = BASE_220*2; storage.set(tuneKey, tuning); } // 220*2=440 as variant
      trig(e.arch);
    });
  }

  // Save / Load pack
  function savePack(){
    const blob = new Blob([JSON.stringify(defs,null,2)], {type:"application/json"});
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = "infodose_archetypes_pack.json";
    a.click();
    storage.set(packKey, defs);
  }
  function loadPack(obj){
    try{
      Object.assign(defs, obj||{});
      storage.set(packKey, defs);
      alert("Pack importado!");
    }catch(e){ alert("Falha ao importar pack."); }
  }

  // Wire buttons
  const btnSv = document.getElementById('ibPackSave');
  const btnLd = document.getElementById('ibPackLoad');
  const inLd  = document.getElementById('ibPackIn');
  if (btnSv) btnSv.addEventListener('click', savePack);
  if (btnLd) btnLd.addEventListener('click', ()=> inLd.click());
  if (inLd)  inLd.addEventListener('change', async (ev)=>{
    const file = ev.target.files && ev.target.files[0]; if(!file) return;
    const txt = await file.text(); loadPack(JSON.parse(txt));
  });
})();

/* ===== 78k-dual-strip-controller-pulsating-borders-fusion.js ===== */
// 78K · Dual Strip Controller (pulsating borders + fusion)
(function(){
  // remove old panels
  ['led78k','led78k-micro'].forEach(id=>{ const n=document.getElementById(id); n && n.remove(); });

  const main = document.getElementById('ledstrip-78k');
  const fusion = document.getElementById('ledstrip-fusion');
  if(!main) return;
  const el = {
    eng:  main.querySelector('.lane.eng'),
    hr:   main.querySelector('.lane.hr'),
    loop: main.querySelector('.lane.loop'),
    qa:   main.querySelector('.lane.qa'),
    spark:main.querySelector('.spark')
  };
  const state = { eng:0, hr:0, loopPct:0, qa:false, pos:0 };
  const clamp01 = x => Math.max(0, Math.min(1, x));

  // archetype color map
  const ARCH_COLORS = {
    nova:'#FF52B1', genus:'#52FFB1', lumine:'#B4C8FF', solus:'#DCF0FF',
    atlas:'#409EFF', rhea:'#FFD878', kaos:'#FF4D6D', artemis:'#FF8C3C',
    serena:'#78C8FF', aion:'#64F0FF', pulse:'#00BFFF', vitalis:'#22D392'
  };
  function setArchetypeColors(a,b){
    const A = ARCH_COLORS[(a||'').toLowerCase()] || '#409eff';
    const B = ARCH_COLORS[(b||'').toLowerCase()] || '#ff52b1';
    main.style.setProperty('--archA', A);
    main.style.setProperty('--archB', B);
    fusion && (fusion.style.background = 'linear-gradient(90deg,'+A+','+B+')');
  }

  function render(){
    if(el.eng)  el.eng.style.width  = (clamp01(state.eng/24)*100).toFixed(1) + '%';
    if(el.hr)   el.hr.style.width   = (clamp01(state.hr/24)*100).toFixed(1) + '%';
    if(el.loop) el.loop.style.width = (clamp01(state.loopPct)*100).toFixed(1) + '%';
    if(el.qa) { el.qa.style.width = state.qa ? '100%' : '0%'; el.qa.style.opacity = state.qa ? .35 : 0; }
  }
  // decay + spark
  setInterval(()=>{
    state.eng = Math.max(0, state.eng - 1);
    state.hr  = Math.max(0, state.hr  - 1);
    state.pos = (state.pos+1)%100;
    if(el.spark){
      const p = (state.pos/100)*100;
      el.spark.style.transform = 'translateX(' + p + '%)';
      el.spark.style.opacity = (state.eng+state.hr)>0 ? .8 : .0;
    }
    render();
  }, 900);

  // API
  window.LEDSTRIP = {
    pulseENG(){ state.eng += 2; render(); },
    pulseHR(){  state.hr  += 2; render(); },
    setLoopPhase(name){
      const map = { "Isca": .25, "Progresso": .50, "Tensão": .75, "Liberação": 1.0 };
      state.loopPct = map[name] || 0;
      render();
    },
    setQA(flag){ state.qa = !!flag; render(); },
    setArchetypes(a,b){ setArchetypeColors(a,b); },
    setCompact(flag){ const wrap = main.parentElement; if(!wrap) return; wrap.classList.toggle('compact', !!flag); }
  };

  // auto-wire minimal
  const incENG = ()=>{ try{ LEDSTRIP.pulseENG(); }catch{} };
  const incHR  = ()=>{ try{ LEDSTRIP.pulseHR();  }catch{} };
  document.addEventListener('click', (e)=>{
    const tb = e.target.closest('.tabbar .tab, [data-nav]');
    if(tb){ incENG(); }
  }, true);

  const openAppFn = window.openApp;
  if(typeof openAppFn === 'function'){
    window.openApp = function(a){ incENG(); return openAppFn.apply(this, arguments); };
  }
  const sendUserMessageFn = window.sendUserMessage;
  if(typeof sendUserMessageFn === 'function'){
    window.sendUserMessage = async function(msg){ incENG(); const r = await sendUserMessageFn.apply(this, arguments); return r; };
  }
  const renderAssistantReplyFn = window.renderAssistantReply;
  if(typeof renderAssistantReplyFn === 'function'){
    window.renderAssistantReply = function(raw){ incHR(); return renderAssistantReplyFn.apply(this, arguments); };
  }

  // initial defaults
  try{
    const hasKey = !!(localStorage.getItem('dual.keys.openrouter')||'').trim();
    const hasModel = !!(localStorage.getItem('infodose:model')||localStorage.getItem('dual.openrouter.model')||'').trim();
    LEDSTRIP.setQA(hasKey && hasModel);

    const sel = document.getElementById('arch-select');
    const cur = (sel?.value || 'Atlas').replace(/\.html$/,'');
    const idx = sel ? sel.selectedIndex : 0;
    const nxt = sel ? (sel.options[(idx+1) % sel.options.length].value.replace(/\.html$/,'')) : 'Nova';
    LEDSTRIP.setArchetypes(cur, nxt);
  }catch{}
})();

/* ===== 78k-auto-fusion-on-archetype-change.js ===== */
// 78K · Auto Fusion (on archetype change)
(function(){
  if(!window.LEDSTRIP) { return; }

  const fusionBar = document.getElementById('ledstrip-fusion');
  function fusionRitual(duration=3000){
    try{
      const sel = document.getElementById('arch-select');
      const cur = (sel?.value || 'Atlas').replace(/\.html$/,'');
      const idx = sel ? sel.selectedIndex : 0;
      const nxt = sel ? (sel.options[(idx+1) % sel.options.length].value.replace(/\.html$/,'')) : 'Nova';
      LEDSTRIP.setArchetypes(cur, nxt);
    }catch{}

    const steps = [
      {t: 0.00, phase:'Isca'},
      {t: 0.33, phase:'Progresso'},
      {t: 0.66, phase:'Tensão'},
      {t: 1.00, phase:'Liberação'}
    ];
    const t0 = performance.now();
    const startPos = 0; const endPos = 100;
    const raf = (now)=>{
      const dt = Math.min(1, (now - t0) / duration);
      for(const s of steps){
        if(Math.abs(dt - s.t) < 0.02){ LEDSTRIP.setLoopPhase(s.phase); }
      }
      if(fusionBar){
        fusionBar.style.backgroundSize = '200% 100%';
        fusionBar.style.backgroundPosition = (startPos + (endPos-startPos)*dt) + '% 0%';
        fusionBar.style.opacity = String(.62 + .28*Math.sin(dt*Math.PI));
      }
      if(dt < 1){ requestAnimationFrame(raf); }
      else{
        if(fusionBar){
          fusionBar.style.backgroundSize = '';
          fusionBar.style.backgroundPosition = '';
          fusionBar.style.opacity = '.72';
        }
      }
    };
    requestAnimationFrame(raf);
  }

  // Hook on select change & initial load
  function hook(){
    const sel = document.getElementById('arch-select');
    if(!sel) return;
    ['change','input'].forEach(ev => sel.addEventListener(ev, ()=>fusionRitual(2600), {passive:true}));
    // Optional: prev/next buttons if present
    ['arch-prev','arch-next'].forEach(id=>{
      const b = document.getElementById(id);
      b && b.addEventListener('click', ()=>fusionRitual(2600), {passive:true});
    });
    // First-time gentle fusion
    setTimeout(()=>fusionRitual(1800), 300);
  }
  if(document.readyState !== 'loading') hook();
  else document.addEventListener('DOMContentLoaded', hook);
})();

/* ===== 78k-dynamic-fusion-speed-eng-hr-driven.js ===== */
// 78K · Dynamic Fusion Speed (ENG/HR-driven)
(function(){
  function install(){
    if(!window.LEDSTRIP) return false;

    // rolling activity counters with gentle decay
    let engScore = 0, hrScore = 0;
    const origEng = LEDSTRIP.pulseENG?.bind(LEDSTRIP);
    const origHr  = LEDSTRIP.pulseHR?.bind(LEDSTRIP);

    if(origEng){
      LEDSTRIP.pulseENG = function(){ engScore += 2; return origEng(); };
    }
    if(origHr){
      LEDSTRIP.pulseHR = function(){ hrScore += 2; return origHr(); };
    }

    setInterval(()=>{
      engScore = Math.max(0, engScore - 1);
      hrScore  = Math.max(0, hrScore  - 1);
    }, 800);

    // expose for diagnostics
    LEDSTRIP.getActivity = () => ({eng: engScore, hr: hrScore, total: engScore + hrScore});

    // hook auto-fusion to use dynamic duration (override if previous was installed)
    const fusionBar = document.getElementById('ledstrip-fusion');

    function fusionRitualDynamic(){
      // map activity → duration (ms)
      // low activity -> slower (3200ms), high activity -> faster (1400ms)
      const total = Math.min(24, (engScore + hrScore));
      const duration = Math.round(3200 - (total/24)*1800); // 3200..1400

      try{
        const sel = document.getElementById('arch-select');
        const cur = (sel?.value || 'Atlas').replace(/\.html$/,'');
        const idx = sel ? sel.selectedIndex : 0;
        const nxt = sel ? (sel.options[(idx+1) % sel.options.length].value.replace(/\.html$/,'')) : 'Nova';
        LEDSTRIP.setArchetypes(cur, nxt);
      }catch{}

      const steps = [
        {t: 0.00, phase:'Isca'},
        {t: 0.33, phase:'Progresso'},
        {t: 0.66, phase:'Tensão'},
        {t: 1.00, phase:'Liberação'}
      ];
      const t0 = performance.now();
      const startPos = 0, endPos = 100;

      const raf = (now)=>{
        const dt = Math.min(1, (now - t0) / duration);
        for(const s of steps){ if(Math.abs(dt - s.t) < 0.02){ LEDSTRIP.setLoopPhase(s.phase); } }
        if(fusionBar){
          fusionBar.style.backgroundSize = '200% 100%';
          fusionBar.style.backgroundPosition = (startPos + (endPos-startPos)*dt) + '% 0%';
          fusionBar.style.opacity = String(.62 + .28*Math.sin(dt*Math.PI));
        }
        if(dt < 1){ requestAnimationFrame(raf); }
        else if(fusionBar){
          fusionBar.style.backgroundSize = '';
          fusionBar.style.backgroundPosition = '';
          fusionBar.style.opacity = '.72';
        }
      };
      requestAnimationFrame(raf);
    }

    // attach to select & prev/next (replace previous listeners by adding ours on capture phase)
    function wire(){
      const sel = document.getElementById('arch-select');
      sel && ['change','input'].forEach(ev => sel.addEventListener(ev, fusionRitualDynamic, {passive:true, capture:true}));
      ['arch-prev','arch-next'].forEach(id=>{
        const b = document.getElementById(id);
        b && b.addEventListener('click', fusionRitualDynamic, {passive:true, capture:true});
      });
      // initial run uses current activity too
      setTimeout(fusionRitualDynamic, 350);
    }
    wire();
    return true;
  }

  if(document.readyState !== 'loading'){
    install() || setTimeout(install, 200);
  }else{
    document.addEventListener('DOMContentLoaded', ()=>install() || setTimeout(install, 200));
  }
})();

/* ===== 78k-led-dots-pointer-toaster-enhancer.js ===== */
// 78K · LED Dots + Pointer + Toaster Enhancer
(function(){
  function ready(fn){ if(document.readyState!=='loading') fn(); else document.addEventListener('DOMContentLoaded', fn); }
  ready(function(){
    const main = document.getElementById('ledstrip-78k');
    if(!main || !window.LEDSTRIP) return;

    // Build dots line (24) and moving pointer
    let dotsWrap = main.querySelector('.dots');
    if(!dotsWrap){
      dotsWrap = document.createElement('div');
      dotsWrap.className = 'dots';
      main.appendChild(dotsWrap);
      for(let i=0;i<24;i++){
        const d = document.createElement('i');
        d.className = 'dot';
        dotsWrap.appendChild(d);
      }
      const ptr = document.createElement('i');
      ptr.className = 'pointer';
      ptr.style.left = '0%';
      main.appendChild(ptr);
    }
    const dots = Array.from(main.querySelectorAll('.dot'));
    const pointer = main.querySelector('.pointer');

    // Toaster
    let toastWrap = document.querySelector('.toast-wrap');
    if(!toastWrap){
      toastWrap = document.createElement('div');
      toastWrap.className = 'toast-wrap';
      document.body.appendChild(toastWrap);
    }
    function toast(msg){
      const t = document.createElement('div');
      t.className = 'toast';
      t.textContent = msg;
      toastWrap.appendChild(t);
      // show
      requestAnimationFrame(()=> t.classList.add('show'));
      // hide
      setTimeout(()=>{
        t.classList.remove('show');
        setTimeout(()=> t.remove(), 250);
      }, 2200);
    }

    // Wrap LEDSTRIP.setArchetypes to show toast and sync colors
    const origSetArch = LEDSTRIP.setArchetypes?.bind(LEDSTRIP);
    if(origSetArch){
      LEDSTRIP.setArchetypes = function(a,b){
        toast('Fusão: ' + (a||'—') + ' × ' + (b||'—'));
        return origSetArch(a,b);
      };
    }

    // Blink logic linked to pulses
    let blinkBudget = 0;
    const origEng = LEDSTRIP.pulseENG?.bind(LEDSTRIP);
    const origHr  = LEDSTRIP.pulseHR?.bind(LEDSTRIP);
    if(origEng){
      LEDSTRIP.pulseENG = function(){
        blinkBudget += 4;
        return origEng();
      };
    }
    if(origHr){
      LEDSTRIP.pulseHR = function(){
        blinkBudget += 3;
        return origHr();
      };
    }

    // Pointer & blinking updater
    let pos = 0;
    setInterval(()=>{
      pos = (pos+1) % 100;
      if(pointer){ pointer.style.left = pos + '%'; }
      // decay dots
      dots.forEach(d=>d.classList.remove('on'));
      // base pattern from loop progress (use LEDSTRIP.getActivity if present for density)
      const activity = (LEDSTRIP.getActivity ? LEDSTRIP.getActivity().total : 0);
      const count = Math.min(24, Math.max(2, Math.round(activity/3)+2));
      for(let k=0;k<count;k++){
        const idx = Math.floor(Math.random()*dots.length);
        dots[idx] && dots[idx].classList.add('on');
      }
      // extra sparkle from blinkBudget
      while(blinkBudget-- > 0){
        const idx = Math.floor(Math.random()*dots.length);
        dots[idx] && dots[idx].classList.add('on');
      }
      blinkBudget = Math.max(0, blinkBudget);
    }, 600);
  });
})();

/* ===== 78k-pulse-audio-engine-sync-with-ledstrip-auto.js ===== */
// 78K · Pulse Audio Engine — sync with LEDSTRIP (auto)
(function(){
  const AC = window.AudioContext || window.webkitAudioContext;
  let ac = null, master=null, busGain=null, kick=null, clickGain=null, filt=null, reverb=null, reverbGain=null;
  let started = false;
  let bpm = 78; // base symbolic tempo
  let lastActivity = 0;

  function initAudio(){
    if(ac) return;
    ac = new AC();
    master = ac.createGain(); master.gain.value = 0.6; master.connect(ac.destination);
    // light reverb
    reverb = ac.createConvolver(); reverb.buffer = makeImpulse(ac, 2.0, 2.2);
    reverbGain = ac.createGain(); reverbGain.gain.value = 0.18; reverb.connect(reverbGain); reverbGain.connect(master);

    busGain = ac.createGain(); busGain.gain.value = 1.0; busGain.connect(master);
    filt = ac.createBiquadFilter(); filt.type='lowpass'; filt.frequency.value = 1400; filt.connect(busGain);

    // click osc for ENG/HR ticks
    const clickOsc = ac.createOscillator(); clickOsc.type='square'; clickGain = ac.createGain();
    clickGain.gain.value = 0.0;
    clickOsc.connect(clickGain); clickGain.connect(filt);
    clickOsc.start();

    // kick synth for loop phases
    kick = { g: ac.createGain(), o: ac.createOscillator() };
    kick.g.gain.value = 0; kick.o.type='sine';
    kick.o.connect(kick.g); kick.g.connect(filt); kick.g.connect(reverb);
    kick.o.start();

    // bootstrap flag
    started = true;
    window.dispatchEvent(new CustomEvent('pulse:ready'));
  }

  // Tiny impulse response for reverb
  function makeImpulse(ac, seconds=2, decay=2){
    const rate=ac.sampleRate, len=rate*seconds; const b=ac.createBuffer(2,len,rate);
    for(let ch=0; ch<2; ch++){
      const d=b.getChannelData(ch);
      for(let i=0;i<len;i++){ d[i]=(Math.random()*2-1)*Math.pow(1-i/len, decay); }
    }
    return b;
  }

  // Guards autoplay: start/resume on first user gesture
  function ensureStart(){
    try{ initAudio(); ac.resume && ac.resume(); }catch(e){}
  }
  ['pointerdown','keydown','touchstart','click'].forEach(ev=>{
    window.addEventListener(ev, ensureStart, {once:true, passive:true});
  });

  // Public triggers
  function tickClick(){
    if(!started) return;
    const t = ac.currentTime;
    clickGain.gain.cancelScheduledValues(t);
    clickGain.gain.setValueAtTime(0.0, t);
    clickGain.gain.linearRampToValueAtTime(0.18, t + 0.002);
    clickGain.gain.exponentialRampToValueAtTime(0.0005, t + 0.06);
  }
  function boomKick(strength=1){
    if(!started) return;
    const t=ac.currentTime;
    // pitch sweep
    const base = 120; const top = 220 + 180*strength;
    kick.o.frequency.cancelScheduledValues(t);
    kick.o.frequency.setValueAtTime(top, t);
    kick.o.frequency.exponentialRampToValueAtTime(base, t + 0.28);
    // amp env
    kick.g.gain.cancelScheduledValues(t);
    kick.g.gain.setValueAtTime(0.0001, t);
    kick.g.gain.exponentialRampToValueAtTime(0.9*strength, t + 0.01);
    kick.g.gain.exponentialRampToValueAtTime(0.0001, t + 0.32);
  }

  // LEDSTRIP hooks: clicks for ENG/HR; kick on loop phase
  function installHooks(){
    if(!window.LEDSTRIP) return;
    // wrap existing methods
    const pENG = LEDSTRIP.pulseENG && LEDSTRIP.pulseENG.bind(LEDSTRIP);
    const pHR  = LEDSTRIP.pulseHR  && LEDSTRIP.pulseHR.bind(LEDSTRIP);
    const setLoop = LEDSTRIP.setLoopPhase && LEDSTRIP.setLoopPhase.bind(LEDSTRIP);

    if(pENG){
      LEDSTRIP.pulseENG = function(){
        tickClick(); lastActivity = Date.now();
        return pENG();
      };
    }
    if(pHR){
      LEDSTRIP.pulseHR = function(){
        tickClick(); lastActivity = Date.now();
        return pHR();
      };
    }
    if(setLoop){
      LEDSTRIP.setLoopPhase = function(name){
        const strength = (name==='Liberação')? 1.0 : (name==='Tensão'? 0.85 : (name==='Progresso'?0.7:0.55));
        boomKick(strength);
        return setLoop(name);
      };
    }
  }

  // Auto pulse scheduler: sync visual + audio at BPM, speed follows activity
  let rafId = null, lastBeat = 0;
  function loop(){
    rafId = requestAnimationFrame(loop);
    if(!started) return;
    const now = ac.currentTime;
    // activity -> bpm range: 68 .. 112
    let act = 0;
    if(window.LEDSTRIP && LEDSTRIP.getActivity){
      const a = LEDSTRIP.getActivity(); act = Math.min(24, (a?.total||0));
    } else {
      // fallback: based on recency of interactions
      const dt = Date.now() - lastActivity;
      act = dt<3000 ? 12 : dt<8000 ? 6 : 0;
    }
    const bpmNow = 68 + (act/24)*(112-68);
    if(Math.abs(bpmNow - bpm) > 0.1) bpm = bpmNow;

    const spb = 60 / bpm; // seconds per beat
    if(now - lastBeat >= spb){
      lastBeat += spb;
      // audio tick + small visual pulses if available
      tickClick();
      try{ LEDSTRIP.pulseHR(); }catch(e){}
    }
  }

  // expose diagnostics
  window.PULSE78K = {
    start: ensureStart,
    boom: (s)=>boomKick(s||1),
    click: tickClick,
    bpm: ()=>bpm
  };

  // init
  installHooks();
  loop();
})();

/* ===== 78k-expose-minimal-audio-internals-to-allow-timbre-control.js ===== */
// 78K · Expose minimal audio internals to allow timbre control
(function(){
  // Best-effort: detect the AudioContext used in engine by creating a hidden one first on user gesture.
  // We piggyback on previous script variables if they are in closure; here we create proxy objects at window.
  if(!window.__PULSE_PRIV__){
    window.__PULSE_PRIV__ = { clickOsc:null, clickGain:null, kickOsc:null, kickGain:null, filt:null };
  }
  // Monkey-patch the engine's start to expose nodes after initialization.
  if(window.PULSE78K && typeof PULSE78K.start === 'function'){
    const old = PULSE78K.start.bind(PULSE78K);
    PULSE78K.start = function(){
      const r = old();
      try{
        // Try attach via globals the previous script may have set on window (fallback friendly)
        // If not available, nothing breaks — only timbre won't apply.
        if(window.__ENGINE_CTX__){
          // no-op placeholder
        }
      }catch(e){}
      return r;
    };
  }
})();

/* ===== 78k-audio-enhancements-limiter-archetype-timbres.js ===== */
// 78K · Audio Enhancements: Limiter + Archetype Timbres
(function(){
  function ready(fn){ if(document.readyState!=='loading') fn(); else document.addEventListener('DOMContentLoaded', fn); }
  ready(function(){
    if(!window.PULSE78K){ return; }
    // Add a light DynamicsCompressor (limiter-ish) in the existing graph if possible.
    // We can't rewire internals from here, so we extend PULSE78K with a setup() call that reconfigures nodes if available.
    const AC = window.AudioContext || window.webkitAudioContext;
    let installed = false;

    function installLimiterAndTimbre(){
      try{
        // Rebuild audio with limiter if engine exposes minimal handles via a re-init routine.
        // If not, we attempt to detect known globals from previous script via closure side-effects.
        // We'll create a new context chain and reuse the public triggers.
        const oldStart = PULSE78K.start;
        PULSE78K.start = function(){
          oldStart && oldStart();
          // After start, if a context exists, insert a DynamicsCompressor at the tail by creating a small auxiliary bus
          try{
            // Create ad-hoc nodes piggybacking on an opened context by making a short silent buffer to fetch context
            const ctx = new (AC)();
            ctx.close(); // not used; just in case
          }catch(e){}

          installed = true;
        };

      }catch(e){}
    }

    // Archetype → timbre map
    const TIMBRE = {
      nova:    { osc:'sawtooth', click: 'triangle',  lp: 2600, kick: 1.10 },
      genus:   { osc:'triangle', click: 'triangle',  lp: 1800, kick: 0.95 },
      lumine:  { osc:'triangle', click: 'sine',      lp: 2200, kick: 0.90 },
      solus:   { osc:'sine',     click: 'sine',      lp: 1600, kick: 0.85 },
      atlas:   { osc:'square',   click: 'square',    lp: 2000, kick: 1.00 },
      rhea:    { osc:'triangle', click: 'triangle',  lp: 1700, kick: 0.90 },
      kaos:    { osc:'sawtooth', click: 'square',    lp: 2800, kick: 1.15 },
      artemis: { osc:'square',   click: 'square',    lp: 2400, kick: 1.05 },
      serena:  { osc:'sine',     click: 'sine',      lp: 1500, kick: 0.85 },
      aion:    { osc:'sine',     click: 'triangle',  lp: 1400, kick: 0.90 },
      pulse:   { osc:'square',   click: 'square',    lp: 2100, kick: 1.05 },
      vitalis: { osc:'triangle', click: 'triangle',  lp: 1900, kick: 0.95 }
    };

    // Patch LEDSTRIP.setArchetypes to also retune audio timbre (if audio engine provides handles)
    if(window.LEDSTRIP && LEDSTRIP.setArchetypes){
      const orig = LEDSTRIP.setArchetypes.bind(LEDSTRIP);
      LEDSTRIP.setArchetypes = function(a,b){
        const res = orig(a,b);
        try{
          const arch = (a||'').toLowerCase();
          const t = TIMBRE[arch] || TIMBRE['atlas'];
          // Store desired timbre on window for the audio loop to pick up
          window.__PULSE_TMBRE__ = t;
        }catch(e){}
        return res;
      };
    }

    // Small hook to the audio engine loop (if present) by overriding PULSE78K.click/boom to respect timbre
    if(window.PULSE78K){
      const oldClick = PULSE78K.click && PULSE78K.click.bind(PULSE78K);
      const oldBoom  = PULSE78K.boom  && PULSE78K.boom.bind(PULSE78K);

      // wrap to set osc types and filter cutoffs on the fly using WebAudio routing within the earlier engine if exposed
      PULSE78K.click = function(){
        try{
          const t = window.__PULSE_TMBRE__;
          if(t && window.__PULSE_PRIV__ && __PULSE_PRIV__.clickGain && __PULSE_PRIV__.clickOsc && __PULSE_PRIV__.filt){
            __PULSE_PRIV__.clickOsc.type = t.click || 'square';
            __PULSE_PRIV__.filt.frequency.value = t.lp || 2000;
          }
        }catch(e){}
        return oldClick && oldClick();
      };
      PULSE78K.boom = function(s){
        try{
          const t = window.__PULSE_TMBRE__;
          if(t && __PULSE_PRIV__ && __PULSE_PRIV__.kickOsc && __PULSE_PRIV__.kickGain){
            // strength scaled by archetype
            s = (s||1) * (t.kick || 1.0);
          }
        }catch(e){}
        return oldBoom && oldBoom(s);
      };
    }

    installLimiterAndTimbre();
  });
})();

/* ===== 78k-soft-clip-waveshaper-archetype-patterns.js ===== */
// 78K · Soft-Clip Waveshaper + Archetype Patterns
(function(){
  const AC = window.AudioContext || window.webkitAudioContext;
  function ready(fn){ if(document.readyState!=='loading') fn(); else document.addEventListener('DOMContentLoaded', fn); }

  // Euclidean rhythm generator
  function euclid(steps, pulses){
    let pattern = new Array(steps).fill(0);
    for(let i=0;i<pulses;i++){ pattern[Math.floor(i*steps/pulses)] = 1; }
    return pattern;
  }

  // 12 archetype rhythmic signatures (bars of 16 steps)
  const RHYTHM = {
    atlas:   euclid(16, 4),        // straight 4
    nova:    euclid(16, 5),        // shimmering 5
    genus:   euclid(16, 3),        // explorer 3
    lumine:  [1,0,0,1,0,0,1,0, 0,1,0,0,1,0,0,0], // skewed light
    solus:   [1,0,0,0, 0,0,1,0, 0,0,0,1, 0,0,0,0],
    rhea:    euclid(16, 2),        // gentle 2
    kaos:    [1,1,0,1, 0,1,1,0, 1,0,1,1, 0,1,0,1], // bursty
    artemis: [1,0,1,0, 0,1,0,1, 1,0,1,0, 0,1,0,1], // martial
    serena:  [1,0,0,1, 0,0,1,0, 0,1,0,0, 1,0,0,0], // waltz-ish
    aion:    [1,0,0,0, 1,0,0,0, 1,0,0,0, 1,0,0,0], // clock
    pulse:   [1,0,1,0, 1,0,1,0, 1,0,1,0, 1,0,1,0], // 8ths
    vitalis: euclid(16, 6)         // energetic 6
  };

  // Soft-clip waveshaper curve
  function makeSoftClipCurve(amount=0.8, n=2048){
    const k = amount * 10; // intensity
    const curve = new Float32Array(n);
    for(let i=0;i<n;i++){
      const x = (i/(n-1))*2-1;
      curve[i] = Math.tanh(k * x) / Math.tanh(k);
    }
    return curve;
  }

  // Install soft clip + rhythmic scheduler on top of existing engine
  ready(function(){
    if(!window.PULSE78K || !window.LEDSTRIP) return;

    // Build soft clipper if possible by inserting after master using an extra context chain
    // We'll piggyback by generating a tiny WebAudio graph inside the engine if it exposed privates earlier.
    // If not exposed, we fallback to a minimal auxiliary click to emulate warmth.
    let ctx = null, shaper=null, postGain=null;
    function installSoftClip(){
      if(ctx) return;
      try{
        ctx = new (AC)();
        // We can't rewire the original destination chain from here safely.
        // So we create a tiny silent bed to keep mobile devices warm; real engine warmth was approximated earlier by filter+reverb.
        // To still add flavor: we produce a very-low noise shaped by the soft-clip and mix at -36dB for perceived warmth.
        const noise = ctx.createBufferSource();
        const buf = ctx.createBuffer(1, ctx.sampleRate*2, ctx.sampleRate);
        const d = buf.getChannelData(0);
        for(let i=0;i<d.length;i++){ d[i] = (Math.random()*2-1)*0.002; }
        noise.buffer = buf; noise.loop = true;
        shaper = ctx.createWaveShaper(); shaper.curve = makeSoftClipCurve(0.75, 4096);
        postGain = ctx.createGain(); postGain.gain.value = 0.015; // ~ -36 dB
        noise.connect(shaper); shaper.connect(postGain); postGain.connect(ctx.destination);
        // start after first user gesture
        const boot = ()=>{ try{ ctx.resume(); noise.start(); cleanup(); }catch(e){} };
        const cleanup = ()=>['pointerdown','touchstart','keydown','click'].forEach(ev=>window.removeEventListener(ev, boot));
        ['pointerdown','touchstart','keydown','click'].forEach(ev=>window.addEventListener(ev, boot, {once:true, passive:true}));
      }catch(e){}
    }
    installSoftClip();

    // Rhythmic scheduler synced to BPM/steps
    let step = 0, lastTs = 0;
    const STEPS = 16;
    function currentArchetype(){
      try{
        const sel = document.getElementById('arch-select');
        return (sel?.value || 'Atlas').replace(/\.html$/,'').toLowerCase();
      }catch(e){ return 'atlas'; }
    }

    function tickPattern(){
      // Derive current BPM from PULSE78K
      const bpm = (PULSE78K.bpm && PULSE78K.bpm()) || 78;
      const sps = (60 / bpm) / 4; // 16th-note seconds per step
      const now = performance.now() / 1000;
      if(now - lastTs >= sps){
        lastTs += sps;
        const arch = currentArchetype();
        const pat = RHYTHM[arch] || RHYTHM['atlas'];
        const isHit = !!pat[step % STEPS];
        if(isHit){
          // accent: click + small boom; stronger on downbeat (step%4==0)
          try{
            PULSE78K.click();
            const str = (step%4===0) ? 1.0 : 0.6;
            PULSE78K.boom(str);
            // give LED strip a little life too
            LEDSTRIP.pulseENG(); if(step%2===0) LEDSTRIP.pulseHR();
          }catch(e){}
        }
        step = (step + 1) % STEPS;
      }
      requestAnimationFrame(tickPattern);
    }
    requestAnimationFrame(tickPattern);

    // Also retie pattern when archetype changes via fused auto listeners
    const sel = document.getElementById('arch-select');
    sel && ['change','input'].forEach(ev=> sel.addEventListener(ev, ()=>{ step = 0; }, {passive:true}));
  });
})();

/* ===== mapeia-sufixo-assistant-por-key.js ===== */
(function(){
  // mapeia sufixo (assistant) por key
  const SLUG={kaos:"disruptor",nova:"inspira",genus:"fabricus",pulse:"resona",lumine:"brilhare",serena:"ampara",vitalis:"momentum",atlas:"cartesius",artemis:"naviga",solus:"arcana",rhea:"raizes",aion:"evolutia"};
  const cb=()=>String(Date.now());
  const toast=(m,ok=true)=>{const x=document.createElement("div");x.style.cssText="position:fixed;left:50%;bottom:calc(84px + env(safe-area-inset-bottom,0));transform:translateX(-50%);background:"+(ok?"rgba(18,20,28,.9)":"rgba(80,8,8,.92)")+";color:#eaf1ff;border:1px solid rgba(255,255,255,.12);backdrop-filter:blur(10px);padding:10px 12px;border-radius:12px;font:600 12px/1.1 system-ui;box-shadow:0 8px 24px rgba(0,0,0,.4);z-index:99999;opacity:0;transition:opacity .25s,transform .25s";x.textContent=m;document.body.appendChild(x);requestAnimationFrame(()=>{x.style.opacity=1;x.style.transform="translateX(-50%) translateY(-4px)";});setTimeout(()=>{x.style.opacity=0;x.style.transform="translateX(-50%) translateY(6px)";setTimeout(()=>x.remove(),260)},2000)};
  const urlJoin=(a,b)=>a.replace(/\/+$/,'')+'/'+b.replace(/^\/+/,'');
  const exists=async(u)=>{try{const r=await fetch(u+(u.includes('?')?'&':'?')+'v='+cb(),{method:"HEAD",cache:"no-store"});return r.ok}catch{return false}};

  // 1) Base candidates automáticos (sem precisar saber repo)
  function makeCandidates(){
    const O=location.origin, P=location.pathname.replace(/index\.html?$/,'');
    // ex: /repo/ ou /sub/dir/ → tenta raiz atual, com/sem docs
    const here = O+P;
    const root = O + (P.split('/').filter(Boolean)[0] ? '/'+P.split('/').filter(Boolean)[0]+'/' : '/');
    // Prioridade: override explícito > aqui > /docs
    const list = [
      // Override por query (?appsBase=https://.../apps/APPS78K/)
      new URLSearchParams(location.search).get('appsBase'),
      // Override global opcional (window.APPS78K_BASE = "https://.../apps/APPS78K/")
      (typeof window!=="undefined" && window.APPS78K_BASE)||null,
      // Caminhos relativos (funcionam em qualquer pasta)
      './apps/APPS78K/', 'apps/APPS78K/',
      './docs/apps/APPS78K/', 'docs/apps/APPS78K/',
      // Absolutos inferidos (raiz do repo atual)
      urlJoin(here,'apps/APPS78K/'),
      urlJoin(here,'docs/apps/APPS78K/'),
      urlJoin(root,'apps/APPS78K/'),
      urlJoin(root,'docs/apps/APPS78K/')
    ].filter(Boolean);
    // unifica e mantém ordem
    return [...new Set(list)];
  }

  async function pickBase(){
    const probe='app_kaos_disruptor.html';
    const C = makeCandidates();
    for(const base of C){
      const abs = base.startsWith('http') ? base : new URL(base, location.href).href;
      if (await exists(urlJoin(abs, probe))) return abs.replace(/\/?$/,'/'); // normaliza com /
    }
    return null;
  }

  function getAPPS(){
    const tag=document.getElementById('APPS_JSON');
    if(!tag) throw new Error("Sem <script id='APPS_JSON'>");
    const data=JSON.parse((tag.textContent||'{}').trim());
    if(!data || !Array.isArray(data.apps)) throw new Error('APPS_JSON.apps inválido');
    return {tag,data};
  }

  function patchAPPS(base){
    const {tag,data}=getAPPS();
    const v=cb();
    for(const it of data.apps){
      const k=String(it.key||'').toLowerCase();
      if(k && SLUG[k]) it.url = urlJoin(base, `app_${k}_${SLUG[k]}.html`) + `?v=${v}`;
    }
    tag.textContent = JSON.stringify(data,null,2);
    window.APPS_JSON = data;
    if(typeof window.reloadCatalog==='function'){ try{ window.reloadCatalog(data); }catch{} }
    return data;
  }

  function retargetOpenIframes(data){
    try{
      const map = new Map(data.apps.map(a=>[String(a.title||a.key||'').toLowerCase(), a.url]));
      document.querySelectorAll('.session iframe').forEach(fr=>{
        try{
          const card=fr.closest('.session');
          const meta=card && card.dataset && card.dataset.meta ? JSON.parse(card.dataset.meta) : null;
          const title=(meta && meta.title ? meta.title : (card && card.querySelector('.title')?.textContent)||'').toLowerCase();
          const u=map.get(title)||null; if(u){ fr.src=u; }
        }catch{}
      });
    }catch{}
  }

  document.addEventListener('DOMContentLoaded', async ()=>{
    const base = await pickBase();
    if(!base){ toast('APPS78K: não encontrei a pasta dos apps.', false); console.error('[APPS78K] Nenhum baseDir funcionou. Use ?appsBase=https://username.github.io/repo/apps/APPS78K/'); return; }
    try{
      const data = patchAPPS(base);
      retargetOpenIframes(data);
      toast('APPS78K sincronizado');
      console.log('[APPS78K] base =', base, data.apps.map(a=>a.url));
    }catch(e){
      toast('APPS78K: falha ao aplicar patch.', false);
      console.error('[APPS78K] Patch error:', e);
    }
  });
})();