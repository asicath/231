
function stringifySquare(square) {
    const lines = square.map((row, i) => {
        return row.join(',');
    });
    return lines.join('\n');
}

function stringifySquareLine(square) {
    const a = square.map(row => {
        const rowText = row.map(n => {
            if (n < 10) return `0${n}`;
            return n.toString();
        })
        return rowText.join(',');
    });
    return a.join('|');
}

function parseSquareLine(line) {
    const a = [];

    let rows = line.split('|');
    for (let i = 0; i < rows.length; i++) {
        const values = rows[i].split(',').map(t => parseInt(t));
        a.push(values);
    }

    return a;
}

function rotateClockwise(square) {
    const size = square.length;

    const rotatedSquare = [];
    for (let i = 0; i < size; i++) {
        rotatedSquare.push([]);
    }

    for (let x = 0; x < size; x++) {
        for (let y = 0; y < size; y++) {
            const xRotated = (size - 1) - y;
            const yRotated = x;
            rotatedSquare[yRotated][xRotated] = square[y][x];
        }
    }

    return rotatedSquare;
}

function flip(square) {
    const size = square.length;

    const flipped = [];
    for (let i = 0; i < size; i++) {
        flipped.push([]);
    }

    for (let x = 0; x < size; x++) {
        for (let y = 0; y < size; y++) {
            const xFlipped = y;
            const yFlipped = x;
            flipped[yFlipped][xFlipped] = square[y][x];
        }
    }

    return flipped;
}

function orientSquare(square) {
    // make the upper left have lowest of corners
    const uL = square[0][0];
    const uR = square[0][square.length - 1];
    const lL = square[square.length - 1][0];
    const lR = square[square.length - 1][square.length - 1];
    const minCorner = Math.min(lL, uL, uR, lR);

    if (uL === minCorner) {
        // do nothing
    }
    else if (uR === minCorner) {
        // rotate 3 times
        square = rotateClockwise(square);
        square = rotateClockwise(square);
        square = rotateClockwise(square);
    }
    else if (lR === minCorner) {
        // rotate 2 times
        square = rotateClockwise(square);
        square = rotateClockwise(square);
    }
    else if (lL === minCorner) {
        // rotate 1 time
        square = rotateClockwise(square);
    }

    // make upper right have the lowest of corners adjacent to upper left
    const uR2 = square[0][square.length - 1];
    const lL2 = square[square.length - 1][0];
    if (uR2 > lL2) {
        square = flip(square);
    }

    return square;
}

// 1-25
function generateRange(n) {
    const a = [];
    for (let i = 0; i < n; i++) {
        a.push(i+1);
    }
    return a;
}

// 65
function calcMagicConstant(size) {
    return size * (size * size + 1) / 2;
}

// 325
function calcMagicSum(size) {
    const n = size * size;
    return n * (n + 1) / 2;
}

function applyPermutationSets(square, row, col) {
    const value = [];
    for (let r = 0; r < row.length; r++) {
        const a = [];
        for (let c = 0; c < col.length; c++) {
            a.push(square[row[r]][col[c]]);
        }
        value.push(a);
    }
    return value;
}

module.exports = {
    orientSquare,
    flip,
    rotateClockwise,
    stringifySquare,
    parseSquareLine,
    stringifySquareLine,
    calcMagicConstant,
    calcMagicSum,
    generateRange,
    applyPermutationSets
};
