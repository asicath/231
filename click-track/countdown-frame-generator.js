const { createCanvas } = require('canvas');
const fs = require("fs");
const ImageHelper = require('./image-helper');

class CountdownFrameGenerator {

    constructor() {

    }

    async executeTimer({durationMinutes, path, framesPerSecond = 60}) {

        const filepath = `./output/${path}/timer${durationMinutes.toString()}`;
        if (!fs.existsSync(filepath)) {
            fs.mkdirSync(filepath);
        }

        const width = 1920;
        const height = 1080;
        const canvas = createCanvas(width, height);

        let time = 0;
        let index = 0;
        const duration =  1000 * 60 * durationMinutes;

        while (time <= duration) {

            // draw
            this.drawTimer_time(canvas, duration, time);

            // output
            let frameKey = index.toString();
            while (frameKey.length < 9) {frameKey = "0" + frameKey;}
            const filename = `${filepath}/${frameKey}.jpg`;
            await ImageHelper.exportCanvasToJpg({canvas, filename});

            // log
            console.log(`${filename} was created.`);

            // setup next frame
            time += 1000 / framesPerSecond;
            index++;
        }

    }

    drawTimer_time(canvas, duration, time) {

        // determine text
        const totalSeconds = Math.max(0, Math.floor((duration - time) / 1000));
        const seconds = totalSeconds % 60;
        const minutes = (totalSeconds - seconds) / 60;
        const ss = `${seconds < 10 ? '0' : ''}${seconds}`;
        const mm = `${minutes < 10 ? ' ' : ''}${minutes}`;
        const text = `${mm}:${ss}`;

        const ctx = canvas.getContext('2d');

        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);

        const fontSize = 50;
        const fontName = 'consolas';
        ctx.font = `${fontSize}pt "${fontName}"`;
        ctx.textAlign = 'center';
        ctx.fillStyle = '#808080';
        ctx.fillText(text, 0, fontSize * 0.45);

        ctx.restore();
    }

}

async function generateForPath(path) {
    const frameGenerator = new CountdownFrameGenerator();

    await frameGenerator.executeTimer({durationMinutes: 11, path});
    //await this.executeTimer({durationMinutes: 3, path});
    //await this.executeTimer({durationMinutes: 2, path});
}

(async () => {
    if (module.parent !== null) return;
    await generateForPath('aleph');
})();
