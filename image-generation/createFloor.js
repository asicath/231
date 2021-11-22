const { createCanvas, loadImage } = require('canvas');
const {paths, cards} = require('./data');
const {applyMask, getColorField} = require('./mask');

function exportCanvasToImage(canvas, name) {
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

    const factor = 100;
    const width = 37*factor;
    const height = 27.5*factor
    const canvas = createCanvas(width, height);


    drawBackground(canvas, {back:'fff'});

    // draw the bands
    //let ctx = canvas.getContext('2d');


    drawBand(canvas, factor, 1, 1, paths["3"].colors[1]);
    drawBand(canvas, factor, 2, 1, paths["3"].colors[0]);
    drawBand(canvas, factor, 3, 1, paths["10"].colors[0]);

    // 4, 5, 6 - triangles
    drawBand(canvas, factor, 4, 3, paths["4"].colors[1]);
    drawTriangles(canvas, factor, 4, 3, paths["5"].colors[1]);

    drawBand(canvas, factor, 7, 1, paths["6"].colors[1]);
    // 8,9 - white

    // 10 + .5 - sephiroth
    sephirothBand(canvas, factor, 10, 1.5);

    // green on pink 2.5 / 10 / 2.5
    drawBand(canvas, factor, 11.5, 15, paths["6"].colors[0]);
    drawSpades(canvas, factor, 14,10, paths["7"].colors[1])

    // 10 + .5 - sephiroth
    sephirothBand(canvas, factor, 26.5, 1.5);

    // 28,29 white

    drawBand(canvas, factor, 30, 1, paths["8"].colors[1]);
    drawBand(canvas, factor, 31, 1, paths["9"].colors[1]);

    // 32 white

    // 33,34,35 black and white squares
    drawBand(canvas, factor, 33, 3, paths["3"].colors[1]);

    (() => {
        let squareWidth = (factor*3) * 0.9 / 2;
        let squareBuffer = (factor*3) * 0.1 / 3;
        let ctx = canvas.getContext('2d');
        ctx.fillStyle = "#fff";

        let x0 = factor*33 + squareBuffer;
        let x1 = x0 + squareWidth + squareBuffer;
        let y = 0;

        while (y < canvas.height) {
            ctx.fillRect(x0, y, squareWidth, squareWidth);
            y += squareWidth + squareBuffer;
            ctx.fillRect(x1, y, squareWidth, squareWidth);
            y += squareWidth + squareBuffer;
        }

    })();


    // 1 white


    await exportCanvasToImage(canvas, `floor${factor}`);
})();

function drawTriangles(canvas, factor, index, width, color) {
    const count = 11;
    const unit = canvas.height / count;

    let ctx = canvas.getContext('2d');
    ctx.fillStyle = "#" + color.back;
    for (let i = 0; i < count; i++) {
        ctx.beginPath();
        ctx.moveTo( (index + width) * factor, unit * i);
        ctx.lineTo( index * factor, unit * (i+0.5));
        ctx.lineTo( (index + width) * factor, unit * (i+1));
        ctx.closePath();
        ctx.fill();
    }
}

function drawSpades(canvas, factor, index, width, color) {
    const count = 14;

    const unit = canvas.height / count;
    const widthUnit = (width / 10) * factor;

    const xOffset = index * factor;

    let ctx = canvas.getContext('2d');
    ctx.fillStyle = "#" + color.back;
    for (let i = 0; i < count; i++) {
        ctx.beginPath();
        ctx.moveTo( xOffset + 0, unit * i);
        ctx.lineTo( xOffset + widthUnit, unit * (i+0.5));
        ctx.lineTo( xOffset + 0, unit * (i+1));
        ctx.closePath();
        ctx.fill();
    }

    for (let n = 0; n < 4; n++) {
        for (let i = 0; i < count; i++) {
            ctx.beginPath();
            ctx.moveTo( xOffset + widthUnit * (2 + 2*n), unit * i);
            ctx.lineTo( xOffset + widthUnit * (1 + 2*n), unit * (i+0.5));
            ctx.lineTo( xOffset + widthUnit * (2 + 2*n), unit * (i+1));
            ctx.lineTo( xOffset + widthUnit * (3 + 2*n), unit * (i+0.5));
            ctx.closePath();
            ctx.fill();
        }
    }

    ctx.fillStyle = "#" + color.back;
    for (let i = 0; i < count; i++) {
        ctx.beginPath();
        ctx.moveTo( xOffset + widthUnit * 10, unit * i);
        ctx.lineTo( xOffset + widthUnit * 9, unit * (i+0.5));
        ctx.lineTo( xOffset + widthUnit * 10, unit * (i+1));
        ctx.closePath();
        ctx.fill();
    }
}

