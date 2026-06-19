(function () {
  var menuButton = document.querySelector('[data-menu-toggle]');
  var mobileMenu = document.querySelector('[data-mobile-menu]');

  if (menuButton && mobileMenu) {
    menuButton.addEventListener('click', function () {
      mobileMenu.classList.toggle('is-open');
    });
  }

  document.querySelectorAll('[data-header-search]').forEach(function (form) {
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      var input = form.querySelector('input[name="q"]');
      var keyword = input ? input.value.trim() : '';
      if (keyword) {
        window.location.href = 'movies.html?q=' + encodeURIComponent(keyword);
      }
    });
  });

  document.querySelectorAll('[data-hero]').forEach(function (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    var index = 0;

    function activate(nextIndex) {
      if (!slides.length) {
        return;
      }
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('is-active', i === index);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('is-active', i === index);
      });
    }

    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () {
        activate(i);
      });
    });

    if (slides.length > 1) {
      setInterval(function () {
        activate(index + 1);
      }, 5200);
    }
  });

  document.querySelectorAll('[data-filter-panel]').forEach(function (panel) {
    var input = panel.querySelector('[data-filter-input]');
    var select = panel.querySelector('[data-filter-select]');
    var list = document.querySelector('[data-card-list]');
    var cards = list ? Array.prototype.slice.call(list.querySelectorAll('[data-movie-card]')) : [];
    var emptyState = document.querySelector('[data-empty-state]');
    var params = new URLSearchParams(window.location.search);
    var query = params.get('q') || '';

    if (input && query) {
      input.value = query;
    }

    function normalize(value) {
      return String(value || '').toLowerCase().replace(/\s+/g, '');
    }

    function filterCards() {
      var keyword = normalize(input ? input.value : '');
      var category = select ? select.value : '';
      var visible = 0;

      cards.forEach(function (card) {
        var text = normalize(card.getAttribute('data-search'));
        var cardCategory = card.getAttribute('data-category') || '';
        var matched = (!keyword || text.indexOf(keyword) !== -1) && (!category || cardCategory === category);
        card.style.display = matched ? '' : 'none';
        if (matched) {
          visible += 1;
        }
      });

      if (emptyState) {
        emptyState.classList.toggle('is-visible', visible === 0 && cards.length > 0);
      }
    }

    if (input) {
      input.addEventListener('input', filterCards);
    }

    if (select) {
      select.addEventListener('change', filterCards);
    }

    filterCards();
  });

  document.querySelectorAll('[data-player]').forEach(function (player) {
    var video = player.querySelector('video');
    var button = player.querySelector('[data-play-button]');
    var url = player.getAttribute('data-video');
    var initialized = false;
    var hls = null;

    function attach() {
      if (!video || !url || initialized) {
        return;
      }

      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = url;
      } else if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({
          enableWorker: true,
          maxBufferLength: 30
        });
        hls.loadSource(url);
        hls.attachMedia(video);
      } else {
        video.src = url;
      }

      initialized = true;
    }

    function start() {
      if (!video) {
        return;
      }

      attach();
      video.controls = true;

      if (button) {
        button.classList.add('is-hidden');
      }

      var playResult = video.play();
      if (playResult && typeof playResult.catch === 'function') {
        playResult.catch(function () {
          if (button) {
            button.classList.remove('is-hidden');
          }
        });
      }
    }

    if (button) {
      button.addEventListener('click', start);
    }

    if (video) {
      video.addEventListener('click', function () {
        if (video.paused) {
          start();
        }
      });
    }

    window.addEventListener('beforeunload', function () {
      if (hls) {
        hls.destroy();
      }
    });
  });
})();
