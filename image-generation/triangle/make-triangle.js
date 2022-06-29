const { createCanvas, loadImage } = require('canvas');
const {paths, cards} = require('../data');
const {applyMask, getColorField} = require('../mask');
const {mixHexColors} = require('./color-mix');

async function exportCanvasToImage(canvas, name) {
    return new Promise((resolve, reject) => {
        const fs = require('fs');
        const filename = `${__dirname}/output/${name}.jpg`;

        //const stream = canvas.createPNGStream();

        const stream = canvas.createJPEGStream({
            quality: 1,
            chromaSubsampling: false, progressive: false
        });
        const out = fs.createWriteStream(filename);
        stream.pipe(out);
        out.on('finish', () => {
            console.log(`${filename} was created.`);
            resolve();
        });

    });
}

const atus = {
    '001': {color: 'fee74d', id: '001', linked: [
            {id:'003', value:['2S','7S']},
            {id:'400', value:'3S'},
            {id:'020', value:['4S','8S']},
            {id:'004', value:'5S'},
            {id:'002', value:'6S'},
            {id:'080', value:'9S'},
            {id:'200', value:'10S'},

            // zodiac
            {id:'030', value:['2S', '3S', '4S']},
            {id:'090', value:['5S', '6S', '7S']},
            {id:'007', value:['8S', '9S', '10S']},

            {id:'040', value:['PC', 'QS']},
        ]},
    '002': {color: 'FEDD00', id: '002'},
    '003': {color: '0085ca', id: '003'},
    '004': {color: '00A550', id: '004'},
    '005': {color: 'ed2800', id: '005', linked: [{id:'080', value:'2W'}, {id:'200', value:'3W'}, {id:'004', value:'4W'}]},
    '006': {color: 'FF4E00', id: '006', linked: [{id:'002', value:'5D'}, {id:'003', value:'6D'}, {id:'400', value:'7D'}]},
    '007': {color: 'FF6D00', id: '007', linked: [{id:'020', value:'8S'}, {id:'080', value:'9S'}, {id:'200', value:'10S'}]},
    '008': {color: 'ffb734', id: '008', linked: [{id:'004', value:'2C'}, {id:'002', value:'3C'}, {id:'003', value:'4C'}]},
    '009': {color: 'E5D708', id: '009', linked: [{id:'400', value:'5W'}, {id:'020', value:'6W'}, {id:'080', value:'7W'}]},
    '010': {color: '59B934', id: '010', linked: [{id:'200', value:'8D'}, {id:'004', value:'9D'}, {id:'002', value:'10D'}]},
    '020': {color: '8C15C4', id: '020'},
    '030': {color: '00A550', id: '030', linked: [{id:'003', value:'2S'}, {id:'400', value:'3S'}, {id:'020', value:'4S'}]},
    '040': {color: '0246bc', id: '040', linked: [
            {id:'004', value:['2C','7C']},
            {id:'002', value:'3C'},
            {id:'003', value:'4C'},
            {id:'080', value:['5C', '10C']},
            {id:'200', value:'6C'},
            {id:'400', value:'8C'},
            {id:'020', value:'9C'},

            // zodiac
            {id:'008', value:['2C', '3C', '4C']},
            {id:'050', value:['5C', '6C', '7C']},
            {id:'100', value:['8C', '9C', '10C']}
        ]},
    '050': {color: '00958d', id: '050', linked: [{id:'080', value:'5C'}, {id:'200', value:'6C'}, {id:'004', value:'7C'}]},
    '060': {color: '0085ca', id: '060', linked: [{id:'002', value:'8W'}, {id:'003', value:'9W'}, {id:'400', value:'10W'}]},
    '070': {color: '001489', id: '070', linked: [{id:'020', value:'2D'}, {id:'080', value:'3D'}, {id:'200', value:'4D'}]},
    '080': {color: 'ed2800', id: '080'},
    '090': {color: '5c00cc', id: '090', linked: [{id:'004', value:'5S'}, {id:'002', value:'6S'}, {id:'003', value:'7S'}]},
    '100': {color: 'AE0E36', id: '100', linked: [{id:'400', value:'8C'}, {id:'020', value:'9C'}, {id:'080', value:'10C'}]},
    '200': {color: 'FF6D00', id: '200'},
    '300': {color: 'ff3300', id: '300', linked: [
            // planets
            {id:'080', value:['2W', '7W']},
            {id:'200', value:'3W'},
            {id:'004', value:'4W'},
            {id:'400', value:['5W','10W']},
            {id:'020', value:'6W'},
            {id:'002', value:'8W'},
            {id:'003', value:'9W'},

            // zodiac
            {id:'005', value:['2W', '3W', '4W']},
            {id:'009', value:['5W', '6W', '7W']},
            {id:'060', value:['8W', '9W', '10W']},

            // elemental
            {id:'001', value:['KS', 'PW']},
            {id:'040', value:['KC', 'QW']}
        ]},
    '400': {color: '001489', id: '400'}
}

