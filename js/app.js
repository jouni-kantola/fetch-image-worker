const images = Array.from(document.querySelectorAll('[data-image-src]'))
                .map(img => ({ id: img.id, src: img.getAttribute('data-image-src') }));

const worker = new Worker("/js/fetch-image-worker.js");
worker.onmessage = function (e) {
    const [id, src] = e.data;
    document.querySelector(`#${id}`).src = src;
};

worker.postMessage(images);
