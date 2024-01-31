const { createCanvas, loadImage } = require('canvas');
const { readdirSync } = require('fs');

let debugMarks = false;

const spirits = {

    m001: {name: `Aعu-iao-uعa`, offset: {x: 0, y: 0}},
    m002: {name: `Beعθaoooabitom`, offset: {x: 0, y: 0}},
    m003: {name: `Gitωnosapφωllois`, offset: {x: 0, y: 40}},
    m004: {name: `Dηnaⲝartarωθ`, offset: {x: 0, y: 50}},
    m005: {name: `Hoo-oorω-iⲝ`, offset: {x: 0, y: 0}},
    m006: {name: `Vuaretza`, offset: {x: 0, y: 0}},
    m007: {name: `Zooωasar`, offset: {x: 0, y: -20}},
    m008: {name: `Chiva-abrahadabra-cadaxviii`, offset: {x: 0, y: 0}},
    m009: {name: `θalعⲝer-ā-dekerval`, offset: {x: 0, y: -60}},
    m010: {name: `Iehuvahaⲝanعθatan`, offset: {x: 0, y: 50}},
    m020: {name: `Kerugunaviel`, offset: {x: 0, y: -30}},
    m030: {name: `Lusanaherandraton`, offset: {x: 0, y: 50}},
    m040: {name: `Malai`, offset: {x: 0, y: 50}},
    m050: {name: `Nadimraphoroiozعθalai`, offset: {x: 0, y: -20}},
    m060: {name: `Salaθlala-amrodnaθعiⲝ`, offset: {x: 0, y: -50}},
    m070: {name: `Oaoaaaoooع-iⲝ`, offset: {x: 0, y: 0}},
    m080: {name: `Puraθmetai-apηmetai`, offset: {x: 0, y: 0}},
    m090: {name: `XanθaⲝeranⲈϘ-iⲝ`, offset: {x: 0, y: 0}},
    m100: {name: `QaniΔnayx-ipamai`, offset: {x: 0, y: 0}},
    m200: {name: `Ra-a-gioselahladnaimawa-iⲝ`, offset: {x: 0, y: 0}},
    m300: {name: `Shabnax-odobor`, offset: {x: 0, y: 0}},
    m400: {name: `Thath’thʻthithعthuth-thiⲝ`, offset: {x: 100, y: 0}, scale: 0.35},

    q001: {name: `Amprodias`, offset: {x: -40, y: -30}},
    q002: {name: `Baratchial`, offset: {x: 20, y: 60}},
    q003: {name: `Gargophias`, offset: {x: 0, y: 60}},
    q004: {name: `Dagadiel`, offset: {x: 0, y: 0}},
    q005: {name: `Hemethterith`, offset: {x: 0, y: 50}},
    q006: {name: `Uriens`, offset: {x: 10, y: 30}},
    q007: {name: `Zamradiel`, offset: {x: 0, y: 10}},
    q008: {name: `Characith`, offset: {x: 50, y: 0}},
    q009: {name: `Temphioth`, offset: {x: 0, y: 0}},
    q010: {name: `Yamatu`, offset: {x: 0, y: 0}},
    q020: {name: `Kurgasiax`, offset: {x: 0, y: 20}},
    q030: {name: `Lafcursiax`, offset: {x: 0, y: 0}},
    q040: {name: `Malkunofat`, offset: {x: 0, y: 30}},
    q050: {name: `Niantiel`, offset: {x: -30, y: 90}},
    q060: {name: `Saksaksalim`, offset: {x: 0, y: 20}},
    q070: {name: `A’ano’nin`, offset: {x: 120, y: 60}},
    q080: {name: `Parfaxitas`, offset: {x: 0, y: 0}},
    q090: {name: `Tzuflifu`, offset: {x: 0, y: 30}},
    q100: {name: `Qulielfi`, offset: {x: 10, y: 170}},
    q200: {name: `Raflifu`, offset: {x: 20, y: 40}},
    q300: {name: `Shalicu`, offset: {x: 20, y: 50}},
    q400: {name: `Thantifaxath`, offset: {x: 0, y: 20}, scale: 0.35},
};

(async () => {
    //await loadImages();
    //await main();

    const getDirectories = source =>
        readdirSync(source, { withFileTypes: true })
            .filter(dirent => dirent.isDirectory())
            .map(dirent => dirent.name);

    for (const key of Object.keys(spirits).filter(key => key.indexOf('q') === 0)) {
        await main(key);
    }

})();

async function main(key) {
    const rootInput = `Z:\\git\\231\\image-generation`;
    const rootOutput = 'Z:\\git\\231\\image-generation\\output\\name-circles';

    const spirit = spirits[key];

    const input = `${rootInput}\\sigils\\${key}.png`;
    const output = `${rootOutput}\\${key}.png`;
    const text = spirit.name;

    const canvas = createCanvas(1024, 1024);
    const ctx = canvas.getContext('2d');

    // start with white bg
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // add the sigil
    const image = await loadImage(input);

    const baseScale = key.indexOf('q') === 0 ? 0.34 : 0.5; // Q is larger than M/D
    const ratio = baseScale * (spirit.scale || 1);
    const marginX = Math.floor((canvas.width - image.width * ratio) / 2);
    const marginY = Math.floor((canvas.height - image.height * ratio) / 2);
    const offsetX = spirit.offset.x * ratio;
    const offsetY = spirit.offset.y * ratio;
    ctx.drawImage(image, marginX + offsetX, marginY + offsetY, canvas.width - marginX * 2, canvas.height - marginY * 2);

    // draw the text and circle
    await drawNameCircle(canvas, text);

    if (debugMarks) {
        let image = await loadImage("C:\\git\\mandala\\Assets\\231\\coin5.fbx.png");
        ctx.drawImage(image, 0, 0, image.width, image.height);
    }

    await exportCanvasToImage(canvas, output);
}

