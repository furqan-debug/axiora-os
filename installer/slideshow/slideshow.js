document.addEventListener('DOMContentLoaded', () => {
  const slides = document.querySelectorAll('.slide');
  const navDotsContainer = document.getElementById('nav-dots');
  let currentSlide = 0;
  const slideInterval = 8000; // 8 seconds per slide

  // Create nav dots
  slides.forEach((_, index) => {
    const dot = document.createElement('div');
    dot.classList.add('nav-dot');
    if (index === 0) dot.classList.add('active');
    navDotsContainer.appendChild(dot);
  });

  const dots = document.querySelectorAll('.nav-dot');

  function showSlide(index) {
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));

    slides[index].classList.add('active');
    dots[index].classList.add('active');
  }

  function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
  }

  // Set interval to automatically change slides
  setInterval(nextSlide, slideInterval);
});
