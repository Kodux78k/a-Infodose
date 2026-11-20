(function(bundle, s='body') {
  const p = new DOMParser();
  const c = p.parseFromString(bundle, 'text/html');
  const t = document.querySelector(s) || document.body;

  Array.from(c.querySelectorAll('style')).forEach(style => {
    const n = document.createElement('style');
    n.textContent = style.textContent;
    document.head.appendChild(n);
  });

  const f = document.createDocumentFragment();
  Array.from(c.body.childNodes).forEach(node => {
    if (node.nodeName !== 'SCRIPT') {
      f.appendChild(document.importNode(node, true));
    }
  });
  t.appendChild(f);

  Array.from(c.querySelectorAll('script')).forEach(x => {
    const n = document.createElement('script');
    for (const a of x.attributes) n.setAttribute(a.name, a.value);
    n.textContent = x.textContent;
    document.body.appendChild(n);
  });
})(`<script>
/* ═══════════════════════════════════════════════════════
   DUAL MONOLITH · THEME (NIGHT / DAY / SUNSET) + HEADER
═══════════════════════════════════════════════════════ */
(() => {
  "use strict";

  const ROOT = document.documentElement;
  const BODY = document.body;
  const HEADER = document.getElementById("main-header");
  const MAIN = document.getElementById("main-content");
  const THEME_DOT = document.getElementById("theme-dot");
  const META_COLOR = document.getElementById("metaThemeColor");

  /* ═══════════════════════════════════════════════════════
     THEME ENGINE · 3 MODOS (night → day → sunset)
  ═══════════════════════════════════════════════════════ */
  const STORAGE_KEY = "dual-theme";
  const DI_STORAGE_KEY = "di_themeMode"; // Padrão DI_
  const MODES = ["night", "day", "sunset"];

  const THEME_META = {
    night: {
      label: "Noite (Night)",
      metaColor: "#0b1020",
      emoji: "🌙",
      svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px;"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>'
    },
    day: {
      label: "Dia (Day)",
      metaColor: "#d0e9ff",
      emoji: "☀️",
      svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px;"><circle cx="12" cy="12" r="5"></circle><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"></path></svg>'
    },
    sunset: {
      label: "Pôr do Sol (Sunset)",
      metaColor: "#fb923c",
      emoji: "🌅",
      svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px;"><path d="M17 18a5 5 0 0 0-10 0"></path><line x1="12" y1="9" x2="12" y2="2"></line><line x1="4.22" y1="10.22" x2="5.64" y2="11.64"></line><line x1="1" y1="18" x2="3" y2="18"></line><line x1="21" y1="18" x2="23" y2="18"></line><line x1="18.36" y1="11.64" x2="19.78" y2="10.22"></line><line x1="23" y1="22" x2="1" y2="22"></line><polyline points="16 5 12 9 8 5"></polyline></svg>'
    }
  };

  function normalizeTheme(theme) {
    if (theme === "light") return "day";
    if (theme === "dark") return "night";
    return MODES.includes(theme) ? theme : "night";
  }

  function applyTheme(theme) {
    const nextTheme = normalizeTheme(theme);
    const meta = THEME_META[nextTheme];

    // Sincroniza <html> e <body> (compatível com KxTsK e iFSw)
    ROOT.dataset.theme = nextTheme;
    if (BODY) BODY.dataset.mode = nextTheme;

    // Atualiza barra de status mobile
    if (META_COLOR) {
      META_COLOR.setAttribute("content", meta.metaColor);
    }

    // Atualiza ícone e tooltip da bolinha
    if (THEME_DOT) {
      THEME_DOT.innerHTML = meta.svg;
      THEME_DOT.setAttribute("title", "Tema: " + meta.label + " (toque para alternar)");
      THEME_DOT.setAttribute("aria-label", "Tema atual: " + meta.label);
    }

    try {
      localStorage.setItem(STORAGE_KEY, nextTheme);
      localStorage.setItem(DI_STORAGE_KEY, nextTheme);
    } catch (error) {
      console.warn("DUAL Theme · localStorage indisponível");
    }

    // Propaga tema para iframes conectados via KOB BUS
    if (window.KOBBus && typeof window.KOBBus.broadcastTheme === "function") {
      window.KOBBus.broadcastTheme(nextTheme);
    }

    // Evento global para módulos internos e externos
    window.dispatchEvent(
      new CustomEvent("dual:theme-change", {
        detail: {
          theme: nextTheme,
          mode: nextTheme,
          meta
        }
      })
    );
  }

  function getInitialTheme() {
    try {
      const saved =
        localStorage.getItem(DI_STORAGE_KEY) ||
        localStorage.getItem(STORAGE_KEY);
      if (saved) return normalizeTheme(saved);
    } catch (error) {}
    return "night";
  }

  /* ═══════════════════════════════════════════════════════
     API GLOBAL
  ═══════════════════════════════════════════════════════ */
  window.DualTheme = {
    modes: MODES,
    set(theme) {
      applyTheme(theme);
    },
    toggle() {
      const current = normalizeTheme(ROOT.dataset.theme);
      const nextIndex = (MODES.indexOf(current) + 1) % MODES.length;
      applyTheme(MODES[nextIndex]);
    },
    get() {
      return normalizeTheme(ROOT.dataset.theme);
    }
  };

  /* ═══════════════════════════════════════════════════════
     BOLINHA DE TEMA
  ═══════════════════════════════════════════════════════ */
  if (THEME_DOT) {
    THEME_DOT.addEventListener("click", event => {
      event.stopPropagation();
      DualTheme.toggle();
    });
  }

  /* ═══════════════════════════════════════════════════════
     HEADER → COLLAPSE DO MAIN
  ═══════════════════════════════════════════════════════ */
  if (HEADER && MAIN) {
    HEADER.addEventListener("click", event => {
      if (event.target.closest("#theme-dot, #theme-dot2, .top-actions, .uni-actions, .navbar")) {
        return;
      }
      MAIN.classList.toggle("hidden");
      const collapsed = MAIN.classList.contains("hidden");
      HEADER.classList.toggle("is-collapsed", collapsed);

      window.dispatchEvent(
        new CustomEvent("dual:content-collapse", {
          detail: { collapsed }
        })
      );
    });
  }

  /* ═══════════════════════════════════════════════════════
     SMART HEADER (SCROLL DOWN → ESCONDE | SCROLL UP → MOSTRA)
  ═══════════════════════════════════════════════════════ */
  let lastScrollY = window.scrollY;
  let ticking = false;
  const SCROLL_THRESHOLD = 8;

  function updateHeader() {
    if (!HEADER) return;
    const currentScrollY = window.scrollY;
    if (currentScrollY <= 10) {
      HEADER.classList.remove("header-hidden");
      HEADER.classList.add("header-visible");
      lastScrollY = currentScrollY;
      ticking = false;
      return;
    }
    if (currentScrollY > lastScrollY + SCROLL_THRESHOLD) {
      HEADER.classList.remove("header-visible");
      HEADER.classList.add("header-hidden");
    } else if (currentScrollY < lastScrollY - SCROLL_THRESHOLD) {
      HEADER.classList.remove("header-hidden");
      HEADER.classList.add("header-visible");
    }
    lastScrollY = currentScrollY;
    ticking = false;
  }

  window.addEventListener("scroll", () => {
    if (!ticking) {
      window.requestAnimationFrame(updateHeader);
      ticking = true;
    }
  }, { passive: true });

  /* ═══════════════════════════════════════════════════════
     INICIALIZAÇÃO
  ═══════════════════════════════════════════════════════ */
  applyTheme(getInitialTheme());
  console.log("DUAL · GLOBAL SYSTEM READY [NIGHT · DAY · SUNSET]");
})();
<\/script>

<!-- PONTE DE TEMA (garante sincronia com botões externos) -->
<script>
  (function () {
    var canonBtn = document.getElementById('theme-dot');
    var themeToggleBtn = document.getElementById('themeToggle');
    if (!canonBtn) return;

    document.addEventListener('click', function (e) {
      var trigger = e.target.closest('.theme-dot');
      if (trigger && trigger !== canonBtn) canonBtn.click();
    });

    if (themeToggleBtn) {
      themeToggleBtn.addEventListener('click', function () {
        canonBtn.click();
      });

      var icons = { night: '🌙', day: '☀️', sunset: '🌅' };
      var syncIcon = function () {
        var t = document.documentElement.getAttribute('data-theme') || 'night';
        themeToggleBtn.textContent = icons[t] || '🌙';
      };

      syncIcon();
      new MutationObserver(syncIcon).observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['data-theme']
      });
    }
  })();
<\/script>`);