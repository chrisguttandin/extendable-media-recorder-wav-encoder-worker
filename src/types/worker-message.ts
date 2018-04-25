import { ICharacterizeResponse, IEncodeResponse, IErrorResponse, IRecordResponse } from '../interfaces';

export type TWorkerMessage = ICharacterizeResponse | IEncodeResponse | IErrorResponse | IRecordResponse;
