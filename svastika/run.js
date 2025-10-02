const SwastikaFast = require('./svastika-fast');
const fs = require('fs');
const pino = require("pino");
const pretty = require("pino-pretty");

const logger = pino(pretty({ sync: true }));


const size = 5;
const svastika = new SwastikaFast(size, logger);

svastika.findAllMagicSquares();

