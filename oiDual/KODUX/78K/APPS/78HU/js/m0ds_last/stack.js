/* ===================== Stack ===================== */
    const stackWrap = $('#stackWrap'), dock = $('#dock');
    function badge(item) { const b = document.createElement('button'); b.className = 'badge fx-trans fx-press ring'; b.textContent = item.title || 'App'; b.title = 'Reabrir ' + (item.title || 'App'); const rp = document.createElement('span'); rp.className = 'ripple'; b.appendChild(rp); addRipple(b); b.onclick = () => { const s = document.querySelector('[data-sid="' + item.sid + '"]'); if (s) { s.scrollIntoView({ behavior: 'smooth' }); s.classList.remove('min'); } }; return b }
    function updateDock() {
      dock.innerHTML = '';
      $$('.session').forEach(s => {
        const meta = JSON.parse(s.dataset.meta || '{}');
        dock.appendChild(badge({ title: "", sid: s.dataset.sid }))
      });
      // Atualize o status de sessões na home
      try { updateHomeStatus(); } catch {}
    }
    function openApp(a) {
      // Permite receber um SID externo (para restaurar sessões) ou gera um novo se ausente
      const sid = a.sid || ('s_' + Math.random().toString(36).slice(2));
      const isLocal = String(a.url || '').startsWith('local:'); const lr = isLocal ? getLocal(String(a.url).slice(6)) : null; const url = lr ? blobURL(lr) : a.url;
      const card = document.createElement('div'); card.className = 'session fx-trans fx-lift';
      card.dataset.sid = sid;
      // Armazene metadados de título/url no dataset.meta para persistência
      card.dataset.meta = JSON.stringify({ title: a.title || 'App', url: a.url || '' });
      // Se nenhum grupo foi fornecido, tente atribuir com base no nome após o ponto no título (ex.: "Atlas · Cartesius").
      if (!a.gid && a.title && a.title.includes('·')) {
        const parts = a.title.split('·');
        const gName = (parts[1] || '').trim();
        if (gName) {
          a.gid = 'g_' + gName.toLowerCase().replace(/\s+/g, '_');
        }
      }
      // Se um grupo específico foi fornecido, salve no dataset.gid para persistência
      if (a.gid) card.dataset.gid = a.gid;
      card.innerHTML = `
        <div class="hdr">
          <div class="title"><span class="app-icon">${((a.title || 'App')[0] || 'A')}</span>${(a.title || 'App')}</div>
          <div class="tools">
            <button class="btn ring fx-trans fx-press" data-act="min" title="Minimizar">
              <span style="font-size:16px;line-height:1">&minus;</span>
              <span class="ripple"></span>
            </button>
            <button class="btn ring fx-trans fx-press" data-act="ref" title="Recarregar">
              <span style="font-size:16px;line-height:1">&#8635;</span>
              <span class="ripple"></span>
            </button>
            <button class="btn ring fx-trans fx-press" data-act="full" title="Tela cheia">
              <span style="font-size:16px;line-height:1">⤢</span>
              <span class="ripple"></span>
            </button>
            <!-- Botão para fixar/desafixar na navegação -->
            <button class="btn ring fx-trans fx-press" data-act="pin" title="Fixar na barra">
              <span class="pin-icon" style="font-size:16px;line-height:1">☆</span>
              <span class="ripple"></span>
            </button>
            <!-- Botão para mover entre grupos -->
            <button class="btn ring fx-trans fx-press" data-act="move" title="Mover sessão">
              <span style="font-size:16px;line-height:1">⇄</span>
              <span class="ripple"></span>
            </button>
            <button class="btn ring fx-trans fx-press" data-act="close" title="Fechar">
              <span style="font-size:16px;line-height:1">&times;</span>
              <span class="ripple"></span>
            </button>
          </div>
        </div>
        <iframe src="${url || 'about:blank'}" allow="autoplay; clipboard-read; clipboard-write; picture-in-picture; fullscreen"></iframe>
        <div class="resize-handle" title="Arraste para ajustar a altura"></div>`;
      // Redimensionar altura do iframe arrastando o handle
      (function bindResize(){
        const handle = card.querySelector('.resize-handle');
        const iframe = card.querySelector('iframe');
        if(!handle || !iframe) return;
        let startY = 0, startH = 0, dragging = false;
        handle.addEventListener('pointerdown', (ev) => {
          dragging = true;
          startY = ev.clientY;
          startH = iframe.clientHeight;
          handle.setPointerCapture(ev.pointerId);
        });
        handle.addEventListener('pointermove', (ev) => {
          if(!dragging) return;
          const dy = ev.clientY - startY;
          const h = Math.max(120, startH + dy);
          iframe.style.height = h + 'px';
        });
        const stop = () => { dragging = false; };
        handle.addEventListener('pointerup', stop);
        handle.addEventListener('pointercancel', stop);
      })();
      // Prepend the session card dependendo do modo de abertura. Se "abrir dentro" estiver marcado,
      // insira a sessão no topo da página (sessionsAnchor); caso contrário, use o stackWrap padrão.
      const anchor = document.getElementById('sessionsAnchor');
      if ($('#openInside').checked && anchor) {
        anchor.prepend(card);
      } else {
        // Se houver um grupo selecionado, adicione a sessão dentro desse grupo; caso contrário, insira no stackWrap
        // Escolha o grupo de destino: se houver um grupo selecionado manualmente
        // use-o; caso contrário, utilize o grupo inferido do título (a.gid).
        const gid = window.currentGroupId || a.gid;
        let placed = false;
        if (gid) {
          const grp = stackWrap && stackWrap.querySelector('.stack-group[data-group-id="' + gid + '"] .group-content');
          if (grp) {
            grp.prepend(card);
            card.dataset.gid = gid;
            placed = true;
          }
        }
        if (!placed) {
          stackWrap.prepend(card);
          // Remova qualquer associação de grupo se a sessão não estiver atribuída
          delete card.dataset.gid;
        }
      }
      // Não chamar applyIcons aqui: ícones embutidos manualmente nos botões de sessão
      card.querySelector('[data-act=min]').onclick = () => {
        card.classList.toggle('min');
        updateDock();
        saveStackState();
        dualLog('Sessão minimizada: ' + (a.title || 'App'));
      };
      card.querySelector('[data-act=ref]').onclick = () => { const fr = card.querySelector('iframe'); try { fr.contentWindow.location.reload() } catch { fr.src = fr.src } };
      card.querySelector('[data-act=close]').onclick = () => {
        // Se a sessão estiver fixada, remova-a também da lista de fixados
        if (card.classList.contains('pinned')) {
          removePinnedByMeta(JSON.parse(card.dataset.meta || '{}'));
        }
        card.remove();
        updateDock();
        saveStackState();
        dualLog('Sessão fechada: ' + (a.title || 'App'));
        // Toque som de fechamento de sessão
        try { playCloseSound(); } catch {}
      };
      // Botão tela cheia
      const fullBtn = card.querySelector('[data-act=full]');
      if (fullBtn) {
        fullBtn.onclick = () => {
          card.classList.toggle('full');
          document.body.classList.toggle('session-full');
        };
      }
      // Botão fixar/desafixar
      const pinBtn = card.querySelector('[data-act=pin]');
      if (pinBtn) {
        // Inicialize o estado do botão conforme o dado de entrada
        const meta = JSON.parse(card.dataset.meta || '{}');
        if (a.pinned) {
          card.classList.add('pinned');
          pinBtn.querySelector('.pin-icon').textContent = '★';
        }
        pinBtn.onclick = () => {
          const meta = JSON.parse(card.dataset.meta || '{}');
          if (card.classList.contains('pinned')) {
            // Desafixar
            card.classList.remove('pinned');
            pinBtn.querySelector('.pin-icon').textContent = '☆';
            removePinnedByMeta(meta);
            // Não exiba toast ao desafixar
          } else {
            // Fixar
            card.classList.add('pinned');
            pinBtn.querySelector('.pin-icon').textContent = '★';
            addPinned(meta);
            // Não exiba toast ao fixar
          }
        };
      }
      // Botão mover sessão entre grupos
      const moveBtn = card.querySelector('[data-act=move]');
      if (moveBtn) {
        moveBtn.onclick = () => {
          // Liste os grupos disponíveis com seus nomes
          const groups = Array.from(document.querySelectorAll('#stackWrap .stack-group'));
          if (!groups.length) {
            // Sem grupos: simplesmente remova do grupo atual, se houver
            delete card.dataset.gid;
            stackWrap.prepend(card);
            saveStackState();
            // Não exiba toast ao mover para a raiz
            return;
          }
          const names = groups.map(g => g.querySelector('summary')?.textContent || '').filter(n => n);
          const choices = names.map((n,i) => `${i+1}. ${n}`).join('\n');
          const ans = prompt('Mover para qual grupo?\n' + choices + '\n0. Sem grupo');
          if (ans === null) return;
          const idx = parseInt(ans.trim(), 10);
          if (!isNaN(idx) && idx >= 1 && idx <= groups.length) {
            const targetGroup = groups[idx-1];
            const content = targetGroup.querySelector('.group-content');
            if (content) {
              content.prepend(card);
              card.dataset.gid = targetGroup.getAttribute('data-group-id') || '';
              updateDock();
              saveStackState();
              // Não exiba toast ao mover para um grupo específico
              return;
            }
          }
          // Se o usuário digitou 0 ou algo não válido, mova para a raiz
          delete card.dataset.gid;
          stackWrap.prepend(card);
          updateDock();
          saveStackState();
          // Não exiba toast ao mover para a raiz
        };
      }
      // Não navegue automaticamente para a view Stack na versão estendida.
      // if (!$('#openInside').checked) nav('stack');
      updateDock();
      // Após abrir uma sessão, persista o estado (grupos, sessões e fixados)
      saveStackState();
      // Não exiba toast ao abrir uma nova sessão
      dualLog('Sessão aberta: ' + (a.title || 'App'));
      // Toque som de abertura de app, se definido
      try { playOpenSound(); } catch {}
    }
    $('#btnCloseAll').onclick = () => {
      if (!confirm('Fechar todas as sessões abertas?')) return;
      $$('.session').forEach(s => s.remove());
      updateDock();
      try { saveStackState(); } catch {}
      toast('Todas as sessões fechadas', 'warn');
    };
