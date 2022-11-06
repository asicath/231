const fs = require('fs');
const cards = require('./cards');

const gates = require('./gates');

gates.forEach(gate => {
    const lines = [];

    // title
    const titleData = fs.readFileSync(gate.titleFile).toString().replace(/\r/g, '').split('\n').filter(line => line.length > 0);
    lines.push(`<h1>${titleData[0]}</h1>`);
    lines.push(`<p>${titleData[1]}</p>`);

    // thoth data
    const thoth = fs.readFileSync(gate.thothFile).toString().replace(/\r/g, '').split('\n');
    if (thoth.length > 1) {

        lines.push(`<h2>${thoth[0]}</h2>`);
        lines.push(`<h3>${thoth[2]}</h3>`);

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

        lines.push(`<img src="thoth-full/${thoth[4]}" style="height: 300px; text-align: center;" align="center">`);

    }

    // write it out
    lines.push('');
    fs.writeFileSync(gate.htmlFile, lines.join('\n'));
});


/*
<div>
    <div>circular-1</div>
    <h2>Spiritual Illumination</h2>
    <div style="display: inline-block; width: 49%;height:auto;">
        <span style="font-style: italic">Sol</span><br>
        Universal Light.<br>
        The Eternal Word.<br>
        Expansion, illumination which gives genius. Serenity, fine ares poetry, idealism.<br>
    </div>
    <div style="display: inline-block; width: 49%;height:auto;">
        <span style="font-style: italic">The Emperor</span><br>
        Inner Light<br>
        The word made flesh.<br>
        Concentration of thought and will. Energy calculation, deduction, positivism.<br>
    </div>
</div>


 */