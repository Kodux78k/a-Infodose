/* @kob-mod 044 · updateInterface-JSI_22 · body */

  function updateInterface(name) {
    const safe = name || (typeof di_userName !== 'undefined' && di_userName) || 'Convidado';
    if (typeof els !== 'undefined' && els) {
      if (els.lblName) els.lblName.innerText = safe;
      if (els.input) els.input.value = safe;
      const activeKey = (typeof STATE !== 'undefined' && STATE.keys) ? STATE.keys.find(k => k.active) : null;
      if (els.smallIdent) els.smallIdent.innerText = activeKey ? activeKey.name : '--';
      if (els.actBadge) els.actBadge.innerText = activeKey ? `key:${activeKey.name}` : 'v:--';
      if (typeof makeOrbAvatar === 'function') {
        const orbBig = makeOrbAvatar(safe, 64);
        const orbMid = makeOrbAvatar(safe, 36);
        const orbMini = makeOrbAvatar(safe, 24);
        if (els.avatarTgt) els.avatarTgt.innerHTML = orbBig;
        if (els.smallMiniAvatar) els.smallMiniAvatar.innerHTML = orbMini;
        if (els.actMiniAvatar) els.actMiniAvatar.innerHTML = orbMid;
      }
      if (els.actName) els.actName.innerText = safe;
    }
  }
