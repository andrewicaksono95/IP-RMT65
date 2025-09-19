import request from 'supertest';
import app from '../src/app.js';
import '../src/models/index.js';
import { Fruit } from '../src/models/Fruit.js';
import { resetDb } from './resetDb.js';

describe('Fruits', () => {
  beforeAll(async () => {
    await resetDb();
    await Fruit.create({ name: 'Apple', calories: 52 });
  });
  it('lists fruits', async () => {
    const res = await request(app).get('/fruits');
    expect(res.status).toBe(200);
    expect(res.body.count).toBe(1);
  });
  it('gets fruit by id', async () => {
    const resList = await request(app).get('/fruits');
    const id = resList.body.rows[0].id;
    const res = await request(app).get(`/fruits/${id}`);
    expect(res.status).toBe(200);
    expect(res.body.name).toBe('Apple');
  });
});
