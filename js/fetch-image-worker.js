onmessage = (e) => {
    console && console.log('fetching images');

    const images = e.data;

    images.forEach(img => {

        fetch(img.src, {
            method: 'GET',
            mode: 'no-cors',
            cache: 'default'
        }).then(response => {
            return response.blob();
        }).then(_ => postMessage([img.id, img.src]));

    });
}
