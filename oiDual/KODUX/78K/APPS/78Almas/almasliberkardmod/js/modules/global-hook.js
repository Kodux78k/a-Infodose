// 🔓 GLOBAL HOOK
//window.makeOrbAvatar = makeOrbAvatar;

// 🔹 ALIAS OPCIONAL (mini semântico)
//window.makeMiniAvatar = (name) => makeOrbAvatar(name, 24);

// 🔁 ===============================
// 🔁 UPDATE INTERFACE
// 🔁 ===============================
function updateInterface(name){
  const safe = name || 'DUAL';

  // 🔹 texto
  els.lblName.innerText = safe;
  els.input.value = safe;

  // 🔹 estado ativo
  const activeKey = STATE.keys.find(k => k.active);

  els.smallIdent.innerText = activeKey ? activeKey.name : '--';
  els.actBadge.innerText = activeKey ? `key:${activeKey.name}` : 'v:--';

  // 🔥 ORBS SINCRONIZADOS
  const orbBig  = makeOrbAvatar(safe, 64);
  const orbMid  = makeOrbAvatar(safe, 36);
  const orbMini = makeOrbAvatar(safe, 24);

  els.avatarTgt.innerHTML = orbBig;
  els.smallMiniAvatar.innerHTML = orbMini;
  els.actMiniAvatar.innerHTML = orbMid;

  // 🔹 nome ativo
  els.actName.innerText = safe;
}