const rowsGroups = [
    atus['001'], atus['040'], atus['300'],
    atus['003'], atus['002'], atus['004'], atus['200'], atus['080'], atus['020'], atus['400'],
    atus['005'], atus['006'], atus['007'], atus['008'], atus['009'], atus['010'], atus['030'], atus['050'], atus['060'], atus['070'], atus['090'], atus['100']
];

const rowsKabalah = [
    atus['001'],
    atus['002'],
    atus['003'],
    atus['004'],
    atus['005'],
    atus['006'],
    atus['007'],
    atus['008'],
    atus['009'],
    atus['010'],
    atus['020'],
    atus['030'],
    atus['040'],
    atus['050'],
    atus['060'],
    atus['070'],
    atus['080'],
    atus['090'],
    atus['100'],
    atus['200'],
    atus['300'],
    atus['400']
];

const rowsRainbow = [
    atus['300'], atus['001'], atus['040'],
    atus['080'], atus['200'], atus['002'], atus['004'], atus['003'], atus['400'], atus['020'],
    atus['005'], atus['006'], atus['007'], atus['008'], atus['009'], atus['010'], atus['030'], atus['050'], atus['060'], atus['070'], atus['090'], atus['100']
];

//const rows = rowsGroups;
//const rows = rowsKabalah;
const rows = rowsRainbow;

const images = {};

async function loadThothImage(key) {
    const filepath = `${__dirname}\\thoth\\${key}.jpg`;
    return await loadImage(filepath);
}

async function loadAtus() {
    console.log('loading atus');
    for (let i = 0; i < rows.length; i++) {
        const atu = rows[i];
        const key = `atu${atu.id}`;
        atu.image = await loadThothImage(key);
    }
}


