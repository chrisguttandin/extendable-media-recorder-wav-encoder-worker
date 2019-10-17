import { TTypedArray } from 'worker-factory';
import { IRecording } from '../interfaces';

export type TCreateOrUpdateRecordingFunction = (recordingId: number, sampleRate: number, typedArrays: TTypedArray[]) => IRecording;
