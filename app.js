/* ════════════════════════════════════════════════════════
   XAVI-ORTIZ.TECH — Vanilla JS Engine
   SPA Navigation, Animations, Ticker, Clock, Form
   ════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  // ── DOM REFERENCES ───────────────────────────────────
  const navLinks = document.querySelectorAll('[data-nav]');
  const pages = document.querySelectorAll('.page');
  const transition = document.getElementById('page-transition');
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-links');
  const ticker = document.getElementById('ticker');
  const clock = document.getElementById('live-clock');
  const contactForm = document.getElementById('contact-form');
  const skillFills = document.querySelectorAll('.skill-fill');

  let currentPage = 'home';
  let isTransitioning = false;

  // ── SPA NAVIGATION ──────────────────────────────────
  function navigateTo(target) {
    if (target === currentPage || isTransitioning) return;
    isTransitioning = true;

    // Transition: enter (cover)
    transition.classList.remove('active-exit');
    transition.classList.add('active-enter');

    setTimeout(() => {
      // Hide all pages
      pages.forEach(p => {
        p.classList.remove('active');
        removeAnimations(p);
      });

      // Show target page
      const targetPage = document.getElementById('page-' + target);
      if (targetPage) {
        targetPage.classList.add('active');
        applyAnimations(targetPage);
        window.scrollTo({ top: 0, behavior: 'instant' });
      }

      // Update nav active state
      document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
      document.querySelectorAll(`.nav-link[data-nav="${target}"]`).forEach(l => l.classList.add('active'));

      currentPage = target;

      // Animate skill bars if on arsenal page
      if (target === 'arsenal') {
        animateSkillBars();
      }

      // Transition: exit (reveal)
      transition.classList.remove('active-enter');
      transition.classList.add('active-exit');

      setTimeout(() => {
        transition.classList.remove('active-exit');
        isTransitioning = false;
      }, 400);

    }, 400);
  }

  // Bind navigation clicks
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = link.getAttribute('data-nav');
      navigateTo(target);

      // Close mobile menu
      if (navMenu.classList.contains('open')) {
        navMenu.classList.remove('open');
        navToggle.classList.remove('open');
      }
    });
  });

  // ── MOBILE TOGGLE ───────────────────────────────────
  if (navToggle) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('open');
      navMenu.classList.toggle('open');
    });
  }

  // ── ENTRANCE ANIMATIONS ─────────────────────────────
  function applyAnimations(page) {
    const elements = page.querySelectorAll(
      '.section-header, .cv-block, .edu-card, .project-card, .arsenal-block, .contact-form-wrap, .contact-links-wrap, .bento-card, .hero'
    );
    elements.forEach((el, i) => {
      el.classList.add('animate-in');
      el.style.animationDelay = `${0.08 * (i + 1)}s`;
    });
  }

  function removeAnimations(page) {
    const elements = page.querySelectorAll('.animate-in');
    elements.forEach(el => {
      el.classList.remove('animate-in');
      el.style.animationDelay = '';
    });
  }

  // Apply initial animation for home page
  applyAnimations(document.getElementById('page-home'));

  // ── SKILL BAR ANIMATION ─────────────────────────────
  function animateSkillBars() {
    skillFills.forEach(fill => {
      fill.style.width = '0';
      setTimeout(() => {
        fill.style.width = fill.getAttribute('data-width') + '%';
      }, 200);
    });
  }

  // ── LIVE CLOCK ──────────────────────────────────────
  function updateClock() {
    const now = new Date();
    const h = String(now.getHours()).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    const s = String(now.getSeconds()).padStart(2, '0');
    if (clock) {
      clock.textContent = `${h}:${m}:${s} UTC+1`;
    }
  }
  updateClock();
  setInterval(updateClock, 1000);

  // ── TICKER DUPLICATION ──────────────────────────────
  // Duplicate ticker content for seamless loop
  if (ticker) {
    ticker.innerHTML += ticker.innerHTML;
  }

  // ── CONTACT FORM ────────────────────────────────────
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const submitBtn = document.getElementById('form-submit');
      const originalText = submitBtn.innerHTML;

      submitBtn.innerHTML = '<span class="mono">TRANSMITIENDO...</span>';
      submitBtn.disabled = true;

      // Simulate form submission (replace with real endpoint)
      setTimeout(() => {
        submitBtn.innerHTML = '<span class="mono">✓ MENSAJE TRANSMITIDO</span>';
        submitBtn.style.background = 'var(--white)';
        submitBtn.style.color = 'var(--black)';

        setTimeout(() => {
          submitBtn.innerHTML = originalText;
          submitBtn.disabled = false;
          submitBtn.style.background = '';
          submitBtn.style.color = '';
          contactForm.reset();
        }, 2500);
      }, 1500);
    });
  }

  // ── GLITCH MICRO-EFFECT ON HOVER (Title Elements) ──
  document.querySelectorAll('.glitch-text').forEach(el => {
    el.addEventListener('mouseenter', () => {
      el.style.animation = 'none';
      void el.offsetHeight; // Trigger reflow
      el.classList.add('glitch-hover');

      setTimeout(() => {
        el.classList.remove('glitch-hover');
      }, 600);
    });
  });

  // ── KEYBOARD NAVIGATION ─────────────────────────────
  document.addEventListener('keydown', (e) => {
    const pageKeys = {
      '1': 'home',
      '2': 'cv',
      '3': 'projects',
      '4': 'arsenal',
      '5': 'contact'
    };

    if (pageKeys[e.key] && !e.ctrlKey && !e.altKey && !e.metaKey) {
      // Only navigate if not typing in a form field
      const tag = document.activeElement.tagName.toLowerCase();
      if (tag !== 'input' && tag !== 'textarea') {
        navigateTo(pageKeys[e.key]);
      }
    }
  });

  // ── INTERSECTION OBSERVER for scroll-based animations ──
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe elements inside active page for scroll-triggered animations
  function observeScrollElements() {
    const activePage = document.querySelector('.page.active');
    if (!activePage) return;

    const targets = activePage.querySelectorAll(
      '.project-card, .cert-card, .skill-item, .timeline-item'
    );
    targets.forEach(t => observer.observe(t));
  }

  // Re-observe on navigation
  const originalNavigate = navigateTo;
  // Already handled in applyAnimations

  // Initial observe
  observeScrollElements();

  // ── CONSOLE EASTER EGG ──────────────────────────────
  console.log(
    '%c ██████████████████████████████████████████ ',
    'background: #000; color: #fff; font-size: 14px; font-family: monospace;'
  );
  console.log(
    '%c  XAVI-ORTIZ.TECH // SYSTEM INITIALIZED  ',
    'background: #000; color: #fff; font-size: 14px; font-family: monospace;'
  );
  console.log(
    '%c ██████████████████████████████████████████ ',
    'background: #000; color: #fff; font-size: 14px; font-family: monospace;'
  );
  console.log(
    '%c > Keyboard shortcuts: Press 1-5 to navigate sections',
    'color: #000; font-family: monospace;'
  );

})();
