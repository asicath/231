
const repeatCount = 12;

function getRiverPath(width, height) {

    const patternHeight = width / 2;
    const sectionWidth = width / 8;

    const path = new Path2D();
    ctx.moveTo(0, 0);

    let y = 0;
    while (y * patternHeight < height) {
        ctx.lineTo(sectionWidth, y * patternHeight + patternHeight / 2);
        ctx.lineTo(0, y * patternHeight + patternHeight);
        y += 1;
    }

    return path;
}

function fillRiverBands({ctx, xStart, yStart, width, height, margin}) {
    const patternHeight = height / repeatCount;
    const sectionWidth = width / 8;


    ctx.save();
    ctx.translate(xStart, yStart);

    // edge
    function fillEdge({x, colors}) {

        for (let h = 0; h < repeatCount; h++) {
            const x0 = (x+0) * sectionWidth;
            const x1 = (x+1) * sectionWidth;

            const y0 = h * patternHeight;
            const y1 = y0 + patternHeight / 2;
            const y2 = y0 + patternHeight;

            // 1 triangle
            ctx.beginPath();
            ctx.moveTo(x0, y0);
            ctx.lineTo(x1, y1);
            ctx.lineTo(x0, y1);
            ctx.closePath();
            ctx.fillStyle = colors[0];
            ctx.fill();

            // 1 square
            //ctx.fillStyle = colors[0];
            //ctx.fillRect(x0-margin, y0, margin, patternHeight / 2);

            // 2
            ctx.beginPath();
            ctx.moveTo(x0, y1);
            ctx.lineTo(x1, y1);
            ctx.lineTo(x0, y2);
            ctx.closePath();
            ctx.fillStyle = colors[1];
            ctx.fill();

            // 2 square
            //ctx.fillStyle = colors[1];
            //ctx.fillRect(x0-margin, y1, margin, patternHeight / 2);

        }
    }

    // band
    function fillRiverSingleBand({x, color, reverse = false}) {
        let y = 0;
        ctx.beginPath();

        let a = reverse ? 0 : 1;
        let b = reverse ? 1 : 0;

        ctx.moveTo((x+b) * sectionWidth, 0);

        // down right
        while (y*patternHeight < height) {
            ctx.lineTo((x+a) * sectionWidth, y * patternHeight + patternHeight / 2);
            ctx.lineTo((x+b) * sectionWidth, y * patternHeight + patternHeight);
            y += 1;
        }

        x -= 1;

        // return to the original line, but moved over a bit
        ctx.lineTo((x+b) * sectionWidth, (y-1) * patternHeight + patternHeight);

        // up left
        while (y > 0) {
            ctx.lineTo((x+a) * sectionWidth, y * patternHeight - patternHeight / 2);
            ctx.lineTo((x+b) * sectionWidth, y * patternHeight - patternHeight);
            y -= 1;
        }
        ctx.closePath();
        ctx.fillStyle = color;
        ctx.fill();
    }

    function fillMiddle({colors}) {
        let y = 0;

        let xCenter = width/2;
        let x0 = xCenter - sectionWidth;
        let x1 = xCenter + sectionWidth;

        while (y * patternHeight <= height) {

            let yCenter = y * patternHeight;
            let y0 = yCenter - patternHeight/2;
            let y1 = yCenter + patternHeight/2;

            // 1
            ctx.beginPath();
            ctx.moveTo(xCenter, yCenter);
            ctx.lineTo(xCenter, y0);
            ctx.lineTo(x0, yCenter);
            ctx.closePath();
            ctx.fillStyle = colors[0];
            ctx.fill();

            // 1
            ctx.beginPath();
            ctx.moveTo(xCenter, yCenter);
            ctx.lineTo(xCenter, y0);
            ctx.lineTo(x1, yCenter);
            ctx.closePath();
            ctx.fillStyle = colors[1];
            ctx.fill();

            // 1
            ctx.beginPath();
            ctx.moveTo(xCenter, yCenter);
            ctx.lineTo(xCenter, y1);
            ctx.lineTo(x0, yCenter);
            ctx.closePath();
            ctx.fillStyle = colors[2];
            ctx.fill();

            // 1
            ctx.beginPath();
            ctx.moveTo(xCenter, yCenter);
            ctx.lineTo(xCenter, y1);
            ctx.lineTo(x1, yCenter);
            ctx.closePath();
            ctx.fillStyle = colors[3];
            ctx.fill();

            y += 1;
        }

    }

    fillEdge({x:0, colors:['#000000', '#ffffff']});

    // fill the middle
    fillMiddle({colors: ['#731817', '#dedb2c', '#000000', '#708d01']});

    fillRiverSingleBand({x:1, color: '#F2301B'});
    fillRiverSingleBand({x:2, color: '#FEDD00'});
    fillRiverSingleBand({x:3, color: '#0085ca'});

    fillRiverSingleBand({x:5, color: '#00A550', reverse: true});
    fillRiverSingleBand({x:6, color: '#5c00cc', reverse: true});
    fillRiverSingleBand({x:7, color: '#FF6D00', reverse: true});

    ctx.restore();
}

function traceRiverBands({ctx, xStart, yStart, width, height}) {
    const patternHeight = height / repeatCount;
    const sectionWidth = width / 8;


    ctx.save();
    ctx.translate(xStart, yStart);

    // band
    function fillRiverSingleBand({x, color, reverse = false, drawEnd = false}) {
        let y = 0;

        let a = reverse ? 0 : 1;
        let b = reverse ? 1 : 0;

        ctx.moveTo((x+b) * sectionWidth, 0);

        // down right
        while (y*patternHeight < height) {
            ctx.lineTo((x+a) * sectionWidth, y * patternHeight + patternHeight / 2);
            ctx.lineTo((x+b) * sectionWidth, y * patternHeight + patternHeight);
            y += 1;
        }

        x -= 1;

        // return to the original line, but moved over a bit
        ctx.lineTo((x+b) * sectionWidth, (y-1) * patternHeight + patternHeight);

        if (drawEnd) {
            // up left
            while (y > 0) {
                ctx.lineTo((x+a) * sectionWidth, y * patternHeight - patternHeight / 2);
                ctx.lineTo((x+b) * sectionWidth, y * patternHeight - patternHeight);
                y -= 1;
            }
        }

    }

    function fillMiddle({colors}) {
        let y = 0;

        let xCenter = width/2;
        let x0 = xCenter - sectionWidth;
        let x1 = xCenter + sectionWidth;

        while (y * patternHeight <= height) {

            let yCenter = y * patternHeight;
            let y0 = yCenter - patternHeight/2;
            let y1 = yCenter + patternHeight/2;

            ctx.moveTo(xCenter, y0);
            ctx.lineTo(xCenter, y1);

            ctx.moveTo(x0, yCenter);
            ctx.lineTo(x1, yCenter);

            y += 1;
        }

    }

    //fillEdge({x:0, color:'#000000'});

    // fill the middle
    fillMiddle({});

    fillRiverSingleBand({x:1, drawEnd: true});
    fillRiverSingleBand({x:2});
    fillRiverSingleBand({x:3});

    fillRiverSingleBand({x:5, reverse: true, drawEnd: true});
    fillRiverSingleBand({x:6, reverse: true});
    fillRiverSingleBand({x:7, reverse: true});

    ctx.restore();
}

module.exports = {
    fillRiverBands,
    traceRiverBands,
    getRiverPath
}