async function drawNameCircle(canvas, text) {
    let ctx = canvas.getContext('2d');

    // calc center
    let center = {x: canvas.width / 2, y: canvas.height / 2};

    // calc radius
    let radius = {
        max: canvas.height / 2
    };

    // find the top and bottom of text draw area
    radius.textTop = radius.max * 0.915; // should be aligned with the UV template lip
    radius.textBottom = radius.max * 0.7; // allow for the text plus margins
    let innerCircleWidth = 6;
    radius.innerCircle = radius.textBottom - innerCircleWidth;

    // determine how much each letter gets
    let letterCount = text.length;
    let dAngle = (Math.PI * 2) / letterCount;
    let startAngle = 0;

    for (let i = 0; i < letterCount; i++) {
        let letter = text[i];

        // find preferred font size/name
        let fontSize = 70; // orig 80
        let fontName = 'Times New Roman';
        if (letter === 'ⲝ') {
            //fontName = 'Noto Sans Coptic';
            //fontName = 'Antinoou';

            // this has the best version
            fontName = 'CS Pishoi';
            //fontName = 'CS Copt';
            letter = 'x';
        }
        else if (letter === 'Ⲉ') {
            //fontName = 'CS Pishoi';
            //letter = 'E';

            fontName = 'Antinoou';
        }
        else if (letter.match(/[a-z]/i)) {
            fontName = 'ColdstyleRoman';
        }



        // generate the letter image
        let trimmed = await getMinimumSizeImage(letter, fontName, fontSize);

        // rotate so the draw position is at the top
        ctx.save();
        ctx.translate(center.x, center.y);
        ctx.rotate(i * dAngle + startAngle);

        // find the draw position
        let x = 0;
        let y = -1 * (radius.textTop + radius.textBottom) / 2;

        // draw the pre generated trimmed letter image
        if (trimmed) {
            x -= trimmed.width / 2;
            y -= trimmed.height / 2;
            ctx.drawImage(trimmed.image, x, y, trimmed.width, trimmed.height);
        }

        // draw directly
        else {
            ctx.font = `${fontSize}pt "${fontName}"`;
            ctx.textAlign = 'center';
            ctx.fillStyle = "#000000";
            ctx.fillText(letter, x, y);
        }

        ctx.restore();
    }

    ctx.save();
    ctx.translate(center.x, center.y);

    // inner circle
    ctx.beginPath();
    ctx.arc(0, 0, radius.innerCircle, 0, 2 * Math.PI, false);
    ctx.lineWidth = innerCircleWidth;
    ctx.strokeStyle = '#000';
    ctx.stroke();

    if (debugMarks) {
        ctx.beginPath();
        ctx.arc(0, 0, radius.textTop, 0, 2 * Math.PI, false);
        ctx.lineWidth = 1;
        ctx.strokeStyle = '#F0F';
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(0, 0, radius.textBottom, 0, 2 * Math.PI, false);
        ctx.lineWidth = 1;
        ctx.strokeStyle = '#F0F';
        ctx.stroke();
    }

    ctx.restore();

}

async function getMinimumSizeImage(text, fontName, fontSize) {

    // create the canvas/ctx
    let width = Math.ceil(fontSize*3);
    let height = width;
    let canvas = createCanvas(width, height);
    let ctx = canvas.getContext('2d');
    ctx.textAlign = 'center';

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // set the font
    ctx.font = `${fontSize}pt "${fontName}"`;
    ctx.textAlign = 'center';

    let value = {
        yMin: height,
        yMax: 0,
        xMin: width,
        xMax: 0,
        xDraw: Math.floor(width/2),
        yDraw: Math.floor(height/2)
    };

    // draw the text
    ctx.fillStyle = "#000000";
    ctx.fillText(text, value.xDraw, value.yDraw);

    // export to file
    //await exportCanvasToImage(canvas, "letter");

    // get the pixels
    let idata = ctx.getImageData(0, 0, width, height);

    // find min/max
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            let index = (x + y * width) * 4;
            let pixel = {
                r: idata.data[index],
                g: idata.data[index+1],
                b: idata.data[index+2],
                a: idata.data[index+3]
            };

            // a non-white pixel
            if (pixel.r < 255 || pixel.g < 255 || pixel.b < 255) {
                if (y > value.yMax) value.yMax = y;
                if (y < value.yMin) value.yMin = y;
                if (x > value.xMax) value.xMax = x;
                if (x < value.xMin) value.xMin = x;
            }
        }
    }

    value.width = value.xMax - value.xMin;
    value.height = value.yMax - value.yMin;

    // give a margin
    let margin = 2;
    value.width += margin * 2;
    value.height += margin * 2;
    value.xMin -= margin;
    value.yMin -= margin;
    value.xMax += margin;
    value.yMax += margin;

    // now create the min sized image?
    value.image = createCanvas(value.width, value.height);
    let ctxOutput = value.image.getContext('2d');
    ctxOutput.drawImage(canvas,
        value.xMin, value.yMin, value.width, value.height,
        0, 0, value.width, value.height);

    //await exportCanvasToImage(value.image, "output");

    return value;
}

function exportCanvasToImage(canvas, filename) {
    return new Promise((resolve, reject) => {
        const fs = require('fs');
        const out = fs.createWriteStream(filename);
        const stream = canvas.createPNGStream();

        stream.pipe(out);
        out.on('finish', () => {
            console.log(`${filename} was created.`);
            resolve();
        });
    });
}