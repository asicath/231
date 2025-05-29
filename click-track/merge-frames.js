const ImageHelper = require('./image-helper');
const { createCanvas, loadImage } = require('canvas');
const fs = require('fs');

async function loadImageData(filepath) {
    const img = await loadImage(filepath);
    const canvas = createCanvas(img.width, img.height);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);
    const data = ctx.getImageData(0, 0, img.width, img.height);
    return data;
}

async function writeImageData(filename, data) {
    const canvas = createCanvas(1920, 1080);
    const ctx = canvas.getContext('2d');
    ctx.putImageData(data, 0, 0);

    await ImageHelper.exportCanvasToJpg({canvas, filename})
}

function mergeImageData(img1, img2, percent = 0.5) {
    for (let i = 0; i < img1.data.length; i++) {
        img1.data[i] = Math.floor(img1.data[i] * (1 - percent) + img2.data[i] * percent);
    }
}

function padLeft(s, length) {
    while (s.length < length) {s = "0" + s;}
    return s;
}

//000042056

(async () => {

    const path1 = `./output/aleph/drum11/`;
    const path2 = `./output/aleph/timer11/`;
    const path3 = `./output/aleph/merged/`;

    const start1 = 42056;
    const start2 = 0;
    let i = 0;

    while (true) {
        const key1 = padLeft((i + start1).toString(), 9);
        const key2 = padLeft((i + start2).toString(), 9);
        const filepath1 = `${path1}${key1}.jpg`;
        const filepath2 = `${path2}${key2}.jpg`;
        const filepath3 = `${path3}${key1}.jpg`;

        if (!fs.existsSync(filepath1)) break;

        const img1 = await loadImageData(filepath1);
        const img2 = await loadImageData(filepath2);

        const percent = i / 125;
        mergeImageData(img1, img2, percent);

        await writeImageData(filepath3, img1);

        console.log(filepath3);

        i++;
    }

})();
