import { concat } from './helpers/concat';
import { encode } from './helpers/encode';
import { IBrokerEvent, IEncodeResponse, IErrorResponse, IRecordResponse } from './interfaces';
import { TTypedArray } from './types';

export * from './interfaces';
export * from './types';

const recordings: Map<number, TTypedArray[]> = new Map();

addEventListener('message', ({ data }: IBrokerEvent) => {
    try {
        if (data.method === 'encode') {
            const { id, params: { recordingId } } = data;

            const recordedTypedArrays = recordings.get(recordingId);

            const arrayBuffer = encode(recordedTypedArrays);

            recordings.delete(recordingId);

            postMessage(<IEncodeResponse> { error: null, id, result: { arrayBuffer } });
        } else if (data.method === 'record') {
            const { id, params: { recordingId, typedArrays } } = data;

            const recordedTypedArrays = recordings.get(recordingId);

            if (recordedTypedArrays === undefined) {
                recordings.set(recordingId, typedArrays);
            } else {
                recordings.set(
                    recordingId,
                    typedArrays
                        .map((typedArray, index) => {
                            const recordedTypedArray = recordedTypedArrays[index];

                            return concat(Float32Array, recordedTypedArray, typedArray);
                        })
                    );
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
