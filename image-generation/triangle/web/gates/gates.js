const cards = require("./cards");

const gates = [];

for (let l = 0; l < cards.length; l++) {
    for (let r = l+1; r < cards.length; r++) {
        const lCard = cards[l];
        const rCard = cards[r];

        // make the directory
        const dir = `./${l}-${r}`;
        const titleFile = `${dir}/title.md`;
        const thothFile = `${dir}/thoth.md`;

        const htmlFile = `${dir}/index.html`;

        // make the gate
        const gate = {dir, titleFile, thothFile, htmlFile, lCard, rCard};

        gates.push(gate);
    }
}

module.exports = gates;
