if (navigator.serviceWorker && location.protocol === 'https:') {
    window.addEventListener('load', function () {
        navigator.serviceWorker.register('/sw.js')
            .then(function (reg) {
                // console.log('Service worker registered.', reg);
            });
    });
}