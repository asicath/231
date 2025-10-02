const pino = require('pino');
const pretty = require('pino-pretty');
const fs = require('fs');

class SwastikaFast {

    constructor(size, logger) {

        this.size = size;
        this.magicConstant = this.calcMagicConstant(size);

        this.logger = logger;
        this.metrics = {
            validRows: 0,
            rowSetCount: 0,
            colSetCount: 0,
            squaresFound: 0,
            target1: 0,
            target2: 0,
            target3: 0,

            progress: [],

            start: Date.now()
        };

        for (let i = 0; i < this.size; i++) {
            this.metrics.progress.push(i);
        }

        fs.writeFileSync('./output/target1.txt', 'All Magic squares with 231r and 221l');
        fs.writeFileSync('./output/target2.txt', 'All Magic squares with 231r and 221l + 65 cross');
        fs.writeFileSync('./output/target3.txt', 'All Magic squares with 231r and 221l + 65 cross + 52 son squares');

        // the result
        this.validMagicSquares = [];
    }

    writeMetrics() {
        let time = Date.now() - this.metrics.start;
        const hours = Math.floor(time / (1000 * 60 * 60));
        time -= hours * (1000 * 60 * 60);
        const minutes = Math.floor(time / (1000 * 60));
        time -= minutes * (1000 * 60);
        const seconds = Math.floor(time / (1000));

        const hh = hours < 10 ? '0' + hours.toString() : hours.toString();
        const mm = minutes < 10 ? '0' + minutes.toString() : minutes.toString();
        const ss = seconds < 10 ? '0' + seconds.toString() : seconds.toString();

        // calc the percent
        //const percent1 = this.metrics.progress[0] / this.metrics.validRows;
        //const percent2 = (this.metrics.progress[1] / this.metrics.validRows) * (1 / this.metrics.validRows);
        //const percent3 = (this.metrics.progress[2] / this.metrics.validRows) * (1 / this.metrics.validRows) * (1 / this.metrics.validRows);
        //const percent4 = (this.metrics.progress[3] / this.metrics.validRows) * (1 / this.metrics.validRows) * (1 / this.metrics.validRows) * (1 / this.metrics.validRows);
        //const percent = percent1 + percent2 + percent3 + percent4;

        let percent = 0;
        //for (let i = 0; i < this.size; i++) {
        for (let i = 0; i < this.size; i++) {

            let minRowIndex = 0;
            if (i > 0) {
                minRowIndex = this.metrics.progress[i-1] + 1;
            }

            let maxRowIndex = this.metrics.validRows - 1;
            if (i < this.size - 1) {
                maxRowIndex -= (this.size - i - 1);
            }

            const incrPercent = (this.metrics.progress[i] - minRowIndex) / (maxRowIndex - minRowIndex + 1);

            const incrMaxValue = Math.pow(1 / this.metrics.validRows, i);

            const incr = incrPercent * incrMaxValue;
            percent += incr;
        }

        const percentDisplay = Math.floor(percent * 1000000) / 10000;
        this.logger.info(`${hh}:${mm}:${ss} rows: ${this.metrics.validRows}  progress: ${percentDisplay}% ${JSON.stringify(this.metrics.progress)}  rowSets: ${this.metrics.rowSetCount}  colSets: ${this.metrics.colSetCount}  squares: ${this.metrics.squaresFound}  target1: ${this.metrics.target1}  target2: ${this.metrics.target2}  target3: ${this.metrics.target3}`);
    }

    stringifySquare(square) {
        const lines = square.map((row) => {
            return row.join(',');
        });
        return lines.join('\n');
    }

    // 1-25
    generateRange(n) {
        const a = [];
        for (let i = 0; i < n; i++) {
            a.push(i+1);
        }
        return a;
    }

    // 65
    calcMagicConstant(size) {
        return size * (size * size + 1) / 2;
    }

    // 325
    calcMagicSum(size) {
        const n = size * size;
        return n * (n + 1) / 2;
    }

