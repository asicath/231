const {applyPermutationSets, generateRange, calcMagicConstant, flip} = require("./magic-square");

class MagicSquareFind {

    constructor(size, logger) {

        this.size = size;
        this.magicConstant = calcMagicConstant(size);

        this.logger = logger;
        this.metrics = {
            validRows: 0,
            rowSetCount: 0,
            semiMagicCount: 0,
            squaresFound: 0,

            progress: [],

            start: Date.now()
        };

        for (let i = 0; i < this.size; i++) {
            this.metrics.progress.push(i);
        }

        this.permutationSets = [];

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
        let percent = 0;
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
        this.logger.info(`${hh}:${mm}:${ss} rows: ${this.metrics.validRows}  progress: ${percentDisplay}% ${JSON.stringify(this.metrics.progress)}  rowSets: ${this.metrics.rowSetCount}  semi-magic: ${this.metrics.semiMagicCount}  found: ${this.metrics.squaresFound}`);
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

    init() {
        // generate an array with all expected numbers
        this.numbers = generateRange(this.size * this.size);

        // find all valid n size rows of numbers
        this.allRows = this.findAllSubSets(this.numbers);

        // create permutation sets
        this.permutationSets = [];
        const permuteNumbers = generateRange(this.size)
        this._createPermutationSet([], permuteNumbers);
    }

    _createPermutationSet(acc, numbers) {
        if (numbers.length === 0) {
            this.permutationSets.push(acc);
            return;
        }
        for (let i = 0; i < numbers.length; i++) {
            const accNext = [...acc, numbers[i]-1];
            let numbersNext = numbers.slice(0,i);
            numbersNext.push(...numbers.slice(i+1));
            this._createPermutationSet(accNext, numbersNext);
        }
    }

    findAllMagicSquares() {
        this.init();
        this.metrics.validRows = this.allRows.length;
        //this.writeMetrics();
        this.findAllValidRowSets();
        //this.writeMetrics();
        return this.validMagicSquares;
    }

    findAllMagicSquaresWorker(offsetIndex0, offsetIndex1) {
        const row0 = this.allRows[offsetIndex0];
        const row1 = this.allRows[offsetIndex1];
        if (!this.canBeSibling(row0, row1)) return;
        this.findAllValidRowSets([row0, row1], offsetIndex1 + 1);
    }

    canBeSibling(row0, row1) {
        for (let n of row0) {
            if (row1.indexOf(n) !== -1) {
                return false;
            }
        }
        return true;
    }

    // finds just the sets that don't contain any numbers in the given set
    findAllValidRowSets(accRows = [], offsetIndex = 0) {

        // if we have a full group of rows, don't go down any further
        // send to the next step
        if (accRows.length === this.size) {
            this.metrics.rowSetCount += 1;
            //if (this.metrics.rowSetCount % 100 === 0) this.writeMetrics();
            this.findAllValidColumnSets(accRows);
            return;
        }

        for (let i = offsetIndex; i < this.allRows.length - (this.size - accRows.length - 1); i++) {

            this.metrics.progress[accRows.length] = i;

            const row = this.allRows[i];

            // determine if this can even be a sibling set
            let isSibling = true;
            for (let set of accRows) {
                if (!this.canBeSibling(row, set)) {
                    // not a sibling, move on
                    isSibling = false;
                    break;
                }
            }

            // if its not a sibling, continue on
            if (!isSibling) continue;

            // otherwise go down one, but keep the current index position
            this.findAllValidRowSets([...accRows, row], i+1);
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
                    this.onValidRowAndColSet(flip(accColsNext));
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

    // all rows sum to magicConstant, all columns sum to magicConstant
    // iterate through the possible combinations to see if any ALSO have a valid diagonals
    onValidRowAndColSet(a) {

        // permute all items in this row
        for (let r = 0; r < this.permutationSets.length; r++) {
            for (let c = 0; c < this.permutationSets.length; c++) {
                this.metrics.semiMagicCount += 1;
                const square = applyPermutationSets(a, this.permutationSets[r], this.permutationSets[c]);
                if (this.hasValidDiagonals(square)) {
                    this.metrics.squaresFound += 1;
                    this.onValidMagicSquare(square);
                }
            }
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

    onValidMagicSquare(square) {}

}

module.exports = MagicSquareFind;