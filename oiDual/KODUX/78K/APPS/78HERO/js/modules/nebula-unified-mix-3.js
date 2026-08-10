// ═══════════════════════════════════════════════════════════════════
// KBLX: NEBULA PRO — MOTOR UNIFICADO (v2.1 – CORRIGIDO)
// ═══════════════════════════════════════════════════════════════════

(function(){
    "use strict";

    // ───────────────────────────────────────────────────────────────
    // INJETA CSS ADICIONAL (botões compactos, modal, etc.)
    // ───────────────────────────────────────────────────────────────
    function injectExtraStyles() {
        if (document.getElementById('nebula-extra-styles')) return;
        const style = document.createElement('style');
        style.id = 'nebula-extra-styles';
        style.textContent = `
            /* Botões de ação compactos */
            .card-actions {
                display: flex;
                gap: 2px;
                align-items: center;
                flex-shrink: 0;
            }
            .card-actions .btn-icon {
                background: rgba(255,255,255,0.06);
                border: none;
                border-radius: 6px;
                padding: 2px 6px;
                font-size: 12px;
                cursor: pointer;
                transition: background 0.15s;
                line-height: 1.4;
                color: #ddd;
            }
            .card-actions .btn-icon:hover {
                background: rgba(255,255,255,0.15);
            }
            .card-actions .btn-icon.danger {
                color: #ff6b6b;
            }
            .card-actions .btn-icon.danger:hover {
                background: rgba(255,70,70,0.2);
            }

            /* Modal de edição */
            .inline-editor-overlay {
                position: fixed;
                top: 0; left: 0; right: 0; bottom: 0;
                background: rgba(0,0,0,0.5);
                backdrop-filter: blur(4px);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 9999;
                padding: 20px;
            }
            .inline-editor-modal {
                background: #1e1e24;
                border-radius: 16px;
                padding: 24px;
                max-width: 600px;
                width: 100%;
                box-shadow: 0 20px 60px rgba(0,0,0,0.6);
                max-height: 80vh;
                display: flex;
                flex-direction: column;
                color: #e8e8ef;
                border: 1px solid rgba(255,255,255,0.08);
            }
            .inline-editor-modal h3 {
                margin: 0 0 12px 0;
                font-size: 18px;
            }
            .inline-editor-modal textarea {
                width: 100%;
                min-height: 200px;
                padding: 12px;
                font-family: monospace;
                font-size: 13px;
                border: 1px solid rgba(255,255,255,0.12);
                border-radius: 10px;
                resize: vertical;
                background: #0b0b0e;
                color: #e8e8ef;
                flex: 1;
            }
            .inline-editor-modal .actions {
                display: flex;
                gap: 10px;
                justify-content: flex-end;
                margin-top: 14px;
            }
            .inline-editor-modal .actions button {
                padding: 8px 20px;
                border: none;
                border-radius: 10px;
                cursor: pointer;
                font-weight: 600;
                font-size: 14px;
            }
            .inline-editor-modal .actions .save {
                background: #6C4CE0;
                color: #fff;
            }
            .inline-editor-modal .actions .cancel {
                background: #333;
                color: #ccc;
            }
            .inline-editor-modal .actions .save:hover {
                background: #7b5cf0;
            }
            .inline-editor-modal .actions .cancel:hover {
                background: #444;
            }

            /* Ajustes no carrossel para não quebrar */
            .carousel, .hero-carousel {
                display: flex;
                gap: 12px;
                overflow-x: auto;
                scroll-snap-type: x mandatory;
                padding: 8px 2px 12px;
                scrollbar-width: thin;
            }
            .slide, .hero-card {
                flex: 0 0 220px;
                scroll-snap-align: start;
                background: rgba(255,255,255,0.05);
                border-radius: 14px;
                overflow: hidden;
                display: flex;
                flex-direction: column;
                gap: 6px;
                padding: 8px;
                transition: all 0.2s;
                min-height: 180px;
            }
            .hero-card {
                flex: 0 0 100%;
                background: rgba(255,255,255,0.06);
                border-radius: 16px;
                padding: 0;
                min-height: auto;
                margin-right: 12px;
            }
            .hero-card-preview {
                padding: 8px;
            }
            .hero-card-info {
                padding: 8px 12px 12px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                gap: 6px;
                flex-wrap: wrap;
            }
            .card-info-text {
                flex: 1;
                min-width: 0;
            }
            .card-info-text h4 {
                margin: 0;
                font-size: 14px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
            .card-info-text p {
                margin: 0;
                font-size: 10px;
                color: #888;
            }
            .file-preview {
                flex: 1;
                min-height: 60px;
                display: flex;
                align-items: center;
                justify-content: center;
                background: rgba(0,0,0,0.2);
                border-radius: 8px;
                overflow: hidden;
                position: relative;
            }
            .file-preview .type-badge {
                position: absolute;
                top: 6px;
                left: 6px;
                background: rgba(0,0,0,0.6);
                color: #fff;
                padding: 2px 8px;
                border-radius: 12px;
                font-size: 9px;
                font-weight: 600;
                letter-spacing: 0.5px;
                backdrop-filter: blur(4px);
            }
            .file-preview .preview-placeholder {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                color: #666;
                font-size: 28px;
                padding: 12px;
                text-align: center;
            }
            .file-preview .preview-placeholder p {
                margin: 6px 0 0 0;
                font-size: 11px;
                font-weight: 600;
            }
            .file-preview .preview-text {
                padding: 10px;
                font-size: 12px;
                color: #ccc;
                overflow: hidden;
                max-height: 120px;
            }
            .file-preview .preview-markdown {
                padding: 10px;
                font-size: 12px;
                color: #ccc;
                overflow: hidden;
                max-height: 120px;
            }
            .file-preview .preview-markdown h1, .file-preview .preview-markdown h2, .file-preview .preview-markdown h3 {
                margin: 4px 0;
                font-size: 14px;
            }
            .file-preview .preview-markdown p {
                margin: 4px 0;
            }
            .close-preview-btn {
                position: absolute;
                top: 6px;
                right: 6px;
                background: rgba(0,0,0,0.5);
                border: none;
                color: #fff;
                border-radius: 50%;
                width: 24px;
                height: 24px;
                font-size: 14px;
                cursor: pointer;
                z-index: 2;
            }
        `;
        document.head.appendChild(style);
    }

    // Chama a injeção assim que o script carregar
    injectExtraStyles();

    // ───────────────────────────────────────────────────────────────
    // FUNÇÕES AUXILIARES (botões, edição, cópia)
    // ───────────────────────────────────────────────────────────────

    function createActionButtons(item, cardElement) {
        const container = document.createElement('div');
        container.className = 'card-actions';

        const btnConfigs = [
            { icon: '🔊', title: 'Ouvir', action: 'listen' },
            { icon: '📋', title: 'Copiar', action: 'copy' },
            { icon: '✏️', title: 'Editar', action: 'edit' },
            { icon: '🗑️', title: 'Apagar', action: 'delete' },
            { icon: '→', title: 'Abrir', action: 'open' },
        ];

        btnConfigs.forEach(cfg => {
            const btn = document.createElement('button');
            btn.className = 'btn-icon';
            if (cfg.action === 'delete') btn.classList.add('danger');
            btn.textContent = cfg.icon;
            btn.title = cfg.title;

            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                switch (cfg.action) {
                    case 'listen':
                        if (window.NebulaPlayer && typeof window.NebulaPlayer.loadExternalItem === 'function') {
                            window.NebulaPlayer.loadExternalItem(item);
                            if (typeof window.NebulaPlayer.togglePlay === 'function') {
                                window.NebulaPlayer.togglePlay();
                            } else if (typeof window.NebulaPlayer.play === 'function') {
                                window.NebulaPlayer.play();
                            }
                        } else {
                            speakDocument(item, btn);
                        }
                        break;
                    case 'copy':
                        copyContent(item);
                        break;
                    case 'edit':
                        openInlineEditor(item);
                        break;
                    case 'delete':
                        removeDocument(item);
                        break;
                    case 'open':
                        openReader(item);
                        break;
                }
            });

            container.appendChild(btn);
        });

        return container;
    }

    function openInlineEditor(item) {
        // Remove overlay existente
        const existing = document.querySelector('.inline-editor-overlay');
        if (existing) existing.remove();

        const overlay = document.createElement('div');
        overlay.className = 'inline-editor-overlay';

        const modal = document.createElement('div');
        modal.className = 'inline-editor-modal';

        const title = document.createElement('h3');
        title.textContent = `✏️ Editando: ${item.name}`;

        const textarea = document.createElement('textarea');
        textarea.value = item.content || '';

        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'actions';

        const saveBtn = document.createElement('button');
        saveBtn.className = 'save';
        saveBtn.textContent = '💾 Salvar';

        const cancelBtn = document.createElement('button');
        cancelBtn.className = 'cancel';
        cancelBtn.textContent = 'Cancelar';

        saveBtn.addEventListener('click', async () => {
            const newContent = textarea.value;
            item.content = newContent;

            try {
                if (item.source === 'localStorage') {
                    localStorage.setItem(item.rawKey || item.name, newContent);
                } else {
                    await saveFileToDB(item);
                    const idx = library.findIndex(d => d.id === item.id);
                    if (idx !== -1) library[idx].content = newContent;
                }
                overlay.remove();
                refreshAll();
            } catch (err) {
                console.error('Erro ao salvar:', err);
                alert('Falha ao salvar. Veja o console.');
            }
        });

        cancelBtn.addEventListener('click', () => overlay.remove());

        actionsDiv.appendChild(saveBtn);
        actionsDiv.appendChild(cancelBtn);

        modal.appendChild(title);
        modal.appendChild(textarea);
        modal.appendChild(actionsDiv);
        overlay.appendChild(modal);

        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) overlay.remove();
        });

        document.body.appendChild(overlay);
        textarea.focus();
    }

    function copyContent(doc) {
        const text = doc.content || '';
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(() => {
                alert('Conteúdo copiado!');
            }).catch(() => fallbackCopy(text));
        } else {
            fallbackCopy(text);
        }
    }

    function fallbackCopy(text) {
        const ta = document.createElement('textarea');
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        try {
            document.execCommand('copy');
            alert('Conteúdo copiado!');
        } catch (e) {
            alert('Não foi possível copiar.');
        }
        document.body.removeChild(ta);
    }

    // ───────────────────────────────────────────────────────────────
    // RENDER HERO (refinado, sem modos)
    // ───────────────────────────────────────────────────────────────
    function renderHero() {
        if (!heroCarousel) return;
        heroCarousel.innerHTML = "";
        heroDots.innerHTML = "";

        const items = getFilteredHeroItems();
        heroTitleLabel.textContent = `Inteligência · ${NEBULA_UI_STATE.activeGroup.toUpperCase()}`;

        if (!items.length) {
            heroCarousel.innerHTML = `<div class="hero-card" style="width:100%;"><div style="padding:30px;text-align:center;"><h2>Nenhum item</h2><p style="color:var(--muted);">Adicione arquivos.</p></div></div>`;
            return;
        }

        if (NEBULA_UI_STATE.heroIndex >= items.length) NEBULA_UI_STATE.heroIndex = 0;

        items.forEach((item, index) => {
            const card = document.createElement('article');
            card.className = 'hero-card';

            const preview = document.createElement('div');
            preview.className = 'hero-card-preview';
            preview.innerHTML = createPreview(item);

            const info = document.createElement('div');
            info.className = 'hero-card-info';

            const textDiv = document.createElement('div');
            textDiv.className = 'card-info-text';
            textDiv.innerHTML = `
                <h4>${escapeHTML(item.name)}</h4>
                <p>${(TYPE_LABELS[item.type] || item.type).toUpperCase()} · ${item.size || 'arquivo'}</p>
            `;

            const actions = createActionButtons(item, card);

            info.appendChild(textDiv);
            info.appendChild(actions);

            card.appendChild(preview);
            card.appendChild(info);

            heroCarousel.appendChild(card);

            const dot = document.createElement('div');
            dot.className = 'hero-dot' + (index === NEBULA_UI_STATE.heroIndex ? ' active' : '');
            dot.addEventListener('click', (e) => {
                e.stopPropagation();
                NEBULA_UI_STATE.heroIndex = index;
                saveUIState();
                scrollToHeroSlide(index);
            });
            heroDots.appendChild(dot);
        });

        setTimeout(() => scrollToHeroSlide(NEBULA_UI_STATE.heroIndex, false), 50);
    }

    // ───────────────────────────────────────────────────────────────
    // RENDER BIBLIOTECA (refinado, sem modos)
    // ───────────────────────────────────────────────────────────────
    function renderLibrary(filter = "") {
        carousel.innerHTML = "";
        const normalized = filter.toLowerCase().trim();
        const items = currentDocs.filter(item => item.name.toLowerCase().includes(normalized));

        if (!items.length) {
            carousel.innerHTML = `<div class="empty">Nenhum documento encontrado.</div>`;
            dots.innerHTML = "";
            return;
        }

        // Remove classes de modo (apenas carrossel padrão)
        carousel.className = 'carousel';
        carousel.style.cssText = '';

        items.forEach((item) => {
            const slide = document.createElement('article');
            slide.className = 'slide';

            const previewDiv = document.createElement('div');
            previewDiv.className = 'file-preview';
            previewDiv.innerHTML = createPreview(item);

            const info = document.createElement('div');
            info.className = 'card-info';
            info.style.cssText = 'display:flex; justify-content:space-between; align-items:center; gap:6px; padding:4px 8px 8px;';

            const textDiv = document.createElement('div');
            textDiv.className = 'card-info-text';
            textDiv.innerHTML = `
                <h4>${escapeHTML(item.name)}</h4>
                <p>${(TYPE_LABELS[item.type] || item.type).toUpperCase()} · ${item.size || ''}</p>
            `;

            const actions = createActionButtons(item, slide);

            info.appendChild(textDiv);
            info.appendChild(actions);

            slide.appendChild(previewDiv);
            slide.appendChild(info);

            // Long-press compact mode (mantido)
            let pressTimer = null;
            const startPress = () => { pressTimer = setTimeout(() => carousel.classList.add('compact-mode'), 450); };
            const cancelPress = () => clearTimeout(pressTimer);
            slide.addEventListener('touchstart', startPress, { passive: true });
            slide.addEventListener('touchend', cancelPress);
            slide.addEventListener('touchmove', cancelPress);
            slide.addEventListener('mousedown', startPress);
            slide.addEventListener('mouseup', cancelPress);
            slide.addEventListener('mouseleave', cancelPress);

            carousel.appendChild(slide);
        });

        renderDots();
    }

    // ───────────────────────────────────────────────────────────────
    // MANTÉM O RESTO DO CÓDIGO ORIGINAL (NebulaSW, Player, DevPanel, etc.)
    // ───────────────────────────────────────────────────────────────
    // NOTA: As funções abaixo já devem existir no seu arquivo.
    // Se estiver substituindo tudo, copie o restante do arquivo original
    // a partir daqui, ou mantenha seu arquivo intacto e apenas substitua
    // as funções renderHero, renderLibrary, createActionButtons, openInlineEditor, copyContent.

    // ... (aqui vai o restante do código original, que não foi alterado)

})();