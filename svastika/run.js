const hash = require('object-hash');
const MagicSquareFind = require('./magic-square-find');
const fs = require('fs');
const pino = require("pino");
const pretty = require("pino-pretty");
const {stringifySquareLine, orientSquare} = require("./magic-square");

const logger = pino(pretty({ sync: true }));


const size = 5;
const svastika = new MagicSquareFind(size, logger);

const clusters = new Map();
let uniqueCount = 0;

svastika.init();
svastika.onValidMagicSquare = (square) => {
    const line = stringifySquareLine(orientSquare(square));

    // uniquify
    const key = hash(line);

    // find the cluster
    const clusterkey = key.substring(0, 3);
    if (!clusters.has(clusterkey)) clusters.set(clusterkey, new Map());
    const map = clusters.get(clusterkey);

    // determine if the map has the key or not
    if (map.has(key)) {
        const count = map.get(key);
        map.set(key, count + 1);
        return;
    }

    // a new square
    map.set(key, 1);
    uniqueCount += 1;

    logger.info("FOUND " + line);
}

svastika.findAllMagicSquares();
logger.info(`unique: ${uniqueCount}`);

