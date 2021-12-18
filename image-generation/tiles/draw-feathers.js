const {all: sephirothColors} = require('./colors');

const tipPercent = 0.8;

function drawSingleFeather({ctx, v, y, vCount, isShifted, featherWidth, featherHeight, tipWidth, overflow, style = 'tapered', isFill = true}) {

    const points = 6;

    // total x delta
    const xDelta = tipWidth;
    const xStart = featherWidth - tipWidth;

    // total y delta
    const yDelta = featherHeight / 2;
    let yStart = y;

    let drawTop = true, drawBottom = true;

    // the first
    if (isShifted && v === 0) {
        yStart -= yDelta;
        drawTop = false;
    }
    // the last
    else if (isShifted && v === vCount) {
        //drawBottom = false
        //ctx.lineTo(featherWidth - tipWidth, y);
        //ctx.lineTo(featherWidth, y + featherHeight / 2);
        //ctx.lineTo(-overflow, y + featherHeight / 2);
    }

    if (drawTop) {
        // move to the start of the tip
        ctx.lineTo(xStart, yStart);
    }
    else {
        // start at the tip
        if (isFill) {
            ctx.lineTo(xStart + xDelta, yStart + yDelta);
        }
        else {
            ctx.moveTo(xStart + xDelta, yStart + yDelta);
        }
    }


    if (style === 'diamond') {
        if (drawTop) ctx.lineTo(xStart + xDelta, yStart + yDelta); // tip
        ctx.lineTo(xStart, yStart + yDelta*2);
    }
    else if (style === 'round') {
        if (drawTop) ctx.arcTo(featherWidth, y, featherWidth, y + featherHeight / 2, featherHeight*0.6)
        ctx.arcTo(featherWidth, y + featherHeight, featherWidth - tipWidth, y + featherHeight, featherHeight*0.6)
    }
    else if (style === 'tapered') {
        if (drawTop) {
            // to the tip
            for (let i = 0; i < points; i++) {
                let percent = (i+1) / points;
                const xNext = xStart + percent * xDelta;
                percent = percent ** 2;
                const yNext = yStart + percent * yDelta;
                ctx.lineTo(xNext, yNext);
            }
        }

        // from the tip
        for (let i = points; i > 0; i--) {
            let percent = (i-1) / points;
            const xNext = xStart + percent * xDelta;
            percent = percent ** 2;
            const yNext = yStart + yDelta + (1-percent) * yDelta;
            ctx.lineTo(xNext, yNext);
        }
    }

    if (isFill) {
        ctx.lineTo(-overflow, yStart + yDelta*2);
    }
    else {
        ctx.moveTo(-overflow, yStart + yDelta*2);
    }

}

