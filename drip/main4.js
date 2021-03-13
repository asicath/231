
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

let drawMode = 3;

document.addEventListener("keydown", keyDownTextField, false);

function keyDownTextField(e) {

    if (e.keyCode === 49) { // 1
        drawMode = 1;
    }
    else if (e.keyCode === 50) { // 1
        drawMode = 2;
    }
    else if (e.keyCode === 51) { // 1
        drawMode = 3;
    }
    else {
        console.log(e.keyCode);
    }
}

let materialId = 0;
class Material {
    constructor(r, g, b) {
        this.r = r;
        this.g = g;
        this.b = b;
        this.materialId = ++materialId;
    }
}

// elements
//const red = new Material(0xff, 0x33, 0x00); // ff3300
//const yellow = new Material(0xfe, 0xe7, 0x4d); // fee74d
//const blue = new Material(0x02, 0x46, 0xbc); // 0246bc
//const colors = [red, yellow, blue];
// planets

const p0 = new Material(0x00, 0x85, 0xca); // luna
const p1 = new Material(0xFE, 0xDD, 0x00);
const p2 = new Material(0x00, 0xA5, 0x50);
const p3 = new Material(0xFF, 0x6D, 0x00);
const p4 = new Material(0xed, 0x28, 0x00);
const p5 = new Material(0x8C, 0x15, 0xC4);
const p6 = new Material(0x00, 0x14, 0x89); // saturn
const materialMasterList = [p0,p1,p2,p3,p4,p5,p6];

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

    const baseAmount = 10000000000;

    let materialIndex = 0;

    placeDot();
    let interval = setInterval(() => {
        placeDot();
        if (materialIndex === 0) clearInterval(interval);
    }, 10000);

    function placeDot() {
        board.pixels[center.x][center.y].addMaterial(materialIndex, baseAmount);
        materialIndex = (materialIndex+1) % materialMasterList.length;
    }

/*    placeLine();
    let interval = setInterval(() => {
        placeLine();
        if (materialIndex === 0) clearInterval(interval);
    }, 5000);

    function placeLine() {
        let xOffset = 0;
        let moving = 1;
        for (let i = -300; i < 300; i++) {
            const ran = Math.random();
            if (ran < 0.01) moving = moving * -1;
            xOffset += moving;
            board.pixels[center.x + xOffset][center.y-i].addMaterial(materialIndex, baseAmount/10);
        }
        materialIndex = (materialIndex+1) % materialMasterList.length;
    }*/




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
            let a = 255;

            if (drawMode === 1) {
                let c = pixel.value === 0 ? 0 : Math.floor(Math.log(pixel.value) * 20);
                c = Math.min(255, c);
                r = c;
                b = c;
                g = c;
            }
            else if (drawMode === 2) {

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
            else if (drawMode === 3) {

                let materialIndex = materialMasterList.length - 1;
                while (materialIndex > 0 && (!pixel.materials[materialIndex] || pixel.materials[materialIndex] === 0)) {
                    materialIndex--;
                }

                const material = materialMasterList[materialIndex];
                r = material.r;
                g = material.g;
                b = material.b;

                a = pixel.value === 0 ? 0 : Math.floor(Math.log(pixel.value) * 100);
                a = Math.min(255, a);

            }

            idata.data[(x + y * width) * 4 + 0] = r;
            idata.data[(x + y * width) * 4 + 1] = g;
            idata.data[(x + y * width) * 4 + 2] = b;
            idata.data[(x + y * width) * 4 + 3] = a;
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

        this.materials = [];
    }
    addMaterial(materialIndex, amount) {
        this.value += amount;
        if (!this.materials[materialIndex]) {
            this.materials[materialIndex] = amount;
        }
        else {
            this.materials[materialIndex] += amount;
        }
    }
    removeMaterialForFlow(amount) {
        const ret = [];
        let materialIndex = 0;
        while (amount > 0 && materialIndex < materialMasterList.length) {

            // none for this material
            if (!this.materials[materialIndex]) {
                materialIndex++;
                continue;
            }

            if (this.materials[materialIndex] > amount) {
                // remove the amount from the current pixel's material store
                this.materials[materialIndex] -= amount;
                this.value -= amount;

                // add it to the return stack
                ret[materialIndex] = amount;
                amount = 0;
            }
            else {
                // add the partial amount to the stack
                ret[materialIndex] = this.materials[materialIndex];
                amount -= this.materials[materialIndex];

                // dispose of material in this pixel
                this.value -= this.materials[materialIndex];
                this.materials[materialIndex] = 0;
            }

            materialIndex++;
        }
        return ret;
    }
    
}





function executeRound(board) {

    // the volume that is ignored, everything else will try to move
    const ignoreValue = 1; // determines edge sharpness
    const percentToUse = 0.50;

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
            pixel.outgoing += pixel.currentForce;
        }

    }

    // resolve the forces
    for (let i = 0; i < board.pixelList.length; i++) {
        const pixel = board.pixelList[i];

        pixel.flow = 0;

        // get the incoming
        for (let j = 0; j < pixel.neighbors.length; j++) {
            const pixelSrc = pixel.neighbors[j].des;

            const incoming = pixelSrc.currentForce;
            const outgoing = pixel.currentForce;
            const flow = incoming - outgoing;

            // mainly just for tracking, no need to do these
            pixel.incoming += incoming;

            // make the exchange, only if this is the receiving pixel
            if (flow > 0) {
                // take some from src
                const volumes = pixelSrc.removeMaterialForFlow(flow);
                for (let materialIndex = 0; materialIndex < materialMasterList.length; materialIndex++) {
                    if (volumes[materialIndex] && volumes[materialIndex] > 0)
                        pixel.addMaterial(materialIndex, volumes[materialIndex]);
                }
            }
        }

        // resolve in vs out
        pixel.flow = pixel.incoming - pixel.outgoing;

        // figure out what materials the flow is
        //pixel.value += pixel.flow;
    }

}






