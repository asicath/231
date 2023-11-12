
function exportCanvasToImage(canvas, name) {
    return new Promise((resolve, reject) => {
        const fs = require('fs');
        const filename = `${__dirname}/output/${name}.jpg`;
        const out = fs.createWriteStream(filename);
        //const stream = canvas.createPNGStream();
        const stream  = canvas.createJPEGStream({
            quality: 1,
            chromaSubsampling: false, progressive: false
        });


        stream.pipe(out);
        out.on('finish', () => {
            console.log(`${filename} was created.`);
            resolve();
        });
    });
}

module.exports = {exportCanvasToImage};
