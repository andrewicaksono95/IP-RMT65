
import { jest } from '@jest/globals';
import request from 'supertest';
import express from 'express';

const mockAiController = {
  getSuggestions: jest.fn(),
};
jest.unstable_mockModule('../../src/controllers/aiController.js', () => mockAiController);
let app;
let aiRoutes;
beforeAll(async () => {
  aiRoutes = (await import('../../src/routes/aiRoutes.js')).default;
  app = express();
  app.use(express.json());
  app.use('/ai', aiRoutes);
});

describe('AI Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('GET /ai/suggestions (positive)', async () => {
  mockAiController.getSuggestions.mockImplementation((req, res) => res.json({ suggestions: ['Apple', 'Banana'] }));
    const res = await request(app).get('/ai/suggestions');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('suggestions');
  });

  it('GET /ai/suggestions (negative)', async () => {
  mockAiController.getSuggestions.mockImplementation((req, res) => res.status(500).json({ message: 'AI error' }));
    const res = await request(app).get('/ai/suggestions');
    expect(res.statusCode).toBe(500);
    expect(res.body).toHaveProperty('message');
  });
});
