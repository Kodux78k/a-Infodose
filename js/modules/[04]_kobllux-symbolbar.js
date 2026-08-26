  /* ============================================================
     KOBLLUX · SYMBOLBAR · v5.1 TRINITY CANON + MOBILE PATCH
     ============================================================ */

  // ── CANONICAL CONSTANTS ──
  const TRINITY = {
    UNO: 432, DUAL: 528, TRINITY: 639, AION: 963,
    TEMPO: 369, SIG: 1134,
    K: { K3: 44, K6: 60, K9: () => window.innerWidth, K12: 1134 },
    SNAP_TOP: () => Math.round(963 / 9.63), // 100
    SNAP_MARGIN: () => Math.round(432 / 5.4), // 80
    THRESHOLD: () => Math.round(369 / 61.5), // 6
    GAP: () => Math.round(432 / 54), // 8
    CIRC: 138,
    // Funções canônicas
    F: v => v * 1134 / 369,
    C: v => v / (1134 / 369),
    R: f => f % 9 || 9,
    MAT: v => v * (369 / 1134),
    V: (d, t) => d * 1134 / (t * 369)
  };

  // ── ARCHETYPES ──
  const ARCHETYPES = [
    { name: 'atlas', p: '#8e9aaf', s: '#5c6478', a: '#b0bec5', f: TRINITY.UNO, e: '🗿', r: 'FUNDAÇÃO · ESTRUTURA', opcode: '0x00', node: 'NÓ 1-3', freud: 'EGO - Princípio de Realidade', jung: 'Self MESTRE', manychat: '01-ATLAS Boas-Vindas', A1: 'OLÁ! EU SOU A ATLAS DA FEELING DECOR', A2: 'Eu organizo o fluxo com sabedoria cósmica', A3: 'AQUI TUDO TEM lugar. TUDO TEM ordem.', A4: 'AQUI NÃO decoramos por decorar. CRIAMOS atmosfera', A5: 'ESCOLHA SEU primeiro passo' },
    { name: 'nova', p: '#00e5ff', s: '#0099cc', a: '#80f4ff', f: TRINITY.DUAL, e: '💨', r: 'SOPRO NOVO · RENASCIMENTO', opcode: '0x01', node: 'NÓ 9', freud: 'Eros - libido novo objeto', jung: 'RENASCIMENTO - Fênix', manychat: 'Gatilho lançamento', A1: 'CHEGOU O SOPRO NOVO', A2: 'Inspiração viva brota do silêncio', A3: 'Algo gestado no silêncio', A4: 'AQUI NÃO É decoração', A5: 'QUE VOCÊ QUER fazer AGORA' },
    { name: 'vitalis', p: '#00e070', s: '#00a050', a: '#80ffb8', f: TRINITY.TRINITY, e: '🌿', r: 'FORÇA QUE NÃO CANSA', opcode: '0x02', node: 'NÓ 1', freud: 'Libido sublimada', jung: 'HERÓI', manychat: 'Conteúdos principais', A1: 'EU SOU VITALIS', A2: 'Energia vital em expansão', A3: 'Todo dia o seu lar bate na porta', A4: 'NÃO É esforço', A5: 'RECEBA HOJE' },
    { name: 'pulse', p: '#ff7020', s: '#cc3800', a: '#ffaa60', f: 741, e: '💓', r: 'EMOÇÃO QUE DANÇA', opcode: '0x03', node: 'NÓ 2', freud: 'ID - desejo imediato', jung: 'AMANTE', manychat: 'Oferta / Curadoria', A1: 'VOCÊ NÃO PEDIU ORÇAMENTO POR acaso', A2: 'Emoção é linguagem que dança', A3: 'Alguma coisa tocou', A4: 'ESSE SENTIMENTO NÃO É engano', A5: 'TUDO PRONTO PRA você' },
    { name: 'kaos', p: '#ff2a6d', s: '#aa0040', a: '#ff80a0', f: 852, e: '⚡', r: 'FOGO QUE QUEIMA DESCULPAS', opcode: '0x04', node: 'NÓ 5', freud: 'Thanatos - destruição criativa', jung: 'REBELDE', manychat: 'Keywords: CARO,TEMPO', A1: 'VAMOS FALAR A verdade', A2: 'Eu sou o rompimento', A3: 'VOCÊ DIZ que é caro', A4: 'O VERDADEIRO PREÇO', A5: 'O FOGO QUEIMOU' },
    { name: 'artemis', p: '#c8c8e0', s: '#7070a0', a: '#f0f0ff', f: 741, e: '🏹', r: 'MAPA QUE NÃO ERRA', opcode: '0x09', node: 'NÓ 3', freud: 'EGO - mapa', jung: 'SÁBIO', manychat: 'Falar com Viviani', A1: 'EU SOU ARTEMIS', A2: 'Descubro o mapa sagrado', A3: 'Toda dúvida é caminho não mostrado', A4: 'NADA FICA no escuro', A5: 'O QUE QUER descobrir' },
    { name: 'serena', p: '#c084fc', s: '#7c3aed', a: '#e8c0ff', f: TRINITY.TRINITY, e: '🛡️', r: 'CAMPO QUE ACOLHE', opcode: '0x0A', node: 'NÓ 4', freud: 'Estágio ORAL', jung: 'GRANDE MÃE', manychat: 'Pós-compra', A1: 'EU SOU SERENA', A2: 'Cuido do campo', A3: 'PARABÉNS PELA decisão', A4: 'AQUI DENTRO não tem pressa', A5: 'SEU PRIMEIRO PASSO' },
    { name: 'genus', p: '#f59e0b', s: '#b45309', a: '#fcd34d', f: TRINITY.DUAL, e: '✋', r: 'PROVA QUE SE MOSTRA', opcode: '0x0B', node: 'NÓ 5', freud: 'SUPEREGO', jung: 'HOMEM COMUM', manychat: 'PROVA,RESULTADO', A1: 'NÃO PRECISA acreditar', A2: 'Mãos moldam o invisível', A3: 'A VERDADE não pede crença', A4: 'Pessoas comuns confiaram', A5: 'VEJA COM SEUS olhos' },
    { name: 'lumine', p: '#ffd700', s: '#e09000', a: '#fff280', f: TRINITY.DUAL, e: '☀️', r: 'LUZ QUE DANÇA', opcode: '0x06', node: 'NÓ 6', freud: 'SUBLIMAÇÃO', jung: 'INOCENTE', manychat: 'Story Mention', A1: 'EU SOU LUMINE', A2: 'A luz dança comigo', A3: 'Que amor receber resposta', A4: 'SE A LUZ DANÇA', A5: 'UM PRESENTINHO' },
    { name: 'solus', p: '#f5f5f5', s: '#aaaaaa', a: '#ffffff', f: TRINITY.AION, e: '🌑', r: 'ESPELHO QUE MOSTRA VERDADE', opcode: '0x0C', node: 'NÓ 7', freud: 'ISOLAMENTO', jung: 'INDIVIDUAÇÃO', manychat: 'Quiz autoconhecimento', A1: 'EU SOU SOLUS', A2: 'Silêncio ritual', A3: 'UMA VEZ POR SEMANA paro', A4: 'Quem está dirigindo minha casa?', A5: 'QUER IR MAIS FUNDO' },
    { name: 'rhea', p: '#b5883c', s: '#7c5010', a: '#d4a860', f: TRINITY.UNO, e: '🔗', r: 'REDE QUE UNE TUDO', opcode: '0x0D', node: 'NÓ 7-8', freud: 'IDENTIFICAÇÃO grupo', jung: 'HOMEM COMUM', manychat: 'Grupo VIP', A1: 'EU SOU RHEA', A2: 'Estou em comunhão', A3: 'NENHUMA JORNADA é sozinha', A4: 'AQUI NÃO TEM competição', A5: 'VOCÊ ESTÁ CONVIDADA' },
    { name: 'aion', p: '#9f7aea', s: '#5b21b6', a: '#d4b8ff', f: TRINITY.AION, e: '♾️', r: 'TEMPO VIVO', opcode: '0x07', node: 'NÓ 8-10', freud: 'REPETIÇÃO COMPULSIVA', jung: 'CICLO - Eterno Retorno', manychat: 'Retenção 30/60/90 dias', A1: 'EU SOU AION', A2: 'Sou o tempo vivo', A3: '30 DIAS JUNTOS', A4: 'O primeiro passo foi difícil', A5: 'O QUE QUER FAZER NO PRÓXIMO ciclo' },
    { name: 'kobllux', p: '#C9A84C', s: '#8B4513', a: '#F0C060', f: TRINITY.UNO, e: '∞', r: 'VERDADE·INTEGRAR·TRINITY', opcode: '0x08', node: 'CENTRO', freud: 'EGO MESTRE - VERDADE×INTEGRAR÷∆=∞', jung: 'Self TOTAL - TRINDADE', manychat: 'Fórmula Sagrada', A1: 'KOBLLUX · SISTEMA 12 ARQUÉTIPOS', A2: 'VERDADE × [C∅DBL∅CK§ × C∆BLEX ÷ ∆] = ∞', A3: 'AQUI TUDO TEM lugar', A4: 'NÃO decoramos por decorar', A5: 'ESCOLHA SEU primeiro passo' }
  ];

  let currentIdx = ARCHETYPES.findIndex(a => a.name === 'kobllux');
  let archCardIdx = currentIdx;

  // ── TOAST ──
  function toast(msg) {
    const el = document.getElementById('kblx-toast');
    el.textContent = msg + ` · ${TRINITY.SIG}`;
    el.classList.add('show');
    clearTimeout(el._t);
    el._t = setTimeout(() => el.classList.remove('show'), TRINITY.TRINITY);
  }

  function hexToRgba(hex, a) {
    const r = parseInt(hex.slice(1,3),16), g = parseInt(hex.slice(3,5),16), b = parseInt(hex.slice(5,7),16);
    return `rgba(${r},${g},${b},${a})`;
  }

  function buildOrbGradient(arch) {
    return `radial-gradient(circle at 35% 30%, ${arch.a} 0%, rgba(255,255,255,0.05) 14%, transparent 55%), radial-gradient(circle at 70% 72%, ${arch.p} 0%, ${arch.s} 100%)`;
  }

  function applyArchetype(idx, triggerX, triggerY, animate = true) {
    currentIdx = ((idx % ARCHETYPES.length) + ARCHETYPES.length) % ARCHETYPES.length;
    const arch = ARCHETYPES[currentIdx];
    const root = document.documentElement;

    root.style.setProperty('--kob-voice-primary', arch.p);
    root.style.setProperty('--kob-voice-secondary', arch.s);
    root.style.setProperty('--kob-voice-accent', arch.a);
    root.style.setProperty('--arch-color', arch.p);
    root.style.setProperty('--arch-glow', hexToRgba(arch.p, 0.32));
    root.style.setProperty('--arch-glow-strong', hexToRgba(arch.p, 0.6));
    root.style.setProperty('--arch-emoji', `'${arch.e}'`);

    const orbCore = document.querySelector('.orb-core');
    if (orbCore) orbCore.style.background = buildOrbGradient(arch);

    const hud = document.getElementById('hudStatus');
    if (hud) hud.textContent = `${arch.name.toUpperCase()} · ${arch.f}Hz · ${TRINITY.SIG}`;

    document.querySelectorAll('.arch-chip').forEach(c => {
      c.classList.toggle('active', c.dataset.archName === arch.name);
    });

    if (animate) {
      const ripple = document.getElementById('chromaRipple');
      const bar = document.getElementById('symbolBar');
      const barRect = bar.getBoundingClientRect();
      const rx = triggerX ?? (barRect.left + barRect.width/2);
      const ry = triggerY ?? (barRect.top + barRect.height/2);

      ripple.style.setProperty('--ripple-x', (rx/window.innerWidth*100)+'%');
      ripple.style.setProperty('--ripple-y', (ry/window.innerHeight*100)+'%');
      ripple.style.background = `radial-gradient(circle at ${rx/window.innerWidth*100}% ${ry/window.innerHeight*100}%, ${arch.p} 0%, ${hexToRgba(arch.s, 0.5)} 30%, transparent 70%)`;
      ripple.classList.remove('fire'); void ripple.offsetWidth; ripple.classList.add('fire');
      bar.classList.remove('chroma-transition'); void bar.offsetWidth; bar.classList.add('chroma-transition');
      setTimeout(() => bar.classList.remove('chroma-transition'), TRINITY.UNO);
    }

    try {
      localStorage.setItem('kob_arch', arch.name);
      localStorage.setItem('kob_arch_freud', arch.freud);
      localStorage.setItem('kob_arch_jung', arch.jung);
    } catch(e) {}

    console.log(`%c${arch.opcode} ${arch.name.toUpperCase()} · ${arch.f}Hz · ${TRINITY.SIG}`, 'color:'+arch.p);
  }

  // ── CAROUSEL ──
  const VISIBLE = 4;
  const ITEM_H = TRINITY.K.K3;
  const GAP = TRINITY.GAP();

  const NAV_BUTTONS = [
    { label: '◀', id: 'btn-prev', url: null, title: 'Anterior' },
    { label: '▶', id: 'btn-play', url: null, title: 'Play / Pause TTS' },
    { label: '■', id: 'tts-stop', url: null, title: 'Parar TTS' },
    { label: '▶▶', id: 'btn-next', url: null, title: 'Próximo' },
    { label: '🌌', id: 'btn-phi', url: 'about:blank', title: 'Phi', dataId: 'phi' },
    { label: '🛋', id: 'btn-viv', url: 'about:blank', title: 'Viv', dataId: 'viv' },
    { label: '◌', id: 'btn-home', url: 'about:blank', title: 'Home', dataId: 'home' },
    { label: '◘', id: 'btn-doc', url: 'about:blank', title: 'Doc', dataId: 'doc' }
  ];

  let carouselIdx = 0, carouselDragging = false, carouselDragStart = 0, carouselDragDelta = 0;
  let isCarouselHorizontal = false;

  function checkHorizontal() {
    const bar = document.getElementById('symbolBar');
    return bar.classList.contains('snap-top') || bar.classList.contains('snap-bottom');
  }

  function buildCarousel() {
    const bar = document.getElementById('symbolBar');
    const vp = document.createElement('div');
    vp.className = 'kblx-carousel-viewport';
    vp.style.height = (VISIBLE * ITEM_H - GAP) + 'px';
    bar.querySelector('.hud-info').before(vp);

    const track = document.createElement('div');
    track.className = 'kblx-carousel-track';
    track.style.gap = GAP + 'px';
    vp.appendChild(track);

    const dots = document.createElement('div');
    dots.className = 'kblx-dots';
    bar.querySelector('.hud-info').before(dots);

    NAV_BUTTONS.forEach(def => {
      const wrap = document.createElement('div');
      wrap.className = 'symbol-wrap';
      const btn = document.createElement('button');
      btn.className = 'symbol-button';
      btn.id = def.id;
      btn.title = def.title;
      btn.textContent = def.label;
      btn.style.position = 'relative';
      if (def.url !== null) btn.dataset.url = def.url;
      if (def.dataId) btn.dataset.id = def.dataId;
      if (def.url !== null) {
        const ring = document.createElement('div');
        ring.className = 'kblx-ring';
        ring.innerHTML = '<svg viewBox="0 0 44 44"><circle cx="22" cy="22" r="18" class="nav-ring-c"/></svg>';
        btn.appendChild(ring);
        setupNavLongPress(btn);
      }
      wrap.appendChild(btn);
      track.appendChild(wrap);
    });

    document.getElementById('btn-prev')?.addEventListener('click', () => applyArchetype(currentIdx - 1));
    document.getElementById('btn-next')?.addEventListener('click', () => applyArchetype(currentIdx + 1));
    document.getElementById('btn-play')?.addEventListener('click', togglePlay);
    document.getElementById('tts-stop')?.addEventListener('click', stopTTS);

    ['btn-phi','btn-viv','btn-home','btn-doc'].forEach(id => {
      document.getElementById(id)?.addEventListener('click', function(e) {
        if (this._longPressed) { this._longPressed = false; return; }
        const url = this.dataset.url;
        if (url && url !== 'about:blank') loadInternalFrame(url);
      });
    });

    // Drag
    track.addEventListener('mousedown', e => {
      isCarouselHorizontal = checkHorizontal();
      carouselDragging = true;
      carouselDragStart = isCarouselHorizontal ? e.clientX : e.clientY;
      carouselDragDelta = 0;
      track.classList.add('kblx-dragging');
      e.preventDefault();
    });

    document.addEventListener('mousemove', e => {
      if (!carouselDragging) return;
      const cur = isCarouselHorizontal ? e.clientX : e.clientY;
      carouselDragDelta = cur - carouselDragStart;
      applyTrack(carouselIdx * ITEM_H - carouselDragDelta, false, track);
      applyCoverflow(carouselIdx * ITEM_H - carouselDragDelta, track);
    });

    document.addEventListener('mouseup', () => {
      if (!carouselDragging) return;
      carouselDragging = false;
      track.classList.remove('kblx-dragging');
      snapCarousel(carouselIdx - Math.round(carouselDragDelta / ITEM_H), track, dots);
    });

    track.addEventListener('touchstart', e => {
      isCarouselHorizontal = checkHorizontal();
      carouselDragStart = isCarouselHorizontal ? e.touches[0].clientX : e.touches[0].clientY;
      carouselDragDelta = 0;
      carouselDragging = true;
      track.classList.add('kblx-dragging');
    }, { passive: true });

    track.addEventListener('touchmove', e => {
      if (!carouselDragging) return;
      const cur = isCarouselHorizontal ? e.touches[0].clientX : e.touches[0].clientY;
      carouselDragDelta = cur - carouselDragStart;
      applyTrack(carouselIdx * ITEM_H - carouselDragDelta, false, track);
      applyCoverflow(carouselIdx * ITEM_H - carouselDragDelta, track);
    }, { passive: true });

    track.addEventListener('touchend', () => {
      if (!carouselDragging) return;
      carouselDragging = false;
      track.classList.remove('kblx-dragging');
      snapCarousel(carouselIdx - Math.round(carouselDragDelta / ITEM_H), track, dots);
    });

    vp.addEventListener('wheel', e => {
      e.preventDefault();
      const horiz = checkHorizontal();
      const delta = horiz ? (e.deltaX !== 0 ? e.deltaX : e.deltaY) : e.deltaY;
      snapCarousel(carouselIdx + (delta > 0 ? 1 : -1), track, dots);
    }, { passive: false });

    snapCarousel(0, track, dots);
  }

  function getMaxIdx() { return Math.max(0, NAV_BUTTONS.length - VISIBLE); }

  function applyTrack(offsetPx, animate, track) {
    track.style.transition = animate ? `transform ${TRINITY.UNO}ms cubic-bezier(0.25,0.8,0.25,1)` : 'none';
    if (isCarouselHorizontal) {
      track.style.transform = `translateX(${-offsetPx}px)`;
    } else {
      track.style.transform = `translateY(${-offsetPx}px)`;
    }
  }

  function applyCoverflow(offsetPx, track) {
    const items = track.querySelectorAll('.symbol-wrap');
    const centerI = offsetPx / ITEM_H + (VISIBLE - 1) / 2;
    items.forEach((item, i) => {
      const d = Math.abs(i - centerI);
      const scale = d < 0.5 ? 1 : d < 1.5 ? 1 - (d - 0.5) * 0.26 : 0.74;
      const opacity = d < 0.5 ? 1 : d < 1.5 ? 1 - (d - 0.5) * 0.38 : 0.62;
      const zIdx = d < 0.5 ? 10 : d < 1.5 ? 5 : 1;
      item.style.setProperty('--kblx-item-scale', scale.toFixed(3));
      item.style.setProperty('--kblx-item-opacity', opacity.toFixed(3));
      item.style.setProperty('--kblx-item-z', zIdx);
    });
  }

  function renderDots(track, dots) {
    dots.innerHTML = '';
    const pages = Math.ceil(NAV_BUTTONS.length / VISIBLE);
    const active = Math.floor(carouselIdx / VISIBLE);
    for (let i = 0; i < pages; i++) {
      const d = document.createElement('div');
      d.className = 'kblx-dot' + (i === active ? ' active' : '');
      d.addEventListener('click', () => snapCarousel(i * VISIBLE, track, dots));
      dots.appendChild(d);
    }
    dots.style.display = pages <= 1 ? 'none' : 'flex';
  }

  function snapCarousel(idx, track, dots) {
    carouselIdx = Math.max(0, Math.min(Math.round(idx), getMaxIdx()));
    const offsetPx = carouselIdx * ITEM_H;
    applyTrack(offsetPx, true, track);
    applyCoverflow(offsetPx, track);
    renderDots(track, dots);
  }

  // ── DRAG & SNAP DA BARRA (com threshold canônico) ──
  function enableSymbolBarDrag() {
  const bar = document.getElementById('symbolBar');
  const toggle = document.getElementById('toggleBtn');
  let isDragging = false, hasMoved = false;
  let startX, startY, origLeft, origTop;

  const SNAP_TOP = 60; // distância do topo para ativar snap
  const SNAP_BOTTOM = 60; // distância do fundo para ativar snap
  const THRESHOLD = 6; // movimento mínimo para considerar arraste

  function onPointerDown(e) {
    if (e.target.closest('.symbol-button') && e.target.closest('.symbol-button') !== toggle) return;
    if (e.target.id === 'btn-arch' || e.target.closest('#btn-arch')) return;
    isDragging = true;
    hasMoved = false;
    const pt = e.touches ? e.touches[0] : e;
    startX = pt.clientX;
    startY = pt.clientY;
    const rect = bar.getBoundingClientRect();
    origLeft = rect.left;
    origTop = rect.top;
    bar.style.transition = 'none';
    bar.style.willChange = 'top, left';
    if (e.cancelable) e.preventDefault();
  }

  function onPointerMove(e) {
    if (!isDragging) return;
    const pt = e.touches ? e.touches[0] : e;
    const dx = pt.clientX - startX;
    const dy = pt.clientY - startY;
    if (!hasMoved && Math.hypot(dx, dy) < THRESHOLD) return;
    if (!hasMoved) {
      hasMoved = true;
      bar.classList.add('is-dragging');
      bar.classList.remove('snap-left', 'snap-top', 'snap-bottom');
      bar.classList.add('floating');
    }
    let newLeft = origLeft + dx;
    let newTop = origTop + dy;
    // Limites para não sair da tela
    newLeft = Math.max(0, Math.min(window.innerWidth - bar.offsetWidth, newLeft));
    newTop = Math.max(0, Math.min(window.innerHeight - bar.offsetHeight, newTop));
    bar.style.left = newLeft + 'px';
    bar.style.top = newTop + 'px';
    bar.style.right = 'auto';
    bar.style.bottom = 'auto';
    bar.style.width = 'auto';
    bar.style.transform = 'none';

    // Feedback visual (não usado para decisão)
    bar.classList.remove('will-snap-left', 'will-snap-top', 'will-snap-bottom');
    const rect = bar.getBoundingClientRect();
    if (rect.top < SNAP_TOP) {
      bar.classList.add('will-snap-top');
    } else if (rect.bottom > window.innerHeight - SNAP_BOTTOM) {
      bar.classList.add('will-snap-bottom');
    } else if (rect.left < window.innerWidth / 2) {
      bar.classList.add('will-snap-left');
    }
    if (e.cancelable) e.preventDefault();
  }

  function onPointerUp() {
    if (!isDragging) return;
    isDragging = false;
    bar.classList.remove('is-dragging', 'will-snap-left', 'will-snap-top', 'will-snap-bottom');
    bar.style.transition = '';
    bar.style.willChange = 'auto';
    if (!hasMoved) return;

    const rect = bar.getBoundingClientRect();
    const topPos = rect.top;
    const bottomPos = rect.bottom;
    const leftPos = rect.left;
    const rightPos = rect.right;

    // Decisão de snap
    if (topPos < SNAP_TOP) {
      // Snap top
      bar.className = 'symbol-bar snap-top';
      bar.style.left = '0';
      bar.style.right = '0';
      bar.style.top = '0';
      bar.style.bottom = 'auto';
      bar.style.width = '100%';
      bar.style.maxWidth = '100vw';
      bar.style.transform = 'none';
      localStorage.setItem('kob_bar_pos', 'top');
      toast(`⊙ SNAP: TOP · ${TRINITY.TRINITY}Hz`);
    } else if (bottomPos > window.innerHeight - SNAP_BOTTOM) {
      // Snap bottom
      bar.className = 'symbol-bar snap-bottom';
      bar.style.left = '0';
      bar.style.right = '0';
      bar.style.top = 'auto';
      bar.style.bottom = '0';
      bar.style.width = '100%';
      bar.style.maxWidth = '100vw';
      bar.style.transform = 'none';
      localStorage.setItem('kob_bar_pos', 'bottom');
      toast(`⊙ SNAP: BOTTOM · ${TRINITY.TRINITY}Hz`);
    } else {
      // Snap left (padrão)
      bar.className = 'symbol-bar snap-left';
      bar.style.left = '0';
      bar.style.right = 'auto';
      bar.style.top = '50%';
      bar.style.bottom = 'auto';
      bar.style.width = 'auto';
      bar.style.maxWidth = '80px';
      bar.style.transform = 'translateY(-50%)';
      localStorage.setItem('kob_bar_pos', 'left');
      toast(`⊙ SNAP: LEFT · ${TRINITY.UNO}Hz · MEMÓRIA`);
    }
  }

  // Eventos
  toggle.addEventListener('pointerdown', onPointerDown);
  toggle.addEventListener('touchstart', onPointerDown, { passive: false });
  bar.addEventListener('pointerdown', onPointerDown);
  bar.addEventListener('touchstart', onPointerDown, { passive: false });
  document.addEventListener('pointermove', onPointerMove);
  document.addEventListener('touchmove', onPointerMove, { passive: false });
  document.addEventListener('pointerup', onPointerUp);
  document.addEventListener('touchend', onPointerUp);

  // Restaurar posição salva
  const saved = localStorage.getItem('kob_bar_pos');
  if (saved) {
    if (saved === 'top') {
      bar.className = 'symbol-bar snap-top';
      bar.style.left = '0'; bar.style.right = '0'; bar.style.top = '0'; bar.style.width = '100%'; bar.style.maxWidth = '100vw'; bar.style.transform = 'none';
    } else if (saved === 'bottom') {
      bar.className = 'symbol-bar snap-bottom';
      bar.style.left = '0'; bar.style.right = '0'; bar.style.bottom = '0'; bar.style.top = 'auto'; bar.style.width = '100%'; bar.style.maxWidth = '100vw'; bar.style.transform = 'none';
    } else if (saved === 'left') {
      bar.className = 'symbol-bar snap-left';
      bar.style.left = '0'; bar.style.top = '50%'; bar.style.transform = 'translateY(-50%)';
    }
  }
}

  // ── LOAD INTERNAL FRAME ──
  function loadInternalFrame(url) {
    const frame = document.getElementById('kob-bg-frame');
    const veil = document.getElementById('kob-frame-veil');
    const close = document.getElementById('kob-frame-close');
    frame.src = url;
    frame.classList.add('visible');
    veil.classList.add('visible');
    close.classList.add('visible');
    toast(`⊙ CARREGANDO: ${url.split('/').pop()} · ${TRINITY.SIG}`);
  }

  document.getElementById('kob-frame-close').addEventListener('click', () => {
    const frame = document.getElementById('kob-bg-frame');
    const veil = document.getElementById('kob-frame-veil');
    const close = document.getElementById('kob-frame-close');
    frame.classList.remove('visible');
    veil.classList.remove('visible');
    close.classList.remove('visible');
    setTimeout(() => { frame.src = 'about:blank'; }, TRINITY.DUAL);
  });

  // ── ARCH WHEEL ──
  function buildArchWheel() {
    const wheel = document.getElementById('archWheel');
    ARCHETYPES.forEach((arch, idx) => {
      const chip = document.createElement('div');
      chip.className = 'arch-chip';
      chip.dataset.archName = arch.name;
      chip.style.color = arch.p;
      chip.innerHTML = `
        <div class="a-orb" style="background: radial-gradient(circle at 35% 30%, ${arch.a} 0%, transparent 50%), radial-gradient(circle at 70% 70%, ${arch.p} 0%, ${arch.s} 100%);"></div>
        <div class="a-name">${arch.name}</div>
        <div class="a-freq">${arch.f}Hz</div>
        <div style="font-size:5px;opacity:0.4">${arch.opcode} · ${TRINITY.SIG}</div>
      `;
      chip.addEventListener('click', () => {
        const r = chip.getBoundingClientRect();
        applyArchetype(idx, r.left + r.width/2, r.top + r.height/2);
        closeArchOverlay();
      });
      wheel.appendChild(chip);
    });
  }

  document.getElementById('btn-arch').addEventListener('click', () => {
    if (document.getElementById('btn-arch')._longPressed) { document.getElementById('btn-arch')._longPressed = false; return; }
    openArchOverlay();
  });

  function openArchOverlay() { document.getElementById('arch-overlay').classList.add('open'); }
  function closeArchOverlay() { document.getElementById('arch-overlay').classList.remove('open'); }
  document.getElementById('arch-overlay').addEventListener('click', e => {
    if (e.target === document.getElementById('arch-overlay')) closeArchOverlay();
  });

  // ── ARCH CARD ──
  function openArchCard(idx) {
    archCardIdx = ((idx % ARCHETYPES.length) + ARCHETYPES.length) % ARCHETYPES.length;
    renderArchCard();
    document.getElementById('arch-card-overlay').classList.add('open');
  }
  function closeArchCard() { document.getElementById('arch-card-overlay').classList.remove('open'); }

  function renderArchCard() {
    const arch = ARCHETYPES[archCardIdx];
    document.getElementById('acp-chip').textContent = `${arch.opcode} · ${arch.name.toUpperCase()} · ${arch.f}Hz · ${TRINITY.SIG}`;
    document.getElementById('acp-name').textContent = arch.name.toUpperCase();
    document.getElementById('acp-role').textContent = arch.r;
    document.getElementById('acp-freq').innerHTML = `${arch.f} <span>Hz · ${arch.f===432?'UNO':arch.f===528?'DUAL':arch.f===639?'TRINITY':'AION'}</span>`;
    document.getElementById('acp-emoji').textContent = arch.e;
    document.getElementById('acp-nav-name').textContent = arch.name.toUpperCase();
    document.getElementById('acp-placeholder-text').innerHTML =
      `[ ${arch.name.toUpperCase()} · A1→A5 · ${TRINITY.TEMPO} ]<br><b>A1:</b> ${arch.A1}<br><b>A2:</b> ${arch.A2}<br><b>A3:</b> ${arch.A3}<br><b>A4:</b> ${arch.A4}<br><b>A5:</b> ${arch.A5}`;
    document.getElementById('acp-freud').innerHTML = `<b style="color:${arch.p}">FREUD ${TRINITY.UNO}Hz:</b> ${arch.freud}`;
    document.getElementById('acp-jung').innerHTML = `<b style="color:${arch.p}">JUNG ${TRINITY.DUAL}Hz:</b> ${arch.jung}`;
    document.getElementById('acp-manychat').innerHTML = `<b style="color:${arch.p}">MANYCHAT ${TRINITY.TRINITY}Hz:</b> ${arch.manychat}`;
    document.getElementById('acp-formula').innerHTML = `<b>Φ-NODE:</b> ${arch.node}<br><b>FÓRMULA:</b> VERDADE×[C∅DBL∅CK§×C∆BLEX÷∆]=∞ · ${TRINITY.SIG}`;
    document.documentElement.style.setProperty('--arch-color', arch.p);
    document.documentElement.style.setProperty('--arch-glow', hexToRgba(arch.p, 0.32));
    const orbEl = document.getElementById('acp-orb');
    orbEl.style.background = `radial-gradient(circle at 35% 30%, ${arch.a} 0%, rgba(255,255,255,0.06) 15%, transparent 55%), radial-gradient(circle at 70% 72%, ${arch.p} 0%, ${arch.s} 100%)`;
  }

  document.getElementById('acp-close').addEventListener('click', closeArchCard);
  document.getElementById('acp-select').addEventListener('click', () => {
    applyArchetype(archCardIdx);
    closeArchCard();
    toast(`⊙ ATIVADO: ${ARCHETYPES[currentIdx].name.toUpperCase()} · ${ARCHETYPES[currentIdx].f}Hz · ${TRINITY.SIG}`);
  });
  document.getElementById('acp-prev').addEventListener('click', () => {
    archCardIdx = ((archCardIdx - 1 + ARCHETYPES.length) % ARCHETYPES.length);
    renderArchCard();
  });
  document.getElementById('acp-next').addEventListener('click', () => {
    archCardIdx = ((archCardIdx + 1) % ARCHETYPES.length);
    renderArchCard();
  });
  document.getElementById('arch-card-overlay').addEventListener('click', e => {
    if (e.target === document.getElementById('arch-card-overlay')) closeArchCard();
  });

  // ── LONG PRESS ORB ──
  (function setupOrbLongPress() {
    const btn = document.getElementById('btn-arch');
    const circle = document.getElementById('orb-ring-circle');
    const CIRC = TRINITY.CIRC; // 138
    const DURATION = TRINITY.TRINITY; // 639ms
    let timer, raf, t0;
    function start() {
      btn._longPressed = false; t0 = Date.now();
      timer = setTimeout(() => {
        btn._longPressed = true;
        cancelAnimationFrame(raf);
        if (circle) circle.style.strokeDashoffset = CIRC;
        openArchCard(currentIdx);
      }, DURATION);
      (function tick() {
        if (t0 === null) return;
        const p = Math.min((Date.now() - t0) / DURATION, 1);
        if (circle) { circle.style.transition = 'none'; circle.style.strokeDashoffset = CIRC * (1 - p); }
        if (p < 1) raf = requestAnimationFrame(tick);
      })();
    }
    function cancel() {
      clearTimeout(timer); cancelAnimationFrame(raf); t0 = null;
      if (circle) { circle.style.transition = `stroke-dashoffset ${TRINITY.UNO}ms ease`; circle.style.strokeDashoffset = CIRC; }
    }
    btn.addEventListener('pointerdown', start, { passive: true });
    btn.addEventListener('pointerup', cancel, { passive: true });
    btn.addEventListener('pointerleave', cancel, { passive: true });
  })();

  // ── LONG PRESS NAV ──
  function setupNavLongPress(btn) {
    const CIRC = 113;
    const DURATION = 3000;
    let timer, raf, t0;
    function start() {
      btn._longPressed = false; t0 = Date.now();
      timer = setTimeout(() => {
        btn._longPressed = true;
        cancelAnimationFrame(raf);
        const c = btn.querySelector('.nav-ring-c');
        if (c) { c.style.transition = `stroke-dashoffset ${TRINITY.UNO}ms ease`; c.style.strokeDashoffset = CIRC; }
        openUrlEditor(btn);
      }, DURATION);
      (function tick() {
        if (t0 === null) return;
        const p = Math.min((Date.now() - t0) / DURATION, 1);
        const c = btn.querySelector('.nav-ring-c');
        if (c) { c.style.transition = 'none'; c.style.strokeDashoffset = CIRC * (1 - p); }
        if (p < 1) raf = requestAnimationFrame(tick);
      })();
    }
    function cancel() {
      clearTimeout(timer); cancelAnimationFrame(raf); t0 = null;
      const c = btn.querySelector('.nav-ring-c');
      if (c) { c.style.transition = `stroke-dashoffset ${TRINITY.UNO}ms ease`; c.style.strokeDashoffset = CIRC; }
    }
    btn.addEventListener('pointerdown', start, { passive: true });
    btn.addEventListener('pointerup', cancel, { passive: true });
    btn.addEventListener('pointerleave', cancel, { passive: true });
  }

  let urlEditorTarget = null;
  function openUrlEditor(btn) {
    urlEditorTarget = btn;
    const id = btn.dataset.id || btn.id || '?';
    document.getElementById('kblx-ttl').textContent = `Botão · ${id} · ${TRINITY.SIG}`;
    document.getElementById('kblx-inp').value = btn.dataset.url || '';
    document.getElementById('kblx-back').classList.add('open');
    setTimeout(() => document.getElementById('kblx-inp').focus(), 80);
  }

  document.getElementById('kblx-btn-save').addEventListener('click', () => {
    if (urlEditorTarget) {
      const v = document.getElementById('kblx-inp').value.trim();
      if (v) { urlEditorTarget.dataset.url = v; toast(`✓ URL atualizado · ${TRINITY.SIG}`); }
    }
    document.getElementById('kblx-back').classList.remove('open');
  });
  document.getElementById('kblx-btn-close').addEventListener('click', () => document.getElementById('kblx-back').classList.remove('open'));
  document.getElementById('kblx-back').addEventListener('click', e => {
    if (e.target === document.getElementById('kblx-back')) document.getElementById('kblx-back').classList.remove('open');
  });

  // ── TTS ──
  let currentUtterance = null;
  function speak(text) {
    if (!window.speechSynthesis) return;
    stopTTS();
    const utt = new SpeechSynthesisUtterance(text);
    utt.lang = 'pt-BR'; utt.pitch = 1.0; utt.rate = 1.0;
    utt.onstart = () => document.getElementById('main-orb').classList.add('speaking');
    utt.onend = utt.onerror = () => document.getElementById('main-orb').classList.remove('speaking');
    currentUtterance = utt;
    speechSynthesis.speak(utt);
  }
  function stopTTS() {
    if (window.speechSynthesis) speechSynthesis.cancel();
    document.getElementById('main-orb').classList.remove('speaking');
  }

  function togglePlay() {
    if (!window.speechSynthesis) return;
    if (speechSynthesis.speaking && !speechSynthesis.paused) {
      speechSynthesis.pause(); // microfreeze
      toast(`◼ MICROFREEZE · ${TRINITY.DUAL}Hz · conserva essência`);
    } else if (speechSynthesis.paused) {
      speechSynthesis.resume();
      toast(`▶ RESUME · ${TRINITY.TRINITY}Hz · fluxo`);
    } else {
      const a = ARCHETYPES[currentIdx];
      speak(`${a.A1}. ${a.A2}. ${a.A3}. Fórmula: VERDADE vezes COBLOCKS vezes CABLEX dividido por DELTA igual infinito. Nó: ${a.node}. Assinatura ${TRINITY.SIG} · ${TRINITY.TEMPO}`);
    }
  }

  // ── INIT ──
  window.addEventListener('load', () => {
    buildCarousel();
    buildArchWheel();
    enableSymbolBarDrag();

    const saved = localStorage.getItem('kob_arch');
    if (saved) {
      const idx = ARCHETYPES.findIndex(a => a.name === saved);
      if (idx >= 0) applyArchetype(idx, null, null, false);
    } else applyArchetype(currentIdx, null, null, false);

    // Particles.js com parâmetros canônicos
    if (window.particlesJS) {
      particlesJS('particles-js', {
        particles: {
          number: { value: 60 },
          color: { value: '#C9A84C' },
          shape: { type: 'circle' },
          opacity: { value: 0.2, random: true },
          size: { value: 2, random: true },
          line_linked: { enable: true, distance: 150, color: '#C9A84C', opacity: 0.1, width: 1 },
          move: { enable: true, speed: 0.8, direction: 'none', random: true, straight: false, out_mode: 'out' }
        },
        interactivity: {
          detect_on: 'canvas',
          events: {
            onhover: { enable: true, mode: 'grab' },
            onclick: { enable: true, mode: 'push' }
          },
          modes: { grab: { distance: 140, line_linked: { opacity: 0.2 } } }
        },
        retina_detect: true
      });
    }

    console.log(`%cKOBLLUX TRINITY SYSTEM v5.1 · ${TRINITY.SIG} · ${TRINITY.UNO}Hz/${TRINITY.DUAL}Hz/${TRINITY.TRINITY}Hz/${TRINITY.AION}Hz · TEMPO ${TRINITY.TEMPO} · MOBILE PATCH ATIVO · SELADO`, 'color:#C9A84C;font-size:12px;font-family:monospace');
  });
