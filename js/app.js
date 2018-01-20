const domImages = Array.from(
  document.querySelectorAll("[data-image-src]")
).reduce((images, img) => {
  const imgSrc = img.getAttribute("data-image-src");
  const image = new Image();

  images[img.id] = {
    id: img.id,
    src: imgSrc,
    node: img,
    image
  };

  return images;
}, {});

// using img decoding API
// images downloaded with low priority
// test in Chrome Canary
function imgDecodeApiLoad() {
  Object.keys(domImages).forEach(id => {
    const { node, image, src } = domImages[id];
    image.src = src;

    image
      .decode()
      .then(() => {
        node.src = image.src;
      })
      .catch(() => {
        throw new Error("Could not load/decode big image.");
      });
  });
}

// using web worker
// web worker loads with priority high
// if cache enabled, will use memory cache when src set
function imgWorkerLoad() {
  const worker = new Worker("/js/fetch-image-worker.js");
  worker.onmessage = function(e) {
    const [id] = e.data;
    const { src, node } = domImages[id]; 
    node.src = src;
  };

  worker.postMessage(
    Object.keys(domImages).map(id => {
      return {
        id,
        src: domImages[id].src
      };
    })
  );
}

// using web worker & img decoding API
// web worker loads with priority high
// render when finished downloading
function imgWorkerWithDecodeLoad() {
  const worker = new Worker("/js/fetch-image-worker.js");

  worker.onmessage = function(e) {
    const [id, src] = e.data;

    domImages[id].image.src = src;

    domImages[id].image
      .decode()
      .then(() => {
        domImages[id].node.src = src;
      })
      .catch(() => {
        throw new Error("Could not load/decode big image.");
      });
  };

  worker.postMessage(
    Object.keys(domImages).map(id => {
      return {
        id,
        src: domImages[id].src
      };
    })
  );
}


imgWorkerLoad();
// imgDecodeApiLoad();
// imgWorkerWithDecodeLoad();
