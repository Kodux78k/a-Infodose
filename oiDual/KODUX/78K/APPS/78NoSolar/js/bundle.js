/* ===== splash-handler.js ===== */
/* SPLASH HANDLER */
window.addEventListener('load', function() {
  var splash = document.getElementById('splash-nosolar');
  if (!splash) return;
  setTimeout(function() {
    splash.classList.add('hide');
    setTimeout(function() {
      splash.style.display = 'none';
    }, 900);
  }, 900);
});

/* LOADER >600ms */
let nvLoaderTimer = null;
function nvStartLoading() {
  const el = document.getElementById('nv-loader');
  if (!el) return;
  if (nvLoaderTimer) clearTimeout(nvLoaderTimer);
  nvLoaderTimer = setTimeout(function() {
    el.classList.add('visible');
  }, 600);
}
function nvStopLoading() {
  const el = document.getElementById('nv-loader');
  if (!el) return;
  if (nvLoaderTimer) {
    clearTimeout(nvLoaderTimer);
    nvLoaderTimer = null;
  }
  el.classList.remove('visible');
}

/* SANFONA DE CARDS */
function toggleCard(headerEl) {
  var card = headerEl.closest('.card');
  var body = card.querySelector('.card-body');
  var toggleIcon = card.querySelector('.card-toggle');

  var isOpen = card.classList.contains('open');
  if (isOpen) {
    card.classList.remove('open');
    body.style.maxHeight = '0px';
    toggleIcon.textContent = '⌄';
  } else {
    card.classList.add('open');
    body.style.maxHeight = body.scrollHeight + 'px';
    toggleIcon.textContent = '⌃';
  }
}

/* Ajusta maxHeight ao redimensionar */
window.addEventListener('resize', function() {
  document.querySelectorAll('.card.open .card-body').forEach(function(body) {
    body.style.maxHeight = body.scrollHeight + 'px';
  });
});

/* CICLO SOLAR */
function setMode(mode) {
  document.body.classList.remove('mode-day', 'mode-sunset', 'mode-night');
  var indicator = document.getElementById('modeIndicator');

  if (mode === 'day') {
    document.body.classList.add('mode-day');
    indicator.textContent = 'MODO ATUAL: DIA · CAPTAÇÃO & CARREGAMENTO';
  } else if (mode === 'sunset') {
    document.body.classList.add('mode-sunset');
    indicator.textContent = 'MODO ATUAL: PÔR DO SOL · TRANSIÇÃO ENERGIA → DADOS';
  } else if (mode === 'night') {
    document.body.classList.add('mode-night');
    indicator.textContent =
      'MODO ATUAL: NOITE · LUA MENOR · REDE DE DADOS ILUMINADA PELA ENERGIA DO DIA';
  }
}

/* Helper para label do modo atual */
function nvGetSolarModeLabel() {
  if (document.body.classList.contains('mode-night')) return 'NOITE · REDE DE DADOS';
  if (document.body.classList.contains('mode-sunset')) return 'PÔR DO SOL · TRANSIÇÃO';
  return 'DIA · CAPTAÇÃO & CARGA';
}

/* Tema automático baseado no horário do usuário */
function nvAutoTheme() {
  const h = new Date().getHours();
  if (h >= 19 || h < 6) {
    setMode('night');
    nvToast('Modo solar ajustado automaticamente para NOITE.');
  } else if (h >= 16) {
    setMode('sunset');
    nvToast('Modo solar ajustado automaticamente para PÔR DO SOL.');
  } else {
    setMode('day');
    nvToast('Modo solar ajustado automaticamente para DIA.');
  }
}
window.addEventListener('load', nvAutoTheme);

/* GEO + ONDAS SONORAS (Web Audio / binaural) */
let geoLat = null;
let geoLng = null;
let audioCtx = null;
let osc1 = null;
let osc2 = null;
let ondasAtivas = false;
let arpOsc = null;

