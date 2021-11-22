class Vector2 {
    constructor(x, y){
        this.x = x;
        this.y = y;
    }
    dot(other){
        return this.x*other.x + this.y*other.y;
    }
}

function Shuffle(tab){
    for(let e = tab.length-1; e > 0; e--){
        let index = Math.round(Math.random()*(e-1)),
            temp  = tab[e];

        tab[e] = tab[index];
        tab[index] = temp;
    }
}

function MakePermutation(){
    let P = [];
    for(let i = 0; i < 256; i++){
        P.push(i);
    }
    Shuffle(P);
    for(let i = 0; i < 256; i++){
        P.push(P[i]);
    }

    return P;
}


function GetConstantVector(v){
    //v is the value from the permutation table
    let h = v & 3;
    if (h === 0)
        return new Vector2(1.0, 1.0);
    else if (h === 1)
        return new Vector2(-1.0, 1.0);
    else if (h === 2)
        return new Vector2(-1.0, -1.0);
    else
        return new Vector2(1.0, -1.0);
}

function Fade(t){
    return ((6*t - 15)*t + 10)*t*t*t;
}

function Lerp(t, a1, a2){
    return a1 + t*(a2-a1);
}

function Noise2D(x, y){
    let X = Math.floor(x) & 255;
    let Y = Math.floor(y) & 255;

    let xf = x-Math.floor(x);
    let yf = y-Math.floor(y);

    let topRight = new Vector2(xf-1.0, yf-1.0);
    let topLeft = new Vector2(xf, yf-1.0);
    let bottomRight = new Vector2(xf-1.0, yf);
    let bottomLeft = new Vector2(xf, yf);

    //Select a value in the array for each of the 4 corners
    let valueTopRight = P[P[X+1]+Y+1];
    let valueTopLeft = P[P[X]+Y+1];
    let valueBottomRight = P[P[X+1]+Y];
    let valueBottomLeft = P[P[X]+Y];

    let dotTopRight = topRight.dot(GetConstantVector(valueTopRight));
    let dotTopLeft = topLeft.dot(GetConstantVector(valueTopLeft));
    let dotBottomRight = bottomRight.dot(GetConstantVector(valueBottomRight));
    let dotBottomLeft = bottomLeft.dot(GetConstantVector(valueBottomLeft));

    let u = Fade(xf);
    let v = Fade(yf);

    return Lerp(u,
        Lerp(v, dotBottomLeft, dotTopLeft),
        Lerp(v, dotBottomRight, dotTopRight)
    );

}

function initMap(width, height, defaultValue = 0) {
    const map = [];
    for (let x = 0; x < width; x++) {
        map[x] = [];
        for (let y = 0; y < height; y++) {
            map[x][y] = defaultValue;
        }
    }
    return map;
}

function getNoiseMap(width, height) {
    const map = initMap(width, height);
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            let n = Noise2D(x*0.01, y*0.01);
            n += 1.0;
            n *= 0.5;

            map[x][y] = n;
        }
    }
    return map;
}

function getFractalNoiseMap(width, height) {
    const map = initMap(width, height);
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            let n = 0.0,
                a = 1.0,
                f = 0.005;

            for (let o = 0; o < 8; o++){
                let v = a*Noise2D(x*f, y*f);
                n += v;

                a *= 0.5;
                f *= 2.0;
            }

            n += 1.0; // make it all > 0
            n *= 0.5; // reduce the range to 0-1 from 0-2

            map[x][y] = n;
        }
    }
    return map;
}

function compressMap(map, width, height) {
    // start and end of transition
    // raise and lower

    const center = 0.5;
    const middle = 0.01;
    const compress = 0.90;

    const start = center - middle / 2;
    const end = center + middle / 2;

    const raise = start * compress;
    const lower = ((1-end) * compress);

    console.log(`start: ${start}, end: ${end}, raise: ${raise}, lower: ${lower}`);

    const lowerFactor = (start - raise) / start;
    const raiseFactor = ((1-end) - lower) / (1-end);

    const output = initMap(width, height);

    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {

            const n = map[x][y];

            // raise
            if (n < start) {
                output[x][y] = n * lowerFactor + raise;
            }
            // lower
            else if (n > end) {
                output[x][y] = 1 - ((1-n) * raiseFactor) - lower;
            }

            else {
                output[x][y] = n;
            }

        }
    }

    return output;
}

function shiftMap(map, amount, width, height) {
    const output = initMap(width, height);

    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
            const n = map[x][y];
            output[x][y] = n + amount;
        }
    }

    return output;
}

let P;

function initPattern() {
    P = MakePermutation();
}

module.exports = {
    initPattern,
    getFractalNoiseMap,
    compressMap,
    shiftMap
}
