import { createCreateOrUpdateRecording } from '../../../src/factories/create-or-update-recording';

describe('createOrUpdateRecording()', () => {

    let createOrUpdateRecording;
    let recordings;

    beforeEach(() => {
        recordings = new Map();
        createOrUpdateRecording = createCreateOrUpdateRecording(recordings);
    });

    describe('without an existing recording', () => {

        let recordingId;
        let sampleRate;
        let typedArrays;

        beforeEach(() => {
            recordingId = Math.round(Math.random() * 1000);
            sampleRate = 48000;
            typedArrays = [ new Float32Array(12), new Float32Array(12) ];
        });

        it('should create a new recording', () => {
            createOrUpdateRecording(recordingId, sampleRate, typedArrays);

            expect(recordings.size).to.equal(1);

            const recording = recordings.get(recordingId);

            expect(recording.channelDataArrays.length).to.equal(2);

            expect(recording.channelDataArrays[0].length).to.equal(1);
            expect(recording.channelDataArrays[0][0]).to.equal(typedArrays[0]);

            expect(recording.channelDataArrays[1].length).to.equal(1);
            expect(recording.channelDataArrays[1][0]).to.equal(typedArrays[1]);

            expect(recording.isComplete).to.be.true;

            expect(recording.sampleRate).to.equal(48000);
        });

        it('should return a new recording', () => {
            const recording = createOrUpdateRecording(recordingId, sampleRate, typedArrays);

            expect(recording.channelDataArrays.length).to.equal(2);

            expect(recording.channelDataArrays[0].length).to.equal(1);
            expect(recording.channelDataArrays[0][0]).to.equal(typedArrays[0]);

            expect(recording.channelDataArrays[1].length).to.equal(1);
            expect(recording.channelDataArrays[1][0]).to.equal(typedArrays[1]);

            expect(recording.isComplete).to.be.true;

            expect(recording.sampleRate).to.equal(48000);
        });

    });

    describe('with an existing recording', () => {

        let recordingId;
        let sampleRate;
        let typedArrays;

        beforeEach(() => {
            recordingId = Math.round(Math.random() * 1000);
            sampleRate = 48000;
            typedArrays = [ new Float32Array(12), new Float32Array(12) ];

            recordings.set(recordingId, { channelDataArrays: [ [ new Float32Array(8) ], [ new Float32Array(8) ] ], isComplete: false, sampleRate });
        });

        it('should update the existing recording', () => {
            createOrUpdateRecording(recordingId, sampleRate, typedArrays);

            expect(recordings.size).to.equal(1);

            const recording = recordings.get(recordingId);

            expect(recording.channelDataArrays.length).to.equal(2);

            expect(recording.channelDataArrays[0].length).to.equal(2);
            expect(recording.channelDataArrays[0][1]).to.equal(typedArrays[0]);

            expect(recording.channelDataArrays[1].length).to.equal(2);
            expect(recording.channelDataArrays[1][1]).to.equal(typedArrays[1]);

            expect(recording.isComplete).to.be.false;

            expect(recording.sampleRate).to.equal(48000);
        });

        it('should return the updated recording', () => {
            const recording = createOrUpdateRecording(recordingId, sampleRate, typedArrays);

            expect(recording.channelDataArrays.length).to.equal(2);

            expect(recording.channelDataArrays[0].length).to.equal(2);
            expect(recording.channelDataArrays[0][1]).to.equal(typedArrays[0]);

            expect(recording.channelDataArrays[1].length).to.equal(2);
            expect(recording.channelDataArrays[1][1]).to.equal(typedArrays[1]);

            expect(recording.isComplete).to.be.false;

            expect(recording.sampleRate).to.equal(48000);
        });

    });

});
