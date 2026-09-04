(function(){
      const fallbackArchetypes = [{ id: 'kobllux', name: 'KOBLLUX', voice: 'Luciana', lang: 'pt-BR', rate: 0.98, pitch: 0.48 }];
      window.ARCHETYPES = window.ARCHETYPES || fallbackArchetypes;
      const boot = () => { console.log("[ARCH] Sistema de Arquétipos iniciado"); };
      if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', boot, { once: true }); } else { boot(); }
    })();