/* TOAST */
function nvToast(msg) {
  const t = document.getElementById('nv-toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2400);
}

function pedirLocalizacao(ev) {
  ev.stopPropagation();
  nvStartLoading();
  const indicator = document.getElementById('geoIndicator');
  const galaxy = document.getElementById('galaxy-field');
  const galaxyInfo = document.getElementById('galaxy-info');

  if (!navigator.geolocation) {
    indicator.textContent = 'LOCALIZAÇÃO: navegador não suporta.';
    nvStopLoading();
    nvToast('Navegador não suporta geolocalização.');
    return;
  }

  indicator.textContent = 'LOCALIZAÇÃO: pedindo permissão...';

  navigator.geolocation.getCurrentPosition(pos => {
    geoLat = pos.coords.latitude;
    geoLng = pos.coords.longitude;

    indicator.textContent =
      'LOCALIZAÇÃO: ' +
      geoLat.toFixed(4) + ' · ' +
      geoLng.toFixed(4) +
      ' — estado galáctico detectado';

    // 🌟 ATIVA animação galáctica
    if (galaxy) {
      galaxy.innerHTML = '';
      for (let i = 0; i < 80; i++) {
        const s = document.createElement('div');
        s.className = 'star';
        s.style.left = Math.random()*100 + '%';
        s.style.top = (100 + Math.random()*50) + '%';
        s.style.animationDelay = (Math.random()*-12) + 's';
        galaxy.appendChild(s);
      }
      galaxy.style.opacity = 1;
    }

    // 🌞 PERÍODO DO ANO / ESTAÇÃO SIMBÓLICA
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now - start;
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);
    const m = now.getMonth(); // 0-11

    let estacao = 'transição';
    // Hemisfério Sul simbólico
    if (m === 11 || m <= 1) estacao = 'VERÃO simbólico';
    else if (m >= 2 && m <= 4) estacao = 'OUTONO simbólico';
    else if (m >= 5 && m <= 7) estacao = 'INVERNO simbólico';
    else estacao = 'PRIMAVERA simbólica';

    if (galaxyInfo) {
      galaxyInfo.textContent =
        'Dia ' + dayOfYear + ' do ano · ' +
        estacao + ' · Lat ' + geoLat.toFixed(2) +
        ' · Lng ' + geoLng.toFixed(2);
      galaxyInfo.classList.add('show');
    }

    nvStopLoading();
    nvToast('Posição solar detectada com sucesso.');

  }, err => {
    indicator.textContent = 'LOCALIZAÇÃO: negada.';
    nvStopLoading();
    nvToast('Permissão de localização negada.');
  }, {
    enableHighAccuracy: false,
    timeout: 8000,
    maximumAge: 60000
  });
}

/* Garante que o AudioContext esteja “resumed” (iOS / mobile) */
function nvEnsureAudioCtx() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    return audioCtx.resume();
  }
  return Promise.resolve();
}

/* Binaural detectado – com loader e fix */
async function toggleOndas(ev) {
  ev.stopPropagation();
  nvStartLoading();
  var indicator = document.getElementById('geoIndicator');

  try {
    await nvEnsureAudioCtx();

    if (!ondasAtivas) {
      // base binaural simbólica
      let baseLat = geoLat != null ? Math.abs(geoLat) : 23.5;
      let baseLng = geoLng != null ? Math.abs(geoLng) : 47.5;

      // frequência base em torno de 200Hz e diferença ~ 8–12Hz
      let base = 190 + (baseLat % 20);
      let diff = 8 + (baseLng % 4);

      let freq1 = base - diff / 2;
      let freq2 = base + diff / 2;

      osc1 = audioCtx.createOscillator();
      osc2 = audioCtx.createOscillator();

      osc1.type = 'sine';
      osc2.type = 'sine';

      osc1.frequency.value = freq1;
      osc2.frequency.value = freq2;

      const gain = audioCtx.createGain();
      gain.gain.value = 0.07; // volume baixo

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(audioCtx.destination);

      osc1.start();
      osc2.start();

      ondasAtivas = true;
      indicator.textContent +=
        ' · ONDAS ATIVAS (binaural simbólico ' +
        freq1.toFixed(1) + 'Hz / ' + freq2.toFixed(1) + 'Hz).';
      nvToast('Binaural solar ativado.');
    } else {
      if (osc1) osc1.stop();
      if (osc2) osc2.stop();
      osc1 = null;
      osc2 = null;
      ondasAtivas = false;

      indicator.textContent = indicator.textContent.replace(/ · ONDAS ATIVAS.*$/, '');
      nvToast('Binaural solar pausado.');
    }
  } catch (e) {
    indicator.textContent =
      'LOCALIZAÇÃO / ÁUDIO: não foi possível iniciar o som (permissão / política do navegador).';
    nvToast('Não foi possível tocar o áudio neste navegador.');
  } finally {
    nvStopLoading();
  }
}

