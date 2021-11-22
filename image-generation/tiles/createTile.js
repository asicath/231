const { createCanvas, loadImage } = require('canvas');
const { exportCanvasToJpg, exportCanvasToPng } = require('./export');
const Perlin = require('./perlin');

const count = 10;

(async () => {

    const width = 1024*2;
    const height = 1024*2;

    // create the height map
    const canvasHeight = createCanvas(width, height);
    drawBackground(canvasHeight, {back:'fff'});

    Perlin.initPattern();
    const rawMap = Perlin.getFractalNoiseMap(width, height);
    const compressedMap = Perlin.compressMap(rawMap, width, height);
    drawMap(canvasHeight, compressedMap, width, height);

    // spec
    const canvasSpec = createCanvas(width, height);
    const shiftedMap = Perlin.shiftMap(compressedMap, -0.9/2, width, height);
    drawMap(canvasSpec, shiftedMap, width, height);

    // now the color
    const canvasColor = createCanvas(width, height);

    // draw the colors
    fillTiles(canvasColor);

    // then the grout
    drawTilesFromPath(drawSquareTilePath, canvasColor, canvasHeight, canvasSpec);

    await exportCanvasToJpg({canvas: canvasColor, filename:'Z:\\git\\Tiles\\Tiles\\Assets\\Textures\\02-color.jpg'});
    await exportCanvasToPng({canvas: canvasSpec, filename:'Z:\\git\\Tiles\\Tiles\\Assets\\Textures\\02-spec.png'});
    await exportCanvasToJpg({canvas: canvasHeight, filename:'Z:\\git\\Tiles\\Tiles\\Assets\\Textures\\02-height.jpg'});
    await exportCanvasToJpg({canvas: canvasHeight, filename:'Z:\\git\\Tiles\\Tiles\\Assets\\Textures\\02-nrm.jpg'});
})();

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

function drawSquareTilePath(canvas, count) {
    const ctx = canvas.getContext('2d');

    const size = canvas.width / count;

    ctx.beginPath();

    // vertical lines
    for (let y = 0; y < count; y++) {
        ctx.moveTo(0, y * size);
        ctx.lineTo(canvas.width, y * size);
    }
    // horizontal lines
    for (let x = 0; x < count; x++) {
        ctx.moveTo(x * size, 0);
        ctx.lineTo(x * size, canvas.height);
    }
}



function fillTiles(canvasColor) {
    const ctx = canvasColor.getContext('2d');
    const colors = ['#000', '#fff'];

    // areas
    const size = canvasColor.width / count;
    for (let x = 0; x < count; x++) {
        let i = x;
        for (let y = 0; y < count; y++) {
            i += 1;
            ctx.fillStyle = colors[i % colors.length];
            ctx.fillRect(x * size, y * size, size, size);
        }
    }

}

function drawTilesFromPath(drawPath, canvasColor, canvasHeight, canvasSpec) {

    const ctx = canvasColor.getContext('2d');
    const ctxHeight = canvasHeight.getContext('2d');
    const ctxSpec = canvasSpec.getContext('2d');

    const lineSize = canvasColor.width / 1024;

    // divide the tiles

    const size = 1.5;

    // grout color
    drawPath(canvasColor, count);

    const groutColor = '#666';
    ctx.strokeStyle = groutColor;
    ctx.lineWidth = lineSize * size;
    ctx.stroke();

    // grout height
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

    // grout specularity
    drawPath(canvasSpec, count);
    ctxSpec.strokeStyle = `rgb(0,0,0)`;
    ctxSpec.lineWidth = lineSize * size;
    ctxSpec.stroke();

}