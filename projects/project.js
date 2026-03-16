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
