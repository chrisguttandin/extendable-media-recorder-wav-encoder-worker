import { TTypedArray } from '../types';

export interface ITypedArrayConstructor {

    new (arrayBuffer: ArrayBuffer): TTypedArray;

}
