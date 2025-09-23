const {findValidSets, generateRange, calcMagicConstant, filterPotentialSiblingSets, findAllPotentialSets} = require('./svastika-fast');

test('find sets 3', () => {
    const size = 3;
    const sets = findAllPotentialSets(size);
    expect(sets.length).toEqual(3);
});

test('find sets 4', () => {
    const size = 4;
    const sets = findAllPotentialSets(size);
    expect(sets.length).toEqual(71);
});

test('find sets 5', () => {
    const size = 5;
    const sets = findAllPotentialSets(size);
    expect(sets.length).toEqual(6);
});
