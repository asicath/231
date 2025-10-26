const pino = require("pino");
const pretty = require("pino-pretty");
const { Worker } = require('worker_threads');
const MagicSquareFind = require("./magic-square-find");
const fs = require("fs");
const hash = require("object-hash");

const logger = pino(pretty({ sync: true }));

// init the magic square finder
const size = 5;
const magicSquareFind = new MagicSquareFind(size, logger);
logger.info("starting init");
magicSquareFind.init();

// create metrics
const metrics = {
    lastMetricTime: null,
    lastpercentExpected: 0
}

// generate the task list
let offsetIndexList = [];
for (let i = 0; i < magicSquareFind.allRows.length - (size - 1); i++) {

    // it must have the number 1
    const keyRow = magicSquareFind.allRows[i];
    if (keyRow.indexOf(1) === -1) {
        continue;
    }

    let queueIndex = i.toString();
    while (queueIndex.length < 4) {
        queueIndex = '0' + queueIndex;
    }
    for (let j = i + 1; j < magicSquareFind.allRows.length - (size - 2); j++) {
        offsetIndexList.push({
            offsetIndex0: i,
            offsetIndex1: j,
            block: `${i}-${j}`,
            queueIndex,
            count: 0
        });
    }
}

metrics.start = offsetIndexList.length;

const taskCompleteFile = './output/task-complete.txt';
let tasksCompletedPreviously = fs.readFileSync(taskCompleteFile).toString().split('\n');
let tasksCompletedPreviouslyCount = 0;

tasksCompletedPreviously = tasksCompletedPreviously.map(line => {
    if (line.length === 0) return;
    const a = line.split(',');
    const count = +a[1];
    tasksCompletedPreviouslyCount += count;
    return a[0];
});

offsetIndexList = offsetIndexList.filter(item => {
    // hard limit
    if (item.offsetIndex0 <= 32) return false;
    // previously completed
    if (tasksCompletedPreviously.indexOf(item.block) !== -1) return false;
    return true;
});

metrics.count = tasksCompletedPreviouslyCount;

logger.info(`init complete ${offsetIndexList.length} blocks generated`);

// create write queue
const writeQueues = new Map();
for (let item of offsetIndexList) {
    if (writeQueues.has(item.queueIndex)) continue;
    writeQueues.set(item.queueIndex, {
        queue: [],
        timeout: null,
        filename: `./output/blocks/squares-${item.queueIndex}.txt`
    });
}

function writeToQueue(text, queueIndex) {
    const blockQueue = writeQueues.get(queueIndex);
    blockQueue.queue.push(text);

    if (blockQueue.queue.length === 10000) {
        flushQueue(blockQueue);
        if (blockQueue.timeout !== null) {
            clearTimeout(blockQueue.timeout);
            blockQueue.timeout = null;
        }
    }
    else {
        if (blockQueue.timeout === null) {
            blockQueue.timeout = setTimeout(() => {
                blockQueue.timeout = null;
                flushQueue(blockQueue);
            }, 1000*60*10);
        }
    }
}

function flushQueue(blockQueue) {

    // if (!fs.existsSync(blockQueue.filename)) {
    //     fs.writeFileSync(outputFile, '');
    // }

    //last block queued in last night's run 30-307

    fs.appendFileSync(blockQueue.filename, `${blockQueue.queue.join('\n')}\n`);
    blockQueue.queue.length = 0;
}



// start the workers
const poolSize =  16; //os.cpus().length;
for (let i = 0; i < poolSize; i++) {
    startWorker();
}

function formatPercent(percent) {
    return `${Math.floor(percent * 1000000)/10000}`;
}

function writeMetrics() {
    const percent = 1 - (offsetIndexList.length / metrics.start);
    const expectedSquares = 275305224 * 8;
    const percentExpected = metrics.count / expectedSquares;

    let remainingHours = 0;
    if (metrics.lastMetricTime !== null) {
        const deltaTime = Date.now() - metrics.lastMetricTime;
        const deltaPercent = percentExpected - metrics.lastpercentExpected;

        const timePerPercent = deltaTime / deltaPercent;
        const timeRemaining = (1 - percentExpected) * timePerPercent;


        remainingHours = timeRemaining / (1000 * 60 * 60);
        remainingHours = Math.floor(remainingHours * 100) / 100;
    }
    metrics.lastMetricTime = Date.now();
    metrics.lastpercentExpected = percentExpected;

    const nextBlock = offsetIndexList.length === 0 ? 'NONE' : `${offsetIndexList[0].offsetIndex0}-${offsetIndexList[0].offsetIndex1}`;

    logger.info(`work progress: ${formatPercent(percent)}%  squares found: ${metrics.count}  estimated progress: ${formatPercent(percentExpected)}  hours remaining: ${remainingHours}  next block: ${nextBlock}`);
}

function assignNewTask(worker) {
    if (offsetIndexList.length === 0) return;

    // straight forward
    const task = offsetIndexList.shift();

    // random method
    //const i = Math.floor(Math.random() * offsetIndexList.length);
    //const offsetIndex = offsetIndexList.splice(i, 1)[0];

    worker.postMessage(task);
}

function startWorker() {
    logger.info("Starting Worker");
    const worker = new Worker('./run-worker.js');

    worker.on('message', (msg) => {
        if (msg.type === 'READY') {
            assignNewTask(worker);
        }
        else if (msg.type === 'FOUND') {
            onMagicSquare(msg.square, msg.line, msg.task);
        }
        else if (msg.type === 'TASK-COMPLETE') {

            fs.appendFileSync('./output/task-complete.txt', `${msg.task.block},${msg.task.count}\n`)
            assignNewTask(worker);
        }
    });
    worker.on('error', console.error);
    worker.on('exit', () => {
        logger.warn('Worker has been terminated.');
    });

}



function onMagicSquare(square, line, task) {

    // // uniquify
    // const key = hash(line);
    //
    // // find the cluster
    // const clusterkey = key.substring(0, 3);
    // if (!clusters.has(clusterkey)) clusters.set(clusterkey, new Map());
    // const map = clusters.get(clusterkey);
    //
    // // determine if the map has the key or not
    // if (map.has(key)) {
    //     const count = map.get(key);
    //     map.set(key, count + 1);
    //     return;
    // }
    //
    // // a new square
    // map.set(key, 1);

    //logger.info('FOUND MAGIC SQUARE MASTER');
    metrics.count++;
    if (metrics.count % 1000000 === 0) writeMetrics();

    //fs.appendFileSync(outputFile, `${line}\n`);

    // write to file
    writeToQueue(line, task.queueIndex);
}
