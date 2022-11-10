
function toCymk(color) {
    // start with inverse of RGB
    let c = 255 - color.r;
    let m = 255 - color.g;
    let y = 255 - color.b;

    // extract black level
    const k = Math.min(c, m, y);
    const w = (255 - k);

    // complete black is a special case to prevent divide by zero
    if (k === 255) return {c: 0, m: 0, y: 0, k: 1, a: color.a};

    c = (c - k) / w;
    m = (m - k) / w;
    y = (y - k) / w;

    return {c, m, y, k: k / 255, a: color.a};
}

function toRgba(color) {
    // calculate rgb percents
    const w = 1.0 - color.k;
    const r = 1 - (color.c * w + color.k);
    const g = 1 - (color.m * w + color.k);
    const b = 1 - (color.y * w + color.k);

    // convert back to 255 scale
    return {
        r: Math.round(r * 255 + 0.49),
        g: Math.round(g * 255 + 0.49),
        b: Math.round(b * 255 + 0.49),
        a: color.a
    };
}

function mixPart(part1, part2, percent = 0.5) {
    return part1 * (1 - percent) + part2 * percent;
}

function mixColors(color1, color2, percent = 0.5) {

    const cmyk1 = toCymk(color1);
    const cmyk2 = toCymk(color2);

    const mixed = {
        c: mixPart(cmyk1.c, cmyk2.c, percent),
        m: mixPart(cmyk1.m, cmyk2.m, percent),
        y: mixPart(cmyk1.y, cmyk2.y, percent),
        k: mixPart(cmyk1.k, cmyk2.k, percent),
        a: mixPart(cmyk1.a, cmyk2.a, percent)
    };

    return toRgba(mixed);
}

function parseColorHex(color) {
    return {
        r: parseInt(color[0] + color[1], 16),
        g: parseInt(color[2] + color[3], 16),
        b: parseInt(color[4] + color[5], 16),
        a: 1
    };
}

function rgbToHex(c) {
    return `${leadingZero(c.r.toString(16))}${leadingZero(c.g.toString(16))}${leadingZero(c.b.toString(16))}`;
}

function leadingZero(s) {
    return s.length === 1 ? `0${s}` : s;
}

function mixHexColors(color0, color1, percent = 0.5) {
    const c0 = parseColorHex(color0);
    const c1 = parseColorHex(color1);
    const c = mixColors(c0, c1, percent);
    return rgbToHex(c);
}

function mergeRGB(color1, color2, percent = 0.5)
{
    const c1 = parseColorHex(color1);
    const c2 = parseColorHex(color2);

    const r = mergeSingle(c1.r, c2.r, percent);
    const g = mergeSingle(c1.g, c2.g, percent);
    const b = mergeSingle(c1.b, c2.b, percent);
    const c = {r,g,b};

    return rgbToHex(c);
}

function mergeSingle(a, b, percent)
{
    // try the direct route
    let d = b - a;
    const value = Math.round(a + d * percent);
    return value;
}

function halfBrightness(color) {
    const rgb1 = parseColorHex(color);
    const hsl = rgbToHsv(rgb1.r, rgb1.g, rgb1.b);
    const value = hsvToRgb(hsl[0], hsl[1], hsl[2]);
    const rgb2 = {r: value[0], g: value[1], b: value[2]};

    return rgbToHex(rgb2);
}


/**
 * Converts an RGB color value to HSV. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSV_color_space.
 * Assumes r, g, and b are contained in the set [0, 255] and
 * returns h, s, and v in the set [0, 1].
 *
 * @param   Number  r       The red color value
 * @param   Number  g       The green color value
 * @param   Number  b       The blue color value
 * @return  Array           The HSV representation
 */
function rgbToHsv(r, g, b) {
    r /= 255, g /= 255, b /= 255;

    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, v = max;

    var d = max - min;
    s = max == 0 ? 0 : d / max;

    if (max == min) {
        h = 0; // achromatic
    } else {
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }

        h /= 6;
    }

    return [ h, s, v ];
}

/**
 * Converts an HSV color value to RGB. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSV_color_space.
 * Assumes h, s, and v are contained in the set [0, 1] and
 * returns r, g, and b in the set [0, 255].
 *
 * @param   Number  h       The hue
 * @param   Number  s       The saturation
 * @param   Number  v       The value
 * @return  Array           The RGB representation
 */
function hsvToRgb(h, s, v) {
    var r, g, b;

    var i = Math.floor(h * 6);
    var f = h * 6 - i;
    var p = v * (1 - s);
    var q = v * (1 - f * s);
    var t = v * (1 - (1 - f) * s);

    switch (i % 6) {
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
    }

    return [ r * 255, g * 255, b * 255 ];
}


module.exports = {mixHexColors, mergeRGB, halfBrightness};

if (module.parent === null) {

    const n0 = mergeSingle(255, 0, 0.5);


    const c1 = mergeRGB('000000', '000000');
    const c2 = mergeRGB('000000', 'FFFFFF');
    const c3 = mergeRGB('111111', 'EEEEEE');
    const c4 = mergeRGB('ff8000', '0080ff');

    console.log("black " + mergeRGB('8c16c4', '000000'));
    console.log("white " + mergeRGB('8c16c4', 'ffffff'));
    console.log("grey " + mergeRGB('8c16c4', '808080'));

    console.log("grey33 " + mergeRGB('8c16c4', 'a8a8a8'));
    console.log("grey66 " + mergeRGB('8c16c4', '545454'));


    console.log(c1);
    console.log(c2);
    console.log(c3);
    console.log(c4);
}