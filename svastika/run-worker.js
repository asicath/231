// task-worker.js

const pino = require("pino");
const pretty = require("pino-pretty");
const { parentPort } = require('worker_threads');
const MagicSquareFind = require("./magic-square-find");
const {orientSquare, stringifySquareLine} = require("./magic-square");

const logger = pino(pretty({ sync: true }));

const size = 5;
const svastika = new MagicSquareFind(size, logger);


let currentTask = null;


svastika.init();
parentPort.postMessage({type: 'READY'});

svastika.onValidMagicSquare = (square) => {
    //logger.info('FOUND MAGIC SQUARE WORKER');
    currentTask.count += 1;
    const orientedSquare = orientSquare(square);
    parentPort.postMessage({
        type: 'FOUND',
        square: orientedSquare,
        line: stringifySquareLine(orientedSquare),
        task: currentTask
    });
};

parentPort.on('message', (task) => {
    //logger.info(`${JSON.stringify(task, null, 2)}`);
    currentTask = task;
    svastika.findAllMagicSquaresWorker(task.offsetIndex0, task.offsetIndex1);
    parentPort.postMessage({ type: 'TASK-COMPLETE', task});
});
