

function rayIt(canvas, color) {
    let ctx = canvas.getContext('2d');
    let center = {x:canvas.width/2, y: canvas.height/2};
    let rayCount = 18;
    let arcLength = ((Math.PI * 2) / rayCount) * (1/3);
    let radius = Math.max(canvas.width, canvas.height);
    ctx.beginPath();
    ctx.moveTo(center.x, center.y);
    for (let j = 0; j < rayCount; j++) {
        let a0 = ((Math.PI * 2) / rayCount) * j - arcLength / 2;
        let a1 = a0 + arcLength;

        let x0 = Math.cos(a0) * radius + center.x;
        let y0 = Math.sin(a0) * radius + center.y;
        let x1 = Math.cos(a1) * radius + center.x;
        let y1 = Math.sin(a1) * radius + center.y;

        ctx.lineTo(x0, y0);
        ctx.lineTo(x1, y1);
        ctx.lineTo(center.x, center.y);
    }
    ctx.closePath();

    ctx.fillStyle = "#" + color.rayed;
    ctx.fill();
}

module.exports = rayIt;
