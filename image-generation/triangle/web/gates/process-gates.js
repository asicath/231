const fs = require('fs');
const gates = require('./gates');

const atuMap = {
    '00': '001',
    '01': '002',
    '02': '003',
    '03': '004',
    '04': '005',
    '05': '006',
    '06': '007',
    '07': '008',
    '08': '030', // swap
    '09': '010',
    '10': '020',
    '11': '009', // swap
    '12': '040',
    '13': '050',
    '14': '060',
    '15': '070',
    '16': '080',
    '17': '090',
    '18': '100',
    '19': '200',
    '20': '300',
    '21': '400',
};

main();

function main() {
    const meta = {};

    gates.forEach(gate => {

        // init the meta
        const m = meta[gate.key] = {extraCount:0};

        const lines = [];

        // title
        processTitle(gate, lines);

        // thoth data
        processThoth(gate, lines);

        //showAtus(gate, lines);

        processSigilsCompareCrowley(gate, lines, m);

        processCircular1Wirth(gate, lines, m);

        processRotaCrowley(gate, lines, m);

        processTavCrowley(gate, lines, m);

        processVitalCrowley(gate, lines, m);

        processTriple1Wirth(gate, lines, m);

        // write it out
        lines.push('');
        fs.writeFileSync(gate.htmlFile, lines.join('\n'));
    });

    fs.writeFileSync('./gate-data.json', JSON.stringify(meta, null, 2));
}

function processTitle(gate, lines) {
    const titleData = fs.readFileSync(gate.titleFile).toString().replace(/\r/g, '').split('\n').filter(line => line.length > 0);
    lines.push(`<h1 style="margin-bottom: 0;">${titleData[0]}</h1>`);
    lines.push(`<p style="margin-top: 0;">${titleData[1]}</p>`);
}

function showAtus(gate, lines) {
    const atuLeft = atuMap[gate.lCard.number];
    const atuRight = atuMap[gate.rCard.number];
    lines.push(`<div style="display: inline-block; width: 49%;height:auto;vertical-align: top; text-align: center;">`);
    lines.push(`<img class="card" src="thoth-full/atu${atuLeft}.jpg" style="height: 150px; text-align: center;" align="center">`);
    lines.push('</div>');
    lines.push(`<div style="display: inline-block; width: 49%;height:auto;vertical-align: top; text-align: center;">`);
    lines.push(`<img class="card" src="thoth-full/atu${atuRight}.jpg" style="height: 150px; text-align: center;" align="center">`);
    lines.push('</div>');
}

function processThoth(gate, lines) {
    const thoth = fs.readFileSync(gate.thothFile).toString().replace(/\r/g, '').split('\n');

    // no small card, just show the two trumps
    if (thoth.length <= 1) {
        showAtus(gate, lines);
        return;
    }

    lines.push(`<img class="card" src="thoth-full/${thoth[4]}" style="height: 300px; text-align: center;" align="center">`);

    lines.push(`<div class="smallText">Book of Thoth, Crowley</div>`);

    lines.push(`<div class="text" style="margin-bottom: 1em;">`);

    lines.push(`<h2 style="margin-bottom: 0;margin-top: 0">${thoth[0]}</h2>`);
    lines.push(`<h3 style="margin-top: 0;">${thoth[2]}</h3>`);

    lines.push(`<div style="text-align: left;">`);
    for (let i = 6; i < thoth.length; i++) {
        let paragraph = '';
        while (thoth[i].length > 0 && i < thoth.length) {
            if (paragraph.length > 0) paragraph += ' ';
            paragraph += thoth[i];
            i++
        }
        lines.push(`<p>${paragraph}</p>`);
    }
    lines.push(`</div>`);

    lines.push(`</div>`);

    showAtus(gate, lines);
}

function processCircular1Wirth(gate, lines, meta) {
    const file = gate.circular1Wirth;
    const source = 'The Eleven Couples, Oswald Wirth';
    processFileSplit({gate, lines, meta, file, source, titleStyle: 'font-style: italic'});
}

function processTriple1Wirth(gate, lines, meta) {
    const file = gate.triple1Wirth;
    const source = 'The Triple Ternaries, Oswald Wirth';
    processFileSplit({gate, lines, meta, file, source, titleStyle: 'font-style: italic'});
}

function processRotaCrowley(gate, lines, meta) {
    const file = gate.rotaCrowley;
    const source = 'Note by H. Fra. P. on the R.O.T.A. by the Qabalah of the Nine Chambers';
    processFileSplit({gate, lines, meta, file, source, titleStyle: 'font-size: 2em;'});
}

