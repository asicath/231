
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
    board.pixels[Math.floor(width/2)][Math.floor(height/2)].value = 10000000;
    let mult = 1.1;
    setInterval(() => {
        console.log(mult);
        let x = Math.floor(width/2);
        let y = Math.floor(height/2);

        const angle = Math.random() * Math.PI * 2;
        const radiusMax = 0.001;
        x += Math.floor(Math.sin(angle) * width * Math.random() * radiusMax);
        y += Math.floor(Math.cos(angle) * height * Math.random() * radiusMax);

        board.pixels[x][y].value = 10000000*mult;

        mult = mult * 1.5;
    }, 2000);

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

        this.valueNext = null;
        this.incoming = null;

        this.random = Math.random();
    }
}



function executeRound(board) {

    // queue up the value having pixels and sort
    const queue = [];
    board.forEachPixel((x, y, pixel) => {
        pixel.valueNext = pixel.value;
        pixel.incoming = [];
        if (pixel.value > 0) queue.push(pixel);
    });
    queue.sort((a, b) => {
        if (a.value < b.value) return 1;
        if (a.value > b.value) return -1;
        return 0;
    });

    // calculate how much each wants to move down to its neighbors
    queue.forEach(pixel => {
        determineIntentToMove(pixel, board)
    });

    // execute the moves
    board.forEachPixel((x, y, pixel) => {
        // change starting value to reflect what it has taken
        pixel.value = pixel.valueNext;

        // get total
        /*if (!pixel.incoming) return;
        pixel.incoming.forEach(move => {
            pixel.value += move.amount;
        });*/
    });
}

function determineIntentToMove(pixel, board) {

    // shouldn't happen, already filtered out
    if (pixel.value === 0) return null;

    // sort by value
    pixel.neighbors.sort((a, b) => {
        if (a.des.value < b.des.value) return -1;
        if (a.des.value > b.des.value) return 1;
        if (a.des.random < b.des.random) return -1;
        if (a.des.random > b.des.random) return 1;
        return 0;
    });

    // process each
    pixel.neighbors.forEach(n => {
        evalPixelToNext(pixel, n.des);
    });

}

function evalPixelToNext(p0, p1) {
    //if (p1.value === 0) {
    // needs at least one to transfer
    if (p0.valueNext > p1.valueNext) {

        let amount = Math.floor((p0.valueNext - p1.valueNext)/2);

        if (amount === 0) return;

        // remove one from future value
        p0.valueNext -= amount;

        // add to the incoming
        p1.incoming.push({
            from: p0,
            amount: amount
        });

        p1.valueNext += amount;
    }
    //}
}




