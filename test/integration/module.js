import { AudioContext } from 'standardized-audio-context';
import { loadFixtureAsArrayBuffer } from '../helper/load-fixture';

describe('module', () => {

    let arrayBuffer;
    let audioContext;
    let encodeRequestId;
    let recordRequestId;
    let recordingId;
    let typedArrays;
    let worker;


    beforeEach(() => {
        audioContext = new AudioContext();

        encodeRequestId = 1293;
        recordRequestId = 2731;

        recordingId = 1022;

        worker = new Worker('base/src/module.ts');
    });

    beforeEach((done) => {
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

    beforeEach((done) => {
        loadFixtureAsArrayBuffer('1000-frames-of-noise-44100-16-stereo.wav', (err, rryBffr) => {
            expect(err).to.be.null;

            arrayBuffer = rryBffr;

            done();
        });
    });

    it('should encode a wav file', function (done) {
        this.timeout(6000);

        let receivedEncodeResponse = false;
        let receivedRecordResponse = false;

        worker.addEventListener('message', ({ data }) => {
            if (data.id === encodeRequestId && !receivedEncodeResponse) {
                receivedEncodeResponse = true;

                expect(data).to.deep.equal({
                    error: null,
                    id: encodeRequestId,
                    result: null
                });

                worker.postMessage({
                    id: recordRequestId,
                    method: 'encode',
                    params: { recordingId }
                });
            } else if (data.id === recordRequestId && !receivedRecordResponse) {
                receivedRecordResponse = true;

                for (let i = 0, length = arrayBuffer.length; i < length; i += 1) {
                    expect(arrayBuffer[i]).to.be.closeTo(data.result.arrayBuffer[i], 1);
                }

                expect(data).to.deep.equal({
                    error: null,
                    id: recordRequestId,
                    result: { arrayBuffer: data.result.arrayBuffer }
                });

                done();
            } else {
                done(new Error('This should never happen.'));
            }
        });

        worker.postMessage({
            id: encodeRequestId,
            method: 'record',
            params: { recordingId, typedArrays }
        });

    });

});
