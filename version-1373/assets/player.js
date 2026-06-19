(function () {
    function ready(callback) {
        if (document.readyState !== 'loading') {
            callback();
        } else {
            document.addEventListener('DOMContentLoaded', callback);
        }
    }

    function setupPlayer(player) {
        var video = player.querySelector('video');
        var cover = player.querySelector('[data-player-cover]');
        var button = player.querySelector('[data-player-button]');
        var source = player.getAttribute('data-video');
        var hls = null;
        var prepared = false;
        if (!video || !source) {
            return;
        }
        function prepare() {
            if (prepared) {
                return;
            }
            prepared = true;
            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = source;
            } else if (window.Hls && window.Hls.isSupported()) {
                hls = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true,
                    backBufferLength: 90
                });
                hls.loadSource(source);
                hls.attachMedia(video);
            } else {
                video.src = source;
            }
            video.setAttribute('controls', 'controls');
        }
        function start(event) {
            if (event) {
                event.preventDefault();
            }
            prepare();
            player.classList.add('is-playing');
            var playPromise = video.play();
            if (playPromise && typeof playPromise.catch === 'function') {
                playPromise.catch(function () {});
            }
        }
        if (cover) {
            cover.addEventListener('click', start);
        }
        if (button) {
            button.addEventListener('click', start);
        }
        video.addEventListener('click', function () {
            if (video.paused) {
                start();
            }
        });
        window.addEventListener('beforeunload', function () {
            if (hls && typeof hls.destroy === 'function') {
                hls.destroy();
            }
        });
    }

    ready(function () {
        Array.prototype.slice.call(document.querySelectorAll('[data-player]')).forEach(setupPlayer);
    });
})();
