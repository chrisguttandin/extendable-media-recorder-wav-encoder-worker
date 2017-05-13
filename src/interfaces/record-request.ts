import { TTypedArray } from '../types';

export interface IRecordRequest {

    id: number;

    method: 'record';

    params: {

        recordingId: number;

        typedArrays: TTypedArray[];

    };

}
