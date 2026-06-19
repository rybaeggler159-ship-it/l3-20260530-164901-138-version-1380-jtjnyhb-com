(function() {
  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  ready(function() {
    var menuButton = document.querySelector('[data-menu-toggle]');
    var mobileNav = document.querySelector('[data-mobile-nav]');
    if (menuButton && mobileNav) {
      menuButton.addEventListener('click', function() {
        mobileNav.classList.toggle('is-open');
      });
    }

    var hero = document.querySelector('[data-hero]');
    if (hero) {
      var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
      var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
      var current = 0;
      var timer = null;
      function show(index) {
        current = index;
        slides.forEach(function(slide, i) {
          slide.classList.toggle('is-active', i === current);
        });
        dots.forEach(function(dot, i) {
          dot.classList.toggle('is-active', i === current);
        });
      }
      function next() {
        if (!slides.length) return;
        show((current + 1) % slides.length);
      }
      dots.forEach(function(dot) {
        dot.addEventListener('click', function() {
          var index = parseInt(dot.getAttribute('data-hero-dot'), 10);
          if (!Number.isNaN(index)) show(index);
          if (timer) clearInterval(timer);
          timer = setInterval(next, 5200);
        });
      });
      if (slides.length > 1) timer = setInterval(next, 5200);
    }

    var panels = Array.prototype.slice.call(document.querySelectorAll('.filter-panel'));
    panels.forEach(function(panel) {
      var scope = panel.parentElement || document;
      var input = panel.querySelector('[data-filter-input]');
      var year = panel.querySelector('[data-year-filter]');
      var region = panel.querySelector('[data-region-filter]');
      var cards = Array.prototype.slice.call(scope.querySelectorAll('[data-card]'));
      function apply() {
        var keyword = input ? input.value.trim().toLowerCase() : '';
        var selectedYear = year ? year.value : '';
        var selectedRegion = region ? region.value : '';
        cards.forEach(function(card) {
          var text = (card.getAttribute('data-text') || '').toLowerCase();
          var cardYear = card.getAttribute('data-year') || '';
          var cardRegion = card.getAttribute('data-region') || '';
          var matched = true;
          if (keyword && text.indexOf(keyword) === -1) matched = false;
          if (selectedYear && cardYear !== selectedYear) matched = false;
          if (selectedRegion && cardRegion !== selectedRegion) matched = false;
          card.hidden = !matched;
        });
      }
      if (input) input.addEventListener('input', apply);
      if (year) year.addEventListener('change', apply);
      if (region) region.addEventListener('change', apply);
    });
  });
})();
