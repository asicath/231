const { createCanvas, loadImage } = require('canvas');
const fs = require("fs");
const EasingFunctions = require('./easing');
const ImageHelper = require('./image-helper');

const times = require('./times');
const words = require('./words');
const Program = require('./Program');

class ChantFrameGenerator {

    constructor(path, timing) {

        this.path = path;
        this.timing = timing;

        this.minImageCache = {};
        this.randomCache = [];
        this.randomIndex = 0;
        this.backgroundCanvas = null;
        this.sigilImage = null;

        this.width = 1920;
        this.height = 1080;
        this.center = {
            x: this.width / 2,
            y: this.height / 2
        };

        this.word = words[this.path];

        this.program = new Program(this.word, times[this.timing]);

        this.filepathParent = `./output/${this.path}`;
        this.filepath = `./output/${this.path}/${this.timing}`;

        this.backgroundColor = {
            colorInitial: this.word.back,
            color: this.word.backEnd,
            rayed: this.word.backEndRayed,
            flecked: this.word.backFlecked
        };
    }

    generateBackground() {
        console.log('generating background');
        const bg = createCanvas(this.width, this.height);
        this.drawBackground({canvas: bg, backgroundColor: this.backgroundColor});
        this.backgroundCanvas = bg;
    }

    async loadSigilImage() {
        this.sigilImage = await loadImage(`./img/${this.word.imgSrc}`);
    }

    async initialize() {

        // create background image
        if (this.backgroundCanvas === null) {
            this.generateBackground();
        }

        // load the sigil image
        if (this.sigilImage === null) {
            await this.loadSigilImage();
        }

        // make sure the directories exist
        if (!fs.existsSync(this.filepathParent)) {
            fs.mkdirSync(this.filepathParent);
        }
        if (!fs.existsSync(this.filepath)) {
            fs.mkdirSync(this.filepath);
        }

    }

    async execute({startTime = null, outputIndex = null, skipFrames = 0}) {

        await this.initialize();

        const canvas = createCanvas(this.width, this.height);
        const ctx = canvas.getContext('2d');

        let time = 0;

        // start behind by one measure
        time = -this.program.measures[0].duration;

        let frameIndex = outputIndex || 0;
        const frameTime = 1000 / 60;
        while (time < this.program.config.totalTime * 1.05) {

            // advance time to the specified time (inside the loop to bypass the check)
            if (startTime !== null) time = startTime;

            const frameInfo = this.calculateFrameInfo(frameIndex, time);

            if (skipFrames > 0) {
                skipFrames--;
            }

            // actually generate the frame
            else {

                // draw the background
                ctx.drawImage(this.backgroundCanvas, 0, 0);
                this.fadeFill({ctx, backgroundColor: this.backgroundColor, time})

                // draw the foreground
                this.drawNameCircle(ctx, frameInfo);

                // export to file
                await this.exportImage(canvas, this.filepath, frameInfo.frameKey);
            }

            // advance the time and index
            time += frameTime;
            frameIndex++;

            // startTime is for debugging, only one frame required
            if (startTime !== null) break;
        }

    }

    async exportImage(canvas, filepath, frameNumber) {
        const filename = `${filepath}/${frameNumber}.jpg`;
        await ImageHelper.exportCanvasToJpg({canvas, filename});
        console.log(`${filename} was created.`);
    }


