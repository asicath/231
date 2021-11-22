const { createCanvas, loadImage } = require('canvas');
const { exportCanvasToJpg, exportCanvasToPng } = require('./export');
const Perlin = require('./perlin');
const {fillDiamondGrid, drawDiamondPath} = require('./draw-diamondGrid');
const { exec } = require("child_process");
const path = require('path');
const {all: colors} = require('./colors');

const count = 10;

async function execute() {

    const floorWidth = 0.117;
    const floorHeight = 0.18;

    const height = 1024 * 2;
    const width = Math.floor((height / floorHeight) * floorWidth);

    // create the height map
    const canvasHeight = createCanvas(width, height);
    drawBackground(canvasHeight, {back: 'fff'});

    Perlin.initPattern();
    const rawMap = Perlin.getFractalNoiseMap(width, height);
    const compressedMap = Perlin.compressMap(rawMap, width, height);
    drawMap(canvasHeight, compressedMap, width, height);

    // spec
    const canvasSpec = createCanvas(width, height);
    const shiftedMap = Perlin.shiftMap(compressedMap, -0.9 / 2, width, height);
    drawMap(canvasSpec, shiftedMap, width, height);

    // then the grout
    renderGrout(combinedPathDraw, null, canvasHeight, canvasSpec);

    await exportCanvasToPng({canvas: canvasSpec, filename: 'Z:\\git\\Tiles\\Tiles\\Assets\\Textures\\diamonds\\spec.png'});
    await exportCanvasToJpg({canvas: canvasHeight, filename: 'Z:\\git\\Tiles\\Tiles\\Assets\\Textures\\diamonds\\height.jpg'});
    await exportCanvasToJpg({canvas: canvasHeight, filename: 'Z:\\git\\Tiles\\Tiles\\Assets\\Textures\\diamonds\\nrm.jpg'});

    const joinExec = `node ${path.resolve(__dirname, '../../image-join/join-alpha.js diamonds')}`;
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

    await Promise.all(Object.keys(colors).map(async key => {
        // now the color
        const canvasColor = createCanvas(width, height);

        // draw the colors
        combinedFillColor(canvasColor, colors[key]);
        renderGrout(combinedPathDraw, canvasColor, null, null);

        await exportCanvasToJpg({canvas: canvasColor, filename: `Z:\\git\\Tiles\\Tiles\\Assets\\Textures\\diamonds\\color-${key}.jpg`});

    }));

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

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const n = map[x][y];
            const rgb = Math.round(255 * n);
            ctx.fillStyle = "rgba(" + rgb + "," + rgb + "," + rgb + ",1.0)";
            ctx.fillRect(x, y, 1, 1);
        }
    }
}

function drawMapAlpha(canvas, map, width, height) {
    let ctx = canvas.getContext('2d');

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
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

    // then the diamonds
    drawDiamondPath({
        ctx,
        horizontalCount: 4, // includes halves
        verticalCount: 11,
        xStart: 0,
        width: canvas.width,
        yStart: 0,
        height: canvas.height,
        margin: canvas.width * 0.15
    });
}

function combinedFillColor(canvas, sephirothColors) {
    const ctx = canvas.getContext('2d');

    // a base of white
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    fillDiamondGrid(Object.assign({
        ctx,
        horizontalCount: 4, // includes halves
        verticalCount: 11,

        xStart: 0,
        width: canvas.width,
        yStart: 0,
        height: canvas.height,
        margin: canvas.width * 0.15,

        diamondColor: sephirothColors.king,
        backgroundColor: sephirothColors.queen
    }));
}



(async () => {
    await execute();
})();