
  (function() {
    'use strict';
    if (window.__KOB_TTS_MODE_V4__) return;
    window.__KOB_TTS_MODE_V4__ = true;
    
    var STATE_KEY = 'kobllux_sb_mode';
    var TTS_IDS = ['btn-prev', 'btn-play', 'tts-stop'];
    
    function injectCSS() {
      if (document.getElementById('kob-tts-mode-v4-css')) return;
      var st = document.createElement('style');
      st.id = 'kob-tts-mode-v4-css';
      st.textContent = [
        /* quando em tts-open: esconde o grupo clássico (sbSpeak/sbStop/sbCopy/sbClear/sbDownload),
           o rótulo EXTRAS, os wraps de player/tema/navmode/viewport, o carrossel e o hud.
           MANTÉM: TTS (prev/play/stop, marcados .tts-keep) + MXP slot + orb + grip + toggle + ≡ + btn-arch + dock */
        '#symbolBar.tts-open > div.sb-extras:not(.mxp-slot),',
        '#symbolBar.tts-open > .sb-extras-head,',
        '#symbolBar.tts-open > .symbol-wrap:not(.tts-keep),',
        '#symbolBar.tts-open > .sb-carousel,',
        '#symbolBar.tts-open > .sb-dots,',
        '#symbolBar.tts-open > .sb-hud {',
        '  display: none !important;',
        '}'
      ].join('\n');
      document.head.appendChild(st);
    }
    
    function markTTS() {
      TTS_IDS.forEach(function(id) {
        var btn = document.getElementById(id);
        if (btn && btn.parentElement && btn.parentElement.classList.contains('symbol-wrap')) {
          btn.parentElement.classList.add('tts-keep');
        }
      });
    }
    
    function getMode() {
      var bar = document.getElementById('symbolBar');
      if (!bar) return 'full';
      if (bar.classList.contains('collapsed')) return 'collapsed';
      if (bar.classList.contains('tts-open')) return 'tts-open';
      return 'full';
    }
    
    function setMode(mode) {
      var bar = document.getElementById('symbolBar');
      if (!bar) return;
      bar.classList.remove('collapsed', 'tts-open');
      if (mode === 'collapsed') bar.classList.add('collapsed');
      else if (mode === 'tts-open') bar.classList.add('tts-open');
      /* 'full' = nenhuma das duas */
      try { localStorage.setItem(STATE_KEY, mode); } catch (_) {}
      repaint();
    }
    
    function repaint() {
      var bar = document.getElementById('symbolBar');
      if (!bar) return;
      var tb = document.getElementById('toggleBtn');
      var sb = document.getElementById('sbToggle');
      var mode = getMode();
      
      if (tb) {
        tb.classList.toggle('carousel-off', mode === 'collapsed');
        tb.classList.toggle('carousel-on', mode !== 'collapsed');
        tb.title = mode === 'tts-open' ? 'Fechar controles TTS' : 'Abrir só controles TTS';
      }
      if (sb) {
        sb.textContent = mode === 'collapsed' ? '▲' : '▼';
        sb.title = mode === 'collapsed' ? 'Abrir tudo' : 'Recolher';
      }
    }
    
    /* ≡: só TTS + MXP. Do colapsado, expande pra tts-open; do tts-open, volta pra colapsado. */
    function bindMain() {
      var bar = document.getElementById('symbolBar');
      var old = document.getElementById('toggleBtn');
      if (!bar || !old) return false;
      if (old.__ttsModeV4) return true;
      
      markTTS();
      injectCSS();
      
      var fresh = old.cloneNode(true);
      fresh.__ttsModeV4 = true;
      fresh.__mxpBound = true; /* impede o mxp-patch-v3 de re-bindar */
      fresh.__ttsHierarchy = true; /* impede o hierarchy-v3 de re-bindar */
      old.parentNode.replaceChild(fresh, old);
      
      fresh.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        var mode = getMode();
        if (mode === 'tts-open') setMode('collapsed');
        else setMode('tts-open');
      });
      
      return true;
    }
    
    /* ▼: toggla entre colapsado e expandido (full) */
    function bindArrow() {
      var bar = document.getElementById('symbolBar');
      var old = document.getElementById('sbToggle');
      if (!bar || !old) return false;
      if (old.__ttsModeV4) return true;
      
      var fresh = old.cloneNode(true);
      fresh.__ttsModeV4 = true;
      fresh.__mxpBound = true;
      fresh.__ttsHierarchy = true;
      old.parentNode.replaceChild(fresh, old);
      
      fresh.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        var mode = getMode();
        if (mode === 'collapsed') setMode('full');
        else setMode('collapsed');
      });
      
      return true;
    }
    
    function restore() {
      var saved = 'collapsed';
      try { saved = localStorage.getItem(STATE_KEY) || 'collapsed'; } catch (_) {}
      if (saved !== 'tts-open' && saved !== 'full') saved = 'collapsed';
      setMode(saved);
    }
    
    var tries = 0;
    (function boot() {
      var a = bindMain();
      var b = bindArrow();
      if (a && b) {
        restore();
        console.log('[KOB-TTS-MODE v4] ≡ = só TTS+MXP · ▼ = full/colapsado');
        return;
      }
      if (++tries > 30) return;
      setTimeout(boot, 300);
    })();
    
    window.addEventListener('kob:sonoro-state', repaint);
    
    window.KOBTTSMode = {
      get mode() { return getMode(); },
      set: setMode,
      reset: function() { setMode('collapsed'); }
    };
  })();
