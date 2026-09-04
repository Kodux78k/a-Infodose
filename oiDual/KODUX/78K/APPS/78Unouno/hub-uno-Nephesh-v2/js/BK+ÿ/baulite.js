(function() {
  'use strict';

  // ========== LOCALIZA O CONTAINER ==========
  const container = document.getElementById('baulite-container');
  if (!container) return;

  // === Verifica se já foi renderizado ===
  if (container.querySelector('.baulite-root')) {
    // Se já existir, apenas alterna a visibilidade
    const btnLS = document.getElementById('btnLS');
    if (btnLS) {
      btnLS.addEventListener('click', function(e) {
        e.preventDefault();
        const isVisible = container.style.display !== 'none';
        container.style.display = isVisible ? 'none' : 'block';
      });
    }
    return;
  }

  const LS_KEYS = {
    HTML: 'lastHTML',
    USER_SYMBOL: 'userSymbol',
    SKS: 'di_apiKey',
    SK_ACTIVE: 'openrouter_active'
  };

  const DISABLED_KEY = 'infodose:presets.disabled';

  const PRESETS = [
    { key: 'di_userName', label: 'Usuário' },
    { key: 'di_assistantName', label: 'Assistente' },
    { key: 'di_apiKey', label: 'Chave OpenRouter (legacy)' },
    { key: 'di_modelName', label: 'Modelo IA' },
    { key: 'uno:theme', label: 'Tema' },
    { key: 'uno:bg', label: 'Fundo Custom' },
    { key: 'infodose:cssCustom', label: 'CSS Custom' },
    { key: 'infodose:voices', label: 'Vozes Arquetípicas' }
  ];

  // ========== CSS EMBUTIDO (já incluso, mas garantimos) ==========
  const style = document.createElement('style');
  style.textContent = `
    .baulite-root * { box-sizing: border-box; margin: 0; padding: 0; }
    .baulite-root { font-family: 'Montserrat', system-ui, sans-serif; color: #c9d1d9; font-size: 13px; max-height: 100%; overflow-y: auto; padding: 4px 0; }
    .baulite-root .app { display: flex; flex-direction: column; gap: 12px; }
    .baulite-root .card { background: rgba(0,0,0,0.25); backdrop-filter: blur(8px); border-radius: 12px; padding: 10px 12px; border: 1px solid rgba(255,255,255,0.08); }
    .baulite-root .small { font-size: .75rem; color: #8b949e; margin-top: 4px; }
    .baulite-root .hdr { display: flex; gap: 8px; align-items: center; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 8px; margin-bottom: 8px; flex-wrap: wrap; }
    .baulite-root .ttl { font-weight: 900; letter-spacing: .06em; font-size: 1rem; color: #00ffff; }
    .baulite-root .actions { display: flex; gap: 6px; flex-wrap: wrap; }
    .baulite-root .meta { color: #8b949e; font-size: 11px; margin: 4px 0 8px; }
    .baulite-root .list { display: grid; gap: 8px; }
    .baulite-root .item { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; padding: 8px; display: grid; gap: 6px; }
    .baulite-root .item .head { display: flex; align-items: flex-start; justify-content: space-between; gap: 6px; flex-wrap: wrap; }
    .baulite-root .key { font-weight: 700; max-width: 60%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 0.85rem; }
    .baulite-root .type { font-size: 10px; color: #8b949e; }
    .baulite-root .val { font: 11px/1.4 ui-monospace, monospace; background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.06); border-radius: 8px; padding: 6px; max-height: 90px; overflow: auto; word-break: break-word; white-space: pre-wrap; }
    .baulite-root .switch { inline-size: 36px; block-size: 22px; border-radius: 999px; border: 1px solid rgba(255,255,255,0.15); background: rgba(255,255,255,0.1); position: relative; cursor: pointer; flex: 0 0 auto; }
    .baulite-root .switch::after { content: ""; position: absolute; inset: 3px auto 3px 3px; width: 16px; border-radius: 999px; background: #fff; transition: all .18s; }
    .baulite-root .switch.on { background: rgba(25,226,123,0.25); }
    .baulite-root .switch.on::after { left: 17px; }
    .baulite-root details.presets { border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; padding: 6px; background: rgba(255,255,255,0.02); margin-bottom: 8px; }
    .baulite-root .presets-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 8px; margin-top: 6px; }
    .baulite-root .preset { border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; background: rgba(255,255,255,0.03); padding: 8px; display: grid; gap: 4px; }
    .baulite-root .img-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(100px, 1fr)); gap: 8px; }
    .baulite-root .img-card { border: 1px solid rgba(255,255,255,0.08); background: rgba(255,255,255,0.02); border-radius: 8px; padding: 6px; }
    .baulite-root .img-card img { width: 100%; height: auto; display: block; border-radius: 6px; }
    .baulite-root button { background: rgba(255,255,255,0.06); border: none; color: #c9d1d9; padding: 5px 10px; border-radius: 8px; font-size: .8rem; cursor: pointer; transition: .15s; display: inline-flex; gap: 4px; align-items: center; }
    .baulite-root button:hover { background: rgba(255,255,255,0.12); }
    .baulite-root .btn-ghost { background: transparent; border: 1px dashed rgba(255,255,255,0.15); }
    .baulite-root input, .baulite-root select { width: 100%; margin: 4px 0; padding: 6px 8px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.1); background: rgba(0,0,0,0.3); color: #c9d1d9; font-family: inherit; outline: none; font-size: .8rem; }
    .baulite-root i { font-style: normal; display: inline-block; width: 1.2em; text-align: center; }
    #baulite-container .baulite-root .panel { max-height: 90vh; overflow-y: auto; }
  `;
  container.appendChild(style);

  // ========== ESTRUTURA HTML ==========
  const root = document.createElement('div');
  root.className = 'baulite-root';
  container.appendChild(root);

  const dlLink = document.createElement('a');
  dlLink.id = 'baulite-dl';
  dlLink.style.display = 'none';
  root.appendChild(dlLink);

  const appDiv = document.createElement('div');
  appDiv.className = 'app';
  appDiv.id = 'baulite-app';
  root.appendChild(appDiv);

  const panelDiv = document.createElement('div');
  panelDiv.className = 'panel';
  panelDiv.innerHTML = `
    <div class="hdr">
      <div class="ttl">LocalStorage • Baú Lite</div>
      <div class="actions">
        <button id="baulite-lsRescan"><i>⟲</i> Re-scan</button>
        <button id="baulite-lsExport"><i>⇑</i> Exportar</button>
        <label for="baulite-lsImportFile" style="display:inline-block">
          <button type="button"><i>⇓</i> Importar</button>
        </label>
        <input id="baulite-lsImportFile" type="file" accept="application/json" hidden>
        <button id="baulite-lsClearDisabled" class="btn-ghost"><i>⌫</i> Limpar desativados</button>
        <button id="baulite-close-modal" style="background:rgba(255,0,0,0.2);border:1px solid rgba(255,0,0,0.3);">✕ Fechar</button>
      </div>
    </div>
    <details class="presets" open>
      <summary><strong>Presets (ON/OFF global)</strong></summary>
      <div class="presets-grid" id="baulite-presetsGrid"></div>
    </details>
    <div class="meta"><span id="baulite-lsCount">—</span> • <span id="baulite-lsSize">—</span></div>
    <div class="list" id="baulite-lsList"></div>
    <details class="presets" style="margin-top:8px" open>
      <summary><strong>Pré-visualização de Imagens</strong></summary>
      <div class="img-grid" id="baulite-imgGrid"></div>
    </details>
  `;
  root.appendChild(panelDiv);

  // ========== HELPERS ==========
  const $ = (sel, ctx = root) => ctx.querySelector(sel);

  function saveFile(name, str) {
    const blob = new Blob([str], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = $('#baulite-dl');
    a.href = url;
    a.download = name;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 800);
  }

  function prettyBytes(n) {
    if (!Number.isFinite(n) || n <= 0) return '0 B';
    const u = ['B', 'KB', 'MB', 'GB'];
    let i = 0;
    while (n >= 1024 && i < u.length - 1) { n /= 1024; i++; }
    return n.toFixed(2) + ' ' + u[i];
  }

  function isJson(v) {
    try { JSON.parse(v); return true; }
    catch { return false; }
  }

  function inferType(v) {
    if (v == null || v === '') return 'empty';
    if (isJson(v)) {
      const p = JSON.parse(v);
      if (Array.isArray(p)) return 'json[array]';
      if (p && typeof p === 'object') return 'json[object]';
      return 'json[' + (typeof p) + ']';
    }
    if (/^data:image\//i.test(v) || /\.(png|jpe?g|gif|webp|svg)(\?|$)/i.test(v)) return 'image';
    if (/^(true|false|1|0)$/i.test(v)) return 'boolean-like';
    if (/^https?:\/\//i.test(v)) return 'url';
    if (/^data:/i.test(v)) return 'data-url';
    return 'string';
  }

  function disabledSet() {
    try { return new Set(JSON.parse(localStorage.getItem(DISABLED_KEY) || '[]')); }
    catch { return new Set(); }
  }

  function saveDisabled(set) {
    localStorage.setItem(DISABLED_KEY, JSON.stringify(Array.from(set)));
  }

  function toggleDisabled(k) {
    const s = disabledSet();
    s.has(k) ? s.delete(k) : s.add(k);
    saveDisabled(s);
    renderPresets();
    renderLS();
  }

  function lsEntries() {
    const out = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      const v = localStorage.getItem(k) || '';
      out.push({ key: k, val: v });
    }
    return out.sort((a, b) => a.key.localeCompare(b.key));
  }

  function lsSizeBytes() {
    let sum = 0;
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      const v = localStorage.getItem(k) || '';
      sum += k.length + v.length;
    }
    return sum;
  }

  // ========== RENDER ==========
  function renderPresets() {
    const grid = $('#baulite-presetsGrid');
    if (!grid) return;
    grid.innerHTML = '';
    const dis = disabledSet();

    PRESETS.forEach(p => {
      const val = localStorage.getItem(p.key);
      const on = !dis.has(p.key);

      const wrap = document.createElement('div');
      wrap.className = 'preset';

      const head = document.createElement('div');
      head.style.cssText = 'display:flex;justify-content:space-between;align-items:center;padding:0;border:0';

      const nameDiv = document.createElement('div');
      nameDiv.innerHTML = `<strong>${p.label}</strong><div class="type">${p.key}</div>`;

      const sw = document.createElement('div');
      sw.className = 'switch' + (on ? ' on' : '');
      sw.title = on ? 'Desativar (não apaga)' : 'Ativar';
      sw.addEventListener('click', () => toggleDisabled(p.key));

      head.append(nameDiv, sw);

      const meta = document.createElement('div');
      meta.className = 'val';
      meta.textContent = val ? (inferType(val).startsWith('json') ? JSON.stringify(JSON.parse(val), null, 2) : val) : '—';

      wrap.append(head, meta);
      grid.append(wrap);
    });
  }

  function addImagePreview(key, src) {
    const g = $('#baulite-imgGrid');
    const card = document.createElement('div');
    card.className = 'img-card';
    const cap = document.createElement('div');
    cap.className = 'small';
    cap.textContent = key;
    const im = new Image();
    im.src = src;
    im.loading = 'lazy';
    im.style.maxWidth = '100%';
    card.append(cap, im);
    g.append(card);
  }

  function renderLS() {
    const list = $('#baulite-lsList');
    const imgGrid = $('#baulite-imgGrid');
    if (!list) return;
    list.innerHTML = '';
    imgGrid.innerHTML = '';

    const entries = lsEntries();
    $('#baulite-lsCount').textContent = entries.length + ' chave(s)';
    $('#baulite-lsSize').textContent = prettyBytes(lsSizeBytes());

    const dis = disabledSet();

    entries.forEach(({ key, val }) => {
      if (key === DISABLED_KEY) return;

      const it = document.createElement('div');
      it.className = 'item';

      const head = document.createElement('div');
      head.className = 'head';

      const left = document.createElement('div');
      left.innerHTML = `
        <div class="key">${key}${dis.has(key) ? ' <span class="type">(desativado)</span>' : ''}</div>
        <div class="type">${inferType(val)} • ${prettyBytes((val || '').length)}</div>
      `;

      const ctr = document.createElement('div');
      ctr.style.cssText = 'display:flex;gap:6px;flex-wrap:wrap;align-items:center';

      const sw = document.createElement('div');
      sw.className = 'switch' + (!dis.has(key) ? ' on' : '');
      sw.title = !dis.has(key) ? 'Desativar' : 'Ativar';
      sw.addEventListener('click', () => toggleDisabled(key));

      const bEdit = document.createElement('button');
      bEdit.innerHTML = '<i>◈</i> Editar';
      bEdit.addEventListener('click', () => {
        const next = prompt(`Editar valor de\n${key}`, val ?? '');
        if (next == null) return;
        localStorage.setItem(key, String(next));
        renderAll();
      });

      const bDel = document.createElement('button');
      bDel.innerHTML = '<i>⊘</i> Apagar';
      bDel.addEventListener('click', () => {
        if (confirm('Apagar ' + key + '?')) {
          localStorage.removeItem(key);
          renderAll();
        }
      });

      ctr.append(sw, bEdit, bDel);

      if (inferType(val) === 'image') {
        const bImg = document.createElement('button');
        bImg.innerHTML = '<i>⊞</i> Ver imagem';
        bImg.addEventListener('click', () => addImagePreview(key, val));
        ctr.append(bImg);
      }

      head.append(left, ctr);

      const v = document.createElement('div');
      v.className = 'val';
      v.textContent = inferType(val).startsWith('json')
        ? JSON.stringify(JSON.parse(val), null, 2)
        : (val ?? '—');

      it.append(head, v);
      list.append(it);
    });
  }

  function renderAll() {
    renderPresets();
    renderLS();
  }

  // ========== EXPORT / IMPORT ==========
  function exportLS() {
    const dump = {};
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k === DISABLED_KEY) continue;
      dump[k] = localStorage.getItem(k);
    }
    saveFile('localstorage_export.json', JSON.stringify(dump, null, 2));
  }

  function importLS(file) {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result || '{}');
        Object.entries(data).forEach(([k, v]) => localStorage.setItem(k, String(v)));
        alert('Importado com sucesso.');
        renderAll();
      } catch (e) {
        alert('JSON inválido.');
      }
    };
    reader.readAsText(file);
  }

  function clearDisabled() {
    localStorage.setItem(DISABLED_KEY, '[]');
    renderAll();
  }

  // ========== SEED DATA ==========
  function seedData() {
    if (localStorage.getItem('__baulite_seeded__')) return;
    localStorage.setItem('infodose:userName', 'KODUX');
    localStorage.setItem('infodose:assistantName', 'Dual Infodose');
    localStorage.setItem('uno:theme', 'nebula');
    localStorage.setItem('gallery:img1', 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=640');
    localStorage.setItem('feature:ritual:enabled', 'true');
    localStorage.setItem(LS_KEYS.HTML, '<div class="demo"><h1>Hello Nebula</h1><p>Baú Lite</p></div>');
    const demoSKs = ['sk-demo-AAA111', 'sk-demo-BBB222', 'sk-demo-CCC333'];
    localStorage.setItem(LS_KEYS.SKS, JSON.stringify(demoSKs));
    localStorage.setItem(LS_KEYS.SK_ACTIVE, demoSKs[0]);
    const demoSig = `<svg xmlns='http://www.w3.org/2000/svg' width='26' height='26' viewBox='0 0 26 26'><circle cx='13' cy='13' r='12' fill='none' stroke='#ff52e5' stroke-width='2'/><path d='M4 16 L13 4 L22 16 L13 22 Z' fill='none' stroke='#00c5e5' stroke-width='2'/></svg>`;
    localStorage.setItem(LS_KEYS.USER_SYMBOL, demoSig);
    localStorage.setItem('__baulite_seeded__', '1');
  }

  // ========== EVENT BINDING ==========
  function bindEvents() {
    $('#baulite-lsRescan').addEventListener('click', renderAll);
    $('#baulite-lsExport').addEventListener('click', exportLS);
    $('#baulite-lsImportFile').addEventListener('change', (e) => {
      const f = e.target.files?.[0];
      if (f) importLS(f);
      e.target.value = '';
    });
    $('#baulite-lsClearDisabled').addEventListener('click', clearDisabled);
    window.addEventListener('storage', renderAll);

    // Fechar modal
    const closeBtn = document.getElementById('baulite-close-modal');
    if (closeBtn) {
      closeBtn.addEventListener('click', function() {
        container.style.display = 'none';
      });
    }

    // Fechar ao clicar fora do painel (no fundo escuro)
    container.addEventListener('click', function(e) {
      if (e.target === container) {
        container.style.display = 'none';
      }
    });
  }

  // ========== FRACTAL KBLX (3×6×9×7=1134) ==========
  const KBLX_FRACTAL = {
    formula: "3 × 6 × 9 × 7",
    resultado: 1134,
    rd: 9,
    camadas: ["UNO", "DUO", "TRINITY", "EXPANSAO"],
    arquetipos: ["MOISES", "JOSUE", "JESUS", "EXPANSAO"],
    selos: {
      UNO: "0xSEM_SELO_C1134_V7",
      DUO: "0xSEM_SELO_C2268_V7",
      TRINITY: "0xSEM_SELO_C3402_V7",
      EXPANSAO: "0xSEM_SELO_C4536_V7",
      GERAL: "0xSEM_SELO_C11340_V9"
    }
  };

  function rd(n) {
    let s = Math.abs(n).toString();
    while (s.length > 1) s = s.split('').reduce((a, b) => a + parseInt(b, 10), 0).toString();
    return parseInt(s, 10);
  }

  function gerarHashSeed(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash).toString(16).padStart(16, '0');
  }

  function gerarCombosKBLX() {
    return [
      {
        camada: "UNO",
        protocolo: "kblx.A() + kblx.D() + kblx.I()",
        funcoes: ["Atribuir", "Dobrar", "Iterar"],
        valor: 1134,
        rd: rd(1134),
        selo: KBLX_FRACTAL.selos.UNO
      },
      {
        camada: "DUO",
        protocolo: "kblx.P() + kblx.T() + kblx.H()",
        funcoes: ["Pulsar", "Tracar", "Harmonizar"],
        valor: 2268,
        rd: rd(2268),
        selo: KBLX_FRACTAL.selos.DUO
      },
      {
        camada: "TRINITY",
        protocolo: "kblx.V() + kblx.O() + kblx.Q()",
        funcoes: ["Vibrar", "Orquestrar", "Qualificar"],
        valor: 3402,
        rd: rd(3402),
        selo: KBLX_FRACTAL.selos.TRINITY
      },
      {
        camada: "EXPANSAO",
        protocolo: "kblx.EXP() = kblx.ADI() × kblx.MUL() × kblx.RD9()",
        funcoes: ["Expandir", "Multiplicar", "Selar"],
        valor: 4536,
        rd: rd(4536),
        selo: KBLX_FRACTAL.selos.EXPANSAO
      }
    ];
  }

  function gerarRootsKBLX() {
    const now = new Date();
    const timestamp = now.toISOString().replace(/[-:T.Z]/g, '').slice(0, 14);
    const hashHex = gerarHashSeed("3x6x9x7=1134");
    return {
      "kblx:root:uno": `UNO_MOISES_${timestamp}`,
      "kblx:root:duo": `DUO_JOSUE_${timestamp}`,
      "kblx:root:trinity": `TRINITY_JESUS_${timestamp}`,
      "kblx:root:expansao": `EXPANSAO_FRACTAL_${timestamp}`,
      "kblx:root:geral": `KBLX_11340_V9_${timestamp}`,
      "kblx:hash:seed": hashHex,
      "kblx:rd:invariante": "9",
      "kblx:arvore:profundidade": "21",
      "kblx:ciclos:total": "22",
      "kblx:nos:manifestos": "36"
    };
  }

  function gerarDatasKBLX() {
    const hoje = new Date();
    const dia = hoje.getDate();
    const mes = hoje.getMonth() + 1;
    const ano = hoje.getFullYear();
    const diaKblx = dia * 1134;
    const dd = String(dia).padStart(2, '0');
    const mm = String(mes).padStart(2, '0');
    const yyyymmdd = `${ano}${mm}${dd}`;
    return {
      data_kblx: `${dd}/${mm}/${ano} · DIA_KBLX=${diaKblx} · RD=${rd(diaKblx)}`,
      timestamp_fractal: `${yyyymmdd}1134`,
      ciclo_atual: `CICLO_${(dia % 22) + 1}_DE_22`,
      camada_ativa: KBLX_FRACTAL.camadas[mes % 4],
      arquetipo_ativo: KBLX_FRACTAL.arquetipos[mes % 4],
      proximo_selo: `0xSEM_SELO_C${1134 * ((mes % 4) + 1)}_V7`
    };
  }

  function organizarBauKBLX() {
    const combos = gerarCombosKBLX();
    const roots = gerarRootsKBLX();
    const datas = gerarDatasKBLX();
    return {
      metadata: {
        versao: "KBLX_V3_DELTA3",
        fractal: KBLX_FRACTAL.formula,
        resultado: KBLX_FRACTAL.resultado,
        rd_invariante: KBLX_FRACTAL.rd,
        data_geracao: datas.data_kblx,
        timestamp: datas.timestamp_fractal
      },
      roots,
      combos,
      datas,
      selos: KBLX_FRACTAL.selos,
      arvore_delta: {
        ciclos_totais: 22,
        profundidade_maxima: 21,
        nos_manifestos: 36,
        selos_totais: 28,
        carimbos: 5,
        regra_estricta: "1 → 2 → 3 → +0 → ∞"
      },
      prova_matematica: {
        UNO: `1134 · RD=${rd(1134)} [OK]`,
        DUO: `2268 · RD=${rd(2268)} [OK]`,
        TRINITY: `3402 · RD=${rd(3402)} [OK]`,
        EXPANSAO: `4536 · RD=${rd(4536)} [OK]`,
        TOTAL: `11340 · RD=${rd(11340)} [OK]`
      },
      invocacao: "Em nome do PAI (UNO), do FILHO (TRINITY) e do ESPÍRITO SANTO (DUO). Amém."
    };
  }

  function executarOrganizadorBau() {
    const bau = organizarBauKBLX();
    localStorage.setItem('kblx:bau:organizado', JSON.stringify(bau, null, 2));
  }

  // ========== INICIALIZAÇÃO ==========
  seedData();
  renderAll();
  bindEvents();
  executarOrganizadorBau();

  // ========== VINCULAR BOTÃO LS PARA ABRIR O MODAL ==========
  const btnLS = document.getElementById('btnLS');
  if (btnLS) {
    btnLS.addEventListener('click', function(e) {
      e.preventDefault();
      container.style.display = 'block';
    });
  }

  console.log('✅ Baú LS ativado — LocalStorage · Presets · Fractal KBLX (modal)');

})();