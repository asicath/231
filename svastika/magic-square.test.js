const {
    orientSquare,
    parseSquareLine,
    stringifySquare,
    stringifySquareLine,
    calcMagicConstant,
    calcMagicSum,
    flip,
    rotateClockwise,
    generateRange,
    applyPermutationSets
} = require("./magic-square");

test('stringifySquare', () => {
    const square = [[1,2,3],[4,5,6],[7,8,9]];
    const result = stringifySquare(square);
    expect(result).toStrictEqual("1,2,3\n4,5,6\n7,8,9");
});

test('stringifySquareLine', () => {
    const square = [[1,2,3],[4,5,6],[7,8,9]];
    const result = stringifySquareLine(square);
    expect(result).toStrictEqual("01,02,03|04,05,06|07,08,09");
});

test('parseSquareLine', () => {
    const line = "01,02,03|04,05,06|07,08,09";
    const result = parseSquareLine(line);
    expect(result).toStrictEqual([[1,2,3],[4,5,6],[7,8,9]]);
});

test('generateRange', () => {
    const numbers = [1,2,3,4,5,6,7,8,9];
    const result = generateRange(9);
    expect(result).toStrictEqual(numbers);
});

test('calcMagicConstant', () => {
    const result3 = calcMagicConstant(3);
    expect(result3).toStrictEqual(15);
    const result4 = calcMagicConstant(4);
    expect(result4).toStrictEqual(34);
    const result5 = calcMagicConstant(5);
    expect(result5).toStrictEqual(65);
});

test('calcMagicSum', () => {
    const result3 = calcMagicSum(3);
    expect(result3).toStrictEqual(45);
    const result4 = calcMagicSum(4);
    expect(result4).toStrictEqual(136);
    const result5 = calcMagicSum(5);
    expect(result5).toStrictEqual(325);
});

test('flip', () => {
    const square1 = [[1,2,3],[4,5,6],[7,8,9]];
    const square2 = [[1,4,7],[2,5,8],[3,6,9]];
    const result1 = flip(square1);
    const result2 = flip(result1);
    expect(result1).toStrictEqual(square2);
    expect(result2).toStrictEqual(square1);
});

test('rotateClockwise', () => {
    const square1 = [[1,2,3],[4,5,6],[7,8,9]];
    const square2 = [[7,4,1],[8,5,2],[9,6,3]];
    const square3 = [[9,8,7],[6,5,4],[3,2,1]];
    const square4 = [[3,6,9],[2,5,8],[1,4,7]];
    const result2 = rotateClockwise(square1);
    expect(result2).toStrictEqual(square2);
    const result3 = rotateClockwise(result2);
    expect(result3).toStrictEqual(square3);
    const result4 = rotateClockwise(result3);
    expect(result4).toStrictEqual(square4);
    const result1 = rotateClockwise(result4);
    expect(result1).toStrictEqual(square1);
});

describe('applyPermutationSets', () => {

    const square = [[1,2,3],[4,5,6],[7,8,9]];

    test('no change', () => {
        const row = [0,1,2];
        const col = [0,1,2];
        const result = applyPermutationSets(square, row, col);
        expect(result).toStrictEqual(square);
    });

    test('change', () => {
        const row = [1,2,0];
        const col = [2,0,1];
        const result = applyPermutationSets(square, row, col);

        const expected = [[6,4,5],[9,7,8],[3,1,2]];
        expect(result).toStrictEqual(expected);
    });

});
