import { TypedArray } from '../types/typed-array';

export interface ITypedArrayConstructor {

    new (arrayBuffer: ArrayBuffer): TypedArray;

}
