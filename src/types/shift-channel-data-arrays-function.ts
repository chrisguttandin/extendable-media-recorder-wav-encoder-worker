import { TTypedArray } from 'worker-factory';

export type TShiftChannelDataArraysFunction = (channelDataArrays: TTypedArray[][], numberOfSamples: number) => TTypedArray[][];
