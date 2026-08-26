 function updateInterface(name){
      const safe = name || di_userName || 'Convidado';
      els.lblName.innerText = safe;
      els.input.value = safe;
      const activeKey = STATE.keys.find(k => k.active);
      els.smallIdent.innerText = activeKey ? activeKey.name : '--';
      els.actBadge.innerText = activeKey ? `key:${activeKey.name}` : 'v:--';
      const orbBig  = makeOrbAvatar(safe, 64);
      const orbMid  = makeOrbAvatar(safe, 36);
      const orbMini = makeOrbAvatar(safe, 24);
      els.avatarTgt.innerHTML = orbBig;
      els.smallMiniAvatar.innerHTML = orbMini;
      els.actMiniAvatar.innerHTML = orbMid;
      els.actName.innerText = safe;
    }
  