/* Arpejo harmônico ligado à latitude */
function tocarArpejo(ev) {
  ev.stopPropagation();
  nvEnsureAudioCtx().then(() => {
    if (arpOsc) {
      try { arpOsc.stop(); } catch(e) {}
      arpOsc = null;
      nvToast('Arpejo harmônico desligado.');
      return;
    }

    arpOsc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    gain.gain.value = 0.14;

    // escala harmônica baseada na latitude
    const scale = [1, 1.2, 1.25, 1.33, 1.5, 1.6, 2];
    let base = 200 + ((geoLat ?? 23.4) % 40);

    let i = 0;
    const intervalId = setInterval(() => {
      if (!arpOsc) {
        clearInterval(intervalId);
        return;
      }
      arpOsc.frequency.value = base * scale[i % scale.length];
      i++;
    }, 480);

    arpOsc.type = "sine";
    arpOsc.connect(gain);
    gain.connect(audioCtx.destination);
    arpOsc.start();

    nvToast('Arpejo harmônico solar ativado.');
  });
}

/* DICAS META-HUMANO-MÁQUINA */
function gerarDicas(ev) {
  ev.stopPropagation();
  nvStartLoading();
  var tipsIndicator = document.getElementById('tipsIndicator');
  var container = document.getElementById('tipsContainer');

  const agora = new Date();
  const hora = agora.getHours();

  let periodo;
  if (hora < 12) periodo = 'manhã';
  else if (hora < 18) periodo = 'tarde';
  else periodo = 'noite';

  tipsIndicator.textContent =
    'DICAS: Ciclo gerado para o período atual (' + periodo.toUpperCase() + ').';

  const latInfo = geoLat != null ? geoLat.toFixed(2) : 'lat não definida';
  const lngInfo = geoLng != null ? geoLng.toFixed(2) : 'lng não definida';

  const dicas = [
    {
      titulo: 'Manhã — Corpo & Painel',
      texto:
        'Alongar ombros e coluna por 3 minutos olhando para a luz natural. ' +
        'Checar mentalmente: “meu corpo está recebendo luz como o telhado recebe o sol?”. ' +
        'Se possível, abrir uma janela e imaginar os painéis carregando junto com você.',
    },
    {
      titulo: 'Tarde — Foco & Processamento',
      texto:
        'Escolher uma tarefa importante e executá-la em bloco de 25 minutos. ' +
        'Pensar nos micro data centers locais: processar o que é essencial agora, ' +
        'deixar o resto para outro ciclo. Menos abas abertas, mais qualidade de energia mental.',
    },
    {
      titulo: 'Noite — Descarregar & Armazenar',
      texto:
        'Reduzir luz forte 1h antes de dormir. Registrar em 3 linhas o que você “carregou” hoje: ' +
        'aprendizados, decisões, sensações. Assim como a bateria do sistema solar, ' +
        'você armazena o essencial para o dia seguinte sem sobrecarregar o corpo.',
    }
  ];

  container.innerHTML = '';

  dicas.forEach(function(d) {
    const div = document.createElement('div');
    div.className = 'tip-block';
    div.innerHTML =
      '<strong>' + d.titulo + '</strong>' +
      '<span>' + d.texto + '</span>';
    container.appendChild(div);
  });

  const extra = document.createElement('p');
  extra.style.marginTop = '8px';
  extra.style.fontSize = '0.78rem';
  extra.style.color = 'var(--muted)';
  extra.textContent =
    'Geo base simbólica atual: ' + latInfo + ' / ' + lngInfo +
    ' · corpo humano e corpo da rede aprendendo juntos.';
  container.appendChild(extra);

  nvStopLoading();
  nvToast('Dicas Meta-Humano-Máquina geradas.');
}

