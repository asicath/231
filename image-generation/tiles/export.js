function exportCanvasToJpg({canvas, name = null, filename = null}) {
    return new Promise((resolve, reject) => {
        const fs = require('fs');

        if (filename === null) {
            filename = `${__dirname}/output/${name}.jpg`;
        }

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

function exportCanvasToPng({canvas, name = null, filename = null}) {
    return new Promise((resolve, reject) => {
        const fs = require('fs');

        if (filename === null) {
            filename = `${__dirname}/output/${name}.png`;
        }

        const stream = canvas.createPNGStream({
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


module.exports = {
    exportCanvasToJpg, exportCanvasToPng
}