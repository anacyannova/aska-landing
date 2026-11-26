document.addEventListener('DOMContentLoaded', () => {

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;


    /* ==========================
        SCROLL SUAVE (con easing)
    ========================== */
    const easeInOutCubic = t => (t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
    let scrollRaf = null;

    const stopSmoothScroll = () => {
        if (scrollRaf) {
            cancelAnimationFrame(scrollRaf);
            scrollRaf = null;
            document.documentElement.style.scrollBehavior = '';
        }
    };

    const smoothScrollTo = (targetY) => {
        const startY = window.scrollY;
        const maxY = document.documentElement.scrollHeight - window.innerHeight;
        const endY = Math.max(0, Math.min(targetY, maxY));
        const distance = endY - startY;

        if (!distance) return;
        if (prefersReducedMotion) {
            window.scrollTo(0, endY);
            return;
        }

        const duration = Math.min(1600, Math.max(800, Math.abs(distance) * 0.6));
        const root = document.documentElement;
        const startTime = performance.now();

        stopSmoothScroll();
        root.style.scrollBehavior = 'auto';

        const step = (now) => {
            const t = Math.min((now - startTime) / duration, 1);
            window.scrollTo(0, startY + distance * easeInOutCubic(t));

            if (t < 1) {
                scrollRaf = requestAnimationFrame(step);
            } else {
                scrollRaf = null;
                root.style.scrollBehavior = '';
            }
        };
        scrollRaf = requestAnimationFrame(step);
    };

    ['wheel', 'touchstart', 'keydown'].forEach(evt =>
        window.addEventListener(evt, stopSmoothScroll, { passive: true })
    );

    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            const id = link.getAttribute('href');
            if (!id || id.length < 2) return;

            const target = document.querySelector(id);
            if (!target) return;

            e.preventDefault();

            const offset = parseFloat(getComputedStyle(target).scrollMarginTop) || 0;
            smoothScrollTo(target.getBoundingClientRect().top + window.scrollY - offset);
            history.pushState(null, '', id);

            const menu = document.getElementById('menu');
            if (menu && menu.classList.contains('show') && window.bootstrap) {
                bootstrap.Collapse.getOrCreateInstance(menu).hide();
            }
        });
    });


    /* ==========================
        NAVBAR: cambia de estilo al hacer scroll
    ========================== */
    const navbar = document.getElementById('mainNav');
    const hero = document.getElementById('inicio');
    const navbarLogo = document.getElementById('navbarLogo');

    const LOGO_LIGHT = 'assets/img/logo-aska-white.svg';
    const LOGO_DARK = 'assets/img/logo-aska-dark.svg';

    let navbarScrolled = null;

    [LOGO_LIGHT, LOGO_DARK].forEach(src => { const img = new Image(); img.src = src; });

    const updateNavbar = () => {
        if (!navbar || !hero || !navbarLogo) return;

        const scrolled = window.scrollY > hero.offsetHeight - navbar.offsetHeight;
        if (scrolled === navbarScrolled) return;

        navbarScrolled = scrolled;
        navbar.classList.toggle('scrolled', scrolled);
        navbarLogo.src = scrolled ? LOGO_DARK : LOGO_LIGHT;
    };


    /* ==========================
        BOTÓN "VOLVER ARRIBA"
    ========================== */
    const scrollTopBtn = document.getElementById('scrollTopBtn');

    const DARK_SECTIONS = '.hero, .proyecto-destacado, .equipo-section';

    const parseColor = (str) => {
        const m = str.match(/rgba?\(([^)]+)\)/);
        if (!m) return null;
        const p = m[1].split(/[,\s/]+/).filter(Boolean).map(Number);
        return { r: p[0], g: p[1], b: p[2], a: p[3] === undefined ? 1 : p[3] };
    };

    const isDarkColor = ({ r, g, b }) =>
        (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255 < 0.5;

    const isDarkBehind = (x, y) => {
        for (const el of document.elementsFromPoint(x, y)) {
            if (scrollTopBtn.contains(el)) continue;
            if (el.matches(DARK_SECTIONS)) return true;

            const color = parseColor(getComputedStyle(el).backgroundColor);
            if (color && color.a > 0.5) return isDarkColor(color);
        }
        return false;
    };

    const updateScrollTopTheme = () => {
        if (!scrollTopBtn) return;

        const rect = scrollTopBtn.getBoundingClientRect();
        const dark = isDarkBehind(rect.left + rect.width / 2, rect.top + rect.height / 2);
        scrollTopBtn.classList.toggle('on-light', !dark);
    };

    if (scrollTopBtn) {
        scrollTopBtn.addEventListener('click', () => smoothScrollTo(0));
    }


    /* ==========================
        Un solo listener de scroll, limitado a 1 vez por frame
    ========================== */
    let ticking = false;
    const onScroll = () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
            updateNavbar();
            updateScrollTopTheme();
            ticking = false;
        });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    window.addEventListener('load', onScroll);
    onScroll();


    /* ==========================
        PROCESO: se expande al hacer hover (desktop) / click (touch)
    ========================== */
    const procesosTrack = document.getElementById('procesosTrack');

    if (procesosTrack) {
        const cards = procesosTrack.querySelectorAll('.procesos-card');
        const defaultIndex = 1;
        const hasHover = window.matchMedia('(hover: hover)').matches;

        const activate = (card) => {
            if (card.classList.contains('active')) return;
            cards.forEach(c => c.classList.remove('active'));
            card.classList.add('active');
        };

        if (hasHover) {
            let enterTimer = null;
            let leaveTimer = null;

            cards.forEach(card => {
                card.addEventListener('mouseenter', () => {
                    clearTimeout(leaveTimer);
                    clearTimeout(enterTimer);
                    enterTimer = setTimeout(() => activate(card), 120);
                });
                card.addEventListener('mouseleave', () => clearTimeout(enterTimer));
            });

            procesosTrack.addEventListener('mouseleave', () => {
                clearTimeout(enterTimer);
                leaveTimer = setTimeout(() => activate(cards[defaultIndex]), 300);
            });
        } else {
            cards.forEach(card => {
                card.addEventListener('click', () => {
                    if (card.classList.contains('active')) return;
                    activate(card);
                    card.scrollIntoView({ behavior: 'smooth', inline: 'nearest', block: 'nearest' });
                });
            });
        }
    }


    /* ==========================
        SERVICIOS: lista + panel de detalle
    ========================== */
    const serviciosList = document.getElementById('serviciosList');

    if (serviciosList) {
        const items = serviciosList.querySelectorAll('.servicios-item');
        const panel = document.querySelector('.servicios-panel');
        const tituloEl = document.getElementById('servicioTitulo');
        const descEl = document.getElementById('servicioDesc');
        const numEl = document.getElementById('servicioActualNum');
        let panelTimer = null;

        const isMobileOrTablet = () => window.matchMedia('(max-width: 991.98px)').matches;

        const writePanel = (item) => {
            tituloEl.textContent = item.dataset.title;
            descEl.textContent = item.dataset.desc;
            numEl.textContent = String(Number(item.dataset.index) + 1).padStart(2, '0');
        };

        const updatePanel = (item) => {
            if (!panel || prefersReducedMotion) {
                writePanel(item);
                return;
            }
            clearTimeout(panelTimer);
            panel.classList.add('is-changing');
            panelTimer = setTimeout(() => {
                writePanel(item);
                panel.classList.remove('is-changing');
            }, 300);
        };

        items.forEach(item => {
            const header = item.querySelector('.servicios-item-header');

            header.addEventListener('click', () => {
                const yaActivo = item.classList.contains('active');

                if (yaActivo) {
                    if (isMobileOrTablet()) item.classList.remove('active');
                    return;
                }

                items.forEach(i => i.classList.remove('active'));
                item.classList.add('active');
                updatePanel(item);
            });
        });
    }


    /* ==========================
        PROYECTO DESTACADO: Swiper
    ========================== */
    const proyectoSwiperEl = document.querySelector('.proyecto-swiper');

    if (proyectoSwiperEl) {
        new Swiper(proyectoSwiperEl, {
            slidesPerView: 4,
            spaceBetween: 24,
            speed: 900,
            grabCursor: true,
            resistanceRatio: 0.6,
            scrollbar: {
                el: '.proyecto-scrollbar',
                draggable: true,
                hide: false,
            },
            breakpoints: {
                0: { slidesPerView: 1.3 },
                768: { slidesPerView: 2.2 },
                992: { slidesPerView: 4 },
            },
        });
    }


    /* ==========================
        EQUIPO
    ========================== */
    const row = document.getElementById('teamRow');
    const section = document.querySelector('.equipo-section');
    const teamBack = document.getElementById('teamBack');

    if (row && section) {
        const isMobile = () => window.innerWidth <= 767;
        const logo = section.querySelector('.equipo-logo');

        const EASE_FLUID = 'cubic-bezier(.32, .72, 0, 1)';
        const DURATION = 900;
        let isAnimating = false;

        [...row.children].forEach((col, i) => { col.dataset.order = i; });

        const reorder = (firstCol) => {
            const ordered = [...row.children].sort((a, b) => a.dataset.order - b.dataset.order);
            const list = firstCol ? [firstCol, ...ordered.filter(c => c !== firstCol)] : ordered;
            list.forEach(c => row.appendChild(c));
        };

        const pageRect = (el) => {
            const r = el.getBoundingClientRect();
            return {
                left: r.left + window.scrollX,
                top: r.top + window.scrollY,
                width: r.width,
                height: r.height
            };
        };

        const flipImage = (el, from) => {
            const to = pageRect(el);
            if (!from || !to.width || !to.height) return null;

            const scale = Math.max(from.width / to.width, from.height / to.height);
            const dx = (from.left + from.width / 2) - (to.left + to.width / 2);
            const dy = (from.top + from.height / 2) - (to.top + to.height / 2);
            const insetX = Math.max(0, (to.width - from.width / scale) / 2);
            const insetY = Math.max(0, (to.height - from.height / scale) / 2);

            return el.animate(
                [
                    {
                        transform: `translate(${dx}px, ${dy}px) scale(${scale})`,
                        clipPath: `inset(${insetY}px ${insetX}px ${insetY}px ${insetX}px)`
                    },
                    {
                        transform: 'translate(0, 0) scale(1)',
                        clipPath: 'inset(0px 0px 0px 0px)'
                    }
                ],
                { duration: DURATION, easing: EASE_FLUID }
            );
        };

        const flipText = (el, from) => {
            const to = pageRect(el);
            if (!from) return null;

            const dx = from.left - to.left;
            const dy = from.top - to.top;
            if (!dx && !dy) return null;

            return el.animate(
                [
                    { transform: `translate(${dx}px, ${dy}px)` },
                    { transform: 'translate(0, 0)' }
                ],
                { duration: DURATION, easing: EASE_FLUID }
            );
        };

        const isShown = (el) => el.offsetParent !== null;

        const changeLayout = async (mutate) => {
            if (isAnimating) return;

            if (prefersReducedMotion || !row.animate) {
                mutate();
                return;
            }

            isAnimating = true;

            try {
                const images = [...row.querySelectorAll('.team-image')];
                const texts = [...row.querySelectorAll('.team-card-text')];

                const imageBefore = new Map(images.map(el => [el, pageRect(el)]));
                const textBefore = new Map(texts.map(el => [el, pageRect(el)]));
                const heightBefore = row.offsetHeight;

                const oldExtras = [...row.querySelectorAll('.desc, .meta')].filter(isShown);
                const fadeOuts = oldExtras.map(el => el.animate(
                    [{ opacity: 1 }, { opacity: 0 }],
                    { duration: 160, easing: 'ease-out', fill: 'forwards' }
                ));
                if (fadeOuts.length) await Promise.all(fadeOuts.map(a => a.finished));

                mutate();
                fadeOuts.forEach(a => a.cancel());
                const heightAfter = row.offsetHeight;

                const animations = [];

                images.forEach(el => animations.push(flipImage(el, imageBefore.get(el))));
                texts.forEach(el => animations.push(flipText(el, textBefore.get(el))));

                row.querySelectorAll('.desc, .meta').forEach(el => {
                    if (!isShown(el)) return;
                    animations.push(el.animate(
                        [{ opacity: 0 }, { opacity: 1 }],
                        { duration: 600, delay: 300, easing: 'ease-out', fill: 'backwards' }
                    ));
                });

                if (heightBefore !== heightAfter) {
                    animations.push(row.animate(
                        [{ height: `${heightBefore}px` }, { height: `${heightAfter}px` }],
                        { duration: DURATION, easing: EASE_FLUID }
                    ));
                }

                await Promise.all(animations.filter(Boolean).map(a => a.finished));
            } catch (err) {
            } finally {
                isAnimating = false;
            }
        };

        const openMember = (col) => changeLayout(() => {
            reorder(col);
            row.classList.add('is-active');
            section.classList.add('team-active');
        });

        const closeTeam = () => changeLayout(() => {
            reorder(null);
            row.classList.remove('is-active');
            section.classList.remove('team-active');
        });

        row.querySelectorAll('.team-card').forEach(card => {
            card.addEventListener('click', () => {
                if (isMobile()) return;

                const col = card.closest('[class*="col-"]');
                const isActiveCard = row.classList.contains('is-active') && row.firstElementChild === col;

                if (isActiveCard) {
                    closeTeam();
                } else {
                    openMember(col);
                }
            });
        });

        if (teamBack) {
            teamBack.addEventListener('click', closeTeam);
        }

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && row.classList.contains('is-active')) closeTeam();
        });

        let wasMobile = isMobile();
        window.addEventListener('resize', () => {
            const nowMobile = isMobile();
            if (nowMobile !== wasMobile) {
                wasMobile = nowMobile;
                if (nowMobile && row.classList.contains('is-active')) {
                    closeTeam();
                }
            }
        });
    }

});