
function findAllPotentialSets(size) {
    const magicConstant = calcMagicConstant(size);
    const numbers = generateRange(size * size);
    const sets = findValidSets(numbers, magicConstant, size);

    // initial
    let setGroups = [];
    for (let set of sets) {
        setGroups.push([set]);
    }

    for (let round = 0; round < size - 1; round++) {
        let next = [];
        for (let i = 0; i < setGroups.length; i++) {
            const setGroup = setGroups[i];
            const siblingSets = filterPotentialSiblingSets(setGroup, sets, i + 1);
            for (let siblingSet of siblingSets) {
                next.push([...setGroup, siblingSet]);
            }
        }
        setGroups = next;
    }

    return setGroups;
}

// finds just the sets that don't contain any numbers in the given set
function filterPotentialSiblingSets(setGroup, sets, offsetIndex) {

    const result = [];
    //for (let potentialSet of sets) {
    for (let i = offsetIndex; i < sets.length; i++) {
        const potentialSet = sets[i];

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
            result.push(potentialSet);
        }
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


function generateRange(n) {
    const a = [];
    for (let i = 0; i < n; i++) {
        a.push(i+1);
    }
    return a;
}


function findAllValidRows(size) {
    // create the number set
    const numbers = [];
    for (let i = 0; i < (size*size); i++) {
        numbers.push(i+1);
    }

    const target = calcMagicConstant(size);

    // find all sorted sets
    const uniqueSets = _findAllValidRowsStep(size, numbers, target, numbers);

    //
}

function _findAllValidRowsStep(n, numbers, target, value) {

    // check to see if this ia a leaf
    if (n === numbers.length) {
        return {
            isLeaf: true,
            numbers
        };
    }

    const node = {
        children: [],
        isLeaf: false
    };

    for (let i = 0; i < numbers.length; i++) {
        // find all sets and then create a new node
    }
}

function calcMagicSum(size) {
    const n = size * size;
    return n * (n + 1) / 2;
}

function calcMagicConstant(size) {
    return size * (size * size + 1) / 2;
}

module.exports = {
    generateRange,
    findValidSets,
    calcMagicConstant,
    filterPotentialSiblingSets,
    findAllPotentialSets
}