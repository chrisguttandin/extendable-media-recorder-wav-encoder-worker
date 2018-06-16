import { TTypedArray, createWorker } from 'worker-factory';
import { encode } from './helpers/encode';
import { IExtendableMediaRecorderWavEncoderWorkerCustomDefinition } from './interfaces';

export * from './interfaces';
export * from './types';

const recordings: Map<number, TTypedArray[][]> = new Map();

createWorker<IExtendableMediaRecorderWavEncoderWorkerCustomDefinition>(self, {
    characterize: ({ }) => {
        return { result: /^audio\/wav$/ };
    },
    encode: ({ recordingId }) => {
        const arrayBuffers = encode(recordings.get(recordingId));

        recordings.delete(recordingId);

        return { result: arrayBuffers, transferables: arrayBuffers };
    },
    record: ({ recordingId, typedArrays }) => {
        const recordedTypedArrays = recordings.get(recordingId);

        if (recordedTypedArrays === undefined) {
            recordings.set(recordingId, [ typedArrays ]);
        } else {
            recordedTypedArrays
                .forEach((channel, index) => channel.push(typedArrays[index]));
        }

        return { result: null };
    }
});
