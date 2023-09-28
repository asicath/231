
// square circles
function drawCircles(canvas, color, layerSize) {
    let subLayerSize = (layerSize/2) / color.circles.length;
    let ctx = canvas.getContext('2d');
    for (let i = 0; i < color.circles.length; i++) {
        ctx.fillStyle = "#" + color.circles[i];
        ctx.fillRect(subLayerSize * i, subLayerSize * i, canvas.width - subLayerSize * i * 2, canvas.height - subLayerSize * i * 2);
    }

}

function drawCirclesOld(canvas, color, layerSize) {

    let center = {x:canvas.width/2, y: canvas.height/2};
    let maxRadius = Math.max(center.x, center.y);
    let radiusIncr = maxRadius / color.circles.length;

    let ctx = canvas.getContext('2d');
    for (let i = 0; i < color.circles.length; i++) {

        let radius = radiusIncr * (color.circles.length - i);

        ctx.beginPath();
        ctx.arc(center.x, center.y, radius, 0, 2 * Math.PI, false);
        ctx.fillStyle = "#" + color.circles[i];
        ctx.fill();
    }

}

module.exports = drawCircles;
