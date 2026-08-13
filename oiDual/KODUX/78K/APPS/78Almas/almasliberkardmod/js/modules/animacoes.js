// ============================================================
    // 1. ORB 3D AVATAR
    // ============================================================
    // [FUSION: unificado com KARD-Fusion-Card — gradIds únicos por render
    //  (seed+random) evitam colisão de <radialGradient>/<linearGradient> quando
    //  múltiplos orbs do mesmo nome aparecem simultâneos na tela; injectOrbStyles
    //  garante o CSS do orb mesmo se este trecho rodar antes do <style> global.]
    function injectOrbStyles() {
      if (document.getElementById('dual-orb-styles')) return;
      const style = document.createElement('style');
      style.id = 'dual-orb-styles';
      style.innerHTML = `
        @keyframes orbBreathe {
          0%, 100% { transform: translateZ(0) scale(1); opacity: .82; filter: brightness(1); }
          50%      { transform: translateZ(0) scale(1.08); opacity: 1;   filter: brightness(1.22); }
        }

/* animações */
@keyframes orbSpin {
  to { transform: rotate(780deg); }
}

        @keyframes orbPulse { 0% { transform: scale(.78); opacity: .55; } 100% { transform: scale(1.28); opacity: 0; } }
        @keyframes orbFloat {
          0%, 100% { transform: translateY(0px) rotateX(0deg) rotateY(0deg); }
          50%      { transform: translateY(-2px) rotateX(10deg) rotateY(-10deg); }
        }
      `;
      document.head.appendChild(style);
    }

    function makeOrbAvatar(name = 'DUAL', size = 64) {
      injectOrbStyles();
      const safe = String(name || 'DUAL').trim() || 'DUAL';
      const seed = safe.split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
      const h1 = seed % 360;
      const h2 = (seed * 37) % 360;
      const uid = Math.random().toString(36).slice(2, 7);
      const gradId = `orb_${seed.toString(36)}_${uid}`;

      return `
        <div class="dual-orb-wrap" id="${gradId}" style="--orb-size:${size}px; --orb-primary:hsl(${h1},100%,62%); --orb-secondary:hsl(${h2},92%,48%);" aria-label="${safe}" role="img">
          <svg class="dual-orb-svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <defs>
              <radialGradient id="${gradId}_core" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="hsl(${h1},100%,66%)" stop-opacity="1"/>
                <stop offset="55%" stop-color="hsl(${h2},92%,46%)" stop-opacity=".9"/>
                <stop offset="100%" stop-color="hsl(${h2},100%,12%)" stop-opacity="0"/>
              </radialGradient>
              <linearGradient id="${gradId}_ring" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="hsl(${h1},100%,76%)"/>
                <stop offset="100%" stop-color="hsl(${h2},100%,58%)"/>
              </linearGradient>
            </defs>
            <circle cx="50" cy="50" r="46" fill="#05070c"/>
            <circle cx="50" cy="50" r="40" fill="url(#${gradId}_core)" opacity=".28"/>
            <circle cx="50" cy="50" r="38" fill="none" stroke="url(#${gradId}_ring)" stroke-width="1"/>
            <circle cx="50" cy="50" r="46" fill="none" stroke="url(#${gradId}_ring)" stroke-width="2.5" stroke-dasharray="70 20 10 30" stroke-linecap="round" opacity=".86"/>
            <circle cx="50" cy="50" r="8" fill="#ffffff" opacity=".22" filter="blur(2px)"/>
            <circle cx="50" cy="50" r="3" fill="#ffffff" opacity=".85"/>
          </svg>
          <div class="dual-orb-shell">
            <div class="dual-orb-halo"></div>
            <div class="dual-orb-core"></div>
          </div>
        </div>
      `;
    }
    window.makeOrbAvatar = makeOrbAvatar;
    window.makeMiniAvatar = (name) => makeOrbAvatar(name, 24);

    // ============================================================
    // 2. UTILITÁRIOS: ASCII, root369, padTo
    // ============================================================
    function padTo(text, size) {
      text = String(text);
      if (text.length >= size) return text.slice(0, size);
      return text + ' '.repeat(size - text.length);
    }

    function root369(name) {
      const clean = (name || '').trim();
      if (!clean) return '--';
      let n = clean.split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
      while (n > 9) n = String(n).split('').reduce((a, b) => a + Number(b), 0);
      return n;
    }

    function createAsciiActivation(name) {
      const clean = (name || '').trim() || 'Convidado';
      const displayName = `${clean}.Dual Infodose`;
      const title = 'CÉREBRO-ORÁCULO — BASE v1';
      const width = 35;
      const top = `+${'-'.repeat(width)}+`;
      const titleLine = `| ${padTo(title, width - 2)} |`;
      const nameLine = `Ativar: ${displayName}`;
      return {
        ascii: [top, titleLine, top, nameLine].join('\n'),
        displayName,
        root: root369(clean),
        title
      };
    }

    // ============================================================
    // 3. ATUALIZAR INTERFACE (perfil + activation)
    // ============================================================
    function updateAllUI(name) {
      const safe = name || 'Convidado';
      localStorage.setItem('di_userName', safe);

      document.getElementById('heroName').textContent = safe;
      document.getElementById('heroHandle').textContent = '@' + safe.toLowerCase().replace(/\s/g, '');
      document.getElementById('heroAvatar').outerHTML = makeOrbAvatar(safe, 118);
      document.getElementById('topbarMiniOrb').innerHTML = makeOrbAvatar(safe, 32);

      const data = createAsciiActivation(safe);
      document.getElementById('actPreMain').textContent = data.ascii;
      document.getElementById('actBadgeMain').textContent = 'v:' + data.root;
      document.getElementById('actMiniOrb').innerHTML = makeOrbAvatar(safe, 40);

      const input = document.getElementById('inlineNameInput');
      if (input && input.value !== safe) input.value = safe;
    }

    // ============================================================
    // 4. TOASTER
    // ============================================================
    function showToaster(text, type = 'default') {
      const wrap = document.getElementById('toasterWrap');
      if (!wrap) return;
      const el = document.createElement('div');
      el.className = `toaster ${type}`;
      el.textContent = text;
      wrap.appendChild(el);
      requestAnimationFrame(() => el.classList.add('show'));
      setTimeout(() => {
        el.classList.remove('show');
        setTimeout(() => el.remove(), 300);
      }, 2800);
    }

    // ============================================================
    // 5. TEMAS (CLARO/ESCURO)
    // ============================================================
    const themeToggle = document.getElementById('themeToggle');
    themeToggle.addEventListener('click', function() {
      document.body.classList.toggle('theme-dark');
      this.textContent = document.body.classList.contains('theme-dark') ? '☀️' : '🌙';
      localStorage.setItem('theme', document.body.classList.contains('theme-dark') ? 'dark' : 'light');
    });

    if (localStorage.getItem('theme') === 'dark') {
      document.body.classList.add('theme-dark');
      themeToggle.textContent = '☀️';
    }

    // ============================================================
    // 6. BOTÕES COM FUNÇÕES REAIS (V10)
    // ============================================================
    document.getElementById('menuBtn').addEventListener('click', () => {
      showToaster('📋 Menu aberto (simulação)', 'default');
    });

    document.getElementById('notifBtn').addEventListener('click', () => {
      showToaster('🔔 Você tem 3 notificações', 'default');
    });

    document.getElementById('editProfileBtn').addEventListener('click', () => {
      const current = localStorage.getItem('di_userName') || 'Convidado';
      const novo = prompt('Digite seu novo nome:', current);
      if (novo && novo.trim()) {
        updateAllUI(novo.trim());
        showToaster('✅ Nome atualizado!', 'success');
      }
    });

    document.getElementById('profileMenuBtn').addEventListener('click', () => {
      showToaster('⚙️ Opções do perfil (em breve)', 'default');
    });

    document.getElementById('inlineNameInput').addEventListener('input', function() {
      const val = this.value.trim() || 'Convidado';
      updateAllUI(val);
    });

    document.getElementById('copyActBtnMain').addEventListener('click', function() {
      const pre = document.getElementById('actPreMain');
      if (!pre) return;
      navigator.clipboard.writeText(pre.textContent).then(() => {
        showToaster('📋 ASCII copiado!', 'success');
      }).catch(() => {
        const ta = document.createElement('textarea');
        ta.value = pre.textContent;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        ta.remove();
        showToaster('📋 ASCII copiado!', 'success');
      });
    });

    document.getElementById('speakActBtn').addEventListener('click', function() {
      const pre = document.getElementById('actPreMain');
      if (!pre) return;
      const text = pre.textContent;
      if (!('speechSynthesis' in window)) {
        showToaster('❌ TTS não suportado', 'error');
        return;
      }
      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = 'pt-BR';
      utter.rate = 0.9;
      speechSynthesis.cancel();
      speechSynthesis.speak(utter);
      showToaster('🔊 Ouvindo...', 'default');
    });

    document.getElementById('resetActBtn').addEventListener('click', function() {
      const saved = localStorage.getItem('di_userName') || 'Convidado';
      updateAllUI(saved);
      showToaster('↺ Resetado!', 'success');
    });

    document.getElementById('dosesViewAllBtn').addEventListener('click', () => {
      showToaster('💊 Lista de todas as doses (em breve)', 'default');
    });

    document.getElementById('memoriesViewAllBtn').addEventListener('click', () => {
      showToaster('🧠 Arquivo de memórias (em breve)', 'default');
    });

    document.getElementById('startChallengeBtn').addEventListener('click', () => {
      showToaster('🔥 Desafio iniciado! Vamos lá!', 'success');
    });

    // Navegação inferior
    document.getElementById('navLibraryBtn').addEventListener('click', () => {
      document.querySelector('[data-collapse="library"]').open = true;
      document.querySelector('[data-collapse="library"]').scrollIntoView({ behavior: 'smooth' });
    });

    document.getElementById('navResultsBtn').addEventListener('click', () => {
      showToaster('📊 Resultados (em construção)', 'default');
    });

    document.getElementById('navProfileBtn').addEventListener('click', () => {
      document.querySelector('.hero').scrollIntoView({ behavior: 'smooth' });
    });

    document.getElementById('navCreateBtn').addEventListener('click', () => {
      showToaster('➕ Criar novo item (em breve)', 'default');
    });

    // ============================================================
    // 7. INICIALIZAÇÃO (V10)
    // ============================================================
    const savedName = localStorage.getItem('di_userName') || 'Convidado';
    updateAllUI(savedName);

    window.addEventListener('storage', function(e) {
      if (e.key === 'di_userName') {
        updateAllUI(e.newValue || 'Convidado');
      }
    });

    document.dispatchEvent(new CustomEvent('di:name:update', { detail: { name: savedName } }));

    console.log('✅ Almasliber OS — Activation Card + Botões funcionais carregado.');