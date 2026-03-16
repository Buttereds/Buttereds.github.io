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

// ── Nav scroll opacity ────────────────────────
const nav = document.querySelector('.nav');
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    nav.style.borderBottomColor = 'rgba(30,30,30,0.8)';
  } else {
    nav.style.borderBottomColor = 'var(--border)';
  }
});
