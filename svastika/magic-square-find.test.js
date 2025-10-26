const SwastikaFast = require('./magic-square-find');
const pino = require("pino");
const pretty = require("pino-pretty");

let svastika, logger;

beforeEach(() => {
    logger = pino(pretty({ sync: true }));
});

describe('3x3', () => {

    beforeEach(() => {
        svastika = new SwastikaFast(3, logger);
        svastika.init();
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
            [1,5,9],
            [6,7,2],
            [8,3,4]
        ]
    ]

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
        svastika.findAllValidRowSets();

        // validate
        expect(result).toStrictEqual(rowSets);
    });

    test('findAllValidColumnSets', ()=> {

        const result = [];
        svastika.onValidRowAndColSet = (cols) => {
            result.push(cols);
        };

        svastika.findAllValidColumnSets(rowSets[0]);

        expect(result).toStrictEqual(colSets);
    });
})


// test('onValidMagicSquare', () => {
//     const a = [
//         [11,24, 7,20, 3],
//         [14,12,25, 8,16], // 4 changed to 14 to trigger the case
//         [17, 5,13,21, 9],
//         [10,18, 1,14,22],
//         [23, 6,19, 2,15]
//     ];
//     svastika.onValidMagicSquare(a);
// })

