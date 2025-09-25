import { jest } from '@jest/globals';

let authRequired;
let jwt;

jest.unstable_mockModule('jsonwebtoken', () => ({
  default: {
    verify: jest.fn(),
  },
}));

describe('Auth Required Middleware', () => {
  let req, res, next;

  beforeEach(async () => {
    // Dynamically import modules to use mocked versions
    const authModule = await import('../../src/middleware/auth.js');
    authRequired = authModule.authRequired;
    const jwtModule = await import('jsonwebtoken');
    jwt = jwtModule.default;

    req = {
      headers: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
    jwt.verify.mockClear();
  });

  it('should return 401 if no authorization header is present', () => {
    authRequired(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Missing or invalid Authorization header' });
  });

  it('should return 401 if token is invalid', () => {
    req.headers.authorization = 'Bearer invalidtoken';
    jwt.verify.mockImplementation(() => {
      throw new Error('Invalid token');
    });
    authRequired(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Invalid token' });
  });

  it('should set req.user and call next if token is valid', () => {
    req.headers.authorization = 'Bearer validtoken';
    const decodedUser = { id: 1, email: 'test@example.com' };
    jwt.verify.mockReturnValue(decodedUser);
    authRequired(req, res, next);
    expect(req.user).toEqual(decodedUser);
    expect(next).toHaveBeenCalled();
  });

  it('should handle non-Bearer token gracefully', () => {
    req.headers.authorization = 'Basic some-token';
    authRequired(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Missing or invalid Authorization header' });
  });
});
