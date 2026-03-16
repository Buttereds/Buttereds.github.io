// ── Project carousel ──────────────────────────
const navBtns = document.querySelectorAll('.proj-nav-btn');
const slides  = document.querySelectorAll('.project-slide');

function showProject(index) {
  navBtns.forEach(b => b.classList.toggle('active', +b.dataset.index === index));
  slides.forEach(s  => s.classList.toggle('active',  +s.dataset.index === index));
}

navBtns.forEach(btn => {
  btn.addEventListener('click', () => showProject(+btn.dataset.index));
});

// ── Scroll reveal ─────────────────────────────
const revealEls = document.querySelectorAll(
  '.projects-carousel, .skill-group, .about-grid, .contact-layout, .hero-stats'
);

revealEls.forEach(el => el.classList.add('reveal'));

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Stagger siblings
      const siblings = [...entry.target.parentElement.querySelectorAll('.reveal')];
      const idx = siblings.indexOf(entry.target);
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, idx * 80);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

revealEls.forEach(el => observer.observe(el));

// ── Nav active state ──────────────────────────
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

const navObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => {
        link.style.color = '';
        if (link.getAttribute('href') === '#' + entry.target.id) {
          link.style.color = 'var(--accent)';
        }
      });
    }
  });
}, { rootMargin: '-50% 0px -50% 0px' });

sections.forEach(s => navObserver.observe(s));

// ── Reaction test ────────────────────────────
(function reactionTest() {
  const field = document.getElementById('reactionField');
  const avgEl = document.getElementById('reactionAvg');
  if (!field) return;

  const TARGET_SIZE = 48;
  const LIFETIME = 2500;           // ms before target expires
  const SPAWN_DELAY_MIN = 800;     // min pause between targets
  const SPAWN_DELAY_MAX = 2000;    // max pause between targets
  const times = [];
  let currentTarget = null;
  let spawnTime = 0;
  let expireTimer = null;
  let paused = false;

  function rand(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  function updateAvg() {
    if (times.length === 0) {
      avgEl.textContent = 'AVG --ms';
      return;
    }
    const last10 = times.slice(-10);
    const avg = Math.round(last10.reduce((a, b) => a + b, 0) / last10.length);
    avgEl.textContent = 'AVG ' + avg + 'ms';
  }

  const resetBtn = document.getElementById('reactionReset');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      times.length = 0;
      updateAvg();
    });
  }

  function showMs(x, y, ms) {
    const el = document.createElement('span');
    el.className = 'reaction-ms' + (ms > 600 ? ' slow' : '');
    el.textContent = ms + 'ms';
    el.style.left = x + 'px';
    el.style.top = (y - 10) + 'px';
    field.appendChild(el);
    setTimeout(() => el.remove(), 800);
  }

  function removeTarget(anim) {
    if (!currentTarget) return;
    clearTimeout(expireTimer);
    currentTarget.classList.remove('spawn');
    currentTarget.classList.add(anim);
    const t = currentTarget;
    setTimeout(() => t.remove(), 300);
    currentTarget = null;
  }

  function spawnTarget() {
    if (paused) return;
    const fieldRect = field.getBoundingClientRect();
    if (fieldRect.width < 100) return; // field not visible

    // Clamp spawn area above the hero-stats bar
    const stats = document.querySelector('.hero-stats');
    const statsTop = stats ? stats.getBoundingClientRect().top : fieldRect.bottom;
    const usableHeight = Math.max(100, statsTop - fieldRect.top);

    const padding = 12;
    const maxX = field.clientWidth - TARGET_SIZE - padding;
    const maxY = usableHeight - TARGET_SIZE - padding;
    const x = rand(padding, Math.max(padding + 1, maxX));
    const y = rand(padding, Math.max(padding + 1, maxY));

    const target = document.createElement('div');
    target.className = 'reaction-target spawn';
    target.style.left = x + 'px';
    target.style.top = y + 'px';
    field.appendChild(target);

    currentTarget = target;
    spawnTime = performance.now();

    target.addEventListener('click', () => {
      if (target !== currentTarget) return;
      const ms = Math.round(performance.now() - spawnTime);
      times.push(ms);
      showMs(x + TARGET_SIZE / 2 - 12, y, ms);
      removeTarget('hit');
      updateAvg();
      scheduleNext();
    });

    expireTimer = setTimeout(() => {
      if (target === currentTarget) {
        removeTarget('expire');
        scheduleNext();
      }
    }, LIFETIME);
  }

  function scheduleNext() {
    setTimeout(spawnTarget, rand(SPAWN_DELAY_MIN, SPAWN_DELAY_MAX));
  }

  // Only run when field is in viewport and screen is wide enough
  function checkVisibility() {
    const wide = window.innerWidth >= 1100;
    if (!wide) {
      paused = true;
      return;
    }
    paused = false;
  }

  // Pause when hero is out of view
  const heroObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      paused = !entry.isIntersecting || window.innerWidth < 1100;
    });
  }, { threshold: 0.2 });

  const hero = document.getElementById('home');
  if (hero) heroObserver.observe(hero);

  window.addEventListener('resize', checkVisibility);
  checkVisibility();

  // Initial spawn after page load animation settles
  setTimeout(spawnTarget, 1500);
})();

// ── Hero background text cycle ────────────────
(function heroBgCycle() {
  const el = document.getElementById('heroBgPrefix');
  if (!el) return;

  const words = ['VR', 'XR', 'AR', 'GAME'];
  let index = 0;

  setInterval(() => {
    el.classList.add('out');
    el.classList.remove('in');

    setTimeout(() => {
      index = (index + 1) % words.length;
      el.textContent = words[index];
      el.classList.remove('out');
      el.classList.add('in');
    }, 400);
  }, 3000);
})();

// ── Nav scroll opacity ────────────────────────
const nav = document.querySelector('.nav');
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    nav.style.borderBottomColor = 'rgba(30,30,30,0.8)';
  } else {
    nav.style.borderBottomColor = 'var(--border)';
  }
});
