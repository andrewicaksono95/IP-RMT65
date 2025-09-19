import request from 'supertest';
import app from '../src/app.js';
import { Fruit } from '../src/models/index.js';
import { resetDb } from './resetDb.js';

describe('Fruits fallback & empty results', () => {
  beforeAll(async () => {
    await resetDb();
    await Fruit.bulkCreate([
      { name: 'Alpha', family: 'Fam1', calories: 50, sugar: 10, protein: 1 },
      { name: 'Beta', family: 'Fam2', calories: 40, sugar: 8, protein: 2 }
    ]);
  });

  test('invalid sort key falls back to name', async () => {
    const res = await request(app).get('/fruits?sort=INVALID&order=DESC');
    expect(res.status).toBe(200);
    // fallback to name DESC so Beta before Alpha
    expect(res.body.rows[0].name).toBe('Beta');
  });

  test('search yields zero results returns empty array', async () => {
    const res = await request(app).get('/fruits?search=NoSuchFruit');
    expect(res.status).toBe(200);
    expect(res.body.count).toBe(0);
    expect(res.body.rows).toEqual([]);
  });
});
