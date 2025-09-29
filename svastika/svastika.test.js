const {findValidSets, generateRange, calcMagicConstant, filterPotentialSiblingSets, findAllPotentialSets} = require('./svastika-fast');
const fs = require('fs');

test('find sets 3', () => {
    const size = 3;
    const sets = findAllPotentialSets(size);
    expect(sets.length).toEqual(2);
    fs.writeFileSync('./set3.json', JSON.stringify(sets));
});

test('find sets 4', () => {
    const size = 4;
    const sets = findAllPotentialSets(size);
    expect(sets.length).toEqual(392);
    fs.writeFileSync('./set4.json', JSON.stringify(sets));
});

test('find sets 5', () => {
    const size = 5;
    const sets = findAllPotentialSets(size);
    //expect(sets.length).toEqual(6);
    fs.writeFileSync('./set5.json', JSON.stringify(sets));
}, 60000*60);
