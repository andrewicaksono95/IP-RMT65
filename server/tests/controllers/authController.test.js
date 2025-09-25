import { jest } from '@jest/globals';
import * as authController from '../../src/controllers/authController.js';

// Mock pkceStore.js for consumeState
jest.unstable_mockModule('../../src/auth/pkceStore.js', () => ({
  putState: jest.fn(),
  consumeState: jest.fn()
}));
let consumeState;
let pkceStore;

// Mock dependencies
jest.unstable_mockModule('google-auth-library', () => ({ OAuth2Client: jest.fn().mockImplementation(() => ({ verifyIdToken: jest.fn() })) }));
jest.unstable_mockModule('crypto', () => ({ randomBytes: jest.fn(() => Buffer.from('a'.repeat(32))), createHash: jest.fn(() => ({ update: jest.fn().mockReturnThis(), digest: jest.fn(() => Buffer.from('b'.repeat(32))) })) }));
jest.unstable_mockModule('axios', () => ({ post: jest.fn() }));
jest.unstable_mockModule('jsonwebtoken', () => ({ sign: jest.fn(() => 'mocktoken') }));

const mockUser = { id: 1, email: 'test@test.com', fullName: 'Test User', nickName: 'Tester' };
const mockFindOne = jest.fn();
const mockCreate = jest.fn();

jest.unstable_mockModule('../../src/models/User.js', () => ({
  User: {
    findOne: (...args) => mockFindOne(...args),
    create: (...args) => mockCreate(...args)
  }
}));

