(function () {
  function setupPlayer(videoId, layerId, url) {
    var video = document.getElementById(videoId);
    var layer = document.getElementById(layerId);
    if (!video || !layer || !url) {
      return;
    }

    var attached = false;

    function attach() {
      if (attached) {
        return;
      }
      attached = true;
      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = url;
      } else if (window.Hls && window.Hls.isSupported()) {
        var hls = new window.Hls({ enableWorker: true, lowLatencyMode: true });
        hls.loadSource(url);
        hls.attachMedia(video);
        video.hlsController = hls;
      } else {
        video.src = url;
      }
    }

    function play() {
      attach();
      video.controls = true;
      layer.hidden = true;
      var started = video.play();
      if (started && typeof started.catch === "function") {
        started.catch(function () {
          layer.hidden = false;
        });
      }
    }

    layer.addEventListener("click", play);
    video.addEventListener("click", function () {
      if (video.paused) {
        play();
      }
    });
  }

  window.setupPlayer = setupPlayer;
})();
