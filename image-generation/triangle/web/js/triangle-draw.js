const {rowsRainbow} = require('./data');
const {initTriangle} = require('./triangle-model');
const gateData = require('../gates/gate-data.json');

let cells = null;
let selectedKey = null;
let mouseOverKey = null;

//const rows = rowsGroups;
//const rows = rowsKabalah;
const rows = rowsRainbow;

const images = {};


function drawFrame() {
    let canvas = $('#seal')[0];
    draw(canvas);
}

main();

function getUrlVars()
{
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++)
    {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}

function loadKeyFromQS() {
    const qs = getUrlVars();
    if (qs.key) {
        for (const key of Object.keys(cells)) {
            const cell = cells[key];
            if (cell.clickKey === qs.key) {
                console.log(`loading ${qs.key}`);
                onCellSelect(cell);
                return;
            }
        }
        console.log(`no corrseponding gate to ${qs.key}`);
    }
    console.log('no key found in QS')
}

function main() {
    WebFont.load({
        google: {
            families: ['Vollkorn']
        },
        active: function () {
            $(document).ready(function () {

                const canvas = $('#seal');

                // setup canvas and events
                setupCanvas(canvas);

                // initialize the points
                const margin = 20;
                const width = canvas.width();
                const height = canvas.height();
                cells = initTriangle(width, height, margin, rows);

                // load the atus
                loadAtus()
                    .then(() => {
                        drawFrame();
                        loadKeyFromQS();
                    });
            });
        }
    });
}

function setupCanvas(canvas) {
    resizeCanvas(canvas);
    setupMouseEvent(canvas);
}

function resizeCanvas(canvas) {
    const container = $(canvas).parent();

    // Get the width of parent, we will use all of this
    const maxWidth = container.width();
    //const maxWidth = $(window).innerWidth();
    const maxHeight = $(window).innerHeight();

    const size = Math.min(maxWidth, maxHeight);

    // Set width and height
    if ($(canvas).attr('width') !== size) { $(canvas).attr('width', size); }
    if ($(canvas).attr('height') !== size) { $(canvas).attr('height', size); }
}

function setupMouseEvent(canvas) {
    canvas[0].onmousedown = function(e) {

        // important: correct mouse position:
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const gate = getDiamondByPoint(x, y);
        if (gate) {
            if (gate.key === selectedKey) {
                onCellSelect(null);
            }
            else {
                onCellSelect(gate);
            }
        }

    };

    canvas[0].onmousemove = function(e) {

        // important: correct mouse position:
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const gate = getDiamondByPoint(x, y);
        const key = gate ? gate.key : null;

        if (key !== mouseOverKey) {
            mouseOverKey = key;
            drawFrame();
        }

    };
}

function onCellSelect(cell) {

    selectedKey = cell ? cell.key : null;
    drawFrame();

    if (selectedKey === null) {
        setUrlKey('');
        $('#right').html('');
    }
    else {
        setUrlKey(cell.clickKey);
        $('#right').html(`<div>${cell.clickKey}</div>`);
        loadGateContext(cell.clickKey, cell.textBackgroundColor, cell.borderColor);
    }

}

function setUrlKey(key) {
    if ('URLSearchParams' in window) {
        const searchParams = new URLSearchParams(window.location.search)
        searchParams.set("key", key);
        const newRelativePathQuery = window.location.pathname + '?' + searchParams.toString();
        history.pushState(null, '', newRelativePathQuery);
    }
}

function loadGateContext(key, textBackgroundColor, borderColor) {
    var xhr= new XMLHttpRequest();
    xhr.open('GET', `gates/${key}/index.html`, true);
    xhr.onreadystatechange = function() {
        if (this.readyState !== 4) return;
        if (this.status !== 200) return; // or whatever error handling you want
        document.getElementById('right').innerHTML = `<div class="rightInner">${this.responseText}</div>`;

        $('.text').css('background-color', `#${textBackgroundColor}`);
        $('.text').css('border-color', `#${borderColor}`);

        $('.smallText').css('color', `#${borderColor}`);

    };
    xhr.send();
}





async function loadThothImage(key) {

    if (images.hasOwnProperty(key)) {
        return images[key];
    }

    const filepath = `./thoth-small/${key}.jpg`;
    return new Promise((resolve, reject) => {
        const newImg = new Image();
        newImg.onload = function() {
            resolve(newImg);
        }
        newImg.src = filepath;

        images[key] = newImg;
    })
}

async function loadAtus() {
    //console.log('loading atus');
    const waiting = [];

    // atus
    for (let i = 0; i < rows.length; i++) {
        const atu = rows[i];
        const key = `atu${atu.id}`;

        const p = loadThothImage(key).then(image => {atu.image = image;})
        waiting.push(p);
    }

    // small cards
    ['w', 'c', 's', 'd'].forEach(suit => {
        for (let i = 1; i <= 10; i++) {
            const num = `${i < 10 ? '0' : ''}${i}`;
            const key = `${suit}${num}`;
            const p = loadThothImage(key);
            waiting.push(p);
        }
        ['knight', 'queen', 'prince', 'princess'].forEach(role => {
            const key = `${suit}-${role}`;
            const p = loadThothImage(key);
            waiting.push(p);
        });
    });

    await Promise.all(waiting);
}

function isPointInPoly(poly, pt){
    for(var c = false, i = -1, l = poly.length, j = l - 1; ++i < l; j = i)
        ((poly[i][1] <= pt[1] && pt[1] < poly[j][1]) || (poly[j][1] <= pt[1] && pt[1] < poly[i][1]))
        && (pt[0] < (poly[j][0] - poly[i][0]) * (pt[1] - poly[i][1]) / (poly[j][1] - poly[i][1]) + poly[i][0])
        && (c = !c);
    return c;
}

