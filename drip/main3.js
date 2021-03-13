
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
    board.pixels[center.x][center.y].value = baseAmount;

    function placeLine() {
        let xOffset = 0;
        let moving = 1;
        for (let i = 0; i < 300; i++) {
            const ran = Math.random();
            if (ran < 0.1) moving = moving * -1;
            xOffset += moving;
            board.pixels[center.x + xOffset][center.y-i].value = baseAmount / 10;
        }
    }

    //placeLine();
    //setInterval(placeLine, 10000)

    let mult = 1.1;
    setInterval(() => {
        console.log(mult);

        const angle = Math.random() * Math.PI * 2;
        const radiusMax = 0.49;
        const x = center.x + Math.floor(Math.sin(angle) * width * Math.random() * radiusMax);
        const y = center.y + Math.floor(Math.cos(angle) * height * Math.random() * radiusMax);

        //board.pixels[x][y].value = baseAmount*mult;

        //mult = mult * 1.5;
    }, 100);

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

            let r = 0;
            let g = 0;
            let b = 0;
            const mode = 1;


            if (mode === 1) {
                let c = pixel.value === 0 ? 0 : Math.floor(Math.log(pixel.value) * 20);
                c = Math.min(255, c);
                r = c;
                b = c;
                g = c;
            }
            else if (mode === 2) {

                if (Math.abs(pixel.flow) < 5) {
                    b = pixel.value === 0 ? 0 : Math.floor(Math.log((pixel.incoming+pixel.outgoing)/2) * 10);
                }
                else if (pixel.flow > 0) {
                    g = Math.floor(Math.log(pixel.flow) * 20);
                }
                else if (pixel.flow < 0) {
                    r = Math.floor(Math.log(-pixel.flow) * 20);
                }
                //b = pixel.value === 0 ? 0 : Math.floor(Math.log(pixel.value) * 10);
                //b = pixel.value === 0 ? 0 : Math.floor(Math.log((pixel.incoming+pixel.outgoing)/2) * 10);
                //b = pixel.value === 0 ? 0 : Math.floor(Math.log(Math.abs(pixel.flow)) * 10);
            }
            else if (mode === 3) {
                let c = pixel.value === 0 ? 0 : Math.floor(Math.log(pixel.value) * 40);
                c = Math.min(255, c);
                r = c;
                b = c;
                g = c;
            }


            idata.data[(x + y * width) * 4 + 0] = r;
            idata.data[(x + y * width) * 4 + 1] = g;
            idata.data[(x + y * width) * 4 + 2] = b;
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
        function tryAddNeighbor(x, y, dir) {
            if (x >= 0 && y >= 0 && x < board.width - 1 && y < board.height - 1) {
                const p = board.getPixel(x, y);
                pixel.neighbors.push({src: pixel, des: p, force:0, dir});
            }
        }

        pixel.neighbors = [];
        tryAddNeighbor(pixel.x, pixel.y - 1, DOWN); // up
        tryAddNeighbor(pixel.x, pixel.y + 1, UP); // down
        tryAddNeighbor(pixel.x - 1, pixel.y, LEFT); // left
        tryAddNeighbor(pixel.x + 1, pixel.y, RIGHT); // right
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

const UP = 1, DOWN = 2, LEFT = 3, RIGHT = 4;

class Pixel {
    constructor(x, y, value = 0) {
        this.x = x;
        this.y = y;
        this.value = value
        this.currentForce = 0;

        this.valueNext = null;
        this.incoming = null;

        this.random = Math.random();
        this.flow = 0;
        this.incoming = 0;
        this.outgoing = 0;

        this.materials = {};
        this.materialOrder = [];
    }
    addMaterial(material, amount) {
        if (!this.materials.hasOwnProperty(material.materialId)) {
            this.materials[material.materialId] = {material, amount};
            this.materialOrder.push(material.materialId);
        }
        else {
            this.materials[material.materialId].amount += amount;
        }
    }

}

let materialId = 0;
class Material {
    constructor(color) {
        this.color = color;
        this.materialId = ++materialId;
    }
}



function executeRound(board) {

    // the volume that is ignored, everything else will try to move
    const ignoreValue = 100; // determines edge sharpness
    const percentToUse = 0.25;

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
        //pixel.outgoing = pixel.currentForce * pixel.neighbors.length; // need to loop through and calc this

        pixel.outgoing = 0;
        for (let j = 0; j < pixel.neighbors.length; j++) {
            const n = pixel.neighbors[j];

            let mod = 1;
/*            switch (n.dir) {
                case UP:
                    mod = 3.59;
                    break;
                case DOWN:
                    mod = 0.01;
                    break;
                case LEFT:
                    mod = 0.2;
                    break;
                case RIGHT:
                    mod = 0.2;
                    break;
            }*/
            pixel.outgoing += pixel.currentForce * mod;
        }

    }

    // resolve the forces
    for (let i = 0; i < board.pixelList.length; i++) {
        const pixel = board.pixelList[i];

        // get the incoming
        for (let j = 0; j < pixel.neighbors.length; j++) {
            const n = pixel.neighbors[j];

            let mod = 1;
/*            switch (n.dir) {
                case UP:
                    mod = 0.01;
                    break;
                case DOWN:
                    mod = 3.59;
                    break;
                case LEFT:
                    mod = 0.2;
                    break;
                case RIGHT:
                    mod = 0.2;
                    break;
            }*/
            pixel.incoming += n.des.currentForce * mod;
        }

        // resolve in vs out
        pixel.flow = pixel.incoming - pixel.outgoing;
        pixel.value += pixel.flow;
    }

}






