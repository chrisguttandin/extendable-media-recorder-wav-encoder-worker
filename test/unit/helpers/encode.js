import { encode } from '../../../src/helpers/encode';
import { loadFixtureAsArrayBuffer } from '../../helper/load-fixture';

describe('encode()', () => {

    let audioTypedArrays;

    beforeEach(function (done) {
        loadFixtureAsArrayBuffer('1000-frames-of-noise-left.pcm', (err, leftChannelArrayBuffer) => {
            expect(err).to.be.null;

            loadFixtureAsArrayBuffer('1000-frames-of-noise-right.pcm', (err, rightChannelArrayBuffer) => {
                expect(err).to.be.null;

                audioTypedArrays = [
                    new Float32Array(leftChannelArrayBuffer),
                    new Float32Array(rightChannelArrayBuffer)
                ];

                done();
            });
        });
    });

    leche.withData([ // eslint-disable-line no-undef
        [ '1000-frames-of-noise-44100-16-stereo', 44100, 16 ]
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
            })));

            for (let i = 0, length = encodeArrayBufferAsArray.length; i < length; i += 1) {
                expect(encodeArrayBufferAsArray[i]).to.be.closeTo(fileArrayBufferAsArray[i], 1);
            }
        });

    });

});
