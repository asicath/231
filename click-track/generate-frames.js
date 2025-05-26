const { createCanvas, loadImage } = require('canvas');
const times = require('./times');
const words = require('./words');
const Program = require('./Program');
const fs = require("fs");
const EasingFunctions = require('./easing');

let minImageCache = {};
function clearLetterCache() {
    minImageCache = {};
}

const randomCache = [];
let randomIndex = 0;
let backgroundCanvas = null;

function resetBackgroundCanvas() {
    backgroundCanvas = null;
}

function getRandom() {

    if (randomIndex >= randomCache.length) {
        const value = Math.random();
        randomCache.push(value);
        randomIndex += 1;
        return value;
    }
    //if (randomIndex % 100000 === 0) console.log(randomIndex);
    return randomCache[randomIndex++];
}

function resetRandomIndex() {
    randomIndex = 0;
}

async function exportCanvasToJpg({canvas, name = null, filename = null}) {
    return new Promise((resolve, reject) => {

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
            resolve();
        });
    });
}

function drawBackground({canvas, color, center, radius}) {

    let ctx = canvas.getContext('2d');
    ctx.fillStyle = radius.background.color;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // rays!
    if (radius.background.rayed) {
        ctx.save();
        ctx.translate(center.x, center.y);
        const angleOffset = (Math.PI / 24) * 3;

        const rayAngle = (Math.PI * 2 / 24);
        const margin = rayAngle * 0.02;

        for (let i = 0; i < 12; i++) {
            // outer circle lines
            const angle0 = angleOffset + margin + rayAngle * i*2;
            const angle1 = angleOffset - margin + rayAngle * (i*2+1);
            let x0 = Math.cos(angle0) * 4000;
            let y0 = Math.sin(angle0) * 4000;
            let x1 = Math.cos(angle1) * 4000;
            let y1 = Math.sin(angle1) * 4000;

            ctx.beginPath();
            ctx.moveTo(0,0);
            ctx.lineTo(x0, y0);
            ctx.lineTo(x1, y1);
            ctx.closePath();
            ctx.fillStyle = radius.background.rayed;
            ctx.fill();
        }
    }

    // flecked
    if (radius.background.flecked) {
        fleckIt(canvas, ctx, radius.background.flecked);
    }

    ctx.restore();
}

function fadeFill({ctx, canvas, color, center, radius, time, program}) {

    let percent = 1 - Math.max(0, Math.min(1, time / program.config.totalTime));

    percent = program.config.easingFunction(percent);

    let hex = Math.floor(255 * percent).toString(16);
    if (hex.length === 1) hex = "0" + hex;
    ctx.fillStyle = radius.background.colorInitial + hex;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

(async () => {
/*    const paths = [
        'aleph',
        'mem',
        'shin',

        'gimel',
        'beth',
        'daleth',
        'resh',
        'pe',
        'kaph',
        'tav',

        'heh',
        'lamed',
        'nun',
        'ayin',
        'tzaddi',
    ];*/

    const paths = ['beth']

    //await generatePreviews();
    //await generateForPath('mem');
    for (const path of paths) {
        await generateForPath(path);
    }

})();

async function generateForPath(path) {
    // TODO generate card frames
    await execute({timing: 'drum02', path});
    //await executeTimer({durationMinutes: 11, path});
    await execute({timing: 'drum03', path});
    //await executeTimer({durationMinutes: 3, path});
    await execute({timing: 'drum11', path});
    //await executeTimer({durationMinutes: 2, path});
    // TODO generate card frames
}

async function generatePreviews() {
    const paths = Object.keys(words);
    for (const path of paths) {
        await execute({timing: 'drum02', path, startTime: 0, outputIndex: 0});
        await execute({timing: 'drum02', path, startTime: 1000 * 60 * 60, outputIndex: 1});
    }
}

async function executeTimer({durationMinutes, path, framesPerSecond = 60}) {

    const filepath = `./output/${path}/timer${durationMinutes.toString()}`;
    if (!fs.existsSync(filepath)) {
        fs.mkdirSync(filepath);
    }

    const width = 1920;
    const height = 1080;
    const canvas = createCanvas(width, height);

    let time = 0;
    let index = 0;
    const duration =  1000 * 60 * durationMinutes;

    while (time <= duration) {

        // draw
        drawTimer_time(canvas, duration, time);

        // output
        let frameKey = index.toString();
        while (frameKey.length < 9) {frameKey = "0" + frameKey;}
        const filename = `${filepath}/timer-${frameKey}.jpg`;
        await exportCanvasToJpg({canvas, filename});

        // log
        console.log(`${filename} was created.`);

        // setup next frame
        time += 1000 / framesPerSecond;
        index++;
    }

}

function drawTimer_time(canvas, duration, time) {

    // determine text
    const totalSeconds = Math.max(0, Math.floor((duration - time) / 1000));
    const seconds = totalSeconds % 60;
    const minutes = (totalSeconds - seconds) / 60;
    const ss = `${seconds < 10 ? '0' : ''}${seconds}`;
    const mm = `${minutes < 10 ? ' ' : ''}${minutes}`;
    const text = `${mm}:${ss}`;

    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);

    const fontSize = 50;
    const fontName = 'consolas';
    ctx.font = `${fontSize}pt "${fontName}"`;
    ctx.textAlign = 'center';
    ctx.fillStyle = '#808080';
    ctx.fillText(text, 0, fontSize * 0.45);

    ctx.restore();
}

