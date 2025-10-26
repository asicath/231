const fs = require('fs');

async function exportCanvasToJpg({canvas, name = null, filename = null}) {
    return new Promise((resolve, reject) => {

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
            out.end(() => {
                resolve();
            });
        });
    });
}

module.exports = {
    exportCanvasToJpg
};