/* MOTION: captura acelerômetro para modular o arpejo */
function nvHandleMotion(ev) {
  if (!ev || !ev.accelerationIncludingGravity) return;
  const ax = ev.accelerationIncludingGravity.x || 0;
  const ay = ev.accelerationIncludingGravity.y || 0;
  const az = ev.accelerationIncludingGravity.z || 0;

  const mag = Math.sqrt(ax*ax + ay*ay + az*az);
  // Normaliza em algo entre 0 e ~1
  motionIntensity = Math.max(0, Math.min(1, mag / 20));
}

function nvInitMotion() {
  if (motionInitialized) return;
  motionInitialized = true;

  if (typeof DeviceMotionEvent !== 'undefined' &&
      typeof DeviceMotionEvent.requestPermission === 'function') {
    // iOS-style permission
    DeviceMotionEvent.requestPermission()
      .then(state => {
        if (state === 'granted') {
          window.addEventListener('devicemotion', nvHandleMotion);
        }
      })
      .catch(() => {
        // se negar, só ignora; arpejo usa movimento 0
      });
  } else if (typeof DeviceMotionEvent !== 'undefined') {
    // Android / outros
    window.addEventListener('devicemotion', nvHandleMotion);
  }
}

/* Escalas solares básicas (em semitons) */
const NV_SOLAR_SCALES = [
  { name: 'Dórica',  steps: [0, 2, 3, 5, 7, 9, 10] },
  { name: 'Maior',   steps: [0, 2, 4, 5, 7, 9, 11] },
  { name: 'Menor',   steps: [0, 2, 3, 5, 7, 8, 10] },
  { name: 'Lócria',  steps: [0, 1, 3, 5, 6, 8, 10] },
  { name: 'Mixolídia', steps: [0, 2, 4, 5, 7, 9, 10] }
];

function nvPickSolarScale() {
  let lat = geoLat != null ? geoLat : -23.5;
  let lng = geoLng != null ? geoLng : -47.5;

  // índice da escala a partir de lat/lng (modo super simples, mas simbólico)
  const mix = Math.abs(Math.round(lat) + Math.round(lng));
  const idx = mix % NV_SOLAR_SCALES.length;
  return NV_SOLAR_SCALES[idx];
}

