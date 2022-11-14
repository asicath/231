const fs = require('fs');
const gates = require('./gates');

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

        processCircular1Wirth(gate, lines, m);

        processRotaCrowley(gate, lines, m);

        processTavCrowley(gate, lines, m);

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

function processThoth(gate, lines) {
    const thoth = fs.readFileSync(gate.thothFile).toString().replace(/\r/g, '').split('\n');
    if (thoth.length <= 1) return;

    lines.push(`<img class="card" src="thoth-full/${thoth[4]}" style="height: 300px; text-align: center;" align="center">`);

    lines.push(`<div class="smallText">Book of Thoth, Crowley</div>`);

    lines.push(`<div class="text">`);

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
}

function processCircular1Wirth(gate, lines, meta) {
    if (!fs.existsSync(gate.circular1Wirth)) return;

    // store the meta
    meta.extraCount++;

    const data = fs.readFileSync(gate.circular1Wirth).toString().replace(/\r/g, '').split('\n');
    if (data.length <= 1) return;
    lines.push(`<div class="smallText">Oswald Wirth [circular-1]</div>`);

    lines.push(`<div class="text">`);

    lines.push(`<h2 style="margin-top: 0;">${data[0]}</h2>`);

    lines.push(`<div style="display: inline-block; width: 49%;height:auto;vertical-align: top;">`);
    lines.push(`<p><span style="font-style: italic">${data[2]}</span><br>`);
    let i = 3;
    while (data[i].length > 0) {
        lines.push(`${data[i++]}<br>`);
    }
    i++;
    lines.push(`</p></div>`);

    lines.push(`<div style="display: inline-block; width: 49%;height:auto;vertical-align: top;">`);
    lines.push(`<p><span style="font-style: italic">${data[i++]}</span><br>`);
    while (data[i].length > 0) {
        lines.push(`${data[i++]}<br>`);
    }
    lines.push(`</p></div>`);

    lines.push(`</div>`);
}

function processRotaCrowley(gate, lines, meta) {
    if (!fs.existsSync(gate.rotaCrowley)) return;

    // store the meta
    meta.extraCount++;

    const data = fs.readFileSync(gate.rotaCrowley).toString().replace(/\r/g, '').split('\n');
    if (data.length <= 1) return;
    lines.push(`<div class="smallText">Note by H. Fra. P. on the R.O.T.A. by the Qabalah of the Nine Chambers</div>`);

    lines.push(`<div class="text">`);

    lines.push(`<h2 style="margin-top: 0; margin-bottom: 0;">${data[0]}</h2>`);

    lines.push(`<div style="display: inline-block; width: 49%;height:auto;vertical-align: top;">`);
    lines.push(`<p><span style="font-size: 2em;">${data[2]}</span><br>${data[3]}</p></div>`);

    lines.push(`<div style="display: inline-block; width: 49%;height:auto;vertical-align: top;">`);
    lines.push(`<p><span style="font-size: 2em;">${data[5]}</span><br>${data[6]}</p></div>`);

    if (data.length >= 10 && data[8].length > 0 && data[9].length > 0) {
        lines.push(`<div style="display: inline-block; width: 100%;height:auto;vertical-align: top;">`);
        lines.push(`<p style="margin-bottom: 0; font-style: italic">Other member of triad:</p><p style="margin-top: 0"><span style="font-size: 2em;">${data[8]}</span><br>${data[9]}</p></div>`);
    }


    lines.push(`</div>`);
}

function processTavCrowley(gate, lines, meta) {
    if (!fs.existsSync(gate.tavCrowley)) return;

    // store the meta
    meta.extraCount++;

    const data = fs.readFileSync(gate.tavCrowley).toString().replace(/\r/g, '').split('\n');
    if (data.length <= 1) return;
    lines.push(`<div class="smallText">LIBER [KABBALÆ TRIVM LITERARUM] ת SVB FIGVRÂ CD</div>`);

    lines.push(`<div class="text">`);

    lines.push(`<h2 style="margin-top: 0; margin-bottom: 0;">${data[0]}</h2>`);

    lines.push(`<div style="display: inline-block; width: 49%;height:auto;vertical-align: top;">`);
    lines.push(`<p><span style="font-size: 2em;">${data[2]}</span><br>${data[3]}</p></div>`);

    lines.push(`<div style="display: inline-block; width: 49%;height:auto;vertical-align: top;">`);
    lines.push(`<p><span style="font-size: 2em;">${data[5]}</span><br>${data[6]}</p></div>`);

    if (data.length >= 10 && data[8].length > 0 && data[9].length > 0) {
        lines.push(`<div style="display: inline-block; width: 100%;height:auto;vertical-align: top;">`);
        lines.push(`<p style="margin-bottom: 0; font-style: italic">Other member of triad:</p><p style="margin-top: 0"><span style="font-size: 2em;">${data[8]}</span><br>${data[9]}</p></div>`);
    }


    lines.push(`</div>`);
}