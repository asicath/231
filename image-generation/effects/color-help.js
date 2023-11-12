function alphaColor(color, alpha) {
    let r = parseInt(color.substr(0, 2), 16);
    let g = parseInt(color.substr(2, 2), 16);
    let b = parseInt(color.substr(4, 2), 16);
    return "rgba(" + r + ", " + g + ", " + b + ", " + alpha.toString() + ")";
}

module.exports = {
    alphaColor
};