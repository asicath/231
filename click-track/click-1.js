const {writeWav, appendWav, createSilence, generateAllNotes, getAllNotes, createTone, applyEnvelope} = require('./wav');
const readWavFile = require('./wav-read');
const times = require('./times');
const words = require('./words');
const Program = require('./Program');
const path = require('path');
const fs = require('fs');

const sampleRate = 48000;
const notes = getAllNotes();

let toneLowConfig = {
    //synth1.triggerAttackRelease("C3", 0.1);
    note: notes['C2'],
    envelope: {
        attack: 0.005,
        decay: 0.1,
        sustain: 0.1,
        release: 0.1,
    }
};
let toneHighConfig = {
    //synth2.triggerAttackRelease("C4", 0.005);
    note: notes['A3'],
    envelope: {
        attack: 0.005,
        decay: 0.05,
        sustain: 0.05,
        release: 0.15,
        attackPercent: 0.8,
        sustainPercent: 0.5
    }
};

const clickMod = 0.5;
let toneClick = {
    //synthClick.triggerAttackRelease("C2", 0.001);
    note: notes['C1'],
    envelope: {
        attack: 0.002 * clickMod,
        decay: 0.005 * clickMod,
        sustain: 0.01 * clickMod,
        release: 0.005 * clickMod,
    }
};

let tones = null; // set to which ever set we are using

const tonesClick = {
    low: generateTone(toneLowConfig),
    high: generateTone(toneHighConfig),
    click: generateTone(toneClick, 0.2)
};

const tonesRealistic = {
    low: readWavAsPercent(path.join(__dirname, '/boom1.wav')),
    high: readWavAsPercent(path.join(__dirname, '/bop1.wav')),
    click: []
}

function readWavAsPercent(filename, amp = 0.5) {
    const values = readWavFile(filename);

    const max = values.reduce((max, v) => {
        return Math.max(max, Math.abs(v));
    });

    return values.map(v => {
        return (v / max) * amp;
    });
}

(async () => {
    const timing = 'long';
    const path = 'resh';
    const toneSet = 'realistic';

    // create the file path
    const filepath = `./output/${path}`;
    const filename = `${filepath}/${path}-${timing}.wav`;
    if (!fs.existsSync(filepath)) {
        fs.mkdirSync(filepath);
    }

    const word = words[path];
    const time = times[timing]; // minDuration
    tones = toneSet === 'realistic' ? tonesRealistic : tonesClick;

    // override the min duration
    word.minDuration = 4000;

    // create an empty wav
    writeWav([], filename, sampleRate);

    const program = new Program(word, time);

    // append each measure
    const measureBuffer = 1000;
    for (let i = -1; i < program.measures.length; i++) {
        //if (i > 0) continue;

        const measure = i < 0 ? program.measures[0] : program.measures[i];
        logMeasure(measure);

        // create an empty measure
        const buffer = createSilence({sampleRate, duration: measure.duration + measureBuffer});

        addTones(measure, buffer);
        addClicks(measure, buffer);

        // trim to just the current measure
        const samplesInMeasure = measure.duration * 48;
        const data = buffer.splice(0, samplesInMeasure);

        // apply volume
        maxAmp(data);

        // write it out
        appendWav(data, filename, sampleRate);
    }

})();

function logMeasure(measure) {
    let measureIndex = measure.index.toString();
    while (measureIndex.length < 5) {measureIndex = "0" + measureIndex;}

    console.log(`${measureIndex} duration: ${measure.duration}`);
}

function maxAmp(data) {
    const maxAmp = 32767;
    const buffer = 1000;
    const ampMultiplier = maxAmp - buffer;
    for (let i = 0; i < data.length; i++) {
        data[i] = data[i] * ampMultiplier;
    }
}

function generateTone(config, amp = 0.5) {
    const duration = Math.floor((config.envelope.attack + config.envelope.decay + config.envelope.sustain + config.envelope.release) * 1000);
    let tone = createTone(sampleRate, duration, config.note.freq, amp);
    tone = applyEnvelope(tone, config.envelope);
    return tone;
}

function addTones(measure, data) {

    measure.parts.forEach(part => {
        //const part = measure.parts[0];
        if (!part.partConfig.audio || part.partConfig.audio.length === 0) return;

        const tone = tones[part.partConfig.audio];
        const startIndex = part.startLocal * 48;
        for (let i = 0; i < tone.length; i++) {
            data[startIndex + i] += tone[i];
        }
    });

}

function addClicks(measure, data) {
    if (measure.clicks === null) return;

    measure.clicks.forEach(startLocal => {
        const tone = tones['click'];
        const startIndex = startLocal * 48;
        for (let i = 0; i < tone.length; i++) {
            data[startIndex + i] += tone[i];
        }
    });
}
