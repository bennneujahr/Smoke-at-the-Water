/* ==============================================
   SMOKE AT THE WATER – main.js
   A) Navigation: Hamburger + Scroll Shadow
   B) Scroll Animations: IntersectionObserver
   C) Lightbox: Gallery + Menu Cards
   D) Maps 2-Klick-Opt-In (DSGVO)
   ============================================== */

'use strict';

/* ── A) NAVIGATION ── */
(function initNav() {
  var header    = document.querySelector('.site-header');
  var hamburger = document.getElementById('hamburger');
  var navMenu   = document.getElementById('nav-menu');

  if (!header || !hamburger || !navMenu) return;

  function openNav() {
    header.classList.add('nav--open');
    hamburger.setAttribute('aria-expanded', 'true');
    hamburger.setAttribute('aria-label', 'Menü schließen');
  }

  function closeNav() {
    header.classList.remove('nav--open');
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.setAttribute('aria-label', 'Menü öffnen');
  }

  hamburger.addEventListener('click', function () {
    if (header.classList.contains('nav--open')) {
      closeNav();
    } else {
      openNav();
    }
  });

  /* Close when any nav link is clicked */
  navMenu.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', closeNav);
  });

  /* Close when clicking outside the header */
  document.addEventListener('click', function (e) {
    if (header.classList.contains('nav--open') && !header.contains(e.target)) {
      closeNav();
    }
  });

  /* Close on ESC */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && header.classList.contains('nav--open')) {
      closeNav();
      hamburger.focus();
    }
  });

  /* Scroll shadow */
  window.addEventListener('scroll', function () {
    header.classList.toggle('scrolled', window.scrollY > 8);
  }, { passive: true });
})();


/* ── B) SCROLL ANIMATIONS ── */
(function initScrollReveal() {
  /* Skip if user prefers reduced motion */
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  /* Skip if browser doesn't support IntersectionObserver */
  if (!('IntersectionObserver' in window)) return;

  var elements = document.querySelectorAll('.reveal');
  if (!elements.length) return;

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -40px 0px'
  });

  elements.forEach(function (el) {
    observer.observe(el);
  });
})();


/* ── C) LIGHTBOX ── */
(function initLightbox() {
  var lightbox   = document.getElementById('lightbox');
  if (!lightbox) return;

  var imgEl      = lightbox.querySelector('.lightbox__img');
  var closeBtn   = lightbox.querySelector('.lightbox__close');
  var overlay    = lightbox.querySelector('.lightbox__overlay');
  var prevFocus  = null;

  function open(src, alt) {
    imgEl.src = src;
    imgEl.alt = alt || 'Vergrößerte Bildansicht';
    lightbox.hidden = false;
    prevFocus = document.activeElement;
    document.body.style.overflow = 'hidden';
    /* Wait one frame so the element is visible before focusing */
    requestAnimationFrame(function () {
      closeBtn.focus();
    });
  }

  function close() {
    lightbox.hidden = true;
    imgEl.src = '';
    document.body.style.overflow = '';
    if (prevFocus) prevFocus.focus();
  }

  /* Attach to all .gallery-item and .menu-card elements */
  function attachTriggers() {
    document.querySelectorAll('.gallery-item, .menu-card').forEach(function (item) {
      /* Make focusable for keyboard users */
      if (!item.hasAttribute('tabindex')) {
        item.setAttribute('tabindex', '0');
      }
      item.setAttribute('role', 'button');

      item.addEventListener('click', function () {
        var img = item.querySelector('img');
        if (img) open(img.src, img.alt);
      });

      item.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          var img = item.querySelector('img');
          if (img) open(img.src, img.alt);
        }
      });
    });
  }

  attachTriggers();

  /* Close handlers */
  closeBtn.addEventListener('click', close);
  overlay.addEventListener('click', close);

  document.addEventListener('keydown', function (e) {
    if (lightbox.hidden) return;

    if (e.key === 'Escape') {
      close();
      return;
    }
    /* Focus trap: keep Tab inside lightbox */
    if (e.key === 'Tab') {
      e.preventDefault();
      closeBtn.focus();
    }
  });
})();


/* ── D) GOOGLE MAPS OPT-IN (2-Klick-Lösung) ── */
(function initMapsOptIn() {
  var placeholder = document.getElementById('maps-optin');
  var loadBtn     = document.getElementById('load-maps-btn');

  if (!placeholder || !loadBtn) return;

  loadBtn.addEventListener('click', function () {
    var src = placeholder.getAttribute('data-map-src');
    if (!src) return;

    var iframe = document.createElement('iframe');
    iframe.src = src;
    iframe.title = 'Smoke at the Water auf Google Maps';
    iframe.setAttribute('allowfullscreen', '');
    iframe.setAttribute('loading', 'lazy');
    iframe.setAttribute('referrerpolicy', 'no-referrer-when-downgrade');

    var wrapper = placeholder.parentNode;
    wrapper.replaceChild(iframe, placeholder);
  });
})();