/* ARPEJO SOLAR: lat/long + movimento (acelerômetro) */
async function toggleArpejo(ev) {
  ev.stopPropagation();
  nvStartLoading();

  const indicator = document.getElementById('geoIndicator');
  const waveBox = document.querySelector('.wave-container');

  try {
    await nvEnsureAudioCtx();
    nvInitMotion();

    if (!arpActive) {
      // LIGAR ARPEJO
      const scale = nvPickSolarScale();

      // base em torno de 220–320 Hz, dependendo da latitude
      const latBase = geoLat != null ? Math.abs(geoLat) : 23.5;
      const lngBase = geoLng != null ? Math.abs(geoLng) : 47.5;
      const baseFreq = 200 + (latBase % 30) * 2; // 200–260 Hz

      arpGain = audioCtx.createGain();
      arpGain.gain.value = 0.0; // sobe suave

      arpOscMain = audioCtx.createOscillator();
      arpOscOct  = audioCtx.createOscillator();

      arpOscMain.type = 'sine';
      arpOscOct.type  = 'sine';

      arpOscMain.connect(arpGain);
      arpOscOct.connect(arpGain);
      arpGain.connect(audioCtx.destination);

      const stepCount = scale.steps.length;
      let step = 0;

      const updateNote = () => {
        // velocidade em função do movimento (0 = lento, 1 = rápido)
        const speedFactor = 1 - Math.min(0.9, motionIntensity * 0.8); 
        // base 320ms -> 120ms
        const intervalMs = 120 + speedFactor * 200;

        const semitones = scale.steps[step % stepCount];
        const freqMain = baseFreq * Math.pow(2, semitones / 12);
        const freqOct  = freqMain * 2;

        arpOscMain.frequency.setValueAtTime(freqMain, audioCtx.currentTime);
        arpOscOct.frequency.setValueAtTime(freqOct, audioCtx.currentTime);

        // attack/decay suave no ganho
        const now = audioCtx.currentTime;
        const targetGain = 0.04 + motionIntensity * 0.08; // aumenta com movimento
        arpGain.gain.cancelScheduledValues(now);
        arpGain.gain.linearRampToValueAtTime(targetGain, now + 0.03);
        arpGain.gain.linearRampToValueAtTime(0.01, now + (intervalMs / 1000) * 0.9);

        step++;

        // re-agenda o próximo passo respeitando intensidade atual
        arpTimer = setTimeout(updateNote, intervalMs);
      };

      // iniciar osciladores e primeira nota
      arpOscMain.start();
      arpOscOct.start();
      arpActive = true;
      updateNote();

      // feedback textual
      const chosenScale = nvPickSolarScale();
      indicator.textContent +=
        ' · ARPEJO ATIVO (' +
        chosenScale.name + ' · base ~' + baseFreq.toFixed(1) + 'Hz).';

      // feedback visual
      if (waveBox) {
        waveBox.classList.add('is-arp-active');
        const prev = waveBox.getAttribute('data-freq-label') || 'binaural nos.s°lar';
        if (!/arpejo/i.test(prev)) {
          waveBox.setAttribute('data-freq-label', prev + ' · + arpejo');
        }
      }
    } else {
      // DESLIGAR ARPEJO
      if (arpTimer) {
        clearTimeout(arpTimer);
        arpTimer = null;
      }
      if (arpOscMain) {
        arpOscMain.stop();
        arpOscMain.disconnect();
      }
      if (arpOscOct) {
        arpOscOct.stop();
        arpOscOct.disconnect();
      }
      if (arpGain) {
        arpGain.disconnect();
      }

      arpOscMain = null;
      arpOscOct = null;
      arpGain = null;
      arpActive = false;

      // limpa texto
      indicator.textContent = indicator.textContent.replace(/ · ARPEJO ATIVO.*$/, '');

      // feedback visual off
      if (waveBox) {
        waveBox.classList.remove('is-arp-active');
        // mantém o label do binaural, só tira o " + arpejo"
        const prev = waveBox.getAttribute('data-freq-label');
        if (prev) {
          waveBox.setAttribute('data-freq-label', prev.replace(/ · \+ arpejo/i, ''));
        }
      }
    }
  } catch (e) {
    const indicator = document.getElementById('geoIndicator');
    if (indicator) {
      indicator.textContent =
        'ARPEJO: não foi possível iniciar (áudio / motion / política do navegador).';
    }
  } finally {
    nvStopLoading();
  }
}