async function execute({path, timing, startTime = null, outputIndex = null, skipFrames = 0}) {
    resetBackgroundCanvas();
    clearLetterCache();

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

    // make sure the directories exist
    const filepathParent = `./output/${path}`;
    if (!fs.existsSync(filepathParent)) {
        fs.mkdirSync(filepathParent);
    }
    const filepath = `./output/${path}/${timing}`;
    if (!fs.existsSync(filepath)) {
        fs.mkdirSync(filepath);
    }

    let frameIndex = outputIndex || 0;
    const frameTime = 1000 / 60;
    while (time < program.config.totalTime * 1.05) {
        resetRandomIndex();

        if (startTime !== null) time = startTime;

        if (skipFrames > 0) {
            skipFrames--;
        }
        // actually generate the frame
        else {
            let frameKey = frameIndex.toString();
            while (frameKey.length < 9) {frameKey = "0" + frameKey;}

            drawNameCircle(canvas, ctx, program, Math.floor(time));
            const filename = `${filepath}/${timing}-${frameKey}.jpg`;
            await exportCanvasToJpg({canvas, filename});
            console.log(`${filename} was created.`);
        }

        frameIndex++;
        time += frameTime;

        // startTime is for debugging, only one frame required
        if (startTime !== null) break;
    }

}


function drawNameCircle(canvas, ctx, program, time) {

    // determine the measure
    let measure, remainingCount;
    if (time < 0) {
        measure = program.measures[0];
        remainingCount = program.measures.length;
    }
    else {
        measure = program.measures.find(measure => {
            return measure.start <= time && measure.start + measure.duration > time;
        });
        if (!measure) {
            measure = program.measures[program.measures.length - 1];
            remainingCount = 0;
        } else {
            remainingCount = program.measures.length - program.measures.indexOf(measure);
        }
    }

    // determine how far through the current measure we are
    const measurePercent = (time - measure.start) / measure.duration;

    // calc center
    const center = {x: canvas.width / 2, y: canvas.height / 2};

    // calc radius
    const radius = {
        max: canvas.height / 2,
        text: program.config.text,
        fore: program.config.fore,
        back: program.config.back, // the back of circle

        sigilRatio: 0.75,

        background: {
            colorInitial: program.config.back,
            color: program.config.backEnd,
            rayed: program.config.backEndRayed,
            flecked: program.config.backFlecked
        }
    };

    // find the top and bottom of text draw area
    radius.textTop = radius.max * 0.915; // should be aligned with the UV template lip
    radius.textBottom = radius.max * 0.7; // allow for the text plus margins
    let innerCircleWidth = 6;
    radius.innerCircle = radius.textBottom - innerCircleWidth;

    if (backgroundCanvas === null) {
        console.log('generate background')
        backgroundCanvas = createCanvas(canvas.width, canvas.height);
        drawBackground({canvas: backgroundCanvas, color: program.config.background, center, radius});
    }
    ctx.drawImage(backgroundCanvas, 0, 0);

    fadeFill({ctx, canvas, color: program.config.background, center, radius, program, time})

    fillCircle({ctx, center, radius, program});

    // draw the image
    drawSigil({ctx, center, radius, program});

    // draw the pointer
    drawMovingPointer({ctx, center, radius, measurePercent, program});

    // draw the letters
    drawWordParts({ctx, center, radius, parts: program.config.parts, program});

    // draw the circles
    drawCircles({ctx, center, radius, program});

    // draw the info around the circle
    drawHelperInfo({ctx, center, radius, canvas, program, time, measure, remainingCount});
}
function drawSigil({center, radius, ctx, program}) {
    ctx.save();
    ctx.translate(center.x, center.y);

    // max size should be innerCircle / 2
    //let imgRadius = program.img.height / 2;
    let imgRadius = Math.sqrt(Math.pow(program.img.width, 2) + Math.pow(program.img.height, 2)) / 2;

    let imgScale = (radius.textBottom) / imgRadius;
    imgScale *= radius.sigilRatio;
    let scaledWidth = program.img.width*imgScale;
    let scaledHeight = program.img.height*imgScale;

    ctx.drawImage(program.img,
        0,0,program.img.width,program.img.height,
        -scaledWidth / 2, -scaledHeight / 2, scaledWidth, scaledHeight);
    ctx.restore();
}

