import { createError } from '../../src/utils/createError.js';

describe('createError utility', () => {
  it('should create an Error with status and message', () => {
    const err = createError(404, 'Not found');
    expect(err).toBeInstanceOf(Error);
    expect(err.status).toBe(404);
    expect(err.message).toBe('Not found');
  });

  it('should allow any status code and message', () => {
    const err = createError(500, 'Internal error');
    expect(err.status).toBe(500);
    expect(err.message).toBe('Internal error');
  });
});
