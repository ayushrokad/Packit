/* ===========================
   PackIt — Main JavaScript
   Handles:
   - Custom cursor
   - Nav scroll state
   - Mobile nav
   - Hero canvas animation
   - Transformation interactive timeline
   - Workflow step interaction
   - Open Box flap interaction
   - Scroll reveal
   - Why Packaging scroll
   =========================== */

/* ——— Utility: clamp ——— */
const clamp = (v, min, max) => Math.min(Math.max(v, min), max);

/* ==============================
   CUSTOM CURSOR
   ============================== */
function initCursor() {
  const dot  = document.createElement('div');
  const ring = document.createElement('div');
  dot.className  = 'cursor-dot';
  ring.className = 'cursor-ring';
  document.body.appendChild(dot);
  document.body.appendChild(ring);

  let mx = 0, my = 0, rx = 0, ry = 0;
  let rafId;

  document.addEventListener('mousemove', (e) => {
    mx = e.clientX;
    my = e.clientY;
    dot.style.left = mx + 'px';
    dot.style.top  = my + 'px';
  });

  function lerpRing() {
    rx += (mx - rx) * 0.14;
    ry += (my - ry) * 0.14;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    rafId = requestAnimationFrame(lerpRing);
  }
  lerpRing();

  /* Expand ring on interactive elements */
  document.querySelectorAll('a, button, .ts-step, .showcase-card, .discipline-card, .pi-btn').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-active'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-active'));
  });
}

if (window.matchMedia('(pointer: fine)').matches) {
  initCursor();
}


/* ==============================
   NAV SCROLL STATE
   ============================== */
const nav = document.getElementById('main-nav');

function updateNav() {
  if (window.scrollY > 40) {
    nav?.classList.add('scrolled');
  } else {
    nav?.classList.remove('scrolled');
  }
}

window.addEventListener('scroll', updateNav, { passive: true });
updateNav();


/* ==============================
   MOBILE NAV
   ============================== */
const burger = document.getElementById('nav-burger');

