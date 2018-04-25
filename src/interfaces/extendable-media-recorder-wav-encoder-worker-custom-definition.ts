import { IWorkerDefinition } from 'worker-factory';
import { TTypedArray } from '../types';

export interface IExtendableMediaRecorderWavEncoderWorkerCustomDefinition extends IWorkerDefinition {

    characterize: {

        params: {

            // @todo Allow to specify a Request without a parameter.

        };

        response: {

            result: RegExp;

        };

    };

    encode: {

        params: {

            recordingId: number;

        };

        response: {

            result: ArrayBuffer[];

            transferables: ArrayBuffer[];

        };

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
