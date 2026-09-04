(function(){
        const APP_CARDS = [
            {
                id: 'dopamina',
                title: "A Fórmula da Dopamina",
                tag: "INFODOSE · EDIÇÃO",
                desc: "Uma experiência visual para explorar comportamento, prazer, recompensa e os mecanismos da dopamina.",
                image: "https://infodose.com.br/fotos/A_formula_da_dopamina_sexy-CAPA.jpg"
            },
            {
                id: 'espaco',
                title: "O Espaço da Mente",
                tag: "NEBULA READER",
                desc: "Entre em um espaço de leitura pensado para transformar textos em uma experiência imersiva.",
                image: "https://infodose.com.br/fotos/O_espaco_da_mente-CAPA.jpg"
            },
            {
                id: 'eco',
                title: "Eco Urbano",
                tag: "CONCEITO · VISUAL",
                desc: "Descubra como metrópoles estão integrando o verde selvagem em meio ao concreto para o futuro da humanidade.",
                image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d880?q=80&w=1200&auto=format&fit=crop"
            },
            {
                id: 'neon',
                title: "Neon Distópico",
                tag: "EXPERIÊNCIA · 3D",
                desc: "Acelere através do tempo em luzes saturadas e ruelas chuvosas onde a tecnologia encontra a tradição.",
                image: "https://www.infodose.com.br/fotos/A_formula_da_dopamina_sexy-uCAPA.jpg"
            }
        ];
        window.__NEBULA_APP_CARDS = APP_CARDS;

        // Responsividade para tamanho da pílula baseada na largura da tela
        const getPillWidth = () => window.innerWidth >= 700 ? 170 : 140;
        let ITEM_WIDTH = getPillWidth();
        const ITEM_GAP = 24;
        let TOTAL_ADVANCE = ITEM_WIDTH + ITEM_GAP;
        let MAX_SCROLL = -((APP_CARDS.length - 1) * TOTAL_ADVANCE);

        const SLICES_CONFIG = [
            { clip: 'inset(0 80% 0 0%)', speedDir: -1.2 },
            { clip: 'inset(0 60% 0 20%)', speedDir: 0.8 },
            { clip: 'inset(0 40% 0 40%)', speedDir: -1.5 },
            { clip: 'inset(0 20% 0 60%)', speedDir: 1.0 },
            { clip: 'inset(0 0% 0 80%)', speedDir: -0.7 }
        ];

        const physics = { x: 0, targetX: 0, velocity: 0, lastX: 0, isDragging: false, startX: 0, startPointerX: 0, nearestIndex: 0 };
        let activeIndex = -1;

        const container = document.getElementById('pCarouselContainer');
        const track = document.getElementById('pCarouselTrack');
        const bgContainer = document.getElementById('parallaxBgContainer');
        
        const pTag = document.getElementById('pHeroTag');
        const pTitle = document.getElementById('pHeroTitle');
        const pDesc = document.getElementById('pHeroDesc');
        const pBtn = document.getElementById('pHeroBtn');

        let cardElements = []; let bgElements = [];

        function initParallax() {
            // Setup Backgrounds & Pills
            APP_CARDS.forEach(card => {
                const bg = document.createElement('div'); bg.className = 'bg-slide'; bg.style.backgroundImage = `url(${card.image})`;
                bgContainer.appendChild(bg); bgElements.push(bg);

                const pillCard = document.createElement('div'); pillCard.className = 'pill-card';
                const pillInner = document.createElement('div'); pillInner.className = 'pill-inner';

                const baseImg = document.createElement('div'); baseImg.className = 'base-image'; baseImg.style.backgroundImage = `url(${card.image})`;
                pillInner.appendChild(baseImg);

                SLICES_CONFIG.forEach(slice => {
                    const sliceImg = document.createElement('div'); sliceImg.className = 'slice-image';
                    sliceImg.style.backgroundImage = `url(${card.image})`; sliceImg.style.clipPath = slice.clip;
                    pillInner.appendChild(sliceImg);
                });

                const glass = document.createElement('div'); glass.className = 'pill-glass';
                const glyph = document.createElement('div'); glyph.className = 'pill-glyph'; glyph.textContent = '✧';
                
                pillInner.appendChild(glass); pillInner.appendChild(glyph); pillCard.appendChild(pillInner);
                track.appendChild(pillCard); cardElements.push(pillCard);
            });

            // Center Track Alignment Calculation
            const updateContainerCenter = () => {
                ITEM_WIDTH = getPillWidth(); TOTAL_ADVANCE = ITEM_WIDTH + ITEM_GAP; MAX_SCROLL = -((APP_CARDS.length - 1) * TOTAL_ADVANCE);
                const isDesktop = window.innerWidth >= 700;
                // No desktop, centraliza com base no 55% de largura; no mobile 100% de largura
                const parentWidth = isDesktop ? container.offsetWidth : window.innerWidth;
                const centerOffset = parentWidth / 2 - (ITEM_WIDTH / 2);
                container.style.left = isDesktop ? 'auto' : '0';
                container.style.paddingLeft = `${centerOffset}px`; // Usa padding para empurrar a track para o centro
            };
            
            updateContainerCenter();
            window.addEventListener('resize', updateContainerCenter);

            // Events
            container.addEventListener('pointerdown', handlePointerDown);
            window.addEventListener('pointermove', handlePointerMove);
            window.addEventListener('pointerup', handlePointerUp);
            window.addEventListener('pointercancel', handlePointerUp);

            pBtn.addEventListener('click', () => { openApp(APP_CARDS[activeIndex].title); });

            updateActiveIndex(0);
            requestAnimationFrame(loop);
        }

        function updateActiveIndex(index) {
            if (activeIndex === index) return;
            activeIndex = index;

            bgElements.forEach((bg, i) => bg.classList.toggle('active', i === activeIndex));
            cardElements.forEach((card, i) => { const glyph = card.querySelector('.pill-glyph'); glyph.textContent = (i === activeIndex) ? '✦' : '✧'; });

            pTag.classList.remove('animate-slide-up'); pTitle.classList.remove('animate-slide-up'); pDesc.classList.remove('animate-fade-in'); pBtn.classList.remove('animate-fade-in');
            void pTag.offsetWidth; // Reflow

            pTag.textContent = APP_CARDS[activeIndex].tag;
            pTitle.textContent = APP_CARDS[activeIndex].title;
            pDesc.textContent = APP_CARDS[activeIndex].desc;

            pTag.classList.add('animate-slide-up'); pTitle.classList.add('animate-slide-up'); pDesc.classList.add('animate-fade-in'); pBtn.classList.add('animate-fade-in');
        }

        function handlePointerDown(e) {
            physics.isDragging = true;
            physics.startPointerX = e.clientX || (e.touches && e.touches[0].clientX);
            physics.startX = physics.x; physics.targetX = physics.x;
        }

        function handlePointerMove(e) {
            if (!physics.isDragging) return;
            const currentX = e.clientX || (e.touches && e.touches[0].clientX);
            const deltaX = currentX - physics.startPointerX;
            
            // Só previne scroll nativo da página se estiver arrastando a pílula horizontalmente
            if(Math.abs(deltaX) > 5) { e.preventDefault(); }

            let newTargetX = physics.startX + (deltaX * 1.5);
            if (newTargetX > 0) newTargetX *= 0.3; else if (newTargetX < MAX_SCROLL) newTargetX = MAX_SCROLL + (newTargetX - MAX_SCROLL) * 0.3;
            physics.targetX = newTargetX;
        }

        function handlePointerUp() {
            if (!physics.isDragging) return;
            physics.isDragging = false;
            const momentum = physics.velocity * 10;
            let index = Math.round(-(physics.targetX + momentum) / TOTAL_ADVANCE);
            index = Math.max(0, Math.min(index, APP_CARDS.length - 1));
            physics.targetX = -index * TOTAL_ADVANCE;
        }

        function loop() {
            const p = physics;
            p.x += (p.targetX - p.x) * 0.1;
            p.velocity = p.x - p.lastX; p.lastX = p.x;

            const absV = Math.abs(p.velocity);
            const scaleX = Math.max(0.75, 1 - (absV * 0.005)); const scaleY = Math.min(1.10, 1 + (absV * 0.003));

            const currentNearest = Math.max(0, Math.min(APP_CARDS.length - 1, Math.round(-p.x / TOTAL_ADVANCE)));
            if (currentNearest !== p.nearestIndex) { p.nearestIndex = currentNearest; updateActiveIndex(currentNearest); }

            track.style.transform = `translateX(${p.x}px)`;

            cardElements.forEach((card, i) => {
                card.style.transform = `scale(${scaleX}, ${scaleY})`;
                const globalPos = p.x + (i * TOTAL_ADVANCE); const parallaxFactor = globalPos * -0.4;

                const baseBg = card.querySelector('.base-image');
                if (baseBg) baseBg.style.backgroundPosition = `calc(50% + ${parallaxFactor}px) 50%`;

                const slices = card.querySelectorAll('.slice-image');
                slices.forEach((slice, sIdx) => {
                    const config = SLICES_CONFIG[sIdx]; const shiftY = p.velocity * config.speedDir * 1.2;
                    slice.style.backgroundPosition = `calc(50% + ${parallaxFactor}px) 50%`;
                    slice.style.transform = `translateY(${shiftY}px)`;
                    slice.style.opacity = Math.min(1, absV * 0.08);
                    slice.style.filter = `hue-rotate(${absV * config.speedDir * 1.5}deg) brightness(1.2)`;
                });
            });
            requestAnimationFrame(loop);
        }

        window.addEventListener('DOMContentLoaded', initParallax);
    })();