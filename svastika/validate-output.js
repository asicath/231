const fs = require('fs');
const {orientSquare, stringifySquare} = require("./magic-square");
const {calcSonSquares, calcMiddleCross, calcRightHandSwastika, calcLeftHandSwastika} = require("./svastika-math");


function loadSquares() {
    const lines = fs.readFileSync('./output/run1/target2.txt').toString().split('\n');

    let index = 2; // start on line 3

    const squares = [];
    while (index < lines.length) {
        const square = [];
        for (let i = 0; i < 5; i++) {
            const row = lines[index].split(',').map(s => parseInt(s));
            square.push(row);
            index += 1;
        }
        squares.push(square);
        index += 1; // skip the blank line
    }

    return squares;
}

function getKey(square) {
    const a = square.map(row => {
        const rowText = row.map(n => {
            if (n < 10) return `0${n}`;
            return n.toString();
        })
        return rowText.join(',');
    });
    return a.join('|');
}

function uniqueSquares(squares) {
    const map = new Map();
    for (let square of squares) {
        const key = getKey(square);
        if (!map.has(key)) {
            map.set(key, square);
        }
    }
    return map.values().toArray();
}

// load
let squares = loadSquares();
console.log(`loaded ${squares.length} squares`);

// re-orient
squares = squares.map(square => {
    return orientSquare(square);
});

// unique
squares = uniqueSquares(squares);
console.log(`unique squares: ${squares.length}`);

// find most common middle squares
const sons = squares.map(square => {
    const value = calcSonSquares(square);
    return value;
});
const mapSons = new Map();
for (let key of sons) {
    if (mapSons.has(key)) {
        mapSons.set(key, mapSons.get(key) + 1);
    }
    else {
        mapSons.set(key, 1);
    }
}
const values = [];
for (let key of mapSons.keys()) {
    values.push(key);
}
values.sort();
for (let key of values) {
    console.log(`${key}: ${mapSons.get(key)}`);
}

const remainingLeft = new Map();
const remainingRight = new Map();
for (let square of squares) {
    const sons = calcSonSquares(square);
    const left = calcLeftHandSwastika(square);
    const right = calcRightHandSwastika(square);
    const remainLeft = 325 - sons - left;
    const remainRight = 325 - sons - right;

    if (remainingLeft.has(remainLeft)) remainingLeft.set(remainLeft, remainingLeft.get(remainLeft) + 1);
    else remainingLeft.set(remainLeft, 1);

    if (remainingRight.has(remainRight)) remainingRight.set(remainRight, remainingRight.get(remainRight) + 1);
    else remainingRight.set(remainRight, 1);
}

console.log("remaining left:");
for (let key of remainingLeft.keys()) {
    console.log(`${key}: ${remainingLeft.get(key)}`);
}

console.log("remaining right:");
for (let key of remainingRight.keys()) {
    console.log(`${key}: ${remainingRight.get(key)}`);
}

/*
29: 116

32: 339
35: 579
38: 1031

41: 1718
44: 3201
47: 3209

50: 3923
53: 2363
56: 2212
59: 1576

62: 12545
 */


// target1: 32330
// target2: 12401