document.addEventListener('DOMContentLoaded', () => {

    /* ==========================
       NAVBAR: cambia de estilo al hacer scroll
    ========================== */

    const navbar = document.getElementById('mainNav');
    const hero = document.getElementById('inicio');

    if (navbar && hero) {
        const toggleNavbar = () => {
            const heroHeight = hero.offsetHeight;
            if (window.scrollY > heroHeight - navbar.offsetHeight) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
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

            // En mobile/tablet: click sobre el item abierto -> se cierra (acordeón)
            if (isMobileOrTablet() && yaActivo) {
                item.classList.remove('active');
                return;
            }

            items.forEach(i => i.classList.remove('active'));
            item.classList.add('active');

            // El panel de desktop solo tiene sentido actualizarlo ahí,
            // pero no molesta dejarlo siempre sincronizado
            tituloEl.textContent = item.dataset.title;
            descEl.textContent = item.dataset.desc;
            numEl.textContent = String(Number(item.dataset.index) + 1).padStart(2, '0');
        });
    });
}

    /* ==========================
       PROYECTO DESTACADO: carrusel + barra de progreso
    ========================== */

    const proyectoTrack = document.getElementById('proyectoTrack');
    const proyectoPrev = document.getElementById('proyectoPrev');
    const proyectoNext = document.getElementById('proyectoNext');
    const proyectoProgressBar = document.getElementById('proyectoProgressBar');

    if (proyectoTrack && proyectoProgressBar) {

        const updateProgress = () => {
            const maxScroll = proyectoTrack.scrollWidth - proyectoTrack.clientWidth;
            const progress = maxScroll > 0 ? (proyectoTrack.scrollLeft / maxScroll) * 100 : 0;
            proyectoProgressBar.style.width = `${Math.max(10, progress)}%`;
        };

        const scrollByCard = (direction) => {
            const card = proyectoTrack.querySelector('.project-image');
            if (!card) return;
            const gap = 24;
            const distance = card.offsetWidth + gap;
            proyectoTrack.scrollBy({ left: direction * distance, behavior: 'smooth' });
        };

        proyectoPrev?.addEventListener('click', () => scrollByCard(-1));
        proyectoNext?.addEventListener('click', () => scrollByCard(1));
        proyectoTrack.addEventListener('scroll', updateProgress);

        updateProgress();
    }

});
 /* ==========================
       SOBRE NOSOTRAS
    ========================== */
document.addEventListener('DOMContentLoaded', () => {
  const row = document.getElementById('teamRow');
  const section = document.querySelector('.equipo-section');
  if (!row) return;

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
});