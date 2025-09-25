
import { jest } from '@jest/globals';
import request from 'supertest';
import express from 'express';

// ESM-compatible mocking
const mockProfileController = {
  getProfile: jest.fn(),
  updateProfile: jest.fn(),
};
const mockAuthRequired = (req, res, next) => { req.user = { id: 1 }; next(); };

jest.unstable_mockModule('../../src/controllers/profileController.js', () => mockProfileController);
jest.unstable_mockModule('../../src/middleware/auth.js', () => ({ authRequired: mockAuthRequired }));

let app;
let profileRoutes;

beforeAll(async () => {
  profileRoutes = (await import('../../src/routes/profileRoutes.js')).default;
  app = express();
  app.use(express.json());
  app.use('/profile', profileRoutes);
});

describe('Profile Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('GET /profile (positive)', async () => {
    mockProfileController.getProfile.mockImplementation((req, res) => res.json({ id: 1, email: 'test@example.com' }));
    const res = await request(app).get('/profile');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('id', 1);
  });

  it('GET /profile (negative)', async () => {
    mockProfileController.getProfile.mockImplementation((req, res) => res.status(500).json({ message: 'DB error' }));
    const res = await request(app).get('/profile');
    expect(res.statusCode).toBe(500);
    expect(res.body).toHaveProperty('message');
  });

  it('PUT /profile (positive)', async () => {
    mockProfileController.updateProfile.mockImplementation((req, res) => res.json({ id: 1, fullName: 'Updated' }));
    const res = await request(app).put('/profile').send({ fullName: 'Updated' });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('fullName', 'Updated');
  });

  it('PUT /profile (negative)', async () => {
    mockProfileController.updateProfile.mockImplementation((req, res) => res.status(500).json({ message: 'DB error' }));
    const res = await request(app).put('/profile').send({ fullName: 'Updated' });
    expect(res.statusCode).toBe(500);
    expect(res.body).toHaveProperty('message');
  });
});