function fillFeatherColor({ctx, xStart, yStart, width, height, colors}) {
    const hCount = 11;
    const vCount = 24;

    const featherWidth = width / hCount;
    const tipWidth = featherWidth * tipPercent;
    const featherHeight = height / vCount;

    // draw malkuth
    let malkuthIndex = 0;
    const malkuthColors = ['#731817', '#dedb2c', '#000000', '#708d01'];

    const xMalkuth = featherWidth * (hCount-1);
    ctx.save();
    ctx.translate(xStart + xMalkuth, yStart);
    for (let v = 0; v < vCount; v++) {

        // the bounding points of the square wee need to fill
        let x0 = 0 - tipWidth - 1;
        const x1 = featherWidth;
        const y0 = v * featherHeight;
        const y1 = (v+1) * featherHeight;

        const fillKing = v % 2 === 0;

        if (fillKing) {
            ctx.fillStyle = sephirothColors.s10.queen;
            ctx.fillRect(x0, y0, x1 - x0, y1 - y0);
        }
        else {
            // fill the whole with citrine
            ctx.fillStyle = malkuthColors[1];
            ctx.fillRect(x0, y0, x1 - x0, y1 - y0);

            // lets shift the center a bit
            x0 += tipWidth * 1;

            const xCenter = (x0 + x1) / 2;
            const yCenter = (y0 + y1) / 2;

            [
                //{p0: {x: x0, y: y0}, p1: {x: x0, y: y1}, colorIndex: 1}, // top
                {p0: {x: x0, y: y1}, p1: {x: x1, y: y1}, colorIndex: 0}, // left
                {p0: {x: x0, y: y0}, p1: {x: x1, y: y0}, colorIndex: 3}, // right
                {p0: {x: x1, y: y0}, p1: {x: x1, y: y1}, colorIndex: 2}  // bottom
            ].forEach(o => {
                ctx.beginPath();
                ctx.moveTo(xCenter, yCenter);
                ctx.lineTo(o.p0.x, o.p0.y);
                ctx.lineTo(o.p1.x, o.p1.y);
                ctx.closePath();
                ctx.fillStyle = malkuthColors[o.colorIndex];
                ctx.fill();
            });
        }
    }
    ctx.restore();

    // now, all the others
    for (let h = hCount-2; h >= 0; h--) {
        const isShifted = h % 2 === 1;
        const x = featherWidth * h;
        ctx.save();
        ctx.translate(xStart + x, yStart);

        const overflow = h === 0 ? 0 : tipWidth;

        for (let v = 0; v < (isShifted ? vCount+1 : vCount); v++) {
            let y = v * featherHeight;

            // shift the odds
            if (isShifted && v > 0) {
                y -= featherHeight / 2;
            }

            // draw and fill each feather, one at a time
            ctx.beginPath();
            ctx.moveTo(-overflow, y);
            drawSingleFeather({ctx, y, v, vCount, isShifted, featherWidth, featherHeight, tipWidth, overflow});
            ctx.closePath();

            // find the fill style
            ctx.fillStyle = v % 2 === 0 ? colors[h].king : colors[h].queen;
            if (colors[h] === sephirothColors.s10) { //  && v % 2 === 0
                ctx.fillStyle = malkuthColors[malkuthIndex % 4];
                malkuthIndex++;
            }

            // finalize
            ctx.fill();
        }

        ctx.restore();
    }
}

function traceFeatherOutlines({ctx, xStart, yStart, width, height}) {
    const hCount = 11;
    const vCount = 24;

    const featherWidth = width / hCount;
    const tipWidth = featherWidth * tipPercent;
    const featherHeight = height / vCount;

    // malkuth
    const xMalkuth = featherWidth * (hCount-1);
    ctx.save();
    ctx.translate(xStart + xMalkuth, yStart);
    for (let v = 0; v < vCount; v++) {

        // the bounding points of the square wee need to fill
        let x0 = 0 - tipWidth - 1;
        const x1 = featherWidth;
        const y0 = v * featherHeight;
        const y1 = (v+1) * featherHeight;

        const fillKing = v % 2 === 0;

        x0 += tipWidth * 1;

        ctx.moveTo(x0, y0);
        ctx.lineTo(x1, y0);

        if (!fillKing) {
            // lets shift the center a bit

            ctx.moveTo(x0, y0);
            ctx.lineTo(x1, y1);

            ctx.moveTo(x0, y1);
            ctx.lineTo(x1, y0);
        }
    }
    ctx.restore();

    // now the rest
    for (let h = hCount-2; h >= 0; h--) {
        const isShifted = h % 2 === 1;
        const x = featherWidth * h;
        ctx.save();
        ctx.translate(xStart + x, yStart);

        //ctx.beginPath();
        ctx.moveTo(0, 0);
        for (let v = 0; v < (isShifted ? vCount + 1 : vCount); v++) {
            let y = v * featherHeight;

            // shift the odds
            if (isShifted && v > 0) {
                y -= featherHeight / 2;
            }

            drawSingleFeather({ctx, y, v, vCount, isShifted, featherWidth, featherHeight, tipWidth, overflow: 0, isFill: false});

        }

        ctx.restore();
    }
}

function fillSephirothWings({ctx, xStart, yStart, width, height}) {
    fillFeatherColor({
        ctx,
        xStart,
        yStart,
        width,
        height,
        colors: [
            sephirothColors.s01,
            sephirothColors.s02,
            sephirothColors.s03,
            sephirothColors.sDD,
            sephirothColors.s04,
            sephirothColors.s05,
            sephirothColors.s06,
            sephirothColors.s07,
            sephirothColors.s08,
            sephirothColors.s09
        ],
        lastRow: sephirothColors.s10
    });
}

function traceSephirothWings({ctx, xStart, yStart, width, height}) {

}

module.exports = {traceSephirothWings, fillSephirothWings, fillFeatherColor, traceFeatherOutlines};
