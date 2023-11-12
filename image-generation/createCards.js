const { createCanvas, loadImage } = require('canvas');
const {paths, cards} = require('./data');

const fleckIt = require('./effects/flecks');
const rayIt = require('./effects/rays');
const drawGradient = require('./effects/gradient');
const quarterIt = require('./effects/quarter');
const {exportCanvasToImage} = require('./export');

const pipPlacement = {
    1: {
        type: 'onCircle',
        radiusPercent: 0,
        startAngle: 0
    },
    2: {
        type: 'onCircle',
        radiusPercent: 0.5,
        startAngle: 0
    },
    3: {
        type: 'onCircle',
        radiusPercent: 0.666,
        startAngle: 0
    },
    4: {
        type: 'onCircle',
        radiusPercent: 0.5,
        startAngle: 0
    },
    5: {
        type: 'onCircle',
        radiusPercent: 0.666,
        startAngle: 0
    },
    6: {
        type: 'onCircle',
        radiusPercent: 0.666,
        startAngle: 0
    },
    7: {
        type: 'onCircle',
        radiusPercent: 0.666,
        startAngle: 0
    },
    8: {
        type: 'onCircle',
        radiusPercent: 0.666,
        startAngle: 0
    },
    9: {
        type: 'onCircle',
        radiusPercent: 0.666,
        startAngle: 0
    },
    10: {
        type: 'onCircle',
        radiusPercent: 0.75,
        startAngle: 0
    }
};

let images = {};

(async () => {
    //await loadImages();
    await drawCards();
})();

async function loadImages() {
    let fileNames = ["tatva-fire.png", "tatva-water.png", "tatva-air.png", "tatva-earth.png"];
    fileNames.forEach(async filename => {
        let image = await loadImage(__dirname + "/tatvas/" + filename);
        //ctx.drawImage(image, 50, 0, 70, 70)
        images[filename] = image;
    });
}

async function drawCards() {
    for (let key in cards) {
        let card = cards[key];
        card.key = key;

        //if (!key.match(/^[2345]_/)) continue;
        //if (!key.match(/t\d\d/)) continue;
        //if (!key.match(/^0_s02/)) continue;
        if (!key.match(/t01/)) continue;
        //if (!key.match(/_[wc]10/)) continue;

        let pipImage = null;
        if (key.match(/w\d\d/)) pipImage = "tatva-fire.png";
        else if (key.match(/c\d\d/)) pipImage = "tatva-water.png";
        else if (key.match(/s\d\d/)) pipImage = "tatva-air.png";
        else if (key.match(/d\d\d/)) pipImage = "tatva-earth.png";

        await drawCard(card, pipImage);
    }
}

async function drawCard(card, pipImage) {

    let layerCount = 4;
    //let outerSize = 2400;
    let outerSize = 4096;
    let width = 4096;

    let ratio = outerSize / 1200;
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

        let path = paths[pathKey];

        for (let i = 0; i < layerCount; i++) {
            //if (i > 0) continue;

            let color = path.colors[3 - i];

            let targetCanvas = canvas[i];

            if (pathCount === 1) {
                targetCanvas = createCanvas(targetCanvas.width, targetCanvas.height);
            }

            // draw a whole field to this canvas
            drawSquare(targetCanvas, color, layerSize);

            // draw half to the current canvas if this is the secondary
            if (pathCount === 1) {
                combineHalf(targetCanvas, canvas[i]);
            }
        }

    });

    // draw the pips
    drawPips(canvas[3], card, pipImage);

    let outputCanvas = canvas[0];
    for (let n = 1; n < layerCount; n++) {
        combineCanvas(canvas[n], outputCanvas);
    }

    await exportCanvasToImage(outputCanvas, "background/" + card.key);
}

function combineCanvas(src, dest) {
    let x = (dest.width - src.width)/2;
    let y = (dest.height - src.height)/2;

    //grab the context from your destination canvas
    let destCtx = dest.getContext('2d');

    //call its drawImage() function passing it the source canvas directly
    destCtx.drawImage(src, x, y);
}

function combineHalf(src, dest) {
    let dx = 0;
    let dy = dest.height / 2;
    let dWidth = dest.width;
    let dHeight = dest.height / 2;

    let sx = 0;
    let sy = src.height / 2;
    let sWidth = src.width;
    let sHeight = src.height / 2;

    // make it the lower


    //grab the context from your destination canvas
    let destCtx = dest.getContext('2d');

    //call its drawImage() function passing it the source canvas directly
    destCtx.drawImage(src, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
}

function drawPips(canvas, card, pipImage) {
    let ctx = canvas.getContext('2d');

    if (!card.pips) return;

    let placementInfo = pipPlacement[card.pips];


    if (placementInfo.type === 'onCircle') {
        let dAngle = (Math.PI * 2) / card.pips;
        let startAngle = placementInfo.startAngle || -(Math.PI / 2);

        let radius = (canvas.height / 2) * placementInfo.radiusPercent;

        for (let i = 0; i < card.pips; i++) {

            // find coordinate
            let x = Math.cos(startAngle + dAngle * i) * radius + canvas.height / 2;
            let y = Math.sin(startAngle + dAngle * i) * radius + canvas.height / 2;

            // draw pip
            if (pipImage) {
                let pipSize = 300;
                ctx.drawImage(images[pipImage], x - pipSize / 2, y - pipSize / 2, pipSize, pipSize);
            }
            else {
                ctx.fillStyle = "#FFFFFF";
                ctx.beginPath();
                ctx.arc(x, y, 40, 0, 2 * Math.PI);
                ctx.fill();
            }

        }
    }

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
