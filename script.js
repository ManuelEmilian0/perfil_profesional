/* ============================================================
   MANUEL EMILIANO MORENO — script.js
   ============================================================ */

(function () {
  'use strict';

  /* ── 1. THEME TOGGLE ──────────────────────────────────────── */
  const html        = document.documentElement;
  const themeToggle = document.getElementById('themeToggle');
  const toggleIcon  = document.getElementById('toggleIcon');

  const DARK  = 'dark';
  const LIGHT = 'light';

  // Persist preference
  const saved = localStorage.getItem('theme') || DARK;
  applyTheme(saved);

  themeToggle.addEventListener('click', () => {
    const next = html.getAttribute('data-theme') === DARK ? LIGHT : DARK;
    applyTheme(next);
    localStorage.setItem('theme', next);
  });

  function applyTheme(theme) {
    html.setAttribute('data-theme', theme);
    toggleIcon.textContent = theme === DARK ? '☀' : '☾';
  }

  /* ── 2. NAVBAR: scroll shadow & active links ──────────────── */
  const navbar = document.getElementById('navbar');

  window.addEventListener('scroll', () => {
    navbar.style.boxShadow = window.scrollY > 20
      ? '0 4px 32px rgba(0,0,0,0.3)'
      : '';
  }, { passive: true });

  // Highlight active nav link on scroll
  const sections   = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navAnchors.forEach(a => a.classList.remove('active'));
        const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
        if (active) active.classList.add('active');
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach(s => observer.observe(s));

  // Active link style (inject minimal CSS)
  const style = document.createElement('style');
  style.textContent = `.nav-links a.active { color: var(--accent) !important; }
    .nav-links a.active::after { width: 100% !important; }`;
  document.head.appendChild(style);

  /* ── 3. HAMBURGER (mobile menu) ───────────────────────────── */
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');

  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    hamburger.classList.toggle('open');
  });

  // Close menu on link click
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
    });
  });

  /* ── 4. SCROLL-REVEAL ─────────────────────────────────────── */
  const revealEls = document.querySelectorAll(
    '.about-grid, .skill-group, .card, .contact-link, ' +
    '.tl-item, .about-facts, .proficiency-bars'
  );

  revealEls.forEach((el, i) => {
    el.classList.add('reveal');
    // Stagger children if multiple in same parent group
    if (el.classList.contains('skill-group') || el.classList.contains('card')) {
      const siblings = el.parentElement.children;
      const idx = Array.from(siblings).indexOf(el);
      el.classList.add(`reveal-delay-${Math.min(idx + 1, 3)}`);
    }
  });

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -60px 0px', threshold: 0.08 });

  revealEls.forEach(el => revealObserver.observe(el));

  /* ── 5. PROFICIENCY BARS animation ───────────────────────── */
  const bars = document.querySelectorAll('.bar-fill');
  let barsAnimated = false;

  const barObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !barsAnimated) {
        barsAnimated = true;
        bars.forEach(bar => {
          const w = bar.getAttribute('data-width');
          // Short delay then animate
          setTimeout(() => { bar.style.width = w + '%'; }, 200);
        });
        barObserver.disconnect();
      }
    });
  }, { threshold: 0.3 });

  const barsContainer = document.querySelector('.proficiency-bars');
  if (barsContainer) barObserver.observe(barsContainer);

  /* ── 6. SMOOTH ANCHOR (fallback for older browsers) ──────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ── 7. HERO: typing-cursor effect on subtitle ────────────── */
  // Small blinking cursor at end of hero title
  const heroTitle = document.querySelector('.hero-title');
  if (heroTitle) {
    const cursor = document.createElement('span');
    cursor.textContent = '|';
    cursor.style.cssText = `
      color: var(--accent);
      animation: blink 1s step-end infinite;
      font-family: var(--font-mono);
      margin-left: 2px;
    `;
    heroTitle.appendChild(cursor);
  }

  /* ── 8. PLACEHOLDER CARD click ────────────────────────────── */
  const placeholder = document.querySelector('.card-placeholder');
  if (placeholder) {
    placeholder.addEventListener('click', () => {
      alert('¡Agrega aquí tu próximo proyecto! Edita el index.html para añadir una nueva card en la sección #portfolio.');
    });
  }

  /* ── 9. CURSOR GLOW (desktop only) ───────────────────────── */
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    const glow = document.createElement('div');
    glow.style.cssText = `
      position: fixed; pointer-events: none; z-index: 9999;
      width: 300px; height: 300px;
      border-radius: 50%;
      background: radial-gradient(circle, var(--accent-glow) 0%, transparent 70%);
      transform: translate(-50%, -50%);
      transition: left 0.18s ease, top 0.18s ease;
      mix-blend-mode: screen;
    `;
    document.body.appendChild(glow);

    document.addEventListener('mousemove', e => {
      glow.style.left = e.clientX + 'px';
      glow.style.top  = e.clientY + 'px';
    }, { passive: true });
  }

  console.log('%c[EM] Portfolio cargado ✓', 'color:#00c8dc;font-family:monospace;font-size:14px');

})();
