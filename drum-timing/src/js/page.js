
window.spirit = null;

window.requestAnimFrame = ( function() {
    return  window.requestAnimationFrame       ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame    ||
        window.oRequestAnimationFrame      ||
        window.msRequestAnimationFrame     ||
        function (callback, element) {
            window.setTimeout(callback, 1000 / 60);
        };
})();

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

function initPageJs() {
    // do the Google Font Loader stuff....
    WebFont.load({
        google: {
            families: ['Vollkorn']
        },
        active: function () {
            $(document).ready(function () {

                // check if a spirit is specified
                const spirit = getQueryParams('spirit') || null;

                if (spirit !== null) {
                    showSpirit(spirit);
                }
                else {
                    // show the index
                    showIndex();
                }

            });
        }
    });

    function showSpirit(spirit) {

        // load the config from words
        const wordConfig = words[spirit];

        // override customtimes with any word specific
        const times = Object.assign({}, defaultTimes);
        if (wordConfig.customTimes) {
            for (let key in wordConfig.customTimes) {
                Object.assign(times[key], wordConfig.customTimes[key]);
            }
        }

        // add clicks in if specified
        if (spirit.includeClicks) addClicks(wordConfig);

        const timingKey = getQueryParams('timing') || 'long';
        const timeConfig = times[timingKey];

        init(wordConfig, timeConfig);
        startDrawing();
    }

    function addClicks(wordConfig) {
        // add in click tracks if asked for
        // {text:'', count:1, audio:'click'},
        const partsWithClick = [];
        wordConfig.parts.forEach(part => {
            // add the original, but with a single beat
            partsWithClick.push({text: part.text, count: 1, audio: part.audio});
            for (let i = 0; i < part.count - 1; i++) {
                partsWithClick.push({text: '', count: 1, audio: 'click'});
            }
        });
        wordConfig.parts = partsWithClick;
    }

    function showIndex() {

        // compile index
        let lines = Object.keys(words).map((key, i) => {
            let prefix = '';
            let suffix = '';
            if (i % 3 === 0) {
                prefix = `<div class="row">`;
            }
            if (i % 3 === 2) {
                suffix = `</div>`;
            }
            return `${prefix}<div class="spiritLink" style="background-color: ${words[key].back};"><a href="index.htm?spirit=${key}">${key}</a></div>${suffix}`
        });
        lines.push('</div>');

        $('body').html(`<div>${lines.join('\n')}</div>`);
    }

    document.body.onkeydown = function(e){
        if(e.keyCode == 32) state.timer.togglePause();
    };
    document.body.onclick = function(e){
        state.timer.togglePause();
    };


    function drawFrame() {
        draw('#seal');
    }

    function startDrawing() {
        requestAnimFrame(startDrawing);
        drawFrame();

        //setInterval(drawFrame, 1000/60);
    }
}
