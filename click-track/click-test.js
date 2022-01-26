const {writeWav, appendWav, createSilence, generateAllNotes, getAllNotes, createTone, applyEnvelope} = require('./wav');
const words = require('./words');

const sampleRate = 48000;

(async () => {

    const filename = `./output/test.wav`;

    // timing
    let silence = createSilence({sampleRate, duration: 10000});
    let data = [];
    for (let i = 0; i < silence.length; i++) {
        data.push(silence[i]);
    }

    addTones(data);

    // apply volume
    maxAmp(data);

    writeWav(data, filename, sampleRate);

})();

function maxAmp(data) {
    const maxAmp = 32767;
    const buffer = 1000;
    const ampMultiplier = maxAmp - buffer;
    for (let i = 0; i < data.length; i++) {
        data[i] = data[i] * ampMultiplier;
    }
}

function addTones(data) {
    const envelope = {
        attack: 0.1,
        decay: 0.1,
        sustain: 0.7,
        release: 0.1,
        sustainPercent: 0.8
    }
    let tone = createTone(sampleRate, 200, 440, 1);
    tone = applyEnvelope(tone, envelope);
    for (let n = 0; n < 10; n++) {
        const offset = sampleRate * n;
        for (let i = 0; i < tone.length; i++) {
            data[offset + i] += tone[i];
        }
    }
}