    calculateFrameInfo(frameIndex, time) {
        let frameKey = frameIndex.toString();
        while (frameKey.length < 9) {frameKey = "0" + frameKey;}

        // determine the measure and remainingCount
        let measure, remainingCount;

        // find maxTime
        const lastMeasure = this.program.measures[this.program.measures.length - 1];
        const maxTime = lastMeasure.start + lastMeasure.duration;

        // if the time is before the start
        if (time < 0) {
            measure = this.program.measures[0];
            remainingCount = this.program.measures.length;
        }
        // if the time is after the end
        else if (time > maxTime) {
            measure = lastMeasure;
            remainingCount = 0;
        }
        else {
            // find the current measure based on the specified time
            measure = this.program.measures.find(measure => {
                return measure.start <= time && measure.start + measure.duration > time;
            });

            remainingCount = this.program.measures.length - this.program.measures.indexOf(measure);
        }

        // determine how far through the current measure we are
        const measurePercent = (time - measure.start) / measure.duration;

        return {
            time: Math.floor(time),
            frameIndex,
            frameKey,
            remainingCount,
            measure,
            measurePercent
        };
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

    fadeFill({ctx, backgroundColor, time}) {

        let percent = 1 - Math.max(0, Math.min(1, time / this.program.config.totalTime));

        percent = this.program.config.easingFunction(percent);

        let hex = Math.floor(255 * percent).toString(16);
        if (hex.length === 1) hex = "0" + hex;
        ctx.fillStyle = backgroundColor.colorInitial + hex;
        ctx.fillRect(0, 0, this.width, this.height);
    }

    drawNameCircle(ctx, frameInfo) {

        // calc sigilInfo
        const sigilInfo = this.getSigilInfo();

        this.fillCircle({ctx, sigilInfo});

        // draw the image
        this.drawSigil({ctx, sigilInfo});

        // draw the pointer
        this.drawMovingPointer({ctx, sigilInfo, frameInfo});

        // draw the circles
        this.drawCircles({ctx, sigilInfo});

        // draw the letters
        this.drawWordParts({ctx, sigilInfo, parts: this.program.config.parts});

        // draw the info around the circle
        this.drawHelperInfo({ctx, sigilInfo, frameInfo});
    }

    getSigilInfo() {

        const sigilInfo = {
            max: this.height / 2,
            text: this.program.config.text,
            fore: this.program.config.fore,
            back: this.program.config.back, // the back of circle

            sigilRatio: 0.75
        };

        // find the top and bottom of text draw area
        sigilInfo.textTop = sigilInfo.max * 0.915; // should be aligned with the UV template lip
        sigilInfo.textBottom = sigilInfo.max * 0.7; // allow for the text plus margins
        let innerCircleWidth = 6;
        sigilInfo.innerCircle = sigilInfo.textBottom - innerCircleWidth;

        return sigilInfo;
    }

    drawSigil({sigilInfo, ctx}) {
        ctx.save();
        ctx.translate(this.center.x, this.center.y);

        // max size should be innerCircle / 2
        //let imgRadius = this.sigilImage.height / 2;
        let imgRadius = Math.sqrt(Math.pow(this.sigilImage.width, 2) + Math.pow(this.sigilImage.height, 2)) / 2;

        let imgScale = (sigilInfo.textBottom) / imgRadius;
        imgScale *= sigilInfo.sigilRatio;
        let scaledWidth = this.sigilImage.width*imgScale;
        let scaledHeight = this.sigilImage.height*imgScale;

        ctx.drawImage(this.sigilImage,
            0,0,this.sigilImage.width,this.sigilImage.height,
            -scaledWidth / 2, -scaledHeight / 2, scaledWidth, scaledHeight);
        ctx.restore();
    }

    drawMovingPointer({sigilInfo, ctx, frameInfo}) {
        ctx.save();
        ctx.translate(this.center.x, this.center.y);

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

    drawWordParts({sigilInfo, ctx, parts}) {

        // draw the parts
        let anglePerCount = (Math.PI * 2) / this.program.beatsPerMeasure;
        let angle = 0;

        // find the draw position of all letters
        for (let i = 0; i < this.program.config.parts.length; i++) {

            ctx.save();
            ctx.translate(this.center.x, this.center.y);

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

    fillCircle({sigilInfo, ctx}) {
        ctx.save();
        ctx.translate(this.center.x, this.center.y);

        // outer circle lines
        ctx.beginPath();
        ctx.arc(0, 0, sigilInfo.textTop + 8, 0, 2 * Math.PI, false);
        ctx.lineWidth = 4;

        ctx.fillStyle = sigilInfo.back;
        ctx.fill();

        ctx.restore();
    }

    drawCircles({sigilInfo, ctx}) {
        ctx.save();
        ctx.translate(this.center.x, this.center.y);

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

    drawHelperInfo({sigilInfo, ctx, frameInfo}) {
        ctx.save();
        ctx.translate(this.center.x, this.center.y);

        ctx.fillStyle = sigilInfo.text;
        ctx.strokeStyle = sigilInfo.text;

        (() => {
            this.drawTimeLine(ctx, -1 * (sigilInfo.textTop-10), sigilInfo.textTop - 160, 100, 100, frameInfo.time);

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
            let measuresRemaining = (this.program.measures.length - frameInfo.measure.index).toString();
            measuresRemaining = frameInfo.remainingCount;
            ctx.textAlign = 'left';
            ctx.fillText(measuresRemaining, -sigilInfo.textTop, -sigilInfo.textTop + fontSize * 1.8);

            // lower right - time remaining
            let timeRemaining = this.program.config.totalTime - Math.max(frameInfo.time, 0);
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

    drawTimeLine(ctx, x, y, width, height, time) {

        //generate x/y points

        //EasingFunctions
        let points = [];
        let pointCount = 50;
        for (let i = 0; i < pointCount; i++) {
            let x = i / pointCount;
            let y = this.program.config.easingFunction(x);
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
        const programPercent = time / this.program.config.totalTime;
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

        ctx.save();
        ctx.translate(this.center.x, this.center.y);
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

        let ratio = canvas.height / 1200;

        let idealDistance = 15 * ratio;
        let radiusIncrPerRevolution = 12 * ratio;

        //let idealDistance = 60 * ratio;
        //let radiusIncrPerRevolution = 48 * ratio;

        let maxTimes = 1000000;

        while (radius < maxRadius && maxTimes > 0) {
            // find point
            let x = Math.cos(angle) * radius + this.center.x;
            let y = Math.sin(angle) * radius + this.center.y;

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


async function generatePreviews() {
    const paths = Object.keys(words)
        .filter(o => {
            return o === 'tav'
        });
    for (const path of paths) {
        const frameGenerator = new ChantFrameGenerator(path, 'drum11');
        for (let i = 0; i <= 12; i++) {
            await frameGenerator.execute({startTime: 1000 * 60 * i, outputIndex: i});
        }
    }
}

(async () => {
    if (module.parent !== null) return;

    await generatePreviews();
    return;
    
    const path = process.argv[2];
    const timing = process.argv[3];

    const frameGenerator = new ChantFrameGenerator(path, timing);
    await frameGenerator.execute({});

    // const paths = ['beth']
    // for (const path of paths) {
    //     await generateForPath(path);
    // }
})();