(function () {
  function all(selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  }

  function one(selector, root) {
    return (root || document).querySelector(selector);
  }

  function norm(value) {
    return String(value || '').trim().toLowerCase();
  }

  function htmlEscape(value) {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function initMobileMenu() {
    var toggle = one('[data-mobile-toggle]');
    var panel = one('[data-mobile-panel]');
    if (!toggle || !panel) {
      return;
    }
    toggle.addEventListener('click', function () {
      panel.classList.toggle('is-open');
    });
  }

  function initHero() {
    var hero = one('[data-hero]');
    if (!hero) {
      return;
    }
    var slides = all('[data-hero-slide]', hero);
    var dots = all('[data-hero-dot]', hero);
    var index = 0;
    var timer = null;

    function show(next) {
      index = (next + slides.length) % slides.length;
      slides.forEach(function (slide, current) {
        slide.classList.toggle('is-active', current === index);
      });
      dots.forEach(function (dot, current) {
        dot.classList.toggle('is-active', current === index);
      });
    }

    function play() {
      timer = window.setInterval(function () {
        show(index + 1);
      }, 5000);
    }

    dots.forEach(function (dot, current) {
      dot.addEventListener('click', function () {
        show(current);
        if (timer) {
          window.clearInterval(timer);
          play();
        }
      });
    });

    show(0);
    if (slides.length > 1) {
      play();
    }
  }

  function initFilters() {
    all('[data-filter-scope]').forEach(function (scope) {
      var input = one('[data-filter-input]', scope);
      var year = one('[data-filter-year]', scope);
      var region = one('[data-filter-region]', scope);
      var type = one('[data-filter-type]', scope);
      var empty = one('[data-filter-empty]', scope);
      var cards = all('[data-movie-card]', scope);

      function update() {
        var q = norm(input && input.value);
        var y = norm(year && year.value);
        var r = norm(region && region.value);
        var t = norm(type && type.value);
        var shown = 0;

        cards.forEach(function (card) {
          var haystack = norm([
            card.getAttribute('data-title'),
            card.getAttribute('data-year'),
            card.getAttribute('data-region'),
            card.getAttribute('data-type'),
            card.getAttribute('data-genre'),
            card.getAttribute('data-tags')
          ].join(' '));
          var ok = true;
          if (q && haystack.indexOf(q) === -1) {
            ok = false;
          }
          if (y && norm(card.getAttribute('data-year')) !== y) {
            ok = false;
          }
          if (r && norm(card.getAttribute('data-region')) !== r) {
            ok = false;
          }
          if (t && norm(card.getAttribute('data-type')).indexOf(t) === -1) {
            ok = false;
          }
          card.style.display = ok ? '' : 'none';
          if (ok) {
            shown += 1;
          }
        });

        if (empty) {
          empty.classList.toggle('is-visible', shown === 0);
        }
      }

      [input, year, region, type].forEach(function (control) {
        if (control) {
          control.addEventListener('input', update);
          control.addEventListener('change', update);
        }
      });
    });
  }

  function searchCard(movie) {
    return [
      '<article class="movie-card compact" data-movie-card>',
      '  <a class="poster-link" href="' + htmlEscape(movie.url) + '">',
      '    <img src="' + htmlEscape(movie.cover) + '" alt="' + htmlEscape(movie.title) + '" loading="lazy">',
      '    <span class="poster-shade"></span>',
      '    <span class="card-badge">' + htmlEscape(movie.category) + '</span>',
      '    <span class="card-year">' + htmlEscape(movie.year) + '</span>',
      '  </a>',
      '  <div class="card-body">',
      '    <h3><a href="' + htmlEscape(movie.url) + '">' + htmlEscape(movie.title) + '</a></h3>',
      '    <p>' + htmlEscape(movie.oneLine) + '</p>',
      '    <div class="card-meta">',
      '      <span>' + htmlEscape(movie.region) + '</span>',
      '      <span>' + htmlEscape(movie.type) + '</span>',
      '      <span>' + htmlEscape(movie.genre) + '</span>',
      '    </div>',
      '  </div>',
      '</article>'
    ].join('');
  }

  function initSearchPage() {
    var results = one('[data-search-results]');
    var status = one('[data-search-status]');
    var input = one('[data-search-input]');
    if (!results || !status || !window.SEARCH_INDEX) {
      return;
    }
    var params = new URLSearchParams(window.location.search);
    var initial = params.get('q') || '';
    if (input) {
      input.value = initial;
    }
    if (!initial.trim()) {
      return;
    }
    var query = norm(initial);
    var matches = window.SEARCH_INDEX.filter(function (movie) {
      var haystack = norm([
        movie.title,
        movie.year,
        movie.region,
        movie.type,
        movie.genre,
        movie.tags,
        movie.oneLine,
        movie.category
      ].join(' '));
      return haystack.indexOf(query) !== -1;
    }).slice(0, 120);
    status.textContent = matches.length ? '搜索结果：' + initial : '没有找到匹配的影片';
    results.innerHTML = matches.length ? matches.map(searchCard).join('') : '';
  }

  function initPlayer() {
    var box = one('.js-player');
    if (!box) {
      return;
    }
    var video = one('.js-player-video', box);
    var overlay = one('.js-player-overlay', box);
    var source = window.playerSource;
    var loaded = false;
    var hls = null;

    function attach() {
      if (!video || !source || loaded) {
        return;
      }
      if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({ enableWorker: true, lowLatencyMode: true });
        hls.loadSource(source);
        hls.attachMedia(video);
      } else {
        video.src = source;
      }
      loaded = true;
    }

    function start() {
      attach();
      if (overlay) {
        overlay.classList.add('is-hidden');
      }
      video.controls = true;
      var promise = video.play();
      if (promise && promise.catch) {
        promise.catch(function () {
          if (overlay) {
            overlay.classList.remove('is-hidden');
          }
        });
      }
    }

    if (overlay && video) {
      overlay.addEventListener('click', start);
    }
    if (video) {
      video.addEventListener('click', function () {
        if (!loaded || video.paused) {
          start();
        } else {
          video.pause();
        }
      });
      video.addEventListener('error', function () {
        if (overlay) {
          overlay.classList.remove('is-hidden');
          overlay.querySelector('strong').textContent = '播放加载失败，请稍后重试';
        }
      });
    }
    window.addEventListener('beforeunload', function () {
      if (hls) {
        hls.destroy();
      }
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    initMobileMenu();
    initHero();
    initFilters();
    initSearchPage();
    initPlayer();
  });
})();
