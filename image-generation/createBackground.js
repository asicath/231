const { createCanvas, loadImage } = require('canvas');
const {paths, cards} = require('./data');

const fleckIt = require('./effects/flecks');
const rayIt = require('./effects/rays');
const drawGradient = require('./effects/gradient');
const quarterIt = require('./effects/quarter');
const {exportCanvasToImage} = require('./export');

(async () => {
    //await loadImages();
    await drawCards();
})();

async function drawCards() {
    for (let key in cards) {
        let card = cards[key];
        card.key = key;

        //if (key !== '1_t10') continue;
        if (!key.match(/t\d\d/)) continue;
        //if (!key.match(/^0_s02/)) continue;
        //if (!key.match(/t00/)) continue;
        //if (!key.match(/_[wc]10/)) continue;

        await drawCard(card);
    }
}

async function drawCard(card) {

    const layerCount = 4;
    //let outerSize = 2400;
    const outerSize = 1500;
    const width = 4000;

    const ratio = outerSize / 1200;
    const layerSize = 150 * ratio;
    const canvasSizeMax = outerSize;
    const canvasSizeMin = outerSize - layerSize * (layerCount-1);
    //const canvasSizeMin = outerSize * 0.01;

    const canvas = [];
    for (let n = 0; n < layerCount; n++) {
        const percentBase = n / (layerCount - 1);
        const percent = percentBase;
        //const percent = EasingFunctions.easeOutQuad(percentBase);

        let size = Math.floor(canvasSizeMin + (canvasSizeMax - canvasSizeMin) * (1-percent));
        let cWidth = n === 0 ? width : size;
        canvas.push(createCanvas(cWidth, size));
    }

    card.paths.forEach((pathKey, pathCount) => {

        const path = paths[pathKey];

        for (let i = 0; i < layerCount; i++) {
            //if (i > 0) continue;
            const color = path.colors[3 - i];
            //const color = path.colors[1];

            let targetCanvas = canvas[i];

            if (pathCount === 1) {
                targetCanvas = createCanvas(targetCanvas.width, targetCanvas.height);
            }

            // draw a whole field to this canvas
            drawSquare(targetCanvas, color, layerSize);
        }

    });

    let outputCanvas = canvas[0];
    for (let n = 1; n < layerCount; n++) {
        combineCanvas(canvas[n], outputCanvas);
    }

    await exportCanvasToImage(outputCanvas, `background/${card.key}`);
}

function combineCanvas(src, dest) {
    let x = (dest.width - src.width)/2;
    let y = (dest.height - src.height)/2;

    //grab the context from your destination canvas
    let destCtx = dest.getContext('2d');

    //call its drawImage() function passing it the source canvas directly
    destCtx.drawImage(src, x, y);
}

function drawSquare(canvas, color, layerSize) {

    drawBackground(canvas, color);

    if (color.hasOwnProperty('rayed')) rayIt(canvas, color);
    if (color.hasOwnProperty('quartered')) quarterIt(canvas, color);
    if (color.hasOwnProperty('circles')) drawCircles(canvas, color, layerSize);
    if (color.hasOwnProperty('gradient')) drawGradient(canvas, color, true);
    if (color.hasOwnProperty('flecked')) fleckIt(canvas, color);
}

function drawBackground(canvas, color) {
    let ctx = canvas.getContext('2d');
    ctx.fillStyle = "#" + color.back;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}
