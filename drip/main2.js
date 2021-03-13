
window.requestAnimFrame = ( function() {
    return  window.requestAnimationFrame       ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame    ||
        window.oRequestAnimationFrame      ||
        window.msRequestAnimationFrame     ||
        function (callback, element) {
            window.setTimeout(callback, 1000 / 60);
        };
})();


function initPageJs() {

    const id = '#seal';
    const canvas = $(id)[0];
    const width = canvas.width;
    const height = canvas.height;

    const board = new Board(width, height);

    // initial pour
    let center = {
        x: Math.floor(width/2),
        y: Math.floor(height/2)
    };

    const baseAmount = 10000000;
    board.pixels[center.x][center.y].value = 10000000;
    //board.pixels[center.x][center.y-1].value = 10000000;
    //board.pixels[center.x][center.y+1].value = 10000000;
    //board.pixels[center.x-1][center.y].value = 10000000;
    //board.pixels[center.x+1][center.y].value = 10000000;

    let mult = 1.1;
    setInterval(() => {
        console.log(mult);

        const angle = Math.random() * Math.PI * 2;
        const radiusMax = 0.49;
        const x = center.x + Math.floor(Math.sin(angle) * width * Math.random() * radiusMax);
        const y = center.y + Math.floor(Math.cos(angle) * height * Math.random() * radiusMax);

        board.pixels[x][y].value = baseAmount*mult;

        //mult = mult * 1.5;
    }, 1000);

    $(document).ready(function () {
        //$('body').css('background-color', state.config.background);

        startDrawing();
    });

    const frameDurationTarget = 1000 / 60;
    let lastUpdate = Date.now();
    function update() {

        // update the model!
        executeRound(board);

        const now = Date.now();
        const frameTime = now - lastUpdate;
        lastUpdate = now;
        setTimeout(() => {
            update();
        }, Math.max(0, frameDurationTarget - frameTime));
    }
    update();


    // update the drawing
    function startDrawing() {
        requestAnimFrame(startDrawing);
        drawFrame();
    }

    function drawFrame() {
        // get the canvas and init
        const context = canvas.getContext('2d');
        context.webkitImageSmoothingEnabled = true;

        // clear the whole field
        context.clearRect(0, 0, width, height);

        drawPixelsToCanvas(canvas, board.pixels);
    }

}

function drawPixelsToCanvas(canvas, pixels) {
    const width = canvas.width;
    const height = canvas.height;
    const ctx = canvas.getContext('2d');
    const idata = ctx.getImageData(0, 0, width, height);
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const pixel = pixels[x][y];

            let c = pixel.value === 0 ? 0 : Math.floor(Math.log(pixel.value) * 20);

            //let c = Math.min(pixel.value * 1, 255);

            if (c > 0) {
                let i = 0;
            }

            c = Math.min(255, c);

            idata.data[(x + y * width) * 4 + 0] = c;
            idata.data[(x + y * width) * 4 + 1] = c;
            idata.data[(x + y * width) * 4 + 2] = c;
            idata.data[(x + y * width) * 4 + 3] = 255;
        }
    }
    ctx.putImageData(idata, 0, 0);
}

// model

class Board {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.initPixels();
    }

    initPixels() {
        this.pixels = [];
        this.pixelList = [];

        for (let x = 0; x < this.width; x++) {
            this.pixels[x] = [];
            for (let y = 0; y < this.height; y++) {
                const pixel = new Pixel(x, y, 0);
                this.pixels[x][y] = pixel;
                this.pixelList.push(pixel);
            }
        }

        // find their neighbors
        this.pixelList.forEach(this.initNeighbors.bind(this));
    }

    initNeighbors(pixel) {

        const board = this;
        function tryAddNeighbor(x, y) {
            if (x >= 0 && y >= 0 && x < board.width - 1 && y < board.height - 1) {
                const p = board.getPixel(x, y);
                pixel.neighbors.push({src: pixel, des: p, force:0});
            }
        }

        pixel.neighbors = [];
        tryAddNeighbor(pixel.x, pixel.y - 1); // up
        tryAddNeighbor(pixel.x, pixel.y + 1); // down
        tryAddNeighbor(pixel.x - 1, pixel.y); // left
        tryAddNeighbor(pixel.x + 1, pixel.y); // right
    }

    getPixel(x, y) {
        return this.pixels[x][y];
    }

    forEachPixel(fn) {
        for (let x = 0; x < this.width; x++) {
            for (let y = 0; y < this.height; y++) {
                fn(x, y, this.getPixel(x,y));
            }
        }
    }
}

class Pixel {
    constructor(x, y, value = 0) {
        this.x = x;
        this.y = y;
        this.value = value
        this.currentForce = 0;

        this.valueNext = null;
        this.incoming = null;

        this.random = Math.random();
    }
}



function executeRound(board) {

    // the volume that is ignored, everything else will try to move
    const ignoreValue = 10;
    const percentToUse = 0.5;

    // queue up the value having pixels and sort
    for (let i = 0; i < board.pixelList.length; i++) {
        const pixel = board.pixelList[i];

        // this is how much will come in, calculated in the next step
        pixel.incoming = 0;

        let volumeInPlay = (pixel.value - ignoreValue) * percentToUse;

        // ignore anything not activated yet
        if (volumeInPlay < 0.0001) {
            pixel.outgoing = 0;
            continue;
        }

        // calculate force for each other
        pixel.currentForce = volumeInPlay / 4; // pushing towards each side

        // this is how much will leave
        pixel.outgoing = pixel.currentForce * pixel.neighbors.length;
    }

    // resolve the forces
    for (let i = 0; i < board.pixelList.length; i++) {
        const pixel = board.pixelList[i];

        // get the incoming
        for (let j = 0; j < pixel.neighbors.length; j++) {
            const n = pixel.neighbors[j];
            pixel.incoming += n.des.currentForce;
        }

        // resolve in vs out
        pixel.value += pixel.incoming - pixel.outgoing;
    }

}






