import { TTypedArray } from 'worker-factory';
import { encodeHeader } from '../functions/encode-header';

export const encode = (audioTypedArrays: TTypedArray[][] = [], { bitRate = 16, sampleRate = 44100 } = { }) => {
    const bytesPerSample = bitRate >> 3; // tslint:disable-line:no-bitwise
    const numberOfChannels = audioTypedArrays.length;
    const numberOfSamples = audioTypedArrays[0].reduce((length, channelData) => length + channelData.length, 0);
    const arrayBuffer = new ArrayBuffer((numberOfSamples * numberOfChannels * bytesPerSample) + 44);
    const dataView = new DataView(arrayBuffer);

    encodeHeader(dataView, bitRate, numberOfChannels, numberOfSamples, sampleRate);

    audioTypedArrays
        .forEach((channel, index) => {
            let offset = 44 + (index * bytesPerSample);

            channel
                .forEach((audioTypedArray) => {
                    const length = audioTypedArray.length;

                    for (let i = 0; i < length; i += 1) {
                        const value = audioTypedArray[i];

                        dataView.setUint16(offset, (value < 0) ? Math.max(-1, value) * 32768 : Math.min(1, value) * 32767, true);

                        offset += numberOfChannels * bytesPerSample;
                    }
                });
        });

    return [ arrayBuffer ];
};
