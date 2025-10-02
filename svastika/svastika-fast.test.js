const SwastikaFast = require('./svastika-fast');
const pino = require("pino");
const pretty = require("pino-pretty");

let svastika, logger;

beforeEach(() => {
    logger = pino(pretty({ sync: true }));
    svastika = new SwastikaFast(3, logger);
});


test('stringifySquare', () => {
    const square = [[1,2,3],[4,5,6],[7,8,9]];
    const result = svastika.stringifySquare(square);
    expect(result).toStrictEqual("1,2,3\n4,5,6\n7,8,9");
});

test('calcMagicConstant', () => {
    const result3 = svastika.calcMagicConstant(3);
    expect(result3).toStrictEqual(15);
    const result4 = svastika.calcMagicConstant(4);
    expect(result4).toStrictEqual(34);
    const result5 = svastika.calcMagicConstant(5);
    expect(result5).toStrictEqual(65);
});

test('calcMagicSum', () => {
    const result3 = svastika.calcMagicSum(3);
    expect(result3).toStrictEqual(45);
    const result4 = svastika.calcMagicSum(4);
    expect(result4).toStrictEqual(136);
    const result5 = svastika.calcMagicSum(5);
    expect(result5).toStrictEqual(325);
});

test('flip', () => {
    const square1 = [[1,2,3],[4,5,6],[7,8,9]];
    const square2 = [[1,4,7],[2,5,8],[3,6,9]];
    const result1 = svastika.flip(square1);
    const result2 = svastika.flip(result1);
    expect(result1).toStrictEqual(square2);
    expect(result2).toStrictEqual(square1);
});

const size = 3;
const magicConstant = 15;
const numbers = [1,2,3,4,5,6,7,8,9];
const allRows = [
    [1,5,9],
    [1,6,8],
    [2,4,9],
    [2,5,8],
    [2,6,7],
    [3,4,8],
    [3,5,7],
    [4,5,6]
];
const rowSets = [
    [
        [1,5,9],
        [2,6,7],
        [3,4,8]
    ],
    [
        [1,6,8],
        [2,4,9],
        [3,5,7]
    ]
];

const colSets = [
    [
        [1,6,8],
        [5,7,3],
        [9,2,4]
    ]
]

test('generateRange', () => {
    const result = svastika.generateRange(9);
    expect(result).toStrictEqual(numbers);
});

test('findAllSubSets', () => {
    const result = svastika.findAllSubSets(numbers, magicConstant, size);
    expect(result).toStrictEqual(allRows);
});

test('findAllValidRowSets', () => {

    // set the mock
    const result = [];
    svastika.findAllValidColumnSets = (rows) => {
        result.push(rows);
    };

    // execute
    svastika.findAllValidRowSets(allRows);

    // validate
    expect(result).toStrictEqual(rowSets);
});

test('findAllValidColumnSets', ()=> {

    const result = [];
    svastika.onCandidate = (cols) => {
        result.push(cols);
    };

    svastika.findAllValidColumnSets(rowSets[0]);

    expect(result).toStrictEqual(colSets);
});

test('onValidMagicSquare', () => {
    const a = [
        [11,24, 7,20, 3],
        [14,12,25, 8,16], // 4 changed to 14 to trigger the case
        [17, 5,13,21, 9],
        [10,18, 1,14,22],
        [23, 6,19, 2,15]
    ];
    svastika.onValidMagicSquare(a);
})

