/* ============================================
   THE COLOUR CREATIVE — Global JavaScript
   ============================================ */

'use strict';

// ============================================
// Scroll Reveal
// ============================================
function initScrollReveal() {
  const targets = document.querySelectorAll('.reveal, .reveal-stagger');

  if (!targets.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  targets.forEach(el => observer.observe(el));
}


// ============================================
// Mobile Nav Toggle
// ============================================
function initMobileNav() {
  // ── Desktop hamburger (existing behaviour, 768px+) ─────────────
  const toggle = document.querySelector('.nav__toggle');
  const list   = document.querySelector('.nav__list');

  if (toggle && list) {
    toggle.addEventListener('click', () => {
      const open = list.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open);
      const spans = toggle.querySelectorAll('span');
      if (open) {
        spans[0].style.transform = 'translateY(7px) rotate(45deg)';
        spans[1].style.opacity   = '0';
        spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
      } else {
        spans[0].style.transform = '';
        spans[1].style.opacity   = '';
        spans[2].style.transform = '';
      }
    });

    list.querySelectorAll('.nav__link').forEach(link => {
      link.addEventListener('click', () => {
        list.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        const spans = toggle.querySelectorAll('span');
        spans[0].style.transform = '';
        spans[1].style.opacity   = '';
        spans[2].style.transform = '';
      });
    });

    document.addEventListener('click', (e) => {
      if (!e.target.closest('.nav')) {
        list.classList.remove('open');
      }
    });
  }

  // ── Mobile floating pill nav ──────────────────────────────────
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';

  const navItems = [
    { href: 'index.html',              label: 'Home' },
    { href: 'case-studies.html',       label: 'Case studies' },
    { href: 'playground.html',         label: 'Playground' },
    { href: 'ux-ui-improvements.html', label: 'UX/UI improvements' },
  ];

  // Overlay
  const overlay = document.createElement('div');
  overlay.className = 'mob-nav-overlay';
  document.body.appendChild(overlay);

  // Pills container
  const pillsContainer = document.createElement('div');
  pillsContainer.className = 'mob-nav-pills';

  // Build pills — order in DOM is bottom-to-top (flex-direction: column-reverse)
  // so we add them in nav order (Home first) and column-reverse flips them visually
  navItems.forEach(item => {
    const pill = document.createElement('a');
    pill.href      = item.href;
    pill.className = 'mob-nav-pill';
    pill.textContent = item.label;

    const href = item.href;
    if (href === currentPage ||
       (currentPage === '' && href === 'index.html')) {
      pill.classList.add('active');
    }

    pill.addEventListener('click', () => closeMobNav());
    pillsContainer.appendChild(pill);
  });

  document.body.appendChild(pillsContainer);

  // FAB button
  const fab = document.createElement('button');
  fab.className   = 'mob-nav-fab';
  fab.setAttribute('aria-label', 'Open navigation');
  fab.innerHTML = `
    <span class="mob-nav-fab__icon">
      <span></span><span></span><span></span>
    </span>`;
  document.body.appendChild(fab);

  let isOpen = false;

  function openMobNav() {
    isOpen = true;
    fab.classList.add('open');
    overlay.classList.add('open');
    fab.setAttribute('aria-label', 'Close navigation');

    const pills = pillsContainer.querySelectorAll('.mob-nav-pill');
    pills.forEach((pill, i) => {
      pill.style.transitionDelay = `${i * 50}ms`;
      pill.classList.add('visible');
    });
  }

  function closeMobNav() {
    isOpen = false;
    fab.classList.remove('open');
    overlay.classList.remove('open');
    fab.setAttribute('aria-label', 'Open navigation');

    const pills = pillsContainer.querySelectorAll('.mob-nav-pill');
    const total = pills.length;
    pills.forEach((pill, i) => {
      pill.style.transitionDelay = `${(total - 1 - i) * 40}ms`;
      pill.classList.remove('visible');
    });
  }

  fab.addEventListener('click', (e) => {
    e.stopPropagation();
    isOpen ? closeMobNav() : openMobNav();
  });

  overlay.addEventListener('click', closeMobNav);
}

// ============================================
// Active Nav Link
// ============================================
function initActiveNav() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const links = document.querySelectorAll('.nav__link');

  links.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage ||
       (currentPage === '' && href === 'index.html') ||
       (currentPage === 'index.html' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}

