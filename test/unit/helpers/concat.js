import { concat } from '../../../src/helpers/concat';

describe('concat()', () => {

    it('should "concat" one Uint8Arrays', () => {
        expect(Array.from(concat(Uint8Array, new Uint8Array([ 1, 2 ])))).to.deep.equal([ 1, 2 ]);
    });

    it('should concat two Uint8Arrays', () => {
        expect(Array.from(concat(Uint8Array, new Uint8Array([ 1, 2 ]), new Uint8Array([ 3, 4 ])))).to.deep.equal([ 1, 2, 3, 4 ]);
    });

    it('should concat two Uint8Arrays', () => {
        expect(Array.from(concat(Uint8Array, new Uint8Array([ 1, 2 ]), new Uint8Array([ 3, 4 ]), new Uint8Array([ 5, 6 ])))).to.deep.equal([ 1, 2, 3, 4, 5, 6 ]);
    });

    it('should "concat" one Float64Arrays', () => {
        expect(Array.from(concat(Float64Array, new Float64Array([ 1, 2 ])))).to.deep.equal([ 1, 2 ]);
    });

    it('should concat two Float64Arrays', () => {
        expect(Array.from(concat(Float64Array, new Float64Array([ 1, 2 ]), new Float64Array([ 3, 4 ])))).to.deep.equal([ 1, 2, 3, 4 ]);
    });

    it('should concat two Float64Arrays', () => {
        expect(Array.from(concat(Float64Array, new Float64Array([ 1, 2 ]), new Float64Array([ 3, 4 ]), new Float64Array([ 5, 6 ])))).to.deep.equal([ 1, 2, 3, 4, 5, 6 ]);
    });

});
