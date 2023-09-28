function drawGradient(canvas, color, roundCorners) {
    let ctx = canvas.getContext('2d');

    ctx.fillStyle = "#" + color.gradient[0];
    ctx.fillRect(0, 0, canvas.width, canvas.height / 2);

    ctx.fillStyle = "#" + color.gradient[1];
    ctx.fillRect(0, canvas.height / 2, canvas.width, canvas.height / 2);

    // now the middle
    let x = canvas.width / 2;
    let p = 0.05;
    //let gradient = ctx.createLinearGradient(x, canvas.height * p, x, canvas.height * (1-p-p));
    let gradient = ctx.createRadialGradient(canvas.width / 2, canvas.width / 2, 1, canvas.width / 2, canvas.width / 2, canvas.width);

    gradient.addColorStop(0, "#" + color.gradient[0]);
    gradient.addColorStop(1, "#" + color.gradient[1]);

    ctx.fillStyle = gradient;
    //ctx.fillRect(0, canvas.height * (p), canvas.width, canvas.height * (1-p-p));
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

module.exports = drawGradient;
