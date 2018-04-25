import { TTypedArray } from '../types';

export const encode = (audioTypedArrays: TTypedArray[][] = [], { bitRate = 16, sampleRate = 44100 } = {}) => {
    const bytesPerSample = bitRate >> 3; // tslint:disable-line:no-bitwise

    const numberOfChannels = audioTypedArrays.length;

    const numberOfSamples = audioTypedArrays[0].reduce((length, channelData) => length + channelData.length, 0);

    const arrayBuffer = new ArrayBuffer((numberOfSamples * numberOfChannels * bytesPerSample) + 44);

    const dataView = new DataView(arrayBuffer);

    dataView.setUint32(0, 1380533830); // That's the integer representation of 'RIFF'.
    dataView.setUint32(4, arrayBuffer.byteLength - 8, true);
    dataView.setUint32(8, 1463899717); // That's the integer representation of 'WAVE'.
    dataView.setUint32(12, 1718449184); // That's the integer representation of 'fmt '.
    dataView.setUint32(16, 16, true);
    dataView.setUint16(20, 1, true);
    dataView.setUint16(22, numberOfChannels, true);
    dataView.setUint32(24, sampleRate, true);
    dataView.setUint32(28, sampleRate * numberOfChannels * bytesPerSample, true);
    dataView.setUint16(32, numberOfChannels * bytesPerSample, true);
    dataView.setUint16(34, bitRate, true);
    dataView.setUint32(36, 1684108385); // That's the integer representation of 'data'.
    dataView.setUint32(40, arrayBuffer.byteLength - 44, true);

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