/* GERADOR DE TEMPLATES LIVRO VIVO + TTS */
function nvGenerateTemplate(tipo) {
  nvStartLoading();
  const ta = document.getElementById('nv-template-output');
  if (!ta) {
    nvStopLoading();
    return;
  }

  let md = '';

  if (tipo === 'basico') {
    md = [
      '# ☀️ Projeto Solar Básico — Nos.S°lar · dual.infodose',
      '',
      '::info',
      'Proposta inicial de micro-usina solar conectada à camada simbólica do Nos.S°lar.',
      'Este documento pode ser expandido no InfoDocs / Livro Vivo.',
      '::',
      '',
      '## 🎯 Objetivo',
      '- Reduzir custos de energia;',
      '- Criar base para micro data center local;',
      '- Conectar o imóvel à rede simbólica Nos.S°lar.',
      '',
      '## 📍 Local & Perfil de Consumo',
      '- Endereço / Bairro:',
      '- Consumo médio (kWh/mês):',
      '- Telhado disponível (m²) / orientação:',
      '',
      '## ⚙️ Dimensionamento Inicial',
      '- Potência estimada (kWp):',
      '- Nº de módulos:',
      '- Inversor / microinversores:',
      '',
      '## 🤝 Modelo de Parceria',
      '- Tipo: Equity / Serviço / Híbrido;',
      '- Participação proposta;',
      '- Benefícios para o cliente;',
      '- Benefícios para a rede Nos.S°lar.',
      '',
      '## 📡 Camada Digital & Simbólica',
      '- Integração com painel Nos.S°lar;',
      '- Monitoramento simbólico (estado solar, dicas);',
      '- Rotina 3·6·9 de revisão energética.',
      ''
    ].join('\n');
  } else if (tipo === 'escola') {
    md = [
      '# 🏫 Educação Solar em Escolas — Nos.S°lar · dual.infodose',
      '',
      '::info',
      'Documento-modelo para projetos de educação solar em escolas,',
      'conectando energia, tecnologia e formação de estudantes.',
      '::',
      '',
      '## 🎯 Objetivos do Programa',
      '- Ensinar fundamentos de energia solar;',
      '- Integrar laboratório vivo (telhado da escola);',
      '- Conectar trilhas 3·6·9 de formação (alunos, professores, comunidade).',
      '',
      '## 🧩 Componentes do Projeto',
      '- Instalação de sistema fotovoltaico (mini-usina);',
      '- Painel Nos.S°lar na escola (visualização em tempo real);',
      '- Atividades didáticas (experimentos, desafios, jogos).',
      '',
      '## 📚 Trilhas 3·6·9',
      '- 3 encontros introdutórios (energia, sol, comunidade);',
      '- 6 encontros práticos (medição, dados, projeto);',
      '- 9 atividades abertas (feiras, apresentações, mentorias).',
      '',
      '## 🤝 Parcerias',
      '- Empresa de solar / Parque Tecnológico;',
      '- Secretaria de Educação / Prefeitura;',
      '- Comunidade local / associações.',
      '',
      '## 🔁 Monitoramento & Expansão',
      '- Métricas de aprendizado;',
      '- Economia de energia;',
      '- Rotas para expansão a outros bairros / escolas.',
      ''
    ].join('\n');
  } else if (tipo === 'parque') {
    md = [
      '# 🏭 Parque Tecnológico & Micro Data Center Solar — Nos.S°lar',
      '',
      '::info',
      'Modelo de documento para integrar parque tecnológico, empresas residentes e',
      'micro data centers alimentados por energia solar distribuída.',
      '::',
      '',
      '## 🎯 Visão Geral',
      '- Transformar o parque em nó central da rede Nos.S°lar;',
      '- Alojar micro data centers dedicados a IA / serviços digitais;',
      '- Construir spin-off cooperativa com empresas parceiras.',
      '',
      '## 🧱 Componentes de Infraestrutura',
      '- Telhados e áreas disponíveis para painéis;',
      '- Sala técnica / contêiner de dados (micro data center);',
      '- Conectividade (fibra, redundância, monitoramento).',
      '',
      '## 🤝 Modelo de Participação (Equity / Receita)',
      '- Percentual de participação por empresa;',
      '- Regras de entrada / saída;',
      '- Uso da marca “Nos.S°lar — dual.infodose";',
      '- Mecanismos de reinvestimento no próprio parque.',
      '',
      '## 🔧 Stack Digital & Simbólica',
      '- Painéis web / apps móveis (como este Nos.S°lar);',
      '- Monitoramento de energia + uso de servidores;',
      '- Integração com Livro Vivo / InfoDocs para documentação contínua.',
      '',
      '## 🔭 Roadmap 5–10 anos',
      '- Expansão para bairros e cidades vizinhas;',
      '- Parcerias com iniciativas africanas (Afrikafuturo);',
      '- Conexão com hubs solares globais.',
      ''
    ].join('\n');
  }

  ta.value = md;

  try {
    localStorage.setItem('nossolar_last_template', md);
  } catch(e) {}

  nvStopLoading();
  nvToast('Template Livro Vivo gerado.');
}

/* TTS básico de boas-vindas */
let nvTtsInitDone = false;
let nvVoices = [];

function nvInitVoices() {
  if (!('speechSynthesis' in window)) return;
  nvVoices = window.speechSynthesis.getVoices() || [];
  nvTtsInitDone = true;
}

if ('speechSynthesis' in window) {
  window.speechSynthesis.onvoiceschanged = function() {
    nvInitVoices();
  };
  nvInitVoices();
}

