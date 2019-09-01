import { TComputeNumberOfSamplesFunction } from '../types';

export const computeNumberOfSamples: TComputeNumberOfSamplesFunction = (channelDataArray) => {
    return channelDataArray.reduce((length, channelData) => length + channelData.length, 0);
};
