/* ════════════════════════════════════════════════════════════════════════════════
   KOBLLUX HUB ∆³ — API UNIFICADA · ARQUITETURA MODULAR

   Módulos: KOBLLUX | BAÚ LITE | SYMBOL BAR | KODUX (Arquétipos)

   Cada módulo expõe sua própria API. O Hub roteia, sincroniza e converge.
   Pointer events reais (touch/mouse). Link KODUX↔Baú via 13 OpCodes.

   window.KOBLLUX_HUB = {
     modules: { kobllux, baulite, symbolbar, kodux },
     broadcast(event, data),
     route(to, action, data),
     sync(),
     archetype(opcode) // linka arquétipo ao conteúdo do baú
   }
   ════════════════════════════════════════════════════════════════════════════════ */

(function() {
  'use strict';
  if (window.KOBLLUX_HUB) return;

  const HUB = {
    version: 'HUB-∆³-v1.0.0',
    fractal: '3×6×9×7=1134',
    modules: {},
    events: new Map(),

    // ─── REGISTRO DE MÓDULOS ───
    register(name, api) {
      this.modules[name] = api;
      console.log(`[HUB·∆³] Módulo registrado: ${name}`);
      this.dispatch('hub:register', { module: name, api: Object.keys(api) });
      return this;
    },

    // ─── BROADCAST PARA TODOS ───
    broadcast(event, data = {}) {
      Object.entries(this.modules).forEach(([name, mod]) => {
        if (mod.onHubEvent) {
          try { mod.onHubEvent(event, data); } catch(e) {}
        }
      });
      this.dispatch(`hub:${event}`, data);
      console.log(`[HUB·∆³] Broadcast: ${event} → ${Object.keys(this.modules).join(', ')}`);
    },

    // ─── ROTA DIRECIONADA ───
    route(to, action, data = {}) {
      const mod = this.modules[to];
      if (!mod) { console.warn(`[HUB·∆³] Módulo não encontrado: ${to}`); return null; }
      if (typeof mod[action] === 'function') {
        const result = mod[action](data);
        this.dispatch(`hub:route`, { to, action, data, result });
        return result;
      }
      console.warn(`[HUB·∆³] Ação não encontrada: ${action} em ${to}`);
      return null;
    },

    // ─── SINCronização TOTAL ───
    sync() {
      const snapshot = {};
      Object.entries(this.modules).forEach(([name, mod]) => {
        if (mod.getState) snapshot[name] = mod.getState();
      });
      localStorage.setItem('hub:delta3:snapshot', JSON.stringify({
        timestamp: Date.now(),
        modules: Object.keys(this.modules),
        snapshot
      }));
      this.broadcast('sync', snapshot);
      console.log('[HUB·∆³] Sincronização total · snapshot salvo');
      return snapshot;
    },

    // ─── LINK ARQUÉTIPO ↔ BAÚ (os 13 opcodes como arquétipos) ───
    archetype(opcode) {
      // Busca no Baú Lite todas as chaves daquele opcode
      const baulite = this.modules.baulite;
      if (!baulite || !baulite.opcodes) return null;

      const op = baulite.opcodes.find(o => o.code === opcode);
      if (!op) return null;

      // Coleta chaves do localStorage que pertencem a esse opcode
      const keys = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (baulite.classify(k) === opcode) {
          keys.push({ key: k, val: localStorage.getItem(k), size: (localStorage.getItem(k)||'').length });
        }
      }

      const archetypeData = {
        opcode: op.code,
        name: op.name,
        label: op.label,
        dim: op.dim,
        color: op.color,
        icon: op.icon,
        keys: keys,
        totalBytes: keys.reduce((a, e) => a + e.size, 0),
        timestamp: Date.now()
      };

      // Salva no KODUX
      localStorage.setItem(`kodux:archetype_${opcode}`, JSON.stringify(archetypeData));
      this.broadcast('archetype:link', archetypeData);

      // Se o KODUX estiver aberto, atualiza a UI
      const kodux = this.modules.kodux;
      if (kodux && kodux.loadArchetype) {
        kodux.loadArchetype(archetypeData);
      }

      console.log(`[HUB·∆³] Arquétipo ${opcode} · ${op.name} linkado · ${keys.length} chaves`);
      return archetypeData;
    },

    // ─── DISPATCH INTERNO ───
    dispatch(event, data) {
      window.dispatchEvent(new CustomEvent(event, { detail: data }));
    },

    // ─── ESTADO DO HUB ───
    getState() {
      return {
        version: this.version,
        modules: Object.keys(this.modules),
        timestamp: Date.now()
      };
    },

    onHubEvent(event, data) {
      console.log(`[HUB·∆³] Evento recebido: ${event}`, data);
    }
  };

  // ════════════════════════════════════════════════════════════════════════════════
  // SYMBOL BAR API — com POINTER EVENTS REAIS (touch + mouse)
  // ════════════════════════════════════════════════════════════════════════════════
  const SymbolBarAPI = {
    name: 'symbolbar',
    element: null,
    state: { x: 0, y: 0, snapped: false, side: 'centro', dragging: false },

    init() {
      this.element = document.getElementById('symbolbar') 
                  || document.getElementById('kblx-symbolbar')
                  || document.querySelector('.symbolbar')
                  || document.querySelector('[class*="symbol"]');

      if (!this.element) {
        console.warn('[SymbolBar] Elemento não encontrado');
        return false;
      }

      this.bindPointerEvents();
      this.loadState();
      console.log('[SymbolBar] API inicializada · pointer events reais ativos');
      return true;
    },

    bindPointerEvents() {
      const bar = this.element;
      let startX, startY, startLeft, startTop;

      const onStart = (e) => {
        this.state.dragging = true;
        bar.classList.add('is-dragging');

        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;

        startX = clientX;
        startY = clientY;
        startLeft = bar.offsetLeft;
        startTop = bar.offsetTop;

        // Evento real de pointer
        HUB.dispatch('symbolbar:dragstart', { x: clientX, y: clientY, side: this.state.side });

        e.preventDefault();
      };

      const onMove = (e) => {
        if (!this.state.dragging) return;

        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;

        const dx = clientX - startX;
        const dy = clientY - startY;

        bar.style.left = (startLeft + dx) + 'px';
        bar.style.top = (startTop + dy) + 'px';
        bar.style.right = 'auto';
        bar.style.bottom = 'auto';

        this.state.x = startLeft + dx;
        this.state.y = startTop + dy;

        // Evento real de pointer move
        HUB.dispatch('symbolbar:dragmove', { x: this.state.x, y: this.state.y, dx, dy });

        e.preventDefault();
      };

      const onEnd = (e) => {
        if (!this.state.dragging) return;
        this.state.dragging = false;
        bar.classList.remove('is-dragging');

        // Detecta lado do snap
        const side = this.detectSide();
        this.state.side = side;
        this.state.snapped = (side !== 'centro');

        if (this.state.snapped) {
          bar.classList.add('snap-side');
          bar.classList.add(`snap-${side}`);
          this.applySnap(side);
        } else {
          bar.classList.remove('snap-side');
        }

        this.saveState();

        // Evento real de pointer end
        HUB.dispatch('symbolbar:dragend', { 
          x: this.state.x, 
          y: this.state.y, 
          side: side, 
          snapped: this.state.snapped 
        });

        console.log(`[SymbolBar] Pointer end · lado: ${side} · snapped: ${this.state.snapped}`);
      };

      // Touch events (mobile)
      bar.addEventListener('touchstart', onStart, { passive: false });
      document.addEventListener('touchmove', onMove, { passive: false });
      document.addEventListener('touchend', onEnd);

      // Mouse events (desktop)
      bar.addEventListener('mousedown', onStart);
      document.addEventListener('mousemove', onMove);
      document.addEventListener('mouseup', onEnd);
    },

    detectSide() {
      const rect = this.element.getBoundingClientRect();
      const w = window.innerWidth;
      const h = window.innerHeight;
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;

      if (cx < w * 0.25) return 'esquerda';
      if (cx > w * 0.75) return 'direita';
      if (cy < h * 0.25) return 'topo';
      if (cy > h * 0.75) return 'base';
      return 'centro';
    },

    applySnap(side) {
      const bar = this.element;
      const margin = 16;
      switch(side) {
        case 'esquerda': bar.style.left = margin + 'px'; bar.style.top = '50%'; bar.style.transform = 'translateY(-50%)'; break;
        case 'direita': bar.style.right = margin + 'px'; bar.style.left = 'auto'; bar.style.top = '50%'; bar.style.transform = 'translateY(-50%)'; break;
        case 'topo': bar.style.top = margin + 'px'; bar.style.left = '50%'; bar.style.transform = 'translateX(-50%)'; break;
        case 'base': bar.style.bottom = margin + 'px'; bar.style.top = 'auto'; bar.style.left = '50%'; bar.style.transform = 'translateX(-50%)'; break;
      }
    },

    saveState() {
      localStorage.setItem('symbolbar:state', JSON.stringify(this.state));
    },

    loadState() {
      try {
        const raw = localStorage.getItem('symbolbar:state');
        if (raw) {
          this.state = JSON.parse(raw);
          if (this.state.snapped) this.applySnap(this.state.side);
        }
      } catch(e) {}
    },

    getState() { return this.state; },

    onHubEvent(event, data) {
      if (event === 'sync') this.saveState();
      if (event === 'kobllux:layer' && data.layer) {
        // Muda cor do symbol bar conforme camada KOBLLUX
        const colors = { micro: '#b978ff', meso: '#67e6ff', macro: '#7cffb2' };
        this.element.style.borderColor = colors[data.layer] || '#67e6ff';
      }
    }
  };

  // ════════════════════════════════════════════════════════════════════════════════
  // KODUX API — Módulo de Arquétipos (0x05 SELAR)
  // ════════════════════════════════════════════════════════════════════════════════
  const KODUX = {
    name: 'kodux',
    currentOpcode: '0x05',
    archetypes: {},

    init() {
      // Pré-carrega os 13 arquétipos dos opcodes
      const opcodes = [
        { code:'0x00', name:'BOOT',     label:'Fundação',     icon:'○', color:'#b978ff' },
        { code:'0x01', name:'DELTA',    label:'Transformação', icon:'●', color:'#67e6ff' },
        { code:'0x02', name:'SEED',     label:'Semeadura',    icon:'―', color:'#7cffb2' },
        { code:'0x03', name:'DETECT',   label:'Detecção',     icon:'▢', color:'#4de0ff' },
        { code:'0x04', name:'INTEGRAR', label:'Integração',   icon:'◇', color:'#ff9ad1' },
        { code:'0x05', name:'SELAR',    label:'KODUX',        icon:'⧉', color:'#ff7a00' },
        { code:'0x06', name:'LIMPAR',   label:'Limpeza',      icon:'☯', color:'#7cffb2' },
        { code:'0x07', name:'SYNTH',    label:'Síntese',      icon:'✧', color:'#ffd700' },
        { code:'0x08', name:'RENDER',   label:'Renderização', icon:'◉', color:'#00b894' },
        { code:'0x09', name:'GUARD',    label:'Proteção',     icon:'♾', color:'#6c5ce7' },
        { code:'0x0A', name:'QA',       label:'Auditoria',    icon:'◈', color:'#67e6ff' },
        { code:'0x0B', name:'PULSE',    label:'Pulso',        icon:'⚡', color:'#ff52e5' },
        { code:'0x0C', name:'REVO',     label:'Evolução',     icon:'∞', color:'#f2c94c' }
      ];

      opcodes.forEach(op => {
        this.archetypes[op.code] = {
          ...op,
          activated: false,
          linkedKeys: [],
          content: null
        };
      });

      console.log('[KODUX] 13 arquétipos carregados · KODUX pronto');
      return true;
    },

    // Ativa um arquétipo e linka ao conteúdo do Baú
    activate(opcode) {
      const arch = this.archetypes[opcode];
      if (!arch) return null;

      arch.activated = true;
      arch.activatedAt = Date.now();

      // Busca chaves do Baú para esse opcode
      const baulite = HUB.modules.baulite;
      if (baulite && baulite.classify) {
        arch.linkedKeys = [];
        for (let i = 0; i < localStorage.length; i++) {
          const k = localStorage.key(i);
          if (baulite.classify(k) === opcode) {
            arch.linkedKeys.push({ key: k, preview: (localStorage.getItem(k)||'').substring(0,60) });
          }
        }
      }

      // Salva estado
      localStorage.setItem(`kodux:active_${opcode}`, JSON.stringify({
        activated: true,
        timestamp: Date.now(),
        keys: arch.linkedKeys.map(k => k.key)
      }));

      HUB.dispatch('kodux:activate', { opcode, archetype: arch });
      console.log(`[KODUX] Arquétipo ${opcode} · ${arch.name} ativado · ${arch.linkedKeys.length} chaves linkadas`);

      return arch;
    },

    // Carrega conteúdo do arquétipo na UI
    loadArchetype(data) {
      // Atualiza o painel KODUX se existir
      const panel = document.getElementById('kodux-panel') || document.getElementById('kodux-module');
      if (panel) {
        const content = panel.querySelector('.kodux-content') || panel.querySelector('[class*="content"]');
        if (content) {
          content.innerHTML = `
            <div style="color:${data.color};font-weight:700;font-size:14px;margin-bottom:8px;">
              ${data.icon} ${data.name} · ${data.label}
            </div>
            <div style="font-size:12px;opacity:0.8;margin-bottom:8px;">
              ${data.keys.length} chaves · ${(data.totalBytes/1024).toFixed(2)} KB
            </div>
            <div style="font-size:11px;opacity:0.6;">
              ${data.keys.map(k => `· ${k.key}`).join('<br>')}
            </div>
          `;
        }
      }
    },

    // Navega entre arquétipos (setas do KODUX)
    next() {
      const codes = Object.keys(this.archetypes);
      const idx = codes.indexOf(this.currentOpcode);
      const next = codes[(idx + 1) % codes.length];
      this.currentOpcode = next;
      return this.activate(next);
    },

    prev() {
      const codes = Object.keys(this.archetypes);
      const idx = codes.indexOf(this.currentOpcode);
      const prev = codes[(idx - 1 + codes.length) % codes.length];
      this.currentOpcode = prev;
      return this.activate(prev);
    },

    getState() { 
      return { 
        current: this.currentOpcode, 
        archetypes: this.archetypes,
        activated: Object.values(this.archetypes).filter(a => a.activated).length
      }; 
    },

    onHubEvent(event, data) {
      if (event === 'sync') {
        Object.keys(this.archetypes).forEach(op => {
          if (this.archetypes[op].activated) this.activate(op);
        });
      }
    }
  };

  // ════════════════════════════════════════════════════════════════════════════════
  // AUTO-REGISTRO DOS MÓDULOS EXISTENTES
  // ════════════════════════════════════════════════════════════════════════════════
  function autoRegister() {
    // KOBLLUX
    if (window.KOBLLUX) {
      // Adiciona onHubEvent ao KOBLLUX existente
      window.KOBLLUX.onHubEvent = function(event, data) {
        if (event === 'symbolbar:dragend' && data.side) {
          const layerMap = { esquerda: 'micro', centro: 'meso', direita: 'macro', topo: 'meso', base: 'macro' };
          const cfg = this.getConfig();
          if (cfg.layer !== layerMap[data.side]) {
            cfg.layer = layerMap[data.side];
            this.setConfig(cfg);
          }
        }
        if (event === 'kodux:activate') {
          // KOBLLUX reage à ativação de arquétipo
          console.log('[KOBLLUX] Arquétipo ativado via Hub:', data.opcode);
        }
      };
      HUB.register('kobllux', window.KOBLLUX);
    }

    // Baú Lite
    if (window.BauliteKobllux) {
      window.BauliteKobllux.onHubEvent = function(event, data) {
        if (event === 'symbolbar:dragend') {
          // Salva estado do symbol bar no baú
          localStorage.setItem('pulse:symbolbar_' + Date.now(), JSON.stringify(data));
          this.refresh();
        }
        if (event === 'kodux:activate') {
          this.refresh();
        }
      };
      HUB.register('baulite', window.BauliteKobllux);
    }

    // Symbol Bar
    if (SymbolBarAPI.init()) {
      HUB.register('symbolbar', SymbolBarAPI);
    }

    // KODUX
    if (KODUX.init()) {
      HUB.register('kodux', KODUX);
    }

    console.log('[HUB·∆³] Auto-registro completo · módulos:', Object.keys(HUB.modules).join(' | '));
  }

  // ════════════════════════════════════════════════════════════════════════════════
  // WIRE HEADER BUTTONS (com proteção contra duplicação)
  // ════════════════════════════════════════════════════════════════════════════════
  function wireHeader() {
    const btnLS = document.getElementById('btnLS');
    const btnKob = document.getElementById('btnKobllux');

    if (btnLS && !btnLS.dataset.hubWired) {
      btnLS.dataset.hubWired = '1';
      // Clona para limpar listeners antigos
      const newBtn = btnLS.cloneNode(true);
      btnLS.parentNode.replaceChild(newBtn, btnLS);
      newBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        HUB.route('baulite', 'open');
      });
    }

    if (btnKob && !btnKob.dataset.hubWired) {
      btnKob.dataset.hubWired = '1';
      const newBtn = btnKob.cloneNode(true);
      btnKob.parentNode.replaceChild(newBtn, btnKob);
      newBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        HUB.route('kobllux', 'open');
      });
    }

    // Badge de chaves
    function updateBadge() {
      const badge = document.querySelector('.ls-count') || document.querySelector('[data-badge="ls"]');
      const btn = document.getElementById('btnLS');
      const count = localStorage.length;
      if (badge) badge.textContent = count;
      else if (btn && btn.textContent.includes('LS')) btn.textContent = 'LS ' + count;
    }
    window.addEventListener('kobllux:save', updateBadge);
    window.addEventListener('storage', updateBadge);
    setInterval(updateBadge, 3000);
    updateBadge();
  }

  // ════════════════════════════════════════════════════════════════════════════════
  // KODUX UI WIRING (botões de navegação e ativação)
  // ════════════════════════════════════════════════════════════════════════════════
  function wireKODUX() {
    // Procura botões de navegação do KODUX
    const prevBtn = document.querySelector('.kodux-prev') || document.querySelector('[data-kodux="prev"]');
    const nextBtn = document.querySelector('.kodux-next') || document.querySelector('[data-kodux="next"]');
    const activateBtn = document.querySelector('.kodux-activate') || document.querySelector('[data-kodux="activate"]');

    if (prevBtn) prevBtn.addEventListener('click', () => KODUX.prev());
    if (nextBtn) nextBtn.addEventListener('click', () => KODUX.next());
    if (activateBtn) activateBtn.addEventListener('click', () => KODUX.activate(KODUX.currentOpcode));

    // Se não achou botões, cria listeners genéricos
    document.addEventListener('click', (e) => {
      if (e.target.matches('[data-kodux="prev"]')) KODUX.prev();
      if (e.target.matches('[data-kodux="next"]')) KODUX.next();
      if (e.target.matches('[data-kodux="activate"]')) KODUX.activate(KODUX.currentOpcode);
      if (e.target.matches('[data-kodux-opcode]')) {
        const op = e.target.getAttribute('data-kodux-opcode');
        KODUX.activate(op);
      }
    });
  }

  // ════════════════════════════════════════════════════════════════════════════════
  // INIT
  // ════════════════════════════════════════════════════════════════════════════════
  function init() {
    console.log('[HUB·∆³] Inicializando KOBLLUX HUB v1.0.0...');
    autoRegister();
    wireHeader();
    wireKODUX();

    // Sincronização inicial após 1s (garante que todos os scripts carregaram)
    setTimeout(() => {
      HUB.sync();
      console.log('[HUB·∆³] ∆³ UNIFICADO · Symbol·Header·KOBLLUX·Baú·KODUX · AMÉM');
    }, 1000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Expõe globalmente
  window.KOBLLUX_HUB = HUB;
  window.SymbolBarAPI = SymbolBarAPI;
  window.KODUX = KODUX;

})();
