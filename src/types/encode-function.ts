import { TTypedArray } from 'worker-factory';

export type TEncodeFunction = (
    channelDataArrays: TTypedArray[][],
    part: 'complete' | 'initial' | 'subsequent',
    bitRate?: number,
    sampleRate?: number
) => ArrayBuffer[];