(async () => {
    await loadAtus();

    const margin = 200;
    const width = 1080*8;
    const height = 1080*8;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    ctx.translate(0, -height*0.05);

    drawBackground(canvas, {back: '000'});

    console.log('generating points');
    const tri = allPointOfTheTriangle(width, height, margin);

    // color the diamonds

    function fillCell(d) {
        ctx.beginPath();
        ctx.moveTo(d[0].x, d[0].y);
        for (let i = 1; i < d.length; i++) {
            ctx.lineTo(d[i].x, d[i].y);
        }
        ctx.closePath();
        ctx.fill();
    }

    // fill the diamonds
    console.log('filling diamonds');
    for (let row = 0; row < rows.length; row++) {

        for (let cell = 0; cell < tri.rows[row].length; cell++) {
            const color0 = rows[row].color;
            const color1 = rows[cell + row].color;
            const mixed = mixHexColors(color0, color1);

            ctx.fillStyle = `#${mixed}`;

            fillCell(tri.rows[row][cell]);
        }
    }


    // draw the outlines
    ctx.strokeStyle = '#000';
    ctx.strokeStyle = "rgba(0,0,0,1)";
    ctx.lineWidth = width / 1080;

    // the outer triangle
    ctx.beginPath();
    ctx.moveTo(tri.p0.x, tri.p0.y);
    ctx.lineTo(tri.p1.x, tri.p1.y);
    ctx.lineTo(tri.p2.x, tri.p2.y);
    ctx.closePath();
    //ctx.stroke();

    // function drawLine(p0, p1) {
    //     ctx.beginPath();
    //     ctx.moveTo(p0.x, p0.y);
    //     ctx.lineTo(p1.x, p1.y);
    //     ctx.stroke();
    // }

    // the inner lines
    // for (let i = 1; i < 22; i++) {
    //     const p0 = tri.edge[0][i];
    //     const p1 = tri.edge[1][i];
    //     const p2 = tri.edge[2][i];
    //     drawLine(p0, p1);
    //     drawLine(p0, p2);
    // }


    // then draw them
    console.log('drawing atus');
    for (let i = 0; i < rows.length; i++) {
        const atu = rows[i];
        const cell = tri.rows[i][0];
        const xMin = Math.min(cell[0].x, cell[1].x, cell[2].x);
        const xMax = Math.max(cell[0].x, cell[1].x, cell[2].x);
        const yBottom = Math.min(cell[0].y, cell[1].y, cell[2].y);

        const imageWidth = xMax - xMin;
        const ratio = imageWidth / atu.image.width;
        const imageHeight = atu.image.height * ratio;

        ctx.drawImage(atu.image, xMin, yBottom - imageHeight, imageWidth, imageHeight);
    }

    (() => {
        console.log('filling diamonds');
        for (let i = 0; i < rows.length; i++) {
            const atu = rows[i];

            if (!atu.linked) continue;

            atu.linked.forEach(async linked => {

                let index = i;
                let indexLinked = rows.reduce((val, o, i) => {return (o.id === linked.id) ? i : val;}, -1);

                if (indexLinked === -1) return;

                let cellRow = -1;
                let cellCol = -1;

                // appear before
                if (indexLinked < index) {
                    cellRow = indexLinked;
                    cellCol = index - indexLinked;
                }
                else {
                    cellRow = index;
                    cellCol = indexLinked - index;
                }

                // now the text:
                const cell = tri.rows[cellRow][cellCol];

                const xMin = Math.min(cell[0].x, cell[1].x, cell[2].x, cell[3].x);
                const xMax = Math.max(cell[0].x, cell[1].x, cell[2].x, cell[3].x);
                const yMin = Math.min(cell[0].y, cell[1].y, cell[2].y, cell[3].y);
                const yMax = Math.max(cell[0].y, cell[1].y, cell[2].y, cell[3].y);

                const xCenter = (xMax + xMin) / 2;
                const yCenter = (yMax + yMin) / 2;
                const maxDrawHeight = yMax - yMin;

                if (Array.isArray(linked.value)) {
                    if (linked.value.length === 2) {
                        await drawCard(ctx, linked.value[1], xCenter, yCenter + maxDrawHeight * 0.16, maxDrawHeight, 0.3);
                        await drawCard(ctx, linked.value[0], xCenter, yCenter - maxDrawHeight * 0.16, maxDrawHeight, 0.3);
                    }
                    else if (linked.value.length === 3) {
                        for (let i = 0; i < linked.value.length; i++) {
                            const angle = ((Math.PI*2) / 3) * i - Math.PI * 0.5;
                            const radius = maxDrawHeight * 0.13;
                            const x = xCenter + Math.cos(angle) * radius;
                            const y = yCenter + Math.sin(angle) * radius - maxDrawHeight * 0.03;
                            await drawCard(ctx, linked.value[i], x, y, maxDrawHeight, 0.3);
                        }
                    }
                    else {
                        for (let i = 0; i < linked.value.length; i++) {
                            await drawCard(ctx, linked.value[i], xCenter + maxDrawHeight * 0.1 * i, yCenter, maxDrawHeight, 0.3);
                        }
                    }


                } else {
                    await drawCard(ctx, linked.value, xCenter, yCenter, maxDrawHeight, 0.45);
                }
            })

        }
    })();

    // draw the section outlines
    const p1 = tri.rows[0][2][2];
    const p2 = tri.rows[2][0][0];
    const p3 = tri.rows[2][19][1];

    const p4 = tri.rows[0][9][2];
    const p5 = tri.rows[9][0][0];
    const p6 = tri.rows[10][11][2];

    ctx.beginPath()
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.lineTo(p3.x, p3.y);
    ctx.moveTo(p4.x, p4.y);
    ctx.lineTo(p5.x, p5.y);
    ctx.lineTo(p6.x, p6.y);
    ctx.lineWidth = (width/height) * 6;
    ctx.strokeStyle = '#FFF';
    ctx.stroke();

    ctx.restore();

    console.log('saving to disk');
    await exportCanvasToImage(canvas, 'triangle-cmyk-groups');

})();

