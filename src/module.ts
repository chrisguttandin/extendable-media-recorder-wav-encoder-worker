import { concat } from './helpers/concat';
import { encode } from './helpers/encode';

const recordedTypedArrays = [];

self.addEventListener('message', ({ data: { done = false, typedArrays = [] } }) => {
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
        self.postMessage({
            arrayBuffer: encode(recordedTypedArrays)
        });
        recordedTypedArrays.length = 0;
    }
});
