const {all: sephirothColors} = require('./colors');

function fillFeatherColor({ctx, xStart, yStart, width, height, colors}) {
    const hCount = colors.length;
    const vCount = 24;

    const featherWidth = width / hCount;
    const tipWidth = featherWidth * 0.5;
    const featherHeight = height / vCount;

    let malkuthIndex = 0;
    const malkuthColors = ['#731817', '#dedb2c', '#000000', '#708d01'];

    for (let h = hCount-1; h >= 0; h--) {
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

            ctx.beginPath();
            ctx.moveTo(-overflow, y);

            // the first
            if (isShifted && v === 0) {
                ctx.lineTo(featherWidth, y);
                ctx.lineTo(featherWidth - tipWidth, y + featherHeight / 2);
                ctx.lineTo(-overflow, y + featherHeight / 2);
            }
            // the last
            else if (isShifted && v === vCount) {
                ctx.lineTo(featherWidth - tipWidth, y);
                ctx.lineTo(featherWidth, y + featherHeight / 2);
                ctx.lineTo(-overflow, y + featherHeight / 2);
            }
            else {
                ctx.lineTo(featherWidth - tipWidth, y);
                //ctx.lineTo(featherWidth, y + featherHeight / 2); // tip
                //ctx.lineTo(featherWidth - tipWidth, y + featherHeight);
                ctx.arcTo(featherWidth, y, featherWidth, y + featherHeight / 2, featherHeight*0.6)
                ctx.arcTo(featherWidth, y + featherHeight, featherWidth - tipWidth, y + featherHeight, featherHeight*0.6)
                ctx.lineTo(-overflow, y + featherHeight);
            }

            ctx.closePath();
            ctx.fillStyle = v % 2 === 0 ? colors[h].king : colors[h].queen;

            if (colors[h] === sephirothColors.s10) { //  && v % 2 === 0
                ctx.fillStyle = malkuthColors[malkuthIndex % 4];
                malkuthIndex++;
            }

            ctx.fill();
        }

        ctx.restore();
    }
}

function traceFeatherOutlines({ctx, xStart, yStart, width, height}) {
    const hCount = 11;
    const vCount = 24;

    const featherWidth = width / hCount;
    const tipWidth = featherWidth * 0.5;
    const featherHeight = height / vCount;

    for (let h = hCount-1; h >= 0; h--) {
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

            // the first
            if (isShifted && v === 0) {
                ctx.lineTo(featherWidth, y);
                ctx.lineTo(featherWidth - tipWidth, y + featherHeight / 2);
                ctx.lineTo(0, y + featherHeight / 2);
            }
            // the last
            else if (isShifted && v === vCount) {
                ctx.lineTo(featherWidth - tipWidth, y);
                ctx.lineTo(featherWidth, y + featherHeight / 2);
                ctx.lineTo(0, y + featherHeight / 2);
            } else {
                ctx.lineTo(featherWidth - tipWidth, y);
                //ctx.lineTo(featherWidth, y + featherHeight / 2);
                //ctx.lineTo(featherWidth - tipWidth, y + featherHeight);

                ctx.arcTo(featherWidth, y, featherWidth, y + featherHeight / 2, featherHeight*0.6)
                ctx.arcTo(featherWidth, y + featherHeight, featherWidth - tipWidth, y + featherHeight, featherHeight*0.6)

                ctx.lineTo(0, y + featherHeight);
            }

        }
        //ctx.closePath();
        //ctx.fillStyle = (h%2 === 0 ? '#ff0000' : '#00ff00');
        //ctx.fill();

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
            sephirothColors.s09,
            sephirothColors.s10
        ]
    });
}

function traceSephirothWings({ctx, xStart, yStart, width, height}) {

}

module.exports = {traceSephirothWings, fillSephirothWings, fillFeatherColor, traceFeatherOutlines};