if (burger) {
  const mobileMenu = document.createElement('div');
  mobileMenu.className = 'nav__mobile';

  const links = ['Work', 'Services', 'Approach', 'Industries', 'About'];
  const hrefs = ['/work.html', '/services.html', '/approach.html', '/industries.html', '/about.html'];

  links.forEach((link, i) => {
    const a = document.createElement('a');
    a.href = hrefs[i];
    a.textContent = link;
    mobileMenu.appendChild(a);
  });

  const ctaLink = document.createElement('a');
  ctaLink.href = '/start.html';
  ctaLink.textContent = 'Start a project →';
  ctaLink.style.fontFamily = 'var(--font-sans)';
  ctaLink.style.fontSize = 'var(--text-xl)';
  mobileMenu.appendChild(ctaLink);

  document.body.appendChild(mobileMenu);

  let isOpen = false;
  burger.addEventListener('click', () => {
    isOpen = !isOpen;
    burger.classList.toggle('open', isOpen);
    mobileMenu.classList.toggle('open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  mobileMenu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      isOpen = false;
      burger.classList.remove('open');
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}





/* ==============================
   TRANSFORMATION SECTION
   ============================== */
const steps = ['plain', 'positioned', 'identity', 'packaged', 'experience'];
const stepSpecs = [
  {
    substrate: '80gsm Raw Kraft + 3-Ply EVOH Bio-Barrier',
    color: 'Unprinted Substrate (Warm Linen Kraft)',
    type: 'Millimeter CAD Engineering Dielines',
    impact: '12-Month Ambient Freshness Confirmed'
  },
  {
    substrate: 'Deep Obsidian Contrast Calibrated Pouch',
    color: 'High-Contrast Monochromatic Header Split',
    type: 'Strategic Positioning & Territory Quadrant',
    impact: 'Category White-Space Ownership'
  },
  {
    substrate: 'FSC Premium SBS Recycled Board',
    color: 'Pantone Black 6C + Pantone 109C Spot Yellow',
    type: 'Custom Serif Wordmark + Space Grotesk',
    impact: 'Instant 3-Second Visual Recognition'
  },
  {
    substrate: 'Stand-Up Resealable Zipper Barrier Pouch',
    color: 'Matte Soft-Touch Varnish + Spot UV Highlights',
    type: 'Verified GS1 Barcode + Regulatory Net Wt',
    impact: 'Press-Ready Pre-Flight Approved'
  },
  {
    substrate: 'Laser Perforated Easy-Tear Pull Strip',
    color: 'Spot Gold Foil Seals & Ambient Retail Glow',
    type: '360° Shelf-Blocking Merchandising Sequence',
    impact: 'Shelf-Blocking Merchandising · Tactile Unboxing'
  }
];

const stepMap = {
  plain:      { el: 'ts-product',     layer: 'tp-plain' },
  positioned: { el: 'ts-position',    layer: 'tp-positioned' },
  identity:   { el: 'ts-identity',    layer: 'tp-identity' },
  packaged:   { el: 'ts-packaging',   layer: 'tp-packaged' },
  experience: { el: 'ts-experience',  layer: 'tp-experience' },
};

let currentStep = 0;
let autoAdvanceTimer = null;
let isAutoAdvancing = true;

function activateStep(index) {
  currentStep = index;
  const stepKey = steps[index];

  /* Deactivate all */
  steps.forEach((k) => {
    const cfg = stepMap[k];
    document.getElementById(cfg.el)?.classList.remove('active');
    document.getElementById(cfg.layer)?.classList.remove('active');
  });

  /* Activate current */
  const cfg = stepMap[stepKey];
  document.getElementById(cfg.el)?.classList.add('active');
  document.getElementById(cfg.layer)?.classList.add('active');

  /* Progress bar */
  const bar = document.getElementById('transform-progress');
  if (bar) bar.style.width = `${((index + 1) / steps.length) * 100}%`;

  /* Update indicator & spec sheet */
  const indicator = document.getElementById('tsStepIndicator');
  if (indicator) indicator.textContent = `PHASE 0${index + 1} / 05`;

  const spec = stepSpecs[index];
  if (spec) {
    const sSub = document.getElementById('specSubstrate');
    const sCol = document.getElementById('specColor');
    const sTyp = document.getElementById('specType');
    const sImp = document.getElementById('specImpact');
    if (sSub) sSub.textContent = spec.substrate;
    if (sCol) sCol.textContent = spec.color;
    if (sTyp) sTyp.textContent = spec.type;
    if (sImp) sImp.textContent = spec.impact;
  }
}

/* Bind step buttons */
steps.forEach((key, i) => {
  const cfg = stepMap[key];
  const btn = document.getElementById(cfg.el);
  btn?.addEventListener('click', () => {
    activateStep(i);
    resetAutoAdvance();
  });
});

/* Transformation Playback Controls */
const autoPlayBtn = document.getElementById('tsAutoPlayBtn');
const prevBtn = document.getElementById('tsPrevBtn');
const nextBtn = document.getElementById('tsNextBtn');

autoPlayBtn?.addEventListener('click', () => {
  isAutoAdvancing = !isAutoAdvancing;
  autoPlayBtn.textContent = isAutoAdvancing ? '⏸ Pause' : '▶ Play';
  if (isAutoAdvancing) {
    resetAutoAdvance();
  } else {
    if (autoAdvanceTimer) clearInterval(autoAdvanceTimer);
  }
});

prevBtn?.addEventListener('click', () => {
  const newIndex = (currentStep - 1 + steps.length) % steps.length;
  activateStep(newIndex);
  resetAutoAdvance();
});

nextBtn?.addEventListener('click', () => {
  const newIndex = (currentStep + 1) % steps.length;
  activateStep(newIndex);
  resetAutoAdvance();
});

function resetAutoAdvance() {
  if (autoAdvanceTimer) clearInterval(autoAdvanceTimer);
  if (!isAutoAdvancing) return;
  autoAdvanceTimer = setInterval(() => {
    activateStep((currentStep + 1) % steps.length);
  }, 3400);
}

/* Start first step */
activateStep(0);
resetAutoAdvance();


/* ==============================
   SCROLL REVEAL & INTERACTION
   ============================== */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

/* Showcase cards and discipline cards reveal */
document.querySelectorAll('.showcase-card, .discipline-card').forEach(el => {
  el.classList.add('reveal');
  revealObserver.observe(el);
});

/* Section labels + headlines */
const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
      }
    });
  },
  { threshold: 0.1 }
);


/* ==============================
   SMOOTH SECTION TRANSITIONS
   ============================== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});


/* ==============================
   PAGE LOAD ANIMATION
   ============================== */
document.addEventListener('DOMContentLoaded', () => {
  document.body.classList.add('page-enter');
});


/* ==============================
   CURSOR dot color on dark sections
   ============================== */
const darkSections = document.querySelectorAll('.transformation, .final-cta');
const cursorDot = document.querySelector('.cursor-dot');

if (cursorDot) {
  const sectionColorObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          cursorDot.style.background = '#FAF8F4';
        } else {
          cursorDot.style.background = '#F5C842';
        }
      });
    },
    { threshold: 0.5 }
  );
  darkSections.forEach(s => sectionColorObserver.observe(s));
}

console.log('%cPackIt', 'font-size:24px;font-family:serif;font-style:italic;color:#F5C842;background:#1A1A1A;padding:8px 16px;border-radius:4px;');
console.log('%cBranding & Packaging Design Studio', 'font-size:12px;color:#787878;');
