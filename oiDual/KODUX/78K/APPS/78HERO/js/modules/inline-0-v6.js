
    /* ========================================================================
       1. TEMA CLARO / ESCURO (KODUX + iOS)
       ======================================================================== */
    (function() {
      const root = document.documentElement;
      const toggle = document.getElementById('themeToggle');
      const stored = localStorage.getItem('hk-theme') || 'dark';
      root.dataset.theme = stored;
      toggle.textContent = stored === 'dark' ? '🌙' : '☀️';

      toggle.addEventListener('click', () => {
        const current = root.dataset.theme;
        const next = current === 'light' ? 'dark' : 'light';
        root.dataset.theme = next;
        localStorage.setItem('hk-theme', next);
        toggle.textContent = next === 'dark' ? '🌙' : '☀️';
      });
    })();

    /* ========================================================================
       2. GESTÃO DE ARQUÉTIPOS (HubUno Integration)
       ======================================================================== */
    const ARQUETIPOS = [
      "NOVA", "ATLAS", "VITALIS", "PULSE", "ARTEMIS", "SERENA",
      "KAOS", "GENUS", "LUMINE", "RHEA", "SOLUS", "AION",
      "KODUX", "BLLUE", "JESUS", "KOBLLUX", "INFODOSE", "HORUS"
    ];
    let currentArchIndex = 0;

    function initArchetypes() {
      const select = document.getElementById('archSelect');
      select.innerHTML = '';
      ARQUETIPOS.forEach((arch, idx) => {
        const opt = document.createElement('option');
        opt.value = idx;
        opt.innerText = arch;
        select.appendChild(opt);
      });
    }

    function selectArch(idx) {
      currentArchIndex = parseInt(idx);
      document.getElementById('archSelect').value = currentArchIndex;
      updateCyclePanel();
    }

    function cycleArch(dir) {
      currentArchIndex = (currentArchIndex + dir + ARQUETIPOS.length) % ARQUETIPOS.length;
      selectArch(currentArchIndex);
    }

    /* ========================================================================
       3. BANCO DE DADOS INDEXEDDB & BIBLIOTECA (Nebula Pro Integration)
       ======================================================================== */
    const DB_NAME = "NebulaStorageMerge";
    const STORE_NAME = "files";
    let db;
    let library = [];

    function initDB() {
      return new Promise((resolve) => {
        const req = indexedDB.open(DB_NAME, 1);
        req.onupgradeneeded = (e) => {
          db = e.target.result;
          if (!db.objectStoreNames.contains(STORE_NAME)) {
            db.createObjectStore(STORE_NAME, { keyPath: "id" });
          }
        };
        req.onsuccess = (e) => { db = e.target.result; resolve(); };
      });
    }

    async function loadFiles() {
      if (!db) return;
      const tx = db.transaction(STORE_NAME, "readonly");
      const store = tx.objectStore(STORE_NAME);
      const req = store.getAll();
      req.onsuccess = () => {
        library = req.result || [];
        if (library.length === 0) {
          library = [{
            id: 'doc-manifesto',
            name: 'Manifesto Infodose.txt',
            type: 'txt',
            content: 'Manifesto Infodose\n\n- Conectando Mentes.\n- Interface Unificada KODUX + HubUno + Nebula.'
          }];
        }
        renderFiles();
      };
    }

    async function saveFile(item) {
      const tx = db.transaction(STORE_NAME, "readwrite");
      tx.objectStore(STORE_NAME).put(item);
    }

    function renderFiles() {
      const container = document.getElementById('nebulaFileCarousel');
      if (!container) return;
      container.innerHTML = '';

      library.forEach(file => {
        const card = document.createElement('div');
        card.className = 'file-card';
        card.onclick = () => openFile(file);
        card.innerHTML = `
          <span class="type-tag">${file.type}</span>
          <div class="file-title">${file.name}</div>
          <div class="file-meta">Toque para abrir</div>
        `;
        container.appendChild(card);
      });
    }

    document.getElementById('fileInput').addEventListener('change', async (e) => {
      const files = Array.from(e.target.files);
      for (const f of files) {
        const text = await f.text();
        const ext = f.name.split('.').pop().toLowerCase();
        const item = {
          id: Date.now().toString() + Math.random(),
          name: f.name,
          type: ext,
          content: text
        };
        library.push(item);
        await saveFile(item);
      }
      renderFiles();
    });

    /* ========================================================================
       4. EXECUÇÃO DE APPS E LEITURA (Modal Integration)
       ======================================================================== */
    let currentActiveText = "";

    function launchApp(appId) {
      const modal = document.getElementById('app-modal');
      const body = document.getElementById('app-modal-body');
      const title = document.getElementById('app-modal-title');

      title.innerText = appId.toUpperCase();
      currentActiveText = `Aplicação ${appId} iniciada no sistema KODUX.`;

      body.innerHTML = `
        <div style="padding:30px; text-align:center;">
          <h2>${appId.toUpperCase()}</h2>
          <p style="margin-top:10px; color:#aaa;">Aplicação a ser executada em iframe ou ambiente nativo.</p>
        </div>`;
      modal.classList.add('active');
    }

    function openFile(file) {
      const modal = document.getElementById('app-modal');
      const body = document.getElementById('app-modal-body');
      const title = document.getElementById('app-modal-title');

      title.innerText = file.name;
      currentActiveText = file.content || "";

      if (file.type === 'html') {
        body.innerHTML = `<iframe class="app-modal-iframe" srcdoc="${escapeHTML(file.content)}"></iframe>`;
      } else {
        body.innerHTML = `<pre style="padding:20px; white-space:pre-wrap; font-family:monospace; font-size:12px; color:#22d3ee;">${escapeHTML(file.content)}</pre>`;
      }
      modal.classList.add('active');
    }

    function closeApp() {
      document.getElementById('app-modal').classList.remove('active');
      window.speechSynthesis.cancel();
    }

    function speakCurrentText() {
      if (!currentActiveText) return;
      const synth = window.speechSynthesis;
      if (synth.speaking) { synth.cancel(); return; }
      const utt = new SpeechSynthesisUtterance(currentActiveText.substring(0, 3000));
      utt.lang = 'pt-BR';
      synth.speak(utt);
    }

    function escapeHTML(str) {
      return (str || '').replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    }

    // Associar App Clicks
    document.querySelectorAll('[data-app]').forEach(item => {
      item.addEventListener('click', () => launchApp(item.getAttribute('data-app')));
    });

    /* ========================================================================
       5. NAVEGAÇÃO DE ABAS
       ======================================================================== */
    function switchTab(tabId, btn) {
      document.querySelectorAll('.tab-view').forEach(v => v.classList.remove('active'));
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));

      document.getElementById(`tab-${tabId}`).classList.add('active');
      btn.classList.add('active');
    }

    /* ========================================================================
       6. RELÓGIO E PAINEL DE CICLO
       ======================================================================== */
    function updateTime() {
      const now = new Date();
      document.getElementById('clock-digital').innerText = 
        `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

      const days = ['DOM.', 'SEG.', 'TER.', 'QUA.', 'QUI.', 'SEX.', 'SÁB.'];
      document.getElementById('cal-day-name').innerText = days[now.getDay()];
      document.getElementById('cal-day-num').innerText = now.getDate();

      const secDeg = (now.getSeconds() / 60) * 360;
      const minDeg = ((now.getMinutes() + now.getSeconds() / 60) / 60) * 360;
      const hourDeg = (((now.getHours() % 12) + now.getMinutes() / 60) / 12) * 360;

      document.getElementById('analog-second').style.transform = `rotate(${secDeg}deg)`;
      document.getElementById('analog-minute').style.transform = `rotate(${minDeg}deg)`;
      document.getElementById('analog-hour').style.transform = `rotate(${hourDeg}deg)`;
    }

    function updateCyclePanel() {
      const arq = ARQUETIPOS[currentArchIndex];
      document.getElementById('ciclo-arq').innerText = arq;
      document.getElementById('ciclo-peso').innerText = (0.1 + (currentArchIndex * 0.01)).toFixed(3);
      document.getElementById('ciclo-delta').innerText = (0.001 * (currentArchIndex + 1)).toFixed(4);
    }

    // Inicialização do Sistema
    window.onload = async () => {
      initArchetypes();
      await initDB();
      await loadFiles();
      setInterval(updateTime, 1000);
      updateTime();
      updateCyclePanel();
    };
  