function getDiamondByPoint(x, y) {
    const pt = [x, y];
    for (const key of Object.keys(cells)) {
        const cell = cells[key];
        if (isPointInPoly(cell.polygon, pt)) {
            return cell;
        }
    }
}






async function draw(canvas) {

    // get the canvas and init
    const context = canvas.getContext('2d');
    context.webkitImageSmoothingEnabled = true;

    //let outerRadius = Math.min(width, height) / 2;

    // clear the whole field
    const width = canvas.width;
    const height = canvas.height;
    context.clearRect(0, 0, width, height);

    // now the actual draw

    // draw the text and circle
    await drawTriangle(canvas);
}

async function drawTriangle(canvas) {

    const width = canvas.width;
    const height = canvas.height;

    const ctx = canvas.getContext('2d');

    // fill the background
    //drawBackground(canvas, {back: '000'});

    const cellSelected = selectedKey !== null ? cells[selectedKey] : null;
    const cellMouseOver = mouseOverKey !== null ? cells[mouseOverKey] : null;
    let highCells = [], medCells = [];

    if (cellSelected !== null) {
        //drawBackground(canvas, {back: cellSelected.color});
        document.body.style.backgroundColor = `#${cellSelected.color}`;

        // determine which should be high
        if (cellSelected.clickKey.indexOf('-') !== -1) {
            highCells = cellSelected.clickKey.split('-');
        }
    }
    else {
        document.body.style.backgroundColor = `#000`;
    }

    if (cellMouseOver !== null) {
        // determine which should be high
        if (cellMouseOver.clickKey.indexOf('-') !== -1) {
            medCells = cellMouseOver.clickKey.split('-');
        }
    }

    // fill the diamonds
    function fillCell(d) {
        ctx.beginPath();
        ctx.moveTo(d[0].x, d[0].y);
        for (let i = 1; i < d.length; i++) {
            ctx.lineTo(d[i].x, d[i].y);
        }
        ctx.closePath();
        ctx.fill();
    }

    // draw the pips to indicate extra content
    function drawExtraCount(cell, count) {

        // orient
        const xCenter = cell.points[0].x;
        const yCenter = cell.points[1].y;
        const yMax = (yCenter - cell.points[0].y);

        // 1st point
        const x = xCenter;
        const y = yCenter - yMax * 0.63;

        ctx.beginPath();
        ctx.arc(x, y, 2, 0, 2 * Math.PI);
        ctx.closePath();

        //ctx.fillStyle = '#fff';
        //ctx.fill();

        ctx.lineWidth = 1;
        ctx.strokeStyle = '#fff';
        ctx.stroke();
    }

    // CELL BACKGROUNDS, plus extra content indicator
    for (const cell of Object.values(cells)) {
        // background
        ctx.fillStyle = `#${cell.color}`;
        if (highCells.indexOf(cell.clickKey) !== -1) {
            fillCell(cell.pointsHigh);
        }
        if (medCells.indexOf(cell.clickKey) !== -1) {
            fillCell(cell.pointsMed);
        }
        else {
            fillCell(cell.points);
        }

        // extra content indicator
        const data = gateData[cell.clickKey];
        if (data && data.extraCount > 0) {
            drawExtraCount(cell, data.extraCount);
        }
    }

    // then draw the top row of atus
    //console.log('drawing atus');
    for (let i = 0; i < rows.length; i++) {
        const atu = rows[i];
        const key = `${i}-0`;
        const cell = cells[key].points;
        const xMin = Math.min(cell[0].x, cell[1].x, cell[2].x);
        const xMax = Math.max(cell[0].x, cell[1].x, cell[2].x);
        const yBottom = Math.min(cell[0].y, cell[1].y, cell[2].y);

        const imageWidth = xMax - xMin;
        const ratio = imageWidth / atu.image.width;
        const imageHeight = atu.image.height * ratio;

        ctx.drawImage(atu.image, xMin, yBottom - imageHeight, imageWidth, imageHeight);
    }

    (() => {
        //console.log('drawing atus in diamonds');
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
                const cellKey = `${cellRow}-${cellCol}`;
                const cell = cells[cellKey].points; //tri.rows[cellRow][cellCol];

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
    const p1 = cells['0-2'].points[2];
    const p2 = cells['2-0'].points[0];
    const p3 = cells['2-19'].points[1];

    const p4 = cells['0-9'].points[2];
    const p5 = cells['9-0'].points[0];
    const p6 = cells['10-11'].points[2];

    ctx.beginPath()
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.lineTo(p3.x, p3.y);
    ctx.moveTo(p4.x, p4.y);
    ctx.lineTo(p5.x, p5.y);
    ctx.lineTo(p6.x, p6.y);
    ctx.lineWidth = (height / 1000);
    ctx.strokeStyle = '#fff';
    ctx.stroke();

    function outlineCell(d, widthMod) {
        ctx.beginPath();
        ctx.moveTo(d[0].x, d[0].y);
        for (let i = 1; i < d.length; i++) {
            ctx.lineTo(d[i].x, d[i].y);
        }
        ctx.closePath();

        ctx.lineWidth = (height / 1000) * widthMod;
        ctx.strokeStyle = '#FFF';
        ctx.stroke();
    }

    // draw the selected outline
    if (cellSelected !== null) {
        outlineCell(cellSelected.points, 5);
    }
    if (cellMouseOver !== null) {
        outlineCell(cellMouseOver.points, 1);
    }

}

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

function drawBackground(canvas, color) {
    let ctx = canvas.getContext('2d');
    ctx.fillStyle = "#" + color.back;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}
