 // 🔥 UNIVERSAL ORB GENERATOR: EVOLVED 3D (V3) 🔥
function injectOrbStyles() {
  if (document.getElementById('dual-orb-styles')) return;

  const style = document.createElement('style');
  style.id = 'dual-orb-styles';
  style.innerHTML = `
    @keyframes orbBreathe {
      0%, 100% { transform: translateZ(0) scale(1); opacity: .82; filter: brightness(1); }
      50%      { transform: translateZ(0) scale(1.08); opacity: 1;   filter: brightness(1.22); }
    }



    @keyframes orbPulse {
      0%   { transform: scale(.78); opacity: .55; }
      100% { transform: scale(1.28); opacity: 0; }
    }

    @keyframes orbFloat {
      0%, 100% { transform: translateY(0px) rotateX(0deg) rotateY(0deg); }
      50%      { transform: translateY(-2px) rotateX(10deg) rotateY(-10deg); }
    }

    .dual-orb-wrap {
      --orb-speed: 4s;
      --orb-spin-speed: 12s;
      --orb-pulse-speed: 2.2s;

      position: relative;
      display: inline-grid;
      place-items: center;
      width: var(--orb-size, 64px);
      aspect-ratio: 1;
      perspective: 900px;
      transform-style: preserve-3d;
      user-select: none;
      cursor: pointer;
      transition: transform .28s cubic-bezier(.175,.885,.32,1.275);
    }

    .dual-orb-wrap:active {
      transform: scale(.94);
    }

    .dual-orb-wrap:hover {
      transform: scale(1.03);
    }

    .dual-orb-svg {
      width: 100%;
      height: 100%;
      display: block;
      opacity: .88;
      filter: brightness(.88) saturate(1.12);
      transform: translateZ(0);
    }

    .dual-orb-shell {
      position: absolute;
      inset: 10%;
      display: grid;
      place-items: center;
      transform-style: preserve-3d;
      animation: orbFloat 6s ease-in-out infinite;
      pointer-events: none;
    }

    .dual-orb-halo {
      position: absolute;
      inset: -24%;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(120,227,255,.24), rgba(185,120,255,.06) 42%, transparent 70%);
      filter: blur(18px);
      opacity: .9;
      animation: orbPulse var(--orb-pulse-speed) ease-in-out infinite;
      transform: translateZ(-18px);
    }

    .dual-orb-core {
      position: relative;
      width: 42%;
      height: 42%;
      border-radius: 50%;
      transform-style: preserve-3d;
      transform: translateZ(18px);
      background:
        radial-gradient(circle at 28% 26%, rgba(255,255,255,1) 0%, rgba(255,255,255,.45) 10%, rgba(255,255,255,0) 28%),
        radial-gradient(circle at 68% 70%, var(--orb-primary, #78e3ff) 0%, var(--orb-secondary, #b978ff) 68%);
      box-shadow:
        0 0 20px rgba(120,227,255,.7),
        0 0 44px rgba(120,227,255,.32),
        0 0 80px rgba(185,120,255,.12),
        inset -8px -10px 18px rgba(0,0,0,.35),
        inset 8px 8px 16px rgba(255,255,255,.18);
      animation: orbSpin var(--orb-spin-speed) linear infinite;
    }

    .dual-orb-core::before {
      content: "";
      position: absolute;
      inset: -42%;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(255,255,255,.16), transparent 66%);
      filter: blur(10px);
      opacity: .75;
    }

    .dual-orb-core::after {
      content: "";
      position: absolute;
      inset: 12%;
      border-radius: 50%;
      background: radial-gradient(circle at 35% 35%, rgba(255,255,255,.65), transparent 58%);
      opacity: .55;
      mix-blend-mode: screen;
    }

    .dual-orb-wrap.speaking .dual-orb-core {
      animation:
        orbSpin 2s linear infinite,
        orbBreathe .55s ease-in-out infinite alternate;
    }

    .dual-orb-wrap.speaking .dual-orb-halo {
      animation:
        orbPulse .85s ease-in-out infinite;
    }

    .dual-orb-wrap:hover .dual-orb-core {
      box-shadow:
        0 0 20px rgba(120,227,255,.7),
        0 0 42px rgba(120,227,255,.36),
        inset -10px -12px 20px rgba(0,0,0,.34),
        inset 10px 10px 18px rgba(255,255,255,.14);
    }
  `;
  (document.body || document.documentElement).appendChild(style);
}

function makeOrbAvatar(name = 'DUAL', size = 64) {
  injectOrbStyles();

  const safe = String(name || 'DUAL').trim() || 'DUAL';
  const seed = safe.split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  const h1 = seed % 360;
  const h2 = (seed * 37) % 360;
  const uid = Math.random().toString(36).slice(2, 7);
  const gradId = `orb_${seed.toString(36)}_${uid}`;

  return `
    <div
      class="dual-orb-wrap"
      id="${gradId}"
      style="--orb-size:${size}px; --orb-primary:hsl(${h1},100%,62%); --orb-secondary:hsl(${h2},92%,48%);"
      aria-label="${safe}"
      role="img"
    >
      <svg class="dual-orb-svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <defs>
          <radialGradient id="${gradId}_core" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="hsl(${h1},100%,66%)" stop-opacity="1"/>
            <stop offset="55%" stop-color="hsl(${h2},92%,46%)" stop-opacity=".9"/>
            <stop offset="100%" stop-color="hsl(${h2},100%,12%)" stop-opacity="0"/>
          </radialGradient>

          <linearGradient id="${gradId}_ring" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="hsl(${h1},100%,76%)"/>
            <stop offset="100%" stop-color="hsl(${h2},100%,58%)"/>
          </linearGradient>
        </defs>

        <circle cx="50" cy="50" r="46" fill="#05070c"/>
        <circle cx="50" cy="50" r="40" fill="url(#${gradId}_core)" opacity=".28"/>
        <circle cx="50" cy="50" r="38" fill="none" stroke="url(#${gradId}_ring)" stroke-width="1"/>
        <circle cx="50" cy="50" r="46" fill="none" stroke="url(#${gradId}_ring)" stroke-width="2.5"
          stroke-dasharray="70 20 10 30" stroke-linecap="round" opacity=".86"
          style="transform-origin:center;animation:orbSpin 18s linear infinite reverse"/>
        <circle cx="50" cy="50" r="30" fill="none" stroke="url(#${gradId}_ring)" stroke-width="1"
          stroke-dasharray="20 8 5 12" stroke-linecap="round" opacity=".35"
          style="transform-origin:center;animation:orbSpin 9s linear infinite"/>
        <circle cx="50" cy="50" r="8" fill="#ffffff" opacity=".22" filter="blur(2px)"/>
        <circle cx="50" cy="50" r="3" fill="#ffffff" opacity=".85"/>
      </svg>

      <div class="dual-orb-shell">
        <div class="dual-orb-halo"></div>
        <div class="dual-orb-core"></div>
      </div>
    </div>
  `;
}

window.makeOrbAvatar = makeOrbAvatar;
window.makeMiniAvatar = (name) => makeOrbAvatar(name, 24);

window.makeMiniAvatarHTML = window.makeMiniAvatarHTML || function (name, size) { return window.makeOrbAvatar(name || 'DUAL', size || 36); };
