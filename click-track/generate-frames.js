const { createCanvas, loadImage } = require('canvas');
const times = require('./times');
const words = require('./words');
const Program = require('./Program');

let minImageCache = {};

async function exportCanvasToJpg({canvas, name = null, filename = null}) {
    return new Promise((resolve, reject) => {
        const fs = require('fs');

        if (filename === null) {
            filename = `${__dirname}/output/${name}.jpg`;
        }

        const stream = canvas.createJPEGStream({
            quality: 1,
            chromaSubsampling: false, progressive: false
        });
        const out = fs.createWriteStream(filename);
        stream.pipe(out);
        out.on('finish', () => {
            console.log(`${filename} was created.`);
            resolve();
        });
    });
}

function drawBackground(canvas, color) {
    let ctx = canvas.getContext('2d');
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

(async () => {

    const timing = process.argv[2] || 'short3';
    const path = process.argv[3] || 'tzaddi';

    const program = new Program(words[path], times[timing]);
    // load the image
    program.img = await loadImage(`./img/${program.config.imgSrc}`);

    const width = 1920;
    const height = 1080;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    let time = 0;

    // start behind
    time = -program.measures[0].duration;

    let frameIndex = 0;
    const frameTime = 1000 / 60;
    while (time < program.config.totalTime) {

        let frameKey = frameIndex.toString();
        while (frameKey.length < 9) {frameKey = "0" + frameKey;}

        drawBackground(canvas, program.config.background);
        drawNameCircle(canvas, ctx, program, Math.floor(time));
        const filename = `./output/${path}/${timing}/${timing}-${frameKey}.jpg`;
        await exportCanvasToJpg({canvas, filename});

        frameIndex++;
        time += frameTime;
    }

})();


function drawNameCircle(canvas, ctx, program, time) {

    // determine the measure
    const measure = time < 0 ? program.measures[0] : program.measures.find(measure => {
        return measure.start <= time && measure.start + measure.duration > time;
    });

    // determine how far through the current measure we are
    const measurePercent = (time - measure.start) / measure.duration;

    // calc center
    let center = {x: canvas.width / 2, y: canvas.height / 2};

    // calc radius
    let radius = {
        max: canvas.height / 2
    };

    // find the top and bottom of text draw area
    radius.textTop = radius.max * 0.915; // should be aligned with the UV template lip
    radius.textBottom = radius.max * 0.7; // allow for the text plus margins
    let innerCircleWidth = 6;
    radius.innerCircle = radius.textBottom - innerCircleWidth;

    // draw the image
    (() => {
        ctx.save();
        ctx.translate(center.x, center.y);

        // max size should be innerCircle / 2
        //let imgRadius = state.img.height / 2;
        let imgRadius = Math.sqrt(Math.pow(program.img.width, 2) + Math.pow(program.img.height, 2)) / 2;

        let imgScale = (radius.textBottom) / imgRadius;
        imgScale *= 0.5;
        let scaledWidth = program.img.width*imgScale;
        let scaledHeight = program.img.height*imgScale;

        ctx.drawImage(program.img,
            0,0,program.img.width,program.img.height,
            -scaledWidth / 2, -scaledHeight / 2, scaledWidth, scaledHeight);
        ctx.restore();
    })();

    // draw the line
    (() => {
        ctx.save();
        ctx.translate(center.x, center.y);

        let max = radius.textBottom;
        let angle = Math.PI * 2 * measurePercent - Math.PI/2;
        let x0 = Math.cos(angle) * max * 0.5;
        let y0 = Math.sin(angle) * max * 0.5;
        let x1 = Math.cos(angle) * max;
        let y1 = Math.sin(angle) * max;

        ctx.strokeStyle = 'rgba(0,0,0,1)';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(x0, y0);
        ctx.lineTo(x1, y1);
        ctx.stroke();

        ctx.restore();
    })();


    // draw the parts
    let anglePerCount = (Math.PI * 2) / program.partCount;
    let angle = 0;

    // find the draw position of all letters
    for (let i = 0; i < program.config.parts.length; i++) {

        ctx.save();
        ctx.translate(center.x, center.y);

        ctx.rotate(angle);

        let part = program.config.parts[i];

        let text = part.text;

        for (let i = 0; i < text.length; i++) {
            let letter = text[i];

            // generate the letter image
            let trimmed = getTrimmedLetter(letter);

            // draw the pre generated trimmed letter image
            let x = 0;
            let y = -1 * (radius.textTop + radius.textBottom) / 2;
            x -= trimmed.width / 2;
            y -= trimmed.height / 2;
            ctx.drawImage(trimmed.image, x, y, trimmed.width, trimmed.height);

            // little line as a tick
            if (i === 0) {
                ctx.strokeStyle = 'rgba(0,0,0,1)';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(0, -radius.textBottom*0.9);
                ctx.lineTo(0, -radius.textBottom*1.05);
                ctx.stroke();
            }

            ctx.rotate(Math.PI * 2 / 70);
        }

        // advance the angle
        let advanceAngle = anglePerCount * part.count;
        angle += advanceAngle;

        ctx.restore();
    }


    // *** draw the circles
    ctx.save();
    ctx.translate(center.x, center.y);

    // inner circle
    ctx.beginPath();
    ctx.arc(0, 0, radius.textTop, 0, 2 * Math.PI, false);
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#000';
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(0, 0, radius.textBottom, 0, 2 * Math.PI, false);
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#000';
    ctx.stroke();


    (() => {

        drawTimeLine(canvas, ctx, -1 * (radius.textTop-10), radius.textTop - 160, 100, 100, program, time);

        // remaining time
        let fontSize = 50;
        let fontName = 'consolas';
        ctx.font = `${fontSize}pt "${fontName}"`;

        if (time < 0) {
            // "start"
            ctx.font = `${fontSize/2}pt "${fontName}"`;
            ctx.textAlign = 'right';
            ctx.fillText("starts in:", radius.textTop, -radius.textTop + fontSize*0.5);

            // now the actual timer
            ctx.font = `${fontSize}pt "${fontName}"`;
            let countDownText = `${Math.ceil(-time/1000)}`;
            ctx.textAlign = 'right';
            ctx.fillText(countDownText, radius.textTop, -radius.textTop + fontSize * 1.8);
        }

        ctx.font = `${fontSize}pt "${fontName}"`;
        let measuresRemaining = (program.measures.length - measure.index).toString();
        ctx.textAlign = 'left';
        ctx.fillText(measuresRemaining, -radius.textTop, -radius.textTop + fontSize * 1.8);

        // lower right - time remaining
        let timeRemaining = program.config.totalTime - Math.max(time, 0);
        let timeRemainingNeg = timeRemaining < 0 ? "-" : "";
        timeRemaining = Math.ceil(Math.abs(timeRemaining) / 1000);
        let minutes = Math.floor(timeRemaining / 60);
        let seconds = (timeRemaining - minutes * 60).toString();
        if (seconds.length === 1) seconds = "0" + seconds;

        let remainingText = `${timeRemainingNeg}${minutes}:${seconds}`;
        ctx.textAlign = 'right';
        ctx.fillStyle = '#000';
        ctx.fillText(remainingText, radius.textTop, radius.textTop);

        // time per rotation
        let lineDuration = measure.duration;
        lineDuration = Math.floor(lineDuration / 100) / 10;

        let lineDurationText = lineDuration.toString();
        if (lineDurationText.indexOf(".") === -1) lineDurationText = lineDurationText + ".0";
        ctx.textAlign = 'left';
        ctx.fillText(lineDurationText, -radius.textTop, radius.textTop);

    })();

    ctx.restore();
}

function drawTimeLine(canvas, ctx, x, y, width, height, program, time) {

    const programPercent = time / program.config.totalTime;
    //generate x/y points

    //EasingFunctions
    let points = [];
    let pointCount = 50;
    for (let i = 0; i < pointCount; i++) {
        let x = i / pointCount;
        let y = program.config.easingFunction(x);
        points.push({x, y});
    }

    //let scale = 100;
    ctx.beginPath();
    ctx.moveTo(points[0].x * width + x, points[0].y * height + y);
    for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x * width + x, points[i].y * height + y);
    }
    ctx.lineWidth = 2;
    ctx.stroke();

    //draw the current state
    let p = Math.max(programPercent, 0);
    let index = Math.floor(p * pointCount);
    let xI = points[index].x * width + x;
    let yI = points[index].y * height + y;

    ctx.beginPath();
    ctx.arc(xI, yI, 4, 0, Math.PI*2);
    ctx.fillStyle = '#000';
    ctx.fill();
}

