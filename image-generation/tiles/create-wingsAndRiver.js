const { createCanvas, loadImage } = require('canvas');
const { exportCanvasToJpg, exportCanvasToPng } = require('./export');
const Perlin = require('./perlin');
const {fillDiamondGrid, drawDiamondPath} = require('./draw-diamondGrid');
const {fillRiverBands, traceRiverBands, getRiverPath} = require('./draw-river');
const {fillBandColor, drawBandPaths} = require('./draw-bands');
const { exec } = require("child_process");
const path = require('path');
const {traceSephirothWings, fillSephirothWings, fillFeatherColor, traceFeatherOutlines} = require('./draw-feathers');
const {all: colors} = require('./colors');

const count = 10;

async function execute() {

    const width = 1024 * 4;
    const height = 1024 * 4;

    // create the height map
    const canvasHeight = createCanvas(width, height);
    drawBackground(canvasHeight, {back: 'fff'});

    Perlin.initPattern();
    const rawMap = Perlin.getFractalNoiseMap(width, height);
    const compressedMap = Perlin.compressMap(rawMap, width, height);
    drawMap(canvasHeight, compressedMap, width, height);

    // spec
    const canvasSpec = createCanvas(width, height);
    const shiftedMap = Perlin.shiftMap(compressedMap, 0.3 / 2, width, height);
    drawMap(canvasSpec, shiftedMap, width, height);

    // then the grout
    renderGrout(combinedPathDraw, null, canvasHeight, canvasSpec);

    const root = 'Z:\\git\\Tiles\\Tiles\\Assets\\Textures'
    const folder = 'wings'
    await exportCanvasToPng({canvas: canvasSpec, filename: `${root}\\${folder}\\spec.png`});
    await exportCanvasToJpg({canvas: canvasHeight, filename: `${root}\\${folder}\\height.jpg`});
    await exportCanvasToJpg({canvas: canvasHeight, filename: `${root}\\${folder}\\nrm.jpg`});

    const joinExec = `node ${path.resolve(__dirname, `../../image-join/join-alpha.js ${folder}`)}`;
    exec(joinExec, (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
    });


    // now the color
    const canvasColor = createCanvas(width, height);

    // draw the colors
    combinedFillColor(canvasColor);
    renderGrout(combinedPathDraw, canvasColor, null, null);

    await exportCanvasToJpg({canvas: canvasColor, filename: `${root}\\${folder}\\color.jpg`});
}





function renderGrout(drawPath, canvasColor = null, canvasHeight = null, canvasSpec = null) {

    const lineSize = (canvasColor || canvasHeight || canvasSpec).width / 1024;
    const size = 1.5;

    // 1. grout color
    if (canvasColor) {
        const ctx = canvasColor.getContext('2d');

        drawPath(canvasColor, count);

        const groutColor = '#666';
        ctx.strokeStyle = groutColor;
        ctx.lineWidth = lineSize * size;
        ctx.stroke();
    }

    // 2. grout height
    if (canvasHeight) {
        const ctxHeight = canvasHeight.getContext('2d');
        drawPath(canvasHeight, count);

        ctxHeight.strokeStyle = "#777";
        ctxHeight.lineWidth = lineSize * size * 1.5;
        ctxHeight.stroke();

        ctxHeight.strokeStyle = "#666";
        ctxHeight.lineWidth = lineSize * size;
        ctxHeight.stroke();

        ctxHeight.strokeStyle = "#444";
        ctxHeight.lineWidth = lineSize * size * 0.5;
        ctxHeight.stroke();
    }

    // 3. grout specularity
    if (canvasSpec) {
        const ctxSpec = canvasSpec.getContext('2d');
        drawPath(canvasSpec, count);
        ctxSpec.strokeStyle = `rgb(0,0,0)`;
        ctxSpec.lineWidth = lineSize * size;
        ctxSpec.stroke();
    }

}

function drawBackground(canvas, color) {
    let ctx = canvas.getContext('2d');
    ctx.fillStyle = "#" + color.back;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawMap(canvas, map, width, height) {
    let ctx = canvas.getContext('2d');

    for (let y = 0; y < width; y++) {
        for (let x = 0; x < height; x++) {
            const n = map[x][y];
            const rgb = Math.round(255 * n);
            ctx.fillStyle = "rgba(" + rgb + "," + rgb + "," + rgb + ",1.0)";
            ctx.fillRect(x, y, 1, 1);
        }
    }
}

function drawMapAlpha(canvas, map, width, height) {
    let ctx = canvas.getContext('2d');

    for (let y = 0; y < width; y++) {
        for (let x = 0; x < height; x++) {
            const n = map[x][y];
            const rgb = Math.round(255 * n);
            ctx.fillStyle = `rgba(${rgb},${rgb},${rgb},${n})`;
            ctx.fillRect(x, y, 1, 1);
        }
    }
}



function combinedPathDraw(canvas) {
    const ctx = canvas.getContext('2d');

    ctx.beginPath();

    // first the bands
    //drawBandPaths({canvas, ctx, bandWidth});

    const squareWidth = (canvas.width / 24);

    const riverWidth = canvas.width*1/3;
    const riverMargins = squareWidth * 2;

    const wingsWidth = canvas.width - riverWidth - squareWidth * 2;

    traceRiverBands({
        ctx,
        xStart: riverMargins,
        yStart: 0,
        width: riverWidth - riverMargins,
        height: canvas.height
    });

    traceFeatherOutlines({
        ctx,
        xStart: canvas.width*1/3,
        yStart: 0,
        width: wingsWidth,
        height: canvas.height
    });

    // fill the b&w squares
    [(riverWidth + wingsWidth), 0].forEach(x => {
        for (let i = 0; i < 24; i++) {
            const y = squareWidth * i;
            ctx.moveTo(x, y);
            ctx.lineTo(x + squareWidth * 2, y);
        }

        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.moveTo(x + squareWidth, 0);
        ctx.lineTo(x + squareWidth, canvas.height);
        ctx.moveTo(x + squareWidth * 2, 0);
        ctx.lineTo(x + squareWidth * 2, canvas.height);
    });
}

function combinedFillColor(canvas) {
    const ctx = canvas.getContext('2d');

    // a base of white
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    //fillBandColor({canvas, bandWidth});

    // margin squares
    const squareWidth = (canvas.width / 24);

    const riverWidth = canvas.width*1/3;
    const riverMargins = squareWidth * 2;

    const wingsWidth = canvas.width - riverWidth - squareWidth * 2;


    fillRiverBands({
        ctx,
        xStart: riverMargins,
        yStart: 0,
        width: riverWidth - riverMargins,
        height: canvas.height,
        margin: riverMargins/2
    });

    fillSephirothWings({
        ctx,
        xStart: riverWidth,
        yStart: 0,
        width: wingsWidth,
        height: canvas.height
    });

    // fill the b&w squares
    [(riverWidth + wingsWidth), 0].forEach(x => {
        for (let i = 0; i < 24; i++) {
            const y = squareWidth * i;
            ctx.fillStyle = i % 2 === 1 ? '#ffffff' : '#000000';
            ctx.fillRect(x, y, squareWidth, squareWidth);

            ctx.fillStyle = i % 2 === 0 ? '#ffffff' : '#000000';
            ctx.fillRect(x+squareWidth, y, squareWidth, squareWidth);
        }
    })


}



(async () => {
    await execute();
})();