import { TTypedArray, TWorkerImplementation, createWorker } from 'worker-factory';
import { createEncode } from './factories/encode';
import { encodeHeader } from './functions/encode-header';
import { IExtendableMediaRecorderWavEncoderWorkerCustomDefinition } from './interfaces';

export * from './interfaces';
export * from './types';

const encode = createEncode(encodeHeader);
const recordings: Map<number, TTypedArray[][]> = new Map();

createWorker<IExtendableMediaRecorderWavEncoderWorkerCustomDefinition>(
    self,
    <TWorkerImplementation<IExtendableMediaRecorderWavEncoderWorkerCustomDefinition>> {
        characterize: () => {
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
                recordings.set(recordingId, typedArrays.map((typedArray) => [ typedArray ]));
            } else {
                recordedTypedArrays
                    .forEach((channel, index) => channel.push(typedArrays[index]));
            }

            return { result: null };
        }
    }
);
