const {createCanvas, loadImage} = require('canvas');
const {mixHexColors, mergeRGB} = require('./color-mix');


async function exportCanvasToImage(canvas, name) {
    return new Promise((resolve, reject) => {
        const fs = require('fs');
        const filename = `${__dirname}/output/${name}.jpg`;

        //const stream = canvas.createPNGStream();

        const stream = canvas.createJPEGStream({
            quality: 1,
            chromaSubsampling: false, progressive: false
        });
        const out = fs.createWriteStream(filename);
        stream.pipe(out);
        out.on('finish', () => {
            console.log(`${filename} was created.`);
            resolve();
        });

    });
}

(async () => {
    const width = 1080;
    const height = 1080;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    // blues
    // const c0 = '0085ca';
    // const c1 = '001489';

    const c0 = 'BB29BB';
    const c1 = '440099';

    //const c0 = 'ff0000';
    //const c1 = '0000ff';

    const parts = 21;
    const partWidth = width / parts;

    for (let i = 0; i < parts; i++) {
        const percent = i / (parts - 1);

        const c = mixHexColors(c0, c1, percent);
        ctx.fillStyle = "#" + c;
        ctx.fillRect(Math.floor(partWidth * i), 0, Math.floor(partWidth+2), canvas.height * 0.5);

        const cBAD = mergeRGB(c0, c1, percent);
        console.log(cBAD);
        ctx.fillStyle = "#" + cBAD;
        ctx.fillRect(Math.floor(partWidth * i), canvas.height * 0.5, Math.floor(partWidth+2), canvas.height * 0.5);
    }

    await exportCanvasToImage(canvas, 'gradient');

})();

function drawBackground(canvas, color) {
    let ctx = canvas.getContext('2d');
    ctx.fillStyle = "#" + color.back;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}