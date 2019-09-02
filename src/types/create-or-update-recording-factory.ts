import { IRecording } from '../interfaces';
import { TCreateOrUpdateRecordingFunction } from './create-or-update-recording-function';

export type TCreateOrUpdateRecordingFactory = (recordings: Map<number, IRecording>) => TCreateOrUpdateRecordingFunction;
