// stream-lines.js
const fs = require('fs');
const readline = require('readline');
const hash = require('object-hash');

const metrics = {
    linesLoaded: 0,
    linesChecked: 0,
    linesRemaining: 0
};

const queue = [];
const outputFile = './output/blocks/squares-0000-0028.txt';
fs.writeFileSync(outputFile, '');

function writeMetrics() {
    console.log(`linesLoaded: ${metrics.linesLoaded}  linesChecked: ${metrics.linesChecked}  linesRemaining: ${metrics.linesRemaining}`);
}

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

const map = new Map();

function onLineLoad(line) {
    metrics.linesLoaded += 1;
    if (metrics.linesLoaded % 100000 === 0) writeMetrics();
    const key = hash(line);
    if (!map.has(key)) {
        map.set(key, 1);
    }
}

function flushQueue() {
    fs.appendFileSync(outputFile, `${queue.join('\n')}\n`);
    queue.length = 0;
}

function onLineCheck(line) {
    metrics.linesChecked += 1;

    if (metrics.linesChecked % 100000 === 0) writeMetrics();

    const key = hash(line);

    // ignore any that are in the map
    if (map.has(key)) return;

    metrics.linesRemaining += 1;

    queue.push(line);
    if (queue.length === 10000) {
        flushQueue();
    }

}

(async () => {
    await streamFileByLine('./output/blocks/squares-0029.txt', onLineLoad);
    console.log('Finished loading squares-0029.txt');

    await streamFileByLine('./output/blocks/squares-0030.txt', onLineLoad);
    console.log('Finished loading squares-0030.txt');

    writeMetrics();

    await streamFileByLine('./output/all-squares.txt', onLineCheck);
    flushQueue();
    console.log('Finished checking records');

    writeMetrics();
})();



/*

 */