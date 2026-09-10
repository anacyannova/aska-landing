document.addEventListener('DOMContentLoaded', () => {

    /* ==========================
       NAVBAR: cambia de estilo al hacer scroll
    ========================== */
    const navbar = document.getElementById('mainNav');
    const hero = document.getElementById('inicio');
    const navbarLogo = document.getElementById('navbarLogo');

    if (navbar && hero && navbarLogo) {

        const toggleNavbar = () => {
            const heroHeight = hero.offsetHeight;

            if (window.scrollY > heroHeight - navbar.offsetHeight) {
                navbar.classList.add('scrolled');
                navbarLogo.src = 'assets/img/logo-aska-dark.svg';
            } else {
                navbar.classList.remove('scrolled');
                navbarLogo.src = 'assets/img/logo-aska-white.svg';
            }
        };

        toggleNavbar();
        window.addEventListener('scroll', toggleNavbar);
    }


    /* ==========================
       BOTÓN "VOLVER ARRIBA" DEL HERO
    ========================== */
    const scrollTopBtn = document.getElementById('scrollTopBtn');

    if (scrollTopBtn) {
        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }


    /* ==========================
       PROCESO: se expande al hacer hover
    ========================== */
    const procesosTrack = document.getElementById('procesosTrack');

    if (procesosTrack) {
        const cards = procesosTrack.querySelectorAll('.procesos-card');
        const defaultIndex = 1; // "02 Proponer" queda activo por defecto

        cards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                cards.forEach(c => c.classList.remove('active'));
                card.classList.add('active');
            });
        });

        procesosTrack.addEventListener('mouseleave', () => {
            cards.forEach(c => c.classList.remove('active'));
            cards[defaultIndex].classList.add('active');
        });
    }


    /* ==========================
       SERVICIOS: lista + panel de detalle
    ========================== */
    const serviciosList = document.getElementById('serviciosList');

    if (serviciosList) {
        const items = serviciosList.querySelectorAll('.servicios-item');
        const tituloEl = document.getElementById('servicioTitulo');
        const descEl = document.getElementById('servicioDesc');
        const numEl = document.getElementById('servicioActualNum');

        const isMobileOrTablet = () => window.matchMedia('(max-width: 991.98px)').matches;

        items.forEach(item => {
            const header = item.querySelector('.servicios-item-header');

            header.addEventListener('click', () => {
                const yaActivo = item.classList.contains('active');

                if (isMobileOrTablet() && yaActivo) {
                    item.classList.remove('active');
                    return;
                }

                items.forEach(i => i.classList.remove('active'));
                item.classList.add('active');

                tituloEl.textContent = item.dataset.title;
                descEl.textContent = item.dataset.desc;
                numEl.textContent = String(Number(item.dataset.index) + 1).padStart(2, '0');
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
        scrollbar: {
            el: '.proyecto-scrollbar',
            draggable: true,
            hide: false, // importante: si no queda como único control, no debe ocultarse tras inactividad
        },
        breakpoints: {
            0: { slidesPerView: 1.3 },
            768: { slidesPerView: 2.2 },
            992: { slidesPerView: 4 },
        },
    });
}
    /* ==========================
       SOBRE NOSOTRAS
    ========================== */
    const row = document.getElementById('teamRow');
    const section = document.querySelector('.equipo-section');

    if (row) {
        const isMobile = () => window.innerWidth <= 767;

        row.querySelectorAll('.team-card').forEach(card => {
            card.addEventListener('click', () => {
                if (isMobile()) return; // en mobile es solo slider, no expande

                const col = card.closest('[class*="col-"]');
                const isCurrentlyFirst = row.firstElementChild === col;

                if (isCurrentlyFirst && row.classList.contains('is-active')) {
                    row.classList.remove('is-active');
                    section.classList.remove('team-active');
                    return;
                }

                row.prepend(col);
                row.classList.add('is-active');
                section.classList.add('team-active');
            });
        });
    }

});