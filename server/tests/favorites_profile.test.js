import request from 'supertest';
import jwt from 'jsonwebtoken';
import app from '../src/app.js';
import '../src/models/index.js';
import { User } from '../src/models/User.js';
import { Fruit } from '../src/models/Fruit.js';
import { resetDb } from './resetDb.js';

describe('Favorites & Profile', () => {
  let token; let fruitId;
  beforeAll(async () => {
    await resetDb();
    const user = await User.create({ googleSub: 'test-sub', email: 't@example.com', fullName: 'Tester' });
  token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
    const fruit = await Fruit.create({ name: 'Cherry', calories: 50 });
    fruitId = fruit.id;
  });
  it('adds favorite', async () => {
    const res = await request(app).post('/favorites').set('Authorization', `Bearer ${token}`).send({ fruitId });
    expect(res.status).toBe(201);
  });
  it('lists favorites', async () => {
    const res = await request(app).get('/favorites').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
  });
  it('updates profile', async () => {
    const res = await request(app).put('/profile').set('Authorization', `Bearer ${token}`).send({ nickName: 'T' });
    expect(res.status).toBe(200);
    expect(res.body.nickName).toBe('T');
  });
});