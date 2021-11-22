function drawDiamondPath({ctx, verticalCount, horizontalCount, xStart, yStart, width, height, margin}) {
    // now the main section
    //const gridPointsHorizontal = horizontalCount * 2 + 1
    //const gridPointsVertical = verticalCount * 2 + 1;
    const diamondWidth = (width - margin * 2) / horizontalCount;
    const diamondHeight = height / verticalCount;
    for (let y = 0; y < verticalCount; y++) {
        ctx.save();
        ctx.translate(xStart + margin, yStart + y * diamondHeight);

        ctx.moveTo(0, 0);

        let isUp = true;

        // slashing right
        for (let x = 0; x < horizontalCount; x++) {
            if (isUp) {
                // right down slash
                ctx.lineTo((x+1) * diamondWidth, diamondHeight);
            }
            else {
                // right up slash
                ctx.lineTo((x+1) * diamondWidth, 0);
            }
            // toggle
            isUp = !isUp;
        }

        // the end cap
        if (isUp) {
            // right down slash
            ctx.lineTo(horizontalCount * diamondWidth, diamondHeight);
        }
        else {
            // right up slash
            ctx.lineTo(horizontalCount * diamondWidth, 0);
        }
        // toggle
        isUp = !isUp;

        // slash left
        for (let x = horizontalCount-1; x >= 0; x--) {
            if (isUp) {
                // right down slash
                ctx.lineTo(x * diamondWidth, diamondHeight);
            }
            else {
                // right up slash
                ctx.lineTo(x * diamondWidth, 0);
            }
            // toggle
            isUp = !isUp;
        }

        // the end cap is always up
        ctx.lineTo(0, 0);

        ctx.restore();
    }
}

function fillDiamondGrid({ctx, verticalCount, horizontalCount, diamondColor, backgroundColor, xStart, yStart, width, height, margin}) {
    // fill the background first
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(xStart, yStart, width, height);

    // then the foreground
    ctx.beginPath();
    drawDiamondPath({ctx, verticalCount, horizontalCount, diamondColor, backgroundColor, xStart, yStart, width, height, margin});
    ctx.fillStyle = diamondColor;
    ctx.fill();
}

module.exports = {drawDiamondPath, fillDiamondGrid};