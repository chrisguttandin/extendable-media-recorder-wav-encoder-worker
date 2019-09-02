import { IEncodeResponse } from './encode-response';

export interface IEncoding {

    timeslice: number;

    reject (reason?: any): void;

    resolve (value?: IEncodeResponse | PromiseLike<IEncodeResponse>): void;

}
