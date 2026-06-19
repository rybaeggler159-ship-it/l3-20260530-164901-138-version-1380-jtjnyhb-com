(function () {
  document.querySelectorAll('[data-player]').forEach(function (box) {
    var video = box.querySelector('video');
    var button = box.querySelector('.play-layer');
    var src = box.getAttribute('data-source');
    var hlsInstance = null;

    function attachSource() {
      if (!video || !src) {
        return;
      }

      if (window.Hls && window.Hls.isSupported()) {
        if (!hlsInstance) {
          hlsInstance = new window.Hls({
            enableWorker: true,
            lowLatencyMode: true
          });
          hlsInstance.loadSource(src);
          hlsInstance.attachMedia(video);
        }
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        if (video.src !== src) {
          video.src = src;
        }
      } else if (video.src !== src) {
        video.src = src;
      }
    }

    function startPlay() {
      attachSource();
      box.classList.add('is-playing');
      var playPromise = video.play();
      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(function () {
          box.classList.remove('is-playing');
        });
      }
    }

    if (button) {
      button.addEventListener('click', startPlay);
    }

    if (video) {
      video.addEventListener('click', function () {
        if (video.paused) {
          startPlay();
        }
      });
      video.addEventListener('play', function () {
        box.classList.add('is-playing');
      });
      video.addEventListener('pause', function () {
        if (!video.ended) {
          box.classList.remove('is-playing');
        }
      });
    }
  });
}());
