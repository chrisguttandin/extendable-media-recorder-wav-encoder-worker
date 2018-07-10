import { IWorkerDefinition, TTypedArray } from 'worker-factory';

export interface IExtendableMediaRecorderWavEncoderWorkerCustomDefinition extends IWorkerDefinition {

    characterize: {

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
