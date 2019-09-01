import { TEncodeFactory } from '../types';

export const createEncode: TEncodeFactory = (computeNumberOfSamples, encodeHeader) => {
    return (channelDataArrays = [], bitRate = 16, sampleRate = 44100) => {
        const bytesPerSample = bitRate >> 3; // tslint:disable-line:no-bitwise
        const numberOfChannels = channelDataArrays.length;
        const numberOfSamples = computeNumberOfSamples(channelDataArrays[0]);
        const arrayBuffer = new ArrayBuffer((numberOfSamples * numberOfChannels * bytesPerSample) + 44);
        const dataView = new DataView(arrayBuffer);

        encodeHeader(dataView, bitRate, numberOfChannels, numberOfSamples, sampleRate);

        channelDataArrays
            .forEach((channel, index) => {
                let offset = 44 + (index * bytesPerSample);

                channel
                    .forEach((channelDataArray) => {
                        const length = channelDataArray.length;

                        for (let i = 0; i < length; i += 1) {
                            const value = channelDataArray[i];

                            dataView.setUint16(offset, (value < 0) ? Math.max(-1, value) * 32768 : Math.min(1, value) * 32767, true);

                            offset += numberOfChannels * bytesPerSample;
                        }
                    });
            });

        return [ arrayBuffer ];
    };
};