function nvPickPtBrVoice() {
  if (!nvVoices || !nvVoices.length) return null;
  // Procura vozes PT-BR primeiro
  let pt = nvVoices.find(v =>
    /pt[-_]?BR/i.test(v.lang || '') ||
    /portuguese.*brazil/i.test((v.name || '') + ' ' + (v.lang || ''))
  );
  if (pt) return pt;
  // fallback para qualquer PT
  pt = nvVoices.find(v => /^pt[-_]/i.test(v.lang || ''));
  if (pt) return pt;
  return nvVoices[0] || null;
}

function nvSpeakWelcome() {
  const text =
    'Bem-vindo ao painel Nos Solar, dual Infodose. ' +
    'Aqui você conecta energia, dados e livro vivo em um só lugar. ' +
    'Gere um template, leve para o InfoDocs e continue o fluxo do seu projeto solar.';

  if (!('speechSynthesis' in window)) {
    alert(text);
    return;
  }

  const utter = new SpeechSynthesisUtterance(text);
  const voice = nvPickPtBrVoice();
  if (voice) utter.voice = voice;
  utter.rate = 1.02;
  utter.pitch = 1.0;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utter);
}

/* LS STATUS interno do Nos.S°lar */
function nvLsScan() {
  nvStartLoading();
  const out = document.getElementById('nv-ls-output');
  if (!out) {
    nvStopLoading();
    return;
  }

  try {
    const ls = window.localStorage;
    const len = ls.length;
    let totalBytes = 0;
    let lines = [];

    for (let i = 0; i < len; i++) {
      const key = ls.key(i);
      const val = ls.getItem(key);
      const size = (key.length + (val ? val.length : 0)) * 2; // aprox bytes
      totalBytes += size;
      lines.push('- ' + key + '  ~  ' + size + ' bytes aprox.');
    }

    const header =
      'Chaves armazenadas: ' + len + '\n' +
      'Tamanho aproximado total: ' + totalBytes + ' bytes\n';

    out.textContent = header + (lines.length ? '\n' + lines.join('\n') : '\n(nenhuma chave encontrada)');
  } catch (e) {
    out.textContent = 'Erro ao ler localStorage: ' + e;
  }

  nvStopLoading();
  nvToast('Leitura de localStorage concluída.');
}

function nvLsClear() {
  const out = document.getElementById('nv-ls-output');
  if (!out) return;
  if (!window.confirm('Deseja limpar as chaves do Nos.S°lar neste navegador?')) return;

  nvStartLoading();
  try {
    const ls = window.localStorage;
    // Limpa apenas chaves com prefixo nossolar_
    const toRemove = [];
    for (let i = 0; i < ls.length; i++) {
      const key = ls.key(i);
      if (key && key.indexOf('nossolar_') === 0) {
        toRemove.push(key);
      }
    }
    toRemove.forEach(k => ls.removeItem(k));

    out.textContent =
      'Chaves com prefixo "nossolar_" removidas. ' +
      'Use "Ver estado atual do LS" para conferir.';
  } catch (e) {
    out.textContent = 'Erro ao limpar localStorage: ' + e;
  }
  nvStopLoading();
  nvToast('Chaves locais do Nos.S°lar limpas.');
}

