import { TComputeNumberOfSamplesFunction } from './compute-number-of-samples-function';
import { TEncodeFunction } from './encode-function';
import { TEncodeHeaderFunction } from './encode-header-function';

export type TEncodeFactory = (
    computeNumberOfSamples: TComputeNumberOfSamplesFunction,
    encodeHeader: TEncodeHeaderFunction
) => TEncodeFunction;
