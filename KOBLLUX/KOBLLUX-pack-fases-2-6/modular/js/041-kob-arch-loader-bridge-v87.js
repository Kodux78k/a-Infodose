/* @kob-mod 041 · kob-arch-loader-bridge-v87 · body */

  (function KOB_ARCH_LOADER_BRIDGE() {
    "use strict";
    if (window.__KOB_ARCH_LOADER_BRIDGE__) return;
    window.__KOB_ARCH_LOADER_BRIDGE__ = true;
    
    /* ═══════════════════════════════════════════════════════════
       PONTE entre KOBLLUX_ARCH_LOADER (kob-fetch.js)
       e o motor de voz/trilha da V86 (KOBArch, KOB_ARCHSWITCH, KOB_TTS)
       ═══════════════════════════════════════════════════════════ */
    
    /* ── 1. Quando o loader muda o arquétipo, propaga pra V86 ── */
    function onArchChanged(arch) {
      if (!arch || !arch.id) return;
      
      const id = String(arch.id).toUpperCase();
      
      /* espelha no body (fonte real da V86) */
      try { document.body.setAttribute('data-arch', id); } catch (_) {}
      try { document.body.setAttribute('data-voice-arch', arch.id.toLowerCase()); } catch (_) {}
      
      /* avisa o motor musical → crossfade de camadas */
      try { window.KOB_ARCHSWITCH && KOB_ARCHSWITCH(id); } catch (_) {}
      
      /* atualiza o KOBArch (item 3 do patch V86) */
      try { window.KOBArch && KOBArch.setVoice && KOBArch.setVoice(id); } catch (_) {}
      
      /* dispara evento para os outros módulos que já escutam */
      try {
        window.dispatchEvent(new CustomEvent('kob:arch', { detail: { arch: id } }));
      } catch (_) {}
      
      console.log('%c[ARCH-BRIDGE]%c ' + id + ' propagado → body + trilha + voz',
        'background:#f0c060;color:#000;padding:1px 6px;border-radius:3px',
        'color:#f0c060');
    }
    
    /* ── 2. Reinstala hookKOBLLUX pra preservar o updateArchetype antigo ── */
    function reinstallHook() {
      if (!window.KOBLLUX) return false;
      if (window.KOBLLUX.__bridgeHooked) return true;
      
      const _origUpdate = window.KOBLLUX.updateArchetype;
      window.KOBLLUX.updateArchetype = function(idx) {
        /* 1) chama o método do loader se estiver ativo */
        const loader = window.KOBLLUX_ARCH_LOADER;
        if (loader && loader.setArchByIndex && loader.getArchetypes().length) {
          loader.setArchByIndex(idx);
          /* o applyTheme do loader dispara KXAT_ARCH_CHANGED → nosso onArchChanged → KOB_ARCHSWITCH */
          return;
        }
        /* 2) senão, chama o updateArchetype antigo (kob-glue-dh10) */
        if (typeof _origUpdate === 'function') {
          _origUpdate.call(this, idx);
          /* e também propaga pra trilha */
          const arr = (window.KOBLLUX.getArchetypes && KOBLLUX.getArchetypes()) || [];
          const a = arr[((idx % arr.length) + arr.length) % arr.length];
          if (a && a.id) onArchChanged(a);
        }
      };
      window.KOBLLUX.__bridgeHooked = true;
      console.log('[ARCH-BRIDGE] hook KOBLLUX.updateArchetype reinstalado');
      return true;
    }
    
    /* ── 3. Escuta o loader e propaga ── */
    window.addEventListener('KXAT_ARCH_CHANGED', e => {
      if (e.detail) onArchChanged(e.detail);
    });
    window.addEventListener('KXAT_ARCH_LOADED', e => {
      const arr = (e.detail && e.detail.archetypes) || [];
      if (arr.length) {
        /* aplica o ativo (o loader já fez isso, mas garante que body também bate) */
        const active = window.KOBLLUX_ARCH_LOADER && KOBLLUX_ARCH_LOADER.getActive ?
          KOBLLUX_ARCH_LOADER.getActive() :
          arr[0];
        if (active) onArchChanged(active);
      }
      console.log('%c[ARCH-BRIDGE]%c ' + arr.length + ' arquétipos carregados de ' + (e.detail.source || '?'),
        'background:#f0c060;color:#000;padding:1px 6px;border-radius:3px', 'color:#f0c060');
    });
    
    /* ── 4. Boot: garante hook assim que KOBLLUX existir ── */
    if (!reinstallHook()) {
      let n = 0;
      const t = setInterval(() => { if (reinstallHook() || ++n > 60) clearInterval(t); }, 120);
    }
    
    /* ── 5. API pública pra debug / uso externo ── */
    window.KOB_ARCH_BRIDGE = {
      apply: onArchChanged,
      reloadHook: reinstallHook,
      get arch() {
        return (document.body.dataset.arch || '').toUpperCase() || null;
      },
      get loaderActive() {
        return !!(window.KOBLLUX_ARCH_LOADER && KOBLLUX_ARCH_LOADER.getArchetypes().length);
      },
      version: '87'
    };
    
    console.log('%c[KOB-ARCH-BRIDGE]%c ativo — ligando loader ⇄ trilha ⇄ voz',
      'background:#f0c060;color:#000;padding:2px 8px;border-radius:3px',
      'color:#f0c060');
    
  })();
