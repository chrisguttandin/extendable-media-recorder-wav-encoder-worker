import { computeNumberOfSamples } from '../../../src/functions/compute-number-of-samples';
import { createEncode } from '../../../src/factories/encode';
import { encodeHeader } from '../../../src/functions/encode-header';
import { loadFixtureAsArrayBuffer } from '../../helper/load-fixture';

const split = (channelArrayBuffer) => {
    const chunks = [];

    for (let i = 0; i < channelArrayBuffer.byteLength; i += Float32Array.BYTES_PER_ELEMENT * 128) {
        const length = Math.min((channelArrayBuffer.byteLength - i) / Float32Array.BYTES_PER_ELEMENT, 128);

        chunks.push(new Float32Array(channelArrayBuffer, i, length));
    }

    return chunks;
};

describe('encode()', () => {
    let channelDataArrays;
    let encode;

    beforeEach(async () => {
        encode = createEncode(computeNumberOfSamples, encodeHeader);

        const leftChannelArrayBuffer = await loadFixtureAsArrayBuffer('1000-frames-of-noise-left.pcm');
        const rightChannelArrayBuffer = await loadFixtureAsArrayBuffer('1000-frames-of-noise-right.pcm');

        channelDataArrays = [split(leftChannelArrayBuffer), split(rightChannelArrayBuffer)];
    });

    leche.withData([['1000-frames-of-noise', 44100, 16]], (filename, sampleRate, bitRate) => {
        let fileArrayBufferAsArray;

        beforeEach(async () => {
            const fileArrayBuffer = await loadFixtureAsArrayBuffer(`${filename}.wav`);

            fileArrayBufferAsArray = Array.from(new Uint16Array(fileArrayBuffer));
        });

        it('should encode the arrayBuffer as a wav file', () => {
            const encodeArrayBufferAsArray = Array.from(new Uint16Array(encode(channelDataArrays, 'complete', bitRate, sampleRate)[0]));

            for (let i = 0, length = encodeArrayBufferAsArray.length; i < length; i += 1) {
                expect(encodeArrayBufferAsArray[i]).to.be.closeTo(fileArrayBufferAsArray[i], 1);
            }
        });
    });
});
