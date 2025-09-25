
import { jest } from '@jest/globals';
import request from 'supertest';
import express from 'express';

const mockAuthController = {
  googleLogin: jest.fn(),
  getGoogleAuthUrl: jest.fn(),
  exchangeGoogleCode: jest.fn(),
  verifyToken: jest.fn(),
};
const mockAuthRequired = (req, res, next) => { req.user = { id: 1 }; next(); };
jest.unstable_mockModule('../../src/middleware/auth.js', () => ({ authRequired: mockAuthRequired }));
jest.unstable_mockModule('../../src/controllers/authController.js', () => mockAuthController);
let app;
let authRoutes;
beforeAll(async () => {
  authRoutes = (await import('../../src/routes/authRoutes.js')).default;
  app = express();
  app.use(express.json());
  app.use('/auth', authRoutes);
});

describe('Auth Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('POST /auth/google (positive)', async () => {
  mockAuthController.googleLogin.mockImplementation((req, res) => res.json({ token: 'jwt', user: { id: 1 } }));
    const res = await request(app).post('/auth/google').send({ id_token: 'valid' });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
  });

  it('POST /auth/google (negative)', async () => {
  mockAuthController.googleLogin.mockImplementation((req, res) => res.status(400).json({ message: 'id_token required' }));
    const res = await request(app).post('/auth/google').send({});
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({ message: 'id_token required' });
  });

  it('GET /auth/google/url (positive)', async () => {
  mockAuthController.getGoogleAuthUrl.mockImplementation((req, res) => res.json({ url: 'https://accounts.google.com' }));
    const res = await request(app).get('/auth/google/url');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('url');
  });

  it('GET /auth/google/url (negative)', async () => {
  mockAuthController.getGoogleAuthUrl.mockImplementation((req, res) => res.status(500).json({ message: 'Google OAuth env missing' }));
    const res = await request(app).get('/auth/google/url');
    expect(res.statusCode).toBe(500);
    expect(res.body).toHaveProperty('message');
  });

  it('POST /auth/google/exchange (positive)', async () => {
  mockAuthController.exchangeGoogleCode.mockImplementation((req, res) => res.json({ token: 'jwt' }));
    const res = await request(app).post('/auth/google/exchange').send({ code: 'valid', state: 'valid' });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
  });

  it('POST /auth/google/exchange (negative)', async () => {
  mockAuthController.exchangeGoogleCode.mockImplementation((req, res) => res.status(400).json({ message: 'code and state required' }));
    const res = await request(app).post('/auth/google/exchange').send({});
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('message');
  });

  it('GET /auth/verify (positive)', async () => {
  mockAuthController.verifyToken.mockImplementation((req, res) => res.json({ valid: true, user: { id: 1 } }));
    const res = await request(app).get('/auth/verify');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('valid', true);
  });

  it('GET /auth/verify (negative)', async () => {
  mockAuthController.verifyToken.mockImplementation((req, res) => res.status(401).json({ message: 'No user found' }));
    const res = await request(app).get('/auth/verify');
    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty('message');
  });
});
