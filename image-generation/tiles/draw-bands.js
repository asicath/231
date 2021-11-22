function fillBandColor({canvas, bandWidth, bands}) {
    const ctx = canvas.getContext('2d');
    const segmentCount = 11;
    const bandHeight = canvas.height / segmentCount;

    bands.forEach(band => {
        // sephiroth band
        if (band.color === 's') {
            for (let i = 0; i < segmentCount; i++) {
                const y = i * bandHeight;
                ctx.fillStyle = spheres[i].color;
                ctx.fillRect(bandWidth*band.at, y, bandWidth, bandHeight+1);
            }
        }
        // otherwise, a single color band
        else {
            //ctx.fillStyle = band.color;
            //ctx.fillRect(bandWidth*band.at, 0, bandWidth, canvas.height);
        }
    });
}

function drawBandPaths({canvas, ctx, bandWidth, bands}) {

    const segmentCount = 11;
    const bandHeight = canvas.height / segmentCount;

    // generic band grouting
    function groutBand(band) {
        const x0 = bandWidth * band.at;
        const x1 = bandWidth * (band.at+1);

        ctx.moveTo(x0, 0);
        ctx.lineTo(x0, canvas.height);

        if (band.cap) {
            ctx.moveTo(x1, 0);
            ctx.lineTo(x1, canvas.height);
        }

        // horizontal lines
        for (let i = 0; i < segmentCount+1; i++) {
            const y = i * bandHeight;
            ctx.moveTo(x0, y);
            ctx.lineTo(x1, y);
        }
    }

    bands.forEach(groutBand);
}

module.exports = {drawBandPaths, fillBandColor};