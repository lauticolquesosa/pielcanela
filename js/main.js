/* =========================================================
   Piel Canela — Spa & Bronceo
   Site interactivity (vanilla JS, no dependencies).
   ========================================================= */
(function () {
  'use strict';

  /* ---------- Inline hover effects (data-hover="css") ---------- */
  // Each element keeps its base inline style; on hover we merge in the
  // declarations from data-hover, and restore the original on leave.
  document.querySelectorAll('[data-hover]').forEach(function (el) {
    var base = el.getAttribute('style') || '';
    var hover = el.getAttribute('data-hover');
    el.addEventListener('mouseenter', function () { el.setAttribute('style', base + ';' + hover); });
    el.addEventListener('mouseleave', function () { el.setAttribute('style', base); });
  });

  /* ---------- Mobile navigation ---------- */
  var burger = document.getElementById('nav-burger');
  var drawer = document.getElementById('nav-drawer');
  if (burger && drawer) {
    burger.addEventListener('click', function () {
      var open = drawer.style.display === 'flex';
      drawer.style.display = open ? 'none' : 'flex';
    });
    drawer.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { drawer.style.display = 'none'; });
    });
  }

  /* ---------- Header style on scroll ---------- */
  var header = document.getElementById('site-header');
  function onScroll() {
    if (!header) return;
    if (window.scrollY > 40) {
      header.style.background = 'rgba(255,248,244,.92)';
      header.style.backdropFilter = 'blur(12px)';
      header.style.boxShadow = '0 4px 24px rgba(43,30,38,.07)';
    } else {
      header.style.background = 'rgba(255,248,244,0)';
      header.style.backdropFilter = 'blur(2px)';
      header.style.boxShadow = 'none';
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Scroll reveal ----------
     Elements start hidden (via CSS) and are revealed when they enter the
     viewport. A safety fallback guarantees everything becomes visible even
     in non-scrolling contexts (page-capture tools, reduced motion, or if an
     observer never fires) so decorative animation can never hide content. */
  var revealEls = document.querySelectorAll('[data-reveal]');
  var clipEls   = document.querySelectorAll('[data-clip]');

  function revealAll() {
    revealEls.forEach(function (el) { el.classList.add('reveal-in'); });
    clipEls.forEach(function (el) { el.classList.add('clip-in'); });
  }

  var supportsIO = 'IntersectionObserver' in window;
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!supportsIO || reduceMotion) {
    revealAll();
  } else {
    var revealObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('reveal-in'); revealObs.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

    revealEls.forEach(function (el) {
      var parent = el.parentElement;
      var sibs = parent ? Array.prototype.filter.call(parent.children, function (c) {
        return c.hasAttribute && c.hasAttribute('data-reveal');
      }) : [el];
      var idx = Math.max(0, sibs.indexOf(el));
      el.style.transitionDelay = (idx * 0.09) + 's';
      revealObs.observe(el);
    });

    var clipObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('clip-in'); clipObs.unobserve(e.target); }
      });
    }, { threshold: 0.18, rootMargin: '0px 0px -40px 0px' });
    clipEls.forEach(function (el) { clipObs.observe(el); });

    // Safety net: reveal anything still hidden ~3s after load (covers
    // fast-scroll capture tools and any missed intersection callbacks).
    window.addEventListener('load', function () { setTimeout(revealAll, 3000); });
  }

  /* ---------- Cursor spotlight on service cards ---------- */
  document.querySelectorAll('.pc-servcard').forEach(function (card) {
    card.addEventListener('mousemove', function (ev) {
      var r = card.getBoundingClientRect();
      card.style.setProperty('--mx', (ev.clientX - r.left) + 'px');
      card.style.setProperty('--my', (ev.clientY - r.top) + 'px');
    });
  });

  /* ---------- Testimonials carousel ---------- */
  var testimonials = [
    { quote: 'Salí con un bronceado espectacular y súper uniforme. El lugar es divino, todo rosa y muy limpio. ¡Ya soy clienta fija!', name: 'Valentina R.', role: 'Bronceado en terraza' },
    { quote: 'La marcación brasileña me encantó, se nota natural y me duró muchísimo. Dalia y su equipo son lo máximo, te tratan como una reina.', name: 'Daniela M.', role: 'Marcación brasileña' },
    { quote: 'La mejor experiencia de spa en Bucaramanga. Reservé por WhatsApp en segundos y me atendieron increíble. 100% recomendado.', name: 'Carolina P.', role: 'Cabina' },
    { quote: 'Llevo más de un año viniendo y siempre quedo feliz. El color es perfecto para mi piel y el ambiente es una nota. ¡Las amo!', name: 'Laura G.', role: 'Bronceado en terraza' }
  ];

  var quoteEl = document.getElementById('t-quote');
  var nameEl  = document.getElementById('t-name');
  var roleEl  = document.getElementById('t-role');
  var dotsEl  = document.getElementById('t-dots');
  var current = 0;
  var timer;

  function renderTestimonial() {
    var t = testimonials[current];
    if (quoteEl) quoteEl.textContent = t.quote;
    if (nameEl)  nameEl.textContent = t.name;
    if (roleEl)  roleEl.textContent = t.role;
    renderDots();
  }

  function renderDots() {
    if (!dotsEl) return;
    dotsEl.innerHTML = '';
    testimonials.forEach(function (_, i) {
      var d = document.createElement('button');
      d.setAttribute('aria-label', 'Testimonio ' + (i + 1));
      var active = i === current;
      d.style.cssText = 'width:' + (active ? '26px' : '9px') +
        ';height:9px;border-radius:100px;border:none;cursor:pointer;background:' +
        (active ? '#E91E8C' : '#F4B8D6') + ';transition:all .3s ease;padding:0;';
      d.addEventListener('click', function () { current = i; renderTestimonial(); restartTimer(); });
      dotsEl.appendChild(d);
    });
  }

  function go(step) { current = (current + step + testimonials.length) % testimonials.length; renderTestimonial(); }
  function restartTimer() {
    clearInterval(timer);
    timer = setInterval(function () { go(1); }, 5500);
  }

  var prevBtn = document.getElementById('t-prev');
  var nextBtn = document.getElementById('t-next');
  if (prevBtn) prevBtn.addEventListener('click', function () { go(-1); restartTimer(); });
  if (nextBtn) nextBtn.addEventListener('click', function () { go(1); restartTimer(); });
  if (quoteEl) { renderTestimonial(); restartTimer(); }

  /* ---------- Gallery lightbox ---------- */
  var lightbox    = document.getElementById('lightbox');
  var lightboxImg = document.getElementById('lightbox-img');

  function openLightbox(src) {
    if (!lightbox || !lightboxImg) return;
    lightboxImg.src = src;
    lightbox.style.display = 'flex';
  }
  function closeLightbox() {
    if (lightbox) lightbox.style.display = 'none';
  }

  document.querySelectorAll('.pc-galitem').forEach(function (item) {
    item.addEventListener('click', function () { openLightbox(item.getAttribute('data-full')); });
  });
  if (lightbox) {
    lightbox.addEventListener('click', closeLightbox);
    document.addEventListener('keydown', function (ev) { if (ev.key === 'Escape') closeLightbox(); });
  }
})();
