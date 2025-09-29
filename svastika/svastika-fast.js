const pino = require('pino');
const pretty = require('pino-pretty');

const logger = pino(pretty({ sync: true }));




let count = 0;

function generateRange(n) {
    const a = [];
    for (let i = 0; i < n; i++) {
        a.push(i+1);
    }
    return a;
}

function calcMagicSum(size) {
    const n = size * size;
    return n * (n + 1) / 2;
}

function calcMagicConstant(size) {
    return size * (size * size + 1) / 2;
}

function stringifySquare(square) {
    const lines = square.map((row, i) => {
        return row.join(',');
    });
    return lines.join('\n');
}



function findAllPotentialSets(size) {
    const magicConstant = calcMagicConstant(size);
    const numbers = generateRange(size * size);
    const sets = findValidSets(numbers, magicConstant, size);

    logger.info(`all sets found: ${sets.length}`);

    const result = [];
    for (let i = 0; i < sets.length; i++) {
        const start = Date.now();
        const setGroups = filterPotentialSiblingSets(sets, [sets[i]], i + 1, magicConstant);
        result.push(...setGroups);
        const end = Date.now();
        const time = Math.floor((end - start) / 10) / 100;

        logger.info(`processed set ${i} / ${sets.length} | ${setGroups.length} groups | ${time}s`);
    }

    return result;
}

function findValidSets(numbers, target, size) {

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
        const children = findValidSets(numbers.slice(i+1), target - n, size - 1);
        if (children === null) continue;
        for (let a of children) {
            a.unshift(n);
            result.push(a);
        }
    }

    return result;
}

// finds just the sets that don't contain any numbers in the given set
function filterPotentialSiblingSets(sets, setGroup, offsetIndex, magicConstant) {

    logger.info(`evaluating set\n${stringifySquare(setGroup)}`);

    const result = [];
    for (let i = offsetIndex; i < sets.length; i++) {
        const potentialSet = sets[i];

        // determine if this can even be a sibling set
        let isSibling = true;
        for (let set of setGroup) {
            for (let n of set) {
                if (potentialSet.indexOf(n) !== -1) {
                    // not a sibling, move on
                    isSibling = false;
                    break;
                }
            }
        }

        // if its still considered a sibling, add to results
        if (isSibling) {
            const group = [...setGroup, potentialSet];

            // if we have a full group of sets
            if (group[0].length === group.length) {
                // don't go down any further
                result.push(group);
                onPotentialGroup(group, magicConstant);

                count++;
                if (count % 1000 === 0) {
                    logger.info(count);
                }
            }
            else {
                // otherwise go down one, but keep the current index position
                const children = filterPotentialSiblingSets(sets, group, i+1, magicConstant);
                result.push(...children);
            }

        }
    }
    return result;
}







function onPotentialGroup(group, magicConstant) {
    const inPlay = group[0];
    const nextPotential = group.slice(1);
    lastExamTime = null;
    _findValidCombination([], inPlay, nextPotential, magicConstant, []);
}

let lastExamTime = null;
let lastCount = 0;

function _findValidCombination(fixed, inPlay, potential, magicConstant, row, status = {attemptCount:0}) {

    // fully eval the square
    if (potential.length === 0 && inPlay.length === 0) {

        // TODO eval fixed
        fixed = [...fixed, row];

        // log
        status.attemptCount += 1;
        if (status.attemptCount % 100000 === 0) {
            let n = row.length;
            let maxRow = n;
            while (--n > 0) {maxRow *= n;}
            const maxCombos = Math.pow(maxRow, row.length);

            let rate = 0;
            if (lastExamTime !== null) {
                const time = Date.now() - lastExamTime;
                const sec = time / 1000;
                const count = status.attemptCount - lastCount;
                rate = Math.floor(count / sec);
            }
            lastExamTime = Date.now();
            lastCount = status.attemptCount;

            const percent = Math.floor(status.attemptCount / maxCombos * 100 * 100)/100;
            logger.info(`examining square ${status.attemptCount} ${percent}% ${rate}/s\n${stringifySquare(fixed)}`);
        }

        if (isValidMagicSquare(fixed, magicConstant)) {
            logger.info('found valid square\n' + stringifySquare(fixed));
        }

        return;
    }

    // add the next slice
    if (inPlay.length === 0) {
        const nextPotential = potential.slice(1);
        const inPlayNext = potential[0];
        const nextFixed = [...fixed, row];
        _findValidCombination(nextFixed, inPlayNext, nextPotential, magicConstant, [], status);
    }
    else {
        // TODO evaluate the columns early to see if they are 64 or above
        for (let i = 0; i < inPlay.length; i++) {
            const n = inPlay[i];
            const inPlayNext = inPlay.slice(0, i);
            inPlayNext.push(...inPlay.slice(i + 1));
            _findValidCombination(fixed, inPlayNext, potential, magicConstant, [...row, n], status);
        }
    }
}

function isValidMagicSquare(a, magicConstant) {
    const size = a.length;

    // check cols
    for (let x = 0; x < a.length; x++) {
        let value = 0;
        for (let y = 0; y < a.length; y++) {
            value += a[y][x];
        }
        if (value !== magicConstant) {return false;}
    }

    let diagonalLR = 0;
    let diagonalRL = 0;
    for (let i = 0; i < a.length; i++) {
        diagonalLR += a[i][i];
        diagonalRL += a[i][(size-1)-i];
    }
    if (diagonalLR !== magicConstant) {return false;}
    if (diagonalRL !== magicConstant) {return false;}

    return true;
}









module.exports = {
    generateRange,
    findValidSets,
    calcMagicConstant,
    filterPotentialSiblingSets,
    findAllPotentialSets
}