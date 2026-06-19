(function () {
  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
    } else {
      callback();
    }
  }

  function normalize(value) {
    return (value || "").toString().toLowerCase().trim();
  }

  function initMenu() {
    var button = document.querySelector("[data-menu-button]");
    var menu = document.querySelector("[data-mobile-menu]");
    if (!button || !menu) {
      return;
    }
    button.addEventListener("click", function () {
      menu.classList.toggle("is-open");
    });
  }

  function initHero() {
    var slides = Array.prototype.slice.call(document.querySelectorAll("[data-hero-slide]"));
    var dots = Array.prototype.slice.call(document.querySelectorAll("[data-hero-dot]"));
    if (slides.length < 2) {
      return;
    }
    var current = 0;
    function show(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, itemIndex) {
        slide.classList.toggle("is-active", itemIndex === current);
      });
      dots.forEach(function (dot, itemIndex) {
        dot.classList.toggle("is-active", itemIndex === current);
      });
    }
    dots.forEach(function (dot, index) {
      dot.addEventListener("click", function () {
        show(index);
      });
    });
    window.setInterval(function () {
      show(current + 1);
    }, 5200);
  }

  function initFilters() {
    var root = document.querySelector("[data-filter-root]");
    if (!root) {
      return;
    }
    var input = root.querySelector("[data-filter-input]");
    var region = root.querySelector("[data-filter-region]");
    var year = root.querySelector("[data-filter-year]");
    var cards = Array.prototype.slice.call(root.querySelectorAll("[data-movie-card]"));
    var empty = root.querySelector("[data-filter-empty]");
    var params = new URLSearchParams(window.location.search);
    var query = params.get("q");
    if (query && input) {
      input.value = query;
    }
    function apply() {
      var keyword = normalize(input ? input.value : "");
      var regionValue = normalize(region ? region.value : "");
      var yearValue = normalize(year ? year.value : "");
      var visible = 0;
      cards.forEach(function (card) {
        var text = normalize(card.getAttribute("data-text"));
        var cardRegion = normalize(card.getAttribute("data-region"));
        var cardYear = normalize(card.getAttribute("data-year"));
        var ok = true;
        if (keyword && text.indexOf(keyword) === -1) {
          ok = false;
        }
        if (regionValue && cardRegion !== regionValue) {
          ok = false;
        }
        if (yearValue && cardYear !== yearValue) {
          ok = false;
        }
        card.style.display = ok ? "" : "none";
        if (ok) {
          visible += 1;
        }
      });
      if (empty) {
        empty.style.display = visible ? "none" : "block";
      }
    }
    [input, region, year].forEach(function (element) {
      if (element) {
        element.addEventListener("input", apply);
        element.addEventListener("change", apply);
      }
    });
    apply();
  }

  function initPlayers() {
    var players = Array.prototype.slice.call(document.querySelectorAll(".player-box"));
    players.forEach(function (player) {
      var video = player.querySelector("video");
      var trigger = player.querySelector(".play-overlay");
      if (!video) {
        return;
      }
      var sourceNode = video.querySelector("source");
      var streamUrl = sourceNode ? sourceNode.src : video.currentSrc || video.src;
      var hlsInstance = null;
      function prepare() {
        if (!streamUrl) {
          return;
        }
        if (video.canPlayType("application/vnd.apple.mpegurl")) {
          if (!video.getAttribute("src")) {
            video.setAttribute("src", streamUrl);
          }
          return;
        }
        if (window.Hls && window.Hls.isSupported()) {
          if (!hlsInstance) {
            hlsInstance = new window.Hls({ enableWorker: true });
            hlsInstance.loadSource(streamUrl);
            hlsInstance.attachMedia(video);
          }
          return;
        }
        if (!video.getAttribute("src")) {
          video.setAttribute("src", streamUrl);
        }
      }
      function start() {
        prepare();
        player.classList.add("is-playing");
        var result = video.play();
        if (result && typeof result.catch === "function") {
          result.catch(function () {
            player.classList.remove("is-playing");
          });
        }
      }
      if (trigger) {
        trigger.addEventListener("click", start);
      }
      video.addEventListener("click", function () {
        if (video.paused) {
          start();
        }
      });
      video.addEventListener("play", function () {
        player.classList.add("is-playing");
      });
      video.addEventListener("ended", function () {
        player.classList.remove("is-playing");
      });
    });
  }

  ready(function () {
    initMenu();
    initHero();
    initFilters();
    initPlayers();
  });
})();
