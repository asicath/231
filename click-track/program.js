
const defaultConfig = {
    text: '#000000',
    fore: '#222222',
    back: '#eeeeee',
    backEnd: '#ffffff',
    backEndRayed: undefined,
    backFlecked: undefined
};

/**
 * Acts as an interface between the word config and the frame and wav generators
 */
class Program {

    constructor(wordConfig, timeConfig) {

        // create the combined config
        this.config = Object.assign({}, defaultConfig, timeConfig, wordConfig);

        this._calculateMeasures();
    }

    _calculateMeasures() {

        // get the total part count [beats per measure]
        this.beatsPerMeasure = this.config.parts.reduce((total, part) => {
            return total + part.beats;
        }, 0);

        // create the measures
        this.measures = [];
        let time = 0;
        let index = 0;
        while (time < this.config.totalTime) {

            // find the percent of this measure at start
            const percentLinear = time / this.config.totalTime;

            // apply easing
            const percent = this.config.easingFunction(percentLinear);

            // calculate duration based on eased percent
            const duration = Math.floor((this.config.initialDuration - this.config.minDuration) * (1-percent)) + this.config.minDuration;

            // create the measure
            const measure = {
                index,
                duration,
                start: time,
                parts: [],
                clicks: null,
                timePerCount: duration / this.beatsPerMeasure
            };
            this.measures.push(measure);

            // setup for next loop
            time += duration;
            index += 1;

            // now find the part times of this measure
            let countTotal = 0;
            let i = 0;
            while (i < this.config.parts.length) {
                const part = this.config.parts[i];

                // find the start from the measure
                const startLocal = Math.floor(countTotal * measure.timePerCount);
                const measurePart = {
                    startLocal,
                    start: measure.start + startLocal,
                    duration: Math.floor(part.beats * measure.timePerCount),
                    partIndex: i,
                    audio: part.audio
                };
                measure.parts.push(measurePart);

                // setup for next part
                countTotal += part.beats;
                i++;
            }

            // find the times of the clicks
            if (this.config.clicksPerMeasure) {
                measure.clicks = [];
                measure.durationPerClick = measure.duration / this.config.clicksPerMeasure;
                for (let i = 0; i < this.config.clicksPerMeasure; i++) {
                    measure.clicks.push(Math.floor(i * measure.durationPerClick));
                }
            }
        }
    }

}

module.exports = Program;

if (module.parent === null) {
    const times = require('./times');
    const words = require('./words');
    const program = new Program(words.qoph, times.drum11);
    console.log(program.beatsPerMeasure);
}
