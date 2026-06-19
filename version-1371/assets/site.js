(function () {
  function ready(fn) {
    if (document.readyState !== "loading") {
      fn();
    } else {
      document.addEventListener("DOMContentLoaded", fn);
    }
  }

  ready(function () {
    var toggle = document.querySelector(".nav-toggle");
    if (toggle) {
      toggle.addEventListener("click", function () {
        document.body.classList.toggle("nav-open");
      });
    }

    document.querySelectorAll("img").forEach(function (img) {
      img.addEventListener("error", function () {
        img.style.display = "none";
      });
    });

    var slides = Array.prototype.slice.call(document.querySelectorAll(".hero-slide"));
    var dots = Array.prototype.slice.call(document.querySelectorAll(".hero-dot"));
    var active = 0;

    function showSlide(index) {
      if (!slides.length) {
        return;
      }
      active = (index + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle("active", i === active);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle("active", i === active);
      });
    }

    dots.forEach(function (dot, i) {
      dot.addEventListener("click", function () {
        showSlide(i);
      });
    });

    if (slides.length > 1) {
      window.setInterval(function () {
        showSlide(active + 1);
      }, 5200);
    }

    var searchInput = document.getElementById("siteSearch");
    var sortSelect = document.getElementById("sortSelect");
    var filterButtons = Array.prototype.slice.call(document.querySelectorAll(".filter-btn"));
    var currentFilter = "全部";

    function allCards() {
      return Array.prototype.slice.call(document.querySelectorAll(".movie-card"));
    }

    function applyFilter() {
      var query = searchInput ? searchInput.value.trim().toLowerCase() : "";
      allCards().forEach(function (card) {
        var text = [
          card.getAttribute("data-title"),
          card.getAttribute("data-year"),
          card.getAttribute("data-genre"),
          card.getAttribute("data-region")
        ].join(" ").toLowerCase();
        var typeMatched = currentFilter === "全部" || text.indexOf(currentFilter.toLowerCase()) !== -1;
        var queryMatched = query === "" || text.indexOf(query) !== -1;
        card.classList.toggle("hidden-card", !(typeMatched && queryMatched));
      });
    }

    function applySort() {
      if (!sortSelect) {
        return;
      }
      var grid = document.querySelector(".movie-grid.sortable");
      if (!grid) {
        return;
      }
      var cards = allCards();
      var value = sortSelect.value;
      cards.sort(function (a, b) {
        if (value === "year") {
          return Number(b.getAttribute("data-year")) - Number(a.getAttribute("data-year"));
        }
        if (value === "score") {
          return Number(b.getAttribute("data-score")) - Number(a.getAttribute("data-score"));
        }
        if (value === "title") {
          return String(a.getAttribute("data-title")).localeCompare(String(b.getAttribute("data-title")), "zh-Hans-CN");
        }
        return 0;
      });
      cards.forEach(function (card) {
        grid.appendChild(card);
      });
      applyFilter();
    }

    if (searchInput) {
      searchInput.addEventListener("input", applyFilter);
    }

    if (sortSelect) {
      sortSelect.addEventListener("change", applySort);
    }

    filterButtons.forEach(function (button) {
      button.addEventListener("click", function () {
        currentFilter = button.getAttribute("data-filter") || "全部";
        filterButtons.forEach(function (item) {
          item.classList.toggle("active", item === button);
        });
        applyFilter();
      });
    });

    if (filterButtons.length) {
      filterButtons[0].classList.add("active");
    }
  });
})();