function drawMovingPointer({center, radius, ctx, measurePercent, program}) {
    ctx.save();
    ctx.translate(center.x, center.y);

    let max = radius.textBottom;
    let angle = Math.PI * 2 * measurePercent - Math.PI/2;
    let x0 = Math.cos(angle) * max * radius.sigilRatio;
    let y0 = Math.sin(angle) * max * radius.sigilRatio;
    let x1 = Math.cos(angle) * max;
    let y1 = Math.sin(angle) * max;

    ctx.strokeStyle = radius.text;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.stroke();

    ctx.restore();
}

function drawWordParts({center, radius, ctx, parts, program}) {

    // draw the parts
    let anglePerCount = (Math.PI * 2) / program.beatsPerMeasure;
    let angle = 0;

    // find the draw position of all letters
    for (let i = 0; i < program.config.parts.length; i++) {

        ctx.save();
        ctx.translate(center.x, center.y);

        ctx.rotate(angle);

        let part = parts[i];

        let text = part.text;

        for (let i = 0; i < text.length; i++) {
            const letter = text[i];

            // generate the letter image
            const trimmed = getTrimmedLetter(letter, radius.text);

            // draw the pre generated trimmed letter image
            let x = 0;
            let y = -1 * (radius.textTop + radius.textBottom) / 2;
            x -= trimmed.width / 2;
            y -= trimmed.height / 2;
            ctx.drawImage(trimmed.image, x, y, trimmed.width, trimmed.height);

            // little line as a tick
            if (i === 0) {
                ctx.strokeStyle = radius.fore;
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(0, -radius.textBottom*0.9);
                ctx.lineTo(0, -radius.textBottom*1.05);
                ctx.stroke();
            }

            ctx.rotate(Math.PI * 2 / 70);
        }

        // advance the angle
        let advanceAngle = anglePerCount * part.beats;
        angle += advanceAngle;

        ctx.restore();
    }
}

function fillCircle({center, radius, ctx, program}) {
    ctx.save();
    ctx.translate(center.x, center.y);

    // outer circle lines
    ctx.beginPath();
    ctx.arc(0, 0, radius.textTop + 8, 0, 2 * Math.PI, false);
    ctx.lineWidth = 4;

    ctx.fillStyle = radius.back;
    ctx.fill();

    ctx.restore();
}

function drawCircles({center, radius, ctx, program}) {
    ctx.save();
    ctx.translate(center.x, center.y);

    // outer circle lines
    ctx.beginPath();
    ctx.arc(0, 0, radius.textTop + 8, 0, 2 * Math.PI, false);
    ctx.lineWidth = 4;
    ctx.strokeStyle = radius.fore;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(0, 0, radius.textTop, 0, 2 * Math.PI, false);
    ctx.lineWidth = 4;
    ctx.strokeStyle = radius.fore;
    ctx.stroke();

    // inner circle line
    ctx.beginPath();
    ctx.arc(0, 0, radius.textBottom, 0, 2 * Math.PI, false);
    ctx.lineWidth = 4;
    ctx.strokeStyle = radius.fore;
    ctx.stroke();

    ctx.restore();
}