    /*
     1 2 3    1 4 7
     4 5 6 -> 2 5 8
     7 8 9    3 6 9
     */
    flip(square) {
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


    // given a set of numbers, return all subsets of a given size whose sum is target
    findAllSubSets(numbers, target = null, size = null) {

        if (target === null) target = this.magicConstant;
        if (size === null) size = this.size;

        // if the set size is zero, just search for the target and return if present
        if (size === 1) {
            for (let i = 0; i < numbers.length; i++) {
                const n = numbers[i];
                if (n === target) {
                    return [[n]];
                }
            }
            return null;
        }

        const result = [];
        for (let i = 0; i < numbers.length - (size-1); i++) {
            const n = numbers[i];
            const children = this.findAllSubSets(numbers.slice(i+1), target - n, size - 1);
            if (children === null) continue;
            for (let a of children) {
                a.unshift(n);
                result.push(a);
            }
        }

        return result;
    }

    findAllMagicSquares() {

        // generate an array with all expected numbers
        const numbers = this.generateRange(this.size * this.size);

        // find all valid n size rows of numbers
        const allRows = this.findAllSubSets(numbers);
        this.metrics.validRows = allRows.length;
        this.writeMetrics();

        this.findAllValidRowSets(allRows);

        this.writeMetrics();

        return this.validMagicSquares;
    }



    // finds just the sets that don't contain any numbers in the given set
    findAllValidRowSets(allRows, accRows = [], offsetIndex = 0) {

        // if we have a full group of rows, don't go down any further
        // send to the next step
        if (accRows.length === this.size) {
            this.metrics.rowSetCount += 1;
            //this.writeMetrics();

            if (this.metrics.rowSetCount % 100 === 0) this.writeMetrics();

            //logger.info(`evaluating row set ${metrics.rowSetCount}\n${stringifySquare(accRows)}`);
            //onPotentialGroup(accRows, magicConstant);
            this.findAllValidColumnSets(accRows);
            return;
        }

        for (let i = offsetIndex; i < allRows.length - (this.size - accRows.length - 1); i++) {

            this.metrics.progress[accRows.length] = i;

            const row = allRows[i];

            // determine if this can even be a sibling set
            let isSibling = true;
            for (let set of accRows) {
                for (let n of set) {
                    if (row.indexOf(n) !== -1) {
                        // not a sibling, move on
                        isSibling = false;
                        break;
                    }
                }
            }

            // if its not a sibling, continue on
            if (!isSibling) continue;

            // otherwise go down one, but keep the current index position
            this.findAllValidRowSets(allRows, [...accRows, row], i+1);
        }

    }

    // take a set of validated rows, derive all columns with one number from each row
    findAllValidColumnSets(rows, target = null, rowIndex = 0, accCol = null, accCols = []) {

        const row = rows[rowIndex];

        // find all without repeating
        if (target === null) {
            // just grab the next top
            const n = rows[0][0];

            const rowNext = row.slice(1);

            const rowsNext = [...rows];
            rowsNext[rowIndex] = rowNext;

            this.findAllValidColumnSets(rowsNext, this.magicConstant - n, rowIndex + 1, [n], accCols);

            return;
        }

        // look through each number in the
        for (let i = 0; i < this.size; i++) {

            const n = row[i];

            // add number to the col accumulator
            const accColNext = [...accCol];
            accColNext.push(n);

            // cut the number from the row
            const rowNext = row.slice(0,i);
            rowNext.push(...row.slice(i+1));

            // construct the full rows object without the number
            const rowsNext = [...rows];
            rowsNext[rowIndex] = rowNext;

            // decide the next path
            if (rowIndex === this.size - 1) {
                if (n !== target) continue;

                // add the column to the acumulator
                const accColsNext = [...accCols, accColNext];

                if (accColsNext.length === this.size) {
                    // PASS!
                    // evaluate
                    this.onCandidate(accColsNext);
                    // also evaluate it flipped
                    this.onCandidate(this.flip(accColsNext));
                }
                else {
                    // still more to do, move to the next column
                    this.findAllValidColumnSets(rowsNext, null, 0, [], accColsNext);
                }

            }
            else {
                if (n > target) continue;
                this.findAllValidColumnSets(rowsNext, target - n, rowIndex + 1, accColNext, accCols);
            }

        }

    }

    onCandidate(cols, acc = []) {

        this.metrics.colSetCount += 1;

        if (cols.length === 0) {
            if (this.hasValidDiagonals(acc)) {
                this.onValidMagicSquare(acc);
            }
            return;
        }

        // rearrange the cols
        for (let i = 0; i < cols.length; i++) {

            const accNext = [...acc, cols[i]];

            const colsNext = cols.slice(0, i);
            colsNext.push(...cols.slice(i+1));

            this.onCandidate(colsNext, accNext);
        }

    }

    hasValidDiagonals(a) {

        let diagonalLR = 0;
        let diagonalRL = 0;
        for (let i = 0; i < a.length; i++) {
            diagonalLR += a[i][i];
            diagonalRL += a[i][(this.size-1)-i];
        }
        if (diagonalLR !== this.magicConstant) {return false;}
        if (diagonalRL !== this.magicConstant) {return false;}

        return true;
    }

    onValidMagicSquare(a) {
        this.metrics.squaresFound += 1;

        if (this.size !== 5) return;

        // determine if its a valid swastika
        const rightHand = this.calcRightHandSwastika(a);
        const leftHand = this.calcLeftHandSwastika(a);
        if (rightHand !== 231 || leftHand !== 221) return;
        this.metrics.target1 += 1;
        fs.appendFileSync('./output/target1.txt', `\n\n${this.stringifySquare(a)}`);

        const middleCross = this.calcMiddleCross(a);
        if (middleCross !== 65) return;
        this.metrics.target2 += 1;
        fs.appendFileSync('./output/target2.txt', `\n\n${this.stringifySquare(a)}`);

        const sonSquares = this.calcSonSquares(a);
        if (sonSquares !== 52) return;
        this.metrics.target3 += 1;
        fs.appendFileSync('./output/target3.txt', `\n\n${this.stringifySquare(a)}`);

        // all conditions met!
        this.onTargetSvastika(a);
    }

    onTargetSvastika(a) {
        this.logger.info(`found a matching magic square!\n${this.stringifySquare(a)}`);
    }

    calcSonSquares(a) {
        let sum = 0;

        // center cross of 5 squares
        sum += a[1][1];
        sum += a[3][1];
        sum += a[1][3];
        sum += a[3][3];

        return sum;
    }

    calcMiddleCross(a) {
        let sum = 0;

        // center cross of 5 squares
        sum += a[1][2];
        sum += a[2][2];
        sum += a[3][2];
        sum += a[2][1];
        sum += a[2][3];

        return sum;
    }

    calcRightHandSwastika(a) {

        let sum = 0;

        // center cross of 5 squares
        sum += a[1][2];
        sum += a[2][2];
        sum += a[3][2];
        sum += a[2][1];
        sum += a[2][3];

        // top
        sum += a[0][2];
        sum += a[0][3];
        sum += a[0][4];

        // right
        sum += a[2][4];
        sum += a[3][4];
        sum += a[4][4];

        // bottom
        sum += a[4][2];
        sum += a[4][1];
        sum += a[4][0];

        // left
        sum += a[2][0];
        sum += a[1][0];
        sum += a[0][0];

        return sum;
    }


    calcLeftHandSwastika(a) {

        let sum = 0;

        // center cross of 5 squares
        sum += a[1][2];
        sum += a[2][2];
        sum += a[3][2];
        sum += a[2][1];
        sum += a[2][3];

        // top
        sum += a[0][2];
        sum += a[0][1];
        sum += a[0][0];

        // right
        sum += a[2][4];
        sum += a[1][4];
        sum += a[0][4];

        // bottom
        sum += a[4][2];
        sum += a[4][3];
        sum += a[4][4];

        // left
        sum += a[2][0];
        sum += a[3][0];
        sum += a[4][0];

        return sum;
    }

}


module.exports = SwastikaFast;