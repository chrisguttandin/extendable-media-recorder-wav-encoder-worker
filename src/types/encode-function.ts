import { TTypedArray } from 'worker-factory';

export type TEncodeFunction = (audioTypedArrays?: TTypedArray[][], bitRate?: number, sampleRate?: number) => ArrayBuffer[];
