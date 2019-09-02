import { TWorkerImplementation, createWorker } from 'worker-factory';
import { createCreateOrUpdateRecording } from './factories/create-or-update-recording';
import { createEncode } from './factories/encode';
import { computeNumberOfSamples } from './functions/compute-number-of-samples';
import { encodeHeader } from './functions/encode-header';
import { shiftChannelDataArrays } from './functions/shift-channel-data-arrays';
import { IEncodeResponse, IEncoding, IExtendableMediaRecorderWavEncoderWorkerCustomDefinition, IRecording } from './interfaces';

export * from './interfaces';
export * from './types';

const recordings = new Map<number, IRecording>();
const createOrUpdateRecording = createCreateOrUpdateRecording(recordings);
const encode = createEncode(computeNumberOfSamples, encodeHeader);
const encodings = new Map<number, IEncoding>();

createWorker<IExtendableMediaRecorderWavEncoderWorkerCustomDefinition>(
    self,
    <TWorkerImplementation<IExtendableMediaRecorderWavEncoderWorkerCustomDefinition>> {
        characterize: () => {
            return { result: /^audio\/wav$/ };
        },
        encode: ({ recordingId, timeslice }) => {
            const encoding = encodings.get(recordingId);

            if (encoding !== undefined) {
                encodings.delete(recordingId);

                encoding.reject(new Error('Another request was made to initiate an encoding.'));
            }

            const recording = recordings.get(recordingId);

            if (timeslice !== null) {
                // @todo Allow sampleRate to be configured.
                if (recording === undefined || (computeNumberOfSamples(recording.channelDataArrays[0]) / 44.1) < timeslice) {
                    return new Promise<IEncodeResponse>((resolve, reject) => {
                        encodings.set(recordingId, { reject, resolve, timeslice });
                    });
                }

                const shiftedChannelDataArrays = shiftChannelDataArrays(recording.channelDataArrays, Math.ceil(timeslice * 44.1));
                const arrayBuffers = encode(shiftedChannelDataArrays, recording.isComplete ? 'initial' : 'subsequent');

                recording.isComplete = false;

                return { result: arrayBuffers, transferables: arrayBuffers };
            }

            if (recording !== undefined) {
                const arrayBuffers = encode(recording.channelDataArrays, recording.isComplete ? 'complete' : 'subsequent');

                recordings.delete(recordingId);

                return { result: arrayBuffers, transferables: arrayBuffers };
            }

            return { result: [ ], transferables: [ ] };
        },
        record: ({ recordingId, typedArrays }) => {
            const recording = createOrUpdateRecording(recordingId, typedArrays);
            const encoding = encodings.get(recordingId);

            // @todo Allow sampleRate to be configured.
            if (encoding !== undefined && (computeNumberOfSamples(recording.channelDataArrays[0]) / 44.1) >= encoding.timeslice) {
                const shiftedChannelDataArrays = shiftChannelDataArrays(recording.channelDataArrays, Math.ceil(encoding.timeslice * 44.1));
                const arrayBuffers = encode(shiftedChannelDataArrays, recording.isComplete ? 'initial' : 'subsequent');

                recording.isComplete = false;
                encodings.delete(recordingId);

                encoding.resolve({ result: arrayBuffers, transferables: arrayBuffers });
            }

            return { result: null };
        }
    }
);
