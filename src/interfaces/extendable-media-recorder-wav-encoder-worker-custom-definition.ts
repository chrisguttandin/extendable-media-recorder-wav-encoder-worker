import { IWorkerDefinition, TTypedArray } from 'worker-factory';
import { IEncodeResponse } from './encode-response';

export interface IExtendableMediaRecorderWavEncoderWorkerCustomDefinition extends IWorkerDefinition {

    characterize: {

        params: undefined;

        response: {

            result: RegExp;

        };

    };

    encode: {

        params: {

            recordingId: number;

            timeslice: null | number;

        };

        response: IEncodeResponse;

    };

    record: {

        params: {

            recordingId: number;

            typedArrays: TTypedArray[];

        };

        response: {

            result: null;

        };

        transferables: ArrayBuffer[];

    };

}
