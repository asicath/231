const fs = require('fs');
const { createCanvas, loadImage } = require('canvas');

(async () => {
    const width = 4096;
    const height = 4096;
    const canvas = createCanvas(width, height);
    drawBackground(canvas, "ffffff");

    for (let i = 0; i < 1; i++) {
        //drawInkBleed(canvas);
    }
    drawInkBleedLayers(canvas);

    //drawBez(canvas);

    await exportCanvasToImage(canvas, "../sample1");
})();

function easeInOutQuad(x) {
    return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
}

function easeInOutCubic(x) {
    return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}

function easeInOut(x, p) {

    if (x < 0.5) {
        const c = Math.pow(2, p-1);
        return c * Math.pow(x, p);
    }
    else {
        return 1 - Math.pow(-2 * x + 2, p) / 2;
    }
}

function drawInkBleedLayers(canvas) {
    const ctx = canvas.getContext('2d');

    const points = [];

    // create points
    let xDelta = 20;
    let xDeltaRange = 0;

    (() => {
        let x = 0;
        let yBase = Math.floor(canvas.height / 2); // TODO vary thisup and down
        let yVelocity = 0;

        let pointsBeforeRandomDown = 0;
        let pointsBeforeRandomUp = 0;

        let isComplete = false;

        let xMod = 0;
        while (!isComplete) {

            // find the last point
            if (x >= canvas.width) {
                x = canvas.width;
                isComplete = true;
            }

            // create the point
            let y = yBase;
            y += yVelocity;

            let r = Math.random();
            if (pointsBeforeRandomDown-- <= 0) {
                if (r > 0.6) {
                    yVelocity -= 3;
                    if (pointsBeforeRandomUp <= 0) pointsBeforeRandomUp = 10;
                }
            }

            if (pointsBeforeRandomUp-- <= 0) {

                if (r < 0.4) {
                    yVelocity += 3;
                    if (pointsBeforeRandomDown <= 0) pointsBeforeRandomDown = 10;
                }

            }


/*            y += Math.floor(Math.random() * canvas.height*0.1);
            let r = Math.random();
            if (r < 0.1) yBase += 10;
            if (r > 0.9) yBase -= 10;*/

            let xModNext = xDelta + Math.random() * xDeltaRange;
            const point = {
                x,
                y,

                xMod: 0,
                yMod: 0,

                // the min and max this point can wander left/right
                xModMin: xMod === 0 ? 0 : -xMod * 0.4,
                xModMax: isComplete ? 0 : xModNext * 0.4
            };
            points.push(point);

            // move to the right
            xMod = xModNext;
            x += xMod;
        }
    })();


    const layers = 20;
    const floatHorizontal = false;
    const floatVertical = true;
    const minYMove = 50;
    for (let i = 0; i < layers; i++) {
        //i = 127;
        let layerPercent = 1 - i / (layers-1);
        let bri = Math.floor(255 * easeInOutQuad(layerPercent));
        bri = Math.floor(255 * layerPercent);

        // draw it
        drawLayer2(canvas, ctx, reducePoints(points), bri, layerPercent);

        points.forEach(point => {

            // add to the yMod, moving the point down
            point.yMod = minYMove * i;
            if (floatVertical) point.yMod += Math.floor(Math.random() * 10);

            // simple randomness within range
            //point.xMod = (-xDelta + Math.floor(Math.random() * xDelta));

            if (floatHorizontal) {
                // moving
                const r = Math.random();

                if (r < 0.1) {
                    point.xMod -= 1;
                }
                if (r > 0.9) {
                    point.xMod += 1;
                }

                // limit to prevent overlap
                if (point.xMod > point.xModMax) point.xMod = point.xModMax;
                if (point.xMod < point.xModMin) point.xMod = point.xModMin;
            }
        });
    }

    // add some noise
    ctx.fillStyle = `rgba(255,255,255,0.015)`;
    points.forEach(point => {
        ctx.beginPath();
        let r = point.xModMax - point.xModMin;
        ctx.arc(point.x, point.y + point.yMod*0.66, r*4, 0, Math.PI*2);
        //ctx.fill();
    });

}

function reducePoints(points) {
    return points.map(p => {
        return {x: p.x + p.xMod, y: p.y + p.yMod};
    });
}



function drawLayer2(canvas, ctx, points, bri, layerPercent) {

    ctx.fillStyle = `rgba(${bri},${bri},${bri},1)`;
    ctx.beginPath();

    // lower right corner to lower left
    ctx.moveTo(canvas.width*1.1, canvas.height*1.1);
    ctx.lineTo(-canvas.width*0.1, canvas.height*1.1);
    // an up, but still offscreen
    ctx.lineTo(-canvas.width*0.1, points[0].y);

    // then the first point
    ctx.lineTo(points[0].x, points[0].y);

    let ease = easeInOutQuad;

    const steps = 30;
    const easeMax = 2;
    const easeMin = 2;
    for (let i = 0; i < points.length-1; i++) {
        const p0 = points[i];
        const p1 = points[i+1];

        const width = p1.x - p0.x;
        const height = p1.y - p0.y;

        //ease = i % 2 === 0 ? easeInOutQuad : easeInOutCubic;
        const easePower = layerPercent * (easeMax - easeMin) + easeMin;

        for (let j = 1; j < steps; j++) {
            const percent = j / steps;
            const x = p0.x + width * percent;
            const y = p0.y + height * easeInOut(percent, easePower);
            ctx.lineTo(x, y);
        }
        ctx.lineTo(p1.x, p1.y);
    }

    ctx.lineTo(canvas.width*1.1, points[points.length-1].y);
    ctx.closePath();

    ctx.fill();
}





function drawBackground(canvas, color) {
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = "#" + color;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function exportCanvasToImage(canvas, name) {
    return new Promise((resolve, reject) => {
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
