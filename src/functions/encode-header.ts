import { TEncodeHeaderFunction } from '../types';
import { computeMaximumDataChunkSize } from './compute-maximum-data-chunk-size.macro' with { type: 'macro' };
import { textAsUint32 } from './text-as-uint32.macro' with { type: 'macro' };

export const encodeHeader: TEncodeHeaderFunction = (dataView, bitRate, numberOfChannels, numberOfSamples, sampleRate) => {
    const bytesPerSample = bitRate >> 3; // tslint:disable-line:no-bitwise
    const dataChunkSize = Math.min(numberOfSamples * numberOfChannels * bytesPerSample, computeMaximumDataChunkSize(44));

    dataView.setUint32(0, textAsUint32('RIFF'));
    dataView.setUint32(4, dataChunkSize + 36, true);
    dataView.setUint32(8, textAsUint32('WAVE'));
    dataView.setUint32(12, textAsUint32('fmt '));
    dataView.setUint32(16, 16, true);
    dataView.setUint16(20, 1, true);
    dataView.setUint16(22, numberOfChannels, true);
    dataView.setUint32(24, sampleRate, true);
    dataView.setUint32(28, sampleRate * numberOfChannels * bytesPerSample, true);
    dataView.setUint16(32, numberOfChannels * bytesPerSample, true);
    dataView.setUint16(34, bitRate, true);
    dataView.setUint32(36, textAsUint32('data'));
    dataView.setUint32(40, dataChunkSize, true);
};
