
import { jest } from '@jest/globals';
import request from 'supertest';
import express from 'express';

const mockModels = {
  Favorite: {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
  },
  Fruit: {},
};
const mockAuthRequired = (req, res, next) => { req.user = { id: 1 }; next(); };
jest.unstable_mockModule('../../src/models/index.js', () => mockModels);
jest.unstable_mockModule('../../src/middleware/auth.js', () => ({ authRequired: mockAuthRequired }));
let app;
let favoriteRoutes;
beforeAll(async () => {
  favoriteRoutes = (await import('../../src/routes/favoriteRoutes.js')).default;
  app = express();
  app.use(express.json());
  app.use('/favorites', favoriteRoutes);
});

describe('Favorite Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /favorites', () => {
    it('should return favorites (positive)', async () => {
  mockModels.Favorite.findAll.mockResolvedValue([{ id: 1, fruitId: 1, Fruit: { name: 'Apple' } }]);
      const res = await request(app).get('/favorites');
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual([{ id: 1, fruitId: 1, Fruit: { name: 'Apple' } }]);
    });
    it('should handle db error (negative)', async () => {
  mockModels.Favorite.findAll.mockRejectedValue(new Error('DB error'));
      const res = await request(app).get('/favorites');
      expect(res.statusCode).toBe(500);
  expect(res.body).toEqual({});
    });
  });

  describe('POST /favorites', () => {
    it('should add favorite (positive)', async () => {
  mockModels.Favorite.findOne.mockResolvedValue(null);
  mockModels.Favorite.create.mockResolvedValue({ id: 2, fruitId: 2, note: 'Yum' });
      const res = await request(app).post('/favorites').send({ fruitId: 2, note: 'Yum' });
      expect(res.statusCode).toBe(201);
      expect(res.body).toEqual({ id: 2, fruitId: 2, note: 'Yum' });
    });
    it('should not add duplicate (negative)', async () => {
  mockModels.Favorite.findOne.mockResolvedValue({ id: 2, fruitId: 2 });
      const res = await request(app).post('/favorites').send({ fruitId: 2 });
      expect(res.statusCode).toBe(409);
      expect(res.body).toEqual({ message: 'Already favorited' });
    });
    it('should handle db error (negative)', async () => {
  mockModels.Favorite.findOne.mockRejectedValue(new Error('DB error'));
      const res = await request(app).post('/favorites').send({ fruitId: 2 });
      expect(res.statusCode).toBe(500);
  expect(res.body).toEqual({});
    });
  });

  describe('PUT /favorites/:id', () => {
    it('should update favorite (positive)', async () => {
  const fav = { id: 1, note: 'Old', save: jest.fn().mockResolvedValue() };
  mockModels.Favorite.findOne.mockResolvedValue(fav);
      const res = await request(app).put('/favorites/1').send({ note: 'New' });
      expect(res.statusCode).toBe(200);
      expect(res.body.note).toBe('New');
    });
    it('should return 404 if not found (negative)', async () => {
  mockModels.Favorite.findOne.mockResolvedValue(null);
      const res = await request(app).put('/favorites/999').send({ note: 'New' });
      expect(res.statusCode).toBe(404);
      expect(res.body).toEqual({ message: 'Not found' });
    });
    it('should handle db error (negative)', async () => {
  mockModels.Favorite.findOne.mockRejectedValue(new Error('DB error'));
      const res = await request(app).put('/favorites/1').send({ note: 'New' });
      expect(res.statusCode).toBe(500);
  expect(res.body).toEqual({});
    });
  });

  describe('DELETE /favorites/:id', () => {
    it('should delete favorite (positive)', async () => {
  const fav = { id: 1, destroy: jest.fn().mockResolvedValue() };
  mockModels.Favorite.findOne.mockResolvedValue(fav);
      const res = await request(app).delete('/favorites/1');
      expect(res.statusCode).toBe(204);
    });
    it('should return 404 if not found (negative)', async () => {
  mockModels.Favorite.findOne.mockResolvedValue(null);
      const res = await request(app).delete('/favorites/999');
      expect(res.statusCode).toBe(404);
      expect(res.body).toEqual({ message: 'Not found' });
    });
    it('should handle db error (negative)', async () => {
  mockModels.Favorite.findOne.mockRejectedValue(new Error('DB error'));
      const res = await request(app).delete('/favorites/1');
      expect(res.statusCode).toBe(500);
  expect(res.body).toEqual({});
    });
  });
});
