import { TTypedArray } from 'worker-factory';

export interface IRecording {

    channelDataArrays: TTypedArray[][];

    isComplete: boolean;

    sampleRate: number;

}
