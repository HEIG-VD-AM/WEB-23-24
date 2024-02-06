import { assert, expect } from 'chai';
import { handleMouseMove } from '../src/inputListener.js';
describe('Input listener', () => {
    it('Moving mouse to same position should not send message twice', () => {
        // TODO Test that, if moving mouse two times in a row so that the two positions belong te the same column, then only one message is sent to move the shape.
        let count = 0;
        const callCounter = (...args) => {
            count++;
        }
        handleMouseMove({offsetX: 0}, callCounter);
        handleMouseMove({offsetX: 0.10}, callCounter);
        handleMouseMove({offsetX: 100}, callCounter);
        handleMouseMove({offsetX: 0}, callCounter);
        handleMouseMove({offsetX: 0}, callCounter);
        expect(count).to.equal(3);
        // assert.fail("Test not implemented")
    });
});