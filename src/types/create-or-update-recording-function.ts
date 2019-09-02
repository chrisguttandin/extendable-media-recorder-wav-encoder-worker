import { TTypedArray } from 'worker-factory';
import { IRecording } from '../interfaces';

export type TCreateOrUpdateRecordingFunction = (recordingId: number, typedArrays: TTypedArray[]) => IRecording;
