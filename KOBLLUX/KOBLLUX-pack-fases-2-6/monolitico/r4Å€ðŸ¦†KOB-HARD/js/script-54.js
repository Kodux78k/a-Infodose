
(function(){
  'use strict';
  var tries = 0;
  var boot = setInterval(function(){
    var panel = document.getElementById('kca-panel');
    var foot  = panel && panel.querySelector('.kca-foot');
    if (panel && foot && !document.getElementById('kca-sonoro-section')) {
      clearInterval(boot);
      mount(panel, foot);
    }
    if (++tries > 80) clearInterval(boot);
  }, 250);

  function mount(panel, foot){
    var ref = {
      bpm:   document.getElementById('sonoroBpm'),
      rev:   document.getElementById('sonoroReverb'),
      theme: document.getElementById('sonoroTheme'),
      synth: document.getElementById('sonoroSynth')
    };

    /* ── seção sonoro ── */
    var sec = document.createElement('section');
    sec.id = 'kca-sonoro-section';
    sec.innerHTML =
      '<div class="kca-label">Soneto · trilha do texto ativo</div>' +
      '<div id="kca-sonoro-read">—</div>' +
      '<label>BPM <input type="range" id="kca-sn-bpm" min="60" max="240" value="130"><span class="kca-val" id="kca-sn-bpm-v">130</span></label>' +
      '<label>Reverb <input type="range" id="kca-sn-rev" min="0" max="100" value="40"><span class="kca-val" id="kca-sn-rev-v">40%</span></label>' +
      '<span class="kca-lbl-inline">Escala</span>' +
      '<select id="kca-sn-theme"></select>' +
      '<span class="kca-lbl-inline">Timbre</span>' +
      '<select id="kca-sn-synth"></select>' +
      '<div class="kca-aud">' +
        '<button type="button" class="kca-btn" id="kca-sn-play" title="Iniciar trilha do texto ativo">▶ SONETO</button>' +
        '<button type="button" class="kca-btn" id="kca-sn-stop" title="Parar trilha">■ PARAR</button>' +
        '<button type="button" class="kca-btn" id="kca-sn-corr" title="Recalcular léxico → BPM/escala/timbre/reverb">↻ CORREL.</button>' +
        '<button type="button" class="kca-btn" id="kca-sn-seed" title="Enviar texto ativo para Semente">→ SEMENTE</button>' +
      '</div>';
    panel.insertBefore(sec, foot);

    /* ── seção log ── */
    var logSec = document.createElement('section');
    logSec.id = 'kca-log-section';
    logSec.innerHTML =
      '<div class="kca-label">Log de fusão de voz</div>' +
      '<div id="kca-fusion-log"></div>';
    panel.insertBefore(logSec, foot);

    var ui = {
      bpm:   document.getElementById('kca-sn-bpm'),
      bpmV:  document.getElementById('kca-sn-bpm-v'),
      rev:   document.getElementById('kca-sn-rev'),
      revV:  document.getElementById('kca-sn-rev-v'),
      theme: document.getElementById('kca-sn-theme'),
      synth: document.getElementById('kca-sn-synth'),
      read:  document.getElementById('kca-sonoro-read'),
      log:   document.getElementById('kca-fusion-log')
    };

    /* select espelha o original */
    if (ref.theme) ui.theme.innerHTML = ref.theme.innerHTML;
    if (ref.synth) ui.synth.innerHTML = ref.synth.innerHTML;

    function pull(){
      if (ref.bpm){ ui.bpm.value = ref.bpm.value; ui.bpmV.textContent = ref.bpm.value; }
      if (ref.rev){ ui.rev.value = ref.rev.value; ui.revV.textContent = ref.rev.value + '%'; }
      if (ref.theme && ref.theme.value) ui.theme.value = ref.theme.value;
      if (ref.synth && ref.synth.value) ui.synth.value = ref.synth.value;
    }
    function push(key, val){
      var el = ref[key]; if (!el) return;
      el.value = val;
      el.dispatchEvent(new Event('input',  { bubbles: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
    }

    ui.bpm.addEventListener('input', function(){ ui.bpmV.textContent = ui.bpm.value; push('bpm', ui.bpm.value); });
    ui.rev.addEventListener('input', function(){ ui.revV.textContent = ui.rev.value + '%'; push('rev', ui.rev.value); });
    ui.theme.addEventListener('change', function(){ push('theme', ui.theme.value); });
    ui.synth.addEventListener('change', function(){ push('synth', ui.synth.value); });

    document.getElementById('kca-sn-play').addEventListener('click', function(){
      var S = window.KOBSonoro;
      var active = (window.KOBActive && KOBActive.text) || '';
      if (S && S.playText && active) { S.playText(active, (KOBActive && KOBActive.title) || 'Soneto'); return; }
      var btn = document.querySelector('#sonetoRoot [data-action="play-sonoro"], #main-header2 [data-action="play-sonoro"]');
      if (btn) btn.click();
    });
    document.getElementById('kca-sn-stop').addEventListener('click', function(){
      var S = window.KOBSonoro;
      if (S && S.isPlaying && S.isPlaying()) {
        var btn = document.querySelector('#sonetoRoot [data-action="play-sonoro"]');
        if (btn) btn.click();
      }
    });
    document.getElementById('kca-sn-corr').addEventListener('click', function(){
      var S = window.KOBSonoro;
      if (S && S.autoCorrelate) {
        var p = S.autoCorrelate();
        if (p){ pull(); updateRead(); addLog('↻ correlacionado: ' + p.bpm + 'bpm · ' + p.theme + ' · ' + p.synth, 'voice'); }
      }
    });
    document.getElementById('kca-sn-seed').addEventListener('click', function(){
      var S = window.KOBSonoro;
      var t = (window.KOBActive && KOBActive.text) || '';
      if (S && S.toSeed && t) S.toSeed(t);
    });

    /* ── estado vivo ── */
    function updateRead(){
      var S = window.KOBSonoro;
      var p = S && S.profile;
      var playing = S && S.isPlaying && S.isPlaying();
      var arch  = (window.KOBArch && KOBArch.voice) || (window.getArch && getArch()) || '—';
      var music = (window.KOBArch && KOBArch.music) || arch;
      var out = [];
      out.push((playing ? '▶' : '⏸') + ' trilha: ' + (playing ? 'TOCANDO' : 'parada'));
      out.push('◉ arquétipo: ' + arch + (arch !== music ? ' · música: ' + music : ''));
      if (p){
        out.push('♪ ' + p.bpm + 'bpm · ' + p.theme + ' · ' + p.synth + ' · rev ' + p.reverb + '%');
        out.push('✎ ' + p.words + ' palavras · dens ' + p.density + '%');
      } else if (ref.bpm && ref.rev){
        out.push('♪ ' + ref.bpm.value + 'bpm · rev ' + ref.rev.value + '%');
      }
      ui.read.innerHTML = out.join('<br>');
    }

    /* ── log de fusão ── */
    var entries = [];
    function addLog(text, kind){
      var t = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      entries.unshift({ t: t, text: text, kind: kind || 'voice' });
      if (entries.length > 30) entries.pop();
      ui.log.innerHTML = entries.map(function(e){
        return '<div class="kca-log-' + e.kind + '">[' + e.t + '] ' + e.text + '</div>';
      }).join('');
    }

    if (window.KOBArch && typeof KOBArch.subscribe === 'function'){
      KOBArch.subscribe(function(ev){
        if (!ev || ev.previous === ev.current) return;
        if (ev.type === 'voice') addLog('🔊 voz ' + ev.previous + ' → ' + ev.current, 'voice');
        else if (ev.type === 'music') addLog('🎵 música ' + ev.previous + ' → ' + ev.current, 'music');
        updateRead();
      });
    }

    window.addEventListener('kob:arch',            function(){ updateRead(); });
    window.addEventListener('kob:sonoro-profile', function(){ pull(); updateRead(); });
    window.addEventListener('kob:sonoro-state',   function(e){
      var on = !!(e.detail && e.detail.playing);
      addLog(on ? '▶ trilha iniciada' : '⏸ trilha parada', on ? 'play' : 'stop');
      updateRead();
    });

    /* só re-lê se estiver aberto — sem timer rodando em background */
    var tick = 0;
    function lazyRead(){
      var p = document.getElementById('kca-panel');
      if (p && p.classList.contains('kca-open')) updateRead();
      tick = 0;
    }
    document.addEventListener('click', function(){ if (!tick) tick = setTimeout(lazyRead, 120); }, { passive: true });

    pull(); updateRead(); addLog('— log iniciado —', 'voice');
  }
})();
