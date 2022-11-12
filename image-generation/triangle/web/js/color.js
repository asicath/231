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
    const hsv = rgb2hsv(rgb1);
    hsv.v *= 0.5;
    const rgb2 = hsvtorgb(hsv);
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
function rgb2hsv ({r,g,b}) {
    var computedH = 0;
    var computedS = 0;
    var computedV = 0;

    //remove spaces from input RGB values, convert to int
    var r = parseInt( (''+r).replace(/\s/g,''),10 );
    var g = parseInt( (''+g).replace(/\s/g,''),10 );
    var b = parseInt( (''+b).replace(/\s/g,''),10 );

    if ( r==null || g==null || b==null ||
        isNaN(r) || isNaN(g)|| isNaN(b) ) {
        alert ('Please enter numeric RGB values!');
        return;
    }
    if (r<0 || g<0 || b<0 || r>255 || g>255 || b>255) {
        alert ('RGB values must be in the range 0 to 255.');
        return;
    }
    r=r/255; g=g/255; b=b/255;
    var minRGB = Math.min(r,Math.min(g,b));
    var maxRGB = Math.max(r,Math.max(g,b));

    // Black-gray-white
    if (minRGB==maxRGB) {
        computedV = minRGB;
        return [0,0,computedV];
    }

    // Colors other than black-gray-white:
    var d = (r==minRGB) ? g-b : ((b==minRGB) ? r-g : b-r);
    var h = (r==minRGB) ? 3 : ((b==minRGB) ? 1 : 5);
    computedH = 60*(h - d/(maxRGB - minRGB));
    computedS = (maxRGB - minRGB)/maxRGB;
    computedV = maxRGB;
    return {h:computedH,s:computedS,v:computedV};
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
function hsvtorgb({h,s,v})
{
    let f = (n,k=(n+h/60)%6) => Math.floor((v - v*s*Math.max( Math.min(k,4-k,1), 0))*255);
    return {r:f(5),g:f(3),b:f(1)};
}

module.exports = {
    mixHexColors,
    halfBrightness
}