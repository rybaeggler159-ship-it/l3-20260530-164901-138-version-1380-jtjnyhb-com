(function () {
  var navToggle = document.querySelector('.nav-toggle');
  var navLinks = document.querySelector('.nav-links');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      var opened = navLinks.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', opened ? 'true' : 'false');
    });
  }

  var slides = Array.prototype.slice.call(document.querySelectorAll('.hero-slide'));
  var dots = Array.prototype.slice.call(document.querySelectorAll('.hero-dot'));
  var current = 0;

  function showSlide(index) {
    if (!slides.length) {
      return;
    }

    current = (index + slides.length) % slides.length;
    slides.forEach(function (slide, i) {
      slide.classList.toggle('is-active', i === current);
    });
    dots.forEach(function (dot, i) {
      dot.classList.toggle('is-active', i === current);
    });
  }

  dots.forEach(function (dot, index) {
    dot.addEventListener('click', function () {
      showSlide(index);
    });
  });

  if (slides.length > 1) {
    setInterval(function () {
      showSlide(current + 1);
    }, 5200);
  }

  document.querySelectorAll('img[data-cover]').forEach(function (img) {
    img.addEventListener('error', function () {
      var holder = img.closest('.poster, .hero-poster, .detail-cover, .rank-cover');
      if (holder) {
        holder.classList.add('cover-off');
      }
    });
  });

  var searchInput = document.querySelector('[data-search-input]');
  var searchCards = Array.prototype.slice.call(document.querySelectorAll('[data-search-card]'));

  if (searchInput && searchCards.length) {
    searchInput.addEventListener('input', function () {
      var query = searchInput.value.trim().toLowerCase();
      searchCards.forEach(function (card) {
        var haystack = (card.getAttribute('data-search-card') || '').toLowerCase();
        card.classList.toggle('hide-card', query && haystack.indexOf(query) === -1);
      });
    });
  }
}());
