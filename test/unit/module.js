import { AudioContext } from 'standardized-audio-context';
import { loadFixtureAsArrayBuffer } from '../helper/load-fixture';

describe('module', () => {

    let audioContext;

    let audioTypedArrays;

    let encodedFileArrayBuffer;

    let worker;

    beforeEach(() => {
        audioContext = new AudioContext();

        worker = new Worker('base/src/module.ts');
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

    beforeEach((done) => {
        loadFixtureAsArrayBuffer('1000-frames-of-noise-44100-16-stereo.wav', (err, fileArrayBuffer) => {
            expect(err).to.be.null;

            encodedFileArrayBuffer = fileArrayBuffer;

            done();
        });
    });

    it('should encode a wav file', function (done) {
        this.timeout(6000);

        worker.addEventListener('message', ({ data: { arrayBuffer } }) => {
            for (let i = 0, length = encodedFileArrayBuffer.length; i < length; i += 1) {
                expect(encodedFileArrayBuffer[i]).to.be.closeTo(arrayBuffer[i], 1);
            }

            done();
        });

        worker.postMessage({
            done: true,
            typedArrays: audioTypedArrays
        });

    });

});
