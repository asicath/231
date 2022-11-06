const fs = require('fs');
const cards = require('./cards');
const gates = require('./gates');

gates.forEach(gate => {
    // make the directory
    if (!fs.existsSync(gate.dir)) {
        fs.mkdirSync(gate.dir);
    }

    // a base config file
    if (!fs.existsSync(gate.titleFile)) {
        const data = `${gate.lCard.title} + ${gate.rCard.title}\n\n${gate.lCard.attribute} + ${gate.rCard.attribute}\n`
        fs.writeFileSync(gate.titleFile, data);
    }

    // make an empty thoth
    if (!fs.existsSync(gate.thothFile)) {
        fs.writeFileSync(gate.thothFile, "");
    }
});

