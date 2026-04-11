// ── Project filter ───────────────────────────
const filterBtns = document.querySelectorAll('.filter-btn');
const cards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const filter = btn.dataset.filter;

    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    cards.forEach(card => {
      if (filter === 'all' || card.dataset.category === filter) {
        card.classList.remove('hidden');
      } else {
        card.classList.add('hidden');
      }
    });
  });
});

// ── Scroll reveal ─────────────────────────────
const revealEls = document.querySelectorAll(
  '.about-content, .metrics-row, .about-details, .skill-group, .filter-bar, .project-card, .contact-layout'
);

revealEls.forEach(el => el.classList.add('reveal'));

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const siblings = [...entry.target.parentElement.querySelectorAll('.reveal')];
      const idx = siblings.indexOf(entry.target);
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, idx * 60);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.08 });

revealEls.forEach(el => observer.observe(el));

// ── Reaction test ─────────────────────────────
(function reactionTest() {
  const field  = document.getElementById('reactionField');
  const avgEl  = document.getElementById('reactionAvg');
  if (!field) return;

  const TARGET_SIZE     = 44;
  const LIFETIME        = 2500;
  const SPAWN_DELAY_MIN = 800;
  const SPAWN_DELAY_MAX = 2000;
  const times = [];
  let currentTarget = null;
  let spawnTime     = 0;
  let expireTimer   = null;
  let paused        = false;

  function rand(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  function updateAvg() {
    if (times.length === 0) { avgEl.textContent = 'AVG --ms'; return; }
    const last10 = times.slice(-10);
    const avg = Math.round(last10.reduce((a, b) => a + b, 0) / last10.length);
    avgEl.textContent = 'AVG ' + avg + 'ms';
  }

  const resetBtn = document.getElementById('reactionReset');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => { times.length = 0; updateAvg(); });
  }

  function showMs(x, y, ms) {
    const el = document.createElement('span');
    el.className = 'reaction-ms' + (ms > 600 ? ' slow' : '');
    el.textContent = ms + 'ms';
    el.style.left = x + 'px';
    el.style.top  = (y - 10) + 'px';
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
    if (fieldRect.width < 80) return;

    const padding = 10;
    const maxX = field.clientWidth  - TARGET_SIZE - padding;
    const maxY = field.clientHeight - TARGET_SIZE - padding;
    const x = rand(padding, Math.max(padding + 1, maxX));
    const y = rand(padding, Math.max(padding + 1, maxY));

    const target = document.createElement('div');
    target.className = 'reaction-target spawn';
    target.style.left = x + 'px';
    target.style.top  = y + 'px';
    field.appendChild(target);

    currentTarget = target;
    spawnTime     = performance.now();

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
      if (target === currentTarget) { removeTarget('expire'); scheduleNext(); }
    }, LIFETIME);
  }

  function scheduleNext() {
    setTimeout(spawnTarget, rand(SPAWN_DELAY_MIN, SPAWN_DELAY_MAX));
  }

  // Pause when hero scrolls out of view
  const heroObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      paused = !entry.isIntersecting;
    });
  }, { threshold: 0.1 });

  const hero = document.getElementById('home');
  if (hero) heroObserver.observe(hero);

  setTimeout(spawnTarget, 1500);
})();

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
