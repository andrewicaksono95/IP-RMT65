import { jest } from '@jest/globals';
import { validate } from '../../src/middleware/validate.js';
import { z } from 'zod';

describe('Validation Middleware', () => {
  let req, res, next;
  const schema = z.object({
    body: z.object({
      name: z.string(),
    }),
    query: z.object({}),
    params: z.object({}),
  });

  beforeEach(() => {
    req = {
      body: {},
      query: {},
      params: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  it('should call next if validation passes', () => {
    req.body = { name: 'Test' };
    const middleware = validate(schema);
    middleware(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  it('should return 400 if validation fails', () => {
    req.body = {}; // Missing name
    const middleware = validate(schema);
    middleware(req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      message: 'Validation error',
    }));
  });
});
