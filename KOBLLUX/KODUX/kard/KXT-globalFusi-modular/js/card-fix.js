  (() => {
    if (window.__DI_FUSION_FIX__) return;
    window.__DI_FUSION_FIX__ = true;
    
    /* ══════════════════════════════════════════════════
       FUSION CARD FIX — Atualização de Interface & Orb
       ══════════════════════════════════════════════════ */
    
    let _lastOrbName = null;
    
    window.updateInterface = function updateInterfaceFixed(name) {
      const safe = (name || '').trim() || 'Convidado';
      
      // Atualiza textos
      const lblName = document.getElementById('lblName');
      if (lblName) lblName.innerText = safe;
      
      const input = document.getElementById('inputUserCard');
      if (input && document.activeElement !== input) input.value = safe;
      const cockpitInput = document.getElementById('inputUserId');
      if (cockpitInput && document.activeElement !== cockpitInput) cockpitInput.value = safe;
      const usernameDisplay = document.getElementById('usernameDisplay');
      if (usernameDisplay) usernameDisplay.textContent = safe;
      
      const actName = document.getElementById('actName');
      if (actName) actName.innerText = safe;
      
      // Avatar principal (só recria se o nome mudou para preservar animação)
      const avatarTgt = document.getElementById('avatarTarget');
      if (avatarTgt && typeof window.makeOrbAvatar === 'function') {
        if (_lastOrbName !== safe) {
          avatarTgt.innerHTML = window.makeOrbAvatar(safe, 64);
          avatarTgt.classList.add('shown');
          _lastOrbName = safe;
        }
      }
      
      // Mini avatares
      const smallMini = document.getElementById('smallMiniAvatar');
      if (smallMini && typeof window.makeOrbAvatar === 'function') {
        if (smallMini.dataset.orbName !== safe) {
          smallMini.innerHTML = window.makeOrbAvatar(safe, 24);
          smallMini.dataset.orbName = safe;
        }
      }
      
      const actMini = document.getElementById('actMiniAvatar');
      if (actMini && typeof window.makeOrbAvatar === 'function') {
        if (actMini.dataset.orbName !== safe) {
          actMini.innerHTML = window.makeOrbAvatar(safe, 36);
          actMini.dataset.orbName = safe;
        }
      }
      
      // Badge / identificador da chave ativa
      const keys = (window.STATE && window.STATE.keys) || [];
      const active = keys.find(k => k.active);
      const smallIdent = document.getElementById('smallIdent');
      if (smallIdent) smallIdent.innerText = active ? active.name : '--';
      const actBadge = document.getElementById('actBadge');
      if (actBadge) actBadge.innerText = active ? `key:${active.name}` : 'v:--';
      
      // Texto do preview
      const smallText = document.getElementById('smallText');
      if (smallText) {
        smallText.innerText = active ?
          `${active.name} [ATIVO]` :
          (safe === 'Convidado' ? 'Aguardando...' : `${safe} · canal ASCII ativo`);
      }
      
      // Bloco ASCII de ativação
      const actPre = document.getElementById('actPre');
      if (actPre) {
        const line = `+${'-'.repeat(safe.length + 4)}+`;
        const hash = (s) => {
          let h = 0xdeadbeef;
          for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 2654435761);
          return ((h ^ (h >>> 16)) >>> 0).toString(16);
        };
        actPre.innerText = `${line}\n| ${safe.toUpperCase()} |\n${line}\nID: ${hash(safe)}`;
      }
      
      // Sincronização externa (di_overrideSync)
      if (typeof window.di_overrideSync === 'function') {
        try { window.di_overrideSync(safe); } catch (_) {}
      }
    };
    
    /* ══════════════════════════════════════════════════
       Reforço: re-renderiza o orb ao voltar para o CARD
       ══════════════════════════════════════════════════ */
    const mainCard = document.getElementById('mainCard');
    if (mainCard) {
      let wasOrb = mainCard.classList.contains('orb');
      let wasHud = mainCard.classList.contains('hud');
      
      const classMo = new MutationObserver(() => {
        const isOrb = mainCard.classList.contains('orb');
        const isHud = mainCard.classList.contains('hud');
        
        // Saiu de ORB/HUD e voltou para o CARD principal
        if ((wasOrb || wasHud) && !isOrb && !isHud) {
          const name =
            localStorage.getItem('di_userName') ||
            document.getElementById('inputUserCard')?.value?.trim() ||
            document.getElementById('inputUserId')?.value?.trim() ||
            'Convidado';
          _lastOrbName = null; // Força recriação limpa do orb
          window.updateInterface(name);
        }
        
        wasOrb = isOrb;
        wasHud = isHud;
      });
      classMo.observe(mainCard, { attributes: true, attributeFilter: ['class'] });
    }
    
    /* ══════════════════════════════════════════════════
       Inicialização
       ══════════════════════════════════════════════════ */
    const initName = () => {
      const name =
        localStorage.getItem('di_userName') ||
        document.getElementById('inputUserCard')?.value?.trim() ||
        document.getElementById('inputUserId')?.value?.trim() ||
        'Convidado';
      _lastOrbName = null;
      window.updateInterface(name);
    };

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initName);
    } else {
      initName();
    }
    
    console.log('[DI_FUSION_FIX] Patch limpo aplicado com sucesso.');
  })();
