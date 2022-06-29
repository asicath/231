const fs = require('fs');

const A = require('arcsecond');
const B = require('arcsecond-binary');

function readWavData(filename) {

    const file = fs.readFileSync(filename);

    const riffChunkSize = B.u32LE.chain(size => {
        if (size !== file.length - 8) {
            return A.fail(`Invalid file size: ${file.length}. Expected ${size}`);
        }
        return A.succeedWith(size);
    });

    const riffChunk = A.sequenceOf([
        A.str('RIFF'),
        riffChunkSize,
        A.str('WAVE')
    ]);

    const fmtSubChunk = A.coroutine(function* () {
       const id = yield A.str('fmt ');
       const subChunk1Size = yield B.u32LE;
       const audioFormat = yield B.u16LE;
       const numChannels = yield B.u16LE;
       const sampleRate = yield B.u32LE;
       const byteRate = yield B.u32LE;
       const blockAlign = yield B.u16LE;
       const bitsPerSample = yield B.u16LE;


       const expectedByteRate = sampleRate * numChannels * bitsPerSample / 8;
       if (byteRate !== expectedByteRate) {
           yield A.fail(`Invalid byte rate: ${byteRate}, expected ${expectedByteRate}`);
       }

       const expectedBlockAlign = numChannels * bitsPerSample / 8;
       if (blockAlign !== expectedBlockAlign) {
           yield A.fail(`Invalid block align: ${blockAlign}, expected ${expectedBlockAlign}`);
       }

       const fmtChunkData = {
           id,
           subChunk1Size,
           audioFormat,
           numChannels,
           sampleRate,
           byteRate,
           blockAlign,
           bitsPerSample
       };

       yield A.setData(fmtChunkData);
       return fmtChunkData;
    });

    const dataSubChunk = A.coroutine(function* () {
        const id = yield A.str('data');
        const size = yield B.u32LE;

        const fmtData = yield A.getData;

        const samples = size / fmtData.numChannels / (fmtData.bitsPerSample / 8);
        const channelData = Array.from({length: fmtData.numChannels}, () => []);

        let sampleParser;
        if (fmtData.bitsPerSample === 8) {
            sampleParser = B.s8;
        }
        else if (fmtData.bitsPerSample === 16) {
            sampleParser = B.s16LE;
        }
        else if (fmtData.bitsPerSample === 32) {
            sampleParser = B.s32LE;
        }
        else {
            yield A.fail(`Unsupported bits per sample: ${fmtData.bitsPerSample}`);
        }

        for (let sampleIndex = 0; sampleIndex < samples; sampleIndex++) {
            for (let i = 0; i < fmtData.numChannels; i++) {
                const sampleValue = yield sampleParser;
                channelData[i].push(sampleValue);
            }
        }

        return {
            id,
            size,
            channelData
        }
    });

    const parser = A.sequenceOf([
        riffChunk,
        fmtSubChunk,
        dataSubChunk,
        //A.endOfInput
    ]).map(([riffChunk, fmtSubChunk, dataSubChunk]) => ({
        riffChunk,
        fmtSubChunk,
        dataSubChunk
    }));

    const output = parser.run(file.buffer);
    if (output.isError) {
        throw new Error(output.error);
    }

    return output.result.dataSubChunk.channelData[0];
}
/*
let i = 0;
while (output.result.dataSubChunk.channelData[0][i] === 0) {
    i++;
}

//console.log(output.result);
console.log(output.result.dataSubChunk.channelData[0].slice(i, i+100));*/

module.exports = readWavData;
