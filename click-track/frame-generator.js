const { createCanvas, loadImage } = require('canvas');
const fs = require("fs");
const EasingFunctions = require('./easing');
const ImageHelper = require('./image-helper');

const times = require('./times');
const words = require('./words');
const Program = require('./Program');


class FrameGenerator {

    constructor() {
        this.minImageCache = {};
        this.randomCache = [];
        this.randomIndex = 0;
        this.backgroundCache = new Map();
    }

    async execute({path, timing, startTime = null, outputIndex = null, skipFrames = 0}) {

        const program = new Program(words[path], times[timing]);
        // load the image
        program.img = await loadImage(`./img/${program.config.imgSrc}`);

        const width = 1920;
        const height = 1080;
        const canvas = createCanvas(width, height);
        const ctx = canvas.getContext('2d');

        const backgroundColor = {
            colorInitial: program.config.back,
            color: program.config.backEnd,
            rayed: program.config.backEndRayed,
            flecked: program.config.backFlecked
        };

        if (!this.backgroundCache.has(path)) {
            console.log('generating background');
            const bg = createCanvas(canvas.width, canvas.height);
            this.drawBackground({canvas: bg, backgroundColor});
            this.backgroundCache.set(path, bg);
        }

        const backgroundCanvas = this.backgroundCache.get(path);

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

            if (startTime !== null) time = startTime;

            if (skipFrames > 0) {
                skipFrames--;
            }

            // actually generate the frame
            else {
                let frameKey = frameIndex.toString();
                while (frameKey.length < 9) {frameKey = "0" + frameKey;}

                // determine the measure and remainingCount
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

                const frameInfo = {
                    time: Math.floor(time),
                    remainingCount,
                    measure,
                    measurePercent
                };

                // draw the background
                ctx.drawImage(backgroundCanvas, 0, 0);
                this.fadeFill({ctx, canvas, backgroundColor, program, time})

                // draw the foreground
                this.drawNameCircle(canvas, ctx, program, frameInfo);

                // export to file
                const filename = `${filepath}/${timing}-${frameKey}.jpg`;
                await ImageHelper.exportCanvasToJpg({canvas, filename});
                console.log(`${filename} was created.`);
            }

            frameIndex++;
            time += frameTime;

            // startTime is for debugging, only one frame required
            if (startTime !== null) break;
        }

    }

    getRandom() {

        if (this.randomIndex >= this.randomCache.length) {
            const value = Math.random();
            this.randomCache.push(value);
            this.randomIndex += 1;
            return value;
        }
        //if (this.randomIndex % 100000 === 0) console.log(this.randomIndex);
        return this.randomCache[this.randomIndex++];
    }

    fadeFill({ctx, canvas, backgroundColor, time, program}) {

        let percent = 1 - Math.max(0, Math.min(1, time / program.config.totalTime));

        percent = program.config.easingFunction(percent);

        let hex = Math.floor(255 * percent).toString(16);
        if (hex.length === 1) hex = "0" + hex;
        ctx.fillStyle = backgroundColor.colorInitial + hex;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    async executeTimer({durationMinutes, path, framesPerSecond = 60}) {

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
            this.drawTimer_time(canvas, duration, time);

            // output
            let frameKey = index.toString();
            while (frameKey.length < 9) {frameKey = "0" + frameKey;}
            const filename = `${filepath}/timer-${frameKey}.jpg`;
            await ImageHelper.exportCanvasToJpg({canvas, filename});

            // log
            console.log(`${filename} was created.`);

            // setup next frame
            time += 1000 / framesPerSecond;
            index++;
        }

    }

    drawTimer_time(canvas, duration, time) {

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


    drawNameCircle(canvas, ctx, program, frameInfo) {

        // calc center
        const center = {x: canvas.width / 2, y: canvas.height / 2};

        // calc sigilInfo
        const sigilInfo = this.getSigilInfo(canvas, program);

        this.fillCircle({ctx, center, sigilInfo});

        // draw the image
        this.drawSigil({ctx, center, sigilInfo, program});

        // draw the pointer
        this.drawMovingPointer({ctx, center, sigilInfo, frameInfo});

        // draw the letters
        this.drawWordParts({ctx, center, sigilInfo, parts: program.config.parts, program});

        // draw the circles
        this.drawCircles({ctx, center, sigilInfo});

        // draw the info around the circle
        this.drawHelperInfo({ctx, center, sigilInfo, program, frameInfo});
    }

    getSigilInfo(canvas, program) {
        const sigilInfo = {
            max: canvas.height / 2,
            text: program.config.text,
            fore: program.config.fore,
            back: program.config.back, // the back of circle

            sigilRatio: 0.75
        };

        // find the top and bottom of text draw area
        sigilInfo.textTop = sigilInfo.max * 0.915; // should be aligned with the UV template lip
        sigilInfo.textBottom = sigilInfo.max * 0.7; // allow for the text plus margins
        let innerCircleWidth = 6;
        sigilInfo.innerCircle = sigilInfo.textBottom - innerCircleWidth;

        return sigilInfo;
    }

    drawSigil({center, sigilInfo, ctx, program}) {
        ctx.save();
        ctx.translate(center.x, center.y);

        // max size should be innerCircle / 2
        //let imgRadius = program.img.height / 2;
        let imgRadius = Math.sqrt(Math.pow(program.img.width, 2) + Math.pow(program.img.height, 2)) / 2;

        let imgScale = (sigilInfo.textBottom) / imgRadius;
        imgScale *= sigilInfo.sigilRatio;
        let scaledWidth = program.img.width*imgScale;
        let scaledHeight = program.img.height*imgScale;

        ctx.drawImage(program.img,
            0,0,program.img.width,program.img.height,
            -scaledWidth / 2, -scaledHeight / 2, scaledWidth, scaledHeight);
        ctx.restore();
    }

    drawMovingPointer({center, sigilInfo, ctx, frameInfo}) {
        ctx.save();
        ctx.translate(center.x, center.y);

        let max = sigilInfo.textBottom;
        let angle = Math.PI * 2 * frameInfo.measurePercent - Math.PI/2;
        let x0 = Math.cos(angle) * max * sigilInfo.sigilRatio;
        let y0 = Math.sin(angle) * max * sigilInfo.sigilRatio;
        let x1 = Math.cos(angle) * max;
        let y1 = Math.sin(angle) * max;

        ctx.strokeStyle = sigilInfo.text;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(x0, y0);
        ctx.lineTo(x1, y1);
        ctx.stroke();

        ctx.restore();
    }

    drawWordParts({center, sigilInfo, ctx, parts, program}) {

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
                const trimmed = this.getTrimmedLetter(letter, sigilInfo.text);

                // draw the pre generated trimmed letter image
                let x = 0;
                let y = -1 * (sigilInfo.textTop + sigilInfo.textBottom) / 2;
                x -= trimmed.width / 2;
                y -= trimmed.height / 2;
                ctx.drawImage(trimmed.image, x, y, trimmed.width, trimmed.height);

                // little line as a tick
                if (i === 0) {
                    ctx.strokeStyle = sigilInfo.fore;
                    ctx.lineWidth = 2;
                    ctx.beginPath();
                    ctx.moveTo(0, -sigilInfo.textBottom*0.9);
                    ctx.lineTo(0, -sigilInfo.textBottom*1.05);
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

    fillCircle({center, sigilInfo, ctx}) {
        ctx.save();
        ctx.translate(center.x, center.y);

        // outer circle lines
        ctx.beginPath();
        ctx.arc(0, 0, sigilInfo.textTop + 8, 0, 2 * Math.PI, false);
        ctx.lineWidth = 4;

        ctx.fillStyle = sigilInfo.back;
        ctx.fill();

        ctx.restore();
    }

    drawCircles({center, sigilInfo, ctx}) {
        ctx.save();
        ctx.translate(center.x, center.y);

        // outer circle lines
        ctx.beginPath();
        ctx.arc(0, 0, sigilInfo.textTop + 8, 0, 2 * Math.PI, false);
        ctx.lineWidth = 4;
        ctx.strokeStyle = sigilInfo.fore;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(0, 0, sigilInfo.textTop, 0, 2 * Math.PI, false);
        ctx.lineWidth = 4;
        ctx.strokeStyle = sigilInfo.fore;
        ctx.stroke();

        // inner circle line
        ctx.beginPath();
        ctx.arc(0, 0, sigilInfo.textBottom, 0, 2 * Math.PI, false);
        ctx.lineWidth = 4;
        ctx.strokeStyle = sigilInfo.fore;
        ctx.stroke();

        ctx.restore();
    }

    drawHelperInfo({center, sigilInfo, ctx, program, frameInfo}) {
        ctx.save();
        ctx.translate(center.x, center.y);

        ctx.fillStyle = sigilInfo.text;
        ctx.strokeStyle = sigilInfo.text;

        (() => {
            this.drawTimeLine(ctx, -1 * (sigilInfo.textTop-10), sigilInfo.textTop - 160, 100, 100, program, frameInfo.time);

            // remaining time
            let fontSize = 50;
            let fontName = 'consolas';
            ctx.font = `${fontSize}pt "${fontName}"`;

            if (frameInfo.time < 0) {
                // "start"
                ctx.font = `${fontSize/2}pt "${fontName}"`;
                ctx.textAlign = 'right';
                ctx.fillText("starts in:", sigilInfo.textTop, -sigilInfo.textTop + fontSize*0.5);

                // now the actual timer
                ctx.font = `${fontSize}pt "${fontName}"`;
                let countDownText = `${Math.ceil(-frameInfo.time/1000)}`;
                ctx.textAlign = 'right';
                ctx.fillText(countDownText, sigilInfo.textTop, -sigilInfo.textTop + fontSize * 1.8);
            }

            // upper left - count remaining
            ctx.font = `${fontSize}pt "${fontName}"`;
            let measuresRemaining = (program.measures.length - frameInfo.measure.index).toString();
            measuresRemaining = frameInfo.remainingCount;
            ctx.textAlign = 'left';
            ctx.fillText(measuresRemaining, -sigilInfo.textTop, -sigilInfo.textTop + fontSize * 1.8);

            // lower right - time remaining
            let timeRemaining = program.config.totalTime - Math.max(frameInfo.time, 0);
            let timeRemainingNeg = timeRemaining < 0 ? "-" : "";
            timeRemaining = Math.ceil(Math.abs(timeRemaining) / 1000);
            let minutes = Math.floor(timeRemaining / 60);
            let seconds = (timeRemaining - minutes * 60).toString();
            if (seconds.length === 1) seconds = "0" + seconds;

            let remainingText = `${timeRemainingNeg}${minutes}:${seconds}`;
            ctx.textAlign = 'right';
            ctx.fillText(remainingText, sigilInfo.textTop, sigilInfo.textTop);

            // time per rotation
            let lineDuration = frameInfo.measure.duration;
            lineDuration = Math.floor(lineDuration / 100) / 10;

            let lineDurationText = lineDuration.toString();
            if (lineDurationText.indexOf(".") === -1) lineDurationText = lineDurationText + ".0";
            ctx.textAlign = 'left';
            ctx.fillText(lineDurationText, -sigilInfo.textTop, sigilInfo.textTop);
        })();

        ctx.restore();
    }

    drawTimeLine(ctx, x, y, width, height, program, time) {

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

    getTrimmedLetter(letter, color) {

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
        return this.getMinimumSizeImage(letter, fontName, fontSize, color);
    }

    getMinimumSizeImage(text, fontName, fontSize, color= "#000000") {

        let key = `${fontName}_${text}_${fontSize}`;
        if (key in this.minImageCache) {
            return this.minImageCache[key];
        }

        // create the canvas/ctx
        let width = Math.ceil(fontSize*3 * text.length);
        let height = width;
        const canvas = createCanvas(width, height);
        const ctx = canvas.getContext('2d');
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

        this.minImageCache[key] = value;

        return value;
    }

    drawBackground({canvas, backgroundColor}) {

        const ctx = canvas.getContext('2d');

        // the base color
        ctx.fillStyle = backgroundColor.color;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // draw rays
        if (backgroundColor.rayed) {
            this.drawRays(canvas, ctx, backgroundColor.rayed)
        }

        // draw flecks
        if (backgroundColor.flecked) {
            this.drawFlecks(canvas, ctx, backgroundColor.flecked);
        }
    }

    drawRays(canvas, ctx, color) {
        // calc center
        const center = {x: canvas.width / 2, y: canvas.height / 2};

        ctx.save();
        ctx.translate(center.x, center.y);
        const angleOffset = (Math.PI / 24) * 3;

        const rayAngle = (Math.PI * 2 / 24);
        const margin = rayAngle * 0.02;

        for (let i = 0; i < 12; i++) {
            // outer circle lines
            const angle0 = angleOffset + margin + rayAngle * i*2;
            const angle1 = angleOffset - margin + rayAngle * (i*2+1);

            const x0 = Math.cos(angle0) * 4000;
            const y0 = Math.sin(angle0) * 4000;
            const x1 = Math.cos(angle1) * 4000;
            const y1 = Math.sin(angle1) * 4000;

            ctx.beginPath();
            ctx.moveTo(0,0);
            ctx.lineTo(x0, y0);
            ctx.lineTo(x1, y1);
            ctx.closePath();
            ctx.fillStyle = color;
            ctx.fill();
        }

        ctx.restore();
    }

    drawFlecks(canvas, ctx, color) {

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
            x += (maxRadius / (randomSwing * 2)) - this.getRandom() * maxRadius / randomSwing;
            y += (maxRadius / (randomSwing * 2)) - this.getRandom() * maxRadius / randomSwing;

            // draw at point
            this.drawFleck(ctx, colorArray[colorIndex++ % colorArray.length], x, y, ratio);


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

    drawFleck(ctx, color, xCenter, yCenter, ratio) {

        const radiusMax = (this.getRandom() * 2 + 3) * ratio;
        const radiusMin = radiusMax * this.getRandom() * 0.2 + 0.3;

        const angleOffset = this.getRandom() * Math.PI * 2;

        const pointCount = 2;
        const subPointCount = 25;

        // create the points
        const mainPoints = [];
        for (let i = 0; i < pointCount; i++) {
            const radius = radiusMin + (radiusMax - radiusMin) * this.getRandom();

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

}


async function generateForPath(path) {
    const frameGenerator = new FrameGenerator();

    await frameGenerator.execute({timing: 'drum02', path});
    await frameGenerator.execute({timing: 'drum03', path});
    await frameGenerator.execute({timing: 'drum11', path});

    //await this.executeTimer({durationMinutes: 11, path});
    //await this.executeTimer({durationMinutes: 3, path});
    //await this.executeTimer({durationMinutes: 2, path});
}

async function generatePreviews() {
    const paths = Object.keys(words);
    for (const path of paths) {
        const frameGenerator = new FrameGenerator();
        for (let i = 0; i <= 12; i++) {
            await frameGenerator.execute({timing: 'drum11', path, startTime: 1000 * 60 * i, outputIndex: i});
        }
    }
}

(async () => {
    if (module.parent !== null) return;

    const paths = ['beth']

    await generatePreviews();
    //await generateForPath('mem');

    // for (const path of paths) {
    //     await generateForPath(path);
    // }
})();