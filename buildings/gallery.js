document.addEventListener('DOMContentLoaded', () => {
  const lightbox = document.getElementById('archival-lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxCounter = document.getElementById('lightbox-counter');
  const closeBtn = document.getElementById('lightbox-close-btn');
  const prevBtn = document.getElementById('lightbox-prev-btn');
  const nextBtn = document.getElementById('lightbox-next-btn');

  if (!lightbox) return;

  const plates = Array.from(document.querySelectorAll('.gallery-plate-item'));
  let currentIndex = 0;

  function displayPlate(index) {
    if (index < 0) index = plates.length - 1;
    if (index >= plates.length) index = 0;
    currentIndex = index;

    const item = plates[currentIndex];
    const fullSrc = item.getAttribute('data-full');
    const captionText = item.getAttribute('data-caption') || '';

    lightboxImg.src = fullSrc;
    lightboxCaption.textContent = captionText;

    if (lightboxCounter) {
      lightboxCounter.textContent = `Plate ${currentIndex + 1} of ${plates.length}`;
    }
  }

  // Open clicked plate
  plates.forEach((plate, idx) => {
    plate.addEventListener('click', () => {
      displayPlate(idx);
      if (typeof lightbox.showModal === 'function') {
        lightbox.showModal();
      } else {
        lightbox.setAttribute('open', '');
      }
    });
  });

  // Next / Prev actions
  function showNext() { 
    displayPlate(currentIndex + 1); 
  }
  
  function showPrev() { 
    displayPlate(currentIndex - 1); 
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      showNext();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      showPrev();
    });
  }

  // Close handlers
  if (closeBtn) {
    closeBtn.addEventListener('click', () => lightbox.close());
  }

  // Close when clicking the backdrop
  lightbox.addEventListener('click', (e) => {
    const rect = lightbox.getBoundingClientRect();
    const isInDialog = (
      rect.top <= e.clientY &&
      e.clientY <= rect.top + rect.height &&
      rect.left <= e.clientX &&
      e.clientX <= rect.left + rect.width
    );
    if (!isInDialog) {
      lightbox.close();
    }
  });

  // Keyboard controls
  window.addEventListener('keydown', (e) => {
    if (!lightbox.open) return;

    if (e.key === 'ArrowRight') {
      showNext();
    } else if (e.key === 'ArrowLeft') {
      showPrev();
    } else if (e.key === 'Escape') {
      lightbox.close();
    }
  });
});