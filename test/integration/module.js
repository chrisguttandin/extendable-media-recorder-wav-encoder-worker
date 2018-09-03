import { AudioContext } from 'standardized-audio-context';
import { loadFixtureAsArrayBuffer } from '../helper/load-fixture';

describe('module', () => {

    let worker;

    beforeEach(() => {
        worker = new Worker('base/src/module.js');
    });

    describe('characterize()', () => {

        let id;

        beforeEach(() => {
            id = 49;
        });

        it('should return an regular expression', (done) => {
            worker.addEventListener('message', ({ data }) => {
                expect(data).to.deep.equal({ id, result: /^audio\/wav$/ });

                done();
            });

            worker.postMessage({ id, method: 'characterize' });
        });

    });

    describe('encode()', () => {

        let arrayBuffer;
        let audioContext;
        let id;
        let recordingId;
        let typedArrays;

        afterEach(() => audioContext.close());

        beforeEach(() => {
            audioContext = new AudioContext();
            id = 49;
            recordingId = 23;
        });

        beforeEach(function (done) {
            this.timeout(6000);

            loadFixtureAsArrayBuffer('1000-frames-of-noise.wav', (err, fileArrayBuffer) => {
                expect(err).to.be.null;

                audioContext
                    .decodeAudioData(fileArrayBuffer.slice(0))
                    .then((audioBuffer) => {
                        typedArrays = [];

                        for (let i = 0; i < audioBuffer.numberOfChannels; i += 1) {
                            typedArrays.push(audioBuffer.getChannelData(i));
                        }

                        done();
                    });
            });
        });

        beforeEach(function (done) {
            this.timeout(6000);

            loadFixtureAsArrayBuffer('1000-frames-of-noise-44100-16-stereo.wav', (err, rryBffr) => {
                expect(err).to.be.null;

                arrayBuffer = rryBffr;

                done();
            });
        });

        beforeEach(function (done) {
            this.timeout(6000);

            worker.onmessage = () => {
                worker.onmessage = null;

                done();
            };

            worker.postMessage({
                id: 239,
                method: 'record',
                params: { recordingId, typedArrays }
            });
        });

        it('should return an array of the encoded data', function (done) {
            this.timeout(6000);

            worker.onmessage = ({ data }) => {
                worker.onmessage = null;

                for (let i = 0, length = arrayBuffer.length; i < length; i += 1) {
                    expect(arrayBuffer[i]).to.be.closeTo(data.result[0][i], 1);
                }

                expect(data).to.deep.equal({ id, result: data.result });

                done();
            };

            worker.postMessage({
                id,
                method: 'encode',
                params: { recordingId }
            });
        });

    });

    describe('record()', () => {

        let id;
        let recordingId;

        beforeEach(() => {
            id = 49;
            recordingId = 23;
        });

        it('should accept incoming typedArrays', (done) => {
            worker.addEventListener('message', ({ data }) => {
                expect(data).to.deep.equal({ id, result: null });

                done();
            });

            worker.postMessage({ id, method: 'record', params: { recordingId, typedArrays: [ new Float32Array(128), new Float32Array(128) ] } });
        });

    });

});
