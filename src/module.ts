import { TWorkerImplementation, createWorker } from 'worker-factory';
import { createCreateOrUpdateRecording } from './factories/create-or-update-recording';
import { createEncode } from './factories/encode';
import { computeNumberOfSamples } from './functions/compute-number-of-samples';
import { encodeHeader } from './functions/encode-header';
import { shiftChannelDataArrays } from './functions/shift-channel-data-arrays';
import { IEncodeResponse, IEncoding, IExtendableMediaRecorderWavEncoderWorkerCustomDefinition, IRecording } from './interfaces';

/*
 * @todo Explicitly referencing the barrel file seems to be necessary when enabling the
 * isolatedModules compiler option.
 */
export * from './interfaces/index';
export * from './types/index';

const recordings = new Map<number, IRecording>();
const createOrUpdateRecording = createCreateOrUpdateRecording(recordings);
const encode = createEncode(computeNumberOfSamples, encodeHeader);
const encodings = new Map<number, IEncoding>();

createWorker<IExtendableMediaRecorderWavEncoderWorkerCustomDefinition>(self, <
    TWorkerImplementation<IExtendableMediaRecorderWavEncoderWorkerCustomDefinition>
>{
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
            if (
                recording === undefined ||
                computeNumberOfSamples(recording.channelDataArrays[0]) * (1000 / recording.sampleRate) < timeslice
            ) {
                return new Promise<IEncodeResponse>((resolve, reject) => {
                    encodings.set(recordingId, { reject, resolve, timeslice });
                });
            }

            const shiftedChannelDataArrays = shiftChannelDataArrays(
                recording.channelDataArrays,
                Math.ceil(timeslice * (recording.sampleRate / 1000))
            );
            const arrayBuffers = encode(
                shiftedChannelDataArrays,
                recording.isComplete ? 'initial' : 'subsequent',
                16,
                recording.sampleRate
            );

            recording.isComplete = false;

            return { result: arrayBuffers, transferables: arrayBuffers };
        }

        if (recording !== undefined) {
            const arrayBuffers = encode(
                recording.channelDataArrays,
                recording.isComplete ? 'complete' : 'subsequent',
                16,
                recording.sampleRate
            );

            recordings.delete(recordingId);

            return { result: arrayBuffers, transferables: arrayBuffers };
        }

        return { result: [], transferables: [] };
    },
    record: ({ recordingId, sampleRate, typedArrays }) => {
        const recording = createOrUpdateRecording(recordingId, sampleRate, typedArrays);
        const encoding = encodings.get(recordingId);

        if (encoding !== undefined && computeNumberOfSamples(recording.channelDataArrays[0]) * (1000 / sampleRate) >= encoding.timeslice) {
            const shiftedChannelDataArrays = shiftChannelDataArrays(
                recording.channelDataArrays,
                Math.ceil(encoding.timeslice * (sampleRate / 1000))
            );
            const arrayBuffers = encode(shiftedChannelDataArrays, recording.isComplete ? 'initial' : 'subsequent', 16, sampleRate);

            recording.isComplete = false;
            encodings.delete(recordingId);

            encoding.resolve({ result: arrayBuffers, transferables: arrayBuffers });
        }

        return { result: null };
    }
});
