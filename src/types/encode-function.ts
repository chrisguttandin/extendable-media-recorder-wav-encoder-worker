import { TTypedArray } from 'worker-factory';

export type TEncodeFunction = (
    audioTypedArrays?: TTypedArray[][],
    options?: Partial<{ bitRate: number; sampleRate: number }>
) => ArrayBuffer[];
