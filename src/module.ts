import { encode } from './helpers/encode';
import { IBrokerEvent, ICharacterizeResponse, IEncodeResponse, IErrorResponse, IRecordResponse } from './interfaces';
import { TTypedArray } from './types';

export * from './interfaces';
export * from './types';

const recordings: Map<number, TTypedArray[][]> = new Map();

addEventListener('message', ({ data }: IBrokerEvent) => {
    try {
        if (data.method === 'characterize') {
            const { id } = data;

            postMessage(<ICharacterizeResponse> { error: null, id, result: { regex: /^audio\/wav$/ } });
        } else if (data.method === 'encode') {
            const { id, params: { recordingId } } = data;

            const recordedTypedArrays = recordings.get(recordingId);

            const arrayBuffers = encode(recordedTypedArrays);

            recordings.delete(recordingId);

            postMessage(<IEncodeResponse> { error: null, id, result: { arrayBuffers } }, arrayBuffers);
        } else if (data.method === 'record') {
            const { id, params: { recordingId, typedArrays } } = data;

            const recordedTypedArrays = recordings.get(recordingId);

            if (recordedTypedArrays === undefined) {
                recordings.set(recordingId, [ typedArrays ]);
            } else {
                recordedTypedArrays
                    .forEach((channel, index) => channel.push(typedArrays[index]));
            }

            postMessage(<IRecordResponse> { error: null, id, result: null });
        } else {
            throw new Error(`The given method "${ (<any> data).method }" is not supported`);
        }
    } catch (err) {
        postMessage(<IErrorResponse> {
            error: {
                message: err.message
            },
            id: data.id,
            result: null
        });
    }
});
