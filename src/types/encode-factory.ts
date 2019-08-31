import { TEncodeFunction } from './encode-function';
import { TEncodeHeaderFunction } from './encode-header-function';

export type TEncodeFactory = (encodeHeader: TEncodeHeaderFunction) => TEncodeFunction;
