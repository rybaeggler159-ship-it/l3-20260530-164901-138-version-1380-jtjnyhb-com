(function () {
    function ready(callback) {
        if (document.readyState !== 'loading') {
            callback();
        } else {
            document.addEventListener('DOMContentLoaded', callback);
        }
    }

    function escapeHtml(value) {
        return String(value || '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    function setupMenu() {
        var toggle = document.querySelector('[data-menu-toggle]');
        var panel = document.querySelector('[data-mobile-panel]');
        if (!toggle || !panel) {
            return;
        }
        toggle.addEventListener('click', function () {
            panel.classList.toggle('is-open');
        });
    }

    function setupHero() {
        var hero = document.querySelector('[data-hero]');
        if (!hero) {
            return;
        }
        var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
        var dotsWrap = hero.querySelector('[data-hero-dots]');
        var next = hero.querySelector('[data-hero-next]');
        var prev = hero.querySelector('[data-hero-prev]');
        var index = 0;
        if (slides.length <= 1) {
            return;
        }
        slides.forEach(function (_, i) {
            var dot = document.createElement('button');
            dot.type = 'button';
            dot.setAttribute('aria-label', '切换到第' + (i + 1) + '屏');
            dot.addEventListener('click', function () {
                show(i);
            });
            dotsWrap.appendChild(dot);
        });
        var dots = Array.prototype.slice.call(dotsWrap.querySelectorAll('button'));
        function show(nextIndex) {
            slides[index].classList.remove('is-active');
            dots[index].classList.remove('is-active');
            index = (nextIndex + slides.length) % slides.length;
            slides[index].classList.add('is-active');
            dots[index].classList.add('is-active');
        }
        next.addEventListener('click', function () {
            show(index + 1);
        });
        prev.addEventListener('click', function () {
            show(index - 1);
        });
        dots[0].classList.add('is-active');
        window.setInterval(function () {
            show(index + 1);
        }, 6500);
    }

    function cardTemplate(movie) {
        var tags = (movie.tags || []).slice(0, 3).map(function (tag) {
            return '<span>' + escapeHtml(tag) + '</span>';
        }).join('');
        return '' +
            '<article class="movie-card">' +
                '<a class="poster-link" href="' + escapeHtml(movie.file) + '" aria-label="' + escapeHtml(movie.title) + '">' +
                    '<img src="' + escapeHtml(movie.cover) + '" alt="' + escapeHtml(movie.title) + '" loading="lazy">' +
                    '<span class="play-dot">▶</span>' +
                '</a>' +
                '<div class="movie-card-body">' +
                    '<div class="movie-meta-line"><span>' + escapeHtml(movie.year) + '</span><span>' + escapeHtml(movie.region) + '</span></div>' +
                    '<h3><a href="' + escapeHtml(movie.file) + '">' + escapeHtml(movie.title) + '</a></h3>' +
                    '<p>' + escapeHtml(movie.oneLine || '') + '</p>' +
                    '<div class="tag-row">' + tags + '</div>' +
                '</div>' +
            '</article>';
    }

    function setupSearch() {
        var root = document.querySelector('[data-search-page]');
        if (!root || !window.SITE_SEARCH_INDEX) {
            return;
        }
        var keyword = root.querySelector('[data-search-keyword]');
        var category = root.querySelector('[data-search-category]');
        var year = root.querySelector('[data-search-year]');
        var region = root.querySelector('[data-search-region]');
        var results = root.querySelector('[data-search-results]');
        var params = new URLSearchParams(window.location.search);
        var initial = params.get('q') || '';
        keyword.value = initial;
        function fillSelect(select, values, label) {
            select.innerHTML = '<option value="">' + label + '</option>' + values.map(function (value) {
                return '<option value="' + escapeHtml(value) + '">' + escapeHtml(value) + '</option>';
            }).join('');
        }
        var movies = window.SITE_SEARCH_INDEX;
        var categories = Array.from(new Set(movies.map(function (m) { return m.categoryName; }))).filter(Boolean).sort();
        var years = Array.from(new Set(movies.map(function (m) { return m.year; }))).filter(Boolean).sort().reverse();
        var regions = Array.from(new Set(movies.map(function (m) { return m.region; }))).filter(Boolean).sort();
        fillSelect(category, categories, '全部分类');
        fillSelect(year, years, '全部年份');
        fillSelect(region, regions, '全部地区');
        function render() {
            var q = keyword.value.trim().toLowerCase();
            var cat = category.value;
            var y = year.value;
            var r = region.value;
            var filtered = movies.filter(function (movie) {
                var haystack = [movie.title, movie.region, movie.type, movie.year, movie.genre, movie.oneLine, (movie.tags || []).join(' ')].join(' ').toLowerCase();
                return (!q || haystack.indexOf(q) >= 0) &&
                    (!cat || movie.categoryName === cat) &&
                    (!y || movie.year === y) &&
                    (!r || movie.region === r);
            }).slice(0, 120);
            if (!filtered.length) {
                results.innerHTML = '<div class="empty-state">没有找到匹配的影片</div>';
                return;
            }
            results.innerHTML = filtered.map(cardTemplate).join('');
        }
        [keyword, category, year, region].forEach(function (input) {
            input.addEventListener('input', render);
            input.addEventListener('change', render);
        });
        render();
    }

    ready(function () {
        setupMenu();
        setupHero();
        setupSearch();
    });
})();
