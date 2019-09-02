import { TCreateOrUpdateRecordingFactory } from '../types';

export const createCreateOrUpdateRecording: TCreateOrUpdateRecordingFactory = (recordings) => {
    return (recordingId, typedArrays) => {
        const recording = recordings.get(recordingId);

        if (recording === undefined) {
            const newRecording = {
                channelDataArrays: typedArrays.map((typedArray) => [ typedArray ]),
                isComplete: true
            };

            recordings.set(recordingId, newRecording);

            return newRecording;
        }

        recording.channelDataArrays
            .forEach((channelDataArray, index) => channelDataArray.push(typedArrays[index]));

        return recording;
    };
};
