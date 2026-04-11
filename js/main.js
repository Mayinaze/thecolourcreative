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
// Cursor Glow
// ============================================
function initCursorGlow() {
  const glow = document.createElement('div');
  glow.classList.add('cursor-glow');
  document.body.appendChild(glow);

  let mouseX = -9999, mouseY = -9999;
  let glowX = -9999, glowY = -9999;
  let raf;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  document.addEventListener('mouseleave', () => {
    glow.style.opacity = '0';
  });

  document.addEventListener('mouseenter', () => {
    glow.style.opacity = '1';
  });

  function animate() {
    glowX += (mouseX - glowX) * 0.08;
    glowY += (mouseY - glowY) * 0.08;
    glow.style.left = glowX + 'px';
    glow.style.top  = glowY + 'px';
    raf = requestAnimationFrame(animate);
  }

  animate();
}

// ============================================
// Mobile Nav Toggle
// ============================================
function initMobileNav() {
  const toggle = document.querySelector('.nav__toggle');
  const list   = document.querySelector('.nav__list');

  if (!toggle || !list) return;

  toggle.addEventListener('click', () => {
    const open = list.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open);
    // Animate hamburger lines
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

  // Close on link click
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

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav')) {
      list.classList.remove('open');
    }
  });
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
// Typewriter effect (hero headline accent)
// ============================================
function initTypewriter() {
  const el = document.querySelector('[data-typewriter]');
  if (!el) return;

  const words  = el.dataset.typewriter.split(',').map(w => w.trim());
  let wordIdx  = 0;
  let charIdx  = 0;
  let deleting = false;

  el.style.borderRight = '2px solid var(--color-accent)';
  el.style.paddingRight = '2px';

  function tick() {
    const word = words[wordIdx];
    if (!deleting) {
      el.textContent = word.slice(0, ++charIdx);
      if (charIdx === word.length) {
        deleting = true;
        setTimeout(tick, 1800);
        return;
      }
    } else {
      el.textContent = word.slice(0, --charIdx);
      if (charIdx === 0) {
        deleting = false;
        wordIdx  = (wordIdx + 1) % words.length;
      }
    }
    setTimeout(tick, deleting ? 60 : 100);
  }

  tick();
}

// ============================================
// Init all
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  initActiveNav();
  initMobileNav();
  initScrollReveal();
  initCursorGlow();
  initPlayground();
  initCardTilt();
  initTypewriter();
});
