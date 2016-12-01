export const encode = (audioTypedArrays, { bitRate = 16, sampleRate = 44100 } = {}) => {
    const bytesPerSample = bitRate >> 3; // tslint:disable-line:no-bitwise

    const numberOfChannels = audioTypedArrays.length;

    const numberOfSamples = audioTypedArrays[0].length;

    const arrayBuffer = new ArrayBuffer((numberOfSamples * numberOfChannels * bytesPerSample) + 44);

    const dataView = new DataView(arrayBuffer);

    dataView.setUint8(0, 'R'.charCodeAt(0));
    dataView.setUint8(1, 'I'.charCodeAt(0));
    dataView.setUint8(2, 'F'.charCodeAt(0));
    dataView.setUint8(3, 'F'.charCodeAt(0));
    dataView.setUint32(4, arrayBuffer.byteLength - 8, true);
    dataView.setUint8(8, 'W'.charCodeAt(0));
    dataView.setUint8(9, 'A'.charCodeAt(0));
    dataView.setUint8(10, 'V'.charCodeAt(0));
    dataView.setUint8(11, 'E'.charCodeAt(0));
    dataView.setUint8(12, 'f'.charCodeAt(0));
    dataView.setUint8(13, 'm'.charCodeAt(0));
    dataView.setUint8(14, 't'.charCodeAt(0));
    dataView.setUint8(15, ' '.charCodeAt(0));
    dataView.setUint32(16, 16, true);
    dataView.setUint16(20, 1, true);
    dataView.setUint16(22, numberOfChannels, true);
    dataView.setUint32(24, sampleRate, true);
    dataView.setUint32(28, sampleRate * numberOfChannels * bytesPerSample, true);
    dataView.setUint16(32, numberOfChannels * bytesPerSample, true);
    dataView.setUint16(34, bitRate, true);
    dataView.setUint8(36, 'd'.charCodeAt(0));
    dataView.setUint8(37, 'a'.charCodeAt(0));
    dataView.setUint8(38, 't'.charCodeAt(0));
    dataView.setUint8(39, 'a'.charCodeAt(0));
    dataView.setUint32(40, arrayBuffer.byteLength - 44, true);

    audioTypedArrays
        .forEach((audioTypedArray, index) => {
            const offset = 44 + (index * bytesPerSample);

            for (let i = 0, length = numberOfSamples; i < length; i += 1) {
                const position = offset + (i * numberOfChannels * bytesPerSample);

                const value = Math.max(-1, Math.min(audioTypedArray[i], 1));

                dataView.setUint16(position, (value < 0) ? value * 32768 : value * 32767, true);
            }
        });

    return arrayBuffer;
};
