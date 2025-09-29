const {findValidSets, generateRange, calcMagicConstant, filterPotentialSiblingSets, findAllPotentialSets} = require('./svastika-fast');
const fs = require('fs');

const size = 4;
const sets = findAllPotentialSets(size);
//expect(sets.length).toEqual(6);
fs.writeFileSync('./set5.json', JSON.stringify(sets));