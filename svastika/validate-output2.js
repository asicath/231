// stream-lines.js
const fs = require('fs');
const readline = require('readline');
const {orientSquare, parseSquareLine, stringifySquareLine} = require("./magic-square");
const {calcSonSquares, calcMiddleCross, calcRightHandSwastika, calcLeftHandSwastika} = require("./svastika-math");

async function streamFileByLine(filePath, onLine) {
    const stream = fs.createReadStream(filePath, { encoding: 'utf8' });
    const rl = readline.createInterface({
        input: stream,
        crlfDelay: Infinity, // handles both \r\n and \n
    });
    for await (const line of rl) {
        onLine(line);
    }
}

(async () => {
    const outputFile = './output/squares-filter-01.txt';
    const total = 275305224;
    let count = 0;
    let found = 0;

    function onLine(line) {
        count += 1;
        if (count % 1000000 === 0) console.log(`count: ${count}  percent: ${Math.floor((count/total)*1000) / 10}  |  found: ${found}  percent: ${Math.floor((found/count)*1000) / 10}`);

        const square = parseSquareLine(line);

        //const cross = calcMiddleCross(square);
        //const sons = calcSonSquares(square);
        //const left = calcLeftHandSwastika(square);
        const right = calcRightHandSwastika(square);
        //const remainLeft = 325 - sons - left;
        //const remainRight = 325 - sons - right;

        if (right !== 231) return;

        fs.appendFileSync(outputFile, `${line}\n`);
        found += 1;
    }

    fs.writeFileSync(outputFile, '');

    await streamFileByLine('./output/all-squares-unique.txt', onLine);

    console.log('Finished reading file.');
})();






/*

    return;

    const cross = calcMiddleCross(square);
    const sons = calcSonSquares(square);
    const left = calcLeftHandSwastika(square);
    const right = calcRightHandSwastika(square);
    const remainLeft = 325 - sons - left;
    const remainRight = 325 - sons - right;

    if (left !== 231) return;


    if (cross !== 93) return;

    const key = sons;
    if (map.has(key)) map.set(key, map.get(key) + 1);
    else map.set(key, 1);

    //



    metrics.targetCount++;
 */