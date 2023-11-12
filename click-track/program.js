
const defaultConfig = {
    text: '#000000',
    fore: '#222222',
    back: '#eeeeee',
    backEnd: '#ffffff',
    backEndRayed: undefined,
    backFlecked: undefined
};

class Program {

    constructor(wordConfig, timeConfig) {

        // create the conbined config
        this.config = Object.assign({}, defaultConfig, timeConfig, wordConfig);

        // total parts
        this.partCount = this.config.parts.reduce((total, part) => {
            return total + part.count;
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
                timePerCount: duration / this.partCount
            };
            this.measures.push(measure);

            // setup for next loop
            time += duration;
            index += 1;

            // now find the part times of this measure
            let countTotal = 0;
            let i = 0;
            while (i < this.config.parts.length) {
                const partConfig = this.config.parts[i];

                // find the start from the measure
                const startLocal = Math.floor(countTotal * measure.timePerCount);
                const part = {
                    startLocal,
                    start: measure.start + startLocal,
                    duration: Math.floor(partConfig.count * measure.timePerCount),
                    partIndex: i,
                    partConfig
                };
                measure.parts.push(part);

                // setup for next part
                countTotal += partConfig.count;
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
    const program = new Program(words.qoph, times.long);
    console.log(program.partCount);
}
