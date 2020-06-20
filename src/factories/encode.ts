import { TEncodeFactory } from '../types';

export const createEncode: TEncodeFactory = (computeNumberOfSamples, encodeHeader) => {
    return (channelDataArrays, part, bitRate, sampleRate) => {
        const bytesPerSample = bitRate >> 3; // tslint:disable-line:no-bitwise
        const headerSize = part === 'subsequent' ? 0 : 44;
        const numberOfChannels = channelDataArrays.length;
        const numberOfSamples = computeNumberOfSamples(channelDataArrays[0]);
        const arrayBuffer = new ArrayBuffer(numberOfSamples * numberOfChannels * bytesPerSample + headerSize);
        const dataView = new DataView(arrayBuffer);

        if (part !== 'subsequent') {
            encodeHeader(dataView, bitRate, numberOfChannels, part === 'complete' ? numberOfSamples : Number.POSITIVE_INFINITY, sampleRate);
        }

        channelDataArrays.forEach((channel, index) => {
            let offset = headerSize + index * bytesPerSample;

            channel.forEach((channelDataArray) => {
                const length = channelDataArray.length;

                for (let i = 0; i < length; i += 1) {
                    const value = channelDataArray[i];

                    dataView.setInt16(offset, value < 0 ? Math.max(-1, value) * 32768 : Math.min(1, value) * 32767, true);

                    offset += numberOfChannels * bytesPerSample;
                }
            });
        });

        return [arrayBuffer];
    };
};