function drawHelperInfo({center, radius, ctx, canvas, program, time, measure, remainingCount}) {
    ctx.save();
    ctx.translate(center.x, center.y);

    ctx.fillStyle = radius.text;
    ctx.strokeStyle = radius.text;

    (() => {
        drawTimeLine(ctx, -1 * (radius.textTop-10), radius.textTop - 160, 100, 100, program, time);

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

        // upper left - count remaining
        ctx.font = `${fontSize}pt "${fontName}"`;
        let measuresRemaining = (program.measures.length - measure.index).toString();
        measuresRemaining = remainingCount;
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

function drawTimeLine(ctx, x, y, width, height, program, time) {

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
    const programPercent = time / program.config.totalTime;
    let p = Math.min(1, Math.max(programPercent, 0));
    let index = Math.min(Math.floor(p * pointCount), points.length - 1);
    let xI = points[index].x * width + x;
    let yI = points[index].y * height + y;

    ctx.beginPath();
    ctx.arc(xI, yI, 4, 0, Math.PI*2);
    ctx.fill();
}

function getTrimmedLetter(letter, color) {

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
    return getMinimumSizeImage(letter, fontName, fontSize, color);
}

function getMinimumSizeImage(text, fontName, fontSize, color= "#000000") {

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
    ctx.fillStyle = color;
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

function fleckIt(canvas, ctx, color) {

    let colorArray = Array.isArray(color) ? color : [color];
    let colorIndex = 0;

    let radius = 1;
    let angle = 0;
    let maxRadius = Math.max(canvas.width, canvas.height);
    let center = {x:canvas.width/2, y: canvas.height/2};

    let ratio = canvas.height / 1200;

    let idealDistance = 15 * ratio;
    let radiusIncrPerRevolution = 12 * ratio;

    //let idealDistance = 60 * ratio;
    //let radiusIncrPerRevolution = 48 * ratio;

    let maxTimes = 1000000;

    while (radius < maxRadius && maxTimes > 0) {
        // find point
        let x = Math.cos(angle) * radius + center.x;
        let y = Math.sin(angle) * radius + center.y;

        // add some random
        const randomSwing = 100;
        x += (maxRadius / (randomSwing * 2)) - getRandom() * maxRadius / randomSwing;
        y += (maxRadius / (randomSwing * 2)) - getRandom() * maxRadius / randomSwing;

        // draw at point
        drawFleck(ctx, colorArray[colorIndex++ % colorArray.length], x, y, ratio);


        let d = idealDistance;
        let percent = -1;

        while (d > 0) {
            // determine circumference
            let c = Math.PI * 2 * radius;

            if (d > c) {
                let percent = 0.01;
                radius += radiusIncrPerRevolution * percent;
                angle += Math.PI * 2 * percent;

                c = Math.PI * 2 * radius * percent;

                d -= c;

                // angle stays the same
            }
            else {

                percent = d / c;
                angle += Math.PI * 2 * percent;
                angle = angle % (Math.PI * 2);
                radius += radiusIncrPerRevolution * percent;

                d = 0; //exit
            }
        }

        //console.log(maxTimes + " radius:" + radius + " percent:" + percent + " circum:" + c);

        maxTimes--;
    }

}

function drawFleck(ctx, color, xCenter, yCenter, ratio) {

    const radiusMax = (getRandom() * 2 + 3) * ratio;
    const radiusMin = radiusMax * getRandom() * 0.2 + 0.3;

    const angleOffset = getRandom() * Math.PI * 2;

    const pointCount = 2;
    const subPointCount = 25;

    // create the points
    const mainPoints = [];
    for (let i = 0; i < pointCount; i++) {
        const radius = radiusMin + (radiusMax - radiusMin) * getRandom();

        const angle = ((Math.PI * 2) / pointCount) * i;
        const point = {
            angle,
            radius,
            isMain: true
        };
        mainPoints.push(point);
    }

    // now the subpoints
    const points = [];
    for (let i = 0; i < mainPoints.length; i++) {
        const p0 = mainPoints[i];
        const p1 = mainPoints[(i+1) % mainPoints.length];
        points.push(p0);

        // now the inbetween
        for (let j = 0; j < subPointCount; j++) {
            const percentBase = (j + 1) / (subPointCount + 1);
            const percent = EasingFunctions.easeInOutCubic(percentBase);

            const extraAngle = p0.angle > p1.angle ? Math.PI * 2 : 0;
            const angle = p0.angle + ((p1.angle + extraAngle) - p0.angle) * percentBase;
            const radius = p0.radius + (p1.radius - p0.radius) * percent;

            const point = {
                angle,
                radius,
                isMain: false
            };
            points.push(point);
        }
    }

    // now draw them
    ctx.beginPath();
    for (let i = 0; i < points.length; i++) {
        const point = points[i];

        const x = Math.cos(point.angle + angleOffset) * point.radius + xCenter;
        const y = Math.sin(point.angle + angleOffset) * point.radius + yCenter;

        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
}