function getTrimmedLetter(letter) {
    // find preferred font size/name
    let fontSize = 40;
    let fontName = 'Times New Roman';
    if (letter === 'ⲝ') {
        //fontName = 'Noto Sans Coptic';
        //fontName = 'Antinoou';

        // this has the best version
        fontName = 'CS Pishoi';
        //fontName = 'CS Copt';
        letter = 'x';
    }
    else if (letter === 'Ⲉ') {
        //fontName = 'CS Pishoi';
        //letter = 'E';

        fontName = 'Antinoou';
    }
    else if (letter.match(/[a-z]/i)) {
        fontName = 'ColdstyleRoman';
    }

    // generate the letter image
    return getMinimumSizeImage(letter, fontName, fontSize);
}



function getMinimumSizeImage(text, fontName, fontSize) {

    let key = `${fontName}_${text}_${fontSize}`;
    if (key in minImageCache) {
        return minImageCache[key];
    }

    // create the canvas/ctx
    let width = Math.ceil(fontSize*3 * text.length);
    let height = width;
    //let canvas = createCanvas(width, height);
    let canvas = createCanvas(width, height);
    let ctx = canvas.getContext('2d');
    ctx.textAlign = 'center';

    //ctx.fillStyle = "#ffffff";
    //ctx.fillRect(0, 0, canvas.width, canvas.height);

    // set the font
    ctx.font = `${fontSize}pt "${fontName}"`;
    ctx.textAlign = 'center';

    let value = {
        yMin: height,
        yMax: 0,
        xMin: width,
        xMax: 0,
        xDraw: Math.floor(width/2),
        yDraw: Math.floor(height/2)
    };

    // draw the text
    ctx.fillStyle = "#000000";
    ctx.fillText(text, value.xDraw, value.yDraw);

    // export to file
    //await exportCanvasToImage(canvas, "letter");

    // get the pixels
    let idata = ctx.getImageData(0, 0, width, height);

    // find min/max
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            let index = (x + y * width) * 4;
            let pixel = {
                r: idata.data[index],
                g: idata.data[index+1],
                b: idata.data[index+2],
                a: idata.data[index+3]
            };

            // a non-white pixel
            //if (pixel.r < 255 || pixel.g < 255 || pixel.b < 255) {
            if (pixel.a > 0) {
                if (y > value.yMax) value.yMax = y;
                if (y < value.yMin) value.yMin = y;
                if (x > value.xMax) value.xMax = x;
                if (x < value.xMin) value.xMin = x;
            }
        }
    }

    value.width = value.xMax - value.xMin;
    value.height = value.yMax - value.yMin;

    // give a margin
    let margin = 2;
    value.width += margin * 2;
    value.height += margin * 2;
    value.xMin -= margin;
    value.yMin -= margin;
    value.xMax += margin;
    value.yMax += margin;

    // now create the min sized image?
    value.image = createCanvas(value.width, value.height);
    let ctxOutput = value.image.getContext('2d');
    ctxOutput.drawImage(canvas,
        value.xMin, value.yMin, value.width, value.height,
        0, 0, value.width, value.height);

    minImageCache[key] = value;

    return value;
}