import { IEncodeResponse, IErrorResponse, IRecordResponse } from '../interfaces';

export type TWorkerMessage = IEncodeResponse | IErrorResponse | IRecordResponse;