function sephirothBand(canvas, factor, index, width) {
    let ctx = canvas.getContext('2d');


    const height = canvas.height / 11;


    // malkuth
    ctx.fillStyle = "#" + paths["10"].colors[1].quartered[3];
    ctx.fillRect(factor*index, height*0, factor*width, height);
    (() => {
        const x0 = factor*index;
        const x1 = x0 + factor*width;
        const y0 = height*0;
        const y1 = y0 + height;
        const xCenter = (x0 + x1) / 2;
        const yCenter = (y0 + y1) / 2;

        // the three triangles
        ctx.beginPath();
        ctx.moveTo(xCenter, yCenter);
        ctx.lineTo(x0, y0);
        ctx.lineTo(x0, y1);
        ctx.closePath();
        ctx.fillStyle = "#" + paths["10"].colors[1].quartered[2];
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(xCenter, yCenter);
        ctx.lineTo(x0, y0);
        ctx.lineTo(x1, y0);
        ctx.closePath();
        ctx.fillStyle = "#" + paths["10"].colors[1].quartered[0];
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(xCenter, yCenter);
        ctx.lineTo(x1, y0);
        ctx.lineTo(x1, y1);
        ctx.closePath();
        ctx.fillStyle = "#" + paths["10"].colors[1].quartered[1];
        ctx.fill();

    })();

    ctx.fillStyle = "#" + paths["9"].colors[1].back;
    ctx.fillRect(factor*index, height*1, factor*width, height);

    ctx.fillStyle = "#" + paths["8"].colors[1].back;
    ctx.fillRect(factor*index, height*2, factor*width, height);

    ctx.fillStyle = "#" + paths["7"].colors[1].back;
    ctx.fillRect(factor*index, height*3, factor*width, height);

    ctx.fillStyle = "#" + paths["6"].colors[1].back;
    ctx.fillRect(factor*index, height*4, factor*width, height);

    ctx.fillStyle = "#" + paths["5"].colors[1].back;
    ctx.fillRect(factor*index, height*5, factor*width, height);

    ctx.fillStyle = "#" + paths["4"].colors[1].back;
    ctx.fillRect(factor*index, height*6, factor*width, height);

    ctx.fillStyle = "#" + paths["d"].colors[1].back;
    ctx.fillRect(factor*index, height*7, factor*width, height);

    ctx.fillStyle = "#" + paths["3"].colors[1].back;
    ctx.fillRect(factor*index, height*8, factor*width, height);

    ctx.fillStyle = "#" + paths["2"].colors[1].back;
    ctx.fillRect(factor*index, height*9, factor*width, height);

    ctx.fillStyle = "#" + paths["1"].colors[0].back;
    ctx.fillRect(factor*index, height*10, factor*width, height);


}

function drawBand(canvas, factor, index, width, color) {
    let ctx = canvas.getContext('2d');
    ctx.fillStyle = "#" + color.back;
    ctx.fillRect(factor*index, 0, factor*width, canvas.height);
}

function drawBackground(canvas, color) {
    let ctx = canvas.getContext('2d');
    ctx.fillStyle = "#" + color.back;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}