async function drawCard(ctx, linkedValue, xCenter, yCenter, maxDrawHeight, ratio) {
    // calc the thoth filename key
    const key = linkedValueToThothKey(linkedValue);

    // load it
    const image = await loadThothImage(key);

    // find 100% draw width/height
    const maxRatio = maxDrawHeight / image.height;
    const maxDrawWidth = image.width * maxRatio;

    // lower it
    const drawWidth = maxDrawWidth * ratio;
    const drawHeight = maxDrawHeight * ratio;

    // draw in the center
    ctx.drawImage(image, xCenter - drawWidth / 2, yCenter - drawHeight / 2, drawWidth, drawHeight);

    // draw the label
    // ctx.fillStyle = "white";
    // ctx.textAlign = "center";
    // ctx.font = "40px Georgia";
    // ctx.fillText(linkedValue, xCenter, yCenter + 15);
}

function linkedValueToThothKey(value) {
    const re = /([0123456789KQPS]\d?)([WCSD])/;
    const m = re.exec(value);
    let number = m[1].toString();
    const suit = m[2].toString();

    if (number === 'K') {
        return `${suit.toLocaleLowerCase()}-knight`;
    }
    else if (number === 'Q') {
        return `${suit.toLocaleLowerCase()}-queen`;
    }
    else if (number === 'P') {
        return `${suit.toLocaleLowerCase()}-prince`;
    }
    else if (number === 'S') {
        return `${suit.toLocaleLowerCase()}-princess`;
    }
    else {
        if (number.length < 2) number = '0' + number;
        const suit = m[2].toString();
        return `${suit.toLocaleLowerCase()}${number}`;
    }

}



function allPointOfTheTriangle(width, height, margin) {

    const tri = {
        center: {x: width / 2, y: height / 2},
    };

    // find the lowest point
    tri.p2 = {x: width / 2, y: height - margin};

    // find the other two points based on the radius implied by this point
    const radius = tri.p2.y - tri.center.y;
    // upper left
    const angle0 = Math.PI * 0.5 + Math.PI * 2 * (1/3);
    tri.p0 = {
        x: Math.cos(angle0) * radius + tri.center.x,
        y: Math.sin(angle0) * radius + tri.center.y
    };
    // upper right
    const angle1 = Math.PI * 0.5 + Math.PI * 2 * (2/3);
    tri.p1 = {
        x: Math.cos(angle1) * radius + tri.center.x,
        y: Math.sin(angle1) * radius + tri.center.y
    };

    tri.edge = [[],[],[]]; // TOP, LEFT, RIGHT

    tri.edge[0] = getPointsBetween(tri.p0, tri.p1, 22); // left to right
    tri.edge[1] = getPointsBetween(tri.p0, tri.p2, 22); // moving down to the bottom from left
    tri.edge[2] = getPointsBetween(tri.p2, tri.p1, 22); // moving up to the right

    // now find the diamond dimensions
    const diamond = {
        width: tri.edge[0][1].x - tri.edge[0][0].x,
        height: tri.edge[1][2].y - tri.edge[0][1].y,
    }

    tri.rows = []; // 22 rows, from left to right - 0 has 21 cells, 1 has 20, etc

    for (let row = 0; row < 22; row++) {
        tri.rows[row] = [];

        const xOffset = tri.edge[0][row].x;
        const yOffset = tri.edge[0][row].y - diamond.height * 0.5;

        for (let i = 0; i < (22-row); i++) {
            const x = xOffset + diamond.width * 0.5 * i;
            const y = yOffset + diamond.height * 0.5 * i;

            const points = [];

            const extra = 0.5;

            if (i > 0) {
                points.push({x: x + diamond.width * 0.5, y: y - extra}); // TOP
            }

            points.push({x: x + diamond.width + extra, y: y + diamond.height * 0.5}); // RIGHT
            points.push({x: x + diamond.width * 0.5, y: y + diamond.height + extra}); // BOTTOM
            points.push({x: x - extra, y: y + diamond.height * 0.5}); // LEFT

            tri.rows[row].push(points);
        }
    }

    return tri;
}

function getPointsBetween(p0, p1, count) {
    const points = [];
    const delta = {
        x: p1.x - p0.x,
        y: p1.y - p0.y
    }

    // TOP
    for (let i = 0; i <= 22; i++) {
        const percent = i / 22;
        const point = {
            x: p0.x + delta.x * percent,
            y: p0.y + delta.y * percent,
        }

        points.push(point)
    }

    return points;
}

function drawBackground(canvas, color) {
    let ctx = canvas.getContext('2d');
    ctx.fillStyle = "#" + color.back;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}