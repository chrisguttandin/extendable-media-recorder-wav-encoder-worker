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

        let audioContext;
        let id;
        let originalArrayBuffer;
        let recordingId;
        let typedArrayChunks;

        afterEach(() => audioContext.close());

        beforeEach(() => {
            audioContext = new AudioContext();
            id = 49;
            recordingId = 23;
        });

        beforeEach(function (done) {
            this.timeout(6000);

            loadFixtureAsArrayBuffer('1000-frames-of-noise.wav', (err, arrayBuffer) => {
                expect(err).to.be.null;

                originalArrayBuffer = arrayBuffer;

                audioContext
                    .decodeAudioData(arrayBuffer.slice(0))
                    .then((audioBuffer) => {
                        typedArrayChunks = [ ];

                        for (let i = 0; i < audioBuffer.numberOfChannels; i += 1) {
                            const channelData = audioBuffer.getChannelData(i);

                            // @todo For some reason Chrome nullifies the last sample of the left channel.
                            if (i === 0 && channelData[999] === 0) {
                                channelData[999] = audioBuffer.getChannelData(1)[999];
                            }

                            for (let j = 0; j < channelData.length; j += 100) {
                                if (i === 0) {
                                    typedArrayChunks.push([ ]);
                                }

                                typedArrayChunks[j / 100].push(channelData.slice(j, j + 100));
                            }
                        }

                        done();
                    });
            });
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
                    params: { recordingId, typedArrays }
                });
            }
        });

        it('should return an array of the encoded data', function (done) {
            this.timeout(6000);

            worker.onmessage = ({ data }) => {
                worker.onmessage = null;

                expect(data.result[0].byteLength).to.equal(originalArrayBuffer.byteLength);

                const originalByteArray = new Uint8Array(originalArrayBuffer);
                const reEncodedByteArray = new Uint8Array(data.result[0]);

                for (let i = 0, length = originalByteArray.length; i < length; i += 1) {
                    expect(originalByteArray[i]).to.be.closeTo(reEncodedByteArray[i], 1);
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
