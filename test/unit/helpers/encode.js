import { AudioContext } from 'standardized-audio-context';
import { encode } from '../../../src/helpers/encode';
import { loadFixtureAsArrayBuffer } from '../../helper/load-fixture';

describe('encode()', () => {

    let audioContext;

    let audioTypedArrays;

    before(() => {
        audioContext = new AudioContext();
    });

    beforeEach((done) => {
        loadFixtureAsArrayBuffer('1000-frames-of-noise.wav', (err, fileArrayBuffer) => {
            expect(err).to.be.null;

            audioContext
                .decodeAudioData(fileArrayBuffer.slice(0))
                .then((audioBuffer) => {
                    audioTypedArrays = [];

                    for (let i = 0; i < audioBuffer.numberOfChannels; i += 1) {
                        audioTypedArrays.push(audioBuffer.getChannelData(i));
                    }

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

                fileArrayBufferAsArray = Array.from(new Uint8Array(fileArrayBuffer));

                done();
            });
        });

        it('should encode the arrayBuffer as a wav file', () => {
            const encodeArrayBufferAsArray = Array.from(new Uint8Array(encode(audioTypedArrays, {
                bitRate,
                sampleRate
            })));

            for (let i = 0, length = encodeArrayBufferAsArray.length; i < length; i += 1) {
                expect(encodeArrayBufferAsArray[i]).to.be.closeTo(fileArrayBufferAsArray[i], 1);
            }
        });

    });

});
