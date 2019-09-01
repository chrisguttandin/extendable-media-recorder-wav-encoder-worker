import { TTypedArray } from 'worker-factory';

export type TEncodeFunction = (channelDataArrays?: TTypedArray[][], bitRate?: number, sampleRate?: number) => ArrayBuffer[];
