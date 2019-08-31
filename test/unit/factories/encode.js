import { createEncode } from '../../../src/factories/encode';
import { encodeHeader } from '../../../src/functions/encode-header';
import { loadFixtureAsArrayBuffer } from '../../helper/load-fixture';

const split = (channelArrayBuffer) => {
    const chunks = [ ];

    for (let i = 0; i < channelArrayBuffer.byteLength; i += Float32Array.BYTES_PER_ELEMENT * 128) {
        const length = Math.min((channelArrayBuffer.byteLength - i) / Float32Array.BYTES_PER_ELEMENT, 128);

        chunks.push(new Float32Array(channelArrayBuffer, i, length));
    }

    return chunks;
};

describe('encode()', () => {

    let audioTypedArrays;
    let encode;

    beforeEach(function (done) {
        encode = createEncode(encodeHeader);

        loadFixtureAsArrayBuffer('1000-frames-of-noise-left.pcm', (err, leftChannelArrayBuffer) => {
            expect(err).to.be.null;

            loadFixtureAsArrayBuffer('1000-frames-of-noise-right.pcm', (rr, rightChannelArrayBuffer) => {
                expect(rr).to.be.null;

                audioTypedArrays = [ split(leftChannelArrayBuffer), split(rightChannelArrayBuffer) ];

                done();
            });
        });
    });

    leche.withData([
        [ '1000-frames-of-noise', 44100, 16 ]
    ], (filename, sampleRate, bitRate) => {

        let fileArrayBufferAsArray;

        beforeEach((done) => {
            loadFixtureAsArrayBuffer(filename + '.wav', (err, fileArrayBuffer) => {
                expect(err).to.be.null;

                fileArrayBufferAsArray = Array.from(new Uint16Array(fileArrayBuffer));

                done();
            });
        });

        it('should encode the arrayBuffer as a wav file', () => {
            const encodeArrayBufferAsArray = Array.from(new Uint16Array(encode(audioTypedArrays, {
                bitRate,
                sampleRate
            })[0]));

            for (let i = 0, length = encodeArrayBufferAsArray.length; i < length; i += 1) {
                expect(encodeArrayBufferAsArray[i]).to.be.closeTo(fileArrayBufferAsArray[i], 1);
            }
        });

    });

});
