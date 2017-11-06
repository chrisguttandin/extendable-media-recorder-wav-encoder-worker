import { ITypedArrayConstructor } from '../interfaces';
import { TTypedArray } from '../types';

export const concat = (TypedArray: ITypedArrayConstructor, ...typedArrays: TTypedArray[]) => { // tslint:disable-line:variable-name
    const tmp = new Uint8Array(typedArrays.reduce((byteLength, typedArray) => byteLength + typedArray.byteLength, 0));

    typedArrays
        .reduce((offset, typedArray) => {
            tmp.set(new Uint8Array(typedArray.buffer), offset);

            return offset + typedArray.byteLength;
        }, 0);

    return new TypedArray(<ArrayBuffer> tmp.buffer);
};

export default concat;
