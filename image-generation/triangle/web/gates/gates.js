const cards = require("./cards");

const gates = [];

for (let l = 0; l < cards.length; l++) {
    for (let r = l+1; r < cards.length; r++) {
        const lCard = cards[l];
        const rCard = cards[r];

        const key = `${l}-${r}`;

        // make the directory
        const dir = `./${key}`;

        const titleFile = `${dir}/title.md`;
        const thothFile = `${dir}/thoth.md`;
        const circular1Wirth = `${dir}/circular-1-wirth.md`;
        const rotaCrowley = `${dir}/rota.md`;
        const tavCrowley = `${dir}/tav.md`;
        const vitalCrowley = `${dir}/vital.md`;
        const sigilsCrowley = `${dir}/sigils.md`;
        const triple1Wirth = `${dir}/triple-1-wirth.md`;

        const htmlFile = `${dir}/index.html`;

        // make the gate
        const gate = {
            key,

            lCard,
            rCard,
            dir,

            titleFile,
            thothFile,
            circular1Wirth,
            rotaCrowley,
            tavCrowley,
            vitalCrowley,
            sigilsCrowley,
            triple1Wirth,

            htmlFile
        };

        gates.push(gate);
    }
}

module.exports = gates;
