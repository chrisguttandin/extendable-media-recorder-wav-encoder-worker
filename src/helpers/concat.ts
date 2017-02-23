import { ITypedArrayConstructor } from '../interfaces/typed-array';
import { TypedArray } from '../types/typed-array';

export const concat = (TypedArray: ITypedArrayConstructor, ...typedArrays: TypedArray[]) => { // tslint:disable-line:variable-name
    const tmp = new Uint8Array(typedArrays.reduce((byteLength, typedArray) => byteLength + typedArray.byteLength, 0));

    typedArrays
        .reduce((offset, typedArray) => {
            tmp.set(new Uint8Array(typedArray.buffer), offset);

            return offset + typedArray.byteLength;
        }, 0);

    return new TypedArray(tmp.buffer);
};

export default concat;
