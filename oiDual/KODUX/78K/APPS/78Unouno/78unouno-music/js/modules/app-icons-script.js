// Inline SVG icon registry + auto-attach for known apps and local uploads (with de-dupe & cleanup)
(function(){
  const ICONS = {
    artemis: `<svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 3l3.5 6 6 3.5-6 3.5L12 21l-3.5-5.9L2 12.5 8.5 9 12 3z"></path>
                <circle cx="12" cy="12" r="2.2"></circle>
              </svg>`,
    naviga:  `<svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 2l3 9 7 3-7 3-3 7-3-7-7-3 7-3 3-9z"></path>
              </svg>`,
    atlas:   `<svg viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="12" cy="12" r="8"></circle>
                <path d="M4 12h16M12 4v16"></path>
              </svg>`,
    nova:    `<svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 2v6M12 16v6M2 12h6M16 12h6M4.5 4.5l4.2 4.2M15.3 15.3l4.2 4.2M4.5 19.5l4.2-4.2M15.3 8.7l4.2-4.2"></path>
              </svg>`,
    serena:  `<svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M4 12a8 8 0 0016 0c0-3.9-3.6-7-8-7s-8 3.1-8 7z"></path>
                <path d="M8 12a4 4 0 008 0"></path>
              </svg>`,
    kaion:   `<svg viewBox="0 0 24 24" aria-hidden="true">
                <rect x="5" y="5" width="14" height="14" rx="3"></rect>
                <path d="M9 9l6 6M15 9l-6 6"></path>
              </svg>`,
    manifesta:`<svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M4 12l4 4 12-12"></path>
                <rect x="3" y="3" width="18" height="18" rx="4" fill="none"></rect>
              </svg>`,
    _default:`<svg viewBox="0 0 24 24" aria-hidden="true">
                <rect x="4" y="4" width="16" height="16" rx="4"></rect>
                <path d="M8 8h8v8H8z" fill="none"></path>
              </svg>`
  };

  function chooseBadge(name){
    const n = (name||'').toLowerCase();
    if (n.includes('nova')) return 'badge-pink';
    if (n.includes('naviga')) return 'badge-blue';
    if (n.includes('artemis')) return 'badge-orange';
    if (n.includes('atlas')) return 'badge-blue';
    if (n.includes('kaion')) return 'badge-green';
    if (n.includes('serena')) return 'badge-pink';
    if (n.includes('manifesta') || n.includes('manifest a')) return 'badge-green';
    return 'badge-default';
  }
  function getIcon(name){
    if (!name) return ICONS._default;
    const key = name.toLowerCase();
    if (ICONS[key]) return ICONS[key];
    if (key === 'manifest a' || key === 'manifesta' || key === 'manifesta a') return ICONS.manifesta;
    return ICONS._default;
  }

  // Remove fallback "?" badges/icons commonly used by templates
  function cleanupFallbacks(el){
    // Heuristic: elements that look like icon/badge and textContent is exactly "?"
    el.querySelectorAll('.icon, .badge, .avatar, [data-icon], [aria-label*="icon"], [aria-label*="ícone"]').forEach(node=>{
      const t = (node.textContent||'').trim();
      // remove only if it's a simple question mark or a single-char fallback
      if (t === '?' || t.length === 1) {
        node.remove();
      }
    });
    // Remove duplicated .app-icon (keep the first)
    const icons = el.querySelectorAll('.app-icon');
    if (icons.length > 1){
      for (let i=1;i<icons.length;i++) icons[i].remove();
    }
  }

  function ensureIconFor(item){
    const { el, title } = item;
    if (!el) return;
    // If already has one of OUR icons, bail
    if (el.querySelector('.app-icon[data-kdx="icon"]')) return;

    // If it has an .app-icon de outro lugar: preferimos substituir se for vazio/fallback
    const existing = el.querySelector('.app-icon');
    if (existing){
      // If existing contains an SVG, assume it's valid and do not duplicate
      if (existing.querySelector('svg')) return;
      // else, replace contents
      existing.setAttribute('data-kdx','icon');
      existing.classList.add(chooseBadge(title));
      existing.innerHTML = getIcon(title);
      cleanupFallbacks(el);
      return;
    }

    // Otherwise, remove fallback '?' badges and inject ours
    cleanupFallbacks(el);

    const wrap = document.createElement('span');
    wrap.className = 'app-icon ' + chooseBadge(title);
    wrap.setAttribute('data-kdx','icon');
    wrap.innerHTML = getIcon(title);

    const anchor = el.querySelector('.title, .app-title, [data-title], .label, .name, h3, h4, b, strong, span');
    if (anchor && anchor.parentNode === el){
      anchor.before(wrap);
    } else if (anchor && anchor.parentNode){
      anchor.parentNode.insertBefore(wrap, anchor);
    } else {
      el.insertBefore(wrap, el.firstChild);
    }
  }

  function findAppItems(){
    const candidates = [];
    document.querySelectorAll('.app-item, .app-card, .menuItem').forEach(el => {
      const id = el.getAttribute('data-app-id') || el.getAttribute('data-id') || '';
      const titleEl = el.querySelector('[data-title], .title, .app-title, .label, .name, h3, h4, b, strong');
      const title = (titleEl?.textContent || id || el.getAttribute('data-name') || '').trim();
      candidates.push({ el, title });
    });
    document.querySelectorAll('[data-app], [data-app-name], a.app, button.app').forEach(el=>{
      const title = el.getAttribute('data-app-name') || el.getAttribute('data-app') || el.textContent.trim();
      candidates.push({ el, title });
    });
    return candidates;
  }

  function pass(){
    const items = findAppItems();
    items.forEach(ensureIconFor);
  }
  pass();

  const obs = new MutationObserver((muts)=>{
    let need=false;
    for (const m of muts){
      if (m.addedNodes && m.addedNodes.length) { need = true; break; }
    }
    if (need) setTimeout(pass, 60);
  });
  obs.observe(document.body, { childList:true, subtree:true });

  window.__appIcons = { refresh: pass };
})();