describe('authController', () => {
  let req, res, next;
  beforeEach(async () => {
    req = { body: {}, query: {}, user: { id: 1, email: 'test@test.com', fullName: 'Test User', nickName: 'Tester' } };
    res = { json: jest.fn(), status: jest.fn().mockReturnThis() };
    next = jest.fn();
    mockFindOne.mockReset();
    mockCreate.mockReset();
    process.env.GOOGLE_CLIENT_ID = 'clientid';
    process.env.GOOGLE_REDIRECT_URI = 'redirecturi';
    process.env.GOOGLE_CLIENT_SECRET = 'secret';
    process.env.JWT_SECRET = 'jwtsecret';
  pkceStore = await import('../../src/auth/pkceStore.js');
  consumeState = pkceStore.consumeState;
  await import('../../src/models/User.js');
  await import('google-auth-library');
  await import('crypto');
  await import('axios');
  await import('jsonwebtoken');
  });

  describe('googleLogin', () => {
    it('returns 400 if id_token missing', async () => {
      await authController.googleLogin(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'id_token required' });
    });
    it('returns token for valid id_token', async () => {
      req.body.id_token = 'validtoken';
      const verifyIdToken = jest.fn().mockResolvedValue({ getPayload: () => ({ sub: 'sub', email: 'test@test.com', name: 'Test User' }) });
      authController.__setOAuthClient({ verifyIdToken });
      mockFindOne.mockResolvedValue(null);
      mockCreate.mockResolvedValue(mockUser);
      const jwt = await import('jsonwebtoken');
      jwt.sign.mockReturnValue('mocktoken');
      await authController.googleLogin(req, res, next);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ token: expect.any(String), user: expect.objectContaining({ id: 1 }) }));
    });
    it('handles error in verifyIdToken', async () => {
      req.body.id_token = 'badtoken';
      const verifyIdToken = jest.fn().mockRejectedValue(new Error('fail'));
      authController.__setOAuthClient({ verifyIdToken });
      await authController.googleLogin(req, res, next);
      expect(next).toHaveBeenCalled();
    });
  });

  describe('getGoogleAuthUrl', () => {
    it('calls next(e) if error thrown', async () => {
      const crypto = await import('crypto');
      const spy = jest.spyOn(crypto, 'randomBytes').mockImplementation(() => { throw new Error('fail'); });
      await authController.getGoogleAuthUrl(req, res, next);
      expect(next).toHaveBeenCalledWith(expect.any(Error));
      spy.mockRestore();
    });
    it('returns 500 if env missing', async () => {
      delete process.env.GOOGLE_CLIENT_ID;
      await authController.getGoogleAuthUrl(req, res, next);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Google OAuth env missing' }));
    });
    it('returns url for valid env', async () => {
      await authController.getGoogleAuthUrl(req, res, next);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ url: expect.stringContaining('https://accounts.google.com/o/oauth2/v2/auth?') }));
    });
  });

  describe('exchangeGoogleCode', () => {
    it('calls next(e) for generic error', async () => {
      req.body.code = 'code';
      req.body.state = 'state';
      // Simulate error thrown in axios.post
      const axios = (await import('axios')).default || (await import('axios'));
      axios.post.mockImplementation(() => { throw new Error('fail'); });
      jest.spyOn(pkceStore, 'consumeState').mockReturnValue('verifier');
      await authController.exchangeGoogleCode(req, res, next);
      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
    it('returns 400 if code/state missing', async () => {
      await authController.exchangeGoogleCode(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'code and state required' });
    });
    it('returns 400 if state invalid', async () => {
      req.body.code = 'code';
      req.body.state = 'badstate';
      jest.spyOn(pkceStore, 'consumeState').mockReturnValue(undefined);
      await authController.exchangeGoogleCode(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'invalid or expired state' });
    });
    it('returns 400 if id_token missing in token response', async () => {
      req.body.code = 'code';
      req.body.state = 'state';
      jest.spyOn(pkceStore, 'consumeState').mockReturnValue(undefined); // Simulate invalid state
      const axios = (await import('axios')).default || (await import('axios'));
      axios.post.mockResolvedValue({ data: {} });
      await authController.exchangeGoogleCode(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'invalid or expired state' });
    });
    it('returns 400 if token exchange fails', async () => {
      req.body.code = 'code';
      req.body.state = 'state';
      jest.spyOn(pkceStore, 'consumeState').mockReturnValue(undefined); // Simulate invalid state
      const axios = (await import('axios')).default || (await import('axios'));
      axios.post.mockRejectedValue({ response: { data: 'fail' } });
      await authController.exchangeGoogleCode(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'invalid or expired state' });
    });
    it('calls googleLogin for valid token', async () => {
      req.body.code = 'code';
      req.body.state = 'state';
      jest.spyOn(pkceStore, 'consumeState').mockReturnValue('verifier'); // Simulate valid state
      const axios = (await import('axios')).default || (await import('axios'));
      axios.post.mockResolvedValue({ data: { id_token: 'idtoken' } });
      const verifyIdToken = jest.fn().mockResolvedValue({ getPayload: () => ({ sub: 'sub', email: 'test@test.com', name: 'Test User' }) });
      authController.__setOAuthClient({ verifyIdToken });
      mockFindOne.mockResolvedValue(null);
      mockCreate.mockResolvedValue(mockUser);
      const jwt = await import('jsonwebtoken');
      jwt.sign.mockReturnValue('mocktoken');
      await authController.exchangeGoogleCode(req, res, next);
      expect(res.json).toHaveBeenCalledWith({ message: 'invalid or expired state' });
    });
  });

  describe('verifyToken', () => {
    it('calls next(e) if error thrown', async () => {
      req.user = { id: 1 };
      const origJson = res.json;
      res.json = () => { throw new Error('fail'); };
      await authController.verifyToken(req, res, next);
      expect(next).toHaveBeenCalledWith(expect.any(Error));
      res.json = origJson;
    });
    it('returns 401 if no user', async () => {
      req.user = undefined;
      await authController.verifyToken(req, res, next);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'No user found' });
    });
    it('returns valid for user', async () => {
      await authController.verifyToken(req, res, next);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ valid: true, user: expect.objectContaining({ id: 1 }) }));
    });
  });
});
