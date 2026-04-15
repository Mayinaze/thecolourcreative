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
      /* WORD ROTATION - commented out, re-enable when ready */
      // initWordRotation(accentSpan);
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

/* WORD ROTATION - commented out, re-enable when ready
// ============================================
// Word rotation — cycles accent word after typewriter
// ============================================
function initWordRotation(accentSpan) {
  if (!accentSpan) return;

  // All lowercase — cycle through once and stop back on 'designing'
  const words    = ['designing', 'sweating', 'grafting', 'creating', 'swearing', 'polishing', 'solving', 'designing'];
  const LAST_IDX = words.length - 1; // index of final 'designing' — stop here
  const STAY     = 2500; // ms each word is visible
  const DURATION = 400;  // ms slide transition

  // ── Measure the widest word at the current font ───────────────────
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
  // Fixed width = longest word; cursor stays at end of headline, untouched
  const wrapper = document.createElement('span');
  wrapper.className  = 'word-rotate-wrap';
  wrapper.style.width = maxWidth + 'px';

  const slot = document.createElement('span');
  slot.className   = 'word-rotate-slot';
  slot.textContent = words[0]; // 'designing'

  wrapper.appendChild(slot);
  accentSpan.replaceWith(wrapper);
  // DO NOT move cursor — it stays at the very end of the h1 after 'Proptech'

  // ── Rotation logic ────────────────────────────────────────────────
  let current  = 0;
  let animating = false;
  let timer     = null;
  let done      = false;

  function rotateTo(nextIdx) {
    if (animating) return;
    animating = true;

    // Slide current word out downward
    slot.style.transition = `transform ${DURATION}ms ease-in-out, opacity ${DURATION}ms ease-in-out`;
    slot.style.transform  = 'translateY(100%)';
    slot.style.opacity    = '0';

    setTimeout(() => {
      // Snap to top (no transition), update text
      slot.style.transition = 'none';
      slot.style.transform  = 'translateY(-100%)';
      slot.style.opacity    = '0';
      slot.textContent      = words[nextIdx];

      void slot.offsetHeight; // force reflow

      // Slide in from top
      slot.style.transition = `transform ${DURATION}ms ease-in-out, opacity ${DURATION}ms ease-in-out`;
      slot.style.transform  = 'translateY(0)';
      slot.style.opacity    = '1';

      current   = nextIdx;
      animating = false;

      // Stop permanently once we land on the final 'designing'
      if (current === LAST_IDX) {
        done = true;
        if (timer) clearTimeout(timer);
      }
    }, DURATION);
  }

  function scheduleNext() {
    if (done) return;
    timer = setTimeout(() => {
      rotateTo(current + 1);
      if (current + 1 < LAST_IDX) scheduleNext();
    }, STAY);
  }

  // Click on wrapper advances one word (no-op when on final word)
  wrapper.style.cursor = 'pointer';
  wrapper.addEventListener('click', () => {
    if (done || animating) return;
    if (timer) clearTimeout(timer);
    const next = current + 1;
    rotateTo(next);
    if (next < LAST_IDX) scheduleNext();
  });

  // Start after first word has been shown for STAY ms
  scheduleNext();
}
*/

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
// Draw Canvas — glow brush stroke drawing
// ============================================
function initDrawCanvas() {
  // Desktop only — skip touch-only devices
  if (!window.matchMedia('(pointer: fine)').matches) return;

  // ── Canvas setup ─────────────────────────────────────────────────
  const canvas = document.createElement('canvas');
  canvas.className = 'draw-canvas';
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');

  function resizeCanvas() {
    // Preserve existing drawing across resize by copying to temp
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    ctx.putImageData(imgData, 0, 0);
  }

  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
  window.addEventListener('resize', resizeCanvas, { passive: true });

  // ── Indicator UI ─────────────────────────────────────────────────
  const indicator = document.createElement('div');
  indicator.className = 'draw-indicator';
  indicator.innerHTML = `
    <span class="draw-indicator__dot"></span>
    <span class="draw-indicator__label">Draw</span>
    <button class="draw-indicator__clear" aria-label="Clear drawing">Clear</button>
  `;
  document.body.appendChild(indicator);

  const clearBtn = indicator.querySelector('.draw-indicator__clear');

  // ── State ─────────────────────────────────────────────────────────
  let drawMode  = false;
  let isDrawing = false;
  let lastX     = 0;
  let lastY     = 0;
  let lastTime  = 0;
  let lastSpeed = 0;

  // Each stroke is an array of segments: { x0, y0, x1, y1, width, alpha }
  // alpha starts at 1 and decays
  let strokes = []; // [ { segments: [...], alpha: 1, fadeStart: null, rafId: null } ]

  // ── Toggle draw mode ─────────────────────────────────────────────
  function enableDraw() {
    drawMode = true;
    canvas.classList.add('draw-canvas--active');
    indicator.classList.add('draw-indicator--visible');
  }

  function disableDraw() {
    drawMode = false;
    isDrawing = false;
    canvas.classList.remove('draw-canvas--active');
    indicator.classList.remove('draw-indicator--visible');
  }

  document.addEventListener('keydown', (e) => {
    // Ignore if focus is in an input/textarea
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

    if (e.key === 'd' || e.key === 'D') {
      drawMode ? disableDraw() : enableDraw();
    }

    if (e.key === 'Escape') {
      clearAll();
      disableDraw();
    }
  });

  clearBtn.addEventListener('click', clearAll);

  function clearAll() {
    // Cancel any pending fade rAFs
    strokes.forEach(s => { if (s.rafId) cancelAnimationFrame(s.rafId); });
    strokes = [];
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  // ── Mouse drawing ─────────────────────────────────────────────────
  let currentStroke = null; // reference to the stroke being drawn

  canvas.addEventListener('mousedown', (e) => {
    if (!drawMode) return;
    isDrawing   = true;
    lastX       = e.clientX;
    lastY       = e.clientY;
    lastTime    = performance.now();
    lastSpeed   = 0;

    currentStroke = { segments: [], alpha: 1, fadeStart: null, rafId: null };
    strokes.push(currentStroke);
  });

  canvas.addEventListener('mousemove', (e) => {
    if (!drawMode || !isDrawing) return;

    const x    = e.clientX;
    const y    = e.clientY;
    const now  = performance.now();
    const dt   = now - lastTime || 1;

    const dx   = x - lastX;
    const dy   = y - lastY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const speed = dist / dt; // px/ms

    // Smooth speed with an EMA
    lastSpeed = lastSpeed * 0.6 + speed * 0.4;

    // Map speed → width: slow = 12px, fast = 2px
    const MIN_W = 2;
    const MAX_W = 12;
    const SPEED_MAX = 1.2; // px/ms considered "fast"
    const t = Math.min(lastSpeed / SPEED_MAX, 1);
    const width = MAX_W - t * (MAX_W - MIN_W);

    // Draw segment immediately at full opacity
    drawSegment(ctx, lastX, lastY, x, y, width, 1);

    // Store segment for fade redraw
    currentStroke.segments.push({ x0: lastX, y0: lastY, x1: x, y1: y, width });

    lastX    = x;
    lastY    = y;
    lastTime = now;
  });

  canvas.addEventListener('mouseup',    endStroke);
  canvas.addEventListener('mouseleave', endStroke);

  function endStroke() {
    if (!isDrawing || !currentStroke) return;
    isDrawing     = false;
    const stroke  = currentStroke;
    currentStroke = null;

    // Begin fade after 3000ms
    stroke.fadeStart = performance.now() + 3000;
    scheduleFade(stroke);
  }

  // ── Draw a single segment with glow ──────────────────────────────
  function drawSegment(context, x0, y0, x1, y1, width, globalAlpha) {
    context.save();
    context.globalAlpha     = globalAlpha;
    context.globalCompositeOperation = 'source-over';
    context.lineCap         = 'round';
    context.lineJoin        = 'round';
    context.lineWidth       = width;
    context.strokeStyle     = '#df1463';
    context.shadowBlur      = 20;
    context.shadowColor     = '#df1463';
    context.beginPath();
    context.moveTo(x0, y0);
    context.lineTo(x1, y1);
    context.stroke();
    context.restore();
  }

  // ── Fade logic ────────────────────────────────────────────────────
  const FADE_DURATION = 3000; // ms

  function scheduleFade(stroke) {
    stroke.rafId = requestAnimationFrame(() => fadeStroke(stroke));
  }

  function fadeStroke(stroke) {
    const now     = performance.now();
    const elapsed = now - stroke.fadeStart;

    if (elapsed < 0) {
      // Not yet time to start fading
      stroke.rafId = requestAnimationFrame(() => fadeStroke(stroke));
      return;
    }

    const progress = Math.min(elapsed / FADE_DURATION, 1);
    stroke.alpha   = 1 - progress;

    // Redraw everything
    redrawAll();

    if (progress < 1) {
      stroke.rafId = requestAnimationFrame(() => fadeStroke(stroke));
    } else {
      // Stroke fully faded — remove and do a final redraw
      strokes = strokes.filter(s => s !== stroke);
      redrawAll();
    }
  }

  function redrawAll() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    strokes.forEach(stroke => {
      // Active stroke (still being drawn) or alpha not yet started = 1
      const alpha = stroke.fadeStart === null ? 1 : stroke.alpha;
      if (alpha <= 0) return;

      stroke.segments.forEach(seg => {
        drawSegment(ctx, seg.x0, seg.y0, seg.x1, seg.y1, seg.width, alpha);
      });
    });
  }
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
  initDrawCanvas();
});
