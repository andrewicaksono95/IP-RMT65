import { createError } from '../src/utils/createError.js';

describe('createError util', () => {
  test('creates error with status and message', () => {
    const err = createError(418, 'I am a teapot');
    expect(err).toBeInstanceOf(Error);
    expect(err.message).toBe('I am a teapot');
    expect(err.status).toBe(418);
  });
});
