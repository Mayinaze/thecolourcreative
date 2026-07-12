/* ============================================
   THE COLOUR CREATIVE — GSAP Scroll Reveal
   Shared across all case study pages.
   Uses ScrollTrigger.batch() so every matching
   element is animated automatically — no per-page
   enumeration, no stranded opacity-zero elements.
   ============================================ */
(function () {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  gsap.registerPlugin(ScrollTrigger);

  const main = document.querySelector('main');
  if (!main) return;

  // Hero is immediately visible — its children are excluded from all reveals
  function isHero(el) { return !!el.closest('.cs-hero'); }

  // ─────────────────────────────────────────────
  // Collect element groups (empty arrays are fine —
  // batch() and gsap.set() are no-ops on empty input)
  // ─────────────────────────────────────────────
  const headings = [...main.querySelectorAll(
    '.cs-problem__title, .cs-discovery__title, .cs-solution__title, ' +
    '.cs-metrics__title, .cs-outcomes__title, .cs-overview__title'
  )].filter(el => !isHero(el));

  const subHeadings = [...main.querySelectorAll('.cs-problem__pains-title')]
    .filter(el => !isHero(el));

  const bodyParas = [...main.querySelectorAll(
    '.cs-problem__body p, .cs-discovery__body p, .cs-solution__body p, ' +
    '.cs-outcomes__body p, .cs-metrics__lead, .cs-overview__copy p'
  )].filter(el => !isHero(el));

  const images = [...main.querySelectorAll(
    'picture, .cs-hifi__image, .cs-solution__visual img, .cs-done-bubble'
  )].filter(el => !isHero(el));

  // Numeric stat counters only (text-based values stay visible immediately)
  const statEls = [...main.querySelectorAll(
    '.cs-metric-card__value:not(.cs-metric-card__value--text)'
  )];

  // Reduced motion — show everything immediately, no ScrollTrigger, no
  // count-up. Must happen before any gsap.set(...opacity:0...) below,
  // since GSAP's inline styles would otherwise beat any plain CSS fallback.
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const allEls = [...headings, ...subHeadings, ...bodyParas, ...images];
    if (allEls.length) gsap.set(allEls, { opacity: 1, y: 0 });
    if (statEls.length) gsap.set(statEls, { opacity: 1 });
    main.querySelectorAll('.cs-pain-list li').forEach(li => gsap.set(li, { opacity: 1, y: 0 }));
    return;
  }

  // ─────────────────────────────────────────────
  // Set initial invisible state via JS only.
  // If GSAP never loads the early-return above fires,
  // this block is never reached, and elements stay visible.
  // ─────────────────────────────────────────────
  if (headings.length)    gsap.set(headings,    { opacity: 0, y: 24 });
  if (subHeadings.length) gsap.set(subHeadings, { opacity: 0, y: 24 });
  if (bodyParas.length)   gsap.set(bodyParas,   { opacity: 0, y: 24 });
  if (images.length)      gsap.set(images,      { opacity: 0, y: 16 });
  if (statEls.length)     gsap.set(statEls,     { opacity: 0 });

  main.querySelectorAll('.cs-pain-list').forEach(list => {
    const items = list.querySelectorAll('li');
    if (items.length) gsap.set(items, { opacity: 0, y: 24 });
  });

  // ─────────────────────────────────────────────
  // batch() — guaranteed to pick up every element
  // matching the selector, including ones added later.
  // No element is left stranded at opacity 0.
  // ─────────────────────────────────────────────
  if (headings.length) {
    ScrollTrigger.batch(headings, {
      onEnter: batch => gsap.to(batch, {
        opacity: 1, y: 0, duration: 0.7, ease: 'power2.out',
      }),
      start: 'top 85%',
    });
  }

  if (subHeadings.length) {
    ScrollTrigger.batch(subHeadings, {
      onEnter: batch => gsap.to(batch, {
        opacity: 1, y: 0, duration: 0.6, ease: 'power2.out',
      }),
      start: 'top 88%',
    });
  }

  if (bodyParas.length) {
    ScrollTrigger.batch(bodyParas, {
      onEnter: batch => gsap.to(batch, {
        opacity: 1, y: 0, duration: 0.7, delay: 0.2, ease: 'power2.out',
      }),
      start: 'top 85%',
    });
  }

  // List items — staggered within each list
  main.querySelectorAll('.cs-pain-list').forEach(list => {
    const items = [...list.querySelectorAll('li')];
    if (!items.length) return;
    ScrollTrigger.batch(items, {
      onEnter: batch => gsap.to(batch, {
        opacity: 1, y: 0, duration: 0.6, delay: 0.2, ease: 'power2.out', stagger: 0.08,
      }),
      start: 'top 85%',
    });
  });

  if (images.length) {
    ScrollTrigger.batch(images, {
      onEnter: batch => gsap.to(batch, {
        opacity: 1, y: 0, duration: 0.8, ease: 'power2.out',
      }),
      start: 'top 85%',
    });
  }

  // ─────────────────────────────────────────────
  // Stat counters — numeric with % or $ formatting
  // ─────────────────────────────────────────────
  function formatWithCommas(n) {
    return Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  statEls.forEach((el, i) => {
    const raw = el.textContent.trim();
    const pctMatch    = raw.match(/^(\d+(?:\.\d+)?)%$/);
    const dollarMatch = raw.match(/^\$[\d,]+$/);

    if (pctMatch) {
      const target = parseFloat(pctMatch[1]);
      const obj = { val: 0 };
      gsap.to(obj, {
        val: target, duration: 1.8, delay: i * 0.2, ease: 'power2.out',
        onStart:    () => gsap.set(el, { opacity: 1 }),
        onUpdate:   () => { el.textContent = formatWithCommas(obj.val) + '%'; },
        onComplete: () => { el.textContent = target + '%'; },
        scrollTrigger: { trigger: el, start: 'top 80%', once: true },
      });
    } else if (dollarMatch) {
      const target = parseInt(raw.replace(/[$,]/g, ''), 10);
      const obj = { val: 0 };
      gsap.to(obj, {
        val: target, duration: 1.8, delay: i * 0.2, ease: 'power2.out',
        onStart:    () => gsap.set(el, { opacity: 1 }),
        onUpdate:   () => { el.textContent = '$' + formatWithCommas(obj.val); },
        onComplete: () => { el.textContent = '$' + formatWithCommas(target); },
        scrollTrigger: { trigger: el, start: 'top 80%', once: true },
      });
    } else {
      gsap.to(el, {
        opacity: 1, duration: 0.5,
        scrollTrigger: { trigger: el, start: 'top 80%', once: true },
      });
    }
  });
})();
