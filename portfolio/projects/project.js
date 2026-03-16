// ── Custom cursor ─────────────────────────────
const cursor = document.createElement('div');
const cursorRing = document.createElement('div');
cursor.className = 'cursor';
cursorRing.className = 'cursor-ring';
document.body.appendChild(cursor);
document.body.appendChild(cursorRing);

let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursor.style.left = mouseX + 'px';
  cursor.style.top  = mouseY + 'px';
});

(function animateRing() {
  ringX += (mouseX - ringX) * 0.12;
  ringY += (mouseY - ringY) * 0.12;
  cursorRing.style.left = ringX + 'px';
  cursorRing.style.top  = ringY + 'px';
  requestAnimationFrame(animateRing);
})();

document.querySelectorAll('a, button, .thumb').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.style.width = '20px';
    cursor.style.height = '20px';
    cursorRing.style.transform = 'translate(-50%, -50%) scale(1.6)';
  });
  el.addEventListener('mouseleave', () => {
    cursor.style.width = '10px';
    cursor.style.height = '10px';
    cursorRing.style.transform = 'translate(-50%, -50%) scale(1)';
  });
});

// ── Gallery ───────────────────────────────────
const mainImg   = document.querySelector('.main-img');
const mainVideo = document.querySelector('.main-video');
const thumbs    = document.querySelectorAll('.thumb');

thumbs.forEach(thumb => {
  thumb.addEventListener('click', () => {
    // Update active thumb
    thumbs.forEach(t => t.classList.remove('thumb-active'));
    thumb.classList.add('thumb-active');

    if (thumb.dataset.type === 'video' && mainVideo) {
      if (mainImg) mainImg.style.display = 'none';
      mainVideo.style.display = 'block';
      mainVideo.load();
      mainVideo.play().catch(() => {
        // Autoplay blocked — controls are visible, user can press play manually
      });
    } else {
      // Show image
      if (mainVideo) {
        mainVideo.pause();
        mainVideo.style.display = 'none';
      }
      if (mainImg) {
        mainImg.style.display = 'block';
        mainImg.src = thumb.dataset.src;
        mainImg.alt = thumb.alt || '';
      }
    }
  });

  // Keyboard accessibility
  thumb.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      thumb.click();
    }
  });
});
