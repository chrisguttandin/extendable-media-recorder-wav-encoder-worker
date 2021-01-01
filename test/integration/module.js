import { OfflineAudioContext } from 'standardized-audio-context';
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
        let id;
        let offlineAudioContext;
        let recordingId;
        let sampleRate;
        let typedArrayChunks;

        beforeEach(() => {
            id = 49;
            sampleRate = 44100;
            offlineAudioContext = new OfflineAudioContext({ length: 1, sampleRate });
            recordingId = 23;
        });

        beforeEach(async function () {
            this.timeout(6000);

            arrayBuffer = await loadFixtureAsArrayBuffer('1000-frames-of-noise.wav');

            const audioBuffer = await offlineAudioContext.decodeAudioData(arrayBuffer.slice(0));

            typedArrayChunks = [];

            for (let i = 0; i < audioBuffer.numberOfChannels; i += 1) {
                const channelData = audioBuffer.getChannelData(i);

                for (let j = 0; j < channelData.length; j += 100) {
                    if (i === 0) {
                        typedArrayChunks.push([]);
                    }

                    typedArrayChunks[j / 100].push(channelData.slice(j, j + 100));
                }
            }
        });

        beforeEach(function (done) {
            this.timeout(6000);

            const length = typedArrayChunks.length;

            let recordedChunks = 0;

            worker.onmessage = () => {
                recordedChunks += 1;

                if (recordedChunks === length) {
                    worker.onmessage = null;

                    done();
                }
            };

            for (let i = 0; i < length; i += 1) {
                const typedArrays = typedArrayChunks[i];

                worker.postMessage({
                    id: 239 + i,
                    method: 'record',
                    params: { recordingId, sampleRate, typedArrays }
                });
            }
        });

        it('should return an array of the encoded data', function (done) {
            this.timeout(6000);

            worker.onmessage = ({ data }) => {
                worker.onmessage = null;

                expect(data.result[0].byteLength).to.equal(arrayBuffer.byteLength);

                const originalByteArray = new Uint8Array(arrayBuffer);
                const reEncodedByteArray = new Uint8Array(data.result[0]);

                for (let i = 0, length = originalByteArray.length; i < length; i += 1) {
                    expect(reEncodedByteArray[i]).to.be.closeTo(originalByteArray[i], 1);
                }

                expect(data).to.deep.equal({ id, result: data.result });

                done();
            };

            worker.postMessage({
                id,
                method: 'encode',
                params: { recordingId, sampleRate, timeslice: null }
            });
        });

        it('should return an array of the first slice of encoded data', function (done) {
            this.timeout(6000);

            worker.onmessage = ({ data }) => {
                worker.onmessage = null;

                expect(data.result[0].byteLength).to.equal(1808);

                const originalByteArray = new Uint8Array(arrayBuffer);
                const reEncodedByteArray = new Uint8Array(data.result[0]);

                expect(reEncodedByteArray[4]).to.equal(247);
                expect(reEncodedByteArray[5]).to.equal(255);
                expect(reEncodedByteArray[6]).to.equal(255);
                expect(reEncodedByteArray[7]).to.equal(255);

                expect(reEncodedByteArray[40]).to.equal(211);
                expect(reEncodedByteArray[41]).to.equal(255);
                expect(reEncodedByteArray[42]).to.equal(255);
                expect(reEncodedByteArray[43]).to.equal(255);

                for (let i = 0, length = 1808; i < length; i += 1) {
                    if ((i < 4 || i > 7) && (i < 40 || i > 43)) {
                        expect(reEncodedByteArray[i]).to.be.closeTo(originalByteArray[i], 1);
                    }
                }

                expect(data).to.deep.equal({ id, result: data.result });

                done();
            };

            worker.postMessage({
                id,
                method: 'encode',
                params: { recordingId, sampleRate, timeslice: 10 }
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

            worker.postMessage({
                id,
                method: 'record',
                params: { recordingId, typedArrays: [new Float32Array(128), new Float32Array(128)] }
            });
        });
    });
});