// ============================================
// Playground — Colour Swatch Interaction
// ============================================
function initPlayground() {
  // Any playground-specific interactions
  const pgItems = document.querySelectorAll('.pg-item');
  pgItems.forEach(item => {
    item.addEventListener('mouseenter', () => {
      item.style.zIndex = '2';
    });
    item.addEventListener('mouseleave', () => {
      item.style.zIndex = '';
    });
  });
}

// ============================================
// Card hover — subtle parallax on image
// ============================================
function initCardTilt() {
  const cards = document.querySelectorAll('.card');

  cards.forEach(card => {
    const img = card.querySelector('.card__image-wrap');
    if (!img) return;

    card.addEventListener('mousemove', (e) => {
      const rect  = card.getBoundingClientRect();
      const xPct  = ((e.clientX - rect.left) / rect.width  - 0.5) * 2;
      const yPct  = ((e.clientY - rect.top)  / rect.height - 0.5) * 2;
      const rotX  = -(yPct * 4);
      const rotY  =  (xPct * 4);
      img.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
    });

    card.addEventListener('mouseleave', () => {
      img.style.transform = '';
    });
  });
}

// ============================================
// Typewriter — hero headline
// ============================================
function initTypewriter() {
  const el = document.getElementById('hero-headline');
  if (!el) return;

  // ── Segments: the headline broken into typed chunks ──────────────
  const segments = [
    { text: '10 years ',                        accent: false },
    { text: 'designing',                         accent: true  },
    { text: ' scalable products',               accent: false },
    { linebreak: true },
    { text: 'across SAAS, Fintech and Proptech', accent: false },
  ];

  // ── Step 1: reserve height so nothing below shifts ───────────────
  const reservedHeight = el.offsetHeight;
  el.style.minHeight   = reservedHeight + 'px';
  el.innerHTML         = '';

  // ── Step 2: append the persistent blinking cursor ────────────────
  const cursor = document.createElement('span');
  cursor.className   = 'typewriter-cursor';
  cursor.textContent = '|';
  el.appendChild(cursor);

  // ── Step 3: build a flat list of tokens to type ──────────────────
  const tokens = [];
  for (const seg of segments) {
    if (seg.linebreak) {
      tokens.push({ linebreak: true });
    } else {
      for (const char of seg.text) {
        tokens.push({ char, accent: seg.accent });
      }
    }
  }

  // ── Step 4: type one token at a time ─────────────────────────────
  let idx          = 0;
  let activeNode   = null;
  let activeAccent = null;
  let accentSpan   = null; // reference to the accent span for word rotation

  function typeNext() {
    if (idx >= tokens.length) {
      // Typing complete — hand the accent span to word rotation
      initWordRotation(accentSpan, cursor);
      return;
    }

    const token = tokens[idx++];

    if (token.linebreak) {
      el.insertBefore(document.createElement('br'), cursor);
      activeNode   = null;
      activeAccent = null;
    } else {
      if (token.accent !== activeAccent) {
        if (token.accent) {
          activeNode = document.createElement('span');
          activeNode.className = 'accent';
          accentSpan = activeNode; // save reference
        } else {
          activeNode = document.createTextNode('');
        }
        el.insertBefore(activeNode, cursor);
        activeAccent = token.accent;
      }
      activeNode.textContent += token.char;
    }

    setTimeout(typeNext, 22);
  }

  setTimeout(typeNext, 200);
}

