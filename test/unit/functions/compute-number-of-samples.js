import { computeNumberOfSamples } from '../../../src/functions/compute-number-of-samples';

describe('computeNumberOfSamples()', () => {

    let audioTypedArray;

    beforeEach(() => {
        audioTypedArray = [ new Float32Array(18), new Float32Array(4), new Float32Array(16), new Float32Array(12) ];
    });

    it('should sum up the length of all typed arrays', () => {
        expect(computeNumberOfSamples(audioTypedArray)).to.equal(50);
    });

});
