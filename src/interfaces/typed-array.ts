import { TypedArray } from '../types';

export interface ITypedArrayConstructor {

    new (arrayBuffer: ArrayBuffer): TypedArray;

}
