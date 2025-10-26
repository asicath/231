import fs from "fs";
import readline from "readline";

let count = 0;

async function getLineCount(filePath) {
    count = 0;
    await streamFileByLine(filePath);
    console.log(`${filePath} ${count}`);
    return count;
}

async function streamFileByLine(filePath) {
    const stream = fs.createReadStream(filePath, { encoding: 'utf8' });
    const rl = readline.createInterface({
        input: stream,
        crlfDelay: Infinity, // handles both \r\n and \n
    });
    for await (const line of rl) {
        onLine(line);
    }
}

function onLine(line) {
    if (line.length > 0) count += 1;
}

(async () => {
    await getLineCount ('./output/all-squares.txt');

    // await getLineCount ('./output/blocks/squares-0029.txt');
    // await getLineCount ('./output/blocks/squares-0030.txt');
    // await getLineCount ('./output/blocks/squares-0031.txt');
    // await getLineCount ('./output/blocks/squares-0032.txt');
    // await getLineCount ('./output/blocks/squares-0033.txt');
    // await getLineCount ('./output/blocks/squares-0034.txt');
    // await getLineCount ('./output/blocks/squares-0035.txt');
    // await getLineCount ('./output/blocks/squares-0036.txt');

})();