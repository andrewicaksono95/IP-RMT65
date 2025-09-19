import { jest } from '@jest/globals';
import { errorHandler } from '../src/middleware/errorHandler.js';

describe('errorHandler headersSent branch', () => {
  test('calls next immediately when headers already sent', () => {
    const err = new Error('boom');
    const res = { headersSent: true };
    const next = jest.fn();
    errorHandler(err, {}, res, next);
    expect(next).toHaveBeenCalledWith(err);
  });
});
