const EasingFunctions = require('./easing');

function drawFleck(ctx, color, xCenter, yCenter, ratio) {

    const radiusMax = (Math.random() * 2 + 3) * ratio;
    const radiusMin = radiusMax * Math.random() * 0.2 + 0.3;

    const angleOffset = Math.random() * Math.PI * 2;

    const pointCount = 2;
    const subPointCount = 25;

    // create the points
    const mainPoints = [];
    for (let i = 0; i < pointCount; i++) {
        const radius = radiusMin + (radiusMax - radiusMin) * Math.random();

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
    ctx.fillStyle = `#${color}`;
    ctx.fill();
}

function drawFleckCircle(ctx, color, xCenter, yCenter, ratio) {
    const radius = 2 * ratio;
    ctx.beginPath();
    ctx.arc(xCenter, yCenter, radius, 0, Math.PI*2);
    ctx.fillStyle = `#${color}`;
    ctx.fill();
}

function drawFleckPoly(ctx, color, xCenter, yCenter, ratio) {

    let sides = Math.floor(Math.random() * 3) + 3;
    //let sides = 4;
    let angleIncr = Math.PI * 2 / sides;

    let range = 16 * ratio;
    let xOffset = Math.random() * range - range/2;
    let yOffset = Math.random() * range - range/2;

    let sizeRange = 6 * ratio;
    let minSize = 2 * ratio;

    for (let n = 0; n < 3; n++) {
        let angleOffset = Math.random() * Math.PI * 2;
        ctx.beginPath();

        for (let i = 0; i < sides; i++) {
            let size = Math.random() * sizeRange + minSize;
            let angle = (angleIncr * i + angleOffset) % (Math.PI * 2);
            let x = Math.cos(angle) * (size/2) + xCenter + xOffset;
            let y = Math.sin(angle) * (size/2) + yCenter + yOffset;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fillStyle = alphaColor(color, 0.5); // "#" + color;
        ctx.fill();
    }

}

function fleckIt(canvas, color) {
    const ctx = canvas.getContext('2d');
    let colorArray = Array.isArray(color.flecked) ? color.flecked : [color.flecked];
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
        x += (maxRadius / (randomSwing * 2)) - Math.random() * maxRadius / randomSwing;
        y += (maxRadius / (randomSwing * 2)) - Math.random() * maxRadius / randomSwing;

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

module.exports = fleckIt;
