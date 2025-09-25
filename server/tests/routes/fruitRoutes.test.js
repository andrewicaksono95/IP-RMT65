
import { jest } from '@jest/globals';
import request from 'supertest';
import express from 'express';

const mockFruitService = {
  listFruits: jest.fn(),
  getFruit: jest.fn(),
};
jest.unstable_mockModule('../../src/services/fruitService.js', () => mockFruitService);
let app;
let fruitRoutes;
beforeAll(async () => {
  fruitRoutes = (await import('../../src/routes/fruitRoutes.js')).default;
  app = express();
  app.use(express.json());
  app.use('/fruits', fruitRoutes);
});

describe('Fruit Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /fruits', () => {
    it('should return fruit list (positive)', async () => {
  mockFruitService.listFruits.mockResolvedValue({ rows: [{ id: 1, name: 'Apple' }], count: 1 });
  const res = await request(app).get('/fruits');
  expect(res.statusCode).toBe(200);
  expect(res.body.rows).toEqual([{ id: 1, name: 'Apple' }]);
    });
    it('should handle forced error (negative)', async () => {
      const res = await request(app).get('/fruits?forceError=true');
      expect(res.statusCode).toBe(500);
  expect(res.body).toEqual({});
    });
    it('should handle service error (negative)', async () => {
  mockFruitService.listFruits.mockRejectedValue(new Error('DB error'));
      const res = await request(app).get('/fruits');
      expect(res.statusCode).toBe(500);
  expect(res.body).toEqual({});
    });
  });

  describe('GET /fruits/:id', () => {
    it('should return fruit by id (positive)', async () => {
  mockFruitService.getFruit.mockResolvedValue({ id: 1, name: 'Apple' });
      const res = await request(app).get('/fruits/1');
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({ id: 1, name: 'Apple' });
    });
    it('should return 404 if not found (negative)', async () => {
  mockFruitService.getFruit.mockResolvedValue(null);
      const res = await request(app).get('/fruits/999');
      expect(res.statusCode).toBe(404);
  expect(res.body).toEqual({ message: 'Not found' });
    });
    it('should handle service error (negative)', async () => {
  mockFruitService.getFruit.mockRejectedValue(new Error('DB error'));
      const res = await request(app).get('/fruits/1');
      expect(res.statusCode).toBe(500);
  expect(res.body).toEqual({});
    });
  });
});
