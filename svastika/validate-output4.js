const fs = require('fs');
const path = require('path');
const readline = require("readline");
const hash = require("object-hash");

const directoryPath = 'Z:\\git\\231\\svastika\\output\\blocks';

async function processAllFiles() {
    const files = fs.readdirSync(directoryPath);

    for (const file of files) {
        const fullPath = path.join(directoryPath, file);
        const stats = fs.statSync(fullPath);

        if (stats.isDirectory()) continue;

        const outputFile = fullPath.replace('\\blocks\\', '\\blocks-unique\\');

        await dedupe(fullPath, outputFile);
    }
}

async function dedupe(inputFile, outputFile) {
    let count = 0;
    let uniqueCount = 0;

    const uniqueMaps = new Map();

    const queue = [];
    fs.writeFileSync(outputFile, '');

    function flushQueue() {
        fs.appendFileSync(outputFile, `${queue.join('\n')}\n`);
        queue.length = 0;
    }

    function writeMetrics() {
        const percent = Math.floor((uniqueCount / count) * 1000) / 10;
        console.log(`${inputFile} |  processed: ${count}  unique: ${uniqueCount}  ${percent}%`);
    }

    function onLine(line) {
        count++;
        if (count % 1000000 === 0) writeMetrics();

        const key = hash(line);

        // find map
        const superKey = key.substring(0,3);
        if (!uniqueMaps.has(superKey)) uniqueMaps.set(superKey, new Map());
        const map = uniqueMaps.get(superKey);

        // use map
        if (map.has(key)) return;
        map.set(key, 1);
        queue.push(line);
        if (queue.length % 10000 === 0){
            flushQueue();
        }
        uniqueCount++;
    }

    await streamFileByLine(inputFile, onLine);
    flushQueue();
    writeMetrics();
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

(async () => {
    processAllFiles();
})();
