import { computeNumberOfSamples } from '../../../src/functions/compute-number-of-samples';

describe('computeNumberOfSamples()', () => {
    let channelDataArray;

    beforeEach(() => {
        channelDataArray = [new Float32Array(18), new Float32Array(4), new Float32Array(16), new Float32Array(12)];
    });

    it('should sum up the length of all typed arrays', () => {
        expect(computeNumberOfSamples(channelDataArray)).to.equal(50);
    });
});
