import { TTypedArray } from 'worker-factory';
import { TShiftChannelDataArraysFunction } from '../types';

export const shiftChannelDataArrays: TShiftChannelDataArraysFunction = (channelDataArrays, numberOfSamples) => {
    const shiftedChannelDataArrays: TTypedArray[][] = [ ];

    let numberOfShiftedSamples = 0;

    shiftChannelDataArrays: while (numberOfShiftedSamples < numberOfSamples) {
        const length = channelDataArrays.length;

        for (let i = 0; i < length; i += 1) {
            const channelDataArray = channelDataArrays[i];

            if (shiftedChannelDataArrays[i] === undefined) {
                shiftedChannelDataArrays[i] = [ ];
            }

            const channelData = channelDataArray.shift();

            if (channelData === undefined) {
                break shiftChannelDataArrays;
            }

            shiftedChannelDataArrays[i].push(channelData);

            if (i === 0) {
                numberOfShiftedSamples += channelData.length;
            }
        }
    }

    if (numberOfShiftedSamples > numberOfSamples) {
        const unnecessarySamples = numberOfShiftedSamples - numberOfSamples;

        shiftedChannelDataArrays
            .forEach((shiftedChannelDataArray, index) => {
                const channelData = <TTypedArray> shiftedChannelDataArray.pop();
                const offset = channelData.length - unnecessarySamples;

                shiftedChannelDataArray.push(channelData.subarray(0, offset));
                channelDataArrays[index].unshift(channelData.subarray(offset));
            });
    }

    return shiftedChannelDataArrays;
};
