import request from 'supertest';
import app from '../src/app.js';
import '../src/models/index.js';
import { Fruit } from '../src/models/Fruit.js';
import { resetDb } from './resetDb.js';

beforeAll(async () => {
  await resetDb();
  await Fruit.bulkCreate([
    { name: 'Apple', calories: 52, sugar: 10, protein: 0.3, family: 'Rosaceae' },
    { name: 'Apricot', calories: 48, sugar: 9, protein: 1.4, family: 'Rosaceae' },
    { name: 'Banana', calories: 89, sugar: 12, protein: 1.1, family: 'Musaceae' },
    { name: 'Blackberry', calories: 43, sugar: 4.9, protein: 1.4, family: 'Rosaceae' },
  ]);
});

describe('Fruit query behaviors', () => {
  test('search filter (case-insensitive partial)', async () => {
    const res = await request(app).get('/fruits?search=ap');
    expect(res.status).toBe(200);
    const names = res.body.rows.map(r => r.name).sort();
    expect(names).toEqual(expect.arrayContaining(['Apple','Apricot']));
  });

  test('family filter', async () => {
    const res = await request(app).get('/fruits?family=Musaceae');
    expect(res.status).toBe(200);
    expect(res.body.count).toBe(1);
    expect(res.body.rows[0].name).toBe('Banana');
  });

  test('pagination with offset (page 2 simulation)', async () => {
    const res = await request(app).get('/fruits?limit=2&offset=2&sort=name');
    expect(res.status).toBe(200);
    expect(res.body.rows.length).toBe(2);
  });

  test('sort by calories desc', async () => {
    const res = await request(app).get('/fruits?sort=calories&order=DESC');
    expect(res.status).toBe(200);
    const cals = res.body.rows.map(r => r.calories);
    const sorted = [...cals].sort((a,b)=>b-a);
    expect(cals).toEqual(sorted);
  });

  test('invalid sort field falls back to name', async () => {
    const res = await request(app).get('/fruits?sort=unknownfield');
    expect(res.status).toBe(200);
    const names = res.body.rows.map(r => r.name);
    const sorted = [...names].sort((a,b)=> a.localeCompare(b));
    expect(names).toEqual(sorted);
  });
});
