import { TCreateOrUpdateRecordingFactory } from '../types';

export const createCreateOrUpdateRecording: TCreateOrUpdateRecordingFactory = (recordings) => {
    return (recordingId, sampleRate, typedArrays) => {
        const recording = recordings.get(recordingId);

        if (recording === undefined) {
            const newRecording = {
                channelDataArrays: typedArrays.map((typedArray) => [ typedArray ]),
                isComplete: true,
                sampleRate
            };

            recordings.set(recordingId, newRecording);

            return newRecording;
        }

        // @todo Check if the given sampleRate is the same as the one of the recording.

        recording.channelDataArrays
            .forEach((channelDataArray, index) => channelDataArray.push(typedArrays[index]));

        return recording;
    };
};
