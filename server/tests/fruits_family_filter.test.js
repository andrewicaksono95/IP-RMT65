import { jest } from '@jest/globals';
import request from 'supertest';
import app from '../src/app.js';
import { Fruit } from '../src/models/Fruit.js';
import { sequelize } from '../src/config/database.js';

describe('GET /fruits?family= filter branch', () => {
  beforeAll(async () => {
    await sequelize.sync();
    await Fruit.create({ name: 'FamFruit', family: 'FamX', order: 'Ord', genus: 'Gen', calories: 1, fat: 0, sugar: 1, carbohydrates: 1, protein: 0 });
  });

  test('returns only fruits in specified family', async () => {
    const res = await request(app).get('/fruits?family=FamX');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.rows)).toBe(true);
    expect(res.body.rows.find(f => f.name === 'FamFruit')).toBeTruthy();
    expect(res.body.rows.every(f => f.family === 'FamX')).toBe(true);
  });
});