function processTavCrowley(gate, lines, meta) {
    const file = gate.tavCrowley;
    const source = 'LIBER [KABBALÆ TRIVM LITERARUM] ת SVB FIGVRÂ CD';
    processFileSplit({gate, lines, meta, file, source, titleStyle: 'font-size: 2em;'});
}

function processVitalCrowley(gate, lines, meta) {
    const file = gate.vitalCrowley;
    const source = 'The Vital Triads, The Book of Thoth, Aleister Crowley';
    processFileSplit({gate, lines, meta, file, source, titleStyle: 'font-size: 2em;'});
}

function processSigilsCompareCrowley(gate, lines, meta) {
    const file = gate.sigilsCrowley;
    const source = 'Suggested Sigil Comparisons, LIBER CCXXXI, Aleister Crowley';
    processSigilCompare({gate, lines, meta, file, source});
}

function loadFile(file) {
    if (!fs.existsSync(file)) return null;

    const data = fs.readFileSync(file).toString().replace(/\r/g, '').split('\n');
    if (data.length <= 1) return null;

    try {

        // parse the data
        const title = data[0];
        // left
        const leftTitle = data[2];
        const leftLines = [];
        let i = 3;
        while (data[i] && data[i].length > 0) {
            leftLines.push(data[i++]);
        }
        i++;
        // right
        const rightTitle = data[i++];
        const rightLines = [];
        while (data[i] && data[i].length > 0) {
            rightLines.push(data[i++]);
        }
        i++;
        // center
        let centerTitle = null, centerLines = null;
        if (data[i] && data[i].length > 0) {
            centerTitle = data[i++];
            centerLines = [];
            while (data[i].length > 0) {
                centerLines.push(data[i++]);
            }
            i++;
        }

        return {
            title,
            leftTitle,
            leftLines,
            rightTitle,
            rightLines,
            centerTitle,
            centerLines
        };
    }
    catch (err) {
        console.error(`error loading ${file}`)
        throw err;
    }


}

function processFileSplit({gate, lines, meta, file, source, titleStyle = ''}) {

    const data = loadFile(file);
    if (data === null) return;

    // store the meta
    meta.extraCount++;

    lines.push(`<div class="smallText">${source}</div>`);

    lines.push(`<div class="text">`);
    lines.push(`<h2 style="margin-top: 0; margin-bottom: 0;">${data.title}</h2>`);

    // LEFT
    lines.push(`<div style="display: inline-block; width: 49%;height:auto;vertical-align: top;">`);
    lines.push(`<p><span style="${titleStyle}">${data.leftTitle}</span><br>`);
    data.leftLines.forEach(line => {
        lines.push(`${line}<br>`);
    });
    lines.push(`</p></div>`);

    // RIGHT
    lines.push(`<div style="display: inline-block; width: 49%;height:auto;vertical-align: top;">`);
    lines.push(`<p><span style="${titleStyle}">${data.rightTitle}</span><br>`);
    data.rightLines.forEach(line => {
        lines.push(`${line}<br>`);
    });
    lines.push(`</p></div>`);

    // CENTER
    if (data.centerTitle) {
        lines.push(`<div style="display: inline-block; width: 100%;height:auto;vertical-align: top;">`);
        lines.push(`<p style="margin-bottom: 0; font-style: italic">Other member of triad:</p>`);
        lines.push(`<p style="margin-top: 0"><span style="${titleStyle}">${data.centerTitle}</span><br>`);
        data.centerLines.forEach(line => {
            lines.push(`${line}<br>`);
        });
        lines.push(`</p></div>`);
    }

    lines.push(`</div>`);
}

function processSigilCompare({gate, lines, meta, file, source}) {

    const data = loadFile(file);
    if (data === null) return;

    // store the meta
    meta.extraCount++;

    lines.push(`<div class="smallText">${source}</div>`);

    lines.push(`<div class="text">`);
    //lines.push(`<h2 style="margin-top: 0; margin-bottom: 0;">${data.title}</h2>`);

    // LEFT
    lines.push(`<div style="display: inline-block; width: 49%;height:auto;vertical-align: top;">`);
    lines.push(`<img style="width: 100%;" src="sigils/${gate.lCard.number}.png" /></div>`);

    // RIGHT
    lines.push(`<div style="display: inline-block; width: 49%;height:auto;vertical-align: top;">`);
    lines.push(`<img style="width: 100%;" src="sigils/${gate.rCard.number}.png" /></div>`);

    lines.push('</div>');
}