// ============================================
// Word rotation — cycles accent word after typewriter
// ============================================
function initWordRotation(accentSpan, cursor) {
  if (!accentSpan) return;

  const words = ['Designing', 'Sweating', 'Grafting', 'Creating', 'Swearing', 'Polishing', 'Solving'];
  const STAY     = 2500; // ms each word is visible
  const DURATION = 400;  // ms slide transition

  // ── Measure the widest word at the current font ───────────────────
  // Create an off-screen clone to measure natural widths
  const measurer = document.createElement('span');
  measurer.style.cssText = 'position:absolute;visibility:hidden;white-space:nowrap;';
  measurer.style.font    = getComputedStyle(accentSpan).font;
  document.body.appendChild(measurer);

  let maxWidth = 0;
  words.forEach(w => {
    measurer.textContent = w;
    maxWidth = Math.max(maxWidth, measurer.offsetWidth);
  });
  document.body.removeChild(measurer);

  // ── Build the clipping wrapper ────────────────────────────────────
  // Replace the <span class="accent"> with a fixed-width overflow:hidden container
  const wrapper = document.createElement('span');
  wrapper.className = 'word-rotate-wrap';
  wrapper.style.width = maxWidth + 'px';

  // The visible word slot
  const slot = document.createElement('span');
  slot.className   = 'word-rotate-slot';
  slot.textContent = words[0]; // 'Designing' — already typed

  wrapper.appendChild(slot);
  accentSpan.replaceWith(wrapper);
  // Move cursor after wrapper (it was after accentSpan)
  wrapper.after(cursor);

  // ── Rotation logic ────────────────────────────────────────────────
  let current = 0;

  function rotateTo(nextIdx) {
    // Slide current word out downward
    slot.style.transition = `transform ${DURATION}ms ease-in-out, opacity ${DURATION}ms ease-in-out`;
    slot.style.transform  = 'translateY(100%)';
    slot.style.opacity    = '0';

    setTimeout(() => {
      // Snap to top (hidden above), update text
      slot.style.transition = 'none';
      slot.style.transform  = 'translateY(-100%)';
      slot.style.opacity    = '0';
      slot.textContent      = words[nextIdx];

      // Force reflow so the no-transition snap registers
      void slot.offsetHeight;

      // Slide in from top
      slot.style.transition = `transform ${DURATION}ms ease-in-out, opacity ${DURATION}ms ease-in-out`;
      slot.style.transform  = 'translateY(0)';
      slot.style.opacity    = '1';

      current = nextIdx;
    }, DURATION);
  }

  // Start cycling after the first word has been visible for STAY ms
  setTimeout(function cycle() {
    const next = (current + 1) % words.length;
    rotateTo(next);
    setTimeout(cycle, STAY + DURATION);
  }, STAY);
}

// ============================================
// Nav — frosted glass on scroll
// ============================================
function initNavScroll() {
  const nav = document.querySelector('.nav');
  if (!nav) return;

  function update() {
    nav.classList.toggle('nav--scrolled', window.scrollY > 20);
  }

  window.addEventListener('scroll', update, { passive: true });
  update(); // set correct state on load
}

// ============================================
// Custom cursor — outline ring + difference blend
// ============================================
function initCustomCursor() {
  // Only on pointer devices — skip touch-only screens
  if (!window.matchMedia('(pointer: fine)').matches) return;

  const cursor = document.createElement('div');
  cursor.className = 'cursor';

  const blend = document.createElement('div');
  blend.className = 'cursor-blend';

  document.body.appendChild(cursor);
  document.body.appendChild(blend);

  // Half the diameter, used to centre the circle on the hot-spot
  const OFFSET = -20;

  // Direct transform update — no rAF, no easing, pixel-perfect follow
  document.addEventListener('mousemove', (e) => {
    const tx = `${e.clientX + OFFSET}px`;
    const ty = `${e.clientY + OFFSET}px`;
    cursor.style.transform = `translate(${tx}, ${ty})`;
    blend.style.transform  = `translate(${tx}, ${ty})`;
  });

  document.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0';
    blend.style.opacity  = '0';
  });

  document.addEventListener('mouseenter', () => {
    cursor.style.opacity = '1';
    blend.style.opacity  = '1';
  });
}

// ============================================
// Avatar — appears in nav when hero scrolls out
// ============================================
function initAvatarNav() {
  const heroAvatar = document.querySelector('.hero__avatar');
  const nav = document.querySelector('.nav');
  if (!heroAvatar || !nav) return;

  // Create nav avatar clone
  const navAvatar = document.createElement('img');
  navAvatar.src = heroAvatar.src;
  navAvatar.alt = heroAvatar.alt;
  navAvatar.className = 'nav__avatar';
  nav.appendChild(navAvatar);

  // Click scrolls to top
  navAvatar.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Use IntersectionObserver to detect when hero section leaves viewport
  const heroSection = document.querySelector('.hero');
  if (!heroSection) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) {
        nav.classList.add('nav--has-avatar');
      } else {
        nav.classList.remove('nav--has-avatar');
      }
    });
  }, { threshold: 0.1 });

  observer.observe(heroSection);
}

// ============================================
// Init all
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  initActiveNav();
  initMobileNav();
  initScrollReveal();
  initPlayground();
  initCardTilt();
  initTypewriter();
  initNavScroll();
  initCustomCursor();
  initAvatarNav();
});
