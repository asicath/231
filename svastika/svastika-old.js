let count = 0;
let magicConstant;
const map = new Map();

let lastLog = null;
let lastCount = 0;
let lastRowCount = 0;
let rowCount = 0;

function findAllMagicSquares(size) {

    // create the number set
    const numbers = [];
    for (let i = 0; i < (size*size); i++) {
        numbers.push(i+1);
    }

    magicConstant = size * (size * size + 1) / 2;

    findAllSquaresStep(size, [], [], numbers);
}

function findAllSquaresStep(size, rows, currentRow, remainingNumbers) {

    if (currentRow.length === size) {

        rowCount++;

        // validate the row
        const sum = currentRow.reduce((a, b) => a + b, 0);
        if (sum !== magicConstant) {
            return;
        }

        // make a copy
        rows = [...rows];
        rows.push(currentRow);

        // check to see if end position
        if (rows.length === size) {
            if (isValidMagicSquare(rows)) {
                foundSquare(rows);
            }
            count++;
            if (count % 10000000 === 0) {
                let squaresPerSecond = 0;
                let rowsPerSecond = 0;
                const now = Date.now();
                if (lastLog !== null) {
                    squaresPerSecond = (count - lastCount) / (now - lastLog) / 1000;
                    rowsPerSecond = (rowCount - lastRowCount) / 1000;
                }
                lastLog = now;
                lastCount = count;
                lastRowCount = rowCount;

                console.log(`${count} rows checked  ${squaresPerSecond} squares/s  ${rowsPerSecond} rows/s`);

            }

            return;
        }

        // reset the current row
        currentRow = [];
    }

    // otherwise try all remaining numbers in all positions
    for (let i = 0; i < remainingNumbers.length; i++) {
        const nextRow = [...currentRow];
        nextRow.push(remainingNumbers[i]);

        const nextNumbers = remainingNumbers.slice(0, i);
        nextNumbers.push(...remainingNumbers.slice(i+1));

        findAllSquaresStep(size, rows, nextRow, nextNumbers);
    }

}

function foundSquare(square) {


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

    const text = stringifySquare(square);

    if (map.has(text)) {
        console.log('ignoring');
        return;
    }

    map.set(text, 1);
    console.log(text);

    foundNewSquare(square)
}

function foundNewSquare(square, text) {

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

function stringifySquare(square) {
    const lines = square.map((row, i) => {
        return row.join(',');
    });
    return lines.join('\n');
}


function isValidMagicSquare(a) {
    const size = a.length;
    const n = size * size;

    // check sum
    const magicSum = n * (n + 1) / 2;
    let sum = 0;
    for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
            sum += a[y][x];
        }
    }
    if (sum !== magicSum) return false;

    // verify that it is square
    if (size !== Math.floor(size)) {
        return false;
    }

    // check rows and cols
    for (let i = 0; i < a.length; i++) {
        const col = getColValue(a, i);
        if (col !== magicConstant) {return false;}

        const row = getRowValue(a, i);
        if (row !== magicConstant) {return false;}

        let diagonalLR = 0;
        let diagonalRL = 0;
        for (let i = 0; i < a.length; i++) {
            diagonalLR += a[i][i];
            diagonalRL += a[i][(size-1)-i];
        }
        if (diagonalLR !== magicConstant) {return false;}
        if (diagonalRL !== magicConstant) {return false;}
    }

    return true;
}

function getColValue(a, x) {
    let value = 0;
    for (let y = 0; y < a.length; y++) {
        value += a[y][x];
    }
    return value;
}

function getRowValue(a, y) {
    let value = 0;
    for (let x = 0; x < a.length; x++) {
        value += a[y][x];
    }
    return value;
}

function convertToArray(squares) {
    const size = Math.sqrt(squares.length);

    const a = [];
    let i = 0;
    for (let y = 0; y < size; y++) {
        const row = [];
        a.push(row);
        for (let x = 0; x < size; x++) {
            row.push(squares[i]);
            i++;
        }
    }
    return a;
}

//const a1 = [1,5,9,4,2,6,7,8,3];
//const result = isValidMagicSquare(a1);
//console.log(result);

findAllMagicSquares(5);