/* ═══════════════════════════════════════════════════════════════════════════════
   KOBLLUX · SYMBOL BAR · HEADER · BAÚ LITE
   SINCRONIZAÇÃO UNIFICADA ∆³ v1.0.0

   Conecta:
   - Symbol Bar (drag/snap/posição) → localStorage → Baú Lite (opcode 0x0B PULSE)
   - Header (btnLS + btnKobllux) → Baú Lite + KOBLLUX
   - KOBLLUX (camada/polos/selos) → Symbol Bar (cor/posição)
   - Baú Lite (eventos) → Header (badge de chaves)

   Equação: Symbol(6D) × Header(3C) × KOBLLUX(9P) ÷ Baú(13O) = ∆³
   ═══════════════════════════════════════════════════════════════════════════════ */

(function() {
  'use strict';
  if (window.KOBLLUX_SYMBOL_SYNC) return;
  window.KOBLLUX_SYMBOL_SYNC = true;

  const SYNC_KEY = 'symbolbar:state';
  const HEADER_BADGE_ID = 'header-ls-badge';

  // ═══ 1. DETECTAR SYMBOL BAR ═══
  function getSymbolBar() {
    // Tenta múltiplos seletores comuns
    return document.getElementById('symbolbar') 
        || document.getElementById('kblx-symbolbar')
        || document.getElementById('snap-bar')
        || document.querySelector('.symbolbar')
        || document.querySelector('[class*="symbol"]')
        || document.querySelector('[id*="symbol"]');
  }

  // ═══ 2. SALVAR ESTADO DO SYMBOL BAR NO BAÚ ═══
  function saveSymbolState() {
    const bar = getSymbolBar();
    if (!bar) return;

    const rect = bar.getBoundingClientRect();
    const state = {
      visible: bar.style.display !== 'none',
      position: {
        left: rect.left,
        top: rect.top,
        right: rect.right,
        bottom: rect.bottom,
        snapped: bar.classList.contains('snap-side') || bar.classList.contains('snapped'),
        side: detectSide(rect)
      },
      classes: Array.from(bar.classList),
      timestamp: Date.now(),
      source: 'symbolbar'
    };

    localStorage.setItem(SYNC_KEY, JSON.stringify(state));

    // Dispara evento para o Baú Lite
    window.dispatchEvent(new CustomEvent('symbolbar:sync', { detail: state }));
    console.log('[∆³-SYNC] Symbol Bar salvo · lado:', state.position.side);
  }

  function detectSide(rect) {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    if (cx < w * 0.3) return 'esquerda';
    if (cx > w * 0.7) return 'direita';
    if (cy < h * 0.3) return 'topo';
    if (cy > h * 0.7) return 'base';
    return 'centro';
  }

  // ═══ 3. OBSERVAR MUDANÇAS NO SYMBOL BAR ═══
  function watchSymbolBar() {
    const bar = getSymbolBar();
    if (!bar) {
      console.warn('[∆³-SYNC] Symbol Bar não encontrado · tentando em 1s...');
      setTimeout(watchSymbolBar, 1000);
      return;
    }

    // Observa mudanças de classe (snap, drag, etc.)
    const observer = new MutationObserver((muts) => {
      muts.forEach(m => {
        if (m.type === 'attributes' && (m.attributeName === 'class' || m.attributeName === 'style')) {
          saveSymbolState();
        }
      });
    });
    observer.observe(bar, { attributes: true, attributeFilter: ['class', 'style'] });

    // Observa eventos de drag do symbolbar (se ele dispara eventos customizados)
    window.addEventListener('kblx:dragend', saveSymbolState);
    window.addEventListener('kblx:snap', saveSymbolState);

    // Salva estado inicial
    saveSymbolState();
    console.log('[∆³-SYNC] Symbol Bar observado');
  }

  // ═══ 4. HEADER: SINCRONIZAR BADGE LS COM BAÚ LITE ═══
  function updateHeaderBadge() {
    const badge = document.getElementById(HEADER_BADGE_ID) 
               || document.querySelector('.header-ls-count')
               || document.querySelector('[data-badge="ls"]');
    if (!badge) return;

    const count = localStorage.length;
    badge.textContent = count;
    badge.style.display = count > 0 ? 'inline-flex' : 'none';
  }

  // Escuta mudanças no localStorage (via Baú Lite ou KOBLLUX)
  window.addEventListener('kobllux:save', updateHeaderBadge);
  window.addEventListener('storage', updateHeaderBadge);

  // Atualiza a cada 3s como fallback
  setInterval(updateHeaderBadge, 3000);

  // ═══ 5. HEADER: GARANTIR BOTÕES CORRETOS ═══
  function setupHeaderButtons() {
    // btnLS → já tratado pelo baulite_1.js, mas garantimos fallback
    const btnLS = document.getElementById('btnLS');
    if (btnLS && !btnLS.dataset.delta3Wired) {
      btnLS.dataset.delta3Wired = '1';
      btnLS.addEventListener('click', (e) => {
        e.preventDefault();
        if (window.BauliteKobllux && window.BauliteKobllux.open) {
          window.BauliteKobllux.open();
        }
      });
    }

    // btnKobllux → abre KOBLLUX
    const btnKob = document.getElementById('btnKobllux') 
                || document.getElementById('btn-kobllux')
                || document.querySelector('[data-action="kobllux"]')
                || document.querySelector('[title*="KOBLLUX"]')
                || document.querySelector('[title*="Ativar"]');

    if (btnKob && !btnKob.dataset.delta3Wired) {
      btnKob.dataset.delta3Wired = '1';
      btnKob.addEventListener('click', (e) => {
        e.preventDefault();
        if (window.KOBLLUX && window.KOBLLUX.open) {
          window.KOBLLUX.open();
        } else {
          console.warn('[∆³-SYNC] KOBLLUX não carregado');
        }
      });
      console.log('[∆³-SYNC] btnKobllux vinculado');
    }

    // Se não existe btnKobllux, cria um dinamicamente no header
    if (!btnKob && btnLS) {
      const newBtn = document.createElement('button');
      newBtn.id = 'btnKobllux';
      newBtn.innerHTML = '◈';
      newBtn.title = 'KOBLLUX · Ativar ∆⁷';
      newBtn.style.cssText = 'width:40px;height:40px;border-radius:50%;border:1px solid rgba(255,255,255,0.1);background:rgba(103,230,255,0.1);color:#67e6ff;font-size:18px;cursor:pointer;display:flex;align-items:center;justify-content:center;margin:0 4px;';
      newBtn.addEventListener('click', (e) => {
        e.preventDefault();
        window.KOBLLUX && window.KOBLLUX.open();
      });
      btnLS.parentNode.insertBefore(newBtn, btnLS.nextSibling);
      console.log('[∆³-SYNC] btnKobllux criado dinamicamente');
    }
  }

  // ═══ 6. SINCRONIZAR KOBLLUX → SYMBOL BAR ═══
  // Quando KOBLLUX muda de camada, o Symbol Bar muda de cor/posição
  window.addEventListener('kobllux:activated', (e) => {
    const bar = getSymbolBar();
    if (!bar || !e.detail?.config) return;

    const cfg = e.detail.config;
    const layer = cfg.layer || 'meso';

    // Muda cor do symbol bar conforme camada
    const colors = { micro: '#b978ff', meso: '#67e6ff', macro: '#7cffb2' };
    bar.style.borderColor = colors[layer] || colors.meso;
    bar.style.boxShadow = `0 0 20px ${colors[layer]}40`;

    // Se há polos ativos, pulsa o symbol bar
    const activePoles = cfg.poles?.filter(p => p.active).length || 0;
    if (activePoles > 0) {
      bar.classList.add('pulse');
      setTimeout(() => bar.classList.remove('pulse'), 2000);
    }

    console.log('[∆³-SYNC] KOBLLUX ativado · camada:', layer, '· polos:', activePoles);
  });

  // ═══ 7. SINCRONIZAR SYMBOL BAR → KOBLLUX ═══
  // Quando symbol bar encaixa num lado, atualiza KOBLLUX (camada inferida)
  window.addEventListener('symbolbar:sync', (e) => {
    const side = e.detail?.position?.side;
    if (!side || !window.KOBLLUX) return;

    // Inferir camada do KOBLLUX baseado no lado do symbol bar
    const layerMap = { esquerda: 'micro', centro: 'meso', direita: 'macro', topo: 'meso', base: 'macro' };
    const inferredLayer = layerMap[side];

    if (inferredLayer && window.KOBLLUX.getConfig) {
      const cfg = window.KOBLLUX.getConfig();
      if (cfg.layer !== inferredLayer) {
        cfg.layer = inferredLayer;
        window.KOBLLUX.setConfig(cfg);
        console.log('[∆³-SYNC] Camada KOBLLUX ajustada para:', inferredLayer, '(via Symbol Bar)');
      }
    }
  });

  // ═══ 8. AUTO-INIT ═══
  function init() {
    console.log('[∆³-SYNC] Inicializando convergência Symbol·Header·KOBLLUX·Baú...');
    setupHeaderButtons();
    watchSymbolBar();
    updateHeaderBadge();

    // Salva estado inicial do header no baú
    const headerState = {
      btnLS: !!document.getElementById('btnLS'),
      btnKobllux: !!document.getElementById('btnKobllux'),
      symbolBar: !!getSymbolBar(),
      koblluxLoaded: !!window.KOBLLUX,
      bauliteLoaded: !!window.BauliteKobllux,
      timestamp: Date.now()
    };
    localStorage.setItem('pulse:header_delta3', JSON.stringify(headerState));

    console.log('[∆³-SYNC] ∆³ ativo · Symbol·Header·KOBLLUX·Baú unificados');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Re-tenta após 2s caso os scripts carreguem tarde
  setTimeout(init, 2000);

})();
