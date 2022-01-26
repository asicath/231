const EasingFunctions = require('./easing');

const defaultTimes = {
    short3: {
        initialDuration: 1000 * 8,
        totalTime: 1000*60*3,
        easingFunction: EasingFunctions.easeOutCubic
    },
    short2: {
        initialDuration: 1000 * 6,
        totalTime: 1000*60*2,
        easingFunction: EasingFunctions.easeOutCubic
    },
    long: {
        initialDuration: 1000 * 10,
        totalTime: 1000*60*11,
        easingFunction: EasingFunctions.easeInOutCubic
    }
};

module.exports = defaultTimes;
