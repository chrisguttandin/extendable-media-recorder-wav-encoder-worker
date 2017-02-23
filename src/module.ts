import { concat } from './helpers/concat';
import { encode } from './helpers/encode';
import { TypedArray } from './types/typed-array';

const recordedTypedArrays: TypedArray[] = [];

addEventListener('message', ({ data: { done = false, typedArrays = [] } }) => {
    if (recordedTypedArrays.length === 0) {
        typedArrays
            .forEach((typedArray) => recordedTypedArrays.push(typedArray));
    } else {
        typedArrays
            .forEach((typedArray, index) => {
                const recordedTypedArray = recordedTypedArrays[index];

                recordedTypedArrays[index] = concat(Float32Array, recordedTypedArray, typedArray);
            });
    }

    if (done) {
        postMessage({
            arrayBuffer: encode(recordedTypedArrays)
        });
        recordedTypedArrays.length = 0;
    }
});