/* Análise de ambiente (loader + métricas em card bonitinho) */
function nvAnalyzeEnv(ev) {
  ev.stopPropagation();
  nvStartLoading();

  const box = document.getElementById('envMetrics');
  if (!box) {
    nvStopLoading();
    return;
  }

  const now = new Date();
  const horas = String(now.getHours()).padStart(2, '0');
  const mins = String(now.getMinutes()).padStart(2, '0');
  const horaStr = horas + ':' + mins;

  const ciclo = nvGetSolarModeLabel();
  const latInfo = geoLat != null ? geoLat.toFixed(4) : 'não definido';
  const lngInfo = geoLng != null ? geoLng.toFixed(4) : 'não definido';

  // Estimativa simbólica de "carga" com base no horário
  let carga;
  if (now.getHours() < 6) carga = 'baixa (pré-alvorada)';
  else if (now.getHours() < 11) carga = 'subindo (manhã ativa)';
  else if (now.getHours() < 15) carga = 'alta (pico solar)';
  else if (now.getHours() < 19) carga = 'estável (fim de tarde)';
  else carga = 'descendo (noite / descarregar)';

  let recomendacao;
  if (now.getHours() < 11) {
    recomendacao =
      'Bom momento para tarefas criativas e planejamento. ' +
      'Use a luz da manhã como “energia grátis” para o cérebro.';
  } else if (now.getHours() < 18) {
    recomendacao =
      'Priorize execução focada. Menos abas, mais profundidade. ' +
      'Imagine que cada decisão bem tomada é um painel rendendo mais.';
  } else {
    recomendacao =
      'Comece a desacelerar. Feche ciclos, descarregue tensões e prepare o corpo ' +
      'para armazenar o essencial do dia, sem sobrecarga.';
  }

  box.innerHTML = `
    <div class="env-card">
      <h4>Leitura rápida do ambiente</h4>
      <small>Nos.S°lar · análise simbólica local</small>
      <div class="env-grid">
        <div class="env-row">
          <span class="env-label">Horário local</span>
          <span class="env-value">${horaStr}</span>
        </div>
        <div class="env-row">
          <span class="env-label">Ciclo solar</span>
          <span class="env-value">${ciclo}</span>
        </div>
        <div class="env-row">
          <span class="env-label">Lat / Lng base</span>
          <span class="env-value">${latInfo} / ${lngInfo}</span>
        </div>
        <div class="env-row">
          <span class="env-label">Carga simbólica</span>
          <span class="env-value">${carga}</span>
        </div>
      </div>
      <p style="margin-top:8px;font-size:0.8rem;color:var(--muted);">
        ${recomendacao}
      </p>
    </div>
  `;

  nvStopLoading();
  nvToast('Ambiente solar analisado.');
}

/* ===== host-principal-do-primeiro-card-boas-vindas-livro-vivo.js ===== */
/* Unificação dos cards em 3 blocos:
   1) welcome + ls + env
   2) solar (inalterado)
   3) geo + tips
*/
document.addEventListener('DOMContentLoaded', function () {
  try {
    // --- Host principal do primeiro card (Boas-vindas / Livro Vivo) ---
    const welcomeInner = document.querySelector('.card[data-card="welcome"] .card-body-inner');

    const lsCard  = document.querySelector('.card[data-card="ls"]');
    const envCard = document.querySelector('.card[data-card="env"]');
    const tipsCard = document.querySelector('.card[data-card="tips"]');
    const geoInner = document.querySelector('.card[data-card="geo"] .card-body-inner');

    // 1) Juntar LS dentro do card de Boas-vindas
    if (welcomeInner && lsCard) {
      const lsInner = lsCard.querySelector('.card-body-inner');
      if (lsInner) {
        const wrap = document.createElement('div');
        wrap.className = 'nv-subcard';
        wrap.innerHTML =
          '<p class="nv-subtitle">LocalStorage · Estado interno do Nos.S°lar</p>' +
          lsInner.innerHTML;
        welcomeInner.appendChild(wrap);
      }
      lsCard.remove();
    }

    // 2) Juntar Ambiente dentro do card de Boas-vindas
    if (welcomeInner && envCard) {
      const envInner = envCard.querySelector('.card-body-inner');
      if (envInner) {
        const wrap = document.createElement('div');
        wrap.className = 'nv-subcard';
        wrap.innerHTML =
          '<p class="nv-subtitle">Leitura rápida do ambiente solar</p>' +
          envInner.innerHTML;
        welcomeInner.appendChild(wrap);
      }
      envCard.remove();
    }

    // 3) Juntar Dicas dentro do card de Geo
    if (geoInner && tipsCard) {
      const tipsInner = tipsCard.querySelector('.card-body-inner');
      if (tipsInner) {
        const wrap = document.createElement('div');
        wrap.className = 'nv-subcard';
        wrap.innerHTML =
          '<p class="nv-subtitle">Dicas Meta-Humano-Máquina · manhã · tarde · noite</p>' +
          tipsInner.innerHTML;
        geoInner.appendChild(wrap);
      }
      tipsCard.remove();
    }

   
}
   catch (e) {
    console.warn('Patch de unificação de cards falhou:', e);
  }
});