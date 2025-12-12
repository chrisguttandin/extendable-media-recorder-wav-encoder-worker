import { beforeEach, describe, expect, it } from 'vitest';
import { shiftChannelDataArrays } from '../../../src/functions/shift-channel-data-arrays';

describe('shiftChannelDataArrays()', () => {
    let channelDataArrays;

    beforeEach(() => {
        channelDataArrays = [
            [new Float32Array(18), new Float32Array(4), new Float32Array(16), new Float32Array(12)],
            [new Float32Array(18), new Float32Array(4), new Float32Array(16), new Float32Array(12)]
        ];
    });

    it('should shift the first channelData in each array', () => {
        const shiftedChannelDataArrays = shiftChannelDataArrays(channelDataArrays, 18);

        expect(shiftedChannelDataArrays.length).to.equal(2);

        expect(shiftedChannelDataArrays[0].length).to.equal(1);
        expect(shiftedChannelDataArrays[0][0].length).to.equal(18);

        expect(shiftedChannelDataArrays[1].length).to.equal(1);
        expect(shiftedChannelDataArrays[1][0].length).to.equal(18);

        expect(channelDataArrays.length).to.equal(2);

        expect(channelDataArrays[0].length).to.equal(3);
        expect(channelDataArrays[0][0].length).to.equal(4);
        expect(channelDataArrays[0][1].length).to.equal(16);
        expect(channelDataArrays[0][2].length).to.equal(12);

        expect(channelDataArrays[1].length).to.equal(3);
        expect(channelDataArrays[1][0].length).to.equal(4);
        expect(channelDataArrays[1][1].length).to.equal(16);
        expect(channelDataArrays[1][2].length).to.equal(12);
    });

    it('should shift the first and a part of the second channelData in each array', () => {
        const shiftedChannelDataArrays = shiftChannelDataArrays(channelDataArrays, 20);

        expect(shiftedChannelDataArrays.length).to.equal(2);

        expect(shiftedChannelDataArrays[0].length).to.equal(2);
        expect(shiftedChannelDataArrays[0][0].length).to.equal(18);
        expect(shiftedChannelDataArrays[0][1].length).to.equal(2);

        expect(shiftedChannelDataArrays[1].length).to.equal(2);
        expect(shiftedChannelDataArrays[1][0].length).to.equal(18);
        expect(shiftedChannelDataArrays[1][1].length).to.equal(2);

        expect(channelDataArrays.length).to.equal(2);

        expect(channelDataArrays[0].length).to.equal(3);
        expect(channelDataArrays[0][0].length).to.equal(2);
        expect(channelDataArrays[0][1].length).to.equal(16);
        expect(channelDataArrays[0][2].length).to.equal(12);

        expect(channelDataArrays[1].length).to.equal(3);
        expect(channelDataArrays[1][0].length).to.equal(2);
        expect(channelDataArrays[1][1].length).to.equal(16);
        expect(channelDataArrays[1][2].length).to.equal(12);
    });

    it('should shift every channelData in each array', () => {
        const shiftedChannelDataArrays = shiftChannelDataArrays(channelDataArrays, 52);

        expect(shiftedChannelDataArrays.length).to.equal(2);

        expect(shiftedChannelDataArrays[0].length).to.equal(4);
        expect(shiftedChannelDataArrays[0][0].length).to.equal(18);
        expect(shiftedChannelDataArrays[0][1].length).to.equal(4);
        expect(shiftedChannelDataArrays[0][2].length).to.equal(16);
        expect(shiftedChannelDataArrays[0][3].length).to.equal(12);

        expect(shiftedChannelDataArrays[1].length).to.equal(4);
        expect(shiftedChannelDataArrays[1][0].length).to.equal(18);
        expect(shiftedChannelDataArrays[1][1].length).to.equal(4);
        expect(shiftedChannelDataArrays[1][2].length).to.equal(16);
        expect(shiftedChannelDataArrays[1][3].length).to.equal(12);

        expect(channelDataArrays.length).to.equal(2);

        expect(channelDataArrays[0].length).to.equal(0);

        expect(channelDataArrays[1].length).to.equal(0);
    });
});
